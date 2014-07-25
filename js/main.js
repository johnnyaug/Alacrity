var storageData;
chrome.storage.local.get('isSetup', function(result) {
	if (!result.isSetup) {
		location.href="setup.html";
	}
});

$(document).ready(function() {
	$("#start").click(function() {
		var workMode = chrome.extension.getBackgroundPage().workMode;
		if(workMode) {
			// STOP:
			chrome.extension.getBackgroundPage().workMode = false;
			chrome.extension.getBackgroundPage().killTimers();
			chrome.browserAction.setTitle({title: "Alacrity"});
			chrome.browserAction.setBadgeText({text: ""});
		}
		else {
			// START:
			console.log($("input:radio[name=workMode]:checked").val());
			chrome.storage.local.get(['breakFreqMin','defaultStudyState'], function(storageData) {
				chrome.extension.getBackgroundPage().breaktime = new Date().getTime() + storageData.breakFreqMin * 60000;
				chrome.extension.getBackgroundPage().workMode = storageData.defaultStudyState;
				chrome.browserAction.setBadgeText({text: " "});
				chrome.browserAction.setTitle({title: "Alacrity - Work Mode"});
				chrome.browserAction.setBadgeBackgroundColor({color: "#990000"});
			});
		}
	});
});