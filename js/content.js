var shown = false,
	warningShower = new WarningShower();

function showWarning(request) {
	console.log(request.workMode);
	if (request.workMode === '0') {
		warningShower.show(chrome.extension.getURL("html/warning.html"), true);
	} else if (request.workMode === '1') {
		warningShower.show(chrome.extension.getURL("html/warning2.html"), true);
	} else if (request.workMode === '2') {
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