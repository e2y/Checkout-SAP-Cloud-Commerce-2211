package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.currency.services.CheckoutComCurrencyService;
import com.checkout.payments.ProcessingSettings;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.user.CustomerModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;

import java.util.Optional;

public class DefaultCheckoutComFlowProcessingPopulator implements Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> {

    private final CheckoutComCurrencyService checkoutComCurrencyService;

    public DefaultCheckoutComFlowProcessingPopulator(final CheckoutComCurrencyService checkoutComCurrencyService) {
        this.checkoutComCurrencyService = checkoutComCurrencyService;
    }

    @Override
    public void populate(final CartModel cartModel, final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?> paymentSessionRequestBuilder) throws ConversionException {
        paymentSessionRequestBuilder.processing(getProcessing(cartModel));

    }

    protected ProcessingSettings getProcessing(final CartModel cartModel) {
        final ProcessingSettings processing = new ProcessingSettings();
        final String currencyIsoCode = cartModel.getCurrency().getIsocode();
        final CustomerModel customerModel = (CustomerModel) cartModel.getUser();

        processing.setAft(false);
        Optional.ofNullable(cartModel.getTotalDiscounts())
                .map(discount -> checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode, discount)).ifPresent(processing::setDiscountAmount);
        Optional.ofNullable(cartModel.getDeliveryCost())
                .map(deliveryCost -> checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode, deliveryCost)).ifPresent(processing::setShippingAmount);
        Optional.ofNullable(cartModel.getTotalTax())
                .map(totalTax -> checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode, totalTax)).ifPresent(processing::setTaxAmount);
        Optional.ofNullable(customerModel.getDutyAmount())
                .map(dutyAmount -> checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode, dutyAmount)).ifPresent(processing::setDutyAmount);
        Optional.ofNullable(cartModel.getDeliveryCostTaxes())
                        .map(shippingCostTaxes -> checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode, shippingCostTaxes.doubleValue())).ifPresent(processing::setShippingTaxAmount);
        return processing;
    }
}
