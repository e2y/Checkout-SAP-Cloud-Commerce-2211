import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckoutComGooglePayFeatureModule } from '../../../../features/checkout-com-google-pay-feature.module';
import { CheckoutComBillingAddressFormModule } from '../../checkout-com-billing-address-form/checkout-com-billing-address-form.module';
import { CheckoutComApmGooglepayComponent } from './checkout-com-apm-googlepay.component';

@NgModule({
  declarations: [CheckoutComApmGooglepayComponent],
  exports: [
    CheckoutComApmGooglepayComponent
  ],
  imports: [
    CommonModule,
    CheckoutComBillingAddressFormModule,
    CheckoutComGooglePayFeatureModule,
  ]
})
export class CheckoutComApmGooglepayModule {
}
