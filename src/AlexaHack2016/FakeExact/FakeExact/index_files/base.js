/*!
 * jQuery JavaScript Library v1.5.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Wed Feb 23 13:55:29 2011 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,

	// Has the ready events already been bound?
	readyBound = false,

	// The deferred used on DOM ready
	readyList,

	// Promise methods
	promiseMethods = "then done fail isResolved isRejected promise".split( " " ),

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment).childNodes;
					}

					return jQuery.merge( this, selector );

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.5.1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = this.constructor();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );

		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// Add the callback
		readyList.done( fn );

		return this;
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith( document, [ jQuery ] );

			// Trigger any bound ready events
			if ( jQuery.fn.trigger ) {
				jQuery( document ).trigger( "ready" ).unbind( "ready" );
			}
		}
	},

	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw msg;
	},

	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	// Cross-browser xml parsing
	// (xml & tmp used internally)
	parseXML: function( data , xml , tmp ) {

		if ( window.DOMParser ) { // Standard
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} else { // IE
			xml = new ActiveXObject( "Microsoft.XMLDOM" );
			xml.async = "false";
			xml.loadXML( data );
		}

		tmp = xml.documentElement;

		if ( ! tmp || ! tmp.nodeName || tmp.nodeName === "parsererror" ) {
			jQuery.error( "Invalid XML: " + data );
		}

		return xml;
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement,
				script = document.createElement( "script" );

			if ( jQuery.support.scriptEval() ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;

		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}

		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);

			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}

			return elems;
		}

		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Create a simple deferred (one callbacks list)
	_Deferred: function() {
		var // callbacks list
			callbacks = [],
			// stored [ context , args ]
			fired,
			// to avoid firing when already doing so
			firing,
			// flag to know if the deferred has been cancelled
			cancelled,
			// the deferred itself
			deferred  = {

				// done( f1, f2, ...)
				done: function() {
					if ( !cancelled ) {
						var args = arguments,
							i,
							length,
							elem,
							type,
							_fired;
						if ( fired ) {
							_fired = fired;
							fired = 0;
						}
						for ( i = 0, length = args.length; i < length; i++ ) {
							elem = args[ i ];
							type = jQuery.type( elem );
							if ( type === "array" ) {
								deferred.done.apply( deferred, elem );
							} else if ( type === "function" ) {
								callbacks.push( elem );
							}
						}
						if ( _fired ) {
							deferred.resolveWith( _fired[ 0 ], _fired[ 1 ] );
						}
					}
					return this;
				},

				// resolve with given context and args
				resolveWith: function( context, args ) {
					if ( !cancelled && !fired && !firing ) {
						firing = 1;
						try {
							while( callbacks[ 0 ] ) {
								callbacks.shift().apply( context, args );
							}
						}
						// We have to add a catch block for
						// IE prior to 8 or else the finally
						// block will never get executed
						catch (e) {
							throw e;
						}
						finally {
							fired = [ context, args ];
							firing = 0;
						}
					}
					return this;
				},

				// resolve with this as context and given arguments
				resolve: function() {
					deferred.resolveWith( jQuery.isFunction( this.promise ) ? this.promise() : this, arguments );
					return this;
				},

				// Has this deferred been resolved?
				isResolved: function() {
					return !!( firing || fired );
				},

				// Cancel
				cancel: function() {
					cancelled = 1;
					callbacks = [];
					return this;
				}
			};

		return deferred;
	},

	// Full fledged deferred (two callbacks list)
	Deferred: function( func ) {
		var deferred = jQuery._Deferred(),
			failDeferred = jQuery._Deferred(),
			promise;
		// Add errorDeferred methods, then and promise
		jQuery.extend( deferred, {
			then: function( doneCallbacks, failCallbacks ) {
				deferred.done( doneCallbacks ).fail( failCallbacks );
				return this;
			},
			fail: failDeferred.done,
			rejectWith: failDeferred.resolveWith,
			reject: failDeferred.resolve,
			isRejected: failDeferred.isResolved,
			// Get a promise for this deferred
			// If obj is provided, the promise aspect is added to the object
			promise: function( obj ) {
				if ( obj == null ) {
					if ( promise ) {
						return promise;
					}
					promise = obj = {};
				}
				var i = promiseMethods.length;
				while( i-- ) {
					obj[ promiseMethods[i] ] = deferred[ promiseMethods[i] ];
				}
				return obj;
			}
		} );
		// Make sure only one callback list will be used
		deferred.done( failDeferred.cancel ).fail( deferred.cancel );
		// Unexpose cancel
		delete deferred.cancel;
		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}
		return deferred;
	},

	// Deferred helper
	when: function( object ) {
		var lastIndex = arguments.length,
			deferred = lastIndex <= 1 && object && jQuery.isFunction( object.promise ) ?
				object :
				jQuery.Deferred(),
			promise = deferred.promise();

		if ( lastIndex > 1 ) {
			var array = slice.call( arguments, 0 ),
				count = lastIndex,
				iCallback = function( index ) {
					return function( value ) {
						array[ index ] = arguments.length > 1 ? slice.call( arguments, 0 ) : value;
						if ( !( --count ) ) {
							deferred.resolveWith( promise, array );
						}
					};
				};
			while( ( lastIndex-- ) ) {
				object = array[ lastIndex ];
				if ( object && jQuery.isFunction( object.promise ) ) {
					object.promise().then( iCallback(lastIndex), deferred.reject );
				} else {
					--count;
				}
			}
			if ( !count ) {
				deferred.resolveWith( promise, array );
			}
		} else if ( deferred !== object ) {
			deferred.resolve( object );
		}
		return promise;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	sub: function() {
		function jQuerySubclass( selector, context ) {
			return new jQuerySubclass.fn.init( selector, context );
		}
		jQuery.extend( true, jQuerySubclass, this );
		jQuerySubclass.superclass = this;
		jQuerySubclass.fn = jQuerySubclass.prototype = this();
		jQuerySubclass.fn.constructor = jQuerySubclass;
		jQuerySubclass.subclass = this.subclass;
		jQuerySubclass.fn.init = function init( selector, context ) {
			if ( context && context instanceof jQuery && !(context instanceof jQuerySubclass) ) {
				context = jQuerySubclass(context);
			}

			return jQuery.fn.init.call( this, selector, context, rootjQuerySubclass );
		};
		jQuerySubclass.fn.init.prototype = jQuerySubclass.fn;
		var rootjQuerySubclass = jQuerySubclass(document);
		return jQuerySubclass;
	},

	browser: {}
});

// Create readyList deferred
readyList = jQuery._Deferred();

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// IE doesn't match non-breaking spaces with \s
if ( rnotwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return jQuery;

})();


(function() {

	jQuery.support = {};

	var div = document.createElement("div");

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") ),
		input = div.getElementsByTagName("input")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: input.value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		deleteExpando: true,
		optDisabled: false,
		checkClone: false,
		noCloneEvent: true,
		noCloneChecked: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	input.checked = true;
	jQuery.support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	var _scriptEval = null;
	jQuery.support.scriptEval = function() {
		if ( _scriptEval === null ) {
			var root = document.documentElement,
				script = document.createElement("script"),
				id = "script" + jQuery.now();

			try {
				script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
			} catch(e) {}

			root.insertBefore( script, root.firstChild );

			// Make sure that the execution of code works by injecting a script
			// tag with appendChild/createTextNode
			// (IE doesn't support this, fails, and uses .text instead)
			if ( window[ id ] ) {
				_scriptEval = true;
				delete window[ id ];
			} else {
				_scriptEval = false;
			}

			root.removeChild( script );
			// release memory in IE
			root = script = id  = null;
		}

		return _scriptEval;
	};

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;

	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div"),
			body = document.getElementsByTagName("body")[0];

		// Frameset documents with no body should not run this code
		if ( !body ) {
			return;
		}

		div.style.width = div.style.paddingLeft = "1px";
		body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if ( !el.attachEvent ) {
			return true;
		}

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	div = all = a = null;
})();



var rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];

		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, getByName = typeof name === "string", thisCache,

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ jQuery.expando ] : elem[ jQuery.expando ] && jQuery.expando;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || (pvt && id && !cache[ id ][ internalKey ])) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ jQuery.expando ] = id = ++jQuery.uuid;
			} else {
				id = jQuery.expando;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ][ internalKey ] = jQuery.extend(cache[ id ][ internalKey ], name);
			} else {
				cache[ id ] = jQuery.extend(cache[ id ], name);
			}
		}

		thisCache = cache[ id ];

		// Internal jQuery data is stored in a separate object inside the object's data
		// cache in order to avoid key collisions between internal data and user-defined
		// data
		if ( pvt ) {
			if ( !thisCache[ internalKey ] ) {
				thisCache[ internalKey ] = {};
			}

			thisCache = thisCache[ internalKey ];
		}

		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		// TODO: This is a hack for 1.5 ONLY. It will be removed in 1.6. Users should
		// not attempt to inspect the internal events object using jQuery.data, as this
		// internal data object is undocumented and subject to change.
		if ( name === "events" && !thisCache[name] ) {
			return thisCache[ internalKey ] && thisCache[ internalKey ].events;
		}

		return getByName ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {
			var thisCache = pvt ? cache[ id ][ internalKey ] : cache[ id ];

			if ( thisCache ) {
				delete thisCache[ name ];

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !isEmptyDataObject(thisCache) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( pvt ) {
			delete cache[ id ][ internalKey ];

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject(cache[ id ]) ) {
				return;
			}
		}

		var internalCache = cache[ id ][ internalKey ];

		// Browsers that fail expando deletion also refuse to delete expandos on
		// the window, but it will allow it on all other JS objects; other browsers
		// don't care
		if ( jQuery.support.deleteExpando || cache != window ) {
			delete cache[ id ];
		} else {
			cache[ id ] = null;
		}

		// We destroyed the entire user cache at once because it's faster than
		// iterating through each key, but we need to continue to persist internal
		// data if it existed
		if ( internalCache ) {
			cache[ id ] = {};
			// TODO: This is a hack for 1.5 ONLY. Avoids exposing jQuery
			// metadata on plain JS objects when the object is serialized using
			// JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}

			cache[ id ][ internalKey ] = internalCache;

		// Otherwise, we need to eliminate the expando on the node to avoid
		// false lookups in the cache for entries that no longer exist
		} else if ( isNode ) {
			// IE does not allow us to delete expando properties from nodes,
			// nor does it have a removeAttribute function on Document nodes;
			// we must handle all of these cases
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];
			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			} else {
				elem[ jQuery.expando ] = null;
			}
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				data = jQuery.data( this[0] );

				if ( this[0].nodeType === 1 ) {
					var attr = this[0].attributes, name;
					for ( var i = 0, l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = name.substr( 5 );
							dataAttr( this[0], name, data[ name ] );
						}
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		data = elem.getAttribute( "data-" + key );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// TODO: This is a hack for 1.5 ONLY to allow objects with a single toJSON
// property to be considered empty objects; this property always exists in
// order to make sure JSON.stringify does not expose internal metadata
function isEmptyDataObject( obj ) {
	for ( var name in obj ) {
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery._data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery._data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}

		if ( !queue.length ) {
			jQuery.removeData( elem, type + "queue", true );
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t\r]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if ( one && !values.length && options.length ) {
						return jQuery( options[ index ] ).val();
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},

	attr: function( elem, name, value, pass ) {
		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || elem.nodeType === 2 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;

					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			// 'in' checks fail in Blackberry 4.7 #6931
			if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					if ( value === null ) {
						if ( elem.nodeType === 1 ) {
							elem.removeAttribute( name );
						}

					} else {
						elem[ name ] = value;
					}
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			// Ensure that missing attributes return undefined
			// Blackberry 4.7 returns "" from getAttribute #6938
			if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
				return undefined;
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}
		// Handle everything which isn't a DOM element node
		if ( set ) {
			elem[ name ] = value;
		}
		return elem[ name ];
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// TODO :: Use a try/catch until it's safe to pull this out (likely 1.6)
		// Minor release fix for bug #8018
		try {
			// For whatever reason, IE has trouble passing the window object
			// around, causing it to be cloned in the process
			if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
				elem = window;
			}
		}
		catch ( e ) {}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
			return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery._data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events,
			eventHandle = elemData.handle;

		if ( !events ) {
			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" +
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem, undefined, true );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					// XXX This code smells terrible. event.js should not be directly
					// inspecting the data cache
					jQuery.each( jQuery.cache, function() {
						// internalKey variable is just used to make it easier to find
						// and potentially change this stuff later; currently it just
						// points to jQuery.expando
						var internalKey = jQuery.expando,
							internalCache = this[ internalKey ];
						if ( internalCache && internalCache.events && internalCache.events[ type ] ) {
							jQuery.event.trigger( event, data, internalCache.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery._data( elem, "handle" );

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var old,
				target = event.target,
				targetType = type.replace( rnamespaces, "" ),
				isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) &&
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery._data(this, "events");

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;

					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement,
				body = document.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) );
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault()) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {

		// Chrome does something similar, the parentNode property
		// can be accessed but is null.
		if ( parent !== document && !parent.parentNode ) {
			return;
		}
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName && this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						trigger( "submit", this, arguments );
					}
				});

				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery._data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery._data( elem, "_change_data", val );
		}

		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange,

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery._data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	// Piggyback on a donor event to simulate a different one.
	// Fake originalEvent to avoid donor's stopPropagation, but if the
	// simulated event prevents default then we do the same on the donor.
	// Don't pass args or remember liveFired; they apply to the donor event.
	var event = jQuery.extend( {}, args[ 0 ] );
	event.type = type;
	event.originalEvent = {};
	event.liveFired = undefined;
	jQuery.event.handle.call( elem, event );
	if ( event.isDefaultPrevented() ) {
		args[ 0 ].preventDefault();
	}
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			},
			teardown: function() {
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) {
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}

		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},

	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );

		} else {
			return this.die( types, null, fn, selector );
		}
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}

			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}

		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = [],
		selectors = [],
		events = jQuery._data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861) and disabled elements in IE (#6911)
	if ( event.liveFired === this || !events || !events.live || event.target.disabled || event.button && event.type === "click" ) {
		return;
	}

	if ( event.namespace ) {
		namespace = new RegExp("(^|\\.)" + event.namespace.split(".").join("\\.(?:.*\\.)?") + "(\\.|$)");
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		close = match[i];

		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( close.selector === handleObj.selector && (!namespace || namespace.test( handleObj.namespace )) && !close.elem.disabled ) {
				elem = close.elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					event.type = handleObj.preType;
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj, level: close.level });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];

		if ( maxLevel && match.level > maxLevel ) {
			break;
		}

		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		ret = match.handleObj.origHandler.apply( match.elem, arguments );

		if ( ret === false || event.isPropagationStopped() ) {
			maxLevel = match.level;

			if ( ret === false ) {
				stop = false;
			}
			if ( event.isImmediatePropagationStopped() ) {
				break;
			}
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return (type && type !== "*" ? type + "." : "") + selector.replace(rperiod, "`").replace(rspace, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.bind( name, data, fn ) :
			this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});


/*!
 * Sizzle CSS Selector Engine
 *  Copyright 2011, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true,
	rBackslash = /\\/g,
	rNonWord = /\W/;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function() {
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function( selector, context, results, seed ) {
	results = results || [];
	context = context || document;

	var origContext = context;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var m, set, checkSet, extra, ret, cur, pop, i,
		prune = true,
		contextXML = Sizzle.isXML( context ),
		parts = [],
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	do {
		chunker.exec( "" );
		m = chunker.exec( soFar );

		if ( m ) {
			soFar = m[3];
		
			parts.push( m[1] );
		
			if ( m[2] ) {
				extra = m[3];
				break;
			}
		}
	} while ( m );

	if ( parts.length > 1 && origPOS.exec( selector ) ) {

		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );

		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}

	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {

			ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ?
				Sizzle.filter( ret.expr, ret.set )[0] :
				ret.set[0];
		}

		if ( context ) {
			ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );

			set = ret.expr ?
				Sizzle.filter( ret.expr, ret.set ) :
				ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray( set );

			} else {
				prune = false;
			}

			while ( parts.length ) {
				cur = parts.pop();
				pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}

		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );

		} else if ( context && context.nodeType === 1 ) {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}

		} else {
			for ( i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}

	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function( results ) {
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort( sortOrder );

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[ i - 1 ] ) {
					results.splice( i--, 1 );
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function( expr, set ) {
	return Sizzle( expr, null, null, set );
};

Sizzle.matchesSelector = function( node, expr ) {
	return Sizzle( expr, null, null, [node] ).length > 0;
};

Sizzle.find = function( expr, context, isXML ) {
	var set;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var match,
			type = Expr.order[i];
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice( 1, 1 );

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace( rBackslash, "" );
				set = Expr.find[ type ]( match, context, isXML );

				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = typeof context.getElementsByTagName !== "undefined" ?
			context.getElementsByTagName( "*" ) :
			[];
	}

	return { set: set, expr: expr };
};

Sizzle.filter = function( expr, set, inplace, not ) {
	var match, anyFound,
		old = expr,
		result = [],
		curLoop = set,
		isXMLFilter = set && set[0] && Sizzle.isXML( set[0] );

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var found, item,
					filter = Expr.filter[ type ],
					left = match[1];

				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;

					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;

								} else {
									curLoop[i] = false;
								}

							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );

			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],

	match: {
		ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},

	leftMatch: {},

	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},

	attrHandle: {
		href: function( elem ) {
			return elem.getAttribute( "href" );
		},
		type: function( elem ) {
			return elem.getAttribute( "type" );
		}
	},

	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !rNonWord.test( part ),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},

		">": function( checkSet, part ) {
			var elem,
				isPartStr = typeof part === "string",
				i = 0,
				l = checkSet.length;

			if ( isPartStr && !rNonWord.test( part ) ) {
				part = part.toLowerCase();

				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}

			} else {
				for ( ; i < l; i++ ) {
					elem = checkSet[i];

					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},

		"": function(checkSet, part, isXML){
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "parentNode", part, doneName, checkSet, nodeCheck, isXML );
		},

		"~": function( checkSet, part, isXML ) {
			var nodeCheck,
				doneName = done++,
				checkFn = dirCheck;

			if ( typeof part === "string" && !rNonWord.test( part ) ) {
				part = part.toLowerCase();
				nodeCheck = part;
				checkFn = dirNodeCheck;
			}

			checkFn( "previousSibling", part, doneName, checkSet, nodeCheck, isXML );
		}
	},

	find: {
		ID: function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		},

		NAME: function( match, context ) {
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [],
					results = context.getElementsByName( match[1] );

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},

		TAG: function( match, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( match[1] );
			}
		}
	},
	preFilter: {
		CLASS: function( match, curLoop, inplace, result, not, isXML ) {
			match = " " + match[1].replace( rBackslash, "" ) + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}

					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},

		ID: function( match ) {
			return match[1].replace( rBackslash, "" );
		},

		TAG: function( match, curLoop ) {
			return match[1].replace( rBackslash, "" ).toLowerCase();
		},

		CHILD: function( match ) {
			if ( match[1] === "nth" ) {
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				match[2] = match[2].replace(/^\+|\s*/g, '');

				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}
			else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},

		ATTR: function( match, curLoop, inplace, result, not, isXML ) {
			var name = match[1] = match[1].replace( rBackslash, "" );
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			// Handle if an un-quoted value was used
			match[4] = ( match[4] || match[5] || "" ).replace( rBackslash, "" );

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},

		PSEUDO: function( match, curLoop, inplace, result, not ) {
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);

				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

					if ( !inplace ) {
						result.push.apply( result, ret );
					}

					return false;
				}

			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},

		POS: function( match ) {
			match.unshift( true );

			return match;
		}
	},
	
	filters: {
		enabled: function( elem ) {
			return elem.disabled === false && elem.type !== "hidden";
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {
			return elem.checked === true;
		},
		
		selected: function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			
			return elem.selected === true;
		},

		parent: function( elem ) {
			return !!elem.firstChild;
		},

		empty: function( elem ) {
			return !elem.firstChild;
		},

		has: function( elem, i, match ) {
			return !!Sizzle( match[3], elem ).length;
		},

		header: function( elem ) {
			return (/h\d/i).test( elem.nodeName );
		},

		text: function( elem ) {
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc) 
			// use getAttribute instead to test this case
			return "text" === elem.getAttribute( 'type' );
		},
		radio: function( elem ) {
			return "radio" === elem.type;
		},

		checkbox: function( elem ) {
			return "checkbox" === elem.type;
		},

		file: function( elem ) {
			return "file" === elem.type;
		},
		password: function( elem ) {
			return "password" === elem.type;
		},

		submit: function( elem ) {
			return "submit" === elem.type;
		},

		image: function( elem ) {
			return "image" === elem.type;
		},

		reset: function( elem ) {
			return "reset" === elem.type;
		},

		button: function( elem ) {
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},

		input: function( elem ) {
			return (/input|select|textarea|button/i).test( elem.nodeName );
		}
	},
	setFilters: {
		first: function( elem, i ) {
			return i === 0;
		},

		last: function( elem, i, match, array ) {
			return i === array.length - 1;
		},

		even: function( elem, i ) {
			return i % 2 === 0;
		},

		odd: function( elem, i ) {
			return i % 2 === 1;
		},

		lt: function( elem, i, match ) {
			return i < match[3] - 0;
		},

		gt: function( elem, i, match ) {
			return i > match[3] - 0;
		},

		nth: function( elem, i, match ) {
			return match[3] - 0 === i;
		},

		eq: function( elem, i, match ) {
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function( elem, match, i, array ) {
			var name = match[1],
				filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );

			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || Sizzle.getText([ elem ]) || "").indexOf(match[3]) >= 0;

			} else if ( name === "not" ) {
				var not = match[3];

				for ( var j = 0, l = not.length; j < l; j++ ) {
					if ( not[j] === elem ) {
						return false;
					}
				}

				return true;

			} else {
				Sizzle.error( name );
			}
		},

		CHILD: function( elem, match ) {
			var type = match[1],
				node = elem;

			switch ( type ) {
				case "only":
				case "first":
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					if ( type === "first" ) { 
						return true; 
					}

					node = elem;

				case "last":
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}

					return true;

				case "nth":
					var first = match[2],
						last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 

						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;

					if ( first === 0 ) {
						return diff === 0;

					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},

		ID: function( elem, match ) {
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},

		TAG: function( elem, match ) {
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		
		CLASS: function( elem, match ) {
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},

		ATTR: function( elem, match ) {
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},

		POS: function( elem, match, i, array ) {
			var name = match[2],
				filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS,
	fescape = function(all, num){
		return "\\" + (num - 0 + 1);
	};

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + (/(?![^\[]*\])(?![^\(]*\))/.source) );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, fescape) );
}

var makeArray = function( array, results ) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch( e ) {
	makeArray = function( array, results ) {
		var i = 0,
			ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );

		} else {
			if ( typeof array.length === "number" ) {
				for ( var l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}

			} else {
				for ( ; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder, siblingCheck;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			return a.compareDocumentPosition ? -1 : 1;
		}

		return a.compareDocumentPosition(b) & 4 ? -1 : 1;
	};

} else {
	sortOrder = function( a, b ) {
		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// If the nodes are siblings (or identical) we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

	siblingCheck = function( a, b, ret ) {
		if ( a === b ) {
			return ret;
		}

		var cur = a.nextSibling;

		while ( cur ) {
			if ( cur === b ) {
				return -1;
			}

			cur = cur.nextSibling;
		}

		return 1;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
Sizzle.getText = function( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += Sizzle.getText( elem.childNodes );
		}
	}

	return ret;
};

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date()).getTime(),
		root = document.documentElement;

	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function( match, context, isXML ) {
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);

				return m ?
					m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ?
						[m] :
						undefined :
					[];
			}
		};

		Expr.filter.ID = function( elem, match ) {
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );

	// release memory in IE
	root = form = null;
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function( match, context ) {
			var results = context.getElementsByTagName( match[1] );

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";

	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {

		Expr.attrHandle.href = function( elem ) {
			return elem.getAttribute( "href", 2 );
		};
	}

	// release memory in IE
	div = null;
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle,
			div = document.createElement("div"),
			id = "__sizzle__";

		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function( query, context, extra, seed ) {
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && !Sizzle.isXML(context) ) {
				// See if we find a selector to speed up
				var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec( query );
				
				if ( match && (context.nodeType === 1 || context.nodeType === 9) ) {
					// Speed-up: Sizzle("TAG")
					if ( match[1] ) {
						return makeArray( context.getElementsByTagName( query ), extra );
					
					// Speed-up: Sizzle(".CLASS")
					} else if ( match[2] && Expr.find.CLASS && context.getElementsByClassName ) {
						return makeArray( context.getElementsByClassName( match[2] ), extra );
					}
				}
				
				if ( context.nodeType === 9 ) {
					// Speed-up: Sizzle("body")
					// The body element only exists once, optimize finding it
					if ( query === "body" && context.body ) {
						return makeArray( [ context.body ], extra );
						
					// Speed-up: Sizzle("#ID")
					} else if ( match && match[3] ) {
						var elem = context.getElementById( match[3] );

						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						if ( elem && elem.parentNode ) {
							// Handle the case where IE and Opera return items
							// by name instead of ID
							if ( elem.id === match[3] ) {
								return makeArray( [ elem ], extra );
							}
							
						} else {
							return makeArray( [], extra );
						}
					}
					
					try {
						return makeArray( context.querySelectorAll(query), extra );
					} catch(qsaError) {}

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				} else if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					var oldContext = context,
						old = context.getAttribute( "id" ),
						nid = old || id,
						hasParent = context.parentNode,
						relativeHierarchySelector = /^\s*[+~]/.test( query );

					if ( !old ) {
						context.setAttribute( "id", nid );
					} else {
						nid = nid.replace( /'/g, "\\$&" );
					}
					if ( relativeHierarchySelector && hasParent ) {
						context = context.parentNode;
					}

					try {
						if ( !relativeHierarchySelector || hasParent ) {
							return makeArray( context.querySelectorAll( "[id='" + nid + "'] " + query ), extra );
						}

					} catch(pseudoError) {
					} finally {
						if ( !old ) {
							oldContext.removeAttribute( "id" );
						}
					}
				}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		// release memory in IE
		div = null;
	})();
}

(function(){
	var html = document.documentElement,
		matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector,
		pseudoWorks = false;

	try {
		// This should fail with an exception
		// Gecko does not error, returns false instead
		matches.call( document.documentElement, "[test!='']:sizzle" );
	
	} catch( pseudoError ) {
		pseudoWorks = true;
	}

	if ( matches ) {
		Sizzle.matchesSelector = function( node, expr ) {
			// Make sure that attribute selectors are quoted
			expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

			if ( !Sizzle.isXML( node ) ) {
				try { 
					if ( pseudoWorks || !Expr.match.PSEUDO.test( expr ) && !/!=/.test( expr ) ) {
						return matches.call( node, expr );
					}
				} catch(e) {}
			}

			return Sizzle(expr, null, null, [node]).length > 0;
		};
	}
})();

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function( match, context, isXML ) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	// release memory in IE
	div = null;
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;

			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];

		if ( elem ) {
			var match = false;
			
			elem = elem[dir];

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}

					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

if ( document.documentElement.contains ) {
	Sizzle.contains = function( a, b ) {
		return a !== b && (a.contains ? a.contains(b) : true);
	};

} else if ( document.documentElement.compareDocumentPosition ) {
	Sizzle.contains = function( a, b ) {
		return !!(a.compareDocumentPosition(b) & 16);
	};

} else {
	Sizzle.contains = function() {
		return false;
	};
}

Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;

	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function( selector, context ) {
	var match,
		tmpSet = [],
		later = "",
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})();


var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	isSimple = /^.[^:#\[\.,]*$/,
	slice = Array.prototype.slice,
	POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ),
			length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		var ret = [], i, l, cur = this[0];

		if ( jQuery.isArray( selectors ) ) {
			var match, selector,
				matches = {},
				level = 1;

			if ( cur && selectors.length ) {
				for ( i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ?
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur, level: level });
						}
					}

					cur = cur.parentNode;
					level++;
				}
			}

			return ret;
		}

		var pos = POS.test( selectors ) ?
			jQuery( selectors, context || this.context ) : null;

		for ( i = 0, l = this.length; i < l; i++ ) {
			cur = this[i];

			while ( cur ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;

				} else {
					cur = cur.parentNode;
					if ( !cur || !cur.ownerDocument || cur === context ) {
						break;
					}
				}
			}
		}

		ret = ret.length > 1 ? jQuery.unique(ret) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until ),
			// The variable 'args' was introduced in
			// https://github.com/jquery/jquery/commit/52a0238
			// to work around a bug in Chrome 10 (Dev) and should be removed when the bug is fixed.
			// http://code.google.com/p/v8/issues/detail?id=1050
			args = slice.call(arguments);

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, args.join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
}




var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<(?:script|object|embed|option|style)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery( this );

				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, "<$1></$2>");

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery( this );

				self.html( value.call(this, i, self.html()) );
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, fragment, parent,
			value = args[0],
			scripts = [];

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = jQuery.buildFragment( args, this, scripts );
			}

			fragment = results.fragment;

			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length, lastIndex = l - 1; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex) ?
							jQuery.clone( fragment, true, true ) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;
	}
});

function root( elem, cur ) {
	return jQuery.nodeName(elem, "table") ?
		(elem.getElementsByTagName("tbody")[0] ||
		elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
		elem;
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var internalKey = jQuery.expando,
		oldData = jQuery.data( src ),
		curData = jQuery.data( dest, oldData );

	// Switch to use the internal data object, if it exists, for the next
	// stage of data copying
	if ( (oldData = oldData[ internalKey ]) ) {
		var events = oldData.events;
				curData = curData[ internalKey ] = jQuery.extend({}, oldData);

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type + ( events[ type ][ i ].namespace ? "." : "" ) + events[ type ][ i ].namespace, events[ type ][ i ], events[ type ][ i ].data );
				}
			}
		}
	}
}

function cloneFixAttributes(src, dest) {
	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	var nodeName = dest.nodeName.toLowerCase();

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	dest.clearAttributes();

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	dest.mergeAttributes(src);

	// IE6-8 fail to clone children inside object elements that use
	// the proprietary classid attribute value (rather than the type
	// attribute) to identify the type of content to display
	if ( nodeName === "object" ) {
		dest.outerHTML = src.outerHTML;

	} else if ( nodeName === "input" && (src.type === "checkbox" || src.type === "radio") ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set
		if ( src.checked ) {
			dest.defaultChecked = dest.checked = src.checked;
		}

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		args[0].charAt(0) === "<" && !rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [],
			insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;

		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;

		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( "getElementsByTagName" in elem ) {
		return elem.getElementsByTagName( "*" );
	
	} else if ( "querySelectorAll" in elem ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var clone = elem.cloneNode(true),
				srcElements,
				destElements,
				i;

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName
			// instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				cloneFixAttributes( srcElements[i], destElements[i] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		// Return the cloned set
		return clone;
},
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, "<$1></$2>");

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );

				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},

	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache, internalKey = jQuery.expando, special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
				continue;
			}

			id = elem[ jQuery.expando ];

			if ( id ) {
				data = cache[ id ] && cache[ id ][ internalKey ];

				if ( data && data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}

					// Null the DOM reference to avoid IE6/7/8 leak (#7054)
					if ( data.handle ) {
						data.handle.elem = null;
					}
				}

				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}

				delete cache[ id ];
			}
		}
	}
});

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}




var ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],
	curCSS,

	getComputedStyle,
	currentStyle,

	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	// Setting 'undefined' is a no-op
	if ( arguments.length === 2 && value === undefined ) {
		return this;
	}

	return jQuery.access( this, name, value, true, function( elem, name, value ) {
		return value !== undefined ?
			jQuery.style( elem, name, value ) :
			jQuery.css( elem, name );
	});
};

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity", "opacity" );
					return ret === "" ? "1" : ret;

				} else {
					return elem.style.opacity;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"zIndex": true,
		"fontWeight": true,
		"opacity": true,
		"zoom": true,
		"lineHeight": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			style = elem.style, hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// Check if we're setting a value
		if ( value !== undefined ) {
			// Make sure that NaN and null values aren't set. See: #7116
			if ( typeof value === "number" && isNaN( value ) || value == null ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( typeof value === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra ) {
		// Make sure that we're working with the right name
		var ret, origName = jQuery.camelCase( name ),
			hooks = jQuery.cssHooks[ origName ];

		name = jQuery.cssProps[ origName ] || origName;

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks && (ret = hooks.get( elem, true, extra )) !== undefined ) {
			return ret;

		// Otherwise, if a way to get the computed value exists, use that
		} else if ( curCSS ) {
			return curCSS( elem, name, origName );
		}
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}
	},

	camelCase: function( string ) {
		return string.replace( rdashAlpha, fcamelCase );
	}
});

// DEPRECATED, Use jQuery.css() instead
jQuery.curCSS = jQuery.css;

jQuery.each(["height", "width"], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			var val;

			if ( computed ) {
				if ( elem.offsetWidth !== 0 ) {
					val = getWH( elem, name, extra );

				} else {
					jQuery.swap( elem, cssShow, function() {
						val = getWH( elem, name, extra );
					});
				}

				if ( val <= 0 ) {
					val = curCSS( elem, name, name );

					if ( val === "0px" && currentStyle ) {
						val = currentStyle( elem, name, name );
					}

					if ( val != null ) {
						// Should return "auto" instead of 0, use 0 for
						// temporary backwards-compat
						return val === "" || val === "auto" ? "0px" : val;
					}
				}

				if ( val < 0 || val == null ) {
					val = elem.style[ name ];

					// Should return "auto" instead of 0, use 0 for
					// temporary backwards-compat
					return val === "" || val === "auto" ? "0px" : val;
				}

				return typeof val === "string" ? val : val + "px";
			}
		},

		set: function( elem, value ) {
			if ( rnumpx.test( value ) ) {
				// ignore negative width and height values #1599
				value = parseFloat(value);

				if ( value >= 0 ) {
					return value + "px";
				}

			} else {
				return value;
			}
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style;

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// Set the alpha filter to set the opacity
			var opacity = jQuery.isNaN(value) ?
				"" :
				"alpha(opacity=" + value * 100 + ")",
				filter = style.filter || "";

			style.filter = ralpha.test(filter) ?
				filter.replace(ralpha, opacity) :
				style.filter + ' ' + opacity;
		}
	};
}

if ( document.defaultView && document.defaultView.getComputedStyle ) {
	getComputedStyle = function( elem, newName, name ) {
		var ret, defaultView, computedStyle;

		name = name.replace( rupper, "-$1" ).toLowerCase();

		if ( !(defaultView = elem.ownerDocument.defaultView) ) {
			return undefined;
		}

		if ( (computedStyle = defaultView.getComputedStyle( elem, null )) ) {
			ret = computedStyle.getPropertyValue( name );
			if ( ret === "" && !jQuery.contains( elem.ownerDocument.documentElement, elem ) ) {
				ret = jQuery.style( elem, name );
			}
		}

		return ret;
	};
}

if ( document.documentElement.currentStyle ) {
	currentStyle = function( elem, name ) {
		var left,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			rsLeft = elem.runtimeStyle && elem.runtimeStyle[ name ],
			style = elem.style;

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
			// Remember the original values
			left = style.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : (ret || 0);
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

curCSS = getComputedStyle || currentStyle;

function getWH( elem, name, extra ) {
	var which = name === "width" ? cssWidth : cssHeight,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

	if ( extra === "border" ) {
		return val;
	}

	jQuery.each( which, function() {
		if ( !extra ) {
			val -= parseFloat(jQuery.css( elem, "padding" + this )) || 0;
		}

		if ( extra === "margin" ) {
			val += parseFloat(jQuery.css( elem, "margin" + this )) || 0;

		} else {
			val -= parseFloat(jQuery.css( elem, "border" + this + "Width" )) || 0;
		}
	});

	return val;
}

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth,
			height = elem.offsetHeight;

		return (width === 0 && height === 0) || (!jQuery.support.reliableHiddenOffsets && (elem.style.display || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /(?:^file|^widget|\-extension):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rspacesAjax = /\s+/,
	rts = /([?&])_=[^&]*/,
	rucHeaders = /(^|\-)([a-z])/g,
	rucHeadersFunc = function( _, $1, $2 ) {
		return $1 + $2.toUpperCase();
	},
	rurl = /^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts;

// #8138, IE may throw an exception when accessing
// a field from document.location if document.domain has been set
try {
	ajaxLocation = document.location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() );

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		if ( jQuery.isFunction( func ) ) {
			var dataTypes = dataTypeExpression.toLowerCase().split( rspacesAjax ),
				i = 0,
				length = dataTypes.length,
				dataType,
				list,
				placeBefore;

			// For each dataType in the dataTypeExpression
			for(; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

//Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters ),
		selection;

	for(; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf( " " );
		if ( off >= 0 ) {
			var selector = url.slice( off, url.length );
			url = url.slice( 0, off );
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = undefined;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			// Complete callback (responseText is used internally)
			complete: function( jqXHR, status, responseText ) {
				// Store the response as specified by the jqXHR object
				responseText = jqXHR.responseText;
				// If successful, inject the HTML into all the matched elements
				if ( jqXHR.isResolved() ) {
					// #4825: Get the actual response in case
					// a dataFilter is present in ajaxSettings
					jqXHR.done(function( r ) {
						responseText = r;
					});
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						responseText );
				}

				if ( callback ) {
					self.each( callback, [ responseText, status, jqXHR ] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},

	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.bind( o, f );
	};
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
} );

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function ( target, settings ) {
		if ( !settings ) {
			// Only one parameter, we extend ajaxSettings
			settings = target;
			target = jQuery.extend( true, jQuery.ajaxSettings, settings );
		} else {
			// target was provided, we extend into it
			jQuery.extend( true, target, jQuery.ajaxSettings, settings );
		}
		// Flatten fields we don't want deep extended
		for( var field in { context: 1, url: 1 } ) {
			if ( field in settings ) {
				target[ field ] = settings[ field ];
			} else if( field in jQuery.ajaxSettings ) {
				target[ field ] = jQuery.ajaxSettings[ field ];
			}
		}
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		traditional: false,
		headers: {},
		crossDomain: null,
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": "*/*"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery._Deferred(),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {},
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						requestHeaders[ name.toLowerCase().replace( rucHeaders, rucHeadersFunc ) ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || "abort";
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, statusText, responses, headers ) {

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status ? 4 : 0;

			var isSuccess,
				success,
				error,
				response = responses ? ajaxHandleResponses( s, jqXHR, responses ) : undefined,
				lastModified,
				etag;

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					if ( ( lastModified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ ifModifiedKey ] = lastModified;
					}
					if ( ( etag = jqXHR.getResponseHeader( "Etag" ) ) ) {
						jQuery.etag[ ifModifiedKey ] = etag;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					try {
						success = ajaxConvert( s, response );
						statusText = "success";
						isSuccess = true;
					} catch(e) {
						// We have a parsererror
						statusText = "parsererror";
						error = e;
					}
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = statusText;

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.resolveWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.done;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.then( tmp, tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( rspacesAjax );

		// Determine if a cross-domain request is in order
		if ( !s.crossDomain ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] != ajaxLocParts[ 1 ] || parts[ 2 ] != ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefiler, stop there
		if ( state === 2 ) {
			return false;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( (ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			requestHeaders[ "Content-Type" ] = s.contentType;
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				requestHeaders[ "If-Modified-Since" ] = jQuery.lastModified[ ifModifiedKey ];
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				requestHeaders[ "If-None-Match" ] = jQuery.etag[ ifModifiedKey ];
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		requestHeaders.Accept = s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
			s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", */*; q=0.01" : "" ) :
			s.accepts[ "*" ];

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already
				jqXHR.abort();
				return false;

		}

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( status < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					jQuery.error( e );
				}
			}
		}

		return jqXHR;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction( value ) ? value() : value;
				s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
			};

		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}

		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			} );

		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[ prefix ], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join( "&" ).replace( r20, "+" );
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray( obj ) && obj.length ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		// If we see an array here, it is empty and should be treated as an empty
		// object
		if ( jQuery.isArray( obj ) || jQuery.isEmptyObject( obj ) ) {
			add( prefix, "" );

		// Serialize object item.
		} else {
			for ( var name in obj ) {
				buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
			}
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields,
		ct,
		type,
		finalDataType,
		firstDataType;

	// Fill responseXXX fields
	for( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	var dataTypes = s.dataTypes,
		converters = {},
		i,
		key,
		length = dataTypes.length,
		tmp,
		// Current and previous dataTypes
		current = dataTypes[ 0 ],
		prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1,
		conv2;

	// For each dataType in the chain
	for( i = 1; i < length; i++ ) {

		// Create converters map
		// with lowercased keys
		if ( i === 1 ) {
			for( key in s.converters ) {
				if( typeof key === "string" ) {
					converters[ key.toLowerCase() ] = s.converters[ key ];
				}
			}
		}

		// Get the dataTypes
		prev = current;
		current = dataTypes[ i ];

		// If current is auto dataType, update it to prev
		if( current === "*" ) {
			current = prev;
		// If no auto and dataTypes are actually different
		} else if ( prev !== "*" && prev !== current ) {

			// Get the converter
			conversion = prev + " " + current;
			conv = converters[ conversion ] || converters[ "* " + current ];

			// If there is no direct converter, search transitively
			if ( !conv ) {
				conv2 = undefined;
				for( conv1 in converters ) {
					tmp = conv1.split( " " );
					if ( tmp[ 0 ] === prev || tmp[ 0 ] === "*" ) {
						conv2 = converters[ tmp[1] + " " + current ];
						if ( conv2 ) {
							conv1 = converters[ conv1 ];
							if ( conv1 === true ) {
								conv = conv2;
							} else if ( conv2 === true ) {
								conv = conv1;
							}
							break;
						}
					}
				}
			}
			// If we found no converter, dispatch an error
			if ( !( conv || conv2 ) ) {
				jQuery.error( "No conversion from " + conversion.replace(" "," to ") );
			}
			// If found converter is not an equivalence
			if ( conv !== true ) {
				// Convert with 1 or 2 converters accordingly
				response = conv ? conv( response ) : conv2( conv1(response) );
			}
		}
	}
	return response;
}




var jsc = jQuery.now(),
	jsre = /(\=)\?(&|$)|()\?\?()/i;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		return jQuery.expando + "_" + ( jsc++ );
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var dataIsString = ( typeof s.data === "string" );

	if ( s.dataTypes[ 0 ] === "jsonp" ||
		originalSettings.jsonpCallback ||
		originalSettings.jsonp != null ||
		s.jsonp !== false && ( jsre.test( s.url ) ||
				dataIsString && jsre.test( s.data ) ) ) {

		var responseContainer,
			jsonpCallback = s.jsonpCallback =
				jQuery.isFunction( s.jsonpCallback ) ? s.jsonpCallback() : s.jsonpCallback,
			previous = window[ jsonpCallback ],
			url = s.url,
			data = s.data,
			replace = "$1" + jsonpCallback + "$2",
			cleanUp = function() {
				// Set callback back to previous value
				window[ jsonpCallback ] = previous;
				// Call if it was a function and we have a response
				if ( responseContainer && jQuery.isFunction( previous ) ) {
					window[ jsonpCallback ]( responseContainer[ 0 ] );
				}
			};

		if ( s.jsonp !== false ) {
			url = url.replace( jsre, replace );
			if ( s.url === url ) {
				if ( dataIsString ) {
					data = data.replace( jsre, replace );
				}
				if ( s.data === data ) {
					// Add callback manually
					url += (/\?/.test( url ) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
				}
			}
		}

		s.url = url;
		s.data = data;

		// Install callback
		window[ jsonpCallback ] = function( response ) {
			responseContainer = [ response ];
		};

		// Install cleanUp function
		jqXHR.then( cleanUp, cleanUp );

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( jsonpCallback + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Delegate to script
		return "script";
	}
} );




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
} );




var // #5280: next active xhr id and list of active xhrs' callbacks
	xhrId = jQuery.now(),
	xhrCallbacks,

	// XHR used to determine supports properties
	testXHR;

// #5280: Internet Explorer will keep connections alive if we don't abort on unload
function xhrOnUnloadAbort() {
	jQuery( window ).unload(function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	});
}

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Test if we can create an xhr object
testXHR = jQuery.ajaxSettings.xhr();
jQuery.support.ajax = !!testXHR;

// Does this browser support crossDomain XHR requests
jQuery.support.cors = testXHR && ( "withCredentials" in testXHR );

// No need for the temporary xhr anymore
testXHR = undefined;

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var xhr = s.xhr(),
						handle,
						i;

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// Requested-With header
					// Not set for crossDomain requests with no content
					// (see why at http://trac.dojotoolkit.org/ticket/9486)
					// Won't change header if already provided
					if ( !( s.crossDomain && !s.hasContent ) && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occured
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									delete xhrCallbacks[ handle ];
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}
									responses.text = xhr.responseText;

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					// if we're in sync mode or it's in cache
					// and has been retrieved directly (IE6 & IE7)
					// we need to manually fire the callback
					if ( !s.async || xhr.readyState === 4 ) {
						callback();
					} else {
						// Create the active xhrs callbacks list if needed
						// and attach the unload handler
						if ( !xhrCallbacks ) {
							xhrCallbacks = {};
							xhrOnUnloadAbort();
						}
						// Add to list of active xhrs callbacks
						handle = xhrId++;
						xhr.onreadystatechange = xhrCallbacks[ handle ] = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}




var elemdisplay = {},
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !jQuery._data(elem, "olddisplay") && display === "none" ) {
					display = elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
					jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				if ( display === "" || display === "none" ) {
					elem.style.display = jQuery._data(elem, "olddisplay") || "";
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				var display = jQuery.css( this[i], "display" );

				if ( display !== "none" && !jQuery._data( this[i], "olddisplay" ) ) {
					jQuery._data( this[i], "olddisplay", display );
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				this[i].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			var opt = jQuery.extend({}, optall), p,
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = jQuery.camelCase( p );

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( isElement && ( p === "height" || p === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							var display = defaultDisplay(this.nodeName);

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur();

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || ( jQuery.cssNumber[ name ] ? "" : "px" );

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( self, name, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( self, name, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var parsed,
			r = jQuery.css( this.elem, this.prop );
		// Empty strings, null, undefined and "auto" are converted to 0,
		// complex values such as "rotate(1rad)" are returned as is,
		// simple values such as "10px" are parsed to Float.
		return isNaN( parsed = parseFloat( r ) ) ? !r || r === "auto" ? 0 : r : parsed;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = jQuery.now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || ( jQuery.cssNumber[ this.prop ] ? "" : "px" );
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(fx.tick, fx.interval);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = jQuery.now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( this.options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {
					var elem = this.elem,
						options = this.options;

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					} );
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style( this.elem, p, this.options.orig[p] );
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function defaultDisplay( nodeName ) {
	if ( !elemdisplay[ nodeName ] ) {
		var elem = jQuery("<" + nodeName + ">").appendTo("body"),
			display = elem.css("display");

		elem.remove();

		if ( display === "none" || display === "" ) {
			display = "block";
		}

		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ),
			scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft),
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1),
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is absolute
		if ( calculatePosition ) {
			curPosition = curElem.position();
		}

		curTop  = calculatePosition ? curPosition.top  : parseInt( curCSSTop,  10 ) || 0;
		curLeft = calculatePosition ? curPosition.left : parseInt( curCSSLeft, 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;

		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}

		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
			var docElemProp = elem.document.documentElement[ "client" + name ];
			return elem.document.compatMode === "CSS1Compat" && docElemProp ||
				elem.document.body[ "client" + name ] || docElemProp;

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


window.jQuery = window.$ = jQuery;
})(window);
;/*!
 * jQuery UI 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.ui = $.ui || {};
if ( $.ui.version ) {
	return;
}

$.extend( $.ui, {
	version: "1.8.12",

	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	}
});

// plugins
$.fn.extend({
	_focus: $.fn.focus,
	focus: function( delay, fn ) {
		return typeof delay === "number" ?
			this.each(function() {
				var elem = this;
				setTimeout(function() {
					$( elem ).focus();
					if ( fn ) {
						fn.call( elem );
					}
				}, delay );
			}) :
			this._focus.apply( this, arguments );
	},

	scrollParent: function() {
		var scrollParent;
		if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.curCSS(this,'position',1)) && (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.curCSS(this,'overflow',1)+$.curCSS(this,'overflow-y',1)+$.curCSS(this,'overflow-x',1));
			}).eq(0);
		}

		return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	},

	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	}
});

$.each( [ "Width", "Height" ], function( i, name ) {
	var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
		type = name.toLowerCase(),
		orig = {
			innerWidth: $.fn.innerWidth,
			innerHeight: $.fn.innerHeight,
			outerWidth: $.fn.outerWidth,
			outerHeight: $.fn.outerHeight
		};

	function reduce( elem, size, border, margin ) {
		$.each( side, function() {
			size -= parseFloat( $.curCSS( elem, "padding" + this, true) ) || 0;
			if ( border ) {
				size -= parseFloat( $.curCSS( elem, "border" + this + "Width", true) ) || 0;
			}
			if ( margin ) {
				size -= parseFloat( $.curCSS( elem, "margin" + this, true) ) || 0;
			}
		});
		return size;
	}

	$.fn[ "inner" + name ] = function( size ) {
		if ( size === undefined ) {
			return orig[ "inner" + name ].call( this );
		}

		return this.each(function() {
			$( this ).css( type, reduce( this, size ) + "px" );
		});
	};

	$.fn[ "outer" + name] = function( size, margin ) {
		if ( typeof size !== "number" ) {
			return orig[ "outer" + name ].call( this, size );
		}

		return this.each(function() {
			$( this).css( type, reduce( this, size, true, margin ) + "px" );
		});
	};
});

// selectors
function visible( element ) {
	return !$( element ).parents().andSelf().filter(function() {
		return $.curCSS( this, "visibility" ) === "hidden" ||
			$.expr.filters.hidden( this );
	}).length;
}

$.extend( $.expr[ ":" ], {
	data: function( elem, i, match ) {
		return !!$.data( elem, match[ 3 ] );
	},

	focusable: function( element ) {
		var nodeName = element.nodeName.toLowerCase(),
			tabIndex = $.attr( element, "tabindex" );
		if ( "area" === nodeName ) {
			var map = element.parentNode,
				mapName = map.name,
				img;
			if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
				return false;
			}
			img = $( "img[usemap=#" + mapName + "]" )[0];
			return !!img && visible( img );
		}
		return ( /input|select|textarea|button|object/.test( nodeName )
			? !element.disabled
			: "a" == nodeName
				? element.href || !isNaN( tabIndex )
				: !isNaN( tabIndex ))
			// the element and all of its ancestors must be visible
			&& visible( element );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" );
		return ( isNaN( tabIndex ) || tabIndex >= 0 ) && $( element ).is( ":focusable" );
	}
});

// support
$(function() {
	var body = document.body,
		div = body.appendChild( div = document.createElement( "div" ) );

	$.extend( div.style, {
		minHeight: "100px",
		height: "auto",
		padding: 0,
		borderWidth: 0
	});

	$.support.minHeight = div.offsetHeight === 100;
	$.support.selectstart = "onselectstart" in div;

	// set display to none to avoid a layout bug in IE
	// http://dev.jquery.com/ticket/4014
	body.removeChild( div ).style.display = "none";
});





// deprecated
$.extend( $.ui, {
	// $.ui.plugin is deprecated.  Use the proxy pattern instead.
	plugin: {
		add: function( module, option, set ) {
			var proto = $.ui[ module ].prototype;
			for ( var i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var set = instance.plugins[ name ];
			if ( !set || !instance.element[ 0 ].parentNode ) {
				return;
			}
	
			for ( var i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ] ) {
					set[ i ][ 1 ].apply( instance.element, args );
				}
			}
		}
	},
	
	// will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
	contains: function( a, b ) {
		return document.compareDocumentPosition ?
			a.compareDocumentPosition( b ) & 16 :
			a !== b && a.contains( b );
	},
	
	// only used by resizable
	hasScroll: function( el, a ) {
	
		//If overflow is hidden, the element might have extra content, but the user wants to hide it
		if ( $( el ).css( "overflow" ) === "hidden") {
			return false;
		}
	
		var scroll = ( a && a === "left" ) ? "scrollLeft" : "scrollTop",
			has = false;
	
		if ( el[ scroll ] > 0 ) {
			return true;
		}
	
		// TODO: determine which cases actually cause this to happen
		// if the element doesn't have the scroll set, see if it's possible to
		// set the scroll
		el[ scroll ] = 1;
		has = ( el[ scroll ] > 0 );
		el[ scroll ] = 0;
		return has;
	},
	
	// these are odd functions, fix the API or move into individual plugins
	isOverAxis: function( x, reference, size ) {
		//Determines when x coordinate is over "b" element axis
		return ( x > reference ) && ( x < ( reference + size ) );
	},
	isOver: function( y, x, top, left, height, width ) {
		//Determines when x, y coordinates is over "b" element
		return $.ui.isOverAxis( y, top, height ) && $.ui.isOverAxis( x, left, width );
	}
});

})( jQuery );
/*!
 * jQuery UI Widget 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $, undefined ) {

// jQuery 1.4+
if ( $.cleanData ) {
	var _cleanData = $.cleanData;
	$.cleanData = function( elems ) {
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			$( elem ).triggerHandler( "remove" );
		}
		_cleanData( elems );
	};
} else {
	var _remove = $.fn.remove;
	$.fn.remove = function( selector, keepData ) {
		return this.each(function() {
			if ( !keepData ) {
				if ( !selector || $.filter( selector, [ this ] ).length ) {
					$( "*", this ).add( [ this ] ).each(function() {
						$( this ).triggerHandler( "remove" );
					});
				}
			}
			return _remove.call( $(this), selector, keepData );
		});
	};
}

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName ] = function( elem ) {
		return !!$.data( elem, name );
	};

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
//	$.each( basePrototype, function( key, val ) {
//		if ( $.isPlainObject(val) ) {
//			basePrototype[ key ] = $.extend( {}, val );
//		}
//	});
	basePrototype.options = $.extend( true, {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) :
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.charAt( 0 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				// TODO: add this back in 1.9 and use $.error() (see #5972)
//				if ( !instance ) {
//					throw "cannot call methods on " + name + " prior to initialization; " +
//						"attempted to call method '" + options + "'";
//				}
//				if ( !$.isFunction( instance[options] ) ) {
//					throw "no such method '" + options + "' for " + name + " widget instance";
//				}
//				var methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, name, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs
		$.data( element, this.widgetName, this );
		this.element = $( element );
		this.options = $.extend( true, {},
			this.options,
			this._getCreateOptions(),
			options );

		var self = this;
		this.element.bind( "remove." + this.widgetName, function() {
			self.destroy();
		});

		this._create();
		this._trigger( "create" );
		this._init();
	},
	_getCreateOptions: function() {
		return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	},
	_create: function() {},
	_init: function() {},

	destroy: function() {
		this.element
			.unbind( "." + this.widgetName )
			.removeData( this.widgetName );
		this.widget()
			.unbind( "." + this.widgetName )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetBaseClass + "-disabled " +
				"ui-state-disabled" );
	},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, this.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var self = this;
		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				[ value ? "addClass" : "removeClass"](
					this.widgetBaseClass + "-disabled" + " " +
					"ui-state-disabled" )
				.attr( "aria-disabled", value );
		}

		return this;
	},

	enable: function() {
		return this._setOption( "disabled", false );
	},
	disable: function() {
		return this._setOption( "disabled", true );
	},

	_trigger: function( type, event, data ) {
		var callback = this.options[ type ];

		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		data = data || {};

		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if ( event.originalEvent ) {
			for ( var i = $.event.props.length, prop; i; ) {
				prop = $.event.props[ --i ];
				event[ prop ] = event.originalEvent[ prop ];
			}
		}

		this.element.trigger( event, data );

		return !( $.isFunction(callback) &&
			callback.call( this.element[0], event, data ) === false ||
			event.isDefaultPrevented() );
	}
};

})( jQuery );
/*!
 * jQuery UI Mouse 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.mouse", {
	options: {
		cancel: ':input,option',
		distance: 1,
		delay: 0
	},
	_mouseInit: function() {
		var self = this;

		this.element
			.bind('mousedown.'+this.widgetName, function(event) {
				return self._mouseDown(event);
			})
			.bind('click.'+this.widgetName, function(event) {
				if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
				    $.removeData(event.target, self.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

		this.started = false;
	},

	// TODO: make sure destroying one instance of mouse doesn't mess with
	// other instances of mouse
	_mouseDestroy: function() {
		this.element.unbind('.'+this.widgetName);
	},

	_mouseDown: function(event) {
		// don't let more than one widget handle mouseStart
		// TODO: figure out why we have to use originalEvent
		event.originalEvent = event.originalEvent || {};
		if (event.originalEvent.mouseHandled) { return; }

		// we may have missed mouseup (out of window)
		(this._mouseStarted && this._mouseUp(event));

		this._mouseDownEvent = event;

		var self = this,
			btnIsLeft = (event.which == 1),
			elIsCancel = (typeof this.options.cancel == "string" ? $(event.target).parents().add(event.target).filter(this.options.cancel).length : false);
		if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
			return true;
		}

		this.mouseDelayMet = !this.options.delay;
		if (!this.mouseDelayMet) {
			this._mouseDelayTimer = setTimeout(function() {
				self.mouseDelayMet = true;
			}, this.options.delay);
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted = (this._mouseStart(event) !== false);
			if (!this._mouseStarted) {
				event.preventDefault();
				return true;
			}
		}

		// Click event may never have fired (Gecko & Opera)
		if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
			$.removeData(event.target, this.widgetName + '.preventClickEvent');
		}

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseMove(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseUp(event);
		};
		$(document)
			.bind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.bind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		event.preventDefault();
		event.originalEvent.mouseHandled = true;
		return true;
	},

	_mouseMove: function(event) {
		// IE mouseup check - mouseup happened when mouse was out of window
		if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
			return this._mouseUp(event);
		}

		if (this._mouseStarted) {
			this._mouseDrag(event);
			return event.preventDefault();
		}

		if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
			this._mouseStarted =
				(this._mouseStart(this._mouseDownEvent, event) !== false);
			(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
		}

		return !this._mouseStarted;
	},

	_mouseUp: function(event) {
		$(document)
			.unbind('mousemove.'+this.widgetName, this._mouseMoveDelegate)
			.unbind('mouseup.'+this.widgetName, this._mouseUpDelegate);

		if (this._mouseStarted) {
			this._mouseStarted = false;

			if (event.target == this._mouseDownEvent.target) {
			    $.data(event.target, this.widgetName + '.preventClickEvent', true);
			}

			this._mouseStop(event);
		}

		return false;
	},

	_mouseDistanceMet: function(event) {
		return (Math.max(
				Math.abs(this._mouseDownEvent.pageX - event.pageX),
				Math.abs(this._mouseDownEvent.pageY - event.pageY)
			) >= this.options.distance
		);
	},

	_mouseDelayMet: function(event) {
		return this.mouseDelayMet;
	},

	// These are placeholder methods, to be overriden by extending plugin
	_mouseStart: function(event) {},
	_mouseDrag: function(event) {},
	_mouseStop: function(event) {},
	_mouseCapture: function(event) { return true; }
});

})(jQuery);
/*
 * jQuery UI Position 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Position
 */
(function( $, undefined ) {

$.ui = $.ui || {};

var horizontalPositions = /left|center|right/,
	verticalPositions = /top|center|bottom/,
	center = "center",
	_position = $.fn.position,
	_offset = $.fn.offset;

$.fn.position = function( options ) {
	if ( !options || !options.of ) {
		return _position.apply( this, arguments );
	}

	// make a copy, we don't want to modify arguments
	options = $.extend( {}, options );

	var target = $( options.of ),
		targetElem = target[0],
		collision = ( options.collision || "flip" ).split( " " ),
		offset = options.offset ? options.offset.split( " " ) : [ 0, 0 ],
		targetWidth,
		targetHeight,
		basePosition;

	if ( targetElem.nodeType === 9 ) {
		targetWidth = target.width();
		targetHeight = target.height();
		basePosition = { top: 0, left: 0 };
	// TODO: use $.isWindow() in 1.9
	} else if ( targetElem.setTimeout ) {
		targetWidth = target.width();
		targetHeight = target.height();
		basePosition = { top: target.scrollTop(), left: target.scrollLeft() };
	} else if ( targetElem.preventDefault ) {
		// force left top to allow flipping
		options.at = "left top";
		targetWidth = targetHeight = 0;
		basePosition = { top: options.of.pageY, left: options.of.pageX };
	} else {
		targetWidth = target.outerWidth();
		targetHeight = target.outerHeight();
		basePosition = target.offset();
	}

	// force my and at to have valid horizontal and veritcal positions
	// if a value is missing or invalid, it will be converted to center 
	$.each( [ "my", "at" ], function() {
		var pos = ( options[this] || "" ).split( " " );
		if ( pos.length === 1) {
			pos = horizontalPositions.test( pos[0] ) ?
				pos.concat( [center] ) :
				verticalPositions.test( pos[0] ) ?
					[ center ].concat( pos ) :
					[ center, center ];
		}
		pos[ 0 ] = horizontalPositions.test( pos[0] ) ? pos[ 0 ] : center;
		pos[ 1 ] = verticalPositions.test( pos[1] ) ? pos[ 1 ] : center;
		options[ this ] = pos;
	});

	// normalize collision option
	if ( collision.length === 1 ) {
		collision[ 1 ] = collision[ 0 ];
	}

	// normalize offset option
	offset[ 0 ] = parseInt( offset[0], 10 ) || 0;
	if ( offset.length === 1 ) {
		offset[ 1 ] = offset[ 0 ];
	}
	offset[ 1 ] = parseInt( offset[1], 10 ) || 0;

	if ( options.at[0] === "right" ) {
		basePosition.left += targetWidth;
	} else if ( options.at[0] === center ) {
		basePosition.left += targetWidth / 2;
	}

	if ( options.at[1] === "bottom" ) {
		basePosition.top += targetHeight;
	} else if ( options.at[1] === center ) {
		basePosition.top += targetHeight / 2;
	}

	basePosition.left += offset[ 0 ];
	basePosition.top += offset[ 1 ];

	return this.each(function() {
		var elem = $( this ),
			elemWidth = elem.outerWidth(),
			elemHeight = elem.outerHeight(),
			marginLeft = parseInt( $.curCSS( this, "marginLeft", true ) ) || 0,
			marginTop = parseInt( $.curCSS( this, "marginTop", true ) ) || 0,
			collisionWidth = elemWidth + marginLeft +
				( parseInt( $.curCSS( this, "marginRight", true ) ) || 0 ),
			collisionHeight = elemHeight + marginTop +
				( parseInt( $.curCSS( this, "marginBottom", true ) ) || 0 ),
			position = $.extend( {}, basePosition ),
			collisionPosition;

		if ( options.my[0] === "right" ) {
			position.left -= elemWidth;
		} else if ( options.my[0] === center ) {
			position.left -= elemWidth / 2;
		}

		if ( options.my[1] === "bottom" ) {
			position.top -= elemHeight;
		} else if ( options.my[1] === center ) {
			position.top -= elemHeight / 2;
		}

		// prevent fractions (see #5280)
		position.left = Math.round( position.left );
		position.top = Math.round( position.top );

		collisionPosition = {
			left: position.left - marginLeft,
			top: position.top - marginTop
		};

		$.each( [ "left", "top" ], function( i, dir ) {
			if ( $.ui.position[ collision[i] ] ) {
				$.ui.position[ collision[i] ][ dir ]( position, {
					targetWidth: targetWidth,
					targetHeight: targetHeight,
					elemWidth: elemWidth,
					elemHeight: elemHeight,
					collisionPosition: collisionPosition,
					collisionWidth: collisionWidth,
					collisionHeight: collisionHeight,
					offset: offset,
					my: options.my,
					at: options.at
				});
			}
		});

		if ( $.fn.bgiframe ) {
			elem.bgiframe();
		}
		elem.offset( $.extend( position, { using: options.using } ) );
	});
};

$.ui.position = {
	fit: {
		left: function( position, data ) {
			var win = $( window ),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft();
			position.left = over > 0 ? position.left - over : Math.max( position.left - data.collisionPosition.left, position.left );
		},
		top: function( position, data ) {
			var win = $( window ),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop();
			position.top = over > 0 ? position.top - over : Math.max( position.top - data.collisionPosition.top, position.top );
		}
	},

	flip: {
		left: function( position, data ) {
			if ( data.at[0] === center ) {
				return;
			}
			var win = $( window ),
				over = data.collisionPosition.left + data.collisionWidth - win.width() - win.scrollLeft(),
				myOffset = data.my[ 0 ] === "left" ?
					-data.elemWidth :
					data.my[ 0 ] === "right" ?
						data.elemWidth :
						0,
				atOffset = data.at[ 0 ] === "left" ?
					data.targetWidth :
					-data.targetWidth,
				offset = -2 * data.offset[ 0 ];
			position.left += data.collisionPosition.left < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
		},
		top: function( position, data ) {
			if ( data.at[1] === center ) {
				return;
			}
			var win = $( window ),
				over = data.collisionPosition.top + data.collisionHeight - win.height() - win.scrollTop(),
				myOffset = data.my[ 1 ] === "top" ?
					-data.elemHeight :
					data.my[ 1 ] === "bottom" ?
						data.elemHeight :
						0,
				atOffset = data.at[ 1 ] === "top" ?
					data.targetHeight :
					-data.targetHeight,
				offset = -2 * data.offset[ 1 ];
			position.top += data.collisionPosition.top < 0 ?
				myOffset + atOffset + offset :
				over > 0 ?
					myOffset + atOffset + offset :
					0;
		}
	}
};

// offset setter from jQuery 1.4
if ( !$.offset.setOffset ) {
	$.offset.setOffset = function( elem, options ) {
		// set position first, in-case top/left are set even on static elem
		if ( /static/.test( $.curCSS( elem, "position" ) ) ) {
			elem.style.position = "relative";
		}
		var curElem   = $( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( $.curCSS( elem, "top",  true ), 10 ) || 0,
			curLeft   = parseInt( $.curCSS( elem, "left", true ), 10)  || 0,
			props     = {
				top:  (options.top  - curOffset.top)  + curTop,
				left: (options.left - curOffset.left) + curLeft
			};
		
		if ( 'using' in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	};

	$.fn.offset = function( options ) {
		var elem = this[ 0 ];
		if ( !elem || !elem.ownerDocument ) { return null; }
		if ( options ) { 
			return this.each(function() {
				$.offset.setOffset( this, options );
			});
		}
		return _offset.call( this );
	};
}

}( jQuery ));
/*
 * jQuery UI Draggable 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.draggable", $.ui.mouse, {
	widgetEventPrefix: "drag",
	options: {
		addClasses: true,
		appendTo: "parent",
		axis: false,
		connectToSortable: false,
		containment: false,
		cursor: "auto",
		cursorAt: false,
		grid: false,
		handle: false,
		helper: "original",
		iframeFix: false,
		opacity: false,
		refreshPositions: false,
		revert: false,
		revertDuration: 500,
		scope: "default",
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		snap: false,
		snapMode: "both",
		snapTolerance: 20,
		stack: false,
		zIndex: false
	},
	_create: function() {

		if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
			this.element[0].style.position = 'relative';

		(this.options.addClasses && this.element.addClass("ui-draggable"));
		(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

		this._mouseInit();

	},

	destroy: function() {
		if(!this.element.data('draggable')) return;
		this.element
			.removeData("draggable")
			.unbind(".draggable")
			.removeClass("ui-draggable"
				+ " ui-draggable-dragging"
				+ " ui-draggable-disabled");
		this._mouseDestroy();

		return this;
	},

	_mouseCapture: function(event) {

		var o = this.options;

		// among others, prevent a drag on a resizable-handle
		if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
			return false;

		//Quit if we're not on a valid handle
		this.handle = this._getHandle(event);
		if (!this.handle)
			return false;

		return true;

	},

	_mouseStart: function(event) {

		var o = this.options;

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		//If ddmanager is used for droppables, set the global draggable
		if($.ui.ddmanager)
			$.ui.ddmanager.current = this;

		/*
		 * - Position generation -
		 * This block generates everything position related - it's the core of draggables.
		 */

		//Cache the margins of the original element
		this._cacheMargins();

		//Store the helper's css position
		this.cssPosition = this.helper.css("position");
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.positionAbs = this.element.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		$.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		//Generate the original position
		this.originalPosition = this.position = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

		//Set a containment if given in the options
		if(o.containment)
			this._setContainment();

		//Trigger event + callbacks
		if(this._trigger("start", event) === false) {
			this._clear();
			return false;
		}

		//Recache the helper size
		this._cacheHelperProportions();

		//Prepare the droppable offsets
		if ($.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(this, event);

		this.helper.addClass("ui-draggable-dragging");
		this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;
	},

	_mouseDrag: function(event, noPropagation) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		//Call plugins and callbacks and use the resulting position if something is returned
		if (!noPropagation) {
			var ui = this._uiHash();
			if(this._trigger('drag', event, ui) === false) {
				this._mouseUp({});
				return false;
			}
			this.position = ui.position;
		}

		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

		return false;
	},

	_mouseStop: function(event) {

		//If we are using droppables, inform the manager about the drop
		var dropped = false;
		if ($.ui.ddmanager && !this.options.dropBehaviour)
			dropped = $.ui.ddmanager.drop(this, event);

		//if a drop comes from outside (a sortable)
		if(this.dropped) {
			dropped = this.dropped;
			this.dropped = false;
		}
		
		//if the original element is removed, don't bother to continue if helper is set to "original"
		if((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
			return false;

		if((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
			var self = this;
			$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
				if(self._trigger("stop", event) !== false) {
					self._clear();
				}
			});
		} else {
			if(this._trigger("stop", event) !== false) {
				this._clear();
			}
		}

		return false;
	},
	
	cancel: function() {
		
		if(this.helper.is(".ui-draggable-dragging")) {
			this._mouseUp({});
		} else {
			this._clear();
		}
		
		return this;
		
	},

	_getHandle: function(event) {

		var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
		$(this.options.handle, this.element)
			.find("*")
			.andSelf()
			.each(function() {
				if(this == event.target) handle = true;
			});

		return handle;

	},

	_createHelper: function(event) {

		var o = this.options;
		var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone() : this.element);

		if(!helper.parents('body').length)
			helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

		if(helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
			helper.css("position", "absolute");

		return helper;

	},

	_adjustOffsetFromHelper: function(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if ($.isArray(obj)) {
			obj = {left: +obj[0], top: +obj[1] || 0};
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
		|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
		};

	},

	_getRelativeOffset: function() {

		if(this.cssPosition == "relative") {
			var p = this.element.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"),10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"),10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}

	},

	_cacheMargins: function() {
		this.margins = {
			left: (parseInt(this.element.css("marginLeft"),10) || 0),
			top: (parseInt(this.element.css("marginTop"),10) || 0),
			right: (parseInt(this.element.css("marginRight"),10) || 0),
			bottom: (parseInt(this.element.css("marginBottom"),10) || 0)
		};
	},

	_cacheHelperProportions: function() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function() {

		var o = this.options;
		if(o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if(o.containment == 'document' || o.containment == 'window') this.containment = [
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) - this.offset.relative.left - this.offset.parent.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) - this.offset.relative.top - this.offset.parent.top,
			(o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left,
			(o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
		];

		if(!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
			var ce = $(o.containment)[0]; if(!ce) return;
			var co = $(o.containment).offset();
			var over = ($(ce).css("overflow") != 'hidden');

			this.containment = [
				co.left + (parseInt($(ce).css("borderLeftWidth"),10) || 0) + (parseInt($(ce).css("paddingLeft"),10) || 0),
				co.top + (parseInt($(ce).css("borderTopWidth"),10) || 0) + (parseInt($(ce).css("paddingTop"),10) || 0),
				co.left+(over ? Math.max(ce.scrollWidth,ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"),10) || 0) - (parseInt($(ce).css("paddingRight"),10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right,
				co.top+(over ? Math.max(ce.scrollHeight,ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"),10) || 0) - (parseInt($(ce).css("paddingBottom"),10) || 0) - this.helperProportions.height - this.margins.top  - this.margins.bottom
			];
		} else if(o.containment.constructor == Array) {
			this.containment = o.containment;
		}

	},

	_convertPositionTo: function(d, pos) {

		if(!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

		return {
			top: (
				pos.top																	// The absolute mouse position
				+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
			),
			left: (
				pos.left																// The absolute mouse position
				+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
			)
		};

	},

	_generatePosition: function(event) {

		var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
		 * - Position constraining -
		 * Constrain the position to a mix of grid, containment.
		 */

		if(this.originalPosition) { //If we are not dragging yet, we won't check for options

			if(this.containment) {
				if(event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if(event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if(event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if(event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if(o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
			}

		}

		return {
			top: (
				pageY																// The absolute mouse position
				- this.offset.click.top													// Click offset (relative to the element)
				- this.offset.relative.top												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
			),
			left: (
				pageX																// The absolute mouse position
				- this.offset.click.left												// Click offset (relative to the element)
				- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
			)
		};

	},

	_clear: function() {
		this.helper.removeClass("ui-draggable-dragging");
		if(this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
		//if($.ui.ddmanager) $.ui.ddmanager.current = null;
		this.helper = null;
		this.cancelHelperRemoval = false;
	},

	// From now on bulk stuff - mainly helpers

	_trigger: function(type, event, ui) {
		ui = ui || this._uiHash();
		$.ui.plugin.call(this, type, [event, ui]);
		if(type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
		return $.Widget.prototype._trigger.call(this, type, event, ui);
	},

	plugins: {},

	_uiHash: function(event) {
		return {
			helper: this.helper,
			position: this.position,
			originalPosition: this.originalPosition,
			offset: this.positionAbs
		};
	}

});

$.extend($.ui.draggable, {
	version: "1.8.12"
});

$.ui.plugin.add("draggable", "connectToSortable", {
	start: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options,
			uiSortable = $.extend({}, ui, { item: inst.element });
		inst.sortables = [];
		$(o.connectToSortable).each(function() {
			var sortable = $.data(this, 'sortable');
			if (sortable && !sortable.options.disabled) {
				inst.sortables.push({
					instance: sortable,
					shouldRevert: sortable.options.revert
				});
				sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
				sortable._trigger("activate", event, uiSortable);
			}
		});

	},
	stop: function(event, ui) {

		//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
		var inst = $(this).data("draggable"),
			uiSortable = $.extend({}, ui, { item: inst.element });

		$.each(inst.sortables, function() {
			if(this.instance.isOver) {

				this.instance.isOver = 0;

				inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
				this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

				//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
				if(this.shouldRevert) this.instance.options.revert = true;

				//Trigger the stop of the sortable
				this.instance._mouseStop(event);

				this.instance.options.helper = this.instance.options._helper;

				//If the helper has been the original item, restore properties in the sortable
				if(inst.options.helper == 'original')
					this.instance.currentItem.css({ top: 'auto', left: 'auto' });

			} else {
				this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
				this.instance._trigger("deactivate", event, uiSortable);
			}

		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), self = this;

		var checkPos = function(o) {
			var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
			var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
			var itemHeight = o.height, itemWidth = o.width;
			var itemTop = o.top, itemLeft = o.left;

			return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
		};

		$.each(inst.sortables, function(i) {
			
			//Copy over some variables to allow calling the sortable's native _intersectsWith
			this.instance.positionAbs = inst.positionAbs;
			this.instance.helperProportions = inst.helperProportions;
			this.instance.offset.click = inst.offset.click;
			
			if(this.instance._intersectsWith(this.instance.containerCache)) {

				//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
				if(!this.instance.isOver) {

					this.instance.isOver = 1;
					//Now we fake the start of dragging for the sortable instance,
					//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
					//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
					this.instance.currentItem = $(self).clone().appendTo(this.instance.element).data("sortable-item", true);
					this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
					this.instance.options.helper = function() { return ui.helper[0]; };

					event.target = this.instance.currentItem[0];
					this.instance._mouseCapture(event, true);
					this.instance._mouseStart(event, true, true);

					//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
					this.instance.offset.click.top = inst.offset.click.top;
					this.instance.offset.click.left = inst.offset.click.left;
					this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
					this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

					inst._trigger("toSortable", event);
					inst.dropped = this.instance.element; //draggable revert needs that
					//hack so receive/update callbacks work (mostly)
					inst.currentItem = inst.element;
					this.instance.fromOutside = inst;

				}

				//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
				if(this.instance.currentItem) this.instance._mouseDrag(event);

			} else {

				//If it doesn't intersect with the sortable, and it intersected before,
				//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
				if(this.instance.isOver) {

					this.instance.isOver = 0;
					this.instance.cancelHelperRemoval = true;
					
					//Prevent reverting on this forced stop
					this.instance.options.revert = false;
					
					// The out event needs to be triggered independently
					this.instance._trigger('out', event, this.instance._uiHash(this.instance));
					
					this.instance._mouseStop(event, true);
					this.instance.options.helper = this.instance.options._helper;

					//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
					this.instance.currentItem.remove();
					if(this.instance.placeholder) this.instance.placeholder.remove();

					inst._trigger("fromSortable", event);
					inst.dropped = false; //draggable revert needs that
				}

			};

		});

	}
});

$.ui.plugin.add("draggable", "cursor", {
	start: function(event, ui) {
		var t = $('body'), o = $(this).data('draggable').options;
		if (t.css("cursor")) o._cursor = t.css("cursor");
		t.css("cursor", o.cursor);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if (o._cursor) $('body').css("cursor", o._cursor);
	}
});

$.ui.plugin.add("draggable", "iframeFix", {
	start: function(event, ui) {
		var o = $(this).data('draggable').options;
		$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
			$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
			.css({
				width: this.offsetWidth+"px", height: this.offsetHeight+"px",
				position: "absolute", opacity: "0.001", zIndex: 1000
			})
			.css($(this).offset())
			.appendTo("body");
		});
	},
	stop: function(event, ui) {
		$("div.ui-draggable-iframeFix").each(function() { this.parentNode.removeChild(this); }); //Remove frame helpers
	}
});

$.ui.plugin.add("draggable", "opacity", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data('draggable').options;
		if(t.css("opacity")) o._opacity = t.css("opacity");
		t.css('opacity', o.opacity);
	},
	stop: function(event, ui) {
		var o = $(this).data('draggable').options;
		if(o._opacity) $(ui.helper).css('opacity', o._opacity);
	}
});

$.ui.plugin.add("draggable", "scroll", {
	start: function(event, ui) {
		var i = $(this).data("draggable");
		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
	},
	drag: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options, scrolled = false;

		if(i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

			if(!o.axis || o.axis != 'x') {
				if((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
				else if(event.pageY - i.overflowOffset.top < o.scrollSensitivity)
					i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
			}

			if(!o.axis || o.axis != 'y') {
				if((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
				else if(event.pageX - i.overflowOffset.left < o.scrollSensitivity)
					i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
			}

		} else {

			if(!o.axis || o.axis != 'x') {
				if(event.pageY - $(document).scrollTop() < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
				else if($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
					scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
			}

			if(!o.axis || o.axis != 'y') {
				if(event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
				else if($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
					scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
			}

		}

		if(scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
			$.ui.ddmanager.prepareOffsets(i, event);

	}
});

$.ui.plugin.add("draggable", "snap", {
	start: function(event, ui) {

		var i = $(this).data("draggable"), o = i.options;
		i.snapElements = [];

		$(o.snap.constructor != String ? ( o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
			var $t = $(this); var $o = $t.offset();
			if(this != i.element[0]) i.snapElements.push({
				item: this,
				width: $t.outerWidth(), height: $t.outerHeight(),
				top: $o.top, left: $o.left
			});
		});

	},
	drag: function(event, ui) {

		var inst = $(this).data("draggable"), o = inst.options;
		var d = o.snapTolerance;

		var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width,
			y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

		for (var i = inst.snapElements.length - 1; i >= 0; i--){

			var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width,
				t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

			//Yes, I know, this is insane ;)
			if(!((l-d < x1 && x1 < r+d && t-d < y1 && y1 < b+d) || (l-d < x1 && x1 < r+d && t-d < y2 && y2 < b+d) || (l-d < x2 && x2 < r+d && t-d < y1 && y1 < b+d) || (l-d < x2 && x2 < r+d && t-d < y2 && y2 < b+d))) {
				if(inst.snapElements[i].snapping) (inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
				inst.snapElements[i].snapping = false;
				continue;
			}

			if(o.snapMode != 'inner') {
				var ts = Math.abs(t - y2) <= d;
				var bs = Math.abs(b - y1) <= d;
				var ls = Math.abs(l - x2) <= d;
				var rs = Math.abs(r - x1) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l - inst.helperProportions.width }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r }).left - inst.margins.left;
			}

			var first = (ts || bs || ls || rs);

			if(o.snapMode != 'outer') {
				var ts = Math.abs(t - y1) <= d;
				var bs = Math.abs(b - y2) <= d;
				var ls = Math.abs(l - x1) <= d;
				var rs = Math.abs(r - x2) <= d;
				if(ts) ui.position.top = inst._convertPositionTo("relative", { top: t, left: 0 }).top - inst.margins.top;
				if(bs) ui.position.top = inst._convertPositionTo("relative", { top: b - inst.helperProportions.height, left: 0 }).top - inst.margins.top;
				if(ls) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: l }).left - inst.margins.left;
				if(rs) ui.position.left = inst._convertPositionTo("relative", { top: 0, left: r - inst.helperProportions.width }).left - inst.margins.left;
			}

			if(!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
				(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), { snapItem: inst.snapElements[i].item })));
			inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

		};

	}
});

$.ui.plugin.add("draggable", "stack", {
	start: function(event, ui) {

		var o = $(this).data("draggable").options;

		var group = $.makeArray($(o.stack)).sort(function(a,b) {
			return (parseInt($(a).css("zIndex"),10) || 0) - (parseInt($(b).css("zIndex"),10) || 0);
		});
		if (!group.length) { return; }
		
		var min = parseInt(group[0].style.zIndex) || 0;
		$(group).each(function(i) {
			this.style.zIndex = min + i;
		});

		this[0].style.zIndex = min + group.length;

	}
});

$.ui.plugin.add("draggable", "zIndex", {
	start: function(event, ui) {
		var t = $(ui.helper), o = $(this).data("draggable").options;
		if(t.css("zIndex")) o._zIndex = t.css("zIndex");
		t.css('zIndex', o.zIndex);
	},
	stop: function(event, ui) {
		var o = $(this).data("draggable").options;
		if(o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
	}
});

})(jQuery);
/*
 * jQuery UI Droppable 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.draggable.js
 */
(function( $, undefined ) {

$.widget("ui.droppable", {
	widgetEventPrefix: "drop",
	options: {
		accept: '*',
		activeClass: false,
		addClasses: true,
		greedy: false,
		hoverClass: false,
		scope: 'default',
		tolerance: 'intersect'
	},
	_create: function() {

		var o = this.options, accept = o.accept;
		this.isover = 0; this.isout = 1;

		this.accept = $.isFunction(accept) ? accept : function(d) {
			return d.is(accept);
		};

		//Store the droppable's proportions
		this.proportions = { width: this.element[0].offsetWidth, height: this.element[0].offsetHeight };

		// Add the reference and positions to the manager
		$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
		$.ui.ddmanager.droppables[o.scope].push(this);

		(o.addClasses && this.element.addClass("ui-droppable"));

	},

	destroy: function() {
		var drop = $.ui.ddmanager.droppables[this.options.scope];
		for ( var i = 0; i < drop.length; i++ )
			if ( drop[i] == this )
				drop.splice(i, 1);

		this.element
			.removeClass("ui-droppable ui-droppable-disabled")
			.removeData("droppable")
			.unbind(".droppable");

		return this;
	},

	_setOption: function(key, value) {

		if(key == 'accept') {
			this.accept = $.isFunction(value) ? value : function(d) {
				return d.is(value);
			};
		}
		$.Widget.prototype._setOption.apply(this, arguments);
	},

	_activate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.addClass(this.options.activeClass);
		(draggable && this._trigger('activate', event, this.ui(draggable)));
	},

	_deactivate: function(event) {
		var draggable = $.ui.ddmanager.current;
		if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
		(draggable && this._trigger('deactivate', event, this.ui(draggable)));
	},

	_over: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.addClass(this.options.hoverClass);
			this._trigger('over', event, this.ui(draggable));
		}

	},

	_out: function(event) {

		var draggable = $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

		if (this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('out', event, this.ui(draggable));
		}

	},

	_drop: function(event,custom) {

		var draggable = custom || $.ui.ddmanager.current;
		if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

		var childrenIntersection = false;
		this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
			var inst = $.data(this, 'droppable');
			if(
				inst.options.greedy
				&& !inst.options.disabled
				&& inst.options.scope == draggable.options.scope
				&& inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element))
				&& $.ui.intersect(draggable, $.extend(inst, { offset: inst.element.offset() }), inst.options.tolerance)
			) { childrenIntersection = true; return false; }
		});
		if(childrenIntersection) return false;

		if(this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
			if(this.options.activeClass) this.element.removeClass(this.options.activeClass);
			if(this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
			this._trigger('drop', event, this.ui(draggable));
			return this.element;
		}

		return false;

	},

	ui: function(c) {
		return {
			draggable: (c.currentItem || c.element),
			helper: c.helper,
			position: c.position,
			offset: c.positionAbs
		};
	}

});

$.extend($.ui.droppable, {
	version: "1.8.12"
});

$.ui.intersect = function(draggable, droppable, toleranceMode) {

	if (!droppable.offset) return false;

	var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width,
		y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
	var l = droppable.offset.left, r = l + droppable.proportions.width,
		t = droppable.offset.top, b = t + droppable.proportions.height;

	switch (toleranceMode) {
		case 'fit':
			return (l <= x1 && x2 <= r
				&& t <= y1 && y2 <= b);
			break;
		case 'intersect':
			return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
				&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
				&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
				&& y2 - (draggable.helperProportions.height / 2) < b ); // Top Half
			break;
		case 'pointer':
			var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
				draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
				isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
			return isOver;
			break;
		case 'touch':
			return (
					(y1 >= t && y1 <= b) ||	// Top edge touching
					(y2 >= t && y2 <= b) ||	// Bottom edge touching
					(y1 < t && y2 > b)		// Surrounded vertically
				) && (
					(x1 >= l && x1 <= r) ||	// Left edge touching
					(x2 >= l && x2 <= r) ||	// Right edge touching
					(x1 < l && x2 > r)		// Surrounded horizontally
				);
			break;
		default:
			return false;
			break;
		}

};

/*
	This manager tracks offsets of draggables and droppables
*/
$.ui.ddmanager = {
	current: null,
	droppables: { 'default': [] },
	prepareOffsets: function(t, event) {

		var m = $.ui.ddmanager.droppables[t.options.scope] || [];
		var type = event ? event.type : null; // workaround for #2317
		var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();

		droppablesLoop: for (var i = 0; i < m.length; i++) {

			if(m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0],(t.currentItem || t.element)))) continue;	//No disabled and non-accepted
			for (var j=0; j < list.length; j++) { if(list[j] == m[i].element[0]) { m[i].proportions.height = 0; continue droppablesLoop; } }; //Filter out elements in the current dragged item
			m[i].visible = m[i].element.css("display") != "none"; if(!m[i].visible) continue; 									//If the element is not visible, continue

			if(type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

			m[i].offset = m[i].element.offset();
			m[i].proportions = { width: m[i].element[0].offsetWidth, height: m[i].element[0].offsetHeight };

		}

	},
	drop: function(draggable, event) {

		var dropped = false;
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(!this.options) return;
			if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
				dropped = dropped || this._drop.call(this, event);

			if (!this.options.disabled && this.visible && this.accept.call(this.element[0],(draggable.currentItem || draggable.element))) {
				this.isout = 1; this.isover = 0;
				this._deactivate.call(this, event);
			}

		});
		return dropped;

	},
	drag: function(draggable, event) {

		//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
		if(draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);

		//Run through all droppables and check their positions based on specific tolerance options
		$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

			if(this.options.disabled || this.greedyChild || !this.visible) return;
			var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

			var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
			if(!c) return;

			var parentInstance;
			if (this.options.greedy) {
				var parent = this.element.parents(':data(droppable):eq(0)');
				if (parent.length) {
					parentInstance = $.data(parent[0], 'droppable');
					parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
				}
			}

			// we just moved into a greedy child
			if (parentInstance && c == 'isover') {
				parentInstance['isover'] = 0;
				parentInstance['isout'] = 1;
				parentInstance._out.call(parentInstance, event);
			}

			this[c] = 1; this[c == 'isout' ? 'isover' : 'isout'] = 0;
			this[c == "isover" ? "_over" : "_out"].call(this, event);

			// we just moved out of a greedy child
			if (parentInstance && c == 'isout') {
				parentInstance['isout'] = 0;
				parentInstance['isover'] = 1;
				parentInstance._over.call(parentInstance, event);
			}
		});

	}
};

})(jQuery);
/*
 * jQuery UI Resizable 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Resizables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.resizable", $.ui.mouse, {
	widgetEventPrefix: "resize",
	options: {
		alsoResize: false,
		animate: false,
		animateDuration: "slow",
		animateEasing: "swing",
		aspectRatio: false,
		autoHide: false,
		containment: false,
		ghost: false,
		grid: false,
		handles: "e,s,se",
		helper: false,
		maxHeight: null,
		maxWidth: null,
		minHeight: 10,
		minWidth: 10,
		zIndex: 1000
	},
	_create: function() {

		var self = this, o = this.options;
		this.element.addClass("ui-resizable");

		$.extend(this, {
			_aspectRatio: !!(o.aspectRatio),
			aspectRatio: o.aspectRatio,
			originalElement: this.element,
			_proportionallyResizeElements: [],
			_helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
		});

		//Wrap the element if it cannot hold child nodes
		if(this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

			//Opera fix for relative positioning
			if (/relative/.test(this.element.css('position')) && $.browser.opera)
				this.element.css({ position: 'relative', top: 'auto', left: 'auto' });

			//Create a wrapper element and set the wrapper to the new current internal element
			this.element.wrap(
				$('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
					position: this.element.css('position'),
					width: this.element.outerWidth(),
					height: this.element.outerHeight(),
					top: this.element.css('top'),
					left: this.element.css('left')
				})
			);

			//Overwrite the original this.element
			this.element = this.element.parent().data(
				"resizable", this.element.data('resizable')
			);

			this.elementIsWrapper = true;

			//Move margins to the wrapper
			this.element.css({ marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom") });
			this.originalElement.css({ marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0});

			//Prevent Safari textarea resize
			this.originalResizeStyle = this.originalElement.css('resize');
			this.originalElement.css('resize', 'none');

			//Push the actual element to our proportionallyResize internal array
			this._proportionallyResizeElements.push(this.originalElement.css({ position: 'static', zoom: 1, display: 'block' }));

			// avoid IE jump (hard set the margin)
			this.originalElement.css({ margin: this.originalElement.css('margin') });

			// fix handlers offset
			this._proportionallyResize();

		}

		this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : { n: '.ui-resizable-n', e: '.ui-resizable-e', s: '.ui-resizable-s', w: '.ui-resizable-w', se: '.ui-resizable-se', sw: '.ui-resizable-sw', ne: '.ui-resizable-ne', nw: '.ui-resizable-nw' });
		if(this.handles.constructor == String) {

			if(this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
			var n = this.handles.split(","); this.handles = {};

			for(var i = 0; i < n.length; i++) {

				var handle = $.trim(n[i]), hname = 'ui-resizable-'+handle;
				var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

				// increase zIndex of sw, se, ne, nw axis
				//TODO : this modifies original option
				if(/sw|se|ne|nw/.test(handle)) axis.css({ zIndex: ++o.zIndex });

				//TODO : What's going on here?
				if ('se' == handle) {
					axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
				};

				//Insert into internal handles object and append to element
				this.handles[handle] = '.ui-resizable-'+handle;
				this.element.append(axis);
			}

		}

		this._renderAxis = function(target) {

			target = target || this.element;

			for(var i in this.handles) {

				if(this.handles[i].constructor == String)
					this.handles[i] = $(this.handles[i], this.element).show();

				//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
				if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

					var axis = $(this.handles[i], this.element), padWrapper = 0;

					//Checking the correct pad and border
					padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

					//The padding type i have to apply...
					var padPos = [ 'padding',
						/ne|nw|n/.test(i) ? 'Top' :
						/se|sw|s/.test(i) ? 'Bottom' :
						/^e$/.test(i) ? 'Right' : 'Left' ].join("");

					target.css(padPos, padWrapper);

					this._proportionallyResize();

				}

				//TODO: What's that good for? There's not anything to be executed left
				if(!$(this.handles[i]).length)
					continue;

			}
		};

		//TODO: make renderAxis a prototype function
		this._renderAxis(this.element);

		this._handles = $('.ui-resizable-handle', this.element)
			.disableSelection();

		//Matching axis name
		this._handles.mouseover(function() {
			if (!self.resizing) {
				if (this.className)
					var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
				//Axis, default = se
				self.axis = axis && axis[1] ? axis[1] : 'se';
			}
		});

		//If we want to auto hide the elements
		if (o.autoHide) {
			this._handles.hide();
			$(this.element)
				.addClass("ui-resizable-autohide")
				.hover(function() {
					$(this).removeClass("ui-resizable-autohide");
					self._handles.show();
				},
				function(){
					if (!self.resizing) {
						$(this).addClass("ui-resizable-autohide");
						self._handles.hide();
					}
				});
		}

		//Initialize the mouse interaction
		this._mouseInit();

	},

	destroy: function() {

		this._mouseDestroy();

		var _destroy = function(exp) {
			$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
				.removeData("resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
		};

		//TODO: Unwrap at same DOM position
		if (this.elementIsWrapper) {
			_destroy(this.element);
			var wrapper = this.element;
			wrapper.after(
				this.originalElement.css({
					position: wrapper.css('position'),
					width: wrapper.outerWidth(),
					height: wrapper.outerHeight(),
					top: wrapper.css('top'),
					left: wrapper.css('left')
				})
			).remove();
		}

		this.originalElement.css('resize', this.originalResizeStyle);
		_destroy(this.originalElement);

		return this;
	},

	_mouseCapture: function(event) {
		var handle = false;
		for (var i in this.handles) {
			if ($(this.handles[i])[0] == event.target) {
				handle = true;
			}
		}

		return !this.options.disabled && handle;
	},

	_mouseStart: function(event) {

		var o = this.options, iniPos = this.element.position(), el = this.element;

		this.resizing = true;
		this.documentScroll = { top: $(document).scrollTop(), left: $(document).scrollLeft() };

		// bugfix for http://dev.jquery.com/ticket/1749
		if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
			el.css({ position: 'absolute', top: iniPos.top, left: iniPos.left });
		}

		//Opera fixing relative position
		if ($.browser.opera && (/relative/).test(el.css('position')))
			el.css({ position: 'relative', top: 'auto', left: 'auto' });

		this._renderProxy();

		var curleft = num(this.helper.css('left')), curtop = num(this.helper.css('top'));

		if (o.containment) {
			curleft += $(o.containment).scrollLeft() || 0;
			curtop += $(o.containment).scrollTop() || 0;
		}

		//Store needed variables
		this.offset = this.helper.offset();
		this.position = { left: curleft, top: curtop };
		this.size = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalSize = this._helper ? { width: el.outerWidth(), height: el.outerHeight() } : { width: el.width(), height: el.height() };
		this.originalPosition = { left: curleft, top: curtop };
		this.sizeDiff = { width: el.outerWidth() - el.width(), height: el.outerHeight() - el.height() };
		this.originalMousePosition = { left: event.pageX, top: event.pageY };

		//Aspect Ratio
		this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

	    var cursor = $('.ui-resizable-' + this.axis).css('cursor');
	    $('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

		el.addClass("ui-resizable-resizing");
		this._propagate("start", event);
		return true;
	},

	_mouseDrag: function(event) {

		//Increase performance, avoid regex
		var el = this.helper, o = this.options, props = {},
			self = this, smp = this.originalMousePosition, a = this.axis;

		var dx = (event.pageX-smp.left)||0, dy = (event.pageY-smp.top)||0;
		var trigger = this._change[a];
		if (!trigger) return false;

		// Calculate the attrs that will be change
		var data = trigger.apply(this, [event, dx, dy]), ie6 = $.browser.msie && $.browser.version < 7, csdif = this.sizeDiff;

		if (this._aspectRatio || event.shiftKey)
			data = this._updateRatio(data, event);

		data = this._respectSize(data, event);

		// plugins callbacks need to be called first
		this._propagate("resize", event);

		el.css({
			top: this.position.top + "px", left: this.position.left + "px",
			width: this.size.width + "px", height: this.size.height + "px"
		});

		if (!this._helper && this._proportionallyResizeElements.length)
			this._proportionallyResize();

		this._updateCache(data);

		// calling the user callback at the end
		this._trigger('resize', event, this.ui());

		return false;
	},

	_mouseStop: function(event) {

		this.resizing = false;
		var o = this.options, self = this;

		if(this._helper) {
			var pr = this._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
				soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
				soffsetw = ista ? 0 : self.sizeDiff.width;

			var s = { width: (self.helper.width()  - soffsetw), height: (self.helper.height() - soffseth) },
				left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
				top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

			if (!o.animate)
				this.element.css($.extend(s, { top: top, left: left }));

			self.helper.height(self.size.height);
			self.helper.width(self.size.width);

			if (this._helper && !o.animate) this._proportionallyResize();
		}

		$('body').css('cursor', 'auto');

		this.element.removeClass("ui-resizable-resizing");

		this._propagate("stop", event);

		if (this._helper) this.helper.remove();
		return false;

	},

	_updateCache: function(data) {
		var o = this.options;
		this.offset = this.helper.offset();
		if (isNumber(data.left)) this.position.left = data.left;
		if (isNumber(data.top)) this.position.top = data.top;
		if (isNumber(data.height)) this.size.height = data.height;
		if (isNumber(data.width)) this.size.width = data.width;
	},

	_updateRatio: function(data, event) {

		var o = this.options, cpos = this.position, csize = this.size, a = this.axis;

		if (data.height) data.width = (csize.height * this.aspectRatio);
		else if (data.width) data.height = (csize.width / this.aspectRatio);

		if (a == 'sw') {
			data.left = cpos.left + (csize.width - data.width);
			data.top = null;
		}
		if (a == 'nw') {
			data.top = cpos.top + (csize.height - data.height);
			data.left = cpos.left + (csize.width - data.width);
		}

		return data;
	},

	_respectSize: function(data, event) {

		var el = this.helper, o = this.options, pRatio = this._aspectRatio || event.shiftKey, a = this.axis,
				ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width), ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width), isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

		if (isminw) data.width = o.minWidth;
		if (isminh) data.height = o.minHeight;
		if (ismaxw) data.width = o.maxWidth;
		if (ismaxh) data.height = o.maxHeight;

		var dw = this.originalPosition.left + this.originalSize.width, dh = this.position.top + this.size.height;
		var cw = /sw|nw|w/.test(a), ch = /nw|ne|n/.test(a);

		if (isminw && cw) data.left = dw - o.minWidth;
		if (ismaxw && cw) data.left = dw - o.maxWidth;
		if (isminh && ch)	data.top = dh - o.minHeight;
		if (ismaxh && ch)	data.top = dh - o.maxHeight;

		// fixing jump error on top/left - bug #2330
		var isNotwh = !data.width && !data.height;
		if (isNotwh && !data.left && data.top) data.top = null;
		else if (isNotwh && !data.top && data.left) data.left = null;

		return data;
	},

	_proportionallyResize: function() {

		var o = this.options;
		if (!this._proportionallyResizeElements.length) return;
		var element = this.helper || this.element;

		for (var i=0; i < this._proportionallyResizeElements.length; i++) {

			var prel = this._proportionallyResizeElements[i];

			if (!this.borderDif) {
				var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
					p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

				this.borderDif = $.map(b, function(v, i) {
					var border = parseInt(v,10)||0, padding = parseInt(p[i],10)||0;
					return border + padding;
				});
			}

			if ($.browser.msie && !(!($(element).is(':hidden') || $(element).parents(':hidden').length)))
				continue;

			prel.css({
				height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
				width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
			});

		};

	},

	_renderProxy: function() {

		var el = this.element, o = this.options;
		this.elementOffset = el.offset();

		if(this._helper) {

			this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

			// fix ie6 offset TODO: This seems broken
			var ie6 = $.browser.msie && $.browser.version < 7, ie6offset = (ie6 ? 1 : 0),
			pxyoffset = ( ie6 ? 2 : -1 );

			this.helper.addClass(this._helper).css({
				width: this.element.outerWidth() + pxyoffset,
				height: this.element.outerHeight() + pxyoffset,
				position: 'absolute',
				left: this.elementOffset.left - ie6offset +'px',
				top: this.elementOffset.top - ie6offset +'px',
				zIndex: ++o.zIndex //TODO: Don't modify option
			});

			this.helper
				.appendTo("body")
				.disableSelection();

		} else {
			this.helper = this.element;
		}

	},

	_change: {
		e: function(event, dx, dy) {
			return { width: this.originalSize.width + dx };
		},
		w: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { left: sp.left + dx, width: cs.width - dx };
		},
		n: function(event, dx, dy) {
			var o = this.options, cs = this.originalSize, sp = this.originalPosition;
			return { top: sp.top + dy, height: cs.height - dy };
		},
		s: function(event, dx, dy) {
			return { height: this.originalSize.height + dy };
		},
		se: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		sw: function(event, dx, dy) {
			return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		},
		ne: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
		},
		nw: function(event, dx, dy) {
			return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
		}
	},

	_propagate: function(n, event) {
		$.ui.plugin.call(this, n, [event, this.ui()]);
		(n != "resize" && this._trigger(n, event, this.ui()));
	},

	plugins: {},

	ui: function() {
		return {
			originalElement: this.originalElement,
			element: this.element,
			helper: this.helper,
			position: this.position,
			size: this.size,
			originalSize: this.originalSize,
			originalPosition: this.originalPosition
		};
	}

});

$.extend($.ui.resizable, {
	version: "1.8.12"
});

/*
 * Resizable Extensions
 */

$.ui.plugin.add("resizable", "alsoResize", {

	start: function (event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var _store = function (exp) {
			$(exp).each(function() {
				var el = $(this);
				el.data("resizable-alsoresize", {
					width: parseInt(el.width(), 10), height: parseInt(el.height(), 10),
					left: parseInt(el.css('left'), 10), top: parseInt(el.css('top'), 10),
					position: el.css('position') // to reset Opera on stop()
				});
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
			if (o.alsoResize.length) { o.alsoResize = o.alsoResize[0]; _store(o.alsoResize); }
			else { $.each(o.alsoResize, function (exp) { _store(exp); }); }
		}else{
			_store(o.alsoResize);
		}
	},

	resize: function (event, ui) {
		var self = $(this).data("resizable"), o = self.options, os = self.originalSize, op = self.originalPosition;

		var delta = {
			height: (self.size.height - os.height) || 0, width: (self.size.width - os.width) || 0,
			top: (self.position.top - op.top) || 0, left: (self.position.left - op.left) || 0
		},

		_alsoResize = function (exp, c) {
			$(exp).each(function() {
				var el = $(this), start = $(this).data("resizable-alsoresize"), style = {}, 
					css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

				$.each(css, function (i, prop) {
					var sum = (start[prop]||0) + (delta[prop]||0);
					if (sum && sum >= 0)
						style[prop] = sum || null;
				});

				// Opera fixing relative position
				if ($.browser.opera && /relative/.test(el.css('position'))) {
					self._revertToRelativePosition = true;
					el.css({ position: 'absolute', top: 'auto', left: 'auto' });
				}

				el.css(style);
			});
		};

		if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
			$.each(o.alsoResize, function (exp, c) { _alsoResize(exp, c); });
		}else{
			_alsoResize(o.alsoResize);
		}
	},

	stop: function (event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var _reset = function (exp) {
			$(exp).each(function() {
				var el = $(this);
				// reset position for Opera - no need to verify it was changed
				el.css({ position: el.data("resizable-alsoresize").position });
			});
		};

		if (self._revertToRelativePosition) {
			self._revertToRelativePosition = false;
			if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
				$.each(o.alsoResize, function (exp) { _reset(exp); });
			}else{
				_reset(o.alsoResize);
			}
		}

		$(this).removeData("resizable-alsoresize");
	}
});

$.ui.plugin.add("resizable", "animate", {

	stop: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options;

		var pr = self._proportionallyResizeElements, ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : self.sizeDiff.height,
						soffsetw = ista ? 0 : self.sizeDiff.width;

		var style = { width: (self.size.width - soffsetw), height: (self.size.height - soffseth) },
					left = (parseInt(self.element.css('left'), 10) + (self.position.left - self.originalPosition.left)) || null,
						top = (parseInt(self.element.css('top'), 10) + (self.position.top - self.originalPosition.top)) || null;

		self.element.animate(
			$.extend(style, top && left ? { top: top, left: left } : {}), {
				duration: o.animateDuration,
				easing: o.animateEasing,
				step: function() {

					var data = {
						width: parseInt(self.element.css('width'), 10),
						height: parseInt(self.element.css('height'), 10),
						top: parseInt(self.element.css('top'), 10),
						left: parseInt(self.element.css('left'), 10)
					};

					if (pr && pr.length) $(pr[0]).css({ width: data.width, height: data.height });

					// propagating resize, and updating values for each animation step
					self._updateCache(data);
					self._propagate("resize", event);

				}
			}
		);
	}

});

$.ui.plugin.add("resizable", "containment", {

	start: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options, el = self.element;
		var oc = o.containment,	ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
		if (!ce) return;

		self.containerElement = $(ce);

		if (/document/.test(oc) || oc == document) {
			self.containerOffset = { left: 0, top: 0 };
			self.containerPosition = { left: 0, top: 0 };

			self.parentData = {
				element: $(document), left: 0, top: 0,
				width: $(document).width(), height: $(document).height() || document.body.parentNode.scrollHeight
			};
		}

		// i'm a node, so compute top, left, right, bottom
		else {
			var element = $(ce), p = [];
			$([ "Top", "Right", "Left", "Bottom" ]).each(function(i, name) { p[i] = num(element.css("padding" + name)); });

			self.containerOffset = element.offset();
			self.containerPosition = element.position();
			self.containerSize = { height: (element.innerHeight() - p[3]), width: (element.innerWidth() - p[1]) };

			var co = self.containerOffset, ch = self.containerSize.height,	cw = self.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw ), height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

			self.parentData = {
				element: ce, left: co.left, top: co.top, width: width, height: height
			};
		}
	},

	resize: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options,
				ps = self.containerSize, co = self.containerOffset, cs = self.size, cp = self.position,
				pRatio = self._aspectRatio || event.shiftKey, cop = { top:0, left:0 }, ce = self.containerElement;

		if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

		if (cp.left < (self._helper ? co.left : 0)) {
			self.size.width = self.size.width + (self._helper ? (self.position.left - co.left) : (self.position.left - cop.left));
			if (pRatio) self.size.height = self.size.width / o.aspectRatio;
			self.position.left = o.helper ? co.left : 0;
		}

		if (cp.top < (self._helper ? co.top : 0)) {
			self.size.height = self.size.height + (self._helper ? (self.position.top - co.top) : self.position.top);
			if (pRatio) self.size.width = self.size.height * o.aspectRatio;
			self.position.top = self._helper ? co.top : 0;
		}

		self.offset.left = self.parentData.left+self.position.left;
		self.offset.top = self.parentData.top+self.position.top;

		var woset = Math.abs( (self._helper ? self.offset.left - cop.left : (self.offset.left - cop.left)) + self.sizeDiff.width ),
					hoset = Math.abs( (self._helper ? self.offset.top - cop.top : (self.offset.top - co.top)) + self.sizeDiff.height );

		var isParent = self.containerElement.get(0) == self.element.parent().get(0),
		    isOffsetRelative = /relative|absolute/.test(self.containerElement.css('position'));

		if(isParent && isOffsetRelative) woset -= self.parentData.left;

		if (woset + self.size.width >= self.parentData.width) {
			self.size.width = self.parentData.width - woset;
			if (pRatio) self.size.height = self.size.width / self.aspectRatio;
		}

		if (hoset + self.size.height >= self.parentData.height) {
			self.size.height = self.parentData.height - hoset;
			if (pRatio) self.size.width = self.size.height * self.aspectRatio;
		}
	},

	stop: function(event, ui){
		var self = $(this).data("resizable"), o = self.options, cp = self.position,
				co = self.containerOffset, cop = self.containerPosition, ce = self.containerElement;

		var helper = $(self.helper), ho = helper.offset(), w = helper.outerWidth() - self.sizeDiff.width, h = helper.outerHeight() - self.sizeDiff.height;

		if (self._helper && !o.animate && (/relative/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

		if (self._helper && !o.animate && (/static/).test(ce.css('position')))
			$(this).css({ left: ho.left - cop.left - co.left, width: w, height: h });

	}
});

$.ui.plugin.add("resizable", "ghost", {

	start: function(event, ui) {

		var self = $(this).data("resizable"), o = self.options, cs = self.size;

		self.ghost = self.originalElement.clone();
		self.ghost
			.css({ opacity: .25, display: 'block', position: 'relative', height: cs.height, width: cs.width, margin: 0, left: 0, top: 0 })
			.addClass('ui-resizable-ghost')
			.addClass(typeof o.ghost == 'string' ? o.ghost : '');

		self.ghost.appendTo(self.helper);

	},

	resize: function(event, ui){
		var self = $(this).data("resizable"), o = self.options;
		if (self.ghost) self.ghost.css({ position: 'relative', height: self.size.height, width: self.size.width });
	},

	stop: function(event, ui){
		var self = $(this).data("resizable"), o = self.options;
		if (self.ghost && self.helper) self.helper.get(0).removeChild(self.ghost.get(0));
	}

});

$.ui.plugin.add("resizable", "grid", {

	resize: function(event, ui) {
		var self = $(this).data("resizable"), o = self.options, cs = self.size, os = self.originalSize, op = self.originalPosition, a = self.axis, ratio = o._aspectRatio || event.shiftKey;
		o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
		var ox = Math.round((cs.width - os.width) / (o.grid[0]||1)) * (o.grid[0]||1), oy = Math.round((cs.height - os.height) / (o.grid[1]||1)) * (o.grid[1]||1);

		if (/^(se|s|e)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
		}
		else if (/^(ne)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
		}
		else if (/^(sw)$/.test(a)) {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.left = op.left - ox;
		}
		else {
			self.size.width = os.width + ox;
			self.size.height = os.height + oy;
			self.position.top = op.top - oy;
			self.position.left = op.left - ox;
		}
	}

});

var num = function(v) {
	return parseInt(v, 10) || 0;
};

var isNumber = function(value) {
	return !isNaN(parseInt(value, 10));
};

})(jQuery);
/*
 * jQuery UI Button 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Button
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

var lastActive,
	baseClasses = "ui-button ui-widget ui-state-default ui-corner-all",
	stateClasses = "ui-state-hover ui-state-active ",
	typeClasses = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only",
	formResetHandler = function( event ) {
		$( ":ui-button", event.target.form ).each(function() {
			var inst = $( this ).data( "button" );
			setTimeout(function() {
				inst.refresh();
			}, 1 );
		});
	},
	radioGroup = function( radio ) {
		var name = radio.name,
			form = radio.form,
			radios = $( [] );
		if ( name ) {
			if ( form ) {
				radios = $( form ).find( "[name='" + name + "']" );
			} else {
				radios = $( "[name='" + name + "']", radio.ownerDocument )
					.filter(function() {
						return !this.form;
					});
			}
		}
		return radios;
	};

$.widget( "ui.button", {
	options: {
		disabled: null,
		text: true,
		label: null,
		icons: {
			primary: null,
			secondary: null
		}
	},
	_create: function() {
		this.element.closest( "form" )
			.unbind( "reset.button" )
			.bind( "reset.button", formResetHandler );

		if ( typeof this.options.disabled !== "boolean" ) {
			this.options.disabled = this.element.attr( "disabled" );
		}

		this._determineButtonType();
		this.hasTitle = !!this.buttonElement.attr( "title" );

		var self = this,
			options = this.options,
			toggleButton = this.type === "checkbox" || this.type === "radio",
			hoverClass = "ui-state-hover" + ( !toggleButton ? " ui-state-active" : "" ),
			focusClass = "ui-state-focus";

		if ( options.label === null ) {
			options.label = this.buttonElement.html();
		}

		if ( this.element.is( ":disabled" ) ) {
			options.disabled = true;
		}

		this.buttonElement
			.addClass( baseClasses )
			.attr( "role", "button" )
			.bind( "mouseenter.button", function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).addClass( "ui-state-hover" );
				if ( this === lastActive ) {
					$( this ).addClass( "ui-state-active" );
				}
			})
			.bind( "mouseleave.button", function() {
				if ( options.disabled ) {
					return;
				}
				$( this ).removeClass( hoverClass );
			})
			.bind( "focus.button", function() {
				// no need to check disabled, focus won't be triggered anyway
				$( this ).addClass( focusClass );
			})
			.bind( "blur.button", function() {
				$( this ).removeClass( focusClass );
			});

		if ( toggleButton ) {
			this.element.bind( "change.button", function() {
				self.refresh();
			});
		}

		if ( this.type === "checkbox" ) {
			this.buttonElement.bind( "click.button", function() {
				if ( options.disabled ) {
					return false;
				}
				$( this ).toggleClass( "ui-state-active" );
				self.buttonElement.attr( "aria-pressed", self.element[0].checked );
			});
		} else if ( this.type === "radio" ) {
			this.buttonElement.bind( "click.button", function() {
				if ( options.disabled ) {
					return false;
				}
				$( this ).addClass( "ui-state-active" );
				self.buttonElement.attr( "aria-pressed", true );

				var radio = self.element[ 0 ];
				radioGroup( radio )
					.not( radio )
					.map(function() {
						return $( this ).button( "widget" )[ 0 ];
					})
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", false );
			});
		} else {
			this.buttonElement
				.bind( "mousedown.button", function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).addClass( "ui-state-active" );
					lastActive = this;
					$( document ).one( "mouseup", function() {
						lastActive = null;
					});
				})
				.bind( "mouseup.button", function() {
					if ( options.disabled ) {
						return false;
					}
					$( this ).removeClass( "ui-state-active" );
				})
				.bind( "keydown.button", function(event) {
					if ( options.disabled ) {
						return false;
					}
					if ( event.keyCode == $.ui.keyCode.SPACE || event.keyCode == $.ui.keyCode.ENTER ) {
						$( this ).addClass( "ui-state-active" );
					}
				})
				.bind( "keyup.button", function() {
					$( this ).removeClass( "ui-state-active" );
				});

			if ( this.buttonElement.is("a") ) {
				this.buttonElement.keyup(function(event) {
					if ( event.keyCode === $.ui.keyCode.SPACE ) {
						// TODO pass through original event correctly (just as 2nd argument doesn't work)
						$( this ).click();
					}
				});
			}
		}

		// TODO: pull out $.Widget's handling for the disabled option into
		// $.Widget.prototype._setOptionDisabled so it's easy to proxy and can
		// be overridden by individual plugins
		this._setOption( "disabled", options.disabled );
	},

	_determineButtonType: function() {

		if ( this.element.is(":checkbox") ) {
			this.type = "checkbox";
		} else if ( this.element.is(":radio") ) {
			this.type = "radio";
		} else if ( this.element.is("input") ) {
			this.type = "input";
		} else {
			this.type = "button";
		}

		if ( this.type === "checkbox" || this.type === "radio" ) {
			// we don't search against the document in case the element
			// is disconnected from the DOM
			var ancestor = this.element.parents().filter(":last"),
				labelSelector = "label[for=" + this.element.attr("id") + "]";
			this.buttonElement = ancestor.find( labelSelector );
			if ( !this.buttonElement.length ) {
				ancestor = ancestor.length ? ancestor.siblings() : this.element.siblings();
				this.buttonElement = ancestor.filter( labelSelector );
				if ( !this.buttonElement.length ) {
					this.buttonElement = ancestor.find( labelSelector );
				}
			}
			this.element.addClass( "ui-helper-hidden-accessible" );

			var checked = this.element.is( ":checked" );
			if ( checked ) {
				this.buttonElement.addClass( "ui-state-active" );
			}
			this.buttonElement.attr( "aria-pressed", checked );
		} else {
			this.buttonElement = this.element;
		}
	},

	widget: function() {
		return this.buttonElement;
	},

	destroy: function() {
		this.element
			.removeClass( "ui-helper-hidden-accessible" );
		this.buttonElement
			.removeClass( baseClasses + " " + stateClasses + " " + typeClasses )
			.removeAttr( "role" )
			.removeAttr( "aria-pressed" )
			.html( this.buttonElement.find(".ui-button-text").html() );

		if ( !this.hasTitle ) {
			this.buttonElement.removeAttr( "title" );
		}

		$.Widget.prototype.destroy.call( this );
	},

	_setOption: function( key, value ) {
		$.Widget.prototype._setOption.apply( this, arguments );
		if ( key === "disabled" ) {
			if ( value ) {
				this.element.attr( "disabled", true );
			} else {
				this.element.removeAttr( "disabled" );
			}
		}
		this._resetButton();
	},

	refresh: function() {
		var isDisabled = this.element.is( ":disabled" );
		if ( isDisabled !== this.options.disabled ) {
			this._setOption( "disabled", isDisabled );
		}
		if ( this.type === "radio" ) {
			radioGroup( this.element[0] ).each(function() {
				if ( $( this ).is( ":checked" ) ) {
					$( this ).button( "widget" )
						.addClass( "ui-state-active" )
						.attr( "aria-pressed", true );
				} else {
					$( this ).button( "widget" )
						.removeClass( "ui-state-active" )
						.attr( "aria-pressed", false );
				}
			});
		} else if ( this.type === "checkbox" ) {
			if ( this.element.is( ":checked" ) ) {
				this.buttonElement
					.addClass( "ui-state-active" )
					.attr( "aria-pressed", true );
			} else {
				this.buttonElement
					.removeClass( "ui-state-active" )
					.attr( "aria-pressed", false );
			}
		}
	},

	_resetButton: function() {
		if ( this.type === "input" ) {
			if ( this.options.label ) {
				this.element.val( this.options.label );
			}
			return;
		}
		var buttonElement = this.buttonElement.removeClass( typeClasses ),
			buttonText = $( "<span></span>" )
				.addClass( "ui-button-text" )
				.html( this.options.label )
				.appendTo( buttonElement.empty() )
				.text(),
			icons = this.options.icons,
			multipleIcons = icons.primary && icons.secondary,
			buttonClasses = [];  

		if ( icons.primary || icons.secondary ) {
			if ( this.options.text ) {
				buttonClasses.push( "ui-button-text-icon" + ( multipleIcons ? "s" : ( icons.primary ? "-primary" : "-secondary" ) ) );
			}

			if ( icons.primary ) {
				buttonElement.prepend( "<span class='ui-button-icon-primary ui-icon " + icons.primary + "'></span>" );
			}

			if ( icons.secondary ) {
				buttonElement.append( "<span class='ui-button-icon-secondary ui-icon " + icons.secondary + "'></span>" );
			}

			if ( !this.options.text ) {
				buttonClasses.push( multipleIcons ? "ui-button-icons-only" : "ui-button-icon-only" );

				if ( !this.hasTitle ) {
					buttonElement.attr( "title", buttonText );
				}
			}
		} else {
			buttonClasses.push( "ui-button-text-only" );
		}
		buttonElement.addClass( buttonClasses.join( " " ) );
	}
});

$.widget( "ui.buttonset", {
	options: {
		items: ":button, :submit, :reset, :checkbox, :radio, a, :data(button)"
	},

	_create: function() {
		this.element.addClass( "ui-buttonset" );
	},
	
	_init: function() {
		this.refresh();
	},

	_setOption: function( key, value ) {
		if ( key === "disabled" ) {
			this.buttons.button( "option", key, value );
		}

		$.Widget.prototype._setOption.apply( this, arguments );
	},
	
	refresh: function() {
		this.buttons = this.element.find( this.options.items )
			.filter( ":ui-button" )
				.button( "refresh" )
			.end()
			.not( ":ui-button" )
				.button()
			.end()
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-all ui-corner-left ui-corner-right" )
				.filter( ":first" )
					.addClass( "ui-corner-left" )
				.end()
				.filter( ":last" )
					.addClass( "ui-corner-right" )
				.end()
			.end();
	},

	destroy: function() {
		this.element.removeClass( "ui-buttonset" );
		this.buttons
			.map(function() {
				return $( this ).button( "widget" )[ 0 ];
			})
				.removeClass( "ui-corner-left ui-corner-right" )
			.end()
			.button( "destroy" );

		$.Widget.prototype.destroy.call( this );
	}
});

}( jQuery ) );
/*
 * jQuery UI Dialog 1.8.12
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Dialog
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 */
(function( $, undefined ) {

var uiDialogClasses =
		'ui-dialog ' +
		'ui-widget ' +
		'ui-widget-content ' +
		'ui-corner-all ',
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	},
	// support for jQuery 1.3.2 - handle common attrFn methods for dialog
	attrFn = $.attrFn || {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true,
		click: true
	};

$.widget("ui.dialog", {
	options: {
		autoOpen: true,
		buttons: {},
		closeOnEscape: true,
		closeText: 'close',
		dialogClass: '',
		draggable: true,
		hide: null,
		height: 'auto',
		maxHeight: false,
		maxWidth: false,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		position: {
			my: 'center',
			at: 'center',
			collision: 'fit',
			// ensure that the titlebar is never outside the document
			using: function(pos) {
				var topOffset = $(this).css(pos).offset().top;
				if (topOffset < 0) {
					$(this).css('top', pos.top - topOffset);
				}
			}
		},
		resizable: true,
		show: null,
		stack: true,
		title: '',
		width: 300,
		zIndex: 1000
	},

	_create: function() {
		this.originalTitle = this.element.attr('title');
		// #5742 - .attr() might return a DOMElement
		if ( typeof this.originalTitle !== "string" ) {
			this.originalTitle = "";
		}

		this.options.title = this.options.title || this.originalTitle;
		var self = this,
			options = self.options,

			title = options.title || '&#160;',
			titleId = $.ui.dialog.getTitleId(self.element),

			uiDialog = (self.uiDialog = $('<div></div>'))
				.appendTo(document.body)
				.hide()
				.addClass(uiDialogClasses + options.dialogClass)
				.css({
					zIndex: options.zIndex
				})
				// setting tabIndex makes the div focusable
				// setting outline to 0 prevents a border on focus in Mozilla
				.attr('tabIndex', -1).css('outline', 0).keydown(function(event) {
					if (options.closeOnEscape && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE) {
						
						self.close(event);
						event.preventDefault();
					}
				})
				.attr({
					role: 'dialog',
					'aria-labelledby': titleId
				})
				.mousedown(function(event) {
					self.moveToTop(false, event);
				}),

			uiDialogContent = self.element
				.show()
				.removeAttr('title')
				.addClass(
					'ui-dialog-content ' +
					'ui-widget-content')
				.appendTo(uiDialog),

			uiDialogTitlebar = (self.uiDialogTitlebar = $('<div></div>'))
				.addClass(
					'ui-dialog-titlebar ' +
					'ui-widget-header ' +
					'ui-corner-all ' +
					'ui-helper-clearfix'
				)
				.prependTo(uiDialog),

			uiDialogTitlebarClose = $('<a href="#"></a>')
				.addClass(
					'ui-dialog-titlebar-close ' +
					'ui-corner-all'
				)
				.attr('role', 'button')
				.hover(
					function() {
						uiDialogTitlebarClose.addClass('ui-state-hover');
					},
					function() {
						uiDialogTitlebarClose.removeClass('ui-state-hover');
					}
				)
				.focus(function() {
					uiDialogTitlebarClose.addClass('ui-state-focus');
				})
				.blur(function() {
					uiDialogTitlebarClose.removeClass('ui-state-focus');
				})
				.click(function(event) {
					self.close(event);
					return false;
				})
				.appendTo(uiDialogTitlebar),

			uiDialogTitlebarCloseText = (self.uiDialogTitlebarCloseText = $('<span></span>'))
				.addClass(
					'ui-icon ' +
					'ui-icon-closethick'
				)
				.text(options.closeText)
				.appendTo(uiDialogTitlebarClose),

			uiDialogTitle = $('<span></span>')
				.addClass('ui-dialog-title')
				.attr('id', titleId)
				.html(title)
				.prependTo(uiDialogTitlebar);

		//handling of deprecated beforeclose (vs beforeClose) option
		//Ticket #4669 http://dev.jqueryui.com/ticket/4669
		//TODO: remove in 1.9pre
		if ($.isFunction(options.beforeclose) && !$.isFunction(options.beforeClose)) {
			options.beforeClose = options.beforeclose;
		}

		uiDialogTitlebar.find("*").add(uiDialogTitlebar).disableSelection();

		if (options.draggable && $.fn.draggable) {
			self._makeDraggable();
		}
		if (options.resizable && $.fn.resizable) {
			self._makeResizable();
		}

		self._createButtons(options.buttons);
		self._isOpen = false;

		if ($.fn.bgiframe) {
			uiDialog.bgiframe();
		}
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	destroy: function() {
		var self = this;
		
		if (self.overlay) {
			self.overlay.destroy();
		}
		self.uiDialog.hide();
		self.element
			.unbind('.dialog')
			.removeData('dialog')
			.removeClass('ui-dialog-content ui-widget-content')
			.hide().appendTo('body');
		self.uiDialog.remove();

		if (self.originalTitle) {
			self.element.attr('title', self.originalTitle);
		}

		return self;
	},

	widget: function() {
		return this.uiDialog;
	},

	close: function(event) {
		var self = this,
			maxZ, thisZ;
		
		if (false === self._trigger('beforeClose', event)) {
			return;
		}

		if (self.overlay) {
			self.overlay.destroy();
		}
		self.uiDialog.unbind('keypress.ui-dialog');

		self._isOpen = false;

		if (self.options.hide) {
			self.uiDialog.hide(self.options.hide, function() {
				self._trigger('close', event);
			});
		} else {
			self.uiDialog.hide();
			self._trigger('close', event);
		}

		$.ui.dialog.overlay.resize();

		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		if (self.options.modal) {
			maxZ = 0;
			$('.ui-dialog').each(function() {
				if (this !== self.uiDialog[0]) {
					thisZ = $(this).css('z-index');
					if(!isNaN(thisZ)) {
						maxZ = Math.max(maxZ, thisZ);
					}
				}
			});
			$.ui.dialog.maxZ = maxZ;
		}

		return self;
	},

	isOpen: function() {
		return this._isOpen;
	},

	// the force parameter allows us to move modal dialogs to their correct
	// position on open
	moveToTop: function(force, event) {
		var self = this,
			options = self.options,
			saveScroll;

		if ((options.modal && !force) ||
			(!options.stack && !options.modal)) {
			return self._trigger('focus', event);
		}

		if (options.zIndex > $.ui.dialog.maxZ) {
			$.ui.dialog.maxZ = options.zIndex;
		}
		if (self.overlay) {
			$.ui.dialog.maxZ += 1;
			self.overlay.$el.css('z-index', $.ui.dialog.overlay.maxZ = $.ui.dialog.maxZ);
		}

		//Save and then restore scroll since Opera 9.5+ resets when parent z-Index is changed.
		//  http://ui.jquery.com/bugs/ticket/3193
		saveScroll = { scrollTop: self.element.attr('scrollTop'), scrollLeft: self.element.attr('scrollLeft') };
		$.ui.dialog.maxZ += 1;
		self.uiDialog.css('z-index', $.ui.dialog.maxZ);
		self.element.attr(saveScroll);
		self._trigger('focus', event);

		return self;
	},

	open: function() {
		if (this._isOpen) { return; }

		var self = this,
			options = self.options,
			uiDialog = self.uiDialog;

		self.overlay = options.modal ? new $.ui.dialog.overlay(self) : null;
		self._size();
		self._position(options.position);
		uiDialog.show(options.show);
		self.moveToTop(true);

		// prevent tabbing out of modal dialogs
		if (options.modal) {
			uiDialog.bind('keypress.ui-dialog', function(event) {
				if (event.keyCode !== $.ui.keyCode.TAB) {
					return;
				}

				var tabbables = $(':tabbable', this),
					first = tabbables.filter(':first'),
					last  = tabbables.filter(':last');

				if (event.target === last[0] && !event.shiftKey) {
					first.focus(1);
					return false;
				} else if (event.target === first[0] && event.shiftKey) {
					last.focus(1);
					return false;
				}
			});
		}

		// set focus to the first tabbable element in the content area or the first button
		// if there are no tabbable elements, set focus on the dialog itself
		$(self.element.find(':tabbable').get().concat(
			uiDialog.find('.ui-dialog-buttonpane :tabbable').get().concat(
				uiDialog.get()))).eq(0).focus();

		self._isOpen = true;
		self._trigger('open');

		return self;
	},

	_createButtons: function(buttons) {
		var self = this,
			hasButtons = false,
			uiDialogButtonPane = $('<div></div>')
				.addClass(
					'ui-dialog-buttonpane ' +
					'ui-widget-content ' +
					'ui-helper-clearfix'
				),
			uiButtonSet = $( "<div></div>" )
				.addClass( "ui-dialog-buttonset" )
				.appendTo( uiDialogButtonPane );

		// if we already have a button pane, remove it
		self.uiDialog.find('.ui-dialog-buttonpane').remove();

		if (typeof buttons === 'object' && buttons !== null) {
			$.each(buttons, function() {
				return !(hasButtons = true);
			});
		}
		if (hasButtons) {
			$.each(buttons, function(name, props) {
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				var button = $('<button type="button"></button>')
					.click(function() {
						props.click.apply(self.element[0], arguments);
					})
					.appendTo(uiButtonSet);
				// can't use .attr( props, true ) with jQuery 1.3.2.
				$.each( props, function( key, value ) {
					if ( key === "click" ) {
						return;
					}
					if ( key in attrFn ) {
						button[ key ]( value );
					} else {
						button.attr( key, value );
					}
				});
				if ($.fn.button) {
					button.button();
				}
			});
			uiDialogButtonPane.appendTo(self.uiDialog);
		}
	},

	_makeDraggable: function() {
		var self = this,
			options = self.options,
			doc = $(document),
			heightBeforeDrag;

		function filteredUi(ui) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		self.uiDialog.draggable({
			cancel: '.ui-dialog-content, .ui-dialog-titlebar-close',
			handle: '.ui-dialog-titlebar',
			containment: 'document',
			start: function(event, ui) {
				heightBeforeDrag = options.height === "auto" ? "auto" : $(this).height();
				$(this).height($(this).height()).addClass("ui-dialog-dragging");
				self._trigger('dragStart', event, filteredUi(ui));
			},
			drag: function(event, ui) {
				self._trigger('drag', event, filteredUi(ui));
			},
			stop: function(event, ui) {
				options.position = [ui.position.left - doc.scrollLeft(),
					ui.position.top - doc.scrollTop()];
				$(this).removeClass("ui-dialog-dragging").height(heightBeforeDrag);
				self._trigger('dragStop', event, filteredUi(ui));
				$.ui.dialog.overlay.resize();
			}
		});
	},

	_makeResizable: function(handles) {
		handles = (handles === undefined ? this.options.resizable : handles);
		var self = this,
			options = self.options,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = self.uiDialog.css('position'),
			resizeHandles = (typeof handles === 'string' ?
				handles	:
				'n,e,s,w,se,sw,ne,nw'
			);

		function filteredUi(ui) {
			return {
				originalPosition: ui.originalPosition,
				originalSize: ui.originalSize,
				position: ui.position,
				size: ui.size
			};
		}

		self.uiDialog.resizable({
			cancel: '.ui-dialog-content',
			containment: 'document',
			alsoResize: self.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: self._minHeight(),
			handles: resizeHandles,
			start: function(event, ui) {
				$(this).addClass("ui-dialog-resizing");
				self._trigger('resizeStart', event, filteredUi(ui));
			},
			resize: function(event, ui) {
				self._trigger('resize', event, filteredUi(ui));
			},
			stop: function(event, ui) {
				$(this).removeClass("ui-dialog-resizing");
				options.height = $(this).height();
				options.width = $(this).width();
				self._trigger('resizeStop', event, filteredUi(ui));
				$.ui.dialog.overlay.resize();
			}
		})
		.css('position', position)
		.find('.ui-resizable-se').addClass('ui-icon ui-icon-grip-diagonal-se');
	},

	_minHeight: function() {
		var options = this.options;

		if (options.height === 'auto') {
			return options.minHeight;
		} else {
			return Math.min(options.minHeight, options.height);
		}
	},

	_position: function(position) {
		var myAt = [],
			offset = [0, 0],
			isVisible;

		if (position) {
			// deep extending converts arrays to objects in jQuery <= 1.3.2 :-(
	//		if (typeof position == 'string' || $.isArray(position)) {
	//			myAt = $.isArray(position) ? position : position.split(' ');

			if (typeof position === 'string' || (typeof position === 'object' && '0' in position)) {
				myAt = position.split ? position.split(' ') : [position[0], position[1]];
				if (myAt.length === 1) {
					myAt[1] = myAt[0];
				}

				$.each(['left', 'top'], function(i, offsetPosition) {
					if (+myAt[i] === myAt[i]) {
						offset[i] = myAt[i];
						myAt[i] = offsetPosition;
					}
				});

				position = {
					my: myAt.join(" "),
					at: myAt.join(" "),
					offset: offset.join(" ")
				};
			} 

			position = $.extend({}, $.ui.dialog.prototype.options.position, position);
		} else {
			position = $.ui.dialog.prototype.options.position;
		}

		// need to show the dialog to get the actual offset in the position plugin
		isVisible = this.uiDialog.is(':visible');
		if (!isVisible) {
			this.uiDialog.show();
		}
		this.uiDialog
			// workaround for jQuery bug #5781 http://dev.jquery.com/ticket/5781
			.css({ top: 0, left: 0 })
			.position($.extend({ of: window }, position));
		if (!isVisible) {
			this.uiDialog.hide();
		}
	},

	_setOptions: function( options ) {
		var self = this,
			resizableOptions = {},
			resize = false;

		$.each( options, function( key, value ) {
			self._setOption( key, value );
			
			if ( key in sizeRelatedOptions ) {
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
		}
		if ( this.uiDialog.is( ":data(resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
		}
	},

	_setOption: function(key, value){
		var self = this,
			uiDialog = self.uiDialog;

		switch (key) {
			//handling of deprecated beforeclose (vs beforeClose) option
			//Ticket #4669 http://dev.jqueryui.com/ticket/4669
			//TODO: remove in 1.9pre
			case "beforeclose":
				key = "beforeClose";
				break;
			case "buttons":
				self._createButtons(value);
				break;
			case "closeText":
				// ensure that we always pass a string
				self.uiDialogTitlebarCloseText.text("" + value);
				break;
			case "dialogClass":
				uiDialog
					.removeClass(self.options.dialogClass)
					.addClass(uiDialogClasses + value);
				break;
			case "disabled":
				if (value) {
					uiDialog.addClass('ui-dialog-disabled');
				} else {
					uiDialog.removeClass('ui-dialog-disabled');
				}
				break;
			case "draggable":
				var isDraggable = uiDialog.is( ":data(draggable)" );
				if ( isDraggable && !value ) {
					uiDialog.draggable( "destroy" );
				}
				
				if ( !isDraggable && value ) {
					self._makeDraggable();
				}
				break;
			case "position":
				self._position(value);
				break;
			case "resizable":
				// currently resizable, becoming non-resizable
				var isResizable = uiDialog.is( ":data(resizable)" );
				if (isResizable && !value) {
					uiDialog.resizable('destroy');
				}

				// currently resizable, changing handles
				if (isResizable && typeof value === 'string') {
					uiDialog.resizable('option', 'handles', value);
				}

				// currently non-resizable, becoming resizable
				if (!isResizable && value !== false) {
					self._makeResizable(value);
				}
				break;
			case "title":
				// convert whatever was passed in o a string, for html() to not throw up
				$(".ui-dialog-title", self.uiDialogTitlebar).html("" + (value || '&#160;'));
				break;
		}

		$.Widget.prototype._setOption.apply(self, arguments);
	},

	_size: function() {
		/* If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		 * divs will both have width and height set, so we need to reset them
		 */
		var options = this.options,
			nonContentHeight,
			minContentHeight,
			isVisible = this.uiDialog.is( ":visible" );

		// reset content sizing
		this.element.show().css({
			width: 'auto',
			minHeight: 0,
			height: 0
		});

		if (options.minWidth > options.width) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: 'auto',
				width: options.width
			})
			.height();
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );
		
		if ( options.height === "auto" ) {
			// only needed for IE6 support
			if ( $.support.minHeight ) {
				this.element.css({
					minHeight: minContentHeight,
					height: "auto"
				});
			} else {
				this.uiDialog.show();
				var autoHeight = this.element.css( "height", "auto" ).height();
				if ( !isVisible ) {
					this.uiDialog.hide();
				}
				this.element.height( Math.max( autoHeight, minContentHeight ) );
			}
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.uiDialog.is(':data(resizable)')) {
			this.uiDialog.resizable('option', 'minHeight', this._minHeight());
		}
	}
});

$.extend($.ui.dialog, {
	version: "1.8.12",

	uuid: 0,
	maxZ: 0,

	getTitleId: function($el) {
		var id = $el.attr('id');
		if (!id) {
			this.uuid += 1;
			id = this.uuid;
		}
		return 'ui-dialog-title-' + id;
	},

	overlay: function(dialog) {
		this.$el = $.ui.dialog.overlay.create(dialog);
	}
});

$.extend($.ui.dialog.overlay, {
	instances: [],
	// reuse old instances due to IE memory leak with alpha transparency (see #5185)
	oldInstances: [],
	maxZ: 0,
	events: $.map('focus,mousedown,mouseup,keydown,keypress,click'.split(','),
		function(event) { return event + '.dialog-overlay'; }).join(' '),
	create: function(dialog) {
		if (this.instances.length === 0) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ($.ui.dialog.overlay.instances.length) {
					$(document).bind($.ui.dialog.overlay.events, function(event) {
						// stop events if the z-index of the target is < the z-index of the overlay
						// we cannot return true when we don't want to cancel the event (#3523)
						if ($(event.target).zIndex() < $.ui.dialog.overlay.maxZ) {
							return false;
						}
					});
				}
			}, 1);

			// allow closing by pressing the escape key
			$(document).bind('keydown.dialog-overlay', function(event) {
				if (dialog.options.closeOnEscape && event.keyCode &&
					event.keyCode === $.ui.keyCode.ESCAPE) {
					
					dialog.close(event);
					event.preventDefault();
				}
			});

			// handle window resize
			$(window).bind('resize.dialog-overlay', $.ui.dialog.overlay.resize);
		}

		var $el = (this.oldInstances.pop() || $('<div></div>').addClass('ui-widget-overlay'))
			.appendTo(document.body)
			.css({
				width: this.width(),
				height: this.height()
			});

		if ($.fn.bgiframe) {
			$el.bgiframe();
		}

		this.instances.push($el);
		return $el;
	},

	destroy: function($el) {
		var indexOf = $.inArray($el, this.instances);
		if (indexOf != -1){
			this.oldInstances.push(this.instances.splice(indexOf, 1)[0]);
		}

		if (this.instances.length === 0) {
			$([document, window]).unbind('.dialog-overlay');
		}

		$el.remove();
		
		// adjust the maxZ to allow other modal dialogs to continue to work (see #4309)
		var maxZ = 0;
		$.each(this.instances, function() {
			maxZ = Math.max(maxZ, this.css('z-index'));
		});
		this.maxZ = maxZ;
	},

	height: function() {
		var scrollHeight,
			offsetHeight;
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			scrollHeight = Math.max(
				document.documentElement.scrollHeight,
				document.body.scrollHeight
			);
			offsetHeight = Math.max(
				document.documentElement.offsetHeight,
				document.body.offsetHeight
			);

			if (scrollHeight < offsetHeight) {
				return $(window).height() + 'px';
			} else {
				return scrollHeight + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).height() + 'px';
		}
	},

	width: function() {
		var scrollWidth,
			offsetWidth;
		// handle IE 6
		if ($.browser.msie && $.browser.version < 7) {
			scrollWidth = Math.max(
				document.documentElement.scrollWidth,
				document.body.scrollWidth
			);
			offsetWidth = Math.max(
				document.documentElement.offsetWidth,
				document.body.offsetWidth
			);

			if (scrollWidth < offsetWidth) {
				return $(window).width() + 'px';
			} else {
				return scrollWidth + 'px';
			}
		// handle "good" browsers
		} else {
			return $(document).width() + 'px';
		}
	},

	resize: function() {
		/* If the dialog is draggable and the user drags it past the
		 * right edge of the window, the document becomes wider so we
		 * need to stretch the overlay. If the user then drags the
		 * dialog back to the left, the document will become narrower,
		 * so we need to shrink the overlay to the appropriate size.
		 * This is handled by shrinking the overlay before setting it
		 * to the full document size.
		 */
		var $overlays = $([]);
		$.each($.ui.dialog.overlay.instances, function() {
			$overlays = $overlays.add(this);
		});

		$overlays.css({
			width: 0,
			height: 0
		}).css({
			width: $.ui.dialog.overlay.width(),
			height: $.ui.dialog.overlay.height()
		});
	}
});

$.extend($.ui.dialog.overlay.prototype, {
	destroy: function() {
		$.ui.dialog.overlay.destroy(this.$el);
	}
});

}(jQuery));

/* 
 * jQuery UI Sortable 1.8.12 
 * 
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about) 
 * Dual licensed under the MIT or GPL Version 2 licenses. 
 * http://jquery.org/license 
 * 
 * http://docs.jquery.com/UI/Sortables 
 * 
 * Depends: 
 *   jquery.ui.core.js 
 *   jquery.ui.mouse.js 
 *   jquery.ui.widget.js 
 */
(function (d) {
	d.widget("ui.sortable", d.ui.mouse, {
		widgetEventPrefix: "sort", options: { appendTo: "parent", axis: false, connectWith: false, containment: false, cursor: "auto", cursorAt: false, dropOnEmpty: true, forcePlaceholderSize: false, forceHelperSize: false, grid: false, handle: false, helper: "original", items: "> *", opacity: false, placeholder: false, revert: false, scroll: true, scrollSensitivity: 20, scrollSpeed: 20, scope: "default", tolerance: "intersect", zIndex: 1E3 }, _create: function () {
			this.containerCache = {}; this.element.addClass("ui-sortable");

			this.refresh(); this.floating = this.items.length ? /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : false; this.offset = this.element.offset(); this._mouseInit()
		}, destroy: function () { this.element.removeClass("ui-sortable ui-sortable-disabled").removeData("sortable").unbind(".sortable"); this._mouseDestroy(); for (var a = this.items.length - 1; a >= 0; a--) this.items[a].item.removeData("sortable-item"); return this }, _setOption: function (a, b) {
			if (a === "disabled") {
				this.options[a] =
				b; this.widget()[b ? "addClass" : "removeClass"]("ui-sortable-disabled")
			} else d.Widget.prototype._setOption.apply(this, arguments)
		}, _mouseCapture: function (a, b) {
			if (this.reverting) return false; if (this.options.disabled || this.options.type == "static") return false; this._refreshItems(a); var c = null, e = this; d(a.target).parents().each(function () { if (d.data(this, "sortable-item") == e) { c = d(this); return false } }); if (d.data(a.target, "sortable-item") == e) c = d(a.target); if (!c) return false; if (this.options.handle && !b) {
				var f = false;
				d(this.options.handle, c).find("*").andSelf().each(function () { if (this == a.target) f = true }); if (!f) return false
			} this.currentItem = c; this._removeCurrentsFromItems(); return true
		}, _mouseStart: function (a, b, c) {
			b = this.options; var e = this; this.currentContainer = this; this.refreshPositions(); this.helper = this._createHelper(a); this._cacheHelperProportions(); this._cacheMargins(); this.scrollParent = this.helper.scrollParent(); this.offset = this.currentItem.offset(); this.offset = {
				top: this.offset.top - this.margins.top, left: this.offset.left -
				this.margins.left
			}; this.helper.css("position", "absolute"); this.cssPosition = this.helper.css("position"); d.extend(this.offset, { click: { left: a.pageX - this.offset.left, top: a.pageY - this.offset.top }, parent: this._getParentOffset(), relative: this._getRelativeOffset() }); this.originalPosition = this._generatePosition(a); this.originalPageX = a.pageX; this.originalPageY = a.pageY; b.cursorAt && this._adjustOffsetFromHelper(b.cursorAt); this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };
			this.helper[0] != this.currentItem[0] && this.currentItem.hide(); this._createPlaceholder(); b.containment && this._setContainment(); if (b.cursor) { if (d("body").css("cursor")) this._storedCursor = d("body").css("cursor"); d("body").css("cursor", b.cursor) } if (b.opacity) { if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity"); this.helper.css("opacity", b.opacity) } if (b.zIndex) { if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex"); this.helper.css("zIndex", b.zIndex) } if (this.scrollParent[0] !=
			document && this.scrollParent[0].tagName != "HTML") this.overflowOffset = this.scrollParent.offset(); this._trigger("start", a, this._uiHash()); this._preserveHelperProportions || this._cacheHelperProportions(); if (!c) for (c = this.containers.length - 1; c >= 0; c--) this.containers[c]._trigger("activate", a, e._uiHash(this)); if (d.ui.ddmanager) d.ui.ddmanager.current = this; d.ui.ddmanager && !b.dropBehaviour && d.ui.ddmanager.prepareOffsets(this, a); this.dragging = true; this.helper.addClass("ui-sortable-helper"); this._mouseDrag(a);
			return true
		}, _mouseDrag: function (a) {
			this.position = this._generatePosition(a); this.positionAbs = this._convertPositionTo("absolute"); if (!this.lastPositionAbs) this.lastPositionAbs = this.positionAbs; if (this.options.scroll) {
				var b = this.options, c = false; if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
					if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - a.pageY < b.scrollSensitivity) this.scrollParent[0].scrollTop = c = this.scrollParent[0].scrollTop + b.scrollSpeed; else if (a.pageY - this.overflowOffset.top <
					b.scrollSensitivity) this.scrollParent[0].scrollTop = c = this.scrollParent[0].scrollTop - b.scrollSpeed; if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - a.pageX < b.scrollSensitivity) this.scrollParent[0].scrollLeft = c = this.scrollParent[0].scrollLeft + b.scrollSpeed; else if (a.pageX - this.overflowOffset.left < b.scrollSensitivity) this.scrollParent[0].scrollLeft = c = this.scrollParent[0].scrollLeft - b.scrollSpeed
				} else {
					if (a.pageY - d(document).scrollTop() < b.scrollSensitivity) c = d(document).scrollTop(d(document).scrollTop() -
					b.scrollSpeed); else if (d(window).height() - (a.pageY - d(document).scrollTop()) < b.scrollSensitivity) c = d(document).scrollTop(d(document).scrollTop() + b.scrollSpeed); if (a.pageX - d(document).scrollLeft() < b.scrollSensitivity) c = d(document).scrollLeft(d(document).scrollLeft() - b.scrollSpeed); else if (d(window).width() - (a.pageX - d(document).scrollLeft()) < b.scrollSensitivity) c = d(document).scrollLeft(d(document).scrollLeft() + b.scrollSpeed)
				} c !== false && d.ui.ddmanager && !b.dropBehaviour && d.ui.ddmanager.prepareOffsets(this,
				a)
			} this.positionAbs = this._convertPositionTo("absolute"); if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px"; if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px"; for (b = this.items.length - 1; b >= 0; b--) {
				c = this.items[b]; var e = c.item[0], f = this._intersectsWithPointer(c); if (f) if (e != this.currentItem[0] && this.placeholder[f == 1 ? "next" : "prev"]()[0] != e && !d.ui.contains(this.placeholder[0], e) && (this.options.type == "semi-dynamic" ? !d.ui.contains(this.element[0],
				e) : true)) { this.direction = f == 1 ? "down" : "up"; if (this.options.tolerance == "pointer" || this._intersectsWithSides(c)) this._rearrange(a, c); else break; this._trigger("change", a, this._uiHash()); break }
			} this._contactContainers(a); d.ui.ddmanager && d.ui.ddmanager.drag(this, a); this._trigger("sort", a, this._uiHash()); this.lastPositionAbs = this.positionAbs; return false
		}, _mouseStop: function (a, b) {
			if (a) {
				d.ui.ddmanager && !this.options.dropBehaviour && d.ui.ddmanager.drop(this, a); if (this.options.revert) {
					var c = this; b = c.placeholder.offset();
					c.reverting = true; d(this.helper).animate({ left: b.left - this.offset.parent.left - c.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft), top: b.top - this.offset.parent.top - c.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop) }, parseInt(this.options.revert, 10) || 500, function () { c._clear(a) })
				} else this._clear(a, b); return false
			}
		}, cancel: function () {
			var a = this; if (this.dragging) {
				this._mouseUp({ target: null }); this.options.helper == "original" ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") :
				this.currentItem.show(); for (var b = this.containers.length - 1; b >= 0; b--) { this.containers[b]._trigger("deactivate", null, a._uiHash(this)); if (this.containers[b].containerCache.over) { this.containers[b]._trigger("out", null, a._uiHash(this)); this.containers[b].containerCache.over = 0 } }
			} if (this.placeholder) {
				this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]); this.options.helper != "original" && this.helper && this.helper[0].parentNode && this.helper.remove(); d.extend(this, {
					helper: null,
					dragging: false, reverting: false, _noFinalSort: null
				}); this.domPosition.prev ? d(this.domPosition.prev).after(this.currentItem) : d(this.domPosition.parent).prepend(this.currentItem)
			} return this
		}, serialize: function (a) { var b = this._getItemsAsjQuery(a && a.connected), c = []; a = a || {}; d(b).each(function () { var e = (d(a.item || this).attr(a.attribute || "id") || "").match(a.expression || /(.+)[-=_](.+)/); if (e) c.push((a.key || e[1] + "[]") + "=" + (a.key && a.expression ? e[1] : e[2])) }); !c.length && a.key && c.push(a.key + "="); return c.join("&") },
		toArray: function (a) { var b = this._getItemsAsjQuery(a && a.connected), c = []; a = a || {}; b.each(function () { c.push(d(a.item || this).attr(a.attribute || "id") || "") }); return c }, _intersectsWith: function (a) {
			var b = this.positionAbs.left, c = b + this.helperProportions.width, e = this.positionAbs.top, f = e + this.helperProportions.height, g = a.left, h = g + a.width, i = a.top, k = i + a.height, j = this.offset.click.top, l = this.offset.click.left; j = e + j > i && e + j < k && b + l > g && b + l < h; return this.options.tolerance == "pointer" || this.options.forcePointerForContainers ||
			this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > a[this.floating ? "width" : "height"] ? j : g < b + this.helperProportions.width / 2 && c - this.helperProportions.width / 2 < h && i < e + this.helperProportions.height / 2 && f - this.helperProportions.height / 2 < k
		}, _intersectsWithPointer: function (a) {
			var b = d.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, a.top, a.height); a = d.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, a.left, a.width); b = b && a; a = this._getDragVerticalDirection();
			var c = this._getDragHorizontalDirection(); if (!b) return false; return this.floating ? c && c == "right" || a == "down" ? 2 : 1 : a && (a == "down" ? 2 : 1)
		}, _intersectsWithSides: function (a) { var b = d.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, a.top + a.height / 2, a.height); a = d.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, a.left + a.width / 2, a.width); var c = this._getDragVerticalDirection(), e = this._getDragHorizontalDirection(); return this.floating && e ? e == "right" && a || e == "left" && !a : c && (c == "down" && b || c == "up" && !b) },
		_getDragVerticalDirection: function () { var a = this.positionAbs.top - this.lastPositionAbs.top; return a != 0 && (a > 0 ? "down" : "up") }, _getDragHorizontalDirection: function () { var a = this.positionAbs.left - this.lastPositionAbs.left; return a != 0 && (a > 0 ? "right" : "left") }, refresh: function (a) { this._refreshItems(a); this.refreshPositions(); return this }, _connectWith: function () { var a = this.options; return a.connectWith.constructor == String ? [a.connectWith] : a.connectWith }, _getItemsAsjQuery: function (a) {
			var b = [], c = [], e = this._connectWith();
			if (e && a) for (a = e.length - 1; a >= 0; a--) for (var f = d(e[a]), g = f.length - 1; g >= 0; g--) { var h = d.data(f[g], "sortable"); if (h && h != this && !h.options.disabled) c.push([d.isFunction(h.options.items) ? h.options.items.call(h.element) : d(h.options.items, h.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), h]) } c.push([d.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : d(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"),
			this]); for (a = c.length - 1; a >= 0; a--) c[a][0].each(function () { b.push(this) }); return d(b)
		}, _removeCurrentsFromItems: function () { for (var a = this.currentItem.find(":data(sortable-item)"), b = 0; b < this.items.length; b++) for (var c = 0; c < a.length; c++) a[c] == this.items[b].item[0] && this.items.splice(b, 1) }, _refreshItems: function (a) {
			this.items = []; this.containers = [this]; var b = this.items, c = [[d.isFunction(this.options.items) ? this.options.items.call(this.element[0], a, { item: this.currentItem }) : d(this.options.items, this.element),
			this]], e = this._connectWith(); if (e) for (var f = e.length - 1; f >= 0; f--) for (var g = d(e[f]), h = g.length - 1; h >= 0; h--) { var i = d.data(g[h], "sortable"); if (i && i != this && !i.options.disabled) { c.push([d.isFunction(i.options.items) ? i.options.items.call(i.element[0], a, { item: this.currentItem }) : d(i.options.items, i.element), i]); this.containers.push(i) } } for (f = c.length - 1; f >= 0; f--) { a = c[f][1]; e = c[f][0]; h = 0; for (g = e.length; h < g; h++) { i = d(e[h]); i.data("sortable-item", a); b.push({ item: i, instance: a, width: 0, height: 0, left: 0, top: 0 }) } }
		}, refreshPositions: function (a) {
			if (this.offsetParent &&
			this.helper) this.offset.parent = this._getParentOffset(); for (var b = this.items.length - 1; b >= 0; b--) { var c = this.items[b]; if (!(c.instance != this.currentContainer && this.currentContainer && c.item[0] != this.currentItem[0])) { var e = this.options.toleranceElement ? d(this.options.toleranceElement, c.item) : c.item; if (!a) { c.width = e.outerWidth(); c.height = e.outerHeight() } e = e.offset(); c.left = e.left; c.top = e.top } } if (this.options.custom && this.options.custom.refreshContainers) this.options.custom.refreshContainers.call(this); else for (b =
			this.containers.length - 1; b >= 0; b--) { e = this.containers[b].element.offset(); this.containers[b].containerCache.left = e.left; this.containers[b].containerCache.top = e.top; this.containers[b].containerCache.width = this.containers[b].element.outerWidth(); this.containers[b].containerCache.height = this.containers[b].element.outerHeight() } return this
		}, _createPlaceholder: function (a) {
			var b = a || this, c = b.options; if (!c.placeholder || c.placeholder.constructor == String) {
				var e = c.placeholder; c.placeholder = {
					element: function () {
						var f =
						d(document.createElement(b.currentItem[0].nodeName)).addClass(e || b.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0]; if (!e) f.style.visibility = "hidden"; return f
					}, update: function (f, g) {
						if (!(e && !c.forcePlaceholderSize)) {
							g.height() || g.height(b.currentItem.innerHeight() - parseInt(b.currentItem.css("paddingTop") || 0, 10) - parseInt(b.currentItem.css("paddingBottom") || 0, 10)); g.width() || g.width(b.currentItem.innerWidth() - parseInt(b.currentItem.css("paddingLeft") || 0, 10) - parseInt(b.currentItem.css("paddingRight") ||
							0, 10))
						}
					}
				}
			} b.placeholder = d(c.placeholder.element.call(b.element, b.currentItem)); b.currentItem.after(b.placeholder); c.placeholder.update(b, b.placeholder)
		}, _contactContainers: function (a) {
			for (var b = null, c = null, e = this.containers.length - 1; e >= 0; e--) if (!d.ui.contains(this.currentItem[0], this.containers[e].element[0])) if (this._intersectsWith(this.containers[e].containerCache)) { if (!(b && d.ui.contains(this.containers[e].element[0], b.element[0]))) { b = this.containers[e]; c = e } } else if (this.containers[e].containerCache.over) {
				this.containers[e]._trigger("out",
				a, this._uiHash(this)); this.containers[e].containerCache.over = 0
			} if (b) if (this.containers.length === 1) { this.containers[c]._trigger("over", a, this._uiHash(this)); this.containers[c].containerCache.over = 1 } else if (this.currentContainer != this.containers[c]) {
				b = 1E4; e = null; for (var f = this.positionAbs[this.containers[c].floating ? "left" : "top"], g = this.items.length - 1; g >= 0; g--) if (d.ui.contains(this.containers[c].element[0], this.items[g].item[0])) {
					var h = this.items[g][this.containers[c].floating ? "left" : "top"]; if (Math.abs(h -
					f) < b) { b = Math.abs(h - f); e = this.items[g] }
				} if (e || this.options.dropOnEmpty) { this.currentContainer = this.containers[c]; e ? this._rearrange(a, e, null, true) : this._rearrange(a, null, this.containers[c].element, true); this._trigger("change", a, this._uiHash()); this.containers[c]._trigger("change", a, this._uiHash(this)); this.options.placeholder.update(this.currentContainer, this.placeholder); this.containers[c]._trigger("over", a, this._uiHash(this)); this.containers[c].containerCache.over = 1 }
			}
		}, _createHelper: function (a) {
			var b =
			this.options; a = d.isFunction(b.helper) ? d(b.helper.apply(this.element[0], [a, this.currentItem])) : b.helper == "clone" ? this.currentItem.clone() : this.currentItem; a.parents("body").length || d(b.appendTo != "parent" ? b.appendTo : this.currentItem[0].parentNode)[0].appendChild(a[0]); if (a[0] == this.currentItem[0]) this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") }; if (a[0].style.width ==
			"" || b.forceHelperSize) a.width(this.currentItem.width()); if (a[0].style.height == "" || b.forceHelperSize) a.height(this.currentItem.height()); return a
		}, _adjustOffsetFromHelper: function (a) {
			if (typeof a == "string") a = a.split(" "); if (d.isArray(a)) a = { left: +a[0], top: +a[1] || 0 }; if ("left" in a) this.offset.click.left = a.left + this.margins.left; if ("right" in a) this.offset.click.left = this.helperProportions.width - a.right + this.margins.left; if ("top" in a) this.offset.click.top = a.top + this.margins.top; if ("bottom" in a) this.offset.click.top =
			this.helperProportions.height - a.bottom + this.margins.top
		}, _getParentOffset: function () {
			this.offsetParent = this.helper.offsetParent(); var a = this.offsetParent.offset(); if (this.cssPosition == "absolute" && this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) { a.left += this.scrollParent.scrollLeft(); a.top += this.scrollParent.scrollTop() } if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && d.browser.msie) a =
			{ top: 0, left: 0 }; return { top: a.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: a.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0) }
		}, _getRelativeOffset: function () { if (this.cssPosition == "relative") { var a = this.currentItem.position(); return { top: a.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left: a.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft() } } else return { top: 0, left: 0 } }, _cacheMargins: function () {
			this.margins = {
				left: parseInt(this.currentItem.css("marginLeft"),
				10) || 0, top: parseInt(this.currentItem.css("marginTop"), 10) || 0
			}
		}, _cacheHelperProportions: function () { this.helperProportions = { width: this.helper.outerWidth(), height: this.helper.outerHeight() } }, _setContainment: function () {
			var a = this.options; if (a.containment == "parent") a.containment = this.helper[0].parentNode; if (a.containment == "document" || a.containment == "window") this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, d(a.containment == "document" ?
				document : window).width() - this.helperProportions.width - this.margins.left, (d(a.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top]; if (!/^(document|window|parent)$/.test(a.containment)) {
					var b = d(a.containment)[0]; a = d(a.containment).offset(); var c = d(b).css("overflow") != "hidden"; this.containment = [a.left + (parseInt(d(b).css("borderLeftWidth"), 10) || 0) + (parseInt(d(b).css("paddingLeft"), 10) || 0) - this.margins.left, a.top + (parseInt(d(b).css("borderTopWidth"),
					10) || 0) + (parseInt(d(b).css("paddingTop"), 10) || 0) - this.margins.top, a.left + (c ? Math.max(b.scrollWidth, b.offsetWidth) : b.offsetWidth) - (parseInt(d(b).css("borderLeftWidth"), 10) || 0) - (parseInt(d(b).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, a.top + (c ? Math.max(b.scrollHeight, b.offsetHeight) : b.offsetHeight) - (parseInt(d(b).css("borderTopWidth"), 10) || 0) - (parseInt(d(b).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
				}
		}, _convertPositionTo: function (a, b) {
			if (!b) b =
			this.position; a = a == "absolute" ? 1 : -1; var c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, e = /(html|body)/i.test(c[0].tagName); return {
				top: b.top + this.offset.relative.top * a + this.offset.parent.top * a - (d.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : c.scrollTop()) * a), left: b.left + this.offset.relative.left * a + this.offset.parent.left * a - (d.browser.safari &&
				this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : c.scrollLeft()) * a)
			}
		}, _generatePosition: function (a) {
			var b = this.options, c = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && d.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, e = /(html|body)/i.test(c[0].tagName); if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) this.offset.relative = this._getRelativeOffset();
			var f = a.pageX, g = a.pageY; if (this.originalPosition) {
				if (this.containment) { if (a.pageX - this.offset.click.left < this.containment[0]) f = this.containment[0] + this.offset.click.left; if (a.pageY - this.offset.click.top < this.containment[1]) g = this.containment[1] + this.offset.click.top; if (a.pageX - this.offset.click.left > this.containment[2]) f = this.containment[2] + this.offset.click.left; if (a.pageY - this.offset.click.top > this.containment[3]) g = this.containment[3] + this.offset.click.top } if (b.grid) {
					g = this.originalPageY + Math.round((g -
					this.originalPageY) / b.grid[1]) * b.grid[1]; g = this.containment ? !(g - this.offset.click.top < this.containment[1] || g - this.offset.click.top > this.containment[3]) ? g : !(g - this.offset.click.top < this.containment[1]) ? g - b.grid[1] : g + b.grid[1] : g; f = this.originalPageX + Math.round((f - this.originalPageX) / b.grid[0]) * b.grid[0]; f = this.containment ? !(f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2]) ? f : !(f - this.offset.click.left < this.containment[0]) ? f - b.grid[0] : f + b.grid[0] : f
				}
			} return {
				top: g -
				this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (d.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : e ? 0 : c.scrollTop()), left: f - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (d.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : e ? 0 : c.scrollLeft())
			}
		}, _rearrange: function (a, b, c, e) {
			c ? c[0].appendChild(this.placeholder[0]) : b.item[0].parentNode.insertBefore(this.placeholder[0],
			this.direction == "down" ? b.item[0] : b.item[0].nextSibling); this.counter = this.counter ? ++this.counter : 1; var f = this, g = this.counter; window.setTimeout(function () { g == f.counter && f.refreshPositions(!e) }, 0)
		}, _clear: function (a, b) {
			this.reverting = false; var c = []; !this._noFinalSort && this.currentItem[0].parentNode && this.placeholder.before(this.currentItem); this._noFinalSort = null; if (this.helper[0] == this.currentItem[0]) {
				for (var e in this._storedCSS) if (this._storedCSS[e] == "auto" || this._storedCSS[e] == "static") this._storedCSS[e] =
				""; this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
			} else this.currentItem.show(); this.fromOutside && !b && c.push(function (f) { this._trigger("receive", f, this._uiHash(this.fromOutside)) }); if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !b) c.push(function (f) { this._trigger("update", f, this._uiHash()) }); if (!d.ui.contains(this.element[0], this.currentItem[0])) {
				b || c.push(function (f) {
					this._trigger("remove",
					f, this._uiHash())
				}); for (e = this.containers.length - 1; e >= 0; e--) if (d.ui.contains(this.containers[e].element[0], this.currentItem[0]) && !b) { c.push(function (f) { return function (g) { f._trigger("receive", g, this._uiHash(this)) } }.call(this, this.containers[e])); c.push(function (f) { return function (g) { f._trigger("update", g, this._uiHash(this)) } }.call(this, this.containers[e])) }
			} for (e = this.containers.length - 1; e >= 0; e--) {
				b || c.push(function (f) { return function (g) { f._trigger("deactivate", g, this._uiHash(this)) } }.call(this,
				this.containers[e])); if (this.containers[e].containerCache.over) { c.push(function (f) { return function (g) { f._trigger("out", g, this._uiHash(this)) } }.call(this, this.containers[e])); this.containers[e].containerCache.over = 0 }
			} this._storedCursor && d("body").css("cursor", this._storedCursor); this._storedOpacity && this.helper.css("opacity", this._storedOpacity); if (this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex); this.dragging = false; if (this.cancelHelperRemoval) {
				if (!b) {
					this._trigger("beforeStop",
					a, this._uiHash()); for (e = 0; e < c.length; e++) c[e].call(this, a); this._trigger("stop", a, this._uiHash())
				} return false
			} b || this._trigger("beforeStop", a, this._uiHash()); this.placeholder[0].parentNode.removeChild(this.placeholder[0]); this.helper[0] != this.currentItem[0] && this.helper.remove(); this.helper = null; if (!b) { for (e = 0; e < c.length; e++) c[e].call(this, a); this._trigger("stop", a, this._uiHash()) } this.fromOutside = false; return true
		}, _trigger: function () { d.Widget.prototype._trigger.apply(this, arguments) === false && this.cancel() },
		_uiHash: function (a) { var b = a || this; return { helper: b.helper, placeholder: b.placeholder || d([]), position: b.position, originalPosition: b.originalPosition, offset: b.positionAbs, item: b.currentItem, sender: a ? a.element : null } }
	}); d.extend(d.ui.sortable, { version: "1.8.12" })
})(jQuery);
;// Name:        MicrosoftAjax.debug.js
// Assembly:    System.Web.Extensions
// Version:     4.0.0.0
// FileVersion: 4.0.30205.0
//-----------------------------------------------------------------------
// Copyright (C) Microsoft Corporation. All rights reserved.
//-----------------------------------------------------------------------
// MicrosoftAjax.js
// Microsoft AJAX Framework.

Function.__typeName = 'Function';
Function.__class = true;
Function.createCallback = function Function$createCallback(method, context) {
	/// <summary locid="M:J#Function.createCallback" />
	/// <param name="method" type="Function"></param>
	/// <param name="context" mayBeNull="true"></param>
	/// <returns type="Function"></returns>
	var e = Function._validateParams(arguments, [
        { name: "method", type: Function },
        { name: "context", mayBeNull: true }
    ]);
	if (e) throw e;
	return function () {
		var l = arguments.length;
		if (l > 0) {
			var args = [];
			for (var i = 0; i < l; i++) {
				args[i] = arguments[i];
			}
			args[l] = context;
			return method.apply(this, args);
		}
		return method.call(this, context);
	}
}
Function.createDelegate = function Function$createDelegate(instance, method) {
	/// <summary locid="M:J#Function.createDelegate" />
	/// <param name="instance" mayBeNull="true"></param>
	/// <param name="method" type="Function"></param>
	/// <returns type="Function"></returns>
	var e = Function._validateParams(arguments, [
        { name: "instance", mayBeNull: true },
        { name: "method", type: Function }
    ]);
	if (e) throw e;
	return function () {
		return method.apply(instance, arguments);
	}
}
Function.emptyFunction = Function.emptyMethod = function Function$emptyMethod() {
	/// <summary locid="M:J#Function.emptyMethod" />
}
Function.validateParameters = function Function$validateParameters(parameters, expectedParameters, validateParameterCount) {
	/// <summary locid="M:J#Function.validateParameters" />
	/// <param name="parameters"></param>
	/// <param name="expectedParameters"></param>
	/// <param name="validateParameterCount" type="Boolean" optional="true"></param>
	/// <returns type="Error" mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "parameters" },
        { name: "expectedParameters" },
        { name: "validateParameterCount", type: Boolean, optional: true }
    ]);
	if (e) throw e;
	return Function._validateParams(parameters, expectedParameters, validateParameterCount);
}
Function._validateParams = function Function$_validateParams(params, expectedParams, validateParameterCount) {
	var e, expectedLength = expectedParams.length;
	validateParameterCount = validateParameterCount || (typeof (validateParameterCount) === "undefined");
	e = Function._validateParameterCount(params, expectedParams, validateParameterCount);
	if (e) {
		e.popStackFrame();
		return e;
	}
	for (var i = 0, l = params.length; i < l; i++) {
		var expectedParam = expectedParams[Math.min(i, expectedLength - 1)],
            paramName = expectedParam.name;
		if (expectedParam.parameterArray) {
			paramName += "[" + (i - expectedLength + 1) + "]";
		}
		else if (!validateParameterCount && (i >= expectedLength)) {
			break;
		}
		e = Function._validateParameter(params[i], expectedParam, paramName);
		if (e) {
			e.popStackFrame();
			return e;
		}
	}
	return null;
}
Function._validateParameterCount = function Function$_validateParameterCount(params, expectedParams, validateParameterCount) {
	var i, error,
        expectedLen = expectedParams.length,
        actualLen = params.length;
	if (actualLen < expectedLen) {
		var minParams = expectedLen;
		for (i = 0; i < expectedLen; i++) {
			var param = expectedParams[i];
			if (param.optional || param.parameterArray) {
				minParams--;
			}
		}
		if (actualLen < minParams) {
			error = true;
		}
	}
	else if (validateParameterCount && (actualLen > expectedLen)) {
		error = true;
		for (i = 0; i < expectedLen; i++) {
			if (expectedParams[i].parameterArray) {
				error = false;
				break;
			}
		}
	}
	if (error) {
		var e = Error.parameterCount();
		e.popStackFrame();
		return e;
	}
	return null;
}
Function._validateParameter = function Function$_validateParameter(param, expectedParam, paramName) {
	var e,
        expectedType = expectedParam.type,
        expectedInteger = !!expectedParam.integer,
        expectedDomElement = !!expectedParam.domElement,
        mayBeNull = !!expectedParam.mayBeNull;
	e = Function._validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName);
	if (e) {
		e.popStackFrame();
		return e;
	}
	var expectedElementType = expectedParam.elementType,
        elementMayBeNull = !!expectedParam.elementMayBeNull;
	if (expectedType === Array && typeof (param) !== "undefined" && param !== null &&
        (expectedElementType || !elementMayBeNull)) {
		var expectedElementInteger = !!expectedParam.elementInteger,
            expectedElementDomElement = !!expectedParam.elementDomElement;
		for (var i = 0; i < param.length; i++) {
			var elem = param[i];
			e = Function._validateParameterType(elem, expectedElementType,
                expectedElementInteger, expectedElementDomElement, elementMayBeNull,
                paramName + "[" + i + "]");
			if (e) {
				e.popStackFrame();
				return e;
			}
		}
	}
	return null;
}
Function._validateParameterType = function Function$_validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName) {
	var e, i;
	if (typeof (param) === "undefined") {
		if (mayBeNull) {
			return null;
		}
		else {
			e = Error.argumentUndefined(paramName);
			e.popStackFrame();
			return e;
		}
	}
	if (param === null) {
		if (mayBeNull) {
			return null;
		}
		else {
			e = Error.argumentNull(paramName);
			e.popStackFrame();
			return e;
		}
	}
	if (expectedType && expectedType.__enum) {
		if (typeof (param) !== 'number') {
			e = Error.argumentType(paramName, Object.getType(param), expectedType);
			e.popStackFrame();
			return e;
		}
		if ((param % 1) === 0) {
			var values = expectedType.prototype;
			if (!expectedType.__flags || (param === 0)) {
				for (i in values) {
					if (values[i] === param) return null;
				}
			}
			else {
				var v = param;
				for (i in values) {
					var vali = values[i];
					if (vali === 0) continue;
					if ((vali & param) === vali) {
						v -= vali;
					}
					if (v === 0) return null;
				}
			}
		}
		e = Error.argumentOutOfRange(paramName, param, String.format(Sys.Res.enumInvalidValue, param, expectedType.getName()));
		e.popStackFrame();
		return e;
	}
	if (expectedDomElement && (!Sys._isDomElement(param) || (param.nodeType === 3))) {
		e = Error.argument(paramName, Sys.Res.argumentDomElement);
		e.popStackFrame();
		return e;
	}
	if (expectedType && !Sys._isInstanceOfType(expectedType, param)) {
		e = Error.argumentType(paramName, Object.getType(param), expectedType);
		e.popStackFrame();
		return e;
	}
	if (expectedType === Number && expectedInteger) {
		if ((param % 1) !== 0) {
			e = Error.argumentOutOfRange(paramName, param, Sys.Res.argumentInteger);
			e.popStackFrame();
			return e;
		}
	}
	return null;
}

Error.__typeName = 'Error';
Error.__class = true;
Error.create = function Error$create(message, errorInfo) {
	/// <summary locid="M:J#Error.create" />
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <param name="errorInfo" optional="true" mayBeNull="true"></param>
	/// <returns type="Error"></returns>
	var e = Function._validateParams(arguments, [
        { name: "message", type: String, mayBeNull: true, optional: true },
        { name: "errorInfo", mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var err = new Error(message);
	err.message = message;
	if (errorInfo) {
		for (var v in errorInfo) {
			err[v] = errorInfo[v];
		}
	}
	err.popStackFrame();
	return err;
}
Error.argument = function Error$argument(paramName, message) {
	/// <summary locid="M:J#Error.argument" />
	/// <param name="paramName" type="String" optional="true" mayBeNull="true"></param>
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "paramName", type: String, mayBeNull: true, optional: true },
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.ArgumentException: " + (message ? message : Sys.Res.argument);
	if (paramName) {
		displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
	}
	var err = Error.create(displayMessage, { name: "Sys.ArgumentException", paramName: paramName });
	err.popStackFrame();
	return err;
}
Error.argumentNull = function Error$argumentNull(paramName, message) {
	/// <summary locid="M:J#Error.argumentNull" />
	/// <param name="paramName" type="String" optional="true" mayBeNull="true"></param>
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "paramName", type: String, mayBeNull: true, optional: true },
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.ArgumentNullException: " + (message ? message : Sys.Res.argumentNull);
	if (paramName) {
		displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
	}
	var err = Error.create(displayMessage, { name: "Sys.ArgumentNullException", paramName: paramName });
	err.popStackFrame();
	return err;
}
Error.argumentOutOfRange = function Error$argumentOutOfRange(paramName, actualValue, message) {
	/// <summary locid="M:J#Error.argumentOutOfRange" />
	/// <param name="paramName" type="String" optional="true" mayBeNull="true"></param>
	/// <param name="actualValue" optional="true" mayBeNull="true"></param>
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "paramName", type: String, mayBeNull: true, optional: true },
        { name: "actualValue", mayBeNull: true, optional: true },
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.ArgumentOutOfRangeException: " + (message ? message : Sys.Res.argumentOutOfRange);
	if (paramName) {
		displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
	}
	if (typeof (actualValue) !== "undefined" && actualValue !== null) {
		displayMessage += "\n" + String.format(Sys.Res.actualValue, actualValue);
	}
	var err = Error.create(displayMessage, {
		name: "Sys.ArgumentOutOfRangeException",
		paramName: paramName,
		actualValue: actualValue
	});
	err.popStackFrame();
	return err;
}
Error.argumentType = function Error$argumentType(paramName, actualType, expectedType, message) {
	/// <summary locid="M:J#Error.argumentType" />
	/// <param name="paramName" type="String" optional="true" mayBeNull="true"></param>
	/// <param name="actualType" type="Type" optional="true" mayBeNull="true"></param>
	/// <param name="expectedType" type="Type" optional="true" mayBeNull="true"></param>
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "paramName", type: String, mayBeNull: true, optional: true },
        { name: "actualType", type: Type, mayBeNull: true, optional: true },
        { name: "expectedType", type: Type, mayBeNull: true, optional: true },
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.ArgumentTypeException: ";
	if (message) {
		displayMessage += message;
	}
	else if (actualType && expectedType) {
		displayMessage +=
            String.format(Sys.Res.argumentTypeWithTypes, actualType.getName(), expectedType.getName());
	}
	else {
		displayMessage += Sys.Res.argumentType;
	}
	if (paramName) {
		displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
	}
	var err = Error.create(displayMessage, {
		name: "Sys.ArgumentTypeException",
		paramName: paramName,
		actualType: actualType,
		expectedType: expectedType
	});
	err.popStackFrame();
	return err;
}
Error.argumentUndefined = function Error$argumentUndefined(paramName, message) {
	/// <summary locid="M:J#Error.argumentUndefined" />
	/// <param name="paramName" type="String" optional="true" mayBeNull="true"></param>
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "paramName", type: String, mayBeNull: true, optional: true },
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.ArgumentUndefinedException: " + (message ? message : Sys.Res.argumentUndefined);
	if (paramName) {
		displayMessage += "\n" + String.format(Sys.Res.paramName, paramName);
	}
	var err = Error.create(displayMessage, { name: "Sys.ArgumentUndefinedException", paramName: paramName });
	err.popStackFrame();
	return err;
}
Error.format = function Error$format(message) {
	/// <summary locid="M:J#Error.format" />
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.FormatException: " + (message ? message : Sys.Res.format);
	var err = Error.create(displayMessage, { name: 'Sys.FormatException' });
	err.popStackFrame();
	return err;
}
Error.invalidOperation = function Error$invalidOperation(message) {
	/// <summary locid="M:J#Error.invalidOperation" />
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.InvalidOperationException: " + (message ? message : Sys.Res.invalidOperation);
	var err = Error.create(displayMessage, { name: 'Sys.InvalidOperationException' });
	err.popStackFrame();
	return err;
}
Error.notImplemented = function Error$notImplemented(message) {
	/// <summary locid="M:J#Error.notImplemented" />
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.NotImplementedException: " + (message ? message : Sys.Res.notImplemented);
	var err = Error.create(displayMessage, { name: 'Sys.NotImplementedException' });
	err.popStackFrame();
	return err;
}
Error.parameterCount = function Error$parameterCount(message) {
	/// <summary locid="M:J#Error.parameterCount" />
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "message", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var displayMessage = "Sys.ParameterCountException: " + (message ? message : Sys.Res.parameterCount);
	var err = Error.create(displayMessage, { name: 'Sys.ParameterCountException' });
	err.popStackFrame();
	return err;
}
Error.prototype.popStackFrame = function Error$popStackFrame() {
	/// <summary locid="M:J#checkParam" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (typeof (this.stack) === "undefined" || this.stack === null ||
        typeof (this.fileName) === "undefined" || this.fileName === null ||
        typeof (this.lineNumber) === "undefined" || this.lineNumber === null) {
		return;
	}
	var stackFrames = this.stack.split("\n");
	var currentFrame = stackFrames[0];
	var pattern = this.fileName + ":" + this.lineNumber;
	while (typeof (currentFrame) !== "undefined" &&
          currentFrame !== null &&
          currentFrame.indexOf(pattern) === -1) {
		stackFrames.shift();
		currentFrame = stackFrames[0];
	}
	var nextFrame = stackFrames[1];
	if (typeof (nextFrame) === "undefined" || nextFrame === null) {
		return;
	}
	var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
	if (typeof (nextFrameParts) === "undefined" || nextFrameParts === null) {
		return;
	}
	this.fileName = nextFrameParts[1];
	this.lineNumber = parseInt(nextFrameParts[2]);
	stackFrames.shift();
	this.stack = stackFrames.join("\n");
}

Object.__typeName = 'Object';
Object.__class = true;
Object.getType = function Object$getType(instance) {
	/// <summary locid="M:J#Object.getType" />
	/// <param name="instance"></param>
	/// <returns type="Type"></returns>
	var e = Function._validateParams(arguments, [
        { name: "instance" }
    ]);
	if (e) throw e;
	var ctor = instance.constructor;
	if (!ctor || (typeof (ctor) !== "function") || !ctor.__typeName || (ctor.__typeName === 'Object')) {
		return Object;
	}
	return ctor;
}
Object.getTypeName = function Object$getTypeName(instance) {
	/// <summary locid="M:J#Object.getTypeName" />
	/// <param name="instance"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "instance" }
    ]);
	if (e) throw e;
	return Object.getType(instance).getName();
}

String.__typeName = 'String';
String.__class = true;
String.prototype.endsWith = function String$endsWith(suffix) {
	/// <summary locid="M:J#String.endsWith" />
	/// <param name="suffix" type="String"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "suffix", type: String }
    ]);
	if (e) throw e;
	return (this.substr(this.length - suffix.length) === suffix);
}
String.prototype.startsWith = function String$startsWith(prefix) {
	/// <summary locid="M:J#String.startsWith" />
	/// <param name="prefix" type="String"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "prefix", type: String }
    ]);
	if (e) throw e;
	return (this.substr(0, prefix.length) === prefix);
}
String.prototype.trim = function String$trim() {
	/// <summary locid="M:J#String.trim" />
	/// <returns type="String"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this.replace(/^\s+|\s+$/g, '');
}
String.prototype.trimEnd = function String$trimEnd() {
	/// <summary locid="M:J#String.trimEnd" />
	/// <returns type="String"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this.replace(/\s+$/, '');
}
String.prototype.trimStart = function String$trimStart() {
	/// <summary locid="M:J#String.trimStart" />
	/// <returns type="String"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this.replace(/^\s+/, '');
}
String.format = function String$format(format, args) {
	/// <summary locid="M:J#String.format" />
	/// <param name="format" type="String"></param>
	/// <param name="args" parameterArray="true" mayBeNull="true"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "format", type: String },
        { name: "args", mayBeNull: true, parameterArray: true }
    ]);
	if (e) throw e;
	return String._toFormattedString(false, arguments);
}
String._toFormattedString = function String$_toFormattedString(useLocale, args) {
	var result = '';
	var format = args[0];
	for (var i = 0; ; ) {
		var open = format.indexOf('{', i);
		var close = format.indexOf('}', i);
		if ((open < 0) && (close < 0)) {
			result += format.slice(i);
			break;
		}
		if ((close > 0) && ((close < open) || (open < 0))) {
			if (format.charAt(close + 1) !== '}') {
				throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);
			}
			result += format.slice(i, close + 1);
			i = close + 2;
			continue;
		}
		result += format.slice(i, open);
		i = open + 1;
		if (format.charAt(i) === '{') {
			result += '{';
			i++;
			continue;
		}
		if (close < 0) throw Error.argument('format', Sys.Res.stringFormatBraceMismatch);
		var brace = format.substring(i, close);
		var colonIndex = brace.indexOf(':');
		var argNumber = parseInt((colonIndex < 0) ? brace : brace.substring(0, colonIndex), 10) + 1;
		if (isNaN(argNumber)) throw Error.argument('format', Sys.Res.stringFormatInvalid);
		var argFormat = (colonIndex < 0) ? '' : brace.substring(colonIndex + 1);
		var arg = args[argNumber];
		if (typeof (arg) === "undefined" || arg === null) {
			arg = '';
		}
		if (arg.toFormattedString) {
			result += arg.toFormattedString(argFormat);
		}
		else if (useLocale && arg.localeFormat) {
			result += arg.localeFormat(argFormat);
		}
		else if (arg.format) {
			result += arg.format(argFormat);
		}
		else
			result += arg.toString();
		i = close + 1;
	}
	return result;
}

Boolean.__typeName = 'Boolean';
Boolean.__class = true;
Boolean.parse = function Boolean$parse(value) {
	/// <summary locid="M:J#Boolean.parse" />
	/// <param name="value" type="String"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "value", type: String }
    ], false);
	if (e) throw e;
	var v = value.trim().toLowerCase();
	if (v === 'false') return false;
	if (v === 'true') return true;
	throw Error.argumentOutOfRange('value', value, Sys.Res.boolTrueOrFalse);
}

Date.__typeName = 'Date';
Date.__class = true;

Number.__typeName = 'Number';
Number.__class = true;

RegExp.__typeName = 'RegExp';
RegExp.__class = true;

if (!window) this.window = this;
window.Type = Function;
Type.__fullyQualifiedIdentifierRegExp = new RegExp("^[^.0-9 \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]([^ \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]*[^. \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\])?$", "i");
Type.__identifierRegExp = new RegExp("^[^.0-9 \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\][^. \\s|,;:&*=+\\-()\\[\\]{}^%#@!~\\n\\r\\t\\f\\\\]*$", "i");
Type.prototype.callBaseMethod = function Type$callBaseMethod(instance, name, baseArguments) {
	/// <summary locid="M:J#Type.callBaseMethod" />
	/// <param name="instance"></param>
	/// <param name="name" type="String"></param>
	/// <param name="baseArguments" type="Array" optional="true" mayBeNull="true" elementMayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "instance" },
        { name: "name", type: String },
        { name: "baseArguments", type: Array, mayBeNull: true, optional: true, elementMayBeNull: true }
    ]);
	if (e) throw e;
	var baseMethod = Sys._getBaseMethod(this, instance, name);
	if (!baseMethod) throw Error.invalidOperation(String.format(Sys.Res.methodNotFound, name));
	if (!baseArguments) {
		return baseMethod.apply(instance);
	}
	else {
		return baseMethod.apply(instance, baseArguments);
	}
}
Type.prototype.getBaseMethod = function Type$getBaseMethod(instance, name) {
	/// <summary locid="M:J#Type.getBaseMethod" />
	/// <param name="instance"></param>
	/// <param name="name" type="String"></param>
	/// <returns type="Function" mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "instance" },
        { name: "name", type: String }
    ]);
	if (e) throw e;
	return Sys._getBaseMethod(this, instance, name);
}
Type.prototype.getBaseType = function Type$getBaseType() {
	/// <summary locid="M:J#Type.getBaseType" />
	/// <returns type="Type" mayBeNull="true"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	return (typeof (this.__baseType) === "undefined") ? null : this.__baseType;
}
Type.prototype.getInterfaces = function Type$getInterfaces() {
	/// <summary locid="M:J#Type.getInterfaces" />
	/// <returns type="Array" elementType="Type" mayBeNull="false" elementMayBeNull="false"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	var result = [];
	var type = this;
	while (type) {
		var interfaces = type.__interfaces;
		if (interfaces) {
			for (var i = 0, l = interfaces.length; i < l; i++) {
				var interfaceType = interfaces[i];
				if (!Array.contains(result, interfaceType)) {
					result[result.length] = interfaceType;
				}
			}
		}
		type = type.__baseType;
	}
	return result;
}
Type.prototype.getName = function Type$getName() {
	/// <summary locid="M:J#Type.getName" />
	/// <returns type="String"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	return (typeof (this.__typeName) === "undefined") ? "" : this.__typeName;
}
Type.prototype.implementsInterface = function Type$implementsInterface(interfaceType) {
	/// <summary locid="M:J#Type.implementsInterface" />
	/// <param name="interfaceType" type="Type"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "interfaceType", type: Type }
    ]);
	if (e) throw e;
	this.resolveInheritance();
	var interfaceName = interfaceType.getName();
	var cache = this.__interfaceCache;
	if (cache) {
		var cacheEntry = cache[interfaceName];
		if (typeof (cacheEntry) !== 'undefined') return cacheEntry;
	}
	else {
		cache = this.__interfaceCache = {};
	}
	var baseType = this;
	while (baseType) {
		var interfaces = baseType.__interfaces;
		if (interfaces) {
			if (Array.indexOf(interfaces, interfaceType) !== -1) {
				return cache[interfaceName] = true;
			}
		}
		baseType = baseType.__baseType;
	}
	return cache[interfaceName] = false;
}
Type.prototype.inheritsFrom = function Type$inheritsFrom(parentType) {
	/// <summary locid="M:J#Type.inheritsFrom" />
	/// <param name="parentType" type="Type"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "parentType", type: Type }
    ]);
	if (e) throw e;
	this.resolveInheritance();
	var baseType = this.__baseType;
	while (baseType) {
		if (baseType === parentType) {
			return true;
		}
		baseType = baseType.__baseType;
	}
	return false;
}
Type.prototype.initializeBase = function Type$initializeBase(instance, baseArguments) {
	/// <summary locid="M:J#Type.initializeBase" />
	/// <param name="instance"></param>
	/// <param name="baseArguments" type="Array" optional="true" mayBeNull="true" elementMayBeNull="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "instance" },
        { name: "baseArguments", type: Array, mayBeNull: true, optional: true, elementMayBeNull: true }
    ]);
	if (e) throw e;
	if (!Sys._isInstanceOfType(this, instance)) throw Error.argumentType('instance', Object.getType(instance), this);
	this.resolveInheritance();
	if (this.__baseType) {
		if (!baseArguments) {
			this.__baseType.apply(instance);
		}
		else {
			this.__baseType.apply(instance, baseArguments);
		}
	}
	return instance;
}
Type.prototype.isImplementedBy = function Type$isImplementedBy(instance) {
	/// <summary locid="M:J#Type.isImplementedBy" />
	/// <param name="instance" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "instance", mayBeNull: true }
    ]);
	if (e) throw e;
	if (typeof (instance) === "undefined" || instance === null) return false;
	var instanceType = Object.getType(instance);
	return !!(instanceType.implementsInterface && instanceType.implementsInterface(this));
}
Type.prototype.isInstanceOfType = function Type$isInstanceOfType(instance) {
	/// <summary locid="M:J#Type.isInstanceOfType" />
	/// <param name="instance" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "instance", mayBeNull: true }
    ]);
	if (e) throw e;
	return Sys._isInstanceOfType(this, instance);
}
Type.prototype.registerClass = function Type$registerClass(typeName, baseType, interfaceTypes) {
	/// <summary locid="M:J#Type.registerClass" />
	/// <param name="typeName" type="String"></param>
	/// <param name="baseType" type="Type" optional="true" mayBeNull="true"></param>
	/// <param name="interfaceTypes" parameterArray="true" type="Type"></param>
	/// <returns type="Type"></returns>
	var e = Function._validateParams(arguments, [
        { name: "typeName", type: String },
        { name: "baseType", type: Type, mayBeNull: true, optional: true },
        { name: "interfaceTypes", type: Type, parameterArray: true }
    ]);
	if (e) throw e;
	if (!Type.__fullyQualifiedIdentifierRegExp.test(typeName)) throw Error.argument('typeName', Sys.Res.notATypeName);
	var parsedName;
	try {
		parsedName = eval(typeName);
	}
	catch (e) {
		throw Error.argument('typeName', Sys.Res.argumentTypeName);
	}
	if (parsedName !== this) throw Error.argument('typeName', Sys.Res.badTypeName);
	if (Sys.__registeredTypes[typeName]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, typeName));
	if ((arguments.length > 1) && (typeof (baseType) === 'undefined')) throw Error.argumentUndefined('baseType');
	if (baseType && !baseType.__class) throw Error.argument('baseType', Sys.Res.baseNotAClass);
	this.prototype.constructor = this;
	this.__typeName = typeName;
	this.__class = true;
	if (baseType) {
		this.__baseType = baseType;
		this.__basePrototypePending = true;
	}
	Sys.__upperCaseTypes[typeName.toUpperCase()] = this;
	if (interfaceTypes) {
		this.__interfaces = [];
		this.resolveInheritance();
		for (var i = 2, l = arguments.length; i < l; i++) {
			var interfaceType = arguments[i];
			if (!interfaceType.__interface) throw Error.argument('interfaceTypes[' + (i - 2) + ']', Sys.Res.notAnInterface);
			for (var methodName in interfaceType.prototype) {
				var method = interfaceType.prototype[methodName];
				if (!this.prototype[methodName]) {
					this.prototype[methodName] = method;
				}
			}
			this.__interfaces.push(interfaceType);
		}
	}
	Sys.__registeredTypes[typeName] = true;
	return this;
}
Type.prototype.registerInterface = function Type$registerInterface(typeName) {
	/// <summary locid="M:J#Type.registerInterface" />
	/// <param name="typeName" type="String"></param>
	/// <returns type="Type"></returns>
	var e = Function._validateParams(arguments, [
        { name: "typeName", type: String }
    ]);
	if (e) throw e;
	if (!Type.__fullyQualifiedIdentifierRegExp.test(typeName)) throw Error.argument('typeName', Sys.Res.notATypeName);
	var parsedName;
	try {
		parsedName = eval(typeName);
	}
	catch (e) {
		throw Error.argument('typeName', Sys.Res.argumentTypeName);
	}
	if (parsedName !== this) throw Error.argument('typeName', Sys.Res.badTypeName);
	if (Sys.__registeredTypes[typeName]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, typeName));
	Sys.__upperCaseTypes[typeName.toUpperCase()] = this;
	this.prototype.constructor = this;
	this.__typeName = typeName;
	this.__interface = true;
	Sys.__registeredTypes[typeName] = true;
	return this;
}
Type.prototype.resolveInheritance = function Type$resolveInheritance() {
	/// <summary locid="M:J#Type.resolveInheritance" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this.__basePrototypePending) {
		var baseType = this.__baseType;
		baseType.resolveInheritance();
		for (var memberName in baseType.prototype) {
			var memberValue = baseType.prototype[memberName];
			if (!this.prototype[memberName]) {
				this.prototype[memberName] = memberValue;
			}
		}
		delete this.__basePrototypePending;
	}
}
Type.getRootNamespaces = function Type$getRootNamespaces() {
	/// <summary locid="M:J#Type.getRootNamespaces" />
	/// <returns type="Array"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	return Array.clone(Sys.__rootNamespaces);
}
Type.isClass = function Type$isClass(type) {
	/// <summary locid="M:J#Type.isClass" />
	/// <param name="type" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "type", mayBeNull: true }
    ]);
	if (e) throw e;
	if ((typeof (type) === 'undefined') || (type === null)) return false;
	return !!type.__class;
}
Type.isInterface = function Type$isInterface(type) {
	/// <summary locid="M:J#Type.isInterface" />
	/// <param name="type" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "type", mayBeNull: true }
    ]);
	if (e) throw e;
	if ((typeof (type) === 'undefined') || (type === null)) return false;
	return !!type.__interface;
}
Type.isNamespace = function Type$isNamespace(object) {
	/// <summary locid="M:J#Type.isNamespace" />
	/// <param name="object" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "object", mayBeNull: true }
    ]);
	if (e) throw e;
	if ((typeof (object) === 'undefined') || (object === null)) return false;
	return !!object.__namespace;
}
Type.parse = function Type$parse(typeName, ns) {
	/// <summary locid="M:J#Type.parse" />
	/// <param name="typeName" type="String" mayBeNull="true"></param>
	/// <param name="ns" optional="true" mayBeNull="true"></param>
	/// <returns type="Type" mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "typeName", type: String, mayBeNull: true },
        { name: "ns", mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var fn;
	if (ns) {
		fn = Sys.__upperCaseTypes[ns.getName().toUpperCase() + '.' + typeName.toUpperCase()];
		return fn || null;
	}
	if (!typeName) return null;
	if (!Type.__htClasses) {
		Type.__htClasses = {};
	}
	fn = Type.__htClasses[typeName];
	if (!fn) {
		fn = eval(typeName);
		if (typeof (fn) !== 'function') throw Error.argument('typeName', Sys.Res.notATypeName);
		Type.__htClasses[typeName] = fn;
	}
	return fn;
}
Type.registerNamespace = function Type$registerNamespace(namespacePath) {
	/// <summary locid="M:J#Type.registerNamespace" />
	/// <param name="namespacePath" type="String"></param>
	var e = Function._validateParams(arguments, [
        { name: "namespacePath", type: String }
    ]);
	if (e) throw e;
	Type._registerNamespace(namespacePath);
}
Type._registerNamespace = function Type$_registerNamespace(namespacePath) {
	if (!Type.__fullyQualifiedIdentifierRegExp.test(namespacePath)) throw Error.argument('namespacePath', Sys.Res.invalidNameSpace);
	var rootObject = window;
	var namespaceParts = namespacePath.split('.');
	for (var i = 0; i < namespaceParts.length; i++) {
		var currentPart = namespaceParts[i];
		var ns = rootObject[currentPart];
		var nsType = typeof (ns);
		if ((nsType !== "undefined") && (ns !== null)) {
			if (nsType === "function") {
				throw Error.invalidOperation(String.format(Sys.Res.namespaceContainsClass, namespaceParts.splice(0, i + 1).join('.')));
			}
			if ((typeof (ns) !== "object") || (ns instanceof Array)) {
				throw Error.invalidOperation(String.format(Sys.Res.namespaceContainsNonObject, namespaceParts.splice(0, i + 1).join('.')));
			}
		}
		if (!ns) {
			ns = rootObject[currentPart] = {};
		}
		if (!ns.__namespace) {
			if ((i === 0) && (namespacePath !== "Sys")) {
				Sys.__rootNamespaces[Sys.__rootNamespaces.length] = ns;
			}
			ns.__namespace = true;
			ns.__typeName = namespaceParts.slice(0, i + 1).join('.');
			var parsedName;
			try {
				parsedName = eval(ns.__typeName);
			}
			catch (e) {
				parsedName = null;
			}
			if (parsedName !== ns) {
				delete rootObject[currentPart];
				throw Error.argument('namespacePath', Sys.Res.invalidNameSpace);
			}
			ns.getName = function ns$getName() { return this.__typeName; }
		}
		rootObject = ns;
	}
}
Type._checkDependency = function Type$_checkDependency(dependency, featureName) {
	var scripts = Type._registerScript._scripts, isDependent = (scripts ? (!!scripts[dependency]) : false);
	if ((typeof (featureName) !== 'undefined') && !isDependent) {
		throw Error.invalidOperation(String.format(Sys.Res.requiredScriptReferenceNotIncluded,
        featureName, dependency));
	}
	return isDependent;
}
Type._registerScript = function Type$_registerScript(scriptName, dependencies) {
	var scripts = Type._registerScript._scripts;
	if (!scripts) {
		Type._registerScript._scripts = scripts = {};
	}
	if (scripts[scriptName]) {
		throw Error.invalidOperation(String.format(Sys.Res.scriptAlreadyLoaded, scriptName));
	}
	scripts[scriptName] = true;
	if (dependencies) {
		for (var i = 0, l = dependencies.length; i < l; i++) {
			var dependency = dependencies[i];
			if (!Type._checkDependency(dependency)) {
				throw Error.invalidOperation(String.format(Sys.Res.scriptDependencyNotFound, scriptName, dependency));
			}
		}
	}
}
Type._registerNamespace("Sys");
Sys.__upperCaseTypes = {};
Sys.__rootNamespaces = [Sys];
Sys.__registeredTypes = {};
Sys._isInstanceOfType = function Sys$_isInstanceOfType(type, instance) {
	if (typeof (instance) === "undefined" || instance === null) return false;
	if (instance instanceof type) return true;
	var instanceType = Object.getType(instance);
	return !!(instanceType === type) ||
           (instanceType.inheritsFrom && instanceType.inheritsFrom(type)) ||
           (instanceType.implementsInterface && instanceType.implementsInterface(type));
}
Sys._getBaseMethod = function Sys$_getBaseMethod(type, instance, name) {
	if (!Sys._isInstanceOfType(type, instance)) throw Error.argumentType('instance', Object.getType(instance), type);
	var baseType = type.getBaseType();
	if (baseType) {
		var baseMethod = baseType.prototype[name];
		return (baseMethod instanceof Function) ? baseMethod : null;
	}
	return null;
}
Sys._isDomElement = function Sys$_isDomElement(obj) {
	var val = false;
	if (typeof (obj.nodeType) !== 'number') {
		var doc = obj.ownerDocument || obj.document || obj;
		if (doc != obj) {
			var w = doc.defaultView || doc.parentWindow;
			val = (w != obj);
		}
		else {
			val = (typeof (doc.body) === 'undefined');
		}
	}
	return !val;
}

Array.__typeName = 'Array';
Array.__class = true;
Array.add = Array.enqueue = function Array$enqueue(array, item) {
	/// <summary locid="M:J#Array.enqueue" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <param name="item" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true },
        { name: "item", mayBeNull: true }
    ]);
	if (e) throw e;
	array[array.length] = item;
}
Array.addRange = function Array$addRange(array, items) {
	/// <summary locid="M:J#Array.addRange" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <param name="items" type="Array" elementMayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true },
        { name: "items", type: Array, elementMayBeNull: true }
    ]);
	if (e) throw e;
	array.push.apply(array, items);
}
Array.clear = function Array$clear(array) {
	/// <summary locid="M:J#Array.clear" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true }
    ]);
	if (e) throw e;
	array.length = 0;
}
Array.clone = function Array$clone(array) {
	/// <summary locid="M:J#Array.clone" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <returns type="Array" elementMayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true }
    ]);
	if (e) throw e;
	if (array.length === 1) {
		return [array[0]];
	}
	else {
		return Array.apply(null, array);
	}
}
Array.contains = function Array$contains(array, item) {
	/// <summary locid="M:J#Array.contains" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <param name="item" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true },
        { name: "item", mayBeNull: true }
    ]);
	if (e) throw e;
	return (Sys._indexOf(array, item) >= 0);
}
Array.dequeue = function Array$dequeue(array) {
	/// <summary locid="M:J#Array.dequeue" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <returns mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true }
    ]);
	if (e) throw e;
	return array.shift();
}
Array.forEach = function Array$forEach(array, method, instance) {
	/// <summary locid="M:J#Array.forEach" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <param name="method" type="Function"></param>
	/// <param name="instance" optional="true" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true },
        { name: "method", type: Function },
        { name: "instance", mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	for (var i = 0, l = array.length; i < l; i++) {
		var elt = array[i];
		if (typeof (elt) !== 'undefined') method.call(instance, elt, i, array);
	}
}
Array.indexOf = function Array$indexOf(array, item, start) {
	/// <summary locid="M:J#Array.indexOf" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <param name="item" optional="true" mayBeNull="true"></param>
	/// <param name="start" optional="true" mayBeNull="true"></param>
	/// <returns type="Number"></returns>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true },
        { name: "item", mayBeNull: true, optional: true },
        { name: "start", mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	return Sys._indexOf(array, item, start);
}
Array.insert = function Array$insert(array, index, item) {
	/// <summary locid="M:J#Array.insert" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <param name="index" mayBeNull="true"></param>
	/// <param name="item" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true },
        { name: "index", mayBeNull: true },
        { name: "item", mayBeNull: true }
    ]);
	if (e) throw e;
	array.splice(index, 0, item);
}
Array.parse = function Array$parse(value) {
	/// <summary locid="M:J#Array.parse" />
	/// <param name="value" type="String" mayBeNull="true"></param>
	/// <returns type="Array" elementMayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "value", type: String, mayBeNull: true }
    ]);
	if (e) throw e;
	if (!value) return [];
	var v = eval(value);
	if (!Array.isInstanceOfType(v)) throw Error.argument('value', Sys.Res.arrayParseBadFormat);
	return v;
}
Array.remove = function Array$remove(array, item) {
	/// <summary locid="M:J#Array.remove" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <param name="item" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true },
        { name: "item", mayBeNull: true }
    ]);
	if (e) throw e;
	var index = Sys._indexOf(array, item);
	if (index >= 0) {
		array.splice(index, 1);
	}
	return (index >= 0);
}
Array.removeAt = function Array$removeAt(array, index) {
	/// <summary locid="M:J#Array.removeAt" />
	/// <param name="array" type="Array" elementMayBeNull="true"></param>
	/// <param name="index" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "array", type: Array, elementMayBeNull: true },
        { name: "index", mayBeNull: true }
    ]);
	if (e) throw e;
	array.splice(index, 1);
}
Sys._indexOf = function Sys$_indexOf(array, item, start) {
	if (typeof (item) === "undefined") return -1;
	var length = array.length;
	if (length !== 0) {
		start = start - 0;
		if (isNaN(start)) {
			start = 0;
		}
		else {
			if (isFinite(start)) {
				start = start - (start % 1);
			}
			if (start < 0) {
				start = Math.max(0, length + start);
			}
		}
		for (var i = start; i < length; i++) {
			if ((typeof (array[i]) !== "undefined") && (array[i] === item)) {
				return i;
			}
		}
	}
	return -1;
}
Type._registerScript._scripts = {
	"MicrosoftAjaxCore.js": true,
	"MicrosoftAjaxGlobalization.js": true,
	"MicrosoftAjaxSerialization.js": true,
	"MicrosoftAjaxComponentModel.js": true,
	"MicrosoftAjaxHistory.js": true,
	"MicrosoftAjaxNetwork.js": true,
	"MicrosoftAjaxWebServices.js": true
};

Sys.IDisposable = function Sys$IDisposable() {
	throw Error.notImplemented();
}
function Sys$IDisposable$dispose() {
	throw Error.notImplemented();
}
Sys.IDisposable.prototype = {
	dispose: Sys$IDisposable$dispose
}
Sys.IDisposable.registerInterface('Sys.IDisposable');

Sys.StringBuilder = function Sys$StringBuilder(initialText) {
	/// <summary locid="M:J#Sys.StringBuilder.#ctor" />
	/// <param name="initialText" optional="true" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "initialText", mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	this._parts = (typeof (initialText) !== 'undefined' && initialText !== null && initialText !== '') ?
        [initialText.toString()] : [];
	this._value = {};
	this._len = 0;
}
function Sys$StringBuilder$append(text) {
	/// <summary locid="M:J#Sys.StringBuilder.append" />
	/// <param name="text" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
            { name: "text", mayBeNull: true }
        ]);
	if (e) throw e;
	this._parts[this._parts.length] = text;
}
function Sys$StringBuilder$appendLine(text) {
	/// <summary locid="M:J#Sys.StringBuilder.appendLine" />
	/// <param name="text" optional="true" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
            { name: "text", mayBeNull: true, optional: true }
        ]);
	if (e) throw e;
	this._parts[this._parts.length] =
            ((typeof (text) === 'undefined') || (text === null) || (text === '')) ?
            '\r\n' : text + '\r\n';
}
function Sys$StringBuilder$clear() {
	/// <summary locid="M:J#Sys.StringBuilder.clear" />
	if (arguments.length !== 0) throw Error.parameterCount();
	this._parts = [];
	this._value = {};
	this._len = 0;
}
function Sys$StringBuilder$isEmpty() {
	/// <summary locid="M:J#Sys.StringBuilder.isEmpty" />
	/// <returns type="Boolean"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this._parts.length === 0) return true;
	return this.toString() === '';
}
function Sys$StringBuilder$toString(separator) {
	/// <summary locid="M:J#Sys.StringBuilder.toString" />
	/// <param name="separator" type="String" optional="true" mayBeNull="true"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
            { name: "separator", type: String, mayBeNull: true, optional: true }
        ]);
	if (e) throw e;
	separator = separator || '';
	var parts = this._parts;
	if (this._len !== parts.length) {
		this._value = {};
		this._len = parts.length;
	}
	var val = this._value;
	if (typeof (val[separator]) === 'undefined') {
		if (separator !== '') {
			for (var i = 0; i < parts.length; ) {
				if ((typeof (parts[i]) === 'undefined') || (parts[i] === '') || (parts[i] === null)) {
					parts.splice(i, 1);
				}
				else {
					i++;
				}
			}
		}
		val[separator] = this._parts.join(separator);
	}
	return val[separator];
}
Sys.StringBuilder.prototype = {
	append: Sys$StringBuilder$append,
	appendLine: Sys$StringBuilder$appendLine,
	clear: Sys$StringBuilder$clear,
	isEmpty: Sys$StringBuilder$isEmpty,
	toString: Sys$StringBuilder$toString
}
Sys.StringBuilder.registerClass('Sys.StringBuilder');

Sys.Browser = {};
Sys.Browser.InternetExplorer = {};
Sys.Browser.Firefox = {};
Sys.Browser.Safari = {};
Sys.Browser.Opera = {};
Sys.Browser.agent = null;
Sys.Browser.hasDebuggerStatement = false;
Sys.Browser.name = navigator.appName;
Sys.Browser.version = parseFloat(navigator.appVersion);
Sys.Browser.documentMode = 0;
if (navigator.userAgent.indexOf(' MSIE ') > -1) {
	Sys.Browser.agent = Sys.Browser.InternetExplorer;
	Sys.Browser.version = parseFloat(navigator.userAgent.match(/MSIE (\d+\.\d+)/)[1]);
	if (Sys.Browser.version >= 8) {
		if (document.documentMode >= 7) {
			Sys.Browser.documentMode = document.documentMode;
		}
	}
	Sys.Browser.hasDebuggerStatement = true;
}
else if (navigator.userAgent.indexOf(' Firefox/') > -1) {
	Sys.Browser.agent = Sys.Browser.Firefox;
	Sys.Browser.version = parseFloat(navigator.userAgent.match(/ Firefox\/(\d+\.\d+)/)[1]);
	Sys.Browser.name = 'Firefox';
	Sys.Browser.hasDebuggerStatement = true;
}
else if (navigator.userAgent.indexOf(' AppleWebKit/') > -1) {
	Sys.Browser.agent = Sys.Browser.Safari;
	Sys.Browser.version = parseFloat(navigator.userAgent.match(/ AppleWebKit\/(\d+(\.\d+)?)/)[1]);
	Sys.Browser.name = 'Safari';
}
else if (navigator.userAgent.indexOf('Opera/') > -1) {
	Sys.Browser.agent = Sys.Browser.Opera;
}

Sys.EventArgs = function Sys$EventArgs() {
	/// <summary locid="M:J#Sys.EventArgs.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
}
Sys.EventArgs.registerClass('Sys.EventArgs');
Sys.EventArgs.Empty = new Sys.EventArgs();

Sys.CancelEventArgs = function Sys$CancelEventArgs() {
	/// <summary locid="M:J#Sys.CancelEventArgs.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	Sys.CancelEventArgs.initializeBase(this);
	this._cancel = false;
}
function Sys$CancelEventArgs$get_cancel() {
	/// <value type="Boolean" locid="P:J#Sys.CancelEventArgs.cancel"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._cancel;
}
function Sys$CancelEventArgs$set_cancel(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Boolean}]);
	if (e) throw e;
	this._cancel = value;
}
Sys.CancelEventArgs.prototype = {
	get_cancel: Sys$CancelEventArgs$get_cancel,
	set_cancel: Sys$CancelEventArgs$set_cancel
}
Sys.CancelEventArgs.registerClass('Sys.CancelEventArgs', Sys.EventArgs);
Type.registerNamespace('Sys.UI');

Sys._Debug = function Sys$_Debug() {
	/// <summary locid="M:J#Sys.Debug.#ctor" />
	/// <field name="isDebug" type="Boolean" locid="F:J#Sys.Debug.isDebug"></field>
	if (arguments.length !== 0) throw Error.parameterCount();
}
function Sys$_Debug$_appendConsole(text) {
	if ((typeof (Debug) !== 'undefined') && Debug.writeln) {
		Debug.writeln(text);
	}
	if (window.console && window.console.log) {
		window.console.log(text);
	}
	if (window.opera) {
		window.opera.postError(text);
	}
	if (window.debugService) {
		window.debugService.trace(text);
	}
}
function Sys$_Debug$_appendTrace(text) {
	var traceElement = document.getElementById('TraceConsole');
	if (traceElement && (traceElement.tagName.toUpperCase() === 'TEXTAREA')) {
		traceElement.value += text + '\n';
	}
}
function Sys$_Debug$assert(condition, message, displayCaller) {
	/// <summary locid="M:J#Sys.Debug.assert" />
	/// <param name="condition" type="Boolean"></param>
	/// <param name="message" type="String" optional="true" mayBeNull="true"></param>
	/// <param name="displayCaller" type="Boolean" optional="true"></param>
	var e = Function._validateParams(arguments, [
            { name: "condition", type: Boolean },
            { name: "message", type: String, mayBeNull: true, optional: true },
            { name: "displayCaller", type: Boolean, optional: true }
        ]);
	if (e) throw e;
	if (!condition) {
		message = (displayCaller && this.assert.caller) ?
                String.format(Sys.Res.assertFailedCaller, message, this.assert.caller) :
                String.format(Sys.Res.assertFailed, message);
		if (confirm(String.format(Sys.Res.breakIntoDebugger, message))) {
			this.fail(message);
		}
	}
}
function Sys$_Debug$clearTrace() {
	/// <summary locid="M:J#Sys.Debug.clearTrace" />
	if (arguments.length !== 0) throw Error.parameterCount();
	var traceElement = document.getElementById('TraceConsole');
	if (traceElement && (traceElement.tagName.toUpperCase() === 'TEXTAREA')) {
		traceElement.value = '';
	}
}
function Sys$_Debug$fail(message) {
	/// <summary locid="M:J#Sys.Debug.fail" />
	/// <param name="message" type="String" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
            { name: "message", type: String, mayBeNull: true }
        ]);
	if (e) throw e;
	this._appendConsole(message);
	if (Sys.Browser.hasDebuggerStatement) {
		eval('debugger');
	}
}
function Sys$_Debug$trace(text) {
	/// <summary locid="M:J#Sys.Debug.trace" />
	/// <param name="text"></param>
	var e = Function._validateParams(arguments, [
            { name: "text" }
        ]);
	if (e) throw e;
	this._appendConsole(text);
	this._appendTrace(text);
}
function Sys$_Debug$traceDump(object, name) {
	/// <summary locid="M:J#Sys.Debug.traceDump" />
	/// <param name="object" mayBeNull="true"></param>
	/// <param name="name" type="String" mayBeNull="true" optional="true"></param>
	var e = Function._validateParams(arguments, [
            { name: "object", mayBeNull: true },
            { name: "name", type: String, mayBeNull: true, optional: true }
        ]);
	if (e) throw e;
	var text = this._traceDump(object, name, true);
}
function Sys$_Debug$_traceDump(object, name, recursive, indentationPadding, loopArray) {
	name = name ? name : 'traceDump';
	indentationPadding = indentationPadding ? indentationPadding : '';
	if (object === null) {
		this.trace(indentationPadding + name + ': null');
		return;
	}
	switch (typeof (object)) {
		case 'undefined':
			this.trace(indentationPadding + name + ': Undefined');
			break;
		case 'number': case 'string': case 'boolean':
			this.trace(indentationPadding + name + ': ' + object);
			break;
		default:
			if (Date.isInstanceOfType(object) || RegExp.isInstanceOfType(object)) {
				this.trace(indentationPadding + name + ': ' + object.toString());
				break;
			}
			if (!loopArray) {
				loopArray = [];
			}
			else if (Array.contains(loopArray, object)) {
				this.trace(indentationPadding + name + ': ...');
				return;
			}
			Array.add(loopArray, object);
			if ((object == window) || (object === document) ||
                    (window.HTMLElement && (object instanceof HTMLElement)) ||
                    (typeof (object.nodeName) === 'string')) {
				var tag = object.tagName ? object.tagName : 'DomElement';
				if (object.id) {
					tag += ' - ' + object.id;
				}
				this.trace(indentationPadding + name + ' {' + tag + '}');
			}
			else {
				var typeName = Object.getTypeName(object);
				this.trace(indentationPadding + name + (typeof (typeName) === 'string' ? ' {' + typeName + '}' : ''));
				if ((indentationPadding === '') || recursive) {
					indentationPadding += "    ";
					var i, length, properties, p, v;
					if (Array.isInstanceOfType(object)) {
						length = object.length;
						for (i = 0; i < length; i++) {
							this._traceDump(object[i], '[' + i + ']', recursive, indentationPadding, loopArray);
						}
					}
					else {
						for (p in object) {
							v = object[p];
							if (!Function.isInstanceOfType(v)) {
								this._traceDump(v, p, recursive, indentationPadding, loopArray);
							}
						}
					}
				}
			}
			Array.remove(loopArray, object);
	}
}
Sys._Debug.prototype = {
	_appendConsole: Sys$_Debug$_appendConsole,
	_appendTrace: Sys$_Debug$_appendTrace,
	assert: Sys$_Debug$assert,
	clearTrace: Sys$_Debug$clearTrace,
	fail: Sys$_Debug$fail,
	trace: Sys$_Debug$trace,
	traceDump: Sys$_Debug$traceDump,
	_traceDump: Sys$_Debug$_traceDump
}
Sys._Debug.registerClass('Sys._Debug');
Sys.Debug = new Sys._Debug();
Sys.Debug.isDebug = true;

function Sys$Enum$parse(value, ignoreCase) {
	/// <summary locid="M:J#Sys.Enum.parse" />
	/// <param name="value" type="String"></param>
	/// <param name="ignoreCase" type="Boolean" optional="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "value", type: String },
        { name: "ignoreCase", type: Boolean, optional: true }
    ]);
	if (e) throw e;
	var values, parsed, val;
	if (ignoreCase) {
		values = this.__lowerCaseValues;
		if (!values) {
			this.__lowerCaseValues = values = {};
			var prototype = this.prototype;
			for (var name in prototype) {
				values[name.toLowerCase()] = prototype[name];
			}
		}
	}
	else {
		values = this.prototype;
	}
	if (!this.__flags) {
		val = (ignoreCase ? value.toLowerCase() : value);
		parsed = values[val.trim()];
		if (typeof (parsed) !== 'number') throw Error.argument('value', String.format(Sys.Res.enumInvalidValue, value, this.__typeName));
		return parsed;
	}
	else {
		var parts = (ignoreCase ? value.toLowerCase() : value).split(',');
		var v = 0;
		for (var i = parts.length - 1; i >= 0; i--) {
			var part = parts[i].trim();
			parsed = values[part];
			if (typeof (parsed) !== 'number') throw Error.argument('value', String.format(Sys.Res.enumInvalidValue, value.split(',')[i].trim(), this.__typeName));
			v |= parsed;
		}
		return v;
	}
}
function Sys$Enum$toString(value) {
	/// <summary locid="M:J#Sys.Enum.toString" />
	/// <param name="value" optional="true" mayBeNull="true"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "value", mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	if ((typeof (value) === 'undefined') || (value === null)) return this.__string;
	if ((typeof (value) != 'number') || ((value % 1) !== 0)) throw Error.argumentType('value', Object.getType(value), this);
	var values = this.prototype;
	var i;
	if (!this.__flags || (value === 0)) {
		for (i in values) {
			if (values[i] === value) {
				return i;
			}
		}
	}
	else {
		var sorted = this.__sortedValues;
		if (!sorted) {
			sorted = [];
			for (i in values) {
				sorted[sorted.length] = { key: i, value: values[i] };
			}
			sorted.sort(function (a, b) {
				return a.value - b.value;
			});
			this.__sortedValues = sorted;
		}
		var parts = [];
		var v = value;
		for (i = sorted.length - 1; i >= 0; i--) {
			var kvp = sorted[i];
			var vali = kvp.value;
			if (vali === 0) continue;
			if ((vali & value) === vali) {
				parts[parts.length] = kvp.key;
				v -= vali;
				if (v === 0) break;
			}
		}
		if (parts.length && v === 0) return parts.reverse().join(', ');
	}
	throw Error.argumentOutOfRange('value', value, String.format(Sys.Res.enumInvalidValue, value, this.__typeName));
}
Type.prototype.registerEnum = function Type$registerEnum(name, flags) {
	/// <summary locid="M:J#Sys.UI.LineType.#ctor" />
	/// <param name="name" type="String"></param>
	/// <param name="flags" type="Boolean" optional="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "name", type: String },
        { name: "flags", type: Boolean, optional: true }
    ]);
	if (e) throw e;
	if (!Type.__fullyQualifiedIdentifierRegExp.test(name)) throw Error.argument('name', Sys.Res.notATypeName);
	var parsedName;
	try {
		parsedName = eval(name);
	}
	catch (e) {
		throw Error.argument('name', Sys.Res.argumentTypeName);
	}
	if (parsedName !== this) throw Error.argument('name', Sys.Res.badTypeName);
	if (Sys.__registeredTypes[name]) throw Error.invalidOperation(String.format(Sys.Res.typeRegisteredTwice, name));
	for (var j in this.prototype) {
		var val = this.prototype[j];
		if (!Type.__identifierRegExp.test(j)) throw Error.invalidOperation(String.format(Sys.Res.enumInvalidValueName, j));
		if (typeof (val) !== 'number' || (val % 1) !== 0) throw Error.invalidOperation(Sys.Res.enumValueNotInteger);
		if (typeof (this[j]) !== 'undefined') throw Error.invalidOperation(String.format(Sys.Res.enumReservedName, j));
	}
	Sys.__upperCaseTypes[name.toUpperCase()] = this;
	for (var i in this.prototype) {
		this[i] = this.prototype[i];
	}
	this.__typeName = name;
	this.parse = Sys$Enum$parse;
	this.__string = this.toString();
	this.toString = Sys$Enum$toString;
	this.__flags = flags;
	this.__enum = true;
	Sys.__registeredTypes[name] = true;
}
Type.isEnum = function Type$isEnum(type) {
	/// <summary locid="M:J#Type.isEnum" />
	/// <param name="type" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "type", mayBeNull: true }
    ]);
	if (e) throw e;
	if ((typeof (type) === 'undefined') || (type === null)) return false;
	return !!type.__enum;
}
Type.isFlags = function Type$isFlags(type) {
	/// <summary locid="M:J#Type.isFlags" />
	/// <param name="type" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "type", mayBeNull: true }
    ]);
	if (e) throw e;
	if ((typeof (type) === 'undefined') || (type === null)) return false;
	return !!type.__flags;
}
Sys.CollectionChange = function Sys$CollectionChange(action, newItems, newStartingIndex, oldItems, oldStartingIndex) {
	/// <summary locid="M:J#Sys.CollectionChange.#ctor" />
	/// <param name="action" type="Sys.NotifyCollectionChangedAction"></param>
	/// <param name="newItems" optional="true" mayBeNull="true"></param>
	/// <param name="newStartingIndex" type="Number" integer="true" optional="true" mayBeNull="true"></param>
	/// <param name="oldItems" optional="true" mayBeNull="true"></param>
	/// <param name="oldStartingIndex" type="Number" integer="true" optional="true" mayBeNull="true"></param>
	/// <field name="action" type="Sys.NotifyCollectionChangedAction" locid="F:J#Sys.CollectionChange.action"></field>
	/// <field name="newItems" type="Array" mayBeNull="true" elementMayBeNull="true" locid="F:J#Sys.CollectionChange.newItems"></field>
	/// <field name="newStartingIndex" type="Number" integer="true" locid="F:J#Sys.CollectionChange.newStartingIndex"></field>
	/// <field name="oldItems" type="Array" mayBeNull="true" elementMayBeNull="true" locid="F:J#Sys.CollectionChange.oldItems"></field>
	/// <field name="oldStartingIndex" type="Number" integer="true" locid="F:J#Sys.CollectionChange.oldStartingIndex"></field>
	var e = Function._validateParams(arguments, [
        { name: "action", type: Sys.NotifyCollectionChangedAction },
        { name: "newItems", mayBeNull: true, optional: true },
        { name: "newStartingIndex", type: Number, mayBeNull: true, integer: true, optional: true },
        { name: "oldItems", mayBeNull: true, optional: true },
        { name: "oldStartingIndex", type: Number, mayBeNull: true, integer: true, optional: true }
    ]);
	if (e) throw e;
	this.action = action;
	if (newItems) {
		if (!(newItems instanceof Array)) {
			newItems = [newItems];
		}
	}
	this.newItems = newItems || null;
	if (typeof newStartingIndex !== "number") {
		newStartingIndex = -1;
	}
	this.newStartingIndex = newStartingIndex;
	if (oldItems) {
		if (!(oldItems instanceof Array)) {
			oldItems = [oldItems];
		}
	}
	this.oldItems = oldItems || null;
	if (typeof oldStartingIndex !== "number") {
		oldStartingIndex = -1;
	}
	this.oldStartingIndex = oldStartingIndex;
}
Sys.CollectionChange.registerClass("Sys.CollectionChange");
Sys.NotifyCollectionChangedAction = function Sys$NotifyCollectionChangedAction() {
	/// <summary locid="M:J#Sys.NotifyCollectionChangedAction.#ctor" />
	/// <field name="add" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.add"></field>
	/// <field name="remove" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.remove"></field>
	/// <field name="reset" type="Number" integer="true" static="true" locid="F:J#Sys.NotifyCollectionChangedAction.reset"></field>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
Sys.NotifyCollectionChangedAction.prototype = {
	add: 0,
	remove: 1,
	reset: 2
}
Sys.NotifyCollectionChangedAction.registerEnum('Sys.NotifyCollectionChangedAction');
Sys.NotifyCollectionChangedEventArgs = function Sys$NotifyCollectionChangedEventArgs(changes) {
	/// <summary locid="M:J#Sys.NotifyCollectionChangedEventArgs.#ctor" />
	/// <param name="changes" type="Array" elementType="Sys.CollectionChange"></param>
	var e = Function._validateParams(arguments, [
        { name: "changes", type: Array, elementType: Sys.CollectionChange }
    ]);
	if (e) throw e;
	this._changes = changes;
	Sys.NotifyCollectionChangedEventArgs.initializeBase(this);
}
function Sys$NotifyCollectionChangedEventArgs$get_changes() {
	/// <value type="Array" elementType="Sys.CollectionChange" locid="P:J#Sys.NotifyCollectionChangedEventArgs.changes"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._changes || [];
}
Sys.NotifyCollectionChangedEventArgs.prototype = {
	get_changes: Sys$NotifyCollectionChangedEventArgs$get_changes
}
Sys.NotifyCollectionChangedEventArgs.registerClass("Sys.NotifyCollectionChangedEventArgs", Sys.EventArgs);
Sys.Observer = function Sys$Observer() {
	throw Error.invalidOperation();
}
Sys.Observer.registerClass("Sys.Observer");
Sys.Observer.makeObservable = function Sys$Observer$makeObservable(target) {
	/// <summary locid="M:J#Sys.Observer.makeObservable" />
	/// <param name="target" mayBeNull="false"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "target" }
    ]);
	if (e) throw e;
	var isArray = target instanceof Array,
        o = Sys.Observer;
	Sys.Observer._ensureObservable(target);
	if (target.setValue === o._observeMethods.setValue) return target;
	o._addMethods(target, o._observeMethods);
	if (isArray) {
		o._addMethods(target, o._arrayMethods);
	}
	return target;
}
Sys.Observer._ensureObservable = function Sys$Observer$_ensureObservable(target) {
	var type = typeof target;
	if ((type === "string") || (type === "number") || (type === "boolean") || (type === "date")) {
		throw Error.invalidOperation(String.format(Sys.Res.notObservable, type));
	}
}
Sys.Observer._addMethods = function Sys$Observer$_addMethods(target, methods) {
	for (var m in methods) {
		if (target[m] && (target[m] !== methods[m])) {
			throw Error.invalidOperation(String.format(Sys.Res.observableConflict, m));
		}
		target[m] = methods[m];
	}
}
Sys.Observer._addEventHandler = function Sys$Observer$_addEventHandler(target, eventName, handler) {
	Sys.Observer._getContext(target, true).events._addHandler(eventName, handler);
}
Sys.Observer.addEventHandler = function Sys$Observer$addEventHandler(target, eventName, handler) {
	/// <summary locid="M:J#Sys.Observer.addEventHandler" />
	/// <param name="target"></param>
	/// <param name="eventName" type="String"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" },
        { name: "eventName", type: String },
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	Sys.Observer._addEventHandler(target, eventName, handler);
}
Sys.Observer._removeEventHandler = function Sys$Observer$_removeEventHandler(target, eventName, handler) {
	Sys.Observer._getContext(target, true).events._removeHandler(eventName, handler);
}
Sys.Observer.removeEventHandler = function Sys$Observer$removeEventHandler(target, eventName, handler) {
	/// <summary locid="M:J#Sys.Observer.removeEventHandler" />
	/// <param name="target"></param>
	/// <param name="eventName" type="String"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" },
        { name: "eventName", type: String },
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	Sys.Observer._removeEventHandler(target, eventName, handler);
}
Sys.Observer.raiseEvent = function Sys$Observer$raiseEvent(target, eventName, eventArgs) {
	/// <summary locid="M:J#Sys.Observer.raiseEvent" />
	/// <param name="target"></param>
	/// <param name="eventName" type="String"></param>
	/// <param name="eventArgs" type="Sys.EventArgs"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" },
        { name: "eventName", type: String },
        { name: "eventArgs", type: Sys.EventArgs }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	var ctx = Sys.Observer._getContext(target);
	if (!ctx) return;
	var handler = ctx.events.getHandler(eventName);
	if (handler) {
		handler(target, eventArgs);
	}
}
Sys.Observer.addPropertyChanged = function Sys$Observer$addPropertyChanged(target, handler) {
	/// <summary locid="M:J#Sys.Observer.addPropertyChanged" />
	/// <param name="target" mayBeNull="false"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" },
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	Sys.Observer._addEventHandler(target, "propertyChanged", handler);
}
Sys.Observer.removePropertyChanged = function Sys$Observer$removePropertyChanged(target, handler) {
	/// <summary locid="M:J#Sys.Observer.removePropertyChanged" />
	/// <param name="target" mayBeNull="false"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" },
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	Sys.Observer._removeEventHandler(target, "propertyChanged", handler);
}
Sys.Observer.beginUpdate = function Sys$Observer$beginUpdate(target) {
	/// <summary locid="M:J#Sys.Observer.beginUpdate" />
	/// <param name="target" mayBeNull="false"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	Sys.Observer._getContext(target, true).updating = true;
}
Sys.Observer.endUpdate = function Sys$Observer$endUpdate(target) {
	/// <summary locid="M:J#Sys.Observer.endUpdate" />
	/// <param name="target" mayBeNull="false"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	var ctx = Sys.Observer._getContext(target);
	if (!ctx || !ctx.updating) return;
	ctx.updating = false;
	var dirty = ctx.dirty;
	ctx.dirty = false;
	if (dirty) {
		if (target instanceof Array) {
			var changes = ctx.changes;
			ctx.changes = null;
			Sys.Observer.raiseCollectionChanged(target, changes);
		}
		Sys.Observer.raisePropertyChanged(target, "");
	}
}
Sys.Observer.isUpdating = function Sys$Observer$isUpdating(target) {
	/// <summary locid="M:J#Sys.Observer.isUpdating" />
	/// <param name="target" mayBeNull="false"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "target" }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	var ctx = Sys.Observer._getContext(target);
	return ctx ? ctx.updating : false;
}
Sys.Observer._setValue = function Sys$Observer$_setValue(target, propertyName, value) {
	var getter, setter, mainTarget = target, path = propertyName.split('.');
	for (var i = 0, l = (path.length - 1); i < l; i++) {
		var name = path[i];
		getter = target["get_" + name];
		if (typeof (getter) === "function") {
			target = getter.call(target);
		}
		else {
			target = target[name];
		}
		var type = typeof (target);
		if ((target === null) || (type === "undefined")) {
			throw Error.invalidOperation(String.format(Sys.Res.nullReferenceInPath, propertyName));
		}
	}
	var currentValue, lastPath = path[l];
	getter = target["get_" + lastPath];
	setter = target["set_" + lastPath];
	if (typeof (getter) === 'function') {
		currentValue = getter.call(target);
	}
	else {
		currentValue = target[lastPath];
	}
	if (typeof (setter) === 'function') {
		setter.call(target, value);
	}
	else {
		target[lastPath] = value;
	}
	if (currentValue !== value) {
		var ctx = Sys.Observer._getContext(mainTarget);
		if (ctx && ctx.updating) {
			ctx.dirty = true;
			return;
		};
		Sys.Observer.raisePropertyChanged(mainTarget, path[0]);
	}
}
Sys.Observer.setValue = function Sys$Observer$setValue(target, propertyName, value) {
	/// <summary locid="M:J#Sys.Observer.setValue" />
	/// <param name="target" mayBeNull="false"></param>
	/// <param name="propertyName" type="String"></param>
	/// <param name="value" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" },
        { name: "propertyName", type: String },
        { name: "value", mayBeNull: true }
    ]);
	if (e) throw e;
	Sys.Observer._ensureObservable(target);
	Sys.Observer._setValue(target, propertyName, value);
}
Sys.Observer.raisePropertyChanged = function Sys$Observer$raisePropertyChanged(target, propertyName) {
	/// <summary locid="M:J#Sys.Observer.raisePropertyChanged" />
	/// <param name="target" mayBeNull="false"></param>
	/// <param name="propertyName" type="String"></param>
	Sys.Observer.raiseEvent(target, "propertyChanged", new Sys.PropertyChangedEventArgs(propertyName));
}
Sys.Observer.addCollectionChanged = function Sys$Observer$addCollectionChanged(target, handler) {
	/// <summary locid="M:J#Sys.Observer.addCollectionChanged" />
	/// <param name="target" type="Array" elementMayBeNull="true"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "target", type: Array, elementMayBeNull: true },
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	Sys.Observer._addEventHandler(target, "collectionChanged", handler);
}
Sys.Observer.removeCollectionChanged = function Sys$Observer$removeCollectionChanged(target, handler) {
	/// <summary locid="M:J#Sys.Observer.removeCollectionChanged" />
	/// <param name="target" type="Array" elementMayBeNull="true"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "target", type: Array, elementMayBeNull: true },
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	Sys.Observer._removeEventHandler(target, "collectionChanged", handler);
}
Sys.Observer._collectionChange = function Sys$Observer$_collectionChange(target, change) {
	var ctx = Sys.Observer._getContext(target);
	if (ctx && ctx.updating) {
		ctx.dirty = true;
		var changes = ctx.changes;
		if (!changes) {
			ctx.changes = changes = [change];
		}
		else {
			changes.push(change);
		}
	}
	else {
		Sys.Observer.raiseCollectionChanged(target, [change]);
		Sys.Observer.raisePropertyChanged(target, 'length');
	}
}
Sys.Observer.add = function Sys$Observer$add(target, item) {
	/// <summary locid="M:J#Sys.Observer.add" />
	/// <param name="target" type="Array" elementMayBeNull="true"></param>
	/// <param name="item" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "target", type: Array, elementMayBeNull: true },
        { name: "item", mayBeNull: true }
    ]);
	if (e) throw e;
	var change = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [item], target.length);
	Array.add(target, item);
	Sys.Observer._collectionChange(target, change);
}
Sys.Observer.addRange = function Sys$Observer$addRange(target, items) {
	/// <summary locid="M:J#Sys.Observer.addRange" />
	/// <param name="target" type="Array" elementMayBeNull="true"></param>
	/// <param name="items" type="Array" elementMayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "target", type: Array, elementMayBeNull: true },
        { name: "items", type: Array, elementMayBeNull: true }
    ]);
	if (e) throw e;
	var change = new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, items, target.length);
	Array.addRange(target, items);
	Sys.Observer._collectionChange(target, change);
}
Sys.Observer.clear = function Sys$Observer$clear(target) {
	/// <summary locid="M:J#Sys.Observer.clear" />
	/// <param name="target" type="Array" elementMayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "target", type: Array, elementMayBeNull: true }
    ]);
	if (e) throw e;
	var oldItems = Array.clone(target);
	Array.clear(target);
	Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.reset, null, -1, oldItems, 0));
}
Sys.Observer.insert = function Sys$Observer$insert(target, index, item) {
	/// <summary locid="M:J#Sys.Observer.insert" />
	/// <param name="target" type="Array" elementMayBeNull="true"></param>
	/// <param name="index" type="Number" integer="true"></param>
	/// <param name="item" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "target", type: Array, elementMayBeNull: true },
        { name: "index", type: Number, integer: true },
        { name: "item", mayBeNull: true }
    ]);
	if (e) throw e;
	Array.insert(target, index, item);
	Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.add, [item], index));
}
Sys.Observer.remove = function Sys$Observer$remove(target, item) {
	/// <summary locid="M:J#Sys.Observer.remove" />
	/// <param name="target" type="Array" elementMayBeNull="true"></param>
	/// <param name="item" mayBeNull="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "target", type: Array, elementMayBeNull: true },
        { name: "item", mayBeNull: true }
    ]);
	if (e) throw e;
	var index = Array.indexOf(target, item);
	if (index !== -1) {
		Array.remove(target, item);
		Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [item], index));
		return true;
	}
	return false;
}
Sys.Observer.removeAt = function Sys$Observer$removeAt(target, index) {
	/// <summary locid="M:J#Sys.Observer.removeAt" />
	/// <param name="target" type="Array" elementMayBeNull="true"></param>
	/// <param name="index" type="Number" integer="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "target", type: Array, elementMayBeNull: true },
        { name: "index", type: Number, integer: true }
    ]);
	if (e) throw e;
	if ((index > -1) && (index < target.length)) {
		var item = target[index];
		Array.removeAt(target, index);
		Sys.Observer._collectionChange(target, new Sys.CollectionChange(Sys.NotifyCollectionChangedAction.remove, null, -1, [item], index));
	}
}
Sys.Observer.raiseCollectionChanged = function Sys$Observer$raiseCollectionChanged(target, changes) {
	/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
	/// <param name="target"></param>
	/// <param name="changes" type="Array" elementType="Sys.CollectionChange"></param>
	Sys.Observer.raiseEvent(target, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(changes));
}
Sys.Observer._observeMethods = {
	add_propertyChanged: function (handler) {
		Sys.Observer._addEventHandler(this, "propertyChanged", handler);
	},
	remove_propertyChanged: function (handler) {
		Sys.Observer._removeEventHandler(this, "propertyChanged", handler);
	},
	addEventHandler: function (eventName, handler) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="eventName" type="String"></param>
		/// <param name="handler" type="Function"></param>
		var e = Function._validateParams(arguments, [
            { name: "eventName", type: String },
            { name: "handler", type: Function }
        ]);
		if (e) throw e;
		Sys.Observer._addEventHandler(this, eventName, handler);
	},
	removeEventHandler: function (eventName, handler) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="eventName" type="String"></param>
		/// <param name="handler" type="Function"></param>
		var e = Function._validateParams(arguments, [
            { name: "eventName", type: String },
            { name: "handler", type: Function }
        ]);
		if (e) throw e;
		Sys.Observer._removeEventHandler(this, eventName, handler);
	},
	get_isUpdating: function () {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <returns type="Boolean"></returns>
		return Sys.Observer.isUpdating(this);
	},
	beginUpdate: function () {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		Sys.Observer.beginUpdate(this);
	},
	endUpdate: function () {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		Sys.Observer.endUpdate(this);
	},
	setValue: function (name, value) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="name" type="String"></param>
		/// <param name="value" mayBeNull="true"></param>
		var e = Function._validateParams(arguments, [
            { name: "name", type: String },
            { name: "value", mayBeNull: true }
        ]);
		if (e) throw e;
		Sys.Observer._setValue(this, name, value);
	},
	raiseEvent: function (eventName, eventArgs) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="eventName" type="String"></param>
		/// <param name="eventArgs" type="Sys.EventArgs"></param>
		Sys.Observer.raiseEvent(this, eventName, eventArgs);
	},
	raisePropertyChanged: function (name) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="name" type="String"></param>
		Sys.Observer.raiseEvent(this, "propertyChanged", new Sys.PropertyChangedEventArgs(name));
	}
}
Sys.Observer._arrayMethods = {
	add_collectionChanged: function (handler) {
		Sys.Observer._addEventHandler(this, "collectionChanged", handler);
	},
	remove_collectionChanged: function (handler) {
		Sys.Observer._removeEventHandler(this, "collectionChanged", handler);
	},
	add: function (item) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="item" mayBeNull="true"></param>
		Sys.Observer.add(this, item);
	},
	addRange: function (items) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="items" type="Array" elementMayBeNull="true"></param>
		Sys.Observer.addRange(this, items);
	},
	clear: function () {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		Sys.Observer.clear(this);
	},
	insert: function (index, item) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="index" type="Number" integer="true"></param>
		/// <param name="item" mayBeNull="true"></param>
		Sys.Observer.insert(this, index, item);
	},
	remove: function (item) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="item" mayBeNull="true"></param>
		/// <returns type="Boolean"></returns>
		return Sys.Observer.remove(this, item);
	},
	removeAt: function (index) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="index" type="Number" integer="true"></param>
		Sys.Observer.removeAt(this, index);
	},
	raiseCollectionChanged: function (changes) {
		/// <summary locid="M:J#Sys.Observer.raiseCollectionChanged" />
		/// <param name="changes" type="Array" elementType="Sys.CollectionChange"></param>
		Sys.Observer.raiseEvent(this, "collectionChanged", new Sys.NotifyCollectionChangedEventArgs(changes));
	}
}
Sys.Observer._getContext = function Sys$Observer$_getContext(obj, create) {
	var ctx = obj._observerContext;
	if (ctx) return ctx();
	if (create) {
		return (obj._observerContext = Sys.Observer._createContext())();
	}
	return null;
}
Sys.Observer._createContext = function Sys$Observer$_createContext() {
	var ctx = {
		events: new Sys.EventHandlerList()
	};
	return function () {
		return ctx;
	}
}
Date._appendPreOrPostMatch = function Date$_appendPreOrPostMatch(preMatch, strBuilder) {
	var quoteCount = 0;
	var escaped = false;
	for (var i = 0, il = preMatch.length; i < il; i++) {
		var c = preMatch.charAt(i);
		switch (c) {
			case '\'':
				if (escaped) strBuilder.append("'");
				else quoteCount++;
				escaped = false;
				break;
			case '\\':
				if (escaped) strBuilder.append("\\");
				escaped = !escaped;
				break;
			default:
				strBuilder.append(c);
				escaped = false;
				break;
		}
	}
	return quoteCount;
}
Date._expandFormat = function Date$_expandFormat(dtf, format) {
	if (!format) {
		format = "F";
	}
	var len = format.length;
	if (len === 1) {
		switch (format) {
			case "d":
				return dtf.ShortDatePattern;
			case "D":
				return dtf.LongDatePattern;
			case "t":
				return dtf.ShortTimePattern;
			case "T":
				return dtf.LongTimePattern;
			case "f":
				return dtf.LongDatePattern + " " + dtf.ShortTimePattern;
			case "F":
				return dtf.FullDateTimePattern;
			case "M": case "m":
				return dtf.MonthDayPattern;
			case "s":
				return dtf.SortableDateTimePattern;
			case "Y": case "y":
				return dtf.YearMonthPattern;
			default:
				throw Error.format(Sys.Res.formatInvalidString);
		}
	}
	else if ((len === 2) && (format.charAt(0) === "%")) {
		format = format.charAt(1);
	}
	return format;
}
Date._expandYear = function Date$_expandYear(dtf, year) {
	var now = new Date(),
        era = Date._getEra(now);
	if (year < 100) {
		var curr = Date._getEraYear(now, dtf, era);
		year += curr - (curr % 100);
		if (year > dtf.Calendar.TwoDigitYearMax) {
			year -= 100;
		}
	}
	return year;
}
Date._getEra = function Date$_getEra(date, eras) {
	if (!eras) return 0;
	var start, ticks = date.getTime();
	for (var i = 0, l = eras.length; i < l; i += 4) {
		start = eras[i + 2];
		if ((start === null) || (ticks >= start)) {
			return i;
		}
	}
	return 0;
}
Date._getEraYear = function Date$_getEraYear(date, dtf, era, sortable) {
	var year = date.getFullYear();
	if (!sortable && dtf.eras) {
		year -= dtf.eras[era + 3];
	}
	return year;
}
Date._getParseRegExp = function Date$_getParseRegExp(dtf, format) {
	if (!dtf._parseRegExp) {
		dtf._parseRegExp = {};
	}
	else if (dtf._parseRegExp[format]) {
		return dtf._parseRegExp[format];
	}
	var expFormat = Date._expandFormat(dtf, format);
	expFormat = expFormat.replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1");
	var regexp = new Sys.StringBuilder("^");
	var groups = [];
	var index = 0;
	var quoteCount = 0;
	var tokenRegExp = Date._getTokenRegExp();
	var match;
	while ((match = tokenRegExp.exec(expFormat)) !== null) {
		var preMatch = expFormat.slice(index, match.index);
		index = tokenRegExp.lastIndex;
		quoteCount += Date._appendPreOrPostMatch(preMatch, regexp);
		if ((quoteCount % 2) === 1) {
			regexp.append(match[0]);
			continue;
		}
		switch (match[0]) {
			case 'dddd': case 'ddd':
			case 'MMMM': case 'MMM':
			case 'gg': case 'g':
				regexp.append("(\\D+)");
				break;
			case 'tt': case 't':
				regexp.append("(\\D*)");
				break;
			case 'yyyy':
				regexp.append("(\\d{4})");
				break;
			case 'fff':
				regexp.append("(\\d{3})");
				break;
			case 'ff':
				regexp.append("(\\d{2})");
				break;
			case 'f':
				regexp.append("(\\d)");
				break;
			case 'dd': case 'd':
			case 'MM': case 'M':
			case 'yy': case 'y':
			case 'HH': case 'H':
			case 'hh': case 'h':
			case 'mm': case 'm':
			case 'ss': case 's':
				regexp.append("(\\d\\d?)");
				break;
			case 'zzz':
				regexp.append("([+-]?\\d\\d?:\\d{2})");
				break;
			case 'zz': case 'z':
				regexp.append("([+-]?\\d\\d?)");
				break;
			case '/':
				regexp.append("(\\" + dtf.DateSeparator + ")");
				break;
			default:
				Sys.Debug.fail("Invalid date format pattern");
		}
		Array.add(groups, match[0]);
	}
	Date._appendPreOrPostMatch(expFormat.slice(index), regexp);
	regexp.append("$");
	var regexpStr = regexp.toString().replace(/\s+/g, "\\s+");
	var parseRegExp = { 'regExp': regexpStr, 'groups': groups };
	dtf._parseRegExp[format] = parseRegExp;
	return parseRegExp;
}
Date._getTokenRegExp = function Date$_getTokenRegExp() {
	return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
}
Date.parseLocale = function Date$parseLocale(value, formats) {
	/// <summary locid="M:J#Date.parseLocale" />
	/// <param name="value" type="String"></param>
	/// <param name="formats" parameterArray="true" optional="true" mayBeNull="true"></param>
	/// <returns type="Date"></returns>
	var e = Function._validateParams(arguments, [
        { name: "value", type: String },
        { name: "formats", mayBeNull: true, optional: true, parameterArray: true }
    ]);
	if (e) throw e;
	return Date._parse(value, Sys.CultureInfo.CurrentCulture, arguments);
}
Date.parseInvariant = function Date$parseInvariant(value, formats) {
	/// <summary locid="M:J#Date.parseInvariant" />
	/// <param name="value" type="String"></param>
	/// <param name="formats" parameterArray="true" optional="true" mayBeNull="true"></param>
	/// <returns type="Date"></returns>
	var e = Function._validateParams(arguments, [
        { name: "value", type: String },
        { name: "formats", mayBeNull: true, optional: true, parameterArray: true }
    ]);
	if (e) throw e;
	return Date._parse(value, Sys.CultureInfo.InvariantCulture, arguments);
}
Date._parse = function Date$_parse(value, cultureInfo, args) {
	var i, l, date, format, formats, custom = false;
	for (i = 1, l = args.length; i < l; i++) {
		format = args[i];
		if (format) {
			custom = true;
			date = Date._parseExact(value, format, cultureInfo);
			if (date) return date;
		}
	}
	if (!custom) {
		formats = cultureInfo._getDateTimeFormats();
		for (i = 0, l = formats.length; i < l; i++) {
			date = Date._parseExact(value, formats[i], cultureInfo);
			if (date) return date;
		}
	}
	return null;
}
Date._parseExact = function Date$_parseExact(value, format, cultureInfo) {
	value = value.trim();
	var dtf = cultureInfo.dateTimeFormat,
        parseInfo = Date._getParseRegExp(dtf, format),
        match = new RegExp(parseInfo.regExp).exec(value);
	if (match === null) return null;

	var groups = parseInfo.groups,
        era = null, year = null, month = null, date = null, weekDay = null,
        hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
        pmHour = false;
	for (var j = 0, jl = groups.length; j < jl; j++) {
		var matchGroup = match[j + 1];
		if (matchGroup) {
			switch (groups[j]) {
				case 'dd': case 'd':
					date = parseInt(matchGroup, 10);
					if ((date < 1) || (date > 31)) return null;
					break;
				case 'MMMM':
					month = cultureInfo._getMonthIndex(matchGroup);
					if ((month < 0) || (month > 11)) return null;
					break;
				case 'MMM':
					month = cultureInfo._getAbbrMonthIndex(matchGroup);
					if ((month < 0) || (month > 11)) return null;
					break;
				case 'M': case 'MM':
					month = parseInt(matchGroup, 10) - 1;
					if ((month < 0) || (month > 11)) return null;
					break;
				case 'y': case 'yy':
					year = Date._expandYear(dtf, parseInt(matchGroup, 10));
					if ((year < 0) || (year > 9999)) return null;
					break;
				case 'yyyy':
					year = parseInt(matchGroup, 10);
					if ((year < 0) || (year > 9999)) return null;
					break;
				case 'h': case 'hh':
					hour = parseInt(matchGroup, 10);
					if (hour === 12) hour = 0;
					if ((hour < 0) || (hour > 11)) return null;
					break;
				case 'H': case 'HH':
					hour = parseInt(matchGroup, 10);
					if ((hour < 0) || (hour > 23)) return null;
					break;
				case 'm': case 'mm':
					min = parseInt(matchGroup, 10);
					if ((min < 0) || (min > 59)) return null;
					break;
				case 's': case 'ss':
					sec = parseInt(matchGroup, 10);
					if ((sec < 0) || (sec > 59)) return null;
					break;
				case 'tt': case 't':
					var upperToken = matchGroup.toUpperCase();
					pmHour = (upperToken === dtf.PMDesignator.toUpperCase());
					if (!pmHour && (upperToken !== dtf.AMDesignator.toUpperCase())) return null;
					break;
				case 'f':
					msec = parseInt(matchGroup, 10) * 100;
					if ((msec < 0) || (msec > 999)) return null;
					break;
				case 'ff':
					msec = parseInt(matchGroup, 10) * 10;
					if ((msec < 0) || (msec > 999)) return null;
					break;
				case 'fff':
					msec = parseInt(matchGroup, 10);
					if ((msec < 0) || (msec > 999)) return null;
					break;
				case 'dddd':
					weekDay = cultureInfo._getDayIndex(matchGroup);
					if ((weekDay < 0) || (weekDay > 6)) return null;
					break;
				case 'ddd':
					weekDay = cultureInfo._getAbbrDayIndex(matchGroup);
					if ((weekDay < 0) || (weekDay > 6)) return null;
					break;
				case 'zzz':
					var offsets = matchGroup.split(/:/);
					if (offsets.length !== 2) return null;
					hourOffset = parseInt(offsets[0], 10);
					if ((hourOffset < -12) || (hourOffset > 13)) return null;
					var minOffset = parseInt(offsets[1], 10);
					if ((minOffset < 0) || (minOffset > 59)) return null;
					tzMinOffset = (hourOffset * 60) + (matchGroup.startsWith('-') ? -minOffset : minOffset);
					break;
				case 'z': case 'zz':
					hourOffset = parseInt(matchGroup, 10);
					if ((hourOffset < -12) || (hourOffset > 13)) return null;
					tzMinOffset = hourOffset * 60;
					break;
				case 'g': case 'gg':
					var eraName = matchGroup;
					if (!eraName || !dtf.eras) return null;
					eraName = eraName.toLowerCase().trim();
					for (var i = 0, l = dtf.eras.length; i < l; i += 4) {
						if (eraName === dtf.eras[i + 1].toLowerCase()) {
							era = i;
							break;
						}
					}
					if (era === null) return null;
					break;
			}
		}
	}
	var result = new Date(), defaultYear, convert = dtf.Calendar.convert;
	if (convert) {
		defaultYear = convert.fromGregorian(result)[0];
	}
	else {
		defaultYear = result.getFullYear();
	}
	if (year === null) {
		year = defaultYear;
	}
	else if (dtf.eras) {
		year += dtf.eras[(era || 0) + 3];
	}
	if (month === null) {
		month = 0;
	}
	if (date === null) {
		date = 1;
	}
	if (convert) {
		result = convert.toGregorian(year, month, date);
		if (result === null) return null;
	}
	else {
		result.setFullYear(year, month, date);
		if (result.getDate() !== date) return null;
		if ((weekDay !== null) && (result.getDay() !== weekDay)) {
			return null;
		}
	}
	if (pmHour && (hour < 12)) {
		hour += 12;
	}
	result.setHours(hour, min, sec, msec);
	if (tzMinOffset !== null) {
		var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
		result.setHours(result.getHours() + parseInt(adjustedMin / 60, 10), adjustedMin % 60);
	}
	return result;
}
Date.prototype.format = function Date$format(format) {
	/// <summary locid="M:J#Date.format" />
	/// <param name="format" type="String"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "format", type: String }
    ]);
	if (e) throw e;
	return this._toFormattedString(format, Sys.CultureInfo.InvariantCulture);
}
Date.prototype.localeFormat = function Date$localeFormat(format) {
	/// <summary locid="M:J#Date.localeFormat" />
	/// <param name="format" type="String"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "format", type: String }
    ]);
	if (e) throw e;
	return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
}
Date.prototype._toFormattedString = function Date$_toFormattedString(format, cultureInfo) {
	var dtf = cultureInfo.dateTimeFormat,
        convert = dtf.Calendar.convert;
	if (!format || !format.length || (format === 'i')) {
		if (cultureInfo && cultureInfo.name.length) {
			if (convert) {
				return this._toFormattedString(dtf.FullDateTimePattern, cultureInfo);
			}
			else {
				var eraDate = new Date(this.getTime());
				var era = Date._getEra(this, dtf.eras);
				eraDate.setFullYear(Date._getEraYear(this, dtf, era));
				return eraDate.toLocaleString();
			}
		}
		else {
			return this.toString();
		}
	}
	var eras = dtf.eras,
        sortable = (format === "s");
	format = Date._expandFormat(dtf, format);
	var ret = new Sys.StringBuilder();
	var hour;
	function addLeadingZero(num) {
		if (num < 10) {
			return '0' + num;
		}
		return num.toString();
	}
	function addLeadingZeros(num) {
		if (num < 10) {
			return '00' + num;
		}
		if (num < 100) {
			return '0' + num;
		}
		return num.toString();
	}
	function padYear(year) {
		if (year < 10) {
			return '000' + year;
		}
		else if (year < 100) {
			return '00' + year;
		}
		else if (year < 1000) {
			return '0' + year;
		}
		return year.toString();
	}

	var foundDay, checkedDay, dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g;
	function hasDay() {
		if (foundDay || checkedDay) {
			return foundDay;
		}
		foundDay = dayPartRegExp.test(format);
		checkedDay = true;
		return foundDay;
	}

	var quoteCount = 0,
        tokenRegExp = Date._getTokenRegExp(),
        converted;
	if (!sortable && convert) {
		converted = convert.fromGregorian(this);
	}
	for (; ; ) {
		var index = tokenRegExp.lastIndex;
		var ar = tokenRegExp.exec(format);
		var preMatch = format.slice(index, ar ? ar.index : format.length);
		quoteCount += Date._appendPreOrPostMatch(preMatch, ret);
		if (!ar) break;
		if ((quoteCount % 2) === 1) {
			ret.append(ar[0]);
			continue;
		}

		function getPart(date, part) {
			if (converted) {
				return converted[part];
			}
			switch (part) {
				case 0: return date.getFullYear();
				case 1: return date.getMonth();
				case 2: return date.getDate();
			}
		}
		switch (ar[0]) {
			case "dddd":
				ret.append(dtf.DayNames[this.getDay()]);
				break;
			case "ddd":
				ret.append(dtf.AbbreviatedDayNames[this.getDay()]);
				break;
			case "dd":
				foundDay = true;
				ret.append(addLeadingZero(getPart(this, 2)));
				break;
			case "d":
				foundDay = true;
				ret.append(getPart(this, 2));
				break;
			case "MMMM":
				ret.append((dtf.MonthGenitiveNames && hasDay())
                ? dtf.MonthGenitiveNames[getPart(this, 1)]
                : dtf.MonthNames[getPart(this, 1)]);
				break;
			case "MMM":
				ret.append((dtf.AbbreviatedMonthGenitiveNames && hasDay())
                ? dtf.AbbreviatedMonthGenitiveNames[getPart(this, 1)]
                : dtf.AbbreviatedMonthNames[getPart(this, 1)]);
				break;
			case "MM":
				ret.append(addLeadingZero(getPart(this, 1) + 1));
				break;
			case "M":
				ret.append(getPart(this, 1) + 1);
				break;
			case "yyyy":
				ret.append(padYear(converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)));
				break;
			case "yy":
				ret.append(addLeadingZero((converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)) % 100));
				break;
			case "y":
				ret.append((converted ? converted[0] : Date._getEraYear(this, dtf, Date._getEra(this, eras), sortable)) % 100);
				break;
			case "hh":
				hour = this.getHours() % 12;
				if (hour === 0) hour = 12;
				ret.append(addLeadingZero(hour));
				break;
			case "h":
				hour = this.getHours() % 12;
				if (hour === 0) hour = 12;
				ret.append(hour);
				break;
			case "HH":
				ret.append(addLeadingZero(this.getHours()));
				break;
			case "H":
				ret.append(this.getHours());
				break;
			case "mm":
				ret.append(addLeadingZero(this.getMinutes()));
				break;
			case "m":
				ret.append(this.getMinutes());
				break;
			case "ss":
				ret.append(addLeadingZero(this.getSeconds()));
				break;
			case "s":
				ret.append(this.getSeconds());
				break;
			case "tt":
				ret.append((this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator);
				break;
			case "t":
				ret.append(((this.getHours() < 12) ? dtf.AMDesignator : dtf.PMDesignator).charAt(0));
				break;
			case "f":
				ret.append(addLeadingZeros(this.getMilliseconds()).charAt(0));
				break;
			case "ff":
				ret.append(addLeadingZeros(this.getMilliseconds()).substr(0, 2));
				break;
			case "fff":
				ret.append(addLeadingZeros(this.getMilliseconds()));
				break;
			case "z":
				hour = this.getTimezoneOffset() / 60;
				ret.append(((hour <= 0) ? '+' : '-') + Math.floor(Math.abs(hour)));
				break;
			case "zz":
				hour = this.getTimezoneOffset() / 60;
				ret.append(((hour <= 0) ? '+' : '-') + addLeadingZero(Math.floor(Math.abs(hour))));
				break;
			case "zzz":
				hour = this.getTimezoneOffset() / 60;
				ret.append(((hour <= 0) ? '+' : '-') + addLeadingZero(Math.floor(Math.abs(hour))) +
                ":" + addLeadingZero(Math.abs(this.getTimezoneOffset() % 60)));
				break;
			case "g":
			case "gg":
				if (dtf.eras) {
					ret.append(dtf.eras[Date._getEra(this, eras) + 1]);
				}
				break;
			case "/":
				ret.append(dtf.DateSeparator);
				break;
			default:
				Sys.Debug.fail("Invalid date format pattern");
		}
	}
	return ret.toString();
}
String.localeFormat = function String$localeFormat(format, args) {
	/// <summary locid="M:J#String.localeFormat" />
	/// <param name="format" type="String"></param>
	/// <param name="args" parameterArray="true" mayBeNull="true"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "format", type: String },
        { name: "args", mayBeNull: true, parameterArray: true }
    ]);
	if (e) throw e;
	return String._toFormattedString(true, arguments);
}
Number.parseLocale = function Number$parseLocale(value) {
	/// <summary locid="M:J#Number.parseLocale" />
	/// <param name="value" type="String"></param>
	/// <returns type="Number"></returns>
	var e = Function._validateParams(arguments, [
        { name: "value", type: String }
    ], false);
	if (e) throw e;
	return Number._parse(value, Sys.CultureInfo.CurrentCulture);
}
Number.parseInvariant = function Number$parseInvariant(value) {
	/// <summary locid="M:J#Number.parseInvariant" />
	/// <param name="value" type="String"></param>
	/// <returns type="Number"></returns>
	var e = Function._validateParams(arguments, [
        { name: "value", type: String }
    ], false);
	if (e) throw e;
	return Number._parse(value, Sys.CultureInfo.InvariantCulture);
}
Number._parse = function Number$_parse(value, cultureInfo) {
	value = value.trim();

	if (value.match(/^[+-]?infinity$/i)) {
		return parseFloat(value);
	}
	if (value.match(/^0x[a-f0-9]+$/i)) {
		return parseInt(value);
	}
	var numFormat = cultureInfo.numberFormat;
	var signInfo = Number._parseNumberNegativePattern(value, numFormat, numFormat.NumberNegativePattern);
	var sign = signInfo[0];
	var num = signInfo[1];

	if ((sign === '') && (numFormat.NumberNegativePattern !== 1)) {
		signInfo = Number._parseNumberNegativePattern(value, numFormat, 1);
		sign = signInfo[0];
		num = signInfo[1];
	}
	if (sign === '') sign = '+';

	var exponent;
	var intAndFraction;
	var exponentPos = num.indexOf('e');
	if (exponentPos < 0) exponentPos = num.indexOf('E');
	if (exponentPos < 0) {
		intAndFraction = num;
		exponent = null;
	}
	else {
		intAndFraction = num.substr(0, exponentPos);
		exponent = num.substr(exponentPos + 1);
	}

	var integer;
	var fraction;
	var decimalPos = intAndFraction.indexOf(numFormat.NumberDecimalSeparator);
	if (decimalPos < 0) {
		integer = intAndFraction;
		fraction = null;
	}
	else {
		integer = intAndFraction.substr(0, decimalPos);
		fraction = intAndFraction.substr(decimalPos + numFormat.NumberDecimalSeparator.length);
	}

	integer = integer.split(numFormat.NumberGroupSeparator).join('');
	var altNumGroupSeparator = numFormat.NumberGroupSeparator.replace(/\u00A0/g, " ");
	if (numFormat.NumberGroupSeparator !== altNumGroupSeparator) {
		integer = integer.split(altNumGroupSeparator).join('');
	}

	var p = sign + integer;
	if (fraction !== null) {
		p += '.' + fraction;
	}
	if (exponent !== null) {
		var expSignInfo = Number._parseNumberNegativePattern(exponent, numFormat, 1);
		if (expSignInfo[0] === '') {
			expSignInfo[0] = '+';
		}
		p += 'e' + expSignInfo[0] + expSignInfo[1];
	}
	if (p.match(/^[+-]?\d*\.?\d*(e[+-]?\d+)?$/)) {
		return parseFloat(p);
	}
	return Number.NaN;
}
Number._parseNumberNegativePattern = function Number$_parseNumberNegativePattern(value, numFormat, numberNegativePattern) {
	var neg = numFormat.NegativeSign;
	var pos = numFormat.PositiveSign;
	switch (numberNegativePattern) {
		case 4:
			neg = ' ' + neg;
			pos = ' ' + pos;
		case 3:
			if (value.endsWith(neg)) {
				return ['-', value.substr(0, value.length - neg.length)];
			}
			else if (value.endsWith(pos)) {
				return ['+', value.substr(0, value.length - pos.length)];
			}
			break;
		case 2:
			neg += ' ';
			pos += ' ';
		case 1:
			if (value.startsWith(neg)) {
				return ['-', value.substr(neg.length)];
			}
			else if (value.startsWith(pos)) {
				return ['+', value.substr(pos.length)];
			}
			break;
		case 0:
			if (value.startsWith('(') && value.endsWith(')')) {
				return ['-', value.substr(1, value.length - 2)];
			}
			break;
		default:
			Sys.Debug.fail("");
	}
	return ['', value];
}
Number.prototype.format = function Number$format(format) {
	/// <summary locid="M:J#Number.format" />
	/// <param name="format" type="String"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "format", type: String }
    ]);
	if (e) throw e;
	return this._toFormattedString(format, Sys.CultureInfo.InvariantCulture);
}
Number.prototype.localeFormat = function Number$localeFormat(format) {
	/// <summary locid="M:J#Number.localeFormat" />
	/// <param name="format" type="String"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "format", type: String }
    ]);
	if (e) throw e;
	return this._toFormattedString(format, Sys.CultureInfo.CurrentCulture);
}
Number.prototype._toFormattedString = function Number$_toFormattedString(format, cultureInfo) {
	if (!format || (format.length === 0) || (format === 'i')) {
		if (cultureInfo && (cultureInfo.name.length > 0)) {
			return this.toLocaleString();
		}
		else {
			return this.toString();
		}
	}

	var _percentPositivePattern = ["n %", "n%", "%n"];
	var _percentNegativePattern = ["-n %", "-n%", "-%n"];
	var _numberNegativePattern = ["(n)", "-n", "- n", "n-", "n -"];
	var _currencyPositivePattern = ["$n", "n$", "$ n", "n $"];
	var _currencyNegativePattern = ["($n)", "-$n", "$-n", "$n-", "(n$)", "-n$", "n-$", "n$-", "-n $", "-$ n", "n $-", "$ n-", "$ -n", "n- $", "($ n)", "(n $)"];
	function zeroPad(str, count, left) {
		for (var l = str.length; l < count; l++) {
			str = (left ? ('0' + str) : (str + '0'));
		}
		return str;
	}

	function expandNumber(number, precision, groupSizes, sep, decimalChar) {
		Sys.Debug.assert(groupSizes.length > 0, "groupSizes must be an array of at least 1");
		var curSize = groupSizes[0];
		var curGroupIndex = 1;
		var factor = Math.pow(10, precision);
		var rounded = (Math.round(number * factor) / factor);
		if (!isFinite(rounded)) {
			rounded = number;
		}
		number = rounded;

		var numberString = number.toString();
		var right = "";
		var exponent;


		var split = numberString.split(/e/i);
		numberString = split[0];
		exponent = (split.length > 1 ? parseInt(split[1]) : 0);
		split = numberString.split('.');
		numberString = split[0];
		right = split.length > 1 ? split[1] : "";

		var l;
		if (exponent > 0) {
			right = zeroPad(right, exponent, false);
			numberString += right.slice(0, exponent);
			right = right.substr(exponent);
		}
		else if (exponent < 0) {
			exponent = -exponent;
			numberString = zeroPad(numberString, exponent + 1, true);
			right = numberString.slice(-exponent, numberString.length) + right;
			numberString = numberString.slice(0, -exponent);
		}
		if (precision > 0) {
			if (right.length > precision) {
				right = right.slice(0, precision);
			}
			else {
				right = zeroPad(right, precision, false);
			}
			right = decimalChar + right;
		}
		else {
			right = "";
		}
		var stringIndex = numberString.length - 1;
		var ret = "";
		while (stringIndex >= 0) {
			if (curSize === 0 || curSize > stringIndex) {
				if (ret.length > 0)
					return numberString.slice(0, stringIndex + 1) + sep + ret + right;
				else
					return numberString.slice(0, stringIndex + 1) + right;
			}
			if (ret.length > 0)
				ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + sep + ret;
			else
				ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1);
			stringIndex -= curSize;
			if (curGroupIndex < groupSizes.length) {
				curSize = groupSizes[curGroupIndex];
				curGroupIndex++;
			}
		}
		return numberString.slice(0, stringIndex + 1) + sep + ret + right;
	}
	var nf = cultureInfo.numberFormat;
	var number = Math.abs(this);
	if (!format)
		format = "D";
	var precision = -1;
	if (format.length > 1) precision = parseInt(format.slice(1), 10);
	var pattern;
	switch (format.charAt(0)) {
		case "d":
		case "D":
			pattern = 'n';
			if (precision !== -1) {
				number = zeroPad("" + number, precision, true);
			}
			if (this < 0) number = -number;
			break;
		case "c":
		case "C":
			if (this < 0) pattern = _currencyNegativePattern[nf.CurrencyNegativePattern];
			else pattern = _currencyPositivePattern[nf.CurrencyPositivePattern];
			if (precision === -1) precision = nf.CurrencyDecimalDigits;
			number = expandNumber(Math.abs(this), precision, nf.CurrencyGroupSizes, nf.CurrencyGroupSeparator, nf.CurrencyDecimalSeparator);
			break;
		case "n":
		case "N":
			if (this < 0) pattern = _numberNegativePattern[nf.NumberNegativePattern];
			else pattern = 'n';
			if (precision === -1) precision = nf.NumberDecimalDigits;
			number = expandNumber(Math.abs(this), precision, nf.NumberGroupSizes, nf.NumberGroupSeparator, nf.NumberDecimalSeparator);
			break;
		case "p":
		case "P":
			if (this < 0) pattern = _percentNegativePattern[nf.PercentNegativePattern];
			else pattern = _percentPositivePattern[nf.PercentPositivePattern];
			if (precision === -1) precision = nf.PercentDecimalDigits;
			number = expandNumber(Math.abs(this) * 100, precision, nf.PercentGroupSizes, nf.PercentGroupSeparator, nf.PercentDecimalSeparator);
			break;
		default:
			throw Error.format(Sys.Res.formatBadFormatSpecifier);
	}
	var regex = /n|\$|-|%/g;
	var ret = "";
	for (; ; ) {
		var index = regex.lastIndex;
		var ar = regex.exec(pattern);
		ret += pattern.slice(index, ar ? ar.index : pattern.length);
		if (!ar)
			break;
		switch (ar[0]) {
			case "n":
				ret += number;
				break;
			case "$":
				ret += nf.CurrencySymbol;
				break;
			case "-":
				if (/[1-9]/.test(number)) {
					ret += nf.NegativeSign;
				}
				break;
			case "%":
				ret += nf.PercentSymbol;
				break;
			default:
				Sys.Debug.fail("Invalid number format pattern");
		}
	}
	return ret;
}

Sys.CultureInfo = function Sys$CultureInfo(name, numberFormat, dateTimeFormat) {
	/// <summary locid="M:J#Sys.CultureInfo.#ctor" />
	/// <param name="name" type="String"></param>
	/// <param name="numberFormat" type="Object"></param>
	/// <param name="dateTimeFormat" type="Object"></param>
	var e = Function._validateParams(arguments, [
        { name: "name", type: String },
        { name: "numberFormat", type: Object },
        { name: "dateTimeFormat", type: Object }
    ]);
	if (e) throw e;
	this.name = name;
	this.numberFormat = numberFormat;
	this.dateTimeFormat = dateTimeFormat;
}
function Sys$CultureInfo$_getDateTimeFormats() {
	if (!this._dateTimeFormats) {
		var dtf = this.dateTimeFormat;
		this._dateTimeFormats =
              [dtf.MonthDayPattern,
                dtf.YearMonthPattern,
                dtf.ShortDatePattern,
                dtf.ShortTimePattern,
                dtf.LongDatePattern,
                dtf.LongTimePattern,
                dtf.FullDateTimePattern,
                dtf.RFC1123Pattern,
                dtf.SortableDateTimePattern,
                dtf.UniversalSortableDateTimePattern];
	}
	return this._dateTimeFormats;
}
function Sys$CultureInfo$_getIndex(value, a1, a2) {
	var upper = this._toUpper(value),
            i = Array.indexOf(a1, upper);
	if (i === -1) {
		i = Array.indexOf(a2, upper);
	}
	return i;
}
function Sys$CultureInfo$_getMonthIndex(value) {
	if (!this._upperMonths) {
		this._upperMonths = this._toUpperArray(this.dateTimeFormat.MonthNames);
		this._upperMonthsGenitive = this._toUpperArray(this.dateTimeFormat.MonthGenitiveNames);
	}
	return this._getIndex(value, this._upperMonths, this._upperMonthsGenitive);
}
function Sys$CultureInfo$_getAbbrMonthIndex(value) {
	if (!this._upperAbbrMonths) {
		this._upperAbbrMonths = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthNames);
		this._upperAbbrMonthsGenitive = this._toUpperArray(this.dateTimeFormat.AbbreviatedMonthGenitiveNames);
	}
	return this._getIndex(value, this._upperAbbrMonths, this._upperAbbrMonthsGenitive);
}
function Sys$CultureInfo$_getDayIndex(value) {
	if (!this._upperDays) {
		this._upperDays = this._toUpperArray(this.dateTimeFormat.DayNames);
	}
	return Array.indexOf(this._upperDays, this._toUpper(value));
}
function Sys$CultureInfo$_getAbbrDayIndex(value) {
	if (!this._upperAbbrDays) {
		this._upperAbbrDays = this._toUpperArray(this.dateTimeFormat.AbbreviatedDayNames);
	}
	return Array.indexOf(this._upperAbbrDays, this._toUpper(value));
}
function Sys$CultureInfo$_toUpperArray(arr) {
	var result = [];
	for (var i = 0, il = arr.length; i < il; i++) {
		result[i] = this._toUpper(arr[i]);
	}
	return result;
}
function Sys$CultureInfo$_toUpper(value) {
	return value.split("\u00A0").join(' ').toUpperCase();
}
Sys.CultureInfo.prototype = {
	_getDateTimeFormats: Sys$CultureInfo$_getDateTimeFormats,
	_getIndex: Sys$CultureInfo$_getIndex,
	_getMonthIndex: Sys$CultureInfo$_getMonthIndex,
	_getAbbrMonthIndex: Sys$CultureInfo$_getAbbrMonthIndex,
	_getDayIndex: Sys$CultureInfo$_getDayIndex,
	_getAbbrDayIndex: Sys$CultureInfo$_getAbbrDayIndex,
	_toUpperArray: Sys$CultureInfo$_toUpperArray,
	_toUpper: Sys$CultureInfo$_toUpper
}
Sys.CultureInfo.registerClass('Sys.CultureInfo');
Sys.CultureInfo._parse = function Sys$CultureInfo$_parse(value) {
	var dtf = value.dateTimeFormat;
	if (dtf && !dtf.eras) {
		dtf.eras = value.eras;
	}
	return new Sys.CultureInfo(value.name, value.numberFormat, dtf);
}
Sys.CultureInfo.InvariantCulture = Sys.CultureInfo._parse({ "name": "", "numberFormat": { "CurrencyDecimalDigits": 2, "CurrencyDecimalSeparator": ".", "IsReadOnly": true, "CurrencyGroupSizes": [3], "NumberGroupSizes": [3], "PercentGroupSizes": [3], "CurrencyGroupSeparator": ",", "CurrencySymbol": "\u00A4", "NaNSymbol": "NaN", "CurrencyNegativePattern": 0, "NumberNegativePattern": 1, "PercentPositivePattern": 0, "PercentNegativePattern": 0, "NegativeInfinitySymbol": "-Infinity", "NegativeSign": "-", "NumberDecimalDigits": 2, "NumberDecimalSeparator": ".", "NumberGroupSeparator": ",", "CurrencyPositivePattern": 0, "PositiveInfinitySymbol": "Infinity", "PositiveSign": "+", "PercentDecimalDigits": 2, "PercentDecimalSeparator": ".", "PercentGroupSeparator": ",", "PercentSymbol": "%", "PerMilleSymbol": "\u2030", "NativeDigits": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], "DigitSubstitution": 1 }, "dateTimeFormat": { "AMDesignator": "AM", "Calendar": { "MinSupportedDateTime": "@-62135568000000@", "MaxSupportedDateTime": "@253402300799999@", "AlgorithmType": 1, "CalendarType": 1, "Eras": [1], "TwoDigitYearMax": 2029, "IsReadOnly": true }, "DateSeparator": "/", "FirstDayOfWeek": 0, "CalendarWeekRule": 0, "FullDateTimePattern": "dddd, dd MMMM yyyy HH:mm:ss", "LongDatePattern": "dddd, dd MMMM yyyy", "LongTimePattern": "HH:mm:ss", "MonthDayPattern": "MMMM dd", "PMDesignator": "PM", "RFC1123Pattern": "ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'", "ShortDatePattern": "MM/dd/yyyy", "ShortTimePattern": "HH:mm", "SortableDateTimePattern": "yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss", "TimeSeparator": ":", "UniversalSortableDateTimePattern": "yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'", "YearMonthPattern": "yyyy MMMM", "AbbreviatedDayNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "ShortestDayNames": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], "DayNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "AbbreviatedMonthNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], "MonthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], "IsReadOnly": true, "NativeCalendarName": "Gregorian Calendar", "AbbreviatedMonthGenitiveNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], "MonthGenitiveNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""] }, "eras": [1, "A.D.", null, 0] });
if (typeof (__cultureInfo) === "object") {
	Sys.CultureInfo.CurrentCulture = Sys.CultureInfo._parse(__cultureInfo);
	delete __cultureInfo;
}
else {
	Sys.CultureInfo.CurrentCulture = Sys.CultureInfo._parse({ "name": "en-US", "numberFormat": { "CurrencyDecimalDigits": 2, "CurrencyDecimalSeparator": ".", "IsReadOnly": false, "CurrencyGroupSizes": [3], "NumberGroupSizes": [3], "PercentGroupSizes": [3], "CurrencyGroupSeparator": ",", "CurrencySymbol": "$", "NaNSymbol": "NaN", "CurrencyNegativePattern": 0, "NumberNegativePattern": 1, "PercentPositivePattern": 0, "PercentNegativePattern": 0, "NegativeInfinitySymbol": "-Infinity", "NegativeSign": "-", "NumberDecimalDigits": 2, "NumberDecimalSeparator": ".", "NumberGroupSeparator": ",", "CurrencyPositivePattern": 0, "PositiveInfinitySymbol": "Infinity", "PositiveSign": "+", "PercentDecimalDigits": 2, "PercentDecimalSeparator": ".", "PercentGroupSeparator": ",", "PercentSymbol": "%", "PerMilleSymbol": "\u2030", "NativeDigits": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], "DigitSubstitution": 1 }, "dateTimeFormat": { "AMDesignator": "AM", "Calendar": { "MinSupportedDateTime": "@-62135568000000@", "MaxSupportedDateTime": "@253402300799999@", "AlgorithmType": 1, "CalendarType": 1, "Eras": [1], "TwoDigitYearMax": 2029, "IsReadOnly": false }, "DateSeparator": "/", "FirstDayOfWeek": 0, "CalendarWeekRule": 0, "FullDateTimePattern": "dddd, MMMM dd, yyyy h:mm:ss tt", "LongDatePattern": "dddd, MMMM dd, yyyy", "LongTimePattern": "h:mm:ss tt", "MonthDayPattern": "MMMM dd", "PMDesignator": "PM", "RFC1123Pattern": "ddd, dd MMM yyyy HH\':\'mm\':\'ss \'GMT\'", "ShortDatePattern": "M/d/yyyy", "ShortTimePattern": "h:mm tt", "SortableDateTimePattern": "yyyy\'-\'MM\'-\'dd\'T\'HH\':\'mm\':\'ss", "TimeSeparator": ":", "UniversalSortableDateTimePattern": "yyyy\'-\'MM\'-\'dd HH\':\'mm\':\'ss\'Z\'", "YearMonthPattern": "MMMM, yyyy", "AbbreviatedDayNames": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], "ShortestDayNames": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], "DayNames": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], "AbbreviatedMonthNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], "MonthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""], "IsReadOnly": false, "NativeCalendarName": "Gregorian Calendar", "AbbreviatedMonthGenitiveNames": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""], "MonthGenitiveNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""] }, "eras": [1, "A.D.", null, 0] });
}
Type.registerNamespace('Sys.Serialization');
Sys.Serialization.JavaScriptSerializer = function Sys$Serialization$JavaScriptSerializer() {
	/// <summary locid="M:J#Sys.Serialization.JavaScriptSerializer.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
}
Sys.Serialization.JavaScriptSerializer.registerClass('Sys.Serialization.JavaScriptSerializer');
Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs = [];
Sys.Serialization.JavaScriptSerializer._charsToEscape = [];
Sys.Serialization.JavaScriptSerializer._dateRegEx = new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', 'g');
Sys.Serialization.JavaScriptSerializer._escapeChars = {};
Sys.Serialization.JavaScriptSerializer._escapeRegEx = new RegExp('["\\\\\\x00-\\x1F]', 'i');
Sys.Serialization.JavaScriptSerializer._escapeRegExGlobal = new RegExp('["\\\\\\x00-\\x1F]', 'g');
Sys.Serialization.JavaScriptSerializer._jsonRegEx = new RegExp('[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]', 'g');
Sys.Serialization.JavaScriptSerializer._jsonStringRegEx = new RegExp('"(\\\\.|[^"\\\\])*"', 'g');
Sys.Serialization.JavaScriptSerializer._serverTypeFieldName = '__type';
Sys.Serialization.JavaScriptSerializer._init = function Sys$Serialization$JavaScriptSerializer$_init() {
	var replaceChars = ['\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007',
                        '\\b', '\\t', '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011',
                        '\\u0012', '\\u0013', '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019',
                        '\\u001a', '\\u001b', '\\u001c', '\\u001d', '\\u001e', '\\u001f'];
	Sys.Serialization.JavaScriptSerializer._charsToEscape[0] = '\\';
	Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs['\\'] = new RegExp('\\\\', 'g');
	Sys.Serialization.JavaScriptSerializer._escapeChars['\\'] = '\\\\';
	Sys.Serialization.JavaScriptSerializer._charsToEscape[1] = '"';
	Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs['"'] = new RegExp('"', 'g');
	Sys.Serialization.JavaScriptSerializer._escapeChars['"'] = '\\"';
	for (var i = 0; i < 32; i++) {
		var c = String.fromCharCode(i);
		Sys.Serialization.JavaScriptSerializer._charsToEscape[i + 2] = c;
		Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs[c] = new RegExp(c, 'g');
		Sys.Serialization.JavaScriptSerializer._escapeChars[c] = replaceChars[i];
	}
}
Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder = function Sys$Serialization$JavaScriptSerializer$_serializeBooleanWithBuilder(object, stringBuilder) {
	stringBuilder.append(object.toString());
}
Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder = function Sys$Serialization$JavaScriptSerializer$_serializeNumberWithBuilder(object, stringBuilder) {
	if (isFinite(object)) {
		stringBuilder.append(String(object));
	}
	else {
		throw Error.invalidOperation(Sys.Res.cannotSerializeNonFiniteNumbers);
	}
}
Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder = function Sys$Serialization$JavaScriptSerializer$_serializeStringWithBuilder(string, stringBuilder) {
	stringBuilder.append('"');
	if (Sys.Serialization.JavaScriptSerializer._escapeRegEx.test(string)) {
		if (Sys.Serialization.JavaScriptSerializer._charsToEscape.length === 0) {
			Sys.Serialization.JavaScriptSerializer._init();
		}
		if (string.length < 128) {
			string = string.replace(Sys.Serialization.JavaScriptSerializer._escapeRegExGlobal,
                function (x) { return Sys.Serialization.JavaScriptSerializer._escapeChars[x]; });
		}
		else {
			for (var i = 0; i < 34; i++) {
				var c = Sys.Serialization.JavaScriptSerializer._charsToEscape[i];
				if (string.indexOf(c) !== -1) {
					if (Sys.Browser.agent === Sys.Browser.Opera || Sys.Browser.agent === Sys.Browser.FireFox) {
						string = string.split(c).join(Sys.Serialization.JavaScriptSerializer._escapeChars[c]);
					}
					else {
						string = string.replace(Sys.Serialization.JavaScriptSerializer._charsToEscapeRegExs[c],
                            Sys.Serialization.JavaScriptSerializer._escapeChars[c]);
					}
				}
			}
		}
	}
	stringBuilder.append(string);
	stringBuilder.append('"');
}
Sys.Serialization.JavaScriptSerializer._serializeWithBuilder = function Sys$Serialization$JavaScriptSerializer$_serializeWithBuilder(object, stringBuilder, sort, prevObjects) {
	var i;
	switch (typeof object) {
		case 'object':
			if (object) {
				if (prevObjects) {
					for (var j = 0; j < prevObjects.length; j++) {
						if (prevObjects[j] === object) {
							throw Error.invalidOperation(Sys.Res.cannotSerializeObjectWithCycle);
						}
					}
				}
				else {
					prevObjects = new Array();
				}
				try {
					Array.add(prevObjects, object);

					if (Number.isInstanceOfType(object)) {
						Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder(object, stringBuilder);
					}
					else if (Boolean.isInstanceOfType(object)) {
						Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder(object, stringBuilder);
					}
					else if (String.isInstanceOfType(object)) {
						Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder(object, stringBuilder);
					}

					else if (Array.isInstanceOfType(object)) {
						stringBuilder.append('[');

						for (i = 0; i < object.length; ++i) {
							if (i > 0) {
								stringBuilder.append(',');
							}
							Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(object[i], stringBuilder, false, prevObjects);
						}
						stringBuilder.append(']');
					}
					else {
						if (Date.isInstanceOfType(object)) {
							stringBuilder.append('"\\/Date(');
							stringBuilder.append(object.getTime());
							stringBuilder.append(')\\/"');
							break;
						}
						var properties = [];
						var propertyCount = 0;
						for (var name in object) {
							if (name.startsWith('$')) {
								continue;
							}
							if (name === Sys.Serialization.JavaScriptSerializer._serverTypeFieldName && propertyCount !== 0) {
								properties[propertyCount++] = properties[0];
								properties[0] = name;
							}
							else {
								properties[propertyCount++] = name;
							}
						}
						if (sort) properties.sort();
						stringBuilder.append('{');
						var needComma = false;

						for (i = 0; i < propertyCount; i++) {
							var value = object[properties[i]];
							if (typeof value !== 'undefined' && typeof value !== 'function') {
								if (needComma) {
									stringBuilder.append(',');
								}
								else {
									needComma = true;
								}

								Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(properties[i], stringBuilder, sort, prevObjects);
								stringBuilder.append(':');
								Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(value, stringBuilder, sort, prevObjects);

							}
						}
						stringBuilder.append('}');
					}
				}
				finally {
					Array.removeAt(prevObjects, prevObjects.length - 1);
				}
			}
			else {
				stringBuilder.append('null');
			}
			break;
		case 'number':
			Sys.Serialization.JavaScriptSerializer._serializeNumberWithBuilder(object, stringBuilder);
			break;
		case 'string':
			Sys.Serialization.JavaScriptSerializer._serializeStringWithBuilder(object, stringBuilder);
			break;
		case 'boolean':
			Sys.Serialization.JavaScriptSerializer._serializeBooleanWithBuilder(object, stringBuilder);
			break;
		default:
			stringBuilder.append('null');
			break;
	}
}
Sys.Serialization.JavaScriptSerializer.serialize = function Sys$Serialization$JavaScriptSerializer$serialize(object) {
	/// <summary locid="M:J#Sys.Serialization.JavaScriptSerializer.serialize" />
	/// <param name="object" mayBeNull="true"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
        { name: "object", mayBeNull: true }
    ]);
	if (e) throw e;
	var stringBuilder = new Sys.StringBuilder();
	Sys.Serialization.JavaScriptSerializer._serializeWithBuilder(object, stringBuilder, false);
	return stringBuilder.toString();
}
Sys.Serialization.JavaScriptSerializer.deserialize = function Sys$Serialization$JavaScriptSerializer$deserialize(data, secure) {
	/// <summary locid="M:J#Sys.Serialization.JavaScriptSerializer.deserialize" />
	/// <param name="data" type="String"></param>
	/// <param name="secure" type="Boolean" optional="true"></param>
	/// <returns></returns>
	var e = Function._validateParams(arguments, [
        { name: "data", type: String },
        { name: "secure", type: Boolean, optional: true }
    ]);
	if (e) throw e;

	if (data.length === 0) throw Error.argument('data', Sys.Res.cannotDeserializeEmptyString);
	try {
		var exp = data.replace(Sys.Serialization.JavaScriptSerializer._dateRegEx, "$1new Date($2)");

		if (secure && Sys.Serialization.JavaScriptSerializer._jsonRegEx.test(
             exp.replace(Sys.Serialization.JavaScriptSerializer._jsonStringRegEx, ''))) throw null;
		return eval('(' + exp + ')');
	}
	catch (e) {
		throw Error.argument('data', Sys.Res.cannotDeserializeInvalidJson);
	}
}
Type.registerNamespace('Sys.UI');

Sys.EventHandlerList = function Sys$EventHandlerList() {
	/// <summary locid="M:J#Sys.EventHandlerList.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	this._list = {};
}
function Sys$EventHandlerList$_addHandler(id, handler) {
	Array.add(this._getEvent(id, true), handler);
}
function Sys$EventHandlerList$addHandler(id, handler) {
	/// <summary locid="M:J#Sys.EventHandlerList.addHandler" />
	/// <param name="id" type="String"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
            { name: "id", type: String },
            { name: "handler", type: Function }
        ]);
	if (e) throw e;
	this._addHandler(id, handler);
}
function Sys$EventHandlerList$_removeHandler(id, handler) {
	var evt = this._getEvent(id);
	if (!evt) return;
	Array.remove(evt, handler);
}
function Sys$EventHandlerList$removeHandler(id, handler) {
	/// <summary locid="M:J#Sys.EventHandlerList.removeHandler" />
	/// <param name="id" type="String"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
            { name: "id", type: String },
            { name: "handler", type: Function }
        ]);
	if (e) throw e;
	this._removeHandler(id, handler);
}
function Sys$EventHandlerList$getHandler(id) {
	/// <summary locid="M:J#Sys.EventHandlerList.getHandler" />
	/// <param name="id" type="String"></param>
	/// <returns type="Function"></returns>
	var e = Function._validateParams(arguments, [
            { name: "id", type: String }
        ]);
	if (e) throw e;
	var evt = this._getEvent(id);
	if (!evt || (evt.length === 0)) return null;
	evt = Array.clone(evt);
	return function (source, args) {
		for (var i = 0, l = evt.length; i < l; i++) {
			evt[i](source, args);
		}
	};
}
function Sys$EventHandlerList$_getEvent(id, create) {
	if (!this._list[id]) {
		if (!create) return null;
		this._list[id] = [];
	}
	return this._list[id];
}
Sys.EventHandlerList.prototype = {
	_addHandler: Sys$EventHandlerList$_addHandler,
	addHandler: Sys$EventHandlerList$addHandler,
	_removeHandler: Sys$EventHandlerList$_removeHandler,
	removeHandler: Sys$EventHandlerList$removeHandler,
	getHandler: Sys$EventHandlerList$getHandler,
	_getEvent: Sys$EventHandlerList$_getEvent
}
Sys.EventHandlerList.registerClass('Sys.EventHandlerList');
Sys.CommandEventArgs = function Sys$CommandEventArgs(commandName, commandArgument, commandSource) {
	/// <summary locid="M:J#Sys.CommandEventArgs.#ctor" />
	/// <param name="commandName" type="String"></param>
	/// <param name="commandArgument" mayBeNull="true"></param>
	/// <param name="commandSource" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "commandName", type: String },
        { name: "commandArgument", mayBeNull: true },
        { name: "commandSource", mayBeNull: true }
    ]);
	if (e) throw e;
	Sys.CommandEventArgs.initializeBase(this);
	this._commandName = commandName;
	this._commandArgument = commandArgument;
	this._commandSource = commandSource;
}
function Sys$CommandEventArgs$get_commandName() {
	/// <value type="String" locid="P:J#Sys.CommandEventArgs.commandName"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._commandName;
}
function Sys$CommandEventArgs$get_commandArgument() {
	/// <value mayBeNull="true" locid="P:J#Sys.CommandEventArgs.commandArgument"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._commandArgument;
}
function Sys$CommandEventArgs$get_commandSource() {
	/// <value mayBeNull="true" locid="P:J#Sys.CommandEventArgs.commandSource"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._commandSource;
}
Sys.CommandEventArgs.prototype = {
	_commandName: null,
	_commandArgument: null,
	_commandSource: null,
	get_commandName: Sys$CommandEventArgs$get_commandName,
	get_commandArgument: Sys$CommandEventArgs$get_commandArgument,
	get_commandSource: Sys$CommandEventArgs$get_commandSource
}
Sys.CommandEventArgs.registerClass("Sys.CommandEventArgs", Sys.CancelEventArgs);

Sys.INotifyPropertyChange = function Sys$INotifyPropertyChange() {
	/// <summary locid="M:J#Sys.INotifyPropertyChange.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$INotifyPropertyChange$add_propertyChanged(handler) {
	/// <summary locid="E:J#Sys.INotifyPropertyChange.propertyChanged" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	throw Error.notImplemented();
}
function Sys$INotifyPropertyChange$remove_propertyChanged(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	throw Error.notImplemented();
}
Sys.INotifyPropertyChange.prototype = {
	add_propertyChanged: Sys$INotifyPropertyChange$add_propertyChanged,
	remove_propertyChanged: Sys$INotifyPropertyChange$remove_propertyChanged
}
Sys.INotifyPropertyChange.registerInterface('Sys.INotifyPropertyChange');

Sys.PropertyChangedEventArgs = function Sys$PropertyChangedEventArgs(propertyName) {
	/// <summary locid="M:J#Sys.PropertyChangedEventArgs.#ctor" />
	/// <param name="propertyName" type="String"></param>
	var e = Function._validateParams(arguments, [
        { name: "propertyName", type: String }
    ]);
	if (e) throw e;
	Sys.PropertyChangedEventArgs.initializeBase(this);
	this._propertyName = propertyName;
}

function Sys$PropertyChangedEventArgs$get_propertyName() {
	/// <value type="String" locid="P:J#Sys.PropertyChangedEventArgs.propertyName"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._propertyName;
}
Sys.PropertyChangedEventArgs.prototype = {
	get_propertyName: Sys$PropertyChangedEventArgs$get_propertyName
}
Sys.PropertyChangedEventArgs.registerClass('Sys.PropertyChangedEventArgs', Sys.EventArgs);

Sys.INotifyDisposing = function Sys$INotifyDisposing() {
	/// <summary locid="M:J#Sys.INotifyDisposing.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$INotifyDisposing$add_disposing(handler) {
	/// <summary locid="E:J#Sys.INotifyDisposing.disposing" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	throw Error.notImplemented();
}
function Sys$INotifyDisposing$remove_disposing(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	throw Error.notImplemented();
}
Sys.INotifyDisposing.prototype = {
	add_disposing: Sys$INotifyDisposing$add_disposing,
	remove_disposing: Sys$INotifyDisposing$remove_disposing
}
Sys.INotifyDisposing.registerInterface("Sys.INotifyDisposing");

Sys.Component = function Sys$Component() {
	/// <summary locid="M:J#Sys.Component.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (Sys.Application) Sys.Application.registerDisposableObject(this);
}
function Sys$Component$get_events() {
	/// <value type="Sys.EventHandlerList" locid="P:J#Sys.Component.events"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._events) {
		this._events = new Sys.EventHandlerList();
	}
	return this._events;
}
function Sys$Component$get_id() {
	/// <value type="String" locid="P:J#Sys.Component.id"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._id;
}
function Sys$Component$set_id(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: String}]);
	if (e) throw e;
	if (this._idSet) throw Error.invalidOperation(Sys.Res.componentCantSetIdTwice);
	this._idSet = true;
	var oldId = this.get_id();
	if (oldId && Sys.Application.findComponent(oldId)) throw Error.invalidOperation(Sys.Res.componentCantSetIdAfterAddedToApp);
	this._id = value;
}
function Sys$Component$get_isInitialized() {
	/// <value type="Boolean" locid="P:J#Sys.Component.isInitialized"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._initialized;
}
function Sys$Component$get_isUpdating() {
	/// <value type="Boolean" locid="P:J#Sys.Component.isUpdating"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._updating;
}
function Sys$Component$add_disposing(handler) {
	/// <summary locid="E:J#Sys.Component.disposing" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().addHandler("disposing", handler);
}
function Sys$Component$remove_disposing(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().removeHandler("disposing", handler);
}
function Sys$Component$add_propertyChanged(handler) {
	/// <summary locid="E:J#Sys.Component.propertyChanged" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().addHandler("propertyChanged", handler);
}
function Sys$Component$remove_propertyChanged(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().removeHandler("propertyChanged", handler);
}
function Sys$Component$beginUpdate() {
	this._updating = true;
}
function Sys$Component$dispose() {
	if (this._events) {
		var handler = this._events.getHandler("disposing");
		if (handler) {
			handler(this, Sys.EventArgs.Empty);
		}
	}
	delete this._events;
	Sys.Application.unregisterDisposableObject(this);
	Sys.Application.removeComponent(this);
}
function Sys$Component$endUpdate() {
	this._updating = false;
	if (!this._initialized) this.initialize();
	this.updated();
}
function Sys$Component$initialize() {
	this._initialized = true;
}
function Sys$Component$raisePropertyChanged(propertyName) {
	/// <summary locid="M:J#Sys.Component.raisePropertyChanged" />
	/// <param name="propertyName" type="String"></param>
	var e = Function._validateParams(arguments, [
            { name: "propertyName", type: String }
        ]);
	if (e) throw e;
	if (!this._events) return;
	var handler = this._events.getHandler("propertyChanged");
	if (handler) {
		handler(this, new Sys.PropertyChangedEventArgs(propertyName));
	}
}
function Sys$Component$updated() {
}
Sys.Component.prototype = {
	_id: null,
	_idSet: false,
	_initialized: false,
	_updating: false,
	get_events: Sys$Component$get_events,
	get_id: Sys$Component$get_id,
	set_id: Sys$Component$set_id,
	get_isInitialized: Sys$Component$get_isInitialized,
	get_isUpdating: Sys$Component$get_isUpdating,
	add_disposing: Sys$Component$add_disposing,
	remove_disposing: Sys$Component$remove_disposing,
	add_propertyChanged: Sys$Component$add_propertyChanged,
	remove_propertyChanged: Sys$Component$remove_propertyChanged,
	beginUpdate: Sys$Component$beginUpdate,
	dispose: Sys$Component$dispose,
	endUpdate: Sys$Component$endUpdate,
	initialize: Sys$Component$initialize,
	raisePropertyChanged: Sys$Component$raisePropertyChanged,
	updated: Sys$Component$updated
}
Sys.Component.registerClass('Sys.Component', null, Sys.IDisposable, Sys.INotifyPropertyChange, Sys.INotifyDisposing);
function Sys$Component$_setProperties(target, properties) {
	/// <summary locid="M:J#Sys.Component._setProperties" />
	/// <param name="target"></param>
	/// <param name="properties"></param>
	var e = Function._validateParams(arguments, [
        { name: "target" },
        { name: "properties" }
    ]);
	if (e) throw e;
	var current;
	var targetType = Object.getType(target);
	var isObject = (targetType === Object) || (targetType === Sys.UI.DomElement);
	var isComponent = Sys.Component.isInstanceOfType(target) && !target.get_isUpdating();
	if (isComponent) target.beginUpdate();
	for (var name in properties) {
		var val = properties[name];
		var getter = isObject ? null : target["get_" + name];
		if (isObject || typeof (getter) !== 'function') {
			var targetVal = target[name];
			if (!isObject && typeof (targetVal) === 'undefined') throw Error.invalidOperation(String.format(Sys.Res.propertyUndefined, name));
			if (!val || (typeof (val) !== 'object') || (isObject && !targetVal)) {
				target[name] = val;
			}
			else {
				Sys$Component$_setProperties(targetVal, val);
			}
		}
		else {
			var setter = target["set_" + name];
			if (typeof (setter) === 'function') {
				setter.apply(target, [val]);
			}
			else if (val instanceof Array) {
				current = getter.apply(target);
				if (!(current instanceof Array)) throw new Error.invalidOperation(String.format(Sys.Res.propertyNotAnArray, name));
				for (var i = 0, j = current.length, l = val.length; i < l; i++, j++) {
					current[j] = val[i];
				}
			}
			else if ((typeof (val) === 'object') && (Object.getType(val) === Object)) {
				current = getter.apply(target);
				if ((typeof (current) === 'undefined') || (current === null)) throw new Error.invalidOperation(String.format(Sys.Res.propertyNullOrUndefined, name));
				Sys$Component$_setProperties(current, val);
			}
			else {
				throw new Error.invalidOperation(String.format(Sys.Res.propertyNotWritable, name));
			}
		}
	}
	if (isComponent) target.endUpdate();
}
function Sys$Component$_setReferences(component, references) {
	for (var name in references) {
		var setter = component["set_" + name];
		var reference = $find(references[name]);
		if (typeof (setter) !== 'function') throw new Error.invalidOperation(String.format(Sys.Res.propertyNotWritable, name));
		if (!reference) throw Error.invalidOperation(String.format(Sys.Res.referenceNotFound, references[name]));
		setter.apply(component, [reference]);
	}
}
var $create = Sys.Component.create = function Sys$Component$create(type, properties, events, references, element) {
	/// <summary locid="M:J#Sys.Component.create" />
	/// <param name="type" type="Type"></param>
	/// <param name="properties" optional="true" mayBeNull="true"></param>
	/// <param name="events" optional="true" mayBeNull="true"></param>
	/// <param name="references" optional="true" mayBeNull="true"></param>
	/// <param name="element" domElement="true" optional="true" mayBeNull="true"></param>
	/// <returns type="Sys.UI.Component"></returns>
	var e = Function._validateParams(arguments, [
        { name: "type", type: Type },
        { name: "properties", mayBeNull: true, optional: true },
        { name: "events", mayBeNull: true, optional: true },
        { name: "references", mayBeNull: true, optional: true },
        { name: "element", mayBeNull: true, domElement: true, optional: true }
    ]);
	if (e) throw e;
	if (!type.inheritsFrom(Sys.Component)) {
		throw Error.argument('type', String.format(Sys.Res.createNotComponent, type.getName()));
	}
	if (type.inheritsFrom(Sys.UI.Behavior) || type.inheritsFrom(Sys.UI.Control)) {
		if (!element) throw Error.argument('element', Sys.Res.createNoDom);
	}
	else if (element) throw Error.argument('element', Sys.Res.createComponentOnDom);
	var component = (element ? new type(element) : new type());
	var app = Sys.Application;
	var creatingComponents = app.get_isCreatingComponents();
	component.beginUpdate();
	if (properties) {
		Sys$Component$_setProperties(component, properties);
	}
	if (events) {
		for (var name in events) {
			if (!(component["add_" + name] instanceof Function)) throw new Error.invalidOperation(String.format(Sys.Res.undefinedEvent, name));
			if (!(events[name] instanceof Function)) throw new Error.invalidOperation(Sys.Res.eventHandlerNotFunction);
			component["add_" + name](events[name]);
		}
	}
	if (component.get_id()) {
		app.addComponent(component);
	}
	if (creatingComponents) {
		app._createdComponents[app._createdComponents.length] = component;
		if (references) {
			app._addComponentToSecondPass(component, references);
		}
		else {
			component.endUpdate();
		}
	}
	else {
		if (references) {
			Sys$Component$_setReferences(component, references);
		}
		component.endUpdate();
	}
	return component;
}

Sys.UI.MouseButton = function Sys$UI$MouseButton() {
	/// <summary locid="M:J#Sys.UI.MouseButton.#ctor" />
	/// <field name="leftButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.leftButton"></field>
	/// <field name="middleButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.middleButton"></field>
	/// <field name="rightButton" type="Number" integer="true" static="true" locid="F:J#Sys.UI.MouseButton.rightButton"></field>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
Sys.UI.MouseButton.prototype = {
	leftButton: 0,
	middleButton: 1,
	rightButton: 2
}
Sys.UI.MouseButton.registerEnum("Sys.UI.MouseButton");

Sys.UI.Key = function Sys$UI$Key() {
	/// <summary locid="M:J#Sys.UI.Key.#ctor" />
	/// <field name="backspace" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.backspace"></field>
	/// <field name="tab" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.tab"></field>
	/// <field name="enter" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.enter"></field>
	/// <field name="esc" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.esc"></field>
	/// <field name="space" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.space"></field>
	/// <field name="pageUp" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.pageUp"></field>
	/// <field name="pageDown" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.pageDown"></field>
	/// <field name="end" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.end"></field>
	/// <field name="home" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.home"></field>
	/// <field name="left" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.left"></field>
	/// <field name="up" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.up"></field>
	/// <field name="right" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.right"></field>
	/// <field name="down" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.down"></field>
	/// <field name="del" type="Number" integer="true" static="true" locid="F:J#Sys.UI.Key.del"></field>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
Sys.UI.Key.prototype = {
	backspace: 8,
	tab: 9,
	enter: 13,
	esc: 27,
	space: 32,
	pageUp: 33,
	pageDown: 34,
	end: 35,
	home: 36,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
	del: 127
}
Sys.UI.Key.registerEnum("Sys.UI.Key");

Sys.UI.Point = function Sys$UI$Point(x, y) {
	/// <summary locid="M:J#Sys.UI.Point.#ctor" />
	/// <param name="x" type="Number" integer="true"></param>
	/// <param name="y" type="Number" integer="true"></param>
	/// <field name="x" type="Number" integer="true" locid="F:J#Sys.UI.Point.x"></field>
	/// <field name="y" type="Number" integer="true" locid="F:J#Sys.UI.Point.y"></field>
	var e = Function._validateParams(arguments, [
        { name: "x", type: Number, integer: true },
        { name: "y", type: Number, integer: true }
    ]);
	if (e) throw e;
	this.x = x;
	this.y = y;
}
Sys.UI.Point.registerClass('Sys.UI.Point');

Sys.UI.Bounds = function Sys$UI$Bounds(x, y, width, height) {
	/// <summary locid="M:J#Sys.UI.Bounds.#ctor" />
	/// <param name="x" type="Number" integer="true"></param>
	/// <param name="y" type="Number" integer="true"></param>
	/// <param name="width" type="Number" integer="true"></param>
	/// <param name="height" type="Number" integer="true"></param>
	/// <field name="x" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.x"></field>
	/// <field name="y" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.y"></field>
	/// <field name="width" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.width"></field>
	/// <field name="height" type="Number" integer="true" locid="F:J#Sys.UI.Bounds.height"></field>
	var e = Function._validateParams(arguments, [
        { name: "x", type: Number, integer: true },
        { name: "y", type: Number, integer: true },
        { name: "width", type: Number, integer: true },
        { name: "height", type: Number, integer: true }
    ]);
	if (e) throw e;
	this.x = x;
	this.y = y;
	this.height = height;
	this.width = width;
}
Sys.UI.Bounds.registerClass('Sys.UI.Bounds');

Sys.UI.DomEvent = function Sys$UI$DomEvent(eventObject) {
	/// <summary locid="M:J#Sys.UI.DomEvent.#ctor" />
	/// <param name="eventObject"></param>
	/// <field name="altKey" type="Boolean" locid="F:J#Sys.UI.DomEvent.altKey"></field>
	/// <field name="button" type="Sys.UI.MouseButton" locid="F:J#Sys.UI.DomEvent.button"></field>
	/// <field name="charCode" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.charCode"></field>
	/// <field name="clientX" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.clientX"></field>
	/// <field name="clientY" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.clientY"></field>
	/// <field name="ctrlKey" type="Boolean" locid="F:J#Sys.UI.DomEvent.ctrlKey"></field>
	/// <field name="keyCode" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.keyCode"></field>
	/// <field name="offsetX" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.offsetX"></field>
	/// <field name="offsetY" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.offsetY"></field>
	/// <field name="screenX" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.screenX"></field>
	/// <field name="screenY" type="Number" integer="true" locid="F:J#Sys.UI.DomEvent.screenY"></field>
	/// <field name="shiftKey" type="Boolean" locid="F:J#Sys.UI.DomEvent.shiftKey"></field>
	/// <field name="target" locid="F:J#Sys.UI.DomEvent.target"></field>
	/// <field name="type" type="String" locid="F:J#Sys.UI.DomEvent.type"></field>
	var e = Function._validateParams(arguments, [
        { name: "eventObject" }
    ]);
	if (e) throw e;
	var ev = eventObject;
	var etype = this.type = ev.type.toLowerCase();
	this.rawEvent = ev;
	this.altKey = ev.altKey;
	if (typeof (ev.button) !== 'undefined') {
		this.button = (typeof (ev.which) !== 'undefined') ? ev.button :
            (ev.button === 4) ? Sys.UI.MouseButton.middleButton :
            (ev.button === 2) ? Sys.UI.MouseButton.rightButton :
            Sys.UI.MouseButton.leftButton;
	}
	if (etype === 'keypress') {
		this.charCode = ev.charCode || ev.keyCode;
	}
	else if (ev.keyCode && (ev.keyCode === 46)) {
		this.keyCode = 127;
	}
	else {
		this.keyCode = ev.keyCode;
	}
	this.clientX = ev.clientX;
	this.clientY = ev.clientY;
	this.ctrlKey = ev.ctrlKey;
	this.target = ev.target ? ev.target : ev.srcElement;
	if (!etype.startsWith('key')) {
		if ((typeof (ev.offsetX) !== 'undefined') && (typeof (ev.offsetY) !== 'undefined')) {
			this.offsetX = ev.offsetX;
			this.offsetY = ev.offsetY;
		}
		else if (this.target && (this.target.nodeType !== 3) && (typeof (ev.clientX) === 'number')) {
			var loc = Sys.UI.DomElement.getLocation(this.target);
			var w = Sys.UI.DomElement._getWindow(this.target);
			this.offsetX = (w.pageXOffset || 0) + ev.clientX - loc.x;
			this.offsetY = (w.pageYOffset || 0) + ev.clientY - loc.y;
		}
	}
	this.screenX = ev.screenX;
	this.screenY = ev.screenY;
	this.shiftKey = ev.shiftKey;
}
function Sys$UI$DomEvent$preventDefault() {
	/// <summary locid="M:J#Sys.UI.DomEvent.preventDefault" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this.rawEvent.preventDefault) {
		this.rawEvent.preventDefault();
	}
	else if (window.event) {
		this.rawEvent.returnValue = false;
	}
}
function Sys$UI$DomEvent$stopPropagation() {
	/// <summary locid="M:J#Sys.UI.DomEvent.stopPropagation" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this.rawEvent.stopPropagation) {
		this.rawEvent.stopPropagation();
	}
	else if (window.event) {
		this.rawEvent.cancelBubble = true;
	}
}
Sys.UI.DomEvent.prototype = {
	preventDefault: Sys$UI$DomEvent$preventDefault,
	stopPropagation: Sys$UI$DomEvent$stopPropagation
}
Sys.UI.DomEvent.registerClass('Sys.UI.DomEvent');
var $addHandler = Sys.UI.DomEvent.addHandler = function Sys$UI$DomEvent$addHandler(element, eventName, handler, autoRemove) {
	/// <summary locid="M:J#Sys.UI.DomEvent.addHandler" />
	/// <param name="element"></param>
	/// <param name="eventName" type="String"></param>
	/// <param name="handler" type="Function"></param>
	/// <param name="autoRemove" type="Boolean" optional="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "element" },
        { name: "eventName", type: String },
        { name: "handler", type: Function },
        { name: "autoRemove", type: Boolean, optional: true }
    ]);
	if (e) throw e;
	Sys.UI.DomEvent._ensureDomNode(element);
	if (eventName === "error") throw Error.invalidOperation(Sys.Res.addHandlerCantBeUsedForError);
	if (!element._events) {
		element._events = {};
	}
	var eventCache = element._events[eventName];
	if (!eventCache) {
		element._events[eventName] = eventCache = [];
	}
	var browserHandler;
	if (element.addEventListener) {
		browserHandler = function (e) {
			return handler.call(element, new Sys.UI.DomEvent(e));
		}
		element.addEventListener(eventName, browserHandler, false);
	}
	else if (element.attachEvent) {
		browserHandler = function () {
			var e = {};
			try { e = Sys.UI.DomElement._getWindow(element).event } catch (ex) { }
			return handler.call(element, new Sys.UI.DomEvent(e));
		}
		element.attachEvent('on' + eventName, browserHandler);
	}
	eventCache[eventCache.length] = { handler: handler, browserHandler: browserHandler, autoRemove: autoRemove };
	if (autoRemove) {
		var d = element.dispose;
		if (d !== Sys.UI.DomEvent._disposeHandlers) {
			element.dispose = Sys.UI.DomEvent._disposeHandlers;
			if (typeof (d) !== "undefined") {
				element._chainDispose = d;
			}
		}
	}
}
var $addHandlers = Sys.UI.DomEvent.addHandlers = function Sys$UI$DomEvent$addHandlers(element, events, handlerOwner, autoRemove) {
	/// <summary locid="M:J#Sys.UI.DomEvent.addHandlers" />
	/// <param name="element"></param>
	/// <param name="events" type="Object"></param>
	/// <param name="handlerOwner" optional="true"></param>
	/// <param name="autoRemove" type="Boolean" optional="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "element" },
        { name: "events", type: Object },
        { name: "handlerOwner", optional: true },
        { name: "autoRemove", type: Boolean, optional: true }
    ]);
	if (e) throw e;
	Sys.UI.DomEvent._ensureDomNode(element);
	for (var name in events) {
		var handler = events[name];
		if (typeof (handler) !== 'function') throw Error.invalidOperation(Sys.Res.cantAddNonFunctionhandler);
		if (handlerOwner) {
			handler = Function.createDelegate(handlerOwner, handler);
		}
		$addHandler(element, name, handler, autoRemove || false);
	}
}
var $clearHandlers = Sys.UI.DomEvent.clearHandlers = function Sys$UI$DomEvent$clearHandlers(element) {
	/// <summary locid="M:J#Sys.UI.DomEvent.clearHandlers" />
	/// <param name="element"></param>
	var e = Function._validateParams(arguments, [
        { name: "element" }
    ]);
	if (e) throw e;
	Sys.UI.DomEvent._ensureDomNode(element);
	Sys.UI.DomEvent._clearHandlers(element, false);
}
Sys.UI.DomEvent._clearHandlers = function Sys$UI$DomEvent$_clearHandlers(element, autoRemoving) {
	if (element._events) {
		var cache = element._events;
		for (var name in cache) {
			var handlers = cache[name];
			for (var i = handlers.length - 1; i >= 0; i--) {
				var entry = handlers[i];
				if (!autoRemoving || entry.autoRemove) {
					$removeHandler(element, name, entry.handler);
				}
			}
		}
		element._events = null;
	}
}
Sys.UI.DomEvent._disposeHandlers = function Sys$UI$DomEvent$_disposeHandlers() {
	Sys.UI.DomEvent._clearHandlers(this, true);
	var d = this._chainDispose, type = typeof (d);
	if (type !== "undefined") {
		this.dispose = d;
		this._chainDispose = null;
		if (type === "function") {
			this.dispose();
		}
	}
}
var $removeHandler = Sys.UI.DomEvent.removeHandler = function Sys$UI$DomEvent$removeHandler(element, eventName, handler) {
	/// <summary locid="M:J#Sys.UI.DomEvent.removeHandler" />
	/// <param name="element"></param>
	/// <param name="eventName" type="String"></param>
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "element" },
        { name: "eventName", type: String },
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	Sys.UI.DomEvent._removeHandler(element, eventName, handler);
}
Sys.UI.DomEvent._removeHandler = function Sys$UI$DomEvent$_removeHandler(element, eventName, handler) {
	Sys.UI.DomEvent._ensureDomNode(element);
	var browserHandler = null;
	if ((typeof (element._events) !== 'object') || !element._events) throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
	var cache = element._events[eventName];
	if (!(cache instanceof Array)) throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
	for (var i = 0, l = cache.length; i < l; i++) {
		if (cache[i].handler === handler) {
			browserHandler = cache[i].browserHandler;
			break;
		}
	}
	if (typeof (browserHandler) !== 'function') throw Error.invalidOperation(Sys.Res.eventHandlerInvalid);
	if (element.removeEventListener) {
		element.removeEventListener(eventName, browserHandler, false);
	}
	else if (element.detachEvent) {
		element.detachEvent('on' + eventName, browserHandler);
	}
	cache.splice(i, 1);
}
Sys.UI.DomEvent._ensureDomNode = function Sys$UI$DomEvent$_ensureDomNode(element) {
	if (element.tagName && (element.tagName.toUpperCase() === "SCRIPT")) return;

	var doc = element.ownerDocument || element.document || element;
	if ((typeof (element.document) !== 'object') && (element != doc) && (typeof (element.nodeType) !== 'number')) {
		throw Error.argument("element", Sys.Res.argumentDomNode);
	}
}

Sys.UI.DomElement = function Sys$UI$DomElement() {
	/// <summary locid="M:J#Sys.UI.DomElement.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
Sys.UI.DomElement.registerClass('Sys.UI.DomElement');
Sys.UI.DomElement.addCssClass = function Sys$UI$DomElement$addCssClass(element, className) {
	/// <summary locid="M:J#Sys.UI.DomElement.addCssClass" />
	/// <param name="element" domElement="true"></param>
	/// <param name="className" type="String"></param>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "className", type: String }
    ]);
	if (e) throw e;
	if (!Sys.UI.DomElement.containsCssClass(element, className)) {
		if (element.className === '') {
			element.className = className;
		}
		else {
			element.className += ' ' + className;
		}
	}
}
Sys.UI.DomElement.containsCssClass = function Sys$UI$DomElement$containsCssClass(element, className) {
	/// <summary locid="M:J#Sys.UI.DomElement.containsCssClass" />
	/// <param name="element" domElement="true"></param>
	/// <param name="className" type="String"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "className", type: String }
    ]);
	if (e) throw e;
	return Array.contains(element.className.split(' '), className);
}
Sys.UI.DomElement.getBounds = function Sys$UI$DomElement$getBounds(element) {
	/// <summary locid="M:J#Sys.UI.DomElement.getBounds" />
	/// <param name="element" domElement="true"></param>
	/// <returns type="Sys.UI.Bounds"></returns>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true }
    ]);
	if (e) throw e;
	var offset = Sys.UI.DomElement.getLocation(element);
	return new Sys.UI.Bounds(offset.x, offset.y, element.offsetWidth || 0, element.offsetHeight || 0);
}
var $get = Sys.UI.DomElement.getElementById = function Sys$UI$DomElement$getElementById(id, element) {
	/// <summary locid="M:J#Sys.UI.DomElement.getElementById" />
	/// <param name="id" type="String"></param>
	/// <param name="element" domElement="true" optional="true" mayBeNull="true"></param>
	/// <returns domElement="true" mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "id", type: String },
        { name: "element", mayBeNull: true, domElement: true, optional: true }
    ]);
	if (e) throw e;
	if (!element) return document.getElementById(id);
	if (element.getElementById) return element.getElementById(id);
	var nodeQueue = [];
	var childNodes = element.childNodes;
	for (var i = 0; i < childNodes.length; i++) {
		var node = childNodes[i];
		if (node.nodeType == 1) {
			nodeQueue[nodeQueue.length] = node;
		}
	}
	while (nodeQueue.length) {
		node = nodeQueue.shift();
		if (node.id == id) {
			return node;
		}
		childNodes = node.childNodes;
		for (i = 0; i < childNodes.length; i++) {
			node = childNodes[i];
			if (node.nodeType == 1) {
				nodeQueue[nodeQueue.length] = node;
			}
		}
	}
	return null;
}
if (document.documentElement.getBoundingClientRect) {
	Sys.UI.DomElement.getLocation = function Sys$UI$DomElement$getLocation(element) {
		/// <summary locid="M:J#Sys.UI.DomElement.getLocation" />
		/// <param name="element" domElement="true"></param>
		/// <returns type="Sys.UI.Point"></returns>
		var e = Function._validateParams(arguments, [
            { name: "element", domElement: true }
        ]);
		if (e) throw e;
		if (element.self || element.nodeType === 9 ||
            (element === document.documentElement) ||
            (element.parentNode === element.ownerDocument.documentElement)) {
			return new Sys.UI.Point(0, 0);
		}

		var clientRect = element.getBoundingClientRect();
		if (!clientRect) {
			return new Sys.UI.Point(0, 0);
		}
		var ex, documentElement = element.ownerDocument.documentElement,
            offsetX = Math.round(clientRect.left) + documentElement.scrollLeft,
            offsetY = Math.round(clientRect.top) + documentElement.scrollTop;
		if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
			try {
				var f = element.ownerDocument.parentWindow.frameElement || null;
				if (f) {
					var offset = (f.frameBorder === "0" || f.frameBorder === "no") ? 2 : 0;
					offsetX += offset;
					offsetY += offset;
				}
			}
			catch (ex) {
			}
			if (Sys.Browser.version === 7 && !document.documentMode) {
				var body = document.body,
                    rect = body.getBoundingClientRect(),
                    zoom = (rect.right - rect.left) / body.clientWidth;
				zoom = Math.round(zoom * 100);
				zoom = (zoom - zoom % 5) / 100;
				if (!isNaN(zoom) && (zoom !== 1)) {
					offsetX = Math.round(offsetX / zoom);
					offsetY = Math.round(offsetY / zoom);
				}
			}
			if ((document.documentMode || 0) < 8) {
				offsetX -= documentElement.clientLeft;
				offsetY -= documentElement.clientTop;
			}
		}
		return new Sys.UI.Point(offsetX, offsetY);
	}
}
else if (Sys.Browser.agent === Sys.Browser.Safari) {
	Sys.UI.DomElement.getLocation = function Sys$UI$DomElement$getLocation(element) {
		/// <summary locid="M:J#Sys.UI.DomElement.getLocation" />
		/// <param name="element" domElement="true"></param>
		/// <returns type="Sys.UI.Point"></returns>
		var e = Function._validateParams(arguments, [
            { name: "element", domElement: true }
        ]);
		if (e) throw e;
		if ((element.window && (element.window === element)) || element.nodeType === 9) return new Sys.UI.Point(0, 0);
		var offsetX = 0, offsetY = 0,
            parent,
            previous = null,
            previousStyle = null,
            currentStyle;
		for (parent = element; parent; previous = parent, previousStyle = currentStyle, parent = parent.offsetParent) {
			currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
			var tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
			if ((parent.offsetLeft || parent.offsetTop) &&
                ((tagName !== "BODY") || (!previousStyle || previousStyle.position !== "absolute"))) {
				offsetX += parent.offsetLeft;
				offsetY += parent.offsetTop;
			}
			if (previous && Sys.Browser.version >= 3) {
				offsetX += parseInt(currentStyle.borderLeftWidth);
				offsetY += parseInt(currentStyle.borderTopWidth);
			}
		}
		currentStyle = Sys.UI.DomElement._getCurrentStyle(element);
		var elementPosition = currentStyle ? currentStyle.position : null;
		if (!elementPosition || (elementPosition !== "absolute")) {
			for (parent = element.parentNode; parent; parent = parent.parentNode) {
				tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
				if ((tagName !== "BODY") && (tagName !== "HTML") && (parent.scrollLeft || parent.scrollTop)) {
					offsetX -= (parent.scrollLeft || 0);
					offsetY -= (parent.scrollTop || 0);
				}
				currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
				var parentPosition = currentStyle ? currentStyle.position : null;
				if (parentPosition && (parentPosition === "absolute")) break;
			}
		}
		return new Sys.UI.Point(offsetX, offsetY);
	}
}
else {
	Sys.UI.DomElement.getLocation = function Sys$UI$DomElement$getLocation(element) {
		/// <summary locid="M:J#Sys.UI.DomElement.getLocation" />
		/// <param name="element" domElement="true"></param>
		/// <returns type="Sys.UI.Point"></returns>
		var e = Function._validateParams(arguments, [
            { name: "element", domElement: true }
        ]);
		if (e) throw e;
		if ((element.window && (element.window === element)) || element.nodeType === 9) return new Sys.UI.Point(0, 0);
		var offsetX = 0, offsetY = 0,
            parent,
            previous = null,
            previousStyle = null,
            currentStyle = null;
		for (parent = element; parent; previous = parent, previousStyle = currentStyle, parent = parent.offsetParent) {
			var tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
			currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
			if ((parent.offsetLeft || parent.offsetTop) &&
                !((tagName === "BODY") &&
                (!previousStyle || previousStyle.position !== "absolute"))) {
				offsetX += parent.offsetLeft;
				offsetY += parent.offsetTop;
			}
			if (previous !== null && currentStyle) {
				if ((tagName !== "TABLE") && (tagName !== "TD") && (tagName !== "HTML")) {
					offsetX += parseInt(currentStyle.borderLeftWidth) || 0;
					offsetY += parseInt(currentStyle.borderTopWidth) || 0;
				}
				if (tagName === "TABLE" &&
                    (currentStyle.position === "relative" || currentStyle.position === "absolute")) {
					offsetX += parseInt(currentStyle.marginLeft) || 0;
					offsetY += parseInt(currentStyle.marginTop) || 0;
				}
			}
		}
		currentStyle = Sys.UI.DomElement._getCurrentStyle(element);
		var elementPosition = currentStyle ? currentStyle.position : null;
		if (!elementPosition || (elementPosition !== "absolute")) {
			for (parent = element.parentNode; parent; parent = parent.parentNode) {
				tagName = parent.tagName ? parent.tagName.toUpperCase() : null;
				if ((tagName !== "BODY") && (tagName !== "HTML") && (parent.scrollLeft || parent.scrollTop)) {
					offsetX -= (parent.scrollLeft || 0);
					offsetY -= (parent.scrollTop || 0);
					currentStyle = Sys.UI.DomElement._getCurrentStyle(parent);
					if (currentStyle) {
						offsetX += parseInt(currentStyle.borderLeftWidth) || 0;
						offsetY += parseInt(currentStyle.borderTopWidth) || 0;
					}
				}
			}
		}
		return new Sys.UI.Point(offsetX, offsetY);
	}
}
Sys.UI.DomElement.isDomElement = function Sys$UI$DomElement$isDomElement(obj) {
	/// <summary locid="M:J#Sys.UI.DomElement.isDomElement" />
	/// <param name="obj"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "obj" }
    ]);
	if (e) throw e;
	return Sys._isDomElement(obj);
}
Sys.UI.DomElement.removeCssClass = function Sys$UI$DomElement$removeCssClass(element, className) {
	/// <summary locid="M:J#Sys.UI.DomElement.removeCssClass" />
	/// <param name="element" domElement="true"></param>
	/// <param name="className" type="String"></param>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "className", type: String }
    ]);
	if (e) throw e;
	var currentClassName = ' ' + element.className + ' ';
	var index = currentClassName.indexOf(' ' + className + ' ');
	if (index >= 0) {
		element.className = (currentClassName.substr(0, index) + ' ' +
            currentClassName.substring(index + className.length + 1, currentClassName.length)).trim();
	}
}
Sys.UI.DomElement.resolveElement = function Sys$UI$DomElement$resolveElement(elementOrElementId, containerElement) {
	/// <summary locid="M:J#Sys.UI.DomElement.resolveElement" />
	/// <param name="elementOrElementId" mayBeNull="true"></param>
	/// <param name="containerElement" domElement="true" optional="true" mayBeNull="true"></param>
	/// <returns domElement="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "elementOrElementId", mayBeNull: true },
        { name: "containerElement", mayBeNull: true, domElement: true, optional: true }
    ]);
	if (e) throw e;
	var el = elementOrElementId;
	if (!el) return null;
	if (typeof (el) === "string") {
		el = Sys.UI.DomElement.getElementById(el, containerElement);
		if (!el) {
			throw Error.argument("elementOrElementId", String.format(Sys.Res.elementNotFound, elementOrElementId));
		}
	}
	else if (!Sys.UI.DomElement.isDomElement(el)) {
		throw Error.argument("elementOrElementId", Sys.Res.expectedElementOrId);
	}
	return el;
}
Sys.UI.DomElement.raiseBubbleEvent = function Sys$UI$DomElement$raiseBubbleEvent(source, args) {
	/// <summary locid="M:J#Sys.UI.DomElement.raiseBubbleEvent" />
	/// <param name="source" domElement="true"></param>
	/// <param name="args" type="Sys.EventArgs"></param>
	var e = Function._validateParams(arguments, [
        { name: "source", domElement: true },
        { name: "args", type: Sys.EventArgs }
    ]);
	if (e) throw e;
	var target = source;
	while (target) {
		var control = target.control;
		if (control && control.onBubbleEvent && control.raiseBubbleEvent) {
			Sys.UI.DomElement._raiseBubbleEventFromControl(control, source, args);
			return;
		}
		target = target.parentNode;
	}
}
Sys.UI.DomElement._raiseBubbleEventFromControl = function Sys$UI$DomElement$_raiseBubbleEventFromControl(control, source, args) {
	if (!control.onBubbleEvent(source, args)) {
		control._raiseBubbleEvent(source, args);
	}
}
Sys.UI.DomElement.setLocation = function Sys$UI$DomElement$setLocation(element, x, y) {
	/// <summary locid="M:J#Sys.UI.DomElement.setLocation" />
	/// <param name="element" domElement="true"></param>
	/// <param name="x" type="Number" integer="true"></param>
	/// <param name="y" type="Number" integer="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "x", type: Number, integer: true },
        { name: "y", type: Number, integer: true }
    ]);
	if (e) throw e;
	var style = element.style;
	style.position = 'absolute';
	style.left = x + "px";
	style.top = y + "px";
}
Sys.UI.DomElement.toggleCssClass = function Sys$UI$DomElement$toggleCssClass(element, className) {
	/// <summary locid="M:J#Sys.UI.DomElement.toggleCssClass" />
	/// <param name="element" domElement="true"></param>
	/// <param name="className" type="String"></param>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "className", type: String }
    ]);
	if (e) throw e;
	if (Sys.UI.DomElement.containsCssClass(element, className)) {
		Sys.UI.DomElement.removeCssClass(element, className);
	}
	else {
		Sys.UI.DomElement.addCssClass(element, className);
	}
}
Sys.UI.DomElement.getVisibilityMode = function Sys$UI$DomElement$getVisibilityMode(element) {
	/// <summary locid="M:J#Sys.UI.DomElement.getVisibilityMode" />
	/// <param name="element" domElement="true"></param>
	/// <returns type="Sys.UI.VisibilityMode"></returns>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true }
    ]);
	if (e) throw e;
	return (element._visibilityMode === Sys.UI.VisibilityMode.hide) ?
        Sys.UI.VisibilityMode.hide :
        Sys.UI.VisibilityMode.collapse;
}
Sys.UI.DomElement.setVisibilityMode = function Sys$UI$DomElement$setVisibilityMode(element, value) {
	/// <summary locid="M:J#Sys.UI.DomElement.setVisibilityMode" />
	/// <param name="element" domElement="true"></param>
	/// <param name="value" type="Sys.UI.VisibilityMode"></param>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "value", type: Sys.UI.VisibilityMode }
    ]);
	if (e) throw e;
	Sys.UI.DomElement._ensureOldDisplayMode(element);
	if (element._visibilityMode !== value) {
		element._visibilityMode = value;
		if (Sys.UI.DomElement.getVisible(element) === false) {
			if (element._visibilityMode === Sys.UI.VisibilityMode.hide) {
				element.style.display = element._oldDisplayMode;
			}
			else {
				element.style.display = 'none';
			}
		}
		element._visibilityMode = value;
	}
}
Sys.UI.DomElement.getVisible = function Sys$UI$DomElement$getVisible(element) {
	/// <summary locid="M:J#Sys.UI.DomElement.getVisible" />
	/// <param name="element" domElement="true"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true }
    ]);
	if (e) throw e;
	var style = element.currentStyle || Sys.UI.DomElement._getCurrentStyle(element);
	if (!style) return true;
	return (style.visibility !== 'hidden') && (style.display !== 'none');
}
Sys.UI.DomElement.setVisible = function Sys$UI$DomElement$setVisible(element, value) {
	/// <summary locid="M:J#Sys.UI.DomElement.setVisible" />
	/// <param name="element" domElement="true"></param>
	/// <param name="value" type="Boolean"></param>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "value", type: Boolean }
    ]);
	if (e) throw e;
	if (value !== Sys.UI.DomElement.getVisible(element)) {
		Sys.UI.DomElement._ensureOldDisplayMode(element);
		element.style.visibility = value ? 'visible' : 'hidden';
		if (value || (element._visibilityMode === Sys.UI.VisibilityMode.hide)) {
			element.style.display = element._oldDisplayMode;
		}
		else {
			element.style.display = 'none';
		}
	}
}
Sys.UI.DomElement._ensureOldDisplayMode = function Sys$UI$DomElement$_ensureOldDisplayMode(element) {
	if (!element._oldDisplayMode) {
		var style = element.currentStyle || Sys.UI.DomElement._getCurrentStyle(element);
		element._oldDisplayMode = style ? style.display : null;
		if (!element._oldDisplayMode || element._oldDisplayMode === 'none') {
			switch (element.tagName.toUpperCase()) {
				case 'DIV': case 'P': case 'ADDRESS': case 'BLOCKQUOTE': case 'BODY': case 'COL':
				case 'COLGROUP': case 'DD': case 'DL': case 'DT': case 'FIELDSET': case 'FORM':
				case 'H1': case 'H2': case 'H3': case 'H4': case 'H5': case 'H6': case 'HR':
				case 'IFRAME': case 'LEGEND': case 'OL': case 'PRE': case 'TABLE': case 'TD':
				case 'TH': case 'TR': case 'UL':
					element._oldDisplayMode = 'block';
					break;
				case 'LI':
					element._oldDisplayMode = 'list-item';
					break;
				default:
					element._oldDisplayMode = 'inline';
			}
		}
	}
}
Sys.UI.DomElement._getWindow = function Sys$UI$DomElement$_getWindow(element) {
	var doc = element.ownerDocument || element.document || element;
	return doc.defaultView || doc.parentWindow;
}
Sys.UI.DomElement._getCurrentStyle = function Sys$UI$DomElement$_getCurrentStyle(element) {
	if (element.nodeType === 3) return null;
	var w = Sys.UI.DomElement._getWindow(element);
	if (element.documentElement) element = element.documentElement;
	var computedStyle = (w && (element !== w) && w.getComputedStyle) ?
        w.getComputedStyle(element, null) :
        element.currentStyle || element.style;
	if (!computedStyle && (Sys.Browser.agent === Sys.Browser.Safari) && element.style) {
		var oldDisplay = element.style.display;
		var oldPosition = element.style.position;
		element.style.position = 'absolute';
		element.style.display = 'block';
		var style = w.getComputedStyle(element, null);
		element.style.display = oldDisplay;
		element.style.position = oldPosition;
		computedStyle = {};
		for (var n in style) {
			computedStyle[n] = style[n];
		}
		computedStyle.display = 'none';
	}
	return computedStyle;
}

Sys.IContainer = function Sys$IContainer() {
	throw Error.notImplemented();
}
function Sys$IContainer$addComponent(component) {
	/// <summary locid="M:J#Sys.IContainer.addComponent" />
	/// <param name="component" type="Sys.Component"></param>
	var e = Function._validateParams(arguments, [
            { name: "component", type: Sys.Component }
        ]);
	if (e) throw e;
	throw Error.notImplemented();
}
function Sys$IContainer$removeComponent(component) {
	/// <summary locid="M:J#Sys.IContainer.removeComponent" />
	/// <param name="component" type="Sys.Component"></param>
	var e = Function._validateParams(arguments, [
            { name: "component", type: Sys.Component }
        ]);
	if (e) throw e;
	throw Error.notImplemented();
}
function Sys$IContainer$findComponent(id) {
	/// <summary locid="M:J#Sys.IContainer.findComponent" />
	/// <param name="id" type="String"></param>
	/// <returns type="Sys.Component"></returns>
	var e = Function._validateParams(arguments, [
            { name: "id", type: String }
        ]);
	if (e) throw e;
	throw Error.notImplemented();
}
function Sys$IContainer$getComponents() {
	/// <summary locid="M:J#Sys.IContainer.getComponents" />
	/// <returns type="Array" elementType="Sys.Component"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
Sys.IContainer.prototype = {
	addComponent: Sys$IContainer$addComponent,
	removeComponent: Sys$IContainer$removeComponent,
	findComponent: Sys$IContainer$findComponent,
	getComponents: Sys$IContainer$getComponents
}
Sys.IContainer.registerInterface("Sys.IContainer");

Sys.ApplicationLoadEventArgs = function Sys$ApplicationLoadEventArgs(components, isPartialLoad) {
	/// <summary locid="M:J#Sys.ApplicationLoadEventArgs.#ctor" />
	/// <param name="components" type="Array" elementType="Sys.Component"></param>
	/// <param name="isPartialLoad" type="Boolean"></param>
	var e = Function._validateParams(arguments, [
        { name: "components", type: Array, elementType: Sys.Component },
        { name: "isPartialLoad", type: Boolean }
    ]);
	if (e) throw e;
	Sys.ApplicationLoadEventArgs.initializeBase(this);
	this._components = components;
	this._isPartialLoad = isPartialLoad;
}

function Sys$ApplicationLoadEventArgs$get_components() {
	/// <value type="Array" elementType="Sys.Component" locid="P:J#Sys.ApplicationLoadEventArgs.components"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._components;
}
function Sys$ApplicationLoadEventArgs$get_isPartialLoad() {
	/// <value type="Boolean" locid="P:J#Sys.ApplicationLoadEventArgs.isPartialLoad"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._isPartialLoad;
}
Sys.ApplicationLoadEventArgs.prototype = {
	get_components: Sys$ApplicationLoadEventArgs$get_components,
	get_isPartialLoad: Sys$ApplicationLoadEventArgs$get_isPartialLoad
}
Sys.ApplicationLoadEventArgs.registerClass('Sys.ApplicationLoadEventArgs', Sys.EventArgs);

Sys._Application = function Sys$_Application() {
	/// <summary locid="M:J#Sys.Application.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	Sys._Application.initializeBase(this);
	this._disposableObjects = [];
	this._components = {};
	this._createdComponents = [];
	this._secondPassComponents = [];
	this._unloadHandlerDelegate = Function.createDelegate(this, this._unloadHandler);
	Sys.UI.DomEvent.addHandler(window, "unload", this._unloadHandlerDelegate);
	this._domReady();
}
function Sys$_Application$get_isCreatingComponents() {
	/// <value type="Boolean" locid="P:J#Sys.Application.isCreatingComponents"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._creatingComponents;
}
function Sys$_Application$get_isDisposing() {
	/// <value type="Boolean" locid="P:J#Sys.Application.isDisposing"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._disposing;
}
function Sys$_Application$add_init(handler) {
	/// <summary locid="E:J#Sys.Application.init" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	if (this._initialized) {
		handler(this, Sys.EventArgs.Empty);
	}
	else {
		this.get_events().addHandler("init", handler);
	}
}
function Sys$_Application$remove_init(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().removeHandler("init", handler);
}
function Sys$_Application$add_load(handler) {
	/// <summary locid="E:J#Sys.Application.load" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().addHandler("load", handler);
}
function Sys$_Application$remove_load(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().removeHandler("load", handler);
}
function Sys$_Application$add_unload(handler) {
	/// <summary locid="E:J#Sys.Application.unload" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().addHandler("unload", handler);
}
function Sys$_Application$remove_unload(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this.get_events().removeHandler("unload", handler);
}
function Sys$_Application$addComponent(component) {
	/// <summary locid="M:J#Sys.Application.addComponent" />
	/// <param name="component" type="Sys.Component"></param>
	var e = Function._validateParams(arguments, [
            { name: "component", type: Sys.Component }
        ]);
	if (e) throw e;
	var id = component.get_id();
	if (!id) throw Error.invalidOperation(Sys.Res.cantAddWithoutId);
	if (typeof (this._components[id]) !== 'undefined') throw Error.invalidOperation(String.format(Sys.Res.appDuplicateComponent, id));
	this._components[id] = component;
}
function Sys$_Application$beginCreateComponents() {
	/// <summary locid="M:J#Sys.Application.beginCreateComponents" />
	if (arguments.length !== 0) throw Error.parameterCount();
	this._creatingComponents = true;
}
function Sys$_Application$dispose() {
	/// <summary locid="M:J#Sys.Application.dispose" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._disposing) {
		this._disposing = true;
		if (this._timerCookie) {
			window.clearTimeout(this._timerCookie);
			delete this._timerCookie;
		}
		if (this._endRequestHandler) {
			Sys.WebForms.PageRequestManager.getInstance().remove_endRequest(this._endRequestHandler);
			delete this._endRequestHandler;
		}
		if (this._beginRequestHandler) {
			Sys.WebForms.PageRequestManager.getInstance().remove_beginRequest(this._beginRequestHandler);
			delete this._beginRequestHandler;
		}
		if (window.pageUnload) {
			window.pageUnload(this, Sys.EventArgs.Empty);
		}
		var unloadHandler = this.get_events().getHandler("unload");
		if (unloadHandler) {
			unloadHandler(this, Sys.EventArgs.Empty);
		}
		var disposableObjects = Array.clone(this._disposableObjects);
		for (var i = 0, l = disposableObjects.length; i < l; i++) {
			var object = disposableObjects[i];
			if (typeof (object) !== "undefined") {
				object.dispose();
			}
		}
		Array.clear(this._disposableObjects);
		Sys.UI.DomEvent.removeHandler(window, "unload", this._unloadHandlerDelegate);
		if (Sys._ScriptLoader) {
			var sl = Sys._ScriptLoader.getInstance();
			if (sl) {
				sl.dispose();
			}
		}
		Sys._Application.callBaseMethod(this, 'dispose');
	}
}
function Sys$_Application$disposeElement(element, childNodesOnly) {
	/// <summary locid="M:J#Sys._Application.disposeElement" />
	/// <param name="element"></param>
	/// <param name="childNodesOnly" type="Boolean"></param>
	var e = Function._validateParams(arguments, [
            { name: "element" },
            { name: "childNodesOnly", type: Boolean }
        ]);
	if (e) throw e;
	if (element.nodeType === 1) {
		var i, allElements = element.getElementsByTagName("*"),
                length = allElements.length,
                children = new Array(length);
		for (i = 0; i < length; i++) {
			children[i] = allElements[i];
		}
		for (i = length - 1; i >= 0; i--) {
			var child = children[i];
			var d = child.dispose;
			if (d && typeof (d) === "function") {
				child.dispose();
			}
			else {
				var c = child.control;
				if (c && typeof (c.dispose) === "function") {
					c.dispose();
				}
			}
			var list = child._behaviors;
			if (list) {
				this._disposeComponents(list);
			}
			list = child._components;
			if (list) {
				this._disposeComponents(list);
				child._components = null;
			}
		}
		if (!childNodesOnly) {
			var d = element.dispose;
			if (d && typeof (d) === "function") {
				element.dispose();
			}
			else {
				var c = element.control;
				if (c && typeof (c.dispose) === "function") {
					c.dispose();
				}
			}
			var list = element._behaviors;
			if (list) {
				this._disposeComponents(list);
			}
			list = element._components;
			if (list) {
				this._disposeComponents(list);
				element._components = null;
			}
		}
	}
}
function Sys$_Application$endCreateComponents() {
	/// <summary locid="M:J#Sys.Application.endCreateComponents" />
	if (arguments.length !== 0) throw Error.parameterCount();
	var components = this._secondPassComponents;
	for (var i = 0, l = components.length; i < l; i++) {
		var component = components[i].component;
		Sys$Component$_setReferences(component, components[i].references);
		component.endUpdate();
	}
	this._secondPassComponents = [];
	this._creatingComponents = false;
}
function Sys$_Application$findComponent(id, parent) {
	/// <summary locid="M:J#Sys.Application.findComponent" />
	/// <param name="id" type="String"></param>
	/// <param name="parent" optional="true" mayBeNull="true"></param>
	/// <returns type="Sys.Component" mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
            { name: "id", type: String },
            { name: "parent", mayBeNull: true, optional: true }
        ]);
	if (e) throw e;
	return (parent ?
            ((Sys.IContainer.isInstanceOfType(parent)) ?
                parent.findComponent(id) :
                parent[id] || null) :
            Sys.Application._components[id] || null);
}
function Sys$_Application$getComponents() {
	/// <summary locid="M:J#Sys.Application.getComponents" />
	/// <returns type="Array" elementType="Sys.Component"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	var res = [];
	var components = this._components;
	for (var name in components) {
		res[res.length] = components[name];
	}
	return res;
}
function Sys$_Application$initialize() {
	/// <summary locid="M:J#Sys.Application.initialize" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this.get_isInitialized() && !this._disposing) {
		Sys._Application.callBaseMethod(this, 'initialize');
		this._raiseInit();
		if (this.get_stateString) {
			if (Sys.WebForms && Sys.WebForms.PageRequestManager) {
				this._beginRequestHandler = Function.createDelegate(this, this._onPageRequestManagerBeginRequest);
				Sys.WebForms.PageRequestManager.getInstance().add_beginRequest(this._beginRequestHandler);
				this._endRequestHandler = Function.createDelegate(this, this._onPageRequestManagerEndRequest);
				Sys.WebForms.PageRequestManager.getInstance().add_endRequest(this._endRequestHandler);
			}
			var loadedEntry = this.get_stateString();
			if (loadedEntry !== this._currentEntry) {
				this._navigate(loadedEntry);
			}
			else {
				this._ensureHistory();
			}
		}
		this.raiseLoad();
	}
}
function Sys$_Application$notifyScriptLoaded() {
	/// <summary locid="M:J#Sys.Application.notifyScriptLoaded" />
	if (arguments.length !== 0) throw Error.parameterCount();
}
function Sys$_Application$registerDisposableObject(object) {
	/// <summary locid="M:J#Sys.Application.registerDisposableObject" />
	/// <param name="object" type="Sys.IDisposable"></param>
	var e = Function._validateParams(arguments, [
            { name: "object", type: Sys.IDisposable }
        ]);
	if (e) throw e;
	if (!this._disposing) {
		var objects = this._disposableObjects,
                i = objects.length;
		objects[i] = object;
		object.__msdisposeindex = i;
	}
}
function Sys$_Application$raiseLoad() {
	/// <summary locid="M:J#Sys.Application.raiseLoad" />
	if (arguments.length !== 0) throw Error.parameterCount();
	var h = this.get_events().getHandler("load");
	var args = new Sys.ApplicationLoadEventArgs(Array.clone(this._createdComponents), !!this._loaded);
	this._loaded = true;
	if (h) {
		h(this, args);
	}
	if (window.pageLoad) {
		window.pageLoad(this, args);
	}
	this._createdComponents = [];
}
function Sys$_Application$removeComponent(component) {
	/// <summary locid="M:J#Sys.Application.removeComponent" />
	/// <param name="component" type="Sys.Component"></param>
	var e = Function._validateParams(arguments, [
            { name: "component", type: Sys.Component }
        ]);
	if (e) throw e;
	var id = component.get_id();
	if (id) delete this._components[id];
}
function Sys$_Application$unregisterDisposableObject(object) {
	/// <summary locid="M:J#Sys.Application.unregisterDisposableObject" />
	/// <param name="object" type="Sys.IDisposable"></param>
	var e = Function._validateParams(arguments, [
            { name: "object", type: Sys.IDisposable }
        ]);
	if (e) throw e;
	if (!this._disposing) {
		var i = object.__msdisposeindex;
		if (typeof (i) === "number") {
			var disposableObjects = this._disposableObjects;
			delete disposableObjects[i];
			delete object.__msdisposeindex;
			if (++this._deleteCount > 1000) {
				var newArray = [];
				for (var j = 0, l = disposableObjects.length; j < l; j++) {
					object = disposableObjects[j];
					if (typeof (object) !== "undefined") {
						object.__msdisposeindex = newArray.length;
						newArray.push(object);
					}
				}
				this._disposableObjects = newArray;
				this._deleteCount = 0;
			}
		}
	}
}
function Sys$_Application$_addComponentToSecondPass(component, references) {
	this._secondPassComponents[this._secondPassComponents.length] = { component: component, references: references };
}
function Sys$_Application$_disposeComponents(list) {
	if (list) {
		for (var i = list.length - 1; i >= 0; i--) {
			var item = list[i];
			if (typeof (item.dispose) === "function") {
				item.dispose();
			}
		}
	}
}
function Sys$_Application$_domReady() {
	var check, er, app = this;
	function init() { app.initialize(); }
	var onload = function () {
		Sys.UI.DomEvent.removeHandler(window, "load", onload);
		init();
	}
	Sys.UI.DomEvent.addHandler(window, "load", onload);

	if (document.addEventListener) {
		try {
			document.addEventListener("DOMContentLoaded", check = function () {
				document.removeEventListener("DOMContentLoaded", check, false);
				init();
			}, false);
		}
		catch (er) { }
	}
	else if (document.attachEvent) {
		if ((window == window.top) && document.documentElement.doScroll) {
			var timeout, el = document.createElement("div");
			check = function () {
				try {
					el.doScroll("left");
				}
				catch (er) {
					timeout = window.setTimeout(check, 0);
					return;
				}
				el = null;
				init();
			}
			check();
		}
		else {
			document.attachEvent("onreadystatechange", check = function () {
				if (document.readyState === "complete") {
					document.detachEvent("onreadystatechange", check);
					init();
				}
			});
		}
	}
}
function Sys$_Application$_raiseInit() {
	var handler = this.get_events().getHandler("init");
	if (handler) {
		this.beginCreateComponents();
		handler(this, Sys.EventArgs.Empty);
		this.endCreateComponents();
	}
}
function Sys$_Application$_unloadHandler(event) {
	this.dispose();
}
Sys._Application.prototype = {
	_creatingComponents: false,
	_disposing: false,
	_deleteCount: 0,
	get_isCreatingComponents: Sys$_Application$get_isCreatingComponents,
	get_isDisposing: Sys$_Application$get_isDisposing,
	add_init: Sys$_Application$add_init,
	remove_init: Sys$_Application$remove_init,
	add_load: Sys$_Application$add_load,
	remove_load: Sys$_Application$remove_load,
	add_unload: Sys$_Application$add_unload,
	remove_unload: Sys$_Application$remove_unload,
	addComponent: Sys$_Application$addComponent,
	beginCreateComponents: Sys$_Application$beginCreateComponents,
	dispose: Sys$_Application$dispose,
	disposeElement: Sys$_Application$disposeElement,
	endCreateComponents: Sys$_Application$endCreateComponents,
	findComponent: Sys$_Application$findComponent,
	getComponents: Sys$_Application$getComponents,
	initialize: Sys$_Application$initialize,
	notifyScriptLoaded: Sys$_Application$notifyScriptLoaded,
	registerDisposableObject: Sys$_Application$registerDisposableObject,
	raiseLoad: Sys$_Application$raiseLoad,
	removeComponent: Sys$_Application$removeComponent,
	unregisterDisposableObject: Sys$_Application$unregisterDisposableObject,
	_addComponentToSecondPass: Sys$_Application$_addComponentToSecondPass,
	_disposeComponents: Sys$_Application$_disposeComponents,
	_domReady: Sys$_Application$_domReady,
	_raiseInit: Sys$_Application$_raiseInit,
	_unloadHandler: Sys$_Application$_unloadHandler
}
Sys._Application.registerClass('Sys._Application', Sys.Component, Sys.IContainer);
Sys.Application = new Sys._Application();
var $find = Sys.Application.findComponent;

Sys.UI.Behavior = function Sys$UI$Behavior(element) {
	/// <summary locid="M:J#Sys.UI.Behavior.#ctor" />
	/// <param name="element" domElement="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true }
    ]);
	if (e) throw e;
	Sys.UI.Behavior.initializeBase(this);
	this._element = element;
	var behaviors = element._behaviors;
	if (!behaviors) {
		element._behaviors = [this];
	}
	else {
		behaviors[behaviors.length] = this;
	}
}
function Sys$UI$Behavior$get_element() {
	/// <value domElement="true" locid="P:J#Sys.UI.Behavior.element"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._element;
}
function Sys$UI$Behavior$get_id() {
	/// <value type="String" locid="P:J#Sys.UI.Behavior.id"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	var baseId = Sys.UI.Behavior.callBaseMethod(this, 'get_id');
	if (baseId) return baseId;
	if (!this._element || !this._element.id) return '';
	return this._element.id + '$' + this.get_name();
}
function Sys$UI$Behavior$get_name() {
	/// <value type="String" locid="P:J#Sys.UI.Behavior.name"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this._name) return this._name;
	var name = Object.getTypeName(this);
	var i = name.lastIndexOf('.');
	if (i !== -1) name = name.substr(i + 1);
	if (!this.get_isInitialized()) this._name = name;
	return name;
}
function Sys$UI$Behavior$set_name(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: String}]);
	if (e) throw e;
	if ((value === '') || (value.charAt(0) === ' ') || (value.charAt(value.length - 1) === ' '))
		throw Error.argument('value', Sys.Res.invalidId);
	if (typeof (this._element[value]) !== 'undefined')
		throw Error.invalidOperation(String.format(Sys.Res.behaviorDuplicateName, value));
	if (this.get_isInitialized()) throw Error.invalidOperation(Sys.Res.cantSetNameAfterInit);
	this._name = value;
}
function Sys$UI$Behavior$initialize() {
	Sys.UI.Behavior.callBaseMethod(this, 'initialize');
	var name = this.get_name();
	if (name) this._element[name] = this;
}
function Sys$UI$Behavior$dispose() {
	Sys.UI.Behavior.callBaseMethod(this, 'dispose');
	var e = this._element;
	if (e) {
		var name = this.get_name();
		if (name) {
			e[name] = null;
		}
		var behaviors = e._behaviors;
		Array.remove(behaviors, this);
		if (behaviors.length === 0) {
			e._behaviors = null;
		}
		delete this._element;
	}
}
Sys.UI.Behavior.prototype = {
	_name: null,
	get_element: Sys$UI$Behavior$get_element,
	get_id: Sys$UI$Behavior$get_id,
	get_name: Sys$UI$Behavior$get_name,
	set_name: Sys$UI$Behavior$set_name,
	initialize: Sys$UI$Behavior$initialize,
	dispose: Sys$UI$Behavior$dispose
}
Sys.UI.Behavior.registerClass('Sys.UI.Behavior', Sys.Component);
Sys.UI.Behavior.getBehaviorByName = function Sys$UI$Behavior$getBehaviorByName(element, name) {
	/// <summary locid="M:J#Sys.UI.Behavior.getBehaviorByName" />
	/// <param name="element" domElement="true"></param>
	/// <param name="name" type="String"></param>
	/// <returns type="Sys.UI.Behavior" mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "name", type: String }
    ]);
	if (e) throw e;
	var b = element[name];
	return (b && Sys.UI.Behavior.isInstanceOfType(b)) ? b : null;
}
Sys.UI.Behavior.getBehaviors = function Sys$UI$Behavior$getBehaviors(element) {
	/// <summary locid="M:J#Sys.UI.Behavior.getBehaviors" />
	/// <param name="element" domElement="true"></param>
	/// <returns type="Array" elementType="Sys.UI.Behavior"></returns>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true }
    ]);
	if (e) throw e;
	if (!element._behaviors) return [];
	return Array.clone(element._behaviors);
}
Sys.UI.Behavior.getBehaviorsByType = function Sys$UI$Behavior$getBehaviorsByType(element, type) {
	/// <summary locid="M:J#Sys.UI.Behavior.getBehaviorsByType" />
	/// <param name="element" domElement="true"></param>
	/// <param name="type" type="Type"></param>
	/// <returns type="Array" elementType="Sys.UI.Behavior"></returns>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true },
        { name: "type", type: Type }
    ]);
	if (e) throw e;
	var behaviors = element._behaviors;
	var results = [];
	if (behaviors) {
		for (var i = 0, l = behaviors.length; i < l; i++) {
			if (type.isInstanceOfType(behaviors[i])) {
				results[results.length] = behaviors[i];
			}
		}
	}
	return results;
}

Sys.UI.VisibilityMode = function Sys$UI$VisibilityMode() {
	/// <summary locid="M:J#Sys.UI.VisibilityMode.#ctor" />
	/// <field name="hide" type="Number" integer="true" static="true" locid="F:J#Sys.UI.VisibilityMode.hide"></field>
	/// <field name="collapse" type="Number" integer="true" static="true" locid="F:J#Sys.UI.VisibilityMode.collapse"></field>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
Sys.UI.VisibilityMode.prototype = {
	hide: 0,
	collapse: 1
}
Sys.UI.VisibilityMode.registerEnum("Sys.UI.VisibilityMode");

Sys.UI.Control = function Sys$UI$Control(element) {
	/// <summary locid="M:J#Sys.UI.Control.#ctor" />
	/// <param name="element" domElement="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "element", domElement: true }
    ]);
	if (e) throw e;
	if (typeof (element.control) !== 'undefined') throw Error.invalidOperation(Sys.Res.controlAlreadyDefined);
	Sys.UI.Control.initializeBase(this);
	this._element = element;
	element.control = this;
	var role = this.get_role();
	if (role) {
		element.setAttribute("role", role);
	}
}
function Sys$UI$Control$get_element() {
	/// <value domElement="true" locid="P:J#Sys.UI.Control.element"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._element;
}
function Sys$UI$Control$get_id() {
	/// <value type="String" locid="P:J#Sys.UI.Control.id"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._element) return '';
	return this._element.id;
}
function Sys$UI$Control$set_id(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: String}]);
	if (e) throw e;
	throw Error.invalidOperation(Sys.Res.cantSetId);
}
function Sys$UI$Control$get_parent() {
	/// <value type="Sys.UI.Control" locid="P:J#Sys.UI.Control.parent"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this._parent) return this._parent;
	if (!this._element) return null;

	var parentElement = this._element.parentNode;
	while (parentElement) {
		if (parentElement.control) {
			return parentElement.control;
		}
		parentElement = parentElement.parentNode;
	}
	return null;
}
function Sys$UI$Control$set_parent(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Sys.UI.Control}]);
	if (e) throw e;
	if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
	var parents = [this];
	var current = value;
	while (current) {
		if (Array.contains(parents, current)) throw Error.invalidOperation(Sys.Res.circularParentChain);
		parents[parents.length] = current;
		current = current.get_parent();
	}
	this._parent = value;
}
function Sys$UI$Control$get_role() {
	/// <value type="String" locid="P:J#Sys.UI.Control.role"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return null;
}
function Sys$UI$Control$get_visibilityMode() {
	/// <value type="Sys.UI.VisibilityMode" locid="P:J#Sys.UI.Control.visibilityMode"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
	return Sys.UI.DomElement.getVisibilityMode(this._element);
}
function Sys$UI$Control$set_visibilityMode(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Sys.UI.VisibilityMode}]);
	if (e) throw e;
	if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
	Sys.UI.DomElement.setVisibilityMode(this._element, value);
}
function Sys$UI$Control$get_visible() {
	/// <value type="Boolean" locid="P:J#Sys.UI.Control.visible"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
	return Sys.UI.DomElement.getVisible(this._element);
}
function Sys$UI$Control$set_visible(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Boolean}]);
	if (e) throw e;
	if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
	Sys.UI.DomElement.setVisible(this._element, value)
}
function Sys$UI$Control$addCssClass(className) {
	/// <summary locid="M:J#Sys.UI.Control.addCssClass" />
	/// <param name="className" type="String"></param>
	var e = Function._validateParams(arguments, [
            { name: "className", type: String }
        ]);
	if (e) throw e;
	if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
	Sys.UI.DomElement.addCssClass(this._element, className);
}
function Sys$UI$Control$dispose() {
	Sys.UI.Control.callBaseMethod(this, 'dispose');
	if (this._element) {
		this._element.control = null;
		delete this._element;
	}
	if (this._parent) delete this._parent;
}
function Sys$UI$Control$onBubbleEvent(source, args) {
	/// <summary locid="M:J#Sys.UI.Control.onBubbleEvent" />
	/// <param name="source"></param>
	/// <param name="args" type="Sys.EventArgs"></param>
	/// <returns type="Boolean"></returns>
	var e = Function._validateParams(arguments, [
            { name: "source" },
            { name: "args", type: Sys.EventArgs }
        ]);
	if (e) throw e;
	return false;
}
function Sys$UI$Control$raiseBubbleEvent(source, args) {
	/// <summary locid="M:J#Sys.UI.Control.raiseBubbleEvent" />
	/// <param name="source"></param>
	/// <param name="args" type="Sys.EventArgs"></param>
	var e = Function._validateParams(arguments, [
            { name: "source" },
            { name: "args", type: Sys.EventArgs }
        ]);
	if (e) throw e;
	this._raiseBubbleEvent(source, args);
}
function Sys$UI$Control$_raiseBubbleEvent(source, args) {
	var currentTarget = this.get_parent();
	while (currentTarget) {
		if (currentTarget.onBubbleEvent(source, args)) {
			return;
		}
		currentTarget = currentTarget.get_parent();
	}
}
function Sys$UI$Control$removeCssClass(className) {
	/// <summary locid="M:J#Sys.UI.Control.removeCssClass" />
	/// <param name="className" type="String"></param>
	var e = Function._validateParams(arguments, [
            { name: "className", type: String }
        ]);
	if (e) throw e;
	if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
	Sys.UI.DomElement.removeCssClass(this._element, className);
}
function Sys$UI$Control$toggleCssClass(className) {
	/// <summary locid="M:J#Sys.UI.Control.toggleCssClass" />
	/// <param name="className" type="String"></param>
	var e = Function._validateParams(arguments, [
            { name: "className", type: String }
        ]);
	if (e) throw e;
	if (!this._element) throw Error.invalidOperation(Sys.Res.cantBeCalledAfterDispose);
	Sys.UI.DomElement.toggleCssClass(this._element, className);
}
Sys.UI.Control.prototype = {
	_parent: null,
	_visibilityMode: Sys.UI.VisibilityMode.hide,
	get_element: Sys$UI$Control$get_element,
	get_id: Sys$UI$Control$get_id,
	set_id: Sys$UI$Control$set_id,
	get_parent: Sys$UI$Control$get_parent,
	set_parent: Sys$UI$Control$set_parent,
	get_role: Sys$UI$Control$get_role,
	get_visibilityMode: Sys$UI$Control$get_visibilityMode,
	set_visibilityMode: Sys$UI$Control$set_visibilityMode,
	get_visible: Sys$UI$Control$get_visible,
	set_visible: Sys$UI$Control$set_visible,
	addCssClass: Sys$UI$Control$addCssClass,
	dispose: Sys$UI$Control$dispose,
	onBubbleEvent: Sys$UI$Control$onBubbleEvent,
	raiseBubbleEvent: Sys$UI$Control$raiseBubbleEvent,
	_raiseBubbleEvent: Sys$UI$Control$_raiseBubbleEvent,
	removeCssClass: Sys$UI$Control$removeCssClass,
	toggleCssClass: Sys$UI$Control$toggleCssClass
}
Sys.UI.Control.registerClass('Sys.UI.Control', Sys.Component);
Sys.HistoryEventArgs = function Sys$HistoryEventArgs(state) {
	/// <summary locid="M:J#Sys.HistoryEventArgs.#ctor" />
	/// <param name="state" type="Object"></param>
	var e = Function._validateParams(arguments, [
        { name: "state", type: Object }
    ]);
	if (e) throw e;
	Sys.HistoryEventArgs.initializeBase(this);
	this._state = state;
}
function Sys$HistoryEventArgs$get_state() {
	/// <value type="Object" locid="P:J#Sys.HistoryEventArgs.state"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._state;
}
Sys.HistoryEventArgs.prototype = {
	get_state: Sys$HistoryEventArgs$get_state
}
Sys.HistoryEventArgs.registerClass('Sys.HistoryEventArgs', Sys.EventArgs);
Sys.Application._appLoadHandler = null;
Sys.Application._beginRequestHandler = null;
Sys.Application._clientId = null;
Sys.Application._currentEntry = '';
Sys.Application._endRequestHandler = null;
Sys.Application._history = null;
Sys.Application._enableHistory = false;
Sys.Application._historyEnabledInScriptManager = false;
Sys.Application._historyFrame = null;
Sys.Application._historyInitialized = false;
Sys.Application._historyPointIsNew = false;
Sys.Application._ignoreTimer = false;
Sys.Application._initialState = null;
Sys.Application._state = {};
Sys.Application._timerCookie = 0;
Sys.Application._timerHandler = null;
Sys.Application._uniqueId = null;
Sys._Application.prototype.get_stateString = function Sys$_Application$get_stateString() {
	/// <summary locid="M:J#Sys._Application.get_stateString" />
	if (arguments.length !== 0) throw Error.parameterCount();
	var hash = null;

	if (Sys.Browser.agent === Sys.Browser.Firefox) {
		var href = window.location.href;
		var hashIndex = href.indexOf('#');
		if (hashIndex !== -1) {
			hash = href.substring(hashIndex + 1);
		}
		else {
			hash = "";
		}
		return hash;
	}
	else {
		hash = window.location.hash;
	}

	if ((hash.length > 0) && (hash.charAt(0) === '#')) {
		hash = hash.substring(1);
	}
	return hash;
};
Sys._Application.prototype.get_enableHistory = function Sys$_Application$get_enableHistory() {
	/// <summary locid="M:J#Sys._Application.get_enableHistory" />
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._enableHistory;
};
Sys._Application.prototype.set_enableHistory = function Sys$_Application$set_enableHistory(value) {
	if (this._initialized && !this._initializing) {
		throw Error.invalidOperation(Sys.Res.historyCannotEnableHistory);
	}
	else if (this._historyEnabledInScriptManager && !value) {
		throw Error.invalidOperation(Sys.Res.invalidHistorySettingCombination);
	}
	this._enableHistory = value;
};
Sys._Application.prototype.add_navigate = function Sys$_Application$add_navigate(handler) {
	/// <summary locid="E:J#Sys.Application.navigate" />
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	this.get_events().addHandler("navigate", handler);
};
Sys._Application.prototype.remove_navigate = function Sys$_Application$remove_navigate(handler) {
	/// <summary locid="M:J#Sys._Application.remove_navigate" />
	/// <param name="handler" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "handler", type: Function }
    ]);
	if (e) throw e;
	this.get_events().removeHandler("navigate", handler);
};
Sys._Application.prototype.addHistoryPoint = function Sys$_Application$addHistoryPoint(state, title) {
	/// <summary locid="M:J#Sys.Application.addHistoryPoint" />
	/// <param name="state" type="Object"></param>
	/// <param name="title" type="String" optional="true" mayBeNull="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "state", type: Object },
        { name: "title", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	if (!this._enableHistory) throw Error.invalidOperation(Sys.Res.historyCannotAddHistoryPointWithHistoryDisabled);
	for (var n in state) {
		var v = state[n];
		var t = typeof (v);
		if ((v !== null) && ((t === 'object') || (t === 'function') || (t === 'undefined'))) {
			throw Error.argument('state', Sys.Res.stateMustBeStringDictionary);
		}
	}
	this._ensureHistory();
	var initialState = this._state;
	for (var key in state) {
		var value = state[key];
		if (value === null) {
			if (typeof (initialState[key]) !== 'undefined') {
				delete initialState[key];
			}
		}
		else {
			initialState[key] = value;
		}
	}
	var entry = this._serializeState(initialState);
	this._historyPointIsNew = true;
	this._setState(entry, title);
	this._raiseNavigate();
};
Sys._Application.prototype.setServerId = function Sys$_Application$setServerId(clientId, uniqueId) {
	/// <summary locid="M:J#Sys.Application.setServerId" />
	/// <param name="clientId" type="String"></param>
	/// <param name="uniqueId" type="String"></param>
	var e = Function._validateParams(arguments, [
        { name: "clientId", type: String },
        { name: "uniqueId", type: String }
    ]);
	if (e) throw e;
	this._clientId = clientId;
	this._uniqueId = uniqueId;
};
Sys._Application.prototype.setServerState = function Sys$_Application$setServerState(value) {
	/// <summary locid="M:J#Sys.Application.setServerState" />
	/// <param name="value" type="String"></param>
	var e = Function._validateParams(arguments, [
        { name: "value", type: String }
    ]);
	if (e) throw e;
	this._ensureHistory();
	this._state.__s = value;
	this._updateHiddenField(value);
};
Sys._Application.prototype._deserializeState = function Sys$_Application$_deserializeState(entry) {
	var result = {};
	entry = entry || '';
	var serverSeparator = entry.indexOf('&&');
	if ((serverSeparator !== -1) && (serverSeparator + 2 < entry.length)) {
		result.__s = entry.substr(serverSeparator + 2);
		entry = entry.substr(0, serverSeparator);
	}
	var tokens = entry.split('&');
	for (var i = 0, l = tokens.length; i < l; i++) {
		var token = tokens[i];
		var equal = token.indexOf('=');
		if ((equal !== -1) && (equal + 1 < token.length)) {
			var name = token.substr(0, equal);
			var value = token.substr(equal + 1);
			result[name] = decodeURIComponent(value);
		}
	}
	return result;
};
Sys._Application.prototype._enableHistoryInScriptManager = function Sys$_Application$_enableHistoryInScriptManager() {
	this._enableHistory = true;
	this._historyEnabledInScriptManager = true;
};
Sys._Application.prototype._ensureHistory = function Sys$_Application$_ensureHistory() {
	if (!this._historyInitialized && this._enableHistory) {
		if ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && (Sys.Browser.documentMode < 8)) {
			this._historyFrame = document.getElementById('__historyFrame');
			if (!this._historyFrame) throw Error.invalidOperation(Sys.Res.historyMissingFrame);
			this._ignoreIFrame = true;
		}
		this._timerHandler = Function.createDelegate(this, this._onIdle);
		this._timerCookie = window.setTimeout(this._timerHandler, 100);

		try {
			this._initialState = this._deserializeState(this.get_stateString());
		} catch (e) { }

		this._historyInitialized = true;
	}
};
Sys._Application.prototype._navigate = function Sys$_Application$_navigate(entry) {
	this._ensureHistory();
	var state = this._deserializeState(entry);

	if (this._uniqueId) {
		var oldServerEntry = this._state.__s || '';
		var newServerEntry = state.__s || '';
		if (newServerEntry !== oldServerEntry) {
			this._updateHiddenField(newServerEntry);
			__doPostBack(this._uniqueId, newServerEntry);
			this._state = state;
			return;
		}
	}
	this._setState(entry);
	this._state = state;
	this._raiseNavigate();
};
Sys._Application.prototype._onIdle = function Sys$_Application$_onIdle() {
	delete this._timerCookie;

	var entry = this.get_stateString();
	if (entry !== this._currentEntry) {
		if (!this._ignoreTimer) {
			this._historyPointIsNew = false;
			this._navigate(entry);
		}
	}
	else {
		this._ignoreTimer = false;
	}
	this._timerCookie = window.setTimeout(this._timerHandler, 100);
};
Sys._Application.prototype._onIFrameLoad = function Sys$_Application$_onIFrameLoad(entry) {
	this._ensureHistory();
	if (!this._ignoreIFrame) {
		this._historyPointIsNew = false;
		this._navigate(entry);
	}
	this._ignoreIFrame = false;
};
Sys._Application.prototype._onPageRequestManagerBeginRequest = function Sys$_Application$_onPageRequestManagerBeginRequest(sender, args) {
	this._ignoreTimer = true;
	this._originalTitle = document.title;
};
Sys._Application.prototype._onPageRequestManagerEndRequest = function Sys$_Application$_onPageRequestManagerEndRequest(sender, args) {
	var dataItem = args.get_dataItems()[this._clientId];
	var originalTitle = this._originalTitle;
	this._originalTitle = null;
	var eventTarget = document.getElementById("__EVENTTARGET");
	if (eventTarget && eventTarget.value === this._uniqueId) {
		eventTarget.value = '';
	}
	if (typeof (dataItem) !== 'undefined') {
		this.setServerState(dataItem);
		this._historyPointIsNew = true;
	}
	else {
		this._ignoreTimer = false;
	}
	var entry = this._serializeState(this._state);
	if (entry !== this._currentEntry) {
		this._ignoreTimer = true;
		if (typeof (originalTitle) === "string") {
			if (Sys.Browser.agent !== Sys.Browser.InternetExplorer || Sys.Browser.version > 7) {
				var newTitle = document.title;
				document.title = originalTitle;
				this._setState(entry);
				document.title = newTitle;
			}
			else {
				this._setState(entry);
			}
			this._raiseNavigate();
		}
		else {
			this._setState(entry);
			this._raiseNavigate();
		}
	}
};
Sys._Application.prototype._raiseNavigate = function Sys$_Application$_raiseNavigate() {
	var isNew = this._historyPointIsNew;
	var h = this.get_events().getHandler("navigate");
	var stateClone = {};
	for (var key in this._state) {
		if (key !== '__s') {
			stateClone[key] = this._state[key];
		}
	}
	var args = new Sys.HistoryEventArgs(stateClone);
	if (h) {
		h(this, args);
	}
	if (!isNew) {
		var err;
		try {
			if ((Sys.Browser.agent === Sys.Browser.Firefox) && window.location.hash &&
                (!window.frameElement || window.top.location.hash)) {
				(Sys.Browser.version < 3.5) ?
                    window.history.go(0) :
                    location.hash = this.get_stateString();
			}
		}
		catch (err) {
		}
	}
};
Sys._Application.prototype._serializeState = function Sys$_Application$_serializeState(state) {
	var serialized = [];
	for (var key in state) {
		var value = state[key];
		if (key === '__s') {
			var serverState = value;
		}
		else {
			if (key.indexOf('=') !== -1) throw Error.argument('state', Sys.Res.stateFieldNameInvalid);
			serialized[serialized.length] = key + '=' + encodeURIComponent(value);
		}
	}
	return serialized.join('&') + (serverState ? '&&' + serverState : '');
};
Sys._Application.prototype._setState = function Sys$_Application$_setState(entry, title) {
	if (this._enableHistory) {
		entry = entry || '';
		if (entry !== this._currentEntry) {
			if (window.theForm) {
				var action = window.theForm.action;
				var hashIndex = action.indexOf('#');
				window.theForm.action = ((hashIndex !== -1) ? action.substring(0, hashIndex) : action) + '#' + entry;
			}

			if (this._historyFrame && this._historyPointIsNew) {
				this._ignoreIFrame = true;
				var frameDoc = this._historyFrame.contentWindow.document;
				frameDoc.open("javascript:'<html></html>'");
				frameDoc.write("<html><head><title>" + (title || document.title) +
                    "</title><scri" + "pt type=\"text/javascript\">parent.Sys.Application._onIFrameLoad(" +
                    Sys.Serialization.JavaScriptSerializer.serialize(entry) +
                    ");</scri" + "pt></head><body></body></html>");
				frameDoc.close();
			}
			this._ignoreTimer = false;
			this._currentEntry = entry;
			if (this._historyFrame || this._historyPointIsNew) {
				var currentHash = this.get_stateString();
				if (entry !== currentHash) {
					var loc = document.location;
					if (loc.href.length - loc.hash.length + entry.length > 2048) {
						throw Error.invalidOperation(String.format(Sys.Res.urlTooLong, 2048));
					}
					window.location.hash = entry;
					this._currentEntry = this.get_stateString();
					if ((typeof (title) !== 'undefined') && (title !== null)) {
						document.title = title;
					}
				}
			}
			this._historyPointIsNew = false;
		}
	}
};
Sys._Application.prototype._updateHiddenField = function Sys$_Application$_updateHiddenField(value) {
	if (this._clientId) {
		var serverStateField = document.getElementById(this._clientId);
		if (serverStateField) {
			serverStateField.value = value;
		}
	}
};

if (!window.XMLHttpRequest) {
	window.XMLHttpRequest = function window$XMLHttpRequest() {
		var progIDs = ['Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP'];
		for (var i = 0, l = progIDs.length; i < l; i++) {
			try {
				return new ActiveXObject(progIDs[i]);
			}
			catch (ex) {
			}
		}
		return null;
	}
}
Type.registerNamespace('Sys.Net');

Sys.Net.WebRequestExecutor = function Sys$Net$WebRequestExecutor() {
	/// <summary locid="M:J#Sys.Net.WebRequestExecutor.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	this._webRequest = null;
	this._resultObject = null;
}
function Sys$Net$WebRequestExecutor$get_webRequest() {
	/// <value type="Sys.Net.WebRequest" locid="P:J#Sys.Net.WebRequestExecutor.webRequest"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._webRequest;
}
function Sys$Net$WebRequestExecutor$_set_webRequest(value) {
	if (this.get_started()) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallOnceStarted, 'set_webRequest'));
	}
	this._webRequest = value;
}
function Sys$Net$WebRequestExecutor$get_started() {
	/// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.started"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$get_responseAvailable() {
	/// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.responseAvailable"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$get_timedOut() {
	/// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.timedOut"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$get_aborted() {
	/// <value type="Boolean" locid="P:J#Sys.Net.WebRequestExecutor.aborted"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$get_responseData() {
	/// <value type="String" locid="P:J#Sys.Net.WebRequestExecutor.responseData"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$get_statusCode() {
	/// <value type="Number" locid="P:J#Sys.Net.WebRequestExecutor.statusCode"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$get_statusText() {
	/// <value type="String" locid="P:J#Sys.Net.WebRequestExecutor.statusText"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$get_xml() {
	/// <value locid="P:J#Sys.Net.WebRequestExecutor.xml"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$get_object() {
	/// <value locid="P:J#Sys.Net.WebRequestExecutor.object"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._resultObject) {
		this._resultObject = Sys.Serialization.JavaScriptSerializer.deserialize(this.get_responseData());
	}
	return this._resultObject;
}
function Sys$Net$WebRequestExecutor$executeRequest() {
	/// <summary locid="M:J#Sys.Net.WebRequestExecutor.executeRequest" />
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$abort() {
	/// <summary locid="M:J#Sys.Net.WebRequestExecutor.abort" />
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$getResponseHeader(header) {
	/// <summary locid="M:J#Sys.Net.WebRequestExecutor.getResponseHeader" />
	/// <param name="header" type="String"></param>
	var e = Function._validateParams(arguments, [
            { name: "header", type: String }
        ]);
	if (e) throw e;
	throw Error.notImplemented();
}
function Sys$Net$WebRequestExecutor$getAllResponseHeaders() {
	/// <summary locid="M:J#Sys.Net.WebRequestExecutor.getAllResponseHeaders" />
	if (arguments.length !== 0) throw Error.parameterCount();
	throw Error.notImplemented();
}
Sys.Net.WebRequestExecutor.prototype = {
	get_webRequest: Sys$Net$WebRequestExecutor$get_webRequest,
	_set_webRequest: Sys$Net$WebRequestExecutor$_set_webRequest,
	get_started: Sys$Net$WebRequestExecutor$get_started,
	get_responseAvailable: Sys$Net$WebRequestExecutor$get_responseAvailable,
	get_timedOut: Sys$Net$WebRequestExecutor$get_timedOut,
	get_aborted: Sys$Net$WebRequestExecutor$get_aborted,
	get_responseData: Sys$Net$WebRequestExecutor$get_responseData,
	get_statusCode: Sys$Net$WebRequestExecutor$get_statusCode,
	get_statusText: Sys$Net$WebRequestExecutor$get_statusText,
	get_xml: Sys$Net$WebRequestExecutor$get_xml,
	get_object: Sys$Net$WebRequestExecutor$get_object,
	executeRequest: Sys$Net$WebRequestExecutor$executeRequest,
	abort: Sys$Net$WebRequestExecutor$abort,
	getResponseHeader: Sys$Net$WebRequestExecutor$getResponseHeader,
	getAllResponseHeaders: Sys$Net$WebRequestExecutor$getAllResponseHeaders
}
Sys.Net.WebRequestExecutor.registerClass('Sys.Net.WebRequestExecutor');

Sys.Net.XMLDOM = function Sys$Net$XMLDOM(markup) {
	/// <summary locid="M:J#Sys.Net.XMLDOM.#ctor" />
	/// <param name="markup" type="String"></param>
	var e = Function._validateParams(arguments, [
        { name: "markup", type: String }
    ]);
	if (e) throw e;
	if (!window.DOMParser) {
		var progIDs = ['Msxml2.DOMDocument.3.0', 'Msxml2.DOMDocument'];
		for (var i = 0, l = progIDs.length; i < l; i++) {
			try {
				var xmlDOM = new ActiveXObject(progIDs[i]);
				xmlDOM.async = false;
				xmlDOM.loadXML(markup);
				xmlDOM.setProperty('SelectionLanguage', 'XPath');
				return xmlDOM;
			}
			catch (ex) {
			}
		}
	}
	else {
		try {
			var domParser = new window.DOMParser();
			return domParser.parseFromString(markup, 'text/xml');
		}
		catch (ex) {
		}
	}
	return null;
}
Sys.Net.XMLHttpExecutor = function Sys$Net$XMLHttpExecutor() {
	/// <summary locid="M:J#Sys.Net.XMLHttpExecutor.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	Sys.Net.XMLHttpExecutor.initializeBase(this);
	var _this = this;
	this._xmlHttpRequest = null;
	this._webRequest = null;
	this._responseAvailable = false;
	this._timedOut = false;
	this._timer = null;
	this._aborted = false;
	this._started = false;
	this._onReadyStateChange = (function () {

		if (_this._xmlHttpRequest.readyState === 4) {
			try {
				if (typeof (_this._xmlHttpRequest.status) === "undefined") {
					return;
				}
			}
			catch (ex) {
				return;
			}

			_this._clearTimer();
			_this._responseAvailable = true;
			_this._webRequest.completed(Sys.EventArgs.Empty);
			if (_this._xmlHttpRequest != null) {
				_this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
				_this._xmlHttpRequest = null;
			}
		}
	});
	this._clearTimer = (function () {
		if (_this._timer != null) {
			window.clearTimeout(_this._timer);
			_this._timer = null;
		}
	});
	this._onTimeout = (function () {
		if (!_this._responseAvailable) {
			_this._clearTimer();
			_this._timedOut = true;
			_this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
			_this._xmlHttpRequest.abort();
			_this._webRequest.completed(Sys.EventArgs.Empty);
			_this._xmlHttpRequest = null;
		}
	});
}
function Sys$Net$XMLHttpExecutor$get_timedOut() {
	/// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.timedOut"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._timedOut;
}
function Sys$Net$XMLHttpExecutor$get_started() {
	/// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.started"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._started;
}
function Sys$Net$XMLHttpExecutor$get_responseAvailable() {
	/// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.responseAvailable"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._responseAvailable;
}
function Sys$Net$XMLHttpExecutor$get_aborted() {
	/// <value type="Boolean" locid="P:J#Sys.Net.XMLHttpExecutor.aborted"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._aborted;
}
function Sys$Net$XMLHttpExecutor$executeRequest() {
	/// <summary locid="M:J#Sys.Net.XMLHttpExecutor.executeRequest" />
	if (arguments.length !== 0) throw Error.parameterCount();
	this._webRequest = this.get_webRequest();
	if (this._started) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallOnceStarted, 'executeRequest'));
	}
	if (this._webRequest === null) {
		throw Error.invalidOperation(Sys.Res.nullWebRequest);
	}
	var body = this._webRequest.get_body();
	var headers = this._webRequest.get_headers();
	this._xmlHttpRequest = new XMLHttpRequest();
	this._xmlHttpRequest.onreadystatechange = this._onReadyStateChange;
	var verb = this._webRequest.get_httpVerb();
	this._xmlHttpRequest.open(verb, this._webRequest.getResolvedUrl(), true);
	this._xmlHttpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
	if (headers) {
		for (var header in headers) {
			var val = headers[header];
			if (typeof (val) !== "function")
				this._xmlHttpRequest.setRequestHeader(header, val);
		}
	}
	if (verb.toLowerCase() === "post") {
		if ((headers === null) || !headers['Content-Type']) {
			this._xmlHttpRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=utf-8');
		}
		if (!body) {
			body = "";
		}
	}
	var timeout = this._webRequest.get_timeout();
	if (timeout > 0) {
		this._timer = window.setTimeout(Function.createDelegate(this, this._onTimeout), timeout);
	}
	this._xmlHttpRequest.send(body);
	this._started = true;
}
function Sys$Net$XMLHttpExecutor$getResponseHeader(header) {
	/// <summary locid="M:J#Sys.Net.XMLHttpExecutor.getResponseHeader" />
	/// <param name="header" type="String"></param>
	/// <returns type="String"></returns>
	var e = Function._validateParams(arguments, [
            { name: "header", type: String }
        ]);
	if (e) throw e;
	if (!this._responseAvailable) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'getResponseHeader'));
	}
	if (!this._xmlHttpRequest) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'getResponseHeader'));
	}
	var result;
	try {
		result = this._xmlHttpRequest.getResponseHeader(header);
	} catch (e) {
	}
	if (!result) result = "";
	return result;
}
function Sys$Net$XMLHttpExecutor$getAllResponseHeaders() {
	/// <summary locid="M:J#Sys.Net.XMLHttpExecutor.getAllResponseHeaders" />
	/// <returns type="String"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._responseAvailable) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'getAllResponseHeaders'));
	}
	if (!this._xmlHttpRequest) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'getAllResponseHeaders'));
	}
	return this._xmlHttpRequest.getAllResponseHeaders();
}
function Sys$Net$XMLHttpExecutor$get_responseData() {
	/// <value type="String" locid="P:J#Sys.Net.XMLHttpExecutor.responseData"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._responseAvailable) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_responseData'));
	}
	if (!this._xmlHttpRequest) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_responseData'));
	}
	return this._xmlHttpRequest.responseText;
}
function Sys$Net$XMLHttpExecutor$get_statusCode() {
	/// <value type="Number" locid="P:J#Sys.Net.XMLHttpExecutor.statusCode"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._responseAvailable) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_statusCode'));
	}
	if (!this._xmlHttpRequest) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_statusCode'));
	}
	var result = 0;
	try {
		result = this._xmlHttpRequest.status;
	}
	catch (ex) {
	}
	return result;
}
function Sys$Net$XMLHttpExecutor$get_statusText() {
	/// <value type="String" locid="P:J#Sys.Net.XMLHttpExecutor.statusText"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._responseAvailable) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_statusText'));
	}
	if (!this._xmlHttpRequest) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_statusText'));
	}
	return this._xmlHttpRequest.statusText;
}
function Sys$Net$XMLHttpExecutor$get_xml() {
	/// <value locid="P:J#Sys.Net.XMLHttpExecutor.xml"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._responseAvailable) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallBeforeResponse, 'get_xml'));
	}
	if (!this._xmlHttpRequest) {
		throw Error.invalidOperation(String.format(Sys.Res.cannotCallOutsideHandler, 'get_xml'));
	}
	var xml = this._xmlHttpRequest.responseXML;
	if (!xml || !xml.documentElement) {
		xml = Sys.Net.XMLDOM(this._xmlHttpRequest.responseText);
		if (!xml || !xml.documentElement)
			return null;
	}
	else if (navigator.userAgent.indexOf('MSIE') !== -1) {
		xml.setProperty('SelectionLanguage', 'XPath');
	}
	if (xml.documentElement.namespaceURI === "http://www.mozilla.org/newlayout/xml/parsererror.xml" &&
            xml.documentElement.tagName === "parsererror") {
		return null;
	}

	if (xml.documentElement.firstChild && xml.documentElement.firstChild.tagName === "parsererror") {
		return null;
	}

	return xml;
}
function Sys$Net$XMLHttpExecutor$abort() {
	/// <summary locid="M:J#Sys.Net.XMLHttpExecutor.abort" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (!this._started) {
		throw Error.invalidOperation(Sys.Res.cannotAbortBeforeStart);
	}
	if (this._aborted || this._responseAvailable || this._timedOut)
		return;
	this._aborted = true;
	this._clearTimer();
	if (this._xmlHttpRequest && !this._responseAvailable) {
		this._xmlHttpRequest.onreadystatechange = Function.emptyMethod;
		this._xmlHttpRequest.abort();

		this._xmlHttpRequest = null;
		this._webRequest.completed(Sys.EventArgs.Empty);
	}
}
Sys.Net.XMLHttpExecutor.prototype = {
	get_timedOut: Sys$Net$XMLHttpExecutor$get_timedOut,
	get_started: Sys$Net$XMLHttpExecutor$get_started,
	get_responseAvailable: Sys$Net$XMLHttpExecutor$get_responseAvailable,
	get_aborted: Sys$Net$XMLHttpExecutor$get_aborted,
	executeRequest: Sys$Net$XMLHttpExecutor$executeRequest,
	getResponseHeader: Sys$Net$XMLHttpExecutor$getResponseHeader,
	getAllResponseHeaders: Sys$Net$XMLHttpExecutor$getAllResponseHeaders,
	get_responseData: Sys$Net$XMLHttpExecutor$get_responseData,
	get_statusCode: Sys$Net$XMLHttpExecutor$get_statusCode,
	get_statusText: Sys$Net$XMLHttpExecutor$get_statusText,
	get_xml: Sys$Net$XMLHttpExecutor$get_xml,
	abort: Sys$Net$XMLHttpExecutor$abort
}
Sys.Net.XMLHttpExecutor.registerClass('Sys.Net.XMLHttpExecutor', Sys.Net.WebRequestExecutor);

Sys.Net._WebRequestManager = function Sys$Net$_WebRequestManager() {
	/// <summary locid="P:J#Sys.Net.WebRequestManager.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	this._defaultTimeout = 0;
	this._defaultExecutorType = "Sys.Net.XMLHttpExecutor";
}
function Sys$Net$_WebRequestManager$add_invokingRequest(handler) {
	/// <summary locid="E:J#Sys.Net.WebRequestManager.invokingRequest" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this._get_eventHandlerList().addHandler("invokingRequest", handler);
}
function Sys$Net$_WebRequestManager$remove_invokingRequest(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this._get_eventHandlerList().removeHandler("invokingRequest", handler);
}
function Sys$Net$_WebRequestManager$add_completedRequest(handler) {
	/// <summary locid="E:J#Sys.Net.WebRequestManager.completedRequest" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this._get_eventHandlerList().addHandler("completedRequest", handler);
}
function Sys$Net$_WebRequestManager$remove_completedRequest(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this._get_eventHandlerList().removeHandler("completedRequest", handler);
}
function Sys$Net$_WebRequestManager$_get_eventHandlerList() {
	if (!this._events) {
		this._events = new Sys.EventHandlerList();
	}
	return this._events;
}
function Sys$Net$_WebRequestManager$get_defaultTimeout() {
	/// <value type="Number" locid="P:J#Sys.Net.WebRequestManager.defaultTimeout"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._defaultTimeout;
}
function Sys$Net$_WebRequestManager$set_defaultTimeout(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Number}]);
	if (e) throw e;
	if (value < 0) {
		throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
	}
	this._defaultTimeout = value;
}
function Sys$Net$_WebRequestManager$get_defaultExecutorType() {
	/// <value type="String" locid="P:J#Sys.Net.WebRequestManager.defaultExecutorType"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._defaultExecutorType;
}
function Sys$Net$_WebRequestManager$set_defaultExecutorType(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: String}]);
	if (e) throw e;
	this._defaultExecutorType = value;
}
function Sys$Net$_WebRequestManager$executeRequest(webRequest) {
	/// <summary locid="M:J#Sys.Net.WebRequestManager.executeRequest" />
	/// <param name="webRequest" type="Sys.Net.WebRequest"></param>
	var e = Function._validateParams(arguments, [
            { name: "webRequest", type: Sys.Net.WebRequest }
        ]);
	if (e) throw e;
	var executor = webRequest.get_executor();
	if (!executor) {
		var failed = false;
		try {
			var executorType = eval(this._defaultExecutorType);
			executor = new executorType();
		} catch (e) {
			failed = true;
		}
		if (failed || !Sys.Net.WebRequestExecutor.isInstanceOfType(executor) || !executor) {
			throw Error.argument("defaultExecutorType", String.format(Sys.Res.invalidExecutorType, this._defaultExecutorType));
		}
		webRequest.set_executor(executor);
	}
	if (executor.get_aborted()) {
		return;
	}
	var evArgs = new Sys.Net.NetworkRequestEventArgs(webRequest);
	var handler = this._get_eventHandlerList().getHandler("invokingRequest");
	if (handler) {
		handler(this, evArgs);
	}
	if (!evArgs.get_cancel()) {
		executor.executeRequest();
	}
}
Sys.Net._WebRequestManager.prototype = {
	add_invokingRequest: Sys$Net$_WebRequestManager$add_invokingRequest,
	remove_invokingRequest: Sys$Net$_WebRequestManager$remove_invokingRequest,
	add_completedRequest: Sys$Net$_WebRequestManager$add_completedRequest,
	remove_completedRequest: Sys$Net$_WebRequestManager$remove_completedRequest,
	_get_eventHandlerList: Sys$Net$_WebRequestManager$_get_eventHandlerList,
	get_defaultTimeout: Sys$Net$_WebRequestManager$get_defaultTimeout,
	set_defaultTimeout: Sys$Net$_WebRequestManager$set_defaultTimeout,
	get_defaultExecutorType: Sys$Net$_WebRequestManager$get_defaultExecutorType,
	set_defaultExecutorType: Sys$Net$_WebRequestManager$set_defaultExecutorType,
	executeRequest: Sys$Net$_WebRequestManager$executeRequest
}
Sys.Net._WebRequestManager.registerClass('Sys.Net._WebRequestManager');
Sys.Net.WebRequestManager = new Sys.Net._WebRequestManager();

Sys.Net.NetworkRequestEventArgs = function Sys$Net$NetworkRequestEventArgs(webRequest) {
	/// <summary locid="M:J#Sys.Net.NetworkRequestEventArgs.#ctor" />
	/// <param name="webRequest" type="Sys.Net.WebRequest"></param>
	var e = Function._validateParams(arguments, [
        { name: "webRequest", type: Sys.Net.WebRequest }
    ]);
	if (e) throw e;
	Sys.Net.NetworkRequestEventArgs.initializeBase(this);
	this._webRequest = webRequest;
}
function Sys$Net$NetworkRequestEventArgs$get_webRequest() {
	/// <value type="Sys.Net.WebRequest" locid="P:J#Sys.Net.NetworkRequestEventArgs.webRequest"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._webRequest;
}
Sys.Net.NetworkRequestEventArgs.prototype = {
	get_webRequest: Sys$Net$NetworkRequestEventArgs$get_webRequest
}
Sys.Net.NetworkRequestEventArgs.registerClass('Sys.Net.NetworkRequestEventArgs', Sys.CancelEventArgs);

Sys.Net.WebRequest = function Sys$Net$WebRequest() {
	/// <summary locid="M:J#Sys.Net.WebRequest.#ctor" />
	if (arguments.length !== 0) throw Error.parameterCount();
	this._url = "";
	this._headers = {};
	this._body = null;
	this._userContext = null;
	this._httpVerb = null;
	this._executor = null;
	this._invokeCalled = false;
	this._timeout = 0;
}
function Sys$Net$WebRequest$add_completed(handler) {
	/// <summary locid="E:J#Sys.Net.WebRequest.completed" />
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this._get_eventHandlerList().addHandler("completed", handler);
}
function Sys$Net$WebRequest$remove_completed(handler) {
	var e = Function._validateParams(arguments, [{ name: "handler", type: Function}]);
	if (e) throw e;
	this._get_eventHandlerList().removeHandler("completed", handler);
}
function Sys$Net$WebRequest$completed(eventArgs) {
	/// <summary locid="M:J#Sys.Net.WebRequest.completed" />
	/// <param name="eventArgs" type="Sys.EventArgs"></param>
	var e = Function._validateParams(arguments, [
            { name: "eventArgs", type: Sys.EventArgs }
        ]);
	if (e) throw e;
	var handler = Sys.Net.WebRequestManager._get_eventHandlerList().getHandler("completedRequest");
	if (handler) {
		handler(this._executor, eventArgs);
	}
	handler = this._get_eventHandlerList().getHandler("completed");
	if (handler) {
		handler(this._executor, eventArgs);
	}
}
function Sys$Net$WebRequest$_get_eventHandlerList() {
	if (!this._events) {
		this._events = new Sys.EventHandlerList();
	}
	return this._events;
}
function Sys$Net$WebRequest$get_url() {
	/// <value type="String" locid="P:J#Sys.Net.WebRequest.url"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._url;
}
function Sys$Net$WebRequest$set_url(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: String}]);
	if (e) throw e;
	this._url = value;
}
function Sys$Net$WebRequest$get_headers() {
	/// <value locid="P:J#Sys.Net.WebRequest.headers"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._headers;
}
function Sys$Net$WebRequest$get_httpVerb() {
	/// <value type="String" locid="P:J#Sys.Net.WebRequest.httpVerb"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this._httpVerb === null) {
		if (this._body === null) {
			return "GET";
		}
		return "POST";
	}
	return this._httpVerb;
}
function Sys$Net$WebRequest$set_httpVerb(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: String}]);
	if (e) throw e;
	if (value.length === 0) {
		throw Error.argument('value', Sys.Res.invalidHttpVerb);
	}
	this._httpVerb = value;
}
function Sys$Net$WebRequest$get_body() {
	/// <value mayBeNull="true" locid="P:J#Sys.Net.WebRequest.body"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._body;
}
function Sys$Net$WebRequest$set_body(value) {
	var e = Function._validateParams(arguments, [{ name: "value", mayBeNull: true}]);
	if (e) throw e;
	this._body = value;
}
function Sys$Net$WebRequest$get_userContext() {
	/// <value mayBeNull="true" locid="P:J#Sys.Net.WebRequest.userContext"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._userContext;
}
function Sys$Net$WebRequest$set_userContext(value) {
	var e = Function._validateParams(arguments, [{ name: "value", mayBeNull: true}]);
	if (e) throw e;
	this._userContext = value;
}
function Sys$Net$WebRequest$get_executor() {
	/// <value type="Sys.Net.WebRequestExecutor" locid="P:J#Sys.Net.WebRequest.executor"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._executor;
}
function Sys$Net$WebRequest$set_executor(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Sys.Net.WebRequestExecutor}]);
	if (e) throw e;
	if (this._executor !== null && this._executor.get_started()) {
		throw Error.invalidOperation(Sys.Res.setExecutorAfterActive);
	}
	this._executor = value;
	this._executor._set_webRequest(this);
}
function Sys$Net$WebRequest$get_timeout() {
	/// <value type="Number" locid="P:J#Sys.Net.WebRequest.timeout"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this._timeout === 0) {
		return Sys.Net.WebRequestManager.get_defaultTimeout();
	}
	return this._timeout;
}
function Sys$Net$WebRequest$set_timeout(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Number}]);
	if (e) throw e;
	if (value < 0) {
		throw Error.argumentOutOfRange("value", value, Sys.Res.invalidTimeout);
	}
	this._timeout = value;
}
function Sys$Net$WebRequest$getResolvedUrl() {
	/// <summary locid="M:J#Sys.Net.WebRequest.getResolvedUrl" />
	/// <returns type="String"></returns>
	if (arguments.length !== 0) throw Error.parameterCount();
	return Sys.Net.WebRequest._resolveUrl(this._url);
}
function Sys$Net$WebRequest$invoke() {
	/// <summary locid="M:J#Sys.Net.WebRequest.invoke" />
	if (arguments.length !== 0) throw Error.parameterCount();
	if (this._invokeCalled) {
		throw Error.invalidOperation(Sys.Res.invokeCalledTwice);
	}
	Sys.Net.WebRequestManager.executeRequest(this);
	this._invokeCalled = true;
}
Sys.Net.WebRequest.prototype = {
	add_completed: Sys$Net$WebRequest$add_completed,
	remove_completed: Sys$Net$WebRequest$remove_completed,
	completed: Sys$Net$WebRequest$completed,
	_get_eventHandlerList: Sys$Net$WebRequest$_get_eventHandlerList,
	get_url: Sys$Net$WebRequest$get_url,
	set_url: Sys$Net$WebRequest$set_url,
	get_headers: Sys$Net$WebRequest$get_headers,
	get_httpVerb: Sys$Net$WebRequest$get_httpVerb,
	set_httpVerb: Sys$Net$WebRequest$set_httpVerb,
	get_body: Sys$Net$WebRequest$get_body,
	set_body: Sys$Net$WebRequest$set_body,
	get_userContext: Sys$Net$WebRequest$get_userContext,
	set_userContext: Sys$Net$WebRequest$set_userContext,
	get_executor: Sys$Net$WebRequest$get_executor,
	set_executor: Sys$Net$WebRequest$set_executor,
	get_timeout: Sys$Net$WebRequest$get_timeout,
	set_timeout: Sys$Net$WebRequest$set_timeout,
	getResolvedUrl: Sys$Net$WebRequest$getResolvedUrl,
	invoke: Sys$Net$WebRequest$invoke
}
Sys.Net.WebRequest._resolveUrl = function Sys$Net$WebRequest$_resolveUrl(url, baseUrl) {
	if (url && url.indexOf('://') !== -1) {
		return url;
	}
	if (!baseUrl || baseUrl.length === 0) {
		var baseElement = document.getElementsByTagName('base')[0];
		if (baseElement && baseElement.href && baseElement.href.length > 0) {
			baseUrl = baseElement.href;
		}
		else {
			baseUrl = document.URL;
		}
	}
	var qsStart = baseUrl.indexOf('?');
	if (qsStart !== -1) {
		baseUrl = baseUrl.substr(0, qsStart);
	}
	qsStart = baseUrl.indexOf('#');
	if (qsStart !== -1) {
		baseUrl = baseUrl.substr(0, qsStart);
	}
	baseUrl = baseUrl.substr(0, baseUrl.lastIndexOf('/') + 1);
	if (!url || url.length === 0) {
		return baseUrl;
	}
	if (url.charAt(0) === '/') {
		var slashslash = baseUrl.indexOf('://');
		if (slashslash === -1) {
			throw Error.argument("baseUrl", Sys.Res.badBaseUrl1);
		}
		var nextSlash = baseUrl.indexOf('/', slashslash + 3);
		if (nextSlash === -1) {
			throw Error.argument("baseUrl", Sys.Res.badBaseUrl2);
		}
		return baseUrl.substr(0, nextSlash) + url;
	}
	else {
		var lastSlash = baseUrl.lastIndexOf('/');
		if (lastSlash === -1) {
			throw Error.argument("baseUrl", Sys.Res.badBaseUrl3);
		}
		return baseUrl.substr(0, lastSlash + 1) + url;
	}
}
Sys.Net.WebRequest._createQueryString = function Sys$Net$WebRequest$_createQueryString(queryString, encodeMethod, addParams) {
	encodeMethod = encodeMethod || encodeURIComponent;
	var i = 0, obj, val, arg, sb = new Sys.StringBuilder();
	if (queryString) {
		for (arg in queryString) {
			obj = queryString[arg];
			if (typeof (obj) === "function") continue;
			val = Sys.Serialization.JavaScriptSerializer.serialize(obj);
			if (i++) {
				sb.append('&');
			}
			sb.append(arg);
			sb.append('=');
			sb.append(encodeMethod(val));
		}
	}
	if (addParams) {
		if (i) {
			sb.append('&');
		}
		sb.append(addParams);
	}
	return sb.toString();
}
Sys.Net.WebRequest._createUrl = function Sys$Net$WebRequest$_createUrl(url, queryString, addParams) {
	if (!queryString && !addParams) {
		return url;
	}
	var qs = Sys.Net.WebRequest._createQueryString(queryString, null, addParams);
	return qs.length
        ? url + ((url && url.indexOf('?') >= 0) ? "&" : "?") + qs
        : url;
}
Sys.Net.WebRequest.registerClass('Sys.Net.WebRequest');

Sys._ScriptLoaderTask = function Sys$_ScriptLoaderTask(scriptElement, completedCallback) {
	/// <summary locid="M:J#Sys._ScriptLoaderTask.#ctor" />
	/// <param name="scriptElement" domElement="true"></param>
	/// <param name="completedCallback" type="Function"></param>
	var e = Function._validateParams(arguments, [
        { name: "scriptElement", domElement: true },
        { name: "completedCallback", type: Function }
    ]);
	if (e) throw e;
	this._scriptElement = scriptElement;
	this._completedCallback = completedCallback;
}
function Sys$_ScriptLoaderTask$get_scriptElement() {
	/// <value domElement="true" locid="P:J#Sys._ScriptLoaderTask.scriptElement"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._scriptElement;
}
function Sys$_ScriptLoaderTask$dispose() {
	if (this._disposed) {
		return;
	}
	this._disposed = true;
	this._removeScriptElementHandlers();
	Sys._ScriptLoaderTask._clearScript(this._scriptElement);
	this._scriptElement = null;
}
function Sys$_ScriptLoaderTask$execute() {
	/// <summary locid="M:J#Sys._ScriptLoaderTask.execute" />
	if (arguments.length !== 0) throw Error.parameterCount();
	this._addScriptElementHandlers();
	var headElements = document.getElementsByTagName('head');
	if (headElements.length === 0) {
		throw new Error.invalidOperation(Sys.Res.scriptLoadFailedNoHead);
	}
	else {
		headElements[0].appendChild(this._scriptElement);
	}
}
function Sys$_ScriptLoaderTask$_addScriptElementHandlers() {
	this._scriptLoadDelegate = Function.createDelegate(this, this._scriptLoadHandler);

	if (Sys.Browser.agent !== Sys.Browser.InternetExplorer) {
		this._scriptElement.readyState = 'loaded';
		$addHandler(this._scriptElement, 'load', this._scriptLoadDelegate);
	}
	else {
		$addHandler(this._scriptElement, 'readystatechange', this._scriptLoadDelegate);
	}
	if (this._scriptElement.addEventListener) {
		this._scriptErrorDelegate = Function.createDelegate(this, this._scriptErrorHandler);
		this._scriptElement.addEventListener('error', this._scriptErrorDelegate, false);
	}
}
function Sys$_ScriptLoaderTask$_removeScriptElementHandlers() {
	if (this._scriptLoadDelegate) {
		var scriptElement = this.get_scriptElement();
		if (Sys.Browser.agent !== Sys.Browser.InternetExplorer) {
			$removeHandler(scriptElement, 'load', this._scriptLoadDelegate);
		}
		else {
			$removeHandler(scriptElement, 'readystatechange', this._scriptLoadDelegate);
		}
		if (this._scriptErrorDelegate) {
			this._scriptElement.removeEventListener('error', this._scriptErrorDelegate, false);
			this._scriptErrorDelegate = null;
		}
		this._scriptLoadDelegate = null;
	}
}
function Sys$_ScriptLoaderTask$_scriptErrorHandler() {
	if (this._disposed) {
		return;
	}

	this._completedCallback(this.get_scriptElement(), false);
}
function Sys$_ScriptLoaderTask$_scriptLoadHandler() {
	if (this._disposed) {
		return;
	}
	var scriptElement = this.get_scriptElement();
	if ((scriptElement.readyState !== 'loaded') &&
            (scriptElement.readyState !== 'complete')) {
		return;
	}

	this._completedCallback(scriptElement, true);
}
Sys._ScriptLoaderTask.prototype = {
	get_scriptElement: Sys$_ScriptLoaderTask$get_scriptElement,
	dispose: Sys$_ScriptLoaderTask$dispose,
	execute: Sys$_ScriptLoaderTask$execute,
	_addScriptElementHandlers: Sys$_ScriptLoaderTask$_addScriptElementHandlers,
	_removeScriptElementHandlers: Sys$_ScriptLoaderTask$_removeScriptElementHandlers,
	_scriptErrorHandler: Sys$_ScriptLoaderTask$_scriptErrorHandler,
	_scriptLoadHandler: Sys$_ScriptLoaderTask$_scriptLoadHandler
}
Sys._ScriptLoaderTask.registerClass("Sys._ScriptLoaderTask", null, Sys.IDisposable);
Sys._ScriptLoaderTask._clearScript = function Sys$_ScriptLoaderTask$_clearScript(scriptElement) {
	if (!Sys.Debug.isDebug) {
		scriptElement.parentNode.removeChild(scriptElement);
	}
}
Type.registerNamespace('Sys.Net');

Sys.Net.WebServiceProxy = function Sys$Net$WebServiceProxy() {
}
function Sys$Net$WebServiceProxy$get_timeout() {
	/// <value type="Number" locid="P:J#Sys.Net.WebServiceProxy.timeout"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._timeout || 0;
}
function Sys$Net$WebServiceProxy$set_timeout(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Number}]);
	if (e) throw e;
	if (value < 0) { throw Error.argumentOutOfRange('value', value, Sys.Res.invalidTimeout); }
	this._timeout = value;
}
function Sys$Net$WebServiceProxy$get_defaultUserContext() {
	/// <value mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultUserContext"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return (typeof (this._userContext) === "undefined") ? null : this._userContext;
}
function Sys$Net$WebServiceProxy$set_defaultUserContext(value) {
	var e = Function._validateParams(arguments, [{ name: "value", mayBeNull: true}]);
	if (e) throw e;
	this._userContext = value;
}
function Sys$Net$WebServiceProxy$get_defaultSucceededCallback() {
	/// <value type="Function" mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultSucceededCallback"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._succeeded || null;
}
function Sys$Net$WebServiceProxy$set_defaultSucceededCallback(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Function, mayBeNull: true}]);
	if (e) throw e;
	this._succeeded = value;
}
function Sys$Net$WebServiceProxy$get_defaultFailedCallback() {
	/// <value type="Function" mayBeNull="true" locid="P:J#Sys.Net.WebServiceProxy.defaultFailedCallback"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._failed || null;
}
function Sys$Net$WebServiceProxy$set_defaultFailedCallback(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Function, mayBeNull: true}]);
	if (e) throw e;
	this._failed = value;
}
function Sys$Net$WebServiceProxy$get_enableJsonp() {
	/// <value type="Boolean" locid="P:J#Sys.Net.WebServiceProxy.enableJsonp"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return !!this._jsonp;
}
function Sys$Net$WebServiceProxy$set_enableJsonp(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: Boolean}]);
	if (e) throw e;
	this._jsonp = value;
}
function Sys$Net$WebServiceProxy$get_path() {
	/// <value type="String" locid="P:J#Sys.Net.WebServiceProxy.path"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._path || null;
}
function Sys$Net$WebServiceProxy$set_path(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: String}]);
	if (e) throw e;
	this._path = value;
}
function Sys$Net$WebServiceProxy$get_jsonpCallbackParameter() {
	/// <value type="String" locid="P:J#Sys.Net.WebServiceProxy.jsonpCallbackParameter"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._callbackParameter || "callback";
}
function Sys$Net$WebServiceProxy$set_jsonpCallbackParameter(value) {
	var e = Function._validateParams(arguments, [{ name: "value", type: String}]);
	if (e) throw e;
	this._callbackParameter = value;
}
function Sys$Net$WebServiceProxy$_invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext) {
	/// <summary locid="M:J#Sys.Net.WebServiceProxy._invoke" />
	/// <param name="servicePath" type="String"></param>
	/// <param name="methodName" type="String"></param>
	/// <param name="useGet" type="Boolean"></param>
	/// <param name="params"></param>
	/// <param name="onSuccess" type="Function" mayBeNull="true" optional="true"></param>
	/// <param name="onFailure" type="Function" mayBeNull="true" optional="true"></param>
	/// <param name="userContext" mayBeNull="true" optional="true"></param>
	/// <returns type="Sys.Net.WebRequest" mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
            { name: "servicePath", type: String },
            { name: "methodName", type: String },
            { name: "useGet", type: Boolean },
            { name: "params" },
            { name: "onSuccess", type: Function, mayBeNull: true, optional: true },
            { name: "onFailure", type: Function, mayBeNull: true, optional: true },
            { name: "userContext", mayBeNull: true, optional: true }
        ]);
	if (e) throw e;
	onSuccess = onSuccess || this.get_defaultSucceededCallback();
	onFailure = onFailure || this.get_defaultFailedCallback();
	if (userContext === null || typeof userContext === 'undefined') userContext = this.get_defaultUserContext();
	return Sys.Net.WebServiceProxy.invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, this.get_timeout(), this.get_enableJsonp(), this.get_jsonpCallbackParameter());
}
Sys.Net.WebServiceProxy.prototype = {
	get_timeout: Sys$Net$WebServiceProxy$get_timeout,
	set_timeout: Sys$Net$WebServiceProxy$set_timeout,
	get_defaultUserContext: Sys$Net$WebServiceProxy$get_defaultUserContext,
	set_defaultUserContext: Sys$Net$WebServiceProxy$set_defaultUserContext,
	get_defaultSucceededCallback: Sys$Net$WebServiceProxy$get_defaultSucceededCallback,
	set_defaultSucceededCallback: Sys$Net$WebServiceProxy$set_defaultSucceededCallback,
	get_defaultFailedCallback: Sys$Net$WebServiceProxy$get_defaultFailedCallback,
	set_defaultFailedCallback: Sys$Net$WebServiceProxy$set_defaultFailedCallback,
	get_enableJsonp: Sys$Net$WebServiceProxy$get_enableJsonp,
	set_enableJsonp: Sys$Net$WebServiceProxy$set_enableJsonp,
	get_path: Sys$Net$WebServiceProxy$get_path,
	set_path: Sys$Net$WebServiceProxy$set_path,
	get_jsonpCallbackParameter: Sys$Net$WebServiceProxy$get_jsonpCallbackParameter,
	set_jsonpCallbackParameter: Sys$Net$WebServiceProxy$set_jsonpCallbackParameter,
	_invoke: Sys$Net$WebServiceProxy$_invoke
}
Sys.Net.WebServiceProxy.registerClass('Sys.Net.WebServiceProxy');
Sys.Net.WebServiceProxy.invoke = function Sys$Net$WebServiceProxy$invoke(servicePath, methodName, useGet, params, onSuccess, onFailure, userContext, timeout, enableJsonp, jsonpCallbackParameter) {
	/// <summary locid="M:J#Sys.Net.WebServiceProxy.invoke" />
	/// <param name="servicePath" type="String"></param>
	/// <param name="methodName" type="String" mayBeNull="true" optional="true"></param>
	/// <param name="useGet" type="Boolean" optional="true"></param>
	/// <param name="params" mayBeNull="true" optional="true"></param>
	/// <param name="onSuccess" type="Function" mayBeNull="true" optional="true"></param>
	/// <param name="onFailure" type="Function" mayBeNull="true" optional="true"></param>
	/// <param name="userContext" mayBeNull="true" optional="true"></param>
	/// <param name="timeout" type="Number" optional="true"></param>
	/// <param name="enableJsonp" type="Boolean" optional="true" mayBeNull="true"></param>
	/// <param name="jsonpCallbackParameter" type="String" optional="true" mayBeNull="true"></param>
	/// <returns type="Sys.Net.WebRequest" mayBeNull="true"></returns>
	var e = Function._validateParams(arguments, [
        { name: "servicePath", type: String },
        { name: "methodName", type: String, mayBeNull: true, optional: true },
        { name: "useGet", type: Boolean, optional: true },
        { name: "params", mayBeNull: true, optional: true },
        { name: "onSuccess", type: Function, mayBeNull: true, optional: true },
        { name: "onFailure", type: Function, mayBeNull: true, optional: true },
        { name: "userContext", mayBeNull: true, optional: true },
        { name: "timeout", type: Number, optional: true },
        { name: "enableJsonp", type: Boolean, mayBeNull: true, optional: true },
        { name: "jsonpCallbackParameter", type: String, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	var schemeHost = (enableJsonp !== false) ? Sys.Net.WebServiceProxy._xdomain.exec(servicePath) : null,
        tempCallback, jsonp = schemeHost && (schemeHost.length === 3) &&
            ((schemeHost[1] !== location.protocol) || (schemeHost[2] !== location.host));
	useGet = jsonp || useGet;
	if (jsonp) {
		jsonpCallbackParameter = jsonpCallbackParameter || "callback";
		tempCallback = "_jsonp" + Sys._jsonp++;
	}
	if (!params) params = {};
	var urlParams = params;
	if (!useGet || !urlParams) urlParams = {};
	var script, error, timeoutcookie = null, loader, body = null,
        url = Sys.Net.WebRequest._createUrl(methodName
            ? (servicePath + "/" + encodeURIComponent(methodName))
            : servicePath, urlParams, jsonp ? (jsonpCallbackParameter + "=Sys." + tempCallback) : null);
	if (jsonp) {
		script = document.createElement("script");
		script.src = url;
		loader = new Sys._ScriptLoaderTask(script, function (script, loaded) {
			if (!loaded || tempCallback) {
				jsonpComplete({ Message: String.format(Sys.Res.webServiceFailedNoMsg, methodName) }, -1);
			}
		});
		function jsonpComplete(data, statusCode) {
			if (timeoutcookie !== null) {
				window.clearTimeout(timeoutcookie);
				timeoutcookie = null;
			}
			loader.dispose();
			delete Sys[tempCallback];
			tempCallback = null;
			if ((typeof (statusCode) !== "undefined") && (statusCode !== 200)) {
				if (onFailure) {
					error = new Sys.Net.WebServiceError(false,
                            data.Message || String.format(Sys.Res.webServiceFailedNoMsg, methodName),
                            data.StackTrace || null,
                            data.ExceptionType || null,
                            data);
					error._statusCode = statusCode;
					onFailure(error, userContext, methodName);
				}
				else {
					if (data.StackTrace && data.Message) {
						error = data.StackTrace + "-- " + data.Message;
					}
					else {
						error = data.StackTrace || data.Message;
					}
					error = String.format(error ? Sys.Res.webServiceFailed : Sys.Res.webServiceFailedNoMsg, methodName, error);
					throw Sys.Net.WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
				}
			}
			else if (onSuccess) {
				onSuccess(data, userContext, methodName);
			}
		}
		Sys[tempCallback] = jsonpComplete;
		loader.execute();
		return null;
	}
	var request = new Sys.Net.WebRequest();
	request.set_url(url);
	request.get_headers()['Content-Type'] = 'application/json; charset=utf-8';
	if (!useGet) {
		body = Sys.Serialization.JavaScriptSerializer.serialize(params);
		if (body === "{}") body = "";
	}
	request.set_body(body);
	request.add_completed(onComplete);
	if (timeout && timeout > 0) request.set_timeout(timeout);
	request.invoke();

	function onComplete(response, eventArgs) {
		if (response.get_responseAvailable()) {
			var statusCode = response.get_statusCode();
			var result = null;

			try {
				var contentType = response.getResponseHeader("Content-Type");
				if (contentType.startsWith("application/json")) {
					result = response.get_object();
				}
				else if (contentType.startsWith("text/xml")) {
					result = response.get_xml();
				}
				else {
					result = response.get_responseData();
				}
			} catch (ex) {
			}
			var error = response.getResponseHeader("jsonerror");
			var errorObj = (error === "true");
			if (errorObj) {
				if (result) {
					result = new Sys.Net.WebServiceError(false, result.Message, result.StackTrace, result.ExceptionType, result);
				}
			}
			else if (contentType.startsWith("application/json")) {
				result = (!result || (typeof (result.d) === "undefined")) ? result : result.d;
			}
			if (((statusCode < 200) || (statusCode >= 300)) || errorObj) {
				if (onFailure) {
					if (!result || !errorObj) {
						result = new Sys.Net.WebServiceError(false, String.format(Sys.Res.webServiceFailedNoMsg, methodName));
					}
					result._statusCode = statusCode;
					onFailure(result, userContext, methodName);
				}
				else {
					if (result && errorObj) {
						error = result.get_exceptionType() + "-- " + result.get_message();
					}
					else {
						error = response.get_responseData();
					}
					throw Sys.Net.WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
				}
			}
			else if (onSuccess) {
				onSuccess(result, userContext, methodName);
			}
		}
		else {
			var msg;
			if (response.get_timedOut()) {
				msg = String.format(Sys.Res.webServiceTimedOut, methodName);
			}
			else {
				msg = String.format(Sys.Res.webServiceFailedNoMsg, methodName)
			}
			if (onFailure) {
				onFailure(new Sys.Net.WebServiceError(response.get_timedOut(), msg, "", ""), userContext, methodName);
			}
			else {
				throw Sys.Net.WebServiceProxy._createFailedError(methodName, msg);
			}
		}
	}
	return request;
}
Sys.Net.WebServiceProxy._createFailedError = function Sys$Net$WebServiceProxy$_createFailedError(methodName, errorMessage) {
	var displayMessage = "Sys.Net.WebServiceFailedException: " + errorMessage;
	var e = Error.create(displayMessage, { 'name': 'Sys.Net.WebServiceFailedException', 'methodName': methodName });
	e.popStackFrame();
	return e;
}
Sys.Net.WebServiceProxy._defaultFailedCallback = function Sys$Net$WebServiceProxy$_defaultFailedCallback(err, methodName) {
	var error = err.get_exceptionType() + "-- " + err.get_message();
	throw Sys.Net.WebServiceProxy._createFailedError(methodName, String.format(Sys.Res.webServiceFailed, methodName, error));
}
Sys.Net.WebServiceProxy._generateTypedConstructor = function Sys$Net$WebServiceProxy$_generateTypedConstructor(type) {
	return function (properties) {
		if (properties) {
			for (var name in properties) {
				this[name] = properties[name];
			}
		}
		this.__type = type;
	}
}
Sys._jsonp = 0;
Sys.Net.WebServiceProxy._xdomain = /^\s*([a-zA-Z0-9\+\-\.]+\:)\/\/([^?#\/]+)/;

Sys.Net.WebServiceError = function Sys$Net$WebServiceError(timedOut, message, stackTrace, exceptionType, errorObject) {
	/// <summary locid="M:J#Sys.Net.WebServiceError.#ctor" />
	/// <param name="timedOut" type="Boolean"></param>
	/// <param name="message" type="String" mayBeNull="true"></param>
	/// <param name="stackTrace" type="String" mayBeNull="true" optional="true"></param>
	/// <param name="exceptionType" type="String" mayBeNull="true" optional="true"></param>
	/// <param name="errorObject" type="Object" mayBeNull="true" optional="true"></param>
	var e = Function._validateParams(arguments, [
        { name: "timedOut", type: Boolean },
        { name: "message", type: String, mayBeNull: true },
        { name: "stackTrace", type: String, mayBeNull: true, optional: true },
        { name: "exceptionType", type: String, mayBeNull: true, optional: true },
        { name: "errorObject", type: Object, mayBeNull: true, optional: true }
    ]);
	if (e) throw e;
	this._timedOut = timedOut;
	this._message = message;
	this._stackTrace = stackTrace;
	this._exceptionType = exceptionType;
	this._errorObject = errorObject;
	this._statusCode = -1;
}
function Sys$Net$WebServiceError$get_timedOut() {
	/// <value type="Boolean" locid="P:J#Sys.Net.WebServiceError.timedOut"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._timedOut;
}
function Sys$Net$WebServiceError$get_statusCode() {
	/// <value type="Number" locid="P:J#Sys.Net.WebServiceError.statusCode"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._statusCode;
}
function Sys$Net$WebServiceError$get_message() {
	/// <value type="String" locid="P:J#Sys.Net.WebServiceError.message"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._message;
}
function Sys$Net$WebServiceError$get_stackTrace() {
	/// <value type="String" locid="P:J#Sys.Net.WebServiceError.stackTrace"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._stackTrace || "";
}
function Sys$Net$WebServiceError$get_exceptionType() {
	/// <value type="String" locid="P:J#Sys.Net.WebServiceError.exceptionType"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._exceptionType || "";
}
function Sys$Net$WebServiceError$get_errorObject() {
	/// <value type="Object" locid="P:J#Sys.Net.WebServiceError.errorObject"></value>
	if (arguments.length !== 0) throw Error.parameterCount();
	return this._errorObject || null;
}
Sys.Net.WebServiceError.prototype = {
	get_timedOut: Sys$Net$WebServiceError$get_timedOut,
	get_statusCode: Sys$Net$WebServiceError$get_statusCode,
	get_message: Sys$Net$WebServiceError$get_message,
	get_stackTrace: Sys$Net$WebServiceError$get_stackTrace,
	get_exceptionType: Sys$Net$WebServiceError$get_exceptionType,
	get_errorObject: Sys$Net$WebServiceError$get_errorObject
}
Sys.Net.WebServiceError.registerClass('Sys.Net.WebServiceError');


Type.registerNamespace('Sys');

Sys.Res = {
	'argumentTypeName': 'Value is not the name of an existing type.',
	'cantBeCalledAfterDispose': 'Can\'t be called after dispose.',
	'componentCantSetIdAfterAddedToApp': 'The id property of a component can\'t be set after it\'s been added to the Application object.',
	'behaviorDuplicateName': 'A behavior with name \'{0}\' already exists or it is the name of an existing property on the target element.',
	'notATypeName': 'Value is not a valid type name.',
	'elementNotFound': 'An element with id \'{0}\' could not be found.',
	'stateMustBeStringDictionary': 'The state object can only have null and string fields.',
	'boolTrueOrFalse': 'Value must be \'true\' or \'false\'.',
	'scriptLoadFailedNoHead': 'ScriptLoader requires pages to contain a <head> element.',
	'stringFormatInvalid': 'The format string is invalid.',
	'referenceNotFound': 'Component \'{0}\' was not found.',
	'enumReservedName': '\'{0}\' is a reserved name that can\'t be used as an enum value name.',
	'circularParentChain': 'The chain of control parents can\'t have circular references.',
	'namespaceContainsNonObject': 'Object {0} already exists and is not an object.',
	'undefinedEvent': '\'{0}\' is not an event.',
	'propertyUndefined': '\'{0}\' is not a property or an existing field.',
	'observableConflict': 'Object already contains a member with the name \'{0}\'.',
	'historyCannotEnableHistory': 'Cannot set enableHistory after initialization.',
	'eventHandlerInvalid': 'Handler was not added through the Sys.UI.DomEvent.addHandler method.',
	'scriptLoadFailedDebug': 'The script \'{0}\' failed to load. Check for:\r\n Inaccessible path.\r\n Script errors. (IE) Enable \'Display a notification about every script error\' under advanced settings.',
	'propertyNotWritable': '\'{0}\' is not a writable property.',
	'enumInvalidValueName': '\'{0}\' is not a valid name for an enum value.',
	'controlAlreadyDefined': 'A control is already associated with the element.',
	'addHandlerCantBeUsedForError': 'Can\'t add a handler for the error event using this method. Please set the window.onerror property instead.',
	'cantAddNonFunctionhandler': 'Can\'t add a handler that is not a function.',
	'invalidNameSpace': 'Value is not a valid namespace identifier.',
	'notAnInterface': 'Value is not a valid interface.',
	'eventHandlerNotFunction': 'Handler must be a function.',
	'propertyNotAnArray': '\'{0}\' is not an Array property.',
	'namespaceContainsClass': 'Object {0} already exists as a class, enum, or interface.',
	'typeRegisteredTwice': 'Type {0} has already been registered. The type may be defined multiple times or the script file that defines it may have already been loaded. A possible cause is a change of settings during a partial update.',
	'cantSetNameAfterInit': 'The name property can\'t be set on this object after initialization.',
	'historyMissingFrame': 'For the history feature to work in IE, the page must have an iFrame element with id \'__historyFrame\' pointed to a page that gets its title from the \'title\' query string parameter and calls Sys.Application._onIFrameLoad() on the parent window. This can be done by setting EnableHistory to true on ScriptManager.',
	'appDuplicateComponent': 'Two components with the same id \'{0}\' can\'t be added to the application.',
	'historyCannotAddHistoryPointWithHistoryDisabled': 'A history point can only be added if enableHistory is set to true.',
	'baseNotAClass': 'Value is not a class.',
	'expectedElementOrId': 'Value must be a DOM element or DOM element Id.',
	'methodNotFound': 'No method found with name \'{0}\'.',
	'arrayParseBadFormat': 'Value must be a valid string representation for an array. It must start with a \'[\' and end with a \']\'.',
	'stateFieldNameInvalid': 'State field names must not contain any \'=\' characters.',
	'cantSetId': 'The id property can\'t be set on this object.',
	'stringFormatBraceMismatch': 'The format string contains an unmatched opening or closing brace.',
	'enumValueNotInteger': 'An enumeration definition can only contain integer values.',
	'propertyNullOrUndefined': 'Cannot set the properties of \'{0}\' because it returned a null value.',
	'argumentDomNode': 'Value must be a DOM element or a text node.',
	'componentCantSetIdTwice': 'The id property of a component can\'t be set more than once.',
	'createComponentOnDom': 'Value must be null for Components that are not Controls or Behaviors.',
	'createNotComponent': '{0} does not derive from Sys.Component.',
	'createNoDom': 'Value must not be null for Controls and Behaviors.',
	'cantAddWithoutId': 'Can\'t add a component that doesn\'t have an id.',
	'urlTooLong': 'The history state must be small enough to not make the url larger than {0} characters.',
	'notObservable': 'Instances of type \'{0}\' cannot be observed.',
	'badTypeName': 'Value is not the name of the type being registered or the name is a reserved word.',
	'argumentInteger': 'Value must be an integer.',
	'invokeCalledTwice': 'Cannot call invoke more than once.',
	'webServiceFailed': 'The server method \'{0}\' failed with the following error: {1}',
	'argumentType': 'Object cannot be converted to the required type.',
	'argumentNull': 'Value cannot be null.',
	'scriptAlreadyLoaded': 'The script \'{0}\' has been referenced multiple times. If referencing Microsoft AJAX scripts explicitly, set the MicrosoftAjaxMode property of the ScriptManager to Explicit.',
	'scriptDependencyNotFound': 'The script \'{0}\' failed to load because it is dependent on script \'{1}\'.',
	'formatBadFormatSpecifier': 'Format specifier was invalid.',
	'requiredScriptReferenceNotIncluded': '\'{0}\' requires that you have included a script reference to \'{1}\'.',
	'webServiceFailedNoMsg': 'The server method \'{0}\' failed.',
	'argumentDomElement': 'Value must be a DOM element.',
	'invalidExecutorType': 'Could not create a valid Sys.Net.WebRequestExecutor from: {0}.',
	'cannotCallBeforeResponse': 'Cannot call {0} when responseAvailable is false.',
	'actualValue': 'Actual value was {0}.',
	'enumInvalidValue': '\'{0}\' is not a valid value for enum {1}.',
	'scriptLoadFailed': 'The script \'{0}\' could not be loaded.',
	'parameterCount': 'Parameter count mismatch.',
	'cannotDeserializeEmptyString': 'Cannot deserialize empty string.',
	'formatInvalidString': 'Input string was not in a correct format.',
	'invalidTimeout': 'Value must be greater than or equal to zero.',
	'cannotAbortBeforeStart': 'Cannot abort when executor has not started.',
	'argument': 'Value does not fall within the expected range.',
	'cannotDeserializeInvalidJson': 'Cannot deserialize. The data does not correspond to valid JSON.',
	'invalidHttpVerb': 'httpVerb cannot be set to an empty or null string.',
	'nullWebRequest': 'Cannot call executeRequest with a null webRequest.',
	'eventHandlerInvalid': 'Handler was not added through the Sys.UI.DomEvent.addHandler method.',
	'cannotSerializeNonFiniteNumbers': 'Cannot serialize non finite numbers.',
	'argumentUndefined': 'Value cannot be undefined.',
	'webServiceInvalidReturnType': 'The server method \'{0}\' returned an invalid type. Expected type: {1}',
	'servicePathNotSet': 'The path to the web service has not been set.',
	'argumentTypeWithTypes': 'Object of type \'{0}\' cannot be converted to type \'{1}\'.',
	'cannotCallOnceStarted': 'Cannot call {0} once started.',
	'badBaseUrl1': 'Base URL does not contain ://.',
	'badBaseUrl2': 'Base URL does not contain another /.',
	'badBaseUrl3': 'Cannot find last / in base URL.',
	'setExecutorAfterActive': 'Cannot set executor after it has become active.',
	'paramName': 'Parameter name: {0}',
	'nullReferenceInPath': 'Null reference while evaluating data path: \'{0}\'.',
	'cannotCallOutsideHandler': 'Cannot call {0} outside of a completed event handler.',
	'cannotSerializeObjectWithCycle': 'Cannot serialize object with cyclic reference within child properties.',
	'format': 'One of the identified items was in an invalid format.',
	'assertFailedCaller': 'Assertion Failed: {0}\r\nat {1}',
	'argumentOutOfRange': 'Specified argument was out of the range of valid values.',
	'webServiceTimedOut': 'The server method \'{0}\' timed out.',
	'notImplemented': 'The method or operation is not implemented.',
	'assertFailed': 'Assertion Failed: {0}',
	'invalidOperation': 'Operation is not valid due to the current state of the object.',
	'breakIntoDebugger': '{0}\r\n\r\nBreak into debugger?'
};;