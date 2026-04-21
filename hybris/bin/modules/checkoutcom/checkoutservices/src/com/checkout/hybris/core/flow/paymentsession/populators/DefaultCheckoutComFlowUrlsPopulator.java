package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.url.services.CheckoutComUrlService;
import de.hybris.platform.cms2.servicelayer.services.CMSSiteService;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;

public class DefaultCheckoutComFlowUrlsPopulator implements Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> {

    private final CheckoutComUrlService checkoutComUrlService;
    private final CMSSiteService cmsSiteService;

    public DefaultCheckoutComFlowUrlsPopulator(final CheckoutComUrlService checkoutComUrlService, final CMSSiteService cmsSiteService) {
        this.checkoutComUrlService = checkoutComUrlService;
        this.cmsSiteService = cmsSiteService;
    }

    @Override
    public void populate(final CartModel cartModel, final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?> paymentSessionRequestBuilder) throws ConversionException {
        paymentSessionRequestBuilder.successUrl(checkoutComUrlService.getFullUrl(cmsSiteService.getCurrentSite().getCheckoutComSuccessRedirectUrl(), true));
        paymentSessionRequestBuilder.failureUrl(checkoutComUrlService.getFullUrl(cmsSiteService.getCurrentSite().getCheckoutComFailureRedirectUrl(), true));

    }
}
