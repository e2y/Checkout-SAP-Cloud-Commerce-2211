package com.checkout.hybris.addon.converters.populators;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;

import com.checkout.hybris.addon.forms.PaymentDataForm;
import com.checkout.hybris.facades.beans.APMPaymentInfoData;
import com.google.common.collect.ImmutableMap;
import de.hybris.bootstrap.annotations.UnitTest;
import org.junit.Test;

@UnitTest
public class CheckoutComPaymentDataFormReversePopulatorTest {

    private static final String TYPE_VALUE = "TYPE";

    private final CheckoutComPaymentDataFormReversePopulator testObj = new CheckoutComPaymentDataFormReversePopulator();

    private final PaymentDataForm source = new PaymentDataForm();
    private final APMPaymentInfoData target = new APMPaymentInfoData();

    @Test
    public void populate_ShouldPopulateTargetCorrectly() {
        source.setFormAttributes(ImmutableMap.of("type", TYPE_VALUE));

        testObj.populate(source, target);

        assertEquals(TYPE_VALUE, target.getType());
    }

    @Test
    public void populate_WhenSourceNull_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.populate(null, target))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Parameter PaymentDataForm cannot be null.");
    }

    @Test
    public void populate_WhenTargetNull_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.populate(source, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Parameter APMPaymentInfoData cannot be null.");
    }
}
