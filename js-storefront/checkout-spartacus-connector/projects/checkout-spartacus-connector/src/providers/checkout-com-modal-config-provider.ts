import { Provider } from '@angular/core';
import { provideConfig } from '@spartacus/core';
import { CheckoutComModalConfig } from '../core/dialogs-configs';

export const checkoutComModalConfigProvider: () => Provider = (): Provider => (
  provideConfig(CheckoutComModalConfig)
);