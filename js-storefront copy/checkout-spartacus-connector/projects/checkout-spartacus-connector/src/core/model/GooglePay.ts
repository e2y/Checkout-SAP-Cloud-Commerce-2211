import { Address } from '@spartacus/core';
import { Order } from '@spartacus/order/root';

export interface GooglePayTransactionInfo {
  totalPriceStatus?: string;
  totalPrice?: string;
  currencyCode?: string;
  countryCode?: string;
  transactionId?: string;
  totalPriceLabel?: string;
  checkoutOption?: string;
}

export interface PaymentAuthorizationResult {
  transactionState?: string;
  error?: {
    reason: string;
    message: string;
    intent?: string;
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GooglePayMerchantConfiguration {
  baseCardPaymentMethod?: {
    parameters?: {
      allowedAuthMethods?: string[];
      allowedCardNetworks?: string[];
      billingAddressParameters?: {
        format?: string
      },
      billingAddressRequired?: boolean
    },
    type?: string,
  };
  clientSettings?: {
    environment?: string
    merchantInfo?: {
      merchantName?: string;
      merchantId?: string;
    },
    paymentDataCallbacks?: {
      onPaymentAuthorized?(payload: GooglePayPaymentRequest): Promise<any>;
      onPaymentDataChanged?(payload: IntermediatePaymentData): Promise<any>;
    }
  };
  gateway?: string;
  gatewayMerchantId?: string;
  merchantName?: string;
  merchantId?: string;
  transactionInfo?: GooglePayTransactionInfo;
}

export interface GooglePayPaymentExpressIntents extends GooglePayMerchantConfiguration {
  callbackIntents?: string[];
  shippingAddressRequired?: boolean;
  emailRequired?: boolean;
  shippingAddressParameters?: { [key: string]: any };
  shippingOptionRequired?: boolean;
}

export interface GooglePayPaymentRequest {
  apiVersion?: number;
  apiVersionMinor?: number;
  allowedPaymentMethods?: any[];
  paymentMethodData?: {
    type?: string;
    description?: string;
    info?: {
      billingAddress?: any;
    };
    tokenizationData?: {
      token?: string;
    };
  };
  shippingAddress?: any;
  email?: string;
}

export interface PaymentDataRequestUpdate {
  newOfferInfo?: GooglePayOfferInfo;
  newTransactionInfo?: GooglePayTransactionInfo;
  newShippingOptionParameters?: ShippingOptionParameters;
  error?: PaymentDataError;
}

interface PaymentDataCallbacks {
  onPaymentAuthorized?: () => Promise<PaymentAuthorizationResult>;
  onPaymentDataChanged?: () => Promise<PaymentDataRequestUpdate>;
}

interface GooglePayPaymentMethod {
  type?: 'CARD' | string;

  parameters?: {
    allowedAuthMethods?: string[];
    allowedCardNetworks?: string[];
    billingAddressRequired?: boolean;
    billingAddressParameters?: {
      format?: string;
    };
  };

  tokenizationSpecification?: {
    type?: 'PAYMENT_GATEWAY' | 'DIRECT';
    parameters?: {
      gateway?: string;
      gatewayMerchantId?: string;

      // para DIRECT
      protocolVersion?: string;
      publicKey?: string;
    };
  };
}

export interface GooglePayPaymentDataRequest {
  apiVersion?: number;
  apiVersionMinor?: number;

  allowedPaymentMethods?: GooglePayPaymentMethod[];

  transactionInfo?: GooglePayTransactionInfo;
  merchantInfo?: GooglePayMerchantConfiguration;

  emailRequired?: boolean;
  shippingAddressRequired?: boolean;
  shippingAddressParameters?: Address;

  callbackIntents?: CallbackTrigger[];
  paymentDataCallbacks?: PaymentDataCallbacks;

  offerInfo?: GooglePayOfferInfo;
}

export interface PlaceOrderResponse {
  redirectUrl?: any;
  status?: string;
  orderData?: Order;
}

export interface IntermediatePaymentData {
  callbackTrigger?: CallbackTrigger;
  shippingAddress?: IntermediateAddress;
  shippingOption?: SelectionOptionData;
}

export enum CallbackTrigger {
  INITIALIZE = 'INITIALIZE',
  SHIPPING_ADDRESS = 'SHIPPING_ADDRESS',
  SHIPPING_OPTION = 'SHIPPING_OPTION',
  PAYMENT_AUTHORIZATION = 'PAYMENT_AUTHORIZATION'
}

export interface IntermediateAddress {
  administrativeArea?: string;
  countryCode?: string;
  locality?: string;
  postalCode?: string;
}

export interface SelectionOptionData {
  id?: string;
}

export interface GooglePayOfferInfoDetails {
  offerDetail?: {
    redemptionCode?: string,
    description?: string
  };
}

export interface GooglePayOfferInfo {
  offers?: GooglePayOfferInfoDetails[];
}

export interface ShippingOptionParameters {
  shippingOptions?: SelectionOption[];
  defaultSelectedOptionId?: string;
}

export interface SelectionOption {
  id?: string;
  label?: string;
  description?: string;
}

export interface PaymentDataError {
  reason?: string;
  message?: string;
  intent?: string;
}

export interface GooglePaySession {
  googlePayAuth?: GooglePayPaymentRequest;
  googlePayMerchantConfiguration?: GooglePayMerchantConfiguration;
  googlePayPaymentAuthorizationResult?: PaymentAuthorizationResult;
  googlePayPaymentDataUpdate?: PaymentDataRequestUpdate;
}

export interface GooglePayAutoriseOrderParams {
  billingAddress?: Address;
  savePaymentMethod: boolean;
  shippingAddress?: Address;
  token?: any;
  email?: string;
}
