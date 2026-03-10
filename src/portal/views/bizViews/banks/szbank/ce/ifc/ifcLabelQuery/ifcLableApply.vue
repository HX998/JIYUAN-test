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
          <h-datagrid :columns="supplColumns"
                      url="/be/market/ifclabel/ifcLableApply/func_queryIfcLableApplyInfo"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="singleAdd('add')">{{$t('m.i.common.add')}}</h-button>
              <h-button type="primary" @click="singleAdd('modify')">{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="busiDelete">{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="submitRecheck">{{$t('m.i.common.submit')}}</h-button>
              <!-- <h-button type="primary" @click="exportByExcel">{{$t('m.i.common.batchImport')}}</h-button>
              <h-button type="primary" @click="templateDownload">{{$t('m.i.common.templateDownload')}}</h-button>
              <h-button type="primary" @click="returnTo">{{$t('m.i.common.returnTo')}}</h-button> -->
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 五篇大文章标签报送界面 -->
    <h-msg-box v-model="addOrEditWin" width="600" @on-close="addOrEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="addOrEditType==='add'">五篇大文章标签报送信息</span>
        <span v-if="addOrEditType==='modify'">修改五篇大文章标签报送信息</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">

          <h-form-item :label="$t('m.i.common.messageType')" prop="messageType" required>
            <h-select v-model="addOrEditForm.messageType" :clearable="false" placeholder=""
                      :readonly="addOrEditType==='modify'">
              <h-option value="CP01">承兑环节</h-option>
              <h-option value="CP02">贴现环节</h-option>
            </h-select>
          </h-form-item>

          <h-form-item prop="billNo" :label="$t('m.i.billInfo.billPackageNo')" :validRules="billNoRule" required>
            <div style="display: inline-block;width:80%">
              <h-input v-model="addOrEditForm.billNo" :maxlength="30" placeholder="" @on-change="changeBillNo"
                       @on-blur="formatBillNo" :readonly="addOrEditType==='modify'"></h-input>
            </div>
              <h-button v-if="addOrEditType==='add'" type="primary" @click="billNoImport()">
                {{$t("m.i.common.import")}}
              </h-button>
          </h-form-item>
          <!-- 贴现子票区间 -->
          <bill-range :formItem="addOrEditForm" :rangeProps="['billRangeStart','billRangeEnd']"
                      :label="$t('m.i.billInfo.discBillRange')"
                      required :readonly="addOrEditType==='modify'" @on-change="changeBillRange"
                      v-if="addOrEditForm.messageType==='CP02'&&(addOrEditForm.billOrigin==='CS02'||addOrEditForm.billOrigin==='CS03')">
          </bill-range>
        <!-- 子票区间 -->
          <bill-range :label="$t('m.i.billInfo.billRange')" :formItem="addOrEditForm"
                      :rangeProps="['registerBillRangeStart','registerBillRangeEnd']" required
                      readonly v-if="addOrEditForm.billOrigin==='CS02'||addOrEditForm.billOrigin==='CS03'">
          </bill-range>
          <h-form-item prop="registerBillMoney" :label="$t('m.i.billInfo.billPackageMoney')" required>
            <h-typefield v-model="addOrEditForm.registerBillMoney" :maxlength="20" placeholder="" bigTips
                         @on-change="changeRegisterBillMoney"
                         :readonly="addOrEditForm.isAcpt&&addOrEditForm.isAcpt==='1'||!addOrEditForm.registerBillRangeStart||addOrEditForm.registerBillRangeStart==='0'||!addOrEditForm.msgType||addOrEditForm.msgType==='IFC01'"></h-typefield>
          </h-form-item>
          <!-- 票据来源 -->
          <common-select :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                         v-model="addOrEditForm.billOrigin" :dictList="billOriginList" required readonly = "true">
                         </common-select>

          <h-form-item prop="remitDt" :label="$t('m.i.billInfo.remitDt')" required>
            <h-date-picker v-model="addOrEditForm.remitDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           placeholder="" readonly></h-date-picker>
          </h-form-item>
          <h-form-item prop="dueDt" :label="$t('m.i.billInfo.dueDt')" required>
            <h-date-picker v-model="addOrEditForm.dueDt" type="date" showFormat :editable=false format="yyyy-MM-dd"
                           placeholder="" readonly></h-date-picker>
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
                      :readonly="isReadOnly||isGreenCorpReadOnly">
            <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.labelTechRelated')" prop="labelTechRelated" required>
            <h-select v-model="addOrEditForm.labelTechRelated" :maxlength=60 placeholder=""
                      :readonly="isReadOnly||isPrivateCorpReadOnly">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.labelGreen')" prop="labelGreen" required>
                      <h-select v-model="addOrEditForm.labelGreen" :maxlength=60 placeholder=""
                                :readonly="isReadOnly||labelGreenReadOnly">
                        <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                      </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.labelInclusive')" prop="labelInclusive" required>
                      <h-select v-model="addOrEditForm.labelInclusive" :maxlength=60 placeholder=""
                                :readonly="isReadOnly||labelInclusiveReadOnly">
                        <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                      </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.labelNumber')" prop="labelNumber" required>
                      <h-select v-model="addOrEditForm.labelNumber" :maxlength=60 placeholder=""
                                :readonly="isReadOnly||labelNumberReadOnly">
                        <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                      </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.labelElderCare')" prop="labelElderCare" required>
                      <h-select v-model="addOrEditForm.labelElderCare" :maxlength=60 placeholder=""
                                :readonly="isReadOnly||labelElderCareReadOnly">
                        <h-option v-for="item in isList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                      </h-select>
           </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="addOrEditWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>

    <!-- 批量导入弹出框-->
    <h-msg-box title="批量导入" v-model="importWin" height="150" :footerHide="true" :maximize="true" :mask-closable="false">
      <h-upload :action="uploadUrl"
                :format="['xls','xlsx']"
                :max-size="2048"
                :with-credentials="true"
                :on-progress="handleProgress"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-format-error="handleFormatError"
                :on-preview="clickLink"
                :on-remove="handleRemove"
                @on-goto-add="selectData"
                ref="upload"
                selfConfig
                uploadAll
                :class="{'h-upload-goto-add': selectDataFirst}">
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="importSelect">
          {{$t("m.i.common.chooseImportFile")}}
        </h-button>
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="postFile" v-if="!importSelect">
          {{$t("m.i.common.submit")}}
        </h-button>
      </h-upload>
    </h-msg-box>
    <!-- 查看票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"
                    :billNo="this.billNo" :billRangeStart="billRangeStart"
                    :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
import {post, getDictListByGroups, getDictValueFromMap, formatNumber, getConnectMode,accDiv} from "@/api/bizApi/commonUtil";

  export default {
    name: "rediscSupplRegistApply",
    components: {},
    data() {
      return {
        mode:'1',
        importSelect: true,
        isMsgTypeReadOnly: false,
        isReadOnly: false,
        corpScaleReadOnly: false,
        industryCategoryReadOnly: false,
        isArcReadOnly: false,
        isGreenCorpReadOnly: false,
        isPrivateCorpReadOnly: false,
        isBrchTypeReadOnly: false,
        dueDt: [],
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
        reportStatusList: [],
        messageTypeList: [],
        industryCategoryList: [],
        corpScaleList: [],
        billOriginList: [],
        ifShowMore: false,
        selectDataFirst: false,
        uploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/market/rediscount/rediscSupplRegistApply/func_importRediscountSupplInfo",
        formItem: {
          billNo: '',
          minRegisterBillMoney: "",
          maxRegisterBillMoney: "",
          minDueDate: "",
          maxDueDate: "",
          billOrigin:"",
          minRegisterBillRangeStart:"",
          maxRegisterBillRangeEnd:""
        },
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
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: 'billNo',
            hiddenCol: false,
            sortable: true
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
            key: "reportStatus",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = getDictValueFromMap(this.dictMap, "ReportStatusClass", params.row.reportStatus);
              return h("span", {domProps: {title: dictValue}}, dictValue);
            }
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
        addOrEditType: '',
        addOrEditWin: false,
        ifNotFirst: false,
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
        billNoRule: [{test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字"}],

        //导入
        importWin: false,
        fileParams: {
          //导入excel数据解析接口
          loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptGuarntrRgst/acptGuarntrRgstApply/analysisExcelData",
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/ce/cpesrgst/acptGuarntrRgst/acptGuarntrRgstApply/func_saveExcelData",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段
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
              title: this.$t("m.i.billInfo.billPackageMoney"),
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
              title: this.$t('m.i.billInfo.remitDt'),
              key: "remitDt",
              hiddenCol: false,
              sortable: true,
              render: (h, params) => {
                return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
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
              title: this.$t('m.i.common.corpScale'),
              key: "corpScale",
              hiddenCol: false,
              render: (h, params) => {
                let list = getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpScale);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
            },
            {
              title: this.$t('m.i.common.industryCategory'),
              key: "industryCategory",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = getDictValueFromMap(this.dictMap, "Industry", params.row.industryCategory);
                return h("span", {domProps: {title: dictValue}}, dictValue);
              }
            },
            {
              title: this.$t('m.i.common.isArc'),
              key: "isArc",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isArc);
                return h("span", {domProps: {title: dictValue}}, dictValue);
              }
            },
            {
              title: this.$t('m.i.common.isGreenCorp'),
              key: "isGreenCorp",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp);
                return h("span", {domProps: {title: dictValue}}, dictValue);
              }
            },
            {
              title: this.$t('m.i.common.isPrivateCorp'),
              key: "isPrivateCorp",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = getDictValueFromMap(this.dictMap, "Yon", params.row.isPrivateCorp);
                return h("span", {domProps: {title: dictValue}}, dictValue);
              }
            },
            {
              title: this.$t('m.i.be.applStatus'),
              key: "aplStatus",
              hiddenCol: false,
              render: (h, params) => {
                let dictValue = getDictValueFromMap(this.dictMap, "RediscSupplStatus", params.row.aplStatus);
                return h("span", {domProps: {title: dictValue}}, dictValue);
              }
            },
            {
              title: this.$t('m.i.be.brchType'),
              key: "brchType",
              hiddenCol: false,
              render: (h, params) => {
                let result = "";
                if (params.row.brchType === "1") {
                  result = "贴现行";
                } else if (params.row.brchType === "2") {
                  result = "出票人开户行";
                }
                return h("span",
                  {
                    domProps: {
                      title: result
                    }
                  }, result);
              }
            },

            {
              title: this.$t('m.i.be.dealPrcMsg'),
              key: "reason",
              hiddenCol: false,
            }
          ]
        },

      }
    },
    created()
    {
      // 获取是对接模式还是直连模式.
      getConnectMode().then(res => {
        this.mode = res;
      })
    },
    mounted() {
      getDictListByGroups("DraftTypeCode,CDMedia,DraftTypeCode,Yon,RediscSupplStatus,CorpScale,Industry,AcptRgstStatus,BillOrigin,ReportStatusClass,MessageTypeClass").then(res => {
        this.cdMediaList = res.get("CDMedia");
        this.billTypeList = res.get("DraftTypeCode");
        this.corpScaleList = res.get("CorpScale");
        this.industryCategoryList = res.get("Industry");
        this.billOriginList = res.get("BillOrigin");
        this.reportStatusList = res.get("ReportStatusClass");
        this.messageTypeList = res.get("MessageTypeClass");
        this.isList = res.get("Yon");
        this.dictMap = res.get("map");
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
      handleDueDtChange(arr) {
        if (arr && arr.length === 2) {
          this.formItem.minDueDate = arr[0].replace(/-/g, "");
          this.formItem.maxDueDate = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
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
        this.dueDt = [];
        this.formItem.minDueDate = "";
        this.formItem.maxDueDate = "";
        this.formItem.minRegisterBillMoney = "";
        this.formItem.maxRegisterBillMoney = "";
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
        post({code: ids}, "/be/market/ifclabel/ifcLableApply/func_deleteLableInfo").then(res => {
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
        post({code: ids}, "/be/market/ifclabel/ifcLableApply/func_submitIfcLableInfo").then(res => {
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
        this.ifNotFirst=false;
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
        this.isPrivateCorpReadOnly = false;
        // 对接使用截止
        this.isBrchTypeReadOnly = false;
      },
      //单笔新增、修改
      singleAdd(type) {
        this.ifNotFirst=false;
        this.addOrEditType = type;
        if (this.addOrEditType === "modify") {
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

        } else if (this.addOrEditType === "add") {
          this.addOrEditForm.brchType = "1";
          this.addOrEditWin = true;
          this.ifNotFirst=true;
        }
      },
      addFormReset() {
        this.addOrEditForm.billNo = "";
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
        this.addOrEditForm.msgType = "IFC01";
      },
      //提交
      addOrEditWinSubmit() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.addOrEditType === "add" ?
              "/be/market/ifclabel/ifcLableApply/func_addLableInfo" :
              "/be/market/ifclabel/ifcLableApply/func_updateLableInfo";
            this.addOrEditForm.dueDt = this.$moment(this.addOrEditForm.dueDt).format('YYYYMMDD');
            this.addOrEditForm.remitDt = this.$moment(this.addOrEditForm.remitDt).format('YYYYMMDD');
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
        if (this.addOrEditForm.brchType === "2") {
          this.addOrEditForm.msgType = "IFC02";
          this.isMsgTypeReadOnly = true;
        } else if (this.addOrEditForm.brchType === "1" && this.addOrEditType === "add") {
          this.isMsgTypeReadOnly = false;
        }
        if (this.addOrEditType === "add"&&this.ifNotFirst) {
          this.billRangeStart = "";
          this.billRangeEnd = "";
          this.changeMsgType();
        }
      },
      changeMsgType() {
        if (this.addOrEditType === "add"&&this.ifNotFirst) {
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
        if (this.addOrEditType === "add"&&this.ifNotFirst) {
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
            this.$msgTip.error(this, {info: this.$t("票据(包)金额" + this.addOrEditForm.registerBillMoney + "必须大于"
                + this.addOrEditForm.billMoney)});
            return;
          }
        }
      },

      changeBillNo() {
        if (this.addOrEditType === "add"&&this.ifNotFirst) {
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
              let messageType =  this.addOrEditForm.messageType;
              let mark = this.addOrEditForm.billNo.charAt(0);
              if(messageType == ''){
              this.$msgTip.error(this, {info: this.$t("请选择业务环节")});
              }
              if(mark === '6' && messageType === 'CP01'){
               this.$msgTip.error(this, {info: this.$t("请输入银票")});
              }
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
        let msgType = this.addOrEditForm.messageType;
        if(msgType === null || msgType === ""||  msgType === undefined){
           this.$msgTip.error(this, {info: this.$t("请选择业务环节")});
           return;
          }
        if (billNo === null || billNo === "" || billNo === undefined) {
          this.$msgTip.error(this, {info: this.$t("纸票16位，电票30位，请输入正确的票据(包)号码")});
          return;
        }

        if (msgType === 'CP02' && (this.addOrEditForm.billOrigin === 'CS02' || this.addOrEditForm.billOrigin === 'CS03')) {
          if (!this.addOrEditForm.billRangeStart) {
            this.$msgTip.error(this, {info: this.$t("金融机构票据或供应链票据，贴现子票区间起始不能为空")});
            return;
          }
        }
        post({
            billNo: billNo, billRangeStart: this.addOrEditForm.billRangeStart,
            billRangeEnd: this.addOrEditForm.billRangeEnd, messageType: msgType
          },
          "/be/market/ifclabel/ifcLableApply/func_getifcLableApplyByBillNo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
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

              this.addOrEditForm.labelGreenHave = res.data.retData.labelGreenHave;
              this.addOrEditForm.labelTechEntpHave = res.data.retData.labelTechEntpHave;
              this.addOrEditForm.labelElderCareHave = res.data.retData.labelElderCareHave;
              this.addOrEditForm.labelInclusiveHave = res.data.retData.labelInclusiveHave;
              this.addOrEditForm.labelNumberHave = res.data.retData.labelNumberHave;
              this.addOrEditForm.labelTechRelatedHave = res.data.retData.labelTechRelatedHave;
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
      isCorpReadOnly(str){
        if (str.length!==0){
          return true;
        }else {
          return false;
        }
      }
    }
  };
</script>
