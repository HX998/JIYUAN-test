<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.signBrchNoList" :label="$t('m.i.ce.signBrchName')" prop="signBrchNoList" :showCheckBox="true"
                             title="机构名称" :brchNo.sync="formItem.signBrchNoList" :brchName.sync="formItem.signBrchNameList" required>
                </show-branch>

                <common-input v-model="formItem.custNo" :label="$t('m.i.common.custNo')" prop="custNo"
                              showIcon  readonly  clearValTag="custNo" @on-click="queryCustNo()"></common-input>

                <common-input v-model="formItem.custName"  :maxlength=60 :label="$t('m.i.common.custName')" readonly prop="custName"></common-input>

                <common-input v-model="formItem.custAcctNo" :label="$t('m.i.common.custAcctNo')" prop="custAcctNo"
                              showIcon  readonly  @on-click="queryCustAcctNo('drwrAcctNo')"></common-input>

                <h-form-item :label="$t('m.i.ce.signStatus')" prop="signStatusList">
                  <h-select v-model="formItem.signStatusList" multiple   showTitle placeholder="">
                    <h-option v-for="item in signStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>

                <h-form-item :label="$t('m.i.ce.signApplyDt')" prop="minApplDt">
                  <h-date-picker :value="applDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>

                <!--<common-select v-model="formItem.signStatus" :label="$t('m.i.bm.signStatus')" prop="signStatus"
                               :dictList="signStatusList" ></common-select>-->
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
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/acpt/fastacpt/sign/fastAcptSignSearch/func_queryList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">导出EXCEL
              </h-button>
              <h-button type="primary" @click="signOperate()">查看操作历史</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <!--查看操作历史-->
    <fast-acpt-sign-log :fastAcptSignLogWin="fastAcptSignLogWin" :detailFormItem="detailFormItem" :dictMap="dictMap"
                   :histListUrl = "'/ce/acpt/fastacpt/sign/fastAcptSignSearch/func_queryHistList'"
                   @fastAcptSignLogWinClose="fastAcptSignLogWinClose"></fast-acpt-sign-log>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul,exportList } from "@/api/bizApi/commonUtil";
  export default {
    name: "fastAcptSignSearch",
    components: {
      FastAcptSignLog:() => import(/* webpackChunkName: "ce/acpt/fastacpt/sign/fastAcptSignLog" */`@/views/bizViews/ce/acpt/fastacpt/sign/fastAcptSignLog`),
      ShowCustManager:() => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`)
    },
    data(){
      return{
        currentSelectRow : "",
        tempShowExcelTemplateWin : false,
        fastAcptSignLogWin : false,
        showCustMessageWin : false,
        showCustAcctNoWin : false,
        detailFormItem : {},
        dictMap : new Map(),
        signStatusList:[],
        applDt : [],
        //是否显示更多查询项
        ifShowMore : false,
        formItem : {
          signBrchNos: this.$store.getters.userInfo.brchNo,
          signBrchName: this.$store.getters.userInfo.brchName,
          signBrchNoList:JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          signBrchNameList:JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          custNo: "",
          custName: "",
          custAcctNo: "",
          minApplDt: "",
          maxApplDt: "",
          signStatus: "",
          signStatusList:[],
          //signStatusList:[],
          discInBrchName: "",
          custMgrNo: "",
          custMgrName: "",
          custArea: "",
          busiType:"2"
        },
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.signBrchName"),
            key: "signBrchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.signStatus"),
            key: "signStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FAcptSignStatus", params.row.signStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.signApplyDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt;
              if (!!params.row.applDt) {
                date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          }, {
            title: this.$t("m.i.ce.signApplyTm"),
            key: "applTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let time = params.row.applTm;
              if (!!params.row.applTm) {
                let transTm = params.row.applTm.toString();
                if (transTm.length < 6) {
                  for (let i = 0; i < (6 - transTm.length); i++) {
                    transTm = "0" + transTm;
                  }
                }
                time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              }
              return h("span", time);
            }
          },
          {
            title: this.$t("m.i.ce.applSignEnableDt"),
            key: "applActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applActiveDt;
              if (!!params.row.applActiveDt) {
                date = this.$moment(params.row.applActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.applSignDueDt"),
            key: "applFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applFailureDt;
              if (!!params.row.applFailureDt) {
                date = this.$moment(params.row.applFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignEnableDt"),
            key: "actualActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualActiveDt;
              if (!!params.row.actualActiveDt) {
                date = this.$moment(params.row.actualActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignDueDt"),
            key: "actualFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualFailureDt;
              if (!!params.row.actualFailureDt) {
                date = this.$moment(params.row.actualFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.custMgrNo"),
            key: "custMgrNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.custMgrName"),
            key: "custMgrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.limitAmt"),
            key: "limitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let limitAmt = formatNumber(params.row.limitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitAmt
                }
              }, limitAmt);
            }
          },
          {
            title: this.$t("m.i.ce.dealRemark"),
            key: "acceptRemark",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.bm.operOpin"),
            key: "auditRemark",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.remark"),
            key: "remark",
            hiddenCol: false
          }
        ],
        param: null,
        rows: null,
      };
    },
    mounted() {
      this.getDictListByGroups("FAcptSignStatus,Yon,CustArea").then(res => {
        this.signStatusList = res.get("FAcptSignStatus");
        this.YonList = res.get("Yon");
        this.custAreaList = res.get("CustArea");
        this.dictMap = res.get("map");
      });
    },
    methods:{
      //表单查询
      handleSearch() {
        this.currentSelectRow = "";
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.signBrchNoList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
        this.formItem.signBrchNameList = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
        this.formItem.signStatusList = [];
        this.formItem.maxApplDt = "";
        this.formItem.minApplDt = "";
        this.applDt = [];
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = "";
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = 'fastAcptSignReportInfo';
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        let exportUrl =
          window.LOCAL_CONFIG.API_HOME +
          "/ce/acpt/fastacpt/sign/fastAcptSignSearch/func_export";
        //let options = {downloadByHttpReq: true};
        let options = {
          params: {}
        };
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params.ids = this.$refs.datagrid.selectIds;
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      signOperate() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.fastAcptSignLogWin = true;
          this.detailFormItem.signId = this.currentSelectRow.id;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      fastAcptSignLogWinClose() {
        this.fastAcptSignLogWin = false;
        this.detailFormItem = {};
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      clearVal() {
        this.formItem.custNo = "";
        this.formItem.custName = "";
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, {info: "请先选择客户！"});
          return;
        }
        this.showCustAcctNoWin = true;
      },
      handleApplDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDt = [];
        }
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

    }
  }
</script>

<style scoped>

</style>
