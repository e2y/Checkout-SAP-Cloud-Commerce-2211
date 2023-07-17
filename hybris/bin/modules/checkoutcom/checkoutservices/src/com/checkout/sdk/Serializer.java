package com.checkout.sdk;

public interface Serializer {
    <T> String toJson(T object);

    <T> T fromJson(String json, Class<T> type);
}
