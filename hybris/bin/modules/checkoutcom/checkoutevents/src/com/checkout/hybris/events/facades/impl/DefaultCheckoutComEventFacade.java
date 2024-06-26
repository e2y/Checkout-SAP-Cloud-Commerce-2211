package com.checkout.hybris.events.facades.impl;

import com.checkout.hybris.events.beans.CheckoutComPaymentEventObject;
import com.checkout.hybris.events.facades.CheckoutComEventFacade;
import com.checkout.hybris.events.payments.CheckoutComPaymentEvent;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import de.hybris.platform.servicelayer.event.EventService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.lang.reflect.Type;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * Default implementation of {@link CheckoutComEventFacade}
 */
public class DefaultCheckoutComEventFacade implements CheckoutComEventFacade {

    protected static final Logger LOG = LogManager.getLogger(DefaultCheckoutComEventFacade.class);

    protected final EventService eventService;

    public DefaultCheckoutComEventFacade(final EventService eventService) {
        this.eventService = eventService;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void publishPaymentEvent(final String eventBody) {
        checkArgument(isNotBlank(eventBody), "Event body cannot be null or empty.");

        final Type type = new TypeToken<CheckoutComPaymentEventObject>() {/**/
        }.getType();
        final CheckoutComPaymentEventObject eventBodyData = new Gson().fromJson(eventBody, type);
        eventBodyData.setPayLoad(eventBody);
        LOG.debug("Event body is: [{}]", eventBody);

        final CheckoutComPaymentEvent checkoutComPaymentEvent = new CheckoutComPaymentEvent(eventBodyData);
        eventService.publishEvent(checkoutComPaymentEvent);
    }
}
