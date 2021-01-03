var scrollDis = 0,
	bgHeight = 0,
	scrollAmount = 0,
	section1ScrollCount = 0,
	clientH = 0,
	curScrollTop = 0;
var zooming = false;
var bgScroller = document.getElementsByClassName("section1-bg-4")[0];
var section2 = document.getElementById("section2");
var section3 = document.getElementById("section3");
var section1ScrollTimer;
var headBarItemAnimTimer = null;
var curHeadBarItem = "";
var scrollBarLength = 0;

scrollUnique(document.getElementById("side-menu-wrapper"));

window.onload = function() {
	// document.getElementById('bgm-player').play();
	bgHeight = document.getElementById("section1").clientHeight;
	clientH = getClientHeight();
	scrollBarLength = document.body.clientHeight;
	curScrollTop = scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	headBarVisiable();

	document.onselectstart = function() {
		return false;
	}; //取消字段选择功能

	// (function () {
	// 	window.onscroll = function(ev) {
	// 		// scrollAmount += ev.deltaY;
	// 		var temp = scrollAmount + getScrollPos();
	// 		var buildingBg = document.getElementsByClassName("section4-bg-2")[0];
	// 		var delta = temp / bgHeight * 100 + 100;
	// 		buildingBg.style.backgroundSize = delta + "% " + "100%";
	// 	}

	// 	bgScroller.onscroll = function(ev) {
	// 		// console.log(scrollAmount)
	// 		scrollAmount = bgScroller.scrollTop;
	// 		// if(scrollAmount < bgHeight && scrollAmount>=0) {
	// 		// 	ev.preventDefault();
	// 		// }
	// 		var buildingBg = document.getElementsByClassName("section4-bg-2")[0];
	// 		// scrollDis = getScrollPos();
	// 		var delta = scrollAmount / bgHeight * 100 + 100;

	// 		buildingBg.style.backgroundSize = delta + "% " + "100%";
	// 	}
	// })(window);

	bgScroller.onwheel = function(ev) {
		var scrollDirSymbol = scrollDir(ev);
		if (scrollDirSymbol == 1 && !zooming) {
			window.scrollTo({
				top: 0,
				behavior: "smooth"
			});
			return false;
		}
		if (scrollDirSymbol == -1 || zooming) {
			ev.preventDefault();
		}
		if (true) {
			if (scrollDirSymbol == -1 && !zooming && (curScrollTop >= 0 || curScrollTop < bgHeight)) {
				zooming = true;
				var buildingBg = document.getElementsByClassName("section1-bg-2")[0];
				buildingBg.style.animationDelay = "0";
				buildingBg.style.animation = "zoomIn 1s forwards";

				if (section1ScrollTimer == null) {
					section1ScrollTimer = setTimeout(() => {
						window.scrollTo({
							top: bgHeight,
							behavior: "smooth"
						});
						zooming = false;
						section1ScrollTimer = null;
					}, 1000);
				}
			}
		}
	}

	section2.onwheel = function(ev) {
		ev.preventDefault();
		var scrollDirSymbol = scrollDir(ev);

		if (zooming) {
			return false;
		}

		if (scrollDirSymbol == 1) {
			zooming = true;
			console.log(curScrollTop);
			var buildingBg = document.getElementsByClassName("section1-bg-2")[0];

			if (section1ScrollTimer == null) {
				setTimeout(() => {
					window.scrollTo({
						top: 0,
						behavior: "smooth"
					});
					buildingBg.style.animationDelay = "700ms";
					buildingBg.style.animation = "zoomOut 1s forwards";
					zooming = false;
				}, 500);
			}
		} else {
			zooming = true;
			// console.log(curScrollTop);
			var srollDis = bgHeight + section2.clientHeight;

			if (section1ScrollTimer == null) {
				setTimeout(() => {
					window.scrollTo({
						top: srollDis,
						behavior: "smooth"
					});
					zooming = false;
				}, 500);
			}
		}
	}

	section3.onwheel = function(ev) {
		var scrollDirSymbol = scrollDir(ev);
		if (zooming) {
			ev.preventDefault();
			return false;
		}

		if (scrollDirSymbol == 1 && curScrollTop <= (bgHeight + section2.clientHeight - ev.deltaY)) {
			ev.preventDefault();
			zooming = true;
			// console.log(curScrollTop);

			if (section1ScrollTimer == null) {
				setTimeout(() => {
					window.scrollTo({
						top: bgHeight,
						behavior: "smooth"
					});
					zooming = false;
				}, 500);
			}
		}
	}

	window.onwheel = (ev) => {
		// if(curScrollTop > bgHeight) {
		// 	return
		// }
		// if (section1ScrollTimer) {
		// 	section1ScrollTimer = null;
		// }
		// section1ScrollCount++;
		// section1ScrollTimer = setTimeout(() => {
		// 	section1ScrollCount = 0;
		// }, 500);
	}

	window.document.body.onscroll = bodyScroll;
}

function getScrollPos() {
	var scrollPos;
	if (window.pageYOffset) {
		scrollPos = window.pageYOffset;
	} else if (document.compatMode && document.compatMode != 'BackCompat') {
		scrollPos = document.documentElement.scrollTop;
	} else if (document.body) {
		scrollPos = document.body.scrollTop;
	}
	return scrollPos;
}

function scrollDir(e) {
	e = e || window.event;
	if (e.wheelDelta) { //判断浏览器IE，谷歌滑轮事件
		if (e.wheelDelta > 0) { //当滑轮向上滚动时
			return 1;
		}
		if (e.wheelDelta < 0) { //当滑轮向下滚动时
			return -1;
		}
	} else if (e.deltaY) { //Firefox滑轮事件
		if (e.deltaY > 0) { //当滑轮向下滚动时
			return -1;
		}
		if (e.deltaY < 0) { //当滑轮向上滚动时
			return 1;
		}
	}
	return 0;
}

function disableScroll() {
	// Get the current page scroll position 
	scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,

		// if any scroll is attempted, set this to the previous value 
		window.onscroll = function() {
			window.scrollTo(scrollLeft, scrollTop);
		};
}

function enableScroll() {
	window.onscroll = bodyScroll;
}


function getClientHeight() {
	var clientHeight = 0;
	if (document.body.clientHeight && document.documentElement.clientHeight) {
		var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight :
			document.documentElement.clientHeight;
	} else {
		var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight :
			document.documentElement.clientHeight;
	}
	return clientHeight;
}


function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
}

function bodyScroll() {
	curScrollTop = scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	var disToBottom = Math.floor(document.body.scrollHeight - (curScrollTop + scrollBarLength));
	if (disToBottom == 0) {
		console.log("reach bottom")
	}
	var buildingBg = document.getElementsByClassName("section1-bg-2")[0];
	if (curScrollTop == 0) {
		buildingBg.style.animation = "zoomOut 1s forwards";
		console.log("reset zooming");
		zooming = false;
		section1ScrollTimer = null;
	}

	// if(Math.round(curScrollTop) == bgHeight) {
	// 	disableScroll();
	// 	console.log("disableScroll")
	// 	setTimeout(()=>{
	// 		console.log("enable")
	// 		enableScroll();
	// 	},500);
	// }

	headBarVisiable();
}

function headBarVisiable() {
	if (Math.ceil(curScrollTop) >= bgHeight) {
		document.getElementById("header-bar").style.visibility = "hidden";
	} else {
		document.getElementById("header-bar").style.visibility = "visible";
	}
}

// function getScrollDir() {
// 	var t = document.documentElement;
// 	var d = window.pageYOffset || t.scrollTop || document.body.scrollTop || 0;
// 	return (d > 10)
// }
