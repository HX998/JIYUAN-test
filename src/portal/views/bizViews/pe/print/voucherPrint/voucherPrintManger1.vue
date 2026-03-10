<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div v-if="mainVue" key="1">
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pe.busiNo')" prop="batchNo">
                  <h-input v-model="formItem.batchNo" :maxLength="20"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.operTellerNo')" prop="acctTellerNo">
                  <h-input v-model="formItem.acctTellerNo" :maxLength="12"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.transDt')" prop="transDtRange">
                  <h-date-picker placeholder="" type="daterange" :editable=false v-model="formItem.transDtRange"
                                 format="yyyy-MM-dd" showFormat @on-change="handleTransDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="busiType" :label="$t('m.i.common.busiType')" :label-width="96" class="h-form-radio">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="voucherType" :label="$t('m.i.pc.voucherType')" :label-width="96" class="h-form-radio">
                  <h-select v-model="formItem.voucherType" placeholder="">
                    <h-option v-for="item in voucherTypeList" :value="item.key" :key="item.key">{{item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.backFlowNo')" prop="backFlowNo">
                  <h-input v-model="formItem.backFlowNo"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/pe/print/voucherPrint/voucherPrintManger/func_queryVoucherRePrintBatch"
            :bindForm="formItem"
            :on-current-change="handleRowClick"
            :on-current-change-cancel="handleRowClickCancel"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handlePrint()">{{$t("m.i.pe.vochRePrint")}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 子页面路由跳转-->
        <div v-if="billManagerVue" key="2">
          <component :is="batchAndBillInfo" :listIds="this.listIds" :batchId="this.batchId" :tempPrintMode="this.tempPrintMode" :billManagerParams="this.billManagerParams" :isShow="this.infoShow" @returnMain="returnMain()"></component>
        </div>
      </h-col>
    </h-row>
  </div>

</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber,accMul } from "@/api/bizApi/commonUtil";

  export default {
    name: "voucherPrintManger",
    data() {
      return {
        columns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.busiNo"),
            key: "batchNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "VoucherBusiType", params.row.busiType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t('m.i.pc.voucherType'),
            key: "voucherType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "VoucherType", params.row.voucherType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.transDt'),
            key: "rgstDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.rgstDt == null ? "" : this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.operTellerNo'),
            key: "acctTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.backFlowNo'),
            key: "backFlowNo",
            hiddenCol: false
          }
        ],
        mainVue: true,
        billManagerVue: false,
        batchId: "",
        listIds: "",
        tempPrintMode: "",
        infoShow: false,
        batchAndBillInfo: "",
        batchAndBillInfoUrl: "",
        currentSelectRow: [],
        ifShowMore: false,
        dictMap: new Map(),
        voucherTypeList: [],
        busiTypeList: [],
        formItem: {
          transDtRange: "",
          crtStartTime: "",
          crtEndTime: "",
          batchNo: "",
          acctTellerNo: "",
          busiType: "",
          voucherType: "",
          backFlowNo:""
        },
        billManagerParams: {
          type: Object,
          default() {
            return {
              batchNo: "",
              busiType: "",
              voucherType: "",
              rgstDt: "",
              brchNo: ""
            };
          }
        }
      };
    },
    methods: {
      handleTransDtChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.crtStartTime = arr[0].replace(/-/g, "");
          this.formItem.crtEndTime = arr[1].replace(/-/g, "");
        }else{
          this.formItem.crtStartTime = "";
          this.formItem.crtEndTime = "";
        }

      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.batchNo = '';
          this.formItem.acctTellerNo = '';
          this.formItem.crtStartTime = '';
          this.formItem.crtEndTime = '';
          this.formItem.transDtRange = '';
          this.formItem.busiType = '';
          this.formItem.voucherType = '';
          this.formItem.backFlowNo = '';
        });
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
      },
      //凭证补打
      handlePrint() {
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.batchId;
        this.billManagerParams.batchNo = this.currentSelectRow.batchNo;
        this.billManagerParams.busiType = this.currentSelectRow.busiType;
        this.billManagerParams.voucherType = this.currentSelectRow.voucherType;
        this.billManagerParams.rgstDt = this.currentSelectRow.rgstDt;
        this.billManagerParams.brchNo = this.currentSelectRow.brchNo;
        post({
          voucherType: this.currentSelectRow.voucherType,
          brchNo: this.currentSelectRow.brchNo,
          batchNo: this.currentSelectRow.batchNo,
          rgstDt: this.currentSelectRow.rgstDt
        }, "/pe/print/voucherPrint/voucherPrintManger/func_getPrintInfoMapping").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.batchAndBillInfoUrl = res.data.retData.path;
              let idList = res.data.retData.listIds;
              let ids = "";
              for(let i=0; i<idList.length; i++) {
                ids += idList[i];
                if(i<idList.length-1) {
                  ids += ",";
                }
              }
              this.listIds = ids;
              this.tempPrintMode = res.data.retData.tempPrintMode;
              this.openBatchAndBillInfo();
              this.$refs.datagrid.tData = [];
              this.resetSearch();
              this.mainVue = false;
              this.billManagerVue = true;
              this.infoShow = true;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      openBatchAndBillInfo() {
        this.batchAndBillInfo = this._getPrintComponentByUrl(this.batchAndBillInfoUrl);
      },
      //明细界面返回
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.infoShow = false;
        this.currentSelectRow = [];
      },
    },
    mounted() {
      post({},"/pe/print/voucherPrint/voucherPrintManger/func_queryVouchreTypeDict").then(res=>{
        if (res) {
          if (res.data.retCode === '000000') {
            let dictList = res.data.retData;
            this.voucherTypeList = dictList;
            this.getDictListByGroups("VoucherBusiType").then(res => {
              this.busiTypeList = res.get("VoucherBusiType");
              this.dictMap = res.get("map");
              if (dictList && dictList.length > 0) {
                let voucherTypeMap = new Map();
                for (let i = 0; i < dictList.length; i++) {
                  voucherTypeMap.set(dictList[i].key, dictList[i].value);
                }
                this.dictMap.set("VoucherType", voucherTypeMap);
                this.formSearch();
              }
            });
          }
        }
      });
    }
  }
</script>

<style scoped>

</style>
