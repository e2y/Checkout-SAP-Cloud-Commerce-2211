import { Provider } from '@angular/core';
import { CheckoutBillingAddressFormService } from '@spartacus/checkout/base/components';
import { CheckoutPaymentService } from '@spartacus/checkout/base/core';
import { CheckoutPaymentFacade } from '@spartacus/checkout/base/root';
import { OrderFacade } from '@spartacus/order/root';
import { CheckoutComAchService } from '../services/ach/checkout-com-ach.service';
import { CheckoutComApmService } from '../services/apm/checkout-com-apm.service';
import { CheckoutComApplepayService } from '../services/applepay/checkout-com-applepay.service';
import { CheckoutComBillingAddressFormService } from '../services/billing-address-form/checkout-com-billing-address-form.service';
import { CheckoutComCheckoutBillingAddressService } from '../services/checkout-billing-address/checkout-com-checkout-billing-address.service';
import { CheckoutComFlowService } from '../services/flow/checkout-com-flow.service';
import { CheckoutComGooglepayService } from '../services/googlepay/checkout-com-googlepay.service';
import { CheckoutComOrderService } from '../services/order/checkout-com-order.service';
import { CheckoutComPaymentService } from '../services/payment/checkout-com-payment.service';
import { CheckoutComAchFacade } from './checkout-com-ach.facade';
import { CheckoutComApmFacade } from './checkout-com-apm.facade';
import { CheckoutComApplepayFacade } from './checkout-com-applepay.facade';
import { CheckoutComBillingAddressFormFacade } from './checkout-com-checkout-billing-address-form.facade';
import { CheckoutComCheckoutBillingAddressFacade } from './checkout-com-checkout-billing-address.facade';
import { CheckoutComFlowFacade } from './checkout-com-flow.facade';
import { CheckoutComGooglepayFacade } from './checkout-com-googlepay.facade';
import { CheckoutComOrderFacade } from './checkout-com-order.facade';
import { CheckoutComPaymentFacade } from './checkout-com-payment.facade';

export const checkoutComAchFacadeProvider: Provider[] = [
  CheckoutComAchService,
  {
    provide: CheckoutComAchFacade,
    useExisting: CheckoutComAchService
  },
];

export const checkoutComApmFacadeProvider: Provider[] = [
  CheckoutComApmService,
  {
    provide: CheckoutComApmFacade,
    useExisting: CheckoutComApmService
  }
];

export const checkoutComApplepayFacadeProvider: Provider[] = [
  CheckoutComApplepayService,
  {
    provide: CheckoutComApplepayFacade,
    useExisting: CheckoutComApplepayService
  }
];

export const checkoutComBillingAddressFormServiceProvider: Provider[] = [
  CheckoutComBillingAddressFormService,
  {
    provide: CheckoutBillingAddressFormService,
    useExisting: CheckoutComBillingAddressFormService
  }
];

export const checkoutComCheckoutBillingAddressFacade: Provider[] = [
  CheckoutComCheckoutBillingAddressService,
  {
    provide: CheckoutComCheckoutBillingAddressFacade,
    useExisting: CheckoutComCheckoutBillingAddressService
  }
];

export const checkoutComBillingAddressFormFacadeProviders: Provider[] = [
  CheckoutComBillingAddressFormService,
  {
    provide: CheckoutComBillingAddressFormFacade,
    useExisting: CheckoutComBillingAddressFormService
  }
];

export const checkoutComFlowFacadeProviders: Provider[] = [
  CheckoutComFlowService,
  {
    provide: CheckoutPaymentFacade,
    useExisting: CheckoutComFlowService
  },
  {
    provide: CheckoutComFlowFacade,
    useExisting: CheckoutComFlowService
  },
];

export const checkoutComGooglepayFacadeProvider: Provider[] = [
  CheckoutComGooglepayService,
  {
    provide: CheckoutComGooglepayFacade,
    useExisting: CheckoutComGooglepayService
  }
];

export const checkoutComOrderFacadeProvider: Provider[] = [
  CheckoutComOrderService,
  {
    provide: OrderFacade,
    useExisting: CheckoutComOrderService
  },
  {
    provide: CheckoutComOrderFacade,
    useExisting: CheckoutComOrderService
  },
];

export const checkoutComPaymentFacadeProvider: Provider[] = [
  CheckoutComPaymentService,
  {
    provide: CheckoutPaymentService,
    useExisting: CheckoutComPaymentService
  },
  {
    provide: CheckoutComPaymentFacade,
    useExisting: CheckoutComPaymentService
  },
];

export const checkoutComFacadeProviders: Provider[] = [
  ...checkoutComAchFacadeProvider,
  ...checkoutComApmFacadeProvider,
  ...checkoutComApplepayFacadeProvider,
  ...checkoutComBillingAddressFormServiceProvider,
  ...checkoutComCheckoutBillingAddressFacade,
  ...checkoutComBillingAddressFormFacadeProviders,
  ...checkoutComFlowFacadeProviders,
  ...checkoutComGooglepayFacadeProvider,
  ...checkoutComOrderFacadeProvider,
  ...checkoutComPaymentFacadeProvider
];
