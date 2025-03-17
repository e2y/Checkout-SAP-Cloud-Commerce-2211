import { Provider } from '@angular/core';
import { CheckoutComPaymentFacade } from '@checkout-core/facades/checkout-com-payment.facade';
import { CheckoutComAchFacade } from '@checkout-facades/checkout-com-ach.facade';
import { CheckoutComApmFacade } from '@checkout-facades/checkout-com-apm.facade';
import { CheckoutComApplepayFacade } from '@checkout-facades/checkout-com-applepay.facade';
import { CheckoutComBillingAddressFormFacade } from '@checkout-facades/checkout-com-checkout-billing-address-form.facade';
import { CheckoutComGooglepayFacade } from '@checkout-facades/checkout-com-googlepay.facade';
import { CheckoutComOrderFacade } from '@checkout-facades/checkout-com-order.facade';
import { CheckoutComAchService } from '@checkout-services/ach/checkout-com-ach.service';
import { CheckoutComApmService } from '@checkout-services/apm/checkout-com-apm.service';
import { CheckoutComApplepayService } from '@checkout-services/applepay/checkout-com-applepay.service';
import { CheckoutComBillingAddressFormService } from '@checkout-services/billing-address-form/checkout-com-billing-address-form.service';
import { CheckoutComGooglepayService } from '@checkout-services/googlepay/checkout-com-googlepay.service';
import { CheckoutComOrderService } from '@checkout-services/order/checkout-com-order.service';
import { CheckoutComPaymentService } from '@checkout-services/payment/checkout-com-payment.service';
import { ActiveCartService } from '@spartacus/cart/base/core';
import { ActiveCartFacade } from '@spartacus/cart/base/root';
import { CheckoutBillingAddressFormService } from '@spartacus/checkout/base/components';
import { CheckoutPaymentService, CheckoutQueryService } from '@spartacus/checkout/base/core';
import { CheckoutPaymentFacade, CheckoutQueryFacade } from '@spartacus/checkout/base/root';
import { OrderFacade } from '@spartacus/order/root';

export const checkoutComFacadeProviders: Provider[] = [
  ActiveCartService,
  {
    provide: ActiveCartFacade,
    useExisting: ActiveCartService,
  },
  CheckoutQueryService,
  {
    provide: CheckoutQueryFacade,
    useClass: CheckoutQueryService,
  },
  CheckoutComAchService,
  {
    provide: CheckoutComAchFacade,
    useExisting: CheckoutComAchService,
  },
  CheckoutComApmService,
  {
    provide: CheckoutComApmFacade,
    useExisting: CheckoutComApmService,
  },
  CheckoutComApplepayService,
  {
    provide: CheckoutComApplepayFacade,
    useExisting: CheckoutComApplepayService,
  },
  CheckoutComOrderService,
  {
    provide: CheckoutComOrderFacade,
    useExisting: CheckoutComOrderService,
  },
  {
    provide: OrderFacade,
    useExisting: CheckoutComOrderService,
  },
  CheckoutComGooglepayService,
  {
    provide: CheckoutComGooglepayFacade,
    useClass: CheckoutComGooglepayService,
  },
  CheckoutComPaymentService,
  {
    provide: CheckoutComPaymentFacade,
    useExisting: CheckoutComPaymentService,
  },
  {
    provide: CheckoutPaymentService,
    useExisting: CheckoutComPaymentService,
  },
  {
    provide: CheckoutPaymentFacade,
    useExisting: CheckoutComPaymentFacade,
  },
  CheckoutComBillingAddressFormService,
  {
    provide: CheckoutComBillingAddressFormFacade,
    useClass: CheckoutComBillingAddressFormService,
  },
  {
    provide: CheckoutBillingAddressFormService,
    useClass: CheckoutComBillingAddressFormService,
  },
];
