import { Provider } from '@angular/core';
import { CheckoutComOrderConfirmationGuard } from '@checkout-core/guards/checkout-com-order-confirmation.guard';
import { OrderConfirmationGuard } from '@spartacus/order/components';

export const checkoutComGuardsProviders: Provider[] = [
  {
    provide: OrderConfirmationGuard,
    useExisting: CheckoutComOrderConfirmationGuard,
  },
];
