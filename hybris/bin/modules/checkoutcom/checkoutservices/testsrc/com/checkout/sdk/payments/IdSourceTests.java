package com.checkout.sdk.payments;

import com.checkout.sdk.payments.IdSource;
import org.junit.Assert;
import org.junit.Test;

public class IdSourceTests {
    @Test(expected = IllegalArgumentException.class)
    public void given_id_missing_should_throw_exception() {
        new IdSource(null);
    }

    @Test
    public void can_create_id_source() {
        IdSource source = new IdSource("src_xxx");
        source.setCvv("0757");
        Assert.assertEquals("src_xxx", source.getId());
        Assert.assertEquals("0757", source.getCvv());
    }
}
