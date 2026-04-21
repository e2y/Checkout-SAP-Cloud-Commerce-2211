import { NgModule } from '@angular/core';
import { AnonymousConsentsModule, AuthModule, CostCenterOccModule, ExternalRoutesModule, ProductModule, ProductOccModule, provideFeatureToggles, UserModule, UserOccModule } from '@spartacus/core';
import { AnonymousConsentManagementBannerModule, AnonymousConsentsDialogModule, BannerCarouselModule, BannerModule, BreadcrumbModule, CategoryNavigationModule, CmsParagraphModule, ConsentManagementModule, FooterNavigationModule, HamburgerMenuModule, HomePageEventModule, LinkModule, LoginRouteModule, LogoutModule, MyAccountV2Module, MyCouponsModule, MyInterestsModule, NavigationEventModule, NavigationModule, NotificationPreferenceModule, PageTitleModule, PaymentMethodsModule, PDFModule, ProductCarouselModule, ProductDetailsPageModule, ProductFacetNavigationModule, ProductImagesModule, ProductIntroModule, ProductListingPageModule, ProductListModule, ProductPageEventModule, ProductReferencesModule, ProductSummaryModule, ProductTabsModule, ScrollToTopModule, SearchBoxModule, SiteContextSelectorModule, SiteThemeSwitcherModule, StockNotificationModule, TabParagraphContainerModule, VideoModule } from '@spartacus/storefront';
import { UserFeatureModule } from './features/user/user-feature.module';
import { CartBaseFeatureModule } from './features/cart/cart-base-feature.module';
import { CartSavedCartFeatureModule } from './features/cart/cart-saved-cart-feature.module';
import { WishListFeatureModule } from './features/cart/wish-list-feature.module';
import { CartQuickOrderFeatureModule } from './features/cart/cart-quick-order-feature.module';
import { CartImportExportFeatureModule } from './features/cart/cart-import-export-feature.module';
import { OrderFeatureModule } from './features/order/order-feature.module';
import { CheckoutFeatureModule } from './features/checkout/checkout-feature.module';
import { PersonalizationFeatureModule } from './features/tracking/personalization-feature.module';
import { StoreFinderFeatureModule } from './features/storefinder/store-finder-feature.module';
import { AsmFeatureModule } from './features/asm/asm-feature.module';
import { AsmCustomer360FeatureModule } from './features/asm/asm-customer360-feature.module';
import { SmartEditFeatureModule } from './features/smartedit/smart-edit-feature.module';
import { ProductVariantsFeatureModule } from './features/product/product-variants-feature.module';
import { ProductImageZoomFeatureModule } from './features/product/product-image-zoom-feature.module';

@NgModule({
  declarations: [],
  imports: [
    AuthModule.forRoot(),
    LogoutModule,
    LoginRouteModule,
    HamburgerMenuModule,
    SiteContextSelectorModule,
    LinkModule,
    BannerModule,
    CmsParagraphModule,
    TabParagraphContainerModule,
    BannerCarouselModule,
    CategoryNavigationModule,
    NavigationModule,
    FooterNavigationModule,
    BreadcrumbModule,
    ScrollToTopModule,
    PageTitleModule,
    VideoModule,
    PDFModule,
    SiteThemeSwitcherModule,
    UserModule,
    UserOccModule,
    PaymentMethodsModule,
    NotificationPreferenceModule,
    MyInterestsModule,
    MyAccountV2Module,
    StockNotificationModule,
    ConsentManagementModule,
    MyCouponsModule,
    AnonymousConsentsModule.forRoot(),
    AnonymousConsentsDialogModule,
    AnonymousConsentManagementBannerModule,
    ProductModule.forRoot(),
    ProductOccModule,
    ProductDetailsPageModule,
    ProductListingPageModule,
    ProductListModule,
    SearchBoxModule,
    ProductFacetNavigationModule,
    ProductTabsModule,
    ProductCarouselModule,
    ProductReferencesModule,
    ProductImagesModule,
    ProductSummaryModule,
    ProductIntroModule,
    CostCenterOccModule,
    NavigationEventModule,
    HomePageEventModule,
    ProductPageEventModule,
    ExternalRoutesModule.forRoot(),
    UserFeatureModule,
    CartBaseFeatureModule,
    CartSavedCartFeatureModule,
    WishListFeatureModule,
    CartQuickOrderFeatureModule,
    CartImportExportFeatureModule,
    OrderFeatureModule,
    CheckoutFeatureModule,
    PersonalizationFeatureModule,
    StoreFinderFeatureModule,
    AsmFeatureModule,
    AsmCustomer360FeatureModule,
    SmartEditFeatureModule,
    ProductVariantsFeatureModule,
    ProductImageZoomFeatureModule
  ],
  providers: [provideFeatureToggles({
    'showDeliveryOptionsTranslation': true,
    'searchBoxV2': true,
    'propagateErrorsToServer': true,
    'ssrStrictErrorHandlingForHttpAndNgrx': true,
    'productConfiguratorDeltaRendering': true,
    'a11yNavMenuExpandStateReadout': true,
    'a11yPreventHorizontalScroll': true,
    'a11yCartImportConfirmationMessage': true,
    'a11yMobileFocusOnFirstNavigationItem': true,
    'a11ySearchboxLabel': true,
    'a11yUseTrapTabInsteadOfTrapInDialogs': true,
    'a11yKeyboardAccessibleZoom': true,
    'a11yPreventCartItemsFormRedundantRecreation': true,
    'a11yTabComponent': true,
    'a11yCarouselArrowKeysNavigation': true,
    'headerLayoutForSmallerViewports': true,
    'a11yLinkBtnsToTertiaryBtns': true,
    'a11yRepeatedPageTitleFix': true,
    'a11yNgSelectOptionsCount': true,
    'a11yRepeatedCancelOrderError': true,
    'a11yAddedToCartActiveDialog': true,
    'a11yDeliveryMethodFieldset': true,
    'a11yShowMoreReviewsBtnFocus': true,
    'a11yQuickOrderAriaControls': true,
    'a11yRemoveStatusLoadedRole': true,
    'a11yDialogsHeading': true,
    'a11yDialogTriggerRefocus': true,
    'a11yAddToWishlistFocus': true,
    'a11ySearchBoxFocusOnEscape': true,
    'a11yUpdatingCartNoNarration': true,
    'a11yPasswordVisibliltyBtnValueOverflow': true,
    'a11yItemCounterFocus': true,
    'a11yScrollToReviewByShowReview': true,
    'a11yViewHoursButtonIconContrast': true,
    'a11yCheckoutStepsLandmarks': true,
    'a11yQTY2Quantity': true,
    'a11yDeleteButton2First': true,
    'useSiteThemeService': true,
    'enableConsecutiveCharactersPasswordRequirement': true,
    'enablePasswordsCannotMatchInPasswordUpdateForm': true,
    'allPageMetaResolversEnabledInCsr': true,
    'useExtendedMediaComponentConfiguration': true
  })]
})
export class SpartacusFeaturesModule { }
