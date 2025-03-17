import { LaunchDialogService } from '@spartacus/storefront';
import { EMPTY } from 'rxjs';

export class MockLaunchDialogService implements Partial<LaunchDialogService> {
  openDialogAndSubscribe() {
    return EMPTY;
  }
}