
; /* Start:"a:4:{s:4:"full";s:118:"/bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/action-pool.min.js?16983326994358";s:6:"source";s:99:"/bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/action-pool.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){"use strict";BX.namespace("BX.Sale.BasketActionPool");BX.Sale.BasketActionPool=function(t){this.component=t;this.requestProcessing=false;this.updateTimer=null;this.isBasketRefreshed=this.component.params.DEFERRED_REFRESH!=="Y";this.needFullRecalculation=this.component.params.DEFERRED_REFRESH==="Y";this.pool={};this.lastActualPool={};this.approvedAction=["QUANTITY","DELETE","RESTORE","DELAY","OFFER","MERGE_OFFER"];this.switchTimer()};BX.Sale.BasketActionPool.prototype.setRefreshStatus=function(t){this.isBasketRefreshed=!!t};BX.Sale.BasketActionPool.prototype.getRefreshStatus=function(){return this.isBasketRefreshed};BX.Sale.BasketActionPool.prototype.isItemInPool=function(t){return!!this.pool[t]};BX.Sale.BasketActionPool.prototype.clearLastActualQuantityPool=function(t){this.lastActualPool[t]&&delete this.lastActualPool[t].QUANTITY};BX.Sale.BasketActionPool.prototype.checkItemPoolBefore=function(t){if(!t)return;this.pool[t]=this.pool[t]||{}};BX.Sale.BasketActionPool.prototype.checkItemPoolAfter=function(t){if(!t||!this.pool[t])return;if(Object.keys(this.pool[t]).length===0){delete this.pool[t]}};BX.Sale.BasketActionPool.prototype.addCoupon=function(t){this.pool.COUPON=t;this.switchTimer()};BX.Sale.BasketActionPool.prototype.removeCoupon=function(t){this.checkItemPoolBefore("REMOVE_COUPON");this.pool.REMOVE_COUPON[t]=t;this.switchTimer()};BX.Sale.BasketActionPool.prototype.changeQuantity=function(t,o,e){this.checkItemPoolBefore(t);if(this.lastActualPool[t]&&this.lastActualPool[t].QUANTITY!==o||!this.lastActualPool[t]&&o!==e){this.pool[t].QUANTITY=o}else{this.pool[t]&&delete this.pool[t].QUANTITY}this.checkItemPoolAfter(t);this.switchTimer()};BX.Sale.BasketActionPool.prototype.deleteItem=function(t){this.checkItemPoolBefore(t);if(this.pool[t].RESTORE){delete this.pool[t].RESTORE}else{this.pool[t].DELETE="Y"}this.checkItemPoolAfter(t);this.switchTimer()};BX.Sale.BasketActionPool.prototype.restoreItem=function(t,o){this.checkItemPoolBefore(t);if(this.pool[t].DELETE==="Y"){delete this.pool[t].DELETE}else{this.pool[t].RESTORE=o}this.checkItemPoolAfter(t);this.switchTimer()};BX.Sale.BasketActionPool.prototype.addDelayed=function(t){this.checkItemPoolBefore(t);this.pool[t].DELAY="Y";this.checkItemPoolAfter(t);this.switchTimer()};BX.Sale.BasketActionPool.prototype.removeDelayed=function(t){this.checkItemPoolBefore(t);this.pool[t].DELAY="N";this.checkItemPoolAfter(t);this.switchTimer()};BX.Sale.BasketActionPool.prototype.changeSku=function(t,o,e){if(JSON.stringify(o)!==JSON.stringify(e)){this.checkItemPoolBefore(t);this.pool[t].OFFER=o}else{this.pool[t]&&delete this.pool[t].OFFER;this.checkItemPoolAfter(t)}this.switchTimer()};BX.Sale.BasketActionPool.prototype.mergeSku=function(t){this.checkItemPoolBefore(t);this.pool[t].MERGE_OFFER="Y";this.switchTimer()};BX.Sale.BasketActionPool.prototype.switchTimer=function(){clearTimeout(this.updateTimer);if(this.isProcessing()){return}if(this.isPoolEmpty()){this.component.editPostponedBasketItems();this.component.fireCustomEvents()}if(!this.isPoolEmpty()){this.updateTimer=setTimeout(BX.proxy(this.trySendPool,this),300)}else if(!this.getRefreshStatus()){this.trySendPool()}};BX.Sale.BasketActionPool.prototype.trySendPool=function(){if(this.isPoolEmpty()&&this.getRefreshStatus()){return}this.doProcessing(true);if(!this.isPoolEmpty()){this.component.sendRequest("recalculateAjax",{basket:this.getPoolData()});this.lastActualPool=this.pool;this.pool={}}else if(!this.getRefreshStatus()){this.component.sendRequest("refreshAjax",{fullRecalculation:this.needFullRecalculation?"Y":"N"});this.needFullRecalculation=false}};BX.Sale.BasketActionPool.prototype.getPoolData=function(){var t={},o=this.pool;if(o.COUPON){t.coupon=o.COUPON;delete o.COUPON}if(o.REMOVE_COUPON){t.delete_coupon=o.REMOVE_COUPON;delete o.REMOVE_COUPON}for(var e in o){if(o.hasOwnProperty(e)){for(var i in o[e]){if(o[e].hasOwnProperty(i)&&BX.util.in_array(i,this.approvedAction)){t[i+"_"+e]=o[e][i]}}}}return t};BX.Sale.BasketActionPool.prototype.isPoolEmpty=function(){return Object.keys(this.pool).length===0};BX.Sale.BasketActionPool.prototype.doProcessing=function(t){this.requestProcessing=t===true;if(this.requestProcessing){this.component.startLoader()}else{this.component.endLoader()}};BX.Sale.BasketActionPool.prototype.isProcessing=function(){return this.requestProcessing===true}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:114:"/bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/filter.min.js?169833269910459";s:6:"source";s:94:"/bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/filter.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
(function(){"use strict";BX.namespace("BX.Sale.BasketFilter");BX.Sale.BasketFilter=function(t){this.component=t;this.activeFilterMode=false;this.filterTimer=null;this.mouseOverClearFilter=false;this.realShownItems=[];this.realSortedItems=[];this.realScrollTop=0;this.lastShownItemsHash="";this.currentFilter={query:"",similarHash:"",warning:false,notAvailable:false,delayed:false};if(this.component.useItemsFilter){this.bindEvents()}};BX.Sale.BasketFilter.prototype.bindEvents=function(){var t;var e=this.component.getEntity(this.component.getCacheNode(this.component.ids.itemListWrapper),"basket-filter");t=this.component.getEntity(e,"basket-filter-input");if(BX.type.isDomNode(t)){BX.bind(t,"focus",function(){e.style.flex=3});BX.bind(t,"blur",BX.delegate(function(){if(!this.mouseOverClearFilter){e.style.flex=""}},this));BX.bind(t,"keyup",BX.proxy(this.onFilterInput,this));BX.bind(t,"cut",BX.proxy(this.onFilterInput,this));BX.bind(t,"paste",BX.proxy(this.onFilterInput,this))}t=this.component.getEntity(e,"basket-filter-clear-btn");if(BX.type.isDomNode(t)){BX.bind(t,"mouseenter",BX.delegate(function(){this.mouseOverClearFilter=true},this));BX.bind(t,"mouseout",BX.delegate(function(){this.mouseOverClearFilter=false},this));BX.bind(t,"click",BX.delegate(function(){if(!this.filterInputEmpty()){this.clearFilterInput();this.onFilterChange()}e.style.flex=""},this))}};BX.Sale.BasketFilter.prototype.isActive=function(){return this.activeFilterMode};BX.Sale.BasketFilter.prototype.showFilterByName=function(t){if(!t)return;switch(t){case"not-available":this.showNotAvailableItemsFilter();break;case"delayed":this.showDelayItemsFilter();break;case"warning":this.showWarningItemsFilter();break;case"similar":this.showSimilarItemsFilter();break;case"all":default:this.clearAllFiltersExcept([]);this.onFilterChange()}};BX.Sale.BasketFilter.prototype.onFilterInput=function(){var t=BX.type.isDomNode(BX.proxy_context)?BX.util.trim(BX.proxy_context.value).toLowerCase():"";if(this.currentFilter.query!==t){this.currentFilter.query=t;this.onFilterChange()}};BX.Sale.BasketFilter.prototype.clearAllFiltersExcept=function(t){if(!t||!BX.type.isArray(t))return;!BX.util.in_array("input",t)&&this.clearFilterInput();!BX.util.in_array("warning",t)&&this.clearWarningItemsFilter();!BX.util.in_array("delayed",t)&&this.clearDelayItemsFilter();!BX.util.in_array("not-available",t)&&this.clearNotAvailableItemsFilter();if(!BX.util.in_array("similar",t)){this.clearSimilarItemsFilter();this.component.showSimilarCount(false)}};BX.Sale.BasketFilter.prototype.filterInputEmpty=function(){return this.currentFilter.query.length===0};BX.Sale.BasketFilter.prototype.clearFilterInput=function(){this.currentFilter.query="";var t=this.component.getEntity(this.component.getCacheNode(this.component.ids.itemListWrapper),"basket-filter-input");if(BX.type.isDomNode(t)){t.value=""}};BX.Sale.BasketFilter.prototype.addWarningItemsFilter=function(){this.currentFilter.warning=true};BX.Sale.BasketFilter.prototype.clearWarningItemsFilter=function(){this.currentFilter.warning=false};BX.Sale.BasketFilter.prototype.showWarningItemsFilter=function(){if(!this.currentFilter.warning){this.clearAllFiltersExcept(["warning"]);this.addWarningItemsFilter();this.onFilterChange()}};BX.Sale.BasketFilter.prototype.addDelayItemsFilter=function(){this.currentFilter.delayed=true};BX.Sale.BasketFilter.prototype.clearDelayItemsFilter=function(){this.currentFilter.delayed=false};BX.Sale.BasketFilter.prototype.showDelayItemsFilter=function(){if(!this.currentFilter.delayed){this.clearAllFiltersExcept(["delayed"]);this.addDelayItemsFilter();this.onFilterChange()}};BX.Sale.BasketFilter.prototype.addNotAvailableItemsFilter=function(){this.currentFilter.notAvailable=true};BX.Sale.BasketFilter.prototype.clearNotAvailableItemsFilter=function(){this.currentFilter.notAvailable=false};BX.Sale.BasketFilter.prototype.showNotAvailableItemsFilter=function(){if(!this.currentFilter.notAvailable){this.clearAllFiltersExcept(["not-available"]);this.addNotAvailableItemsFilter();this.onFilterChange()}};BX.Sale.BasketFilter.prototype.addSimilarItemsFilter=function(t){this.currentFilter.similarHash=t.HASH};BX.Sale.BasketFilter.prototype.clearSimilarItemsFilter=function(){this.currentFilter.similarHash=""};BX.Sale.BasketFilter.prototype.showSimilarItemsFilter=function(){var t=this.component.getItemDataByTarget(BX.proxy_context);if(this.currentFilter.similarHash!==t.HASH){this.clearAllFiltersExcept(["similar"]);this.addSimilarItemsFilter(t);this.onFilterChange()}};BX.Sale.BasketFilter.prototype.getTimeoutDuration=function(){return this.component.duration.filterTimer};BX.Sale.BasketFilter.prototype.onFilterChange=function(){this.component.showItemsOverlay();if(this.currentFilter.query.length||this.currentFilter.similarHash.length||this.currentFilter.warning||this.currentFilter.notAvailable||this.currentFilter.delayed){clearTimeout(this.filterTimer);this.filterTimer=setTimeout(BX.proxy(this.enableFilterMode,this),this.getTimeoutDuration())}else{this.disableFilterMode()}};BX.Sale.BasketFilter.prototype.enableFilterMode=function(){var t;if(!this.activeFilterMode){this.activeFilterMode=true;this.realShownItems=BX.util.array_values(this.component.shownItems);this.realSortedItems=BX.util.array_values(this.component.sortedItems);this.realScrollTop=this.component.getDocumentScrollTop()}this.component.scrollToFirstItem();this.component.sortedItems=this.searchItems();t=JSON.stringify(this.component.sortedItems);if(this.lastShownItemsHash!==t){this.lastShownItemsHash=t;this.component.deleteBasketItems(BX.util.array_values(this.component.shownItems),false);if(this.component.sortedItems.length){this.component.initializeBasketItems();this.hideEmptyFilterResult()}else{this.showEmptyFilterResult()}if(this.currentFilter.similarHash.length){this.component.showSimilarCount(true)}}else{this.highlightFoundItems()}this.component.hideItemsOverlay()};BX.Sale.BasketFilter.prototype.disableFilterMode=function(){clearTimeout(this.filterTimer);this.lastShownItemsHash="";if(this.activeFilterMode){this.activeFilterMode=false;this.component.sortedItems=BX.util.array_values(this.realSortedItems);this.component.deleteBasketItems(BX.util.array_values(this.component.shownItems),false);this.hideEmptyFilterResult();this.component.editBasketItems(BX.util.array_values(this.realShownItems));window.scrollTo(0,this.realScrollTop)}this.component.hideItemsOverlay()};BX.Sale.BasketFilter.prototype.searchItems=function(){var t=[];for(var e=0;e<this.realSortedItems.length;e++){var i=this.component.items[this.realSortedItems[e]];if(i&&this.searchItemMatch(i)){t.push(i.ID)}}return t};BX.Sale.BasketFilter.prototype.highlightFoundItems=function(){if(!this.activeFilterMode)return;for(var t in this.component.shownItems){if(this.component.shownItems.hasOwnProperty(t)){this.highlightSearchMatch(this.component.items[this.component.shownItems[t]])}}};BX.Sale.BasketFilter.prototype.searchItemMatch=function(t){var e=false,i=false;if(this.currentFilter.notAvailable){i=!!t.NOT_AVAILABLE;if(!i){return e}}else if(this.currentFilter.delayed){i=!!t.DELAYED;if(!i){return e}}else if(this.currentFilter.warning){i=BX.util.in_array(t.ID,this.component.warningItems);if(!i){return e}}else if(BX.type.isNotEmptyString(this.currentFilter.similarHash)){i=this.currentFilter.similarHash===t.HASH;if(!i){return e}}if(BX.type.isNotEmptyString(this.currentFilter.query)){if(t.NAME.toLowerCase().indexOf(this.currentFilter.query)!==-1){e="NAME"}if(!e){var r=parseFloat(this.currentFilter.query);if(!isNaN(r)){if(parseFloat(t.PRICE)===r){e="PRICE"}else if(parseFloat(t.SUM_PRICE)===r){e="SUM_PRICE"}}}if(!e&&this.currentFilter.query.length>=3){if(t.PRICE_FORMATED.toLowerCase().indexOf(this.currentFilter.query)!==-1){e="PRICE"}else if(t.SUM_PRICE_FORMATED.toLowerCase().indexOf(this.currentFilter.query)!==-1){e="SUM_PRICE"}}var s,l;if(!e&&t.PROPS.length){for(s in t.PROPS){if(t.PROPS.hasOwnProperty(s)){l=t.PROPS[s].VALUE.toLowerCase();if(l===this.currentFilter.query||this.currentFilter.query.length>=3&&l.indexOf(this.currentFilter.query)!==-1){e="PROPS";break}}}}if(!e&&t.COLUMN_LIST.length){for(s in t.COLUMN_LIST){if(t.COLUMN_LIST.hasOwnProperty(s)&&BX.type.isString(t.COLUMN_LIST[s].VALUE)){l=t.COLUMN_LIST[s].VALUE.toLowerCase();if(l===this.currentFilter.query||this.currentFilter.query.length>=3&&l.indexOf(this.currentFilter.query)!==-1){e="COLUMNS";break}}}}}else if(i){e=true}return e};BX.Sale.BasketFilter.prototype.highlightSearchMatch=function(t){var e=this.searchItemMatch(t);if(e){var i,r,s,l;switch(e){case"NAME":i=this.component.getEntity(BX(this.component.ids.item+t.ID),"basket-item-name");if(BX.type.isDomNode(i)){i.innerHTML=t.NAME.replace(new RegExp("(.*)("+this.currentFilter.query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")(.*)","gi"),function(t,e,i,r){return BX.util.htmlspecialchars(e)+'<span class="basket-item-highlighted">'+BX.util.htmlspecialchars(i)+"</span>"+BX.util.htmlspecialchars(r)})}break;case"PRICE":i=BX(this.component.ids.price+t.ID);BX.addClass(i,"basket-item-highlighted");break;case"SUM_PRICE":i=BX(this.component.ids.sumPrice+t.ID);BX.addClass(i,"basket-item-highlighted");break;case"PROPS":i=this.component.getEntities(BX(this.component.ids.item+t.ID),"basket-item-property-value");for(r=0;r<i.length;r++){l=i[r].getAttribute("data-property-code");for(s in t.PROPS){if(t.PROPS.hasOwnProperty(s)&&t.PROPS[s].CODE===l){i[r].innerHTML=t.PROPS[s].VALUE.replace(new RegExp("("+this.currentFilter.query+")","gi"),'<span class="basket-item-highlighted">$1</span>')}}}break;case"COLUMNS":i=this.component.getEntities(BX(this.component.ids.item+t.ID),"basket-item-property-column-value");for(r=0;r<i.length;r++){l=i[r].getAttribute("data-column-property-code");for(s in t.COLUMN_LIST){if(t.COLUMN_LIST.hasOwnProperty(s)&&t.COLUMN_LIST[s].CODE===l){i[r].innerHTML=t.COLUMN_LIST[s].VALUE.replace(new RegExp("("+this.currentFilter.query+")","gi"),'<span class="basket-item-highlighted">$1</span>')}}}break}}};BX.Sale.BasketFilter.prototype.showEmptyFilterResult=function(){var t=this.component.getCacheNode(this.component.ids.itemList);if(BX.type.isDomNode(t)&&t.clientHeight>=500){var e=this.component.getCacheNode(this.component.ids.itemListEmptyResult);if(BX.type.isDomNode(e)){e.style.display=""}}};BX.Sale.BasketFilter.prototype.hideEmptyFilterResult=function(){var t=this.component.getCacheNode(this.component.ids.itemListEmptyResult);if(BX.type.isDomNode(t)){t.style.display="none"}}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:113:"/bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/component.js?169833295361762";s:6:"source";s:97:"/bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/component.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
;(function() {
	'use strict';

	BX.namespace('BX.Sale.BasketComponent');

	BX.Sale.BasketComponent = {
		maxItemsShowCount: 30,
		precisionFactor: Math.pow(10, 6),
		stickyHeaderOffset: 0,

		duration: {
			priceAnimation: 300,
			filterTimer: 300
		},

		ids: {
			item: 'basket-item-',
			quantity: 'basket-item-quantity-',
			price: 'basket-item-price-',
			sumPrice: 'basket-item-sum-price-',
			sumPriceOld: 'basket-item-sum-price-old-',
			sumPriceDiff: 'basket-item-sum-price-difference-',
			itemHeightAligner: 'basket-item-height-aligner-',
			total: 'basket-total-price',
			basketRoot: 'basket-root',
			itemListWrapper: 'basket-items-list-wrapper',
			itemListContainer: 'basket-items-list-container',
			itemList: 'basket-item-list',
			itemListTable: 'basket-item-table',
			itemListEmptyResult: 'basket-item-list-empty-result',
			itemListOverlay: 'basket-items-list-overlay',
			warning: 'basket-warning'
		},

		initializePrimaryFields: function()
		{
			this.templates = {};
			this.nodes = {};

			/** Object of all basket items (itemId => itemArray) */
			this.items = {};

			/** Array of all basket items to show sorted by field SORT */
			this.sortedItems = [];

			/** Array of basket items showed on screen */
			this.shownItems = [];

			/** Array of basket items changed since last request */
			this.changedItems = [];

			/** Array of basket items postponed by pool to edit */
			this.postponedItems = [];

			/** Array of basket items with warnings */
			this.warningItems = [];

			this.isMobile = BX.browser.IsMobile();
			this.isTouch = BX.hasClass(document.documentElement, 'bx-touch');

			this.lastAction = 'initialLoad';
			this.coupons = null;

			this.imagePopup = null;
			this.loadingScreen = null;

			this.quantityDelay = null;
			this.quantityTimer = null;
		},

		init: function(parameters)
		{
			this.initializePrimaryFields();

			this.params = parameters.params || {};
			this.template = parameters.template || '';
			this.signedParamsString = parameters.signedParamsString || '';
			this.siteId = parameters.siteId || '';
			this.siteTemplateId = parameters.siteTemplateId || '';
			this.ajaxUrl = this.params.AJAX_PATH || '';
			this.templateFolder = parameters.templateFolder || '';

			this.useDynamicScroll = this.params.USE_DYNAMIC_SCROLL === 'Y';
			this.useItemsFilter = this.params.SHOW_FILTER === 'Y' && !this.isMobile;

			this.initializeFilter();
			this.applyBasketResult(parameters.result);
			this.initializeActionPool();

			if (this.useItemsFilter)
			{
				this.checkHeaderDisplay();
				this.bindHeaderEvents();
			}

			this.initializeBasketItems();
			this.editTotal();
			this.editWarnings();

			this.getCacheNode(this.ids.basketRoot).style.opacity = 1;

			this.bindInitialEvents();
		},

		getTemplate: function(templateName)
		{
			if (!this.templates.hasOwnProperty(templateName))
			{
				var template = BX(templateName);
				this.templates[templateName] = BX.type.isDomNode(template) ? template.innerHTML : '';
			}

			return this.templates[templateName];
		},

		getCacheNode: function(id)
		{
			if (!this.nodes.hasOwnProperty(id))
			{
				this.nodes[id] = BX(id);
			}

			return this.nodes[id];
		},

		getEntity: function(parent, entity, additionalFilter)
		{
			if (!parent || !entity)
				return null;

			additionalFilter = additionalFilter || '';

			return parent.querySelector(additionalFilter + '[data-entity="' + entity + '"]');
		},

		getEntities: function(parent, entity, additionalFilter)
		{
			if (!parent || !entity)
				return {length: 0};

			additionalFilter = additionalFilter || '';

			return parent.querySelectorAll(additionalFilter + '[data-entity="' + entity + '"]');
		},

		bindInitialEvents: function()
		{
			this.bindWarningEvents();

			BX.bind(window, 'scroll', BX.proxy(this.checkStickyHeaders, this));
			BX.bind(window, 'scroll', BX.proxy(this.lazyLoad, this));

			BX.bind(window, 'resize', BX.throttle(this.checkStickyHeaders, 20, this));
		},

		bindWarningEvents: function()
		{
			var showItemsNode = this.getEntity(BX(this.ids.warning), 'basket-items-warning-count');

			if (BX.type.isDomNode(showItemsNode))
			{
				showItemsNode.style.display = '';
				BX.bind(showItemsNode, 'click', BX.delegate(function() {this.toggleFilter('warning');}, this));
			}

			BX.bind(
				this.getEntity(BX(this.ids.warning), 'basket-items-warning-notification-close'),
				'click',
				BX.proxy(this.removeAllWarnings, this)
			);
		},

		toggleFilter: function(event)
		{
			var target = BX.type.isNotEmptyString(event) ?
				this.getEntity(
					this.getCacheNode(this.ids.itemListWrapper),
					'basket-items-count',
					'[data-filter="' + event + '"]'
				)
				: BX.getEventTarget(event);

			if (!BX.type.isDomNode(target) || BX.hasClass(target, 'active'))
				return;

			var entityName = target.getAttribute('data-filter');
			var entities = target.parentNode.querySelectorAll('[data-filter]');

			for (var i = 0; i < entities.length; i++)
			{
				if (entities[i].getAttribute('data-filter') === entityName)
				{
					BX.addClass(entities[i], 'active');
				}
				else if (BX.hasClass(entities[i], 'active'))
				{
					BX.removeClass(entities[i], 'active');
				}
			}

			this.filter.showFilterByName(entityName);
		},

		scrollToFirstItem: function()
		{
			var headerNode = this.getEntity(this.getCacheNode(this.ids.itemListWrapper), 'basket-items-list-header');

			if (BX.type.isDomNode(headerNode))
			{
				var itemListTopPosition = BX.pos(this.getCacheNode(this.ids.itemListContainer)).top;
				var headerBottomPosition = BX.pos(headerNode).bottom;

				if (itemListTopPosition < headerBottomPosition)
				{
					window.scrollTo(0, itemListTopPosition - this.stickyHeaderOffset);
				}
			}
		},

		showItemsOverlay: function()
		{
			var overlay = this.getCacheNode(this.ids.itemListOverlay);

			if (BX.type.isDomNode(overlay))
			{
				overlay.style.display = '';
			}
		},

		hideItemsOverlay: function()
		{
			var overlay = this.getCacheNode(this.ids.itemListOverlay);

			if (BX.type.isDomNode(overlay))
			{
				overlay.style.display = 'none';
			}
		},

		checkHeaderDisplay: function()
		{
			var header = this.getCacheNode(this.ids.itemListWrapper);

			if (BX.type.isDomNode(header))
			{
				BX.removeClass(header, 'basket-items-list-wrapper-light');
			}
		},

		bindHeaderEvents: function()
		{
			var entities = this.getEntities(this.getCacheNode(this.ids.itemListWrapper), 'basket-items-count');

			for (var i = 0; i < entities.length; i++)
			{
				BX.bind(entities[i], 'click', BX.proxy(this.toggleFilter, this));
			}
		},

		checkStickyHeaders: function()
		{
			if (this.isMobile)
				return;

			var node, position;
			var border = 2, offset = 0;
			var scrollTop = this.getDocumentScrollTop();
			var basketPosition = BX.pos(this.getCacheNode(this.ids.basketRoot));
			var basketScrolledToEnd = scrollTop + 200 >= basketPosition.bottom;

			if (BX.util.in_array('top', this.params.TOTAL_BLOCK_DISPLAY))
			{
				var totalBlockNode = this.getEntity(this.getCacheNode(this.ids.basketRoot), 'basket-total-block');
				if (BX.type.isDomNode(totalBlockNode))
				{
					node = this.getEntity(totalBlockNode, 'basket-checkout-aligner');
					if (BX.type.isDomNode(node))
					{
						position = BX.pos(totalBlockNode);

						if (scrollTop >= position.top)
						{
							offset += node.clientHeight;

							if (!BX.hasClass(node, 'basket-checkout-container-fixed'))
							{
								totalBlockNode.style.height = position.height + 'px';

								node.style.width = node.clientWidth + border + 'px';
								BX.addClass(node, 'basket-checkout-container-fixed');
							}
						}
						else if (BX.hasClass(node, 'basket-checkout-container-fixed'))
						{
							totalBlockNode.style.height = '';

							node.style.width = '';
							BX.removeClass(node, 'basket-checkout-container-fixed');
						}

						if (basketScrolledToEnd)
						{
							if (!BX.hasClass(node, 'basket-checkout-container-fixed-hide'))
							{
								BX.addClass(node, 'basket-checkout-container-fixed-hide');
							}
						}
						else if (BX.hasClass(node, 'basket-checkout-container-fixed-hide'))
						{
							BX.removeClass(node, 'basket-checkout-container-fixed-hide');
						}
					}
				}
			}

			if (this.useItemsFilter)
			{
				var itemWrapperNode = this.getCacheNode(this.ids.itemListWrapper);

				node = this.getEntity(itemWrapperNode, 'basket-items-list-header');
				if (BX.type.isDomNode(node))
				{
					position = BX.pos(itemWrapperNode);

					if ((scrollTop + offset >= position.top) && !basketScrolledToEnd)
					{
						if (!BX.hasClass(node, 'basket-items-list-header-fixed'))
						{
							node.style.width = node.clientWidth + border + 'px';

							itemWrapperNode.style.paddingTop = node.clientHeight + 'px';

							BX.addClass(node, 'basket-items-list-header-fixed');
						}

						if (offset)
						{
							node.style.top = offset + 'px';
						}

						offset += node.clientHeight;
					}
					else if (BX.hasClass(node, 'basket-items-list-header-fixed'))
					{
						itemWrapperNode.style.paddingTop = '';

						node.style.width = '';
						node.style.top = '';

						BX.removeClass(node, 'basket-items-list-header-fixed');
					}
				}
			}

			this.stickyHeaderOffset = offset;
		},

		getDocumentScrollTop: function()
		{
			return window.scrollY
				|| window.pageYOffset
				|| document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
		},

		lazyLoad: function()
		{
			var itemsNodePosition = BX.pos(this.getCacheNode(this.ids.itemListContainer));

			if (this.getDocumentScrollTop() + window.innerHeight >= itemsNodePosition.bottom - 400)
			{
				var itemIds = this.getItemsAfter();
				if (itemIds.length)
				{
					this.editBasketItems(itemIds);
				}
			}
		},

		fireCustomEvents: function()
		{
			if (this.result.EVENT_ONCHANGE_ON_START === 'Y')
			{
				BX.onCustomEvent('OnBasketChange');
			}

			if (this.params.HIDE_COUPON !== 'Y')
			{
				if (this.coupons !== null && this.coupons !== this.result.COUPON_LIST)
				{
					BX.onCustomEvent('OnCouponApply');
				}

				this.coupons = this.result.COUPON_LIST;
			}
		},

		editTotal: function()
		{
			this.fillTotalBlocks();
			this.showItemsCount();
			this.showWarningItemsCount();
			this.showNotAvailableItemsCount();
			this.showDelayedItemsCount();
		},

		fillTotalBlocks: function()
		{
			var totalNodes = this.getEntities(this.getCacheNode(this.ids.basketRoot), 'basket-total-block');

			if (totalNodes && totalNodes.length)
			{
				var totalTemplate = this.getTemplate('basket-total-template');
				if (totalTemplate)
				{
					var totalRender = this.render(totalTemplate, this.result.TOTAL_RENDER_DATA);

					for (var i in totalNodes)
					{
						if (totalNodes.hasOwnProperty(i) && BX.type.isDomNode(totalNodes[i]))
						{
							totalNodes[i].innerHTML = totalRender;

							this.bindTotalEvents(totalNodes[i]);
						}
					}
				}
			}

			this.checkStickyHeaders();
		},

		showItemsCount: function()
		{
			var itemCountNode = this.getEntity(
				this.getCacheNode(this.ids.itemListWrapper),
				'basket-items-count',
				'[data-filter="all"]'
			);

			if (BX.type.isDomNode(itemCountNode))
			{
				itemCountNode.innerHTML = BX.message('SBB_IN_BASKET') + ' ' + this.result.BASKET_ITEMS_COUNT + ' ' + this.getGoodsMessage(this.result.BASKET_ITEMS_COUNT);
				itemCountNode.style.display = '';
			}
		},

		showSimilarCount: function(state)
		{
			var itemCountNode = this.getEntity(
				this.getCacheNode(this.ids.itemListWrapper),
				'basket-items-count',
				'[data-filter="similar"]'
			);

			if (BX.type.isDomNode(itemCountNode))
			{
				if (state)
				{
					itemCountNode.innerHTML = this.sortedItems.length + ' '
						+ this.getGoodsMessage(this.result.BASKET_ITEMS_COUNT, 'SBB_SIMILAR_ITEM');
					itemCountNode.style.display = '';
				}
				else
				{
					itemCountNode.style.display = 'none';
				}
			}
		},

		showWarningItemsCount: function()
		{
			var itemCountNode = this.getEntity(
				this.getCacheNode(this.ids.itemListWrapper),
				'basket-items-count',
				'[data-filter="warning"]'
			);

			if (BX.type.isDomNode(itemCountNode))
			{
				if (this.warningItems.length)
				{
					itemCountNode.innerHTML = this.warningItems.length + ' ' + BX.message('SBB_BASKET_ITEMS_WARNING');
					itemCountNode.style.display = '';
				}
				else
				{
					itemCountNode.style.display = 'none';
				}
			}
		},

		showNotAvailableItemsCount: function()
		{
			var itemCountNode = this.getEntity(
				this.getCacheNode(this.ids.itemListWrapper),
				'basket-items-count',
				'[data-filter="not-available"]'
			);

			if (BX.type.isDomNode(itemCountNode))
			{
				if (parseInt(this.result.NOT_AVAILABLE_BASKET_ITEMS_COUNT))
				{
					itemCountNode.innerHTML = this.result.NOT_AVAILABLE_BASKET_ITEMS_COUNT + ' '
						+ this.getGoodsMessage(this.result.NOT_AVAILABLE_BASKET_ITEMS_COUNT, 'SBB_NOT_AVAILABLE_ITEM');
					itemCountNode.style.display = '';
				}
				else
				{
					itemCountNode.style.display = 'none';
				}
			}
		},

		showDelayedItemsCount: function()
		{
			var itemCountNode = this.getEntity(
				this.getCacheNode(this.ids.itemListWrapper),
				'basket-items-count',
				'[data-filter="delayed"]'
			);

			if (BX.type.isDomNode(itemCountNode))
			{
				if (parseInt(this.result.DELAYED_BASKET_ITEMS_COUNT))
				{
					itemCountNode.innerHTML = this.result.DELAYED_BASKET_ITEMS_COUNT + ' '
						+ this.getGoodsMessage(this.result.DELAYED_BASKET_ITEMS_COUNT, 'SBB_DELAYED_ITEM');
					itemCountNode.style.display = '';
				}
				else
				{
					itemCountNode.style.display = 'none';
				}
			}
		},

		getGoodsMessage: function(count, customMessage)
		{
			var mesCode;
			var countReminder = (count > 10 && count < 20) ? 0 : count % 10;

			if (countReminder === 1)
			{
				mesCode = customMessage || 'SBB_GOOD';
			}
			else if (countReminder >= 2 && countReminder <= 4)
			{
				mesCode = customMessage ? customMessage + '_2' : 'SBB_GOOD_2';
			}
			else
			{
				mesCode = customMessage ? customMessage + 'S' : 'SBB_GOODS';
			}

			return BX.message(mesCode);
		},

		bindTotalEvents: function(node)
		{
			if (!this.result.TOTAL_RENDER_DATA.DISABLE_CHECKOUT)
			{
				BX.bind(this.getEntity(node, 'basket-checkout-button'), 'click', BX.proxy(this.checkOutAction, this));
			}

			BX.bind(this.getEntity(node, 'basket-coupon-input'), 'change', BX.proxy(this.addCouponAction, this));
			BX.bind(this.getEntity(node, 'basket-coupon-input'), 'paste', BX.proxy(this.pasteCouponAction, this));

			var couponNodes = this.getEntities(node, 'basket-coupon-delete');
			for (var i = 0, l = couponNodes.length; i < l; i++)
			{
				BX.bind(couponNodes[i], 'click', BX.proxy(this.removeCouponAction, this));
			}

		},

		checkOutAction: function()
		{
			document.location.href = this.params.PATH_TO_ORDER;
		},

		addCouponAction: function(event)
		{
			var target = BX.getEventTarget(event);
			if (target && target.value)
			{
				this.actionPool.addCoupon(target.value);
				target.disabled = true;
			}
		},

		pasteCouponAction: function(event)
		{
			setTimeout(BX.delegate(function() {
				this.addCouponAction(event);
			}, this), 10);
		},

		removeCouponAction: function()
		{
			var value = BX.proxy_context && BX.util.trim(BX.proxy_context.getAttribute('data-coupon'));
			if (value)
			{
				this.actionPool.removeCoupon(value);
			}
		},

		initializeActionPool: function()
		{
			this.actionPool = new BX.Sale.BasketActionPool(this);
		},

		initializeFilter: function()
		{
			this.filter = new BX.Sale.BasketFilter(this);
		},

		/**
		 * Send ajax request with basket data and executes callback by action
		 */
		sendRequest: function(action, data)
		{
			this.lastAction = action;

			if (this.lastAction === 'recalculateAjax')
			{
				// we use it to reload all items if applied discounts changed
				data.lastAppliedDiscounts = BX.util.array_keys(this.result.FULL_DISCOUNT_LIST).join(',');

				if (this.params.USE_ENHANCED_ECOMMERCE === 'Y')
				{
					this.checkAnalytics(data);
				}
			}

			BX.ajax({
				method: 'POST',
				dataType: 'json',
				url: this.ajaxUrl,
				data: this.getData(data),
				onsuccess: BX.delegate(function(result) {
					this.actionPool.doProcessing(false);

					if (!BX.type.isPlainObject(result))
						return;

					this.actionPool.setRefreshStatus(result.BASKET_REFRESHED);

					if (result.RESTORED_BASKET_ITEMS)
					{
						this.restoreBasketItems(result.RESTORED_BASKET_ITEMS);
					}

					if (result.DELETED_BASKET_ITEMS)
					{
						this.deleteBasketItems(result.DELETED_BASKET_ITEMS, this.params.SHOW_RESTORE === 'Y');
					}

					if (result.MERGED_BASKET_ITEMS)
					{
						this.deleteBasketItems(result.MERGED_BASKET_ITEMS, false, true);
					}

					this.applyBasketResult(result.BASKET_DATA);
					this.editBasketItems(this.getItemsToEdit());
					this.editTotal();

					this.applyPriceAnimation();
					this.editWarnings();

					this.actionPool.switchTimer();

					if (this.isBasketIntegrated() && this.isBasketChanged())
					{
						BX.Sale.OrderAjaxComponent.sendRequest();
					}
				}, this),
				onfailure: BX.delegate(function() {
					this.actionPool.doProcessing(false);
				}, this)
			});
		},

		isBasketIntegrated: function()
		{
			return this.params.BASKET_WITH_ORDER_INTEGRATION === 'Y';
		},

		isBasketChanged: function()
		{
			return this.changedItems.length;
		},

		addPriceAnimationData: function(nodeId, start, finish, currency)
		{
			if (!BX.type.isPlainObject(this.priceAnimationData))
			{
				this.clearPriceAnimationData();
			}

			this.priceAnimationData.start[nodeId] = parseFloat(start);
			this.priceAnimationData.finish[nodeId] = parseFloat(finish);
			this.priceAnimationData.currency[nodeId] = currency;
			this.priceAnimationData.int[nodeId] = (parseFloat(start) === parseInt(start)) && (parseFloat(finish) === parseInt(finish));
		},

		clearPriceAnimationData: function()
		{
			this.priceAnimationData = {
				start: {},
				finish: {},
				currency: {},
				int: {}
			};
		},

		applyBasketResult: function(result)
		{
			this.changedItems = [];
			this.clearPriceAnimationData();

			if (!BX.type.isPlainObject(result))
			{
				return;
			}

			if (result.BASKET_ITEM_RENDER_DATA)
			{
				var i, newData;

				for (i in result.BASKET_ITEM_RENDER_DATA)
				{
					if (result.BASKET_ITEM_RENDER_DATA.hasOwnProperty(i))
					{
						newData = result.BASKET_ITEM_RENDER_DATA[i];
						newData.WARNINGS = this.checkBasketItemWarnings(newData, result.WARNING_MESSAGE_WITH_CODE);

						if (this.items[newData.ID])
						{
							if (JSON.stringify(this.items[newData.ID]) === JSON.stringify(newData))
							{
								continue;
							}
						}
						else
						{
							this.addSortedItem(newData.ID, true);
						}

						this.changedItems.push(newData.ID);

						newData = this.checkBasketItemsAnimation(newData);
						this.items[newData.ID] = newData;
					}
				}

				this.changedItems = BX.util.array_unique(this.changedItems.concat(this.getChangedSimilarOffers()));

				if (this.isBasketChanged())
				{
					this.sortSortedItems(true);
				}
			}

			if (result.TOTAL_RENDER_DATA)
			{
				result.TOTAL_RENDER_DATA = this.checkTotalAnimation(result.TOTAL_RENDER_DATA);
			}

			this.result = result;
		},

		itemSortFunction: function(a, b)
		{
			if (!this.items.hasOwnProperty(a) || !this.items.hasOwnProperty(b))
			{
				return 0;
			}

			return parseFloat(this.items[a].SECTION_ID) - parseFloat(this.items[b].SECTION_ID);
		},

		getChangedSimilarOffers: function()
		{
			var changedSimilarOffers = [];

			var otherSimilarItemsQuantity, totalSimilarItemsQuantity;
			var hashMap = this.getHashMap();

			for (var hash in hashMap)
			{
				if (hashMap.hasOwnProperty(hash))
				{
					if (hashMap[hash].length > 1)
					{
						for (var i = 0; i < hashMap[hash].length; i++)
						{
							otherSimilarItemsQuantity = 0;
							totalSimilarItemsQuantity = 0;

							for (var k = 0; k < hashMap[hash].length; k ++)
							{
								if (hashMap[hash][k] != hashMap[hash][i])
								{
									otherSimilarItemsQuantity += parseFloat(this.items[hashMap[hash][k]].QUANTITY);
								}

								totalSimilarItemsQuantity += parseFloat(this.items[hashMap[hash][k]].QUANTITY);
							}

							if (
								!this.items[hashMap[hash][i]].HAS_SIMILAR_ITEMS
								|| this.items[hashMap[hash][i]].SIMILAR_ITEMS_QUANTITY != otherSimilarItemsQuantity
								|| this.items[hashMap[hash][i]].TOTAL_SIMILAR_ITEMS_QUANTITY != totalSimilarItemsQuantity
							)
							{
								changedSimilarOffers.push(hashMap[hash][i]);

								this.items[hashMap[hash][i]].HAS_SIMILAR_ITEMS = true;
								this.items[hashMap[hash][i]].SIMILAR_ITEMS_QUANTITY = otherSimilarItemsQuantity;
								this.items[hashMap[hash][i]].TOTAL_SIMILAR_ITEMS_QUANTITY = totalSimilarItemsQuantity;

								this.items[hashMap[hash][i]].ALL_AVAILABLE_QUANTITY = this.items[hashMap[hash][i]].AVAILABLE_QUANTITY;
								this.items[hashMap[hash][i]].AVAILABLE_QUANTITY = this.items[hashMap[hash][i]].ALL_AVAILABLE_QUANTITY - otherSimilarItemsQuantity;
							}
						}
					}
					else if (hashMap[hash][0] && this.items[hashMap[hash][0]].HAS_SIMILAR_ITEMS)
					{
						changedSimilarOffers.push(hashMap[hash][0]);

						delete this.items[hashMap[hash][0]].HAS_SIMILAR_ITEMS;
						delete this.items[hashMap[hash][0]].SIMILAR_ITEMS_QUANTITY;
						delete this.items[hashMap[hash][0]].TOTAL_SIMILAR_ITEMS_QUANTITY;

						this.items[hashMap[hash][0]].AVAILABLE_QUANTITY = this.items[hashMap[hash][0]].ALL_AVAILABLE_QUANTITY;
						delete this.items[hashMap[hash][0]].ALL_AVAILABLE_QUANTITY;
					}
				}
			}

			return changedSimilarOffers;
		},

		getHashMap: function()
		{
			var hashMap = {};

			for (var id in this.items)
			{
				if (this.items.hasOwnProperty(id) && this.isItemAvailable(id))
				{
					if (!hashMap.hasOwnProperty(this.items[id].HASH))
					{
						hashMap[this.items[id].HASH] = [];
					}

					hashMap[this.items[id].HASH].push(id);
				}
			}

			return hashMap;
		},

		isItemAvailable: function(itemId)
		{
			var sortedItems = this.filter.isActive() ? this.filter.realSortedItems : this.sortedItems;

			return !this.items[itemId].NOT_AVAILABLE
				&& !this.items[itemId].SHOW_RESTORE
				&& BX.util.in_array(itemId, sortedItems);
		},

		checkTotalAnimation: function(totalData)
		{
			if (this.result && this.result.TOTAL_RENDER_DATA && parseFloat(this.result.TOTAL_RENDER_DATA.PRICE) > parseFloat(totalData.PRICE))
			{
				totalData.PRICE_NEW = totalData.PRICE;
				totalData.PRICE = this.result.TOTAL_RENDER_DATA.PRICE;

				totalData.PRICE_FORMATED_NEW = totalData.PRICE_FORMATED;
				totalData.PRICE_FORMATED = this.result.TOTAL_RENDER_DATA.PRICE_FORMATED;

				this.addPriceAnimationData(this.ids.total, totalData.PRICE, totalData.PRICE_NEW, totalData.CURRENCY);
			}

			return totalData;
		},

		checkBasketItemsAnimation: function(itemData)
		{
			var itemId = itemData.ID;

			if (this.items[itemId])
			{
				var quantityNode = BX(this.ids.quantity + itemId);
				if (
					BX.type.isDomNode(quantityNode)
					&& !this.actionPool.isItemInPool(itemId)
					&& parseFloat(quantityNode.value) !== parseFloat(itemData.QUANTITY)
				)
				{
					itemData.QUANTITY_ANIMATION = true;
					this.actionPool.clearLastActualQuantityPool(itemId);
				}

				if (parseFloat(this.items[itemId].PRICE) > parseFloat(itemData.PRICE))
				{
					itemData.PRICE_NEW = itemData.PRICE;
					itemData.PRICE = this.items[itemId].PRICE;

					itemData.PRICE_FORMATED_NEW = itemData.PRICE_FORMATED;
					itemData.PRICE_FORMATED = this.items[itemId].PRICE_FORMATED;

					this.addPriceAnimationData(this.ids.price + itemId, itemData.PRICE, itemData.PRICE_NEW, itemData.CURRENCY);
				}

				if (
					BX.util.in_array('SUM', this.params.COLUMNS_LIST)
					&& parseFloat(this.items[itemId].SUM_PRICE) > parseFloat(itemData.SUM_PRICE)
					&& parseFloat(this.items[itemId].QUANTITY) === parseFloat(itemData.QUANTITY)
				)
				{
					itemData.SUM_PRICE_NEW = itemData.SUM_PRICE;
					itemData.SUM_PRICE = this.items[itemId].SUM_PRICE;

					itemData.SUM_PRICE_FORMATED_NEW = itemData.SUM_PRICE_FORMATED;
					itemData.SUM_PRICE_FORMATED = this.items[itemId].SUM_PRICE_FORMATED;

					this.addPriceAnimationData(this.ids.sumPrice + itemId, itemData.SUM_PRICE, itemData.SUM_PRICE_NEW, itemData.CURRENCY);
				}
			}

			return itemData;
		},

		getData: function(data)
		{
			data = data || {};

			data[this.params.ACTION_VARIABLE] = this.lastAction;
			data.via_ajax = 'Y';
			data.site_id = this.siteId;
			data.site_template_id = this.siteTemplateId;
			data.sessid = BX.bitrix_sessid();
			data.template = this.template;
			data.signedParamsString = this.signedParamsString;

			return data;
		},

		startLoader: function()
		{
			// if (!this.loadingScreen)
			// {
			// 	this.loadingScreen = new BX.PopupWindow('loading_screen', null, {
			// 		events: {
			// 			onAfterPopupShow: BX.delegate(function() {
			// 				BX.cleanNode(this.loadingScreen.popupContainer);
			// 				BX.removeClass(this.loadingScreen.popupContainer, 'popup-window');
			// 				this.loadingScreen.popupContainer.appendChild(
			// 					BX.create('IMG', {props: {src: this.templateFolder + '/images/loader.gif'}})
			// 				);
			// 				this.loadingScreen.popupContainer.removeAttribute('style');
			// 				this.loadingScreen.popupContainer.style.display = 'block';
			// 			}, this)
			// 		}
			// 	});
			// 	BX.addClass(this.loadingScreen.popupContainer, 'bx-step-opacity');
			// }
			//
			// this.loadingScreen.show();
		},

		/**
		 * Hiding loader image with overlay.
		 */
		endLoader: function()
		{
			// if (this.loadingScreen && this.loadingScreen.isShown())
			// {
			// 	this.loadingScreen.close();
			// }
		},

		editWarnings: function()
		{
			this.editGeneralWarnings();
			this.editBasketItemWarnings();
			this.toggleWarningBlock();
			this.showWarningItemsCount();
		},

		editGeneralWarnings: function()
		{
			var warningsNode = this.getEntity(this.getCacheNode(this.ids.warning), 'basket-general-warnings');

			if (BX.type.isDomNode(warningsNode))
			{
				var generalWarningText = warningsNode.innerHTML;

				if (this.result.WARNING_MESSAGE_WITH_CODE)
				{
					for (var code in this.result.WARNING_MESSAGE_WITH_CODE)
					{
						if (this.result.WARNING_MESSAGE_WITH_CODE.hasOwnProperty(code))
						{
							if (
								!this.items[code]
								&& generalWarningText.indexOf(this.result.WARNING_MESSAGE_WITH_CODE[code]) === -1
							)
							{
								generalWarningText += this.result.WARNING_MESSAGE_WITH_CODE[code] + '<br/>';
							}
						}
					}
				}

				if (generalWarningText)
				{
					warningsNode.innerHTML = generalWarningText;
					warningsNode.style.display = '';
				}
				else
				{
					warningsNode.style.display = 'none';
					warningsNode.innerHTML = '';
				}
			}
		},

		editBasketItemWarnings: function()
		{
			var itemsWarningsNode = this.getEntity(this.getCacheNode(this.ids.warning), 'basket-item-warnings');

			if (BX.type.isDomNode(itemsWarningsNode))
			{
				if (this.warningItems.length)
				{
					var warningCount = this.getEntity(itemsWarningsNode, 'basket-items-warning-count');
					if (BX.type.isDomNode(warningCount))
					{
						warningCount.innerHTML = this.warningItems.length + ' ' + this.getGoodsMessage(this.warningItems.length);
					}

					itemsWarningsNode.style.display = '';
				}
				else if (itemsWarningsNode.style.display !== 'none')
				{
					itemsWarningsNode.style.display = 'none';

					if (this.filter.isActive())
					{
						this.toggleFilter('all');
					}
				}
			}
		},

		toggleWarningBlock: function()
		{
			var warningNode = this.getCacheNode(this.ids.warning);

			if (BX.type.isDomNode(warningNode))
			{
				var generalWarningNode = this.getEntity(warningNode, 'basket-general-warnings');
				var itemsWarningsNode = this.getEntity(warningNode, 'basket-item-warnings');

				if (
					(!BX.type.isDomNode(generalWarningNode) || generalWarningNode.style.display === 'none')
					&& (!BX.type.isDomNode(itemsWarningsNode) || itemsWarningsNode.style.display === 'none')
				)
				{
					warningNode.style.display = 'none';
				}
				else
				{
					warningNode.style.display = '';
				}
			}
		},

		checkBasketItemWarnings: function(itemData, warnings)
		{
			if (!itemData)
				return;

			var itemWarnings;

			if (this.items[itemData.ID] && this.lastAction === 'refreshAjax')
			{
				itemWarnings = this.items[itemData.ID].WARNINGS;
			}
			else
			{
				itemWarnings = [];
			}

			if (BX.type.isArray(warnings[itemData.ID]) && warnings[itemData.ID].length)
			{
				for (var i in warnings[itemData.ID])
				{
					if (warnings[itemData.ID].hasOwnProperty(i) && !BX.util.in_array(warnings[itemData.ID][i], itemWarnings))
					{
						itemWarnings.push(warnings[itemData.ID][i]);
					}
				}
			}

			if (itemWarnings.length)
			{
				if (!BX.util.in_array(itemData.ID, this.warningItems))
				{
					this.warningItems.push(itemData.ID);
				}
			}
			else if (BX.util.in_array(itemData.ID, this.warningItems))
			{
				this.warningItems.splice(BX.util.array_search(itemData.ID, this.warningItems), 1);
			}

			return itemWarnings;
		},

		removeAllWarnings: function(event)
		{
			this.clearGeneralWarnings();
			this.clearBasketItemsWarnings();

			this.editWarnings();

			event && event.preventDefault();
		},

		clearGeneralWarnings: function()
		{
			this.result.WARNING_MESSAGE_WITH_CODE = {};

			var generalWarningNode = this.getEntity(this.getCacheNode(this.ids.warning), 'basket-general-warnings');

			if (BX.type.isDomNode(generalWarningNode))
			{
				generalWarningNode.innerHTML = '';
			}
		},

		clearBasketItemsWarnings: function()
		{
			var itemsToEdit = [];

			for (var i in this.warningItems)
			{
				if (this.warningItems.hasOwnProperty(i))
				{
					this.items[this.warningItems[i]].WARNINGS = [];

					if (this.isItemShown(this.warningItems[i]))
					{
						itemsToEdit.push(this.warningItems[i]);
					}
				}
			}

			this.warningItems = [];
			this.editBasketItems(itemsToEdit);
		},

		isItemShown: function(itemId)
		{
			return BX.util.in_array(itemId, this.shownItems);
		},

		initializeBasketItems: function()
		{
			if (Object.keys(this.items).length === 0)
				return;

			for (var i = 0; i < this.sortedItems.length; i++)
			{
				if (this.useDynamicScroll && this.shownItems.length >= this.maxItemsShowCount)
				{
					break;
				}

				this.createBasketItem(this.sortedItems[i]);
			}
		},

		createBasketItem: function(itemId)
		{
			if (!this.items[itemId])
			{
				return;
			}

			var basketItemTemplate = this.getTemplate('basket-item-template');
			if (basketItemTemplate)
			{
				var basketItemHtml = this.renderBasketItem(basketItemTemplate, this.items[itemId]);
				var sortIndex = BX.util.array_search(itemId, this.sortedItems);

				if (this.shownItems.length && sortIndex >= 0)
				{
					if (sortIndex < BX.util.array_search(this.shownItems[0], this.sortedItems))
					{
						// insert before
						BX(this.ids.item + this.shownItems[0]).insertAdjacentHTML('beforebegin', basketItemHtml);
						this.shownItems.unshift(itemId);
					}
					else if (sortIndex > BX.util.array_search(this.shownItems[this.shownItems.length - 1], this.sortedItems))
					{
						// insert after
						BX(this.ids.item + this.shownItems[this.shownItems.length - 1]).insertAdjacentHTML('afterend', basketItemHtml);
						this.shownItems.push(itemId);
					}
					else
					{
						// insert between
						BX(this.ids.item + this.sortedItems[sortIndex + 1]).insertAdjacentHTML('beforebegin', basketItemHtml);
						this.shownItems.splice(sortIndex + 1, 0, itemId);
					}
				}
				else
				{
					this.getCacheNode(this.ids.itemListTable).insertAdjacentHTML('beforeend', basketItemHtml);
					this.shownItems.push(itemId);
				}

				this.bindBasketItemEvents(this.items[itemId]);

				if (this.filter.isActive())
				{
					this.filter.highlightSearchMatch(this.items[itemId]);
				}
			}
		},

		getItemsToEdit: function()
		{
			var itemIds = [];

			if (this.isBasketChanged())
			{
				for (var i in this.changedItems)
				{
					if (this.changedItems.hasOwnProperty(i) && this.isItemShown(this.changedItems[i]))
					{
						itemIds.push(this.changedItems[i]);
					}
				}
			}

			return itemIds;
		},

		getItemsAfter: function()
		{
			var itemIdsAfter = [];

			if (this.useDynamicScroll)
			{
				var lastShownItemId = this.shownItems[this.shownItems.length - 1] || false;

				if (lastShownItemId)
				{
					var i = 0;
					var index = BX.util.array_search(lastShownItemId, this.sortedItems);

					while (this.sortedItems[++index] && i++ < this.maxItemsShowCount)
					{
						itemIdsAfter.push(this.sortedItems[index]);
					}
				}
			}

			return itemIdsAfter;
		},

		editBasketItems: function(itemIds)
		{
			if (!itemIds || itemIds.length === 0)
			{
				return;
			}

			var i, item;

			for (i in itemIds)
			{
				if (!itemIds.hasOwnProperty(i) || !BX.type.isPlainObject(this.items[itemIds[i]]))
				{
					continue;
				}

				item = this.items[itemIds[i]];

				if (this.actionPool.isItemInPool(item.ID))
				{
					if (!BX.util.in_array(item.ID, this.postponedItems))
					{
						this.postponedItems.push(item.ID);
					}

					continue;
				}

				if (BX.type.isDomNode(BX(this.ids.item + item.ID)))
				{
					this.redrawBasketItemNode(item.ID);
					this.applyQuantityAnimation(item.ID);
				}
				else
				{
					this.createBasketItem(item.ID);
				}
			}
		},

		editPostponedBasketItems: function()
		{
			if (!this.postponedItems.length)
				return;

			var itemsToEdit = [];

			for (var i in this.postponedItems)
			{
				if (this.postponedItems.hasOwnProperty(i) && this.isItemShown(this.postponedItems[i]))
				{
					itemsToEdit.push(this.postponedItems[i]);
				}
			}

			this.postponedItems = [];
			this.editBasketItems(itemsToEdit);
		},

		applyQuantityAnimation: function(itemId)
		{
			var basketItemNode = BX(this.ids.item + itemId);

			if (BX.type.isDomNode(basketItemNode) && this.items[itemId])
			{
				if (this.items[itemId].QUANTITY_ANIMATION)
				{
					BX.addClass(BX(this.ids.quantity + itemId), 'basket-updated');
				}
			}
		},

		applyPriceAnimation: function()
		{
			if (!this.priceAnimationData || Object.keys(this.priceAnimationData.start).length === 0)
				return;

			var animationData = this.priceAnimationData,
				nodeCache = {};

			new BX.easing({
				duration: this.params.USE_PRICE_ANIMATION === 'Y' ? this.duration.priceAnimation : 1,
				start: animationData.start,
				finish: animationData.finish,
				transition: BX.easing.makeEaseOut(BX.easing.transitions.quad),
				step: BX.delegate(function(state){
					for (var nodeId in animationData.start)
					{
						if (animationData.start.hasOwnProperty(nodeId))
						{
							if (!nodeCache[nodeId])
							{
								if (nodeId === this.ids.total)
								{
									nodeCache[nodeId] = this.getEntities(this.getCacheNode(this.ids.basketRoot), this.ids.total);
								}
								else
								{
									var node = BX(nodeId);
									nodeCache[nodeId] = node ? [node] : [];
								}
							}

							if (!animationData.int[nodeId])
							{
								// fix price blinking
								state[nodeId] = (state[nodeId] + (state[nodeId] % 1000) / 1000).toFixed(5);
							}

							for (var i = 0; i < nodeCache[nodeId].length; i++)
							{
								nodeCache[nodeId][i].innerHTML = this.getFormatPrice(state[nodeId], animationData.currency[nodeId]);
							}
						}
					}
				}, this),
				complete: BX.delegate(function() {
					var nodeId, formattedPrice, itemId, type;

					for (nodeId in animationData.start)
					{
						if (animationData.start.hasOwnProperty(nodeId))
						{
							formattedPrice = this.getFormatPrice(animationData.finish[nodeId], animationData.currency[nodeId]);

							for (var i = 0; i < nodeCache[nodeId].length; i++)
							{
								nodeCache[nodeId][i].innerHTML = formattedPrice;
							}

							if (nodeId.indexOf(this.ids.sumPrice) !== -1)
							{
								type = 'SUM_PRICE';
								itemId = nodeId.substr(this.ids.sumPrice.length);
							}
							else if (nodeId.indexOf(this.ids.price) !== -1)
							{
								type = 'PRICE';
								itemId = nodeId.substr(this.ids.price.length);
							}
							else if (nodeId.indexOf(this.ids.total) !== -1)
							{
								type = 'TOTAL';
								itemId = '';
							}
							else
							{
								itemId = '';
								type = '';
							}

							if (BX.type.isNotEmptyString(type))
							{
								if (itemId)
								{
									this.items[itemId][type] = animationData.finish[nodeId];
									delete this.items[itemId][type + '_NEW'];
									this.items[itemId][type + '_FORMATED'] = formattedPrice;
									delete this.items[itemId][type + '_FORMATED_NEW'];
								}
								else if (type === 'TOTAL')
								{
									this.result.TOTAL_RENDER_DATA.PRICE = animationData.finish[nodeId];
									delete this.result.TOTAL_RENDER_DATA.PRICE_NEW;
									this.result.TOTAL_RENDER_DATA.PRICE_FORMATED = formattedPrice;
									delete this.result.TOTAL_RENDER_DATA.PRICE_FORMATED_NEW;
								}
							}
						}
					}

					this.filter.highlightFoundItems();
				}, this)
			}).animate();
		},

		getFormatPrice: function(price, currency)
		{
			return BX.Currency.currencyFormat(price, currency, true);
		},

		deleteBasketItems: function(items, restore, final)
		{
			if (!items || !items.length)
			{
				return;
			}

			for (var i in items)
			{
				if (items.hasOwnProperty(i))
				{
					this.deleteBasketItem(items[i], restore, final);
				}
			}
		},

		deleteBasketItem: function(itemId, restore, final)
		{
			// delete not available item with no chance to restore
			if (this.items[itemId].NOT_AVAILABLE && restore)
			{
				restore = false;
				final = true;
			}

			if (restore)
			{
				this.items[itemId].SHOW_RESTORE = true;
				this.items[itemId].SHOW_LOADING = false;
				this.redrawBasketItemNode(itemId);
			}
			else
			{
				this.changeShownItem(itemId);
				BX.remove(BX(this.ids.item + itemId));
			}

			if (final)
			{
				this.changeSortedItem(itemId, false, true);
				this.changeShownItem(itemId, false, true);
			}
		},

		addSortedItem: function(itemId, all)
		{
			this.sortedItems.push(itemId.toString());

			if (all && this.filter.isActive())
			{
				this.filter.realSortedItems.push(itemId.toString());
			}
		},

		changeSortedItem: function(itemId, newItemId, all)
		{
			var index = BX.util.array_search(itemId, this.sortedItems);

			if (index >= 0)
			{
				if (newItemId)
				{
					this.sortedItems.splice(index, 1, newItemId.toString());
				}
				else
				{
					this.sortedItems.splice(index, 1);
				}
			}

			if (all && this.filter.isActive())
			{
				index = BX.util.array_search(itemId, this.filter.realSortedItems);

				if (index >= 0)
				{
					if (newItemId)
					{
						this.filter.realSortedItems.splice(index, 1, newItemId.toString());
					}
					else
					{
						this.filter.realSortedItems.splice(index, 1);
					}
				}
			}
		},

		sortSortedItems: function(all)
		{
			this.sortedItems.sort(BX.proxy(this.itemSortFunction, this));

			if (all && this.filter.isActive())
			{
				this.filter.realSortedItems.sort(BX.proxy(this.itemSortFunction, this));
			}
		},

		changeShownItem: function(itemId, newItemId, all)
		{
			var index = BX.util.array_search(itemId, this.shownItems);

			if (index >= 0)
			{
				if (newItemId)
				{
					this.shownItems.splice(index, 1, newItemId.toString());
				}
				else
				{
					this.shownItems.splice(index, 1);
				}
			}

			if (all && this.filter.isActive())
			{
				index = BX.util.array_search(itemId, this.filter.realShownItems);

				if (index >= 0)
				{
					if (newItemId)
					{
						this.filter.realShownItems.splice(index, 1, newItemId.toString());
					}
					else
					{
						this.filter.realShownItems.splice(index, 1);
					}
				}
			}
		},

		redrawBasketItemNode: function(itemId)
		{
			var basketItemNode = BX(this.ids.item + itemId);

			if (!this.items[itemId] || !BX.type.isDomNode(basketItemNode))
				return;

			var basketItemTemplate = this.getTemplate('basket-item-template');
			if (basketItemTemplate)
			{
				var nodeAligner = BX(this.ids.itemHeightAligner + itemId),
					oldHeight;

				if (BX.type.isDomNode(nodeAligner))
				{
					oldHeight = nodeAligner.clientHeight;
				}

				var basketItemHtml = this.renderBasketItem(basketItemTemplate, this.items[itemId]);
				basketItemNode.insertAdjacentHTML('beforebegin', basketItemHtml);
				BX.remove(basketItemNode);

				if (oldHeight)
				{
					nodeAligner = BX(this.ids.itemHeightAligner + itemId);

					if (BX.type.isDomNode(nodeAligner) && nodeAligner.clientHeight < oldHeight)
					{
						nodeAligner.style.minHeight = oldHeight + 'px';
						setTimeout(function(){nodeAligner.style.minHeight = '0px';}, 1);
					}
				}

				this.bindBasketItemEvents(this.items[itemId]);

				if (this.filter.isActive())
				{
					this.filter.highlightSearchMatch(this.items[itemId]);
				}
			}
		},

		restoreBasketItems: function(items)
		{
			if (!items || Object.keys(items).length === 0)
			{
				return;
			}

			var oldItemId, newItemId, basketItemNode;

			for (oldItemId in items)
			{
				if (items.hasOwnProperty(oldItemId))
				{
					newItemId = items[oldItemId];

					if (this.isItemShown(oldItemId))
					{
						this.changeShownItem(oldItemId, newItemId, true);

						basketItemNode = BX(this.ids.item + oldItemId);
						if (BX.type.isDomNode(basketItemNode))
						{
							basketItemNode.id = this.ids.item + newItemId;
							basketItemNode.setAttribute('data-id', newItemId);
						}
					}

					this.changeSortedItem(oldItemId, false, true);
				}
			}
		},

		bindBasketItemEvents: function(itemData)
		{
			if (!itemData)
				return;

			var itemNode = BX(this.ids.item + itemData.ID);
			if (BX.type.isDomNode(itemNode))
			{
				this.bindQuantityEvents(itemNode, itemData);
				this.bindSkuEvents(itemNode, itemData);
				this.bindImageEvents(itemNode, itemData);
				this.bindActionEvents(itemNode, itemData);
				this.bindRestoreAction(itemNode, itemData);
				this.bindItemWarningEvents(itemNode, itemData);
			}
		},

		bindQuantityEvents: function(node, data)
		{
			if (!node || !data || !this.isItemAvailable(data.ID))
				return;

			var entity;

			var block = this.getEntity(node, 'basket-item-quantity-block');
			if (block)
			{
				var startEventName = this.isTouch ? 'touchstart' : 'mousedown';
				var endEventName = this.isTouch ? 'touchend' : 'mouseup';

				entity = this.getEntity(block, 'basket-item-quantity-minus');
				BX.bind(entity, startEventName, BX.proxy(this.startQuantityInterval, this));
				BX.bind(entity, endEventName, BX.proxy(this.clearQuantityInterval, this));
				BX.bind(entity, 'mouseout', BX.proxy(this.clearQuantityInterval, this));
				BX.bind(entity, 'click', BX.proxy(this.quantityMinus, this));

				entity = this.getEntity(block, 'basket-item-quantity-plus');
				BX.bind(entity, startEventName, BX.proxy(this.startQuantityInterval, this));
				BX.bind(entity, endEventName, BX.proxy(this.clearQuantityInterval, this));
				BX.bind(entity, 'mouseout', BX.proxy(this.clearQuantityInterval, this));
				BX.bind(entity, 'click', BX.proxy(this.quantityPlus, this));

				entity = this.getEntity(block, 'basket-item-quantity-field');
				BX.bind(entity, 'change', BX.proxy(this.quantityChange, this));
			}
		},

		startQuantityInterval: function()
		{
			var target = BX.proxy_context;
			var func = target.getAttribute('data-entity') === 'basket-item-quantity-minus'
				? BX.proxy(this.quantityMinus, this)
				: BX.proxy(this.quantityPlus, this);

			this.quantityDelay = setTimeout(
				BX.delegate(function() {
					this.quantityTimer = setInterval(function(){func(target);}, 150);
				}, this),
				300
			);
		},

		clearQuantityInterval: function()
		{
			clearTimeout(this.quantityDelay);
			clearInterval(this.quantityTimer);
		},

		quantityPlus: function(target)
		{
			if (!BX.type.isDomNode(target))
			{
				target = BX.proxy_context;
				this.clearQuantityInterval();
			}

			var itemData = this.getItemDataByTarget(target);
			if (itemData)
			{
				var quantityField = BX(this.ids.quantity + itemData.ID);
				var isQuantityFloat = this.isQuantityFloat(itemData);

				var currentQuantity = isQuantityFloat ? parseFloat(quantityField.value) : Math.round(quantityField.value);
				var measureRatio = isQuantityFloat ? parseFloat(itemData.MEASURE_RATIO) : parseInt(itemData.MEASURE_RATIO);

				var quantity = parseFloat((currentQuantity + measureRatio).toFixed(5));
				quantity = this.getCorrectQuantity(itemData, quantity);

				this.setQuantity(itemData, quantity);
			}
		},

		quantityMinus: function(target)
		{
			target = BX.type.isDomNode(target) ? target : BX.proxy_context;

			var itemData = this.getItemDataByTarget(target);
			if (itemData)
			{
				var quantityField = BX(this.ids.quantity + itemData.ID);
				var isQuantityFloat = this.isQuantityFloat(itemData);

				var currentQuantity = isQuantityFloat ? parseFloat(quantityField.value) : Math.round(quantityField.value);
				var measureRatio = isQuantityFloat ? parseFloat(itemData.MEASURE_RATIO) : parseInt(itemData.MEASURE_RATIO);

				var quantity = parseFloat((currentQuantity - measureRatio).toFixed(5));
				quantity = this.getCorrectQuantity(itemData, quantity);

				this.setQuantity(itemData, quantity);
			}
		},

		quantityChange: function()
		{
			var itemData = this.getItemDataByTarget(BX.proxy_context);
			if (itemData)
			{
				var quantityField, quantity;

				quantityField = BX(this.ids.quantity + itemData.ID);
				quantity = this.getCorrectQuantity(itemData, quantityField.value);

				this.setQuantity(itemData, quantity);
			}
		},

		isQuantityFloat: function(item)
		{
			return this.params.QUANTITY_FLOAT === 'Y' || (parseInt(item.MEASURE_RATIO) !== parseFloat(item.MEASURE_RATIO));
		},

		getCorrectQuantity: function(itemData, quantity)
		{
			var isQuantityFloat = this.isQuantityFloat(itemData),
				measureRatio = isQuantityFloat ? parseFloat(itemData.MEASURE_RATIO) : parseInt(itemData.MEASURE_RATIO),
				availableQuantity = 0;

			quantity = (isQuantityFloat ? parseFloat(quantity) : parseInt(quantity, 10)) || 0;
			if (quantity < 0)
			{
				quantity = 0;
			}

			if (measureRatio > 0 && quantity < measureRatio)
			{
				quantity = measureRatio;
			}

			if (itemData.CHECK_MAX_QUANTITY === 'Y')
			{
				availableQuantity = isQuantityFloat ? parseFloat(itemData.AVAILABLE_QUANTITY) : parseInt(itemData.AVAILABLE_QUANTITY);
				if (availableQuantity > 0 && quantity > availableQuantity)
				{
					quantity = availableQuantity;
				}
			}

			var reminder = (quantity / measureRatio - ((quantity / measureRatio).toFixed(0))).toFixed(5),
				remain;

			if (parseFloat(reminder) === 0)
			{
				return quantity;
			}

			if (measureRatio !== 0 && measureRatio !== 1)
			{
				remain = (quantity * this.precisionFactor) % (measureRatio * this.precisionFactor) / this.precisionFactor;

				if (measureRatio > 0 && remain > 0)
				{
					if (
						remain >= measureRatio / 2
						&& (
							availableQuantity === 0
							|| (quantity + measureRatio - remain) <= availableQuantity
						)
					)
					{
						quantity += (measureRatio - remain);
					}
					else
					{
						quantity -= remain;
					}
				}
			}

			quantity = isQuantityFloat ? parseFloat(quantity) : parseInt(quantity, 10);

			return quantity;
		},

		setQuantity: function(itemData, quantity)
		{
			var quantityField = BX(this.ids.quantity + itemData.ID),
				currentQuantity;

			if (quantityField)
			{
				quantity = parseFloat(quantity);
				currentQuantity = parseFloat(quantityField.getAttribute('data-value'));

				quantityField.value = quantity;

				if (parseFloat(itemData.QUANTITY) !== parseFloat(quantity))
				{
					this.animatePriceByQuantity(itemData, quantity);
					this.actionPool.changeQuantity(itemData.ID, quantity, currentQuantity);
				}
			}
		},

		animatePriceByQuantity: function(itemData, quantity)
		{
			var priceNode = BX(this.ids.sumPrice + itemData.ID);
			if (!BX.type.isDomNode(priceNode))
				return;

			var quantityMultiplier = quantity / parseFloat(itemData.MEASURE_RATIO);

			var startPrice = parseFloat(itemData.SUM_PRICE),
				finalPrice = parseFloat(itemData.PRICE) * quantityMultiplier,
				isInt = parseInt(startPrice) === parseFloat(startPrice)
					&& parseInt(finalPrice) === parseFloat(finalPrice);

			if (startPrice !== finalPrice)
			{
				this.items[itemData.ID].QUANTITY = quantity;
				this.items[itemData.ID].SUM_PRICE = finalPrice;

				new BX.easing({
					duration: this.params.USE_PRICE_ANIMATION === 'Y' ? this.duration.priceAnimation : 1,
					start: {price: startPrice},
					finish: {price: finalPrice},
					transition: BX.easing.makeEaseOut(BX.easing.transitions.quad),
					step: BX.delegate(function(state){
						if (!isInt)
						{
							// fix price blinking
							state.price = (state.price + (state.price % 1000) / 1000).toFixed(5);
						}

						priceNode.innerHTML = this.getFormatPrice(state.price, itemData.CURRENCY);
					}, this),
					complete: BX.delegate(function() {
						var node, price;

						priceNode.innerHTML = this.getFormatPrice(finalPrice, itemData.CURRENCY);

						node = BX(this.ids.sumPriceOld + itemData.ID);
						if (BX.type.isDomNode(node))
						{
							price = parseFloat(itemData.FULL_PRICE) * quantityMultiplier;
							node.innerHTML = this.getFormatPrice(price, itemData.CURRENCY);
						}

						node = BX(this.ids.sumPriceDiff + itemData.ID);
						if (BX.type.isDomNode(node))
						{
							price = parseFloat(itemData.DISCOUNT_PRICE) * quantityMultiplier;
							node.innerHTML = this.getFormatPrice(price, itemData.CURRENCY);
						}
					}, this)
				}).animate();
			}
		},

		getItemDataByTarget: function(target)
		{
			var data = false;
			var id;

			var itemNode = BX.findParent(target, {attrs: {'data-entity': 'basket-item'}});
			if (itemNode)
			{
				id = itemNode.getAttribute('data-id');
				data = this.items[id];
			}

			return data;
		},

		bindSkuEvents: function(node, data)
		{
			if (!node || !data)
				return;

			var blocks = this.getEntities(node, 'basket-item-sku-block');
			var blockEntities, i, l, ii, ll;

			for (i = 0, l = blocks.length; i < l; i++)
			{
				blockEntities = this.getEntities(blocks[i], 'basket-item-sku-field');

				for (ii = 0, ll = blockEntities.length; ii < ll; ii++)
				{
					BX.bind(blockEntities[ii], 'click', BX.proxy(this.changeSku, this));
				}
			}
		},

		changeSku: function()
		{
			var i, l;

			var target = BX.proxy_context;

			if (BX.hasClass(target, 'selected'))
				return;

			var itemData = this.getItemDataByTarget(target);
			if (itemData)
			{
				var basketItemNode = BX(this.ids.item + itemData.ID);
				if (basketItemNode)
				{
					var currentSkuListNodes = this.getEntities(target.parentNode, 'basket-item-sku-field');
					for (i = 0, l = currentSkuListNodes.length; i < l; i++)
					{
						if (currentSkuListNodes[i].isEqualNode(target))
						{
							BX.addClass(currentSkuListNodes[i], 'selected');
						}
						else
						{
							BX.removeClass(currentSkuListNodes[i], 'selected');
						}
					}

					this.actionPool.changeSku(
						itemData.ID,
						this.getSkuPropertyValues(basketItemNode),
						this.getInitialSkuPropertyValues(basketItemNode)
					);
				}
			}
		},

		getSkuPropertyValues: function(basketItemNode)
		{
			var propertyValues = {};

			var propNodes = this.getEntities(basketItemNode, 'basket-item-sku-field', '.selected');
			for (var i = 0, l = propNodes.length; i < l; i++)
			{
				propertyValues[propNodes[i].getAttribute('data-property')] = BX.util.htmlspecialcharsback(propNodes[i].getAttribute('data-value-id'));
			}

			return propertyValues;
		},

		getInitialSkuPropertyValues: function(basketItemNode)
		{
			var propertyValues = {};

			var propNodes = this.getEntities(basketItemNode, 'basket-item-sku-field', '[data-initial="true"]');
			for (var i = 0, l = propNodes.length; i < l; i++)
			{
				propertyValues[propNodes[i].getAttribute('data-property')] = BX.util.htmlspecialcharsback(propNodes[i].getAttribute('data-value-id'));
			}

			return propertyValues;
		},

		bindImageEvents: function(node, data)
		{
			if (!node || !data)
				return;

			var images = node.querySelectorAll('.basket-item-custom-block-photo-item');
			for (var i = 0, l = images.length; i < l; i++)
			{
				BX.bind(images[i], 'click', BX.proxy(this.showPropertyImagePopup, this));
			}
		},

		showPropertyImagePopup: function()
		{
			var target, propertyCode, imageIndex, item, imageSrc, i;

			target = BX.proxy_context;
			item = this.getItemDataByTarget(target);

			propertyCode = target.getAttribute('data-column-property-code');
			imageIndex = target.getAttribute('data-image-index');

			if (item && item.COLUMN_LIST)
			{
				for (i in item.COLUMN_LIST)
				{
					if (
						item.COLUMN_LIST.hasOwnProperty(i)
						&& item.COLUMN_LIST[i].CODE === propertyCode
						&& item.COLUMN_LIST[i].VALUE[imageIndex]
					)
					{
						imageSrc = item.COLUMN_LIST[i].VALUE[imageIndex].IMAGE_SRC_ORIGINAL;
						break;
					}
				}
			}

			if (!imageSrc)
			{
				return;
			}

			if (this.imagePopup)
			{
				this.imagePopup.destroy();
			}

			var imageId = 'bx-soa-image-popup-content';
			var that = this;

			this.imagePopup = new BX.PopupWindow('bx-soa-image-popup', null, {
				lightShadow: true,
				offsetTop: 0,
				offsetLeft: 0,
				closeIcon: {top: '3px', right: '10px'},
				autoHide: true,
				bindOptions: {position: 'bottom'},
				closeByEsc: true,
				zIndex: 100,
				events: {
					onPopupShow: function() {
						BX.create('IMG', {
							props: {src: imageSrc},
							events: {
								load: function() {
									var content = BX(imageId);
									if (content)
									{
										var windowSize = BX.GetWindowInnerSize(),
											ratio = that.isMobile ? 0.5 : 0.9,
											contentHeight, contentWidth;

										BX.cleanNode(content);
										content.appendChild(this);

										contentHeight = content.offsetHeight;
										contentWidth = content.offsetWidth;

										if (contentHeight > windowSize.innerHeight * ratio)
										{
											content.style.height = windowSize.innerHeight * ratio + 'px';
											content.style.width = contentWidth * (windowSize.innerHeight * ratio / contentHeight) + 'px';
											contentHeight = content.offsetHeight;
											contentWidth = content.offsetWidth;
										}

										if (contentWidth > windowSize.innerWidth * ratio)
										{
											content.style.width = windowSize.innerWidth * ratio + 'px';
											content.style.height = contentHeight * (windowSize.innerWidth * ratio / contentWidth) + 'px';
										}

										content.style.height = content.offsetHeight + 'px';
										content.style.width = content.offsetWidth + 'px';

										that.imagePopup.adjustPosition();
									}
								}
							}
						});
					},
					onPopupClose: function() {
						this.destroy();
					}
				},
				content: BX.create('DIV', {props: {id: imageId}})
			});
			this.imagePopup.show();
		},

		bindActionEvents: function(node, data)
		{
			if (!node || !data)
				return;

			var entity;

			if (BX.util.in_array('DELETE', this.params.COLUMNS_LIST))
			{
				entity = this.getEntities(node, 'basket-item-delete');
				for (var i = 0, l = entity.length; i < l; i++)
				{
					BX.bind(entity[i], 'click', BX.proxy(this.deleteAction, this));
				}
			}

			if (BX.util.in_array('DELAY', this.params.COLUMNS_LIST))
			{
				entity = this.getEntity(node, 'basket-item-add-delayed');
				BX.bind(entity, 'click', BX.proxy(this.addDelayedAction, this));
			}

			entity = this.getEntity(node, 'basket-item-remove-delayed');
			BX.bind(entity, 'click', BX.proxy(this.removeDelayedAction, this));

			entity = this.getEntity(node, 'basket-item-merge-sku-link');
			BX.bind(entity, 'click', BX.proxy(this.mergeAction, this));

			entity = this.getEntity(node, 'basket-item-show-similar-link');
			BX.bind(entity, 'click', BX.delegate(function() {this.toggleFilter('similar');}, this));
		},

		deleteAction: function()
		{
			var itemData = this.getItemDataByTarget(BX.proxy_context);
			if (itemData)
			{
				this.actionPool.deleteItem(itemData.ID);

				this.items[itemData.ID].SHOW_LOADING = true;

				if (this.params.SHOW_RESTORE === 'Y' && this.isItemAvailable(itemData.ID))
				{
					this.items[itemData.ID].SHOW_RESTORE = true;
				}

				this.redrawBasketItemNode(itemData.ID);
			}
		},

		addDelayedAction: function()
		{
			var itemData = this.getItemDataByTarget(BX.proxy_context);
			if (itemData)
			{
				this.actionPool.addDelayed(itemData.ID);

				this.items[itemData.ID].SHOW_LOADING = true;
				this.redrawBasketItemNode(itemData.ID);
			}
		},

		removeDelayedAction: function()
		{
			var itemData = this.getItemDataByTarget(BX.proxy_context);
			if (itemData)
			{
				this.actionPool.removeDelayed(itemData.ID);

				this.items[itemData.ID].SHOW_LOADING = true;
				this.redrawBasketItemNode(itemData.ID);
			}
		},

		mergeAction: function()
		{
			var itemData = this.getItemDataByTarget(BX.proxy_context);
			if (itemData)
			{
				this.actionPool.mergeSku(itemData.ID);
			}
		},

		bindRestoreAction: function(node, itemData)
		{
			if (!node || !itemData || this.params.SHOW_RESTORE !== 'Y')
				return;

			BX.bind(
				this.getEntity(node, 'basket-item-restore-button'),
				'click',
				BX.delegate(function() {
					this.actionPool.restoreItem(itemData.ID, {
						PRODUCT_ID: itemData.PRODUCT_ID,
						QUANTITY: itemData.QUANTITY,
						PROPS: itemData.PROPS_ALL,
						SORT: itemData.SORT,
						MODULE: itemData.MODULE,
						PRODUCT_PROVIDER_CLASS: itemData.PRODUCT_PROVIDER_CLASS
					});

					this.items[itemData.ID].SHOW_RESTORE = false;
					this.items[itemData.ID].SHOW_LOADING = true;
					this.redrawBasketItemNode(itemData.ID);
				}, this)
			);
			BX.bind(
				this.getEntity(node, 'basket-item-close-restore-button'),
				'click',
				BX.delegate(function() {
					this.deleteBasketItem(itemData.ID, false, true);
				}, this)
			);
		},

		bindItemWarningEvents: function(node, data)
		{
			if (!node || !data)
				return;

			BX.bind(
				this.getEntity(BX(this.ids.item + data.ID), 'basket-item-warning-close'),
				'click',
				BX.proxy(this.closeItemWarnings, this)
			);
		},

		closeItemWarnings: function()
		{
			var target = BX.proxy_context;

			if (BX.type.isDomNode(target))
			{
				var itemData = this.getItemDataByTarget(target);

				this.items[itemData.ID].WARNINGS = [];
				this.warningItems.splice(BX.util.array_search(itemData.ID, this.warningItems), 1);

				this.redrawBasketItemNode(itemData.ID);
				this.editWarnings();
			}
		},

		renderBasketItem: function(template, data)
		{
			var clonedData = BX.clone(data);

			if (BX.type.isPlainObject(clonedData))
			{
				clonedData.USE_FILTER = this.useItemsFilter
					&& !this.filter.currentFilter.similarHash.length;
			}

			return Mustache.render(template, clonedData);
		},

		render: function(template, data)
		{
			return Mustache.render(template, data);
		},

		checkAnalytics: function(data)
		{
			if (!data || !data.basket)
				return;

			var itemId, itemsDiff = {};

			for (var i in data.basket)
			{
				if (data.basket.hasOwnProperty(i))
				{
					if (i.indexOf('QUANTITY_') >= 0)
					{
						itemId = i.substr(9);

						if (this.items[itemId])
						{
							itemsDiff[itemId] = parseFloat(data.basket[i]) - parseFloat(BX(this.ids.quantity + itemId).getAttribute('data-value'));
						}
					}
					else if (i.indexOf('DELETE_') >= 0)
					{
						itemId = i.substr(7);

						if (this.items[itemId])
						{
							itemsDiff[itemId] = -parseFloat(this.items[itemId].QUANTITY);
						}
					}
					else if (i.indexOf('RESTORE_') >= 0)
					{
						itemId = i.substr(8);

						if (this.items[itemId])
						{
							itemsDiff[itemId] = parseFloat(this.items[itemId].QUANTITY);
						}
					}
				}
			}

			this.setAnalyticsDataLayer(itemsDiff);
		},

		setAnalyticsDataLayer: function(itemsDiff)
		{
			if (!itemsDiff || Object.keys(itemsDiff).length === 0)
				return;

			window[this.params.DATA_LAYER_NAME] = window[this.params.DATA_LAYER_NAME] || [];

			var plus = [], minus = [];

			for (var itemId in itemsDiff)
			{
				if (itemsDiff.hasOwnProperty(itemId))
				{
					if (itemsDiff[itemId] > 0)
					{
						plus.push(this.getItemAnalyticsInfo(itemId, itemsDiff[itemId]));
					}
					else if (itemsDiff[itemId] < 0)
					{
						minus.push(this.getItemAnalyticsInfo(itemId, itemsDiff[itemId]));
					}
				}
			}

			if (plus.length)
			{
				window[this.params.DATA_LAYER_NAME].push({
					event: 'addToCart',
					ecommerce: {
						currencyCode: this.items[itemId].CURRENCY || '',
						add: {
							products: plus
						}
					}
				});
			}

			if (minus.length)
			{
				window[this.params.DATA_LAYER_NAME].push({
					event: 'removeFromCart',
					ecommerce: {
						currencyCode: this.items[itemId].CURRENCY || '',
						remove: {
							products: minus
						}
					}
				});
			}
		},

		getItemAnalyticsInfo: function(itemId, diff)
		{
			if (!this.items[itemId])
				return {};

			var brand = (this.items[itemId].BRAND || '').split(',  ').join('/');
			var variants = [];

			var selectedSku = this.getEntities(BX(this.ids.item + itemId), 'basket-item-sku-field', '.selected');
			for (var i = 0, l = selectedSku.length; i < l; i++)
			{
				variants.push(selectedSku[i].getAttribute('data-sku-name'));
			}

			return {
				'name': this.items[itemId].NAME || '',
				'id': this.items[itemId].PRODUCT_ID || '',
				'price': this.items[itemId].PRICE || 0,
				'brand': brand,
				'variant': variants.join('/'),
				'quantity': Math.abs(diff)
			};
		}
	};
})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:103:"/bitrix/components/bitrix/sale.products.gift.basket/templates/bootstrap_v4/script.min.js?16968612423259";s:6:"source";s:84:"/bitrix/components/bitrix/sale.products.gift.basket/templates/bootstrap_v4/script.js";s:3:"min";s:88:"/bitrix/components/bitrix/sale.products.gift.basket/templates/bootstrap_v4/script.min.js";s:3:"map";s:88:"/bitrix/components/bitrix/sale.products.gift.basket/templates/bootstrap_v4/script.map.js";}"*/
(function(){"use strict";if(!!window.JCSaleProductsGiftBasketComponent)return;window.JCSaleProductsGiftBasketComponent=function(t){this.formPosting=false;this.siteId=t.siteId||"";this.template=t.template||"";this.componentPath=t.componentPath||"";this.parameters=t.parameters||"";this.container=document.querySelector('[data-entity="'+t.container+'"]');this.currentProductId=t.currentProductId;if(t.initiallyShowHeader){BX.ready(BX.proxy(this.showHeader,this))}if(t.deferredLoad){BX.ready(BX.proxy(this.deferredLoad,this))}BX.addCustomEvent("OnBasketChange",BX.proxy(this.reloadGifts,this));BX.addCustomEvent("OnCouponApply",BX.proxy(this.reloadGifts,this))};window.JCSaleProductsGiftBasketComponent.prototype={reloadGifts:function(){this.sendRequest({action:"deferredLoad",recalculateDiscounts:"Y"})},deferredLoad:function(){this.sendRequest({action:"deferredLoad"})},sendRequest:function(t){var e={siteId:this.siteId,template:this.template,parameters:this.parameters};BX.ajax({url:this.componentPath+"/ajax.php"+(document.location.href.indexOf("clear_cache=Y")!==-1?"?clear_cache=Y":""),method:"POST",dataType:"json",timeout:60,data:BX.merge(e,t),onsuccess:BX.delegate(function(e){if(!e||!e.JS){this.hideHeader();BX.cleanNode(this.container);return}BX.ajax.processScripts(BX.processHTML(e.JS).SCRIPT,false,BX.delegate(function(){this.showAction(e,t)},this))},this)})},showAction:function(t,e){if(!e)return;switch(e.action){case"deferredLoad":this.processDeferredLoadAction(t);break}},processDeferredLoadAction:function(t){if(!t)return;this.processItems(t.items)},processItems:function(t){if(!t)return;var e=BX.processHTML(t,false),i=BX.create("DIV");var a,n,s;i.innerHTML=e.HTML;s=this.container.querySelectorAll('[data-entity="items-row"]');if(s.length){BX.cleanNode(this.container);this.showHeader(false)}else{this.showHeader(true)}a=i.querySelectorAll('[data-entity="items-row"]');for(n in a){if(a.hasOwnProperty(n)){a[n].style.opacity=0;this.container.appendChild(a[n])}}new BX.easing({duration:2e3,start:{opacity:0},finish:{opacity:100},transition:BX.easing.makeEaseOut(BX.easing.transitions.quad),step:function(t){for(var e in a){if(a.hasOwnProperty(e)){a[e].style.opacity=t.opacity/100}}},complete:function(){for(var t in a){if(a.hasOwnProperty(t)){a[t].removeAttribute("style")}}}}).animate();BX.ajax.processScripts(e.SCRIPT)},showHeader:function(t){var e=BX.findParent(this.container,{attr:{"data-entity":"parent-container"}}),i;if(e&&BX.type.isDomNode(e)){i=e.querySelector('[data-entity="header"]');if(i&&i.getAttribute("data-showed")==="false"){i.style.display="";if(t){this.animation=new BX.easing({duration:2e3,start:{opacity:0},finish:{opacity:100},transition:BX.easing.makeEaseOut(BX.easing.transitions.quad),step:function(t){i.style.opacity=t.opacity/100},complete:function(){i.removeAttribute("style");i.setAttribute("data-showed","true")}});this.animation.animate()}else{i.style.opacity=100}}}},hideHeader:function(){var t=BX.findParent(this.container,{attr:{"data-entity":"parent-container"}}),e;if(t&&BX.type.isDomNode(t)){e=t.querySelector('[data-entity="header"]');if(e){if(this.animation){this.animation.stop()}e.style.display="none";e.style.opacity=0;e.setAttribute("data-showed","false")}}}}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:91:"/bitrix/components/bitrix/catalog.item/templates/bootstrap_v4/script.min.js?169686116341337";s:6:"source";s:71:"/bitrix/components/bitrix/catalog.item/templates/bootstrap_v4/script.js";s:3:"min";s:75:"/bitrix/components/bitrix/catalog.item/templates/bootstrap_v4/script.min.js";s:3:"map";s:75:"/bitrix/components/bitrix/catalog.item/templates/bootstrap_v4/script.map.js";}"*/
(function(t){"use strict";if(t.JCCatalogItem)return;var i=function(t){i.superclass.constructor.apply(this,arguments);this.buttonNode=BX.create("button",{props:{className:"btn btn-primary btn-buy btn-sm",id:this.id},style:typeof t.style==="object"?t.style:{},text:t.text,events:this.contextEvents});if(BX.browser.IsIE()){this.buttonNode.setAttribute("hideFocus","hidefocus")}};BX.extend(i,BX.PopupWindowButton);t.JCCatalogItem=function(t){this.productType=0;this.showQuantity=true;this.showAbsent=true;this.secondPict=false;this.showOldPrice=false;this.showMaxQuantity="N";this.relativeQuantityFactor=5;this.showPercent=false;this.showSkuProps=false;this.basketAction="ADD";this.showClosePopup=false;this.useCompare=false;this.showSubscription=false;this.visual={ID:"",PICT_ID:"",SECOND_PICT_ID:"",PICT_SLIDER_ID:"",QUANTITY_ID:"",QUANTITY_UP_ID:"",QUANTITY_DOWN_ID:"",PRICE_ID:"",PRICE_OLD_ID:"",DSC_PERC:"",SECOND_DSC_PERC:"",DISPLAY_PROP_DIV:"",BASKET_PROP_DIV:"",SUBSCRIBE_ID:""};this.product={checkQuantity:false,maxQuantity:0,stepQuantity:1,isDblQuantity:false,canBuy:true,name:"",pict:{},id:0,addUrl:"",buyUrl:""};this.basketMode="";this.basketData={useProps:false,emptyProps:false,quantity:"quantity",props:"prop",basketUrl:"",sku_props:"",sku_props_var:"basket_props",add_url:"",buy_url:""};this.compareData={compareUrl:"",compareDeleteUrl:"",comparePath:""};this.defaultPict={pict:null,secondPict:null};this.defaultSliderOptions={interval:3e3,wrap:true};this.slider={options:{},items:[],active:null,sliding:null,paused:null,interval:null,progress:null};this.touch=null;this.quantityDelay=null;this.quantityTimer=null;this.checkQuantity=false;this.maxQuantity=0;this.minQuantity=0;this.stepQuantity=1;this.isDblQuantity=false;this.canBuy=true;this.precision=6;this.precisionFactor=Math.pow(10,this.precision);this.bigData=false;this.fullDisplayMode=false;this.viewMode="";this.templateTheme="";this.currentPriceMode="";this.currentPrices=[];this.currentPriceSelected=0;this.currentQuantityRanges=[];this.currentQuantityRangeSelected=0;this.offers=[];this.offerNum=0;this.treeProps=[];this.selectedValues={};this.obProduct=null;this.blockNodes={};this.obQuantity=null;this.obQuantityUp=null;this.obQuantityDown=null;this.obQuantityLimit={};this.obPict=null;this.obSecondPict=null;this.obPictSlider=null;this.obPictSliderIndicator=null;this.obPrice=null;this.obTree=null;this.obBuyBtn=null;this.obBasketActions=null;this.obNotAvail=null;this.obSubscribe=null;this.obDscPerc=null;this.obSecondDscPerc=null;this.obSkuProps=null;this.obMeasure=null;this.obCompare=null;this.obPopupWin=null;this.basketUrl="";this.basketParams={};this.isTouchDevice=BX.hasClass(document.documentElement,"bx-touch");this.hoverTimer=null;this.hoverStateChangeForbidden=false;this.mouseX=null;this.mouseY=null;this.useEnhancedEcommerce=false;this.dataLayerName="dataLayer";this.brandProperty=false;this.errorCode=0;if(typeof t==="object"){if(t.PRODUCT_TYPE){this.productType=parseInt(t.PRODUCT_TYPE,10)}this.showQuantity=t.SHOW_QUANTITY;this.showAbsent=t.SHOW_ABSENT;this.secondPict=t.SECOND_PICT;this.showOldPrice=t.SHOW_OLD_PRICE;this.showMaxQuantity=t.SHOW_MAX_QUANTITY;this.relativeQuantityFactor=parseInt(t.RELATIVE_QUANTITY_FACTOR);this.showPercent=t.SHOW_DISCOUNT_PERCENT;this.showSkuProps=t.SHOW_SKU_PROPS;this.showSubscription=t.USE_SUBSCRIBE;if(t.ADD_TO_BASKET_ACTION){this.basketAction=t.ADD_TO_BASKET_ACTION}this.showClosePopup=t.SHOW_CLOSE_POPUP;this.useCompare=t.DISPLAY_COMPARE;this.fullDisplayMode=t.PRODUCT_DISPLAY_MODE==="Y";this.bigData=t.BIG_DATA;this.viewMode=t.VIEW_MODE||"";this.templateTheme=t.TEMPLATE_THEME||"";this.useEnhancedEcommerce=t.USE_ENHANCED_ECOMMERCE==="Y";this.dataLayerName=t.DATA_LAYER_NAME;this.brandProperty=t.BRAND_PROPERTY;this.visual=t.VISUAL;switch(this.productType){case 0:case 1:case 2:case 7:if(t.PRODUCT&&typeof t.PRODUCT==="object"){this.currentPriceMode=t.PRODUCT.ITEM_PRICE_MODE;this.currentPrices=t.PRODUCT.ITEM_PRICES;this.currentPriceSelected=t.PRODUCT.ITEM_PRICE_SELECTED;this.currentQuantityRanges=t.PRODUCT.ITEM_QUANTITY_RANGES;this.currentQuantityRangeSelected=t.PRODUCT.ITEM_QUANTITY_RANGE_SELECTED;if(this.showQuantity){this.product.checkQuantity=t.PRODUCT.CHECK_QUANTITY;this.product.isDblQuantity=t.PRODUCT.QUANTITY_FLOAT;if(this.product.checkQuantity){this.product.maxQuantity=this.product.isDblQuantity?parseFloat(t.PRODUCT.MAX_QUANTITY):parseInt(t.PRODUCT.MAX_QUANTITY,10)}this.product.stepQuantity=this.product.isDblQuantity?parseFloat(t.PRODUCT.STEP_QUANTITY):parseInt(t.PRODUCT.STEP_QUANTITY,10);this.checkQuantity=this.product.checkQuantity;this.isDblQuantity=this.product.isDblQuantity;this.stepQuantity=this.product.stepQuantity;this.maxQuantity=this.product.maxQuantity;this.minQuantity=this.currentPriceMode==="Q"?parseFloat(this.currentPrices[this.currentPriceSelected].MIN_QUANTITY):this.stepQuantity;if(this.isDblQuantity){this.stepQuantity=Math.round(this.stepQuantity*this.precisionFactor)/this.precisionFactor}}this.product.canBuy=t.PRODUCT.CAN_BUY;if(t.PRODUCT.MORE_PHOTO_COUNT){this.product.morePhotoCount=t.PRODUCT.MORE_PHOTO_COUNT;this.product.morePhoto=t.PRODUCT.MORE_PHOTO}if(t.PRODUCT.RCM_ID){this.product.rcmId=t.PRODUCT.RCM_ID}this.canBuy=this.product.canBuy;this.product.name=t.PRODUCT.NAME;this.product.pict=t.PRODUCT.PICT;this.product.id=t.PRODUCT.ID;this.product.DETAIL_PAGE_URL=t.PRODUCT.DETAIL_PAGE_URL;if(t.PRODUCT.ADD_URL){this.product.addUrl=t.PRODUCT.ADD_URL}if(t.PRODUCT.BUY_URL){this.product.buyUrl=t.PRODUCT.BUY_URL}if(t.BASKET&&typeof t.BASKET==="object"){this.basketData.useProps=t.BASKET.ADD_PROPS;this.basketData.emptyProps=t.BASKET.EMPTY_PROPS}}else{this.errorCode=-1}break;case 3:if(t.PRODUCT&&typeof t.PRODUCT==="object"){this.product.name=t.PRODUCT.NAME;this.product.id=t.PRODUCT.ID;this.product.DETAIL_PAGE_URL=t.PRODUCT.DETAIL_PAGE_URL;this.product.morePhotoCount=t.PRODUCT.MORE_PHOTO_COUNT;this.product.morePhoto=t.PRODUCT.MORE_PHOTO;if(t.PRODUCT.RCM_ID){this.product.rcmId=t.PRODUCT.RCM_ID}}if(t.OFFERS&&BX.type.isArray(t.OFFERS)){this.offers=t.OFFERS;this.offerNum=0;if(t.OFFER_SELECTED){this.offerNum=parseInt(t.OFFER_SELECTED,10)}if(isNaN(this.offerNum)){this.offerNum=0}if(t.TREE_PROPS){this.treeProps=t.TREE_PROPS}if(t.DEFAULT_PICTURE){this.defaultPict.pict=t.DEFAULT_PICTURE.PICTURE;this.defaultPict.secondPict=t.DEFAULT_PICTURE.PICTURE_SECOND}}break;default:this.errorCode=-1}if(t.BASKET&&typeof t.BASKET==="object"){if(t.BASKET.QUANTITY){this.basketData.quantity=t.BASKET.QUANTITY}if(t.BASKET.PROPS){this.basketData.props=t.BASKET.PROPS}if(t.BASKET.BASKET_URL){this.basketData.basketUrl=t.BASKET.BASKET_URL}if(3===this.productType){if(t.BASKET.SKU_PROPS){this.basketData.sku_props=t.BASKET.SKU_PROPS}}if(t.BASKET.ADD_URL_TEMPLATE){this.basketData.add_url=t.BASKET.ADD_URL_TEMPLATE}if(t.BASKET.BUY_URL_TEMPLATE){this.basketData.buy_url=t.BASKET.BUY_URL_TEMPLATE}if(this.basketData.add_url===""&&this.basketData.buy_url===""){this.errorCode=-1024}}if(this.useCompare){if(t.COMPARE&&typeof t.COMPARE==="object"){if(t.COMPARE.COMPARE_PATH){this.compareData.comparePath=t.COMPARE.COMPARE_PATH}if(t.COMPARE.COMPARE_URL_TEMPLATE){this.compareData.compareUrl=t.COMPARE.COMPARE_URL_TEMPLATE}else{this.useCompare=false}if(t.COMPARE.COMPARE_DELETE_URL_TEMPLATE){this.compareData.compareDeleteUrl=t.COMPARE.COMPARE_DELETE_URL_TEMPLATE}else{this.useCompare=false}}else{this.useCompare=false}}this.isFacebookConversionCustomizeProductEventEnabled=t.IS_FACEBOOK_CONVERSION_CUSTOMIZE_PRODUCT_EVENT_ENABLED}if(this.errorCode===0){BX.ready(BX.delegate(this.init,this))}};t.JCCatalogItem.prototype={init:function(){var t=0,i=null;this.obProduct=BX(this.visual.ID);if(!this.obProduct){this.errorCode=-1}this.obPict=BX(this.visual.PICT_ID);if(!this.obPict){this.errorCode=-2}if(this.secondPict&&this.visual.SECOND_PICT_ID){this.obSecondPict=BX(this.visual.SECOND_PICT_ID)}this.obPictSlider=BX(this.visual.PICT_SLIDER_ID);this.obPictSliderIndicator=BX(this.visual.PICT_SLIDER_ID+"_indicator");this.obPictSliderProgressBar=BX(this.visual.PICT_SLIDER_ID+"_progress_bar");if(!this.obPictSlider){this.errorCode=-4}this.obPrice=BX(this.visual.PRICE_ID);this.obPriceOld=BX(this.visual.PRICE_OLD_ID);this.obPriceTotal=BX(this.visual.PRICE_TOTAL_ID);if(!this.obPrice){this.errorCode=-16}if(this.showQuantity&&this.visual.QUANTITY_ID){this.obQuantity=BX(this.visual.QUANTITY_ID);this.blockNodes.quantity=this.obProduct.querySelector('[data-entity="quantity-block"]');if(!this.isTouchDevice){BX.bind(this.obQuantity,"focus",BX.proxy(this.onFocus,this));BX.bind(this.obQuantity,"blur",BX.proxy(this.onBlur,this))}if(this.visual.QUANTITY_UP_ID){this.obQuantityUp=BX(this.visual.QUANTITY_UP_ID)}if(this.visual.QUANTITY_DOWN_ID){this.obQuantityDown=BX(this.visual.QUANTITY_DOWN_ID)}}if(this.visual.QUANTITY_LIMIT&&this.showMaxQuantity!=="N"){this.obQuantityLimit.all=BX(this.visual.QUANTITY_LIMIT);if(this.obQuantityLimit.all){this.obQuantityLimit.value=this.obQuantityLimit.all.querySelector('[data-entity="quantity-limit-value"]');if(!this.obQuantityLimit.value){this.obQuantityLimit.all=null}}}if(this.productType===3&&this.fullDisplayMode){if(this.visual.TREE_ID){this.obTree=BX(this.visual.TREE_ID);if(!this.obTree){this.errorCode=-256}}if(this.visual.QUANTITY_MEASURE){this.obMeasure=BX(this.visual.QUANTITY_MEASURE)}}this.obBasketActions=BX(this.visual.BASKET_ACTIONS_ID);if(this.obBasketActions){if(this.visual.BUY_ID){this.obBuyBtn=BX(this.visual.BUY_ID)}}this.obNotAvail=BX(this.visual.NOT_AVAILABLE_MESS);if(this.showSubscription){this.obSubscribe=BX(this.visual.SUBSCRIBE_ID)}if(this.showPercent){if(this.visual.DSC_PERC){this.obDscPerc=BX(this.visual.DSC_PERC)}if(this.secondPict&&this.visual.SECOND_DSC_PERC){this.obSecondDscPerc=BX(this.visual.SECOND_DSC_PERC)}}if(this.showSkuProps){if(this.visual.DISPLAY_PROP_DIV){this.obSkuProps=BX(this.visual.DISPLAY_PROP_DIV)}}if(this.errorCode===0){if(this.isTouchDevice){BX.bind(this.obPictSlider,"touchstart",BX.proxy(this.touchStartEvent,this));BX.bind(this.obPictSlider,"touchend",BX.proxy(this.touchEndEvent,this));BX.bind(this.obPictSlider,"touchcancel",BX.proxy(this.touchEndEvent,this))}else{if(this.viewMode==="CARD"){BX.bind(this.obProduct,"mouseenter",BX.proxy(this.hoverOn,this));BX.bind(this.obProduct,"mouseleave",BX.proxy(this.hoverOff,this))}BX.bind(this.obProduct,"mouseenter",BX.proxy(this.cycleSlider,this));BX.bind(this.obProduct,"mouseleave",BX.proxy(this.stopSlider,this))}if(this.bigData){var e=BX.findChildren(this.obProduct,{tag:"a"},true);if(e){for(t in e){if(e.hasOwnProperty(t)){if(e[t].getAttribute("href")==this.product.DETAIL_PAGE_URL){BX.bind(e[t],"click",BX.proxy(this.rememberProductRecommendation,this))}}}}}if(this.showQuantity){var s=this.isTouchDevice?"touchstart":"mousedown";var r=this.isTouchDevice?"touchend":"mouseup";if(this.obQuantityUp){BX.bind(this.obQuantityUp,s,BX.proxy(this.startQuantityInterval,this));BX.bind(this.obQuantityUp,r,BX.proxy(this.clearQuantityInterval,this));BX.bind(this.obQuantityUp,"mouseout",BX.proxy(this.clearQuantityInterval,this));BX.bind(this.obQuantityUp,"click",BX.delegate(this.quantityUp,this))}if(this.obQuantityDown){BX.bind(this.obQuantityDown,s,BX.proxy(this.startQuantityInterval,this));BX.bind(this.obQuantityDown,r,BX.proxy(this.clearQuantityInterval,this));BX.bind(this.obQuantityDown,"mouseout",BX.proxy(this.clearQuantityInterval,this));BX.bind(this.obQuantityDown,"click",BX.delegate(this.quantityDown,this))}if(this.obQuantity){BX.bind(this.obQuantity,"change",BX.delegate(this.quantityChange,this))}}switch(this.productType){case 0:case 1:case 2:case 7:if(parseInt(this.product.morePhotoCount)>1&&this.obPictSlider){this.initializeSlider()}this.checkQuantityControls();break;case 3:if(this.offers.length>0&&this.obTree){i=BX.findChildren(this.obTree,{tagName:"li"},true);if(i&&i.length){for(t=0;t<i.length;t++){BX.bind(i[t],"click",BX.delegate(this.selectOfferProp,this))}}this.setCurrent()}else if(parseInt(this.product.morePhotoCount)>1&&this.obPictSlider){this.initializeSlider()}break}if(this.obBuyBtn){if(this.basketAction==="ADD"){BX.bind(this.obBuyBtn,"click",BX.proxy(this.add2Basket,this))}else{BX.bind(this.obBuyBtn,"click",BX.proxy(this.buyBasket,this))}}if(this.useCompare){this.obCompare=BX(this.visual.COMPARE_LINK_ID);if(this.obCompare){BX.bind(this.obCompare,"click",BX.proxy(this.compare,this))}BX.addCustomEvent("onCatalogDeleteCompare",BX.proxy(this.checkDeletedCompare,this))}}},setAnalyticsDataLayer:function(i){if(!this.useEnhancedEcommerce||!this.dataLayerName)return;var e={},s={},r=[],a,o,h,n,l,u;switch(this.productType){case 0:case 1:case 2:case 7:e={id:this.product.id,name:this.product.name,price:this.currentPrices[this.currentPriceSelected]&&this.currentPrices[this.currentPriceSelected].PRICE,brand:BX.type.isArray(this.brandProperty)?this.brandProperty.join("/"):this.brandProperty};break;case 3:for(a in this.offers[this.offerNum].TREE){if(this.offers[this.offerNum].TREE.hasOwnProperty(a)){n=a.substring(5);l=this.offers[this.offerNum].TREE[a];for(o in this.treeProps){if(this.treeProps.hasOwnProperty(o)&&this.treeProps[o].ID==n){for(h in this.treeProps[o].VALUES){u=this.treeProps[o].VALUES[h];if(u.ID==l){r.push(u.NAME);break}}}}}}e={id:this.offers[this.offerNum].ID,name:this.offers[this.offerNum].NAME,price:this.currentPrices[this.currentPriceSelected]&&this.currentPrices[this.currentPriceSelected].PRICE,brand:BX.type.isArray(this.brandProperty)?this.brandProperty.join("/"):this.brandProperty,variant:r.join("/")};break}switch(i){case"addToCart":s={ecommerce:{currencyCode:this.currentPrices[this.currentPriceSelected]&&this.currentPrices[this.currentPriceSelected].CURRENCY||"",add:{products:[{name:e.name||"",id:e.id||"",price:e.price||0,brand:e.brand||"",category:e.category||"",variant:e.variant||"",quantity:this.showQuantity&&this.obQuantity?this.obQuantity.value:1}]}}};break}t[this.dataLayerName]=t[this.dataLayerName]||[];t[this.dataLayerName].push(s)},hoverOn:function(t){clearTimeout(this.hoverTimer);this.obProduct.style.height=getComputedStyle(this.obProduct).height;BX.addClass(this.obProduct,"hover");BX.PreventDefault(t)},hoverOff:function(t){if(this.hoverStateChangeForbidden)return;BX.removeClass(this.obProduct,"hover");this.hoverTimer=setTimeout(BX.delegate((function(){this.obProduct.style.height="auto"}),this),300);BX.PreventDefault(t)},onFocus:function(){this.hoverStateChangeForbidden=true;BX.bind(document,"mousemove",BX.proxy(this.captureMousePosition,this))},onBlur:function(){this.hoverStateChangeForbidden=false;BX.unbind(document,"mousemove",BX.proxy(this.captureMousePosition,this));var t=document.elementFromPoint(this.mouseX,this.mouseY);if(!t||!this.obProduct.contains(t)){this.hoverOff()}},captureMousePosition:function(t){this.mouseX=t.clientX;this.mouseY=t.clientY},getCookie:function(t){var i=document.cookie.match(new RegExp("(?:^|; )"+t.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g,"\\$1")+"=([^;]*)"));return i?decodeURIComponent(i[1]):null},rememberProductRecommendation:function(){var t=BX.cookie_prefix+"_RCM_PRODUCT_LOG",i=this.getCookie(t),e=false;var s=[],r;if(i){s=i.split(".")}var a=s.length;while(a--){r=s[a].split("-");if(r[0]==this.product.id){r=s[a].split("-");r[1]=this.product.rcmId;r[2]=BX.current_server_time;s[a]=r.join("-");e=true}else{if(BX.current_server_time-r[2]>3600*24*30){s.splice(a,1)}}}if(!e){s.push([this.product.id,this.product.rcmId,BX.current_server_time].join("-"))}var o=s.join("."),h=new Date((new Date).getTime()+1e3*3600*24*365*10).toUTCString();document.cookie=t+"="+o+"; path=/; expires="+h+"; domain="+BX.cookie_domain},startQuantityInterval:function(){var t=BX.proxy_context;var i=t.id===this.visual.QUANTITY_DOWN_ID?BX.proxy(this.quantityDown,this):BX.proxy(this.quantityUp,this);this.quantityDelay=setTimeout(BX.delegate((function(){this.quantityTimer=setInterval(i,150)}),this),300)},clearQuantityInterval:function(){clearTimeout(this.quantityDelay);clearInterval(this.quantityTimer)},quantityUp:function(){var t=0,i=true;if(this.errorCode===0&&this.showQuantity&&this.canBuy){t=this.isDblQuantity?parseFloat(this.obQuantity.value):parseInt(this.obQuantity.value,10);if(!isNaN(t)){t+=this.stepQuantity;if(this.checkQuantity){if(t>this.maxQuantity){i=false}}if(i){if(this.isDblQuantity){t=Math.round(t*this.precisionFactor)/this.precisionFactor}this.obQuantity.value=t;this.setPrice()}}}},quantityDown:function(){var t=0,i=true;if(this.errorCode===0&&this.showQuantity&&this.canBuy){t=this.isDblQuantity?parseFloat(this.obQuantity.value):parseInt(this.obQuantity.value,10);if(!isNaN(t)){t-=this.stepQuantity;this.checkPriceRange(t);if(t<this.minQuantity){i=false}if(i){if(this.isDblQuantity){t=Math.round(t*this.precisionFactor)/this.precisionFactor}this.obQuantity.value=t;this.setPrice()}}}},quantityChange:function(){var t=0,i;if(this.errorCode===0&&this.showQuantity){if(this.canBuy){t=this.isDblQuantity?parseFloat(this.obQuantity.value):Math.round(this.obQuantity.value);if(!isNaN(t)){if(this.checkQuantity){if(t>this.maxQuantity){t=this.maxQuantity}}this.checkPriceRange(t);i=Math.floor(Math.round(t*this.precisionFactor/this.stepQuantity)/this.precisionFactor)||1;t=i<=1?this.stepQuantity:i*this.stepQuantity;t=Math.round(t*this.precisionFactor)/this.precisionFactor;if(t<this.minQuantity){t=this.minQuantity}this.obQuantity.value=t}else{this.obQuantity.value=this.minQuantity}}else{this.obQuantity.value=this.minQuantity}this.setPrice()}},quantitySet:function(t){var i,e;var s=this.offers[t],r=this.offers[this.offerNum];if(this.errorCode===0){this.canBuy=s.CAN_BUY;this.currentPriceMode=s.ITEM_PRICE_MODE;this.currentPrices=s.ITEM_PRICES;this.currentPriceSelected=s.ITEM_PRICE_SELECTED;this.currentQuantityRanges=s.ITEM_QUANTITY_RANGES;this.currentQuantityRangeSelected=s.ITEM_QUANTITY_RANGE_SELECTED;if(this.canBuy){if(this.blockNodes.quantity){BX.style(this.blockNodes.quantity,"display","")}if(this.obBasketActions){BX.style(this.obBasketActions,"display","")}if(this.obNotAvail){BX.style(this.obNotAvail,"display","none")}if(this.obSubscribe){BX.style(this.obSubscribe,"display","none")}}else{if(this.blockNodes.quantity){BX.style(this.blockNodes.quantity,"display","none")}if(this.obBasketActions){BX.style(this.obBasketActions,"display","none")}if(this.obNotAvail){BX.style(this.obNotAvail,"display","")}if(this.obSubscribe){if(s.CATALOG_SUBSCRIBE==="Y"){BX.style(this.obSubscribe,"display","");this.obSubscribe.setAttribute("data-item",s.ID);BX(this.visual.SUBSCRIBE_ID+"_hidden").click()}else{BX.style(this.obSubscribe,"display","none")}}}this.isDblQuantity=s.QUANTITY_FLOAT;this.checkQuantity=s.CHECK_QUANTITY;if(this.isDblQuantity){this.stepQuantity=Math.round(parseFloat(s.STEP_QUANTITY)*this.precisionFactor)/this.precisionFactor;this.maxQuantity=parseFloat(s.MAX_QUANTITY);this.minQuantity=this.currentPriceMode==="Q"?parseFloat(this.currentPrices[this.currentPriceSelected].MIN_QUANTITY):this.stepQuantity}else{this.stepQuantity=parseInt(s.STEP_QUANTITY,10);this.maxQuantity=parseInt(s.MAX_QUANTITY,10);this.minQuantity=this.currentPriceMode==="Q"?parseInt(this.currentPrices[this.currentPriceSelected].MIN_QUANTITY):this.stepQuantity}if(this.showQuantity){var a=r.ITEM_PRICES.length&&r.ITEM_PRICES[r.ITEM_PRICE_SELECTED]&&r.ITEM_PRICES[r.ITEM_PRICE_SELECTED].MIN_QUANTITY!=this.minQuantity;if(this.isDblQuantity){i=Math.round(parseFloat(r.STEP_QUANTITY)*this.precisionFactor)/this.precisionFactor!==this.stepQuantity||a||r.MEASURE!==s.MEASURE||this.checkQuantity&&parseFloat(r.MAX_QUANTITY)>this.maxQuantity&&parseFloat(this.obQuantity.value)>this.maxQuantity}else{i=parseInt(r.STEP_QUANTITY,10)!==this.stepQuantity||a||r.MEASURE!==s.MEASURE||this.checkQuantity&&parseInt(r.MAX_QUANTITY,10)>this.maxQuantity&&parseInt(this.obQuantity.value,10)>this.maxQuantity}this.obQuantity.disabled=!this.canBuy;if(i){this.obQuantity.value=this.minQuantity}if(this.obMeasure){if(s.MEASURE){BX.adjust(this.obMeasure,{html:s.MEASURE})}else{BX.adjust(this.obMeasure,{html:""})}}}if(this.obQuantityLimit.all){if(!this.checkQuantity||this.maxQuantity==0){BX.adjust(this.obQuantityLimit.value,{html:""});BX.adjust(this.obQuantityLimit.all,{style:{display:"none"}})}else{if(this.showMaxQuantity==="M"){e=this.maxQuantity/this.stepQuantity>=this.relativeQuantityFactor?BX.message("RELATIVE_QUANTITY_MANY"):BX.message("RELATIVE_QUANTITY_FEW")}else{e=this.maxQuantity;if(s.MEASURE){e+=" "+s.MEASURE}}BX.adjust(this.obQuantityLimit.value,{html:e});BX.adjust(this.obQuantityLimit.all,{style:{display:""}})}}}},initializeSlider:function(){var t=this.obPictSlider.getAttribute("data-slider-wrap");if(t){this.slider.options.wrap=t==="true"}else{this.slider.options.wrap=this.defaultSliderOptions.wrap}if(this.isTouchDevice){this.slider.options.interval=false}else{this.slider.options.interval=parseInt(this.obPictSlider.getAttribute("data-slider-interval"))||this.defaultSliderOptions.interval;if(this.slider.options.interval<700){this.slider.options.interval=700}if(this.obPictSliderIndicator){var i=this.obPictSliderIndicator.querySelectorAll("[data-go-to]");for(var e in i){if(i.hasOwnProperty(e)){BX.bind(i[e],"click",BX.proxy(this.sliderClickHandler,this))}}}if(this.obPictSliderProgressBar){if(this.slider.progress){this.resetProgress();this.cycleSlider()}else{this.slider.progress=new BX.easing({transition:BX.easing.transitions.linear,step:BX.delegate((function(t){this.obPictSliderProgressBar.style.width=t.width/10+"%"}),this)})}}}},checkTouch:function(t){if(!t||!t.changedTouches)return false;return t.changedTouches[0].identifier===this.touch.identifier},touchStartEvent:function(t){if(t.touches.length!=1)return;this.touch=t.changedTouches[0]},touchEndEvent:function(t){if(!this.checkTouch(t))return;var i=this.touch.pageX-t.changedTouches[0].pageX,e=this.touch.pageY-t.changedTouches[0].pageY;if(Math.abs(i)>=Math.abs(e)+10){if(i>0){this.slideNext()}if(i<0){this.slidePrev()}}},sliderClickHandler:function(t){var i=BX.getEventTarget(t),e=i.getAttribute("data-go-to");if(e){this.slideTo(e)}BX.PreventDefault(t)},slideNext:function(){if(this.slider.sliding)return;return this.slide("next")},slidePrev:function(){if(this.slider.sliding)return;return this.slide("prev")},slideTo:function(t){this.slider.active=BX.findChild(this.obPictSlider,{className:"item active"},true,false);this.slider.progress&&(this.slider.interval=true);var i=this.getItemIndex(this.slider.active);if(t>this.slider.items.length-1||t<0)return;if(this.slider.sliding)return false;if(i==t){this.stopSlider();this.cycleSlider();return}return this.slide(t>i?"next":"prev",this.eq(this.slider.items,t))},slide:function(t,i){var e=BX.findChild(this.obPictSlider,{className:"item active"},true,false),s=this.slider.interval,r=t==="next"?"left":"right";i=i||this.getItemForDirection(t,e);if(BX.hasClass(i,"active")){return this.slider.sliding=false}this.slider.sliding=true;s&&this.stopSlider();if(this.obPictSliderIndicator){BX.removeClass(this.obPictSliderIndicator.querySelector(".active"),"active");var a=this.obPictSliderIndicator.querySelectorAll("[data-go-to]")[this.getItemIndex(i)];a&&BX.addClass(a,"active")}if(BX.hasClass(this.obPictSlider,"slide")&&!BX.browser.IsIE()){var o=this;BX.addClass(i,t);i.offsetWidth;BX.addClass(e,r);BX.addClass(i,r);setTimeout((function(){BX.addClass(i,"active");BX.removeClass(e,"active");BX.removeClass(e,r);BX.removeClass(i,t);BX.removeClass(i,r);o.slider.sliding=false}),700)}else{BX.addClass(i,"active");this.slider.sliding=false}this.obPictSliderProgressBar&&this.resetProgress();s&&this.cycleSlider()},stopSlider:function(t){t||(this.slider.paused=true);this.slider.interval&&clearInterval(this.slider.interval);if(this.slider.progress){this.slider.progress.stop();var i=parseInt(this.obPictSliderProgressBar.style.width);this.slider.progress.options.duration=this.slider.options.interval*i/200;this.slider.progress.options.start={width:i*10};this.slider.progress.options.finish={width:0};this.slider.progress.options.complete=null;this.slider.progress.animate()}},cycleSlider:function(t){t||(this.slider.paused=false);this.slider.interval&&clearInterval(this.slider.interval);if(this.slider.options.interval&&!this.slider.paused){if(this.slider.progress){this.slider.progress.stop();var i=parseInt(this.obPictSliderProgressBar.style.width);this.slider.progress.options.duration=this.slider.options.interval*(100-i)/100;this.slider.progress.options.start={width:i*10};this.slider.progress.options.finish={width:1e3};this.slider.progress.options.complete=BX.delegate((function(){this.slider.interval=true;this.slideNext()}),this);this.slider.progress.animate()}else{this.slider.interval=setInterval(BX.proxy(this.slideNext,this),this.slider.options.interval)}}},resetProgress:function(){this.slider.progress&&this.slider.progress.stop();this.obPictSliderProgressBar.style.width=0},getItemForDirection:function(t,i){var e=this.getItemIndex(i),s=t==="prev"&&e===0||t==="next"&&e==this.slider.items.length-1;if(s&&!this.slider.options.wrap)return i;var r=t==="prev"?-1:1,a=(e+r)%this.slider.items.length;return this.eq(this.slider.items,a)},getItemIndex:function(t){this.slider.items=BX.findChildren(t.parentNode,{className:"item"},true);return this.slider.items.indexOf(t||this.slider.active)},eq:function(t,i){var e=t.length,s=+i+(i<0?e:0);return s>=0&&s<e?t[s]:{}},selectOfferProp:function(){var t=0,i="",e="",s=[],r=null,a=BX.proxy_context;if(a&&a.hasAttribute("data-treevalue")){if(BX.hasClass(a,"selected"))return;e=a.getAttribute("data-treevalue");s=e.split("_");if(this.searchOfferPropIndex(s[0],s[1])){r=BX.findChildren(a.parentNode,{tagName:"li"},false);if(r&&0<r.length){for(t=0;t<r.length;t++){i=r[t].getAttribute("data-onevalue");if(i===s[1]){BX.addClass(r[t],"selected")}else{BX.removeClass(r[t],"selected")}}}if(this.isFacebookConversionCustomizeProductEventEnabled&&BX.Type.isArrayFilled(this.offers)&&BX.Type.isObject(this.offers[this.offerNum])){BX.ajax.runAction("sale.facebookconversion.customizeProduct",{data:{offerId:this.offers[this.offerNum]["ID"]}})}}}},searchOfferPropIndex:function(t,i){var e="",s=false,r,a,o=[],h=[],n=-1,l={},u=[];for(r=0;r<this.treeProps.length;r++){if(this.treeProps[r].ID===t){n=r;break}}if(-1<n){for(r=0;r<n;r++){e="PROP_"+this.treeProps[r].ID;l[e]=this.selectedValues[e]}e="PROP_"+this.treeProps[n].ID;s=this.getRowValues(l,e);if(!s){return false}if(!BX.util.in_array(i,s)){return false}l[e]=i;for(r=n+1;r<this.treeProps.length;r++){e="PROP_"+this.treeProps[r].ID;s=this.getRowValues(l,e);if(!s){return false}h=[];if(this.showAbsent){o=[];u=[];u=BX.clone(l,true);for(a=0;a<s.length;a++){u[e]=s[a];h[h.length]=s[a];if(this.getCanBuy(u))o[o.length]=s[a]}}else{o=s}if(this.selectedValues[e]&&BX.util.in_array(this.selectedValues[e],o)){l[e]=this.selectedValues[e]}else{if(this.showAbsent)l[e]=o.length>0?o[0]:h[0];else l[e]=o[0]}this.updateRow(r,l[e],s,o)}this.selectedValues=l;this.changeInfo()}return true},updateRow:function(t,i,e,s){var r=0,a="",o=false,h=null;var n=this.obTree.querySelectorAll('[data-entity="sku-line-block"]'),l;if(t>-1&&t<n.length){l=n[t].querySelector("ul");h=BX.findChildren(l,{tagName:"li"},false);if(h&&0<h.length){for(r=0;r<h.length;r++){a=h[r].getAttribute("data-onevalue");o=a===i;if(o){BX.addClass(h[r],"selected")}else{BX.removeClass(h[r],"selected")}if(BX.util.in_array(a,s)){BX.removeClass(h[r],"notallowed")}else{BX.addClass(h[r],"notallowed")}h[r].style.display=BX.util.in_array(a,e)?"":"none";if(o){n[t].style.display=a==0&&s.length==1?"none":""}}}}},getRowValues:function(t,i){var e=0,s,r=[],a=false,o=true;if(0===t.length){for(e=0;e<this.offers.length;e++){if(!BX.util.in_array(this.offers[e].TREE[i],r)){r[r.length]=this.offers[e].TREE[i]}}a=true}else{for(e=0;e<this.offers.length;e++){o=true;for(s in t){if(t[s]!==this.offers[e].TREE[s]){o=false;break}}if(o){if(!BX.util.in_array(this.offers[e].TREE[i],r)){r[r.length]=this.offers[e].TREE[i]}a=true}}}return a?r:false},getCanBuy:function(t){var i,e,s=false,r=true;for(i=0;i<this.offers.length;i++){r=true;for(e in t){if(t[e]!==this.offers[i].TREE[e]){r=false;break}}if(r){if(this.offers[i].CAN_BUY){s=true;break}}}return s},setCurrent:function(){var t,i=0,e=[],s="",r=false,a={},o=[],h=this.offers[this.offerNum].TREE;for(t=0;t<this.treeProps.length;t++){s="PROP_"+this.treeProps[t].ID;r=this.getRowValues(a,s);if(!r){break}if(BX.util.in_array(h[s],r)){a[s]=h[s]}else{a[s]=r[0];this.offerNum=0}if(this.showAbsent){e=[];o=[];o=BX.clone(a,true);for(i=0;i<r.length;i++){o[s]=r[i];if(this.getCanBuy(o)){e[e.length]=r[i]}}}else{e=r}this.updateRow(t,a[s],r,e)}this.selectedValues=a;this.changeInfo()},changeInfo:function(){var t,i,e=-1,s=true,r;for(t=0;t<this.offers.length;t++){s=true;for(i in this.selectedValues){if(this.selectedValues[i]!==this.offers[t].TREE[i]){s=false;break}}if(s){e=t;break}}if(e>-1){if(parseInt(this.offers[e].MORE_PHOTO_COUNT)>1&&this.obPictSlider){if(this.obPict){this.obPict.style.display="none"}if(this.obSecondPict){this.obSecondPict.style.display="none"}BX.cleanNode(this.obPictSlider);for(t in this.offers[e].MORE_PHOTO){if(this.offers[e].MORE_PHOTO.hasOwnProperty(t)){this.obPictSlider.appendChild(BX.create("SPAN",{props:{className:"product-item-image-slide item"+(t==0?" active":"")},style:{backgroundImage:"url('"+this.offers[e].MORE_PHOTO[t].SRC+"')"}}))}}if(this.obPictSliderIndicator){BX.cleanNode(this.obPictSliderIndicator);for(t in this.offers[e].MORE_PHOTO){if(this.offers[e].MORE_PHOTO.hasOwnProperty(t)){this.obPictSliderIndicator.appendChild(BX.create("DIV",{attrs:{"data-go-to":t},props:{className:"product-item-image-slider-control"+(t==0?" active":"")}}));this.obPictSliderIndicator.appendChild(document.createTextNode(" "))}}this.obPictSliderIndicator.style.display=""}if(this.obPictSliderProgressBar){this.obPictSliderProgressBar.style.display=""}this.obPictSlider.style.display="";this.initializeSlider()}else{if(this.obPictSlider){this.obPictSlider.style.display="none"}if(this.obPictSliderIndicator){this.obPictSliderIndicator.style.display="none"}if(this.obPictSliderProgressBar){this.obPictSliderProgressBar.style.display="none"}if(this.obPict){if(this.offers[e].PREVIEW_PICTURE){BX.adjust(this.obPict,{style:{backgroundImage:"url('"+this.offers[e].PREVIEW_PICTURE.SRC+"')"}})}else{BX.adjust(this.obPict,{style:{backgroundImage:"url('"+this.defaultPict.pict.SRC+"')"}})}this.obPict.style.display=""}if(this.secondPict&&this.obSecondPict){if(this.offers[e].PREVIEW_PICTURE_SECOND){BX.adjust(this.obSecondPict,{style:{backgroundImage:"url('"+this.offers[e].PREVIEW_PICTURE_SECOND.SRC+"')"}})}else if(this.offers[e].PREVIEW_PICTURE.SRC){BX.adjust(this.obSecondPict,{style:{backgroundImage:"url('"+this.offers[e].PREVIEW_PICTURE.SRC+"')"}})}else if(this.defaultPict.secondPict){BX.adjust(this.obSecondPict,{style:{backgroundImage:"url('"+this.defaultPict.secondPict.SRC+"')"}})}else{BX.adjust(this.obSecondPict,{style:{backgroundImage:"url('"+this.defaultPict.pict.SRC+"')"}})}this.obSecondPict.style.display=""}}if(this.showSkuProps&&this.obSkuProps){if(this.offers[e].DISPLAY_PROPERTIES.length){BX.adjust(this.obSkuProps,{style:{display:""},html:this.offers[e].DISPLAY_PROPERTIES})}else{BX.adjust(this.obSkuProps,{style:{display:"none"},html:""})}}this.quantitySet(e);this.setPrice();this.setCompared(this.offers[e].COMPARED);this.offerNum=e}},checkPriceRange:function(t){if(typeof t==="undefined"||this.currentPriceMode!="Q")return;var i,e=false;for(var s in this.currentQuantityRanges){if(this.currentQuantityRanges.hasOwnProperty(s)){i=this.currentQuantityRanges[s];if(parseInt(t)>=parseInt(i.SORT_FROM)&&(i.SORT_TO=="INF"||parseInt(t)<=parseInt(i.SORT_TO))){e=true;this.currentQuantityRangeSelected=i.HASH;break}}}if(!e&&(i=this.getMinPriceRange())){this.currentQuantityRangeSelected=i.HASH}for(var r in this.currentPrices){if(this.currentPrices.hasOwnProperty(r)){if(this.currentPrices[r].QUANTITY_HASH==this.currentQuantityRangeSelected){this.currentPriceSelected=r;break}}}},getMinPriceRange:function(){var t;for(var i in this.currentQuantityRanges){if(this.currentQuantityRanges.hasOwnProperty(i)){if(!t||parseInt(this.currentQuantityRanges[i].SORT_FROM)<parseInt(t.SORT_FROM)){t=this.currentQuantityRanges[i]}}}return t},checkQuantityControls:function(){if(!this.obQuantity)return;var t=this.checkQuantity&&parseFloat(this.obQuantity.value)+this.stepQuantity>this.maxQuantity,i=parseFloat(this.obQuantity.value)-this.stepQuantity<this.minQuantity;if(t){BX.addClass(this.obQuantityUp,"product-item-amount-field-btn-disabled")}else if(BX.hasClass(this.obQuantityUp,"product-item-amount-field-btn-disabled")){BX.removeClass(this.obQuantityUp,"product-item-amount-field-btn-disabled")}if(i){BX.addClass(this.obQuantityDown,"product-item-amount-field-btn-disabled")}else if(BX.hasClass(this.obQuantityDown,"product-item-amount-field-btn-disabled")){BX.removeClass(this.obQuantityDown,"product-item-amount-field-btn-disabled")}if(t&&i){this.obQuantity.setAttribute("disabled","disabled")}else{this.obQuantity.removeAttribute("disabled")}},setPrice:function(){var t,i;if(this.obQuantity){this.checkPriceRange(this.obQuantity.value)}this.checkQuantityControls();i=this.currentPrices[this.currentPriceSelected];if(this.obPrice){if(i){BX.adjust(this.obPrice,{html:BX.Currency.currencyFormat(i.RATIO_PRICE,i.CURRENCY,true)})}else{BX.adjust(this.obPrice,{html:""})}if(this.showOldPrice&&this.obPriceOld){if(i&&i.RATIO_PRICE!==i.RATIO_BASE_PRICE){BX.adjust(this.obPriceOld,{style:{display:""},html:BX.Currency.currencyFormat(i.RATIO_BASE_PRICE,i.CURRENCY,true)})}else{BX.adjust(this.obPriceOld,{style:{display:"none"},html:""})}}if(this.obPriceTotal){if(i&&this.obQuantity&&this.obQuantity.value!=this.stepQuantity){BX.adjust(this.obPriceTotal,{html:BX.message("PRICE_TOTAL_PREFIX")+" <strong>"+BX.Currency.currencyFormat(i.PRICE*this.obQuantity.value,i.CURRENCY,true)+"</strong>",style:{display:""}})}else{BX.adjust(this.obPriceTotal,{html:"",style:{display:"none"}})}}if(this.showPercent){if(i&&parseInt(i.PERCENT)>0){t={style:{display:""},html:-i.PERCENT+"%"}}else{t={style:{display:"none"},html:""}}if(this.obDscPerc){BX.adjust(this.obDscPerc,t)}if(this.obSecondDscPerc){BX.adjust(this.obSecondDscPerc,t)}}}},compare:function(t){var i=this.obCompare.querySelector('[data-entity="compare-checkbox"]'),e=BX.getEventTarget(t),s=true;if(i){s=e===i?i.checked:!i.checked}var r=s?this.compareData.compareUrl:this.compareData.compareDeleteUrl,a;if(r){if(e!==i){BX.PreventDefault(t);this.setCompared(s)}switch(this.productType){case 0:case 1:case 2:case 7:a=r.replace("#ID#",this.product.id.toString());break;case 3:a=r.replace("#ID#",this.offers[this.offerNum].ID);break}BX.ajax({method:"POST",dataType:s?"json":"html",url:a+(a.indexOf("?")!==-1?"&":"?")+"ajax_action=Y",onsuccess:s?BX.proxy(this.compareResult,this):BX.proxy(this.compareDeleteResult,this)})}},compareResult:function(t){var e,s;if(this.obPopupWin){this.obPopupWin.close()}if(!BX.type.isPlainObject(t))return;this.initPopupWindow();if(this.offers.length>0){this.offers[this.offerNum].COMPARED=t.STATUS==="OK"}if(t.STATUS==="OK"){BX.onCustomEvent("OnCompareChange");e='<div style="width: 100%; margin: 0; text-align: center;"><p>'+BX.message("COMPARE_MESSAGE_OK")+"</p></div>";if(this.showClosePopup){s=[new i({text:BX.message("BTN_MESSAGE_COMPARE_REDIRECT"),events:{click:BX.delegate(this.compareRedirect,this)},style:{marginRight:"10px"}}),new i({text:BX.message("BTN_MESSAGE_CLOSE_POPUP"),events:{click:BX.delegate(this.obPopupWin.close,this.obPopupWin)}})]}else{s=[new i({text:BX.message("BTN_MESSAGE_COMPARE_REDIRECT"),events:{click:BX.delegate(this.compareRedirect,this)}})]}}else{e='<div style="width: 100%; margin: 0; text-align: center;"><p>'+(t.MESSAGE?t.MESSAGE:BX.message("COMPARE_UNKNOWN_ERROR"))+"</p></div>";s=[new i({text:BX.message("BTN_MESSAGE_CLOSE"),events:{click:BX.delegate(this.obPopupWin.close,this.obPopupWin)}})]}this.obPopupWin.setTitleBar(BX.message("COMPARE_TITLE"));this.obPopupWin.setContent(e);this.obPopupWin.setButtons(s);this.obPopupWin.show()},compareDeleteResult:function(){BX.onCustomEvent("OnCompareChange");if(this.offers&&this.offers.length){this.offers[this.offerNum].COMPARED=false}},setCompared:function(t){if(!this.obCompare)return;var i=this.obCompare.querySelector('[data-entity="compare-checkbox"]');if(i){i.checked=t}},setCompareInfo:function(t){if(!BX.type.isArray(t))return;for(var i in this.offers){if(this.offers.hasOwnProperty(i)){this.offers[i].COMPARED=BX.util.in_array(this.offers[i].ID,t)}}},compareRedirect:function(){if(this.compareData.comparePath){location.href=this.compareData.comparePath}else{this.obPopupWin.close()}},checkDeletedCompare:function(t){switch(this.productType){case 0:case 1:case 2:case 7:if(this.product.id==t){this.setCompared(false)}break;case 3:var i=this.offers.length;while(i--){if(this.offers[i].ID==t){this.offers[i].COMPARED=false;if(this.offerNum==i){this.setCompared(false)}break}}}},initBasketUrl:function(){this.basketUrl=this.basketMode==="ADD"?this.basketData.add_url:this.basketData.buy_url;switch(this.productType){case 1:case 2:case 7:this.basketUrl=this.basketUrl.replace("#ID#",this.product.id.toString());break;case 3:this.basketUrl=this.basketUrl.replace("#ID#",this.offers[this.offerNum].ID);break}this.basketParams={ajax_basket:"Y"};if(this.showQuantity){this.basketParams[this.basketData.quantity]=this.obQuantity.value}if(this.basketData.sku_props){this.basketParams[this.basketData.sku_props_var]=this.basketData.sku_props}},fillBasketProps:function(){if(!this.visual.BASKET_PROP_DIV){return}var t=0,i=null,e=false,s=null;if(this.basketData.useProps&&!this.basketData.emptyProps){if(this.obPopupWin&&this.obPopupWin.contentContainer){s=this.obPopupWin.contentContainer}}else{s=BX(this.visual.BASKET_PROP_DIV)}if(s){i=s.getElementsByTagName("select");if(i&&i.length){for(t=0;t<i.length;t++){if(!i[t].disabled){switch(i[t].type.toLowerCase()){case"select-one":this.basketParams[i[t].name]=i[t].value;e=true;break;default:break}}}}i=s.getElementsByTagName("input");if(i&&i.length){for(t=0;t<i.length;t++){if(!i[t].disabled){switch(i[t].type.toLowerCase()){case"hidden":this.basketParams[i[t].name]=i[t].value;e=true;break;case"radio":if(i[t].checked){this.basketParams[i[t].name]=i[t].value;e=true}break;default:break}}}}}if(!e){this.basketParams[this.basketData.props]=[];this.basketParams[this.basketData.props][0]=0}},add2Basket:function(){this.basketMode="ADD";this.basket()},buyBasket:function(){this.basketMode="BUY";this.basket()},sendToBasket:function(){if(!this.canBuy){return}if(this.product&&this.product.id&&this.bigData){this.rememberProductRecommendation()}this.initBasketUrl();this.fillBasketProps();BX.ajax({method:"POST",dataType:"json",url:this.basketUrl,data:this.basketParams,onsuccess:BX.proxy(this.basketResult,this)})},basket:function(){var t="";if(!this.canBuy){return}switch(this.productType){case 1:case 2:case 7:if(this.basketData.useProps&&!this.basketData.emptyProps){this.initPopupWindow();this.obPopupWin.setTitleBar(BX.message("TITLE_BASKET_PROPS"));if(BX(this.visual.BASKET_PROP_DIV)){t=BX(this.visual.BASKET_PROP_DIV).innerHTML}this.obPopupWin.setContent(t);this.obPopupWin.setButtons([new i({text:BX.message("BTN_MESSAGE_SEND_PROPS"),events:{click:BX.delegate(this.sendToBasket,this)}})]);this.obPopupWin.show()}else{this.sendToBasket()}break;case 3:this.sendToBasket();break}},basketResult:function(t){var e="",s="",r,a=[];if(this.obPopupWin)this.obPopupWin.close();if(!BX.type.isPlainObject(t))return;r=t.STATUS==="OK";if(r){this.setAnalyticsDataLayer("addToCart")}if(r&&this.basketAction==="BUY"){this.basketRedirect()}else{this.initPopupWindow();if(r){BX.onCustomEvent("OnBasketChange");if(BX.findParent(this.obProduct,{className:"bx_sale_gift_main_products"},10)){BX.onCustomEvent("onAddToBasketMainProduct",[this])}switch(this.productType){case 1:case 2:case 7:s=this.product.pict.SRC;break;case 3:s=this.offers[this.offerNum].PREVIEW_PICTURE?this.offers[this.offerNum].PREVIEW_PICTURE.SRC:this.defaultPict.pict.SRC;break}e='<div style="width: 100%; margin: 0; text-align: center;"><img src="'+s+'" height="130" style="max-height:130px"><p>'+this.product.name+"</p></div>";if(this.showClosePopup){a=[new i({text:BX.message("BTN_MESSAGE_BASKET_REDIRECT"),events:{click:BX.delegate(this.basketRedirect,this)},style:{marginRight:"10px"}}),new i({text:BX.message("BTN_MESSAGE_CLOSE_POPUP"),events:{click:BX.delegate(this.obPopupWin.close,this.obPopupWin)}})]}else{a=[new i({text:BX.message("BTN_MESSAGE_BASKET_REDIRECT"),events:{click:BX.delegate(this.basketRedirect,this)}})]}}else{e='<div style="width: 100%; margin: 0; text-align: center;"><p>'+(t.MESSAGE?t.MESSAGE:BX.message("BASKET_UNKNOWN_ERROR"))+"</p></div>";a=[new i({text:BX.message("BTN_MESSAGE_CLOSE"),events:{click:BX.delegate(this.obPopupWin.close,this.obPopupWin)}})]}this.obPopupWin.setTitleBar(r?BX.message("TITLE_SUCCESSFUL"):BX.message("TITLE_ERROR"));this.obPopupWin.setContent(e);this.obPopupWin.setButtons(a);this.obPopupWin.show()}},basketRedirect:function(){location.href=this.basketData.basketUrl?this.basketData.basketUrl:BX.message("BASKET_URL")},initPopupWindow:function(){if(this.obPopupWin)return;this.obPopupWin=BX.PopupWindowManager.create("CatalogSectionBasket_"+this.visual.ID,null,{autoHide:true,offsetLeft:0,offsetTop:0,overlay:true,closeByEsc:true,titleBar:true,closeIcon:true,contentColor:"white",className:this.templateTheme?"bx-"+this.templateTheme:""})}}})(window);
/* End */
;; /* /bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/action-pool.min.js?16983326994358*/
; /* /bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/filter.min.js?169833269910459*/
; /* /bitrix/templates/.default/components/bitrix/sale.basket.basket/local.sale.basket/js/component.js?169833295361762*/
; /* /bitrix/components/bitrix/sale.products.gift.basket/templates/bootstrap_v4/script.min.js?16968612423259*/
; /* /bitrix/components/bitrix/catalog.item/templates/bootstrap_v4/script.min.js?169686116341337*/

//# sourceMappingURL=page_46b4c4618b9d4249efe8a470e0379cf3.map.js