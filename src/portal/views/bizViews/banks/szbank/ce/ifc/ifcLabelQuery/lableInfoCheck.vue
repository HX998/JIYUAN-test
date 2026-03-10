<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')">
                  <h-input v-model="formItem.billNo" placeholder="" :maxlength="30"></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :form-item="formItem" :range-props="['minRegisterBillRangeStart','maxRegisterBillRangeEnd']"></bill-range>
                <h-form-item :label="$t('m.i.billInfo.billPackageMoney')"  class="h-form-long-label">
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
                <h-form-item :label="$t('m.i.billInfo.dueDt')">
                  <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false
                                 @on-change="handleDueDtChange" placeholder=""></h-date-picker>
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
                      url="/be/market/ifclabel/ifcLableApply/func_queryLableApplyInfoCheck"
                      :bindForm="formItem"
                      :has-select="false"
                      :row-select="true"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recheckView" >{{$t('m.i.common.viewDatail')}}</h-button>
              <h-button type="primary" @click="recheckPass" >{{$t('m.i.common.pass')}}</h-button>
              <h-button type="primary" @click="recheckBack" >{{$t('m.i.common.back')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
     <!-- 五篇大文章标签报送界面 -->
        <h-msg-box v-model="addOrEditWin" width="600" @on-close="addOrEditWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>五篇大文章标签报送详情信息</span>
          </p>
          <div>
            <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">

              <h-form-item :label="$t('m.i.common.messageType')" prop="messageType" required>
                <h-select v-model="addOrEditForm.messageType" :clearable="false" placeholder=""
                          :readonly="true"">
                  <h-option value="CP01">承兑环节</h-option>
                  <h-option value="CP02">贴现环节</h-option>
                </h-select>
              </h-form-item>

              <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')" :validRules="billNoRule" required>
                <div style="display: inline-block;width:100%">
                  <h-input v-model="addOrEditForm.billNo" :maxlength="30" placeholder=""  :readonly="true"></h-input>
                </div>
              </h-form-item>
              <!-- 贴现子票区间 -->
              <bill-range :formItem="addOrEditForm" :rangeProps="['billRangeStart','billRangeEnd']"
                          :label="$t('m.i.billInfo.discBillRange')"
                          required :readonly="true")">
              </bill-range>
            <!-- 子票区间 -->
              <bill-range :label="$t('m.i.billInfo.billRange')" :formItem="addOrEditForm"
                          :rangeProps="['registerBillRangeStart','registerBillRangeEnd']" required
                          :readonly="true">
              </bill-range>
              <h-form-item prop="registerBillMoney" :label="$t('m.i.billInfo.billPackageMoney')" required>
                <h-typefield v-model="addOrEditForm.registerBillMoney" :maxlength="20" placeholder="" bigTips
                             :readonly="true"></h-typefield>
              </h-form-item>
              <!-- 票据来源 -->
              <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                             v-model="addOrEditForm.billOrigin" :dictList="billOriginList" required readonly = "true">
                             </common-select>

              <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
                <h-date-picker v-model="addOrEditForm.remitDt" type="date" :readonly="true" format="yyyy-MM-dd"
                               placeholder="" ></h-date-picker>
              </h-form-item>
              <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
                <h-date-picker v-model="addOrEditForm.dueDt" type="date" format="yyyy-MM-dd"
                               placeholder="" :readonly="true"></h-date-picker>
              </h-form-item>
              <h-form-item prop="labelTechEntpHave" :label="$t('m.i.common.labelTechEntpHave')"  required>
                <div style="display: inline-block;width:100%">
                  <h-input v-model="addOrEditForm.labelTechEntpHave" :maxlength="30" placeholder=""
                            :readonly="true"></h-input>
                </div>
              </h-form-item>
              <h-form-item prop="labelTechRelatedHave" :label="$t('m.i.common.labelTechRelatedHave')"  required>
                <div style="display: inline-block;width:100%">
                  <h-input v-model="addOrEditForm.labelTechRelatedHave" :maxlength="30" placeholder=""
                            :readonly="true"></h-input>
                </div>
              </h-form-item>
              <h-form-item prop="labelGreenHave" :label="$t('m.i.common.labelGreenHave')"  required>
                <div style="display: inline-block;width:100%">
                  <h-input v-model="addOrEditForm.labelGreenHave" :maxlength="30" placeholder=""
                            :readonly="true"></h-input>
                </div>
              </h-form-item>
              <h-form-item prop="labelInclusiveHave" :label="$t('m.i.common.labelInclusiveHave')"  required>
                <div style="display: inline-block;width:100%">
                  <h-input v-model="addOrEditForm.labelInclusiveHave" :maxlength="30" placeholder=""
                            :readonly="true"></h-input>
                </div>
              </h-form-item>
              <h-form-item prop="labelNumberHave" :label="$t('m.i.common.labelNumberHave')"  required>
                <div style="display: inline-block;width:100%">
                  <h-input v-model="addOrEditForm.labelNumberHave" :maxlength="30" placeholder=""
                            :readonly="true"></h-input>
                </div>
              </h-form-item>
              <h-form-item prop="labelElderCareHave" :label="$t('m.i.common.labelElderCareHave')"  required>
                  <div style="display: inline-block;width:100%">
                    <h-input v-model="addOrEditForm.labelElderCareHave" :maxlength="30" placeholder=""
                              :readonly="true"></h-input>
             </div>
             </h-form-item>
              <h-form-item :label="$t('m.i.common.labelTechEntp')" prop="labelTechEntp" required>
                <h-select v-model="addOrEditForm.labelTechEntp" :maxlength=60 placeholder=""
                          :readonly="true">
                <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.labelTechRelated')" prop="labelTechRelated" required>
                <h-select v-model="addOrEditForm.labelTechRelated" :maxlength=60 placeholder=""
                          :readonly="true">
                  <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.labelGreen')" prop="labelGreen" required>
                          <h-select v-model="addOrEditForm.labelGreen" :maxlength=60 placeholder=""
                                    :readonly="true">
                            <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                          </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.labelInclusive')" prop="labelInclusive" required>
                          <h-select v-model="addOrEditForm.labelInclusive" :maxlength=60 placeholder=""
                                    :readonly="true">
                            <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                          </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.labelNumber')" prop="labelNumber" required>
                          <h-select v-model="addOrEditForm.labelNumber" :maxlength=60 placeholder=""
                                    :readonly="true">
                            <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                          </h-select>
              </h-form-item>
              <h-form-item :label="$t('m.i.common.labelElderCare')" prop="labelElderCare" required>
                          <h-select v-model="addOrEditForm.labelElderCare" :maxlength=60 placeholder=""
                                    :readonly="true">
                            <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                          </h-select>
               </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
            </div>
          </div>
        </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap,formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "rediscSupplRegistCheck",
    components : {
    },
    data() {
      return {
        dueDt:[],
        //票面
        showBillInfoWin: false,
        billId: '',
        billNo: '',
        billRangeStart:'',
        billRangeEnd:'',
        //字典值
        dictMap: new Map(),
        billTypeList: [],
        billOriginList: [],
        reportStatusList: [],
        messageTypeList: [],
        formItem: {
          billNo: '',
          minRegisterBillMoney:"",
          maxRegisterBillMoney:"",
          minDueDate:"",
          maxDueDate:"",
          billOrigin:"",
          minRegisterBillRangeStart:"",
          maxRegisterBillRangeEnd:""
        },
        columns: [

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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
                          return h("a", {
                            on: {
                              click: () => {
                                this.showBillInfo(params.row.billId,params.row.billNo,
                                  params.row.billRangeStart?params.row.billRangeStart:params.row.registerBillRangeStart,
                                  params.row.billRangeEnd?params.row.billRangeEnd:params.row.registerBillRangeEnd);
                              }
                            }
                          }, params.row.billNo);
                        }
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'registerBillRange',
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = !params.row.registerBillRange ? '-' : params.row.registerBillRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
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
          {
            title: this.$t('m.i.common.messageType'),
            key: "messageType",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "MessageTypeClass", params.row.messageType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.labelTechEntp'),
            key: "labelTechEntp",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.labelTechEntp);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.labelTechRelated'),
            key: "labelTechRelated",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.labelTechRelated);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.labelGreen'),
            key: "labelGreen",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.labelGreen);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.labelInclusive'),
            key: "labelInclusive",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.labelInclusive);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
            title: this.$t('m.i.common.labelNumber'),
            key: "labelNumber",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.labelNumber);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
          },
          {
              title: this.$t('m.i.common.labelElderCare'),
              key: "labelElderCare",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.labelElderCare);
                return h("span", {domProps: {title: dictValue}}, dictValue);
              }
            },
          {
             title: this.$t('m.i.be.applStatus'),
             key: 'reportStatus',
             hiddenCol: false,
             render: (h, params) => {
               return h('div', [
                 h('span', params.row.reportStatus=='4'?'待复核':'--')
               ]);
             },
           },
          {
            title: this.$t('m.i.pc.applBrchName'),
            key: "branchName",
            hiddenCol: false,

          },
          {
            title: this.$t('m.i.be.dealPrcMsg'),
            key: "reason",
            hiddenCol: false,
          }
        ],
        addOrEditWin: false,
        addOrEditForm: {
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
                  dueDt: "",
                  remitDt: "",
                  labelGreen: "",
                  labelTechEntp: "",
                  labelElderCare: "",
                  labelInclusive: "",
                  labelNumber: "",
                  labelTechRelated: "",
                  sourceType: "",
                  registerBillRangeStart: "",
                  registerBillRangeEnd: "",
                  registerBillMoney: "",
                  originBillRangeStart: "",
                  originBillRangeEnd: "",
                  originBillMoney: "",
                  messageType: "",
                  custNo: "",
                  custName: "",
                  branchNo: "",
                  aplBankNo: "",
                  regBranchCode: "",
                },
      }
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,CDMedia,Yon,CorpScale,RediscSupplStatus,Industry,AcptRgstStatus,BillOrigin,ReportStatusClass,MessageTypeClass").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.cdMediaList = res.get("CDMedia");
        this.corpScaleList = res.get("CorpScale");
        this.industryCategoryList = res.get("Industry");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
        this.billOriginList = res.get("BillOrigin");
        this.reportStatusList = res.get("ReportStatusClass");
        this.messageTypeList = res.get("MessageTypeClass");
      });
    },
    methods: {
      handleRgstDtChange(value) {
        this.formItem.rgstDt = value.replace(/-/g, "");
      },
      handleDueDtChange(arr) {
        if(arr && arr.length === 2){
          this.formItem.minDueDate = arr[0].replace(/-/g, "");
          this.formItem.maxDueDate = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        }else{
          this.formItem.minDueDate = "";
          this.formItem.maxDueDate = "";
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
        this.dueDt=[];
        this.formItem.minDueDate = "";
        this.formItem.maxDueDate = "";
        this.formItem.minRegisterBillMoney = "";
        this.formItem.maxRegisterBillMoney = "";
        this.$refs.formItem.resetFields();
      },

      //票面
      showBillInfo(billId, billNo,billRangeStart,billRangeEnd) {
        this.billId = billId;
        this.billNo = billNo;
        this.billRangeStart=billRangeStart;
        this.billRangeEnd=billRangeEnd;
        this.showBillInfoWin = true;
      },
      billInfoWinClose() {
        this.billId = null;
        this.billNo = null;
        this.billRangeStart = null;
        this.billRangeEnd = null;
        this.showBillInfoWin = false;
      },
  //关闭
      addOrEditWinClose() {

        this.addOrEditWin = false;

      },

//单笔新增、修改
      recheckView() {
          let list = this.$refs.datagrid.selects;
          if (list.length === 0) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.chooseDataFirst")});
            return;
          }
          if (list.length > 1) {
            this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
            return;
          }
          let selectRow = list[0];
          let url = "/be/market/ifclabel/ifcLableApply/func_getIfcLableInfoById";
          post({id: selectRow.id}, url).then(res => {
            if (res && res.data) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$nextTick(() => {
                  let obj = res.data.retData;
                  this.addOrEditForm.id = obj.id;

                  this.addOrEditForm.billNo = obj.billNo;
                  this.addOrEditForm.billClass = res.data.retData.billClass;
                  this.addOrEditForm.billType = res.data.retData.billType;
                  this.addOrEditForm.billMoney = res.data.retData.billMoney;
                  this.addOrEditForm.stdAmt = res.data.retData.billMoney;
                  this.addOrEditForm.billOrigin = res.data.retData.billSource;
                  this.addOrEditForm.billRangeStart = res.data.retData.billRangeStart;
                  this.addOrEditForm.billRangeEnd = res.data.retData.billRangeEnd;
                  this.addOrEditForm.registerBillRangeStart = res.data.retData.billRangeStart;
                  this.addOrEditForm.registerBillRangeEnd = res.data.retData.billRangeEnd;
                  this.addOrEditForm.registerBillMoney = res.data.retData.registerBillMoney;
                  this.addOrEditForm.dueDt = this.$moment(res.data.retData.dueDt.toString(), "YYYY-MM-DD").format('YYYY-MM-DD');
                  this.addOrEditForm.remitDt = this.$moment(res.data.retData.remitDt.toString(), "YYYY-MM-DD").format('YYYY-MM-DD');
                  this.addOrEditForm.custNo = res.data.retData.custNo;
                  this.addOrEditForm.listid = res.data.retData.listid;
                  this.addOrEditForm.billId = res.data.retData.billId;
                  this.addOrEditForm.custName = res.data.retData.custName;
                  this.addOrEditForm.branchNo = res.data.retData.branchNo;
                  this.addOrEditForm.branchName = res.data.retData.branchName;
                  this.addOrEditForm.aplBankNo = res.data.retData.aplBankNo;
                  this.addOrEditForm.regBranchCode = res.data.retData.regBranchCode;
                  this.addOrEditForm.originBillRangeStart = res.data.retData.billRangeStart;
                  this.addOrEditForm.originBillRangeEnd = res.data.retData.billRangeEnd;
                  this.addOrEditForm.messageType = obj.messageType;
                  this.addOrEditForm.labelGreen = obj.labelGreen;
                  this.addOrEditForm.labelTechEntp = obj.labelTechEntp;
                  this.addOrEditForm.labelElderCare = obj.labelElderCare;
                  this.addOrEditForm.labelInclusive = obj.labelInclusive;
                  this.addOrEditForm.labelNumber = obj.labelNumber;
                  this.addOrEditForm.labelTechRelated = obj.labelTechRelated;
                  this.addOrEditForm.activeFlag = obj.activeFlag;
                  this.addOrEditForm.reportStatus = obj.reportStatus;
                  this.addOrEditForm.maintainFlag = obj.maintainFlag;

                  this.addOrEditForm.labelGreenHave = res.data.retData.labelGreenHave;
                  this.addOrEditForm.labelTechEntpHave = res.data.retData.labelTechEntpHave;
                  this.addOrEditForm.labelElderCareHave = res.data.retData.labelElderCareHave;
                  this.addOrEditForm.labelInclusiveHave = res.data.retData.labelInclusiveHave;
                  this.addOrEditForm.labelNumberHave = res.data.retData.labelNumberHave;
                  this.addOrEditForm.labelTechRelatedHave = res.data.retData.labelTechRelatedHave;

                  this.addOrEditWin = true;
                });
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            }
          }).catch(error => {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError") + error});
          });
      },

      //通过
      recheckPass() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定通过吗？",
          onOk: () => {
            this.handleReCheckPass();
          }
        });
      },
      handleReCheckPass() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ code : ids}, "/be/market/ifclabel/ifcLableApply/func_passIfcLableInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //驳回
      recheckBack() {
        if (this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定驳回吗？",
          onOk: () => {
            this.handleReCheckBack();
          }
        });
      },
      handleReCheckBack() {
        let list = this.$refs.datagrid.selects;
        let ids = "";
        for (let i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ code : ids}, "/be/market/ifclabel/ifcLableApply/func_rejectIfcLableInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.handleSearch();
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
