<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div v-if="mainVue" key="1">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_queryPageAcptBatchAndBill"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billNoAdd()" >{{$t('m.i.ce.billNoAdd')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <div v-if="billManagerVue" key="2">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
                <h-form-item prop="promNoteNoLike" :label="$t('m.i.ce.promNoteNo')">
                  <h-input v-model="billManagerFormItem.promNoteNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
        <acpt-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams"
                                :batchUrl = "'/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_getAcptBatchByQueryDto'"
                                ref="acptBatchInfoDetail"></acpt-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_queryPageAcptBil"
                      :auto-load="false"
                      highlightRow
                      :bindForm="billManagerFormItem"
                      :on-current-change="billManagerHandleRowClick"
                      :on-current-change-cancel="billManagerHandleRowClickCancel"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportBillNoExcel" >{{$t('m.i.ce.exportBillNoExcel')}}</h-button>
              <h-button type="primary" @click="batchImport" >{{$t('m.i.ce.batchImportBill')}}</h-button>
              <h-button type="primary" @click="selectBillNoAdd" >{{$t('m.i.ce.selectBillNoAdd')}}</h-button>
              <h-button type="primary" @click="manualBillNoAdd" >{{$t('m.i.ce.manualBillNoAdd')}}</h-button>
              <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

        <!--文件批量导入-->
        <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                            @importSuccess="importSuccess"></common-file-upload>

        <!-- 选择补录界面弹窗 -->
        <h-msg-box v-model="selectBillNoAddWin" width="400" @on-close="selectBillNoAddWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>选择补录</span>
          </p>
          <div>
            <h-form :model="selectBillNoAddForm" :label-width="90" ref="selectBillNoAddForm" cols="1" class="h-form-search">
              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
                <h-input v-model="selectBillNoAddForm.billNo" placeholder="" icon="android-search" @on-click="queryBillNo()" readonly></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="selectBillNoAddWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="selectBillNoAddSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 选择补录票据查询弹窗 -->
        <h-msg-box v-model="selectBillNoWin" width="800" @on-close="selectBillNoWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>选择补录票据查询界面</span>
          </p>
          <div>
            <!-- 数据展示表格 -->
            <h-datagrid :columns="selectBillNoColumns"
                        highlight-row
                        :autoLoad="false"
                        url="/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_selectBillNoList"
                        :bindForm="selectBillNoForm"
                        :on-current-change="selectBillNoRowClick"
                        :onRowDbClick="doubleHandleClick"
                        ref="selectBillNoDatagrid" class="pl-5 pr-5">
              <div slot="toolbar" class="pull-left">
              </div>
            </h-datagrid>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="selectBillNoWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="selectBillNoSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

        <!-- 手工补录界面弹窗 -->
        <h-msg-box v-model="manualBillNoWin" width="400" @on-close="manualBillNoWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>手工补录</span>
          </p>
          <div>
            <h-form :model="manualBillNoForm" :label-width="115" ref="manualBillNoForm" cols="1" class="h-form-search">
              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billNo')" required>
                <h-input v-model="manualBillNoForm.billNo" placeholder=""></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="manualBillNoWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="manualBillNoSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";
  import {deepClone} from "@/utils/index";

  export default {
    name: "acptBillNoAddMain",
    components: {
      // AcptBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/acptBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/acptBatchInfoDetail`)
    },
    data() {
      let columns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
        },
        {
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: 'acptProtocalNo',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h('div', [
              h('a', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.acptProtocalNoMain(params.row.id)
                  }
                }
              }, params.row.acptProtocalNo)
            ]);
          }
        },
        {
         title: this.$t("m.i.ce.acptType"),
          key: 'acptType',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
            return h("span", {
              domProps: {
                title: list
              }
            }, list);
          }
        },
        {
          title: this.$t("m.i.billInfo.drwrName"),
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
         title: this.$t("m.i.billInfo.drwrCustNo"),
          key: 'drwrCustNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.drwrAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.drweBankName"),
          key: 'drweBankName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.remitDt"),
          key: 'remitDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.remitDt == null || params.row.remitDt === ""){
              return "";
            }
            let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.billInfo.dueDt"),
          key: 'dueDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
         title: this.$t("m.i.ce.totalFee"),
          key: 'totalFee',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalFee = formatNumber(params.row.totalFee, 2, ',');
            return h("span", {
              domProps: {
                title: totalFee
              }
            }, totalFee);
          }
        },
        {
          title: this.$t("m.i.ce.totalCommitFee"),
          key: 'totalCommitFee',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalCommitFee = formatNumber(params.row.totalCommitFee, 2, ',');
            return h("span", {
              domProps: {
                title: totalCommitFee
              }
            }, totalCommitFee);
          }
        },
        {
          title: this.$t("m.i.ce.totalCount"),
          key: 'totalCount',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.totalAmt"),
          key: 'totalAmt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
            return h("span", {
              domProps: {
                title: totalAmt
              }
            }, totalAmt);
          }
        }
      ];
      let billManagerColumns = [
        {
          title: ' ',
          type: 'radio',
          align: 'center',
          width : 50
        },
        {
          type: 'index',
          key: 'numOrder',
          title: this.$t("m.i.common.index"),
          width: 60,
          align: 'center',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.promNoteNo"),
          key: 'promNoteNo',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.billInfo.flowStatus"),
          key: 'flowStatusName',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.billMoney"),
          key: 'billMoney',
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
          title: this.$t("m.i.billInfo.dueDt"),
          key: 'dueDt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            if(params.row.dueDt == null || params.row.dueDt === ""){
              return "";
            }
            let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.guarntrAmt"),
          key: 'guarntrAmt',
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
            return h("span", {
              domProps: {
                title: guarntrAmt
              }
            }, guarntrAmt);
          }
        },
        {
         title: this.$t("m.i.ce.fee"),
          key: 'fee',
          hiddenCol: false,
          render: (h, params) => {
            let fee = formatNumber(params.row.fee, 2, ',');
            return h("span", {
              domProps: {
                title: fee
              }
            }, fee);
          }
        },
        {
          title: this.$t("m.i.ce.commitFee"),
          key: 'commitFee',
          hiddenCol: false,
          render: (h, params) => {
            let commitFee = formatNumber(params.row.commitFee, 2, ',');
            return h("span", {
              domProps: {
                title: commitFee
              }
            }, commitFee);
          }
        },
        {
          title: this.$t("m.i.billInfo.pyeeName"),
          key: 'pyeeName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.billInfo.pyeeAcctNo"),
          key: 'pyeeAcctNo',
          hiddenCol: false,
        },
        {
           title: this.$t("m.i.billInfo.pyeeBankName"),
          key: 'pyeeBankName',
          hiddenCol: false,
        },
        {
           title: this.$t("m.i.billInfo.acptName"),
          key: 'acptName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.ce.guarntrNo"),
          key: 'guarntrNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.ce.drwrAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
        }
      ];
      return {
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          remitDt: '',
          acptType: '2',
          billClass: 'ME01',
          curFuncNo: 'PICE010802'
        },
        billManagerFormItem: {
          promNoteNoLike: '',
          batchId: '',
          billClass: 'ME01',
          curFuncNo: 'PICE010802'
        },
        selectBillNoAddForm: {
          id: '',
          batchId: '',
          billNo: '',
          billOperType: '1',
          billMoney: '',
          remitDt: '',
          dueDt: ''
        },
        selectBillNoForm: {
          id: ''
        },
        manualBillNoForm: {
          id: '',
          billNo: '',
          billOperType: '2'
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        showBillInfoWin: false,
        billId: "",
        selectBillNoColumns: [
          {
            title: ' ',
            type: 'radio',
            align: 'center',
            width : 50
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
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
             title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
             title: this.$t("m.i.billInfo.drweBankName"),
            key: 'drweBankName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: 'drweBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: 'pyeeAcctNo',
            hiddenCol: false,
          },
          {
             title: this.$t("m.i.billInfo.pyeeBankName"),
            key: 'pyeeBankName',
            sortable: true,
            hiddenCol: false,
          }
        ],
        batchInfoParams: {
          id: '',
          curFuncNo: 'PICE010802',
          promNoteNoLike: ""
        },
        dictMap: new Map(),
        acptTypeList: [],
        batchId: "",
        currentSelectRow: null,
        billManagerCurrentSelectRow:null,
        selectBillNoRow: null,
        mainVue: true,
        billManagerVue: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        selectBillNoAddWin: false,
        selectBillNoWin: false,
        manualBillNoWin: false,
        submitFlag: false,
        ifShowMore: false,

        //导入票号
        importWin: false,
        fileParams: {
          //忽略错误
          ignoreError: true,
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME+"/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_loadExcelData",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_submitExcelData",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {
            batchId: ''
          },     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "radio",
              title: " ",
              width: 60,
              align: "center",
              hiddenCol: false
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
             title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              sortable: true,
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.remitDt"),
              key: "remitDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: "dueDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
              key: "billMoney",
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
               title: this.$t("m.i.billInfo.acptName"),
              key: 'acptName',
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t("m.i.billInfo.drwrName"),
              key: 'drwrName',
              sortable: true,
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.drwrAcctNo"),
              key: 'drwrAcctNo',
              hiddenCol: false,
            },
            {
               title: this.$t("m.i.billInfo.drweBankName"),
              key: 'drweBankName',
              sortable: true,
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.drweBankNo"),
              key: 'drweBankNo',
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.pyeeName"),
              key: 'pyeeName',
              sortable: true,
              hiddenCol: false,
            },
            {
              title: this.$t("m.i.billInfo.pyeeAcctNo"),
              key: 'pyeeAcctNo',
              hiddenCol: false,
            },
            {
               title: this.$t("m.i.billInfo.pyeeBankName"),
              key: 'pyeeBankName',
              sortable: true,
              hiddenCol: false,
            }
          ],
          paramKey:"list"
        }
      }
    },
    mounted() {
      getDictListByGroups("AcptType").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      doubleHandleClick(arr) {
        this.selectBillNoRow = arr;
        this.selectBillNoSubmit();
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleDateChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = null;
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$nextTick(() => {
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = '';
          this.formItem.drwrAcctNo = '';
          this.formItem.acptProtocalNoLike = '';
          this.formItem.remitDt = '';
        });
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = null;
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if(this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //补录票号
      billNoAdd() {
        if(!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.id = this.batchId;
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },
      //承兑协议编号超链接
      acptProtocalNoMain(str) {
        this.batchId = str;
        this.billManagerFormItem.batchId = this.batchId;
        this.batchInfoParams.id = this.batchId;
        this.$refs.datagrid.tData = [];
        this.resetSearch();
        this.mainVue = false;
        this.billManagerVue = true;
        this.$nextTick(() => {
          this.billManagerColumns = deepClone(this.billTemp);
          this.$refs.billManagerDatagrid.createShowCol(this.billTemp);
          this.$refs.billManagerDatagrid.dataChange(1);
        });
      },



      //票据管理子页面方法
      //表单查询
      billManagerHandleSearch() {
        this.billManagerCurrentSelectRow = null;
        this.batchInfoParams.promNoteNoLike = this.billManagerFormItem.promNoteNoLike;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptBatchInfoDetail.getBatchInfo();
        })
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.promNoteNoLike = '';
          this.batchInfoParams.promNoteNoLike = '';
        })
      },
      //行选中
      billManagerHandleRowClick(arr) {
        this.billManagerCurrentSelectRow = arr;
      },
      billManagerHandleRowClickCancel() {
        this.billManagerCurrentSelectRow = null;
      },
      //导入票号模板下载
      exportBillNoExcel() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_download";
        let form = document.createElement('form');
        form.setAttribute("id","formId");
        form.setAttribute('action',url);
        form.setAttribute("method", "get");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //批量导入
      batchImport() {
        this.fileParams.extraGridDatas.batchId = this.batchId;
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.handleSearch();
      },


      //选择补录
      selectBillNoAdd() {
        if(this.billManagerCurrentSelectRow === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.selectBillNoAddForm.batchId = this.batchId;
        this.selectBillNoAddForm.id = this.billManagerCurrentSelectRow.id;
        this.selectBillNoForm.id = this.batchId;
        this.selectBillNoAddWin = true;
      },
      queryBillNo() {
        this.selectBillNoWin = true;
        this.$nextTick(() => {
          this.$refs.selectBillNoDatagrid.dataChange(1);
        });
      },
      //选择补录弹窗
      //确定
      selectBillNoAddSubmit() {
        this.$refs["selectBillNoAddForm"].validate(valid => {
          if (valid) {
            post(this.selectBillNoAddForm, "/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_submit").then(res => {
              if (res) {
                let msg = res.data.retMsg
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.selectBillNoAddWinClose();
                  if(this.$refs.billManagerDatagrid.total === 1) {
                    this.returnMain();
                  }else {
                    this.$refs.acptBatchInfoDetail.getBatchInfo();
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                    this.billManagerCurrentSelectRow = null;
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      //关闭
      selectBillNoAddWinClose() {
        this.selectBillNoAddWin = false;
        this.selectBillNoAddForm.billNo = "";
        this.$refs.selectBillNoAddForm.resetFields();
      },

      //选择补录票据查询弹窗
      //行选中
      selectBillNoRowClick(arr) {
        this.selectBillNoRow = arr;
      },
      //确定
      selectBillNoSubmit() {
        if(this.selectBillNoRow === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.selectBillNoAddForm.billNo = this.selectBillNoRow.billNo;
        this.selectBillNoAddForm.billMoney = this.selectBillNoRow.billMoney;
        this.selectBillNoAddForm.remitDt = this.selectBillNoRow.remitDt;
        this.selectBillNoAddForm.dueDt = this.selectBillNoRow.dueDt;
        this.selectBillNoWinClose();
      },
      //关闭
      selectBillNoWinClose() {
        this.selectBillNoWin = false;
        this.selectBillNoRow = null;
      },
      //手工补录
      manualBillNoAdd() {
        if(this.billManagerCurrentSelectRow ===null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.manualBillNoForm.id = this.billManagerCurrentSelectRow.id;
        this.manualBillNoWin = true;
      },

      //手工补录弹窗
      //确定
      manualBillNoSubmit() {
        this.$refs["manualBillNoForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.manualBillNoForm, "/ce/acpt/paper/billNoAdd/acptBillNoAddMain/func_submit").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.manualBillNoWinClose();
                  if(this.$refs.billManagerDatagrid.total === 1) {
                    this.returnMain();
                  }else {
                    this.$refs.acptBatchInfoDetail.getBatchInfo();
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
                    this.billManagerCurrentSelectRow = null;
                  }
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //关闭
      manualBillNoWinClose() {
        this.manualBillNoWin = false;
        this.$refs.manualBillNoForm.resetFields();
      },
      //返回主页面
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = null;
        this.billManagerCurrentSelectRow = null;
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
        });
      },
    }
  };
</script>

<style scoped>

</style>
