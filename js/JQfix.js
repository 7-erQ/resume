// $.fn.scrollUnique = function() {
//     return $(this).each(function() {
//         var eventType = 'mousewheel';
//         // 火狐是DOMMouseScroll事件
//         if (document.mozHidden !== undefined) {
//             eventType = 'DOMMouseScroll';
//         }
//         $(this).on(eventType, function(event) {
// 			console.log(this)
//             // 一些数据
//             var scrollTop = this.scrollTop,
//                 scrollHeight = this.scrollHeight,
//                 height = this.clientHeight;

//             var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);        

//             if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
//                 // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
//                 this.scrollTop = delta > 0? 0: scrollHeight;
//                 // 向上滚 || 向下滚
//                 event.preventDefault();
//             }        
//         });
//     });	
// };

// 为DOM原型添加子元素滚动边界不影响父元素的方法
if (window.HTMLElement) {
	// 使用原型扩展DOM自定义方法
	HTMLElement.prototype.scrollUnique = function() {
		return (function() {
			// var eventType = 'mousewheel';
			var eventType = 'wheel';
			// 火狐是DOMMouseScroll事件
			if (document.mozHidden !== undefined) {
				eventType = 'DOMMouseScroll';
			}
			this.addEventListener(eventType, function(event) {
				event.stopPropagation();
				// 一些数据
				var scrollTop = this.scrollTop,
					scrollHeight = this.scrollHeight,
					height = this.clientHeight;
				
				var delta = (event.wheelDelta) ? event.wheelDelta : -(event.detail ||
					0);

				if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
					// IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
					this.scrollTop = delta > 0 ? 0 : scrollHeight;
					// 向上滚 || 向下滚
					event.preventDefault();
				}
			});
		}())
	};
} else {
	// 如果是不支持HTMLElement扩展的浏览器
	// 通过遍历所有元素扩展DOM方法

	var elAll = document.all,
		lenAll = elAll.length;
	for (var iAll = 0; iAll < lenAll; iAll += 1) {
		elAll[iAll].scrollUnique = function() {
			return (function() {
				// var eventType = 'mousewheel';
				var eventType = 'wheel';
				// 火狐是DOMMouseScroll事件
				if (document.mozHidden !== undefined) {
					eventType = 'DOMMouseScroll';
				}
				this.addEventListener(eventType, function(event) {
					event.stopPropagation();
					// 一些数据
					var scrollTop = this.scrollTop,
						scrollHeight = this.scrollHeight,
						height = this.clientHeight;

					var delta = (event.wheelDelta) ? event.wheelDelta : -(event.detail ||
						0);

					if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
						// IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
						this.scrollTop = delta > 0 ? 0 : scrollHeight;
						// 向上滚 || 向下滚
						event.preventDefault();
					}
				});
			}())
		};
	}
}
