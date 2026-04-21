import { NgModule } from '@angular/core';
import { checkoutComOccConfigProvider } from '../../providers/checkout-com-occ.config.provider';
import { checkoutComApplepayAdapterProvider } from './checkout-com-adapters.providers';

/**
 * Core OCC module that provides all necessary OCC adapters, facades, and guards
 * for Checkout.com integration with SAP Spartacus.
 *
 * This module includes:
 * - OCC endpoint configuration (defaultOccCheckoutComConfig)
 * - Adapter providers for all payment methods
 * - Facade providers for state management
 * - Guard providers for checkout flow
 * - Normalizers for data transformation
 *
 * @since 2211.43.0
 */
@NgModule({
  providers: [
    // OCC configuration - maps endpoint keys to actual URLs
    checkoutComOccConfigProvider(),

    // Adapter providers - register all adapters
    ...checkoutComApplepayAdapterProvider,
  ]
})
export class CheckoutComOccApplePayModule {
}
