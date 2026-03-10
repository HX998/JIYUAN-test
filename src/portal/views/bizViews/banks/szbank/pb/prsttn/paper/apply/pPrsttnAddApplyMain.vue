<template>
  <!--纸票托收新增申请界面-->
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div v-if="collectionAddApplyBatchMain" key="1">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <h-form-item :label="$t('m.i.ce.remitType')" prop="subType">
                    <h-radio-group v-model="formItem.subType">
                      <h-radio label="ST01" @on-click="noCommitButton">
                        <span>持票</span>
                      </h-radio>
                      <h-radio label="ST02" @on-click="hasCommitButton">
                        <span>代客</span>
                      </h-radio>
                    </h-radio-group>
                  </h-form-item>
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <h-form-item :label="$t('m.i.billInfo.billNo')" prop="reverseBillNo">
                    <h-input v-model="formItem.reverseBillNo"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minDueDt')" prop="minDueDt">
                    <h-date-picker type="date" v-model="formItem.minDueDt" placeholder="" @on-change="handleMinDateChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxDueDt')" prop="maxDueDt">
                    <h-date-picker type="date" v-model="formItem.maxDueDt" placeholder="" @on-change="handleMaxDateChange" :editable=false></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.billResource')" prop="prodNoList"  cols="3" v-if="formItem.subType==='ST01'">
                    <h-select v-model="formItem.prodNoList" placeholder="" multiple showTitle>
                      <h-option v-for="item in PrsttnHldrBillSourceList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.billResource')" prop="prodNoList"  cols="3" v-if="formItem.subType==='ST02'">
                    <h-select v-model="formItem.prodNoList" placeholder="" multiple showTitle>
                      <h-option v-for="item in PrsttnValetBillSourceList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.acptName')" prop="acptNameLike" >
                    <h-input v-model="formItem.acptNameLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.drweBankNo')" prop="drweBankNoLike" >
                    <h-input v-model="formItem.drweBankNoLike"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.minBillMoney')" prop="minBillMoney">
                    <h-typefield type="money" v-model="formItem.minBillMoney" placeholder="" @on-blur="formatMinBillMoney('blur')"
                                 @on-focus="formatMinBillMoney('focus')" :bigTips="false"></h-typefield>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.maxBillMoney')" prop="maxBillMoney">
                    <h-typefield type="money" v-model="formItem.maxBillMoney" placeholder="" @on-blur="formatMaxBillMoney('blur')"
                                 @on-focus="formatMaxBillMoney('focus')" :bigTips="false"></h-typefield>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custName')" prop="oppName" v-if="formItem.subType === 'ST02'">
                    <h-input v-model="formItem.oppName" placeholder="" icon="android-search" @on-click="queryCustMessage()" readonly
                             clearable @on-clear="clearVal('oppName')"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.custAcctNo')" prop="oppAcctNo" v-if="formItem.subType === 'ST02'">
                    <h-input v-model="formItem.oppAcctNo" placeholder="" icon="android-search"
                             @on-click="queryCustAcctNo()" readonly clearable @on-clear="clearVal('oppAcctNo')"></h-input>
                  </h-form-item>
                  <h-form-item prop="isRefuse" :label="$t('m.i.ce.isRefuse')" v-if="formItem.subType === 'ST01'">
                    <h-select v-model="formItem.isRefuse" placeholder="" showTitle>
                      <h-option v-for="item in IsRefuseList" :value="item.key" :key="item.value">{{ item.value }}
                      </h-option>
                    </h-select>
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
                url="/pb/prsttn/paper/apply/pPrsttnAddApplyMain/func_queryApplyHldrInfoForPaper"
                :row-select="true"
                :auto-load="false"
                :paramId="paramIdVal"
                :has-select="hasSelect"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleForm()">创建信封</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
        </div>
        <prsttn-batch-info-detail :is-show="collectionAddApplyBillMain" :batchId="this.batchId"
                                  :isQuery="isQuery" funcNo="PICE040115" @envelopeNoShow="envelopeNoShow"></prsttn-batch-info-detail>
        <!-- 数据展示表格 -->
        <div v-if="collectionAddApplyBillMain" key="2">
          <h-datagrid
            :columns="billColumns"
            highlight-row
            :auto-load="false"
            :bindForm="billFormItem"
            url="/pb/prsttn/paper/apply/pPrsttnAddApplyMain/func_pageQueryPrsttnBill"
            :row-select="true"
            :has-select="billHasSelect"
            ref="billDatagrid">
            <div slot="toolbar">
              <h-button type="primary" @click="prsttnPrint">{{$t("m.i.ce.remitPrint")}}</h-button>
              <h-button type="primary" @click="envelopePrint">{{$t("m.i.ce.envelopePrint")}}</h-button>
              <h-button type="primary" @click="prsttnBillPrint">{{$t("m.i.ce.remitBillPrint")}}</h-button>
              <h-button type="primary" @click="submitBill()">{{$t("m.i.common.submit")}}</h-button>
              <h-button type="ghost" @click="returnBack()">{{$t("m.i.common.goBack")}}</h-button>
            </div>
          </h-datagrid>
        </div>

      </h-col>
    </h-row>
    <!-- 查询客户信息弹窗 -->
    <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose" @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
    <!-- 查询客户账号信息弹窗 -->
    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.oppCustNo" @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>

    <!--票面信息-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

    <!-- 点击提示付款申请界面 -->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>创建信封</span>
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
          <h-form-item label="快递公司名称" prop="reserve1" required>
            <h-select v-model="addOrEditForm.reserve1"  placeholder="" showTitle>
              <h-option  value="DC01">EMS</h-option>
              <h-option  value="DC02">顺丰</h-option>
              <h-option  value="DC03">其他</h-option>
            </h-select>
          </h-form-item>
          <h-form-item label="备注" prop="reserve2" required v-show="showRemark">
            <h-input v-model="addOrEditForm.reserve2" placeholder="" :maxlength="80"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submit()">{{$t("m.i.common.submit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, billMoneyDisplay, cmycurd, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "pPrsttnAddApplyMain",
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
          ownedBrchNos:"",
          ownedBrchNames:"",
          authPath:this.$route.path ,
          subType:"ST01",
          reverseBillNo:"",
          minDueDt:"",
          maxDueDt:"",
          prodNoList:[],
          acptNameLike:"",
          drweBankNoLike:"",
          minBillMoney:"",
          maxBillMoney:"",
          oppName:"",
          oppCustNo:"",
          oppAcctNo:"",
          transNo: "",
          isRefuse: "",
          descProps:["due_dt","id"],
        },
        columns : [],
        IsRefuseList:[{
          key:"1",value:"是"
        }],
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
             title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
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
            title: this.$t("m.i.ce.currentStatusName"),
            sortable: true,
            key: "billStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "BillStatusCode", params.row.billStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
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
             title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
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
          {
            title: this.$t("m.i.ce.isRefuse"),
            key: "currentStatus",
            sortable: false,
            hiddenCol: false,
            render : (h, params) => {
              let flag = "";
              if (params.row.cirStatus && params.row.cirStatus.startsWith("TF0401")) {
                flag = "是";
              } else {
                flag = "否";
              }
              return h("span", flag);
            }
          },
        ],
        addOrEditForm : {
          ids:"",
          billClass:"ME01",
          billType:"",
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
          postFee: "",
          reserve1:"",
          reserve2:""
        },
        billFormItem : {
          billClass:"ME01",
          curFuncNo:"PICE040115",
          batchId:"",
          ownedBrchNos:"",
          authPath:this.$route.path
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
        YonList : [],
        SubTypeCodeList : [],
        dictMap : new Map(),
        currentSelectList : [],
        currentSelectRowInx : [],
        currentBillSelectList : [],
        currentBillSelectRowInx : [],
        currentPrintSelectList : [],
        submitFlag : false,
        ifShowMore : false,
        noCommitDisabled : true,
        hasCommitDisabled : false,
        collectionAddApplyBatchMain : true,
        collectionAddApplyBillMain : false,
        addOrEditWin : false,
        showCustAcctNoWin : false,
        showCustMessageWin : false,
        isQuery : '',
        batchId : '',
        ids : '',
        subType : '',
        envelopeNo : '',
        PrsttnHldrBillSourceList : [],
        PrsttnValetBillSourceList : [],
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        hasSelect : false,
        billHasSelect : false,
        paramIdVal : 'billId',
        postCodeRule:[{test: validPostCode, trigger:'blur'}],
        btnAuth: {},
        showRemark:false,
      }
    },
    mounted() {
      this.getDictListByGroups("Yon,SubTypeCode,DraftTypeCode,PrsttnHldrBillSource,PrsttnValetBillSource,BillStatusCode").then(res => {
        this.PrsttnHldrBillSourceList = res.get("PrsttnHldrBillSource");
        this.PrsttnValetBillSourceList = res.get("PrsttnValetBillSource");
        this.SubTypeCodeList = res.get("SubTypeCode");
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      this.noCommitButton();
      this.getParams();
      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });
    },
    methods: {
      clearVal(type){
        if(type === 'oppName'){
          this.formItem.oppAcctNo = "";
          this.formItem.oppName = "";
          this.formItem.oppCustNo = "";
        }else{
          this.formItem.oppAcctNo = "";
        }
      },
      formatMinBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.formItem.minBillMoney)) && isFinite(this.formItem.minBillMoney)) {
            this.formItem.minBillMoney = this.formItem.minBillMoney == null ? "0.00" : formatNumber(this.formItem.minBillMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.formItem.minBillMoney = this.formItem.minBillMoney.toString().replace(/,/g, "");
        }
      },
      formatMaxBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.formItem.maxBillMoney)) && isFinite(this.formItem.maxBillMoney)) {
            this.formItem.maxBillMoney = this.formItem.maxBillMoney == null ? "0.00" : formatNumber(this.formItem.maxBillMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.formItem.maxBillMoney = this.formItem.maxBillMoney.toString().replace(/,/g, "");
        }
      },
      handleMinDateChange(value){
        this.formItem.minDueDt = value.replace(/-/g, "");
      },
      handleMaxDateChange(value){
        this.formItem.maxDueDt = value.replace(/-/g, "");
      },
      //查询
      handleSearch() {
        this.hasSelect = false;
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.reverseBillNo = '';
        this.formItem.minDueDt = '';
        this.formItem.maxDueDt = '';
        this.formItem.prodNoList = [];
        this.formItem.acptNameLike = '';
        this.formItem.drweBankNoLike = '';
        this.formItem.minBillMoney = '';
        this.formItem.maxBillMoney = '';
        this.formItem.oppName = '';
        this.formItem.oppAcctNo = '';
        this.formItem.oppCustNo = '';
        this.formItem.transNo = '';
        this.formItem.isRefuse = '';
        this.formItem.ownedBrchNos = "";
        this.formItem.ownedBrchNames = "";
      },
      // 行选中
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      //票据管理界面查询
      billManagerHandleSearch(){
        this.$nextTick(() => {
          this.billHasSelect = false;
          this.$refs.billDatagrid.selects = [];
          this.$refs.billDatagrid.selectIds = [];
          this.currentBillSelectList = [];
          this.$refs.billDatagrid.dataChange(1);
        })
      },
      noCommitButton() {
        this.formItem.subType = "ST01";
        this.noCommitDisabled = true;
        this.hasCommitDisabled = false;
        //清空查询条件
        this.formItem.oppAcctNo = "";
        this.formItem.oppName = "";
        this.formItem.oppCustNo = "";
        this.$nextTick(() => {
          this.handleSearch();
        });
        this.controlOwnedBrchShow(this.holdColumns,!this.licenseFlag);
        this.columns = this.holdColumns;
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
          this.$refs.datagrid.createShowCol(this.columns);
        });
      },
      controlOwnedBrchShow(tempColumns,isHidden){
        tempColumns.forEach((value, index) => {
          if (value.key === 'ownedBrchName') {
            value.hiddenCol = isHidden;
          }
        });
      },
      hasCommitButton() {
        this.formItem.subType = "ST02";
        this.hasCommitDisabled = true;
        this.noCommitDisabled = false;
        // this.formItem.funcNo = "PICE020219";
        this.$nextTick(() => {
          this.handleSearch();
        });
        this.controlOwnedBrchShow(this.valetColumns,!this.licenseFlag);
        this.columns = this.valetColumns;
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
          this.$refs.datagrid.createShowCol(this.columns);
        });
      },
      //查询客户信息
      queryCustMessage() {
        this.showCustMessageWin = true;
      },
      //根据客户信息查询框所选数据进行赋值
      custCorpSelectSubmit(info) {
        this.formItem.oppAcctNo = "";
        this.formItem.oppName = info.custName;
        this.formItem.oppCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.oppAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //客户信息查询框关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号
      queryCustAcctNo() {
        if (this.formItem.oppCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //根据客户账号查询框所选数据进行赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.oppAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //客户账号查询框关闭
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //票据管理界面行选中
      billHandleSelectClick(arr,selectInx){
        this.currentBillSelectList = arr;
        this.currentBillSelectRowInx = selectInx;
      },
      //创建信封
      handleForm(){
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let list = this.$refs.datagrid.selects;
        if (this.licenseFlag) {
          // 集中授权模式，所选数据机构号需一致
          let ownedBrchNo=list[0].transBrchNo;
          let flag=list.some( item => item.transBrchNo !== ownedBrchNo)
          if (flag) {
            this.$msgTip.info(this, { info: "请选择相同的机构下的票据" });
            return;
          }
        }
        this.ownedBrchNo=list[0].transBrchNo;
        this.ids = this.$refs.datagrid.selectIds.join(",");
        let subType = this.formItem.subType;
        // list里面包对象传不过去
        list.forEach(row => {
          if (!row.billInfoAssDto){
            row.billInfoAssDto = {};
          }
        });
        post( {subType:subType,commonDtoList:list,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo},
          "/pb/prsttn/paper/apply/pPrsttnAddApplyMain/func_buildEnvelopInit").then(res => {
          this.submitFlag = false;
          if(res){
            let retCode = res.data.retCode;
            if(retCode === "000000"){
              this.addOrEditWin = true;
              this.$nextTick(() => {
                this.$refs.addOrEditForm.resetFields();
                this.addOrEditForm.ids = this.$refs.datagrid.selectIds.join(",");
                this.addOrEditForm.prsnttnCommonDtoList = this.$refs.datagrid.selects;
                this.addOrEditForm.drweBankName = res.data.retData.drweBankName;
                this.addOrEditForm.drweBankNo = res.data.retData.drweBankNo;
                this.addOrEditForm.drweAddr = res.data.retData.drweAddr;
                this.addOrEditForm.drwePhone = res.data.retData.drwePhone;
                this.addOrEditForm.drwePostCode = res.data.retData.drwePostCode;
                this.addOrEditForm.emsNo = res.data.retData.emsNo;
                this.addOrEditForm.prsttnType = res.data.retData.prsttnType;
                this.addOrEditForm.hldrName = res.data.retData.hldrName;
                this.addOrEditForm.hldrAcctNo = res.data.retData.hldrAcctNo;
                this.addOrEditForm.billType = res.data.retData.billType;
              });
            }else{
              this.$msgTip.error(this, { info: res.data.retMsg });
              // this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo)
              // this.currentSelectList = [];
              // this.$refs.datagrid.selects = [];
              // this.$refs.datagrid.selectIds = [];
            }
          }else{
            this.$hMessage.error(this.$t('m.i.common.netError'))
          }
        });
      },
      //创建信封提交按钮
      submit(){
        if (this.addOrEditForm.prsttnType === 'ST02' && (this.btnAuth.postFee === undefined ? false : this.btnAuth.postFee.isShow)) {
          if (Number(this.addOrEditForm.postFee) <= 0) {
            this.$msgTip.info(this, { info: this.$t("邮电费必须大于零") });
            return;
          }
        }
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            this.subType = this.addOrEditForm.prsttnType;
            this.submitFlag = true;
            let obj=Object.assign({licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo},this.addOrEditForm);
            post(obj,"/pb/prsttn/paper/apply/pPrsttnAddApplyMain/func_buildEnvelop").then(res => {
              this.submitFlag = false;
              if(res){
                let retCode = res.data.retCode;
                if(retCode === "000000"){
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.collectionAddApplyBatchMain = false;
                  this.batchId = res.data.retData;
                  this.isQuery = true;
                  this.billFormItem.batchId = res.data.retData;
                  this.billFormItem.ownedBrchNos=this.ownedBrchNo;
                  this.collectionAddApplyBillMain = true;
                  this.billManagerHandleSearch();
                  this.$nextTick(() => {
                    this.$refs.billDatagrid.selfAdaption();
                    this.controlOwnedBrchShow(this.billColumns,!this.licenseFlag);
                    this.$refs.billDatagrid.createShowCol(this.billColumns);
                  });
                }else{
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                }
              }else{
                this.$hMessage.error(this.$t('m.i.common.netError'))
              }
            });
          }
        });
      },
      //返回信封编号
      envelopeNoShow(info){
        this.currentPrintSelectList[0] = info;
        this.envelopeNo = info.envelopeNo;
      },
      //提交
      submitBill(){
        if (this.$refs.billDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let ids = this.$refs.billDatagrid.selectIds;
        let param = {};
        param = { ids: ids.join(",") ,batchId:this.batchId , subType:this.subType,licenseFlag:this.licenseFlag,ownedBrchNo:this.ownedBrchNo};
        post( param , "/pb/prsttn/paper/apply/pPrsttnAddApplyMain/func_sumbitEnvelop").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this,{info:msg});
              if(this.$refs.billDatagrid.total === this.$refs.billDatagrid.selects.length){
                this.returnBack();
              }else {
                this.billManagerHandleSearch();
                this.currentBillSelectList = [];
              }
            } else {
              this.$msgTip.error(this,{info:res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
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
        this.currentBillSelectList = this.$refs.billDatagrid.selects;
        this.assemblePrsttnParams();
      },
      assemblePrsttnParams() {
        let vocherData = this.deepClone(this.currentBillSelectList);
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
          vocherData[i].acctBrchName = this.currentPrintSelectList[0].acctBrchName;
          vocherData[i].drweAddr = this.currentPrintSelectList[0].drweAddr;
          vocherData[i].drweBankName = this.currentPrintSelectList[0].drweBankName;
          vocherData[i].drweBankNo = this.currentPrintSelectList[0].drweBankNo;
          vocherData[i].hldrAcctNo = this.currentPrintSelectList[0].hldrAcctNo;
          vocherData[i].hldrName = this.currentPrintSelectList[0].hldrName;
          vocherData[i].flowNo = vocherData[i].acctFlowId;
          vocherData[i].printObj = JSON.stringify(vocherData[i]);
        }
        this.$print.vochPrint(this, {
          exitDataFlag: true, params: { voucherType: "PE031801", vocherData: vocherData ,licenseFlag:this.licenseFlag,ownedBrchNo:this.currentBillSelectList[0].transBrchNo},
          callback: () => {
            this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.$refs.gridPage.currentPage);
            // this.currentPrintSelectList = [];
          },
          errorCallback: () => {
            this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.$refs.gridPage.currentPage);
            // this.currentPrintSelectList = [];
          }
        });
      },
      //信封打印
      envelopePrint() {
        let vocherData = this.deepClone(this.currentPrintSelectList);
        post({ code:vocherData[0].drweBankNo}, "/pb/prsttn/paper/apply/pPrsttnAddApplyMain/func_getPrsttnBankInfoByBankNo").then(res => {
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
                  this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.$refs.gridPage.currentPage);
                },
                errorCallback: () => {
                  this.$refs.billDatagrid.dataChange(this.$refs.billDatagrid.$refs.gridPage.currentPage);
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
          licenseFlag:this.licenseFlag,
          ownedBrchNo:this.ownedBrchNo
        };
        post(params, "/pb/prsttn/paper/apply/pPrsttnAddApplyMain/func_queryPrsttnBill").then(res => {
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
          <div style="text-align:center;font-size:18px;font-weight:bold;">票据出库清单 编号：<label>${this.envelopeNo}</label></div>
        </div>`
        let footerHtml = `<div style="font-size:14px;font-weight:bold;display:-webkit-box;display:flex;justify-content:flex-end;">
          <label style="padding-right:20%;white-space:nowrap">经办:</label>
          <label style="padding-right:20%;white-space:nowrap">复核:</label>
          <label style="padding-right:20%;white-space:nowrap">日期:</label>
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
        this.$print.printListHtm(this, headHtml, bodyHtml, { bodyTop: "12%", bodyLeft:"5%", bodyWidth:"90%", bodyHeight:"74%", headHeight:"11%" }, footerHtml);
      },
      //返回
      returnBack(){
        this.currentPrintSelectList = [];
        this.currentSelectList = [];
        this.currentBillSelectList = [];
        this.isQuery = false;
        this.resetSearch();
        this.collectionAddApplyBillMain = false;
        this.collectionAddApplyBatchMain = true;
        this.$nextTick(() => {
          this.$refs.datagrid.selfAdaption();
          this.$refs.datagrid.dataChange(1);
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
      getParams(){
        if (this.$route.path === "/pb/prsttn/paper/apply/pPrsttnAddApplyMain") {
          if (this.$route.query.dueDt) {
            let dueDt = this.$moment(this.$route.query.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.formItem.minDueDt = dueDt;
            this.formItem.maxDueDt = dueDt;
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
          if(this.$route.query.maxDueDt){
            this.formItem.maxDueDt = this.$moment(this.$route.query.maxDueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
          if(this.$route.query.transNo){
            this.formItem.transNo = this.$route.query.transNo;
            this.formItem.subType = this.$route.query.subType;
            this.formItem.isRefuse = "1";
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
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
    watch: {
      "$route": "getParams",
      'addOrEditForm.reserve1'(val){
        if(val === "DC01"){
          this.showRemark=false;
          this.addOrEditForm.reserve2="EMS";
        }else if(val === "DC02"){
          this.showRemark=false;
          this.addOrEditForm.reserve2="顺丰"
        }else if(val === "DC03"){
          this.showRemark=true;
          this.addOrEditForm.reserve2="";
        }else {
          this.showRemark=false;
          this.addOrEditForm.reserve2="";
        }
      }
    },
    created() {
      this.getPostFeeAuth();
    }
  };
</script>

<style scoped>

</style>
