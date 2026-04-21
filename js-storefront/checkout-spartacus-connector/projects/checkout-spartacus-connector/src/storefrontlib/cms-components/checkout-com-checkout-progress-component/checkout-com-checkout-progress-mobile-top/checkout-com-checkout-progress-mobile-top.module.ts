/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartNotEmptyGuard, CheckoutAuthGuard } from '@spartacus/checkout/base/components';
import { CmsConfig, I18nModule, provideConfig, UrlModule, } from '@spartacus/core';
import { CheckoutComStepsSetGuard } from '../../../../core/guards';
import { CheckoutComCheckoutProgressMobileTopComponent } from './checkout-com-checkout-progress-mobile-top.component';

@NgModule({
  imports: [CommonModule, UrlModule, I18nModule, RouterModule],
  providers: [
    provideConfig({
      cmsComponents: {
        CheckoutProgressMobileTop: {
          component: CheckoutComCheckoutProgressMobileTopComponent,
          guards: [CheckoutAuthGuard, CartNotEmptyGuard, CheckoutComStepsSetGuard],
        },
      },
    } as CmsConfig),
  ],
  declarations: [CheckoutComCheckoutProgressMobileTopComponent],
  exports: [CheckoutComCheckoutProgressMobileTopComponent],
})
export class CheckoutComCheckoutProgressMobileTopModule {
}
