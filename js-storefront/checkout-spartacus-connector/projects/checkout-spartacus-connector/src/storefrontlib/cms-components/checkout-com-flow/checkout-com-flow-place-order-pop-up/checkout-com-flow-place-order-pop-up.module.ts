import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { I18nModule } from '@spartacus/core';
import { checkoutComModalConfigProvider } from '../../../../providers/checkout-com-modal-config-provider';
import { CheckoutComFlowModule } from '../checkout-com-flow.module';
import { CheckoutComFlowPlaceOrderPopUpComponent } from './checkout-com-flow-place-order-pop-up.component';

@NgModule({
  declarations: [CheckoutComFlowPlaceOrderPopUpComponent],
  exports: [CheckoutComFlowPlaceOrderPopUpComponent],
  imports: [
    CommonModule,
    I18nModule,
    CheckoutComFlowModule
  ],
  providers: [
    checkoutComModalConfigProvider()
  ]
})
export class CheckoutComFlowPlaceOrderPopUpModule {
}
