import { ChangeDetectionStrategy, Component, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ApmData } from '../../../../core/model/ApmData';
import { CheckoutComApmService } from '../../../../core/services/apm/checkout-com-apm.service';

@Component({
  selector: 'lib-checkout-com-apm-tile',
  templateUrl: './checkout-com-apm-tile.component.html',
  styleUrls: ['./checkout-com-apm-tile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CheckoutComApmTileComponent {
  @Input() apm: ApmData;
  selectedApm$: Observable<ApmData> = this.checkoutComApmService.getSelectedApmFromState();

  constructor(protected checkoutComApmService: CheckoutComApmService) {
  }

  @HostListener('click')
  select(): void {
    this.checkoutComApmService.selectApm(this.apm);
  }
}
