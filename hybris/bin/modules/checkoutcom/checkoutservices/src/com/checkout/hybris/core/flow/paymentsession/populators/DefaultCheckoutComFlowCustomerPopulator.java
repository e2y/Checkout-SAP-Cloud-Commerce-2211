package com.checkout.hybris.core.flow.paymentsession.populators;


import com.checkout.common.Phone;
import com.checkout.handlepaymentsandpayouts.flow.entities.Customer;
import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import de.hybris.platform.commerceservices.enums.CustomerType;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.user.AddressModel;
import de.hybris.platform.core.model.user.CustomerModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;
import org.apache.commons.lang3.StringUtils;

import java.util.Optional;

public class DefaultCheckoutComFlowCustomerPopulator implements Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?>> {

    @Override
    public void populate(final CartModel cartModel, final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?, ?> paymentSessionRequestBuilder) throws ConversionException {
        paymentSessionRequestBuilder.customer(getCustomer(cartModel));
    }

    protected Customer getCustomer(final CartModel cartModel) {
        final CustomerModel customerModel = (CustomerModel) cartModel.getUser();
        final Customer.CustomerBuilder customerBuilder = Customer.builder();

        final AddressModel paymentAddress = cartModel.getPaymentAddress();

        Optional.ofNullable(paymentAddress.getPhone1())
                .filter(StringUtils::isNotBlank)
                .map(phone -> Phone.builder().number(phone).build())
                .ifPresent(customerBuilder::phone);

        final String customerName = CustomerType.GUEST.equals(customerModel.getType())
                ? StringUtils.normalizeSpace(StringUtils.defaultString(paymentAddress.getFirstname()) +
                    StringUtils.SPACE +
                    StringUtils.defaultString(paymentAddress.getLastname()))
                : customerModel.getName();

        return customerBuilder
                .email(customerModel.getContactEmail())
                .name(customerName)
                .build();
    }

}
