import { Injectable, OnDestroy } from '@angular/core';
import { CheckoutComBillingAddressSameAsDeliveryAddressSetEvent } from '@checkout-core/events/billing-address-form.events';
import { CheckoutComBillingAddressUpdatedEvent } from '@checkout-core/events/billing-address.events';
import { CheckoutComBillingAddressFormService } from '@checkout-services/billing-address-form/checkout-com-billing-address-form.service';
import { CurrencySetEvent, EventService } from '@spartacus/core';
import { merge, Subscription } from 'rxjs';

/**
 * Checkout payment event listener.
 */
@Injectable({
  providedIn: 'root',
})
export class CheckoutComBillingAddressFormEventsListener implements OnDestroy {
  protected subscriptions: Subscription = new Subscription();

  /**
   * Constructor for CheckoutComBillingAddressFormEventsListener.
   * @param {EventService} eventService - The event service used to handle events.
   * @since 6.4.0
   */
  constructor(
    protected eventService: EventService,
    protected checkoutComBillingAddressFormService: CheckoutComBillingAddressFormService
  ) {
    this.onSameAsBillingAddressChange();
    this.onCheckoutComBillingAddressUpdatedEvent();
    this.onCurrencyChangeEvent();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  protected onSameAsBillingAddressChange(): void {
    this.subscriptions.add(
      merge(this.eventService.get(CheckoutComBillingAddressSameAsDeliveryAddressSetEvent)).subscribe({
        next: ({
          billingAddress,
          deliveryAddress
        }: CheckoutComBillingAddressSameAsDeliveryAddressSetEvent): void => {
          if (deliveryAddress === undefined) {
            this.checkoutComBillingAddressFormService.setEditToggleState(false);
          }
          if (billingAddress !== undefined) {
            this.checkoutComBillingAddressFormService.updateDeliveryAddress(billingAddress, deliveryAddress);
          }
        }
      }),
    );
  }

  protected onCheckoutComBillingAddressUpdatedEvent(): void {
    this.subscriptions.add(
      merge(this.eventService.get(CheckoutComBillingAddressUpdatedEvent)).subscribe({
        next: ({
          billingAddress,
          deliveryAddress
        }: CheckoutComBillingAddressUpdatedEvent): void => {
          this.checkoutComBillingAddressFormService.setBillingAddress(billingAddress, deliveryAddress);
        }
      }),
    );
  }

  protected onCurrencyChangeEvent(): void {
    this.subscriptions.add(
      merge(this.eventService.get(CurrencySetEvent)).subscribe({
        next: (): void => {
          this.checkoutComBillingAddressFormService.setEditToggleState(false);
        }
      }),
    );
  }
}
