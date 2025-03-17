import { TestBed } from '@angular/core/testing';
import { CheckoutComAdapter } from '@checkout-core/adapters/checkout-com/checkout-com.adapter';
import { CheckoutComConnector } from '@checkout-core/connectors/checkout-com/checkout-com.connector';
import { Address } from '@spartacus/core';
import { of, throwError } from 'rxjs';

describe('CheckoutComConnector', () => {
  let service: CheckoutComConnector;
  let adapter: jasmine.SpyObj<CheckoutComAdapter>;

  beforeEach(() => {
    const adapterSpy = jasmine.createSpyObj('CheckoutComAdapter', [
      'getMerchantKey',
      'getIsABC',
      'requestBillingAddress',
      'setDeliveryAddressAsBillingAddress'
    ]);

    TestBed.configureTestingModule({
      providers: [
        CheckoutComConnector,
        {
          provide: CheckoutComAdapter,
          useValue: adapterSpy
        },
      ],
    });

    service = TestBed.inject(CheckoutComConnector);
    adapter = TestBed.inject(CheckoutComAdapter) as jasmine.SpyObj<CheckoutComAdapter>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return merchant key for valid user', (done) => {
    const userId = 'user1';
    const merchantKey = 'merchantKey';

    adapter.getMerchantKey.and.returnValue(of(merchantKey));

    service.getMerchantKey(userId).subscribe((result) => {
      expect(result).toBe(merchantKey);
      done();
    });

    expect(adapter.getMerchantKey).toHaveBeenCalledWith(userId);
  });

  it('should handle error when adapter fails to get merchant key', (done) => {
    const userId = 'user1';
    const error = new Error('error');

    adapter.getMerchantKey.and.returnValue(throwError(() => error));

    service.getMerchantKey(userId).subscribe({
      next: () => {
      },
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });

    expect(adapter.getMerchantKey).toHaveBeenCalledWith(userId);
  });

  it('should return true when adapter returns true for getIsABC', (done) => {
    const userId = 'user1';
    const isABC = true;

    adapter.getIsABC.and.returnValue(of(isABC));

    service.getIsABC(userId).subscribe((result) => {
      expect(result).toBe(isABC);
      done();
    });

    expect(adapter.getIsABC).toHaveBeenCalledWith(userId);
  });

  it('should return false when adapter returns false for getIsABC', (done) => {
    const userId = 'user1';
    const isABC = false;

    adapter.getIsABC.and.returnValue(of(isABC));

    service.getIsABC(userId).subscribe((result) => {
      expect(result).toBe(isABC);
      done();
    });

    expect(adapter.getIsABC).toHaveBeenCalledWith(userId);
  });

  it('should handle error when adapter fails to get IsABC', (done) => {
    const userId = 'user1';
    const error = new Error('error');

    adapter.getIsABC.and.returnValue(throwError(() => error));

    service.getIsABC(userId).subscribe({
      next: () => {
      },
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });

    expect(adapter.getIsABC).toHaveBeenCalledWith(userId);
  });

  it('should return billing address for valid user and cart', (done) => {
    const userId = 'user1';
    const cartId = 'cart1';
    const address: Address = { id: 'address1' };

    adapter.requestBillingAddress.and.returnValue(of(address));

    service.requestBillingAddress(userId, cartId).subscribe((result) => {
      expect(result).toBe(address);
      done();
    });

    expect(adapter.requestBillingAddress).toHaveBeenCalledWith(userId, cartId);
  });

  it('should handle error when adapter fails to get billing address', (done) => {
    const userId = 'user1';
    const cartId = 'cart1';
    const error = new Error('error');

    adapter.requestBillingAddress.and.returnValue(throwError(() => error));

    service.requestBillingAddress(userId, cartId).subscribe({
      next: () => {
      },
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });

    expect(adapter.requestBillingAddress).toHaveBeenCalledWith(userId, cartId);
  });

  it('should update delivery address for valid user, cart, and address', (done) => {
    const userId = 'user1';
    const cartId = 'cart1';
    const addressId = 'address1';
    const updatedAddress: Address = { id: 'address1' };

    adapter.setDeliveryAddressAsBillingAddress.and.returnValue(of(updatedAddress));

    service.setDeliveryAddressAsBillingAddress(userId, cartId, addressId).subscribe((result) => {
      expect(result).toBe(updatedAddress);
      done();
    });

    expect(adapter.setDeliveryAddressAsBillingAddress).toHaveBeenCalledWith(userId, cartId, addressId);
  });

  it('should handle error when adapter fails to update delivery address', (done) => {
    const userId = 'user1';
    const cartId = 'cart1';
    const addressId = 'address1';
    const error = new Error('error');

    adapter.setDeliveryAddressAsBillingAddress.and.returnValue(throwError(() => error));

    service.setDeliveryAddressAsBillingAddress(userId, cartId, addressId).subscribe({
      next: () => {
      },
      error: (err) => {
        expect(err).toBe(error);
        done();
      }
    });

    expect(adapter.setDeliveryAddressAsBillingAddress).toHaveBeenCalledWith(userId, cartId, addressId);
  });
});