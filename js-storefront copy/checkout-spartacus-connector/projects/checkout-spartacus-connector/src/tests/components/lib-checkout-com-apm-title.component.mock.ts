import { Component, Input } from '@angular/core';
import { ApmData } from '../../core/model/ApmData';

@Component({
    template: '',
    selector: 'lib-checkout-com-apm-tile',
    standalone: false
})
export class MockLibCheckoutComApmTitle {
  @Input() apm: ApmData;
}
