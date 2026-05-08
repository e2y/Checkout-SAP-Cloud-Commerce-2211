ACC.checkoutComWebComponents = {
  locale: $('#lang-selector').val() ?? 'en-GB',

  missingParameterToUndefined: function(config) {
    if(typeof config === 'object') {
      Object.keys(config).forEach(function(key) {
        if(key === 'borderRadius') {
          var borderRadius = config.borderRadius;
          config[key] = config.borderRadius ? [borderRadius.top, borderRadius.right, borderRadius.bottom, borderRadius.left] : [];
        } else {
          config[key] = config[key] || undefined;
        }
      })
    }
    return config ?? {};
  },

  bindFlow: async function () {
    if (flowPublicKeyValue !== '') {
      const checkout = await CheckoutWebComponents({
        publicKey: flowPublicKeyValue,
        environment: flowEnvironment === 'test' ? 'sandbox' : flowEnvironment,
        appearance: ACC.checkoutComWebComponents.missingParameterToUndefined(flowUIConfiguration),
        locale: ACC.checkoutComWebComponents.locale,
        paymentSession: flowPaymentSession,
        onPaymentCompleted: (_component, paymentResponse) => {
          window.location.href = ACC.bindFlow.addUrlParam(flowSuccessRedirectUrl, {'cko-session-id': paymentResponse.id});
        },
        onError: (component, error) => {
          console.log('onError', error, 'Component', component.type);
          window.location.href = ACC.bindFlow.addUrlParam(flowFailureRedirectUrl, {error: true});
        },
      });

      const flowComponent = checkout.create('flow');

      flowComponent.mount(document.getElementById('flow-container'));
    }
  },

  addUrlParam: function (baseUrl, params) {
    const url = new URL(baseUrl, window.location.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  },

  triggerToast: function (id) {
    var element = document.getElementById(id);
    element.classList.add('show');

    setTimeout(function () {
      element.classList.remove('show');
    }, 5000);
  },
};
