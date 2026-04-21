package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.common.Address;
import com.checkout.common.CountryCode;
import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.address.strategies.CheckoutComPhoneNumberStrategy;
import com.checkout.payments.ShippingDetails;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.c2l.CountryModel;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.user.AddressModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;
import org.apache.commons.lang3.StringUtils;

import java.util.Optional;

public class DefaultCheckoutComFlowShippingAddressPopulator implements Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> {

    protected CheckoutComPhoneNumberStrategy checkoutComPhoneNumberStrategy;

    public DefaultCheckoutComFlowShippingAddressPopulator(final CheckoutComPhoneNumberStrategy checkoutComPhoneNumberStrategy) {

        this.checkoutComPhoneNumberStrategy = checkoutComPhoneNumberStrategy;
    }

    @Override
    public void populate(final CartModel cartModel, final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?> paymentSessionRequestBuilder) throws ConversionException {
        paymentSessionRequestBuilder.shipping(createBillingAddress(cartModel.getDeliveryAddress()));
    }

    protected ShippingDetails createBillingAddress(final AddressModel deliveryAddress) {
        final ShippingDetails shipping = new ShippingDetails();

        final Optional<String> dialCode = Optional.ofNullable(deliveryAddress.getCountry())
                .map(CountryModel::getIsocode)
                .map(CountryCode::valueOf)
                .map(CountryCode::getDialCode);

        Optional.ofNullable(deliveryAddress.getPhone1())
                .filter(StringUtils::isNotBlank)
                .flatMap(phone -> checkoutComPhoneNumberStrategy.createPhone(dialCode.orElse(null), deliveryAddress))
                .ifPresent(shipping::setPhone);

        shipping.setAddress(createAddress(deliveryAddress));
        return shipping;
    }

    protected Address createAddress(final AddressModel addressModel) {
        final Address address = new Address();
        address.setAddressLine1(addressModel.getLine1());
        address.setAddressLine2(addressModel.getLine2());
        address.setCity(addressModel.getTown());
        address.setCountry(addressModel.getCountry() != null ? CountryCode.valueOf(addressModel.getCountry().getIsocode()) : null);
        address.setState(addressModel.getRegion() != null ? addressModel.getRegion().getName() : null);
        address.setZip(addressModel.getPostalcode());
        return address;
    }
}
