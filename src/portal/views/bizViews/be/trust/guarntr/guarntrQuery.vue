<template>
  <h-row class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!--批次页面-->
        <h-row>
          <!--查询表单-->
          <h-row class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.applySignFlag')" prop="applySignFlag">
                  <h-select v-model="formItem.applySignFlag" placeholder="" @on-change="showBrch" :clearable="false">
                    <h-option v-for="item in applySignFlagList" :value="item.value" :key="item.value">{{ item.label }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.branchType')" prop="branchType">
                  <h-select v-model="formItem.branchType" placeholder="">
                    <h-option :value="1">本机构</h-option>
                    <h-option :value="2">本机构及下级机构</h-option>
                  </h-select>
                </h-form-item>
                <common-select v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               :dictList="billOriginList"></common-select>
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" :maxLength="30"></h-input>
                </h-form-item>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <show-cpes-branch  v-show="isShowBrch" :label="$t('m.i.be.warranteeBrchName')"
                                   :brchCode.sync="formItem.applBrchCode" :cpesBrchName.sync="formItem.applBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" :prop="applBrchName"
                                   queryUrl="/cpes/branch/queryBranchList" ref="applBrchNameRef"></show-cpes-branch>

                <show-cpes-branch  :label="$t('m.i.be.bailBrchName')"  v-show="!isShowBrch"
                                   :brchCode.sync="formItem.signBrchCode"  :cpesBrchName.sync="formItem.signBrchName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="signBrchName"
                                   queryUrl="/cpes/branch/queryBranchList" ref="signBrchNameRef"></show-cpes-branch>


                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label">
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
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="rangeDueDt">
                  <h-date-picker :value="rangeDueDt" type="daterange" autoPlacement placeholder="" format="yyyy-MM-dd"
                                 showFormat @on-change="handleDueDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label=" $t('m.i.be.rangeApplDt')" prop="rangeApplDt">
                  <h-date-picker :value="rangeApplDt" type="daterange" autoPlacement placeholder="" format="yyyy-MM-dd"
                                 showFormat @on-change="handleApplDtChange"></h-date-picker>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.billInfo.acptBankName')" prop="acptBankName"   class="h-form-long-label">
                  <h-input v-model="formItem.acptBankName" :maxlength=60 readonly
                           icon="android-search" @on-click="brchCodeWinOpen3()"
                           clearable @on-clear="clearVal('acptBankName')"></h-input>
                </h-form-item>-->

                <show-cpes-branch  :label="$t('m.i.billInfo.acptBankName')"  class="h-form-long-label"
                                   :brchCode.sync="formItem.acptBankCode"  :cpesBrchName.sync="formItem.acptBankName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="acptBankName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <!--   <h-form-item :label="$t('m.i.billInfo.discBankName')" prop="discBankName">
                     <h-input v-model="formItem.discBankName" :maxlength=60 readonly
                              icon="android-search" @on-click="brchCodeWinOpen4()"
                              clearable @on-clear="clearVal('discBankName')"></h-input>
                   </h-form-item>-->

                <show-cpes-branch  :label="$t('m.i.billInfo.discBankName')"
                                   :brchCode.sync="formItem.discBankCode"  :cpesBrchName.sync="formItem.discBankName"
                                   datagridUrl="/cpes/branch/queryBranchList" prop="discBankName"
                                   queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                <h-form-item :label="$t('m.i.be.signUpMk')" prop="signUpMk">
                  <h-select v-model="formItem.signUpMk" placeholder="">
                    <h-option v-for="item in signUpMarkCodeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctStatus')" prop="acctStatus">
                  <h-select v-model="formItem.acctStatus" placeholder="">
                    <h-option v-for="item in AcctFlagList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </h-row>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            url="/bp/guaranty/sign/func_queryGuarantyBillHappenByPage"
            :bindForm="formItem"
            :hasSelect=false
            :rowSelect=true
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t('m.i.common.exportExcel')}}</h-button>
            </div>
          </h-datagrid>
        </h-row>
      </h-col>
    </h-row>

    <!--<brch-code-search :brchCodeWin="brchCodeWinBrch" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>
    <brch-code-search :brchCodeWin="brchCodeWinCust" @brchCodeWinClose="brchCodeWinClose2"
                      @brchCodeChange="brchCodeChange2" optType="2"></brch-code-search>
    <brch-code-search :brchCodeWin="brchCodeWinAcpt" @brchCodeWinClose="brchCodeWinClose3"
                      @brchCodeChange="brchCodeChange3" optType="2"></brch-code-search>
    <brch-code-search :brchCodeWin="brchCodeWinDisc" @brchCodeWinClose="brchCodeWinClose4"
                      @brchCodeChange="brchCodeChange4" optType="2"></brch-code-search>-->

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </h-row>
</template>

<script>
  import { post, on, off, formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "guarntrQuery",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`)
    },
    data() {
      let applyColumns = [
          {
            type: "selection",
            width: 60,
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
          title: this.$t("m.i.billInfo.billOrigin"),
          align:'center',
          key: 'billOrigin',
          render: (h, params) => {
            let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' :  this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = params.row.billNo;
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row);
                }
              }
            }, billNo);
          }
        },
        //子票区间列
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ",");
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            key: "flowStatusName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.rangeApplDt'),
            key: "guarnteeDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.guarnteeDt ? this.$moment(params.row.guarnteeDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.guarantorBrchCode'),
            key: "signBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.warranteeBrchCode'),
            key: "applBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.signUpMk'),
            key: "confirmFlag",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SignUpMarkCode", params.row.signFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
        {
          title: this.$t('m.i.common.acctStatus'),
          key: "acctStatus",
          hiddenCol: false,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
          // {
          //   title: this.$t('m.i.common.acctStatus'),
          //   key: "acctStatus",
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
          //     return h("span",
          //       {
          //         domProps: {
          //           title: list
          //         }
          //       }, list);
          //   }
          // },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ];
      let signColumns = [
          {
            type: "selection",
            width: 60,
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
          title: this.$t("m.i.billInfo.billOrigin"),
          align:'center',
          key: 'billOrigin',
          render: (h, params) => {
            let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' :  this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageNo"),
          key: "billNo",
          ellipsis: false,
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let billNo = params.row.billNo;
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row);
                }
              }
            }, billNo);
          }
        },
        //子票区间列
        {
          title: this.$t("m.i.billInfo.billRange"),
          align:'center',
          key:"billRange",
          hiddenCol: false,
          render:(h,params) => {
            return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
          }
        },
        {
          title: this.$t("m.i.billInfo.billPackageMoney"),
          key: "billMoney",
          hiddenCol: false,
          ellipsis: false,
          sortable: true,
          render: (h, params) => {
            let billMoney = formatNumber(params.row.billMoney, 2, ",");
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            key: "flowStatusName",
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.be.rangeApplDt'),
            key: "guarnteeDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.guarnteeDt ? this.$moment(params.row.guarnteeDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t('m.i.be.guarantorBrchCode'),
            key: "signBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.warranteeBrchCode'),
            key: "applBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: "discBankName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.signUpMk'),
            key: "signFlag",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SignUpMarkCode", params.row.signFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.acctStatus'),
            key: "acctStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acctStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.dealPrcMsg'),
            key: "dealPrcMsg",
            hiddenCol: false
          }
        ];
      return {
        formItem: {
          applySignFlag: "1",
          guarantyType:"4",
          branchType: "",
          applBrchName: "",
          applBrchCode: "",
          signBrchName: "",
          signBrchCode: "",
          minBillRangeStart:"",
          billOrigin:"",
          maxBillRangeEnd:"",
          billNo: "",
          billType: "",
          billClass: "",
          billStatus: "",
          minBillMoney: "",
          maxBillMoney: "",
          rangeDueDt: "",
          minDueDt: "",
          maxDueDt: "",
          rangeApplDt: "",
          minGuarnteeDt: "",
          maxGuarnteeDt: "",
          acptBankName: "",
          acptBankCode: "",
          discBankName: "",
          discBankCode: "",
          signUpMk: "",
          acctStatus: "",
          authPath: this.$route.path
        },
        rangeDueDt:[],
        rangeApplDt:[],
        columns: applyColumns,
        applyColumns: applyColumns,
        signColumns: signColumns,
        //业务类型
        applySignFlagList: [
          {
            value: "1",
            label: "被保证人"
          }, {
            value: "2",
            label: "保证人"
          }
        ],
        billOriginList:[],
        signUpMarkCodeList:[],
        billTypeList: [],
        cdMediaList: [],
        billStatusList: [],
        dictMap: new Map(),
        ifShowMore: false,
        readonly: true,
        isRequired: false,
        billId: null,
        showBillInfoWin: false,
        brchCodeWinBrch: false,
        brchCodeWinCust: false,
        brchCodeWinAcpt: false,
        brchCodeWinDisc: false,
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        isShowBrch: false,
        AcctFlagList: [],
      };
    },
    methods: {
      showBrch(value) {
        //被保证人
        if (value === "1") {
          this.isShowBrch = false;
          this.$refs.signBrchNameRef.$refs.simpleSelectLink.initSelectValue();
        } else if (value === "2") { //保证人
          this.isShowBrch = true;
          this.$refs.applBrchNameRef.$refs.simpleSelectLink.initSelectValue();
        }
      },
      formSearch() {
        if(this.formItem.applySignFlag === "2"){
          this.columns = this.deepClone(this.signColumns);
          this.$refs.datagrid.createShowCol(this.columns);
        }else {
          this.columns = this.deepClone(this.applyColumns);
          this.$refs.datagrid.createShowCol(this.columns);
        }
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.rangeDueDt = [arr[0],arr[1]];
        }else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.rangeDueDt = [];
        }
      },
      handleApplDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minGuarnteeDt = arr[0].replace(/-/g, "");
          this.formItem.maxGuarnteeDt = arr[1].replace(/-/g, "");
          this.rangeApplDt = [arr[0],arr[1]];
        } else {
          this.formItem.minGuarnteeDt = "";
          this.formItem.maxGuarnteeDt = "";
          this.rangeApplDt = [];
        }
      },
      formSearchReset() {
        this.rangeDueDt = [];
        this.rangeApplDt = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.applBrchCode = "";
        this.formItem.signBrchCode = "";
        this.formItem.acptBankCode = "";
        this.formItem.discBankCode = "";
        this.formItem.applBrchName = "";
        this.formItem.signBrchName = "";
        this.formItem.acptBankName = "";
        this.formItem.discBankName = "";
        this.$refs.formItem.resetFields();
      },
      /*brchCodeWinOpen() {
        this.brchCodeWinBrch = true;
      },*/
      /*brchCodeWinClose() {
        this.brchCodeWinBrch = false;
      },*/
      /*brchCodeChange(info) {
        this.formItem.applBrchName = info.brchFullNameZh;
        this.formItem.applBrchCode = info.brchCode;
        this.brchCodeWinBrch = false;
      },*/

      /*brchCodeWinOpen2() {
        this.brchCodeWinCust = true;
      },*/
      /*brchCodeWinClose2() {
        this.brchCodeWinCust = false;
      },*/
      /*brchCodeChange2(info) {
        this.formItem.signBrchName = info.brchFullNameZh;
        this.formItem.signBrchCode = info.brchCode;
        this.brchCodeWinCust = false;
      },*/

      /*brchCodeWinOpen3() {
        this.brchCodeWinAcpt = true;
      },*/
      /* brchCodeWinClose3() {
         this.brchCodeWinAcpt = false;
       },*/
      /*brchCodeChange3(info) {
        this.formItem.acptBankName = info.brchFullNameZh;
        this.formItem.acptBankCode = info.brchCode;
        this.brchCodeWinAcpt = false;
      },*/

      /*brchCodeWinOpen4() {
        this.brchCodeWinDisc = true;
      },*/
      /*brchCodeWinClose4() {
        this.brchCodeWinDisc = false;
      },*/
      /*brchCodeChange4(info) {
        this.formItem.discBankName = info.brchFullNameZh;
        this.formItem.discBankCode = info.brchCode;
        this.brchCodeWinDisc = false;
      },*/


      checkOnlyOne(selectList) {
        if (selectList == null || selectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        } else if (selectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return false;
        }
        return true;
      },

      checkMoreOne(selectList) {
        if (selectList == null || selectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        }
        return true;
      },

      getDtoInfoIds(dtoInfoIds) {
        let ids = null;
        if (dtoInfoIds != null && dtoInfoIds.length > 0) {
          for (let i = 0; i < dtoInfoIds.length; i++) {
            if (dtoInfoIds[i].id != null) {
              if (i == 0) {
                ids = dtoInfoIds[i].id;
              } else {
                ids = ids + "," + dtoInfoIds[i].id;
              }
            }
          }
        }
        return ids;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = "guarntrQueryReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        if (exportType === "1") {
          let url = window.LOCAL_CONFIG.API_HOME + "/bp/guaranty/sign/func_happenExportExcel";
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if (this.$refs.datagrid.total == 0) {
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              applySignFlag: this.formItem.applySignFlag,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              applySignFlag: this.formItem.applySignFlag,
              branchType: this.formItem.branchType,
              billNo: this.formItem.billNo,
              applBrchCode: this.formItem.applBrchCode,
              signBrchCode: this.formItem.signBrchCode,
              billType: this.formItem.billType,
              billClass: this.formItem.billClass,
              minBillMoney: this.formItem.minBillMoney,
              maxBillMoney: this.formItem.maxBillMoney,
              minDueDt: this.formItem.minDueDt,
              maxDueDt: this.formItem.maxDueDt,
              minGuarnteeDt: this.formItem.minGuarnteeDt,
              maxGuarnteeDt: this.formItem.maxGuarnteeDt,
              acptBankCode: this.formItem.acptBankCode,
              acptBankName: this.formItem.acptBankName,
              discBankCode: this.formItem.discBankCode,
              discBankName: this.formItem.discBankName,
              signUpMk: this.formItem.signUpMk,
              acctStatus: this.formItem.acctStatus,
              minBillRangeStart:this.formItem.minBillRangeStart,
              maxBillRangeEnd:this.formItem.maxBillRangeEnd,
              guarantyType:this.formItem.guarantyType,
              billOrigin:this.formItem.billOrigin,
              field: field,
              exportType: exportType,
              excelName: this.param,
              pageSize: pageSize
            };
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        } else {
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/bp/guaranty/sign/func_happenExportExcel";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement("input");
            input1.type = "text";
            input1.name = "ids";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "pageSize";
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2);
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);
            let input6 = document.createElement("input");
            input6.type = "text";
            input6.name = "applySignFlag";
            input6.value = this.formItem.applySignFlag;
            form.appendChild(input6);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/bp/guaranty/sign/func_happenExportExcel";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement("input");
              input1.type = "text";
              input1.name = "pageSize";
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1);
            }
            let input3 = document.createElement("input");
            input3.type = "text";
            input3.name = "field";
            input3.value = field;
            form.appendChild(input3);
            let input4 = document.createElement("input");
            input4.type = "text";
            input4.name = "exportType";
            input4.value = exportType;
            form.appendChild(input4);
            let input5 = document.createElement("input");
            input5.type = "text";
            input5.name = "excelName";
            input5.value = this.param;
            form.appendChild(input5);

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      /* clearVal(type) {
         if (type == "applBrchName") {
           this.formItem.applBrchCode = "";
           this.formItem.applBrchName = "";
         }
         if (type == "signBrchName") {
           this.formItem.signBrchCode = "";
           this.formItem.signBrchName = "";
         }
         if (type == "acptBankName") {
           this.formItem.acptBankCode = "";
           this.formItem.acptBankName = "";
         }
         if (type == "discBankName") {
           this.formItem.discBankCode = "";
           this.formItem.discBankName = "";
         }
       }*/
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BarterTrustBillStatus,AcctFlag,BillOrigin,SignUpMarkCode").then(res => {
        this.cdMediaList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
        this.billStatusList = res.get("BarterTrustBillStatus");
        this.AcctFlagList = res.get("AcctFlag");
        this.billOriginList = res.get("BillOrigin");
        this.signUpMarkCodeList = res.get("SignUpMarkCode");
      });
      this.columns = this.deepClone(this.applyColumns);
      this.$refs.datagrid.createShowCol(this.columns);
    }
  };
</script>

<style scoped>

</style>
