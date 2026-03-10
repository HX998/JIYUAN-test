<!--极速贴现-跟踪查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="91" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.transBrchNoList" :label="$t('m.i.ce.discInBrchName')" prop="transBrchNoList" required
                             title="机构名称" :brchNo.sync="formItem.transBrchNoList" :brchName.sync="formItem.discInBrchName">
                </show-branch>
                <h-form-item :label="$t('m.i.common.fdiscMode')" prop="fdiscModes">
                  <h-select v-model="formItem.fdiscModes" placeholder="" multiple showTitle>
                    <h-option v-for="item in fdiscModeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <bill-no :label="$t('m.i.billInfo.billPackageNo')"  v-model="formItem.reverseBillNo" prop="reverseBillNo"></bill-no>
                <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.discDt')" prop="minDiscDt">
                  <h-date-picker :value="discDt" type="daterange" showFormat :editable=false
                                 @on-change="handleDiscDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                  <h-date-picker :value="dueDt" type="daterange" showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" :prop="isMinBillMoney" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.minBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','min')" placeholder=""
                                   @on-focus="formatBillMoney('focus','min')"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2"><span>至</span></h-col>
                    <h-col span="11">
                      <h-typefield type="money" v-model="formItem.maxBillMoney" :maxlength="20"
                                   @on-blur="formatBillMoney('blur','max')" placeholder=""
                                   @on-focus="formatBillMoney('focus','max')" bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item prop="custNameLike" :label="$t('m.i.ce.discountApplyName')" class="h-form-long-label">
                  <h-input v-model="formItem.custNameLike" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="inAcctNo" :label="$t('m.i.ce.inAcctNo')">
                  <h-input v-model="formItem.inAcctNo" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')">
                  <h-input v-model="formItem.acptName" placeholder="" :maxlength="125"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="custMgrName" :label="$t('m.i.ce.inCustManager')">
                  <h-input v-model="formItem.custMgrName" placeholder="" readonly icon="android-search"
                           @on-click="queryCustManager()" clearable @on-clear="clearCustManager()"></h-input>
                </h-form-item>
                <!--<h-form-item label="流程状态" prop="flowStatus">-->
                <!--<h-select v-model="formItem.flowStatus" placeholder="">-->
                <!--<h-option v-for="item in flowStatusList" :value="item.key" :key="item.key">{{ item.value }}-->
                <!--</h-option>-->
                <!--</h-select>-->
                <!--</h-form-item>-->
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                  :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div>
            <div class="text-wrap mb-10">
              <div class="text-header"><span class="tit">{{$t('m.i.ce.detailInfo')}}</span></div>
              <div class="text-body">
                <h-row :gutter="8">
                  <h-col span="8">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.ce.totalCount')}}：</h-col>
                      <h-col span="15" class="val">{{ this.sumCount }}</h-col>
                    </h-row>
                  </h-col>
                  <h-col span="8">
                    <h-row>
                      <h-col span="9" class="label">{{$t('m.i.ce.totalAmt')}}：</h-col>
                      <h-col span="15" class="val">{{ format(this.sumMoney)}}</h-col>
                    </h-row>
                  </h-col>
                </h-row>
              </div>
            </div>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            :hasSelect="false"
            rowSelect
            url="/ce/disc/elec/fastdisc/discBillTrackSearch/func_queryFDiscInfoTrackResult"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="discBillExport">{{$t("m.i.ce.batchExport")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--查询客户经理-->
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="$t('m.i.ce.selectManager')"
                       @showCustManagerWinClose="showCustManagerWinClose"
                       @custManagerSelect="custManagerSelect"></show-cust-manager>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
    <!-- 查看影像弹出框-->
    <h-msg-box :title="$t('m.i.common.showImg')" v-model="showImgWin" width="1000" :mask-closable="false" :footerHide="true" :z-index=1010
               class="h-form-search-layer" top="10" :maximize="true" @on-close="showImageClose">
      <img :src="viewUrl" width="100%" height="600"/>
    </h-msg-box>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>

  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap,formatNumber, accMul, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "discBillTrackSearch",
    components: {
      ShowCustManager:() => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`)
    },
    data() {
      return {
        dueDt : [],
        discDt : [],
        //区分最大和最小票据金额
        billMoneyType : "min",
        formItem : {
          queryFlag: "2",
          transBrchNoList: this.$store.getters.userInfo.brchNo,
          discInBrchName: this.$store.getters.userInfo.brchName,
          billNo: "",
          reverseBillNo:"",
          billOrigin: "",
          minDiscDt: "",
          maxDiscDt: "",
          minDueDt: "",
          maxDueDt: "",
          minBillMoney: "",
          maxBillMoney: "",
          minBillRangeStart: "",
          maxBillRangeStart: "",
          minBillRangeEnd: "",
          maxBillRangeEnd: "",
          custNameLike: "",
          inAcctNo: "",
          drwrName: "",
          acptName: "",
          billType: "",
          custMgrNo: "",
          custMgrName: "",
          flowStatus: "",
          fdiscModes:["000000"]
        },
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        sumCount : "",
        sumMoney : "",
        columns : [
          {
            type: "selection",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },

          {
            title: this.$t("m.i.common.fdiscMode"),
            key: "fdiscModeName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.discountApplyName"),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "custAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.inAcctNo"),
            key: "inAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.toBankName"),
            key: "toBankName",
            hiddenCol: false,
            sortable: true
          },

          {
           title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.discDt == null || params.row.discDt === "") {
                return "";
              }
              let date = this.$moment(params.row.discDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.discInterestRateYear"),
            key: "rate",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rate = params.row.rate;
              // if (!!params.row.rate) {
                rate = formatNumber(accMul(params.row.rate, 100), 4, ",");
              // }
              return h("span", rate);
            }
          },
          {
            title: this.$t("m.i.common.interest"),
            key: "interest",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let interest = formatNumber(params.row.interest, 2, ",");
              return h("span", {
                domProps: {
                  title: interest
                }
              }, interest);
            }
          },
          {
           title: this.$t("m.i.ce.actulPayAmt"),
            key: "realPayAmt",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let realPayAmt = formatNumber(params.row.realPayAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: realPayAmt
                }
              }, realPayAmt);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            ellipsis: false,
            hiddenCol: false,
            sortable: true
          },
          {
             title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            ellipsis: false,
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: "pyeeName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.inCustManagerNo"),
            key: "custMgrNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.inCustManagerName"),
            key: "custMgrName",
            hiddenCol: false,
            sortable: true
          },
          {
           title: this.$t("m.i.ce.isOwnBankAcpt"),
            key: "isAcpt",
            hiddenCol: false,
            render:(h,params) => {
              if (params.row.isAcpt == null || params.row.isAcpt === ""){
                return "";
              }
              if (params.row.isAcpt === '1') {
                return h("span", "是");
              } else {
                return h("span", "否");
              }
            }
          },
          {
            title: this.$t("m.i.be.assetIndustry"),
            key: "busiClassify",
            hiddenCol: window.sessionStorage.getItem("isOpenI9")=="1"?false:true,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"AssetIndustry",params.row.busiClassify);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.delayDays"),
            key: "delayDays",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.interestDueDt"),
            key: "galeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.galeDt;
              if (!!params.row.galeDt) {
                date = this.$moment(params.row.galeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.interestCalDays"),
            key: "interestCalDays",
            hiddenCol: false
          },
          {
           title: this.$t("m.i.common.showImg"),
            key: "showImage",
            hiddenCol: false,
            render: (h, params) => {
              // return h('a', {
              //   on: {
              //     click: () => {
              //       this.showImage(params.row.id);
              //     }
              //   }
              // }, "查看");

              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showImage(params.row.attachId);
                    }
                  }
                }, "查看")
              ]);
            }
          },
          {
            title: "成本利率(%)",
            key: "costRate",
            render: (h, params) => {
              if (params.row.costRate != null && params.row.costRate !== "") {
                let rate = accMul(params.row.costRate, 100);
                return h("span", rate);
              }
            }
          }
        ],
        flowStatusList : [],
        fdiscModeList: [],
        billTypeList : [],
        dictMap : new Map(),
        currentSelectRow : [],
        channelList:[],
        billOriginList : [],
        //是否显示更多查询项
        ifShowMore : false,
        showCustManagerWin : false,
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        billRangeStart : "",
        billRangeEnd : "",
        exportParam: "",
        exportRows: "",
        param : null,
        rows : null,
        tempShowExcelTemplateWin : false,
        //是否显示成本利率
        isMintainCostRate : false,
        rate1 : {
          title: "成本利率(%)",
          key: "costRate",
          hiddenCol: false,
          render: (h, params) => {
            if (params.row.costRate != null && params.row.costRate !== "") {
              let rate = accMul(params.row.costRate, 100);
              return h("span", rate);
            }
          }
        },
        //查看影像
        showImgWin : false,
        viewUrl : "",
      };
    },
    computed: {
      isMinBillMoney() {
        return this.billMoneyType === "min" ? "minBillMoney" : "maxBillMoney";
      }
    },
    mounted() {
      this.getDictListByGroups("Yon,DraftTypeCode,AssetIndustry,FDiscMode,BillOrigin").then(res => {
        // this.flowStatusList = res.get("FDiscSignStatus");
        this.billTypeList = res.get("DraftTypeCode");
        this.fdiscModeList = res.get("FDiscMode");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      this.getIsMintainCostRate();
      this.getSumDetail();

      post({}, "/bm/prod/guideRate/guideRateMain/func_getAllChannels").then(res => {
        if (res) {
          if (res.data.retCode === "000000") {
            this.channelList = res.data.retData;
          }
        }
      });
    },
    methods: {
      format(value){
        return formatNumber(value,2,",");
      },
      //获取系统参数（是否维护成本利率）
      getIsMintainCostRate() {
        post({ paramKey: "bm.prod.is_maintain_cost_rate" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.isMintainCostRate = res.data.retData === "1";
            } else {
              this.isMintainCostRate = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }

            let  columns = [];
            if (this.isMintainCostRate) {
              columns = this.$refs.datagrid.controlColumnsHidden("costRate", false);
            } else {
              columns = this.$refs.datagrid.controlColumnsHidden("costRate", true);
            }
            this.columns = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //查询详情栏信息
      getSumDetail() {
        post(this.formItem, "/ce/disc/elec/fastdisc/discBillTrackSearch/func_sumFDiscInfoResult").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.sumCount = res.data.retData.sumCount;
              this.sumMoney = res.data.retData.sumMoney === null ? "0.00" : res.data.retData.sumMoney;
            } else {
              this.isMintainCostRate = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        let minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        let maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        if (parseFloat(minBillMoney) > parseFloat(maxBillMoney)) {
          this.$msgTip.info(this, { info: "票据金额区间输入有误" });
          return;
        }
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = [];
            this.formItem.minDiscDt = this.formItem.minDiscDt.replace(/-/g, "");
            this.formItem.maxDiscDt = this.formItem.maxDiscDt.replace(/-/g, "");
            this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
            this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
            this.$refs.datagrid.dataChange(1);
            this.getSumDetail();
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt = [];
        this.discDt = [];
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.minDiscDt = "";
        this.formItem.maxDiscDt = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.transBrchNoList = this.$store.getters.userInfo.brchNo;
        this.formItem.discInBrchName = this.$store.getters.userInfo.brchName;
        this.formItem.custMgrNo = "";
        this.$refs.formItem.resetFields();
        this.currentSelectRow = [];
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleDueDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handleDiscDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minDiscDt = arr[0].replace(/-/g, "");
          this.formItem.maxDiscDt = arr[1].replace(/-/g, "");
          this.discDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDiscDt = "";
          this.formItem.maxDiscDt = "";
          this.discDt = [];
        }
      },
      formatBillMoney(optType, itemType) {
        this.billMoneyType = itemType;
        if (optType === "blur") {
          if (itemType === "min") {
            if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
              this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
            }
          } else {
            if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
              this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
            }
          }
        } else if (optType === "focus") {
          if (itemType === "min") {
            this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
          } else {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
          }
        }
      },
      clearCustManager() {
        this.formItem.custMgrNo = "";
        this.formItem.custMgrName = "";
      },
      //查询客户经理
      queryCustManager() {
        this.showCustManagerWin = true;
      },
      //赋值
      custManagerSelect(info) {
        this.formItem.custMgrNo = info.custMgrNo;
        this.formItem.custMgrName = info.custMgrName;
        this.showCustManagerWin = false;
      },
      //关闭弹窗
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      discBillExport() {
        this.param = 'fastDiscTrackSearchReportInfo';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //清单导出
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        if(exportType === "1"){
          let url = window.LOCAL_CONFIG.API_HOME + "/ce/disc/elec/fastdisc/discBillTrackSearch/func_exportExcel";
          let params = null;
          let pageSize = this.$refs.datagrid.total;
          if(this.$refs.datagrid.total == 0){
            pageSize = 1;
          }
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = { ids: this.$refs.datagrid.selectIds,
              pageSize: this.$refs.datagrid.selectIds.length,
              field: field, exportType: exportType, excelName: this.param};
          }else {
            params = { queryFlag: "2",
              transBrchNoList: this.formItem.transBrchNoList,
              discInBrchName: this.formItem.discInBrchName,
              billNo: this.formItem.billNo,
              minDiscDt: this.formItem.minDiscDt,
              maxDiscDt: this.formItem.maxDiscDt,
              minDueDt: this.formItem.minDueDt,
              maxDueDt: this.formItem.maxDueDt,
              minBillMoney: this.formItem.minBillMoney,
              maxBillMoney: this.formItem.maxBillMoney,
              custNameLike: this.formItem.custNameLike,
              inAcctNo: this.formItem.inAcctNo,
              drwrName: this.formItem.drwrName,
              acptName: this.formItem.acptName,
              billType: this.formItem.billType,
              custMgrNo: this.formItem.custMgrNo,
              custMgrName: this.formItem.custMgrName,
              flowStatus: this.formItem.flowStatus,
              fdiscModes: this.formItem.fdiscModes,
              field: field, exportType: exportType, excelName: this.param,pageSize:pageSize};
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
        }else {
          if (this.$refs.datagrid.selectIds.length != 0) {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/disc/elec/fastdisc/discBillTrackSearch/func_exportExcel";
            let form = document.createElement("form");
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");

            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
            let input2 = document.createElement('input')
            input2.type = 'text'
            input2.name = 'pageSize';
            input2.value = this.$refs.datagrid.selectIds.length;
            form.appendChild(input2)
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
            let url = window.LOCAL_CONFIG.API_HOME + "/ce/disc/elec/fastdisc/discBillTrackSearch/func_exportExcel";
            let form = document.createElement("form");
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement('input')
                input.type = 'text'
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input)
              }
            }
            form.setAttribute("id", "formId");
            form.setAttribute("action", url);
            form.setAttribute("method", "post");
            if (this.$refs.datagrid.total > 0) {
              let input1 = document.createElement('input')
              input1.type = 'text'
              input1.name = 'pageSize';
              input1.value = this.$refs.datagrid.total;
              form.appendChild(input1)
            }
            let input3 = document.createElement('input')
            input3.type = 'text'
            input3.name = 'field';
            input3.value = field;
            form.appendChild(input3)
            let input4 = document.createElement('input')
            input4.type = 'text'
            input4.name = 'exportType';
            input4.value = exportType;
            form.appendChild(input4)
            let input5 = document.createElement('input')
            input5.type = 'text'
            input5.name = 'excelName';
            input5.value = this.param;
            form.appendChild(input5)

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        }
      },
      billInfoWinClose() {
        this.billId = "";
        this.billNo = "";
        this.showBillInfoWin = false;
      },
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      //查看影像
      showImage(id) {
        if (null == id || id == "") {
          this.$msgTip.info(this, { info: "该票据无影像信息" });
          return;
        }
        this.viewUrl = window.LOCAL_CONFIG.API_HOME+ "/pc/flow/audit/imageById?id=" + id;
        this.$loadingbox.open({
          title: "获取图像信息中，请稍后..."
        });
        setTimeout(() => {
          this.$loadingbox.close();
          this.showImgWin = true;
        }, 1000);
      },
      //查看影像关闭
      showImageClose() {
        this.showImgWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
