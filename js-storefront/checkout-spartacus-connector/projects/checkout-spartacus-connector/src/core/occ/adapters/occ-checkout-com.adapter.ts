import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CheckoutComAdapter } from '@checkout-adapters/checkout-com/checkout-com.adapter';
import { getHeadersForUserId } from '@checkout-core/occ/adapters/occ-checkout-com.utils';
import { Address, ConverterService, LoggerService, Occ, OccEndpointsService } from '@spartacus/core';
import { Order, ORDER_NORMALIZER } from '@spartacus/order/root';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OccCheckoutComAdapter implements CheckoutComAdapter {

  protected logger: LoggerService = inject(LoggerService);

  /**
   * Constructor for the CheckoutComOccAdapter.
   * Initializes the adapter with the provided HTTP client, OCC endpoints service, and converter service.
   *
   * @param {HttpClient} http - The HTTP client service.
   * @param {OccEndpointsService} occEndpoints - The OCC endpoints service.
   * @param {ConverterService} converter - The converter service.
   * @since 4.7.2
   */
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService,
  ) {
  }

  /**
   * Constructor for the CheckoutComOccAdapter.
   * Initializes the adapter with the provided HTTP client, OCC endpoints service, and converter service.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Observable<string>} An observable that emits the merchant key as a string.
   * @since 4.7.2
   */
  getMerchantKey(userId: string): Observable<string> {
    return this.http.get<string>(
      this.occEndpoints.buildUrl('merchantKey'),
      {
        responseType: 'text' as 'json',
        headers: getHeadersForUserId(userId)
      }
    );
  }

  /**
   * Checks if the user has ABC enabled.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Observable<boolean>} An observable that emits a boolean indicating if ABC is enabled.
   * @since 4.7.2
   */
  getIsABC(userId: string): Observable<boolean> {
    return this.http.get<boolean>(
      this.occEndpoints.buildUrl('isABC'),
      {
        headers: getHeadersForUserId(userId)
      }
    );
  }

  /**
   * Places an order for the specified user and cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @param {boolean} termsChecked - Indicates if the terms and conditions have been accepted.
   * @returns {Observable<Order>} An observable that emits the placed order.
   * @since 4.7.2
   */
  placeOrder(userId: string, cartId: string, termsChecked: boolean): Observable<Order> {
    const params: HttpParams = new HttpParams()
      .set('fields', 'FULL')
      .set('termsChecked', termsChecked.toString());

    return this.http
      .post<Occ.Order>(
        this.occEndpoints.buildUrl('directPlaceOrder', {
          urlParams: {
            cartId,
            userId
          },
        }),
        {},
        {
          headers: getHeadersForUserId(userId),
          params
        }
      )
      .pipe(this.converter.pipeable(ORDER_NORMALIZER));
  }

  /**
   * Authorizes and places an order for the specified user and cart using a redirect session.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @param {string} sessionId - The session ID for the redirect.
   * @returns {Observable<Order>} An observable that emits the placed order.
   * @since 4.7.2
   */
  authorizeRedirectPlaceOrder(userId: string, cartId: string, sessionId: string): Observable<Order> {
    return this.http.post<Occ.Order>(
      this.occEndpoints.buildUrl('redirectPlaceOrder', {
        urlParams: {
          cartId,
          userId
        },
      }),
      { 'cko-session-id': sessionId },
      { headers: getHeadersForUserId(userId) }
    ).pipe(this.converter.pipeable(ORDER_NORMALIZER));
  }

  /**
   * Requests the billing address for the specified user and cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @returns {Observable<Address>} An observable that emits the requested billing address.
   * @since 2211.32.1
   */
  requestBillingAddress(userId: string, cartId: string): Observable<Address> {
    return this.http.get<Address>(
      this.occEndpoints.buildUrl('requestBillingAddress', {
        urlParams: {
          cartId,
          userId
        }
      })
    );
  }

  /**
   * Updates the delivery address for the specified user and cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @param {string} addressId - The ID of the address to set as the delivery address.
   * @returns {Observable<Address>} An observable that emits the updated delivery address.
   * @since 2211.32.1
   */
  setDeliveryAddressAsBillingAddress(userId: string, cartId: string, addressId: string): Observable<Address> {
    return this.http.put<Address>(
      this.occEndpoints.buildUrl('setDeliveryAddress', {
        urlParams: {
          userId,
          cartId
        },
        queryParams: {
          addressId
        }
      }),
      {
        headers: getHeadersForUserId(userId),
      }
    );
  }
}
