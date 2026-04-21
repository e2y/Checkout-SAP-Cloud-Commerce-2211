package com.checkout.hybris.core.flow.paymentsession.converters;

import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.order.CartModel;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComFlowCartPaymentSessionRequestConverterTest {

    DefaultCheckoutComFlowCartPaymentSessionRequestConverter testObj;

    @Mock
    private Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> populatorOneMock;

    @Mock
    private Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> populatorTwoMock;

    @Mock
    private CartModel cartModelMock;

    @Mock
    private PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?> paymentSessionRequestBuilderMock;

    @Before
    public void setUp() throws Exception {
        testObj =
                new DefaultCheckoutComFlowCartPaymentSessionRequestConverter(
                        List.of(populatorOneMock, populatorTwoMock)
                );
    }

    @Test
    public void convert_shouldCreateBuilderAndApplyAllPopulators_whenUsingSingleArgumentConvert() {
        PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder result = testObj.convert(cartModelMock);

        verify(populatorOneMock).populate(eq(cartModelMock), any());
        verify(populatorTwoMock).populate(eq(cartModelMock), any());
        assertThat(result).isNotNull();
    }

    @Test
    public void convert_shouldApplyAllPopulatorsAndReturnSameBuilder_whenBuilderIsProvided() {
        PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?> result =
                testObj.convert(cartModelMock, paymentSessionRequestBuilderMock);

        verify(populatorOneMock).populate(cartModelMock, paymentSessionRequestBuilderMock);
        verify(populatorTwoMock).populate(cartModelMock, paymentSessionRequestBuilderMock);

        assertThat(result).isEqualTo(paymentSessionRequestBuilderMock);
    }

}
