package com.checkout.hybris.core.flow.paymentsession.converters;

import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;
import de.hybris.platform.servicelayer.dto.converter.Converter;

import java.util.List;

public class DefaultCheckoutComFlowCartPaymentSessionRequestConverter implements Converter<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?>> {

    final List<Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?>>> populatorList;

    public DefaultCheckoutComFlowCartPaymentSessionRequestConverter(final List<Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?>>> populatorList) {
        this.populatorList = populatorList;
    }

    @Override
    public PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?> convert(final CartModel cartModel) throws ConversionException {
        final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?> builder = PaymentSessionCreateRequest.builder();
        return convert(cartModel, builder);
    }

    @Override
    public PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?> convert(final CartModel cartModel,
                                                                                        final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder paymentSessionRequestBuilder)
            throws ConversionException {
        populatorList.forEach(populator -> populator.populate(cartModel, paymentSessionRequestBuilder));
        return paymentSessionRequestBuilder;
    }
}
