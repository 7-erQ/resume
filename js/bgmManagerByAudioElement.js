let audioPlayer = document.getElementById("audio-player");
audioPlayer.volume = 0.5

// const analyser = ctx.createAnalyser(); // 快速傅里叶变换的一个参数
// analyser.fftSize = 512; // fftSize 的要求是 2 的幂次方。数字越大，得到的结果越精细。

var musicList = ["Mind Over Matter-PVRIS", "All My Life - WILD", "Dirty Paws - Of Monsters And Men", "Exhale - Slotown",
	"Goin' Back (feat. Zac Barnett) - WILD,Zac Barnett", "Hard Times - Paramore", "Home - 王诗安", "JHR出撃マーチ - 高山成孝",
	"Last Hope - Paramore", "Nice to See You - Vansire,Floor Cry", "Older - Sasha Sloan", "Only Love - PVRIS",
	"Only Love (Acoustic) - PVRIS", "Set for Life - Trent Dabbs", "Shots (Broiler Remix) - Imagine Dragons, Broiler",
	"Soaked Through - Sara", "Stay Alive - José González", "Wait - M83", "Wait (Kygo Remix) - Kygo,M83", "warm blood (messyhair remix) - Flor",
	"you and i - barnes blvd", "丑八怪 - amy_chanrich", "万事屋ブルース - 灰津尾出男", "终点起点 - LOKEY低调组合"
];

(function(){
	var randomNum1 = Math.floor(Math.random() * 2); // 0~1
	var iStart1 = musicList.indexOf("Only Love - PVRIS");
	musicList.splice(iStart1 + randomNum1,1);
	
	var randomNum2 = Math.floor(Math.random() * 2);
	var iStart2 = musicList.indexOf("Wait - M83");
	musicList.splice(iStart2 + randomNum2,1);
}())

var curMusicIndex = 0;

function initPlayer(player, src, play) {
	player.src = src;
	if (play) {
		audioPlayer.play();
	}
}

// =================================基础功能======================================================
document.getElementById("vol-ctr").addEventListener("click", function() {
	if(audioPlayer.volume != 0) {
		audioPlayer.volume = 0;
		this.children[0].innerHTML = "&#xe601;";
	}else {
		audioPlayer.volume = 0.5
		this.children[0].innerHTML = "&#xe600";
	}
})

// =================================滚动歌词======================================================
var curLyric = {};
var curLyricKeys = [];
var curLineNo = 0;
var lastLineNo = 0;
var topNum = 0;
var fraction = 0.5;

var lyricsWrapper = document.getElementById("lyrics-container");
scrollUnique(lyricsWrapper);
var lyricsUl = document.getElementById("lyrics-ul");

function initLyrics(url) {
	curLyric = {};
	curLyricKeys = [];
	curLineNo = 0;
	lastLineNo = 0;
	topNum = 0;
	fraction = 0.5;
	lyricsUl.innerHTML = ""

	getLyricsJson(url, (res) => {
		var temp = JSON.parse(res)
		curLyric = createLrc(temp.merge)
		curLyricKeys = Object.keys(curLyric);
		curLineNo = getCurLine(audioPlayer, curLyricKeys)
	});
}

function getLyricsJson(url, callback) {
	let xhr = new XMLHttpRequest();
	xhr.overrideMimeType("application/json");
	xhr.open("GET", url, true);
	if (xhr.readyState) { // 这是FF的判断语句，因为ff下没有readyState这人值，IE的readyState肯定有值
		xhr.onreadystatechange = function() {
			// 请求完成，并且成功
			if (xhr.readyState === 4 && xhr.status === 200) {
				callback(xhr.response);
			}
		};
	} else {
		xhr.onload = function(e) { //下载完成
			callback(xhr.response);
		};
	}
	xhr.send();
}

function createLrc(medis) {
	var medises = medis.split("\n"); // 用换行符拆分获取到的歌词
	// console.log(medises)
	if (!medises[medises.length - 1]) {
		medises.pop();
	}
	var medisArray = {}; // 定义一个新的对象

	for (let i = 0; i < medises.length; i++) { // 遍历medises，并且将时间和文字拆分开，并push进自己定义的对象
		var t = medises[i].substring(medises[i].indexOf("[") + 1, medises[i].indexOf("]"));
		var tKey = "";
		// if (medises[i].charAt(medises[i].length - 1) === "]") {
		if (medises[i].substring(0, 4) === "[by:") {
			// tKey = "0.000";
			tKey = "by";
		} else {
			tKey = (t.split(":")[0] * 60 + parseFloat(t.split(":")[1])).toFixed(3);
		}

		if (!medisArray[tKey]) {
			if (tKey == "by") {
				// medisArray[tKey] = {
				// 	orgin: t
				// }
			} else {
				medisArray[tKey] = {
					orgin: medises[i].substring(medises[i].indexOf("]") + 1, medises[i].length)
				}
			}
		} else {
			medisArray[tKey].trans = medises[i].substring(medises[i].indexOf("]") + 1, medises[i].length)
		}
	}

	// 遍历medisArray，并且生成li标签，将对象内的文字放入li标签
	// var ul = document.getElementById("lyrics-ul");
	var length = Object.keys(medisArray).length;
	for (let key in medisArray) {
		// if(key == "by"){
		// 	continue;
		// }
		// var li = document.createElement("li","<li style='list-style: none;'>");
		// li.innerHTML = medises[j].c;
		var li = document.createElement("li");
		var orignTextSpan = document.createElement("span");
		orignTextSpan.innerHTML = medisArray[key].orgin;
		li.append(orignTextSpan);
		if (medisArray[key].trans) {
			var transTextSpan = document.createElement("span");
			transTextSpan.innerHTML = medisArray[key].trans;
			li.append(transTextSpan);
		}
		lyricsUl.append(li);
	}

	return medisArray
}

function highlightLine(lineno) {
	var ajust = lyricsUl.children[0].offsetTop;
	var nowline = lyricsUl.children[topNum + lineno];
	var nowlineHeight = nowline.clientHeight;
	if (lineno > 0) {
		// lyricsUl.children[topNum + lineno - 1].classList.remove("highlight-line");
		lyricsUl.children[lastLineNo].classList.remove("highlight-line");
	}
	nowline.classList.add("highlight-line");

	var _scrollTop;
	lyricsWrapper.scrollTop = 0;

	if (lyricsUl.clientHeight * fraction > nowline.offsetTop) {
		_scrollTop = 0;
	} else if (nowline.offsetTop > (lyricsUl.scrollHeight - lyricsUl.clientHeight * (1 - fraction))) {
		_scrollTop = lyricsUl.scrollHeight - lyricsUl.clientHeight + ajust;
	} else {
		_scrollTop = nowline.offsetTop - lyricsUl.clientHeight * fraction + ajust;
	}
	// audioPlayer.pause();
	// debugger

	//以下声明歌词高亮行固定的基准线位置成为 “A”
	var baseLine = lyricsWrapper.clientHeight * fraction;
	lyricsWrapper.scrollTop = nowline.offsetTop + nowlineHeight * 0.5 - baseLine;

	lastLineNo = lineno;

	return;

	if ((nowline.offsetTop - lyricsWrapper.scrollTop) > baseLine) {
		//如果高亮显示的歌词在A下面，那就将滚动条向下滚动，滚动距离为 当前高亮行距离顶部的距离-滚动条已经卷起的高度-A到可视窗口的距离
		lyricsWrapper.scrollTop = nowline.offsetTop + nowlineHeight * 0.5 - baseLine;
	} else if ((nowline.offsetTop - lyricsWrapper.scrollTop) <= baseLine && _scrollTop != 0) {
		//如果高亮显示的歌词在A上面，那就将滚动条向上滚动，滚动距离为 A到可视窗口的距离-当前高亮行距离顶部的距离-滚动条已经卷起的高度
		lyricsWrapper.scrollTop = nowline.offsetTop + nowlineHeight * 0.5 - baseLine;
	} else if (_scrollTop == 0) {
		lyricsWrapper.scrollTop = 0;
	} else {
		lyricsWrapper.scrollTop += lyricsUl.children[0].clientHeigh;
	}

}

function getCurLine(audio, timeArr) {
	var high = timeArr.length - 1;
	if (high <= 2) {
		return 0
	}
	var curT = audio.currentTime;
	if (curT < timeArr[0]) {
		return 0
	}
	if (curT >= timeArr[high]) {
		return high
	}
	var low = 0;
	while (low <= high) {
		var mid = parseInt((low + high) / 2);
		if (curT >= timeArr[mid]) {
			if (curT < timeArr[mid + 1]) {
				return mid;
			} else {
				low = mid + 1;
			}
		} else {
			if (curT >= timeArr[mid - 1]) {
				return mid - 1;
			} else {
				high = mid - 1;
			}
		}
	}
}

// ================================= 进度条 ======================================================
var progressWrapper = document.querySelector(".music-progress-wrapper");
var progress = document.querySelector(".music-progress-wrapper .music-progress");
var progressDot = document.querySelector(".music-progress-wrapper .music-progress .progress-dot");
var progressMask = document.querySelector(".music-progress-wrapper .music-progress .cover-mask");
var progressWidth = 0;
var dragging = false;
var mouseLeftBeforeDrag = 0;
var dotLeftBeforeDrag = 0;

if (window.onmousedown !== undefined) {
	progressDot.addEventListener('mousedown', function(e) {
		console.log("onmousedown")
		var ev = e || window.event;
		event.stopPropagation();
		mouseLeftBeforeDrag = ev.clientX;
		dotLeftBeforeDrag = progressDot.offsetLeft;

		document.addEventListener('mousemove', onProgressDotDraging)

		document.addEventListener('mouseup', onProgressDotDragEnd)
	})

	progress.addEventListener('mousedown', function(e) {
		var ev = e || window.event;
		event.stopPropagation();
		progressDot.style.left = ev.layerX + 'px';
		progressMask.style.width = ev.layerX + 'px';
		audioPlayer.currentTime = (progressDot.offsetLeft / progressWidth) * audioPlayer.duration;
		curLineNo = getCurLine(audioPlayer, curLyricKeys)
	})
}

function initProgress() {
	dragging = false;
	progressWidth = 0;
	mouseLeftBeforeDrag = 0;
	progressDot.style.left = '0px';
	progressMask.style.width = '0px';
	progressWidth = progress.clientWidth;
}

function updateProgress() {
	progressDot.style.left = (audioPlayer.currentTime / audioPlayer.duration) * progressWidth + 'px';
	progressMask.style.width = (audioPlayer.currentTime / audioPlayer.duration) * progressWidth + 'px';
}

function onProgressDotDraging(e) {
	dragging = true;
	moveProgressDot(e);
}

function onProgressDotDragEnd(e) {
	if (dragging) {
		// moveProgressDot(e);
		dragging = false;
		audioPlayer.currentTime = (progressDot.offsetLeft / progressWidth) * audioPlayer.duration;
		curLineNo = getCurLine(audioPlayer, curLyricKeys);
	}
	document.removeEventListener("mousemove", onProgressDotDraging);
}

function moveProgressDot(e) {
	var ev = e || window.event;
	var touch = ev;
	var deltaLeft = touch.clientX - mouseLeftBeforeDrag;

	var dotNewPos = dotLeftBeforeDrag + deltaLeft;
	if (dotNewPos > progressWidth) {
		dotNewPos = progressWidth;
	} else if (dotNewPos < 0) {
		dotNewPos = 0;
	}
	progressDot.style.left = dotNewPos + 'px';
	progressMask.style.width = dotNewPos + 'px';
}

//阻止默认事件
function defaultEvent(e) {
	e.preventDefault();
}

// ================================= 滚动标题 ======================================================
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
	window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
var menuBtn = document.getElementById("music-menu");

var rollTitleBar = {}
rollTitleBar.outerElement = document.getElementById("cur-bgm-title-wrapper");
rollTitleBar.element = document.getElementById("music-title-roll-bar");
rollTitleBar.innerElement = document.getElementById("music-title-roll-bar").children[0];
rollTitleBar.outerOffsetWidth = 0;
rollTitleBar.innerOffsetWidth = 0;
var animId = 0;
var curOffset = 0;

rollTitleBar.initRollTitle = function(title, roll) {
	if (animId != 0) {
		cancelAnimationFrame(animId);
	}
	curOffset = 0;
	rollTitleBar.innerElement.innerHTML = title;
	rollTitleBar.outerOffsetWidth = rollTitleBar.element.clientWidth;
	rollTitleBar.innerOffsetWidth = rollTitleBar.innerElement.clientWidth;
	curOffset = rollTitleBar.outerOffsetWidth;

	if (roll) {
		animId = requestAnimationFrame(rollTitleBar.rollStart);
	} else {
		rollTitleBar.rollStop()
	}
}

rollTitleBar.rollStart = function() {
	curOffset--;
	if (curOffset < -rollTitleBar.innerOffsetWidth) {
		curOffset = rollTitleBar.outerOffsetWidth;
	}
	rollTitleBar.innerElement.style.left = curOffset + "px";

	if (!rollTitleBar.outerElement.classList.contains("cur-bgm-title-wrapper-active")) {
		rollTitleBar.outerElement.classList.add("cur-bgm-title-wrapper-active");
	}

	animId = requestAnimationFrame(rollTitleBar.rollStart);
}

rollTitleBar.rollStop = function() {
	cancelAnimationFrame(animId);
	rollTitleBar.outerElement.classList.remove("cur-bgm-title-wrapper-active");
	curOffset = 0;
	rollTitleBar.innerElement.style.left = curOffset + "px";
}

rollTitleBar.show = function() {
	rollTitleBar.outerElement.classList.add("cur-bgm-title-wrapper-show")
}

rollTitleBar.hide = function() {
	rollTitleBar.outerElement.classList.remove("cur-bgm-title-wrapper-show")
}

// ================================= 音乐列表 ======================================================
var musicListWrapper = document.getElementById("bgm-list-wrapper");
var musicListShow = false;
var hideTitleTimer = null;
var hideListTimer = null;

scrollUnique(musicListWrapper);

function initMusicList() {
	var str = ""
	for (let i = 0; i < musicList.length; i++) {
		str += "<li data-index='" + i + "' onclick='onMusicListItemClicked(this)'><i class='iconfont'>&#xe60e;</i><span>" +
			musicList[i] + "</span></li>";
	}
	musicListWrapper.innerHTML = str;
}

function onMusicListShow() {
	musicListShow = true;
	musicListWrapper.children[curMusicIndex].children[0].style.animation = "infiniteRoll 1.5s linear infinite";
	musicListWrapper.classList.add("bgm-list-wrapper-show");
}

function onMusicListHide() {
	musicListShow = false;
	musicListWrapper.classList.remove("bgm-list-wrapper-show");
	musicListWrapper.children[curMusicIndex].children[0].style.animation = "";
}

function onMusicListItemClicked(ele) {
	musicListWrapper.children[curMusicIndex].children[0].style.animation = "";
	changeMusic(ele.getAttribute("data-index"));
}

menuBtn.addEventListener('mouseover', function(e) {
	if (hideTitleTimer != null) {
		clearTimeout(hideTitleTimer);
	}
	if (hideListTimer != null) {
		clearTimeout(hideListTimer);
	}
	if (musicListShow) {
		rollTitleBar.hide();
		onMusicListShow();
	} else {
		rollTitleBar.show();
		onMusicListHide();
	}
})

menuBtn.addEventListener('mouseleave', function(e) {
	if (musicListShow) {
		hideListTimer = setTimeout(() => {
			onMusicListHide();
		}, 1000)
	} else {
		hideTitleTimer = setTimeout(() => {
			rollTitleBar.hide();
		}, 6000);
	}
})

menuBtn.addEventListener('click', function(e) {
	clearTimeout(hideTitleTimer);
	rollTitleBar.hide();
	clearTimeout(hideListTimer);
	onMusicListShow();
	musicListShow = true;
})

// musicListWrapper.addEventListener('mouseleave', function(e) {
// 	hideListTimer = setTimeout(()=>{
// 		onMusicListHide();
// 	},1000)
// })

// musicListWrapper.addEventListener('mouseover', function(e) {
// 	clearTimeout(hideListTimer);
// })

// ================================= 音频可视化 ======================================================
var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
let audioCtx;
// var analyser = audioCtx.createAnalyser(); // 快速傅里叶变换的一个参数
// analyser.fftSize = 512; // fftSize 的要求是 2 的幂次方。数字越大，得到的结果越精细。
var analyser; // 快速傅里叶变换的一个参数
var source;

// async function initSound(context, url) {
// 	let audioMedia = await request(url);
// 	context.decodeAudioData(audioMedia).then(buffer => {
// 		getBufferSuccess(buffer)
// 	});
// }

function clearAudioContext() {
	audioCtx = null;
	source = null;
	analyser = null;
}

function initAudioContext(audio) {
	audioCtx = new AudioContext();
	analyser = audioCtx.createAnalyser(); // 快速傅里叶变换的一个参数
	analyser.fftSize = 2048; // fftSize 的要求是 2 的幂次方。数字越大，得到的结果越精细。
	analyser.smoothingTimeConstant = 0.6; // 这个属性可以让最后一个分析帧的数据随时间使值之间的过渡更平滑。
	source = audioCtx.createMediaElementSource(audio); // 创建播放对象节点
	let gainNode = audioCtx.createGain(); // 创建音量节点(如果你需要用调整音量大小的话)

	// 连接节点对象
	// source.connect(audioCtx.destination);
	source.connect(gainNode);
	gainNode.connect(analyser);
	analyser.connect(audioCtx.destination); // 将分析器关联到输出设备（耳机、扬声器）
}

function getVisualData() {
	// analyser.frequencyBinCount 可视化值的数量，是前面fftSize的一半
	let currData = new Uint8Array(analyser.frequencyBinCount);
	// getByteFrequencyData 返回的是 0 - 255 的 Uint8Array 
	analyser.getByteFrequencyData(currData);
	// getFloatFrequencyData 返回的是 0 - 22050 的 Float32Array 。
	// analyser.getFloatFrequencyData(currData);
	analyser.getByteTimeDomainData(currData);
}

// ================================= 总控 ======================================================
initPlayer(audioPlayer, "static/bgm/" + musicList[curMusicIndex] + ".mp3", false);
initLyrics("json/lyrics/" + musicList[curMusicIndex] + ".json");
initProgress();
initMusicList();
rollTitleBar.initRollTitle(musicList[curMusicIndex], false);
// initAudioContext(audioPlayer)

document.getElementById("pause-play").onclick = function() {
	if (audioPlayer.paused) {
		musicPlay()
	} else {
		musicPause()
	}
};
document.getElementById("pre-one").onclick = function() {
	audioPlayer.pause();
	changeMusic((curMusicIndex - 1 + musicList.length) % musicList.length);
};
document.getElementById("next-one").onclick = function() {
	audioPlayer.pause();
	changeMusic((curMusicIndex + 1 + musicList.length) % musicList.length);
};

audioPlayer.addEventListener("timeupdate", function() {
	if (curLineNo == curLyricKeys.length - 1 && this.currentTime >= curLyricKeys[curLineNo]) {
		highlightLine(curLineNo);
	}
	if (curLyricKeys[curLineNo] <= this.currentTime && this.currentTime <= curLyricKeys[curLineNo + 1]) {
		highlightLine(curLineNo);
		curLineNo++;
	} else if (curLyricKeys[curLineNo] <= this.currentTime) {
		highlightLine(curLineNo);
		curLineNo++;
	}
	if (!dragging) {
		updateProgress();
	}
});

//播放结束自动回到开头 
// audioPlayer.addEventListener("ended", function() {
// 	// alert('over');
// 	// curLineNo = 0;
// 	// this.play();
// 	// highlightLine();
// 	// lyricsWrapper.scrollTop = 0;
// });

function musicPlay() {
	audioPlayer.play();
	document.getElementById("pause-play").children[0].innerHTML = "&#xe603;"
	progressDot.classList.add("progress-dot-active");
	rollTitleBar.rollStart();
	// initAudioContext(audioPlayer);
}

function musicPause() {
	audioPlayer.pause();
	document.getElementById("pause-play").children[0].innerHTML = "&#xe602;"
	progressDot.classList.remove("progress-dot-active");
	rollTitleBar.rollStop()
	// clearAudioContext();
}

function changeMusic(index) {
	curMusicIndex = index;
	musicPause();
	initPlayer(audioPlayer, "static/bgm/" + musicList[curMusicIndex] + ".mp3", true);
	initLyrics("json/lyrics/" + musicList[curMusicIndex] + ".json");
	initProgress();
	rollTitleBar.initRollTitle(musicList[curMusicIndex], true);
	musicPlay();
	rollTitleBar.rollStop();
}
