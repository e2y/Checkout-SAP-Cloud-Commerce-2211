# Checkout.com Spartacus Connector for SAP Commerce Cloud

Checkout.com provides an end-to-end platform that helps you move faster, instead of holding you back. With flexible tools, granular data and deep insights, it’s the payments tech
that unleashes your potential. So you can innovate, adapt to your markets, create outstanding customer experiences, and make smart decisions faster. The Connector for SAP Commerce
Cloud (formerly Hybris) enables customers to implement a global payment strategy through a single integration in a secure, compliant and unified approach.

This library adds Checkout.com payment capabilities to the [Spartacus Storefront](https://sap.github.io/spartacus-docs/) for SAP Commerce Cloud.

---

## Table of Contents

- [Compatibility](#compatibility)
- [Installation](#installation)
- [Configuration](#configuration)
- [Styles](#styles)
- [Peer Dependencies](#peer-dependencies)
- [Supported APMs](#supported-apms)
- [Troubleshooting](#troubleshooting)
- [Extending Components](#extending-components)
- [Changelog](#changelog)

---

## Compatibility

| Package                                         | Version      |
|-------------------------------------------------|--------------|
| `@checkout.com/checkout-spartacus-connector`    | `2211.43.0`  |
| `@checkout.com/checkout-spartacus-translations` | `2211.43.0`  |
| `@spartacus/core`                               | `~2211.43.0` |
| `@spartacus/checkout`                           | `~2211.43.0` |
| `@angular/core`                                 | `^19.2.20`   |
| SAP Commerce Cloud                              | `2211`       |
| Node.js                                         | `>=22.22.0`  |

---

## Installation

### 1. Install packages

```bash
   yarn add @checkout.com/checkout-spartacus-connector
   yarn add @checkout.com/checkout-spartacus-translations
   ```
**Or specifically for version 2211.43.0:**

```bash
yarn add @checkout.com/checkout-spartacus-connector@2211.43.0
yarn add @checkout.com/checkout-spartacus-translations@2211.43.0
```

### 2. Add external scripts

Add the following scripts and preload hints to your `index.html`. These are required for Checkout Frames, Checkout Web Components and Google Pay to work correctly.

```html
<head>
  <!-- ... -->

  <!-- Performance hints -->
  <link rel="preconnect" href="https://checkout-web-components.checkout.com">
  <link rel="dns-prefetch" href="https://checkout-web-components.checkout.com">
  <link rel="dns-prefetch" href="https://pay.google.com">
  <link rel="preconnect" href="https://pay.google.com">
  <link rel="preload" href="https://pay.google.com/gp/p/js/pay.js" as="script">
  <link rel="preload" href="https://pay.google.com/gp/p/ui/pay.js" as="script">

  <!-- Checkout Web Components (required for Flow-based checkout) -->
  <script src="https://checkout-web-components.checkout.com/index.js"></script>

  <!-- Google Pay -->
  <script src="https://pay.google.com/gp/p/ui/pay.js" async></script>
  <script src="https://pay.google.com/gp/p/js/pay.js" async></script>
</head>
<body>
  <app-root></app-root>

  <!-- Checkout Frames SDK (required for credit/debit card tokenisation) -->
  <script src="https://cdn.checkout.com/js/framesv2.min.js"></script>
</body>
```

> **Note:** The Checkout Web Components script is required when using the Flow-based checkout. The Google Pay scripts are required when using Google Pay as an APM. The Frames SDK is always required for card tokenisation.

### 3. Add styles

In your `angular.json`, add the library stylesheet to the `styles` array:

```json
{
  "architect": {
    "build": {
      "options": {
        "styles": [
          "src/styles.scss",
          "node_modules/@checkout.com/checkout-spartacus-connector/styles/styles.scss"
        ],
        "stylePreprocessorOptions": {
          "includePaths": [
            "node_modules/"
          ]
        }
      }
    }
  }
}
```

### 4. Configure the module

See [Configuration](#configuration) below.

---

## Configuration

### Option 1 — Single import (recommended)

Import `CheckoutComModule` in your `SpartacusConfigurationModule`. This automatically registers all providers, OCC adapters, route guards and lazy-loads the CMS components.

```typescript
import { NgModule } from '@angular/core';
import { I18nConfig, provideConfig } from '@spartacus/core';
import { CheckoutComModule } from '@checkout.com/checkout-spartacus-connector';
import {
  checkoutComTranslations,
  checkoutComTranslationChunkConfig,
} from '@checkout.com/checkout-spartacus-translations';

@NgModule({
  imports: [
    CheckoutComModule,
  ],
  providers: [
    provideConfig({
      i18n: {
        resources: checkoutComTranslations,
        chunks: checkoutComTranslationChunkConfig,
        fallbackLang: 'en',
      },
    } as I18nConfig),
  ],
})
export class SpartacusConfigurationModule {}
```

### Option 2 — Detailed import (advanced)

Use this option if you need full control over which providers and feature modules are registered.

```typescript
import { NgModule } from '@angular/core';
import { CmsConfig, I18nConfig, provideConfig } from '@spartacus/core';
import {
  CHECKOUT_COM_FEATURE,
  checkoutComAdapterProviders,
  checkoutComFacadeProviders,
  checkoutComGuardsProviders,
  CheckoutComModalConfig,
} from '@checkout.com/checkout-spartacus-connector';
import {
  checkoutComTranslations,
  checkoutComTranslationChunkConfig,
} from '@checkout.com/checkout-spartacus-translations';

@NgModule({
  imports: [
    CheckoutComOccModule,
    CheckoutComCoreModule
  ],
  providers: [
    provideConfig({
      featureModules: {
        [CHECKOUT_COM_FEATURE]: {
          module: () =>
            import('@checkout.com/checkout-spartacus-connector')
              .then(m => m.CheckoutComComponentsModule),
          cmsComponents: [
            'CheckoutProgress',
            'CheckoutProgressMobileBottom',
            'CheckoutProgressMobileTop',
            'CheckoutPaymentDetails',
            'CheckoutOrderSummary',
            'CheckoutPlaceOrder',
            'CheckoutReviewPayment',
            'CheckoutReviewShipping',
            'OrderConfirmationThankMessageComponent',
            'ReplenishmentConfirmationMessageComponent',
            'OrderDetailItemsComponent',
            'OrderConfirmationItemsComponent',
            'ReplenishmentConfirmationItemsComponent',
            'OrderConfirmationTotalsComponent',
            'ReplenishmentConfirmationTotalsComponent',
            'OrderConfirmationOverviewComponent',
            'ReplenishmentConfirmationOverviewComponent',
            'OrderConfirmationShippingComponent',
            'OrderConfirmationBillingComponent',
            'OrderConfirmationContinueButtonComponent',
            'AccountPaymentDetailsComponent',
            'AccountOrderDetailsItemsComponent',
            'AccountOrderDetailsOverviewComponent',
            'AccountOrderDetailsSimpleOverviewComponent',
            'AccountOrderDetailsGroupedItemsComponent',
            'AccountOrderDetailsTotalsComponent',
          ],
        },
      },
    } as CmsConfig),
    provideConfig({
      i18n: {
        resources: checkoutComTranslations,
        chunks: checkoutComTranslationChunkConfig,
        fallbackLang: 'en',
      },
    } as I18nConfig),
  ],
})
export class SpartacusConfigurationModule {}
```

> **Note:** `featureModules` enables lazy loading of CMS components — they are only loaded when Spartacus requests them via the CMS, keeping the initial bundle small. Translations are always loaded eagerly.

---

## Peer Dependencies

Ensure your project has the following packages installed at compatible versions:

| Package                                         | Version      |
|-------------------------------------------------|--------------|
| `@spartacus/core`                               | `~2211.43.0` |
| `@spartacus/storefront`                         | `~2211.43.0` |
| `@spartacus/checkout`                           | `~2211.43.0` |
| `@spartacus/order`                              | `~2211.43.0` |
| `@angular/core`                                 | `^19.2.20`   |
| `@checkout.com/checkout-web-components`         | `^1.8.0`     |
| `@checkout.com/checkout-spartacus-translations` | `2211.43.0`  |

---

## Supported APMs

| Payment Method   |
|------------------|
| ACH Direct Debit |
| Apple Pay        |
| Bancontact       |
| Credit Card      |
| EPS              |
| Google Pay       |
| iDEAL            |
| Klarna           |
| Multibanco       |
| Przelewy24       |
| Fawry            |

---

## Troubleshooting

| Issue                    | Solution                                                                                       |
|--------------------------|------------------------------------------------------------------------------------------------|
| `Integrity check failed` | Clear yarn/npm cache, remove `node_modules/@checkout.com`, reinstall                           |
| `Module not found`       | Verify the package is installed and the version matches the compatibility table                |
| Styles not applied       | Check that `styles/styles.scss` is listed in `angular.json` under `styles`                     |
| OCC endpoint errors      | Verify SAP Commerce OCC endpoints are enabled and `CheckoutComModule` is imported              |
| `NullInjectorError`      | Ensure `CheckoutComModule` (or `checkoutComAdapterProviders`) is registered in the root module |
| Components not rendering | Check that the CMS component type is mapped correctly in the SAP Commerce backoffice           |
| Feature not configured   | Do not import `CheckoutComComponentsModule` directly — use `featureModules` config only        |

---

## Extending Components

The source code is available on GitHub for each SAP Commerce Cloud version:

- [SAP CX 2211](https://github.com/checkout/Checkout-SAP-Cloud-Commerce-2211)
- [SAP CX 2205](https://github.com/checkout/Checkout-SAP-Cloud-Commerce-2205)
- [SAP CX 2105](https://github.com/checkout/Checkout-SAP-Cloud-Commerce-2105)
- [SAP CX 2011](https://github.com/checkout/Checkout-SAP-Cloud-Commerce-2011)

---

## Changelog

### 2211.43.0

- Updated to Spartacus `2211.43.0` and Angular `^19.2.22`
- Updated `@checkout.com/checkout-spartacus-translations` to `2211.43.0`
- Introduced `CheckoutComModule` as the single-import root module for consumers
- Lazy-loaded `CheckoutComComponentsModule` via Spartacus `featureModules`
- Added `CheckoutComFlowComponent` and flow-based checkout support
- Centralised OCC adapter providers in `CheckoutComAdapterModule`
- Full public API review — all components, facades and services exported from `public-api.ts`
- Added `ngx-plaid-link@^14.0.0`
- Removed `ng2-tooltip-directive`
- Supported APMs: ACH Direct Debit, Apple Pay, Bancontact, Credit Card, EPS, Google Pay, iDEAL, Klarna, Multibanco, Przelewy24, Fawry


### 4.2.8

- Updated Klarna APM configuration

### 4.2.7

- Removed BIC field from iDEAL APM form

### 4.2.6 / 4.2.5

- Added support for SAP CX 2211
- Fixed dependency issues: `ng2-tooltip-directive`, `ngx-plaid-link`, `@techiediaries/ngx-qrcode`

### 4.2.4

- Added support for SAP CX 2205
- Added `GuestRegisterFormComponent` and `AccountPaymentDetailsComponent` to CMS component list
- Added support for Cartes Bancaires and Multiple Card Brands
- Updated `@checkout.com/checkout-spartacus-translations` to `4.2.4`

### 4.2.3

- Included compiled binaries (missing in previous 4.2.x releases)

### 4.2.0

- Upgraded to Spartacus 4.2
- Show full name (first + last) as card account holder
- Fixed Apple Pay transaction status handling

### 1.0.2

- Source code made publicly available

### 1.0.0

- Added SSR support

### 0.0.0

- Initial release with lazy-loaded feature module
- Translations extracted to separate package
- OCC endpoints made configurable
- Credit card form placeholder localisation
- Display card payment icon
- Supported APMs: AliPay, Apple Pay, Bancontact, Benefit Pay, EPS, Fawry, Google Pay, iDEAL, Klarna, KNet, Mada, Multibanco, Oxxo, PayPal, Poli, Przelewy24, QPay, Sepa

---