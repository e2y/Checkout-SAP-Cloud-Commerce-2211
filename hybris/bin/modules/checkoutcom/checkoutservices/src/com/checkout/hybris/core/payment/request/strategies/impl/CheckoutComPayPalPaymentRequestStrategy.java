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
import org.apache.commons.lang.StringUtils;

import static com.checkout.hybris.core.payment.enums.CheckoutComPaymentType.PAYPAL;
import static com.google.common.base.Preconditions.checkArgument;
import static de.hybris.platform.servicelayer.util.ServicesUtil.validateParameterNotNull;

/**
 * specific {@link CheckoutComPaymentRequestStrategy} implementation for PayPal apm payments
 */
public class CheckoutComPayPalPaymentRequestStrategy extends CheckoutComAbstractApmPaymentRequestStrategy {

    protected static final String INVOICE_NUMBER_KEY = "invoice_number";

    public CheckoutComPayPalPaymentRequestStrategy(final CheckoutComPhoneNumberStrategy checkoutComPhoneNumberStrategy,
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
    public CheckoutComPaymentType getStrategyKey() {
        return PAYPAL;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected PaymentRequest<RequestSource> getRequestSourcePaymentRequest(final CartModel cart,
                                                                           final String currencyIsoCode, final Long amount) {
        validateParameterNotNull(cart, "Cart model cannot be null");

        final PaymentRequest<RequestSource> paymentRequest = super.getRequestSourcePaymentRequest(cart, currencyIsoCode, amount);
        final AlternativePaymentSource source = (AlternativePaymentSource) paymentRequest.getSource();

        checkArgument(StringUtils.isNotBlank(cart.getCheckoutComPaymentReference()), "Payment reference can not be blank or null");
        source.put(INVOICE_NUMBER_KEY, cart.getCheckoutComPaymentReference());

        return paymentRequest;
    }
}
