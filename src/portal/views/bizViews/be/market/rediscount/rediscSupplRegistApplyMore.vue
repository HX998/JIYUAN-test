<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box" >
            <!-- 查询表单 -->
            <h-panel class="clearfix"  :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <!--客户名称-->
                <h-form-item prop="custName" :label="$t('m.i.common.custName')">
                  <h-input v-model="formItem.custName" placeholder=""></h-input>
                </h-form-item>

                <!--票号-->
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>

                <!--子票区间-->
                <bill-range :form-item="formItem" :range-props="['minRegisterBillRangeStart','maxRegisterBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" class="h-form-long-label">
                  <h-row>
                    <h-col span="11">
                      <h-typefield v-model="formItem.minRegisterBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                    <h-col span="2" style="text-align: center">至</h-col>
                    <h-col span="11">
                      <h-typefield v-model="formItem.maxRegisterBillMoney" integerNum="10" placeholder="" type="money"
                                   bigTips></h-typefield>
                    </h-col>
                  </h-row>
                </h-form-item>

                <h-form-item label="业务日期">
                  <h-date-picker :value="dueDtBusi" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                </h-form-item>

                <h-form-item :label="$t('m.i.be.brchType')" prop="brchType" >
                  <h-select v-model="formItem.brchType" :clearable="false" placeholder="" @on-change="changeBrchType"
                            :readonly="isBrchTypeReadOnly">
                    <h-option value="1">贴现行</h-option>
                    <h-option value="2">出票人开户行</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item label="登记类别" prop="msgType" >
                  <h-select v-model="formItem.msgType" :clearable="false" placeholder=""   @on-change="handleMsgTypeChange"
                            :readonly="isMsgTypeReadOnly">
                    <h-option value="IFC01">贴现申请人</h-option>
                    <h-option value="IFC02">出票人</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="supplColumns"
                      url="/be/market/rediscount/more/rediscSupplRegistApply/func_queryRediscountSupplInfo"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="pickBill()">{{$t('m.i.ce.pickBill')}}</h-button>
              <h-button type="primary" @click="singleAdd('modify')">批量补充登记录入</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 新增再贴现补充登记信息界面 -->
    <h-msg-box v-model="addOrEditWin" width="600" @on-close="addOrEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>批量补充登记录入</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="130" ref="addOrEditForm" cols="1" class="h-form-search">

          <!--补充登记日期-->
          <h-form-item prop="updateTime" label="补充登记日期" required>
            <h-input v-model="updateTime" placeholder="" readonly></h-input>
          </h-form-item>

          <!--登记机构名称-->
          <h-form-item prop="applBrchName" label="登记机构名称" required>
            <h-input v-model="addOrEditForm.applBrchName" placeholder="" readonly></h-input>
          </h-form-item>
          <!--            this.addForm.ownedBrchNo=this.$store.getters.userInfo.brchNo;
            this.addForm.ownedBrchName=this.$store.getters.userInfo.brchName;-->

          <!--登记标识-->
          <h-form-item label="登记标识" prop="rgstFlag" required>
            <h-select v-model="addOrEditForm.rgstFlag" :clearable="false" placeholder="">
              <h-option value="0">否</h-option>
              <h-option value="1">是</h-option>
            </h-select>
          </h-form-item>

          <!--登记类别（同查询条件一致）-->
          <h-form-item label="登记类别" prop="msgType" required>
            <h-select v-model="addOrEditForm.msgType" :clearable="false" placeholder="" readonly>
              <h-option v-for="item in msgTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
            </h-select>
          </h-form-item>

          <!--贴现人（出票人）是否民营企业-->
          <h-form-item :label="addOrEditForm.msgType === 'IFC01' ? '贴现人是否民营企业' : '出票人是否民营企业' " prop="isPrivateCorp"
                       required>
            <h-select v-model="addOrEditForm.isPrivateCorp" :maxlength=60 placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!-- 贴现人（出票人）是否绿色企业-->
          <h-form-item :label="addOrEditForm.msgType === 'IFC01' ? '贴现人是否绿色企业' : '出票人是否绿色企业'" prop="isGreenCorp"
                       required>
            <h-select v-model="addOrEditForm.isGreenCorp" :maxlength=60 placeholder=""
            >
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!--是否涉农企业-->
          <h-form-item :label="addOrEditForm.msgType === 'IFC01' ? '贴现人是否涉农企业' : '出票人是否涉农企业'" prop="isArc" required>
            <h-select v-model="addOrEditForm.isArc" :maxlength=60 placeholder=""
            >
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!-- 贴现人（出票人）企业规模-->
          <h-form-item prop="corpScale" :label="addOrEditForm.msgType === 'IFC01' ? '贴现人企业规模' : '出票人企业规模'" required>
            <h-select v-model="addOrEditForm.corpScale" placeholder="">
              <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <!-- 贴现人（出票人）企业行业分类-->
          <h-form-item prop="industryCategory" :label="addOrEditForm.msgType === 'IFC01' ? '贴现人企业行业分类' : '出票人企业行业分类'"
                       required>
            <h-select v-model="addOrEditForm.industryCategory" placeholder="">
              <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}
              </h-option>
            </h-select>
          </h-form-item>


        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="addOrEditWinSubmit()">提交</h-button>
        </div>
      </div>
    </h-msg-box>

    <!--挑票-->
    <h-msg-box v-model="tempPickBillWin" :mask-closable="false" @on-close="pickBillClose" :maximize="true" width="1000"
               :footerHide="false" class="h-form-table-layer">
      <p slot="header">
        <span>挑票页面</span>
      </p>
      <div>
<!--        <h-form :model="pickBillForm" :label-width="90" ref="pickBillForm" cols="4" class="h-form-search">


          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')">
            <h-input v-model="pickBillForm.billNo"></h-input>
          </h-form-item>

&lt;!&ndash;          <h-form-item prop="transFromName" :label="$t('m.i.common.custName')">&ndash;&gt;
&lt;!&ndash;            <h-input v-model="pickBillForm.transFromName"></h-input>&ndash;&gt;
&lt;!&ndash;          </h-form-item>&ndash;&gt;



          <h-form-item class="h-form-operate">
&lt;!&ndash;            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i&ndash;&gt;
&lt;!&ndash;              class="icon iconfont"&ndash;&gt;
&lt;!&ndash;              :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>&ndash;&gt;
            <h-button type="primary" @click="handlePickBillSearch()">{{$t('m.i.common.search')}}</h-button>
            <h-button type="ghost" @click="resetPickBillSearch()">{{$t('m.i.common.reset')}}</h-button>
          </h-form-item>
        </h-form>-->
        <h-datagrid :columns="pickColumns"
                    :url="pickUrl"
                    :auto-load="false"
                    :param-id="paramId"
                    rowSelect
                    :bindForm="pickBillForm"
                    :hasSelect="hasSelect"
                    ref="pickBillDatagrid" class="pl-5 pr-5">
        </h-datagrid>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="pickBillClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="pickBillStock()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post, getDictListByGroups, getDictValueFromMap, formatNumber, getConnectMode} from "@/api/bizApi/commonUtil";

  export default {
    name: "rediscSupplRegistApplyEdit",
    components: {},

    data() {
      return {
        paramId: "id",
        curBatchId: "",
        billType: "",
        isLock: "",
        busiType: "",
        dueSettleDt: "",
        isTemStorage: "",
        billClass: "",
        pickBillWin: false,
        rootUrl: "",
        pickUrl: "/be/market/rediscount/more/quoteManager/func_pagingQueryHldrBillInfoMore",
        pickColumns: [
          {
            type: 'selection',
            width: 50,
            hiddenCol: false,
            align: 'center'
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center'
          },
          {
            title: this.$t('m.i.common.batchNo'),
            sortable: true,
            key: 'batchNo',
            hiddenCol: true
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billNo ? '-' : params.row.billNo;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            sortable: true,
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'DraftTypeCode', params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: 'billClass',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'CDMedia', params.row.billClass);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billPackageMoney'),
            key: 'billMoney',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', formatNumber(params.row.billMoney, 2, ','))
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.buyDt'),
            key: 'transDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h('span', params.row.transDt ? this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.be.leftHandSeatBuyRate'),
            key: 'ratePct',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.be.initBuyRate'),
            key: 'orgnlBuyRatePct',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.custName'),
            key: 'oppName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.acptBankName'),
            key: 'acptBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.cfmAppBankName'),
            key: 'cfmAppBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptGuarntrBankName'),
            key: 'acptGuarntrBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.discBankName'),
            key: 'discBankName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.billInfo.discGuarntrBankName'),
            key: 'discGuarntrBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.guarntrTrustBankName'),
            key: 'trustBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.creditMainBrchCode'),
            key: "creditMainBrchCode",
            sortable: true,
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankName'),
            key: "creditMainBankName",
            hiddenCol: false,
            sortable: true,

          },
          {
            title: this.$t('m.i.billInfo.creditMainBankType'),
            key: "creditMainBankType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'CreditMajor', params.row.creditMainBankType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.be.assetIndustry'),
            key: 'assetIndustry',
            hiddenCol: window.sessionStorage.getItem("isOpenI9") == "1" ? false : true,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, 'AssetIndustry', params.row.assetIndustry);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
        ],
        pickBillForm: {
          minRegisterBillRangeStart: '',
          maxRegisterBillRangeEnd: '',
          discCustName: '',
          drwrName: '',
          drwrNameLike: '',
          busiType: 'BT01',
          billType: '',
          billClass: '',
          batchNo: '',
          minBillMoney: '',
          maxBillMoney: '',
          acptName: '',
          rejectAcptName: '',
          orgnlProdNos: 1,
          dueDate: '',
          minDueDt: '',
          maxDueDt: '',
          buyDate: '',
          minBuyDt: '',
          maxBuyDt: '',
          minBuyRatePct: '',
          maxBuyRatePct: '',
          minOrgnlBuyRatePct: '',
          maxOrgnlBuyRatePct: '',
          billNo: '',
          transFromName: '',
          brchType: '',
          msgType: '',
          batchId: null,
          isLock: '',
          acptTopBankLevels: [],
          discTopBankLevels: [],
          acptBankTypes: [],
          discBankTypes: [],
          discBankName: '',
          discBrchCode: '',
          discBankNo: '',
          billTerm: '',
          creditBrchCode: '',
          creditBranchName: '',
          creditBranchClasses: [],
          isTotalColl: '',
          custBrchCode: this.custBrchCode,
          assetIndustry: '',
          billOrigin: ''
        },
        tempPickBillWin: false,
        hasSelect: false,
        msgTypeList: [{key: "IFC01", value: "贴现申请人"}, {key: "IFC02", value: "出票人"}],
        mode: '1',
        importSelect: true,
        isMsgTypeReadOnly: false,
        isReadOnly: false,
        corpScaleReadOnly: false,
        industryCategoryReadOnly: false,
        isArcReadOnly: false,
        isGreenCorpReadOnly: false,
        isBrchTypeReadOnly: false,
        dueDt: [],
        dueDtBusi: [],
        cpesBranchType: '',
        //票面
        showBillInfoWin: false,
        billId: '',
        billNo: '',
        billRangeStart: '',
        billRangeEnd: '',
        //字典值
        dictMap: new Map(),
        cdMediaList: [],
        billTypeList: [],
        isList: [],
        industryCategoryList: [],
        corpScaleList: [],
        billOriginList: [],
        ifShowMore: false,
        selectDataFirst: false,
        uploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscSupplRegistApply/func_importRediscountSupplInfo",
        formItem: {
          msgType: '',
          brchType: '',
          custId: '',
          custName: '',
          billNo: '',
          minRegisterBillMoney: "",
          maxRegisterBillMoney: "",
          minDueDate: "",
          maxDueDate: "",
          minDueDateBusi: "",
          maxDueDateBusi: "",
          billOrigin: "",
          minRegisterBillRangeStart: "",
          maxRegisterBillRangeEnd: ""
        },
        minDueDate: "",
        maxDueDate: "",
        minDueDateBusi: "",
        maxDueDateBusi: "",
        supplColumns: [
          {
            type: 'selection',
            key: 'multiSelect',
            width: 60,
            hiddenCol: false,
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.billRange ? '-' : params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
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
              let list = getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },

          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let registerBillMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: registerBillMoney
                }
              }, registerBillMoney);
            }
          },
          {
            title: '贴现日期',
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          // {
          //   title: this.$t('m.i.billInfo.remitDt'),
          //   key: "remitDt",
          //   hiddenCol: false,
          //   sortable: true,
          //   render: (h, params) => {
          //     return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
          //   }
          // },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
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
          /*贴现日期、汇票到期日、贴现人名称、贴现人账号、贴现人证件号、出票人账号、出票人名称、出票人证件号*/
          {
            title: '贴现人名称',
            key: "discCustName",
            hiddenCol: false
          },
          {
            title: '贴现人账号',
            key: "discCustAcct",
            hiddenCol: false
          },
          {
            title: '贴现人证件号',
            key: "discCustNo",
            hiddenCol: false
          },
          {
            title: '出票人账号',
            key: "drwrAcctNo",
            hiddenCol: false
          },
          {
            title: '出票人名称',
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: '出票人证件号',
            key: "drwrNo",
            hiddenCol: false
          }
        ],
        addOrEditType: '',
        addOrEditWin: false,
        ifNotFirst: false,
        updateTime: "",

        addOrEditForm: {
          ids: [],
          applBrchName: "",
          updateTime: "",
          rgstFlag: "",
          id: "",
          brchType: "",
          msgType: "",
          billNo: "",
          billRangeStart: "",
          billRangeEnd: "",
          stdAmt: "",
          billOrigin: "",
          billType: "",
          billClass: "",
          billMoney: "",
          reApplyBrchName: "",
          reApplyDt: "",
          dueDt: "",
          remitDt: "",
          corpScale: "",
          industryCategory: "",
          isArc: "",
          isGreenCorp: "",
          isPrivateCorp: "",
          registerBillRangeStart: "",
          registerBillRangeEnd: "",
          registerBillMoney: "",
          originBillRangeStart: "",
          originBillRangeEnd: "",
          originBillMoney: "",
          isAcpt: ""
        },
        billNoRule: [{test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字"}],


      }
    },
    created() {
      // 获取是对接模式还是直连模式.
      getConnectMode().then(res => {
        this.mode = res;
      })
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,CDMedia,DraftTypeCode,Yon,RediscSupplStatus,CorpScale,Industry,AcptRgstStatus,BillOrigin,AssetIndustry,CreditMajor").then(res => {
        this.cdMediaList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.corpScaleList = res.get("CorpScale");
        this.industryCategoryList = res.get("Industry");
        this.billOriginList = res.get("BillOrigin");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
        // this.formItem.msgType = 'IFC01';
      });
    },
    watch: {
      selectDataFirst(val) {
        if (val) {
          this.importSelect = false;
        }
      }

    },
    methods: {
      handleMsgTypeChange(msg) {
        console.info(msg)
        this.addOrEditForm.msgType = this.formItem.msgType;
        // this.$refs.datagrid.selects = [];
        // this.$refs.datagrid.dataChange(1);
      },
      handleDueDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minDueDateBusi = arr[0].replace(/-/g, "");
          this.formItem.maxDueDateBusi = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDateBusi = "";
          this.formItem.maxDueDateBusi = "";
          this.dueDt = [];
        }
      },
      //表单查询
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.dueDt = [];
        this.dueDtBusi = [];
        this.minDueDate = "";
        this.maxDueDate = "";
        this.formItem.minDueDate = "";
        this.formItem.maxDueDate = "";
        this.formItem.minDueDateBusi = "";
        this.formItem.maxDueDateBusi = "";
        this.formItem.minRegisterBillMoney = "";
        this.formItem.maxRegisterBillMoney = "";
        this.formItem.custName = "";
        this.formItem.msgType = "";
        this.formItem.custId = "";
        /*  msgType: '',
                  custName: '',*/
        this.isMsgTypeReadOnly=false;
        this.$refs.formItem.resetFields();
      },
      //影像维护弹窗
      openImgWin(str) {
        this.imageParams.id = str;
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.billManagerHandleSearch();
      },
      //票面
      showBillInfo(billId, billNo, billRangeStart, billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart = billRangeStart;
        this.billRangeEnd = billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
      //删除
      busiDelete() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({code: ids}, "/be/market/rediscount/rediscSupplRegistApply/func_deleteRediscountSupplInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //恢复
      returnTo() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定恢复吗？",
          onOk: () => {
            this.handleReturn();
          }
        });
      },
      handleReturn() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({code: ids}, "/be/market/rediscount/rediscSupplRegistApply/func_backRediscountSupplInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscSupplRegistApply/func_downloadModel";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //批量导入
      exportByExcel() {
        this.importWin = true;
        this.$nextTick(() => {
          this.$refs.upload.clearFiles();
          this.importSelect = true;
          this.selectDataFirst = false;
        });
      },
      selectData(status) {
        this.selectDataFirst = status;
      },
      handleProgress() {
        this.$hMessage.loading({
          content: '文件正在上传中...'
        })
      },
      uploadSuccess(file) {
        this.importWin = false;
        let retCode = file.retCode;
        if (retCode === "000000") {
          this.$msgTip.success(this, {info: this.$t('m.i.common.importSuccess')});
        } else {
          this.$msgTip.error(this, {info: this.$t('m.i.common.importFailed') + ':' + file.retMsg});
        }
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);

      },
      handleFormatError(file) {
        this.$msgTip.error(this, {info: "文件 " + file.name + " 格式不正确，请上传xls或xlsx格式的文件"});
      },
      uploadError(file) {
        // this.$hMessage.error(file.name+'上传失败')
        this.$msgTip.error(this, {info: file.name + '上传失败'})
      },
      clickLink(file) {
        this.$hNotice.info({
          title: '点击上传文件事件',
          desc: '点击已上传的文件链接时的事件'
        })
      },
      handleRemove(file) {
        this.$msgTip.success(this)
        this.importSelect = true;
        this.selectDataFirst = false;
      },
      //提交复核
      submitRecheck() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定提交吗？",
          onOk: () => {
            this.handleRecheck();
          }
        });
      },
      handleRecheck() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({code: ids}, "/be/market/rediscount/rediscSupplRegistApply/func_submitRediscountSupplInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //关闭
      addOrEditWinClose() {
        this.ifNotFirst = false;
        this.$refs.addOrEditForm.resetFields();
        this.addFormReset();
        this.addOrEditWin = false;
        this.isMsgTypeReadOnly = false;
        this.isReadOnly = false;
        // 对接使用
        this.corpScaleReadOnly = false;
        this.industryCategoryReadOnly = false;
        this.isArcReadOnly = false;
        this.isGreenCorpReadOnly = false;
        // 对接使用截止
        this.isBrchTypeReadOnly = false;
      },
      //单笔新增、修改
      singleAdd(type) {
        if (this.formItem.msgType === "") {
          this.$msgTip.info(this, {info: this.$t("请选择登记类别")});
          return;
        }
        this.addOrEditForm.msgType = this.formItem.msgType;

        this.ifNotFirst = false;
        this.addOrEditType = type;
        if (this.addOrEditType === "modify") {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
            return;
          }
          // if (list.length > 1) {
          //   this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          //   return;
          // }
          this.addOrEditForm.ids = this.$refs.datagrid.selectIds;
          this.updateTime = this.$moment(new Date()).format("YYYY-MM-DD");
          this.addOrEditForm.updateTime = this.updateTime.replace(/-/g, "");
          console.info(this.addOrEditForm.updateTime);
          this.addOrEditForm.applBrchNo = this.$store.getters.userInfo.brchNo;
          this.addOrEditForm.applBrchName = this.$store.getters.userInfo.brchName;
          this.addOrEditForm.rgstFlag = '0';
          // this.addOrEditForm.msgType = "IFC01";
          this.addOrEditWin = true;

        } else if (this.addOrEditType === "add") {
          this.addOrEditForm.brchType = "1";
          // this.addOrEditForm.msgType = "IFC01";
          this.addOrEditWin = true;
          this.ifNotFirst = true;
        }
      },
      addFormReset() {
        this.addOrEditForm.ids = [];
        this.addOrEditForm.billNo = "";
        this.addOrEditForm.rgstFlag = "";
        this.addOrEditForm.billType = "";
        this.addOrEditForm.billClass = "";
        this.addOrEditForm.dueDt = "";
        this.addOrEditForm.remitDt = "";
        this.addOrEditForm.corpScale = "";
        this.addOrEditForm.industryCategory = "";
        this.addOrEditForm.isArc = "";
        this.addOrEditForm.isGreenCorp = "";
        this.addOrEditForm.isPrivateCorp = "";
        this.addOrEditForm.id = "";
        this.addOrEditForm.stdAmt = "";
        this.addOrEditForm.originBillRangeStart = "";
        this.addOrEditForm.originBillRangeEnd = "";
        this.addOrEditForm.originBillMoney = "";
        this.addOrEditForm.billMoney = "";
        this.addOrEditForm.billRangeStart = "";
        this.addOrEditForm.billRangeEnd = "";
        this.addOrEditForm.registerBillRangeStart = "";
        this.addOrEditForm.registerBillRangeEnd = "";
        this.addOrEditForm.registerBillMoney = "";
        this.addOrEditForm.isAcpt = "";
        this.addOrEditForm.billOrigin = "";
        this.addOrEditForm.brchType = "1";
        // this.addOrEditForm.msgType = "IFC01";
      },
      //提交
      addOrEditWinSubmit() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.addOrEditType === "add" ?
              "/be/market/rediscount/rediscSupplRegistApply/func_addRediscountSupplInfo" :
              "/be/market/rediscount/more/rediscSupplRegistApply/func_updateRediscountSupplInfo";
            // this.addOrEditForm.dueDt = this.$moment(this.addOrEditForm.dueDt).format('YYYYMMDD');
            // this.addOrEditForm.remitDt = this.$moment(this.addOrEditForm.remitDt).format('YYYYMMDD');
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWinClose();
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(1);
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
      changeBrchType() {
        if (this.formItem.brchType === "2") {
          this.formItem.msgType = "IFC02";
          this.isMsgTypeReadOnly = true;
        } else if (this.formItem.brchType === "1") {
          this.isMsgTypeReadOnly = false;
        }
      },
      changeMsgType() {
        if (this.addOrEditType === "add" && this.ifNotFirst) {
          this.addOrEditForm.billMoney = "";
          this.addOrEditForm.billClass = "";
          this.addOrEditForm.dueDt = "";
          this.addOrEditForm.corpScale = "";
          this.addOrEditForm.industryCategory = "";
          this.addOrEditForm.isArc = "";
          this.addOrEditForm.isGreenCorp = "";
          this.addOrEditForm.isPrivateCorp = "";
          this.addOrEditForm.stdAmt = "";
          this.addOrEditForm.originBillRangeStart = "";
          this.addOrEditForm.originBillRangeEnd = "";
          this.addOrEditForm.originBillMoney = "";
          this.addOrEditForm.registerBillRangeStart = "";
          this.addOrEditForm.registerBillRangeEnd = "";
          this.addOrEditForm.registerBillMoney = "";
          this.addOrEditForm.isAcpt = "";
          this.addOrEditForm.billType = "";
          this.addOrEditForm.remitDt = "";
          if (this.addOrEditForm.billNo) {
            if (this.addOrEditForm.billNo.length === 16) {
              this.addOrEditForm.billClass = "ME01";
              this.addOrEditForm.billOrigin = "CS00";
            } else if (this.addOrEditForm.billNo.length === 30) {
              this.addOrEditForm.billClass = "ME02";
              let mark = this.addOrEditForm.billNo.charAt(0);
              if (mark === '1' || mark === '2') {
                this.addOrEditForm.billOrigin = "CS01";
              } else if (mark === '5' || mark === '6') {
                this.addOrEditForm.billOrigin = "CS02";
              } else if (mark === '7' || mark === '8') {
                this.addOrEditForm.billOrigin = "CS03";
              } else {
                this.addOrEditForm.billNo = "";
                this.addOrEditForm.billClass = "";
              }
            }
          }
        }
      },
      changeBillRange() {
        if (this.addOrEditType === "add" && this.ifNotFirst) {
          this.addOrEditForm.billMoney = "";
          this.addOrEditForm.billClass = "";
          this.addOrEditForm.dueDt = "";
          this.addOrEditForm.corpScale = "";
          this.addOrEditForm.industryCategory = "";
          this.addOrEditForm.isArc = "";
          this.addOrEditForm.isGreenCorp = "";
          this.addOrEditForm.isPrivateCorp = "";
          this.addOrEditForm.stdAmt = "";
          this.addOrEditForm.originBillRangeStart = "";
          this.addOrEditForm.originBillRangeEnd = "";
          this.addOrEditForm.originBillMoney = "";
          this.addOrEditForm.registerBillRangeStart = "";
          this.addOrEditForm.registerBillRangeEnd = "";
          this.addOrEditForm.registerBillMoney = "";
          this.addOrEditForm.isAcpt = "";
          this.addOrEditForm.billType = "";
          this.addOrEditForm.remitDt = "";
          if (this.addOrEditForm.billNo) {
            if (this.addOrEditForm.billNo.length === 16) {
              this.addOrEditForm.billClass = "ME01";
              this.addOrEditForm.billOrigin = "CS00";
            } else if (this.addOrEditForm.billNo.length === 30) {
              this.addOrEditForm.billClass = "ME02";
              let mark = this.addOrEditForm.billNo.charAt(0);
              if (mark === '1' || mark === '2') {
                this.addOrEditForm.billOrigin = "CS01";
              } else if (mark === '5' || mark === '6') {
                this.addOrEditForm.billOrigin = "CS02";
              } else if (mark === '7' || mark === '8') {
                this.addOrEditForm.billOrigin = "CS03";
              } else {
                this.addOrEditForm.billNo = "";
                this.addOrEditForm.billClass = "";
              }
            }
          }
        }
      },
      changeRegisterBillMoney() {
        if (this.addOrEditForm.registerBillMoney) {
          if (this.addOrEditForm.billMoney && this.addOrEditForm.billMoney > this.addOrEditForm.registerBillMoney) {
            this.$msgTip.error(this, {
              info: this.$t("票据(包)金额" + this.addOrEditForm.registerBillMoney + "必须大于"
                + this.addOrEditForm.billMoney)
            });
            return;
          }
          if (this.addOrEditForm.stdAmt && this.addOrEditForm.stdAmt !== 0
            && this.addOrEditForm.registerBillRangeStart && this.addOrEditForm.registerBillRangeStart !== 0) {
            this.addOrEditForm.registerBillRangeEnd = this.addOrEditForm.registerBillMoney / this.addOrEditForm.stdAmt + this.addOrEditForm.registerBillRangeStart - 1;
          }
        }
      },

      changeBillNo() {
        if (this.addOrEditType === "add" && this.ifNotFirst) {
          this.addOrEditForm.billMoney = "";
          this.addOrEditForm.billClass = "";
          this.addOrEditForm.dueDt = "";
          this.addOrEditForm.corpScale = "";
          this.addOrEditForm.industryCategory = "";
          this.addOrEditForm.isArc = "";
          this.addOrEditForm.isGreenCorp = "";
          this.addOrEditForm.isPrivateCorp = "";
          this.addOrEditForm.billRangeStart = "";
          this.addOrEditForm.billRangeEnd = "";
          this.addOrEditForm.stdAmt = "";
          this.addOrEditForm.originBillRangeStart = "";
          this.addOrEditForm.originBillRangeEnd = "";
          this.addOrEditForm.originBillMoney = "";
          this.addOrEditForm.registerBillRangeStart = "";
          this.addOrEditForm.registerBillRangeEnd = "";
          this.addOrEditForm.registerBillMoney = "";
          this.addOrEditForm.isAcpt = "";
          this.addOrEditForm.billType = "";
          this.addOrEditForm.remitDt = "";
          if (this.addOrEditForm.billNo) {
            if (this.addOrEditForm.billNo.length === 16) {
              this.addOrEditForm.billClass = "ME01";
              this.addOrEditForm.billOrigin = "CS00";
            } else if (this.addOrEditForm.billNo.length === 30) {
              this.addOrEditForm.billClass = "ME02";
              let mark = this.addOrEditForm.billNo.charAt(0);
              if (mark === '1' || mark === '2') {
                this.addOrEditForm.billOrigin = "CS01";
              } else if (mark === '5' || mark === '6') {
                this.addOrEditForm.billOrigin = "CS02";
              } else if (mark === '7' || mark === '8') {
                this.addOrEditForm.billOrigin = "CS03";
              } else {
                this.addOrEditForm.billNo = "";
                this.addOrEditForm.billClass = "";
              }

            }
          }
        }
      },
      formatBillNo() {
        if (this.addOrEditForm.billNo.length !== 16 && this.addOrEditForm.billNo.length !== 30) {
          this.$msgTip.error(this, {info: this.$t("纸票16位，电票30位，请输入正确的票据(包)号码")});
          this.addOrEditForm.billNo = "";
        } else {
          if (this.addOrEditForm.billNo.length === 16) {
            this.addOrEditForm.billClass = "ME01";
            this.addOrEditForm.billOrigin = "CS00";
          } else if (this.addOrEditForm.billNo.length === 30) {
            let mark = this.addOrEditForm.billNo.charAt(0);
            if (mark === '1' || mark === '2') {
              this.addOrEditForm.billClass = "ME02";
              this.addOrEditForm.billOrigin = "CS01";
            } else if (mark === '5' || mark === '6') {
              this.addOrEditForm.billClass = "ME02";
              this.addOrEditForm.billOrigin = "CS02";
            } else if (mark === '7' || mark === '8') {
              this.addOrEditForm.billClass = "ME02";
              this.addOrEditForm.billOrigin = "CS03";
            } else {
              this.$msgTip.error(this, {info: this.$t("电票30位时必须以1或2、5或6、7或8开头，请输入正确的票据(包)号码")});
              this.addOrEditForm.billNo = "";
              this.addOrEditForm.billClass = "";
            }
          }
        }
      },
      //导入票据信息
      billNoImport() {
        let billNo = this.addOrEditForm.billNo;
        let brchType = this.addOrEditForm.brchType;
        let msgType = this.addOrEditForm.msgType;
        if (billNo === null || billNo === "" || billNo === undefined) {
          this.$msgTip.error(this, {info: this.$t("纸票16位，电票30位，请输入正确的票据(包)号码")});
          return;
        }
        if (brchType === '1' && (this.addOrEditForm.billOrigin === 'CS02' || this.addOrEditForm.billOrigin === 'CS03')) {
          if (!this.addOrEditForm.billRangeStart) {
            this.$msgTip.error(this, {info: this.$t("金融机构票据或供应链票据，贴现子票区间起始不能为空")});
            return;
          }
        }
        post({
            billNo: billNo, billRangeStart: this.addOrEditForm.billRangeStart,
            billRangeEnd: this.addOrEditForm.billRangeEnd, brchType: brchType, msgType: msgType
          },
          "/be/market/rediscount/rediscSupplRegistApply/func_getSupplInfoByBillNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.addOrEditForm.billClass = res.data.retData.billClass;
              this.addOrEditForm.billType = res.data.retData.billType;
              this.addOrEditForm.billMoney = res.data.retData.billMoney;
              this.addOrEditForm.stdAmt = res.data.retData.stdAmt;
              this.addOrEditForm.billOrigin = res.data.retData.billOrigin;
              this.addOrEditForm.billRangeStart = res.data.retData.billRangeStart;
              this.addOrEditForm.billRangeEnd = res.data.retData.billRangeEnd;
              this.addOrEditForm.originBillRangeStart = res.data.retData.originBillRangeStart;
              this.addOrEditForm.originBillRangeEnd = res.data.retData.originBillRangeEnd;
              this.addOrEditForm.originBillMoney = res.data.retData.originBillMoney;
              this.addOrEditForm.registerBillRangeStart = res.data.retData.registerBillRangeStart;
              this.addOrEditForm.registerBillRangeEnd = res.data.retData.registerBillRangeEnd;
              this.addOrEditForm.registerBillMoney = res.data.retData.registerBillMoney;
              this.addOrEditForm.isAcpt = res.data.retData.isAcpt;
              this.addOrEditForm.dueDt = this.$moment(res.data.retData.dueDt.toString(), "YYYY-MM-DD").format('YYYY-MM-DD');
              this.addOrEditForm.remitDt = this.$moment(res.data.retData.remitDt.toString(), "YYYY-MM-DD").format('YYYY-MM-DD');
              this.addOrEditForm.corpScale = res.data.retData.corpScale;
              this.addOrEditForm.industryCategory = res.data.retData.industryCategory;
              this.addOrEditForm.isArc = res.data.retData.isArc;
              this.addOrEditForm.isGreenCorp = res.data.retData.isGreenCorp;
              if (this.addOrEditForm.billClass === "ME01") {
                if (this.mode === '2' || this.mode === '6') {
                  this.isReadOnly = false;
                  this.corpScaleReadOnly = this.isCorpReadOnly(this.addOrEditForm.corpScale);
                  this.industryCategoryReadOnly = this.isCorpReadOnly(this.addOrEditForm.industryCategory);
                  this.isArcReadOnly = this.isCorpReadOnly(this.addOrEditForm.isArc);
                  this.isGreenCorpReadOnly = this.isCorpReadOnly(this.addOrEditForm.isGreenCorp);
                } else {
                  this.isReadOnly = true;
                }
              } else if (this.addOrEditForm.billClass === "ME02") {
                this.isReadOnly = false;
              }
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
              this.changeBillNo();
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            this.changeBillNo();
          }
        });

      },
      isCorpReadOnly(str) {
        if (str.length !== 0) {
          return true;
        } else {
          return false;
        }
      },
      pickBillClose() {
        this.paramId = "id";
        this.hasSelect = false;
        this.resetPickBillSearch();
        this.$refs.pickBillDatagrid.selectIds = [];
        this.$refs.pickBillDatagrid.selects = [];
        this.tempPickBillWin = false;
      },
      //挑票页面查询
      handlePickBillSearch() {
        this.$refs.pickBillDatagrid.selects = [];
        this.$refs.pickBillDatagrid.selectIds = [];
        this.$refs.pickBillDatagrid.dataChange(1);
      },
      //挑票新增方法
      pickBillStock() {
        let list = this.$refs.pickBillDatagrid.selectIds;
        console.info(JSON.stringify(list))
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseAtLeastOneRecord")});
          return;
        }

        let url = "/be/market/rediscount/more/rediscSupplRegistApply/func_addRediscountSupplInfo";
        post({ids: list, msgType: this.formItem.msgType, brchType: this.formItem.brchType}, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.pickBillClose();
              this.$refs.datagrid.selects = [];
              this.$refs.datagrid.dataChange(1);
              this.$refs.pickBillDatagrid.selects = [];
              this.$refs.pickBillDatagrid.dataChange(1);
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      pickBill() {
        if (this.formItem.brchType === "" || this.formItem.msgType === ""|| this.formItem.custName === "") {
          this.$msgTip.info(this, {info: "请输入客户名称，申请机构类型和登记类别"});
          return;
        }
        // 贴现申请人
        if (this.formItem.msgType === 'IFC01'){
          this.pickBillForm.discCustName = this.formItem.custName;
          this.pickBillForm.drwrNameLike = '';
        }
        // 出票人
        if (this.formItem.msgType === 'IFC02'){
          this.pickBillForm.discCustName = '';
          this.pickBillForm.drwrNameLike = this.formItem.custName;
        }
        // 子票区间
        this.pickBillForm.minRegisterBillRangeStart = this.formItem.minRegisterBillRangeStart;
        this.pickBillForm.maxRegisterBillRangeEnd = this.formItem.maxRegisterBillRangeEnd;
        this.pickBillForm.billNo = this.formItem.billNo;
        this.pickBillForm.brchType = this.formItem.brchType;
        this.pickBillForm.msgType = this.formItem.msgType;

        this.tempPickBillWin = true;
        this.$nextTick(() => {
          this.handlePickBillSearch();
        });
        // this.$refs.pickBillDatagrid.dataChange(1);
      },
      //挑票页面重置查询条件
      resetPickBillSearch() {
        this.dueDate = [];
        this.buyDate = [];
        this.pickBillForm.discBankName = '';
        this.pickBillForm.discBrchCode = '';
        this.pickBillForm.discBankNo = '';
        this.pickBillForm.creditBranchName = '';
        // this.$refs.pickBillForm.resetFields();
      },
    }
  };
</script>

<style scoped>

</style>
