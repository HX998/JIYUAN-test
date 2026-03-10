<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <!-- 主页面 -->
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="this.$t('m.i.be.isCommit')+':'" prop="isCommit">
                  <h-radio-group v-model="formItem.isCommit">
                    <h-radio label='false' @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label='true' @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
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
                  <h-select v-model="formItem.billType" placeholder="">
                    <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass">
                  <h-select v-model="formItem.billClass" placeholder="">
                    <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.applDt')" prop="applDt">
                  <h-date-picker type="date" placeholder="" v-model="formItem.applDt"
                                 :showFormat="true"></h-date-picker>
                </h-form-item>
                <h-input v-if="false" v-model="formItem.queryType" placeholder="查询方式：1、 申请  2、发送 3、撤回 4、记账"></h-input>
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
            highlight-row
            url="/bp/guaranty/apply/func_queryApplyGuarntyBatch"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" :disabled="hasCommitDisabled">{{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" :disabled="hasCommitDisabled">{{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleDelForm()" :disabled="hasCommitDisabled">{{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('cancel')" :disabled="noCommitDisabled">{{$t("m.i.common.revoke")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="type=='add'">新增申请</span>
        <span v-if="type=='modify'">修改申请</span>
        <span v-if="type=='view'">查看票据信息</span>
        <span v-if="type=='cancel'">撤销</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.billType" class="input-boder-0" :title="addForm.billType">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key" >{{item.value}}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billType" placeholder="" :readonly="readonly">
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.billClass" class="input-boder-0" :title="addForm.billClass">
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billClass" placeholder="" :readonly="readonly">
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
          <!--<h-form-item :label="$t('m.i.be.guarantorName')" prop="custName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.custName" class="input-boder-0"
                     :title="addForm.custName"></h-input>
            <h-input v-else v-model="addForm.custName" :maxlength=60 readonly
                     icon="android-search" @on-click="brchCodeWinOpen" clearable
                     @on-clear="clearVal('custName')"></h-input>
          </h-form-item>-->

          <show-cpes-branch  :label="$t('m.i.be.guarantorName')"  :required="isRequired"
                             :brchCode.sync="addForm.custBrchCode"  :cpesBrchName.sync="addForm.custName"
                             :msgBoxWin="addOrEditWin" :isInitValueClearable="true"
                             datagridUrl="/cpes/branch/queryBranchList" prop="custName"
                             queryUrl="/cpes/branch/queryBranchList" :showIcon=!this.isHaveBill :readonly=this.isHaveBill></show-cpes-branch>

          <h-form-item :label="$t('m.i.be.guarantorBrchCode')" prop="custBrchCode" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.custBrchCode" class="input-boder-0"
                     :title="addForm.custBrchCode"></h-input>
            <h-input v-else v-model="addForm.custBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.applDt')" prop="applDt" :required="isRequired">
            <h-date-picker v-if="type=='view'" :value="addForm.applDt" class="input-boder-0" :title="addForm.applDt"
                           type="date" transfer></h-date-picker>
            <h-date-picker v-else v-model="addForm.applDt" placeholder="" :maxlength=60 type="date" transfer></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-if="type=='view'" :value="addForm.custMgrNo" class="input-boder-0"
                     :title="addForm.custMgrNo"></h-input>
            <h-input v-else v-model="addForm.custMgrNo" :maxlength=60 readonly
                     icon="android-search" @on-click="showCustManagerWinOpen" clearable></h-input>
          </h-form-item>
       <!--   <h-form-item :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchName" :required="isRequired"  v-if="this.licenseFlag">
            <h-input v-if="type=='view'" readonly :value="addForm.ownedBrchName" :title="addForm.ownedBrchName"></h-input>
            <h-input v-else v-model="addForm.ownedBrchName" :maxlength=60 readonly
                     icon="android-search" @on-click="brchNoWinOpen1"></h-input>
          </h-form-item>-->

          <show-branch v-model="addForm.ownedBrchNo"  :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNo" :required="isRequired"
                       :filterable="type=='add'"     :showCheckBox="false"   :msgBoxWin="addOrEditWin"  @brchNoChange="licenseBrchNoChange($event)"    :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName"
                       v-if="this.licenseFlag" :params="{authPath:this.$route.path}"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                       queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>
          <h-form-item>
          </h-form-item>
          <h-form-item>
            <h-button type="primary" style="" @click="addFormSave()">{{$t("m.i.common.save")}}</h-button>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-form :model="billManageFormItem" :label-width="120" ref="billManageFormItem" cols="2" class="h-form-search">
        <h-input v-if="false" v-model="billManageFormItem.batchId" placeholder="批次id"></h-input>
        <h-input v-if="false" v-model="billManageFormItem.isCommit" placeholder="是否已提交"></h-input>
        <h-input v-if="false" v-model="billManageFormItem.queryType" placeholder="查询方式：1、 申请  2、发送 3、撤回 4、记账"></h-input>
      </h-form>
      <h-datagrid
        :columns="warteeBill.billColumns"
        highlight-row
        url="bp/guaranty/apply/func_queryBatchBillByPage"
        :bindForm="billManageFormItem"
        :row-select="true"
        :has-select="false"
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary"  v-show="noCommitDisabled"
                    @click="pickBillWinOpen">{{$t('m.i.common.pickBill')}}
          </h-button>
          <h-dropdown placement="bottom-start" trigger="click" @on-click="beforeDelete">
            <h-button type="primary"  v-show="noCommitDisabled">{{$t('m.i.common.delete')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="choice">{{$t('m.i.be.chooseDelete')}}</h-dropdown-item>
              <h-dropdown-item name="all">{{$t('m.i.be.batchListDelete')}}</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-dropdown placement="bottom-start" trigger="click" @on-click="beforeSubmit">
            <h-button type="primary"  v-show="noCommitDisabled">{{$t('m.i.common.submit')}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="choice">{{$t('m.i.be.selectSubmit')}}</h-dropdown-item>
              <h-dropdown-item name="all">{{$t('m.i.be.batchSubmit')}}</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="primary" @click="itemCancel"  v-show="hasCommitDisabled">{{$t('m.i.common.revoke')}}</h-button>

        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <!--<h-button type="ghost" @click="closeAddOrEditWin">{{$t("m.i.common.close")}}</h-button>-->
        <!--<h-button type="primary" @click="closeAddOrEditWin">{{$t("m.i.common.commit")}}</h-button>-->
      </div>
    </h-msg-box>


    <h-msg-box v-model="splitMoneyWin" width="1000" height="200" class="h-form-table-layer"
               @on-close="handlesplitMoneyWinClose" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>调整票据交易金额</span>
      </p>
      <h-panel>
        <h-form :model="splitMoneyForm" :label-width="120" ref="splitMoneyForm" cols="2" class="h-form-search">

          <common-input v-model="splitMoneyForm.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :required="true"  readonly></common-input>

          <common-type-field v-model="splitMoneyForm.billPackageMoney" :label="$t('m.i.billInfo.billPackageMoney')" prop="billPackageMoney"
                             :required="true" readonly></common-type-field>

          <common-type-field v-model="splitMoneyForm.transAmt" :label="$t('m.i.billInfo.transMoney')" prop="transAmt"
                             :required="true" :validRules="moneyRule" type="money" :bigTips="false"></common-type-field>

        </h-form>
      </h-panel>

      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
             <h-button type="primary" @click="handlesplitMoneyWinClose" >{{$t("m.i.common.close")}}</h-button>
           <h-button type="primary" @click="cancelSplit" >{{$t("m.i.common.cancelSplit")}}</h-button>
          <h-button type="primary" @click="splitBill" >{{$t("m.i.common.split")}}</h-button>
      </div>
    </h-msg-box>

    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->

    <pick-bill v-bind:batchId="billManageFormItem.batchId" :pickCodeWin="pickBillWin"
               @pickBillWinClose="pickBillWinClose" @pickCodeChange="pickCodeChange"
               :billType="addForm.billType" :billClass="addForm.billClass"
               :ownedBrchNo="addForm.ownedBrchNo" :licenseFlag="this.licenseFlag"
              :hiddenBillOriginSelect="this.hiddenBillOriginSelect"></pick-bill>

    <show-cust-manager :showCustManagerWin="showCustManagerWin" @custManagerSelect="showCustManagerWinChange"
                       @showCustManagerWinClose="showCustManagerWinClose"></show-cust-manager>

    <!--<show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                         :checkStrictly="true"></show-license-branch>
    <show-license-branch :showBranchWin="brchNoWin1" title="机构查询" @brchNoChange="licenseBrchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose1" :ifcheck="false"
                         :checkStrictly="true"></show-license-branch>-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off ,formatNumber,formatBillRange} from "@/api/bizApi/commonUtil";
  import CommonInput from "../../../../../components/bemp/input/commonInput";

  export default {
    name: "warteeApply",
    components: {
      CommonInput,
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      PickBill: () => import(/* webpackChunkName: "be/trust/wartee/warteePickBill" */`@/views/bizViews/be/trust/wartee/warteePickBill`),
      showCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        formItem: {
          billClass: "",
          billType: "",
          drwrName: "",
          acptName: "",
          applDt: "",
          queryType: "1",
          isCommit: "false",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          guarntrType:"4",
          funcNo:"PIPB010102",
          canEmpty:"1",
          authPath: this.$route.path,
        },
        splitMoneyForm:{
          billNo:"",
          billPackageMoney:"",
          transAmt:"",
          billOrigin:"",
          billRangeEnd:"",
          listId : "",
        },
        splitMoneyWin : false,
        isHaveBill : false,
        hiddenBillOriginSelect:true,
        moneyRule: [{ test: validMoney, trigger: "blur" }],
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
          guarntrType:"4",
        },
        billManageFormItem: {
          batchId: -1,
          queryType: "1",
          funcNo: "PIPB010102",
          isCommit: "false"
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
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let applDt = this.$moment(params.row.applDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", applDt);
            }
          }
        ],
        billTypeList: [],
        billOriginList:[],
        cdMediaList: [],
        dictMap: null,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        type: null,
        readonly: false,
        isRequired: true,
        hasCommitDisabled: false,
        noCommitDisabled: true,
        submitFlag: false,
        copyWin: false,
        ifShowMore: false,
        //brchCodeWin: false,
        pickBillWin: false,
        id: "",
        batchIds: "",
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        brchNoWin: false,
        brchNoWin1:false,
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
              hiddenCol: false,
              render: (h, params) => {
                let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
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
        showCustManagerWin: false,
        currentSelectRow: [],
        // 对于单页面，2个窗口的grid, 临时存放父窗口的选择记录
        tmpSelectList: [],
        showBillInfoWin:false,
        billId:"",
        billNo:""
      };

      function validMoney(rule, val, callback) {
        let re = /^([1-9]\d{0,19}|0)([.]?|(\.\d{1,2})?)$/;
        if (val <= 0) {
          callback(new Error("票据金额必须大于0"));
        } else if (re.test(val)) {
          callback();
        } else {
          callback(new Error("金额为大于等于0的数，小数位只能输两位，最大长度为20位"));
        }
      }
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

      /* 保存批次 */
      addFormSave(str) {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let btnType = this.type;
            let url = "/bp/guaranty/apply/func_addOrUpdateBatch";
            let msg = this.$t("m.i.common.saveSuccess");
            let applDt = this.addForm.applDt;
            this.addForm.applDt = this.$moment(applDt).format("YYYYMMDD");
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if(res){
                let retCode = res.data.retCode
                if(retCode=="000000"){
                  this.billManageFormItem.batchId=res.data.retData.id;
                  this.addForm.id = res.data.retData.id;
                  this.addForm.busiBatchNo = res.data.retData.busiBatchNo;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.dataSelectReset();
                  this.readonly = true;
                  if(str != '1'){
                    this.$msgTip.success(this, { info: msg });
                  }else{
                    this.pickBillWin = true;
                    this.hiddenBillOriginSelect = this.addForm.billClass==='ME01'?true:false;
                  }
                }else{
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage)
                  this.dataSelectReset();
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.schemeId = "";
        this.addForm.schemeName = "";
        let batchId = null;
        this.addForm.licenseFlag = this.licenseFlag;
        if (this.type == "modify" || this.type == "view" || this.type == "cancel") {
          if (!this.checkOnlyOne(this.currentSelectRow)) {
            return;
          }
          batchId = this.currentSelectRow.id;
          this.addForm.ownedBrchNo = this.currentSelectRow.ownedBrchNo;
          this.addForm.ownedBrchName = this.currentSelectRow.ownedBrchName;
          this.queryObjById(batchId);
          if (this.type == "modify" || this.type == "cancel") {
            this.readonly = true;
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
        } else {
          this.$nextTick(() => {
            this.addForm.id = "";
            this.isRequired = true;
            this.addFormReset();
            post({}, "/bp/guaranty/apply/func_getCurUserInfo").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let data = res.data.retData;
                  this.addForm.applDt = this.$moment(data, "YYYYMMDD").format("YYYY-MM-DD");
                  this.addForm.ownedBrchNo = this.$store.getters.userInfo.brchNo;
                  this.addForm.ownedBrchName = this.$store.getters.userInfo.brchName;
                  this.isHaveBill = false;
                } else {
                  this.$msgTip.error(this, { info: "初始化数据查询失败:" + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                return;
              }
            });
          });
        }
        this.$nextTick(() => {
          this.queryBillManageFormItem(batchId, this.type);
        });
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
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
              this.addForm.ownedBrchNo = res.data.retData.ownedBrchNo;
              this.addForm.ownedBrchName = res.data.retData.ownedBrchName;
              if (res.data.retData.isHaveBill == '1'){
                this.isHaveBill = true;
              }
            } else {
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
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
      noCommitButton() {
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        this.formItem.queryType = "1";
        this.formItem.canEmpty ="1";
        this.formItem.funcNo="PIPB010102",
        this.billManageFormItem.funcNo="PIPB010102",
        this.billManageFormItem.queryType = "1";
        this.$refs.datagrid.dataChange(1);
        this.dataSelectReset();
      },
      hasCommitButton() {
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
        this.formItem.queryType = "3";
        this.formItem.canEmpty ="";
        this.formItem.funcNo="PIPB010109",
        this.billManageFormItem.funcNo="PIPB010109",
        this.billManageFormItem.queryType = "3";
        this.$refs.datagrid.dataChange(1);
        this.dataSelectReset();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      formSearch() {
        this.formItem.applDt = this.formItem.applDt.replace(/-/g, "");
        this.$refs.datagrid.dataChange(1);
        this.dataSelectReset();
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.$refs.formItem.resetFields();
        this.noCommitButton();
      },
      handleDelForm() {
        if (this.checkOnlyOne(this.currentSelectRow)) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        }
      },
      handledel() {
        let batchId = this.currentSelectRow.id;
        post({ id: batchId ,deleteFlag:"0" }, "bp/guaranty/apply/func_deleteBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.dataTmpSelectReset();
            }else if(retCode === "000002" && retMsg === "100001"){
                this.continueApply(batchId);
            }  else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.dataTmpSelectReset();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
        continueApply(id){
            let url= "be/trust/wartee/warteeApply/func_submitWarteeBatchDel";
            let content ="批次下所有明细将同时删除，确认要删除吗？";
            this.$hMsgBox.confirm({
                title:"确认要继续提交申请吗?",
                content:content,
                onOk: () => {
                    post({ code: id ,deleteFlag:"1"}, url).then(res => {
                        if (res) {
                            if (res) {
                                let retCode = res.data.retCode;
                                if (retCode === "000000") {
                                    this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                                    this.dataTmpSelectReset();
                                } else {
                                    this.$msgTip.error(this, { info: res.data.retMsg });
                                }
                            } else {
                                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                            }
                        }
                    });
                }
            });
        },
      /*brchCodeWinOpen() {
        this.brchCodeWin = true;
      },*/
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        this.addForm.custBrchCode = info.brchCode;
        this.addForm.custName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      handleWinClose() {
        this.addForm.id = null;
        this.addForm.ownedBrchName = "";
        this.$refs.addForm.resetFields();
        this.addForm.custName = "";
        this.addForm.custBrchCode = "";
        this.dataTmpSelectReset();
        this.billManageFormItem.batchId = "";
        this.$refs.datagridbill.$refs.gridPage.clearElevator();
      },
      handlesplitMoneyWinClose() {
        this.splitMoneyForm.billNo = "";
        this.splitMoneyForm.billPackageMoney = "";
        this.splitMoneyForm.transAmt = "";
        this.$refs.splitMoneyForm.resetFields();
        this.splitMoneyForm.billOrigin = "";
        this.splitMoneyForm.billRangeEnd = "";
        this.splitMoneyForm.listId = "",
        this.splitMoneyWin = false;
      },
      cancelSplit(){
        let listId = this.splitMoneyForm.listId;
        post({ id: listId,funcNo : "PIPB010102"}, "bp/guaranty/apply/func_cancelSplitGuarantyBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.handlesplitMoneyWinClose();
            } else {
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError")});
          }
        });
      },

      splitBill(){
        this.$refs["splitMoneyForm"].validate(valid => {
          if (valid) {
            if (!(this.splitMoneyForm.billOrigin=="CS02"||this.splitMoneyForm.billOrigin=="CS03")){
              this.$msgTip.error(this, { info: "只有票据来源为金融机构票据或供应链票据可以拆包" });
              return;
            }
            if (this.splitMoneyForm.billRangeEnd == 0){
              this.$msgTip.error(this, { info: "该票为零票，不能进行拆包" });
              return;
            }
            let billMoney = this.splitMoneyForm.billPackageMoney;
            let transAmt = this.splitMoneyForm.transAmt;
            let listId = this.splitMoneyForm.listId;
            if (billMoney == transAmt){
              this.$msgTip.error(this, { info: "交易金额和票据包金额相同，不需要拆包" });
              return;
            }
            post({ id: listId,funcNo : "PIPB010102",transAmt:transAmt}, "bp/guaranty/apply/func_splitGuarantyBill").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
                  this.handlesplitMoneyWinClose();
                } else {
                  this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      closeAddOrEditWin() {
        this.addForm.id = null;
        this.addOrEditWin = false;
        this.$refs.addForm.resetFields();
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.dataTmpSelectReset();
      },
      pickBillWinOpen(){
        this.addFormSave('1')
      },
      pickBillWinClose() {
        this.pickBillWin = false;
      },
      queryBillManageFormItem(batchId, type) {
        if (type == "modify" || type == "view" || this.type == "cancel") {
          this.billManageFormItem.batchId = batchId;
          this.addForm.id = batchId;
          this.$refs.datagridbill.dataChange(1);
        } else {
          if (this.$refs.datagridbill.total > 0) {
            this.billManageFormItem.batchId = null;
            this.$refs.datagridbill.dataChange(1);
          }
        }
      },
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },
      showCustManagerWinOpen() {
        this.showCustManagerWin = true;
      },
      showCustManagerWinChange(info) {
        this.addForm.custMgrNo = info.custMgrNo;
        this.showCustManagerWin = false;
      },
      // 挑票保存
      pickCodeChange(infos) {
        let hldrIds = Array();
        let billIds = Array();
        if (infos != null && infos.length > 0) {
          for (let i = 0; i < infos.length; i++) {
            hldrIds.push(infos[i].hldrId);
            billIds.push(infos[i].billId);
          }
        }
        post({
          hldrIds: hldrIds,
          billIds: billIds,
          batchId: this.billManageFormItem.batchId,
          ownedBrchNo:infos[0].ownedBrchNo
        }, "/bp/guaranty/apply/func_pickGuarantyBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: "挑票明细保存成功" });
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagridbill.dataChange(1);
              this.isHaveBill = true;
              this.pickBillWinClose();
            } else {
              this.$msgTip.error(this, { info: "挑票保存失败，失败原因:" + res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            return;
          }
        });
      },
      beforeSubmit(str) {
        if (str === "choice") {
          this.tmpSelectList = this.$refs.datagridbill.selects;
          if (!this.checkMoreOne(this.tmpSelectList)) {
            return;
          }
        }
        this.$hMsgBox.confirm({
          title: "提交信息",
          content: "确定要提交吗?",
          onOk: () => {
            this.itemSubmit(str);
          }
        });
      },
      itemSubmit(str) {
        let listIds = Array(), warteeBatchId = null;
        if (str === "choice") {
          this.tmpSelectList = this.$refs.datagridbill.selects;
          if (!this.checkMoreOne(this.tmpSelectList)) {
            return;
          }
          for (let i = 0; i < this.tmpSelectList.length; i++) {
            listIds.push(this.tmpSelectList[i].id);
          }
        } else {
          if (!this.checkGridMoreOne()) {
            return;
          }
        }
        warteeBatchId = this.billManageFormItem.batchId;
        post({
          listIds: listIds,
          batchId: warteeBatchId,
          ownedBrchNo:this.addForm.ownedBrchNo,
          funcNo:"PIPB010102",
          licenseFlag:this.licenseFlag
        }, "bp/guaranty/apply/func_commitGuaranty").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "提交成功" });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.dataTmpSelectReset();
              this.addOrEditWin = false;
            } else {
              this.$msgTip.error(this, { info: "提交失败" + res.data.retMsg });
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.dataTmpSelectReset();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      beforeDelete(str) {
        this.tmpSelectList = this.$refs.datagridbill.selects;
        if (str === "choice" && !this.checkMoreOne(this.tmpSelectList)) {
          return;
        }
        this.$hMsgBox.confirm({
          title: "删除",
          content: this.$t("m.i.be.confirmDelBill") + "?",
          onOk: () => {
            this.itemDelete(str);
          }
        });
      },
      itemDelete(str) {
        let listIds = Array(), warteeBatchId = null;
        warteeBatchId = this.billManageFormItem.batchId;
        if (str === "choice") {
          this.tmpSelectList = this.$refs.datagridbill.selects;
          if (!this.checkMoreOne(this.tmpSelectList)) {
            return;
          }
          for (let i = 0; i < this.tmpSelectList.length; i++) {
            listIds.push(this.tmpSelectList[i].id);
          }
        } else {
          if (!this.checkGridMoreOne()) {
            return;
          }
        }
        post({
          listIds: listIds,
          batchId: warteeBatchId,
          funcNo:"PIPB010102",
        }, "bp/guaranty/apply/func_deleteGuarantyBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              let count = this.$refs.datagridbill.total;
              if (str === "all"){
                this.isHaveBill = false;
              }else{
                if (this.$refs.datagridbill.total === listIds.length){
                  this.isHaveBill = false;
                }else{
                  this.isHaveBill = true;
                }
              }
              this.dataTmpSelectReset();
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.dataTmpSelectReset();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      itemCancel() {
        let warteeBillIds = null, warteeBatchId = null;
        warteeBatchId = this.billManageFormItem.batchId;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmRollBack") + "?",
          onOk: () => {
            this.cancelWarteeBill(warteeBillIds, warteeBatchId);
          }
        });
      },

      splitMoney() {
        this.tmpSelectList = this.$refs.datagridbill.selects;
        this.checkOnlyOne(this.tmpSelectList);
        this.splitMoneyForm.billNo = this.tmpSelectList[0].billNo;
        this.splitMoneyForm.billPackageMoney = this.tmpSelectList[0].billMoney;
        this.splitMoneyForm.transAmt = this.tmpSelectList[0].transAmt;
        this.splitMoneyForm.billOrigin = this.tmpSelectList[0].billOrigin;
        this.splitMoneyForm.billRangeEnd = this.tmpSelectList[0].billRangeEnd;
        this.splitMoneyForm.listId = this.tmpSelectList[0].id;
        this.splitMoneyWin = true;
      },

      cancelWarteeBill(warteeBillIds, warteeBatchId) {
        post({
          funcNo: "PIPB010109",
          batchId: warteeBatchId
        }, "bp/guaranty/apply/func_cancelCommitGuaranty").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: "撤销成功" });
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.dataTmpSelectReset();
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.addOrEditWin = false;
            } else {
              this.$msgTip.error(this, { info: "撤销失败：" + res.data.retMsg });
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.dataTmpSelectReset();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
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
      //超链接点击批次号弹出票据明细
      showBillList(list) {
        this.type= "modify";
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.readonly = true;
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
          if(this.licenseFlag){
              this.addForm.ownedBrchName =list.ownedBrchName;
              this.addForm.ownedBrchNo = list.ownedBrchNo;
          }
          this.addForm.ownedBrchName =list.transBrchName;
          this.addForm.ownedBrchNo = list.transBrchNo;
          this.billManageFormItem.batchId = list.id;
          this.$refs.datagridbill.dataChange(1);
        });
      },
      checkOnlyOne(selectList) {
        if (selectList == null || selectList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
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
      /*clearVal(optType) {
        if (optType === "custName") {
          this.addForm.custBrchCode = "";
          this.addForm.custName = "";
        }
      },*/

      //根据弹框所选数据进行赋值
/*      brchNoChange(info) {
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
          if(info.length>0 && this.licenseFlag===true){
              this.addForm.transBrchNo = info[0].brchNo;
              this.addForm.brchName = info[0].brchName;
          }
      },
    /*  brchNoWinOpen1() {
        this.brchNoWin1 = true;
      },
      brchNoWinClose1() {
        this.brchNoWin1 = false;
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
