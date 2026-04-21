import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { generateManyApmData, generateOneApmPaymentDetails } from '@checkout-tests/fake-data/apm.mock';
import { of, throwError } from 'rxjs';
import { CheckoutComApmAdapter } from './checkout-com-apm.adapter';
import { ApmPaymentDetails } from '../../interfaces';
import { CheckoutComApmConnector } from './checkout-com-apm.connector';
import { KlarnaInitParams } from '../../model/Klarna';

describe('CheckoutComApmConnector', () => {
  let service: CheckoutComApmConnector;
  let adapter: jasmine.SpyObj<CheckoutComApmAdapter>;

  beforeEach(() => {
    const adapterSpy = jasmine.createSpyObj('CheckoutComApmAdapter', ['createApmPaymentDetails', 'requestAvailableApms', 'getKlarnaInitParams']);

    TestBed.configureTestingModule({
      providers: [
        CheckoutComApmConnector,
        {
          provide: CheckoutComApmAdapter,
          useValue: adapterSpy
        },
      ],
    });

    service = TestBed.inject(CheckoutComApmConnector);
    adapter = TestBed.inject(CheckoutComApmAdapter) as jasmine.SpyObj<CheckoutComApmAdapter>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call adapter to create APM payment details', () => {
    const userId = 'user1';
    const cartId = 'cart1';
    const apmPaymentDetails = generateOneApmPaymentDetails();
    const apmPaymentDetailsResponse = {
      method: 'apm',
      id: '123'
    } as ApmPaymentDetails;

    adapter.createApmPaymentDetails.and.returnValue(of(apmPaymentDetailsResponse));

    let result;
    service.createApmPaymentDetails(userId, cartId, apmPaymentDetails).subscribe(res => result = res);

    expect(result).toEqual(apmPaymentDetailsResponse);
    expect(adapter.createApmPaymentDetails).toHaveBeenCalledWith(userId, cartId, apmPaymentDetails);
  });

  it('should handle error when adapter fails to create APM payment details', () => {
    const userId = 'user1';
    const cartId = 'cart1';
    const apmPaymentDetails = generateOneApmPaymentDetails();
    const error = new Error('error');

    adapter.createApmPaymentDetails.and.returnValue(throwError(() => error));

    let result;
    service.createApmPaymentDetails(userId, cartId, apmPaymentDetails).subscribe({
      next: () => {
      },
      error: err => result = err
    });

    expect(result).toBe(error);
    expect(adapter.createApmPaymentDetails).toHaveBeenCalledWith(userId, cartId, apmPaymentDetails);
  });

  it('should call adapter to request available APMs', () => {
    const userId = 'user1';
    const cartId = 'cart1';
    const apmData = generateManyApmData(2);

    adapter.requestAvailableApms.and.returnValue(of(apmData));

    let result;
    service.requestAvailableApms(userId, cartId).subscribe(res => result = res);

    expect(result).toEqual(apmData);
    expect(adapter.requestAvailableApms).toHaveBeenCalledWith(userId, cartId);
  });

  it('should handle error when adapter fails to request available APMs', () => {
    const userId = 'user1';
    const cartId = 'cart1';
    const error = new Error('error');

    adapter.requestAvailableApms.and.returnValue(throwError(() => error));

    let result;
    service.requestAvailableApms(userId, cartId).subscribe({
      next: () => {
      },
      error: err => result = err
    });

    expect(result).toBe(error);
    expect(adapter.requestAvailableApms).toHaveBeenCalledWith(userId, cartId);
  });

  it('should return Klarna init params from adapter for the given user and cart', () => {
    const userId = 'user1';
    const cartId = 'cart1';
    const klarnaInitParams = {
      clientToken: 'client-token',
      paymentMethodCategories: []
    } as unknown as KlarnaInitParams;

    adapter.getKlarnaInitParams.and.returnValue(of(klarnaInitParams));

    let result: KlarnaInitParams | HttpErrorResponse;
    service.getKlarnaInitParams(userId, cartId).subscribe((res) => result = res);

    expect(result).toEqual(klarnaInitParams);
    expect(adapter.getKlarnaInitParams).toHaveBeenCalledWith(userId, cartId);
  });

  it('should return empty Klarna init params payload when adapter responds with an empty object', () => {
    const userId = 'user1';
    const cartId = 'cart1';
    const klarnaInitParams = {} as KlarnaInitParams;

    adapter.getKlarnaInitParams.and.returnValue(of(klarnaInitParams));

    let result: KlarnaInitParams | HttpErrorResponse;
    service.getKlarnaInitParams(userId, cartId).subscribe((res) => result = res);

    expect(result).toEqual({});
    expect(adapter.getKlarnaInitParams).toHaveBeenCalledWith(userId, cartId);
  });

  it('should propagate adapter error when requesting Klarna init params fails', () => {
    const userId = 'user1';
    const cartId = 'cart1';
    const error = new Error('klarna-init-error');

    adapter.getKlarnaInitParams.and.returnValue(throwError(() => error));

    let result: unknown;
    service.getKlarnaInitParams(userId, cartId).subscribe({
      next: () => {
      },
      error: (err) => result = err
    });

    expect(result).toBe(error);
    expect(adapter.getKlarnaInitParams).toHaveBeenCalledWith(userId, cartId);
  });
});