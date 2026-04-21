import { Component, Input } from '@angular/core';
@Component({
    selector: 'lib-checkout-com-order-summary',
    template: '',
    standalone: false
})
export class MockCheckoutComOrderSummaryComponent {
  @Input() cart: any;
}