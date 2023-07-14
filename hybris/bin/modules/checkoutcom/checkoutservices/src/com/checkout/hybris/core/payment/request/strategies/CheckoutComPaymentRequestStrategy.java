package com.checkout.hybris.core.payment.request.strategies;

import com.checkout.sdk.payments.PaymentRequest;
import com.checkout.sdk.payments.RequestSource;
import de.hybris.platform.core.model.order.CartModel;

/**
 * Creates payment requests for different payment methods
 */
public interface CheckoutComPaymentRequestStrategy {

    /**
     * Creates the payment request to trigger the authorization with Checkout.com
     *
     * @param cart the session cart
     * @return the payment request
     */
    PaymentRequest<RequestSource> createPaymentRequest(CartModel cart);
}