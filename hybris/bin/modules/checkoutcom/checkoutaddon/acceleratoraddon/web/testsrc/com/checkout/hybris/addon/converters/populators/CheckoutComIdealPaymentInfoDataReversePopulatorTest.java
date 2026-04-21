package com.checkout.hybris.addon.converters.populators;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;

import com.checkout.hybris.addon.forms.PaymentDataForm;
import com.checkout.hybris.core.payment.enums.CheckoutComPaymentType;
import com.checkout.hybris.facades.beans.IdealPaymentInfoData;
import de.hybris.bootstrap.annotations.UnitTest;
import org.junit.Test;

@UnitTest
public class CheckoutComIdealPaymentInfoDataReversePopulatorTest {

    private final CheckoutComIdealPaymentInfoDataReversePopulator testObj = new CheckoutComIdealPaymentInfoDataReversePopulator();

    private final PaymentDataForm source = new PaymentDataForm();
    private final IdealPaymentInfoData target = new IdealPaymentInfoData();

    @Test
    public void populate_ShouldPopulateTargetCorrectly() {
        testObj.populate(source, target);

        assertEquals(CheckoutComPaymentType.IDEAL.name(), target.getType());
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
                .hasMessage("IdealPaymentInfoData cannot be null.");
    }
}
