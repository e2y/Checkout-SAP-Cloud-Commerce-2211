import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConverterService, OccEndpointsService, PaymentDetails } from '@spartacus/core';
import { Observable, of, pluck } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { APM_NORMALIZER, APM_PAYMENT_DETAILS_NORMALIZER, CheckoutComApmAdapter } from '../../connectors';
import { ApmPaymentDetails } from '../../interfaces';
import { ApmData, AvailableApmResponseData } from '../../model/ApmData';
import { KlarnaInitParams } from '../../model/Klarna';
import { getHeadersForUserId } from './occ-checkout-com.utils';

@Injectable({
  providedIn: 'root'
})
export class OccCheckoutComApmAdapter implements CheckoutComApmAdapter {

  /**
   * Constructs an instance of OccCheckoutComApmAdapter.
   *
   * @param {HttpClient} http - The HTTP client used for making HTTP requests.
   * @param {OccEndpointsService} occEndpoints - The service for building OCC endpoint URLs.
   * @param {ConverterService} converter - The service for converting data.
   * @since 2211.31.1
   */
  constructor(
    protected http: HttpClient,
    protected occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {
  }

  /**
   * Creates APM (Alternative Payment Method) payment details for the specified user and cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @param {ApmPaymentDetails} paymentDetails - The APM payment details to create.
   * @returns {Observable<PaymentDetails>} An observable that emits the created payment details.
   * @since 2211.31.1
   */
  createApmPaymentDetails(
    userId: string,
    cartId: string,
    paymentDetails: ApmPaymentDetails
  ): Observable<PaymentDetails> {
    return this.http.post<ApmPaymentDetails>(
      this.occEndpoints.buildUrl('setApmPaymentDetails', {
        urlParams: {
          userId,
          cartId
        },
      }),
      paymentDetails,
      { headers: getHeadersForUserId(userId) }
    ).pipe(map((): PaymentDetails => this.converter.convert(paymentDetails, APM_PAYMENT_DETAILS_NORMALIZER)));
  }

  /**
   * Requests available APMs (Alternative Payment Methods) for the specified user and cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @returns {Observable<ApmData[]>} An observable that emits an array of available APM data.
   * @since 2211.31.1
   */
  requestAvailableApms(userId: string, cartId: string): Observable<ApmData[]> {
    return this.http.get<AvailableApmResponseData>(
      this.occEndpoints.buildUrl('availableApms', {
        urlParams: {
          cartId,
          userId
        },
      }),
      { headers: getHeadersForUserId(userId) }
    ).pipe(
      pluck('availableApmConfigurations'),
      this.converter.pipeableMany(APM_NORMALIZER));
  }

  /**
   * Retrieves the Klarna initialization parameters for the specified user and cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @returns {Observable<KlarnaInitParams>} An observable that emits the Klarna initialization parameters.
   * @since 2211.31.1
   */
  getKlarnaInitParams(userId: string, cartId: string): Observable<KlarnaInitParams | HttpErrorResponse> {
    return this.http.get(
      this.occEndpoints.buildUrl('klarnaClientToken', {
        urlParams: {
          cartId,
          userId
        },
      }),
      { headers: getHeadersForUserId(userId) }).pipe(
      catchError((error: unknown): Observable<HttpErrorResponse> => of(error as HttpErrorResponse)),
    );
  }
}
