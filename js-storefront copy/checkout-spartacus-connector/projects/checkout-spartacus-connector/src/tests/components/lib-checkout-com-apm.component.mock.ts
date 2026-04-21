import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Address } from '@spartacus/core';
import { ApmPaymentDetails } from '../../core/interfaces';

@Component({
    selector: 'lib-checkout-com-apm',
    template: '',
    standalone: false
})
export class MockLibCheckoutComApmComponent {
  @Output() setPaymentDetails: EventEmitter<any> = new EventEmitter<{
    paymentDetails: ApmPaymentDetails,
    billingAddress: Address
  }>();
  @Input() goBack: () => void;
  @Input() processing = false;
}