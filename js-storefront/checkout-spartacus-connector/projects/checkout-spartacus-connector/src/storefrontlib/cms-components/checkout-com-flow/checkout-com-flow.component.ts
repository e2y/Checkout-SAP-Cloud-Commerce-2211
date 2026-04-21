import { AfterViewInit, ApplicationRef, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation, } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CheckoutWebComponents, Options } from '@checkout.com/checkout-web-components';
import { GlobalMessageService, GlobalMessageType, HttpErrorModel, LanguageService, LoggerService, WindowRef, } from '@spartacus/core';
import { Observable } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { CheckoutComFlowFacade } from '../../../core/facades/checkout-com-flow.facade';
import { CheckoutComFlowComponentInterface } from '../../../core/interfaces';

@Component({
  selector: 'lib-checkout-com-flow',
  templateUrl: './checkout-com-flow.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false
})
export class CheckoutComFlowComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('flowContainer', { static: false }) flowContainer!: ElementRef<HTMLElement>;
  @ViewChild('errorMessage', { static: false }) errorMessageRef!: ElementRef<HTMLSpanElement>;
  @ViewChild('successMessageRef', { static: false }) successMessageRef!: ElementRef<HTMLSpanElement>;
  isLoading$: Observable<boolean>;
  isEnabled$: Observable<boolean>;
  webComponentsError: string = '';
  successMessage: string = '';
  params: Partial<Options> = {};
  protected checkoutInstance: CheckoutWebComponents | null = null;
  protected checkoutComFlowFacade: CheckoutComFlowFacade = inject(CheckoutComFlowFacade);
  protected loggerService: LoggerService = inject(LoggerService);
  protected globalMessageService: GlobalMessageService = inject(GlobalMessageService);
  protected windowRef: WindowRef = inject(WindowRef);
  protected languageService: LanguageService = inject(LanguageService);
  protected appRef: ApplicationRef = inject(ApplicationRef);
  private flowComponent: CheckoutComFlowComponentInterface;
  private destroyRef: DestroyRef = inject(DestroyRef);

  /**
   * Lifecycle hook that is called after the component is initialized.
   * This method initializes the necessary observables for the flow
   * and starts listening for the flow-enabled state.
   * @since 2211.32.1
   */
  ngOnInit(): void {
    this.initializeFlowObservables();
  }

  /**
   * Lifecycle hook that is called after the component's view has been fully initialized.
   * This method triggers the initialization of the Checkout Flow feature.
   * @since 2211.32.1
   */
  ngAfterViewInit(): void {
    this.listenForFlowEnabled();
  }

  /**
   * Lifecycle hook that is called when the component is destroyed.
   * This method ensures that the `checkoutInstance` is cleaned up
   * by setting it to null if it is defined.
   * @since 2211.32.1
   */
  ngOnDestroy(): void {
    if (this.flowComponent?.unmount) {
      this.flowComponent.unmount();
    }
    this.checkoutComFlowFacade.clearPaymentSession();
    this.checkoutInstance = null;
  }

  /**
   * Creates payment sessions for the Checkout Flow feature.
   *
   * This method delegates the creation of payment sessions to the CheckoutComFlowFacade
   * and returns an observable that emits the resulting Checkout Web Components.
   *
   * @returns {Observable<CheckoutWebComponents>} An observable that emits the created Checkout Web Components.
   * @since 2211.32.1
   */
  createPaymentSessions(customOptions: Partial<Options>): Observable<CheckoutWebComponents> {
    return this.checkoutComFlowFacade.createPaymentSessions(customOptions);
  }

  /**
   * Initializes the observables for the Checkout Flow feature.
   *
   * This method sets up the `isLoading$` observable to track the processing state
   * and the `isEnabled$` observable to track whether the flow is enabled.
   * @since 2211.32.1
   */
  protected initializeFlowObservables(): void {
    this.languageService.getActive().pipe(
      tap((activeLanguage: string): void => {
        this.checkoutComFlowFacade.setLocale(activeLanguage);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
    this.isLoading$ = this.checkoutComFlowFacade.getIsProcessing();
  }

  /**
   * Subscribes to the `isEnabled$` observable to listen for when the Checkout Flow feature is enabled.
   *
   * Once the flow is enabled, this method triggers the creation of payment sessions
   * and handles the resulting Checkout Web Components or any errors that occur during the process.
   * The subscription is automatically cleaned up when the component is destroyed.
   *
   * @protected
   * @since 2211.32.1
   */
  protected listenForFlowEnabled(): void {
    this.checkoutComFlowFacade.getIsFlowEnabled().pipe(
      filter(Boolean),
      switchMap((): Observable<CheckoutWebComponents> => this.createPaymentSessions(this.params)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (checkout: CheckoutWebComponents): void => this.handleWebComponentsLoaded(checkout),
      error: (error: unknown): void => this.handleWebComponentsError(error)
    });
  }

  /**
   * Handles the successful loading of Checkout Web Components.
   *
   * This method assigns the loaded `CheckoutWebComponents` instance to the `checkoutInstance` property
   * and mounts the flow component to the DOM.
   *
   * @param {CheckoutWebComponents} checkout - The loaded Checkout Web Components instance.
   * @protected
   * @since 2211.32.1
   */
  protected handleWebComponentsLoaded(checkout: CheckoutWebComponents): void {
    this.checkoutInstance = checkout;
    if (!this.windowRef.isBrowser()) {
      return;
    }
    this.mountFlowComponent();
  }

  /**
   * Handles errors that occur while loading Checkout Web Components.
   *
   * This method sets the `webComponentsError` property to the error message
   * or a default message if the error message is unavailable. It also logs
   * the error using the `LoggerService`, displays a global error message
   * using the `GlobalMessageService`, and announces the error to assistive technology
   * by populating the error message live region.
   *
   * @param {HttpErrorModel} error - The error object containing details about the failure.
   * @protected
   * @since 2211.32.1
   */
  protected handleWebComponentsError(error: HttpErrorModel): void {
    this.webComponentsError = error?.message || 'Unknown error loading payment components';
    this.loggerService.error(error);
    this.globalMessageService.add(this.webComponentsError, GlobalMessageType.MSG_TYPE_ERROR);
    this.announceError(this.webComponentsError);
  }

  /**
   * Announces an error message to assistive technology via a live region.
   * Populates the error message span with the text content for screen readers.
   *
   * @param {string} errorMessage - The error message to announce.
   * @private
   * @since 2211.32.1
   */
  private announceError(errorMessage: string): void {
    if (this.errorMessageRef?.nativeElement) {
      this.errorMessageRef.nativeElement.textContent = errorMessage;
    }
  }

  /**
   * Announces a success message to assistive technology via a live region.
   * Populates the success message span with the text content for screen readers.
   *
   * @param {string} message - The success message to announce.
   * @protected
   * @since 2211.32.1
   */
  protected announceSuccess(message: string): void {
    this.successMessage = message;
    if (this.successMessageRef?.nativeElement) {
      this.successMessageRef.nativeElement.textContent = message;
    }
  }

  protected mountFlowComponent(): void {
    if (!this.checkoutInstance || !this.flowContainer?.nativeElement) {
      return;
    }

    try {
      if (this.flowComponent?.unmount) {
        this.flowComponent.unmount();
      }

      this.flowComponent = this.checkoutInstance.create('flow');
      this.flowComponent.mount(this.flowContainer.nativeElement);
    } catch (error) {
      this.loggerService.error('Error mounting flow component', error);
      this.handleWebComponentsError({ message: 'Error mounting payment component' });
    }
  }
}