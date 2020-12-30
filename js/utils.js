function scrollUnique(ele) {
	// var eventType = 'mousewheel';
	var eventType = 'wheel';
	// 火狐是DOMMouseScroll事件
	if (document.mozHidden !== undefined) {
		// eventType = 'DOMMouseScroll';
		eventType = 'wheel';
	}
	ele.addEventListener(eventType, function(event) {
		event = event || window.event;
		event.stopPropagation();
		// 一些数据
		var scrollTop = this.scrollTop,
			scrollHeight = this.scrollHeight,
			height = this.clientHeight;

		// var delta = (event.wheelDelta) ? event.wheelDelta : -(event.detail || 0);
		var delta = (event.wheelDelta) ? event.wheelDelta : -(event.deltaY || 0);

		if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
			// IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
			this.scrollTop = delta > 0 ? 0 : scrollHeight;
			// 向上滚 || 向下滚
			event.preventDefault();
		}
	});
}
