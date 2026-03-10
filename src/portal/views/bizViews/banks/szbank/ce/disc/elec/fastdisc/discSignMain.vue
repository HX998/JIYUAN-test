<!--极速贴现-签约管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="custNo" :label="$t('m.i.common.custNo')">
                  <h-input v-model="formItem.custNo" placeholder="" icon="android-search" @on-click="queryCustNo()"
                           readonly></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60 readonly></h-input>
                </h-form-item>
                <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')">
                  <h-input v-model="formItem.custAcctNo" placeholder="" readonly icon="android-search"
                           @on-click="queryCustAcctNo()"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signStatus')" prop="signStatus">
                  <h-select v-model="formItem.signStatus" placeholder="" showTitle>
                    <h-option value="FD07" key="FD07">签约已生效</h-option>
                    <h-option value="FD15" key="FD15">签约已暂停</h-option>
                  </h-select>
                </h-form-item>
                <channel-select v-model="formItem.channelNo" :label="$t('m.i.ce.signChannel')"></channel-select>
                <h-form-item :label="$t('m.i.ce.isBargain')" prop="isBargain">
                  <h-select v-model="formItem.isBargain" placeholder="" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.signApplyDt')" prop="minApplDt">
                  <h-date-picker :value="applDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleApplDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.applSignEnableDt')" prop="minApplActiveDt" class="h-form-long-label">
                  <h-date-picker :value="applActiveDt" type="daterange"  autoPlacement showFormat :editable=false
                                 @on-change="handleApplActiveDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.applSignDueDt')" prop="minApplFailureDt" class="h-form-long-label">
                  <h-date-picker :value="applFailureDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleApplFailureDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.actualSignEnableDt')" prop="minActualActiveDt" class="h-form-long-label">
                  <h-date-picker :value="actualActiveDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleActualActiveDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.actualSignDueDt')" prop="minActualFailureDt" class="h-form-long-label">
                  <h-date-picker :value="actualFailureDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleActualFailureDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <show-branch v-model="formItem.discInBrchNo" :label="$t('m.i.ce.discInBrchName')" prop="discInBrchNo" :showCheckBox="false"
                             title="机构名称" :brchNo.sync="formItem.discInBrchNo" :brchName.sync="formItem.discInBrchName">
                </show-branch>
                <h-form-item prop="custMgrName" :label="$t('m.i.ce.inCustManager')">
                  <h-input v-model="formItem.custMgrName" placeholder="" readonly icon="android-search"
                           @on-click="queryCustManager('query')"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/disc/elec/fastdisc/discSignMain/func_queryList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="signOperate('edit')" :disabled="isEditAllow">修改
              </h-button>
              <h-button type="primary" @click="signOperate('pause')" :disabled="isPauseAllow">暂停
              </h-button>
              <h-button type="primary" @click="signOperate('recovery')" :disabled="isRecoveryAllow">恢复
              </h-button>
              <h-button type="primary" @click="signOperate('stop')" :disabled="isStopAllow">解约
              </h-button>
              <h-button type="primary" @click="signOperate('detail')">查看操作历史</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                       @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <show-cust-message :show-cust-message-win="showCustMessageWinForAdd" @custCorpWinClose="custCorpWinForAddClose"
                       @custCorpSelectSubmit="custCorpSelectForAddSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.custNo"
                       @showCustAcctNoWinClose="showCustAcctNoWinClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWinForAdd" :cust-no="this.addForm.custNo" @showCustAcctNoWinClose="showCustAcctNoWinForAddClose"
                       @custAcctNoSelectSubmit="custAcctNoSelectForAddSubmit"></show-cust-acct-no>
    <!--查询客户经理-->
    <show-cust-manager :showCustManagerWin="showCustManagerWin" :title="$t('m.i.ce.selectManager')"
                       @showCustManagerWinClose="showCustManagerWinClose"
                       @custManagerSelect="custManagerSelect"></show-cust-manager>
    <!--贴入行机构-->
    <show-select-branch :showBranchWin="showDiscInBrchWin" @brchNoChange="discInBrchChange"
                        @showBranchWinClose="showDiscInBrchWinClose"></show-select-branch>
    <!--签约操作弹出框-->
    <disc-sign-operate :discSignOperateWin="discSignOperateWin" :signParams="signParams" ref="discSignOperate"
                       @discSignOperateWinClose="discSignOperateWinClose"
                       :signInfoUrl="'/ce/disc/elec/fastdisc/discSignMain/func_info'"
                       :updateSignUrl="'/ce/disc/elec/fastdisc/discSignMain/func_updateBeforeLog'"
                       :operSignUrl="operSignUrl"
                       @discSignOperateSubmit="discSignOperateSubmit"></disc-sign-operate>
    <!--查看操作历史-->
    <disc-sign-log :discSignLogWin="discSignLogWin" :detailFormItem="detailFormItem" :dictMap="dictMap"
                   :histListUrl = "'/ce/disc/elec/fastdisc/discSignMain/func_queryHistList'"
                   @discSignLogWinClose="discSignLogWinClose"></disc-sign-log>

    <!--点击新增弹窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false"
               @on-close="editWinClose">
      <p slot="header">
        <span>新增签约管理信息</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item prop="custNo" :label="$t('m.i.common.custNo')" required>
            <h-input v-model="addForm.custNo" placeholder="" icon="android-search" @on-click="queryCustNoForAdd()"
                     readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custName')" prop="custName" required>
            <h-input v-model="addForm.custName" :maxlength=60 readonly></h-input>
          </h-form-item>
          <h-form-item prop="custAcctNo" :label="$t('m.i.common.custAcctNo')" required>
            <h-input v-model="addForm.custAcctNo" placeholder="" readonly icon="android-search"
                     @on-click="queryCustAcctNoForAdd()"></h-input>
          </h-form-item>

          <show-branch v-model="addForm.signBrchNo" :label="$t('m.i.ce.signBrchName')" prop="signBrchNo" :showCheckBox="false" required :filterable="false"
                       title="机构名称" :brchNo.sync="addForm.signBrchNo" :brchName.sync="addForm.signBrchName">
          </show-branch>

          <industry-category-name :formItem = "addForm" :isRequired="true" v-show="true" @queryDetailName="queryDetailName"></industry-category-name>

          <h-form-item prop="applActiveDt" :label="$t('m.i.ce.applSignEnableDt')" required>
            <h-date-picker type="date" v-model="addForm.applActiveDt" placeholder=""  @on-change="handleApplActiveDtSingelChange" :editable=false></h-date-picker>
          </h-form-item>
          <h-form-item prop="applFailureDt" :label="$t('m.i.ce.applSignDueDt')" required>
            <h-date-picker type="date" v-model="addForm.applFailureDt" placeholder=""  @on-change="handleApplFailureDtSingelChange" :editable=false></h-date-picker>
          </h-form-item>
          <channel-select v-model="addForm.channelNo" :label="$t('m.i.ce.signChannel')" required></channel-select>
          <h-form-item prop="isLimitFdiscSum" :label="$t('m.i.ce.isLimitFdiscSum')" class="h-form-height-auto h-form-long-label" required>
            <h-select v-model="addForm.isLimitFdiscSum" placeholder="">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.everydayFdiscSum')" prop="everydayFdiscSum" v-if="this.addForm.isLimitFdiscSum==='1'" :validRules="discLimitRule" required>
            <h-input v-model="addForm.everydayFdiscSum" :maxlength=9 type="int"></h-input>
          </h-form-item>
          <h-form-item prop="isBargain" :label="$t('m.i.ce.isBargain')" required>
            <h-select v-model="addForm.isBargain" placeholder="">
              <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.bargainRate')" prop="bargainRate" :validRules="ratePctRule"  v-if="this.addForm.isBargain==='1'" required>
            <h-input v-model="addForm.bargainRate"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.adjustRate')" prop="adjustRate" :validRules="adjustRateRule" required>
            <h-input v-model="addForm.adjustRate"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.limitAmt')" prop="limitAmt" required>
            <h-row>
              <h-col :span="this.synchAmtShow ? 20:24">
                <h-typefield type="money" v-model="addForm.limitAmt" :maxlength="20"
                             placeholder="数字，小数位最多2位" bigTips @on-blur="formatBillMoney('blur')"
                             @on-focus="formatBillMoney('focus')"></h-typefield>
              </h-col>
              <h-col :span="this.synchAmtShow ? 4:0">
                <h-button type="primary" @click="synchAmt()" v-if="this.synchAmtShow">{{$t("m.i.common.synch")}}</h-button>
              </h-col>
            </h-row>
          </h-form-item>
          <show-branch v-model="addForm.discInBrchNo" :label="$t('m.i.ce.discInBrchName')" prop="discInBrchNo" :showCheckBox="false" required
                       title="机构名称" :brchNo.sync="addForm.discInBrchNo" :brchName.sync="addForm.discInBrchName">
          </show-branch>
          <h-form-item :label="$t('m.i.ce.custArea')" prop="custArea" required>
            <h-select v-model="addForm.custArea" placeholder="">
              <h-option v-for="item in custAreaList" :value="item.key" :key="item.key">{{item.value}}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="custMgrNo" :label="$t('m.i.common.custMgrNo')" required>
            <h-input v-model="addForm.custMgrNo" placeholder="" readonly icon="android-search"
                     @on-click="queryCustManager('new')"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custMgrName')" prop="custMgrName" required>
            <h-input v-model="addForm.custMgrName" :maxlength=60 readonly></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!=='view'">
        <h-button type="ghost" @click="editWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>
      </div>
      <div slot="footer" v-else>
        <h-button type="ghost" @click="editWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 行业投向详细信息选择框 -->
    <h-msg-box v-model="dictNameSelectWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>行业投向选择</span>
      </p>
      <div class="h-tree-search">
        <div class="h-modal-header-wrapper">
          <div class="h-modal-header-btn">
            <h-button type="primary" :disabled="isDisabled" @click='expandTree(indTreeData)'>
              {{$t("m.i.common.expand")}}
            </h-button>
            <h-button type="primary" :disabled="!isDisabled" @click='unExpandTree(indTreeData)'>
              {{$t("m.i.common.noExpand")}}
            </h-button>
          </div>
        </div>
        <div class="h-tree-content" style="position:relative;height:300px">
          <h-tree :data="indTreeData" ref='indTreeData' class='h-tree-self' :show-checkbox="false"></h-tree>
        </div>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="dictNameSelectWin=!dictNameSelectWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="indNameAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, formatNumber, accMul, getMoreParamValuesByKeys } from "@/api/bizApi/commonUtil";

  export default {
    name: "discSignMain",
    components: {
      DiscSignLog:() => import(/* webpackChunkName: "ce/disc/elec/fastdisc/discSignLog" */`@/views/bizViews/ce/disc/elec/fastdisc/discSignLog`),
      ShowSelectBranch:() => import(/* webpackChunkName: "sm/auth/branch/showBranch" */`@/views/bizViews/sm/auth/branch/showSelectBranch`),
      DiscSignOperate:() => import(/* webpackChunkName: "banks/szbank/ce/disc/elec/fastdisc/discSignOperate" */`@/views/bizViews/banks/szbank/ce/disc/elec/fastdisc/discSignOperate`),
      ShowCustManager:() => import(/* webpackChunkName: "bm/cust/manager/showCustManager" */`@/views/bizViews/bm/cust/manager/showCustManager`)
    },
    data() {
      let addForm = {
        signMode:"2",
        billType:"AC01",
        custAcctNo: "",
        custNo: "",
        custName:"",
        channelNo:"",
        isLimitFdiscSum:"",
        everydayFdiscSum:"",
        applDt: window.sessionStorage.getItem("workDate"),
        signBrchNo: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
        signBrchName:JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
        applActiveDt: "",
        applFailureDt: "",
        discInBrchNo: "",
        discInBrchName:"",
        isBargain: "",
        bargainRate: "",
        adjustRate: "",
        limitAmt: "",
        industryCategory:"",
        industryCategoryName:"",
        custMgrNo:"",
        custMgrName:"",
        custArea:"",
      };
      return {
        activeDt : [],
        applDt : [],
        failureDt : [],
        applActiveDt : [],
        applFailureDt : [],
        actualActiveDt : [],
        actualFailureDt : [],
        operSignUrl : "",
        addOrEditWin: false,
        addForm: addForm,
        socCodeRule: [{ test: /^[0-9A-Z]{18}$/, trigger: "blur", message: "统一社会信用代码由18位数字或大写字母组成" }],
        ratePctRule :[{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
        adjustRateRule : [{
          // ([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)
          test: /^(((\d|[1-9]\d|-\d|-[0-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000|-100|-100\.0|-100\.00|-100\.000|-100\.0000)$/,
          trigger: "blur",
          message: "利率为-100~100之间的数，小数位不超过4位"
        }],
        discLimitRule : [{
          // ([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)
          test: /^[1-9][0-9]*$/,
          trigger: "blur",
          message: "每日极速贴现张数为正整数"
        }],
        formItem : {
          busiType: "1",
          custNo: "",
          custName: "",
          custAcctNo: "",
          signStatus: "",
          isBargain:"",
          minApplDt: "",
          maxApplDt: "",
          minActiveDt: "",
          maxActiveDt: "",
          minApplActiveDt: "",
          maxApplActiveDt: "",
          minActualActiveDt: "",
          maxActualActiveDt: "",
          minFailureDt: "",
          maxFailureDt: "",
          minApplFailureDt: "",
          maxApplFailureDt: "",
          minActualFailureDt: "",
          maxActualFailureDt: "",
          discInBrchNo: "",
          discInBrchName: "",
          custMgrNo: "",
          custMgrName: "",
          channelNo: ""
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "custAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.signBrchName"),
            key: "signBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.signStatus"),
            key: "signStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FDiscSignStatus", params.row.signStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.signChannel"),
            key: "channelName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.ce.signApplyDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt;
              if (!!params.row.applDt) {
                date = this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.signApplyTm"),
            key: "applTm",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let time = params.row.applTm;
              if (!!params.row.applTm) {
                let transTm = params.row.applTm.toString();
                if (transTm.length < 6) {
                  for (let i = 0; i < (6 - transTm.length); i++) {
                    transTm = "0" + transTm;
                  }
                }
                time = this.$moment(transTm, "HH:mm:ss").format("HH:mm:ss");
              }
              return h("span", time);
            }
          },
          {
            title: this.$t("m.i.ce.applSignEnableDt"),
            key: "applActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applActiveDt;
              if (!!params.row.applActiveDt) {
                date = this.$moment(params.row.applActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.applSignDueDt"),
            key: "applFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applFailureDt;
              if (!!params.row.applFailureDt) {
                date = this.$moment(params.row.applFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignEnableDt"),
            key: "actualActiveDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualActiveDt;
              if (!!params.row.actualActiveDt) {
                date = this.$moment(params.row.actualActiveDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.actualSignDueDt"),
            key: "actualFailureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.actualFailureDt;
              if (!!params.row.actualFailureDt) {
                date = this.$moment(params.row.actualFailureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              }
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.adjustRate"),
            key: "adjustRate",
            hiddenCol: false,
            render: (h, params) => {
              let  adjustRate = formatNumber(accMul(params.row.adjustRate, 100), 4, ",");
              return h("span", adjustRate);
            }
          },
          {
            title: this.$t("m.i.ce.limitAmt"),
            key: "limitAmt",
            hiddenCol: false,
            render: (h, params) => {
              let limitAmt = formatNumber(params.row.limitAmt, 2, ",");
              return h("span", {
                domProps: {
                  title: limitAmt
                }
              }, limitAmt);
            }
          },
          {
            title: this.$t("m.i.ce.discInBrchName"),
            key: "discInBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.isBargain"),
            key: "isBargain",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isBargain);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.bargainRate"),
            key: "bargainRate",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let  bargainRate = formatNumber(accMul(params.row.bargainRate, 100), 4, ",");
              return h("span", bargainRate);
            }
          },
          {
            title: this.$t("m.i.ce.isLimitFdiscSum"),
            key: "isLimitFdiscSum",
            ellipsis: false,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isLimitFdiscSum);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.everydayFdiscSum"),
            key: "everydayFdiscSum",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.ce.inCustManagerNo"),
            key: "custMgrNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.inCustManagerName"),
            key: "custMgrName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.ce.industryCategory'),
            key: "industryCategory",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "IndustryCategoryDetail", params.row.industryCategory);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.custArea"),
            key: "custArea",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "CustArea", params.row.custArea);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.bm.operOpin"),
            key: "checkRemark",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",
            hiddenCol: true
          }
        ],
        YonList : [],
        custAreaList : [],
        dictMap : new Map(),
        currentSelectRow : [],
        //是否显示更多查询项
        ifShowMore : false,
        showCustMessageWin : false,
        showCustMessageWinForAdd : false,
        showCustAcctNoWin : false,
        showCustAcctNoWinForAdd : false,
        showCustManagerWin : false,
        indTreeData : [],
        dictNameSelectWin : false,
        custManagerOptType : null,
        //贴入行机构查询弹出框
        showDiscInBrchWin : false,
        discInBrchOptType : null,
        //签约操作弹出框
        discSignOperateWin : false,
        signParams : {},
        //查询操作历史弹出框
        discSignLogWin : false,
        detailFormItem : {},
        isAcceptAllow : true,
        isEditAllow : true,
        isPauseAllow : true,
        isRecoveryAllow : true,
        isStopAllow : true,
        synchAmtShow:false,
        isShowAddBtn:false,
        isAudit:false,
        type: '',
        submitFlag: false,
        isDisabled: true
      };
    },
    created(){
      getMoreParamValuesByKeys("pc.flow.is_audit_enable").then(res => {
        let idAudit = res['pc.flow.is_audit_enable'];
        if(idAudit === '1'){
          this.isAudit = true;
        } else {
          this.isAudit = false;
        }
      });
    },
    mounted() {
      this.buttonAuthShow();
      this.getIsSynchAmt();
      this.getDictListByGroups("FDiscSignStatus,Yon,IndustryCategoryDetail,CustArea").then(res => {
        this.YonList = res.get("Yon");
        this.custAreaList = res.get("CustArea");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      initBtn() {
        this.isAcceptAllow = true;
        this.isEditAllow = true;
        this.isPauseAllow = true;
        this.isRecoveryAllow = true;
        this.isStopAllow = true;
      },
      //表单查询
      handleSearch() {
        this.$refs["formItem"].validate(valid => {
          if (valid) {
            this.currentSelectRow = [];
            this.formItem.minApplDt = this.formItem.minApplDt.replace(/-/g, "");
            this.formItem.maxApplDt = this.formItem.maxApplDt.replace(/-/g, "");
            this.formItem.minActiveDt = this.formItem.minActiveDt.replace(/-/g, "");
            this.formItem.maxActiveDt = this.formItem.maxActiveDt.replace(/-/g, "");
            this.formItem.minFailureDt = this.formItem.minFailureDt.replace(/-/g, "");
            this.formItem.maxFailureDt = this.formItem.maxFailureDt.replace(/-/g, "");
            this.formItem.minApplActiveDt = this.formItem.minApplActiveDt.replace(/-/g, "");
            this.formItem.maxApplActiveDt = this.formItem.maxApplActiveDt.replace(/-/g, "");
            this.formItem.minApplFailureDt = this.formItem.minApplFailureDt.replace(/-/g, "");
            this.formItem.maxApplFailureDt = this.formItem.maxApplFailureDt.replace(/-/g, "");
            this.formItem.minActualActiveDt = this.formItem.minActualActiveDt.replace(/-/g, "");
            this.formItem.maxActualActiveDt = this.formItem.maxActualActiveDt.replace(/-/g, "");
            this.formItem.minActualFailureDt = this.formItem.minActualFailureDt.replace(/-/g, "");
            this.formItem.maxActualFailureDt = this.formItem.maxActualFailureDt.replace(/-/g, "");
            this.$refs.datagrid.dataChange(1);
            this.initBtn();
          }
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.activeDt = [];
        this.applDt = [];
        this.applActiveDt = [];
        this.applFailureDt = [];
        this.actualActiveDt = [];
        this.actualFailureDt = [];
        this.failureDt = [];
        this.formItem.minActiveDt = "";
        this.formItem.maxActiveDt = "";
        this.formItem.minApplActiveDt = "";
        this.formItem.maxApplActiveDt = "";
        this.formItem.minActualActiveDt = "";
        this.formItem.maxActualActiveDt = "";
        this.formItem.minApplDt = "";
        this.formItem.maxApplDt = "";
        this.formItem.minFailureDt = "";
        this.formItem.maxFailureDt = "";
        this.formItem.minApplFailureDt = "";
        this.formItem.maxApplFailureDt = "";
        this.formItem.minActualFailureDt = "";
        this.formItem.maxActualFailureDt = "";
        this.formItem.custMgrNo = "";
        this.formItem.discInBrchNo = "";
        this.formItem.discInBrchName = "";
        this.$refs.formItem.resetFields();
        this.currentSelectRow = [];
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
        //签约待受理FD01：受理可用；签约已生效FD07：修改、暂停、终止可用；签约已暂停FD13：恢复、终止可用
        if (currentRow.signStatus === "FD01") {
          this.isAcceptAllow = false;
          this.isEditAllow = true;
          this.isPauseAllow = true;
          this.isRecoveryAllow = true;
          this.isStopAllow = true;
        } else if (currentRow.signStatus === "FD07") {
          this.isAcceptAllow = true;
          this.isEditAllow = false;
          this.isPauseAllow = false;
          this.isRecoveryAllow = true;
          this.isStopAllow = false;
        } else if (currentRow.signStatus === "FD15") {
          this.isAcceptAllow = true;
          this.isEditAllow = true;
          this.isPauseAllow = true;
          this.isRecoveryAllow = false;
          this.isStopAllow = false;
        } else if (currentRow.signStatus === "FD05") {
          this.isAcceptAllow = true;
          this.isEditAllow = false;
          this.isPauseAllow = true;
          this.isRecoveryAllow = true;
          this.isStopAllow = false;
        } else if (currentRow.signStatus === "FD20") {
          this.isAcceptAllow = true;
          this.isEditAllow = false;
          this.isPauseAllow = true;
          this.isRecoveryAllow = true;
          this.isStopAllow = true;
        }
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
        this.initBtn();
      },
      adjustRateVaild() {
        this.addForm.adjustRate = this.addForm.adjustRate.trim();
        if (this.addForm.adjustRate.length != 0 && Number(this.addForm.adjustRate)) {
          let min = Number(this.addForm.adjustRate)
          if (min < 0 || min > 100) {
            this.$msgTip.info(this, {info:"利率：0~100(最多4位小数)"});
            this.addForm.adjustRate = ''
          }
        }
        else {
          this.addForm.adjustRate = ''
        }
      },
      handleApplActiveDtSingelChange(value) {
        this.addForm.applActiveDt = value.replace(/-/g, "");
      },
      handleApplFailureDtSingelChange(value) {
        this.addForm.applFailureDt = value.replace(/-/g, "");
      },
      handleActiveDtChange(arr) {
        this.formItem.minActiveDt = arr[0].replace(/-/g, "");
        this.formItem.maxActiveDt = arr[1].replace(/-/g, "");
        this.activeDt = [arr[0], arr[1]];
      },
      handleApplActiveDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minApplActiveDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplActiveDt = arr[1].replace(/-/g, "");
          this.applActiveDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplActiveDt = "";
          this.formItem.maxApplActiveDt = "";
          this.applActiveDt = [];
        }
      },
      handleApplFailureDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minApplFailureDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplFailureDt = arr[1].replace(/-/g, "");
          this.applFailureDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplFailureDt = "";
          this.formItem.maxApplFailureDt = "";
          this.applFailureDt = [];
        }
      },
      submitForm() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            // 新增的url
            let url = "/ce/disc/elec/fastdisc/discSignMain/func_signManage";
            let addParam = this.deepClone(this.addForm);
            post(addParam, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.addFormReset();
                  this.addOrEditWin = false;
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                } else {
                  let msg = this.$t("m.i.common.addFailed");
                  this.submitFailed(msg, res.data.retMsg);
                }
              } else {
                let msg =this.$t("m.i.common.addFailed");
                this.submitFailed(msg, this.$t("m.i.common.netError"));
              }
            });
          }
        });
      },
      buttonAuthShow(){
        //按钮权限查询 控制按钮显隐
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
              if (this.btnAuth.isShowAddBtn === undefined ? false : this.btnAuth.isShowAddBtn.isShow) {
                this.isShowAddBtn = true;
              } else {
                this.isShowAddBtn = false;
              }
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      handleActualActiveDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minActualActiveDt = arr[0].replace(/-/g, "");
          this.formItem.maxActualActiveDt = arr[1].replace(/-/g, "");
          this.actualActiveDt = [arr[0], arr[1]];
        } else {
          this.formItem.minActualActiveDt = "";
          this.formItem.maxActualActiveDt = "";
          this.actualActiveDt = [];
        }
      },
      handleActualFailureDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minActualFailureDt = arr[0].replace(/-/g, "");
          this.formItem.maxActualFailureDt = arr[1].replace(/-/g, "");
          this.actualFailureDt = [arr[0], arr[1]];
        } else {
          this.formItem.minActualFailureDt = "";
          this.formItem.maxActualFailureDt = "";
          this.actualFailureDt = [];
        }
      },
      submitFailed(title, retMsg) {
        this.$msgTip.error(this, { info: retMsg });
      },
      handleApplDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minApplDt = arr[0].replace(/-/g, "");
          this.formItem.maxApplDt = arr[1].replace(/-/g, "");
          this.applDt = [arr[0], arr[1]];
        } else {
          this.formItem.minApplDt = "";
          this.formItem.maxApplDt = "";
          this.applDt = [];
        }
      },
      handleFailureDtChange(arr) {
        this.formItem.minFailureDt = arr[0].replace(/-/g, "");
        this.formItem.maxFailureDt = arr[1].replace(/-/g, "");
        this.failureDt = [arr[0], arr[1]];
      },
      //查询客户信息
      queryCustNo() {
        this.showCustMessageWin = true;
      },
      queryCustNoForAdd() {
        this.showCustMessageWinForAdd = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.custNo = info.custNo;
        this.formItem.custName = info.custName;
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustMessageWin = false;
      },
      //赋值
      custCorpSelectForAddSubmit(info) {
        this.addForm.custNo = info.custNo;
        this.addForm.custName = info.custName;
        this.addForm.custAcctNo = info.custAcctNo;
        this.showCustMessageWinForAdd = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      custCorpWinForAddClose() {
        this.showCustMessageWinForAdd = false;
      },
      //查询客户账号信息
      queryCustAcctNo() {
        if (this.formItem.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //查询客户账号信息
      queryCustAcctNoForAdd() {
        if (this.addForm.custNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWinForAdd = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //赋值
      custAcctNoSelectForAddSubmit(info) {
        this.addForm.custAcctNo = info.custAcctNo;
        this.showCustAcctNoWinForAdd = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinForAddClose() {
        this.showCustAcctNoWinForAdd = false;
      },
      //查询客户经理
      queryCustManager(optType) {
        this.showCustManagerWin = true;
        this.custManagerOptType = optType;
      },
      //赋值
      custManagerSelect(info) {
        if (this.custManagerOptType === "query") {
          this.formItem.custMgrNo = info.custMgrNo;
          this.formItem.custMgrName = info.custMgrName;
        } else if (this.custManagerOptType === "add") {
          this.$refs.discSignOperate.discSignOperateForm.custMgrNo = info.custMgrNo;
          this.$refs.discSignOperate.discSignOperateForm.custMgrName = info.custMgrName;
        } else if (this.custManagerOptType === "new") {
          this.addForm.custMgrNo = info.custMgrNo;
          this.addForm.custMgrName = info.custMgrName;
        }
        this.showCustManagerWin = false;
      },
      queryDetailName() {
        post({code : "IndustryCategoryDetail"}, "/sm/config/dictionary/getIndustyDetailDict").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.expandTree(data);
            this.indTreeData = data;
          }
          this.dictNameSelectWin = true;
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //关闭弹窗
      showCustManagerWinClose() {
        this.showCustManagerWin = false;
      },
      //查询贴入行机构弹出框
      queryDiscInBrchNo(optType) {
        this.showDiscInBrchWin = true;
        this.discInBrchOptType = optType;
      },
      //根据弹框所选数据进行赋值
      discInBrchChange(info) {
        if (this.discInBrchOptType === "query") {
          this.formItem.discInBrchNo = info[0].id;
          this.formItem.discInBrchName = info[0].title;
        } else if (this.discInBrchOptType === "add") {
          this.$refs.discSignOperate.discSignOperateForm.discInBrchNo = info[0].id;
          this.$refs.discSignOperate.discSignOperateForm.discInBrchName = info[0].title;
        }
        this.showDiscInBrchWin = false;
      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.addForm.limitAmt)) && isFinite(this.addForm.limitAmt)) {
            this.addForm.limitAmt = this.addForm.limitAmt == null ? "0.00" : formatNumber(this.addForm.limitAmt, 2, ",");
          }
        } else if (optType === "focus") {
          this.addForm.limitAmt = this.addForm.limitAmt.toString().replace(/,/g, "");
        }
      },
      //展开左侧树
      expandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = true;
      },
      //收拢左侧树
      unExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            this.$set(arr[i], "expand", isExpand);
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      indNameAdd() {
        let arr = this.$refs["indTreeData"].getSelectedNodes();
        if(arr[0].id.length < 5){
          this.$msgTip.error(this, { info: "请选择具体行业投向！" });
          return;
        }
        this.addForm.industryCategory = arr[0].id;
        this.addForm.industryCategoryName = arr[0].title;
        this.dictNameSelectWin = false;
      },
      showDiscInBrchWinClose() {
        this.showDiscInBrchWin = false;
      },
      handleAddForm() {
        this.addOrEditWin = true;
      },
      editWinClose() {
        this.addFormReset();
        this.addOrEditWin = false;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
      },
      signOperate(optType) {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (optType !== "detail") {
            this.discSignOperateWin = true;
            if (optType === "accept") {
              this.operSignUrl = "/ce/disc/elec/fastdisc/discSignMain/func_accept";
            } else if (optType === "edit") {
              this.operSignUrl = "/ce/disc/elec/fastdisc/discSignMain/func_update";
            } else if (optType === "pause") {
              this.operSignUrl = "/ce/disc/elec/fastdisc/discSignMain/func_pause";
            } else if (optType === "recovery") {
              this.operSignUrl = "/ce/disc/elec/fastdisc/discSignMain/func_recovery";
            } else if (optType === "stop") {
              this.operSignUrl = "/ce/disc/elec/fastdisc/discSignMain/func_stop";
            } else if (optType === "check") {
              this.operSignUrl = "/ce/disc/elec/fastdisc/discSignMain/func_check";
            }
            this.signParams = {
              optType: optType,
              custAreaList: this.custAreaList,
              YonList: this.YonList,
              dictMap: this.dictMap,
              currentSelectRow: this.currentSelectRow,
              synchAmtShow:this.synchAmtShow
            };
          } else {
            this.discSignLogWin = true;
            this.detailFormItem.signId = this.currentSelectRow.id;
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      discSignOperateSubmit() {
        this.discSignOperateWin = false;
        this.$msgTip.success(this);
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
        this.signParams = {};
      },
      discSignOperateWinClose() {
        this.discSignOperateWin = false;
        this.signParams = {};
      },
      discSignLogWinClose() {
        this.discSignLogWin = false;
        this.detailFormItem = {};
      },
      synchAmt(){
        if (this.addForm.custNo === "" || this.addForm.custAcctNo === "" ||
          this.addForm.custNo === null || this.addForm.custAcctNo === null) {
          this.$msgTip.info(this, { info: "客户号和客户账号不能为空" });
          return;
        }
        //同步业务额度
        post({custNo: this.addForm.custNo,custAcctNo: this.addForm.custAcctNo}, "/ce/disc/elec/fastdisc/discSignMain/fun_syncLimitAmt").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addForm.limitAmt = res.data.retData.limitAmt;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //获取系统参数（是否从外围同步业务限额）
      getIsSynchAmt() {
        post({},"/ce/disc/elec/fastdisc/discSignMain/getIsSynchAmtParam").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              if (res.data.retData === "1") {
                this.synchAmtShow = true;
              } else {
                this.synchAmtShow = false;
              }
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
    }
  };
</script>

<style scoped>

</style>
