<template>
    <div class="layout">
        <h-row name="flex" class="layout-menu-wrapper">
            <h-col span="24">
                <div>
                    <div class="h-form-search-box">
                        <!-- 查询表单 -->
                        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                            <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                                <!--批次号-->
                                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo"
                                             :validRules="validBatchNoRules">
                                    <h-input v-model="formItem.batchNo" :maxlength=32></h-input>
                                </h-form-item>
                                <!--标票产品名称-->
                              <common-input v-model="formItem.stdProductNameLike" :label="$t('m.i.bs.stdProductName')"
                                            prop="stdProductNameLike" :maxlength="60"
                                            showIcon @on-click="queryProductName" :clearable="true" :clearVal="clearValProductName"
                                            @on-change="onChangeProductName"
                              ></common-input>
                                <!--投资金额-->
                                <common-type-field-range v-model="formItem"
                                                         :label="$t('m.i.bs.investManage.investPayAmt')"
                                                         :integerNum="16" :suffixNum="2" :validRules="investPayAmtRule"
                                                         :rangeProps="['minInvestPayAmt','maxInvestPayAmt']"
                                                         :bigTips="false"></common-type-field-range>
                                <!--投资日期-->
                                <common-date-picker v-model="investDt" :label="$t('m.i.bs.investManage.investDt')"
                                                    type="daterange" :autoPlacement="true"
                                                    @on-change="handleInvestDateChange"></common-date-picker>
                                <!--占用状态-->
                                <common-select v-model="formItem.occupyStatusList" multiple
                                               :label="$t('m.i.bs.investManage.occupyStatus')" prop="occupyStatusList"
                                               :dictList="occupyStatusList"></common-select>

                <query-btn :advanceShow="true" @showChange="showChange" :formSearch="handleSearch"
                           :formSearchReset="resetSearch"></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/bs/investmanage/creditgrant/stdCreditGrantApply/func_queryStdCreditBatchPage"
            :bindForm="formItem"
            :has-select="false"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="stdCreditGrantOperate('add')">{{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="stdCreditGrantOperate('modify')">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="stdCreditBatchDelete()">{{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="stdCreditBatchOccupy()">{{$t("m.i.common.occupy")}}
              </h-button>
              <h-button type="primary" @click="stdCreditBatchRelease()">{{$t("m.i.common.release")}}
              </h-button>
              <h-button type="primary"
                        v-if="this.btnAuth.setAuditForm===undefined ? false:this.btnAuth.setAuditForm.isShow"
                        @click="setAuditForm()">
                委托单信息
              </h-button>
              <h-button type="primary" @click="letterOfAttorneyPrint()">
                {{$t("m.i.common.letterOfAttorneyPrint")}}
              </h-button>
              <h-button type="primary"
                        v-if="this.btnAuth.setPyeeInfo===undefined ? false:this.btnAuth.setPyeeInfo.isShow"
                        @click="setPyeeInfo()">
                {{$t("m.i.bs.setPayeeInfo")}}
              </h-button>
              <h-button type="primary"
                        v-if="this.btnAuth.eftFormPrint===undefined ? false:this.btnAuth.eftFormPrint.isShow"
                        @click="eftFormPrint()">
                {{$t("m.i.bs.eftFormPrint")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 新增修改弹窗 -->
    <std-credit-grant-add :stdCreditGrantAddOrEditWin="stdCreditGrantAddOrEditWin" :batchParams="batchParams"
                          @stdCreditGrantAddOrEditWinClose="stdCreditGrantAddOrEditWinClose"
                          ref="stdCreditGrantAdd"></std-credit-grant-add>
    <!-- 详情页面 -->
    <std-credit-grant-detail :stdCreditGrantBatchDetailWin="stdCreditGrantBatchDetailWin" :batchParams="batchParams"
                             @stdCreditGrantBatchDetailOpenClose="stdCreditGrantBatchDetailOpenClose"
                             ref="stdCreditGrantDetail"></std-credit-grant-detail>
    <!-- 释放页面 -->
    <std-credit-grant-release :stdCreditGrantReleaseWin="stdCreditGrantReleaseWin" :batchParams="batchParams"
                              @stdCreditGrantReleaseOpenClose="stdCreditGrantReleaseOpenClose"
                              ref="stdCreditGrantRelease"></std-credit-grant-release>

    <show-cpes-branch :showCpesBranch="showCpesProductBranch" @showCpesBranchClose="showCpesProductBranchClose"
                      :showMemberId="false" :brchType="productBrchType"
                      @showCpesBranchSubmit="showCpesProductBranchSubmit"></show-cpes-branch>


    <h-msg-box v-model="setAuditFormWin" width="800" :maximize="true" @on-close="setAuditFormWinClose">
      <p slot="header">
        <span>设置委托单信息</span>
      </p>
      <h-panel>
        <h-form :model="auditForm" :label-width="150" ref="auditForm" cols="2" class="h-form-search">
          <common-input v-model="auditForm.sellBrchName" prop="sellBrchName" :label="$t('m.i.bs.sellBrchName')"
                        :maxlength="80"></common-input>
          <common-input v-model="auditForm.guarntrInfo" prop="guarntrInfo" :label="$t('m.i.bs.guarntrInfo')"
                        :maxlength="80"></common-input>
          <common-input v-model="auditForm.subjectLevel" prop="subjectLevel" :label="$t('m.i.bs.subjectLevel')"
                        :maxlength="50"></common-input>
          <common-input v-model="auditForm.expectedReturn" prop="expectedReturn" :label="$t('m.i.bs.expectedReturn')"
                        :validRules="ratePctRule"></common-input>
          <common-input v-model="auditForm.putInTeam" prop="putInTeam" :label="$t('m.i.bs.putInTeam')"
                        :maxlength="50"></common-input>
          <common-input v-model="auditForm.investMgrName" prop="investMgrName" :label="$t('m.i.bs.investMgrName')"
                        :maxlength="50"></common-input>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="setAuditFormWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="auditFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>


    <h-msg-box v-model="setPyeeInfoWin" width="800" :maximize="true" @on-close="setPyeeInfoWinClose">
      <p slot="header">
        <span>设置收款信息</span>
      </p>
      <h-panel>
        <h-form :model="pyeeInfoForm" :label-width="115" ref="pyeeInfoForm" cols="2" class="h-form-search">
          <common-input v-model="pyeeInfoForm.pyeeName" :label="$t('m.i.bs.payeeBrch')" prop="pyeeName" :maxlength="60"
          ></common-input>
          <common-input v-model="pyeeInfoForm.pyeeAcctNo" :label="$t('m.i.bs.payeeAcctNo')" prop="pyeeAcctNo"
                        :maxlength="32" :validRules="validAcctNoRules"></common-input>
          <common-input v-model="pyeeInfoForm.pyeeBankName" :label="$t('m.i.bs.payeeBank')" prop="pyeeBankName"
                        :maxlength="60"
          ></common-input>
          <common-input v-model="pyeeInfoForm.investReturn" :label="$t('m.i.bs.investReturn')" prop="investReturn"
                         :validRules="ratePctRule"
          ></common-input>
          <common-input v-model="pyeeInfoForm.busiApplyNo" :label="$t('m.i.bs.busiApplyNo')" prop="busiApplyNo"
                        :validRules="validBatchNoRules">
          </common-input>
          <common-date-picker v-model="pyeeInfoForm.busiStartDt" :label="$t('m.i.bs.busiStartDt')" prop="busiStartDt"
                              :options="options3"></common-date-picker>
          <common-date-picker v-model="pyeeInfoForm.busiEndDt" :label="$t('m.i.bs.busiEndDt')" prop="busiEndDt"
                               :options="options3"></common-date-picker>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="setPyeeInfoWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="pyeeInfoSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { formatNumber, post, cmycurd } from "@/api/bizApi/commonUtil";
  import CommonInput from "../../../../../components/bemp/input/commonInput";

  export default {
    name: "stdCreditGrantApply",
    components: {
      CommonInput,
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      StdCreditGrantAdd: () => import(/* webpackChunkName: "bs/investmanage/creditgrant/stdCreditGrantAdd" */`@/views/bizViews/bs/investmanage/creditgrant/stdCreditGrantAdd`),
      stdCreditGrantDetail: () => import(/* webpackChunkName: "bs/investmanage/creditgrant/stdCreditGrantDetail" */`@/views/bizViews/bs/investmanage/creditgrant/stdCreditGrantDetail`),
      stdCreditGrantRelease: () => import(/* webpackChunkName: "bs/investmanage/creditgrant/stdCreditGrantRelease" */`@/views/bizViews/bs/investmanage/creditgrant/stdCreditGrantRelease`)
    },


    data() {
      let _this = this;
      return {
        options3: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        // 投资金额正则表达式
        investPayAmtRule: [{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "投资金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        // 批次号正则表达式
        validBatchNoRules: [{
          test: /^[0-9a-zA-Z]{1,16}$/,
          trigger: "blur",
          message: "只能输入数字和字母,且长度最大为16位"
        }],
        validAcctNoRules: [{ test: /^[0-9a-zA-Z]{1,32}$/, trigger: "blur", message: "只能输入数字和字母,且长度最大为32位" }],
        ratePctRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?)$/,
          trigger: "blur",
          message: "费率或利率范围0~100(不包括100)，且小数位不超过四位"
        }],
        // 查询form表单
        formItem: {
          batchNo: "",
          stdProductNo: "",
          stdProductNameLike: "",
          occupyStatusList: [],
          minInvestPayAmt: "",
          maxInvestPayAmt: "",
          minInvestDt: "",
          maxInvestDt: ""
        },
        // 投资日期
        investDt: [],
        // 明细列表
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.common.batchNo"),
            key: "batchNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.stdCreditGrantBatchDetailOpen(params.row.id);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t("m.i.bs.stdProductName"),
            key: "stdProductName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.bs.stdProductShortName"),
            key: "stdProductShortName",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.bs.investManage.occupyStatus"),
            key: "occupyStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "OccupyStatus", params.row.occupyStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bs.stdProductNo"),
            key: "stdProductNo",
            hiddenCol: false,
            sortable: true
          },

          {
            title: this.$t("m.i.bs.investManage.investPayAmt"),
            key: "investPayAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.investPayAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.investManage.creationAmt"),
            key: "creationAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h("span", formatNumber(params.row.creationAmt, 2, ","));
            }
          },
          {
            title: this.$t("m.i.bs.investManage.investDt"),
            key: "investDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.investDt ? this.$moment(params.row.investDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          }
        ],
        currentSelectRow: [],
        //是否显示更多查询项
        ifShowMore: false,
        dictMap: new Map(),
        memberId: JSON.parse(window.sessionStorage.getItem("userInfo")).memberId,
        productBrchType: "7",//资管非法人产品机构类型
        showCpesProductBranch: false,
        occupyStatusList: [],
        custTypeList: [],
        printParams: {},
        DetailOccupyStatusList: [],
        detailOccupyStatusList: [],
        detailAppendCreditStatusList:[],
        stdCreditGrantAddOrEditWin: false,
        stdCreditGrantBatchDetailWin: false,
        stdCreditGrantReleaseWin: false,
        batchParams: {},
        btnAuth: "",
        setPyeeInfoWin: false,
        pyeeInfoForm: {
          pyeeName: "",
          pyeeAcctNo: "",
          pyeeBankName: "",
          id: "",
          investReturn: "",
          busiApplyNo:"",
          busiStartDt:"",
          busiEndDt:""
        },
        setAuditFormWin: false,
        auditForm: {
          sellBrchName: "",
          guarntrInfo: "",
          subjectLevel: "",
          expectedReturn: "",
          putInTeam: "",
          investMgrName: "",
          id: ""
        }
      };
    },

    mounted() {
      this.getDictListByGroups("OccupyStatus,DetailOccupyStatus,DetailAppendCreditStatus,CreditCustType").then(res => {
        this.occupyStatusList = res.get("OccupyStatus");
        this.detailOccupyStatusList = res.get("DetailOccupyStatus");
        this.detailAppendCreditStatusList = res.get("DetailAppendCreditStatus");
        this.custTypeList = res.get("CreditCustType");
        this.dictMap = res.get("map");
      });
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      letterOfAttorneyPrint() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let auditFormPrintDto = { id: this.currentSelectRow.id };
        post(auditFormPrintDto, "/bs/investmanage/creditgrant/stdCreditGrantApply/func_printAuditForm").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formPrint(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },

            showChange(val) {
                this.ifShowMore = val;
            },
            //表单查询
            handleSearch(pageNo) {
                this.currentSelectRow = [];
                this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
            },
            //重置表单查询结果
            resetSearch() {
                this.investDt = [];
                this.formItem.minInvestDt = "";
                this.formItem.maxInvestDt = "";
                this.formItem.stdProductNo = "";
                this.formItem.batchNo = "";
                this.formItem.maxInvestPayAmt = "";
                this.formItem.minInvestPayAmt = "";
                this.formItem.occupyStatus = "";
                this.formItem.stdProductNameLike = "";
                this.$refs.formItem.resetFields();

            },
            // 勾选
            handleCurrentChange(currentRow) {
                this.currentSelectRow = currentRow;
            },
            // 取消选择
            handleCurrentChangeCancel() {
                this.currentSelectRow = [];
            },

      // 根据弹框所选数据进行赋值
      queryProductName() {
        this.showCpesProductBranch = true;
      },
      showCpesProductBranchClose() {
        this.showCpesProductBranch = false;
      },
      showCpesProductBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.formItem.stdProductNo = info.brchCode;
        this.formItem.stdProductNameLike = info.brchFullNameZh;
        this.showCpesProductBranch = false;
      },
      clearValProductName() {
        this.formItem.stdProductNo= "";
        this.formItem.stdProductNameLike = "";
      },
      onChangeProductName() {
        this.formItem.stdProductNo = "";
      },
      handleInvestDateChange(arr) {
        if (arr && arr.length >= 2) {
          this.formItem.minInvestDt = arr[0].replace(/-/g, "");
          this.formItem.maxInvestDt = arr[1].replace(/-/g, "");
          this.investDt = [arr[0], arr[1]];
        } else {
          this.formItem.minInvestDt = "";
          this.formItem.maxInvestDt = "";
          this.investDt = [];
        }
      },

      // 打开新增和修改页面
      stdCreditGrantOperate(str) {
        if (str === "modify") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.batchParams.batchId = this.currentSelectRow.id;
        } else {
          this.batchParams.batchId = "";
        }
        this.assembleParams(str);
      },
      assembleParams(optType) {
        this.batchParams.batchType = optType;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.detailOccupyStatusList = this.detailOccupyStatusList;
        this.batchParams.detailAppendCreditStatusList = this.detailAppendCreditStatusList;
        this.batchParams.custTypeList = this.custTypeList;
        this.batchParams.occupyStatusList = this.occupyStatusList;
        // 修改标识
        this.batchParams.editFlag = false;
        this.stdCreditGrantAddOrEditWin = true;
      },
      //关闭新增、修改弹窗
      stdCreditGrantAddOrEditWinClose() {
        this.stdCreditGrantAddOrEditWin = false;
        let pageNo = this.batchParams.batchType === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.batchParams = {};
      },
      stdCreditGrantBatchDetailOpen(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.detailOccupyStatusList = this.detailOccupyStatusList;
        this.batchParams.detailAppendCreditStatusList = this.detailAppendCreditStatusList;
        this.batchParams.custTypeList = this.custTypeList;
        this.batchParams.occupyStatusList = this.occupyStatusList;
        this.stdCreditGrantBatchDetailWin = true;

      },
      stdCreditGrantBatchDetailOpenClose() {
        this.batchParams = {};
        this.stdCreditGrantBatchDetailWin = false;
      },
      releaseOpen(id) {
        this.batchParams.batchId = id;
        this.batchParams.dictMap = this.dictMap;
        this.batchParams.detailOccupyStatusList = this.detailOccupyStatusList;
        this.batchParams.detailAppendCreditStatusList = this.detailAppendCreditStatusList;
        this.batchParams.custTypeList = this.custTypeList;
        this.batchParams.occupyStatusList = this.occupyStatusList;
        this.stdCreditGrantReleaseWin = true;
      },
      stdCreditGrantReleaseOpenClose() {
        this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
        this.stdCreditGrantReleaseWin = false;
      },
      // 删除批次
      stdCreditBatchDelete() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: "删除信息",
            content: "确定要删除吗？",
            onOk: () => {
              let params = { id: this.currentSelectRow.id };
              let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_deleteStdCreditBatch";
              post(params, url).then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.handleSearch(1);
                  } else {
                    this.$msgTip.error(this, { info: res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }

          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      // 额度占用
      stdCreditBatchOccupy() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          let params = { id: this.currentSelectRow.id };
          let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_occupyStdInvestCredit";
          this.sendPost(params, url, res => {
            this.handleSearch(1);
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      // 额度释放
      stdCreditBatchRelease() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.batchParams.occupyStatusList = this.occupyStatusList;
          this.releaseOpen(this.currentSelectRow.id);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              callback();
            } else {
              if (res.data.retData && res.data.retData.erroMsg) {
                this.$msgTip.error(this, { info: res.data.retData.erroMsg });
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }

            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      eftFormPrint() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let eftFormPrintDto = { id: this.currentSelectRow.id };
        post(eftFormPrintDto, "/bs/investmanage/creditgrant/stdCreditGrantApply/func_printEftForm").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formPrint(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      formPrint(data) {
        this.$print.vouchTemplatePrint(this, {
          data: data.printInfos,
          vochIds: data.vochIds,
          callback: () => {

          },
          closeCallback: () => {

          },
          errorCallback: () => {

          }
        });
      },
      setPyeeInfoWinClose() {
        this.$refs.pyeeInfoForm.resetFields();
        this.pyeeInfoForm.pyeeName = "";
        this.pyeeInfoForm.pyeeAcctNo = "";
        this.pyeeInfoForm.pyeeBankName = "";
        this.pyeeInfoForm.id = "";
        this.pyeeInfoForm.investReturn = "";
        this.pyeeInfoForm.busiApplyNo="";
        this.pyeeInfoForm.busiEndDt="";
        this.pyeeInfoForm.busiEndDt="";
        this.setPyeeInfoWin = false;
      },
      setAuditFormWinClose() {
        this.$refs.auditForm.resetFields();
        this.auditForm.sellBrchName = "";
        this.auditForm.guarntrInfo = "";
        this.auditForm.subjectLevel = "";
        this.auditForm.expectedReturn = "";
        this.auditForm.putInTeam = "";
        this.auditForm.investMgrName = "";
        this.auditForm.id = "";
        this.setAuditFormWin = false;
      },

      setAuditForm() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        } else {
          let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_getForm";
          post({ id: this.currentSelectRow.id }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                this.auditForm.sellBrchName = obj.sellBrchName;
                this.auditForm.guarntrInfo = obj.guarntrInfo;
                this.auditForm.subjectLevel = obj.subjectLevel;
                this.auditForm.expectedReturn = obj.expectedReturn;
                this.auditForm.putInTeam = obj.putInTeam;
                this.auditForm.investMgrName = obj.investMgrName;
                this.auditForm.id = obj.id;
                this.setAuditFormWin = true;
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }

      },
      auditFormSubmit() {
        this.$refs["auditForm"].validate(valid => {
          if(valid){
            post(this.auditForm, "/bs/investmanage/creditgrant/stdCreditGrantApply/func_setForm").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.setAuditFormWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed") + res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        })
      },
      setPyeeInfo() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        } else {
          let url = "/bs/investmanage/creditgrant/stdCreditGrantApply/func_getForm";
          post({ id: this.currentSelectRow.id }, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let obj = res.data.retData;
                this.pyeeInfoForm.pyeeName = obj.pyeeName;
                this.pyeeInfoForm.pyeeAcctNo = obj.pyeeAcctNo;
                this.pyeeInfoForm.pyeeBankName = obj.pyeeBankName;
                this.pyeeInfoForm.id = obj.id;
                this.pyeeInfoForm.investReturn = obj.investReturn;
                this.pyeeInfoForm.busiStartDt=obj.busiStartDt === null ? "":obj.busiStartDt.toString();
                this.pyeeInfoForm.busiEndDt=obj.busiEndDt === null ? "" :obj.busiEndDt.toString();
                this.pyeeInfoForm.busiApplyNo=obj.busiApplyNo;
                this.setPyeeInfoWin = true;
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      pyeeInfoSubmit() {
        this.$refs["pyeeInfoForm"].validate(valid => {
          console.log("payeeInfoForm Valid:" + valid);
          if (valid) {
            if(this.pyeeInfoForm.busiEndDt<this.pyeeInfoForm.busiStartDt){
              this.$msgTip.error(this,{info:"业务截止日期必须大于等于业务起始日期！"});
              return;
            }
            post(this.pyeeInfoForm, "/bs/investmanage/creditgrant/stdCreditGrantApply/func_setForm").then(res => {
              if (res) {
                if (res.data.retCode === "000000") {
                  this.$msgTip.success(this);
                  this.setPyeeInfoWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed") + res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      }
    }

  };
</script>

<style scoped>

</style>
