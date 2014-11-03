(function() {
  if (!String.prototype.endsWith) {

    /*
     * Determines whether a string ends with the specified suffix.
     * 
     * @param  {String} suffix
     * @return Boolean
     */
    String.prototype.endsWith = function(suffix) {
      return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
  }

  if (!String.prototype.trim) {

    /*
     * Removes whitespace from both sides of a string.
     * 
     * @return {String}
     */
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }

  if (!Array.prototype.indexOf) {

    /*
     * The indexOf() method returns the first index at which a given element can be found in the array, or -1 if it is not present.
     * 
     * @param  {Variant} searchElement
     * @param  {Integer} fromIndex
     * @return {Integer}
     */
    Array.prototype.indexOf = function(searchElement, fromIndex) {
      var i, length, _i;
      if (this === void 0 || this === null) {
        throw new TypeError('"this" is null or not defined');
      }
      length = this.length >>> 0;
      fromIndex = +fromIndex || 0;
      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }
      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }
      for (i = _i = fromIndex; fromIndex <= length ? _i < length : _i > length; i = fromIndex <= length ? ++_i : --_i) {
        if (this[i] === searchElement) {
          return i;
        }
      }
      return -1;
    };
  }

  if (!Function.prototype.bind) {
    Function.prototype.bind = function(oThis) {
      var aArgs, fBound, fNOP, fToBind;
      if (typeof this !== "function") {
        throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
      }
      aArgs = Array.prototype.slice.call(arguments, 1);
      fToBind = this;
      fNOP = function() {};
      fBound = function() {
        return fToBind.apply((this instanceof fNOP && oThis ? this : oThis), aArgs.concat(Array.prototype.slice.call(arguments)));
      };
      fNOP.prototype = this.prototype;
      fBound.prototype = new fNOP();
      return fBound;
    };
  }

  if (!Object.keys) {
    Object.keys = (function() {
      'use strict';
      var dontEnums, hasDontEnumBug, hasOwnProperty;
      hasOwnProperty = Object.prototype.hasOwnProperty;
      hasDontEnumBug = {
        toString: null
      }.propertyIsEnumerable('toString') ? false : true;
      dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
      return function(obj) {
        var dontEnum, prop, result, _i, _j, _len, _len1;
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }
        result = [];
        for (_i = 0, _len = obj.length; _i < _len; _i++) {
          prop = obj[_i];
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
        if (hasDontEnumBug) {
          for (_j = 0, _len1 = dontEnums.length; _j < _len1; _j++) {
            dontEnum = dontEnums[_j];
            if (hasOwnProperty.call(obj, dontEnum)) {
              result.push(dontEnum);
            }
          }
        }
        return result;
      };
    }).call(this);
  }


  /*
   * Detect screen size.
   * 
   * @param  {jQuery Object} $ssw_point
   * @param  {jQuery Object} $tsw_point
   * @return {String}
   */

  window.getScreenSize = function($ssw_point, $tsw_point) {
    if ($ssw_point.is(':visible')) {
      return 'small';
    } else if ($tsw_point.is(':visible')) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  };

  window.elHasClass = function(el, selector) {
    return (" " + el.className + " ").indexOf(" " + selector + " ") > -1;
  };

  window.elRemoveClass = function(el, selector) {
    return el.className = (" " + el.className + " ").replace(" " + selector + " ", ' ').trim();
  };

}).call(this);
;
(function() {
  var PixelAdminApp, SETTINGS_DEFAULTS;

  SETTINGS_DEFAULTS = {
    is_mobile: false,
    resize_delay: 400,
    stored_values_prefix: 'pa_',
    main_menu: {
      accordion: true,
      animation_speed: 250,
      store_state: true,
      store_state_key: 'mmstate',
      disable_animation_on: ['small'],
      dropdown_close_delay: 300,
      detect_active: true,
      detect_active_predicate: function(href, url) {
        return href === url;
      }
    },
    consts: {
      COLORS: ['#71c73e', '#77b7c5', '#d54848', '#6c42e5', '#e8e64e', '#dd56e6', '#ecad3f', '#618b9d', '#b68b68', '#36a766', '#3156be', '#00b3ff', '#646464', '#a946e8', '#9d9d9d']
    }
  };


  /*
   * @class PixelAdminApp
   */

  PixelAdminApp = function() {
    this.init = [];
    this.plugins = {};
    this.settings = {};
    this.localStorageSupported = typeof window.Storage !== "undefined" ? true : false;
    return this;
  };


  /*
   * Start application. Method takes an array of initializers and a settings object(that overrides default settings).
   * 
   * @param  {Array} suffix
   * @param  {Object} settings
   * @return this
   */

  PixelAdminApp.prototype.start = function(init, settings) {
    if (init == null) {
      init = [];
    }
    if (settings == null) {
      settings = {};
    }
    window.onload = (function(_this) {
      return function() {
        var initilizer, _i, _len, _ref;
        $('html').addClass('pxajs');
        if (init.length > 0) {
          $.merge(_this.init, init);
        }
        _this.settings = $.extend(true, {}, SETTINGS_DEFAULTS, settings || {});
        _this.settings.is_mobile = /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase());
        if (_this.settings.is_mobile) {
          if (FastClick) {
            FastClick.attach(document.body);
          }
        }
        _ref = _this.init;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          initilizer = _ref[_i];
          $.proxy(initilizer, _this)();
        }
        $(window).trigger("pa.loaded");
        return $(window).resize();
      };
    })(this);
    return this;
  };


  /*
   * Add initializer to the stack.
   * 
   * @param  {Function} callback
   */

  PixelAdminApp.prototype.addInitializer = function(callback) {
    return this.init.push(callback);
  };


  /*
   * Initialize plugin and add it to the plugins list.
   * 
   * @param  {String} plugin_name
   * @param  {Instance} plugin
   */

  PixelAdminApp.prototype.initPlugin = function(plugin_name, plugin) {
    this.plugins[plugin_name] = plugin;
    if (plugin.init) {
      return plugin.init();
    }
  };


  /*
   * Save value in the localStorage/Cookies.
   * 
   * @param  {String}  key
   * @param  {String}  value
   * @param  {Boolean} use_cookies
   */

  PixelAdminApp.prototype.storeValue = function(key, value, use_cookies) {
    var e;
    if (use_cookies == null) {
      use_cookies = false;
    }
    if (this.localStorageSupported && !use_cookies) {
      try {
        window.localStorage.setItem(this.settings.stored_values_prefix + key, value);
        return;
      } catch (_error) {
        e = _error;
        1;
      }
    }
    return document.cookie = this.settings.stored_values_prefix + key + '=' + escape(value);
  };


  /*
   * Save key/value pairs in the localStorage/Cookies.
   * 
   * @param  {Object} pairs
   * @param  {Boolean} use_cookies
   */

  PixelAdminApp.prototype.storeValues = function(pairs, use_cookies) {
    var e, key, value, _results;
    if (use_cookies == null) {
      use_cookies = false;
    }
    if (this.localStorageSupported && !use_cookies) {
      try {
        for (key in pairs) {
          value = pairs[key];
          window.localStorage.setItem(this.settings.stored_values_prefix + key, value);
        }
        return;
      } catch (_error) {
        e = _error;
        1;
      }
    }
    _results = [];
    for (key in pairs) {
      value = pairs[key];
      _results.push(document.cookie = this.settings.stored_values_prefix + key + '=' + escape(value));
    }
    return _results;
  };


  /*
   * Get value from the localStorage/Cookies.
   * 
   * @param  {String} key
   * @param  {Boolean} use_cookies
   */

  PixelAdminApp.prototype.getStoredValue = function(key, use_cookies, deflt) {
    var cookie, cookies, e, k, pos, r, v, _i, _len;
    if (use_cookies == null) {
      use_cookies = false;
    }
    if (deflt == null) {
      deflt = null;
    }
    if (this.localStorageSupported && !use_cookies) {
      try {
        r = window.localStorage.getItem(this.settings.stored_values_prefix + key);
        return (r ? r : deflt);
      } catch (_error) {
        e = _error;
        1;
      }
    }
    cookies = document.cookie.split(';');
    for (_i = 0, _len = cookies.length; _i < _len; _i++) {
      cookie = cookies[_i];
      pos = cookie.indexOf('=');
      k = cookie.substr(0, pos).replace(/^\s+|\s+$/g, '');
      v = cookie.substr(pos + 1).replace(/^\s+|\s+$/g, '');
      if (k === (this.settings.stored_values_prefix + key)) {
        return v;
      }
    }
    return deflt;
  };


  /*
   * Get values from the localStorage/Cookies.
   * 
   * @param  {Array} keys
   * @param  {Boolean} use_cookies
   */

  PixelAdminApp.prototype.getStoredValues = function(keys, use_cookies, deflt) {
    var cookie, cookies, e, k, key, pos, r, result, v, _i, _j, _k, _len, _len1, _len2;
    if (use_cookies == null) {
      use_cookies = false;
    }
    if (deflt == null) {
      deflt = null;
    }
    result = {};
    for (_i = 0, _len = keys.length; _i < _len; _i++) {
      key = keys[_i];
      result[key] = deflt;
    }
    if (this.localStorageSupported && !use_cookies) {
      try {
        for (_j = 0, _len1 = keys.length; _j < _len1; _j++) {
          key = keys[_j];
          r = window.localStorage.getItem(this.settings.stored_values_prefix + key);
          if (r) {
            result[key] = r;
          }
        }
        return result;
      } catch (_error) {
        e = _error;
        1;
      }
    }
    cookies = document.cookie.split(';');
    for (_k = 0, _len2 = cookies.length; _k < _len2; _k++) {
      cookie = cookies[_k];
      pos = cookie.indexOf('=');
      k = cookie.substr(0, pos).replace(/^\s+|\s+$/g, '');
      v = cookie.substr(pos + 1).replace(/^\s+|\s+$/g, '');
      if (k === (this.settings.stored_values_prefix + key)) {
        result[key] = v;
      }
    }
    return result;
  };

  PixelAdminApp.Constructor = PixelAdminApp;

  window.PixelAdmin = new PixelAdminApp;

}).call(this);
;
(function() {
  var delayedResizeHandler;

  delayedResizeHandler = function(callback) {
    var resizeTimer;
    resizeTimer = null;
    return function() {
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      return resizeTimer = setTimeout(function() {
        resizeTimer = null;
        return callback.call(this);
      }, PixelAdmin.settings.resize_delay);
    };
  };

  PixelAdmin.addInitializer(function() {
    var $ssw_point, $tsw_point, $window, _last_screen;
    _last_screen = null;
    $window = $(window);
    $ssw_point = $('<div id="small-screen-width-point" style="position:absolute;top:-10000px;width:10px;height:10px;background:#fff;"></div>');
    $tsw_point = $('<div id="tablet-screen-width-point" style="position:absolute;top:-10000px;width:10px;height:10px;background:#fff;"></div>');
    $('body').append($ssw_point).append($tsw_point);
    return $window.on('resize', delayedResizeHandler(function() {
      $window.trigger("pa.resize");
      if ($ssw_point.is(':visible')) {
        if (_last_screen !== 'small') {
          $window.trigger("pa.screen.small");
        }
        return _last_screen = 'small';
      } else if ($tsw_point.is(':visible')) {
        if (_last_screen !== 'tablet') {
          $window.trigger("pa.screen.tablet");
        }
        return _last_screen = 'tablet';
      } else {
        if (_last_screen !== 'desktop') {
          $window.trigger("pa.screen.desktop");
        }
        return _last_screen = 'desktop';
      }
    }));
  });

}).call(this);
;
/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 0.6.11
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */

/*jslint browser:true, node:true*/
/*global define, Event, Node*/


/**
 * Instantiate fast-clicking listeners on the specificed layer.
 *
 * @constructor
 * @param {Element} layer The layer to listen on
 */
function FastClick(layer) {
	'use strict';
	var oldOnClick, self = this;


	/**
	 * Whether a click is currently being tracked.
	 *
	 * @type boolean
	 */
	this.trackingClick = false;


	/**
	 * Timestamp for when when click tracking started.
	 *
	 * @type number
	 */
	this.trackingClickStart = 0;


	/**
	 * The element being tracked for a click.
	 *
	 * @type EventTarget
	 */
	this.targetElement = null;


	/**
	 * X-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartX = 0;


	/**
	 * Y-coordinate of touch start event.
	 *
	 * @type number
	 */
	this.touchStartY = 0;


	/**
	 * ID of the last touch, retrieved from Touch.identifier.
	 *
	 * @type number
	 */
	this.lastTouchIdentifier = 0;


	/**
	 * Touchmove boundary, beyond which a click will be cancelled.
	 *
	 * @type number
	 */
	this.touchBoundary = 10;


	/**
	 * The FastClick layer.
	 *
	 * @type Element
	 */
	this.layer = layer;

	if (!layer || !layer.nodeType) {
		throw new TypeError('Layer must be a document node');
	}

	/** @type function() */
	this.onClick = function() { return FastClick.prototype.onClick.apply(self, arguments); };

	/** @type function() */
	this.onMouse = function() { return FastClick.prototype.onMouse.apply(self, arguments); };

	/** @type function() */
	this.onTouchStart = function() { return FastClick.prototype.onTouchStart.apply(self, arguments); };

	/** @type function() */
	this.onTouchMove = function() { return FastClick.prototype.onTouchMove.apply(self, arguments); };

	/** @type function() */
	this.onTouchEnd = function() { return FastClick.prototype.onTouchEnd.apply(self, arguments); };

	/** @type function() */
	this.onTouchCancel = function() { return FastClick.prototype.onTouchCancel.apply(self, arguments); };

	if (FastClick.notNeeded(layer)) {
		return;
	}

	// Set up event handlers as required
	if (this.deviceIsAndroid) {
		layer.addEventListener('mouseover', this.onMouse, true);
		layer.addEventListener('mousedown', this.onMouse, true);
		layer.addEventListener('mouseup', this.onMouse, true);
	}

	layer.addEventListener('click', this.onClick, true);
	layer.addEventListener('touchstart', this.onTouchStart, false);
	layer.addEventListener('touchmove', this.onTouchMove, false);
	layer.addEventListener('touchend', this.onTouchEnd, false);
	layer.addEventListener('touchcancel', this.onTouchCancel, false);

	// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
	// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
	// layer when they are cancelled.
	if (!Event.prototype.stopImmediatePropagation) {
		layer.removeEventListener = function(type, callback, capture) {
			var rmv = Node.prototype.removeEventListener;
			if (type === 'click') {
				rmv.call(layer, type, callback.hijacked || callback, capture);
			} else {
				rmv.call(layer, type, callback, capture);
			}
		};

		layer.addEventListener = function(type, callback, capture) {
			var adv = Node.prototype.addEventListener;
			if (type === 'click') {
				adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
					if (!event.propagationStopped) {
						callback(event);
					}
				}), capture);
			} else {
				adv.call(layer, type, callback, capture);
			}
		};
	}

	// If a handler is already declared in the element's onclick attribute, it will be fired before
	// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
	// adding it as listener.
	if (typeof layer.onclick === 'function') {

		// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
		// - the old one won't work if passed to addEventListener directly.
		oldOnClick = layer.onclick;
		layer.addEventListener('click', function(event) {
			oldOnClick(event);
		}, false);
		layer.onclick = null;
	}
}


/**
 * Android requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0;


/**
 * iOS requires exceptions.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent);


/**
 * iOS 4 requires an exception for select elements.
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOS4 = FastClick.prototype.deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


/**
 * iOS 6.0(+?) requires the target element to be manually derived
 *
 * @type boolean
 */
FastClick.prototype.deviceIsIOSWithBadTarget = FastClick.prototype.deviceIsIOS && (/OS ([6-9]|\d{2})_\d/).test(navigator.userAgent);


/**
 * Determine whether a given element requires a native click.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element needs a native click
 */
FastClick.prototype.needsClick = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {

	// Don't send a synthetic click to disabled inputs (issue #62)
	case 'button':
	case 'select':
	case 'textarea':
		if (target.disabled) {
			return true;
		}

		break;
	case 'input':

		// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
		if ((this.deviceIsIOS && target.type === 'file') || target.disabled) {
			return true;
		}

		break;
	case 'label':
	case 'video':
		return true;
	}

	return (/\bneedsclick\b/).test(target.className);
};


/**
 * Determine whether a given element requires a call to focus to simulate click into element.
 *
 * @param {EventTarget|Element} target Target DOM element
 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
 */
FastClick.prototype.needsFocus = function(target) {
	'use strict';
	switch (target.nodeName.toLowerCase()) {
	case 'textarea':
		return true;
	case 'select':
		return !this.deviceIsAndroid;
	case 'input':
		switch (target.type) {
		case 'button':
		case 'checkbox':
		case 'file':
		case 'image':
		case 'radio':
		case 'submit':
			return false;
		}

		// No point in attempting to focus disabled inputs
		return !target.disabled && !target.readOnly;
	default:
		return (/\bneedsfocus\b/).test(target.className);
	}
};


/**
 * Send a click event to the specified element.
 *
 * @param {EventTarget|Element} targetElement
 * @param {Event} event
 */
FastClick.prototype.sendClick = function(targetElement, event) {
	'use strict';
	var clickEvent, touch;

	// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
	if (document.activeElement && document.activeElement !== targetElement) {
		document.activeElement.blur();
	}

	touch = event.changedTouches[0];

	// Synthesise a click event, with an extra attribute so it can be tracked
	clickEvent = document.createEvent('MouseEvents');
	clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
	clickEvent.forwardedTouchEvent = true;
	targetElement.dispatchEvent(clickEvent);
};

FastClick.prototype.determineEventType = function(targetElement) {
	'use strict';

	//Issue #159: Android Chrome Select Box does not open with a synthetic click event
	if (this.deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
		return 'mousedown';
	}

	return 'click';
};


/**
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.focus = function(targetElement) {
	'use strict';
	var length;

	// Issue #160: on iOS 7, some input elements (e.g. date datetime) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
	if (this.deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time') {
		length = targetElement.value.length;
		targetElement.setSelectionRange(length, length);
	} else {
		targetElement.focus();
	}
};


/**
 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
 *
 * @param {EventTarget|Element} targetElement
 */
FastClick.prototype.updateScrollParent = function(targetElement) {
	'use strict';
	var scrollParent, parentElement;

	scrollParent = targetElement.fastClickScrollParent;

	// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
	// target element was moved to another parent.
	if (!scrollParent || !scrollParent.contains(targetElement)) {
		parentElement = targetElement;
		do {
			if (parentElement.scrollHeight > parentElement.offsetHeight) {
				scrollParent = parentElement;
				targetElement.fastClickScrollParent = parentElement;
				break;
			}

			parentElement = parentElement.parentElement;
		} while (parentElement);
	}

	// Always update the scroll top tracker if possible.
	if (scrollParent) {
		scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
	}
};


/**
 * @param {EventTarget} targetElement
 * @returns {Element|EventTarget}
 */
FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {
	'use strict';

	// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
	if (eventTarget.nodeType === Node.TEXT_NODE) {
		return eventTarget.parentNode;
	}

	return eventTarget;
};


/**
 * On touch start, record the position and scroll offset.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchStart = function(event) {
	'use strict';
	var targetElement, touch, selection;

	// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
	if (event.targetTouches.length > 1) {
		return true;
	}

	targetElement = this.getTargetElementFromEventTarget(event.target);
	touch = event.targetTouches[0];

	if (this.deviceIsIOS) {

		// Only trusted events will deselect text on iOS (issue #49)
		selection = window.getSelection();
		if (selection.rangeCount && !selection.isCollapsed) {
			return true;
		}

		if (!this.deviceIsIOS4) {

			// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
			// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
			// with the same identifier as the touch event that previously triggered the click that triggered the alert.
			// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
			// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
			if (touch.identifier === this.lastTouchIdentifier) {
				event.preventDefault();
				return false;
			}

			this.lastTouchIdentifier = touch.identifier;

			// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
			// 1) the user does a fling scroll on the scrollable layer
			// 2) the user stops the fling scroll with another tap
			// then the event.target of the last 'touchend' event will be the element that was under the user's finger
			// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
			// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
			this.updateScrollParent(targetElement);
		}
	}

	this.trackingClick = true;
	this.trackingClickStart = event.timeStamp;
	this.targetElement = targetElement;

	this.touchStartX = touch.pageX;
	this.touchStartY = touch.pageY;

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		event.preventDefault();
	}

	return true;
};


/**
 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.touchHasMoved = function(event) {
	'use strict';
	var touch = event.changedTouches[0], boundary = this.touchBoundary;

	if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
		return true;
	}

	return false;
};


/**
 * Update the last position.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchMove = function(event) {
	'use strict';
	if (!this.trackingClick) {
		return true;
	}

	// If the touch has moved, cancel the click tracking
	if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
		this.trackingClick = false;
		this.targetElement = null;
	}

	return true;
};


/**
 * Attempt to find the labelled control for the given label element.
 *
 * @param {EventTarget|HTMLLabelElement} labelElement
 * @returns {Element|null}
 */
FastClick.prototype.findControl = function(labelElement) {
	'use strict';

	// Fast path for newer browsers supporting the HTML5 control attribute
	if (labelElement.control !== undefined) {
		return labelElement.control;
	}

	// All browsers under test that support touch events also support the HTML5 htmlFor attribute
	if (labelElement.htmlFor) {
		return document.getElementById(labelElement.htmlFor);
	}

	// If no for attribute exists, attempt to retrieve the first labellable descendant element
	// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
	return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
};


/**
 * On touch end, determine whether to send a click event at once.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onTouchEnd = function(event) {
	'use strict';
	var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

	if (!this.trackingClick) {
		return true;
	}

	// Prevent phantom clicks on fast double-tap (issue #36)
	if ((event.timeStamp - this.lastClickTime) < 200) {
		this.cancelNextClick = true;
		return true;
	}

	// Reset to prevent wrong click cancel on input (issue #156).
	this.cancelNextClick = false;

	this.lastClickTime = event.timeStamp;

	trackingClickStart = this.trackingClickStart;
	this.trackingClick = false;
	this.trackingClickStart = 0;

	// On some iOS devices, the targetElement supplied with the event is invalid if the layer
	// is performing a transition or scroll, and has to be re-detected manually. Note that
	// for this to function correctly, it must be called *after* the event target is checked!
	// See issue #57; also filed as rdar://13048589 .
	if (this.deviceIsIOSWithBadTarget) {
		touch = event.changedTouches[0];

		// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
		targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
		targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
	}

	targetTagName = targetElement.tagName.toLowerCase();
	if (targetTagName === 'label') {
		forElement = this.findControl(targetElement);
		if (forElement) {
			this.focus(targetElement);
			if (this.deviceIsAndroid) {
				return false;
			}

			targetElement = forElement;
		}
	} else if (this.needsFocus(targetElement)) {

		// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
		// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
		if ((event.timeStamp - trackingClickStart) > 100 || (this.deviceIsIOS && window.top !== window && targetTagName === 'input')) {
			this.targetElement = null;
			return false;
		}

		this.focus(targetElement);

		// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
		if (!this.deviceIsIOS4 || targetTagName !== 'select') {
			this.targetElement = null;
			event.preventDefault();
		}

		return false;
	}

	if (this.deviceIsIOS && !this.deviceIsIOS4) {

		// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
		// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
		scrollParent = targetElement.fastClickScrollParent;
		if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
			return true;
		}
	}

	// Prevent the actual click from going though - unless the target node is marked as requiring
	// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
	if (!this.needsClick(targetElement)) {
		event.preventDefault();
		this.sendClick(targetElement, event);
	}

	return false;
};


/**
 * On touch cancel, stop tracking the click.
 *
 * @returns {void}
 */
FastClick.prototype.onTouchCancel = function() {
	'use strict';
	this.trackingClick = false;
	this.targetElement = null;
};


/**
 * Determine mouse events which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onMouse = function(event) {
	'use strict';

	// If a target element was never set (because a touch event was never fired) allow the event
	if (!this.targetElement) {
		return true;
	}

	if (event.forwardedTouchEvent) {
		return true;
	}

	// Programmatically generated events targeting a specific element should be permitted
	if (!event.cancelable) {
		return true;
	}

	// Derive and check the target element to see whether the mouse event needs to be permitted;
	// unless explicitly enabled, prevent non-touch click events from triggering actions,
	// to prevent ghost/doubleclicks.
	if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

		// Prevent any user-added listeners declared on FastClick element from being fired.
		if (event.stopImmediatePropagation) {
			event.stopImmediatePropagation();
		} else {

			// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
			event.propagationStopped = true;
		}

		// Cancel the event
		event.stopPropagation();
		event.preventDefault();

		return false;
	}

	// If the mouse event is permitted, return true for the action to go through.
	return true;
};


/**
 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
 * an actual click which should be permitted.
 *
 * @param {Event} event
 * @returns {boolean}
 */
FastClick.prototype.onClick = function(event) {
	'use strict';
	var permitted;

	// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
	if (this.trackingClick) {
		this.targetElement = null;
		this.trackingClick = false;
		return true;
	}

	// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
	if (event.target.type === 'submit' && event.detail === 0) {
		return true;
	}

	permitted = this.onMouse(event);

	// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
	if (!permitted) {
		this.targetElement = null;
	}

	// If clicks are permitted, return true for the action to go through.
	return permitted;
};


/**
 * Remove all FastClick's event listeners.
 *
 * @returns {void}
 */
FastClick.prototype.destroy = function() {
	'use strict';
	var layer = this.layer;

	if (this.deviceIsAndroid) {
		layer.removeEventListener('mouseover', this.onMouse, true);
		layer.removeEventListener('mousedown', this.onMouse, true);
		layer.removeEventListener('mouseup', this.onMouse, true);
	}

	layer.removeEventListener('click', this.onClick, true);
	layer.removeEventListener('touchstart', this.onTouchStart, false);
	layer.removeEventListener('touchmove', this.onTouchMove, false);
	layer.removeEventListener('touchend', this.onTouchEnd, false);
	layer.removeEventListener('touchcancel', this.onTouchCancel, false);
};


/**
 * Check whether FastClick is needed.
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.notNeeded = function(layer) {
	'use strict';
	var metaViewport;
	var chromeVersion;

	// Devices that don't support touch don't need FastClick
	if (typeof window.ontouchstart === 'undefined') {
		return true;
	}

	// Chrome version - zero for other browsers
	chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

	if (chromeVersion) {

		if (FastClick.prototype.deviceIsAndroid) {
			metaViewport = document.querySelector('meta[name=viewport]');
			
			if (metaViewport) {
				// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
				if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
					return true;
				}
				// Chrome 32 and above with width=device-width or less don't need FastClick
				if (chromeVersion > 31 && window.innerWidth <= window.screen.width) {
					return true;
				}
			}

		// Chrome desktop doesn't need FastClick (issue #15)
		} else {
			return true;
		}
	}

	// IE10 with -ms-touch-action: none, which disables double-tap-to-zoom (issue #97)
	if (layer.style.msTouchAction === 'none') {
		return true;
	}

	return false;
};


/**
 * Factory method for creating a FastClick object
 *
 * @param {Element} layer The layer to listen on
 */
FastClick.attach = function(layer) {
	'use strict';
	return new FastClick(layer);
};


if (typeof define !== 'undefined' && define.amd) {

	// AMD. Register as an anonymous module.
	define(function() {
		'use strict';
		return FastClick;
	});
} else if (typeof module !== 'undefined' && module.exports) {
	module.exports = FastClick.attach;
	module.exports.FastClick = FastClick;
} else {
	window.FastClick = FastClick;
}
;

/*
 * Class that provides the top navbar functionality.
 *
 * @class MainNavbar
 */

(function() {
  PixelAdmin.MainNavbar = function() {
    this._scroller = false;
    this._wheight = null;
    this.scroll_pos = 0;
    return this;
  };


  /*
   * Initialize plugin.
   */

  PixelAdmin.MainNavbar.prototype.init = function() {
    var is_mobile;
    this.$navbar = $('#main-navbar');
    this.$header = this.$navbar.find('.navbar-header');
    this.$toggle = this.$navbar.find('.navbar-toggle:first');
    this.$collapse = $('#main-navbar-collapse');
    this.$collapse_div = this.$collapse.find('> div');
    is_mobile = false;
    $(window).on('pa.screen.small pa.screen.tablet', (function(_this) {
      return function() {
        if (_this.$navbar.css('position') === 'fixed') {
          _this._setupScroller();
        }
        return is_mobile = true;
      };
    })(this)).on('pa.screen.desktop', (function(_this) {
      return function() {
        _this._removeScroller();
        return is_mobile = false;
      };
    })(this));
    return this.$navbar.on('click', '.nav-icon-btn.dropdown > .dropdown-toggle', function(e) {
      if (is_mobile) {
        e.preventDefault();
        e.stopPropagation();
        document.location.href = $(this).attr('href');
        return false;
      }
    });
  };


  /*
   * Attach scroller to navbar collapse.
   */

  PixelAdmin.MainNavbar.prototype._setupScroller = function() {
    if (this._scroller) {
      return;
    }
    this._scroller = true;
    this.$collapse_div.pixelSlimScroll({});
    this.$navbar.on('shown.bs.collapse.mn_collapse', $.proxy(((function(_this) {
      return function() {
        _this._updateCollapseHeight();
        return _this._watchWindowHeight();
      };
    })(this)), this)).on('hidden.bs.collapse.mn_collapse', $.proxy(((function(_this) {
      return function() {
        _this._wheight = null;
        return _this.$collapse_div.pixelSlimScroll({
          scrollTo: '0px'
        });
      };
    })(this)), this)).on('shown.bs.dropdown.mn_collapse', $.proxy(this._updateCollapseHeight, this)).on('hidden.bs.dropdown.mn_collapse', $.proxy(this._updateCollapseHeight, this));
    return this._updateCollapseHeight();
  };


  /*
   * Detach scroller from navbar collapse.
   */

  PixelAdmin.MainNavbar.prototype._removeScroller = function() {
    if (!this._scroller) {
      return;
    }
    this._wheight = null;
    this._scroller = false;
    this.$collapse_div.pixelSlimScroll({
      destroy: 'destroy'
    });
    this.$navbar.off('shown.bs.collapse.mn_collapse');
    this.$navbar.off('hidden.bs.collapse.mn_collapse');
    this.$navbar.off('shown.bs.dropdown.mn_collapse');
    this.$navbar.off('hidden.bs.dropdown.mn_collapse');
    return this.$collapse.attr('style', '');
  };


  /*
   * Update navbar collapse height.
   */

  PixelAdmin.MainNavbar.prototype._updateCollapseHeight = function() {
    var h_height, scrollTop, w_height;
    if (!this._scroller) {
      return;
    }
    w_height = $(window).innerHeight();
    h_height = this.$header.outerHeight();
    scrollTop = this.$collapse_div.scrollTop();
    if ((h_height + this.$collapse_div.css({
      'max-height': 'none'
    }).outerHeight()) > w_height) {
      this.$collapse_div.css({
        'max-height': w_height - h_height
      });
    } else {
      this.$collapse_div.css({
        'max-height': 'none'
      });
    }
    return this.$collapse_div.pixelSlimScroll({
      scrollTo: scrollTop + 'px'
    });
  };


  /*
   * Detecting a change of the window height.
   */

  PixelAdmin.MainNavbar.prototype._watchWindowHeight = function() {
    var checkWindowInnerHeight;
    this._wheight = $(window).innerHeight();
    checkWindowInnerHeight = (function(_this) {
      return function() {
        if (_this._wheight === null) {
          return;
        }
        if (_this._wheight !== $(window).innerHeight()) {
          _this._updateCollapseHeight();
        }
        _this._wheight = $(window).innerHeight();
        return setTimeout(checkWindowInnerHeight, 100);
      };
    })(this);
    return window.setTimeout(checkWindowInnerHeight, 100);
  };

  PixelAdmin.MainNavbar.Constructor = PixelAdmin.MainNavbar;

  PixelAdmin.addInitializer(function() {
    return PixelAdmin.initPlugin('main_navbar', new PixelAdmin.MainNavbar);
  });

}).call(this);
;

/*
 * Class that provides the main menu functionality.
 *
 * @class MainMenu
 */

(function() {
  PixelAdmin.MainMenu = function() {
    this._screen = null;
    this._last_screen = null;
    this._animate = false;
    this._close_timer = null;
    this._dropdown_li = null;
    this._dropdown = null;
    return this;
  };


  /*
   * Initialize plugin.
   */

  PixelAdmin.MainMenu.prototype.init = function() {
    var self, state;
    this.$menu = $('#main-menu');
    if (!this.$menu.length) {
      return;
    }
    this.$body = $('body');
    this.menu = this.$menu[0];
    this.$ssw_point = $('#small-screen-width-point');
    this.$tsw_point = $('#tablet-screen-width-point');
    self = this;
    if (PixelAdmin.settings.main_menu.store_state) {
      state = this._getMenuState();
      document.body.className += ' disable-mm-animation';
      if (state !== null) {
        this.$body[state === 'collapsed' ? 'addClass' : 'removeClass']('mmc');
      }
      setTimeout((function(_this) {
        return function() {
          return elRemoveClass(document.body, 'disable-mm-animation');
        };
      })(this), 20);
    }
    this.setupAnimation();
    $(window).on('resize.pa.mm', $.proxy(this.onResize, this));
    this.onResize();
    this.$menu.find('.navigation > .mm-dropdown').addClass('mm-dropdown-root');
    if (PixelAdmin.settings.main_menu.detect_active) {
      this.detectActiveItem();
    }
    if ($.support.transition) {
      this.$menu.on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', $.proxy(this._onAnimationEnd, this));
    }
    $('#main-menu-toggle').on('click', $.proxy(this.toggle, this));
    $('#main-menu-inner').slimScroll({
      height: '100%'
    }).on('slimscrolling', (function(_this) {
      return function() {
        return _this.closeCurrentDropdown(true);
      };
    })(this));
    this.$menu.on('click', '.mm-dropdown > a', function() {
      var li;
      li = this.parentNode;
      if (elHasClass(li, 'mm-dropdown-root') && self._collapsed()) {
        if (elHasClass(li, 'mmc-dropdown-open')) {
          if (elHasClass(li, 'freeze')) {
            self.closeCurrentDropdown(true);
          } else {
            self.freezeDropdown(li);
          }
        } else {
          self.openDropdown(li, true);
        }
      } else {
        self.toggleSubmenu(li);
      }
      return false;
    });
    this.$menu.find('.navigation').on('mouseenter.pa.mm-dropdown', '.mm-dropdown-root', function() {
      self.clearCloseTimer();
      if (self._dropdown_li === this) {
        return;
      }
      if (self._collapsed() && (!self._dropdown_li || !elHasClass(self._dropdown_li, 'freeze'))) {
        return self.openDropdown(this);
      }
    }).on('mouseleave.pa.mm-dropdown', '.mm-dropdown-root', function() {
      return self._close_timer = setTimeout(function() {
        return self.closeCurrentDropdown();
      }, PixelAdmin.settings.main_menu.dropdown_close_delay);
    });
    return this;
  };

  PixelAdmin.MainMenu.prototype._collapsed = function() {
    return (this._screen === 'desktop' && elHasClass(document.body, 'mmc')) || (this._screen !== 'desktop' && !elHasClass(document.body, 'mme'));
  };

  PixelAdmin.MainMenu.prototype.onResize = function() {
    this._screen = getScreenSize(this.$ssw_point, this.$tsw_point);
    this._animate = PixelAdmin.settings.main_menu.disable_animation_on.indexOf(screen) === -1;
    if (this._dropdown_li) {
      this.closeCurrentDropdown(true);
    }
    if ((this._screen === 'small' && this._last_screen !== this._screen) || (this._screen === 'tablet' && this._last_screen === 'small')) {
      document.body.className += ' disable-mm-animation';
      setTimeout((function(_this) {
        return function() {
          return elRemoveClass(document.body, 'disable-mm-animation');
        };
      })(this), 20);
    }
    return this._last_screen = this._screen;
  };

  PixelAdmin.MainMenu.prototype.clearCloseTimer = function() {
    if (this._close_timer) {
      clearTimeout(this._close_timer);
      return this._close_timer = null;
    }
  };

  PixelAdmin.MainMenu.prototype._onAnimationEnd = function(e) {
    if (this._screen !== 'desktop' || e.target.id !== 'main-menu') {
      return;
    }
    return $(window).trigger('resize');
  };

  PixelAdmin.MainMenu.prototype.toggle = function() {
    var cls, collapse;
    cls = this._screen === 'small' || this._screen === 'tablet' ? 'mme' : 'mmc';
    if (elHasClass(document.body, cls)) {
      elRemoveClass(document.body, cls);
    } else {
      document.body.className += ' ' + cls;
    }
    if (cls === 'mmc') {
      if (PixelAdmin.settings.main_menu.store_state) {
        this._storeMenuState(elHasClass(document.body, 'mmc'));
      }
      if (!$.support.transition) {
        return $(window).trigger('resize');
      }
    } else {
      collapse = document.getElementById('');
      $('#main-navbar-collapse').stop().removeClass('in collapsing').addClass('collapse')[0].style.height = '0px';
      return $('#main-navbar .navbar-toggle').addClass('collapsed');
    }
  };

  PixelAdmin.MainMenu.prototype.toggleSubmenu = function(li) {
    this[elHasClass(li, 'open') ? 'collapseSubmenu' : 'expandSubmenu'](li);
    return false;
  };

  PixelAdmin.MainMenu.prototype.collapseSubmenu = function(li) {
    var $li, $ul;
    $li = $(li);
    $ul = $li.find('> ul');
    if (this._animate) {
      $ul.animate({
        height: 0
      }, PixelAdmin.settings.main_menu.animation_speed, (function(_this) {
        return function() {
          elRemoveClass(li, 'open');
          $ul.attr('style', '');
          return $li.find('.mm-dropdown.open').removeClass('open').find('> ul').attr('style', '');
        };
      })(this));
    } else {
      elRemoveClass(li, 'open');
    }
    return false;
  };

  PixelAdmin.MainMenu.prototype.expandSubmenu = function(li) {
    var $li, $ul, h, ul;
    $li = $(li);
    if (PixelAdmin.settings.main_menu.accordion) {
      this.collapseAllSubmenus(li);
    }
    if (this._animate) {
      $ul = $li.find('> ul');
      ul = $ul[0];
      ul.className += ' get-height';
      h = $ul.height();
      elRemoveClass(ul, 'get-height');
      ul.style.display = 'block';
      ul.style.height = '0px';
      li.className += ' open';
      return $ul.animate({
        height: h
      }, PixelAdmin.settings.main_menu.animation_speed, (function(_this) {
        return function() {
          return $ul.attr('style', '');
        };
      })(this));
    } else {
      return li.className += ' open';
    }
  };

  PixelAdmin.MainMenu.prototype.collapseAllSubmenus = function(li) {
    var self;
    self = this;
    return $(li).parent().find('> .mm-dropdown.open').each(function() {
      return self.collapseSubmenu(this);
    });
  };

  PixelAdmin.MainMenu.prototype.openDropdown = function(li, freeze) {
    var $li, $title, $ul, $wrapper, max_height, min_height, title_h, top, ul, w_height, wrapper;
    if (freeze == null) {
      freeze = false;
    }
    if (this._dropdown_li) {
      this.closeCurrentDropdown(freeze);
    }
    $li = $(li);
    $ul = $li.find('> ul');
    ul = $ul[0];
    this._dropdown_li = li;
    this._dropdown = ul;
    $title = $ul.find('> .mmc-title');
    if (!$title.length) {
      $title = $('<div class="mmc-title"></div>').text($li.find('> a > .mm-text').text());
      ul.insertBefore($title[0], ul.firstChild);
    }
    li.className += ' mmc-dropdown-open';
    ul.className += ' mmc-dropdown-open-ul';
    top = $li.position().top;
    if (elHasClass(document.body, 'main-menu-fixed')) {
      $wrapper = $ul.find('.mmc-wrapper');
      if (!$wrapper.length) {
        wrapper = document.createElement('div');
        wrapper.className = 'mmc-wrapper';
        wrapper.style.overflow = 'hidden';
        wrapper.style.position = 'relative';
        $wrapper = $(wrapper);
        $wrapper.append($ul.find('> li'));
        ul.appendChild(wrapper);
      }
      w_height = $(window).innerHeight();
      title_h = $title.outerHeight();
      min_height = title_h + $ul.find('.mmc-wrapper > li').first().outerHeight() * 3;
      if ((top + min_height) > w_height) {
        max_height = top - $('#main-navbar').outerHeight();
        ul.className += ' top';
        ul.style.bottom = (w_height - top - title_h) + 'px';
      } else {
        max_height = w_height - top - title_h;
        ul.style.top = top + 'px';
      }
      if (elHasClass(ul, 'top')) {
        ul.appendChild($title[0]);
      } else {
        ul.insertBefore($title[0], ul.firstChild);
      }
      li.className += ' slimscroll-attached';
      $wrapper[0].style.maxHeight = (max_height - 10) + 'px';
      $wrapper.pixelSlimScroll({});
    } else {
      ul.style.top = top + 'px';
    }
    if (freeze) {
      this.freezeDropdown(li);
    }
    if (!freeze) {
      $ul.on('mouseenter', (function(_this) {
        return function() {
          return _this.clearCloseTimer();
        };
      })(this)).on('mouseleave', (function(_this) {
        return function() {
          return _this._close_timer = setTimeout(function() {
            return _this.closeCurrentDropdown();
          }, PixelAdmin.settings.main_menu.dropdown_close_delay);
        };
      })(this));
      this;
    }
    return this.menu.appendChild(ul);
  };

  PixelAdmin.MainMenu.prototype.closeCurrentDropdown = function(force) {
    var $dropdown, $wrapper;
    if (force == null) {
      force = false;
    }
    if (!this._dropdown_li || (elHasClass(this._dropdown_li, 'freeze') && !force)) {
      return;
    }
    this.clearCloseTimer();
    $dropdown = $(this._dropdown);
    if (elHasClass(this._dropdown_li, 'slimscroll-attached')) {
      elRemoveClass(this._dropdown_li, 'slimscroll-attached');
      $wrapper = $dropdown.find('.mmc-wrapper');
      $wrapper.pixelSlimScroll({
        destroy: 'destroy'
      }).find('> *').appendTo($dropdown);
      $wrapper.remove();
    }
    this._dropdown_li.appendChild(this._dropdown);
    elRemoveClass(this._dropdown, 'mmc-dropdown-open-ul');
    elRemoveClass(this._dropdown, 'top');
    elRemoveClass(this._dropdown_li, 'mmc-dropdown-open');
    elRemoveClass(this._dropdown_li, 'freeze');
    $(this._dropdown_li).attr('style', '');
    $dropdown.attr('style', '').off('mouseenter').off('mouseleave');
    this._dropdown = null;
    return this._dropdown_li = null;
  };

  PixelAdmin.MainMenu.prototype.freezeDropdown = function(li) {
    return li.className += ' freeze';
  };

  PixelAdmin.MainMenu.prototype.setupAnimation = function() {
    var $mm, $mm_nav, d_body, dsbl_animation_on;
    d_body = document.body;
    dsbl_animation_on = PixelAdmin.settings.main_menu.disable_animation_on;
    d_body.className += ' dont-animate-mm-content';
    $mm = $('#main-menu');
    $mm_nav = $mm.find('.navigation');
    $mm_nav.find('> .mm-dropdown > ul').addClass('mmc-dropdown-delay animated');
    $mm_nav.find('> li > a > .mm-text').addClass('mmc-dropdown-delay animated fadeIn');
    $mm.find('.menu-content').addClass('animated fadeIn');
    if (elHasClass(d_body, 'main-menu-right') || (elHasClass(d_body, 'right-to-left') && !elHasClass(d_body, 'main-menu-right'))) {
      $mm_nav.find('> .mm-dropdown > ul').addClass('fadeInRight');
    } else {
      $mm_nav.find('> .mm-dropdown > ul').addClass('fadeInLeft');
    }
    d_body.className += dsbl_animation_on.indexOf('small') === -1 ? ' animate-mm-sm' : ' dont-animate-mm-content-sm';
    d_body.className += dsbl_animation_on.indexOf('tablet') === -1 ? ' animate-mm-md' : ' dont-animate-mm-content-md';
    d_body.className += dsbl_animation_on.indexOf('desktop') === -1 ? ' animate-mm-lg' : ' dont-animate-mm-content-lg';
    return window.setTimeout(function() {
      return elRemoveClass(d_body, 'dont-animate-mm-content');
    }, 500);
  };

  PixelAdmin.MainMenu.prototype.detectActiveItem = function() {
    var a, bubble, links, nav, predicate, url, _i, _len, _results;
    url = (document.location + '').replace(/\#.*?$/, '');
    predicate = PixelAdmin.settings.main_menu.detect_active_predicate;
    nav = $('#main-menu .navigation');
    nav.find('li').removeClass('open active');
    links = nav[0].getElementsByTagName('a');
    bubble = (function(_this) {
      return function(li) {
        li.className += ' active';
        if (!elHasClass(li.parentNode, 'navigation')) {
          li = li.parentNode.parentNode;
          li.className += ' open';
          return bubble(li);
        }
      };
    })(this);
    _results = [];
    for (_i = 0, _len = links.length; _i < _len; _i++) {
      a = links[_i];
      if (a.href.indexOf('#') === -1 && predicate(a.href, url)) {
        bubble(a.parentNode);
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };


  /*
   * Load menu state.
   */

  PixelAdmin.MainMenu.prototype._getMenuState = function() {
    return PixelAdmin.getStoredValue(PixelAdmin.settings.main_menu.store_state_key, null);
  };


  /*
   * Store menu state.
   */

  PixelAdmin.MainMenu.prototype._storeMenuState = function(is_collapsed) {
    if (!PixelAdmin.settings.main_menu.store_state) {
      return;
    }
    return PixelAdmin.storeValue(PixelAdmin.settings.main_menu.store_state_key, is_collapsed ? 'collapsed' : 'expanded');
  };

  PixelAdmin.MainMenu.Constructor = PixelAdmin.MainMenu;

  PixelAdmin.addInitializer(function() {
    return PixelAdmin.initPlugin('main_menu', new PixelAdmin.MainMenu);
  });

}).call(this);
;

(function($) {

  jQuery.fn.extend({
    pixelSlimScroll: function(options) {

      var defaults = {

        // width in pixels of the visible scroll area
        width : 'auto',

        // width in pixels of the scrollbar and rail
        size : '2px',

        // scrollbar color, accepts any hex/color value
        color: '#000',

        // distance in pixels between the side edge and the scrollbar
        distance : '1px',

        // default scroll position on load - top / bottom / $('selector')
        start : 'top',

        // sets scrollbar opacity
        opacity : .4,

        // sets rail color
        railColor : '#333',

        // sets rail opacity
        railOpacity : .2,

        // defautlt CSS class of the slimscroll rail
        railClass : 'slimScrollRail',

        // defautlt CSS class of the slimscroll bar
        barClass : 'slimScrollBar',

        // defautlt CSS class of the slimscroll wrapper
        wrapperClass : 'slimScrollDiv',

        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll : false,

        // scroll amount applied to each mouse wheel step
        wheelStep : 20,

        // scroll amount applied when user is using gestures
        touchScrollStep : 200,

        // sets border radius
        borderRadius: '0px',

        // sets border radius of the rail
        railBorderRadius : '0px'
      };

      var o = $.extend(defaults, options);

      // do it for every element that matches selector
      this.each(function(){

      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
        barHeight, percentScroll, lastScroll,
        divS = '<div></div>',
        minBarHeight = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
            // start from last bar position
            var offset = me.scrollTop();

            // find bar and rail
            bar = me.parent().find('.' + o.barClass);
            rail = me.parent().find('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {
              if ('scrollTo' in options)
              {
                // jump to a static point
                offset = parseInt(o.scrollTo);
              }
              else if ('scrollBy' in options)
              {
                // jump by value pixels
                offset += parseInt(o.scrollBy);
              }
              else if ('destroy' in options)
              {
                // remove slimscroll elements
                bar.remove();
                rail.remove();
                me.unwrap();
                return;
              }

              // scroll content by the given offset
              scrollContent(offset, false, true);
            }

            return;
        }

        // wrap content
        var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
            position: 'relative',
            overflow: 'hidden',
            width: o.width
          });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width
        });

        // create scrollbar rail
        var rail = $(divS)
          .addClass(o.railClass)
          .css({
            width: o.size,
            height: '100%',
            position: 'absolute',
            top: 0,
            display: 'none',
            'border-radius': o.railBorderRadius,
            background: o.railColor,
            opacity: o.railOpacity,
            zIndex: 90
          });

        // create scrollbar
        var bar = $(divS)
          .addClass(o.barClass)
          .css({
            background: o.color,
            width: o.size,
            position: 'absolute',
            top: 0,
            opacity: o.opacity,
            display: 'block',
            'border-radius' : o.borderRadius,
            BorderRadius: o.borderRadius,
            MozBorderRadius: o.borderRadius,
            WebkitBorderRadius: o.borderRadius,
            zIndex: 99
          });

        // set position
        rail.css({ right: o.distance });
        bar.css({ right: o.distance });

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // make it draggable and no longer dependent on the jqueryUI
        bar.bind("mousedown", function(e) {
          var $doc = $(document);
          isDragg = true;
          t = parseFloat(bar.css('top'));
          pageY = e.pageY;

          $doc.bind("mousemove.slimscroll", function(e){
            currTop = t + e.pageY - pageY;
            bar.css('top', currTop);
            scrollContent(0, bar.position().top, false);// scroll content
          });

          $doc.bind("mouseup.slimscroll", function(e) {
            isDragg = false;hideBar();
            $doc.unbind('.slimscroll');
          });
          return false;
        }).bind("selectstart.slimscroll", function(e){
          e.stopPropagation();
          e.preventDefault();
          return false;
        });

        // on rail over
        rail.hover(function(){
          showBar();
        }, function(){
          hideBar();
        });

        // on bar over
        bar.hover(function(){
          isOverBar = true;
        }, function(){
          isOverBar = false;
        });

        // show on parent mouseover
        me.hover(function(){
          isOverPanel = true;
          showBar();
          hideBar();
        }, function(){
          isOverPanel = false;
          hideBar();
        });

        // support for mobile
        me.bind('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        me.bind('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        // set up initial height
        getBarHeight();

        // attach scroll events
        attachWheel();

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          var e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          if (e.detail) { delta = e.detail / 3; }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(delta, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
          if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxTop = me.outerHeight() - bar.outerHeight();

          if (isWheel)
          {
            // move bar with mouse wheel
            delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxTop);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({ top: delta + 'px' });
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

          if (isJump)
          {
            delta = y;
            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({ top: offsetTop + 'px' });
          }

          // scroll content
          me.scrollTop(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          hideBar();
        }

        function attachWheel()
        {
          if (window.addEventListener)
          {
            this.addEventListener('DOMMouseScroll', _onWheel, false );
            this.addEventListener('mousewheel', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel)
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({ height: barHeight + 'px' });

          // hide scrollbar if content is not long enough
          var display = barHeight == me.outerHeight() ? 'none' : 'block';
          bar.css({ display: display });
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
                var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if(barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true,true).fadeIn('fast');
        }

        function hideBar() { }

      });

      // maintain chainability
      return this;
    }
  });

  jQuery.fn.extend({
    pixelslimscroll: jQuery.fn.pixelSlimScroll
  });

})(jQuery);
;
/**
 * bootbox.js v4.2.0
 *
 * http://bootboxjs.com/license.txt
 */
!function(a,b){"use strict";"function"==typeof define&&define.amd?define(["jquery"],b):"object"==typeof exports?module.exports=b(require("jquery")):a.bootbox=b(a.jQuery)}(this,function a(b,c){"use strict";function d(a){var b=q[o.locale];return b?b[a]:q.en[a]}function e(a,c,d){a.stopPropagation(),a.preventDefault();var e=b.isFunction(d)&&d(a)===!1;e||c.modal("hide")}function f(a){var b,c=0;for(b in a)c++;return c}function g(a,c){var d=0;b.each(a,function(a,b){c(a,b,d++)})}function h(a){var c,d;if("object"!=typeof a)throw new Error("Please supply an object of options");if(!a.message)throw new Error("Please specify a message");return a=b.extend({},o,a),a.buttons||(a.buttons={}),a.backdrop=a.backdrop?"static":!1,c=a.buttons,d=f(c),g(c,function(a,e,f){if(b.isFunction(e)&&(e=c[a]={callback:e}),"object"!==b.type(e))throw new Error("button with key "+a+" must be an object");e.label||(e.label=a),e.className||(e.className=2>=d&&f===d-1?"btn-primary":"btn-default")}),a}function i(a,b){var c=a.length,d={};if(1>c||c>2)throw new Error("Invalid argument length");return 2===c||"string"==typeof a[0]?(d[b[0]]=a[0],d[b[1]]=a[1]):d=a[0],d}function j(a,c,d){return b.extend(!0,{},a,i(c,d))}function k(a,b,c,d){var e={className:"bootbox-"+a,buttons:l.apply(null,b)};return m(j(e,d,c),b)}function l(){for(var a={},b=0,c=arguments.length;c>b;b++){var e=arguments[b],f=e.toLowerCase(),g=e.toUpperCase();a[f]={label:d(g)}}return a}function m(a,b){var d={};return g(b,function(a,b){d[b]=!0}),g(a.buttons,function(a){if(d[a]===c)throw new Error("button key "+a+" is not allowed (options are "+b.join("\n")+")")}),a}var n={dialog:"<div class='bootbox modal' tabindex='-1' role='dialog'><div class='modal-dialog'><div class='modal-content'><div class='modal-body'><div class='bootbox-body'></div></div></div></div></div>",header:"<div class='modal-header'><h4 class='modal-title'></h4></div>",footer:"<div class='modal-footer'></div>",closeButton:"<button type='button' class='bootbox-close-button close' data-dismiss='modal' aria-hidden='true'>&times;</button>",form:"<form class='bootbox-form'></form>",inputs:{text:"<input class='bootbox-input bootbox-input-text form-control' autocomplete=off type=text />",textarea:"<textarea class='bootbox-input bootbox-input-textarea form-control'></textarea>",email:"<input class='bootbox-input bootbox-input-email form-control' autocomplete='off' type='email' />",select:"<select class='bootbox-input bootbox-input-select form-control'></select>",checkbox:"<div class='checkbox'><label><input class='bootbox-input bootbox-input-checkbox' type='checkbox' /></label></div>",date:"<input class='bootbox-input bootbox-input-date form-control' autocomplete=off type='date' />",time:"<input class='bootbox-input bootbox-input-time form-control' autocomplete=off type='time' />",number:"<input class='bootbox-input bootbox-input-number form-control' autocomplete=off type='number' />",password:"<input class='bootbox-input bootbox-input-password form-control' autocomplete='off' type='password' />"}},o={locale:"en",backdrop:!0,animate:!0,className:null,closeButton:!0,show:!0,container:"body"},p={};p.alert=function(){var a;if(a=k("alert",["ok"],["message","callback"],arguments),a.callback&&!b.isFunction(a.callback))throw new Error("alert requires callback property to be a function when provided");return a.buttons.ok.callback=a.onEscape=function(){return b.isFunction(a.callback)?a.callback():!0},p.dialog(a)},p.confirm=function(){var a;if(a=k("confirm",["cancel","confirm"],["message","callback"],arguments),a.buttons.cancel.callback=a.onEscape=function(){return a.callback(!1)},a.buttons.confirm.callback=function(){return a.callback(!0)},!b.isFunction(a.callback))throw new Error("confirm requires a callback");return p.dialog(a)},p.prompt=function(){var a,d,e,f,h,i,k;f=b(n.form),d={className:"bootbox-prompt",buttons:l("cancel","confirm"),value:"",inputType:"text"},a=m(j(d,arguments,["title","callback"]),["cancel","confirm"]),i=a.show===c?!0:a.show;var o=["date","time","number"],q=document.createElement("input");if(q.setAttribute("type",a.inputType),o[a.inputType]&&(a.inputType=q.type),a.message=f,a.buttons.cancel.callback=a.onEscape=function(){return a.callback(null)},a.buttons.confirm.callback=function(){var c;switch(a.inputType){case"text":case"textarea":case"email":case"select":case"date":case"time":case"number":case"password":c=h.val();break;case"checkbox":var d=h.find("input:checked");c=[],g(d,function(a,d){c.push(b(d).val())})}return a.callback(c)},a.show=!1,!a.title)throw new Error("prompt requires a title");if(!b.isFunction(a.callback))throw new Error("prompt requires a callback");if(!n.inputs[a.inputType])throw new Error("invalid prompt type");switch(h=b(n.inputs[a.inputType]),a.inputType){case"text":case"textarea":case"email":case"date":case"time":case"number":case"password":h.val(a.value);break;case"select":var r={};if(k=a.inputOptions||[],!k.length)throw new Error("prompt with select requires options");g(k,function(a,d){var e=h;if(d.value===c||d.text===c)throw new Error("given options in wrong format");d.group&&(r[d.group]||(r[d.group]=b("<optgroup/>").attr("label",d.group)),e=r[d.group]),e.append("<option value='"+d.value+"'>"+d.text+"</option>")}),g(r,function(a,b){h.append(b)}),h.val(a.value);break;case"checkbox":var s=b.isArray(a.value)?a.value:[a.value];if(k=a.inputOptions||[],!k.length)throw new Error("prompt with checkbox requires options");if(!k[0].value||!k[0].text)throw new Error("given options in wrong format");h=b("<div/>"),g(k,function(c,d){var e=b(n.inputs[a.inputType]);e.find("input").attr("value",d.value),e.find("label").append(d.text),g(s,function(a,b){b===d.value&&e.find("input").prop("checked",!0)}),h.append(e)})}return a.placeholder&&h.attr("placeholder",a.placeholder),a.pattern&&h.attr("pattern",a.pattern),f.append(h),f.on("submit",function(a){a.preventDefault(),e.find(".btn-primary").click()}),e=p.dialog(a),e.off("shown.bs.modal"),e.on("shown.bs.modal",function(){h.focus()}),i===!0&&e.modal("show"),e},p.dialog=function(a){a=h(a);var c=b(n.dialog),d=c.find(".modal-body"),f=a.buttons,i="",j={onEscape:a.onEscape};if(g(f,function(a,b){i+="<button data-bb-handler='"+a+"' type='button' class='btn "+b.className+"'>"+b.label+"</button>",j[a]=b.callback}),d.find(".bootbox-body").html(a.message),a.animate===!0&&c.addClass("fade"),a.className&&c.addClass(a.className),a.title&&d.before(n.header),a.closeButton){var k=b(n.closeButton);a.title?c.find(".modal-header").prepend(k):k.css("margin-top","-10px").prependTo(d)}return a.title&&c.find(".modal-title").html(a.title),i.length&&(d.after(n.footer),c.find(".modal-footer").html(i)),c.on("hidden.bs.modal",function(a){a.target===this&&c.remove()}),c.on("shown.bs.modal",function(){c.find(".btn-primary:first").focus()}),c.on("escape.close.bb",function(a){j.onEscape&&e(a,c,j.onEscape)}),c.on("click",".modal-footer button",function(a){var d=b(this).data("bb-handler");e(a,c,j[d])}),c.on("click",".bootbox-close-button",function(a){e(a,c,j.onEscape)}),c.on("keyup",function(a){27===a.which&&c.trigger("escape.close.bb")}),b(a.container).append(c),c.modal({backdrop:a.backdrop,keyboard:!1,show:!1}),a.show&&c.modal("show"),c},p.setDefaults=function(){var a={};2===arguments.length?a[arguments[0]]=arguments[1]:a=arguments[0],b.extend(o,a)},p.hideAll=function(){b(".bootbox").modal("hide")};var q={br:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Sim"},da:{OK:"OK",CANCEL:"Annuller",CONFIRM:"Accepter"},de:{OK:"OK",CANCEL:"Abbrechen",CONFIRM:"Akzeptieren"},en:{OK:"OK",CANCEL:"Cancel",CONFIRM:"OK"},es:{OK:"OK",CANCEL:"Cancelar",CONFIRM:"Aceptar"},fi:{OK:"OK",CANCEL:"Peruuta",CONFIRM:"OK"},fr:{OK:"OK",CANCEL:"Annuler",CONFIRM:"D'accord"},he:{OK:"אישור",CANCEL:"ביטול",CONFIRM:"אישור"},it:{OK:"OK",CANCEL:"Annulla",CONFIRM:"Conferma"},lt:{OK:"Gerai",CANCEL:"Atšaukti",CONFIRM:"Patvirtinti"},lv:{OK:"Labi",CANCEL:"Atcelt",CONFIRM:"Apstiprināt"},nl:{OK:"OK",CANCEL:"Annuleren",CONFIRM:"Accepteren"},no:{OK:"OK",CANCEL:"Avbryt",CONFIRM:"OK"},pl:{OK:"OK",CANCEL:"Anuluj",CONFIRM:"Potwierdź"},ru:{OK:"OK",CANCEL:"Отмена",CONFIRM:"Применить"},sv:{OK:"OK",CANCEL:"Avbryt",CONFIRM:"OK"},tr:{OK:"Tamam",CANCEL:"İptal",CONFIRM:"Onayla"},zh_CN:{OK:"OK",CANCEL:"取消",CONFIRM:"确认"},zh_TW:{OK:"OK",CANCEL:"取消",CONFIRM:"確認"}};return p.init=function(c){return a(c||b)},p});;
/*
jQuery Growl
Copyright 2013 Kevin Sylvestre
1.1.5

Copyright (c) 2010 - 2013 Kevin Sylvestre

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


(function() {
  "use strict";
  var $, Animation, Growl,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = jQuery;

  Animation = (function() {
    function Animation() {}

    Animation.transitions = {
      "webkitTransition": "webkitTransitionEnd",
      "mozTransition": "mozTransitionEnd",
      "oTransition": "oTransitionEnd",
      "transition": "transitionend"
    };

    Animation.transition = function($el) {
      var el, result, type, _ref;
      el = $el[0];
      _ref = this.transitions;
      for (type in _ref) {
        result = _ref[type];
        if (el.style[type] != null) {
          return result;
        }
      }
    };

    return Animation;

  })();

  Growl = (function() {
    Growl.settings = {
      namespace: 'growl',
      duration: 3200,
      close: "&times;",
      location: "default",
      style: "default",
      size: "medium"
    };

    Growl.growl = function(settings) {
      if (settings == null) {
        settings = {};
      }
      this.initialize();
      return new Growl(settings);
    };

    Growl.initialize = function() {
      return $("body:not(:has(#growls))").append('<div id="growls" />');
    };

    function Growl(settings) {
      if (settings == null) {
        settings = {};
      }
      this.html = __bind(this.html, this);
      this.$growl = __bind(this.$growl, this);
      this.$growls = __bind(this.$growls, this);
      this.animate = __bind(this.animate, this);
      this.remove = __bind(this.remove, this);
      this.dismiss = __bind(this.dismiss, this);
      this.present = __bind(this.present, this);
      this.close = __bind(this.close, this);
      this.cycle = __bind(this.cycle, this);
      this.unbind = __bind(this.unbind, this);
      this.bind = __bind(this.bind, this);
      this.render = __bind(this.render, this);
      this.settings = $.extend({}, Growl.settings, settings);
      this.$growls().attr('class', this.settings.location);
      this.render();
    }

    Growl.prototype.render = function() {
      var $growl;
      $growl = this.$growl();
      this.$growls().append($growl);
      this.cycle($growl);
    };

    Growl.prototype.bind = function($growl) {
      if ($growl == null) {
        $growl = this.$growl();
      }
      return $growl.find("." + this.settings.namespace + "-close").on("click", this.close);
    };

    Growl.prototype.unbind = function($growl) {
      if ($growl == null) {
        $growl = this.$growl();
      }
      return $growl.find("." + (this.settings.namespace - close)).off("click", this.close);
    };

    Growl.prototype.cycle = function($growl) {
      if ($growl == null) {
        $growl = this.$growl();
      }
      return $growl.queue(this.present).delay(this.settings.duration).queue(this.dismiss).queue(this.remove);
    };

    Growl.prototype.close = function(event) {
      var $growl;
      event.preventDefault();
      event.stopPropagation();
      $growl = this.$growl();
      return $growl.stop().queue(this.dismiss).queue(this.remove);
    };

    Growl.prototype.present = function(callback) {
      var $growl;
      $growl = this.$growl();
      this.bind($growl);
      return this.animate($growl, "" + this.settings.namespace + "-incoming", 'out', callback);
    };

    Growl.prototype.dismiss = function(callback) {
      var $growl;
      $growl = this.$growl();
      this.unbind($growl);
      return this.animate($growl, "" + this.settings.namespace + "-outgoing", 'in', callback);
    };

    Growl.prototype.remove = function(callback) {
      this.$growl().remove();
      return callback();
    };

    Growl.prototype.animate = function($element, name, direction, callback) {
      var transition;
      if (direction == null) {
        direction = 'in';
      }
      transition = Animation.transition($element);
      $element[direction === 'in' ? 'removeClass' : 'addClass'](name);
      $element.offset().position;
      $element[direction === 'in' ? 'addClass' : 'removeClass'](name);
      if (callback == null) {
        return;
      }
      if (transition != null) {
        $element.one(transition, callback);
      } else {
        callback();
      }
    };

    Growl.prototype.$growls = function() {
      return this.$_growls != null ? this.$_growls : this.$_growls = $('#growls');
    };

    Growl.prototype.$growl = function() {
      return this.$_growl != null ? this.$_growl : this.$_growl = $(this.html());
    };

    Growl.prototype.html = function() {
      return "<div class='" + this.settings.namespace + " " + this.settings.namespace + "-" + this.settings.style + " " + this.settings.namespace + "-" + this.settings.size + "'>\n  <div class='" + this.settings.namespace + "-close'>" + this.settings.close + "</div>\n  <div class='" + this.settings.namespace + "-title'>" + this.settings.title + "</div>\n  <div class='" + this.settings.namespace + "-message'>" + this.settings.message + "</div>\n</div>";
    };

    return Growl;

  })();

  $.growl = function(options) {
    if (options == null) {
      options = {};
    }
    return Growl.growl(options);
  };

  $.growl.error = function(options) {
    var settings;
    if (options == null) {
      options = {};
    }
    settings = {
      title: "Error!",
      style: "error"
    };
    return $.growl($.extend(settings, options));
  };

  $.growl.notice = function(options) {
    var settings;
    if (options == null) {
      options = {};
    }
    settings = {
      title: "Notice!",
      style: "notice"
    };
    return $.growl($.extend(settings, options));
  };

  $.growl.warning = function(options) {
    var settings;
    if (options == null) {
      options = {};
    }
    settings = {
      title: "Warning!",
      style: "warning"
    };
    return $.growl($.extend(settings, options));
  };

}).call(this);
;
/*! Copyright (c) 2011 Piotr Rochala (http://rocha.la)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Version: 1.3.2
 *
 */
(function($) {

  jQuery.fn.extend({
    slimScroll: function(options) {

      var defaults = {

        // width in pixels of the visible scroll area
        width : 'auto',

        // height in pixels of the visible scroll area
        height : '250px',

        // width in pixels of the scrollbar and rail
        size : '7px',

        // scrollbar color, accepts any hex/color value
        color: '#000',

        // scrollbar position - left/right
        position : 'right',

        // distance in pixels between the side edge and the scrollbar
        distance : '1px',

        // default scroll position on load - top / bottom / $('selector')
        start : 'top',

        // sets scrollbar opacity
        opacity : .4,

        // enables always-on mode for the scrollbar
        alwaysVisible : false,

        // check if we should hide the scrollbar when user is hovering over
        disableFadeOut : false,

        // sets visibility of the rail
        railVisible : false,

        // sets rail color
        railColor : '#333',

        // sets rail opacity
        railOpacity : .2,

        // whether  we should use jQuery UI Draggable to enable bar dragging
        railDraggable : true,

        // defautlt CSS class of the slimscroll rail
        railClass : 'slimScrollRail',

        // defautlt CSS class of the slimscroll bar
        barClass : 'slimScrollBar',

        // defautlt CSS class of the slimscroll wrapper
        wrapperClass : 'slimScrollDiv',

        // check if mousewheel should scroll the window if we reach top/bottom
        allowPageScroll : false,

        // scroll amount applied to each mouse wheel step
        wheelStep : 20,

        // scroll amount applied when user is using gestures
        touchScrollStep : 200,

        // sets border radius
        borderRadius: '7px',

        // sets border radius of the rail
        railBorderRadius : '7px'
      };

      var o = $.extend(defaults, options);

      // do it for every element that matches selector
      this.each(function(){

      var isOverPanel, isOverBar, isDragg, queueHide, touchDif,
        barHeight, percentScroll, lastScroll,
        divS = '<div></div>',
        minBarHeight = 30,
        releaseScroll = false;

        // used in event handlers and for better minification
        var me = $(this);

        // ensure we are not binding it again
        if (me.parent().hasClass(o.wrapperClass))
        {
            // start from last bar position
            var offset = me.scrollTop();

            // find bar and rail
            bar = me.parent().find('.' + o.barClass);
            rail = me.parent().find('.' + o.railClass);

            getBarHeight();

            // check if we should scroll existing instance
            if ($.isPlainObject(options))
            {
              // Pass height: auto to an existing slimscroll object to force a resize after contents have changed
              if ( 'height' in options && options.height == 'auto' ) {
                me.parent().css('height', 'auto');
                me.css('height', 'auto');
                var height = me.parent().parent().height();
                me.parent().css('height', height);
                me.css('height', height);
              }

              if ('scrollTo' in options)
              {
                // jump to a static point
                offset = parseInt(o.scrollTo);
              }
              else if ('scrollBy' in options)
              {
                // jump by value pixels
                offset += parseInt(o.scrollBy);
              }
              else if ('destroy' in options)
              {
                // remove slimscroll elements
                bar.remove();
                rail.remove();
                me.unwrap();
                return;
              }

              // scroll content by the given offset
              scrollContent(offset, false, true);
            }

            return;
        }

        // optionally set height to the parent's height
        o.height = (options.height == 'auto') ? me.parent().height() : options.height;

        // wrap content
        var wrapper = $(divS)
          .addClass(o.wrapperClass)
          .css({
            position: 'relative',
            overflow: 'hidden',
            width: o.width,
            height: o.height
          });

        // update style for the div
        me.css({
          overflow: 'hidden',
          width: o.width,
          height: o.height
        });

        // create scrollbar rail
        var rail = $(divS)
          .addClass(o.railClass)
          .css({
            width: o.size,
            height: '100%',
            position: 'absolute',
            top: 0,
            display: (o.alwaysVisible && o.railVisible) ? 'block' : 'none',
            'border-radius': o.railBorderRadius,
            background: o.railColor,
            opacity: o.railOpacity,
            zIndex: 90
          });

        // create scrollbar
        var bar = $(divS)
          .addClass(o.barClass)
          .css({
            background: o.color,
            width: o.size,
            position: 'absolute',
            top: 0,
            opacity: o.opacity,
            display: o.alwaysVisible ? 'block' : 'none',
            'border-radius' : o.borderRadius,
            BorderRadius: o.borderRadius,
            MozBorderRadius: o.borderRadius,
            WebkitBorderRadius: o.borderRadius,
            zIndex: 99
          });

        // set position
        var posCss = (o.position == 'right') ? { right: o.distance } : { left: o.distance };
        rail.css(posCss);
        bar.css(posCss);

        // wrap it
        me.wrap(wrapper);

        // append to parent div
        me.parent().append(bar);
        me.parent().append(rail);

        // make it draggable and no longer dependent on the jqueryUI
        if (o.railDraggable){
          bar.bind("mousedown", function(e) {
            var $doc = $(document);
            isDragg = true;
            t = parseFloat(bar.css('top'));
            pageY = e.pageY;

            $doc.bind("mousemove.slimscroll", function(e){
              currTop = t + e.pageY - pageY;
              bar.css('top', currTop);
              scrollContent(0, bar.position().top, false);// scroll content
            });

            $doc.bind("mouseup.slimscroll", function(e) {
              isDragg = false;hideBar();
              $doc.unbind('.slimscroll');
            });
            return false;
          }).bind("selectstart.slimscroll", function(e){
            e.stopPropagation();
            e.preventDefault();
            return false;
          });
        }

        // on rail over
        rail.hover(function(){
          showBar();
        }, function(){
          hideBar();
        });

        // on bar over
        bar.hover(function(){
          isOverBar = true;
        }, function(){
          isOverBar = false;
        });

        // show on parent mouseover
        me.hover(function(){
          isOverPanel = true;
          showBar();
          hideBar();
        }, function(){
          isOverPanel = false;
          hideBar();
        });

        // support for mobile
        me.bind('touchstart', function(e,b){
          if (e.originalEvent.touches.length)
          {
            // record where touch started
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        me.bind('touchmove', function(e){
          // prevent scrolling the page if necessary
          if(!releaseScroll)
          {
  		      e.originalEvent.preventDefault();
		      }
          if (e.originalEvent.touches.length)
          {
            // see how far user swiped
            var diff = (touchDif - e.originalEvent.touches[0].pageY) / o.touchScrollStep;
            // scroll content
            scrollContent(diff, true);
            touchDif = e.originalEvent.touches[0].pageY;
          }
        });

        // set up initial height
        getBarHeight();

        // check start position
        if (o.start === 'bottom')
        {
          // scroll content to bottom
          bar.css({ top: me.outerHeight() - bar.outerHeight() });
          scrollContent(0, true);
        }
        else if (o.start !== 'top')
        {
          // assume jQuery selector
          scrollContent($(o.start).position().top, null, true);

          // make sure bar stays hidden
          if (!o.alwaysVisible) { bar.hide(); }
        }

        // attach scroll events
        attachWheel();

        function _onWheel(e)
        {
          // use mouse wheel only when mouse is over
          if (!isOverPanel) { return; }

          var e = e || window.event;

          var delta = 0;
          if (e.wheelDelta) { delta = -e.wheelDelta/120; }
          if (e.detail) { delta = e.detail / 3; }

          var target = e.target || e.srcTarget || e.srcElement;
          if ($(target).closest('.' + o.wrapperClass).is(me.parent())) {
            // scroll content
            scrollContent(delta, true);
          }

          // stop window scroll
          if (e.preventDefault && !releaseScroll) { e.preventDefault(); }
          if (!releaseScroll) { e.returnValue = false; }
        }

        function scrollContent(y, isWheel, isJump)
        {
          releaseScroll = false;
          var delta = y;
          var maxTop = me.outerHeight() - bar.outerHeight();

          if (isWheel)
          {
            // move bar with mouse wheel
            delta = parseInt(bar.css('top')) + y * parseInt(o.wheelStep) / 100 * bar.outerHeight();

            // move bar, make sure it doesn't go out
            delta = Math.min(Math.max(delta, 0), maxTop);

            // if scrolling down, make sure a fractional change to the
            // scroll position isn't rounded away when the scrollbar's CSS is set
            // this flooring of delta would happened automatically when
            // bar.css is set below, but we floor here for clarity
            delta = (y > 0) ? Math.ceil(delta) : Math.floor(delta);

            // scroll the scrollbar
            bar.css({ top: delta + 'px' });
          }

          // calculate actual scroll amount
          percentScroll = parseInt(bar.css('top')) / (me.outerHeight() - bar.outerHeight());
          delta = percentScroll * (me[0].scrollHeight - me.outerHeight());

          if (isJump)
          {
            delta = y;
            var offsetTop = delta / me[0].scrollHeight * me.outerHeight();
            offsetTop = Math.min(Math.max(offsetTop, 0), maxTop);
            bar.css({ top: offsetTop + 'px' });
          }

          // scroll content
          me.scrollTop(delta);

          // fire scrolling event
          me.trigger('slimscrolling', ~~delta);

          // ensure bar is visible
          showBar();

          // trigger hide when scroll is stopped
          hideBar();
        }

        function attachWheel()
        {
          if (window.addEventListener)
          {
            this.addEventListener('DOMMouseScroll', _onWheel, false );
            this.addEventListener('mousewheel', _onWheel, false );
          }
          else
          {
            document.attachEvent("onmousewheel", _onWheel)
          }
        }

        function getBarHeight()
        {
          // calculate scrollbar height and make sure it is not too small
          barHeight = Math.max((me.outerHeight() / me[0].scrollHeight) * me.outerHeight(), minBarHeight);
          bar.css({ height: barHeight + 'px' });

          // hide scrollbar if content is not long enough
          var display = barHeight == me.outerHeight() ? 'none' : 'block';
          bar.css({ display: display });
        }

        function showBar()
        {
          // recalculate bar height
          getBarHeight();
          clearTimeout(queueHide);

          // when bar reached top or bottom
          if (percentScroll == ~~percentScroll)
          {
            //release wheel
            releaseScroll = o.allowPageScroll;

            // publish approporiate event
            if (lastScroll != percentScroll)
            {
                var msg = (~~percentScroll == 0) ? 'top' : 'bottom';
                me.trigger('slimscroll', msg);
            }
          }
          else
          {
            releaseScroll = false;
          }
          lastScroll = percentScroll;

          // show only when required
          if(barHeight >= me.outerHeight()) {
            //allow window scroll
            releaseScroll = true;
            return;
          }
          bar.stop(true,true).fadeIn('fast');
          if (o.railVisible) { rail.stop(true,true).fadeIn('fast'); }
        }

        function hideBar()
        {
          // only hide when options allow it
          if (!o.alwaysVisible)
          {
            queueHide = setTimeout(function(){
              if (!(o.disableFadeOut && isOverPanel) && !isOverBar && !isDragg)
              {
                bar.fadeOut('slow');
                rail.fadeOut('slow');
              }
            }, 1000);
          }
        }

      });

      // maintain chainability
      return this;
    }
  });

  jQuery.fn.extend({
    slimscroll: jQuery.fn.slimScroll
  });

})(jQuery);
;
(function() {
  var $Vague, blurOff, blurOn, modal_hide, modal_show, _blurred;

  if (!$.fn.modal || !$.fn.Vague || !$('html').hasClass('not-ie')) {
    return;
  }

  modal_show = $.fn.modal.Constructor.prototype.show;

  modal_hide = $.fn.modal.Constructor.prototype.hide;

  $Vague = null;

  _blurred = false;

  blurOn = function() {
    if (_blurred) {
      return;
    }
    if (!$Vague) {
      $Vague = $('#main-wrapper').Vague({
        intensity: 3,
        forceSVGUrl: false
      });
    }
    $Vague.blur();
    return _blurred = true;
  };

  blurOff = function() {
    if (!_blurred) {
      return;
    }
    if ($Vague) {
      $Vague.unblur();
    }
    return _blurred = false;
  };

  $.fn.modal.Constructor.prototype.show = function() {
    modal_show.call(this);
    if (this.$element.hasClass('modal-blur')) {
      $('body').append(this.$element);
      if (getScreenSize($('#small-screen-width-point'), $('#tablet-screen-width-point')) === 'desktop') {
        blurOn();
      }
      return $(window).on('pa.resize.modal_blur', function() {
        if (getScreenSize($('#small-screen-width-point'), $('#tablet-screen-width-point')) === 'desktop') {
          return blurOn();
        } else {
          return blurOff();
        }
      });
    } else {
      return blurOff();
    }
  };

  $.fn.modal.Constructor.prototype.hide = function() {
    modal_hide.call(this);
    blurOff();
    return $(window).off('pa.resize.modal_blur').on('hidden', '.modal', function() {
      return alert('asd');
    });
  };

}).call(this);
