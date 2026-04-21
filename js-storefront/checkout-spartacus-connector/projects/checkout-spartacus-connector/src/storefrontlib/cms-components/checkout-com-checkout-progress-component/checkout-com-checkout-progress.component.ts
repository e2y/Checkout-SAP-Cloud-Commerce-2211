import { Component, inject, ViewEncapsulation } from '@angular/core';
import { CheckoutProgressComponent } from '@spartacus/checkout/base/components';
import { CheckoutStep } from '@spartacus/checkout/base/root';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CheckoutComProgressService } from '../../../core/services/checkout-steps/checkout-com-progress.service';

@Component({
  selector: 'y-checkout-com-checkout-progress',
  templateUrl: './checkout-com-checkout-progress.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CheckoutComCheckoutProgressComponent extends CheckoutProgressComponent {
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
