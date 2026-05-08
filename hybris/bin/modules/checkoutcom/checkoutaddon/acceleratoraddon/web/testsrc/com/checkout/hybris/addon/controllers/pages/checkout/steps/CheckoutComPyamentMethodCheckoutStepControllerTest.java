package com.checkout.hybris.addon.controllers.pages.checkout.steps;

import static com.checkout.hybris.addon.constants.CheckoutaddonWebConstants.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.checkout.dto.payment.session.CheckoutComPaymentSessionResponseDTO;
import com.checkout.hybris.addon.converters.CheckoutComMappedPaymentDataFormReverseConverter;
import com.checkout.hybris.addon.forms.PaymentDataForm;
import com.checkout.hybris.core.payment.enums.CheckoutComPaymentType;
import com.checkout.hybris.core.payment.resolvers.CheckoutComPaymentTypeResolver;
import com.checkout.hybris.facades.accelerator.CheckoutComCheckoutFlowFacade;
import com.checkout.hybris.facades.address.CheckoutComAddressFacade;
import com.checkout.hybris.facades.beans.CheckoutComFlowUIConfigurationData;
import com.checkout.hybris.facades.flow.CheckoutComFlowConfigurationFacade;
import com.checkout.hybris.facades.flow.CheckoutComFlowPaymentSessionFacade;
import com.checkout.hybris.facades.merchant.CheckoutComMerchantConfigurationFacade;
import com.checkout.hybris.facades.payment.CheckoutComPaymentInfoFacade;
import com.checkout.hybris.facades.payment.attributes.mapper.CheckoutComPaymentAttributesStrategyMapper;
import com.checkout.hybris.facades.payment.attributes.strategies.CheckoutComPaymentAttributeStrategy;
import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.order.AcceleratorCheckoutFacade;
import de.hybris.platform.cms2.exceptions.CMSItemNotFoundException;
import de.hybris.platform.cms2.model.site.CMSSiteModel;
import de.hybris.platform.commercefacades.user.data.AddressData;
import de.hybris.platform.site.BaseSiteService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Validator;
import org.springframework.validation.support.BindingAwareModelMap;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributesModelMap;

import java.util.Map;
import java.util.Optional;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class CheckoutComPyamentMethodCheckoutStepControllerTest {
    private static final String PAYMENT_TYPE = "card";
    private static final String NEXT_STEP = "next-step";
    private static final String VIEW = "view";
    private static final String REDIRECT_CART = "redirect:/cart";
    private static final String FLOW_CONFIGURATION_STING = """
            {"colorAction":null,"colorBackground":null,"colorBorder":null,"colorDisabled":null,"colorError":null,"colorFormBackground":null,"colorFormBorder":null,"colorInverse":null,"colorOutline":null,"colorPrimary":null,"colorSecondary":null,"colorSuccess":null,"button":null,"footnote":null,"label":null,"subheading":null,"borderRadius":null}""";

    private Model model;
    private RedirectAttributes redirectAttributes;

    @Spy
    @InjectMocks
    private CheckoutComPaymentMethodCheckoutStepController testObj;

    @Mock
    private CheckoutComCheckoutFlowFacade checkoutComCheckoutFlowFacadeMock;

    @Mock
    private AcceleratorCheckoutFacade acceleratorCheckoutFacadeMock;

    @Mock
    private CheckoutComPaymentInfoFacade checkoutComPaymentInfoFacadeMock;

    @Mock
    private CheckoutComMerchantConfigurationFacade checkoutComMerchantConfigurationFacadeMock;

    @Mock
    private Validator checkoutComPaymentDataFormValidValidatorMock;

    @Mock
    private CheckoutComPaymentTypeResolver checkoutComPaymentTypeResolverMock;

    @Mock
    private CheckoutComMappedPaymentDataFormReverseConverter checkoutComMappedPaymentDataFormReverseConverterMock;

    @Mock
    private CheckoutComPaymentAttributesStrategyMapper checkoutComPaymentAttributesStrategyMapperMock;

    @Mock
    private CheckoutComFlowConfigurationFacade checkoutComFlowConfigurationFacadeMock;

    @Mock
    private CheckoutComFlowPaymentSessionFacade checkoutComFlowPaymentSessionFacadeMock;

    @Mock
    private BaseSiteService baseSiteServiceMock;

    @Mock
    private CheckoutComAddressFacade checkoutComAddressFacadeMock;

    @Mock
    private AddressData addressDataMock;

    @Mock
    private CheckoutComFlowUIConfigurationData flowUIConfigurationDataMock;

    @Mock
    private CheckoutComPaymentSessionResponseDTO paymentSessionResponseMock;

    @Mock
    private CheckoutComPaymentAttributeStrategy checkoutComPaymentAttributeStrategyMock;

    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private CMSSiteModel cmsSiteModelMock;

    @Mock
    private Object paymentInfoMock;

    @Before
    public void setUp() {
        model = new BindingAwareModelMap();
        redirectAttributes = new RedirectAttributesModelMap();
    }

    @Test
    public void enterStep_shouldRedirectToCart_WhenNoCheckoutCartExists() throws CMSItemNotFoundException {
        when(acceleratorCheckoutFacadeMock.hasCheckoutCart()).thenReturn(false);

        final String result = testObj.enterStep(model, redirectAttributes);

        assertThat(result).isEqualTo(REDIRECT_CART);
        assertThat(model.asMap()).doesNotContainKey("paymentDataForm");
    }

    @Test
    public void enterStep_shouldPopulateModelWithPaymentDataForm_WhenCheckoutCartExists() throws CMSItemNotFoundException {
        when(acceleratorCheckoutFacadeMock.hasCheckoutCart()).thenReturn(true);
        when(checkoutComAddressFacadeMock.getCartBillingAddress()).thenReturn(addressDataMock);
        when(checkoutComMerchantConfigurationFacadeMock.getCheckoutComMerchantPublicKey()).thenReturn("public-key");
        when(checkoutComCheckoutFlowFacadeMock.getCurrentPaymentMethodType()).thenReturn(PAYMENT_TYPE);
        when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(false);
        when(checkoutComPaymentTypeResolverMock.resolvePaymentMethod(PAYMENT_TYPE)).thenReturn(CheckoutComPaymentType.CARD);
        when(checkoutComPaymentAttributesStrategyMapperMock.findStrategy(CheckoutComPaymentType.CARD)).thenReturn(Optional.empty());
        doNothing().when(testObj).superSetupAddPaymentPage(eq(model), anyString(), anyString());
        doReturn(VIEW).when(testObj).superGetViewForPage(model);

        final String result = testObj.enterStep(model, redirectAttributes);

        assertThat(result).isEqualTo(VIEW);
        assertThat(model.asMap())
                .containsKey("paymentDataForm")
                .containsEntry("billingAddress", addressDataMock)
                .containsEntry("publicKey", "public-key")
                .containsEntry(PAYMENT_METHOD_MODEL_ATTRIBUTE_KEY, PAYMENT_TYPE)
                .containsEntry(FLOW_ENABLED_MODEL_ATTRIBUTE_KEY, false);
    }

    @Test
    public void enterStep_shouldPopulateFlowAttributesAndPaymentAttributes_WhenFlowEnabled() throws CMSItemNotFoundException {
        when(acceleratorCheckoutFacadeMock.hasCheckoutCart()).thenReturn(true);
        when(checkoutComAddressFacadeMock.getCartBillingAddress()).thenReturn(addressDataMock);
        when(checkoutComMerchantConfigurationFacadeMock.getCheckoutComMerchantPublicKey()).thenReturn("public-key");
        when(checkoutComCheckoutFlowFacadeMock.getCurrentPaymentMethodType()).thenReturn(PAYMENT_TYPE);
        when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(true);
        when(checkoutComFlowConfigurationFacadeMock.getCheckoutComFlowUIConfigurationData()).thenReturn(flowUIConfigurationDataMock);
        when(checkoutComFlowPaymentSessionFacadeMock.createPaymentSession()).thenReturn(paymentSessionResponseMock);
        when(checkoutComMerchantConfigurationFacadeMock.getCheckoutComMerchantEnvironment()).thenReturn("sandbox");
        when(baseSiteServiceMock.getCurrentBaseSite()).thenReturn(cmsSiteModelMock);
        when(cmsSiteModelMock.getCheckoutComSuccessRedirectUrl()).thenReturn("/success");
        when(cmsSiteModelMock.getCheckoutComFailureRedirectUrl()).thenReturn("/failure");
        when(checkoutComPaymentTypeResolverMock.resolvePaymentMethod(PAYMENT_TYPE)).thenReturn(CheckoutComPaymentType.CARD);
        when(checkoutComPaymentAttributesStrategyMapperMock.findStrategy(CheckoutComPaymentType.CARD))
                .thenReturn(Optional.of(checkoutComPaymentAttributeStrategyMock));
        doNothing().when(testObj).superSetupAddPaymentPage(eq(model), anyString(), anyString());
        doReturn(VIEW).when(testObj).superGetViewForPage(model);

        final String result = testObj.enterStep(model, redirectAttributes);

        assertThat(result).isEqualTo(VIEW);
        assertThat(model.asMap())
                .containsEntry(FLOW_ENABLED_MODEL_ATTRIBUTE_KEY, true)
                .containsEntry(FLOW_UI_CONFIGURATION_MODEL_ATTRIBUTE_KEY, FLOW_CONFIGURATION_STING)
                .containsEntry(FLOW_PAYMENT_SESSION_ATTRIBUTE_KEY, paymentSessionResponseMock)
                .containsEntry(FLOW_ENVIRONMENT_ATTRIBUTE_KEY, "sandbox")
                .containsEntry(FLOW_SUCCESS_REDIRECT_URL_KEY, "/success")
                .containsEntry(FLOW_FAILURE_REDIRECT_URL_KEY, "/failure");
        verify(checkoutComPaymentAttributeStrategyMock).addPaymentAttributeToModel(model);
    }

    @Test
    public void submitPaymentToken_shouldReturnViewAndDoNotAddPaymentInfo_WhenValidationFails() throws CMSItemNotFoundException {
        final PaymentDataForm paymentDataForm = new PaymentDataForm();
        final BindingResult bindingResult = new org.springframework.validation.BeanPropertyBindingResult(paymentDataForm, "paymentDataForm");
        when(checkoutComAddressFacadeMock.getCartBillingAddress()).thenReturn(addressDataMock);
        when(checkoutComMerchantConfigurationFacadeMock.getCheckoutComMerchantPublicKey()).thenReturn("public-key");
        when(checkoutComCheckoutFlowFacadeMock.getCurrentPaymentMethodType()).thenReturn(PAYMENT_TYPE);
        when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(false);
        when(checkoutComPaymentTypeResolverMock.resolvePaymentMethod(PAYMENT_TYPE)).thenReturn(CheckoutComPaymentType.CARD);
        when(checkoutComPaymentAttributesStrategyMapperMock.findStrategy(CheckoutComPaymentType.CARD)).thenReturn(Optional.empty());
        doAnswer(invocation -> {
            BindingResult br = invocation.getArgument(1);
            br.reject("invalid");
            return null;
        }).when(checkoutComPaymentDataFormValidValidatorMock).validate(any(), any(BindingResult.class));
        doNothing().when(testObj).superSetupAddPaymentPage(eq(model), anyString(), anyString());
        doReturn(VIEW).when(testObj).superGetViewForPage(model);

        final String result = testObj.submitPaymentToken(model, paymentDataForm, bindingResult, redirectAttributes);

        assertThat(result).isEqualTo(VIEW);
        verify(checkoutComPaymentInfoFacadeMock, never()).addPaymentInfoToCart(any());
    }

    @Test
    public void submitPaymentToken_shouldAddPaymentInfoAndGoNext_WhenValidationSucceeds() throws CMSItemNotFoundException {
        final PaymentDataForm paymentDataForm = new PaymentDataForm();
        paymentDataForm.setFormAttributes(Map.of("type", PAYMENT_TYPE));
        final BindingResult bindingResult = new org.springframework.validation.BeanPropertyBindingResult(paymentDataForm, "paymentDataForm");
        when(checkoutComPaymentTypeResolverMock.resolvePaymentMethod(PAYMENT_TYPE)).thenReturn(CheckoutComPaymentType.CARD);
        when(checkoutComMappedPaymentDataFormReverseConverterMock.convertPaymentDataForm(paymentDataForm, CheckoutComPaymentType.CARD))
                .thenReturn(paymentInfoMock);
        doNothing().when(checkoutComPaymentDataFormValidValidatorMock).validate(paymentDataForm, bindingResult);
        doReturn(NEXT_STEP).when(testObj).next(redirectAttributes);

        final String result = testObj.submitPaymentToken(model, paymentDataForm, bindingResult, redirectAttributes);

        assertThat(result).isEqualTo(NEXT_STEP);
        verify(checkoutComPaymentInfoFacadeMock).addPaymentInfoToCart(paymentInfoMock);
    }

}
