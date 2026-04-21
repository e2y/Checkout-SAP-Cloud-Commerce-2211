package com.checkout.payments.request;

import com.google.gson.annotations.SerializedName;

public enum ItemType {

    @SerializedName("digital")
    DIGITAL,
    @SerializedName("discount")
    DISCOUNT,
    @SerializedName("physical")
    PHYSICAL,
    @SerializedName("shipping_fee")
    SHIPPING_FEE

}
