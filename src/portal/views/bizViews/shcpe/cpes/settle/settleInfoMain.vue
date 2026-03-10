<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <show-cpes-branch  :label="$t('m.i.common.payBrchName')"  class="h-form-long-label"
                                     :brchCode.sync="formItem.branchCode"  :cpesBrchName.sync="formItem.branchName"
                                     datagridUrl="/cpes/branch/queryBranchList" prop="branchName"
                                     queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                  <show-cpes-branch  :label="$t('m.i.common.rcvBrchName')"  class="h-form-long-label"
                                     :brchCode.sync="formItem.rcvBranchCode"  :cpesBrchName.sync="formItem.rcvBranchName"
                                     datagridUrl="/cpes/branch/queryBranchList" prop="branchName"
                                     queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

                  <h-form-item prop="settleBusiType" label="业务种类">
                    <h-select v-model="formItem.settleBusiType" placeholder="">
                      <h-option v-for="item in settleBusiTypeList" :value="item.key" :key="item.value">{{ item.value
                        }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.settleDt')" prop="settleDate">
                    <h-date-picker type="daterange" autoPlacement placeholder="" :value="settleDate" format="yyyy-MM-dd" showFormat
                                   @on-change="settleDtChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')">
                    <h-input v-model="formItem.billNoLike" placeholder="" :maxlength="30"></h-input>
                  </h-form-item>
                  <bill-range :form-item="formItem" :range-props="['minBillRangeStart', 'maxBillRangeEnd']"></bill-range>
                  <h-form-item prop="dealNo" label="成交单编号">
                    <h-input v-model="formItem.dealNo" placeholder="" :maxlength="20"></h-input>
                  </h-form-item>
                  <h-form-item prop="branchCode" v-show="false">
                    <h-input v-model="formItem.branchCode"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/settle/settleInfoMain/func_querySettleInfo"
            :bindForm="formItem"
            :row-select="true"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="tempShowExcelTemplateWinOpen('batch')" v-if="authObj.listExportBtn">清单导出</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="billId" :billNo="billNo"
                    :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap ,formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "settleInfoMain",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
          billId : "",
          billNo : "",
          billRangeStart : "",
          billRangeEnd : "",
          showBillInfoWin : false,
        formItem: {
          branchCode: "",
          settleDate: "",
          minSettleDt:"",
          maxSettleDt:"",
          settleBusiType: "",
          branchName: "",
          rcvBranchCode: "",
          rcvBranchName:"",
          dealNo: "",
          minBillRangeStart: "",
          maxBillRangeEnd: "",
          billNoLike: ""
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",
            hiddenCol: false
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            hiddenCol: false
          },

          {
            title: this.$t("m.i.common.id"),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t("m.i.common.settleBusiType"),
            key: "settleBusiType",
            hiddenCol: false,
            align: "center",

            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlRequestType", params.row.settleBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.shcpe.dlvOrderNo"),
            key: "dlvOrderNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            hiddenCol: false,
            align: "center",
            sortable: true,
            render: (h, params) => {
                return h("a", {
                    on: {
                        click: () => {
                            this.showBillInfo(params.row.billId,params.row.billNo, params.row.billRangeStart, params.row.billRangeEnd);
                        }
                    }
                }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            key:"billRange",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.pageShowFormatBillRange(params.row.billRangeStart, params.row.billRangeEnd);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          // {
          //   title: this.$t('m.i.billInfo.billRange'),
          //   key: 'billRange',
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
          //     return h("span", {
          //       domProps: {
          //         title: dictValue
          //       }
          //     }, dictValue);
          //   }
          // },
          {
            title: this.$t("m.i.common.totalNum"),
            key: "totalNum",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.clearType"),
            key: "clearType",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "ClearType", params.row.clearType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.be.settleMode"),
            key: "settleMode",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "SettleType", params.row.settleMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.be.firstPayInterest"),
            key: "firstPayInterest",
            sortable: true,
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let firstPayInterest = formatNumber(params.row.firstPayInterest, 2, ',');
              return h("span", {
                domProps: {
                  title: firstPayInterest
                }
              }, firstPayInterest);
            }
          },
          {
            title: this.$t("m.i.pc.settleAmt"),
            key: "settleAmt",
            hiddenCol: false,
            sortable: true,
            align: "center",
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
            title: this.$t("m.i.be.settleDt"),
            key: "settleDt",
            hiddenCol: false,
            align: "center",
            sortable: true,
            render: (h, params) => {
              if (null != params.row.settleDt && "" !== params.row.settleDt) {
                let dttm = this.$moment(params.row.settleDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", dttm);
              }
            }
          },
          {
            title: this.$t("m.i.shcpe.settleResult"),
            key: "settleResult",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlResult", params.row.settleResult);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.settleFailCode"),
            key: "settleFailCode",
            hiddenCol: false,
            align: "center",

            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "StlFlRson", params.row.settleFailCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.shcpe.drweBrchCode"),
            key: "drweBrchCode",
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.drweBrchName"),
            key: "drweBrchName",
            hiddenCol: false,
            sortable: true,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.drweTrstAcctNo"),
            key: "drweTrstAcctNo",
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.drweTrstAcctName"),
            key: "drweTrstAcctName",
            sortable: true,
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.drweFundAcctNo"),
            key: "drweFundAcctNo",
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.drweFundAcctName"),
            key: "drweFundAcctName",
            sortable: true,
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.rcvBrchCode"),
            key: "rcvBrchCode",
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.rcvBrchName"),
            key: "rcvBrchName",
            sortable: true,
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.rcvTrstAcctNo"),
            key: "rcvTrstAcctNo",
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.pyeeTrstAcctName"),
            key: "pyeeTrstAcctName",
            sortable: true,
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.rcvFundAcctNo"),
            key: "rcvFundAcctNo",
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.pyeeFundAcctName"),
            key: "pyeeFundAcctName",
            sortable: true,
            hiddenCol: false,
            align: "center"

          },
          {
            title: this.$t("m.i.shcpe.ccpcMsgId"),
            key: "ccpcMsgId",
            hiddenCol: false,
            align: "center"

          }
        ],
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        authObj: {
          listExportBtn: true
        },
        settleDate:[],
        //showCpesBranch: false,
        //showRcvCpesBranch: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        tableRef: "selfTable",
        ifShowMore: false,
        selectExportType: "",
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        settleBusiTypeList: [],
        dictMap: []
      };
    },
    watch: {},

    computed: {},
    mounted() {
      getDictListByGroups("StlRequestType,ClearType,SettleType,StlResult,StlFlRson").then(res => {
        this.settleBusiTypeList = res.get("StlRequestType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
          this.billId = billId;
          this.billNo = billNo;
          this.billRangeStart = billRangeStart;
          this.billRangeEnd = billRangeEnd;
          this.showBillInfoWin = true;
      },
      billInfoWinClose() {
          this.showBillInfoWin = false;
      },
      //重置查询结果
      resetSearch() {
        this.settleDate = [];
        this.formItem.minSettleDt = "";
        this.formItem.maxSettleDt = "";
        this.$refs.formItem.resetFields();
        this.formItem.branchName = "";
        this.formItem.branchCode = "";
        this.formItem.rcvBranchName = "";
        this.formItem.rcvBranchCode = "";
      },

      //清单导出
      tempShowExcelTemplateWinOpen(type) {
        this.selectExportType = type;
        if (type === "batch") {
          this.param = "settleInfo";
        } else {
          return;
        }
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //清单导出
      exportList(field, exportType) {
        //exportType: 0-同步 1-异步
        let url;
        if (this.selectExportType === "batch") {
          url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/settle/settleInfoMain/func_downloadSettleInfo";
        } else {
          return;
        }
        if (exportType === "1") {
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              ids: this.$refs.datagrid.selectIds,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              branchCode: this.formItem.branchCode,
              settleDate: this.formItem.settleDate,
              settleBusiType: this.formItem.settleBusiType,
              branchName: this.formItem.branchName,
              rcvBranchCode: this.formItem.rcvBranchCode,
              rcvBranchName: this.formItem.rcvBranchName,
              dealNo: this.formItem.dealNo,
              billNoLike: this.formItem.billNoLike,
              minBillRangeStart: this.formItem.minBillRangeStart,
              maxBillRangeEnd: this.formItem.maxBillRangeEnd,
              field: field,
              exportType: exportType,
              excelName: this.param,
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
          if (this.$refs.datagrid.selectIds.length !== 0) {
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

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          } else {
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

      listExport() {
        let url = window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/settle/settleInfoMain/func_downloadSettleInfo";
        let form = document.createElement("form");
        form.innerHTML = `<input type="text" name="branchCode" value="${this.formItem.branchCode}"/>
                           <input type="text" name="rcvBranchCode" value="${this.formItem.rcvBranchCode}"/>
                          <input type="text" name="settleBusiType" value="${this.formItem.settleBusiType}"/>
                          <input type="text" name="settleDate" value="${this.formItem.settleDate}"/>
                          <input type="text" name="billNo" value="${this.formItem.billNo}"/>
                          <input type="text" name="dealNo" value="${this.formItem.dealNo}"/>`;
        form.setAttribute("id", "form1");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        document.getElementById("form1").submit();
        document.getElementById("form1").remove();
      },
      /*queryBranchCode() {
        this.showCpesBranch = true;
      },*/
      /*queryRcvBranchCode() {
        this.showRcvCpesBranch = true;
      },*/
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      /*showRcvCpesBranchClose() {
        this.showRcvCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.branchCode = info.brchCode;
        this.formItem.branchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/

      //根据弹框所选数据进行赋值
      /*showRcvCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.formItem.rcvBranchCode = info.brchCode;
        this.formItem.rcvBranchName = info.brchFullNameZh;
        this.showRcvCpesBranch = false;
      },*/

      settleDtChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minSettleDt = arr[0].replace(/-/g, "");
          this.formItem.maxSettleDt = arr[1].replace(/-/g, "");
          this.settleDate = [arr[0],arr[1]];
        } else {
          this.formItem.minSettleDt = "";
          this.formItem.maxSettleDt = "";
          this.settleDate = [];
        }
      },
      pageShowFormatBillRange(billRangeStart, billRangeEnd) {
        if (billRangeStart == null || billRangeStart === ""
          || billRangeEnd == null || billRangeEnd === "") {
          return '-';
        }
        if (billRangeStart.toString() === '0' && billRangeEnd.toString() === '0') {
          return '0';
        }
        return billRangeStart.toString().padLeft(12, '0') + "," + billRangeEnd.toString().padLeft(12, '0');
      }
    }
  };
</script>

<style scoped>

</style>
