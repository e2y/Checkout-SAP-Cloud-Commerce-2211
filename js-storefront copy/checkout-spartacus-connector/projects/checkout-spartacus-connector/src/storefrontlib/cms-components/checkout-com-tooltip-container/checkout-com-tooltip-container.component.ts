import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-checkout-com-tooltip-container',
  templateUrl: './checkout-com-tooltip-container.component.html',
  standalone: false
})
export class CheckoutComTooltipContainerComponent {
  @Input() tooltipText: string = null;
}
