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
                <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="billClass" :label="$t('m.i.billInfo.billClass')">
                  <h-select v-model="formItem.billClass" placeholder="" showTitle>
                    <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')">
                  <h-select v-model="formItem.billType" placeholder="" showTitle>
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.recName')" prop="recName">
                  <h-input v-model="formItem.recName" placeholder="" :maxlength="255"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                  <h-date-picker :value="dueDate" format="yyyy-MM-dd" type="daterange" showFormat
                                 :editable=false placeholder="" @on-change="handleDueDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney">
                  <h-row>
                    <h-col span="11">
                      <h-form-item prop="minBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                    <h-col span="2" style="text-align: center">-</h-col>
                    <h-col span="11">
                      <h-form-item prop="maxBillMoney" style="width:100%">
                        <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                                     bigTips></h-typefield>
                      </h-form-item>
                    </h-col>
                  </h-row>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.payDate')" prop="payDate">
                  <h-date-picker :value="payDate" format="yyyy-MM-dd" type="daterange" showFormat
                                 :editable=false placeholder="" @on-change="handlePayDateChange"></h-date-picker>
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
            :columns="columns"
            url="be/trust/recourse/recourseClearBill/func_querySubmitRecourseClearBillByPage"
            :bindForm="formItem"
            :hasSelect="false" rowSelect
            :notSetWidth="true"
            showListCkeckBox
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" v-if="authObj.bizSetRoleAdd">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" v-if="authObj.bizSetRoleDelete">
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="submitToReview()">{{$t('m.i.be.submission')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增追偿结清登记</span>
        <span v-if="type=='modify'">修改追偿结清登记</span>
        <span v-if="type=='view'">{{$t("m.i.shcpe.viewRoleInfo")}}</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.be.rgstApplDt')" prop="rgstApplDt" placeholder=""  :required="isRequired">
            <h-date-picker v-if="type=='view'" readonly :value="addForm.rgstApplDt" placeholder="" showFormat :title="addForm.rgstApplDt"
                           type="date"></h-date-picker>
            <h-date-picker v-else v-model="addForm.rgstApplDt" :options="options1" showFormat type="date"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :required="isRequired">
            <h-input v-model="addForm.billNo" icon="android-search" @on-click="pickRecouBill()" readonly
                     v-if="type=='add'" clearable @on-clear="clearVal('billNo')"></h-input>
            <h-input v-model="addForm.billNo" readonly v-if="type=='modify'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" :required="isRequired">
            <h-typefield v-if="type=='add'" v-model="addForm.billMoney" readonly integerNum="10" placeholder="" type="money"
                         bigTips></h-typefield>
            <h-input v-model="addForm.billMoney" :maxlength=60 readonly v-if="type=='modify'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required readonly>
            <h-select v-model="addForm.billType" placeholder="" readonly showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required>
            <h-select v-model="addForm.billClass" placeholder="" readonly showTitle>
              <h-option v-for="item in billClassList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt" :required="isRequired">
            <h-input v-model="addForm.dueDt" :maxlength=60 readonly v-if="type=='add'"></h-input>
            <h-input v-model="addForm.dueDt" :maxlength=60 readonly v-if="type=='modify'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.payDate')" prop="payDt" :required="isRequired">
            <h-date-picker type="date" v-model="addForm.payDt" placeholder=""
                           @on-change="handlerPayDtChange"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.payBrchCode')" prop="rgstBrchCode" :required="isRequired">
            <h-input v-model="addForm.rgstBrchCode" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.toRecName')" prop="toRecName" :required="isRequired">
            <h-input v-model="addForm.toRecName" :maxlength=60 readonly v-if="type=='add'"></h-input>
            <h-input v-model="addForm.toRecName" :maxlength=60 readonly v-if="type=='modify'" ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.recName')" prop="recName" :required="isRequired">
            <h-input v-model="addForm.recName" :maxlength=60></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.recAcctNo')" prop="recAcctNo">
            <h-input v-model="addForm.recAcctNo" :maxlength=32></h-input>
          </h-form-item>
          <!--<h-form-item prop="branchName" :label="$t('m.i.be.recBankNo')">
            <h-input v-model="addForm.recBankName" readonly icon="android-search"
                     @on-click="queryBranchCode()" clearable
                     @on-clear="clearVal('recBankName')"></h-input>
          </h-form-item>-->

          <show-cpes-branch :label="$t('m.i.be.recBankNo')"
                            :bankNo.sync="addForm.recBankNo"  :cpesBrchName.sync="addForm.recBankName"
                            :isQueryByBankNo="true"    :msgBoxWin="addOrEditWin"
                            datagridUrl="/cpes/branch/queryBranchList" prop="branchName"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.be.recSocCode')" prop="recSocCode" :required="isRequired" :validRules="socCodeRule"
                       class="h-form-long-label">
            <h-input v-model="addForm.recSocCode" :maxlength=60></h-input>
          </h-form-item>
          <h-form-item prop="recBankNo" v-show="false">
            <h-input v-model="addForm.recBankNo"></h-input>
          </h-form-item>

          <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchName" :required="isRequired"  v-if="this.licenseFlag">
            <h-input v-if="type=='modify'" readonly :value="addForm.ownedBrchName" :title="addForm.ownedBrchName"></h-input>
            <h-input v-else v-model="addForm.ownedBrchName" :maxlength=60 readonly
                     icon="android-search" @on-click="brchNoWinOpen1"></h-input>
          </h-form-item>-->

          <show-branch v-model="addForm.ownedBrchNo"  :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchName" :required="isRequired" v-if="this.licenseFlag"
                       :filterable="type=='add'"     :showCheckBox="false"   :msgBoxWin="addOrEditWin"  @brchNoChange="licenseBrchNoChange($event)"    :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName"
                       :params="{authPath:this.$route.path}"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                       queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>
          <h-form-item :label="$t('m.i.be.recourseClearRemark')" prop="recourseClearRemark" class="h-form-height-auto">
            <h-input type="textarea" :autosize="{minRows: 1,maxRows: 3}" v-model="addForm.recourseClearRemark"
                     :maxlength=150 :lengthByByte="false" :canResize="false"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="closeAddOrEditWin">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--挑票弹出框-->
    <h-msg-box v-model="pickRecouBillWin" width="1000" :maximize="true" @on-maximize="onMaximize"
               class="h-form-search-layer" >
      <p slot="header">
        <span>{{"挑票"}}</span>
      </p>
      <!--查询表单-->
      <div class="h-form-overhd">
        <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="3" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="traderId">
            <h-input v-model="billFormItem.billNo" :maxlength="30"></h-input>
          </h-form-item>
          <h-form-item class="h-form-operate two-form">
            <h-button type="primary" @click="formSearchBill()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchBillReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        highlight-row
        url="be/trust/recourse/recourseClearBill/func_queryRecClearPickBill"
        :columns="billColumns"
        :bindForm="billFormItem"
        :onCurrentChange="handlelRowClickBill"
        :onCurrentChangeCancel="handlelRowClickBillCancel"
        :onRowDbClick="doubleHandleClick"
        :autoLoad="false"
        ref="datagridbill">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="billClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitFormBill">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--<show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>-->
    <bill-info-main
      @billInfoWinClose="billInfoWinClose"
      :showBillInfoWin="showBillInfoWin"
      :billId="billId"
      :billNo="billNo"
      :ownedBrchNo="addForm.ownedBrchNo"
      :licenseFlag="this.licenseFlag"
    ></bill-info-main>

   <!-- <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>
    <show-license-branch :showBranchWin="brchNoWin1" title="机构查询" @brchNoChange="licenseBrchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose1" :ifcheck="false"
                         :checkStrictly="true"></show-license-branch>-->

  </div>
</template>

<script>
  import { post, on, off,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "recourseClearBill",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      let _this = this;
      return {
        options1: {
          disabledDate (date) {
            return  _this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") > date && date.valueOf() ;
          }
        },
        columns: [
          {
            type: "selection",
            width: 50,
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
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId, params.row.billNo);
                  }
                }
              }, params.row.billNo);
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
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = params.row.dueDt == null ? "" :this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.be.rgstApplDt'),
            key: "rgstApplDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let rgstApplDt = params.row.rgstApplDt == null ? "" :this.$moment(params.row.rgstApplDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", rgstApplDt);
            }
          },
          {
            title: this.$t('m.i.be.payDate'),
            key: "payDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let payDt = params.row.payDt == null ? "" :this.$moment(params.row.payDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", payDt);
            }
          },
          {
            title: this.$t('m.i.be.currentPayBrchCode'),
            key: "currentPayBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.recName'),
            key: "recName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.recAcctNo'),
            key: "recAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "recourseClearRemark",
            hiddenCol: false
          }
        ],
        billColumns: [
          {
            type: "radio",
            width: 60,
            align: "center",
            title: " "
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billNo'),
            key: "billNo",
            hiddenCol: false
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
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dueDt = params.row.dueDt == null ? "" :this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.be.rgstApplDt'),
            key: "rgstApplDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let rgstApplDt = params.row.rgstApplDt == null ? "" :this.$moment(params.row.rgstApplDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", rgstApplDt);
            }
          },
          {
            title: this.$t('m.i.be.nowPayBrchCode'),
            key: "currentPayBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.recName'),
            key: "recName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.recAcctNo'),
            key: "recAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.payDt'),
            key: "payDt",
            hiddenCol: false,
            render: (h, params) => {
              let payDt = params.row.payDt == null ? "" :this.$moment(params.row.payDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", payDt);
            }
          }
        ],
        dueDate:[],
        payDate:[],
        formItem: {
          billNo: "",
          billClass: "",
          billType: "",
          dueDate: "",
          minDueDt: "",
          maxDueDt: "",
          payDate: "",
          minPayDt: "",
          maxPayDt: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
        },
        billFormItem: {
          billNo: ""
        },
        addForm: {
          id: "",
          legalNo: "",
          memberId: "",
          brchNo: this.$store.getters.userInfo.brchNo,
          brchName: "",
          billId: "",
          billNo: "",
          billMoney: "",
          billType: "",
          billClass: "",
          dueDt: "",
          billStatus: "",
          msgId: "",
          rgstBrchCode: this.$store.getters.userInfo.cepsBrchCode,
          rgstApplDt: "",
          recourseClearRemark: "",
          currentPayBrchCode: "",
          recName: "",
          toRecName: this.$store.getters.userInfo.brchName,
          recAcctNo: "",
          recBankNo: "",
          recBankName: "",
          recSocCode: "",
          applTellerNo: "",
          checkTellerNo: "",
          acctTellerNo: "",
          acctDt: "",
          acctStatus: "",
          payDt: "",
          createTime: "",
          updateTime: "",
          reserve1: "",
          reserve2: "",
          reserve3: "",
          ownedBrchNo:this.$store.getters.userInfo.brchNo,
          ownedBrchName:this.$store.getters.userInfo.brchName,
          licenseFlag:this.licenseFlag,
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
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        type: null,
        readonly: false,
        isRequired: true,
        submitFlag: false,
        currentSelectRow: [],
        currentSelectRowBill: [],
        billClassList: [],
        billTypeList: [],
        dictMap: new Map(),
        ifShowMore: false,
        //showCpesBranch: false,
        pickRecouBillWin: false,
        showBillInfoWin: false,
        billNo: "",
        billId: "",
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        //brchNoWin1:false,
        socCodeRule: [{ test: /^[0-9A-Z]{18}$/, trigger: "blur", message: "统一社会信用代码由18位数字或大写字母组成" }]
      };
    },
    watch: {
      pickRecouBillWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.brchCode = this.brchCode;
            this.formItem = Object.assign(this.formItem, this.params);
            this.formSearchBill();
          });
        }
      }
    },
    methods: {
      showBillInfo(billId, billNo) {
        this.billId = billId;
        this.billNo = billNo;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },
      pickRecouBill() {
        this.pickRecouBillWin = true;
      },
      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.ownedBrchNo=this.$store.getters.userInfo.brchNo;
          this.addForm.ownedBrchName=this.$store.getters.userInfo.brchName;
          this.addForm.id = "";
          this.addForm.recBankName = "";
          this.addForm.recBankNo = "";
          this.addForm.rgstApplDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        });
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.licenseFlag = this.licenseFlag;
        if (this.type == "modify" || this.type == "view") {
          let list = this.$refs.datagrid.selects;
          if (list != null && list.length == 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          if (list.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.$nextTick(() => {
            this.currentSelectRow = list[0];
            this.$refs.addForm.resetFields();
            this.addForm.recBankName = "";
            this.addForm.id = this.currentSelectRow.id;
            this.addForm.legalNo = this.currentSelectRow.legalNo;
            this.addForm.memberId = this.currentSelectRow.memberId;
            this.addForm.brchNo = this.currentSelectRow.brchNo;
            this.addForm.brchName = this.currentSelectRow.brchName;
            this.addForm.billId = this.currentSelectRow.billId;
            this.addForm.billNo = this.currentSelectRow.billNo;
            this.addForm.billMoney = this.currentSelectRow.billMoney;
            this.addForm.billType = this.currentSelectRow.billType;
            this.addForm.billClass = this.currentSelectRow.billClass;
            if (this.currentSelectRow.dueDt) {
              this.addForm.dueDt = this.$moment(this.currentSelectRow.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            this.addForm.billStatus = this.currentSelectRow.billStatus;
            this.addForm.msgId = this.currentSelectRow.msgId;
            this.addForm.rgstBrchCode = this.currentSelectRow.rgstBrchCode;
            this.addForm.recourseClearRemark = this.currentSelectRow.recourseClearRemark;
            this.addForm.currentPayBrchCode = this.currentSelectRow.currentPayBrchCode;
            this.addForm.recName = this.currentSelectRow.recName;
            this.addForm.recAcctNo = this.currentSelectRow.recAcctNo;
            this.addForm.recBankNo = this.currentSelectRow.recBankNo;
            this.addForm.recBankName = this.currentSelectRow.recBankName;
            this.addForm.recSocCode = this.currentSelectRow.recSocCode;
            this.addForm.applTellerNo = this.currentSelectRow.applTellerNo;
            this.addForm.checkTellerNo = this.currentSelectRow.checkTellerNo;
            this.addForm.acctTellerNo = this.currentSelectRow.acctTellerNo;
            this.addForm.acctDt = this.currentSelectRow.acctDt;
            this.addForm.acctStatus = this.currentSelectRow.acctStatus;
            this.addForm.createTime = this.currentSelectRow.createTime;
            this.addForm.updateTime = this.currentSelectRow.updateTime;
            this.addForm.reserve1 = this.currentSelectRow.reserve1;
            this.addForm.reserve2 = this.currentSelectRow.reserve2;
            this.addForm.reserve3 = this.currentSelectRow.reserve3;
            this.addForm.rgstApplDt = this.currentSelectRow.rgstApplDt;
            if (this.currentSelectRow.rgstApplDt) {
              this.addForm.rgstApplDt = this.$moment(this.currentSelectRow.rgstApplDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            this.addForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
            this.addForm.ownedBrchName = this.currentSelectRow.ownedBrchName;
            if (this.currentSelectRow.payDt) {
              this.addForm.payDt = this.$moment(this.currentSelectRow.payDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            if (this.type == "modify") {
              this.readonly = true;
            }
            if (this.type == "view") {
              this.isRequired = false;
            }
          });
        } else {
          this.addFormReset();
        }
        this.addOrEditWin = true;
      },
      handlelRowClickBill(currentRow, oldCurrentRow, _index) {
        this.currentSelectRowBill = currentRow;
      },
      handlelRowClickBillCancel(currentRow, oldCurrentRow, _index) {
        this.currentSelectRowBill = null;
      },
      doubleHandleClick(arr) {
        this.trunBill(arr);
        this.pickRecouBillWin = false;
        this.currentSelectRowBill = null;
        this.billFormItem.billNo = "";
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagridbill.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearchBill() {
        this.billFormItem.ownedBrchNo = this.addForm.ownedBrchNo;
        this.billFormItem.licenseFlag = this.licenseFlag;
        this.$refs.datagridbill.dataChange(1);
      },
      formSearchBillReset() {
        this.billFormItem.billNo = "";
      },
      /*queryBranchCode() {
        this.showCpesBranch = true;
      },*/
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.addForm.recBankNo = info.transBrchBankNo;
        this.addForm.recBankName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/
      submitFormBill() {
        if (this.currentSelectRowBill != null) {
          this.trunBill(this.currentSelectRowBill);
          this.pickRecouBillWin = false;
          this.currentSelectRowBill = null;
          this.billFormItem.billNo = "";
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.currentSelectRowBill = null;
        }
      },
      trunBill(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
        } else {
          this.addForm.id = info.id;
          this.addForm.legalNo = info.legalNo;
          this.addForm.memberId = info.memberId;
          this.addForm.brchNo = info.brchNo;
          this.addForm.brchName = info.brchName;
          this.addForm.billId = info.billId;
          this.addForm.billNo = info.billNo;
          this.addForm.billMoney = info.billMoney;
          this.addForm.billType = info.billType;
          this.addForm.billClass = info.billClass;
          if (this.addForm.rgstApplDt) {
            this.addForm.rgstApplDt = this.$moment(info.rgstApplDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.rgstApplDt = info.rgstApplDt;
          }
          if (info.dueDt) {
            this.addForm.dueDt = this.$moment(info.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.dueDt = info.dueDt;
          }
          this.addForm.recRepDt = info.recRepDt;
          this.addForm.recPayDt = info.recPayDt;
          this.addForm.acctTellerNo = info.acctTellerNo;
          this.addForm.applTellerNo = info.applTellerNo;
          this.addForm.checkTellerNo = info.checkTellerNo;
          this.addForm.acctDt = info.acctDt;
          this.addForm.billStatus = info.billStatus;
          this.addForm.offLineRecType = "OLRT01";
          this.addForm.recourseRemark = info.recourseRemark;
          this.addForm.recName = info.recName;
          this.addForm.toRecAcctNo = info.toRecAcctNo;
          this.addForm.toRecBankNo = info.toRecBankNo;
          this.addForm.toRecSocCode = info.toRecSocCode;
          this.addForm.acptBankNo = info.acptBankNo;
          this.addForm.acptBankName = info.acptBankName;
          this.addForm.acctFlowId = info.acctFlowId;
          this.addForm.acctStatus = info.acctStatus;
          // this.addForm.rgstApplDt = info.rgstApplDt;
          this.addForm.msgId = info.msgId;
          this.addForm.busiFlowNo = info.busiFlowNo;
          this.addForm.createTime = info.createTime;
          this.addForm.updateTime = info.updateTime;
        }
      },
      billClose() {
        this.pickRecouBillWin = false;
        this.billFormItem.billNo = "";
      },
      handlerPayDtChange(value) {
        this.addForm.payDt = value.replace(/-/g, "");
      },
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleDueDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDate = [arr[0],arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDate = [];
        }
      },
      handlePayDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minPayDt = arr[0].replace(/-/g, "");
          this.formItem.maxPayDt = arr[1].replace(/-/g, "");
          this.payDate = [arr[0],arr[1]];
        } else {
          this.formItem.minPayDt = "";
          this.formItem.maxPayDt = "";
          this.payDate = [];
        }
      },
      formSearchReset() {
        this.dueDate = [];
        this.payDate = [];
        this.formItem.billClass = "";
        this.formItem.billType = "";
        this.formItem.billNo = "";
        this.formItem.recName = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.dueDate = "";
        this.formItem.minDueDt = "";
        this.formItem.maxDueDt = "";
        this.formItem.payDate = "";
        this.formItem.minPayDt = "";
        this.formItem.maxPayDt = "";
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
      },
      closeAddOrEditWin() {
        this.$refs.addForm.resetFields();
        this.addForm.recBankName = "";
        this.addForm.recBankNo = "";
        this.addOrEditWin = false;
      },
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type == "add" ? "/be/trust/recourse/recourseClearBill/func_addRecourseClearBill" : "/be/trust/recourse/recourseClearBill/func_editRecourseClearBill";
            let msg = this.type == "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            this.submitMsg = msg;
            this.addForm.payDt = this.$moment(this.addForm.payDt, "YYYYMMDD").format("YYYYMMDD");
            this.addForm.dueDt = this.$moment(this.addForm.dueDt, "YYYYMMDD").format("YYYYMMDD");
            let rgstApplDt = this.addForm.rgstApplDt;
            if (rgstApplDt) {
              this.addForm.rgstApplDt = this.$moment(rgstApplDt).format("YYYYMMDD");
            }
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: "操作成功" });
                  this.closeAddOrEditWin();
                  this.$refs.datagrid.dataChange(pageNo);
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.currentSelectRow = [];
                } else {
                  /**清除多页选择的数据*/
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.currentSelectRow = [];
                  this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
                  this.$refs.datagrid.dataChange(pageNo);
                }
              } else {
                /**清除多页选择的数据*/
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
                this.currentSelectRow = [];
                this.$msgTip.error(this.$t("m.i.common.netError"));
              }
            });
          }
        });
      },
      handleComfirm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$msgTip.info(this.$t("m.i.common.chooseOneData"));
        }
      },
      //提交复核
      submitToReview() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "提交",
          content: "确认提交吗？",
          onOk: () => {
            this.submitRecheck();
          }
        });
      },
      submitRecheck() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/be/trust/recourse/recourseClearBill/func_submitRecourseClearBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });

            }
          } else {
            this.$msgTip.error(this.$t("m.i.common.netError"));
          }
        });
      },
      handledel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0; i < list.length; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids }, "/be/trust/recourse/recourseClearBill/func_deleteRecourseClearBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
            } else {
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
            }
          } else {
            /**清除多页选择的数据*/
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.selects = [];
            this.$msgTip.error(this.$t("m.i.common.netError"));
          }
        });
      },
      clearVal(type) {
        if (type == "recBankName") {
          this.addForm.recBankNo = "";
          this.addForm.recBankName = "";
        } else if (type == "billNo") {
          this.clearBillInfo();
        }
      },
      clearBillInfo() {
        this.addForm.id = "";
        this.addForm.legalNo = "";
        this.addForm.memberId = "";
        this.addForm.brchNo = "";
        this.addForm.brchName = "";
        this.addForm.billId = "";
        this.addForm.billNo = "";
        this.addForm.billMoney = "";
        this.addForm.billType = "";
        this.addForm.billClass = "";
        this.addForm.dueDt = "";
        this.addForm.recRepDt = "";
        this.addForm.recPayDt = "";
        this.addForm.acctTellerNo = "";
        this.addForm.applTellerNo = "";
        this.addForm.checkTellerNo = "";
        this.addForm.acctDt = "";
        this.addForm.billStatus = "";
        this.addForm.offLineRecType = "OLRT01";
        this.addForm.recourseRemark = "";
        this.addForm.recName = "";
        this.addForm.toRecAcctNo = "";
        this.addForm.toRecBankNo = "";
        this.addForm.toRecSocCode = "";
        this.addForm.acptBankNo = "";
        this.addForm.acptBankName = "";
        this.addForm.acctFlowId = "";
        this.addForm.acctStatus = "";
        this.addForm.rgstApplDt = "";
        this.addForm.msgId = "";
        this.addForm.busiFlowNo = "";
        this.addForm.createTime = "";
        this.addForm.updateTime = "";
        this.addForm.ownedBrchNo = "";
      },

      //根据弹框所选数据进行赋值
     /* brchNoChange(info) {
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

      //新增修改界面
      licenseBrchNoChange(info) {
        /*this.addForm.transBrchNo = info[0].id;
        this.addForm.brchName = info[0].title;
        this.addForm.ownedBrchNo = info[0].id;
        this.addForm.ownedBrchName = info[0].title;
        this.brchNoWin1 = false;*/
       if(info.length>0 && this.licenseFlag===true){
              this.addForm.brchNo = info[0].brchNo;
              this.addForm.brchName = info[0].brchName;
       }
      },
      brchNoWinOpen1() {
        this.brchNoWin1 = true;
      },
      brchNoWinClose1() {
        this.brchNoWin1 = false;
      },
    },
    mounted() {
      this.getDictListByGroups("RiskStatus,CDMedia,DraftTypeCode,executeMode,delayKind").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.riskStatusList = res.get("RiskStatus");
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
