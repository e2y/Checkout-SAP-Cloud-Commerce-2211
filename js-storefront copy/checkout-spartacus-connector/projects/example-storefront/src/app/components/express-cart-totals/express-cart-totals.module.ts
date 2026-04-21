import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckoutComExpressButtonsModule } from '@checkout.com/checkout-spartacus-connector';
import { CartCouponModule, CartSharedModule } from '@spartacus/cart/base/components';
import { FeaturesConfigModule, I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { ProgressButtonModule } from '@spartacus/storefront';
import { ExpressCartTotalsComponent } from './express-cart-totals.component';

@NgModule({
  declarations: [
    ExpressCartTotalsComponent
  ],
  exports: [
    ExpressCartTotalsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UrlModule,
    CartSharedModule,
    I18nModule,
    CartCouponModule,
    FeaturesConfigModule,
    ProgressButtonModule,
    CheckoutComExpressButtonsModule,
  ],
  providers: [
    provideConfig({
      cmsComponents: {
        CartProceedToCheckoutComponent: {
          component: ExpressCartTotalsComponent,
        },
      },
    }),
  ],
})
export class ExpressCartTotalsModule {
}
