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

                <show-branch v-model="formItem.acctBrchNos" :label="$t('m.i.common.brchName')" prop="acctBrchNos"
                             title="机构名称" :showCheckBox="true"  isNeedChecked :brchNo.sync="formItem.acctBrchNos" :brchName.sync="formItem.brchNameList">
                </show-branch>

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

                <h-form-item :label="$t('m.i.bs.settleDt')" prop="settleDt">
                  <h-date-picker :value="formItem.settleDt" type="daterange" autoPlacement showFormat :editable=false placeholder="" @on-change="handleSettleDtChange"></h-date-picker>
                </h-form-item>

                <h-form-item prop="deductStatus" :label="$t('m.i.ce.deductStatus')">
                  <h-select v-model="formItem.deductStatus"  placeholder="">
                    <h-option v-for="item in deductComfirmStatusCodeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>

                <h-form-item prop="clearStatus" :label="$t('m.i.pe.clearStatus')">
                  <h-select v-model="formItem.clearStatus"  placeholder="">
                    <h-option v-for="item in deductComfirmClearStatusCodeList" :value="item.key" :key="item.value">{{ item.value }}
                    </h-option>
                  </h-select>
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
                      url="/ce/acpt/deductComfirm/deductComfirmTraceMain/func_queryDeductComfirmHis"
                      :row-select="true"
                      :bindForm="formItem"
                      :has-select="hasSelect"
                      ref="datagrid">
          </h-datagrid>
        </div>

      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {  formatNumber, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "deductComfirmTraceMain",
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
        {
          title:  this.$t('m.i.be.respFlag'),
          key: 'signFlag',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let value = this.getDictValueFromMap(this.dictMap, "SignUpMarkCode", params.row.signFlag);
            return h("span",
              {
                domProps: {
                  title: value
                }
              }, value);
          }
        },
        {
          title:  this.$t('m.i.ce.deductCfmReasonCode'),
          key: 'cfmRefuseCode',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let value = this.getDictValueFromMap(this.dictMap, "DishonorCode", params.row.cfmRefuseCode);
            return h("span",
              {
                domProps: {
                  title: value
                }
              }, value);
          }
        },
        {
          title:  this.$t('m.i.be.respRemark'),
          key: 'replyRemark',
          hiddenCol: false,
          sortable: true,
        },
      ];

      return {
        licenseFlag:false,
        authPath: this.$route.path ,
        dictMap: new Map(),
        busiTypeList: [],
        deductComfirmFlowstatusCodeList: [],
        deductComfirmStatusCodeList: [],
        deductComfirmClearStatusCodeList: [],
        billId: "",
        hasSelect:false,
        formItem: {
          acctBrchNos: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          brchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          drweName: '',
          busiType:'',
          billNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          settleDt: [],
          deductStatus: "",
          clearStatus: "",
          minSettleDt:"",
          maxSettleDt:"",
        },
        viewDetailForm: {},
        columns: columns,
        ifShowMore: false,

      };
    },
    mounted() {
      this.getDictListByGroups("DeductComfirmStatusCode,DeductComfirmFlowstatusCode,DeductComfirmBusiType,DeductComfirmClearStatusCode,SignUpMarkCode,DishonorCode").then(res => {
        this.busiTypeList = res.get("DeductComfirmBusiType");
        this.deductComfirmFlowstatusCodeList = res.get("DeductComfirmFlowstatusCode");
        this.deductComfirmStatusCodeList = res.get("DeductComfirmStatusCode");
        this.deductComfirmClearStatusCodeList = res.get("DeductComfirmClearStatusCode");
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
          this.formItem.acctBrchNos=JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
          this.formItem.brchNameList=JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
          this.formItem.busiType=""
          this.formItem.drweName= '';
          this.formItem.billNo= "";
          this.formItem.settleDt=[];
          this.formItem.deductStatus="";
          this.formItem.clearStatus="";
          this.formItem.minSettleDt="";
          this.formItem.maxSettleDt="";
          this.formItem.minBillRangeStart="";
          this.formItem.maxBillRangeEnd="";
        });
      },
      //日期选择框
      handleSettleDtChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.minSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxSettleDt = arr[1].replace(/-/g, "");
          this.settleDt = [arr[0], arr[1]];
        }else{
          this.formItem.minSettleDt = "";
          this.formItem.maxSettleDt = "";
          this.settleDt = [];
        }
      },
    },
  };

</script>

<style scoped>

</style>
