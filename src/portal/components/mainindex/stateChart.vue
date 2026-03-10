<!--首页-交易图表-->
<template>
  <div class="h-stste-chart">
    <div class="h-stste-chart-title">
      <span>今天，{{ today.date }}，{{ today.week }}</span>
      <div class="h-stste-chart-btn-group">
        <em :class="chartType == 1 ? 'active': ''" @click="getChartData(1)">日</em>
        <em :class="chartType == 2 ? 'active': ''" @click="getChartData(2)">月</em>
        <em :class="chartType == 3 ? 'active': ''" @click="getChartData(3)">年</em>
      </div>
    </div>
    <div class="h-stste-chart-con" id="myChart" style="{width: '100%', height: '154px'}">
    </div>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";
  // 引入基本模板
  let echarts = require('echarts/lib/echarts')
  // 引入柱状图组件
  require('echarts/lib/chart/bar')
  // 引入提示框和title组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/grid')
  require('echarts/lib/component/legend')

  export default {
    name: "stateChart",
    data() {
      return {
        today: {
          date: "",
          week: ""
        },
        weekArray : ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],
        chartType: 1,
        // 图表类目
        chartDate: [],
        // 图表数据一(金额)
        chartMoneyData:[],
        // 图表数据二(张)
        chartNumData: []
      };
    },
    props: {
      busiClassify: {//是否直连模式界面
        type: String,
        default: "1"
      },
      screenWidth: {//屏幕宽度
        type: Number,
        default: document.documentElement ? document.documentElement.clientWidth : ''
      }
    },
    computed: {
      // 左侧目录折叠状态
      sidebarOpened() {
        return this.$store.state.app.sidebar.opened
      }
    },
    watch: {
      sidebarOpened(newV, oldV) {
        if (newV != oldV) {
          this.resizePie();
        }
      },
      screenWidth(newV, oldV) {
        this.resizePie();
      }
    },
    methods: {
      //查询图表显示数据
      getChartData(type) {
        this.chartType = type;
        post({ flag: type },"/homePageRemind/selectHomePageRemind").then(res=>{
          if(res){
            if(res.data.retCode === "000000"){
              let data = res.data.retData;
              this.chartMoneyData = [
                data.acptDayMoneyData==null?[]:data.acptDayMoneyData,
                data.discDayMoneyData==null?[]:data.discDayMoneyData,
                data.rebuyDayMoneyData==null?[]:data.rebuyDayMoneyData];
              this.chartNumData = [
                data.acptDayNumData==null?[]:data.acptDayNumData,
                data.discDayNumData==null?[]:data.discDayNumData,
                data.rebuyDayNumData==null?[]:data.rebuyDayNumData];
              if (this.chartType == 1) { // 日
                this.chartDate = ['今日'];
              } else if(this.chartType == 2){ // 月
                this.chartDate = ['1', '2', '3', '4', '5', '6', '7',  '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',  '18', '19', '20', '21', '22', '23', '24', '25', '26', '27',  '28', '29', '30', '31'];
              } else {  // 年
                this.chartDate = ['1月', '2月', '3月', '4月', '5月', '6月', '7月',  '8月', '9月', '10月', '11月', '12月'];
              }
              this.drawPie(this.chartType, this.chartDate, this.chartMoneyData, this.chartNumData);
            } else {
              // 公共报错信息
            }
          } else {
            // 公共报错信息
          }
        });
      },
      // 画柱状图
      drawPie(types, date, moneyData, chartNumData) {
        let myChart = echarts.init(document.getElementById('myChart'));
        let _this = this;
        let option = {
          legend: {
            left: 0,
            top: 5
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type : 'none'  // 默认为直线，可选为：'line' | 'shadow'
            },
            padding: [5, 20, 5, 10],
            backgroundColor: '#ffffff',
            extraCssText: 'box-shadow: 0 0 6px #333333;',
            textStyle: {
              color: '#666666',
              fontSize: 12
            },
            formatter: (params) => {
              let res = '';
              if (types == 0) {
                res = '<p>今日：</p>';
              } else {
                res = '<p>' + params[0].name + '：</p>';
              };
              let index=[];
              for (let i = 0; i < params.length; i++) {
                if(_this.busiClassify !== '1' && params[i].seriesName === '交易'){
                  index.push(params[i]);
                }
              }
              if(_this.busiClassify !== '1'){
                params=index;
              }
              for (let i = 0; i < params.length; i++) {
                if (params[i].seriesName === '交易') {
                  res +='<p>' +  params[i].seriesName + '笔数/笔：' + '<span style="color: #3F91E8">' + chartNumData[2][params[i].dataIndex] + '</span></p>';
                } else if (params[i].seriesName === '承兑') {
                  res +='<p>' +  params[i].seriesName + '张数/张：' + '<span style="color: #3F91E8">' + chartNumData[0][params[i].dataIndex] + '</span></p>';
                } else if (params[i].seriesName === '贴现') {
                  res +='<p>' +  params[i].seriesName + '张数/张：' + '<span style="color: #3F91E8">' + chartNumData[1][params[i].dataIndex] + '</span></p>';
                }
                res +='<p>' +  params[i].seriesName + '金额/万元：' + '<span style="color: #FF5A5A">' + params[i].data + '</span></p>';
              };
              return res;
            }
          },
          grid: {
            show: false,
            containLabel: true,
            left: 0,
            top: 40,
            right: 10,
            bottom: 5
          },
          xAxis : [
            {
              type: 'category',
              boundaryGap: true,
              axisLine: {    // 轴线
                show: true,
                lineStyle: {
                  color: '#eeeeee'
                }
              },
              axisTick: {    // 轴标记
                show:false
              },
              axisLabel: {
                interval: 'auto',
                margin: 5,
                formatter: '{value}',
                textStyle: {
                  color: '#999999',
                  fontSize: 12
                }
              },
              data: date
            }
          ],
          yAxis : [
            {
              type: 'value',
              splitLine: {
                lineStyle: {
                  color: '#eeeeee'
                }
              },
              axisLine: {    // 轴线
                show: true,
                lineStyle: {
                  color: '#ffffff'
                }
              },
              axisTick: {    // 轴标记
                show:false
              },
              axisLabel: {
                show:false
              }
            }
          ],
        };
        option.series= [
          {
            type: 'bar',
            name: '交易',
            data: moneyData[2],
            barMaxWidth: 100,
            itemStyle: {
              barBorderRadius: [100, 100, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#FCB600'
              }, {
                offset: 1,
                color: '#FEDE8D'
              }])
            }
          }
        ];
        if(this.busiClassify === '1'){
          option.series.unshift( {
              type: 'bar',
              name: '承兑',
              data: moneyData[0],
              barMaxWidth: 100,
              itemStyle: {
                barBorderRadius: [100, 100, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#3D8FE8'
                }, {
                  offset: 1,
                  color: '#70C2F5'
                }])
              }
            },
            {
              type: 'bar',
              name: '贴现',
              data: moneyData[1],
              barMaxWidth: 100,
              itemStyle: {
                barBorderRadius: [100, 100, 0, 0],
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: '#7DC013'
                }, {
                  offset: 1,
                  color: '#9CD96F'
                }])
              }
            })
        }
        myChart.setOption(option);

      },
      // resize柱状图
      resizePie() {
        if (this.$route.path === "/mainIndex") {
          let myChart = echarts.init(document.getElementById('myChart'));
          myChart.resize();
        }
      }
    },
    mounted(){
      let isShowMainindex = window.sessionStorage.getItem("isShowMainindex");
      if(isShowMainindex === "1"){
        this.getChartData(this.chartType);
        let workDate = window.sessionStorage.getItem("workDate");
        this.today.date = this.$moment(workDate, "YYYYMMDD").format("YYYY-MM-DD");
        this.today.week = this.weekArray[new Date(this.today.date).getDay()];
      }
    },
  };
</script>

<style scoped>

</style>
