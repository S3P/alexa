/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

var _syscomponentsversion = "1.0.0.2";

function cBaseControl()
{
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

function cBaseValidated()
{
}
// Inheritance
cBaseValidated.prototype = new cBaseControl();

;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

function cBaseValidatedList()
{
}
// Inheritance
cBaseValidatedList.prototype = new cBaseValidated();

;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

// Inheritance
cColorField.prototype = new cBaseControl();

// Constructor
cColorField.prototype.constructor = cColorField;

function cColorField()
{
	// Fields
	this.id = '';
	this.input;
	this.span;
	// Constructor
	if ( arguments.length )
	{
		this.id = arguments[0];
		this.input = SysGetElement(this.id);
		this.input.Ctl = this;
		this.span = SysGetElement(this.id + '_color');
	}
	return this;
}
cColorField.prototype.Value = function(value)
{
	if ( arguments.length )
	{
		this.input.setAttribute('value', value);
		var n = new Number(value);
		var x = '000000' + n.toString(16);
		x = "#" + x.substr(x.length -6);
		this.span.style.backgroundColor = x;
		this.span.title = x + '(' + value +')';
	}
	return this.input.getAttribute('value')
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />
/// <reference path="..\docs\ui.core.js" />
/// <reference path="..\docs\ui.draggable.js" />
/// <reference path="..\docs\ui.droppable.js" />

// Inheritance
cColumnSelector.prototype = new cBaseControl();

// Constructor
cColumnSelector.prototype.constructor = cColumnSelector;

function cColumnSelector()
{
	// Fields
	this.id = '';
	this.lbx = null;

	this.btnAdd = null;
	this.btnRemove = null;

	this.btnAddGroup = null;

	this.btnMoveUp = null;
	this.btnMoveDown = null;
	this.btnMoveLeft = null;
	this.btnMoveRight = null;

	this.btnSizeDec = null;
	this.btnSizeInc = null;

	this.btnAddSpace = null;

	this.rbNormal = null;
	this.rbItalic = null;
	this.rbBold = null;
	this.rbMedium = null;
	this.rbLarge = null;

	this.columns = null;
	this.headers = null;

	this.selectedColumn = null;
	this.selectedAvailableColumn = null;

	this.dragging = 0;
	this.hasGroupBy = true;

	// Constructor
	if (arguments.length)
	{
		this.id = arguments[0];
		this.lbx = SysGetElement(this.id + '_fields');
		if (this.lbx == null)
			return;
		this.lbx.Ctl = this;

		this.btnAdd = SysGetElement(this.id + '_btnAdd');
		this.SetButtonEvents(this.btnAdd);
		this.btnAdd.Ctl = this;

		this.btnRemove = SysGetElement(this.id + '_btnRemove');
		this.SetButtonEvents(this.btnRemove);
		this.btnRemove.Ctl = this;

		this.btnMoveUp = SysGetElement(this.id + '_btnMoveUp');
		this.SetButtonEvents(this.btnMoveUp);
		this.btnMoveUp.Ctl = this;
		this.btnMoveDown = SysGetElement(this.id + '_btnMoveDown');
		this.SetButtonEvents(this.btnMoveDown);
		this.btnMoveDown.Ctl = this;
		this.btnMoveLeft = SysGetElement(this.id + '_btnMoveLeft');
		this.SetButtonEvents(this.btnMoveLeft);
		this.btnMoveLeft.Ctl = this;
		this.btnMoveRight = SysGetElement(this.id + '_btnMoveRight');
		this.SetButtonEvents(this.btnMoveRight);
		this.btnMoveRight.Ctl = this;

		this.btnSizeDec = SysGetElement(this.id + '_btnSizeDec');
		this.SetButtonEvents(this.btnSizeDec);
		this.btnSizeDec.Ctl = this;
		this.btnSizeInc = SysGetElement(this.id + '_btnSizeInc');
		this.SetButtonEvents(this.btnSizeInc);
		this.btnSizeInc.Ctl = this;

		this.btnAddSpace = SysGetElement(this.id + '_btnAddSpace');
		this.SetButtonEvents(this.btnAddSpace);
		this.btnAddSpace.Ctl = this;

		this.btnAddGroup = SysGetElement(this.id + '_btnAddGroup');
		if (this.btnAddGroup == null) {
			this.hasGroupBy = false;
		}

		if (this.hasGroupBy == true) {
			this.SetButtonEvents(this.btnAddGroup);
			this.btnAddGroup.Ctl = this;
		}

		this.rbNormal = SysGetElement(this.id + '_rbNormal');
		this.rbNormal.Ctl = this;
		this.rbItalic = SysGetElement(this.id + '_rbItalic');
		this.rbItalic.Ctl = this;
		this.rbBold = SysGetElement(this.id + '_rbBold');
		this.rbBold.Ctl = this;
		this.rbMedium = SysGetElement(this.id + '_rbMedium');
		this.rbMedium.Ctl = this;
		this.rbLarge = SysGetElement(this.id + '_rbLarge');
		this.rbLarge.Ctl = this;

		this.columns = SysGetElement(this.id + '_columns');
		this.columns.Ctl = this;

		this.headers = SysGetElement(this.id + '_headers');
		if (this.headers != null)
			this.headers.Ctl = this;
	}

	// Events
	$addHandler(this.lbx, 'click', function(e) { this.Ctl.LbxSelect(SysSrcElement(e)); });
	$addHandler(this.lbx, 'dblclick', function(e) { this.Ctl.ColumnAdd(); });

	this.AddOnClick(this.btnAdd, function(e) { this.Ctl.ColumnAdd(false); });
	this.AddOnClick(this.btnRemove, function(e) { this.Ctl.ColumnRemove(); });

	if (this.hasGroupBy == true) {
		this.AddOnClick(this.btnAddGroup, function (e) { this.Ctl.ColumnAdd(true); });
	}

	this.AddOnClick(this.btnMoveUp, function(e) { this.Ctl.MoveVert(-1); });
	this.AddOnClick(this.btnMoveDown, function(e) { this.Ctl.MoveVert(1); });
	this.AddOnClick(this.btnMoveLeft, function(e) { this.Ctl.MoveHor(-1); });
	this.AddOnClick(this.btnMoveRight, function(e) { this.Ctl.MoveHor(1); });

	this.AddOnClick(this.btnSizeDec, function(e) { this.Ctl.BtnResize(-1); });
	this.AddOnClick(this.btnSizeInc, function(e) { this.Ctl.BtnResize(1); });

	this.AddOnClick(this.btnAddSpace, function(e) { this.Ctl.BtnAddSpace(); });

	if (this.columns != null)
	{
		$addHandler(this.columns, 'click', function(e) { this.Ctl.Select(SysSrcElement(e)); });
		$addHandler(this.columns, 'dblclick', function(e) { this.Ctl.ColumnRemove(); });
	}

	if (this.headers != null)
	{
		$addHandler(this.headers, 'click', function(e) { this.Ctl.Select(SysSrcElement(e)); });
		$addHandler(this.headers, 'dblclick', function(e) { this.Ctl.ColumnRemove(); });
	}

	this.AddDraggable($('.ColumnAvailable td'), 1);
	this.AddDraggable($('.ColumnEditor td:not(:last-child)'), 2);
	this.AddDroppable($('.ColumnEditor td'));

	$addHandler(this.rbNormal, 'click', function(e) { this.Ctl.SetClass(''); });
	$addHandler(this.rbItalic, 'click', function(e) { this.Ctl.SetClass('c1'); });
	$addHandler(this.rbBold  , 'click', function(e) { this.Ctl.SetClass('c2'); });
	$addHandler(this.rbMedium, 'click', function(e) { this.Ctl.SetClass('c3'); });
	$addHandler(this.rbLarge , 'click', function(e) { this.Ctl.SetClass('c4'); });

	var objThis = this;
	$('form:first').bind('submit', function() { objThis.Unload(); });

	this.SelectedColumn(null);
	this.SelectedAvailableColumn(null);

	return this;
}

// Methods and Properties
cColumnSelector.prototype.Unload = function()
{
	var t = SysGetElement(this.id + '_headers');
	var v = '';
	if (t) v = cColumnBuildRow(v, t, 1);

	t = SysGetElement(this.id + '_columns');
	v += '+';
	if (t) v = cColumnBuildRow(v, t, 0);

	SysSet(this.id, v);
}

function cColumnBuildRow(v, t, g)
{
	for (var r = 0; r < 5; r++)
	{
		var tr = t.rows[r];
		for (var d = 0; d < tr.cells.length; d++)
		{
			var td = tr.cells[d];
			if (td.tagName == 'TD')
			{
				v += td.id + '&';
				switch (td.className)
				{
					case 'c1': v += '1&'; break;
					case 'c2': v += '2&'; break;
					case 'c3': v += '3&'; break;
					case 'c4': v += '4&'; break;
					case 'c5': v += '5&'; break;
					default  : v += '0&';
				}
				v += td.colSpan;
				v += ',';
			}
		}
		v += ';';
	}
	return v;
}

cColumnSelector.prototype.AddOnClick = function(btn, fnc)
{
	if (btn != null)
	{
		btn.parentNode.Ctl = this;
		$addHandler(btn.parentNode, 'click', fnc);
	}
}

cColumnSelector.prototype.SetClass = function(cl)
{
	var sc = this.SelectedColumn();
	if (sc != null)
	{
		sc.className = cl;
	}
}

cColumnSelector.prototype.ColumnSetClass = function()
{
	var sc = this.SelectedColumn();
	if (sc != null)
	{
		switch (sc.className)
		{
			case 'c1': this.rbItalic.checked = true; break;
			case 'c2': this.rbBold.checked   = true; break;
			case 'c3': this.rbMedium.checked = true; break;
			case 'c4': this.rbLarge.checked  = true; break;
			default  : this.rbNormal.checked = true;
		}
	}
}

cColumnSelector.prototype.LbxSelect = function(el)
{
	if (el.tagName == 'TD')
	{
		this.SelectedAvailableColumn(el);
	}
}

cColumnSelector.prototype.BtnAddSpace = function()
{
	var objRow = $(this.columns.rows[0]);

	var objInsert = $('<td />')
		.attr('s', '1')
		.attr('id', 'Space')
		.html('&nbsp;');

	objRow.children('td:last').before(objInsert);

	this.AddDraggable(objInsert, 2);
	this.AddDroppable(objInsert);
	this.Select(objInsert.get(0));
}

cColumnSelector.prototype.ColumnAdd = function(bGroup)
{
	var sc = this.selectedAvailableColumn;
	if (sc != null)
	{
		var objSelect = $(sc);
		var objRow = $(bGroup ? this.headers.rows[0] : this.columns.rows[0]);

		var objInsert = $('<td />')
			.attr('id', objSelect.attr('id').substr(1))
			.text(objSelect.text());

		objRow.children('td:last').before(objInsert);

		this.AddDraggable(objInsert, 2);
		this.AddDroppable(objInsert);
		this.Select(objInsert.get(0));
		objSelect.hide();
	}
}

cColumnSelector.prototype.ColumnRemove = function()
{
	var sc = this.SelectedColumn();
	if (sc != null && !this.IsFixedPosition(sc))
	{
		var columnElement = $(sc);
		var column = $('#_' + sc.getAttribute('id'));
		if (column.length || (!column.length && columnElement.html() == '&nbsp;')) {	//NB: else the selected column is not in the available columns. This means it is not customizable, so you cannot remove it
			column.show();
			this.SelectedColumn(null);
			columnElement.remove();
		}
	}
}

cColumnSelector.prototype.IsFixedPosition = function (column)
{
	return ($(column).is('.fixedPosition'));
}

cColumnSelector.prototype.BtnResize = function(nAdd)
{
	var sc = this.SelectedColumn();
	if (sc != null && sc.colSpan + nAdd > 0)
	{
		sc.colSpan += nAdd;
	}
}

cColumnSelector.prototype.MoveVert = function(nDist)
{
	var sc = this.SelectedColumn();
	if (sc != null && !this.IsFixedPosition(sc))
	{
		var objCol = $(sc);
		var objRow = Neighbour(objCol.parent(), nDist);
		if (objRow.is('tr'))
		{
			objRow.children('td:last').before(objCol);
		}
	}
}

cColumnSelector.prototype.MoveHor = function(nDist)
{
	var sc = this.SelectedColumn();
	if (sc != null && !this.IsFixedPosition(sc))
	{
		var objCol = $(sc);
		var objDest = Neighbour(objCol, nDist + (nDist >= 0 ? 1 : 0));

		if (objDest.is('td') && !this.IsFixedPosition(objDest))
		{
			objDest.before(objCol);
		}
	}
}

function Neighbour(obj, dist)
{
	if (dist > 0)
	{
		while (dist-- > 0) obj = obj.next();
	}
	else
	{
		while (dist++ < 0) obj = obj.prev();
	}
	return obj;
}

cColumnSelector.prototype.Select = function(el)
{
	if ($(el).is('td.ui-draggable'))
	{
		this.SelectedColumn(el);
	}
}

cColumnSelector.prototype.SelectedAvailableColumn = function(c)
{
	if (arguments.length > 0)
	{
		if (this.selectedAvailableColumn != null)
		{
			$(this.selectedAvailableColumn).removeClass('Selected');
		}
		this.selectedAvailableColumn = c;
		if (this.selectedAvailableColumn != null)
		{
			$(this.selectedAvailableColumn).addClass('Selected');
		}
		this.AvailableColumnDisable(this.selectedAvailableColumn == null);
	}
	return this.selectedAvailableColumn;
}

cColumnSelector.prototype.AvailableColumnDisable = function(disable)
{
	if (disable)
	{
		this.btnAdd.src = 'images/zone_edit_insertcol_g.gif';
		if (this.hasGroupBy == true) {
			this.btnAddGroup.src = 'images/zone_edit_insertcol_g.gif';
		}
	}
	else
	{
		this.btnAdd.src = 'images/zone_edit_insertcolumn.gif';
		if (this.hasGroupBy == true) {
			this.btnAddGroup.src = 'images/zone_edit_insertcolumn.gif';
		}
	}
	this.btnAdd.disabled = disable;
	if (this.hasGroupBy == true) {
		this.btnAddGroup.disabled = disable;
	}
}

cColumnSelector.prototype.SelectedColumn = function(c)
{
	if (arguments.length > 0)
	{
		if (this.selectedColumn != null)
		{
			$(this.selectedColumn).removeClass('Selected');
		}
		this.selectedColumn = c;
		if (this.selectedColumn != null)
		{
			$(this.selectedColumn).addClass('Selected');
		}
		this.ColumnDisable(this.selectedColumn == null);
		this.ColumnSetClass();
	}
	return this.selectedColumn;
}

cColumnSelector.prototype.ColumnDisable = function(disable)
{
	if (disable)
	{
		this.btnRemove.src = 'images/zone_edit_removecol_g.gif';
		this.btnMoveUp.src = 'images/zone_edit_moveup_g.gif';
		this.btnMoveDown.src = 'images/zone_edit_movedown_g.gif';
		this.btnMoveLeft.src = 'images/zone_edit_moveleft_g.gif';
		this.btnMoveRight.src = 'images/zone_edit_moveright_g.gif';
		this.btnSizeDec.src = 'images/zone_edit_resizemin_g.gif';
		this.btnSizeInc.src = 'images/zone_edit_resizeplus_g.gif';
	}
	else
	{
		this.btnRemove.src = 'images/zone_edit_removecolumn.gif';
		this.btnMoveUp.src = 'images/zone_edit_moveup.gif';
		this.btnMoveDown.src = 'images/zone_edit_movedown.gif';
		this.btnMoveLeft.src = 'images/zone_edit_moveleft.gif';
		this.btnMoveRight.src = 'images/zone_edit_moveright.gif';
		this.btnSizeDec.src = 'images/zone_edit_resizemin.gif';
		this.btnSizeInc.src = 'images/zone_edit_resizeplus.gif';
	}
	this.btnRemove.disabled = disable;
	this.btnMoveUp.disabled = disable;
	this.btnMoveDown.disabled = disable;
	this.btnMoveLeft.disabled = disable;
	this.btnMoveRight.disabled = disable;
	this.btnSizeDec.disabled = disable;
	this.btnSizeInc.disabled = disable;

	this.rbItalic.disabled = disable;
	this.rbBold.disabled = disable;
	this.rbNormal.disabled = disable;
	this.rbMedium.disabled = disable;
	this.rbLarge.disabled = disable;
}

cColumnSelector.prototype.SetButtonEvents = function(btn)
{
	$addHandler(btn, 'mouseover', function() { this.className = 'TBButtonOver'; });
	$addHandler(btn, 'mouseout' , function() { this.className = ''; });
	$addHandler(btn, 'mousedown', function() { this.className = 'TBButtonDown'; });
	$addHandler(btn, 'mouseup'  , function() { this.className = ''; });
}

cColumnSelector.prototype.AddDraggable = function(objs, nDragging)
{
	var objThis = this;

	return objs
		.draggable({
			cursor: 'move',
			helper: 'clone',
			start: function(ev, ui)
			{
				ui.helper.width($(this).width());
				objThis.dragging = nDragging;
				if (nDragging == 1)
				{
					objThis.SelectedAvailableColumn(this);
				}
				else
				{
					objThis.SelectedColumn(this);
				}
			}
		});
}

cColumnSelector.prototype.AddDroppable = function(objs)
{
	var objThis = this;

	return objs
		.droppable({
			accept: '.ColumnEditor td:not(.fixedPosition), .ColumnAvailable td:not(.fixedPosition)',
			drop: function(ev, ui)
			{
				if (objThis.IsFixedPosition(ev.target))
				{
					return;
				}

				var objSelect = ui.draggable;
				var objInsert = objSelect;
				if (objThis.dragging == 1)
				{
					objInsert = $('<td />')
						.attr('id', objSelect.attr('id').substr(1))
						.text(objSelect.text());
				}
				if ($(this).is('td.ui-draggable') && PosCenter(ui.helper) > PosCenter($(this)))
				{
					$(this).after(objInsert);
				}
				else
				{
					$(this).before(objInsert);
				}
				if (objThis.dragging == 1)
				{
					objThis.AddDraggable(objInsert, 2);
					objThis.AddDroppable(objInsert);
					objThis.Select(objInsert);
					objSelect.hide();
				}
			}
		});
}

function PosCenter(obj)
{
	return obj.position().left + obj.width() / 2;
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

// Inheritance
cComboBox.prototype = new cBaseControl();

// Constructor
cComboBox.prototype.constructor = cComboBox;

function cComboBox()
{
	this.id = '';
	this.input = null;
	this.selectedIndex = -1;
	this.table = null;
	this.menu = null;
	this.btn = null;
	this.textbox = null;
	this.bdy = null;
	this.cmx = null;

	// Constructor
	if ( arguments.length )
	{
		this.id = arguments[0];
		this.input = SysGetElement(this.id);
		this.input.Ctl = this;
		this.table = SysGetElement(this.id + '_t');
		this.menu = SysGetElement(this.id + '_Menu');
		this.menu.Ctl = this;
		this.btn = SysGetElement(this.id + '_b');
		this.btn.Ctl = this;
		this.textbox = SysGetElement(this.id + '_i');
		this.textbox.Ctl = this;
		this.bdy = SysGetElement(this.id + '_MenuDiv');
		this.cmx = new cContextMenu(this.id)
	}

	// Events
	$addHandler(this.btn, "click", this.cmx.Show);
	$addHandler(this.textbox, "click", this.cmx.Show);
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

// Inheritance
cContextMenu.prototype = new cBaseControl();

// Constructor
cContextMenu.prototype.constructor = cContextMenu;

function cContextMenu()
{
	this.id = '';
	this.input = null;
	// Constructor
	if ( arguments.length )
	{
		this.id = arguments[0];
		this.input = SysGetElement(this.id);
		this.input.Ctl = this;
	}
}

var cComboBoxPopup;
// Methods and Properties
cContextMenu.prototype.Show = function(value, text) {
    var c = this.Ctl;
    if (cComboBoxPopup == null)
        cComboBoxPopup = createPopup();

    var par = c.table;
    var x = window.screenLeft;
    var y = window.screenTop + par.offsetHeight;
    while (par != null) {
        x += par.offsetLeft;
        y += par.offsetTop;
        par = par.offsetParent;
    }

    cComboBoxPopup.show(x, y, 200, 200);
    if (Sys.Debug.isDebug) {
        s3 = '<script src="MicrosoftAjax.debug.js" type="text/javascript"></script>' +
        '<script src="jquery-1.5.1.js" type="text/javascript"></script>';
    } else {
        s3 = '<script src="MicrosoftAjax.js" type="text/javascript"></script>' +
        '<script src="jquery-1.5.1.min.js" type="text/javascript"></script>';
    }
    var s1 = '<html><head><link rel="stylesheet" type="text/css" href="' + sysCmxStyleSheet + '"></head>' +
	'<body scroll="auto" style="border-top-style: none; border-right-style: none; border-left-style: none; border-bottom-style: none">'
    s3 +
    '<script type="text/javascript" src="SysControls.js" ><' + '/script>';
    '<script type="text/javascript" src="SysComponents.js" ><' + '/script>';
    var s2 = '</body></html>';
    cComboBoxPopup.document.write(s1 + c.bdy.innerHTML + s2);
    cComboBoxPopup.document.close();

    var d = SysGetElement(c.id + '_Menu', cComboBoxPopup.document);
    if (d != null) {
        var h = d.offsetHeight;
        var w = d.offsetWidth;
        par = c.table;
        if (w < par.offsetWidth) {
            w = par.offsetWidth;
            d.width = w;
        }
        cComboBoxPopup.show(x, y, w, h);
        $(d).focus();
    }
};/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

// Inheritance
cDescriptionField.prototype = new cBaseControl();

// Constructor
cDescriptionField.prototype.constructor = cDescriptionField;

function cDescriptionField() {
	// Fields
	this.id = '';
	this.input;
	this.term;
	this.ref;
	this.refS;
	this.tbl;
	this.btn;
	this.btnS;
	this.div;
	this.includeAll;

	// Constructor
	if (arguments.length) {
		this.id = arguments[0];
		this.includeAll = arguments[1];

		this.input = SysGetElement(this.id);
		if (this.input) this.input.Ctl = this;

		this.ref = SysGetElement(this.id + '_Ref');
		if (this.ref) this.ref.Ctl = this;

		this.refS = SysGetElement(this.id + '_RefS');
		if (this.refS) this.refS.Ctl = this;

		this.tbl = SysGetElement(this.id + '_tbl');
		if (this.tbl) this.tbl.Ctl = this;

		this.term = SysGetElement(this.id + '_Term');
		if (this.term) this.term.Ctl = this;

		this.div = SysGetElement(this.id + '_div');
		if (this.div) this.div.Ctl = this;

		this.btn = SysGetElement('p' + this.id);
		if (this.btn) this.btn.Ctl = this;

		this.btnS = SysGetElement('p' + this.id + 'S');
		if (this.btnS) this.btnS.Ctl = this;
	}

	return this;
}

cDescriptionField.prototype.Value = function(value) {
	if (arguments.length) {
		this.input.value = value;
	}
	return this.input.value;
};

cDescriptionField.prototype.TermID = function(value) {
	if (arguments.length) {
		this.term.value = value;
	}
	return this.term.value;
};

cDescriptionField.prototype.ClearTable = function() {
	if (!this.tbl) return;

	while (this.tbl.rows.length > 2) {
		this.tbl.deleteRow(2);
	}
};

cDescriptionField.prototype.ClearDiv = function() {
	if (!this.div) return;
	var el = $(this.div);
	el.height("auto");
	el.css("position", "static");
	el.css("overflow", "visible");
};

cDescriptionField.prototype.FillTable = function(codes, descriptions) {
	if (!this.tbl) return;

	for (var i = 0; i < codes.length; i++) {
		var tr = this.tbl.insertRow(-1);
		tr.className = 'transRow';
		var td = tr.insertCell(-1);
		$(td).text(descriptions[i]);
		td = tr.insertCell(-1);
		$(td).text(codes[i]);
	}
};

function SysEditTerm(ev) {
	var el = new SysHandleEvent(ev).element;
	var ctrl = el.Attribute("Ctl");
	if (SysElement.IsNothing(ctrl)) {
		// This function is executed on the click event of the 'browser' button element. Browsers using Webkit as an 
		// engine - Chrome / Safari - will pass the actual element clicked as the event.target, not the element on which 
		// the event is defined, which FF does (and IE uses the srcElement, which is also translated to target).
		ctrl = new SysElement(el).Parent().Attribute("Ctl");
	}
	if (SysElement.IsNotNothing(ctrl)) {
		ctrl.EditTerm();
	}
}

cDescriptionField.prototype.EditTerm = function () {
	var that = this;
	var url = new SysUrlBuilder('SysTerm.aspx?Browser=1');
	var t = this.TermID();
	if (t && t != '') {
		if (t > 0) {
			url.Add("TermID", t);
		}
	}
	var d = this.Value();
	if (d && d != '') {
		url.Add("Description", d);
	}

	if (Dialog.ShowDialog()) {
		var dlg = new Dialog({
			width: 800, height: 600, autoShow: true,
			contentsPage: url,
			handler: DialogHandler
		});
	}
	else {
		DialogHandler(SysShowModal(url, null, "800px", "600px", null, true, "scroll:no;"));
	}

	function DialogHandler(value) {
		if (value) {
			that.input.className = 'savehistory readonly';
			that.input.readOnly = true;
			that.Value(value[1]);
			that.TermID(value[0]);
			$(that.ref).text = value[2];
			that.ClearTable();
			that.FillTable(value[3], value[4]);
			that.ClearDiv();
			SysResetInvalidFlag(that.id);
		}
	}
};

function SysBrowseTerm(ev) {
	var el = new SysHandleEvent(ev).element;
	var ctrl =  el.Attribute("Ctl");
	if (SysElement.IsNothing(ctrl)) {
		// This function is executed on the click event of the 'browser' button element. Browsers using Webkit as an 
		// engine - Chrome / Safari - will pass the actual element clicked as the event.target, not the element on which 
		// the event is defined, which FF does (and IE uses the srcElement, which is also translated to target).
		ctrl = new SysElement(el).Parent().Attribute("Ctl");
	}
	if (SysElement.IsNotNothing(ctrl)) {
		ctrl.BrowseTerm();
	}
}

cDescriptionField.prototype.BrowseTerm = function () {
	var that = this, url;

	if (this.includeAll)
		url = new SysUrlBuilder('SysTerms.aspx?Browser=2');
	else
		url = new SysUrlBuilder('SysTerms.aspx?Browser=1');

	if (this.TermID() != '0')
		url.Add("_ID", this.TermID());

	if (Dialog.ShowDialog()) {
		var urlBuilder = url;
		var dlg = new Dialog({
			width: 800, height: 600, autoShow: true,
			contentsPage: urlBuilder,
			handler: DialogHandler
		});
	}
	else {
		DialogHandler(SysShowModal(url, "", "800px", "600px", null, true));
	}

	function DialogHandler(value) {
		if (value) {
			if (value[0]) {
				that.input.className = 'savehistory readonly';
				that.input.readOnly = true;
				that.Value(value[1]);
				that.TermID(value[0]);
				$(that.ref).text(value[2]);
				that.ClearTable();

				that.FillTable(value[3], value[4]);
				that.ClearDiv();
				SysResetInvalidFlag(that.id);
			}
			else {
				that.input.className = 'savehistory notValid';
				that.input.readOnly = false;
				that.Value('');
				that.TermID('');
				$(that.ref).text(value[2]);
				that.ClearTable();
				that.ClearDiv();
			}
		}
	}
};
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

// Transfer an item
function SysDualListTransfer(ctl, dir) {
    var f = SysGetElement(ctl + (dir ? '_list' : '_selected'));
    var t = SysGetElement(ctl + (dir ? '_selected' : '_list'));
    if (t == null || f == null) {
        return;
    }
    if (f.length <= 0) {
        return;
    }
    var i;
    var l;
    for (i = 0; f.options.length > i; i++) {
        var o = f.options[i];
        if (o.selected) {
            if (!dir) {
                l = SysDualListInsertSort(t, o.value, o.text, o.getAttribute('o'));
            }
            else {
                l = SysDualListInsert(t, o.value, o.text, o.getAttribute('o'));
            }
        }

    }
    for (i = f.options.length - 1; i >= 0; i--) {
        var o = f.options[i];
        if (o.selected) {
            SysDualListRemove(f, i);
        }
    }
    SysDualListOptions(ctl);
    if (l != null) {
        t.selectedIndex = l.index;
    }
    t.focus();
}

function SysDualReset(ctl, cx, values) {
	var f = SysGetElement(ctl + '_list');
    var t = SysGetElement(ctl + '_selected');
    if (f == null || t == null) {
        return;
    }
    for (i = t.options.length - 1; i >= 0; i--) {
        var o = t.options[i];
        SysDualListInsert(f, o.value, o.text, o.getAttribute('o'));
        SysDualListRemove(t, i);
    }

	// this is needed to reset options in the left and right list boxes (e.g. Fields_list and Fields_selected).
	// it is only useful in the case that we have multiple lists. it has no harm on single list combo boxes. Added try catch as it interferes with normal browser behaviour (eg. customize reset)
    if (cx != null) {
    	try {
    		LaySetComboBox(cx, f);
    	}
    	catch (ex) { }
    }

    if (values != null) {
    	var vs = values.split(',');
    	for (i = 0; vs.length > i; i++) {
    		var val = vs[i];
    		var j;
    		for (j = 0; f.options.length > j; j++) {
    			var o = f.options[j];
    			if (o.value == val) {
    				SysDualListInsert(t, o.value, o.text, o.getAttribute('o'));
    				SysDualListRemove(f, j);
    			}
    		}
    	}
    }
    SysDualListOptions(ctl);
}

// Move items in the list up/down
function SysDualListMove(ctl, dir) {
    var el = SysGetElement(ctl + '_selected');
    if (el.length <= 0) {
        return;
    }
    var idx = el.selectedIndex;
    if (idx == -1) {
        return;
    }
    var nxidx = idx + (dir ? -1 : 1);
    if (nxidx < 0) {
        nxidx = el.length - 1;
    }
    if (nxidx >= el.length) {
        nxidx = 0;
    }
    var oldVal = el[idx].value;
    var oldText = el[idx].text;
    var order = el[idx].getAttribute('o');

    el[idx].value = el[nxidx].value;
    el[idx].text = el[nxidx].text;
    el[idx].setAttribute('o', el[nxidx].getAttribute('o'));

    el[nxidx].value = oldVal;
    el[nxidx].text = oldText;
    el[nxidx].setAttribute('o', order);

    el.selectedIndex = nxidx;

    SysDualListOptions(ctl);
    return false;
}

// Insert in list
function SysDualListInsert(c, value, text, order) {
    var o = new Option(text, value);
    c.options[c.length] = o;
    o.setAttribute('o', order);
    return o;
}

function SysDualListInsertSetText(c, value, text) {
    for (var i = 0; i < c.length; i++) {
        var op = c[i];
        if (op.value == value) {
            op.text = text;
        }
    }
}

function SysDualListInsertSortCollection(c, children, value, text, order) {
    for (var i = 0; i < children.length; i++) {
        var ch = children[i];
        var op = children[i];
        var ort = new Number(op.getAttribute('o'));
        if (ort > order) {
            var o = new Option(text, value);
            o.setAttribute('o', order);
            var no = c.insertBefore(o, op);
            return o;
        }
        var opt = SysDualListInsertSortCollection(ch, $(ch).children(), value, text, order);
        if (opt) {
            return opt;
        }
    }
}

function SysDualListInsertSort(c, value, text, order) {
    var or = new Number(order);
    var opt = SysDualListInsertSortCollection(c, $(c).children(), value, text, or);
    if (opt) {
        SysDualListInsertSetText(c, value, text);
        return opt;
    }
    var o = new Option(text, value);
    o.setAttribute('o', order);
    c.options[c.length] = o;
    return o;
}

// Remove from list
function SysDualListRemove(c, i) {
    if (c.length <= 0) {
        return;
    }
    if (i != -1) {
        c.options[i] = null;
    }
}

// Build options list
function SysDualListOptions(ctl) {
    var c = SysGetElement(ctl + '_selected');
    var o = SysGetElement(ctl);
    var n = c.options.length;
    var s = '';
    for (var i = 0; i < n; i++) {
        s += c.options[i].value + ',';
    }
    o.value = s;
}

// Dual List Box with images
function SysDualImgSelect(e, me) {
    e = SysEvent(e);

    if (e.ctrlKey) {
        $(e.target).parents("tr:first").toggleClass("Selected");
        return;
    }

    if (e.shiftKey) {
        var all = $("tr", me);
        var firstEl = $("tr.Selected:first", me);
        var first = all.index(firstEl);
        var lastEl = $(e.target).parents("tr:first");
        var last = all.index(lastEl);
        if (last < first) {
            middle = last;
            last = first;
            first = middle;
        }
        last += 1;
        all.removeClass("Selected");
        all.slice(first, last).addClass("Selected");
        return;
    }

    var el = $(e.target).parents("tr:first").addClass("Selected");
    $("tr", me).not(el.get(0)).removeClass("Selected");
}

function SysDualImgListTransfer(ctl, dir) {
    var from = ctl + (dir ? '_list' : '_selected');
    var to = ctl + (dir ? '_selected' : '_list');
    $("#" + from + " tr.Selected").appendTo("#" + to);
    SysDualImgListOptions(ctl);
}

// Move items in the list up/down
function SysDualImgListMove(ctl, dir) {
    $("#" + ctl + "_selected tr.Selected").each(function() {
        var all = $("#" + ctl + "_selected tr");
        if (!dir) {
            all = $(all.get().reverse());
        }
        var idx = all.index(this) - 1;
        var found = false;
        for (; idx >= 0 && !found; idx--) {
            var prev = all.eq(idx);
            if (!prev.hasClass("Selected")) {
                found = true;
                if (dir) {
                    prev.before(this);
                } else {
                    prev.after(this);
                }
            }
        }
    });

    SysDualImgListOptions(ctl);
}

function SysDualImgListOptions(ctl, dir) {
    var value = "";
    $("#" + ctl + "_selected" + " tr").each(function() {
        value += this.id + ",";
    });
    $("#" + ctl).val(value);
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

// Interface
cHtmlListBox.prototype = {
    Add: function(value, text) {
        /// <summary>Add an item to the listportion of the listbox</summary>
        /// <param name="value" >Identifies the item being added</param>
        /// <param name="text">The text displayed for the added item</param>
    },
    Clear: function() {
        /// <summary>Remove all items from the listbox</summary>
    },
    IsEmpty: function() {
        /// <summary>Returns wether or not the listbox contains items</summary>
        /// <returns type="Boolean"></returns>
    },
    Length: function() {
        /// <summary>Returns the number of items in the listbox</summary>
        /// <returns type="Integer"></returns>
    },
    Remove: function(index) {
        /// <summary></summary>
    },
    SelectedIndex: function(index) {
        /// <summary>returns/selects an item by index</summary>
        /// <param name="index" type="Integer" optional="true">When specified, selects the item at index</param>
        /// <returns type="Integer">The index of the selected item</returns>
    },
    SelectedItem: function() {
        /// <summary>Returns the selected item.</summary>
        /// <returns>tr DOM element.</returns>
    }
}

// Constructor
function cHtmlListBox(el) {
    /// <summary>Represents the client-side listbox control and is the counterpart of the server-side listbox control.
    /// </summary>
    if (cHtmlListBox._initialized === undefined) {

        // Public interface
        cHtmlListBox.prototype.Add = function(value, text) {
            var tr = this._table.insertRow(this.Length());
            var td = tr.insertCell(-1);
            $(tr).val(value);
            $(td).text(text);
        };

        cHtmlListBox.prototype.Clear = function() {
            while (!this.IsEmpty()) {
                this.Remove(0);
            }
        };

        cHtmlListBox.prototype.IsEmpty = function() {
            return (this.Length() === 0) ? true : false;
        };

        cHtmlListBox.prototype.Length = function() {
            return this._table.rows.length - 1;
        };

        cHtmlListBox.prototype.Remove = function(index) {
            this._table.deleteRow(index)
        };

        cHtmlListBox.prototype.SelectedIndex = function(index) {
            if (arguments.length) {
                if (this._selIdx > -1 && this._selIdx < this.Length()) {
                    var tr = new SysElement(this._table.rows[this._selIdx]);
                    tr.SetSelected(false);
                    tr.RemoveClass("Selected");
                }

                if (index < 0 || index >= this.Length()) {
                    this._selIdx = -1;
                }
                else {
                    this._selIdx = index;
                    var tr = new SysElement(this._table.rows[this._selIdx]);
                    tr.SetSelected(true);
                    tr.AddClass("Selected");
                    tr.Focus();
                }
            }
            return this._selIdx;
        };

        cHtmlListBox.prototype.SelectedItem = function() {
            if (this._selIdx < 0 || this._selIdx > this.Length()) {
                return null;
            }
            else {
                return this._table.rows[this._selIdx];
            }
        };

        cHtmlListBox.prototype._DoKeyDown = function(e) {
            var c = this.Ctl;
            var hdl = new SysHandleKey(e);
            if (hdl.IsUpKey()) // up
            {
                if (c._selIdx > 0) {
                    c.SelectedIndex(c._selIdx - 1);
                    SysCancelBubble();
                }
            }
            else if (hdl.IsDownKey()) {
                if (c._selIdx < (c.Length() - 1)) {
                    c.SelectedIndex(c._selIdx + 1);
                    SysCancelBubble();
                }
            }
        };

        cHtmlListBox.prototype._DoSelect = function(e) {
            var c = this.Ctl;
            var td = SysSrcElement(e);
            var tr = td.parentNode;
            c.SelectedIndex(tr.rowIndex);
        };

        cHtmlListBox.prototype._Init = function(el) {

            if (SysElement.IsNothing(el)) {
                throw new Error("You must supply an element or id to operate on");
            }

            // The listbox consists of an <input> and a <table> element
            this._input = SysElement.GetDomElement(el);
            this._table = SysElement.GetDomElement(this._input.id + '_lbx');
            this._selIdx = -1;
            this._input.Ctl = this;
            this._table.Ctl = this;

            // Events
            $addHandler(this._table, "mousedown", this._DoSelect);
            $addHandler(this._table, "keydown", this._DoKeyDown);
        }

        cHtmlListBox._initialized = true;
    }

    this._Init(el);
};/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

function cOption() {
    /// <summary>obsolete, do NOT use this object any more</summary>
    this.tr = null;
    this.td = null;
    this.selected = false;
    if (arguments.length) {
        this.tr = $(arguments[0]);
        this.td = $(arguments[0].cells[0]);
    }
    return this;
}

cOption.prototype.Selected = function(value) {
    if (arguments.length) {
        this.tr.attr("Selected", value);
    }
    return this.tr.attr("Selected");
}

cOption.prototype.Value = function(value) {
    if (arguments.length) {
        this.tr.val(value);
    }
    return this.tr.val();
}

cOption.prototype.Text = function(text) {
    if (arguments.length) {
        this.td.text(text);
    }
    return this.td.text();
}

cOption.prototype.ClassName = function(className) {
    if (arguments.length) {
        this.tr.addClass(className);
    }
    return this.tr.attr("className");
}

cOption.prototype.ScrollIntoView = function() {
    this.tr.get(0).scrollIntoView();
}
cOption.prototype.SetActive = function() {
    this.tr.focus();
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

var _cPlaylist = new cPlaylist()
function cPlaylist() {
    this.currentIndex = 0;
    this.currentItem = null;
    this.items = new Array();
}

cPlaylist.prototype.Add = function(item) {
    this.items(this.items.length) = item
}

cPlaylist.prototype.Start = function(item) {
    this.currentIndex = 0;
    if (this.currentIndex < this.items.length) {
        this.currentItem = this.items[this.currentIndex];
    }
    if (this.currentItem) {
        this.currentItem.PlayNext();
    }
}

cPlaylist.prototype.Clear = function(item) {
    this.currentIndex = 0;
    this.currentItem = null;
    this.items = new Array();
}

cPlaylist.prototype.Play = function(item) {
    if (!this.currentItem) {
        this.currentItem.Play();
        setTimeout("cPlaylistNext()", 20);
    }
}

cPlaylist.prototype.PlayNext = function(item) {
    if (!this.currentItem) {
        return;
    }
    if (this.currentItem.Finished()) {
        this.currentIndex += 1;
        if (this.currentIndex < this.items.length) {
            this.currentItem = this.items[this.currentIndex];
        }
        else {
            this.currentItem = null;
        }
    }
    if (!this.currentItem) {
        this.Play();
    }
    else {
        this.Clear();
    }
}

function cPlaylistNext() {
    _cPlaylist.Play();
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

var cCurrentAdministration = '1';
var cAllAdministrations = '2';

function cShareDefaultCheck(el, allowedShare) {
	var cbx = document.getElementsByName(el.name)
	if (cbx != null) {
		if (cbx[0].id == el.id) {
			// If the first one, "only me" is checked, uncheck the other ones
			if (cbx[0].checked) {
				for (i = 1; i < cbx.length; i++) 
				{
					cbx[i].checked = false;
				}
			}				
		} else {
		
			for (i = 1; i < cbx.length; i++) {
				if (el.checked && el.value == cAllAdministrations && cbx[i].value == cCurrentAdministration) {
					// If "All administrations" is checked, also check "Current administration"
					cbx[i].checked = true;
				} else if (!el.checked && el.value == cCurrentAdministration && cbx[i].value == cAllAdministrations) { 
					// If "Current administration" is unchecked, also uncheck "All administrations"
					cbx[i].checked = false;
				}				
			}				

			if (el.checked) {
				// If something other than the first one is checked, uncheck "only me".
				cbx[0].checked = false;			
			}
						
			// Default share can only be checked if the allowed share is also checked.
			// In case it's not, check it.
			var cbxa = document.getElementsByName(allowedShare);
			if (cbxa != null) {
				for (i = 1; i < cbx.length; i++) {
					if (cbx[i].checked && !cbxa[i].checked) {
						cbxa[i].checked = true;
					}
				}
			}
		}
	}
}

function cShareAllowedCheck(el, defaultShare, allowedShare) {
	if (el) {
		var cbx = document.getElementsByName(el.name)
		if (cbx != null) {
			if (cbx[0].id == el.id && !el.checked) {
				// If the first one, "only me" is unchecked, check it again
				el.checked = true;
			}
						
			for (i = 1; i < cbx.length; i++) {
				if (el.checked && el.value == cAllAdministrations && cbx[i].value == cCurrentAdministration) {
					// If "All administrations" is checked, also check "Current administration"
					cbx[i].checked = true;
				} else if (!el.checked && el.value == cCurrentAdministration && cbx[i].value == cAllAdministrations) { 
					// If "Current administration" is unchecked, also uncheck "All administrations"
					cbx[i].checked = false;
				}				
			}				
			
			// Uncheck the default share when allowed share is also unchecked
			var cbxd = document.getElementsByName(defaultShare);
			if (cbxd != null) {
				for (i = 1; i < cbx.length; i++) {
					if (!cbx[i].checked && cbxd[i].checked) {
						cbxd[i].checked = false;
					}
				}
			}				
		}
	} else {
		// "Only me" should always be checked
		var cbx = document.getElementsByName(allowedShare)			
		if (cbx != null) {
			cbx[0].checked = true;
		}
	}
}

function cShareCheck(el) 
{	
	var cbx = document.getElementsByName(el.name)
	if (cbx != null) {
		if (cbx[0].id == el.id) {
			// If the first one, "only me", is checked, uncheck the other ones
			if (cbx[0].checked) {
				for (i = 1; i < cbx.length; i++) {
					cbx[i].checked = false;
				}
			}	else {
				// if "only me" is being unchecked, check it again
				cbx[0].checked = true;
			}
		} else if (el.checked) {
			// If something other than the first one is checked, uncheck "only me"
			cbx[0].checked = false;						
			
			// If "All administrations" is checked, also check "Current administration"
			if (el.value == cAllAdministrations) {
				for (i = 1; i < cbx.length; i++) {
					if (cbx[i].value == cCurrentAdministration) {
						cbx[i].checked = true;
						break;
					}
				}				
			}
		} else {
			// Check if anything other than "only me" is checked, if not, check "only me" again.
			var anythingchecked = false;
			for (i = 1; i < cbx.length; i++) {

				// If "Current administration" is unchecked, also uncheck "All administrations"
				if (!el.checked && el.value == cCurrentAdministration && cbx[i].value == cAllAdministrations) { 
					cbx[i].checked = false;
				}

				if (cbx[i].checked) {
					anythingchecked = true;
				}
				
			}
			if (!anythingchecked) {
				cbx[0].checked = true;
			}
		}
	}
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

var cSliderObjectDown = null;
function CSlideDown(element, innerDiv) {
    cSliderObjectDown = new cSlideDown(element, innerDiv);
}

// Inheritance
cSlideDown.prototype.constructor = cSlideDown;

function cSlideDown() {
    // Fields
    this.element = null;
    this.innerDiv = null;

    this.startHeight = 0;
    this.steps = 0;
    this.nextHeight = 0;

    this.finished = false;

    // Constructor
    if (arguments.length) {
        this.element = $(arguments[0]);
        this.innerDiv = $(arguments[1]);
    }
    this.SlideDown()
}

function cSliderNextDown() {
    if (cSliderObjectDown) {
        if (!cSliderObjectDown.NextDown())
            setTimeout("cSliderNextDown()", 20);
    }
}

cSlideDown.prototype.NextDown = function() {
    this.nextHeight += this.steps;
    if (this.nextHeight >= this.endHeight) {
        cSliderObjectDown = null;
        this.innerDiv.css("overflowY", "visible");
        return true;
    }
    else {
        this.innerDiv.height(this.nextHeight);
        this.element.height(this.nextHeight);
        return false;
    }
}

cSlideDown.prototype.SlideDown = function() {
    this.innerDiv.css("display","block");
    this.element.css("display","block");
    this.element.height(0);
	this.endHeight = this.innerDiv.get(0).scrollHeight;
	this.nextHeight = 0;
	this.steps = this.endHeight / 10;
	this.innerDiv.css("overflowY", "hidden");

	if (!this.NextDown())
	    setTimeout("cSliderNextDown()", 20);
}

cSlideDown.prototype.Finished = function() {
    return this.finished;
}

cSlideDown.prototype.Play = function() {
    this.finished = this.NextDown();
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

var cSliderObjectUp = null;
function CSlideUp(element, innerDiv) {
    cSliderObjectUp = new cSlideUp(element, innerDiv);
}

cSlideUp.prototype.constructor = cSlideUp;

function cSlideUp() {
    // Fields
    this.element = null;
    this.innerDiv = null;

    this.startHeight = 0;
    this.steps = 0;
    this.nextHeight = 0;

    // Constructor
    if (arguments.length) {
        this.element = $(arguments[0]);
        this.innerDiv = $(arguments[1]);
    }
    this.SlideUp()
}

function cSliderNextUp() {
    if (cSliderObjectUp) {
        if (!cSliderObjectUp.NextUp())
            setTimeout("cSliderNextUp()", 20);
    }
}

cSlideUp.prototype.NextUp = function() {
    this.nextHeight -= this.steps;
    if (this.nextHeight <= 1) {
        cSliderObjectUp = null;
        this.innerDiv.css("display", "none");
        this.element.css("display", "none");
        return true;
    }
    else {
        this.innerDiv.height(this.nextHeight);
        this.element.height(this.nextHeight);
        return false;
    }
}

cSlideUp.prototype.SlideUp = function() {
    this.startHeight = this.element.height();
    this.nextHeight = this.startHeight;

    this.steps = this.startHeight / 10;
    this.innerDiv.css("overflowY", "hidden");
    if (!this.NextUp())
        setTimeout("cSliderNextUp()", 20);
}

cSlideUp.prototype.Finished = function() {
    return this.finished
}

cSlideUp.prototype.Play = function() {
    this.finished = this.NextDown();
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />

// Inheritance
cSplitterPanel.prototype = new cBaseControl();

// Constructor
cSplitterPanel.prototype.constructor = cSplitterPanel;

function cSplitterPanel()
{
	// Fields
	this.id = '';
	this.input = null;
	this.img = null;
	this.divleft = null;
	this.divsplit = null;
	this.bDragging = false;
	this.nDragOffsetX = 0;

	// Constructor
	if (arguments.length)
	{
		this.id = arguments[0];
		this.input = SysGetElement(this.id);
		
		this.img = SysGetElement(this.id + '_img');
		if (this.img)
			this.img.Ctl = this;
		
		this.divleft = SysGetElement(this.id + '_divleft');
		if (this.divleft)
		{
			this.divleft.Ctl = this;
			//var m = this.divleft.getAttribute('minimum');
			//if (m)
			//	this.minimumLeft = new Number(m);
		}
		
		this.divsplit = SysGetElement(this.id + '_divsplit');
		if (this.divsplit)
			this.divsplit.Ctl = this;
	}
	return this;
}

cSplitterPanel.prototype.Left = function() 
{
	var par = this.divleft;
	var x = 0;
	while (par != null)
	{
		x += par.offsetLeft;
		par = par.offsetParent;
	}
	return x;
}

cSplitterPanel.prototype.GetDocumentEventHandlers = function()
{
	var objThis  = this;
	var objSplit = this.divsplit;
	var objImg   = objSplit.Ctl.img;
	var objCover = $('#' + this.id + '_divcover');

	return {
		mousedown: function(e)
		{
			if (e.button == Sys.UI.MouseButton.leftButton && (e.target == objSplit || e.target == objImg))
			{
				objThis.bDragging = true;
				objImg.src = 'images/SplitterHandlePressed.png';
				objThis.nDragOffsetX = $(objSplit).position().left - e.clientX;
				objCover.show();
				e.preventDefault();
			}
		},
		mousemove: function(e)
		{
			if (objThis.bDragging)
			{
				objThis.SetSeparator(Math.max(objThis.nDragOffsetX + e.clientX, 0));
				e.preventDefault();
			}
		},
		mouseup: function(e)
		{
			if (objThis.bDragging)
			{
				objThis.bDragging = false;
				objImg.src = 'images/SplitterHandle.png';
				objCover.hide();
				objThis.SetSeparator(Math.max(objThis.nDragOffsetX + e.clientX, 0));
				e.preventDefault();
			}
		}
	};
}

cSplitterPanel.prototype.GetWindowEventHandlers = function()
{
	var objGroup  = $('#' + this.id + '_tbl');
	var objSplit  = $('#' + this.divsplit.id);
	var objIframe = $('#' + this.id + '_divright iframe');

	return {
		resize: function()
		{
			var nGroupHeight = $(window).height() - objGroup.position().top;
			var nGroupWidth  = $(window).width() - objGroup.position().left;
			var nRightX      = objSplit.position().left + objSplit.outerWidth();
			var nRightWidth  = nGroupWidth - nRightX;

			objGroup
				.width(nGroupWidth)
				.height(nGroupHeight);
			objIframe
				.width(nRightWidth)
				.height(nGroupHeight)
				.css('border', 'none');
		}
	};
}

cSplitterPanel.prototype.SetSeparator = function(nLeftWidth)
{
	var nWindowWidth  = $(window).width();
	var nRightX = nLeftWidth + $('#' + this.divsplit.id).outerWidth();
	var nRightWidth = nWindowWidth - nRightX;
	var sNameRight = this.id + '_divright';

	$('#' + this.divsplit.id).css('left', nLeftWidth + 'px');
	$('#' + this.divleft.id).width(nLeftWidth);
	$('#' + sNameRight + ' iframe').width(nRightWidth);
}
;