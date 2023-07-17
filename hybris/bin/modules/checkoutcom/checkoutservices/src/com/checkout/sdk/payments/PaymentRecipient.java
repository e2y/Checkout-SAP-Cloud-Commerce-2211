package com.checkout.sdk.payments;

import com.google.gson.annotations.SerializedName;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PaymentRecipient {
    @SerializedName("dob")
    private final LocalDate dateOfBirth;
    private final String accountNumber;
    private final String zip;
    private final String firstName;
    private final String lastName;
    private final String country;

    public PaymentRecipient(LocalDate dateOfBirth,
                            String accountNumber,
                            String zip,
                            String firstName,
                            String lastName,
                            String country) {
        this.dateOfBirth = dateOfBirth;
        this.accountNumber = accountNumber;
        this.zip = zip;
        this.firstName = firstName;
        this.lastName = lastName;
        this.country = country;
    }
}