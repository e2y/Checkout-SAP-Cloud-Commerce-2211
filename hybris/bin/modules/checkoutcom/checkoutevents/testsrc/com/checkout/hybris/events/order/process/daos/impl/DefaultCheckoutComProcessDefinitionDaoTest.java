package com.checkout.hybris.events.order.process.daos.impl;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertSame;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.processengine.model.BusinessProcessModel;
import de.hybris.platform.servicelayer.search.FlexibleSearchQuery;
import de.hybris.platform.servicelayer.search.FlexibleSearchService;
import de.hybris.platform.servicelayer.search.SearchResult;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComProcessDefinitionDaoTest {

    private static final String ORDER_PROCESS_NAME = "orderProcessName";
    private static final String ORDER_CODE = "orderCode";
    private static final String REFUND_ACTION_ID = "refundActionId";
    private static final String QUERY_PARAM_ORDER_CODE = "orderCode";
    private static final String QUERY_PARAM_REFUND_ACTION_ID = "refundActionId";

    @InjectMocks
    private DefaultCheckoutComProcessDefinitionDao testObj;

    @Mock
    private FlexibleSearchService flexibleSearchServiceMock;
    @Mock
    private SearchResult<BusinessProcessModel> searchResultMock;
    @Mock
    private BusinessProcessModel businessProcessModelMock;
    @Captor
    private ArgumentCaptor<FlexibleSearchQuery> queryArgumentCaptor;

    @Before
    public void setUp() {
        final List<BusinessProcessModel> resultMock = Collections.singletonList(businessProcessModelMock);
        when(searchResultMock.getResult()).thenReturn(resultMock);
        when(flexibleSearchServiceMock.<BusinessProcessModel>search(queryArgumentCaptor.capture())).thenReturn(searchResultMock);
    }

    @Test
    public void findWaitingOrderProcesses_WhenOrderCodeNull_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.findWaitingOrderProcesses(null, ORDER_PROCESS_NAME))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Order code must not be null");
    }

    @Test
    public void findWaitingOrderProcesses_WhenOrderProcessCodeNull_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.findWaitingOrderProcesses(ORDER_CODE, null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Order process definition name must not be null");
    }

    @Test
    public void findWaitingOrderProcesses_WhenEverythingIsCorrect_ShouldReturnTheBusinessProcess() {
        final List<BusinessProcessModel> result = testObj.findWaitingOrderProcesses(ORDER_CODE, ORDER_PROCESS_NAME);

        assertEquals(1, result.size());
        assertSame(businessProcessModelMock, result.get(0));

        verify(flexibleSearchServiceMock).search(queryArgumentCaptor.capture());
        final FlexibleSearchQuery queryArgumentCaptorValue = queryArgumentCaptor.getValue();

        assertEquals(ORDER_CODE, queryArgumentCaptorValue.getQueryParameters().get(QUERY_PARAM_ORDER_CODE));
    }

    @Test
    public void findWaitingReturnProcesses_WhenRefundActionIdNull_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.findWaitingReturnProcesses(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("refundActionId must not be null");
    }

    @Test
    public void findWaitingReturnProcesses_WhenInputCorrect_ShouldReturnTheBusinessProcess() {
        final List<BusinessProcessModel> result = testObj.findWaitingReturnProcesses(REFUND_ACTION_ID);

        assertEquals(1, result.size());
        assertSame(businessProcessModelMock, result.get(0));

        verify(flexibleSearchServiceMock).search(queryArgumentCaptor.capture());
        final FlexibleSearchQuery queryArgumentCaptorValue = queryArgumentCaptor.getValue();

        assertEquals(REFUND_ACTION_ID, queryArgumentCaptorValue.getQueryParameters().get(QUERY_PARAM_REFUND_ACTION_ID));
    }

    @Test
    public void findWaitingVoidProcesses_WhenOrderCodeNull_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.findWaitingVoidProcesses(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Order code must not be null");
    }

    @Test
    public void findWaitingVoidProcesses_WhenInputCorrect_ShouldReturnTheBusinessProcess() {
        final List<BusinessProcessModel> result = testObj.findWaitingVoidProcesses(ORDER_CODE);

        assertEquals(1, result.size());
        assertSame(businessProcessModelMock, result.get(0));

        verify(flexibleSearchServiceMock).search(queryArgumentCaptor.capture());
        final FlexibleSearchQuery queryArgumentCaptorValue = queryArgumentCaptor.getValue();

        assertEquals(ORDER_CODE, queryArgumentCaptorValue.getQueryParameters().get(QUERY_PARAM_ORDER_CODE));
    }
}
