package com.checkout.hybris.core.flow.paymentsession.populators;


import com.checkout.handlepaymentsandpayouts.flow.entities.Customer;
import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import de.hybris.platform.commerceservices.enums.CustomerType;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.user.AddressModel;
import de.hybris.platform.core.model.user.CustomerModel;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComFlowCustomerPopulatorTest {

    private static final String EMAIL = "test@email.com";
    private static final String NAME = "John Doe";
    private static final String PHONE_NUMBER = "666777888";
    private static final String ADDRESS_FIRST_NAME = "addressFirstName";
    private static final String ADDRESS_LAST_NAME = "addressLastName";

    @Spy
    @InjectMocks
    private DefaultCheckoutComFlowCustomerPopulator testObj;

    @Mock
    private CartModel cartModelMock;

    @Mock
    private PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder paymentSessionRequestBuilderMock;

    @Mock
    private CustomerModel customerModelMock;

    @Mock
    private AddressModel addressModelMock;

    @Mock
    private Customer customerMock;


    @Test
    public void populate_shouldPopulateCustomer_whenCustomerIsGenerated() {
        doReturn(customerMock).when(testObj).getCustomer(cartModelMock);

        testObj.populate(cartModelMock, paymentSessionRequestBuilderMock);

        verify(paymentSessionRequestBuilderMock).customer(customerMock);
    }


    @Test
    public void getCustomer_shouldBuildCustomerWithPhoneEmailAndName_whenCartContainsValidDataAndIsRegisteredUser() {
        when(customerModelMock.getType()).thenReturn(CustomerType.REGISTERED);
        when(cartModelMock.getUser()).thenReturn(customerModelMock);
        when(customerModelMock.getContactEmail()).thenReturn(EMAIL);
        when(customerModelMock.getName()).thenReturn(NAME);
        when(cartModelMock.getPaymentAddress()).thenReturn(addressModelMock);
        when(addressModelMock.getPhone1()).thenReturn(PHONE_NUMBER);

        final Customer result = testObj.getCustomer(cartModelMock);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(EMAIL);
        assertThat(result.getName()).isEqualTo(NAME);
        assertThat(result.getPhone()).isNotNull();
        assertThat(result.getPhone().getNumber()).isEqualTo(PHONE_NUMBER);
    }

    @Test
    public void getCustomer_shouldBuildCustomerWithPhoneEmailAndName_whenCartContainsValidDataAndIsGuestUser() {
        when(customerModelMock.getType()).thenReturn(CustomerType.GUEST);
        when(cartModelMock.getUser()).thenReturn(customerModelMock);
        when(customerModelMock.getContactEmail()).thenReturn(EMAIL);
        when(cartModelMock.getPaymentAddress()).thenReturn(addressModelMock);
        when(addressModelMock.getPhone1()).thenReturn(PHONE_NUMBER);
        when(addressModelMock.getFirstname()).thenReturn(ADDRESS_FIRST_NAME);
        when(addressModelMock.getLastname()).thenReturn(ADDRESS_LAST_NAME);

        final Customer result = testObj.getCustomer(cartModelMock);

        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo(EMAIL);
        assertThat(result.getName()).isEqualTo(ADDRESS_FIRST_NAME + " " + ADDRESS_LAST_NAME);
        assertThat(result.getPhone()).isNotNull();
        assertThat(result.getPhone().getNumber()).isEqualTo(PHONE_NUMBER);
    }

}
