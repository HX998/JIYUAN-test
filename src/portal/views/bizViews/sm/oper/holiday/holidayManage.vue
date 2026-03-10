<!--节假日管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div class="h-form-search-box h-holiday">
          <h-panel class="clearfix">
            <h-form :model="formItem" :label-width="50" ref="formItem" cols="4" class="h-form-search">
              <h-form-item prop="year" :label="$t('m.i.oper.year')" required>
                <h-select v-model="formItem.year" placeholder="">
                  <h-option v-for="item in yearList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="month" :label="$t('m.i.oper.month')" required>
                <h-select v-model="formItem.month" placeholder="">
                  <h-option v-for="item in monthList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item class="h-form-operate two-form">
                <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
          </h-panel>
        </div>
      </h-col>
    </h-row>
    <div class="h-holiday-calendar">
      <div class="h-holiday-operate" v-if="isShow">
        <h-button type="primary" @click="addYear">{{$t("m.i.oper.addYear")}}</h-button>
        <h-button type="primary" @click="save">{{$t("m.i.common.save")}}</h-button>
      </div>
      <div class="h-holiday-table">
        <div class="h-holiday-header">{{tableTitle}}</div>
        <div class="h-holiday-weekday">
          <span>周一</span>
          <span>周二</span>
          <span>周三</span>
          <span>周四</span>
          <span>周五</span>
          <span>周六</span>
          <span>周日</span>
        </div>
        <ul class="h-holiday-content clearfix">
          <li v-for="(item,index) in beforeMonth" :key="item"></li>
          <li v-for="(item,index) in monthDayList.holidayDtos" :key="item.id"
              :class="{'h-holiday-on':item.isHoliday=='1'}">
            <i>{{index+1}}</i>
            <div class="h-holiday-check" v-if="isShow">
              <span class="h-checkbox" :class="{'h-checkbox-checked':item.isHoliday=='1' ? true:false}">
                <span class="h-checkbox-inner"></span>
                <input type="checkbox" class="h-checkbox-input" :checked="item.isHoliday=='1' ? true:false"
                       @click="checkDay(item)"/>
              </span>
            </div>
            <input class="h-holiday-title" v-show="item.isHoliday==='1'" @change="addDesc(item)"
                   v-model="item.holidayName"/>
          </li>
          <li v-for="(item,index) in nextMonth" :key="item"></li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "holidayManage",
    data() {
      return {
        formItem : {
          year: "",
          month: ""
        },
        //给按钮赋权限
        authObj : {
          addYear: true,        //新增年份
          submitHoliday: true   //保存
        },
        tableTitle : "",
        //年份
        yearList : [],
        //月份
        monthList : [
          { key: "1", value: "1月" },
          { key: "2", value: "2月" },
          { key: "3", value: "3月" },
          { key: "4", value: "4月" },
          { key: "5", value: "5月" },
          { key: "6", value: "6月" },
          { key: "7", value: "7月" },
          { key: "8", value: "8月" },
          { key: "9", value: "9月" },
          { key: "10", value: "10月" },
          { key: "11", value: "11月" },
          { key: "12", value: "12月" }
        ],
        //总共需要多少个li
        totalNum : 35,
        //第一天是星期几
        firstDay : 1,
        //月份之前空的li
        beforeMonth : [],
        //月份之后空的li
        nextMonth : [],
        //每月数据
        monthDayList : {
          holidayDtos: [],
          maxYear: "",
          minYear: ""
        },
        //节假日描述弹框
        holidayDescWin : false,
        //保存修改的节假日数据
        holidayData : new Map(),
      }
    },
    computed: {
      isShow() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        let userType = userInfo.userType;
        return userType === "1";
      }
    },
    methods: {
      queryHoliday(type) {
        post(this.formItem, "/sm/oper/holiday/holidayManage/func_queryHoliday").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let holidayDtos = res.data.retData.holidayDtos;
              this.monthDayList.holidayDtos = (holidayDtos instanceof Array) ? holidayDtos : [holidayDtos];
              let minYear = res.data.retData.minYear;
              if (minYear === 0 || minYear == null) {
                this.monthDayList.maxYear = "";
                this.monthDayList.minYear = "";
              } else {
                this.monthDayList.maxYear = res.data.retData.maxYear;
                this.monthDayList.minYear = res.data.retData.minYear;
              }
              if (type !== "query" && this.monthDayList.minYear !== "") {
                for (let k = this.monthDayList.minYear; k <= this.monthDayList.maxYear; k++) {
                  this.yearList.push({ key: k.toString(), value: k + "年" });
                }
              }
              this.calBlank();
            } else {
              this.monthDayList.holidayDtos = [];
              this.monthDayList.maxYear = "";
              this.monthDayList.minYear = "";
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.beforeMonth = [];
            this.nextMonth = [];
            this.holidayData = new Map();
            this.getTableTitle();
            this.queryHoliday("query");
          }
        });
      },
      formSearchReset() {
        let date = new Date();
        this.formItem.year = date.getFullYear().toString();
        this.formItem.month = (date.getMonth() + 1).toString();
      },
      //新增年份
      addYear() {
        let year = "";
        if (this.yearList.length !== 0) {
          year = (parseInt(this.yearList[this.yearList.length - 1].key) + 1).toString();
        } else {
          year = new Date().getFullYear().toString();
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.oper.addYear") + "确认",
          content: "确认增加" + year + "年的天数？",
          onOk: () => {
            this.handleAdd(year);
          }
        });
      },
      handleAdd(year) {
        post({ code: year }, "/sm/oper/holiday/holidayManage/func_addHolidayOfYear").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.yearList.push({ key: year.toString(), value: year + "年" });
              this.formSearchReset();
              this.formSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //保存
      save() {
        if (this.holidayData.size > 0) {
          this.$hMsgBox.confirm({
            title: "修改节假日确认",
            content: "确认要修改的节假日选择正确",
            onOk: () => {
              this.handleSave();
            }
          });
        } else {
          this.$msgTip.info(this, { info: "节假日未进行修改，不需要保存" });
        }
      },
      handleSave() {
        let holidayDtos = [];
        for (let holidayDto of this.holidayData.values()) {
          holidayDtos.push(holidayDto);
        }
        post({ holidayDtos: holidayDtos }, "/sm/oper/holiday/holidayManage/func_updateHoliday").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              // this.formSearchReset();
              this.formSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      dayOfWeek(day) {
        switch (day) {
          case "星期一":
            return 1;
            break;
          case "星期二":
            return 2;
            break;
          case "星期三":
            return 3;
            break;
          case "星期四":
            return 4;
            break;
          case "星期五":
            return 5;
            break;
          case "星期六":
            return 6;
            break;
          case "星期天":
            return 7;
            break;
        }
      },
      //计算空余的li
      calBlank() {
        if (this.monthDayList.holidayDtos.length !== 0) {
          this.firstDay = this.dayOfWeek(this.monthDayList.holidayDtos[0].theWeek);
          let beforeLen = this.firstDay - 1;
          this.totalNum = (Math.ceil((beforeLen + this.monthDayList.holidayDtos.length) / 7)) * 7;
          let nextLen = this.totalNum - this.monthDayList.holidayDtos.length - beforeLen;
          for (let i = 0; i < beforeLen; i++) {
            this.beforeMonth.push("before" + i);
          }
          for (let j = 0; j < nextLen; j++) {
            this.nextMonth.push("next" + j);
          }
        }
      },
      checkDay(item) {
        if (item.isHoliday === "1") {
          item.isHoliday = "0";
          item.holidayName = "";
        } else {
          item.isHoliday = "1";
          item.holidayName = "节假日";
        }
        if (this.holidayData.get(item.id) == null) {
          this.holidayData.set(item.id, {
            id: item.id,
            theDate: item.theDate,
            isHoliday: item.isHoliday,
            holidayName: item.holidayName
          });
        } else {
          this.holidayData.delete(item.id);
        }
      },
      addDesc(item) {
        if (this.holidayData.get(item.id) != null) {
          this.holidayData.get(item.id).holidayName = item.holidayName;
        } else {
          this.holidayData.set(item.id, {
            id: item.id,
            theDate: item.theDate,
            isHoliday: item.isHoliday,
            holidayName: item.holidayName
          });
        }
      },
      //获取表格标题
      getTableTitle() {
        this.tableTitle = this.formItem.year + "年" + this.formItem.month + "月";
      }
    },
    mounted() {
      let date = new Date();
      this.formItem.year = date.getFullYear().toString();
      this.formItem.month = (date.getMonth() + 1).toString();
      this.tableTitle = this.formItem.year + "年" + this.formItem.month + "月";
      //获取初始数据
      this.queryHoliday();
    }
  };
</script>
<style scoped>
  .h-holiday-header {
    height: 40px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }
</style>
