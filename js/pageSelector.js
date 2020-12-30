var pageSelector = {};
pageSelector.selectorData = {};
pageSelector.preBtnWrapperClassName = "pre-btn-wrapper";
pageSelector.navBtnWrapperClassName = "nav-btn-wrapper";
pageSelector.forwardBtnWrapperClassName = "forward-btn-wrapper";
pageSelector.mainContainerClassName = "";
pageSelector.disableBtnClassName = "page-btn-disable";


// 初始化组件
pageSelector.initSelector = function(queryStr, config = {
	curPageNum: 1,
	maxBtnNum: 1,
	pageItemNum: 1,
	totalItemNum: 1
}, callback=()=>{
	console.log(pageSelector.selectorData.curPageNum)
}) {
	pageSelector.mainContainerClassName = queryStr;
	pageSelector.callback = callback;
	var pageItemNum = Math.abs(config.pageItemNum) || 1;
	var totalItemNum = Math.abs(config.totalItemNum) || 1;
	var maxPageNum = Math.ceil(totalItemNum / pageItemNum);
	var curPageNum = Math.abs(config.curPageNum) || 1;
	if (curPageNum <= 0) {
		curPageNum = 1;
	} else if (curPageNum > maxPageNum) {
		curPageNum = maxPageNum;
	}
	
	var maxBtnNum = Math.abs(config.maxBtnNum) || 1;
	if (maxPageNum <= 5) {
		maxBtnNum = maxPageNum;
	}else if(maxBtnNum <= 5 && maxPageNum > 5){
		maxBtnNum = 5;
	}

	pageSelector.selectorData = {
		maxPageNum,
		curPageNum,
		maxBtnNum
	}

	pageSelector.createFunctionBtns(queryStr);
	pageSelector.createBtns(queryStr, pageSelector.navBtnWrapperClassName);
}

pageSelector.createFunctionBtns = function(queryStr) {
	var mainContainer = document.querySelector("." + queryStr);
	mainContainer.innerHTML =
		`<div class="${pageSelector.preBtnWrapperClassName}">
								<span class="page-btn first-page-btn" onclick=goFirstPage()>\<\<</span><span class="page-btn pre-page-btn" onclick=goPrePage()>\<</span>
							</div>
							<div class="${pageSelector.navBtnWrapperClassName}"></div>
							<div class="${pageSelector.forwardBtnWrapperClassName}">
								<span class="page-btn next-page-btn" onclick=goNextPage()>\></span><span class="page-btn last-page-btn" onclick=goLastPage()>\>\></span>
							</div>`;
}

// 生成按钮
pageSelector.createBtns = function(ele, child) {
	var upperShowBtnNum, lowerShowBtnNum;

	var showBtnNum;
	if (pageSelector.selectorData.maxBtnNum >= pageSelector.selectorData.maxPageNum) {
		// 最大按钮数刚好等于总页数时，无需隐藏其他按钮
		showBtnNum = pageSelector.selectorData.maxPageNum;
	} else {
		// 最大按钮数大于总页数时，需要隐藏其他按钮
		showBtnNum = pageSelector.selectorData.maxBtnNum;
	}

	// 设置分页显示段
	lowerShowBtnNum = pageSelector.selectorData.curPageNum - parseInt(showBtnNum / 2);
	upperShowBtnNum = pageSelector.selectorData.curPageNum + parseInt(showBtnNum / 2);

	if (showBtnNum % 2 === 0) {
		upperShowBtnNum--
	}

	if (lowerShowBtnNum < 1) {
		upperShowBtnNum += 1 - lowerShowBtnNum;
		lowerShowBtnNum = 1;
	}

	if (upperShowBtnNum > pageSelector.selectorData.maxPageNum) {
		lowerShowBtnNum -= upperShowBtnNum - pageSelector.selectorData.maxPageNum;
		upperShowBtnNum = pageSelector.selectorData.maxPageNum;
	}

	var str = '',
		htmlStr = '';
	// 生成按钮
	for (let i = lowerShowBtnNum; i < upperShowBtnNum + 1; i++) {
		if (i == pageSelector.selectorData.curPageNum) {
			str = '<span class="page-btn page-btn-active" data-pageIndex="' + i + '" onclick="goPage(this)">' + i + '</span>';
		} else {
			str = '<span class="page-btn" data-pageIndex="' + i + '" onclick="goPage(this)">' + i + '</span>';
		}
		if (i == lowerShowBtnNum && lowerShowBtnNum != 1) {
			str = '<span class="page-btn">···</span>'
		}
		if (i == upperShowBtnNum && upperShowBtnNum != pageSelector.selectorData.maxPageNum) {
			str = '<span class="page-btn">···</span>'
		}
		htmlStr += str;
	}
	document.querySelector(`.${ele} .${child}`).innerHTML = htmlStr;

	updateBtnState();
}

// 页码按钮
function goPage(sourceEle) {
	var goIndex = sourceEle.getAttribute("data-pageIndex");
	if (pageSelector.selectorData.curPageNum == goIndex) {
		return;
	}
	pageSelector.selectorData.curPageNum = parseInt(goIndex);
	pageSelector.createBtns(pageSelector.mainContainerClassName, pageSelector.navBtnWrapperClassName);
	pageSelector.callback(pageSelector.selectorData.curPageNum);
}

// 上一页按钮
function goPrePage() {
	if (pageSelector.selectorData.curPageNum <= 1) {
		return;
	}
	pageSelector.selectorData.curPageNum -= 1;
	pageSelector.createBtns(pageSelector.mainContainerClassName, pageSelector.navBtnWrapperClassName);
	pageSelector.callback(pageSelector.selectorData.curPageNum);
}

// 第一页按钮
function goFirstPage() {
	if (pageSelector.selectorData.curPageNum <= 1) {
		return;
	}
	pageSelector.selectorData.curPageNum = 1;
	pageSelector.createBtns(pageSelector.mainContainerClassName, pageSelector.navBtnWrapperClassName);
	pageSelector.callback(pageSelector.selectorData.curPageNum);
}

// 下一页按钮
function goNextPage() {
	if (pageSelector.selectorData.curPageNum >= pageSelector.selectorData.maxPageNum) {
		return;
	}
	pageSelector.selectorData.curPageNum += 1;
	pageSelector.createBtns(pageSelector.mainContainerClassName, pageSelector.navBtnWrapperClassName);
	pageSelector.callback(pageSelector.selectorData.curPageNum);
}

// 最后一页按钮
function goLastPage() {
	if (pageSelector.selectorData.curPageNum >= pageSelector.selectorData.maxPageNum) {
		return;
	}
	pageSelector.selectorData.curPageNum = pageSelector.selectorData.maxPageNum;
	pageSelector.createBtns(pageSelector.mainContainerClassName, pageSelector.navBtnWrapperClassName);
	pageSelector.callback(pageSelector.selectorData.curPageNum);
}

function updateBtnState() {
	if (pageSelector.selectorData.curPageNum <= 1) {
		setDisableType(1);
	} else if (pageSelector.selectorData.curPageNum >= pageSelector.selectorData.maxPageNum) {
		setDisableType(2);
	} else {
		setDisableType(3);
	}
}

function setDisableType(type) {
	if (type == 1) {
		// 前跳转功能键禁用
		document.querySelector("." + pageSelector.preBtnWrapperClassName + " .first-page-btn").classList.add(pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.preBtnWrapperClassName + " .pre-page-btn").classList.add(pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.forwardBtnWrapperClassName + " .next-page-btn").classList.remove(
			pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.forwardBtnWrapperClassName + " .last-page-btn").classList.remove(
			pageSelector.disableBtnClassName);
	} else if (type == 2) {
		// 后跳转功能键禁用
		document.querySelector("." + pageSelector.forwardBtnWrapperClassName + " .next-page-btn").classList.add(
			pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.forwardBtnWrapperClassName + " .last-page-btn").classList.add(
			pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.preBtnWrapperClassName + " .first-page-btn").classList.remove(
			pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.preBtnWrapperClassName + " .pre-page-btn").classList.remove(pageSelector.disableBtnClassName);
	} else {
		// 全启用
		document.querySelector("." + pageSelector.forwardBtnWrapperClassName + " .next-page-btn").classList.remove(
			pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.forwardBtnWrapperClassName + " .last-page-btn").classList.remove(
			pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.preBtnWrapperClassName + " .first-page-btn").classList.remove(
			pageSelector.disableBtnClassName);
		document.querySelector("." + pageSelector.preBtnWrapperClassName + " .pre-page-btn").classList.remove(pageSelector.disableBtnClassName);
	}
}
