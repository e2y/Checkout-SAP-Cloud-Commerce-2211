import { Provider } from '@angular/core';
import { APM_NORMALIZER, APM_PAYMENT_DETAILS_NORMALIZER, CHECKOUT_COM_ADDRESS_NORMALIZER, COMPONENT_APM_NORMALIZER } from '../connectors';
import { ApmDataNormalizer } from './apm-data-normalizer';
import { ApmPaymentDetailsNormalizer } from './apm-payment-details-normalizer';
import { CheckoutComBillingAddressNormalizer } from './billing-address-normalizer';
import { ComponentApmNormalizer } from './component-apm-normalizer';

export const checkoutComApmNormalizerProvider: Provider[] = [
  {
    provide: APM_NORMALIZER,
    useClass: ApmDataNormalizer,
    multi: true
  },
];

export const checkoutComComponentApmNormalizerProvider: Provider[] = [
  {
    provide: COMPONENT_APM_NORMALIZER,
    useClass: ComponentApmNormalizer,
    multi: true
  },
];

export const checkoutComBillingAddressNormalizerProvider: Provider[] = [
  {
    provide: CHECKOUT_COM_ADDRESS_NORMALIZER,
    useExisting: CheckoutComBillingAddressNormalizer,
    multi: true,
  },
];

export const checkoutComApmPaymentDetailsNormalizerProvider: Provider[] = [
  {
    provide: APM_PAYMENT_DETAILS_NORMALIZER,
    useClass: ApmPaymentDetailsNormalizer,
    multi: true
  },
];

/**
 * Aggregates all CheckoutCom normalizer providers into a single array.
 *
 * @since 2211.43.0
 */
export const provideCheckoutComNormalizers: () => Provider[] = (): Provider[] => [
  ...checkoutComApmNormalizerProvider,
  ...checkoutComComponentApmNormalizerProvider,
  ...checkoutComBillingAddressNormalizerProvider,
  ...checkoutComApmPaymentDetailsNormalizerProvider,
];
