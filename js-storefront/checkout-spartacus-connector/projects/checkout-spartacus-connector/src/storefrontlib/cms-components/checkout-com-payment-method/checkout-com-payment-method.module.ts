import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutComOccModule } from '@checkout-core/occ/checkout-com-occ.module';
import { CheckoutComApmModule } from '@checkout-components/checkout-com-apm-component/checkout-com-apm.module';
import { CheckoutComFramesFormModule } from '@checkout-components/checkout-com-frames-form/checkout-com-frames-form.module';
import { CheckoutComPaymentFormModule } from '@checkout-components/checkout-com-payment-form/checkout-com-payment-form.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { CmsConfig, ConfigModule, I18nModule } from '@spartacus/core';
import { CardModule, FormErrorsModule, IconModule, SpinnerModule } from '@spartacus/storefront';
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
    CheckoutComApmModule
  ]
})
export class CheckoutComPaymentMethodModule {
}
