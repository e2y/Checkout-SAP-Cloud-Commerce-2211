import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { defaultOccCheckoutComConfig } from '@checkout-adapters/config/default-occ-checkout-com-config';
import { OccCheckoutComAdapter } from '@checkout-core/occ/adapters/occ-checkout-com.adapter';
import { Address, BaseOccUrlProperties, DynamicAttributes, OCC_USER_ID_ANONYMOUS, OccConfig, OccEndpointsService } from '@spartacus/core';

const MockOccModuleConfig: OccConfig = {
  backend: {
    occ: {
      baseUrl: '',
      prefix: ''
    }
  },

  context: {
    baseSite: ['']
  }
};

class MockOccEndpointsService {
  buildUrl(endpoint: string, attributes?: DynamicAttributes, propertiesToOmit?: BaseOccUrlProperties) {
    const pattern = defaultOccCheckoutComConfig.backend.occ.endpoints[endpoint];
    let templateString = pattern;
    const urlParams = attributes?.hasOwnProperty('urlParams') ? attributes.urlParams : [];

    if (urlParams) {

      Object.keys(urlParams).forEach((key) => {
        urlParams[key] = encodeURIComponent(urlParams[key]);
      });

      for (const variableLabel of Object.keys(urlParams)) {
        const placeholder = new RegExp('\\${' + variableLabel + '}', 'g');
        templateString = templateString.replace(
          placeholder,
          urlParams[variableLabel]
        );
      }
    }

    return templateString;
  }
}

describe('CheckoutComOccAdapter', () => {
  let service: OccCheckoutComAdapter;
  let httpMock: HttpTestingController;
  let userId: string = 'current';
  let cartId: string = 'cartId';
  let occEndpointsService: OccEndpointsService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        {
          provide: OccConfig,
          useValue: MockOccModuleConfig
        },
        {
          provide: OccEndpointsService,
          useClass: MockOccEndpointsService
        },
      ]
    });
    service = TestBed.inject(OccCheckoutComAdapter);
    httpMock = TestBed.inject(HttpTestingController);
    occEndpointsService = TestBed.inject(OccEndpointsService);

    spyOn(occEndpointsService, 'buildUrl').and.callThrough();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMerchantKey', () => {
    it('should return key', () => {
      service.getMerchantKey(userId).subscribe(res => expect(res).toEqual('pk_test_d4727781-a79c-460e-9773-05d762c63e8f'));
      expect(occEndpointsService.buildUrl).toHaveBeenCalledWith('merchantKey');

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.urlWithParams ===
          `merchantKey`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('text');
      mockReq.flush('pk_test_d4727781-a79c-460e-9773-05d762c63e8f');
    });

    it('should return key for guest users', () => {
      service.getMerchantKey(OCC_USER_ID_ANONYMOUS).subscribe(res => expect(res).toEqual('pk_test_d4727781-a79c-460e-9773-05d762c63e8f'));

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.urlWithParams === `merchantKey` &&
          !!req.headers.get('cx-use-client-token')
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('text');
      mockReq.flush('pk_test_d4727781-a79c-460e-9773-05d762c63e8f');
    });
  });

  describe('getIsABC', () => {
    it('should return true if ABC is enabled', () => {
      service.getIsABC(userId).subscribe(res => expect(res).toBeTrue());

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.urlWithParams === `merchantKey/isABC`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(true);
    });

    it('should return false if ABC is not enabled', () => {
      service.getIsABC(userId).subscribe(res => expect(res).toBeFalse());

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.urlWithParams === `merchantKey/isABC`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(false);
    });

    it('should handle error when checking if ABC is enabled', () => {
      const error = new Error('Http failure response for merchantKey/isABC: 500 Server Error');
      service.getIsABC(userId).subscribe({
        next: () => {
        },
        error: err => expect(err.message).toBe(error.message)
      });

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.urlWithParams === `merchantKey/isABC`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(error, {
        status: 500,
        statusText: 'Server Error'
      });
    });
  });

  describe('placeOrder', () => {
    it('should place order', () => {
      service.placeOrder(userId, cartId, true).subscribe();

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'POST' &&
          req.urlWithParams ===
          `users/current/carts/cartId/direct-place-order?fields=FULL&termsChecked=true`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush({});
    });

    it('should place order for guest', () => {
      service.placeOrder(OCC_USER_ID_ANONYMOUS, cartId, true).subscribe();

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'POST' &&
          req.urlWithParams ===
          `users/${OCC_USER_ID_ANONYMOUS}/carts/cartId/direct-place-order?fields=FULL&termsChecked=true` &&
          !!req.headers.get('cx-use-client-token')
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush({});
    });
  });

  describe('authorizeRedirectPlaceOrder', () => {
    it('should authorize redirect place order', () => {
      const sessionId = '1234';
      service.authorizeRedirectPlaceOrder(userId, cartId, sessionId).subscribe();

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'POST' &&
          req.urlWithParams ===
          `users/${userId}/carts/${cartId}/redirect-place-order?fields=FULL`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush({});
    });
  });

  describe('requestBillingAddress', () => {
    it('should request billing address for valid user and cart', (done) => {

      const userId = 'user1';
      const cartId = 'cart1';
      const address: Address = { id: 'address1' };

      service.requestBillingAddress(userId, cartId).subscribe((result) => {
        expect(result).toBe(address);
        done()
      });

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.urlWithParams === `users/${userId}/carts/${cartId}/checkoutoccbillingaddress`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(address);


    });

    it('should handle error when requesting billing address fails', (done) => {
      const userId = 'user1';
      const cartId = 'cart1';
      const error = new Error('Http failure response for users/user1/carts/cart1/checkoutoccbillingaddress: 500 Server Error');

      service.requestBillingAddress(userId, cartId).subscribe({
        next: () => {
        },
        error: (err) => {
          expect(err.message).toBe(error.message)
          done();
        }
      });

      const mockReq = httpMock.expectOne(req => {
        return (
          req.method === 'GET' &&
          req.urlWithParams === `users/${userId}/carts/${cartId}/checkoutoccbillingaddress`
        );
      });

      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(error, {
        status: 500,
        statusText: 'Server Error'
      });
    });
  });
});
