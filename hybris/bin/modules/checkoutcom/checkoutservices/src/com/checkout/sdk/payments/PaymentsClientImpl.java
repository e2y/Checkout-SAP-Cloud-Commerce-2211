package com.checkout.sdk.payments;

import com.checkout.sdk.ApiClient;
import com.checkout.sdk.ApiCredentials;
import com.checkout.sdk.CheckoutConfiguration;
import com.checkout.sdk.SecretKeyCredentials;
import com.checkout.sdk.common.Resource;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

public class PaymentsClientImpl implements PaymentsClient {
    private static final Map<Integer, Class<? extends Resource>> PAYMENT_RESPONSE_MAPPINGS = new HashMap<>();

    static {
        PAYMENT_RESPONSE_MAPPINGS.put(202, PaymentPending.class); // ACCEPTED
        PAYMENT_RESPONSE_MAPPINGS.put(201, PaymentProcessed.class); // CREATED
    }

    private final ApiClient apiClient;
    private final ApiCredentials credentials;

    public PaymentsClientImpl(ApiClient apiClient, CheckoutConfiguration configuration) {
        if (apiClient == null) {
            throw new IllegalArgumentException("apiClient must not be null");
        }
        if (configuration == null) {
            throw new IllegalArgumentException("configuration must not be null");
        }

        this.apiClient = apiClient;
        credentials = new SecretKeyCredentials(configuration);
    }

    private static String getPaymentUrl(String paymentId) {
        final String path = "payments/";
        return path + paymentId;
    }

    @Override
    public <T extends RequestSource> CompletableFuture<PaymentResponse> requestAsync(PaymentRequest<T> paymentRequest) {
        return requestPaymentAsync(paymentRequest, null);
    }

    @Override
    public <T extends RequestSource> CompletableFuture<PaymentResponse> requestAsync(PaymentRequest<T> paymentRequest, String idempotencyKey) {
        return requestPaymentAsync(paymentRequest, idempotencyKey);
    }

    @Override
    public CompletableFuture<GetPaymentResponse> getAsync(String paymentId) {
        return apiClient.getAsync(getPaymentUrl(paymentId), credentials, GetPaymentResponse.class);
    }

    @Override
    public CompletableFuture<List<PaymentAction>> getActionsAsync(String paymentId) {
        final String path = "/actions";
        return apiClient.getAsync(getPaymentUrl(paymentId) + path, credentials, PaymentAction[].class)
                .thenApply(Arrays::asList);
    }

    @Override
    public CompletableFuture<CaptureResponse> captureAsync(String paymentId) {
        return captureAsync(paymentId, (CaptureRequest) null);
    }

    @Override
    public CompletableFuture<CaptureResponse> captureAsync(String paymentId, String idempotencyKey) {
        return captureAsync(paymentId, null, idempotencyKey);
    }

    @Override
    public CompletableFuture<CaptureResponse> captureAsync(String paymentId, CaptureRequest captureRequest) {
        final String path = "/captures";
        return apiClient.postAsync(getPaymentUrl(paymentId) + path, credentials, CaptureResponse.class, captureRequest, null);
    }

    @Override
    public CompletableFuture<CaptureResponse> captureAsync(String paymentId, CaptureRequest captureRequest, String idempotencyKey) {
        final String path = "/captures";
        return apiClient.postAsync(getPaymentUrl(paymentId) + path, credentials, CaptureResponse.class, captureRequest, idempotencyKey);
    }

    @Override
    public CompletableFuture<RefundResponse> refundAsync(String paymentId) {
        return refundAsync(paymentId, (RefundRequest) null);
    }

    @Override
    public CompletableFuture<RefundResponse> refundAsync(String paymentId, String idempotencyKey) {
        return refundAsync(paymentId, null, idempotencyKey);
    }

    @Override
    public CompletableFuture<RefundResponse> refundAsync(String paymentId, RefundRequest refundRequest) {
        final String path = "/refunds";
        return apiClient.postAsync(getPaymentUrl(paymentId) + path, credentials, RefundResponse.class, refundRequest, null);
    }

    @Override
    public CompletableFuture<RefundResponse> refundAsync(String paymentId, RefundRequest refundRequest, String idempotencyKey) {
        final String path = "/refunds";
        return apiClient.postAsync(getPaymentUrl(paymentId) + path, credentials, RefundResponse.class, refundRequest, idempotencyKey);
    }

    @Override
    public CompletableFuture<VoidResponse> voidAsync(String paymentId) {
        return voidAsync(paymentId, (VoidRequest) null);
    }

    @Override
    public CompletableFuture<VoidResponse> voidAsync(String paymentId, String idempotencyKey) {
        return voidAsync(paymentId, null, idempotencyKey);
    }

    @Override
    public CompletableFuture<VoidResponse> voidAsync(String paymentId, VoidRequest voidRequest) {
        final String path = "/voids";
        return apiClient.postAsync(getPaymentUrl(paymentId) + path, credentials, VoidResponse.class, voidRequest, null);
    }

    @Override
    public CompletableFuture<VoidResponse> voidAsync(String paymentId, VoidRequest voidRequest, String idempotencyKey) {
        final String path = "/voids";
        return apiClient.postAsync(getPaymentUrl(paymentId) + path, credentials, VoidResponse.class, voidRequest, idempotencyKey);
    }

    private <T extends RequestSource> CompletableFuture<PaymentResponse> requestPaymentAsync(PaymentRequest<T> paymentRequest, String idempotencyKey) {
        final String path = "payments";
        return apiClient.postAsync(path, credentials, PAYMENT_RESPONSE_MAPPINGS, paymentRequest, idempotencyKey)
                .thenApply((Resource it) -> {
                    if (it instanceof PaymentPending) {
                        return PaymentResponse.from((PaymentPending) it);
                    } else if (it instanceof PaymentProcessed) {
                        return PaymentResponse.from((PaymentProcessed) it);
                    } else {
                        throw new IllegalStateException("Expected one of PaymentPending and PaymentProcessed but was " + it.getClass());
                    }
                });
    }
}