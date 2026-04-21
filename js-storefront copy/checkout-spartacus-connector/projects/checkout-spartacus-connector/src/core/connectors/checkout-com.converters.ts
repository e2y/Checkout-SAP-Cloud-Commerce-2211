import { InjectionToken } from '@angular/core';
import { Address, Converter, PaymentDetails } from '@spartacus/core';
import { ApmPaymentDetails } from '../interfaces';
import { ApmData, OccApmData } from '../model/ApmData';
import { OccCmsComponentWithMedia } from '../model/ComponentData';
// eslint-disable-next-line @typescript-eslint/typedef
export const APM_NORMALIZER = new InjectionToken<Converter<OccApmData, ApmData>>(
  'ApmNormalizer'
);
// eslint-disable-next-line @typescript-eslint/typedef
export const COMPONENT_APM_NORMALIZER = new InjectionToken<Converter<OccCmsComponentWithMedia, ApmData>>(
  'ComponentDataApmNormalizer'
);
// eslint-disable-next-line @typescript-eslint/typedef
export const APM_PAYMENT_DETAILS_NORMALIZER = new InjectionToken<Converter<ApmPaymentDetails, PaymentDetails>>(
  'ApmPaymentDetailsNormalizer'
);

// eslint-disable-next-line @typescript-eslint/typedef
export const CHECKOUT_COM_ADDRESS_NORMALIZER = new InjectionToken<Converter<Address, Address>>(
  'CheckoutComBillingAddressNormalizer'
);
