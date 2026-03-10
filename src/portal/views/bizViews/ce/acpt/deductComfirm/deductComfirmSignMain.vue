<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="busiType" :label="$t('m.i.common.busiType')">
                  <h-select v-model="formItem.busiType"  placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>

                <bill-no :label="$t('m.i.billInfo.billPackageNo')" v-model="formItem.billNo" prop="billNo"></bill-no>

                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>

                <h-form-item prop="drweName" :label="$t('m.i.pe.drweName')">
                  <h-input v-model="formItem.drweName" placeholder=""></h-input>
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
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/deductComfirm/deductConfirmSignMain/func_queryDeductComfirmCanSign"
                      :row-select="true"
                      :bindForm="formItem"
                      :has-select="hasSelect"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="agree()">{{$t("m.i.common.agree")}}</h-button>
              <h-button type="primary" @click="refuse()">{{$t("m.i.common.refuse")}}</h-button>
            </div>
          </h-datagrid>
        </div>

      </h-col>
    </h-row>
    <!--拒绝弹窗-->
    <h-msg-box v-model="rejectWin" width="400" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>应答拒绝</span>
      </p>
      <div>
        <h-form :model="rejectForm" :label-width="130" ref="rejectForm" cols="1" class="h-form-search" onlyBlurRequire>
          <h-form-item prop="reasonCode" :label="$t('m.i.ce.deductCfmReasonCode')" required>
            <h-select v-model="rejectForm.reasonCode" placeholder="" readonly>
              <h-option v-for="item in RefuseReasonCode" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.deductCfmRemark')" prop="replyRemark"  class="h-form-height-auto">
            <h-input type="textarea" placeholder="" v-model="rejectForm.replyRemark" :maxlength=150 :autosize="{minRows: 2, maxRows: 4}" :lengthByByte="false"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="primary" @click="closeWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="rejectSubmit">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {  formatNumber, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "deductComfirmSignMain",
    components: {},
    data() {
      let columns = [
        {
          type: 'selection',
          align: 'center',
          key:"duoxuan",
          width : 50
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
          title: this.$t("m.i.common.busiType"),
          key: "busiType",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let value = this.getDictValueFromMap(this.dictMap, "DeductComfirmBusiType", params.row.busiType);
            return h("span",
              {
                domProps: {
                  title: value
                }
              }, value);
          }
        },
        {
          title: this.$t('m.i.billInfo.billPackageNo'),
          key: 'billNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t('m.i.billInfo.billRange'),
          key: 'billRange',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t('m.i.billInfo.flowStatus'),
          key: 'flowStatus',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let value = this.getDictValueFromMap(this.dictMap, "DeductComfirmFlowstatusCode", params.row.flowStatus);
            return h("span",
              {
                domProps: {
                  title: value
                }
              }, value);
          }
        },
        {
          title: this.$t('m.i.ce.deductStatus'),
          key: 'deductStatus',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let value = this.getDictValueFromMap(this.dictMap, "DeductComfirmStatusCode", params.row.deductStatus);
            return h("span",
              {
                domProps: {
                  title: value
                }
              }, value);
          }
        },
        {
          title: this.$t('m.i.pe.clearStatus'),
          key: 'clearStatus',
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let value = this.getDictValueFromMap(this.dictMap, "DeductComfirmClearStatusCode", params.row.clearStatus);
            return h("span",
              {
                domProps: {
                  title: value
                }
              }, value);
          }
        },
        {
          title: this.$t('m.i.bs.settleDt'),
          key: 'settleDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.settleDt == null || params.row.settleDt === ""){
              return "";
            }
            let date = this.$moment(params.row.settleDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title:  this.$t('m.i.billInfo.billPackageMoney'),
          key: 'billMoney',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalFee = formatNumber(params.row.billMoney, 2, ',');
            return h("span", {
              domProps: {
                title: totalFee
              }
            }, totalFee);
          }
        },
        {
          title:  this.$t('m.i.be.firstSettleAmt'),
          key: 'settleAmt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let settleAmt = formatNumber(params.row.settleAmt, 2, ',');
            return h("span", {
              domProps: {
                title: settleAmt
              }
            }, settleAmt);
          }
        },
        {
          title:  this.$t('m.i.pe.drweName'),
          key: 'drweName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title:  this.$t('m.i.pe.drweAcctNo'),
          key: 'drweAcctNo',
          hiddenCol: false,
          sortable: true,
        },
      ];

      return {
        licenseFlag:false,
        authPath: this.$route.path ,
        dictMap: new Map(),
        busiTypeList: [],
        DeductComfirmFlowstatusCodeList: [],
        DeductComfirmBusiTypeList: [],
        DeductComfirmClearStatusCodeList: [],
        RefuseReasonCode : [{key:'CP17',value:'承兑人应答同意,扣款确认行拒绝'}],
        billId: "",
        hasSelect:false,
        formItem: {
          drweName: '',
          busiType:'',
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        rejectWin:false,
        rejectForm:{
          reasonCode : 'CP17',
          replyRemark:"",
        },
        viewDetailForm: {},
        columns: columns,
        deductConfirmWin: false,
        ifShowMore: false,

      };
    },
    mounted() {
      this.getDictListByGroups("DeductComfirmStatusCode,DeductComfirmFlowstatusCode,DeductComfirmBusiType,DeductComfirmClearStatusCode")
        .then(res => {
        this.busiTypeList = res.get("DeductComfirmBusiType");
        this.DeductComfirmFlowstatusCodeList = res.get("DeductComfirmFlowstatusCode");
        this.DeductComfirmBusiTypeList = res.get("DeductComfirmStatusCode");
        this.DeductComfirmClearStatusCodeList = res.get("DeductComfirmClearStatusCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.busiType=""
          this.formItem.drweName= '';
          this.formItem.drweAcctNo= '';
          this.formItem.busiType='';
          this.formItem.billNo= "";
          this.formItem.minBillRangeStart="";
          this.formItem.maxBillRangeEnd="";
        });
      },

      //拒绝
      refuse() {
        let selects = this.$refs.datagrid.selects;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.rejectWin = true;
      },
      agree(){
        let selects = this.$refs.datagrid.selects;
        if (selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let obj = {
          signFlag:"SU00"
        };
        this.$hMsgBox.confirm({
          title: "应答同意",
          content: "确定应答同意吗？",
          onOk: () => {
            this.submit(obj);
          }
        });
      },
      submit(obj) {
        let ids = "";
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < list.length; i++) {
          ids += list[i].msgId;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        obj.msgIds = ids;
        post(obj, "/ce/acpt/deductComfirm/deductConfirmSignMain/func_batchSign").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.rejectWin = false;
              this.rejectForm.replyRemark = '';
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      handleWinClose(){
        this.rejectForm.replyRemark = '';
      },
      rejectSubmit(){
        this.$refs["rejectForm"].validate(valid => {
          if (valid) {
            let obj = {
              signFlag: "SU01",
              cfmRefuseCode: this.rejectForm.reasonCode,
              replyRemark: this.rejectForm.replyRemark,
            };
            this.submit(obj);
          }
        });
      },
      closeWin(){
        this.rejectForm.replyRemark = '';
        this.rejectWin = false;
      },
    },

  };

</script>

<style scoped>

</style>
