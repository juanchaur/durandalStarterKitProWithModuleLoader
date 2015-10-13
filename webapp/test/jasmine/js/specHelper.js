var jasmineExtensions = {
	jQuerySpies: {},
	spyOnEvent: function(element, eventName) {
		var control = {
			triggered: false
		};
		element.bind(eventName, function() {
			control.triggered = true;
		});
		jasmineExtensions.jQuerySpies[element[eventName]] = control;
	}
},
spyOnEvent = jasmineExtensions.spyOnEvent;

beforeEach(function() {
	this.addMatchers({
		toHaveBeenTriggered: function() {
			var control = jasmineExtensions.jQuerySpies[this.actual];
			return control.triggered;
		},
		toBeObservable: function() {
			return typeof this.actual === 'function' &&
				typeof this.actual.__ko_proto__ === 'function' &&
				this.actual.hasOwnProperty('_latestValue') &&
				typeof this.actual.valueWillMutate === 'function' &&
				typeof this.actual.notifySubscribers === 'function' &&
				this.actual.name === "observable"
			;
		},
		toBePromise: function() {
			return typeof this.actual === 'object' &&
				typeof this.actual.resolve === 'undefined' &&
				typeof this.actual.reject === 'undefined' &&
				typeof this.actual.always === 'function' &&
				typeof this.actual.done === 'function' &&
				typeof this.actual.fail === 'function' &&
				typeof this.actual.pipe === 'function' &&
				typeof this.actual.progress === 'function' &&
				typeof this.actual.state === 'function' &&
				typeof this.actual.then === 'function'
			;
		},
		toBeDeferred: function() {
			return typeof this.actual === 'object' &&
				typeof this.actual.notify === 'function' &&
				typeof this.actual.notifyWith === 'function' &&
				typeof this.actual.resolve === 'function' &&
				typeof this.actual.resolveWith === 'function' &&
				typeof this.actual.reject === 'function' &&
				typeof this.actual.rejectWith === 'function' &&
				typeof this.actual.always === 'function' &&
				typeof this.actual.done === 'function' &&
				typeof this.actual.fail === 'function' &&
				typeof this.actual.pipe === 'function' &&
				typeof this.actual.progress === 'function' &&
				typeof this.actual.state === 'function' &&
				typeof this.actual.then === 'function'
			;
		}
	});
});

function MockIterator(mockList) {
	this._mockList = mockList;
	this._reset();
}

MockIterator.prototype._reset = function() {
	this._ix = -1;
};

MockIterator.prototype.next = function() {
	this._ix++;
	if(this._ix >= this._mockList.length) {
		this._ix = 0;
	}
	return this._mockList[this._ix];
};

function DeferredStub(parent, methodName) {
	this.parent = parent;
	this.methodName = methodName;
	this.realMethod = parent[methodName];
}

DeferredStub.prototype.mockWith = function(result, waitForResponseMS) {
	this.restore();
	var me = this;

	if(result instanceof MockIterator) {
		this._mockWithIterator(result, waitForResponseMS);
	} else {
		this._mockWithStandard(result, waitForResponseMS);
	}
};

DeferredStub.prototype._mockWithIterator = function(result, waitForResponseMS) {
	var me = this;
	this.stub = sinon.stub(this.parent, this.methodName, function() {
		var dfd = new $.Deferred();
		if(!!waitForResponseMS) {
			setTimeout(function() {
				me._mockWithIterator_resolve(result, dfd);
			}, waitForResponseMS);
		}else{
			me._mockWithIterator_resolve(result, dfd);
		}
		return dfd.promise();
	});
};

DeferredStub.prototype._mockWithIterator_resolve = function(result, dfd) {
	var response = result.next();
	console.groupCollapsed('%cDeferredStub Resolve (Iterator Mode)', 'background: black;color:red; font-size: 1.1em; font-weight: bold;');
	console.log('RESPONSE: ');
	console.dir(response);
	console.log('Stack TRACE: ');
	console.trace();
	console.groupEnd();

	dfd.resolve(response);
};

DeferredStub.prototype._mockWithStandard = function(result, waitForResponseMS) {
	var me = this;
	this.stub = sinon.stub(this.parent, this.methodName, function(url) {
		var dfd = new $.Deferred();

		if(!!waitForResponseMS) {

			setTimeout(function() {
				dfd.resolve(result);
			}, waitForResponseMS);
		}else{
			dfd.resolve(result);
		}

		if(!!url && !!url.indexOf && url.indexOf('basicData') !== -1) {
			var dfd = new $.Deferred();
			return dfd.promise();
		}
		return dfd.promise();
	});
};


DeferredStub.prototype.rejectWith = function(result) {
	this.restore();
	this.stub = sinon.stub(this.parent, this.methodName, function() {
		var dfd = new $.Deferred();
		dfd.reject(result);
		return dfd.promise();
	});
};

DeferredStub.prototype.restore = function() {
	if(!!this.parent[this.methodName].restore) {
		this.parent[this.methodName].restore();
	}
};

function simulateEvent($element, eventName) {
	var element = unwrapJquery($element);

	var event = createEvent(eventName);

	if (!!element.dispatchEvent) {
		element.dispatchEvent(event);
	} else {
		element.fireEvent('on' + event.eventType, event);
	}
}

function createEvent(eventName) {
	var event; // The custom event that will be created

	if (document.createEvent) {
		event = document.createEvent('HTMLEvents');
		event.initEvent(eventName, true, true);
	} else {
		event = document.createEventObject();
		event.eventType = eventName;
	}
	event.eventName = eventName;

	return event;
}

function simulateInputWrite($inputElement, text) {
	var inputElement = unwrapJquery($inputElement);

	simulateEvent($inputElement, 'keydown');
	inputElement.value = text;
	simulateEvent($inputElement, 'keyup');
	simulateEvent($inputElement, 'change');
	simulateEvent($inputElement, 'blur');
}

function simulateDropDownClick($optionElement) {
	var optionElement = unwrapJquery($optionElement);
	optionElement.selected = true;
	simulateEvent( $optionElement, 'change' );
}

function simulateRadioClick($element) {
	var element = unwrapJquery($element);

	element.checked = true;
	simulateEvent($element, 'click');
}

function unwrapJquery(element, doNotThrowIsNotElements) {
	if (element === undefined) {
		var e = new TypeError('unwrapJquery The element is not defined');
		e.message = e.message + ' STACK: ' + e.stack;
		throw e;
	}

	if (!!element.context && element.length !== undefined) { //jquery
		if (!doNotThrowIsNotElements && element.length === 0) {
			throw new TypeError('unwrapJquery there is not elements for ' + element.selector);
		}
		element = element[0];
	}

	return element;
}

require(['jasmine-durandal', '/__jasmine-durandal__/DurandalEnvironment', '/__jasmine-durandal__/WidgetEnvironment'], function(x, DE, WE) {
	var $$ = function(BWSelector) {
		return this.$( BWSelectorsToCSSSelector(BWSelector) );
	};

	DE.prototype.$$ = $$;
	WE.prototype.$$ = $$;
});


function BWSelectorsToCSSSelector (testId) {
	var tmp, selector;
	if (testId.indexOf(' ') !== -1) {
		tmp = testId.split(' ');
		testId = tmp.splice(0,1)[0];

		selector = '';
		if (tmp.length > 0) {
			for (var i = 0; i < tmp.length; i++) {
				selector += ' ' + tmp[i].replace(/\@([\w\W]+)/g, '[data-testclass="$1"]');
			}
		}
	}
	return '[data-testId="' + testId + '"]' + (!!selector ?  selector : '');
}


//******************************************************************************************
//				To Simulate The input writing
//******************************************************************************************
var HTML5_TEXT_INPUT_FIELD_SELECTOR =
		'input:text,input:password,input[type=email],' +
		'input[type=number],input[type=search],input[type=tel],' +
		'input[type=time],input[type=url]';

/**
 * Utility function to trigger a key press event for each character
 * in a string.  Each character will be triggered 'keyTiming'
 * milliseconds apart.  The onComplete function will be called
 * 'keyTiming' milliseconds after the last key is triggered.
 */
function simulateFieldWriting(field, str, keyTiming, triggerFocus, clearFirst, onComplete ) {
	var keyTiming = keyTiming || 500,
		triggerFocus = triggerFocus || true,
		clearFirst = typeof clearFirst === 'boolean'? clearFirst: true,
		onComplete = onComplete || function () {}
	;

	if(clearFirst) {
		field.val('');
	}

	if (field && str) {
		field = $(field);
		triggerFocus = Boolean(triggerFocus);

		if (triggerFocus) {
			field.trigger('focus');
		}

		var keyCode = str.charCodeAt(0);

		triggerKeyEvents(field, keyCode);

		if (str.length > 1) {
			setTimeout(function() {
				simulateFieldWriting(field, str.substring(1), keyTiming, false, false, onComplete);
			}, keyTiming);
		}
		else {
			if (jQuery.isFunction(onComplete)) {
				setTimeout(function() {
					onComplete(field);
				}, keyTiming);
			}
		}
	}
}

/**
 * Utility function to trigger a key event for a given key code.
 */
function triggerKeyEvents(field, keyCode, shiftKey, ctrlKey) {
	field = $(field);
	shiftKey = Boolean(shiftKey);
	ctrlKey = Boolean(ctrlKey);

	field.trigger ( {
		type: 'keypress',
		keyCode: keyCode,
		which: ctrlKey,
		charCode: shiftKey
	} );

	field.trigger ( {
		type: 'keydown',
		keyCode: keyCode,
		which: ctrlKey,
		charCode: shiftKey
	} );

	if (field.is(HTML5_TEXT_INPUT_FIELD_SELECTOR)) {
		applyKeyCodeToValue(field, keyCode);
	}

	field.trigger ( {
		type: 'keyup',
		keyCode: keyCode,
		which: ctrlKey,
		charCode: shiftKey
	} );
}

/*
 * Internal function to simulate a key being typed into an edit
 * field for testing purposes.  Tries to handle cases like
 * 'backspace' or 'arrow key'.  It's assumed that the cursor is
 * always at the end of the field.
 */
function applyKeyCodeToValue(field, keyCode) {
	field = $(field);

	if ((keyCode >= 32) && (keyCode <= 126)) {
		field.val(field.val() + String.fromCharCode(keyCode));
	}
	else {
		switch(keyCode) {
			case 8: // Backspace
				var val = field.val();

				if (val.length) {
					field.val(val.substring(0, val.length - 1));
				}
			break;

			default:
			break;
		}
	}
}


/**
 * Waits for a Element appears in the DOM
 *
 * @param elementTestId
 * @param [durandalCtx]
 * @param [timeOut]
 */
function waitForElement(BWSelector, durandalCtx, timeOut) {
	var $getElement;


	if(typeof durandalCtx === 'number') {
		timeOut = durandalCtx;
		delete durandalCtx;
	}
	if(!timeOut) {
		timeOut = !!window.WFETimeout ? window.WFETimeout : 1000;
	}

	if(durandalCtx) {
		$getElement = function() {
			return durandalCtx.$$(BWSelector);
		};
	}else{
		var jQSelector = BWSelectorsToCSSSelector(BWSelector);
		$getElement = function() {
			return $(jQSelector);
		};
	}

	waitsFor(function() {
		return $getElement().length > 0;
	}, timeOut, 'element testId="' + BWSelector + '"');
}

// TODO @PK: it's just added quickly, replace it with a real solution
function stubGetter(object, propertyName, value) {
	var getterFn = 'get' + propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
	object[getterFn] = function() {
		return value;
	};
};


function enableSemafoneHandlerStub(){

	try{
		var SemafoneHandler = require('service!SemafoneHandler');

		if(!SemafoneHandler.prototype.initialize.restore){


			var oldInitialize = SemafoneHandler.prototype.initialize;
			sinon.stub(SemafoneHandler.prototype, 'initialize', function(){
				var dfd = new $.Deferred();
				oldInitialize.apply(this, arguments); // real initialization of observables
				dfd.resolve();
				return dfd.promise();
			});
		}

	} catch(e){
		console.warn('%cError Attemping to stub SemafoneHandler, not loaded in the scope', 'background: black; color: orange;', e)
	}

}

function disableSemafoneHandlerStub(){
	try{
		var SemafoneHandler = require('service!SemafoneHandler');
		SemafoneHandler.prototype.initialize.restore();
	} catch(e){
	}
}

function getCaller(){
	var caller;
	try{
		caller = (new Error()).stack.split('\n')[3].trim().substring(3);
	} catch (e){
		caller = '<unknown>:x:x';
	}
	return caller;
}

window.fakeServerUtils = {

	getRequestsByContainedURL: function (server, url) {
		return server.requests.filter(function(req){
			return req.url.indexOf(url) !== -1;
		});
	},

	getRequestsByMethod: function (server, method) {
		return server.requests.filter(function(req){
			return req.method === method.toUpperCase();
		});
	},

	resetRequests: function(server) {
		// DG: this will remove all the elements inside of the array mantaining
		// the *pointer (the real position in memory and references)
		// NEVER do this server.requests = []; you could break the internal
		// behavior of the sinon.fakeServer
		server.requests.splice(0, server.requests.length);
	},

	getOKResponse: function(etag){
		return this.getResponseDataFor({}, 200, etag);
	},

	get404Response: function(){
		return this.getResponseDataFor({}, 404);
	},

	getResponseDataFor: function(mockData, status, etag){
		var body = JSON.stringify(mockData),
			headers = {
			'Content-Type': 'application/json',
			'Content-Length': body.length
		};
		if(typeof status === 'string'){
			etag = status;
			status = 200;
		}
		if(status === undefined){
			status = 200;
		}

		if(!!etag){
			headers.ETag = etag;
		}

		return [
			status,
			headers,
			body
		];
	}
};

/******************************************************************************
 * SINON IMPROVEMENTS ???
 */

// Create Method on hot when aren't there

require(['sinon'], function(sinon){
	'use strict';

	function createMethodOnHotWrapper(methodName) {
		var originalMethod = sinon[methodName];

		sinon[methodName + 'OnHot'] = function(obj, method) {
			var restoreIt = false;
			if(!obj.hasOwnProperty(method)) {
				obj[method] = function() {
					window.console.log('Method created on Hot ', method);
				};
				restoreIt = true;
			}

			var sinonSpyStub = originalMethod.apply(this, arguments);

			if(restoreIt) {
				var originalRestore = sinonSpyStub.restore;
				sinonSpyStub.restore = function() {
					var ret = originalRestore.apply(this, arguments);

					delete obj[method];

					return ret;
				};
			}

			return sinonSpyStub;
		}
	}

	createMethodOnHotWrapper('spy');
	createMethodOnHotWrapper('stub');

	console.log('Sinon Improved!');

})();