package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.url.services.CheckoutComUrlService;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.core.model.order.CartModel;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComFlowUrlsPopulatorTest {

    private static final String SUCCESS_REDIRECT_URL = "/success";
    private static final String FAILURE_REDIRECT_URL = "/failure";
    private static final String FULL_SUCCESS_URL = "https://test.com/success";
    private static final String FULL_FAILURE_URL = "https://test.com/failure";

    @InjectMocks
    private DefaultCheckoutComFlowUrlsPopulator testObj;

    @Mock
    private CheckoutComUrlService checkoutComUrlServiceMock;

    @Mock
    private CMSSiteService cmsSiteServiceMock;

    @Mock
    private CMSSiteModel cmsSiteModelMock;

    @Mock
    private CartModel cartModelMock;

    private PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder paymentSessionRequestBuilderStub = PaymentSessionCreateRequest.builder();


    @Test
    public void populate_shouldPopulateSuccessAndFailureUrls_whenUrlsAreReturnedByServices() {
        when(cmsSiteServiceMock.getCurrentSite()).thenReturn(cmsSiteModelMock);
        when(cmsSiteModelMock.getCheckoutComSuccessRedirectUrl()).thenReturn(SUCCESS_REDIRECT_URL);
        when(cmsSiteModelMock.getCheckoutComFailureRedirectUrl()).thenReturn(FAILURE_REDIRECT_URL);

        when(checkoutComUrlServiceMock.getFullUrl(SUCCESS_REDIRECT_URL, true)).thenReturn(FULL_SUCCESS_URL);
        when(checkoutComUrlServiceMock.getFullUrl(FAILURE_REDIRECT_URL, true)).thenReturn(FULL_FAILURE_URL);

        testObj.populate(cartModelMock, paymentSessionRequestBuilderStub);
        final PaymentSessionCreateRequest paymentSessionRequest = paymentSessionRequestBuilderStub.build();

        assertThat(paymentSessionRequest.getFailureUrl()).isEqualTo(FULL_FAILURE_URL);
        assertThat(paymentSessionRequest.getSuccessUrl()).isEqualTo(FULL_SUCCESS_URL);
    }
}
