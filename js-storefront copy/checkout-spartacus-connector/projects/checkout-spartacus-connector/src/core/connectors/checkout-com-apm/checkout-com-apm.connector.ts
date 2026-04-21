import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutComApmAdapter } from './checkout-com-apm.adapter';
import { ApmPaymentDetails } from '../../interfaces';
import { ApmData } from '../../model/ApmData';
import { KlarnaInitParams } from '../../model/Klarna';

@Injectable()
export class CheckoutComApmConnector {
  /**
   * Constructor for the CheckoutComApmConnector class.
   *
   * @param {CheckoutComApmAdapter} adapter - The adapter used for payment operations.
   * @since 2211.31.1
   */
  constructor(
    protected adapter: CheckoutComApmAdapter
  ) {
  }

  /**
   * Creates the APM payment details for the given cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @param {ApmPaymentDetails} apmPaymentDetails - The details of the APM payment.
   * @returns {Observable<ApmPaymentDetails>} An observable that emits the created APM payment details.
   * @since 2211.31.1
   */
  public createApmPaymentDetails(
    userId: string,
    cartId: string,
    apmPaymentDetails: ApmPaymentDetails
  ): Observable<ApmPaymentDetails> {
    return this.adapter.createApmPaymentDetails(userId, cartId, apmPaymentDetails);
  }

  /**
   * Requests the available APMs for the given cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @returns {Observable<ApmData[]>} An observable that emits an array of available APM data.
   * @since 2211.31.1
   */
  public requestAvailableApms(
    userId: string,
    cartId: string,
  ): Observable<ApmData[]> {
    return this.adapter.requestAvailableApms(userId, cartId);
  }

  /**
   * Retrieves the Klarna initialization parameters for the given cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @returns {Observable<KlarnaInitParams | HttpErrorResponse>} An observable that emits the Klarna initialization parameters or an HTTP error response.
   * @since 2211.31.1
   */
  public getKlarnaInitParams(
    userId: string,
    cartId: string,
  ): Observable<KlarnaInitParams | HttpErrorResponse> {
    return this.adapter.getKlarnaInitParams(userId, cartId);
  }
}
