import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { CheckoutProgressMobileTopComponent } from '@spartacus/checkout/base/components';
import { CheckoutStep } from '@spartacus/checkout/base/root';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CheckoutComProgressService } from '../../../../core/services/checkout-steps/checkout-com-progress.service';

@Component({
  selector: 'y-checkout-com-checkout-progress-mobile-top',
  templateUrl: './checkout-com-checkout-progress-mobile-top.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CheckoutComCheckoutProgressMobileTopComponent extends CheckoutProgressMobileTopComponent {
  protected checkoutComProgressService: CheckoutComProgressService = inject(CheckoutComProgressService);
  override activeStepIndex$: Observable<number> = this.checkoutComProgressService.activeStepIndex$.pipe(
    tap((index: number): void => {
      this.activeStepIndex = index;
    })
  );

  override get steps$(): Observable<CheckoutStep[]> {
    return this.checkoutComProgressService.steps$;
  }
}
