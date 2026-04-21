package com.checkout.hybris.occ.controllers;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyBoolean;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.checkout.hybris.commercefacades.user.CheckoutComUserFacade;
import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.commercefacades.order.data.CCPaymentInfoData;
import de.hybris.platform.commercewebservicescommons.dto.order.PaymentDetailsWsDTO;
import de.hybris.platform.commercewebservicescommons.errors.exceptions.RequestParameterException;
import de.hybris.platform.core.PK;
import de.hybris.platform.webservicescommons.mapping.DataMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class CheckoutComPaymentDetailsControllerTest {

    private final String paymentDetailId = "paymentDetailId";

    @Spy
    @InjectMocks
    private CheckoutComPaymentDetailsController testObj;

    @Mock
    private CheckoutComUserFacade checkoutComUserFacade;

    @Mock
    private DataMapper dataMapperMock;

    private final PaymentDetailsWsDTO paymentDetails = new PaymentDetailsWsDTO();
    private final CCPaymentInfoData ccPaymentInfoData = new CCPaymentInfoData();

    @Test
    public void replacePaymentDetails_shouldCallUpdateCCPaymentInfo() {
        doNothing().when(testObj).validate(any(), any(), any());
        doNothing().when(dataMapperMock).map(any(), any(), any(), anyBoolean());
        doNothing().when(checkoutComUserFacade).updateCCPaymentInfo(ccPaymentInfoData);
        when(checkoutComUserFacade.getCCPaymentInfoForCode(paymentDetailId)).thenReturn(ccPaymentInfoData);

        testObj.replacePaymentDetails(paymentDetailId, paymentDetails);

        verify(checkoutComUserFacade).updateCCPaymentInfo(ccPaymentInfoData);
    }

    @Test
    public void getPaymentInfo_shouldThrowException_whenGetCCPaymentFails() {

        doThrow(new PK.PKException("")).when(checkoutComUserFacade).getCCPaymentInfoForCode(paymentDetailId);

        assertThatThrownBy(() -> testObj.getPaymentInfo(paymentDetailId))
                .isInstanceOf(RequestParameterException.class)
                .hasMessage("Payment details [paymentDetailId] not found.");
    }

    @Test
    public void getPaymentInfo_shouldThrowException_whenPaymentIsNull() {
        doReturn(null).when(checkoutComUserFacade).getCCPaymentInfoForCode(paymentDetailId);

        assertThatThrownBy(() -> testObj.getPaymentInfo(paymentDetailId))
                .isInstanceOf(RequestParameterException.class)
                .hasMessage("Payment details [paymentDetailId] not found.");
    }
}
