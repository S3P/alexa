/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />
/// <reference path="..\docs\SysHelp.debug.js" />

// Help Popup
function HlpShowPopUp() {
	if (!Dialog.ShowDialog()) {
		SysShowModal("HlpTipPopUp.aspx", "", "550px", "200px", null, 1);
	} else {
		new Dialog({ autoShow: true, width: 550, height: 200, contentsPage: new SysUrlBuilder("HlpTipPopUp.aspx") });
	}
}

// Help Glossary
function HlpGlossary(txt) {
	var url = new SysUrlBuilder("HlpGlossaryPopUp.aspx");
	url.Add("useterm", txt);
	if (!Dialog.ShowDialog()) {
		SysShowModal(url, "", "300px", "250px", null, 1);
	} else {
		new Dialog({ autoShow: true, width: 300, height: 250, contentsPage: url });
	}
}

function SysSearch(txt) {
	var url = new SysUrlBuilder("SysSearch.aspx");
	url.Add("text", txt);
	document.location = url.ToString();
}

// Show the specified help document in a new tab
function HlpDocumentBase(helpID) {
	var url = sysHelpUrl;
	if (helpID) {
		url += "#cshid=" + SysURLEncode(helpID.toUpperCase());
	}
	SysWindow.OpenInTab(url);
}

function HlpDocument(helpID) {
	HlpDocumentBase(helpID, 5);
}

function HlpSearch(text) {
	SysWindow.OpenInTab(sysHelpUrl + "#search-" + text);
};/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />
/// <reference path="..\docs\SysHelp.debug.js" />

var _syshelpversion = "1.4.1.1";

// Help Guidance

// Inheritance
cHelpGuide.prototype = new cHelpGuideBase();

// Constructor
cHelpGuide.prototype.constructor = cHelpGuide;

function cHelpGuide()
{
	// Fields
	this.id = '';
	this.running = false;
	this.document = null;
	this.pages = new Array();

	this.currentStep = null;
	this.currentPage = null;

	// Constructor
	if ( arguments.length )
	{
		this.id = arguments[0];
	}

	this.document = this.HelpDocument();
	this.document.body.Ctl = this;

	// Events
	return this;
}

// Methods and Properties
cHelpGuide.prototype.AddPage = function(page)
{
	this.pages[this.pages.length] = page;
	page.guide = this;
}

cHelpGuide.prototype.Start = function()
{
	if (this.pages.length==0)
		return;
	var page = this.pages[0];
	this.SetCurrentPage(page);
	
	this.AddEvents('Products');
	this.AddEvents('MenuLeft');
	this.AddEvents('Toolbar');
}
cHelpGuide.prototype.AddEvents = function(frame) {
    var win = this.GetWindow(frame);
    var doc = this.GetDocument(frame);

    if (!doc) {
        return;
    }

    for (var ifr = 0; ifr < doc.forms.length; ifr++) {
        var form = doc.forms[ifr];
        for (var iel = 0; iel < form.elements.length; iel++) {
            var el = form.elements[iel];
            if ($(el).is(":not(:hidden)")) {
                el.SHlp = this;
                if (el.tagName == 'BUTTON' || (el.tagName == 'INPUT' && el.Type == "BUTTON")) {
                    SysAttachEvent(el, "onclick", function(ev) {
						HlpHtHandlePageEvent(
							(ev.target.ownerDocument.defaultView || ev.target.ownerDocument.parentWindow).name + 
							":" + ev.target.id);
                    }, win);
                }
                else {
                    SysAttachEvent(el, "onchange", function(ev) {
						HlpHtHandlePageEvent(
							(ev.target.ownerDocument.defaultView || ev.target.ownerDocument.parentWindow).name +
							":" + ev.target.id);
                   }, win);
                }
            }
        }
    }
    
    for (var il = 0; il < doc.links.length; il++) {
        var a = doc.links[il];
        if (a.id) {
            if ($(a).is(":not(:hidden)")) {
                SysAttachEvent(a, "onclick", function(ev, arg) {
					HlpHtHandlePageEvent(
						(ev.target.ownerDocument.defaultView || ev.target.ownerDocument.parentWindow).name +
						":" + ev.target.id);
               }, win);
            }
        }
    }
}
function HlpHtHandlePageEvent(elId)
{
	var g = HlpGuide();
	if (!g)
		return;
	if (g.currentPage)
	{
		g.currentPage.DoEvent(elId);
	}
}

cHelpGuide.prototype.ControlPage = function()
{
	var mainDoc = this.MainDocument();
	var documentName = HlpDocumentFileName(mainDoc);

	var page = this.FindPage(documentName);
	if (!page)
		return;
	this.SetCurrentPage(page,mainDoc);
}

cHelpGuide.prototype.SetCurrentPage = function(page,doc)
{
	if (this.currentPage)
	{
		this.currentPage.Close();
	}
	this.currentPage = page;
	this.ScratchUntil(page);
	page.Open();
	if (doc)
		page.AddEvents(doc);
}

function HlpcHelpGuideUnScratch(elId)
{
	var g = HlpGuide();
	if (!g)
		return;
	if (g.currentPage)
	{
		g.currentPage.UnScratch(elId);
	}
}

cHelpGuide.prototype.ScratchUntil = function(page)
{
	var pi=0;
	for (pi=0; pi<this.pages.length;pi++)
	{
		var p = this.pages[pi];
		if (p==page)
			return
		p.Scratch();
	}
}

cHelpGuide.prototype.FindNextPage = function(page)
{
	var pi=0;
	for (pi=0; pi<(this.pages.length-1);pi++)
	{
		var p = this.pages[pi];
		if (p==page)
		{
			return this.pages[pi+1];
		}
	}
	return null;
}

cHelpGuide.prototype.FindPage = function(pageName)
{
	var pn = pageName;
	var pi=0;
	for (pi=0; pi<this.pages.length;pi++)
	{
		var p = this.pages[pi];
		if (p.pageName == pn && !p.scratched)
		{
			return p
		}
	}
	return null;
}

;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />
/// <reference path="..\docs\SysHelp.debug.js" />

function cHelpGuideBase() 
{
}

cHelpGuideBase.prototype.GetWindow = function(frame) {
    /// <summary>When supplied an existing frame name it returns its window object.</summary>
    /// <param name="frame" type="String">The name (id) of the frame.</param>
    /// <returns type="DOMElement">Window object</returns>

    var win = SysGetElement(frame, parent);
    if (win && win.contentWindow) {
        win = win.contentWindow;
    }
    return win;
}

cHelpGuideBase.prototype.HelpDocument = function() {
    /// <summary>Returns the document element for the Help frame.</summary>
    /// <returns type="DOMElement">document element</returns>

    return this.GetDocument('Help');
}

cHelpGuideBase.prototype.MainDocument = function() {
    /// <summary>Returns the document element for the main frame.</summary>
    /// <returns type="DOMElement">document element</returns>

    return this.GetDocument('MainWindow');
}

cHelpGuideBase.prototype.GetDocument = function(name) {
    /// <summary>Returns the document element for the supplied frame.</summary>
    /// <param name="name" type="String">The name (id) of the frame</param>
    /// <returns type="DOMElement">document element</returns>

    var win = this.GetWindow(name);
    if (win) {
        return win.document;
    }
    return null;
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />
/// <reference path="..\docs\SysHelp.debug.js" />

// Help Guidance Page

// Inheritance
cHelpPage.prototype = new cHelpGuideBase();

// Constructor
cHelpPage.prototype.constructor = cHelpPage;

function cHelpPage()
{
	// Fields
	this.id = '';
	this.pageName = '';
	this.table = null;
	this.steps = new Array();
	
	this.titleRow = null;
	this.textRow = null;
	this.guide = null;
	
	this.stepsRow = null;
	this.stepsDiv = null;
	this.scratched = false;

	// Constructor
	if ( arguments.length )
	{
		this.id = arguments[0];
		this.pageName = arguments[1];
		
		this.titleRow = SysGetElement(this.id);
		this.titleRow.Ctl = this;

		this.stepsRow = this.titleRow.nextSibling;
		this.stepsRow.Ctl = this;
		
		this.stepsDiv = this.stepsRow.childNodes[0].childNodes[0];
	}

	// Events
	return this;
}

// Methods and Properties
cHelpPage.prototype.AddStep = function(step)
{
	this.steps[this.steps.length] = step;
	step.page = this;
}

cHelpPage.prototype.Open = function()
{
	$(this.stepsRow).show();
	//CSlideDown(this.stepsRow, this.stepsDiv);
	var s = this.FindNextNonScratchedStep();
	if (s)
		s.Open()
	else
		this.Finished()
}

cHelpPage.prototype.Finished = function () {
	var url = new SysUrlBuilder('HlpGuideFinished.aspx');
	url.Add('Item', this.guide.id);
	if (!Dialog.ShowDialog()) {
		SysShowModal("HlpGuideFinished.aspx?Item=" + this.guide.id, null, "740px", "500px", null, true, "scroll=no");
	} else {
		new Dialog({ autoShow: true, width: 740, height: 500, contentsPage: url });
	}
}

cHelpPage.prototype.Close = function()
{
	$(this.stepsRow).hide();
	//CSlideUp(this.stepsRow, this.stepsDiv);
}

cHelpPage.prototype.AddEvents = function(doc) {

    var win = doc.parentWindow;

    for (var ifr = 0; ifr < doc.forms.length; ifr++) {
        var form = doc.forms[ifr];
        for (var iel = 0; iel < form.elements.length; iel++) {
            var el = form.elements[iel];
            el.SHlp = this;

            if (el.id !== "" && $(el).is(":not(:hidden)")) {

                if (el.tagName == 'BUTTON' || (el.tagName == 'INPUT'
                				      && (el.type == "button" || el.type == "checkbox" || el.type == "radio"))) {
                    SysAttachEvent(el, "onclick", function(ev) {
                        HlpHtHandleEvent(ev.target.id);
                    }, win);
                }
                else {
                    SysAttachEvent(el, "onchange", function(ev) {
                        HlpHtHandleEvent(ev.target.id);
                    }, win);
                }
            }
        }
    }

    for (var iel = 0; iel < doc.links.length; iel++) {
        var el = doc.links[iel];
        var elId;
        if (el.id)
            elId = el.id;
        else
            elId = el.name;
        if (elId) {
            if ($(el).is(":not(:hidden)")) {
                el.SHlp = this;
                SysAttachEvent(el, "onclick", function(ev) {
                    HlpHtHandleEvent(ev.target.id);
                }, win);
            }
        }
    }
}

function HlpHtHandleEvent(elId) 
{
	var g = HlpGuide();
	if (!g) 
		return;
	var doc = g.MainDocument();
	var el = SysGetElement(elId, doc);
	if (!el) 
	{
		var nm = doc.getElementsByName(id);
		if (nm.length==0) 
			return;
		el = nm[0];
	}
	var page = el.SHlp;
	if (page) 
		page.DoEvent(elId);
}

cHelpPage.prototype.DoEvent = function(elId)
{
	this.ScratchStep(this.FindStep(elId));
}

cHelpPage.prototype.ScratchStep = function(s)
{
	if (s)
	{
		var p = s.page;
		s.Scratch();
		s.Close();
		s = this.FindNextNonScratchedStep();
		if (s)
			s.Open();
		if (this.CheckAllStepsScratched())
		{
			p = this.guide.FindNextPage(p);
			if (p)
			{
				this.guide.SetCurrentPage(p);
			}
		}
	}
}

cHelpPage.prototype.CheckAllStepsScratched = function()
{
	var pi=0;
	for (pi=0; pi<this.steps.length;pi++)
	{
		var p = this.steps[pi];
		if (!p.scratched)
		{
			return false;
		}
	}
	this.Scratch();
	return true;
}

cHelpPage.prototype.Scratch = function()
{
	$("td", this.titleRow).css("textDecoration", "line-through");	
	this.scratched = true;
}

cHelpPage.prototype.UnScratch = function(elId)
{
	$("td", this.titleRow).css("textDecoration", "none");	
	this.scratched = false;
	
	this.CloseAll();
	var go = elId==null;
	var pi=0;
	var fp;
	for (pi=0; pi<this.steps.length;pi++)
	{
		var p = this.steps[pi];
		if (p.id==elId)
		{
			go = true;
			var fp = p;
		}
		if (go)
		{
			p.UnScratch();
		}
	}
	if (fp)
		fp.Open();
}

cHelpPage.prototype.CloseAll = function(elId)
{
	var pi=0;
	for (pi=0; pi<this.steps.length;pi++)
	{
		var p = this.steps[pi];
		p.Close();
	}
}

cHelpPage.prototype.FindNextNonScratchedStep = function()
{
	var pi=0;
	for (pi=0; pi<this.steps.length;pi++)
	{
		var p = this.steps[pi];
		if (!p.scratched)
			return p;
	}
	return null;
}

cHelpPage.prototype.FindNextNonScratchedStepWithControls = function(s)
{
	s = this.FindNextNonScratchedStep();
	while (s)
	{
		if (!s.HasControls())
		{
			s.GrayOut();
			s = this.FindNextNonScratchedStep();
		}
		else
			return s;
	}
	return null;
}

cHelpPage.prototype.FindNextStep = function(s)
{
	var pi=0;
	for (pi=0; pi<(this.steps.length-1);pi++)
	{
		var p = this.steps[pi];
		if (p==s)
		{
			return this.steps[pi+1];
		}
	}
	return null;
}

cHelpPage.prototype.FindStep = function(elementId)
{
	var pn = elementId;
	var pi=0;
	for (pi=0; pi<this.steps.length;pi++)
	{
		var p = this.steps[pi];
		
		if (!p.scratched) { 
			if (p.HasControlId(pn))
			{
				return p
			}
		}
	}
	return null;
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />
/// <reference path="..\docs\SysHelp.debug.js" />

// Help Guidance Page

// Inheritance
cHelpStep.prototype = new cHelpGuideBase();

// Constructor
cHelpStep.prototype.constructor = cHelpStep;

function cHelpStep()
{
	// Fields
	this.id = '';
	this.controlId = '';
	this.controlIds = null;
	this.titleRow = null;
	this.textRow = null;
	this.scratchImage = null;
	
	this.scratched = false;
	this.page = null;

	// Constructor
	if ( arguments.length )
	{
		this.id = arguments[0];
		this.controlId = arguments[1];
		this.controlIds = this.controlId.split(' ');
		
		this.titleRow = SysGetElement(this.id);
		this.titleRow.Ctl = this;
		//this.titleRow.onmouseover = this.MouseOver;
		//this.titleRow.onmouseout = this.MouseOut;
		
		this.textRow = this.titleRow.nextSibling;
		this.textRow.Ctl = this;
		//this.textRow.onmouseover = this.MouseOver;
		//this.textRow.onmouseout = this.MouseOut;
		
		var c = this.titleRow.cells[0];
		this.scratchImage = c.childNodes[0];
		this.scratchImage.Ctl = this;
		this.scratchImage.onclick = this.ScratchImage;
	}

	// Events
	return this;
}

// Methods and Properties
cHelpStep.prototype.HasControlId = function(id)
{
	for (var i=0; i<this.controlIds.length; i++)
	{
		if (id==this.controlIds[i])
			return true;
	}
	return false
}

cHelpStep.prototype.ScratchImage = function()
{
	var c = this.Ctl;
	if (c)
		c.page.ScratchStep(c);
}

cHelpStep.prototype.GrayOut = function()
{
	$(this.titleRow).css("fontstyle", "italic");	
	$(this.titleRow).css("textDecoration", "line-through");	
	this.scratched = true;
}

cHelpStep.prototype.Scratch = function()
{
	$("td", this.titleRow).css("textDecoration", "line-through");
	this.scratched = true;
}
cHelpStep.prototype.UnScratch = function()
{
	$("td", this.titleRow).css("textDecoration", "none");	
	this.scratched = false;
}

cHelpStep.prototype.Open = function()
{
	$(this.textRow).show();
	$(this.scratchImage).css("display", "inline");
	this.SwitchColors(true);
}

cHelpStep.prototype.Close = function()
{
	$(this.textRow).hide();
	$(this.scratchImage).hide();
	this.SwitchColors(false);
}

cHelpStep.prototype.MouseOver = function(e)
{
	var el = SysSrcElement(e);
	if (el.tagName == 'TD')
		el = el.parentNode;
	var c = el.Ctl;
	if (c)
		c.SwitchColors(true)
}

cHelpStep.prototype.MouseOut = function(e)
{
	var el = SysSrcElement(e);
	if (el.tagName == 'TD')
		el = el.parentNode;
	var c = el.Ctl;
	if (c)
		c.SwitchColors(false)
}

cHelpStep.prototype.HasControls = function()
{
	for (var si=0; si<this.controlIds.length;si++)
	{
		var s = this.controlIds[si].split(':');
		if (s.length==1)
		{
			if (this.HasControl(this.controlIds[si],null))
				return true;
		}
		else
		{
			if (this.HasControl(s[1],s[0]))
				return true;
		}
	}
	return false;
}
cHelpStep.prototype.HasControl = function(id, frame) 
{
	var doc;
	if (frame) 
        doc = this.GetDocument(frame);
    else 
        doc = this.MainDocument();
    
	if (doc != null) 
	{
		var el = SysGetElement(id, doc);
		if (el) 
			return true;
		
		var nm = doc.getElementsByName(id);
		if (nm.length>0) 
			return true;
	}
    return false;
}


cHelpStep.prototype.SwitchColors = function(add)
{
	for (var si=0; si<this.controlIds.length;si++)
	{
		var s = this.controlIds[si].split(':');
		if (s.length==1)
			this.SwitchColor(this.controlIds[si],null, add);
		else
			this.SwitchColor(s[1],s[0],add);
	}
}

cHelpStep.prototype.SwitchColor = function(id, frame, add) 
{
    var doc;
    if (frame) 
        doc = this.GetDocument(frame);
    else 
        doc = this.MainDocument();
    
    if (doc != null) 
    {
		var el = SysGetElement(id, doc);

        if (el != null) 
        {
            this.SwitchColorElement(el, add);
        }
        var nm = doc.getElementsByName(id);

		for (var si = 1; si < nm.length; si++) 
		{
            el = nm[si];
            this.SwitchColorElement(el, add);
        }
    }
}
cHelpStep.prototype.SwitchColorElement = function(el,add)
{
	if (add)
	{
		var r = SysHlpGetRule();
		$(el).css("backgroundColor", r.style.backgroundColor);
		$(el).css("color", r.style.color);		
	}
	else
	{
		$(el).css("backgroundColor", el.style.backgroundColor);
		$(el).css("color", el.style.color);
	}
}
var sysHlpGuideRule = null;
function SysHlpGetRule()
{
	if (sysHlpGuideRule==null)
		sysHlpGuideRule=SysFindStyleSheetRule(".HelpGuideSelect");
	return sysHlpGuideRule;
};/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />
/// <reference path="..\docs\SysHelp.debug.js" />

// How To
function HlpHtFile(doc)
{
	var pn = doc.location.pathname;
	var li = pn.lastIndexOf('/')
	var dot = pn.lastIndexOf('.')
	if (li<0 || dot<0)
		return null;
	return pn.substring(li+1,dot)
}

function HlpHtSetFirstText(hdoc, pg) 
{
	var tb = SysGetElement("t" + pg, hdoc);
	if (tb == null || tb.rows.length == 0) 
        return;
    
    HlpHtCloseText(hdoc, tb);
	for (var iel = 0; iel < tb.rows.length; iel++) 
	{
        var tr = tb.rows[iel];
		if (tr.className == '' && !($(tr).css("textDecoration").is("line-through"))) 
		{
            HlpHtShowText(tr);
            return;
        }
    }
}
function HlpHtMainDoc() 
{
	var main = SysGetElement('MainWindow', parent);
    if (main == null)
        return;
	try 
	{
        return main.contentWindow.document;
    }
	catch(ex) 
    {
        return null;
    }
}
function HlpHtTabClose(doc)
{
	var tb = SysGetElement("HelpRows", doc);
	if (tb==null)
		return;
	for (var i=0; i<tb.rows.length;i++)
	{
		var tr = tb.rows[i];
		var ctl = tr.getAttribute('ctl');
		if (ctl!=null)
			$(tr).hide();
	}
}
function HlpHtTabOpen(doc, pg) 
{
	var tr = SysGetElement("p" + pg, doc);
	if (tr == null) 
		return;
    
	$(tr).show();
}
function HlpHtAddEvents(doc) {
	for (var ifr=0; ifr<doc.forms.length;ifr++)
	{
		var form = doc.forms[ifr];
		for (var iel=0; iel<form.elements.length;iel++)
		{
			var el=form.elements[iel];
			if ($(el).is(":not(:hidden)")) {
			    if (el.tagName == 'BUTTON' || (el.tagName == 'INPUT' && el.Type == "BUTTON")) {
			        SysAttachEvent(el, "onclick", new Function('HlpHtHandleOnClick("' + el.id + '")'));
			    }
			    else {
			        SysAttachEvent(el, "onchange", new Function('HlpHtHandleOnChange("' + el.id + '")'));
			    } 
			}
		}
	}
}
function HlpHtHandleBrowser(el)
{
	if (!parent.hlpHtRunning)
		return;
	HlpHtChange(el)
}
function HlpHtHandleOnChange(el)
{
	HlpHtChange(el)
}
function HlpHtHandleOnClick(el)
{
	HlpHtChange(el)
}
function HlpHtChange(el)
{
	var tr = HlpHtScratch(el);
	if (tr!=null)
		tr = tr.nextSibling;
	HlpHtShowText(tr);
}
function HlpHtShowText(tr)
{
	if (tr!=null)
		tr = tr.nextSibling;
	if (tr!=null)
		$(tr).show();
}
function HlpHtSetText(tr) 
{
	if (tr == null) 
        return;
    
    var hdoc = HlpHtDoc();
	if (hdoc == null) 
        return;
    
	var div = SysGetElement("helpText", hdoc);
	if (div == null) 
        return;
    
    var txt = tr.getAttribute("txt");
	if (txt != null) 
        div.innerText = tr.getAttribute("txt");
	else 
        div.innerText = '';
}
function HlpHtScratch(el) 
{
    var hdoc = HlpHtDoc();
    var doc = HlpHtMainDoc();
	if (hdoc == null || doc == null) 
        return;
    
    var pg = HlpHtFile(doc);
	var tb = SysGetElement("t" + pg, hdoc);
	if (tb == null || tb.rows.length == 0) 
		return;
	var tr = SysGetElement('p' + pg, hdoc);
	if (tr == null) 
		return;
	var ctl = tr.getAttribute('ctl');
    if (ctl == null) 
        return;
	var tr = SysGetElement('p' + ctl + el, hdoc);
    if (tr == null) 
    {
        tr = HlpHtFindControlRow(el, tb);
		if (tr == null) 
            return;
    }
    HlpHtCloseText(hdoc, tb)
    HlpHtScratchUntil(tr, tb);
    tr = tr.nextSibling;
    $(tr).hide();
    return tr;
}
function HlpHtFindControlRow(el,tb)
{
	for (var iel=0; iel<tb.rows.length;iel++)
	{
		var tr = tb.rows[iel];
		var ctlid = tr.getAttribute('ctlid');
		if (ctlid!=null)
		{
			var ids = ctlid.split(' ');
			for (var si=0; si<ids.length;si++)
			{
				if (ids[si]==el)
					return tr;
			}
		}
	}
}
function HlpHtScratchUntil(trUntil,tb)
{
	for (var iel=0; iel<tb.rows.length;iel++)
	{
		var tr = tb.rows[iel];
		if (tr.className!='HelpGuideText')
			$(tr).css("textDecoration", "line-through");	
		if (tr==trUntil)
			return;
	}
}
function HlpHtCloseText(hdoc,tb)
{
	for (var iel=0; iel<tb.rows.length;iel++)
	{
		var tr = tb.rows[iel];
		if (tr.className=='HelpGuideText')
		{
			$(tr).hide();
		}
	}
}
function HlpHtMouseOver(e)
{
	HlpHtSwitchColors(e, true)
}
function HlpHtMouseOut(e)
{
	HlpHtSwitchColors(e, false)
}
function HlpHtSwitchColors(e, add)
{
	var el = SysSrcElement(e);
	el = el.parentNode;
	var ctlid=el.getAttribute("ctlid");
	if (ctlid == null) 
	    return;
	var ids = ctlid.split(' ');
	for (var si=0; si<ids.length;si++)
	{
		HlpHtSwitchColor(ids[si],add);
	}
}
function HlpHtSwitchColor(id, add) {
	var doc = HlpHtMainDoc();
	if (doc != null) {
		var el = SysGetElement(id, doc);
		if (el != null) {
			if (el.parentNode.tagName == 'TD') {
				el = el.parentNode;
			}
			if (add) {
				SysAddClass(el, 'HelpGuideSelect');
			}
			else {
				SysRemoveClass(el, 'HelpGuideSelect');
			}
		}
	}
}

function HlpGuidance(helpGuidanceID)
{
	SysMenuHide();
	parent.parent.prtStartHelpID(helpGuidanceID);	
}

function HlpHtMenuDoc() 
{
	var main = SysGetElement('Products', parent);
    if (main == null)
        return;
    try 
    {
        return main.contentWindow.document;
    }
	catch(ex) 
	{
        return null;
    }
}

function HlpHtClearMenuColors()
{
	var doc = HlpHtMenuDoc();
		
	if (doc != null)
	{
		for (var iel=0; iel<doc.links.length;iel++)
		{
			var el=doc.links[iel];
			if (el != null) {
				$(el).css("backgroundColor", el.style.backgroundColor);
				$(el).css("color", el.style.color);
			}
		}
	}
}
;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />
/// <reference path="..\docs\SysHelp.debug.js" />

function HlpShowOkMessage() 
{
	var el = SysGetElement("OkMessage");
	if (el) 
	{
        $(el).show();
    }
	var btn = SysGetElement("OkMessageBtn");
	if (btn) 
    {
        btn.focus();
    }
    var v = SysGet("TrainingCourse");
    SysSet("TrainingCourse_Succeeded", v);
}

function HlpClickNext() 
{
	var el = SysGetElement("btnNext");
	if (el) 
        el.click();
}

;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />
/// <reference path="..\docs\SysHelp.debug.js" />

var hlpHtRunning = false;
var hlpGuide = null;
function HlpGuide() {
	var hdoc = HlpHtDoc();
	if (hdoc == null || hdoc.body.Ctl == null)
		return;
	return hdoc.body.Ctl;
}

function HlpHtClose() {
	HlpHtClearMenuColors();
	parent.hlpHtRunning = false;
	parent.prtStopHelp()
}
function HlpHtStart() {
	HlpHtClearMenuColors();
	parent.hlpHtRunning = true;
	var hdoc = HlpHtDoc();
	if (hdoc == null || hdoc.body.Ctl == null)
		return;
	hdoc.body.Ctl.Start()
}

function HlpHtControl() {
	if (!hlpHtRunning)
		return;
	var hdoc = HlpHtDoc();
	if (hdoc == null || hdoc.body.Ctl == null)
		return;
	hdoc.body.Ctl.ControlPage();
}

function HlpHtDoc() {
	var hlp = SysGetElement('Help', parent);
	if (hlp == null)
		return;
	return hlp.contentWindow.document;
}

function HlpDocumentFileName(doc) {
	var pn = doc.location.pathname;
	var li = pn.lastIndexOf('/')
	var dot = pn.lastIndexOf('.')
	if (li < 0 || dot < 0)
		return null;
	return pn.substring(li + 1, dot)
}
;