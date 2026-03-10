<!--纸票入池申请管理-新增/修改申请-->
<template>
  <div>
    <h-msg-box v-model="tempInPoolAddOrEditWin" :maximize="true" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchOptType==='add'">新增申请</span>
        <span v-else-if="batchOptType==='modify' && batchParams.isCommit === 'noCommit'">修改申请</span>
        <span v-else-if="batchOptType==='modify' && batchParams.isCommit === 'hasCommit'">撤销申请</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search">
          <div>
            <h-form-item :label="$t('m.i.pl.agreementNo')" prop="agreementNo" required>
              <h-input v-model="addOrEditForm.agreementNo" :maxlength="60" readonly
                       :icon="this.hadBatchSave ? '' : 'android-search'"
                       @on-click="queryAgreementNo()"></h-input>
            </h-form-item>
            <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
              <h-input v-model="addOrEditForm.custNo" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custName" :label="$t('m.i.common.custName')" required>
              <h-input v-model="addOrEditForm.custName" placeholder="" readonly></h-input>
            </h-form-item>
            <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required>
              <h-input v-model="addOrEditForm.custAcctNo" placeholder="" readonly></h-input>
            </h-form-item>
            <show-branch v-model="addOrEditForm.saveBrchName" :label="$t('m.i.pl.saveBrchName')" prop="saveBrchName" required title="机构名称"
                         :brchNo.sync="addOrEditForm.saveBrchNo" :brchName.sync="addOrEditForm.saveBrchName"
                         :filterable="batchOptType==='add'" :showCheckBox="false" :msgBoxWin="tempInPoolAddOrEditWin"
                          url="sm/auth/branch/queryAllBranchTree" queryUrl="sm/auth/branch/branch/func_queryAllBranchByBrchNo">
            </show-branch>
            <h-form-item prop="inPoolDt" :label="$t('m.i.pl.inPoolDt')" required>
              <h-date-picker type="date" v-model="addOrEditForm.inPoolDt" placeholder=""
                             @on-change="handleInPoolDtChange" showFormat :editable=false></h-date-picker>
            </h-form-item>
            <h-form-item prop="inPoolType" :label="$t('m.i.pl.inPoolType')" required>
              <h-select v-model="addOrEditForm.inPoolType" placeholder="">
                <h-option value="1">普通入池</h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')" required>
              <h-select v-model="addOrEditForm.billClass" placeholder="" readonly>
                <h-option v-for="item in batchParams.billClassList" :value="item.key" :key="item.key">{{item.value}}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
              <h-select v-model="addOrEditForm.billType" placeholder="" :readonly="this.hadBatchSave">
                <h-option v-for="item in batchParams.billTypeList" :value="item.key" :key="item.key">{{ item.value
                  }}
                </h-option>
              </h-select>
            </h-form-item>
            <h-form-item prop="isCheckBeforeInPool" :label="$t('m.i.pl.isCheckBeforeInPool')" required>
              <h-select v-model="addOrEditForm.isCheckBeforeInPool" placeholder="">
                <h-option v-for="item in batchParams.YonList" :value="item.key" :key="item.key">{{ item.value}}</h-option>
              </h-select>
            </h-form-item>
          </div>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()" v-if="this.batchParams.isCommit === 'noCommit'">{{$t("m.i.common.save")}}</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          :auto-load="false"
          url="/pl/iopool/inpool/paper/pInPoolApplyMain/func_pagingQueryInPoolBill"
          :bindForm="formItem"
          :rowSelect="true"
          :hasSelect="hasSelect"
          :onSelectChange="handleSelectChange"
          @on-page-change-url="handlePageChange"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'
                && (this.btnAuth.pickBillBtn === undefined ? true : this.btnAuth.pickBillBtn.isShow)" @click="ioPoolPickBill">{{$t('m.i.pl.pickBill')}}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'"
                      @click="infoAddOrModifyWin('add')">{{$t("m.i.common.add")}}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'"
                      @click="infoAddOrModifyWin('modify')" :disabled="this.isModifyDisabled">{{$t("m.i.common.modify")}}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoImport">{{$t('m.i.common.batchImport')}}
            </h-button>
            <!--<h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoExport">{{$t('m.i.pe.batchExport')}}-->
            <!--</h-button>-->
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="importTemplate">{{$t('m.i.pe.templateDownload')}}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="infoDelete">{{$t("m.i.common.delete")}}</h-button>
            <h-dropdown placement="bottom-start" @on-click="submit" v-if="this.batchParams.isCommit === 'noCommit'">
              <h-button type="primary">{{$t("m.i.common.submit")}}
                <h-icon name="unfold"></h-icon>
              </h-button>
              <h-dropdown-menu slot="list">
                <h-dropdown-item name="select">选择提交</h-dropdown-item>
                <h-dropdown-item name="batch">批次提交</h-dropdown-item>
              </h-dropdown-menu>
            </h-dropdown>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'noCommit'" @click="inPoolBillPrint()">{{$t("m.i.pl.confirmPrint")}}
            </h-button>
            <h-button type="primary" v-if="this.batchParams.isCommit === 'hasCommit'" @click="infoCancel">{{$t("m.i.common.cancelCheckAuth")}}
            </h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>
    <!-- 查询客户信息弹窗 -->
    <show-sign-agreement :signAgreementWin="signAgreementWin" @signAgreementWinClose="signAgreementWinClose"
                         @signAgreementSubmit="signAgreementSubmit" :signParams="signParams"></show-sign-agreement>
    <!-- 新增修改入池信息 -->
    <impawn-bill-info :impawnAddBillWin="inPoolAddBillWin" :impawnBillInfoParams="inPoolBillInfoParams"
                      @impawnAddBillWinClose="inPoolAddBillWinClose"
                      @impawnAddBillSubmit="inPoolAddBillSubmit"></impawn-bill-info>
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo"></bill-info-main>
    <!--风险信息-->
    <risk-check :riskCheckWin="riskCheckWin" :riskParams="riskParams" @riskCheckWinClose="riskCheckWinClose"
                @riskCheckSubmit="riskCheckSubmit"></risk-check>
    <!--挑票窗口-->
    <io-pool-pick-bill :ioPoolPickBillWin="ioPoolPickBillWin" @ioPoolPickBillChange="ioPoolPickBillChange"
                       :ioPoolPickBillParams="ioPoolPickBillParams"
                       @ioPoolPickBillWinClose="ioPoolPickBillWinClose"></io-pool-pick-bill>

    <!-- 二次确认弹窗 -->
    <h-msg-box v-model="confirmAgainWin" :maximize="false" width="400" :footerHide="true" :closable="false" :z-index="2010">
      <div class="modal-body">
        <div class="h-modal-confirm">
          <div class="h-modal-confirm-head">
            <div class="h-modal-confirm-head-icon h-modal-confirm-head-icon-confirm">
              <i class="h-icon iconfont icon-feedback"></i>
            </div>
            <div class="h-modal-confirm-head-title">确认</div>
          </div>
          <div class="h-modal-confirm-body">
            <div>入池额度超过票据池限额,确定提交申请吗?</div>
          </div>
          <div class="h-modal-confirm-footer">
            <button type="button" @click="confirmAgainClose()" class="h-btn h-btn-text h-btn-large"><span>取消</span>
            </button>
            <button type="button" @click="handleSubmit(submitConfirmParam)" class="h-btn h-btn-primary h-btn-large"><span>确定</span>
            </button>
          </div>
        </div>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pInPoolApplyAdd",
    components: {
      IoPoolPickBill: () => import(/* webpackChunkName: "pl/iopool/common/ioPoolPickBill" */ '@/views/bizViews/pl/iopool/common/ioPoolPickBill'),
      ImpawnBillInfo: () => import(/* webpackChunkName: "ce/impawn/common/impawnBillInfo" */ '@/views/bizViews/ce/impawn/common/impawnBillInfo'),
    },
    data() {
      let columns = [
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
          title: this.$t("m.i.billInfo.billMoney"),
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
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: "drwrAcctNo",
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
          title: this.$t("m.i.billInfo.pyeeBankName"),
          key: "pyeeBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptBankNo"),
          key: "acptBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: "acptProtocalNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: "drweBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankNo"),
          key: "drweBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankAddr"),
          key: "drweBankAddr",
          ellipsis: false,
          hiddenCol: false
        }
      ];
      return {
        confirmAgainWin : false,
        submitConfirmParam : {},
        batchId : "",
        ioPoolPickBillWin : false,
        addOrEditForm : {
          id: "",
          legalNo: "",
          billType: "",
          agreementNo: "",
          custNo: "",
          custName: "",
          custAcctNo: "",
          saveBrchNo: "",
          saveBrchName: "",
          inPoolDt: "",
          inPoolType: "",
          billClass: "",
          isCheckBeforeInPool:""
        },
        formItem : {
          batchId: "",
          funcNo: "",
          billClass: ""
        },
        columns : [],
        columnsNoCommit : [
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
            title: this.$t("m.i.billInfo.billMoney"),
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
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: "drwrAcctNo",
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
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: "pyeeBankName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            sortable: true,
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: "acptProtocalNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankName"),
            key: "drweBankName",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",
            ellipsis: false,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankAddr"),
            key: "drweBankAddr",
            ellipsis: false,
            hiddenCol: false
          }
        ],
        columnsHasCommit : [
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
          title: this.$t("m.i.billInfo.billMoney"),
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
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: "drwrAcctNo",
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
          title: this.$t("m.i.billInfo.pyeeBankName"),
          key: "pyeeBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptName"),
          key: "acptName",
          sortable: true,
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptBankNo"),
          key: "acptBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: "acptProtocalNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: "drweBankName",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankNo"),
          key: "drweBankNo",
          ellipsis: false,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.billInfo.drweBankAddr"),
          key: "drweBankAddr",
          ellipsis: false,
          hiddenCol: false
        }
      ],
        //票据明细界面-区分新增/修改操作
        billOptType : "",
        //新增票面信息窗口
        inPoolAddBillWin : false,
        //修改票据明细界面所需入参
        inPoolBillInfoParams : {
          billOptType: "",
          billType: "",
          billId: "",
          billNo: "",
          dictMap: new Map(),
          billTypeList: []
        },
        inPoolAddBillInfoForm : {},
        ioPoolPickBillParams : {},
        currentSelectList : [],
        signAgreementWin : false,
        signParams : {},
        //记录批次是否已保存
        hadBatchSave : false,
        importWin : false,
        fileParams : {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/paper/pInPoolApplyMain/func_loadExcelData",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/paper/pInPoolApplyMain/func_submitExcelData",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: columns,
          paramKey: "list"         //后台接收对应key
        },
        showBillInfoWin : false,
        billId : "",
        billNo : "",
        //风险信息窗口
        riskCheckWin : false,
        riskParams : {},
        hasSelect : false,
        //新增时批次下有数据，票据种类不可更改
        isReadOnly : false,
        submitType : "",
        //票据批次界面-区分新增/修改操作
        batchOptType: "",
        isModifyDisabled: false   //控制修改按钮是否可用，dataSource为2（网银发起）-禁用
      };
    },
    props: {
      inPoolAddOrEditWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {
          batchType: "",
          funcNo: "",
          isCommit: "",
          billClass: "",
          dictMap: new Map(),
          billClassList: [],
          billTypeList: [],
          queryTypeList: [],
          YonList: [],
          inPoolBatchId: "",
        }
      },
      btnAuth:{
        type: Object,
        default(){
          return {
            pickBillBtn:{
              isShow:true
            }
          }
        }
      }
    },
    computed: {
      tempInPoolAddOrEditWin: {
        get() {
          return this.inPoolAddOrEditWin;
        },
        set() {
        }
      }
    },
    watch: {
      inPoolAddOrEditWin(val) {
        if (val) {
          this.$nextTick(() => {
            this.isModifyDisabled = false;
            this.batchOptType = this.batchParams.batchType;
            if(this.batchParams.isCommit === 'hasCommit') {
              this.columns = this.columnsHasCommit;
              this.$refs.datagrid.createShowCol(this.columns);
            }else {
              this.columns = this.columnsNoCommit;
              this.$refs.datagrid.createShowCol(this.columns);
            }
            this.batchId = this.batchParams.inPoolBatchId;
            this.formItem.batchId = this.batchId;
            this.formItem.funcNo = this.batchParams.funcNo;
            this.formItem.billClass = this.batchParams.billClass;
            this.addOrEditForm.saveBrchNo = JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo;
            this.addOrEditForm.saveBrchName = JSON.parse(window.sessionStorage.getItem("userInfo")).brchName;
            this.addOrEditForm.inPoolType = "1";
            this.addOrEditForm.billClass = this.batchParams.billClass;
            if (this.batchParams.batchType === "modify") {
              this.hadBatchSave = true;
              this.queryObjById();
              this.handleSearch();
            }
            if (this.batchParams.batchType === "add") {
              this.hadBatchSave = false;
              this.$refs.datagrid.tData = [];
              this.addOrEditForm.inPoolDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYY-MM-DD").format("YYYY-MM-DD");
            }
            this.hasSelect = false;
            this.currentSelectList = [];
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.selects = [];
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      //修改时根据票据批次Id查询票据批次信息
      queryObjById() {
        let params = { id: this.batchId, billClass: this.batchParams.billClass, funcNo: this.batchParams.funcNo };
        post(params, "/pl/iopool/inpool/paper/pInPoolApplyMain/func_findInPoolBatchById").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.legalNo = obj.legalNo;
              this.addOrEditForm.agreementNo = obj.agreementNo;
              this.addOrEditForm.custNo = obj.custNo;
              this.addOrEditForm.custName = obj.custName;
              this.addOrEditForm.custAcctNo = obj.custAcctNo;
              this.addOrEditForm.saveBrchNo = obj.saveBrchNo;
              this.addOrEditForm.saveBrchName = obj.saveBrchName;
              if (!!obj.inPoolDt) {
                this.addOrEditForm.inPoolDt = this.$moment(obj.inPoolDt, "YYYYMMDD").format("YYYY-MM-DD");
              }
              this.addOrEditForm.inPoolType = obj.inPoolType;
              this.addOrEditForm.billClass = obj.billClass;
              this.addOrEditForm.billType = obj.billType;
              this.addOrEditForm.isCheckBeforeInPool = obj.isCheckBeforeInPool;
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
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.addOrEditForm.legalNo = "";
        this.addOrEditForm.saveBrchNo = "";
        this.hadBatchSave = false;
        this.isReadOnly = false;
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("inPoolAddOrEditWinClose", "");
      },
      handleInPoolDtChange(value) {
        this.addOrEditForm.inPoolDt = value.replace(/-/g, "");
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //表单查询
      handleSearch(pageNo) {
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.isModifyDisabled = false;
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
        if (this.$refs.datagrid.tData.length <= 0) {
          this.isReadOnly = false;
        }
      },
      //行选中
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },
      //查询签约信息
      queryAgreementNo() {
        this.signParams.agreementUrl = "/pl/iopool/inpool/paper/pInPoolApplyMain/func_pagingBillAgreement";
        this.signParams.signFuncNo = "2";
        this.signParams.effectiveFlag = "1";
        this.signAgreementWin = true;
      },
      //赋值
      signAgreementSubmit(info) {
        this.addOrEditForm.agreementNo = info.agreementNo;
        this.addOrEditForm.custName = info.custName;
        this.addOrEditForm.custNo = info.custNo;
        this.addOrEditForm.custAcctNo = info.custAcctNo;
        this.addOrEditForm.isCheckBeforeInPool = info.isCheckBeforeInPool;
        this.signAgreementWin = false;
      },
      //关闭
      signAgreementWinClose() {
        this.signParams = {};
        this.signAgreementWin = false;
      },
      //保存批次信息
      formSave() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.addOrEditForm.inPoolDt = this.addOrEditForm.inPoolDt.replace(/-/g, "");
            if (this.addOrEditForm.inPoolDt < window.sessionStorage.getItem("workDate")) {
              this.$msgTip.info(this, { info: "入池日期必须大于或等于当前营业日期" });
              return;
            }
            let url = this.batchParams.batchType === "add" ? "/pl/iopool/inpool/paper/pInPoolApplyMain/func_addInPoolBatch" : "/pl/iopool/inpool/paper/pInPoolApplyMain/func_editInPoolBatch";
            if (this.hadBatchSave) {
              url = "/pl/iopool/inpool/paper/pInPoolApplyMain/func_editInPoolBatch";
            }
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if (this.batchParams.batchType === "add" && this.hadBatchSave === false) {
                    this.batchId = res.data.retData;
                    this.formItem.batchId = res.data.retData;
                    this.addOrEditForm.id = res.data.retData;
                  }
                  this.handleSearch();
                  this.hadBatchSave = true;
                  this.batchParams.batchType = "modify";
                  this.batchOptType = this.batchParams.batchType;
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
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.batchParams.batchType === "add") {
          if (this.billOptType === "add") {
            if (this.hadBatchSave) {
              this.jumpToAddBillWin();
            } else {
              this.$msgTip.info(this, { info: "请先保存批次" });
              return;
            }
          } else if (this.billOptType === "modify") {
            if (this.currentSelectList.length === 0) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
              return;
            }
            if (this.currentSelectList.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.inPoolBillInfoParams.billId = this.currentSelectList[0].billId;
            this.inPoolBillInfoParams.billNo = this.currentSelectList[0].billNo;
            this.jumpToAddBillWin();
          }
        }
        if (this.batchParams.batchType === "modify") {
          if (this.billOptType === "add") {
            this.jumpToAddBillWin();
          }
          if (this.billOptType === "modify") {
            if (this.currentSelectList.length === 0) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
              return;
            }
            if (this.currentSelectList.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            this.inPoolBillInfoParams.billId = this.currentSelectList[0].billId;
            this.inPoolBillInfoParams.billNo = this.currentSelectList[0].billNo;
            this.inPoolBillInfoParams.impawnId = this.currentSelectList[0].id;
            this.jumpToAddBillWin();
          }
        }
      },
      //跳转到新增明细界面
      jumpToAddBillWin() {
        this.inPoolBillInfoParams.billOptType = this.billOptType;
        this.inPoolBillInfoParams.billType = this.addOrEditForm.billType;
        this.inPoolBillInfoParams.dictMap = this.batchParams.dictMap;
        this.inPoolBillInfoParams.billTypeList = this.batchParams.billTypeList;
        this.inPoolBillInfoParams.batchId = this.batchId;
        let url = this.billOptType === "add" ? "/pl/iopool/inpool/paper/pInPoolApplyMain/func_addPaperInPoolBill" : "/pl/iopool/inpool/paper/pInPoolApplyMain/func_updateInPoolBill";
        this.inPoolBillInfoParams.commitUrl = url;
        this.inPoolAddBillWin = true;
      },
      //新增、修改弹窗关闭
      inPoolAddBillWinClose() {
        this.inPoolAddBillWin = false;
        this.inPoolBillInfoParams = {};
        this.handleSearch();
      },
      //新增、修改弹窗确定
      inPoolAddBillSubmit(info) {
        this.isReadOnly = true;
        let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
        this.handleSearch(pageNo);
        this.inPoolAddBillWin = false;
        this.inPoolBillInfoParams = {};
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
        this.$refs.datagrid.dataChange(1);
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      //批量导出
      infoExport() {
        if (this.batchId === "") {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        this.exportForm();
      },
      exportForm() {
        let url = window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/paper/pInPoolApplyMain/func_exportExcel";
        let form = document.createElement("form");
        for (let obj in this.formItem) {
          if (this.formItem.hasOwnProperty(obj)) {
            let input = document.createElement("input");
            input.tpye = "text";
            input.name = obj;
            input.value = this.formItem[obj];
            form.appendChild(input);
          }
        }
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/pl/iopool/inpool/paper/pInPoolApplyMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //删除
      infoDelete() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDeleteDetail();
          }
        });
      },
      handleDeleteDetail() {
        let inPoolIds = this.$refs.datagrid.selectIds;
        post({
          batchId: this.batchId,
          listIds: inPoolIds.join(",")
        }, "/pl/iopool/inpool/paper/pInPoolApplyMain/func_deleteInPoolBill").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
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
          if (this.$refs.datagrid.selects.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
            return;
          }
          let inPoolIds = this.$refs.datagrid.selectIds;
          let params = { batchId: this.batchId, listIds: inPoolIds.join(",") };
          this.submitConfirmParam = params;
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
          let params = { batchId: this.batchId };
          this.submitConfirmParam = params;
          this.getRiskBillNo(params);
        }
      },
      //提交前先调用风险检查接口
      getRiskBillNo(params) {
        post(params, "/pl/iopool/inpool/paper/pInPoolApplyMain/func_getRiskBillNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let data = res.data.retData;
            if (retCode === "000000") {
              if (Object.keys(data).length > 0) {
                this.riskCheckWin = true;
                this.riskParams.gridDatas = data;
                this.riskParams.submitParams = params;
                this.riskParams.YonList = this.batchParams.YonList;
              } else {
                this.$hMsgBox.confirm({
                  title: this.$t("m.i.common.confirm"),
                  content: "确定提交申请吗?",
                  onOk: () => {
                    this.checkLimit(params,false);
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

      //校验入池限额
      checkLimit(params,isRiskCkeck){
        post(params, "/pl/iopool/inpool/paper/pInPoolApplyMain/func_checkInPoolLimit").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let data = res.data.retData;
            if (retCode === "000000") {
              if (data === true) {
                this.handleSubmit(params,isRiskCkeck);
              } else {
                this.confirmAgainWin = true;
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
        post(params, "/pl/iopool/inpool/paper/pInPoolApplyMain/func_submitFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.confirmAgainClose();
              if(this.submitType === 'select'){
                if (this.$refs.datagrid.total === this.$refs.datagrid.selects.length) {
                  this.handleClose();
                } else {
                  this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
                }
              }else if(this.submitType === 'batch'){
                this.handleClose();
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.confirmAgainClose();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
            if (this.riskCheckWin) {
              this.riskCheckWinClose();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          this.confirmAgainClose();
        });
      },
      //撤销
      infoCancel() {
        // if (this.currentSelectList.length === 0) {
        //   this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        //   return;
        // }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      //入池确认书打印
      inPoolBillPrint() {
        if (this.batchId === "") {
          this.$msgTip.info(this, { info: "请先保存批次" });
          return;
        }
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.assemblePrsttnBillParams(list);
      },
      assemblePrsttnBillParams(vocherData) {
        let bodyStr = "";
        for (let i = 0; i < vocherData.length; i++) {
          let printData = {};
          printData.billNo = vocherData[i].billNo;
          printData.flowStatusName = !!vocherData[i].flowStatusName ? vocherData[i].flowStatusName : "";
          printData.billType = !!vocherData[i].billType ? this.getDictValueFromMap(this.batchParams.dictMap, "DraftTypeCode", vocherData[i].billType) : "";
          printData.remitDt = !!vocherData[i].remitDt ? this.$moment(vocherData[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
          printData.dueDt = !!vocherData[i].dueDt ? this.$moment(vocherData[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD") : "";
          printData.billMoney = formatNumber(vocherData[i].billMoney, 2, ",");
          printData.drwrName = vocherData[i].drwrName;
          printData.drwrAcctNo = vocherData[i].drwrAcctNo;
          printData.pyeeName = vocherData[i].pyeeName;
          printData.pyeeAcctNo = vocherData[i].pyeeAcctNo;
          printData.acptName = vocherData[i].acptName;
          printData.flowNo = vocherData[i].acctFlowId;
          printData.printObj = JSON.stringify(vocherData[i]);

          bodyStr += "<tr>";
          bodyStr += "<td class='ta-c'>" + (1 + i) + "</td>";
          bodyStr += "<td>" + printData.billNo + "</td>";
          bodyStr += "<td>" + printData.flowStatusName + "</td>";
          bodyStr += "<td>" + printData.billType + "</td>";
          bodyStr += "<td>" + printData.remitDt + "</td>";
          bodyStr += "<td>" + printData.dueDt + "</td>";
          bodyStr += "<td>" + printData.billMoney + "</td>";
          bodyStr += "<td>" + printData.drwrName + "</td>";
          bodyStr += "<td>" + printData.drwrAcctNo + "</td>";
          bodyStr += "<td>" + printData.pyeeName + "</td>";
          bodyStr += "<td>" + printData.acptName + "</td>";
          bodyStr += "</tr>";
        }
        let headHtml = `<div style="text-align:center;" ref="headHtml">
          <div style="text-align:center;font-size:18px;font-weight:bold;">票据池确认清单</div>
           <div style="text-align:left;font-size:14px;font-weight:bold;">入池：√</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户名称：${this.addOrEditForm.custName}</div>
          <div style="text-align:left;font-size:14px;font-weight:bold;">客户账号：${this.addOrEditForm.custAcctNo}</div>
        </div>`;
        let footerHtml = `<div style="font-size:14px;font-weight:bold;display:-webkit-box;display:flex;justify-content:flex-end;">
          <label style="padding-right:20%">收款行:</label>
          <label style="padding-right:20%">客户:</label>
        </div>`;
        let bodyHtml = `<div class="list-table-box"><table class="list-table">
          <thead>
            <tr>
              <th class="ta-c"><b>序号</b></th>
              <th>票据号码</th>
              <th>流程状态</th>
              <th>票据种类</th>
              <th>出票日期</th>
              <th>汇票到期日</th>
              <th>票据金额</th>
              <th>出票人全称</th>
              <th>出票人账号</th>
              <th>收款人全称</th>
              <th>承兑人全称</th>
            </tr>
          </thead>
          <tbody>${bodyStr}</tbody>
        </table>
      </div>`;
        this.$print.printListHtm(this, headHtml, bodyHtml, {
          bodyTop: "20%", bodyLeft: "1%", bodyWidth: "99%", bodyHeight: "75%"
        }, footerHtml);
      },
      handleCancelApplyBatch() {
        // let list = this.currentSelectList;
        // let inPoolIds = [];
        // for (let i = 0; i < list.length; i++) {
        //   inPoolIds.push(list[i].id);
        // }
        post({ batchId: this.batchId }, "/pl/iopool/inpool/paper/pInPoolApplyMain/func_cancelFlow").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleClose();
              this.handleSearch(this.$refs.datagrid.pageInfo.pageNo);
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
        // this.handleSubmit(info, true);
        this.checkLimit(info,true);
      },
      confirmAgainClose() {
        this.confirmAgainWin = false;
      },
      //弹出挑票窗口
      ioPoolPickBill() {
        if (this.batchParams.batchType === "add") {
          if (this.hadBatchSave) {
            this.jumpToPickBillWin();
          } else {
            this.$msgTip.info(this, { info: "请先保存批次" });
            return;
          }
        }
        if (this.batchParams.batchType === "modify") {
          this.jumpToPickBillWin();
        }
      },
      //跳转到挑票界面
      jumpToPickBillWin() {
        this.ioPoolPickBillParams.batchId = this.batchId;
        this.ioPoolPickBillParams.dictMap = this.batchParams.dictMap;
        this.ioPoolPickBillParams.billType = this.addOrEditForm.billType;
        this.ioPoolPickBillParams.billClass = this.batchParams.billClass;
        this.ioPoolPickBillParams.custNo = this.addOrEditForm.custNo;
        this.ioPoolPickBillParams.custAcctNo = this.addOrEditForm.custAcctNo;
        this.ioPoolPickBillParams.pickBillType = "inPool";
        this.ioPoolPickBillParams.pickBillUrl = "/pl/iopool/inpool/paper/pInPoolApplyMain/func_pagingQueryInPoolUnsignBills";
        this.ioPoolPickBillWin = true;
      },
      //挑票界面取消按钮
      ioPoolPickBillWinClose() {
        this.ioPoolPickBillParams = {};
        this.ioPoolPickBillWin = false;
      },
      //挑票界面根据弹框所选票进行赋值
      ioPoolPickBillChange(info) {
        let pickDtoList = [];
        for (let i = 0; i < info.length; i++) {
          let pickDto = {
            transId: info[i].transId,
            billId: info[i].billId,
            hldrId: info[i].hldrId
          };
          pickDtoList.push(pickDto);
        }
        post({
          pickBillDtoList: pickDtoList,
          batchId: this.batchId
        }, "/pl/iopool/inpool/elec/eInPoolApplyMain/func_pickInPoolBillInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.ioPoolPickBillParams = {};
              this.ioPoolPickBillWin = false;
              this.isReadOnly = true;
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleSelectChange () {
        this.isModifyDisabled = this.$refs.datagrid.selects.some(item => {
          return item.dataSource === "2";
        });
      },
      handlePageChange() {
        this.handleSelectChange();
      }
    }
  };
</script>

<style scoped>

</style>
