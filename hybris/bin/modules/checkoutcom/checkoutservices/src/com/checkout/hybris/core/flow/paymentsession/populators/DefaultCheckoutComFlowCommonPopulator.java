package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.common.Currency;
import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.currency.services.CheckoutComCurrencyService;
import com.checkout.hybris.core.merchant.services.CheckoutComMerchantConfigurationService;
import com.checkout.payments.ThreeDSRequest;
import com.google.common.collect.ImmutableMap;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;

import java.util.Map;

public class DefaultCheckoutComFlowCommonPopulator implements Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> {

    protected static final String BUILD_VERSION_CONFIG_KEY = "build.version";
    protected static final String CHECKOUTSERVICES_CONNECTOR_VERSION_CONFIG_KEY = "checkoutservices.connector.version";
    protected static final String UDF5_KEY = "udf5";
    protected static final String DEFAULT_BUILD_VERSION = "develop";
    protected static final String HYBRIS = "hybris ";
    protected static final String EXTENSION = " extension ";

    private final CheckoutComMerchantConfigurationService checkoutComMerchantConfigurationService;
    private final CheckoutComCurrencyService checkoutComCurrencyService;
    private final ConfigurationService configurationService;

    public DefaultCheckoutComFlowCommonPopulator(final CheckoutComMerchantConfigurationService checkoutComMerchantConfigurationService,
                                                 final CheckoutComCurrencyService checkoutComCurrencyService,
                                                 final ConfigurationService configurationService) {
        this.checkoutComMerchantConfigurationService = checkoutComMerchantConfigurationService;
        this.checkoutComCurrencyService = checkoutComCurrencyService;
        this.configurationService = configurationService;
    }

    @Override
    public void populate(final CartModel cartModel, final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?> paymentSessionRequestBuilder) throws ConversionException {
        final String currencyIsoCode = cartModel.getCurrency().getIsocode();

        paymentSessionRequestBuilder
                .processingChannelId(checkoutComMerchantConfigurationService.getProcessingChannelId())
                .metadata(createUdfFiveMetadata())
                .currency(Currency.valueOf(currencyIsoCode))
                .amount(checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode, cartModel.getTotalPrice()))
                .reference(cartModel.getCheckoutComPaymentReference())
                .threeDS(ThreeDSRequest.builder()
                        .enabled(checkoutComMerchantConfigurationService.isThreeDSEnabled())
                        .attemptN3D(checkoutComMerchantConfigurationService.isAttemptNoThreeDSecure())
                        .build());
    }

    /**
     * Gets the generic metadata for every checkout.com request
     *
     * @return the generic metadata map
     */
    protected Map<String, Object> createUdfFiveMetadata() {
        final String buildVersion = configurationService.getConfiguration().getString(BUILD_VERSION_CONFIG_KEY);
        final String connectorVersion = configurationService.getConfiguration().getString(CHECKOUTSERVICES_CONNECTOR_VERSION_CONFIG_KEY, DEFAULT_BUILD_VERSION);
        final String udf5 = HYBRIS + buildVersion + EXTENSION + connectorVersion;
        return ImmutableMap.of(UDF5_KEY, udf5);
    }
}
