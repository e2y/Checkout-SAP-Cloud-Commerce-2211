package com.checkout.hybris.core.flow.paymentsession.populators;

import com.checkout.handlepaymentsandpayouts.flow.requests.PaymentSessionCreateRequest;
import com.checkout.hybris.core.currency.services.CheckoutComCurrencyService;
import com.checkout.payments.ProductRequest;
import com.checkout.payments.request.ItemType;
import de.hybris.platform.converters.Populator;
import de.hybris.platform.core.model.order.AbstractOrderEntryModel;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.core.model.product.ProductModel;
import de.hybris.platform.servicelayer.dto.converter.ConversionException;
import de.hybris.platform.util.DiscountValue;
import de.hybris.platform.util.TaxValue;

import java.util.ArrayList;
import java.util.List;

public class DefaultCheckoutComFlowItemsPopulator implements Populator<CartModel, PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?>> {

    private final CheckoutComCurrencyService checkoutComCurrencyService;

    public DefaultCheckoutComFlowItemsPopulator(final CheckoutComCurrencyService checkoutComCurrencyService) {
        this.checkoutComCurrencyService = checkoutComCurrencyService;
    }

    @Override
    public void populate(final CartModel cartModel, final PaymentSessionCreateRequest.PaymentSessionCreateRequestBuilder<?,?> paymentSessionRequestBuilder) throws ConversionException {
        paymentSessionRequestBuilder.items(getItems(cartModel));
    }

    protected List<ProductRequest> getItems(final CartModel cartModel) {
        final List<ProductRequest> list = new ArrayList<>(cartModel.getEntries()
                .stream()
                .map(this::getItem)
                .toList());
        list.add(getShippingItem(cartModel));
        return list;
    }
    protected ProductRequest getShippingItem(final CartModel cartModel) {
        final ProductRequest item = new ProductRequest();
        final String currencyIsoCode = cartModel.getCurrency().getIsocode();
        final Double taxesPercent = cartModel.getTotalTaxValues()
                .stream()
                .mapToDouble(TaxValue::getValue)
                .sum();
        item.setName("shipping");
        item.setType(ItemType.SHIPPING_FEE);
        item.setReference(cartModel.getDeliveryMode().getCode());
        item.setQuantity(1L);
        final Long deliveryCost = checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode, cartModel.getDeliveryCost());
        item.setUnitPrice(deliveryCost);
        item.setTotalAmount(deliveryCost);
        item.setTaxRate(checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode,taxesPercent));

        return item;
    }
    protected ProductRequest getItem(final AbstractOrderEntryModel abstractOrderEntryModel) {
        final ProductRequest item = new ProductRequest();
        final ProductModel product = abstractOrderEntryModel.getProduct();
        final String currencyIsoCode = abstractOrderEntryModel.getOrder().getCurrency().getIsocode();
         final Double taxesPercent = abstractOrderEntryModel.getTaxValues()
                .stream()
                .mapToDouble(TaxValue::getValue)
                .sum();
        final Double discount = abstractOrderEntryModel.getDiscountValues()
                .stream()
                .mapToDouble(DiscountValue::getAppliedValue)
                .sum();
        item.setName(product.getName());
        item.setReference(product.getCode());
        item.setCommodityCode(product.getCode());
        item.setQuantity(abstractOrderEntryModel.getQuantity());
        item.setUnitOfMeasure(abstractOrderEntryModel.getUnit().getName());
        item.setUnitPrice(checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode,abstractOrderEntryModel.getBasePrice()));
        item.setTotalAmount(checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode,abstractOrderEntryModel.getTotalPrice()));
        item.setDiscountAmount(checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode,discount));
        item.setTaxRate(checkoutComCurrencyService.removeDecimalsFromCurrencyAmount(currencyIsoCode,taxesPercent));

        return item;
    }
}
