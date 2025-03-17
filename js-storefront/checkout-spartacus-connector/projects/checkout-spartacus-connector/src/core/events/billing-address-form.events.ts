import { Address, CxEvent } from '@spartacus/core';

/**
 * Event triggered when the billing address is set to be the same as the delivery address during the checkout process.
 *
 * @extends {CxEvent}
 * @since 2211.32.1
 */
export class CheckoutComBillingAddressSameAsDeliveryAddressSetEvent extends CxEvent {
  static override readonly type: string = 'CheckoutComBillingAddressSameAsDeliveryAddressSetEvent';
  billingAddress: Address;
  deliveryAddress: Address;
}
