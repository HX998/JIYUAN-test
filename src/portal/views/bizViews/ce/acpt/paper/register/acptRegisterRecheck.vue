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
                <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                             :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
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
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleRemitDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')">
                  <h-select v-model="formItem.acptType" placeholder="">
                    <h-option v-for="item in acptTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="batchNoLike" :label="$t('m.i.common.batchNo')">
                  <h-input v-model="formItem.batchNoLike" placeholder=""></h-input>
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
                      url="/ce/acpt/paper/register/acptRegisterRecheck/func_queryPageAcptBatchAndBill"
                      :auto-load="false"
                      :bindForm="formItem"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t('m.i.common.registerCheck')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 子页面 -->
        <div v-if="billManagerVue" key="2">
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="billManagerFormItem" :label-width="90" ref="billManagerFormItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="billManagerFormItem.reverseBillNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="billManagerHandleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="billManagerResetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
        </div>
        <acpt-register-batch-info-detail :is-show="billManagerVue" :params="batchInfoParams" :custNo="batchInfoCustNo"
                                         :batchUrl = "'/ce/acpt/paper/register/acptRegisterRecheck/func_getAcptBatchByQueryDto'"
                                         :custUrl = "'/bm/cust/corp/getCustCorpByCustNo'"
                                         ref="acptRegisterBatchInfoDetail"></acpt-register-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/paper/register/acptRegisterRecheck/func_queryPageAcptBill"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckPass" >{{$t('m.i.common.pass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.common.back')}}</h-button>
              <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>
        <!-- 退回原因录入弹窗 -->
        <h-msg-box v-model="recheckBackWin" width="400" @on-close="recheckBackWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>退回原因录入</span>
          </p>
          <div>
            <h-form :model="recheckBackForm" :label-width="115" ref="recheckBackForm" cols="1" class="h-form-search">
              <h-form-item prop="acptRgstReturnReason" :label="$t('m.i.ce.paymentReturnReason')" :required="true">
                <h-input v-model="recheckBackForm.acptRgstReturnReason" placeholder="" type="textarea" :rows="2" :canResize="false" :maxlength="100"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="recheckBackWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="recheckBackSubmit()">{{$t('m.i.common.back')}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
        <!-- 影像维护 -->
        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :authObj="authObject"
          :isReadonly="true"
          :showImgPlat="true"
          :isShowReset="false"
          @imageWinClose="uploadImageWinClose"></image-loading>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {
  accMul,
  formatNumber,
  getDictListByGroups,
  getDictValueFromMap,
  getMoreParamValuesByKeys,
  post
} from "@/api/bizApi/commonUtil";
import {deepClone} from "@/utils/index";

export default {
    name: "acptRegisterRecheck",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      AcptRegisterBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/acptRegisterBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/acptRegisterBatchInfoDetail`)
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
          title: this.$t("m.i.common.ownedBrchNo"),
          key: "ownedBrchName",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.batchNo"),
          key: 'batchNo',
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
                    this.batchNoMain(params.row.id, params.row.drwrCustNo,params.row.ownedBrchNo)
                  }
                }
              }, params.row.batchNo)
            ]);
          }
        },
        {
          title: this.$t("m.i.billInfo.acptProtocalNo"),
          key: 'acptProtocalNo',
          hiddenCol: false,
          sortable: true,
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
          type: 'selection',
          key: 'multiSelect',
          width: 60,
          hiddenCol: false,
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
            let billNo = "";
            if (params.row.billNo === null || params.row.billNo === "") {
              billNo = "查看票面";
            }else {
              billNo = params.row.billNo;
            }
            return h("a", {
              on: {
                click: () => {
                  this.showBillInfo(params.row.billId);
                }
              }
            }, billNo);
          }
        },
        {
          title: this.$t("m.i.ce.promNoteNo"),
          key: 'promNoteNo',
          hiddenCol: false,
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
          sortable: true,
          hiddenCol: false,
        },
        {
           title: this.$t("m.i.billInfo.acptName"),
          key: 'acptName',
          hiddenCol: false,
          sortable: true,
        },
        {
          title: this.$t("m.i.ce.bailPcetStr"),
          key: 'bailPcet',
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.bailPcet != null && params.row.bailPcet !== ""){
              let rate = accMul(params.row.bailPcet, 100);
              let rateFormat = formatNumber(rate, 2, ',');
              return h("span", rateFormat);
            }
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
          title: this.$t("m.i.ce.guarntrNo"),
          key: "guarntrNo",
          hiddenCol: false,
          render: (h, params) => {
            return h("a", {
              props: {
                type: 'primary',
                size: 'small'
              },
              style: {
                marginRight: '5px'
              },
              on: {
                click: () => {
                  this.showDueDeductAcct(params.row.id);
                }
              }
            }, '查看');
          }
        },
        {
          title: this.$t("m.i.ce.drwrAcctNo"),
          key: 'drwrAcctNo',
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.common.showImg"),
          key: "seeImage",
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
                    this.openImgWin(params.row.id,params.row.billNo)
                  }
                }
              }, '查看')
            ]);
          }
        },
        {
          title: this.$t("m.i.common.remark"),
          key: 'rgstRemark',
          hiddenCol: false,
        },
      ];
      return {
        showBillInfoWin: false,
        billId: "",
        licenseFlag:false,
        authPath: this.$route.path ,
        formItem: {
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          acptProtocalNoLike: '',
          batchNoLike:'',
          remitDt: '',
          acptType: '',
          billClass: 'ME01',
          applTellerNoNotEqual : this.$store.getters.userInfo.userNo,
          auditModeKey : 'ce.acpt.is_rgst_check_exclude',
          curFuncNo :'PICE010603',
          acptRgstStatusList: '1-BTA02,1-BTA05',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          billNoLike: '',
          batchId: '',
          billClass: 'ME01',
          curFuncNo :'PICE010603',
          acptRgstStatusList: '1-BTA02,1-BTA05',
          applTellerNoNotEqual : this.$store.getters.userInfo.userNo,
          auditModeKey : 'ce.acpt.is_rgst_check_exclude',
          reverseBillNo:''
        },
        batchInfoCustNo: "",
        batchInfoParams: {
          id: '',
          billClass: 'ME01',
          curFuncNo :'PICE010603',
          acptRgstStatusList: '1-BTA02,1-BTA05',
          billNoLike: "",
          auditModeKey : 'ce.acpt.is_rgst_check_exclude',
          reverseBillNo: ''
        },
        recheckBackForm: {
          acptRgstReturnReason: ''
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        acptTypeList: [],
        dictMap: new Map(),
        batchId: "",
        currentSelectRow: [],
        billManagerCurrentSelectList: [],
        mainVue: true,
        billManagerVue: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        recheckBackWin: false,
        submitFlag: false,
        ifShowMore: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showParams: {
          listId:"",
        },
        showUploadImageWin: false,
        imageParams: {
          id: '',
          imgTypeList:[],
          imgType:"IM01",
          imageUrl:"/ce/acpt/paper/register/acptRegisterApplyMain/func_pageQueryAcptImgList", //查询可查看影像url
          imgShowUrl:"/ce/acpt/paper/register/acptRegisterApplyMain/func_showAcptImg?id=", //查看影像url
          listId:"",
          imgBusiType:"acptImage",
          busiType:"RI01",
          billNo:""
        },
        authObject: {
          imageAdd: false,       //影像新增
          imageRegister: false,  //登记
          imageDelete: false     //删除
        },
      }
    },
    mounted() {
      getDictListByGroups("AcptType").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.dictMap = res.get("map");
      });
      getMoreParamValuesByKeys("ce.acpt.rgst_audit_mode").then(res => {
        let idAudit = res['ce.acpt.rgst_audit_mode'];
        if(idAudit == '0'){
          this.formItem.acptRgstStatusList = '1-BTA02';
          this.billManagerFormItem.acptRgstStatusList = '1-BTA02';
          this.batchInfoParams.acptRgstStatusList = '1-BTA02';
        }
        this.handleSearch();
      });
      //集中操作授权
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let columns=[]
            if (this.licenseFlag) {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns=this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.temp=deepClone(columns)
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {

      //影像维护
      openImgWin(str,billNo) {
        this.imageParams.id = str;
        this.imageParams.listId = str;
        this.imageParams.billNo = billNo;
        this.imageParams.imgTypeList.push({key: 'IM01', value: '承兑正面'});
        // this.queryType = 'readonly';
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList = [];
        this.billManagerHandleSearch();
      },
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },

      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
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
      handleRemitDtChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
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
          this.formItem.acptType = '';
          this.formItem.ownedBrchNames = "";
          this.formItem.ownedBrchNos = "";
          this.formItem.batchNoLike = "";
        });
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleRowClickCancel() {
        this.currentSelectRow = [];
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

      //票据管理
      billManager() {
        if(this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchId = this.currentSelectRow.id;
        this.billManagerFormItem.batchId = this.batchId;
        //集中授权参数赋值
        this.billManagerFormItem.licenseFlag=this.licenseFlag;
        this.billManagerFormItem.ownedBrchNo=this.currentSelectRow.ownedBrchNo;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoCustNo = this.currentSelectRow.drwrCustNo;
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
      batchNoMain(str,custNo,ownedBrchNo) {
        this.batchId = str;
        this.billManagerFormItem.batchId = this.batchId;
        //集中授权参数赋值
        this.billManagerFormItem.licenseFlag=this.licenseFlag;
        this.billManagerFormItem.ownedBrchNo=ownedBrchNo;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoCustNo = custNo;
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
        this.$refs.billManagerDatagrid.selects = [];
        this.batchInfoParams.billNoLike = this.billManagerFormItem.billNoLike;
        this.batchInfoParams.reverseBillNo = this.billManagerFormItem.reverseBillNo;
        this.$nextTick(() => {
          this.$refs.billManagerDatagrid.dataChange(1);
          this.$refs.acptRegisterBatchInfoDetail.getBatchInfo();
        })
      },
      //重置表单查询结果
      billManagerResetSearch() {
        this.$nextTick(() => {
          this.billManagerFormItem.billNoLike = '';
          this.billManagerFormItem.reverseBillNo = '';
          this.batchInfoParams.reverseBillNo = '';
        })
      },
      //通过
      recheckPass() {
        if(this.$refs.billManagerDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let acptIds = "";
        let list = this.$refs.billManagerDatagrid.selects;
        for(let i=0; i<list.length; i++) {
          acptIds += list[i].id;
          if(i < list.length - 1) {
            acptIds += ",";
          }
        }
        post({batchId: this.batchId, ids: acptIds, billOperType: '1',licenseFlag :this.licenseFlag,
          ownedBrchNo :this.currentSelectRow.ownedBrchNo}, "/ce/acpt/paper/register/acptRegisterRecheck/func_submitRgstCheck").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              if(this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                this.returnMain();
              }else {
                this.refreshBillManagerDatagrid();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
              this.refreshBillManagerDatagrid();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      refreshBillManagerDatagrid(){
        this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
        this.$refs.billManagerDatagrid.selects = [];
        this.$refs.acptRegisterBatchInfoDetail.getBatchInfo();
      },
      //退回
      recheckBack() {
        if(this.$refs.billManagerDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.recheckBackWin = true;
      },
      //退回确认
      recheckBackSubmit() {
        let list = this.$refs.billManagerDatagrid.selects;
        let acptIds = "";
        for(let i=0; i<list.length; i++) {
          acptIds += list[i].id;
          if(i<list.length - 1) {
            acptIds += ",";
          }
        }
        this.$refs["recheckBackForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post({
              batchId: this.batchId,
              ids: acptIds,
              billOperType: '2',
              acptRgstReturnReason: this.recheckBackForm.acptRgstReturnReason,
              licenseFlag :this.licenseFlag,
              ownedBrchNo :this.currentSelectRow.ownedBrchNo
            }, "/ce/acpt/paper/register/acptRegisterRecheck/func_submitRgstCheck").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.recheckBackWinClose();
                  if(this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                    this.returnMain();
                  }else {
                    this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                    this.$refs.billManagerDatagrid.selects = [];
                    this.$refs.acptRegisterBatchInfoDetail.getBatchInfo();
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              }
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        })
      },
      //退回录入界面关闭
      recheckBackWinClose() {
        this.recheckBackWin = false;
        this.$refs.recheckBackForm.resetFields();
      },
      //返回主页面
      returnMain() {
        this.mainVue = true;
        this.billManagerVue = false;
        this.currentSelectRow = [];
        this.$refs.billManagerDatagrid.selects = [];
        this.billManagerResetSearch();
        this.$nextTick(() => {
          this.columns = deepClone(this.temp);
          this.$refs.datagrid.createShowCol(this.temp);
          this.$refs.datagrid.dataChange(1);
        });
      },
    }
  };
</script>

<style scoped>

</style>
