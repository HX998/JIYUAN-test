<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.isCommit')+'：'" prop="isCommit">
                  <h-radio-group v-model="formItem.isCommit">
                    <h-radio label="noCommit" @on-click="noCommitButton">
                      <span>未提交</span>
                    </h-radio>
                    <h-radio label="hasCommit" @on-click="hasCommitButton">
                      <span>已提交</span>
                    </h-radio>
                  </h-radio-group>
                </h-form-item>
                <show-branch v-model="formItem.ownedBrchNames"  :label="$t('m.i.common.ownedBrchNo')"  prop="ownedBrchNames"
                             v-if="this.licenseFlag"    :showCheckBox="true"     :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                             :params="{authPath:this.$route.path}"
                             url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                             queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>

                <h-form-item :label="$t('m.i.common.batchNo')" prop="batchNo">
                    <h-input v-model="formItem.batchNo"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.pawneeName')" prop="custName">
                    <h-input v-model="formItem.custName"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.pawneeBrchCode')" class="h-form-long-label" prop="custBrchCode">
                    <h-input v-model="formItem.custBrchCode"></h-input>
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
            highlight-row
            url="/pb/trust/impawn/impawnApply/func_queryPendingImpawnApplyBatch"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" :disabled="hasCommitDisabled">
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" :disabled="hasCommitDisabled">
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm()" :disabled="hasCommitDisabled"
                        v-if="authObj.bizSetRoleDelete">{{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="rollbackComfirm()" :disabled="noCommitDisabled"
                        v-if="authObj.bizSetRoleDelete">{{$t('m.i.common.revoke')}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" height="400" class="h-form-table-layer"
               @on-close="handleWinClose" @on-maximize="onMaximize" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增申请</span>
        <span v-if="type=='modify'">修改申请</span>
        <span v-if="type=='view'">查看批次明细信息</span>
        <span v-if="type=='cancel'">撤销</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.billType" :title="addForm.billType" readonly showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type=='modify'" :value="addForm.billType" :title="addForm.billType" readonly showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billType" :readonly="readonly" showTitle>
              <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" :required="isRequired">
            <h-select v-if="type=='view'" :value="addForm.billClass" :title="addForm.billClass" readonly showTitle>
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else-if="type=='modify'" :value="addForm.billClass" :title="addForm.billClass" readonly showTitle>
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
            <h-select v-else v-model="addForm.billClass" :readonly="readonly" showTitle>
              <h-option v-for="item in cdMediaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <show-cpes-branch  :label="$t('m.i.be.pawneeName')"  :required="isRequired"
                             :brchCode.sync="addForm.custBrchCode"  :cpesBrchName.sync="addForm.custName"
                             :msgBoxWin="addOrEditWin" :isInitValueClearable="true"
                             datagridUrl="/cpes/branch/queryBranchList" prop="custName"
                             queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.be.pawneeBrchCode')" prop="custBrchCode" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.custBrchCode" :title="addForm.custBrchCode" readonly></h-input>
            <h-input v-else v-model="addForm.custBrchCode" :maxlength=60 readonly></h-input>
          </h-form-item>



          <h-form-item :label="$t('m.i.common.applDt')" prop="impawnDt" :required="isRequired">
            <h-date-picker v-if="type=='view' || type == 'cancel'" readonly :value="addForm.impawnDt" showFormat :title="addForm.impawnDt"
                           type="date"></h-date-picker>
            <h-date-picker v-else v-model="addForm.impawnDt" showFormat :maxlength=60 type="date"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrNo')" prop="custMgrNo">
            <h-input v-if="type=='view'" readonly :value="addForm.custMgrNo" :title="addForm.custMgrNo"></h-input>
            <h-input v-else v-model="addForm.custMgrNo" :maxlength=60 readonly
                     icon="android-search" @on-click="showCusManager" clearable></h-input>
          </h-form-item>

          <show-branch v-model="addForm.transBrchNo"  :label="$t('m.i.be.pledgorBrchName')" prop="transBrchNo" :required="isRequired"
                       :filterable="this.type==='add'"     :showCheckBox="false"   :msgBoxWin="addOrEditWin"     :brchNo.sync="addForm.transBrchNo" :brchName.sync="addForm.applBrchName"  @brchNoChange="licenseBrchNoChange($event)"
                       :params="{authPath:this.$route.path}"
                       url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                       queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
          </show-branch>

          <h-form-item>
            <h-button type="primary" style="" @click="addFormSave()" v-show="noRollBackDisabled">
              {{$t("m.i.common.save")}}
            </h-button>
          </h-form-item>
        </h-form>
      </h-panel>
      <h-datagrid
        :columns="impawnBill.billColumns"
        highlight-row
        :bindForm="formItem"
        :gridData="billList"
        :auto-load="false"
        :hasSelect="false"
        :row-select="noCommitDisabled"
        @on-page-change="handlePage"
        :onSelectChange="onCurrentBillChange"
        ref="datagridbill">
        <div slot="toolbar" class="pull-left">
          <h-button type="primary" v-show="noRollBackDisabled" v-if="authObj.bizSetRoleAdd"
                    @click="pickBillWinOpen">{{$t("m.i.common.pickBill")}}
          </h-button>
          <h-dropdown trigger="click" @on-click="deleteBillBtn">
            <h-button type="primary" v-show="noRollBackDisabled" v-if="authObj.bizSetRoleAdd">{{$t("m.i.common.delete")}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectDelete">选择删除</h-dropdown-item>
              <h-dropdown-item name="listDelete">批次删除</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="primary" v-show="noRollBackDisabled" v-if="authObj.bizSetRoleAdd" @click="updateBillBtn">
            {{$t('m.i.be.editRemark')}}
          </h-button>
          <!--<h-button type="primary" v-show="noRollBackDisabled" v-if="authObj.bizSetRoleAdd" @click="updateTransAmtBtn" :disabled="hasAmtDisabled">
            {{$t('m.i.be.editTransAmt')}}
          </h-button>-->
          <h-dropdown trigger="click" @on-click="submitBatch">
            <h-button type="primary" v-show="noRollBackDisabled" v-if="authObj.bizSetRoleAdd">{{$t("m.i.be.submission")}}
              <h-icon name="unfold"></h-icon>
            </h-button>
            <h-dropdown-menu slot="list">
              <h-dropdown-item name="selectSubmit">选择提交</h-dropdown-item>
              <h-dropdown-item name="listSubmit">批次提交</h-dropdown-item>
            </h-dropdown-menu>
          </h-dropdown>
          <h-button type="primary" v-show="hasRollBackDisabled" v-if="authObj.bizSetRoleDelete"
                    @click="rollbackOrNot">{{$t('m.i.common.revoke')}}
          </h-button>
        </div>
      </h-datagrid>

      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <!--<h-button type="ghost" @click="closeAddOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="closeAddOrEditWin">{{$t("m.i.common.commit")}}</h-button>-->
      </div>
    </h-msg-box>

    <h-msg-box v-model="editRemarkWin" class="h-form-table-layer"
               @on-close="editRemarkWinClose" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>修改备注信息</span>
      </p>

      <h-form :model="addForm" :label-width="120" ref="addForm1" cols="2" class="h-form-search">
        <h-form-item :label="$t('m.i.be.unImpawnRemark')" prop="respRemark">
          <h-input v-model="addForm.respRemark" style="width: 200px;" :rows=3 :maxlength=60></h-input>
        </h-form-item>
      </h-form>

      <div slot="footer">
        <h-button type="primary" @click="addFormReset()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <h-msg-box v-model="editTransAmtWin" width="700" height="200" class="h-form-table-layer"
               @on-close="editTransAmtClose" :maximize="true" @on-maximize="onMaximize">
      <p slot="header">
        <span>调整票据交易金额</span>
      </p>

      <h-form :model="splitMoneyForm" :label-width="120" ref="addForm2" cols="1" class="h-form-search">
        <common-input v-model="splitMoneyForm.billNo" :label="$t('m.i.billInfo.billPackageNo')" prop="billNo" :required="true"  readonly></common-input>

        <common-type-field v-model="splitMoneyForm.billPackageMoney" :label="$t('m.i.billInfo.billPackageMoney')" prop="billPackageMoney"
                           :required="true" readonly></common-type-field>
        <h-form-item :label="$t('m.i.be.editTransAmt')" prop="transAmt" :required="isRequired" >
          <h-typefield type="money" v-model="splitMoneyForm.transAmt" placeholder="" integerNum="10"></h-typefield>
        </h-form-item>
      </h-form>

      <div slot="footer">
        <h-button type="primary" @click="editTransAmtClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="cancelSplit" >{{$t("m.i.common.cancelSplit")}}</h-button>
        <h-button type="primary" @click="editTransAmSubmit()">{{$t("m.i.common.split")}}</h-button>
      </div>
    </h-msg-box>

    <!--<brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>-->

    <pick-bill :pickBillWin="pickBillWin" @pickBillWinClose="pickBillWinClose"
               @pickBillChange="pickBillChange" :batchId="addForm.id" :billClass="addForm.billClass"
               :billType="addForm.billType" :ownedBrchNo="addForm.ownedBrchNo" :licenseFlag="this.licenseFlag"></pick-bill>

    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="'选择客户经理'"
                       @showCustManagerWinClose="showCustManagerWinClose"
                       @custManagerSelect="custManagerSelect"></show-cust-manager>

    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId" :billRangeEnd = "this.billRangeEnd" :billRangeStart = "this.billRangeStart"></bill-info-main>


    <!--  <show-license-branch :showBranchWin="brchNoWin" title="机构查询" @brchNoChange="brchNoChange" :authPath="authPath"
                           @showBranchWinClose="brchNoWinClose" :ifcheck="true"
                           :checkStrictly="true"></show-license-branch>-->
  <!-- <show-license-branch :showBranchWin="brchNoWin1" title="机构查询" @brchNoChange="licenseBrchNoChange" :authPath="authPath"
                         @showBranchWinClose="brchNoWinClose1" :ifcheck="false"
                         :checkStrictly="true"></show-license-branch>-->


  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "impawnApply",
    components: {
      //BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      PickBill: () => import(/* webpackChunkName: "be/trust/impawn/impawnPickBill" */`@/views/bizViews/be/trust/impawn/impawnPickBill`),
      showCustManager: () => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`),
      //ShowLicenseBranch: () => import(/* webpackChunkName: "sm/auth/branch/showLicenseBranch" */`@/views/bizViews/sm/auth/branch/showLicenseBranch`)

    },
    data() {
      return {
        formItem: {
          isCommit: "noCommit",
          batchNo: "",
          custName: "",
          custBrchCode: "",
          isValid: "0",
          ownedBrchName: "",
          ownedBrchNo: "",
          ownedBrchNames:"",
          ownedBrchNos:"",
          authPath: this.$route.path,
          queryFlag:"2",
          funcNo:"PIPB030202",
        },
        splitMoneyForm:{
          billNo:"",
          billPackageMoney:"",
          transAmt:"",
          billOrigin:"",
          billRangeStart:"",
          billRangeEnd:"",
          impawnIds:"",
          batchId:"",
        },
        addForm: {
          id: "",
          batchId: "",
          legalNo: "",
          memberId: "",
          transBrchNo: "",
          brchName: "",
          applBrchCode: "",
          applBrchName:"",
          transCtrctNo: "",
          trDir: null,
          custNo: "",
          custName: "",
          custBrchNo: "",
          custBrchCode: "",
          custBankNo: "",
          impawnDt: "",
          prodNo: "",
          acctTellerNo: "",
          checkTellerNo: "",
          applTellerName: "",
          checkTellerName: "",
          totalAmt: "",
          totalNum: "",
          createTime: "",
          updateTime: "",
          billNo: "",
          billClass: "",
          billType: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          drwrName: "",
          acptName: "",
          billIdsStr: "",
          impawnRemark: "",
          queryType: "",
          custMgrNo: "",
          isValid: "0",
          ownedBrchNo:"",
          ownedBrchName:"",
          licenseFlag:false,
          impawnPbApplDto:[{
            billId:"",
            hldrId:"",
          }],
          impawnIds:"",
          respRemark:"",
          transAmt:"",
        },
        columns: [
          {
            title: " ",
            type: "radio",
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
            title: this.$t('m.i.be.pawneeName'),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.be.pawneeBrchCode'),
            key: "custBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.sumMoney'),
            key: "sumMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.sumMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.be.totalCount'),
            key: "sumCount",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.applDt'),
            key: "impawnDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let impawnDt = this.$moment(params.row.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", impawnDt);
            }
          }
        ],
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
        currentSelectBillList: [],
        currentSelectRow: null,
        billTypeList: [],
        cdMediaList: [],
        dictMap: null,
        hadAdd: false,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        //修改备注窗口
        editRemarkWin: false,
        //调整交易金额窗口
        editTransAmtWin:false,
        uploadFileName: "",
        fileId: "",
        type: null,
        readonly: false,
        isRequired: true,
        hasCommitDisabled: false,
        noCommitDisabled: true,
        hasAmtDisabled:true,
        hasRollBackDisabled: false,
        noRollBackDisabled: false,
        submitFlag: false,
        ifShowMore: false,
        //brchCodeWin: false,
        pickBillWin: false,
        isRollBack: false,
        showCustManagerWin: false,
        id: "",
        batchIds: "",
        showBillInfoWin: false,
        billId: null,
        billRangeStart:"",
        billRangeEnd:"",
        //授权信息
        ownedBrchName: "",
        ownedBrchNo: "",
        ownedBrchNames: "",
        ownedBrchNos: "",
        licenseFlag: false,
        authPath: this.$route.path,
        //brchNoWin: false,
        //brchNoWin1:false,
        impawnBill: {
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
              title: this.$t("m.i.billInfo.billOrigin"),   //票据来源
              key: "billOrigin",
              hiddenCol: false,
              render: (h, params) => {
                let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : this.getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t('m.i.billInfo.billPackageNo'), //票据（包）号码
              key: "billNo",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                return h("a", {
                  on: {
                    click: () => {
                      this.showBillInfo(params.row);
                    }
                  }
                }, params.row.billNo);
              }
            },
            {
              title: this.$t("m.i.billInfo.billRange"),   //子票区间
              key: "billRange",
              hiddenCol: false,
              render:(h,params) => {
                let billOrigin = params.row.billOrigin;
                let billRangeStart = params.row.billRangeStart;
                let billRangeEnd = params.row.billRangeEnd;
                return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
              }
            },
            {
              title: this.$t('m.i.billInfo.billPackageMoney'),   //票据(包)金额
              key: "billMoney",
              sortable: true,
              hiddenCol: false,
              render: (h, params) => {
                return h('span', formatNumber(params.row.billMoney, 2, ','))
              }
            },
            {
              title: this.$t("m.i.billInfo.flowStatus"),
              key: "flowStatusName",
              hiddenCol: false
            },
            {
              title: this.$t('m.i.billInfo.billType'),
              key: "billType",
              hiddenCol: false,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
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
                let list = this.getDictValueFromMap(this.dictMap,"CDMedia",params.row.billClass);
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
              hiddenCol: false,
              sortable: true,
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
            },
            {
              title: this.$t('m.i.be.unImpawnRemark'),
              key: "respRemark",
              hiddenCol: false
            }
          ]
        },
        billList: {
          list: [],
          pageInfo: {
            count: 0,
            pageNo: 1,
            pageSize: 10
          }
        },
        batchId: null
      }
    },
    methods: {
      onMaximize() {
        this.$refs.datagridbill.$refs.gridContent.handleResize();
      },
      // 分页事件
      handlePage(pageNo, pageSize) {
        let obj = Object.assign({}, this.formItem, { batchId: this.batchId }, { pageNo: pageNo, pageSize: pageSize });
        this.queryBillList(obj);
      },
      // 查询票据清单
      queryBillList(obj) {
        post(obj, "/pb/trust/impawn/impawnApply/func_queryImpawnApplyBill").then(res => {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.billList = res.data.retData;
          }
        });
      },
      /* 保存质押批次 */
      addFormSave() {
        this.addFormSaveFunc(this, res => {
          if (this.type === "modify") {
            this.$msgTip.success(this, { info: this.$t("m.i.common.modifySuccess") });
          } else if (this.type === "add") {
            this.$msgTip.success(this, { info: this.$t("m.i.common.saveSuccess") });
          }
          this.type = "modify";
        });
      },
      addFormSaveFunc(_this, networkOk) {
        _this.$refs["addForm"].validate(valid => {
          if (valid) {
            let btnType = _this.type;
            if (btnType === "add") {
              _this.addForm.id = null;
            }
            let url = "/pb/trust/impawn/impawnApply/func_submitAddImpawnApplyBatch";
            let impawnDt = _this.addForm.impawnDt;
            _this.addForm.impawnDt = _this.$moment(impawnDt).format("YYYYMMDD");
            _this.submitFlag = true;
            _this.addForm.licenseFlag = this.licenseFlag;
            post(_this.addForm, url).then(res => {
              _this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let data = res.data.retData;
                  _this.addForm.id = data.id;
                  _this.addForm.batchNo = data.batchNo;
                  _this.batchId = data.id;
                  _this.hadAdd = true;
                  _this.type = "modify";
                  _this.currentSelectRow = null;
                  _this.currentSelectList = [];
                  _this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  networkOk(data.id);
                } else {
                  _this.$msgTip.error(_this, { info: _this.$t("m.i.common.saveFailed") + res.data.retMsg });
                  _this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                _this.$msgTip.error(_this, { info: _this.$t("m.i.common.netError") });
              }

            });
          }
        });
      },
      handleAddForm(str) {
        this.noRollBackDisabled = true;
        this.hasRollBackDisabled = false;
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.licenseFlag = this.licenseFlag;
        if (this.type == "modify" || this.type == "view") {
          if (this.currentSelectRow == null) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          this.$nextTick(() => {
          this.readonly = true;
          //从页面拿值
          this.addForm.billType = this.currentSelectRow.billType;
          this.addForm.billClass = this.currentSelectRow.billClass;
          this.addForm.custName = this.currentSelectRow.custName;
          this.addForm.custBrchCode = this.currentSelectRow.custBrchCode;
          if (this.currentSelectRow.impawnDt) {
            this.addForm.impawnDt = this.$moment(this.currentSelectRow.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.impawnDt = this.currentSelectRow.impawnDt;
          }
          this.addForm.custMgrNo = this.currentSelectRow.custMgrNo;
          this.addForm.applBrchName = this.currentSelectRow.applBrchName;
          this.addForm.transBrchNo = this.currentSelectRow.transBrchNo;
          this.addForm.batchNo = this.currentSelectRow.batchNo;
          this.addForm.id = this.currentSelectRow.id;
          this.addForm.ownedBrchNo = this.currentSelectRow.transBrchNo;
          this.addForm.ownedBrchName = this.currentSelectRow.applBrchName;
          this.queryObjById(this.currentSelectRow.id,"PIPB030202");
          if (this.type == "modify") {
            this.readonly = true;
          }
          if (this.type == "view") {
            this.isRequired = false;
          }
          });
        } else {
          this.$nextTick(() => {
            this.$refs.addForm.resetFields();
            this.addForm.id = "";
            this.isRequired = true;
            this.billList = {
              list: [],
              pageInfo: {
                count: 0,
                pageNo: 1,
                pageSize: 10
              }
            };
            post({}, "/pb/trust/impawn/impawnApply/func_getCurUserInfo").then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let data = res.data.retData;
                  this.addForm.impawnDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
                  this.addForm.transBrchNo = data.brchNo;
                  this.addForm.applBrchName = data.brchName;
                  this.addForm.ownedBrchNo = data.brchNo;
                  this.addForm.ownedBrchName = data.brchName;
                  this.addForm.licenseFlag = this.licenseFlag;
                } else {
                  this.$msgTip.info(this, { info: this.$t("m.i.common.netError") });
                }
              } else {
                this.$msgTip.info(this, { info: this.$t("m.i.common.netError") });
                return;
              }
            });
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.editRemarkWin = false;
        this.addForm.impawnRemark = null;
      },
      editTransAmtClose(){
        this.editTransAmtWin = false;
        this.addForm.transAmt = null;
      },

      queryObjById(id,funcNo) {
        let batchId = id;
        this.batchId = id;
        post({
          batchId: id + "",
          isValid: this.formItem.isValid,
          funcNo:funcNo
        }, "pb/trust/impawn/impawnApply/func_queryImpawnApplyBill").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;
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

      /* 撤销按钮查询票据明细 */
      queryRollBackById(id,funcNo) {
        let batchId = id;
        this.batchId = id;
        //post({ batchId: id + "" ,isValid: this.formItem.isValid}, "pb/trust/impawn/impawnApply/func_queryImpawnApplyRollBackBill").then(res => {
        post({ batchId: id + "" ,isValid: this.formItem.isValid,funcNo:funcNo}, "pb/trust/impawn/impawnApply/func_queryImpawnApplyBill").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;
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

      noCommitButton() {
        this.formItem.isValid = "0";
        this.formItem.funcNo = "PIPB030202";
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        this.impawnBill.billColumns[0].hiddenCol=false;
        this.formSearch();
      },
      hasCommitButton() {
        this.formItem.isValid = "1";
        this.formItem.funcNo = "PIPB030203";
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
        this.impawnBill.billColumns[0].hiddenCol=true;
        this.formSearch();
      },

      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      onCurrentBillChange(arr, selectInx) {
        debugger;
        this.currentSelectList = arr;
        if(this.currentSelectList.length == 0 || this.currentSelectList.length > 1){
          this.hasAmtDisabled = true;
        }else{
          let billNo = this.currentSelectList[0].billNo;
          let billClass = this.currentSelectList[0].billClass;
          let billPackageMoney = this.currentSelectList[0].originBillMoney;
          let transAmt = this.currentSelectList[0].billMoney;
          let billOrigin = this.currentSelectList[0].billOrigin;
          let billRangeStart = this.currentSelectList[0].billRangeStart;
          let billRangeEnd = this.currentSelectList[0].billRangeEnd;
          if(billClass == "ME01" || billOrigin == "CS01") {
            this.hasAmtDisabled = true;
            return;
          }
          if(billRangeEnd == 0){
            this.hasAmtDisabled = true;
            return;
          }
          if(billRangeEnd == billRangeStart){
            this.hasAmtDisabled = true;
            return;
          }
          this.hasAmtDisabled = false;
        }
      },
      formSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.formItem.ownedBrchNo = "";
        this.formItem.ownedBrchName = "";
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
        this.formItem.batchNo = "";
        this.formItem.isValid = "0";
        this.formItem.funcNo = "PIPB030202";
        this.$refs.formItem.resetFields();
        this.hasCommitDisabled = false;
        this.noCommitDisabled = true;
      },
      handleComfirm() {
        if (this.currentSelectRow != null) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handledel();
            }
          });
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },

      /*删除批次*/
      handledel() {
        let batchIds = this.currentSelectRow.id;
        post({ id: batchIds, deleteFlag: "0" }, "pb/trust/impawn/impawnApply/func_submitImpawnBatchDel").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg  = res.data.retMsg ;
            if (retCode == "000000") {
              this.$msgTip.info(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = null;
            } else if(retCode === "000002" && retMsg === "100001"){
              this.continueApply(batchIds);
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      continueApply(id){
        let url="pb/trust/impawn/impawnApply/func_submitImpawnBatchDel";
        let content ="批次下所有明细将同时删除，确认要删除吗？";
        this.$hMsgBox.confirm({
          title:"确认要继续提交申请吗?",
          content:content,
          onOk: () => {
            post({ id: id ,deleteFlag:"1"}, url).then(res => {
              if (res) {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.info(this, { info: this.$t("m.i.common.deleteSuccess") });
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.currentSelectRow = null;
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
      /**撤销按钮**/
      rollbackComfirm() {
        if (this.currentSelectRow != null) {
          this.type = "cancel";
          this.isRollBack = true;
          this.addOrEditWin = true;
          this.addForm.billType = this.currentSelectRow.billType;
          this.addForm.billClass = this.currentSelectRow.billClass;
          this.addForm.custName = this.currentSelectRow.custName;
          this.addForm.custBrchCode = this.currentSelectRow.custBrchCode;
          if (this.currentSelectRow.impawnDt) {
            this.addForm.impawnDt = this.$moment(this.currentSelectRow.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.impawnDt = this.currentSelectRow.impawnDt;
          }
          this.addForm.custMgrNo = this.currentSelectRow.custMgrNo;
          this.addForm.applBrchName = this.currentSelectRow.applBrchName;
          this.queryRollBackById(this.currentSelectRow.id,this.formItem.funcNo);
          this.noRollBackDisabled = false;
          this.hasRollBackDisabled = true;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      rollbackOrNot() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmRollBack") + "?",
          onOk: () => {
            this.rollback();
          }
        });
      },
      /**撤销**/
      rollback() {
        this.addForm.impawnDt = this.$moment(this.addForm.impawnDt).format("YYYYMMDD");
        this.addForm.batchId = this.batchId;
        post(this.addForm, "pb/trust/impawn/impawnApply/func_rollBackImpawnBatch").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.rollBackSuccess") });
              this.hadAdd = true;
              this.queryRollBackById(this.addForm.batchId,this.formItem.funcNo);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = null;
              this.currentSelectList = [];
              this.addOrEditWin = false;
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.rollBackFailed") + res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      /**超链接点击票号弹出票据明细**/
      showBillInfo(row) {
        this.billId = row.billId;
        this.billRangeStart = "";
        this.billRangeEnd = "";
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.showBillInfoWin = false;
      },

      /**超链接点击批次号弹出票据明细**/
      showBillList(list) {
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.isRollBack = true;
          this.addForm.id = list.id;
          this.addForm.billType = list.billType;
          this.addForm.billClass = list.billClass;
          this.addForm.custName = list.custName;
          this.addForm.custBrchCode = list.custBrchCode;
          if (list.impawnDt) {
            this.addForm.impawnDt = this.$moment(list.impawnDt, "YYYYMMDD").format("YYYY-MM-DD");
          } else {
            this.addForm.impawnDt = list.impawnDt;
          }
          this.addForm.custMgrNo = list.custMgrNo;
          this.addForm.applBrchName = list.applBrchName;
          this.addForm.transBrchNo = list.transBrchNo;
          this.addForm.batchNo = list.batchNo;
          this.addForm.ownedBrchNo = list.transBrchNo;
          this.addForm.ownedBrchName = list.applBrchName;
          this.queryObjByAddForm(list.id,this.formItem.funcNo);
          if (this.noCommitDisabled) {
            this.type = "modify";
            this.noRollBackDisabled = true;
            this.hasRollBackDisabled = false;
            this.isRequired = true;
          } else if (this.hasCommitDisabled) {
            this.type = "cancel";
            this.noRollBackDisabled = false;
            this.hasRollBackDisabled = true;
          this.isRequired = false;
          }
          //this.isRequired = false;
          this.readonly = true;
        });
      },
      queryObjByAddForm(id,funcNo) {
        let batchId = id;
        this.batchId = id;
        post({
          batchId: id,
          isValid: this.formItem.isValid,
          funcNo:funcNo
        }, "pb/trust/impawn/impawnApply/func_queryImpawnApplyBill").then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.billList = res.data.retData;
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

      uploadSuccess(file, fileList, response) {
        this.uploadFileName = fileList.name;
        this.fileId = fileList.response.id;
      },

      // 展示客户经理选择界面
      showCusManager() {
        this.showCustManagerWin = true;
      },
      // 选择客户经理界面关闭
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },
      // 选择客户经理
      custManagerSelect(info) {
        this.addForm.custMgrNo = info.custMgrNo;
        this.showCustManagerWin = false;
      },
     /* brchCodeWinOpen() {
        this.brchCodeWin = true;
      },*/
      /*brchCodeWinClose() {
        this.brchCodeWin = false;
      },*/
      //点击挑票，打开弹框
      pickBillWinOpen() {
        this.addFormSaveFunc(this, res => {
          this.pickBillWin = true;
        });
      },
      pickBillWinClose() {
        this.pickBillWin = false;
      },
      //根据弹框所选数据进行赋值
      /*brchCodeChange(info) {
        this.addForm.custBrchCode = info.brchCode;
        this.addForm.custName = info.brchFullNameZh;
        this.brchCodeWin = false;
      },*/
      //根据弹框所选票进行赋值
      pickBillChange(info) {
        this.currentSelectList = info;
        this.addForm.impawnPbApplDto = [];
        for (let billIds of this.currentSelectList) {
          let ids = billIds.billId ;
          let hldrId = billIds.hldrId;
          //this.addForm.impawnPbApplDto.billId += billIds.billId + ",";
          let param = {billId:ids,hldrId: hldrId};
          this.addForm.impawnPbApplDto.push(param);
        }
        if (this.type == "add" && this.hadAdd == false) {
          this.addForm.id = "";
        } else if (this.type == "modify") {
          this.addForm.id = this.batchId;
          /*{code:billIdsStr,id:batchId}*/
        }
        let impawnDt = this.addForm.impawnDt;
        this.addForm.impawnDt = this.$moment(impawnDt).format("YYYYMMDD");
        post(this.addForm, "/pb/trust/impawn/impawnApply/func_addImpawnApplyBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              if (this.type === "modify") {
                this.$msgTip.success(this, { info: this.$t("m.i.common.modifySuccess") });
              } else if (this.type === "add") {
                this.$msgTip.success(this, { info: this.$t("m.i.common.saveSuccess") });
              }
              this.type = "modify";
              this.pickBillWin = false;
              this.batchId = res.data.retData.id;
              this.addForm.id = res.data.retData.id;
              this.hadAdd = true;
              let obj = Object.assign(this.formItem, { batchId: this.batchId });
              this.queryBillList(obj);
              let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
              this.$refs.datagrid.dataChange(pageNo);
            } else {
              this.$msgTip.error(this, { info: "挑票失败" + res.data.retMsg });
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: "m.i.common.netError" });
          }
        });
      },

      deleteBillBtn(obj) {
        if (this.batchId === null || this.batchId === "") {
          this.$msgTip.info(this, { info: this.$t("请先保存！") });
          return;
        }
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectDelete" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          if (obj == "selectDelete") {
            let list = this.currentSelectBillList;
            this.addForm.impawnIds = "";
            for (let i = 0; i < list.length; i++) {
              this.addForm.impawnIds += list[i].id;
              if (i < list.length - 1) {
                this.addForm.impawnIds += ",";
              }
            }
          } else {
            this.addForm.impawnIds = null;
          }
          this.addForm.batchId = this.batchId;
          if (this.addForm.impawnDt) {
            this.addForm.impawnDt = this.$moment(this.addForm.impawnDt).format("YYYYMMDD");
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.be.confirmDelBill") + "?",
            onOk: () => {
              post(this.addForm, "pb/trust/impawn/impawnApply/func_submitImpawnApplyBillDel").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    let obj = Object.assign(this.formItem, { batchId: this.batchId });
                    this.queryBillList(obj);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.deleteFailed") + ":" + res.data.retMsg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
                this.currentSelectRow = null;
                this.currentSelectList = [];
                this.currentSelectBillList = [];
                this.$refs.datagridbill.selectIds = [];
                this.$refs.datagridbill.selects = [];
                this.addForm.impawnIds = null;
                this.addForm.batchId = null;
                this.$refs.datagridbill.dataChange(1);
              });
            }
          });
        }
      },

      /* 修改明细按钮点击事件 */
      updateBillBtn() {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (this.currentSelectBillList.length > 0) {
          this.addForm.respRemark = "";
          this.addForm.impawnRemark = "";
          this.editRemarkWin = true;
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      /* 修改交易金额点击事件 */
      updateTransAmtBtn() {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (this.currentSelectBillList.length == 1) {
          this.editTransAmtWin = true;
        } else if(this.currentSelectBillList.length == 0){
          this.$msgTip.error(this, { info: this.$t("m.i.common.chooseOneData") });
          return false;
        } else{
          this.$msgTip.error(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return false;
        }
        this.splitMoneyForm.billNo = this.currentSelectBillList[0].billNo;
        this.splitMoneyForm.billPackageMoney = this.currentSelectBillList[0].originBillMoney;
        this.splitMoneyForm.transAmt = this.currentSelectBillList[0].billMoney;
        this.splitMoneyForm.billOrigin = this.currentSelectBillList[0].billOrigin;
        this.splitMoneyForm.billRangeStart = this.currentSelectBillList[0].billRangeStart;
        this.splitMoneyForm.billRangeEnd = this.currentSelectBillList[0].billRangeEnd;
      },
      submitForm() {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        let billIdsStr = "";
        for (let selectRow of this.currentSelectBillList) {
          billIdsStr += selectRow.id + ",";
        }
        this.addForm.billIdsStr = billIdsStr;
        this.addForm.impawnDt = this.$moment(this.addForm.impawnDt).format("YYYYMMDD");
        post(this.addForm, "pb/trust/impawn/impawnApply/func_submitRemark").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.editRemarkWin = false;
              this.$msgTip.success(this, { info: this.$t("m.i.common.modifySuccess") });
              this.currentSelectBillList = [];
              this.$refs.datagridbill.selects = [];
              this.$refs.datagridbill.selectIds = [];
              let obj = Object.assign(this.formItem, { batchId: this.batchId });
              this.queryBillList(obj);
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.modifyFailed")+":" + res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      editTransAmSubmit() {
        this.$refs["addForm2"].validate(valid => {
          if (valid) {
            if (!(this.splitMoneyForm.billOrigin=="CS02"||this.splitMoneyForm.billOrigin=="CS03")){
              this.$msgTip.error(this, { info: "只有票据来源为金融机构票据或供应链票据可以拆包" });
              return;
            }
            if (this.splitMoneyForm.billRangeEnd == 0){
              this.$msgTip.error(this, { info: "该票为零票，不能进行拆包" });
              return;
            }
            if (this.splitMoneyForm.billRangeStart == this.splitMoneyForm.billRangeEnd){
              this.$msgTip.error(this, { info: "票据包子票区间不可拆" });
              return;
            }
            let billMoney = this.splitMoneyForm.billPackageMoney;
            let transAmt = this.splitMoneyForm.transAmt;
            if(transAmt <= 0){
              this.$msgTip.error(this, { info: "交易金额输入非法" });
              return;
            }
            if (billMoney == transAmt){
              this.$msgTip.error(this, { info: "交易金额和票据包金额相同，不需要拆包" });
              return;
            }

            this.splitMoneyForm.batchId = this.batchId;
            this.currentSelectBillList = this.$refs.datagridbill.selects;
            let list = this.currentSelectBillList;
            this.splitMoneyForm.impawnIds = "";
            for (let i = 0; i < list.length; i++) {
              this.splitMoneyForm.impawnIds += list[i].id;
              if (i < list.length - 1) {
                this.splitMoneyForm.impawnIds += ",";
              }
            }
            //this.addForm.impawnDt = this.$moment(this.addForm.impawnDt).format("YYYYMMDD");
            post(this.splitMoneyForm, "pb/trust/impawn/impawnApplyAccount/func_adjustTransAmt").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.editTransAmtWin = false;
                  this.$msgTip.success(this, { info: this.$t("m.i.common.modifySuccess") });
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.splitMoneyForm.impawnIds = null;
                  this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
                  /*let obj = Object.assign(this.formItem, { batchId: this.batchId });
                  this.queryBillList(obj);*/
                } else {
                  this.splitMoneyForm.impawnIds = null;
                  this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
                  this.$msgTip.error(this, { info: this.$t("m.i.common.modifyFailed")+":" + res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      cancelSplit(){
        this.splitMoneyForm.batchId = this.batchId;
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        let list = this.currentSelectBillList;
        this.splitMoneyForm.impawnIds = "";
        for (let i = 0; i < list.length; i++) {
          this.splitMoneyForm.impawnIds += list[i].id;
          if (i < list.length - 1) {
            this.splitMoneyForm.impawnIds += ",";
          }
        }
        post(this.splitMoneyForm, "pb/trust/impawn/impawnApplyAccount/func_cancelAdjustTransAmt").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.currentSelectBillList = [];
              this.$refs.datagridbill.selects = [];
              this.$refs.datagridbill.selectIds = [];
              this.splitMoneyForm.impawnIds = null;
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.editTransAmtWin = false;
            } else {
              this.splitMoneyForm.impawnIds = null;
              this.$refs.datagridbill.dataChange(this.$refs.datagridbill.pageInfo.pageNo);
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError")});
          }
        });
      },

      submitBatch(obj) {
        this.addFormSaveFunc(this, this.dealSubmitBatch(obj));
      },

      /* 提交批次到审批流 */
      dealSubmitBatch(obj) {
        this.currentSelectBillList = this.$refs.datagridbill.selects;
        if (obj == "selectSubmit" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          if (obj == "selectSubmit") {
            let list = this.currentSelectBillList;
            this.addForm.impawnIds = "";
            for (let i = 0; i < list.length; i++) {
              this.addForm.impawnIds += list[i].id;
              if (i < list.length - 1) {
                this.addForm.impawnIds += ",";
              }
            }
          } else {
            this.addForm.impawnIds = null;
          }
          this.addForm.batchId = this.batchId;
          if (this.addForm.impawnDt) {
            this.addForm.impawnDt = this.$moment(this.addForm.impawnDt).format("YYYYMMDD");
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.confirmCommit") + "?",
            onOk: () => {
              post(this.addForm, "/pb/trust/impawn/impawnApply/func_submitImpawnBatch").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    let obj = Object.assign(this.formItem, { batchId: this.batchId });
                    this.queryBillList(obj);
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.currentSelectBillList = [];
                    this.$refs.datagridbill.selects = [];
                    this.$refs.datagridbill.selectIds = [];
                    this.$msgTip.success(this, { info: this.$t("m.i.common.commitSuccess") });
                    this.addOrEditWin = false;
                    this.addForm.impawnIds = null;
                  } else {
                    this.$msgTip.error(this, { info: this.$t("m.i.common.commitFailed")+":" + res.data.retMsg });
                    this.currentSelectBillList = [];
                    this.$refs.datagridbill.selects = [];
                    this.$refs.datagridbill.selectIds = [];
                    this.$refs.datagridbill.dataChange(1);
                    this.addForm.impawnIds = null;
                  }
                } else {
                  this.currentSelectBillList = [];
                  this.$refs.datagridbill.selects = [];
                  this.$refs.datagridbill.selectIds = [];
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                  this.addForm.impawnIds = null;
                }
                this.$refs.datagrid.dataChange(1);
              });
            }
          });
        }
      },

      handleWinClose() {
        this.$refs.datagridbill.selects = [];
        this.$refs.addForm.resetFields();
        this.addForm.custBrchCode = "";
        this.addForm.custName = ""
        this.batchId = "";
        this.addForm.id = null;
        this.hasRollBackDisabled = true;
        this.noRollBackDisabled = true;
        this.addOrEditWin = false;
      },

      editRemarkWinClose() {
        this.$refs.addForm1.resetFields();
      },

      closeAddOrEditWin() {
        this.addOrEditWin = false;
        this.$refs.addForm.resetFields();
      },

      //新增修改界面
      licenseBrchNoChange(info) {
      /*  this.addForm.transBrchNo = info[0].id;
        this.addForm.brchName = info[0].title;*/
       if(info.length>0 && this.licenseFlag===true){
           this.addForm.ownedBrchNo = info[0].brchNo;
           this.addForm.ownedBrchName = info[0].brchName;
       }

      },
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.cdMediaList = res.get("CDMedia");
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
