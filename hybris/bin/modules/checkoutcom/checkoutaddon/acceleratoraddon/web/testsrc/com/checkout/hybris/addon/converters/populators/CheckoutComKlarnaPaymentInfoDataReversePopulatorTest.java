package com.checkout.hybris.addon.converters.populators;

import java.util.Map;

import static com.checkout.hybris.addon.converters.populators.CheckoutComKlarnaPaymentInfoDataReversePopulator.AUTHORIZATION_TOKEN_KEY;
import static com.checkout.hybris.addon.converters.populators.CheckoutComKlarnaPaymentInfoDataReversePopulator.PAYMENT_CONTEXT_ID;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;

import com.checkout.hybris.addon.forms.PaymentDataForm;
import com.checkout.hybris.core.payment.enums.CheckoutComPaymentType;
import com.checkout.hybris.facades.beans.KlarnaPaymentInfoData;
import de.hybris.bootstrap.annotations.UnitTest;
import org.junit.Test;

@UnitTest
public class CheckoutComKlarnaPaymentInfoDataReversePopulatorTest {

    private static final String KLARNA_AUTH_TOKEN_VALUE = "12345678901_abdajkdjal";
    private static final String KLARNA_PAYMENT_CONTEXT_VALUE = "12345678901_qwrqwrq";

    private final CheckoutComKlarnaPaymentInfoDataReversePopulator testObj = new CheckoutComKlarnaPaymentInfoDataReversePopulator();

    private final PaymentDataForm source = new PaymentDataForm();
    private final KlarnaPaymentInfoData target = new KlarnaPaymentInfoData();

    @Test
    public void populate_ShouldPopulateTargetCorrectly() {
        source.setFormAttributes(Map.of(AUTHORIZATION_TOKEN_KEY, KLARNA_AUTH_TOKEN_VALUE, PAYMENT_CONTEXT_ID, KLARNA_PAYMENT_CONTEXT_VALUE));

        testObj.populate(source, target);

        assertEquals(CheckoutComPaymentType.KLARNA.name(), target.getType());
        assertEquals(KLARNA_AUTH_TOKEN_VALUE, target.getAuthorizationToken());
        assertEquals(KLARNA_PAYMENT_CONTEXT_VALUE, target.getPaymentContextId());
    }

    @Test
    public void populate_WhenSourceNull_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.populate(null, target))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("PaymentDataForm cannot be null.");
    }

    @Test
    public void populate_WhenTargetNull_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.populate(source, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("KlarnaPaymentInfoData cannot be null.");
    }
}
