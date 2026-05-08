package com.checkout.hybris.addon.controllers.pages.checkout.steps;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.checkout.hybris.addon.constants.CheckoutaddonConstants;
import com.checkout.hybris.addon.controllers.CheckoutaddonControllerConstants;
import com.checkout.hybris.addon.forms.PaymentDetailsForm;
import com.checkout.hybris.facades.accelerator.CheckoutComCheckoutFlowFacade;
import com.checkout.hybris.facades.address.CheckoutComAddressFacade;
import com.checkout.hybris.facades.flow.CheckoutComFlowConfigurationFacade;
import com.checkout.hybris.facades.payment.CheckoutComPaymentInfoFacade;
import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.acceleratorfacades.order.AcceleratorCheckoutFacade;
import de.hybris.platform.acceleratorstorefrontcommons.forms.AddressForm;
import de.hybris.platform.commercefacades.user.data.AddressData;
import de.hybris.platform.servicelayer.config.ConfigurationService;
import org.apache.commons.configuration.Configuration;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.MapBindingResult;
import org.springframework.validation.support.BindingAwareModelMap;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.mvc.support.RedirectAttributesModelMap;
import java.util.Map;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class CheckoutComChoosePaymentAndBillingCheckoutStepControllerTest {

	private static final String PAYMENT_METHOD = "payment-method";
	private static final String FLOW_ENABLED_MODEL_ATTRIBUTE_KEY = "flowEnabled";

	@Spy
	@InjectMocks
	private CheckoutComChoosePaymentAndBillingCheckoutStepController testObj;

	@Mock
	private CheckoutComPaymentInfoFacade checkoutComPaymentInfoFacadeMock;
	@Mock
	private CheckoutComFlowConfigurationFacade checkoutComFlowConfigurationFacadeMock;
	@Mock
	private CheckoutComCheckoutFlowFacade checkoutComCheckoutFlowFacadeMock;
	@Mock
	private AcceleratorCheckoutFacade acceleratorCheckoutFacadeMock;
	@Mock
	private CheckoutComAddressFacade checkoutComAddressFacadeMock;
	@Mock(answer = Answers.RETURNS_DEEP_STUBS)
	private ConfigurationService configurationServiceMock;

	@Mock
	private AddressData billingAddressDataMock;
	@Mock
	private Configuration configurationMock;


	private final Object paymentInfoData = new Object();
	private static final String COUNTRY_ISO = "ES";
	final BindingAwareModelMap model = new BindingAwareModelMap();
	final RedirectAttributes redirectAttributes = new RedirectAttributesModelMap();
	final PaymentDetailsForm paymentDetailsForm = new PaymentDetailsForm();

	final MapBindingResult bindingResult = new MapBindingResult(Map.of(), "errors");

	@Before
	public void setUp() {
		ensureHandleAndSaveAddressesDoesNothing();
		paymentDetailsForm.setPaymentMethod(PAYMENT_METHOD);
	}

	@Test
	public void setPaymentToken_shouldCreateThePaymentInfoDataAndSetItToTheCart_WhenThereAreNoErrorsInTheForm() {
		ensureNoErrorsInForm();
		ensureCreatePaymentReturnsThePaymentInfoData();

		final ResponseEntity<Void> result = testObj.setPaymentToken(model, paymentDetailsForm, bindingResult);

		verify(testObj).handleAndSaveAddresses(paymentDetailsForm);
		verify(checkoutComPaymentInfoFacadeMock).createPaymentInfoData(PAYMENT_METHOD);
		verify(checkoutComPaymentInfoFacadeMock).addPaymentInfoToCart(paymentInfoData);
		assertThat(result.getStatusCode()).isEqualTo(HttpStatus.OK);
	}

	@Test
	public void setPaymentToken_shouldReturnBadRequest_WhenThereAreErrorsInTheForm() {
		ensureThereAreErrorsInTheForm();

		final ResponseEntity<Void> result = testObj.setPaymentToken(model, paymentDetailsForm, bindingResult);

		assertThat(result.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
	}

	@Test
	public void addPaymentDetails_shouldRedirectToPaymentMethodForm_WhenThereAreNoErrorsAndDataIsRequired() throws Exception {
		ensureNoErrorsInForm();
		ensureCreatePaymentReturnsThePaymentInfoData();
		when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(true);
		paymentDetailsForm.setDataRequired(true);

		final String result = testObj.addPaymentDetails(model, paymentDetailsForm, bindingResult);

		verify(testObj).handleAndSaveAddresses(paymentDetailsForm);
		verify(checkoutComPaymentInfoFacadeMock).createPaymentInfoData(PAYMENT_METHOD);
		verify(checkoutComPaymentInfoFacadeMock).addPaymentInfoToCart(paymentInfoData);
		assertThat(result).isEqualTo("redirect:/checkout/multi/checkout-com/payment/payment-method");
		assertThat(model).containsEntry(FLOW_ENABLED_MODEL_ATTRIBUTE_KEY, true);
	}

	@Test
	public void addPaymentDetails_shouldRedirectToSummary_WhenThereAreNoErrorsAndDataIsNotRequired() throws Exception {
		ensureNoErrorsInForm();
		ensureCreatePaymentReturnsThePaymentInfoData();
		when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(false);
		paymentDetailsForm.setDataRequired(false);

		final String result = testObj.addPaymentDetails(model, paymentDetailsForm, bindingResult);

		verify(testObj).handleAndSaveAddresses(paymentDetailsForm);
		verify(checkoutComPaymentInfoFacadeMock).createPaymentInfoData(PAYMENT_METHOD);
		verify(checkoutComPaymentInfoFacadeMock).addPaymentInfoToCart(paymentInfoData);
		assertThat(result).isEqualTo("redirect:/checkout/multi/checkout-com/summary/view");
		assertThat(model).containsEntry("flowEnabled", false);
	}

	@Test
	public void addPaymentDetails_shouldReturnErrorViewAndPopulateModel_WhenThereAreErrorsInTheForm() throws Exception {
		ensureThereAreErrorsInTheForm();
		when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(true);
		final AddressForm billingAddress = new AddressForm();
		billingAddress.setCountryIso("ES");
		paymentDetailsForm.setBillingAddress(billingAddress);
		doReturn("errorView").when(testObj).handleFormErrors(model, paymentDetailsForm, "choose-payment-method",
				"checkoutComPaymentMethodAndBillingCheckoutPage");

		final String result = testObj.addPaymentDetails(model, paymentDetailsForm, bindingResult);

		verify(testObj, never()).handleAndSaveAddresses(paymentDetailsForm);
		verify(checkoutComPaymentInfoFacadeMock, never()).createPaymentInfoData(anyString());
		verify(checkoutComPaymentInfoFacadeMock, never()).addPaymentInfoToCart(any());
		assertThat(result).isEqualTo("errorView");
		assertThat(model)
				.containsEntry("paymentDetailsForm", paymentDetailsForm)
				.containsEntry("selectedCountryCode", "ES")
				.containsEntry("flowEnabled", true);
	}

	@Test
	public void enterStep_shouldPopulateModelAndReturnView_WhenFlowIsEnabled() throws Exception {
		model.addAttribute("paymentStatus", "declined");
		when(checkoutComFlowConfigurationFacadeMock.isFlowEnabled()).thenReturn(true);
		when(acceleratorCheckoutFacadeMock.setDeliveryModeIfAvailable()).thenReturn(true);
		when(checkoutComAddressFacadeMock.getCartBillingAddress()).thenReturn(billingAddressDataMock);
		doNothing().when(testObj).setupAddPaymentPage(model, "choose-payment-method",
				"checkoutComPaymentMethodAndBillingCheckoutPage");

		doReturn(null).when(testObj).superGetCheckoutStep("choose-payment-method");
		doNothing().when(testObj).superSetCheckoutStepLinksForModel(model, null);
		doReturn("view").when(testObj).superGetViewForPage(model);

		final String result = testObj.enterStep(model, redirectAttributes);

		verify(acceleratorCheckoutFacadeMock).setDeliveryModeIfAvailable();
		verify(testObj).setupAddPaymentPage(model, "choose-payment-method",
				"checkoutComPaymentMethodAndBillingCheckoutPage");
		verify(testObj).setupPaymentDetailsForm(model);
		verify(testObj).superSetCheckoutStepLinksForModel(model, null);
		assertThat(result).isEqualTo("view");
		assertThat(model).containsEntry("flowEnabled", true);
	}

	@Test
	public void selectExistingPaymentMethod_shouldSetPaymentDetailsAndRedirectToSummary_WhenPaymentMethodIdIsPresent() throws Exception {
		when(acceleratorCheckoutFacadeMock.setPaymentDetails(PAYMENT_METHOD)).thenReturn(true);

		final String result = testObj.selectExistingPaymentMethod(PAYMENT_METHOD, model, redirectAttributes);

		verify(acceleratorCheckoutFacadeMock).setPaymentDetails(PAYMENT_METHOD);
		verify(checkoutComCheckoutFlowFacadeMock).setPaymentInfoBillingAddressOnSessionCart();
		assertThat(result).isEqualTo("redirect:/checkout/multi/checkout-com/summary/view");
	}

	@Test
	public void selectExistingPaymentMethod_shouldDelegateToEnterStep_WhenPaymentMethodIdIsBlank() throws Exception {
		doReturn("enterStepView").when(testObj).enterStep(model, redirectAttributes);

		final String result = testObj.selectExistingPaymentMethod(" ", model, redirectAttributes);

		verify(acceleratorCheckoutFacadeMock, never()).setPaymentDetails(anyString());
		verify(checkoutComCheckoutFlowFacadeMock, never()).setPaymentInfoBillingAddressOnSessionCart();
		verify(testObj).enterStep(model, redirectAttributes);
		assertThat(result).isEqualTo("enterStepView");
	}

	@Test
	public void reloadPaymentButtonSlot_shouldPopulateModelAndReturnButtonsFragmentPath() throws Exception {
		when(configurationServiceMock.getConfiguration()).thenReturn(configurationMock);
		when(configurationMock.getString(CheckoutaddonConstants.CHECKOUT_ADDON_PREFIX) +
				CheckoutaddonControllerConstants.Views.Fragments.CheckoutPaymentFrames.CheckoutComPaymentButtonsPage)
				.thenReturn("addon:/checkoutaddon/");
		doNothing().when(testObj).setupAddPaymentPage(model, "choose-payment-method", "checkoutComPaymentButtonsPage");
		doNothing().when(testObj).setupPaymentDetailsForm(model);

		final String result = testObj.reloadPaymentButtonSlot(COUNTRY_ISO, PAYMENT_METHOD, model);

		verify(testObj).setupAddPaymentPage(model, "choose-payment-method", "checkoutComPaymentButtonsPage");
		verify(testObj).setupPaymentDetailsForm(model);
		assertThat(model)
				.containsEntry("selectedCountryCode", COUNTRY_ISO)
				.containsEntry("selectedPaymentMethod", PAYMENT_METHOD);
		assertThat(result).isEqualTo("addon:/checkoutaddon/pages/checkout/frames/checkoutComPaymentButtonsPage");
	}

	private void ensureCreatePaymentReturnsThePaymentInfoData() {
		when(checkoutComPaymentInfoFacadeMock.createPaymentInfoData(paymentDetailsForm.getPaymentMethod())).thenReturn(
				paymentInfoData);
	}

	private void ensureHandleAndSaveAddressesDoesNothing() {
		doNothing().when(testObj).handleAndSaveAddresses(paymentDetailsForm);
	}

	private void ensureNoErrorsInForm() {
		doReturn(false).when(testObj).addGlobalErrors(model, bindingResult);
	}

	private void ensureThereAreErrorsInTheForm() {
		doReturn(true).when(testObj).addGlobalErrors(model, bindingResult);
	}
}
