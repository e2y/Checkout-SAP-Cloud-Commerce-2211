package com.checkout.hybris.core.flow;

import com.checkout.handlepaymentsandpayouts.flow.responses.PaymentSessionResponse;

public interface CheckoutComFlowPaymentSessionService {
    PaymentSessionResponse createPaymentSession();
}
