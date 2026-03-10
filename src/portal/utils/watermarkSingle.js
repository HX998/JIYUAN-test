// 为单页面添加水印，并不是为整个网站添加水印
// 调用步骤：
// (1)在需要使用的页面上引入脚本:import WatermarkSingle from '@/utils/watermarkSingle'
// (2)在此页面中增加一个div标签，将页面内容包在此div标签内，并为此div设置ref，例如:<div ref="directrecordwp">这是页面的内容</div>
// (3)在脚本中增加mounted，并添加如下代码：
//  注意:this.$refs.directrecordwp中的"directrecordwp"就是在2中设置的div的ref。
//       mounted () {
//         const remark = '测试水印'
//         WatermarkSingle.set(remark, this.$refs.directrecordwp)
//       }
'use strict'
const watermarkSingle = {}

// 禁止复制文本
document.onselectstart = function () { return false }

/**
 * 为单页面添加水印
 * @param {要设置的水印的内容} str
 * @param {需要设置水印的容器} container
 * @returns {string}
 */
const setWatermark = (str,str1,str2, container) => {
  const id = '1.23452384164.123412415'
  if (container === undefined) {
    return
  }
  // 查看页面上有没有，如果有则删除
  if (document.getElementById(id) !== null) {
    const childelement = document.getElementById(id)
    childelement.parentNode.removeChild(childelement)
  }
  var containerWidth = container.offsetWidth // 获取父容器宽
  var containerHeight = container.offsetHeight // 获取父容器高
  container.style.position = 'relative' // 设置布局为相对布局
  // 创建canvas元素(先制作一块背景图)
  const can = document.createElement('canvas')
  can.width = 280 // 设置每一块的宽度
  can.height = 138 // 高度
  const cans = can.getContext('2d') // 获取canvas画布
  cans.rotate(-20 * Math.PI / 180) // 逆时针旋转π/9
  cans.font = '15px Vedana' // 设置字体
  cans.fillStyle = 'rgba(0, 0, 0, 0.6)' // 设置字体的颜色
  cans.textAlign = 'left' // 文本对齐方式
  cans.textBaseline = 'Middle' // 文本基线
  cans.fillText(str2, 0,   4 * can.height / 5) // 绘制文字
  cans.fillText(str1, 0,  4 * can.height / 6) // 绘制文字
 cans.fillText(str, 0,  4 * can.height / 7.5) // 绘制文字



  // 创建一个div元素
  const div = document.createElement('div')
  div.id = id // 设置id
  div.style.pointerEvents = 'none' // 取消所有事件
  div.style.top = '0px'
  div.style.left = '0px'
  div.style.opacity = 0.2 // 调节字体颜色的深浅
  div.style.position = 'absolute'
  div.style.zIndex = '100000'
  div.style.width = containerWidth + 'px'
  div.style.height = containerHeight + 'px'
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat'
  container.appendChild(div) // 追加到页面

  return id
}

// 该方法只允许调用一次
watermarkSingle.set = (str,str1,str2, container) => {
  let id = setWatermark(str,str1,str2, container)
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str,str1,str2, container)
    }
  }, 500)
  // 监听页面大小的变化
  window.onresize = () => {
    setWatermark(str,str1,str2, container)
  }
}

export default watermarkSingle
