import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { I18nModule, UrlModule } from '@spartacus/core';
import { IconModule } from '@spartacus/storefront';
import { CheckoutComCartItemValidationWarningComponent } from './checkout-com-cart-item-validation-warning.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    I18nModule,
    UrlModule,
    IconModule
  ],
  exports: [
    CheckoutComCartItemValidationWarningComponent
  ],
  declarations: [
    CheckoutComCartItemValidationWarningComponent
  ],
})
export class CheckoutComCartItemValidationWarningModule {
}
