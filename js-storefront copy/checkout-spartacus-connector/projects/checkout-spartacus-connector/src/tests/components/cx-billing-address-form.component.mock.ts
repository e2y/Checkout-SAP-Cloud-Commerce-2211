import { Component, Input } from '@angular/core';
import { Address, Country } from '@spartacus/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'cx-billing-address-form',
    template: '',
    standalone: false
})
export class MockCxBillingAddressFormComponent {
  @Input() billingAddress: Address;
  @Input() countries$: Observable<Country[]>;
}