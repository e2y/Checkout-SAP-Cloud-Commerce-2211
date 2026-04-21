import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerModule } from '@spartacus/storefront';
import { CheckoutComFlowComponent } from './checkout-com-flow.component';

@NgModule({
  declarations: [CheckoutComFlowComponent],
  exports: [CheckoutComFlowComponent],
  imports: [
    CommonModule,
    SpinnerModule
  ]
})
export class CheckoutComFlowModule {
}
