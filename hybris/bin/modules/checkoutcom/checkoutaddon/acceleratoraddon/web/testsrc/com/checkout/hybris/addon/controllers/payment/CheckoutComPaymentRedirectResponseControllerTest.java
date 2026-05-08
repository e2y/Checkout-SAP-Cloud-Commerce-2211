package com.checkout.hybris.addon.controllers.payment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.checkout.hybris.core.payment.exception.CheckoutComPaymentIntegrationException;
import com.checkout.hybris.facades.accelerator.CheckoutComCheckoutFlowFacade;
import com.checkout.hybris.facades.flow.CheckoutComFlowConfigurationFacade;
import com.checkout.hybris.facades.flow.CheckoutComFlowPaymentInfoFacade;
import com.checkout.hybris.facades.payment.CheckoutComPaymentFacade;
import com.checkout.hybris.facades.payment.CheckoutComPaymentInfoFacade;
import com.checkout.payments.response.GetPaymentResponse;
import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.order.AcceleratorCheckoutFacade;
import de.hybris.platform.commercefacades.order.data.OrderData;
import de.hybris.platform.order.InvalidCartException;
import javax.servlet.http.HttpServletRequest;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributesModelMap;
import java.util.Optional;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class CheckoutComPaymentRedirectResponseControllerTest {

    private static final String CKO_SESSION_ID = "cko-session-123";
    private static final String ORDER_CODE = "order-001";

    @Spy
    @InjectMocks
    private CheckoutComPaymentRedirectResponseController testObj;

    @Mock
    private CheckoutComPaymentFacade checkoutComPaymentFacadeMock;
    @Mock
    private CheckoutComCheckoutFlowFacade checkoutFlowFacadeMock;
    @Mock
    private CheckoutComPaymentInfoFacade checkoutComPaymentInfoFacadeMock;
    @Mock
    private CheckoutComFlowConfigurationFacade checkoutComFlowConfigurationFacadeMock;
    @Mock
    private CheckoutComFlowPaymentInfoFacade checkoutComFlowPaymentInfoFacadeMock;
    @Mock
    private AcceleratorCheckoutFacade acceleratorCheckoutFacadeMock;
    @Mock
    private HttpServletRequest requestMock;
    @Mock
    private GetPaymentResponse getPaymentResponseMock;

    private final RedirectAttributes redirectAttributes = new RedirectAttributesModelMap();

    @Test
    public void handleFailureRedirect_shouldRemovePaymentInfoAndRedirectToChoosePaymentMethod() {
        final String result = testObj.handleFailureRedirect(redirectAttributes);

        verify(checkoutFlowFacadeMock).removePaymentInfoFromSessionCart();
        assertThat(result).isEqualTo("redirect:/checkout/multi/checkout-com/choose-payment-method");
    }

    @Test
    public void redirectToChoosePaymentMethodStep_shouldRemovePaymentInfoAndReturnRedirect() {
        final String result = testObj.redirectToChoosePaymentMethodStep();

        verify(checkoutFlowFacadeMock).removePaymentInfoFromSessionCart();
        assertThat(result).isEqualTo("redirect:/checkout/multi/checkout-com/choose-payment-method");
    }


    @Test
    public void handleSuccessRedirect_shouldRedirectToRoot_WhenCkoSessionIdParamIsMissing() {
        when(requestMock.getParameterMap()).thenReturn(java.util.Collections.emptyMap());

        final String result = testObj.handleSuccessRedirect(requestMock, redirectAttributes);

        assertThat(result).isEqualTo("redirect:/");
        verify(checkoutComPaymentFacadeMock, never()).getPaymentDetailsByCkoSessionId(anyString());
    }

    @Test
    public void handleSuccessRedirect_shouldRedirectToRoot_WhenCkoSessionIdIsBlank() {
        when(requestMock.getParameterMap()).thenReturn(java.util.Map.of(CheckoutComPaymentRedirectResponseController.PARAM_CKO_SESSION_ID, new String[]{""}));
        when(requestMock.getParameter(CheckoutComPaymentRedirectResponseController.PARAM_CKO_SESSION_ID)).thenReturn("");

        final String result = testObj.handleSuccessRedirect(requestMock, redirectAttributes);

        assertThat(result).isEqualTo("redirect:/");
        verify(checkoutComPaymentFacadeMock, never()).getPaymentDetailsByCkoSessionId(anyString());
    }


    @Test
    public void handleSuccessRedirect_shouldCallFailureRedirect_WhenPaymentIntegrationExceptionIsThrown() {
        whenValidSessionIdInRequest();
        when(checkoutComPaymentFacadeMock.getPaymentDetailsByCkoSessionId(CKO_SESSION_ID))
                .thenThrow(new CheckoutComPaymentIntegrationException("integration error"));
        doReturn("redirect:/checkout/multi/checkout-com/choose-payment-method")
                .when(testObj).handleFailureRedirect(redirectAttributes);

        final String result = testObj.handleSuccessRedirect(requestMock, redirectAttributes);

        verify(testObj).handleFailureRedirect(redirectAttributes);
        assertThat(result).isEqualTo("redirect:/checkout/multi/checkout-com/choose-payment-method");
    }

    @Test
    public void handleSuccessRedirect_shouldRedirectToRoot_WhenCartDoesNotMatchPaymentDetails() throws Exception {
        whenValidSessionIdInRequest();
        when(checkoutComPaymentFacadeMock.getPaymentDetailsByCkoSessionId(CKO_SESSION_ID))
                .thenReturn(Optional.of(getPaymentResponseMock));
        when(checkoutComPaymentFacadeMock.doesSessionCartMatchAuthorizedCart(getPaymentResponseMock)).thenReturn(false);

        final String result = testObj.handleSuccessRedirect(requestMock, redirectAttributes);

        assertThat(result).isEqualTo("redirect:/");
        verify(acceleratorCheckoutFacadeMock, never()).placeOrder();
    }

    @Test
    public void handleSuccessRedirect_shouldProcessPaymentDetailsAndPlaceOrder_WhenFlowDisabled() throws Exception {
        whenValidSessionIdInRequest();
        when(checkoutComPaymentFacadeMock.getPaymentDetailsByCkoSessionId(CKO_SESSION_ID))
                .thenReturn(Optional.of(getPaymentResponseMock));
        when(checkoutComPaymentFacadeMock.doesSessionCartMatchAuthorizedCart(getPaymentResponseMock)).thenReturn(true);
        when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(false);
        final OrderData orderData = buildOrderData();
        when(acceleratorCheckoutFacadeMock.placeOrder()).thenReturn(orderData);
        doReturn("redirect:/checkout/orderConfirmation/" + ORDER_CODE).when(testObj).superRedirectToOrderConfirmationPage(orderData);

        final String result = testObj.handleSuccessRedirect(requestMock, redirectAttributes);

        verify(checkoutComPaymentInfoFacadeMock).processPaymentDetails(getPaymentResponseMock);
        verify(checkoutComFlowPaymentInfoFacadeMock, never()).addPaymentInfoToCart(any());
        assertThat(result).isEqualTo("redirect:/checkout/orderConfirmation/" + ORDER_CODE);
    }

    @Test
    public void handleSuccessRedirect_shouldAddFlowPaymentInfoAndPlaceOrder_WhenFlowEnabled() throws Exception {
        whenValidSessionIdInRequest();
        when(checkoutComPaymentFacadeMock.getPaymentDetailsByCkoSessionId(CKO_SESSION_ID))
                .thenReturn(Optional.of(getPaymentResponseMock));
        when(checkoutComPaymentFacadeMock.doesSessionCartMatchAuthorizedCart(getPaymentResponseMock)).thenReturn(true);
        when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(true);
        final OrderData orderData = buildOrderData();
        when(acceleratorCheckoutFacadeMock.placeOrder()).thenReturn(orderData);
        doReturn("redirect:/checkout/orderConfirmation/" + ORDER_CODE).when(testObj).superRedirectToOrderConfirmationPage(orderData);

        final String result = testObj.handleSuccessRedirect(requestMock, redirectAttributes);

        verify(checkoutComFlowPaymentInfoFacadeMock).addPaymentInfoToCart(getPaymentResponseMock);
        verify(checkoutComPaymentInfoFacadeMock, never()).processPaymentDetails(any());
        assertThat(result).isEqualTo("redirect:/checkout/orderConfirmation/" + ORDER_CODE);
    }

    @Test
    public void handleSuccessRedirect_shouldRedirectToChoosePaymentMethod_WhenPlaceOrderThrowsInvalidCartException() throws Exception {
        whenValidSessionIdInRequest();
        when(checkoutComPaymentFacadeMock.getPaymentDetailsByCkoSessionId(CKO_SESSION_ID))
                .thenReturn(Optional.of(getPaymentResponseMock));
        when(checkoutComPaymentFacadeMock.doesSessionCartMatchAuthorizedCart(getPaymentResponseMock)).thenReturn(true);
        when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(false);
        when(acceleratorCheckoutFacadeMock.placeOrder()).thenThrow(new InvalidCartException("invalid cart"));
        doReturn("redirect:/checkout/multi/checkout-com/choose-payment-method")
                .when(testObj).redirectToChoosePaymentMethodStep();

        final String result = testObj.handleSuccessRedirect(requestMock, redirectAttributes);

        verify(testObj).redirectToChoosePaymentMethodStep();
        assertThat(result).isEqualTo("redirect:/checkout/multi/checkout-com/choose-payment-method");
    }

    @Test
    public void handleSuccessRedirect_shouldRedirectToRoot_WhenPaymentDetailsAreEmpty() throws Exception {
        whenValidSessionIdInRequest();
        when(checkoutComPaymentFacadeMock.getPaymentDetailsByCkoSessionId(CKO_SESSION_ID))
                .thenReturn(Optional.empty());

        final String result = testObj.handleSuccessRedirect(requestMock, redirectAttributes);

        assertThat(result).isEqualTo("redirect:/");
        verify(acceleratorCheckoutFacadeMock, never()).placeOrder();
    }


    private void whenValidSessionIdInRequest() {
        when(requestMock.getParameterMap()).thenReturn(
                java.util.Map.of(CheckoutComPaymentRedirectResponseController.PARAM_CKO_SESSION_ID, new String[]{CKO_SESSION_ID}));
        when(requestMock.getParameter(CheckoutComPaymentRedirectResponseController.PARAM_CKO_SESSION_ID)).thenReturn(CKO_SESSION_ID);
        doReturn(CKO_SESSION_ID).when(testObj).getCkoSessionId(requestMock);
    }

    private OrderData buildOrderData() {
        final OrderData orderData = new OrderData();
        orderData.setCode(ORDER_CODE);
        return orderData;
    }
}
