import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutComFlowUIConfigurationData, CheckoutComPaymentSession, FlowEnabledDataResponseDTO } from '../../interfaces';
import { CheckoutComFlowAdapter } from './checkout-com-flow.adapter';

@Injectable()
export class CheckoutComFlowConnector {
  /**
   * Constructor for the CheckoutFlowComConnector class.
   *
   * @param {CheckoutComFlowAdapter} adapter - The adapter used for payment operations.
   * @since 2211.32.1
   */
  constructor(
    protected adapter: CheckoutComFlowAdapter
  ) {
  }

  /**
   * Checks if Checkout Flow is enabled.
   *
   * @returns {Observable<boolean>} An observable that emits a boolean indicating if ABC is enabled.
   * @since 2211.31.1
   */
  public requestIsFlowEnabled(): Observable<FlowEnabledDataResponseDTO> {
    return this.adapter.requestIsFlowEnabled();
  }

  /**
   * Get Checkout Flow configuration.
   *
   * @returns {Observable<CheckoutComFlowUIConfigurationData>} An observable that emits a boolean indicating if ABC is enabled.
   * @since 2211.31.1
   */
  public requestFlowUIConfiguration(): Observable<CheckoutComFlowUIConfigurationData> {
    return this.adapter.requestFlowUIConfiguration();
  }

  /**
   * Requests the payment session for the Checkout.com flow.
   *
   * This method retrieves the payment session details required
   * for processing payments in the Checkout.com integration.
   *
   * @returns {Observable<CheckoutComPaymentSession>} An observable that emits the payment session details.
   * @since 2211.31.1
   */
  public requestFlowPaymentSession(userId: string, cartId: string): Observable<CheckoutComPaymentSession> {
    return this.adapter.requestFlowPaymentSession(userId, cartId);
  }
}
