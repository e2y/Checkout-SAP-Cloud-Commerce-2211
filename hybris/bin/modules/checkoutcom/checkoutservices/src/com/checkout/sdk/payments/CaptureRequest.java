package com.checkout.sdk.payments;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaptureRequest {
    private Long amount;
    private String reference;
    private Map<String, Object> metadata;
}