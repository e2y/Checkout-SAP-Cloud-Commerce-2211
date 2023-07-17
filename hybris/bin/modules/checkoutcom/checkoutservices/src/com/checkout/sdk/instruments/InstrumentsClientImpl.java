package com.checkout.sdk.instruments;

import com.checkout.sdk.ApiClient;
import com.checkout.sdk.ApiCredentials;
import com.checkout.sdk.CheckoutConfiguration;
import com.checkout.sdk.SecretKeyCredentials;

import java.util.concurrent.CompletableFuture;

public class InstrumentsClientImpl implements InstrumentsClient {

    private final ApiClient apiClient;
    private final ApiCredentials credentials;

    public InstrumentsClientImpl(ApiClient apiClient, CheckoutConfiguration configuration) {
        if (apiClient == null) {
            throw new IllegalArgumentException("apiClient must not be null");
        }
        if (configuration == null) {
            throw new IllegalArgumentException("configuration must not be null");
        }

        this.apiClient = apiClient;
        credentials = new SecretKeyCredentials(configuration);
    }

    @Override
    public CompletableFuture<CreateInstrumentResponse> createInstrument(CreateInstrumentRequest createInstrumentRequest) {
        return apiClient.postAsync("instruments", credentials, CreateInstrumentResponse.class, createInstrumentRequest, null);
    }

    @Override
    public CompletableFuture<InstrumentDetailsResponse> getInstrument(String instrumentId) {
        return apiClient.getAsync("instruments/" + instrumentId, credentials, InstrumentDetailsResponse.class);
    }

    @Override
    public CompletableFuture<UpdateInstrumentResponse> updateInstrument(String instrumentId, UpdateInstrumentRequest updateInstrumentRequest) {
        return apiClient.patchAsync("instruments/" + instrumentId, credentials, UpdateInstrumentResponse.class, updateInstrumentRequest, null);
    }

    @Override
    public CompletableFuture<Void> deleteInstrument(String instrumentId) {
        return apiClient.deleteAsync("instruments/" + instrumentId, credentials);
    }
}
