import { NgModule } from '@angular/core';
import { CheckoutComBillingAddressFormEventsListener } from './billing-address-form.events.listener';

@NgModule({})
export class CheckoutComEventsModule {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _checkoutComEventsListener: CheckoutComBillingAddressFormEventsListener,
  ) {
    // Intentional empty constructor
  }
}
