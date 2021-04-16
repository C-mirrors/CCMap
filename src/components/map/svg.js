let oDiv = null // svg对应的dom对象
let vbCX = 0
let vbCY = 0
let vbCW = 0
let vbCH = 0
let zoomVal = 0 // 放大缩小累计值
let zoomStepSize = 20 // 放大缩小每次改变的步长20
let removeFlag = false // 控制点击拖动，区分未点击时的鼠标移动
let startX = 0 // 起始值x坐标
let startY = 0 // 起始值y坐标
let moveX = 0 // 水平移动量，往左为正
let moveY = 0 // 垂直移动量，往上为正
let endX = 0 // 最终到达的x坐标
let endY = 0 // 最终到达的y坐标
let zoomW = 41 // 初始值 > zoomStepSize * 2 初次滚动后即可得到准确的当前值
let zoomH = 41 // 初始值 > zoomStepSize * 2 初次滚动后即可得到准确的当前值
let zoomX = 0
let zoomY = 0

// 加载SVG图像
module.exports.Init = function (svgId) {
    oDiv = document.getElementById(svgId).firstChild
    getCurrentVB() // svg图层参数初始化
    // 挂载监听鼠标事件，考虑兼容性，兼容火狐DOMMouseScroll事件
    addEvent(oDiv, 'mousewheel', onMouseWheel)
    addEvent(oDiv, 'DOMMouseScroll', onMouseWheel)
    oDiv.addEventListener('mousedown', moveDownMouse, false)
    oDiv.addEventListener('mouseup', moveUpMouse, false)
    oDiv.addEventListener('mousemove', moveMouse, false)
}

// 鼠标滚轮事件
function onMouseWheel(e) {
    let ev = e || window.event
    let down = true
    // ev.wheelDelta已定义，ev.wheelDelta < 0为true表示往下滚动，为false表示往上滚动
    // ev.wheelDelta未定义，ev.detail > 0为true表示往下滚动，为false表示往上滚动
    // wheelDelta和detail正好相反，火狐中wheelDelta未定义只能使用detail
    down = ev.wheelDelta ? ev.wheelDelta < 0 : ev.detail > 0
    if (down) {
        zoomOut() // 缩小
    } else {
        zoomIn() // 放大
    }
    if (ev.preventDefault) {
        ev.preventDefault()
    }
    return false
}
function zoomIn() {
    if (zoomW > zoomStepSize * 2 && zoomH > zoomStepSize * 2) {
        zoomVal += zoomStepSize
        zoomTo('in')
    }
}
function zoomOut() {
    zoomVal -= zoomStepSize
    if (zoomVal >= -zoomStepSize * 11) {
        zoomTo('out')
    } else {
        zoomVal = -zoomStepSize * 11 // 最小缩至-220不能再缩了
    }
}
function zoomTo(flag) {
    // 变化之前获取当前viewBox的位置
    getCurrentVB()
    // *********** 放大缩小后的各值的计算 开始 ***********
    if (flag === 'in') {
        zoomX = vbCX + zoomStepSize
        zoomY = vbCY + zoomStepSize
        zoomW = vbCW - zoomStepSize * 2
        zoomH = vbCH - zoomStepSize * 2
    } else {
        zoomX = vbCX - zoomStepSize
        zoomY = vbCY - zoomStepSize
        zoomW = vbCW + zoomStepSize * 2
        zoomH = vbCH + zoomStepSize * 2
    }
    // *********** 放大缩小后的各值的计算 结束 ***********
    // 将计算的结果赋予viewBox刷新当前展示的视图位置
    oDiv.setAttributeNS(null, 'viewBox', zoomX + ' ' + zoomY + ' ' + zoomW + ' ' + zoomH)
    // 变化之后获取当前viewBox的位置 保证了 vbCX vbCY vbCW vbCH始终为当前viewBox的值
    endZoom()
}
function endZoom() {
    getCurrentVB()
    // 视图发生系列缩放改变后最终的(x, y)坐标记录下来，用于放大后拖动
    endX = vbCX
    endY = vbCY
}

// 鼠标点击事件
function moveDownMouse(evt) {
    removeFlag = true
    startX = parseInt(evt.clientX) // 当前点击的点的横坐标
    startY = parseInt(evt.clientY) // 当前点击的点的纵坐标
}
// 鼠标移动事件
function moveMouse(evt) {
    if (removeFlag) {
        oDiv.setAttributeNS(null, 'style', 'cursor: move')
        moveX = parseInt(evt.clientX) - startX // 当前点-原始点=移动量
        moveY = parseInt(evt.clientY) - startY // 当前点-原始点=移动量
        vbCX = endX - moveX
        vbCY = endY - moveY
        // 刷新当前viewBox展示的视图位置
        oDiv.setAttributeNS(null, 'viewBox', vbCX + ' ' + vbCY + ' ' + vbCW + ' ' + vbCH)
    }
}
// 鼠标点击后松开事件
function moveUpMouse(evt) {
    oDiv.setAttributeNS(null, 'style', 'cursor: default')
    // 视图发生系列移动后最终的(x, y)坐标记录下来，用于放大后拖动
    endX = vbCX
    endY = vbCY
    removeFlag = false
}

// 获取当前视图VB的位置信息
function getCurrentVB() {
    // console.log(oDiv.clientWidth)
    vbCX = parseFloat(oDiv.viewBox.animVal.x)
    vbCY = parseFloat(oDiv.viewBox.animVal.y)
    vbCW = parseFloat(oDiv.viewBox.animVal.width)
    vbCH = parseFloat(oDiv.viewBox.animVal.height)
}
// 绑定事件到dom节点，考虑到兼容性
function addEvent(obj, xEvent, fn) {
    if (obj.attachEvent) {
        obj.attachEvent('on' + xEvent, fn)
    } else {
        obj.addEventListener(xEvent, fn, false)
    }
}