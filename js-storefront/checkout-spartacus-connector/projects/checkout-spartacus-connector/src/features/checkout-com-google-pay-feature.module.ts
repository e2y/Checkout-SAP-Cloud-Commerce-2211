/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { CheckoutComGooglePayCoreModule } from '../core/checkout-com-google-pay-core.module';
import { CheckoutComOccGooglePayModule } from '../core/occ/checkout-com-occ-google-pay.module';

@NgModule({
  imports: [
    CheckoutComOccGooglePayModule,
    CheckoutComGooglePayCoreModule
  ],
})
export class CheckoutComGooglePayFeatureModule {
}
