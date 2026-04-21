import { Provider } from '@angular/core';
import { CheckoutAdapter } from '@spartacus/checkout/base/core';
import { OccCheckoutAdapter } from '@spartacus/checkout/base/occ';
import { OrderAdapter } from '@spartacus/order/core';
import { OccOrderAdapter } from '@spartacus/order/occ';
import { CheckoutComAchAdapter, CheckoutComAdapter, CheckoutComApmAdapter, CheckoutComApplepayAdapter, CheckoutComGooglepayAdapter } from '../connectors';
import { CheckoutComCheckoutBillingAddressAdapter } from '../connectors/checkout-com-checkout-billing-address/checkout-com-checkout-billing-address.adapter';
import { CheckoutComFlowAdapter } from '../connectors/checkout-com-flow/checkout-com-flow.adapter';
import { CheckoutComOrderAdapter } from '../connectors/checkout-com-order/checkout-com-order.adapter';
import { CheckoutComPaymentAdapter } from '../connectors/checkout-com-payment/checkout-com-payment.adapter';
import { OccCheckoutComAchAdapter } from './adapters/occ-checkout-com-ach.adapter';
import { OccCheckoutComApmAdapter } from './adapters/occ-checkout-com-apm.adapter';
import { OccCheckoutComApplepayAdapter } from './adapters/occ-checkout-com-applepay.adapter';
import { OccCheckoutComCheckoutBillingAddressAdapter } from './adapters/occ-checkout-com-checkout-billing-address.adapter';
import { OccCheckoutComFlowAdapter } from './adapters/occ-checkout-com-flow.adapter';
import { OccCheckoutComGooglePayAdapter } from './adapters/occ-checkout-com-googlepay.adapter';
import { OccCheckoutComOrderAdapter } from './adapters/occ-checkout-com-order.adapter';
import { OccCheckoutComPaymentAdapter } from './adapters/occ-checkout-com-payment.adapter';
import { OccCheckoutComAdapter } from './adapters/occ-checkout-com.adapter';

export const checkoutComAdapterProvider: Provider[] = [
  {
    provide: CheckoutAdapter,
    useClass: OccCheckoutAdapter
  },
  {
    provide: CheckoutComAdapter,
    useClass: OccCheckoutComAdapter
  }
];

export const checkoutComAchAdapterProvider: Provider[] = [
  {
    provide: CheckoutComAchAdapter,
    useClass: OccCheckoutComAchAdapter
  }
];

export const checkoutComApmAdapterProvider: Provider[] = [
  {
    provide: CheckoutComApmAdapter,
    useClass: OccCheckoutComApmAdapter
  }
];

export const checkoutComApplepayAdapterProvider: Provider[] = [
  {
    provide: CheckoutComApplepayAdapter,
    useClass: OccCheckoutComApplepayAdapter
  }
];

export const checkoutComOrderAdapterProvider: Provider[] = [
  {
    provide: OrderAdapter,
    useClass: OccOrderAdapter
  },
  {
    provide: CheckoutComOrderAdapter,
    useClass: OccCheckoutComOrderAdapter
  }
];

export const checkoutComGooglepayAdapterProvider: Provider[] = [
  {
    provide: CheckoutComGooglepayAdapter,
    useClass: OccCheckoutComGooglePayAdapter
  }
];

export const checkoutComPaymentAdapterProvider: Provider[] = [
  {
    provide: CheckoutComPaymentAdapter,
    useClass: OccCheckoutComPaymentAdapter
  }
];

export const checkoutComFlowAdapterProvider: Provider[] = [
  {
    provide: CheckoutComFlowAdapter,
    useClass: OccCheckoutComFlowAdapter
  }
];

export const checkoutComCheckoutBillingAddressAdapterProvider: Provider[] = [
  {
    provide: CheckoutComCheckoutBillingAddressAdapter,
    useClass: OccCheckoutComCheckoutBillingAddressAdapter
  }
];
/**
 * Aggregates all CheckoutCom adapter providers into a single array.
 *
 * @since 2211.43.0
 */
export const provideCheckoutComAdapters: () => Provider[] = (): Provider[] => [
  ...checkoutComAdapterProvider,
  ...checkoutComAchAdapterProvider,
  ...checkoutComApmAdapterProvider,
  ...checkoutComOrderAdapterProvider,
  ...checkoutComPaymentAdapterProvider,
  ...checkoutComFlowAdapterProvider,
  ...checkoutComCheckoutBillingAddressAdapterProvider
];
