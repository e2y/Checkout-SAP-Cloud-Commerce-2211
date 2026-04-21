package com.checkout.hybris.core.order.hooks;

import de.hybris.platform.commerceservices.order.hook.CommerceCartCalculationMethodHook;
import de.hybris.platform.commerceservices.service.data.CommerceCartParameter;
import de.hybris.platform.core.model.order.CartModel;
import de.hybris.platform.servicelayer.model.ModelService;
import de.hybris.platform.util.TaxValue;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class DefaultCheckoutComAdditionalTaxesCalculationMethodHook implements CommerceCartCalculationMethodHook {

    private final ModelService modelService;

    public DefaultCheckoutComAdditionalTaxesCalculationMethodHook(final ModelService modelService) {
        this.modelService = modelService;
    }

    @Override
    public void afterCalculate(final CommerceCartParameter parameter) {
        final CartModel cartModel = parameter.getCart();
        cartModel.setDeliveryCostTaxes(amountTaxesCalculation(cartModel, cartModel.getDeliveryCost()));
        cartModel.setPaymentCostTaxes(amountTaxesCalculation(cartModel, cartModel.getPaymentCost()));
        modelService.save(cartModel);
        modelService.refresh(cartModel);
    }

    protected BigDecimal amountTaxesCalculation(final CartModel cartModel, final Double amount) {
        BigDecimal amountTaxes = BigDecimal.ZERO;

        if (amount == null || amount <= 0) {
            return amountTaxes;
        }
        final double taxesValue = cartModel.getTotalTaxValues()
                .stream()
                .map(TaxValue::getValue)
                .reduce(Double::sum)
                .orElse(0D);

        if(Boolean.TRUE.equals(cartModel.getNet()) && taxesValue > 0.0) {
            final double doubleAmountTaxes = amount * (taxesValue / 100);
            amountTaxes =  BigDecimal.valueOf(doubleAmountTaxes).setScale(2, RoundingMode.HALF_UP);
        }
        else if(Boolean.FALSE.equals(cartModel.getNet()) && taxesValue > 0.0) {
            final double subTotalAmount = amount / (1 + taxesValue / 100);
            final double doubleAmountTaxes = amount - subTotalAmount;
            amountTaxes = BigDecimal.valueOf(doubleAmountTaxes).setScale(2, RoundingMode.HALF_UP);
        }
        return amountTaxes;
    }

    @Override
    public void beforeCalculate(final CommerceCartParameter parameter) {
        //DO NOTHING
    }
}
