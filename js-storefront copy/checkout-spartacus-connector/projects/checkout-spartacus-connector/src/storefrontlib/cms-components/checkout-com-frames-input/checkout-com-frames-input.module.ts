import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { I18nModule } from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { CheckoutComTooltipDirectiveModule } from '../../../core/directives/checkout-com-tooltip-directive.module';
import { CheckoutComTooltipContainerModule } from '../checkout-com-tooltip-container/checkout-com-tooltip-container.module';
import { CheckoutComFramesInputComponent } from './checkout-com-frames-input.component';

@NgModule({
  declarations: [CheckoutComFramesInputComponent],
  exports: [
    CheckoutComFramesInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    I18nModule,
    IconModule,
    CheckoutComTooltipContainerModule,
    CheckoutComTooltipDirectiveModule
  ]
})
export class CheckoutComFramesInputModule {
}
