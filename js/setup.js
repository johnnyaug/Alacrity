var steps = 2,
currentStep = 1;
$(function() {
	function updateProgress() {
		$('.progress-bar').each(function() {
			$(this).css('width', (currentStep / steps)*100+'%');
			$(this).attr('aria-valuemax', steps);
			$(this).attr('aria-valuenow', currentStep);
			$('.currentStep').text('Step ' + currentStep + ' / ' + steps + ': ');
		});
	}
	updateProgress();
	$('#domainSelection').tagit({
		afterTagRemoved: function(event, ui) {
			$('#domainSuggestions button[value="'+ ui.tagLabel.toLowerCase() +'"]').show('slow');
		},
		afterTagAdded: function(event, ui) {
			$('#domainSuggestions button[value="'+ ui.tagLabel.toLowerCase() +'"]').hide('slow');
		}
	});
	$('#studystates button').click(function() {
		chrome.storage.local.set({
			defaultStudyState: $(this).val()

		}, function() {
			$('#step1').hide();
			$('#step2').show();
			$('.ui-widget-content').focus();
			currentStep++;
			updateProgress();
		});
	});
	$('#domainSuggestions button').click(function() {
		$('#domainSelection').tagit('createTag', $(this).val());
	});

	$('#domainSelection').change(function() {
		$('#step2Next').prop('disabled', $(this).val() == '');
	});

	$('#step2Next').click(function() {
		chrome.storage.local.set({
			domainList: $("#domainSelection").val().split(','),
			isSetup: true
		}, function() {
			$('#step2').hide();
			currentStep++;
			updateProgress();
			location.href="popup.html";
		});
	});
});