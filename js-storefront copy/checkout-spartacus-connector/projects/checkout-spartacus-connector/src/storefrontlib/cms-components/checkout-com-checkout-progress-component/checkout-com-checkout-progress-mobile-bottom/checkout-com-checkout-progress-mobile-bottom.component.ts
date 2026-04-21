/*
 * SPDX-FileCopyrightText: 2025 SAP Spartacus team <spartacus-team@sap.com>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { CheckoutProgressMobileBottomComponent } from '@spartacus/checkout/base/components';
import { CheckoutStep } from '@spartacus/checkout/base/root';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CheckoutComProgressService } from '../../../../core/services/checkout-steps/checkout-com-progress.service';

@Component({
  selector: 'y-checkout-com-checkout-progress-mobile-bottom',
  templateUrl: './checkout-com-checkout-progress-mobile-bottom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CheckoutComCheckoutProgressMobileBottomComponent extends CheckoutProgressMobileBottomComponent {
  protected checkoutComProgressService: CheckoutComProgressService = inject(CheckoutComProgressService);

  override get steps$(): Observable<CheckoutStep[]> {
    return this.checkoutComProgressService.steps$;
  }

  override activeStepIndex$: Observable<number> = this.checkoutComProgressService.activeStepIndex$.pipe(
    tap((index: number): void => {
      this.activeStepIndex = index;
    })
  );
}
