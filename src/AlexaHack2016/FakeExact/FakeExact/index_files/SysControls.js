/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

var _syscontrolsversion = "1.4.1.20";

// Code documentation
//
// see also http://weblogs.asp.net/bleroy/archive/2007/04/23/the-format-for-javascript-doc-comments.aspx
// preparations for VS 11 seel http://msdn.microsoft.com/en-us/library/hh524453(v=vs.110).aspx
//
// Function documentation:
//
/// <summary></summary>
/// <param name="" type=""></param>
/// <returns type="undefined">undefined</returns>
//
// optional summary attributes: 
//      locid="descriptionID"
// optional param attributes: 
//      mayBeNull="true|false" 
//      optional="true|false"
//      parameterArray="true|false"
//      integer="true|false" 
//      domElement="true|false"
//      elementType="ArrayElementType" 
//      elementInteger="true|false"
//      elementDomElement="true|false"
//      elementMayBeNull="true|false"
// optional returns attributes
//      mayBeNull="true|false" 
//      optional="true|false"
//      parameterArray="true|false"
//      integer="true|false" 
//      domElement="true|false"
//      elementType="ArrayElementType" 
//      elementInteger="true|false"
//      elementDomElement="true|false"
//      elementMayBeNull="true|false"
//
// Object documentation
/// <summary></summary>
/// <param name="" type=""></param>
/// <field name="" type=""></field>
//
// Used, but not (yet) supported by MS
/// <remarks></remarks>

if ($ && $.fn) {
	$.extend($.expr[':'], {
		readonly: function(a) {
			return !!a.readOnly;
		}
	});
}

// Limited to input fields a) because in ff focus/blur events are only defined on input elements and not on e.g.
// <td> and b) to not kill responsiveness with binding hundreds of elements (especially since the blur does not 
// propagate, which is probably also the reason why not the $.live does not support blur/focus).
var _BINDQUERY = ":input:not(:hidden)";
function _BindSaveCurEl(context) {
	/// <summary>Not intended for public use.</summary>

	$(_BINDQUERY, context || document).bind("blur", _SaveCurEl);
}

function _UnbindSaveCurEl(context) {
	/// <summary>Not intended for public use.</summary>

	// The following is a workaround for IE: when saveHistory is added to an element's class IE 'disables' / removes
	// the element's removeAttribute function, which is called in the jquery unbind.
	var hist = $(":input.saveHistory");
	hist.removeClass("saveHistory");
	hist.unbind("blur", _SaveCurEl);
	hist.addClass("saveHistory");

	$(_BINDQUERY + ":not(.saveHistory)", context || document).unbind("blur", _SaveCurEl);

}

function _SaveCurEl() {
	/// <summary>Not intended for public use.</summary>

	document.previousElement = this;
}
;/// <reference path="../base/jquery-1.5.1.js" />

(function () {

	var UserAgent = {
		agent: null,
		version: null,
		majorVersion: null,
		minorVersion: null,
		revisionVersion: null
	};

	UserAgent.Agents = {
		InternetExplorer: 0,
		FireFox: 1,
		Safari: 2,
		Chrome: 3,
		Opera: 4,
		InternetExplorer11OrUp: 5,
		Edge: 6
	};

	(function () {
		if (navigator.userAgent.indexOf(' MSIE ') > -1) {
			// As of IE11 MS no longer supplies MSIE in the user agent string (As MS claims, they only write compliant code)
			UserAgent.agent = UserAgent.Agents.InternetExplorer;
			UserAgent.version = navigator.userAgent.match(/MSIE (\d+.[\d+.?]+)/)[1];
		}
		else if (navigator.userAgent.indexOf(' Trident') > -1) {
			//e.g. Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko
			UserAgent.agent = UserAgent.Agents.InternetExplorer11OrUp;
			UserAgent.version = navigator.userAgent.match(/ rv:(\d+.[\d+.?]+)/)[1];
		}
		else if (navigator.userAgent.indexOf(' Firefox/') > -1) {
			UserAgent.agent = UserAgent.Agents.FireFox;
			UserAgent.version = navigator.userAgent.match(/ Firefox\/(\d+.[\d+.?]+)/)[1];
		}
			// Note: KEEP Edge before Chrome, both keywords will be present in the user agent string.
		else if (navigator.userAgent.indexOf(' Edge/') > -1) {
			UserAgent.agent = UserAgent.Agents.Edge;
			UserAgent.version = navigator.userAgent.match(/ Edge\/(\d+.[\d+.?]+)/)[1];
		}
			// Note: KEEP chrome before Safari, both keywords will be present in the user agent string.
		else if (navigator.userAgent.indexOf(' Chrome/') > -1) {
			UserAgent.agent = UserAgent.Agents.Chrome;
			UserAgent.version = navigator.userAgent.match(/ Chrome\/(\d+.[\d+.?]+)/)[1];
		}
		else if (navigator.userAgent.indexOf(' Safari/') > -1) {
			UserAgent.agent = UserAgent.Agents.Safari;
			UserAgent.version = navigator.userAgent.match(/ Version\/(\d+.[\d+.?]+)/)[1];
		}
		else if (navigator.userAgent.indexOf('Opera/') > -1) {
			UserAgent.agent = UserAgent.Agents.Opera;
			UserAgent.version = navigator.userAgent.match(/Version\/(\d+.[\d+.?]+)/)[1];
		}

		if (UserAgent.version != null) {
			var start = UserAgent.version.indexOf(".");
			var end = start > -1 ? UserAgent.version.indexOf(".", start + 1) : -1;
			UserAgent.majorVersion = UserAgent.version.substring(0, start);
			UserAgent.minorVersion = UserAgent.version.substring(start + 1, end > -1 ? end : undefined);
			start = end;
			end = start > -1 ? UserAgent.version.indexOf(".", start + 1) : -1;
			UserAgent.revisionVersion = UserAgent.version.substring(start + 1, end > -1 ? end : undefined);
		}
		else {
			UserAgent.majorVersion = undefined;
			UserAgent.minorVersion = undefined;
			UserAgent.revisionVersion = undefined;
		}
	})();

	UserAgent.IsIE = function () {
		/// <summary>Returns if the user agent is an internet explorer of version 10 or lower.</summary>
		/// <returns type="Boolean"></returns>
		return UserAgent.agent === UserAgent.Agents.InternetExplorer;
	};

	UserAgent.IsIE11OrUp = function () {
		/// <summary>Returns if the user agent is an internet explorer of version 11 or higher.</summary>
		/// <returns type="Boolean"></returns>
		return UserAgent.agent === UserAgent.Agents.InternetExplorer11OrUp;
	};

	UserAgent.IsEdge = function () {
		/// <summary>Returns if the user agent is Edge.</summary>
		/// <returns type="Boolean"></returns>
		return UserAgent.agent === UserAgent.Agents.Edge;
	}

	UserAgent.IsFF = function () {
		/// <summary>Returns if the user agent is FireFox.</summary>
		/// <returns type="Boolean"></returns>
		return UserAgent.agent === UserAgent.Agents.FireFox;
	}

	UserAgent.IsSafari = function () {
		/// <summary>Returns if the user agent is Safari.</summary>
		/// <returns type="Boolean"></returns>
		return UserAgent.agent === UserAgent.Agents.Safari;
	}

	UserAgent.IsChrome = function () {
		/// <summary>Returns if the user agent is Chrome.</summary>
		/// <returns type="Boolean"></returns>
		return UserAgent.agent === UserAgent.Agents.Chrome;
	}

	UserAgent.IsOpera = function () {
		/// <summary>Returns if the user agent is Opera.</summary>
		/// <returns type="Boolean"></returns>
		return UserAgent.agent === UserAgent.Agents.Opera;
	}

	function UserAgent() {
		/// <summary>A namespace containing functionality to determine user agents.</summary>
		/// <field name="agent" type="UserAgent.Agents">Returns the user agent.</field>
		/// <field name="version" type="String">complete version of the user agent e.g. "3.6.18".</field>
		/// <field name="majorVersion" type="Integer|undefined">Returns the first integer part of the version.</field>
		/// <field name="minorVersion" type="Integer|undefined">Returns the second integer part of the version.</field>
		/// <returns type="undefined">undefined</returns>

		throw new Error("This is not an instantiable object");
	}

	window.UserAgent = UserAgent;

})();
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="SysHandleKey.js" />
/// <reference path="SysUserAgent.js" />

// Object to manipulate DOM elements

// ----- Interface -----

SysElement.prototype = {

	element: $(document),
	empty: true,
	id: null,

	// Initialisation

	Init: function (el, dom) {
		/// <summary>(Re-)initialize the object with the provided element(reference).</summary>
		/// <param name="el">See constructor.</param>
		/// <param name="dom">See constructor.</param>
		/// <returns type="undefined">undefined</returns>
	},

	// Size / position

	Top: function (val) {
		/// <summary>Sets the CSS top (relative to its offsetParent) / Gets the top (relative to the HTML document).</summary>
		/// <param name="val" type="Number|String" optional="true">If val is a number a size in pixels is assumed.</param>
		/// <returns type="Number|Undefined">If no val was supplied the offset top is returned.</returns>
	},
	Left: function (val) {
		/// <summary>Sets the CSS left (relative to its offsetParent) / Gets the left (relative to the HTML document)</summary>
		/// <param name="val" type="Number|String" optional="true">If val is a number a size in pixels is assumed.</param>
		/// <returns type="Number|Undefined">If no val was supplied the offset left is returned.</returns>
	},
	Width: function (val) {
		/// <summary>Get/sets the current computed width in pixels, excluding padding, border or
		/// margin. If either of these need to be included use either Inner-, Outer- or TotalWidth.<\br>
		/// Note: when setting the width/height of a div this EXcludes the margin, padding and border.
		/// When setting the width/height of a table this INcludes the padding and border, but excludes the margin.
		/// </summary>
		/// <param name="val" type="Number|String" optional="true">If val is a number a size in pixels is assumed.</param>
		/// <returns type="Number|Undefined">If no val was supplied the width is returned.</returns>
	},
	InnerWidth: function () {
		/// <summary>Gets the current computed width of the element in pixels, including padding.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	OuterWidth: function () {
		/// <summary>Gets the current computed width of the element in pixels, including padding and border.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	TotalWidth: function () {
		/// <summary>Gets the current computed width of the element in pixels, including padding border and margin.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	Height: function (val) {
		/// <summary>Gets/sets the current computed height of the element in pixels, excluding padding, border or
		/// margin. If either of these need to be included use either Inner-, Outer- or TotalHeight.<\br>
		/// Note: when setting the width/height of a div this EXcludes the margin, padding and border.
		/// When setting the width/height of a table this INcludes the padding and border, but excludes the margin.
		/// </summary>
		/// <param name="val" type="Number|String" optional="true">If val is a number a size in pixels is assumed.</param>
		/// <returns type="Number|Undefined">If no val was supplied the height is returned.</returns>
	},
	InnerHeight: function () {
		/// <summary>Gets the current computed height of the element in pixels, including padding.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	OuterHeight: function () {
		/// <summary>Gets the current computed height of the element in pixels, including padding and border.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	TotalHeight: function () {
		/// <summary>Gets the current computed height of the element in pixels, including padding border and margin.</summary>
		/// <returns type="undefined">undefined</returns>
	},

	// Common attributes

	Attribute: function (name, value) {
		/// <summary>
		/// </summary>
		/// <param name="name" type="String">The name of the attribute to get or set. NOTE: this handles element 
		/// attributes, NOT style attributes. Use this generic variant only if no specific variant available: e.g. 
		/// use IsChecked/GetChecked.</param>
		/// <param name="value" type="Any" optional="true">When specified the value is set, otherwise the value
		/// is returned.</param>
		/// <returns type="string|undefined">undefined if the attribute is undefined, a string value in all other 
		/// cases.</returns>
	},
	Css: function (prop, val) {
		/// <summary>Get/set the value of a style sheet property. Note: make sure none of the named properties/methods 
		/// are more appropriate.</summary>
		/// <param name="prop" type="String">The css-name of the style sheet property.</param>
		/// <param name="val" type="Number|String" optional="true">Value to assign to the property.</param>
		/// <returns type="String|undefined">If no value was supplied the value of the style property is returned.
		/// </returns>
	},
	SetChecked: function (checked) {
		/// <summary>Set (true) /remove (false) the checkmark. Applies to input type=checkbox|radio.</summary>
		/// <param name="checked" type="Boolean"></param>
		/// <returns type="undefined">undefined</returns>
	},
	SetDisabled: function (disabled) {
		/// <summary>Enable/disable an element. Supplying an argument that evaluates to true disables it, 
		/// false enables it. Applies to button, input, optgroup, option, select, and textarea elements.
		/// </summary>
		/// <param name="disabled" type="Boolean"></param>
		/// <returns type="undefined">undefined</returns>
	},
	SetReadonly: function (readonly) {
		/// <summary>Set the readonly state. Applies to input and textarea elements only.</summary>
		/// <param name="readonly" type="Boolean"></param>
		/// <returns type="undefined">undefined</returns>
	},
	SetSelected: function (selected) {
		/// <summary>Set the selected state. Applies to option elements.</summary>
		/// <param name="selected" type="Boolean"></param>
		/// <returns type="undefined">undefined</returns>
	},
	TabIndex: function (idx) {
		/// <summary>Gets/sets the tab index.</summary>
		/// <param name="idx" type="Number" optional="true"></param>
		/// <returns type="Number">undefined</returns>
	},
	AddClass: function (className) {
		/// <summary>Adds a css class to the element's class definition.</summary>
		/// <param name="className" type="String"></param>
		/// <returns type="undefined">undefined</returns>
	},
	RemoveClass: function (className) {
		/// <summary>Remove a css class from the element's class definition.</summary>
		/// <param name="className" type="String"></param>
		/// <returns type="undefined">undefined</returns>
	},
	HasClass: function (className) {
		/// <summary>Determines if a css class is in the element's class definition.</summary>
		/// <param name="className" type="String"></param>
		/// <returns type="undefined">undefined</returns>
	},
	Is: function (selector) {
		///	<summary>Returns if the current selection matches the selector expression.</summary>
		///	<param name="selector" type="String">The expression with which to filter, can be any valid jQuery 
		/// expression</param>
		///	<returns type="Boolean" />
	},
	IsChecked: function () {
		/// <summary>Determines if an element is checked. Applies to input type=checkbox|radio.</summary>
		/// <returns type="Boolean"></returns>
	},
	IsDisabled: function () {
		/// <summary>Determines if an element is disabled. Applies to button, input, optgroup, option, select, and 
		/// textarea elements.</summary>
		/// <returns type="Boolean"></returns>
	},
	IsReadonly: function () {
		/// <summary>Determines if an element is readlonly. Applies to input and textarea elements only.</summary>
		/// <returns type="Boolean"></returns>
	},
	IsSelected: function () {
		/// <summary>Determines if an element is selected. Applies to option elements.</summary>
		/// <returns type="Boolean"></returns>
	},
	IsVisible: function () {
		/// <summary>Determines if an element is visible/shown or hidden.</summary>
		/// <returns type="Boolean"></returns>
	},
	IsEmpty: function () {
		/// <summary>Returns if the value of the element is non-existent or an empty string.</summary>
		/// <returns type="Boolean">True if empty.</returns>
	},

	// Visibility

	Focus: function () {
		/// <summary>Sets the focus to the element. In case of checkbox it sets the focus to the checked element.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	Show: function () {
		/// <summary>Shows the element.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	Hide: function () {
		/// <summary>Hides the element.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	SetDisplay: function (display) {
		/// <summary>Set the display style attribute. Note: to hide / show elements use the Hide() / Show() interfaces.</summary>
		/// <param name="display" type="SysElement.Display"></param>
		/// <returns type="undefined">undefined</returns>
	},
	Select: function () {
		/// <summary>Selects the text inside none hidden input elements, that are of type text, password or file.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	SetPlaceholder: function (placeholderText) {
		/// <summary>Set / assign a placeholder upon this element, i.e. an instructional text that is displayed when the element has no value.</summary>
		/// <param name="placeholderText" type="String" optional="true">Text to be displayed inside the element (when it has no value).
		/// Alternatively this text is taken from the placeholder attribute.</param>
		/// <returns type="undefined">undefined</returns>
	},

	// Value

	Value: function (value) {
		/// <summary>Either sets a value to an element, meaning, e.g. in the case of a checkbox it will check/uncheck,
		/// it will set the correct option for radios, etc. Or, if value was not specified, returns the current value.
		/// </summary>
		/// <param name="value" type="Any" optional="true">When specified the value is set, otherwise the value
		/// is returned.</param>
		/// <returns type="boolean|String|undefined">boolean if the type of element is a checkbox, undefined if the 
		/// element is undefined, a string value in all other cases.</returns>
	},
	Text: function (value) {
		/// <summary>Either sets or gets the innertext of an element</summary>
		/// <param name="value" type="String"></param>
		/// <returns type="String"></returns>
	},

	// Event handling

	AttachEvent: function (event_name, func, contentWindow) {
		/// <summary>Attach an event handler to an element.</summary>
		/// <param name="event_name" type="String">Event type with/without the IE 'on' prefix.</param>
		/// <param name="func" type="Function">The handler that will be called when the event fires.</param>
		/// <param name="contentWindow" type="Window" optional="true">Supply the element's parent window, especially when 
		/// attaching events that are located inside a frame / outside the current window object.</param>
		/// <returns type="undefined">undefined</returns>
	},
	DetachEvent: function (event_name, func) {
		/// <summary>Detach an event handler, which was previously attached with SysAttachEvent.</summary>
		/// <param name="element" type="DOMElement"></param>
		/// <param name="event_name" type="String">Event type with/without the IE 'on' prefix.</param>
		/// <param name="func" type="Function">The handler that should no longer be called when the event fires.</param>
		/// <returns type="undefined">undefined</returns>
	},
	FireEvent: function (eventName) {
		/// <summary>Fire the event indicated. For now only events of type HTMLEvents are supported. In case other event types need 
		/// support, contact you know who.</summary>
		/// <param name="eventName" type="String">The preference is to supply the DOM compliant event names, but the IE 
		/// equivalents (prefixed with 'on') are also recognized.</param>
		/// <returns type="undefined">undefined</returns>
		/// <remarks>Usage of the jQuery $.change(), $.click(), ... are preferred over this interface. However it is a known issue, 
		/// for at least the change(), that handlers added at a later time (either through $addHandler or $.change(fn)) are not always
		/// called.</remarks>
	},

	// DOM traversal / manipulation

	Parent: function () {
		/// <summary>Finds the closest ancestor to match the selector; if no selector, finds the immediate parent</summary>
		/// <param name="selector" type="Any jQuery selector (optional)"></param>
		/// <returns type="jQuery">The result of the find</returns>
	},
	Siblings: function () {
		/// <summary>Gets a list of the element's siblings, filtered against the selector (if any)</summary>
		/// <param name="selector" type="Any jQuery selector (optional)"></param>
		/// <returns type="jQuery">The result of the find</returns>
	},
	Find: function () {
		/// <summary>Find one/more descendants, any level deep from this element</summary>
		/// <param name="selector" type="Any jQuery selector"></param>
		/// <returns type="jQuery">The result of the find</returns>
	},
	GetDomElement: function () {
		/// <summary>Returns the DOMElement around which this instance is wrapped.</summary>
		/// <returns type="DOMElement"></returns>
	},
	Remove: function () {
		/// <summary>Removes the element itself, as well as everything inside it from the DOM.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	PostFix: function (id) {
		/// <summary>Get the element with the current client id and a postfix added to it</summary>
		/// <param name="id" type="string">The postfix to be added to the client id of the current SysElement</param>
		/// <returns type="SysElement"></returns>
	}
};

// ----- Mimic enumerators -----

SysElement.Display = {
	/// <summary>'Enumerator' containing the display style attribute values. See the Web.UI.Html library for 
	/// explanations.</summary>
	Block: "block",
	Compact: "compact",
	Inherit: "inherit",
	Inline: "inline",
	InlineTable: "inline-table",
	ListItem: "list-item",
	Marker: "marker",
	None: "none",
	RunIn: "run-in",
	Table: "table",
	TableCaption: "table-caption",
	TableCell: "table-cell",
	TableColumn: "table-column",
	TableColumnGroup: "table-column-group",
	TableRow: "table-row",
	TableRowGroup: "table-row-group",
	TableFooterGroup: "table-footer-group",
	TableHeaderGroup: "table-header-group"
};

SysElement.Position = {
	/// <summary>'Enumerator' containing the position style attribute values. See the Web.UI.Html library for
	/// explanations.</summary>
	Inherit: "inherit",
	Absolute: "absolute",
	Fixed: "fixed",
	Relative: "relative",
	Static: "static"
};

// ----- Mimic statics -----

SysElement.IsJQuery = function(el) {
	/// <summary>Static method to Determine if the provided parameter is a jQuery object.</summary>
	if (el && el.jquery !== undefined) {
		return true;
	}
	else {
		return false;
	}
};

SysElement.IsSysElement = function(el) {
	/// <summary>Static method to determine if the provided parameter is a SysElement object.</summary>
	if (el && el.syselement !== undefined) {
		return true;
	}
	else {
		return false;
	}
};

SysElement.IsNothing = function(el) {
	/// <summary>Static method to determine if the provided parameter is either undefined or null.</summary>
	return (el === undefined || el === null);
};

SysElement.IsNotNothing = function(el) {
	/// <summary>Static method to determine if the provided parameter is not undefined or null.</summary>
	return !(SysElement.IsNothing(el));
};

SysElement.IsEmpty = function (val) {
	/// <summary>Returns if the value is non-existent or an empty string.</summary>
	/// <param name="val" type="Any"></param>
	/// <returns type="Boolean">True if empty.</returns>
	return (SysElement.IsNothing(val) || val == "");
};

SysElement.IsNotEmpty = function (val) {
	/// <summary>Returns if the value is not non-existent or an empty string.</summary>
	/// <param name="val" type="Any"></param>
	/// <returns type="Boolean">True if empty.</returns>
	return !(SysElement.IsEmpty(val));
};

var _SysElement;
SysElement.GetDomElement = function(el) {
	/// <summary>Static method to get the DOM element, regardless of what <paramref name="el"/> is (DOM element, jQuery object, ...)</summary>

	if (!_SysElement) {
		_SysElement = new SysElement(el);
	}
	_SysElement.Init(el);
	return _SysElement._el;
};

// ----- Constructor -----

function SysElement(el, domain) {
	/// <summary>Wraps a DOM element and provides an interface to manipulate it. Initially it is intended to operate
	/// on a single DOM element, but as it accepts jQuery objects it could also work on a range of DOM elements.
	/// </summary>
	/// <param name="el" type="Any" optional="true">el can be any from:
	///     - an element's id (i.e. a String)
	///		- a class name (i.e. a string preceded with a dot '.')
	///		- a pseudo element (i.e. starting with a semi-colon ':')
	///     - jQuery object
	///     - DOM element object
	///     - SysElement object
	///     - SysHandleEvent object, in which case it will wrap the event's target attribute ('srcElement').
	/// </param>
	/// <param name="domain" optional="true">Optionally limit the range in which to look for the specified element.</param>
	/// <field name="element" type="jQuery">a jQuery wrapped DOM element</field>
	/// <field name="empty" type="Boolean">False indicates this instance wraps a DOM Element.</field>
	/// <field name="syselement" type="String">contains a version number and identifies any instance as being an instance
	/// of SysElement.</field>
	/// <field name="id" type="String">The element's id, the value of the element's id attribute.</field>    
	/// <remarks>If no element is supplied to operate on this object defaults to the document.</remarks>

	if (SysElement._initialized === undefined) {
		// 'privates'
		var _org;
		var _ctx;
		var _hasPlaceholder = 'placeholder' in document.createElement('input');

		// Size / position

		SysElement.prototype.Top = function (val) {
			if (SysElement.IsNothing(val)) {
				// 'Re-introducing' jQuery behaviour: 1.5.x returns null for offset on empty i.s.o. {top:0,left:0;}
				if (this.empty) {
					return 0;
				}
				else {
					return this.element.offset().top;
				}
			}
			else {
				this.element.css("top", typeof val === "string" ? val : val + "px");
			}

		};

		SysElement.prototype.Left = function (val) {
			if (SysElement.IsNothing(val)) {
				if (this.empty) {
					return 0;
				}
				else {
					return this.element.offset().left;
				}
			}
			else {
				this.element.css("left", typeof val === "string" ? val : val + "px");
			}
		};


		SysElement.prototype.Width = function (val) {
			if (SysElement.IsNothing(val)) {
				if (this.empty) {
					return 0;
				}
				else {
					return this.element.width();
				}
			}
			else {
				if (!this.empty) {
					this.element.width(val);
				}
			}
		};

		SysElement.prototype.InnerWidth = function () {
			if (this.empty) {
				return 0;
			}
			else {
				return this.element.innerWidth();
			}
		};

		SysElement.prototype.OuterWidth = function () {
			if (this.empty) {
				return 0;
			}
			else {
				return this.element.outerWidth(false);
			}
		};

		SysElement.prototype.TotalWidth = function () {
			if (this.empty) {
				return 0;
			}
			else {
				return this.element.outerWidth(true);
			}
		};

		SysElement.prototype.Height = function (val) {
			if (SysElement.IsNothing(val)) {
				if (this.empty) {
					return 0;
				}
				else {
					return this.element.height();
				}
			}
			else {
				if (!this.empty) {
					this.element.height(val);
				}
			}
		};

		SysElement.prototype.InnerHeight = function () {
			if (this.empty) {
				return 0;
			}
			else {
				return this.element.innerHeight();
			}
		};

		SysElement.prototype.OuterHeight = function () {
			if (this.empty) {
				return 0;
			}
			else {
				return this.element.outerHeight(false);
			}
		};

		SysElement.prototype.TotalHeight = function () {
			if (this.empty) {
				return 0;
			}
			else {
				return this.element.outerHeight(true);
			}
		};

		// Common attributes

		SysElement.cssHooks = [];
		$.each(["height", "width"], function (i, name) {
			SysElement.cssHooks[name] = {
				get: function (elem) {
					return elem.style[name];
				}
			};
		});
		SysElement.prototype.Css = function (prop, val) {
			var hook = SysElement.cssHooks[prop];
			if (SysElement.IsNothing(val)) {
				if (hook && "get" in hook) {
					return hook.get(this._el);
				}
				else {
					return this.element.css(prop);
				}
			}
			else {
				if (hook && "set" in hook) {
					hook.set(this._el, val);
				}
				else {
					this.element.css(prop, val);
				}
			}
		};

		SysElement.prototype.SetChecked = function (checked) {
			if (checked) {
				this.element.attr("checked", "checked");
			} else {
				this.element.removeAttr("checked");
			}
		};

		SysElement.prototype.SetDisabled = function (disabled) {
			if (disabled) {
				this.element.attr("disabled", "disabled");
			} else {
				// Note: not using removeAttr is intentional
				this.element.attr("disabled", "");
			}
		};

		SysElement.prototype.SetReadonly = function (readonly) {
			if (readonly) {
				this.element.attr("readonly", "readonly");
			} else {
				this.element.removeAttr("readonly");
			}
		};

		SysElement.prototype.SetSelected = function (selected) {
			if (selected) {
				this.element.attr("selected", "selected");
			}
			else {
				this.element.removeAttr("selected");
			}
		};

		SysElement.prototype.SetDisplay = function (display) {
			this.element.css("display", display);
		};

		SysElement.prototype.TabIndex = function (idx) {
			if (SysElement.IsNothing(idx)) {
				return this.element.attr("tabIndex");
			}
			else {
				this.element.attr("tabIndex", idx);
			}
		};

		SysElement.prototype.AddClass = function (className) {
			this.element.addClass(className);
		};

		SysElement.prototype.RemoveClass = function (className) {
			this.element.removeClass(className);
		};

		SysElement.prototype.HasClass = function (className) {
			return this.element.hasClass(className);
		};

		SysElement.prototype.Is = function (selector) {
			return this.element.is(selector);
		};

		SysElement.prototype.IsChecked = function () {
			return this.element.is(":checked");
		};

		SysElement.prototype.IsDisabled = function () {
			return this.element.is(":disabled");
		};

		SysElement.prototype.IsReadonly = function () {
			return this.element.is(":readonly");
		};

		SysElement.prototype.IsSelected = function () {
			return this.element.is(":selected");
		};

		SysElement.prototype.IsVisible = function () {
			if (this.empty) {
				return false;
			}
			else {
				return this.element.is(":visible");
			}
		};

		SysElement.prototype.IsEmpty = function () {
			return SysElement.IsEmpty(this.Value());
		};

		SysElement.prototype.Show = function () {
			this.element.show();
		};

		SysElement.prototype.Hide = function () {
			this.element.hide();
		};

		SysElement.prototype.Focus = function () {
			var el = this.element;
			if (el.is(":radio")) {
				el = $("[name='" + this.element[0].id + "']:checked");
			}
			el.focus();
		};

		SysElement.prototype.Select = function () {
			// Note: is(":input,:text,... did not yield correct results, therefore the filter
			if (this.element.filter(":input").not(":hidden").is(":text,:password,:file")) {
				new SysSelection(this.element).SetSelection();
			}
		};

		SysElement.prototype.SetPlaceholder = function (placeholderText) {
			var me = this,
					text = placeholderText || this.Attribute("placeholder");

			if (_hasPlaceholder) {
				if (SysElement.IsNotEmpty(placeholderText)) {
					this.Attribute("placeholder", placeholderText);
				}
			}
			else {
				// JK: could not get this to work properly on IE8 through 10 in the public.aspx with login.ascx: if you type in anything and then
				// refresh the page both the placeholder and typed text remain visible. Though key event handlers on the onkeydown attribute
				// are handled, the event handlers defined below are not. And on the refresh the value attribute on the dom element returns nothing,
				// ergo no way to determine to hide or show the placeholder.
				if (UserAgent.IsIE()) {
					this.RemoveClass("saveHistory");
				}
				
				this.placeholder = new SysElement($("<label class='Placeholder' for='" + this.id + "'>" + text + "</label>"));
				this.placeholder.AddClass(this.Attribute("class"));
				this.element.before(this.placeholder.element);

				function Toggle() {
					if (SysElement.IsEmpty(me.Value())) {
						me.placeholder.Show();
					}
					else {
						me.placeholder.Hide();
					}
				}

				this.element.change(function () {
					Toggle();
				});
				this.element.keydown(function () {
					Toggle();
				});
				this.element.keyup(function () {
					Toggle();
				});
				this.element.blur(function () {
					Toggle();
				});

				// Set initial state
				Toggle();

			}
		};

		SysElement.prototype.Value = function (value) {
			if (SysElement.IsNothing(value)) {
				var retVal;
				// Get the value
				if (this.element.length > 0) {
					if (this.element.is("input:radio")) {
						var el = this.element[0];
						var name = el.name || el.id;
						retVal = $("input[name='" + name + "']:radio:checked", _ctx.element).val();
					}
					else if (this.element.is("input:checkbox")) {
						retVal = this.IsChecked();
					}
					else if (this.element.is("span")) {
						retVal = this.element.text();
					}
					else if (this.element.is("a")) {
						retVal = this.element.text();
					}
					else {
						retVal = this.element.val();
					}
				}
				else if (typeof _org === "string") {
					retVal = $("input[name='" + _org + "']:radio:checked", _ctx.element).val();
				}
				return retVal;
			}
			else {
				// Set the value
				if (this.element.length > 0) {
					if (this.element.is(":checkbox")) {
						this.SetChecked(value);
					}
					else if (this.element.is(":radio")) {
						this._SetValueRadio(value);
					}
					else if (this.element.is("span")) {
						this.element.text(value);
					}
					else if (this.element.is("a")) {
						this.element.text(value);
					}
					else {
						this.element.val(value);
					}
				}
				else if (typeof _org === "string") {
					this._SetValueRadio(value);
				}
			}
		};

		SysElement.prototype.Text = function (value) {
			if (SysElement.IsNothing(value)) {
				if (this.element.is(":input")) {
					return this.Value();
				}
				else {
					return this.element.text();
				}
			}
			else {
				if (this.element.length > 0) {
					if (this.element.is(":input")) {
						this.Value(value);
					}
					else {
						this.element.text(value);
					}
				}
			}
		};

		SysElement.prototype.Attribute = function (name, value) {
			if (SysElement.IsNothing(value)) {
				// Get the attribute value
				return this.element.attr(name);
			}
			else {
				// Set the attribute value
				this.element.attr(name, value);
			}
		};

		// Event handling

		SysElement.prototype.AttachEvent = function (event_name, func, contentWindow) {
			var evName = event_name;
			if (event_name.startsWith("on")) {
				evName = event_name.substr(2);
			}
			$addHandler2(this._el, evName, func, contentWindow);
		};

		SysElement.prototype.DetachEvent = function (event_name, func) {
			var evName = event_name;
			if (event_name.startsWith("on")) {
				evName = event_name.substr(2);
			}
			$removeHandler(this._el, evName, func);
		};


		// DOM Level 2 Events Specification
		//
		// User Interface event types:
		//      hasFeature("UIEvents", "2.0"), createEvent("UIEvents"):
		//          initUIEvent(<typeArg>, ...): DOMFocusIn, DOMFocusOut, DOMActivate
		// Mouse event types:
		//      hasFeature("MouseEvents", "2.0"), createEvent("MouseEvents"):
		//          initMouseEvent(<typeArg>, ...): click, mousedown, mouseup, mouseover, mousemove, mouseout
		// Key events:
		//      N/A
		// Mutation event types:
		//      hasFeature("MutationEvents", "2.0"), createEvent("MutationEvents"):
		//          initMutationEvent(<typeArg>, ...): DOMSubtreeModified, DOMNodeInserted, DOMNodeRemoved, 
		//          DOMNodeRemovedFromDocument, DOMNodeInsertedIntoDocument, DOMAttrModified, DOMCharacterDataModified
		// HTML event types:
		//      hasFeature("HTMLEvents", "2.0"), createEvent("HTMLEvents"):
		//          initEvent(<typeArg>, ...): load, unload, abort, error, select, change, submit, reset, focus, blur, resize, scroll
		//
		//
		// DOM Level 3 Events Specification -> <createEvent - eventType arg>: <init...Event - typeArg>
		//
		// Note: DOM Level 3 has been published as a Working Draft 21 February 2003, a 'Working Group Note' 07 November
		// 2003,  and as a 'Working draft' in December 2007
		//
		// 
		// User Interface event types:
		//      hasFeature("UIEvents", "3.0"), createEvent("UIEvent"):
		//          initUIEventNSDOMFocusIn, DOMFocusOut, DOMActivate, focus, blur
		// Text events types (applies only to characters and is designed for use with any text input devices, not just keyboards):
		//      hasFeature("TextEvents", "3.0"), createEvent("TextEvent"):
		//          initTextEventNStextInput
		// Keyboard event types:
		//      hasFeature("KeyboardEvents", "3.0"), createEvent("KeyboardEvent"):
		//          initKeyboardEventNS(<typeArg>, ...): keydowm, keyup
		// Mouse event types:
		//      hasFeature("MouseEvents", "3.0"), createEvent("MouseEvent"):
		//          initMouseEventNS(<typeArg>, ...): click, dblclick, mousedown, mouseup, mouseover, mousemove, mouseout
		// Mouse multi wheel event types:
		//      hasFeature("MouseMultiWheelEvents", "3.0"), createEvent("MouseMultiWheelEvent"):
		//          initMouseMultiWheelEventNSmousemultiwheel
		// Mouse wheel event types:
		//      hasFeature("MouseWheelEvents", "3.0 "), createEvent("MouseWheelEvent") :
		//          initMouseWheelEventNSmousewheel
		// Mutation event types:
		//      hasFeature("MutationEvents", "3.0"), createEvent("MutationEvent"):
		//          initMutationEventNS(<typeArg>, ...): DOMSubtreeModified, DOMNodeInserted, DOMNodeRemoved,
		//          DOMNodeRemovedFromDocument, DOMNodeInsertedIntoDocument, DOMAttrModified, DOMCharacterDataModified
		// Mutation name event types:
		//      hasFeature("MutationNameEvents", "3.0"), createEvent("MutationNameEvent"):
		//          initMutationNameEventNS(<typeArg>, ...): DOMElementNameChanged, DOMAttributeNameChanged
		// Basic event types:
		//      hasFeature("BasicEvents", "3.0"), createEvent("BasicEvent"):
		//          initEventNS(<typeArg>, ...): load, unload, abort, error, select, change, submit, reset, resize, scroll

		// Note: the click on an <a> does not work.
		SysElement.prototype.FireEvent = function (eventName) {

			var evName = eventName;
			var evtObj;

			if (document.createEvent) {
				// initMutationEvent

				if (evName.startsWith("on") === true) {
					evName = evName.substr(2);
				}

				switch (evName) {
					case "dblclick":
						// Note: not in the lvl 2 standard, but in lvl 3
					case "click":
					case "mousedown":
					case "mouseup":
					case "mouseover":
					case "mousemove":
					case "mouseout":
						evtObj = document.createEvent("MouseEvents");
						// type, canBubble, cancelable, view, detail, screenX, screenY, clientX, clientY, ctrlKey, 
						// altKey, shiftKey, metaKey, button, relatedTarget);           
						evtObj.initMouseEvent(evName, true, true, this._el.ownerDocument.defaultView,
								0, 0, 0, 0, 0, false, false, false, false, 0, null);
						break;
					case "load":
					case "unload":
					case "abort":
					case "error":
					case "select":
					case "change":
					case "submit":
					case "reset":
					case "focus":
					case "blur":
					case "resize":
					case "scroll":
						evtObj = document.createEvent("HTMLEvents");

						// type, canBubble, cancelable
						evtObj.initEvent(evName, true, true);
						break;
					default:
						throw new Error("Unsupported event: " + eventName);
				}
				this._el.dispatchEvent(evtObj);
			} else if (document.createEventObject) {

				if (evName.startsWith("on") === false) {
					evName = "on" + evName;
				}

				evtObj = document.createEventObject();
				this._el.fireEvent(evName, evtObj);
			}

		};

		SysElement.prototype.HandleAccessKey = function (e) {
			var ret = this.element.click();
			if (SysElement.IsJQuery(ret)) {
				if (ret.length > 0) {
					SysCancelBubble(e);
					return false;
				}
				else {
					return true;
				}
			}
			return ret;
		};

		// DOM Manipulation / traversal

		SysElement.prototype.Parent = function (selector) {
			var prnt;
			if (SysElement.IsNothing(selector)) {
				prnt = this.element.parent();
			}
			else {
				prnt = this.element.closest(selector);
			}
			return new SysElement(prnt);
		};

		SysElement.prototype.Siblings = function (selector) {
			return new SysElement(this.element.siblings(selector));
		};

		SysElement.prototype.Find = function (selector) {
			return new SysElement(this.element.find(selector));
		};

		SysElement.prototype.GetDomElement = function () {
			return this._el;
		};

		SysElement.prototype.Remove = function () {
			if (!this.empty) {
				if (IE_LEGACY) {
					var hist = $(".saveHistory", this.element);
					hist.removeClass("saveHistory");
					this.element.remove();
					hist.addClass("saveHistory");
				}
				else {
					this.element.remove();
				}
			}
		};

		SysElement.prototype.PostFix = function (id) {
			return new SysElement(this.id + id);
		};

		// Local interface
		SysElement.prototype.Init = function (el, domain) {
			if (SysElement.IsNotNothing(el)) {
				var dom = domain;

				if (dom instanceof SysElement) {
					dom = dom.element;
				}

				// originally supplied element (indicator)
				_org = el;
				// originally supplied context
				_ctx = (domain || document);

				if (el instanceof SysElement) {
					this.element = el.element;
				}
				else if (el instanceof SysHandleEvent) {
					this.element = $(el.target);
				}
				else if (el instanceof jQuery) {
					this.element = el;
				}
				else if (typeof el === "string") {
					if (el.startsWith(".") || el.startsWith(":")) {
						this.element = $(el, dom);
					}
					else {
						// ID and NAME tokens must begin with a letter ([A-Za-z]) and may be followed by any number of
						// letters, digits ([0-9]), hyphens ("-"), underscores ("_"), colons (":"), and periods (".").
						// For jQuery the colons and periods have to be escaped.
						this.element = $((el.startsWith("#") ? "" : "#") + el.replace(/(\.|:)/g, '\\$1'), dom);
					}
				}
				else if (SysElement.IsNotNothing(el)) {
					this.element = $(el, dom);
				}

				if (SysElement.IsNotNothing(this.element) && this.element.length > 0) {
					this._el = this.element[0];
					this.id = this._el.id;
					this.empty = false;
				}
			}
		};

		SysElement.prototype._SetValueRadio = function (value) {
			var els = $(String.format("input[name='{0}']:radio", _org));
			els.each(function (i) {
				var cur = new SysElement(this);
				if (cur.element.val() === value.toString()) {
					cur.SetChecked(true);
					return false;
				}
				else {
					return true;
				}
			});
			if (els.length > 0) {
				// we want to keep the value of _org which has been modified in the above loop
				_org = els[0].name;
			}
		};

		SysElement._initialized = true;
	};

	if (SysElement.IsNotNothing(el)) {
		this.Init(el, domain);
	}
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Provides an interface to work with events.

// Interface
SysHandleEvent.prototype = {
	event: null,
	syshandleevent: "1.0.0",
	target: null,

	element: null,

	IsEventStopped: function() {
		/// <summary>Indicates if any further processing should take place. Where StopPropagation influences the
		/// flow of events from handler to handler, this could be used within functions within the same
		/// handler.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	StopEvent: function() {
		/// <summary>Where StopPropagation stops the event flow AFTER all listeners on the current target have
		/// been called, StopEvent is used to indicate that no further processing of the event should take place.
		/// This should be checked using the IsEventStopped interface.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	StopPropagation: function() {
		/// <summary>The stopPropagation method is used prevent further propagation of an event during event flow. 
		/// If this method is called by any EventListener the event will cease propagating through the tree. 
		/// The event will complete dispatch to all listeners on the current EventTarget before event flow stops
		/// (DOM level 2 definition).</summary>
		/// <returns type="undefined">undefined</returns>
	},
	PreventDefault: function(txt) {
		/// <summary>Signifies that the event is to be canceled, meaning any default action normally taken by the 
		/// implementation as a result of the event will not occur (DOM level 2 definition). Optionally it sets
		/// a text that can be displayed. (such as 'Your changes will not be saved.')</summary>
		/// <param name="txt" type="String" optional="true">Sets the event's 'returnValue'</param>
		/// <returns type="undefined">undefined</returns>
	},
	StopAll: function() {
		/// <summary>Stop any further processing of the event.</summary>
		/// <returns type="undefined">undefined</returns>
	}
};

// Mimic enumerators

// Mimic statics

// Constructor
function SysHandleEvent(ev) {
	/// <summary>Under construction: handle/manage events</summary>
	/// <param name="ev" type="Event"></param>
	/// <field name="event" type="Event">The Event object currently being worked on.</field>
	/// <field name="syshandleevent" type="String">contains the version number of this instance of SysHandleEvent 
	/// and identifies the object as being a SysHandleEvent.</field>
	/// <field name="target" type="EventTarget">Used to indicate the EventTarget to which the event was originally
	/// dispatched. On demand we may want to extend the interface to support currentTarget as well.</field>

	if (SysHandleEvent._initialized === undefined) {

		SysHandleEvent.prototype.IsEventStopped = function () {
			return (this.event.rawEvent || this.event).stopEvent === true;
		};

		SysHandleEvent.prototype.StopPropagation = function () {
			// This is the interface defined by the standard, but not supported by IE.
			if (this.event.stopPropagation) {
				this.event.stopPropagation();
			}
			// This is the interface used by IE, Safari and FF have adopted as a flag to indicate if propagation
			// has been stopped. BUT, Safari does not immediately toggle it upon a stopPropagation. Therefore we set 
			// it manually for all browsers. 
			this.event.cancelBubble = true;
		};

		SysHandleEvent.prototype.PreventDefault = function (txt) {
			var hasTxt = typeof txt === "string" && txt.length > 0;

			if (this.event.preventDefault) {
				this.event.preventDefault();
				if (hasTxt && this.event.rawEvent) {
					this.event.rawEvent.returnValue = txt;
				}
			} else {
				if (hasTxt) {
					this.event.returnValue = txt;
				}
				else {
					this.event.returnValue = false;
				}
			}
		};

		SysHandleEvent.prototype.StopEvent = function () {
			(this.event.rawEvent || this.event).stopEvent = true;
		};

		SysHandleEvent.prototype.StopAll = function () {
			this.StopPropagation();
			this.PreventDefault();
			this.StopEvent();
		};

		// Local interface
		SysHandleEvent.prototype._Init = function (ev) {
			this.event = ev;

			if (this.event.target) {
				this.target = this.event.target;
			}
			else {
				this.target = this.event.srcElement;
			}

			this.element = new SysElement(this.target);
		};

		SysHandleEvent._initialized = true;
	};

	this._Init(ev);
}

// Legacy
function SysSrcElement(e) {
	/// <summary>Obsolete, use the SysHandleEvent object</summary>
	return new SysHandleEvent(e).target;
 }

function SysEvent(e) {
	/// <summary>Obsolete, use the SysHandleEvent object</summary>
	if (e && !e.rawEvent) return new Sys.UI.DomEvent(e);
	else return e;
}

function SysIsCancelBubble(e) {
	/// <summary>Obsolete, use the SysHandleEvent object</summary>
	return e.cancelBubble;
}

function SysStopPropagation(e) {
	/// <summary>Obsolete, use the SysHandleEvent object</summary>
	new SysHandleEvent(e).StopPropagation();
}

function SysPreventDefault(e, txt) {
	/// <summary>Obsolete, use the SysHandleEvent object</summary>
	new SysHandleEvent(e).PreventDefault(txt);
}

function SysCancelBubble(e) {
	/// <summary>Obsolete, use the SysHandleEvent object</summary>
	new SysHandleEvent(e).StopAll();
}

function SysDetachEvent(element, event_name, func) {
	/// <summary>Obsolete, use SysElement.DetachEvent.Detach an event handler, which was previously attached with 
	/// SysAttachEvent.</summary>
	/// <param name="element" type="DOMElement"></param>
	/// <param name="event_name" type="String">Event type with/without the IE 'on' prefix.</param>
	/// <param name="func" type="Function">The handler that should no longer be called when the event fires.</param>
	/// <returns type="undefined">undefined</returns>

	var el = new SysElement(element);
	el.DetachEvent(event_name, func);
}

function SysAttachEvent(element, event_name, func, contentWindow) {
	/// <summary>Obsolete, use SysElement.AttachEvent. Attach an event handler to an element.</summary>
	/// <param name="element" type="DOMElement" domElement="true"></param>
	/// <param name="event_name" type="String">Event type with/without the IE 'on' prefix.</param>
	/// <param name="func" type="Function">The handler that will be called when the event fires.</param>
	/// <param name="contentWindow" type="Window" optional="true">Supply the element's parent window, especially when 
	/// attaching events that are located inside a frame / outside the current window object.</param>
	/// <returns type="undefined">undefined</returns>

	var el = new SysElement(element);
	el.AttachEvent(event_name, func, contentWindow);
}

var $addHandler2 = Sys.UI.DomEvent.addHandler2 =
function Sys$UI$DomEvent$addHandler(element, eventName, handler, contentWindow) {
	/// <summary>Version 2 of the $addHandler, which fixes the ASP.NET AJAX BUG: $addHandler Can't Attach to Element Inside 
	/// an IFrame in Internet Explorer.</summary>
	/// <param name="element" domElement="true" type="DOMElement"></param>
	/// <param name="eventName" type="String">The DOM compliant event name (i.e. without the IE prefix).</param>
	/// <param name="handler" type="Function"></param>
	/// <returns type="undefined">undefined</returns>
	var e = Function._validateParams(arguments, [
	   { name: "element", domElement: true },
	   { name: "eventName", type: String },
	   { name: "handler", type: Function },
	   { name: "contentWindow", type: Object, optional: true, mayBeNull: true }
   ]);
	if (e) throw e;

	if (!element._events) {
		element._events = {};
	}
	var eventCache = element._events[eventName];
	if (!eventCache) {
		element._events[eventName] = eventCache = [];
	}
	var browserHandler;
	if (element.addEventListener) {
		browserHandler = function(e) {
			return handler.call(element, new Sys.UI.DomEvent(e));
		}
		element.addEventListener(eventName, browserHandler, false);
	}
	else if (element.attachEvent) {
		browserHandler = function() {
			var w = (contentWindow == null) ? window : contentWindow;
			return handler.call(element, new Sys.UI.DomEvent(w.event));
		}
		element.attachEvent('on' + eventName, browserHandler);
	}
	eventCache[eventCache.length] = { handler: handler, browserHandler: browserHandler };
}
;/* js for only collapsable filters */
(function () {
	var _resizeListViews = function () {
		if (typeof (SysListView) == "function" && SysListView.DoResize) {
			for (var i = 0, j = SysListView.DoResize.length; i < j; i++) {
				SysListView.DoResize[i]();
			}
		}
	}

	var FilterCollapse = function (options) {
		var _this = this;
		this.collapsed = options.collapsed || false;

		var id = options.element;

		this._filterSection = $('#' + id);
		this._filterSectionCollapse = $('#' + id + '_FilterSectionCollapse');
		this._filterCollapseArrow = $('#' + id + '_FilterCollapse .FilterCollapseArrow');
		this._filterCollapseBar = $('#' + id + '_FilterCollapse');
		this._filterCollapseNoFilters = $('#' + id + '_FilterSectionNoFilters');

		this._filterCollapseBar.hover(
			function () { _this._filterCollapseBar.addClass('Hover') },
			function () { _this._filterCollapseBar.removeClass('Hover') }
		);

		this._filterCollapseNoFilters.hover(
			function () { _this._filterCollapseBar.addClass('Hover') },
			function () { _this._filterCollapseBar.removeClass('Hover') }
		);

		this._settingElement = options.settingElement;
		this._settingAlias = options.settingAlias;
	}

	FilterCollapse.prototype.collapse = function () {
		var _this = this;
		this._filterSection.addClass('Hidden');
		this._filterCollapseArrow.addClass('Closed');
		this._filterCollapseBar.removeClass('Hover')

		var collapsedFilters = getCollapsedFilters(this._filterSection);
		if (collapsedFilters.length) {
			this._filterSectionCollapse.empty();
			$.each(collapsedFilters, function () {
				_this._filterSectionCollapse.append(this);
			});

			this._filterSectionCollapse.removeClass('Hidden');
			this._filterCollapseNoFilters.addClass('Hidden');
		} else {
			this._filterSectionCollapse.addClass('Hidden');
			this._filterCollapseNoFilters.removeClass('Hidden');
		}
		
		this.collapsed = true;
		_resizeListViews();
		this.saveSetting();
	};

	FilterCollapse.prototype.expand = function () {
		this._filterSection.removeClass('Hidden');
		this._filterCollapseNoFilters.addClass('Hidden');
		this._filterSectionCollapse.addClass('Hidden');
		this._filterCollapseArrow.removeClass('Closed');
		this._filterCollapseBar.removeClass('Hover')

		this.collapsed = false;
		_resizeListViews();
		this.saveSetting();
	};

	FilterCollapse.prototype.toggle = function () {
		if (this.collapsed) {
			this.expand();
		} else {
			this.collapse();
		}
	};

	FilterCollapse.prototype.saveSetting = function () {
		var url = new SysUrlBuilder('SysCallback.aspx');
		url.Add('Action', 11);
		url.Add('SettingName', 24);
		url.Add('SettingAlias', this._settingAlias);
		url.Add('SettingValue', this.collapsed);

		SysSet(this._settingElement, this.collapsed);
		$.get(url.ToString());
	}

	function getCollapsedFilters(filterSection) {

		var filters = filterSection.find("[id$='_f']"); // filters id are with suffix "_f"
		var prevFilterBlockName = "";

		var collapsedFilters = filters.map(function () {
			var filterContainer = $(this);
			var filterType = filterContainer.attr("data-controltype");
			var selectedFilters = filterContainer.find('[data-displayableval="true"]');
			
			var lastIndex = selectedFilters.length -1;
			var collapsedSelectedFilterOptions = selectedFilters.map(function (index) {
				var $this = $(this);
				
				var text = $.trim(getControlText($this, filterContainer));
				if (text) {
					// Id of filter in "filter section" is same as id of filter in header after collapse with suffix "_c"
					var id = this.id || this.htmlFor;
					var removeButton = $("<button>").click(function () {
						new Function($this.attr('data-onclearvalue'))();
						
						SysSubmit();
					});

					if (id) {
						removeButton.attr('id', id + '_clearBtn');
					}
					var collapsedOption = $('<div>');

					var bShowClearFilterButton = true;
					bShowClearFilterButton = showClearFilterButton($this);

					if (id) {
						collapsedOption.attr('id', id + '_c');
					}

					if (index === lastIndex) {
						collapsedOption.addClass('CollapseFilterGroupLastDiv');
					}
						
					collapsedOption.text(text)
					if (bShowClearFilterButton) {
						collapsedOption.append(removeButton);
					}

					return collapsedOption;
				}
			});

			
			// If some filters are selected then add a filter group Text
			if (collapsedSelectedFilterOptions.length) {

				var collapsedFilter = $('<div>').addClass('CollapseFilterGroup');

				if (this.id) {
					var filterLabel = $('<span>').text($('#' + this.id.replace('_f', '_lb') + ' label').text());
					collapsedFilter.append(filterLabel);
				}

				$.each(collapsedSelectedFilterOptions, function () {
					collapsedFilter.append(this);
				});
				
				var formatedFilterHTML = formatSelecetdFilterHTML(filterType, collapsedFilter);

				//Add filter bLock, if current filterBlock is different from prevFilterBlock
				var filterBlock = filterContainer.parent().prevAll(".SectionHeader:first");
				if (filterBlock.length > 0 && filterBlock.text() != prevFilterBlockName) {
					prevFilterBlockName = filterBlock.text();
					var collapsedFilterBlock = $("<div>")
											.addClass('CollapseFilterBlock')
											.text(filterBlock.text());

					formatedFilterHTML = collapsedFilterBlock.add(formatedFilterHTML);					
				}


				return formatedFilterHTML;
			}
		}); 

		return collapsedFilters;
	}
// format selected filter HTML based on the filter Type
function formatSelecetdFilterHTML(filterType, filterHtml) {

	switch (filterType) {
		case 'InputRange':
		case 'DateRange':
		case 'DateRange2':
		case 'ComboBoxRange':
		case 'WeekRange':
			var from = filterHtml.find("[id$=_From_c]");
			var to = filterHtml.find("[id$=_To_c]");
			if (!from.length && to.length) {
				to.before("<div> .. - </div>");
			}
			else if (!to.length && from.length) {
				from.after("<div> - .. </div>");
			}
			else if (to.length && from.length) {
				from.after( "<div> - </div>");
			}

			if (filterType == 'WeekRange') {
				var selectionWeek = filterHtml.find("[id$=SelectionWeek_c]");
				selectionWeek.text('(' + selectionWeek.text() + ')');
			}

		break;
	}

	return filterHtml;
}

function showClearFilterButton(control) {
	
	var tagName = control.get(0).tagName;

	//if clear script is not present don't show the clear filter button
	if (!control.is('[data-onclearvalue]')) {
		return false;
	}

	switch (tagName) {
		case 'SELECT':
			// if no empty option is available then don't show the clear filter button
			var bEmptyTextVailable = false;
			control.find("option").each(function () {
				if ($.trim($(this).text()) == '') {
					bEmptyTextVailable = true;
				}
			});
			return bEmptyTextVailable;
			break;
		default:
			return true;
			break;
	}

	return true;
}
	function getControlText(control, controlContainer) {
		var tagName = control.get(0).tagName;
		var regExDate = new RegExp('^\\s{2,4}' + sysFormatDateSep + '\\s{2,4}' + sysFormatDateSep + '\\s{2,4}$');
		
		switch (tagName) {
			case 'LABEL':
				return control.text();
				break;
			case 'SELECT':
				return control.find(":selected").text();
				break;
			case 'A':
				return control.text();
				break;
			case 'SPAN':
				return control.text();
				break;
			case 'INPUT':
				// for checkbox and radio buttons get label's text associated to checkbox/radio ID
				var text = ""
				if ((control.attr("type") == "checkbox" || control.attr("type") == "radio") && control.is('[id]')) {
					var associatedLabel = controlContainer.find("label[for='" + control.attr('id') + "']")[0];

					if ($(associatedLabel).length == 0) {
						associatedLabel = $("label[for='" + control.attr('id') + "']")[0];
					}

					text = $(associatedLabel).text();

					if ($.trim(text) == "") {
						return controlContainer.text();
					}
					else {
						return text;	
					}
				}
				// remove html tags if appear in text and remove empty date text field text "  -  -    "
				return control.val().replace(regExDate, "");
				break;
			default:
				return "";
				break;
		}
	}
	
	
	window.FilterCollapse = FilterCollapse;

}());


function clearDropDown(controlID) {
	$("#" + controlID + " option").each(function () {
		if ($.trim($(this).text()) == '') {
			$(this).attr("selected", "selected")
		}
	});
}

function radioButtonToggleDisplayVal(id,name) {
	//set displayable attribute to "false" for all labels associated to radiobutton with name = "[name]"
	$('[name = "' + name + '"]').each(function () {
		var radioButtonId = $(this).attr("id");
		$('label[for="' + radioButtonId + '"]').attr('data-displayableval', 'false');
	});
	//set displayable attribute to "true" for only the selected radiobutton, passed as parameter "id"
	$('label[for="'+ id +'"]').attr('data-displayableval', $('#'+ id).is(':checked'));
};/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="SysEvents.js" />

/// <summary>
///     Keycode identification and handling routines, such as enter, tab, ...
/// </summary>

// Interface
SysHandleKey.prototype = {
	event: null,
	syshandlekey: "1.0.0",

	GetKey: function() {
		/// <summary>Returns the keycode of the pressed key.</summary>
		/// <remarks>To call this should not be necessary, key handling funcitonality should be provided through
		/// individual interfaces.</remarks>
	},
	HandleEnter: function(force) {
		/// <summary>If the pressed key was the enter key it is handled as though it was a tab.</summary>
		/// <param name="force" type="Boolean" optional="true"></param>
		/// <returns>true, if the pressed key was an enter key and it has been handled, otherwise false</returns>
	},
	IsEscapeKey: function() {
		/// <summary>Returns true if the pressed key was the escape key (and escape only).</summary>
	},
	IsEnterKey: function() {
		/// <summary>Returns true if the pressed key was the Enter key (and Enter only).</summary>
	},
	IsInsertKey: function() {
		/// <summary>Returns true if the pressed key was the Insert key (and Insert only).</summary>
	},
	IsLeftKey: function() {
		/// <summary>Returns true if the pressed key was the Left key (and Left only).</summary>
	},
	IsRightKey: function() {
		/// <summary>Returns true if the pressed key was the Right key (and Right only).</summary>
	},
	IsUpKey: function() {
		/// <summary>Returns true if the pressed key was the Up key (and Up only).</summary>
	},
	IsDownKey: function() {
		/// <summary>Returns true if the pressed key was the Down key (and Down only).</summary>
	},
	IsHomeKey: function() {
		/// <summary>Returns true if the pressed key was the Home key (and Home only).</summary>
	},
	IsEndKey: function() {
		/// <summary>Returns true if the pressed key was the End key (and End only).</summary>
	},
	IsPageUpKey: function() {
		/// <summary>Returns true if the pressed key was the Page Up key (and Page Up only).</summary>
	},
	IsPageDownKey: function() {
		/// <summary>Returns true if the pressed key was the Page Down key (and Page Down only).</summary>
	},
	IsF1Key: function() {
		/// <summary>Returns true if the pressed key was the F1 key (and F1 only).</summary>
	},
	IsF2Key: function() {
		/// <summary>Returns true if the pressed key was the F2 key (and F2 only).</summary>
	},
	IsTabKey: function() {
		/// <summary>Returns true if the pressed key was the tab key (and tab only).</summary>
	},
	IsBackspaceKey: function() {
		/// <summary>Returns true if the pressed key was the backspace key (and backspace only)</summary>
	},
	IsSingleKey: function(key) {
		/// <summary>Returns if a single key was pressed without any of the control keys.</summary>
		/// <param name="key" type="SysHandleKey.Key" optional="true"></param>
		/// <returns type="boolean">if a single key was pressed.</returns>
	},
	IsAltKey: function() {
		/// <summary>Returns if any of the alt keys was pressed. If the key being handled is the Alt key itself it 
		/// will return false.</summary>
		/// <returns type="Boolean"></returns>
	},
	IsCtrlKey: function() {
		/// <summary>Returns if any of the Ctrl keys was pressed. If the key being handled is the Ctrl key itself it
		/// will return false.</summary>
		/// <returns type="Boolean"></returns>
	},
	IsShiftKey: function() {
		/// <summary>Returns if any of the shift keys was pressed. If the key being handled is the Shift key itself it
		/// will return false.</summary>
		/// <returns type="Boolean"></returns>
	},
	IsDigitKey: function() {
		/// <summary>Returns true if any of the digit keys was pressed, either with the normal keys or with the numerical keyboad keys.
		/// Otherwise will return false.</summary>
		/// <returns type="Boolean"></returns>
	},
	DigitKey: function() {
		/// <summary>Returns the pressed digit, as an int, if any of the digit keys was pressed, either with the normal keys or with the numerical keyboad keys.
		/// Otherwise will return null</summary>
		/// <returns type="Int?"></returns>
	}
};

SysHandleKey.Key = {
	/// <summary>'Enumerator' containing keycodes</summary>
	backspace: 8,
	tab: 9,
	enter: 13,
	shift: 16,
	ctrl: 17,
	alt: 18,
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
	ins: 45,
	// Note: keycode 46 will be changed into 127 by Sys.UI.DomEvent
	// del: 46,
	key_0: 48,
	key_9: 57,
	numeric_0: 96,
	numeric_9: 105,
	dot: 110,
	F1: 112,
	F2: 113,
	del: 127,
	numlock: 144,
	fslash: 191
};

// Constructor
function SysHandleKey(ev) {
	/// <summary>Provides an interface to identify pressed keys.</summary>
	/// <param name="ev" type="Object">user agent specific or DOMEvent event object</param>
	/// <field name="event" type="Sys.UI.DomEvent"></field>
	/// <field name="syshandlekey" type="String">contains a version number and identifies any instance as being an instance of
	/// SysHandleKey.</field>

	if (SysHandleKey._initialized === undefined) {

		SysHandleKey.prototype.HandleEnter = function(force) {

			if (force || this.IsEnterKey()) {
				SysCancelInputSearch();
				if (IE && !(UserAgent.IsIE() && UserAgent.majorVersion >= 9)) {
					SysSetKey(ev, 9);
				}
				else {
					SysCancelBubble(this.event);
					SysFocusNext(SysSrcElement(this.event));
				}
				return true;
			}
			else {
				return false;
			}
		};

		SysHandleKey.prototype.IsEscapeKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.esc);
		};

		SysHandleKey.prototype.IsEnterKey = function() {
			return this.IsSingleKey(Sys.UI.Key.enter);
		};

		SysHandleKey.prototype.IsInsertKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.ins);
		};

		SysHandleKey.prototype.IsLeftKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.left);
		};

		SysHandleKey.prototype.IsRightKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.right);
		};

		SysHandleKey.prototype.IsUpKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.up);
		};

		SysHandleKey.prototype.IsDownKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.down);
		};

		SysHandleKey.prototype.IsHomeKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.home);
		};

		SysHandleKey.prototype.IsEndKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.end);
		};

		SysHandleKey.prototype.IsPageUpKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.pageUp);
		};
		SysHandleKey.prototype.IsPageDownKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.pageDown);
		};
		
		SysHandleKey.prototype.IsF1Key = function() {
			return this.IsSingleKey(SysHandleKey.Key.F1);
		};

		SysHandleKey.prototype.IsF2Key = function() {
			return this.IsSingleKey(SysHandleKey.Key.F2);
		};

		SysHandleKey.prototype.IsTabKey = function() {
			return this.IsSingleKey(SysHandleKey.Key.tab);
		};

		SysHandleKey.prototype.IsBackspaceKey = function () {
			return this.IsSingleKey(SysHandleKey.Key.backspace);
		};

		SysHandleKey.prototype.IsSingleKey = function(key) {
			var isSingle = !(this.IsAltKey() || this.IsShiftKey() || this.IsCtrlKey());
			if (isSingle && key) {
				isSingle = this.GetKey() === key;
			}
			return isSingle;
		};

		SysHandleKey.prototype.IsAltKey = function() {
			return this.event.altKey;
		};

		SysHandleKey.prototype.IsCtrlKey = function() {
			return this.event.ctrlKey;
		};

		SysHandleKey.prototype.IsShiftKey = function () {
			return this.event.shiftKey;
		};

		SysHandleKey.prototype.IsDigitKey = function () {
			var key = this.GetKey();
			return (key >= SysHandleKey.Key.key_0 && key <= SysHandleKey.Key.key_9) || (key >= SysHandleKey.Key.numeric_0 && key <= SysHandleKey.Key.numeric_9);
		};

		SysHandleKey.prototype.DigitKey = function () {
			if (this.IsDigitKey()) {
				var key = this.GetKey();
				if (key <= SysHandleKey.Key.key_9) {
					return key - SysHandleKey.Key.key_0;
				}
				else {
					return key - SysHandleKey.Key.numeric_0;
				}
			}
			return null;
		}

		SysHandleKey.prototype.GetKey = function() {
			if (this.event.type == "keypress") {
				return this.event.charCode;
			} else if (this.event.type == "keyup" || this.event.type == "keydown") {
				return this.event.keyCode;
			} else {
				// Should not occur.
				return this.event.keyCode;
			}
		}

		SysHandleKey.prototype._Init = function (ev) {
			if (ev === undefined) {
				throw new Error("You must supply an event to operate on");
			}
			if (ev instanceof SysHandleEvent) {
				this.event = ev.event;
			}
			else {
				this.event = SysEvent(ev);
			}

		}

		SysHandleKey._initialized = true;
	}

	this._Init(ev);
}

function SysProcessKey(e) {
	/// <summary>Determines if a pressed key should be handled (it filters out control keys 'accidentally' passed on).</summary>
	/// <returns type="boolean">True if a pressed key should be handled.
	/// <remarks>FF sends control keys (a.o. arrow keys) through to the keypress unlike other browsers.</remarks>
	/// False if a pressed key should not be handled </returns>

	var ev = e;
	if (e.rawEvent) {
		ev = e.rawEvent;
	}

	// Esc falls through in IE also (not Safari), so no use checking for browser. It just should not be processed.
	if (ev.type === "keypress" && ev.keyCode === SysHandleKey.Key.esc) {
		return false;
	}
	
	if (Sys.Browser.agent === Sys.Browser.Firefox) {
		if (ev.type === "keypress" &&
			(ev.keyCode > 0 ||
			 ev.ctrlKey ||
			 ev.altKey)
			) {
			return false;
		}
	}

	return true;
}

// Legacy key handling routines
function SysKeyDown(e) {
	new SysHandleKey(e).HandleEnter();
}

function SysInputKeyDown(e, enterIsTab) {
	var handlekey = new SysHandleKey(e);
	if (handlekey.IsTabKey()) {
		SysCancelInputSearch();
	}
	else if (enterIsTab) {
		handlekey.HandleEnter();
	}
}

function SysGetKey(e) {
	/// <summary>obsolete: use <see cref="SysHandleKey.GetKey"/></summary>
	return new SysHandleKey(e).GetKey();
}
function SysSetKey(e, key) {
	/// <summary>obsolete: setting keys is considered a security risc. For non-IE user agents it is
	/// mimic'd by raising a keydown event. It is however not the preferred way.
	/// <summary>
	if (document.implementation.hasFeature("Events", "2.0") && !(UserAgent.IsIE() && UserAgent.majorVersion >= 10)) {
		e.stopPropagation();

		var evt = document.createEvent("KeyboardEvent");
		evt.initKeyEvent("keydown", true, true, null, false, false, false, false, key, 0);
		var el = SysSrcElement(e);
		el.dispatchEvent(evt);
	}
	else {
		e.keyCode = key;
	}
}
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="SysElement.js" />
/// <reference path="DialogWrapper.js" />
/// <reference path="SysWindow.js" />
/// <reference path="SysEvents.js" />
/// <reference path="SysHandleKey.js" />

// Public interface

(function () {
	var SysBrowser = (function () {
		SysBrowserDef.prototype = {

			sysbrowserversion: "1.0.0.0",
			id: null,

			browser: null,
			input: null,
			button: null,
			reference: null,

			multiSelect: false,
			params: null,
			refUrl: null,
			altKey: null,
			keyInRef: null,
			onChangeScript: null,
			extraResults: null,
			multiBrowser: false,
			browsingDisabled: false,
			
			//Testrunner settings
			isInTest: false,
			testValue: null,

			SetReadOnly: function (readOnly) {
				/// <summary>Sets the control in a read-only mode (i.e. related elements are set to readonly and/or disabled.
				/// </summary>
				/// <param name="readOnly" type="Boolean"></param>
				/// <returns type="undefined">undefined</returns>
			},

			Clear: function () {
				/// <summary>Clears all browser input values.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			ClearBrowser: function () {
				/// <summary>Clear specifically only the browser element. Usually Clear should be called.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			ClearInput: function () {
				/// <summary>Clear specifically only the input element. Usually Clear should be called.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			ClearReference: function () {
				/// <summary>Clear specifically only the reference element. Usually Clear should be called.</summary>
				/// <returns type="undefined">undefined</returns>
			},

			GetValue: function () {
				/// <summary>Returns the value associated to the current selection.</summary>
				/// <returns type="String">This will in most cases be the guid associated with the selection.</returns>
			},
			SetValue: function (value, doOnChange) {
				/// <summary>Sets the value of the current browser and optionally executes the OnChange event.
				///	If doOnChange is not supplied, the default value is True.
				///	</summary>
				/// <param name="value" type="String"></param>
				/// <param name="doOnchange" type="Boolean"></param>
				/// <returns type="undefined">undefined</returns>
			},
			Show: function () {
				/// <summary>Displays the current browser.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			Hide: function () {
				/// <summary>Hides the current browser.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			Browse: function (handler) {
				/// <summary>Open the browser dialog for multi/single select browsing.</summary>
				/// <param name="handler" type="Function" optional="true">Optionally supply handler function to do additional 
				/// processing upon return from the dialog.</param>
				/// <returns type="undefined">undefined</returns>
			}
		};

		// Mimic public enumerators

		// Mimic statics

		SysBrowserDef._BrowseDataHandler = function (browserCtrl, retValue) {
			/// <summary>Internal: not intended to be used directly.
			/// Callback function to process the results once the browser dialog is closed.</summary>
			/// <param name="browserCtrl" type="SysBrowser">The SysBrowser instance.</param>
			/// <param name="retValue" type="Any">The return value to be processed.</param>
			/// <returns type="undefined">undefined</returns>
			if (retValue != null) {
				var er;
				var erCount = 0;
				if (browserCtrl.extraResults != null) {
					er = browserCtrl.extraResults.split('@');
					erCount = er[1];
					er = er[0].split(',');
				}
				if (typeof (retValue) != 'object' && retValue == "") {
					browserCtrl.Clear();
					if (er) {
						for (i = 0; i < er.length; i++) {
							var erc1 = er[i].split(';');
							SysSet(erc1[0], '');
							SysSet(erc1[0] + '_alt', '');
						}
					}
				}
				else {
					var c;
					var r = '';
					if (typeof (retValue) != 'object') { retValue = Array(retValue) };

					if (retValue[0] == 'multi' || retValue[0] == 'query' || retValue[0] == 'isnull') {
						browserCtrl.browser.Value(retValue[1]);
						browserCtrl.ClearInput();
						if (!browserCtrl.reference.empty) {
							browserCtrl.reference.GetDomElement().removeAttribute('href');
							browserCtrl.reference.Text(retValue[2]);
						}
					}
					else {
						var f = 1;
						browserCtrl.browser.Value(retValue[0]);
						if (!browserCtrl.input.empty) {
							f = browserCtrl.altKey ? 1 : 0;
							browserCtrl.input.Value(retValue[f++]);
						}
						if (!browserCtrl.reference.empty) {
							if (browserCtrl.refUrl.length > 0) {
								browserCtrl.reference.Attribute("href", browserCtrl.refUrl + SysURLEncode(retValue[0]));
							}
							if (browserCtrl.keyInRef) {
								r = SysTrim(retValue[0]);
							}
							for (j = f; j < (retValue.length - erCount); j++) {
								if (r.length > 0) { r += ' - '; }
								r += SysTrim(retValue[j]);
							}
							browserCtrl.reference.Text(r);
							browserCtrl.reference.Css("color", "");
						}
						if (er) {
							for (k = 0; k < er.length; k++) {
								var erc2 = er[k].split(';');
								var erv = retValue[erc2[1]];
								// Null values are rendered as non breaking spaces; they should be cleared
								if (erv === String.fromCharCode(160)) {
									erv = "";
								}
								SysSet(erc2[0], erv);
								SysSet(erc2[0] + '_alt', erv);
							}
						}
					}
				}
				return true;
			}
			return false;
		}

		SysBrowserDef._CloseDialogHandler = function (browserCtrl, dlg) {
			if (dlg.returnValue != null)
			{
				if (typeof browserCtrl.onChangeScript === "function") {
					browserCtrl.onChangeScript();
				}
				else if (SysElement.IsNotNothing(browserCtrl.onChangeScript)) {
					new Function(browserCtrl.onChangeScript)();
				}
			}
			try {
				HlpHtHandleBrowser(browserCtrl.id);
			}
			catch (ex) { }
		}

		// Constructor

		function SysBrowserDef(el, options) {
			/// <summary>Wraps the browser control.</summary>
			/// <param name="el" type="Any">Dom element or element identification.</param>
			/// <param name="options" type="Object">Provide with 'key-value' pairs to initialize the fields of the browser instance.</param>
			/// <field name="id" type="String">The id of the browser control.</field>
			/// <field name="browser" type="SysElement">The browser control, i.e. the hidden input that receives the value 
			/// of the browsed data.</field>
			/// <field name="input" type="SysElement">The (alternative) input element for typing/searching.</field>
			/// <field name="button" type="SysElement">The browser button to open the browse window.</field>
			/// <field name="reference" type="SysElement">The link to the selected item.</field>

			if (SysBrowserDef._initialized === undefined) {

				SysBrowserDef.prototype.SetReadOnly = function (readOnly) {
					if (!this.input.empty) {
						SysSetReadOnly(this.input, readOnly);
						if (readOnly) {
							this.input.SetDisabled(true);
						}
						else {
							this.input.SetDisabled(false);
						}
					}

					if (!this.button.empty) {
						if (readOnly) {
							this.button.SetDisabled(true);
						}
						else {
							this.button.SetDisabled(false);
						}
					}
				};

				SysBrowserDef.prototype.ClearBrowser = function () {
					if (!this.browser.empty) {
						this.browser.Value("");
					}
				};

				SysBrowserDef.prototype.ClearInput = function () {
					if (!this.input.empty) {
						this.input.Value("");
					}
				};

				SysBrowserDef.prototype.ClearReference = function () {
					if (!this.reference.empty) {
						if (this.reference._el.tagName === "SPAN") {
							this.reference.element.text("");
						}
						else if (this.reference._el.tagName === "A") {
							this.reference.Value("");
							this.reference.element.text("");
							this.reference.element.attr("href", "");
						}
						else if (this.reference._el.tagName === "INPUT") {
							this.reference.Value("");
						}

					}
				};

				SysBrowserDef.prototype.Clear = function () {
					this.ClearBrowser();
					this.ClearInput();
					this.ClearReference();
				};

				SysBrowserDef.prototype.GetValue = function () {
					return this.browser.Value();
				};

				SysBrowserDef.prototype.SetValue = function (value, doOnChange) {
					this.Clear();
					this.input.Value(value);
					if (doOnChange === undefined || doOnChange === true) {
						this.input.element.change();
					}
				};

				SysBrowserDef.prototype.Hide = function () {
					this.input.Hide();
					if (!this.reference.empty) {
						this.reference.Hide();
					}
					if (!this.button.empty) {
						this.button.Hide();
					}
				};

				SysBrowserDef.prototype.Show = function () {
					this.input.Show();
					if (!this.reference.empty) {
						this.reference.Show();
					}
					if (!this.button.empty) {
						this.button.Show();
					}
				};

				SysBrowserDef.prototype.EnableBrowsing = function () {
					this.browsingDisabled = false;
					this.browser.Attribute("data-browsingdisabled", false);
					this.input.Attribute("title", this._title);
				}

				SysBrowserDef.prototype.DisableBrowsing = function () {
					this.browsingDisabled = true;
					this.browser.Attribute("data-browsingdisabled", true);
					this.input.Attribute("title", "");
				}

				SysBrowserDef.prototype.Browse = function (handler) {
					// Don't browse when it is disabled
					if (this.browsingDisabled) return;

					var url,
					args;
					if (this.multiBrowser === true) {
						url = 'SysMultiBrowser.aspx?' + this._GetParams();
						args = new Array(this.GetValue());
					}
					else {
						url = 'SysBrowser.aspx?' + this._GetParams();
					}
					url = new SysUrlBuilder(url);
					url.Add("IsModal", 1);
					if (this.isInTest) {
						url.Add("IsInTest", 1);
						url.Add("TestValue", this.testValue);
					}

					var me = this,
						dlg;
					function BrowseData() {
						SysBrowserDef._BrowseDataHandler(me, (dlg || SysDialog).returnValue);
						if (typeof handler === "function") {
							handler();
						}
					}

					function ReturnFocus() {
						if (me.input.IsVisible()) {
							return me.input;
						} else {
							return me.button;
						}
					}

					if (Dialog.ShowDialog()) {
						dlg = new BrowserDialog({
							resizable: true,
							arguments: args,
							contentsPage: url,
							handler: BrowseData,
							onClose: function() { SysBrowserDef._CloseDialogHandler(me, dlg); },
							returnFocus: ReturnFocus()
						});
					}
					else {
						SysShowModal(url, args, '800px', '600px', BrowseData, true, 'scroll:no;');
					}
				};

				SysBrowserDef.prototype._GetParams = function () {
					if (typeof this.params === "function") {
						return this.params();
					}
					else {
						return this.params;
					}
				};

				SysBrowserDef.prototype._Init = function (el, options) {
					if (typeof options === "object") {
						for (var name in options) {
							if (this[name] !== undefined) {
								this[name] = options[name];
							}
						}
					}

					this.browser = new SysElement(el);
					this.id = this.browser.element.attr("id");

					this.input = new SysElement(this.id + "_alt");
					this.button = new SysElement("p" + this.id);
					this.reference = new SysElement(this.id + "_ref");

					this._title = this.input.Attribute("title");
					if (this.browsingDisabled) this.DisableBrowsing();
				};

				SysBrowserDef._initialized = true;
			}

			this._Init(el, options);
		}

		return SysBrowserDef;

	})();

	window.SysBrowser = SysBrowser;

})();

function SysBrowserKeyDown(e, allowEmpty) {
	/// <summary>'Special' key handling of tab, enter, F2, ... keys in input search controls. Is usually automatically
	/// added by the BrowseField control to the key down event.</summary>
	/// <param name="e" type="DOMEvent"></param>
	/// <returns type="undefined">undefined</returns>
	var hdl = new SysHandleKey(e);
	var key = hdl.GetKey();

	if (key === SysHandleKey.Key.tab) {
		SysCancelInputSearch();
	}

	// Invoke handler for special element described as InputSearchAction.
	// The handler invokes if element in context menu was selected and was pressed "Enter" key.
	if (key == SysHandleKey.Key.enter && sysCxMenu !== null && sysCxMenu.is(":visible")) {
		var isItemSelected = $(sysCxMenu).find("tr.Selected.InputSearchAction").length != 0;
		if (isItemSelected) {
			SysCancelBubble(e);
			$(sysCxMenu).find("tr.Selected td").click();
			return;
		}
	}

	var el = $(SysSrcElement(e));
	// Cancel propagation / default behaviour before firing the event: otherwise the event propagates anyway, 
	// because of the browser window popup.
	if (allowEmpty) {
		if (hdl.IsF2Key()) {
			SysCancelBubble(e);
			// When raising the dblclick the prevent default has no effect in FF 4 resulting in a click on a submit 
			// (or typeless) button.
			if (Sys.Browser.agent === Sys.Browser.Firefox && Sys.Browser.version >= 4) {
				setTimeout(function() {
					el.dblclick();
				});
			}
			else {
				el.dblclick();
			}
		}
	}
	else {
		if (hdl.IsF2Key() ||
		   ((el.val() == "undefined" || el.val().length == 0) && (key === SysHandleKey.Key.enter || hdl.IsTabKey()))) {
			SysCancelBubble(e);
			if (Sys.Browser.agent === Sys.Browser.Firefox && Sys.Browser.version >= 4) {
				setTimeout(function() {
					el.dblclick();
				});
			}
			else {
				el.dblclick();
			}
		}
	}
}

function SysBrowseData(ctl, params, refurl, bAltKey, bKeyInRef, onchangeScript, extraResults, multiple) {
	var browserCtrl = new SysBrowser(ctl, {
		params: params,
		refUrl: refurl,
		altKey: bAltKey,
		keyInRef: bKeyInRef,
		onChangeScript: onchangeScript,
		extraResults: extraResults,
		multiBrowser: multiple
	});

	browserCtrl.Browse();
}

function SysBrowserClear(id) {
	/// <summary>Obsolete: use the SysBrowser object.</summary>

	var browser = new SysBrowser(id);
	browser.Clear();
}

function SysBrowserSetReadOnly(id, readOnly) {
	/// <summary>Obsolete: use the SysBrowser object.</summary>

	var browser = new SysBrowser(id);
	browser.SetReadOnly(readOnly);
}

function SysMultiBrowserSingleSelect(e, toggle) {
	/// <summary>Toggle the checkbox when clicking in a row</summary>
	/// <param name="e">Event object</param>
	/// <param name="toggle">True: the checkmark is toggled, false the check mark is set.</param>
	var ev = SysEvent(e);
	var el = $(ev.target).parent("tr").children("td").find(":checkbox");
	el.attr("checked", !toggle || !el.attr("checked"));
}

function SysBrowserURL(url, value) {
	var re = new RegExp('<[A-Z](.+?)>', 'g');
	var r = url.match(re);
	if (r != null) {
		var v;
		for (i = 0; i < r.length; i++) {
			var c = SysGetElement(r[i].slice(1, -1));
			if (c != null) { v = SysURLEncode(c.value); } else { v = ''; }
			url = url.replace(r[i], v);
		}
	}
	return url + SysURLEncode(value);
}

function SysBrowseParam(param, name) {
	var p = SysGetValue(param);
	return "&Param_" + name + "=" + (p?SysURLEncode(p):"");
}

function SysBrowseList(ctl, params, options, refurl, bAltKey, bKeyInRef) {
	var c;
	// DO NOT CHANGE: Different application name
	var u = 'SysBrowser.aspx?' + params;
	var v = window.showModalDialog(u, window, options);
	if (typeof (v) != 'undefined' && v != null) {
		var f = 1;
		var r = '';
		if (typeof (v) != 'object') { v = Array(v) };

		if (bKeyInRef || v.length == 1) { r = v[0]; }
		for (j = 1; j < v.length; j++) {
			if (r.length > 0) { r += ' - '; }
			r += v[j];
		}
		var rl = SysGetElement(ctl.substr(0, ctl.length - 4));
		var rlv = rl.value;
		if (rlv != null && rlv.length > 0 && rlv.substr(rlv.length - 1, 1) != ';')
			rlv += ';';
		rlv += r;
		rl.value = rlv;
	}
	return false;
}

function SysBrowseEdit(page, resultcols) {
	var handleBrowseEdit = function (v) {
		if (v != null) {
			ListCurrent();
		}
	};

	var url = new SysUrlBuilder(page);
	url.Add("BCAction", 1);
	url.Add("Resultcols", resultcols);
	
	if (Dialog.ShowDialog()) {
		var dlg = new Dialog({
			autoShow: true,
			fullScreen: true,
			contentsPage: url,
			returnFocus: document.activeElement,
			handler: function () { handleBrowseEdit(dlg.returnValue); }
		});
	}
	else {
		url.Add("IsModal", 1);
		var urlPopupBuilder = new SysUrlBuilder('SysPopupFrame.aspx');
		urlPopupBuilder.Add("Page", url.ToString());
		var v = SysShowModal(url, null, window.screen.availWidth + 'px', window.screen.availHeight + 'px', null, true);
		handleBrowseEdit(v);
	}
}

function SysBrowseNew(page, resultcols) {

	var currentDialog = $dialog;
	var handleBrowseNew = function (v) {
		if (v != null) {
			currentDialog.returnValue = v;
		}
	};

	var url = new SysUrlBuilder(page);
	url.Add("BCAction", 0);
	url.Add("Resultcols",resultcols);
	

	if (Dialog.ShowDialog()) {		
		var dlg = new Dialog({
			autoShow: true,
			fullScreen: true,
			contentsPage: url,
			returnFocus: document.activeElement,
			handler: function () {
				handleBrowseNew(dlg.returnValue);
			},
			onClose: function () {
				if (currentDialog.returnValue != null) {
					currentDialog.Close();
				}
			}
		});
	}
	else {
		url.Add("IsModal", 1);
		var urlPopupBuilder = new SysUrlBuilder('SysPopupFrame.aspx');
		urlPopupBuilder.Add("Page", url.ToString());
		var v = SysShowModal(urlPopupBuilder, null, window.screen.availWidth + 'px', window.screen.availHeight + 'px', null, true);
		handleBrowseNew(v);
	}
}

function SysBrowse(name) {
	/// <summary>Obsolete: it will not work when using when using dialogs.</summary>
	SysGetElement('p' + name).click();
	return SysGet(name);
}

function SysBrowserKeyUp(e) {
	/// <summary>Handles browser specific key.</summary>
	/// <param name="e">Event argument. Preferably a DOMEvent, but a browser specific event object is also acceptable.</param>
	var ev = new SysHandleEvent(e);
	if (ev.IsEventStopped()) {
		return;
	}

	var hdl = new SysHandleKey(ev);
	if (hdl.IsEscapeKey()) {
		SysWindow.CloseDialog(new SysHandleEvent(e), this);
	}
	// Insert
	else if (hdl.IsInsertKey()) {
		BrowseNew();
	}
}

// This variable is used in BrowseField.vb
var isValueFromSuggestionList = false;
function HandleBrowseFieldSuggestionListClientData(el) {
	/// <summary>Insert client data value from suggestion list to extra result control.</summary>
	isValueFromSuggestionList = true;
	var browserCtrl = window[sysInputAlt + "Ctrl"];
	if (browserCtrl != null && browserCtrl.extraResults != null) {
		var extraResults = browserCtrl.extraResults.split('@')[0].split(',');
		// Format for extraResults: [ControlId;ValuePositionInReturnValue]
		// Example:[City;2,State;3]
		if (extraResults) {
			var returnValue = JSON.parse($(el.parentNode.lastChild).text());
			// Example format for returnValue: [1432,1432,Aalsmeer,NH]
			if (returnValue != null) {
				for (i = 0; i < extraResults.length; i++) {
					var extraResultControlData = extraResults[i].split(';');
					var extraResultControlId = extraResultControlData[0];
					var extraResultValue = returnValue[extraResultControlData[1]];
					// Null values are rendered as non breaking spaces; they should be cleared
					if (extraResultValue === String.fromCharCode(160)) {
						extraResultValue = "";
					}
					new SysElement(extraResultControlId).Value(extraResultValue);
					new SysElement(extraResultControlId + '_alt').Value(extraResultValue);
				}
			}
		}
	}
};// Get the Buttonbar from the page and fix it during scrolling (only when not visible on page)
function SysFloatingButtonBar() {
	var hasHeader = $('.HdrTitleLine').length;
	var btnBar = $('.exButtonBar').first();
	var loginBtn = $('.LoginButton');

	if (hasHeader && btnBar.length && !loginBtn.length) {
		var hdrRefs = $('.HdrRefs');
		var btnBarOffset = btnBar.offset();
		var scrollToTop = '<div class="ScrollToTop"><a title="' + SysTerm(57231, "back to top") + '" href="#"><span></span></a></div>';
		var appendDone = false;
		var wrapper = $('.HdrTitleLine').add(btnBar).wrapAll('<div>').parent();

		var overlay = null;
		if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
			overlay = $("<iframe class='IEIFrameOverlay' frameborder='0' style='display: none;'></iframe>");
			overlay.css('width', '100%');
			overlay.insertBefore(wrapper); // insert just above the FixedButtonBar
		}

		$(window).scroll(function () {
			var fixedBtnBar = btnBar.parent();
			var btnBarHeight = fixedBtnBar.height();
			var scrollTop = $(window).scrollTop() - 30;

			if (btnBarOffset.top < scrollTop) {
				fixedBtnBar.addClass('FixedButtonBar');
				if (!appendDone) {
					$('body').find('form').css('margin-top', btnBarHeight + 1); // 1 needed somehow for IE8/IE9
					hdrRefs.hide();
					btnBar.append(scrollToTop);
					$('.ScrollToTop').click(function () {
						$("html, body").animate({ scrollTop: 0 }, 400);
						return false;
					});
					appendDone = true;
				}

				if (appendDone && overlay) {
					overlay.css('top', fixedBtnBar.css('top'));
					overlay.css('position', fixedBtnBar.css('position'));
					overlay.css('display', 'inline');
					overlay.css('height', btnBarHeight + 9);				// plus 9 is needed to include the bottom border and the shadow
					overlay.css('z-index', fixedBtnBar.css('z-index') - 1);	// the fixed button bar has to be on top
				}

			} else {
				btnBar.parent().removeClass('FixedButtonBar');

				if (overlay) {
					overlay.hide();
				}

				$('.ScrollToTop').remove();
				$('body').find('form').css('margin-top', '0px');
				hdrRefs.show();
				appendDone = false;
			}
		});
	}
};;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// System functions to support text selection.

// order of checking for interface:
// // FF, Safari, Chrome, Opera
// if (window.getSelection) {
// }
// // IE, Opera. This should come last; Opera supports both
// else if (document.selection) {
// }

// An element's nodeType can be any of
//        Node.ELEMENT_NODE == 1
//        Node.ATTRIBUTE_NODE == 2
//        Node.TEXT_NODE == 3
//        Node.CDATA_SECTION_NODE == 4
//        Node.ENTITY_REFERENCE_NODE == 5
//        Node.ENTITY_NODE == 6
//        Node.PROCESSING_INSTRUCTION_NODE == 7
//        Node.COMMENT_NODE == 8
//        Node.DOCUMENT_NODE == 9
//        Node.DOCUMENT_TYPE_NODE == 10
//        Node.DOCUMENT_FRAGMENT_NODE == 11
//        Node.NOTATION_NODE == 12



// Mimic public enumerators

SysSelection.Mode = {
	undefined: -1,
	control: 0,
	text: 1,
	mixed: 2
};

SysSelection._Type = {
	text: "Text",
	control: "Control",
	none: "None"
};

// Interface
SysSelection.prototype = {
	el: null,
	hasSelection: false,
	sysselection: "1.0.0",
	mode: SysSelection.Mode.undefined,

	GetCaretPosition: function () {
		/// <summary>Get the location of the caret, i.e. the cursor position within the text.</summary>
		/// <returns type="Integer"></returns>
	},
	SetCaretPosition: function (pos) {
		/// <summary>Set the location of the caret, i.e. the cursor</summary>
		/// <param name="pos" optional="false" integer="true">The position in the elements text where the caret should be set to.</param>
		/// <remarks>If any text was selected, this selection is lost.</remarks>
	},
	GetSelection: function () {
		/// <summary>Get the selected text</summary>
		/// <returns type="String">The selected text or an empty string if no text was selected.</returns>
	},
	SetSelection: function (start, nr) {
		/// <summary>Select a part of the inner text in an element.</summary>
		/// <param name="start" optional="true" integer="true">If supplied indicates the starting character for the new
		/// selection.</param>
		/// <param name="nr" optional="true" integer="true">If supplied, indicates the number of characters to include 
		/// in the selection.</param>
	},
	ClearSelection: function () {
		/// <summary>Unselects selected text / controls.</summary>
	},
	DeleteSelection: function () {
		/// <summary>Deletes the selection, returns the deleted selection text.</summary>
		/// <returns type="null|String">If no text was deleted null is returned.</returns>
	},
	RestoreSelection: function () {
		/// <summary>Restore the selection after it is lost by another event.</summary>
	},
	ReplaceSelection: function (ins) {
		/// <summary>Replace the selected text with the supplied text. If no text was selected the supplied text
		/// is inserted at the current caret position.</summary>
	},
	GetHtml: function () {
		
	},
	InsertHtml: function (html) {
		
	},
	ReplaceHtml: function (html) {
		
	}
}


// Mimic statics


// Constructor
function SysSelection(el) {
	/// <summary>Represents a (text) selection object.</summary>
	/// <param name="el" type="Any">Can be anything ranging from an element's id, a jQuery object, ... <see 
	/// cref="SysElement />.</param>
	/// <field name="el" type="jQuery">The element the selection operates on. Note: this is not necessarily the same as
	/// the element that was initially supplied.</field>
	/// <field name="hasSelection" type="boolean">Indicates if the selection can be manipulated. A false can occur
	/// if no text / element had been selected, or, if no manipulable element was supplied.</field>
	/// <field name="sysselection" type="String">contains a version number and identifies any instance as being an 
	/// instance of SysSelection.</field>

	if (SysSelection._initialized === undefined) {

		// Public interface
		SysSelection.prototype.GetCaretPosition = function () {
			if (this._selectionStart == -1) {
				if (this.hasSelection) {
					if (window.getSelection) {
						if (SysElement.IsNotNothing(this._el.selectionStart)) {
							this._selectionStart = this._el.selectionStart;
						}
						else {
							this._selectionStart = this._sel.anchorOffset;
							// this._selectionStart = this._rng.startOffset;
						}
					} else if (document.selection) {
						var i;
						var objCaret;
						if (this._sel && this._rng) {
							objCaret = SysSelection._CreateRange(this._sel);
						}
						else {
							objCaret = SysSelection._CreateRange(document.selection);
						}

						// We need to use val for e.g. an input element, text for e.g. button, td, ...
						var txt = this.el.text() || this.el.val();
						i = txt.replace(/\n/g, '').length + 1;

						var moved = 1;
						while (objCaret && objCaret.parentElement() == this._el && moved == 1) {
							moved = objCaret.move("character", 1);
							if (moved === 1) {
								--i;
							}
						}
						this._selectionStart = --i;
					}
					else {
						this._selectionStart = 0;
					}
				}
			}
			return this._selectionStart;
		};

		SysSelection.prototype.SetCaretPosition = function (pos) {
			if (this.hasSelection) {
				this._selectionStart = pos;
				if (window.getSelection) {
					this._el.selectionStart = pos;
					this._el.selectionEnd = pos;
				}
				else {
					var selRange = this._el.createTextRange();
					selRange.move("character", pos)
					selRange.select();
				}
			}
		};

		SysSelection.prototype.GetSelection = function () {
			var txt = "";
			if (this.hasSelection) {
				if (window.getSelection) {
					if (SysElement.IsNotNothing(this._el.selectionStart)) {
						var pos = this.GetCaretPosition();
						if (pos != this._el.selectionEnd) {
							txt = this.el.val().substring(pos, this._el.selectionEnd);
						}
					}
					else {
						txt = this._sel.toString();
					}
				}
				else if (document.selection) {
					if (this._sel.type === SysSelection._Type.text) {
						txt = this._rng.text;
					}
					else if (this._sel.type === SysSelection._Type.control) {
						txt = this._el.innerText;
					}
				}
			}
			return txt;
		};

		SysSelection.prototype.SetSelection = function (start, nr) {
			var selStart = -1;
			var selEnd = -1;
			var txtLen = (this.el.val() || this.el.text()).length;
			if (typeof start === "number" && start >= 0) {
				selStart = selEnd = start;
			}
			if (typeof nr === "number" && nr >= 0) {
				selEnd = selStart + nr;
			}

			if (window.getSelection) {
				if (selStart > -1) {
					this._selectionStart = this._el.selectionStart = selStart;
				}
				else {
					this._selectionStart = this._el.selectionStart = 0;
				}

				if (selEnd > -1) {
					this._el.selectionEnd = selEnd;
				}
				else {
					this._el.selectionEnd = txtLen;
				}
			}
			else if (document.selection) {
				var rng = document.selection.createRange();
				if (selStart > 0) {
					rng.moveStart("character", selStart);
				} else {
					rng.moveStart("textedit");
				}
				if (selEnd == -1) {
					rng.expand("textedit");
				} else {
					rng.expand("character", txtLen - selStart);
				}
				rng.select();
			}
		};

		SysSelection.prototype.ClearSelection = function () {
			if (this.hasSelection) {
				if (window.getSelection) {
					this._el.selectionEnd = this._el.selectionStart;
				}
				else if (document.selection) {
					this._sel.empty();
					this._rng = null;
					//                    if (this._sel.type === SysSelection._Type.text) {
					//                        this._sel.empty();
					//                        this._rng = this._sel.createRange();
					//                    }
					//                    else if (this._sel.type === SysSelection._Type.control) {
					//                        var el2 = this._rng.commonParentElement();
					//                        this._sel.empty();
					//                        if (el2.nodeType === 9) {
					//                            this._rng = el2.body.createControlRange();
					//                        }
					//                        else {
					//                            this._rng = el2.document.body.createControlRange();
					//                        }
					//                        
				}
			}
		};

		SysSelection.prototype.DeleteSelection = function () {
			var txt = null;
			if (this.hasSelection) {
				if (window.getSelection) {
					// possibly a text selection inside a single element (re-enabled to facilitate br 33.716.042)
					if (SysElement.IsNotNothing(this._el.selectionStart) &&
							SysElement.IsNotNothing(this._el.selectionEnd)) {

						var pos = this.GetCaretPosition();
						if (pos != this._el.selectionEnd) {
							var val = this.el.val();
							txt = val.substring(pos, this._el.selectionEnd);
							this.el.val(val.substring(0, pos) + val.substring(this._el.selectionEnd));
						}
					}
					else {
						// Note: inside input element in ff (3.5) txt would remain empty. In Safari deleteFromDocument
						// removed the selection from screen, but not from the value of the element which contained the 
						// selection
						txt = this._sel.toString();
						if (txt.length > 0) {
							this._sel.deleteFromDocument();
						}
					}
				}
				else if (document.selection) {
					if (this._sel.type === SysSelection._Type.text) {
						txt = this._rng.text;
						this._sel.clear();
					}
					else if (this._sel.type === SysSelection._Type.control) {
						var i = 0;
						var el = this._el.parentElement;
						while (i < this._rng.length) {
							txt += this._rng(i).innerText;
							i++;
						}
						this._sel.clear();
						this._Init(el);
					}
				}
			}
			return txt;
		};

		SysSelection.prototype.ReplaceSelection = function (ins) {
			if (this.hasSelection) {
				if (window.getSelection) {
					var pos = this.GetCaretPosition();
					this.DeleteSelection();
					if (SysElement.IsNotNothing(this._el.value)) {
						this._el.value = this._InsertValue(this._el.value, pos, ins);
					}
					else if (SysElement.IsNotNothing(this._el.textContent)) {
						this._el.textContent = this._InsertValue(this._el.textContent, pos, ins);
					}		
				}
				else if (document.selection) {
					if (this._sel.type === SysSelection._Type.none) {
						// determine if we're inside an element that can receive text
						// Note alternatively:
						//    this._rng = this._el.document.selection.createRange().duplicate();
						//    this._rng.text = ins;
						if (SysElement.IsNotNothing(this._rng)) {
							this._rng.text = this._rng.text.charAt(this._rng.text.length - 1) == '' ? ins + ' ' : ins;
						}
						else {
							this._el.focus();
							if (SysElement.IsNotNothing(this._el.value)) {
								this._el.value = ins;
							}
						}
					}
					else if (this._sel.type === SysSelection._Type.text) {
						this._rng.text = ins;
					}
					else {
						if (this._el.createTextRange) {
							this._rng = this._el.createTextRange();
							this._rng.text = ins;
						}
						this.DeleteSelection();
					}
				}

			}
		};

		SysSelection.prototype.RestoreSelection = function () {
			if (this.hasSelection) {
				if (this._sel && this._rng) {
					if (this._rng.select) {
						this._rng.select();
					} else if (this._sel.removeAllRanges && this._sel.addRange) {
						this._sel.removeAllRanges();
						this._sel.addRange(this._rng);
					}
				}
			}
		};

		SysSelection.prototype.GetHtml = function () {
			var html = "";
			if (this.hasSelection && this._rng) {
				if (window.getSelection) {
					// And the HTML:
					var clonedSelection = this._rng.cloneContents();
					var div = document.createElement('div');
					div.appendChild(clonedSelection);
					return div.innerHTML;
				} else if (document.selection) {
					return this._rng.htmlText;
				} else {
					return '';
				}
			}
			return html;
		}

		SysSelection.prototype.InsertHtml = function (html) {
			if (this.hasSelection && this._rng) {
				if (this._rng.pasteHTML) {
					if ((this._sel != null) && (this._sel.type.toLowerCase() != "control")) {
						this._rng.pasteHTML(html);
					}
				} else {
					var element = $(html)[0];
					if (UserAgent.IsIE() && UserAgent.majorVersion >= 9) {
						var container = el.document.createElement("div");
						container.innerHTML = html;
						element = container.firstChild;
					}
					this._rng.insertNode(element);
				}
			}
		}

		SysSelection.prototype.ReplaceHtml = function (html) {
			if (this.hasSelection && this._rng) {
				if (this._rng.pasteHTML) {
					if ((this._sel != null) && (this._sel.type.toLowerCase() != "control")) {
						this._rng.pasteHTML(html);
					}
				} else {
					this._rng.deleteContents();
					var element = $(html)[0];
					if (UserAgent.IsIE() && UserAgent.majorVersion >= 9) {
						element = $(html, el.document)[0];
						var container = el.document.createElement("div");
						container.innerHTML = html;
						element = container.firstChild;
					}
					this._rng.insertNode(element);
				}
			}
		}

		// Local interface
		SysSelection.prototype._Init = function (el) {
			/// <summary>This interface is NOT intended to be part of the public interface.</summary>
			var locEl = el;
			if (el) {
				var el2 = new SysElement(el).element;
				if (el2.length > 0) {
					locEl = el2[0];
				}
			}

			var ret = SysSelection._GetElement(locEl);
			this.el = ret[0];

			this._sel = ret[1];
			this._rng = ret[2];
			this.mode = ret[3];
			this._el = this.el[0];
			this._selectionStart = -1;
			this.hasSelection = true;
		}

		SysSelection.prototype._InsertValue = function (val, pos, ins) {
			/// <summary>This interface is NOT intended to be part of the public interface.</summary>
			var txt;
			if (pos != -1) {
				txt = val.substring(0, pos);
				txt += ins;
				txt += val.substring(pos);
			}
			else {
				txt = ins + val;
			}
			return txt;
		}

		SysSelection._initialized = true;

	}

	this._Init(el);

}

// private 'static':

SysSelection._GetElement = function (el) {
	var node, sel, rng, mode = SysSelection.Mode.undefined;
	if (el) {
		if (window.getSelection) {

			// In virtually all cases (I've seen sofar) all selections are wrapped in a TextNode element
			mode = SysSelection.Mode.text;

			// Make sure not to use the wrong parent window (e.g. a frame / window object was passed on)
			if (el.window) {
				sel = el.window.getSelection();
			}
			else {
				sel = window.getSelection();
			}

			// Selections inside an element (e.g. <input>) are not stored in range objects, ergo the rangeCount can be 0
			if (sel.rangeCount > 0) {
				rng = sel.getRangeAt(0);
				if (SysElement.IsNotNothing(el.selectionStart)) {
					node = el;
				}
				else {
					node = rng.startContainer;

					if (node.nodeType == 3) {
						node = node.parentNode;
					}
					else {
						mode = SysSelection.Mode.control;
					}
				}
			}
			else {
				node = el;
			}
		}
		else if (document.selection) {
			// nodeType === DOCUMENT_NODE
			if (el.nodeType === 9) {
				sel = el.selection;
			}
			else {
				sel = el.document.selection;
			}
			rng = SysSelection._CreateRange(sel);
			var type = sel.type;

			if (type === SysSelection._Type.text) {
				mode = SysSelection.Mode.text;
			}
			else if (type === SysSelection._Type.control) {
				mode = SysSelection.Mode.control;
			}
			else {
			}
			// not every DOM element has a nodeType: frames
			if (type === SysSelection._Type.text || SysElement.IsNothing(el.nodeType)) {
				if (rng.parentElement) {
					node = rng.parentElement();
				}
				else if (rng.commonParentElement) {
					node = rng.commonParentElement();
				}
			}
			else if (type === SysSelection._Type.control) {
				node = rng(0);
			}
			else if (type === SysSelection._Type.none) {
				node = el;
			}
		}
	}
	var ret = [];
	ret[0] = $(node);
	ret[1] = sel;
	ret[2] = rng;
	ret[3] = mode;
	return ret;
}

SysSelection._CreateRange = function (sel) {
	/// <summary>This interface is NOT intended to be part of the public interface.</summary>
	/// <remarks>When the selection.type is "Control", the interface of the selection object no longer supports 
	/// duplicate(). <br/>
	/// Use with the document.selection interface (i.e. IE)</remarks>
	var rng = sel.createRange();
	if (typeof (rng.duplicate) === "object") {
		rng = rng.duplicate();
	}
	return rng;
}
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="SysUserAgent.js" />

SysWindow.prototype = {

	syswindow: "1.0.0",

	window: null,
	isMainWindow: false,

	Location: function (url, newWindow, name, features) {
		/// <summary>Navigate to the specified location indicated by url.</summary>
		/// <param name="url" type="String|SysUrlBuilder">Where to should be navigated.</param>
		/// <param name="newWindow" type="Boolean">If true specified url will be opened in a new window.</param>
		/// <param name="name" type="String" optional="true">Optionally supply a name for the new window.</param>
		/// <param name="features" type="String" optional="true">Optionally supply the features of the new window.
		/// </param>
		/// <returns type="undefined">undefined</returns>
	},
	Replace: function (url) {
		/// <summary>Replace the current document with that indicated by url. The additional effect is that the 
		/// replaced document is also removed from the history and the replacing document is added to the history.</summary>
		/// <param name="url" type="String|SysUrlBuilder">Where to should be navigated.</param>
		/// <returns type="undefined">undefined</returns>
	},
	MenuStyle: function () {
		/// <summary>Indicates the menu style in use.</summary>
		/// <returns type="MenuStyle">undefined</returns>
	}
};

// Mimic public enumerators

SysWindow.Window = {
	/// <summary>Enumeration over the window elements defined in eol.</summary>
	TheMainWindow: 0,
	MainWindow: 1,
	MenuLeft: 2,
	Toolbar: 3,
	Products: 4
};

SysWindow.MenuStyle = {
	/// <summary>Indicates the menu style in use.</summary>
	DosMenu: 1,
	Panel: 2,
	NewNavigation: 3
};

// Mimic statics

SysWindow.GetDialog = function (el, win) {
	var dlg = win && win.Dialog ? win.Dialog : window.Dialog;
	if (dlg.InDialog(el, win) && dlg.ShowDialog()) {
		var mainWindow = win;
		while (mainWindow != mainWindow.parent) {
			mainWindow = mainWindow.parent;
		}
		if (mainWindow.$dialog) return mainWindow.$dialog;
	}
	return null;
};

SysWindow.CloseDialog = function (el, win, retValue) {
	/// <summary>Close the current popup or dialog</summary>
	/// <param name="el" type="Any">Any type of element: DOMElement, SysElement, ...</param>
	/// <param name="win" type="Object">The window object of the aspx that was loaded into the dialog.</param>
	/// <param name="retValue" type="the return value for the dialog"></param>
	/// <returns type="undefined">undefined</returns>
	var dlg = SysWindow.GetDialog(el, win);
	if (SysElement.IsNotNothing(dlg)) {
		dlg.returnValue = retValue;
		dlg.Close();
	}
	else {
		if (/\/SysPopupFrame\.aspx/i.test(win.parent.location.href)) {
			win.parent.returnValue = retValue;
			win.parent.close();
		} else {
			win.returnValue = retValue;
			win.close();
		}
	}
};

SysWindow.GetDialogArguments = function (el, win) {
	var dlg = SysWindow.GetDialog(el, win);
	if (SysElement.IsNotNothing(dlg)) {
		return dlg.arguments;
	}
	else {
		return win.parent.dialogArguments;
	}
};

SysWindow.SyncDivision = function (division) {
	/// <summary>With the main window (containing the menu) and its child, the division either is working on can run out of sync.
	/// This re-aligns them.
	/// </summary>
	/// <remarks> Make sure we actually have both a parent and a child window</remarks>
	if (SysElement.IsNotNothing(parent) && parent !== window && typeof parent.SysDivision === "function") {
		if (parseInt(division) !== parent.SysDivision()) {
			SysWindow.SwitchDivision(parent.SysDivision());
		}
	}
}

SysWindow.SwitchDivision = function (division) {
	/// <summary>Update the LastUsedDivision setting with the new value.</summary>
	/// <remarks>Using a synchronous callback; Firefox kills all running async callbacks
	/// when navigating away from the page (the redirect at the end of this function).</remarks>
	SysCallback(
		new SysUrlBuilder("SysCallback.aspx")
		.Add("Action", 11) // SetUserSetting
		.Add("SettingName", 30) // LastUsedDivision
		.Add("SettingValue", division)
	);
	new SysWindow(SysWindow.GetMainWindow()).Location("MenuPortal.aspx?_Division_=" + division);
}

SysWindow.GetWindow = function (win, parent) {
	/// <summary>Look for a specific window by its name.</summary>
	/// <param name="win" type="String">the id of the window (e.g. "MainWindow")</param>
	/// <param name="parent" optional="true" type="Window|Frame">Where to start looking: this is mainly used inside the 
	/// recursion and should usually not be supplied.</param>
	/// <returns type="Window|null">Returns the sought window object (or null if it cannot be found).</returns>
	var wnd = parent || top,
		i = 0,
		frame;

	while (i < wnd.frames.length) {
		frame = wnd.frames[i];
		try {
			if (frame.frameElement && frame.frameElement.id === win) {
				return frame.frameElement;
			}
			else {
				frame = SysWindow.GetWindow(win, frame);
				if (frame !== null) {
					return frame;
				}
			}
		} catch (e) { /* Skip frames without access*/ }
		i++;
	}

	return null;
};

SysWindow.GetMainWindow = function () {
	var mainWindow = window;
	while (mainWindow != mainWindow.parent) {
		mainWindow = mainWindow.parent;
	}
	return mainWindow;
};

SysWindow.SetMainWindow = function (url) {
	/// <summary>Redirect the main / top windown to the provided address</summary>
	/// <param name="url" type="String|UrlBuilder">The address to the page to which you wish to redirect.</param>
	new SysWindow(SysWindow.GetMainWindow()).Location(url)
}

SysWindow.IsMainWindow = function (win) {
	return SysWindow.GetMainWindow() === win
};

SysWindow.FindInAllWindows = function (expr) {
	return SysWindow._GetAllDocuments().find(expr);
};

SysWindow._GetAllDocuments = function (parent) {
	var wnd = parent || top, frame, frames = [];
	for (var i = 0; i < wnd.frames.length; i++) {
		frame = wnd.frames[i];
		try {
			var childFrames = SysWindow._GetAllDocuments(frame);
			frames.push(frame.frameElement.contentDocument || frame.frameElement.contentWindow.document);
			$(childFrames).each(function () { frames.push(this); });
		} catch (e) { /* Skip frames without access*/ }
	}
	return parent ? frames : $(frames);
}

SysWindow.OpenInTab = function (url) {
	/// <summary>Opens a specific url in a new tab</summary>
	/// <param name="url" type="SysUrlBuilder">An url builder</param>
	/// <returns type="undefined">undefined</returns>
	if (typeof url === "string") {
		url = new SysUrlBuilder(url);
	}

	var tab;
	if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
		tab = window.open("about:blank");
		tab.navigate(url.ToString());
	}
	else {
		tab = window.open(url.ToString(), "_blank");
	}

	if (!tab || tab.closed || typeof tab == 'undefined' || typeof tab.closed == 'undefined') {
		InformationDialog.Show(
			56928, "Popup blocked",
			56929, "Page cannot be opened because of the popup blocker.",
			0,
			SysTerm(56937, "Click the OK button to navigate to the requested page.") + " " +
			SysTerm(56938, "If you don't want to see this message anymore disable the popup blocker for Exact Online in your browser."),
			function () { window.open(url.ToString(), "_blank"); });
	}
}

SysWindow.DownloadFile = function (url, onSuccess, onFail) {
	/// <summary>Downloads a file from an URL.</summary>
	/// <param name="url" type="SysUrlBuilder">A url builder</param>
	/// <param name="onSuccess" type="Function">Callback when the download succeed</param>
	/// <param name="onFail" type="Function">Callback when the download fails</param>
	/// <returns type="undefined">undefined</returns>
	if (typeof onFail !== 'function') {
		onFail = function () { };
	}
	if (typeof onSuccess !== 'function') {
		onSuccess = function () { };
	}
	if (typeof url === "string") {
		url = new SysUrlBuilder(url);
	}

	var $iframe = $("<iframe style='display: none'></iframe>")
		.appendTo("body")
		.attr("src", url.ToString());

	setTimeout(checkFileDownloadComplete, 100);
	function checkFileDownloadComplete() {
		if (document.cookie.indexOf("FileDownload=True") != -1) {
			onSuccess(url);
			var date = new Date(1000);
			document.cookie = "FileDownload=; expires=" + new Date(1000).toUTCString() + "; path=/";
			$iframe.remove();
			return;
		}

		try {
			var iframeDoc = $iframe[0].contentWindow || $iframe[0].contentDocument;
			if (iframeDoc.document) iframeDoc = iframeDoc.document;
			if (iframeDoc && iframeDoc.body != null && iframeDoc.body.innerHTML.length > 0) {
				var isFailure = true;
				if (isFailure) {
					onFail(iframeDoc.body.innerHTML, url);
					$iframe.remove();
					return;
				}
			}
		}
		catch (err) {
			onFail('', url);
			$iframe.remove();
			return;
		}
		setTimeout(checkFileDownloadComplete, 100);
	}
}

SysWindow.GetScrollbarWidth = function () {
	if (SysWindow._scrollWidth === undefined) {
		// There is a 2px width difference in scrollbars between Mac OS and Windows (and possibly other OS's as well).
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf("windows nt") !== -1 || ua.indexOf("windows 9") !== -1 || ua.indexOf("windows ce") !== -1) {
			SysWindow._scrollWidth = 17;
		}
		else if (ua.indexOf("macintosh" !== -1)) {
			SysWindow._scrollWidth = 15;
		}
		else {
			// Don't know, taking windows sized scrollbars
			SysWindow._scrollWidth = 17;
		}
	}
	return SysWindow._scrollWidth;
}

SysWindow.Print = function () {
	setTimeout(function () {
		try {
			window.focus();
			if (UserAgent.IsFF() && UserAgent.majorVersion >= 15) {
				window.print();
			}
			else {
				document.execCommand('print', false, null);
			}
		}
		catch (e) {
			window.focus();
			window.print();
		}
	}, 200)  //Timeout of 200ms otherwise Sarafi 9 shows the print dialog before the page is rendered.
}

// Constructor

function SysWindow(win) {
	/// <summary>Wraps the window object. Optionally (e.g. in case of frames) supply the window object.</summary>
	/// <param name="win" type="Object" optional="true">Optionally supply the specific window object to wrap.</param>
	/// <field name="window" type="Window">The window object that has been wrapped.</field>

	if (SysWindow._initialized === undefined) {

		SysWindow.prototype.Location = function (url, newWindow, name, features) {
			var ub = url;
			if (!(url instanceof SysUrlBuilder)) {
				ub = new SysUrlBuilder(url);
			}
			if (SysElement.IsNotNothing(newWindow) && (newWindow === true || newWindow.shiftKey)) {
				return this.window.open(ub.ToString(), name, features);
			}
			else {
				if (!this.isMainWindow && (UserAgent.IsIE() || UserAgent.IsIE11OrUp() || UserAgent.IsEdge())) {
					// In IE all of the window[.document].location[.href] in an iframe return menuportal.aspx as referrer, causing the callstack to be cleared upon the next http request.
					var link = document.createElement('a');
					link.href = ub.ToString();
					this.window.document.body.appendChild(link);
					link.click();
				}
				else {
					this.window.location.href = ub.ToString();
				}
			}
		};

		SysWindow.prototype.Replace = function (url) {
			var ub = url;
			if (!(url instanceof SysUrlBuilder)) {
				ub = new SysUrlBuilder(url);
			}
			this.window.location.replace(ub.ToString());
		};

		SysWindow.prototype.MenuStyle = function () {
			if (SysElement.IsNotNothing(this.window.SaveMenu) && SysElement.IsNotNothing(this.window.LoadMenu)) {
				return SysWindow.MenuStyle.DosMenu;
			}

			for (var i = 0; i < document.styleSheets.length; i++) {
				// In some cases there is no actual stylesheet attached to the ref
				if (SysElement.IsNotNothing(document.styleSheets[i].href)) {
					var sheet = document.styleSheets[i].href.toLowerCase();

					if (sheet.indexOf("_tab/css") > 0 || sheet.indexOf("_tabmnu/css") > 0) {
						return SysWindow.MenuStyle.NewNavigation;
					}
				}
			}

			return SysWindow.MenuStyle.Panel;
		};

		// Local interface
		SysWindow.prototype._Init = function (win) {
			if (SysElement.IsNotNothing(win)) {
				this.window = win;
			}
			else {
				this.window = window;
			}
			this.isMainWindow = SysWindow.IsMainWindow(this.window);
		};

		SysWindow._initialized = true;

	};

	this._Init(win);
}

// private 'static':
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

/// <summary>Used to contain (legacy) IE-specific code.</summary>
/// <field name="sysInputType" type="BrowseInputType">Possible values: 
///     I=Inputfield, B=Browser</field>



//The following would be necessary to have intellisense recognize BrowseInputType as an enum:

//Type.registerNamespace("SysControls");
//SysControls.BrowseInputType = function SysControls$BrowseInputType() {
//    if (arguments.length !== 0) throw Error.parameterCount();
//    throw Error.notImplemented();
//}

//SysControls.BrowseInputType.prototype = {
//    InputField: 1,
//    Browser: 2
//};
//SysControls.BrowseInputType.registerEnum("SysControls.BrowseInputType");


SysColors = {
	ActiveCaption: "#0054E3",
	CaptionText: "#FFFFFF"
};


BrowseInputType = {
	/// <summary>'Enumerator' to specify the type of input used in combination with browsing/searching based on something 
	/// entered by the user.</summary>
	InputField: "I",
	Browser: "B",
	SearchField: "S",
	InputList: "L"
};

function SysGetElementsByTagName(ctl, tagName) {
	return ctl.getElementsByTagName(tagName);
}

function SysGetInnerText(element)
{
	if (element.tagName == "INPUT")
		return $(element).attr("value");
	return $(element).text();
}

function SysGetInnerTextID(elId)
{
	var el = SysGetElement(elId);
	if (el == null)
		return;
	return $(el).text();
}

function SysSetInnerTextID(elId, txtStr)
{
	var el = SysGetElement(elId);
	if (el == null)
		return;
	SysSetInnerText(el, txtStr);
}

function SysSetInnerHtmlID(elId, txtStr)
{
	var el = SysGetElement(elId);
	if (el == null)
		return;
	else if (txtStr == null)
		$(el).empty();
	else
		$(el).html(txtStr);
}

function SysSetInnerText(element, txtStr) {
	var el = new SysElement(element).element;
	if (txtStr == null) {
		txtStr = "";
	}

	if (el.is("input")) {
		el.attr("value", txtStr);
	}
	else {
		el.text(txtStr);
	}
}

function SysFrame(frameName)
{
	return window.frames[frameName];
}

function SysFrameDocument(frame)
{
	return frame.document;
}

// Placing
// -------
function SysLeft(el)
{
	x = window.screenLeft;
	while (el != null)
	{
		x += el.offsetLeft;
		x -= el.scrollLeft;
		el = el.offsetParent;
	}
	return x;
}
function SysTop(el)
{
	y = window.screenTop;
	while (el != null)
	{
		y += el.offsetTop;
		y -= el.scrollTop;
		el = el.offsetParent;
	}
	return y;
}
function SysBottom(el)
{
	return el.offsetHeight + SysTop(el)
}
function SysRight(el)
{
	return el.offsetWidth + SysLeft(el)
}

// Button
// ------
function SysButton(e, url) {
	new SysWindow().Location(url, e);
}

function SysGuid() 
{
	var url = "SysCallBack.aspx?Action=8";
	return SysCallback(url);
}


// Modal dialog
//-------------
function SysShowModal(url, args, width, height, returnFunc, withFrame, ops, hosting, e) {
	/// <summary>Show the supplied page in a modal window.</summary>
	/// <param name="url" type="String|SysUrlBuilder"></param>
	/// <param name="args" type="String|Object|Numeric|Array" optional="true">Can contain any data to pass on to the 
	/// modal window. The data can be retrieved by the client page by reading the dialogArguments property on the 
	/// window object. </param>
	/// <param name="width" type="String" optional="true">A number with optionally 'px' appended.</param>
	/// <param name="height" type="String" optional="true">A number with optionally 'px' appended.</param>
	/// <param name="returnFunc" type="String" optional="true">The function call that will be called when the modal
	/// dialog returns.</param>
	/// <param name="withFrame" type="Boolean" optional="true">Indicate if the page should be displayed inside a frame.
	/// </param>
	/// <param name="ops" type="String" optional="true">Specify additional ornaments (e.g. resizable, scroll) on the 
	/// window. It is a string of key/value pairs, where key and value are separated by a colon (':') and individual 
	/// pairs are separated with a semi-colon (';').</param>
	/// <param name="hosting" type="Boolean" optional="true">Applies only when withFrame is true. If true the frame 
	/// should be the hosting frame.</param>
	/// <param name="e" type="" optional="true"></param>
	/// <returns type="Any">Defined by the contents page, i.e. the page identified by the url argument.</returns>

	var ub = url;
	if (!(url instanceof SysUrlBuilder)) {
		ub = new SysUrlBuilder(url);
	}
	ub.Add("IsModal", 1);

	var rf;
	var re = /px/g;

	var left = '';
	if (width) {
		left = (window.top.screenLeft ? window.top.screenLeft : window.top.screenX) +
			((window.top.document.body.clientWidth - new Number(width.replace(re, ""))) / 2);
		left = "dialogLeft:" + left + ";";
	}
	var top = '';
	if (height) {
		var h = new Number(height.replace(re, ""));
		top = (window.top.screenTop ? window.top.screenTop : window.top.screenY) +
			((window.top.document.body.clientHeight - h) / 2);
		top = "dialogTop:" + top + ";";
	}
	if (returnFunc != null) {
		if (e) {
			rf = new Function('e', 'return ' + returnFunc + '(e)');
		}
		else {
			if (typeof returnFunc === "function") {
				rf = returnFunc;
			}
			else {
				rf = new Function(returnFunc);
			}
		}
	}
	var options = left + top + 'dialogHeight:' + height + ';dialogWidth:' + width + ';status:no;unadorned:yes;help:no;resizable:yes;';
	if (ops != null)
		options = options + ops;
	if (withFrame == null)
		try {
			// Workaround for Safari 5.1+ on Mac OS X 10.7
			// The window.returnValue appears to be undefined sometimes.
			SysDialog.returnValue = undefined;
			var result = window.showModalDialog(ub.ToString(), args, options);
			if (SysDialog.returnValue == undefined) SysDialog.returnValue = result;
		}
		catch (ex) {
			window.alert(SysTerm(15693, 'Pop-up blocked. Please enable pop-ups for this site.'));
		}
	else {
		var u = new SysUrlBuilder(hosting ? 'SysPopupHostingFrame.aspx' : 'SysPopupFrame.aspx');
		u.Add("Page", ub.ToString());
		try {
			// Workaround for Safari 5.1+ on Mac OS X 10.7
			// The window.returnValue appears to be undefined sometimes.
			SysDialog.returnValue = undefined;
			var result = window.showModalDialog(u.ToString(), args, options);
			if (SysDialog.returnValue == undefined) SysDialog.returnValue = result;
		}
		catch (ex) {
			window.alert(SysTerm(15693, 'Pop-up blocked. Please enable pop-ups for this site.'));
		}
	}
	if (rf != null)
		if (e) { rf(e); } else { rf(); }
	return SysDialog.returnValue;
}

function SysFinalizeModal() {
}

// Browser
//----------
function BrowseTableMouseOver(e) {
	var el = SysSrcElement(e);
	if (el && el.tagName == "TD")
		el.parentNode.className = "Selected";
}
function BrowseTableMouseOut(e) {
	var el = SysSrcElement(e);
	if (el && el.tagName == "TD") {
		var p = el.parentNode;
		p.className = ((p.rowIndex % 2) != 0) ? "DataLight" : "DataDark";
	}
}
function BrowseTableClick(e) {
	var el = SysSrcElement(e);
	BrowseTableClicked(e, el.href == 'javascript:{}' ? el.parentNode : el);
}
function BrowseSetFocus(ctlID)
{
	var ctl = SysGetElement(ctlID);
	if (ctl != null)
		ctl.focus();
}
function BrowseTableKeyPress(e) {
}

// ScriptCallback

var sysXmlHttp;
var sysXmlHttpAborted = false;

function SysCallback(url, callbackID, callbackFunction, dataType) {
	/// <summary>Perform an [asynchronous] (AJAX) XMLHTTP request.</summary>
	/// <param name="url" type="String|SysUrlBuilder">Adress / url to invoke.</param>
	/// <param name="callbackID" type="???"></param>
	/// <param name="callbackFunction" type="Function" optional="true">Optionally supply a callback function to handle
	/// an asynchronous call.</param>
	/// <param name="dataType" type="Boolean|String" optional="true">True by default, and the response should be plain text. If 
	/// false the response should be xml. With a string parameter the data type can also be set to "json".</param>
	/// <returns type="String">null, or, if the call is synchronous the reponse text/xml</returns>

	var ret;
	try {
		// url:    URL to invoke
		// params: string object to pass to the remote URL
		if (dataType == null) {
			dataType = true;
		}
		// Add some parameters to the query string
		if (callbackID == null) {
			callbackID = "true";
		}
		var ub = url;
		if (!(url instanceof SysUrlBuilder)) {
			ub = new SysUrlBuilder(url);
		}
		ub.Add("callback", callbackID);
		// Initialize the XmlHttp object
		if (sysXmlHttp) {
			sysXmlHttp.abort();
		}

		// Prepare for a GET statement and synchronous.
		var options = {
			url: ub.ToString(),
			cache: false,
			async: false,
			dataType: "text"
		};
		if (!dataType) {
			options.dataType = "xml";
		}
		if (dataType === "json") {
			options.dataType = "json";
		}
		if (callbackFunction) {
			options.async = true;
			options.success = callbackFunction;
		}
		sysXmlHttp = $.ajax(options);
		if (callbackFunction != null) {
			ret = null;
		}
		else if (dataType) {
			ret = sysXmlHttp.responseText;
			if (dataType === "json") {
				ret = JSON.parse(ret);
			}
		}
		else {
			ret = sysXmlHttp.responseXML;
		}
	}
	catch (e) {
		ret = null;
	}
	return ret;
}

// browser
function SysCancelInputSearch() {
	_sysBrowsing = false;
	SysCallbackAbort();
	if (sysCxMenu !== null) {
		sysCxMenu.hide();
	}
	if (sysCxMenuFrame !== null) {
		sysCxMenuFrame.hide();
	}
	if (InMenuLeft()) {
		parent.prtSetFrameCols();
	}
}
function SysCallbackAbort() {
	if (sysXmlHttp) {
		sysXmlHttp.abort();
	}
	sysXmlHttpAborted = true;
}

// Inputfield Selector

// Holds the id of the element that initiates a search / selection
var sysInput;
// Holds an alternative id, used with BrowseField controls
var sysInputAlt;
// Points to the popup menu (== a table element)
var sysInputMenu;
// Holds the last inputted text, for comparison with new inputted text.
var sysInputText;
// Holds the selected row index.
var sysInputRow;

// No longer in use?
var sysInputXmlHttp;

var sysInputTimer;
var sysInputTextType;
var sysInputRefUrl;
var sysInputKeyInRef;
var sysInputType;
var sysInputExtraQuery = '';
var sysInputParm = '';

function SysInputFindElement(el)
{
	while (el != null && el.className != "ContextMenuItems")
	{
		el = el.parentNode;
	}
	return el;
}
function SysInputHighlight(e) 
{
	var el = SysInputFindElement(SysSrcElement(e));
	if (el != null && el.className == "ContextMenuItems") 
	{
		sysInputRow = $(el).addClass("Selected").attr("rowIndex");
	}
}

function SysInputLowlight(e) {
	if (sysInputRow > -1) {
		var r = sysInputMenu.rows[sysInputRow];
		if (r != null) {
			$(r).removeClass("Selected");
		}
	}
	var el = SysInputFindElement(SysSrcElement(e));
	if (el != null && el.className == "ContextMenuItems") 
	{
		$(el).removeClass("Selected");
	}
}
function SysInputRowHide(row)
{
	var r = sysInputMenu.rows[row];
	if (r != null)
	{
		$(r).removeClass("Selected");
	}
}

function SysInputSelectRow(e,key)
{
	/// <summary>Select a row from a popup menu.</summary>
	/// <param name="e" type="event"></param>
	/// <param name="key" type="number">key code</param>
	/// <returns type="Boolean">true if a row was selected, false otherwise.</returns>

	if (sysInputMenu == null ||
		sysInput == null ||
		(sysCxMenu !== null && sysCxMenu.is(":hidden")) ||
		(key != SysHandleKey.Key.up && key != SysHandleKey.Key.down)
		) {
		return false;
	}
	SysInputLowlight(e);
	if (key == SysHandleKey.Key.up)
	{
		if (sysInputRow > 0) {
			sysInputRow -= 1;
		}
		else {
			sysInputRow = sysInputMenu.rows.length - 1;
		}
	}
	else
	{
		if (sysInputRow < (sysInputMenu.rows.length - 1)) {
			sysInputRow += 1;
		}
		else {
			sysInputRow = 0;
		}
	}
	var r = sysInputMenu.rows[sysInputRow];
	if (r != null)
	{
		$(r).addClass("Selected");
		var c = r.cells[0];
		SysInputSetValue(c);
	}
	return true;
}
function SysInputMouseSelect(e) 
{
	var el = SysSrcElement(e);
	if (el != null)
	{
		SysInputSetValue(el);
		// Necessary for IE8 only
		el.focus();
		SysMenuHide();

		var inputId = sysInput || sysInputAlt;

		var inputElement = SysGetElement(inputId + '_alt');
		if (!inputElement) {
			inputElement = SysGetElement(inputId);
		}

		//The sysinputchanged array works on the actual inputfield or inputfield _alt.
		//Be sure here that the inputfield is used here and not the dropdown control.
		if (inputElement && $(inputElement).data('sysinputchanged')) {
			SysChangeOnBlur(inputElement);
			inputElement.focus();
		}
	}
}

function SysInputSetValue(el) {
	/// <param name="el" type="DOMElement"></param>
	var el2 = $(el.parentNode.firstChild);

	var iv = SysTrim(el2.attr('iv'));
	$("#" + sysInputAlt + "_alt").data('sysinputchanged', true);
	var sin;
	var ic;
	if (sysInputType === BrowseInputType.Browser) {
		sin = $("#" + sysInputAlt);
		var f = 1;
		var refUrl = sysInputRefUrl;
		var bKeyInRef = sysInputKeyInRef;
		ic = el2.attr('ic');
		if (ic == null) {
			ic = iv;
		}
		if (ic == null || ic.length == 0) {
			$("#" + sysInputAlt + "_alt").val('');
			$("#" + sysInputAlt + "_ref").attr('href', '').text('');
		} else {
			if (sin.length > 0) {
				sin.val(iv);
				$(sin).data('sysinputchanged', true);
			}
			var sinAlt = $("#" + sysInputAlt + "_alt");
			if (sinAlt.length > 0) {
				sinAlt.val(SysTrim(ic));
				f++;
			}
			var sinRef = $("#" + sysInputAlt + "_ref");
			if (sinRef.length > 0) {
				if (refUrl.length > 0) {
					sinRef.attr("href", refUrl + SysURLEncode(iv));
				}
				if (bKeyInRef) {
					SysSetInnerText(sinRef, el2.text());
				} else {
					SysSetInnerText(sinRef, ic + " - " + el2.text());
				}
			}
			var validateBrowseFieldExtraResult = sinAlt.data("ValidateBrowseFieldExtraResult");
			if (validateBrowseFieldExtraResult != null && !validateBrowseFieldExtraResult) {
				HandleBrowseFieldSuggestionListClientData(el, sinAlt);
			}
		}
	}
	else if (sysInputType === BrowseInputType.InputField) {
		sin = $("#" + sysInput);
		sin.val(el2.text());
	}
	else if (sysInputType === BrowseInputType.SearchField) {
		iv = el2.attr('iv');
		ic = el2.attr('ic');
		if (ic == null) {
			ic = iv;
		}
		sin = $("#" + sysInput);
		sin.val(SysTrim(ic));
	}
	else {
		Sys.Debug.fail("where does this occur");
		sin = sysInput;
		var si = SysGetElement(sin);
		var sit = si.value;
		var cp = SysGetCaretPosition($(si));
		var li = sit.lastIndexOf(";", cp - 1);
		if (li < 0)
			li = -1;
		var idx = sit.indexOf(";", cp);
		if (idx < 0)
			idx = sit.length;
		var st = sit.substring(0, li);
		if (st != '' && st != null)
			st = st + ";";
		var en = sit.substring(idx, sit.length);
		if (en != '' && en != null)
			en = ";" + en;
		si.value = st + el2.text() + en;
		selRange = si.createTextRange();
		selRange.move("character", cp)
		idx = si.value.indexOf(";", cp);
		if (idx < 0)
			idx = si.value.length;
		selRange.moveEnd("character", i - cp)
		selRange.select();
	}

	// When the user selects an item it will be different from the typed text. If we do not clear this, we can not
	// re-raise the popup on the same entered text. E.g. entering '8' for G/L account will usually give a list with
	// 5+ items. Without clearing this, replacing the text in the input with '8' will not raise a list.
	sysInputText = "";
}

function SysInputBrowseChg(ctl, refurl, bKeyInRef, where, extraResults, textOnly) {
	var sin = SysGetElement(ctl + '_alt');
	if (sin == null)
		sin = SysGetElement(ctl);
	if (sin == null)
		return;
	var sit = sin.value;
	var t;
	if (sit != null && sit != '') {
		// Get the xml (as indicated by the XML param)
		t = SysCallback("SysInputSearch.aspx?XML=1&InputType=" + BrowseInputType.Browser +
			"&Text=" + SysURLEncode(sit) + "&" + where, "", null, false);
	}
	var ok = false;
	if (t != null && t.xml != '') {
		var pos = t.getElementsByTagName("Position").item(0);
		var posID = pos.getAttribute("id");
		var posCode = pos.getAttribute("code");
		var posDescription = pos.getAttribute("description");
		var es = t.getElementsByTagName("Entity");
		var id, desc, er, erv;
		for (i = 0; !ok && i < es.length; i++) {
			var e = es.item(i);
			var code = e.getAttribute("value" + posCode);
			if (code) {
				if (es.length == 1 || SysTrim(sit).toLowerCase() == SysTrim(code).toLowerCase()) {
					id = e.getAttribute("value" + posID);
					desc = e.getAttribute("value" + posDescription);
					if (textOnly && sit.substr(0, code.length) == code) {
						code = sit;
						id = sit;
					}
					SysSetBrowser(ctl, id, code, refurl, desc, bKeyInRef);
					ok = true;
				}
			}
			else {
				id = e.getAttribute("value" + posID);
				if (es.length == 1 || SysTrim(sit).toLowerCase() == SysTrim(id).toLowerCase()) {
					desc = e.getAttribute("value" + posDescription);
					SysSetBrowser(ctl, id, null, refurl, desc, bKeyInRef);
					ok = true;
				}
			}
			if (!ok) {
				// Try match on description as a last resort
				desc = e.getAttribute("value" + posDescription);
				if (SysTrim(sit).toLowerCase() == SysTrim(desc).toLowerCase()) {
					id = e.getAttribute("value" + posID);
					SysSetBrowser(ctl, id, code, refurl, desc, bKeyInRef);
					ok = true;
				}
			}
		}
	}
	if (!ok && textOnly)
		SysSetBrowser(ctl, sit, sit);
	if (ok && extraResults != null && sin.original != sit.toLowerCase()) {
		sin.original = sit.toLowerCase();
		if (extraResults != '') {
			er = extraResults.split(',');
			for (k = 0; k < er.length; k++) {
				erv = er[k].split(':')
				var v = _GetExtraResultValue(e, erv[1]);
				SysSet(erv[0], v);
				SysSet(erv[0] + '_alt', v);
			}
		}
	}
	var el = SysGetElement(ctl + '_ref');
	if (el != null) {
		if (sit == null || sit == '')
			SysSetInnerText(el, '');
		else if (ok)
			$(el).css("color", "");
		else {
			SysSetInnerText(el, sysNoDataTerm);
			$(el).css("color", "red");
			if (el.tagName == 'A')
				el.removeAttribute('href');
			if (extraResults != null && extraResults != '') {
				sin.original = sit.toLowerCase();
				er = extraResults.split(',');
				for (k = 0; k < er.length; k++) {
					erv = er[k].split(':')
					SysSet(erv[0], '');
					SysSet(erv[0] + '_alt', '');
				}
			}
		}
	}
	$(sin).data("sysinputchanged", false);
}

function _GetExtraResultValue(entity, name) {
	/// <summary>For internal use only.</summary>
	/// <param name="entity" type="Object">An entity element from the xml returned by an input search.</param>
	/// <param name="name" type="String"></param>
	/// <returns type="undefined">undefined</returns>
	/// <remarks>The entity object is expected to have name value pairs in the form of attributes: 
	/// name0 value0, name1 value1, ...</remarks>

	var value;
	for (var i = 0; i < entity.attributes.length; i++) {
		var attr = entity.attributes[i];
		if (attr.name.substr(0, 4) === "name" && attr.value === name) {
			var idx = parseInt(attr.name.substr(4));
			if (idx !== NaN) {
				value = entity.getAttribute("value" + idx);
			}
			break;
		}
	}
	return value;
}

var sysValidateBrowseFieldExtraResult;
function SysInputBrowse(e, id, refurl, bKeyInRef, where, inputSearchActions, validateInput) {
	// Disable lookup when browsing is disabled
	if (new SysElement(id).Attribute("data-browsingdisabled") === "true") {
		return;
	}
	// In FF (only) 3.5 F2 comes through to the keyup, even before the popup browser is shown. In the other browsers the keyup
	// is caught in the browser window, unless that was closed before the key was released, which in normal usage is an unlikely
	// scenario.
	var hdl = new SysHandleKey(e);
	if (hdl.IsF2Key()) {
		return;
	}

	sysInputType = BrowseInputType.Browser;
	sysInputRefUrl = refurl;
	sysInputKeyInRef = bKeyInRef;
	sysInputExtraQuery = where;
	var sin = $get(id + '_alt');
	$(sin).data('InputSearchActions', inputSearchActions);
	var validateBrowseFieldExtraResult = $(sin).data("ValidateBrowseFieldExtraResult");
	if (validateBrowseFieldExtraResult != null) {
		sysValidateBrowseFieldExtraResult = validateBrowseFieldExtraResult;
	}
	var sit;
	if (sin != null) {
		sit = sin.value;
		return SysInputSelectDo(e, sin, '', id, sit, validateInput);
	}
	else {
		sin = $get(id);
		sit = sin.value;
		return SysInputSelectDo(e, sin, '', id, sit, validateInput);
	}
}

function SysInputSelect(e, me, browserName) {
	/// <summary>Automatically attached to an input browser field (i.e. an Input control with a BrowserName)</summary>
	/// <param name="e" type="event"></param>
	/// <param name="me" type="DOMElement">The input element for which to browse.</param>
	/// <param name="browserName" type="String">BrowserName</param>
	/// <returns type="undefined|true">only returns true if we need to wait for a callback that will fill the 
	/// browser popup.</returns>
	sysInputType = BrowseInputType.InputField;
	var sit = me.value;
	return SysInputSelectDo(e, me, browserName, null, sit, true);
}

// ExchangeRate Field
// ------------------
function SysExchangeRate(ctlSource, ctlRate, target, ctlDate, enabled, ctlType) {
	var cs = SysGetElement(ctlSource);
	var cr = SysGetElement(ctlRate);
	var cd = SysGetElement(ctlDate);
	var ip = SysGetElement(ctlRate + '_hidden');
	var et = new SysElement(ctlType);
	if (cr != null && cs != null) {
		var url = 'SysCallback.aspx?Action=1&TargetCurrency=' + target + '&Source=' + cs.value;
		if (cd != null) url += '&Date=' + cd.value;
		if (!et.empty) url += '&Type=' + et.Value();
		cr.value = SysCallback(url);
		ip.value = cs.value;
		var disabled = (!enabled || cs.value == target);
		et.SetReadonly(disabled);
		et.SetDisabled(disabled);
		SysSetReadOnly(cr, disabled);
	}
}

// Callback values
function SysCbLoadList(url, setValues, callbackFunction) {
	/// <summary></summary>
	/// <param name="url" type="String|SysUrlBuilder"></param>
	/// <param name="setValues" type=""></param>
	/// <param name="callbackFunction" type="Function"></param>	
	/// <returns type="undefined">undefined</returns>
	function _extractCx(responseText) {
		var cx = $(responseText).filter("table#callbackvalues")[0];
		if (cx != null && setValues != null)
			SysCbSetValues(cx);
		return cx;
	}

	if (callbackFunction && typeof (callbackFunction) === 'function') {
		SysCallback(url, null, function(responseText) {
			var cx = _extractCx(responseText);
			callbackFunction(cx);
		});
	}
	else {
		return _extractCx(SysCallback(url));
	}
}

function SysCbSetValues(cx) {
	if (cx != null) {
		for (var ri = 0; ri < cx.rows.length; ri++) {
			var r = cx.rows[ri];
			var n = $(r).attr("id");
			SysCbSetValueRow(r, n);
		}
	}
}
function SysCbSetValue(cx, id, ctrl) {
	/// <summary>Sets the value for a control based on the value(s) retrieved from the callback object</summary>
	/// <param name="cx" type="String">Contrains return value of the SysCbLoadList</param>
	/// <param name="id" type="String">keyvalue as used in the callback to write the value(s)</param>
	/// <param name="ctrl" type="String">id of the control to set. If ctrl is not provided then parameter id is used as id of the control</param>
	var r = $(cx).find("#" + id)[0];
	if (r != null) {
		var n = ctrl;
		if (ctrl == undefined || ctrl == null) {
			n = $(r).attr("id");
		}
		SysCbSetValueRow(r, n);
	}
}
function SysCbSetValueRow(row, n) {
	var ty = $(row).attr("t");
	if (ty==null || ty=='') {
		var v = SysGetInnerText(row.cells[0]);
		SysSet(n, v);
	}
	else if (ty=='B') {
		var iv = SysGetInnerText(row.cells[0]);
		var ic = SysGetInnerText(row.cells[1]);
		var refurl = SysGetInnerText(row.cells[2]);
		var d = SysGetInnerText(row.cells[3]);
		if (iv == null || iv == '')
			iv = ic;
		var bKeyInRef = false;
		if (ic == null || ic == '') {
			ic = iv;
			bKeyInRef = true;
		}
		SysSetBrowser(n, iv, ic, refurl, d, bKeyInRef);
	}
}
function SysCbGetValue(cx, id)
{
	var r = $(cx).find("#" + id)[0];
	if (r!=null) {
		return SysGetInnerText(r.cells[0]);
	}
}
function SysCbGetFloatValue(cx, id) {
	var r = $(cx).find("#" + id)[0];
	if (r != null) {
		// Return value from callback doesn't use the Exact number notation!
		return parseFloat(SysGetInnerText(r.cells[0]));
	}
}
function SysCbGetIntValue(cx, id) {
	var r = $(cx).find("#" + id)[0];
	if (r != null) {
		// Return value from callback doesn't use the Exact number notation!
		return parseInt(SysGetInnerText(r.cells[0]));
	}
}
function SysSetBrowser(id, idValue, code, refurl, description, bKeyInRef)
{
	var f = 1;
	var r = '';
	if (code == null)
		code = idValue;
	var c = SysGetElement(id);
	if (c != null)
		c.value = idValue;
	c = SysGetElement(id + '_alt');
	if (c != null) {
		var tCode = SysTrim(code);
		if (c.value.toUpperCase() != tCode.toUpperCase())
			c.value = tCode;
	}
	c = SysGetElement(id + '_ref');
	if (c != null) {
		if (!bKeyInRef || code.length == 0)
			SysSetInnerText(c, description);
		else
			SysSetInnerText(c, code + " - " + description);
		if (refurl.length > 0)
			c.href = refurl + SysURLEncode(idValue);
	}
}

function SysFixIE() {
	SysFixPng();
	SysFixOpacity();
}

var rePng = new RegExp("(.*\\.png)");
var reUrl = new RegExp("url\\([\\\"]?(.*\\.png)[\\\"]?\\)");

function SysFixPng() {
	var el = $("*").filter(function (index) {
		return $(this).css("background-image").match(reUrl);
	});
	el.css("filter", function (index) {
		var src = $(this).css("background-image").match(reUrl)[1];
		if ($(this).css("background-repeat") == "no-repeat") {
			return "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "')";
		}
		return "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='scale')";
	});
	el.css("background-image", "url('images/blank.gif')");

	var img = $("img").filter(function (index) {
		return $(this).attr("src").match(rePng);
	});
	img.css("filter", function (index) {
		var src = $(this).attr("src").match(rePng)[1];
		if ($(this).width() > 0) {
			return "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "', sizingMethod='scale')";
		}
		return "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + src + "')";
	});
	img.attr("src", "images/blank.gif");
}

function SysFixOpacity() {
	var w = $("#WaitMessage");
	w.css("opacity", "0.3");

	var e = $("*").filter(function (index) {
		return $(this).css("opacity") < 1;
	});
	e.css("filter", function (index) {
		var o = $(this).css("opacity") * 100;
		return "alpha(opacity=" + o + ")";
	});
}

function SysTimeout(reset) {
	if (InMainWindow() && (window.top.Timeout != undefined)) {
		window.top.Timeout(reset);
	}
}
function InMainWindow() {
	return window.frameElement && (window.frameElement.id.toUpperCase() == 'MAINWINDOW');
}
;/// <reference path="..\base\jquery-1.5.1-vsdoc.js" />
/// <reference path="..\base\MicrosoftAjax.Debug.js" />
/// <reference path="SysIE.js" />
/// <reference path="Dialog.js" />
/// <reference path="SysUserAgent.js" />

// These definitions are deprecated. Use the UserAgent object instead (Uses the Microsoft.Ajax library, which a) in online code
// should no longer be used and b) is flawed anyway.
var IE = (Sys.Browser.agent === Sys.Browser.InternetExplorer);
var IE6 = (IE && Sys.Browser.version < 7);
var IE7 = (IE && Sys.Browser.version >= 7 && Sys.Browser.version < 8);
var IE_LEGACY = (IE6 || IE7);
var IE8 = (IE && Sys.Browser.version >= 8 && Sys.Browser.version < 9);
var IE9 = (IE && Sys.Browser.version >= 9 && Sys.Browser.version < 10);

//// General functions
// -----------------
var sysWasSubmitted = false;
function SysSubmit(wait) {
	if (!sysWasSubmitted) {
		if (wait != false) {
			SysShowWaitMessage(1000);
		}
		sysIsSubmitted = true;
		sysWasSubmitted = true;
		$(document.forms[0]).submit();
	}
}
var sysWaitTimeoutId = null;
function SysShowWaitMessage(waitTime) {
	if (waitTime)
		sysWaitTimeoutId = window.setTimeout("SysWaitMessage(true)", waitTime)
	else
		SysWaitMessage(true);
}
function SysWaitMessage(show) {
	if (sysWaitTimeoutId)
		window.clearTimeout(sysWaitTimeoutId);
	var wm = SysGetElement('WaitMessage');
	if (wm != null) {
		sysWaitMessageGo = show;
		$(wm).css("display", (show ? "block" : "none"));
		$(wm).css("height", "100%");
		if (show)
			window.setTimeout("SysDoAnim()", 50)
	}
}
var sysWaitMessageGo;
var sysBackAndForth = 0;
var sysValue = 0;
function SysDoAnim() {
	var mydiv = SysGetElement('WaitMessageImg');
	var iX2 = mydiv.offsetWidth / 2;
	var iY2 = mydiv.offsetHeight;

	if (sysBackAndForth == 0) {
		if (sysValue >= 150) {
			sysBackAndForth = 1;
		}
		else {
			sysValue += 5;
		}
	}
	else {
		if (sysValue <= -75) {
			sysBackAndForth = 0;
		}
		else {
			sysValue -= 5;
		}
	}
	if (mydiv && mydiv.filters) {
		// TODO: what to do?
		// mydiv.filters.light.clear();
		// mydiv.filters[0].addCone(sysValue, sysValue / 5, 0, iX2, iY2, 255, 255, 100, 50, 180);
	}
	if (sysWaitMessageGo)
		window.setTimeout("SysDoAnim()", 200)
}

var sysIsSubmitted = false;
function SysAuto(id) {
	SysSet('sysFocus', id);
	return SysSubmit(1);
}
function SysLocation(url) {
	sysIsSubmitted = true;
	new SysWindow().Location(url);
}
function SysForward() {
	sysIsSubmitted = true;
	history.forward();
}
function SysBack() {
	sysIsSubmitted = true;
	history.back();
}

function SysAjaxPost(callbackOnSuccess, callbackOnError, asyncOption, sendFormDataToServer) {
	/// <summary>
	///     Perform an asynchronous HTTP (Ajax) request
	/// </summary>
	/// <param name="callbackOnSuccess" type="Function">
	///     A function to be called if the request succeeds. The function gets passed three arguments (data, status, jqXHR).
	/// </param>
	/// <param name="callbackOnError" type="Function">
	///     A function to be called if the request fails. The function receives three arguments(jqXHR, status, errorThrown).
	/// </param>
	/// <param name="asyncOption" type="Boolean">
	///     By default (true), all requests are sent asynchronously.
	/// </param>
	/// <param name="sendFormDataToServer" type=Boolean>
	///     By default (true), all form data are sent to the server. 
	///     Page is being loaded in response to a client postback (IsPostBack property in server side is true)
	/// </param>
	SysWaitMessage(true);
	var form = $(document.forms[0]);
	var url = form.attr('action');
	var formData;

	// The default value for asyncOption is always true unless passing parameter to set asyncOption to false. 
	if (asyncOption === false) {
		asyncOption = false;
	}
	else {
		asyncOption = true;
	}

	if (sendFormDataToServer != null && sendFormDataToServer === false) {
		formData = null;
	}
	else {
		formData = form.serialize();
	}

	//This is to avoid all the javascript files being reloaded so that performance is not affected
	$.ajaxPrefilter(function (options, originalOptions, jqXHR) {
		if (options.dataType == 'script' || originalOptions.dataType == 'script') {
			options.cache = true;
		}
	});

	$.ajax({
		type: "POST",
		url: url,
		async: asyncOption,
		data: formData,
		success: function (data, status, jqXHR) {
			if (callbackOnSuccess !== undefined) {
				callbackOnSuccess(data, status, jqXHR);
			}
			else {
				$('body')
				.empty()
				.html(data);
			}
		}
	}).fail(function (jqXHR, status, errorThrown) {
		if (callbackOnError !== undefined) {
			callbackOnError(jqXHR, status, errorThrown);
		}
	});
}

function SysFocus(id) {
	var el = SysGetElement(id);
	if (el) {
		if (el.tagName == 'INPUT' && el.type == 'radio') {
			var c = document.getElementsByName(id);
			if (c != null) {
				for (i = 0; i < c.length; i++) {
					if (c[i].checked) {
						el = c[i];
						break;
					}
				}
			}
		}
		try {
			if (document.focus) {
				document.focus();
			}
			else {
				window.focus();
			}
			el.focus();
			SysSelect(el);
		}
		catch (ex) { }
	}
}

function SysSelect(el) {
	if (el.tagName != 'INPUT' || el.type == 'radio' || el.type == 'checkbox' || el.type == 'hidden') return;
	try {
		var sel = new SysSelection(el);
		sel.SetSelection();
	}
	catch (ex) { }
}

// Set focus to the first / next element

function SysFocusFirstEl() {
	/// <summary>
	///     Selects the first non-hidden input, select or textarea element. If none found selects the first non-hidden button.
	/// </remarks>
	var els = $(":input").not(":hidden,:disabled,:button").filter(":first");
	if (els.length === 0) {
		els = $(":button").not(":hidden,:disabled").filter(":first");
	}
	if (els.length > 0) {
		els.focus();
	}
}

function SysFocusFirst(doc) {
	if (doc == null)
		doc = document;
	if (doc.forms.length == 0)
		return;
	try {
		var f = doc.forms[0];
		for (var i = 0; i < f.elements.length; i++) {
			var el = f.elements[i];
			if (el.tagName != 'INPUT' || el.type != 'hidden') {
				el.focus();
				return;
			}
		}
	}
	catch (ex) { }
}

function SysFocusNext(el) {
	/// <summary>
	///     Set the focus to the next enabled visible input element, but buttons last.
	/// </summary>
	/// <param name="el">
	///     Accepts DOM element and jQuery object.
	/// </param>
	var els = $(":input").not(":hidden,:disabled,:readonly,[tabindex=-1]");
	var idx = els.index(el);
	var next = els.eq(idx + 1);

	// Start focus from a 'separate thread' to allow autocomplete/autofill to complete its work (if not FF will crash, IE
	// will throw errors).
	window.setTimeout(function() {
		next.focus();
		new SysElement(next).Select();
	}, 1);
}

function SysURLEncode(s) {
	return (encodeURIComponent(s));
}

// Replaces a couple a special character with the correct Html encoding
function SysHtmlEncode(text) {
	if (text) {
		return $('<div/>').text(text).html();
	}
	else {
		return text;
	}
}

// Html encodes a text and also injects break tags for all new lines
function SysHtmlEncodeLines(text) {
	if (text) {
		var lines = text.split(/\r\n|\r|\n/);
		for (var i = 0; i < lines.length; i++) {
			lines[i] = SysHtmlEncode(lines[i]);
		}
		return lines.join('<br/>');
	}
	else {
		return text;
	}
}

function SysXmlEncode(t) {
	var test = /(&)|(<)|(>)/g;

	return t.replace(test, function($0, $1, $2) {
		switch ($0) {
			case '<': return "&lt;"
			case '&': return "&amp;"
			case '>': return "&gt;"
		}
	});
}
function SysButtonDefault(e, id) {
	if (SysGetKey(e) == 13) {
		if (SysSrcElement(e).tagName == 'TEXTAREA') return;
		var b = SysGetElement(id);
		if (b) {
			b.click();
			SysCancelBubble(e);
		}
	}
}

function SysParentBack(e) {
	if (!new SysHandleEvent(e).IsEventStopped() && new SysHandleKey(e).IsEscapeKey())
		parent.GoBack();
}

var sysButtonClose = null;
function SysBackUrl(e, url) {
	if (!new SysHandleEvent(e).IsEventStopped() && new SysHandleKey(e).IsEscapeKey()) {
		if (sysButtonClose == null)
			new SysWindow().Location(url);
		else {
			var b = SysGetElement(sysButtonClose);
			if (b) {
				b.click();
			}
		}
		SysCancelBubble(e);
	}
}

function SysCancelClose(e, el) {
	if (!new SysHandleEvent(e).IsEventStopped() && new SysHandleKey(e).IsEscapeKey()) {
		SysCancelBubble(e);
		SysWindow.CloseDialog(el, window);		
	}
}

function SysClickTag(e) {
	/// <summary>(Re)direct the hyperlink when pressing the space bar. The link is redirected to the MainWindow</summary>
	/// <param name="e" type="DOMEvent"></param>
	/// <returns type="undefined">undefined</returns>
	/// <remarks>Enable using space bar to select/execute links: e.g. in menus, but also in listviews and listviews in browsers.</remarks>
	var el = $(SysSrcElement(e));
	var hdl = new SysHandleKey(e);
	if (hdl.GetKey() === SysHandleKey.Key.space && el.is("a")) {
		// el.click() does not work, el[0].click() does not exist in non-IE, ergo this variant.
		var mw = new SysElement("MainWindow", parent.document);
		if (!Dialog.InDialog(el) && !mw.empty) {
			new SysWindow(mw.GetDomElement().contentWindow).Location(el.attr("href"));
		}
		else {
			// ergo in some popup/browser window. And thus we have no choice 
			if (el[0].click) {
				el[0].click();
			}
			else if (el.click) {
				el.click();
			}
		}
	}
}

function SysEnable(id) {
	/// <summary>Obsolete: not guaranteed to work in all browsers. Use SysElement.SetDisabled instead.</summary>
	var el = SysGetElement(id);
	if (el != null)
		el.disabled = false;
}
function SysDisable(id) {
	/// <summary>Obsolete: not guaranteed to work in all browsers. Use SysElement.SetDisabled instead.</summary>
	var el = SysGetElement(id);
	if (el != null)
		el.disabled = true;
}
function SysSetImage(id, imgs) {
	var img = SysGetElement(id);
	if (img != null) {
		img.src = imgs;
	}
}
function SysSetDisplay(name, style) {
	new SysElement(name).SetDisplay(style);
}

function SysRefreshWholePage() {
	window.top.allowSwitch = true;
	window.top.location.href = 'MenuPortal.aspx';
}

//Check back history
function SysCheckBackHistory() {
	var ne = SysGet('SysNoBack');
	if (ne == null || ne == '') {
		SysSet('SysNoBack', 1);
	}
	else {
		SysForward();
	}
}

// Format number
// -------------
// Events
function SysNumKeyDown(e, el, dec, neg) {
	/// <summary>Handles key down events for numeric input fields. To be used in combination with SysNumKeyPress/></summary>
	/// <param name="e" type="DOMEvent"></param>
	/// <param name="el" type="jQuery">The element that is accepting the input</param>
	/// <param name="dec" type="Number">Number of decimals that should be shown</param>
	/// <param name="neg" type="Boolean">True if the input should accept negative values</param>
	/// <returns type="undefined">undefined</returns>
	if (el.is(":readonly")) {
		return;
	}

	var hdl = new SysHandleKey(e);
	switch (hdl.GetKey()) {
		case SysHandleKey.Key.del:
			{
				_SysNumDelete(el, dec, neg);
				SysCancelBubble(e);
				break;
			}
		case SysHandleKey.Key.backspace:
			{
				_SysNumBackSpace(el, dec, neg);
				SysCancelBubble(e);
				break;
			}
		case SysHandleKey.Key.dot:
			{
				_SysNumStep(el);
				SysCancelBubble(e);
				break;
			}
	}
}


function SysNumKeyPress(e, el, dec, neg, ch) {
	/// <summary>Handles key press events for numeric input fields. To be used in combination with SysNumKeyDown</summary>
	/// <param name="e" type="DOMEvent"></param>
	/// <param name="el" type="jQuery">The element that is accepting the input</param>
	/// <param name="dec" type="Number">Number of decimals that should be shown</param>
	/// <param name="neg" type="Boolean">True if the input should accept negative values</param>
	/// <param name="ch" type="String" optional="true">Optionally supply a character to use as input. If it is
	/// not supplied the character is derived from the keypress event.</param>
	/// <returns type="undefined">undefined</returns>
	if (new SysElement(el).IsReadonly()) {
		return;
	}

	// FF sends control keys (a.o. arrow keys) through to the keypress unlike other browsers
	if (SysProcessKey(e)) {
		if (ch == null) {
			SysCancelBubble(e);
			ch = String.fromCharCode(SysGetKey(e));
		}
		if (ch >= '0' && ch <= '9') {
			_SysNumInput(el, dec, ch, neg);
		}
		else if (ch == sysFormatDecSep)
			_SysNumStep(el);
		else if (ch == '-' && neg)
			_SysNumToggleSign(el, dec);
	}
}

function _GetClipboardData(ev) {
	return (window.clipboardData || ev.clipboardData);
}

function SysNumPaste(e, el, dec, neg) {
	var clipboardData = _GetClipboardData(e);
	if (clipboardData) {
		SysCancelBubble(e);
		var ch = clipboardData.getData("Text");
		if (ch == null) return;
		var sel = new SysSelection(el);
		var v = _SysNumClearSelection(sel);
		if (v != '' && v != null) {
			var pos = sel.GetCaretPosition();
			el.val(v);
			sel.SetCaretPosition(pos);
		}
		var f = SysNumUnFormat(ch, neg);
		var n = neg && (f.substr(0, 1) == '-');
		if (n) f = f.substr(1);
		if (el.val() != '' && el.val() != null)
			ch = f;
		else if (n) {
			SysNumKeyPress(e, el, dec, neg, '-');
			ch = ch.replace(/-/g, '');
		}
		for (var i = 0; i < ch.length; i++) {
			SysNumKeyPress(e, el, dec, neg, ch.charAt(i));
		}
	}
}

function SysNumCut(ev, el, dec) {
	if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
		document.execCommand('Copy');
	}
	var sel = new SysSelection(el);
	var v = _SysNumClearSelection(sel);
	if (v == '') return;
	var pos = sel.GetCaretPosition();
	var num = SysNumUnFormat(v, true);
	v = SysNumFormat(num, dec);
	el.val(v);
	sel.SetCaretPosition(pos);
	$(el).data('sysinputchanged', true)
}

function SysNumUnFormat(val, neg) {
	/// <summary>Strip the formatting from the given value (such as decimal/thousand separators) </summary>
	/// <param name="val" type="String">value to unformat</param>
	/// <param name="neg" type="boolean">Preserve the negativity of the value, i.e. if this is false and val is 
	/// a negative, this is omitted from the result, otherwise a minus sign is prepended to the unformatted value.</param>
	/// <returns type="String">Unformatted value</returns>
	
	if (val == null)
		return '0';
	var t = '';
	var i;
	var n = false;
	var first = true;
	for (i = 0; i < val.length; i++) {
		var c = val.charAt(i)
		if (!first || c != '0') {
			if (c >= '0' && c <= '9') {
				first = false;
				t += c;
			}
			if (neg && (c == '-' || c == '(' || c == ')')) {
				n = true;
			}
		}
	}
	if (t.length == 0) {
		t = '0';
	}
	if (n) {
		t = '-' + t;
	}
	return t;
}

function SysNumFormat(num, dec) {
	var n = (num.substr(0, 1) == '-');
	if (n) {
		num = num.substr(1);
	}
	if (dec == null) {
		dec = 2;
	}
	var v = '';
	var i = num.length - 1;
	var j = 0;
	for (; j < dec && i >= 0; i--, j++) {
		var l = num.substr(i, 1);
		v = l + v;
	}
	if (j < dec || num.length == dec) {
		if (dec == 0) {
			v = '0';
		}
		else {
			for (; j < dec; j++) {
				v = '0' + v;
			}
			v = '0' + sysFormatDecSep + v;
		}
	}
	else {
		if (dec != 0) {
			v = sysFormatDecSep + v;
		}
		var k = 0;
		for (; i >= 0; i--, k++) {
			if (k == 3) {
				v = sysFormatSep + v;
				k = 0;
			}
			v = num.substr(i, 1) + v;
		}
	}
	if (n) {
		return SysFormatNegative(v, sysFormatNegative);
	}
	else {
		return v;
	}
}

function SysFormatNegative(num, fmt) {
	switch (fmt) {
		// (100) 
		case 0:
			return '(' + num + ')';
		// -100
		case 1:
			return '-' + num;
		// - 100
		case 2:
			return '- ' + num;
		// 100-
		case 3:
			return num + '-';
		// 100 -
		case 4:
			return num + ' -';
	}
	return num;
}

function SysNegativeChars(fmt) {
	var nc = new Array();
	nc[0] = 0; nc[1] = 0;
	switch (fmt) {
		// (100)
		case 0:
			{ nc[0] = 1; nc[1] = 1; break; }
		// -100
		case 1:
			{ nc[0] = 1; break; }
		// - 100
		case 2:
			{ nc[0] = 2; break; }
		// 100-
		case 3:
			{ nc[1] = 1; break; }
		// 100 -
		case 4:
			{ nc[1] = 2; break; }
	}
	return nc;
}

function _SysNumStep(el) {
	var v = el.val();
	var c = v.indexOf(sysFormatDecSep);
	if (c >= 0) {
		new SysSelection(el).SetCaretPosition(c + 1);
	}
}

function _SysNumClearSelection(sel) {
	var pos = sel.GetCaretPosition();
	var t = sel.DeleteSelection();

	if (t === null) {
		return null;
	}

	var v = sel.el.val();
	if (v === '' || v === null) {
		sel.el.val('');
		sel.SetCaretPosition(1);
		$(sel.el).data('sysinputchanged', true);
		return '';
	}
	var c = v.indexOf(sysFormatDecSep);
	if (c >= 0 && pos > c) {
		t = t.replace(/-|\)| /g, '');
		for (var length = t.length; length > 0; length--) {
			v += '0';
		}
	}
	return v;
}

function _SysNumDelete(el, dec, neg) {
	var ch;
	var sel = new SysSelection(el);
	var pos = sel.GetCaretPosition();
	var v = _SysNumClearSelection(sel);
	if (v == '') {
		return;
	}
	else if (v == null) {
		v = el.val();
		if (pos == v.length) return;
		ch = v.substr(pos, 1);
		if (ch == sysFormatDecSep || ch == sysFormatSep || ch == ' ' || ch == '(') {
			pos++;
		}
		var c = v.indexOf(sysFormatDecSep);
		v = v.substr(0, pos) + v.substr(pos + 1) + ((c >= 0 && pos > c) ? '0' : '');
	}
	var p = v.length - pos;
	var num = SysNumUnFormat(v, neg);
	v = SysNumFormat(num, dec);
	el.val(v);
	pos = v.length - p;
	ch = v.substr(pos, 1);
	if (ch == sysFormatSep || '( -'.indexOf(ch) >= 0) {
		pos++;
	}
	sel.SetCaretPosition(pos);
	$(el).data('sysinputchanged', true);
}

function _SysNumBackSpace(el, dec, neg) {
	var sel = new SysSelection(el);
	var pos = sel.GetCaretPosition();
	var p;
	var v = _SysNumClearSelection(sel);
	if (v === '') {
		return;
	}
	else if (v === null) {
		if (pos == 0){ 
		return;}
		v = el.val();
		var ch = v.substr(pos - 1, 1);
		if (ch == sysFormatDecSep || ch == sysFormatSep || ch == ' ' || ch == ')') {
			pos--;
		}
		p = v.length - pos;
		var c = v.indexOf(sysFormatDecSep);
		v = v.substr(0, pos - 1) + v.substr(pos);
		if (c >= 0 && pos > c && ch != '-') {
			v += '0';
			p++;
		}
	}
	else {
		p = v.length - pos;
	}
	var num = SysNumUnFormat(v, neg);
	v = SysNumFormat(num, dec);
	el.val(v);
	pos = v.length - p;
	sel.SetCaretPosition(pos);
	$(el).data('sysinputchanged', true);
}

function SysNumZeros(dec) {
	var v = '';
	for (; dec > 0; dec--)
		v += '0';
	return v;
}

function _SysNumToggleSign(el, dec) {
	/// <summary>Toggle the value of el between positive and negative, preserving the format defined by sysFormatNegative 
	/// and the selected text.</summary>
	/// <param name="el" type="jQuery"></param>
	/// <param name="dec" type="number"></param>
	/// <returns type="undefined">undefined</returns>

	var sel = new SysSelection(el);

	var pos = sel.GetCaretPosition(el);
	sel.DeleteSelection();
	var v = el.val();

	var num = SysNumUnFormat(v, true);
	var n = (num.substr(0, 1) == '-');
	if (n)
		num = num.substr(1);
	else {
		if (num == '0' && pos == 0)
			pos++;
		num = '-' + num;
	}
	el.val(SysNumFormat(num, dec));
	sel.SetCaretPosition(pos + (n ? -1 : 1) * SysNegativeChars(sysFormatNegative)[0]);
	$(el).data('sysinputchanged', true);

	sel = null;    
}

function _SysNumInput(el, dec, ch, neg) {
	var sel = new SysSelection(el);
	var pos = sel.GetCaretPosition();
	var v = _SysNumClearSelection(sel);

	if (v === null) {
		v = el.val();
	}
	if (v === '' || v === null) {
		el.val(SysNumFormat(ch + SysNumZeros(dec), dec));
		{
			sel.SetCaretPosition(1);
		}
	}
	else {
		var c = v.indexOf(sysFormatDecSep);
		var add = true;
		var n = false;
		if (c >= 0 && pos > c) {
			if (neg) {
				var f = SysNumUnFormat(v, neg);
				n = (f.substr(0, 1) == '-')
			}
			if (v.length <= pos + (n ? SysNegativeChars(sysFormatNegative)[1] : 0)) {
				return;
			}
			add = false;
		}
		var p = v.length - pos;
		var l = v.substr(0, pos);
		var r;
		if (add) {
			r = v.substr(pos);
		}
		else {
			r = v.substring(pos, c + dec);
			if (n) {
				r += v.substr(v.length - SysNegativeChars(sysFormatNegative)[1]);
			}
		}
		var num = SysNumUnFormat(l + ch + r, neg);
		v = SysNumFormat(num, dec);
		el.val(v);
		pos = v.length - p;
		if (!add) {
			pos++;
		}
		sel.SetCaretPosition(pos);
	}
	$(el).data('sysinputchanged', true);
}

function SysInputEmpty(id) {
	var ctl = new SysElement(id);
	ctl.Value("^mp!y");
	ctl.PostFix("_empty").Show();
	ctl.PostFix("_value").Hide();
}

function SysInputValue(id) {
	var ctl = new SysElement(id);
	ctl.Value("");
	ctl.PostFix("_value").Show();
	ctl.PostFix("_empty").Hide();
}


// Validation
// ----------
function ValidateKey(e, s) {
	var ev = SysEvent(e);
	var key = SysGetKey(ev);
	var c = String.fromCharCode(key);

	if (SysProcessKey(e)) {
		if (!((key <= 31) || (s.indexOf(c) >= 0))) {
			ev.preventDefault();
		}
	}
}

function SysValidateNumber(e, bInteger, bNegative, bThoSep) {
	var s = '1234567890';
	if (!bInteger) { s += sysFormatDecSep; }
	if (bNegative) { s += '-() '; }
	if (bThoSep) { s += sysFormatSep; }
	if (!bInteger && sysFormatDecSep == ',' && key == 46) {
		SysSetKey(e, 44);
	}
	else {
		ValidateKey(e, s);
	}
}

function SysValidateDate(e) {
	var s = '.-/1234567890';
	ValidateKey(e, s);
}

function SysValidateTime(e, b12) {
	var s = ':1234567890';
	if (b12) { s += ' apmAPM'; }
	ValidateKey(e, s);
}

function SysAddClass(el, className) {
	/// <summary>Obsolete: use SysElement.AddClass.</summary>
	if (el.className == null || el.className == '')
		el.className = className;
	else {
		if (el.className.indexOf(className) >= 0)
			return;
		el.className = className + ' ' + el.className;
	}
}
function SysRemoveClass(el, className) {
	/// <summary>Obsolete: use SysElement.RemoveClass.</summary>
	if (el.className == null || el.className == '')
		return;
	var i = el.className.indexOf(className);
	if (i >= 0) {
		el.className = el.className.substring(0, i) + el.className.substr(i + className.length)
		el.className = SysTrim(el.className);
	}
}

function SysResetInvalidFlag(ctl) {
	var c = SysGetElement('InvalidFlag_' + ctl);
	if (c != null)
		$('#InvalidFlag_' + ctl).hide();
	c = SysGetElement(ctl + '_alt');
	if (c == null)
		c = SysGetElement(ctl);
	if (c != null) {
		if (c.className.indexOf('selected') > 0)
			c.className = 'saveHistory Selected';
		else
			c.className = 'saveHistory';
	}
}
function SysSetInvalidFlag(ctl) {
	var c = SysGetElement('InvalidFlag_' + ctl);
	if (c != null)
		$('#InvalidFlag_' + ctl).show();
	c = SysGetElement(ctl + '_alt');
	if (c == null)
		c = SysGetElement(ctl);
	if (c != null) {
		if (c.className.indexOf('selected') > 0)
			c.className = 'saveHistory notValid Selected';
		else
			c.className = 'saveHistory notValid';
	}
}

// format Date
function SysSetDate(parts) {
	switch (sysFormatDate) {
		//DateMonthYear
		case '1':
			{
				return SetDate(parts[2], parts[1], parts[0]);
				break;
			}
		//MonthDateYear
		case '2':
			{
				return SetDate(parts[2], parts[0], parts[1]);
				break;
			}
		//YearMonthDate
		case '3':
			{
				return SetDate(parts[0], parts[1], parts[2]);
				break;
			}
	}
}

function SetDate(y, m, d) {
	if (y >= 0 && y <= 99) {
		if (y < 50)
			y += 2000;
		else
			y += 1900;
	}
	if (y > 9999) y = 9999;
	if (m > 12) m = 12;
	var md = 31;
	switch (m) {
		case 2: 
			{
				md = (SysLeapYear(y)) ? 29 : 28;
				break;
			}
		case 4:
		case 6:
		case 9:
		case 11: 
			{
				md = 30;
				break;
			}
	}
	if (d > md) d = md;

	var dt = new Date();
	//decrease month because offset is 0
	dt.setFullYear(y, m - 1, d);
	dt.setHours(0, 0, 0, 0);
	return dt;
}

function SysLeapYear(y) {
	if (y % 400 == 0)
		return true;
	else if (y % 100 == 0)
		return false;
	else if (y % 4 == 0)
		return true;
	else
		return false;
}

function SysFormatDate(expr) {
	var sdate = expr.getDate();
	if (sdate.toString(10).length == 1) sdate = '0' + sdate;
	var smonth = expr.getMonth() + 1;
	if (smonth.toString(10).length == 1) smonth = '0' + smonth;
	var syear = expr.getFullYear();
	if (syear.toString(10).length == 3) syear = ' ' + syear;
	switch (sysFormatDate) {
		case '1': 
			{
				return (sdate + sysFormatDateSep + smonth + sysFormatDateSep + syear);
				break;
			}
		case '2': 
			{
				return (smonth + sysFormatDateSep + sdate + sysFormatDateSep + syear);
				break;
			}
		case '3': 
			{
				return (syear + sysFormatDateSep + smonth + sysFormatDateSep + sdate);
				break;
			}
	}
}

function SysEmptyDate() {
	var sdate = '  ';
	var smonth = '  ';
	var syear = '    ';
	switch (sysFormatDate) {
		case '1': 
			{
				return (sdate + sysFormatDateSep + smonth + sysFormatDateSep + syear);
				break;
			}
		case '2': 
			{
				return (smonth + sysFormatDateSep + sdate + sysFormatDateSep + syear);
				break;
			}
		case '3': 
			{
				return (syear + sysFormatDateSep + smonth + sysFormatDateSep + sdate);
				break;
			}
	}
}

function SysDateParts(val) {
	//first retrieve values from string
	var parts = new Array();
	var sDt = val, pos, sub
	var separator = sysFormatDateSep;
	if (separator == '.') separator = '\\.';
	pos = sDt.search(separator);
	if (pos != -1) {
		sub = SysStrip(sDt.substr(0, pos));
		parts[0] = parseInt(sub);
		sDt = sDt.substr(pos + 1);
	}
	pos = sDt.search(separator);
	if (pos != -1) {
		sub = SysStrip(sDt.substr(0, pos));
		parts[1] = parseInt(sub);
		sDt = sDt.substr(pos + 1);
	}
	parts[2] = parseInt(SysStrip(sDt));

	for (var i = 0; i < 3; i++) {
		if (isNaN(parts[i])) parts[i] = 0;
	}
	return parts;
}

function SysStrip(val) {
	if (val == null) return '';
	val = val.replace(/ /g, '');
	for (; val.length > 1 && val.substr(0, 1) == '0'; val = val.substr(1)) { }
	return val;
}

function SysUnFormatDate(val) {
	var parts = SysDateParts(val);
	if (parts[0] == 0 || parts[1] == 0 || parts[2] == 0)
		return null;
	else
		return SysSetDate(parts);
}

function _SysMClearSelection(el, sel) {
	/// <summary>Intended for internal use only</summary>
	/// <param name="el" type="jQuery"></param>
	/// <param name="sel" type="SysSelection"></param>
	/// <returns type="boolean">true if a selection was cleared, false otherwise</returns>
	
	var selTxt = sel.GetSelection();
	if (selTxt.length > 0) {
		var pos = sel.GetCaretPosition();
		var value = el.val();
		var v = value.substr(0, pos);
		for (; v.length < selTxt.length + pos; v += '#') { }
		v += value.substr(pos + selTxt.length);
		var mask = sysDateMask;
		v = SysUnmask(mask, v, pos).replace(/#/g, ' ');
		el.val(SysMask(mask, v));
		sel.SetCaretPosition(pos - sysMaskEnd);
		$(el).data('sysinputchanged', true);
		return true;
	}
	return false;
}

var sysMaskPos, sysMaskEnd
function SysUnmask(mask, value, pos) {
	sysMaskEnd = 0;
	sysMaskPos = pos;
	var v = '';
	var maskEnd = true;
	for (var i = mask.length - 1; i >= 0; i--) {
		switch (mask.charAt(i)) {
			// lower case only
			case 'a':
			// upper case only
			case 'A':
			// '0'=48, '9'=57
			case '9':
			// all chars
			case '#':
				{
					v = value.charAt(i) + v;
					if (i < pos) maskEnd = false;
					break;
				}
			default: 
				{
					if (i < pos) {
						sysMaskPos--;
						if (maskEnd) sysMaskEnd++;
					}
					break;
				}
		}
	}
	return v;
}

function SysMask(mask, value) {
	var v = '';
	var j = 0;
	for (var i = 0; i < mask.length; i++) {
		switch (mask.charAt(i)) {
			// lower case only
			case 'a':
			// upper case only
			case 'A':
			// '0'=48, '9'=57
			case '9':
			// all chars
			case '#':
				{
					if (j < value.length)
						v += value.charAt(j);
					else
						v += ' ';
					j++;
					break;
				}
			default:
				{
					v += mask.charAt(i);
					break;
				}
		}
	}
	return v;
}

function SysMKeyDown(e, el) {
	var hdl = new SysHandleKey(e);
	switch (hdl.GetKey()) {
		case SysHandleKey.Key.del:
			{
				_SysMDelete(el);
				SysCancelBubble(e);
				break;
			}
		case SysHandleKey.Key.backspace:
			{
				_SysMBackSpace(el);
				SysCancelBubble(e);
				break;
			}
	}
}

function SysMKeyPress(e, el) {
	/// <summary>Handles keypress events on 'date type' input elements (DateField controls)</summary>
	/// <param name="e" type="DOMEvent">Can be a browser specefic event object or a Sys.UI.DomEvent</param>
	/// <param name="el" type="jQuery">The element upon which the keypress applies</param>
	/// <remarks>if the pressed key is handled propagation of the event is stopped en the default action
	/// is prevented.</remarks>

	if (SysProcessKey(e)) {
		var sel = new SysSelection(el);
		_SysMPassChar(el, SysGetKey(e), sel);
		SysCancelBubble(e);
	}
}

function _SysMDelete(el) {
	/// <summary>Intended for internal use only</summary>
	/// <param name="el" type="jQuery"></param>

	var sel = new SysSelection(el);
	
	if (_SysMClearSelection(el, sel)) {
		return;
	}

	var pos = sel.GetCaretPosition();
	var value = el.val();
	var mask = sysDateMask;
	var v = SysUnmask(mask, value, pos);
	for (; v.charAt(sysMaskPos) == ' '; sysMaskPos++) { }
	v = SysMPutChar(sysMaskPos, ' ', v);
	el.val(SysMask(mask, v));
	sel.SetCaretPosition(pos);
	if (value != el.val()) {
		$(el).data('sysinputchanged', true);
	}
}

function _SysMBackSpace(el) {
	/// <summary>Intended for internal use only</summary>
	/// <param name="el" type="jQuery"></param>

	var sel = new SysSelection(el);
	
	if (_SysMClearSelection(el, sel)) {
		return;
	}
	
	var pos = sel.GetCaretPosition();
	if (pos > 0) {
		var mask = sysDateMask;
		var value = el.val();
		var v = SysUnmask(mask, value, pos);
		v = SysMPutChar(sysMaskPos - 1, ' ', v);
		el.val(SysMask(mask, v));
		sel.SetCaretPosition(pos - sysMaskEnd - 1);
		$(el).data('sysinputchanged', true);
	}
}

function SysMPutChar(pos, ch, value) {
	var l = value.substr(0, pos);
	var r = value.substr(pos + 1);
	return l + ch + r;
}

function _SysMPassChar(el, key, sel, pass) {
	/// <summary>Intended for internal use only</summary>
	/// <param name="el" type="jQuery"></param>
	/// <param name="key" type="number">character code of a pressed key</param>
	/// <param name="sel" type="SysSelection" optional="true"></param>
	/// <param name="pass" type="number" optional="true">should only be assigned from inside this function</param>
	/// <remarks>There is recursion in this function, and when this function is recursively called the pass argument
	/// should be filled.</remarks>
	/// <returns type="number">(new) position of the caret</returns>

	// This is intended as fail safe terminating condition to the recursion inside this function (which could happen
	// if the pos variable does not get increased with every iteration
	var iteration = 1;
	if (typeof pass === "number") {
		iteration = pass;
	}

	_SysMClearSelection(el, sel);
	
	var pos = sel.GetCaretPosition();
	var mask = sysDateMask;
	var value = el.val();
	var ch = String.fromCharCode(key);
	
	// (one of the) recursion terminating condition(s)
	if (pos >= mask.length || iteration > mask.length) {
		return;
	}
	
	var done = true;
	switch (mask.charAt(pos)) {
		// lower case only
		case 'a':
			{
				if (ch >= 'a' && ch <= 'z') {
					el.val(SysMPutChar(pos, ch, value));
					$(el).data('sysinputchanged', true);
					pos += 1;
					sel.SetCaretPosition(pos);
				}
				else done = false;
				break;
			}
		// upper case only
		case 'A':
			{
				if (ch >= 'A' && ch <= 'Z') {
					el.val(SysMPutChar(pos, ch, value));
					$(el).data('sysinputchanged', true);
					pos += 1;
					sel.SetCaretPosition(pos);
				}
				else done = false;
				break;
			}
		// '0'=48, '9'=57
		case '9':
			{
				if (ch >= '0' && ch <= '9') {
					el.val(SysMPutChar(pos, ch, value));
					$(el).data('sysinputchanged', true);
					pos += 1;
					sel.SetCaretPosition(pos);
				}
				else done = false;
				break;
			}
		// all chars
		case '#':
			{
				el.val(SysMPutChar(pos, ch, value));
				$(el).data('sysinputchanged', true);
				pos += 1;
				sel.SetCaretPosition(pos);
				break;
			}
		default:
			{
				pos += 1;
				sel.SetCaretPosition(pos);
				if (mask.charAt(pos - 1) != (('.-/'.indexOf(ch) >= 0) ? sysFormatDateSep : ch)) {
					_SysMPassChar(el, key, sel, iteration + 1);
				}
				break;
			}
	}
	if (!done && '.-/'.indexOf(ch) >= 0) {
		// Try to set cursor right after first matching separator
		for (var i = pos; i < mask.length; i++) {
			if (mask.charAt(i) == sysFormatDateSep) {
				pos = ++i;
				sel.SetCaretPosition(pos);
				break;
			}
		}
	}
	return pos;
}

function SysMCut(ev, el) {
	if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
		document.execCommand('Copy');
	}
	var sel = new SysSelection(el);
	_SysMClearSelection(el, sel);
	if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
		SysCancelBubble(ev);
	}
}

function SysMPaste(e, el) {
	var clipboardData = _GetClipboardData(e);
	if (clipboardData) {
		SysCancelBubble(e);
		var ch = clipboardData.getData("Text");
		if (ch == null) {
			return;
		}

		var sel = new SysSelection(el);
		for (var i = 0; i < ch.length; i++) {
			_SysMPassChar(el, ch.charCodeAt(i), sel);
		} 
	}
}
function SysSetDateCursor(el) {
	if (el.val() == SysMask(sysDateMask, "")) {
		SysSetCaretPosition(el, 0);
	}
}
function SysParseDate(el) {
	var parts = SysDateParts(el.val());
	var zc = 0, i;
	for (i = 0; i < 3; i++) {
		if (parts[i] == 0) zc++
	}

	var dt, d, m, y;
	switch (zc) {
		case 3: 
			{
				break;
			}
		case 2: 
			{
				dt = new Date();
				m = dt.getMonth() + 1;
				y = dt.getFullYear();
				for (i = 0; i < 3; i++) {
					if (parts[i] != 0)
						el.val(SysFormatDate(SetDate(y, m, parts[i])));
				}
				break;
			}
		case 1: 
			{
				dt = new Date();
				y = dt.getFullYear();
				var first = true
				for (i = 0; i < 3; i++) {
					if (parts[i] != 0) {
						if (first ^ (sysFormatDate != '1')) {
							d = i;
						}
						else {
							m = parts[i];
						}
						first = false;
					}
				}
				el.val(SysFormatDate(SetDate(y, m, parts[d])));
				break;
			}
		case 0: 
			{
				el.val(SysFormatDate(SysSetDate(parts)));
				break;
			}
	}
}

// Format number
function SysUnFormatNumber(val) {
	if (val == null)
		return 0;
	var t = '';
	var i;
	var n = false;
	for (i = 0; i < val.length; i++) {
		var c = val.charAt(i)
		if (c >= '0' && c <= '9')
			t += c;
		if (c == sysFormatDecSep)
			t += '.';
		if (c == '-' || c == '(' || c == ')')
			n = true;
	}
	if (t.length == 0)
		return 0;
	if (n)
		t = '-' + t;
	return parseFloat(t);
}
function SysFormatNumber(num, prec) {
	if (prec == null)
		prec = 2;
	return SysFormatNumberEx(num, prec);
}
function SysFormatNumberEx(num, prec) {
	var pow = Math.pow(10, prec);

	if (num == null) num = '0';
	num = num.toString().replace(/\$|\,/g, '');
	if (isNaN(num)) num = "0";

	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * pow + 0.50000000001);
	cents = num % pow;
	num = Math.floor(num / pow).toString();

	var i;
	// set precision
	if (cents < pow) {
		if (cents == 0) {
			cents = "";
		}
		var x = prec - cents.toString().length;
		for (i = 0; i < x; i++) {
			cents = "0" + cents;
		}
	}

	// format
	var sep = sysFormatSep;
	var decsep = sysFormatDecSep;
	for (i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substr(0, num.length - (4 * i + 3)) + sep + num.substr(num.length - (4 * i + 3));
	if (prec > 0)
		num = num + decsep + cents;
	return ((sign) ? num : SysFormatNegative(num, sysFormatNegative));
}

// Dialog handling
// FROM: XXX
// ---------------
// One object tracks the current modal dialog opened from this window.
var SysDialog = new Object()

// Event handler to inhibit Navigator form element 
function SysDialogDeadend() {
	if (SysDialog.win && !SysDialog.win.closed) {
		SysDialog.win.focus();
		return false;
	}
}
// Invoked by onFocus event handler of EVERY frame, return focus to dialog window if it's open.
function SysDialogCheckModal() {
	if (SysDialog.win && !SysDialog.win.closed) {
		SysDialog.win.focus();
	}
}
// Grab all Navigator events that might get through to form elements while dialog is open.
function SysDialogBlockEvents() {
//	window.captureEvents(Event.CLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.FOCUS);
//	window.onclick = SysDialogDeadend;
//	window.onfocus = SysDialogCheckModal;
}
// As dialog closes, restore the main window's original event mechanisms.
function SysDialogUnblockEvents() {
//	window.releaseEvents(Event.CLICK | Event.MOUSEDOWN | Event.MOUSEUP | Event.FOCUS)
//	window.onclick = null;
//	window.onfocus = null;
}

function SysShowModalDialog(url, args, options) {
	if (window.showModalDialog) {
		return window.showModalDialog(url, args, options);
	}
	else {
		alert('Only Internet explorer supports this feature');
		return null;
	}
}

function SysHostingDialog(url, title) {
	/// <summary>Shows a modal dialog which runs on the hosting environment. Refreshes the session after closing the dialog.</summary>
	/// <param name="url" type="String | SysUrlBuilder">The url of the aspx to load into the dialog.</param>
	/// <param name="title" type="String" optional="true"></param>
	/// <returns type="undefined">undefined</returns>
	sysNoBeforeUnloadCheck = true;
	var dialogHandler = function () {
		window.top.allowSwitch = true;
		SysLogOff(-1, 'MenuPortal.aspx');
	};

	var myUrl = url;
	if (!(myUrl instanceof SysUrlBuilder)) {
		myUrl = new SysUrlBuilder(url);
	}
	var options = {
		autoShow: true,
		fullScreen: true,
		contentsPage: myUrl,
		onClose: function () {
			dialogHandler();
		}
	}
	if (SysElement.IsNotNothing(title)) {
		options.titleTerm = title.titleTerm;
		options.titleTermId = title.titleTermId || -1;
		options.titleTermSuffix = title.titleTermSuffix;
		options.titleTermSuffixId = title.titleTermSuffixId || -1;
	}
	new Dialog(options);
}

function SysDisplayDialog(url, title, dialogOptions, reloadCurrentPage) {
	/// <param name="url" type="String | SysUrlBuilder">The url of the aspx to load into the dialog.</param>
	/// <param name="title" type="String" optional="true"></param>
	/// <param name="dialogOptions" optional="true">User provided dialog's options.</param>
	/// <returns type="undefined">undefined</returns>
	sysNoBeforeUnloadCheck = true;
	var dialogHandler = function () {
		window.top.allowSwitch = true;
		if (SysElement.IsNotNothing(reloadCurrentPage) && reloadCurrentPage == 1) {
			SysSubmit();
		}
	};

	var myUrl = url;
	if (!(myUrl instanceof SysUrlBuilder)) {
		myUrl = new SysUrlBuilder(url);
	}

	var dialogFullScreen = true;
	var dialogWidth = 0;
	var dialogHeight = 0;

	if (dialogOptions) {
		dialogFullScreen = dialogOptions.fullScreen;
		dialogWidth = dialogOptions.width;
		dialogHeight = dialogOptions.height;
	}

	var options = {
		autoShow: true,
		fullScreen: dialogFullScreen,
		width: dialogWidth,
		height: dialogHeight,
		contentsPage: myUrl,
		onClose: function () {
			dialogHandler();
		}
	}
	if (SysElement.IsNotNothing(title)) {
		options.titleTerm = title.titleTerm;
		options.titleTermId = title.titleTermId || -1;
		options.titleTermSuffix = title.titleTermSuffix;
		options.titleTermSuffixId = title.titleTermSuffixId || -1;
	}

	var dialog = new Dialog(options);
}

// Header
// ------
function SysShowFavorite(title, url, root) {
	if (root == undefined) { root = ''; }
	var u = root + 'SysFavoriteAddContent.aspx?Description=' + SysURLEncode(title) + "&_URL=" + SysURLEncode(url);
	if (!Dialog.ShowDialog()) {
		SysShowModal(u, null, "500px", "300px", null);
	}
	else {
		new Dialog({ autoShow: true, width: 500, height: 300, contentsPage: new SysUrlBuilder(u)});
	}
}
function SysShowHelp(title, topic, filter, root) {
	if (root == undefined) { root = ''; }
	var ub = new SysUrlBuilder("SysHelp.aspx");
	ub.Add("Title", title);
	ub.Add("Topic", topic);
	ub.Add("TopicFilter", filter);
	SysWindow.OpenInTab(ub);	
}
function SysAddUrl(url, parm) {
	/// <summary>Obsolete: use SysUrlBuilder instead.</summary>
	if (url.indexOf('?') < 0)
		return url + "?" + parm
	else
		return url + "&" + parm
}

// ---- Printing / Exporting ----
var sysPageUrl;
function SysPrintPage(url) {
	var ub = url;
	if (!(url instanceof SysUrlBuilder)) {
		ub = new SysUrlBuilder(url);
	}
	if (!Dialog.ShowDialog()) {
		window.open(ub.ToString(), null, "width=200,height=200,titlebar=no,resizable=yes,scrollbars=yes,status=yes,toolbar=yes,menubar=no,location=no");
	}
	else {
		// Internet Explorer has problems with dialogs that contains PDF documents and that are disposed after a submit.
		// This could be due to the out dated jQuery (UI) and needs to be verified when upgraded.
		new Dialog({ autoShow: true, fullScreen: true, contentsPage: ub, disposeOnClose: !UserAgent.IsIE11OrUp() });
	}
}

var sysExportOptions = false;
var _overrideExportOptions = false;
var sysSubEntity = 0;
function SysPrint() {
	_ShowExportOptions(0, function (vars) {
		if (vars != null) {
			var newAction = new SysUrlBuilder(sysPageUrl);
			newAction.Add("SysDoPrinting", 1);
			if (!_SaveExportSettings(vars)) {
				newAction.Add("ExportLines", vars[0]);
			}
			SysPrintPage(newAction);
		}
	});
}

function SysExport(e) {
	var vars, url;
	_ShowExportOptions(e, function (vars) {
		if (vars != null) {
			var action = window.document.forms[0].action;
			var newAction = new SysUrlBuilder(sysPageUrl);
			newAction.Add("SysDoPrinting", 1);
			newAction.Add("SysExporting", e);
			if (!_SaveExportSettings(vars)) {
				newAction.Add("ExportLines", vars[0]);
				newAction.Add("CsvDelimiter", vars[1]);
			}
			newAction.Add("DataSubscriptionKey", vars[2]);
			window.document.forms[0].action = newAction.ToString();

			var prevCheck = sysNoBeforeUnloadCheck;
			sysNoBeforeUnloadCheck = true;
			SysSubmit(false);
			sysNoBeforeUnloadCheck = prevCheck;
			window.document.forms[0].action = action;
			sysWasSubmitted = false;
		}
	});	
}

function _ShowExportOptions(mode, callback) {
	if ((sysExportOptions && !_overrideExportOptions) || sysSubEntity != 0) {
		var dialogHandler = function (value) {
			if (typeof callback === 'function') {
				callback(value);
			}
		}
		url = new SysUrlBuilder("SysExportOptions.aspx");
		url.Add("Mode", mode);
		url.Add("SubEntity", sysSubEntity);
		var height = 240, width = 300;

		if (!Dialog.ShowDialog()) {
			dialogHandler(SysShowModal(url, null, width + 'px', height + 'px', null, true));
		}
		else {
			var dlg = new Dialog({
				autoShow: true, width: width, height: height,
				contentsPage: url,
				handler: function () {
					dialogHandler(dlg.returnValue);
				}
			});
		}
		return true;
	}
	if (typeof callback === 'function') {
		callback(false);
	}
	return false;
}

function _SaveExportSettings(vars) {
	if (vars[3] === true) {
		var url = new SysUrlBuilder("SysCallback.aspx");
		url.Add("Action", 11);
		// ExportDelimiter = 4, NrOfExportLines = 5, ShowExportOptions = 6
		url.Add("SettingName", "4|5|6");
		url.Add("SettingValue", vars[1] + "|" + vars[0] + "|" + false);
		SysCallback(url);
		_overrideExportOptions = true;
		return true;
	}
	else {
		return false;
	}
}

function SysRss(url) {
	if (!Dialog.ShowDialog()) {
		SysShowModal(url, null, null, null, null, true);
	}
	else {
		SysWindow.OpenInTab(new SysUrlBuilder(url));
	}
}
function SysRssSet(url) {
	window.clipboardData.setData('Text', url)
}

// Values
// ------
function SysSet(ctl, v) {
	/// <summary>Obsolete, use the SysElement object instead.</summary>
	SysSetValue(ctl, v);
}

function SysSetValue(ctl, v) {
	/// <summary>Obsolete, use the SysElement object instead.</summary>
	new SysElement(ctl).Value(v);
}

function SysGetElement(id, doc) {
	/// <summary>Obsolete, use the SysElement object instead.</summary>
	/// <param name="id" type="String">the element's id</param>
	/// <param name="doc" type="DOMElement" optional="true">Optionally a context (preferably a document) can be 
	/// specified in which to search.</param>
	/// <returns> Returns the DOM element. NOTE: this will be a different type of object with a different interface,
	/// depending on the user agent.</returns>
	if (SysElement.IsNothing(id) || (typeof id === 'string' && id == '')) {
		return null;
	}
	
	var el = doc;
	if (doc) {
		if (typeof (doc.nodeName) !== 'string') {
			el = doc.document;
		} 
	}
	return $get(id, el);
}

function SysGet(ctl) {
	/// <summary>Obsolete, use the SysElement object instead.</summary>
	return SysGetValue(ctl);
}

function SysGetValue(ctl) {
	/// <summary>Obsolete, use the SysElement object instead.</summary>
	return new SysElement(ctl).Value();
}

function SysTrim(val) {
	if (val == null)
		return '';
	var t = '';
	var b = false;
	var i, c;
	for (i = 0; i < val.length; i++) {
		c = val.charAt(i);
		b = b || (c != ' ');
		if (b) {
			t += c;
		}
	}
	var s = '';
	b = false;
	for (i = t.length - 1; i >= 0; i--) {
		c = t.charAt(i);
		b = b || (c != ' ');
		if (b) {
			s = c + s;
		}
	}
	return s;
}

function SysChange(ctl, v) {
	var el = new SysElement(ctl);
	el.Value(v);
	el.element.change();
}

// Set Default
// -----------
function SysDef(ctl, v) {
	/// <summary>Obsolete, use the SysElement object instead.</summary>
	new SysElement(ctl).Value(v);
}

function SysDefCheck(ctl, v) {
	/// <summary>Obsolete, use the SysElement object instead.</summary>
	new SysElement(ctl).SetChecked(v);
}

function SysDefCheckList(name, val) {
	/// <summary>Sets/removes the check mark for all elements of input type=checkbox identified by their name 
	/// attribute, based on the values in val (i.e. the elements that have value which is in 'val' will have their 
	/// checkmark set, all others will have their checkmark removed).</summary>
	/// <param name="name" type="String">The name of the elements.</param>
	/// <param name="val" type="String">A comma separated list of (integer) values.</param>
	/// <returns type="undefined">undefined</returns>
	var ctrls = document.getElementsByName(name);
	if (ctrls.length === 0) {
		return;
	}
	var ar;
	if (SysElement.IsNotNothing(val) && val !== '') {
		ar = val.split(',');
	}

	for (i = 0; i < ctrls.length; i++) {
		var checked = false;
		var el = new SysElement(ctrls[i]);
		var v = el.element.val();
		if (SysElement.IsNotNothing(ar)) {
			var j = 0;
			while (!checked && j < ar.length) {
				if(v === ar[j]){
					checked = true;
					break;
				}
				j++;
			}
		}
		el.SetChecked(checked);
	}
}

function SysDefRadioList(ctl, v) {
	/// <summary>Obsolete, use the SysElement object instead.</summary>
	new SysElement(ctl).Value(v);
}

// ConfirmBox
// ----------
function SysAsk(ctl, question) {
	if (!Dialog.ShowDialog()) {
		QuestionDialog.Show(6593, "Confirm", 0, question,
			function () {
				SysSet(ctl, 1);
				SysSubmit();
			}, 0, '',
			function () {
				SysSet(ctl, 0);
				SysSubmit();
			}
		);
	}
	else {
		if (window.confirm(question)) {
			SysSet(ctl, 1);
		}
		else {
			SysSet(ctl, 0);
		}
		SysSubmit();	
	}	
}

// Color Field
// -----------
function SysBrowseColor(ctl, script) {
	var url = new SysUrlBuilder('SysPopupColorPicker.aspx');
	if (!Dialog.ShowDialog()) {
		SysShowModal(url, "", "480px", "400px", function () { DialogHandler(SysDialog.returnValue); }, false);
	}
	else {
		var dlg = new Dialog({ autoShow: true, width: 400, height: 480,
			contentsPage: new SysUrlBuilder('SysPopupColorPicker.aspx'),
			handler: DialogHandler, returnFocus: ctl
		});
	}

	function DialogHandler(value) {
		if (value != null) {
			SysGetElement(ctl).value = value[0];
			SysGetElement(ctl + '_color').style.backgroundColor = value[1];
			SysGetElement(ctl + '_color').title = value[1] + '(' + value[0] + ')';
			if (script != null && script != '') {
				var onc = new Function(script);
				onc();
			}
		}
	}
}

function SysLogOff(division, url, remember) {
	var locUrl = new SysUrlBuilder("Clearsession.aspx");
	locUrl.Add("Date", new Date());
	if (division != null) {
		locUrl.Add("Division", division);
	}
	if (url != null) {
		locUrl.Add("App", url);
	}
	if (remember != null) {
		locUrl.Add("Remember", remember);
	}
	try {
		window.top.name = "";
		window.top.allowSwitch = true;
		// TODO: modify and call new SysWindow().Location()
		window.top.location = locUrl.ToString();
	}
	catch (ex) { }
}

// Button Ask
var _sysDirtyChecks;
var _sysDirtyIDs;
var sysNoBeforeUnloadCheck = false;
function SysDirtyBeforeUnload(e, txt) {
	// We only show a message when we have to do the check, we are navigating away (so no submit) and there are dirty controls
	if (!sysNoBeforeUnloadCheck && !sysIsSubmitted && SysIsDirty()) {
		SysPreventDefault(e, txt);
	}
}
function SysIsDirty() {
	try {
		if (typeof (SysCheckDirty) === 'function' && SysCheckDirty()) {
			return true;
		}
	}
	catch (ex) { }
	if (_sysDirtyIDs != null && _sysDirtyChecks != null) {		
		for (i = 0; i < _sysDirtyIDs.length; i++) {
			var e = SysGetElement(_sysDirtyIDs[i]);
			if (e != null) {
				if (e.tagName == 'INPUT' && (e.type == 'checkbox' || e.type == 'radio')) {
					if (_sysDirtyChecks[i] != e.checked) {
						return true;
					}
				}
				else {
					if (_sysDirtyChecks[i] != e.value) {
						return true;
					}
				}
			}
		}
	}
	return false
}
function SysSaveDirtyValues() {
	if (_sysDirtyIDs != null) {
		_sysDirtyChecks = new Array();
		for (i = 0; i < _sysDirtyIDs.length; i++) {
			var e = SysGetElement(_sysDirtyIDs[i]);
			if (e != null) {
				if (e.tagName == 'INPUT' && (e.type == 'checkbox' || e.type == 'radio'))
					_sysDirtyChecks[i] = e.checked;
				else
					_sysDirtyChecks[i] = e.value;
			}
			else
				_sysDirtyChecks[i] = "";
		}
	}
}
function SysSetDirtyFalse(ctrlid) {
	if (_sysDirtyIDs != null && _sysDirtyChecks != null) {
		for (i = 0; i < _sysDirtyIDs.length; i++) {
			if (_sysDirtyIDs[i] == ctrlid) {
				var e = SysGetElement(_sysDirtyIDs[i]);
				if (e != null) {
					if (e.tagName == 'INPUT' && (e.type == 'checkbox' || e.type == 'radio')) {
						_sysDirtyChecks[i] = e.checked;
					}
					else {
						_sysDirtyChecks[i] = e.value;
					}
				}
				break;
			}
		}
	}
	return false;
}

//This function is used to reset the control value back to original value
function SysResetDirtyValues() {
	if (_sysDirtyIDs != null && _sysDirtyChecks != null) {
		for (i = 0; i < _sysDirtyIDs.length; i++) {
			var e = SysGetElement(_sysDirtyIDs[i]);
			if (e != null) {
				if (e.tagName == 'INPUT' && (e.type == 'checkbox' || e.type == 'radio')) {
					e.checked = _sysDirtyChecks[i];
				}
				else {
					e.value = _sysDirtyChecks[i];
				}
			}
		}
	}
}

//This function is used to determine whether specify elementId is dirty or not. 
function SysFieldIsDirty(elementId) {
	if (_sysDirtyIDs != null && _sysDirtyChecks != null) {
		for (i = 0; i < _sysDirtyIDs.length; i++) {
			var e = SysGetElement(_sysDirtyIDs[i]);
			if (e != null) {
				if (e.id == elementId) {
					if (e.tagName == 'INPUT' && (e.type == 'checkbox' || e.type == 'radio')) {
						if (_sysDirtyChecks[i] != e.checked) {
							return true;
						}
					}
					else {
						if (_sysDirtyChecks[i] != e.value) {
							return true;
						}
					}
				}
			}
		}
	}
	return false;
}


// SysConfirm
function SysConfirm(mode, captionid, caption, width, height, explanation) {
	var url = "SysConfirm.aspx?CSRFToken=" + SysURLEncode(SysGet("CSRFToken"));
	if (mode==undefined)
		mode = 2;
	url += "&Mode=" + SysURLEncode(mode);
	if (mode > 3) {
		if (caption)
			url += "&Caption=" + SysURLEncode(caption);
		if (captionid)
			url += "&CaptionID=" + SysURLEncode(captionid);
		if (explanation)
			url += "&Explanation=" + SysURLEncode(explanation);
	}
	if (!width)
		width = "300px";
	if (!height)
		height = "150px";
	SysShowModal(url, null, width, height);
	if (SysDialog.returnValue == null)
		return false;
	return SysDialog.returnValue;
}

function SysBrowseDate(ctl, linkedCtl, script, enableWeekPicker) {
	var datePickerCtl = $('#' + ctl);
	var keepFocus = true;
	var datePickerElement = getdatePickerElement(); 
	var weekPickerEnabled = (enableWeekPicker != undefined && enableWeekPicker)

	if (!datePickerCtl.data('datepicker')) {
		datePickerCtl.removeClass('hasDatepicker');

		var element = SysGetElement(ctl);
		var curDate = element.value;
		var linkedElement;

		var minimumDate = null;
		var maximumDate = null;
		if (element.attributes.getNamedItem("minimumdate") !== null) {
			minimumDate = element.attributes.getNamedItem("minimumdate").value;
		}
		if (element.attributes.getNamedItem("maximumdate") !== null) {
			maximumDate = element.attributes.getNamedItem("maximumdate").value;
		}

		if (linkedCtl != undefined) {
			linkedElement = SysGetElement(linkedCtl);
		}

		datePickerCtl.datepicker($.extend($.datepicker.regional[sysLanguageCode], {
			duration: 0,
			changeMonth: true,
			changeYear: true,
			showButtonPanel: true,
			showOn: "",
			firstDay: 1,
			showOtherMonths: true,
			showWeek: true,
			selectOtherMonths: true,
			yearRange: '1900:2099',
			maxDate: maximumDate,
			minDate: minimumDate,
			dateFormat: sysDateFormatString.replace('yyyy', 'yy').replace('gg y', 'yy'), //yy - year (four digit)  ,   y - year (two digit), gg y  (Japanese Year)

			onSelect: function (dateValue) {
				//Japanese Date format
				if (sysDateFormatString.indexOf('gg') != -1) {
					var dateParts = dateValue.split('年');
					if (dateParts != null && dateParts.length > 1) {
						dateValue = SysJapaneseYearFormat(dateParts[0]) + '年' + dateParts[1];
						$(this).val(dateValue);
					}
				}

				if (linkedElement != null && linkedElement.value == curDate) {
					linkedElement.value = dateValue;
				}

				if (typeof script === 'function') {
					script.call(element);
				} else if (typeof script === 'string' && script != '') {
					var func = new Function(script);
					func.call(element);
				}
				curDate = dateValue;

			},
			beforeShowDay: function (dateValue) {
				var cssClass = '';
				if (weekPickerEnabled) {
					var weekNumber = $.datepicker.iso8601Week(datePickerCtl.datepicker('getDate'));
					if (weekNumber == $.datepicker.iso8601Week(dateValue)) {
						cssClass = 'ui-datepicker-current-day';
					}
				}
				return [true, cssClass];
			},
			onChangeMonthYear: function () {
				if (weekPickerEnabled) { refreshWeekRangeControl(); }
			},
			onClose: function () {
				if (keepFocus) {
					$(this).focus();
				}

				keepFocus = true;
				if (isIE) {
					hideIEIFrameOverlayDatePicker();
			}
			}
		}));

		datePickerCtl.datepicker('show');
		setZIndex(datePickerElement, 102)

		//adjust top position of datepicker for hidden textbox
		if (datePickerCtl.attr('type') === 'hidden') {
			datePickerElement.addClass('topfix');
		}

		// clear button click event
		var bindCustomEvents = function () {

			// clear button click event - only on day picker
			if (!weekPickerEnabled) {
			datePickerElement.find('.ui-datepicker-close').click(function () {
				datePickerCtl.val(SysEmptyDate());
			});
			}

			//unbind month and year click events, used to Restore input focus after not changing month/year.
			datePickerElement.find('.ui-datepicker-month').attr('onclick', '').unbind('click');
			datePickerElement.find('.ui-datepicker-year').attr('onclick', '').unbind('click');

			//Set iframe properties when selecting other month/year
			var dim = getDimensions(datePickerElement);
			setHeight(getIEIFrameOverlay(), dim.height);
		}

		datePickerCtl.focus(function () {
			keepFocus = true;
			bindCustomEvents();
		});
		datePickerCtl.change(function () {
			bindCustomEvents();
		});

		// fix for moving in different datefields in grid
		datePickerCtl.blur(function () {

			window.setTimeout(function () {
				if ($(document.activeElement).attr('type') == 'text') {

					if (datePickerCtl.data('datepicker')) {
						keepFocus = false;
						datePickerCtl.datepicker('hide');
					}
				}
			}, 1);
		});

		bindCustomEvents();
		
	}
	else {
		datePickerCtl.datepicker('show');
		setZIndex(datePickerElement, 102)
	}

	if (weekPickerEnabled) {
		initWeekRangeControl();
	}

	//Iframe fix for datepicker on top of pdf viewer in IE (bug216820)
	var isIE = function () {
		return (UserAgent.IsIE() || UserAgent.IsIE11OrUp());
	}
	var IEIFrameOverlayDatePicker = function () {
		setZIndex(datePickerElement, 102)

		//Create iframe and container
		var ieIFrameOverlay = getIEIFrameOverlay();
		if (ieIFrameOverlay.length === 0) {
			datePickerElement.wrap('<div class="IEIFrameOverlayContainer"></div>');
			ieIFrameOverlay = $('<iframe frameborder="0" class="IEIFrameOverlayDatePicker" src="about:blank"></iframe>');
			setZIndex(ieIFrameOverlay, 101)
			datePickerElement.after(ieIFrameOverlay);
}

		//Get dimensions and position of datepicker
		var dim = getDimensions(datePickerElement);
		var pos = getPosition(datePickerElement);

		//Set iframe properties
		ieIFrameOverlay.css({
			'height': dim.height,
			'width': dim.width,
			'top': pos.top,
			'left': pos.left,
			'display': 'block'
		});
	};

	if (isIE) {
		IEIFrameOverlayDatePicker();
	}

	function getIEIFrameOverlay() {
		return $('.IEIFrameOverlayDatePicker');
	}
	function getdatePickerElement() {
		return datePickerCtl.datepicker('widget');
	}
	function getDimensions(element) {
		var height = element.outerHeight(true) +1;
		var width = element.outerWidth(true) + 2;
		return { height: height, width: width };
	}
	function getPosition(element) {
		var top = element.offset().top;
		var left = element.offset().left - 1;
		return { top: top, left: left };
	}
	function setHeight(element, newHeight) {
		element.css({ 'height': newHeight });
	}
	function setZIndex(element, newZIndex) {
		element.css('z-index', newZIndex);
	}
	function hideIEIFrameOverlayDatePicker() {
		getIEIFrameOverlay().css('display', 'none');
	}
	function SetWeekSelectionCssClass() {
		//current week div set to active
		$('.ui-datepicker-current-day a').removeClass('ui-state-active');
		$('.ui-datepicker-current-day a').addClass('ui-state-active');
	}
	function ClearDateSetToCurrentDate() {
		//set back to current week when clear button process
		datePickerElement.find('.ui-datepicker-close').click(function () {
			datePickerCtl.datepicker("setDate", new Date());
			datePickerElement.find('.ui-datepicker-today a').click();
		});
	}
	//week selector and week hover control 
	function initWeekRangeControl() {

		SetWeekSelectionCssClass();

		//if user press clear button
		ClearDateSetToCurrentDate();

		//mousemove
		datePickerElement.delegate('tr', 'mousemove', function () {
			$(this).find('td a').addClass('ui-week-hover');
		})
		//mouseleave
		datePickerElement.delegate('tr', 'mouseleave', function () {
			$(this).find('td a').removeClass('ui-week-hover');
		})
	}
	//move to next month remain the week selection
	function refreshWeekRangeControl() {
		window.setTimeout(function () {
			SetWeekSelectionCssClass();
			ClearDateSetToCurrentDate();
		}, 1);
	}
}

// File Field
// ----------
function SysFileFieldToggle(ctl) {
	var tdName = SysGetElement(ctl + '_tdName');
	var tdFile = SysGetElement(ctl + '_tdFile');
	if (tdName.style.display == "none") {
		tdName.style.display = "block"; tdFile.style.display = "none";
	}
	else {
		tdName.style.display = "none"; tdFile.style.display = "block";
	}
}

// Combobox
function SysComboUp(id) {
	var ctl = SysGetElement(id);
	if (ctl != null) {
		if (ctl.selectedIndex > 0)
			ctl.selectedIndex -= 1;
	}
}
function SysComboDown(id) {
	var ctl = SysGetElement(id);
	if (ctl != null) {
		if (ctl.selectedIndex < (ctl.options.length - 1))
			ctl.selectedIndex += 1;
	}
}

// Memo Field
// ----------

// helpers for insert at the cursor
function SysGetCaretPosition(ctl) {
	/// <summary>Obsolete: use the SysSelection object instead.</summary>
	if (window.getSelection) {
		// TODO: fill in for ff
		return ctl[0].selectionStart;
	}
	else {
		var i = ctl.val().replace(/\n/g, '').length + 1;
		var objCaret = document.selection.createRange().duplicate();
		while (objCaret.parentElement() == ctl[0] && objCaret.move("character", 1) == 1) {
			--i;
		}
		return --i;
	}
}
function SysSetCaretPosition(ctl, pos) {
	/// <summary>Obsolete: use the SysSelection object instead.</summary>
	var el = ctl[0];
	if (window.getSelection) {
		// TODO: fill in for ff
		el.selectionStart = pos;
		el.selectionEnd = pos;
	}
	else {
		// Put the cursor in the correct position
		var objSelectedRange = el.createTextRange();
		objSelectedRange.move("character", pos)
		objSelectedRange.select();
	}
}
function _SysInsertAtCaret(ctl, text) {
	/// <remarks>IE only</remarks>
	if (ctl.createTextRange && ctl._caretPos) {
		var caretPos = ctl._caretPos;
		caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == '' ? text + ' ' : text;
	}
	else {
		ctl.focus();
		if (ctl.value.length > 0)
			ctl.value = ctl.value + ' ' + text;
		else
			ctl.value = text;
	}
}

function _SysStoreCaret(ctl) {
	/// <summary>A little trick to store caret positions inside (a.o.) memo fields, which should only be necessary for IE 
	/// browsers.</summary>
	/// <param name="ctl" type="Any" >A 'reference' to a DOM Element</param>
	/// <returns type="undefined">undefined</returns>
	/// <remarks>Use in conjunction with _SysInsertAtCaret</remarks>

	var el = SysElement.GetDomElement(ctl);
	if (el.createTextRange) {
		el._caretPos = document.selection.createRange().duplicate();
	}
}

function SysSetTimestamp(tag) {
	/// <summary>Set a username/date/time indication on the indicated element</summary>
	/// <param name="tag" type="Any">Any 'reference' to DOM Element</param>
	/// <returns type="undefined">undefined</returns>
	var s = SysCallback("SysCallback.aspx?Action=12");
	var el = SysElement.GetDomElement(tag);

	if (window.getSelection) {
		var sel = new SysSelection(el);
		sel.ReplaceSelection(s);
	}
	else if (document.selection) {
		_SysInsertAtCaret(el, s);
	}
	new SysElement(el).Focus();
}

//Memo
function SysPopupMemo(tag, buttonid, imgMemo, imgNoMemo, fullScreen, readOnly, titleTerm, titleTermId) {
	if (readOnly == null) {
		readOnly = 0;
	}

	var rc = SysGetElement(tag);
	var oldtxtlen = rc.value.length;
	var dlgargs = new Array();
	var block = 4096;
	if (oldtxtlen <= block) {
		dlgargs[0] = rc.value;
	}
	else {
		var nParts = Math.floor((oldtxtlen / block) + 1);
		dlgargs[0] = rc.value.substr(0, block);
		for (i = 2; i < nParts; i++) {
			dlgargs[i - 1] = rc.value.substr((i - 1) * block, block);
		}
		dlgargs[nParts - 1] = rc.value.substr((nParts - 1) * block);
	}
	var url = new SysUrlBuilder('SysPopupMemo.aspx');
	url.Add('Mode', readOnly);
	if (!titleTermId) titleTermId = -1;

	if (!Dialog.ShowDialog()) {
		var left,
		top,
		height,
		width;
		if (fullScreen) {
			height = window.screen.availHeight;
			width = window.screen.availWidth;
			top = 0;
			left = 0;
		}
		else {
			height = 300;
			width = 500;
			left = window.screenLeft + 400;
			top = window.screenTop + 200;
		}

		var options = 'dialogTop:' + top + 'px;dialogLeft:' + left + 'px;dialogHeight:' + height + 'px;dialogWidth:' + width + 'px;status:yes;resizable:yes';
		SysDialog.returnValue = undefined;
		var result = window.showModalDialog(url.ToString(), dlgargs, options);
		DialogHandler(result);
	}
	else {
		new Dialog({
			autoShow: true, fullScreen: fullScreen, width: 500, height: 300, contentsPage: url, arguments: dlgargs,
			resizable: true, handler: DialogHandler, returnFocus: buttonid || tag, titleTerm: titleTerm, titleTermId: titleTermId
		});
	}
	function DialogHandler(newText) {
		if(readOnly == 0)
			SysSetMemoValue(tag, newText, buttonid, imgMemo, imgNoMemo);
	}
}

function SysSetMemoValue(memoFieldId, text, buttonId, imgMemo, imgNoMemo) {
	/// <summary>Sets value of memo field.</summary>
	/// <param name="memoFieldId" type="String">Id of memo field control.</param>
	/// <param name="text" type="String">Value that has to be set to memo control.</param>
	/// <param name="buttonId" type="String" optional="true">Id of the element that opens memo popup.
	/// If not specified default is used.</param>
	/// <param name="imgMemo" type="String" optional="true">Id of the element that should be displayed if memo has value.
	/// If not specified default is used.</param>
	/// <param name="imgNoMemo" type="String" optional="true">Id of the element that should be displayed if memo is empty.
	/// If not specified default is used.</param>
	
	var rc = SysGetElement(memoFieldId);
	var dispText = text;
	if (text != null) {
			var oldtext = rc.value;
		rc.value = text;
			if (rc.onchange != null && oldtext != rc.value) {
				$(rc).change();
			}

		var button = SysGetElement(buttonId || 'p' + memoFieldId);
			if (button != null) {
			if (text.length == 0) {
					dispText = 'F2 = ' + SysTerm(25319, 'Edit');
				}
			else if (text.length > 160) {
				dispText = text.substr(0, 157) + '...';
				}

				button.title = dispText;

			var memo = new SysElement(imgMemo || 'i1' + memoFieldId);
			var nomemo = new SysElement(imgNoMemo || 'i2' + memoFieldId);
			if (text.length == 0) {
					memo.Hide();
					memo.element.attr("title", "");
					nomemo.Show();
					nomemo.element.attr("title", dispText);
				}
				else {
					memo.Show();
					memo.element.attr("title", dispText);
					nomemo.Hide();
					nomemo.element.attr("title", "");
				}
			}
		}
	}


function SysSetFullscreen(tag) {
	SysPopupMemo(tag, null, null, null, true);
}

// Image button lists
function SysImageRadioButton(ctl, n) {
	var v = SysGetElement(ctl).value;
	SysGetElement(ctl + v).className = 'unselected';
	SysGetElement(ctl + n).className = 'selected';
	SysGetElement(ctl).value = n;
}

function SysImageToggleButton(ctl, val, img, txt) {
	var c = new SysElement(ctl);
	var ix;
	for (ix = 0; (ix < val.length) && (val[ix] != c.Value()); ix++) { }
	if (ix < val.length - 1) {
		ix++;
	}
	else {
		ix = 0;
	}
	c.Value(val[ix]);
	c.PostFix("_btn").Attribute("title", txt[ix]);
	c.PostFix("_img").Attribute("src", img[ix]);
}
function SysImageToggleButtonReset(ctl, val, img, txt, value) {
	var ix;
	for (ix = 0; (ix < val.length) && (val[ix] != value); ix++) { }
	if (ix >= val.length) {
		// value not found; reset to first item
		ix = 0;
	}
	var c = new SysElement(ctl);
	c.Value(val[ix]);
	c.PostFix("_btn").Attribute("title", txt[ix]);
	c.PostFix("_img").Attribute("src", img[ix]);
}

// Security level control
// ----------------------
function SysSetSecurity(ctl) {
	SysSetValue(ctl, SysGetValue(ctl + '_select'));
}
function SysSetSecuritySelect(ctl) {

	var val = SysGetValue(ctl);

	if (val == null || val == "")
		return;
	if (val == 0 || val == 1 || val == 2 || val == 3 || val == 4 || val == 10 || val == 100 || val == 101 || val == 102)
		SysSetValue(ctl + '_select', val);
	else
		SysSetValue(ctl + '_select', '10');
}

function SysSetReadOnly(el, readOnly) {
	/// <summary>Sets the readonly state and visibility of the supplied element and removes the element from the tabbing 
	/// order.</summary>
	/// <param name="el" type="Any">Any form of DOM element identification.</param>
	/// <param name="readOnly" type=""></param>
	/// <returns type="undefined">undefined</returns>
	if (el) {
		var _el = new SysElement(el);  
		_el.SetReadonly(readOnly);
		if (readOnly) {
			// This is legacy incorrect casing.
			_el.AddClass("readonly");
			_el.TabIndex(-1);
		}
		else {
			_el.RemoveClass("readonly");
			_el.TabIndex(0);
		}
	}
}

function SysStartUrl(e, url) {
	/// <summary>Open a url in the MainWindow</summary>
	/// <param name="e">event object</param>
	SysMenuHide(e);
	var mw = SysWindow.GetWindow('MainWindow');
	if (mw) {
		var ub = url;
		if (!(url instanceof SysUrlBuilder)) {
			ub = new SysUrlBuilder(url);
		}
		mw.src = ub.ToString();
	}
}
// Document Category
// -----------------
function SysDocumentCategory(ctlId, script) {
	var ctl = SysGetElement(ctlId);
	var refCtl = SysGetElement(ctlId + '_ref');
	var url = new SysUrlBuilder('DocCategoryBrowser.aspx');
	if (ctl.value != null && ctl.value.length > 0) {
		url.Add('category', ctl.value)
	}
	if (!Dialog.ShowDialog()) {
		SysShowModal(url, "", "600px", "500px", function() { DialogHandler(SysDialog.returnValue); }, true);
	}
	else {
		var dlg = new Dialog({
			autoShow: true, width: 600, height: 500,
			contentsPage: url,
			handler: DialogHandler
		});
	}

	function DialogHandler(value) {
		if (typeof (value) != "undefined") {
			if (value != null) {
				ctl.value = value[0];
				SysSetInnerText(refCtl, value[1]);
			}
			else {
				ctl.value = '';
				SysSetInnerText(refCtl, '');
			}
		}
		new Function(script)();
	}
}
function SysInputOnFocus(el) {
	el = new SysElement(el);
	if (!el.IsReadonly() && !el.HasClass("Selected")) {
		el.AddClass("Selected");
	}
//	setTimeout(function () {
//		Sys.Debug.trace($(":focus")[0].id);
//	}, 1000);
}
function SysInputOnBlur(el) {
	el = new SysElement(el);
	if (!el.IsReadonly() && el.HasClass("Selected")) {
		el.RemoveClass("Selected");
	}
}

function SysChangeOnBlur(el) {
	if ($(el).data('sysinputchanged')) {
		// Note: the change event is explicitly fired, because some handlers will otherwise not be called. (In particular 
		// events added by the help guidance control.
		$(el).data('sysinputchanged', false);
		new SysElement(el).FireEvent("change");
		
	}
}

// Files
function SysFileName(doc) {
	// TODO: modify and call SysWindow.Location()?
	var pn = doc.location.pathname;
	var li = pn.lastIndexOf('/')
	var dot = pn.lastIndexOf('.')
	if (li < 0 || dot < 0)
		return null;
	return pn.substring(li + 1, dot)
}

// Search framework
// ----------------
function SysSearchSubmit(search, action) {
	SysSet(search + '_SCAction', action);
	SysSubmit();
}

function SysSearchSaveTemplate(search, key, template) {
	SysDialog.search = search;
	var url = new SysUrlBuilder('SysSearchSaveTemplate.aspx')
	url.Add('Code', key);
	url.Add('Template', template);
	if (!Dialog.ShowDialog()) {
		SysShowModal(url.ToString(), null, "360px", "240px", "SysSearchSaveTemplateHandler()");
	}
	else {
		var dlg = new Dialog({
			autoShow: true, width: 360, height: 240,
			contentsPage: url,
			handler: function () {
				SysDialog.returnValue = dlg.returnValue;
				SysSearchSaveTemplateHandler();
			}
		});
	}
}
function SysSearchSaveTemplateHandler() {
	var res = SysDialog.returnValue;
	var search = SysDialog.search;
	if (res != null) {
		SysGetElement(search + '_Template').value = res[1];
		SysGetElement(search + '_SaveName').value = res[2];
		SysGetElement(search + '_SavePrivate').value = res[0];
		SysSearchSubmit(search, 5);
	}
}

function SysSearchSelectAll(cb) {
	$(cb).parents("tr").eq(0).nextAll().each(function() {
		if($(this).hasClass(".SectionHeader")) {
			return false;
		}
		else {
			$(this).children().children(":checkbox:enabled")
			.filter(cb.checked?":not(:checked)":":checked").click();
		}
	});
}
function SysSearchTemplateChange(action) {
	SysSet("SCAction", action);
	SysSubmit();
}
function SysSearchTempSwitch(ctl) {
	var s = SysGetElement(ctl + '_ShowTemp');
	var h = SysGetElement(ctl + '_HideTemp');
	var th = SysGetElement('SeaTemplateHide');
	if (s == null || h == null || th == null)
		return;
	var d = s.style.display;
	s.style.display = h.style.display;
	h.style.display = d;
	if (d == 'none')
		th.value = '1';
	else
		th.value = '0';
}
function SysSearchHidePane(pane) {
	var d = SysGetElement(pane);
	if (d != null)
		d.style.display = "none";
}
function SysSearchShowPane(pane) {
	var d = SysGetElement(pane);
	if (d != null)
		d.style.display = "block";
}
function SysSearchSwitchTab(tab) {
	var t = SysGetElement(tab);
	if (t == null)
		return;
	SysSearchHidePane(sysSearchCurrent);
	SysSearchShowPane(t.value);
	sysSearchCurrent = t.value;
}
var sysSearchCurrent;

// ListBox
// ----------------
function LbxReset(ctl, values) {
	var c = SysGetElement(ctl);
	if (c == null)
		return;
	var i;
	for (i = 0; i < c.options.length; i++) {
		new SysElement(c.options[i]).SetSelected(false);
	}

	var vs = values.split(',');
	for (i = 0; vs.length > i; i++) {
		var val = vs[i];
		for (var j = 0; j < c.options.length; j++) {
			var opt = new SysElement(c.options[j]);
			if (opt.Value() == val)
				opt.SetSelected(true);
		}
	}
}

function LbxMoveUp(boxId) {
	var box = SysGetElement(boxId);
	if (box == null || box.selectedIndex <= 0)
		return;
	var i = box.selectedIndex;
	var o = box.options[i];
	box.options.remove(i);
	LbxAdd(box, o, i - 1);
}
function LbxMoveDown(boxId) {
	var box = SysGetElement(boxId);
	if (box == null || box.selectedIndex < 0 || box.selectedIndex == (box.options.length - 1))
		return;
	var i = box.selectedIndex;
	var o = box.options[i];
	box.options.remove(i);
	LbxAdd(box, o, i + 1);
}
function LbxAdd(box, option, index) {
	if (index != null)
		box.options.add(option, index);
	else
		box.options.add(option);
	LbxStore(box);
}
function LbxRemove(boxId) {
	var box = SysGetElement(boxId);
	if (box == null || box.selectedIndex < 0)
		return;
	var i = box.selectedIndex;
	box.options.remove(i);
	LbxStore(box);
}
//
function LbxStore(box) {
	var boxlist = SysGetElement(box.id + "_List");
	if (boxlist == null)
		return;
	var val = "";
	for (i = 0; i < box.options.length; i++) {
		if (val != "")
			val += ",";
		val += box.options[i].value;
	}
	boxlist.value = val;
}

// DataList
function SysDLAction(val, id) {
	SysSet('BCAction', val);
	SysSet('BCActionID', id);
	SysSubmit();
}
function SysDataList(colFunc, val, url) {
	if (SysColumnDirty(colFunc)) {
		SysSet('BCUrl', url);
		SysSet('BCAction', 9);
		SysSubmit();
	}
}


function SysHideSelect() {
	var sels = document.all.tags('SELECT');
	for (i = 0; i < sels.length; i++) {
		var s = sels[i];
		s.style.visibility = "hidden";
	}
}
function SysShowSelect() {
	var sels = document.all.tags('SELECT');
	for (i = 0; i < sels.length; i++) {
		var s = sels[i];
		s.style.visibility = "visible";
	}
}

function SysSearch(txt) {
	new SysWindow().Location("SysSearch.aspx?txt=" + txt);
}

// --- Selected Row ------------------------------------------
function SysRowGetCellKey(e, el) {
	if (el == null && e != null)
		el = SysSrcElement(e);
	var SysMenuCurrentKey = null;
	while (el != null && SysMenuCurrentKey == null) {
		try { SysMenuCurrentKey = el.getAttribute("cmxkey"); } catch (ex) { }
		el = el.parentNode;
	}
	return SysMenuCurrentKey;
}
function SysRowGetCellDescription(e, el) {
	if (el == null && e != null)
		el = SysSrcElement(e);
	var SysMenuCurrentKey = null;
	while (el != null && SysMenuCurrentKey == null) {
		SysMenuCurrentKey = SysGetInnerText(el);
		el = el.parentNode;
	}
	return SysMenuCurrentKey;
}
function SysRowSelect() {
	sysRowCurrent = sysListPrevRow;
	return sysRowCurrent != null;
}

function SysWizNext(tab) {
	var t = SysGetElement(tab);
	if (t == null) return;
	var v = SysWizGetNext(tab, t.value);
	if (v != null) {
		t.value = v;
		SysTabShow(v);
	}
}
function SysWizGetNext(tab, value) {
	switch (t.value) {
		case "pane0": { return "pane1"; }
	}
}
function SysWizCheckFirst(tab, pane, first) {
	var b = SysGetElement(tab + '_Prev');

	if (b == null)
		return;
	b.disabled = pane == first;
}

function SysWizCheckLast(tab, pane, last) {
	var b = SysGetElement(tab + '_Next');

	if (b == null)
		return;
	b.disabled = pane == last;
}
function SysWizChkButton(tab, first, last) {
	var t = SysGetElement(tab);
	if (t == null) return;
	SysWizCheckFirst(tab, t.value, first);
	SysWizCheckLast(tab, t.value, last);
}

// Menu
function MnuActivate(e) {
	var me = SysSrcElement(e);
	if (me.tagName == 'A')
		me.focus();
}
function MnuOnKeyDown(e) {
	var me = SysSrcElement(e);
	var td = me.parentNode;
	var tr = td.parentNode;
	var tbody = tr.parentNode;
	var table = tbody.parentNode;
	var rIndex = tr.rowIndex;
	var mainTableTD = table.parentNode;
	var mainTableRow = mainTableTD.parentNode;
	var mainTable = mainTableRow.parentNode;

	var tableColumnIndex = mainTableTD.cellIndex;
	var tableRowIndex = mainTableRow.rowIndex;


	var code = SysGetKey(e);

	var result;
	switch (code) {
		case SysHandleKey.Key.left:
			if (tableColumnIndex == 0) {
				tableColumnIndex = mainTableRow.cells.length - 1;
				result = MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex);
			}
			else {
				tableColumnIndex--;
				result = MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex);
			}
			if (!result) {
				while (!MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex) && rIndex > 0) {
					rIndex--;
				}
				if (rIndex == 0) {
					rIndex = 1;
					while (MnuActiveCell(mainTable, tableRowIndex - 1, tableColumnIndex, rIndex) && rIndex > 0) {
						rIndex++;
					}
				}
			}
			SysCancelBubble(e);
			break;
		case SysHandleKey.Key.up:
			if (rIndex == 1) {
				tableRowIndex--;
				if (!MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, 1)) {
					tableRowIndex = mainTable.rows.length - 1;
					if (!MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, 1)) {
						tableRowIndex--;
						MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, 1);
					}
				}
				//get last because of up
				while (MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex)) {
					rIndex++;
				}
			}
			else {
				MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex - 1);
			}
			SysCancelBubble(e);
			break;
		case SysHandleKey.Key.right:
			if (tableColumnIndex == mainTableRow.cells.length - 1) {
				tableColumnIndex = 0;
				result = MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex);
			}
			else {
				tableColumnIndex++;
				result = MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex);
			}
			if (!result) {
				while (!MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex) && rIndex > 0) {
					rIndex--;
				}
				if (rIndex == 0) {
					rIndex = 1;
					while (MnuActiveCell(mainTable, tableRowIndex - 1, tableColumnIndex, rIndex) && rIndex > 0) {
						rIndex++;
					}
				}
			}
			SysCancelBubble(e);
			break;
		case SysHandleKey.Key.down:
			if (!MnuActiveCell(mainTable, tableRowIndex, tableColumnIndex, rIndex + 1)) {
				if (!MnuActiveCell(mainTable, tableRowIndex + 1, tableColumnIndex, 1)) {
					MnuActiveCell(mainTable, 0, tableColumnIndex, 1);
				}
			}
			SysCancelBubble(e);
			break;
		default:
			break;
	}
}

function MnuActiveCell(Table, RowIndex, ColIndex, ItemIndex) {
	if (RowIndex >= 0 && RowIndex < Table.rows.length && ColIndex < Table.rows[RowIndex].cells.length) {
		var innerTable = $("table", Table.rows[RowIndex].cells[ColIndex])[0];
		if (innerTable && innerTable.tagName == "TABLE" & ItemIndex < innerTable.rows.length) {
			var innerElement = innerTable.rows[ItemIndex].cells[0].childNodes[0];
			if (innerElement.tagName == 'A') {
				innerElement.focus();
				return true;
			}
		}
	}
	return false;
}

function SysReplaceRegEx(r) {
	var rr = '';
	for (var i = 0; i < r.length; i++) {
		var c = r.charAt(i);
		switch (c) {
			case '\\':
				{
					rr += '\\\\';
					break;
				}
			case '.':
				{
					rr += '\\.';
					break;
				}
			case '$':
				{
					rr += '\\$';
					break;
				}
			default:
				{
					rr += c;
					break;
				}
		}
	}
	return rr;
}

// ToolBox
var sysToolboxFrom;
var sysToolboxTo;
var sysToolboxPct = 0;
function SysToolBoxClick(me, id, val) {
	SysSet(id, val);
	var t = me.parentNode.parentNode;

	for (i = 0; i < t.rows.length; i++) {
		var tr = t.rows[i];
		if (tr.style.height == '100%') {
			sysToolboxFrom = tr;
		}
	}
	sysToolboxTo = me.nextSibling;
	if (sysToolboxTo == sysToolboxFrom)
		return;
	sysToolboxPct = 0;
	$(sysToolboxTo).show();
	$(sysToolboxFrom).show();
	sysToolboxPct = 0;
	SysToolboxMove()
}
function SysToolboxMoveEnd() {
	$(sysToolboxTo).show().height('100%');

	$(sysToolboxFrom).hide().height('1px');
}
function SysToolboxMove() {
	if (sysToolboxPct == 100) {
		SysToolboxMoveEnd()
	}
	else {
		sysToolboxPct += 20
		sysToolboxTo.style.height = sysToolboxPct + '%';
		try {
			sysToolboxFrom.style.height = (100 - sysToolboxPct) + '%';
		}
		catch (ex) {
			SysToolboxMoveEnd()
			return;
		}
		window.setTimeout("SysToolboxMove()", 25);
	}
}

function SysToolBoxHide(id) {
	var n = SysGetElement(id);
	if (n != null) {
		$(n).hide();
	}
}

function SysSelectMenu(e) {
	if ((e.ctrlKey || e.ctrlLeft) && !(e.altKey || e.altLeft)) {
		var prd = SysGetElement('Products', parent);
		if (prd) {
			try {
				if (prd.contentWindow.HandleKey(SysGetKey(e), e))
					return;
			}
			catch (ex) { }
		}
	}
	else if ((e.ctrlKey || e.ctrlLeft) && (e.altKey || e.altLeft)) {
		prd = SysGetElement('Toolbar', parent);
		if (prd) {
			try {
				if (prd.contentWindow.HandleKey(SysGetKey(e), e))
					return;
			}
			catch (ex) { }
		}
	}

	// Under experimentation 1
	//    var cancel;
	//    var prd = SysGetElement('Products', parent);
	//    if (prd && prd.contentWindow && prd.contentWindow.HandleMenuKey) {
	//        cancel = prd.contentWindow.HandleMenuKey(e);
	//    }
	//   
	//    if (cancel !== false) {
	//        prd = SysGetElement('Toolbar', parent);
	//        if (prd && prd.contentWindow && prd.contentWindow.HandleMenuKey) {
	//            cancel = prd.contentWindow.HandleMenuKey(e);
	//        }
	//    }
	//    return cancel;

	// Under experimentation 2
	//    var fireNext = true;
	//    var i = 0;
	//    while (fireNext !== false && i < window.frames.length) {
	//        if (window.frames[i].contentWindow && window.frames[i].contentWindow.HandleAccessKey) {
	//            fireNext = window.frames[i].contentWindow.HandleAccessKey(e);
	//        }
	//        i++;
	//    }
	//    SysCancelBubble(e);
	//    return fireNext;
}

function SysUndoUpdate(compId, keyID) {
	var url = new SysUrlBuilder('SysUndoData.aspx?action=0&Mode=1&DataKey=' + keyID + '&compId=' + compId);
	var dialogHandler = function (v) {
		if (v) {
			SysSet('BCUndoId', v);
			SysSet('BCAction', 12);
			SysSubmit(1);
		}
	}
	if (!Dialog.ShowDialog()) {
		var v = SysShowModal(url.ToString(), null, '600px', '600px', null, true);
		dialogHandler(v);
	}
	else {
		var dlg = new Dialog({ autoShow: true, width: 600, height: 600,
			contentsPage: url, handler: function () { dialogHandler(dlg.returnValue); }
		});
	}
}

function SysUndoDelete(compId, bcId, parentDataKey) {
	var url = new SysUrlBuilder('SysUndoData.aspx?action=1&Mode=1&compId=' + compId + '&ParentDataKey=' + parentDataKey);
	var handler = function (v) {
		if (v) {
			SysSet('BCUndoId', v);
			SysSet('BCAction', 12);
			SysSet('BCActionID', bcId);
			SysSubmit(1);
		}
	}
	if (!Dialog.ShowDialog()) {
		var v = SysShowModal(url.ToString(), null, '600px', '600px', null, true);
		handler(v);
	}
	else {
		var dlg = new Dialog({ autoShow: true, width: 600, height: 600,
			contentsPage: url, handler: function () { handler(dlg.returnValue); }
		});
	}
}

function ShowAgreementInTab(document, source) {
	var url;
	url = new SysUrlBuilder('SysAttachment.aspx');
	url.Add('ID', document);
	url.Add('Source', source);
	SysWindow.OpenInTab(url);
}

function SysShowDocument(document) {
	var url = new SysUrlBuilder('BoDocumentViewer.aspx');
	url.Add('Document', document);

	new Dialog({
		autoShow: true,
		contentsPage: url,
		width: 900,
		height: $(window).height() * 0.90
	});
}

function SysShowDocumentInTab(document) {
	var url = new SysUrlBuilder('BoDocumentViewer.aspx');
	url.Add('Document', document);
	SysWindow.OpenInTab(url);
}

function SysIsDialogOpened() {
	return $('.ui-dialog').is(':visible');
}

//Adds the 'exclude-overlay' class to iframe for pages that set the page property ExcludeDragAndDropOverlay (mainly used for pages with dropzone)
//Applies only when not in dialog to avoid an issue that causes the next accessed page to unbind the drag and drop
//cause of the added 'exclude-overlay' class. 
function SysExcludeDragAndDropOverlay() {
	if (!Dialog.InDialog(window)) {
		var contentFrame = $('#MainWindow', parent.document);

		if (contentFrame.length == 0) {
			contentFrame = $('#MainWindow');
		}
		contentFrame.addClass('exclude-overlay');
	}
};/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// TabPages

// Tab Strip
// ---------

function SysSetTab(me, ctl, tab) {
	var e = me;
	if (e.parentNode.className == 'tabClear') {
		var t = SysGetElement(ctl);
		t.value = tab;
		var tr = e.parentNode.parentNode.parentNode;
		for (var j = 0; j < tr.cells.length; j++) {
			var td = tr.cells[j];
			for (var i = 0; i < td.childNodes.length; i++) {
				var el = td.childNodes[i]
				if (el.className == 'tabSelected')
				{ el.className = 'tabClear' }
			}
		}
		e.parentNode.className = 'tabSelected';
	}
}
function SysTabHide(pane) {
	var d = SysGetElement(pane);
	if (d != null) {
		d.style.display = "none";
	}
}
function SysTabShow(pane, parentID) {
	var d = SysGetElement(pane);

	if (d == null) d = SysGetElement(parentID + '_' + pane);
	if (d != null) d.style.display = "block";
}
function SysTabSwitch(tab, clientID) {
	var t = SysGetElement(tab);
	if (t == null) return;
	SysTabShow(t.value, clientID)
}

function SysTabDisable(pane) {
	/// <summary>Disable a tab page.</summary>
	/// <param type="String" name="pane">The id of ex:TabPage</param>

	var el = new SysElement('tab_' + pane);
	el.SetDisabled(true);
}

function SysTabEnable(pane) {
	/// <summary>Disable a tab page.</summary>
	/// <param type="String" name="pane">The id of ex:TabPage</param>

	var el = new SysElement('tab_' + pane);
	el.SetDisabled(false);
}

function SysTabActivate(pane) {
	/// <summary>Activate a tab page.</summary>
	/// <param type="String" name="pane">The id of ex:TabPage</param>

	var el = new SysElement('tab_' + pane);
	el.element.click();
}
;/// <reference path="../base/jquery-1.5.1.js" />
/// <reference path="SysElement.js" />
/// <reference path="SysUserAgent.js" />

// Everything that has to do with popup menus

// ---- Context SysMenu ----------------------------------------------------------------

// Note: Show any popup/menu prior to filling it with html to allow for automatic resizing, otherwise (especially the 
// div/container, will retain a minimal height, regardless of the size the table will take).
var sysCxMenu = null;
var sysCxMenuFrame = null;
var sysCxMenuName;
var sysCxRowCurrent = 0;

// TODO: rename to SysMenuKill, sysCxMenu.hide() -> SysMenuHide()
function SysMenuHide() {
	/// <summary>Hides the visible popup menu</summary>
	/// <returns type="undefined">undefined</returns>

	_sysBrowsing = false;

	//Just kill it to avoid positioning problems 
	try {
		if (sysCxMenu !== null) {
			if (InMenuLeft()) {
				parent.prtSetFrameCols();
			}

			var menu = new SysElement(sysCxMenu);
			menu.DetachEvent("onkeydown", SysMenuOnKeyDown);
			menu.DetachEvent("onmouseout", _DoValidateMouseOut);
			menu = null;

			sysInputMenu = null;

			document.body.removeChild(sysCxMenu[0]);
			sysCxMenu = null;

			if (sysCxMenuFrame !== null) {
				document.body.removeChild(sysCxMenuFrame[0]);
				sysCxMenuFrame = null;
			} 
		}
	}
	catch (ex) {
		alert('Unable to handle SysMenuHide properly.');
	}
}
function SysMenuToggle(e, SysMenuName, ctlID) {
	if (sysCxMenu) {
		SysMenuHide();
	}
	else {
		SysMenuShouldShow(e, SysMenuName, null, ctlID);
	}
}
function SysMenuShouldShow(e, SysMenuName, func, ctlID) {
	if ((!e || !e.ctrlKey) && SysElement.IsNotNothing(window.parent) && top === window.parent.parent) {
		SysMenuShowW(SysMenuName, func, ctlID, e);
		SysCancelBubble(e);
	}
}
function SysMenuShow(SysMenuName, func, ctlID) {
	/// <summary>Obsolete, not multi-browser</summary>
	SysMenuShowW(SysMenuName, func, ctlID, window.event)
}

function _DoValidateMouseOut(e) {
	ValidateMouseOut(e, sysCxMenu, 0);
}

function ValidateMouseOut(e, ctlMenu, topMargin) {
	/// <summary>Determine if the mouse pointer falls outside the boundaries of a popped up menu. If so, the popup is 
	/// hidden.</summary>
	/// <param name="e" type="DOMEvent"></param>
	/// <param name="ctlMenu" type="jQuery"></param>
	/// <param name="topMargin" type="Number"></param>
	/// <returns type="undefined">undefined</returns>

	// has it really exceeded the bounds and not just a propagation effect? (assuming the hide still deletes the 
	// object).
	if (SysElement.IsNothing(ctlMenu)) {
		return;
	}

	var xScrollLeft = $(document.body).scrollLeft() || $(document.documentElement).scrollLeft();
	var yScrollTop = $(document.body).scrollTop() || $(document.documentElement).scrollTop();
	var xMouse = e.clientX + xScrollLeft;
	var yMouse = e.clientY + yScrollTop;
	var x = ctlMenu.offset().left;
	var y = ctlMenu.offset().top;
	var w = ctlMenu.width();
	var h = ctlMenu.height();

	if (xMouse <= x) SysMenuHide();
	if (xMouse >= (x + w)) SysMenuHide();

	if (yMouse <= (y - topMargin)) SysMenuHide();
	if (yMouse >= (y + h)) SysMenuHide();
}

function _CreateMenuContainer(container, frame, id, withEvents) {
	var create = container === null;

	if (create) {
		var div = document.createElement("div");
		container = $(div);
		container.attr("id", "cnt" + id);
	}

	var scrollLeft = 0;
	var scrollTop = 0;
	if (IE6) {
		var body = $(document.body);
		var docElement = $(document.documentElement);
		var scrTopHtml = docElement.scrollTop();
		var scrTopBody = body.scrollTop();
		scrollLeft = body.scrollLeft() + docElement.scrollLeft() + 1;
		scrollTop = scrTopHtml + 1;
	}

	container.css({
		'position': 'absolute',
		'display': 'none',
		'padding': '0px',
		'zIndex': 100,
		'left': scrollLeft,
		'top': scrollTop
	});
	// Part of an IE specific fix for dropdowns being displayed underneath iframes with PDF
	if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
		if (create) {
			var iframe = document.createElement("iframe");
			frame = $(iframe);
			frame.attr({ "id": "fra" + id, "src": "empty.html" });
		}
		frame.css({
			'position': 'absolute',
			'display': 'none',
			'zIndex': 50,
			'border': 0,
			'margin': 0,
			'left': scrollLeft,
			'top': scrollTop
		});
	}
	if (create) {
		document.body.appendChild(div);
		if (frame !== null) {
			document.body.appendChild(iframe);
		}

		if (withEvents === true) {
			var divEl = new SysElement(div);
			divEl.AttachEvent("onkeydown", SysMenuOnKeyDown);
			divEl.AttachEvent("onmouseout", _DoValidateMouseOut);
		}

		return { container: container, frame: frame };
	}
	else {
		return null;
	}
}

function SysMenuShowW(SysMenuName, func, ctlID, e) {
	SysMenuHide();

	if (e != null) {
		if (e.ctrlKey)
			return;
	}

	var obj = _CreateMenuContainer(sysCxMenu, sysCxMenuFrame, "PopupMenu", true);
	if (obj !== null) {
		sysCxMenu = obj.container;
		sysCxMenuFrame = obj.frame;
	}

	if (func != null) {
		var f = new Function('return ' + func);
		if (!f()) {
			SysMenuHide();
			return;
		}
	}
	var body = SysGetElement(SysMenuName + '_MenuDiv');
	if (body == null) {
		SysMenuHide();
		return false;
	}

	_sysBrowsing = true;
	sysCxMenu.show();
	var sHTML = $(body).html();

	sysCxMenu.html(sHTML);

	var mnu = new SysElement(SysMenuName + '_Menu', sysCxMenu[0]);
	if (mnu.empty === false) {
		var h = mnu.TotalHeight();
		var w = mnu.TotalWidth();
		var coords;

		if (ctlID == null) {
			coords = PopupCoordinates(e, 0, 0, w, h);
		}
		else {
			var par = $(SysGetElement(ctlID));
			if (w < par.width()) {
				w = par.width();
				mnu.Width(w);
			}
			coords = PopupCoordinates(e, 0, 0, w, h, par);
		}

		sysCxMenu.css({
			'left': coords.left,
			'top': coords.top,
			'width': w,
			'height': h
		});

		if (sysCxMenuFrame !== null) {
			sysCxMenuFrame.css({
				'left': coords.left,
				'top': coords.top,
				'width': w + 1,
				'height': h + 1
			});
		}

		if (InMenuLeft()) {
			parent.prtBroadenFrameCols(w);
		}

		sysCxRowCurrent = -1;
		if (sysCxMenuFrame !== null) {
			sysCxMenuFrame.show();
		}
		mnu.Focus();
	}

	sysCxMenuName = SysMenuName;
	if (e) {
		e.cancelBubble = true;
		e.returnValue = false;
	}

	return true;
}

function SysMenuOnKeyDown(e) {
	var menu = $(SysSrcElement(e));
	if (!menu.hasClass("ContextMenu")) {
		menu = menu.parents(".ContextMenu");
	}
	if (menu.length > 0) {
		var tb = menu[0];
		if (tb != null) {
			var hdl = new SysHandleKey(e);
			var keyCode = hdl.GetKey();
			
			switch (keyCode) {
				case SysHandleKey.Key.up:
					if (sysCxRowCurrent >= 0) {
						for (i = sysCxRowCurrent - 1; i >= 0; i--) {
							if (tb.rows[i].className == "ContextMenuItems") {
								break;
							}
						}
					}
					break;
				case SysHandleKey.Key.down:
					if (sysCxRowCurrent < tb.rows.length - 1) {
						for (i = sysCxRowCurrent + 1; i < tb.rows.length; i++) {
							if (tb.rows[i].className == "ContextMenuItems") {
								break;
							}
						}
					}
					break;
				case SysHandleKey.Key.tab:
				case SysHandleKey.Key.enter:
					$(tb.rows[sysCxRowCurrent]).click();
					break;
				case SysHandleKey.Key.end:
					for (i = tb.rows.length - 1; i > 0; i--) {
						if (tb.rows[i].className == "ContextMenuItems") {
							break;
						}
					}
					break;
				case SysHandleKey.Key.home:
					for (i = 0; i < tb.rows.length; i++) {
						if (tb.rows[i].className == "ContextMenuItems") {
							break;
						}
					}
					break;
				//find the one(s) beginning with typed character
				default:
					var key;
					var found = 0;
					if (keyCode >= 96 && keyCode <= 105) {
						// numbers 0 .. 9 on numeric keypad
						key = keyCode - 48;
					} else if (keyCode >= 106 && keyCode <= 111) {
						// "*", "/", "-", "+", "." on numeric keypad
						key = keyCode - 64;
					} else {
						key = keyCode;
					}
					for (i = sysCxRowCurrent + 1; i < tb.rows.length; i++) {
						if (tb.rows[i].className == "ContextMenuItems" &&
							SysGetInnerText(tb.rows[i].children[1]).toUpperCase().substring(0, 1).charCodeAt(0) == key) {
							found = 1;
							break;
						}
					}
					if (!found) {
						for (i = 0; i < sysCxRowCurrent && i < tb.rows.length; i++) {
							if (tb.rows[i].className == "ContextMenuItems" &&
								SysGetInnerText(tb.rows[i].children[1]).toUpperCase().substring(0, 1).charCodeAt(0) == key) {
								break;
							}
						}
					}
					break;
			}
		}
		SysCancelBubble(e);
	}
}

function SysMenuFindElement(el) {
	while (el != null && el.className != "ContextMenuItems") {
		el = el.parentNode;
	}
	return el;
}

function SysMenuSwitchColor(item) {
	if (item != null) {
		var el = $(item);
		var clr = el.css("backgroundColor");
		el.css("backgroundColor", el.css("color"));
		el.css("color", clr);
	}
}

function SysMenuCmxClick(el, val, url) {
	if (url != null && url != '') {
		SysLocation(url);
	}
}

function SysMenuClick(e, val, url) {
	SysMenuHide();
	if (val != '')
		SysSetValue(sysCxMenuName, val);

	if (url != null && url != '') {
		var attValue = SysRowGetCellKey(e, sysRowCurrent);
		if (attValue == null) {
			var p = sysRowCurrent.previousSibling;
			while (p != null && sysRowCurrent.className == p.className) {
				attValue = SysRowGetCellKey(e, p);
				p = p.previousSibling;
			}
		}
		if (attValue != null)
			SysLocation(url + attValue);
	}
}

var sysCmxMenu;
function SysMenuPage(val, url) {
	SysMenuHide();
	var txt, url;
	if (val == '1') {
		txt = SysGetInnerText(sysCmxMenu);
		url = new SysUrlBuilder('HlpGlossaryPopUp.aspx');
		url.Add('useterm', txt);
		if (!Dialog.ShowDialog()) {
			SysShowModal(url, "", "300px", "250px", null, 1)
		} else {
			new Dialog({ autoShow: true, width: 300, height: 250, contentsPage: url });
		}
	}
	else if (val == '2')
		SysPrint()
	else if (val == '3')
		SysExport(2)
	else if (val == '4')
		SysExport(1)
	else if (val == '5') {
		txt = SysGetInnerText(sysCmxMenu);
		SysSearch(txt)
	}
}

// Typically used with menus inside a browser
function SysInputSelectDo(e, me, browserName, altid, sit, validateInput) {
	/// <summary>Do a selection from a browser/selection popup: if it does not exist it is created.</summary>
	/// <param name="e" type="event"></param>
	/// <param name="me" type="DOMElement">The input element for which to browse.</param>
	/// <param name="browserName" type="String">Browser name</param>
	/// <param name="altid" type="String"></param>
	/// <param name="sit" type="String">The search input text to look for.</param>
	/// <param name="validateInput" type="Boolean">Whether or not input is validated towards the quickselect list.</param>
	/// <returns type="undefined|true">only returns true if we need to wait for a callback that will fill the 
	/// browser popup.</returns>

	if (SysElement.IsNothing(e)) {
		// Nothing we can do
		sysInputText = "";
		return;
	}

	var hdl = new SysHandleKey(e);
	var key = hdl.GetKey();
	if (SysInputSelectRow(e, key)) {
		SysStopPropagation(e);
		sysInputText = "";
		return;
	}

	if (key == SysHandleKey.Key.esc || key == SysHandleKey.Key.enter || key == SysHandleKey.Key.left ||
		key == SysHandleKey.Key.right || key == SysHandleKey.Key.up || key == SysHandleKey.Key.down) {
		SysCancelInputSearch();
		sysInputText = "";
		return;
	}

	if (hdl.IsCtrlKey() || me.value == null || me.value == "" || key == SysHandleKey.Key.tab) {
		sysInputText = "";
		return;
	}

	// We're also catching the controls keys themselves (no need + unwanted side effects to let them through).
	if (key === SysHandleKey.Key.ctrl || key === SysHandleKey.Key.shift || key === SysHandleKey.Key.alt) {
		return;
	}

	if (sysInputText != sit || me.id != sysInput) {
		sysInputRow = -1;
		sysInputText = sit;
		sysInput = me.id;
		sysInputAlt = altid;
		sysInputTextType = browserName;

		sysXmlHttpAborted = false;
		if (sysInputTimer != null) {
			window.clearTimeout(sysInputTimer);
		}
		sysInputTimer = window.setTimeout(function () { SysInputTimerHandler(validateInput); }, 300);
		return true;
	}
	else {
		// E.g. menu will not have been created when waiting for a search callback
		if (sysCxMenu !== null) {
			SysInputHandle();
		}
	}
	SysStopPropagation(e);
	SysPreventDefault(e);
}

function SysInputTimerHandler(validateInput) {
	if (!sysXmlHttpAborted) {
		var url = new SysUrlBuilder("SysInputSearch.aspx");
		var urlString;

		url.Add("InputType", sysInputType);
		url.Add("Text", sysInputText);
		if (sysValidateBrowseFieldExtraResult != null && !sysValidateBrowseFieldExtraResult) {
			url.Add("ValidateBrowseFieldExtraResult", sysValidateBrowseFieldExtraResult);
			sysValidateBrowseFieldExtraResult = null;
		}

		if (sysInputType == 'B') {
			if (!validateInput) {
				url.Add("ValidateInput", 0);
			}
			urlString = url.ToString() + "&" + sysInputExtraQuery;
		}
		else {
			url.Add("Name", sysInputTextType);
			url.Add("eq", sysInputExtraQuery + sysInputParm);
			urlString = url.ToString();
		}
		SysCallback(urlString, "", _SysInputCallback);
	}
}

// Maintain the 'browsing' state: i.e. when user input is directed at a (quicksearch) popup this will in a number of 
// cases lead to change events (the focus leaves the input box to the popup with search results, causing 'premature' 
// change events). This flag can be used in the change event to test for that state.
var _sysBrowsing = false; 

// callback function for ajax calls (e.g. results of a search)
function _SysInputCallback() {
	//
	//This line of code was introduced in 793 and causes some very strange timing issues
	//So it's removed for the time being. Have to figure out what is was needed for and if
	//it has to be solved differently
	// call is being handled, reset the input search string
	//sysInputText = "";
	//
	if (!sysXmlHttpAborted && sysXmlHttp.readyState == 4) {
		var body = sysXmlHttp.responseText;
		body = body.replace(/\r\n/g, '');
		if (body == "ShowLoginPage") {
			new SysWindow(SysWindow.GetMainWindow()).Location("Login.aspx");
		}
		else {
			// Because server-side a redirect might take place, which could be an entire form we make sure
			// that a) not an entire document will be inserted and
			// b) that no script is executed (especially the re-loading/executing of MSAjax library)
			var $body = $(body);
			if ($body.length > 1) {
				var form = $body.filter("form");
				if (form.length > 0) {
					$("script", form).remove();
					body = form.html();
				}
			}

			if (body == null || body == "") {
				if (InMenuLeft()) {
					parent.prtSetFrameCols();
				}
				_sysBrowsing = false;
				if (sysCxMenu) {
					sysCxMenu.hide();
				}
				if (sysCxMenuFrame !== null) {
					sysCxMenuFrame.hide();
				}
				return;
			}
			if (SysElement.IsNotNothing(body) && body.length > 0) {
				// We kill the menu to prevent events firing for the previous menu contents (especially unexpected mouse 
				// overs).
				SysMenuHide();
				var obj = _CreateMenuContainer(sysCxMenu, sysCxMenuFrame, "PopupSearch", true);
				if (obj !== null) {
					sysCxMenu = obj.container;
					sysCxMenuFrame = obj.frame;
				}

				_sysBrowsing = true;
				sysCxMenu.show();
				sysCxMenu.html(body);
				if (sysCxMenuFrame) {
					sysCxMenuFrame.show();
				}
				SysInputSearchActions();
				SysInputHandle();
			}
		}
	}
}

function SysInputHandle() {
	var si = SysGetElement(sysInput);
	if (si != null) {
		//get position of the input control first

		//set initial size of popup (adjust to input control)
		var h = 29;
		var w = 125;

		//search for contents
		mnu = new SysElement('_Menu', sysCxMenu[0]);
		if (mnu.empty === false)
			sysInputMenu = mnu.GetDomElement();
		else {
			sysInputMenu = null;
			mnu = new SysElement('_MenuError', sysCxMenu[0]);
			var actions = $(si).data('InputSearchActions');
			if (actions) {
				sysInputMenu = mnu.GetDomElement();
			}
		}
		if (mnu.empty === false) {
			h = mnu.TotalHeight();
			w = mnu.TotalWidth();
			if (w < 125) w = 125;
			coor = PopupCoordinates(null, 0, 6, w, h, si);

			mnu.Width("100%");
		}

		sysCxMenu.css({
			'left': coor.left,
			'top': coor.top,
			'width': w,
			'height': h
		});
		if (sysCxMenuFrame !== null) {
			sysCxMenuFrame.css({
				'left': coor.left,
				'top': coor.top,
				'width': w + 1,
				'height': h + 1
			});
		}

		if (InMenuLeft()) {
			parent.prtBroadenFrameCols(w);
		}
	}
	return true;
}

function SysInputSearchActions() {
	var si = SysGetElement(sysInput);
	if (si != null) {
		var actions = $(si).data('InputSearchActions');
		if (actions) {
			var menu = $('#_Menu');
			if (!menu.length) {
				menu = $('#_MenuError');
			}
			if (menu.length) {
				var tbody = $(menu).find('tbody:last');
				$.each(actions, function () {
					var obj = this;
					var row = $('<tr></tr>')
						.addClass('ContextMenuItems')
						.addClass('InputSearchAction');
					var cell = $('<td></td>')
						.attr('colspan', '2')
						.text(this.Caption)
						.click(function () {
							window[obj.Handler].call(null);
						})
						.data('Handler', this.Handler);
					cell.appendTo(row);
					tbody.append(row);
				});
			}
		}
	}
	return true;
}

function InMenuLeft() {
	return window.frameElement && (window.frameElement.id.toUpperCase() == 'MENULEFT');
}

function PopupCoordinates(e, offsetX, offsetY, width, height, anchor) {
	/// <summary></summary>
	/// <param name="e" type="DOMEvent" optional="True">If no anchor element is supplied an event object is needed
	/// to determine the cursor position.</param>
	/// <param name="offsetX" type="Number">A horizontal offset for the location of the popup.</param>
	/// <param name="offsetY" type="Number">A vertical offset for the location of the popup.</param>
	/// <param name="width" type="Number">The width of the popup.</param>
	/// <param name="height" type="Number">The height of the popup.</param>
	/// <param name="anchor" type="Any" optional="true">The element to which to attach the popup.</param>
	/// <remarks>Default position will be the lower left corner of the parent control / cursor. 
	/// determine the available width between the left edge of the control and the right edge of the window.
	/// If insufficient, we will stick the div to the right edge. </remarks>
	///	<returns type="Object">An object with two Integer properties, 'top' and 'left'.</returns>

	var body = $(document.body);
	var docElement = $(document.documentElement);
	var posBody = body.css("position");
	var posHtml = docElement.css("position");
	var xCoord, yCoord, xDiff, yDiff;
	var anch = new SysElement(anchor);

	var scrTopHtml = docElement.scrollTop();
	var scrTopBody = body.scrollTop();
	var scrBarHtml = (document.documentElement.offsetWidth > document.documentElement.clientWidth);
	var scrBarBody = (document.body.offsetWidth > document.body.clientWidth);
	var scrollLeft = body.scrollLeft() || docElement.scrollLeft();

	var scrollTop = IE6 && scrTopHtml > 0 ? scrTopHtml : scrTopBody || scrTopHtml;

	// 1) First determine the viewport size (i.e. the viewable area between the borders and scrollbars)
	var frameXEdge;
	var frameYEdge;
	if (IE6) {
		frameXEdge = docElement[0].clientWidth + scrollLeft;
		frameYEdge = docElement[0].clientHeight + scrollTop;
	}
	else {
		frameXEdge = Math.min(body.innerWidth(), docElement.innerWidth()) + scrollLeft;
		frameYEdge = Math.min(body.innerHeight(), docElement.innerHeight()) + scrollTop;
	}
	var marginLeft = parseInt(body.css("margin-left"));
	var marginRight = parseInt(body.css("margin-right"));
	if (!isNaN(marginLeft) && posBody !== SysElement.Position.Relative) {
		frameXEdge += marginLeft;
	}
	if (IE7) {
		// deduct the possible size of the scrollbar
		frameXEdge -= document.body.offsetWidth - document.body.clientWidth;
	}
	else if (!isNaN(marginRight)) {
		frameXEdge += marginRight;
	}

	// 2) Determine where we initially want to position the popup
	if (anch.empty) {
		xCoord = e.clientX + offsetX;
		yCoord = e.clientY + offsetY;

		// x will be a screen coordinate therefore we include the scroll offset
		xCoord += scrollLeft;
		yCoord += scrollTop;
	}
	else {
		// x will be a relative offset (already including the scroll offset) (well, at least in most cases!).
		xCoord = anch.Left() + offsetX;
		if (posBody === SysElement.Position.Relative) {
			xCoord -= marginLeft;
		}
		// Position below the anchor -> + anch.height
		yCoord = anch.Top() + anch.Height() + offsetY;
	}

	// 3) Adjust the x-coord when necessary

	// The box must fit inside the window => left + width < rhs edge
	xDiff = (xCoord + width) - frameXEdge;
	if (xDiff > 0) {
		xCoord -= xDiff < xCoord ? xDiff : xCoord;
	}
	
	if (IE6) {
		if (posBody === SysElement.Position.Static ||
			(posHtml === SysElement.Position.Static && posBody === SysElement.Position.Relative && 
			 !scrBarHtml && scrBarBody)) {
			xDiff = (xCoord + width) - document.body.clientWidth;
			if (xDiff > 0) {
				xCoord -= xDiff;
			}
		} 
	}
	
	if (IE7) {
	// In IE7 the position of the scrollbar is not to be included.
		if (posBody === SysElement.Position.Static) {
			xCoord -= body.scrollLeft();
			if (xCoord < marginLeft) {
				xCoord = marginLeft;
			}
		}
		else {
			if (xCoord < scrollLeft) {
				xCoord = scrollLeft;
			}
		}
	}

	if (!IE7) {
		var lhsEdge = scrollLeft;
		if (posBody === SysElement.Position.Relative) {
			lhsEdge -= marginLeft;
		}
		if (xCoord <= lhsEdge) {
			xCoord = lhsEdge;
		}
	}

	// Take 5 pixels of the x-coord in IE9
	if (UserAgent.IsIE() && UserAgent.majorVersion >= 9) {
		xCoord -= 1;
	}

	// 4) Adjust the y-coord when necessary

	// The box must fit inside the window => top + height < bottom edge
	yDiff = (yCoord + height) - frameYEdge;
	// if (IE7) {
	if (IE_LEGACY) {
		// include the height of a horizontal scrollbar
		yDiff += (document.body.offsetHeight - document.body.clientHeight);
	}
	if (yDiff >= 0) {
		// if need be put the popup above the cursor iso below.
		var newYCoord = yCoord - height - offsetY;
		if (IE6) {
			if (newYCoord < 0) {
				newYCoord = 0;
			}
		}
		if (newYCoord >= 0) {
			yCoord = newYCoord;
			if (!anch.empty) {
				yCoord -= anch.Height();
			}
		}
	}
	if (IE_LEGACY) {
		if (IE7) {
			if (posBody === SysElement.Position.Static) {
				yCoord -= scrTopBody;
			}
			else if (posBody === SysElement.Position.Relative) {
				if (yCoord <= scrollTop) {
					yCoord = scrollTop;
				}
			}
		}
		else if (IE6) {
			if (posHtml === SysElement.Position.Static && posBody === SysElement.Position.Relative) {
				if (scrBarHtml && scrBarBody) {
					// Ergo double scrollbars
					if (scrTopHtml > 0) {
						yCoord += scrTopBody;
					}
					if (yCoord < (scrTopBody + scrTopHtml)) {
						yCoord = scrTopBody + scrTopHtml;
					}
				}
				else { // tested for if (scrBarHtml && !scrBarBody) || (!scrBarHtml && scrBarBody) {
					// Ergo one scrollbar on the html element
					if (yCoord < scrTopBody) {
						yCoord = scrTopBody;
					}
				}
			}
			else {
				// assuming posHtml === SysElement.Position.Static && posBody === SysElement.Position.Static.
				if (scrBarHtml && scrBarBody) {
					if (scrTopHtml === 0) {
						yCoord -= scrTopBody;
					}
				} else if (!(scrBarHtml && !scrBarBody)) {
					yCoord -= (scrTopBody + scrTopHtml);
				}
				
				if (yCoord < scrTopHtml) {
					yCoord = scrTopHtml;
				}
			}
		}
		if (yCoord < 0) {
			yCoord = 0;
		}

	}
	else {
		if (yCoord <= scrollTop) {
			yCoord = scrollTop;
		}
	}

	return { top: yCoord, left: xCoord };
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Progress Bar: the client-side counterpart of Exact.Web.UI.Controls.ProgressBar
// Note: should really be in SysComponents.js, which contains the client-side controls.

var sysProgressBar = null;
var sysProgressBarFrame = null;

function SysProgressBarShow(bPrepend) {
	if (sysProgressBar == null) {
		return false;
	}

	$(sysProgressBarFrame).show();
	$(sysProgressBar).show();

	if (bPrepend) {
		$(sysProgressBar).prependTo("body");
		$(sysProgressBarFrame).prependTo("body");
	}
	return true;
}
function getProgressBarContent(stylesheet, mode) {
	var txt;

	if (mode == '1') {
		txt = '<img alt="" src="images/wait.gif">'
	}
	else {
		txt = '<img src="images/AnimBarCenterBack.png" style="width:356px;height:22px;position:absolute;left:10px;top:8px;z-index:-1"/>' +
			'<img src="images/AnimBarRightBack.png" style="height:22px;position:absolute;left:366px;top:8px;z-index:-1"/>' +
			'<img src="images/AnimBarLeft.png" style="height:22px"/>' +
			'<img id="progress_Img" src="images/AnimBarCenter.png" style="width:0px;height:22px;"/>' +
			'<img src="images/AnimBarRight.png" style="height:22px"/>';
	}

	var sHTML = '' +
		'<div id="divProgressContent" class="ProgressBar" style="text-align:center;background-color:white;border:1px solid;" >' +
			'<table id="progress" style="width:400px;height:150px;text-align:left;" cellpadding="0" cellspacing="0">' +
				'<tr style="height:40%">' +
					'<td id="progress_caption" colspan="3" style="text-align:center"></td>' +
				'</tr>' +
				'<tr style="height:30%">' +
					'<td style="width:1px">&nbsp;</td>' +
					'<td id="progress_img_row" colspan="2" style="width:100%;position:relative">' + txt + '</td>' +
				'</tr>' +
				'<tr style="height:30%;vertical-align:top">' +
					'<td></td>' +
					'<td colspan="2">' +
						'<table cellpadding="0" cellspacing="0" style="width:100%">' +
							'<tr>' +
								'<td id="progress_Text" class="Explanation" style="text-align:left"></td>' +
								'<td class="Explanation" style="text-align:right;padding-right:10px;">' +
									'<div id="progress_Step"></div>' +
								'</td>' +
							'</tr>' +
						'</table>' +
					'</td>' +
				'</tr>' +
			'</table>' +
		'</div>';

	return sHTML;
}
function SysProgressBarStart(stylesheet, mode, pbdiv, pbframe) {
	if (!pbdiv) {
		pbdiv = SysGetElement("maindivProgressBar");
	}
	if (!pbframe) {
		pbframe = SysGetElement("mainframeProgressBar");
	}
	if (!pbdiv) return;
	if (!pbframe) return;

	sysProgressBar = pbdiv;
	sysProgressBarFrame = pbframe;

	var sHTML = getProgressBarContent(stylesheet, mode);
	$(sysProgressBar).html(sHTML);

	SysProgressBarShow(true);

	var cWidth = 402
	var cHeight = 152;
	var nMargin = 3;
	var xCoord = (document.body.clientWidth - cWidth - nMargin) / 2;
	var yCoord = (document.body.clientHeight - cHeight - nMargin) / 2;

	$(sysProgressBar).css({
		'left': xCoord,
		'top': yCoord,
		'width': cWidth,
		'height': cHeight
	});

	$(sysProgressBarFrame).css({
		'left': xCoord,
		'top': yCoord,
		'width': cWidth,
		'height': cHeight
	});
}
function SysProgressBarCaption(txtStr) {
	if (SysProgressBarShow()) {
		if (txtStr == null) {
			$('#progress_caption', sysProgressBar).text("");
		}
		else {
			$('#progress_caption', sysProgressBar).text(txtStr);
		}
	}
}
function SysProgressBarText(txtStr) {
	if (SysProgressBarShow()) {
		if (txtStr == null) {
			$('#progress_Text', sysProgressBar).text("");
		}
		else {
			$('#progress_Text', sysProgressBar).text(txtStr);
		}
	}
}
function SysProgressBarImage(width, step) {
	if (SysProgressBarShow()) {
		$('#progress_Img', sysProgressBar).css("width", width);
	}
	SysProgressBarStep(step);
}
function SysProgressBarStep(step) {
	if (SysProgressBarShow()) {
		$('#progress_Step', sysProgressBar).text(step);
	}
}
function SysProgressBarHideImage() {
	if (SysProgressBarShow()) {
		$('#progress_img_row', sysProgressBar).hide();
	}
}
function SysProgressBarHide() {
	if (sysProgressBar) {
		$(sysProgressBar).hide();
		$(sysProgressBarFrame).hide();
	}
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Table manipulation routines
// ----------------------------------------

function SysInsertRow(table, tr) {
	/// <summary>Inserts an empty row into a table.</summary>
	/// <param name="table" type="jQuery"></param>
	/// <param name="tr" type="jQuery" optional="true">If supplied the new row is inserted before 'tr', otherwise 
	/// the new row is appended to the table at the end.</param>
	/// <returns type="jQuery">A jQuery wrapped tr.</returns>

	var row = $("<tr/>");
	if (tr) {
		tr.before(row);
	}
	else {
		table.append(row);
	}
	return row;
}

function SysAppendRow(table, tr) {
	/// <summary>Inserts an empty row into a table.</summary>
	/// <param name="table" type="jQuery"></param>
	/// <param name="tr" type="jQuery" optional="true">If supplied the new row is inserted after 'tr', otherwise 
	/// the new row is appended to the table at the end.</param>
	/// <returns type="jQuery">A jQuery wrapped tr.</returns>

	var row = $("<tr/>");
	if (tr) {
		tr.after(row);
	}
	else {
		table.append(row);
	}
	return row;
}

function SysInsertCell(row, td) {
	/// <summary>Inserts a cell into a row.</summary>
	/// <param name="row" type="jQuery"></param>
	/// <param name="td" type="jQuery" optional="true">If supplied the new cell is inserted before 'td', otherwise 
	/// the new cell is appended to the row at the end.</param>
	/// <returns type="jQuery">A jQuery wrapped td.</returns>

	var cell = $("<td/>");
	if (td) {
		td.before(cell);
	}
	else {
		row.append(cell);
	}
	return cell;
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

function SysTreeFindElement(el, tagName) {
	while (el != null && el.tagName != tagName)
		el = el.parentNode;
	return el;
}
function SysTreeCollapseOrExpand(ev, treeID) {
	var expanded = $(SysSrcElement(ev)).css("background-image").match("Expand");
	var node = $("#"+treeID);
	if (expanded) {
		node.show();
	} else {
		node.hide();
	}
	$(SysSrcElement(ev)).css("background-image"
	,"url('images/btnDoc"+(expanded?"Collapse":"Expand")+".gif')");
// There is a bug that prevent the toggle function to work properly in IE8
// Code below is the original code and is the preferred implementation
//	$(SysSrcElement(ev)).css("background-image"
//	,"url('images/btnDoc"+($("#"+treeID).toggle().is(":hidden")?"Expand":"Collapse")+".gif')");
}
function SysTreeMouseOver(ev) {
	var e = SysSrcElement(ev);
	var a = SysTreeFindElement(e, "A")
	if (a == null) return
	if (a.className == "Selected") {
		a.className = "SelectedMouseOver";
	}
	else {
		a.className = "MouseOver";
	}
}
function SysTreeMouseOut(ev) {
	var e = SysSrcElement(ev);
	var a = SysTreeFindElement(e, "A")
	if (a == null) return
	if (a.className == "SelectedMouseOver" || a.className == "Selected") {
		a.className = "Selected";
	}
	else {
		a.className = "";
	}
}

function SysTreeRuleOver(ev) {
	var e = SysSrcElement(ev);
	var td = SysTreeFindElement(e, "TD")
	if (td == null) return
	if (td.className == "MouseOver" || td.className == "Text") {
		td.className = "MouseOver";
	}
}
function SysTreeRuleOut(ev) {
	var e = SysSrcElement(ev);
	var td = SysTreeFindElement(e, "TD")
	if (td == null) return
	if (td.className == "MouseOver" || td.className == "Text") {
		td.className = "Text";
	}
}

var sysTreeLastSelected;
function SysTreeSelect(ev, treeID) {
	var e = SysSrcElement(ev);
	if (e.tagName == "A") {
		e = e.parentNode;
	}
	if (e.tagName == "TD") {
		if (e.className == "" || e.className == "NoEvents")
			return false;
		if (sysTreeLastSelected != null) {
			sysTreeLastSelected.className = "";
		}
		else {
			var t = SysGetElement(treeID);
			if (t != null) {
				 SysTree_Clear(t.childNodes);
			}
		}
		e.className = "SelectedMouseOver";
		sysTreeLastSelected = e;
		var tr = SysTreeFindElement(e, "TR");
		if (tr) {
			var v = tr.getAttribute('value')
			if (v) {
				SysSet(treeID, v);
				var td = tr.cells[3];
				if (td) {
					SysSet(treeID + '_Text', SysGetInnerText(td));
				}
				td = tr.cells[2];
				if (td) {
					SysSet(treeID + '_Code', SysGetInnerText(td));
				}
				return true;
			}
		}
	}
	else if (e.tagName == "BUTTON") {
		SysTree_SaveNodes(treeID);
	}
	return false;
}
function SysTree_Clear(nodes) {
	for (var i = 0; i < nodes.length; i++) {
		var n = nodes[i];
		if (n != null) {
			if (n.tagName == "A" && n.getAttribute("name") == "Selected")
				n.className = "";
			SysTree_Clear(n.childNodes);
		}
	}
}
function SysTree_InitSelected(nodes, treeID) {
	if (nodes == null) {
		var t = SysGetElement(treeID + "_Tree");
		if (t != null)
			nodes = t.childNodes;
	}
	for (var i = 0; i < nodes.length; i++) {
		var n = nodes[i];
		if (n != null) {
			if ((n.tagName == "A" || n.tagName == "TD") && n.className == "Selected") {
				sysTreeLastSelected = n;
			}
			SysTree_InitSelected(n.childNodes, treeID);
		}
	}
}
function SysTree_SaveNodes(nodes, v) {
	if (nodes) {
		for (var i = 0; i < nodes.length; i++) {
			var n = nodes[i];
			if (n != null) {
				if (n.tagName == "TR" && n.name == "TableRow")
					if (n.style.display == "block")
					v += n.getAttribute("ID") + ":";
				v = SysTree_SaveNodes(n.childNodes, v);
			}
		}
	}
	return v;
}
function SysTreeStartDrag(e) {
	var MoveID = SysSrcElement(e).getAttribute("treeid");
	var dragData = e.dataTransfer;
	dragData.setData('Text', "@tree@-" + MoveID);
	dragData.effectAllowed = 'linkMove';
	dragData.dropEffect = 'move';
}
function SysTreeStopDrag(e) {
	e.dataTransfer.clearData();
}
function SysTreeOverDrag(e) {
	e.returnValue = false;
}
function SysTreeEnterDrag(e) {
	e.dataTransfer.getData('Text');
}
function SysTreeDrop(e, treeID, postback) {
	var MoveID1 = e.dataTransfer.getData("Text")
	// eliminate default action of ondrop so we can customize:
	e.returnValue = false;
	if (MoveID1 && MoveID1.substr(0, 7) == "@tree@-") {
		var MoveID = MoveID.substr(7);
		var MoveValue;
		var t = SysSrcElement(e);
		while (t.getAttribute("name") != (treeID + "_Tree"))
			t = t.parentNode;
		if (t != null) {
			for (i = 0; i < t.all.length; i++)
				if (t.all(i).tagName == "TR" && t.all(i).getAttribute("id") == MoveID)
				MoveValue = t.all(i).getAttribute("value");
		}
		var el = SysTreeFindElement(SysSrcElement(el), "TR");
		SysSet(treeID + "_DropTarget", el.getAttribute("value"));
		SysSet(treeID + "_DropSource", MoveValue);
		SysSet("BCAction", 4);
		SysSubmit();
		return true;
	}
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Date Range control
// ------------------

function SysDateRangeSelect(ctl) {
	var dF, dT;
	var c = SysGetElement(ctl + '_Selection');
	var x = c[c.length - 1].value;
	if (x.substr(0, 2) == 'S_') {
		c.options[c.length - 1] = null;
		var v = SysGetElement(ctl + '_SelectionValue');
		if (v != null) {
			v.value = ''
		}
	}
	var i = c.selectedIndex - 1;
	if (i >= 0) {
		dF = SysDateRange[i][0]; dT = SysDateRange[i][1];
		var f = SysGetElement(ctl + '_From');
		if (f != null) {
			if (dF == null) {
				f.value = sysDateMask.replace(/9/g, ' ');
			}
			else {
				f.value = SysDateFormat(dF);
			}
		};
		var t = SysGetElement(ctl + '_To'); if (t != null) { if (dT == null) { t.value = sysDateMask.replace(/9/g, ' '); } else { t.value = SysDateFormat(dT); } };
		//var v = SysGetElement(ctl + '_SelectionValue'); if (v!=null) {v.value=c.options[i+1].value;}
	}
	var a = (c[i + 1].value >= 1000);
	var n = SysGetElement(ctl + '_More'); if (n != null) { n.disabled = a; };
	var b = SysGetElement(ctl + '_Less'); if (b != null) { b.disabled = a; };

	if (dF != null && dT != null) { return new Array(dF, dT); } else { return null; }
}

function SysDateRangeNavigate(ctl, d, dF, dT) {
	if (ctl == null || dF == null || dT == null)
		return;
	// set the navigation interval
	var c = SysGetElement(ctl + '_Selection');
	var x = c[c.length - 1].value;
	var i = c.selectedIndex - 1;
	if (x.substr(0, 2) != 'S_') {
		if (i >= 0) {
			c.options[c.length] = new Option('-- ' + SysDateRange[i][2] + ' --', 'S_' + c.options[i + 1].value);
			c.selectedIndex = c.length - 1;
			var v = SysGetElement(ctl + '_SelectionValue');
			if (v != null) {
				v.value = c.options[i + 1].value;
			}
		}
	}

	// based on interval, calculate next in range
	i = c.selectedIndex; x = c[i].value;
	if (x.substr(0, 2) == 'S_') {
		x = x.substr(2);
	}
	x = parseInt(x)
	if (x > 0) {
		switch (x) {
			case 1:
				dF = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() + d);
				dT = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate());
				break;
			case 7:
				dF = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() + (7 * d));
				dT = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() + 6);
				break;
			case 30:
				dF = new Date(dF.getFullYear(), dF.getMonth() + d, 1);
				dT = new Date(dF.getFullYear(), dF.getMonth() + 1, 0);
				break;
			case 90:
				dF = new Date(dF.getFullYear(), dF.getMonth() + (3 * d), 1);
				dT = new Date(dF.getFullYear(), dF.getMonth() + 3, 0);
				break;
			case 365:
				dF = new Date(dF.getFullYear() + d, 0, 1);
				dT = new Date(dF.getFullYear(), 11, 31);
				break;
		}
	}
	else {
		x = -1 * x;
		dF = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() + (x * d));
		dT = new Date(dT.getFullYear(), dT.getMonth(), dT.getDate() + (x * d));
	}

	var f = SysGetElement(ctl + '_From');
	if (f != null) {
		if (dF == null)
			f.value = '';
		else
			f.value = SysDateFormat(dF);
	}
	var t = SysGetElement(ctl + '_To');
	if (t != null) {
		if (dT == null)
			t.value = '';
		else
			t.value = SysDateFormat(dT);
	}

	if (dF != null && dT != null) { return new Array(dF, dT); } else { return null; }
}

function SysDateRangeClearNavigator(ctl) {
	new SysElement(ctl + '_Selection').Value(1000);
	new SysElement(ctl + '_SelectionValue').Value('');
	new SysElement(ctl + '_Less').SetDisabled(true);
	new SysElement(ctl + '_More').SetDisabled(true);
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Date Range 2 control
// ------------------
var DateRangeSelection2 = { "Range": 0,
	"All": 1,
	"ThisYear": 2,
	"ThisQuarter": 3,
	"ThisMonth": 4,
	"ThisWeek": 5,
	"Today": 6,
	"Yesterday": 7,
	"Last7Days": 8,
	"Last30Days": 9,
	"Last90Days": 10,
	"Last365Days": 11,
	"Next7Days": 12,
	"Next30Days": 13,
	"Next90Days": 14,
	"Next365Days": 15
};

(function () {
	var DateRange2 = (function () {

		DateRange2Def.prototype = {
			name: null,
			DateRangeSelection: [],
			DateRangeSelect: function () { },
			DateRangeNavigate: function () { }
		};

		//Constructor
		function DateRange2Def(name, selectionList) {
			if (DateRange2Def._initialized === undefined) {
				DateRange2Def.prototype._Init = function (name, selectionList) {
					this.name = name;
					this.DateRangeSelection = selectionList;
				};

				DateRange2Def.prototype.DateRangeSelect = function (ctl) {
					var dF, dT;
					var c = SysGetElement(ctl + '_Selection');
					var x = c[c.length - 1].value;
					if (x.substr(0, 2) == 'S_') {
						c.options[c.length - 1] = null;
						var v = SysGetElement(ctl + '_SelectionValue');
						if (v != null) {
							v.value = ''
						}
					}
					var i = c.selectedIndex - 1;
					if (i >= 0) {
						dF = this.DateRangeSelection[i][0]; dT = this.DateRangeSelection[i][1];
						var f = SysGetElement(ctl + '_From');
						if (f != null) {
							if (dF == null) {
								f.value = sysDateMask.replace(/9/g, ' ');
							}
							else {
								f.value = SysDateFormat(dF);
							}
						};
						var t = SysGetElement(ctl + '_To'); 
						if (t != null) { 
							if (dT == null) { 
								t.value = sysDateMask.replace(/9/g, ' '); 
							} 
							else { 
								t.value = SysDateFormat(dT); 
							} 
						};
						//var v = SysGetElement(ctl + '_SelectionValue'); if (v!=null) {v.value=c.options[i+1].value;}
					}
					var a = (c[i + 1].value <= DateRangeSelection2.All); // Range or All
					var n = SysGetElement(ctl + '_More'); 
					if (n != null) { 
						n.disabled = a; 
					};
					var b = SysGetElement(ctl + '_Less'); 
					if (b != null) { 
						b.disabled = a; 
					};

					if (dF != null && dT != null) { 
						return new Array(dF, dT); 
					} 
					else { 
						return null; 
					}
				};

				DateRange2Def.prototype.DateRangeNavigate = function (ctl, d, dF, dT) {
					if (ctl == null || dF == null || dT == null)
						return;
					// set the navigation interval
					var c = SysGetElement(ctl + '_Selection');
					var x = c[c.length - 1].value;
					var i = c.selectedIndex - 1;
					if (x.substr(0, 2) != 'S_') {
						if (i >= 0) {
							c.options[c.length] = new Option('-- ' + this.DateRangeSelection[i][2] + ' --', 'S_' + c.options[i + 1].value);
							c.selectedIndex = c.length - 1;
							var v = SysGetElement(ctl + '_SelectionValue');
							if (v != null) {
								v.value = c.options[i + 1].value;
							}
						}
					}

					// based on interval, calculate next in range
					i = c.selectedIndex; x = c[i].value;
					if (x.substr(0, 2) == 'S_') {
						x = x.substr(2);
					}
					x = parseInt(x)
					switch (x) {
						case DateRangeSelection2.ThisYear:
							dF = new Date(dF.getFullYear() + d, 0, 1);
							dT = new Date(dF.getFullYear(), 11, 31);
							break;
						case DateRangeSelection2.ThisQuarter:
							dF = new Date(dF.getFullYear(), dF.getMonth() + (3 * d), 1);
							dT = new Date(dF.getFullYear(), dF.getMonth() + 3, 0);
							break;
						case DateRangeSelection2.ThisMonth:
							dF = new Date(dF.getFullYear(), dF.getMonth() + d, 1);
							dT = new Date(dF.getFullYear(), dF.getMonth() + 1, 0);
							break;
						case DateRangeSelection2.ThisWeek:
							dF = GetNewDate(dF, 7, d);
							dT = GetNewDate(dF, 6, 1);
							break;
						case DateRangeSelection2.Today:
							//fall through
						case DateRangeSelection2.Yesterday:
							dF = dT = GetNewDate(dF, 1, d);
							break;
						case DateRangeSelection2.Last7Days:
							//fall through
						case DateRangeSelection2.Next7Days:
							dF = GetNewDate(dF, 7, d);
							dT = GetNewDate(dT, 7, d);
							break;
						case DateRangeSelection2.Last30Days:
							//fall through
						case DateRangeSelection2.Next30Days:
							dF = GetNewDate(dF, 30, d);
							dT = GetNewDate(dT, 30, d);
							break;
						case DateRangeSelection2.Last90Days:
							//fall through
						case DateRangeSelection2.Next90Days:
							dF = GetNewDate(dF, 90, d);
							dT = GetNewDate(dT, 90, d);
							break;
						case DateRangeSelection2.Last365Days:
							//fall through
						case DateRangeSelection2.Next365Days:
							dF = GetNewDate(dF, 365, d);
							dT = GetNewDate(dT, 365, d);
							break;
					}

					var f = SysGetElement(ctl + '_From');
					if (f != null) {
						if (dF == null)
							f.value = '';
						else
							f.value = SysDateFormat(dF);
					}
					var t = SysGetElement(ctl + '_To');
					if (t != null) {
						if (dT == null)
							t.value = '';
						else
							t.value = SysDateFormat(dT);
					}

					if (dF != null && dT != null) { 
						return new Array(dF, dT); 
					} 
					else { 
						return null; 
					}
				};
				DateRange2Def._initialized = true;
			}
			this._Init(name, selectionList);
		}
		return DateRange2Def;
	})();
	window.DateRange2 = DateRange2;
})();

function GetNewDate(dateField, day, operation) {
	return new Date(dateField.getFullYear(), dateField.getMonth(), dateField.getDate() + (day * operation));
}

function DateRange2ClearNavigator(ctl) {
	new SysElement(ctl + '_Selection').Value(DateRangeSelection2.Range);
	new SysElement(ctl + '_SelectionValue').Value('');
	new SysElement(ctl + '_Less').SetDisabled(true);
	new SysElement(ctl + '_More').SetDisabled(true);
};/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Week control
// ----------------

function SysWeekOnChangeInput(ctl) {
	/// <summary>Sets the date from/to corresponding to the selected week number</summary>
	/// <param name="ctl">base control id of the week control</param>
	/// <returns type="undefined">undefined</returns>
	var rawFromDate = SysGet(ctl + "_From");
	var dF = SysUnFormatDate(rawFromDate);
	var week = SysGet(ctl + "_SelectionWeek");
	if (dF != null) {
		dF = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() + 3);
		var year = dF.getFullYear();
		var d = new Date(year, 0, 4 + 7 * (week - 1));
		SysSet(ctl + "_From", SysFormatDate(d));
		SysSet(ctl + "_SelectionDate", SysFormatDate(d));
		SysWeekRangeNavigate(ctl, 0)
	}
}

function SysWeekRangeNavigate(ctl, d) {
	/// <summary>Sets the year/week corresponding to the selected date</summary>
	/// <param name="ctl">base control id of the week control</param>
	/// <param name="d">number of weeks to add to the week, which corresponds to the from date</param>
	/// <returns type="undefined">undefined</returns>
	var dF = null; var dT = null;
	var f = SysGetElement(ctl + "_From");
	var dF = SysUnFormatDate(f.value);

	//First convert to a Monday
	if (dF != null) {
		var weekDay = dF.getDay();
		if (weekDay == 0) {
			//Sunday
			dF = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() - 6);
		}
		else {
			dF = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() + (1 - weekDay));
		}

		dF = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() + (7 * d));
		dT = new Date(dF.getFullYear(), dF.getMonth(), dF.getDate() + 6);
	}
	if (f != null) {
		if (dF == null)
			f.value = '';
		else
			f.value = SysDateFormat(dF);
	}

	var t = SysGetElement(ctl + "_To");
	if (t != null) {
		if (dT == null)
			t.value = "";
		else
			t.value = SysDateFormat(dT);
	}

	SysWeekValue(ctl, dF);
}

function SysWeekValue(ctl, d) {
	/// <summary>Set the corresponding date, weeknumber and caption of control to the selected date</summary>
	/// <param name="ctl">base control id of the week control</param>
	/// <param name="d">it should be first day of week, so it's should be Monday</param>
	/// <returns type="undefined">undefined</returns>
	if (d != null) {
		//the week number is defined by 4 days of week - so by Thursday
		var d3 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 3);
		var w = d3.getWeek();
		SysSet(ctl + "_SelectionDate", SysFormatDate(d));
		SysSet(ctl + "_SelectionWeek", w);
		SysSetInnerText(ctl + "_WeekCaption", d3.getFullYear().toString());
	}
}

Date.prototype.getWeek = function () {
	/// <summary>Returns the ISO 8601 week number for this date</summary>
	/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */
	//monday
	dowOffset = 1;
	var newYear = new Date(this.getFullYear(),0,1);
	//the day of week the year begins on
	var day = newYear.getDay() - dowOffset;
	day = (day >= 0 ? day : day + 7);
	var daynum = Math.floor((this.getTime() - newYear.getTime() -
	(this.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
	var weeknum;
	//if the year starts before the middle of a week
	if(day < 4) {
		weeknum = Math.floor((daynum+day-1)/7) + 1;
		if(weeknum > 52) {
			nYear = new Date(this.getFullYear() + 1,0,1);
			nday = nYear.getDay() - dowOffset;
			nday = nday >= 0 ? nday : nday + 7;
			//if the next year starts before the middle of the week, it is week #1 of that year
			weeknum = nday < 4 ? 1 : 53;
		}
	}
	else {
		weeknum = Math.floor((daynum+day-1)/7);
	}
	return weeknum;
};
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Public interface

SysUrlBuilder.prototype = {
	sysurlbuilder: "1.0.0",

	Add: function (parameter, value) {
		/// <summary>Adds a parameter, existing of a key-value pair, to the url; replaces an existing key-value pair if the key already exists</summary>
		/// <param name="parameter" type="String">The key of the key-value pair</param>
		/// <param name="value" type="Number|String">The value of the key-value pair</param>
		/// <returns type="SysUrlBuilder">this</returns>
	},

	Append: function (parameter, value) {
		/// <summary>Appends a parameter, existing of a key-value pair, to the url; if the key already exists the value is appended separated by a comma</summary>
		/// <param name="parameter" type="String">The key of the key-value pair</param>
		/// <param name="value" type="Number|String">The value of the key-value pair</param>
		/// <returns type="SysUrlBuilder">this</returns>
	},

	SetKeyValue: function (value) {
		/// <summary>Sets the key value parameter, if there is one</summary>
		/// <param name="value" type="Number|String">The value, which corresponds to the key parameter</param>
		/// <returns type="SysUrlBuilder">this</returns>
	},

	OverrideDivisionKey : function (value) {
		/// <summary>Override the division key - parameter</summary>
		///<param name="value" type="Number">The code of the administration to switch to</param>
		/// <returns type="SysUrlBuilder">this</returns>
	},

	ToString: function () {
		/// <summary>The complete url</summary>
		/// <returns type="string">The complete url, including _Division_ parameter and value</returns>
	}

};

function SysUrlBuilder(url, external) {
	/// <summary>Wraps a url and provides an interface to manipulate it. 
	/// The interface is a subset of the interface of the server side URLBuilder object.
	/// The SysUrlBuilder automatically adds the mandatory _Division_ parameter if the url is not an external url.
	/// </summary>
	/// <param name="url" type="String"></param>
	/// <param name="external" type="Boolean">Indicate if the url is an external url and should not include the _Division_ parameter.</param>
	if (SysUrlBuilder._initialized === undefined) {

		SysUrlBuilder.prototype._rawUrl = "";
		SysUrlBuilder.prototype._keyParameter = "";
		SysUrlBuilder.prototype._ref = "";
		SysUrlBuilder.prototype._divisionKeyValue = null;
		SysUrlBuilder.prototype._external = external | false;

		SysUrlBuilder.prototype.Add = function (parameter, value) {
			parameter = SysURLEncode(parameter);
			var pos = this._rawUrl.lastIndexOf("&" + parameter + "=");
			if (pos < 0) {
				pos = this._rawUrl.lastIndexOf("?" + parameter + "=");
			}
			if (pos < 0) {
				// parameter not found; just add the value
				if (this._rawUrl.indexOf("?") >= 0)
					this._rawUrl += "&";
				else
					this._rawUrl += "?";
				this._rawUrl += parameter + "=" + (!SysElement.IsNothing(value) ? SysURLEncode(value) : "");
			}
			else {
				var tmp = "";
				pos += parameter.length + 2;
				var pos2 = this._rawUrl.indexOf("&", pos);
				if (pos2 >= 0) {
					tmp = this._rawUrl.substring(pos2);
				}
				this._rawUrl = this._rawUrl.substring(0, pos) + (!SysElement.IsNothing(value) ? SysURLEncode(value) : "") + tmp;
			}
			return this;
		};

		SysUrlBuilder.prototype.Append = function (parameter, value) {
			parameter = SysURLEncode(parameter);
			var pos = this._rawUrl.lastIndexOf("&" + parameter + "=");
			if (pos < 0) {
				pos = this._rawUrl.lastIndexOf("?" + parameter + "=");
			}
			if (pos < 0) {
				// parameter not found; just add the value
				if (this._rawUrl.indexOf("?") >= 0)
					this._rawUrl += "&";
				else
					this._rawUrl += "?";
				this._rawUrl += parameter + "=" + (!SysElement.IsNothing(value) ? SysURLEncode(value) : "");
			}
			else if (!SysElement.IsNothing(value)) {
				// only non empty values have to be appended
				var tmp = "";
				pos += parameter.length + 2;
				var pos2 = this._rawUrl.indexOf("&", pos);
				if (pos2 >= 0) {
					tmp = this._rawUrl.substring(pos2);
				}
				else {
					pos2 = this._rawUrl.length;
				}
				this._rawUrl = this._rawUrl.substring(0, pos2) + (pos2 > pos ? "," : "") + SysURLEncode(value) + tmp;
			}
			return this;
		};

		SysUrlBuilder.prototype.SetKeyValue = function (value) {
			if (this._keyParameter != "") {
				this.Add(this._keyParameter, value);
			}
			return this;
		};

		SysUrlBuilder.prototype.OverrideDivisionKey = function (value) {
			this._divisionKeyValue = value;
			return this;
		};

		SysUrlBuilder.prototype.ToString = function () {
			// Note: some pages are excluded on purpose: these are hybrid pages, in certain cases they do need the 
			// _Division_ parameter, at the same time these can be accessed while not being logged on onto 
			// the website. It is safer to just always add the _Division_ parameter. E.g. :
			// "XMLUpload.aspx", HlpReleaseNotes.aspx

			// Note: all pages in lower case!
			var lst = [
				"clearsession.aspx",
				"cvtupload.aspx",
				"crmmailupload.aspx",
				"devhlpstartpage.aspx",
				"docimage.aspx",
				"hlpdocument.aspx",
				"hlprestapiresources.aspx",
				"hlprestapiresourcesdetails.aspx",
				"hrmsubscription.aspx",
				"hrmsubtrial.aspx",
				"hrmsubtrialnew.aspx",
				"hrmsubtrialsimplewizard.aspx",
				"licacceptinvitation.aspx",
				"licemailvalidate.aspx",
				"menuportal.aspx",
				"login.aspx",
				"publicoauth2.aspx",
				"publicsso.aspx",
				"syscreatedatabase.aspx",
				"syserror.aspx",
				"syserror404.aspx",
				"syserror500.aspx",
				"sysforgotpassword.aspx",
				"syslogin.aspx",
				"sysstatus.aspx",
				"sysstatusnl.aspx",
				"sysstatusbe.aspx",
				"websitesubscription.aspx",
				"websliceeolnews.aspx",
				"xmldivisions.aspx",
				"xmlerror.aspx",
				"testcoreoauth.aspx",
				"testcoreoauth2callback.aspx",
				"_testcreatebanklink.aspx",
				"testrunnerdivision.aspx",
				"testrunneruser.aspx"
			];

			var refLower = this._ref.toLowerCase();

			if (this._divisionKeyValue != null) {
				this.Add('_Division_', this._divisionKeyValue);
			}
			else if (!this._external && !Array.contains(lst, refLower) && refLower.indexOf(".htm") < 0) {
				this.Add('_Division_', SysDivision());
			}

			return this._rawUrl;
		};

		SysUrlBuilder.prototype._Init = function (url) {
			var pos = url.lastIndexOf('?');
			if (pos == -1) {
				this._ref = url;
			}
			else {
				this._ref = url.substring(0, pos);
			}

			if (url.lastIndexOf('=')  === url.length - 1) {
				pos = url.lastIndexOf('&');
				if (pos == -1) {
					pos = url.lastIndexOf('?');
				}
				if (pos >= 0) {
					this._keyParameter = url.substring(pos + 1, url.length - 1);
				}
			}

			this._rawUrl = url;
		};
	}

	SysUrlBuilder._initialized = true;

	this._Init(url);
}
;/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="../base/jquery-ui-1.8.12.custom.js" />
/// <reference path="SysElement.js" />
/// <reference path="SysUrlBuilder.js" />
/// <reference path="SysIE.js" />
/// <reference path="SysEvents.js" />
/// <reference path="SysUserAgent.js" />
/// <reference path="../SysHelp/HelpDocument.js" />

(function () {

	var Dialog = (function () {

		DialogDef.prototype = {

			// Determines contents
			id: null,
			arguments: null,
			getContents: null,
			contentsPage: null,
			messageTerm: "",
			messageTermId: -1,
			encodeMessage: true,

			// Determines the dialog's caption
			titleTerm: null,
			titleTermId: -1,
			titleTermSuffix: null,
			titleTermSuffixId: -1,

			// Attributes
			modal: true,
			resizable: false,
			fullScreen: false,
			autoSize: false,
			autoShow: false,
			width: 300,
			height: null,
			customDialogClass: "",
			returnFocus: null,

			handler: null,
			onOpen: null,
			onClose: null,
			buttons: null,

			disposeOnClose: true,

			// Determined during operation, not intended to be set directly.
			returnValue: undefined,
			dialog: undefined,
			helpId: null,

			AddButton: function (func, caption, captionId, captionSuffix, captionSuffixId) {
				/// <summary>Add a custom button to the collection of buttons that will be displayed.</summary>
				/// <param name="func" type="Function">The handler function to attach to the button.</param>
				/// <param name="caption" type="String"></param>
				/// <param name="captionId" type="Number" optional="true"></param>
				/// <param name="captionSuffix" type="String" optional="true"></param>
				/// <param name="captionSuffixId" type="Number" optional="true"></param>
				/// <returns type="undefined">undefined</returns>
			},

			SetTitle: function (title) {
				/// <summary>Set the title of the dialog (after it's been created). Note: by default you should supply the title properties,
				/// (such as titleTerm) as options during initialization. However, if this is not possible this allows to set the title at a later
				/// time. </summary>
				/// <param name="title" type="String" optional="true">If title is not supplied it is constructed using the dialog's title properties.</param>
				/// <returns type="undefined">undefined</returns>
			},

			Open: function () {
				/// <summary>Open and thus display the dialog.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			Close: function () {
				/// <summary>Close and hide the dialog.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			Dispose: function () {
				/// <summary>Dispose the object's instance. Call this before dereferencing the object.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			MoveBy: function (x, y) {
				/// <summary>Move the dialog by a number of pixels. The outer edges of the dialog will however, not 
				/// move beyond the boundaries of the browser window.</summary>
				/// <param name="x" type="Number">Move the dialog by x amount of pixels from left to right; a negative 
				/// number moves from right to left.</param>
				/// <param name="y" type="Number">Move the dialog by y amount of pixels from top to bottom; a negative 
				/// number moves from the bottom to the top.</param>
				/// <returns type="undefined">undefined</returns>
			},
			MoveTo: function (x, y) {
				/// <summary>Move the dialog to an absolute position.</summary>
				/// <param name="x" type="Number">Number of pixels, from left to right.</param>
				/// <param name="y" type="Number">Number of pixels, from top to bottom.</param>
				/// <returns type="undefined">undefined</returns>
			},

			SetHelpId: function (helpId) {
				// <summary>Set the helpId of the currently active dialog.</summary>
				/// <param name="helpId" type="String">HelpId that will be used for opening help page from Exact help center</param>
				/// <returns type="undefined">undefined</returns>
			}

		};

		// Mimic public enumerators

		DialogDef.Buttons = {
			Custom: 1,
			Ok: 2,
			Cancel: 3,
			Yes: 4,
			No: 5,
			Open: 6,
			Delete: 7,
			Ignore: 8,
			Accept: 9
		};

		// Mimic statics

		DialogDef.ShowDialog = function () {
			/// <summary>Determines if the Dialog should be shown or the 'old style' popups.</summary>
			/// <returns type="Boolean">true always, false is obsolete</returns>
			return true;
		}

		DialogDef.InDialog = function (el, win) {
			/// <summary>Determines if the supplied element is a descendant of a Dialog.</summary>
			/// <param name="el" type="Any">Any type of element</param>
			/// <param name="win" type="DOMElement" optional="true">window</param>
			/// <returns type="undefined">undefined</returns>
			return new SysElement((win || window).frameElement).HasClass("DialogContentFrame") ||
				new SysElement(el).Parent(".ui-dialog").element.length > 0;
		}

		DialogDef.SetTitle = function (title) {
			/// <summary>Set the title of the currently active dialog. 
			/// Note: the best course of action is this to supply the dialog's title properties during instantiation in the options. This is an out in exceptional cases.</summary>
			/// <param name="title" type="String"></param>
			/// <returns type="undefined">undefined</returns>
			window.$dialog.SetTitle(title);
		}
		
		DialogDef.SetHelpId = function (helpId) {
			/// <summary>Set the helpId of the currently active dialog.</summary>
			/// <param name="helpId" type="String">HelpId that will be used for opening help page from Exact help center</param>
			/// <returns type="undefined">undefined</returns>
			window.$dialog.SetHelpId(helpId);
		}

		// ----- Constructor -----

		function DialogDef(options) {
			/// <summary>Dialog creates and optionally opens a new modal/modeless dialog, which is displayed on top of
			/// everything else. The contents of the dialog is determined by either getContents, contentsPage or messageTerm(Id).
			/// </summary>
			/// <param name="options" type="Object">An object consisting of name value pairs whose names must match the fields of the Dialog. 
			/// Those names matching the object's properties will override the default: e.g. overriding/supplying the height and the dialog's 
			/// title: '{titleTerm: "My title", height:450}' </param>
			/// <field name="id" type="String">The id of the dialog. If during the creation of the dialog
			/// an id was supplied the matching element will be sought and will be the dialog's contents (or an empty 
			/// div with this id is created). Note: an existing element conflicts with supplying a contentsPage.</field>
			/// <field name="getContents" type="null|Function">If a function is supplied it is assumed that the contents 
			/// of the dialog is filled by that function. Ergo you supply either getContents, contentsPage or messageTerm(Id).</field>
			/// <field name="contentsPage" type="SysUrlBuilder">A reference to page that will be loaded as contents 
			/// into the dialog. If a page has been provided the message will be ignored.</field>
			/// <field name="messageTerm" type="String">If a message is provided through the Term and/or TermId it 
			/// shall be used as the contents of the dialog.</field>
			/// <field name="messageTermId" type="Number">If a message is provided through the Term and/or TermId it 
			/// shall be used as the contents of the dialog.</field>
			/// <field name="encodeMessage" type="Boolean">Determines if the message will be Html encoded; the default value is true.</field>
			/// <field name="titleTerm" type="String">The title of the dialog, which can be composed through the Term 
			/// and/or TermId, optionally appended with the Suffix and/or SuffixId. NOTE an empty string also overrides
			/// the default title too.</field>
			/// <field name="titleTermId" type="Number"><see cref="titleTerm"/></field>
			/// <field name="titleTermSuffix" type="String"><see cref="titleTerm"/></field>
			/// <field name="titleTermSuffixId" type="Number"><see cref="titleTerm"/></field>
			/// <field name="modal" type="Boolean">Show as modal dialog, i.e. none of the parents elements are 
			/// accessible, which, not accidentally, is also the default.</field>
			/// <field name="resizable" type="Boolean"> Determines if the dialog is resizable.
			/// Note: Resizable is disabled by default because the content normally should fit inside the dialog.
			/// Examples: color picker, date picker, message dialogs.</field>
			/// <field name="fullScreen" type="Boolean">Use the maximum available window/screen space for showing the dialog. Default is false.</field>
			/// <field name="autoSize" type="Boolean">Automatically size the dialog to its contents. Default is false.</field>
			/// <field name="autoShow" type="Boolean">Auto show the dialog upon creation, or wait for an explicit 
			/// open (the latter being the default).</field>
			/// <field name="width" type="Number">Inner width of the dialog's canvas, i.e. the part of the dialog 
			/// where its contents is displayed. Its default is 300px. </field>
			/// <field name="height" type="Number">Inner height of the dialog's canvas, i.e. the part of the dialog 
			/// where its contents is displayed. There is no default, because by default the vertical axes is used
			/// to size the dialog to fit the contents.</field>
			/// <field name="customDialogClass" type="String">Provide a css class to enable custom styling.</field>
			/// <field name="returnFocus" type="Any">Any type of element ($, DOM, SysElement), that will receive the focus,
			/// when the dialog is closed.</field>
			/// <field name="handler" type="function">A function that will be called when the dialog is closed.</field>
			/// <field name="onOpen" type="function">A function that will be called when the dialog is opened.</field>
			/// <field name="onClose" type="function">A function that will be called when the dialog is closed even with the close button.</field>
			/// <field name="buttons" type="Object|Array">The collection of buttons to placed on the bottom of the dialog.</field>
			/// <field name="disposeOnClose" type="Boolean" default="true">When the dialog is closed, by default it is 
			/// also disposed, i.e. the entire object and any related html is removed.</field>
			/// <field name="dialog" type="SysElement">The dom element which is the dialog.</field>
			/// <field name="helpId" type="String">HelpId that will be used for opening help page from Exact help center</field>
			/// <field name="returnValue" type="Any">Possibly determined by a page loaded inside the dialog. E.g. 
			/// SysPopupCalender.aspx 'return' the date. NOTE: the page loaded MUST return something, which includes 'null',
			/// but NOT 'undefined'.</field>
			/// <remarks>The contents of the dialog is filled by either getContents, contentsPage or messageTerm(Id).</remarks>

			if (DialogDef._initialized === undefined) {
				DialogDef.prototype._dlg = null;
				// Use the legacy modal dialog
				DialogDef.prototype._usePopup = false;
				DialogDef.prototype._jq = null;
				DialogDef.prototype._contentFrame = null;

				DialogDef.prototype.AddButton = function (func, caption, captionId, captionSuffix, captionSuffixId) {
					if (this.buttons == null) {
						this.buttons = [];
					}

					this.buttons[SysTerm(captionId, caption, captionSuffixId, captionSuffix)] = func;
					this._dlg.dialog("option", "buttons", this.buttons);
				}

				DialogDef.prototype.SetTitle = function (title) {
					var myTitle = title || this._GetTitle();
					this._dlg.dialog("option", { title: myTitle });
				}

				DialogDef.prototype.Open = function () {
					if (!this._usePopup) {
						this._dlg.dialog("open");
						
						if (this.helpId) {
							var helpButton = $('<a>').addClass('ui-dialog-titlebar-help')
													 .click({ helpId: this.helpId }, this._openHelpCenter)
													 .attr("id", "TitleBarHelpButton")
													 .attr("target", "_blank");

							$(this._dlg).prev('.ui-dialog-titlebar').append(helpButton);
						}
					}
					else {
						throw new Error("TODO: use legacy modal popup");
					}

				};

				DialogDef.prototype.Close = function () {
					this._RevertHandle();
					if (typeof this.handler === "function") {
						this.handler(this.returnValue);
					}
					if (!this.disposed) {
						this._dlg.dialog("close");
					}
				};

				DialogDef.prototype.MoveBy = function (x, y) {
				};

				DialogDef.prototype.MoveTo = function (x, y) {
				};

				DialogDef.prototype.SetHelpId = function (helpId) {
					$(this._dlg).prev().find('a.ui-dialog-titlebar-help')
									.unbind("click")
									.click({ helpId: helpId }, this._openHelpCenter)
									.attr("target", "_blank");
				};

				DialogDef.prototype._openHelpCenter = function (event) {
					HlpDocumentBase(event.data.helpId, 'DocumentModal');
				}

				DialogDef.prototype._oldTitleTermId = -1;
				DialogDef.prototype._oldTitleSuffixTermId = -1;
				DialogDef.prototype._title;

				DialogDef.prototype._GetTitle = function () {
					if (SysElement.IsNothing(this._title) ||
						this._oldTitleTermId !== this.titleTermId || this._oldTitleSuffixTermId !== this.titleTermSuffixId) {
						if (SysElement.IsNothing(this.titleTerm) && this.titleTermId === -1) {
							this._title = SysTerm(26862, "Exact Online");
						}
						else if (this.titleTermId > 0 || this.titleTermSuffixId > 0) {
							this._title = SysTerm(this.titleTermId, this.titleTerm, this.titleTermSuffixId, this.titleTermSuffix);
							this._oldTitleTermId = this.titleTermId;
							this._oldTitleSuffixTermId = this.titleTermSuffixId;
						}
						else {
							this._title = this.titleTerm;
						}
					}
					return SysHtmlEncode(this._title);
				};

				DialogDef.prototype._message = "";
				DialogDef.prototype._oldMessageTermId = -1;

				DialogDef.prototype._GetMessage = function () {
					if (this._message === "" || this._oldMessageTermId !== this.messageTermId) {
						if (this.messageTermId > 0) {
							this._message = SysTerm(this.messageTermId, this.messageTerm);
							this._oldMessageTermId = this.messageTermId;
						}
						else {
							this._message = this.messageTerm;
						}
					}
					return (this.encodeMessage ? SysHtmlEncodeLines(this._message) : this._message);
				};


				var btns = {};
				btns[DialogDef.Buttons.Ok] = { id: 9830, caption: "Ok" };
				btns[DialogDef.Buttons.Cancel] = { id: 1021, caption: "Cancel" };
				btns[DialogDef.Buttons.Yes] = { id: 1014, caption: "Yes" };
				btns[DialogDef.Buttons.No] = { id: 1015, caption: "No" };
				btns[DialogDef.Buttons.Open] = { id: 24466, caption: "Open" };
				btns[DialogDef.Buttons.Delete] = { id: 16636, caption: "Delete" };
				btns[DialogDef.Buttons.Ignore] = { id: 1016, caption: "Ignore" };
				btns[DialogDef.Buttons.Accept] = { id: 4389, caption: "Accept" };
				DialogDef.prototype._GetDefaultButtonCaption = function (id) {
					return SysTerm(btns[id].id, btns[id].caption);
				}

				DialogDef.prototype._GetButton = function (btn) {
					var obj = {},
						me = this,
						buttonId;

					switch (typeof btn) {
						case "object":
							{
								if (typeof btn.buttonId === "number") {
									buttonId = btn.buttonId;
								}
								else {
									obj = btn;
								}
								break;
							}
						case "number":
							{
								buttonId = btn;
								break;
							}
						default:
							{
								throw new Error("Cannot process button");
							}

					}

					if (buttonId !== undefined) {
						obj[this._GetDefaultButtonCaption(buttonId)] = function () {
							me.returnValue = buttonId;
							me._ReturnFocus();
							if (typeof btn.func === "function") {
								btn.func();
							}
							me.Close();
						}
					}

					return obj;
				};

				DialogDef.prototype._GetButtons = function (options) {
					if (this.buttons !== null) {
						var buttons = {},
							me = this;
						if (this.buttons instanceof Array) {
							var i = 0;
							while (i < this.buttons.length) {
								var obj = this._GetButton(this.buttons[i]);
								for (var prop in obj) {
									buttons[prop] = obj[prop];
								}
								i++;
							}
						}
						else if (typeof this.buttons === "object") {
							for (var btn in this.buttons) {
								buttons[btn] = this.buttons[btn];
							}
						}
						else {
							throw new Error("Can't process buttons for dialog");
						}

						return buttons;
					}
				};

				DialogDef.prototype._GetOptions = function () {
					var dlg = this,
						jq = this._jq,
						options = {
							create: function (event, ui) {
								dlg._contentFrame = jq("iframe.DialogContentFrame", this);
							},

							/*  IE8 (+ 9?) Scrollbar fix: http://forum.jquery.com/topic/opening-a-modal-dialog-shows-a-horizontal-scroll-bar  */
							open: function (event, ui) {
								jq('body').css('overflow', 'hidden');
								jq('.ui-widget-overlay').css('width', '100%');
								// Explicly setting the height and width is necessary for Safari 4.0: the dialog's 
								// dimensions are explicitly set by default to w*h = 300px*auto. When setting the 
								// width and height to 100% of the iframe in Safari the dialog is stretched in height 
								// beyond the available window space
								jq('.ui-widget-overlay').css('position', 'absolute')
								.html('<div style="width: 100%; height: 100%; background-color: black;"></div><iframe style="position: absolute; border: none; top: 0; left: 0; height: 100%; width: 100%; z-index: -1;" src="about:blank"></iframe>');
								/* IE8 IE9 IE10 Overlay fix: http://stackoverflow.com/questions/12911428/z-index-does-not-work-in-ie7-ie8-with-pdf-in-iframe */
								if (UserAgent.IsSafari && UserAgent.majorVersion == 4) {
									var me = $(this);
									me.height(me.height()).width(me.width());
								}
								if (dlg.contentsPage instanceof SysUrlBuilder) {
									// Set the window.$dialog handler
									dlg._prevDialog = dlg._mainWindow.$dialog;
									dlg._mainWindow.$dialog = dlg;
									// Always add IsModal to the url of the contentsPage option to enforce modal dialog behavior
									dlg.contentsPage.Add('IsModal', 1);
									// Always add BeginModalCallStack to the url of the contentsPage option to enforce a new call stack
									dlg.contentsPage.Add('BeginModalCallStack', 1);

									dlg._contentFrame
										.width("100%").height("100%")
										.attr("src", dlg.contentsPage.ToString())
										.load(function () {
											// Adjust dialog height and width based on the content dimensions
											var contentBody = dlg._contentFrame.contents().find("body");
											contentBody = contentBody[0];
											var contentDocument = contentBody.ownerDocument;

											var contentHeight = Math.max(
													Math.max(contentBody.scrollHeight, contentDocument.documentElement.scrollHeight),
													Math.max(contentBody.offsetHeight, contentDocument.documentElement.offsetHeight),
													Math.max(contentBody.clientHeight, contentDocument.documentElement.clientHeight)),
												contentWidth = Math.max(
													Math.max(contentBody.scrollWidth, contentDocument.documentElement.scrollWidth),
													Math.max(contentBody.offsetWidth, contentDocument.documentElement.offsetWidth),
													Math.max(contentBody.clientWidth, contentDocument.documentElement.clientWidth));
											var dialogSpacingWidth = dlg._widget.width() - dlg._dlg.width(),
												dialogSpacingHeight = dlg._widget.height() - dlg._dlg.height();
											var maxDialogWidth = dlg._jqMainWindow.width() * 0.95,
												maxDialogHeight = dlg._jqMainWindow.height() * 0.90;
											var maxContentWidth = maxDialogWidth - dialogSpacingWidth,
												maxContentHeight = maxDialogHeight - dialogSpacingHeight;
											var dialogWidth = contentWidth + dialogSpacingWidth,
												dialogHeight = contentHeight + dialogSpacingHeight;
											if (dialogWidth > maxDialogWidth) {
												dialogWidth = maxDialogWidth;
											}
											if (dialogHeight > maxDialogHeight) {
												dialogHeight = maxDialogHeight;
											}
											if (dlg._dlg.dialog("option", "width") < dialogWidth || dlg._dlg.dialog("option", "height") < dialogHeight) {
												dlg._dlg.dialog("option", {
													width: dialogWidth + SysWindow.GetScrollbarWidth(),
													height: dialogHeight + SysWindow.GetScrollbarWidth(),
													position: [
														(dlg._jqMainWindow.width() - dialogWidth) / 2,
														(dlg._jqMainWindow.height() - dialogHeight) / 2
													]
												});
											}
										});
									dlg._dlg.addClass("ui-dialog-contentiframe");
									if (UserAgent.IsIE() && dlg.resizable) {
										dlg._dlg.css("padding", "1px");
									}
								} else if (dlg.autoSize) {
									dlg._AutoSize(this);
								}
								// Make first button the default and set focus to it
								dlg._dlg.siblings('.ui-dialog-buttonpane').find('button:eq(0)').addClass("Default").focus();
								// Disable access keys for buttons below the dialog
								dlg._DisableAccessKeys();
								// Trigger the onOpen handler
								if (typeof dlg.onOpen === "function") {
									dlg.onOpen();
								}
							},
							close: function (event, ui) {
								// Revert the window.$dialog handler
								dlg._RevertHandle();

								if (jq("div.ui-widget-overlay").length == 0) {
									jq('body').css('overflow', 'auto');
								}

								// End modal dialog callstack: do the synchronous callback before e.g. any redirects are executed.
								if (dlg.contentsPage instanceof SysUrlBuilder) {
									SysCallback('SysCallback.aspx?action=15');
								}

								if (typeof dlg.onClose === "function") {
									dlg.onClose(event);
								}

								dlg._ReturnFocus();

								// Enable access keys for buttons below the dialog
								dlg._EnableAccessKeys();
								// Show IFrames referencing SysAttachments
								SysWindow.FindInAllWindows('iframe.view-disabled[src^="SysAttachment.aspx"]').removeClass("view-disabled").show();
								if ((UserAgent.IsIE() && UserAgent.majorVersion >= 9) || UserAgent.IsIE11OrUp()) {
									// For IE we wait with disposing to let all remaining code be executed first.
									// Otherwise we get script errors because in IE9 and above the iframe and all code is immediately
									// removed. A timeout of 1 or even 100 milliseconds is not enough for bigger operations.
									setTimeout(function () {
										dlg.Dispose();
									}, 1000);
								}
								else {
									dlg.Dispose();
								}
							},
							dragStart: function () {
								dlg._BeginDrag();
							},
							dragStop: function () {
								dlg._EndDrag();
							},
							resizeStart: function () {
								dlg._BeginDrag(true);
							},
							resizeStop: function () {
								dlg._EndDrag(true);
							}
						};

					var title = this._GetTitle();
					if (SysElement.IsNotEmpty(title)) {
						options["title"] = title;
					}

					// always set
					if (!this.fullScreen && !this.autoSize) {
						options["width"] = this.width;
						if (this.height !== null) {
							options["height"] = this.height;
						}
					} else if (this.fullScreen) {
						var w = dlg._jqMainWindow;
						options["width"] = w.width() * 0.95;
						options["height"] = w.height() * 0.90;
						if (!this.resizable) {
							options["draggable"] = false;
						}
					}

					if (SysElement.IsNotEmpty(this.customDialogClass)) {
						options["dialogClass"] = this.customDialogClass;
					}

					// UI.Dialog has different defaults, hence '===' iso '!=='
					if (this.modal === DialogDef.prototype.modal) {
						options["modal"] = this.modal;
					}

					// 'autoOpen' is never done automatically or we loose property/field value dialog
					options["autoOpen"] = false;

					this.buttons = this._GetButtons();
					if (this.buttons != null) {
						options["buttons"] = this.buttons;
					}

					options["position"] = [(dlg._jqMainWindow.width() - options["width"]) / 2, (dlg._jqMainWindow.height() - options["height"]) / 2];

					options["resizable"] = this.resizable;
					// Temporally disable resizability for Internet Explorer 9+
					if (UserAgent.IsIE() && UserAgent.majorVersion >= 9) {
						options["resizable"] = false;
					}

					return options;
				};

				DialogDef.prototype.Dispose = function (forceDispose) {
					if ((forceDispose || this.disposeOnClose) && !this.disposed) {
						if (this._contentFrame) {

							if ((UserAgent.IsIE() && UserAgent.majorVersion >= 9) || UserAgent.IsIE11OrUp()) {
								this._contentFrame.attr('src', 'about:blank');
							}

							this._contentFrame.remove();
						}
						this.dialog = null;
						this._widget = null;
						this._dlg.dialog("destroy");
						this._contentFrame = null;
						this._RevertHandle();
						this._mainWindow = null;
						this._jqMainWindow = null;
						this._prevDialog = null;
						this._dlg.detach();
						this._dlg = null;
						this._jq = null;
						this.disposed = true;
					}
				};
				DialogDef.prototype._AutoSize = function (element) {
					var contentHeight = Math.max(
							Math.max(element.scrollHeight),
							Math.max(element.offsetHeight),
							Math.max(element.clientHeight)),
						contentWidth = Math.max(
							Math.max(element.scrollWidth),
							Math.max(element.offsetWidth),
							Math.max(element.clientWidth));
					var dialogSpacingWidth = this._widget.width() - this._dlg.width(),
						dialogSpacingHeight = this._widget.height() - this._dlg.height();
					var dialogWidth = contentWidth + dialogSpacingWidth,
						dialogHeight = contentHeight + dialogSpacingHeight;
					this._dlg.dialog("option", {
						width: dialogWidth,
						height: dialogHeight,
						position: [
							(this._jqMainWindow.width() - dialogWidth) / 2,
							(this._jqMainWindow.height() - dialogHeight) / 2
										]
					});
				};
				DialogDef.prototype._BeginDrag = function (resize) {
					this._dragDivInner = this._jq('<div class="ui-prevent" style="position:absolute; left:0; top:0; bottom:0; right:0;z-index: 10000"></div>');
					if (!this.modal || resize) {
						this._dragDivOuter = this._dragDivInner.clone();
						this._dlg.dialog("widget").after(this._dragDivOuter);
					}
					this._contentFrame.before(this._dragDivInner);
				};
				DialogDef.prototype._EndDrag = function (resize) {
					this._dragDivInner.remove();
					this._dragDivInner = null;
					if (this._dragDivOuter) {
						this._dragDivOuter.remove();
						this._dragDivOuter = null;
					}
				};

				DialogDef.prototype._RevertHandle = function () {
					if (this._contentFrame !== null && this._contentFrame.is("iframe") && this._prevDialog !== null) {
						this._mainWindow.$dialog = this._prevDialog;
						this._prevDialog = null;
					}
				};
				DialogDef.prototype._EnableAccessKeys = function () {
					//Renable all access keys
					$("button[data-accesskey]").each(function () {
						var button = $(this);
						button.attr("accesskey", button.attr("data-accesskey"));
						button.removeAttr("data-accesskey");
					});
				};
				DialogDef.prototype._DisableAccessKeys = function () {
					//Disable all access keys of the underlying page to prevent accessing them from the dialog
					$("button[accesskey]").each(function () {
						var button = $(this);
						button.attr("data-accesskey", button.attr("accesskey") || button.attr("accessKey"))
						button.removeAttr("accesskey").removeAttr("accessKey");
					});
				};
				DialogDef.prototype._ReturnFocus = function () {
					if (!this._focusReturned) {
						if (UserAgent.IsChrome() || UserAgent.IsSafari()) {
							// Verified for Chrome 19.0.1084.56 m and Safari/Win 5.1.7.
							var ret = new SysElement(this.returnFocus)
							// To make focus work a tab index is required and set to '0' so it don't mess with default tab flow.
							if (SysElement.IsEmpty(ret.Attribute("tabIndex"))) {
								ret.Attribute("tabIndex", 0);
							}
							ret.Focus();
						}
						else {
							// Verified for FireFox 13.0, Opera 11.64, IE8, IE9 and IE11
							new SysElement(this.returnFocus).Focus();
						}
						this._focusReturned = true;
					}
				};
				// Local interface
				DialogDef.prototype._Init = function (options) {
					var me = this;
					for (var name in options) {
						if (this[name] !== undefined) {
							this[name] = options[name];
						}
					}

					if (SysElement.IsEmpty(this.returnFocus)) {
						// In IE9 document.activeElement can throw an error. If this happen fall back to the document.documentElement.
						try {
							this.returnFocus = document.activeElement;
						} catch (e) {
							this.returnFocus = document.body;
						}
					}

					if ($ && $.ui && typeof $.ui.dialog === "function") {
						this._jq = $;
					}

					this._mainWindow = window.parent;
					while (this._mainWindow && this._mainWindow.parent !== this._mainWindow) {
						this._mainWindow = this._mainWindow.parent;
					}

					//	We must create any dialog on the 'real main window', the root window for all others
					if (this._mainWindow && this._mainWindow.$ && this._mainWindow.$.ui && typeof this._mainWindow.$.ui.dialog === "function") {
						this._jq = this._mainWindow.$;
						this._jqMainWindow = this._jq(this._mainWindow);
					}
					if (this._mainWindow && this._mainWindow.Dialog && !this._mainWindow.Dialog.uuid) {
						this._mainWindow.Dialog.uuid = 0;
					}

					if (this._jq) {
						var container;


						var el = new SysElement(this.id);
						if (el.empty) {
							container = this._jq("<div></div>");
							if (this.id == null) {
								this.id = ++this._mainWindow.Dialog.uuid;
							}

							container.attr("id", "container_" + this.id);

							if (typeof this.getContents === "function") {
								container.append(this.getContents());
							}
							else if (this.contentsPage instanceof SysUrlBuilder) {
								container.append("<iframe id='frame_" + this.id + "' src='about:blank' frameborder='0' class='DialogContentFrame'></iframe>");
							}
							else {
								container.append(this._GetMessage());
							}
						}
						else {
							// We need to remove the element from the DOM tree first (specifically Safari 4.0), so it 
							// can be moved to the top most window.
							container = el.element.detach();
						}

						this._dlg = this._jq(container).dialog(this._GetOptions());
						this._widget = this._dlg.dialog("widget");
						this.dialog = new SysElement(this._dlg);
						if (this.autoShow) {
							this.Open();
						}

						$(window).unload(function () {
							me.Dispose();
						});
					}
					else {
						this._usePopup = true;
					}
				};

				DialogDef._initialized = true;
			};
			if (!(typeof options === "object" && options.inherit)) {
				this._Init(options);
			}
		}

		return DialogDef;
	})();

	window.Dialog = Dialog;

	// Create a dialog replacement handler
	window.$dialog = null;
	var parentWindow = window.parent;
	do {
		if (parentWindow.$dialog) {
			window.$dialog = parentWindow.$dialog;
			break;
		}
		parentWindow = parentWindow.parent;
	} while (parentWindow != parentWindow.parent)

	if ($dialog) {
		window.close = function () {
			if ($dialog) {
				$dialog.returnValue = window.returnValue;
				$dialog.Close();
			}
		};
		window.dialogArguments = $dialog.arguments;
		// Add popup class for resetting margins and scroll bars
		$(function () {
			if (Dialog.InDialog(document, window)) {
				$("body").addClass("popup");
			}
		});
	}
})();
(function ($) {
	$.fn.bgiframe = function () {
		// Hide IFrames referencing SysAttachments
		SysWindow.FindInAllWindows('iframe[src^="SysAttachment.aspx"]:not([class*="no-hiding"])').addClass("view-disabled").hide();
		return this;
	};
})(jQuery);;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="SysLegacy.js" />
/// <reference path="SysElement.js" />
/// <reference path="Dialog.js" />

(function () {
	var BaseMessageDialog = (function () {
		BaseMessageDialogDef.prototype = new Dialog({ inherit: true });

		function BaseMessageDialogDef(options) {
			/// <summary>A dialog that displays some header text, message text and in front of the text an icon.</summary>
			/// <param name="options" type="Object">An object consisting of name value pairs whose names must match the fields of the BaseMessageDialog.</param>
			/// <field name="headerTerm" type="String">The text for the header is determined throug the (default) headerTerm and/or headerTermId.</field>
			/// <field name="headerTermId" type="Number"><see cref="headerTerm"/></field>
			/// <field name="encodeHeader" type="Boolean">Determines if the header will be Html encoded; the default value is true.</field>
			/// <field name="image" type="SysUrlBuilder"></field>
			/// <field name="altText" type="string">The alternative text to be displayed instead of the image (i.e. the 'alt' attribute).</field>
			if (BaseMessageDialogDef._initialized === undefined) {

				BaseMessageDialogDef.prototype.headerTerm = "";
				BaseMessageDialogDef.prototype.headerTermId = -1;
				BaseMessageDialogDef.prototype.encodeHeader = true;
				BaseMessageDialogDef.prototype.autoShow = true;
				BaseMessageDialogDef.prototype.image = null;
				BaseMessageDialogDef.prototype.altText = "";
				BaseMessageDialogDef.prototype.width = 500;
				BaseMessageDialogDef.prototype._header = "";
				BaseMessageDialogDef.prototype._oldHeaderTermId = -1;
				BaseMessageDialogDef.prototype._GetHeader = function () {
					if (this._header === "" || this._oldHeaderTermId !== this.messageTermId) {
						if (this.headerTermId > 0) {
							this._header = SysTerm(this.headerTermId, this.headerTerm);
							this._oldHeaderTermId = this.headerTermId;
						}
						else {
							this._header = this.headerTerm;
						}
					}
					return (this.encodeHeader ? SysHtmlEncodeLines(this._header) : this._header);
				};

				BaseMessageDialogDef.prototype._GetContents = function () {
					var contents = '<table class="MessageContents" cellpadding="0" cellspacing="0"><tr>'
					if (this.image instanceof SysUrlBuilder) {
						contents += '<td class="MessageIcon"><img src="' + this.image.ToString() + '"';
						if (SysElement.IsNotEmpty(this.altText)) {
							contents += ' alt="' + this.altText + '"';
						}
						contents += '/></td>';
					}

					var header = this._GetHeader();
					if (SysElement.IsNotEmpty(header)) {
						contents += '<td><h2 class="MessageHeader">' + header + '</h2>'
					}

					var msg = this._GetMessage();
					if (SysElement.IsNotEmpty(msg)) {
						contents += '<p class="MessageText">' + msg + '</p></td>';
					}
					contents += '</tr></table>';

					return contents;
				}

				BaseMessageDialogDef.prototype._OnOpen = function () {
					this.dialog.Find("a[href]").element.click(function (e) {
						var el = $(this);
						var hostWindow = window;
						while (hostWindow != hostWindow.parent) {
							hostWindow = hostWindow.parent;
						}
						var mainWindow = hostWindow.jQuery("iframe[id=MainWindow]");
						if (mainWindow.length > 0) {
							var actionWindow = mainWindow[0].contentWindow || mainWindow[0].contentDocument.window;
							e.preventDefault();
							actionWindow.location = el.attr("href");
						}
					});
				};

				BaseMessageDialogDef.prototype.AddButtonToOptions = function (options, buttonId, func) {
					/// <summary>Add a default buttons to an options parameter that will be supplied to the constructor of a BaseMessageDialog.</summary>
					/// <param name="options" type="Object">An object to be supplied to the constructor of a BaseMessageDialog. If it does not have 
					/// a buttons property it will be created.</param>
					/// <param name="buttonId" type="Dialog.Buttons">The id of the default button.</param>
					/// <param name="func" type="Function" optional="true">The function that will be called when the button is pressed.</param>
					/// <remarks>For this to work correctly the option autoShow: false must have been set.</remarks>
					/// <returns type="undefined">undefined</returns>
					if (SysElement.IsNothing(options.buttons)) {
						options.buttons = [];
					}
					if (options.buttons instanceof Array) {
						if (typeof func === "function") {
							options.buttons.push({ buttonId: buttonId, func: func });
						}
						else {
							options.buttons.push(buttonId);
						}
					}
				}

				BaseMessageDialogDef._initialized = true;
			}

			options.onOpen = this._OnOpen;
			options.getContents = this._GetContents;
			if (!options.width) {
				//Override default width of base 
				options.width = 500;
			}
			Dialog.call(this, options);
		}

		return BaseMessageDialogDef;

	})();
	window.BaseMessageDialog = BaseMessageDialog;

})();

;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="SysLegacy.js" />
/// <reference path="SysElement.js" />
/// <reference path="Dialog.js" />
/// <reference path="BaseMessageDialog.js" />

(function () {
	var ErrorDialog = (function () {
		ErrorDialogDef.prototype = new BaseMessageDialog({ inherit: true });

		ErrorDialogDef.Show = function (captionId, caption, width, height, explanationId, explanation) {
			/// <summary>Displays an error popup or dialog, with an error icon and an OK button</summary>
			/// <param name="" type=""></param>
			/// <returns type="undefined">undefined</returns>
			if (Dialog.ShowDialog()) {
				new ErrorDialog({
					headerTermId: captionId,
					headerTerm: caption,
					width: width,
					messageTermId: explanationId,
					messageTerm: explanation
				});
			}
			else {
				//NB: old style dialog is unchanged: it does not have an error icon!
				var url = "SysConfirm.aspx?CSRFToken=" + SysURLEncode(SysGet("CSRFToken"));
				url += "&Mode=5";
				if (caption)
					url += "&Caption=" + SysURLEncode(caption);
				if (captionId)
					url += "&captionId=" + SysURLEncode(captionId);
				if (explanation)
					url += "&Explanation=" + SysURLEncode(explanation);
				if (explanationId)
					url += "&ExplanationID=" + SysURLEncode(explanationId);
				if (!width)
					width = "300px";
				if (!height)
					height = "150px";
				SysShowModal(url, null, width, height);
			}
		}

		function ErrorDialogDef(options) {
			/// <summary>A dialog, derived from the BaseMessageDialog that displays an error icon in front of the message text.</summary>

			if (ErrorDialogDef._initialized === undefined) {
				ErrorDialogDef.prototype.buttons = [Dialog.Buttons.Ok];
				ErrorDialogDef.prototype.image = new SysUrlBuilder("images\\dialog_error_icon.png");
				ErrorDialogDef.prototype.altText = SysTerm(4467, "Error");

				ErrorDialogDef._initialized = true;
			}
			BaseMessageDialog.call(this, options);
		}

		return ErrorDialogDef;

	})();
	window.ErrorDialog = ErrorDialog;

})();

(function () {
	var WarningDialog = (function () {
		WarningDialogDef.prototype = new BaseMessageDialog({ inherit: true });

		WarningDialogDef.Show = function (titleId, title, captionId, caption, explanationId, explanation, okFunction, width, height) {
			/// <summary>Displays a warning popup or dialog, with a warning icon and an OK button</summary>
			/// <param name="titleId" type="Number">Term id of the title</param>
			/// <param name="title" type="String">Title</param>
			/// <param name="captionId" type="Number">Term id of the caption</param>
			/// <param name="caption" type="String">The warning message</param>
			/// <param name="explanationId" type="Number" optional="true">Term id of the explanation</param>
			/// <param name="explanation" type="String" optional="true">The additional information text</param>
			/// <param name="okFunction" type="Function" optional="true">The function that will be called when the ok button has been clicked.</param>
			/// <param name="width" type="Number|String" optional="true">Width of the dialog. Default width is 500px</param>
			/// <param name="height" type="Number|String" optional="true">height of the popup: only used for popups, not for dialogs</param>
			/// <returns type="undefined">undefined</returns>
			if (Dialog.ShowDialog()) {
				new WarningDialog({
					titleTermId: titleId,
					titleTerm: title,
					headerTermId: captionId,
					headerTerm: caption,
					messageTermId: explanationId,
					messageTerm: explanation,
					okFunction: okFunction,
					width: width
				});
			}
			else {
				var url = "SysConfirm.aspx?CSRFToken=" + SysURLEncode(SysGet("CSRFToken"));
				url += "&Mode=5";
				if (caption)
					url += "&Caption=" + SysURLEncode(caption);
				if (captionId)
					url += "&captionId=" + SysURLEncode(captionId);
				if (explanation)
					url += "&Explanation=" + SysURLEncode(explanation);
				if (explanationId)
					url += "&ExplanationID=" + SysURLEncode(explanationId);
				if (!width)
					width = "500px";
				if (!height)
					height = "150px";
				SysShowModal(url, null, width, height);
			}
		}

		function WarningDialogDef(options) {
			/// <summary>A dialog, derived from the BaseMessageDialog that displays an error icon in front of the message text.</summary>

			if (WarningDialogDef._initialized === undefined) {
				WarningDialogDef.prototype.okFunction = null;
				WarningDialogDef.prototype.image = new SysUrlBuilder("images\\dialog_Warning_icon.png");
				WarningDialogDef.prototype.altText = SysTerm(3749, "Warning");

				WarningDialogDef._initialized = true;
			}
			this.AddButtonToOptions(options, Dialog.Buttons.Ok, options.okFunction);
			BaseMessageDialog.call(this, options);
		}

		return WarningDialogDef;

	})();
	window.WarningDialog = WarningDialog;

})();

(function () {
	var InformationDialog = (function () {
		InformationDialogDef.prototype = new BaseMessageDialog({ inherit: true });

		InformationDialogDef.Show = function (titleId, title, captionId, caption, explanationId, explanation, okFunction, width, height) {
			/// <summary>Displays an information popup or dialog, with an information icon and an OK button</summary>
			/// <param name="titleId" type="Number">Term id of the title</param>
			/// <param name="title" type="String">Title</param>
			/// <param name="captionId" type="Number">Term id of the caption</param>
			/// <param name="caption" type="String">The message</param>
			/// <param name="explanationId" type="Number">Optional: Term id of the explanation</param>
			/// <param name="explanation" type="String">Optional: The additional information text</param>
			/// <param name="okFunction" type="Function">Optional: The function that will be called when the ok button has been clicked.</param>
			/// <param name="width" type="Number|String">Optional: width of the dialog. Default width is 500px</param>
			/// <param name="height" type="Number|String">Optional: height of the popup: only used for popups, not for dialogs</param>
			/// <returns type="undefined">undefined</returns>
			if (Dialog.ShowDialog()) {
				new InformationDialog({
					titleTermId: titleId,
					titleTerm: title,
					headerTermId: captionId,
					headerTerm: caption,
					messageTermId: explanationId,
					messageTerm: explanation,
					okFunction: okFunction,
					width: width
				});
			}
			else {
				var url = "SysConfirm.aspx?CSRFToken=" + SysURLEncode(SysGet("CSRFToken"));
				url += "&Mode=5";
				if (caption)
					url += "&Caption=" + SysURLEncode(caption);
				if (captionId)
					url += "&captionId=" + SysURLEncode(captionId);
				if (explanation)
					url += "&Explanation=" + SysURLEncode(explanation);
				if (explanationId)
					url += "&ExplanationID=" + SysURLEncode(explanationId);
				if (!width)
					width = "500px";
				if (!height)
					height = "150px";
				SysShowModal(url, null, width, height);
			}
		}

		InformationDialogDef.ShowNoDataSelected = function(titleId, title, okFunction) {
			if (Dialog.ShowDialog()) {
				new InformationDialog({
					titleTermId: titleId,
					titleTerm: title,
					headerTerm: "No data selected.",
					headerTermId: 20060,
					okFunction: okFunction
				});
			}
			else {
				SysConfirm(3);
			}
		}

		function InformationDialogDef(options) {
			/// <summary>A dialog, derived from the BaseMessageDialog that displays an exclamation mark icon in front of the message text.</summary>

			if (InformationDialogDef._initialized === undefined) {
				InformationDialogDef.prototype.okFunction = null;
				InformationDialogDef.prototype.image = new SysUrlBuilder("images\\dialog_Information_icon.png");
				InformationDialogDef.prototype.altText = SysTerm(8642, "Information");

				InformationDialogDef._initialized = true;
			}
			this.AddButtonToOptions(options, Dialog.Buttons.Ok, options.okFunction);

			BaseMessageDialog.call(this, options);
		}

		return InformationDialogDef;

	})();
	window.InformationDialog = InformationDialog;

})();

(function () {
	var QuestionDialog = (function () {
		QuestionDialogDef.prototype = new BaseMessageDialog({ inherit: true });
		QuestionDialogDef.Show = function (titleId, title, questionId, question, yesFunction, explanationId, explanation, noFunction, width, height) {
			/// <summary>Displays a question popup or dialog, with a question icon and an Yes and No buttons</summary>
			/// <param name="titleId" type="Number">Term id of the title</param>
			/// <param name="title" type="String">Title</param>
			/// <param name="questionId" type="Number">Term id of the caption</param>
			/// <param name="question" type="String">The question</param>
			/// <param name="explanationId" type="Number">Optional: Term id of the explanation</param>
			/// <param name="explanation" type"=String">Optional: The additional information text</param>
			/// <param name="yesFunction" type="Function">The function that will be called when the yes button has been clicked.</param>
			/// <param name="noFunction" type="Function">The function that will be called when the no button has been clicked.</param>
			/// <param name="width" type="Number|String">Optional: width of the dialog. Default width is 500px</param>
			/// <param name="height" type="Number|String">Optional: height of the popup: only used for popups, not for dialogs</param>
			/// <returns type="undefined">undefined</returns>
			if (Dialog.ShowDialog()) {
				new QuestionDialog({
					titleTermId: titleId,
					titleTerm: title,
					headerTermId: questionId,
					headerTerm: question,
					width: width,
					messageTermId: explanationId,
					messageTerm: explanation,
					yesFunction: yesFunction,
					noFunction: noFunction
				});
			}
			else {
				var url = "SysConfirm.aspx?CSRFToken=" + SysURLEncode(SysGet("CSRFToken"));
				url += "&Mode=4";
				if (question)
					url += "&Caption=" + SysURLEncode(question);
				if (questionId)
					url += "&captionId=" + SysURLEncode(questionId);
				if (explanation)
					url += "&Explanation=" + SysURLEncode(explanation);
				if (explanationId)
					url += "&explanationId=" + SysURLEncode(explanationId);
				if (!width)
					width = "500px";
				if (!height)
					height = "150px";
				SysShowModal(url, null, width, height);
				if (SysDialog.returnValue) {
					if (yesFunction) {
						yesFunction();
					}
				}
				else {
					if (noFunction) {
						noFunction();
					}
				}
			}
		};

		QuestionDialogDef.ShowYesNoCancel = function (titleId, title, questionId, question, yesFunction, noFunction, explanationId, explanation, cancelFunction, width, height) {
			/// <summary>Displays a question popup or dialog, with a question icon and an Yes, No and Cancel buttons</summary>

			/// <summary>Displays a question popup or dialog, with a question icon and an Yes and No buttons</summary>
			/// <param name="titleId" type="Number">Term id of the title</param>
			/// <param name="title" type="String">Title</param>
			/// <param name="questionId" type="Number">Term id of the caption</param>
			/// <param name="question" type="String">The question</param>
			/// <param name="explanationId" type="Number">Optional: Term id of the explanation</param>
			/// <param name="explanation" type"=String">Optional: The additional information text</param>
			/// <param name="yesFunction" type="Function">The function that will be called when the yes button has been clicked.</param>
			/// <param name="noFunction" type="Function">The function that will be called when the no button has been clicked.</param>
			/// <param name="cancelFunction" type="Function">The function that will be called when the cancel button has been clicked.</param>
			/// <param name="width" type="Number|String">Optional: width of the dialog. Default width is 500px</param>
			/// <param name="height" type="Number|String">Optional: height of the popup: only used for popups, not for dialogs</param>

			/// <returns type="undefined">undefined</returns>
			if (Dialog.ShowDialog()) {
				new QuestionDialog({
					titleTermId: titleId,
					titleTerm: title,
					headerTerm: question,
					headerTermId: questionId,
					width: width,
					messageTerm: explanation,
					messageTermId: explanationId,
					yesFunction: yesFunction,
					noFunction: noFunction,
					cancelFunction: cancelFunction,
					showCancelButton: true
				});
			}
			else {
				var url = "SysConfirm.aspx?CSRFToken=" + SysURLEncode(SysGet("CSRFToken"));
				url += "&Mode=6";
				if (question)
					url += "&Caption=" + SysURLEncode(question);
				if (questionId)
					url += "&captionId=" + SysURLEncode(questionId);
				if (explanation)
					url += "&Explanation=" + SysURLEncode(explanation);
				if (explanationId)
					url += "&ExplanationID=" + SysURLEncode(explanationId);
				if (!width)
					width = "300px";
				if (!height)
					height = "150px";
				SysShowModal(url, null, width, height);
				switch (SysDialog.returnValue) {
					case  1:
						if (yesFunction) {
							yesFunction();
						}
						break;
					case  0:
						if (noFunction) {
							noFunction();
						}
						break;
					default:
						if (cancelFunction) {
							cancelFunction();
						}
				}
			}
		};

		QuestionDialogDef.ShowConfirmDelete = function (mode, url, yesFunction, explanation, explanationId) {
			/// <summary>Displays a 'Do you want to delete' dialog or pop-up, depending on user agent and parameters</summary>
			/// <param name="mode" type="Number" optional="true">delete mode: obsolete</param>
			/// <param name="url" type="String|SysUrlBuilder">Optional: the url</param>
			/// <param name="yesFunction" type="function">A function that will be called when button Yes was selected in the dialog</param>
			/// <param name="explanation" type="String|SysUrlBuilder">Optional: the explanation</param>
			/// <param name="explanationId" type="Number">Optional: the explanation term id</param>
			/// <returns type=undefined">Undefined</returns>
			/// <remarks>
			/// If a url is specified, then the handler is ignored
			/// If no url and no yesFunction are specified, then we fall back to the pop-ups: probably this means that SysConfirmDelete is called by still to be modified code 
			/// </remarks>
			if (Dialog.ShowDialog() && (SysElement.IsNotEmpty(url) || typeof yesFunction === "function")) {
				var dlg = new QuestionDialog({
					titleTerm : "Delete",
					titleTermId: 16636,
					headerTerm: "Do you want to delete?",
					headerTermId: 55590,
					yesFunction: function () {
						if (url) {
							SysLocation(url);
						}
						else {
							if (yesFunction) {
								yesFunction();
							}
						}
					},
					messageTermId: explanationId,
					messageTerm: explanation
				});
			}
			else {
				SysShowModal("SysConfirm.aspx?Mode=2&DeleteMode=" + mode, null, "300px", "150px");
				if (SysDialog.returnValue) {
					if (url) {
						SysLocation(url);
					}
					else {
						if (yesFunction) {
							yesFunction();
						}
					}
				}
				return SysDialog.returnValue;
			}
		}

		function QuestionDialogDef(options) {
			/// <summary>A dialog, derived from the BaseMessageDialog that displays an question mark icon in front of the message text. 
			/// By default it has yes, no and cancel buttons</summary>
			/// <param name="yesFunction" type="Function">The function that will be called when the yes button has been clicked.</param>
			/// <param name="noFunction" type="Function">The function that will be called when the no button has been clicked.</param>
			/// <param name="cancelFunction" type="Function">The function that will be called when the cancel button has been clicked.</param>

			if (QuestionDialogDef._initialized === undefined) {
				QuestionDialogDef.prototype.yesFunction = null;
				QuestionDialogDef.prototype.noFunction = null;
				QuestionDialogDef.prototype.cancelFunction = null;
				QuestionDialogDef.prototype.showCancelButton = false;
				QuestionDialogDef.prototype.image = new SysUrlBuilder("images\\dialog_Question_icon.png");
				QuestionDialogDef.prototype.altText = SysTerm(6340, "Question");

				QuestionDialogDef._initialized = true;
			}

			this.AddButtonToOptions(options, Dialog.Buttons.Yes, options.yesFunction);
			this.AddButtonToOptions(options, Dialog.Buttons.No, options.noFunction);
			if (options.showCancelButton) {
				this.AddButtonToOptions(options, Dialog.Buttons.Cancel, options.cancelFunction);
			}

			var closeFunction = options.cancelFunction || options.noFunction;
			if (options.showCancelButton && !options.cancelFunction) closeFunction = null;
			if (closeFunction) {
				var prevOnClose = options.onClose;
				options.onClose = function(event) {
					if (prevOnClose) {
						prevOnClose(event);
					}
					var triggeredEvent = event.originalEvent || event;
					var eventTarget = $(triggeredEvent.srcElement || triggeredEvent.target);
					if (eventTarget.is(".ui-dialog-titlebar-close") || eventTarget.parents().is(".ui-dialog-titlebar-close")) {
						closeFunction();
					}
				};
			}
			BaseMessageDialog.call(this, options);
		}

		return QuestionDialogDef;

	})();
	window.QuestionDialog = QuestionDialog;

})();

(function () {
	var ConfirmationDialog = (function () {
		ConfirmationDialogDef.prototype = new BaseMessageDialog({ inherit: true });

		ConfirmationDialogDef.ShowConfirmDelete = function (mode, url, okFunction) {
			/// <summary>Obsolete: use QuestionDialog.ShowConfirmDelete instead</summary>
			return QuestionDialog.ShowConfirmDelete(mode, url, okFunction);
		}

		function ConfirmationDialogDef(options) {
			/// <summary>A dialog, derived from the BaseMessageDialog that displays an exclamation mark icon in front of the message text.
			/// By default it has ok and cancel buttons.</summary>
			if (ConfirmationDialogDef._initialized === undefined) {
				ConfirmationDialogDef.prototype.titleTerm = "Confirm";
				ConfirmationDialogDef.prototype.titleTermId = 6593;
				ConfirmationDialogDef.prototype.okFunction = null;
				ConfirmationDialogDef.prototype.cancelFunction = null;
				ConfirmationDialogDef.prototype.image = new SysUrlBuilder("images\\dialog_Question_icon.png");
				ConfirmationDialogDef.prototype.altText = SysTerm(21189, "Confirmation");

				ConfirmationDialogDef._initialized = true;
			}
			this.AddButtonToOptions(options, Dialog.Buttons.Ok, options.okFunction);
			this.AddButtonToOptions(options, Dialog.Buttons.Cancel, options.cancelFunction);

			BaseMessageDialog.call(this, options);
		}
		return ConfirmationDialogDef;

	})();
	window.ConfirmationDialog = ConfirmationDialog;
})();

(function () {
	var BrowserDialog = (function () {
		BrowserDialogDef.prototype = new Dialog({ inherit: true });

		function BrowserDialogDef(options) {
			if (BrowserDialogDef._initialized === undefined) {
				BrowserDialogDef.prototype.autoShow = true;
				BrowserDialogDef.prototype.width = 800;
				BrowserDialogDef.prototype.height = 600;

				BrowserDialogDef._initialized = true;
			}

			Dialog.call(this, options);
		}
		return BrowserDialogDef;
	})();
	window.BrowserDialog = BrowserDialog;
})();

;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="SysLegacy.js" />
/// <reference path="SysElement.js" />
/// <reference path="Dialog.js" />
/// <reference path="BaseMessageDialog.js" />
/// <reference path="DialogObjects.js" />

// SysButtonAsk
function SysButtonAsk(e, url, funcYes, funcNo, titleId, title, options) {
	/// <summary>Displays a 'Save changes' dialog or pop-up, depending on user agent and parameters</summary>
	/// <param name="url" type="String|SysUrlBuilder">Optional: the url, to which the user is redirected</param>
	/// <field name="funcYes" type="function">A function that will be called when Yes was selected in the dialog. 
	///		If this function returns true, then saving continues, otherwise saving is canceled</field>
	/// <field name="funcNo" type="function">A function that will be called when No was selected in the dialog</field>
	/// <field name="titleId" type="Number" optional="true">>Title term id of the dialog</field>
	/// <field name="title" type="String" optional="true">Default title term of the dialog</field>
	/// <field name="options" type="object" optional="true">Container for more optional options</field>
	/// <returns type=undefined"></returns>
	var defaults = { showCancelButton: true };
	var settings = $.extend( {}, defaults, options );
	
	if (!SysIsDirty()) {
		if (url == null) {
			SysWindow.CloseDialog(new SysHandleEvent(e), this);
		}
		else {
			SysLocation(url);
		}
		return;
	}

	if (Dialog.ShowDialog()) {
		var dlg = new QuestionDialog({
			titleTerm: (title || "Close"),
			titleTermId: (titleId || 8450),
			headerTerm: "Save changes?",
			headerTermId: 4650,
			showCancelButton: settings.showCancelButton,
			yesFunction: function () {
				if (typeof funcYes === "function") {
					if (!funcYes()) {
						return;
					}
				}
				SysSet("BCAction", 6);
				SysSubmit(1);
			},
			noFunction: function () {
				if (typeof funcNo === "function") {
					if (!funcNo()) {
						return;
					}
				}
				if (SysElement.IsEmpty(url)) {
					sysIsSubmitted = true;
					SysWindow.CloseDialog(new SysHandleEvent(e), window);
				}
				else {
					SysLocation(url);
				}
			}
		});
	}
	else {
		SysDialog.funcYes = funcYes;
		SysDialog.funcNo = funcNo;
		SysDialog.url = url;
		SysShowModal("SysConfirm.aspx", null, "300px", "150px", "SysButtonHandler()");
	}
}

function SysButtonHandler() {
	var a = SysDialog.returnValue;
	if (a == 1) {
		var f = SysDialog.funcYes;
		if (f != null) {
			if (!f())
				return;
		}
		SysSet("BCAction", 6);
		SysSubmit(1);
	}
	else
		if (a == 0) {
			var f = SysDialog.funcNo;
			if (f != null) {
				f();
			}
			if (SysDialog.url == null) {
				sysIsSubmitted = true;
				SysWindow.CloseDialog(null, window);
			}
			else {
				SysLocation(SysDialog.url);
		}
	}
}

// SysConfirmDelete
function SysConfirmDelete(mode, url, okHandler) {
	/// <summary>Obsolete: use QuestionDialog.ShowConfirmDelete instead</summary>
	QuestionDialog.ShowConfirmDelete(mode, url, okHandler);
}

// Switch Division
function SysSwitchDivision(division, url, nomsg, remember) {
	/// <summary>Displays a 'You are being redirected. Continue?' dialog or pop-up, depending on user agent</summary>
	/// <param name="division" type="Number">The division to be redirected</param>
	/// <param name="url" type="String|SysUrlBuilder">Optional: the url</param>
	/// <param name="nomsg" type="boolean">Suppresses popup/dialog, if true</param>
	/// <remarks>
	/// This method is deprecated. First of all it calls SysLogOff which is not ok.
	/// Secondly no one knows what the remember parameter does.
	/// When redirection to MenuPortal.aspx is required use either SysWindow.SwitchDivision(division) if no dialog is needed.
	/// Otherwise use SysSwitchAdministration(division) instead.
	/// When redirecting to another page contact the System team and we will figure out the best approach.
	/// </remarks>
	if (nomsg) {
		SysLogOff(division, url, remember);
	}
	else {
		if (Dialog.ShowDialog()) {
			var dlg = new ConfirmationDialog({
				headerTerm: "You are being redirected to another administration.",
				headerTermId: 15585,
				okFunction: function () {
					SysLogOff(division, url, remember);
				}
			});
		}
		else {
			if (SysConfirm(8)) {
				SysLogOff(division, url, remember);
			}
		}
	}
}

// Switch Administration
function SysSwitchAdministration(division) {
	/// <summary>Displays a 'You are being redirected. Continue?' dialog or pop-up, depending on user agent</summary>
	/// <param name="division" type="Number">The division to be redirected</param>
	new ConfirmationDialog({
		headerTerm: "You are being redirected to another administration.",
		headerTermId: 15585,
		okFunction: function () {
			SysWindow.SwitchDivision(division);
		}
	});
}

function SysColumnDirty(b) {
	/// <summary>Returns true if b is true; else displays a 'No data selected' dialog or pop-up, depending on user agent</summary>
	/// <param name="b" type="boolean">Condition</param>
	if (b)
		return true
	else {
		SysNoDataSelected();
		return false;
	}
}

function SysColumnDeleteAsk(b, okHandler) {
	if (b) {
		SysConfirmDelete(0, null, okHandler);
	}
	else {
		SysNoDataSelected();
	}
}

function SysColumnCancelAsk(b, okHandler) {
	if (b) {
		QuestionDialog.Show(1021, 'Cancel', 55589, "Do you want to cancel?", okHandler);
	}
	else {
		SysNoDataSelected();
	}
}

function SysNoDataSelected() {
	if (Dialog.ShowDialog()) {
		new InformationDialog({
			headerTerm: "No data selected.",
			headerTermId: 20060
		});
	}
	else {
		SysConfirm(3);
	}
}

// SysAlert
function SysAlert(captionid, caption, width, height, explanation, func, funcParameters) {
	/// <summary>Shows an alert with an OK button</summary>
	/// <param name="func" type="function">Handler function</param>
	/// <param name="funcParameters" type="object">Parameters object for the func function</param>
	if (Dialog.ShowDialog()) {
		var options = {
			headerTerm: caption,
			headerTermId: captionid,
			messageTerm: explanation,
			handler: function () {
				if (typeof func === "function") {
					func(funcParameters);
				}
			}
		};
		if (SysElement.IsNotEmpty(width)) {
			options.width = width;
		}
		if (SysElement.IsNotEmpty(height)) {
			options.height = height;
		}
		new InformationDialog(options);
	}
	else {
		SysConfirm(5, captionid, caption, width, height, explanation);
		if (typeof func === "function") {
			func(funcParameters);
		}
	}
}

// SysErrorMessage
function SysErrorMessage(e) {
	/// <summary>Shows the error message, corresponding to the specified element, in a pop-up or dialog</summary>
	var el = new SysElement(e);
	if (!el.empty) {
		var g = SysGuid();
		var rawMsg = el.element.html();
		var msg = $("<span id='" + g + "' style='display:none'>" + rawMsg + "</span>");
		$("body").append(msg);

		var height = el.Height() + 80;
		if (!Dialog.ShowDialog()) {
			var response = SysShowModal("SysErrorMessage.aspx?ErrorMessageID=" + g, window, "500px", height + "px", null, null, "scroll:no");
			if (response) {
				SysLocation(response);
			}
			else {
				msg.remove();
			}

		}
	}
}

//ShowWarningMessage
function SysShowWarningMessage(message, showWarningAsPopup, warningDivId, returnFocus) {
	/// <summary>Show warning message, show warning popup if showWarningAsPopup</summary>
	var warningMessage = null;
	if (message) {
		if ($("#" + warningDivId).length == 0) {
			var div = '<div class="Message Warning" id="' + warningDivId + '">';
			div += '<img src="images/dialog_Warning_icon2.png" alt="" />';
			div += '<span>';
			div += '</span>';
			div += '</div>';
			warningMessage = $(div);
			var bb = $(".exButtonBar");
			if (bb.length > 0) {
				bb.eq(0).after(warningMessage);
			}
		}
		else {
			warningMessage = $("#" + warningDivId);
		}
		warningMessage.show().find('span').html(SysHtmlEncode(message));
		if (showWarningAsPopup) {
			new WarningDialog(
					{
						headerTerm: message,
						width: 300,
						returnFocus: new SysElement(returnFocus)
					});
		}
	}
};function SysTerm(termId, term, suffixId, suffix) {
	/// <summary>Returns the translation of the specified strings, using the normal term concatentation rules</summary>
	/// <remarks>Uses cached terms, if possible. If not possible, then it uses a callback to retrieve the translation server side</remarks>
	var term1 = FindCachedTerm(termId, term);
	var term2 = null;
	var separator = null;
	if (suffix) {
		separator = GetSeparator(suffix);
		var realSuffix = suffix;
		if (!SysElement.IsEmpty(separator)) {
			realSuffix = suffix.substring(1);
		}
		term2 = FindCachedTerm(suffixId, realSuffix);
	}
	if (!term1 || (suffix && !term2)) {
		//One or both terms not found in cache: retrieve constructed term via callback
		var url = "SysCallBack.aspx?Action=3";
		if (termId != null) {
			url += "&CaptionID=" + termId; 
		}
		if (suffixId != null) {
			url += "&SuffixID=" + suffixId; 
		}
		var result = SysCallback(url, null, null, 'json');
		term1 = result.term;
		if (!term1) term1 = term;
		term2 = result.suffix
		if (!term2) term2 = suffix;
	}

	if (term2) {
		//With suffix from cache: construct the terms from cache
		return ConstructTerm(term1, separator, term2);
	}
	else {
		//Without suffix from cache
		return term1;
	}

	function GetSeparator(suffix) {
		if (!isNaN(parseInt(suffix))) {
			//Numeric suffix
			return "";
		}
		var firstSuffix = suffix[0];
		switch (firstSuffix) {
			case ":":
			case ",":
			case "&":
			case "=":
			case "-":
			case "+":
			case "/":
			case " ":
			case "(":
			case "|":
				return firstSuffix;
		}
		return "";
	}

	function ConstructTerm(term1, separator, term2) {
		if (!isNaN(parseInt(term2))) {
			//Numeric suffix
			return term1 + " " + term2;
		}
		else {
			if (SysElement.IsEmpty(separator)) {
				separator = "("
			}
			switch (separator) {
				case ":":
				case ",":
					return term1 + separator + " " + term2;
					break;
				case "&":
				case "=":
				case "-":
				case "+":
				case "/":
				case "|":
					return term1 + " " + separator + " " + term2;
					break;
				case " ":
					return term1 + " " + term2;
					break;
				case "(":
					return term1 + " (" + term2 + ")";
			}
		}
	}
}

function FindCachedTerm(termId, termString, language) {
	/// <summary>Returns the cached term in the specified language, if language and term are found in the cache.
	/// If language is not specified, use the document language
	/// If termId is not specified or <=0, then return the specified termString
	/// Returns null in all other cases
	/// </summary>
	if (!termId || termId <= 0) {
		return termString;
	}
	if (!language) {
		language = document.documentElement.lang;
	}
	var languageId = LanguageIds[language.toLowerCase()];
	if (languageId !== undefined) {
		var term = CachedTerms[termId];
		if (term != undefined) {
			return term[languageId];
		}
	}
	return null;
}
;/*
Don't modify this file manually.
Instead, modify file xml\ClientCachedTerms.xml and regenerate the javascript with docs\_GenerateClientCachedTerms.aspx (= Menu [Development\Tools\Generate CachedTerms.js]).
You should do this every time:
- You want to add more terms which must be cached on the client
- You add or remove available languages
- Any of the translations of these terms is modified
*/

var LanguageIds = {
	"en": 0,
	"nl": 1,
	"nl-be": 2,
	"fr-be": 3,
	"en-us": 4,
	"de": 5,
	"fr": 6
};

var CachedTerms = {
	9830: ["OK", "OK", "OK", "OK", "OK", "OK", "OK"],
	1014: ["Yes", "Ja", "Ja", "Oui", "Yes", "Ja", "Oui"],
	1015: ["No", "Nee", "Nee", "Non", "No", "Nein", "Non"],
	1021: ["Cancel", "Annuleren", "Annuleren", "Annuler", "Cancel", "Abbrechen", "Annuler"],
	24466: ["Open", "Open", "Openen", "Ouvrir", "Open", "Öffnen", "Ouvrir"],
	16636: ["Delete", "Verwijderen", "Verwijderen", "Supprimer", "Delete", "Löschen", "Supprimer"],
	1016: ["Ignore", "Negeren", "Negeren", "Ignorer", "Ignore", "Ignorieren", "Ignorer"],
	4389: ["Accept", "Accepteren", "Accepteren", "Accepter", "Accept", "Annehmen", "Accepter"],
	26862: ["Exact Online", "Exact Online", "Exact Online", "Exact Online", "Exact Online", "Exact Online", "Exact Online"],
	4467: ["Error", "Fout", "Fout", "Erreur", "Error", "Fehler", "Erreur"],
	3749: ["Warning", "Waarschuwing", "Waarschuwing", "Avertissement", "Warning", "Warnung", "Avertissement"],
	8642: ["Information", "Informatie", "Informatie", "Informations", "Information", "Informationen", "Informations"],
	6340: ["Question", "Vraag", "Vraag", "Question", "Question", "Frage", "Question"],
	21189: ["Confirmation", "Bevestiging", "Bevestiging", "Confirmation", "Confirmation", "Bestätigung", "Confirmation"],
	6593: ["Confirm", "Bevestigen", "Bevestigen", "Confirmer", "Confirm", "Bestätigen", "Confirmer"],
	4650: ["Save changes?", "Wijzigingen bewaren?", "Wijzigingen bewaren?", "Sauvegarder les modifications?", "Save changes?", "Wirklich ändern?", "Enregistrer les modifications?"],
	15585: ["You are being redirected to another company.", "U wordt doorgestuurd naar een andere administratie.", "U wordt doorgestuurd naar een andere administratie", "Vous êtes renvoyé vers une autre administration", "You are being redirected to another administration.", "Sie werden zu einem anderen Mandanten umgeleitet.", "Vous êtes renvoyé vers une autre administration"],
	20060: ["No data selected.", "Geen gegevens geselecteerd.", "Geen gegevens geselecteerd.", "Aucune donnée sélectionnée.", "No data selected.", "Daten auswählen", "Aucune donnée sélectionnée."],
	24522: ["Save", "Bewaren", "Bewaren", "Enregistrer", "Save", "Speichern", "Enregistrer"],
	8450: ["Close", "Sluiten", "Sluiten", "Fermer", "Close", "Schließen", "Fermer"],
	1146: ["Delete entry", "Boeking verwijderen", "Boeking verwijderen", "Supprimer écriture", "Delete entry", "Buchung löschen", "Supprimer écriture"],
	1866: ["Delete entries", "Boekingen verwijderen", "Boekingen verwijderen", "Supprimer les écritures", "Delete entries", "Buchungen löschen", "Supprimer les écritures"],
	50419: ["Delete all lines", "Alle regels verwijderen", "Alle regels verwijderen", "Supprimer toutes les lignes", "Delete all lines", "Alle Zeilen löschen", "Supprimer toutes les lignes"],
	50418: ["Delete invoice", "Factuur verwijderen", "Factuur verwijderen", "Supprimer la facture", "Delete invoice", "Rechnung löschen", "Supprimer la facture"],
	1055: ["Delete invoices", "Facturen verwijderen", "Facturen verwijderen", "Supprimer factures", "Delete invoices", "Rechnungen löschen", "Supprimer factures"],
	54047: ["Do you want to continue?", "Wilt u doorgaan?", "Wilt u doorgaan?", "Voulez-vous continuer?", "Do you want to continue?", "Wollen Sie fortfahren?", "Voulez-vous continuer?"],
	59599: ["Guided tours", "Rondleidingen", "Rondleidingen", "Visites guidée", "Guided tours", "Geführte Touren", "Visites guidées"],
	234: ["Process", "Verwerken", "Verwerken", "Traiter", "Process", "Verarbeiten", "Traiter"],
	1114: ["Invoice date", "Factuurdatum", "Factuurdatum", "Date de facturation", "Invoice date", "Rechnungsdatum", "Date de facturation"],
	1193: ["Financial year", "Boekjaar", "Boekjaar", "Exercice", "Financial year", "Geschäftsjahr", "Exercice comptable"],
	1305: ["Balance is negative!", "Saldo is negatief!", "Saldo is negatief!", "Solde négatif !", "Balance is negative!", "Saldo ist negativ!", "Solde négatif !"],
	4627: ["Entry number", "Boekstuknummer", "Boekstuknummer", "N° de pièce", "Entry number", "Belegnummer", "N° d\'écriture"],
	5771: ["Period", "Periode", "Periode", "Période", "Period", "Periode", "Période"],
	6476: ["Continue?", "Doorgaan?", "Doorgaan?", "Continuer ?", "Continue?", "Weiter?", "Continuer ?"],
	7593: ["Header amount isn\'t the same as the total of the amounts in the lines.", "Bedrag in de kop en het totaalbedrag van de invoerregels zijn ongelijk.", "Bedrag in de kopregel en het totaalbedrag van de subregels zijn ongelijk.", "Le montant de l\'en-tête ne correspond pas au total des lignes.", "Header amount isn\'t the same as the total of the amounts in the lines.", "Der Kopfzeilenbetrag und die Summe der Beträge aus den Buchungszeilen stimmen nicht überein. Die Umsatzsteuer wurde nicht berücksichtigt.", "Le montant de l\'en-tête ne correspond pas au total des lignes."],
	8187: ["Total amount", "Totaalbedrag", "Totaalbedrag", "Montant total", "Total amount", "Gesamtbetrag", "Montant total"],
	8516: ["Date", "Datum", "Datum", "Date", "Date", "Datum", "Date"],
	8639: ["Previous", "Vorige", "Vorige", "Précédent", "Previous", "Vorige", "Précédent"],
	8852: ["Next", "Volgende", "Volgende", "Suivant", "Next", "Nächste", "Suivant"],
	9023: ["Must be greater than", "Moet groter zijn dan", "Moet groter zijn dan", "Doit être supérieur à", "Must be greater than", "Größer als", "Doit être supérieur à"],
	9085: ["Already processed", "Reeds verwerkt", "Reeds verwerkt", "Déjà effectué", "Already processed", "Bereits verarbeitet", "Déjà traité"],
	15426: ["Lines", "Regels", "Regels", "Lignes", "Lines", "Zeilen", "Lignes"],
	15934: ["Correct closing balance automatically?", "Eindsaldo automatisch corrigeren?", "Eindsaldo automatisch corrigeren?", "Corriger le solde final automatiquement ?", "Correct closing balance automatically?", "Abschlussbilanz automatisch korrigieren?", "Corriger le solde de clôture automatiquement ?"],
	17352: ["Reopen", "Heropenen", "Heropenen", "Réouvrir", "Reopen", "Wiedereröffnen", "Rouvrir"],
	18085: ["Invalid combination", "Ongeldige combinatie", "Ongeldige combinatie", "Combinaison incorrecte", "Invalid combination", "Ungültige Kombination", "Combinaison incorrecte"],
	25319: ["Edit", "Bewerken", "Bewerken", "Modifier", "Edit", "Bearbeiten", "Modifier"],
	30830: ["Would you like to continue?", "Wilt u doorgaan?", "Wilt u doorgaan?", "Êtes-vous sûr de vouloir continuer ?", "Would you like to continue?", "Möchten Sie fortfahren?", "Êtes-vous sûr de vouloir continuer ?"],
	54005: ["Order number", "Bestelnummer", "Bestelnummer", "Numéro de commande", "Order number", "Bestellnummer", "Numéro de commande"],
	55590: ["Do you want to delete?", "Wilt u verwijderen?", "Wilt u verwijderen?", "Voulez-vous supprimer ?", "Do you want to delete?", "Wollen Sie löschen?", "Voulez-vous supprimer ?"],
	55592: ["Do you want to process?", "Wilt u verwerken?", "Wilt u verwerken?", "Voulez-vous traiter ?", "Do you want to process?", "Wollen Sie ausführen?", "Voulez-vous traiter ?"],
	55600: ["Do you want to reopen?", "Wilt u heropenen?", "Wilt u heropenen?", "Voulez-vous rouvrir ?", "Do you want to reopen?", "Wollen Sie erneut öffnen?", "Voulez-vous rouvrir ?"],
	20615: ["Correct invoice amount automatically?", "Factuurbedrag automatisch corrigeren?", "Kopregelbedrag automatisch corrigeren?", "Modifier automatiquement le montant de l\'en-tête ?", "Correct invoice amount automatically?", "Kopfzeilenbetrag automatisch berichtigen?", "Modifier automatiquement le montant de l\'en-tête ?"],
	58014: ["Drop your files and create a new document", "Sleep uw bijlage(n) en maak een nieuw document aan", "Sleep uw bijlage(n) en maak een nieuw document aan", "Déposez vos fichiers et créez un nouveau document", "Drop your files and create a new document", "Legen Sie Ihre Datei(en) ab und erstellen Sie ein neues Dokument", "Déposez vos fichiers et créez un nouveau document"],
	57503: ["Create a new document", "Een nieuw document aanmaken", "Een nieuw document aanmaken", "Créer un nouveau document", "Create a new document", "Ein neues Dokument erstellen", "Créer un nouveau document"],
	161: ["Not allowed", "Niet toegestaan", "Niet toegestaan", "Non autorisé", "Not allowed", "Nicht erlaubt", "Non autorisé"],
	240: ["Customer", "Klant", "Klant", "Client", "Customer", "Kunde", "Client"],
	330: ["Generate", "Genereren", "Genereren", "Générer", "Generate", "Generieren", "Générer"],
	561: ["Entry", "Invoer", "Invoer", "Encodage", "Entry", "Eingabe", "Saisie"],
	1053: ["Invoice number", "Factuurnummer", "Factuurnummer", "N° facture", "Invoice number", "Rechnungsnummer", "N° facture"],
	1103: ["Update", "Bijwerken", "Bijwerken", "Mettre à jour", "Update", "Update", "Mettre à jour"],
	1391: ["Warehouse", "Magazijn", "Magazijn", "Dépôt", "Warehouse", "Lager", "Magasin"],
	1435: ["Copy", "Kopie", "Kopie", "copie", "Copy", "Kopie", "copie"],
	1795: ["Mandatory", "Verplicht", "Verplicht", "Obligatoire", "Mandatory", "Obligatorisch", "Obligatoire"],
	3801: ["Type", "Type", "Type", "Type", "Type", "Art", "Type"],
	5098: ["Supplier", "Leverancier", "Leverancier", "Fournisseur", "Supplier", "Lieferant", "Fournisseur"],
	7353: ["Merge", "Samenvoegen", "Samenvoegen", "Fusion", "Merge", "Zusammenführen", "Fusion"],
	7626: ["If you continue, your changes won\'t be saved.", "Als u doorgaat, worden de wijzigingen niet bewaard.", "Als u doorgaat, worden de wijzigingen niet bewaard.", "Si vous poursuivez, vos modifications ne seront pas conservées.", "If you continue, your changes won\'t be saved.", "Weiter = Änderungen nicht gespeichert.", "Si vous poursuivez, vos modifications ne seront pas conservées."],
	8471: ["Complete", "Volledig", "Volledig", "Entièrement", "Complete", "Vollständig", "Clôturé"],
	8501: ["Create revaluation", "Herwaardering aanmaken", "Herwaardering aanmaken", "Générer", "Create revaluation", "Neubewertung erstellen", "Créer réévaluation"],
	8577: ["Export", "Exporteren", "Exporteren", "Exporter", "Export", "Exportieren", "Exporter"],
	8795: ["Serial numbers", "Serienummers", "Serienummers", "Numéros de série", "Serial numbers", "Seriennummern", "Numéros de série"],
	9527: ["Batch quantity", "Seriegrootte", "Seriegrootte", "Quantité de lot", "Batch quantity", "Losgröße", "Quantité de lot"],
	9616: ["Quantity", "Aantal", "Aantal", "Nombre", "Quantity", "Anzahl", "Quantité"],
	9753: ["Change", "Wijzigen", "Wijzigen", "Modifier", "Change", "Ändern", "Modifier"],
	15010: ["Order number", "Ordernummer", "Ordernummer", "N° commande", "Order number", "Auftragsnummer", "N° commande"],
	15438: ["Batch numbers", "Batchnummers", "Batchnummers", "Numéros de lot", "Batch numbers", "Chargen-Nr.", "Numéros de lot"],
	20006: ["Invalid", "Ongeldig", "Ongeldig", "Invalide", "Invalid", "Ungültig", "Invalide"],
	52699: ["Deliver", "Leveren", "Leveren", "Livrer", "Deliver", "Liefern", "Livrer"],
	54718: ["Are you sure you want to merge selected sales invoices", "Weet u zeker dat u de geselecteerde facturen wilt samenvoegen", "Weet u zeker dat u de geselecteerde facturen wilt samenvoegen", "Êtes-vous certain de vouloir regrouper les factures sélectionnées ?", "Are you sure you want to merge selected sales invoices", "Sind Sie sicher, dass Sie die gewählten Ausgangsrechnungen zusammenführen wollen", "Êtes-vous certain de vouloir regrouper les factures de vente sélectionnées ?"],
	55021: ["Planned quantity", "Geplande hoeveelheid", "Geplande hoeveelheid", "Quantité planifiée", "Planned quantity", "Geplante Menge", "Quantité planifiée"],
	55589: ["Do you want to cancel?", "Wilt u annuleren?", "Wilt u annuleren?", "Voulez-vous annuler ?", "Do you want to cancel?", "Wollen Sie abbrechen?", "Voulez-vous annuler ?"],
	55607: ["A bill of material is already linked to this item and will be overwritten when copying.", "Er is al een stuklijst gekoppeld aan dit artikel en deze wordt bij het kopiëren overschreven.", "Er is al een stuklijst gekoppeld aan dit artikel en deze wordt bij het kopiëren overschreven.", "Il existe déjà une nomenclature liée à cet article et celle-ci sera écrasée lors de la copie.", "A bill of material is already linked to this item and will be overwritten when copying.", "Es ist bereits eine Stückliste an diesen Artikel gekoppelt, die beim Kopieren überschrieben wird.", "Il existe déjà une nomenclature liée à cet article et celle-ci sera écrasée lors de la copie."],
	55624: ["Do you want to create?", "Wilt u aanmaken?", "Wilt u aanmaken?", "Voulez-vous créer ?", "Do you want to create?", "Wollen Sie erstellen?", "Voulez-vous créer ?"],
	55691: ["Do you want to update the cost price of the assembled item based on the calculated cost price of the bill of materials?", "Wilt u de kostprijs van het samengestelde artikel bijwerken op basis van de berekende kostprijs van de onderdelenlijst?", "Wilt u de kostprijs van het samengestelde artikel bijwerken op basis van de berekende kostprijs van de onderdelenlijst?", "Voulez-vous mettre à jour le coût de revient des articles composés en fonction du calcul des coûts de revient de la nomenclature ?", "Do you want to update the standard cost of the assembled item based on the calculated standard cost of the bill of materials?", "Wollen Sie den Kostenpreis des Fertigungsartikels auf Basis des kalkulierten Kostenpreises der Stückliste aktualisieren?", "Voulez-vous mettre à jour le prix de revient des articles composés en fonction du calcul des prix de revient de la nomenclature ?"],
	55859: ["The planned quantity cannot be lower than the quantity that already has been finished", "Het geplande aantal kan niet lager zijn dan het aantal dat al is gereedgemeld", "Het geplande aantal kan niet lager zijn dan het aantal dat al is gereedgemeld", "La quantité prévue ne peut être inférieure à la quantité déjà préparée\x2Fsignalée prête", "The planned quantity cannot be lower than the quantity that already has been finished", "Die geplante Menge kann nicht geringer als die bereits fertiggestellte Menge sein", "La quantité planifiée ne peut être inférieure à la quantité déjà terminée"],
	56285: ["Item is subcontracted. Go to Maintain operations to edit the item code.", "Artikel is uitbesteed. Ga naar Bewerkingen beheren om de artikelcode te bewerken.", "Artikel is uitbesteed. Ga naar Bewerkingen beheren om de artikelcode te bewerken.", "L\'article est en sous-traitance. Allez vers gérer Adaptations afin d\'adapter le code de l\'article.", "Item is subcontracted. Go to Maintain operations to edit the item code.", "Der Artikel befindet sich in einem Unterauftrag. Gehen Sie zu Betriebsablauf verwalten, um den Artikelcode zu bearbeiten.", "L\'article est en sous-traitance. Allez vers gérer Adaptations afin d\'adapter le code d\'article."],
	56761: ["Warehouse transfer", "Magazijnverplaatsing", "Magazijnverplaatsing", "Transfert de magasin", "Warehouse transfer", "Lagerumbuchung", "Transfert de magasin"],
	56852: ["Do you want to update the parts quantities based on the changed batch quantity?", "Wilt u het aantal onderdelen bijwerken op basis van het gewijzigde batchaantal?", "Wilt u het aantal onderdelen bijwerken op basis van het gewijzigde batchaantal?", "Voulez-vous mettre le nombre de pièces à jour sur la base du nombre de lots modifiés ?", "Do you want to update the parts quantities based on the changed batch quantity?", "Möchten Sie die Anzahl der Teile aufgrund der veränderten Chargenmenge aktualisieren?", "Voulez-vous mettre le nombre de pièces à jour sur la base du nombre de lots modifiés ?"],
	56884: ["The \"From\" warehouse\" and \"To\" warehouse\" cannot be the same.", "Het \"Van magazijn\" en het \"Naar magazijn\" mogen niet hetzelfde zijn.", "Het \"Van magazijn\" en het \"Naar magazijn\" mogen niet hetzelfde zijn.", "Le \"De magasin\" et le \"Vers magasin\" ne peuvent pas être semblables.", "The \"From\" warehouse\" and \"To\" warehouse\" cannot be the same.", "‚Zum Lager‘ und ‚Vom Lager‘ dürfen nicht das Gleiche sein.", "Le \"De magasin\" et le \"Vers magasin\" ne peuvent pas être semblables."],
	57610: ["Print sales invoices", "Print verkoopfacturen", "Afdrukken verkoopfacturen", "Imprimer les factures de ventes", "Print sales invoices", "Ausgangsrechnungen drucken", "Imprimer les factures de ventes"],
	59660: ["Non-taxable", "Non-taxable", "Non-taxable", "Non imposable", "Non-taxable", "Nicht steuerpflichtig", "Non imposable"],
	4625: ["Complete", "Afhandelen", "Afhandelen", "Clôturer", "Complete", "Erledigen", "Clôturer"],
	59460: ["Once completed, this action cannot be undone.", "Na uitvoering kan deze actie niet ongedaan worden gemaakt.", "Na uitvoering kan deze actie niet ongedaan worden gemaakt.", "Une fois effectuée, cette opération ne peut pas être annulée.", "Once completed, this action cannot be undone.", "Nach Ausführung kann diese Aktion nicht rückgängig gemacht werden.", "Une fois effectuée, cette opération ne peut pas être annulée."],
	59461: ["After completing the sales order, the remaining goods deliveries and outstanding amounts are considered completed. No additional stock and\x2For financial transactions are created in this process.", "Na het afhandelen van de verkooporder worden de geplande goederenleveringen en te factureren bedragen als afgehandeld beschouwd. Hierbij worden geen aanvullende voorraadtransacties of  financiële boekingen aangemaakt.", "Na het afhandelen van de verkooporder worden de geplande goederenleveringen en te factureren bedragen als afgehandeld beschouwd. Hierbij worden geen aanvullende voorraadtransacties of  financiële boekingen aangemaakt.", "Après avoir terminé la commande client, les livraisons de marchandises restantes et les impayés en cours sont considérés comme terminés. Aucune transaction supplémentaire n\'est créée dans l\'administration des stocks ou dans la comptabilité.", "After completing the sales order, the remaining goods deliveries and outstanding amounts are considered completed. No additional stock and\x2For financial transactions are created in this process.", "Mit Fertigstellung des Verkaufsauftrages werden automatisch offene Lieferungen und Beträge ebenfalls abgeschlossen. Es werden in diesem Prozess keine zusätzlichen Bestände und\x2Foder Finanzbewegungen erstellt.", "Après la clôture de la commande client, les livraisons de marchandises restantes et les en-cours sont considérés comme clôturés. Aucune transaction supplémentaire n\'est créée dans l\'administration des stocks ou dans la comptabilité."],
	59462: ["Do you want to complete the sales order?", "Wilt u de verkooporder afhandelen?", "Wilt u de verkooporder afhandelen?", "Voulez-vous terminer la commande client ?", "Do you want to complete the sales order?", "Möchten Sie den Verkaufsauftrag fertigstellen?", "Voulez-vous clôturer la commande client ?"],
	59463: ["After completing the selected sales order lines, you can no longer process the planned goods delivery. No additional stock transactions are created in this process.", "Na het afhandelen van de geselecteerde verkooporderregels kunt u de geplande goederenleveringen niet meer verwerken. Hierbij worden geen aanvullende voorraadtransacties aangemaakt.", "Na het afhandelen van de geselecteerde verkooporderregels kunt u de geplande goederenleveringen niet meer verwerken. Hierbij worden geen aanvullende voorraadtransacties aangemaakt.", "Après avoir terminé les lignes de commande client sélectionnées, vous ne pouvez plus traiter la livraison de marchandises planifiée. Aucune transaction de stock supplémentaire n\'est créée.", "After completing the selected sales order lines, you can no longer process the planned goods delivery. No additional stock transactions are created in this process.", "Nach Fertigstellung der gewählten Verkaufsauftragszeilen können die geplanten Warenanlieferungen nicht mehr verarbeitet werden. Es werden in diesem Prozess keine zusätzlichen Bestandsbewegungen erstellt.", "Après la clôture des lignes de commande client sélectionnées, vous ne pouvez plus traiter la livraison de marchandises planifiée. Aucune transaction de stock supplémentaire n\'est créée."],
	59464: ["Do you want to complete the sales order lines?", "Wilt u de verkooporderregels afhandelen?", "Wilt u de verkooporderregels afhandelen?", "Voulez-vous terminer les lignes sélectionnées de la commande client ?", "Do you want to complete the sales order lines?", "Möchten Sie die Verlaufsausftragszeilen fertigstellen?", "Voulez-vous clôturer les lignes de commande client sélectionnées ?"],
	59465: ["After completing the selected sales order lines, you can no longer invoice the outstanding amounts. No additional financial transactions are created in this process.", "Na het afhandelen van de geselecteerde verkooporderregels kunt u de openstaande bedragen niet meer factureren. Hierbij worden geen aanvullende financiële boekingen aangemaakt.", "Na het afhandelen van de geselecteerde verkooporderregels kunt u de openstaande bedragen niet meer factureren. Hierbij worden geen aanvullende financiële boekingen aangemaakt.", "Après avoir terminé les lignes de commande client sélectionnées, vous ne pouvez plus facturer les montants impayés. Aucune transaction comptable supplémentaire n\'est créée.", "After completing the selected sales order lines, you can no longer invoice the outstanding amounts. No additional financial transactions are created in this process.", "Nach Fertigstellung der gewählten Verkaufsauftragszeilen können die offenen Beträge nicht mehr fakturiert werden. Es werden in diesem Prozess keine zusätzlichen Finanzbewegungen erstellt.", "Après la clôture des lignes de commande client sélectionnées, vous ne pouvez plus facturer les montants impayés. Aucune transaction comptable supplémentaire n\'est créée."],
	59466: ["Do you want to complete the purchase order?", "Wilt u de bestelling afhandelen?", "Wilt u de bestelling afhandelen?", "Voulez-vous terminer la commande fournisseur ?", "Do you want to complete the purchase order?", "Möchten Sie die Bestellung fertigstellen?", "Voulez-vous clôturer la commande fournisseur ?"],
	59467: ["After completing the purchase order, the remaining goods receipts and outstanding invoices to be received are considered completed. No additional stock and\x2For financial transactions are created in this process.", "Na het afhandelen van de bestelling, worden de geplande goederenontvangsten en te ontvangen facturen als afgehandeld beschouwd. Hierbij worden geen aanvullende voorraadtransacties of financiële boekingen aangemaakt. Het afhandelen kan niet ongedaan worden", "Na het afhandelen van de bestelling, worden de geplande goederenontvangsten en te ontvangen facturen als afgehandeld beschouwd. Hierbij worden geen aanvullende voorraadtransacties of financiële boekingen aangemaakt. Het afhandelen kan niet ongedaan worden", "Après avoir terminé la commande fournisseur, les réceptions de marchandises restantes et les factures à recevoir sont considérées comme terminées. Aucune transaction supplémentaire n\'est créée dans l\'administration des stocks ou dans la comptabilité.", "After completing the purchase order, the remaining goods receipts and outstanding invoices to be received are considered completed. No additional stock and\x2For financial transactions are created in this process.", "Nach Fertigstellung der Bestellung erscheinen die Warenanlieferungen und fälligen Rechnungen (Zu empfangen) als komplett. Es werden in diesem Prozess keine zusätzlichen Bestände und\x2Foder Finanzbewegungen erstellt.", "Après la clôture de la commande fournisseur, les réceptions de marchandises restantes et les factures à recevoir sont considérées comme clôturées. Aucune transaction supplémentaire n\'est créée dans l\'administration des stocks ou dans la comptabilité."],
	59469: ["After completing the selected purchase order lines, you can no longer process the planned goods receipt. No additional stock transactions are created in this process.", "Na het afhandelen van de geselecteerde bestelregels kunt u de geplande goederenonvangsten niet meer verwerken. Hierbij worden geen aanvullende voorraadtransacties aangemaakt.", "Na het afhandelen van de geselecteerde bestelregels kunt u de geplande goederenonvangsten niet meer verwerken. Hierbij worden geen aanvullende voorraadtransacties aangemaakt.", "Après avoir terminé les lignes de commande fournisseur sélectionnées, vous ne pouvez plus traiter la réception de marchandises planifiée. Aucune transaction de stock supplémentaire n\'est créée.", "After completing the selected purchase order lines, you can no longer process the planned goods receipt. No additional stock transactions are created in this process.", "Nach Fertigstellung der gewählten Bestellzeilen können die geplanten Wareneingänge nicht mehr verarbeitet werden. Es werden in diesem Prozess keine zusätzlichen Bestandsbewegungen erstellt.", "Après la clôture des lignes de commande fournisseur sélectionnées, vous ne pouvez plus traiter la réception de marchandises planifiée. Aucune transaction de stock supplémentaire n\'est créée."],
	59470: ["After completing the selected purchase order lines, you can no longer link the purchase invoice. No additional financial transactions are created in this process.", "Na het afhandelen van de geselecteerde bestelregels kunt u de inkoopfactuur niet meer koppelen. Hierbij worden geen aanvullende financiële boekingen aangemaakt.", "Na het afhandelen van de geselecteerde bestelregels kunt u de inkoopfactuur niet meer koppelen. Hierbij worden geen aanvullende financiële boekingen aangemaakt.", "Après avoir terminé les lignes de commande fournisseur sélectionnées, vous ne pouvez plus lier la facture d\'achat. Aucune transaction comptable supplémentaire n\'est créée.", "After completing the selected purchase order lines, you can no longer link the purchase invoice. No additional financial transactions are created in this process.", "Nach Fertigstellung der gewählten Bestellzeilen können Sie die Eingangsrechnung nicht mehr koppeln. Es werden in diesem Prozess keine zusätzlichen Finanzbewegungen erstellt.", "Après la clôture des lignes de commande fournisseur sélectionnées, vous ne pouvez plus lier la facture d\'achat. Aucune transaction comptable supplémentaire n\'est créée."],
	59471: ["Do you want to complete the assembly order?", "Wilt u de assemblageorder afhandelen?", "Wilt u de assemblageorder afhandelen?", "Voulez-vous terminer l\'ordre d\'assemblage?", "Do you want to complete the assembly order?", "Möchten Sie den Fertigungsauftrag abschließen?", "Voulez-vous clôturer l\'ordre d\'assemblage?"],
	59472: ["After completing the assembly order, you can no longer make any changes to this entry. No additional stock transactions or financial entries are made for the item or its parts.", "Na het afhandelen van de assemblageorder kunt u deze niet langer meer gereedmelden. Hierbij worden geen aanvullende voorraadtransacties of financiële boekingen aangemaakt.", "Na het afhandelen van de assemblageorder kunt u deze niet langer meer gereedmelden. Hierbij worden geen aanvullende voorraadtransacties of financiële boekingen aangemaakt.", "Après avoir terminé l\'ordre d\'assemblage, vous ne pouvez plus modifier cette écriture. Aucune nouvelle transaction de stock ni d\'écriture comptable n\'est créée pour cet article ou ces composants.", "After completing the assembly order, you can no longer make any changes to this entry. No additional stock transactions or financial entries are made for the item or its parts.", "Nach Abschluß des Fertigungsauftrages können Sie keine Änderungen mehr an diesem Eintrag ausführen. Es werden keine zusätzlichen Bestandsbewegungen oder Finanzbuchungen für diesen Artikel oder Teile davon erstellt.", "Après la clôture de l\'ordre d\'assemblage, vous ne pouvez plus modifier cette écriture. Aucune nouvelle transaction de stock ni d\'écriture comptable n\'est créée pour cet article ou ces composants."],
	59474: ["After completing the selected assembly orders, you can no longer make any changes to these entries. No additional stock transactions or financial entries are made for the item or its parts.", "Na het afhandelen van de geselecteerde assemblageorders kunt u deze niet langer meer gereedmelden. Hierbij worden geen aanvullende voorraadtransacties of financiële boekingen aangemaakt.", "Na het afhandelen van de geselecteerde assemblageorders kunt u deze niet langer meer gereedmelden. Hierbij worden geen aanvullende voorraadtransacties of financiële boekingen aangemaakt.", "Après avoir terminé les ordres d\'assemblage sélectionnés, vous ne pouvez plus modifier ces écritures. Aucune nouvelle transaction de stock ou d\'écriture comptable n\'est créée pour cet article ou pour ses composants.", "After completing the selected assembly orders, you can no longer make any changes to these entries. No additional stock transactions or financial entries are made for the item or its parts.", "Nach Abschluß der gewählten Fertigungsaufträge können Sie keine Änderungen mehr an diesen Einträgen ausführen. Es werden keine zusätzlichen Bestandsbewegungen oder Finanzbuchungen für diesen Artikel oder Teile davon erstellt.", "Après la clôture des ordres d\'assemblage sélectionnés, vous ne pouvez plus modifier ces écritures. Aucune nouvelle transaction de stock ou d\'écriture comptable n\'est créée pour cet article ou pour ses composants."],
	62997: ["Linked prepayment", "Linked prepayment", "Linked prepayment", "Linked prepayment", "Linked prepayment", "Linked prepayment", "Linked prepayment"],
	63506: ["Link prepayment", "Link prepayment", "Link prepayment", "Link prepayment", "Link prepayment", "Link prepayment", "Link prepayment"],
	43: ["Archive", "Archiveren", "Archiveren", "Archive", "Archive", "Archiv", "Archive"],
	5255: ["Copy", "Kopiëren", "Kopiëren", "Copier", "Copy", "Kopieren", "Copie"],
	15419: ["Recode", "Vernummer", "Vernummer", "Renuméroter", "Recode", "Umnummerieren", "Renuméroter"],
	54596: ["You are about to archive this company. Once archived, the company can be consulted, but no longer modified.", "U gaat deze administratie archiveren. Eenmaal gearchiveerd, kan de administratie worden geraadpleegd, maar niet meer worden gewijzigd.", "U gaat deze administratie archiveren. Eenmaal gearchiveerd, kan de administratie worden geraadpleegd, maar niet meer worden gewijzigd.", "Vous êtes sur le point d\'archiver cette administration. Une fois archivée, vous pourrez la consulter, mais non pas la modifier.", "You are about to archive this company. Once archived, the company can be consulted, but no longer modified.", "Sie sind gerade dabei diesen Mandanten zu archivieren. Sobald dieser archiviert wurde, kann der Mandant zwar eingesehen werden, aber es können keine Änderungen mehr vorgenommen werden.", "Vous êtes sur le point d\'archiver cette administration. Une fois archivée, vous pourrez la consulter, mais non pas la modifier."],
	89: ["Hide", "Verbergen", "Verbergen", "Masquer", "Hide", "Verbergen", "Masquer"],
	57231: ["back to top", "naar boven", "naar boven", "retour au début de la page", "back to top", "zurück zum Anfang", "retour au début de la page"],
	2683: ["Quotation number", "Offertenummer", "Offertenummer", "N° offre", "Quotation number", "Angebotsnummer", "N° devis"],
	3214: ["Planning", "Planning", "Planning", "Planning", "Planning", "Planung", "Planification"],
	5413: ["Totals", "Totalen", "Totalen", "Totaux", "Totals", "Summen", "Totaux"],
	6212: ["No VAT", "Geen BTW", "Geen BTW", "Pas de TVA", "No TAX", "Keine USt.", "Sans TVA"],
	8420: ["Calculate", "Berekenen", "Berekenen", "Calculer", "Calculate", "Berechnen", "Calculer"],
	8521: ["Default", "Standaard", "Standaard", "Par défaut", "Default", "Standard", "Défaut"],
	8725: ["Line", "Regel", "Regel", "Ligne", "Line", "Zeile", "Ligne"],
	8904: ["Total", "Totaal", "Totaal", "Total", "Total", "Summe", "Total"],
	8930: ["VAT", "BTW", "BTW", "TVA", "Tax", "USt.", "TVA"],
	10679: ["Absence", "Verzuim", "Afwezigheid", "Absence", "Absence", "Abwesenheit", "Absence"],
	16907: ["Unlink", "Ontkoppelen", "Ontkoppelen", "Délier", "Unlink", "Entkoppeln", "Supprimer lien"],
	19258: ["Average", "Gemiddeld", "Gemiddeld", "Moyenne", "Average", "Durchsch.", "Moyenne"],
	20180: ["Create", "Aanmaken", "Aanmaken", "Créer", "Create", "Anlegen", "Créer"],
	20908: ["Reset", "Herstellen", "Herstellen", "Réinitialiser", "Reset", "Wiederherst.", "Réinitialiser"],
	21257: ["Open", "Open", "Open", "Ouvert", "Open", "Offen", "Ouvert"],
	24011: ["Standard", "Standaard", "Standaard", "Standard", "Standard", "Standard", "Standard"],
	41347: ["Print timesheet", "Print urenstaat", "Afdrukken urenstaat", "Imprimer feuille de temps", "Print timesheet", "Stundenerfassung drucken", "Imprimer feuille de temps"],
	50108: ["Start from scratch", "Opnieuw beginnen", "Opnieuw beginnen", "Recommencer à zéro", "Start from scratch", "Von vorne anfangen", "Recommencer à zéro"],
	51358: ["Create opportunity?", "Verkoopkans aanmaken?", "Opportunity aanmaken?", "Créer une opportunité?", "Create opportunity?", "Verkaufsgelegenheit anlegen?", "Créer une opportunité?"],
	51483: ["Leave", "Verlof", "Verlof", "Congé", "Leave", "Urlaub", "Congé"],
	54951: ["Back to Submitted", "Terug naar Ingediend", "Terug naar Ingediend", "Retour à Introduit", "Back to Submitted", "Zurück zu Gesendet", "Retour au statut \'Soumis\'"],
	56351: ["No financial year exists for the entered year\x2Fmonth combination. Therefore this year\x2Fmonth combination cannot be used in financial entries.", "Er bestaat geen boekjaar voor de ingevoerde jaar\x2Fmaand combinatie. Hierdoor kan deze jaar\x2Fmaand combinatie niet gebruikt worden in financiële boekingen.", "Er bestaat geen boekjaar voor de ingevoerde jaar\x2Fmaand combinatie. Hierdoor kan deze jaar\x2Fmaand combinatie niet gebruikt worden in boekingen.", "Il n\'existe pas d\'exercice comptable pour la combinaison année\x2Fmois introduite. De ce fait, cette combinaison année\x2Fmois ne peut être utilisée dans des écritures comptables.", "No financial year exists for the entered year\x2Fmonth combination. Therefore this year\x2Fmonth combination cannot be used in financial entries.", "Für diese Kombination aus Jahr\x2FMonat besteht kein Geschäftsjahr. Deshalb kann diese Kombination aus Jahr\x2FMonat nicht in Finanzbuchung genutzt werden.", "Il n\'existe pas d\'exercice comptable pour la combinaison année\x2Fmois introduite. De ce fait, cette combinaison année\x2Fmois ne peut être utilisée dans des écritures comptables."],
	56354: ["Create the financial year", "Genereren boekjaar", "Genereren boekjaar", "Créer l\'exercice comptable", "Create the financial year", "Geschäftsjahr erstellen", "Créer l\'exercice comptable"],
	56355: ["To create this financial year without leaving the current screen, click:", "Om dit boekjaar nu te genereren zonder het huidige scherm te verlaten, klik:", "Om dit boekjaar nu te genereren zonder het huidige scherm te verlaten, klik:", "Pour créer cet exercice comptable sans quitter l\'écran actuel, appuyez sur :", "To create this financial year without leaving the current screen, click:", "Um dieses Geschäftsjahr zu erstellen, ohne den aktuellen Bildschirm zu verlassen, klicken Sie:", "Pour créer cet exercice comptable sans quitter l\'écran actuel, appuyez sur :"],
	56356: ["Would you like to create this financial year now without leaving the current screen?", "Wilt u dit boekjaar nu genereren zonder het huidige scherm te verlaten?", "Wilt u dit boekjaar nu genereren zonder het huidige scherm te verlaten?", "Voulez-vous créer cet exercice comptable maintenant sans quitter l\'écran actuel?", "Would you like to create this financial year now without leaving the current screen?", "Möchten Sie dieses Geschäftsjahr erstellen, ohne den aktuellen Bildschirm zu verlassen?", "Voulez-vous créer cet exercice comptable maintenant sans quitter l\'écran actuel?"],
	56357: ["The financial year {0} does not exist and therefore cannot be used in financial entries.", "Het boekjaar {0} bestaat niet en kan daarom niet worden gebruikt in financiële boekingen.", "Het boekjaar {0} bestaat niet en kan daarom niet worden gebruikt in boekingen.", "L\'exercice comptable {0} n\'existe pas et ne peut, de ce fait, être utilisé dans des écritures comptables.", "The financial year {0} does not exist and therefore cannot be used in financial entries.", "Geschäftsjahr {0} besteht nicht und kann deshalb nicht in Finanzeinträgen verwendet werden.", "L\'exercice comptable {0} n\'existe pas et ne peut, de ce fait, être utilisé dans des écritures comptables."],
	56793: ["Release invoice term", "Factuurtermijn vrijgeven", "Factuurtermijn vrijgeven", "Libérer le délai de facture", "Release invoice term", "Rechnungsbedingung freigeben", "Valider le délai de facture"],
	57066: ["Quick links", "Snel naar", "Snel naar", "Liens rapides", "Quick links", "Quick Links", "Liens rapides"],
	57189: ["Disclaimer", "Disclaimer", "Disclaimer", "Clause de non-responsabilité", "Disclaimer", "Haftungsausschluss", "Mentions Légales"],
	57369: ["Some invoices have errors. Go to Customize and add the column (Validation error) to see the errors.", "Er zijn fouten op sommige facturen. Ga naar \'Aanpassen\' en voeg de kolom \'Validatiefout\' toe om de foutmelding te zien.", "Er zijn fouten op sommige facturen. Ga naar \'Aanpassen\' en voeg de kolom \'Validatiefout\' toe om de foutmelding te zien.", "Certaines factures contiennent des erreurs. Allez à la page « Personnaliser » et ajoutez la colonne (erreur de validation) pour voir les erreurs.", "Some invoices have errors. Go to Customize and add the column (Validation error) to see the errors.", "Einige Rechnungen enthalten Fehler. Gehen Sie zu Anpassen und fügen Sie die Spalte (Validierungsfehler) hinzu, um die Fehlermeldungen ansehen zu können.", "Certaines factures contiennent des erreurs. Allez à la page « Personnaliser » et ajoutez la colonne (erreur de validation) pour voir les erreurs."],
	57744: ["Please select an account first", "Selecteer eerst een relatie", "Selecteer eerst een relatie", "Veuillez tout d\'abord sélectionner une relation", "Please select an account first", "Bitte wählen Sie erst einen Kontakt", "Veuillez tout d\'abord sélectionner un tiers"],
	57959: ["Create document(s)", "Document(en) aanmaken", "Document(en) aanmaken", "Créer document(s)", "Create document(s)", "Dokument(e) anlegen", "Créer document(s)"],
	57961: ["Inventory valuation method", "Voorraadwaarderingsmethode", "Voorraadwaarderingsmethode", "Méthode d\'évaluation des stocks", "Inventory valuation method", "Bewertungsmethode für Lager", "Méthode d\'évaluation du stock"],
	59060: ["Update inventory", "Voorraad bijwerken", "Voorraad bijwerken", "Mettre à jour le stock", "Update inventory", "Preise im Bestand aktualisieren", "Mettre à jour le stock"],
	59765: ["Standard costing", "Standaard kostprijs", "Standaard kostprijs", "Coût standard", "Standard costing", "Standardkosten", "Coût standard"],
	59766: ["Average costing", "Gemiddelde inkoopprijs", "Gemiddelde inkoopprijs", "Coût moyen", "Average costing", "Durchschnittskosten", "Coût moyen"],
	385: ["Incomplete", "Onvolledig", "Onvolledig", "Incomplète", "Incomplete", "Unvollständig", "Incomplète"],
	807: ["Submit", "Indienen", "Indienen", "Soumettre", "Submit", "Senden", "Soumettre"],
	3925: ["Period is closed", "Periode is afgesloten", "Periode is afgesloten", "Période clôturée.", "Period is closed", "Periode ist abgeschlossen", "Période clôturée."],
	4313: ["Payment date", "Betalingsdatum", "Betalingsdatum", "Date paiement", "Payment date", "Zahlungstermin", "Date paiement"],
	8777: ["Sales invoice", "Verkoopfactuur", "Verkoopfactuur", "Facture de vente", "Sales invoice", "Ausgangsrechnung", "Facture de vente"],
	8838: ["Match", "Afletteren", "Afpunten", "Lettrer", "Match", "Ausbuchen", "Lettrer"],
	11074: ["Payroll year", "Loonjaar", "Loonjaar", "Année fonct", "Payroll year", "Lohnjahr", "Année fonct"],
	15574: ["Enter an amount first", "Voer eerst een bedrag in", "Voer eerst een bedrag in", "Insérez d\'abord un montant", "Enter an amount first", "Geben Sie zuerst einen Betrag ein", "Insérez d\'abord un montant"],
	16445: ["Backup", "Back-up", "Back-up", "Sauvegarde", "Backup", "Backup", "Sauvegarde"],
	17121: ["Employee", "Medewerker", "Medewerker", "Employé", "Employee", "Mitarbeiter", "Employé"],
	25692: ["Expand", "Uitklappen", "Uitvouwen", "Agrandir", "Expand", "Einblenden", "Agrandir"],
	27418: ["Activation date", "Datum inwerkingtreding", "Datum inwerkingtreding", "Date d\'activation", "Activation date", "Datum der Aktivierung", "Date d\'activation"],
	50019: ["A payment is linked to this entry. If you change it, the matching may be undone.", "Er is een betaling gekoppeld aan deze boeking. Indien u deze boeking wijzigt, kan de aflettering ongedaan gemaakt worden.", "Er is een betaling gekoppeld aan deze boeking. Indien u deze boeking wijzigt, kan de afpunting ongedaan gemaakt worden.", "Un paiement est lié à cette écriture. Si vous modifiez cette écriture, le lettrage peut être supprimé.", "A payment is linked to this entry. If you change it, the matching may be undone.", "Eine Zahlung ist an diese Buchung gekoppelt. Wenn Sie die Zahlung ändern, kann das Ausbuchen rückgängig gemacht werden.", "Un paiement est lié à cette écriture. Si vous modifiez cette écriture, le lettrage peut être supprimé."],
	50055: ["Create backup?", "Back-up maken?", "Back-up maken?", "Créer copie de sauvegarde?", "Create backup?", "Backup anlegen?", "Créer copie de sauvegarde?"],
	50225: ["The amounts of the selected lines are not balanced.", "De bedragen van de geselecteerde regels zijn niet in evenwicht.", "De bedragen van de geselecteerde regels zijn niet in evenwicht.", "Le montant des lignes sélectionnées n\'est pas équilibré.", "The amounts of the selected lines are not balanced.", "Die Beträge der ausgewählten Zeilen sind nicht saldiert.", "Le montant des lignes sélectionnées n\'est pas équilibré."],
	50226: ["Do you want to write off the remaining amount?", "Wilt u het resterende bedrag afschrijven?", "Wilt u het resterende bedrag afschrijven?", "Voulez-vous déprécier le montant restant?", "Do you want to write off the remaining amount?", "Wollen Sie den restlichen Betrag abbuchen?", "Voulez-vous annuler le montant restant?"],
	50704: ["The VAT-amount deviates more than is allowed by the Tax authorities.", "Het BTW-bedrag wijkt meer af dan is toegestaan door de belastingdienst.", "Het BTW-bedrag wijkt meer af dan is toegestaan door de belastingdienst.", "Le montant TVA dévie de plus ce que l\'administration TVA accepte.", "The VAT-amount deviates more than is allowed by the Tax authorities.", "Der USt.-Betrag weicht stärker ab, als die Steuerbehörden es zulassen.", "Le montant TVA dévie de plus ce que l\'administration TVA accepte."],
	52479: ["Correction request", "Correctie verzoek", "Correctie verzoek", "Demande de correction", "Correction request", "Korrekturanfrage", "Demande de correction"],
	52484: ["This change will lead to a recalculation of previous periods. A correction request will be created with the following data", "Deze wijziging zal leiden tot een herberekening van voorgaande periodes. Er wordt een correctie verzoek aangemaakt met de volgende data", "Deze wijziging zal leiden tot een herberekening van voorgaande periodes. Er wordt een correctie verzoek aangemaakt met de volgende data", "Cette modification entraînera un recalculé des périodes précédentes. Une demande de correction sera créée pour les données suivantes", "This change will lead to a recalculation of previous periods. A correction request will be created with the following data", "Diese Änderung wird zu einer Neuberechnung der vorigen Perioden führen. Eine Korrekturanfrage mit den folgenden Daten wird erstellt", "Cette modification entraînera un recalculé des périodes précédentes. Une demande de correction sera créée pour les données suivantes"],
	55837: ["The entry number has been updated to the next entry number of the selected year.", "Het boekstuknummer is gewijzigd naar het eerstvolgende nummer van het geselecteerde jaar.", "Het boekstuknummer is gewijzigd naar het eerstvolgende nummer van het geselecteerde jaar.", "Le numéro de pièce a pris le prochain numéro de cet exercice.", "The entry number has been updated to the next entry number of the selected year.", "Die Buchungsnummer wird in diesem Geschäftsjahr bereits verwendet, die nächste verfügbare Nummer wird gewählt.", "Le numéro d\'écriture a pris le prochain numéro de cet exercice."],
	56074: ["Find more…", "Vind meer…", "Vind meer…", "Trouver plus…", "Find more…", "Mehr finden…", "Trouver plus…"],
	56352: ["Financial year not found", "Boekjaar niet gevonden", "Boekjaar niet gevonden", "Exercice comptable non trouvé", "Financial year not found", "Geschäftsjahr nicht gefunden", "Exercice comptable non trouvé"],
	56372: ["No financial year has been defined for this date. Therefore this date cannot be used in financial entries.", "Er bestaat geen boekjaar voor de ingevoerde datum. Hierdoor kan deze datum niet gebruikt worden in financiële boekingen.", "Er bestaat geen boekjaar voor de ingevoerde datum. Hierdoor kan deze datum niet gebruikt worden in boekingen.", "Il n\'y a pas d\'exercice pour la date indiquée. Pour cette raison, vous ne pouvez pas utiliser cette date dans les encodages.", "No financial year has been defined for this date. Therefore this date cannot be used in financial entries.", "Für dieses Datum ist kein Geschäftsjahr definiert worden. Aus diesem Grund kann dieses Datum nicht in Finanzeinträgen genutzt werden.", "Il n\'y a pas d\'exercice comptable pour la date indiquée. Pour cette raison, vous ne pouvez pas utiliser cette date dans les écritures."],
	56771: ["Submit changes?", "Wijzigingen indienen?", "Wijzigingen indienen?", "Apporter des modifications", "Submit changes?", "Änderungen einreichen?", "Soumettre les modifications ?"],
	57188: ["Exact Online Terms & Conditions", "Exact Online Voorwaarden", "Exact Online Voorwaarden", "Termes et conditions", "Exact Online Terms & Conditions", "Exact Online Allgemeine Geschäftsbedingungen", "Exact Online Conditions Générales"],
	57190: ["Please read and accept the {0} and the {1} before changing your account data.", "Gelieve akkoord te gaan met de {0} en de {1} voor het wijzigen van uw relatiegegevens.", "Gelieve akkoord te gaan met de {0} en de {1} voor het wijzigen van uw relatiegegevens.", "Veuillez lire et accepter le {0} et le {1} avant la modification de vos données de relation.", "Please read and accept the {0} and the {1} before changing your account data.", "Bitte lesen Sie und akzeptieren Sie {0} und {1} bevor Sie Ihre Kontaktdaten ändern.", "Veuillez lire et accepter le {0} et le {1} avant la modification de vos données de tiers."],
	58022: ["Preview PDF", "Voorbeeld PDF", "Voorbeeld PDF", "Prévisualiser PDF", "Preview PDF", "Vorschau PDF", "Prévisualiser PDF"],
	58159: ["Do you want to use the default data of the selected account? Your existing data will be overwritten.", "Wilt u de standaardgegevens van de geselecteerde relatie gebruiken? De bestaande gegevens worden overschreven.", "Wilt u de standaardgegevens van de geselecteerde relatie gebruiken? De bestaande gegevens worden overschreven.", "Souhaitez-vous utiliser les données par défaut du tiers sélectionné ? Les données existantes seront supprimées.", "Do you want to use the default data of the selected account? Your existing data will be overwritten.", "Wollen Sie die Standarddaten des gewählten Kontaktes verwenden? Ihre bestehenden Daten werden überschrieben.", "Souhaitez-vous utiliser les données par défaut du tiers sélectionné ? Les données existantes seront supprimées."],
	58324: ["Drop your files on an entry line to create a document", "Sleep uw bijlage op een invoerregel en maak een nieuw document aan", "Sleep uw bijlage op een invoerregel en maak een nieuw document aan", "Déplacez vos fichiers sur une ligne d\'écriture pour créer un document", "Drop your files on an entry line to create a document", "Ziehen Sie Ihre Dateien in eine Buchungszeile, um ein Dokument zu erstellen", "Déplacez vos fichiers sur une ligne d\'écriture pour créer un document"],
	58398: ["Recognized", "Herkend", "Herkend", "Reconnu", "Recognized", "Wiedererkannt", "Reconnu"],
	58764: ["Link attachments", "Bijlagen koppelen", "Bijlagen koppelen", "Lier pièces jointes", "Link attachments", "Anhänge koppeln", "Lier pièces jointes"],
	58777: ["There are differences between the digital invoice and the entry.", "Er zijn verschillen tussen de digitale factuur en de boeking.", "Er zijn verschillen tussen de digitale factuur en de boeking.", "Des différences existent entre la facture électronique et l\'écriture.", "There are differences between the digital invoice and the entry.", "Es gibt Differenzen zwischen der digitalen Rechnung und der Buchung.", "Des différences existent entre la facture électronique et l\'écriture."],
	59720: ["Exact Online could not verify the format of this bank account number. You can still use the account if it is correct.", "Exact Online kan het formaat van dit bankrekeningnummer niet verifiëren. U kunt de rekening toch gebruiken als deze correct is.", "Exact Online kan het formaat van dit bankrekeningnummer niet verifiëren. U kunt de rekening toch gebruiken als deze correct is.", "Exact Online n\'a pas pu vérifier le format de ce compte bancaire. Vous pouvez toujours utiliser le compte s\'il est correct.", "Exact Online could not verify the format of this bank account number. You can still use the account if it is correct.", "Exact Online kann das Format dieser Bankkontonummer nicht bestätigen. Sie können diese Kontonummer jedoch verwenden, wenn diese korrekt ist.", "Exact Online n\'a pas pu vérifier le format de ce compte bancaire. Vous pouvez toujours utiliser le compte s\'il est correct."],
	59721: ["The bank account number you entered is not correct. Please enter a valid bank account number.", "Het bankrekeningnummer dat u ingaf is niet correct. Gelieve een correct bankrekeningnummer in te geven.", "Het bankrekeningnummer dat u ingaf is niet correct. Gelieve een correct bankrekeningnummer in te geven.", "Le compte bancaire introduit n\'est pas correct. Veuillez introduire un compte bancaire valide.", "The bank account number you entered is not correct. Please enter a valid bank account number.", "Die Eingabe der Bankkontonummer war nicht korrekt. Bitte geben Sie eine gültige Bankkontonummer ein.", "Le compte bancaire introduit n\'est pas correct. Veuillez introduire un compte bancaire valide."],
	60814: ["Add attachment", "Voeg bijlage toe", "Voeg bijlage toe", "Ajouter pièce jointe", "Add attachment", "Anhang hinzufügen", "Ajouter pièce jointe"]
};
;(function (exports) {
	var duration = 2000;
	var progressLineSelector = '.ProgressLineContainer .ProgressLine';
	var active = false;

	var ProgressLine = {
		update: function _update() {
			var line = $(progressLineSelector);
			if (active) {
				line.css('left', '-50%').animate({ 'left': '100%' }, duration, 'linear', ProgressLine.update);
			} else {
				line.hide();
			}
		},
		
		start: function () {
			if (!active) {
				var line = $(progressLineSelector);
				line.show();
				active = true;
				ProgressLine.update();
			}
		},

		stop: function () {
			active = false;
		}
	}
	
	exports.ProgressLine = ProgressLine;
})(window);;/* JavaScript belonging to ImageUpload control */
(function (exports) {
	var ImageUpload = function (options) {
		this.element = $('#' + options.element);
		this.table = options.table;
		this.id = options.id;
		this.hasImage = options.hasImage;
		this.placeholder = options.placeholder;
		this.imageSize = options.imageSize;
	}

	ImageUpload.fn = ImageUpload.prototype;

	ImageUpload.fn.upload = function () {
		var _this = this;
		var url = this._getImageUploadUrl();
		var dialog = new Dialog({
			autoShow: true, width: 500, height: 250, contentsPage: url, handler: function (id) {
				if (id) {
					_this.hasImage = true;
				}				
				_this._updateUI();
			}
		});
	}

	ImageUpload.fn._getImageUploadUrl = function() {
		var url = new SysUrlBuilder('SysImageUpload.aspx');
		url.Add('Table', this.table);
		url.Add('GenericID', this.id);
		return url;
	}

	ImageUpload.fn.remove = function () {
		var _this = this;

		var removeImage = function () {
			var url = _this._getImageUploadUrl();
			url.Add("Action", 1); // Delete action
			
			var results = SysCbLoadList(url);
			var errorMessage = SysCbGetValue(results, 'Error');
			if (errorMessage) {
				ErrorDialog.Show(0, errorMessage, null, null, 0, '');
			} else {
				_this.hasImage = false;
				_this._updateUI();
			}
		};

		QuestionDialog.ShowConfirmDelete(null, null, removeImage);
	}

	ImageUpload.fn.focus = function (focus) {
		this.element.toggleClass('Focus', focus);
	}

	ImageUpload.fn._updateUI = function () {
		var url = this._getImageUrl();
		this.element.find('img').attr('src', url.ToString());

		this.element.find('.BtnUpload').toggleClass('Hidden', this.hasImage);
		this.element.find('.BtnChange').toggleClass('Hidden', !this.hasImage);
		this.element.find('.BtnDelete').toggleClass('Hidden', !this.hasImage);
	}

	ImageUpload.fn._getImageUrl = function () {
		if (this.hasImage) {
			var url = new SysUrlBuilder('SysImage.aspx');
			url.Add('NoCache', 1)
			url.Add('ThumbSize', this.imageSize)
			url.Add('Table', this.table);
			url.Add('ID', this.id);
			url.Add('Modified', new Date().format("dd/M/yy h:mm:ss"));
			return url;
		} else {
			return new SysUrlBuilder(this.placeholder);
		}
	}

	exports.ImageUpload = ImageUpload;
}(window));;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Time Mask

function TimeMask(el) {
	var time = SysGet(el);
	if (time.indexOf(":") == -1) {
		if (time.length == 3) {
			time = "0" + time.substring(0, 1) + ":" + time.substring(1, 3);
		} else if (time.length == 4) {
			if (parseInt(time) > 2359) {
				time = "00:00"
			} else {
				time = time.substring(0, 2) + ":" + time.substring(2, 4);
			}
		}
	SysSet(el, time)
	}
}
;(function ($) {

	$.fn.cssProperties = function (properties) {
		var returnValue = {},
			self = this.eq(0);

		//
		for (var i = 0, len = properties.length; i < len; i++) {
			returnValue[properties[i]] = this.css(properties[i]);
		}
		return returnValue;
	};
})(jQuery);

var SysControlMessagePosition = {
	Right: 0,
	Bottom: 1
}

var SysControlMessage = (function () {

	// constructor
	var ctrlMessage = function (controlID, description, termID, severity, isHtml, position) {
		// private
		var that = this;

		// properties
		this.message = description;
		this.messageTerm = termID;
		this.parentControlID = controlID;
		this.severityLevel = severity;
		this.messagePosition = (typeof position !== 'undefined') ? position : SysControlMessagePosition.Right;
		this.messageDiv = CreateMessageDiv();

		that.SetPosition();
		$(window).resize(function () { that.SetPosition(); });

		function CreateMessageDiv() {

			// First, clean up existing control messages
			var controlMessage = $('#' + that.parentControlID).data('ControlMessage');
			if (controlMessage != null) {
				previousControlSeverity = controlMessage.severityLevel;
				controlMessage.CloseMessage();
				$('#' + that.parentControlID).data('ControlMessage', null);
			}

			// Now create a new message div
			div = document.createElement('div');
			div.id = that.parentControlID + '_Message_' + that.severityLevel + '_Container';
			div.classList.add('ControlMessageContainer');
			div.classList.add(that.severityLevel);

			document.body.appendChild(div);

			var table = $('<table></table>').addClass('ControlMessageTable');
			var row = $('<tr></tr>').addClass('ControlMessageRow');
			var messageCell = "";
			if (isHtml) {
				messageCell = $('<td></td>').addClass('ControlMessageCell').html(SysTerm(that.messageTerm, that.message));
			} else {
				messageCell = $('<td></td>').addClass('ControlMessageCell').text(SysTerm(that.messageTerm, that.message));
			}
			var closeCell = $('<td></td>').addClass('ControlMessageButtonCell');
			var closeImage = $('<div>&nbsp;</div>').addClass('ControlMessageCloseButton').click(function () { that.CloseMessage(); });

			closeCell.append(closeImage);
			row.append(messageCell)
			row.append(closeCell)
			table.append(row);

			$('#' + div.id).append(table)
			$('#' + that.parentControlID).data('ControlMessage', that);
			return div;
		}

		function CreateMessageTable() {
			var tr = '<tr>';
			// create a new textInputBox  
			var textInputBox = '<input type="text" id="' + id + '" name="' + id + '" title="' + tooltip + '" />';
			// create a new Label Text
			tr += '<td>' + labelText + '</td>';
			tr += '<td>' + textInputBox + '</td>';
			tr += '</tr>';
			return tr;
		}
	};

	// Methods
	ctrlMessage.prototype.Show = function () {
		$(this.messageDiv).css('display', 'Block');
	};

	ctrlMessage.prototype.CloseMessage = function () {
		$(this.messageDiv).remove();
	};

	ctrlMessage.prototype.SetPosition = function () {
		var message = this;
		var parentControl = $('#' + message.parentControlID);
		var offset = parentControl.offset();
		var messageControl = $('#' + message.messageDiv.id);
		var position;

		switch (message.messagePosition) {
			case SysControlMessagePosition.Bottom:
				position = {
					left: offset.left + (parentControl.width() / 2 - messageControl.width() / 2),
					top: offset.top + parentControl.height()
				};
				message.messageDiv.classList.add('Bottom');
				break;
			case SysControlMessagePosition.Right:
			default:
				position = {
					left: offset.left + parentControl.width(),
					top: offset.top + parentControl.height() / 2 - messageControl.height() / 2
				};
				message.messageDiv.classList.add('Right');
				break;
		}

		$(message.messageDiv).css({ 'left': position.left, 'top': position.top });
	};

	return ctrlMessage;
})();
;// JavaScript source code

// Check box handler for "Do not show" notification checkboxes
function SysHideNotification(checkControl, notification) {
	var url = new SysUrlBuilder('SysCallback.aspx')
		.Add('Action', 23) // CBAction.HideNotification
		.Add('SettingName', notification) // User setting for the notification
		.Add('SettingValue', checkControl.checked); // Do not show: True/False

	var cx = SysCbLoadList(url);
};var Exact = Exact || {}

// Object that serves as a base handler for callback requests

Exact.CallBackBase = function (url, actionKey, action, allowedAttributes, callbackBaseObject) {
	/// Base class for CallBack objects.
	var self = this;
	this._action = action || 0;
	this._baseUrl = url || '';
	this._allowedAttributes = allowedAttributes || [];
	this._attributes = [];
	this._actionKey = actionKey || 'BCAction';

	this.GetUrl = function () {
		var urlBuilder = new SysUrlBuilder(self.Me._baseUrl)
		urlBuilder.Add(self.Me._actionKey, self.Me._action);
		if (self.Me._attributes.length > 0)
		{
			for (i = 0; i < self.Me._attributes.length; i++) {
				urlBuilder.Add(self.Me._attributes[i].name, self.Me._attributes[i].value);
			}
		}

		return urlBuilder.ToString();
	};

	this.AddAttribute = function (name, value) {
		var n = name || "";
		if (self.Me.SupportsAttribute(n) && value !== null) {
			self.Me._attributes.push({ name: name, value: value });
		}
	};

	this.SupportsAttribute = function (obj) {
		for (var i = 0; i < self.Me._allowedAttributes.length; i++) {
			if (self.Me._allowedAttributes[i] === obj) {
				return true;
			}
		}
		return false;
	};

	this.Clear = function () {
		self.Me._attributes = [];
	};

	this.Me = callbackBaseObject || this;
};

// Add readonly property url to base callback.
Object.defineProperties(Exact.CallBackBase.prototype, {
	url: {
		get: function () {
			return this.GetUrl();
		}
	}
});;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
(function ($) {
	$.fn.callout = function () {
		return this.each(function () {
			var $this = $(this);
			var content = $this.data('callout');
			var id = $this.data('callout-id');
			var open = false;

			var icon = $('<div class="CalloutIconContainer" />')
				.append($('<div class="CalloutIcon" />'));

			var calloutContent = $('<div />')
				.addClass('CalloutContent')
				.text(content)
				.prepend($('<div class="CalloutPointer" />'))
				.prepend($('<div class="CalloutPointer CalloutPointerBorder" />'));

			var callout = $('<div style="display: none" />')
				.addClass('CalloutContainer')
				.append(calloutContent);

			if (id !== undefined && id !== '') {
				icon.attr('id', id);
				calloutContent.attr('id', id + '-Content');
			}

			var elementsInsideCallout = icon.find('.CalloutIcon')
				.add(callout.find('.CalloutPointer'))
				.add(callout.find('.CalloutContent'));

			var show = function () {
				if (!open) {
					callout
						.fadeOut()
						.stop(true, true)
						.fadeIn();

					updatePosition();
					$('body').click(hide);

					open = true;
				} else {
					callout
						.stop(true, true)
						.fadeOut();

					open = false;
				}
			};

			var hide = function (e) {
				if (open && targetOutsideCallout(e.target)) {
					callout
						.stop(true, true)
						.fadeOut();

					open = false;
					$('body').unbind('click', hide);
				}
			};

			var targetOutsideCallout = function (target) {
				return elementsInsideCallout.filter(function () {
					return this == target;
				}).length == 0;
			};
			
			var updateIconPosition = function () {
				icon.position({
					'of': $this,
					'at': 'right',
					'my': 'left',
					'offset': '9 0',
					'collision': 'none'
				});
			};

			var updateTooltipPosition = function () {
				callout.position({
					'of': icon,
					'at': 'right',
					'my': 'left',
					'offset': '9 0',
					'collision': 'none'
				});
			};

			var updatePosition = function () {
				setTimeout(function() {
					updateIconPosition();

					if (open) {
						updateTooltipPosition();
					}
				}, 0);
			};

			// add to page
			$('body')
				.append(icon)
				.append(callout);

			// bind events
			icon.click(show);
			$(window).resize(updatePosition)

			//after dynamically changing page markup we need to reposition callout if parent element's position changed
			.click(updatePosition);

			updatePosition();
		});
	};

	// Walk through all elements with a callout data attribute and initialize their callouts
	$(function () { $('[data-callout]').callout(); });
})(jQuery);;var showFullPageOverlay = false;
var droppedGridRowID = null;
var dragToEntryLineMessage = null; 

(function ($) {
	// reserved words are those that appear in data context and is meaningful within this plugin.
	// however, they are NOT to be passed on to the destination URL.
	var DragAndDropOverlayReservedWords = [
		// display text on page overlay
		'overlay-header',
		// corresponding term ID for display text on page overlay
		'overlay-header-id',
		// default context information for display on page overlay AND dialog title
		'default-header-context',
		// display text on dialog title
		'dialog-header',
		// corresponding term ID for display text on dialog title
		'dialog-header-id',
		// context information for display on page overlay AND dialog title
		'ctrl-header-context',
		// corresponding term ID for context information for display on page overlay AND dialog title
		'ctrl-document-id',
		// flag to determine refreshing of current page
		'refresh-current-page'
	];

	$.fn.draganddrop = function (options) {
		// default options
		var settings = $.extend({
			action: 'start',				// start drag-and-drop overlay. Possible values: start, stop
			url: 'DocEdit.aspx',			// page to open
			bcaction: 0,					// BCAction (New)
			overlayHeader: 'Drop your files and create new document',
			overlayHeaderId: 58014,
			dialogHeader: 'Create a new document',
			dialogHeaderId: 57503,
			refreshCurrentPage: false
		}, options);
		if (!('draggable' in document.createElement('span'))) {
			// drag-and-drop not supported by browser
			return;
		}

		var fullPageOverlay = $('.DragAndDropOverlay');
		// creates the page overlay for drag-and-drop if not found
		if (!fullPageOverlay.length) {
			fullPageOverlay = $(document.createElement('div'));
			fullPageOverlay
				.addClass('DragAndDropOverlay')
				.append('<div class="OverlayContent"><div class="Info-Icon"></div><span id="TitleCaption" class="Info-Title"></span><span id="TitleCaptionSuffix" class="Info-Context"></span></div>')
				.mouseover(function () {
					fullPageOverlay.fadeOut(200);
					HighLightOrClearAllFields(false);
				});
			$(document.body).prepend(fullPageOverlay);
		}

		var contextControl = $('#OverlayContext');
		var iframe = document.getElementById("MainWindow");
		if (!contextControl.length) {
			// if context not found in main page, try to look inside main iframe
			contextControl = $('#OverlayContext', iframe.contentWindow.document);
		}

		if (iframe != undefined) {
			showFullPageOverlay = !isDragAndDropToEntryLine();
			if (!showFullPageOverlay) {
				dragToEntryLineMessage = SysTerm(58324, 'Drop your files on an entry line to create a document');
			}
		}

		return this.each(function () {
			var contextControlLength, overlayHeader, overlayHeaderId, contextData, overlayText, gridRow;
			var element = $(this);
			var destroyDragDrop = function () {
				// remove all event handlers for pages with exception (setting of exception flag in the page itself)
				element.unbind('dragenter');
				element.unbind('dragover');
				element.unbind('dragleave');
				element.unbind('drop');

				contextControlLength = overlayHeader = overlayHeaderId = contextData = overlayText = gridRow = null;
			}
			if (settings.action === 'start') {
				destroyDragDrop();
				// start drag-and-drop overlay
				contextControlLength = contextControl ? contextControl.length : 0;
				overlayHeader = settings.overlayHeader;
				overlayHeaderId = settings.overlayHeaderId;
				contextData;

				if (contextControlLength) {
					contextData = contextControl.data();
					overlayHeader = contextData['overlay-header'];
					overlayHeaderId = -1;

					if (!overlayHeader) {
						overlayHeader = settings.overlayHeader;
						overlayHeaderId = settings.overlayHeaderId;
					}
				}
				
				overlayText = SysTerm(overlayHeaderId, overlayHeader);
				overlayText = overlayText.replace(' {0}', '');
				$('#TitleCaption').text(overlayText);

				// handles drag event into and inside viewport (event may fire when entering child element)
				//isPageElement prevents binding if dragged files are elements from the page (like photos, highlighted texts)
				element.bind('dragenter', function (event) {
					
					if (event.target == this || event.originalEvent.pageX < 1 || event.originalEvent.pageY < 1 || isPageElement(event.originalEvent.dataTransfer)) {
						return;
					}

					event.preventDefault(); //to prevent browser from opening a dropped file behind an open dialog (except for pages with dropzone)

					if (!SysIsDialogOpened()) {  //used this checking to avoid having to bind and unbind the event if there is a dialog opened on top of the page
						highlightGridDroppableZone(event, false);

						event.stopPropagation();
						var titleCaptionSuffix = $('#TitleCaptionSuffix');

						if (contextControlLength) {
							var headerContext = contextData['ctrl-header-context'];
							var headerDefaultContext = contextData['default-header-context'];
							var context = '';

							if (headerContext) {
								var contextValue = resolveDynamicValue(headerContext);

								if (contextValue) {
									context = contextValue;
								}

								contextValue = null;
							}

							if (context === '' && headerDefaultContext) {
								context = headerDefaultContext;
							}

							titleCaptionSuffix.text(context);
							headerContext = headerDefaultContext = context = null;
						}
						else {
							titleCaptionSuffix.text('');
						}

						if (showFullPageOverlay) {
							fullPageOverlay.css({ 'height': '100%' }).fadeIn(200);
						}
						titleCaptionSuffix = null;
					}
				});

				//to prevent the default browser behavior which opens the file(s) dropped on the page
				element.bind('dragover', function (event) {
					event.preventDefault();
					event.stopPropagation();
				});

				 //handles drag event when leaving viewport (event may fire when entering child element)
				element.bind('dragleave', function (event) {
					var width = event.originalEvent.pageX;
					var height = event.originalEvent.pageY;

					// ensure mouse pointer is outside of viewport as this event may be fired when leaving a child element
					if (width < 1 || width >= window.innerWidth || height < 1 ) {
						event.stopPropagation();
						event.preventDefault();
						fullPageOverlay.fadeOut(200);
						if (!showFullPageOverlay) {
							HighLightOrClearAllFields(false);
					}
					}

					width = height = null;
				});

				// handles drop event when leaving viewport
				element.bind('drop', function (event) {
					event.preventDefault();  //to prevent browser from opening a dropped file behind an open dialog (except for pages with dropzone)
					if (!SysIsDialogOpened() && !isPageElement(event.originalEvent.dataTransfer)) { //used this checking to avoid having to bind and unbind the event if there is a dialog opened on top of the page

						highlightGridDroppableZone(event, false);

						event.stopPropagation();

						if (showFullPageOverlay) {
						fullPageOverlay.fadeOut(200);
						}

						//Check whether file is drop into one of the grid line that support drag-drop. Otherwise, show information dialog.
						if (isDragAndDropToEntryLine()) {
							var el = $(event.target) || $(event.srcElement);

							//Get file-drop-to table row (TR) 
							gridRow = getValidGridlineBasedOnDragDropPosition(el);

							//Check whether the drop-file is on the valid grid line
							if (gridRow != undefined) {
								droppedGridRowID = gridRow.attr('id');

								if (gridRow.length != 1 || droppedGridRowID == undefined) {
									new InformationDialog({
										headerTermId: 58324,
										headerTerm: 'Drop your files on an entry line to create a document',
										width: '600px',
										onClose: function () {
											HighLightOrClearAllFields(false);
											fullPageOverlay.fadeOut(200);
										}
									});
									return;
								}
								
							}
						}

						// assigns dropped files to new variable defined in window
						// these files are to be picked up by the destination url page
						window.FileList = event.originalEvent.dataTransfer.files;

						var url = new SysUrlBuilder(settings.url);
						var destinationUrl = getUrlParameters(url, settings, gridRow);
						showDocumentInDialog(destinationUrl, settings);

						url = destinationUrl = null;
					}
				});
			}
			else if (settings.action === 'stop') {
				destroyDragDrop();
			}
		});
	};

	// converts context found in page into url parameters
	var getUrlParameters = function (url, settings, gridRow) {
		var contextControl = $('#OverlayContext');

		if (!contextControl.length) {
			// if context not found in main page, try to look inside main iframe
			var mainIframe = document.getElementById("MainWindow");

			if (mainIframe) {
				contextControl = $('#OverlayContext', mainIframe.contentWindow.document);
			}

			mainIframe = null;
		}

		var isContextControlExist = contextControl ? contextControl.length : 0;
		var contextData;

		if (isContextControlExist) {
			contextData = contextControl.data();
		}

		var openDocumentMode = settings.bcaction;
		if (contextData) {
			var documentIdControl = contextData['ctrl-document-id'];

			if (documentIdControl) {
				var documentId = resolveDynamicValue(documentIdControl);
				
				if (documentId) {
					url.Add('id', documentId);
					openDocumentMode = 1;			// edit mode
				}
				url.Add('Resultcols', 'Documents.ID,Documents.HID,Documents.Subject');
				documentId = null;
			}

			url.Add('bcaction', openDocumentMode);

			var dynamicValue;

			for (var key in contextData) {
				if ($.inArray(key, DragAndDropOverlayReservedWords) > -1) {
					continue;
				}

				if (key.startsWith('ctrl-')) {
					// dynamic value
					dynamicValue = resolveDynamicValue(contextData[key]);

					if (dynamicValue) {
						url.Add(key.substring(5), dynamicValue);
					}
				}
				else {
					// static value
					url.Add(key, contextData[key]);
				}
			}

			documentIdControl = dynamicValue = null;
		}
		else if (gridRow != undefined) {
			var contentFrame = $('#MainWindow', parent.document)[0].contentWindow.document;
			var gridRowSelected = $('#' + droppedGridRowID, contentFrame);
			var documentDisplayField = GetDisplayDocumentFieldInGrid(gridRowSelected, contentFrame);

			if (documentDisplayField.length && (documentDisplayField[0].value != "")) {
				//a document is already attached to the entry line, open existing document in Edit mode
				var documentIDField = GetHiddenDocumentFieldInGrid(gridRowSelected, contentFrame);
				if (documentIDField.length) {
					var documentID = documentIDField[0].value;
					openDocumentMode = 1;
					url.Add('id', documentID);
				}
			}

			//Support for document field in grid level
			url.Add('bcaction', openDocumentMode);
			url.Add('Resultcols', 'Documents.ID,Documents.HID');

			contentFrame = gridRowSelected = documentDisplayField = null;
		}
		else {
			// default url parameters needed
			url.Add('bcaction', settings.bcaction);
		}

		contextControl = isContextControlExist = contextData = openDocumentMode = null;

		return url;
	};

	// displays destination url in a dialog
	var showDocumentInDialog = function (url, settings) {
		var contextControl = $('#OverlayContext');

		if (!contextControl.length) {
			// if context not found in main page, try to look inside main iframe
			var mainIframe = document.getElementById("MainWindow");

			if (mainIframe) {
				contextControl = $('#OverlayContext', mainIframe.contentWindow.document);
			}

			mainIframe = null;
		}

		var isContextControlExist = contextControl ? contextControl.length : 0;
		var contextData;
		var isRefreshCurrentPage = false;

		if (isContextControlExist) {
			contextData = contextControl.data();
		}

		var options = {
			autoShow: true,
			fullScreen: false,
			contentsPage: url,
			width: 850,
			height: 600,
			returnFocus: document.activeElement,
			handler: HandleReturnValue
		};

		if (contextData) {
			var headerContext = contextData['ctrl-header-context'];
			var contextValue = '';

			if (contextData['refresh-current-page'] === true) {
				isRefreshCurrentPage = true;
			}

			if (headerContext) {
				var dynamicValue = resolveDynamicValue(headerContext);

				if (dynamicValue) {
					contextValue = dynamicValue;
				}

				dynamicValue = null;
			}

			var dialogHeader = contextData['dialog-header'];
			var dialogHeaderId = -1;

			if (dialogHeader) {
				var headerDefaultContext = contextData['default-header-context'];
				
				if (contextValue === '' && headerDefaultContext) {
					contextValue = headerDefaultContext;
				}

				if (contextValue !== '') {
					options.titleTerm = String.format(SysTerm(dialogHeaderId, dialogHeader), contextValue);
					options.titleTermId = -1;
				}

				headerDefaultContext = null;
			}

			headerContext = contextValue = dialogHeader = dialogHeaderId = null;
		}
		else {
			options.titleTerm = settings.dialogHeader;
			options.titleTermId = settings.dialogHeaderId;
		}

		options.onClose = OnCloseAction(isRefreshCurrentPage);

		if (Dialog.ShowDialog()) {
			var dlg = new Dialog(options);
		}

		contextControl = isContextControlExist = contextData = options = isRefreshCurrentPage = null;
	};

	// resolves dynamic value by control ID (look up element's value by their control ID)
	var resolveDynamicValue = function (controlId) {
		var mainIframe = $('#MainWindow').contents();
		// search for control within main iframe
		var contextValue = new SysElement(controlId, mainIframe).Value();

		if (contextValue) {
			return contextValue;
		}
		else {
			// search for control within menu portal if not found in iframe
			contextValue = new SysElement(controlId).Value();
		}

		mainIframe = null;

		return contextValue;
	};

	var isPageElement = function (dataTransfer) {
		if (dataTransfer.types != undefined) {
			//in IE if page elements are dragged, the dataTransfer.types property of event returns other file types and optionally 'Files'
			//using feature checking instead of user agent checking to determine if browser is IE to avoid issues in future IE version releases
			//MSStream is an DOM object used for streaming and is supported in IE 10 and 11
			if (!!window.MSStream) {
				for (i = 0; i < dataTransfer.types.length; i++) {
					if (dataTransfer.types[i] != "Files") {
						return true;
					}
				}
			}
			// In Chrome, if page elements are dragged, dataTransfer.types will not contain file type 'Files'
			//In FF, file type 'text/html' is one of the file types returned dragged page elements.
			else if (dataTransfer.types.indexOf ? dataTransfer.types.indexOf('Files') == -1 : dataTransfer.types.contains('text/html') == true) {
				return true;
			}
			return false;
		}
	};

	var highlightGridDroppableZone = function (event, clearHighlight) {
		if (showFullPageOverlay) return;

		var el = $(event.target) || $(event.srcElement);

		if (!isFilesDragToValidDragDropGridline(el)) return;

		//Get file-drag-to table row (TR) 
		var gridRow = getValidGridlineBasedOnDragDropPosition(el);

		if (gridRow != undefined && gridRow.length == 1) {
			//Only proceed when grid row contains of document browsefield 
			if (!isDocumentFieldUsedInGrid(gridRow)) {
				showFullPageOverlay = true;
				return;
			}

			//Highlight and select grid row
			HighLightOrClearAllFields((!clearHighlight), gridRow);
		}
	};

	var getValidGridlineBasedOnDragDropPosition = function (el) {
		if (el == undefined) return undefined;

		var gridRow = el.parent('tr.GridRow');
		if (gridRow != undefined && gridRow.length) {
			//When drag on TD > TR), direct return current element parent which is direct parent (TR). 
			return gridRow;
		}
		else {
			//Search and return TR parent when drag on Input control > TD > TR 
			gridRow = el.parentsUntil('tr.GridRow'); //Current row which file drag to
			return gridRow.parent();
		}
		return undefined;
	};

	var isFilesDragToValidDragDropGridline = function (el) {
		//Get table grid based on current mouse drag-drop position. This will search the parent element for current drag event.
		var gridTableBasedOnDragPosition = $(el).parentsUntil('table.Grid').parent();

		//Only proceed if dragover files is on top grid control
		if (!gridTableBasedOnDragPosition.length) {
			return false;
		}

		//## Behavior ##: To highlight and show grid table as droppable zone 
		//To check whether the drag-drop file is on the grid table which allow drap-drop document function
		var allowDragDropGridTableTagName = gridTableBasedOnDragPosition[0].tagName;

		//Get file-drag-to table row (TR) and determine whether is drag on the valid grid line
		var gridRow = getValidGridlineBasedOnDragDropPosition(el);
		var isDragToValidGridline = false;

		if (gridRow != undefined && gridRow.length == 1) {
			isDragToValidGridline = true;
		}

		if (allowDragDropGridTableTagName == 'TABLE' && isDragToValidGridline) {
			//Clear highlight since the current drag-drop file is on the drop area
			HighLightOrClearAllFields(false);
		}
		else {
			//Highlight and show grid table is the drop area
			ShowOverlayMessage();
			HighLightOrClearAllFields(true);
		}

		//Only proceed if grid control has class AllowDragDropDocument. This flag is used to determine whether user can drag and drop file to the grid.			
		if (!isGridAllowDragDropDocument(gridTableBasedOnDragPosition.parent())) return false;

		return true;
	};

	var isGridAllowDragDropDocument = function (gridTableElement) {
		return $(gridTableElement).hasClass('AllowDragDropDocument');
	};

	//Function used to check whether document field is used in grid control. 
	//searchElement: grid table or grid row
	var isDocumentFieldUsedInGrid = function (searchElement) {
		return $(searchElement).find('input[type=hidden][data-is-document=\'true\']').length;
	};

	var isDragAndDropToEntryLine = function () {
		var gridTable = GetGridTable();

		if (gridTable != undefined) {
			if (isGridAllowDragDropDocument(gridTable) && isDocumentFieldUsedInGrid(gridTable)) {
				return true;
			}
		}
		return false;
	};
}(jQuery));

function ManageDragAndDropOverlay() {
	// ensure drag-and-drop events are rebind when iframe content reloads
	$('#MainWindow').bind('load', function (event) { 
		var iframe = this.contentWindow;
		var page = $(event.target) || $(event.srcElement);

		//'exclude-overlay' is a class added to the iframe when a dropzone is rendered to a page
		//when iframe is loaded with 'exclude-overlay' class, drag and drop is removed from the window and iframe
		if (page.hasClass('exclude-overlay')) {
			var contentFrame = $(this);

			contentFrame.removeClass('exclude-overlay');

			$(window).draganddrop({ action: 'stop' });
			$(iframe).draganddrop({ action: 'stop' });
		}
		else { 
			var options = {};
			if (iframe['GetDragAndDropOptions'] &&
				typeof (iframe['GetDragAndDropOptions']) == "function") {
				options = iframe['GetDragAndDropOptions']();
		}

			$(window).draganddrop(options);
			$(iframe).draganddrop(options);
		}
	});
}

function OnCloseAction(isRefreshCurrentPage) {
	if (isRefreshCurrentPage) {
		return function () {
			var iframe = document.getElementById("MainWindow");
			if (iframe) { // perform submit() for iframe instead of reload(). Using reload() will get re-send warning popup 
				$("form", iframe.contentWindow.document).submit();
			}
			iframe = null;
			GenericOnCloseAction();
		}
	}
	else {
		if (!showFullPageOverlay) {
			return function () {
				droppedGridRowID = null;
				HighLightOrClearAllFields(false);

				var fullPageOverlay = $('.DragAndDropOverlay');
				fullPageOverlay.fadeOut(200);
				GenericOnCloseAction();
			}
		}
		return function () {
			GenericOnCloseAction();
		}
	}
}

// This function is to handle generic behaviour for OnClose Dialog event.
function GenericOnCloseAction() {
	window.FileList = null;	// Clear off the FileList variable if access denied. Because AccessDenied() will redirect on server side.
}

//this is the handler function to process the returned array values from the dialog
//retrieves the returned document GUID, HID and Subject and populated to the
//document browser field of the aspx page
function HandleReturnValue(returnValue) {
	var contextControl = $('#OverlayContext');
	var contentFrame = $('#MainWindow', parent.document)[0].contentWindow.document;
	var documentControlID;
	
	contextControl = $('#OverlayContext', contentFrame);
	
	if (contextControl.length) {
		contextData = contextControl.data();
		documentControlID = contextData['ctrl-document-id'];

		if (documentControlID && returnValue) {
			documentControlID = '#' + documentControlID

			if (returnValue[0]) {
				var document = $(documentControlID, contentFrame);
				document.attr("value", returnValue[0]);
				document = null;
			}

			var doclinkText = '';
			var count;

			for (count = 1; count < (returnValue.length) ; count++) {
				if (doclinkText.length > 0) {
					doclinkText += ' - ';
				}
				doclinkText += SysTrim(returnValue[count]);
			}

			var documentRef = $(documentControlID + "_ref", contentFrame);
			if (documentRef) {
				var url = new SysUrlBuilder("DocEdit.aspx?ID=" + returnValue[0]);

				documentRef.text(doclinkText);
				documentRef.css("color", "");
				documentRef.attr("Href", url.ToString());
				url = null;
			}

			doclinkText = count = null;
		}
	}
	else if (!showFullPageOverlay) {
		//Cater for page that contains datagrid with drag-drop on document field allowed.
		//The return value at this point will be 1 long string from DocEdit.aspx. Example: {c930fc94-45a0-4553-9a86-01dc4667d982},31,sss,grd_r2
		if (returnValue != undefined) {
			if (droppedGridRowID != undefined) {
				var gridRow = $('#' + droppedGridRowID, contentFrame);
				if (gridRow.length) {
					//Fill in text field that store actual value of document id -- document GUID
					var documentHiddenField = $(GetHiddenDocumentFieldInGrid(gridRow, contentFrame));
					if (documentHiddenField.length) {
						var documentId = returnValue[0];
						documentHiddenField.val(documentId);
					}

					//Fill in text field that display on the screen - document HID
					var documentDisplayField = $(GetDisplayDocumentFieldInGrid(gridRow, contentFrame));
					if (documentDisplayField.length) {
						var documentHID = returnValue[1];
						documentDisplayField.val(documentHID);
					}
				}
			}
		}
	}
	contextControl = contentFrame = documentControlID = null;
}

function GetDisplayDocumentFieldInGrid(gridRowElement, contentFrame) {
	return $(gridRowElement, contentFrame).find('input[type=text][data-is-document=\'true\']');
}

function GetHiddenDocumentFieldInGrid(gridRowElement, contentFrame) {
	return $(gridRowElement, contentFrame).find('input[type=hidden][data-is-document=\'true\']');
}

function GetGridTable() {
	var mainIframe = document.getElementById("MainWindow");

	if (mainIframe != undefined) {
		gridTable = $('table.Grid', mainIframe.contentWindow.document);
		return gridTable;
	}
	return undefined;
}

function GetGridEntryLines() {
	var gridTable = GetGridTable();

	if (gridTable != undefined) {
		var gridEntryLines = $('tr.GridRow', gridTable);
		return gridEntryLines;
	}
	return undefined;
}

function GetReferenceFields(gridEntryLines) {
	if (gridEntryLines != undefined) {
		var referenceFields = $('.Reference', gridEntryLines);
		return referenceFields;
	}
	return undefined;
}

function ShowOverlayMessage() {
	var fullPageOverlay = $('.DragAndDropOverlay');
	if (fullPageOverlay.length) {
		var elGridTableOffset = gridTable.offset();
		var menuPortalHeight = 68;

		if (fullPageOverlay.css('display') == 'none') {
			var hdrTitleOffset = $('.MainWindow').contents().find('.WaitMessage').position().top;
			var fixedButtonBarOverlay = $('.MainWindow').contents().find('.FixedButtonBar');

			fullPageOverlay.find('span#TitleCaption').text(dragToEntryLineMessage);

			if (!fixedButtonBarOverlay.length && hdrTitleOffset > 0) {
				fullPageOverlay.css({ 'height': (elGridTableOffset.top - hdrTitleOffset) + menuPortalHeight + 'px' }).fadeIn(200);
				return;
			}
			else if (fixedButtonBarOverlay.length) {
				fullPageOverlay.css({ 'height': fixedButtonBarOverlay.height() + menuPortalHeight + 'px' }).fadeIn(200);
				return;
			}
			fullPageOverlay.css({ 'height': elGridTableOffset.top + menuPortalHeight + 'px' }).fadeIn(200);
		}
	}
}

function AddOrRemoveClassInElement(element,className, isAddClass) {
	if (element.length) {
		element.each(function () {
			if (isAddClass)
				this.classList.add(className);
			else
				this.classList.remove(className);
		});
	}
}

function HighLightOrClearAllFields(isHighLight, gridRow) {
	var scope;
	if (gridRow == undefined) {
		scope = GetGridTable();
		if (!isHighLight) {
			HighLightOrClearExchangeRateFields(scope, false);
		}
	}
	else {
		scope = gridRow;
		if (isHighLight) {
			HighLightFirstRowDateField(gridRow);
		}
	}
	var allFields = $('input:not(:hidden, .Reference), select', scope);

	if (isHighLight) {
		AddOrRemoveClassInElement(allFields, 'DraggedOverEntryLine', true);
		HighLightOrClearExchangeRateFields(scope, true);
		//special handling for exchange rate fields as there is an inline styling set for background-color
		//stylebase-less class is not able to change these fields.
	}
	else {
		AddOrRemoveClassInElement(allFields, 'DraggedOverEntryLine', false);
	}
}

//this function contains the checking if row is in a split and if row is the first in split group altogether
//to minimize the jquery selection performed for faster highlighting of the rows.
//all rows of the same split row group will contain the same GUID value
function HighLightFirstRowDateField(gridRow) {
	var guidMatch;
	if (gridRow != undefined) {
		var gridRowGUID = $('input[id*="OffsetID"]', gridRow);
		if (gridRowGUID.length > 0){
			gridRowGUID = gridRowGUID[0].value;
			guidMatch = $('input[value="' + gridRowGUID + '"]', GetGridEntryLines());
		}
	}
	
	if (guidMatch != undefined && guidMatch.length > 1) {  //Checking if current row is part of split rows.
		if (gridRow[0].childNodes[0].rowSpan == 1) {  //To check the entry number div of the row. If rowSpan > 1 means current row is the first row in the split group
			var firstRow = guidMatch[0].parentElement.parentElement;  //to access the parent row

			if (firstRow != undefined) {
				var dateField = $('input[id*="EntryDate"]', firstRow);
				if (dateField.length > 0) {
					AddOrRemoveClassInElement(dateField, 'DraggedOverEntryLine', true);
				}
			}
		}
	}
}

//need to use inline styling for exchange rate fields to overwrite the inline styling introduced for background-color in vb level
function HighLightOrClearExchangeRateFields(gridTable, isHighlight) {
	var exchangeRateFields = $('input[id*="RateFC"]', gridTable);
	if (isHighlight) {
		exchangeRateFields.css('border', '1px solid #0c85b4');
		exchangeRateFields.css('background-color', '#cbe6ef');
	}
	else {
		exchangeRateFields.css('border', '');
		exchangeRateFields.css('background-color', '#e7e7e7');
	}
}

;/// <reference path="../base/jquery-1.5.1.js" />
/// <reference path="../SysControls/SysElement.js" />

(function () {
	/// <summary>Defines the objects for managing the dropdown menus and a menu manager for the MenuPortal.aspx</summary>

	var Menu = (function () {

		MenuDef.State = {
			Collapsed: 0,
			Expanded: 1
		};

		MenuDef.MouseState = {
			Inside: 0,
			Outside: 1
		};

		MenuDef.prototype = {
			id: "Unknown",
			container: new SysElement(),
			toggleIcon: new SysElement(),
			header: new SysElement(),
			menu: new SysElement(),
			state: MenuDef.State.Collapsed,
			mouseState: MenuDef.MouseState.Outside,
			openOnHover: false,

			Collapse: function () {
				/// <summary>Collapse this drop down menu.</summary>
				/// <returns type="undefined">undefined</returns>
			},

			Expand: function () {
				/// <summary>Expand this drop down menu, i.e. show the menu items.</summary>
				/// <returns type="undefined">undefined</returns>
			},

			KeepOpen: function (keepOpen) {
				/// <summary>Should the drop down menu close when hovering outside of the menu?</summary>
				/// <param name="keepOpen" type="Boolean"></summary>
			}
		};

		function MenuDef(container, options) {
			/// <summary></summary>
			/// <param name="container" type="Any">Any form that SysElement can take: the element that contains the entire menu.</param>
			/// <field name="container" type="SysElement">The 'root' element that contains the entire menu.</field>
			/// <field name="toggleIcon" type="SysElement">The (clickable) arrow image</field>
			/// <field name="header" type="SysElement">The clickable header part of menu, which is always visible</field>
			/// <field name="menu" type="SysElement">The part of the menu that contains the menu items.</field>
			/// <field name="state" type="Menu.State">The state of the menu, collapsed | expanded</field>

			if (MenuDef._initialized === undefined) {
				// For the regression test the time-out needs to be higher than normal.
				// This can be defined in a separate file not part of the Exact Online set
				MenuDef.prototype._showTimeout = window.testAutomationDropDownTimeOut || 200;
				MenuDef.prototype._showTimeoutId = 0;
				MenuDef.prototype._hideTimeout = window.testAutomationDropDownTimeOut || 200;
				MenuDef.prototype._hideTimeoutId = 0;
				MenuDef.prototype._overlay = null;

				MenuDef.prototype.Collapse = function () {
					if (this.state === MenuDef.State.Collapsed) {
						return;
					}

					this.container.RemoveClass("Active");
					this.toggleIcon.AddClass("ArrowUp");
					this.toggleIcon.RemoveClass("ArrowDown");
					this.state = MenuDef.State.Collapsed;
					if (this._overlay) {
						this._overlay.Hide();
					}

					if (typeof EnhancedNavigation !== "undefined") {
						EnhancedNavigation.hideOverlay();
					}
				};

				MenuDef.prototype.Expand = function () {
					this.container.AddClass("Active");
					this.toggleIcon.RemoveClass("ArrowUp");
					this.toggleIcon.AddClass("ArrowDown");
					this.state = MenuDef.State.Expanded;

					if (this.id == 'MyWorkflowContainer') {
						if (UpcomingActivities) {
							UpcomingActivities.update();
						}
					}

					if (this._overlay) {
						this._overlay.Width(this.menu.OuterWidth() + 2);
						if (this.id === "AdminContainer") {
							// The admin container has a large padding and a top=0 to display a border next to the title;
							// the width of the title is usually smaller than the width of the menu. In this way a border is shown over the full length.
							this._overlay.Height(this.menu.OuterHeight() - 30);
						}
						else {
							this._overlay.Height(this.menu.OuterHeight() + 2);
						}
						this._overlay.Show();
					}

					if (typeof EnhancedNavigation !== "undefined") {
						EnhancedNavigation.showOverlay();
					}
				};

				MenuDef.prototype.KeepOpen = function (keepOpen) {
					var me = this;
					this.keepOpen = keepOpen;

					window.setTimeout(function () {
						if (!me.keepOpen && me.mouseState === MenuDef.MouseState.Outside) {
							me.Collapse();
						}
					}, 1); // To have it on the event queue after a possible focus with keepOpen=true
				};

				MenuDef.prototype._Init = function (container, options) {
					var options = options || {};

					this.container = new SysElement(container);
					this.id = this.container.id;
					this.toggleIcon = this.container.Find(".DropdownArrow");
					this.header = this.container.Find(".DropdownMenuHeader");
					this.menu = this.container.Find(".DropdownMenuBody");
					this.keepOpen = false;

					if (options.openOnHover !== undefined) {
						this.openOnHover = options.openOnHover;
					}

					// exception for Administration dropdown
					if (this.id === "AdminContainer") {
						// excluding border
						var headerWidth = this.header.OuterWidth();
						if (headerWidth >= this.menu.OuterWidth()) {
							this.menu.Width(headerWidth + 10);
						}
					}

					// exception for "My ExactOnline" dropdown
					if (this.id === "MyExactOnlineContainer") {
						var menuWidth = this.header.OuterWidth();
						this.menu.Width(menuWidth);
						var width = this.menu.Width();
						if (width < 160) {
							width = 160;
							this.menu.Width(width);
						}
					}

					if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
						var overlay = $("<iframe class='IEIFrameOverlay' frameborder='0' style='right: -3px; z-index: 10;'></iframe>");
						overlay.insertBefore(this.menu.element);
						this._overlay = new SysElement(overlay);
					}

					if (this.openOnHover) {
						this._OpenOnHover();
					} else {
						this._OpenOnClick();
					}
					this._AddCloseDelay();
				};

				MenuDef.prototype._OpenOnClick = function () {
					var me = this;

					this.header.element.click(function () {
						if (me._hideTimeoutId !== 0) {
							window.clearTimeout(me._hideTimeoutId);
							me._hideTimeoutId = 0;
						}
						if (me.state === MenuDef.State.Collapsed) {
							MenuManager.CollapseAll();
							me.Expand();
						}
						else {
							me.Collapse();
						}
					});
				}

				MenuDef.prototype._OpenOnHover = function () {
					var me = this;

					this.header.element.hover(
						function () {
							me._showTimeoutId = window.setTimeout(
								function () {
									if (me.state === MenuDef.State.Collapsed) {
										MenuManager.CollapseAll();
										me.Expand();
									}
								}, me._showTimeout);
						},
						function () {
							if (me._showTimeoutId !== 0) {
								window.clearTimeout(me._showTimeoutId);
								me._showTimeoutId = 0;
							}
						}
					);

					this.header.element.click(
						function () {
							if (me.state === MenuDef.State.Collapsed) {
								MenuManager.CollapseAll();
								me.Expand();
							}
							if (me._showTimeoutId !== 0) {
								window.clearTimeout(me._showTimeoutId);
								me._showTimeoutId = 0;
							}
						}
					);
				}

				MenuDef.prototype._AddCloseDelay = function () {
					var me = this;

					this.container.element.hover(
						function () {
							me.mouseState = MenuDef.MouseState.Inside;
							if (me.state === MenuDef.State.Expanded && me._hideTimeoutId !== 0) {
								window.clearTimeout(me._hideTimeoutId);
								me._hideTimeoutId = 0;
							}
						},
						function () {
							me._hideTimeoutId = window.setTimeout(
								function () {
									me.mouseState = MenuDef.MouseState.Outside;
									if (!me.keepOpen) {
										me.Collapse();
									}
								}, me._hideTimeout);
						});
				}

				MenuDef._initialized = true;
			}

			this._Init(container, options);
		}

		return MenuDef;
	})();

	var manager = (function () {

		MenuManagerDef.prototype = {
			Add: function (containerId) {
				/// <summary></summary>
				/// <param name="containerId" type="Any">Any form acceptable by SysElement: supply the element(or its id) that holds the menu.</param>
				/// <returns type="undefined">undefined</returns>
			},

			CollapseAll: function () {
				/// <summary>Collapse all menus.</summary>
			}
		};

		function MenuManagerDef() {
			/// <summary>A manager to manage the dropdown menus. (Note: it is sort of a singleton: DO NOT instantiate it.</summary>

			if (MenuManagerDef._initialized === undefined) {

				var menus = [];

				MenuManagerDef.prototype.Add = function (containerId, options) {
					menus.push({ id: containerId, menu: new Menu(containerId, options) });
				};

				MenuManagerDef.prototype.Get = function (containerId) {
					for (var i = 0; i < menus.length; i++) {
						var item = menus[i];
						if (item.id == containerId) return item.menu;
					}
				};

				MenuManagerDef.prototype.CollapseAll = function () {
					for (var i = 0; i < menus.length; i++) {
						menus[i].menu.Collapse();
					}
				};

				MenuManagerDef.prototype._Init = function () {

				};

				MenuManagerDef._initialized = true;
			}

			this._Init();
		}


		return MenuManagerDef;
	})();

	window.MenuManager = new manager();
})();

;/// <reference path="..\base\jquery-1.5.1-vsdoc.js" />
/// <reference path="..\base\MicrosoftAjax.Debug.js" />
/// <reference path="..\SysControls\Dialog.js" />
/// <reference path="..\SysControls\DialogWrapper.js" />

// Main application object (which should be initialized from the portal page).
// NOTE: UNDER CONSTRUCTION

// Interface
SysApplication.prototype = {

	sysapplication: "1.0.0.0",

	ClearSession: function() {
		/// <summary>Clears session information.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	CheckLocking: function(check) {
		/// <summary>(Re)set check locking.</summary>
		/// <param name="check" type="Boolean"></param>
		/// <returns type="undefined">undefined</returns>
	},
	CheckLockings: function() {
		/// <summary>Issues a warning to the user if the application and/or his/her administration is about to be 
		/// locked down.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	SetCookie: function(name, value, expires, path, domain, secure) {
		/// <summary>Enters a name-value pair into the cookie.</summary>
		/// <param name="name" type="String"></param>
		/// <param name="value" type="Any" optional="true"></param>
		/// <param name="expires" type="Date" optional="true"></param>
		/// <param name="path" type="String" optional="true"></param>
		/// <param name="domain" type="String" optional="true"></param>
		/// <param name="secure" type="Boolean" optional="true"></param>
		/// <returns type="undefined">undefined</returns>
	},
	GetCookie: function GetCookie(name) {
		/// <summary>Gets value for 'name' from the cookie.</summary>
		/// <param name="" type=""></param>
		/// <returns type="undefined">undefined</returns>
	}
};

// Mimic enumerators

// Mimic statics

// TODO: Create the one instance, and make into a singleton. Note window unload behaviour unwanted in a.o. the 
// subscription (hrmsubscription...) wizard, new administration (licnewcompany...), accountant...
// var GlobalApp = new SysApplication();
SysApplication.Instance = function() {
/// <summary>Get the instance of SysApplication.</summary>
/// <returns type="SysApplication"></returns>
if (!SysApplication._Instance) {
		SysApplication._Instance = "Create";
		SysApplication._Instance = new SysApplication();
	}
	return SysApplication._Instance;
};

// Constructor
function SysApplication() {
	/// <summary>DO NOT CALL THIS DIRECTLY, use SysApplication.Instance() instead. NOTE: UNDER CONSTRUCTION.</summary>
	/// <param name="" type=""></param>
	/// <returns type="undefined">undefined</returns>

	// until instance is started from SysControls (iso (menu)portal.aspx check for portal
	// TODO: modify and call SysWindow.Location()?
	if (SysApplication._Instance !== "Create" || window.location.pathname.toLowerCase().indexOf("menuportal.aspx") < 0) {
		throw new Error("Do not call the constructor of SysApplication directly!");
	}

	if (SysApplication._initialized === undefined) {
		SysApplication._initialized = true;

		// 2nd part of the or is the legacy part.
		var _allowSwitch = false || window.top.allowSwitch;
		SysApplication.prototype.ClearSession = function() {
			if (!_allowSwitch) {
				SysCallback("ClearSession.aspx");
				document.execCommand('ClearAuthenticationCache', false);
			}
		}

		var _checkLocking = true;
		SysApplication.prototype.CheckLockings = function () {
			if (_checkLocking) {
				var lock = SysCallback("SysCallBack.aspx?Action=4", null, null, "json");
				if (lock && lock.locked) {
					_checkLocking = false;
					new WarningDialog({
						headerTerm: lock.message,
						width: 400,
						height: 200,
						handler: function () {
							_checkLocking = true;
						}
					});
				}
			}
		}

		SysApplication.prototype.CheckLocking = function(check) {
			_checkLocking = check;
		}

		SysApplication.prototype.SetCookie = function(name, value, expires, path, domain, secure) {
			var curCookie = name + "=" + escape(value) +
				((expires) ? "; expires=" + expires.toGMTString() : "") +
				((path) ? "; path=" + path : "") +
				((domain) ? "; domain=" + domain : "") +
				((secure) ? "; secure" : "");
			document.cookie = curCookie;
		}

		SysApplication.prototype.GetCookie = function GetCookie(name) {
			var dc = document.cookie;
			var prefix = name + "=";
			var begin = dc.indexOf("; " + prefix);
			if (begin == -1) {
				begin = dc.indexOf(prefix);
				if (begin != 0)
					return null;
			} else
				begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1)
				end = dc.length;
			return unescape(dc.substring(begin + prefix.length, end));
		}

		// Local interface
		SysApplication.prototype._Init = function() {
			$().ready(function() {
				// Inside event callback, this !== SysApplication.Instance()
				var inst = SysApplication.Instance();
				inst.CheckLockings();
				window.setInterval("SysApplication.Instance().CheckLockings()", 600000);
				//inst.CheckCookie();
				$addHandler(window, 'unload', inst.ClearSession);
			});
		}
	};

	this._Init();
}

// private 'static':
;/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/jquery-ui-1.8.12.custom.js" />
/// <reference path="SysElement.js" />
/// <reference path="SysWindow.js" />

(function () {

	var SysPage = (function () {

		var defaultOptions = {
			helpCaption: "Exact Online",
			helpid: 26862,
			showDocument: false,
			messageHelpWith: 'Help with "{0}"'
			
		};

		SysPageDef.prototype = {
			UpdateMenu: function () {
				/// <summary>Update the menu on top of the page.</summary>
				/// <returns type="undefined">undefined</returns>
			},
			BindHelpKey: function () {
			}
		};

		function SysPageDef(options) {
			/// <summary></summary>
			/// <param name="options" type="Object">An object consisting of name value pairs with options for modifing the menu.</param>
			/// <field name="title" type="String">Title of the page.</field>
			/// <field name="helpid" type="String">ID of the help document.</field>
			/// <field name="showDocument" type="Boolean">Indicates if the help menu in the header should show the document link.</field>
			/// <field name="messageHelpWith" type="String">The document link includes a message that should be localized by the server.</field>
			if (SysPageDef._initialized === undefined) {

				SysPageDef.prototype.UpdateMenu = function () {
					if (this._options.showDocument) {
						// Be aware that String.format is part of the MicrosoftAjax library
						this._linkHelpDocument.parent().show();
						this._linkHelpDocument.text(String.format(this._options.messageHelpWith, this._options.helpCaption));
					} else {
						this._linkHelpDocument.parent().hide();
					}
				};

				SysPageDef.prototype.BindHelpKey = function () {
					$(document).keydown(function (event) {
						if (new SysHandleKey(event).IsF1Key()) {
							var gotoHelp = SysPage.helpId;
							if ("MainWindow" === SysPage.helpId) {
								if (Dialog.InDialog(window)) {
									// Normally the 'MainWindow' is inside an iframe, which is what we try to find first
									var frm = SysWindow.GetWindow("MainWindow");
									var mainWindow = null;
									if (SysElement.IsNotNothing(frm)){
										mainWindow = frm.contentWindow;
									}
									// If it isn't we'll look for the THE main window (e.g. if a page was directly accessed via its url instead of via the menu
									// which is a.o. the case when running test scripts).
									if (SysElement.IsNothing(mainWindow)) {
										mainWindow = SysWindow.GetMainWindow();
									}
									if (mainWindow.SysPage) {
										gotoHelp = mainWindow.SysPage.helpId;
									}
								}
							}
							HlpDocument(gotoHelp);
							new SysHandleEvent(event).StopPropagation();
						}
					});
					$(document).unbind("help");
				};

				SysPageDef.prototype._Init = function (options) {
					var me = this;
					this._options = $.extend({}, defaultOptions, options);
					this._mainWindow = SysWindow.GetMainWindow();
					this._jqMainWindow = this._mainWindow.jQuery;
					this._MenuManager = this._mainWindow.MenuManager;
					this._linkHelpDocument = this._jqMainWindow("#HelpDocumentLink > a");
					SysPageDef.helpId = this._options.helpid;

					if (!jQuery.isFunction(HlpDocument) || !this._options.helpid) {
						this._options.showDocument = false;
					} else {
						this._linkHelpDocument.unbind('click').click(function () {
							if (SysElement.IsNotNothing(me._MenuManager)) {
								me._MenuManager.CollapseAll();
							}
							HlpDocument(me._options.helpid);
						});
					}
				};
				SysPageDef._initialized = true;
			};
			if (!(typeof options === "object" && options.inherit)) {
				this._Init(options);
			}
		}

		return SysPageDef;
	})();
	window.SysPage = SysPage;
})();;