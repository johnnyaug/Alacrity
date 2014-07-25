var storageData;
var isBreak = false;
// set in main.js
var breaktime;
var closeTabsAfter = 60000; // ms
var closeTimer, breakOverTimer;
var closeTimerSetTime;
var storageKeys = ['domainList', 'breakLengthMin', 'breakFreqMin'];
chrome.storage.local.get(storageKeys, function(data) {
	storageData = data;
});
chrome.storage.onChanged.addListener(function(items) {
	storageKeys.forEach(function(key) {
		if (items[key]) {
			storageData[key] = items[key].newValue;
		}
	})
});

function isForbidden(url) {
	if (!url || !storageData.domainList) {
		return false;
	}
	return storageData.domainList.some(function(domain) {
		return url.indexOf(domain) > -1;
	})
}

function closeMe() {
	chrome.windows.getAll(null, function(wins) {
		var i;
		wins.forEach(function(win) {
			chrome.tabs.getAllInWindow(win.id, function(tabs) {
				tabs.forEach(function(tab) {
					if (isForbidden(tab.url)) {
						chrome.tabs.remove(tab.id);
					}
				});
			});
		});
	});
}

function startBreak(tab) {
	isBreak = true;
	
	if (tab) {
		chrome.tabs.sendMessage(tab.id, {
			startBreak: true
		}, function() {});
	}

	breakOverTimer = setTimeout(function() {
		breakOver();
	}, storageData.breakLengthMin * 60000);
	chrome.browserAction.setBadgeBackgroundColor({color: "#66FF00"});
}

function breakOver() {
	isBreak = false;
	breaktime = parseInt(new Date().getTime()) + storageData.breakFreqMin * 60000;
	chrome.browserAction.setBadgeBackgroundColor({color: "#990000"});
}

/**
 *	Set an interval after which all evil tabs are closed, assuming such timer doesn't exist.
 *	if ms is null, clears and nulls existing timer instead.
 *	if override is true, sets the timer instead of existing one.
 */
function setTabCloseTimer(ms, override) {
	if (!ms) {
		clearTimeout(closeTimer);
		closeTimer = null;
		return;
	}

	if (!override) {
		if (closeTimer != null) {
			return;
		}
	} else {
		clearTimeout(closeTimer);
	}

	closeTimer = setTimeout(function() {
		try {
			closeMe();
		} finally {
			clearTimeout(closeTimer);
			closeTimer = null;
		}
	}, ms);
	closeTimerSetTime = new Date().getTime();
}

function checkTab(tab) {
	if (workMode === false || isBreak) { 
		return;
	}
	var currentTime = new Date();
	console.log(breaktime);
	if (!isBreak && breaktime >= currentTime.getTime() && isForbidden(tab.url)) {
		chrome.tabs.sendMessage(tab.id, {
			showWarning: true,
			workMode: workMode
		}, function() {});

		if (workMode == "1" || workMode == "2") {
			setTabCloseTimer(closeTabsAfter);
		}
	} else {
		if (isForbidden(tab.url)) {
			startBreak(tab);
		}
	}
}

function checkTabById(tabId) {
	chrome.tabs.get(tabId, checkTab);
}

function checkTabByObject(tab) {
	chrome.tabs.get(tab.tabId, checkTab);
}

function killTimers() {
	clearTimeout(closeTimer);
	clearTimeout(breakOverTimer);
	closeTimer = null;
	isBreak = false;
}

chrome.tabs.onUpdated.addListener(checkTabById);
chrome.tabs.onActivated.addListener(checkTabByObject);
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.closeTabs) {
			closeMe();
			setTabCloseTimer(false);
		} else if (request.getTabCloseTime) {
			if (!closeTimerSetTime || closeTimerSetTime + closeTabsAfter < new Date().getTime()) {
				sendResponse(null);
			}
			sendResponse({
				seconds: Math.ceil((closeTimerSetTime + closeTabsAfter - new Date().getTime()) / 5000) * 5
			});
		}
	});