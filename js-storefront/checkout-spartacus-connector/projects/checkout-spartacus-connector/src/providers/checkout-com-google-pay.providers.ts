import { Provider } from '@angular/core';
import { checkoutComGooglepayConnectorProvider } from '../core/connectors';
import { checkoutComGooglepayFacadeProvider } from '../core/facades/checkout-com-facade.providers';

export const checkoutComGooglePayProviders: () => Provider[] = (): Provider[] => [
  ...checkoutComGooglepayFacadeProvider,
  ...checkoutComGooglepayConnectorProvider,
];