import { NgModule } from '@angular/core';
import { CheckoutOccModule } from '@spartacus/checkout/base/occ';
import { UserOccModule } from '@spartacus/core';
import { OrderOccModule } from '@spartacus/order/occ';
import { checkoutComOccConfigProvider } from '../../providers/checkout-com-occ.config.provider';
import { provideCheckoutComAdapters } from './checkout-com-adapters.providers';

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
  imports: [
    OrderOccModule, // TODO: Validate if needed
    CheckoutOccModule, // TODO: Validate if needed
    UserOccModule // TODO: Validate if needed
  ],
  providers: [
    // OCC configuration - maps endpoint keys to actual URLs
    checkoutComOccConfigProvider(),

    // Adapter providers - register all adapters
    ...provideCheckoutComAdapters()
  ]
})
export class CheckoutComOccModule {
}
