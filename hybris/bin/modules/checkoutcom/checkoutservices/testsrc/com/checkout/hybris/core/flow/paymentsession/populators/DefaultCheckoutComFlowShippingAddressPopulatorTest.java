package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.common.Address;
import com.checkout.common.CountryCode;

import com.checkout.common.Phone;
import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.address.strategies.CheckoutComPhoneNumberStrategy;
import com.checkout.payments.ShippingDetails;
import de.hybris.platform.core.model.c2l.CountryModel;
import de.hybris.platform.core.model.c2l.RegionModel;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.user.AddressModel;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComFlowShippingAddressPopulatorTest {

    private static final String PHONE_NUMBER = "666777888";
    private static final String COUNTRY_CODE = "34";
    private static final String ADDRESS_LINE_1 = "Street 1";
    private static final String ADDRESS_LINE_2 = "Floor 2";
    private static final String CITY = "Madrid";
    private static final String POSTAL_CODE = "28001";
    private static final String COUNTRY_ISO = "ES";
    private static final String REGION_NAME = "MadridRegion";

    @Spy
    @InjectMocks
    private DefaultCheckoutComFlowShippingAddressPopulator testObj;

    @Mock
    private CartModel cartModelMock;

    @Mock
    private PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder paymentSessionRequestBuilderMock;

    @Mock
    private CheckoutComPhoneNumberStrategy checkoutComPhoneNumberStrategyMock;

    @Mock
    private AddressModel addressModelMock;

    @Mock
    private CountryModel countryModelMock;

    @Mock
    private RegionModel regionModelMock;

    @Mock
    private ShippingDetails shippingMock;

    @Mock
    private Address addressMock;


    @Test
    public void populate_shouldPopulateShipping_whenDeliveryAddressExists() {
        when(cartModelMock.getDeliveryAddress()).thenReturn(addressModelMock);
        doReturn(shippingMock).when(testObj).createBillingAddress(addressModelMock);

        testObj.populate(cartModelMock, paymentSessionRequestBuilderMock);

        verify(paymentSessionRequestBuilderMock).shipping(shippingMock);
    }


    @Test
    public void createBillingAddress_shouldCreateShippingWithAddressAndPhone_whenDeliveryAddressContainsPhone() {
        final Phone phone = new Phone();
        phone.setNumber(PHONE_NUMBER);
        phone.setCountryCode(COUNTRY_CODE);

        when(addressModelMock.getCountry()).thenReturn(countryModelMock);
        when(countryModelMock.getIsocode()).thenReturn(COUNTRY_ISO);
        when(addressModelMock.getPhone1()).thenReturn(PHONE_NUMBER);
        doReturn(addressMock).when(testObj).createAddress(addressModelMock);
        when(checkoutComPhoneNumberStrategyMock.createPhone(COUNTRY_CODE, addressModelMock))
                .thenReturn(Optional.of(phone));

        final ShippingDetails result = testObj.createBillingAddress(addressModelMock);

        assertThat(result).isNotNull();
        assertThat(result.getAddress()).isEqualTo(addressMock);
        assertThat(result.getPhone()).isNotNull();
        assertThat(result.getPhone().getNumber()).isEqualTo(PHONE_NUMBER);
        assertThat(result.getPhone().getCountryCode()).isEqualTo(COUNTRY_CODE);
    }


    @Test
    public void createAddress_shouldPopulateAllFields_whenCountryAndRegionExist() {

        when(addressModelMock.getLine1()).thenReturn(ADDRESS_LINE_1);
        when(addressModelMock.getLine2()).thenReturn(ADDRESS_LINE_2);
        when(addressModelMock.getTown()).thenReturn(CITY);
        when(addressModelMock.getPostalcode()).thenReturn(POSTAL_CODE);

        when(addressModelMock.getCountry()).thenReturn(countryModelMock);
        when(countryModelMock.getIsocode()).thenReturn(COUNTRY_ISO);

        when(addressModelMock.getRegion()).thenReturn(regionModelMock);
        when(regionModelMock.getName()).thenReturn(REGION_NAME);

        Address result = testObj.createAddress(addressModelMock);

        assertThat(result.getAddressLine1()).isEqualTo(ADDRESS_LINE_1);
        assertThat(result.getAddressLine2()).isEqualTo(ADDRESS_LINE_2);
        assertThat(result.getCity()).isEqualTo(CITY);
        assertThat(result.getZip()).isEqualTo(POSTAL_CODE);
        assertThat(result.getCountry()).isEqualTo(CountryCode.valueOf(COUNTRY_ISO));
        assertThat(result.getState()).isEqualTo(REGION_NAME);
    }


    @Test
    public void createAddress_shouldSetCountryNull_whenCountryIsNull() {

        when(addressModelMock.getCountry()).thenReturn(null);
        when(addressModelMock.getRegion()).thenReturn(regionModelMock);
        when(regionModelMock.getName()).thenReturn(REGION_NAME);

        Address result = testObj.createAddress(addressModelMock);

        assertThat(result.getCountry()).isNull();
        assertThat(result.getState()).isEqualTo(REGION_NAME);
    }


    @Test
    public void createAddress_shouldSetStateNull_whenRegionIsNull() {

        when(addressModelMock.getCountry()).thenReturn(countryModelMock);
        when(countryModelMock.getIsocode()).thenReturn(COUNTRY_ISO);
        when(addressModelMock.getRegion()).thenReturn(null);

        Address result = testObj.createAddress(addressModelMock);

        assertThat(result.getCountry()).isEqualTo(CountryCode.valueOf(COUNTRY_ISO));
        assertThat(result.getState()).isNull();
    }


    @Test
    public void createAddress_shouldSetCountryAndStateNull_whenCountryAndRegionAreNull() {

        when(addressModelMock.getCountry()).thenReturn(null);
        when(addressModelMock.getRegion()).thenReturn(null);

        Address result = testObj.createAddress(addressModelMock);

        assertThat(result.getCountry()).isNull();
        assertThat(result.getState()).isNull();
    }

}
