(function(){
	var dataUrl = "json/projectsShowData.json"
	// var projectsData = {}
	var curProjectTypeData = {};
	var curItemIndex = 0;
	var lastItemIndex = 0;
	var curPage = 0;
	
	var itemCards = document.getElementsByClassName("item-card");
	var indexToContent = ["frontend","artDesign","painting","gameDev"];
	var showBox = document.getElementById("show-content");
	
	// 标题栏dom元素
	var titleWrapper = document.querySelector("#show-content .content-title");
	var mainTitleBox = document.querySelector("#show-content .content-title #main-title-box");
	var dateBox = document.querySelector("#show-content .content-title #date-box");
	var subTitleBox = document.querySelector("#show-content .content-title #sub-title-box");
	var tagsBox = document.querySelector("#show-content .content-title #tags-box");
	
	// 图片dom元素
	var imgWrapper = document.querySelector("#show-content .img-wrapper");
	var imgContainer = document.querySelector("#show-content .img-container");
	// var imgBox = document.querySelector("#show-content .img-wrapper #content-img");
	
	// 底部项目说明dom元素
	var introBox = document.querySelector("#show-content .content-intro #intro-text");
	
	// 查看大图相关dom元素
	var imgModalWrapper = document.querySelector(".img-modal-wrapper");
	var imgModalImg = document.querySelector(".img-modal-wrapper .modal-content img");
	var imgModalMask = document.querySelector(".img-modal-wrapper .modal-content .mask");
	
	initScript();
	
	// 第一步：初始化脚本，为需要的对象赋值
	function initScript() {
		// dateBox = document.querySelector("#show-content .content-title #date-box");
		// subTitleBox = document.querySelector("#show-content .content-title #sub-title-box");
		// tagsBox = document.querySelector("#show-content .content-title #tags-box");
		
		initCards(itemCards);
		scrollUnique(imgContainer);
		scrollUnique(imgModalWrapper);
		scrollUnique(introBox);
		imgContainer.onclick = onImgContainerClick;
		imgModalMask.onclick = onImgModalMaskClick;
	}
	
	// 初始化选项卡片，为各卡片绑定点击方法
	function initCards(cardsArr) {
		for(let i = 0; i < cardsArr.length; i++) {
			cardsArr[i].onclick = function() {
				onProjectCardClicked(i);
			};
		}
	}
	
	// 当项目卡片被点击时：（1）为卡片设置点击状态；（2）更新项目数据；（3）刷新展示内容
	function onProjectCardClicked(index) {
		var type = indexToContent[index];
		// curProjectTypeData = projectsData[type];
		
		for (let i = 0; i < itemCards.length; i++) {
			if(i == index){
				itemCards[i].classList.add("item-card-active");
			}else{
				itemCards[i].classList.remove("item-card-active");
			}
		}
		
		updateSelectContent(type,()=>{
			changeshownContent();
			if(!titleWrapper.style.borderBottom){
				titleWrapper.style= "border-bottom: solid 1px #aaa;"
			}
			createPageSelector();
			});
	}
	
	function updateSelectContent(type,callback) {
		getProjectsData(type,res=>{
			// var temp = JSON.parse(res);
			curProjectTypeData = res;
			curPage = 0;
			callback();
		})
	}
	
	function changeshownContent() {
		mainTitleBox.innerHTML = curProjectTypeData[`p${curPage}`]["projectType"];
		subTitleBox.innerHTML = curProjectTypeData[`p${curPage}`]["title"];
		dateBox.innerHTML = curProjectTypeData[`p${curPage}`]["date"];
		var tagsStr = curProjectTypeData[`p${curPage}`]["tags"].join(' <a style="color: #3dd;">#</a>');
		// console.log(tagsStr)
		tagsStr = '<a style="color: #3dd;">#</a>' + tagsStr;
		// console.log(tagsStr)
		tagsBox.innerHTML = tagsStr;
		if(curProjectTypeData[`p${curPage}`]["fileType"] == "img") {
			dynamicImgDom();
		}
		
		introBox.innerHTML = curProjectTypeData[`p${curPage}`]["introText"]?curProjectTypeData[`p${curPage}`]["introText"]:'<p style="opacity: 0.5;">暂无描述.</p>'
	}
	
	function getProjectsData(key,callback) {
		var xhr = new XMLHttpRequest();
		xhr.overrideMimeType("application/json");
		xhr.open("GET", dataUrl, true);
		if(xhr.readyState) {
			xhr.onreadystatechange = ()=>{
				if(xhr.readyState == 4 && xhr.status == 200) {
					var temp = JSON.parse(xhr.response);
					callback(temp[key]);
				}
			}
		}else{
			xhr.onload = ()=>{
				var temp = JSON.parse(xhr.response);
				callback(temp[key]);
			}
		}
		xhr.send();
	}
	
	function dynamicImgDom() {
		curItemIndex = 0;
		lastItemIndex = 0;
		var oldImgContainer = document.querySelector("#show-content .img-container");
		var imgDomArr = document.querySelectorAll("#show-content .img-container > img");
		
		var indexDotsContainer = document.querySelector("#show-content .content-body .img-wrapper .index-dots-container");
		var indexDotArr = indexDotsContainer.children;
		
		var dataUrlArr = curProjectTypeData[`p${curPage}`]["url"];
		
		if(imgDomArr.length < dataUrlArr.length) {
			// img元素数量小于数据图片数量
			for(let i = 0; i < dataUrlArr.length; i++) {
				if(imgDomArr[i]) {
					imgDomArr[i].src = dataUrlArr[i];
				}else{
					var imgDom = document.createElement("img");
					imgDom.classList.add("content-img");
					imgDom.id = "content-img";
					imgDom.src = dataUrlArr[i];
					oldImgContainer.appendChild(imgDom);
					
					var dot = document.createElement("div");
					dot.classList.add("index-dot");
					dot.setAttribute("data-dotIndex",i);
					dot.addEventListener("click",function(){
						changeImg(parseInt(this.getAttribute("data-dotIndex")));
					});
					indexDotsContainer.appendChild(dot);
				}
			}
		}else{
			// img元素数量大于等于数据图片数量
			for(let i = 0; i < imgDomArr.length; i++) {
				if(dataUrlArr[i]) {
					imgDomArr[i].src = dataUrlArr[i];
				}else{
					imgDomArr[i].remove();
					indexDotArr[i].remove();
				}
			}
		}
		
		changeImg(curItemIndex,true);
	}
	
	function changeImg(index, isFirstTime = false) {
		curItemIndex = index;
		if(lastItemIndex == index && !isFirstTime) {
			return;
		}
		var imgDomArr = document.querySelectorAll("#show-content .img-container > img");
		
		var indexDotsContainer = document.querySelector("#show-content .content-body .img-wrapper .index-dots-container");
		var indexDotArr = indexDotsContainer.children;
		
		for (let i = 0; i < indexDotArr.length; i++) {
			if(i == curItemIndex) {
				var img=new Image();
				img.src=imgDomArr[i].src;
				img.onload=function(){
				  // console.log('背景图片已加载完毕');
				  imgDomArr[i].classList.add("img-show");
				  indexDotArr[i].classList.add("index-dot-active");
				};
			}else{
				imgDomArr[i].classList.remove("img-show");
				indexDotArr[i].classList.remove("index-dot-active");
			}
		}
		
		lastItemIndex = curItemIndex;
	}
	
	function createPageSelector() {
		var totalDataNum = Object.keys(curProjectTypeData).length;
		pageSelector.initSelector("page-selector",{
			curPageNum: 1,
			maxBtnNum: 1,
			pageItemNum: 1,
			totalItemNum: totalDataNum
		},onPageChange)
	}
	
	function onPageChange(cur) {
		curPage = cur - 1;
		changeshownContent();
	}
	
	function onImgContainerClick(e) {
		if(!e.target.src) {
			return false;
		}else{
			imgModalWrapper.classList.add("img-modal-wrapper-show");
			imgModalImg.src = e.target.src;
		}
	}
	
	function onImgModalMaskClick() {
		imgModalWrapper.classList.remove("img-modal-wrapper-show");
		imgModalImg.src = "";
	}
})();