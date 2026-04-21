import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartNotEmptyGuard, CheckoutAuthGuard } from '@spartacus/checkout/base/components';
import { CmsConfig, I18nModule, provideConfig, UrlModule } from '@spartacus/core';
import { CheckoutComStepsSetGuard } from '../../../core/guards';
import { MultiLinePipe } from '../../../core/shared';
import { CheckoutComCheckoutProgressComponent } from './checkout-com-checkout-progress.component';

@NgModule({
  declarations: [CheckoutComCheckoutProgressComponent, MultiLinePipe],
  exports: [CheckoutComCheckoutProgressComponent],
  imports: [
    CommonModule,
    UrlModule,
    I18nModule,
    RouterModule
  ],
  providers: [
    provideConfig({
      cmsComponents: {
        CheckoutProgress: {
          component: CheckoutComCheckoutProgressComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, CheckoutComStepsSetGuard],
        },
      },
    } as CmsConfig),
  ],
})
export class CheckoutComCheckoutProgressModule {
}
