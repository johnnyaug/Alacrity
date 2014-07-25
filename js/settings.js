const STORAGE_ID_BY_FIELD_ID = {
	'break-length': 'breakLengthMin',
	'break-frequency': 'breakFreqMin'
}

var storageManager = StorageManager();

function fieldValueToText(fieldName, value) {
	switch (fieldName) {
		case 'break-length':
			return value + ' minutes';
		case 'break-frequency':
			return 'Every ' + value + ' minutes';
	}
	return value;
}
var addingExistingTags = false;

/**
 * Populate viewers and editors with storage data.
 */
function loadStorageValues() {
	storageManager.getStorage(function(data) {
		addingExistingTags = true;
		// domain list
		if (data.domainList) {
			data.domainList.forEach(function(domain) {
				$('#domainSelection').tagit('createTag', domain);
			});
		}
		addingExistingTags = false;
		// work mode
		console.log(data.defaultStudyState);
		$('input:radio[name="workMode"][value=' + data.defaultStudyState + ']').attr('checked', 'checked');

		// all other fields
		for (var key in STORAGE_ID_BY_FIELD_ID) {
			if (STORAGE_ID_BY_FIELD_ID.hasOwnProperty(key)) {
				$('#' + key + ' input').val(data[STORAGE_ID_BY_FIELD_ID[key]]);
			}
		}

		// take view values from editor values:
		$('.form-field').each(function() {
			$(this).children('.form-control-static').text(fieldValueToText($(this).attr('id'), $(this).children('.form-control').val()));
		});
	});
}
function initSaveEvents() {
	function updateDomainList(event, ui) {
		if (addingExistingTags) {
			return;
		}
		console.log($('#domainSelection').val());
		storageManager.setStorage({
			domainList: $('#domainSelection').val().split(',')
		});
	}
	function startEdit(element) {
		$('.form-field').each(function() {
			$(this).addClass("view-mode");
			$(this).removeClass("edit-mode");
		});

		element.addClass("edit-mode");
		element.removeClass("view-mode");
		element.children('.form-control').focus();
	}

	$('#domainSelection').tagit({
		afterTagRemoved: updateDomainList,
		afterTagAdded: updateDomainList
	});

	$('.form-field').click(function() {
		if ($(this).hasClass('view-mode')) {
			startEdit($(this));
		}
	});
	$('.form-field .form-control').blur(function() {
		var elementId = $(this).parent().attr('id');
		$(this).siblings('.form-control-static').text(fieldValueToText(elementId, $(this).val()));

		if (STORAGE_ID_BY_FIELD_ID[elementId]) {
			var storageObject = {};
			storageObject[STORAGE_ID_BY_FIELD_ID[elementId]] = $(this).val()
			storageManager.setStorage(storageObject, function() {
				$('.form-field').addClass("view-mode").removeClass("edit-mode");
			});
		}
	});
	$('.form-field').append('<a class="edit-button glyphicon glyphicon-pencil" href="#"/>')
	$('.form-field').addClass("view-mode");
	$('.form-field').removeClass("edit-mode");
	$('input:radio[name="workMode"]').change(function() {
		storageManager.setStorage({
			defaultStudyState: this.value
		});
	});
}
$(function() {
	loadStorageValues();
	initSaveEvents();

	$('#clearStorage').click(function() {
		chrome.storage.local.clear(function() {
			location.reload();
		});
	});
});