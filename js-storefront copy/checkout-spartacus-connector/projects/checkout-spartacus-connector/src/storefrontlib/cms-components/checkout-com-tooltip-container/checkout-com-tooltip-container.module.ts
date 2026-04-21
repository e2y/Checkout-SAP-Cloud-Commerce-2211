import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckoutComTooltipContainerComponent } from './checkout-com-tooltip-container.component';

@NgModule({
  declarations: [CheckoutComTooltipContainerComponent],
  exports: [CheckoutComTooltipContainerComponent],
  imports: [
    CommonModule
  ]
})
export class CheckoutComTooltipContainerModule {
}
