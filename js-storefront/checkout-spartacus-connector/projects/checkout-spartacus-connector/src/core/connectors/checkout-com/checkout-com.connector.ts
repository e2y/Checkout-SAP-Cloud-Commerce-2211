import { Injectable } from '@angular/core';
import { CheckoutComAdapter } from '@checkout-adapters/checkout-com/checkout-com.adapter';
import { Address } from '@spartacus/core';
import { Observable } from 'rxjs';



@Injectable()
export class CheckoutComConnector {
  /**
   * Constructor for the CheckoutComConnector class.
   *
   * @param {CheckoutComAdapter} adapter - The adapter used for payment operations.
   * @since 2211.31.1
   */
  constructor(
    protected adapter: CheckoutComAdapter
  ) {
  }

  /**
   * Retrieves the merchant key for the given user.
   *
   * @param {string} userId - The ID of the user.
   * @returns {Observable<string>} An observable that emits the merchant key.
   * @since 2211.31.1
   */
  public getMerchantKey(userId: string): Observable<string> {
    return this.adapter.getMerchantKey(userId);
  }

  /**
 * Checks if the user has ABC enabled.
 *
 * @param {string} userId - The ID of the user.
 * @returns {Observable<boolean>} An observable that emits a boolean indicating if ABC is enabled.
 * @since 2211.31.1
 */
  public getIsABC(userId: string): Observable<boolean> {
    return this.adapter.getIsABC(userId);
  }

  /**
   * Requests the billing address for the specified user and cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @returns {Observable<Address>} An observable that emits the billing address.
   */
  public requestBillingAddress(userId: string, cartId: string): Observable<Address> {
    return this.adapter.requestBillingAddress(userId, cartId);
  }

  /**
   * Updates the delivery address for the specified user and cart.
   *
   * @param {string} userId - The ID of the user.
   * @param {string} cartId - The ID of the cart.
   * @param {string} addressId - The ID of the address to update.
   * @returns {Observable<Address>} An observable that emits the updated delivery address.
   */
  public setDeliveryAddressAsBillingAddress(userId: string, cartId: string, addressId: string): Observable<Address> {
    return this.adapter.setDeliveryAddressAsBillingAddress(userId, cartId, addressId);
  }
}
