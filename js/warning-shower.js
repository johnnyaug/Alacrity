function WarningShower() {
	this.show = function(url, canClose) {
/*		$('#alacrityIFrame').attr('src', url);
		$("#alacrityErrorModal").dialog({
			resizable: canClose,
			draggable: canClose,
			modal: true,
			autoOpen: false,
			width: $(window).width() * 0.8,
			height: $(window).height() * 0.8,
			open: function(event, ui) {
				$(".ui-dialog-titlebar-close").toggle(canClose);
			},
			closeOnEscape: canClose,
			buttons: canClose && [{text:'Got It'}]
		});
		$('#alacrityErrorModal').dialog("open");*/
		$.nmManual(url, {
			modal: !canClose,
			closeOnEscape: canClose,
			closeOnClick: canClose,
			useKeyHandler: canClose,
			showCloseButton: canClose ,
			callbacks: {
				initFilters: function(nm) {
					nm.filters.push('link');
					nm.filters.push('iframe');
				}
			}
		});
	}
}