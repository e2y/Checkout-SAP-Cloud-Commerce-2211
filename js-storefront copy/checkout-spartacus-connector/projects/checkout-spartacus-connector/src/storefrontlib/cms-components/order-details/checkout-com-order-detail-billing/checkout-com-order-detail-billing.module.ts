import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardModule } from '@spartacus/storefront';
import { CheckoutComOrderDetailBillingComponent } from './checkout-com-order-detail-billing.component';

@NgModule({
  declarations: [CheckoutComOrderDetailBillingComponent],
  exports: [CheckoutComOrderDetailBillingComponent],
  imports: [
    CommonModule,
    CardModule
  ]
})
export class CheckoutComOrderDetailBillingModule {
}
