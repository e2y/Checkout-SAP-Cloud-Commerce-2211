import { NgModule } from '@angular/core';
import { checkoutComApplePayProviders } from '../providers/checkout-com-apple-pay.providers';

@NgModule({
  providers: checkoutComApplePayProviders()
})
export class CheckoutComApplepayCoreModule {
}