package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.common.Currency;
import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.currency.services.CheckoutComCurrencyService;
import com.checkout.hybris.core.merchant.services.CheckoutComMerchantConfigurationService;
import de.hybris.platform.core.model.c2l.CurrencyModel;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import org.apache.commons.configuration.Configuration;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComFlowCommonPopulatorTest {

    private static final String CURRENCY_ISO_CODE = "EUR";
    private static final Double TOTAL_PRICE = 100.0;
    private static final Long TOTAL_PRICE_DECIMAL = 100L;

    private static final String PROCESSING_CHANNEL_ID = "channel123";
    private static final String CHECKOUT_PAYMENT_REFERENCE = "ORDER123";

    private static final String BUILD_VERSION = "1.0.0";
    private static final String CONNECTOR_VERSION = "2.0.0";

    private static final String EXPECTED_UDF5 = "hybris " + BUILD_VERSION + " extension " + CONNECTOR_VERSION;
    private static final String EXPECTED_UDF5_WITH_DEFAULT = "hybris " + BUILD_VERSION + " extension " + DefaultCheckoutComFlowCommonPopulator.DEFAULT_BUILD_VERSION;

    @Spy
    @InjectMocks
    private DefaultCheckoutComFlowCommonPopulator testObj;

    @Mock
    private CheckoutComMerchantConfigurationService checkoutComMerchantConfigurationServiceMock;

    @Mock
    private CheckoutComCurrencyService checkoutComCurrencyServiceMock;

    @Mock
    private ConfigurationService configurationServiceMock;

    @Mock
    private CartModel cartModelMock;

    @Mock
    private CurrencyModel currencyModelMock;

    @Mock
    private Configuration configurationMock;

    private PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder paymentSessionRequestBuilderStub = PaymentSessionCreateRequest.builder();


    @Test
    public void populate_shouldPopulateAllFields_whenCartContainsValidData() {

        when(cartModelMock.getCurrency()).thenReturn(currencyModelMock);
        when(currencyModelMock.getIsocode()).thenReturn(CURRENCY_ISO_CODE);
        when(cartModelMock.getTotalPrice()).thenReturn(TOTAL_PRICE);

        when(checkoutComMerchantConfigurationServiceMock.isThreeDSEnabled())
                .thenReturn(true);
        when(checkoutComMerchantConfigurationServiceMock.isAttemptNoThreeDSecure())
                .thenReturn(false);
        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_ISO_CODE, TOTAL_PRICE))
                .thenReturn(TOTAL_PRICE_DECIMAL);

        when(checkoutComMerchantConfigurationServiceMock.getProcessingChannelId())
                .thenReturn(PROCESSING_CHANNEL_ID);

        when(cartModelMock.getCheckoutComPaymentReference()).thenReturn(CHECKOUT_PAYMENT_REFERENCE);

        Map<String, Object> metadataStub = Map.of("udf5", EXPECTED_UDF5);
        doReturn(metadataStub).when(testObj).createUdfFiveMetadata();

        testObj.populate(cartModelMock, paymentSessionRequestBuilderStub);

        final PaymentSessionCreateRequest result = paymentSessionRequestBuilderStub.build();
        assertThat(result.getAmount()).isEqualTo(TOTAL_PRICE_DECIMAL);
        assertThat(result.getCurrency()).isEqualTo(Currency.valueOf(CURRENCY_ISO_CODE));
        assertThat(result.getProcessingChannelId()).isEqualTo(PROCESSING_CHANNEL_ID);
        assertThat(result.getMetadata()).isEqualTo(metadataStub);
        assertThat(result.getReference()).isEqualTo(CHECKOUT_PAYMENT_REFERENCE);

        assertThat(result.getThreeDS().getEnabled()).isTrue();
        assertThat(result.getThreeDS().getAttemptN3D()).isFalse();
    }


    @Test
    public void createUdfFiveMetadata_shouldReturnMetadataWithVersions_whenConfigurationValuesExist() {

        when(configurationServiceMock.getConfiguration()).thenReturn(configurationMock);

        when(configurationMock.getString(DefaultCheckoutComFlowCommonPopulator.BUILD_VERSION_CONFIG_KEY))
                .thenReturn(BUILD_VERSION);

        when(configurationMock.getString(
                DefaultCheckoutComFlowCommonPopulator.CHECKOUTSERVICES_CONNECTOR_VERSION_CONFIG_KEY,
                DefaultCheckoutComFlowCommonPopulator.DEFAULT_BUILD_VERSION))
                .thenReturn(CONNECTOR_VERSION);

        Map<String, Object> result = testObj.createUdfFiveMetadata();

        assertThat(result).containsKey(DefaultCheckoutComFlowCommonPopulator.UDF5_KEY);
        assertThat(result.get(DefaultCheckoutComFlowCommonPopulator.UDF5_KEY))
                .isEqualTo(EXPECTED_UDF5);
    }


    @Test
    public void createUdfFiveMetadata_shouldUseDefaultConnectorVersion_whenConnectorVersionIsMissing() {

        when(configurationServiceMock.getConfiguration()).thenReturn(configurationMock);

        when(configurationMock.getString(DefaultCheckoutComFlowCommonPopulator.BUILD_VERSION_CONFIG_KEY))
                .thenReturn(BUILD_VERSION);

        when(configurationMock.getString(
                DefaultCheckoutComFlowCommonPopulator.CHECKOUTSERVICES_CONNECTOR_VERSION_CONFIG_KEY,
                DefaultCheckoutComFlowCommonPopulator.DEFAULT_BUILD_VERSION))
                .thenReturn(DefaultCheckoutComFlowCommonPopulator.DEFAULT_BUILD_VERSION);

        Map<String, Object> result = testObj.createUdfFiveMetadata();

        assertThat(result.get(DefaultCheckoutComFlowCommonPopulator.UDF5_KEY))
                .isEqualTo(EXPECTED_UDF5_WITH_DEFAULT);
    }

}
