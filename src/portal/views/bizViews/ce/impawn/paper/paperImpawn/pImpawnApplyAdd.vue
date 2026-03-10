<template>
  <div>
    <h-msg-box v-model="tempImpawnAddOrEditWin" :maximize="true" @on-close="handleClose" width="1000" class="h-form-search-layer" top="10">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'noCommit'">修改申请</span>
        <span v-else-if="batchParams.batchType==='modify' && batchParams.isCommit === 'hasCommit'">撤销申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <show-branch v-model="addOrEditForm.ownedBrchNo" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" title="机构名称"
                         :filterable="batchParams.batchType==='add'" :required="isRequired" :showCheckBox="false" v-show="this.licenseFlag" :msgBoxWin="tempImpawnAddOrEditWin"
                         :brchNo.sync="addOrEditForm.ownedBrchNo" :brchName.sync="addOrEditForm.ownedBrchName" :params="{authPath: this.$route.path}"
                         url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
            </show-branch>
            <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
              <h-input v-model="addOrEditForm.custNo" placeholder="" :icon="batchParams.batchType==='add' ? 'android-search' : ''" @on-click="queryCustName()" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
              <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required>
              <h-input v-model="addOrEditForm.custAcctNo" placeholder="" :icon="batchParams.batchType==='add' ? 'android-search' : ''" @on-click="queryCustAcctNo()" readonly></h-input>
            </h-form-item>
            <h-form-item prop="bailAcctNo" :label="$t('m.i.common.bailAcctNo')" required v-if="this.buttonAuth.showBailAcctInput === undefined ? false : this.buttonAuth.showBailAcctInput.isShow">
              <h-input v-model="addOrEditForm.bailAcctNo" placeholder="" :icon="batchParams.batchType==='add' ? 'android-search' : ''" @on-click="queryCustBailAcctNo()" readonly></h-input>
            </h-form-item>
            <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
              <h-select v-model="addOrEditForm.billType" placeholder="" :readonly="batchParams.batchType==='modify'">
                <h-option v-for="item in batchParams.billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="custMgrName" :label="$t('m.i.common.custMgrName')" :required="custMgrRequired">
              <h-input v-model="addOrEditForm.custMgrName" placeholder="" readonly :icon="isCustMgrAllow ? 'android-search' : ''" @on-click="queryCustManager()"></h-input>
            </h-form-item>
            <h-form-item prop="impawnType" :label="$t('m.i.ce.impawnType')" required>
              <h-select v-model="addOrEditForm.impawnType" placeholder="">
                <h-option value="1">普通质押</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.queryType')" prop="queryType" v-if="isQueryRecovery" required>
              <h-select v-model="addOrEditForm.queryType" @on-change="queryTypeChange" placeholder="">
                <h-option v-for="item in batchParams.queryTypeList" :value="item.key" :key="item.id">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.ce.isPledgeCheck')" prop="isBackQuery" :required="isRequired" v-if="isShowBackQuery">
              <h-select v-model="addOrEditForm.isBackQuery" placeholder="">
                <h-option v-for="item in batchParams.isList" :value="item.key" :key="item.key">{{ item.value }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="impawnDt" :label="$t('m.i.ce.impawnDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.impawnDt" placeholder="" @on-change="handleImpawnDtChange" showFormat :editable=false></h-date-picker>
            </h-form-item>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()" v-if="this.batchParams.isCommit === 'noCommit'">保存</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          url="/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_pageQueryImpawnBillList"
          :bindForm="formItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoAddOrModifyWin('add')">{{$t("m.i.common.add")}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoAddOrModifyWin('modify')">{{$t("m.i.common.modify")}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoImport">{{$t("m.i.common.batchImport")}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoExport">{{$t("m.i.ce.batchExport")}}</h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="importTemplate">{{$t('m.i.common.importTemplateDownload')}}</h-button>
            <h-dropdown placement="bottom-start" @on-click="infoDelete" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary" >{{$t('m.i.common.delete')}}<h-icon name="unfold"></h-icon></h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="selectDelete">{{$t('m.i.be.chooseDelete')}}</h-dropdown-item>
                <h-dropdown-item name="listDelete">{{$t('m.i.be.batchListDelete')}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t("m.i.common.submit")}}<h-icon name="unfold"></h-icon></h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">{{$t('m.i.ce.selectSubmit')}}</h-dropdown-item>
                <h-dropdown-item name="batch">{{$t("m.i.ce.batchSubmit")}}</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="infoCancel">{{$t("m.i.common.cancel")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       :licenseFlag="this.licenseFlag" :ownedBrchNo="this.addOrEditForm.ownedBrchNo" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.addOrEditForm.custNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!-- 查询客户保证金账号弹窗-->
    <show-cust-acct-no :show-cust-acct-no-win="showCustBailAcctNoWin" :cust-no="this.addOrEditForm.custNo" @showCustAcctNoWinClose="showCustBailAcctNoWin = false" @custAcctNoSelectSubmit="custBailAcctNoSelectSubmit" custAcctKind="2" title="查询客户保证金账号信息窗口"></show-cust-acct-no>
    <!--查询客户经理-->
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="$t('m.i.ce.selectManager')" @showCustManagerWinClose="showCustManagerWinClose" @custManagerSelect="custManagerSelect"></show-cust-manager>
    <!-- 票面信息 -->
    <impawn-bill-info :impawnAddBillWin="impawnAddBillWin" :impawnBillInfoParams="impawnBillInfoParams"
                      @impawnAddBillWinClose="impawnAddBillWinClose" @impawnAddBillSubmit="impawnAddBillSubmit"></impawn-bill-info>
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose" @importSuccess="importSuccess"></common-file-upload>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <!--风险信息-->
    <risk-check :riskCheckWin="riskCheckWin" :riskParams="riskParams" @riskCheckWinClose="riskCheckWinClose" @riskCheckSubmit="riskCheckSubmit"></risk-check>

    <common-excel-download @handleSubmit="exportForm" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pImpawnApplyAdd",
    components: {
      ShowCustManager:()=>import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
      ImpawnBillInfo:()=>import(/* webpackChunkName: "ce/impawn/common/impawnBillInfo" */`@/views/bizViews/ce/impawn/common/impawnBillInfo`),
    },
    data() {
      return {
        showCustBailAcctNoWin:false,
        batchId: "",
        isRequired: true,
        addOrEditForm: {
          id: "",
          billClass: "ME01",
          billType: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          ownedBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchName:this.$store.getters.userInfo.brchName,
          licenseFlag:false,
          custMgrNo:  this.$store.getters.userInfo.userNo,
          custMgrName: this.$store.getters.userInfo.userName,
          impawnType: "1",
          queryType: "",
          isBackQuery: "",
          impawnDt: "",
          bailAcctNo:""
        },
        formItem: {
          batchId: "",
          funcNo: "",
          billClass: "ME01"
        },
        columns: [
          {
            type: "selection",
            key: "multiSelect",
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
           title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let info = "", type = "";
              if (!!params.row.billId) {
                info = params.row.billId;
                type = "billId";
              } else {
                info = params.row.billNo;
                type = "billNo";
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(info, type);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", params.row.billType);
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
          title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            ellipsis: false,
            hiddenCol: false,
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
           title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: "drwrBankNo",
            ellipsis: false,
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
           title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: "pyeeAcctNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.pyeeBankNo"),
            key: "pyeeBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          }
        ],
        //票据明细界面-区分新增/修改操作
        billOptType: "",
        //授权机构
        // brchNoWin:false,
        //票面信息窗口
        impawnAddBillWin: false,
        //修改票据明细界面所需入参
        impawnBillInfoParams: {
          billOptType: "",
          billType: "",
          billId: "",
          billNo: "",
          dictMap: new Map(),
          billTypeList: []
        },
        impawnAddBillInfoForm: {},

        showCustMessageWin: false,
        showCustAcctNoWin: false,
        //记录批次是否已保存
        hadBatchSave: false,
        //通过参数控制客户经理是否可选
        isCustMgrAllow: false,
        showCustManagerWin: false,
        //通过参数控制对公质押是否查询查复
        isQueryRecovery: false,
        param: null,
        rows: null,
        tempShowExcelTemplateWin: false,
        importWin: false,
        fileParams: {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_loadExcelData",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_submitExcelData",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "selection",
              key: "multiSelect",
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
             title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true
            },
            {
              title: this.$t("m.i.billInfo.billType"),
              key: "billType",
              ellipsis: false,
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", params.row.billType);
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
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
              key: "billMoney",
              ellipsis: false,
              hiddenCol: false,
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
             title: this.$t("m.i.billInfo.drwrName"),
              key: "drwrName",
              sortable: true,
              ellipsis: false,
              hiddenCol: false
            },
            {
             title: this.$t("m.i.billInfo.drwrAcctNo"),
              key: "drwrAcctNo",
              ellipsis: false,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drweBankName"),
              key: "drweBankName",
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
             title: this.$t("m.i.billInfo.pyeeAcctNo"),
              key: "pyeeAcctNo",
              ellipsis: false,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeBankName"),
              key: "pyeeBankName",
              ellipsis: false,
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptName"),
              key: "acptName",
              sortable: true,
              ellipsis: false,
              hiddenCol: false
            }
          ],
          paramKey: "list"         //后台接收对应key
        },
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        //风险信息窗口
        riskCheckWin: false,
        riskParams: {},
        submitType : "",
        custMgrRequired:false
      }
    },
    props: {
      licenseFlag:"",
      authPath:"",
      impawnAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {
          dictMap: new Map(),
          billTypeList: [],
          queryTypeList: [],
          isList: [],
          impawnBatchId: "",
          batchType: "",
          isCommit: "",
          funcNo: ""
        }
      },
      buttonAuth:{
        type:Object,
        default() {
          return {};
        }
      }
    },
    computed: {
      tempImpawnAddOrEditWin: {
        get() {
          return this.impawnAddOrEditWin;
        },
        set() {
        }
      },
      isShowBackQuery() {
        let isSHow = false;
        if (this.isQueryRecovery) {
          if (this.addOrEditForm.queryType === "" || this.addOrEditForm.queryType === "4" || this.addOrEditForm.queryType === "2") {
            isSHow = false;
            this.isRequired = false;
          } else {
            isSHow = true;
            this.isRequired = true;
          }
        } else {
          isSHow = false;
          this.isRequired = false;
        }
        return isSHow;
      }
    },
    watch: {
      impawnAddOrEditWin(val) {
        if (val) {
          this.getIsAllowOtherCustMgr();
          this.$nextTick(() => {
            this.batchId = this.batchParams.impawnBatchId;
            this.isQueryRecovery = this.batchParams.isQueryRecovery;
            this.formItem.batchId = this.batchId;
            this.formItem.funcNo = this.batchParams.funcNo;
            if (this.batchParams.batchType === "modify") {
              this.queryObjById();
              this.handleSearch();
            }else if (this.batchParams.batchType === "add") {
              this.$refs.datagrid.tData = [];
              if (this.isQueryRecovery) {
                this.addOrEditForm.queryType = "1";
                this.addOrEditForm.isBackQuery = "0";
              } else {
                this.addOrEditForm.queryType = "4";
                this.addOrEditForm.isBackQuery = "";
              }
              this.addOrEditForm.ownedBrchNo = this.$store.getters.userInfo.brchNo;
              this.addOrEditForm.ownedBrchName = this.$store.getters.userInfo.brchName;
              this.addOrEditForm.custMgrNo = this.$store.getters.userInfo.userNo;
              this.addOrEditForm.custMgrName = this.$store.getters.userInfo.userName;
              this.addOrEditForm.impawnDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
            }
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    mounted() {
      // 质押是否客户经理是否必输（配置中心）
      post({ paramKey: "ce.impawn.is_cust_mgr_required" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.custMgrRequired = res.data.retData === "1";
          } else {
            this.custMgrRequired = false;
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      //获取系统参数（控制客户经理是否可选）
      getIsAllowOtherCustMgr() {
        post({}, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_getCustMgrforConfigCenter").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let isAllowOtherCustMgr = res.data.retData.isAllowOtherCustMgr;
              this.isCustMgrAllow = isAllowOtherCustMgr === "1";
            } else {
              this.isCustMgrAllow = false;
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //获取系统参数（对公质押是否查询查复）
      //修改时根据票据批次Id查询票据批次信息
      queryObjById() {
        let params = { id: this.batchId, billClass: "ME01", funcNo: this.batchParams.funcNo };
        post(params, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_getImpawnBatchInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.custNo = obj.custNo;
              this.addOrEditForm.custName = obj.custName;
              this.addOrEditForm.custAcctNo = obj.custAcctNo;
              this.addOrEditForm.custMgrNo = obj.custMgrNo;
              this.addOrEditForm.custMgrName = obj.custMgrName;
              this.addOrEditForm.impawnType = obj.impawnType;
              this.addOrEditForm.ownedBrchNo = obj.ownedBrchNo;
              this.addOrEditForm.ownedBrchName = obj.ownedBrchName;
              this.addOrEditForm.bailAcctNo = obj.bailAcctNo;
              if (!!obj.impawnDt) {
                this.addOrEditForm.impawnDt = this.$moment(obj.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              if (this.isQueryRecovery) {
                this.addOrEditForm.queryType = obj.queryType;
                this.addOrEditForm.isBackQuery = obj.isBackQuery;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.addOrEditForm.ownedBrchNo = userInfo.brchNo;
        this.addOrEditForm.ownedBrchName = userInfo.brchName;
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.custMgrNo = "";
        this.addOrEditForm.id = "";
        this.hadBatchSave = false;
        this.$emit("impawnAddOrEditWinClose", "");
      },
      handleImpawnDtChange(value) {
        this.addOrEditForm.impawnDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //查询客户信息
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.addOrEditForm.custName = info.custName;
        this.addOrEditForm.custNo = info.custNo;
        if (info.custAcctNo !== "") {
          this.addOrEditForm.custAcctNo = info.custAcctNo;
        } else {
          this.addOrEditForm.custAcctNo = "";
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //查询客户保证金账号信息
      queryCustBailAcctNo() {
        if (this.addOrEditForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustBailAcctNoWin = true;
      },
      custBailAcctNoSelectSubmit(info){
        this.addOrEditForm.bailAcctNo = info.custAcctNo;
        this.showCustBailAcctNoWin=false;
      },
      //查询客户经理
      queryCustManager() {
        this.showCustManagerWin = true;
      },
      //赋值
      custManagerSelect(info) {
        if(!info.custMgrNo){
          this.$msgTip.error(this, { info: "客户经理编号不能为空" });
          return;
        }
        this.addOrEditForm.custMgrNo = info.custMgrNo;
        this.addOrEditForm.custMgrName = info.custMgrName;
        this.addOrEditForm.custMgrName = "";
        this.showCustManagerWin = false;
      },
      //关闭弹窗
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },
      //查询方式change方法
      queryTypeChange() {
        if(this.batchParams.batchType === "add"){
          if (this.addOrEditForm.queryType === "" || this.addOrEditForm.queryType === "4" || this.addOrEditForm.queryType === "2") {
            this.addOrEditForm.isBackQuery = "";
          } else if (this.addOrEditForm.queryType === "1" || this.addOrEditForm.queryType === "3") {
            this.addOrEditForm.isBackQuery = "0";
          }
        }
      },
      //保存批次信息
      formSave() {
        if(this.batchParams.batchType === "add"){
          if (this.$refs.datagrid.tData.length > 0) {
            this.$msgTip.info(this, { info: "该批次下已存在票据明细，不允许修改批次信息！" });
            return;
          }
        }
        this.addOrEditForm.impawnDt = this.addOrEditForm.impawnDt.replace(/-/g, "");
        if (this.addOrEditForm.impawnDt < window.sessionStorage.getItem("workDate")) {
          this.$msgTip.info(this, { info: "质押日期必须大于或等于当前营业日期" });
          return;
        }
        //往后台传授权标志
        this.addOrEditForm.licenseFlag = this.licenseFlag;
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.batchParams.batchType === "add" ? "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_insertImpawnBatch" : "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_updateImpawnBatch";
            if (this.hadBatchSave) {
              url = "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_updateImpawnBatch";
            }
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                    this.batchId = res.data.retData.id;;
                    this.formItem.batchId = res.data.retData.id;
                    this.addOrEditForm.id = res.data.retData.id;
                  }
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                  this.hadBatchSave = true;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //新增、修改
      infoAddOrModifyWin(str) {
        this.billOptType = str;
        if (this.batchParams.batchType === "add") {
          if (this.billOptType === "add") {
            if (this.hadBatchSave) {
              this.jumpToAddBillWin();
            } else {
              this.$msgTip.info(this, { info: "请先保存批次" });
              return;
            }
          } else if (this.billOptType === "modify") {
            if (this.$refs.datagrid.selects.length === 0) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
              return;
            }
            if (this.$refs.datagrid.selects.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.impawnBillInfoParams.billId = this.$refs.datagrid.selects[0].billId;
            this.impawnBillInfoParams.billNo = this.$refs.datagrid.selects[0].billNo;
            this.impawnBillInfoParams.impawnId = this.$refs.datagrid.selects[0].id;
            this.jumpToAddBillWin();
          }
        }
        if (this.batchParams.batchType === "modify") {
          if (this.billOptType === "add") {
            this.jumpToAddBillWin();
          }
          if (this.billOptType === "modify") {
            if (this.$refs.datagrid.selects.length === 0) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
              return;
            }
            if (this.$refs.datagrid.selects.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.impawnBillInfoParams.billId = this.$refs.datagrid.selects[0].billId;
            this.impawnBillInfoParams.billNo = this.$refs.datagrid.selects[0].billNo;
            this.impawnBillInfoParams.impawnId = this.$refs.datagrid.selects[0].id;
            this.jumpToAddBillWin();
          }
        }
      },
      //跳转到新增明细界面
      jumpToAddBillWin() {
        this.impawnBillInfoParams.billOptType = this.billOptType;
        this.impawnBillInfoParams.billType = this.addOrEditForm.billType;
        this.impawnBillInfoParams.dictMap = this.batchParams.dictMap;
        this.impawnBillInfoParams.billTypeList = this.batchParams.billTypeList;
        this.impawnBillInfoParams.batchId = this.batchId;
        let url = this.billOptType === "add" ? "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_addPaperImpawnBillInfo" : "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_updateImpawnBill";
        this.impawnBillInfoParams.commitUrl = url;
        this.impawnAddBillWin = true;
      },
      //新增、修改弹窗关闭
      impawnAddBillWinClose() {
        this.impawnAddBillWin = false;
        this.impawnBillInfoParams = {};
        this.handleSearch();
      },
      //新增、修改弹窗确定
      impawnAddBillSubmit(info) {
        let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.$refs.datagrid.dataChange(pageNo);
        this.impawnAddBillWin = false;
        this.impawnBillInfoParams = {};
      },
      //批量导入
      infoImport() {
        if (this.batchId === "") {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        this.importWin = true;
        this.fileParams.extraGridDatas = { batchId: this.batchId };
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //批量导出
      infoExport() {
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        } else {
          this.rows = this.$refs.datagrid.total;
        }
        if (this.batchId === "") {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        this.param = "pImpawnApplListExportInfo";
        this.tempShowExcelTemplateWin = true;
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportForm(field, exportType) {
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_exportExcel";
        if (exportType === "1") {
          let params = null;
          if (this.$refs.datagrid.selectIds.length !== 0) {
            params = {
              impawnIds: this.$refs.datagrid.selectIds,
              funcNo:this.formItem.funcNo,
              field: field,
              exportType: exportType,
              excelName: this.param
            };
          } else {
            params = {
              funcNo:this.formItem.funcNo,
              billClass:this.formItem.billClass,
              batchId:this.formItem.batchId,
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
            input1.name = "impawnIds";
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1);
            let input2 = document.createElement("input");
            input2.type = "text";
            input2.name = "funcNo";
            input2.value = this.formItem.funcNo;
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
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //删除
      infoDelete(type) {
        if(type === "selectDelete"){
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let list = this.$refs.datagrid.selects;
          let impawnIds = [];
          for (let i = 0; i < list.length; i++) {
            impawnIds.push(list[i].id);
          }
          let params = {
            impawnIds: impawnIds.join(","),
            batchId: this.batchId,
          };
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.be.confirmDelBill") + "?",
            onOk: () => {
              this.handleDeleteDetail(params);
            }
          });
        } else if (type === "listDelete"){
          if (this.batchId === "") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if (this.$refs.datagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = {
            batchId: this.batchId,
          };
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.be.confirmDelBill") + "?",
            onOk: () => {
              this.handleDeleteDetailBatch(params);
            }
          });
        }
      },
      handleDeleteDetail(params) {
        post(params, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_deleteImpawnBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleDeleteDetailBatch(params) {
        post(params, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_deleteImpawnBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //提交
      submit(type) {
        this.submitType = type;
        if (type === "select") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let impawnIds = [];
          for (let i = 0; i < list.length; i++) {
            impawnIds.push(list[i].id);
          }
          let params = {
            batchId: this.batchId,
            impawnIds: impawnIds.join(","),
            ownedBrchNo : this.addOrEditForm.ownedBrchNo,
            licenseFlag : this.licenseFlag,};
          this.getRiskBillNo(params);
        } else if (type === "batch") {
          if (this.batchId === "") {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
          if (this.$refs.datagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          let params = {
            batchId: this.batchId,
            ownedBrchNo : this.addOrEditForm.ownedBrchNo,
            licenseFlag : this.licenseFlag, };
          this.getRiskBillNo(params);
        }
      },
      //提交前先调用风险检查接口
      getRiskBillNo(params) {
        post(params, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_getRiskBillNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let data = res.data.retData;
            if (retCode === "000000") {
              if (Object.keys(data).length > 0) {
                this.riskCheckWin = true;
                this.riskParams.gridDatas = data;
                this.riskParams.submitParams = params;
                this.riskParams.YonList = this.batchParams.isList;
              } else {
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: "确定提交申请吗?",
                  onOk: () => {
                    this.handleSubmit(params);
                  }
                });
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      handleSubmit(params, isRiskCkeck) {
        post(params, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_submitFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              if (this.submitType === "batch") {
                this.handleClose();
              } else if (this.submitType === "select") {
                if (this.$refs.datagrid.total === this.$refs.datagrid.selects.length) {
                  this.handleClose();
                } else {
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.$refs.datagrid.selects = [];
                }
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
            if (isRiskCkeck) {
              this.riskCheckWinClose();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //撤销
      infoCancel() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      handleCancelApplyBatch() {
        post({ batchId: this.batchId,ownedBrchNo : this.addOrEditForm.ownedBrchNo,
          licenseFlag : this.licenseFlag, }, "/ce/impawn/paper/paperImpawn/pImpawnApplyMain/func_cancelFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleClose();
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(info, type) {
        this.billId = "";
        this.billNo = "";
        if (type === "billId") {
          this.billId = info;
        } else {
          this.billNo = info;
        }
        this.showBillInfoWin = true;
      },
      riskCheckWinClose() {
        this.riskCheckWin = false;
        this.riskParams = {};
      },
      riskCheckSubmit(info) {
        this.handleSubmit(info, true);
      },
    }
  };
</script>

<style scoped>

</style>
