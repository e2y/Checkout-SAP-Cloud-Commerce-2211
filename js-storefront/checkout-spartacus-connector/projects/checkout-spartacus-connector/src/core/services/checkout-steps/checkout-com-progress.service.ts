import { inject, Injectable } from '@angular/core';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { CheckoutStep, CheckoutStepType } from '@spartacus/checkout/base/root';
import { QueryState } from '@spartacus/core';
import { combineLatest, Observable, shareReplay } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { CheckoutComFlowFacade } from '../../facades';
import { FlowEnabledDataResponseDTO } from '../../interfaces';

@Injectable({ providedIn: 'root' })
export class CheckoutComProgressService {

  protected checkoutStepService: CheckoutStepService = inject(CheckoutStepService);
  readonly activeStepIndex$: Observable<number> = this.checkoutStepService.activeStepIndex$;
  protected checkoutComFlowFacade: CheckoutComFlowFacade = inject(CheckoutComFlowFacade);
  protected isFlowEnabled$: Observable<boolean> =
    this.checkoutComFlowFacade.requestIsFlowEnabled().pipe(
      filter((state: QueryState<FlowEnabledDataResponseDTO>): boolean => !state.loading),
      map((state: QueryState<FlowEnabledDataResponseDTO>): boolean => state.data?.enabled ?? false),
      distinctUntilChanged(),
      shareReplay({
        bufferSize: 1,
        refCount: true
      })
    );

  /**
   * An observable that emits the current list of checkout steps, optionally
   * transformed with Checkout Flow-specific labels.
   *
   * Combines the base checkout steps from `CheckoutStepService` with the
   * Checkout Flow enabled state. Whenever either source emits, the steps are
   * re-evaluated through `transformSteps`. The result is multicasted and
   * replayed to new subscribers so that the last emitted value is immediately
   * available without re-executing the pipeline.
   *
   * Step label transformations applied when Checkout Flow is enabled:
   * - `PAYMENT_DETAILS` → `checkoutProgress.billingAddress`
   * - `REVIEW_ORDER`    → `checkoutProgress.reviewAndPay`
   *
   * @type {Observable<CheckoutStep[]>}
   * @since 2211.43.0
   */
  steps$: Observable<CheckoutStep[]> = combineLatest([
    this.checkoutStepService.steps$,
    this.isFlowEnabled$
  ]).pipe(
    map(([steps, enabled]: [CheckoutStep[], boolean]): CheckoutStep[] => this.transformSteps(steps, enabled)),
    shareReplay({
      bufferSize: 1,
      refCount: true
    })
  );

  // TODO: Improve in future versions
  /**
   * Transforms checkout step labels according to whether Checkout Flow is enabled.
   *
   * When Checkout Flow is enabled:
   * - `PAYMENT_DETAILS` step label is renamed to `checkoutProgress.billingAddress`
   * - `REVIEW_ORDER` step label is renamed to `checkoutProgress.reviewAndPay`
   *
   * For all other steps, the original step is returned unchanged.
   * If flow is disabled, the original steps array is returned as-is.
   *
   * @param {CheckoutStep[]} steps - The checkout steps to evaluate and potentially relabel.
   * @param {boolean} enabled - Whether Checkout Flow is enabled.
   * @returns {CheckoutStep[]} A transformed steps array with updated labels when flow is enabled.
   * @since 2211.43.0
   */
  private transformSteps(
    steps: CheckoutStep[],
    enabled: boolean
  ): CheckoutStep[] {
    if (!enabled) return steps;

    return steps.map((step: CheckoutStep): CheckoutStep => {
      if (step.type.includes(CheckoutStepType.PAYMENT_DETAILS)) {
        return {
          ...step,
          name: 'checkoutProgress.billingAddress'
        };
      }

      if (step.type.includes(CheckoutStepType.REVIEW_ORDER)) {
        return {
          ...step,
          name: 'checkoutProgress.reviewAndPay'
        };
      }

      return step;
    });
  }
}