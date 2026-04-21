package com.checkout.hybris.core.flow.paymentsession.populators;


import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.currency.services.CheckoutComCurrencyService;
import com.checkout.payments.ProductRequest;
import de.hybris.platform.core.model.c2l.CurrencyModel;
import de.hybris.platform.core.model.order.AbstractOrderEntryModel;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.order.delivery.DeliveryModeModel;
import de.hybris.platform.core.model.product.ProductModel;
import de.hybris.platform.core.model.product.UnitModel;
import de.hybris.platform.util.DiscountValue;
import de.hybris.platform.util.TaxValue;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComFlowItemsPopulatorTest {

    private static final String PRODUCT_NAME = "ProductName";
    private static final String PRODUCT_CODE = "P001";
    private static final String UNIT_NAME = "pieces";
    private static final long QUANTITY = 2L;
    private static final Double BASE_PRICE = 100.0;
    private static final long BASE_PRICE_NO_DECIMALS = 10000L;
    private static final Double TOTAL_PRICE = 200.0;
    private static final long TOTAL_PRICE_NO_DECIMALS = 20000L;
    private static final Long TAX_VALUE_ONE = 10L;
    private static final Long TAX_VALUE_TWO = 5L;
    private static final Long DISCOUNT_VALUE_ONE = 3L;
    private static final Long DISCOUNT_VALUE_TWO = 2L;
    private static final double DELIVERY_COST = 10.0;
    private static final String CURRENCY_EUR = "EUR";
    private static final long DELIVERY_COST_NO_DECIMALS = 1000L;
    private static final double TAXES_PERCENT = 15.00;
    private static final long TAXES_PERCENT_NO_DECIMALS = 1500L;
    private static final String TAX_1 = "tax1";
    private static final String TAX_2 = "tax2";
    private static final String DISCOUNT_1 = "discount1";
    private static final String DISCOUNT_2 = "discount2";
    private static final String STANDARD = "standard";

    @Spy
    @InjectMocks
    private DefaultCheckoutComFlowItemsPopulator testObj;

    @Mock
    private CheckoutComCurrencyService checkoutComCurrencyServiceMock;

    @Mock
    private CartModel cartModelMock;
    @Mock
    private PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder paymentSessionRequestBuilderMock;
    @Mock
    private AbstractOrderEntryModel abstractOrderEntryModelOneMock;
    @Mock
    private AbstractOrderEntryModel abstractOrderEntryModelTwoMock;
    @Mock
    private ProductModel productModelMock;
    @Mock
    private UnitModel unitModelMock;
    @Mock
    private ProductRequest itemOneMock;
    @Mock
    private ProductRequest itemTwoMock;
    @Mock
    private CurrencyModel currencyModelMock;
    @Mock
    private DeliveryModeModel deliveryModeModelMock;

    @Test
    public void populate_shouldPopulateItems_whenItemsAreGenerated() {
        List<ProductRequest> itemsStub = List.of(itemOneMock, itemTwoMock);
        doReturn(itemsStub).when(testObj).getItems(cartModelMock);

        testObj.populate(cartModelMock, paymentSessionRequestBuilderMock);

        verify(paymentSessionRequestBuilderMock).items(itemsStub);
    }


    @Test
    public void getItems_shouldReturnItemList_whenCartContainsEntries() {

        when(cartModelMock.getEntries()).thenReturn(List.of(abstractOrderEntryModelOneMock, abstractOrderEntryModelTwoMock));
        when(cartModelMock.getCurrency()).thenReturn(currencyModelMock);
        when(currencyModelMock.getIsocode()).thenReturn(CURRENCY_EUR);
        when(cartModelMock.getTotalTaxValues()).thenReturn(List.of(new TaxValue(TAX_1, TAX_VALUE_ONE, true, 0, ""),
                new TaxValue(TAX_2, TAX_VALUE_TWO, true, 0, "")));
        when(cartModelMock.getDeliveryMode()).thenReturn(deliveryModeModelMock);
        when(deliveryModeModelMock.getCode()).thenReturn(STANDARD);
        when(cartModelMock.getDeliveryCost()).thenReturn(DELIVERY_COST);

        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_EUR, DELIVERY_COST)).thenReturn(DELIVERY_COST_NO_DECIMALS);
        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_EUR, TAXES_PERCENT)).thenReturn(TAXES_PERCENT_NO_DECIMALS);

        doReturn(itemOneMock).when(testObj).getItem(abstractOrderEntryModelOneMock);
        doReturn(itemTwoMock).when(testObj).getItem(abstractOrderEntryModelTwoMock);

        final List<ProductRequest> result = testObj.getItems(cartModelMock);

        assertThat(result).hasSize(3);
        assertThat(result.get(0)).isEqualTo(itemOneMock);
        assertThat(result.get(1)).isEqualTo(itemTwoMock);
    }


    @Test
    public void getItem_shouldPopulateItemFields_whenEntryContainsValues() {
        TaxValue taxValueOneStub = new TaxValue(TAX_1, TAX_VALUE_ONE, true, 0, "");
        TaxValue taxValueTwoStub = new TaxValue(TAX_2, TAX_VALUE_TWO, true, 0, "");
        DiscountValue discountValueOneStub = new DiscountValue(DISCOUNT_1, DISCOUNT_VALUE_ONE, true, 0, "", false);
        DiscountValue discountValueTwoStub = new DiscountValue(DISCOUNT_2, DISCOUNT_VALUE_TWO, true, 0, "", false);

        when(abstractOrderEntryModelOneMock.getProduct()).thenReturn(productModelMock);
        when(abstractOrderEntryModelOneMock.getOrder()).thenReturn(cartModelMock);
        when(cartModelMock.getCurrency()).thenReturn(currencyModelMock);
        when(currencyModelMock.getIsocode()).thenReturn(CURRENCY_EUR);
        when(productModelMock.getName()).thenReturn(PRODUCT_NAME);
        when(productModelMock.getCode()).thenReturn(PRODUCT_CODE);
        when(abstractOrderEntryModelOneMock.getQuantity()).thenReturn(QUANTITY);
        when(abstractOrderEntryModelOneMock.getUnit()).thenReturn(unitModelMock);
        when(unitModelMock.getName()).thenReturn(UNIT_NAME);
        when(abstractOrderEntryModelOneMock.getBasePrice()).thenReturn(BASE_PRICE);
        when(abstractOrderEntryModelOneMock.getTotalPrice()).thenReturn(TOTAL_PRICE);
        when(abstractOrderEntryModelOneMock.getTaxValues()).thenReturn(List.of(taxValueOneStub, taxValueTwoStub));
        when(abstractOrderEntryModelOneMock.getDiscountValues()).thenReturn(List.of(discountValueOneStub, discountValueTwoStub));

        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_EUR, BASE_PRICE)).thenReturn(BASE_PRICE_NO_DECIMALS);
        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_EUR, TOTAL_PRICE)).thenReturn(TOTAL_PRICE_NO_DECIMALS);
        when(checkoutComCurrencyServiceMock.removeDecimalsFromCurrencyAmount(CURRENCY_EUR,TAXES_PERCENT)).thenReturn(TAXES_PERCENT_NO_DECIMALS);

        final ProductRequest result = testObj.getItem(abstractOrderEntryModelOneMock);

        assertThat(result.getName()).isEqualTo(PRODUCT_NAME);
        assertThat(result.getReference()).isEqualTo(PRODUCT_CODE);
        assertThat(result.getCommodityCode()).isEqualTo(PRODUCT_CODE);
        assertThat(result.getQuantity()).isEqualTo(QUANTITY);
        assertThat(result.getUnitOfMeasure()).isEqualTo(UNIT_NAME);
        assertThat(result.getUnitPrice()).isEqualTo(BASE_PRICE_NO_DECIMALS);
        assertThat(result.getTotalAmount()).isEqualTo(TOTAL_PRICE_NO_DECIMALS);
        assertThat(result.getDiscountAmount()).isEqualTo((0L));
    }

}
