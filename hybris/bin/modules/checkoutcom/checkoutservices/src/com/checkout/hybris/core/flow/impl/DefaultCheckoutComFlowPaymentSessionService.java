package com.checkout.hybris.core.flow.impl;


import com.checkout.handlepaymentsandpayouts.flow.responses.PaymentSessionResponse;
import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.flow.CheckoutComFlowPaymentSessionService;
import com.checkout.hybris.core.flow.exception.CheckoutComPaymentSessionException;
import com.checkout.hybris.core.payment.services.CheckoutComApiService;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.order.CartService;
import de.hybris.platform.servicelayer.dto.converter.Converter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;
import java.util.concurrent.ExecutionException;

public class DefaultCheckoutComFlowPaymentSessionService implements CheckoutComFlowPaymentSessionService {

    private static final Logger LOG = LoggerFactory.getLogger(DefaultCheckoutComFlowPaymentSessionService.class);

    private final CartService cartService;
    private final CheckoutComApiService checkoutComApiService;
    private final Converter<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> paymentSessionRequestConverter;

    public DefaultCheckoutComFlowPaymentSessionService(final CartService cartService,
                                                       final CheckoutComApiService checkoutComApiService,
                                                       final Converter<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> paymentSessionRequestConverter) {
        this.cartService = cartService;
        this.checkoutComApiService = checkoutComApiService;
        this.paymentSessionRequestConverter = paymentSessionRequestConverter;
    }


    @Override
    public PaymentSessionResponse createPaymentSession() {
        if (cartService.hasSessionCart()) {
            final CartModel currentCart = cartService.getSessionCart();
            final PaymentSessionCreateRequest paymentSessionRequest = buildPaymentSessionRequest(currentCart);
            try {
                return checkoutComApiService.createCheckoutApi().flowClient().requestPaymentSession(paymentSessionRequest).get();
            } catch (final InterruptedException e) {
                LOG.error("InterruptedException while requesting payment session for cart code [{}]", currentCart.getCode());
                Thread.currentThread().interrupt();
                throw new CheckoutComPaymentSessionException("Error obtaining payment session", e);

            } catch (final ExecutionException e) {
                LOG.error("ExecutionException while requesting payment session for cart code [{}]", currentCart.getCode());
                throw new CheckoutComPaymentSessionException("Error obtaining payment session", e);
            }
        }
        return null;
    }

    protected PaymentSessionCreateRequest buildPaymentSessionRequest(final CartModel cartModel) {
        final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?> paymentSessionRequestBuilder = paymentSessionRequestConverter.convert(cartModel);
        return Optional.ofNullable(paymentSessionRequestBuilder)
                .map(PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder::build)
                .orElse(null);
    }

}
