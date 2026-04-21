import { NgModule } from '@angular/core';
import { checkoutComOccConfigProvider } from '../../providers/checkout-com-occ.config.provider';
import { checkoutComGooglepayAdapterProvider } from './checkout-com-adapters.providers';

/**
 * Core OCC module that provides all necessary OCC adapters, facades, and guards
 * for Checkout.com integration with SAP Spartacus.
 *
 * This module includes:
 * - OCC endpoint configuration (checkoutComOccConfigProvider)
 * - Adapter providers for all payment methods, including Google Pay (checkoutComGooglepayAdapterProvider)
 *
 * @since 2211.43.0
 */
@NgModule({
  providers: [
    // OCC configuration - maps endpoint keys to actual URLs
    checkoutComOccConfigProvider(),

    // Adapter providers - register all adapters
    ...checkoutComGooglepayAdapterProvider,
  ]
})
export class CheckoutComOccGooglePayModule {
}
