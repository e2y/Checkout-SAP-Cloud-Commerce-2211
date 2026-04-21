import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { SpinnerModule } from '@spartacus/storefront';
import { NgxPlaidLinkModule } from 'ngx-plaid-link';
import { checkoutComModalConfigProvider } from '../../../../providers/checkout-com-modal-config-provider';
import { CheckoutComBillingAddressFormModule } from '../../checkout-com-billing-address-form/checkout-com-billing-address-form.module';
import { CheckoutComApmAchAccountListModalComponent } from './checkout-com-apm-ach-account-list-modal/checkout-com-apm-ach-account-list-modal.component';
import { CheckoutComApmAchConsentsComponent } from './checkout-com-apm-ach-consents/checkout-com-apm-ach-consents.component';
import { CheckoutComApmAchComponent } from './checkout-com-apm-ach.component';

@NgModule({
  declarations: [
    CheckoutComApmAchComponent,
    CheckoutComApmAchConsentsComponent,
    CheckoutComApmAchAccountListModalComponent
  ],
  exports: [
    CheckoutComApmAchComponent
  ],
  imports: [
    CommonModule,
    CheckoutComBillingAddressFormModule,
    NgxPlaidLinkModule,
    I18nModule,
    SpinnerModule,
    ReactiveFormsModule
  ],
  providers: [
    checkoutComModalConfigProvider()
  ]
})
export class CheckoutComApmAchModule {
}
