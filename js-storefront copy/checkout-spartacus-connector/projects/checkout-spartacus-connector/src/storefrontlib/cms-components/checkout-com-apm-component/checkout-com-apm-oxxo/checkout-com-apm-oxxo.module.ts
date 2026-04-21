import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';
import { CheckoutComBillingAddressFormModule } from '../../checkout-com-billing-address-form/checkout-com-billing-address-form.module';
import { CheckoutComApmOxxoComponent } from './checkout-com-apm-oxxo.component';

@NgModule({
  declarations: [CheckoutComApmOxxoComponent],
  imports: [
    CommonModule,
    I18nModule,
    CheckoutComBillingAddressFormModule,
    FormErrorsModule,
    ReactiveFormsModule
  ],
  exports: [CheckoutComApmOxxoComponent]
})
export class CheckoutComApmOxxoModule {
}
