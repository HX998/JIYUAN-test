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
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleDateChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="acptType" :label="$t('m.i.ce.acptType')">
                  <h-select v-model="formItem.acptType" placeholder="">
                    <h-option v-for="item in acptTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
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
                      url="/ce/acpt/paper/register/acptRegisterApplyMain/func_queryPageAcptBatchAndBill"
                      :bindForm="formItem"
                      :auto-load="false"
                      :on-current-change="handleRowClick"
                      :on-current-change-cancel="handleRowClickCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManager()">{{$t('m.i.ce.rgstApply')}}</h-button>
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
                  <h-input v-model="billManagerFormItem.reverseBillNo" placeholder=""></h-input>
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
                                         :batchUrl = "'/ce/acpt/paper/register/acptRegisterApplyMain/func_getAcptBatchByQueryDto'"
                                         :custUrl = "'/bm/cust/corp/getCustCorpByCustNo'"
                                         ref="acptRegisterBatchInfoDetail"></acpt-register-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="billManagerVue" key="3">
          <h-datagrid :columns="billManagerColumns"
                      url="/ce/acpt/paper/register/acptRegisterApplyMain/func_queryPageAcptBill"
                      highlightRow
                      :row-select="true"
                      :has-select="false"
                      :auto-load="false"
                      :bindForm="billManagerFormItem"
                      ref="billManagerDatagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="excelExport" v-if="exportIsShow">{{$t('m.i.ce.agencyExport')}}</h-button>
              <h-button type="primary" @click="submitRecheck" >{{$t('m.i.common.submitCheck')}}</h-button>
              <h-button type="primary" @click="updateRemark">{{$t('m.i.be.editRemark')}}</h-button>
              <h-button type="ghost" @click="returnMain" >{{$t('m.i.common.goBack')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit" :isAllBankAcct=true></show-cust-acct-no>
        <!-- 影像维护 -->
        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :isReadonly="true"
          :showImgPlat="true"
          :isShowReset="false"
          @imageWinClose="uploadImageWinClose"></image-loading>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
        <!--备注-->
        <remark-msg-box :remarkWin="editRemarkWin" title="修改备注信息" :param="param" @remarkWinClose="remarkWinClose" @remarkWinSubmit="remarkWinSubmit"></remark-msg-box>
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
    name: "acptRegisterApplyMain",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      AcptRegisterBatchInfoDetail:()=>import(/* webpackChunkName: "ce/acpt/common/acptRegisterBatchInfoDetail" */`@/views/bizViews/ce/acpt/common/acptRegisterBatchInfoDetail`),
      ImageLoading:()=>import(/* webpackChunkName: "banks/szbank/ce/acpt/paper/components/imageLoading" */`@/views/bizViews/banks/szbank/ce/acpt/paper/components/imageLoading`),
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
                    this.acptProtocalNoMain(params.row.id,params.row.drwrCustNo,params.row.acptType,params.row.ownedBrchNo)
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
          sortable: true,
          hiddenCol: false,
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
          title: this.$t("m.i.common.id"),
          key: 'id',
          hiddenCol: true,
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
           title: this.$t("m.i.common.imgStatus"),
          key: 'imgStatus',
          hiddenCol: false,
          render: (h, params) => {
            let dictValue = getDictValueFromMap(this.dictMap,"ImgMainStatus",params.row.imgStatus);
            return h("span", {
              domProps: {
                title: dictValue
              }
            }, dictValue);
            // if(params.row.imgStatus == "BTL20") {
            //   return h("span", "未上传" );
            // } else {
            //   let list = getDictValueFromMap(this.dictMap,"ImgStatus",params.row.imgStatus);
            //   return h("span",
            //     {
            //       domProps: {
            //         title: list
            //       }
            //     }, list);
            // }
          }
        },
        {
          title: this.$t("m.i.common.acptImg"),
          key: 'acptImage',
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
              }, '维护'),h("span", {
                domProps: {
                  title: "请导入第二联"
                },
                style: {
                  color: '#FF0000'
                },
              }, "【请导入第二联】")
            ]);
          }
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
          title: this.$t("m.i.ce.bailPcet"),
          key: 'bailPcet',
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.bailPcet != null && params.row.bailPcet !== ""){
              let rate = accMul(params.row.bailPcet, 100) + "(%)";
              return h("span", rate);
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
          title: this.$t("m.i.common.returnReason"),
          key: 'acptRgstReturnReason',
          hiddenCol: false,
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
          remitDt: '',
          acptType: '',
          acptStatusList :'1,3',
          billClass: 'ME01',
          curFuncNo :'PICE010602',
          acptRgstStatusList: '1-BTA01,1-BTA06,1-BTA09,1-BTA14',
          isLock : '0',
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",
        },
        billManagerFormItem: {
          billNoLike: '',
          batchId: '',
          billClass: 'ME01',
          acptStatusList :'1,3',
          curFuncNo :'PICE010602',
          acptRgstStatusList: '1-BTA01,1-BTA06,1-BTA09,1-BTA14',
          isLock : '0',
          reverseBillNo: ''
        },
        columns: columns,
        billManagerColumns: billManagerColumns,
        temp: deepClone(columns),
        billTemp: deepClone(billManagerColumns),
        batchInfoCustNo: "",
        batchInfoParams: {
          id: '',
          billClass: 'ME01',
          acptStatusList :'1,3',
          acptRgstStatusList: '1-BTA01,1-BTA06,1-BTA09,1-BTA14',
          curFuncNo :'PICE010602',
          billNoLike: "",
          isLock : '0',
          reverseBillNo: ''
        },
        exportIsShow: false,
        acptTypeList: [],
        dictMap: new Map(),
        batchId: "",
        currentSelectRow: [],
        billManagerCurrentSelectList: [],
        mainVue: true,
        billManagerVue: false,
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        //影像上传
        showUploadImageWin: false,
        imageParams: {
          id: '',
          imgTypeList:[],
          imgType:"IM01",
          imageUrl:"/ce/acpt/paper/register/acptRegisterApplyMain/func_pageQueryAcptImgList", //查询可查看影像url
          imageUploadUrl:"/ce/acpt/paper/register/acptRegisterApplyMain/func_loadImgFileAndSave", //影像上传url
          imageRegisterUrl:"/ce/acpt/paper/register/acptRegisterApplyMain/func_sendAcptImgMsg", //影像登记url
          imageDeleteUrl:"/ce/acpt/paper/register/acptRegisterApplyMain/func_deleteAcptImg", //影像删除url
          imgShowUrl:"/ce/acpt/paper/register/acptRegisterApplyMain/func_showAcptImg?id=", //查看影像url
          listId:"",
          imgBusiType:"acptImage",
          busiType:"RI01",
          billNo:"",
          licenseFlag :this.licenseFlag,
          ownedBrchNo :"",
        },
        //查询保证金账户信息
        dueDeductAcctWin: false,
        editRemarkWin: false,
        showParams: {
          listId:"",
        },
        param: {}
      }
    },
    mounted() {
      getDictListByGroups("AcptType,ImgStatus,ImgMainStatus").then(res => {
        this.acptTypeList = res.get("AcptType");
        this.dictMap = res.get("map");
      });
      getMoreParamValuesByKeys("ce.acpt.rgst_audit_mode").then(res => {
        let idAudit = res['ce.acpt.rgst_audit_mode'];
        if(idAudit == '0'){
          this.formItem.acptRgstStatusList = '1-BTA01,1-BTA05,1-BTA06,1-BTA09,1-BTA14';
          this.billManagerFormItem.acptRgstStatusList = '1-BTA01,1-BTA05,1-BTA06,1-BTA09,1-BTA14';
          this.batchInfoParams.acptRgstStatusList = '1-BTA01,1-BTA05,1-BTA06,1-BTA09,1-BTA14';
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
      handleDateChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$nextTick(() => {
          if(this.$refs.datagrid != undefined) {
            this.$refs.datagrid.dataChange(1);
          }
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
          this.$msgTip.info(this, { info: "请先选择客户！" });
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
        if(this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.currentSelectRow.acptType === "3") {
          this.exportIsShow = true
        }else (
          this.exportIsShow = false
        );
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
      acptProtocalNoMain(str,custNo,acptType,ownedBrchNo) {
        this.batchId = str;
        this.billManagerFormItem.batchId = this.batchId;
        //集中授权参数赋值
        this.billManagerFormItem.licenseFlag=this.licenseFlag;
        this.billManagerFormItem.ownedBrchNo=ownedBrchNo;
        this.batchInfoParams.id = this.batchId;
        this.batchInfoCustNo = custNo;
        if(acptType === "3") {
          this.exportIsShow = true
        }else (
          this.exportIsShow = false
        );
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
      //我行代他行清单导出
      excelExport() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/register/acptRegisterApplyMain/func_rgstBillListExport";
        let form = document.createElement("form");
        form.setAttribute("id","formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        if (this.$refs.billManagerDatagrid.selectIds.length !== 0) {
          form.innerHTML = `<input type="text" name="batchId" value="${this.batchId}"/>
                          <input type="text" name="ids" value="${this.$refs.billManagerDatagrid.selectIds}"/>`
        } else {
          for (let obj in this.billManagerFormItem) {
            if (this.billManagerFormItem.hasOwnProperty(obj)) {
              let input = document.createElement("input");
              input.type = "text";
              input.name = obj;
              input.value = this.billManagerFormItem[obj];
              form.appendChild(input);
            }
          }
        }
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //提交复核
      submitRecheck() {
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
        post({batchId: this.batchId, ids: acptIds,licenseFlag :this.licenseFlag,
          ownedBrchNo :this.currentSelectRow.ownedBrchNo}, "/ce/acpt/paper/register/acptRegisterApplyMain/func_submitRgstApply").then(res => {
          if(res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              if(this.$refs.billManagerDatagrid.total === this.$refs.billManagerDatagrid.selects.length) {
                this.returnMain();
              }else {
                this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
                this.$refs.billManagerDatagrid.selects = [];
                this.$refs.acptRegisterBatchInfoDetail.getBatchInfo();
              }
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.$refs.gridPage.currentPage);
              this.$refs.billManagerDatagrid.selects = [];
              this.$refs.acptRegisterBatchInfoDetail.getBatchInfo();
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
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
      //影像维护弹窗
      openImgWin(str,billNo) {
        this.imageParams.id = str;
        this.imageParams.listId = str;
        this.imageParams.billNo = billNo;
        this.imageParams.imgTypeList.push({key: 'IM01', value: '承兑正面'});
        this.imageParams.ownedBrchNo = this.billManagerFormItem.ownedBrchNo;
        this.imageParams.licenseFlag = this.licenseFlag;
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.imageParams.imgTypeList=[];
        this.billManagerHandleSearch();
      },
      //修改备注弹框
      updateRemark(){
        let list = this.$refs.billManagerDatagrid.selects;
        if (list.length > 0) {
          let acptIds = "";
          for(let i=0; i<list.length; i++) {
            acptIds += list[i].id;
            if(i < list.length - 1) {
              acptIds += ",";
            }
          }
          this.param.ids = acptIds;
          this.editRemarkWin = true;
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //关闭备注弹框
      remarkWinClose(){
        this.editRemarkWin = false;
      },
      //修改备注
      remarkWinSubmit(param, remark){
        post({ ids: param.ids,rgstRemark:remark,licenseFlag :this.licenseFlag,
          ownedBrchNo :this.currentSelectRow.ownedBrchNo }, "/ce/acpt/paper/register/acptRegisterApplyMain/func_updatePaperAcptBillRemark").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.remarkWinClose();
              this.$msgTip.success(this, { info: this.$t("m.i.common.modifySuccess") });
              this.$refs.billManagerDatagrid.selects = [];
              this.$refs.billManagerDatagrid.selectIds = [];
              this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
            } else {
              this.$refs.billManagerDatagrid.dataChange(this.$refs.billManagerDatagrid.pageInfo.pageNo);
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
    }
  };
</script>

