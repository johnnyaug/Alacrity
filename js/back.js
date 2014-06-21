var storageData;
var isbreak = false;
// set in main.js
var breaktime;
var closeTabsAfter = 60000; // ms
var startBreakTimer, closeTimer, breakOverTimer;
var closeTimerSetTime;
var storageKeys = ['studystate', 'domainList', 'breakLengthMin', 'breakFreqMin'];
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
	isbreak = true;
	
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
	isbreak = false;
	breaktime = parseInt(new Date().getTime()) + storageData.breakFreqMin * 60000;
	chrome.browserAction.setBadgeBackgroundColor({color: "#990000"});
}

function showWarning(isFlexible) {
	//TODO use isFlexible
	chrome.notifications.create('warningNortif', {
		type: 'basic',
		//iconUrl : '../resources/logo_st.png',
		title: 'Ahm. It\'s not break time yet.',
		message: 'Click to close irrelevant tabs.<br>Your break is in ## minutes.'
	}, function() {});
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
	var currentTime = new Date();
	if (!isbreak && breaktime >= currentTime.getTime() && isForbidden(tab.url)) {
		chrome.tabs.sendMessage(tab.id, {
			showWarning: true,
			studystate: storageData.studystate
		}, function() {});

		if (storageData.studystate == "2" || storageData.studystate == "3") {
			setTabCloseTimer(closeTabsAfter);
		}
	} else {
		if (isForbidden(tab.url)) {
			startBreak(tab);
		}
	}
}

function checkTabById(tabId) {
	if (storageData.studystate == "false" || isbreak)
		return;
	chrome.tabs.get(tabId, checkTab);
}

function checkTabByObject(tab) {
	if (storageData.studystate == "false" || isbreak)
		return;
	chrome.tabs.get(tab.tabId, checkTab);
}

function killTimers() {
	clearTimeout(startBreakTimer);
	clearTimeout(closeTimer);
	clearTimeout(breakOverTimer);
	closeTimer = null;
	isbreak = false;
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