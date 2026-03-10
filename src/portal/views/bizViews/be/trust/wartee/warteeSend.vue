<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!--批次页面-->
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <!-- <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" v-if="this.licenseFlag">
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
                <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" placeholder="">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
                  <h-date-picker type="date" placeholder="" v-model="formItem.applDt" :showFormat="true"
                                 @on-change="handleApplDtChange"></h-date-picker>
                </h-form-item>
                <h-input v-if="false" v-model="formItem.queryType" placeholder="查询方式：1、 申请  2、发送 3、撤回 4、记账"></h-input>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" v-if="this.licenseFlag" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bp/guaranty/apply/func_queryApplyGuarntyBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="billManage()">{{$t('m.i.be.guaranteeDelivery')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击查看弹出窗-->
    <h-msg-box v-model="viewWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="type=='view'">查看票据信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-if="type=='view'" :disabled=true :value="addForm.billType"
                      :title="addForm.billType">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billType">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select v-if="type=='view'" :disabled=true :value="addForm.billClass"
                      :title="addForm.billClass">
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billClass">
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.guarantorName')" prop="custName" :required="isRequired">
            <h-input v-if="type=='view'" :disabled=true :value="addForm.custName"
                     :title="addForm.custName"></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=60 readonly
                     icon="android-search" @on-click="brchCodeWinOpen"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.guarantorBrchCode')" prop="custBrchCode" :required="isRequired">
            <h-input v-if="type=='view'" :disabled=true :value="addForm.custBrchCode"
                     :title="addForm.custBrchCode"></h-input>
            <h-input v-else v-model="addForm.custBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt" :required="isRequired">
            <h-date-picker v-if="type=='view'" :disabled=true :value="addForm.applDt"
                           :title="addForm.applDt" type="date"></h-date-picker>
            <h-date-picker v-else v-model="addForm.applDt" :maxlength=60 type="date"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-if="type=='view'" :disabled=true :value="addForm.custMgrNo"
                     :title="addForm.custMgrNo"></h-input>
            <h-input v-else v-model="addForm.custMgrNo" :maxlength=60 readonly
                     icon="android-search" @on-click="showCustManagerWinOpen"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-form :model="billManageFormItem" :label-width="120" ref="billManageFormItem" cols="2" class="h-form-search">
        <h-input v-if="false" v-model="billManageFormItem.batchId" placeholder="批次id"></h-input>
        <h-input v-if="false" v-model="billManageFormItem.queryType" placeholder="查询方式：1、 申请  2、发送 3、撤回 4、记账"></h-input>
      </h-form>
      <h-datagrid
        :columns="warteeBill.billColumns"
        highlight-row
        url="bp/guaranty/apply/func_queryBatchBillByPage"
        :bindForm="billManageFormItem"
        :autoLoad="false"
        :row-select="true"
        :has-select="false"
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-dropdown placement="bottom-start" trigger="click" @on-click="sendComfirm">
            <h-button type="primary" v-if="authObj.bizSetRoleORight">{{$t('m.i.common.send')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="choice">{{$t('m.i.common.selectSend')}}</h-dropdown-item>
              <h-dropdown-item name="all">{{$t('m.i.common.batchSend')}}</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-dropdown placement="bottom-start" trigger="click" @on-click="resetWartee">
            <h-button type="primary" v-if="authObj.bizSetRoleORight">{{$t('m.i.be.returnBack')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="choice">{{$t('m.i.be.selectReturnBack')}}</h-dropdown-item>
              <h-dropdown-item name="all">{{$t('m.i.be.batchReturnBack')}}</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <!--<h-button type="ghost" @click="closeAddOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="closeAddOrEditWin">{{$t("m.i.common.commit")}}</h-button>-->
      </div>
    </h-msg-box>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "warteeSend",
    components: {
     // ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        formItem: {
          billNo: "",
          billType: "",
          billMoney: "",
          dueDt: "",
          billClass: "",
          queryType: "2",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          funcNo:"PIPB010103",
          authPath: this.$route.path,
        },
        addForm: {
          id: "",
          legalNo: "",
          memberId: "",
          transBrchNo: "",
          brchName: "",
          applBrchCode: "",
          billClass: "ME01",
          billType: "AC01",
          busiBatchNo: "",
          transCtrctNo: "",
          trDir: "",
          custNo: "",
          custName: "",
          custBrchNo: "",
          custBrchCode: "",
          custBankNo: "",
          applDt: "",
          prodNo: "",
          acctTellerNo: "",
          checkTellerNo: "",
          applTellerName: "",
          checkTellerName: "",
          totalAmt: "",
          totalNum: "",
          createTime: "",
          updateTime: "",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
        },
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t('m.i.common.batchNo'),
            key: "batchNo",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillList(params.row);
                  }
                }
              }, params.row.batchNo);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
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
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.guarantorName'),
            key: "custName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.guarantorBrchCode'),
            key: "custBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.sumMoney'),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.totalAmt, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalCount'),
            key: "totalNum",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", applDt);
            }
          }
        ],
        billManageFormItem: {
          billNo: "",
          batchId: "",
          funcNo:"PIPB010103",
          queryType: "2"
        },
        //给按钮增加权限
        authObj: {
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        billTypeList: [],
        cdMediaList: [],
        dictMap: new Map(),
        ifShowMore: false,
        type: "view",
        readonly: true,
        isRequired: false,
        viewWin: false,
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
       // brchNoWin: false,
        warteeBill: {
          billColumns: [
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
              title: this.$t("m.i.billInfo.billOrigin"),
              key: 'billOrigin',
              render: (h, params) => {
                let list =  (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.billPackageNo"),
              key: "billNo",
              ellipsis: false,
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let billNo = params.row.billNo;
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row);
                    }
                  }
                }, billNo);
              }
            },
            //子票区间列
            {
              title: this.$t("m.i.billInfo.billRange"),
              align:'center',
              key:"billRange",
              hiddenCol: false,
              render:(h,params) => {
                return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
              }
            },
            {
              title: this.$t("m.i.billInfo.billPackageMoney"),
              key: "billMoney",
              hiddenCol: false,
              ellipsis: false,
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
              title: this.$t('m.i.billInfo.billType'),
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
              title: this.$t('m.i.billInfo.billClass'),
              key: "billClass",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t('m.i.billInfo.billMoney'),
              key: "billMoney",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                return h('span', formatNumber(params.row.billMoney, 2, ','))
              }
            },
            {
              title: this.$t('m.i.billInfo.dueDt'),
              key: "dueDt",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
                return h("span", dueDt);
              }
            },
            {
              title: this.$t('m.i.billInfo.acptBankName'),
              key: "acptBankName",
              sortable: true,
              hiddenCol: false
            }
          ]
        },
        // 对于单页面，2个窗口的grid, 临时存放父窗口的选择记录
        tmpSelectList: [],
        currentSelectRow: [],
        showBillInfoWin:false,
        billId:"",
        billNo:""
      };
    },
    methods: {
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      onMaximize() {
        this.$refs.datagridbill.$refs.gridContent.handleResize();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.dataSelectReset();
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      handleApplDtChange(value) {
        this.formItem.applDt = value.replace(/-/g, "");
      },
      /* 发送申请确认 */
      sendComfirm(str) {
        let listIds = Array(), warteeBatchId = null;
        if (str === "choice") {
          this.tmpSelectList = this.$refs.datagridbill.selects;
          if (!this.checkMoreOne(this.tmpSelectList)) {
            return;
          }
          for (let i=0;i<this.tmpSelectList.length;i++){
            listIds.push(this.tmpSelectList[i].id);
          }
        } else {
          if (!this.checkGridMoreOne()) {
            return;
          }
        }
        warteeBatchId = this.billManageFormItem.batchId;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要发送吗") + "?",
          onOk: () => {
            this.send(listIds, warteeBatchId);
          }
        });
      },
      /**发送**/
      send(warteeBillIds, warteeBatchId) {
        post({
          listIds: warteeBillIds,
          funcNo:"PIPB010103",
          batchId: warteeBatchId
        }, "bp/guaranty/apply/func_sendGuarantyMsg").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "发送成功" });
              this.$refs.datagridbill.dataChange(1);
              this.$refs.datagrid.dataChange(1);
              this.dataTmpSelectReset();
              this.viewWin = false;
            } else {
              this.$msgTip.error(this, { info: "发送失败：" + res.data.retMsg });
              this.$refs.datagridbill.dataChange(1);
              this.dataTmpSelectReset();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      /* 申请退回 */
      resetWartee(str) {
        let listIds = Array(), warteeBatchId = null;
        if (str === "choice") {
          this.tmpSelectList = this.$refs.datagridbill.selects;
          if (!this.checkMoreOne(this.tmpSelectList)) {
            return;
          }
          for (let i=0;i<this.tmpSelectList.length;i++){
             listIds.push(this.tmpSelectList[i].id);
          }
        } else {
          if (!this.checkGridMoreOne()) {
            return;
          }
        }
        warteeBatchId = this.billManageFormItem.batchId;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("确认要退回吗") + "?",
          onOk: () => {
            this.reset(listIds, warteeBatchId);
          }
        });
      },
      /**退回**/
      reset(warteeBillIds, warteeBatchId) {
        post({
          listIds: warteeBillIds,
          batchId: warteeBatchId,
          funcNo:"PIPB010103"
        }, "bp/guaranty/apply/func_backCommitGuaranty").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "退回成功" });
              this.$refs.datagridbill.dataChange(1);
              this.$refs.datagrid.dataChange(1);
              this.dataTmpSelectReset();
              this.viewWin = false;
            } else {
              this.$msgTip.error(this, { info: "退回失败：" + res.data.retMsg });
              this.$refs.datagridbill.dataChange(1);
              this.dataTmpSelectReset();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      billManage() {
        if (!this.checkOnlyOne(this.currentSelectRow)) {
          return;
        }
        this.viewWin = true;
        this.$nextTick(() => {
          let batchId = this.currentSelectRow.id;
          this.addForm.ownedBrchNo = this.currentSelectRow.transBrchNo;
          this.addForm.ownedBrchName = this.currentSelectRow.brchName;
          this.addForm.licenseFlag = this.licenseFlag;
          this.queryObjById(batchId);
          this.billManageFormItem.batchId = batchId;
          this.$refs.datagridbill.dataChange(1);
        });
      },
      checkOnlyOne(selectList) {
        if (selectList == null || selectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        } else if (selectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return false;
        }
        return true;
      },
      checkMoreOne(selectList) {
        if (selectList == null || selectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return false;
        }
        return true;
      },
      checkGridMoreOne() {
        if (this.$refs.datagridbill == null || this.$refs.datagridbill.total == 0) {
          this.$msgTip.error(this, { info: "该批次下无可操作数据" });
          return false;
        }
        return true;
      },
      getDtoInfoIds(dtoInfoIds) {
        let ids = null;
        if (dtoInfoIds != null && dtoInfoIds.length > 0) {
          for (let i = 0; i < dtoInfoIds.length; i++) {
            if (dtoInfoIds[i].id != null) {
              if (i == 0) {
                ids = dtoInfoIds[i].id;
              } else {
                ids = ids + "," + dtoInfoIds[i].id;
              }
            }
          }
        }
        return ids;
      },
      handleWinClose() {
        this.$refs.addForm.resetFields();
        this.$refs.datagridbill.$refs.gridPage.clearElevator();
        this.dataTmpSelectReset();
      },
      queryObjById(id) {
        post({ batchId: id + "" }, "bp/guaranty/apply/func_getGuarntrBatchById").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.addForm.id = res.data.retData.id;
              this.addForm.billType = res.data.retData.billType;
              this.addForm.billClass = res.data.retData.billClass;
              this.addForm.custName = res.data.retData.custName;
              this.addForm.custBrchCode = res.data.retData.custBrchCode;

              if (res.data.retData.applDt) {
                this.addForm.applDt = this.$moment(res.data.retData.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              } else {
                this.addForm.applDt = null;
              }
              this.addForm.custMgrNo = res.data.retData.custMgrNo;
              this.addForm.brchName = res.data.retData.brchName;
              this.addForm.busiBatchNo = res.data.retData.busiBatchNo;
              this.addForm.memberId = res.data.retData.memberId;
              this.addForm.transCtrctNo = res.data.retData.transCtrctNo;
              this.addForm.custNo = res.data.retData.custNo;
              this.addForm.createTime = res.data.retData.createTime;

            } else {
              this.$refs.datagrid.dataChange(1);
              this.submitMsg = "查询失败";
              this.retMsg = res.data.retMsg;
              this.submitWin = true;
            }
          } else {
            this.submitMsg = "查询失败";
            this.retMsg = this.$t("m.i.common.netError");
            this.submitWin = true;
          }
        });
      },

      //超链接点击批次号弹出票据明细
      showBillList(list) {
        this.addForm.id = list.id;
        this.addForm.billType = list.billType;
        this.addForm.billClass = list.billClass;
        this.addForm.custName = list.custName;
        this.addForm.custBrchCode = list.custBrchCode;
        if (list.applDt) {
          this.addForm.applDt = this.$moment(list.applDt, "YYYYMMDD").format("YYYY-MM-DD");
        } else {
          this.addForm.applDt = null;
        }
        this.addForm.custMgrNo = list.custMgrNo;
        this.addForm.brchName = list.brchName;
        this.addForm.busiBatchNo = list.busiBatchNo;
        this.addForm.memberId = list.memberId;
        this.addForm.transCtrctNo = list.transCtrctNo;
        this.addForm.custNo = list.custNo;
        this.addForm.createTime = list.createTime;
        this.billManageFormItem.batchId = list.id;
        this.$nextTick(() => {
          this.$refs.datagridbill.dataChange(1);
        });
        this.viewWin = true;
      },
      closeAddOrEditWin() {
        this.addOrEditWin = false;
        this.$refs.addForm.resetFields();
      },
      //选择数据,重置
      dataSelectReset() {
        this.currentSelectRow = [];
      },
      //选择数据,重置
      dataTmpSelectReset() {
        this.tmpSelectList = [];
        this.$refs.datagridbill.selectIds = [];
        this.$refs.datagridbill.selects = [];
      },

      //根据弹框所选数据进行赋值
      /*brchNoChange(info) {
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
      },*/
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.cdMediaList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.billOriginList = res.get("BillOrigin");
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
