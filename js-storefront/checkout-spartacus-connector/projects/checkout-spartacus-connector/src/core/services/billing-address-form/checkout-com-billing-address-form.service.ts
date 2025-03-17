import { inject, Injectable } from '@angular/core';
import { CheckoutComConnector } from '@checkout-core/connectors/checkout-com/checkout-com.connector';
import { CheckoutComBillingAddressSameAsDeliveryAddressSetEvent } from '@checkout-core/events/billing-address-form.events';
import { CheckoutComBillingAddressCreatedEvent, CheckoutComBillingAddressUpdatedEvent } from '@checkout-core/events/billing-address.events';
import { CheckoutComBillingAddressFormFacade } from '@checkout-facades/checkout-com-checkout-billing-address-form.facade';
import { getUserIdCartId } from '@checkout-shared/get-user-cart-id';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { CheckoutBillingAddressFormService } from '@spartacus/checkout/base/components';
import { CheckoutDeliveryAddressSetEvent, CheckoutPaymentDetailsCreatedEvent, CheckoutPaymentDetailsSetEvent } from '@spartacus/checkout/base/root';
import {
  Address,
  Command,
  CommandService,
  CommandStrategy,
  EventService,
  LoggerService,
  LoginEvent,
  LogoutEvent,
  Query,
  QueryService,
  QueryState, Region,
  UserIdService
} from '@spartacus/core';
import { OrderPlacedEvent } from '@spartacus/order/root';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CheckoutComBillingAddressFormService extends CheckoutBillingAddressFormService implements CheckoutComBillingAddressFormFacade {
  billingAddress$: BehaviorSubject<Address> = new BehaviorSubject<Address>(null);
  editModeStatus$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  protected checkoutComConnector: CheckoutComConnector = inject(CheckoutComConnector);
  protected userIdService: UserIdService = inject(UserIdService);
  protected activeCartFacade: ActiveCartFacade = inject(ActiveCartFacade);
  protected queryService: QueryService = inject(QueryService);
  protected commandService: CommandService = inject(CommandService);
  protected eventService: EventService = inject(EventService);
  protected logger: LoggerService = inject(LoggerService);

  /**
   * Query to request the billing address.
   *
   * This query uses the `QueryService` to create a query that requests the billing address
   * for the current user and cart. It sets the billing address upon successful retrieval
   * and logs any errors. The query reloads on specific events and resets on others.
   * Function to execute the query.
   *
   * @returns An observable that emits the requested billing address.
   * @since 2211.32.1
   */
  protected requestBillingAddress$: Query<Address> = this.queryService.create<Address>(
    (): Observable<Address> => this.checkoutPreconditions().pipe(
      switchMap(([userId, cartId]: [string, string]): Observable<Address> =>
        this.checkoutComConnector.requestBillingAddress(userId, cartId).pipe(
          tap((billingAddress: Address): void => {
            this.setBillingAddress(billingAddress);
          }),
        )
      ),
    ),
    {
      reloadOn: [
        CheckoutPaymentDetailsCreatedEvent,
        CheckoutPaymentDetailsSetEvent,
        CheckoutDeliveryAddressSetEvent,
        CheckoutComBillingAddressCreatedEvent,
        CheckoutComBillingAddressUpdatedEvent
      ],
      resetOn: [OrderPlacedEvent, LogoutEvent, LoginEvent],
    }
  );

  /**
   * Command to update the delivery address.
   *
   * This command uses the `CommandService` to create a command that updates the delivery address
   * for the current user and cart. It dispatches an event upon successful update and logs any errors.
   * Function to execute the command.
   *
   * @param params - The parameters for the command.
   * @param params.addressId - The ID of the address to update.
   * @param params.deliveryAddress - The new delivery address.
   * @returns An observable that emits the updated address.
   * @since 2211.32.1
   */
  protected setDeliveryAddressAsBillingAddressCommand: Command<{ addressId: string, deliveryAddress: Address }, Address> =
    this.commandService.create<{ addressId: string, deliveryAddress: Address }, Address>(
      ({
        addressId,
        deliveryAddress
      }: { addressId: string, deliveryAddress: Address }): Observable<Address> =>
        this.checkoutPreconditions().pipe(
          switchMap(([userId, cartId]: [string, string]): Observable<Address> =>
            this.checkoutComConnector.setDeliveryAddressAsBillingAddress(userId, cartId, addressId).pipe(
              tap((address: Address): void => {
                this.eventService.dispatch({
                  billingAddress: address,
                  deliveryAddress: deliveryAddress,
                }, CheckoutComBillingAddressUpdatedEvent);
              }),
            )
          )
        ),
      {
        strategy: CommandStrategy.CancelPrevious,
      }
    );

  private _sameAsDeliveryAddress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  /**
   * Retrieves the billing address.
   *
   * If the billing address is the same as the delivery address, it returns the billing address.
   * Otherwise, it returns the value from the billing address BehaviorSubject or undefined if not set.
   *
   * @returns The billing address or undefined if not set.
   * @since 2211.32.1
   */
  override getBillingAddress(): Address {
    if (this.billingAddress) {
      // billing address same as delivery address
      return this.billingAddress;
    } else {
      // billing address and delivery address are different
      return this.billingAddress$.value || undefined;
    }
  }

  public compareAddresses(billingAddress: Address, deliveryAddress: Address): boolean {
    if (!billingAddress || !deliveryAddress) return false;

    if (billingAddress?.id === deliveryAddress?.id) return true;

    return Object.keys(billingAddress).every((key: string): boolean => {
      if (!(key in deliveryAddress)) return false;

      if (
        key === 'region' &&
        typeof billingAddress[key] === 'object' &&
        typeof deliveryAddress[key] === 'object'
      ) {
        const { isocode, isocodeShort }: Region = billingAddress[key];
        const { isocode: iso2, isocodeShort: isoShort2 }: Region = deliveryAddress[key];
        return isocode === iso2 ||
               isocode === isoShort2 ||
               isocodeShort === iso2 ||
               isocodeShort === isoShort2;
      }

      return billingAddress[key] === deliveryAddress[key]; // Compare other properties normally
    });
  }

  /**
   * Retrieves the current state of whether the billing address is the same as the delivery address.
   *
   * @returns A BehaviorSubject that emits a boolean indicating if the billing address is the same as the delivery address.
   * @since 2211.32.1
   */
  public getSameAsDeliveryAddress(): BehaviorSubject<boolean> {
    return this._sameAsDeliveryAddress;
  }

  /**
   * Sets the state of whether the billing address is the same as the delivery address.
   *
   * Updates the `_sameAsDeliveryAddress` BehaviorSubject with the provided value.
   * If the value is true, it dispatches an event with the provided delivery address.
   *
   * @param value - A boolean indicating if the billing address is the same as the delivery address.
   * @param deliveryAddress - The delivery address to be used if the billing address is the same as the delivery address.
   * @since 2211.32.1
   */
  public setSameAsDeliveryAddress(value: boolean, deliveryAddress: Address): void {
    this._sameAsDeliveryAddress.next(value);
    if (value === true) {
      this.eventService.dispatch({
        billingAddress: deliveryAddress,
        deliveryAddress: undefined
      }, CheckoutComBillingAddressSameAsDeliveryAddressSetEvent);
    }
  }

  /**
   * Get the current toggle state as an observable
   */
  public isEditModeEnabled(): Observable<boolean> {
    return this.editModeStatus$.asObservable();
  }

  /**
   * Get the current toggle state as an observable
   */
  public isEditModeEnabledValue(): boolean {
    return this.editModeStatus$.value;
  }

  /**
   * Toggle the state (switch between true and false)
   */
  public toggleEditMode(): void {
    this.editModeStatus$.next(!this.editModeStatus$.value);
  }

  /**
   * Set a specific value (true or false)
   */
  public setEditToggleState(state: boolean): void {
    this.editModeStatus$.next(state);
  }

  /**
   * Sets the billing address and optionally the delivery address.
   *
   * Updates the billing address BehaviorSubject with the provided billing address.
   * If a delivery address is provided, it sets the delivery address as the billing address.
   *
   * @param billingAddress - The billing address to be set.
   * @param deliveryAddress - The delivery address to be set as the billing address (optional).
   * @since 2211.32.1
   */
  public setBillingAddress(billingAddress: Address, deliveryAddress: Address = undefined): void {
    this.setDeliveryAddressAsBillingAddress(deliveryAddress);
    this.billingAddress$.next(billingAddress);
    this.setSameAsDeliveryAddress(this.isBillingAddressSameAsDeliveryAddress(), deliveryAddress);
    this.getBillingAddressForm().patchValue(billingAddress);
  }

  /**
   * Checks if the billing address is the same as the delivery address.
   *
   * @returns A boolean indicating if the billing address is the same as the delivery address.
   * @since 2211.32.1
   */
  public override isBillingAddressSameAsDeliveryAddress(): boolean {
    return this._sameAsDeliveryAddress.value;
  }

  /**
   * Updates the delivery address.
   *
   * Executes the `updateDeliveryAddressCommand` with the provided address and delivery address.
   * Subscribes to the command's observable to ensure the command is executed.
   *
   * @param address - The address to be updated.
   * @param deliveryAddress - The new delivery address.
   * @since 2211.32.1
   */
  public updateDeliveryAddress(address: Address, deliveryAddress: Address): void {
    this.setDeliveryAddressAsBillingAddressCommand.execute({
      addressId: address.id,
      deliveryAddress
    }).subscribe();
  }

  /**
   * Requests the billing address.
   *
   * This method returns an observable that emits the current state of the billing address query.
   *
   * @returns An observable that emits the current state of the billing address query.
   * @since 2211.32.1
   */
  public requestBillingAddress(): Observable<QueryState<Address>> {
    return this.requestBillingAddress$.getState();
  }

  /**
   * Retrieves the user ID and cart ID.
   *
   * This method uses the `getUserIdCartId` function to get the user ID and cart ID
   * from the `UserIdService` and `ActiveCartFacade`. It maps the result to a tuple
   * containing the user ID and cart ID.
   *
   * @returns An observable that emits a tuple containing the user ID and cart ID.
   * @since 2211.32.1
   */
  protected checkoutPreconditions(): Observable<[string, string]> {
    return getUserIdCartId(this.userIdService, this.activeCartFacade).pipe(
      map(({
        userId,
        cartId
      }: { userId: string, cartId: string }): [string, string] => [userId, cartId])
    );
  }

}
