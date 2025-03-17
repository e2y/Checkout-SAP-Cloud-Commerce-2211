import {
  CheckoutComApmAchAccountListModalComponent
} from '@checkout-components/checkout-com-apm-component/checkout-com-apm-ach/checkout-com-apm-ach-account-list-modal/checkout-com-apm-ach-account-list-modal.component';
import {
  CheckoutComApmAchConsentsComponent
} from '@checkout-components/checkout-com-apm-component/checkout-com-apm-ach/checkout-com-apm-ach-consents/checkout-com-apm-ach-consents.component';
import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';

export const CheckoutComModalConfig: LayoutConfig = {
  launch: {
    APM_ACH_CONSENTS: {
      inlineRoot: true,
      component: CheckoutComApmAchConsentsComponent,
      dialogType: DIALOG_TYPE.POPOVER_CENTER_BACKDROP,
    },
    ACH_ACCOUNTS_LIST: {
      inlineRoot: true,
      component: CheckoutComApmAchAccountListModalComponent,
      dialogType: DIALOG_TYPE.POPOVER_CENTER_BACKDROP,
    },
  }
};
