
; /* Start:"a:4:{s:4:"full";s:102:"/bitrix/components/bitrix/sale.personal.order.list/templates/bootstrap_v4/script.min.js?16968612412192";s:6:"source";s:83:"/bitrix/components/bitrix/sale.personal.order.list/templates/bootstrap_v4/script.js";s:3:"min";s:87:"/bitrix/components/bitrix/sale.personal.order.list/templates/bootstrap_v4/script.min.js";s:3:"map";s:87:"/bitrix/components/bitrix/sale.personal.order.list/templates/bootstrap_v4/script.map.js";}"*/
BX.namespace("BX.Sale.PersonalOrderComponent");(function(){BX.Sale.PersonalOrderComponent.PersonalOrderList={init:function(e){var t=document.getElementsByClassName("sale-order-list-inner-row");e.paymentList=e.paymentList||{};e.url=e.url||"";e.templateName=e.templateName||"";e.returnUrl=e.returnUrl||"";Array.prototype.forEach.call(t,function(t){var a=t.getElementsByClassName("sale-order-list-shipment-id");if(a[0]){Array.prototype.forEach.call(a,function(e){var t=e.parentNode.getElementsByClassName("sale-order-list-shipment-id-icon")[0];if(t){BX.clipboard.bindCopyClick(t,{text:e.innerHTML})}})}BX.bindDelegate(t,"click",{class:"ajax_reload"},BX.proxy(function(a){var r=t.getElementsByClassName("sale-order-list-inner-row-body")[0];var s=t.getElementsByClassName("sale-order-list-inner-row-template")[0];var l=s.getElementsByClassName("sale-order-list-cancel-payment")[0];BX.ajax({method:"POST",dataType:"html",url:a.target.href,data:{sessid:BX.bitrix_sessid(),RETURN_URL:e.returnUrl},onsuccess:BX.proxy(function(e){var t=document.createElement("div");t.innerHTML=e;s.insertBefore(t,l);r.style.display="none";s.style.display="block";BX.bind(l,"click",function(){r.style.display="block";s.style.display="none";t.remove()},this)},this),onfailure:BX.proxy(function(){return this},this)},this);a.preventDefault()},this));var r=false;BX.bindDelegate(t,"click",{class:"sale-order-list-change-payment"},BX.proxy(function(a){if(r)return;r=true;a.preventDefault();var s=t.getElementsByClassName("sale-order-list-inner-row-body")[0];var l=t.getElementsByClassName("sale-order-list-inner-row-template")[0];var n=l.getElementsByClassName("sale-order-list-cancel-payment")[0];BX.ajax({method:"POST",dataType:"html",url:e.url,data:{sessid:BX.bitrix_sessid(),orderData:e.paymentList[a.target.id],templateName:e.templateName},onsuccess:BX.proxy(function(e){var t=BX.create("div",{props:{className:"row"},children:[e]});l.insertBefore(t,n);a.target.style.display="none";s.parentNode.removeChild(s);l.style.display="block";BX.bind(n,"click",function(){window.location.reload()},this)},this),onfailure:BX.proxy(function(){r=false;return this},this)},this)},this))})}}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:103:"/bitrix/components/bitrix/sale.order.payment.change/templates/bootstrap_v4/script.min.js?16968612403764";s:6:"source";s:84:"/bitrix/components/bitrix/sale.order.payment.change/templates/bootstrap_v4/script.js";s:3:"min";s:88:"/bitrix/components/bitrix/sale.order.payment.change/templates/bootstrap_v4/script.min.js";s:3:"map";s:88:"/bitrix/components/bitrix/sale.order.payment.change/templates/bootstrap_v4/script.map.js";}"*/
BX.namespace("BX.Sale");BX.Sale.OrderPaymentChange=function(){var e=function(e){this.ajaxUrl=e.url;this.accountNumber=e.accountNumber||{};this.paymentNumber=e.paymentNumber||{};this.wrapperId=e.wrapperId||"";this.onlyInnerFull=e.onlyInnerFull||"";this.templateName=e.templateName||"";this.pathToPayment=e.pathToPayment||"";this.returnUrl=e.returnUrl||"";this.refreshPrices=e.refreshPrices||"N";this.inner=e.inner||"";this.templateFolder=e.templateFolder;this.wrapper=document.getElementById("bx-sopc"+this.wrapperId);BX.ready(BX.proxy(this.init,this))};e.prototype.init=function(){var e=this.wrapper.getElementsByClassName("sale-order-payment-change-pp-list")[0];new BX.easing({duration:500,start:{opacity:0,height:50},finish:{opacity:100,height:"auto"},transition:BX.easing.makeEaseOut(BX.easing.transitions.quad),step:function(t){e.style.opacity=t.opacity/100;e.style.height=e.height/450+"px"},complete:function(){e.style.height="auto"}}).animate();BX.bindDelegate(e,"click",{className:"sale-order-payment-change-pp-company"},BX.proxy(function(t){var n=t.target.parentNode;var a=n.getElementsByClassName("sale-order-payment-change-pp-company-hidden")[0];BX.ajax({method:"POST",dataType:"html",url:this.ajaxUrl,data:{sessid:BX.bitrix_sessid(),paySystemId:a.value,accountNumber:this.accountNumber,paymentNumber:this.paymentNumber,templateName:this.templateName,inner:this.inner,refreshPrices:this.refreshPrices,onlyInnerFull:this.onlyInnerFull,pathToPayment:this.pathToPayment,returnUrl:this.returnUrl},onsuccess:BX.proxy(function(n){e.innerHTML="";var a=this.wrapper.getElementsByClassName("sale-order-payment-change-payment-title")[0];a.innerHTML="";var i=BX.create("DIV",{props:{className:"col sale-order-payment-change-pp"},html:n});BX.append(i,e);if(this.wrapper.parentNode.previousElementSibling){var r=this.wrapper.parentNode.previousElementSibling.getElementsByClassName("sale-order-detail-payment-options-methods-image-element")[0];if(r!==undefined){r.style.backgroundImage=t.target.style.backgroundImage}}},this)})},this));return this};return e}();BX.Sale.OrderInnerPayment=function(){var e=function(e){this.ajaxUrl=e.url;this.accountNumber=e.accountNumber||{};this.paymentNumber=e.paymentNumber||{};this.wrapperId=e.wrapperId||"";this.valueLimit=parseFloat(e.valueLimit)||0;this.templateFolder=e.templateFolder;this.wrapper=document.getElementById("bx-sopc"+this.wrapperId);this.inputElement=this.wrapper.getElementsByClassName("inner-payment-form-control")[0];this.sendPayment=this.wrapper.getElementsByClassName("sale-order-inner-payment-button")[0];BX.ready(BX.proxy(this.init,this))};e.prototype.init=function(){BX.bind(this.inputElement,"input",BX.delegate(function(){this.inputElement.value=this.inputElement.value.replace(/[^\d,.]*/g,"").replace(/,/g,".").replace(/([,.])[,.]+/g,"$1").replace(/^[^\d]*(\d+([.,]\d{0,2})?).*$/g,"$1");var e=parseFloat(this.inputElement.value);if(e>this.valueLimit){this.inputElement.value=this.valueLimit}if(e<=0){this.inputElement.value=0;this.sendPayment.classList.add("inactive-button")}else{this.sendPayment.classList.remove("inactive-button")}},this));BX.bind(this.sendPayment,"click",BX.delegate(function(){if(event.target.classList.contains("inactive-button")){return this}event.target.classList.add("inactive-button");BX.ajax({method:"POST",dataType:"html",url:this.ajaxUrl,data:{sessid:BX.bitrix_sessid(),accountNumber:this.accountNumber,paymentNumber:this.paymentNumber,inner:"Y",onlyInnerFull:this.onlyInnerFull,paymentSum:this.inputElement.value,returnUrl:this.returnUrl},onsuccess:BX.proxy(function(e){if(e.length>0)this.wrapper.innerHTML=e;else window.location.reload()},this),onfailure:BX.proxy(function(){return this},this)},this);return this},this))};return e}();
/* End */
;; /* /bitrix/components/bitrix/sale.personal.order.list/templates/bootstrap_v4/script.min.js?16968612412192*/
; /* /bitrix/components/bitrix/sale.order.payment.change/templates/bootstrap_v4/script.min.js?16968612403764*/

//# sourceMappingURL=page_c4eb44cfd39e301c573c59d7f0d207e0.map.js