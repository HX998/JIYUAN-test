<template>
  <div class="h-datagrid">
    <div class="h-datagrid-title" v-if="isShowTitle" ref="gridTitle">
      <h4>{{ title }}</h4>
    </div>
    <div class="h-datagrid-toolbar" v-if="hasToolBar" ref="gridToolbar">
      <div class="pull-right" ref="listCheckBox" v-if="showListCkeckBox">
        <h-button type="ghost" @click="handlemultiple">
          <h-icon name="option" size="14" color="#999999"></h-icon>
        </h-button>
        <transition name="slide-up">
          <div v-show="this.showMultiple" class="h-table-checkBox-container">
            <h-checkbox-group class="h-table-checkBox-group" v-model="checked" v-for="(item,index,key) in showCol"
                              :key="item.key" @on-change="checkAllGroupChange(item)">
              <h-checkbox :label="item.key" class="h-table-checkBox">
                <span class="h-table-checkBox-item">{{item.title}}</span>
              </h-checkbox>
            </h-checkbox-group>
          </div>
        </transition>
      </div>
      <div class="h-advanced" ref="advancedRef" v-if="hasAdvanced">
        <h-button type="ghost" @click="handleAdvanced" class="h-bth">

          <h-icon name="tab-down" size="14" color="#999999"></h-icon>
        </h-button>
        <div v-show="this.showAdvanced" class="h-table-senior-container">
          <h-form :model="advancedParams.formItem" :label-width="90" ref="formItem"
                  :cols="advancedParams.formItemCols?advancedParams.formItemCols:4" class="h-form-search">
            <component :is="item.componentName" v-model="advancedParams.formItem[item.model]"
                       v-bind="item.componentProps" v-on="item.componentOns"
                       v-if="!!advancedParams.componentList && advancedParams.componentList.length > 0"
                       v-for="item in advancedParams.componentList"
                       :key="item.model"></component>
          </h-form>
          <div slot="toolbar" class="pull-center">
            <h-button type="primary"
                      @click="advancedParams.hasOwnProperty('formSearch')?advancedParams.formSearch():formSearch()">
              {{ $t("m.i.common.search") }}
            </h-button>
            <h-button type="ghost"
                      @click="advancedParams.hasOwnProperty('formSearchReset')?advancedParams.formSearchReset():formSearchReset()">
              {{ $t("m.i.common.reset") }}
            </h-button>
          </div>
        </div>
      </div>
      <slot name="toolbar"></slot>
      <!-- <h-button type="ghost" icon="addition" @click="exportCsv()">{{$t('m.i.common.download')}}</h-button> -->
    </div>
    <div class="h-datagrid-total" v-if="hasTotalInfo" ref="gridTotal">
      <h-row>
        <h-col span="8" v-for="(item, index) in totalInfo" :key="index">
          <h-col span="9" class="label">{{ item.label }}：</h-col>
          <h-col span="15" class="val">{{ item.val }}</h-col>
        </h-col>
      </h-row>
    </div>
    <div ref="selfAdaptTable" class="h-table-box">
      <h-table-min :data="tData" :columns="tColumns"
                   :border="border"
                   :paramId="paramId"
                   :size="size"
                   :stripe="stripe"
                   :show-header="showHeader"
                   :width="width"
                   :height="fixedHeight"
                   :canDrag="false"
                   :canMove="true"
                   :minColWidth="minColWidth"
                   :notSetWidth="notSetWidth"
                   :loading="loadingData"
                   :disabled-hover="disabledHover"
                   :highlight-row="highlightRow"
                   :rowSelect="rowSelect"
                   :row-class-name="rowClassName"
                   :no-data-text="onDataText"
                   :no-filtered-data-text="noFilteredDataText"
                   :patibleHeight="patibleHeight"
                   :showListCkeckBox="showListCkeckBox"
                   :show-title="showTitle"
                   @on-row-click="onRowClick"
                   @on-row-dblclick="onRowDbClick"
                   @on-current-change="onCurrentChange"
                   @on-current-change-cancle="onCurrentChangeCancel"
                   @on-select="mutiSelect"
                   @on-select-cancel="cancelSelect"
                   @on-select-all="mutiAllSelect"
                   @on-selection-change="onSelectChange"
                   @on-sort-change="onSortChange"
                   @on-expand="onExpand"
                   ref="gridContent"></h-table-min>
    </div>
    <h-page :current="pageInfo.pageNo"
            :total="total"
            :page-size="pageInfo.pageSize"
            :size="pageSizeType"
            :placement="placement"
            :simple="simple"
            :show-total="showTotal"
            :show-elevator="showElevator"
            :show-sizer="showSizer"
            :pageSizeOpts="pageSizeOpts"
            :class-name="className"
            :styles="styles"
            @on-change="dataChange($event, null, 'inside')"
            @on-page-size-change="pageSizeChange"
            ref="gridPage" v-if="hasPage"></h-page>
  </div>
</template>
<script>
  const prefixCls = "h-datagrid";
  import Emitter from "@/utils/emitter";
  import { mapGetters } from "vuex";
  import { on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "HDatagrid",
    data() {
      return {
        notSetWidth: true,
        patibleHeight: true,
        selfHeight: 0,
        fixedHeight: this.height,
        switchSizeTableHeight: 0,   //记录拖动前的表格高度，用于最大化后的还原
        tColumns: [],
        tempColumns: [],
        tData: [],
        total: 0,
        sumMoney: 0,
        statDatas:'',
        dataInfo: {},
        pageInfo: {
          pageNo: this.current || 1,
          pageSize: this.pageSize || 10
        },
        isShowTitle: this.hasTitle,
        hasToolBar: true,
        loadingData: false, //仅在url中生效，非URL在外部配置,
        showMultiple: false,
        showAdvanced: false,
        checked: [],
        showCol: [],
        selects: [], // 分页多选数据对象
        selectIds: [], // 分页多选数据记录id
        oldSelects: {}, //用于存储分页全选的数据对象
        curHasSelect: true, //是否选中了记录
        isMsgboxFirstOpen: true,
        isMsgboxMax: false,
        checkedItems: {}
      };
    },
    mixins: [Emitter],
    props: {
      rowSelect: { // 多选时
        type: Boolean,
        default: false
      },
      hasSelect: { // 是否选中了记录
        type: Boolean,
        default: true
      },
      title: String,//表格列表头部信息,
      showListCkeckBox: { //是否显示自定义表格选项框
        type: Boolean,
        default: true
      },
      hasTitle: { //是否有title
        type: Boolean,
        default: false
      },
      showTitle: {
        type: Boolean,
        default: true
      },
      minColWidth: {
        type: Number,
        default: 90
      },
      gridData: Object, // 数据信息，包含表格信息rows及分页信息total[可以通过property自定义rows字段]
      columns: Array,
      border: {
        type: Boolean,
        default: true
      },
      size: {
        type: String,
        default: "small"
      },
      pageSizeType: String,
      stripe: {
        type: Boolean,
        default: true
      },
      showHeader: {
        type: Boolean,
        default: true
      },
      width: [Number, String],
      height: [Number, String],
      canDrag: {
        type: Boolean,
        default: true
      },
      disabledHover: {
        type: Boolean,
        default: false
      },
      highlightRow: {
        type: Boolean,
        default: false
      },
      hasAdvanced: { // 是否显示高级查询框
        type: Boolean,
        default: false
      },
      advancedParams: {
        type: Object,
        default() {
          return {
          };
        }
      },
      rowClassName: Function,
      onDataText: String,
      noFilteredDataText: String,
      onRowClick: {
        type: Function,
        default() {
          return "";
        }
      },
      onRowDbClick: {
        type: Function,
        default() {
          return "";
        }
      },
      onCurrentChange: {
        type: Function,
        default() {
          return "";
        }
      },
      onCurrentChangeCancel: {
        type: Function,
        default() {
          return "";
        }
      },
      onSelect: {
        type: Function,
        default() {
          return "";
        }
      },
      onSelectCancel: {
        type: Function,
        default() {
          return "";
        }
      },
      onSelectAll: {
        type: Function,
        default() {
          return "";
        }
      },
      onSelectChange: {
        type: Function,
        default() {
          return "";
        }
      },
      onSortChange: {
        type: Function,
        default() {
          return "";
        }
      },
      onExpand: {
        type: Function,
        default() {
          return "";
        }
      },
      current: Number,
      pageSize: Number,
      placement: {
        type: String,
        default: "top"
      },
      paramId: {
        type: String,
        default: "id"
      },
      pageSizeOpts: {
        type: Array,
        default() {
          return [10, 30, 50, 100, 200, 500];
        }
      },
      simple: Boolean,
      showTotal: {
        type: Boolean,
        default: true
      },
      showElevator: {
        type: Boolean,
        default: true
      },
      showSizer: {
        type: Boolean,
        default: true
      },
      className: String,
      styles: Object,
      hasPage: { //是否显示分页
        type: Boolean,
        default: true
      },
      getDataFunc: { //分页获取data函数，该参数必须配gridData || 无分页情况,直接返回rows,同时配置get-data事件
        type: Boolean,
        default: false
      },
      // getData: Function, //分页获取data函数，该参数必须配gridData || 无分页情况,直接返回rows
      url: String, //参考2.0 通过url请求数据
      bindForm: Object,
      autoLoad: { //设置URL时是否自动加载数据，默认true
        type: Boolean,
        default: true
      },
      loading: { // 非url时使用
        type: Boolean,
        default: false
      },
      selfAdaptTable: { //暴露给用户ref属性,设置此属性后，表格根据页面高度自适应，不设置此属性按照给定的高度值给表格设定高度
        type: String,
        default: "tableHeight"
      },
      property: {
        type: Object,
        default() { // 自定义返回字段
          return {
            total: "count",
            rows: "list",
            pageNo: "pageNo",
            pageSize: "pageSize",
            responseType: "retData",
            pageInfo: "pageInfo",
            sumMoney: "sumMoney",
            statDatas:"statDatas"
          };
        }
      },
      totalInfo: {
        type: Array,
        default() {
          return [];
        }
      },
      customCalculateHeight: {//自定义计算表格高度方法
        type: Function
      },
      customCalculateParams: {//自定义计算表格高度方法所需参数
        type: [String, Object]
      }
    },
    watch: {
      selfHeight(val) {
        this.selfHeight = val;
      },
      current(val) {
        this.pageInfo.pageNo = val;
      },
      pageSize(val) {
        this.pageInfo.pageSize = val;
      },
      gridData: {
        handler(newValue, oldValue) {
          if (newValue && newValue[this.property.pageInfo] === undefined && newValue[this.property.rows] && newValue[this.property.rows].length > 0) {
            this.setSelectChecked(newValue[this.property.rows]);
            this.tData = newValue[this.property.rows];
          } else {
            if (newValue && newValue[this.property.pageInfo] && newValue[this.property.pageInfo][this.property.total] > 0 && newValue[this.property.rows]) {
              if (newValue[this.property.rows].length > 0) {
                this.setSelectChecked(newValue[this.property.rows]);
                this.tData = newValue[this.property.rows];
              } else {
                this.dataChange(1);
                return;
              }
            } else {
              this.tData = [];
            }
          }
          if (this.hasPage) {
            if (newValue && newValue[this.property.pageInfo] && newValue[this.property.pageInfo][this.property.total]) {
              this.pageInfo.pageNo = newValue[this.property.pageInfo].pageNo;
              this.pageInfo.pageSize = newValue[this.property.pageInfo].pageSize;
              this.total = newValue[this.property.pageInfo][this.property.total];
              this.sumMoney = newValue[this.property.pageInfo][this.property.sumMoney];
              this.statDatas = newValue[this.property.pageInfo][this.property.statDatas];
            } else {
              this.pageInfo.pageNo = 1;
              this.total = 0;
              this.sumMoney = null;
              this.statDatas = null;
            }
          }
          this.tColumns = [];
          this.$nextTick(() => {
            //弹窗界面显隐工具条优化
            if (this.msgBox.$options.name === "h-msg-box" && this.msgBox.value === true && this.isMsgboxFirstOpen) {
              this.isMsgboxFirstOpen = false;
              this.tempColumns = this.deepClone(this.columns);
              this.tColumns = this.tempColumns;
            } else {
              this.tColumns = this.tempColumns;
            }
            this.createShowCol(this.tColumns);
          })
        },
        deep: true
      },
      // bindForm: {
      //   // 对象深度观察
      //   handler: (val) => {
      //     this.pageInfo.pageNo = 1
      //     this.getDataListByUrl()
      //   },
      //   deep: true
      // }
      loading(val) {
        this.loadingData = val;
      },
      sidebar: {
        handler(val, oldVal) {
          if (!val.opened) {
            setTimeout(() => {
              this.$refs.gridContent.handleResize();
            }, 100);
          }
        },
        deep: true
      },
      "msgBox.$props": {
        handler(val, old) {
          if (this.msgBox.$options.name === "h-msg-box" && val.value === true) {
            this.isMsgboxFirstOpen = true;
            this.checkedItems = {};
          }
        },
        deep: true
      },
      columns: {
        handler(newVal, oldVal) {
          this.tempColumns = this.deepClone(newVal);
          this.tColumns = this.tempColumns;
        },
        deep: true
      }
    },
    computed: {
      hasTotalInfo: function() {
        if (this.totalInfo && this.totalInfo.length > 0) {
          return true;
        } else {
          return false;
        }
      },
      msgBox() {
        let parent = this.$parent;
        while (parent.$options.name !== "AppMain" && parent.$options.name !== "h-msg-box") {
          parent = parent.$parent;
        }
        return parent;
      },
      // tempColumns: {
      //   get(){
      //     return this.deepClone(this.columns);
      //   },
      //   set(val){
      //     this.tColumns = val;
      //   }
      // },
      ...mapGetters(["sidebar"])
    },
    methods: {
      formSearch(){
        this.dataChange(1);
        this.showAdvanced = false;
      },
      formSearchReset(){
        this.$refs.formItem.resetFields();
      },
      //翻页勾选后选中数据
      setSelectChecked(gridData) {
        for(let i = 0 ; i < this.selects.length; i++){
          if(this.selects[i].pageNo === this.pageInfo.pageNo){
            let j = gridData.findIndex((value,index,arr)=>{
              return value[this.paramId] === this.selects[i][this.paramId];
            });
            if(j >= 0) {
              gridData[j]._checked = true
            }
          }
        }
        //禁止选择当前项
        gridData.forEach((value, index, arr) => {
          if (value.disabled) {
            gridData[index]._disabled = true
          }
        });
      },
      //取消多选
      cancelSelect(arr, row) {
        let id = this.paramId;
        if (row) {
          let j = this.selects.findIndex(function(value, index, arrs) {
            return value[id] === row[id];
          });
          if (j > -1) {
            this.selects.splice(j, 1);
            this.selectIds.splice(j, 1);
          }
        }
      },
      //多选
      mutiSelect(arr) {
        if (arr.length > 0) {
          arr.map((item, index, arrs) => {
            item = Object.assign(item, { pageNo: this.pageInfo.pageNo });
            let i = this.selects.some(date => {
              if (date[this.paramId] == item[this.paramId]) {
                return true;
              }
            });
            if (!i) {
              this.selects.push(item);
              this.selectIds.push(item[this.paramId]);
            }
          });
        }
        if (this.hasPage) {
          // if ((this.total < this.pageInfo.pageSize && this.total === arr.length)
          //   || arr.length === this.pageInfo.pageSize) {
          //勾选数量与当前页数量一致时全选
          if (arr.length === this.tData.length) {
            this.oldSelects[this.pageInfo.pageNo] = arr;
          }
        }
      },
      //点击全选
      mutiAllSelect(arr) {
        let index = this.pageInfo.pageNo;
        if (arr.length > 0) {
          this.oldSelects[index] = arr;
          arr.map((item, index, arrs) => {
            item = Object.assign(item, { pageNo: this.pageInfo.pageNo });
            //下面这种方法查找位置，会出问题，当item里的属性位置和selects里的属性顺序不一致，会出错
            //let i = JSON.stringify(this.selects).indexOf(JSON.stringify(item));
            let i = this.selects.some(date => {
              if (date[this.paramId] == item[this.paramId]) {
                return true;
              }
            });
            if (!i) {
              this.selects.push(item);
              this.selectIds.push(item[this.paramId]);
            }
          });
        } else {
          for (let selectArr of this.oldSelects[index]) {
            this.cancelSelect(arr, selectArr);
          }
          delete this.oldSelects[index];
        }
      },
      // cb 分页查询回调，获取查询结果处理
      getDataListByUrl(cb) {
        // 是否有分页存在
        this.loadingData = true;
        if (this.curHasSelect) {
          this.selects = [];
          this.selectIds = [];
        }
        if (this.hasPage) {
          let query = this.pageInfo;
          Object.assign(query, this.bindForm);
          Object.assign(query, { loading: false });
          this.$http.post(this.url, query).then(res => {
            if (res && res.data.retCode === '000000' && res.data.retData) { //token过期判定
              this.loadingData = false;
              res = res["data"];
              if (res[this.property.responseType][this.property.pageInfo][this.property.total]
                && res[this.property.responseType][this.property.pageInfo][this.property.total] > 0
                && res[this.property.responseType][this.property.rows]) {
                this.setSelectChecked(res[this.property.responseType][this.property.rows]);
                if (res[this.property.responseType][this.property.rows].length > 0) {
                  this.tData = res[this.property.responseType][this.property.rows];
                  this.total = res[this.property.responseType][this.property.pageInfo][this.property.total];
                  this.sumMoney = res[this.property.responseType][this.property.pageInfo][this.property.sumMoney];
                  this.statDatas = res[this.property.responseType][this.property.pageInfo][this.property.statDatas];
                } else {
                  this.dataChange(1);
                  return;
                }
              } else {
                this.tData = [];
                this.total = 0;
                this.sumMoney = null;
                this.statDatas = null;
              }
            } else {
              this.loadingData = false;
              this.tData = [];
              this.total = 0;
              this.sumMoney = null;
              this.statDatas = null;
              if(res && typeof(res.data) == 'string'){
                this.$msgTip.info(this, { info: res.data ? res.data.retMsg:'暂无数据' });
              } else if(res && res.data.retMsg) {
                this.$msgTip.info(this, { info: res.data.retMsg });
              }
            }
            this.$nextTick(function() {
              this.$emit("getTotal", this.total);
              this.$emit("getTData", this.tData);
              this.$emit("getSumMoneyAndTotal", { sumMoney: this.sumMoney, total: this.total, statDatas: this.statDatas});
            });
            if(cb) cb(this.tData);
          });
        } else {
          let query = this.bindForm;
          this.$http.post(this.url, query).then(res => {
            if (res && res.data.retCode === '000000' && res.data.retData) {
              this.loadingData = false;
              res = res["data"];
              if (res[this.property.responseType].length > 0) {
                this.tData = res[this.property.responseType];
                this.total = 0;
                this.sumMoney = null;
                this.statDatas = null;
              } else if (res[this.property.responseType][this.property.pageInfo]
                && res[this.property.responseType][this.property.pageInfo][this.property.total]
                && res[this.property.responseType][this.property.pageInfo][this.property.total] > 0
                && res[this.property.responseType][this.property.rows]) {
                this.tData = res[this.property.responseType][this.property.rows];
                this.total = res[this.property.responseType][this.property.pageInfo][this.property.total];
                this.sumMoney = res[this.property.responseType][this.property.pageInfo][this.property.sumMoney];
                this.statDatas = res[this.property.responseType][this.property.pageInfo][this.property.statDatas];
              } else {
                this.tData = [];
                this.total = 0;
                this.sumMoney = null;
                this.statDatas = null;
              }
            } else {
              this.loadingData = false;
              this.tData = [];
              this.total = 0;
              this.sumMoney = null;
              this.statDatas = null;
              if(res && typeof(res.data) == 'string'){
                this.$msgTip.info(this, { info: res.data ? res.data.retMsg:'暂无数据' });
              } else if(res && res.data.retMsg) {
                this.$msgTip.info(this, { info: res.data.retMsg });
              }
            }
            this.$nextTick(function() {
              this.$emit("getTData", this.tData);
              this.$emit("getSumMoneyAndTotal", { sumMoney: this.sumMoney, total: this.total, statDatas: this.statDatas});
            });
            if(cb) cb(this.tData);
          });
        }
      },
      // 赋值
      setGridData() {
        if (this.gridData[this.property.rows]) {
          this.tData = this.gridData[this.property.rows];
        }
        if (this.hasPage) {
          if (this.gridData[this.property.pageInfo] && this.gridData[this.property.pageInfo][this.property.total]) {
            this.pageInfo.pageNo = this.gridData[this.property.pageInfo].pageNo;
            this.pageInfo.pageSize = this.gridData[this.property.pageInfo].pageSize;
            this.total = this.gridData[this.property.pageInfo][this.property.total];
            this.sumMoney = this.gridData[this.property.pageInfo][this.property.sumMoney];
            this.statDatas = this.gridData[this.property.pageInfo][this.property.statDatas];
          }
        }
      },
      getDataList(pageNo, pageSize, cb) {
        if (this.url) {
          this.getDataListByUrl(cb);
          this.$emit("on-page-change-url", pageNo, pageSize);//点击分页时，传递事件
        } else if (this.getDataFunc) {
          this.$nextTick(() => {
            if (this.hasPage) {
              this.$emit("get-data", this.pageInfo);
            } else {
              this.$emit("get-data");
            }
          });
        } else {
          this.$emit("on-page-change", pageNo, pageSize);
          // this.setGridData()
        }
      },
      // 点击上一页
      dataChange(i, cb, isAuto) {
        if (!!isAuto) {
          this.curHasSelect = false;
        } else {
          this.curHasSelect = true;
        }
        if (this.hasPage) {
          this.$refs.gridPage.clearElevator();
        }
        this.pageInfo.pageNo = i;
        if (cb == null || cb === undefined) {
          cb = () => {
            this.tColumns = [];
            this.$nextTick(() => {
              //弹窗界面显隐工具条优化
              if (this.msgBox.$options.name === "h-msg-box" && this.msgBox.value === true && this.isMsgboxFirstOpen) {
                this.isMsgboxFirstOpen = false;
                this.tempColumns = this.deepClone(this.columns);
                this.tColumns = this.tempColumns;
              } else {
                this.tColumns = this.tempColumns;
              }
              this.createShowCol(this.tColumns);
              this.$emit("callback", "");
            })
          }
        }
        this.getDataList(i, this.pageInfo.pageSize, cb);
        if ((typeof this.onCurrentChangeCancel()) !== "string") {//翻页后将单选框选中值置空
          this.onCurrentChangeCancel();
        }
      },
      // 页码改变
      pageSizeChange(i) {
        if (this.hasPage) {
          this.$refs.gridPage.clearElevator();
        }
        this.pageInfo.pageSize = i;
        this.pageInfo.pageNo = 1;
        this.selectIds = [];
        this.selects = [];
        this.oldSelects = {};
        this.getDataList(1, i);
        if ((typeof this.onCurrentChangeCancel()) !== "string") {//翻页后将单选框选中值置空
          this.onCurrentChangeCancel();
        }
      },
      // 反选某行的选中状态，仅多选
      toggleTableSelect(index) {
        if (this.$refs.gridContent.selectType) {
          this.$refs.gridContent.toggleSelect(index);
        } else (
          this.$hMessage.info("仅支持表格多选")
        );
      },
      // 表格导出功能
      exportCsv(params) {
        /* {
          filename:  '' // 文件名
          columns: []// 导出表格列
          data: [] // 导出表格数据
          noHeader: false //是否导出表格头
        } */
        this.$refs.gridContent.exportCsv(params);
      },
      printer(config) {
        // 具体各项配置参考http://printjs.crabbly.com/
        let printConfig = config ? config : {
          printable: [],
          properties: [],
          type: "json",
          gridHeaderStyle: "border: 1px solid #111;",
          gridStyle: "border: 1px solid #111;text-align:center;"
        };
        //printJS(printConfig)
      },
      bodyClick(event) {
        //实现点击页面空白地方使自定义列表项div消失
        let _this = this;
        if (!!_this.$refs.listCheckBox.contains(event.target)) return;
        // if (!!_this.$refs.advancedRef.contains(event.target)) return;
        _this.showMultiple = false;
        // _this.showAdvanced = false;
      },
      //显示多选框
      handlemultiple() {
        this.showMultiple = !this.showMultiple;
        this.showAdvanced = false;
        document.body.addEventListener("click", this.bodyClick, false);
      },
      //显示高级框
      handleAdvanced() {
        this.showAdvanced = !this.showAdvanced;
        this.showMultiple = false;
        document.body.addEventListener("click", this.bodyClick, false);
      },
      //控制列显示隐藏
      checkAllGroupChange(item) {
        // this.notSetWidth = false
        this.tempColumns.forEach((value, index) => {
          if(value.hiddenCol === undefined) {
            this.$set(value,'hiddenCol',false);
          }
          if (value.key == item.key) {
            value.hiddenCol = !value.hiddenCol;
            this.checkedItems[value.key] = value;
          }
        });
      },
      //计算表格高度
      calculateHeight() {
        let appObj = document.getElementsByClassName("app-main");
        let appOffsetTop = appObj.length === 0 ? 0 : appObj[0].offsetTop;
        // let objects = {
        //   // panelObj: window.document.getElementsByClassName("h-panel")[0],
        //   formItemObj: window.document.getElementsByClassName("h-form-item")[0],
        //   titleObj: window.document.getElementsByClassName("h-datagrid-title")[0],
        //   toolbarObj: window.document.getElementsByClassName("h-datagrid-toolbar")[0],
        //   pageObj: window.document.getElementsByClassName("h-page")[0]
        // };
        let windowHeight = window.innerHeight;
        let msgBoxHeight = 0;
        let extraHeight = 70;
        let formItemObj = this.$el.parentElement.getElementsByClassName("h-form-item").length > 0 ? this.$el.parentElement.getElementsByClassName("h-form-item")[0] : this.$root.$el.querySelector("#appMain").getElementsByClassName("h-form-item")[0];
        if(this.msgBox.$options.name === "h-msg-box") {
          if(window.sessionStorage.getItem("isTransfer") === "0") {//部分遮罩
            let contentTop = this.msgBox.$refs.msgbox.$refs.content.style.top;
            let msgBoxContentTop = this.msgBox.$refs.msgbox.$refs.content ? Number(contentTop.substring(0,contentTop.length-2)) : 0;
            // let isIE = navigator.userAgent.indexOf("MSIE") >= 0 || navigator.userAgent.indexOf("Trident") >= 0;
            // if(isIE && this.isMsgboxMax) {
            //   msgBoxContentTop = msgBoxContentTop - appOffsetTop
            // }
            let modalHeaderHeight = this.msgBox.$refs.msgbox.$refs.msgHeader ? this.msgBox.$refs.msgbox.$refs.msgHeader.offsetHeight : 0;
            let modalFooterHeight = this.msgBox.$refs.msgbox.$refs.msgFooter ? this.msgBox.$refs.msgbox.$refs.msgFooter.offsetHeight : 0;
            msgBoxHeight = modalHeaderHeight + modalFooterHeight + msgBoxContentTop + 10;
            formItemObj = this.msgBox.$refs.msgbox.$refs.content ? this.msgBox.$refs.msgbox.$refs.content.getElementsByClassName("h-form-item")[0] : formItemObj;
            windowHeight = appObj.length === 0 ? windowHeight : appObj[0].offsetHeight;
          } else if (window.sessionStorage.getItem("isTransfer") === "1") {//全局遮罩
            let contentTop = this.msgBox.$refs.content.style.top;
            let msgBoxContentTop = this.msgBox.$refs.content ? Number(contentTop.substring(0,contentTop.length-2)) : 0;
            let modalHeaderHeight = this.msgBox.$refs.msgHeader ? this.msgBox.$refs.msgHeader.offsetHeight : 0;
            let modalFooterHeight = this.msgBox.$refs.msgFooter ? this.msgBox.$refs.msgFooter.offsetHeight : 0;
            msgBoxHeight = modalHeaderHeight + modalFooterHeight + msgBoxContentTop + 10;
            formItemObj = this.msgBox.$refs.content ? this.msgBox.$refs.content.getElementsByClassName("h-form-item")[0] : formItemObj;
          }
          appOffsetTop = 0;
          if (typeof formItemObj == "undefined") {
            extraHeight = 50;
          }
        }
        let objects = {
          // formItemObj: this.$el.parentElement.getElementsByClassName("h-form-item")[0],
          formItemObj: formItemObj,
          titleObj: this.$el.getElementsByClassName("h-datagrid-title")[0],
          toolbarObj: this.$el.getElementsByClassName("h-datagrid-toolbar")[0],
          pageObj: this.$el.getElementsByClassName("h-page")[0]
        };
        let extralHeight = 0;
        Object.keys(objects).forEach(function(key, index) {
          if (typeof objects[key] != "undefined") {
            extralHeight += objects[key].clientHeight;
          }
        });
        let height = windowHeight - extralHeight - appOffsetTop - msgBoxHeight - extraHeight;
        height = height < 200 ? 200 : height;
        formItemObj = undefined;
        objects = undefined;
        windowHeight = undefined;
        appObj = undefined;
        return height;
      },
      //表格自适应
      selfAdaption() {
        if (this.$refs["selfAdaptTable"]) {
          if(this.customCalculateHeight instanceof Function) {
            this.selfHeight = this.customCalculateHeight(this.customCalculateParams);
          } else {
            this.selfHeight = this.calculateHeight();
          }
          // this.$refs["selfAdaptTable"].style.height = this.selfHeight.toString() + "px";
          this.fixedHeight = this.selfHeight;
        }
      },
      //动态创建工具条
      createShowCol(columns) {
        this.checked = [];
        this.showCol = [];
        let _this = this;
        columns.forEach((value, index, showCol) => {
          if (value.hiddenCol != true) {
            if (value.type == "index") {
              value.key = "_index";
            }
            let tempItem = JSON.parse(JSON.stringify(value));
            if (tempItem.type != "radio" && tempItem.type != "selection" && value.type !== "index") {
              _this.showCol.push(tempItem);
              if(!value.hiddenCol) {
                _this.checked.push(value.key);
              }
            }
          }
          for(let checkedItem in _this.checkedItems) {
            if(value.key === checkedItem) {
              let isExist = _this.showCol.some(item => {
                return item.key === checkedItem
              })
              if(!isExist) {
                _this.showCol.push(JSON.parse(JSON.stringify(_this.checkedItems[checkedItem])));
              }
              if(_this.checked.join(",").indexOf(checkedItem) <= -1 && !value.hiddenCol) {
                _this.checked.push(checkedItem);
              }
            }
          }
        });
      },
      //控制单列显示隐藏
      controlColumnsHidden(columnName, isHidden) {
        this.tempColumns.forEach((value, index) => {
          if (value.key === columnName) {
            value.hiddenCol = isHidden;
            this.createShowCol(this.tempColumns);
          }
        });
        return this.tempColumns;
      },
      createColumns(columns) {
        this.tempColumns = this.deepClone(columns);
        this.tColumns = this.tempColumns;
      }
    },
    created() {
      this.isMsgboxFirstOpen = true;
      this.tempColumns = this.deepClone(this.columns);
      this.tColumns = this.tempColumns;
      let isNeedAutoLoad = window.sessionStorage.getItem("isNeedAutoLoad");
      if (isNeedAutoLoad === "1" || Object.keys(this.$route.query).length <= 0) {
        if (this.autoLoad) {
          this.getDataList(1, this.pageInfo.pageSize, () => {
            this.tColumns = [];
            this.$nextTick(() => {
              //弹窗界面显隐工具条优化
              if (this.msgBox.$options.name === "h-msg-box" && this.msgBox.value === true && this.isMsgboxFirstOpen) {
                this.isMsgboxFirstOpen = false;
                this.tempColumns = this.deepClone(this.columns);
                this.tColumns = this.tempColumns;
              } else {
                this.tColumns = this.tempColumns;
              }
              this.createShowCol(this.tColumns);
            })
          });
        } else {
          if (this.gridData) {
            this.setGridData();
          }
        }
      }
    },
    mounted() {
      this.curHasSelect = this.hasSelect;
      if (this.height === undefined || this.height === "") {
        this.selfAdaption();
        on(window, 'resize', this.selfAdaption);
      }
      if(this.msgBox.$options.name === "h-msg-box") {
        this.msgBox.$on('on-maximize', isMax => {
          this.isMsgboxMax = isMax;
          if(isMax) {
            this.switchSizeTableHeight = this.fixedHeight;
            this.$nextTick(() => {
              if (this.height === undefined || this.height === "") {
                this.selfAdaption();
              }
              this.$refs.gridContent.handleResize();
            });
          } else {
            this.$nextTick(() => {
              this.fixedHeight = this.switchSizeTableHeight;
              this.$refs.gridContent.handleResize();
            });
          }
        })
      }
      // if (this.autoLoad) {
      //   this.getDataList(1, this.pageInfo.pageSize, () => {
      //     this.tColumns = [];
      //     this.$nextTick(() => {
      //       this.tColumns = this.columns;
      //     })
      //   });
      // } else {
      //   if (this.gridData) {
      //     this.setGridData();
      //   }
      // }
      // if (!this.$slots.toolbar) {
      //   this.hasToolBar = false;
      // }
      this.tempColumns.forEach((value, index, showCol) => {
        if (value.hiddenCol != true) {
          if (value.type == "index") {
            value.key = "_index";
          }
          let tempItem = JSON.parse(JSON.stringify(value));
          if (tempItem.type != "radio" && tempItem.type != "selection" && value.type !== "index") {
            this.showCol.push(tempItem);
            this.checked.push(value.key);
          }
        }
      });
    },
    beforeDestroy() { //在组件生命周期结束的时候销毁。
      document.body.removeEventListener("click", this.bodyClick, false);
      if (this.height === undefined || this.height === "") {
        off(window, "resize", this.selfAdaption);
      }
      if(this.msgBox.$options.name === "h-msg-box") {
        this.msgBox.$off('on-maximize')
      }
    },
    activated () {
      if (this.height === undefined || this.height === "") {
        // this.selfAdaption();
        on(window, 'resize', this.selfAdaption);
      }
      if(this.msgBox.$options.name === "h-msg-box") {
        this.msgBox.$on('on-maximize', isMax => {
          this.isMsgboxMax = isMax;
          if(isMax) {
            this.switchSizeTableHeight = this.fixedHeight;
            this.$nextTick(() => {
              if (this.height === undefined || this.height === "") {
                this.selfAdaption();
              }
              this.$refs.gridContent.handleResize();
            });
          } else {
            this.$nextTick(() => {
              this.fixedHeight = this.switchSizeTableHeight;
              this.$refs.gridContent.handleResize();
            });
          }
        })
      }
    },
    deactivated () {
      document.body.removeEventListener("click", this.bodyClick, false);
      if (this.height === undefined || this.height === "") {
        off(window, "resize", this.selfAdaption);
      }
      if(this.msgBox.$options.name === "h-msg-box") {
        this.msgBox.$off('on-maximize')
      }
    }
  };
</script>
<style>

</style>
