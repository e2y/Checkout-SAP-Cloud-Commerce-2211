package com.checkout.hybris.fulfilmentprocess.listeners;

import java.util.Set;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.basecommerce.model.site.BaseSiteModel;
import de.hybris.platform.commerceservices.enums.SiteChannel;
import de.hybris.platform.commerceservices.event.CreateReturnEvent;
import de.hybris.platform.processengine.BusinessProcessService;
import de.hybris.platform.returns.model.ReturnProcessModel;
import de.hybris.platform.returns.model.ReturnRequestModel;
import de.hybris.platform.servicelayer.model.ModelService;
import de.hybris.platform.store.BaseStoreModel;
import de.hybris.platform.store.services.BaseStoreService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Answers;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class DefaultCreateReturnEventListenerTest {

    private static final String PROCESS_CODE = "processCode";
    private static final String RETURN_REQUEST_CODE = "returnRequestCode";

    @Spy
    @InjectMocks
    private DefaultCreateReturnEventListener testObj;

    @Mock
    private BusinessProcessService businessProcessServiceMock;
    @Mock
    private ModelService modelServiceMock;
    @Mock
    private BaseStoreService baseStoreServiceMock;

    @Mock
    private CreateReturnEvent eventMock;
    @Mock(answer = Answers.RETURNS_DEEP_STUBS)
    private ReturnRequestModel returnRequestMock;
    @Mock
    private BaseStoreModel baseStoreMock;
    @Mock
    private ReturnProcessModel businessProcessMock;
    @Mock
    private BaseSiteModel baseSiteMock;

    @Captor
    private ArgumentCaptor<String> processCodeArgumentCaptor;

    @Before
    public void setUp() {
        testObj.setSupportedSiteChannels(Set.of(SiteChannel.B2C));
    }

    @Test
    public void onSiteEvent_WhenNoReturnRequest_ShouldFail() {
        when(eventMock.getReturnRequest()).thenReturn(null);

        assertThatThrownBy(() -> testObj.onSiteEvent(eventMock))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Parameter event.returnRequest can not be null");
    }

    @Test
    public void onSiteEvent_WhenNoBaseStore_ShouldDoNothing() {
        when(eventMock.getReturnRequest()).thenReturn(returnRequestMock);
        doReturn(null).when(testObj).getBaseStore(returnRequestMock);

        testObj.onSiteEvent(eventMock);

        verify(testObj, never()).startBusinessProcess(anyString(), any(ReturnRequestModel.class));
    }

    @Test
    public void onSiteEvent_WhenNoProcessDefinitionName_ShouldDoNothing() {
        when(eventMock.getReturnRequest()).thenReturn(returnRequestMock);
        doReturn(baseStoreMock).when(testObj).getBaseStore(returnRequestMock);
        when(baseStoreMock.getCreateReturnProcessCode()).thenReturn("");

        testObj.onSiteEvent(eventMock);

        verify(testObj, never()).startBusinessProcess(anyString(), any(ReturnRequestModel.class));
    }

    @Test
    public void onSiteEvent_WhenProcessDefinitionFound_ShouldStartBusinessProcess() {
        doReturn(baseStoreMock).when(testObj).getBaseStore(returnRequestMock);
        doNothing().when(testObj).startBusinessProcess(anyString(), any(ReturnRequestModel.class));
        when(eventMock.getReturnRequest()).thenReturn(returnRequestMock);
        when(baseStoreMock.getCreateReturnProcessCode()).thenReturn(PROCESS_CODE);

        testObj.onSiteEvent(eventMock);

        verify(testObj).startBusinessProcess(PROCESS_CODE, returnRequestMock);
    }

    @Test
    public void startBusinessProcess_ShouldCreateAndStartBusinessProcess() {
        when(returnRequestMock.getCode()).thenReturn(RETURN_REQUEST_CODE);
        when(businessProcessServiceMock.createProcess(anyString(), eq(PROCESS_CODE))).thenReturn(businessProcessMock);

        testObj.startBusinessProcess(PROCESS_CODE, returnRequestMock);

        verify(businessProcessMock).setReturnRequest(returnRequestMock);
        verify(modelServiceMock).save(businessProcessMock);
        verify(businessProcessServiceMock).startProcess(businessProcessMock);
        verify(businessProcessServiceMock).createProcess(processCodeArgumentCaptor.capture(), eq(PROCESS_CODE));

        final String processCodeValue = processCodeArgumentCaptor.getValue();
        assertTrue(processCodeValue.startsWith(PROCESS_CODE + "-" + RETURN_REQUEST_CODE + "-"));
    }

    @Test
    public void getBaseStore_WhenReturnRequestHasStore_ReturnStoreFromReturnRequest() {
        when(returnRequestMock.getOrder().getStore()).thenReturn(baseStoreMock);

        final BaseStoreModel result = testObj.getBaseStore(returnRequestMock);

        assertSame(baseStoreMock, result);
    }

    @Test
    public void getBaseStore_WhenReturnRequestDoesNotHaveStore_ReturnCurrentBaseStore() {
        when(returnRequestMock.getOrder().getStore()).thenReturn(null);
        when(baseStoreServiceMock.getCurrentBaseStore()).thenReturn(baseStoreMock);

        final BaseStoreModel result = testObj.getBaseStore(returnRequestMock);

        assertSame(baseStoreMock, result);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldHandleEvent_WhenNoReturnRequest_ShouldFail() {
        when(eventMock.getReturnRequest()).thenReturn(null);

        testObj.shouldHandleEvent(eventMock);
    }

    @Test(expected = IllegalArgumentException.class)
    public void shouldHandleEvent_WhenNoSite_ShouldFail() {
        when(eventMock.getReturnRequest()).thenReturn(returnRequestMock);
        when(returnRequestMock.getOrder().getSite()).thenReturn(null);

        testObj.shouldHandleEvent(eventMock);
    }

    @Test
    public void shouldHandleEvent_WhenSiteFoundAndChannelSupported_ShouldReturnTrue() {
        when(eventMock.getReturnRequest()).thenReturn(returnRequestMock);
        when(returnRequestMock.getOrder().getSite()).thenReturn(baseSiteMock);
        when(baseSiteMock.getChannel()).thenReturn(SiteChannel.B2C);

        final boolean result = testObj.shouldHandleEvent(eventMock);

        assertTrue(result);
    }

    @Test
    public void shouldHandleEvent_WhenSiteFoundAndChannelNotSupported_ShouldReturnFalse() {
        when(eventMock.getReturnRequest()).thenReturn(returnRequestMock);
        when(returnRequestMock.getOrder().getSite()).thenReturn(baseSiteMock);
        when(baseSiteMock.getChannel()).thenReturn(SiteChannel.B2B);

        final boolean result = testObj.shouldHandleEvent(eventMock);

        assertFalse(result);
    }
}
