<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.brchName')" prop="brchNos">
                  <h-input v-model="formItem.brchNos" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo"
                           v-show="false"
                  ></h-input>
                  <h-input v-model="formItem.branchName" placeholder="" readonly
                           icon="android-search" @on-click="queryBrchNo" :title="formItem.branchName"
                  ></h-input>
                </h-form-item>
                <h-form-item prop="acptProtocalNoLike" :label="$t('m.i.billInfo.acptProtocalNo')">
                  <h-input v-model="formItem.acptProtocalNoLike" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder=""></h-input>
                </h-form-item>
                <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')">
                  <h-input v-model="formItem.drwrName" placeholder="" icon="android-search" @on-click="queryCustName()" readonly
                           clearable @on-clear="clearVal('custName')"></h-input>
                </h-form-item>
                <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')">
                  <h-input v-model="formItem.drwrAcctNo" placeholder="" icon="android-search" @on-click="queryCustAcctNo()" readonly
                           clearable @on-clear="clearVal('custAcctNo')"></h-input>
                </h-form-item>
                <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')">
                  <h-date-picker type="date" v-model="formItem.remitDt" placeholder="" @on-change="handleRemitDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker type="date" v-model="formItem.dueDt" placeholder="" @on-change="handleDueDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item prop="sspdStatus" :label="$t('m.i.ce.sspdStatus')">
                  <h-select v-model="formItem.sspdStatus" placeholder="">
                    <h-option v-for="item in sspdStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="acptStatus" :label="$t('m.i.ce.acptStatus')">
                  <h-select v-model="formItem.acptStatus" placeholder="">
                    <h-option v-for="item in acptStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="deductStatusList" :label="$t('m.i.ce.deductStatus')">
                  <h-select v-model="formItem.deductStatusList" placeholder="" multiple>
                    <h-option v-for="item in deductStatusDictList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="payRgstDt" :label="$t('m.i.ce.payRgstDt')">
                  <h-date-picker type="date" v-model="formItem.payRgstDt" placeholder="" @on-change="handlePayRgstDtChange" :editable=false></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.payRgstStatus')" prop="payRgstStatus">
                  <h-select v-model="formItem.payRgstStatus" placeholder="">
                    <h-option value="1">已付款登记</h-option>
                    <h-option value="0">未付款登记</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.acptAcctStatus')" prop="acptAcctFlag">
                  <h-select v-model="formItem.acptAcctFlag" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.backAcctStatus')" prop="backAcctFlag" class="h-form-long-label">
                  <h-select v-model="formItem.backAcctFlag" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.paymentAcctStatus')" prop="paymentAcctFlag" class="h-form-long-label">
                  <h-select v-model="formItem.paymentAcctFlag" placeholder="">
                    <h-option v-for="item in acctStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.pc.sumMoney')" class="h-form-long-label">
                    <h-input v-model="sumMoney" placeholder="" readonly></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.total')">
                    <h-input v-model="total" placeholder="" readonly></h-input>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/paper/search/acptTrackSearch/func_trackList"
                      @getSumMoneyAndTotal="getSumMoneyAndTotal"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="exportData()">{{$t('m.i.common.exportData')}}</h-button>
            </div>
          </h-datagrid>
        </div>
        <!-- 查询客户信息弹窗 -->
        <show-cust-message :show-cust-message-win="showCustMessageWin" @custCorpWinClose="custCorpWinClose"
                           @custCorpSelectSubmit="custCorpSelectSubmit"></show-cust-message>
        <!-- 查询客户账号信息弹窗 -->
        <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"
                           @showCustAcctNoWinClose="showCustAcctNoWinClose" @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>
        <!-- 影像维护 -->
        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="imageParams"
          :isReadonly="true"
          :showAcptSearch="true"
          :showImgPlat="true"
          :showMain="false"
          :format="['jpg','JPG']"
          :maxSize="512"
          @imageWinClose="uploadImageWinClose"></image-loading>

        <!-- 票面 -->
        <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>

        <!-- 登记日期历史查询弹窗 -->
        <h-msg-box v-model="rgstDtHisWin" width="800" class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-close="rgstDtHisWinClose()">
          <!--弹出框模式标题-->
          <p slot="header">
            <span>登记历史查询</span>
          </p>
          <!-- 数据展示表格 -->
          <div>
            <h-datagrid :columns="rgstDtHisColumns"
                        highlight-row
                        :autoLoad="false"
                        url="/ce/acpt/paper/search/acptTrackSearch/func_pageQueryAcptInfoRgst"
                        :bindForm="rgstDtHisForm"
                        :height="350"
                        ref="rgstDtHisDatagrid" class="pl-5 pr-5">
              <div slot="toolbar" class="pull-left">
              </div>
            </h-datagrid>
          </div>
          <!-- 弹出框模式底部按钮 -->
          <div slot="footer">
            <h-button type="ghost" @click="rgstDtHisWinClose()">{{$t("m.i.common.close")}}</h-button>
          </div>
        </h-msg-box>

        <!--保证金账号查询-->
        <show-deduct-acct @dueDeductAcctWinClose="dueDeductAcctWinClose" :dueDeductAcctWin="dueDeductAcctWin" :params="showParams"></show-deduct-acct>
        <show-branch-sec :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                     :ifcheck="true" :checkStrictly="true"  @showBranchWinClose="showBranchWinClose"></show-branch-sec>
        <!--excel导出-->
        <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                               :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows"></common-excel-download>
      </h-col>
    </h-row>
  </div>
</template>

<script>
import {accMul, formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "acptTrackSearch",
    components: {
      ShowDeductAcct:()=>import(/* webpackChunkName: "ce/acpt/common/showDeductAcct" */`@/views/bizViews/ce/acpt/common/showDeductAcct`),
      ShowBranchSec:()=>import(/* webpackChunkName: "be/market/rediscount/common/showBranch" */`@/views/bizViews/be/market/rediscount/common/showBranch`),
      ImageLoading:()=>import(/* webpackChunkName: "banks/szbank/ce/acpt/paper/components/imageLoading" */`@/views/bizViews/banks/szbank/ce/acpt/paper/components/imageLoading`),
    },
    data() {
      return {
        tempShowExcelTemplateWin:false,
        param:"",
        rows:"",
        sumMoney : "",
        total : "",
        rgstDtHisWin: false,
        rgstDtHisColumns: [
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            key: 'rgstType',
            title: this.$t("m.i.ce.rgstType"),
            hiddenCol: true,
          },
          {
           title: this.$t("m.i.ce.rgstBusiType"),
            key: 'rgstBusiType',
            hiddenCol: false,
            render:(h,params) => {
              let prodNoStart = params.row.prodNo.toString().substring(0,4);
              let prodNoFlag = params.row.prodNo.toString().substring(4,6);
              let rgstBusiType = params.row.rgstBusiType.toString();
              if(rgstBusiType === "1") {
                rgstBusiType = "承兑登记";
              }else if(rgstBusiType === "2") {
                rgstBusiType = "止付登记";
              }else if(rgstBusiType === "3") {
                rgstBusiType = "结清登记";
              }else if(rgstBusiType === "4") {
                rgstBusiType = "解止付登记";
              }
              let prodNameEnd = "";
              if(params.row.rgstType === "1") {
                prodNameEnd = "申请";
              }else if(params.row.rgstType === "2") {
                prodNameEnd = "撤销";
              }
              return h("span", rgstBusiType+prodNameEnd);
            }
          },
          {
              title: this.$t("m.i.common.busiType"),
            key: 'prodNo',
            hiddenCol: false,
            render: (h, params) => {
              let prodNo = params.row.prodNo;
              let prodName = "";
              if(prodNo == "01010111"){
                prodName = "纸票银承签发";
              } else if(prodNo == "01010211"){
                prodName = "纸票银承解付(场外)";
              } else if(prodNo == "01010311"){
                prodName = "纸票银承未用退回";
              } else if(prodNo == "01010611"){
                prodName = "纸票银承止付";
              } else if(prodNo == "01010711"){
                prodName = "纸票银承止付解除";
              } else if(prodNo == "02020211"){
                prodName = "纸票银承凭证退回";
              }
              return h("span", prodName);
            }
          },
          {
            title: this.$t("m.i.ce.rgstResult"),
            key: 'rgstResult',
            hiddenCol: false,
            render: (h, params) => {
              let rgstResult = params.row.rgstResult;
              if(rgstResult == null || rgstResult === ""){
                return "";
              } else if( rgstResult === "0"){
                rgstResult = "处理失败";
              } else if( rgstResult === "1"){
                rgstResult = "处理成功";
              } else if( rgstResult === "2"){
                rgstResult = "处理中";
              }
              return h("span", rgstResult);
            }
          },
          {
            title: this.$t("m.i.ce.rgstDt"),
            key: 'rgstDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.rgstDt == null || params.row.rgstDt === ""){
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
        ],
        rgstDtHisForm: {
          listId: '',
          acptId: ''
        },
        showBillInfoWin: false,
        billId: "",
        formItem: {
          brchNos: "",
          branchName:"",
          acptProtocalNoLike: '',
          billNoLike: '',
          drwrCustNo: '',
          drwrName: '',
          drwrAcctNo: '',
          remitDt: '',
          dueDt: '',
          sspdStatus: '',
          acptStatus: '',
          deductStatus: '',
          payRgstDt:'',
          payRgstStatus:'',
          acptAcctFlag:"",
          backAcctFlag:"",
          paymentAcctFlag:"",
          billClass: 'ME01',
          deductStatusList: [],
          reverseBillNo: ''
        },
        acctStatusList:[],
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            key:"duoxuan",

            hiddenCol: false
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
            title: this.$t("m.i.common.brchName"),
            key: "transBrchName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "查看票面";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, billNo);
            }
          },
          {
           title: this.$t("m.i.ce.acptType"),
            key: 'acptType',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptType",params.row.acptType);
              return h("span", {
                domProps: {
                  title: list
                }
              }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: 'flowStatusName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.acptStatus"),
            key: 'acptStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"AcptStatus",params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
              title: this.$t("m.i.ce.sspdStatus"),
            key: 'sspdStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"SspdStatus",params.row.sspdStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.acptAcctStatus"),
            key: "acptAcctFlag",
            hiddenCol: false,
            render:(h, params)=>{
              if(params.row.acptAcctFlag === "n"){
                return "";
              }
              let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.acptAcctFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.backAcctStatus"),
            key: "backAcctFlag",
            hiddenCol: false,
            render:(h, params)=>{
              if(params.row.backAcctFlag === "n"){
                return "";
              }
              let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.backAcctFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.paymentAcctStatus"),
            key: "paymentAcctFlag",
            hiddenCol: false,
            render:(h, params)=>{
              if(params.row.paymentAcctFlag === "n"){
                return "";
              }
              let list = getDictValueFromMap(this.dictMap, "AcctFlag", params.row.paymentAcctFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.payRgstDt"),
            key: 'payRgstDt',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.payRgstDt == null || params.row.payRgstDt === ""){
                return "";
              }
              let date = this.$moment(params.row.payRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },{
            title: this.$t("m.i.ce.payRgstStatus"),
            key: 'payRgstStatus',
            hiddenCol: false,
            render: (h, params) => {
              let payRgstStatus = "";
              if(params.row.payRgstStatus == "1"){
                payRgstStatus = "已付款登记";
              }
              if(params.row.payRgstStatus == "0"){
                payRgstStatus = "未付款登记";
              }
              return h("span", payRgstStatus);
            }
          },
          {
            title: this.$t("m.i.billInfo.acptProtocalNo"),
            key: 'acptProtocalNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.promNoteNo"),
            key: 'promNoteNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrCustNo"),
            key: 'drwrCustNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: 'billMoney',
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.ce.deductAmt"),
            key: 'deductAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let deductAmt = formatNumber(params.row.deductAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: deductAmt
                }
              }, deductAmt);
            }
          },
          {
            title: this.$t("m.i.ce.deductStatus"),
            key: 'deductStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"DeductStatusType",params.row.deductStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.advancedPayAmt"),
            key: 'preAdvancedPayAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let preAdvancedPayAmt = formatNumber(params.row.preAdvancedPayAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: preAdvancedPayAmt
                }
              }, preAdvancedPayAmt);
            }
          },
          {
            title: this.$t("m.i.ce.overDueAdvancedPayAmt"),
            key: 'advancedPayAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let advancedPayAmt = formatNumber(params.row.advancedPayAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: advancedPayAmt
                }
              }, advancedPayAmt);
            }
          },
          {
            title: this.$t("m.i.ce.bailPcetStr"),
            key: 'bailPcet',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.bailPcet != null && params.row.bailPcet !== ""){
                let rate = accMul(params.row.bailPcet, 100);
                let rateFormat = formatNumber(rate, 2, ',');
                return h("span", rateFormat);
              }
            }
          },
          {
            title: this.$t("m.i.ce.guarntrAmt"),
            key: 'guarntrAmt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let guarntrAmt = formatNumber(params.row.guarntrAmt, 2, ',');
              return h("span", {
                domProps: {
                  title: guarntrAmt
                }
              }, guarntrAmt);
            }
          },
          {
            title: this.$t("m.i.ce.guarntrNo"),
            key: "guarntrNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showDueDeductAcct(params.row.id);
                  }
                }
              }, '查看');
            }
          },
          {
            title: this.$t("m.i.ce.drwrAcctNo"),
            key: 'settleAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.drwgBackDt"),
            key: 'drwgBackDt',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.drwgBackDt == null || params.row.drwgBackDt === ""){
                return "";
              }
              let date = this.$moment(params.row.drwgBackDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'remitDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let date = this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.ce.entrustAcctNo"),
            key: 'prsttnAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustName"),
            key: 'prsttnName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustBankNo"),
            key: 'prsttnBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.entrustBankName"),
            key: 'prsttnBankName',
            sortable: true,
            hiddenCol: false,
          },
          {
           title: this.$t("m.i.ce.registerStatus"),
            key: 'registerStatus',
            hiddenCol: false,
            render:(h,params) => {
              if(params.row.acptRgstStatus == null || params.row.acptRgstStatus === ""){
                return h("span", "");
              }else {
                let str = params.row.acptRgstStatus.replace(/-/g, "");
                let dictValue = getDictValueFromMap(this.dictMap,"AcptRgstStatus",str.substring(1,6));
                return h("span", {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
              }
            }
          },
          {
           title: this.$t("m.i.ce.rgstBusiType"),
            key: 'registerType',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.acptRgstStatus === null || params.row.acptRgstStatus === "") {
                return "";
              }else {
                let acptRgstStatus = params.row.acptRgstStatus.replace(/-/g, "");
                let list = getDictValueFromMap(this.dictMap,"AcptCpesRgstType",acptRgstStatus.substring(0,1));
                return h("a", {
                  domProps: {
                    title: list
                  },
                  on: {
                    click: () => {
                      this.showRgstDtHis(params.row.id);
                    }
                  }
                }, list);
              }
            }
          },
          {
              title: this.$t("m.i.common.acptRgstDt"),
            key: 'acptRgstDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.acptRgstDt == null || params.row.acptRgstDt === ""){
                return "";
              }
              let date = this.$moment(params.row.acptRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
              title: this.$t("m.i.billInfo.acptErrorReason"),
            key: 'acptErrorReason',
            hiddenCol: false,
          },
          {
              title: this.$t("m.i.billInfo.acptRegstImgSupplement"),
            key: 'img',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.acptRgstStatus === "" || params.row.acptRgstStatus === null) {
                return h("span", "---");
              }else {
                let acptRgstStatus = params.row.acptRgstStatus.replace(/-/g, "");
                let str  = acptRgstStatus.substring(0,1);
                if(str === "2" || str === "4" || params.row.acptRgstStatus === "1-BTA04" || params.row.acptRgstStatus === "1-BTA10"
                  || params.row.acptRgstStatus === "3-BTA01" || params.row.acptRgstStatus === "3-BTA06" || params.row.acptRgstStatus === "3-BTA09") {
                  return h('span', [
                    h('a', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.imageAdd(params.row.id,params.row.billNo)
                        }
                      }
                    }, '承兑登记影像补登')
                  ]);
                }else {
                  return h("span", "---");
                }
              }
            }
          },
        ],
        //影像上传
        showUploadImageWin: false,
        imageParams: {
          id: '',
          imgType:"IM07",
          imageUrl:"/ce/acpt/paper/search/acptTrackSearch/func_pageQueryAcptImgList", //查询可查看影像url
          imageUploadUrl:"/ce/acpt/paper/search/acptTrackSearch/func_loadImgFileAndSave", //影像上传url
          imageRegisterUrl:"/ce/acpt/paper/search/acptTrackSearch/func_sendAcptImgMsg", //影像登记url
          imageDeleteUrl:"/ce/acpt/paper/search/acptTrackSearch/func_deleteAcptImg", //影像删除url
          imgShowUrl:"/ce/acpt/paper/search/acptTrackSearch/func_showAcptImg?id=", //查看影像url
          listId:"",
          imgBusiType:"acptImage",
          busiType:"RI01",
          billNo:""
        },
        sspdStatusList: [],
        acptStatusList: [],
        deductStatusDictList: [],
        dictMap: new Map(),
        currentSelectRow: [],
        showCustAcctNoWin: false,
        showCustMessageWin: false,
        //是否显示更多查询项
        ifShowMore: false,
        //查询保证金账户信息
        dueDeductAcctWin: false,
        showBranchWin:false,
        showParams: {
          listId:"",
        }
      }
    },
    mounted() {
      getDictListByGroups("AcptType,SspdStatus,AcctFlag,AcptStatus,DraftTypeCode,AcptCpesRgstType,AcptRgstStatus,DeductStatusType").then(res => {
        this.sspdStatusList = res.get("SspdStatus");
        this.acptStatusList = res.get("AcptStatus");
        this.deductStatusList=res.get("DeductStatusType");
        this.deductStatusDictList=res.get("DeductStatusType");
        this.dictMap = res.get("map");
      });
      let item1 = {};
      let item2 = {};
      let item3 = {};
      item1.value = "未记账";
      item2.value = "已记账";
      item3.value = "记账失败";
      item1.key = "0";
      item2.key = "1";
      item3.key = "2";
      this.acctStatusList.push(item1);
      this.acctStatusList.push(item2);
      this.acctStatusList.push(item3);
    },
    methods: {
      getSumMoneyAndTotal(params) {
        this.total = params.total;
        this.sumMoney = formatNumber(params.sumMoney, 2, ",");
      },
      getList() {
        let obj = Object.assign({}, this.formItem, { "pageNo": this.$refs.datagrid.pageInfo.pageNo, "pageSize": this.$refs.datagrid.pageInfo.pageSize });
        let url = "/ce/acpt/paper/search/acptTrackSearch/func_trackList";
        post(obj, url).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                let data = res.data.retData;
                this.total = data.pageInfo.count;
                this.sumMoney = formatNumber(data.pageInfo.sumMoney, 2, ',');
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      showDueDeductAcct(id) {
        this.showParams.listId = id;
        this.dueDeductAcctWin = true;
      },

      dueDeductAcctWinClose() {
        this.dueDeductAcctWin = false;
      },
      clearVal(type){
        if(type === 'custName'){
          this.formItem.drwrCustNo = '';
          this.formItem.drwrName = "";
        }else{
          this.formItem.drwrAcctNo = '';
        }
      },
      showRgstDtHis(id) {
        this.rgstDtHisForm.acptId = id;
        this.rgstDtHisWin = true;
        this.$nextTick(() => {
          this.$refs.rgstDtHisDatagrid.dataChange(1);
        });
      },
      rgstDtHisWinClose() {
        this.rgstDtHisForm.billNo = "";
        this.rgstDtHisWin = false;
      },
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      handleRemitDtChange(value) {
        this.formItem.remitDt = value.replace(/-/g, "");
      },
      handlePayRgstDtChange(value) {
        this.formItem.payRgstDt = value.replace(/-/g, "");
      },
      handleDueDtChange(value) {
        this.formItem.dueDt = value.replace(/-/g, "");
      },
      //表单查询
      handleSearch() {
        // this.getList();
        this.$refs.datagrid.selects = [];
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
        })
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.drwrCustNo = '';
        let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
        this.formItem.brchNos = userInfo.brchNo;
        this.formItem.branchName = userInfo.brchName;
      },
      clearVal1(){
        this.formItem.brchNos = "";
        this.formItem.branchName = "";
      },
      //查询机构弹出框
      queryBrchNo() {
        this.showBranchWin = true;
      },
      showBranchWinClose() {
        this.showBranchWin = false;
      },
      //根据弹框所选数据进行赋值
      brchNoChange(info) {

        let objs = [];
        if(info instanceof Array){
          objs = info;
        } else {
          objs[0] = info;
        }
        let brchNos = "";
        let brchNames = "";
        for(var i=0;i<objs.length; i++){
          brchNos += objs[i].id + ',';
          brchNames += objs[i].title + ',';
        }
        this.formItem.brchNos = brchNos.substring(0,brchNos.length - 1);
        this.formItem.branchName = brchNames.substring(0,brchNames.length - 1);
        this.showBranchWin = false;
      },
      //查询客户信息
      //触发弹窗
      queryCustName() {
        this.showCustMessageWin = true;
      },
      //赋值
      custCorpSelectSubmit(info) {
        this.formItem.drwrAcctNo = "";
        this.formItem.drwrName = info.custName;
        this.formItem.drwrCustNo = info.custNo;
        if(info.custAcctNo !== ""){
          this.formItem.drwrAcctNo = info.custAcctNo;
        }
        this.showCustMessageWin = false;
      },
      //关闭
      custCorpWinClose() {
        this.showCustMessageWin = false;
      },
      //查询客户账号信息
      //触发弹窗
      queryCustAcctNo() {
        if (this.formItem.drwrCustNo === "") {
          this.$msgTip.info(this, { info: "请先选择客户！" });
          return;
        }
        this.showCustAcctNoWin = true;
      },
      //赋值
      custAcctNoSelectSubmit(info) {
        this.formItem.drwrAcctNo = info.custAcctNo;
        this.showCustAcctNoWin = false;
      },
      //关闭弹窗
      showCustAcctNoWinClose() {
        this.showCustAcctNoWin = false;
      },
      //承兑影像补登
      imageAdd(id,billNo) {
        this.imageParams.id = id;
        this.imageParams.listId = id;
        this.imageParams.billNo = billNo;
        this.showUploadImageWin = true;
      },
      exportList(field, exportType){
        //exportType: 0-同步 1-异步
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/paper/search/acptTrackSearch/func_exportDataForAcptTrackSearch";
        if(exportType === "1"){
          let params = null;
          if (this.$refs.datagrid.selectIds.length != 0) {
            params = { ids: this.$refs.datagrid.selectIds, field: field, exportType: exportType, excelName: this.param};
          }else {
            params = Object.assign({ field: field, exportType: exportType, excelName: this.param},this.formItem);
          }
          post(params, url).then(res => {
            if(res.status === 200 && res.data === null){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            }else if(res.status === 200 && res.data === ""){
              this.$msgTip.info(this, { info:"异步导出成功，请进入公共管理》导出下载页面，进行下载"});
            } else{
              this.$msgTip.error(this, { info: "异步导出失败" });
            }
          });
        }else {
          let form = document.createElement("form");
          form.setAttribute("id", "formId");
          form.setAttribute("action", url);
          form.setAttribute("method", "post")
          if (this.$refs.datagrid.selectIds.length !== 0) {
            let input1 = document.createElement('input')
            input1.type = 'text'
            input1.name = 'ids';
            input1.value = this.$refs.datagrid.selectIds;
            form.appendChild(input1)
          } else {
            for (let obj in this.formItem) {
              if (this.formItem.hasOwnProperty(obj)) {
                let input = document.createElement("input");
                input.type = "text";
                input.name = obj;
                input.value = this.formItem[obj];
                form.appendChild(input);
              }
            }
          }
          let input3 = document.createElement('input')
          input3.type = 'text'
          input3.name = 'field';
          input3.value = field;
          form.appendChild(input3)
          let input4 = document.createElement('input')
          input4.type = 'text'
          input4.name = 'exportType';
          input4.value = exportType;
          form.appendChild(input4)
          let input5 = document.createElement('input')
          input5.type = 'text'
          input5.name = 'excelName';
          input5.value = this.param;
          form.appendChild(input5)
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }
      },

      //清单导出
      exportData() {
        this.param = 'paperAcptTrackSearchExport';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
      }

    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    },
  };
</script>

<style scoped>

</style>
