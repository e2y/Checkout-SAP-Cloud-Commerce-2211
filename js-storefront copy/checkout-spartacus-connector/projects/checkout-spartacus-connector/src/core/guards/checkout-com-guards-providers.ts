import { Provider } from '@angular/core';
import { CheckoutStepsSetGuard } from '@spartacus/checkout/base/components';
import { OrderConfirmationGuard } from '@spartacus/order/components';
import { CheckoutComStepsSetGuard } from './checkout-com-checkout-steps-set-guard.guard';
import { CheckoutComOrderConfirmationGuard } from './checkout-com-order-confirmation.guard';

export const checkoutComOrderConfirmationGuardProvider: Provider[] = [
  {
    provide: OrderConfirmationGuard,
    useExisting: CheckoutComOrderConfirmationGuard
  }
];

export const checkoutComCheckoutStepsSetGuardProvider: Provider[] = [
  {
    provide: CheckoutStepsSetGuard,
    useExisting: CheckoutComStepsSetGuard
  }
];

export const provideCheckoutComGuards: () => Provider[] = (): Provider[] => [
  ...checkoutComOrderConfirmationGuardProvider,
  ...checkoutComCheckoutStepsSetGuardProvider
];