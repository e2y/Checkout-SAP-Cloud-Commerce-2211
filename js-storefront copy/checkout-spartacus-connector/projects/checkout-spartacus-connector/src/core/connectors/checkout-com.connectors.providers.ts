import { Provider } from '@angular/core';
import { CheckoutComAchConnector } from './checkout-com-ach/checkout-com-ach.connector';
import { CheckoutComApmConnector } from './checkout-com-apm/checkout-com-apm.connector';
import { CheckoutComApplepayConnector } from './checkout-com-applepay/checkout-com-applepay.connector';
import { CheckoutComGooglepayConnector } from './checkout-com-googlepay/checkout-com-googlepay.connector';
import { CheckoutComCheckoutBillingAddressConnector } from './checkout-com-checkout-billing-address/checkout-com-checkout-billing-address.connector';
import { CheckoutComFlowConnector } from './checkout-com-flow/checkout-com-flow.connector';
import { CheckoutComOrderConnector } from './checkout-com-order/checkout-com-order.connector';
import { CheckoutComPaymentConnector } from './checkout-com-payment/checkout-com-payment.connector';
import { CheckoutComConnector } from './checkout-com/checkout-com.connector';

export const checkoutComConnectorProvider: Provider[] = [CheckoutComConnector];

export const checkoutComAchConnectorProvider: Provider[] = [CheckoutComAchConnector];

export const checkoutComApmConnectorProvider: Provider[] = [CheckoutComApmConnector];

export const checkoutComApplepayConnectorProvider: Provider[] = [CheckoutComApplepayConnector];

export const checkoutComGooglepayConnectorProvider: Provider[] = [CheckoutComGooglepayConnector];

export const checkoutComCheckoutBillingAddressConnectorProvider: Provider[] = [CheckoutComCheckoutBillingAddressConnector];

export const checkoutComFlowConnectorProvider: Provider[] = [CheckoutComFlowConnector];

export const checkoutComOrderConnectorProvider: Provider[] = [CheckoutComOrderConnector];

export const checkoutComPaymentConnectorProvider: Provider[] = [CheckoutComPaymentConnector];

/**
 * Aggregates all CheckoutCom connector providers into a single array.
 *
 * @since 2211.43.0
 */
export const provideCheckoutComConnectors: () => Provider[] = (): Provider[] => [
  ...checkoutComConnectorProvider,
  ...checkoutComAchConnectorProvider,
  ...checkoutComApmConnectorProvider,
  ...checkoutComApplepayConnectorProvider,
  ...checkoutComGooglepayConnectorProvider,
  ...checkoutComCheckoutBillingAddressConnectorProvider,
  ...checkoutComFlowConnectorProvider,
  ...checkoutComOrderConnectorProvider,
  ...checkoutComPaymentConnectorProvider
];
