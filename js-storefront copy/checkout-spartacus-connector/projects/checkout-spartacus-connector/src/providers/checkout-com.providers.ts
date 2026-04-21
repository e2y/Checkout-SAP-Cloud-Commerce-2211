import { Provider } from '@angular/core';
import { provideCheckoutComConnectors } from '../core/connectors';
import { checkoutComFacadeProviders } from '../core/facades/checkout-com-facade.providers';
import { provideCheckoutComGuards } from '../core/guards/checkout-com-guards-providers';
import { provideCheckoutComNormalizers } from '../core/normalizers/checkout-com-normalizers.providers';
import { checkoutComModalConfigProvider } from './checkout-com-modal-config-provider';

export const checkoutComProviders: () => Provider[] = (): Provider[] => [
  ...checkoutComFacadeProviders,
  ...provideCheckoutComConnectors(),
  ...provideCheckoutComNormalizers(),
  ...provideCheckoutComGuards(),
  checkoutComModalConfigProvider()
];