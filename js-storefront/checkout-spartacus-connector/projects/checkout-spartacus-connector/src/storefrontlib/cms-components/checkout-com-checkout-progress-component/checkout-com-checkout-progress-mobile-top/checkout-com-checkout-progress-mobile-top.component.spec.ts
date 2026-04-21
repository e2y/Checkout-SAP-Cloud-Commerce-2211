import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockUrlPipe } from '@checkout-tests/pipes';
import { ActiveCartFacade, Cart } from '@spartacus/cart/base/root';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { CheckoutStep, CheckoutStepType } from '@spartacus/checkout/base/root';
import { I18nTestingModule } from '@spartacus/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CheckoutComProgressService } from '../../../../core/services/checkout-steps/checkout-com-progress.service';
import { CheckoutComCheckoutProgressMobileTopComponent } from './checkout-com-checkout-progress-mobile-top.component';
import createSpy = jasmine.createSpy;

const mockCheckoutSteps: Array<CheckoutStep> = [
  {
    id: 'step0',
    name: 'step 0',
    routeName: 'route0',
    type: [CheckoutStepType.PAYMENT_DETAILS],
  },
  {
    id: 'step1',
    name: 'step 1',
    routeName: 'route1',
    type: [CheckoutStepType.DELIVERY_ADDRESS],
  },
  {
    id: 'step2',
    name: 'step 2',
    routeName: 'route2',
    type: [CheckoutStepType.DELIVERY_MODE],
  },
];

class MockCheckoutStepService implements Partial<CheckoutStepService> {
  steps$: BehaviorSubject<CheckoutStep[]> = new BehaviorSubject<CheckoutStep[]>(
    mockCheckoutSteps
  );
  activeStepIndex$: Observable<number> = of(0);
}

class MockCheckoutComProgressService {
  steps$: Observable<CheckoutStep[]> = of(mockCheckoutSteps);
  activeStepIndex$: Observable<number> = of(0);
}

const mockActiveCart: Partial<Cart> = {
  totalItems: 5,
  subTotal: {
    formattedValue: '148,98$',
  },
};

class MockActiveCartService implements Partial<ActiveCartFacade> {
  getActive = createSpy().and.returnValue(of(mockActiveCart));
}

describe('CheckoutComCheckoutProgressMobileTopComponent', () => {
  let component: CheckoutComCheckoutProgressMobileTopComponent;
  let fixture: ComponentFixture<CheckoutComCheckoutProgressMobileTopComponent>;
  let checkoutComProgressService: CheckoutComProgressService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [I18nTestingModule],
      declarations: [CheckoutComCheckoutProgressMobileTopComponent, MockUrlPipe],
      providers: [
        { provide: CheckoutStepService, useClass: MockCheckoutStepService },
        { provide: ActiveCartFacade, useClass: MockActiveCartService },
        { provide: CheckoutComProgressService, useClass: MockCheckoutComProgressService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComCheckoutProgressMobileTopComponent);
    component = fixture.componentInstance;
    checkoutComProgressService = TestBed.inject(CheckoutComProgressService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render cart details and available steps', () => {
    const steps = fixture.debugElement.query(By.css('.cx-media')).nativeElement;

    expect(steps.innerText).toContain('step 0');

    expect(steps.innerText).toContain(
      mockActiveCart.subTotal?.formattedValue && mockActiveCart.totalItems
    );
  });

  describe('steps$', () => {
    it('should return steps from CheckoutComProgressService', (done) => {
      component.steps$.subscribe(steps => {
        expect(steps.length).toBe(3);
        expect(steps[0].name).toBe('step 0');
        done();
      });
    });
  });

  describe('activeStepIndex$', () => {
    it('should emit active step index and update internal state', (done) => {
      component.activeStepIndex$.subscribe(index => {
        expect(index).toBe(0);
        expect(component.activeStepIndex).toBe(0);
        done();
      });
    });
  });
});
