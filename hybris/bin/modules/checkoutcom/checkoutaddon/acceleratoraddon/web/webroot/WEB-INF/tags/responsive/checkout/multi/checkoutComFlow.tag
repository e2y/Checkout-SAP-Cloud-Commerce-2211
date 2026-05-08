<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:url var="flowSuccessUrl" value="${flowSuccessRedirectUrl}"/>
<c:url var="flowFailureUrl" value="${flowFailureRedirectUrl}"/>
<c:set var="cleanedJson" value="${fn:replace(fn:replace(flowUIConfiguration, '\\\n', ''), \"'\", \"\\\\'\")}"/>

<script>
    var flowUIConfiguration;
    var flowPublicKeyValue = '${publicKey}';
    var flowEnvironment = '${environment}';
    <c:if test="${not empty cleanedJson}">
        flowUIConfiguration = ${cleanedJson};
    </c:if>
    var flowSuccessRedirectUrl = '${flowSuccessUrl}';
    var flowFailureRedirectUrl = '${flowFailureUrl}';
    var flowPaymentSession = {
        id: '${flowPaymentSession.id}',
        payment_session_token: '${flowPaymentSession.payment_session_token}',
        payment_session_secret: '${flowPaymentSession.payment_session_secret}',
    };
    var isABC = '${isABC}';

    async function initializeCheckout() {
        try {
            await ACC.checkoutComWebComponents.bindFlow();
        } catch (error) {
            document.getElementById('error-message').textContent = error.message;
        }
    }

    document.addEventListener("DOMContentLoaded", initializeCheckout);
</script>
<div class="checkoutCom-flow">
    <div id="successToast" class="toast success">
        <span>The payment was successful</span>
    </div>

    <div id="failedToast" class="toast failed">
        <span>The payment failed, try again</span>
    </div>

    <form>
        <div class="content">
            <div id="flow-container"></div>
        </div>
        <span id="error-message"></span>
        <span id="successful-payment-message"></span>
    </form>
</div>
<script src="https://checkout-web-components.checkout.com/index.js"></script>
