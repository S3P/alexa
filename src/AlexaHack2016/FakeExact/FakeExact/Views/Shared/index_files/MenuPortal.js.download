/// <reference path="../base/jquery-1.5.1.js" />
/// <reference path="../SysControls/SysWindow.js" />
/// <reference path="../SysControls/SysElement.js" />
/// <reference path="DropdownMenu.js" />

var _menuscriptversion = "1.4.1.5";

var ResetupCompanyMode = {
	ResetupCompanyFromScratch: 1
};
/// <summary>This library is intended for MenuPortal.apsx.</summary>
function SetLanguage(code) {
	var url = new SysUrlBuilder("SysCallback.aspx");
	url.Add("Action", 11);
	url.Add("SettingName", "Language");
	url.Add("SettingValue", code);

	SysCallback(url);
	window.top.allowSwitch = true;
	window.top.location.href = "MenuPortal.aspx";
}

function ToggleMessageBar(show) {
	var bar = new SysElement($(".MessageBar"));
	var admin = new SysElement("Administration");
	var search = new SysElement("MyExactOnlineContainer");
	var arrow = new SysElement("MessageArrow");
	var height;
	if (show === true || bar.IsVisible() === false) {
		bar.Show();
		height = bar.TotalHeight();
		admin.Top(parseFloat(admin.Css("top")) + height);
		admin.RemoveClass("Shift");
		search.Top(parseFloat(search.Css("top")) + height);
		arrow.RemoveClass("MessageExpand");
		arrow.AddClass("MessageCollapse");
		arrow.element.attr("title", HIDE_TRIAL_MSG);
		SysCallback("SysCallback.aspx?Action=11&SettingName=2&SettingValue=True");
	}
	else {
		height = bar.TotalHeight();
		bar.Hide();
		admin.Top(parseFloat(admin.Css("top")) - height);
		admin.AddClass("Shift");
		search.Top(parseFloat(search.Css("top")) - height);
		arrow.RemoveClass("MessageCollapse");
		arrow.AddClass("MessageExpand");
		arrow.element.attr("title", SHOW_TRIAL_MSG)
		SysCallback("SysCallback.aspx?Action=11&SettingName=2&SettingValue=False");
	}
	AutoResize();
}

function SetLocation(loc, e) {
	if (!(loc instanceof SysUrlBuilder)) {
		loc = new SysUrlBuilder(loc);
	}
	MenuManager.CollapseAll();

	if (typeof megaMenu !== 'undefined') {
		megaMenu.close();
	}

	var ev = SysEvent(e);
	if (ev && ev.shiftKey && ev.button === Sys.UI.MouseButton.leftButton) {
		SysWindow.OpenInTab(loc);
	}
	else {
		$('#MainWindow').attr('src', loc.ToString());
	}
	if (SysElement.IsNotNothing(e)) {
		new SysHandleEvent(e).StopAll();
	}
}

function SearchHelp(e) {
	MenuManager.CollapseAll();
	HlpSearch(SysGetValue('SearchTextHelp'), e);
}

function Search(e) {
	SetLocation('SysSearch.aspx?Text=' + SysURLEncode(SysGetValue('SearchText')), e);
}

function SearchDivision(division) {
	if (division) {
		var xml = SysCallback('SysInputSearch.aspx?XML=1&InputType=B&Name=UserDivisions&Text=' + SysURLEncode(division), "", null, false);
		if (xml && xml.xml != '') {
			var es = xml.getElementsByTagName("Entity");
			if (es.length == 1) {
				var pos = xml.getElementsByTagName("Position").item(0);
				var posID = pos.getAttribute("id");
				division = es.item(0).getAttribute("value" + posID);
			}
			else {
				division = null;
			}
		}
		else {
			division = null;
		}
	}
	if (!division) {
		SysBrowseData('SearchAdminHidden', 'Name=UserDivisions&ResultCols=d.Code,d.HID,d.Description&BRS_QuickSearch='
			+ SysURLEncode(SysGetValue('SearchAdmin'))
			+ '&BRRV_QuickSearch='
			, '', false, false,
			function () {
				SysResetInvalidFlag('SearchAdminHidden');
				if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
					setTimeout(Switch, 1);
				} else {
					Switch();
				}
				function Switch() {
					SysWindow.SwitchDivision(SysGet('SearchAdminHidden'));
				}
			}, null);
	}
	else if (division) {
		SysWindow.SwitchDivision(division);
	}
}

function SearchText(text) {
	SetLocation('SysSearch.aspx?Text=' + SysURLEncode(text));
}



function AutoResize() {
	SizeHeader();
	SizeFrames();
}

function SizeFrames() {
	var lf = new SysElement("Help");
	var mw = new SysElement("MainWindow");
	var lfVisible = lf.IsVisible();
	var win = new SysElement(window);
	var newheight = win.Height() - mw.Top();
	if (newheight > 0) {
		mw.Height(newheight);
		if (lfVisible) {
			lf.Height(newheight - parseFloat(lf.element.css("padding-top")) - parseFloat(lf.element.css("padding-bottom")));
		}
	}
	var newWidth = win.Width()
	if (lfVisible) {
		newWidth -= lf.Width();
	}
	if (newWidth > 0) {
		mw.Width(newWidth);
	}
}

/// <summary>Setting Exact logo homepage link</summary>
/// <returns type="undefined">undefined</returns>
function SetLogoHomepageLink(linkHomepage) {
	$('.Logo').click(function (e) {
		e.stopPropagation();
		SetLocation(linkHomepage);
	});
}

// Menu width fix for all browsers
function SizeHeader() {
	var headerContainer = new SysElement(".HeaderContainer");
	var detectionBar = new SysElement(".DetectionBar");
	var sBarW = new SysElement('.SearchBar').OuterWidth();
	var wDocW = headerContainer.OuterWidth();
	var mWidthW = wDocW - sBarW;

	$('.TabsContainer').css('max-width', mWidthW - 25);

	var detectionBarTop = detectionBar.Top();
	var detectionBarHeight = detectionBar.Height();
	var headerContainerTop = headerContainer.Top();
	var offset = detectionBarTop + detectionBarHeight - headerContainerTop;

	headerContainer.Height(offset - 2);

}

(function () {
	var Logo = $(".Logo");
	var LogoIcon = Logo.children(".LogoIcon");
	var HomeIcon = Logo.children(".HomeIcon");
	if (HomeIcon.length) {
		if (UserAgent.IsIE && UserAgent.majorVersion <= 8) {
			Logo.hover(function () {
				LogoIcon.hide(); HomeIcon.show();
			},
			function () {
				HomeIcon.hide(); LogoIcon.show();
			});
		} else {
			var resetLogo = function () {
				LogoIcon.stop(true, true).fadeIn({ duration: 400 });
				HomeIcon.stop(true, true).fadeOut({ duration: 200 });
				Logo.removeClass('active');
				$(window).unbind('focusout', resetLogo);
			};
			Logo.hover(function () {
				Logo.addClass('active');
				setTimeout(function () {
					if (Logo.hasClass('active')) {
						LogoIcon.stop(true, true).fadeOut({ duration: 200 });
						HomeIcon.stop(true, true).fadeIn({ duration: 400 });
					}
				}, 300);
				$(window).bind('focusout', resetLogo);
			},
			resetLogo);
		}
	}
})();

function StartResetupWizard(isShowResetupDialog, action, isAccountantLinkedFromScratch) {
	var url = new SysUrlBuilder("WizAdministrationSetup.aspx");
	if (isShowResetupDialog) {
		url.Add("Action", action);
		if (action === ResetupCompanyMode.ResetupCompanyFromScratch) // Start from scratch after complete installation
			url.Add("IsAccountantLinkedFromScratch", isAccountantLinkedFromScratch);
		ShowResetupDialog(url, 500, 170, "Exact Online", 26862, false);
	}
	else {
		ShowResetupDialog(url, 590, 450, "Administration setup", 53856, true);
	}
}

function ShowResetupDialog(url, width, height, term, termId, resizable) {
	if (!(url instanceof SysUrlBuilder)) {
		url = new SysUrlBuilder(url);
	}

	new Dialog({
		autoShow: true,
		width: width,
		height: height,
		titleTerm: term,
		titleTermId: termId,
		resizable: resizable,
		contentsPage: url,
	}).Open();
}

function showTrialMessage() {
	new SysElement('spanTrialMessageLiteral').Show();
	new SysElement('spanBtnBuyNow').Hide();
}

function showBuyButton() {
	var trialMessage = new SysElement('spanTrialMessageLiteral');

	new SysElement('btnBuyNow').Width(trialMessage.OuterWidth())

	trialMessage.Hide();
	new SysElement('spanBtnBuyNow').Show();
}

var MyWorkflowMenu = {
	initialize: function () {
		// Check if there even is a MyWorkflowContainer menu
		if (new SysElement('MyWorkflowContainer').empty) {
			return;
		}

		var myWorkflowContainer = MenuManager.Get('MyWorkflowContainer');

		var keepOpen = function () {
			myWorkflowContainer.KeepOpen(true);
		};
		var dontKeepOpen = function () {
			myWorkflowContainer.KeepOpen(false);
		};

		var description = new SysElement('AddWorkflowTask');
		var user = new SysElement('AddWorkflowTaskUser_alt');
		var button = new SysElement('BtnAddTask');
		var createWorkflowTask = new SysElement('CreateWorkflowTask');

		// Check if the create task functionality exists
		if (description.empty || user.empty || button.empty || createWorkflowTask.empty) {
			return;
		}

		description.AttachEvent('onfocus', keepOpen);
		description.AttachEvent('onblur', dontKeepOpen);

		user.AttachEvent('onfocus', keepOpen);
		// no onblur as we want to force it to stay open when browsing using a Dialog

		button.AttachEvent('onfocus', keepOpen);
		button.AttachEvent('onblur', dontKeepOpen);

		// needed as we don't have an onblur for AddWorkflowTaskUser_alt
		createWorkflowTask.AttachEvent('onfocus', dontKeepOpen);

		MyWorkflowMenu.update();
	},

	createTask: function () {
		var description = new SysElement('AddWorkflowTask');
		var user = new SysElement('AddWorkflowTaskUser');
		var request = new SysElement('AddTaskRequest');

		var addTaskContainer = new SysElement('.AddTaskContainer');
		var addTaskAddedContainer = new SysElement('.AddTaskAddedContainer');
		var addTaskErrorContainer = new SysElement('.AddTaskErrorContainer');

		var url = new SysUrlBuilder('WflRequestCallback.aspx');
		url.Add('Action', 1);
		url.Add('Description', description.Value());
		url.Add('UserID', user.Value());

		var cx = SysCbLoadList(url);
		var errorMessage = SysCbGetValue(cx, 'ErrorMessage')
		if (errorMessage) {
			var createTaskLink = addTaskErrorContainer.Find('a');
			addTaskErrorContainer.Text(errorMessage + '. ');
			addTaskErrorContainer.element.append(createTaskLink.element);

			addTaskContainer.Hide();
			addTaskErrorContainer.Show();
		} else {
			request.Value(SysCbGetValue(cx, 'Request'));

			addTaskContainer.Hide();
			addTaskAddedContainer.Show();

			// update the activities badge/list without taking the time threshold in mind
			if (UpcomingActivities) {
				UpcomingActivities.forceUpdate();
			}
		}

		description.Value('');
		description.element.change(); // Manually fire the change event to make the Placeholder text work on IE8/IE9
	},

	update: function () {
		// This is needed as the SysKeyDown(event) occurs after the MyWorkflowMenu.update()
		// other option would be to add OnKeyUp to InputField.vb
		window.setTimeout(function () {
			var description = new SysElement('AddWorkflowTask');
			var isDescriptionEmpty = !description.Value();

			var user = new SysElement('AddWorkflowTaskUser');
			var isUserEmpty = !user.Value();

			var button = new SysElement('BtnAddTask');
			button.SetDisabled(isDescriptionEmpty || isUserEmpty);
		}, 1);
	},

	openTask: function () {
		MyWorkflowMenu.showCreate();

		var requestId = new SysElement('AddTaskRequest').Value();
		if (requestId) {
			var url = new SysUrlBuilder('WflRequest.aspx');
			url.Add('BCAction', 1);
			url.Add('ID', requestId);

			var dialog = new Dialog({
				contentsPage: url,
				width: 850,
				height: 700,
				resizable: true
			});
			dialog.Open();
		}
	},

	showCreate: function () {
		var addTaskContainer = new SysElement('.AddTaskContainer');
		var addTaskAddedContainer = new SysElement('.AddTaskAddedContainer');
		var addTaskErrorContainer = new SysElement('.AddTaskErrorContainer');

		addTaskAddedContainer.Hide();
		addTaskErrorContainer.Hide();
		addTaskContainer.Show();

		MyWorkflowMenu.update();
	}
};

(function (exports) {
	var _autoUpdateThreshold = null;
	var _autoUpdateFrequency = null;
	var _manualUpdateFrequency = null;
	var _manualUpdateThreshold = null;
	var _lastResponse = null;

	var initialize = function (autoUpdateFrequency, manualUpdateFrequency) {
		_autoUpdateFrequency = 0;
		if (autoUpdateFrequency > 0) {
			_autoUpdateFrequency = autoUpdateFrequency;
		}
		_manualUpdateFrequency = manualUpdateFrequency || 0;

		$('.HeaderContainer').mouseenter(autoUpdate);
	}

	var setThresholds = function () {
		var now = +new Date();
		_autoUpdateThreshold = now + _autoUpdateFrequency;
		_manualUpdateThreshold = now + _manualUpdateFrequency;
	}

	var autoUpdate = function () {
		var now = +new Date();
		if (_autoUpdateFrequency && _autoUpdateThreshold < now) {
			update();
		}
	}

	var manualUpdate = function () {
		var now = +new Date();
		if (_manualUpdateFrequency && _manualUpdateThreshold < now) {
			update();
		}
	}

	var update = function () {
		setThresholds();
		var url = new SysUrlBuilder('WflRequestCallback.aspx');
		url.Add('Action', 2);
		SysCallback(url, null, refresh);
	}

	function AddElement(values,workflow) {
		var isActivity = (values.Type === "Activity" ? true : false);
		var idPrefix = values.Type;
		var contentIdPrefix = values.Type + "{0}{1}";
		var listElementID = String.format("My{0}{1}", idPrefix, values.itemNumber);
		RenderRequestItem(values.itemNumber, listElementID, contentIdPrefix, isActivity);
		SetRequestType(values.itemNumber, contentIdPrefix, workflow.RequestType);
		SetRequestDescription(values.itemNumber, contentIdPrefix, workflow);
		SetRequestEndDate(values.itemNumber, contentIdPrefix, workflow.RequestStartDate, workflow.RequestEndDate, workflow.IsOverdue);
	}

	function RenderRequestItem(itemNumber, listElementID, contentIdPrefix, isActivity) {
		var listItemTemplate = $("#" + listElementID);
		if (listItemTemplate.length == 0) {
			requestTypeID = String.format(contentIdPrefix, "Type", itemNumber);
			requestDescriptionID = String.format(contentIdPrefix, "Description", itemNumber);
			reqeustDateID = String.format(contentIdPrefix, "EndDate", itemNumber);
			listItemTemplate = '<li class="DropDownMenuMyRequestsList" id="{0}" style="display:block">'
			listItemTemplate += '<div class="DropdownMenuActivityText">'
			listItemTemplate += '<span id="{1}"></span>'
			listItemTemplate += '<a id="{2}" href="#"></a>'
			listItemTemplate += '</div>'
			listItemTemplate += '<div class="DropdownMenuActivityDate" id="{3}"></div>'
			listItemTemplate += '</li>'
			listItemTemplate = String.format(listItemTemplate, listElementID, requestTypeID, requestDescriptionID, reqeustDateID);

			if (isActivity) {
				$(listItemTemplate).insertBefore("#dropDownMenuBodyForActivity #MyRequests");
			}
			else {
				$(listItemTemplate).insertAfter("#dropDownMenuBodyForActivity #MyRequests");
			}
		}
		else listItemTemplate.show();
	}

	function SetRequestType(itemNumber, contentIdPrefix, requestType)
	{
			var requestTypePlaceHolder = String.format(contentIdPrefix, "Type", itemNumber);
			$("#" + requestTypePlaceHolder).text(requestType);

	}

	function SetRequestDescription(itemNumber, contentIdPrefix, workflow) {

		var requestURL = new SysUrlBuilder('WflRequest.aspx?BCAction=1');
		requestURL.Add('ID', workflow.RequestID);

		var requestDescriptionPlaceholder = String.format(contentIdPrefix, "Description", itemNumber);
		
		var onClickScript = String.format('SetLocation("{0}", event);', requestURL.ToString());
		if (workflow.FromDifferentDivision) {
			requestURL.OverrideDivisionKey(workflow.Division);
			onClickScript = String.format('SysSwitchDivision("{0}", "MenuPortal.aspx?gopage={1}", false, 1);',
				workflow.Division, encodeURIComponent(requestURL.ToString()));
		}

		$("#" + requestDescriptionPlaceholder).attr('onClick', onClickScript)
		.text(workflow.RequestDescription);
	}

	function SetRequestEndDate(itemNumber,contentIdPrefix, requestStartDate, requestEndDate, isOverdue) {
		var requestDateID = String.format(contentIdPrefix, "EndDate", itemNumber);
		var endDate = $("#"+requestDateID);

		if (requestStartDate == null ? endDate.text(requestEndDate) : endDate.text(requestStartDate));

		if (isOverdue) {
			endDate.addClass('Overdue');
		}
		else {
			endDate.removeClass('Overdue');
		}
	}

	function UpdateWorkflowList(Type, workflowItemsList) {
		if (workflowItemsList.length) {
			for (var i = 0; i < workflowItemsList.length; i++) {
				var workFlow = workflowItemsList[i];
				AddElement({
					Type: Type,
					itemNumber: i + 1,
				}, workFlow);
			}
		}
	}
		function ShowRequestsList(list)
		{
			if (list.Activity.DisplayableWorkflowCounts > 0) {
				new SysElement('MyActivities').Show();
			}
			if (list.Communication.DisplayableWorkflowCounts > 0) {
				new SysElement('MyRequests').Show();
			}
			if ((list.Communication.DisplayableWorkflowCounts > 0) || (list.Activity.DisplayableWorkflowCounts > 0)) {
				new SysElement('MyActivitiesTotalCountBadge').AddClass('Notifications');
			}
		}

		function UpdateBadgeCount(badge, jsonObj)
		{
			myTotalRequestsCount = jsonObj.Activity.TotalWorkflowItem + jsonObj.Communication.TotalWorkflowItem;
			if (myTotalRequestsCount > 99) {
				badge.text('99+');
			}
			else {
				badge.text((myTotalRequestsCount != 0 ? myTotalRequestsCount.toString() : ""));
			}
		}

		function SetBadgeStyle(badge,jsonObj) {

			var overdue = IsWorkflowOverdue(jsonObj.Activity.WorkflowItemsList) || IsWorkflowOverdue(jsonObj.Communication.WorkflowItemsList);

			if (overdue) {
				badge.addClass('Overdue');
			}
			else {
				badge.removeClass('Overdue');
			}
		}

		function IsWorkflowOverdue(workflowsList) {
			if (workflowsList) {
				for (var itemNumber = 0; itemNumber < workflowsList.length; itemNumber++) {
					if (workflowsList[itemNumber].IsOverdue) {
						return true;
					}
				}
			}
		}

		function ClearContent()
		{
			//Clear contents

			var MyActivities = new SysElement('MyActivities');
			if (!MyActivities.empty) MyActivities.Hide();

			var MyRequests = new SysElement('MyRequests');
			if (!MyRequests.empty) MyRequests.Hide();

			new SysElement('MyActivitiesTotalCountBadge').RemoveClass('Notifications');
			$('#MyActivitiesTotalCountBadge').text('');

			var activity, communication;
			for (var i = 0; i < 5 ; ++i) {
				activity = new SysElement('MyActivity' + (i + 1));
				if (!activity.empty) activity.Hide();
				communication = new SysElement("MyCommunication" + (i + 1));
				if (!communication.empty) communication.Hide();
			}
		}

		var refresh = function (response) {
			if (_lastResponse != response) {
				_lastResponse = response;
				var jsonObj;
				try {
					jsonObj = JSON.parse(response);
				}
				catch (e) {
				}

				ClearContent();

				// inject new values
				if (jsonObj && typeof jsonObj == 'object') {

					var activityList = $('#ActivitiesList');
					if(activityList.length) activityList.text(jsonObj.Activity.WorkflowItemCountText);

					var requestList = $('#RequestList');
					if(requestList.length)requestList.text(jsonObj.Communication.WorkflowItemCountText);

					ShowRequestsList(jsonObj);

					UpdateWorkflowList(jsonObj.Activity.WorkflowTypeName, jsonObj.Activity.WorkflowItemsList);

					UpdateWorkflowList(jsonObj.Communication.WorkflowTypeName, jsonObj.Communication.WorkflowItemsList.reverse());

					//update Badge count
					var badge = $('#MyActivitiesTotalCountBadge');
					if (badge.length) {
						UpdateBadgeCount(badge, jsonObj);
						SetBadgeStyle(badge, jsonObj);
					}
				}
			}
		};

		var UpcomingActivities = {
			'update': manualUpdate,
			'forceUpdate': update,
			'initialize': initialize
		};

		exports.UpcomingActivities = UpcomingActivities;
	})(window);;/// <reference path="..\docs\jquery-1.5.1.js" />
/// <reference path="..\docs\MicrosoftAjax.Debug.js" />
/// <reference path="..\docs\SysControls.debug.js" />

// Public interface

ManageGuidanceFrame.prototype = {
	empty: true,
	StartHelp: function(helpFile) {
		/// <summary>Start the help guidance with the supplied help file name, i.e. show the help guidance frame.</summary>
		/// <param name="helpFile" type="String"></param>
		/// <returns type="undefined">undefined</returns>
	},
	StartHelpId: function(id) {
		/// <summary>Start the help guidance with the supplied help id, i.e. show the help guidance frame.</summary>
		/// <param name="id" type="String"></param>
		/// <returns type="undefined">undefined</returns>
	},
	StartHelpProcess: function(processFile) {
		/// <summary>Start the help guidance with the supplied process file name, i.e. show the help guidance frame.</summary>
		/// <param name="processFile" type="String"></param>
		/// <returns type="undefined">undefined</returns>
	},
	StopHelp: function() {
		/// <summary>Stop the help guidance, i.e. remove the help guidance frame.</summary>
		/// <param name="" type=""></param>
		/// <returns type="undefined">undefined</returns>
	}
};

// Constructor

function ManageGuidanceFrame(el) {
	/// <summary>Manages the lhs help guidance frame</summary>
	/// <param name="el" type="Any" optional="true">Any (DOM) element (identifier): a reference/id to the frame that 
	/// will contain the help guidance. If it is omitted, 'Help' is assumed.</param>
	/// <field name="empty" type="Boolean">Indicates if the instance wraps a frame.</field>

	if (ManageGuidanceFrame._initialized === undefined) {
		var STEPSIZE = 20;
		var FRAMEWIDTH = 200;
		var STEPDELAY = 20;

		var helpExpanded = false;
		var frameSize = 0;
		var frame = new SysElement();
		var main = new SysElement();
		var win = new SysElement();

		ManageGuidanceFrame.prototype._Init = function (el) {
			if (SysElement.IsNothing(el)) {
				frame.Init("Help");
			}
			else {
				frame.Init(el);
			}
			if (!frame.empty) {
				this.empty = false;
			}
			main.Init("#MainWindow");
			win.Init(window);
		};

		// Local

		ManageGuidanceFrame.prototype._ExpandHelp = function () {
			if (frameSize > FRAMEWIDTH) {
				return;
			}

			frameSize += STEPSIZE;
			frame.Width(frameSize);
			frame.Height(main.Height() - parseFloat(frame.element.css("padding-top")) - parseFloat(frame.element.css("padding-bottom")));
			main.Width(win.Width() - frame.Width());
			main.Left(frameSize);

			var me = this;
			setTimeout(function () {
				me._ExpandHelp();
			}, STEPDELAY);
		};

		ManageGuidanceFrame.prototype._StartExpandHelp = function () {
			if (!helpExpanded) {
				frameSize = 0;
				// frame.Show has side effects for iframes: the display is set to inline, IE and Safari suggest 
				// they're loading the page long after it has actually finished.
				frame.SetDisplay(SysElement.Display.Block);
				this._ExpandHelp();
				helpExpanded = true;
			}
		};

		ManageGuidanceFrame.prototype._RetractHelp = function () {
			if (frameSize <= 0) {
				frame.SetDisplay(SysElement.Display.None);
				return;
			}

			frameSize -= STEPSIZE;
			frame.Width(frameSize);
			main.Width(win.Width() - frame.Width());
			main.Left(frameSize);

			var me = this;
			setTimeout(function () {
				me._RetractHelp();
			}, STEPDELAY);
		}


		ManageGuidanceFrame.prototype._StartRetractHelp = function () {
			if (helpExpanded) {
				frameSize = FRAMEWIDTH + STEPSIZE;
				this._RetractHelp();
				helpExpanded = false;
			}
		}

		// Public
		ManageGuidanceFrame.prototype.StartHelp = function (helpFile) {
			frame.element.attr("src", new SysUrlBuilder("HlpGuide.aspx?mode=2&helpfile=" + helpFile).ToString());
			this._StartExpandHelp();
		};

		ManageGuidanceFrame.prototype.StartHelpId = function (id) {
			frame.element.attr("src", new SysUrlBuilder("HlpGuide.aspx?mode=2&helpid=" + id).ToString());
			this._StartExpandHelp();
		};

		ManageGuidanceFrame.prototype.StartHelpProcess = function (processFile) {
			frame.element.attr("src", new SysUrlBuilder("HlpGuide.aspx?mode=2&ProcessFile=" + processFile).ToString());
			this._StartExpandHelp();
		};

		ManageGuidanceFrame.prototype.StopHelp = function () {
			this._StartRetractHelp();
		}

		ManageGuidanceFrame._initialized = true;
	}

	this._Init(el);
}

// Legacy, called from help control/js
var _helpFrame = new ManageGuidanceFrame();
function HelpFrame() {
	if (!_helpFrame || _helpFrame.empty) {
		_helpFrame = new ManageGuidanceFrame();
	}
	return _helpFrame;
}
function prtStartHelp(helpFile) {
	HelpFrame().StartHelp(helpFile);
}
function prtStartHelpProcess(helpFile) {
	HelpFrame().StartHelpProcess(helpFile);
}
function prtStartHelpID(helpID) {
	HelpFrame().StartHelpId(helpID);
}
function prtStopHelp() {
	HelpFrame().StopHelp();
}
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../SysControls/SysElement.js" />
/// <reference path="../SysControls/SysUserAgent.js" />

TabMenuTab.prototype = {
	tabmenutabversion: "1.0.0.0",
	id: "",
	tab: null,
	Show: function() {
		/// <summary>Highlight this individual tab and show the menu items.</summary>
		/// <returns type="undefined">undefined</returns>
	},
	Hide: function() {
		/// <summary>De-highlight this individual tab and hide the menu items.</summary>
		/// <param name="" type=""></param>
		/// <returns type="undefined">undefined</returns>
	}
};

function TabMenuTab(el) {
	/// <summary>Menu item control, takes care showing/hiding sub menus.</summary>
	/// <param name="el" type="Any">Any reference to the actual menu item.</param>
	/// <field name="id" type="String">The menu item's identifier.</field>
	/// <field name="tab" type="SysElement">The element that is wrapped by this instance.</field>

	if (TabMenuTab._initialized === undefined) {
		TabMenuTab.prototype._menu = null;
		TabMenuTab.prototype._overlay = null;

		TabMenuTab.prototype.Show = function () {
			this.tab.AddClass("Hover");
			this._menu.Show();
			var me = this;
			if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
				// on someplaces negative(?) margins are used. And than, for some unobvious reason the width is still not correct.
				me._overlay.Width(Math.max(me._menu.OuterWidth(), me._menu.TotalWidth()) + 3);
				me._overlay.Height(Math.max(me._menu.OuterHeight(), me._menu.TotalHeight()));
				me._overlay.Show();
			}
		};

		TabMenuTab.prototype.Hide = function() {
			this.tab.RemoveClass("Hover");
			if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
				this._overlay.Hide();
			}
			this._menu.Hide();
		};

		TabMenuTab.prototype._Init = function(el) {

			this.tab = new SysElement(el);
			this.id = this.tab.id;
			this._menu = new SysElement(this.tab.element.find("ul"));
			// Part of an IE specific fix for dropdowns being displayed underneath iframes with PDF
			if (UserAgent.IsIE() || UserAgent.IsIE11OrUp()) {
				// immediately setting display:none to avoid jumping / resizing windows.
				var overlay = $("<iframe class='IEIFrameOverlay' frameborder='0' style='display: none;'></iframe>");
				overlay.insertBefore(this._menu.element);
				this._overlay = new SysElement(overlay);
			}
			var me = this;
			this._menu.element.find("a").click(function(e) {
				me.Hide();
				new SysHandleEvent(e).StopPropagation();
			});
		};

		TabMenuTab._initialized = true;
	}

	this._Init(el);
}

TabMenu.prototype = {
	tabmenuversion: "1.0.0.0",
	id: ""
};

function TabMenu(el) {
	/// <summary>Wrapper around the tab menu and takes care of the delayed showing/hiding of the individual tabs.
	/// </summary>
	/// <param name="el" type="Any">Reference to the tab menu.</param>
	/// <field name="id" type="String">The menu's identifier.</field>
	if (TabMenu._initialized === undefined) {
		TabMenu.prototype._menu = null;
		TabMenu.prototype._tabs = [];
		// For the regression test the options should show faster and stay open longer
		// These can be defined in a separate file not part of the Exact Online set
		TabMenu.prototype._showTimeout = window.testAutomationTabMenuShowTimeOut || 300;
		TabMenu.prototype._hideTimeout = window.testAutomationTabMenuHideTimeOut || 300;
		
		TabMenu.prototype._Init = function(el) {
			var me = this;
			this._menu = new SysElement(el);

			this._menu.element.find("> li").each(function() {
				var item = new TabMenuTab(this);
				var showTimeOutId = 0, hideTimeOutId = 0;

				var hideItem = function () {
					if (showTimeOutId !== 0) {
						clearTimeout(showTimeOutId);
						showTimeOutId = 0;
					}
					hideTimeOutId = setTimeout(function () {
						item.Hide();
						$(window).unbind('focusout', hideItem);
						hideTimeOutId = 0;
					}, me._hideTimeout);
				}


				$(this).hover(
					function() {
						if (hideTimeOutId !== 0) {
							clearTimeout(hideTimeOutId);
							hideTimeOutId = 0;
						}
						showTimeOutId = setTimeout(function() {
							// When the mouse is moved too fast, this event is not fired, so the menu remains open,
							// therefore the Hide is called for all tab menu's.
							for (var tb = 0; tb < me._tabs.length; tb++) {
								me._tabs[tb].Hide();
							}
							item.Show();
							$(window).bind('focusout', hideItem);
							showTimeOutId = 0;
						}, me._showTimeout);
					}, hideItem);

				$(this).click(
					function() {
						if (hideTimeOutId !== 0) {
							clearTimeout(hideTimeOutId);
							hideTimeOutId = 0;
						}
						if (showTimeOutId !== 0) {
							clearTimeout(showTimeOutId);
							showTimeOutId = 0;
						}
						item.Show();
					});
				me._tabs.push(item);
			});

		};

		TabMenu._initialized = true;
	}

	this._Init(el);
}
;var checkLocking = true;

function CheckLockings() {
	if (checkLocking) {
		var lock = SysCallback("SysCallBack.aspx?Action=4", null, null, "json");
		if (lock && lock.locked) {
			checkLocking = false;
			new WarningDialog({
				headerTerm: lock.message,
				width: 400,
				height: 200,
				handler: function () {
					checkLocking = true;
				}
			});
		}
	}
}

function Timeout(reset) {
	checkLocking = reset;
}

//ticket expired message warning icon will fail to load if network connection fail, preload warning icon.
var preloadWarningIcon= new Image();
function PreloadWarningImage() {
	preloadWarningIcon.src = new SysUrlBuilder("images\\dialog_Warning_icon.png").ToString();
}

var ticketExpirationDialog = {

	_showExpirationDialog : null,
	_pageTitle: document.title,
	_options: null,
	
	UpdateTicketExpiration: function (expirationOptions) {

		PreloadWarningImage();

		if (expirationOptions) {
			ticketExpirationDialog._options = expirationOptions;
		}

		window.clearTimeout(ticketExpirationDialog._showExpirationDialog);

		if (ticketExpirationDialog._options) {

			var remainingTime = ticketExpirationDialog._options.timeout - ticketExpirationDialog._options.timer;

			if (ticketExpirationDialog._options.timer >= 0 && remainingTime >= 0) {
				ticketExpirationDialog._showExpirationDialog = window.setTimeout(function () { ticketExpirationDialog._ShowTicketExpirationDialog() }, remainingTime * 60000);
			}
		}

	},	
	_ShowTicketExpirationDialog: function () {

		ticketExpirationDialog._pageTitle = document.title;
		document.title = ticketExpirationDialog._options.titleBeforeExpire;

		var dlg = new WarningDialog({
			headerTerm: ticketExpirationDialog._options.headerTextBeforeExpire,
			messageTerm: ticketExpirationDialog._options.messageBeforeExpire ? ticketExpirationDialog._options.messageBeforeExpire.replace('{0}', ticketExpirationDialog._options.timer) : '',
			width: 400,
			height: 200

		});

		dlg.SetTitle(ticketExpirationDialog._options.titleBeforeExpire);
		$(dlg.dialog.element).parent().find('.ui-button-text').text(ticketExpirationDialog._options.buttonTextBeforeExpire);

		ticketExpirationDialog._ChangeExpireDialogMessage(dlg, ticketExpirationDialog._options.timer);

	},
	_ChangeExpireDialogMessage: function (dlg, remainingTime) {

		window.clearTimeout(ticketExpirationDialog._showExpirationDialog);

		var refreshTime = 1;
		var message = ticketExpirationDialog._options.messageBeforeExpire ? ticketExpirationDialog._options.messageBeforeExpire.replace('{0}', remainingTime) : '';

		//session expired
		if (remainingTime <= 0) {
			message = ticketExpirationDialog._options.messageAfterExpire;
			document.title = ticketExpirationDialog._options.titleAfterExpire;
			dlg.SetTitle(ticketExpirationDialog._options.titleAfterExpire);

			$(dlg.dialog.element).find('.MessageHeader').text(ticketExpirationDialog._options.headerTextAfterExpire);
			$(dlg.dialog.element).parent().find('.ui-button-text').text(ticketExpirationDialog._options.buttonTextAfterExpire);

		}

		$(dlg.dialog.element).find('.MessageText').text(message);

		dlg.onClose = function () {

			document.title = ticketExpirationDialog._pageTitle;

			window.clearTimeout(ticketExpirationDialog._showExpirationDialog);

			if (remainingTime > 0) {
				SysCallback("SysCallBack.aspx");

				ticketExpirationDialog.UpdateTicketExpiration(ticketExpirationDialog._options);

			} else {
				// session expired
				location.reload(true);
			}

		}

		ticketExpirationDialog._showExpirationDialog = window.setTimeout(function () { ticketExpirationDialog._ChangeExpireDialogMessage(dlg, (remainingTime - refreshTime)) }, refreshTime * 60000);

	}
};

function ShowLinkMyAccountantDialog(showInNewTab) {
	if (showInNewTab) {
		var win = window.open("LicAccountantWizard.aspx?ShowStyle=AccountantsCenter", '_blank');
		win.focus();
	}
	else {
		var dlg = new Dialog({
			autoShow: true,
			contentsPage: new SysUrlBuilder('LicAccountantWizard.aspx'),
			width: 1000,
			height: 760,
			onClose: function () {
				if (dlg.returnValue == 1) {
					window.top.allowSwitch = true;
					window.top.location.href = 'MenuPortal.aspx';
				}
			}
		});
	}
}

function ShowCreateActivitiesInMenuDialog() {
	var dlg = new Dialog({
		autoShow: true,
		contentsPage: new SysUrlBuilder('WflRequestTypeSelect.aspx?RequestTypesToShow=1'),
		width: 850,
		height: 300
	});
}

function ShowContactUsInMenuDialog() {
	var dlg = new Dialog({
		autoShow: true,
		contentsPage: new SysUrlBuilder('HlpContact.aspx'),
		width: 550,
		height: 430,
		titleTerm: 'Contact Support',
		titleTermId: 0
	});
	return dlg;
}

var guidedTourDialog = null;

function ShowGuidedTourDialog(dialogOptions) {
	guidedTourDialog = new Dialog({
		id: dialogOptions.id,
		titleTerm: dialogOptions.titleTerm,
		width: 590,
		customDialogClass: 'tour-welcome-container',
		onOpen: function () {
			var bottomSection = $('#GuidedTour_GuidedTourBottomSection');
			SetEqualHeightFor(bottomSection.find('span.tour-content-header'));
			SetEqualHeightFor(bottomSection.find('p.tour-content-description'));
			LogActivity("WelcomePopup");
		},
		onClose: function () {
			var location = guidedTourDialog.returnValue;
			guidedTourDialog = null;
			RedirectPage(location);
		}
	});

	window.setTimeout(function () {
		guidedTourDialog.Open();
	}, 1); 
}

function LogActivity(appName) {
	var url = new SysUrlBuilder("SysCallBack.aspx");
	url.Add("Action", 24);
	url.Add("LogInformation", String.format('{{"AppName": "{0}"}}', appName));
	SysCallback(url);
}


function RedirectPage(location) {
	if (location !== undefined && location != '') {
		if (!(location instanceof SysUrlBuilder)) {
			location = new SysUrlBuilder(location);
		}
		$('#MainWindow').attr('src', location.ToString());
	}
}

function CloseGuidedTourDialog(url) {
	guidedTourDialog.returnValue = url;
	guidedTourDialog.Close();
}


function SetEqualHeightFor(selectedElements) {
	var maxHeight = 0;

	selectedElements.each(function () {
		maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
	});

	selectedElements.each(function () {
		$(this).height(maxHeight);
	});
}

function ShowGuidedToursMenuDialog() {

		$("#GuidedTourMenu_GuidedTourMenuMainContainer").dialog({
			title: SysTerm(59599,"Guided tours"),
			autoOpen: false,
			modal: true,
			height: 400,
			width: 630,
	});
		$("#GuidedTourMenu_GuidedTourMenuMainContainer").dialog("open");
}

function CloseGuidedToursMenuDialog() {
	$("#GuidedTourMenu_GuidedTourMenuMainContainer").dialog("close");
}




function ShowCreditCardDialog(url) {
	var myUrl = url;
	if (!(myUrl instanceof SysUrlBuilder)) {
		myUrl = new SysUrlBuilder(url);
	}

	var dialogFullScreen = false;
	var dialogWidth = 1050;
	var dialogHeight = 650;

	var options = {
		autoShow: true,
		fullScreen: dialogFullScreen,
		width: dialogWidth,
		height: dialogHeight,
		contentsPage: myUrl,
		onClose: function () {
			if (dialog.returnValue) {
				SysLogOff();
			}
		}
	}

	var dialog = new Dialog(options);
}

function LoadGoogleAnalyticsMainMenuNavigationClicksScript() {	
	var $navigationMenuLinks = $("div.TabsContainer > ul.Tabs > li.TabStart ul.FunctionList a");
	if ($navigationMenuLinks.length > 0) {
		//Trace old menu links
		$navigationMenuLinks.each(function () {
			$(this).click(function () {
				var $currentClickedMenuItem = $(this);
				var selectedItem_MenuItemContainer = $currentClickedMenuItem.closest('li.TabStart');
				if (selectedItem_MenuItemContainer.length === 1) {
					//Level 0: Main MenuItem
					var mainMenuItemDescription = '';
					var mainMenuItemDescriptionContainer = selectedItem_MenuItemContainer.children('div').children('a');
					if (mainMenuItemDescriptionContainer.length === 1) {
						mainMenuItemDescription = mainMenuItemDescriptionContainer.attr('data-ga-description');
					}

					//Level 1: Sub MenuItem
					var subMenuItemDescription = '';
					var subMenuItemDescriptionContainer = $currentClickedMenuItem.closest('table').find('th');
					if (subMenuItemDescriptionContainer.length === 1) {
						subMenuItemDescription = subMenuItemDescriptionContainer.attr('data-ga-description');
					}

					//Level 2: MenuItem
					var menuItemDescription = $currentClickedMenuItem.attr('data-ga-description');

					//Send navigation menu path to Google Analytics
					var clickedNavigationMenuPath = mainMenuItemDescription + ' - ' + subMenuItemDescription + ' - ' + menuItemDescription;

					ga('send', 'event', 'Menu', 'click', clickedNavigationMenuPath);
				}
			});
		});
	} else {
		//Trace Mega menu links		
		$('ul.megamenu a.megamenu-section__link').each(function () {
			$(this).click(function () {
				ga('send', 'event', 'MegaMenu', 'click', this.id); //Id example: Financial_Entries_Enter_CreateEntries
			});
		});
	}	
};/// <reference path="../base/jquery-1.5.1.js" />
/// <reference path="../SysControls/SysElement.js" />
/// <reference path="../SysControls/Dialog.js" />

(function () {
	var AnnouncementDialog = (function () {

		AnnouncementDialogDef.prototype = new Dialog({ inherit: true });

		function AnnouncementDialogDef(options) {
			if (AnnouncementDialogDef._initialized === undefined) {
				AnnouncementDialogDef.prototype.announcementId = "";
				AnnouncementDialogDef.prototype.announcementHandler = "";
				AnnouncementDialogDef.prototype.autoSize = true;
				AnnouncementDialogDef.prototype.resizable = false;

				AnnouncementDialogDef.prototype._OnOpen = function () {
					var me = this;
					this.dialog.Find("a[href]").element.click(function (e) {
						SysCallback(me.announcementHandler + "/read?id=" + me.announcementId);
						me._read = true;
						me.Close();
					});
				};

				AnnouncementDialogDef.prototype._OnClose = function () {
					if (!this._read) {
						SysCallback(this.announcementHandler + "/ignore?id=" + this.announcementId);
					}
				};

				AnnouncementDialogDef._initialized = true;
			};

			options.onOpen = this._OnOpen;
			options.onClose = this._OnClose;

			Dialog.call(this, options);
		}

		return AnnouncementDialogDef;
	})();

	window.AnnouncementDialog = AnnouncementDialog;
})();
;function InitializeIntuitConnection(mProxy, gUrl) {
	if (intuit) {
		intuit.ipp.anywhere.setup({
			menuProxy: mProxy,
			grantUrl: gUrl
		});
	}
};function ShowPaymentPage(accountID) {
	var pspDialog = new Dialog({
		autoShow: true,
		contentsPage: new SysUrlBuilder('BoPSPPaymentInfo.aspx?PspRegistrationPage=True&AccountID=' + accountID),
		onClose: function () {
			if (!pspDialog.returnValue) {
				SysLogOff();
			}
		},
		height: 590,
		width: 780
	});

}

function ShowHppPaymentPage(accountID) {
	var pspDialog = new Dialog({
		autoShow: true,
		contentsPage: new SysUrlBuilder('BoPSPPaymentInfoHpp.aspx?PspRegistrationPage=True&AccountID=' + accountID),
		onClose: function () {
			if (!pspDialog.returnValue) {
				SysLogOff();
			}
		},
		height: 790,
		width: 780
	});

};