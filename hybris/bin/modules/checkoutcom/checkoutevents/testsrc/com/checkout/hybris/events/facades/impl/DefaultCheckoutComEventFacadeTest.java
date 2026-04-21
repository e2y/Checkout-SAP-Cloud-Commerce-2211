package com.checkout.hybris.events.facades.impl;

import java.lang.reflect.Type;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.verify;

import com.checkout.hybris.events.beans.CheckoutComPaymentEventObject;
import com.checkout.hybris.events.payments.CheckoutComPaymentEvent;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import de.hybris.bootstrap.annotations.UnitTest;
import de.hybris.platform.servicelayer.event.EventService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@UnitTest
@RunWith(MockitoJUnitRunner.class)
public class DefaultCheckoutComEventFacadeTest {

    private static final String EVENT_BODY = "{body:'body'}";

    @InjectMocks
    private DefaultCheckoutComEventFacade testObj;

    @Mock
    private EventService eventServiceMock;

    @Captor
    private ArgumentCaptor<CheckoutComPaymentEvent> eventArgumentCaptor;

    @Test
    public void publishPaymentEvent_WhenNullBody_ShouldThrowException() {
        assertThatThrownBy(() -> testObj.publishPaymentEvent(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Event body cannot be null or empty.");
    }

    @Test
    public void publishPaymentEvent_WhenValidBody_ShouldPublishEvent() {
        testObj.publishPaymentEvent(EVENT_BODY);

        verify(eventServiceMock).publishEvent(eventArgumentCaptor.capture());

        final Type type = new TypeToken<CheckoutComPaymentEventObject>() {/**/
        }.getType();
        final CheckoutComPaymentEventObject eventBodyData = new Gson().fromJson(EVENT_BODY, type);
        eventBodyData.setPayLoad(EVENT_BODY);

        assertEquals(EVENT_BODY, eventArgumentCaptor.getValue().getEventBody().getPayLoad());
    }
}
