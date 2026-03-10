<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="paymentDt" :label="$t('m.i.billInfo.paymentDt')">
                  <h-date-picker type="date" v-model="formItem.paymentDt" :editable=false placeholder="" @on-change="handlePaymentDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterApply/func_pageQueryAcptCorpList"
                      :bindForm="formItem"
                      :onRowClick="handleRowClick"
                      :onSelectChange="handleSelectClick"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="singleAdd('add')" v-if="auditMode">{{$t('m.i.ce.singleAdd')}}</h-button>
              <h-button type="primary" @click="singleAdd('modify')" v-if="auditMode">{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="busiDelete" v-if="auditMode">{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="templateDownload" v-if="auditMode">{{$t('m.i.common.templateDownload')}}</h-button>
              <h-button type="primary" @click="batchImport" v-if="auditMode">{{$t('m.i.common.batchImport')}}</h-button>
              <h-button type="primary" @click="submitRecheck" >{{$t('m.i.common.submitCheck')}}</h-button>
            </div>
          </h-datagrid>

          <h-msg-box v-model="acptRegisterAddWin" width="800" @on-close="acptRegisterAddWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
            <p slot="header">
              <span v-if="type=='add'">新增承兑结清登记信息</span>
              <span v-if="type=='modify'">修改承兑结清登记信息</span>
            </p>
            <div>
              <h-form :model="acptRegisterAddForm" :label-width="115" ref="acptRegisterAddForm" cols="2" class="h-form-search">
                <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
                  <h-select v-model="acptRegisterAddForm.billType" placeholder="" readonly showTitle>
                    <h-option value="AC02" key="AC02">商票</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :required="isRequired" :validRules="billNoRule">
                  <h-input v-if="type=='add'" v-model="acptRegisterAddForm.billNo" :maxlength="16" readonly icon="android-search" @on-click="acptPickBillWinOpen" placeholder="商票号码为16位数字,第四位为0,第七位为6"></h-input>
                  <h-input v-else v-model="acptRegisterAddForm.billNo" :maxlength="16" readonly placeholder="商票号码为16位数字,第四位为0,第七位为6"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" :required="isRequired">
                  <h-typefield v-model="acptRegisterAddForm.billMoney" :maxlength="20" placeholder="数字，小数位最多2位" readonly
                           @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')"></h-typefield>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
                  <h-date-picker v-model="acptRegisterAddForm.dueDt" type="date" readonly showFormat :editable=false></h-date-picker>
                </h-form-item>
                <!--承兑人/付款人开户行行号-->
                <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drweBankNo')" required class="h-form-long-label">
                  <!--<select-branch v-model="acptRegisterAddForm.drweBankNo" :textShow="'bankNo'" :showMsg="acptRegisterAddForm.drweBankNo"-->
                                 <!--:bankNo.sync="acptRegisterAddForm.drweBankNo"-->
                                 <!--:brchName.sync="acptRegisterAddForm.drweBankName"></select-branch>-->
                  <h-input v-model="acptRegisterAddForm.drweBankNo" placeholder="" readonly></h-input>
                </h-form-item>
                <h-form-item prop="settleType" :label="$t('m.i.billInfo.settleType')" required>
                  <h-select v-model="acptRegisterAddForm.settleType" placeholder="" showTitle>
                    <h-option value="1" key="1">未贴现票据托收结清</h-option>
                    <h-option value="2" key="2">未贴现票据追索结清</h-option>
                    <h-option value="3" key="3">其它</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="paymentDt" :label="$t('m.i.billInfo.paymentDt')" required>
                  <h-date-picker v-model="acptRegisterAddForm.paymentDt" type="date" showFormat :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="hldrName" :label="$t('m.i.billInfo.hldrName')" required>
                  <h-input v-model="acptRegisterAddForm.hldrName" placeholder="" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item prop="hldrAcctNo" :label="$t('m.i.billInfo.hldrAcctNo')" required>
                  <h-input v-model="acptRegisterAddForm.hldrAcctNo" placeholder="" :maxlength="32"></h-input>
                </h-form-item>
                <h-form-item prop="hldrBankNo" :label="$t('m.i.billInfo.hldrBankNo')" required :validRules="bankNoRule">
                  <h-input v-model="acptRegisterAddForm.hldrBankNo" placeholder=""
                           icon="android-search" @on-click="queryHvpsBank('hldr')" type="int" :maxlength="12"></h-input>
                </h-form-item>
                <h-form-item prop="hldrSocCode" :label="$t('m.i.billInfo.hldrSocCode')" class="h-form-long-label">
                  <h-input v-model="acptRegisterAddForm.hldrSocCode" placeholder="" :maxlength="18"></h-input>
                </h-form-item>
                <h-form-item prop="prsttnBankNo" :label="$t('m.i.billInfo.prsttnBankNo')" required :validRules="bankNoRule">
                  <h-input v-model="acptRegisterAddForm.prsttnBankNo" placeholder=""
                           icon="android-search" @on-click="queryHvpsBank('prsttn')" type="int" :maxlength="12"></h-input>
                </h-form-item>
              </h-form>
            </div>
            <div slot="footer">
              <div slot="footer">
                <h-button type="ghost" @click="acptRegisterAddWinClose">{{$t("m.i.common.close")}}</h-button>
                <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
                <h-button type="primary" v-else @click="acptRegisterAddSubmit()">{{$t("m.i.common.commit")}}</h-button>
              </div>
            </div>
          </h-msg-box>
          <acpt-pick-bill :acptPickBillWin="acptPickBillWin" @acptPickBillWinClose="acptPickBillWinClose"
                          :acptPickBillForm="this.acptPickBillForm" @acptPickBillChange="acptPickBillChange">
          </acpt-pick-bill>

        </div>
      </h-col>
    </h-row>

    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <!-- 查看票面信息 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
    <show-hvps-bank :showHvpsBank="showHvpsBank" @showHvpsBankClose="showHvpsBankClose"
                    @showHvpsBankSubmit="showHvpsBankSubmit"></show-hvps-bank>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiAcptSettleRegisterApply",
    components : {
      acptPickBill:()=>import(/* webpackChunkName: "ce/acpt/outerBusiBill/busiPaymentDue/acptPickBill" */`@/views/bizViews/ce/acpt/outerBusiBill/busiPaymentDue/acptPickBill`),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      ShowHvpsBank: () => import(/* webpackChunkName: "shcpe/cpes/hvpsbank/showHvpsBank" */`@/views/bizViews/shcpe/cpes/hvpsbank/showHvpsBank`),
    },
    data() {
      return {
        auditMode:true,
        isRequired: false,
        formItem: {
          billNoLike: '',
          paymentDt: '',
          acptSettleRgstStatusList: 'BTA01,BTA06,BTA09',
          reverseBillNo: ''
        },
        acptRegisterAddForm: {
          billType: 'AC02',
          billNo: '',
          billMoney: '',
          dueDt: '',
          acptBankNo: '',
          settleType:'',
          paymentDt: '',
          hldrName: '',
          hldrAcctNo: '',
          hldrBankNo: '',
          hldrSocCode: '',
          prsttnBankNo: '',
          acptRemark: ''
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
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
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
                      this.showBillInfo(params.row.billId)
                    }
                  }
                }, params.row.billNo)
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
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
             title: this.$t("m.i.billInfo.drweBankNo"),
            key: 'acptBankNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.paymentDt"),
            key: 'paymentDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.paymentDt == null || params.row.paymentDt === ""){
                return "";
              }
              let paymentDt = this.$moment(params.row.paymentDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", paymentDt);
            },
          },
          {
            title: this.$t("m.i.billInfo.hldrName"),
            key: 'hldrName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrAcctNo"),
            key: 'hldrAcctNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrBankNo"),
            key: 'hldrBankNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrSocCode"),
            key: 'hldrSocCode',

            hiddenCol: false
          },
          {
          title: this.$t("m.i.ce.entrustBankNo"),
            key: 'prsttnBankNo',

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.acptSettleRgstStatus"),
            key: 'acptSettleRgstStatus',

            hiddenCol: false,
            render: (h, params) => {
              let key = "";
              let dictValue = getDictValueFromMap(this.dictMap,"AcptRgstStatus",params.row.acptSettleRgstStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);

            },
          },
          /*{
            title: this.$t("m.i.billInfo.dataSource"),
            key: 'isInnerChannel',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isInnerChannel);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },*/
        ],
        currentSelectRow: [],
        submitFlag: false,
        type: "",
        currentSelectList: [],
        acptRegisterAddWin: false,
        dictMap: new Map(),
        billNoRule: [{ test: this.validBillNo, trigger: "blur" }],
        sosCodeRule: [{test: this.validSosCode, trigger:'blur'}],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }],
        acptPickBillWin: false,
        acptPickBillForm: {
          billNo:"",
          isInner:"",
          custAcctNo:"",
          discDt:"",
          billClass:"",
          billType:"",
          clearMark:"",
          banEndrsmtMark:"",
          aoAcctBankNo:"",
          isBillRate:"",
          prodNo:"",
          acptRgstStatusList: ['BTA04','BTA10','BTA11'],
          isSettlePick : '1',
          inOutFlag:'1'
        },
        fileParams: {
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterApply/func_importAcptCorpBillInfoForSettle",  //导入excel数据解析接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterApply/func_submitExcelDataForSettle",  //excel数据导入接口
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "radio",
              title: " ",
              width: 60,
              align: "center",
              hiddenCol: false
            },
            {
              title: 'id',
              key: 'id',

              hiddenCol: true
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
             title: this.$t("m.i.billInfo.settleType"),
              key: "settleType",

              hiddenCol: false,
              render: (h, params) => {
                let list = params.row.settleType;
                if(list == "1"){
                  list = "未贴现票据托收结清";
                } else if(list == "2"){
                  list = "未贴现票据追索结清";
                } else if(list == "3"){
                  list = "其它";
                }
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.billType"),
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
              title: this.$t("m.i.billInfo.billNo"),
              key: 'billNo',
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.billMoney"),
              key: "billMoney",
              hiddenCol: false,
              sortable: true,
              ellipsis: false,
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
              title: this.$t("m.i.billInfo.paymentDt"),
              key: "paymentDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.paymentDt == null ? "" : this.$moment(params.row.paymentDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
             title: this.$t("m.i.ce.entrustBankNo"),
              key: "prsttnBankNo",
              hiddenCol: false,
              ellipsis: false
            },
            {
             title: this.$t("m.i.ce.entrustBankName"),
              key: "prsttnBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.hldrName"),
              key: "hldrName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.hldrAcctNo"),
              key: "hldrAcctNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.hldrSocCode"),
              key: "hldrSocCode",
              hiddenCol: false
            },
            {
             title: this.$t("m.i.ce.acptSettleRgstRemark"),
              key: "acptSettleRgstRemark",
              hiddenCol: false,

            },

          ],
          paramKey:"list"         //后台接收对应key
        },
        importWin: false,
        billId: '',
        showHvpsBankType: "",
        showBillInfoWin: false,
        showHvpsBank: false,
      }
    },
    mounted() {
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgMainStatus,DraftTypeCode,AcptRgstStatus").then(res => {
        this.dictMap = res.get("map");
      });
      this.showButton();
    },
    methods: {
      validBillNo(rule, val, callback) {
        let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
        }
      },

      validSosCode(rule,val,callback){
        let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"))
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },

      //单笔新增
      singleAdd(str) {
        this.type = str;
        this.isRequired = true;
        if (this.type === "modify") {
          if (this.currentSelectList != null && this.currentSelectList.length == 1) {
            this.$nextTick(() => {
              let id = this.currentSelectList[0].id;
              this.acptRegisterAddForm.id = this.currentSelectList[0].id;
              this.acptRegisterAddForm.legalNo = this.currentSelectList[0].legalNo;
              this.acptRegisterAddForm.billId = this.currentSelectList[0].billId;
              this.acptRegisterAddForm.billType = this.currentSelectList[0].billType;
              this.acptRegisterAddForm.billNo = this.currentSelectList[0].billNo;
              this.acptRegisterAddForm.billMoney = this.currentSelectList[0].billMoney;
              this.acptRegisterAddForm.dueDt = this.$moment(this.currentSelectList[0].dueDt, "YYYYMMDD");
              this.acptRegisterAddForm.drweBankNo = this.currentSelectList[0].acptBankNo;
              this.acptRegisterAddForm.settleType = this.currentSelectList[0].settleType;
              this.acptRegisterAddForm.paymentDt = this.$moment(this.currentSelectList[0].paymentDt, "YYYYMMDD");
              this.acptRegisterAddForm.hldrName = this.currentSelectList[0].hldrName;
              this.acptRegisterAddForm.hldrAcctNo = this.currentSelectList[0].hldrAcctNo;
              this.acptRegisterAddForm.hldrBankNo = this.currentSelectList[0].hldrBankNo;
              this.acptRegisterAddForm.hldrSocCode = this.currentSelectList[0].hldrSocCode;
              this.acptRegisterAddForm.prsttnBankNo = this.currentSelectList[0].prsttnBankNo;
            });
          } else if(this.currentSelectList.length > 1){
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            this.addOrEditWin = false;
            return;
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.acptRegisterAddWin = true;
      },
      //修改
      busiModify(str) {
        this.type = str;
        // if(this.currentSelectRow.length === 0) {
        //   this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        //   return;
        // }
      },
      //新增/修改弹窗
      //确定
      acptRegisterAddSubmit() {
        this.$refs["acptRegisterAddForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "modify" ? "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterApply/func_insertOrUpdateSettle"
              : "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterApply/func_insertOrUpdateSettle";
            this.acptRegisterAddForm.dueDt = this.$moment(this.acptRegisterAddForm.dueDt).format('YYYYMMDD')
            this.acptRegisterAddForm.paymentDt = this.$moment(this.acptRegisterAddForm.paymentDt).format('YYYYMMDD')
            this.acptRegisterAddForm.acptBankNo = this.acptRegisterAddForm.drweBankNo;
            this.acptRegisterAddForm.acptSettleRgstStatus = 'BTA01';
            post(this.acptRegisterAddForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.acptRegisterAddWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.acptRegisterAddForm.resetFields();
                  this.currentSelectRow = [];
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
      acptRegisterAddWinClose() {
        this.acptRegisterAddWin = false;
      },
      //删除
      busiDelete() {
        if (this.currentSelectList != null && this.currentSelectList.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterApply/func_downloadForSettle";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //批量导入
      batchImport() {
        this.importWin = true;
      },
      //提交复核
      submitRecheck() {
        if (this.currentSelectList != null && this.currentSelectList.length !== 0) {
          let errorMsg=false;
          let remind=false;
          for (let i=0;i<this.currentSelectList.length;i++){
            if (this.currentSelectList[i].riskStatus === "RS06"){
              errorMsg=true;
            }else if (this.currentSelectRow.riskStatus === "RS01" || this.currentSelectRow.riskStatus === "RS02" ||
              this.currentSelectRow.riskStatus === "RS03"  || this.currentSelectRow.riskStatus === "RS05"){
              remind=true;
            }
          } ;
          if(errorMsg) {
            this.$msgTip.info(this, { info: "存在除权判决的票不允许进行结清登记！" });
            return;
          }
          if(remind) {
            this.$hMsgBox.confirm({
              title: "确认",
              content: "存在风险票据，确定提交复核吗？",
              onOk: () => {
                this.handleRecheck();
              }
            });
          }else {
            this.$hMsgBox.confirm({
              title: "确认",
              content: "确定提交复核吗？",
              onOk: () => {
                this.handleRecheck();
              }
            });
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleRecheck() {
        let list = this.currentSelectList;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        //id: this.currentSelectRow.id
        post({ ids: ids }, "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterApply/func_applAcptCorpSettle").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      addFormReset() {
        this.acptRegisterAddForm.id = "";
        this.acptRegisterAddForm.billId = "";
        this.$refs.acptRegisterAddForm.resetFields();
        this.acptRegisterAddForm.billType = "AC02";
      },

      handleDel() {
        let list = this.currentSelectList;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/ce/acpt/outerBusiBill/busiPaymentDue/busiAcptSettleRegisterApply/func_deleteForSettle").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      acptPickBillWinOpen() {
        this.jumpToBillWin();
        },
      //跳转到挑票界面
      jumpToBillWin(){
        this.acptPickBillWin = true;
      },
      //挑票界面取消按钮
      acptPickBillWinClose() {
        this.acptPickBillWin = false;
      },

      acptPickBillChange(info){
        this.acptRegisterAddForm.id = info.id;
        this.acptRegisterAddForm.billType = info.billType;
        this.acptRegisterAddForm.billNo = info.billNo;
        this.acptRegisterAddForm.billMoney = info.billMoney;
        if(info.dueDt != null && info.dueDt != undefined && info.dueDt != ''){
          this.acptRegisterAddForm.dueDt = this.$moment(info.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
        }
        this.acptRegisterAddForm.drweBankNo = info.drweBankNo;
        this.acptRegisterAddForm.drweBankName = info.drweBankName;
        this.acptPickBillWinClose();
      },
      handlePaymentDtChange(){
        if(this.formItem.paymentDt != null && this.formItem.paymentDt != ''){
          this.formItem.paymentDt = this.$moment(this.formItem.paymentDt).format("YYYYMMDD");
        }
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      showButton() {
        post({ paramKey: "ce.acpt.is_corp_settle_rgst_show_button" }, "/sm/auth/findArraySystemParameter").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData[0] === "0") {
                this.auditMode = false;
              } else {
                this.auditMode = true;
              }
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      queryHvpsBank(type){
        this.showHvpsBankType = type;
        this.showHvpsBank = true;
      },
      showHvpsBankClose(){
        this.showHvpsBank = false;
      },
      showHvpsBankSubmit(info){
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        if(this.showHvpsBankType === "hldr"){
          this.acptRegisterAddForm.hldrBankNo = info.actorBrchBankNo;
        }
        if(this.showHvpsBankType === "prsttn"){
          this.acptRegisterAddForm.prsttnBankNo = info.actorBrchBankNo;
        }
        this.showHvpsBank = false;
      },
    }
  };
</script>

<style scoped>

</style>
