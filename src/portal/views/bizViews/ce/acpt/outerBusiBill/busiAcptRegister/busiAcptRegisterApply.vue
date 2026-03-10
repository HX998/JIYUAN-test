<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="reverseBillNo" :label="$t('m.i.billInfo.billNo')">
                  <h-input v-model="formItem.reverseBillNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <h-form-item prop="acptRgstStatus" :label="$t('m.i.common.acptRgstStatus')">
                  <h-select v-model="formItem.acptRgstStatus" placeholder="" showTitle>
                    <h-option v-for="item in acptRgstStatusList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="acptDt" :label="$t('m.i.billInfo.acptDt')">
                  <h-date-picker type="date" v-model="formItem.acptDt" placeholder="" format="yyyy-MM-dd" :editable=false showFormat @on-change="handleAcptDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_pageQueryAcptCorpList"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="singleAdd('add')" >{{$t('m.i.ce.singleAdd')}}</h-button>
              <h-button type="primary" @click="singleAdd('modify')" >{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="busiDelete" >{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="templateDownload" >{{$t('m.i.common.templateDownload')}}</h-button>
              <h-button type="primary" @click="batchImport" >{{$t('m.i.common.batchImport')}}</h-button>
              <h-button type="primary" @click="submitRecheck" >{{$t('m.i.common.submitCheck')}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 新增承兑登记信息界面 -->
        <h-msg-box v-model="acptRegisterAddWin" width="800" @on-close="acptRegisterAddWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span v-if="type=='add'">新增承兑登记信息</span>
            <span v-if="type=='modify'">修改承兑登记信息</span>
          </p>
          <div>
            <h-form :model="acptRegisterAddForm" :label-width="115" ref="acptRegisterAddForm" cols="2" class="h-form-search">
              <h-form-item prop="billType" :label="$t('m.i.billInfo.billType')" required>
                <h-select v-model="acptRegisterAddForm.billType" placeholder="" readonly showTitle>
                  <h-option value="AC02" key="AC02">商票</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :required="isRequired" :validRules="billNoRule">
                <h-input v-if="type=='add'" v-model="acptRegisterAddForm.billNo" :maxlength="16" placeholder="商票号码为16位数字,第四位为0,第七位为6"></h-input>
                <h-input v-else readonly v-model="acptRegisterAddForm.billNo" :maxlength="16" placeholder="商票号码为16位数字,第四位为0,第七位为6"></h-input>
              </h-form-item>
              <h-form-item prop="openDt":label="$t('m.i.billInfo.remitDt')" required>
                <h-date-picker v-model="acptRegisterAddForm.openDt" type="date" :options="remitDtOptions" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required :validRules="dueDtRule">
                <h-date-picker v-model="acptRegisterAddForm.dueDt" type="date" :options="dueOptions" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item :label="$t('m.i.billInfo.billMoney')" prop="billMoney" :required="isRequired"
                           :validRules="billMoneyRule">
                <h-typefield v-model="acptRegisterAddForm.billMoney" :maxlength="20" placeholder="数字，小数位最多2位"
                         @on-blur="formatBillMoney('blur')" @on-focus="formatBillMoney('focus')" bigTips></h-typefield>
              </h-form-item>
              <h-form-item prop="acptDt" :label="$t('m.i.billInfo.acptDt')" required>
                <h-date-picker v-model="acptRegisterAddForm.acptDt" type="date" :options="acptOptions" showFormat :editable=false></h-date-picker>
              </h-form-item>
              <h-form-item prop="acptName" :label="$t('m.i.billInfo.acptName')" required>
                <h-input v-model="acptRegisterAddForm.acptName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item prop="acptAcctNo" :label="$t('m.i.billInfo.acptAcctNo')" required>
                <h-input v-model="acptRegisterAddForm.acptAcctNo" placeholder="" :maxlength="32"></h-input>
              </h-form-item>
              <h-form-item prop="acptBankNo" :label="$t('m.i.billInfo.acptBankNo')" required>
                <h-input v-model="acptRegisterAddForm.acptBankNo" readonly icon="android-search" @on-click="queryBranchCode('acpt')"
                         placeholder="" clearable @on-clear="clearVal('acpt')"></h-input>
              </h-form-item>
              <h-form-item prop="acptBankName" :label="$t('m.i.billInfo.acptBankName')">
                <h-input v-model="acptRegisterAddForm.acptBankName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="acptSocCode" :label="$t('m.i.billInfo.acptSocCode')" required :validRules="sosCodeRule" class="h-form-long-label">
                <h-input v-model="acptRegisterAddForm.acptSocCode" placeholder="" :maxlength="18"></h-input>
              </h-form-item>
              <h-form-item prop="drwrName" :label="$t('m.i.billInfo.drwrName')" required>
                <h-input v-model="acptRegisterAddForm.drwrName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item prop="drwrAcctNo" :label="$t('m.i.billInfo.drwrAcctNo')" required>
                <h-input v-model="acptRegisterAddForm.drwrAcctNo" placeholder="" :maxlength="32" @on-blur="queryDrwrAcctList()"></h-input>
              </h-form-item>
              <h-form-item prop="drwrBankNo" :label="$t('m.i.billInfo.drwrBankNo')" :validRules="bankNoRule">
                <h-input v-model="acptRegisterAddForm.drwrBankNo" placeholder="" @on-change="changeHvpsBankNo($event,'drwr')"
                         icon="android-search" @on-click="queryHvpsBank('drwr')" @on-clear="clearVal('drwr')" type="int" :maxlength="12"></h-input>
              </h-form-item>
              <h-form-item prop="drwrBankName" :label="$t('m.i.billInfo.drwrBankName')">
                <h-input v-model="acptRegisterAddForm.drwrBankName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="drwrSocCode" :label="$t('m.i.billInfo.drwrSocCode')" :validRules="sosCodeRule" required class="h-form-long-label">
                <h-input v-model="acptRegisterAddForm.drwrSocCode" placeholder="" :maxlength="18" :readonly="!couldChangeDrwr"></h-input>
              </h-form-item>
              <h-form-item prop="drwrIndustry" :label="$t('m.i.billInfo.drwrIndustry')" required>
                <h-select v-model="acptRegisterAddForm.drwrIndustry" :maxlength=60 placeholder="" showTitle :readonly="!couldChangeDrwr">
                  <h-option v-for="item in industryCategoryList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="drwrCorpScale" :label="$t('m.i.billInfo.drwrCorpScale')" required>
                <h-select v-model="acptRegisterAddForm.drwrCorpScale" :maxlength=60 placeholder="" showTitle :readonly="!couldChangeDrwr">
                  <h-option v-for="item in corpScaleList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="isDrwrArc" :label="$t('m.i.billInfo.isDrwrArc')" required class="h-form-long-label" readonly>
                <h-select v-model="acptRegisterAddForm.isDrwrArc" :maxlength=60 placeholder="" showTitle :readonly="!couldChangeDrwr">
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="drwrArea" :label="$t('m.i.billInfo.drwrArea')" required>
                <h-select v-model="acptRegisterAddForm.drwrArea" :maxlength=60 placeholder="" showTitle :readonly="!couldChangeDrwr">
                  <h-option v-for="item in areaList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="isDrwrGrn" :label="$t('m.i.billInfo.isDrwrGrn')" required class="h-form-long-label">
                <h-select v-model="acptRegisterAddForm.isDrwrGrn" :maxlength=60 placeholder="" showTitle :readonly="!couldChangeDrwr">
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="pyeeName" :label="$t('m.i.billInfo.pyeeName')" required>
                <h-input v-model="acptRegisterAddForm.pyeeName" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')" required>
                <h-input v-model="acptRegisterAddForm.pyeeAcctNo" placeholder=""></h-input>
              </h-form-item>
              <h-form-item prop="pyeeBankNo" :label="$t('m.i.billInfo.pyeeBankNo')" :validRules="bankNoRule">
                <h-input v-model="acptRegisterAddForm.pyeeBankNo" placeholder="" @on-change="changeHvpsBankNo($event,'pyee')"
                         icon="android-search" @on-click="queryHvpsBank('pyee')" @on-clear="clearVal('pyee')" type="int" :maxlength="12"></h-input>
              </h-form-item>
              <h-form-item prop="pyeeBankName" :label="$t('m.i.billInfo.pyeeBankName')" required>
                <h-input v-model="acptRegisterAddForm.pyeeBankName" placeholder="" :maxlength="60" :lengthByByte="false"></h-input>
              </h-form-item>
              <h-form-item prop="pyeeSocCode" :label="$t('m.i.billInfo.pyeeSocCode')" :validRules="pyeeSosCode" class="h-form-long-label">
                <h-input v-model="acptRegisterAddForm.pyeeSocCode" placeholder="" :maxlength=18></h-input>
              </h-form-item>
              <h-form-item prop="drweBankNo" :label="$t('m.i.billInfo.drweBankNo')" required>
                <h-input v-model="acptRegisterAddForm.drweBankNo" readonly icon="android-search" @on-click="queryBranchCode('drwe')"
                         placeholder="" clearable @on-clear="clearVal('drwe')"></h-input>
              </h-form-item>
              <h-form-item prop="drweBankName" :label="$t('m.i.billInfo.drweBankName')">
                <h-input v-model="acptRegisterAddForm.drweBankName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="acptRemark" :label="$t('m.i.common.remark')" class="h-form-height-auto" :validRules="acptRemarkCode">
                <h-input type="textarea" :rows=3 v-model="acptRegisterAddForm.acptRemark" :canResize="false"
                         ></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="acptRegisterAddWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="acptRegisterAddSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>
        <image-loading
          :imageWin="showUploadImageWin"
          :imageParams="showImageform"
          :isReadonly="true"
          :showImgPlat="true"
          @imageWinClose="uploadImageWinClose"></image-loading>

      </h-col>
    </h-row>
    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
    <show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose" :memberId="memberId"
                      @showCpesBranchSubmit="showCpesBranchSubmit" :showMemberId="false" :isShowBankNo="true"></show-cpes-branch>
    <show-hvps-bank :showHvpsBank="showHvpsBank" @showHvpsBankClose="showHvpsBankClose"
                    @showHvpsBankSubmit="showHvpsBankSubmit"></show-hvps-bank>
  </div>
</template>

<script>
import {formatNumber, getDictListByGroups, getDictValueFromMap, post} from "@/api/bizApi/commonUtil";

export default {
    name: "busiAcptRegisterApply",
    components : {
      ShowHvpsBank: () => import(/* webpackChunkName: "shcpe/cpes/hvpsbank/showHvpsBank" */`@/views/bizViews/shcpe/cpes/hvpsbank/showHvpsBank`),
      ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      let _that = this;
      let acptRegisterAddForm = {
          billType: 'AC02',
          billNo: '',
          openDt: '',
          dueDt: '',
          billMoney: '',
          acptDt: '',
          acptName: '',
          acptAcctNo: '',
          acptBankNo: '',
          acptBankName: '',
          acptSocCode: '',
          drwrName: '',
          drwrAcctNo: '',
          drwrBankNo: '',
          drwrBankName: '',
          drwrSocCode: '',
          drwrIndustry: '',
          drwrCorpScale: '',
          isDrwrArc: '',
          drwrArea: '',
          isDrwrGrn: '',
          pyeeName: '',
          pyeeAcctNo: '',
          pyeeBankNo: '',
          pyeeBankName: '',
          pyeeSocCode: '',
          drweBankNo: '',
          drweBankName: '',
          acptRemark: '',
          transId: ''
        };
      return {
        isRequired: false,
        formItem: {
          billNo: '',
          acptStatus: '',
          acptDt: '',
          acptRgstStatusList: 'BTA01,BTA06,BTA09',
          cancelTypeNotIn : 'RV01,RV03',
          reverseBillNo : ''
        },
        acptRegisterAddForm: acptRegisterAddForm,
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
            title: this.$t("m.i.common.acptRgstDt"),
            key: 'acptRgstDt',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.acptRgstDt == null || params.row.acptRgstDt === ""){
                return "";
              }
              let acptRgstDt = this.$moment(params.row.acptRgstDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", acptRgstDt);
            },
          },
          {
           title: this.$t("m.i.common.acptRgstStatus"),
            key: 'acptRgstStatus',

            hiddenCol: false,
            render: (h, params) => {
              let key = "";
              let dictValue = getDictValueFromMap(this.dictMap,"AcptRgstStatus",params.row.acptRgstStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);

            },
          },
          {
           title: this.$t("m.i.common.imgStatus"),
            key: 'imgStatus',

            hiddenCol: false,
            render: (h, params) => {
              let key = "";
              if(params.row.imgStatus == null || params.row.imgStatus === "" || params.row.imgStatus === "BTL13" || params.row.imgStatus === "BTL20"){
                key = "0";
              } else if(params.row.imgStatus == "BTL03" || params.row.imgStatus == "BTL05" || params.row.imgStatus === "BTL01"){
                key = "1";
              } else if(params.row.imgStatus == "BTL04"){
                key = "2";
              }
              let dictValue = getDictValueFromMap(this.dictMap,"ImgMainStatus",key);
              return h("span", {domProps: {title: dictValue}}, dictValue);

            },
          },
          {
            title: this.$t("m.i.common.acptImg"),
            key: '',

            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
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
                      this.openImgWin(params.row.id,params.row.billNo)
                    }
                  }
                }, '维护')
              ]);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: 'billType',

            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: 'billNo',
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
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
                      this.showBillInfo(params.row.billId)
                    }
                  }
                }, params.row.billNo)
              ]);
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
            title: this.$t("m.i.billInfo.remitDt"),
            key: 'openDt',
            render: (h, params) => {
              if(params.row.openDt == null || params.row.openDt === ""){
                return "";
              }
              let remitDt = this.$moment(params.row.openDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            },
            hiddenCol: false,
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
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dueDt);
            },
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
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrBankNo"),
            key: 'drwrBankNo',
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drwrBankName"),
            key: 'drwrBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: 'pyeeAcctNo',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeBankName"),
            key: 'pyeeBankName',
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: 'acptName',
            hiddenCol: false,
            sortable: true,
          },
          {
           title: this.$t("m.i.billInfo.acptAcctNo"),
            key: 'acptAcctNo',
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.acptDt"),
            key: 'acptDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.acptDt == null || params.row.acptDt === ""){
                return "";
              }
              let acptDt = this.$moment(params.row.acptDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", acptDt);
            }
          },
          {
           title: this.$t("m.i.billInfo.acptBankNo"),
            key: 'acptBankNo',
            hiddenCol: false
          },
          {
           title: this.$t("m.i.billInfo.drweBankNo"),
            key: 'drweBankNo',
            hiddenCol: false
          },
          /*{
            title: this.$t("m.i.billInfo.dataSource"),
            key: 'isInnerChannel',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap,"Yon",params.row.isInnerChannel);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          }*/
        ],
        submitFlag: false,
        type: "",
        currentSelectList: [],
        currentSelectRow: [],
        acptRegisterAddWin: false,
        billNoRule: [{ test: this.validBillNo, trigger: "blur" }],
        sosCodeRule: [{test: this.validSosCode, trigger:'blur'}],
        dueDtRule: [{test: this.validDueDt, trigger:'blur'}],
        billMoneyRule: [{ test: this.validBillMoney, trigger: "blur", }],
        pyeeSosCode:  [{test: this.validPyeeSosCode, trigger:'blur'}],
        acptRemarkCode: [{test: this.validAcptRemarkCode, trigger:'blur'}],
        bankNoRule: [{ test: /^[0-9]{12}$/, trigger: "blur", message: "请输入12位数字的行号" }],
        isList: [],
        corpScaleList: [],
        areaList: [],
        industryCategoryList: [],
        dictMap: new Map(),
        workDate: null,
        remitDtOptions: {
          disabledDate (date) {
            return date && date.valueOf() > _that.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
          }
        },
        dueOptions: {
          disabledDate (date) {
            let workDt = window.sessionStorage.getItem("workDate");
            if(acptRegisterAddForm.openDt != null && acptRegisterAddForm.openDt != '' && acptRegisterAddForm.openDt != 0){
              return date && (date.valueOf() < _that.$moment(workDt, "YYYYMMDD") || date.valueOf() > _that.$moment(acptRegisterAddForm.openDt, "YYYYMMDD").add(6,"months") );
            } else {
              return date && (date.valueOf() < _that.$moment(workDt, "YYYYMMDD") );
            }
          }
        },
        acptOptions: {
          disabledDate (date) {
            if(acptRegisterAddForm.openDt != null && acptRegisterAddForm.openDt != '' && acptRegisterAddForm.openDt != 0) {
              return date && (date.valueOf() > _that.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD") || date.valueOf() <  _that.$moment(acptRegisterAddForm.openDt, "YYYYMMDD"));
            } else {
              return date && date.valueOf() > _that.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD");
            }
          }
        },
        showUploadImageWin: false,
        showImageform: {
          id:"",
          imgType:"IM01",
          imgTypeList:[],
          imageUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_pageQueryAcptRgstImg", //查询可查看影像url
          imageUploadUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_loadImgFileAndSave", //影像上传url
          imageRegisterUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_sendAcptImgMsg", //影像登记url
          imageDeleteUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_deleteAcptImg", //影像删除url
          imgShowUrl:"/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_showAcptImg?id=", //查看影像url
          busiType:"RI02",
          listId:"",
          billNo:""
        },
        queryType: "",
        importWin: false,
        fileParams: {
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_importAcptCorpBillInfo",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_submitExcelData",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
          columns: [
            {
              type: "radio",
              title: " ",
              width: 60,
              align: "center",
              hiddenCol: false
            },
            {
              type: "index",
              title: this.$t("m.i.common.index"),
              width: 60,
              align: "center"
            },
            {
              title: this.$t("m.i.billInfo.billType"),
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
              title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              hiddenCol: false,
              sortable: true
            },
            {
              title: this.$t("m.i.billInfo.billMoney"),
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
              title: this.$t("m.i.billInfo.remitDt"),
              key: "openDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.openDt == null ? "" : this.$moment(params.row.openDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.dueDt"),
              key: "dueDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },

            {
              title: this.$t("m.i.billInfo.drwrName"),
              key: "drwrName",
              hiddenCol: false,
              ellipsis: false,
              sortable: true
            },
            {
              title: this.$t("m.i.billInfo.drwrAcctNo"),
              key: "drwrAcctNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drwrSocCode"),
              key: "drwrSocCode",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drwrIndustry"),
              key: "drwrIndustry",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Industry", params.row.drwrIndustry);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.drwrCorpScale"),
              key: "drwrCorpScale",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "CorpScale", params.row.drwrCorpScale);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.isDrwrArc"),
              key: "isDrwrArc",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isDrwrArc);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              },
            },
            {
              title: this.$t("m.i.billInfo.drwrBankNo"),
              key: "drwrBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drwrBankName"),
              key: "drwrBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drwrArea"),
              key: "drwrArea",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Province", params.row.drwrArea);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t("m.i.billInfo.isDrwrGrn"),
              key: "isDrwrGrn",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "Yon", params.row.isDrwrGrn);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }

            },
            {
             title: this.$t("m.i.billInfo.pyeeName"),
              key: "pyeeName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeAcctNo"),
              key: "pyeeAcctNo",
              hiddenCol: false
            },
            {
             title: this.$t("m.i.billInfo.pyeeBankNo"),
              key: "pyeeBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeBankName"),
              key: "pyeeBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.pyeeSocCode"),
              key: "pyeeSocCode",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptName"),
              key: "acptName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptAcctNo"),
              key: "acptAcctNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptSocCode"),
              key: "acptSocCode",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptDt"),
              key: "acptDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                let date = params.row.acptDt == null ? "" : this.$moment(params.row.acptDt, "YYYY-MM-DD").format("YYYY-MM-DD");
                return h("span", date);
              }
            },
            {
              title: this.$t("m.i.billInfo.acptBankNo"),
              key: "acptBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drweBankNo"),
              key: "drweBankNo",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.common.remark"),
              key: "acptRemark",
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.acptBankName"),
              key: "acptBankName",
              sortable: true,
              hiddenCol: false
            },
            {
              title: this.$t("m.i.billInfo.drweBankName"),
              key: "drweBankName",
              sortable: true,
              hiddenCol: false
            }

          ],
          paramKey:"list"         //后台接收对应key
        },
        billId: '',
        showBrchType: "",
        showHvpsBankType: "",
        memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
        showBillInfoWin: false,
        showCpesBranch: false,
        showHvpsBank: false,
        couldChangeDrwr: false,
        acptRgstStatusList : [],
      }
    },
    mounted() {
      this.workDate = window.sessionStorage.getItem("workDate");
      getDictListByGroups("CorpScale,Yon,Province,Industry,ImgMainStatus,DraftTypeCode,AcptRgstStatus").then(res => {
        this.corpScaleList = res.get("CorpScale");
        // 不需要这个，因为可选择的发起方，全部默认为企业
        this.isList = res.get("Yon");
        this.areaList = res.get("Province");
        this.acptRgstStatusList = res.get("AcptRgstStatus").filter(item => item.key === "BTA01" || item.key === "BTA06" || item.key === "BTA09");
        this.industryCategoryList = res.get("Industry");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      queryDrwrAcctList(){
        if(this.acptRegisterAddForm.drwrAcctNo !=="" && this.acptRegisterAddForm.drwrAcctNo != null){
          post({ drwrAcctNo : this.acptRegisterAddForm.drwrAcctNo}, "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_queryCustCorpByCustAcctNo").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              let list = res.data.retData;
              if (retCode === "000000") {
                if(null == list.socCode || list.socCode === ""){
                  this.$msgTip.info(this, { info: "出票人统一社会信用代码不能为空,请先维护客户信息" });
                  return;
                }else {
                  this.acptRegisterAddForm.drwrSocCode = list.socCode;
                }
                if(null == list.industryCategory || list.industryCategory === ""){
                  this.$msgTip.info(this, { info: "出票人行业分类不能为空,请先维护客户信息" });
                  return;
                }else {
                  this.acptRegisterAddForm.drwrIndustry = list.industryCategory;
                }
                if(null == list.corpScale || list.corpScale === ""){
                  this.$msgTip.info(this, { info: "出票人企业规模不能为空,请先维护客户信息" });
                  return;
                }else {
                  this.acptRegisterAddForm.drwrCorpScale = list.corpScale;
                }
                if(null == list.isArc || list.isArc === ""){
                  this.$msgTip.info(this, { info: "出票人是否涉农企业不能为空,请先维护客户信息" });
                  return;
                }else {
                  this.acptRegisterAddForm.isDrwrArc = list.isArc;
                }
                if(null == list.area || list.area === ""){
                  this.$msgTip.info(this, { info: "出票人地区不能为空,请先维护客户信息" });
                  return;
                }else {
                  this.acptRegisterAddForm.drwrArea = list.area;
                }
                if(null == list.isGreenCorp || list.isGreenCorp === ""){
                  this.$msgTip.info(this, { info: "出票人是否绿色企业不能为空,请先维护客户信息" });
                  return;
                }else {
                  this.acptRegisterAddForm.isDrwrGrn = list.isGreenCorp;
                }
                this.couldChangeDrwr = false;
              } else {
                this.acptRegisterAddForm.drwrSocCode = "";
                this.acptRegisterAddForm.drwrIndustry = "";
                this.acptRegisterAddForm.drwrCorpScale = "";
                this.acptRegisterAddForm.isDrwrArc = "";
                this.acptRegisterAddForm.drwrArea = "";
                this.acptRegisterAddForm.isDrwrGrn = "";
                this.couldChangeDrwr = true;
                //this.$msgTip.error(this, { info: msg });
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        }
      },
      validBillNo(rule, val, callback) {
        let re = /^[0-9]{3}0[0-9]{2}[6][0-9]{9}$/;
        if (re.test(val)) {
          callback();
        } else {
          callback(new Error("商票号码为16位数字,第四位为0,第七位为6"));
        }
      },
      validSosCode(rule,val,callback){
        let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"))
        }
      },
      validPyeeSosCode(rule,val,callback){
        if (val === null || val === '') {
          callback();
          return;
        }
        let re = /([a-zA-Z0-9]{2})([0-9]{6})([a-zA-Z0-9]{10})/;
        if(re.test(val)){
          callback()
        }else{
          callback(new Error("非法输入，社会信用代码由两位数字或字母，加六位数字，加十位数字或字母组成，且为18位"))
        }
      },
      validAcptRemarkCode(rule,val,callback) {
        if (val === null || val === '') {
          callback();
        } else {
          let value = val.toString();
          if (value.length > 150) {
            callback(new Error("备注字段输入不能超过150个文本"));
          } else {
            callback();
          }
        }
      },
      validDueDt(rule,val,callback){
        if(this.acptRegisterAddForm.openDt != null && this.acptRegisterAddForm.openDt != '' && this.acptRegisterAddForm.openDt != 0){
          if(this.$moment(this.acptRegisterAddForm.dueDt, "YYYYMMDD").subtract(6, "month") <= this.$moment(this.acptRegisterAddForm.openDt, "YYYYMMDD")){
            callback()
          } else {
            callback(new Error("非法输入，出票日期和票据到期日之间间隔不能超过六个月"))
          }
        } else {
          callback(new Error("请先输入出票日期"))
        }
      },
      validBillMoney(rule, val, callback) {
        let value = val.toString().replace(/,/g, "");
        let re = /^([1-9]\d{0,8}|0)([.]?|(\.\d{1,2})?)$/;
        if (re.test(value)) {
          if(value> 0 && value<=1000000){
            callback();
          }else{
            callback(new Error("票面金额应小于等于1,000,000.00、大于0.00"));
          }
        } else {
          callback(new Error("票据金额为大于等于0的不超过100万的数字，且小数位不超过两位"));
        }
      },
      //表单查询
      handleSearch() {
        this.currentSelectList = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      handleSelectClick(arr) {
        this.currentSelectList = arr;
      },

      //单笔新增
      singleAdd(str) {
        this.type = str;
        let list = this.$refs.datagrid.selects;
        this.isRequired = true;
        if (this.type === "modify") {
          if (list != null && list.length == 1) {
            this.acptRegisterAddWin = true;
            this.$nextTick(() => {
              let id = list[0].id;
              this.acptRegisterAddForm.id = list[0].id;
              this.acptRegisterAddForm.legalNo = list[0].legalNo;
              this.acptRegisterAddForm.billId = list[0].billId;
              this.acptRegisterAddForm.billNo = list[0].billNo;
              this.acptRegisterAddForm.acptStatus = list[0].acptStatus;
              this.acptRegisterAddForm.acptDt = this.$moment(list[0].acptDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.acptRegisterAddForm.acptName = list[0].acptName;
              this.acptRegisterAddForm.acptAcctNo = list[0].acptAcctNo;
              this.acptRegisterAddForm.acptBankNo = list[0].acptBankNo;
              this.acptRegisterAddForm.acptBankName = list[0].acptBankName;
              this.acptRegisterAddForm.acptSocCode = list[0].acptSocCode;
              this.acptRegisterAddForm.acptRgstDt = list[0].acptRgstDt;
              this.acptRegisterAddForm.imgStatus = list[0].imgStatus;
              this.acptRegisterAddForm.billType = list[0].billType;
              this.acptRegisterAddForm.billMoney = list[0].billMoney;
              this.acptRegisterAddForm.openDt = this.$moment(list[0].openDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.acptRegisterAddForm.dueDt = this.$moment(list[0].dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              this.acptRegisterAddForm.drwrName = list[0].drwrName;
              this.acptRegisterAddForm.drwrAcctNo = list[0].drwrAcctNo;
              this.acptRegisterAddForm.drwrBankNo = list[0].drwrBankNo;
              this.acptRegisterAddForm.drwrBankName = list[0].drwrBankName;
              this.acptRegisterAddForm.drwrSocCode = list[0].drwrSocCode;
              this.acptRegisterAddForm.drwrIndustry = list[0].drwrIndustry;
              this.acptRegisterAddForm.drwrCorpScale = list[0].drwrCorpScale;
              this.acptRegisterAddForm.isDrwrArc = list[0].isDrwrArc;
              this.acptRegisterAddForm.drwrArea = list[0].drwrArea;
              this.acptRegisterAddForm.isDrwrGrn = list[0].isDrwrGrn;
              this.acptRegisterAddForm.pyeeName = list[0].pyeeName;
              this.acptRegisterAddForm.pyeeAcctNo = list[0].pyeeAcctNo;
              this.acptRegisterAddForm.pyeeBankNo = list[0].pyeeBankNo;
              this.acptRegisterAddForm.pyeeBankName = list[0].pyeeBankName;
              this.acptRegisterAddForm.pyeeSocCode = list[0].pyeeSocCode;
              this.acptRegisterAddForm.drweBankNo = list[0].drweBankNo;
              this.acptRegisterAddForm.drweBankName = list[0].drweBankName;
              this.acptRegisterAddForm.isInnerChannel = list[0].isInnerChannel;
              this.acptRegisterAddForm.acptRgstBrchNo = list[0].acptRgstBrchNo;
              this.acptRegisterAddForm.acptRgstStatus = list[0].acptRgstStatus;
              this.acptRegisterAddForm.acptApplTellerNo = list[0].acptApplTellerNo;
              this.acptRegisterAddForm.acptCheckTellerNo = list[0].acptCheckTellerNo;
              this.acptRegisterAddForm.acptMsgId = list[0].acptMsgId;
              this.acptRegisterAddForm.acptReturnCode = list[0].acptReturnCode;
              this.acptRegisterAddForm.acptErrorReason = list[0].acptErrorReason;
              this.acptRegisterAddForm.settleType = list[0].settleType;
              this.acptRegisterAddForm.paymentDt = list[0].paymentDt;
              this.acptRegisterAddForm.hldrName = list[0].hldrName;
              this.acptRegisterAddForm.hldrAcctNo = list[0].hldrAcctNo;
              this.acptRegisterAddForm.hldrBankNo = list[0].hldrBankNo;
              this.acptRegisterAddForm.hldrSocCode = list[0].hldrSocCode;
              this.acptRegisterAddForm.prsttnBankNo = list[0].prsttnBankNo;
              this.acptRegisterAddForm.acptSettleRgstBrchNo = list[0].acptSettleRgstBrchNo;
              this.acptRegisterAddForm.acptSettleRgstDt = list[0].acptSettleRgstDt;
              this.acptRegisterAddForm.acptSettleApplTellerNo = list[0].acptSettleApplTellerNo;
              this.acptRegisterAddForm.acptSettleCheckTellerNo = list[0].acptSettleCheckTellerNo;
              this.acptRegisterAddForm.acptSettleMsgId = list[0].acptSettleMsgId;
              this.acptRegisterAddForm.acptSettleReturnCode = list[0].acptSettleReturnCode;
              this.acptRegisterAddForm.acptSettleErrorReason = list[0].acptSettleErrorReason;
              this.acptRegisterAddForm.createBrchNo = list[0].createBrchNo;
              this.acptRegisterAddForm.cancelType = list[0].cancelType;
              this.acptRegisterAddForm.transplantFlag = list[0].transplantFlag;
              this.acptRegisterAddForm.createTime = list[0].createTime;
              this.acptRegisterAddForm.updateTime = list[0].updateTime;
              this.acptRegisterAddForm.acptRemark = list[0].acptRemark;
              this.acptRegisterAddForm.reserve1 = list[0].reserve1;
              this.acptRegisterAddForm.reserve2 = list[0].reserve2;
              this.acptRegisterAddForm.reserve3 = list[0].reserve3;
              this.acptRegisterAddForm.transId = list[0].transId;
              post({ drwrAcctNo : this.acptRegisterAddForm.drwrAcctNo}, "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_queryCustCorpByCustAcctNo").then(res => {
                if (res) {
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.couldChangeDrwr = false;
                  }else{
                    this.couldChangeDrwr = true;
                  }
                }
              });
            });
          } else if(list.length > 1){
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
        } else {
          this.acptRegisterAddWin = true;
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
      },
      //修改
      busiModify(str) {
        this.type = str;
      },
      //新增/修改弹窗
      //确定
      acptRegisterAddSubmit() {
        this.$refs["acptRegisterAddForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            let url = this.type === "modify" ? "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_update"
                                               : "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_add";
            this.acptRegisterAddForm.acptDt = this.$moment(this.acptRegisterAddForm.acptDt).format('YYYYMMDD')
            this.acptRegisterAddForm.dueDt = this.$moment(this.acptRegisterAddForm.dueDt).format('YYYYMMDD')
            this.acptRegisterAddForm.openDt = this.$moment(this.acptRegisterAddForm.openDt).format('YYYYMMDD')
            this.acptRegisterAddForm.acptRgstStatus = 'BTA01';
            post(this.acptRegisterAddForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.acptRegisterAddWin = false;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.$refs.datagrid.selects = [];
                  this.addFormReset();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //关闭
      acptRegisterAddWinClose() {
        this.acptRegisterAddWin = false;
        this.addFormReset();
      },
      //删除
      busiDelete() {
        debugger;
        let vv = this.$refs.datagrid.selects;
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //模板下载
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //批量导入
      batchImport() {
        this.importWin = true;
      },
      //提交复核
      submitRecheck() {
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length !== 0) {
          this.$hMsgBox.confirm({
            title: "确认",
            content: "确定提交复核吗？",
            onOk: () => {
              this.handleRecheck();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
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
        post({ ids: ids }, "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_applAcptCorp").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      addFormReset() {
        this.acptRegisterAddForm.id = "";
        this.acptRegisterAddForm.billId = "";
        this.acptRegisterAddForm.legalNo = null;
        this.acptRegisterAddForm.acptStatus = null;
        this.acptRegisterAddForm.acptRgstDt = null;
        this.acptRegisterAddForm.imgStatus = null;
        this.acptRegisterAddForm.isInnerChannel = null;
        this.acptRegisterAddForm.acptRgstBrchNo = null;
        this.acptRegisterAddForm.createBrchNo = null;
        this.acptRegisterAddForm.cancelType = null;
        this.$refs.acptRegisterAddForm.resetFields();
        this.acptRegisterAddForm.billType = "AC02";
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
        post({ ids: ids }, "/ce/acpt/outerBusiBill/busiAcptRegister/busiAcptRegisterApply/func_delete").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.$refs.datagrid.selects = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      queryObjById(id){
        post({id:id+""},"").then(res => {
          this.submitFlag = false;
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              // getset
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });

      },
      formatBillMoney(optType) {
        if (optType === "blur") {
          if (!isNaN(parseFloat(this.acptRegisterAddForm.billMoney)) && isFinite(this.acptRegisterAddForm.billMoney)) {
            this.acptRegisterAddForm.billMoney = this.acptRegisterAddForm.billMoney == null ? "0.00" : formatNumber(this.acptRegisterAddForm.billMoney, 2, ",");
          }
        } else if (optType === "focus") {
          this.acptRegisterAddForm.billMoney = this.acptRegisterAddForm.billMoney.toString().replace(/,/g, "");
        }
      },
      //影像维护
      openImgWin(str,billNo) {
        this.showImageform.id = str;
        this.showImageform.listId=str
        this.showImageform.billNo = billNo;
        this.queryType = 'add';
        this.showImageform.imgTypeList.push({key: 'IM01', value: '承兑正面'});
        this.showUploadImageWin = true;
      },
      //影像维护关闭
      uploadImageWinClose() {
        this.showUploadImageWin = false;
        this.showImageform.imgTypeList = [];
        this.handleSearch();
      },
      handleAcptDtChange(value){
        if(!!this.formItem.acptDt){
          this.formItem.acptDt = this.$moment(this.formItem.acptDt).format("YYYYMMDD");
        }
      },
      importWinClose() {
        this.importWin = false;
      },
      importSuccess() {
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },

      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      clearVal(type){
        if(type === "acpt"){
          this.acptRegisterAddForm.acptBankNo = "";
          this.acptRegisterAddForm.acptBankName = "";
        }
        if(type === "drwe"){
          this.acptRegisterAddForm.drweBankNo = "";
          this.acptRegisterAddForm.drweBankName = "";
        }
        if(type === "pyee"){
          this.acptRegisterAddForm.pyeeBankNo = "";
          this.acptRegisterAddForm.pyeeBankName = "";
        }
        if(type === "drwr"){
          this.acptRegisterAddForm.drwrBankNo = "";
          this.acptRegisterAddForm.drwrBankName = "";
        }
      },
      queryBranchCode(type){
        this.showBrchType = type;
        this.showCpesBranch = true;
      },
      showCpesBranchClose() {
        this.showCpesBranch = false;
      },
      //根据弹框所选数据进行赋值
      showCpesBranchSubmit(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        if(this.showBrchType === "acpt"){
          this.acptRegisterAddForm.acptBankNo = info.transBrchBankNo;
          this.acptRegisterAddForm.acptBankName = info.brchFullNameZh;
        }
        if(this.showBrchType === "drwe"){
          this.acptRegisterAddForm.drweBankNo = info.transBrchBankNo;
          this.acptRegisterAddForm.drweBankName = info.brchFullNameZh;
        }
        this.showCpesBranch = false;
      },
      queryHvpsBank(type){
        this.showHvpsBankType = type;
        this.showHvpsBank = true;
      },
      showHvpsBankClose(){
        this.showHvpsBank = false;
      },
      showHvpsBankSubmit(info){
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        if(this.showHvpsBankType === "pyee"){
          this.acptRegisterAddForm.pyeeBankNo = info.actorBrchBankNo;
          this.acptRegisterAddForm.pyeeBankName = info.actorBrchName;
        }
        if(this.showHvpsBankType === "drwr"){
          this.acptRegisterAddForm.drwrBankNo = info.actorBrchBankNo;
          this.acptRegisterAddForm.drwrBankName = info.actorBrchName;
        }
        this.showHvpsBank = false;
      },
      changeHvpsBankNo(change, type){
        let bankNo = "";
        if(type === "pyee"){
          bankNo = this.acptRegisterAddForm.pyeeBankNo;
        }
        if(type === "drwr"){
          bankNo = this.acptRegisterAddForm.drwrBankNo;
        }
        if(bankNo === ""){
          if(type === "pyee"){
            this.acptRegisterAddForm.pyeeBankName = "";
          }
          if(type === "drwr"){
            this.acptRegisterAddForm.drwrBankName = "";
          }
          return ;
        }
        if(bankNo.length !== 12){
          return ;
        }
        post({bankNo: bankNo},"/shcpe/cpes/hvpsbank/hvpsBank/func_queryHvpsBankByBankNo").then(res => {
          if(res){
            let retCode = res.data.retCode;
            let retData = res.data.retData;
            if(retCode=="000000" && retData){
              if(type === "pyee"){
                this.acptRegisterAddForm.pyeeBankName = retData.actorBrchName;
              }
              if(type === "drwr"){
                this.acptRegisterAddForm.drwrBankName = info.actorBrchName;
              }
            }else{
              if(type === "pyee"){
                this.acptRegisterAddForm.pyeeBankName = "";
              }
              if(type === "drwr"){
                this.acptRegisterAddForm.drwrBankName = "";
              }
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
