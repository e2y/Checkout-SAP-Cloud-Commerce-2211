package com.checkout.hybris.core.payment.request.strategies.impl;

import com.checkout.hybris.core.address.strategies.CheckoutComPhoneNumberStrategy;
import com.checkout.hybris.core.model.CheckoutComAPMPaymentInfoModel;
import com.checkout.hybris.core.payment.request.mappers.CheckoutComPaymentRequestStrategyMapper;
import com.checkout.hybris.core.payment.request.strategies.CheckoutComPaymentRequestStrategy;
import com.checkout.hybris.core.populators.payments.CheckoutComCartModelToPaymentL2AndL3Converter;
import com.checkout.sdk.payments.AlternativePaymentSource;
import com.checkout.sdk.payments.PaymentRequest;
import com.checkout.sdk.payments.RequestSource;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.order.payment.PaymentInfoModel;

import java.util.Optional;

import static de.hybris.platform.servicelayer.util.ServicesUtil.validateParameterNotNull;
import static java.lang.String.format;
import static java.util.Optional.empty;

/**
 * Abstract {@link CheckoutComPaymentRequestStrategy} implementation for apm payments
 */
public abstract class CheckoutComAbstractApmPaymentRequestStrategy extends CheckoutComAbstractPaymentRequestStrategy implements CheckoutComPaymentRequestStrategy {
    protected CheckoutComAbstractApmPaymentRequestStrategy(final CheckoutComPhoneNumberStrategy checkoutComPhoneNumberStrategy,
                                                           final CheckoutComPaymentRequestStrategyMapper checkoutComPaymentRequestStrategyMapper,
                                                           final CheckoutComCartModelToPaymentL2AndL3Converter checkoutComCartModelToPaymentL2AndL3Converter,
                                                           final CheckoutPaymentRequestServicesWrapper checkoutPaymentRequestServicesWrapper) {
        super(checkoutComPhoneNumberStrategy, checkoutComPaymentRequestStrategyMapper,
              checkoutComCartModelToPaymentL2AndL3Converter, checkoutPaymentRequestServicesWrapper);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected PaymentRequest<RequestSource> getRequestSourcePaymentRequest(final CartModel cart,
                                                                           final String currencyIsoCode,
                                                                           final Long amount) {
        validateParameterNotNull(cart.getPaymentInfo(), "paymentInfo cannot be null");

        final PaymentInfoModel paymentInfo = cart.getPaymentInfo();
        if (paymentInfo instanceof CheckoutComAPMPaymentInfoModel) {
            return PaymentRequest.fromSource(new AlternativePaymentSource(
                    ((CheckoutComAPMPaymentInfoModel) paymentInfo).getType().toLowerCase()), currencyIsoCode, amount);
        } else {
            throw new IllegalArgumentException(
                    format("Strategy called with unsupported paymentInfo type : [%s] while trying to authorize cart: " +
                                   "[%s]",
                           paymentInfo.getClass().toString(), cart.getCode()));
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected Optional<Boolean> isCapture() {
        return empty();
    }
}
