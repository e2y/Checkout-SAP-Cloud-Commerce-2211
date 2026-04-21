import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  CartNotEmptyGuard,
  CheckoutAuthGuard,
} from '@spartacus/checkout/base/components';
import { CmsConfig, Config } from '@spartacus/core';
import { CheckoutComStepsSetGuard } from '../../../core/guards';
import { CheckoutComCheckoutProgressMobileBottomModule } from './checkout-com-checkout-progress-mobile-bottom/checkout-com-checkout-progress-mobile-bottom.module';
import { CheckoutComCheckoutProgressMobileBottomComponent } from './checkout-com-checkout-progress-mobile-bottom/checkout-com-checkout-progress-mobile-bottom.component';
import { CheckoutComCheckoutProgressMobileTopModule } from './checkout-com-checkout-progress-mobile-top/checkout-com-checkout-progress-mobile-top.module';
import { CheckoutComCheckoutProgressMobileTopComponent } from './checkout-com-checkout-progress-mobile-top/checkout-com-checkout-progress-mobile-top.component';
import { CheckoutComCheckoutProgressComponent } from './checkout-com-checkout-progress.component';
import { CheckoutComCheckoutProgressModule } from './checkout-com-checkout-progress.module';

describe('Checkout progress CMS registration', () => {
  const expectedGuards = [
    CheckoutAuthGuard,
    CartNotEmptyGuard,
    CheckoutComStepsSetGuard,
  ];

  function expectCmsRegistration(
    moduleType: Type<unknown>,
    cmsComponentKey: string,
    expectedComponent: Type<unknown>
  ): void {
    TestBed.configureTestingModule({
      imports: [moduleType],
    });

    const config = TestBed.inject(Config) as CmsConfig;
    const cmsConfig = config.cmsComponents?.[cmsComponentKey];

    expect(cmsConfig).toBeDefined();
    expect(cmsConfig?.component).toBe(expectedComponent);
    expect(cmsConfig?.guards).toEqual(expectedGuards);

    TestBed.resetTestingModule();
  }

  it('registers CheckoutProgress with component and guards', () => {
    expectCmsRegistration(
      CheckoutComCheckoutProgressModule,
      'CheckoutProgress',
      CheckoutComCheckoutProgressComponent
    );
  });

  it('registers CheckoutProgressMobileTop with component and guards', () => {
    expectCmsRegistration(
      CheckoutComCheckoutProgressMobileTopModule,
      'CheckoutProgressMobileTop',
      CheckoutComCheckoutProgressMobileTopComponent
    );
  });

  it('registers CheckoutProgressMobileBottom with component and guards', () => {
    expectCmsRegistration(
      CheckoutComCheckoutProgressMobileBottomModule,
      'CheckoutProgressMobileBottom',
      CheckoutComCheckoutProgressMobileBottomComponent
    );
  });
});

