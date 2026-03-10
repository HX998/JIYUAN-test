<template>
  <!--纸票托收修改申请界面-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="collectionModifyApplyBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.ce.isCommit')" prop="isCommit">
                    <h-radio-group v-model="formItem.isCommit">
                      <h-radio label="noCommit" @on-click="noCommitButton">
                        <span>未提交</span>
                      </h-radio>
                      <h-radio label="hasCommit" @on-click="hasCommitButton">
                        <span>已提交</span>
                      </h-radio>
                    </h-radio-group>
                  </h-form-item>
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <h-form-item :label="$t('m.i.ce.entrustAdverseBankNo')" prop="drweBankNoLike">
                    <h-input v-model="formItem.drweBankNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.hldrName')" prop="hldrNameLike" >
                    <h-input v-model="formItem.hldrNameLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.hldrAcctNo')" prop="hldrAcctNoLike" >
                    <h-input v-model="formItem.hldrAcctNoLike"></h-input>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                :url="batchUrl"
                :row-select="true"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" v-if="noCommitDisabled" @click="collectionModify()">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" v-if="noCommitDisabled" @click="collectionDelect()">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="handleForm()">{{$t("m.i.ce.billManage")}}</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
        </div>
        <prsttn-batch-info-detail :is-show="collectionModifyApplyBillMain" :batchId="this.batchId"
                                  :isQuery="isQuery" :funcNo="this.funcNo" ref="prsttnBatchInfoDetail"></prsttn-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="collectionModifyApplyBillMain" key="2">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_pageQueryPrsttnBill"
            :row-select="true"
            :has-select="billHasSelect"
            ref="billDatagrid">
            <div slot="toolbar">
              <h-button type="primary" v-if="noCommitDisabled" @click="pickBillOpen()">{{$t("m.i.ce.pickBill")}}</h-button>
              <!--<h-button type="primary" v-if="noCommitDisabled" @click="deleteSelectBatch()">{{$t("m.i.common.delete")}}</h-button>-->

              <h-dropdown trigger="click" @on-click="deleteBillBtn">
                <h-button type="primary" v-if="noCommitDisabled">{{$t("m.i.common.delete")}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="selectDelete">选择删除</h-dropdown-item>
                  <h-dropdown-item name="listDelete">批次删除</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>

              <h-button type="primary" v-if="noCommitDisabled" @click="prsttnPrint">{{$t("m.i.ce.remitPrint")}}</h-button>
              <h-button type="primary" v-if="noCommitDisabled" @click="envelopePrint">{{$t("m.i.ce.envelopePrint")}}</h-button>
              <h-button type="primary" v-if="noCommitDisabled" @click="prsttnBillPrint">{{$t("m.i.ce.remitBillPrint")}}</h-button>
              <!--<h-button type="primary" v-if="noCommitDisabled" @click="submitBill()">{{$t("m.i.common.submit")}}</h-button>-->

              <h-dropdown trigger="click" @on-click="submitBillBtn">
                <h-button type="primary"  v-if="noCommitDisabled">{{$t("m.i.be.submission")}}
                  <h-icon name="unfold"></h-icon>
                </h-button>
                <h-dropdown-menu slot="list">
                  <h-dropdown-item name="selectSubmit">选择提交</h-dropdown-item>
                  <h-dropdown-item name="listSubmit">批次提交</h-dropdown-item>
                </h-dropdown-menu>
              </h-dropdown>

              <h-button type="primary" v-if="hasCommitDisabled" @click="cancelApplyBill()">{{$t("m.i.common.cancel")}}</h-button>
              <h-button type="ghost" @click="returnBack()">{{$t("m.i.common.goBack")}}</h-button>
            </div>
          </h-datagrid>
        </div>

      </h-col>
    </h-row>

    <!-- 点击提示付款申请界面 -->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>修改信封</span>
      </p>
      <h-panel>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.billInfo.drweBankName')" prop="drweBankName" required>
            <h-input v-model="addOrEditForm.drweBankName" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.drweBankNo')" prop="drweBankNo" required>
            <h-input v-model="addOrEditForm.drweBankNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.address')" prop="drweAddr" required>
            <h-input v-model="addOrEditForm.drweAddr" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.contactWay')" prop="drwePhone" required>
            <h-input v-model="addOrEditForm.drwePhone" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.postCode')" prop="drwePostCode" required :validRules="postCodeRule">
            <h-input v-model="addOrEditForm.drwePostCode" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.EMSCode')" prop="emsNo" >
            <h-input v-model="addOrEditForm.emsNo" placeholder=""></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.ce.prsttnType')" prop="prsttnType" required>
            <h-select v-model="addOrEditForm.prsttnType"  placeholder="" readonly>
              <h-option v-for="item in SubTypeCodeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.hldrName')" prop="hldrName" required>
            <h-input v-model="addOrEditForm.hldrName" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.hldrAcctNo')" prop="hldrAcctNo" required>
            <h-input v-model="addOrEditForm.hldrAcctNo" placeholder="" readonly></h-input>
          </h-form-item>
          <h-form-item v-if="this.addOrEditForm.prsttnType === 'ST02' && (this.btnAuth.postFee === undefined ? false :
          this.btnAuth.postFee.isShow)" label="邮电费" prop="postFee" required>
            <h-typefield type="money" v-model="addOrEditForm.postFee" placeholder="数字，小数最多为2位"></h-typefield>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary"  v-else @click="submit()">{{$t("m.i.common.submit")}}</h-button>
      </div>
    </h-msg-box>

    <!--托收挑票弹出框-->
    <h-msg-box v-model="collectionPickBillWin" width="1000"  @on-close="pickBillHandleClose"
               class="h-form-table-layer" :maximize="true">
      <p slot="header">
        <span>票据挑票</span>
      </p>
      <!--查询表单-->
      <div>
        <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
          <h-form :model="pickBillForm" :label-width="115" ref="pickBillForm" cols="4" class="h-form-search">
            <h-form-item :label="$t('m.i.billInfo.billNo')" prop="reverseBillNo">
              <h-input v-model="pickBillForm.reverseBillNo" placeholder=""></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.minDueDt')" prop="minDueDt">
              <h-date-picker type="date" v-model="pickBillForm.minDueDt" placeholder="" @on-change="handleMinDateChange" :editable=false></h-date-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.maxDueDt')" prop="maxDueDt">
              <h-date-picker type="date" v-model="pickBillForm.maxDueDt" placeholder="" @on-change="handleMaxDateChange" :editable=false></h-date-picker>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType">
              <h-select v-model="pickBillForm.billType" placeholder="" readonly>
                <h-option v-for="item in billTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
              </h-select>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
			  <h-typefield type="money" v-model="pickBillForm.minBillMoney" placeholder="" bigTips></h-typefield>
            </h-form-item>
            <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
			   <h-typefield type="money" v-model="pickBillForm.maxBillMoney" placeholder="" bigTips></h-typefield>
            </h-form-item>
            <h-form-item class="h-form-operate">
              <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
              <h-button type="primary" @click="pickBillFormSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="pickBillFormSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </h-form>
        </h-panel>
      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="pickColumns"
        :auto-load="false"
        highlightRow
        url="/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_queryApplyHldrInfoForPaper"
        :bindForm="pickBillForm"
        param-id="billId"
        :has-select="false"
        :row-select="true"
        ref="pickBillDatagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="pickBillHandleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="pickBillSubmitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

  </div>
</template>

<script>
  import { post, on, off, billMoneyDisplay, cmycurd, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pPrsttnModifyApplyMain",
    components: {
      PrsttnBatchInfoDetail: () => import(/* webpackChunkName: "pb/prsttn/common/prsttnBatchInfoDetail" */ '@/views/bizViews/pb/prsttn/common/prsttnBatchInfoDetail')
    },
    data() {
      function validPostCode(rule,val,callback){
        let re = /^[0-9]{6}$/;
        if(val == null || val == ''){
          callback()
        }
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，邮编由6位数字组成"))
        }
      }
      return {
        licenseFlag:false,
        authPath:this.$route.path ,
        ownedBrchNo:"",
        formItem : {
          isCommit:"noCommit",
          drweBankNoLike:"",
          hldrNameLike:"",
          hldrAcctNoLike:"",
          curFuncNo:"PICE040115",
          ownedBrchNos:"",
          ownedBrchNames:"",
          authPath:this.$route.path ,
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.hldrAcctNo"),
            key: "hldrAcctNo",

            hiddenCol: false
          },
          {
             title: this.$t("m.i.billInfo.hldrName"),
            key: "hldrName",
            sortable: true,
            hiddenCol: false
          },
          {
             title: this.$t("m.i.ce.entrustAdverseBankNo"),
            key: "drweBankNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.entrustAdverseBankName"),
            key: "drweBankName",

            hiddenCol: false
          },
          {
             title: this.$t("m.i.common.address"),
            key: "drweAddr",

            hiddenCol: false
          },
          {
             title: this.$t("m.i.common.postCode"),
            key: "drwePostCode",

            hiddenCol: false
          },
          {
             title: this.$t("m.i.common.EMSCode"),
            key: "emsNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.totalCount"),
            key: "totalCount",

            hiddenCol: false,
            render: (h, params) => {
              if (params.row.totalCount === "" || params.row.totalCount == null) {
                return h("span", "0");
              }else {
                return h("span", params.row.totalCount);
              }
            }
          },
          {
            title: this.$t("m.i.ce.totalAmt"),
            key: "totalAmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(null == params.row.totalAmt || params.row.totalAmt === ""){
                return h("span", "0.00");
              }else {
                let totalAmt = formatNumber(params.row.totalAmt, 2, ',');
                return h("span", {
                  domProps: {
                    title: totalAmt
                  }
                }, totalAmt);
              }
            }
          },
        ],
        addOrEditForm : {
          ids:"",
          id:"",
          billClass:"ME01",
          drweBankName:"",
          drweBankNo:"",
          drweAddr:"",
          drwePhone:"",
          drwePostCode:"",
          emsNo:"",
          prsttnType:"",
          hldrName:"",
          hldrAcctNo:"",
          prsnttnCommonDtoList:[],
          postFee:""
        },
        billFormItem : {
          billClass:"ME01",
          curFuncNo:"PICE040115",
          batchId:"",
          ids:"",
          authPath:this.authPath,
          ownedBrchNos:"",
        },
        billColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",

            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatusName",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",

            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",

            hiddenCol: false,
            sortable: true
          },
        ],
        batchUrl : "",
        noCommitUrl : "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_queryPagePrsttnBatch",
        hasCommitUrl : "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_queryPageBatchNotEmpty",
        YonList : [],
        SubTypeCodeList : [],
        dictMap : new Map(),
        currentBatchSelectList : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        ifShowMore : false,
        noCommitDisabled : true,
        hasCommitDisabled : false,
        collectionModifyApplyBatchMain : true,
        collectionModifyApplyBillMain : false,
        addOrEditWin : false,
        isQuery : '',
        batchId : '',
        subType : '',
        //挑票界面
        collectionPickBillWin : false,
        pickBillForm : {
          batchId:"",
          subType:"",
          reverseBillNo:"",
          minDueDt:"",
          maxDueDt:"",
          billType:"",
          minBillMoney:"",
          maxBillMoney:"",
          drweBankName:"",
          drweBankNoLike:"",
          hldrName:"",
          hldrAcctNo:"",
          oppName:"",
          oppAcctNo:"",
          authPath:this.authPath,
          ownedBrchNos:"",
        },
        pickColumns : [],
        valetColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: remitDt}},  remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: dueDt}},   dueDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",

            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankName"),
            key: "drweBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "oppCustNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "oppName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custAcctNo"),
            key: "oppAcctNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.billResource"),
            key: "prodNo",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"PrsttnValetBillSource",params.row.prodNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        holdColumns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: remitDt}},  remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: dueDt}},   dueDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoney"),
            key: "billMoney",

            sortable: true,
            hiddenCol: false,
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
            title: this.$t("m.i.billInfo.drweBankNo"),
            key: "drweBankNo",

            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drweBankName"),
            key: "drweBankName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.billResource"),
            key: "prodNo",

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"PrsttnHldrBillSource",params.row.prodNo);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        billTypeList : [],
        submitFlag : false,
        funcNo : "",
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        hasSelect : false,
        billHasSelect : false,
        postCodeRule:[{test: validPostCode, trigger:'blur'}],
        btnAuth: {},
      }
    },
    mounted() {
      this.getDictListByGroups("Yon,DraftTypeCode,SubTypeCode,PrsttnHldrBillSource,PrsttnValetBillSource").then(res => {
        this.SubTypeCodeList = res.get("SubTypeCode");
        this.billTypeList = res.get("DraftTypeCode");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      this.noCommitButton();
      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            let  columns = [];
            if (this.licenseFlag) {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              columns = this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
            this.temp = this.deepClone(columns);
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      controlOwnedBrchShow(tempColumns,isHidden){
        tempColumns.forEach((value, index) => {
          if (value.key === 'ownedBrchName') {
            value.hiddenCol = isHidden;
          }
        });
      },
      handleMinDateChange(value){
        this.pickBillForm.minDueDt = value.replace(/-/g, "");
      },
      handleMaxDateChange(value){
        this.pickBillForm.maxDueDt = value.replace(/-/g, "");
      },
      //查询
      handleSearch() {
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentBatchSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.drweBankNoLike = '';
        this.formItem.hldrNameLike = '';
        this.formItem.hldrAcctNoLike = '';
        this.formItem.ownedBrchNos="";
        this.formItem.ownedBrchNames="";
      },
      //查询界面行选中
      batchSelectClick(arr) {
        this.currentBatchSelectList = arr;
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.billHasSelect = false;
          this.$refs.billDatagrid.selects = [];
          this.$refs.billDatagrid.selectIds = [];
          this.currentSelectList = [];
          this.$refs.billDatagrid.dataChange(1);
        })
      },
      // 票据管理行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      noCommitButton() {
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        this.formItem.curFuncNo = "PICE040115";
        this.batchUrl = this.noCommitUrl;
        this.$nextTick(() => {
          this.handleSearch();
        });
      },
      hasCommitButton() {
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
        this.formItem.curFuncNo = "PICE040116";
        this.batchUrl = this.hasCommitUrl;
        this.$nextTick(() => {
          this.handleSearch();
        });
      },
      //挑票界面查询
      pickBillFormSearch(){
        this.$nextTick(() => {
          this.$refs.pickBillDatagrid.selects = [];
          this.$refs.pickBillDatagrid.selectIds = [];
          this.$refs.pickBillDatagrid.dataChange(1);
        });
      },
      //挑票界面重置
      pickBillFormSearchReset() {
        this.$refs.pickBillForm.resetFields();
      },
      //修改界面
      collectionModify(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return
        }
        this.currentBatchSelectList = this.$refs.datagrid.selects;
        let batchId = this.currentBatchSelectList[0].id;
        post({ id : batchId},"/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_getPrsttnBatchById").then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.addOrEditWin = true;
              this.$nextTick(() => {
                this.$refs.addOrEditForm.resetFields();
                this.addOrEditForm.id = res.data.retData.id;
                this.addOrEditForm.drweBankName = res.data.retData.drweBankName;
                this.addOrEditForm.drweBankNo = res.data.retData.drweBankNo;
                this.addOrEditForm.drweAddr = res.data.retData.drweAddr;
                this.addOrEditForm.drwePhone = res.data.retData.drwePhone;
                this.addOrEditForm.drwePostCode = res.data.retData.drwePostCode;
                this.addOrEditForm.emsNo = res.data.retData.emsNo;
                this.addOrEditForm.prsttnType = res.data.retData.prsttnType;
                this.addOrEditForm.hldrName = res.data.retData.hldrName;
                this.addOrEditForm.hldrAcctNo = res.data.retData.hldrAcctNo;
                if (res.data.retData.prsttnType === 'ST02') {
                  this.addOrEditForm.postFee = res.data.retData.postFee;
                } else {
                  this.addOrEditForm.postFee = null;
                }
              });
            }else{
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }else{
            this.$msgTip.error(this, { info: this.$t('m.i.common.netError') });
          }
        });
      },
      //保存
      submit(){
        if (this.addOrEditForm.prsttnType === 'ST02' && (this.btnAuth.postFee === undefined ? false : this.btnAuth.postFee.isShow)) {
          if (Number(this.addOrEditForm.postFee) <= 0) {
            this.$msgTip.info(this, { info: this.$t("邮电费必须大于零") });
            return;
          }
        }
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.addOrEditForm ,"/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_updatePrsttnBatchById").then(res => {
              this.submitFlag = false;
              if(res){
                let retCode = res.data.retCode;
                if(retCode === "000000"){
                  this.$msgTip.success(this ,{ info: res.data.retMsg });
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentBatchSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                }else{
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo)
                }
              }else{
                this.$hMessage.error(this.$t('m.i.common.netError'))
              }
            });
          }
        });
      },
      //批次界面删除
      collectionDelect(){
        if (this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        let ids = this.$refs.datagrid.selectIds;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定删除吗?",
          onOk: () => {
            post( { id:ids.join(",") } , "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_deletePrsttnBatchById").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this,{info:msg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentBatchSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                } else {
                  this.$msgTip.error(this,{info:res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //票据管理
      handleForm(){
        if (this.$refs.datagrid.selects.length > 1) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseOneData")});
          return;
        }
        this.currentBatchSelectList = this.$refs.datagrid.selects;
        if (this.licenseFlag) {
          // 集中授权模式，所选数据机构号需一致
          let ownedBrchNo=this.currentBatchSelectList[0].transBrchNo;
          let flag=this.currentBatchSelectList.some( item => item.transBrchNo !== ownedBrchNo)
          if (flag) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据" });
            return;
          }
        this.ownedBrchNo=ownedBrchNo;
        }
        this.subType = this.currentBatchSelectList[0].prsttnType;
        this.collectionModifyApplyBatchMain = false;
        this.batchId = this.currentBatchSelectList[0].id;
        this.billFormItem.batchId = this.currentBatchSelectList[0].id;
        this.billFormItem.ownedBrchNos=this.ownedBrchNo;
        this.billFormItem.authPath=this.authPath
        this.isQuery = true;
        if(this.formItem.isCommit === "noCommit"){
          this.billFormItem.curFuncNo = "PICE040115";
          this.funcNo = "PICE040115"
        }
        if(this.formItem.isCommit === "hasCommit"){
          this.billFormItem.curFuncNo = "PICE040116";
          this.funcNo = "PICE040116"
        }
        this.collectionModifyApplyBillMain = true;
        this.billManagerHandleSearch();
        this.$nextTick(() => {
          this.$refs.billDatagrid.selfAdaption();
          this.controlOwnedBrchShow(this.billColumns,!this.licenseFlag)
          this.$refs.billDatagrid.createShowCol(this.billColumns);
        });
      },
      //挑票按钮
      pickBillOpen(){
        this.pickBillForm.subType = this.subType;
        this.pickBillForm.billType = this.currentBatchSelectList[0].billType;
        this.pickBillForm.drweBankName = this.currentBatchSelectList[0].drweBankName;
        this.pickBillForm.drweBankNoLike = this.currentBatchSelectList[0].drweBankNo;
        if(this.pickBillForm.subType === "ST01"){
          this.pickBillForm.hldrName = this.currentBatchSelectList[0].hldrName;
          this.pickBillForm.hldrAcctNo = this.currentBatchSelectList[0].hldrAcctNo;
          this.controlOwnedBrchShow(this.holdColumns,!this.licenseFlag)
          this.pickColumns = this.holdColumns;
        }
        if(this.pickBillForm.subType === "ST02"){
          this.pickBillForm.oppName = this.currentBatchSelectList[0].hldrName;
          this.pickBillForm.oppAcctNo = this.currentBatchSelectList[0].hldrAcctNo;
          this.controlOwnedBrchShow(this.valetColumns,!this.licenseFlag)
          this.pickColumns = this.valetColumns;
        }
        this.pickBillForm.ownedBrchNos=this.ownedBrchNo;
        this.pickBillForm.authPath=this.authPath
        this.collectionPickBillWin = true;
        this.pickBillFormSearch();
      },
      //挑票界面保存按钮
      pickBillSubmitForm(){
        let list = this.$refs.pickBillDatagrid.selects;
        list.forEach(row => {
          if (!row.billInfoAssDto){
            row.billInfoAssDto = {};
          }
        });
        post({ batchId:this.batchId ,commonDtoList: list,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}, "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_batchSelectPaperPrsttnBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.collectionPickBillWin = false;
              this.pickBillFormSearchReset();
              this.$refs.pickBillDatagrid.selects = [];
              this.$refs.pickBillDatagrid.selectIds = [];
              this.$refs.billDatagrid.dataChange(1);
              this.$refs.prsttnBatchInfoDetail.getBatchInfo();
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.billDatagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
          }
        });
      },
      //挑票界面取消按钮
      pickBillHandleClose(){
        this.collectionPickBillWin = false;
        this.pickBillFormSearchReset();
      },
      //选择删除
      deleteSelectBatch(){
        if(this.$refs.billDatagrid.selects.length === 0){
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = this.$refs.billDatagrid.selectIds;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定删除选中的票据吗?",
          onOk: () => {
            post( { ids:ids.join(",")} , "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_deleteSelectPaperPrsttnBill").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this,{info:msg});
                  if (retCode === "000000") {
                    this.$msgTip.success(this, { info: msg });
                    if (this.$refs.billDatagrid.tData.length === this.$refs.billDatagrid.selects.length) {
                      this.returnBack();
                    } else {
                      this.$refs.prsttnBatchInfoDetail.getBatchInfo();
                      this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
                      this.currentSelectList = [];
                      this.$refs.billDatagrid.selects = [];
                      this.$refs.billDatagrid.selectIds = [];
                    }
                  }
                } else {
                  this.$msgTip.error(this,{info:res.data.retMsg});
                  this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },

      // 选择/批次删除
      deleteBillBtn(obj){
        this.currentSelectBillList = this.$refs.billDatagrid.selects;
        if (obj == "selectDelete" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          let url = "";
          let confirmForm = {};
          if (obj == "selectDelete") {
            url = "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_deleteSelectPaperPrsttnBill";
            confirmForm.ids = this.$refs.billDatagrid.selectIds.join(",");
          }else if(obj == "listDelete"){
            confirmForm.batchId = this.batchId;
            confirmForm.billClass = this.billFormItem.billClass;
            url = "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_deleteSelectPaperPrsttnBatch";
          }
          if (this.$refs.billDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.be.confirmDelBill") + "?",
            onOk: () => {
              post( confirmForm , url).then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this,{info:msg});
                    if (this.$refs.billDatagrid.total === this.$refs.billDatagrid.selects.length) {
                      this.returnBack();
                    } else if(obj == "listDelete"){
                      this.returnBack();
                    }else {
                      this.$refs.prsttnBatchInfoDetail.getBatchInfo();
                      this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
                      this.currentSelectList = [];
                      this.$refs.billDatagrid.selects = [];
                      this.$refs.billDatagrid.selectIds = [];
                    }
                  } else {
                    this.$msgTip.error(this,{info:res.data.retMsg});
                    this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
                  }
                } else {
                  this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
                }
              });
            }
          })
        }
      },

      //票据管理界面提交按钮
      submitBill(){
        if (this.$refs.billDatagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        let ids = this.$refs.billDatagrid.selectIds.join(",");
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定提交申请吗？",
          onOk: () => {
            post({ ids:ids ,batchId:this.batchId, subType:this.subType,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}, "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_sumbitEnvelop").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  if(this.$refs.billDatagrid.total === this.$refs.billDatagrid.selects.length){
                    this.returnBack();
                  }else {
                    this.$refs.prsttnBatchInfoDetail.getBatchInfo();
                    this.billManagerHandleSearch();
                  }
                } else {
                  this.$msgTip.error(this,{info:res.data.retMsg});
                  this.$refs.billDatagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },

      submitBillBtn(obj){
        this.currentSelectBillList = this.$refs.billDatagrid.selects;
        if (obj == "selectSubmit" && this.currentSelectBillList.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        } else {
          let url = "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_sumbitEnvelop";
          let ids = "";
          if(obj == "selectSubmit"){
            ids = this.$refs.billDatagrid.selectIds.join(",");
          }
          if (this.$refs.billDatagrid.tData.length === 0) {
            this.$msgTip.info(this, { info: "该批次下无数据" });
            return;
          }
          this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: this.$t("m.i.common.confirmCommit") + "?",
              onOk: () => {
                post({ ids:ids ,batchId:this.batchId, subType:this.subType,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo}, url).then(res => {
                  if (res) {
                    let retCode = res.data.retCode;
                    if (retCode === "000000") {
                      this.$msgTip.success(this);
                      if(this.$refs.billDatagrid.total === this.$refs.billDatagrid.selects.length){
                        this.returnBack();
                      } else if(obj == "listSubmit"){
                        this.returnBack();
                      }else {
                        this.$refs.prsttnBatchInfoDetail.getBatchInfo();
                        this.billManagerHandleSearch();
                      }
                    } else {
                      this.$msgTip.error(this,{info:res.data.retMsg});
                      this.$refs.billDatagrid.dataChange(1);
                    }
                  } else {
                    this.$msgTip.error(this,{info:this.$t("m.i.common.netError")});
                  }
                });
              }
          })
        }
      },

      //撤销
      cancelApplyBill(){
        if (this.$refs.billDatagrid.selects.length === 0) {
          this.$msgTip.info(this,{info:this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定撤销申请吗？",
          onOk: () => {
            this.handleCancelApplyBatch();
          }
        });
      },
      handleCancelApplyBatch() {
        let ids = this.$refs.billDatagrid.selectIds;
        post({ ids : ids.join(",") ,batchId:this.batchId , subType:this.subType,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo }, "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_cancelSubmitEnvelop").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              if(this.$refs.billDatagrid.tData.length === this.$refs.billDatagrid.selects.length) {
                this.returnBack();
              }else{
                this.$refs.prsttnBatchInfoDetail.getBatchInfo();
                this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.$refs.gridPage.currentPage);
                this.currentSelectList = [];
                this.$refs.billDatagrid.selects = [];
                this.$refs.billDatagrid.selectIds = [];
              }
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
              this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      },
      //返回
      returnBack(){
        this.currentBatchSelectList = [];
        this.currentSelectList = [];
        this.isQuery = false;
        this.resetSearch();
        this.pickBillForm.oppName = "";
        this.pickBillForm.oppAcctNo = "";
        this.pickBillForm.hldrName = "";
        this.pickBillForm.hldrAcctNo = "";
        this.collectionModifyApplyBillMain = false;
        this.collectionModifyApplyBatchMain = true;
        this.$nextTick(() => {
          if (this.$refs.datagrid != null) {
            this.$refs.datagrid.selfAdaption();
            this.controlOwnedBrchShow(this.columns,!this.licenseFlag)
            this.$refs.datagrid.createShowCol(this.columns);
          }
        });
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId,billNo){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      //托收打印
      prsttnPrint() {
        if(this.$refs.billDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.$refs.billDatagrid.selects.length > 1) {
          this.$msgTip.info(this, { info: this.$t('m.i.common.onlyChooseOneData') });
          return;
        }
        this.currentSelectList = this.$refs.billDatagrid.selects;
        this.assemblePrsttnParams();
      },
      assemblePrsttnParams() {
        let vocherData = this.deepClone(this.currentSelectList);
        for (let i = 0; i < vocherData.length; i++) {
          let workDate = window.sessionStorage.getItem("workDate");
          vocherData[i].yyyy = workDate.toString().substring(0, 4);
          vocherData[i].mm = workDate.toString().substring(4, 6);
          vocherData[i].dd = workDate.toString().substring(6, 8);
          let billMoney = vocherData[i].billMoney === null ? "0" : vocherData[i].billMoney;
          vocherData[i].billMoney = cmycurd(vocherData[i].billMoney);
          let tempMoney = "¥" + billMoney.toString();
          billMoneyDisplay(tempMoney, vocherData[i]);
          let billType = vocherData[i].billType;
          if('AC02' === billType){
            billType='商承托收';
          } else {
            billType='银承托收';
          }
          vocherData[i].billType = billType;
          vocherData[i].acctBrchName = this.currentBatchSelectList[0].acctBrchName;
          vocherData[i].drweAddr = this.currentBatchSelectList[0].drweAddr;
          vocherData[i].drweBankName = this.currentBatchSelectList[0].drweBankName;
          vocherData[i].drweBankNo = this.currentBatchSelectList[0].drweBankNo;
          vocherData[i].hldrAcctNo = this.currentBatchSelectList[0].hldrAcctNo;
          vocherData[i].hldrName = this.currentBatchSelectList[0].hldrName;
          vocherData[i].flowNo = vocherData[i].acctFlowId;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);
        }
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE031801", vocherData: vocherData ,licenseFlag:this.licenseFlag,ownedBrchNo:this.currentSelectList[0].transBrchNo},
          callback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.currentSelectList = [];
          },
          errorCallback: () => {
            this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            this.currentSelectList = [];
          }
        });
      },
      //信封打印
      envelopePrint() {
        let vocherData = this.deepClone(this.currentBatchSelectList);
        post({ code:vocherData[0].drweBankNo}, "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_getPrsttnBankInfoByBankNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
             let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
              for (let i = 0; i < vocherData.length; i++) {
                vocherData[i].brchName = userInfo.brchName;
                vocherData[i].pyeePhone = res.data.retData.phone;
                vocherData[i].pyeeAddr = res.data.retData.address;
                vocherData[i].pyeePostCode = res.data.retData.postCode;
                vocherData[i].printObj = JSON.stringify(vocherData[i]);
              }
              this.$print.vochPrint(this, {
                exitDataFlag: true, params: { voucherType: "PE031802", vocherData: vocherData ,licenseFlag:this.licenseFlag,ownedBrchNo:vocherData[0].transBrchNo},
                callback: () => {
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectList = [];
                },
                errorCallback: () => {
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectList = [];
                }
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        })
      },
      //托收清单打印
      prsttnBillPrint() {
        let params = {
          billClass: this.billFormItem.billClass,
          batchId: this.billFormItem.batchId,
          curFuncNo: this.billFormItem.curFuncNo,
          licenseFlag: this.licenseFlag,
          ownedBrchNo: this.ownedBrchNo
        };
        post(params, "/pb/prsttn/paper/apply/pPrsttnModifyApplyMain/func_queryPrsttnBill").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let list = (res.data.retData.list instanceof Array) ? res.data.retData.list : [res.data.retData.list];
              this.assemblePrsttnBillParams(list);
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        })
      },
      assemblePrsttnBillParams(vocherData) {
        let bodyStr = "";
        for (let i = 0; i < vocherData.length; i++) {
          if (!!vocherData[i].remitDt) {
            vocherData[i].remitDt = this.$moment(vocherData[i].remitDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          if (!!vocherData[i].dueDt) {
            vocherData[i].dueDt = this.$moment(vocherData[i].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
          }
          vocherData[i].billMoney = formatNumber(vocherData[i].billMoney, 2, ',');
          vocherData[i].flowNo = vocherData[i].acctFlowId;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);

          bodyStr += "<tr>";
          bodyStr +=  "<td class='ta-c'>" + (1+i) + "</td>";
          bodyStr += "<td>" + vocherData[i].drwrName + "</td>";
          bodyStr += "<td>" + vocherData[i].acptName + "</td>";
          bodyStr += "<td>" + vocherData[i].billNo + "</td>";
          bodyStr += "<td>" + vocherData[i].remitDt + "</td>";
          bodyStr += "<td>" + vocherData[i].dueDt + "</td>";
          bodyStr += "<td>" + vocherData[i].billMoney + "</td>";
          bodyStr += "</tr>";
        }
        let headHtml = `<div style="text-align:center;" ref="headHtml">
          <div style="text-align:center;font-size:18px;font-weight:bold;">票据出库清单 编号：<label>${this.currentBatchSelectList[0].envelopeNo}</label></div>
        </div>`
        let footerHtml = `<div style="font-size:14px;font-weight:bold;display:-webkit-box;display:flex;justify-content:flex-end;">
          <label style="padding-right:20%">经办:</label>
          <label style="padding-right:20%">复核:</label>
          <label style="padding-right:20%">日期:</label>
        </div>`
        let bodyHtml = `<div class="list-table-box"><table class="list-table">
          <thead>
            <tr>
              <th class="ta-c"><b>序号</b></th>
              <th>出票人全称</th>
              <th>承兑人全称</th>
              <th>票据号码</th>
              <th>出票日期</th>
              <th>汇票到期日</th>
              <th>票面金额</th>
            </tr>
          </thead>
          <tbody>${bodyStr}</tbody>
        </table>
      </div>`;
        this.$print.printListHtm(this, headHtml, bodyHtml, { bodyTop: "12%", bodyLeft:"5%", bodyWidth:"90%", bodyHeight:"74%" }, footerHtml);
      },
      getPostFeeAuth(){
        let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
        post({ authId: id, loading: false }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            let retMsg = res.data.retMsg;
            if (retCode === "000000") {
              this.btnAuth = JSON.parse(res.data.retData);
            } else {
              this.$msgTip.error(this, { info: retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }

        });
      },
    },
    created(){
      this.getPostFeeAuth();
    }
  };
</script>

<style scoped>

</style>
