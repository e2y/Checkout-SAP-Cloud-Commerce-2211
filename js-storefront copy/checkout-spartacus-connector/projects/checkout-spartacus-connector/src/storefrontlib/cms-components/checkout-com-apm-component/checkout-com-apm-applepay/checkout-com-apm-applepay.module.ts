import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckoutComApplePayFeatureModule } from '../../../../features/checkout-com-apple-pay-feature.module';
import { CheckoutComApmApplepayComponent } from './checkout-com-apm-applepay.component';

@NgModule({
  declarations: [CheckoutComApmApplepayComponent],
  exports: [
    CheckoutComApmApplepayComponent
  ],
  imports: [
    CommonModule,
    CheckoutComApplePayFeatureModule,
  ],
})
export class CheckoutComApmApplepayModule {
}
