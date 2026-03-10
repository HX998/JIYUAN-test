<!--保管退票移出-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
                  <h-input v-model="formItem.ownedBrchNames" icon="android-search" @on-click="brchNoWinOpen"
                           readonly clearable @on-clear="clearVal1('license')"
                           :title="formItem.ownedBrchNames"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>


                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="likeBillNo">
                  <h-input v-model="formItem.likeBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <bill-money :formItem="formItem"></bill-money>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
                  <h-date-picker type="daterange" :value="dueDt" format="yyyy-MM-dd" showFormat placeholder=""
                                 @on-change="handleDueDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="dataColumns"
            highlight-row
            url="/be/barter/payment/backTicketShiftOutMain/func_pageQueryBackTicketShiftOutList"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            :hasSelect="false"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="backTicketShow">{{$t('m.i.be.removeReturnBill')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--保管退票弹框-->
    <h-msg-box v-model="refuseBillWin" width="400" class="h-form-search-layer" :maximize="true" @on-close="backTicketClose">
      <p slot="header">
        <span>保管退票申请</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="90" ref="addForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.be.mvType')" prop="mvType" required>
            <h-select v-model="addForm.mvType" placeholder="" @on-change="changeMvType">
              <h-option v-for="item in moveTypeList" :value="item.value" :key="item.value">{{item.label}}</h-option>
            </h-select>
          </h-form-item>
          <!-- <h-form-item :label="$t('m.i.be.moveInBrchName')" prop="rejectRcvBrchName" required class="h-form-long-label">
             <h-input v-if="addForm.mvType === 'VT07'" v-model="addForm.rejectRcvBrchName" readonly icon="android-search" @on-click="queryBrchCodeWinOpen"
                      clearable @on-clear="clearVal('rejectRcvBrchName')" :title="addForm.rejectRcvBrchName"></h-input>
             <h-input v-else v-model="addForm.rejectRcvBrchName" :title="addForm.rejectRcvBrchName" readonly></h-input>
           </h-form-item>-->

          <show-cpes-branch :label="$t('m.i.be.moveInBrchName')" :required="true" class="h-form-long-label"
                            :brchCode.sync="addForm.rejectRcvBrchCode"  :cpesBrchName.sync="addForm.rejectRcvBrchName"
                            :filterable="addForm.mvType === 'VT07'"
                            datagridUrl="/cpes/branch/queryBranchList" prop="rejectRcvBrchName"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item prop="rejectRcvBrchCode" v-show="false">
            <h-input v-model="addForm.rejectRcvBrchCode"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="rejectRemark" class="h-form-height-auto">
            <h-input type="textarea" :rows="3" v-model="addForm.rejectRemark" :maxlength=150></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="backTicketClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="backTicketShiftOutClick">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--<show-cpes-branch :showCpesBranch="brchCodeWin" @showCpesBranchClose="brchCodeWinClose"
                      @showCpesBranchSubmit="brchCodeChange"></show-cpes-branch>-->
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billNo="this.billNo"></bill-info-main>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "backTicketShiftOutMain",
    data() {
      return {
        showBillInfoWin: false,
        billId: "",
        billNo: "",
        dueDt:[],
        formItem: {
          billType: "",
          minBillMoney: "",
          maxBillMoney: "",
          billNo: "",
          likeBillNo: "",
          minDueDt: "",
          maxDueDt: "",
          isHistFlag: "0",
          rejectStatusList: "AL00,AL12", //初始化\发送失败
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path
        },
        billTypeList: [],
        ifShowMore: false,
        payConfirmWin: false,
        currentSelectList: [],
        //设置列表列内容
        dataColumns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
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
            title: this.$t('m.i.billInfo.billMoney'),
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
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
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
            title: this.$t('m.i.be.payConfirmBrchName'),
            key: "applBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.acptBankOrPeopleName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.drweBankName'),
            key: "drweBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        dictMap: new Map(),
        hasSelect: false,
        //brchCodeWin: false,
        refuseBillWin: false,
        addForm: {
          ids:"",
          billIds:"",
          billIdsStr:"",
          mvType:"",
          rejectRcvBrchCode:"",
          rejectRcvBrchName:"",
          rejectRemark:"",
        },
        currentSelect: null,
        moveTypeList: [
          {
            value:"VT05",
            label:"退回瑕疵票据"
          },
          {
            value:"VT06",
            label:"退回线下追偿票据"
          },
          {
            value:"VT07",
            label:"退回公示催告票据"
          }
        ],
        billInfo:null,
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        // brchNoWin: false,
      };
    },
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    methods: {
      /**
       * 列表搜索
       * */
      formSearch() {
        this.currentSelectList = [];
        this.formItem.minDueDt = this.formItem.minDueDt.replace(/-/g, "");
        this.formItem.maxDueDt = this.formItem.maxDueDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
      },
      backTicketShow() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList != null && this.currentSelectList.length > 0) {
          this.addForm.billIdsStr = "";
          for (let selectRow of this.currentSelectList) {
            this.addForm.billIdsStr += selectRow.billId + ",";
          }
          this.addForm.billIdsStr = this.addForm.billIdsStr.substring(0, this.addForm.billIdsStr.length - 1);
          post({ code: this.addForm.billIdsStr },"/pc/btrc/common/getBillInfoAssByIds").then(res => {
            if (res) {
              this.billInfo = res.data.retData;
            }
          });
          console.log(this.billInfo);
          this.refuseBillWin = true;
        }else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
        }

      },
      /*queryBrchCodeWinOpen() {
        this.brchCodeWin = true;
      },*/
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      /*brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.addForm.rejectRcvBrchCode = info.brchCode;
        this.addForm.rejectRcvBrchName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      backTicketClose() {
        this.refuseBillWin = false;
        this.$refs.addForm.resetFields();
        this.addForm.rejectRcvBrchName = "";
        this.addForm.rejectRcvBrchCode = "";
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.dueDt = [];
      },
      /*clearVal(type) {
        if (type == "rejectRcvBrchName") {
          this.addForm.rejectRcvBrchName = "";
          this.addForm.rejectRcvBrchCode = "";
        }
      },*/
      backTicketShiftOutClick() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
//            this.addForm.id = this.currentSelect.id;
            this.addForm.ids = this.$refs.datagrid.selectIds;
            post(this.addForm, "/be/barter/payment/backTicketShiftOutMain/func_backTicketShiftOut").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let return_code = res.data.retCode;
                if (return_code === "000000") {
                  this.$msgTip.success(this);
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(1);
                  this.backTicketClose();
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
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelect = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelect = null;
      },
      formateListData(list) {
        let ids = [];
        for (let i = 0; i < list.length; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      handleDueDtChange(arr) {
        if(arr && arr.length >= 2){
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0],arr[1]];
        }else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }

      },
      changeMvType(mvType){
        this.$refs.addForm.resetValidateField("rejectRcvBrchName");
        if("VT05" === mvType){

          let objs = [];
          if (this.currentSelectList instanceof Array) {
            objs = this.currentSelectList;
          } else {
            objs[0] = this.currentSelectList;
          }
          let applBrchNames = "";
          let applBrchCodes = "";
          for (var i = 0; i < objs.length; i++) {
            applBrchNames += objs[i].applBrchName + ",";
            applBrchCodes += objs[i].applBrchCode + ",";
          }
          this.addForm.rejectRcvBrchName = applBrchNames.substring(0, applBrchNames.length - 1);
          this.addForm.rejectRcvBrchCode = applBrchCodes.substring(0, applBrchCodes.length - 1);

//          this.addForm.rejectRcvBrchName = this.currentSelectList[0].applBrchName;
//          this.addForm.rejectRcvBrchCode = this.currentSelectList[0].applBrchCode;
        }else if("VT06" === mvType){

          let objs = [];
          if (this.billInfo instanceof Array) {
            objs = this.billInfo;
          } else {
            objs[0] = this.billInfo;
          }
          let discBankNames = "";
          let discBrchCodes = "";
          for (var i = 0; i < objs.length; i++) {
            discBankNames += objs[i].discBankName + ",";
            discBrchCodes += objs[i].discBrchCode + ",";
          }
          this.addForm.rejectRcvBrchName = discBankNames.substring(0, discBankNames.length - 1);
          this.addForm.rejectRcvBrchCode = discBrchCodes.substring(0, discBrchCodes.length - 1);

        }else{
          this.addForm.rejectRcvBrchName = "";
          this.addForm.rejectRcvBrchCode = "";
        }
      },
      //票面
      billInfoWinClose(){
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

      /* //根据弹框所选数据进行赋值
       brchNoChange(info) {
         let objs = [];
         if (info instanceof Array) {
           objs = info;
         } else {
           objs[0] = info;
         }
         let brchNos = "";
         let brchNames = "";
         for (var i = 0; i < objs.length; i++) {
           brchNos += objs[i].id + ",";
           brchNames += objs[i].title + ",";
         }
         this.formItem.ownedBrchNos = brchNos.substring(0, brchNos.length - 1);
         this.formItem.ownedBrchNames = brchNames.substring(0, brchNames.length - 1);
         this.brchNoWin = false;
       },
       brchNoWinOpen() {
         this.brchNoWin = true;
       },
       brchNoWinClose() {
         this.brchNoWin = false;
       }*/
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });

      post({ authPath: this.$route.path }, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            } else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    }

  };
</script>

<style scoped>

</style>
