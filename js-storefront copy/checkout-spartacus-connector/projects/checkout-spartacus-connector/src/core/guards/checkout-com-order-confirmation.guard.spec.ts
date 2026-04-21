import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { fakeActivatedRouteSnapshot } from '@checkout-tests/components/snapshot.mock';
import { generateOrder } from '@checkout-tests/fake-data/order.mock';
import { CheckoutStepService } from '@spartacus/checkout/base/components';
import { CheckoutQueryFacade } from "@spartacus/checkout/base/root";
import { GlobalMessageService, GlobalMessageType, RoutingConfigService, SemanticPathService } from '@spartacus/core';
import { of, throwError } from 'rxjs';
import { CheckoutComOrderFacade } from '../facades/checkout-com-order.facade';
import { CheckoutComOrderConfirmationGuard } from './checkout-com-order-confirmation.guard';

const mockOrder = generateOrder();

describe('CheckoutComOrderConfirmationGuard', () => {
  let guard: CheckoutComOrderConfirmationGuard;
  let router: Router;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockOrderFacade: jasmine.SpyObj<CheckoutComOrderFacade>;
  let mockGlobalMessageService: jasmine.SpyObj<GlobalMessageService>;
  let mockSemanticPathService: jasmine.SpyObj<SemanticPathService>;
  let mockRoutingConfigService: jasmine.SpyObj<RoutingConfigService>;
  let mockCheckoutStepService: jasmine.SpyObj<CheckoutStepService>;
  let mockCheckoutQueryService: jasmine.SpyObj<CheckoutQueryFacade>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['parseUrl']);
    mockGlobalMessageService = jasmine.createSpyObj('GlobalMessageService', ['add']);
    mockSemanticPathService = jasmine.createSpyObj('SemanticPathService', ['get']);
    mockOrderFacade = jasmine.createSpyObj('CheckoutComOrderFacade', ['authorizeOrder', 'getOrderDetails']);
    mockRoutingConfigService = jasmine.createSpyObj('RoutingConfigService', ['getRouteConfig']);
    mockCheckoutStepService = jasmine.createSpyObj('CheckoutStepService', ['getCheckoutStepRoute']);
    mockCheckoutQueryService = jasmine.createSpyObj('CheckoutQueryFacade', ['getCheckoutDetailsState']);

    TestBed.configureTestingModule({
      providers: [
        CheckoutComOrderConfirmationGuard,
        {
          provide: Router,
          useValue: mockRouter
        },
        {
          provide: GlobalMessageService,
          useValue: mockGlobalMessageService
        },
        {
          provide: SemanticPathService,
          useValue: mockSemanticPathService
        },
        {
          provide: CheckoutComOrderFacade,
          useValue: mockOrderFacade
        },
        {
          provide: RoutingConfigService,
          useValue: mockRoutingConfigService
        },
        {
          provide: CheckoutStepService,
          useValue: mockCheckoutStepService
        },
        {
          provide: CheckoutQueryFacade,
          useValue: mockCheckoutQueryService
        },
      ],
    });

    guard = TestBed.inject(CheckoutComOrderConfirmationGuard);
    router = TestBed.inject(Router);
  });

  it('should allow activation if order details exist', (done) => {
    const route = { queryParams: null } as ActivatedRouteSnapshot;
    mockOrderFacade.getOrderDetails.and.returnValue(of(mockOrder));

    guard.canActivate(route).subscribe((result) => {
      expect(result).toBe(true);
      expect(mockOrderFacade.getOrderDetails).toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to orders page if no order details exist', (done) => {
    const route = { queryParams: null } as ActivatedRouteSnapshot;
    mockOrderFacade.getOrderDetails.and.returnValue(of(null));
    mockSemanticPathService.get.and.returnValue('/orders');
    mockRouter.parseUrl.and.returnValue({} as UrlTree);

    guard.canActivate(route).subscribe((result) => {
      expect(result).toBe(mockRouter.parseUrl('/orders'));
      done();
    });
  });

  it('should display error message if authorization fails', (done) => {
    mockRoutingConfigService.getRouteConfig.and.returnValue({ paths: ['/checkout/payment-details'] });
    const route = fakeActivatedRouteSnapshot({ queryParams: { authorized: 'false' } });
    mockOrderFacade.getOrderDetails.and.returnValue(of(mockOrder));
    mockCheckoutQueryService.getCheckoutDetailsState.and.returnValue(of({
      loading: false,
      data: generateOrder(),
      error: false,
    }));

    guard.canActivate(route).subscribe((result) => {
      expect(mockGlobalMessageService.add).toHaveBeenCalledWith(
        { key: 'checkoutReview.paymentAuthorizationError' },
        GlobalMessageType.MSG_TYPE_ERROR
      );
      done();
    });
  });

  it('should authorize order if sessionId exists', (done) => {
    const route = fakeActivatedRouteSnapshot({ queryParams: { 'cko-session-id': 'test-session' } });
    mockOrderFacade.authorizeOrder.and.returnValue(of(true));

    guard.canActivate(route).subscribe((result) => {
      expect(mockOrderFacade.authorizeOrder).toHaveBeenCalledWith('test-session');
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to order confirmation if authorization fails with error', (done) => {
    const route = fakeActivatedRouteSnapshot({ queryParams: { 'cko-session-id': 'test-session' } });
    mockOrderFacade.authorizeOrder.and.returnValue(throwError(() => 'Error'));
    mockSemanticPathService.get.and.returnValue('/orderConfirmation');
    mockRouter.parseUrl.and.returnValue({} as UrlTree);

    guard.canActivate(route).subscribe((result) => {
      expect(result).toBe(mockRouter.parseUrl('/orderConfirmation'));
      done();
    });
  });

  it('should redirect to payment details if no valid conditions met', (done) => {
    const route = fakeActivatedRouteSnapshot({ queryParams: { authorized: 'false' } });
    mockRoutingConfigService.getRouteConfig.and.returnValue({ paths: ['/checkout/payment-details'] });
    mockCheckoutStepService.getCheckoutStepRoute.and.returnValue('payment-details');
    mockCheckoutQueryService.getCheckoutDetailsState.and.returnValue(of({
      loading: false,
      data: generateOrder(),
      error: false,
    }));
    mockRouter.parseUrl.and.returnValue({} as UrlTree);

    guard.canActivate(route).subscribe((result) => {
      expect(result).toBe(mockRouter.parseUrl('/checkout/payment-details'));
      done();
    });
  });
});