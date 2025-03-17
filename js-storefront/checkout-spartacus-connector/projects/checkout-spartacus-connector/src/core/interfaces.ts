import { AchSuccessMetadata } from '@checkout-model/Ach';
import { PaymentType } from '@checkout-model/ApmData';
import { Address, HttpErrorModel, PaymentDetails } from '@spartacus/core';
import { Order } from '@spartacus/order/root';

/* eslint-enable @typescript-eslint/ban-ts-comment */
export interface CheckoutComPaymentDetails extends PaymentDetails {
  accountIban?: string;
  accountNumber?: string;
  accountType?: string;
  addressLine1?: string;
  addressLine2?: string;
  authorizationToken?: string;
  bic?: string;
  cardBin?: string;
  city?: string;
  companyName?: string;
  country?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  paymentToken?: string;
  paymentType?: string;
  postalCode?: string;
  routingNumber?: string;
  scheme?: string; // 'CARD'
  type?: string;
}

export interface ApmPaymentDetails {
  accountIban?: string;
  addressLine1?: string;
  addressLine2?: string;
  authorizationToken?: string;
  bic?: string;
  billingAddress?: Address;
  city?: string;
  country?: string;
  document?: string;
  firstName?: string;
  lastName?: string;
  mobileNumber?: string;
  paymentType?: SepaPaymentTypes;
  postalCode?: string;
  type?: PaymentType;
}

export enum SepaPaymentTypes {
  SINGLE = 'SINGLE',
  RECURRING = 'RECURRING'
}

export interface SepaPaymentTypeOption {
  code?: string;
  label?: string;
}

export interface CheckoutComRedirect {
  redirectUrl?: string;
  type?: string;
}

export const enum CHECKOUT_COM_LAUNCH_CALLER {
  ACH_ACCOUNTS_LIST = 'ACH_ACCOUNTS_LIST',
  APM_ACH_CONSENTS = 'APM_ACH_CONSENTS',
}

declare module '@spartacus/order/root' {
  // eslint-disable-next-line no-shadow
  export interface Order {
    qrCodeData?: string;
    replenishmentOrderCode?: string;
    paymentType?: string;
    checkoutComPaymentInfo?: CheckoutComPaymentDetails;
  }
}

declare module '@spartacus/checkout/base/root' {
  export interface CheckoutState {
    checkoutComPaymentInfo?: CheckoutComPaymentDetails;
  }
}

declare module '@spartacus/cart/base/root' {
  enum CartOutlets {
    CHECKOUT_COM_CART_ITEM_LIST = 'cx-cart-item-list',
    CHECKOUT_COM_ORDER_SUMMARY = 'cx-order-summary',
  }
}


export interface CheckoutComOrderResult {
  successful: boolean;
  httpError?: HttpErrorModel;
  order?: Order;
  redirect?: CheckoutComRedirect;
}

export interface AchOrderSuccessParams {
  publicToken: string;
  metadata: AchSuccessMetadata;
  customerConsents: boolean;
}