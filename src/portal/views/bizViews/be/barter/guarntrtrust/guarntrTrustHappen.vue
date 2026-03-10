<!--保证增信跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" cols="4" ref="formItem" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNames" :label="$t('m.i.common.ownedBrchNo')"
                             prop="ownedBrchNames"
                             v-if="this.licenseFlag" :showCheckBox="true" :brchNo.sync="formItem.ownedBrchNos"
                             :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.busiType')" prop="applySignFlag">
                  <h-select v-model="formItem.applySignFlag" placeholder="" :clearable="false">
                    <h-option v-for="item in moveTypeList" :value="item.value" :key="item.value">{{ item.label}}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder=" ">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.ecdsBillStatus')" prop="billStatus">
                  <h-select v-model="formItem.billStatus" :label-width="90" placeholder=" ">
                    <h-option v-for="item in billStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctStatus">
                  <h-select v-model="formItem.acctStatus" placeholder="" showTitle>
                    <h-option v-for="item in billAcctStatus" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo" :maxlength="30" placeholder=" "></h-input>
                </h-form-item>
                <bill-money :formItem="formItem"></bill-money>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="dueDt" format="yyyy-MM-dd" type="daterange" autoPlacement showFormat
                                 :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            hasPage
            :hasSelect="hasSelect" rowSelect
            url="/be/barter/guarntrtrust/guarntrTrustHappen/func_queryEnhancingTrustHappenBill"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId"></bill-info-main>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>

    <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                          @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                          :checkStrictly="true"></show-license-branch>-->

  </div>

</template>

<script>
  import {post, on, off, formatNumber, exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "guarntrTrustHappen",

    data() {
      return {
        excelUrl: "/be/barter/guarntrtrust/guarntrTrustHappen/func_exportExcel",
        dueDt: [],
        //表单查找传参
        formItem: {
          applySignFlag: "1",
          billNo: "",
          likeBillNo: "",
          minBillMoney: "",
          maxBillMoney: "",
          billType: "",
          minDueDt: "",
          maxDueDt: "",
          billMoney: "",
          dueDt: "",
          billStatus: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames: this.$store.getters.userInfo.brchName,
          ownedBrchNos: this.$store.getters.userInfo.brchNo,
          authPath: this.$route.path,
          acctStatus: ""
        },
        moveTypeList: [{
          value: "1",
          label: "移出"
        }, {
          value: "2",
          label: "移入"
        }],
        billTypeList: [],
        billStatusList: [],
        billAcctStatus: [],
        //业务类型
        //表单自适应
        tableRef: "selfTable",
        //数据字典转型
        dictMap: new Map(),
        //是否显示高级查询
        ifShowMore: false,
        currentSelectList: [],
        currentSelectRowInx: [],
        billId: null,
        showBillInfoWin: false,
        //保证增信跟踪查询列表
        columns: [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",
            hiddenCol: false,
            type: "money",
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.billMoney, 2, ","));
            }
          },
          {
            title: this.$t("m.i.billInfo.ecdsBillStatus"),
            key: "billStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.billStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.common.applDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.applDt ? this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t("m.i.be.applBankName"),
            key: "applBrchName",
            hiddenCol: false,
            sortable: true
          },

          {
            title: this.$t("m.i.be.stockName"),
            key: "stockName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.guarntrTrustBankName"),
            key: "guarntrTrustBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.discBankName"),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.reqRemark'),
            key: "reqRemark",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.result'),
            key: "failReason",
            hiddenCol: false,
            sortable: true
          }],
        hasSelect: false,
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
      };
    },
    components: {
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },

    methods: {
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = "guarntrTrustReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl = window.LOCAL_CONFIG.API_HOME + this.excelUrl;
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
            applySignFlag : this.formItem.applySignFlag,
            authPath: this.$route.path,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },

      /**
       * 列表搜索
       * */
      formSearch() {
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
        this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.dueDt = [];
        this.$refs.formItem.resetFields();
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = this.$store.getters.userInfo.brchNo;
        this.formItem.ownedBrchNames = this.$store.getters.userInfo.brchName;
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(billId) {
        this.billId = billId;
        this.showBillInfoWin = true;
      },

      /*  //根据弹框所选数据进行赋值
        brchNoChange(info) {
          let objs = [];
          if (info instanceof Array) {
            objs = info;
          } else {
            objs[0] = info;
          }
          let brchNos = "";
          let brchNames = "";
          for (var i = 0; i < objs.length; i++) {
            brchNos += objs[i].id + ",";
            brchNames += objs[i].title + ",";
          }
          this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
          this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
          this.brchNoWin = false;
        },
        brchNoWinOpen() {
          this.brchNoWin = true;
        },
        brchNoWinClose() {
          this.brchNoWin = false;
        },*/
      handleDueDtChange(arr) {
        if (arr && arr.length == 2) {
          this.dueDt = [arr[0], arr[1]];
          this.formItem.minDueDt = arr[0].toString().replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].toString().replace(/-/g, "");
        } else {
          this.dueDt = [];
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
        }
      }
    },
    mounted() {
      this.getDictListByGroups("BarterTrustStatus,DraftTypeCode,AcctFlag").then(res => {
        this.billStatusList = res.get("BarterTrustStatus");
        this.billTypeList = res.get("DraftTypeCode");
        this.billAcctStatus = res.get("AcctFlag");
        this.dictMap = res.get("map");
      });

      post({authPath: this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, {info: res.data.retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    }
  };
</script>

<style scoped>

</style>
