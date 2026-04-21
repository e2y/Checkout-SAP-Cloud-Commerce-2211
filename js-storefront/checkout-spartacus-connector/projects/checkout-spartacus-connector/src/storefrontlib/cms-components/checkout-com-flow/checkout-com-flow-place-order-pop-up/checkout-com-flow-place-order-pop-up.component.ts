import { Component, DestroyRef, inject, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventService } from '@spartacus/core';
import { OrderPlacedEvent } from '@spartacus/order/root';
import { LaunchDialogService } from '@spartacus/storefront';
import { Observable } from 'rxjs';
import { CheckoutComOrderPlacedEvent } from '../../../../core/events/checkout-order.events';
import { CheckoutComFlowFacade } from '../../../../core/facades/checkout-com-flow.facade';

@Component({
  selector: 'y-checkout-com-flow-place-order-pop-up',
  templateUrl: './checkout-com-flow-place-order-pop-up.component.html',
  styleUrls: ['./checkout-com-flow-place-order-pop-up.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class CheckoutComFlowPlaceOrderPopUpComponent {
  protected destroyRef: DestroyRef = inject(DestroyRef);
  protected launchDialogService: LaunchDialogService = inject(LaunchDialogService);
  protected eventService: EventService = inject(EventService);
  protected checkoutComFlowFacade: CheckoutComFlowFacade = inject(CheckoutComFlowFacade);
  private readonly BODY_OVERFLOW_CLASS: string = 'popup-open';

  constructor() {
    this.addBodyOverflowHidden();
    this.bindOrderPlacedEvent();
    this.bindCheckoutComOrderPlacedEvent();
    this.bindDialogClose();
  }

  /**
   * Provides an observable that emits the state of modal actions.
   *
   * This method retrieves the observable from the CheckoutComFlowFacade
   * to determine whether modal actions are currently disabled.
   *
   * @returns {Observable<boolean>} An observable that emits `true` if modal actions are disabled, otherwise `false`.
   * @since 2211.32.1
   */
  disableModalActions(): Observable<boolean> {
    return this.checkoutComFlowFacade.getDisableModalActions();
  }

  /**
   * Closes the dialog using the LaunchDialogService.
   *
   * @return void
   * @since 2211.32.1
   */
  close(): void {
    this.removeBodyOverflowHidden();
    this.launchDialogService.closeDialog('CheckoutComFlowPlaceOrderPopUpComponent');
  }

  /**
   * Subscribes to the `OrderPlacedEvent` and closes the dialog when the event is triggered.
   *
   * This method listens for the `OrderPlacedEvent` using the `EventService` and ensures
   * that the subscription is automatically cleaned up when the component is destroyed
   * by using the `takeUntilDestroyed` operator.
   *
   * @return void
   * @since 2211.32.1
   */
  bindOrderPlacedEvent(): void {
    this.eventService.get(OrderPlacedEvent).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (): void => {
        this.close();
      }
    });
  }

  /**
   * Subscribes to the CheckoutComOrderPlacedEvent and closes the dialog if the order was not successful.
   *
   * This method listens for the CheckoutComOrderPlacedEvent using the EventService and ensures
   * that the subscription is automatically cleaned up when the component is destroyed
   * by using the takeUntilDestroyed operator. If the event indicates an unsuccessful order,
   * the dialog is closed.
   *
   * @return void
   * @since 2211.32.1
   */
  bindCheckoutComOrderPlacedEvent(): void {
    this.eventService.get(CheckoutComOrderPlacedEvent).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (checkoutComOrderPlacedEvent: CheckoutComOrderPlacedEvent): void => {
        if (!checkoutComOrderPlacedEvent.successful) {
          this.close();
        }
      }
    });
  }

  /**
   * Adds overflow-hidden class to body when popup opens.
   *
   * @return void
   * @since 2211.32.1
   */
  protected addBodyOverflowHidden(): void {
    document.body.classList.add(this.BODY_OVERFLOW_CLASS);
  }

  /**
   * Removes overflow-hidden class from body when popup closes.
   *
   * @return void
   * @since 2211.32.1-flow
   */
  private removeBodyOverflowHidden(): void {
    document.body.classList.remove(this.BODY_OVERFLOW_CLASS);
  }

  /**
   * Listens for dialog close events to ensure body overflow is restored
   * even if the dialog is closed through other means.
   *
   * @return void
   * @since 2211.32.1
   */
  private bindDialogClose(): void {
    this.destroyRef.onDestroy((): void   => {
      this.removeBodyOverflowHidden();
    });
  }
}
