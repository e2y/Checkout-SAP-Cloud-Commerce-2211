import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import {
  CheckoutComApmAchAccountListModalComponent
} from '../storefrontlib/cms-components/checkout-com-apm-component/checkout-com-apm-ach/checkout-com-apm-ach-account-list-modal/checkout-com-apm-ach-account-list-modal.component';
import {
  CheckoutComApmAchConsentsComponent
} from '../storefrontlib/cms-components/checkout-com-apm-component/checkout-com-apm-ach/checkout-com-apm-ach-consents/checkout-com-apm-ach-consents.component';
import {
  CheckoutComFlowPlaceOrderPopUpComponent
} from '../storefrontlib/cms-components/checkout-com-flow/checkout-com-flow-place-order-pop-up/checkout-com-flow-place-order-pop-up.component';

export const CheckoutComModalConfig: LayoutConfig = {
  launch: {
    APM_ACH_CONSENTS: {
      inlineRoot: true,
      component: CheckoutComApmAchConsentsComponent,
      dialogType: DIALOG_TYPE.POPOVER_CENTER_BACKDROP
    },
    ACH_ACCOUNTS_LIST: {
      inlineRoot: true,
      component: CheckoutComApmAchAccountListModalComponent,
      dialogType: DIALOG_TYPE.POPOVER_CENTER_BACKDROP
    },
    FLOW_POPUP: {
      inlineRoot: true,
      component: CheckoutComFlowPlaceOrderPopUpComponent,
      dialogType: DIALOG_TYPE.POPOVER_CENTER_BACKDROP
    }
  }
};
