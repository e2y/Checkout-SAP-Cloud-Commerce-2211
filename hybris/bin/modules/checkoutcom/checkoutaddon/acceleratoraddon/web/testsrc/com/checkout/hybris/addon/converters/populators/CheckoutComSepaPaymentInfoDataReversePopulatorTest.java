package com.checkout.hybris.addon.converters.populators;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;

import com.checkout.hybris.addon.forms.PaymentDataForm;
import com.checkout.hybris.core.payment.enums.CheckoutComPaymentType;
import com.checkout.hybris.facades.beans.SepaPaymentInfoData;
import de.hybris.bootstrap.annotations.UnitTest;
import org.junit.Before;
import org.junit.Test;

@UnitTest
public class CheckoutComSepaPaymentInfoDataReversePopulatorTest {

    private final CheckoutComSepaPaymentInfoDataReversePopulator testObj = new CheckoutComSepaPaymentInfoDataReversePopulator();

    private final PaymentDataForm source = new PaymentDataForm();
    private final SepaPaymentInfoData target = new SepaPaymentInfoData();

    private final Map<String, Object> attributesMap = new HashMap<>();

    @Before
    public void setUp() {
        attributesMap.put("firstName", "John");
        attributesMap.put("lastName", "Snow");
        attributesMap.put("paymentType", "Recurring payment");
        attributesMap.put("accountIban", "GB56789123456");
        attributesMap.put("addressLine1", "1 Buckingham Palace Road");
        attributesMap.put("addressLine2", "Royal Palace");
        attributesMap.put("city", "London");
        attributesMap.put("postalCode", "SW12WS");
        attributesMap.put("country", "UK");
        source.setFormAttributes(attributesMap);
    }

    @Test
    public void populate_ShouldPopulateTargetCorrectly() {
        testObj.populate(source, target);

        assertEquals(CheckoutComPaymentType.SEPA.name(), target.getType());
        assertEquals("Recurring payment", target.getPaymentType());
        assertEquals("GB56789123456", target.getAccountIban());
        assertEquals("John", target.getFirstName());
        assertEquals("Snow", target.getLastName());
        assertEquals("1 Buckingham Palace Road", target.getAddressLine1());
        assertEquals("Royal Palace", target.getAddressLine2());
        assertEquals("London", target.getCity());
        assertEquals("SW12WS", target.getPostalCode());
        assertEquals("UK", target.getCountry());
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
                .hasMessage("SepaPaymentInfoData cannot be null.");
    }
}
