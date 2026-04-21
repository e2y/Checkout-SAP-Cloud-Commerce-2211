import { NgModule } from '@angular/core';
import { checkoutComGooglePayProviders } from '../providers/checkout-com-google-pay.providers';

@NgModule({
  providers: checkoutComGooglePayProviders()
})
export class CheckoutComGooglePayCoreModule {
}