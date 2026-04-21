import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckoutComCoreModule } from '../../../core/checkout-com-core.module';
import { CheckoutComOccModule } from '../../../core/occ/checkout-com-occ.module';
import { CheckoutComApplePayFeatureModule } from '../../../features/checkout-com-apple-pay-feature.module';
import { CheckoutComGooglePayFeatureModule } from '../../../features/checkout-com-google-pay-feature.module';
import { CheckoutComExpressApplepayComponent } from './checkout-com-express-applepay/checkout-com-express-applepay.component';
import { CheckoutComExpressGooglepayComponent } from './checkout-com-express-googlepay/checkout-com-express-googlepay.component';

@NgModule({
  declarations: [
    CheckoutComExpressApplepayComponent,
    CheckoutComExpressGooglepayComponent
  ],
  imports: [
    CommonModule,
    CheckoutComOccModule,
    CheckoutComCoreModule,
    CheckoutComApplePayFeatureModule,
    CheckoutComGooglePayFeatureModule
  ],
  exports: [
    CheckoutComExpressApplepayComponent,
    CheckoutComExpressGooglepayComponent
  ]
})
export class CheckoutComExpressButtonsModule {
}
