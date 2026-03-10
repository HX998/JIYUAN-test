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
                <!--<h-form-item :label="$t('m.i.billInfo.acptBankName')" prop="acptBankName" class="h-form-long-label">
                  <h-input v-model="formItem.acptBankNo" v-show="false"></h-input>
                  <h-input v-model="formItem.acptBankName" readonly icon="android-search"
                           @on-click="queryBranchCode()" placeholder=""
                           clearable @on-clear="clearVal('acptBankName')"></h-input>
                </h-form-item>-->
                <show-cpes-branch :label="$t('m.i.billInfo.acptBankName')" class="h-form-long-label"
                                  :bankNo.sync="formItem.acptBankNo"  :cpesBrchName.sync="formItem.acptBankName"
                                  :isQueryByBankNo="true"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="acptBankName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>


                <h-form-item :label="$t('m.i.be.toRecName')" prop="toRecName">
                  <h-input v-model="formItem.toRecName" placeholder="" :maxlength="250"></h-input>
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
                <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDate">
                  <h-date-picker :value="dueDate" format="yyyy-MM-dd" type="daterange" showFormat
                                 :editable=false @on-change="handleDueDateChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.recRepDate')" prop="recRepDate">
                  <h-date-picker :value="recRepDate" format="yyyy-MM-dd" type="daterange" showFormat
                                 :editable=false placeholder="" @on-change="handleRecRepDateChange"></h-date-picker>
                </h-form-item>
                <h-form-item prop="offLineRecType" :label="$t('m.i.be.offLineRecType')">
                  <h-select v-model="formItem.offLineRecType" placeholder="" showTitle>
                    <h-option v-for="item in offLineRecTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.be.recPayDate')" prop="recPayDate">
                  <h-date-picker :value="recPayDate" format="yyyy-MM-dd" type="daterange" showFormat
                                 :editable=false placeholder="" @on-change="handleRecPayDateChange"></h-date-picker>
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
            url="/be/trust/recourse/offlineRecourseRegisterBill/func_queryRefuseStockBill"
            :bindForm="formItem"
            :hasSelect="false"
            rowSelect
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
        <span v-if="type=='add'">新增申请</span>
        <span v-if="type=='modify'">修改</span>
        <span v-if="type=='view'">{{$t("m.i.shcpe.viewRoleInfo")}}</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <!--<h-form-item :label="$t('m.i.be.rgstApplDt')" prop="rgstApplDt" :required="isRequired">-->
            <!--<h-input v-model="addForm.rgstApplDt" ></h-input>-->
          <!--</h-form-item>-->
          <h-form-item :label="$t('m.i.be.rgstApplDt')" prop="rgstApplDt" :required="isRequired">
            <h-date-picker v-if="type=='view'" readonly :value="addForm.rgstApplDt" placeholder="" showFormat :title="addForm.rgstApplDt"
                           type="date"></h-date-picker>
            <h-date-picker v-else v-model="addForm.rgstApplDt" placeholder="" readonly showFormat type="date"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :required="isRequired">
            <h-input v-model="addForm.billNo" icon="android-search" @on-click="pickRecouBill()" readonly
                     v-if="type=='add'" clearable @on-clear="clearVal('billNo')"></h-input>
            <h-input v-model="addForm.billNo" readonly v-if="type=='modify'"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" :required="isRequired">
            <h-typefield v-model="addForm.billMoney" readonly></h-typefield>
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
            <h-input v-model="addForm.dueDt" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptBankNo')" prop="acptBankNo" :required="isRequired">
            <h-input v-model="addForm.acptBankNo" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptBankName')" prop="acptBankName" :required="isRequired">
            <h-input v-model="addForm.acptBankName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.offLineRecType')" prop="offLineRecType" :required="isRequired">
            <h-select v-if="addForm.billClass =='ME02'" v-model="addForm.offLineRecType" :maxlength=60 readonly showTitle>
              <h-option v-for="item in offLineRecTypeList" :value="'OLRT01'" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="addForm.billClass =='ME01'&&type=='add'" v-model="addForm.offLineRecType" :maxlength=60
                      placeholder="" @on-change="setrequiredByOffLine()" showTitle>
              <h-option v-for="item in offLineRecTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="addForm.billClass =='ME01'&&type=='modify'" v-model="addForm.offLineRecType"
                      :maxlength=60 placeholder="" @on-change="setrequiredByOffLine()" readonly showTitle>
              <h-option v-for="item in offLineRecTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.offLineRecType" :maxlength=60 placeholder=""
                      @on-change="setrequiredByOffLine()" readonly showTitle>
              <h-option v-for="item in offLineRecTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.recRepDate')" prop="recRepDt" :required="requiredByOffLine">
            <h-date-picker type="date" v-model="addForm.recRepDt" placeholder=""
                           @on-change="handlerGstApplDtChange()"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.recPayDate')" prop="recPayDt" :required="!requiredByOffLine">
            <h-date-picker type="date" v-model="addForm.recPayDt" placeholder=""
                           @on-change="handlerRecPayDtChange()"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="recourseRemark">
            <h-input v-model="addForm.recourseRemark" :maxlength="250"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.recName')" prop="brchName" :required="isRequired">
            <h-input v-model="addForm.brchName" :maxlength="250" v-if="type=='add'"></h-input>
            <h-input v-model="addForm.brchName" :maxlength="250" v-if="type=='modify'" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.toRecName')" prop="toRecName" :required="isRequired">
            <h-input v-model="addForm.toRecName" :maxlength="250"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.toRecAcctNo')" prop="toRecAcctNo" :validRules="custAcctNoRule">
            <h-input v-model="addForm.toRecAcctNo" :maxlength="32"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.toRecBankNo')" prop="toRecBankNo" :validRules="bankNoRule" class="h-form-long-label">
            <h-input v-model="addForm.toRecBankNo" :maxlength="12"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.toRecSocCode')" prop="toRecSocCode" :required="isRequired" :validRules="socCodeRule"
                       class="h-form-long-label">
            <h-input v-model="addForm.toRecSocCode" :maxlength=18 ></h-input>
          </h-form-item>

          <!--<h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchName" :required="isRequired"  v-if="this.licenseFlag">
            <h-input v-if="type=='modify'" readonly :value="addForm.ownedBrchName" :title="addForm.ownedBrchName"></h-input>
            <h-input v-else v-model="addForm.ownedBrchName" :maxlength=60 readonly
                     icon="android-search" @on-click="brchNoWinOpen1"></h-input>
          </h-form-item>-->
          <show-branch v-model="addForm.ownedBrchNo"  :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchName" :required="isRequired"
                       :filterable="type=='add'"     :showCheckBox="false"   :msgBoxWin="addOrEditWin"  @brchNoChange="licenseBrchNoChange($event)"    :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName"
                       v-if="this.licenseFlag" :params="{authPath:this.$route.path}"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                       queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px" @click="addOrEditWin=!addOrEditWin">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--挑票弹出框-->
    <h-msg-box v-model="pickRecouBillWin" width="1000" :mask-closable="false" class="h-form-search-layer"
               @on-close="billClose" :maximize="true" @on-maximize="onMaximize" :footerHide="false">
      <p slot="header">
        <span>挑票</span>
      </p>
      <!--查询表单-->
      <div class="h-form-overhd">
        <h-form :model="billFormItem" :label-width="90" ref="billFormItem" cols="3" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo">
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
        url="/be/trust/recourse/offlineRecourseRegisterBill/func_queryRecPickBill"
        :columns="billColumns"
        :bindForm="billFormItem"
        :height="300"
        :onCurrentChange="handlelRowClickBill"
        :onCurrentChangeCancel="handleSelectClickBill"
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
    name: "offlineRecourseRegisterBill",
    components: {
      //ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      function validcustAcctNo(rule,val,callback){
        let re = /^[a-zA-Z0-9]{1,32}$/;
        if(re.test(val)){
          callback()
        }else if (val === "" || val === undefined) {
          callback()
        }else {
          callback(new Error("非法输入，只能输入英文、数字"))
        }
      }
      return {
        custAcctNoRule: [{ test: validcustAcctNo, trigger: "blur" }],
        billColumns: [
          {
            type: "radio",
            width: 50,
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
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CpesFlowStatus", params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          }],
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
            render:(h, params)  => {
              let dueDt = params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h('span', dueDt)
            }
          },
          {
            title: this.$t('m.i.be.rgstApplDt'),
            key: "rgstApplDt",
            sortable: true,
            hiddenCol: false,
            render:(h, params)  => {
              let rgstApplDt = params.row.rgstApplDt ? this.$moment(params.row.rgstApplDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h('span', rgstApplDt)
            }
          },
          {
            title: this.$t('m.i.be.recRepDate'),
            key: "recRepDt",
            sortable: true,
            hiddenCol: false,
            render:(h, params)  => {
              let recRepDt = params.row.recRepDt ? this.$moment(params.row.recRepDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h('span', recRepDt)
            }
          },
          {
            title: this.$t('m.i.be.recPayDate'),
            key: "recPayDt",
            sortable: true,
            hiddenCol: false,
            render:(h, params)  => {
              let recPayDt = params.row.recPayDt ? this.$moment(params.row.recPayDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "";
              return h('span', recPayDt)
            }
          },
          {
            title: this.$t('m.i.billInfo.ecdsBillStatus'),
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BarterTrustStatus", params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.offLineRecType'),
            key: "offLineRecType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "OffLineRecType", params.row.offLineRecType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "recourseRemark",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.toRecName'),
            key: "toRecName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.recName'),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.toRecAcctNo'),
            key: "toRecAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.toRecBankNo'),
            key: "toRecBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankNo'),
            key: "acptBankNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: "acptBankName",
            sortable: true,
            hiddenCol: false
          }
        ],
        dueDate:[],
        recRepDate:[],
        recPayDate:[],
        formItem: {
          billNo: "",
          billClass: "",
          billType: "",
          acptBankNo: "",
          acptBankName: "",
          minBillMoney: "",
          maxBillMoney: "",
          rgstApplDt: "",
          dueDate: "",
          recRepDate: "",
          recPayDate: "",
          maxDueDt: "",
          minDueDt: "",
          minRecRepDt: "",
          maxRecRepDt: "",
          minRecPayDt: "",
          maxRecPayDt: "",
          toRecName: "",
          recName: "",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          offLineRecType: ""
        },
        billFormItem: {
          billNo: ""
        },
        addForm: {
          id: "",
          legalNo: "",
          memberId: "",
          brchNo: "",
          brchName: "",
          rgstBrchCode: "",
          billId: "",
          billNo: "",
          billMoney: "",
          billType: "",
          billClass: "",
          dueDt: "",
          rgstApplDt: this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD"),
          recRepDt: "",
          recPayDt: "",
          acctTellerNo: "",
          applTellerNo: "",
          checkTellerNo: "",
          acctDt: "",
          billStatus: "",
          offLineRecType: "OLRT01",
          recourseRemark: "",
          toRecName: "",
          toRecAcctNo: "",
          toRecBankNo: "",
          toRecBankName: "",
          toRecSocCode: "",
          acptBankNo: "",
          acptBankName: "",
          acctFlowId: "",
          acctStatus: "",
          msgId: "",
          busiFlowNo: "",
          createTime: "",
          updateTime: "",
          recName: "",
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
        showBillInfoWin: false,
        billClassList: [],
        billTypeList: [],
        dictMap: new Map(),
        offLineRecTypeList: [],
        currentSelectRowBill: null,
        currentSelectRow: null,
        ifShowMore: false,
        pickRecouBillWin: false,
        requiredByOffLine: true,
        offLineRecType: "",
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
        //showCpesBranch: false,
        socCodeRule: [{ test: /^[0-9A-Z]{18}$/, trigger: "blur", message: "统一社会信用代码由18位数字或大写字母组成" }],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成" }]
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
      //设置追索日期可读
      setrequiredByOffLine() {
        this.requiredByOffLine = this.addForm.offLineRecType !== "OLRT02";
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
        this.formItem.acptBankNo = info.transBrchBankNo;
        this.formItem.acptBankName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/
      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.ownedBrchNo=this.$store.getters.userInfo.brchNo;
          this.addForm.ownedBrchName=this.$store.getters.userInfo.brchName;
          this.addForm.id = "";
          this.addForm.rgstApplDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        });
      },
      pickRecouBill() {
        this.pickRecouBillWin = true;
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.licenseFlag = this.licenseFlag;
        if (this.type == "modify" || this.type == "view") {
          let list = this.$refs.datagrid.selects;
          if (list != null && list.length == 1) {
            this.currentSelectRow = list[0];
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$nextTick(() => {
            this.addForm.id = this.currentSelectRow.id;
            this.addForm.legalNo = this.currentSelectRow.legalNo;
            this.addForm.memberId = this.currentSelectRow.memberId;
            this.addForm.brchNo = this.currentSelectRow.brchNo;
            this.addForm.brchName = this.currentSelectRow.brchName;
            this.addForm.rgstBrchCode = this.currentSelectRow.rgstBrchCode;
            this.addForm.billId = this.currentSelectRow.billId;
            this.addForm.billNo = this.currentSelectRow.billNo;
            this.addForm.billMoney = this.currentSelectRow.billMoney;
            this.addForm.billType = this.currentSelectRow.billType;
            this.addForm.billClass = this.currentSelectRow.billClass;
            if (this.currentSelectRow.dueDt) {
              this.addForm.dueDt = this.$moment(this.currentSelectRow.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            if (this.currentSelectRow.rgstApplDt) {
              this.addForm.rgstApplDt = this.$moment(this.currentSelectRow.rgstApplDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            if (this.currentSelectRow.recRepDt) {
              this.addForm.recRepDt = this.$moment(this.currentSelectRow.recRepDt, "YYYYMMDD").format("YYYY-MM-DD");
            }
            if (this.currentSelectRow.recPayDt) {
              this.addForm.recPayDt = this.$moment(this.currentSelectRow.recPayDt, "YYYYMMDD").format("YYYY-MM-DD");
            } else {
              this.addForm.recPayDt = "";
            }
            this.addForm.acctTellerNo = this.currentSelectRow.acctTellerNo;
            this.addForm.applTellerNo = this.currentSelectRow.applTellerNo;
            this.addForm.checkTellerNo = this.currentSelectRow.checkTellerNo;
            this.addForm.acctDt = this.currentSelectRow.acctDt;
            this.addForm.billStatus = this.currentSelectRow.billStatus;
            this.addForm.offLineRecType = this.currentSelectRow.offLineRecType;
            this.addForm.recourseRemark = this.currentSelectRow.recourseRemark;
            this.addForm.toRecName = this.currentSelectRow.toRecName;
            this.addForm.toRecAcctNo = this.currentSelectRow.toRecAcctNo;
            this.addForm.toRecBankNo = this.currentSelectRow.toRecBankNo;
            this.addForm.toRecSocCode = this.currentSelectRow.toRecSocCode;
            this.addForm.acptBankNo = this.currentSelectRow.acptBankNo;
            this.addForm.acptBankName = this.currentSelectRow.acptBankName;
            this.addForm.acctFlowId = this.currentSelectRow.acctFlowId;
            this.addForm.acctStatus = this.currentSelectRow.acctStatus;
            this.addForm.msgId = this.currentSelectRow.msgId;
            this.addForm.busiFlowNo = this.currentSelectRow.busiFlowNo;
            this.addForm.createTime = this.currentSelectRow.createTime;
            this.addForm.updateTime = this.currentSelectRow.updateTime;
            this.addForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
            this.addForm.ownedBrchName = this.currentSelectRow.ownedBrchName;
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
      handleSelectClickBill(currentRow, oldCurrentRow, _index) {
        this.currentSelectRowBill = null;
      },
      doubleHandleClick(arr) {
        this.trunBill(arr);
        this.pickRecouBillWin = false;
        this.currentSelectRowBill = null;
        this.billFormItem.billNo = "";
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
      handleRecRepDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minRecRepDt = arr[0].replace(/-/g, "");
          this.formItem.maxRecRepDt = arr[1].replace(/-/g, "");
          this.recRepDate = [arr[0],arr[1]];
        } else {
          this.formItem.minRecRepDt = "";
          this.formItem.maxRecRepDt = "";
          this.recRepDate = [];
        }
      },
      handleRecPayDateChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minRecPayDt = arr[0].replace(/-/g, "");
          this.formItem.maxRecPayDt = arr[1].replace(/-/g, "");
          this.recPayDate = [arr[0],arr[1]];
        } else {
          this.formItem.minRecPayDt = "";
          this.formItem.maxRecPayDt = "";
          this.recPayDate = [];
        }
      },
      handlerGstApplDtChange() {
        if(this.addForm.recRepDt){
          this.addForm.recRepDt = this.$moment(this.addForm.recRepDt).format("YYYYMMDD");
        }
      },
      handlerRecPayDtChange() {
        if(this.addForm.recPayDt) {
          this.addForm.recPayDt = this.$moment(this.addForm.recPayDt).format("YYYYMMDD");
        }
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
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.recPayDate = [];
        this.recRepDate = [];
        this.dueDate = [];
        this.$refs.formItem.resetFields();
        this.formItem.billNo = "";
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.acptBankNo = "";
        this.formItem.acptBankName = "";
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
          this.addForm.rgstBrchCode = info.rgstBrchCode;
          this.addForm.billId = info.billId;
          this.addForm.billNo = info.billNo;
          this.addForm.billMoney = info.billMoney;
          this.addForm.billType = info.billType;
          this.addForm.billClass = info.billClass;
          if (info.dueDt) {
            this.addForm.dueDt = this.$moment(info.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.dueDt = info.dueDt;
          }
          if (this.addForm.rgstApplDt) {
            this.addForm.rgstApplDt = this.$moment(info.rgstApplDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.rgstApplDt = info.rgstApplDt;
          }
          this.addForm.recPayDt = info.recPayDt;
          this.addForm.acctTellerNo = info.acctTellerNo;
          this.addForm.applTellerNo = info.applTellerNo;
          this.addForm.checkTellerNo = info.checkTellerNo;
          this.addForm.acctDt = info.acctDt;
          this.addForm.billStatus = info.billStatus;
          this.addForm.offLineRecType = "OLRT01";
          this.addForm.recourseRemark = info.recourseRemark;
          this.addForm.brchName = info.recName;
          this.addForm.toRecName = info.toRecName;
          this.addForm.toRecAcctNo = info.toRecAcctNo;
          this.addForm.toRecBankNo = info.toRecBankNo;
          this.addForm.toRecSocCode = info.toRecSocCode;
          this.addForm.acptBankNo = info.acptBankNo;
          this.addForm.acptBankName = info.acptBankName;
          this.addForm.acctFlowId = info.acctFlowId;
          this.addForm.acctStatus = info.acctStatus;
          this.addForm.msgId = info.msgId;
          this.addForm.busiFlowNo = info.busiFlowNo;
          this.addForm.createTime = info.createTime;
          this.addForm.updateTime = info.updateTime;
          if (this.addForm.recRepDt) {
            this.addForm.recRepDt = this.$moment(info.recRepDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.recRepDt = info.recRepDt;
          }
          if (this.addForm.recPayDt) {
            this.addForm.recPayDt = this.$moment(info.recPayDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.recPayDt = info.recPayDt;
          }
        }
      },
      submitFormBill() {
        if (this.currentSelectRowBill != null && this.currentSelectRowBill.length !== 0) {
          this.trunBill(this.currentSelectRowBill);
          this.pickRecouBillWin = false;
          this.currentSelectRowBill = null;
          this.billFormItem.billNo = "";
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          this.currentSelectRowBill = null;
        }
      },
      billClose() {
        this.pickRecouBillWin = false;
        this.billFormItem.billNo = "";
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url[TODO:替换后与后台联调]
            let url = this.type == "add" ? "/be/trust/recourse/offlineRecourseRegisterBill/func_submitOfflineRecourseRegisterBillAdd" : "/be/trust/recourse/offlineRecourseRegisterBill/func_submitOfflineRecourseRegisterBillEdit";
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            let dueDt = this.addForm.dueDt;
            if (dueDt) {
              this.addForm.dueDt = this.$moment(dueDt).format("YYYYMMDD");
            }
            let rgstApplDt = this.addForm.rgstApplDt;
            if (rgstApplDt) {
              this.addForm.rgstApplDt = this.$moment(rgstApplDt).format("YYYYMMDD");
            }
            let recRepDt = this.addForm.recRepDt;
            if (recRepDt) {
              this.addForm.recRepDt = this.$moment(recRepDt).format("YYYYMMDD");
            }
            let recPayDt = this.addForm.recPayDt;
            if (recPayDt) {
              this.addForm.recPayDt = this.$moment(recPayDt).format("YYYYMMDD");
            }
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: "操作成功" });
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selectIds = [];
                  this.$refs.datagrid.selects = [];
                  this.currentSelectRow = [];
                }
              } else {
                this.$msgTip.error(this, { info: "操作失败" });
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
                this.currentSelectRow = [];
              }
            });
          }
        });
      },
      handleComfirm() {
        let list = this.$refs.datagrid.selects;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
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
        post({ ids: ids }, "/be/trust/recourse/offlineRecourseRegisterBill/func_submitOfflineRecourseRegisterBillDel").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.currentSelectRow = [];
            } else {
              this.$refs.datagrid.dataChange(1);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$msgTip.info(this, { info: "删除失败:" + res.data.retMsg });
            }
          } else {
            /**清除多页选择的数据*/
            this.$refs.datagrid.selectIds = [];
            this.$refs.datagrid.selects = [];
            // this.$hMessage.error(this.$t('m.i.common.netError'))
            tthis.$msgTip.info(this, { info: "删除失败" });
          }
        });
      },
      //提交复核
      submitToReview() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
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
      formatDt() {
        let rgstApplDt = this.addForm.rgstApplDt == null ? "" : this.$moment(new Date()).format("YYYY-MM-DD");
        return rgstApplDt;
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
        post({ ids: ids }, "/be/trust/recourse/offlineRecourseRegisterBill/func_submitOfflineRecourseRegisterBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.currentSelectRow = [];
            } else {
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selectIds = [];
              this.$refs.datagrid.selects = [];
              this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: "操作失败:" });
          }
        });
      },
      clearVal(type) {
        if (type == "acptBankName") {
          this.formItem.acptBankNo = "";
          this.formItem.acptBankName = "";
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
        this.addForm.rgstBrchCode = "";
        this.addForm.billId = "";
        this.addForm.billNo = "";
        this.addForm.billMoney = "";
        this.addForm.billType = "";
        this.addForm.billClass = "";
        this.addForm.dueDt = "";
        this.addForm.rgstApplDt = "";
        this.addForm.recPayDt = "";
        this.addForm.acctTellerNo = "";
        this.addForm.applTellerNo = "";
        this.addForm.checkTellerNo = "";
        this.addForm.acctDt = "";
        this.addForm.billStatus = "";
        this.addForm.offLineRecType = "OLRT01";
        this.addForm.recourseRemark = "";
        this.addForm.brchName = "";
        this.addForm.toRecName = "";
        this.addForm.toRecAcctNo = "";
        this.addForm.toRecBankNo = "";
        this.addForm.toRecSocCode = "";
        this.addForm.acptBankNo = "";
        this.addForm.acptBankName = "";
        this.addForm.acctFlowId = "";
        this.addForm.acctStatus = "";
        this.addForm.msgId = "";
        this.addForm.busiFlowNo = "";
        this.addForm.createTime = "";
        this.addForm.updateTime = "";
        this.addForm.recRepDt = "";
        this.addForm.recPayDt = "";
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
       /* this.addForm.transBrchNo = info[0].id;
        this.addForm.brchName = info[0].title;
        this.addForm.ownedBrchNo = info[0].id;
        this.addForm.ownedBrchName = info[0].title;
        this.brchNoWin1 = false;*/
          if(info.length>0 && this.licenseFlag===true){
              this.addForm.brchNo = info[0].brchNo;
              this.addForm.brchName = info[0].brchName;
          }
      },
     /* brchNoWinOpen1() {
        this.brchNoWin1 = true;
      },
      brchNoWinClose1() {
        this.brchNoWin1 = false;
      },*/
    },
    mounted() {
      this.getDictListByGroups("BarterTrustStatus,OffLineRecType,CDMedia,DraftTypeCode,CpesFlowStatus").then(res => {
        this.billClassList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.offLineRecTypeList = res.get("OffLineRecType");
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
