$(function() {
	$('#closeTabs').click(function() {
		chrome.runtime.sendMessage({
			closeTabs: true
		}, function() {});
	});
	function updateClosingTime() {
		chrome.runtime.sendMessage({
			getTabCloseTime: true
		}, function(response) {
			if (response != null ) {
				$('#closeTabsAfter').text(response.seconds);
			}
		});
	}
	setInterval(updateClosingTime, 5000);
	updateClosingTime();
});