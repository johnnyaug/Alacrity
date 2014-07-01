var shown = false,
	warningShower = new WarningShower();
$(function() {
	$('body').append('<div id="alacrityErrorModal" src=""><iframe id="alacrityIFrame"></iframe></div>');
});

function showWarning(request) {
	if (request.studystate === '2') {
		warningShower.show(chrome.extension.getURL("html/warning2.html"), true);
	} else if (request.studystate === '3') {
		warningShower.show(chrome.extension.getURL("html/error.html"), false);
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