package com.checkout.sdk.common;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
public class Link {
    private final String href;
    private final String title;
}
