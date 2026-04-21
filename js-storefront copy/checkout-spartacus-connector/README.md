# @checkout.com/checkout-spartacus-connector — Development Repository

> Internal development and testing repository for the Checkout.com Spartacus Connector.
> For consumer documentation, refer to the published package on [npm](https://www.npmjs.com/package/@checkout.com/checkout-spartacus-connector).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Architecture Overview](#architecture-overview)
- [Testing](#testing)
- [Building & Publishing](#building--publishing)
- [Local Testing with .tgz](#local-testing-with-tgz)
- [OCC Type Generation](#occ-type-generation)
- [Styles Configuration](#styles-configuration)
- [Compatibility Matrix](#compatibility-matrix)
- [Supported APMs](#supported-apms)
- [Release Notes](#release-notes)

---

## Tech Stack

| Tool               | Version      |
|--------------------|--------------|
| Angular CLI        | `^19.2.22`   |
| Angular            | `^19.2.20`   |
| Node.js            | `>=22.22.0`  |
| yarn               | `>=1.15`     |
| npm                | `>=10.2.4`   |
| Spartacus          | `2211.43.0`  |
| SAP Commerce Cloud | `2211`       |

---

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** `>=22.22.0` — [Download](https://nodejs.org/en)
  > Recommended: use [nvm](https://github.com/nvm-sh/nvm) and run `nvm use` in the project root (`.nvmrc` is set to `22.22.0`)
- **yarn** `>=1.15` — [Download](https://yarnpkg.com/)
- **Angular CLI** `^19.2.22`

```bash
npm install -g @angular/cli@^19.2.22
```

- Access to a running **SAP Commerce Cloud 2211** backend with OCC APIs enabled
- Spartacus Feature Modules `checkout` and `order` configured in the backend

---

## Project Structure

```
checkout-spartacus-connector/
├── src/
│   ├── core/                            # Business logic
│   │   ├── adapters/                    # OCC adapters (HTTP layer)
│   │   ├── configs/                     # Provider configs (adapters, facades, guards)
│   │   ├── connectors/                  # Connector interfaces
│   │   ├── facades/                     # Public-facing service facades
│   │   │   ├── checkout-com-facade-providers.ts
│   │   │   └── feature-name.ts          # CHECKOUT_COM_FEATURE token
│   │   ├── guards/                      # Route guards
│   │   │   └── checkout-com-guards-providers.ts
│   │   ├── models/                      # TypeScript interfaces and types
│   │   └── public-api.ts
│   │
│   ├── storefrontlib/
│   │   └── cms-components/              # Lazy-loaded CMS components
│   │       ├── checkout-com-components.module.ts   # Lazy entry point
│   │       └── public-api.ts
│   │
│   ├── core/occ/                        # OCC-specific adapters and endpoints
│   │   └── public-api.ts
│   │
│   ├── generated/                       # Auto-generated OCC types (do not edit)
│   │   └── occ/
│   │
│   ├── styles/                          # SCSS styles (exported for consumer apps)
│   │   └── checkout-com/
│   │
│   ├── checkout-com.module.ts           # Root module — single import for consumers
│   └── public-api.ts                    # Public API surface exported to npm
│
├── ng-package.json                      # ng-packagr config
├── package.json
└── tsconfig.lib.json
```

### Key entry points

| File                                                                 | Purpose                                                    |
|----------------------------------------------------------------------|------------------------------------------------------------|
| `src/public-api.ts`                                                  | Everything exported on npm — only touch this intentionally |
| `src/checkout-com.module.ts`                                         | Root module imported by consumer apps                      |
| `src/storefrontlib/cms-components/checkout-com-components.module.ts` | Lazy-loaded components entry point                         |
| `src/generated/`                                                     | Auto-generated — do not edit manually                      |

---

## Getting Started

### 1. Install dependencies

```bash
yarn install
```

### 2. Start the example storefront (development)

```bash
# Build the library in watch mode
ng build checkout-spartacus-connector --watch

# In the dist folder, create a local link
cd dist/checkout-spartacus-connector
yarn link

# In your consumer Spartacus project
yarn link @checkout.com/checkout-spartacus-connector
```

### 3. Start with local SSL (for Apple Pay / Google Pay testing)

```bash
yarn start:localtest
# Runs on https://localtest.me with self-signed SSL certs from ssl/
```

### 4. Add the Frames SDK to the consumer app

In `index.html` of the consumer project:

```html
<body>
  <app-root></app-root>
  <script src="https://cdn.checkout.com/js/framesv2.min.js"></script>
</body>
```

---

## Development Workflow

### Available scripts

| Script                           | Description                                              |
|----------------------------------|----------------------------------------------------------|
| `yarn start`                     | Build libs + serve example storefront (dev)              |
| `yarn start:localtest`           | Serve with SSL on `localtest.me` (for APM testing)       |
| `yarn build`                     | Build translations + connector library                   |
| `yarn build-prod`                | Production build of translations + connector             |
| `yarn build-libs`                | Build connector library only                             |
| `yarn watch-libs`                | Build connector in watch mode                            |
| `yarn build-translations`        | Build translations library only                          |
| `yarn test`                      | Run unit tests (interactive)                             |
| `yarn test:headless`             | Run unit tests in ChromeHeadless                         |
| `yarn test:coverage`             | Run unit tests with code coverage report                 |
| `yarn ci-test`                   | Run unit tests for CI (no watch, with coverage)          |
| `yarn lint`                      | Lint all projects                                        |
| `yarn lint:fix`                  | Auto-fix lint issues                                     |
| `yarn build:prepare-test-packages` | Build + pack both libraries for local `.tgz` testing   |
| `yarn swagger`                   | Regenerate OCC TypeScript types from the backend API     |

### Module structure

The library exposes two integration paths for consumers. Both are defined inside the library itself — never in the consumer app:

**Option 1 — Single import (recommended for most consumers)**

```typescript
import { CheckoutComModule } from '@checkout.com/checkout-spartacus-connector';

@NgModule({ imports: [CheckoutComModule] })
export class SpartacusConfigurationModule {}
```

`CheckoutComModule` automatically registers all facade providers, OCC adapters, route guards, modal config and lazy-loads `CheckoutComComponentsModule` when CMS components are requested.

**Option 2 — Manual configuration (for advanced overrides)**

```typescript
import { NgModule } from '@angular/core';
import { CmsConfig, provideConfig } from '@spartacus/core';
import {
  CHECKOUT_COM_FEATURE,
  checkoutComAdapterProviders,
  checkoutComFacadeProviders,
  checkoutComGuardsProviders,
  CheckoutComModalConfig,
} from '@checkout.com/checkout-spartacus-connector';

@NgModule({
  providers: [
    ...checkoutComFacadeProviders,
    ...checkoutComAdapterProviders,
    ...checkoutComGuardsProviders,
    provideConfig(CheckoutComModalConfig),
    provideConfig({
      featureModules: {
        [CHECKOUT_COM_FEATURE]: {
          module: () =>
            import('@checkout.com/checkout-spartacus-connector')
              .then(m => m.CheckoutComComponentsModule),
          cmsComponents: [
            'CheckoutPaymentDetails',
            'CheckoutOrderSummary',
            'CheckoutPlaceOrder',
            'CheckoutReviewPayment',
            'CheckoutReviewShipping',
            'OrderConfirmationThankMessageComponent',
            'OrderDetailItemsComponent',
            'OrderConfirmationItemsComponent',
            'OrderConfirmationTotalsComponent',
            'OrderConfirmationOverviewComponent',
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
  ],
})
export class SpartacusConfigurationModule {}
```

### Adding a new CMS component

1. Create the component under `src/storefrontlib/cms-components/`
2. Declare and export it in `CheckoutComComponentsModule`
3. Add the CMS component key to the `cmsComponents` list in `checkout-com.module.ts`
4. Export the component class from `src/storefrontlib/cms-components/public-api.ts`

### Adding a new facade or service

1. Create the service under `src/core/facades/` or `src/core/`
2. Add it to `checkoutComFacadeProviders` (or create a dedicated providers array)
3. Export the class from `src/core/public-api.ts`

### Modifying OCC adapters

1. Edit or create adapters under `src/core/adapters/` and `src/core/occ/`
2. Update the corresponding `checkoutComAdapterProviders`
3. If the OCC response shape changes, regenerate types in `src/generated/occ/` (see [OCC Type Generation](#occ-type-generation))

### Public API discipline

> ⚠️ `src/public-api.ts` defines the contract with npm consumers. Any removal or rename is a **breaking change** and requires a major version bump.

- Add new exports freely
- Never remove or rename existing exports without a deprecation cycle
- Keep internal implementation files out of `public-api.ts`

---

## Architecture Overview

```
Consumer AppModule
  └── CheckoutComModule                   (root, eager)
        ├── checkoutComFacadeProviders     (services registered in root injector)
        ├── checkoutComAdapterProviders    (OCC HTTP adapters)
        ├── checkoutComGuardsProviders     (route guards)
        ├── CheckoutComModalConfig         (modal configuration)
        └── featureModules config
              └── CheckoutComComponentsModule   (lazy, loaded on demand by Spartacus CMS)
                    └── CMS components (payment form, APM components, order confirmation...)
```

**Why lazy loading matters here:**
Spartacus uses `featureModules` to load CMS component bundles only when the CMS requests them. `CheckoutComComponentsModule` is never eagerly imported — it is always resolved via the dynamic `import()` in the `featureModules` config. This keeps the initial bundle size small.

---

## Testing

### Run unit tests (interactive)

```bash
yarn test
```

### Run unit tests in headless Chrome

```bash
yarn test:headless
```

### Run unit tests with code coverage

```bash
yarn test:coverage
```

Coverage output is written to `coverage/checkout-spartacus-connector/`.

### CI test run

```bash
yarn ci-test
# Equivalent to: ng test checkout-spartacus-connector --code-coverage --watch false
```

### Integration / E2E

Point the example storefront at the built library and run through the checkout flow manually:

```bash
yarn build
yarn start
```

Verify the following after any change:

- [ ] Payment components render in the checkout flow
- [ ] OCC endpoints resolve correctly (DevTools → Network)
- [ ] No `UnknownResourceError` in the console
- [ ] Lazy-loaded bundle loads on demand (not in the initial bundle)
- [ ] All supported APMs render and submit correctly

### Troubleshooting during local development

| Issue                     | Solution                                                                                              |
|---------------------------|-------------------------------------------------------------------------------------------------------|
| `Module not found`        | Check `file:` path in consumer's `package.json`, rebuild the library                                  |
| Stale build artifacts     | Delete `dist/` and `node_modules/.cache`, rebuild                                                     |
| OCC endpoint errors       | Verify `CheckoutComModule` is imported in `SpartacusConfigurationModule`                              |
| Components not rendering  | Check the CMS component key is mapped correctly in the backoffice                                     |
| Lazy bundle loads eagerly | Ensure no direct `import` of `CheckoutComComponentsModule` exists outside the `featureModules` config |
| Coverage reporter error   | Ensure `karma-coverage` is installed (`yarn add --dev karma-coverage`)                                |

---

## Building & Publishing

### Build (development)

```bash
yarn build
# or individually:
yarn build-libs           # connector only
yarn build-translations   # translations only
```

### Build (production)

```bash
yarn build-prod
```

Output goes to `dist/checkout-spartacus-connector/` and `dist/checkout-spartacus-translations/`.

### Version bump

Run from the `dist/` folder before publishing:

```bash
cd dist/checkout-spartacus-connector
npm version patch   # 2211.43.0 → 2211.43.1
npm version minor   # 2211.43.0 → 2211.44.0
npm version major   # 2211.43.0 → 2212.0.0
```

### Publish to npm

```bash
cd dist/checkout-spartacus-connector
npm publish --access public
```

> **Important:** Always publish from `dist/`, never from the root of the repo.

---

## Local Testing with .tgz

Use this workflow to test the packaged library end-to-end (as a consumer would install it) without publishing to npm.

### 1. Build and pack both libraries

```bash
yarn build:prepare-test-packages
```

This single command:
1. Clears any previously cached `.tgz` packages from `node_modules`
2. Runs a production build of both libraries
3. Packs each library into a `.tgz` file at the project root (e.g. `checkoutcom-spartacus-connector-2211.43.0.tgz`)
4. Installs the packed `.tgz` files into `node_modules` via `yarn add`

### 2. Start the example storefront

```bash
yarn start:localtest
```

The example storefront (`projects/example-storefront`) is already configured to import from `@checkout.com/checkout-spartacus-connector` in `node_modules`.

### 3. Clean and rebuild

To reset the local test packages:

```bash
# Remove only the connector package
yarn clear:connector-test-package

# Remove only the translations package
yarn clear:translations-test-package

# Full rebuild + repack
yarn build:prepare-test-packages
```

> **Tip:** If you see `Integrity check failed` errors, clear the yarn cache manually:
> ```bash
> yarn cache clean
> rm -rf node_modules/@checkout.com
> yarn install
> ```

---

## OCC Type Generation

If the backend OCC API schema changes, regenerate the TypeScript types:

```bash
# Ensure the backend is running and accessible
yarn swagger
```

This runs:
```
npx openapi-typescript@5.3.0 https://localhost:9002/occ/v2/api-docs \
  --output projects/checkout-spartacus-connector/src/generated/occ.ts
```

> ⚠️ The `generated/` folder is auto-generated — do not edit files there manually.

---

## Styles Configuration

The library ships SCSS styles that must be added to the consumer app's `angular.json`:

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

---

## Required Dependencies

**`@checkout.com/checkout-web-components`** is **required** for this version and must be installed to use the Checkout.com Spartacus Connector:

```bash
yarn add @checkout.com/checkout-web-components
```

This package provides the web components and utilities necessary for payment processing with Checkout.com.

---

## Compatibility Matrix

| Connector version | Translations version | Spartacus   | SAP Commerce | Angular     | Node.js      | Checkout Web Components |
|-------------------|----------------------|-------------|--------------|-------------|--------------|-------------------------|
| `2211.43.0`       | `2211.43.0`          | `2211.43.0` | `2211`       | `^19.2.22`  | `>=22.22.0`  | Latest                  |
| `4.2.x`           | `4.2.x`              | `4.2.x`     | `2205/2211`  | `^14.x`     | `>=14`       | Latest                  |

---

## Supported APMs

| Supported APM's |
|------------------|
| ACH Direct Debit |
| ApplePay         |
| Bancontact       |
| Credit Card      |
| Eps              |
| GooglePay        |
| iDeal            |
| Klarna           |
| Multibanco       |
| Przelewy24       |
| Fawry            |

---

## Release Notes

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