import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule, SpinnerModule } from '@spartacus/storefront';
import { CheckoutComBillingAddressFormModule } from '../../checkout-com-billing-address-form/checkout-com-billing-address-form.module';
import { CheckoutComApmIdealComponent } from './checkout-com-apm-ideal.component';

@NgModule({
  declarations: [CheckoutComApmIdealComponent],
  exports: [
    CheckoutComApmIdealComponent
  ],
  imports: [
    CommonModule,
    SpinnerModule,
    I18nModule,
    ReactiveFormsModule,
    FormErrorsModule,
    CheckoutComBillingAddressFormModule
  ]
})
export class CheckoutComApmIdealModule {
}
