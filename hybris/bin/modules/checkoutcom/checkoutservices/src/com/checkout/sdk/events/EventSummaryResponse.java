package com.checkout.sdk.events;

import com.checkout.sdk.common.Resource;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.Instant;

@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class EventSummaryResponse extends Resource {
    private String id;
    private String type;
    private Instant createdOn;
}