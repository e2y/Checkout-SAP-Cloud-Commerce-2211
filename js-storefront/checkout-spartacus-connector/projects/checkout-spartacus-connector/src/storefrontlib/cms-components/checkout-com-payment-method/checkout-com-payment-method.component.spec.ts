import { Type } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CheckoutComFramesFormModule } from '@checkout-components/checkout-com-frames-form/checkout-com-frames-form.module';
import { CheckoutComFramesInputModule } from '@checkout-components/checkout-com-frames-input/checkout-com-frames-input.module';
import { CheckoutComPaymentFormComponent } from '@checkout-components/checkout-com-payment-form/checkout-com-payment-form.component';
import { CheckoutComConnector } from '@checkout-core/connectors/checkout-com/checkout-com.connector';
import { ApmPaymentDetails, CheckoutComPaymentDetails } from '@checkout-core/interfaces';
import { CheckoutComApmFacade } from '@checkout-facades/checkout-com-apm.facade';
import { CheckoutComPaymentFacade } from '@checkout-facades/checkout-com-payment.facade';
import { ApmData, PaymentType } from '@checkout-model/ApmData';
import { CheckoutComBillingAddressFormService } from '@checkout-services/billing-address-form/checkout-com-billing-address-form.service';
import { MockCxIconComponent, MockCxSpinnerComponent, MockLibCheckoutComApmComponent, MockLibCheckoutComBillingAddressFormComponent } from '@checkout-tests/components';
import { MockCxFeatureDirective } from '@checkout-tests/directives/cx-feature.directive.mock';
import { generateOneAddress } from '@checkout-tests/fake-data/address.mock';
import { MockActiveCartFacade } from '@checkout-tests/services/cart-active.service.mock';
import { MockCheckoutComConnector } from '@checkout-tests/services/checkout-com.connector.mock';
import { MockGlobalMessageService } from '@checkout-tests/services/global-message.service.mock';
import { MockLaunchDialogService } from '@checkout-tests/services/launch-dialog.service.mock';
import { MockTranslationService } from '@checkout-tests/services/translations.services.mock';
import { MockUserAddressService } from '@checkout-tests/services/user-address.service.mock';
import { NgSelectModule } from '@ng-select/ng-select';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { CheckoutBillingAddressFormService, CheckoutStepService } from '@spartacus/checkout/base/components';
import { CheckoutDeliveryAddressFacade } from '@spartacus/checkout/base/root';
import {
  Address,
  CardType,
  EventService,
  FeatureConfigService,
  FeaturesConfigModule,
  GlobalMessageService,
  I18nTestingModule,
  LoggerService,
  PaymentDetails,
  QueryState,
  TranslationService,
  UserAddressService,
  UserPaymentService,
} from '@spartacus/core';
import { CardComponent, FormErrorsModule, LaunchDialogService, NgSelectA11yModule } from '@spartacus/storefront';

import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { CheckoutComPaymentMethodComponent } from './checkout-com-payment-method.component';
import createSpy = jasmine.createSpy;

const mockPaymentDetails: PaymentDetails = {
  id: 'mock payment id',
  accountHolderName: 'Name',
  cardNumber: '123456789',
  cardType: {
    code: 'Visa',
    name: 'Visa',
  },
  expiryMonth: '01',
  expiryYear: '2022',
  cvn: '123',
};

const mockPayments: PaymentDetails[] = [
  {
    id: 'non default method',
    accountHolderName: 'Name',
    cardNumber: '123456789',
    cardType: {
      code: 'Visa',
      name: 'Visa',
    },
    expiryMonth: '01',
    expiryYear: '2022',
    cvn: '123',
  },
  {
    id: 'default payment method',
    accountHolderName: 'Name',
    cardNumber: '123456789',
    cardType: {
      code: 'Visa',
      name: 'Visa',
    },
    expiryMonth: '01',
    expiryYear: '2022',
    cvn: '123',
    defaultPayment: true,
  },
  mockPaymentDetails,
];

const mockCardTypes: CardType[] = [
  {
    'code': 'amex',
    'name': 'American Express'
  },
  {
    'code': 'jcb',
    'name': 'JCB'
  },
  {
    'code': 'maestro',
    'name': 'Maestro'
  },
  {
    'code': 'undefined'
  },
  {
    'code': 'discover',
    'name': 'Discover'
  },
  {
    'code': 'switch',
    'name': 'Switch'
  },
  {
    'code': 'visa',
    'name': 'Visa'
  },
  {
    'code': 'mastercard',
    'name': 'Mastercard'
  },
  {
    'code': 'mastercard_eurocard',
    'name': 'Mastercard/Eurocard'
  },
  {
    'code': 'americanexpress',
    'name': 'American Express'
  },
  {
    'code': 'diners',
    'name': 'Diner\'s Club'
  },
  {
    'code': 'dinersclubinternational',
    'name': 'Diners Club International'
  }
];

const merchantKey = 'pk_test_d4727781-a79c-460e-9773-05d762c63e8f';

class MockUserPaymentService {
  loadPaymentMethods(): void {
  }

  getPaymentMethods(): Observable<PaymentDetails[]> {
    return of();
  }

  getPaymentMethodsLoading(): Observable<boolean> {
    return of();
  }

  getAllBillingCountries() {
    return of([
      {
        isocode: 'NL',
        name: 'Netherlands'
      },
      {
        isocode: 'ES',
        name: 'Spain'
      },
      {
        isocode: 'UK',
        name: 'United Kingdom'
      }
    ]);
  }
}

class MockCheckoutComPaymentFacade implements Partial<CheckoutComPaymentFacade> {
  createPaymentDetails() {
    return of(mockPaymentDetails);
  };

  updatePaymentAddress() {
    return of({ line1: 'test' });
  };

  setPaymentDetails() {
    return of({});
  };

  getPaymentAddressFromState() {
    return of({});
  }

  getPaymentDetails(): Observable<PaymentDetails> {
    return of(mockPaymentDetails);
  }

  getPaymentDetailsState(): Observable<QueryState<PaymentDetails>> {
    return of({
      data: mockPaymentDetails,
      loading: false,
      error: false
    });
  }

  paymentProcessSuccess() {
  }

  getPaymentCardTypes() {
    return of(mockCardTypes);
  }

  canSaveCard() {
    return true;
  }

  getIsABC(): Observable<QueryState<boolean>> {
    return of({
      loading: false,
      data: true,
      error: false,
    });
  }

  getIsABCFromState(): Observable<boolean> {
    return of(true);
  }

  getOccMerchantKeyFromState(): Observable<string> {
    return of(merchantKey);
  }
}

class MockCheckoutDeliveryAddressFacade {
  getDeliveryAddress(): Observable<PaymentDetails> {
    return of(null);
  }

  getDeliveryAddressState() {
    return of({ data: mockAddress });
  }
}

class MockCheckoutStepService {
  next = createSpy();
  back = createSpy();

  getBackBntText(): string {
    return 'common.back';
  }
}

const mockActivatedRoute = {
  snapshot: {
    url: ['checkout', 'payment-method'],
  },
};

class MockCheckoutComApmFacade implements Partial<CheckoutComApmFacade> {
  createApmPaymentDetails() {
    return of(mockPaymentDetails);
  };

  getSelectedApmFromState() {
    return of({
      code: PaymentType.Card
    });
  };

  requestAvailableApms(): Observable<QueryState<ApmData[]>> {
    return of({
      data: null,
      loading: false,
      error: false
    });
  };
}

const mockAddress: Address = {
  id: 'mock address id',
  firstName: 'John',
  lastName: 'Doe',
  titleCode: 'mr',
  line1: 'Toyosaki 2 create on cart',
  line2: 'line2',
  town: 'town',
  region: { isocode: 'JP-27' },
  postalCode: 'zip',
  country: { isocode: 'JP' },
};

class MockFeatureConfigService implements Partial<FeatureConfigService> {
  isEnabled(_feature: string) {
    return true;
  }
}

let dialogClose$: BehaviorSubject<any | undefined> = new BehaviorSubject(undefined);

describe('CheckoutComPaymentMethodComponent', () => {
  let component: CheckoutComPaymentMethodComponent;
  let fixture: ComponentFixture<CheckoutComPaymentMethodComponent>;
  let userAddressService: UserAddressService;
  let userPaymentService: UserPaymentService;
  let checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade;
  let logger: LoggerService;
  let eventService: EventService;
  let checkoutComPaymentFacade: CheckoutComPaymentFacade;
  let billingAddressFormService: CheckoutComBillingAddressFormService;
  let checkoutComConnector: CheckoutComConnector;
  let activeCartFacade: ActiveCartFacade;
  let globalMessageService: GlobalMessageService;
  let checkoutStepService: CheckoutStepService;
  let featureConfig: FeatureConfigService;
  let mockCheckoutComApmFacade: CheckoutComApmFacade;
  let getPaymentDetailsState;
  let selectPaymentMethodSpy;
  let createPaymentDetailsSpy;
  let updatePaymentAddressSpy;
  let createApmPaymentDetailsSpy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          I18nTestingModule,
          FormErrorsModule,
          ReactiveFormsModule,
          CheckoutComFramesInputModule,
          CheckoutComFramesFormModule,
          NgSelectModule,
          FeaturesConfigModule,
          NgSelectA11yModule,
        ],
        declarations: [
          MockCxFeatureDirective,
          MockLibCheckoutComApmComponent,
          MockLibCheckoutComBillingAddressFormComponent,
          CheckoutComPaymentMethodComponent,
          CardComponent,
          MockCxSpinnerComponent,
          MockCxIconComponent,
          CheckoutComPaymentFormComponent,
        ],
        providers: [
          {
            provide: LaunchDialogService,
            useClass: MockLaunchDialogService
          },
          {
            provide: CheckoutDeliveryAddressFacade,
            useClass: MockCheckoutDeliveryAddressFacade
          },
          {
            provide: UserPaymentService,
            useClass: MockUserPaymentService
          },
          {
            provide: GlobalMessageService,
            useClass: MockGlobalMessageService
          },
          {
            provide: UserAddressService,
            useClass: MockUserAddressService
          },
          CheckoutComBillingAddressFormService,
          {
            provide: CheckoutBillingAddressFormService,
            useClass: CheckoutComBillingAddressFormService
          },
          {
            provide: CheckoutComPaymentFacade,
            useClass: MockCheckoutComPaymentFacade
          },
          {
            provide: CheckoutComConnector,
            useClass: MockCheckoutComConnector
          },
          {
            provide: TranslationService,
            useClass: MockTranslationService
          },

          {
            provide: ActiveCartFacade,
            useClass: MockActiveCartFacade,
          },
          {
            provide: CheckoutStepService,
            useClass: MockCheckoutStepService
          },
          {
            provide: ActivatedRoute,
            useValue: mockActivatedRoute
          },
          {
            provide: CheckoutComApmFacade,
            useClass: MockCheckoutComApmFacade
          },
          {
            provide: FeatureConfigService,
            useClass: MockFeatureConfigService,
          },
          LoggerService,
        ],
      }).compileComponents();

      userPaymentService = TestBed.inject(UserPaymentService);
      checkoutDeliveryAddressFacade = TestBed.inject(CheckoutDeliveryAddressFacade);
      checkoutComPaymentFacade = TestBed.inject(CheckoutComPaymentFacade);
      activeCartFacade = TestBed.inject(ActiveCartFacade);
      globalMessageService = TestBed.inject(GlobalMessageService);
      userAddressService = TestBed.inject(UserAddressService);
      checkoutStepService = TestBed.inject(
        CheckoutStepService as Type<CheckoutStepService>
      );
      mockCheckoutComApmFacade = TestBed.inject(CheckoutComApmFacade);
      globalMessageService = TestBed.inject(GlobalMessageService);
      featureConfig = TestBed.inject(FeatureConfigService);
      logger = TestBed.inject(LoggerService);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComPaymentMethodComponent);
    component = fixture.componentInstance;

    selectPaymentMethodSpy = spyOn(component, 'selectPaymentMethod').and.callThrough();
    createPaymentDetailsSpy = spyOn(checkoutComPaymentFacade, 'createPaymentDetails');
    createPaymentDetailsSpy.and.returnValue(of(mockPaymentDetails));
    createApmPaymentDetailsSpy = spyOn(mockCheckoutComApmFacade, 'createApmPaymentDetails').and.callThrough();
    spyOn<any>(component, 'savePaymentMethod').and.callThrough();
    spyOn(checkoutComPaymentFacade, 'setPaymentDetails').and.callThrough();
    updatePaymentAddressSpy = spyOn(checkoutComPaymentFacade, 'updatePaymentAddress');
    updatePaymentAddressSpy.and.returnValue(of({ line1: 'test' }));
    getPaymentDetailsState = spyOn(checkoutComPaymentFacade, 'getPaymentDetailsState');
    getPaymentDetailsState.and.returnValue(of({
      loading: false,
      error: false,
      data: undefined
    }));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('component behavior', () => {
    it('should show loader during existing payment methods loading', () => {
      component.isUpdating$ = of(true);
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of([])
      );
      getPaymentDetailsState.and.returnValue(of({
        loading: false,
        error: false,
        data: undefined
      }));

      component.ngOnInit();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('cx-card')).length).toEqual(
        0
      );
      expect(fixture.debugElement.query(By.css('cx-spinner'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('cx-payment-form'))).toBeFalsy();
    });

    it('should select default payment method when nothing is selected', () => {
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(of(mockPayments));
      getPaymentDetailsState.and.returnValue(of({
        loading: false,
        error: false,
        data: undefined
      }));

      component.ngOnInit();
      fixture.detectChanges();

      expect(checkoutComPaymentFacade.setPaymentDetails).toHaveBeenCalledWith(
        mockPayments[1]
      );
    });

    it('should show form to add new payment method, when there are no existing methods', () => {
      component.isUpdating$ = of(false);
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of([])
      );
      getPaymentDetailsState.and.returnValue(of({
        loading: false,
        error: false,
        data: undefined
      }));

      component.ngOnInit();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('cx-card')).length).toEqual(
        0
      );
      expect(fixture.debugElement.query(By.css('cx-spinner'))).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('lib-checkout-com-payment-form'))
      ).toBeTruthy();
    });

    it('should create and select new payment method and redirect', () => {
      const selectedPaymentMethod$ = new Subject<QueryState<PaymentDetails | undefined>>();
      spyOn(userPaymentService, 'getPaymentMethodsLoading').and.returnValue(
        of(false)
      );
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of([])
      );
      getPaymentDetailsState.and.returnValue(selectedPaymentMethod$);

      component.ngOnInit();
      fixture.detectChanges();

      component.setPaymentDetails({
        paymentDetails: mockPaymentDetails,
        billingAddress: mockAddress,
      });

      expect(checkoutComPaymentFacade.createPaymentDetails).toHaveBeenCalledWith({
        ...mockPaymentDetails,
        billingAddress: mockAddress,
      });
      selectedPaymentMethod$.next({
        loading: false,
        error: false,
        data: mockPaymentDetails,
      });
      expect(checkoutStepService.next).toHaveBeenCalledWith(
        <any>mockActivatedRoute
      );
    });

    it('should show form for creating new method after clicking new payment method button', () => {
      component.isUpdating$ = of(false);
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of([mockPaymentDetails])
      );
      getPaymentDetailsState.and.returnValue(of({
        loading: false,
        error: false,
        data: undefined
      }));

      component.ngOnInit();
      fixture.detectChanges();
      fixture.debugElement
        .queryAll(By.css('button'))
        .filter(
          (btn) => btn.nativeElement.innerText === 'paymentForm.addNewPayment'
        )[0]
        .nativeElement.click();
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('cx-card')).length).toEqual(
        0
      );
      expect(fixture.debugElement.query(By.css('cx-spinner'))).toBeFalsy();
      expect(
        fixture.debugElement.query(By.css('lib-checkout-com-payment-form'))
      ).toBeTruthy();
    });

    it('should have enabled button when there is selected method', () => {
      const getContinueButton = () => {
        return fixture.debugElement
          .queryAll(By.css('button'))
          .filter(
            (btn) => btn.nativeElement.innerText === 'common.continue'
          )[0];
      };
      const selectedPaymentMethod$ = new BehaviorSubject<
        QueryState<PaymentDetails | undefined>
      >({
        loading: false,
        error: false,
        data: undefined,
      });

      component.isUpdating$ = of(false);
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of([mockPaymentDetails])
      );
      getPaymentDetailsState.and.returnValue(selectedPaymentMethod$);

      component.ngOnInit();
      fixture.detectChanges();

      expect(getContinueButton().nativeElement.disabled).toBeTruthy();
      selectedPaymentMethod$.next({
        loading: false,
        error: false,
        data: mockPaymentDetails,
      });
      fixture.detectChanges();
      expect(getContinueButton().nativeElement.disabled).toBeFalsy();
    });

    it('should display credit card info correctly', () => {
      spyOn(featureConfig, 'isEnabled').and.returnValue(false);
      const selectedPaymentMethod: PaymentDetails = {
        id: 'selected payment method',
        accountHolderName: 'Name',
        cardNumber: '123456789',
        cardType: {
          code: 'Visa',
          name: 'Visa',
        },
        expiryMonth: '01',
        expiryYear: '2022',
        cvn: '123',
        defaultPayment: true,
      };

      expect(
        component['createCard'](
          selectedPaymentMethod,
          {
            textDefaultPaymentMethod: '✓ DEFAULT',
            textExpires: 'Expires',
            textUseThisPayment: 'Use this payment',
            textSelected: 'Selected',
          },
          selectedPaymentMethod
        )
      ).toEqual({
        role: 'application',
        title: '✓ DEFAULT',
        textBold: 'Name',
        text: ['123456789', 'Expires'],
        img: 'CREDIT_CARD',
        actions: [{
          name: 'Use this payment',
          event: 'send'
        }],
        header: 'Selected',
        label: 'paymentCard.defaultPaymentLabel',
      });
    });

    it('should not add select action for selected card', () => {
      spyOn(featureConfig, 'isEnabled').and.returnValue(true);
      const selectedPaymentMethod: PaymentDetails = {
        id: 'selected payment method',
        accountHolderName: 'Name',
        cardNumber: '123456789',
        cardType: {
          code: 'Visa',
          name: 'Visa',
        },
        expiryMonth: '01',
        expiryYear: '2022',
        cvn: '123',
        defaultPayment: true,
      };
      const card = component['createCard'](
        selectedPaymentMethod,
        {
          textDefaultPaymentMethod: '✓ DEFAULT',
          textExpires: 'Expires',
          textUseThisPayment: 'Use this payment',
          textSelected: 'Selected',
        },
        selectedPaymentMethod
      );
      expect(card.actions?.length).toBe(0);
    });

    it('should after each payment method selection change that in backend', () => {
      const mockPayments: PaymentDetails[] = [
        mockPaymentDetails,
        {
          id: 'default payment method',
          accountHolderName: 'Name',
          cardNumber: '123456789',
          cardType: {
            code: 'Visa',
            name: 'Visa',
          },
          expiryMonth: '01',
          expiryYear: '2022',
          cvn: '123',
          defaultPayment: true,
        },
      ];
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of(mockPayments)
      );
      getPaymentDetailsState.and.returnValue(
        of({
          loading: false,
          error: false,
          data: mockPaymentDetails
        })
      );

      component.ngOnInit();
      fixture.detectChanges();
      fixture.debugElement
        .queryAll(By.css('cx-card'))[1]
        .query(By.css('.btn'))
        .nativeElement.click();

      expect(checkoutComPaymentFacade.setPaymentDetails).toHaveBeenCalledWith(
        mockPayments[1]
      );
    });

    it('should not try to load methods for guest checkout', () => {
      spyOn(userPaymentService, 'loadPaymentMethods').and.stub();
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of([])
      );
      spyOn(activeCartFacade, 'isGuestCart').and.returnValue(of(true));

      component.ngOnInit();

      expect(userPaymentService.loadPaymentMethods).not.toHaveBeenCalled();
    });

    it('should show selected card, when there was previously selected method', () => {
      const mockPayments: PaymentDetails[] = [
        mockPaymentDetails,
        {
          id: 'default payment method',
          accountHolderName: 'Name',
          cardNumber: '123456789',
          cardType: {
            code: 'Visa',
            name: 'Visa',
          },
          expiryMonth: '01',
          expiryYear: '2022',
          cvn: '123',
          defaultPayment: true,
        },
      ];
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of(mockPayments)
      );
      getPaymentDetailsState.and.returnValue(
        of({
          loading: false,
          error: false,
          data: mockPaymentDetails
        })
      );

      component.ngOnInit();
      fixture.detectChanges();

      expect(
        checkoutComPaymentFacade.setPaymentDetails
      ).not.toHaveBeenCalled();
    });

    it('should go to previous step after clicking back', () => {
      component.isUpdating$ = of(false);
      spyOn(userPaymentService, 'getPaymentMethods').and.returnValue(
        of([mockPaymentDetails])
      );

      component.ngOnInit();
      fixture.detectChanges();
      fixture.debugElement
        .queryAll(By.css('button'))
        .filter((btn) => btn.nativeElement.innerText === 'common.back')[0]
        .nativeElement.click();
      fixture.detectChanges();

      expect(checkoutStepService.back).toHaveBeenCalledWith(
        <any>mockActivatedRoute
      );
    });

    it('should be able to select payment method', () => {
      getPaymentDetailsState.and.returnValue(
        of({
          loading: false,
          error: false,
          data: {}
        })
      );

      component.ngOnInit();
      fixture.detectChanges();
      component.selectPaymentMethod(mockPaymentDetails);
      expect(component['savePaymentMethod']).toHaveBeenCalledWith(
        mockPaymentDetails
      );
      expect(globalMessageService.add).toHaveBeenCalled();
      expect(checkoutComPaymentFacade.setPaymentDetails).toHaveBeenCalledWith(mockPaymentDetails);
      expect(component.selectedPaymentDetails).toBe(mockPaymentDetails);
    });

    it('should NOT be able to select payment method if the selection is the same as the currently set payment details', () => {
      checkoutComPaymentFacade.getPaymentDetailsState =
        createSpy().and.returnValue(
          of({
            loading: false,
            error: false,
            data: mockPayments[0]
          })
        );

      component.selectPaymentMethod(mockPayments[0]);

      expect(
        checkoutComPaymentFacade.setPaymentDetails
      ).not.toHaveBeenCalledWith(mockPayments[0]);
      expect(component['savePaymentMethod']).not.toHaveBeenCalledWith(
        mockPayments[0]
      );
      expect(globalMessageService.add).not.toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('should call super.ngOnInit and initialize selected APM and delivery address', () => {
      const getSelectedApmSpy = spyOn(component, 'getSelectedApm').and.callThrough();
      const getDeliveryAddressSpy = spyOn(component, 'getDeliveryAddress').and.callThrough();

      component.ngOnInit();

      expect(getSelectedApmSpy).toHaveBeenCalled();
      expect(getDeliveryAddressSpy).toHaveBeenCalled();
    });
  });

  describe('getSelectedApm', () => {
    it('should set isCardPayment to true when selected APM is Card', () => {
      const apmData: ApmData = { code: PaymentType.Card };
      spyOn(component.selectedApm$, 'pipe').and.returnValue(of(apmData));

      component.getSelectedApm();

      expect(component.isCardPayment).toBeTrue();
    });

    it('should set isCardPayment to false when selected APM is not Card', () => {
      const apmData: ApmData = { code: PaymentType.ApplePay };
      spyOn(component.selectedApm$, 'pipe').and.returnValue(of(apmData));

      component.getSelectedApm();

      expect(component.isCardPayment).toBeFalse();
    });

    it('should log error when an error occurs during subscription', () => {
      const loggerSpy = spyOn(logger, 'error');
      spyOn(component.selectedApm$, 'pipe').and.returnValue(throwError(() => 'error'));

      component.getSelectedApm();

      expect(loggerSpy).toHaveBeenCalledWith('selectedApm with errors', { error: 'error' });
    });
  });

  describe('getDeliveryAddress', () => {
    it('should set deliveryAddress when getDeliveryAddressState returns data', () => {
      const mockAddress: Address = { id: 'mock address id' };
      spyOn(checkoutDeliveryAddressFacade, 'getDeliveryAddressState').and.returnValue(of({
        loading: false,
        error: false,
        data: mockAddress
      }));

      component.getDeliveryAddress();

      // @ts-ignore
      expect(component.deliveryAddress).toEqual(mockAddress);
    });

    it('should log error when getDeliveryAddressState throws an error', () => {
      const consoleSpy = spyOn(console, 'error');
      spyOn(checkoutDeliveryAddressFacade, 'getDeliveryAddressState').and.returnValue(throwError(() => 'error'));

      component.getDeliveryAddress();

      expect(consoleSpy).toHaveBeenCalledWith('getDeliveryAddress with errors', { error: 'error' });
    });

    it('should set deliveryAddress to undefined when getDeliveryAddressState returns no data', () => {
      spyOn(checkoutDeliveryAddressFacade, 'getDeliveryAddressState').and.returnValue(of({
        loading: false,
        error: false,
        data: undefined
      }));

      component.getDeliveryAddress();
      // @ts-ignore
      expect(component.deliveryAddress).toBeUndefined();
    });
  });

  describe('selectPaymentMethod', () => {
    it('should call the parent selectPaymentMethod method with the provided payment details', () => {
      const paymentDetails: PaymentDetails = { id: 'mock id' } as PaymentDetails;

      component.selectPaymentMethod(paymentDetails);

      expect(component.selectPaymentMethod).toHaveBeenCalledWith(paymentDetails);
    });

    it('should update the selectedPaymentDetails with the provided payment details', () => {
      const paymentDetails: PaymentDetails = { id: 'mock id' } as PaymentDetails;

      component.selectPaymentMethod(paymentDetails);

      expect(component.selectedPaymentDetails).toEqual(paymentDetails);
    });

    it('should not update selectedPaymentDetails if paymentDetails is null', () => {
      component.selectedPaymentDetails = { id: 'existing id' } as PaymentDetails;

      component.selectPaymentMethod(null);

      expect(component.selectedPaymentDetails).toEqual(null);
    });

    it('should handle errors gracefully and log them', () => {
      selectPaymentMethodSpy.and.throwError('error');

      expect(() => component.selectPaymentMethod({ id: 'mock id' } as PaymentDetails)).toThrowError('error');
    });
  });

  describe('next', () => {
    it('should call super.next when CVN is not required', () => {
      component.requiresCvn = false;
      spyOn(component, 'next');

      component.next();

      expect(component.next).toHaveBeenCalled();
    });

    it('should mark CVN form as touched and not call super.next when CVN is required and form is invalid', () => {
      component.requiresCvn = true;
      component.selectedPaymentDetails = { id: 'mock id' } as PaymentDetails;
      component.cvnForm.controls['cvn'].setValue('');
      spyOn(component.cvnForm, 'markAllAsTouched');
      component.next();

      expect(component.cvnForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should call super.selectPaymentMethod with CVN and then call super.next when CVN is required and form is valid', () => {
      component.requiresCvn = true;
      component.selectedPaymentDetails = { id: 'mock id' } as PaymentDetails;
      component.cvnForm.controls['cvn'].setValue('123');
      component.next();

      expect(component.selectPaymentMethod).toHaveBeenCalledWith({
        ...component.selectedPaymentDetails,
        cvn: '123'
      });
    });
  });

  describe('setPaymentDetails', () => {
    it('should set billing address to delivery address if billing address is not provided', () => {
      const paymentDetails: CheckoutComPaymentDetails = { id: 'mock id' } as CheckoutComPaymentDetails;
      // @ts-ignore
      component.deliveryAddress = mockAddress;
      component.setPaymentDetails({ paymentDetails });
      const details: CheckoutComPaymentDetails = {
        ...paymentDetails,
        billingAddress: mockAddress
      } as CheckoutComPaymentDetails;

      expect(checkoutComPaymentFacade.createPaymentDetails).toHaveBeenCalledWith(details);
    });

    it('should call updatePaymentAddress and createPaymentDetails with provided billing address', () => {
      const paymentDetails: CheckoutComPaymentDetails = { id: 'mock id' } as CheckoutComPaymentDetails;
      const billingAddress: Address = { id: 'billing address id' } as Address;
      component.setPaymentDetails({
        paymentDetails,
        billingAddress
      });

      expect(checkoutComPaymentFacade.createPaymentDetails).toHaveBeenCalledWith({
        ...paymentDetails,
        billingAddress
      });
    });

    it('should set shouldRedirect to true on successful payment details creation', () => {
      const paymentDetails: CheckoutComPaymentDetails = { id: 'mock id' } as CheckoutComPaymentDetails;
      component.setPaymentDetails({ paymentDetails });

      // @ts-ignore
      expect(component.shouldRedirect).toBeTrue();
    });

    it('should call next method on successful payment details creation', () => {
      const billingAddress: Address = generateOneAddress();
      const paymentDetails: CheckoutComPaymentDetails = { id: 'mock id', } as CheckoutComPaymentDetails;
      spyOn(component, 'next');

      component.setPaymentDetails({
        paymentDetails,
        billingAddress
      });

      expect(component.next).toHaveBeenCalled();
    });

    it('should log error and show global message on payment details creation error', () => {
      const paymentDetails: CheckoutComPaymentDetails = { id: 'mock id' } as CheckoutComPaymentDetails;
      const error = new Error('error');
      const loggerSpy = spyOn(component['logger'], 'error');
      createPaymentDetailsSpy.and.returnValue(throwError(() => error));
      component.setPaymentDetails({ paymentDetails });

      expect(loggerSpy).toHaveBeenCalledWith('createPaymentDetails with errors', { error: error });
      expect(globalMessageService.add).toHaveBeenCalled();
    });
  });

  describe('setApmPaymentDetails', () => {
    it('should set billing address to delivery address if billing address is not provided', () => {
      const paymentDetails: ApmPaymentDetails = { type: PaymentType.iDeal } as ApmPaymentDetails;
      // @ts-ignore
      component.deliveryAddress = mockAddress;
      updatePaymentAddressSpy.and.returnValue(of(mockPaymentDetails));
      createApmPaymentDetailsSpy.and.returnValue(of(mockPaymentDetails));

      component.setApmPaymentDetails({ paymentDetails });
      const details: ApmPaymentDetails = {
        ...paymentDetails,
        billingAddress: mockAddress
      };
      expect(mockCheckoutComApmFacade.createApmPaymentDetails).toHaveBeenCalledWith(details);
    });

    it('should call updatePaymentAddress and createApmPaymentDetails with provided billing address', () => {
      const paymentDetails: ApmPaymentDetails = { type: PaymentType.Card } as ApmPaymentDetails;
      const billingAddress: Address = { id: 'billing address id' } as Address;
      updatePaymentAddressSpy.and.returnValue(of(mockPaymentDetails));
      createApmPaymentDetailsSpy.and.returnValue(of(mockPaymentDetails));

      component.setApmPaymentDetails({
        paymentDetails,
        billingAddress
      });

      expect(mockCheckoutComApmFacade.createApmPaymentDetails).toHaveBeenCalledWith({
        ...paymentDetails,
        billingAddress
      });
    });

    it('should set shouldRedirect to true on successful APM payment details creation', () => {
      const paymentDetails: ApmPaymentDetails = { type: PaymentType.Card } as ApmPaymentDetails;
      updatePaymentAddressSpy.and.returnValue(of(mockPaymentDetails));
      createApmPaymentDetailsSpy.and.returnValue(of(mockPaymentDetails));

      component.setApmPaymentDetails({ paymentDetails });

      // @ts-ignore
      expect(component.shouldRedirect).toBeTrue();
    });

    it('should call next method on successful APM payment details creation', () => {
      const paymentDetails: ApmPaymentDetails = { type: PaymentType.Card } as ApmPaymentDetails;
      updatePaymentAddressSpy.and.returnValue(of(mockPaymentDetails));
      createApmPaymentDetailsSpy.and.returnValue(of(mockPaymentDetails));
      spyOn(component, 'next');

      component.setApmPaymentDetails({ paymentDetails });

      expect(component.next).toHaveBeenCalled();
    });

    it('should log error and show global message on APM payment details creation error', () => {
      const paymentDetails: ApmPaymentDetails = { type: PaymentType.Card } as ApmPaymentDetails;
      const error = new Error('error');
      updatePaymentAddressSpy.and.returnValue(of(mockPaymentDetails));
      createApmPaymentDetailsSpy.and.returnValue(throwError(() => error));
      const loggerSpy = spyOn(component['logger'], 'error');

      component.setApmPaymentDetails({ paymentDetails });

      expect(loggerSpy).toHaveBeenCalledWith('createPaymentDetails with errors', { error: error });
      expect(globalMessageService.add).toHaveBeenCalled();
    });
  });

});

