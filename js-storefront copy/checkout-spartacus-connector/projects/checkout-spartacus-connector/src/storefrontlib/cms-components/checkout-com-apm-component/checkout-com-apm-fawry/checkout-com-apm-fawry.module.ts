import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComBillingAddressFormModule } from '../../checkout-com-billing-address-form/checkout-com-billing-address-form.module';
import { CheckoutComApmFawryComponent } from './checkout-com-apm-fawry.component';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { FormErrorsModule } from '@spartacus/storefront';

@NgModule({
  declarations: [CheckoutComApmFawryComponent],
  exports: [CheckoutComApmFawryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I18nModule,
    FormErrorsModule,
    CheckoutComBillingAddressFormModule
  ]
})
export class CheckoutComApmFawryModule { }
