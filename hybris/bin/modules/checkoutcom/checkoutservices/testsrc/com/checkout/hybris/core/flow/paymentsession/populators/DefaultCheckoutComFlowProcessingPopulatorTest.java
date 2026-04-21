package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.currency.services.CheckoutComCurrencyService;
import com.checkout.payments.ProcessingSettings;
import de.hybris.platform.core.model.c2l.CurrencyModel;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.user.CustomerModel;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComFlowProcessingPopulatorTest {

    private static final String CURRENCY_ISO_CODE = "EUR";

    private static final Double DISCOUNT = 10.0;
    private static final Double SHIPPING = 5.0;
    private static final Double TAX = 2.0;
    private static final Double DUTY = 1.0;

    private static final Long DISCOUNT_DECIMAL = 10L;
    private static final Long SHIPPING_DECIMAL = 5L;
    private static final Long TAX_DECIMAL = 2L;
    private static final Long DUTY_DECIMAL = 1L;

    @Spy
    @InjectMocks
    private DefaultCheckoutComFlowProcessingPopulator testObj;

    @Mock
    private CheckoutComCurrencyService checkoutComCurrencyServiceMock;

    @Mock
    private CartModel cartModelMock;

    @Mock
    private PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder paymentSessionRequestBuilderMock;

    @Mock
    private CurrencyModel currencyModelMock;

    @Mock
    private CustomerModel customerModelMock;


    @Test
    public void populate_shouldPopulateProcessing_whenProcessingIsGenerated() {
        ProcessingSettings processingStub = new ProcessingSettings();

        doReturn(processingStub).when(testObj).getProcessing(cartModelMock);

        testObj.populate(cartModelMock, paymentSessionRequestBuilderMock);

        verify(paymentSessionRequestBuilderMock).processing(processingStub);
    }


    @Test
    public void getProcessing_shouldPopulateAllAmounts_whenAllCartValuesExist() {
        when(cartModelMock.getCurrency()).thenReturn(currencyModelMock);
        when(currencyModelMock.getIsocode()).thenReturn(CURRENCY_ISO_CODE);

        when(cartModelMock.getUser()).thenReturn(customerModelMock);

        when(cartModelMock.getTotalDiscounts()).thenReturn(DISCOUNT);
        when(cartModelMock.getDeliveryCost()).thenReturn(SHIPPING);
        when(cartModelMock.getTotalTax()).thenReturn(TAX);
        when(customerModelMock.getDutyAmount()).thenReturn(DUTY);

        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_ISO_CODE, DISCOUNT)).thenReturn(DISCOUNT_DECIMAL);
        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_ISO_CODE, SHIPPING)).thenReturn(SHIPPING_DECIMAL);
        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_ISO_CODE, TAX)).thenReturn(TAX_DECIMAL);
        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_ISO_CODE, DUTY)).thenReturn(DUTY_DECIMAL);

        ProcessingSettings result = testObj.getProcessing(cartModelMock);

        assertThat(result).isNotNull();
        assertThat(result.getDiscountAmount()).isEqualTo(10L);
        assertThat(result.getShippingAmount()).isEqualTo(5L);
        assertThat(result.getTaxAmount()).isEqualTo(2L);
        assertThat(result.getDutyAmount()).isEqualTo(1L);
        assertThat(result.isAft()).isFalse();
    }


    @Test
    public void getProcessing_shouldNotSetDiscount_whenDiscountIsNull() {
        when(cartModelMock.getCurrency()).thenReturn(currencyModelMock);
        when(currencyModelMock.getIsocode()).thenReturn(CURRENCY_ISO_CODE);
        when(cartModelMock.getUser()).thenReturn(customerModelMock);

        when(cartModelMock.getTotalDiscounts()).thenReturn(null);

        ProcessingSettings result = testObj.getProcessing(cartModelMock);

        assertThat(result.getDiscountAmount()).isNull();
    }


    @Test
    public void getProcessing_shouldNotSetShipping_whenDeliveryCostIsNull() {
        when(cartModelMock.getCurrency()).thenReturn(currencyModelMock);
        when(currencyModelMock.getIsocode()).thenReturn(CURRENCY_ISO_CODE);
        when(cartModelMock.getUser()).thenReturn(customerModelMock);

        when(cartModelMock.getDeliveryCost()).thenReturn(null);

        ProcessingSettings result = testObj.getProcessing(cartModelMock);

        assertThat(result.getShippingAmount()).isNull();
    }


    @Test
    public void getProcessing_shouldNotSetTax_whenTotalTaxIsNull() {
        when(cartModelMock.getCurrency()).thenReturn(currencyModelMock);
        when(currencyModelMock.getIsocode()).thenReturn(CURRENCY_ISO_CODE);
        when(cartModelMock.getUser()).thenReturn(customerModelMock);

        when(cartModelMock.getTotalTax()).thenReturn(null);

        ProcessingSettings result = testObj.getProcessing(cartModelMock);

        assertThat(result.getTaxAmount()).isNull();
    }


    @Test
    public void getProcessing_shouldNotSetDuty_whenDutyAmountIsNull() {
        when(cartModelMock.getCurrency()).thenReturn(currencyModelMock);
        when(currencyModelMock.getIsocode()).thenReturn(CURRENCY_ISO_CODE);

        when(cartModelMock.getUser()).thenReturn(customerModelMock);
        when(customerModelMock.getDutyAmount()).thenReturn(null);

        ProcessingSettings result = testObj.getProcessing(cartModelMock);

        assertThat(result.getDutyAmount()).isNull();
    }

}
