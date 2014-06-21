function updateTime() {
	var whenMilli=chrome.extension.getBackgroundPage().nextBreak();
	var mins,secs;
	if ( whenMilli < 0 ) {
		mins=0;
		secs=0;
	}
	else {
		var whenBreak=new Date(chrome.extension.getBackgroundPage().nextBreak());
		var mins=whenBreak.getMinutes();
		var secs=whenBreak.getSeconds();
	}
	$("#when").html( (mins<10 ? '0':'') + mins + ":" + (secs<10?'0':'')+ secs );
	setTimeout("updateTime()",1000);
}
//setTimeout("updateTime()",1000);
