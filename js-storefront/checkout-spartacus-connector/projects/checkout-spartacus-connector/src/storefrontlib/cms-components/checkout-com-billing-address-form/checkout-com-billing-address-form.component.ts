import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { CheckoutComPaymentDetails } from '@checkout-core/interfaces';
import { CheckoutComPaymentFacade } from '@checkout-facades/checkout-com-payment.facade';
import { CheckoutComBillingAddressFormService } from '@checkout-services/billing-address-form/checkout-com-billing-address-form.service';
import { CheckoutBillingAddressFormComponent } from '@spartacus/checkout/base/components';
import { Address, Country, EventService, GlobalMessageType, HttpErrorModel, LoggerService, QueryState, Region, Translatable } from '@spartacus/core';
import { Card, getAddressNumbers } from '@spartacus/storefront';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, switchMap, take, tap } from 'rxjs/operators';

@Component({
  selector: 'lib-checkout-com-billing-address-form',
  templateUrl: './checkout-com-billing-address-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CheckoutComBillingAddressFormComponent extends CheckoutBillingAddressFormComponent implements OnInit {
  public processing$: Observable<boolean>;
  protected logger: LoggerService = inject(LoggerService);
  protected eventService: EventService = inject(EventService);
  protected destroyRef: DestroyRef = inject(DestroyRef);
  protected checkoutComPaymentFacade: CheckoutComPaymentFacade = inject(CheckoutComPaymentFacade);
  protected override billingAddressFormService: CheckoutComBillingAddressFormService = inject(CheckoutComBillingAddressFormService);
  @Input() override billingAddressForm: UntypedFormGroup = this.billingAddressFormService.getBillingAddressForm();
  protected deliveryAddress: Address = null;
  protected editModeEnabled$: Observable<boolean> = this.billingAddressFormService.isEditModeEnabled();
  protected showSameAsDeliveryAddressCheckbox: boolean;
  protected paymentAddress$: Observable<Address> = this.checkoutComPaymentFacade.getPaymentAddressFromState();
  protected billingAddress$: Observable<Address> = this.billingAddressFormService.billingAddress$;

  /**
   * Initializes the component by building the billing address form, fetching all billing countries,
   * fetching the delivery address state, binding changes to the regions based on the selected country,
   * and binding the visibility of the "same as shipping address" checkbox to the presence of a shipping address.
   *
   * @return {void}
   * @since 5.2.0
   */
  override ngOnInit(): void {
    // OOTB Functionality splited for better customization
    this.getAllBillingCountries();
    this.getDeliveryAddressState();
    this.bindDeliveryAddressCheckbox();
    this.bindSameAsDeliveryAddressCheckbox();
    this.bindRegionsChanges();
    this.bindLoadingState();
    this.updateBillingAddressForm();
  }

  /**
   * Fetches all billing countries and assigns them to the `countries$` observable.
   * If the store is empty, it triggers the loading of billing countries.
   * This method is also used when changing the language.
   *
   * @return {void}
   * @since 5.2.0
   */
  getAllBillingCountries(): void {
    this.countries$ = this.userPaymentService.getAllBillingCountries().pipe(
      tap((countries: Country[]): void => {
        // If the store is empty fetch countries. This is also used when changing language.
        if (Object.keys(countries).length === 0) {
          this.userPaymentService.loadBillingCountries();
        }
      })
    );
  }

  /**
   * Fetches the delivery address state and assigns it to the `shippingAddress$` observable.
   * Maps the `QueryState<Address>` to the `Address` data.
   *
   * @return {void}
   * @since 5.2.0
   */
  getDeliveryAddressState(): void {
    this.deliveryAddress$ = this.checkoutDeliveryAddressFacade.getDeliveryAddressState().pipe(
      filter((state: QueryState<Address>): boolean => !state.loading),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      map((state: QueryState<Address>): any => {
        this.billingAddressFormService.setDeliveryAddressAsBillingAddress(
          state.data
        );
        this.deliveryAddress = state.data;
        return state.data;
      }),
      catchError((error: unknown): Observable<unknown> => {
        this.logger.error('Error fetching delivery address', { error });
        return of(error);
      })
    );
  }

  /**
   * Binds the visibility of the "same as delivery address" checkbox to the presence of a delivery address
   * and whether the delivery address country matches one of the billing countries.
   *
   * @return {void}
   * @since 2211.32.1
   */
  bindDeliveryAddressCheckbox(): void {
    this.showSameAsDeliveryAddressCheckbox$ = combineLatest([
      this.countries$,
      this.deliveryAddress$
    ]).pipe(
      map(([countries, address]: [Country[], Address]): boolean =>
        (address?.country && !!countries.filter((country: Country): boolean => country.isocode === address.country?.isocode).length) ?? false),
      tap((showCheckbox: boolean): void => {
        this.showSameAsDeliveryAddressCheckbox = showCheckbox;
      })
    );
  }

  /**
   * Binds the "same as delivery address" checkbox state to the comparison of the delivery address and billing address.
   * If the billing address is not set, the checkbox will be checked by default.
   * If the billing address is set, the checkbox will be checked if the billing address ID matches the delivery address ID.
   *
   * @return {void}
   * @since 2211.32.1
   */
  bindSameAsDeliveryAddressCheckbox(): void {
    combineLatest([
      this.deliveryAddress$,
      this.billingAddress$
    ]).pipe(
      map(([deliveryAddress, billingAddress]: [Address, Address]): boolean => {
        if (!billingAddress) {
          return true;
        }
        return this.billingAddressFormService.compareAddresses(billingAddress, deliveryAddress);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (isSameAsDeliveryAddress: boolean): void => {
        this.sameAsDeliveryAddress = isSameAsDeliveryAddress;
      }
    });
  }



  /**
   * Binds changes to the regions based on the selected country in the billing address form.
   * Sets up an observable that listens for changes to the 'country.isocode' form control.
   * When the country changes, it fetches the corresponding regions and enables or disables the 'region.isocode' form control based on the presence of regions.
   *
   * @return {void}
   * @since 5.2.0
   */
  bindRegionsChanges(): void {
    this.regions$ = this.selectedCountry$.pipe(
      switchMap((country: string): Observable<Region[]> => this.userAddressService.getRegions(country)),
      tap((regions: Region[]): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const regionControl: AbstractControl<any, any> = this.billingAddressForm.get(
          'region.isocodeShort'
        );
        if (regions.length > 0) {
          regionControl?.enable();
        } else {
          regionControl?.disable();
        }
      })
    );
  }

  /**
   * Toggles the "same as delivery address" state and updates the billing address form service
   * with the current state of the "same as delivery address" checkbox and the delivery address.
   *
   * @override
   * @return {void}
   * @since 2211.32.1
   */
  override toggleSameAsDeliveryAddress(): void {
    super.toggleSameAsDeliveryAddress();
    this.billingAddressFormService.setSameAsDeliveryAddress(this.sameAsDeliveryAddress, this.deliveryAddress);
  }

  /**
   * Returns the appropriate binding label for regions based on the available properties.
   * If the regions array is not empty, it checks the first region object for the presence of 'name' or 'isocodeShort' properties.
   * If 'name' is present, it returns 'name'. If 'isocodeShort' is present, it returns 'isocodeShort'.
   * If neither is present, or if the regions array is empty, it defaults to returning 'isocode'.
   *
   * @param {Region[]} regions - The array of region objects to check.
   * @return {string} - The binding label for the regions.
   * @since 4.2.7
   */
  getRegionBindingLabel(regions: Region[]): string {
    if (regions?.length) {
      if (regions[0].name) {
        return 'name';
      }
      if (regions[0].isocodeShort) {
        return 'isocodeShort';
      }
    }
    return 'isocode';
  }

  /**
   * Returns the appropriate binding value for regions based on the available properties.
   * If the regions array is not empty, it checks the first region object for the presence of 'isocode' or 'isocodeShort' properties.
   * If 'isocode' is present, it returns 'isocode'. If 'isocodeShort' is present, it returns 'isocodeShort'.
   * If neither is present, or if the regions array is empty, it defaults to returning 'isocode'.
   *
   * @param {Region[]} regions - The array of region objects to check.
   * @return {string} - The binding value for the regions.
   * @since 4.2.7
   */
  getRegionBindingValue(regions: Region[]): string {
    if (regions?.length) {
      if (regions[0].isocode) {
        return 'isocode';
      }
      if (regions[0].isocodeShort) {
        return 'isocodeShort';
      }
    }
    return 'isocode';
  }

  /**
   * Submits the billing address form if it is valid. If the form is valid, it updates the payment address
   * using the `checkoutComPaymentFacade` and disables the edit mode upon success. If an error occurs,
   * it displays the error message using the `showErrors` method. If the form is invalid, it marks all
   * form controls as touched to trigger validation messages.
   *
   * @return {void}
   * @since 2211.32.1
   */
  submitForm(): void {
    if (this.billingAddressForm.valid) {
      const billingAddress: Address = this.billingAddressForm.value;
      this.checkoutComPaymentFacade.updatePaymentAddress(billingAddress).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (): void => {
          this.disableEditMode();
        },
        error: (error: unknown): void => {
          const httpError: HttpErrorModel = error as HttpErrorModel;
          this.showErrors(httpError?.details?.[0]?.message, 'CheckoutComBillingAddressFormComponent::submitForm', error);
        }
      });
    } else {
      this.billingAddressForm.markAllAsTouched();
    }
  }

  /**
   * Enables the edit mode by setting the edit toggle state to true.
   *
   * @return {void}
   * @since 2211.32.1
   */
  enableEditMode(): void {
    this.billingAddressFormService.setEditToggleState(true);
  }

  /**
   * Disables the edit mode by setting the edit toggle state to false.
   *
   * @return {void}
   * @since 2211.32.1
   */
  disableEditMode(): void {
    this.billingAddressFormService.setEditToggleState(false);
  }

  /**
   * Returns the card content for a given address, including the formatted address details and actions.
   * Translates the phone number, mobile number, and edit text, and checks the state of the "same as delivery address" checkbox.
   *
   * @param {Address} address - The address object to generate the card content for.
   * @return {Observable<Card>} - An observable that emits the card content.
   * @since 2211.32.1
   */
  override getAddressCardContent(address: Address): Observable<Card> {
    return this.translationService
      ? combineLatest([
        this.translationService.translate('addressCard.phoneNumber'),
        this.translationService.translate('addressCard.mobileNumber'),
        this.translationService.translate('common.edit'),
        this.billingAddressFormService.getSameAsDeliveryAddress(),
      ]).pipe(
        map(([textPhone, textMobile, editText, sameAsDeliveryAddress]: [string, string, string, boolean]): Card => {
          let region: string = '';
          if (address.region && address.region.isocode !== '') {
            region = address.region.isocode + ', ';
          }
          const numbers: string = getAddressNumbers(address, textPhone, textMobile) || '';
          const editActions: { event: string; name: string }[] = this.showSameAsDeliveryAddressCheckbox ? [{
            event: 'edit',
            name: editText
          }] : [];
          const actions: { event: string; name: string }[] = sameAsDeliveryAddress && this.sameAsDeliveryAddress ? [] : editActions;

          return {
            textBold: address.firstName + ' ' + address.lastName,
            text: [
              address.line1,
              address.line2,
              address.town + ', ' + region + address.country?.isocode,
              address.postalCode,
              numbers,
            ],
            actions
          } as Card;
        })
      )
      : EMPTY;
  }

  /**
   * Binds the loading state of the payment details to the `processing$` observable.
   * This method listens for changes in the payment details state and updates the `processing$` observable
   * with the loading status.
   *
   * @return {void}
   * @since 2211.32.1
   */
  bindLoadingState(): void {
    this.processing$ = this.checkoutComPaymentFacade.getPaymentDetailsState().pipe(
      map((state: QueryState<CheckoutComPaymentDetails>): boolean => state?.loading ?? false),
      distinctUntilChanged()
    );
  }

  /**
   * Updates the billing address form with the fetched regions based on the selected country.
   * It listens for changes in the billing address observable, fetches the regions for the selected country,
   * and updates the billing address form with the fetched regions.
   *
   * @return {void}
   * @since 2211.32.1
   */
  updateBillingAddressForm(): void {
    this.billingAddress$.pipe(
      filter((billingAddress: Address): boolean => !!billingAddress),
      switchMap((billingAddress: Address): Observable<Address> =>
        this.userAddressService.getRegions(billingAddress?.country?.isocode).pipe(
          map((regions: Region[]): Address => {
            if (regions.length > 0) {
              billingAddress.region = {
                isocodeShort: billingAddress?.region?.isocode || billingAddress?.region?.isocodeShort
              };
            }
            return billingAddress;
          }
          ),
        )
      ),
      take(1),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (billingAddress: Address): void => {
        if (billingAddress) {
          this.countrySelected(billingAddress?.country);
          this.billingAddressForm.patchValue(billingAddress);
        }
      }
    });
  }

  /**
   * Combines the payment address and billing address observables and returns the appropriate address.
   * If the payment address is available, it returns the payment address; otherwise, it returns the billing address.
   *
   * @return {Observable<Address>} - An observable that emits the appropriate address.
   * @since 2211.32.1
   */
  showBillingAddress(): Observable<Address> {
    return this.billingAddress$;
    /*return combineLatest([
      this.paymentAddress$,
      this.billingAddress$
    ]).pipe(
      map(([paymentAddress, billingAddress]: [Address, Address]): Address => {
        return  paymentAddress ? paymentAddress : billingAddress;
      })
    );*/
  }

  /**
   * Updates the application's error state and displays an error message to the user.
   *
   * @param {string | Translatable} [text] - string | Translatable
   * @param {string} logMessage - Custom message to show in console
   * @param {string} errorMessage - Application error message
   * @returns {void}
   * @since 2211.32.1
   *
   */
  /**
   * Updates the application's error state and displays an error message to the user.
   *
   * @param {string | Translatable} text - The error message to display to the user.
   * @param {string} logMessage - The custom message to log in the console.
   * @param {unknown} errorMessage - The error object to log.
   * @return {void}
   * @since 2211.32.1
   */
  showErrors(text: string | Translatable, logMessage: string, errorMessage: unknown): void {
    this.globalMessageService.add(
      text,
      GlobalMessageType.MSG_TYPE_ERROR
    );
    this.logger.error(logMessage, { error: errorMessage });
  }

}
