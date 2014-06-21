var shown = false;

function showWarning(request) {
	if ((request.studystate === '2' || request.studystate === '1') && !shown) {
		shown = true;
		$.colorbox({
			'href': chrome.extension.getURL('html/warning2.html'),
			'iframe': true,
			'width': '80%',
			'innerHeight': '300px',
			'fixed': true
		});
		$('#cboxContent').css('background', '#F6F8D3');
		$('#colorbox').css('z-index', '2147483647');
		$('#cboxOverlay').css('z-index', '2147483647');
		setTimeout(function() {
			shown = false
		}, 20000);

	} else if (request.studystate === '3') {
		$.colorbox({
			'href': chrome.extension.getURL('html/error.html'),
			'iframe': true,
			'width': '80%',
			'innerHeight': '450px',
			'escKey': false,
			'overlayClose': false,
			'closeButton': false,
			'trapFocus': true,
			'fixed': true
		});
		$('#cboxContent').css('background', '#F6F8D3');
		$('#colorbox').css('z-index', '2147483647');
		$('#cboxOverlay').css('z-index', '2147483647');
	}
}

function startBreak(request) {
	$.colorbox({
		'href': chrome.extension.getURL('html/break-started.html'),
		'iframe': true,
		'width': '80%',
		'innerHeight': '300px',
		'fixed': true
	});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.showWarning) {
		showWarning(request);
	} else if (request.startBreak) {
		startBreak(request);
	}
});