import { ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockCxSpinnerComponent } from '@checkout-tests/components';
import { queryDebugElementByCss } from '@checkout-tests/finders.mock';
import { MockCheckoutComFlowFacade } from '@checkout-tests/services/checkout-com-flow.facade.mock';
import { MockGlobalMessageService } from '@checkout-tests/services/global-message.service.mock';
import { CheckoutWebComponents, Options, TokenizeResult } from '@checkout.com/checkout-web-components';
import { GlobalMessageService, GlobalMessageType, HttpErrorModel, LanguageService, LoggerService, WindowRef } from '@spartacus/core';
import { of, throwError } from 'rxjs';
import { CheckoutComFlowFacade } from '../../../core/facades/checkout-com-flow.facade';
import { CheckoutComFlowComponentInterface } from '../../../core/interfaces';

import { CheckoutComFlowComponent } from './checkout-com-flow.component';

const mockCheckoutWebComponents = {} as CheckoutWebComponents;
const customOptions: Partial<Options> = {
  translations: {
    'en': {
      'bank_account': 'Pay Now'
    }
  }
};
const mockFlowComponent = {
  name: '',
  selectedPaymentMethodId: '',
  selectedType: undefined,
  type: undefined,
  isAvailable(): Promise<boolean> {
    return Promise.resolve(false);
  },
  isPayButtonRequired(): boolean {
    return false;
  },
  isValid(): boolean {
    return false;
  },
  submit(): void {
  },
  tokenize(): Promise<TokenizeResult | void> {
    return Promise.resolve(undefined);
  },
  unmount(): CheckoutComFlowComponentInterface {
    return undefined;
  },
  unselect(): void {
  },
  mount: jasmine.createSpy('mount')
};

describe('CheckoutComFlowComponent', () => {
  let component: CheckoutComFlowComponent;
  let fixture: ComponentFixture<CheckoutComFlowComponent>;
  let windowRef: WindowRef;
  let checkoutComFlowFacade: CheckoutComFlowFacade;
  let loggerService: LoggerService;
  let globalMessageService: GlobalMessageService;
  let languageService: jasmine.SpyObj<LanguageService>;

  beforeEach(async () => {

    languageService = jasmine.createSpyObj('LanguageService', ['getActive']);
    languageService.getActive.and.returnValue(of('en'));

    await TestBed.configureTestingModule({
        declarations: [
          CheckoutComFlowComponent,
          MockCxSpinnerComponent
        ],
        providers: [
          LoggerService,
          WindowRef,
          ChangeDetectorRef,
          {
            provide: CheckoutComFlowFacade,
            useClass: MockCheckoutComFlowFacade
          },
          {
            provide: GlobalMessageService,
            useClass: MockGlobalMessageService
          },
          {
            provide: LanguageService,
            useValue: languageService
          }
        ]
      })
      .compileComponents();

    TestBed.overrideComponent(CheckoutComFlowComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default }
    });

    fixture = TestBed.createComponent(CheckoutComFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    checkoutComFlowFacade = TestBed.inject(CheckoutComFlowFacade);
    loggerService = TestBed.inject(LoggerService);
    globalMessageService = TestBed.inject(GlobalMessageService);
    windowRef = TestBed.inject(WindowRef);
    languageService = TestBed.inject(LanguageService) as jasmine.SpyObj<LanguageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call initializeFlowObservables', () => {
      spyOn<any>(component, 'initializeFlowObservables');

      component.ngOnInit();

      expect(component['initializeFlowObservables']).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('should call listenForFlowEnabled', () => {
      spyOn<any>(component, 'listenForFlowEnabled');

      component.ngAfterViewInit();

      expect(component['listenForFlowEnabled']).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should call flowComponent.unmount when available', () => {
      const flowComponent = jasmine.createSpyObj('CheckoutComFlowComponentInterface', ['unmount']);
      component['flowComponent'] = flowComponent;

      component.ngOnDestroy();

      expect(flowComponent.unmount).toHaveBeenCalled();
    });

    it('should set checkoutInstance to null if it is defined', () => {
      component['checkoutInstance'] = {} as any;
      component['flowComponent'] = mockFlowComponent;

      component.ngOnDestroy();

      expect(component['checkoutInstance']).toBeNull();
    });

    it('should not throw an error if checkoutInstance is already null', () => {
      component['checkoutInstance'] = null;

      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('createPaymentSessions', () => {
    it('should delegate to the facade with the provided options', (done) => {
      spyOn(checkoutComFlowFacade, 'createPaymentSessions').and.returnValue(of(mockCheckoutWebComponents));

      component.createPaymentSessions(customOptions).subscribe((result) => {
        expect(checkoutComFlowFacade.createPaymentSessions).toHaveBeenCalledWith(customOptions);
        expect(result).toBe(mockCheckoutWebComponents);
        done();
      });
    });
  });

  describe('initializeFlowObservables', () => {
    it('should set the locale based on the active language', () => {
      spyOn(checkoutComFlowFacade, 'setLocale');

      component['initializeFlowObservables']();

      expect(languageService.getActive).toHaveBeenCalled();
      expect(checkoutComFlowFacade.setLocale).toHaveBeenCalledWith('en');
    });

    it('should set isLoading$ to the value returned by getIsProcessing', () => {
      const mockIsProcessing$ = of(true);
      spyOn(checkoutComFlowFacade, 'getIsProcessing').and.returnValue(mockIsProcessing$);

      component['initializeFlowObservables']();

      expect(component.isLoading$).toBe(mockIsProcessing$);
    });
  });

  describe('listenForFlowEnabled', () => {
    it('should call createPaymentSessions when the flow is enabled', () => {
      const mockCheckoutWebComponents = {} as CheckoutWebComponents;
      spyOn(checkoutComFlowFacade, 'getIsFlowEnabled').and.returnValue(of(true));
      spyOn<any>(component, 'createPaymentSessions').and.returnValue(of(mockCheckoutWebComponents));
      spyOn<any>(component, 'handleWebComponentsLoaded');

      component['listenForFlowEnabled']();

      expect(checkoutComFlowFacade.getIsFlowEnabled).toHaveBeenCalled();
      expect(component['createPaymentSessions']).toHaveBeenCalled();
      expect(component['handleWebComponentsLoaded']).toHaveBeenCalledWith(mockCheckoutWebComponents);
    });

    it('should call handleWebComponentsError when createPaymentSessions throws an error', () => {
      const mockError = { message: 'Error' } as HttpErrorModel;
      spyOn(checkoutComFlowFacade, 'getIsFlowEnabled').and.returnValue(of(true));
      spyOn<any>(component, 'createPaymentSessions').and.returnValue(throwError(() => mockError));
      spyOn<any>(component, 'handleWebComponentsError');

      component['listenForFlowEnabled']();

      expect(component['handleWebComponentsError']).toHaveBeenCalledWith(mockError);
    });

    it('should not call createPaymentSessions if the flow is disabled', () => {
      spyOn(checkoutComFlowFacade, 'getIsFlowEnabled').and.returnValue(of(false));
      spyOn<any>(component, 'createPaymentSessions');

      component['listenForFlowEnabled']();

      expect(component['createPaymentSessions']).not.toHaveBeenCalled();
    });
  });

  describe('handleWebComponentsLoaded', () => {
    it('should set checkoutInstance to the provided checkout object', () => {
      const mockCheckout = {} as CheckoutWebComponents;
      spyOn<any>(component, 'mountFlowComponent');
      spyOn(windowRef, 'isBrowser').and.returnValue(true);

      component['handleWebComponentsLoaded'](mockCheckout);

      expect(component['checkoutInstance']).toBe(mockCheckout);
    });

    it('should call mountFlowComponent when running in the browser', () => {
      const mockCheckout = {} as CheckoutWebComponents;
      spyOn<any>(component, 'mountFlowComponent');
      spyOn(windowRef, 'isBrowser').and.returnValue(true);

      component['handleWebComponentsLoaded'](mockCheckout);

      expect(component['mountFlowComponent']).toHaveBeenCalled();
    });

    it('should not call mountFlowComponent when not running in the browser', () => {
      const mockCheckout = {} as CheckoutWebComponents;
      spyOn<any>(component, 'mountFlowComponent');
      spyOn(windowRef, 'isBrowser').and.returnValue(false);

      component['handleWebComponentsLoaded'](mockCheckout);

      expect(component['mountFlowComponent']).not.toHaveBeenCalled();
    });
  });

  describe('handleWebComponentsError', () => {
    it('should set webComponentsError to the error message if provided', () => {
      const mockError = { message: 'Test error message' } as HttpErrorModel;
      spyOn(loggerService, 'error');

      component['handleWebComponentsError'](mockError);

      expect(component.webComponentsError).toBe('Test error message');
      expect(loggerService.error).toHaveBeenCalledWith(mockError);
      expect(globalMessageService.add).toHaveBeenCalledWith('Test error message', GlobalMessageType.MSG_TYPE_ERROR);
    });

    it('should set webComponentsError to a default message if error message is not provided', () => {
      const mockError = {} as HttpErrorModel;
      spyOn(loggerService, 'error');

      component['handleWebComponentsError'](mockError);

      expect(component.webComponentsError).toBe('Unknown error loading payment components');
      expect(loggerService.error).toHaveBeenCalledWith(mockError);
      expect(globalMessageService.add).toHaveBeenCalledWith('Unknown error loading payment components', GlobalMessageType.MSG_TYPE_ERROR);
    });

    it('should handle null or undefined error gracefully', () => {
      spyOn(loggerService, 'error');

      component['handleWebComponentsError'](null);

      expect(component.webComponentsError).toBe('Unknown error loading payment components');
      expect(loggerService.error).toHaveBeenCalledWith(null);
      expect(globalMessageService.add).toHaveBeenCalledWith('Unknown error loading payment components', GlobalMessageType.MSG_TYPE_ERROR);
    });
  });

  describe('mountFlowComponent', () => {
    it('should call checkout.create with "flow" and mount the component to the container', () => {
      const mockCheckout = jasmine.createSpyObj('CheckoutWebComponents', ['create']);
      const mountedFlowComponent = jasmine.createSpyObj('CheckoutComFlowComponentInterface', ['mount']);
      mockCheckout.create.and.returnValue(mountedFlowComponent);
      component['checkoutInstance'] = mockCheckout;
      component.flowContainer = new ElementRef(document.createElement('div'));

      component['mountFlowComponent']();

      expect(mockCheckout.create).toHaveBeenCalledWith('flow');
      expect(mountedFlowComponent.mount).toHaveBeenCalledWith(component.flowContainer.nativeElement);
    });

    it('should unmount an existing flow component before mounting a new one', () => {
      const mockCheckout = jasmine.createSpyObj('CheckoutWebComponents', ['create']);
      const mountedFlowComponent = jasmine.createSpyObj('CheckoutComFlowComponentInterface', ['mount']);
      const existingFlowComponent = jasmine.createSpyObj('CheckoutComFlowComponentInterface', ['unmount']);
      mockCheckout.create.and.returnValue(mountedFlowComponent);
      component['checkoutInstance'] = mockCheckout;
      component['flowComponent'] = existingFlowComponent;
      component.flowContainer = new ElementRef(document.createElement('div'));

      component['mountFlowComponent']();

      expect(existingFlowComponent.unmount).toHaveBeenCalled();
      expect(mountedFlowComponent.mount).toHaveBeenCalledWith(component.flowContainer.nativeElement);
    });

    it('should call handleWebComponentsError if an error occurs during mounting', () => {
      const mockCheckout = jasmine.createSpyObj('CheckoutWebComponents', ['create']);
      const mountError = new Error('Mounting error');
      mockCheckout.create.and.throwError(mountError.message);
      component['checkoutInstance'] = mockCheckout;
      component.flowContainer = new ElementRef(document.createElement('div'));
      spyOn<any>(component, 'handleWebComponentsError');
      spyOn(loggerService, 'error');

      component['mountFlowComponent']();

      expect(loggerService.error).toHaveBeenCalledWith('Error mounting flow component', jasmine.any(Error));
      expect(component['handleWebComponentsError']).toHaveBeenCalledWith({ message: 'Error mounting payment component' });
    });

    it('should return early when checkoutInstance or flowContainer is missing', () => {
      component['checkoutInstance'] = null;
      component.flowContainer = undefined as any;
      spyOn(loggerService, 'error');

      component['mountFlowComponent']();

      expect(loggerService.error).not.toHaveBeenCalled();
    });
  });

  describe('UI component', () => {
    it('displays the spinner when loading', () => {
      component.isLoading$ = of(true);
      fixture.detectChanges();
      const spinner = queryDebugElementByCss(fixture, 'cx-spinner');
      expect(spinner).toBeTruthy();
    });

    it('hides the form when loading', () => {
      component.isLoading$ = of(true);
      fixture.detectChanges();
      const form = queryDebugElementByCss(fixture, 'form');
      expect(form.nativeElement.hidden).toBeTrue();
    });

    it('displays the form when not loading', () => {
      component.isLoading$ = of(false);
      fixture.detectChanges();
      const form = queryDebugElementByCss(fixture, 'form');
      expect(form.nativeElement.hidden).toBeFalse();
    });

    it('renders the flow container', () => {
      fixture.detectChanges();
      const flowContainer = queryDebugElementByCss(fixture, '#flow-container');
      expect(flowContainer).toBeTruthy();
    });
  });
});
