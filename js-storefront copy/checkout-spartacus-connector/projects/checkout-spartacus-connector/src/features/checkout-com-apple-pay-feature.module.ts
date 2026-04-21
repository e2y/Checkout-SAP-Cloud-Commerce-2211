/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { CheckoutComApplepayCoreModule } from '../core/checkout-com-applepay-core.module';
import { CheckoutComOccApplePayModule } from '../core/occ/checkout-com-occ-apple-pay.module';

@NgModule({
  imports: [
    CheckoutComOccApplePayModule,
    CheckoutComApplepayCoreModule
  ],
})
export class CheckoutComApplePayFeatureModule {
}
