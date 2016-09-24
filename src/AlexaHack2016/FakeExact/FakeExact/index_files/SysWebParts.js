/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.js" />
/// <reference path="..\docs\ui.core.js" />
/// <reference path="..\docs\ui.draggable.js" />
/// <reference path="..\docs\ui.droppable.js" />

//MAY BE STRIPPED A LITTLE MORE LATER....

var __wpm = null;

//***************************************************
//**************** Miscellaneous ********************
//***************************************************
function clearSaveHistoryClassAndName(oParent) {
	//Dirty workaround: remove the SaveHistory from spans/inputs 
	$("span.saveHistory", oParent).removeClass("saveHistory");
	$("input.saveHistory", oParent).removeClass("saveHistory");
		
	//if set in Edit mode also touch the spans/inputs under the common parent 'EditorZone' (IE specific)
	if (Sys.Browser.agent === Sys.Browser.InternetExplorer) {
		var ez = $("#EditorZone")
		$("span.saveHistory", ez).removeClass("saveHistory");
		$("input.saveHistory", ez).removeClass("saveHistory");
	}

	//Clear name to prevent posting of these copied elements
	$("*", oParent).attr("name", "");
}

//***************************************************
//******************* WebPart ***********************
//***************************************************

// Constructor
WebPart.prototype.constructor = WebPart;

WebPart.prototype.AddDraggable = function(objs, nDragging) {
	var objThis = this;

	//search for the first encountered parent <tr>
	var objsParent = $(objs).parents("tr").filter(':first');
	
	return objsParent
		.draggable({
			cursor: 'move',
			helper: 'clone',
			cursorAt: {left: 5},
			start: function(ev, ui)
			{
				clearSaveHistoryClassAndName(ui.helper);
				
				ui.helper.width($(this).width());
				if (!$.browser.msie) { //non-IE
					ui.helper.css("opacity", 0.5);
				}
				objThis.dragging = nDragging;
			}
		});
}
function WebPart(webPartElement, webPartTitleElement, zone, zoneIndex, allowZoneChange) {
	if (webPartElement) {
		this.webPartElement = webPartElement;
		this.allowZoneChange = allowZoneChange;
		this.zone = zone;
		this.zoneIndex = zoneIndex;
		this.title = ((typeof (webPartTitleElement) != "undefined") && (webPartTitleElement != null)) ?
			$(webPartTitleElement).text() : "";
		webPartElement.__webPart = this;
		if ((typeof (webPartTitleElement) != "undefined") && (webPartTitleElement != null)) {
			webPartTitleElement.style.cursor = "move";
			this.AddDraggable($(webPartElement), 1);
		}
	}
	this.Dispose = WebPart_Dispose;
}
function WebPart_Dispose() {
	if (this.webPartElement) {
		this.webPartElement.__webPart = null;
	}
}

//***************************************************
//********************* Zone ************************
//***************************************************

// Constructor
Zone.prototype.constructor = Zone;

Zone.prototype.AddDroppablesToZoneElement = function(objZone)
{
	var objThis = this;
	var objs = $(".ZoneHighlight", objZone);
	
	for (var count = 0; count < objs.length; count++){
		var obj = objs[count];
		objsParent =  $(obj).parents("tr:first");
		
		objsParent
			.droppable({
				tolerance: 'pointer',
				drop: function(ev, ui)
				{
					$(".ZoneHighlight", this).css("visibility", "hidden");
					var TheDraggable = ui.draggable;
					
					//append the <tr> above the draggable to the new position. 
					var prevDroppable = $(TheDraggable).prev("tr");
					
					//cannot drop on or directly underneath itself  
					var bEqual = $(this).equals( $(prevDroppable) );
					if (!bEqual) {
						var nextDroppable = $(TheDraggable).next("tr")
						bEqual = $(this).equals( $(nextDroppable) );
					}
										
					if (!bEqual) {
						try {
							var eventTarget = $(this).parents(".WebPartZone").attr("id");
							var webpartTable = $("table", TheDraggable)[0];
							var webpartTableID = $(webpartTable).attr("id");
							var dropIndex = ($(this).prevAll("tr").length)/2;
							var eventArgument = "Drag:" + webpartTableID + ":" + dropIndex;

							$(this).before(prevDroppable);
							$(this).before(TheDraggable);
						
							__wpm.SubmitPage(eventTarget, eventArgument);
						} catch(e){} 
					}
				},
				over: function(ev, ui)
				{
					$(".ZoneHighlight", this).css("visibility", "visible");
				},
				out: function(ev, ui)
				{
					$(".ZoneHighlight", this).css("visibility", "hidden");
				}
			});
	}
}
$.fn.equals = function(compareTo) { 
	if (!compareTo || !compareTo.length || this.length!=compareTo.length) { 
		return false; 
	} 
	for (var i=0; i<this.length; i++) { 
		if (this[i]!==compareTo[i]) { 
			return false; 
		} 
	} 
	return true; 
} 
function Zone(zoneElement, zoneIndex, uniqueID, isVertical, allowLayoutChange, highlightColor) {
    this.zoneElement = zoneElement;
    this.zoneIndex = zoneIndex;
    this.webParts = new Array();
    this.uniqueID = uniqueID;
    this.isVertical = isVertical;
    this.allowLayoutChange = allowLayoutChange;
    this.allowDrop = false;
    this.highlightColor = highlightColor;
    this.savedBorderColor = null;
    this.dropCueElements = new Array();
    this.AddWebPart = Zone_AddWebPart;
    this.Dispose = Zone_Dispose;
    
	if (this.allowLayoutChange && __wpm.IsDragDropEnabled()) {
		this.AddDroppablesToZoneElement($(zoneElement));
	}
}
function Zone_Dispose() {
    for (var i = 0; i < this.webParts.length; i++) {
        this.webParts[i].Dispose();
    }
}
function Zone_AddWebPart(webPartElement, webPartTitleElement, allowZoneChange) {
    var webPart = null;
    var zoneIndex = this.webParts.length;
    if (this.allowLayoutChange && __wpm.IsDragDropEnabled()) {
        webPart = new WebPart(webPartElement, webPartTitleElement, this, zoneIndex, allowZoneChange);
    }
    else {
        webPart = new WebPart(webPartElement, null, this, zoneIndex, allowZoneChange);
    }
    this.webParts[zoneIndex] = webPart;
    return webPart;
}

//***************************************************
//*************** WebPartManager ********************
//***************************************************
function WebPartManager() {
    this.overlayContainerElement = null;
    this.zones = new Array();
    this.menu = null;
    this.AddZone = WebPartManager_AddZone;
    this.IsDragDropEnabled = WebPartManager_IsDragDropEnabled;
    this.ShowHelp = WebPartManager_ShowHelp;
    this.ExportWebPart = WebPartManager_ExportWebPart;
    this.Execute = WebPartManager_Execute;
    this.SubmitPage = WebPartManager_SubmitPage;
    SysAttachEvent(window, "onunload", WebPartManager_Dispose);
}
function WebPartManager_Dispose() {
    for (var i = 0; i < __wpm.zones.length; i++) {
        __wpm.zones[i].Dispose();
    }
    SysDetachEvent(window, "onunload", WebPartManager_Dispose);
}
function WebPartManager_AddZone(zoneElement, uniqueID, isVertical, allowLayoutChange, highlightColor) {
    var zoneIndex = this.zones.length;
    var zone = new Zone(zoneElement, zoneIndex, uniqueID, isVertical, allowLayoutChange, highlightColor);
    this.zones[zoneIndex] = zone;
    return zone;
}
function WebPartManager_IsDragDropEnabled() {
    return ((typeof (this.overlayContainerElement) != "undefined") && (this.overlayContainerElement != null));
}
function WebPartManager_Execute(script) {
    if (this.menu) {
        this.menu.Hide();
    }
    var scriptReference = new Function(script);
    return (scriptReference() != false);
}
function WebPartManager_ShowHelp(helpUrl, helpMode) {
	var win = new SysWindow();
    if ((typeof (this.menu) != "undefined") && (this.menu != null)) {
        this.menu.Hide();
    }
    if (helpMode == 0 || helpMode == 1) {
    	if (helpMode == 0) {
    		if (!Dialog.ShowDialog()) {
    			var dialogInfo = "edge: Sunken; center: yes; help: no; resizable: yes; status: no";
    			SysShowModal(helpUrl, null, null, null, null, true, dialogInfo);
    		} else {
    			new Dialog({ autoShow: true, contentsPage: new SysUrlBuilder(helpUrl) });
    		}
        }
        else {
        	win.Location(helpUrl, true, null, "scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no,location=no");
        }
    }
    else if (helpMode == 2) {
        win.Location(helpUrl);
    }
}
function WebPartManager_ExportWebPart(exportUrl, warn, confirmOnly) {
	if (warn == true && __wpmExportWarning.length > 0 && this.personalizationScopeShared != true) {
		if (!Dialog.ShowDialog()) {
			if (confirm(__wpmExportWarning) == false) {
				return false;
			}
			SetWindowLocation();
		} else {
			QuestionDialog.Show(577, "Export", 0, __wpmExportWarning,
		            SetWindowLocation);
		}
	} else {
		SetWindowLocation();
	}

	return true;

	function SetWindowLocation() {
		if (confirmOnly == false) {
			window.location = exportUrl;
		}
	}
}
function WebPartManager_SubmitPage(eventTarget, eventArgument) {
    if ((typeof (this.menu) != "undefined") && (this.menu != null)) {
        this.menu.Hide();
    }
	__doPostBack(eventTarget, eventArgument);
}
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../SysControls/SysElement.js" />
/// <reference path="../SysControls/SysEvents.js" />
/// <reference path="../SysControls/Dialog.js" />

// Functions for pivot support

var _syswebpartsversion = "1.4.1.3";

function ReportInsertPivot(ev, pivId, pivName, pivTopic) {
	keepFocus = true;
	var topic = SysGet(pivTopic);
	var url = new SysUrlBuilder("SysReports.aspx");

	if (topic.substring(0,2) == "DD") {
		url.Add("Mode", 2);
		url.Add("Topic", topic.substring(2));
	} else {
		url.Add("Mode", 1);
		url.Add("Topic", topic);
	}
	
	if (!Dialog.ShowDialog()) {
		SysShowModal(url, null, "500px", "400px", function() { DialogHandler(SysDialog.returnValue); }, true);
	} else {
		new Dialog({ autoShow: true, width: 500, height: 400, contentsPage: url, handler: DialogHandler });
	}

	new SysHandleEvent(ev).StopAll();

	function DialogHandler(value) {
		if (value) {
			SysSet(pivId, value[0]);
			SysSet(pivName, value[1]);
		}
		keepFocus = false;
	}
}

function DashboardInsertPivot(pivId)
{
	keepFocus = true;
	var url = new SysUrlBuilder("SysPivotBrowser.aspx");

	if (!Dialog.ShowDialog()) {
		SysShowModal(url, null, window.screen.availWidth + "px", window.screen.availHeight + "px", function () { DialogHandler(SysDialog.returnValue); }, true);
	} else {
		new Dialog({ autoShow: true, fullScreen: true, contentsPage: url, handler: DialogHandler });
	}
	
	function DialogHandler(value) {
		if (typeof (value) != "undefined" && value != null) {
			SysSet(pivId, value);
		}
		keepFocus = false;
	}	
}
var dashboardPivotFunctionStorage = new Array();
var dashboardPivotLoaded = false;
var dashboardCurrentFunction = 0;
function DashboardPivotOnload()
{
	if(!dashboardPivotLoaded)
	{
		dashboardPivotLoaded = true;
		if(dashboardPivotFunctionStorage.length != 0)
			dashboardPivotFunctionStorage[dashboardCurrentFunction]();
	}
}
function DashboardPivotAppendView(sUrl, ctrlID)
{
	var nextIdx = dashboardPivotFunctionStorage.length;
	dashboardPivotFunctionStorage[nextIdx] = function()
	{
		DashboardPivotView(sUrl, ctrlID)
	}
}
function DashboardPivotView(sUrl, ctrlID)
{
	var ret = SysCallback(sUrl, "", null, true);
	$(SysGetElement(ctrlID)).empty().append($(ret));
}
;function WebPageMenuCustomize(id) {
	var value= [];
	var url = new SysUrlBuilder("WebPageMenuCustomize.aspx");
	value[0] = SysGet(id);
	if (!Dialog.ShowDialog()) {
		SysShowModal(url, null, null, null, function () { DialogHandler(SysDialog.returnValue); }, true);
	} else {
		new Dialog({ autoShow: true, contentsPage: url, handler: DialogHandler });
	}

	function DialogHandler(value) {
		if (value) {
			SysSet(id, value[0]);
		}	
	}	
};/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

/*
**  Webpart Catalog
*/
function ShowWebPartCatalog(url, zoneId) { /* as string */
	SysSet("ZoneID", zoneId)
	var url = new SysUrlBuilder(url);

	if (!Dialog.ShowDialog()) {
		SysShowModal(url, "", "900px", "600px", function () { DialogHandler(SysDialog.returnValue); }, true, "scroll:no");
	} else {
		new Dialog({ autoShow: true, width: 900, height: 600, contentsPage: url, handler: DialogHandler });
	}

	function DialogHandler(value) {
		if (value !== null && value !== "") {
			SysSet("WebPartsToAdd", value);
			SysSubmit();
		}
		else {
			SysSet("WebPartsToAdd", "");
		}
	}
}

/*
**  Helper functions (todo: move to system layer.) 
*/
String.prototype.Left = function (str, n) { /* as string, as integer */
	if (n <= 0)
		return '';
	else if (n > String(str).length)
		return str;
	else
		return String(str).substring(0, n);
}

;/*
** Class: Webpart zone editor
**
** A table editor, editted through a context menu. Returns the structure of the table in XML and provides
** functions to build the table back up.
**
*/
// Constructor
function wpZoneEditor() {
// #Region "Properties" 
	this.cmxCtl = null; /* as object */
	this.freeZoneNumber = 0; /* as integer */
	this.termZone = 'Zone'; /* as string */ // 34013, 'Zone'
	this.termRowLast = ' Laatste rij';  /* as string */ // 2655, 'Row', 8721, ':Last'
// #End Region
}

// #Region "Methods for the Context menu"
wpZoneEditor.prototype.CmxShow = function (e) { /* as event */
	new SysHandleEvent(e).PreventDefault();
	this.cmxCtl = SysSrcElement(e);
	SysMenuShowW('cmx', null, null, e);
}

wpZoneEditor.prototype.CmxAddRow = function() {
	var pel = this.GetMainRow(this.cmxCtl);
	if (pel) {
		this.AddRow(pel.rowIndex + 1, true);
	}
	SysMenuHide();
}

wpZoneEditor.prototype.CmxRemoveRow = function() {
	var el = SysGetElement('mainTable');
	if (el) {
		if (el.rows.length == 1) {
			SysAlert(8959, 'Can\'t delete', null, null, this.termRowLast);
		}
		else if (this.cmxCtl != el) {
			var pel = this.GetMainRow(this.cmxCtl);
			if (pel) {
				pel.parentNode.removeChild(pel);
			}
		}
	}
	SysMenuHide();
}

wpZoneEditor.prototype.CmxAddCell = function() {
	var pel = this.GetMainRow(this.cmxCtl);
	if (pel) {
		pel = pel.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		if (pel) {
			var Index = 0;
			if ($(this.cmxCtl).text() == this.termZone) {
				Index = this.cmxCtl.cellIndex;
			}
			this.AddCell(pel, Index);
			this.CorrectWidth(pel, false);
		}
	}
	SysMenuHide();
}

wpZoneEditor.prototype.CmxRemoveCell = function(removeRow) { /* as boolean */
	var pel = this.GetMainRow(this.cmxCtl);
	if (pel) {
		pel = pel.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
		if (pel) {
			if (removeRow && pel.childNodes.length == 1) {
				this.CmxRemoveRow();
			}
			else {
				var Index = 0;
				if ($(this.cmxCtl).text() == this.termZone) {
					Index = this.cmxCtl.cellIndex;
				}
				pel.deleteCell(Index);
				this.CorrectWidth(pel, true);
			}
		}
	}
	SysMenuHide();
}

wpZoneEditor.prototype.CmxSpanCell = function() {
	var pel = this.GetMainRow(this.cmxCtl);
	if (pel) {
		pel = pel.childNodes[0].childNodes[0].childNodes[0].childNodes[0];  // the row

		if (pel.childNodes.length > 1) {
			var ZoneClicked = false;

			for (var i = 0; i < pel.childNodes.length; i++) {
				if (pel.childNodes[i] == this.cmxCtl) {
					ZoneClicked = true;
				}
			}
			if (ZoneClicked) {
				var WidthPerCell = Math.round(100 / (pel.childNodes.length + 1));

				for (var i = 0; i < pel.childNodes.length; i++) {
					var Zone = pel.childNodes[i];
					if (Zone == this.cmxCtl) {
						$(Zone).css("width", (WidthPerCell * 2) + '%');
					}
					else {
						$(Zone).css("width", WidthPerCell  + '%');
					}
				}
			}
		}
	}
	SysMenuHide();
}
// #End Region

// #Region "General functions"
wpZoneEditor.prototype.AddRow = function(rowIndex, addCell) { /* as integer, as integer */
	var el = SysGetElement('mainTable');
	if (el) {
		var MyRow = el.insertRow(rowIndex);
		MyRow.className = 'mainRow';

		var MyCell = MyRow.insertCell(-1);

		var MyTable = document.createElement("table");
		MyTable.width = '100%';
		MyTable.className = "WebPartZone"

		var MyRow2 = MyTable.insertRow(-1);
		MyRow2.className = 'WebPartZoneHeader Editor';
		MyCell.appendChild(MyTable);

		if (addCell) {
			this.AddCell(MyTable.rows[0]);
			this.CorrectWidth(MyTable.rows[0], false);
		}
		return MyTable.rows[0];
	}
}

wpZoneEditor.prototype.AddCell = function(row, width, index, myid) { /* as tr, as string, as string, as integer */
	var MyCell;
	if (index) { 
		MyCell = row.insertCell(index); 
	}
	else { 
		MyCell = row.insertCell(-1); 
	}
	if (width) { 
		$(MyCell).css("width", width); 
	}
	if (myid) { 
		MyCell.id = myid; 
	}
	else { 
		MyCell.id = this.NewID(); 
	}
	$(MyCell).text(this.termZone);
}

wpZoneEditor.prototype.NewID = function() {
	this.freeZoneNumber++;
	return 'myzone' + this.freeZoneNumber;
}

wpZoneEditor.prototype.ZonesInXML = function() {
	var el = SysGetElement('mainTable');
	if (el) {
		return this.ForEachCellIn(el.rows, function(el) { /* as td */
			var s = ''; /* as string */
			el = el.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
			for (var i = 0; i < el.childNodes.length; i++) {
				var Zone = el.childNodes[i];
				s += '<zone id="' + Zone.id + '" width="' + $(Zone).width() + '" />';
			}
			return s;
		});
	}
	return '';
}

wpZoneEditor.prototype.ForEachCellIn = function(array, fn) { /* as array, as function */
	var s = '<zones nextfreenumber="' + this.freeZoneNumber + '">';
	for (var n = 0; n < array.length; n++) {
		s += '<line>' + fn(array[n]) + '</line>';
	}
	s += '</zones>';
	return s;
}

wpZoneEditor.prototype.GetMainRow = function(pel) { /* as element (child of mainTable) */
	if (pel) {
		var MustContinue = true;
		var NrOfLoops = 0;

		while (MustContinue && NrOfLoops < 10) {
			if (pel.className.length > 0) {
				MustContinue = (pel.className.substr(0, 7) != 'mainRow');
				if (MustContinue) {
					MustContinue = (pel.className.substr(0, 9) != 'mainTable');
				}
			}
			if (MustContinue) {
				pel = pel.parentNode;
				NrOfLoops++;
			}
		}
		if (!MustContinue && pel.className.length > 0) {
			if (pel.className.substr(0, 7) == 'mainRow') {
				return pel;
			}
		}
	}
	return null;
}

wpZoneEditor.prototype.CorrectWidth = function(el, afterRemove) { /* as tr, as Boolean */
	if (el) {
		if (el.childNodes.length >= 1) {
			var WidthPerCell = 0; /* as integer */
			var WideZone = false; /* as td */

			if (afterRemove) {
				WidthPerCell = Math.round(100 / (el.childNodes.length + 1));
			}
			else {
				WidthPerCell = Math.round(100 / (el.childNodes.length - 1));
			}
			for (var i = 0; i < el.childNodes.length && !WideZone; i++) {
				var MyWidth = $(el.childNodes[i]).width(); 
				if (MyWidth) {
					if (MyWidth > WidthPerCell) {
						WideZone = el.childNodes[i];
					}
				}
			}
			if (WideZone) {
				WidthPerCell = Math.round(100 / (el.childNodes.length + 1));
			}				
			else {
				WidthPerCell = Math.round(100 / (el.childNodes.length));
			}
			
			for (var i = 0; i < el.childNodes.length; i++) {
				var Zone = el.childNodes[i];
				if (Zone == WideZone) {
					$(Zone).css("width", (WidthPerCell * 2) + '%');
				}
				else {
					$(Zone).css("width", WidthPerCell  + '%');
				}
			}
		}
	}
	SysMenuHide();
}
// #End Region
// End Class
;