package com.checkout.hybris.addon.converters.populators;

import java.util.Map;

import static com.checkout.hybris.addon.converters.populators.CheckoutComFawryPaymentInfoDataReversePopulator.MOBILE_NUMBER_KEY;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;

import com.checkout.hybris.addon.forms.PaymentDataForm;
import com.checkout.hybris.core.payment.enums.CheckoutComPaymentType;
import com.checkout.hybris.facades.beans.FawryPaymentInfoData;
import de.hybris.bootstrap.annotations.UnitTest;
import org.junit.Test;

@UnitTest
public class CheckoutComFawryPaymentInfoDataReversePopulatorTest {

    private static final String MOBILE_NUMBER_VALUE = "12345678912";

    private final CheckoutComFawryPaymentInfoDataReversePopulator testObj = new CheckoutComFawryPaymentInfoDataReversePopulator();

    private final PaymentDataForm source = new PaymentDataForm();
    private final FawryPaymentInfoData target = new FawryPaymentInfoData();

    @Test
    public void populate_ShouldPopulateTargetCorrectly() {
        source.setFormAttributes(Map.of(MOBILE_NUMBER_KEY, MOBILE_NUMBER_VALUE));

        testObj.populate(source, target);

        assertEquals(CheckoutComPaymentType.FAWRY.name(), target.getType());
        assertEquals(MOBILE_NUMBER_VALUE, target.getMobileNumber());
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
                .hasMessage("FawryPaymentInfoData cannot be null.");
    }

}
