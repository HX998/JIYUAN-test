/* iframe下打开弹窗 */
export class PageCommonUtils  {
  static openMask(){
		//打开父页面遮罩
		let messageData = {
			type: 'openMask',
			value: true
		}
		window.parent.postMessage(messageData, '*')
	};

	//关闭父页面遮罩
	static closeMask(){
		let messageData = {
			type: 'openMask',
			value: false
		}
		window.parent.postMessage(messageData, '*')
	};
}