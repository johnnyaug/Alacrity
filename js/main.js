var storageData;
chrome.storage.local.get('isSetup', function(result) {
	if (!result.isSetup) {
		location.href="setup.html";
	}
});

$(document).ready(function() {
	$("#start").click(function() {
		var workMode = chrome.extension.getBackgroundPage().workMode;
		console.log(workMode);
		if(workMode) {
			// STOP:
			chrome.extension.getBackgroundPage().workMode = false;
			chrome.extension.getBackgroundPage().killTimers();
			chrome.browserAction.setTitle({title: "Alacrity"});
			chrome.browserAction.setBadgeText({text: ""});
		}
		else {
			// START:
			$("#error").html("");
			chrome.storage.local.get('breakFreqMin', function(storageData) {
				chrome.extension.getBackgroundPage().breaktime = new Date().getTime() + storageData.breakFreqMin * 60000;
				chrome.extension.getBackgroundPage().workMode = $("input:radio[name=workMode]:checked").val(),
				chrome.browserAction.setTitle({title: "Alacrity - Work Mode"});
				chrome.browserAction.setBadgeText({text: " "});
				chrome.browserAction.setBadgeBackgroundColor({color: "#990000"});
			});
		}
	});
});