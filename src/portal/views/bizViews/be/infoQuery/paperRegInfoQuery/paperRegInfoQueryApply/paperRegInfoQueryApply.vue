<!--付款确认申请-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNoLike"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.status')" prop="queryStatus">
                  <h-select v-model="formItem.queryStatus" placeholder="" showTitle>
                    <h-option value="1">已发出</h-option>
                    <h-option value="2">已回复</h-option>
                    <h-option value="3">查询失败</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="dataColumns"
            hasPage
            highlight-row
            url="/be/infoQuery/paperRegInfoQuery/paperRegInfoQueryApply/func_pageQueryUsableRegApplyList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            showListCkeckBox
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="applyClick()">{{$t('m.i.be.apply')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击申请弹出窗-->
    <h-msg-box v-model="regQueryApplWin" width="800" class="h-form-search-layer" :maximize="true"
               @on-close="applyClickSubmit('close')">
      <p slot="header">
        <span>纸票登记信息查询申请</span>
      </p>
      <h-panel>
        <h-form :model="regQueryApplForm" :label-width="90" ref="regQueryApplForm" cols="2" class="h-form-search">
         <!-- <h-form-item :label="$t('m.i.be.applBrchCode')" prop="applBrchCode" :required="isRequired">
            <h-input @on-click="showbrch = true" v-model="regQueryApplForm.applBrchCode" icon="search" readonly
                     clearable>
            </h-input>
          </h-form-item>-->
          <show-cpes-branch :label="$t('m.i.be.applBrchName')"  :required="isRequired"
                            :brchCode.sync="regQueryApplForm.applBrchCode"  :msgBoxWin="regQueryApplWin"
                            datagridUrl="/shcpe/cpes/branch/agencyInformation/func_queryBranchs" prop="applBrchCode"
                            queryUrl="/shcpe/cpes/branch/agencyInformation/func_queryBranchs"></show-cpes-branch>

          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-model="regQueryApplForm.billType" placeholder="" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :required="isRequired" :validRules="billNoRule">
            <h-input v-model="regQueryApplForm.billNo" :maxlength="16"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" :required="isRequired">
            <h-typefield v-model="regQueryApplForm.billMoney" type="money" bigTips placeholder=""></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt" class="h-form-long-label" :required="isRequired">
            <h-date-picker type="date" v-model="regQueryApplForm.dueDt" :showFormat="true"
                           placeholder=""></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptBankNo')" :label-width="130" prop="acptBankNo" :required="isRequired"
                       :validRules="bankNoRule">
            <h-input v-model="regQueryApplForm.acptBankNo"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="applyClickSubmit('close')">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" @click="applyClickSubmit('submit')">{{$t('m.i.common.commit')}}</h-button>
      </div>
    </h-msg-box>
    <!--END 点击申请弹出窗 -->
    <!--<brch-code-search :brchCodeWin="showbrch" @brchCodeWinClose="closeBranch"
                      @brchCodeChange="brchCodeChange"></brch-code-search>-->
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "paperRegInfoQueryApply",
    data() {
      return {
          billId : "",
          billNo : "",
          showBillInfoWin : false,
        formItem: {
          queryStatus: "",
          billNoLike: "",
          billType: "",
          minBillMoney: "",
          maxBillMoney: ""
        },
        isRequired: true,
        ifShowMore: false,
        regQueryApplWin: false,
        currentSelectRow: [],
        billTypeList: [],
        dataColumns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            /*render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo);
                        }
                    }
                }, params.row.billNo);
            }*/
          },
          {
            title: this.$t('m.i.common.queryDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.applDt ? this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.billMoneyByUnit'),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "queryStatus",
            hiddenCol: false,
            render: (h, params) => {
              let queryStatus = params.row.queryStatus;
              if (queryStatus != null && queryStatus !== "") {
                switch (queryStatus) {
                  case "1":
                    queryStatus = "已发出";
                    break;
                  case "2":
                    queryStatus = "已回复";
                    break;
                  case "3":
                    queryStatus = "查询失败";
                    break;
                  default :
                    queryStatus = params.row.queryStatus;
                }
              }
              return h("span", queryStatus);
            }
          },
          {
            title: this.$t('m.i.common.failReason'),
            key: "failReason",
            hiddenCol: false
          }
        ],
        regQueryApplForm: {
          applBrchCode: "",
          billType: "",
          billNo: "",
          billMoney: "",
          dueDt: "",
          acptBankNo: ""
        },
        //showbrch: false,
        dictMap: new Map(),
        billNoRule: [{ test: this.validBillNo, trigger: "blur" }],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }]
      };
    },
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    methods: {
      /**
       * 列表搜索
       * */
      formSearch() {
        let min = Number(this.formItem.minBillMoney);
        let max = Number(this.formItem.maxBillMoney);
        if (min != 0 && max != 0) {
          if (min > max) {
            this.$msgTip.error(this, { info: "票据金额最小值不能超过最大值" });
          } else {
            this.currentSelectRow = [];
            this.$refs.datagrid.dataChange(1);
          }
        } else {
          this.currentSelectRow = [];
          this.$refs.datagrid.dataChange(1);
        }
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.billNoLike = "";
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      showBillInfo(billId, billNo) {
          this.billId = billId;
          this.billNo = billNo;
          this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },
      /**
       * 弹出框
       * **/
      applyClick() {
        if (1 == 1) {
          this.regQueryApplWin = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      /**
       * 申请提交
       * */
      applyClickSubmit(str) {
        if ("close" == str) {
          this.regQueryApplForm.id = null;
          this.$refs.regQueryApplForm.resetFields();
          this.regQueryApplWin = false;
        } else if ("submit" == str) {
          this.$refs["regQueryApplForm"].validate(valid => {
            if (valid) {
              let url = "be/infoQuery/paperRegInfoQuery/paperRegInfoQueryApply/func_submitPaperRegInfoApply";
              if (this.regQueryApplForm.dueDt != null) {
                let dueDate = this.regQueryApplForm.dueDt.replace(/-/g, "");
                this.regQueryApplForm.dueDt = dueDate;
              }
              post(this.regQueryApplForm, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.currentSelectRow = [];
                    this.regQueryApplWin = false;
                    this.regQueryApplForm.id = null;
                    this.$refs.regQueryApplForm.resetFields();
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        }
      },
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.info("请先选择记录！");
          return;
        }
        this.regQueryApplForm.applBrchCode = info.brchCode;
        this.showbrch = false;
      },*/
      /*closeBranch() {
        this.showbrch = false;
      },*/
      validBillNo(rule, val, callback) {
        if (this.regQueryApplForm.billType === "AC01") {
          let re = /^[0-9]{3}0[0-9]{2}[5][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("银票号码为16位数字,第四位为0,第七位为5"));
          }
        } else if (this.regQueryApplForm.billType === "AC02") {
          let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
          if (re.test(val)) {
            callback();
          } else {
            callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
          }
        } else {
          callback(new Error("请选择票据种类"));
        }
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    }
  };

</script>

<style scoped>

</style>
