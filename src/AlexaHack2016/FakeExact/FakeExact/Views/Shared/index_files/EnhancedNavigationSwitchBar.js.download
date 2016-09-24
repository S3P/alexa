var EnhancedNavigationSwitchBar = {
	Action: function (event, root) {
		event.preventDefault();
		this.RefreshEnhancedNavigationSwitch(SysGetValue('ShowHideNavigationSwitch'), root);
		SysRefreshWholePage();
	},
	RefreshEnhancedNavigationSwitch: function (actionParam, root) {
		if ($("#EnhancedNavigationSwitchBar").length) {
			var url = new SysUrlBuilder('EnhancedNavigationCallback.aspx');
			url.Add('Action', actionParam);
			url.Add('CurrentAddress', this.GetCurrentAddress(root));
			SysCallback(url, null);
		}
	},
	GetCurrentAddress: function (root) {
		var address = $("#MainWindow")[0].contentWindow.location.href;
		return address.replace(new RegExp(root, 'gi'), '');
	}
};

var IASwitchBarClose = {
	Action: function (hideIASwitchBar) {
		var url = new SysUrlBuilder('EnhancedNavigationCallback.aspx');
		url.Add('Action', hideIASwitchBar);
		SysCallback(url, null);
		$('#EnhancedNavigationSwitchBar').addClass('Hidden');
		$('#EnhancedNavigation').addClass('topbarClosed');
		return false;
	}
};;