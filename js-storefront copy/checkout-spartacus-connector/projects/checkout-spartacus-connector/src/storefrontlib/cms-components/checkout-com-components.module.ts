import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OutletModule } from '@spartacus/storefront';
import { CheckoutComEventsModule } from '../../core/events/checkout-com-events.module';
import { CheckoutComOccModule } from '../../core/occ/checkout-com-occ.module';
import { CheckoutComApmModule } from './checkout-com-apm-component/checkout-com-apm.module';
import { CheckoutComCartSharedModule } from './checkout-com-cart-shared/checkout-com-cart-shared.module';
import { CheckoutComCheckoutOrderSummaryModule } from './checkout-com-checkout-order-summary/checkout-com-checkout-order-summary.module';
import {
  CheckoutComCheckoutProgressMobileBottomModule,
  CheckoutComCheckoutProgressMobileTopModule,
  CheckoutComCheckoutProgressModule
} from './checkout-com-checkout-progress-component';
import { CheckoutComCheckoutReviewPaymentModule } from './checkout-com-checkout-review-payment/checkout-com-checkout-review-payment.module';
import { CheckoutComCheckoutReviewShippingModule } from './checkout-com-checkout-review-shipping/checkout-com-checkout-review-shipping.module';
import { CheckoutComPaymentFormModule } from './checkout-com-payment-form/checkout-com-payment-form.module';
import { CheckoutComPaymentMethodModule } from './checkout-com-payment-method/checkout-com-payment-method.module';
import { CheckoutComPaymentMethodsModule } from './checkout-com-payment-methods/checkout-com-payment-methods.module';
import { CheckoutComPlaceOrderModule } from './checkout-com-place-order/checkout-com-place-order.module';
import { CheckoutComOrderConfirmationModule } from './order-confirmation/checkout-com-order-confirmation.module';
import { CheckoutComOrderDetailsModule } from './order-details/checkout-com-order-details.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OutletModule.forChild(),
    CheckoutComOccModule,
    CheckoutComApmModule,
    CheckoutComPaymentFormModule,
    CheckoutComPaymentMethodModule,
    CheckoutComPaymentMethodsModule,
    CheckoutComCartSharedModule,
    CheckoutComOrderDetailsModule,
    CheckoutComCheckoutOrderSummaryModule,
    CheckoutComCheckoutReviewShippingModule,
    CheckoutComCheckoutReviewPaymentModule,
    CheckoutComPlaceOrderModule,
    CheckoutComOrderConfirmationModule,
    CheckoutComEventsModule,
    CheckoutComCheckoutProgressModule,
    CheckoutComCheckoutProgressMobileBottomModule,
    CheckoutComCheckoutProgressMobileTopModule
  ],
})

export class CheckoutComComponentsModule {
}
