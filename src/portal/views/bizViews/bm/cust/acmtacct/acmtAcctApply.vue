<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.bs.custName')" prop="custNameLike">
                  <h-input v-model="formItem.custNameLike" :maxlength="60"  :lengthByByte="false" placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.socCode')" prop="socCodeLike" :validRules="socCodeRuleLike"
                             class="h-form-long-label">
                  <h-input v-model="formItem.socCodeLike" :maxlength=18 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNoLike">
                  <h-input v-model="formItem.custAcctNoLike" :maxlength=32 placeholder=""></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.acctType')" prop="acctType">
                  <h-select v-model="formItem.acctType" placeholder="">
                    <h-option v-for="item in acmtAcctTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.operType')" prop="operTypeList">
                  <h-select v-model="formItem.operTypeList" placeholder="">
                    <h-option v-for="item in acmtOperTypeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.operStatus')" prop="status">
                  <h-select v-model="formItem.status" placeholder="">
                    <h-option v-for="item in acmtOperStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
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
            url="/bm/cust/acmtacct/acmtAcctApply/func_queryApplyAcmtAcct"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">{{$t('m.i.common.add')}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" :disabled="editDisabled">
                {{$t('m.i.common.modify')}}
              </h-button>
              <h-button type="primary" @click="handleDelete()" :disabled="deletDisabled">{{$t('m.i.common.delete')}}
              </h-button>

              <h-button type="primary" @click="handleModifyForm('cust')" :disabled="modifyCustDisabled">
                {{$t('m.i.common.modifyCust')}}
              </h-button>
              <h-button type="primary" @click="handleModifyForm('acct')" :disabled="modifyAcctDisabled">
                {{$t('m.i.common.modifyAcct')}}
              </h-button>
              <h-button type="primary" @click="handleModifyForm('auth')" :disabled="modifyAuthDisabled">
                {{$t('m.i.common.modifyAuth')}}
              </h-button>
              <h-button type="primary" @click="changeAcmt()" :disabled="changeDisabled">
                {{$t('m.i.common.changeMasterAcmt')}}
              </h-button>
              <h-button type="primary" @click="cancelChange()" :disabled="cancelDisabled">
                {{$t('m.i.common.cancelChange')}}
              </h-button>
              <h-button type="primary" @click="signChange()" :disabled="signDisabled">
                {{$t('m.i.common.signChange')}}
              </h-button>

              <h-button type="primary" @click="commitComfirm()" :disabled="commitDisabled">
                {{$t('m.i.common.submit')}}
              </h-button>
              <h-button v-if="auditMode" type="primary" @click="rollbackComfirm()" :disabled="cancelCommitDisabled">
                {{$t('m.i.common.cancelCheckAuth')}}
              </h-button>
              <h-button type="primary" @click="showHist()">{{$t('m.i.common.showHist')}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="closeAddForm">
      <p slot="header">
        <span v-if="type=='add'">新增信息</span>
        <span v-if="type=='modify'">修改信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item prop="custName" :label="$t('m.i.bs.custName')" required>
            <h-input  v-model="addForm.custName" placeholder=""
                     :icon="'android-search'" @on-click="queryCustNo" :maxlength="60" :lengthByByte="false"
            ></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :required="isRequired"
                       :validRules="socCodeRule">
            <h-input  v-model="addForm.socCode"  :title="addForm.socCode" :maxlength=18></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctType')" prop="acctType" :required="isRequired">
            <h-select v-model="addForm.acctType" placeholder="">
              <h-option v-for="item in acmtAcctTypeList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.distType')" prop="distType" :required="isRequired">
            <h-select v-model="addForm.distType" placeholder="" @on-change="clearDt02From()">
              <h-option v-for="item in distTypeList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo" :required="isRequired"
                       :validRules="acctNoRule">
            <h-input v-model="addForm.custAcctNo" placeholder=""  @on-change="onChangeCustAcct"
                     icon="android-search" @on-click="queryCustAcct('addForm')" :maxlength=32 ></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctName')" prop="acctName" v-if="addForm.distType==='DT02'" required>
            <h-input  v-model="addForm.acctName"  :title="addForm.acctName" :maxlength=150 :lengthByByte="false"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.openBrchCode')" prop="openBrchCode" v-if="addForm.distType==='DT02'" required>
            <h-input v-model="addForm.openBrchCode" :maxlength=9
                     icon="android-search" @on-click="brchCodeWinOpen('addForm')"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.openBrchName')" prop="openBrchName" v-if="addForm.distType==='DT02'" required>
            <h-input v-model="addForm.openBrchName" :title="addForm.openBrchName" readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.billInfo.busiChannelCode')" prop="memberId" :required="isRequired">
            <h-input v-model="addForm.memberId" :title="addForm.memberId"
                     :icon="this.addForm.distType==='DT01' ? 'android-search' : ''" :readonly = "this.addForm.distType==='DT02'"
                     @on-click="queryMemberName()" :maxlength="6"></h-input>
          </h-form-item>


        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" @click="closeAddForm()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
    </h-msg-box>


    <!--维护客户弹出窗-->
    <h-msg-box v-model="editCustWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="closetEditForm('cust')">
      <p slot="header">
        <span>维护客户信息</span>
      </p>
      <h-panel>
        <h-form :model="custForm" :label-width="120" ref="custForm" class="h-form-search">
          <h-form-item prop="changeCustName" :label="$t('m.i.bs.custName')" required>
            <h-input v-model="custForm.changeCustName"  :maxlength="60" :lengthByByte="false"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :validRules="socCodeRule">
            <h-input v-model="custForm.socCode" :maxlength=18 readonly></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closetEditForm('cust')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitEditForm('cust')">{{$t("m.i.common.confirm")}}</h-button>
      </div>
    </h-msg-box>

    <!--维护账号弹出窗-->
    <h-msg-box v-model="editAcctWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="closetEditForm('acct')">
      <p slot="header">
        <span>维护账户信息</span>
      </p>
      <h-panel>
        <h-form :model="acctForm" :label-width="120" ref="acctForm" class="h-form-search">
          <h-form-item :label="$t('m.i.common.acctName')" prop="changeAcctName" required>
            <h-input v-model="acctForm.changeAcctName" :title="acctForm.changeAcctName" :maxlength=150 :lengthByByte="false"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo">
            <h-input v-model="acctForm.custAcctNo" :maxlength=32 placeholder="" readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.openBrchName')" prop="openBrchName">
            <h-input v-model="acctForm.openBrchName" :title="acctForm.openBrchName" readonly></h-input>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closetEditForm('acct')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitEditForm('acct')">{{$t("m.i.common.confirm")}}</h-button>
      </div>
    </h-msg-box>

    <!--维护权限信息出窗-->
    <h-msg-box v-model="editAuthWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="closetEditForm('auth')">
      <p slot="header">
        <span>维护权限信息</span>
      </p>
      <h-panel>
        <h-checkbox-group v-model="acctAuthLists" @on-change="acctAuthChange()" style="height:auto">
          <h-row>
            <h-col span="12">
              <h-checkbox label="CG00"><span>不限制</span></h-checkbox>
            </h-col>
            <h-col span="12">
              <h-checkbox label="CG01" :disabled="this.acctAuthFlag"><span>出票发起</span></h-checkbox>
            </h-col>
          </h-row>
          <h-row>
            <h-col span="12">
              <h-checkbox label="CG02" :disabled="this.acctAuthFlag"><span>承兑发起</span></h-checkbox>
            </h-col>
            <h-col span="12">
              <h-checkbox label="CG03" :disabled="this.acctAuthFlag"><span>承兑应答</span></h-checkbox>
            </h-col>
          </h-row>
          <h-row>
            <h-col span="12">
              <h-checkbox label="CG04" :disabled="this.acctAuthFlag"><span>收票发起</span></h-checkbox>
            </h-col>
            <h-col span="12">
              <h-checkbox label="CG05" :disabled="this.acctAuthFlag"><span>收票应答</span></h-checkbox>
            </h-col>
          </h-row>
          <h-row>
            <h-col span="12">
              <h-checkbox label="CG06" :disabled="this.acctAuthFlag"><span>背书发起</span></h-checkbox>
            </h-col>
            <h-col span="12">
              <h-checkbox label="CG07" :disabled="this.acctAuthFlag"><span>背书应答</span></h-checkbox>
            </h-col>
          </h-row>
          <h-row>
            <h-col span="12">
              <h-checkbox label="CG09" :disabled="this.acctAuthFlag"><span>质押申请</span></h-checkbox>
            </h-col>
            <h-col span="12">
              <h-checkbox label="CG10" :disabled="this.acctAuthFlag"><span>质押应答</span></h-checkbox>
            </h-col>
          </h-row>
          <h-row>
            <h-col span="12">
              <h-checkbox label="CG11" :disabled="this.acctAuthFlag"><span>保证申请</span></h-checkbox>
            </h-col>
            <h-col span="12">
              <h-checkbox label="CG12" :disabled="this.acctAuthFlag"><span>保证应答</span></h-checkbox>
            </h-col>
          </h-row>
          <h-row>
            <h-col span="12">
              <h-checkbox label="CG13" :disabled="this.acctAuthFlag"><span>存托发起</span></h-checkbox>
            </h-col>
            <h-col span="12">
              <h-checkbox label="CG14" :disabled="this.acctAuthFlag"><span>存托应答</span></h-checkbox>
            </h-col>
          </h-row>
          <h-row>
            <h-col span="12">
              <h-checkbox label="CG08" :disabled="this.acctAuthFlag"><span>贴现发起</span></h-checkbox>
            </h-col>
          </h-row>
        </h-checkbox-group>

      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closetAuthForm()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitAuthForm()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
    </h-msg-box>

    <!--主办账户变更-->
    <h-msg-box v-model="changeAcmtWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"  @on-close="closetEditForm('change')">
      <p slot="header">
        <span>变更主办账户信息</span>
      </p>
      <h-panel>
        <h-form :model="changeForm" :label-width="120" ref="changeForm" cols="2" class="h-form-search">
          <h-form-item prop="custName" :label="$t('m.i.bs.custName')">
            <h-input v-model="changeForm.custName" :maxlength=60 readonly :lengthByByte="false"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.socCode')" prop="socCode" :validRules="socCodeRule">
            <h-input v-model="changeForm.socCode" :maxlength=18 readonly></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctType')" prop="acctType">
            <h-select v-model="changeForm.acctType" placeholder="" readonly>
              <h-option v-for="item in acmtAcctTypeList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.distType')" prop="distType">
            <h-select v-model="changeForm.distType" placeholder="" readonly>
              <h-option v-for="item in distTypeList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.custAcctNo')" prop="custAcctNo" :required="isRequired"
                       :validRules="acctNoRule">
            <h-input v-model="changeForm.custAcctNo" placeholder="" @on-change="onChangeCustAcct"
                     icon="android-search" @on-click="queryCustAcct('changeForm')" :maxlength=32 ></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.acctName')" prop="acctName" :required="isRequired">
            <h-input v-model="changeForm.acctName" :title="changeForm.acctName" :maxlength=150 :lengthByByte="false"></h-input>

          </h-form-item>

          <h-form-item :label="$t('m.i.common.openBrchCode')" prop="openBrchCode" :required="isRequired">
            <h-input v-model="changeForm.openBrchCode" :maxlength=9
                     icon="android-search" @on-click="brchCodeWinOpen('changeForm')"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.openBrchName')" prop="openBrchName" :required="isRequired">
            <h-input v-model="changeForm.openBrchName" :title="changeForm.openBrchName" readonly></h-input>
          </h-form-item>


        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closetEditForm('change')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitEditForm('change')">{{$t("m.i.common.confirm")}}</h-button>
      </div>
    </h-msg-box>


    <!--主办账户签收-->
    <h-msg-box v-model="changeSignWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false" @on-close="closetEditForm('sign')">
      <p slot="header">
        <span>变更应答确认</span>
      </p>
      <h-panel>
        <h-form :model="signForm" :label-width="120" ref="signForm" class="h-form-search">
          <h-form-item :label="$t('m.i.be.sgnupMark')" prop="signFlag" :required="isRequired">
            <h-select v-model="signForm.signFlag" placeholder="">
              <h-option v-for="item in signUpMarkCodeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closetEditForm('sign')">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="handleSign()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.custNo"
                       :isAllBankAcct="true" @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询会员代码 -->
    <!--    <member-id-search :memberIdWin="showCpesMemberWin" @memberIdWinClose="memberIdWinClose"-->
    <!--                      @memberIdWinSubmit="memberIdWinSubmit" :isShowType="false" :z-index="1200"></member-id-search>-->
    <!--查看会员-->
    <show-member :showMemberWin="showCpesMemberWin" @memberWinClose="memberIdWinClose" memberTypeCode="MT05"
                 @memberSelect="memberIdWinSubmit" :isShowBankNo="false"></show-member>
    <!-- 查看机构信息 -->
    <brch-code-search :brchCodeWin="brchCodeWin" @brchCodeWinClose="brchCodeWinClose"  :memberBankNo="this.openBrchBankNo"
                      @brchCodeChange="brchCodeChange" optType="2"></brch-code-search>

    <acmt-auth-list :acmtAuthListWin="acmtAuthListWin" @acmtAuthListWinClose="acmtAuthListWinClose"
                    :propAuthList="this.propAuthList"></acmt-auth-list>
    <h-acmt-hist :showHistWin="showHistWin" title="查看历史维护记录" :acmtAcctId="this.acmtAcctId" @showHistWinClose="showHistWinClose">
    </h-acmt-hist>
  </div>
</template>

<script>
  import {getMoreParamValuesByKeys, post} from "@/api/bizApi/commonUtil";

  export default {
    name: "acmtAcctApply",
    components: {
      ShowMember: () => import(/* webpackChunkName: "shcpe/cpes/member/showMember" */`@/views/bizViews/shcpe/cpes/member/showMember`),
      BrchCodeSearch: () => import(/* webpackChunkName: "sm/auth/branch/cpesBrchCodeSearch" */`@/views/bizViews/sm/auth/branch/cpesBrchCodeSearch`),
      AcmtAuthList: () => import(/* webpackChunkName: 'bm/cust/acmtacct/acmtAuthList' */`@/views/bizViews/bm/cust/acmtacct/acmtAuthList`),
      HAcmtHist:()=>import(/* webpackChunkName: "bm/cust/acmtacct/acmtLogHist" */`@/views/bizViews/bm/cust/acmtacct/acmtLogHist`),

    },
    data() {
      return {
        dictMap: new Map(),
        acctAuthFlag: false,
        acmtAcctTypeList: [],
        distTypeList: [],
        acmtOperStatusList: [],
        acmtOperTypeList: [],
        signUpMarkCodeList: [],
        auditMode: true,
        custNo:"",
        openBrchBankNo:"",
        openEdit : false,
        // 是否显示新增或修改窗口
        addOrEditWin: false,
        editCustWin: false,
        editAcctWin: false,
        editAuthWin: false,
        changeAcmtWin: false,
        changeSignWin: false,
        showHistWin :false,
        acmtAcctId : "",
        acctAuthLists: [],
        propAuthList: [],
        formItem: {
          custName: '',
          socCode: '',
          custAcctNo: '',
          custNameLike: '',
          socCodeLike: '',
          custAcctNoLike: '',
          acctType: '',
          operType: '',
          operTypeList: [],
          status: '',
        },
        addForm: {
          id: "",
          legalNo: "",
          custNo: "",
          custName: "",
          socCode: "",
          acctType: "",
          distType: "",
          custAcctNo: "",
          acctName: "",
          openBrchCode: "",
          openBrchBankNo: "",
          openBrchName: "",
          memberId: "",
          changeCustName: "",
          acctAuthList: "",
          changeAcctName: "",
          changeCustAcctNo: "",
          changeOpenBrchCode: "",
          changeOpenBankNo: "",
          changeOpenBrchName: "",
          changeMembeIda: "",
          changeAcctAuthList: "",
          signFlag: "",
        },
        custForm: {
          id: "",
          custNo: "",
          custName: "",
          socCode: "",
          custAcctNo: "",
          openBrchName: "",
          changeCustName: "",
        },
        acctForm: {
          id: "",
          legalNo: "",
          custNo: "",
          custName: "",
          socCode: "",
          custAcctNo: "",
          acctName: "",
          openBrchName: "",
          memberId: "",
          changeAcctName: "",
        },

        changeForm: {
          id: "",
          legalNo: "",
          custNo: "",
          custName: "",
          socCode: "",
          acctType: "",
          distType: "",
          custAcctNo: "",
          acctName: "",
          openBrchCode: "",
          openBrchBankNo: "",
          openBrchName: "",
          memberId: "",
          changeCustName: "",
          acctAuthList: "",
          changeAcctName: "",
          changeCustAcctNo: "",
          changeOpenBrchCode: "",
          changeOpenBankNo: "",
          changeOpenBrchName: "",
          changeMembeIda: "",
          changeAcctAuthList: "",
          signFlag: "",
        },
        signForm: {
          id: "",
          signFlag: "",
        },
        columns: [
          {
            title: ' ',
            type: "radio",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            key: "xuhao",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: 'ID',
            key: "id",
            hiddenCol: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: "custName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.socCode'),
            key: "socCode",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.custAcctNo'),
            key: "custAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctName'),
            key: "acctName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctType'),
            key: "acctType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtAcctTypeCode", params.row.acctType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.distType'),
            key: "distType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "DistTypeCode", params.row.distType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.openBrchCode'),
            key: "openBrchCode",
            hiddenCol: true
          },
          {
            title: this.$t('m.i.common.openBrchName'),
            key: "openBrchName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.busiChannelCode'),
            key: "memberId",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.acctAuthList'),
            key: "acctAuthList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showAuthList(params.row.acctAuthList);
                  }
                }
              }, "权限清单");
            }

          },
          {
            title: this.$t('m.i.common.rgstName'),
            key: "rgstName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.rgstBrchCode'),
            key: "rgstBrchCode",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operType'),
            key: "operType",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtOperTypeCode", params.row.operType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.operStatus'),
            key: "status",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "AcmtOperStatusCode", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.changeCustName'),
            key: "changeCustName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeCustAcctNo'),
            key: "changeCustAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeAcctName'),
            key: "changeAcctName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeOpenBrchName'),
            key: "changeOpenBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.changeAcctAuthList'),
            key: "changeAcctAuthList",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showAuthList(params.row.changeAcctAuthList);
                  }
                }
              }, "权限清单");
            }
          },

        ],
        type: null,
        readonly: false,
        isRequired: true,
        editDisabled: false,
        deletDisabled: false,
        modifyCustDisabled: false,
        modifyAcctDisabled: false,
        modifyAuthDisabled: false,
        changeDisabled: false,
        cancelDisabled: false,
        signDisabled: false,
        commitDisabled: false,
        cancelCommitDisabled: false,
        submitFlag: false,
        copyWin: false,
        //brchCodeWin: false,
        submitWin: false,
        showCpesMemberWin: false,
        acmtAuthListWin: false,
        brchCodeWin: false,
        showCustMessageWin: false,
        showCustAcctNoWin: false,
        copyForm : "",
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        ifShowMore: false,
        bankNoRule: [{test: /^[0-9]{12}$/, trigger: "blur", message: "大额行号由12位数字组成"}],
        acctNoRule: [{test: /^[a-zA-Z0-9]{1,32}$/, trigger: "blur", message: "账号只能输入字母或数字"}],
        chooseType: "",
        socCodeRule: [{test: /^[0-9A-Z]{18}$/, trigger: "blur", message: "统一社会信用代码由18位数字或大写字母组成"}],
        socCodeRuleLike: [{test: /^[0-9A-Z]{1,18}$/, trigger: "blur", message: "统一社会信用代码查询由1-18位数字或大写字母组成"}]
      };
    },
    mounted() {
      getMoreParamValuesByKeys("bm.cust.acmt_audit_mode").then(res => {
        let isAudit = res['bm.cust.acmt_audit_mode'];
        if (isAudit === '0') {
          this.auditMode = false;
        } else {
          this.auditMode = true;
        }
      });
      this.getDictListByGroups("AcmtAcctTypeCode,AcmtOperStatusCode,AcmtOperTypeCode,DistTypeCode,SignUpMarkCode").then(res => {
        this.acmtAcctTypeList = res.get("AcmtAcctTypeCode");
        if (this.auditMode) {
          this.acmtOperStatusList = res.get("AcmtOperStatusCode").filter(item => item.key === "10" || item.key === "20" || item.key === "40" ||
            item.key === "50" || item.key === "60" || item.key === "90" || item.key === "100" || item.key === "140" || item.key === "150" ||
            item.key === "180");
        } else {
          this.acmtOperStatusList = res.get("AcmtOperStatusCode").filter(item => item.key === "10" || item.key === "40" ||
            item.key === "50" || item.key === "60" || item.key === "90" || item.key === "100" || item.key === "140" || item.key === "150" ||
            item.key === "180" );
        }

        this.acmtOperTypeList = res.get("AcmtOperTypeCode");
        this.signUpMarkCodeList = res.get("SignUpMarkCode");
        this.distTypeList = res.get("DistTypeCode");
        this.dictMap = res.get("map");
      });


    },
    methods: {
      clearDt02From(){
        if (this.addForm.distType === "DT01" && !this.openEdit){
          this.addForm.acctName = "";
          this.addForm.openBrchCode = "";
          this.addForm.openBrchBankNo = "";
          this.addForm.openBrchName = "";
          this.addForm.memberId = "";
        }
        this.openEdit = false;
      },
      initBtn() {
        this.editDisabled = false;
        this.deletDisabled = false;
        this.modifyCustDisabled = false;
        this.modifyAcctDisabled = false;
        this.modifyAuthDisabled = false;
        this.changeDisabled = false;
        this.cancelDisabled = false;
        this.signDisabled = false;
        this.commitDisabled = false;
        this.cancelCommitDisabled = false;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id = "";
        this.addForm.legalNo = "";
        this.addForm.custNo = "";
        this.addForm.custName = "";
        this.addForm.socCode = "";
        this.addForm.acctType = "";
        this.addForm.distType = "";
        this.addForm.custAcctNo = "";
        this.addForm.acctName = "";
        this.addForm.openBrchCode = "";
        this.addForm.openBrchBankNo = "";
        this.addForm.openBrchName = "";
        this.addForm.memberId = "";
        this.addForm.changeCustName = "";
        this.addForm.acctAuthList = "";
        this.addForm.changeAcctName = "";
        this.addForm.changeCustAcctNo = "";
        this.addForm.changeOpenBrchCode = "";
        this.addForm.changeOpenBankNo = "";
        this.addForm.changeOpenBrchName = "";
        this.addForm.changeMembeIda = "";
        this.addForm.changeAcctAuthList = "";
        this.addForm.signFlag = "";
        this.openBrchBankNo = "";
      },

      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
        if (this.auditMode) {
          // 修改
          if (currentRow.operType === "1" && (currentRow.status === "10")) {
            this.editDisabled = false;
          } else {
            this.editDisabled = true;
          }
          // 删除
          if (currentRow.operType !== "7" && (currentRow.status === "10" || currentRow.status === "40")) {
            this.deletDisabled = false;
          } else {
            this.deletDisabled = true;
          }
          // 客户
          if (currentRow.acctType === "1" && (currentRow.status === "40" || (currentRow.operType === "2" && (currentRow.status === "10" )))) {
            this.modifyCustDisabled = false;
          } else {
            this.modifyCustDisabled = true;
          }
          // 账户
          if (currentRow.status === "40" || (currentRow.operType === "3" && (currentRow.status === "10" ))) {
            this.modifyAcctDisabled = false;
          } else {
            this.modifyAcctDisabled = true;
          }
          // 权限
          if (currentRow.status === "40" || (currentRow.operType === "4" && (currentRow.status === "10" ))) {
            this.modifyAuthDisabled = false;
          } else {
            this.modifyAuthDisabled = true;
          }
          // 变更申请 - 主办账号，且状态为成功 或者变更未提交
          if (currentRow.acctType === "1" && (currentRow.status === "40" || (currentRow.operType === "6" && (currentRow.status === "10")))) {
            this.changeDisabled = false;
          } else {
            this.changeDisabled = true;
          }
          // 撤销变更
          if (currentRow.operType === "6" && (currentRow.status === "60" || currentRow.status === "90")) {
            this.cancelDisabled = false;
          } else {
            this.cancelDisabled = true;
          }
          // 变更应答
          if (currentRow.operType === "7" && (currentRow.status === "60" || currentRow.status === "150" || currentRow.status === "180")) {
            this.signDisabled = false;
          } else {
            this.signDisabled = true;
          }
          // 提交
          if (currentRow.status === "10" ) {
            this.commitDisabled = false;
          } else {
            this.commitDisabled = true;
          }
          // 撤销提交
          if (currentRow.status === "20" || currentRow.status === "50" ) {
            this.cancelCommitDisabled = false;
          } else {
            this.cancelCommitDisabled = true;
          }
        } else {
          // 修改
          if (currentRow.operType === "1" && (currentRow.status === "10" || currentRow.status === "50")) {
            this.editDisabled = false;
          } else {
            this.editDisabled = true;
          }
          // 删除
          if (currentRow.operType !== "7" && (currentRow.status === "10" || currentRow.status === "40" || currentRow.status === "50")) {
            this.deletDisabled = false;
          } else {
            this.deletDisabled = true;
          }
          // 客户
          if (currentRow.acctType === "1" && (currentRow.status === "40" || (currentRow.operType === "2" && (currentRow.status === "10" || currentRow.status === "50")))) {
            this.modifyCustDisabled = false;
          } else {
            this.modifyCustDisabled = true;
          }
          // 账户
          if (currentRow.status === "40" || (currentRow.operType === "3" && (currentRow.status === "10" || currentRow.status === "50"))) {
            this.modifyAcctDisabled = false;
          } else {
            this.modifyAcctDisabled = true;
          }
          // 权限
          if (currentRow.status === "40" || (currentRow.operType === "4" && (currentRow.status === "10" || currentRow.status === "50"))) {
            this.modifyAuthDisabled = false;
          } else {
            this.modifyAuthDisabled = true;
          }
          // 变更申请 - 主办账号，且状态为成功 或者变更未提交
          if (currentRow.acctType === "1" && (currentRow.status === "40" || (currentRow.operType === "6" && (currentRow.status === "10"||currentRow.status === "50")))) {
            this.changeDisabled = false;
          } else {
            this.changeDisabled = true;
          }
          // 撤销变更
          if (currentRow.operType === "6" && (currentRow.status === "60" || currentRow.status === "90")) {
            this.cancelDisabled = false;
          } else {
            this.cancelDisabled = true;
          }
          // 变更应答
          if (currentRow.operType === "7" && (currentRow.status === "60" || currentRow.status === "150" || currentRow.status === "180")) {
            this.signDisabled = false;
          } else {
            this.signDisabled = true;
          }
          // 提交
          if (currentRow.status === "10" || currentRow.status === "50" ) {
            this.commitDisabled = false;
          } else {
            this.commitDisabled = true;
          }
        }

        // 删除成功额外处理
        if (currentRow.status === "40" && currentRow.operType === "5") {
          this.editDisabled = true;
          this.deletDisabled = true;
          this.modifyCustDisabled = true;
          this.modifyAcctDisabled = true;
          this.modifyAuthDisabled = true;
          this.changeDisabled = true;
          this.cancelDisabled = true;
          this.signDisabled = true;
          this.commitDisabled = true;
          this.cancelCommitDisabled = true;
        }
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
        this.initBtn();
      },

      formSearch() {
        this.initBtn();
        this.$refs.datagrid.dataChange(1);
      },

      formSearchReset() {
        this.$refs.formItem.resetFields();
      },

      //关闭会员框
      clearMemberName() {
        this.addForm.memberId = "";
      },
      //查询会员名称
      queryMemberName() {
        this.showCpesMemberWin = true;
      },
      //关闭会员窗口
      memberIdWinClose() {
        this.showCpesMemberWin = false;
      },
      //根据弹框所选数据进行赋值
      memberIdWinSubmit(info) {
        if (info === null) {
          this.$msgTip.info(this, {info: "请先选择记录!"});
          return;
        }
        this.addForm.memberId = info.memberId;
        this.showCpesMemberWin = false;
      },


      brchCodeWinOpen(copyForm) {
        this.copyForm = copyForm;
        this.brchCodeWin = true;
      },

      brchCodeWinClose() {
        this.brchCodeWin = false;
      },

      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (this.copyForm === 'addForm'){
          this.addForm.openBrchCode = info.brchCode;
          this.addForm.openBrchName = info.brchFullNameZh;
          this.addForm.openBankNo = info.transBrchBankNo;
          this.addForm.memberId = info.memberId;
        } else {
          this.changeForm.openBrchCode = info.brchCode;
          this.changeForm.openBrchName = info.brchFullNameZh;
          this.changeForm.openBankNo = info.transBrchBankNo;
          this.changeForm.memberId = info.memberId;
        }
        this.brchCodeWin = false;
      },
      queryCustNo() {
        this.showCustMessageWin = true;
      },

      handleCustNameChange(value) {
        this.addForm.custName = "";
        this.addForm.socCode = "";
      },

      //赋值
      custCorpSelectSubmit(info) {
        this.addForm.custName = info.custName;
        this.addForm.socCode = info.socCode;
        this.addForm.custNo = info.custNo;
        this.custNo = info.custNo;
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },

      queryCustAcct(copyForm ) {
        this.copyForm = copyForm;
        this.showCustAcctNoWin = true;
      },
      onChangeCustAcct(){
        this.openBrchBankNo = "";
      },

      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },

      //赋值
      custAcctNoSelectSubmit(info) {
        if (this.copyForm === 'addForm'){
          this.addForm.custAcctNo = info.custAcctNo;
          this.addForm.acctName = info.acctName;
          this.addForm.openBrchBankNo = info.openBankNo;
        } else {
          this.changeForm.custAcctNo = info.custAcctNo;
          this.changeForm.acctName = info.acctName;
          this.changeForm.openBrchBankNo = info.openBankNo;
        }
        this.openBrchBankNo = info.openBankNo;
        this.showCustAcctNoWin = false;
      },

      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        if (this.type === "modify" || this.type === "view") {
          if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
            return;
          }
          if (this.currentSelectRow.operType !== '1' && this.currentSelectRow.status !== '10' && this.currentSelectRow.status !== '50') {
            this.$msgTip.info(this, {info: "当前状态不允许修改"});
            return;
          } else {
            this.$nextTick(() => {
              this.copySelectToAddFrom(this.currentSelectRow);
              this.addOrEditWin = true;
            });
          }
        } else {
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addFormReset();
            this.addForm.distType = "DT02";
          });
        }

      },

      copySelectToAddFrom(object) {
        this.addForm.id = object.id;
        this.addForm.legalNo = object.legalNo;
        this.addForm.custName = object.custName;
        this.addForm.socCode = object.socCode;
        this.addForm.acctType = object.acctType;
        this.addForm.distType = object.distType;
        this.addForm.custAcctNo = object.custAcctNo;
        this.addForm.acctName = object.acctName;
        this.addForm.openBrchCode = object.openBrchCode;
        this.addForm.openBrchBankNo = object.openBankNo;
        this.addForm.openBrchName = object.openBrchName;
        this.addForm.memberId = object.memberId;
        this.addForm.custNo = object.custNo;
        this.custNo = object.custNo;
        this.openBrchBankNo = object.openBankNo;
        this.openEdit = true;
      },


      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = "/bm/cust/acmtacct/acmtAcctApply/func_addAcmtAcct";
            let msg = this.type === "add" ? this.$t("m.i.common.addSuccess") : this.$t("m.i.common.modifySuccess");
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            this.submitMsg = msg;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this)
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.addFormReset();
                  this.addOrEditWin = false;
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }

            });
          }
        });
      },

      closeAddForm() {
        this.addFormReset();
        this.addOrEditWin = false;
      },

      handleDelete() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handledel();
          }
        });

      },

      handledel() {
        post({id: this.currentSelectRow.id}, "/bm/cust/acmtacct/acmtAcctApply/func_deleteAcmtAcct").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.retMsg = "";
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      handleModifyForm(operType) {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
          return;
        }
        if ("cust" === operType) {
          this.custForm.socCode = this.currentSelectRow.socCode;
          this.custForm.id = this.currentSelectRow.id;
          this.custForm.custAcctNo = this.currentSelectRow.custAcctNo;
          this.custForm.openBrchName = this.currentSelectRow.openBrchName;
          if (this.currentSelectRow.status === "10" || this.currentSelectRow.status === "50" ) {
            this.custForm.changeCustName = this.currentSelectRow.changeCustName;
          } else {
            this.custForm.changeCustName = this.currentSelectRow.custName;
          }
          this.editCustWin = true;
        } else if ("acct" === operType) {
          if ('DT01' === this.currentSelectRow.distType) {
            this.$msgTip.error(this, {info: "识别类型为票据账户时，不允许修改账户名称"});
            return;
          }
          this.acctForm.socCode = this.currentSelectRow.socCode;
          this.acctForm.id = this.currentSelectRow.id;
          this.acctForm.custAcctNo = this.currentSelectRow.custAcctNo;
          this.acctForm.openBrchName = this.currentSelectRow.openBrchName;
          if (this.currentSelectRow.status === "10" || this.currentSelectRow.status === "50" ) {
            this.acctForm.changeAcctName = this.currentSelectRow.changeAcctName;
          } else {
            this.acctForm.changeAcctName = this.currentSelectRow.acctName;
          }
          this.editAcctWin = true;
        } else {
          let acctAuthListString;
          if (this.currentSelectRow.changeAcctAuthList == "" || this.currentSelectRow.changeAcctAuthList == null) {
            acctAuthListString = this.currentSelectRow.acctAuthList;
          } else {
            acctAuthListString = this.currentSelectRow.changeAcctAuthList;
          }
          this.acctAuthLists = acctAuthListString.toString().split("|");
          this.acctAuthChange();
          this.editAuthWin = true;
        }

      },

      submitEditForm(operType) {
        if ('cust' === operType){
          this.$refs["custForm"].validate(valid => {
            if (valid) {
              // 维护客户信息的url
              let url = '/bm/cust/acmtacct/acmtAcctApply/func_modifyCust';
              let msg = this.$t("m.i.common.modifySuccess");
              let pageNo = this.$refs.datagrid.pageInfo.pageNo;
              this.submitFlag = true;
              this.submitMsg = msg;
              post(this.custForm, url).then(res => {
                this.submitFlag = false;
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this)
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.closetEditForm(operType);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }

              });
            }
          });
        } else if ('acct' === operType){
          this.$refs["acctForm"].validate(valid => {
            if (valid) {
              // 维护账户信息的url
              let url = '/bm/cust/acmtacct/acmtAcctApply/func_modifyAcct';
              let msg = this.$t("m.i.common.modifySuccess");
              let pageNo = this.$refs.datagrid.pageInfo.pageNo;
              this.submitFlag = true;
              this.submitMsg = msg;
              post(this.acctForm, url).then(res => {
                this.submitFlag = false;
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this)
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.closetEditForm(operType);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }

              });
            }
          });
        } else {
          this.$refs["changeForm"].validate(valid => {
            if (valid) {
              // 维护客户信息的url
              let url = '/bm/cust/acmtacct/acmtAcctApply/func_changeAcmt';
              let msg = this.$t("m.i.common.modifySuccess");
              let pageNo = this.$refs.datagrid.pageInfo.pageNo;
              this.submitFlag = true;
              this.submitMsg = msg;
              post(this.changeForm, url).then(res => {
                this.submitFlag = false;
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this)
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                    this.closetEditForm(operType);
                    this.currentSelectRow = [];
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg});
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
                }

              });
            }
          });
        }
      },

      submitAuthForm() {
        // if (this.acctAuthLists.length === 0) {
        //   this.$msgTip.error(this, {info: "请先维护权限信息"});
        //   return;
        // }
        let changeAcctAuthList = "";
        for (var i = 0; i < this.acctAuthLists.length; i++) {
          if ("" === changeAcctAuthList) {
            changeAcctAuthList = this.acctAuthLists[i];
          } else {
            changeAcctAuthList = changeAcctAuthList + "|" + this.acctAuthLists[i];
          }
        }
        post({
          changeAcctAuthList: changeAcctAuthList,
          id: this.currentSelectRow.id
        }, '/bm/cust/acmtacct/acmtAcctApply/func_modifyAuth').then(res => {
          this.submitFlag = false;
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.closetAuthForm();
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }

        });
      },

      acctAuthChange() {
        if (this.contains(this.acctAuthLists, 'CG00')) {
          this.acctAuthLists = ['CG00'];
          this.acctAuthFlag = true;
        } else {
          this.acctAuthFlag = false;
        }
      },

      contains(arr, obj) {
        var i = arr.length;
        while (i--) {
          if (arr[i] === obj) {
            return true;
          }
        }
        return false;
      },


      changeAcmt() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
          return;
        }
        if ('1' !== this.currentSelectRow.acctType) {
          this.$msgTip.error(this, {info: "普通账户不允许办理变更主办账户"});
          return;
        }
        this.changeForm.custName = this.currentSelectRow.custName;
        this.changeForm.custNo = this.currentSelectRow.custNo;
        this.custNo = this.currentSelectRow.custNo;
        this.changeForm.socCode = this.currentSelectRow.socCode;
        this.changeForm.acctType = this.currentSelectRow.acctType;
        this.changeForm.distType = this.currentSelectRow.distType;
        this.changeForm.id = this.currentSelectRow.id;
        if ("10" === this.currentSelectRow.status || "50" === this.currentSelectRow.status){
            this.changeForm.custAcctNo = this.currentSelectRow.changeCustAcctNo;
            this.changeForm.acctName = this.currentSelectRow.changeAcctName;
            this.changeForm.openBrchCode = this.currentSelectRow.changeOpenBrchCode;
            this.changeForm.openBrchName = this.currentSelectRow.changeOpenBrchName;
            this.changeForm.openBankNo = this.currentSelectRow.changeOpenBankNo;
            this.changeForm.memberId = this.currentSelectRow.changeMembeId;
        }
        this.changeAcmtWin = true;
      },

      cancelChange() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.confirmRollBackBill") + "?",
          onOk: () => {
            this.handleCancel();
          }
        });
      },
      handleCancel() {
        post({id: this.currentSelectRow.id}, "/bm/cust/acmtacct/acmtAcctApply/func_cancelChange").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.retMsg = "";
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      signChange() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
          return;
        }
        this.signForm.id = this.currentSelectRow.id;
        this.changeSignWin = true;
      },

      handleSign() {
        this.$refs["signForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.signForm, '/bm/cust/acmtacct/acmtAcctApply/func_signChange').then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this)
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.closetEditForm('sign');
                  this.currentSelectRow = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }

            });
          }
        });
      },

      closetEditForm(operType) {

        if ('cust' === operType) {
          this.$refs.custForm.resetFields();
          this.editCustWin = false;
        } else if ('acct' === operType) {
          this.$refs.acctForm.resetFields();
          this.editAcctWin = false;
        } else if ('auth' === operType) {
          this.editAuthWin = false;
        } else if ('change' === operType) {
          this.$refs.changeForm.resetFields();
          this.openBrchBankNo = "";
          this.changeAcmtWin = false;
        } else if ('sign' === operType) {
          this.$refs.signForm.resetFields();
          this.changeSignWin = false;
        }

      },




      closetAuthForm() {
        this.acctAuthLists = [],
          this.editAuthWin = false;

      },

      // 提交复核
      commitComfirm() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.confirmCommit") + "?",
          onOk: () => {
            this.handleCommitComfirm();
          }
        });
      },
      handleCommitComfirm() {
        post({id: this.currentSelectRow.id}, "/bm/cust/acmtacct/acmtAcctApply/func_commitAcmtAcct").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.retMsg = "";
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },

      // 撤销提交复核
      rollbackComfirm() {
        if (this.currentSelectRow == null || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmRollBack") + "?",
          onOk: () => {
            this.handleRollbackComfirm();
          }
        });
      },
      handleRollbackComfirm() {
        post({id: this.currentSelectRow.id}, "/bm/cust/acmtacct/acmtAcctApply/func_cancelCommitAcmtAcct").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.selectIds = [];
              this.retMsg = "";
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },


      showHist(){
        if(this.currentSelectRow == null || this.currentSelectRow.length==0){
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseDataFirst')});
          return
        }
        this.acmtAcctId = this.currentSelectRow.acmtAcctId;
        this.showHistWin = true;
      },

      showHistWinClose(){
        this.showHistWin = false;
      },


      showAuthList(acctAuthList) {
        if (acctAuthList == null){
          acctAuthList = "";
        }
        this.propAuthList = acctAuthList.toString().split("|");
        this.acmtAuthListWin = true;
      },
      acmtAuthListWinClose() {
        this.acmtAuthListWin = false;
      },

    }

  };
</script>

<style scoped>

</style>
