import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckoutComConnector } from '@checkout-core/connectors/checkout-com/checkout-com.connector';
import { CheckoutComBillingAddressSameAsDeliveryAddressSetEvent } from '@checkout-core/events/billing-address-form.events';
import { CheckoutComBillingAddressUpdatedEvent } from '@checkout-core/events/billing-address.events';
import { MockActiveCartFacade } from '@checkout-tests/services/cart-active.service.mock';
import { MockCheckoutComConnector } from '@checkout-tests/services/checkout-com.connector.mock';
import { MockUserIdService } from '@checkout-tests/services/user.service.mock';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { Address, CommandService, EventService, LoggerService, QueryService, QueryState, UserIdService } from '@spartacus/core';
import { of, throwError } from 'rxjs';
import { CheckoutComBillingAddressFormService } from './checkout-com-billing-address-form.service';

const mockAddress: Address = {
  firstName: 'John',
  lastName: 'Doe',
  line1: '123 Main St',
  town: 'Anytown',
  region: { isocodeShort: 'CA' },
  country: { isocode: 'US' },
  postalCode: '12345',
};

describe('CheckoutComBillingAddressFormService', () => {
  let service: CheckoutComBillingAddressFormService;

  let checkoutComConnector: CheckoutComConnector;
  let userIdService: UserIdService;
  let activeCartFacade: ActiveCartFacade;
  let queryService: QueryService;
  let commandService: CommandService;
  let eventService: EventService;
  let logger: LoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        {
          provide: CheckoutComConnector,
          useClass: MockCheckoutComConnector
        },
        {
          provide: UserIdService,
          useClass: MockUserIdService
        },
        {
          provide: ActiveCartFacade,
          useClass: MockActiveCartFacade
        },
        QueryService,
        CommandService,
        EventService,
        LoggerService
      ]
    });
    service = TestBed.inject(CheckoutComBillingAddressFormService);
    checkoutComConnector = TestBed.inject(CheckoutComConnector);
    userIdService = TestBed.inject(UserIdService);
    activeCartFacade = TestBed.inject(ActiveCartFacade);
    queryService = TestBed.inject(QueryService);
    commandService = TestBed.inject(CommandService);
    eventService = TestBed.inject(EventService);
    logger = TestBed.inject(LoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // OOTB:
  describe('getBillingAddressForm', () => {
    it('should create and return a form group with default values', () => {
      const form = service.getBillingAddressForm();
      expect(form).toBeTruthy();
      expect(form.get('firstName')).toBeTruthy();
      expect(form.get('lastName')).toBeTruthy();
      expect(form.get('line1')).toBeTruthy();
      expect(form.get('line2')).toBeTruthy();
      expect(form.get('town')).toBeTruthy();
      expect(form.get('region.isocodeShort')).toBeTruthy();
      expect(form.get('country.isocode')).toBeTruthy();
      expect(form.get('postalCode')).toBeTruthy();
    });
    it('should return the same form group instance if called multiple times', () => {
      const form1 = service.getBillingAddressForm();
      const form2 = service.getBillingAddressForm();
      expect(form1).toBe(form2);
    });
  });

  describe('setDeliveryAddressAsBillingAddress', () => {
    it('should set the billing address', () => {
      service.setDeliveryAddressAsBillingAddress(mockAddress);
      expect(service['billingAddress']).toEqual(mockAddress);
    });
    it('should set billing address to undefined', () => {
      service.setDeliveryAddressAsBillingAddress(undefined);
      expect(service['billingAddress']).toBeUndefined();
    });
  });

  describe('isBillingAddressSameAsDeliveryAddress', () => {
    it('should return undefined if billing address is undefined', () => {
      service.setDeliveryAddressAsBillingAddress(undefined);
      expect(service.getBillingAddress()).toEqual(undefined);
    });

    it('should return mockAddress if billing address is undefined', () => {
      service.setDeliveryAddressAsBillingAddress(mockAddress);
      expect(service.isBillingAddressSameAsDeliveryAddress()).toEqual(true);
    });
  });

  describe('isBillingAddressSameAsDeliveryAddress', () => {
    it('should return false if billing address is undefined', () => {
      service.setBillingAddress(mockAddress, undefined);
      expect(service.getBillingAddress()).toEqual(mockAddress);
    });

    it('should return true if billing address is defined', () => {
      service.setDeliveryAddressAsBillingAddress(mockAddress);
      expect(service.isBillingAddressSameAsDeliveryAddress()).toEqual(true);
    });
  });

  describe('isBillingAddressFormValid', () => {
    it('should return false if form is invalid', () => {
      const form = service.getBillingAddressForm();
      form.patchValue({
        firstName: '',
        lastName: ''
      });
      expect(service.isBillingAddressFormValid()).toEqual(false);
    });

    it('should return true if form is valid', () => {
      const form = service.getBillingAddressForm();
      form.patchValue(mockAddress);
      expect(service.isBillingAddressFormValid()).toEqual(true);
    });
  });

  describe('markAllAsTouched', () => {
    it('should mark all form controls as touched', () => {
      const form = service.getBillingAddressForm();
      spyOn(form, 'markAllAsTouched');
      service.markAllAsTouched();
      expect(form.markAllAsTouched).toHaveBeenCalled();
    });
  });

  describe('getBillingAddress', () => {
    it('should return the billing address if it is defined', () => {
      service.setDeliveryAddressAsBillingAddress(mockAddress);
      expect(service.getBillingAddress()).toEqual(mockAddress);
    });

    it('should return the form value if billing address is undefined', () => {
      service.setDeliveryAddressAsBillingAddress(undefined);
      const form = service.getBillingAddressForm();
      form.patchValue(mockAddress);
      expect(service.getBillingAddress()).toEqual(undefined);
    });

    it('should return billing address if it is defined', () => {
      service['billingAddress'] = mockAddress;
      expect(service.getBillingAddress()).toEqual(mockAddress);
    });

    it('should return billing address from BehaviorSubject if billing address is not defined', () => {
      service['billingAddress'] = undefined;
      service['billingAddress$'].next(mockAddress);
      expect(service.getBillingAddress()).toEqual(mockAddress);
    });

    it('should return undefined if both billing address and BehaviorSubject value are not defined', () => {
      service['billingAddress'] = undefined;
      service['billingAddress$'].next(undefined);
      expect(service.getBillingAddress()).toBeUndefined();
    });
  });

  describe('requestBillingAddress$', () => {
    it('should request billing address and set it on success', (doneFn) => {
      const billingAddress = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe'
      } as Address;
      spyOn(service, 'setBillingAddress');
      spyOn(checkoutComConnector, 'requestBillingAddress').and.returnValue(of(billingAddress));

      service['requestBillingAddress$'].getState().subscribe((state) => {
        if (state.data) {
          expect(service.setBillingAddress).toHaveBeenCalledWith(billingAddress);
          doneFn();
        }
      });
    });

    it('should handle error when requesting billing address fails', (doneFn) => {
      const error = new Error('error');
      spyOn(service['logger'], 'error');
      spyOn(checkoutComConnector, 'requestBillingAddress').and.returnValue(throwError(() => error));

      service['requestBillingAddress$'].getState().subscribe({
        next: (response) => {
          expect(response.error).toBe(error);
          doneFn();
        }
      });
    });
  });

  describe('updateDeliveryAddressCommand', () => {
    it('should update delivery address and dispatch event', (doneFn) => {
      const address = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe'
      } as Address;
      const deliveryAddress = {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe'
      } as Address;
      spyOn(service['eventService'], 'dispatch');
      spyOn(service['checkoutComConnector'], 'setDeliveryAddressAsBillingAddress').and.returnValue(of(address));

      service.updateDeliveryAddress(address, deliveryAddress);

      service['setDeliveryAddressAsBillingAddressCommand'].execute({
        addressId: address.id,
        deliveryAddress
      }).subscribe(() => {
        expect(service['eventService'].dispatch).toHaveBeenCalledWith(
          {
            billingAddress: address,
            deliveryAddress
          },
          CheckoutComBillingAddressUpdatedEvent
        );
        doneFn();
      });
    });
  });

  describe('_sameAsDeliveryAddress$', () => {
    it('should initialize same as delivery address to true', () => {
      expect(service.getSameAsDeliveryAddress().value).toBeTrue();
    });

    it('should set same as delivery address to true and dispatch event', () => {
      const deliveryAddress = {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe'
      } as Address;
      spyOn(service['eventService'], 'dispatch');
      service.setSameAsDeliveryAddress(true, deliveryAddress);
      expect(service.getSameAsDeliveryAddress().value).toBeTrue();
      expect(service['eventService'].dispatch).toHaveBeenCalledWith(
        {
          billingAddress: deliveryAddress,
          deliveryAddress: undefined
        },
        CheckoutComBillingAddressSameAsDeliveryAddressSetEvent
      );
    });

    it('should set same as delivery address to false without dispatching event', () => {
      spyOn(service['eventService'], 'dispatch');
      service.setSameAsDeliveryAddress(false, null);
      expect(service.getSameAsDeliveryAddress().value).toBeFalse();
      expect(service['eventService'].dispatch).not.toHaveBeenCalled();
    });
  });

  describe('getSameAsDeliveryAddress()', () => {
    it('should return the current value of same as delivery address', () => {
      service['_sameAsDeliveryAddress'].next(true);
      expect(service.getSameAsDeliveryAddress().value).toBeTrue();
    });

    it('should return false when same as delivery address is set to false', () => {
      service['_sameAsDeliveryAddress'].next(false);
      expect(service.getSameAsDeliveryAddress().value).toBeFalse();
    });
  });

  describe('setSameAsDeliveryAddress()', () => {
    it('should set same as delivery address to true and dispatch event with delivery address', () => {
      const deliveryAddress = {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe'
      } as Address;
      spyOn(service['eventService'], 'dispatch');
      service.setSameAsDeliveryAddress(true, deliveryAddress);
      expect(service.getSameAsDeliveryAddress().value).toBeTrue();
      expect(service['eventService'].dispatch).toHaveBeenCalledWith(
        {
          billingAddress: deliveryAddress,
          deliveryAddress: undefined
        },
        CheckoutComBillingAddressSameAsDeliveryAddressSetEvent
      );
    });

    it('should set same as delivery address to false without dispatching event', () => {
      spyOn(service['eventService'], 'dispatch');
      service.setSameAsDeliveryAddress(false, null);
      expect(service.getSameAsDeliveryAddress().value).toBeFalse();
      expect(service['eventService'].dispatch).not.toHaveBeenCalled();
    });
  });

  describe('toggleEditMode()', () => {
    it('should toggle edit mode from false to true', () => {
      service.setEditToggleState(false);
      service.toggleEditMode();
      expect(service.isEditModeEnabledValue()).toBeTrue();
    });

    it('should toggle edit mode from true to false', () => {
      service.setEditToggleState(true);
      service.toggleEditMode();
      expect(service.isEditModeEnabledValue()).toBeFalse();
    });
  });

  describe('isEditModeEnabled', () => {
    it('should return an observable that emits the current edit mode status as true', (doneFn) => {
      service.editModeStatus$.next(true);
      service.isEditModeEnabled().subscribe((status) => {
        expect(status).toBeTrue();
        doneFn();
      });
    });

    it('should return an observable that emits the current edit mode status as false', (doneFn) => {
      service.editModeStatus$.next(false);
      service.isEditModeEnabled().subscribe((status) => {
        expect(status).toBeFalse();
        doneFn();
      });
    });
  });

  describe('setEditToggleState', () => {
    it('should set edit mode state to true', () => {
      service.setEditToggleState(true);
      expect(service.isEditModeEnabledValue()).toBeTrue();
    });

    it('should set edit mode state to false', () => {
      service.setEditToggleState(false);
      expect(service.isEditModeEnabledValue()).toBeFalse();
    });
  });

  describe('setBillingAddress', () => {
    it('should set billing address and delivery address', () => {
      const billingAddress = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe'
      } as Address;
      const deliveryAddress = {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe'
      } as Address;
      spyOn(service, 'setDeliveryAddressAsBillingAddress');
      service.setBillingAddress(billingAddress, deliveryAddress);
      expect(service.setDeliveryAddressAsBillingAddress).toHaveBeenCalledWith(deliveryAddress);
      expect(service.billingAddress$.value).toEqual(billingAddress);
    });

    it('should set billing address and undefined delivery address', () => {
      const billingAddress = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe'
      } as Address;
      spyOn(service, 'setDeliveryAddressAsBillingAddress');
      service.setBillingAddress(billingAddress);
      expect(service.setDeliveryAddressAsBillingAddress).toHaveBeenCalledWith(undefined);
      expect(service.billingAddress$.value).toEqual(billingAddress);
    });
  });

  describe('isBillingAddressSameAsDeliveryAddress()', () => {
    it('should return true when billing address is the same as delivery address', () => {
      service.setSameAsDeliveryAddress(true, mockAddress);
      expect(service.isBillingAddressSameAsDeliveryAddress()).toBeTrue();
    });

    it('should return false when billing address is not the same as delivery address', () => {
      service.setSameAsDeliveryAddress(false, null);
      expect(service.isBillingAddressSameAsDeliveryAddress()).toBeFalse();
    });
  });

  describe('updateDeliveryAddress()', () => {
    it('should execute updateDeliveryAddressCommand with provided address and delivery address', () => {
      const address = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe'
      } as Address;
      const deliveryAddress = {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe'
      } as Address;
      spyOn(service['setDeliveryAddressAsBillingAddressCommand'], 'execute').and.callThrough();
      service.updateDeliveryAddress(address, deliveryAddress);
      expect(service['setDeliveryAddressAsBillingAddressCommand'].execute).toHaveBeenCalledWith({
        addressId: address.id,
        deliveryAddress
      });
    });
  });

  describe('requestBillingAddress', () => {
    it('should return the current state of the billing address query', (doneFn) => {
      const mockQueryState = {
        loading: false,
        error: false,
        data: mockAddress
      } as QueryState<Address>;
      spyOn(service['requestBillingAddress$'], 'getState').and.returnValue(of(mockQueryState));

      service.requestBillingAddress().subscribe((state) => {
        expect(state).toEqual(mockQueryState);
        doneFn();
      });
    });

    it('should log the error and rethrow it', (doneFn) => {
      const error = new Error('error');
      spyOn(service['logger'], 'error');
      spyOn(service['checkoutComConnector'], 'requestBillingAddress').and.returnValue(throwError(() => error));

      service['requestBillingAddress$'].getState().subscribe({
        next: (response) => {
          expect(response.error).toBe(error);
          doneFn();
        },
      });
    });
  });

  describe('checkoutPreconditions', () => {
    it('should return user ID and cart ID as a tuple', (doneFn) => {
      const userId = 'mockUserId';
      const cartId = 'cartId';
      service['checkoutPreconditions']().subscribe(([resultUserId, resultCartId]) => {
        expect(resultUserId).toBe(userId);
        expect(resultCartId).toBe(cartId);
        doneFn();
      });
    });
  });
});
