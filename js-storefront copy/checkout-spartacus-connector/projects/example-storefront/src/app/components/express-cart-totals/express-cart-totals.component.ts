import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartProceedToCheckoutComponent } from '@spartacus/cart/base/components';
import { WindowRef } from '@spartacus/core';
import { Subject } from 'rxjs';
import { CheckoutComApplepayFacade } from '../../../../../checkout-spartacus-connector/src/core/facades/checkout-com-applepay.facade';
import { CheckoutComGooglepayFacade } from '../../../../../checkout-spartacus-connector/src/core/facades/checkout-com-googlepay.facade';
import { createApplePaySession } from '../../../../../checkout-spartacus-connector/src/core/services/applepay/applepay-session';

@Component({
  selector: 'lib-checkout-com-express-cart-totals',
  templateUrl: './express-cart-totals.component.html',
  standalone: false
})
export class ExpressCartTotalsComponent extends CartProceedToCheckoutComponent implements OnInit, OnDestroy {
  applePay: boolean = false;
  private drop: Subject<void> = new Subject<void>();

  constructor(
    protected override router: Router,
    protected checkoutComApplepayFacade: CheckoutComApplepayFacade,
    protected checkoutComGooglePayFacade: CheckoutComGooglepayFacade,
    protected windowRef?: WindowRef
  ) {
    super(router);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.showApplePay();
    this.checkoutComGooglePayFacade.requestMerchantConfiguration();
    this.checkoutComApplepayFacade.requestApplePayPaymentRequest();
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.drop.next();
  }

  showApplePay(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ApplePaySession: any = createApplePaySession(this.windowRef);
    this.applePay = !!(ApplePaySession && ApplePaySession.canMakePayments());
  }
}
