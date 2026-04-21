package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.common.Address;
import com.checkout.common.CountryCode;
import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.address.strategies.CheckoutComPhoneNumberStrategy;
import com.checkout.payments.BillingInformation;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.c2l.CountryModel;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.user.AddressModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;
import org.apache.commons.lang3.StringUtils;

import java.util.Optional;

public class DefaultCheckoutComFlowBillingAddressPopulator implements Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> {

    protected CheckoutComPhoneNumberStrategy checkoutComPhoneNumberStrategy;

    public DefaultCheckoutComFlowBillingAddressPopulator(final CheckoutComPhoneNumberStrategy checkoutComPhoneNumberStrategy) {

        this.checkoutComPhoneNumberStrategy = checkoutComPhoneNumberStrategy;
    }

    @Override
    public void populate(final CartModel cartModel, final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?> paymentSessionRequestBuilder) throws ConversionException {
        paymentSessionRequestBuilder.billing(createBillingAddress(cartModel.getPaymentAddress()));
    }

    protected BillingInformation createBillingAddress(final AddressModel paymentAddress) {
        final BillingInformation billing = new BillingInformation();


        final Optional<String> dialCode = Optional.ofNullable(paymentAddress.getCountry())
                .map(CountryModel::getIsocode)
                .map(CountryCode::valueOf)
                .map(CountryCode::getDialCode);

        Optional.ofNullable(paymentAddress.getPhone1())
                .filter(StringUtils::isNotBlank)
                .flatMap(phone -> checkoutComPhoneNumberStrategy.createPhone(dialCode.orElse(null), paymentAddress))
                .ifPresent(billing::setPhone);

        billing.setAddress(createAddress(paymentAddress));
        return billing;

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
