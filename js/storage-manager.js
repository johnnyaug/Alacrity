function StorageManager() {
  	if ( arguments.callee._singletonInstance )
    	return arguments.callee._singletonInstance;
  	arguments.callee._singletonInstance = this;

	const DEFAULT_KEYS = ['domainList', 'defaultStudyState', 'breakLengthMin', 'breakFreqMin'];
	var storageData ;
	this.updateStorage = function updateStorage(cb) {
		chrome.storage.local.get(DEFAULT_KEYS, function(data) {
			storageData = data;
			if (cb) {
				cb(storageData);
			}
		});
	};
	this.getStorage = function getStorage(cb) {
		if (!cb) {
			return;
		}
		if(!storageData) {
			updateStorage(cb);
		}
		else {
			cb(storageData);
		}
	};

	this.setStorage = function setStorage(obj, cb) {
		chrome.storage.local.set(obj, function() {
			updateStorage(cb)
		});
	};
	return this;
};
StorageManager().updateStorage();