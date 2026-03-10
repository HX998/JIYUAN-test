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
                      url="/ce/acpt/deductComfirm/backflushDeductMain/func_queryCanBackflush"
                      :row-select="false"
                      :bindForm="formItem"
                      :has-select="hasSelect"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="backflushDeduct()">{{$t("m.i.common.rectification")}}</h-button>
            </div>
          </h-datagrid>
        </div>

      </h-col>
    </h-row>


  </div>
</template>

<script>
  import {  formatNumber, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "backflushDeductMain",
    components: {},
    data() {
      let columns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
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
          hiddenCol: false,
          sortable: true,
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
          hiddenCol: false,
          sortable: true,
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
          sortable: true,
          hiddenCol: false,
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
        billId: "",
        hasSelect:false,
        formItem: {
          drweName: '',
          busiType:'',
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
        },
        viewDetailForm: {},
        columns: columns,
        deductConfirmWin: false,
        ifShowMore: false,
        currentSelectRow: null,

      };
    },
    mounted() {
      this.getDictListByGroups("DeductComfirmStatusCode,DeductComfirmFlowstatusCode,DeductComfirmBusiType,DeductComfirmClearStatusCode").then(res => {
        this.busiTypeList = res.get("DeductComfirmBusiType");
        this.DeductComfirmFlowstatusCodeList = res.get("DeductComfirmFlowstatusCode");
        this.DeductComfirmBusiTypeList = res.get("DeductComfirmStatusCode");
        this.DeductComfirmClearStatusCodeList = res.get("DeductComfirmClearStatusCode");
        this.dictMap = res.get("map");
      });
      // this.getParams();
    },
    methods: {
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = null;
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
      backflushDeduct(){
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let obj = {
          id:this.currentSelectRow.id,
        };
        this.$hMsgBox.confirm({
          title: "冲正确认",
          content: "确定冲正吗？",
          onOk: () => {
            this.submit(obj);
          }
        });
      },
      //选择多笔确定弹窗
      submit(obj) {
        post(obj, "/ce/acpt/deductComfirm/backflushDeductMain/func_backflushDeduct").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },


    },

  };

</script>

<style scoped>

</style>
