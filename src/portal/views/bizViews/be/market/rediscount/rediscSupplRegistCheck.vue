<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billOrigin')"  prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :form-item="formItem" :range-props="['minRegisterBillRangeStart','maxRegisterBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')"  class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minRegisterBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxRegisterBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      url="/be/market/rediscount/rediscSupplRegistCheck/func_queryRediscountSupplInfoCheck"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass" >{{$t('m.i.common.pass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.common.back')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rediscSupplRegistCheck",
    components : {
    },
    data() {
      return {
        dueDt:[],
        //票面
        showBillInfoWin: false,
        billId: '',
        billNo: '',
        billRangeStart:'',
        billRangeEnd:'',
        //字典值
        dictMap: new Map(),
        billTypeList: [],
        billOriginList: [],
        formItem: {
          billNo: '',
          minRegisterBillMoney:"",
          maxRegisterBillMoney:"",
          minDueDate:"",
          maxDueDate:"",
          billOrigin:"",
          minRegisterBillRangeStart:"",
          maxRegisterBillRangeEnd:""
        },
        columns: [
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: false,
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId,params.row.billNo,
                      params.row.billRangeStart?params.row.billRangeStart:params.row.registerBillRangeStart,
                      params.row.billRangeEnd?params.row.billRangeEnd:params.row.registerBillRangeEnd);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'registerBillRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.registerBillRange  ? '-' :params.row.registerBillRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render:(h, params)=> {
              let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: 'registerBillMoney',
            hiddenCol: false,
            sortable: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.registerBillMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.corpScale'),
            key: "corpScale",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"CorpScale",params.row.corpScale);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.industryCategory'),
            key: "industryCategory",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.industryCategory);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.isArc'),
            key: "isArc",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isArc);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          // 是否绿色
          {
            title: this.$t('m.i.common.isGreenCorp'),
            key: "isGreenCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.isPrivateCorp'),
            key: "isPrivateCorp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isPrivateCorp);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.applStatus'),
            key: "applStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "RediscSupplStatus", params.row.applStatus);
              return h("span", { domProps: { title: dictValue } }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.brchType'),
            key: "brchType",
            hiddenCol: false,
            render: (h, params) => {
              let result = "";
              if(params.row.brchType === "1"){
                result = "贴现行";
              }else if(params.row.brchType === "2"){
                result = "出票人开户行";
              }
              return h("span",
                {
                  domProps: {
                    title: result
                  }
                }, result);
            }
          },
          {
            title: this.$t('m.i.be.msgType'),
            key: "msgType",
            hiddenCol: false,
            render: (h, params) => {
              let result = "";
              if(params.row.msgType === "IFC01"){
                result = "贴现申请人";
              }else if(params.row.msgType === "IFC02"){
                result = "出票人";
              }
              return h("span",
                {
                  domProps: {
                    title: result
                  }
                }, result);
            }
          },
          {
            title: this.$t('m.i.be.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false,
          }
        ],

      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,CDMedia,Yon,CorpScale,RediscSupplStatus,Industry,AcptRgstStatus,BillOrigin").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.cdMediaList = res.get("CDMedia");
        this.corpScaleList = res.get("CorpScale");
        this.industryCategoryList = res.get("Industry");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
        this.billOriginList = res.get("BillOrigin");
      });
    },
    methods: {
      handleRgstDtChange(value) {
        this.formItem.rgstDt = value.replace(/-/g, "");
      },
      handleDueDtChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.minDueDate = arr[0].replace(/-/g, "");
          this.formItem.maxDueDate = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDate = "";
          this.formItem.maxDueDate = "";
          this.dueDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt=[];
        this.formItem.minDueDate = "";
        this.formItem.maxDueDate = "";
        this.formItem.minRegisterBillMoney = "";
        this.formItem.maxRegisterBillMoney = "";
        this.$refs.formItem.resetFields();
      },

      //票面
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },

      //通过
      recheckPass() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定通过吗？",
          onOk: () => {
            this.handleReCheckPass();
          }
        });
      },
      handleReCheckPass() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ code : ids}, "/be/market/rediscount/rediscSupplRegistCheck/func_passRediscountSupplInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //驳回
      recheckBack() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定驳回吗？",
          onOk: () => {
            this.handleReCheckBack();
          }
        });
      },
      handleReCheckBack() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ code : ids}, "/be/market/rediscount/rediscSupplRegistCheck/func_rejectRediscountSupplInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
