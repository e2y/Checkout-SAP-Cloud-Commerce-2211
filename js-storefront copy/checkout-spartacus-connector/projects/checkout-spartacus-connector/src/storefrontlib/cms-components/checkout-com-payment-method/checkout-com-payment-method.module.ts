import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CmsConfig, ConfigModule, I18nModule } from '@spartacus/core';
import { CardModule, FormErrorsModule, IconModule, SpinnerModule } from '@spartacus/storefront';
import { CheckoutComOccModule } from '../../../core/occ/checkout-com-occ.module';
import { CheckoutComApmModule } from '../checkout-com-apm-component/checkout-com-apm.module';
import { CheckoutComBillingAddressFormModule } from '../checkout-com-billing-address-form/checkout-com-billing-address-form.module';
import { CheckoutComFramesFormModule } from '../checkout-com-frames-form/checkout-com-frames-form.module';
import { CheckoutComPaymentFormModule } from '../checkout-com-payment-form/checkout-com-payment-form.module';
import { CheckoutComPaymentMethodComponent } from './checkout-com-payment-method.component';

@NgModule({
  declarations: [CheckoutComPaymentMethodComponent],
  exports: [CheckoutComPaymentMethodComponent],
  imports: [
    CommonModule,
    ConfigModule.withConfig({
      cmsComponents: {
        CheckoutPaymentDetails: {
          component: CheckoutComPaymentMethodComponent
        }
      }
    } as CmsConfig),
    CheckoutComOccModule,
    CheckoutComFramesFormModule,
    CheckoutComPaymentFormModule,
    ReactiveFormsModule,
    NgSelectModule,
    FormErrorsModule,
    I18nModule,
    IconModule,
    CardModule,
    SpinnerModule,
    CheckoutComApmModule,
    CheckoutComBillingAddressFormModule
  ]
})
export class CheckoutComPaymentMethodModule {
}
