/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NgModule } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';
import { CheckoutComCoreModule } from '../core/checkout-com-core.module';
import { CHECKOUT_COM_FEATURE } from '../core/facades';
import { CheckoutComOccModule } from '../core/occ';

@NgModule({
  imports: [
    CheckoutComOccModule,
    CheckoutComCoreModule
  ],
  providers: [
    provideConfig({
      featureModules: {
        [CHECKOUT_COM_FEATURE]: {
          // eslint-disable-next-line @typescript-eslint/typedef
          module: () => import('../storefrontlib/cms-components/checkout-com-components.module').then(m => m.CheckoutComComponentsModule),
          cmsComponents: [
            'CheckoutProgress',
            'CheckoutProgressMobileBottom',
            'CheckoutProgressMobileTop',
            'CheckoutPaymentDetails',
            'CheckoutOrderSummary',
            'CheckoutPlaceOrder',
            'CheckoutReviewPayment',
            'CheckoutReviewShipping',
            'OrderConfirmationThankMessageComponent',
            'ReplenishmentConfirmationMessageComponent',
            'OrderDetailItemsComponent',
            'OrderConfirmationItemsComponent',
            'ReplenishmentConfirmationItemsComponent',
            'OrderConfirmationTotalsComponent',
            'ReplenishmentConfirmationTotalsComponent',
            'OrderConfirmationOverviewComponent',
            'ReplenishmentConfirmationOverviewComponent',
            'OrderConfirmationShippingComponent',
            'OrderConfirmationBillingComponent',
            'OrderConfirmationContinueButtonComponent',
            'AccountPaymentDetailsComponent',
            'AccountOrderDetailsItemsComponent',
            'AccountOrderDetailsOverviewComponent',
            'AccountOrderDetailsSimpleOverviewComponent',
            'AccountOrderDetailsGroupedItemsComponent',
            'AccountOrderDetailsTotalsComponent',
          ],
        }
      }
    } as CmsConfig)
  ]
})
export class CheckoutComFeatureModule {
}
