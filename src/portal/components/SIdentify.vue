<!--随机生成验证码-->
<template>
  <div class="s-canvas" @mousedown="refreshCode">
    <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
  </div>
</template>

<script>
  export default {
    name: "SIdentify",
    data() {
      return {
        contentWidth:  108, //画布宽度
        contentHeight: 42   //画布高度
      }
    },
    props: {
      identifyCode: {//待展示验证码
        type: String,
        default: "1234"
      },
      fontSizeMin: {//字体大小，最小值
        type: Number,
        default: 25
      },
      fontSizeMax: {//字体大小，最大值
        type: Number,
        default: 30
      },
      backgroundColorMin: {//背景颜色色值最小值，最小为0
        type: Number,
        default: 160
      },
      backgroundColorMax: {//背景颜色色值最大值，最大为255
        type: Number,
        default: 255
      },
      colorMin: {//字体颜色色值最小值，最小为0
        type: Number,
        default: 0
      },
      colorMax: {//字体颜色色值最大值，最大为255
        type: Number,
        default: 160
      },
      lineColorMin: {//干扰线颜色色值最小值，最小为0
        type: Number,
        default: 100
      },
      lineColorMax: {//干扰线颜色色值最大值，最大为255
        type: Number,
        default: 255
      },
      dotColorMin: {//干扰点颜色色值最小值，最小为0
        type: Number,
        default: 0
      },
      dotColorMax: {//干扰点颜色色值最大值，最大为255
        type: Number,
        default: 255
      },
      showDrawLine: {
        type: Boolean,
        default: true
      },
      showDrawDot: {
        type: Boolean,
        default: true
      },
      rotateNum: {
        type: Number,
        default:45
      }
      // contentWidth: {//画布宽度
      //   type: Number,
      //   default: 108
      // },
      // contentHeight: {//画布高度
      //   type: Number,
      //   default: 42
      // }
    },
    methods: {
      refreshCode() {
        this.$emit("refreshCode", "");
      },
      // 生成一个随机数
      randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
      },
      // 生成一个随机的颜色
      randomColor(min, max) {
        let r = this.randomNum(min, max);
        let g = this.randomNum(min, max);
        let b = this.randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
      },
      drawPic() {
        let canvas = document.getElementById("s-canvas");
        let context = canvas.getContext("2d");
        context.textBaseline = "bottom";
        // 绘制背景
        context.fillStyle = this.randomColor(this.backgroundColorMin, this.backgroundColorMax);
        context.fillRect(0, 0, this.contentWidth, this.contentHeight);
        if (this.showDrawLine) {
          this.drawLine(context);
        }
        if (this.showDrawDot) {
          this.drawDot(context);
        }
        // 绘制文字
        for (let i = 0; i < this.identifyCode.length; i++) {
          this.drawText(context, this.identifyCode[i], i);
        }
      },
      drawText(context, txt, i) {
        context.fillStyle = this.randomColor(this.colorMin, this.colorMax);
        context.font = this.randomNum(this.fontSizeMin, this.fontSizeMax) + "px SimHei";
        let x = (i + 0.5) * (this.contentWidth / (this.identifyCode.length + 1));
        let y = this.randomNum(this.fontSizeMax, this.contentHeight - 5);
        // 修改坐标原点
        context.translate(x, y);
        context.fillText(txt, 0, 0);
        // 恢复坐标原点
        context.translate(-x, -y);
      },
      drawLine(context) {
        // 绘制干扰线
        for (let i = 0; i < 5; i++) {
          context.strokeStyle = this.randomColor(this.lineColorMin, this.lineColorMax);
          context.beginPath();
          context.moveTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight));
          context.lineTo(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight));
          context.stroke();
        }
      },
      drawDot(context) {
        // 绘制干扰点
        for (let i = 0; i < 80; i++) {
          context.fillStyle = this.randomColor(0, 255);
          context.beginPath();
          context.arc(this.randomNum(0, this.contentWidth), this.randomNum(0, this.contentHeight), 1, 0, 2 * Math.PI);
          context.fill();
        }
      },
      getContentWidth() {
        return window.document.getElementsByClassName("h-col-span-8").length > 0 ? window.document.getElementsByClassName("h-col-span-8")[0].clientWidth : this.contentWidth;
      },
      getContentHeight() {
        return window.document.getElementsByClassName('h-form-item').length > 0 ? window.document.getElementsByClassName('h-form-item')[0].clientHeight : this.contentHeight;
      },
    },
    watch: {
      identifyCode() {
        this.drawPic();
      }
    },
    created() {
      this.contentWidth = this.getContentWidth();
      this.contentHeight = this.getContentHeight();
    },
    mounted() {
      this.drawPic();
    }
  };
</script>

<style scoped>
  .s-canvas canvas {
    margin-top: 1px;
  }
</style>
