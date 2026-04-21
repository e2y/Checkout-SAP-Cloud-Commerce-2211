import { NgModule } from '@angular/core';
import { checkoutComProviders } from '../providers/checkout-com.providers';

@NgModule({
  providers: checkoutComProviders()
})
export class CheckoutComCoreModule {
}