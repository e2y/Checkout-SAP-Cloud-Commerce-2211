package com.checkout.hybris.core.payment.request.strategies.impl;

import com.checkout.hybris.core.address.strategies.CheckoutComPhoneNumberStrategy;
import com.checkout.hybris.core.payment.enums.CheckoutComPaymentType;
import com.checkout.hybris.core.payment.request.mappers.CheckoutComPaymentRequestStrategyMapper;
import com.checkout.hybris.core.payment.request.strategies.CheckoutComPaymentRequestStrategy;
import com.checkout.hybris.core.populators.payments.CheckoutComCartModelToPaymentL2AndL3Converter;
import com.checkout.sdk.payments.AlternativePaymentSource;
import com.checkout.sdk.payments.PaymentRequest;
import com.checkout.sdk.payments.RequestSource;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.servicelayer.i18n.CommonI18NService;

import static com.checkout.hybris.core.payment.enums.CheckoutComPaymentType.KNET;

/**
 * specific {@link CheckoutComPaymentRequestStrategy} implementation for Knet apm payments
 */
@SuppressWarnings("java:S107")
public class CheckoutComKnetPaymentRequestStrategy extends CheckoutComAbstractApmPaymentRequestStrategy {

    protected static final String LANGUAGE_KEY = "language";

    protected final CommonI18NService commonI18NService;

    public CheckoutComKnetPaymentRequestStrategy(final CheckoutComPhoneNumberStrategy checkoutComPhoneNumberStrategy,
                                                 final CheckoutComPaymentRequestStrategyMapper checkoutComPaymentRequestStrategyMapper,
                                                 final CheckoutComCartModelToPaymentL2AndL3Converter checkoutComCartModelToPaymentL2AndL3Converter,
                                                 final CheckoutPaymentRequestServicesWrapper checkoutPaymentRequestServicesWrapper,
                                                 final CommonI18NService commonI18NService) {
        super(checkoutComPhoneNumberStrategy, checkoutComPaymentRequestStrategyMapper,
            checkoutComCartModelToPaymentL2AndL3Converter, checkoutPaymentRequestServicesWrapper);
        this.commonI18NService = commonI18NService;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public CheckoutComPaymentType getStrategyKey() {
        return KNET;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected PaymentRequest<RequestSource> getRequestSourcePaymentRequest(final CartModel cart,
                                                                           final String currencyIsoCode, final Long amount) {
        final PaymentRequest<RequestSource> paymentRequest = super.getRequestSourcePaymentRequest(cart, currencyIsoCode, amount);
        final AlternativePaymentSource source = (AlternativePaymentSource) paymentRequest.getSource();
        source.put(LANGUAGE_KEY, commonI18NService.getCurrentLanguage().getIsocode());

        return paymentRequest;
    }
}
