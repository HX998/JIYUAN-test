<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-date-picker v-model="formItem.dealDtArr" :label="$t('m.i.common.transDt')" prop="dealDtArr" type="daterange" :rangeValue="['minDealDt','maxDealDt']"
                                    :minDealDt.sync="formItem.minDealDt" :maxDealDt.sync="formItem.maxDealDt">
                </common-date-picker>
                <show-branch v-model="formItem.brchNos" :label="$t('m.i.common.brchName')" prop="brchNos"
                             title="机构名称" :brchNo.sync="formItem.brchNos" :brchName.sync="formItem.branchName">
                </show-branch>
                <h-form-item :label="$t('m.i.pc.provisionType')" prop="provisionType">
                  <h-select v-model="formItem.provisionType" placeholder="">
                    <h-option v-for="item in balanceTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <!-- 票据来源 -->
                <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                               v-model="formItem.billOrigin" :dictList="billOriginList"></common-select>
                <!-- 票据号码 -->
                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike"></h-input>
                </h-form-item>
                <!-- 子票区间 -->
                <h-form-item :label="$t('m.i.billInfo.billRange')" prop="billRange">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.billRangeStart" integerNum="12" placeholder="" type="int"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.billRangeEnd" integerNum="12" placeholder="" type="int"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>

                <h-form-item :label="$t('m.i.pc.startDt')" prop="startDt">
                  <h-date-picker type="date" format="yyyy-MM-dd" v-model="formItem.startDt" :showFormat=true
                                 placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.status')" prop="status">
                  <h-select v-model="formItem.statusList" placeholder="" multiple showTitle>
                    <h-option v-for="item in provisionStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" :hasSelect="false" rowSelect
                      url="/pc/acct/provision/provisionSearch/func_queryProvision" :bindForm="formItem"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="showJiTi">{{$t("m.i.pc.showJiTi")}}</h-button>
              <h-button type="primary" @click="tempShowExcelTemplateWinOpen()">{{$t("m.i.common.listExport")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 产品名称选择弹窗框 -->
    <h-msg-box v-model="prodNameSelectWin" width="400" class="h-form-search-layer" :mask-closable="false"
               :maximize="true">
      <p slot="header">
        <span>产品号选择</span>
      </p>
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isDisabled" @click='expandTree(productTreeData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="!isDisabled" @click='unExpandTree(productTreeData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;height:300px">
          <h-tree :data="productTreeData" ref='productTreeData' class='h-tree-self'></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="prodNameSelectWin=!prodNameSelectWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="productNameAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <h-msg-box maximize v-model="showProvisionDetil" width=600>
      <p slot="header">
        <span>查看计提明细</span>
      </p>
      <h-datagrid :columns="jitimingxicolumns" :autoLoad="autoLoad" url="/pc/acct/provision/queryProvisionDetail"
                  :bindForm="whichSelect"
                  ref="datagrid1">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      <div slot="footer">
      </div>
    </h-msg-box>

    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo":billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>

  </div>
</template>
<script>
  import { post, formatNumber,exportList,getDictListByGroups, getDictValueFromMap,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "provisionSearch",
    components: {

    },
    data() {
      return {
        billId : "",
        billNo : "",
        showBillInfoWin : false,
        prodNameSelectWin: false,
        jitimingxicolumns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            key: "billNo",
            title: this.$t("m.i.billInfo.billPackageNo"),
            hiddenCol: false,
            sortable: true,

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
            key: "jitiDt",
            title: this.$t("m.i.pc.jitiDt"),
            hiddenCol: false,
           sortable: true,
            render: (h, params) => {
              return h("span", params.row.jitiDt ? this.$moment(params.row.jitiDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          }, {
            key: "brchNo",
            title: this.$t("m.i.common.brchNo"),
            hiddenCol: false
          }, {
            key: "currentInterest",
            title: this.$t("m.i.pc.currentProInterest"),
            sortable: true,
            hiddenCol: false
          }
        ],
        columns: [
          {
            type: "selection",
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center",
            width: 50,
            hiddenCol: false
          },
          {
            key: "provisionType",
            title: this.$t("m.i.pc.provisionType"),
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"BalanceType",params.row.provisionType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            align:'center',
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);

              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            key: "billNo",
            title: this.$t("m.i.billInfo.billPackageNo"),
            hiddenCol: false,
            sortable: true,
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
            title:this.$t("m.i.billInfo.billPackageMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.billMoney, 2, ','))
              ]);
            }
          },
          {
            key: "status",
            title: this.$t("m.i.common.status"),
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"ProvisionStatus",params.row.status);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            key: "dealDt",
            title: this.$t("m.i.common.transDt"),
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dealDt ? this.$moment(params.row.dealDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-");
            }
          },
          {
            key: "prodName",
            title: this.$t("m.i.pc.acctTransName"),
            sortable: true,
            hiddenCol: false
          },
          {
            key: "interest",
            title: this.$t("m.i.common.interest"),
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", formatNumber(params.row.interest, 2, ","));
            }
          },
          {
            key: "provInterest",
            title: this.$t("m.i.pc.provInterest"),
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.provInterest, 2, ","));
            }
          },
          {
            key: "remaInterest",
            title: this.$t("m.i.pc.remaInterest"),
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.remaInterest, 2, ","));
            }
          },
          {
            key: "startDt",
            title: this.$t("m.i.pc.startDt"),
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.startDt ? this.$moment(params.row.startDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-");
            }
          },
          {
            key: "realJitiEndDt",
            title: this.$t("m.i.pc.realJitiEndDt"),
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.realJitiEndDt ? this.$moment(params.row.realJitiEndDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-");
            }
          },
          {
            key: "brchNo",
            title: this.$t("m.i.common.brchNo"),
            hiddenCol: false
          },
          {
            key: "planTaxDate",
            title: this.$t("m.i.pc.planTaxDate"),
            sortable: true,
            hiddenCol: false
          },
          {
            key: "jitiDt",
            title: this.$t("m.i.pc.jitiDt"),
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.jitiDt ? this.$moment(params.row.jitiDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "-");
            }
          }, {
            key: "realTaxDt",
            title: this.$t("m.i.pc.realTaxDt"),
            sortable: true,
            hiddenCol: false
          },{
            title:this.$t("m.i.pc.currentInterest1"),
            key:"currentInterest",
            sortable: true,
            hiddenCol:false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.currentInterest, 2, ","));
            }
          },
          {
            title:this.$t("m.i.pc.currTaxInterest"),
            key:"currTaxInterest",
            sortable: true,
            hiddenCol:false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.currTaxInterest, 2, ","));
            }
          }
        ],
        formItem: {
          dealDtArr: [],
          minDealDt: "",
          maxDealDt: "",
          brchNos: "",
          branchName: "",
          billNo: "",
          billNoLike: "",
          provisionType: "",
          startDt: "",
          status: "",
          billOrigin: "",
          billRangeStart: "",
          billRangeEnd: "",
          statusList:[]
        },
        // 机构树
        branchList: [],
        showMessageBox: false,
        messageBoxData: [],
        brchNosOrprodNos: false,
        messageBoxTitle: "",
        checkedbrchNosName: "",
        checkedbrchs: [],
        checkedprodNos: "",
        type: null,
        tableRef: "selfTable",
        showProvisionDetil: false,
        showmsgBox: false,
        //选择的机构号集合
        selectList: [],
        //表格内选中的数据的id号
        whichSelect: {
          provision_id: ""
        },
        wanttosave: [],
        productTreeData: [],
        tempShowExcelTemplateWin: false,
        param: null,
        rows: null,
        isDisabled: true,
        ifShowMore: false,
        showcheckbox: false,
        autoLoad: false,
        tmpForm: {},
        balanceTypeList: [],
        provisionStatusList: [],
        billOriginList: [],
        dictMap: new Map(),
      };
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
      let workDate = this.$moment(window.sessionStorage.getItem("preWorkDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.dealDtArr = [workDate, workDate];
      this.formItem.minDealDt = window.sessionStorage.getItem("preWorkDate");
      this.formItem.maxDealDt = window.sessionStorage.getItem("preWorkDate");
    },
    mounted() {
      getDictListByGroups("BalanceType,ProvisionStatus,BillOrigin").then(res => {
        this.provisionStatusList = res.get("ProvisionStatus");
        this.balanceTypeList = res.get("BalanceType");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    methods: {
        showBillInfo(row) {
            this.billId = row.billId;
            this.billNo = row.billNo;
            this.billRangeStart = row.billRangeStart;
            this.billRangeEnd = row.billRangeEnd;
            this.showBillInfoWin = true;
        },
        billInfoWinClose() {
            this.showBillInfoWin = false;
        },
      //计提明细按钮点击事件
      showJiTi() {
        this.wanttosave = this.$refs.datagrid.selects;
        if (this.wanttosave.length == 1) {
          this.showProvisionDetil = true;
          this.$nextTick(() => {
            this.whichSelect.provision_id = this.wanttosave[0].id;
            this.$refs.datagrid1.dataChange(1);
          });
        }
        else if (this.wanttosave.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
        else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
        }
      },
      //查询点击事件
      formSearch() {
        //转换form表单中date日期的类型
        this.formItem.startDt = this.formItem.startDt.replace(/-/g, "");
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        //设置清单导出时所需的查询条件
        this.tmpForm = JSON.parse(JSON.stringify(this.formItem));
        this.$refs.datagrid.dataChange(1);
      },
      //表单重置事件
      formSearchReset() {
        let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
        this.formItem.statusList = [];
        this.$refs.formItem.resetFields();
        let workDate = this.$moment(window.sessionStorage.getItem("preWorkDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.formItem.dealDtArr = [workDate, workDate];
        this.formItem.minDealDt = window.sessionStorage.getItem("preWorkDate");
        this.formItem.maxDealDt = window.sessionStorage.getItem("preWorkDate");
        this.formItem.billRangeStart = "";
        this.formItem.billRangeEnd = "";
      },

      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      //获取导出模板
      tempShowExcelTemplateWinOpen() {
        this.param = "provisionSearchReportInfo";
        if (this.$refs.datagrid.selectIds.length != 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },

      //清单导出
      exportList(field, exportType) {
        if (this.formItem.startDt != null && this.formItem.startDt != "") {
          this.formItem.startDt = this.formItem.startDt.replace(/-/g, "");
        }
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/acct/provision/exportData";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
    }
  };

</script>
