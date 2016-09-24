(function (exports, window, $) {
	var initialized = false;
	var enhancedNavigation;
	var pointerEventsSupported = false;

	function init() {
		enhancedNavigation = $('.enhanced-navigation');
		pointerEventsSupported = !UserAgent.IsIE() || UserAgent.IsIE11OrUp();
		
		if (pointerEventsSupported) {
			addOverlay();
		}

		initialized = true;
	}

	function addOverlay() {
		if (UserAgent.IsIE11OrUp()) {
			var overlay = $('<iframe />')
				.addClass('enhanced-navigation__overlay-iframe')
				.attr({'frameborder': '0'});

			enhancedNavigation.prepend(overlay);
		}

		enhancedNavigation.prepend('<div class="enhanced-navigation__overlay" />');
	}

	var EnhancedNavigation = {
		showOverlay: function () {
			if (!initialized) {
				init();
			}

			if (pointerEventsSupported) {
				enhancedNavigation.addClass('enhanced-navigation--show-overlay');
			}
		},
		hideOverlay: function () {
			if (!initialized) {
				init();
			}

			if (pointerEventsSupported) {
				enhancedNavigation.removeClass('enhanced-navigation--show-overlay');
			}
			
		}
	}

	exports.EnhancedNavigation = EnhancedNavigation;
})(window, window, jQuery);;(function (window, $, exports) {
	var States = {
		'Empty': 1,
		'Filled': 2
	};

	var KeyCodes = {
		'Enter': 13,
		'Escape': 27
	};


	var EnhancedSearch = function (id, searchFn) {
		this._id = id;
		this._searchFn = searchFn;

		// get the elements
		this._search = $('#' + id);
		this._field = this._search.find('.enhanced-search__field');
		this._clear = this._search.find('.enhanced-search__clear');
		this._button = this._search.find('.enhanced-search__button');

		// attach the events
		this._button.click($.proxy(this.search, this));
		this._clear.click($.proxy(this.clearClick, this));
		this._field.keyup($.proxy(this.fieldKeyup, this));
	};

	EnhancedSearch.prototype.getState = function () {
		if (this._search.hasClass('enhanced-search--filled')) {
			return States.Filled;
		} else {
			return States.Empty;
		}
	}

	EnhancedSearch.prototype.setState = function (state) {
		if (state === States.Empty) {
			this._search.removeClass('enhanced-search--filled');
		} else if (state === States.Filled) {
			this._search.addClass('enhanced-search--filled');
		}
	}

	EnhancedSearch.prototype.fieldKeyup = function (event) {
		var isEmpty = !this._field.val();
		
		if (event.which === KeyCodes.Enter) {
			this.search();
		} else if (event.which === KeyCodes.Escape) {
			this.setState(States.Empty);
			this.clear();
			this.focus();
		} else if (isEmpty) {
			this.setState(States.Empty);
		} else {
			this.setState(States.Filled);
		}
	};

	EnhancedSearch.prototype.clearClick = function () {
		var state = this.getState();

		if (state === States.Filled) {
			this.clear();
			this.focus();
			this.setState(States.Empty);
		}
	};

	EnhancedSearch.prototype.search = function () {
		var searchText = this._field.val();
		this._searchFn(searchText);
	};

	EnhancedSearch.prototype.clear = function () {
		this._field.val('');
	};

	EnhancedSearch.prototype.focus = function () {
		this._field.focus();
	};

	exports.EnhancedSearch = EnhancedSearch;

})(window, jQuery, window);;/**
 * menu-aim is a jQuery plugin for dropdown menus that can differentiate
 * between a user trying hover over a dropdown item vs trying to navigate into
 * a submenu's contents.
 *
 * menu-aim assumes that you have are using a menu with submenus that expand
 * to the menu's right. It will fire events when the user's mouse enters a new
 * dropdown item *and* when that item is being intentionally hovered over.
 *
 * __________________________
 * | Monkeys  >|   Gorilla  |
 * | Gorillas >|   Content  |
 * | Chimps   >|   Here     |
 * |___________|____________|
 *
 * In the above example, "Gorillas" is selected and its submenu content is
 * being shown on the right. Imagine that the user's cursor is hovering over
 * "Gorillas." When they move their mouse into the "Gorilla Content" area, they
 * may briefly hover over "Chimps." This shouldn't close the "Gorilla Content"
 * area.
 *
 * This problem is normally solved using timeouts and delays. menu-aim tries to
 * solve this by detecting the direction of the user's mouse movement. This can
 * make for quicker transitions when navigating up and down the menu. The
 * experience is hopefully similar to amazon.com/'s "Shop by Department"
 * dropdown.
 *
 * Use like so:
 *
 *      $("#menu").menuAim({
 *          activate: $.noop,  // fired on row activation
 *          deactivate: $.noop  // fired on row deactivation
 *      });
 *
 *  ...to receive events when a menu's row has been purposefully (de)activated.
 *
 * The following options can be passed to menuAim. All functions execute with
 * the relevant row's HTML element as the execution context ('this'):
 *
 *      .menuAim({
 *          // Function to call when a row is purposefully activated. Use this
 *          // to show a submenu's content for the activated row.
 *          activate: function() {},
 *
 *          // Function to call when a row is deactivated.
 *          deactivate: function() {},
 *
 *          // Function to call when mouse enters a menu row. Entering a row
 *          // does not mean the row has been activated, as the user may be
 *          // mousing over to a submenu.
 *          enter: function() {},
 *
 *          // Function to call when mouse exits a menu row.
 *          exit: function() {},
 *
 *          // Selector for identifying which elements in the menu are rows
 *          // that can trigger the above events. Defaults to "> li".
 *          rowSelector: "> li",
 *
 *          // You may have some menu rows that aren't submenus and therefore
 *          // shouldn't ever need to "activate." If so, filter submenu rows w/
 *          // this selector. Defaults to "*" (all elements).
 *          submenuSelector: "*",
 *
 *          // Direction the submenu opens relative to the main menu. Can be
 *          // left, right, above, or below. Defaults to "right".
 *          submenuDirection: "right"
 *      });
 *
 * https://github.com/kamens/jQuery-menu-aim
*/
(function($) {

    $.fn.menuAim = function(opts) {
        // Initialize menu-aim for all elements in jQuery collection
        this.each(function() {
            init.call(this, opts);
        });

        return this;
    };

    function init(opts) {
        var $menu = $(this),
            activeRow = null,
            mouseLocs = [],
            lastDelayLoc = null,
            timeoutId = null,
            options = $.extend({
                rowSelector: "> li",
                submenuSelector: "*",
                submenuDirection: "right",
                tolerance: 75,  // bigger = more forgivey when entering submenu
                enter: $.noop,
                exit: $.noop,
                activate: $.noop,
                deactivate: $.noop,
                exitMenu: $.noop
            }, opts);

        var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
            DELAY = 300;  // ms delay when user appears to be entering submenu

        /**
         * Keep track of the last few locations of the mouse.
         */
        var mousemoveDocument = function(e) {
                mouseLocs.push({x: e.pageX, y: e.pageY});

                if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
                    mouseLocs.shift();
                }
            };

        /**
         * Cancel possible row activations when leaving the menu entirely
         */
        var mouseleaveMenu = function() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // If exitMenu is supplied and returns true, deactivate the
                // currently active row on menu exit.
                if (options.exitMenu(this)) {
                    if (activeRow) {
                        options.deactivate(activeRow);
                    }

                    activeRow = null;
                }
            };

        /**
         * Trigger a possible row activation whenever entering a new row.
         */
        var mouseenterRow = function() {
                if (timeoutId) {
                    // Cancel any previous activation delays
                    clearTimeout(timeoutId);
                }

                options.enter(this);
                possiblyActivate(this);
            },
            mouseleaveRow = function() {
                options.exit(this);
            };

        /*
         * Immediately activate a row if the user clicks on it.
         */
        var clickRow = function() {
                activate(this);
            };

        /**
         * Activate a menu row.
         */
        var activate = function(row) {
                if (row == activeRow) {
                    return;
                }

                if (activeRow) {
                    options.deactivate(activeRow);
                }

                options.activate(row);
                activeRow = row;
            };

        /**
         * Possibly activate a menu row. If mouse movement indicates that we
         * shouldn't activate yet because user may be trying to enter
         * a submenu's content, then delay and check again later.
         */
        var possiblyActivate = function(row) {
                var delay = activationDelay();

                if (delay) {
                    timeoutId = setTimeout(function() {
                        possiblyActivate(row);
                    }, delay);
                } else {
                    activate(row);
                }
            };

        /**
         * Return the amount of time that should be used as a delay before the
         * currently hovered row is activated.
         *
         * Returns 0 if the activation should happen immediately. Otherwise,
         * returns the number of milliseconds that should be delayed before
         * checking again to see if the row should be activated.
         */
        var activationDelay = function() {
                if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
                    // If there is no other submenu row already active, then
                    // go ahead and activate immediately.
                    return 0;
                }

                var offset = $menu.offset(),
                    upperLeft = {
                        x: offset.left,
                        y: offset.top - options.tolerance
                    },
                    upperRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: upperLeft.y
                    },
                    lowerLeft = {
                        x: offset.left,
                        y: offset.top + $menu.outerHeight() + options.tolerance
                    },
                    lowerRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: lowerLeft.y
                    },
                    loc = mouseLocs[mouseLocs.length - 1],
                    prevLoc = mouseLocs[0];

                if (!loc) {
                    return 0;
                }

                if (!prevLoc) {
                    prevLoc = loc;
                }

                if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
                    prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
                    // If the previous mouse location was outside of the entire
                    // menu's bounds, immediately activate.
                    return 0;
                }

                if (lastDelayLoc &&
                        loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
                    // If the mouse hasn't moved since the last time we checked
                    // for activation status, immediately activate.
                    return 0;
                }

                // Detect if the user is moving towards the currently activated
                // submenu.
                //
                // If the mouse is heading relatively clearly towards
                // the submenu's content, we should wait and give the user more
                // time before activating a new row. If the mouse is heading
                // elsewhere, we can immediately activate a new row.
                //
                // We detect this by calculating the slope formed between the
                // current mouse location and the upper/lower right points of
                // the menu. We do the same for the previous mouse location.
                // If the current mouse location's slopes are
                // increasing/decreasing appropriately compared to the
                // previous's, we know the user is moving toward the submenu.
                //
                // Note that since the y-axis increases as the cursor moves
                // down the screen, we are looking for the slope between the
                // cursor and the upper right corner to decrease over time, not
                // increase (somewhat counterintuitively).
                function slope(a, b) {
                    return (b.y - a.y) / (b.x - a.x);
                };

                var decreasingCorner = upperRight,
                    increasingCorner = lowerRight;

                // Our expectations for decreasing or increasing slope values
                // depends on which direction the submenu opens relative to the
                // main menu. By default, if the menu opens on the right, we
                // expect the slope between the cursor and the upper right
                // corner to decrease over time, as explained above. If the
                // submenu opens in a different direction, we change our slope
                // expectations.
                if (options.submenuDirection == "left") {
                    decreasingCorner = lowerLeft;
                    increasingCorner = upperLeft;
                } else if (options.submenuDirection == "below") {
                    decreasingCorner = lowerRight;
                    increasingCorner = lowerLeft;
                } else if (options.submenuDirection == "above") {
                    decreasingCorner = upperLeft;
                    increasingCorner = upperRight;
                }

                var decreasingSlope = slope(loc, decreasingCorner),
                    increasingSlope = slope(loc, increasingCorner),
                    prevDecreasingSlope = slope(prevLoc, decreasingCorner),
                    prevIncreasingSlope = slope(prevLoc, increasingCorner);

                if (decreasingSlope < prevDecreasingSlope &&
                        increasingSlope > prevIncreasingSlope) {
                    // Mouse is moving from previous location towards the
                    // currently activated submenu. Delay before activating a
                    // new menu row, because user may be moving into submenu.
                    lastDelayLoc = loc;
                    return DELAY;
                }

                lastDelayLoc = null;
                return 0;
            };

        /**
         * Hook up initial menu events
         */
        $menu
            .mouseleave(mouseleaveMenu)
            .find(options.rowSelector)
                .mouseenter(mouseenterRow)
                .mouseleave(mouseleaveRow)
                .click(clickRow);

        $(document).mousemove(mousemoveDocument);

    };
})(jQuery);

;(function (exports, window, $) {
	var MENU_DELAY = 200,
		MENU_MINIMUM_HEIGHT = 128;

	var MegaMenu = function (el) {
		this.el = $(el);
		this.activeMenu = null;
		this.activeSubmenu = null;

		this.openMenuTimer = null;
		this.closeMenuTimer = null;

		this.el.find('.megamenu__item')
			.hover($.proxy(this.openMenu, this), $.proxy(this.closeMenu, this))
			.click($.proxy(this.clickMenu, this));

		// Add menuAim to the submenu's
		var openSubmenuFn = $.proxy(this.openSubmenu, this)
		this.el
			.find('.megamenu-submenu')
			.each(function () {
				$(this).menuAim({
					activate: openSubmenuFn
				});
			});

		// Inject iframes as Internet Explorer will otherwise show a pdf on top of the menu
		if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
			this.injectIFrames();
		}

		this.wrapSubmenuItem(el);
	}

	MegaMenu.prototype.wrapSubmenuItem = function (row) {
		// create a structure in which we can test if a submenu item title will overflow its container
		var hypothesisContainer = $('<div />')
			.css({
				'position': 'absolute',
				'top': '-9999px',
				'visibility': 'hidden',
				'font-family': 'Arial',
				'font-size': '14px',
				'font-weight': 'bold',
				'width': '161px'
			})[0];

		var hypothesisContent = $('<span />').css('white-space', 'nowrap')[0];
		var hypothesisContentTextNode = document.createTextNode('');

		hypothesisContent.appendChild(hypothesisContentTextNode);
		hypothesisContainer.appendChild(hypothesisContent);
		document.body.appendChild(hypothesisContainer);

		var hypothesisContainerWidth = hypothesisContainer.offsetWidth;

		var submenuTitle = $(row).find('.megamenu-submenu__item-title');
		submenuTitle.each(function () {
			var $this = $(this);
			var text = $this.find('.megamenu-submenu__item-title-part').text();

			var lines = convertTextToLines(text);
			if (lines.length > 1) {
				$this.empty();

				$(lines).each(function (i, line) {
					$this.append($('<div class="megamenu-submenu__item-title-part" />').text(line));
				});
			}
		});

		document.body.removeChild(hypothesisContainer);

		// function declarations internal to wrapSubmenuItem
		function fits(line) {
			hypothesisContentTextNode.nodeValue = line;
			return hypothesisContainerWidth >= hypothesisContent.offsetWidth;
		}

		// 'a sentence with a_word_that_doesnt_fit' => ['a sentence with', 'a_word_that_doesnt_fit']
		function convertTextToLines(title) {
			var words = [];

			if (title !== undefined) {
				words = title.split(' ');
			}

			var lines = convertWordsToLines(words, [], fits);
			return lines.map(function (line) {
				return line.join(' ');
			});
		}

		// ['a', 'sentence', 'with', 'a_word_that_doesnt_fit] => [['a', 'sentence', 'with'], ['a_word_that_doesnt_fit']]
		function convertWordsToLines(words, lines, fits) {
			if (words.length === 0) {
				return lines;
			}

			var word = words.shift();
			var last = lines[lines.length - 1] || [];

			var hypothesis = last.concat(word).join(' ');
			if (!fits(hypothesis) || last.length === 0) {
				lines.push([word]);
			} else {
				last.push(word);
			}

			return convertWordsToLines(words, lines, fits);
		}
	}

	// closes the all menu's
	MegaMenu.prototype.close = function () {
		this._closeMenu();
	};

	MegaMenu.prototype.openMenu = function (e) {
		var menu = e.currentTarget;

		this.cancelCloseMenuTimer();

		if (this.openMenuTimer === null && this.activeMenu !== menu) {
			this.openMenuTimer = window.setTimeout($.proxy(function () { this._openMenu(menu); }, this), MENU_DELAY);
		}
	}

	MegaMenu.prototype._openMenu = function (menu) {
		if (this.activeMenu !== menu) {
			this.activeSubmenu = $(menu).find('.megamenu-submenu .megamenu-submenu__item')[0];
		}
		this.activeMenu = menu;

		this.openMenuTimer = null;
		this.setMenuPosition();

		// Close all menu items
		this.el
			.find('.megamenu__item')
			.removeClass('megamenu__item--active');

		// Open the active menu item
		$(this.activeMenu).addClass('megamenu__item--active');

		MenuManager.CollapseAll();

		//Showing an overlay layer when item is active
		if (typeof EnhancedNavigation !== "undefined") {
			EnhancedNavigation.showOverlay();
		}

		this.openSubmenu(this.activeSubmenu);
	}

	MegaMenu.prototype.closeMenu = function () {
		this.cancelOpenMenuTimer();

		if (this.closeMenuTimer === null) {
			this.closeMenuTimer = window.setTimeout($.proxy(this._closeMenu, this), MENU_DELAY);
		}
	}

	MegaMenu.prototype._closeMenu = function () {
		if (this.activeMenu === null) {
			return;
		}

		this.activeMenu = null;
		this.closeMenuTimer = null;

		// Close all menu items
		this.el
			.find('.megamenu__item')
			.removeClass('megamenu__item--active');

		// Close all submenu items
		this.el
			.find('.megamenu__item')
			.find('.megamenu-submenu__item')
			.removeClass('megamenu-submenu__item--active');

		//Hiding the overlay layer when item is inactive
		if (typeof EnhancedNavigation !== "undefined") {
			EnhancedNavigation.hideOverlay();
		}
	}

	MegaMenu.prototype.clickMenu = function (e) {
		var menu = e.currentTarget;

		this.cancelOpenMenuTimer();
		this.cancelCloseMenuTimer();

		if (this.activeMenu !== menu) {
			this._openMenu(menu);
		}
	}

	MegaMenu.prototype.openSubmenu = function (row) {
		// Close all submenu items
		this.el
			.find('.megamenu-submenu__item')
			.removeClass("megamenu-submenu__item--active");

		// Open the active submenu item
		$(row).addClass("megamenu-submenu__item--active");

		this.setMenuHeight();
	};

	MegaMenu.prototype.setMenuPosition = function () {
		var megaMenuContent = $(this.activeMenu).find('.megamenu__item-content');

		var activeMenuOffsetLeft = $(this.activeMenu).offset().left;

		// because the menu's overlap, there's a 4px difference between the offset of an active and
		// an inactive menu item
		if (!$(this.activeMenu).hasClass('megamenu__item--active')) {
			activeMenuOffsetLeft = activeMenuOffsetLeft - 4;
		}

		// calculates where the rightmost point of the menu content will get positioned
		// 4px added for margin on the right side
		var megaMenuOffsetRight = activeMenuOffsetLeft + megaMenuContent.outerWidth() + 4;

		var defaultOffsetLeft = -1; // the menu content always needs to be moved 1px to the left regardless
		var offsetLeft = defaultOffsetLeft;

		// if the menu content will be outside of the window, move it to the left
		if (megaMenuOffsetRight > window.innerWidth) {
			offsetLeft = defaultOffsetLeft + window.innerWidth - megaMenuOffsetRight;

			// never move the menu content further to the left than the leftmost point of the menu header
			// to keep the leftmost point of the menu content always visible
			offsetLeft = Math.max(offsetLeft, -activeMenuOffsetLeft);
		}

		megaMenuContent.css('left', offsetLeft);

		if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
			$(this.activeMenu).find('.megamenu__item-iframe').css('left', offsetLeft);
		}
	}

	MegaMenu.prototype.setMenuHeight = function () {
		// this can be optimized to only update the height the first time the menu is shown
		// it does however need to be visible to get its height
		var $activeMenu = $(this.activeMenu);

		var height = Math.max.apply(null, $activeMenu
			.find('.megamenu-submenu__item-content')
			.map(function () {
				return $(this).height();
			}));

		height = Math.max(height, MENU_MINIMUM_HEIGHT);

		$activeMenu.find('.megamenu__item-content').css('min-height', height);
		$activeMenu.find('.megamenu-submenu').css('min-height', height);

		if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
			$activeMenu.find('.megamenu__item-iframe').css('min-height', height + 6);
		}
	};

	MegaMenu.prototype.cancelOpenMenuTimer = function () {
		window.clearTimeout(this.openMenuTimer);
		this.openMenuTimer = null;
	};

	MegaMenu.prototype.cancelCloseMenuTimer = function () {
		window.clearTimeout(this.closeMenuTimer);
		this.closeMenuTimer = null;
	};

	MegaMenu.prototype.injectIFrames = function () {
		this.el.find('.megamenu__item').each(function () {
			var iframe = $('<iframe />')
				.addClass('megamenu__item-iframe')
				.attr('frameborder', '0')

			$(this).append(iframe);
		})
	};

	exports.MegaMenu = MegaMenu;
})(window, window, jQuery);;