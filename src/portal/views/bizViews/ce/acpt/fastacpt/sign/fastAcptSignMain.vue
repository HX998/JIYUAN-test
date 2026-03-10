<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <common-input v-model="formItem.custNo" :label="$t('m.i.common.custNo')" prop="custNo"
                              showIcon readonly clearValTag="custNo" @on-click="queryCustNo()"></common-input>

                <common-input v-model="formItem.custName" :maxlength=60 :label="$t('m.i.common.custName')" readonly
                              prop="custName"></common-input>
                <common-input v-model="formItem.custAcctNo" :label="$t('m.i.common.custAcctNo')" prop="custAcctNo"
                              showIcon readonly @on-click="queryCustAcctNo('drwrAcctNo')"></common-input>
                <common-select v-model="formItem.signStatusList" :label="$t('m.i.bm.signStatus')" prop="signStatus"
                               :dictList="signStatusList" multiple></common-select>
                <h-form-item :label="$t('m.i.ce.signApplyDt')" prop="minApplDt">
                  <h-date-picker :value="applDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/acpt/fastacpt/sign/fastAcptSignMain/func_queryList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="signOperate('add')" v-if="this.iShowAddUpdateEndBtn">新增
              </h-button>
              <h-button type="primary" @click="signOperate('accept')" :disabled="isAccptAllow">受理
              </h-button>
              <h-button type="primary" @click="signOperate('edit')" v-if="this.iShowAddUpdateEndBtn"
                        :disabled="isEditAllow">修改
              </h-button>
              <h-button type="primary" @click="signOperate('pause')" v-if="this.iShowPauseRecoverBtn"
                        :disabled="isPauseAllow">暂停
              </h-button>
              <h-button type="primary" @click="signOperate('recovery')" v-if="this.iShowPauseRecoverBtn"
                        :disabled="isRecoveryAllow">恢复
              </h-button>
              <h-button type="primary" @click="signOperate('stop')" v-if="this.iShowAddUpdateEndBtn"
                        :disabled="isStopAllow">解约
              </h-button>
              <h-button type="primary" @click="signOperate('cancel')" v-if="this.iShowCancelBtn"
                        :disabled="isCancelAllow">撤销
              </h-button>
              <h-button type="primary" @click="signOperate('detail')">查看操作历史</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <show-cust-message :show-cust-message-win="showCustMessageWinForAdd" @custCorpWinClose="custCorpWinForAddClose"
                       @custCorpSelectSubmit="custCorpSelectForAddSubmit"></show-cust-message>

    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWinForAdd" :cust-no="this.addForm.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinForAddClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectForAddSubmit"></show-cust-acct-no>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <!--查看操作历史-->
    <fast-acpt-sign-log :fastAcptSignLogWin="fastAcptSignLogWin" :detailFormItem="detailFormItem" :dictMap="dictMap"
                        :histListUrl="'/ce/acpt/fastacpt/sign/fastAcptSignMain/func_queryHistList'"
                        @fastAcptSignLogWinClose="fastAcptSignLogWinClose"></fast-acpt-sign-log>

    <!--点击新增弹窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editWinClose">
      <p slot="header">
        <span v-if="optType==='add'">新增签约</span>
        <span v-else-if="optType==='edit'">修改签约</span>
        <span v-else-if="optType==='pause'">暂停</span>
        <span v-else-if="optType==='recovery'">恢复</span>
        <span v-else-if="optType==='stop'">解约</span>
        <span v-else-if="optType==='addAccept'">签约受理</span>
        <span v-else-if="optType==='stopAccept'">解约受理</span>
        <span v-else-if="optType==='pauseAccept'">暂停受理</span>
        <span v-else-if="optType==='recoveryAccept'">恢复受理</span>
        <span v-else-if="optType==='editAccept'">修改受理</span>
        <span v-else-if="optType==='cancel'">撤销</span>

      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">

          <!--客户号-->
          <common-input v-model="addForm.custNo" :label="$t('m.i.common.custNo')" prop="custNo" :required="true"
                        :readonly="true" :showIcon="optType==='add'" @on-click="queryCustNoForAdd()"></common-input>
          <!--客户名称-->
          <common-input v-model="addForm.custName" :label="$t('m.i.common.custName')" prop="custName" :required="true"
                        :readonly="true" :maxlength=60></common-input>
          <!--客户账号 -->
          <common-input v-model="addForm.custAcctNo" :label="$t('m.i.common.custAcctNo')" prop="custAcctNo"
                        :required="true"
                        :readonly="true" :showIcon="optType==='add'" @on-click="queryCustAcctNoForAdd()"></common-input>

          <show-branch v-model="addForm.signBrchNo" :label="$t('m.i.ce.signBrchName')" prop="signBrchNo"
                       :showCheckBox="false" required :filterable="optType==='add'"
                       :showIcon="optType==='add' && this.isBrchCanSelect"
                       title="机构名称" :brchNo.sync="addForm.signBrchNo" :brchName.sync="addForm.signBrchName"
                       readonly :msgBoxWin="addOrEditWin">
          </show-branch>
          <h-form-item prop="applActiveDt" :label="$t('m.i.ce.applSignEnableDt')" required
                       v-if="this.optType==='addAccept'||this.optType==='editAccept'
                       ||this.optType==='edit'||this.optType==='add'">
            <h-date-picker type="date" v-model="addForm.applActiveDt" placeholder=""
                           @on-change="handleApplActiveDtSingelChange" :editable=false showFormat
                           :readonly="this.optType !== 'add'"></h-date-picker>
          </h-form-item>
          <h-form-item prop="applFailureDt" :label="$t('m.i.ce.applSignDueDt')" required
                       v-if="this.optType==='addAccept'||this.optType==='editAccept'
                       ||this.optType==='edit'||this.optType==='add'">
            <h-date-picker type="date" v-model="addForm.applFailureDt" placeholder=""
                           @on-change="handleApplFailureDtSingelChange" :editable=false showFormat
                           :readonly="this.optType !== 'add'"></h-date-picker>
          </h-form-item>

          <h-form-item prop="actualActiveDt" :label="$t('m.i.ce.actualSignEnableDt')"
                       required
                       v-if="this.optType==='editAccept'||this.optType==='edit'">
            <h-date-picker type="date" v-model="addForm.actualActiveDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <h-form-item prop="actualFailureDt" :label="$t('m.i.ce.actualSignDueDt')"
                       required
                       v-if="this.optType==='editAccept'||this.optType==='edit'">
            <h-date-picker type="date" v-model="addForm.actualFailureDt" placeholder="" showFormat
                           :editable=false readonly></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.limitAmt')" prop="limitAmt"
                       required
                       v-if="this.optType==='editAccept'
                       ||this.optType==='edit'||this.optType==='add'||this.optType==='addAccept'">
            <h-row>
              <h-col>
                <h-typefield type="money" v-model="addForm.limitAmt" :maxlength="20"
                             placeholder="数字，小数位最多2位" bigTips @on-blur="formatBillMoney('blur')"
                             @on-focus="formatBillMoney('focus')" :readonly="!((this.optType==='editAccept'&&this.addForm.operFlag==='1')
                       ||this.optType==='edit'||this.optType==='add'||(this.optType==='addAccept'&&this.addForm.operFlag==='1'))"></h-typefield>
              </h-col>
            </h-row>
          </h-form-item>
          <!--客户经理编号-->
          <common-input v-model="addForm.custMgrNo" :label="$t('m.i.common.custMgrNo')" prop="custMgrNo"
                        v-if="this.optType==='addAccept'||this.optType==='editAccept'
                       ||this.optType==='edit'||this.optType==='add'"
                        :readonly="this.optType==='addAccept'||this.optType==='editAccept'"
                        :placeholder="'只能输入1-20位字母或数字'" :validRules="mgrNoRule">
          </common-input>


          <common-input v-model="addForm.custMgrName" :label="$t('m.i.common.custMgrName')" prop="custMgrName"
                        v-if="this.optType==='addAccept'||this.optType==='editAccept'
                       ||this.optType==='edit'||this.optType==='add'"
                        :readonly="this.optType==='addAccept'||this.optType==='editAccept'" :validRules="mgrNameRule">
          </common-input>


          <common-input v-model="addForm.remark" :label="$t('m.i.common.remark')" prop="remark" type="textarea"
                        :autosize="{minRows: 1, maxRows: 3}" class="h-form-height-auto" :maxlength="60"
                        :lengthByByte="false"
                        :readonly="this.optType==='addAccept'||this.optType==='editAccept'||this.optType==='pauseAccept'
                        ||this.optType==='recoveryAccept'||this.optType==='stopAccept'"></common-input>

          <h-form-item prop="operFlag" :label="$t('m.i.ce.operFlag')" required
                       v-if="this.optType==='editAccept'||this.optType==='addAccept'||this.optType==='pauseAccept'||this.optType==='recoveryAccept'||this.optType==='stopAccept'">
            <h-select v-model="addForm.operFlag" placeholder="" @on-change="operFlagChange">
              <h-option value="0">拒绝</h-option>
              <h-option value="1">同意</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.ce.dealRemark')" prop="acceptRemark" :required="addForm.operFlag === '0'"
                       v-if="this.optType==='editAccept'||this.optType==='addAccept'||this.optType==='pauseAccept'||this.optType==='recoveryAccept'||this.optType==='stopAccept'"
                       class="h-form-height-auto">
            <h-input type="textarea" :rows=3 v-model="addForm.acceptRemark" :canResize="false"
                     :maxlength="300" :lengthByByte="false"></h-input>
          </h-form-item>


        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="editWinClose">{{ $t("m.i.common.close") }}</h-button>
        <h-button type="primary" @click="submitForm()">{{ $t("m.i.common.commit") }}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
import {
  post,
  on,
  off,
  formatNumber,
  accMul,
  accDiv,
  getMoreParamValuesByKeys,
  getParamValuesByKeys
} from "@/api/bizApi/commonUtil";
import {getSingleParamValuesByKeys, getBusinessParameter} from "../../../../../../api/bizApi/commonUtil";

export default {
  name: "fastAcptSignMain",
  components: {
    FastAcptSignLog: () => import(/* webpackChunkName: "ce/acpt/fastacpt/sign/fastAcptSignLog" */`@/views/bizViews/ce/acpt/fastacpt/sign/fastAcptSignLog`),
    ShowCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`)
    // FastAcptSignOperate:() => import(/* webpackChunkName: "ce/fastacpt/sign/fastAcptSignOperate" */`@/views/bizViews/ce/fastacpt/sign/fastAcptSignOperate`),
  },
  data() {
    return {
      addForm: {
        operType: "",
        custAcctNo: "",
        custNo: "",
        custName: "",
        applDt: "",
        signBrchNo: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        signBrchName: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        custMgrNo: "",
        custMgrName: "",
        remark: "",
        operFlag: "",
        limitAmt: "",
        applActiveDt: "",
        applFailureDt: "",
        actualActiveDt: "",
        actualFailureDt: "",
        acceptRemark: "",
      },
      currentSelectRow: [],
      //是否显示更多查询项
      ifShowMore: false,
      showCustMessageWin: false,
      showCustMessageWinForAdd: false,
      isEditAllow: true,
      isPauseAllow: true,
      isRecoveryAllow: true,
      isStopAllow: true,
      isAccptAllow: true,
      addOrEditWin: false,
      //查询操作历史弹出框
      fastAcptSignLogWin: false,
      //签约操作弹出框
      fastAcptSignOperateWin: false,
      showCustAcctNoWinForAdd: false,
      custManagerOptType: null,
      //是否展示新增修改解约按钮
      iShowAddUpdateEndBtn: false,
      //是否展示新增修改解约按钮
      iShowPauseRecoverBtn: false,
      iShowCancelBtn: false,
      isCancelAllow: true,
      btnAuth: "",
      optType: "",
      dictMap: new Map(),
      detailFormItem: {},
      signStatusList: [],
      isBrchCanSelect: true,
      operSignUrl: "",
      acceptType: "",
      applDt: [],
      showCustAcctNoWin: false,
      formItem: {
        //busiType: "",
        custNo: "",
        custName: "",
        signStatusList: [],
        signStatus: "",
        busiType: "1",
        custAcctNo: "",
        minApplDt: "",
        maxApplDt: "",
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
      ratePctRule: [{
        test: /^(\d{1,4}(\.\d{1,2})?|10000|10000\.00)$/,
        trigger: "blur",
        message: "利率范围0~10000，且小数位不超过两位"
      }],
      mgrNoRule: [{test: /^[a-zA-Z0-9]{1,20}$/, trigger: "blur", message: "只能输入1-20位字母或数字"}],
      mgrNameRule: [{test: /^.{1,50}$/, trigger: "blur", message: "客户经理名称不能超过50位"}],
    }
  },
  mounted() {
    this.getDictListByGroups("FAcptSignStatus,Yon,CustArea").then(res => {
      this.signStatusList = res.get("FAcptSignStatus");
      this.signStatusList = this.signStatusList.filter(item => item.key === "FA01" || item.key === "FA03" || item.key === "FA04"
        || item.key === "FA07" || item.key === "FA10" || item.key === "FA15" || item.key === "FA21" || item.key === "FA26");
      this.YonList = res.get("Yon");
      this.custAreaList = res.get("CustArea");
      this.dictMap = res.get("map");
    });

    this.buttonAuthShow();
    getSingleParamValuesByKeys("ce.acpt.fast_acpt_sign_is_allow_update_sign_brch").then(res => {
      let value = res["ce.acpt.fast_acpt_sign_is_allow_update_sign_brch"];
      if (!!value) {
        // 不为空
        if (value === "1") {
          this.isBrchCanSelect = true;
        } else {
          this.isBrchCanSelect = false;
        }
      } else {
        // 为空,默认是可选机构
        this.isBrchCanSelect = true;
      }
    });
    post({ paramKey: "ce.acpt.fast_sign_scene_audit_by_credit" }, "/sm/auth/businessParamete/getBusinessParameter").then(res => {
      if (res) {
        let retCode = res.data.retCode;
        if (retCode === "000000") {
          let value = res.data.retData;
          if (!!value && value !== "0") {
            // 参数值不为空
            this.iShowCancelBtn = true;
          } else {
            this.iShowCancelBtn = false;
          }
        }
      }
    });
  },
  methods: {
    initBtn() {
      this.isEditAllow = true;
      this.isPauseAllow = true;
      this.isRecoveryAllow = true;
      this.isStopAllow = true;
      this.isAccptAllow = true;
      this.isCancelAllow = true;
    },
    //表单查询
    handleSearch() {
      this.currentSelectRow = null;
      this.$refs.datagrid.dataChange(1);
    },
    //重置表单查询结果
    resetSearch() {
      this.formItem.custMgrNo = "";
      this.$refs.formItem.resetFields();
      this.formItem.minApplDt = "";
      this.formItem.maxApplDt = "";
      this.applDt = [];
      this.formItem.custAcctNo = "";
      this.formItem.signStatusList = [];
      this.formItem.currentSelectRow = [];
    },
    //查询客户信息
    queryCustNo() {
      this.showCustMessageWin = true;
    },
    queryCustNoForAdd() {
      this.showCustMessageWinForAdd = true;
    },
    //赋值
    custCorpSelectSubmit(info) {
      this.formItem.custNo = info.custNo;
      this.formItem.custName = info.custName;
      this.formItem.custAcctNo = info.custAcctNo;
      this.showCustMessageWin = false;
    },
    //赋值
    custCorpSelectForAddSubmit(info) {
      this.addForm.custNo = info.custNo;
      this.addForm.custName = info.custName;
      this.addForm.custAcctNo = info.custAcctNo;
      this.showCustMessageWinForAdd = false;
    },
    //关闭
    custCorpWinClose() {
      this.showCustMessageWin = false;
    },
    custCorpWinForAddClose() {
      this.showCustMessageWinForAdd = false;
    },
    handleCurrentChange(currentRow) {
      this.currentSelectRow = currentRow;
      this.isCancelAllow = true;
      if (currentRow.signStatus === "FA01") {
        //已生效
        this.isEditAllow = false;
        this.isPauseAllow = false;
        this.isRecoveryAllow = true;
        this.isStopAllow = false;
        this.isAccptAllow = true;
      } else if (currentRow.signStatus === "FA03") {
        //已暂停
        this.isEditAllow = true;
        this.isPauseAllow = true;
        this.isRecoveryAllow = false;
        this.isStopAllow = false;
        this.isAccptAllow = true;
      } else if (currentRow.signStatus === "FA07") {
        //待生效
        this.isEditAllow = false;
        this.isPauseAllow = true;
        this.isRecoveryAllow = true;
        this.isStopAllow = false;
        this.isAccptAllow = true;
      } else if (currentRow.signStatus === "FA08") {
        // 新增签约待审批
        this.isEditAllow = true;
        this.isPauseAllow = true;
        this.isRecoveryAllow = true;
        this.isStopAllow = true;
        this.isAccptAllow = true;
        this.isCancelAllow = false;
      } else {
        //待受理
        this.isEditAllow = true;
        this.isPauseAllow = true;
        this.isRecoveryAllow = true;
        this.isStopAllow = true;
        this.isAccptAllow = false;
      }
    },
    handleCurrentChangeCancel() {
      this.currentSelectRow = [];
      this.initBtn();
    },
    signOperate(optType) {
      this.optType = optType;
      if (this.optType == "add") {
        this.operSignUrl = "/ce/acpt/fastacpt/sign/fastAcptSignMain/func_add";
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.addFormReset();
        });
      } else if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
        if (optType !== "detail") {
          // 根据所选数据的状态判断是什么受理
          this.acceptTypeSelect();
          this.addOrEditWin = true;
          if (optType === "edit") {
            this.operSignUrl = "/ce/acpt/fastacpt/sign/fastAcptSignMain/func_update";
          } else if (optType === "pause") {
            this.operSignUrl = "/ce/acpt/fastacpt/sign/fastAcptSignMain/func_pause";
          } else if (optType === "recovery") {
            this.operSignUrl = "/ce/acpt/fastacpt/sign/fastAcptSignMain/func_recovery";
          } else if (optType === "stop") {
            this.operSignUrl = "/ce/acpt/fastacpt/sign/fastAcptSignMain/func_stop";
          } else if (optType === "cancel") {
            this.operSignUrl = "/ce/acpt/fastacpt/sign/fastAcptSignMain/func_cancelCreditAudit";
          } else {
            // 受理
            this.operSignUrl = "/ce/acpt/fastacpt/sign/fastAcptSignMain/func_accept";
          }

          this.addForm.id = this.currentSelectRow.id;
          this.addForm.custNo = this.currentSelectRow.custNo;
          this.addForm.custName = this.currentSelectRow.custName;
          this.addForm.custAcctNo = this.currentSelectRow.custAcctNo;
          this.addForm.signBrchNo = this.currentSelectRow.signBrchNo;
          this.addForm.signBrchName = this.currentSelectRow.signBrchName;
          this.addForm.custMgrNo = this.currentSelectRow.custMgrNo;
          this.addForm.custMgrName = this.currentSelectRow.custMgrName;
          this.addForm.remark = this.currentSelectRow.remark;

          this.addForm.applActiveDt = this.currentSelectRow.applActiveDt;
          if (!!this.addForm.applActiveDt) {
            this.addForm.applActiveDt = this.$moment(this.addForm.applActiveDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          this.addForm.applFailureDt = this.currentSelectRow.applFailureDt;
          if (!!this.addForm.applFailureDt) {
            this.addForm.applFailureDt = this.$moment(this.addForm.applFailureDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          this.addForm.actualActiveDt = this.currentSelectRow.actualActiveDt;
          if (!!this.addForm.actualActiveDt) {
            this.addForm.actualActiveDt = this.$moment(this.addForm.actualActiveDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          this.addForm.actualFailureDt = this.currentSelectRow.actualFailureDt;
          if (!!this.addForm.actualFailureDt) {
            this.addForm.actualFailureDt = this.$moment(this.addForm.actualFailureDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          this.addForm.limitAmt = this.currentSelectRow.limitAmt;
          (!!this.addForm.limitAmt) ? this.addForm.limitAmt = formatNumber(this.currentSelectRow.limitAmt, 2, ",") : this.addForm.limitAmt = 0;
        } else {
          this.fastAcptSignLogWin = true;
          this.detailFormItem.signId = this.currentSelectRow.id;
        }
      } else {
        this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
      }
    },
    submitForm() {

      this.$refs.addForm.validate(valid => {
        if (valid) {
          let url = this.operSignUrl;

          if (!!this.addForm.applActiveDt) {
            this.addForm.applActiveDt = this.addForm.applActiveDt.replace(/-/g, "");
          }
          if (!!this.addForm.applFailureDt) {
            this.addForm.applFailureDt = this.addForm.applFailureDt.replace(/-/g, "");
          }
          if (!!this.addForm.actualActiveDt) {
            this.addForm.actualActiveDt = this.addForm.actualActiveDt.replace(/-/g, "");
          }
          if (!!this.addForm.actualFailureDt) {
            this.addForm.actualFailureDt = this.addForm.actualFailureDt.replace(/-/g, "");
          }
          if (!!this.addForm.applDt) {
            this.addForm.applDt = this.addForm.applDt.replace(/-/g, "");
          }
          if (!!this.addForm.limitAmt) {
            this.addForm.limitAmt = this.addForm.limitAmt.toString().replace(/,/g, "");
          }
          // 传给后端，告诉后端现在打开的是什么弹窗，后端根据弹窗类型和签约状态作比较，不符合则报错“状态已变化请刷新页面”，从而实现并发控制
          this.addForm.boxType = this.optType

          post(this.addForm, url).then(res => {
            //this.submitFlag = false;
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.addFormReset();
                this.addOrEditWin = false;
                this.$msgTip.success(this);
                this.$refs.datagrid.dataChange(1);
              } else {
                let msg = this.$t("m.i.common.addFailed");
                this.submitFailed(msg, res.data.retMsg);
              }
            } else {
              let msg = this.$t("m.i.common.addFailed");
              this.submitFailed(msg, this.$t("m.i.common.netError"));
            }
          });
        }
      });
    },
    submitFailed(title, retMsg) {
      this.$msgTip.error(this, {info: retMsg});
    },
    /* handleAddForm() {
       this.addOrEditWin = true;
     },*/
    editWinClose() {
      this.addFormReset();
      this.optType = "";
      this.addOrEditWin = false;
    },
    addFormReset() {
      this.$refs.addForm.resetFields();
      this.addForm.id = "";
      this.addForm.custNo = "";
      this.addForm.custName = "";
      this.addForm.custAcctNo = "";
      this.addForm.custMgrNo = "";
      this.addForm.custMgrName = "";
      this.addForm.signBrchNo = JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo;
      this.addForm.signBrchName = JSON.parse(window.sessionStorage.getItem('userInfo')).brchName;
      this.addForm.remark = "";
      this.addForm.acceptRemark = "";
      this.addForm.applActiveDt = "";
      this.addForm.applFailureDt = "";
      this.addForm.actualActiveDt = "";
      this.addForm.actualFailureDt = "";
      this.addForm.limitAmt = "";
      this.addForm.operFlag = ""
    },
    fastAcptSignLogWinClose() {
      this.fastAcptSignLogWin = false;
      this.detailFormItem = {};
    },
    clearVal() {
      this.formItem.custNo = "";
      this.formItem.custMgrName = "";
    },
    //查询客户账号信息
    queryCustAcctNoForAdd() {
      if (this.addForm.custNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户！"});
        return;
      }
      this.showCustAcctNoWinForAdd = true;
    },
    //赋值
    custAcctNoSelectForAddSubmit(info) {
      this.addForm.custAcctNo = info.custAcctNo;
      this.showCustAcctNoWinForAdd = false;
    },
    //关闭弹窗
    showCustAcctNoWinForAddClose() {
      this.showCustAcctNoWinForAdd = false;
    },
    acceptTypeSelect() {
      if ('FA04' == this.currentSelectRow.signStatus) {
        //签约待受理
        this.optType = 'addAccept';
      } else if ('FA10' == this.currentSelectRow.signStatus) {
        //签约修改待受理
        this.optType = 'editAccept';
      } else if ('FA15' == this.currentSelectRow.signStatus) {
        //解约待受理
        this.optType = 'stopAccept';
      } else if ('FA21' == this.currentSelectRow.signStatus) {
        //签约暂停待受理
        this.optType = 'pauseAccept';
      } else if ('FA26' == this.currentSelectRow.signStatus) {
        //签约恢复待受理
        this.optType = 'recoveryAccept';
      }
    },
    formatBillMoney(optType) {
      if (optType === "blur") {
        if (!isNaN(parseFloat(this.addForm.limitAmt)) && isFinite(this.addForm.limitAmt)) {
          this.addForm.limitAmt = this.addForm.limitAmt == null ? "0.00" : formatNumber(this.addForm.limitAmt, 2, ",");
        }
      } else if (optType === "focus") {
        this.addForm.limitAmt = this.addForm.limitAmt.toString().replace(/,/g, "");
      }
    },
    operFlagChange(currentValue) {
      /*      if (this.signParams.optType === "accept") {
              if (currentValue === "0") {//拒绝
                this.isRefuse = false;
                if (!this.isReAccept) {
                  //初始化受理签约同意时展示项数据
                  this.initAcceptSignInfo();
                }
              } else if (currentValue === "1") {//同意
                this.isRefuse = true;
                //恢复受理拒绝时清空的默认值
                this.acceptSignDefaultInfo();
                this.discSignOperateForm.acceptRemark = "";
              } else {
                this.isRefuse = null;
                this.discSignOperateForm.acceptRemark = "";
                if (!this.isReAccept) {
                  this.initAcceptSignInfo();
                }
              }
            } else if (this.signParams.optType === "check") {
              if (currentValue === "0") {//拒绝
                this.isCheckRefuse = false;
              } else if (currentValue === "1") {//同意
                this.isCheckRefuse = true;
                this.discSignOperateForm.checkRemark = "";
              } else {
                this.isCheckRefuse = null;
                this.discSignOperateForm.checkRemark = "";
              }
            }*/
    },
    handleApplActiveDtSingelChange(value) {
      this.addForm.applActiveDt = value.replace(/-/g, "");
    },
    handleApplFailureDtSingelChange(value) {
      this.addForm.applFailureDt = value.replace(/-/g, "");
    },
    handleApplDtChange(arr) {
      if (arr && arr.length == 2) {
        this.formItem.minApplDt = arr[0].replace(/-/g, "");
        this.formItem.maxApplDt = arr[1].replace(/-/g, "");
        this.applDt = [arr[0], arr[1]];
      } else {
        this.formItem.minApplDt = "";
        this.formItem.maxApplDt = "";
        this.applDt = [];
      }
    },
    //查询客户账号信息
    queryCustAcctNo() {
      if (this.formItem.custNo === "") {
        this.$msgTip.info(this, {info: "请先选择客户"});
        return;
      }
      this.showCustAcctNoWin = true;
    },
    //赋值
    custAcctNoSelectSubmit(info) {
      this.formItem.custAcctNo = info.custAcctNo;
      this.showCustAcctNoWin = false;
    },
    //关闭弹窗
    showCustAcctNoWinClose() {
      this.showCustAcctNoWin = false;
    },

    buttonAuthShow() {
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({authId: id}, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            if (!!this.btnAuth.iShowAddUpdateEndBtn) {
              this.iShowAddUpdateEndBtn = this.btnAuth.iShowAddUpdateEndBtn.isShow;
            } else {
              // 默认为展示
              this.iShowAddUpdateEndBtn = true;
            }
            if (!!this.btnAuth.iShowPauseRecoverBtn) {
              this.iShowPauseRecoverBtn = this.btnAuth.iShowPauseRecoverBtn.isShow;
            } else {
              // 默认为展示
              this.iShowPauseRecoverBtn = true;
            }
          } else {
            this.$msgTip.error(this, {info: retMsg});
          }
        } else {
          this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
        }
      });
    },
  }
}
</script>

<style scoped>

</style>
