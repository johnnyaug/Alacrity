
var storageData;

chrome.storage.local.get('isSetup', function(result) {
	if (!result.isSetup) {
		location.href="setup.html";
	}
});
$(document).ready(function() {
	$('#clearStorage').click(function() {
		chrome.storage.local.clear();
	})

	$('#domainSelection').tagit();
	chrome.storage.local.get(['studystate', 'domainList', 'defaultStudyState', 'breakLengthMin', 'breakFreqMin'], function(data) {
		storageData = data;
		if (!storageData.studystate || storageData.studystate == false) {
			$("#stop").hide();
		} else {
			$("#prefs").css("display", "none");
		}
		$("#level" + storageData.defaultStudyState).attr("checked", "checked");

		if (storageData.breakFreqMin != null) {
			$("#breakfreq").val(storageData.breakFreqMin);
		}
		if (storageData.breakLengthMin != null) {
			$("#breaklength").val(storageData.breakLengthMin);
		}
		if (storageData.domainList) {
			storageData.domainList.forEach(function(domain) {
				$('#domainSelection').tagit('createTag', domain);
			})
		}
	});


	$("#start").click(function() {
		if(storageData.studystate) {
			// STOP:
			chrome.extension.getBackgroundPage().killTimers();
			$("#prefs").toggle("slow");
			chrome.storage.local.set({
					studystate: false
				},
				function() {
					chrome.browserAction.setTitle({title: "Alacrity"});
					chrome.browserAction.setBadgeText({text: ""});
				});
		}
		else {
			// START:
			$("#error").html("");
			$("#prefs").toggle("slow");

			chrome.extension.getBackgroundPage().breaktime = new Date().getTime() + $('#breakfreq').val() * 60000;
			console.log(chrome.extension.getBackgroundPage().breaktime);
			chrome.storage.local.set({
					studystate: $("input:radio[name=level]:checked").val(),
					domainList: $("#domainSelection").val().split(','),
					breakLengthMin: $("#breaklength").val(),
					breakFreqMin: $('#breakfreq').val()
				},
				function() {
					chrome.browserAction.setTitle({title: "Alacrity - Work Mode"});
					chrome.browserAction.setBadgeText({text: " "});
					chrome.browserAction.setBadgeBackgroundColor({color: "#990000"});
				});
		}
	});
});