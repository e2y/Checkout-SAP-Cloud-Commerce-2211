import { Provider } from '@angular/core';
import { OccConfig, provideConfig } from '@spartacus/core';
import { defaultOccCheckoutComConfig } from '../core/occ/adapters/default-occ-checkout-com-config';

export const checkoutComOccConfigProvider: () => Provider = (): Provider => (
  provideConfig(defaultOccCheckoutComConfig as OccConfig)
);