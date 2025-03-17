import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutComBillingAddressFormComponent } from '@checkout-components/checkout-com-billing-address-form/checkout-com-billing-address-form.component';
import { CheckoutComConnector } from '@checkout-core/connectors/checkout-com/checkout-com.connector';
import { CheckoutComPaymentDetails } from '@checkout-core/interfaces';
import { CheckoutComPaymentFacade } from '@checkout-facades/checkout-com-payment.facade';
import { CheckoutComBillingAddressFormService } from '@checkout-services/billing-address-form/checkout-com-billing-address-form.service';
import { MockCxSpinnerComponent } from '@checkout-tests/components';
import { generateAddressFromFromAddress, generateOneAddress } from '@checkout-tests/fake-data/address.mock';
import { MockCheckoutComPaymentFacade } from '@checkout-tests/services/checkou-com-payment.facade.mock';
import { MockCheckoutComConnector } from '@checkout-tests/services/checkout-com.connector.mock';
import { MockCheckoutDeliveryAddressFacade } from '@checkout-tests/services/chekout-delivery-address.service.mock';
import { MockGlobalMessageService } from '@checkout-tests/services/global-message.service.mock';
import { MockLaunchDialogService } from '@checkout-tests/services/launch-dialog.service.mock';
import { MockTranslationService } from '@checkout-tests/services/translations.services.mock';
import { MockUserAddressService } from '@checkout-tests/services/user-address.service.mock';
import { MockUserPaymentService } from '@checkout-tests/services/user-payment.service.mock';
import { NgSelectModule } from '@ng-select/ng-select';
import { CheckoutBillingAddressFormService } from '@spartacus/checkout/base/components';
import { CheckoutDeliveryAddressFacade } from '@spartacus/checkout/base/root';
import {
  Address,
  Country,
  EventService,
  FeaturesConfigModule,
  GlobalMessageService,
  GlobalMessageType,
  I18nTestingModule,
  LoggerService,
  QueryState,
  Region,
  TranslationService,
  UserAddressService,
  UserPaymentService
} from '@spartacus/core';
import { CardComponent, FormErrorsModule, LaunchDialogService, NgSelectA11yModule } from '@spartacus/storefront';
import { BehaviorSubject, of, throwError } from 'rxjs';

const mockDeliveryAddress: Address = generateOneAddress();
const mockAddress: Address = {
  firstName: 'John',
  lastName: 'Doe',
  titleCode: 'mr',
  line1: 'Toyosaki 2 create on cart',
  line2: 'line2',
  town: 'town',
  region: {
    isocode: 'JP-27',
    isocodeShort: '27'
  },
  postalCode: 'zip',
  country: { isocode: 'AD' },
};
const mockCountries: Country[] = [
  {
    isocode: 'AD',
    name: 'Andorra',
  },
  {
    isocode: 'RS',
    name: 'Serbia',
  },
];
const formData = generateAddressFromFromAddress(mockAddress);

describe('CheckoutComBillingAddressComponent', () => {
  let component: CheckoutComBillingAddressFormComponent;
  let fixture: ComponentFixture<CheckoutComBillingAddressFormComponent>;
  let userAddressService: UserAddressService;
  let userPaymentService: UserPaymentService;
  let checkoutDeliveryAddressFacade: CheckoutDeliveryAddressFacade;
  let logger: LoggerService;
  let eventService: EventService;
  let checkoutComPaymentFacade: CheckoutComPaymentFacade;
  let billingAddressFormService: CheckoutComBillingAddressFormService;
  let checkoutComConnector: CheckoutComConnector;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CheckoutComBillingAddressFormComponent,
        MockCxSpinnerComponent,
        CardComponent,
      ],
      imports: [
        ReactiveFormsModule,
        I18nTestingModule,
        NgSelectModule,
        FormErrorsModule,
        FeaturesConfigModule,
        NgSelectA11yModule,
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
        }
      ]
    }).overrideComponent(CheckoutComBillingAddressFormComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComBillingAddressFormComponent);
    userAddressService = TestBed.inject(UserAddressService);
    userPaymentService = TestBed.inject(UserPaymentService);
    checkoutDeliveryAddressFacade = TestBed.inject(CheckoutDeliveryAddressFacade);
    component = fixture.componentInstance;
    checkoutComPaymentFacade = TestBed.inject(CheckoutComPaymentFacade);
    checkoutComConnector = TestBed.inject(CheckoutComConnector);
    billingAddressFormService = TestBed.inject(CheckoutComBillingAddressFormService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getAllBillingCountries', () => {
    it('should fetch all billing countries and assign them to countries$', (done) => {
      const mockCountries = [{
        isocode: 'US',
        name: 'United States'
      }];
      spyOn(userPaymentService, 'getAllBillingCountries').and.returnValue(of(mockCountries));

      component.getAllBillingCountries();

      component.countries$.subscribe((countries) => {
        expect(countries).toEqual(mockCountries);
        expect(userPaymentService.loadBillingCountries).not.toHaveBeenCalled();
        done();
      });
    });

    it('should load billing countries if store is empty', (done) => {
      spyOn(userPaymentService, 'getAllBillingCountries').and.returnValue(of([]));

      component.getAllBillingCountries();

      component.countries$.subscribe(() => {
        expect(userPaymentService.loadBillingCountries).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('getDeliveryAddressState', () => {
    it('should fetch delivery address state and assign it to deliveryAddress$', (done) => {
      const mockAddressState: QueryState<Address> = {
        loading: false,
        data: mockDeliveryAddress,
        error: false
      };
      spyOn(checkoutDeliveryAddressFacade, 'getDeliveryAddressState').and.returnValue(of(mockAddressState));

      component.getDeliveryAddressState();

      component.deliveryAddress$.subscribe((address) => {
        expect(address).toEqual(mockDeliveryAddress);
        done();
      });
    });

    it('should handle error when fetching delivery address state', (done) => {
      const error = new Error('Error');
      spyOn(component['logger'], 'error');
      spyOn(checkoutDeliveryAddressFacade, 'getDeliveryAddressState').and.returnValue(throwError(() => error));

      component.getDeliveryAddressState();

      component.deliveryAddress$.subscribe({
        next: (error) => {
          expect(component['logger'].error).toHaveBeenCalledWith('Error fetching delivery address', { error });
          done();
        },
      });
    });
  });

  describe('bindSameAsDeliveryAddressCheckbox', () => {
    it('should set sameAsDeliveryAddress to true if billing address is not set', () => {
      const mockDeliveryAddress: Address = { id: '1' };
      component.deliveryAddress$ = of(mockDeliveryAddress);
      component['billingAddress$'] = of(undefined);

      component.bindSameAsDeliveryAddressCheckbox();

      expect(component.sameAsDeliveryAddress).toBeTrue();
    });

    it('should set sameAsDeliveryAddress to true if billing address ID matches delivery address ID', () => {
      const mockDeliveryAddress: Address = { id: '1' };
      const mockBillingAddress: Address = { id: '1' };
      component.deliveryAddress$ = of(mockDeliveryAddress);
      component['billingAddress$'] = of(mockBillingAddress);

      component.bindSameAsDeliveryAddressCheckbox();

      expect(component.sameAsDeliveryAddress).toBeTrue();
    });

    it('should set sameAsDeliveryAddress to false if billing address ID does not match delivery address ID', () => {
      const mockDeliveryAddress: Address = { id: '1' };
      const mockBillingAddress: Address = { id: '2' };
      component.deliveryAddress$ = of(mockDeliveryAddress);
      component['billingAddress$'] = of(mockBillingAddress);

      component.bindSameAsDeliveryAddressCheckbox();

      expect(component.sameAsDeliveryAddress).toBeFalse();
    });
  });

  describe('getRegionBindingLabel', () => {

    it('should enable region control when regions are available', (done) => {
      const mockRegions: Region[] = [{
        isocode: 'CA-ON',
        name: 'Ontario'
      }];
      spyOn(userAddressService, 'getRegions').and.returnValue(of(mockRegions));
      component.billingAddressForm = billingAddressFormService.getBillingAddressForm();
      component.countrySelected(mockCountries[0]);
      //component.selectedCountry$ = of('CA') as BehaviorSubject<string>;
      component.bindRegionsChanges();
      fixture.detectChanges();

      component.regions$.subscribe(() => {
        const regionControl = component.billingAddressForm.get('region.isocodeShort');
        expect(regionControl.enabled).toBeTrue();
        done();
      });
    });

    it('should disable region control when no regions are available', (done) => {
      spyOn(userAddressService, 'getRegions').and.returnValue(of([]));
      component.selectedCountry$ = of('CA') as BehaviorSubject<string>;

      component.bindRegionsChanges();

      component.regions$.subscribe(() => {
        const regionControl = component.billingAddressForm.get('region.isocodeShort');
        expect(regionControl.disabled).toBeTrue();
        done();
      });
    });

    it('should return name when regions have name property', () => {
      const regions: Region[] = [{
        isocode: 'CA-ON',
        name: 'Ontario'
      }];
      const result = component.getRegionBindingLabel(regions);
      expect(result).toBe('name');
    });

    it('should return isocodeShort when regions have isocodeShort property', () => {
      const regions: Region[] = [{
        isocode: 'CA-ON',
        isocodeShort: 'ON'
      }];
      const result = component.getRegionBindingLabel(regions);
      expect(result).toBe('isocodeShort');
    });

    it('should return isocode when regions have neither name nor isocodeShort property', () => {
      const regions: Region[] = [{ isocode: 'CA-ON' }];
      const result = component.getRegionBindingLabel(regions);
      expect(result).toBe('isocode');
    });

    it('should return isocode when regions array is empty', () => {
      const regions: Region[] = [];
      const result = component.getRegionBindingLabel(regions);
      expect(result).toBe('isocode');
    });

    it('should return isocode when regions is undefined', () => {
      const result = component.getRegionBindingLabel(undefined);
      expect(result).toBe('isocode');
    });
  });

  describe('getRegionBindingValue', () => {
    it('should return isocode when regions have isocode property', () => {
      const regions: Region[] = [{ isocode: 'CA-ON' }];
      const result = component.getRegionBindingValue(regions);
      expect(result).toBe('isocode');
    });

    it('should return isocodeShort when regions have isocodeShort property', () => {
      const regions: Region[] = [{ isocodeShort: 'ON' }];
      const result = component.getRegionBindingValue(regions);
      expect(result).toBe('isocodeShort');
    });

    it('should return isocode when regions have neither isocode nor isocodeShort property', () => {
      const regions: Region[] = [{}];
      const result = component.getRegionBindingValue(regions);
      expect(result).toBe('isocode');
    });

    it('should return isocode when regions array is empty', () => {
      const regions: Region[] = [];
      const result = component.getRegionBindingValue(regions);
      expect(result).toBe('isocode');
    });

    it('should return isocode when regions is undefined', () => {
      const result = component.getRegionBindingValue(undefined);
      expect(result).toBe('isocode');
    });
  });

  describe('submitForm', () => {
    it('should call updatePaymentAddress and disable edit mode when form is valid', (done) => {
      component.billingAddressForm.patchValue(formData);
      spyOn(checkoutComPaymentFacade, 'updatePaymentAddress').and.returnValue(of(null));
      spyOn(component, 'disableEditMode');

      component.submitForm();

      expect(checkoutComPaymentFacade.updatePaymentAddress).toHaveBeenCalledWith(component.billingAddressForm.value);
      expect(component.disableEditMode).toHaveBeenCalled();
      done();
    });

    it('should show errors when form is invalid', () => {
      component.billingAddressForm.setErrors({ invalid: true });
      spyOn(component.billingAddressForm, 'markAllAsTouched');

      component.submitForm();

      expect(component.billingAddressForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should handle error when updatePaymentAddress fails', (done) => {
      const error = new Error('Error');
      component.billingAddressForm.patchValue(mockAddress);
      spyOn(checkoutComPaymentFacade, 'updatePaymentAddress').and.returnValue(throwError(() => error));
      spyOn(component, 'showErrors');

      component.submitForm();

      expect(component.showErrors).toHaveBeenCalledWith(
        undefined,
        'CheckoutComBillingAddressFormComponent::submitForm',
        error
      );
      done();
    });
  });

  describe('enableEditMode', () => {
    it('should enable edit mode by setting edit toggle state to true', () => {
      spyOn(billingAddressFormService, 'setEditToggleState');
      component.enableEditMode();
      expect(billingAddressFormService.setEditToggleState).toHaveBeenCalledWith(true);
    });
  });

  describe('disableEditMode', () => {
    it('should enable edit mode by setting edit toggle state to true', () => {
      spyOn(billingAddressFormService, 'setEditToggleState');
      component.disableEditMode();
      expect(billingAddressFormService.setEditToggleState).toHaveBeenCalledWith(false);
    });
  });

  describe('toggleSameAsDeliveryAddress', () => {
    it('should toggle sameAsDeliveryAddress and dispatch event when true', () => {
      spyOn(component['eventService'], 'dispatch');
      component.sameAsDeliveryAddress = true;
      spyOn(billingAddressFormService, 'getSameAsDeliveryAddress').and.returnValue(new BehaviorSubject<boolean>(!component.sameAsDeliveryAddress));
      component.toggleSameAsDeliveryAddress();

      expect(component['billingAddressFormService'].getSameAsDeliveryAddress().value).toBeFalse();
    });

    it('should toggle sameAsDeliveryAddress and not dispatch event when false', () => {
      spyOn(component['eventService'], 'dispatch');
      component.sameAsDeliveryAddress = false;
      spyOn(billingAddressFormService, 'getSameAsDeliveryAddress').and.returnValue(new BehaviorSubject<boolean>(!component.sameAsDeliveryAddress));

      component.toggleSameAsDeliveryAddress();

      expect(component['billingAddressFormService'].getSameAsDeliveryAddress().value).toBeTrue();
    });

    it('should call setSameAsDeliveryAddress with true when sameAsDeliveryAddress is true', () => {
      component.sameAsDeliveryAddress = true;
      spyOn(billingAddressFormService, 'setSameAsDeliveryAddress');

      component.toggleSameAsDeliveryAddress();

      expect(billingAddressFormService.setSameAsDeliveryAddress).toHaveBeenCalledWith(false, component['deliveryAddress']);
    });

    it('should call setSameAsDeliveryAddress with false when sameAsDeliveryAddress is false', () => {
      component.sameAsDeliveryAddress = false;
      spyOn(billingAddressFormService, 'setSameAsDeliveryAddress');

      component.toggleSameAsDeliveryAddress();

      expect(billingAddressFormService.setSameAsDeliveryAddress).toHaveBeenCalledWith(true, component['deliveryAddress']);
    });

  });

  describe('bindLoadingState', () => {
    it('should update processing$ observable with loading state', (done) => {
      const mockLoadingState: QueryState<CheckoutComPaymentDetails> = {
        loading: true,
        data: null,
        error: false
      };
      spyOn(checkoutComPaymentFacade, 'getPaymentDetailsState').and.returnValue(of(mockLoadingState));

      component.bindLoadingState();

      component.processing$.subscribe((loading) => {
        expect(loading).toBeTrue();
        done();
      });
    });

    it('should update processing$ observable with non-loading state', (done) => {
      const mockNonLoadingState: QueryState<CheckoutComPaymentDetails> = {
        loading: false,
        data: null,
        error: false
      };
      spyOn(checkoutComPaymentFacade, 'getPaymentDetailsState').and.returnValue(of(mockNonLoadingState));

      component.bindLoadingState();

      component.processing$.subscribe((loading) => {
        expect(loading).toBeFalse();
        done();
      });
    });
  });

  describe('updateBillingAddressForm', () => {
    it('should update the billing address form with the fetched regions', (done) => {
      const mockBillingAddress: Address = {
        firstName: 'John',
        lastName: 'Doe',
        country: { isocode: 'CA' },
        region: { isocode: 'CA-ON' }
      };
      const mockRegions: Region[] = [{
        isocode: 'CA-ON',
        isocodeShort: 'ON'
      }];
      spyOn(userAddressService, 'getRegions').and.returnValue(of(mockRegions));
      spyOn(component.billingAddressForm, 'patchValue');
      component['billingAddress$'] = of(mockBillingAddress);

      component.updateBillingAddressForm();

      component['billingAddress$'].subscribe(() => {
        expect(userAddressService.getRegions).toHaveBeenCalledWith('CA');
        expect(component.billingAddressForm.patchValue).toHaveBeenCalledWith({
          ...mockBillingAddress,
          region: { isocodeShort: 'CA-ON' }
        });
        done();
      });
    });
  });

  describe('showBillingAddress', () => {
    it('should return payment address if available', (done) => {
      const paymentAddress: Address = generateOneAddress();
      const billingAddress: Address = generateOneAddress();
      component['paymentAddress$'] = of(paymentAddress);
      component['billingAddress$'] = of(billingAddress);

      component.showBillingAddress().subscribe((address) => {
        expect(address).toEqual(billingAddress);
        done();
      });
    });

    it('should return billing address if payment address is not available', (done) => {
      const billingAddress: Address = generateOneAddress();
      component['paymentAddress$'] = of(null);
      component['billingAddress$'] = of(billingAddress);
      component.showBillingAddress().subscribe((address) => {
        expect(address).toEqual(billingAddress);
        done();
      });
    });
  });

  describe('showErrors', () => {
    it('should add an error message and log the error', () => {
      const text = 'Error message';
      const logMessage = 'Log message';
      const errorMessage = new Error('Error');
      spyOn(component['logger'], 'error');

      component.showErrors(text, logMessage, errorMessage);

      expect(component['globalMessageService'].add).toHaveBeenCalledWith(
        text,
        GlobalMessageType.MSG_TYPE_ERROR
      );
      expect(component['logger'].error).toHaveBeenCalledWith(logMessage, { error: errorMessage });
    });
  });

  describe('getAddressCardContent', () => {
    it('should return card content with region when address has region', (done) => {
      const address: Address = {
        firstName: 'John',
        lastName: 'Doe',
        line1: '123 Main St',
        line2: 'Apt 4',
        town: 'Springfield',
        region: { isocode: 'CA-ON' },
        country: { isocode: 'CA' },
        postalCode: '12345',
        phone: '123-456-7890'
      };

      component.getAddressCardContent(address).subscribe((card) => {
        expect(card).toEqual({
          textBold: 'John Doe',
          text: [
            '123 Main St',
            'Apt 4',
            'Springfield, CA-ON, CA',
            '12345',
            'addressCard.phoneNumber: 123-456-7890'
          ],
          actions: []
        });

        done();
      });
    });

    it('should return card content without region when address has no region', (done) => {
      const address: Address = {
        firstName: 'John',
        lastName: 'Doe',
        line1: '123 Main St',
        line2: 'Apt 4',
        town: 'Springfield',
        country: { isocode: 'CA' },
        postalCode: '12345',
        phone: '123-456-7890'
      };
      component.getAddressCardContent(address).subscribe((card) => {
        expect(card).toEqual({
          textBold: 'John Doe',
          text: [
            '123 Main St',
            'Apt 4',
            'Springfield, CA',
            '12345',
            'addressCard.phoneNumber: 123-456-7890'
          ],
          actions: []
        });
        done();
      });
    });

    it('should return card content with empty fields when address fields are empty', () => {
      const address: Address = {
        firstName: '',
        lastName: '',
        line1: '',
        line2: '',
        town: '',
        region: { isocode: '' },
        country: { isocode: '' },
        postalCode: '',
        phone: ''
      };
      component.getAddressCardContent(address).subscribe((card) => {
        expect(card).toEqual({
          textBold: ' ',
          text: [
            '',
            '',
            ', ',
            '',
            ''
          ],
          actions: []
        });
      });
    });

    it('should return card content with actions', (done) => {
      component['showSameAsDeliveryAddressCheckbox'] = true;
      component.sameAsDeliveryAddress = false;
      spyOn(billingAddressFormService, 'getSameAsDeliveryAddress').and.returnValue(new BehaviorSubject<boolean>(true));
      const address: Address = {
        firstName: 'John',
        lastName: 'Doe',
        line1: '123 Main St',
        line2: 'Apt 4',
        town: 'Springfield',
        region: { isocode: 'CA-ON' },
        country: { isocode: 'CA' },
        postalCode: '12345',
        phone: '123-456-7890'
      };

      component.getAddressCardContent(address).subscribe((card) => {
        expect(card).toEqual({
          textBold: 'John Doe',
          text: [
            '123 Main St',
            'Apt 4',
            'Springfield, CA-ON, CA',
            '12345',
            'addressCard.phoneNumber: 123-456-7890'
          ],
          actions: [{
            event: 'edit',
            name: 'common.edit'
          }]
        });
        done();
      });
    });
  });

});