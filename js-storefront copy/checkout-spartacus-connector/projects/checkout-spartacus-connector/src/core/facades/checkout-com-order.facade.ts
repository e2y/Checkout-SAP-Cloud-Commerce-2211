import { Injectable } from '@angular/core';
import { facadeFactory } from '@spartacus/core';
import { OrderFacade } from '@spartacus/order/root';
import { Observable } from 'rxjs';
import { CheckoutComOrderResult } from '../interfaces';
import { CHECKOUT_COM_ORDER } from './feature-name';

@Injectable({
  providedIn: 'root',
  useFactory: (): CheckoutComOrderFacade =>
    facadeFactory({
      facade: CheckoutComOrderFacade,
      feature: CHECKOUT_COM_ORDER,
      methods: [
        // OOTB methods
        'getOrderDetails',
        'clearPlacedOrder',
        'setPlacedOrder',
        'placeOrder',
        'placePaymentAuthorizedOrder',
        'getPickupEntries',
        'getDeliveryEntries',
        // Custom methods for Checkout.com
        'authorizeOrder',
        'getOrderResultFromState',
      ],
    }),
})
export abstract class CheckoutComOrderFacade extends OrderFacade {

  /**
   * Send the session id from Checkout.com to the backend for order creation
   *
   * @param {string} sessionId - The session id from redirect
   * @returns {Observable<boolean>} - An observable that emits true if the order was created successfully
   * @since 2211.31.1
   */
  abstract authorizeOrder(sessionId: string): Observable<boolean>;

  /**
   * Retrieves the order result from the state.
   *
   * @returns {Observable<CheckoutComOrderResult>} - An observable containing the order result.
   * @since 2211.31.1
   */
  abstract getOrderResultFromState(): Observable<CheckoutComOrderResult>;
}
