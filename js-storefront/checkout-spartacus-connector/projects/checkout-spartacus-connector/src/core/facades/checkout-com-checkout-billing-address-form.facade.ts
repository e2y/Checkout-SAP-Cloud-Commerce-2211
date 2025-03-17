import { Injectable } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Address, facadeFactory, QueryState } from '@spartacus/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CHECKOUT_COM_CHECKOUT_BILLING_ADDRESS_FORM } from './feature-name';

@Injectable({
  providedIn: 'root',
  useFactory: (): CheckoutComBillingAddressFormFacade =>
    facadeFactory({
      facade: CheckoutComBillingAddressFormFacade,
      feature: CHECKOUT_COM_CHECKOUT_BILLING_ADDRESS_FORM,
      methods: [
        'setDeliveryAddressAsBillingAddress',
        'setDeliveryAddressAsBillingAddress',
        'isBillingAddressSameAsDeliveryAddress',
        'isBillingAddressFormValid',
        'markAllAsTouched',
        'getBillingAddress',
        'getSameAsDeliveryAddress',
        'setSameAsDeliveryAddress',
        'isEditModeEnabled',
        'toggleEditMode',
        'setEditToggleState',
        'requestBillingAddress',
        'setBillingAddress',
        'isBillingAddressSameAsDeliveryAddress',
        'updateDeliveryAddress',
      ],
    }),
})
export abstract class CheckoutComBillingAddressFormFacade {

  /**
   * Gets the billing address form.
   *
   * @returns {UntypedFormGroup} The billing address form.
   */
  abstract getBillingAddressForm(): UntypedFormGroup;

  /**
   * Sets the delivery address as the billing address.
   *
   * @param {Address | undefined} address - The address to set as the billing address.
   */
  abstract setDeliveryAddressAsBillingAddress(address: Address | undefined): void;

  /**
   * Checks if the billing address form is valid.
   *
   * @returns {boolean} True if the billing address form is valid, false otherwise.
   */
  abstract isBillingAddressFormValid(): boolean;

  /**
   * Marks all fields in the billing address form as touched.
   */
  abstract markAllAsTouched(): void;

  /**
   * Gets the billing address.
   *
   * @returns {Address} The billing address.
   */
  abstract getBillingAddress(): Address;

  /**
   * Gets the current state of the "same as delivery address" flag.
   *
   * @returns {BehaviorSubject<boolean>} An observable containing the current state.
   */
  abstract getSameAsDeliveryAddress(): BehaviorSubject<boolean>

  /**
   * Sets the "same as delivery address" flag to the specified value and updates the delivery address.
   *
   * @param {boolean} sameAsDeliveryAddress - The new value for the "same as delivery address" flag.
   * @param {Address} deliveryAddress - The delivery address to set.
   */
  abstract setSameAsDeliveryAddress(sameAsDeliveryAddress: boolean, deliveryAddress: Address): void

  /**
   * Checks if the edit mode is enabled.
   *
   * @returns {Observable<boolean>} An observable indicating whether the edit mode is enabled.
   */
  abstract isEditModeEnabled(): Observable<boolean>

  abstract isEditModeEnabledValue(): boolean;

  /**
   * Toggle the state (switch between true and false)
   */
  abstract toggleEditMode(): void

  /**
   * Set a specific value (true or false)
   */
  abstract setEditToggleState(state: boolean): void

  /**
   * Requests the billing address for the specified user and cart.
   * @returns {Observable<QueryState<Address>>;} The billing address associated with the specified user and cart.
   */
  abstract requestBillingAddress(): Observable<QueryState<Address>>;

  /**
   * Sets the billing address and updates the delivery address.
   *
   * @param {Address} billingAddress - The billing address to set.
   * @param {Address} deliveryAddress - The delivery address to update.
   */
  abstract setBillingAddress(billingAddress: Address, deliveryAddress: Address): void;

  /**
   * Checks if the billing address is the same as the delivery address.
   *
   * @returns {boolean} True if the billing address is the same as the delivery address, false otherwise.
   */
  abstract isBillingAddressSameAsDeliveryAddress(): boolean;

  /**
   * Updates the delivery address.
   *
   * @param {Address} address - The new delivery address.
   * @param {Address} deliveryAddress - The current delivery address.
   */
  abstract updateDeliveryAddress(address: Address, deliveryAddress: Address): void;
}
