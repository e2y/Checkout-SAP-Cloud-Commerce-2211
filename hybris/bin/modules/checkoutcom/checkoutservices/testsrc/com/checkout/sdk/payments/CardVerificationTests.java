package com.checkout.sdk.payments;

import com.checkout.sdk.SandboxTestFixture;
import com.checkout.sdk.TestHelper;
import org.junit.Assert;
import org.junit.Test;

public class CardVerificationTests extends SandboxTestFixture {
    @Test
    public void can_verify_card() throws Exception {
        PaymentRequest<CardSource> paymentRequest = TestHelper.createCardPaymentRequest(0L);
        PaymentResponse paymentResponse = getApi().paymentsClient().requestAsync(paymentRequest).get();

        Assert.assertEquals(PaymentStatus.CARD_VERIFIED, paymentResponse.getPayment().getStatus());
    }
}
