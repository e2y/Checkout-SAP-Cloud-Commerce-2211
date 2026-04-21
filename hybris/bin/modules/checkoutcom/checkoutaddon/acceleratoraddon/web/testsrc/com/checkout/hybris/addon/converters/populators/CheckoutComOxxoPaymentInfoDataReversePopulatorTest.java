package com.checkout.hybris.addon.converters.populators;


import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;

import com.checkout.hybris.addon.forms.PaymentDataForm;
import com.checkout.hybris.facades.beans.OxxoPaymentInfoData;
import de.hybris.bootstrap.annotations.UnitTest;
import org.junit.Test;
import org.mockito.InjectMocks;

@UnitTest
public class CheckoutComOxxoPaymentInfoDataReversePopulatorTest {

    private static final String DOCUMENT_VALUE = "asafasfasfafasf";
    private static final String DOCUMENT = "document";

    @InjectMocks
    private CheckoutComOxxoPaymentInfoDataReversePopulator testObj = new CheckoutComOxxoPaymentInfoDataReversePopulator();

    private final OxxoPaymentInfoData target = new OxxoPaymentInfoData();
    private final PaymentDataForm source = new PaymentDataForm();
    private final Map<String, Object> formAttributes = new HashMap<>();

    @Test
    public void populate_ShouldPopulateDocument() {
        formAttributes.put(DOCUMENT, DOCUMENT_VALUE);
        source.setFormAttributes(formAttributes);

        testObj.populate(source, target);

        assertEquals(DOCUMENT_VALUE, target.getDocument());
    }

    @Test
    public void populate_ShouldThrowException_WhenSourceIsNull() {
        assertThatThrownBy(() -> testObj.populate(null, target))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("PaymentDataForm cannot be null.");
    }

    @Test
    public void populate_ShouldThrowException_WhenTargetIsNull() {
        assertThatThrownBy(() -> testObj.populate(source, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("OxxoPaymentInfoData cannot be null.");
    }
}
