/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../SysControls/SysElement.js" />
/// <reference path="../SysControls/SysLegacy.js" />
/// <reference path="../SysGrid/ExpandableMatrixRow.js" />

(function () {

	var ExpandableMatrix = (function () {
		// ----- Public interface -----

		ExpandableMatrixDef.prototype = {
			id: null,
			matrix: null,
			rows: null,
			rowPrefix: "",
			expandedRow: null,
			currentRowId: null,

			Expand: function (rowId) {
				/// <summary>Expand the row and move the html elements to a column from different columns.</summary/>
			},

			Collapse: function (rowId) {
				/// <summary>Collapse the row and move the html elements to their original column.</summary/>
			},

			AddCustomizeFeaturesToCollapse: function (rowId) {
				///<summary>Add extra behaviour to collapse mode.</summary>
			},

			AddCustomizeFeaturesToExpand: function (rowId) {
				///<summary>Add extra behaviour to expand mode.</summary>
			},

			Delete: function (rowId) {
				/// <summary>Hide the selected row and delete the values for the row.</summary/>
			},

			AddNewRow: function (addNewButton) {
				/// <summary>Add new row to matrix, and it is expanded row.</summary/>
			},

			AddCustomizeFeaturesToDelete: function (rowId) {
				///<summary>Add extra behaviour to delete function.</summary>
			},

			SetRowReadOnly: function (rowId) {
				/// <summary>Set row to read only.</summary/>
			},
		};

		// ----- Constructor -----

		function ExpandableMatrixDef(matrixId) {
			/// <summary></summary/>
			/// <param name="matrixId" type="String|SysElement" ></param>
			/// <field name="matrix" type="SysElement">The complete matrix</field>
			/// <field name="rows" type="undefined">To be determined</field>

			if (ExpandableMatrixDef._initialized === undefined) {

				// ----- Local interface -----

				ExpandableMatrixDef.prototype._columnControls;
				ExpandableMatrixDef.prototype._addNewButton;

				ExpandableMatrixDef.prototype._Init = function (matrixId) {
					if (matrixId != null) {
						this.matrix = new SysElement(matrixId);
						this.id = matrixId;
						this.rowPrefix = matrixId + "_r";
						this._columnControls = [];
						this._InitializedColumnControls(this.rowPrefix + "0");
						this._addNewButton = new SysElement(this.id + "_addnew");
						this._AddNewButtonOnFocus();
						this.rows = [];

						if (typeof (AddCustomizeFeaturesToCollapse) === "function") {
							this.AddCustomizeFeaturesToCollapse = AddCustomizeFeaturesToCollapse;
						};

						if (typeof (AddCustomizeFeaturesToExpand) === "function") {
							this.AddCustomizeFeaturesToExpand = AddCustomizeFeaturesToExpand;
						};

						if (typeof (AddCustomizeFeaturesToDelete) === "function") {
							this.AddCustomizeFeaturesToDelete = AddCustomizeFeaturesToDelete;
						};
					};
				};

				ExpandableMatrixDef.prototype.Expand = function (rowId) {
					if (this.expandedRow != null) {
						this.Collapse();
					};

					if (rowId != null) {
						for (var row in this.rows) {
							if (this.rows[row].rowId === rowId) {
								this.expandedRow = this.rows[row];
								this.rows[row].Expand();
							};
						}
						this.AddCustomizeFeaturesToExpand(rowId);
						this._SetFocus();
					};
				};

				ExpandableMatrixDef.prototype.Collapse = function () {
					//Move fields back to original positions.
					this.expandedRow.columnControls = this._columnControls.slice();
					this.expandedRow.Collapse();
					this.AddCustomizeFeaturesToCollapse(this.expandedRow.rowId);
					this.expandedRow = null;
				};

				ExpandableMatrixDef.prototype.CollapseAll = function () {
					//Collapse all the rows.
					for (var row in this.rows) {
						this.expandedRow = this.rows[row];
						this.Collapse();
					}
				};

				ExpandableMatrixDef.prototype.Delete = function (deleteButton) {
					if (deleteButton != null) {
						var rowId = SysGridRowID(deleteButton);
						// Hide the row and clear the values when user click on submit/ save button.
						for (var row in this.rows) {
							if (this.rows[row].rowId === rowId) {
								this.rows[row].Delete();
								this.rows.splice(row, 1);
								break;
							};
						}
						this.AddCustomizeFeaturesToDelete(rowId);

						if (this.rows.length === 0) {
							this._addNewButton.FireEvent("click");
						};
					};
				};

				ExpandableMatrixDef.prototype.AddNewRow = function (addNewButton) {
					if (addNewButton != null) {
						SysMatrixAddRows(addNewButton, this.id, true, false);
						var lastID = new Number(SysGet(this.id + "_LastID"));
						var rowId = this.id + "_r" + lastID;
						this.rows.push(new ExpandableMatrixRow(rowId));
						this.Expand(rowId);
					};
				};

				ExpandableMatrixDef.prototype.SetRowReadOnly = function (rowId) {
					if (rowId != null) {
						for (var row in this.rows) {
							if (this.rows[row].rowId === rowId) {
								this.rows[row].SetReadOnly(true);
								break;
							};
						}
					};
				};

				ExpandableMatrixDef.prototype._AddNewButtonOnFocus = function () {
					var me = this;

					me._addNewButton.AttachEvent("focus",
						function () {
							if (UserAgent.IsFF() && UserAgent.majorVersion >= 4) {
								window.setTimeout(function () {
									me._addNewButton.FireEvent("click");
								}, 1);
							}
							else {
								me.AddNewRow(me._addNewButton.GetDomElement());
							}
						});
				};

				ExpandableMatrixDef.prototype._InitializedColumnControls = function (rowId) {
					if (rowId != null) {
						var row = new SysElement(rowId).element;
						var columns = row.find("td[class*=ExpandableColumn]:visible");

						for (i = 0; i < columns.length; i++) {
							var column = $(columns[i]);
							var controlColumn;
							var controlsToMove;
							var fieldId = [];
							var columnId = column.attr("id");

							controlsToMove = column.find("div");

							controlsToMove.each(function () {
								var control = $(this);

								controlColumn = control.closest("td");
								fieldId.push(control.attr("id"));
							});

							if (controlColumn != null) {
								this._columnControls.push({
									columnId: columnId,
									fieldId: fieldId
								});
							};
						}
					};
				};

				ExpandableMatrixDef.prototype._SetFocus = function () {
					firstControl = this.expandedRow.row.element.find(":input:not([readOnly],input[type=button],button)").filter(":visible:first");
					firstControl.focus();
				};

				ExpandableMatrixDef._initialized = true;
			}

			this._Init(matrixId);
		}

		return ExpandableMatrixDef;
	})();

	window.ExpandableMatrix = ExpandableMatrix;
})();
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../SysControls/SysElement.js" />
/// <reference path="../SysControls/SysLegacy.js" />

(function () {

	var ExpandableMatrixRow = (function () {
		// ----- Public interface -----

		ExpandableMatrixRowDef.prototype = {
			rowId: null,
			row: null,
			columnControls: [],

			Expand: function () {
				/// <summary>Move the html elements to a target column.</summary/>
			},

			Collapse: function () {
				/// <summary>Move the html elements to original column.</summary/>
			},

			Delete: function () {
				/// <summary>Hide the selected row and delete the values for the row.</summary/>
			},

			SetReadOnly: function (readOnly) {
				/// <summary>Set row to read only.</summary/>
			},
		};

		// ----- Constructor -----

		function ExpandableMatrixRowDef(rowId) {
			/// <summary></summary/>
			/// <param name="rowId" type="String|SysElement" ></param>
			/// <field name="row" type="SysElement">Selected matrix row</field>

			if (ExpandableMatrixRowDef._initialized === undefined) {

				// ----- Local interface -----
				ExpandableMatrixRowDef.prototype._columns = null;
				ExpandableMatrixRowDef.prototype._targetColumn = null;
				ExpandableMatrixRowDef.prototype._collapseButton = null;
				ExpandableMatrixRowDef.prototype._expandButton = null;
				ExpandableMatrixRowDef.prototype._deleteButton = null;
				ExpandableMatrixRowDef.prototype._isExpand = false;
				ExpandableMatrixRowDef.prototype._favoriteButtonImage = null;
				ExpandableMatrixRowDef.prototype._readOnly = false;

				ExpandableMatrixRowDef.prototype._Init = function (rowId) {
					var rowIdRegExp = new RegExp(/_rr0w/);
					if (!rowIdRegExp.test(rowId)) {
						this.rowId = rowId;
						this.row = new SysElement(this.rowId);
						this._columns = this.row.element.find("td[class*=ExpandableColumn]:visible");
						this._expandButton = new SysElement(this.rowId + "_Expand");
						this._collapseButton = new SysElement(this.rowId + "_Collapse");
						this._InitializeDeletebutton();
						this._InitializeFavoriteButton();
						this._HideDeletedRow();
					}
				};

				ExpandableMatrixRowDef.prototype.Expand = function () {
					// Move next cell in next column to first column after first cell.
					this._expandButton.Hide();
					this._collapseButton.Show();
					this._isExpand = true;
					//Set a css class for expanded row
					new SysElement(this.rowId).AddClass("ExpandedRow");

					for (i = 0; i < this._columns.length; i++) {
						var column = new SysElement(this._columns[i]);
						this._MoveColumnWhenExpanding(column);
					};

					if (this._targetColumn != null) {
						this._targetColumn.Attribute("colspan", this._columns.length);
						this._targetColumn.Show();
					}
				};

				ExpandableMatrixRowDef.prototype.Collapse = function () {
					// Move back all the fields to it's orignal position.
					this._collapseButton.Hide();
					this._expandButton.Show();
					//Set a css class for expanded row
					new SysElement(this.rowId).RemoveClass("ExpandedRow");

					this._MoveColumnWhenCollapse();
				};

				ExpandableMatrixRowDef.prototype.Delete = function () {
					// Hide the row and clear the values when user click on submit/ save button.
					var controlList = this.row.element.find("input");
					var cellIdPrefix = new RegExp(this.rowId + "_c");

					if (controlList.size() > 0) {
						controlList.each(function () {
							var control = this;
							control.value = "";

							if (control.id.match(cellIdPrefix)) {
								SysMatrixTotalize(control);
							}
						});
						new SysElement(this.rowId + "_Deleted").Value(true);
						this.row.Hide();
					}
				};

				ExpandableMatrixRowDef.prototype.SetReadOnly = function (readOnly) {
					this._readOnly = readOnly;
				};

				ExpandableMatrixRowDef.prototype._MoveColumnWhenExpanding = function (column) {
					if (column != null) {
						var me = this;
						var controlColumn;
						var control;

						var columnId = column.Attribute("id");
						var controlsToMove = column.element.find("div");

						if (me._targetColumn === null) {
							me._targetColumn = column;
						};

						controlsToMove.each(function () {
							control = $(this);

							if (control.children().length > 0) {
								controlColumn = control.closest("td");
								me._targetColumn.element.append(control);
								me._ToggleBrowseFields(control);
							};
						});

						if (controlColumn != null) {
							controlColumn.hide();
							controlColumn = null;
						};
					};
				};

				ExpandableMatrixRowDef.prototype._ToggleBrowseFields = function (browseFieldsContainer) {
					var me = this;
					var browseFieldId = "";
					var browseField;

					browseFieldsContainer.find("label").show();

					var browseFields = browseFieldsContainer.find("[id$=_ref]");
					browseFields.each(function () {
						browseFieldId = this.id.replace("_ref", "");
						browseField = new SysBrowser(browseFieldId);
						browseField.input.Show();
						browseField.button.Show();

						if (me._readOnly) {
							browseField.SetReadOnly(true);
						}
					});
				};

				ExpandableMatrixRowDef.prototype._MoveColumnWhenCollapse = function () {
					var column;
					var columnId;
					var matrixId = new SysElement(this.row).Parent("table").Attribute("id");

					for (controlCount = 0; controlCount < this.columnControls.length; controlCount++) {
						columnId = this.columnControls[controlCount].columnId;
						column = this.row.element.find("td[id=" + columnId + "]");

						var fieldIds = this.columnControls[controlCount].fieldId;

						for (fieldCount = 0; fieldCount < fieldIds.length; fieldCount++) {
							var fielId = fieldIds[fieldCount].replace(matrixId + "_r0", this.rowId);
							var control = new SysElement(fielId).element;

							control.find("label").hide();
							control.find("input[id*=alt]").hide();
							control.find("button[id^=p" + this.rowId + "]").hide();

							if (this._isExpand && control.closest("td") != column) {
								column.append(control);
								column.attr("colspan", 1);
								column.show();
							};
						}
					}
					this.columnControls = [];
				};

				ExpandableMatrixRowDef.prototype._InitializeDeletebutton = function () {
					this._deleteButton = new SysElement(this.rowId + "_Delete");
					this._deleteButton.Attribute("tabindex", "-1");
				};

				/// <summary>Favorite button image will be hidden by default,
				/// it will only be shown if favorite key exist.</summary/>
				ExpandableMatrixRowDef.prototype._InitializeFavoriteButton = function () {
					this._favoriteButtonImage = new SysElement(this.rowId + "_Favorite_image");

					if (!this._favoriteButtonImage.empty) {
						this._favoriteButtonImage.Hide();
					}
				};

				ExpandableMatrixRowDef.prototype._HideDeletedRow = function () {
					if (Boolean(SysGet(this.rowId + "_Deleted"))) {
						this.row.Hide();
					};
				};

				ExpandableMatrixRowDef._initialized = true;
			}

			this._Init(rowId);
		}

		return ExpandableMatrixRowDef;
	})();

	window.ExpandableMatrixRow = ExpandableMatrixRow;
})();
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="../SysControls/SysElement.js" />

//Clipboard copy and paste
function SysGridCopyClipboard(gridID) {
	SysCopyClipboard(gridID, 1, 3, 2, 0);
}

function SysMatrixCopyClipboard(matrixID, useTotalColumn, oneFooterRow) {
	var footerColCount = 1;
	var footerRowCount = 2;

	if (!useTotalColumn) {
		footerColCount = 0;
	}

	if (oneFooterRow) {
		footerRowCount = 1
	}

	SysCopyClipboard(matrixID, 2, footerRowCount, 1, footerColCount);
}

function SysCopyClipboard(ID, headerRowCount, footerRowCount, headerColCount, footerColCount) {
	if (!window.clipboardData) {
		return; 	//Only IE supports copy and paste to and from the clipboard
	}

	var g = SysGetElement(ID);
	var s = "";
	for (row = headerRowCount; row < g.rows.length - footerRowCount; row++) {
		var tr = g.rows[row];
		if (jQuery(tr).is(":not(:hidden)")) {
			for (cell = headerColCount; cell < tr.cells.length - footerColCount; cell++) {
				var td = tr.cells[cell];
				if (jQuery(td).is(":visible")) {
					if (td != null) {
						var el = td.firstChild;
					}
					if (el != null) {
						var bRef = false;
						if (el.type == "hidden") {
							bRef = true;
							el = el.nextSibling;
						}
						if (el != null) {
							var v = el.value;
							if (v == null) {
								v = SysGetInnerText(el);
								if (v != null) {
									if (bRef) {
										s += v.substring(0, v.indexOf(" - "));
									}
									else {
										s += v;
									}
								}
							}
							else {
								s += v;
							}
							s += "\t";
						}
					}
				}
			}
			s += "\n";
		}
	}
	window.clipboardData.setData("Text", s);
}

function SysGridPasteClipboard(gridID) {
	SysPasteClipboard(gridID, 1, 3, 2, 0);
}

function SysMatrixPasteClipboard(matrixID, useTotalColumn, oneFooterRow) {
	var footerColCount = 1;
	var footerRowCount = 2;

	if (!useTotalColumn) {
		footerColCount = 0;
	}

	if (oneFooterRow) {
		footerRowCount = 1
	}

	SysPasteClipboard(matrixID, 2, footerRowCount, 1, footerColCount);
}

function SysPasteClipboard(ID, headerRowCount, footerRowCount, headerColCount, footerColCount) {
	if (!window.clipboardData) {
		return; 	//Only IE supports copy and paste to and from the clipboard
	}

	var ch = window.clipboardData.getData("Text");
	if (ch == null) {
		return;
	}
	var lines = ch.split("\n");
	var lineCount = lines.length;
	if (lines[lineCount - 1] == "") lineCount--;
	var g = SysGetElement(ID);
	var row = -1;
	for (var j = 0; j < lineCount; j++) {
		var tr;
		do {
			row += 1;
			if (g.rows.length - footerRowCount <= row + headerRowCount) {
				var elAddNew = SysGetElement(ID + "_addnew");
				if (elAddNew != null) {
					SysGridAddRows(elAddNew, ID, false, false, false);
				}
			}
			tr = null;
			if (g.rows.length - footerRowCount > row + headerRowCount) {
				tr = g.rows[row + headerRowCount];
			}
		} while (jQuery(tr).is(":hidden"))

		if (tr != null) {
			var values = lines[j].split("\t");
			var col = -1;
			for (var i = 0; i < values.length; i++) {
				var td;
				do {
					col += 1;
					td = null;
					if (tr.cells.length - footerColCount > col + headerColCount) {
						td = tr.cells[col + headerColCount];
					}
				} while (td != null && jQuery(td).is(":hidden"))

				if (td != null) {
					var el = td.firstChild;
					if (el != null) {
						while (el != null && el.type == "hidden") {
							el = el.nextSibling;
						}
						if (!el.disabled && !el.readOnly && el.type != "button" && el.value != values[i]) {
							try {
								el.value = values[i];
								$(el).change();
							}
							catch (ex) { }
						}
					}
				}
			}
		}
	}
	SysGridCheckPaging(ID);
}

//	Grid functions

var sysIsGridDirty = false;
function SysIsGridDirty() {
	return sysIsGridDirty;
}

function SysGridKeyDown(e) {
	/// <summary>Handle the left and right arrow keys inside a keydown event.</summary>
	/// <param name="e" type="DOMEvent"></param>
	/// <returns type="undefined">undefined</returns>
	var el = new SysElement(SysSrcElement(e));
	var sel = new SysSelection(el);
	if (SysIsCancelBubble(e)) {
		return;
	}
	var hdl = new SysHandleKey(e);
	if (hdl.HandleEnter(UserAgent.IsSafari() && hdl.IsTabKey())) {
		// If this is the last element and a browse field, trigger the onchange to make sure the
		// data is retrieve before add a new row. Firefox didn't show this problem and is excluded from the fix.
		if (!UserAgent.IsFF() && el.Is("input[id$='_alt']:visible:enabled")) {
			var $el = el.element;
			var $elLast = $el.closest("tr").find("input:visible:enabled:last");
			if ($el[0] == $elLast[0]) {
				el.element.change();
			}
		}
		return;
	}
	else if (hdl.IsLeftKey()) {
		var t = sel.GetSelection();
		var pos = sel.GetCaretPosition();
		if (t.length > 0) {
			// Other browsers set the cursor just before any selected test.
			if (Sys.Browser.agent === Sys.Browser.Firefox) {
				sel.SetCaretPosition(pos + 1);
			}
			return;
		}
		if (pos == 0) {
			var i;
			var f = document.forms[0];
			var el2 = new SysElement();
			for (i = 0; i < f.elements.length; i++) {
				if (f.elements[i] == el.GetDomElement()) {
					el2.Init(f.elements[i]);
					break;
				}
			}
			if (!el2.empty && i > 0) {
				i--;
				el2.Init(f.elements[i]);
				while (!el2.empty) {
					if (el2.element.attr("tabIndex") >= 0 && !el2.IsDisabled() && el2.IsVisible()) {
						// On timer, because without it only works correctly on IE.
						dummyEl = el2;
						window.setTimeout(function() {
							dummyEl.Focus();
							new SysElement(dummyEl).Select();
						}, 1);
						return;
					}
					i--;
					el2.Init(f.elements[i]);
				}
			}
		}
	}
	else if (hdl.IsRightKey()) {
		var pos2 = sel.GetCaretPosition();
		if (pos2 == el.Value().length) {
			hdl.HandleEnter(true);
		}
	}
}

function SysGridKeyUp(e) {
	/// <summary>Handle the up and down arrow keys inside a keyup event.</summary>
	/// <param name="e" type="DOMEvent"></param>
	/// <returns type="Boolean|undefined">Returns true if the key has been handled</returns>
	/// <remarks>TODO: the return behaviour is inconsistent.</remarks>
	if (SysIsCancelBubble(e)) {
		return;
	}
	var me = SysSrcElement(e);
	if (me.tagName == "SELECT") {
		return;
	}

	var hdl = new SysHandleKey(e);
	if (hdl.IsUpKey() || hdl.IsDownKey()) {
		var srcCell = (me.tagName == "TD") ? me : me.parentNode;
		var row = srcCell.parentNode;
		var tbody = row.parentNode;
		var table = tbody.parentNode;
		var rIndex = row.rowIndex;
		var move = (hdl.IsDownKey() ? 1 : -1);
		var bContinue = true;
		while (bContinue) {
			rIndex += move;
			if (rIndex < 0 || rIndex >= table.rows.length) {
				return;
			}
			var tr = table.rows[rIndex];
			var $tr = $(tr);
			var gridId = $tr.closest(".Grid").attr("id");
			if (SysGridIsAddNewRow(gridId, tr)) {
				SysGridDoAddNewRow(gridId);
				return;
			}
			bContinue = ($tr.is(":hidden") || $tr.hasClass("Header") || $tr.hasClass("Footer"));
			if (!bContinue) {
				var focusCell;
				if (IE_LEGACY) {
					// Hidden cells all get the cellIndex of the last visible cell + 1, ergo this workaround.
					var $cells = $(tr.cells).filter(":visible");
					focusCell = $cells[(srcCell.cellIndex < $cells.length) ? srcCell.cellIndex : $cells.length - 1];
				}
				else {
					focusCell = tr.cells[(srcCell.cellIndex < tr.cells.length) ? srcCell.cellIndex : tr.cells.length - 1];
				}
				if (focusCell != null) {
					var el = focusCell.firstChild;
					if (!SysGridFocusEl(el)) {
						bContinue = true;
					}
				}
			}
		}
		return true;
	}
	return false;
}

function SysGridTotal(grid, field) {
	return SysUnFormatNumber(SysGetInnerTextID(grid + "_vt_" + field));
}

function SysGridVisibleRows(grid) {
	return $("#" + grid + " tr[id^='" + grid + "_r']:not(:hidden)");
}

function SysGridIsAddNewRow(grid, tr) {
	var el = SysGetElement(grid + "_addnew");
	if (el != null) {
		var antr = el.parentNode.parentNode;
	}
	return (antr === tr);
}

function SysGridDoAddNewRow(grid) {
	var el = SysGetElement(grid + "_addnew");
	if (el != null) {
		el.focus();
	}
}

function SysGridTotalize(grid, field, rowId) {
	var st = SysGetElement(grid + "_SubTotal_" + field);
	var t = SysGetElement(grid + "_Total_" + field);
	var vt = SysGetElement(grid + "_vt_" + field);
	var digits = SysGet(grid + '_Digits_' + field);
	if (t == null || st == null || vt == null) {
		return;
	}
	var total = 0;
	var splitTotal = 0;
	var splitKey = SysGridRowSplitKey(grid, rowId);
	//Editable cells
	var els = $("#" + grid + " tr[id^='" + grid + "_r']:not(:hidden) input[id$='_" + field + "']").each(
		function() {
			var td = this.parentNode;
			var tr = td.parentNode;
			if (tr.style.display!="none") {
				var v = this.value;
				v = SysUnFormatNumber(v);
				if (!isNaN(v)) {
					total += v;
					if (splitKey === SysGridRowSplitKey(grid, tr.id)) {
						splitTotal += v;
					}
				}
			}
		});

	//Read-only cells	
	els = $("#" + grid + " tr[id^='" + grid + "_r']:not(:hidden) span[id$='_" + field + "']").each(
		function() {
			var td = this.parentNode;
			var tr = td.parentNode;
			if (tr.style.display!="none") {
				var v = SysGetInnerText(this);
				v = SysUnFormatNumber(v);
				if (!isNaN(v)) {
					total += v;
					if (splitKey === SysGridRowSplitKey(grid, tr.id)) {
						splitTotal += v;
					}
				}
			}
		});

	SysSetInnerText(vt, SysFormatNumber(total - SysUnFormatNumber(st.value) + SysUnFormatNumber(t.value), digits));

	if (splitKey) {
		SysSetInnerTextID(grid + "_st_" + SysGridGuid2Id(splitKey) + '_' + field, SysFormatNumber(splitTotal, digits));
	}
}

function SysGridTotalizeAll(gridId, rowId) {
	var els = $("#" + gridId + " tr[class='Footer'] td[id^='" + gridId + "_vt_']").each(
		function() {
			var field = this.id.substring(gridId.length + 4);
			SysGridTotalize(gridId, field, rowId);
		}
	)
}

function SysGridCheckPaging(gridID) {
	var grid = SysGetElement(gridID);
	var pagesize = SysGet(gridID + "_PageSize");
	if (pagesize != null && pagesize != -1 && grid.rows.length - 4 > pagesize) {
		//Count the real number of rows, so excluding invisible rows
		var rowCount = 0;
		var trs = SysGridVisibleRows(gridID);
		var rows = trs.length;
		for (var i=0;i<rows;i++) {
			var rowid = SysGridRowID(trs[i]);
			if (!SysGridRowIsDeleted(rowid)) {
				rowCount+=1;
			}
		}

		if (rowCount > pagesize) {
			//Rowcount is really greater than the pagesize
			SysGridPaging(gridID + "_PageCtl", "-1");
		}
	}
}

function SysGridAddRows2(tr, gridID, checkpagesize, setfocus, split, clientCopy, insert) {
	var table = tr.closest("table");
	var i = tr.attr("rowIndex");

	var el = new SysElement(gridID + "_LastID");
	var lastID = new Number(el.Value()) + 1;
	el.Value(lastID);
	el = new SysElement(gridID + "_Rows");
	var rowCount = new Number(el.Value()) + 1;
	el.Value(rowCount);

	var newRowNumber = 0; //visible rownumber of new row
	var origrowid = SysGridRowID(tr[0]);
	if (origrowid.length > 0 && split === 0) {
		//Row inserted: set new row number
		newRowNumber = parseInt(new Number(SysGridGetRowNumber(tr[0])));
	}

	var trNew = SysGridAllRows(table, gridID, lastID, tr, rowCount, checkpagesize, split, clientCopy, insert);

	var rowids = SysGridGetRowIds(gridID);

	//Increase rownumbers of this row and all subsequent rows
	if (newRowNumber > 0) {
		SysGridSetRowNumber(trNew[0], newRowNumber);
		var splitKey;
		for (var k = Array.indexOf(rowids, trNew[0].id) + 1; k < rowids.length; k++) {
			var row = SysGetElement(rowids[k]);
			if (!(SysGridSplitKeyId(gridID) && splitKey === SysGridRowSplitKey(gridID, row.id))) {
				newRowNumber += 1;
				splitKey = SysGridRowSplitKey(gridID, row.id);
			}
			SysGridSetRowNumber(row, newRowNumber);
		}
	}

	sysIsGridDirty = true;

	if (setfocus == undefined) {
		setfocus = true;
	}
	if (setfocus) {
		SysGridRowFocus(trNew[0]);
	}

	SysGridTotalizeAll(gridID, trNew[0].id);
}

function SysGridGetRowNumber(tr) {
	return $(tr.cells[0]).find('div').html();
}

function SysGridSetRowNumber(tr, rownr) {
	$(tr.cells[0]).find('div').html(rownr);
}

function SysGridSetRowNumbers(trs, rownr) {
	trs.each(function () {
		SysGridSetRowNumber(this, rownr);
	});
}

function SysGridAddRows(me, gridID, checkpagesize, setfocus, clientCopy) {
	if (me == null) {
		return;
	}
	sysIsGridDirty = true;

	var params = {};
	if (GridValidationFunctions instanceof Array && GridValidationFunctions.length > 0) {
		var funcs = [];
		for (var i = 0; i < GridValidationFunctions.length; i++) {
			funcs.push(GridValidationFunctions[i]);
		}
		FinExecuteFunctions(funcs, params, AddRows);
	}
	else {
		AddRows();
	}

	function AddRows() {
		SysGridAddRows2($(me).closest("tr"), gridID, checkpagesize, setfocus, 0, clientCopy, false);
	}
}

function SysGridRowFocus(tr) {
	for (var c = 0; c < tr.cells.length; c++) {
		var td = tr.cells[c];
		var el = td.firstChild;
		if (SysGridFocusEl(el)) {
			return;
		}
	}
}

function SysGridFocusEl(el) {
	var addNew = $(el).closest(".Grid").attr("id") + "_addnew";
	while(el!=null) {
		$el = $(el);
		if (el.tabIndex >= 0 && ($el.is(":input:visible:enabled") || el.id == addNew)) {
			el.focus();
			$el.select();
			return true;
		}
		el = el.nextSibling;
	}
	return false;
}

function SysGridAddCell(row, html, rowSpan, colSpan, noWrap, txtAlign, rowID, copy, rows, hidden, className, rowCount, tdID) {
	var c = SysInsertCell(row);
	if (rowCount != null) {
		html = html.replace(/_r0wNR/g, rowCount);
	}
	var re = /_rr0w/g;
	html = html.replace(re, "_r" + rowID);

	c.html(html);

	if (tdID != null) {
		tdID = tdID.replace(re, "r" + rowID);
		c.attr("id", tdID);
	}

	c.attr("colspan", colSpan);
	c.attr("rowspan", rowSpan);
	if (noWrap === 1) {
		c.css("white-space", "nowrap");
	}
	switch (txtAlign) {
		case 0:
			if (IE_LEGACY) {
				// in old IE versions the value "inherit" is not supported for style property "text-align"; 
				// set it to default value of this property, i.e. "left"
				c.css("text-align", "left");
			}
			else {
				c.css("text-align", "inherit");
			}
			break;
		case 1:
			c.css("text-align", "left");
			break;
		case 2:
			c.css("text-align", "center");
			break;
		case 3:
			c.css("text-align", "right");
			break;
		case 4:
			c.css("text-align", "justify");
			break;
		default:
			// do nothing
	}
	if (className != null) {
		c.addClass(className);
	}

	SysGridCopy(c[0], rows, copy);

	if (hidden == "1") {
		c.css('display', 'none');
	}
}

function SysGridAddBrowserControl(controlString, rowID) {
	var re = /_rr0w/g;
	new Function(controlString.replace(re, "_r" + rowID))();
}

function SysGridCopy(cT, rows, copy) {
	var rowidF = SysGridRowID(SysGridGetCopyRow(cT, rows));
	var rowidT = SysGridRowID(cT);
	for (var i = 0; i < cT.childNodes.length; i++) {
		var iT = cT.childNodes[i];
		if (iT.id != null) {
			var id = iT.id.replace(rowidT, rowidF);
			var iF = SysGetElement(id);
			if (iF != null && (iT.tagName == "INPUT" || iT.tagName == "SELECT" || iT.tagName == "A")) {
				if (iF.value != null && copy == "1") {
					iT.value = iF.value;
					iT.className = iF.className;
				}
				if (iT.tagName == "A") {
					if (iF.href != null && copy == "1") {
						var text = $("#" + iF.id).text();
						iT.href = iF.href;
						iT.text = text
					}
				}
				iT.disabled = iF.disabled;
				iT.readOnly = iF.readOnly;
			}
		}
	}
}

function SysGridGetCopyRow(cT, rows) {
	var t = cT.parentNode.parentNode.parentNode;
	var rF = t.rows[cT.parentNode.rowIndex - rows];
	while (SysGridRowIsDeleted(rF) || SysGridRowIsSplitTotal(t.id,rF.id)) {
		rows += 1;
		rF = t.rows[cT.parentNode.rowIndex - rows];
	}
	if (cT.parentNode.rowIndex - rows <= 0) {
		//No row above the new one to copy from: try to copy from a row below this one
		rows = 1;
		rF = t.rows[cT.parentNode.rowIndex + rows];
		while (SysGridRowIsDeleted(rF) || SysGridRowIsSplitTotal(t.id, rF.id)) {
			rows += 1;
			rF = t.rows[cT.parentNode.rowIndex + rows];
		}
	}
	return rF;
}

function SysGridShowDelete(rowid, show) {
	var el = SysGridGetElement(rowid, "delete");
	if (el != null) {
		if (show) {
			$(el).show();
		}
		else {
			$(el).hide();
		}
	}
}

function SysGridSetCellVerticalAlignment(gridid, alignment, className) {
	$("#" + gridid + " .GridRow>td").each(function () {
		$(this).css("vertical-align", alignment);
		$(this).addClass(className);
	});
}

function SysGridDelete(gridid, me, func) {
	sysIsGridDirty = true;
	var el = SysGetElement(me + "_Deleted");
	var tr = el.parentNode.parentNode;

	// only delete one single line
	$(tr).each(function () {
		SysSet(this.id + "_Deleted", "on");
		$(this).hide();
		for (var c = 0; c < this.cells.length; c++) {
			var td = this.cells[c];
			for (var i = 0; i < td.childNodes.length; i++) {
				el = td.childNodes[i];
				if (el != null && el.tabIndex != null) {
					el.tabIndex = -1;
					if (el.tagName == "SELECT") {
						$(el).hide();
					}
					else {
					for (var j=0; j < el.childNodes.length; j++) {
							var el2 = el.childNodes[j];
							if (el2 != null && el2.style != null) {
								$(el2).hide();
							}
						}
					}
				}
			}
		}
		if (func != null) {
			var f = new Function("tr", "return " + func + "(tr)");
			f(this);
		}
	});

	if (SysGridAllowSplit(gridid)) {
		var rows = SysGridRows(gridid, tr, false, false);
		if (rows.length > 0) {
			SysGridSetRowSpan(gridid, rows.eq(0), false);
		}
		if (rows.length == 1) {
			var totalRow = $('#' + SysGridRowSplitTotalRowId(gridid, tr.id));
			totalRow.remove();
		}
	}

	SysGridTotalizeAll(gridid, tr.id);

	var table = tr.parentNode.parentNode;
	for (var r1=tr.rowIndex-1; r1>0; r1--)	{
		if (SysGridRowSetFocus(table.rows[r1])) {
			return;
		}
	}
	for (var r2=tr.rowIndex+1; r2<(table.rows.length-2); r2++)	{
		if (SysGridRowSetFocus(table.rows[r2])) {
			return;
		}
	}
	var fa = SysGetElement(gridid + "_addnew");
	if (fa != null) {
		for (var r3=1; r3<(table.rows.length-3); r3++)	{
			if (jQuery(table.rows[r3]).not(".GridRowAdd").is(":not(:hidden)")) {
				return;
			}
		}
		fa.focus();
	}
}

function SysGridRowSetFocus(tr) {
	if (jQuery(tr).is(":not(:hidden)")) {
		for (var c = 0; c < tr.cells.length; c++) {
			var td = tr.cells[c];
			var el = td.firstChild;
			if (el != null && el.id != null && el.id.indexOf("_addnew") == 0 && SysGridFocusEl(el)) {
				return true;
			}
		}
	}
}

function SysGridSetFocus(grd) {
	var t = SysGetElement(grd);
	if (t != null) {
		for (var r = 1; r < t.rows.length - 2; r++) {
			if (SysGridRowSetFocus(t.rows[r])) {
				return;
			}
		}
	}
}

var sysIgnoreFocus = null;
function SysGridOnFocus(el) {
	if (sysIgnoreFocus == el) {
		sysIgnoreFocus = null;
	}
	else if (el.parentNode.tagName == "TD") {
		try {
			SysSet("BCField", el.id);
			SysGridHighLight(el.parentNode, true);
		}
		catch (e) { }

		SysSelect(el);

		if (document.activeElement !== el) {
			el.focus();
		}
	}
}

function SysGridOnBlur(el) {
	if (el.parentNode.tagName == "TD") {
		try {
			SysGridHighLight(el.parentNode, false);
		}
		catch (e) { }
	}
	SysChangeOnBlur(el);
}

function SysGridHighLight(td, bHighLight) {
	if (bHighLight) {
		$(td).addClass("Selected");
		var row = new SysElement(td).Parent(".GridRow");
		SysGridHighLightRow(row.id);
	}
	else {
		$(td).removeClass("Selected");
	}
}

function SysGridHighLightRow(rowId) {
	var grid = new SysElement(rowId).Parent(".Grid");
	var rowHighLight = SysGet(grid.id + "_HighLightFocusedRow");
	if (rowHighLight == 0) {
		return;
	}
	var rowIDs = SysGridGetRowIds(grid.id);
	var row;
	for (var i = 0; i < rowIDs.length; i++) {
		row = new SysElement(rowIDs[i]);
		row.RemoveClass("Selected");
	}
	row = new SysElement(rowId);
	row.AddClass("Selected");
}

function SysGridRowID(el) {
	var tr = el;
	while (tr != null && tr.tagName != "TR") {
		tr = tr.parentNode;
	}
	if (tr.tagName == "TR") {
		return tr.id;
	}
	return null;
}

function SysGridRowIsDeleted(rowid) {
	return (SysGridGet(rowid, "Deleted") == "on");
}

function SysGridGetElementID(rowid, ctl) {
	if (rowid.tagName == "TR") {
		rowid = SysGridRowID(rowid);
	}
	if (!isNaN(rowid)) {
		// assume default grid id of 'grd'
		rowid = "grd_r" + rowid;
	}
	return rowid + "_" + ctl;
}

function SysGridGetElement(rowid, ctl) {
	return SysGetElement(SysGridGetElementID(rowid, ctl));
}

function SysGridGet(rowid, ctl) {
	return new SysElement(SysGridGetElementID(rowid, ctl)).Value();
}

function SysGridGetKey(rowid) {
	return SysGridGet(rowid, "K");
}

function SysGridGetNumber(rowid, ctl) {
	return SysUnFormatNumber(SysGridGet(rowid, ctl));
}

function SysGridGetBoolean(rowid, ctl) {
	var vValue = SysGridGet(rowid, ctl);
	if (vValue == null || vValue === "") {
		vValue = 0;
	}
	if (vValue == true) {
		vValue = -1
	}
	return (vValue == -1);
}

function SysGridSet(rowid, ctl, value) {
	new SysElement(SysGridGetElementID(rowid, ctl)).Value(value);
}

function SysGridSetNumber(rowid, ctl, value, prec) {
	SysGridSet(rowid, ctl, SysFormatNumber(value, prec));
}

function SysGridInsertRow(gridID, rowid) {
	var table = SysGetElement(gridID);
	var tr = SysGetElement(rowid);
	SysGridAddRows2($(tr), gridID, false, true, 0, true, true);
}

//Swap row with the first visible row above it
function SysGridSwapRowsUp(gridID, rowid) {
	var tr1 = SysGetElement(rowid);
	var j = tr1.rowIndex - 1;
	var table = SysGetElement(gridID);
	var tr2 = table.rows[j];

	while (j > 0 && SysGridRowIsDeleted(tr2)) {
		j -= SysGridRows(gridID, tr2, true, true).length;
		tr2 = table.rows[j];
	}
	if (j > 0) {
		SysGridSwapRows(gridID, tr2, tr1);
	}
}

//Swap row with the first visible row below it
function SysGridSwapRowsDown(gridID, rowid) {
	var lastID = new Number(SysGet(gridID + "_LastID")) + 1;
	var tr1 = SysGetElement(rowid);
	var j = tr1.rowIndex + SysGridRows(gridID, tr1, true, true).length;
	var table = SysGetElement(gridID);
	var tr2 = table.rows[j];

	while (tr2.id.length > 0 && SysGridRowIsDeleted(tr2)) {
		j += SysGridRows(gridID, tr2, true, true).length;
		tr2 = table.rows[j];
	}
	if (tr2.id.length > 0) {
		SysGridSwapRows(gridID, tr1, tr2);
	}
}

function SysGridSwapRows(gridID, tr1, tr2) {
	sysIsGridDirty = true;

	var table = SysGetElement(gridID);
	var jtr1 = SysGridRows(gridID, tr1, true, true);
	var jtr2 = SysGridRows(gridID, tr2, true, true);
	jtr1.eq(0).before(jtr2);

	//Swap row numbers
	var rowNumber1 = SysGridGetRowNumber(jtr1[0]);
	var rowNumber2 = SysGridGetRowNumber(jtr2[0]);
	SysGridSetRowNumbers(jtr1, rowNumber2);
	SysGridSetRowNumbers(jtr2, rowNumber1);

	SysGridResetRowIds(gridID);
}

//Returns rowid's as an array
function SysGridGetRowIds(gridID) {
	var rowIDs = SysGet(gridID + "_RowIDs");
	return rowIDs.split(",");
}

//Rebuild rowid's in rowids string
function SysGridResetRowIds(gridID) {
	var el = new SysElement(gridID + "_RowIDs");
	var table = SysGetElement(gridID);
	var newrowids = new Array;
	$(table).find('tr.GridRow').each(function () {
		newrowids.push(this.id);
	});
	el.Value(newrowids.join(','));
	return newrowids;
}

function SysGridNextRowNumber(table) {
	var lastRow = table.find('tr.GridRow:has(td):last');
	return parseInt(SysGridGetRowNumber(lastRow[0])) + 1;
}

function SysGridRows(gridId, tr, includeDeleted, includeTotal) {
	var splitKeyId = SysGridSplitKeyId(gridId);
	if (splitKeyId) {
		// find rows with same split key as current row
		var table = $('#' + gridId);
		var splitKey = SysGridRowSplitKey(gridId, tr.id);
		if (splitKey) {
			var expr = 'tr:has(input[value="' + splitKey + '"])';
			if (!includeDeleted) {
				expr = expr + ':not(:has(input[id^="' + gridId + '_r"][id$="_Deleted"][value="on"]))';
			}
			var rows = table.find(expr);
			if (rows.length > 1 && includeTotal) {
				rows = rows.add($('#' + SysGridRowSplitTotalRowId(gridId, tr.id)));
			}
			return rows;
		}
	}
	return $(tr);
}
function SysGridAllowSplit(gridId) {
	var splitkey = new SysElement(gridId + "_SplitKeyId");
	return !splitkey.IsEmpty();
}
function SysGridRowSplitKey(gridId, rowId) {
	if (rowId) {
		if (SysGridRowIsSplitTotal(gridId,rowId)) {
			// split total row
			return SysGridId2Guid(rowId.substring(gridId.length + 4));
		}
		return $('#' + rowId + '_SK_' + SysGridSplitKeyId(gridId)).val();
	}
	return null;
}
function SysGridRowSplitTotalRowId(gridId, rowId) {
	return gridId + '_st_' + SysGridGuid2Id(SysGridRowSplitKey(gridId, rowId));
}
function SysGridRowSplitTotalColumnId(gridId, rowId, colId) {
	return SysGridRowSplitTotalRowId(gridId, rowId) + '_' + colId;
}
function SysGridRowIsSplitTotal(gridId,rowId) {
	return (rowId.substring(gridId.length, gridId.length + 4) === '_st_');
}
function SysGridSplitRow(gridId, rowId, insert) {
	var splitKey = SysGridRowSplitKey(gridId, rowId);
	if (splitKey != null && splitKey !== '') {
		var tr = new SysElement(rowId);
		SysGridAddRows2(tr.element, gridId, false, true, (insert ? 2 : 1), true, true);
	}
}
function SysGridSplitKeyId(gridId) {
	return SysGet(gridId + "_SplitKeyId");
}
function SysGridCopyData(el) {
	var tr = el.parentNode.parentNode;
	var gridId = $(tr).closest('table')[0].id;
	var rows = SysGridRows(gridId, tr, true, false);
	rows.each(function () {
		if (this.id != tr.id) {
			$('#' + el.id.replace(tr.id,this.id)).val($(el).val());
		}
	});
}
function SysGridGuid2Id(guid) {
	return guid.replace('{', '').replace('}', '');
}
function SysGridId2Guid(id) {
	return '{' + id + '}';
}
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="../SysControls/SysElement.js" />

// Public interface

GridObject.prototype = {

	gridversion: "1.0.0",
	srcElement: null,
	grid: null,
	gridId: "",
	table: null,
	rowFirst: -1,
	rowLast: -1,
	row: null,
	rowId: null,
	rowNr: -1,
	pageSize: 0,
	rowPrefix: "",
	empty: true,
	
	Refresh: function() {
		/// <summary>Re-initialised the grid object, which currently should be done after every update of the grid 
		/// (addition / removal of rows) to keep it in sync.</summary>
		/// <returns type="Undefined">.</returns>
	},
	RowNumber: function(id) {
		/// <summary>Extracts the row number from the supplied id.</summary>
		/// <param name="id" type="String" >An id that conforms to the naming conventions expected by the grid.</param>
		/// <returns type="Number|NaN"></returns>
	},
	SetRow: function(row) {
		/// <summary>Set the current row (i.e. deter.</summary>
		/// <param name="row" type="Number|Any" optional="false">Accepts a row number in which case the corresponding
		/// row is searched for, or any type accepted by SysElement.</param>
		/// <returns type="Boolean">If the requested row is not part of the grid false is returned.</returns>
	},
	SetRowNext: function() {
		/// <summary>Set the next row as the current row.</summary>
		/// <returns type="Boolean">Returns false if the next row can not be set or there is no next row.</returns>
	},
	SetRowPrevious: function() {
		/// <summary>Set the previous row as the current row.</summary>
		/// <returns type="Boolean">Returns false if the previous row can not be set or there is no previous row.</returns>
	}
};

// Mimic public enumerators

// Mimic statics

// Constructor

function GridObject(el) {
	/// <summary>Object that stores information on the currently used grid control.</summary>
	/// <param name="el" type="DOMElement">A DOM element upon which the grid is determined, can be any child element
	/// of the grid.</param>
	/// <field name="gridversion", type="String">Version nr of the object.</field>
	/// <field name="srcElement", type="DOMElement">Contains the element upon which the actual grid was determined.
	/// </field>
	/// <field name="gridId" type="String">Holds the id of the grid.</field>
	/// <field name="table" type="jQuery">The actual table element that makes up the grid.</field>
	/// <field name="rowFirst" type="Number">The row number of the first row, which may be needed in case of paging.
	/// </field>
	/// <field name="rowLast" type="Number">The row number of the last row, which may be needed in case of paging.
	/// </field>
	/// <field name="row" type="jQuery">The current row, use SetRow to set a new active row.</field>
	/// <field name="rowId" type="String">The current row's id.</field>
	/// <field name="rowNr" type="Number">The current row's row number.</field>
	/// <field name="pageSize" type="Number">In case of paging, this determines the page size for the grid.</field>
	/// <field name="rowPrefix" type="String">The part of the any row's id excluding its row number part.</field>
	/// <field name="empty" type="Boolean">Determines if the instance does indeed wrap a grid.</field>

	if (GridObject._initialized === undefined) {

		var _rows;

		GridObject.prototype.Refresh = function() {
			this._Init(this.table);
		};
		
		GridObject.prototype.RowNumber = function(id) {
			return Number(id.substr(this.rowPrefix.length));
		};

		GridObject.prototype.SetRow = function(row) {
			var curRow;
			if (typeof row === "number") {
				curRow = _rows.filter("#" + this.rowPrefix + row);
			}
			else {
				var el = new SysElement(row);
				if (el.element.is(":not(tr)")) {
					curRow = el.element.closest("tr", _rows);
				}
				else if (_rows.index(el.element) !== -1) {
					curRow = el.element;
				}
			}

			if (curRow !== undefined && curRow.length > 0) {
				this._SetRow(curRow);
				return true;
			}
			else {
				this.rowId = "";
				this.rowNr = -1;
				return false;
			}

		};

		GridObject.prototype.SetRowNext = function() {
			if (!this.empty) {
				var idx = _rows.index(this.row);
				if (idx !== -1) {
					if (idx < _rows.length - 1) {
						this._SetRow($(_rows[idx + 1]));
						return true;
					}
				}
			}
			return false;
		};

		GridObject.prototype.SetRowPrevious = function() {
			if (!this.empty) {
				var idx = _rows.index(this.row);
				if (idx !== -1) {
					if (idx > 0) {
						this._SetRow($(_rows[idx - 1]));
						return true;
					}
				}
			}
			return false;
		};

		// Local interface
		GridObject.prototype._Init = function(el) {
			var _el = new SysElement(el);

			if (_el.HasClass("Grid")) {
				this.grid = _el;
				_el = null;
			}
			else {
				this.grid = new SysElement(_el.element.closest(".Grid"));
			}
			this.table = this.grid.element;
			
			if (this.table.length > 0) {
				this.srcElement = this.grid.GetDomElement();
				this.gridId = this.table.attr("id");
				this.rowPrefix = this.gridId + "_r";
				_rows = this.table.find("tr[id^=" + this.rowPrefix + "]");
				this.rowFirst = this.RowNumber(_rows[0].id, this.rowPrefix);
				this.rowLast = this.RowNumber(_rows[_rows.length - 1].id, this.rowPrefix);

				if (this.SetRow(_el || this.rowFirst)) {
					this.pageSize = new SysElement(this.gridId + "_PageSize").Value();
					this.empty = false;
				}
			}
		};

		GridObject.prototype._SetRow = function(row) {
			this.row = row;
			this.rowId = this.row.attr("id");
			this.rowNr = this.RowNumber(this.rowId, this.rowPrefix);
		};

		GridObject._initialized = true;
	};

	// GridObject can serve as a base class and must therefore be able to accept an parameterless constructor
	if (SysElement.IsNotNothing(el)) {
		this._Init(el);
	}
}

// private 'static':
;/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="../SysControls/SysElement.js" />
/// <reference path="../SysControls/SysEvents.js" />

// List View
// ---------
function SysCheckList(listID, columnId) {
	var f = new Function("return lvcCheckChecked" + listID + "_" + columnId + "()")
	return f();
}

function SysListViewCBXChecked(id) {
	var inps = document.getElementsByName(id);
	if (inps == null || inps.length == 0) {
		return false;
	}
	for (i = 0; i < inps.length; i++) {
		var e = inps[i];
		if (e.type == "checkbox" && e.checked) {
			return true;
		}
	}
	return false;
}

function SysListKD(e) {
	try {
		var hdl = new SysHandleKey(e);
		if (hdl.IsAltKey()) {
			if (hdl.GetKey() === SysHandleKey.Key.pageDown) {
				ListNext();
			}
			else if (hdl.GetKey() === SysHandleKey.Key.pageUp) {
				ListPrev();
			}
		}
	}
	catch (e) { }
}
function SysListAddKD(event) {
	SysAttachEvent(document, "onkeydown", function() { SysListKD(event) });
}
function SysListSort(ctl, column, asc) {
	SysSet(ctl + "_sortcolumn", column);
	SysSet(ctl + "_sortorder", asc ? 1 : 0);
}
function SysListToggle(cb, prefix) {
	var checkboxHeader = new SysElement(cb)
	var re = new RegExp(SysReplaceRegEx(prefix), "i");
	$(":checkbox:enabled" + (checkboxHeader.IsChecked() ? ":not(:checked)" : ":checked")).each(function () {
		var checkboxLine = new SysElement(this)
		if (checkboxLine.Attribute("name").search(re) >= 0) {
			if (checkboxLine.IsChecked() != checkboxHeader.IsChecked()) {
				if (UserAgent.IsIE() && UserAgent.version <= 8) {
					$(this).click();
				}
				else {
					checkboxLine.FireEvent("click");
				}
			}
		}
	});
}

function SysListSetHeight(ev, ctlId) {
	/// <summary>This is completely obsolete: any resizing is done by the SysListView object, which in turn is 
	/// automatically created by the listview control.</summary>

	if (SysElement.IsNotNothing(ev)) {
		e = SysEvent(ev);
		e.stopPropagation();
		e.preventDefault();
	}

	var obj = eval("lv" + ctlId);
	if (obj instanceof SysListView) {
		obj.Resize();
	}
}

var sysListPrevRow;
var sysListRuler = true;
var sysUsesOnHoverColumnClass = ".onHoverContainer";
function SysListTable(tr) {
	while (tr != null && tr.tagName != "TABLE") {
		tr = tr.parentNode;
	}
	return tr;
}
function SysListRow(ev) {
	var e = new SysHandleEvent(ev);
	//new SysElement().
	var el = SysSrcElement(ev);
	while (el != null && el.tagName != "TR") {
		el = el.parentNode;
	}
	return el;
}
function SysListOver(ev) {
	if (!sysListRuler) {
		return;
	}
	var el = SysListRow(ev);

	if ($(el).find(sysUsesOnHoverColumnClass) != null && sysListPrevRow != el) {
		SysMenuHide();
	}

	SysListUnSelect(el)
	SysListSelect(el);
}
function SysFindStyleSheetRule(txt) {
	if (document.styleSheets.length == 0) {
		return null;
	}
	var r = (document.styleSheets[0].rules || document.styleSheets[0].cssRules);
	for (var i = 0; i < r.length; i++) {
		if (String(r[i].selectorText).toLowerCase() == txt.toLowerCase()) {
			return r[i];
		}
	}
	return null;
}

var sysListRule = null;
var sysListPrevColor;
function SysListSelect(el) {
	if (el == null) {
		return;
	}
	var e = $(el).filter(".DataDark,.DataLight");
	if (e.length > 0) {
		if (sysListRule === null) {
			sysListRule = SysFindStyleSheetRule("TABLE.ListView TR.Selected");
		}
		sysListPrevRow = el;
		// Should be 'e.css("backgroundColor");', but could not find a location where it actually mattered. The line 
		// below sets sysListPrevColor to an empty string.
		sysListPrevColor = el.style.backgroundColor;
		if (sysListRule !== null && sysListRule.style) {
			var clr = sysListRule.style.backgroundColor;
			SysListSetColor(el, clr);

			$(e).find(sysUsesOnHoverColumnClass).addClass('show');
		}
	}
}

function SysListSetColor(el, clr) {
	var e = $(el);
	SysListSetColorEx(e, clr);
	if (el.className == "DataDark" || el.className == "DataLight") {
		SysListSetColorPrev(e, clr, el.className);
		SysListSetColorNext(e, clr, el.className);
	}
}

function SysListSetColorPrev(e, clr, className) {
	e = e.prev("." + className);
	if (e.length) {
		SysListSetColorEx(e, clr);
		SysListSetColorPrev(e, clr, className);
	}
}
function SysListSetColorNext(e, clr, className) {
	e = e.next("." + className);
	if (e.length) {
		SysListSetColorEx(e, clr);
		SysListSetColorNext(e, clr, className);
	}
}
function SysListSetColorEx(e, clr) {
	e.css("backgroundColor", clr);
	e.children('td').css("backgroundColor", clr);
}
function SysListOut(ev) {
	if (!sysListRuler) {
		return;
	}
	var el = SysListRow(ev);

	if ($(el).find(sysUsesOnHoverColumnClass) != null) {
		SysListUnSelect(el);
		SysListSelect(el);
	}	
}
function SysListUnSelect(el) {
	if (el == null) {
		return;
	}
	if (sysListPrevRow != null) {
		SysListSetColor(sysListPrevRow, sysListPrevColor);
		$(sysListPrevRow).find(sysUsesOnHoverColumnClass).removeClass('show');
	}
	sysListPrevRow = null;
}
function SysListDeActivate(e) {
	SysListUnSelect(SysListRow(e));
}
function SysListActivate(e) {
	var tr = SysListRow(e);
	SysListUnSelect(tr);
	SysListSelect(tr);
	var el = SysSrcElement(e);
	if (el != null && el.tagName == "TD") {
		try {
			el.parentNode.getElementsByTagName("A")[0].focus();
		}
		catch (ex) { }
	}
}
function SysListLoad() {
}

function SysListKeyUp(e) {
	if (SysIsCancelBubble(e)) {
		return;
	}
	var me = SysSrcElement(e);
	if (me.tagName == "SELECT") {
		return;
	}

	var hdl = new SysHandleKey(e);
	if (hdl.IsUpKey() || hdl.IsDownKey()) {
		var td = (me.tagName == "TD") ? me : me.parentNode;
		var row = td.parentNode;
		var tbody = row.parentNode;
		var table = tbody.parentNode;
		var rIndex = row.rowIndex;
		// up
		var bContinue = true;
		if (hdl.IsUpKey()) {
			while (bContinue) {
				rIndex--;
				if (rIndex < 0) {
					return
				}
				bContinue = (jQuery(table.rows[rIndex]).is(":hidden"));
			}
		}
		// down
		else if (hdl.IsDownKey()) {
			bContinue = true;
			while (bContinue) {
				rIndex++;
				if (rIndex >= table.rows.length) {
					return;
				}
				bContinue = (jQuery(table.rows[rIndex]).is(":hidden"));
			}
		}
		row = table.rows[rIndex];
		td = row.cells[(td.cellIndex < row.cells.length) ? td.cellIndex : row.cells.length - 1];
		if (td != null) {
			var el = td.firstChild;
			if ((row.className == "" || row.className.substr(0, 4) == "Data" || row.className == "Selected") && !SysGridFocusEl(el)) {
				td.setActive();
			}
		}
		return true;
	}
	return false;
}
function SysListKeyDown(e) {
	try {
		if (SysListKeyUp(e)) {
			SysCancelBubble(e);
		}
	}
	catch (ex) { }
}
var sysListCol = null;
var sysListColFirst = true;
function SysListColMove(e) {
	e = SysEvent(e);
	var el = $(SysSrcElement(e));
	if (!el.is("th")) {
		el = el.parent("th");
	}
	if (el.length > 0) {
		if (e.offsetX < (el.width() - 5)) {
			el.css("cursor", "auto");
		}
		else {
			el.css("cursor", "col-resize");
			if (e.button == 1) {
				SysListColSetWidths(el);
				sysListCol = el;
				el[0].dragDrop();
			}
		}
	}
}
function SysListColDragStart(e) {
	if (e && e.dataTransfer) {
		e.dataTransfer.effectAllowed = "move";
	}
}
function SysListColDragEnterOver(e) {
	SysStopPropagation(e);
	if (e.dataTransfer) {
		e.dataTransfer.dropEffect = "move";
	}
	SysListColResize(e);
}
function SysListColDrop(e) {
	SysListColResize(e);
}
function SysListColResize(e) {
	e = SysEvent(e);
	if (e.offsetX <= 0) {
		return;
	}

	var el = $(SysSrcElement(e));
	if (!el.is("th")) {
		el = el.parent("th");
	}

	if (sysListCol.length > 0 && el.length > 0) {
		if (sysListCol[0] == el.prev()[0]) {
			SysListColSet(sysListCol, e.offsetX + sysListCol.width())
		}
		else if (sysListCol[0] == el[0]) {
			SysListColSet(sysListCol, e.offsetX)
		}
	}
}
function SysListColSet(c, w) {
	var col = $("#" + "col" + c.attr("id"));
	if (col) {
		var d = col.width() - w;
		col.width(w);
		col = col.next();
		if (col) {
			col.width(col.width() + d);
		}
	}
}
function SysListColDragEnd(e) {
	SysListColGetWidths(sysListCol);
	sysListCol = null;
}
function SysListColSetWidths(c) {
	if (!sysListColFirst) {
		return;
	}
	sysListColFirst = false;
	while (c && c.tagName != "TABLE") {
		c = c.parentNode;
	}
	if (c) {
		var cols = c.getElementsByTagName("COL");
		for (var i = 0; i < cols.length; i++) {
			cols[i].width = cols[i].offsetWidth;
		}
	}
}
function SysListColGetWidths(c) {
	while (c && c.tagName != "TABLE") {
		c = c.parentNode;
	}
	if (c) {
		var w = "";
		var cols = c.getElementsByTagName("COL");
		for (var i = 0; i < cols.length; i++) {
			w += cols[i].id + "," + cols[i].width + ";";
		}
		SysSet(c.id.substring(0, c.id.length - 7) + "_ColumnSizes", w);
		var sn = c.getAttribute("SettingName");
		if (sn) {
			SysCallback("SysCallback.aspx?Action=6&SettingName=" + encodeURIComponent(sn)
				+ "&SettingValue=" + encodeURIComponent(w))
		}
	}
}

function SysListRowNr(e, list) {
	var tr = SysSrcElement(e);
	while (tr != null && tr.tagName != 'TR') {
		tr = tr.parentNode;
	}
	if (tr == null) {
		return null;
	}
	if (tr.id.indexOf(list + "_row_") == 0) {
		return tr.id.substring(list.length + 5);
	}
}
function SysListHeader(ctrlId,event) {
	if (event == 'onmouseover') {
		document.getElementById("imgSort_" + ctrlId).style.visibility = "visible";
	} else {
		document.getElementById("imgSort_" + ctrlId).style.visibility = "hidden";
	}
};/// <reference path="../base/jquery-1.5.1-vsdoc.js" />
/// <reference path="../base/MicrosoftAjax.debug.js" />
/// <reference path="../SysControls/SysElement.js" />

// Matrix functions
function matrixCell(me) {
	var field = me.id; 										//mtx_r1_c1_Amount
	this.matrix = field.substring(0, field.indexOf("_")); 	//mtx
	field = field.substring(this.matrix.length + 1);		//r1_c1_Amount
	this.row = field.substring(0, field.indexOf("_")); 		//r1
	field = field.substring(this.row.length + 1); 			//c1_Amount
	this.column = field.substring(0, field.indexOf("_")); 	//c1
	this.field = field.substring(this.column.length + 1); 	//Amount
}

function SysMatrixTotalize(me) {
	var cell = new matrixCell(me);

	var delta = SysMatrixCalcRowTotal(cell);
	if (delta == null) {
		SysMatrixCalcColumnTotal(cell);
	}
	else {
		SysMatrixSetColumnTotal(cell, delta);
		SysMatrixSetGrandTotal(cell, delta);
	}
}

function SysMatrixCalcRowTotal(cell) {
	/// <summary>Calculates column total</summary>
	/// <returns>Difference between new total and old total</returns>
	/// <remarks>Handles readonly cells correctly</remarks>
	var el = SysGetElement(cell.matrix + "_rt_" + cell.row);
	if (el == null) return null;
	var oldValue = SysUnFormatNumber(SysGetInnerText(el));
	var newValue = SysMatrixCalcTotal("#" + cell.matrix + " tr[id^='" + cell.matrix + "_r']:not(:hidden) input[id^='" + cell.matrix + "_" + cell.row + "_'][id$='_" + cell.field + "']");
	newValue += SysMatrixCalcTotalReadonly("#" + cell.matrix + " tr[id^='" + cell.matrix + "_r']:not(:hidden) span[id^='" + cell.matrix + "_" + cell.row + "_'][id$='_" + cell.field + "']");
	SysSetInnerText(el, SysFormatNumber(newValue));
	return newValue - oldValue;
}

function SysMatrixCalcColumnTotal(cell) {
	/// <summary>Calculates column total</summary>
	/// <returns>Difference between new total and old total</returns>
	/// <remarks>Handles readonly cells correctly</remarks>
	var el = SysGetElement(cell.matrix + "_ct_" + cell.column);
	if (el == null) return null;
	var oldValue = SysUnFormatNumber(SysGetInnerText(el));
	var newValue = SysMatrixCalcTotal("#" + cell.matrix + " tr[id^='" + cell.matrix + "_r']:not(:hidden) input[id$='_" + cell.column + "_" + cell.field + "']");
	newValue += SysMatrixCalcTotalReadonly("#" + cell.matrix + " tr[id^='" + cell.matrix + "_r']:not(:hidden) span[id$='_" + cell.column + "_" + cell.field + "']");
	SysSetInnerText(el, SysFormatNumber(newValue));
	return newValue - oldValue;
}

function SysMatrixCalcTotal(selector) {
	/// <summary>Calculates total of the selected editable input elements</summary>
	var value = 0;

	var els = $(selector).each(
		function () {
			var v = this.value;
			v = SysUnFormatNumber(v);
			if (!isNaN(v)) {
				value += v;
			}
		}
	)

	return value;
}

function SysMatrixCalcTotalReadonly(selector) {
	/// <summary>Calculates total of the selected spans</summary>
	var value = 0;

	els = $(selector).each(
		function () {
			var v = SysGetInnerText(this);
			v = SysUnFormatNumber(v);
			if (!isNaN(v)) {
				value += v;
			}
		}
	)

	return value;
}

function SysMatrixSetColumnTotal(cell, delta) {
	SysMatrixSetTotal(cell.matrix + "_ct_" + cell.column, delta);
}

function SysMatrixSetGrandTotal(cell, delta) {
	SysMatrixSetTotal(cell.matrix + "_gt", delta);
}

function SysMatrixSetTotal(totalCellId, delta) {
	var el = SysGetElement(totalCellId);
	if (el == null) return;
	var oldValue = SysUnFormatNumber(SysGetInnerText(el));
	var value = oldValue + delta;
	SysSetInnerText(el, SysFormatNumber(value));
}

function SysMatrixAddCell(row, html, rowSpan, colSpan, noWrap, txtAlign, rowID, copy, rows, hidden, className, rowCount, tdID) {
	var c = SysInsertCell(row);
	if (rowCount != null) {
		html = html.replace(/_r0wNR/g, rowCount);
	}
	var re = /_rr0w/g;
	html = html.replace(re, "_r" + rowID);

	c.html(html);

	if (tdID != null) {
		tdID = tdID.replace(re, "_r" + rowID);
		c.attr("id", tdID);
	}

	c.attr("colspan", colSpan);
	c.attr("rowspan", rowSpan);
	if (noWrap === 1) {
		c.css("white-space", "nowrap");
	}
	switch (txtAlign) {
		case 0:
			c.css("text-align", "inherit");
			break;
		case 1:
			c.css("text-align", "left");
			break;
		case 2:
			c.css("text-align", "center");
			break;
		case 3:
			c.css("text-align", "right");
			break;
		case 4:
			c.css("text-align", "justify");
			break;
		default:
			// do nothing
	}
	if (className != null) {
		c.addClass(className);
	}

	SysGridCopy(c[0], rows, copy);

	if (hidden == "1") {
		c.hide();
	}
}

function SysMatrixAddBrowserControl(controlString, rowID) {
	var re = /_rr0w/g;
	new Function(controlString.replace(re, "_r" + rowID))();
}

function SysMatrixAddRows(me, matrixId, checkpagesize, setfocus) {
	if (me == null) {
		return;
	}
	sysIsGridDirty = true;

	SysMatrixAddRows2($(me).closest("tr"), matrixId, checkpagesize, setfocus)
}

function SysMatrixAddRows2(tr, matrixId, checkpagesize, setfocus) {
	var table = tr.closest("table");
	var i = tr.attr("rowIndex");
	var lastID = new Number(SysGet(matrixId + "_LastID")) + 1;
	SysSet(matrixId + "_LastID", lastID);
	var rowCount = new Number(SysGet(matrixId + "_Rows")) + 1;
	SysSet(matrixId + "_Rows", rowCount);
	var rowIDs = SysGet(matrixId + "_RowIDs");
	if (SysElement.IsNothing(rowIDs) || rowIDs === "") {
		SysSet(matrixId + "_RowIDs", matrixId + "_r" + lastID);
	}
	else {
		SysSet(matrixId + "_RowIDs", rowIDs + "," + matrixId + "_r" + lastID);
	}

	var func = window['SysMatrixAllRows_' + matrixId];
	if (func != null) {
		func(table, lastID, tr, rowCount);
	}

	if (setfocus == undefined) {
		setfocus = true;
	}
	if (setfocus) {
		var row = table.attr("rows")[i];
		for (var c = 0; c < row.cells.length; c++) {
			var td = row.cells[c];
			var el = td.firstChild;
			if (SysGridFocusEl(el)) {
				return;
			}
		}
	}
}

function SysMatrixShowFavorite(favoriteButtonId, showAsPinned) {
	var favoriteImage = new SysElement(favoriteButtonId + "_image");

	if (showAsPinned) {
		SysMatrixPinFavorite(favoriteImage);
	}
	else {
		SysMatrixUnpinFavorite(favoriteImage);
	}

	favoriteImage.Show();
}

function SysMatrixPinFavorite(favoriteImage) {
	favoriteImage.Attribute("src", "images/pin_pinnedStar.png");
}

function SysMatrixUnpinFavorite(favoriteImage) {
	favoriteImage.Attribute("src", "images/pin_unpinnedStar.png");
}

function SysMatrixToggleFavoritePin(favoriteButton, callbackFunction) {
	var isPinned = SysMatrixFavoriteIsPinned(favoriteButton.id);
	var favoriteImage = new SysElement(favoriteButton.id + "_image");

	if (isPinned === true) {
		SysMatrixUnpinFavorite(favoriteImage);
	}
	else if (isPinned === false) {
		SysMatrixPinFavorite(favoriteImage);
	}

	if (callbackFunction != null) {
		callbackFunction(favoriteButton.id);
	}
};

function SysMatrixFavoriteIsPinned(favoriteButtonId) {
	var isPinned = null;
	var favoriteImage = new SysElement(favoriteButtonId + "_image").Attribute("src");

	if (favoriteImage.indexOf("pin_pinnedStar.png") != -1) {
		isPinned = true;
	} else if (favoriteImage.indexOf("pin_unpinnedStar.png") != -1) {
		isPinned = false;
	}

	return isPinned;
};