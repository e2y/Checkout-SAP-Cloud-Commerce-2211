import { Provider } from '@angular/core';
import { checkoutComApplepayConnectorProvider } from '../core/connectors';
import { checkoutComApplepayFacadeProvider } from '../core/facades/checkout-com-facade.providers';

export const checkoutComApplePayProviders: () => Provider[] = (): Provider[] => [
  ...checkoutComApplepayFacadeProvider,
  ...checkoutComApplepayConnectorProvider
];