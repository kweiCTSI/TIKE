Ext.BLANK_IMAGE_URL = "http://cdn.sencha.io/ext-4.1.1-gpl/resources/themes/images/default/tree/s.gif";
Ext.Ajax.timeout = 300000;
function setPubmedAbstractLayer(c, a, b) {
	if (!document.getElementById(c)) {
		return
	}
	if (a.className.indexOf("toggleButtonShow") != -1) {
		a.className = "toggleButton toggleButtonHide";
		document.getElementById(c).style.display = "none"
	} else {
		a.className = "toggleButton toggleButtonShow";
		document.getElementById(c).style.display = "block";
		Ext.Ajax.request({
			url : "/patric-common/jsp/ajax_pubmed.jsp",
			method : "GET",
			params : {
				rettype : "abstract",
				pubmedId : b
			},
			success : function (d, e) {
				document.getElementById(c).innerHTML = d.responseText
			}
		})
	}
}
function updateCartInfo() {
	Ext.Ajax.request({
		url : "/portal/portal/patric/BreadCrumb/WorkspaceWindow?action=b&cacheability=PAGE&action_type=WSSupport&action=inlinestatus",
		success : function (a, b) {
			Ext.getDom("cart").innerHTML = a.responseText
		}
	})
}
Ext.onReady(updateCartInfo);
function toggleLayer(a) {
	layer = Ext.get(a);
	try {
		if (layer.isDisplayed()) {
			layer.setDisplayed(false)
		} else {
			layer.setDisplayed(true)
		}
	} catch (b) {
		alert(b.message)
	}
}
function toggleBreadcrumb() {
	var a = Ext.get("breadcrumb_btn");
	var b = Ext.query("li.full", Ext.getDom("breadcrumbs"));
	if (a.dom.className.match("toggleButtonShow")) {
		Ext.Array.each(b, function (d, c) {
			Ext.get(d).setDisplayed(false)
		});
		a.removeCls("toggleButtonShow");
		a.addCls("toggleButtonHide")
	} else {
		Ext.Array.each(b, function (d, c) {
			Ext.get(d).setDisplayed(true)
		});
		a.addCls("toggleButtonShow");
		a.removeCls("toggleButtonHide")
	}
}
function search_all_header() {
	if (Ext.String.trim(Ext.getDom("global_search_keyword").value) == "" || Ext.getDom("global_search_keyword").value == "*") {
		Ext.Msg.alert("Warning", "Please enter keyword.")
	} else {
		Ext.Ajax.request({
			url : "/portal/portal/patric/GenomicFeature/GenomicFeatureWindow?action=b&cacheability=PAGE",
			method : "POST",
			params : {
				sraction : "save_params",
				keyword : EncodeKeyword(Ext.getDom("global_search_keyword").value)
			},
			success : function (a) {
				document.location.href = "GlobalSearch?cType=taxon&cId=&dm=&pk=" + a.responseText
			}
		})
	}
}
function EncodeKeyword(a) {
	return a.replace(/\"/g, "%22").replace(/\//g, "%2F").replace(/'/g, "%27").trim().replace(/\:/g, "\\:").replace(/\(/g, "\\(").replace(/\)/g, "\\)").replace(/\[/g, "\\[").replace(/\]/g, "\\]").replace(/\{/g, "\\{").replace(/\}/g, "\\}")
}
function DecodeKeyword(a) {
	return a.replace(/%22/g, '"').replace(/%2F/g, "/").replace(/%27/g, "'").trim().replace(/\\:/g, ":").replace(/\\\(/g, "(").replace(/\\\)/g, ")").replace(/\\\[/g, "[").replace(/\\\]/g, "]").replace(/\\\{/g, "{").replace(/\\\}/g, "}")
}
ConvertNewlineforSolrQuery = function (c) {
	if (c.search(/(\r\n|\r|\n)/gm) > 0) {
		var b = "";
		var d = 0,
		a = true;
		do {
			d = c.search(/(\r\n|\r|\n)/gm);
			if (a == false) {
				b += " OR "
			}
			if (d > 0) {
				b += "(" + c.substr(0, d) + ")"
			} else {
				b += "(" + c + ")"
			}
			c = c.substr(d + 1, c.length);
			a = false
		} while (d > 0);
		return b
	} else {
		return c
	}
};
Ext.override(Ext.selection.CellModel, {
	onSelectChange : function (b, e, d, g) {
		var f = this,
		h,
		c,
		a;
		if (e) {
			h = f.nextSelection;
			c = "select"
		} else {
			h = f.lastSelection || f.noSelection;
			c = "deselect"
		}
		a = h.view || f.primaryView;
		if ((d || f.fireEvent("before" + c, f, b, h.row, h.column)) !== false && g() !== false) {
			if (e) {
				a.onCellSelect(h)
			} else {
				a.onCellDeselect(h);
				delete f.selection
			}
			if (!d) {
				f.fireEvent(c, f, b, h.row, h.column)
			}
		}
	}
});
