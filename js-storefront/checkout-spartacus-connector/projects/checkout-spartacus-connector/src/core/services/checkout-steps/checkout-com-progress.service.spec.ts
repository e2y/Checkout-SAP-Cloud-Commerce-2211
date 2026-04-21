import { TestBed } from '@angular/core/testing';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { CheckoutStep, CheckoutStepType } from '@spartacus/checkout/base/root';
import { QueryState } from '@spartacus/core';
import { BehaviorSubject, of } from 'rxjs';
import { skip } from 'rxjs/operators';
import { CheckoutComFlowFacade } from '../../facades';
import { FlowEnabledDataResponseDTO } from '../../interfaces';
import { CheckoutComProgressService } from './checkout-com-progress.service';

class MockCheckoutStepService implements Partial<CheckoutStepService> {
  steps$ = new BehaviorSubject<CheckoutStep[]>([]);
  activeStepIndex$ = new BehaviorSubject<number>(0);
}

describe('CheckoutComProgressService', () => {
  let service: CheckoutComProgressService;
  let checkoutStepService: MockCheckoutStepService;
  let checkoutComFlowFacade: jasmine.SpyObj<CheckoutComFlowFacade>;

  const steps: CheckoutStep[] = [
    {
      id: 'delivery-address',
      name: 'checkoutProgress.deliveryAddress',
      routeName: 'checkoutDeliveryAddress',
      type: [CheckoutStepType.DELIVERY_ADDRESS]
    },
    {
      id: 'payment-details',
      name: 'checkoutProgress.paymentDetails',
      routeName: 'checkoutPaymentDetails',
      type: [CheckoutStepType.PAYMENT_DETAILS]
    },
    {
      id: 'review-order',
      name: 'checkoutProgress.reviewOrder',
      routeName: 'checkoutReviewOrder',
      type: [CheckoutStepType.REVIEW_ORDER]
    }
  ];

  // Helper function to set up TestBed with custom flow response
  const setupService = (
    flowEnabledResponse: any = of({
      loading: false,
      error: false,
      data: { enabled: false }
    })
  ) => {
    checkoutComFlowFacade = jasmine.createSpyObj<CheckoutComFlowFacade>(
      'CheckoutComFlowFacade',
      ['requestIsFlowEnabled']
    );
    checkoutComFlowFacade.requestIsFlowEnabled.and.returnValue(
      flowEnabledResponse
    );

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CheckoutComProgressService,
        {
          provide: CheckoutStepService,
          useClass: MockCheckoutStepService
        },
        {
          provide: CheckoutComFlowFacade,
          useValue: checkoutComFlowFacade
        }
      ]
    });

    service = TestBed.inject(CheckoutComProgressService);
    checkoutStepService = TestBed.inject(
      CheckoutStepService
    ) as unknown as MockCheckoutStepService;
  };

  beforeEach(() => {
    setupService();
  });

  describe('service initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should inject CheckoutStepService', () => {
      expect(checkoutStepService).toBeTruthy();
    });

    it('should inject CheckoutComFlowFacade', () => {
      expect(checkoutComFlowFacade).toBeTruthy();
    });
  });

  describe('activeStepIndex$', () => {
    it('should expose active step index from checkout step service', (done) => {
      checkoutStepService.activeStepIndex$.next(2);

      service.activeStepIndex$.subscribe((index) => {
        expect(index).toBe(2);
        done();
      });
    });

    it('should emit multiple values when active step index changes', (done) => {
      const indices: number[] = [];

      service.activeStepIndex$.subscribe((index) => {
        indices.push(index);
      });

      checkoutStepService.activeStepIndex$.next(0);
      checkoutStepService.activeStepIndex$.next(1);
      checkoutStepService.activeStepIndex$.next(2);

      setTimeout(() => {
        expect(indices).toEqual([0, 0, 1, 2]);
        done();
      }, 50);
    });
  });

  describe('steps$ - Flow disabled', () => {
    it('should keep original step names when flow is disabled', (done) => {
      checkoutStepService.steps$.next(steps);

      service.steps$.subscribe((result) => {
        expect(result).toEqual(steps);
        expect(result[0].name).toEqual('checkoutProgress.deliveryAddress');
        expect(result[1].name).toEqual('checkoutProgress.paymentDetails');
        expect(result[2].name).toEqual('checkoutProgress.reviewOrder');
        done();
      });
    });

    it('should preserve all step properties when flow is disabled', (done) => {
      checkoutStepService.steps$.next(steps);

      service.steps$.subscribe((result) => {
        result.forEach((step, index) => {
          expect(step.id).toEqual(steps[index].id);
          expect(step.routeName).toEqual(steps[index].routeName);
          expect(step.type).toEqual(steps[index].type);
        });
        done();
      });
    });

    it('should keep original step names when flow response does not include enabled flag', (done) => {
      setupService(
        of({
          loading: false,
          error: false,
          data: {} as FlowEnabledDataResponseDTO
        })
      );
      checkoutStepService.steps$.next(steps);

      service.steps$.subscribe((result) => {
        expect(result).toEqual(steps);
        done();
      });
    });
  });

  describe('steps$ - Flow enabled', () => {
    beforeEach(() => {
      setupService(
        of({ loading: false, error: false, data: { enabled: true } })
      );
    });

    it('should rename payment and review step names when flow is enabled', (done) => {
      checkoutStepService.steps$.next(steps);

      service.steps$.subscribe((result) => {
        expect(result[0].name).toEqual('checkoutProgress.deliveryAddress');
        expect(result[1].name).toEqual('checkoutProgress.billingAddress');
        expect(result[2].name).toEqual('checkoutProgress.reviewAndPay');
        done();
      });
    });

    it('should only rename PAYMENT_DETAILS and REVIEW_ORDER steps', (done) => {
      const customSteps: CheckoutStep[] = [
        {
          id: 'custom-step',
          name: 'checkoutProgress.customStep',
          routeName: 'checkoutCustom',
          type: [CheckoutStepType.DELIVERY_ADDRESS]
        },
        {
          id: 'payment-details',
          name: 'checkoutProgress.paymentDetails',
          routeName: 'checkoutPaymentDetails',
          type: [CheckoutStepType.PAYMENT_DETAILS]
        }
      ];

      checkoutStepService.steps$.next(customSteps);

      service.steps$.subscribe((result) => {
        expect(result[0].name).toEqual('checkoutProgress.customStep');
        expect(result[1].name).toEqual('checkoutProgress.billingAddress');
        done();
      });
    });

    it('should preserve step properties when renaming', (done) => {
      checkoutStepService.steps$.next(steps);

      service.steps$.subscribe((result) => {
        expect(result[1].id).toEqual('payment-details');
        expect(result[1].routeName).toEqual('checkoutPaymentDetails');
        expect(result[1].type).toEqual([CheckoutStepType.PAYMENT_DETAILS]);
        expect(result[2].id).toEqual('review-order');
        expect(result[2].routeName).toEqual('checkoutReviewOrder');
        expect(result[2].type).toEqual([CheckoutStepType.REVIEW_ORDER]);
        done();
      });
    });
  });

  describe('steps$ - Loading state', () => {
    it('should not emit steps while flow enabled query is still loading', (done) => {
      setupService(
        of({ loading: true, error: false, data: { enabled: true } })
      );
      checkoutStepService.steps$.next(steps);

      let emitted = false;
      const sub = service.steps$.subscribe(() => {
        emitted = true;
      });

      setTimeout(() => {
        expect(emitted).toBeFalse();
        sub.unsubscribe();
        done();
      }, 50);
    });

    it('should emit transformed steps once loading finishes with flow enabled', (done) => {
      const flowState$ = new BehaviorSubject<
        QueryState<FlowEnabledDataResponseDTO>
      >({
        loading: true,
        error: false,
        data: { enabled: true }
      });

      setupService(flowState$.asObservable());
      checkoutStepService.steps$.next(steps);

      let emissions = 0;
      service.steps$.subscribe((result) => {
        emissions++;

        if (emissions === 1) {
          expect(result[1].name).toEqual('checkoutProgress.billingAddress');
          expect(result[2].name).toEqual('checkoutProgress.reviewAndPay');
          done();
        }
      });

      flowState$.next({ loading: false, error: false, data: { enabled: true } });
    });

    it('should emit steps once loading finishes with flow disabled', (done) => {
      const flowState$ = new BehaviorSubject<
        QueryState<FlowEnabledDataResponseDTO>
      >({
        loading: true,
        error: false,
        data: { enabled: false }
      });

      setupService(flowState$.asObservable());
      checkoutStepService.steps$.next(steps);

      let emitted = false;
      service.steps$.subscribe((result) => {
        emitted = true;
        expect(result[1].name).toEqual('checkoutProgress.paymentDetails');
        expect(result[2].name).toEqual('checkoutProgress.reviewOrder');
      });

      setTimeout(() => {
        expect(emitted).toBeFalse();

        flowState$.next({
          loading: false,
          error: false,
          data: { enabled: false }
        });

        setTimeout(() => {
          expect(emitted).toBeTrue();
          done();
        }, 20);
      }, 50);
    });
  });

  describe('steps$ - Dynamic updates', () => {
    beforeEach(() => {
      setupService(
        of({ loading: false, error: false, data: { enabled: true } })
      );
    });

    it('should re-transform steps when steps list changes', (done) => {
      const emissions: CheckoutStep[][] = [];

      service.steps$.pipe(skip(1)).subscribe((result) => {
        emissions.push(result);
      });

      checkoutStepService.steps$.next(steps);

      setTimeout(() => {
        const newSteps = [
          ...steps,
          {
            id: 'payment-method',
            name: 'checkoutProgress.paymentMethod',
            routeName: 'checkoutPaymentMethod',
            type: [CheckoutStepType.PAYMENT_DETAILS]
          }
        ];

        checkoutStepService.steps$.next(newSteps);

        setTimeout(() => {
          expect(emissions.length).toBe(2);
          expect(emissions[1].length).toBe(4);
          expect(emissions[1][3].name).toEqual('checkoutProgress.billingAddress');
          done();
        }, 20);
      }, 20);
    });

    it('should re-transform steps when flow enabled state changes', (done) => {
      const flowState$ = new BehaviorSubject<
        QueryState<FlowEnabledDataResponseDTO>
      >({
        loading: false,
        error: false,
        data: { enabled: false }
      });

      setupService(flowState$.asObservable());
      checkoutStepService.steps$.next(steps);

      const emissions: CheckoutStep[][] = [];

      service.steps$.subscribe((result) => {
        emissions.push([...result]);
      });

      setTimeout(() => {
        expect(emissions[0][1].name).toEqual('checkoutProgress.paymentDetails');

        flowState$.next({
          loading: false,
          error: false,
          data: { enabled: true }
        });

        setTimeout(() => {
          expect(emissions[1][1].name).toEqual('checkoutProgress.billingAddress');
          done();
        }, 20);
      }, 20);
    });
  });

  describe('steps$ - ShareReplay behavior', () => {
    it('should replay the last emitted value to new subscribers', (done) => {
      checkoutStepService.steps$.next(steps);

      service.steps$.subscribe((result) => {
        // New subscription should immediately receive the last emitted value
        service.steps$.subscribe((replayedResult) => {
          expect(replayedResult).toEqual(result);
          done();
        });
      });
    });

    it('should maintain reference to same observable instance', () => {
      const obs1 = service.steps$;
      const obs2 = service.steps$;

      expect(obs1).toBe(obs2);
    });
  });

  describe('error handling', () => {
    it('should handle null data in flow enabled response', (done) => {
      setupService(
        of({
          loading: false,
          error: false,
          data: null as any
        })
      );
      checkoutStepService.steps$.next(steps);

      service.steps$.subscribe((result) => {
        // Should treat null data as disabled (defaults to false)
        expect(result).toEqual(steps);
        done();
      });
    });

    it('should handle empty steps array', (done) => {
      checkoutStepService.steps$.next([]);

      service.steps$.subscribe((result) => {
        expect(result).toEqual([]);
        done();
      });
    });
  });

  describe('isFlowEnabled$ internal observable', () => {
    it('should filter out loading states', (done) => {
      const flowState$ = new BehaviorSubject<
        QueryState<FlowEnabledDataResponseDTO>
      >({
        loading: true,
        error: false,
        data: { enabled: true }
      });

      setupService(flowState$.asObservable());

      let emitted = false;
      const sub = (service as any).isFlowEnabled$.subscribe(() => {
        emitted = true;
      });

      setTimeout(() => {
        expect(emitted).toBeFalse();

        flowState$.next({
          loading: false,
          error: false,
          data: { enabled: true }
        });

        setTimeout(() => {
          expect(emitted).toBeTrue();
          sub.unsubscribe();
          done();
        }, 20);
      }, 20);
    });

    it('should emit distinct values only', (done) => {
      const flowState$ = new BehaviorSubject<
        QueryState<FlowEnabledDataResponseDTO>
      >({
        loading: false,
        error: false,
        data: { enabled: true }
      });

      setupService(flowState$.asObservable());

      const emissions: boolean[] = [];
      const sub = (service as any).isFlowEnabled$.subscribe(
        (value: boolean) => {
          emissions.push(value);
        }
      );

      flowState$.next({ loading: false, error: false, data: { enabled: true } });
      flowState$.next({ loading: false, error: false, data: { enabled: true } });
      flowState$.next({ loading: false, error: false, data: { enabled: false } });

      setTimeout(() => {
        expect(emissions).toEqual([true, false]);
        sub.unsubscribe();
        done();
      }, 50);
    });
  });
});