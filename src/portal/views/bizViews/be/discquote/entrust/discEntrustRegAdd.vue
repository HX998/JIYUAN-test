<!--贴现通挂牌-新增、修改弹出框-->
<template>
  <div>
    <h-msg-box v-model="tempDiscEntrustRegAddOrEditWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-search-layer" top="10" @on-maximize="onMaximize">
      <p slot="header">
        <span v-if="batchParams.batchType==='add'">新增申请单</span>
        <span v-else-if="batchParams.batchType==='modify'">修改申请单</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="3" class="h-form-search" onlyBlurRequire>
          <entrust-form-item :addForm="addOrEditForm" :batchParams="batchParams"></entrust-form-item>
        </h-form>
        <div style="text-align: right">
          <h-button type="primary" @click="formSave()">保存</h-button>
        </div>
        <!--数据展示表格-->
        <h-datagrid
          :columns="columns"
          highlight-row
          :auto-load="false"
          :url="dataGridUrl"
          :bindForm="dataGridFormItem"
          :has-select="false"
          :rowSelect="true"
          ref="datagrid">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="pickBill('add')">{{$t("m.i.common.billInput")}}</h-button>
            <h-button type="primary" @click="pickBill('modify')">{{$t("m.i.common.billModify")}}</h-button>
            <h-button type="primary" @click="deleteBill()">{{$t("m.i.common.billDelete")}}</h-button>
            <h-button type="primary" @click="importTemplate()">{{$t("m.i.common.templateDownload")}}</h-button>
            <h-button type="primary" @click="importPickBill()">{{$t("m.i.common.batchImport")}}</h-button>
            <h-button type="primary" @click="exportBill()">{{$t("m.i.common.exportExcel")}}</h-button>
            <h-button type="primary" @click="applySubmit()">{{$t("m.i.common.submitCheck")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <div slot="footer">
      </div>
    </h-msg-box>

    <!-- 票据信息界面 -->
    <h-msg-box v-model="billInputWin" width="800" @on-close="billInputWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>票据信息</span>
      </p>
      <div>
        <h-form :model="billInputForm" ref="billInputForm" class="bill-info-table">
          <h-row type="flex" justify="center" align="top">
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.billNo")}}</p>
            </h-col>
            <h-col span="19" class-name="info-item">
              <h-col span="16">
                <h-form-item prop="billNo" required onlyBlurRequire :validRules="billNoRule">
                  <h-input v-model="billInputForm.billNo" :maxlength="30" :disabled="pickBillType==='modify'"></h-input>
                </h-form-item>
              </h-col>
              <h-col span="8">
                <h-button class="export-btn" @click="importBill" v-if="pickBillType==='add'">{{$t("m.i.billInfo.importBill")}}</h-button>
              </h-col>
            </h-col>
          </h-row>
          <h-row type="flex" justify="center" align="top">
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.billType")}}</p>
            </h-col>
            <h-col span="7" class-name="info-item">
              <h-form-item prop="billType" required onlyBlurRequire>
                <h-select v-model="billInputForm.billType" placeholder="">
                  <h-option v-for="item in this.batchParams.billTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                </h-select>
              </h-form-item>
            </h-col>
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.billMoney")}}</p>
            </h-col>
            <h-col span="7" class-name="info-item">
              <common-type-field prop="billMoney" required="required" v-model="billInputForm.billMoney"
                                 :maxlength="20" placeholder="" bigTips onlyBlurRequire></common-type-field>
            </h-col>
          </h-row>
          <h-row type="flex" justify="center" align="top">
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.remitDt")}}</p>
            </h-col>
            <h-col span="7" class-name="info-item">
              <h-form-item prop="remitDt" required onlyBlurRequire>
                <h-date-picker type="date" v-model="billInputForm.remitDt" placeholder="" showFormat format="yyyy-MM-dd"
                               :editable=false></h-date-picker>
              </h-form-item>
            </h-col>
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.dueDt")}}</p>
            </h-col>
            <h-col span="7" class-name="info-item">
              <h-form-item prop="dueDt" required onlyBlurRequire>
                <h-date-picker type="date" v-model="billInputForm.dueDt" placeholder="" showFormat format="yyyy-MM-dd"
                               :editable=false></h-date-picker>
              </h-form-item>
            </h-col>
          </h-row>
          <h-row type="flex" justify="center" align="top">
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.drwrName")}}</p>
            </h-col>
            <h-col span="7" class-name="info-item">
              <h-form-item prop="drwrName" required onlyBlurRequire>
                <h-input v-model="billInputForm.drwrName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
            </h-col>
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.billInfo.acptName")}}</p>
            </h-col>
            <h-col span="7" class-name="info-item">
              <h-form-item prop="acptName" required onlyBlurRequire>
                <h-input v-model="billInputForm.acptName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
            </h-col>
          </h-row>
          <h-row type="flex" justify="center" align="top">
            <h-col span="5">
              <h-col span="10" class-name="info-item">
                <p class="label-multi label-multi-long-label"><span>{{$t("m.i.billInfo.acptBank")}}</span></p>
              </h-col>
              <h-col span="14">
                <h-col span="24" class-name="info-item">
                  <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.brchCode")}}</p>
                </h-col>
                <h-col span="24" class-name="info-item">
                  <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.bankNameShort")}}</p>
                </h-col>
                <h-col span="24" class-name="info-item">
                  <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.bankNo")}}</p>
                </h-col>
              </h-col>
            </h-col>
            <h-col span="7">
              <h-col span="24" class-name="info-item">
                <h-form-item prop="acptBrchCode" required onlyBlurRequire>
                  <h-input v-model="billInputForm.acptBrchCode" readonly icon="android-search"
                           @on-click="queryCpesBrchCode('acpt')"></h-input>
                </h-form-item>
              </h-col>
              <h-col span="24" class-name="info-item">
                <h-form-item prop="acptBankName" required onlyBlurRequire>
                  <h-input v-model="billInputForm.acptBankName" readonly></h-input>
                </h-form-item>
              </h-col>
              <h-col span="24" class-name="info-item">
                <h-form-item prop="acptBankNo" required onlyBlurRequire>
                  <h-input v-model="billInputForm.acptBankNo" readonly></h-input>
                </h-form-item>
              </h-col>
            </h-col>
            <h-col span="5">
              <h-col span="10" class-name="info-item">
                <p class="label-multi label-multi-long-label"><span>{{$t("m.i.be.discApplicant")}}</span></p>
              </h-col>
              <h-col span="14">
                <h-col span="24" class-name="info-item">
                  <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.acctNo")}}</p>
                </h-col>
                <h-col span="24" class-name="info-item">
                  <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.openBankNo")}}</p>
                </h-col>
                <h-col span="24" class-name="info-item">
                  <p class="label"><span class="required-icon">*</span>{{$t("m.i.common.openBankName")}}</p>
                </h-col>
              </h-col>
            </h-col>
            <h-col span="7">
              <h-col span="24" class-name="info-item">
                <h-form-item prop="discOutAcctNo" required onlyBlurRequire :validRules="acctNoRule">
                  <h-input v-model="billInputForm.discOutAcctNo" :maxlength="32"></h-input>
                </h-form-item>
              </h-col>
              <h-col span="24" class-name="info-item">
                <h-form-item prop="discOutBankNo" required onlyBlurRequire>
                  <h-input v-model="billInputForm.discOutBankNo" readonly icon="android-search"
                           @on-click="queryCpesBrchCode('discOut')"></h-input>
                </h-form-item>
              </h-col>
              <h-col span="24" class-name="info-item">
                <h-form-item prop="discOutBankName" required onlyBlurRequire>
                  <h-input v-model="billInputForm.discOutBankName" readonly></h-input>
                </h-form-item>
              </h-col>
            </h-col>
          </h-row>
          <h-row type="flex" justify="center" align="top">
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.be.entrustMaxRate")}}</p>
            </h-col>
            <h-col span="19" class-name="info-item">
              <h-form-item prop="entrustMaxRatePct" :validRules="entrustRateRule" required onlyBlurRequire>
                <h-input v-model="billInputForm.entrustMaxRatePct" placeholder="利率范围0~100" :maxlength=60></h-input>
              </h-form-item>
            </h-col>
          </h-row>
          <h-row type="flex" justify="center" align="top">
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.be.entrustDate")}}</p>
            </h-col>
            <h-col span="7" class-name="info-item">
              <h-form-item prop="entrustDt" required onlyBlurRequire>
                <h-date-picker type="date" v-model="billInputForm.entrustDt" placeholder="" showFormat format="yyyy-MM-dd"
                               :editable=false></h-date-picker>
              </h-form-item>
            </h-col>
            <h-col span="5" class-name="info-item">
              <p class="label"><span class="required-icon">*</span>{{$t("m.i.be.entrustEndDate")}}</p>
            </h-col>
            <h-col span="7" class-name="info-item">
              <h-form-item prop="entrustEndDt" required onlyBlurRequire>
                <h-date-picker type="date" v-model="billInputForm.entrustEndDt" placeholder="" showFormat format="yyyy-MM-dd"
                               :editable=false></h-date-picker>
              </h-form-item>
            </h-col>
          </h-row>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="billInputWinClose()">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="billInputWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>

    <!-- 票交机构弹出框 -->
    <show-cpes-branch :showCpesBranch="brchCodeWin" @showCpesBranchClose="brchCodeWinClose" :showMemberId="showMemberId"
                      @showCpesBranchSubmit="brchCodeChange" :memberId="memberId"></show-cpes-branch>
    <!-- 批量导入 -->
    <common-file-upload-no-show :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importSuccess="importSuccess"></common-file-upload-no-show>
    <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="showExcelTemplateWinClose"
                           :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param"
                           :rows="this.rows"></common-excel-download>
  </div>
</template>

<script>
  import { post, exportList, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "discEntrustRegAdd",
    components: {
      EntrustFormItem: () => import(/* webpackChunkName: "be/discquote/entrust/entrustFormItem"*/"@/views/bizViews/be/discquote/entrust/entrustFormItem"),
      ShowCpesBranch: () => import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`)
    },
    data() {
      return {
        dataGridUrl: "",
        batchId: "",
        memberId: "",
        tmpMemberId: "",
        showMemberId: false,
        addOrEditForm: {
          id: "",
          batchNo: "",
          brokerBrchCode: this.$store.getters.userInfo.brchCode,
          brokerBrchName: "",
          discCustName:"",
          discSocCode:"",
          totalNum:""
        },
        dataGridFormItem: {
          batchId: ""
        },
        billInputForm: {
          id: "",
          batchId: "",
          billNo: "",
          billType: "",
          billMoney: "",
          remitDt: "",
          dueDt: "",
          drwrName: "",
          acptName: "",
          acptBrchCode: "",
          acptBankName: "",
          acptBankNo: "",
          entrustDt: "",
          entrustMaxRatePct: "",
          entrustEndDt: "",
          discOutAcctNo: "",
          discOutBankNo: "",
          discOutBankName: ""
        },
        columns: [
          {
            type: "selection",
            width: 50,
            hiddenCol: false,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            align: "left",
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.batchParams.dictMap,"DraftTypeCode",params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: dictValue
                  }
                }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            hiddenCol: false,
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
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.remitDt ? this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.dueDt ? this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptName"),
            key: "acptName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBrchCode"),
            key: "acptBrchCode",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankName"),
            key: "acptBankName",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.be.entrustDate"),
            key: "entrustDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.entrustDt ? this.$moment(params.row.entrustDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.be.entrustMaxRate"),
            key: "entrustMaxRatePct",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.be.entrustEndDate"),
            key: "entrustEndDt",
            hiddenCol: false,
            render: (h, params) => {
              return h("span", params.row.entrustEndDt ? this.$moment(params.row.entrustEndDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");
            }
          },
          {
            title: this.$t("m.i.ce.discountApplyAcctNo"),
            key: "discOutAcctNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discOutBankNo"),
            key: "discOutBankNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.be.discOutBankName"),
            key: "discOutBankName",
            hiddenCol: false
          }
        ],
        entrustRateRule: [{
          test: /^(([1-9])?\d{1})(\.\d{1,4})?$/,
          trigger: "blur",
          message: "利率为0~100之间的数，小数位不超过4位"
        }],
        billNoRule : [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "请输入不超过30位字符的票号" }],
        acctNoRule : [{test: /^[a-zA-Z0-9]{1,32}$/, trigger: "blur", message: "账号由小于等于32位的数字或字母组成"}],
        pickBillWin: false,
        importWin:false,
        fileParams: {
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/be/discquote/entrust/discEntrustRegApplyMain/func_batchDiscEntrustBillReq",  //excel数据导入接口
          uploadParams: {//调用excel数据解析接口时附带的额外参数
            batchId: ""
          }
        },
        billInputWin: false,
        pickBillType: "add",
        showFileWin: false,
        brchCodeWin: false,
        cpesBranchType: "",
        tempShowExcelTemplateWin: false,
        param: "",
        rows: ""
      };
    },
    props: {
      addOrEditEntrustWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      batchParams: {
        type: Object,
        default: {}
      },
      exportUrl: {
        type: String,
        default() {
          return "/be/discquote/entrust/discEntrustRegApplyMain/func_exportDiscEntrustRegBill";
        }
      }
    },
    computed: {
      tempDiscEntrustRegAddOrEditWin: {
        get() {
          return this.addOrEditEntrustWin;
        },
        set() {
        }
      }
    },
    watch: {
      addOrEditEntrustWin(val) {
        if (val) {
          this.dataGridUrl = "/be/discquote/entrust/discEntrustRegApplyMain/func_queryDiscEntrustRegBillPage";
          this.$nextTick(() => {
            this.batchId = this.batchParams.batchId;
            this.dataGridFormItem.batchId=this.batchId;
            this.queryObjById();
            this.handleSearch();
          });
        }
      },
      batchId(val) {
        this.batchId = val;
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //根据批次Id查询批次信息
      queryObjById() {
        let params = { id: this.batchId };
        let url = "/be/discquote/entrust/discEntrustRegApplyMain/func_editDiscEntrustReg";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              let obj = res.data.retData;
              this.addOrEditForm.id = obj.id;
              this.addOrEditForm.batchNo = obj.batchNo;
              this.addOrEditForm.brokerBrchName = obj.brokerBrchName;
              this.addOrEditForm.brokerBrchCode = obj.brokerBrchCode;
              this.addOrEditForm.discCustName = obj.discCustName;
              this.addOrEditForm.discSocCode = obj.discSocCode;
              this.addOrEditForm.totalNum = obj.totalNum;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭弹窗
      handleClose() {
        this.$refs.addOrEditForm.resetFields();
        this.addOrEditForm.id = "";
        this.batchId = "";
        this.dataGridFormItem.batchId="";
        this.dataGridUrl ="";
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("addOrEditEntrustWinClose", "");
      },
      handleSearch(pageNo) {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(!!pageNo ? pageNo : 1);
      },
      //保存批次信息
      formSave() {
        this.saveBatch();
      },
      saveBatch(optType) {
        this.saveBatchFunc(res=>{
          if (optType) {
            this.triggerClickEvent(optType);
          }else{
            this.handleSearch();
            this.$msgTip.success(this);
          }
        });
      },
      saveBatchFunc(callback){
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = "/be/discquote/entrust/discEntrustRegApplyMain/func_addDiscEntrustRegBatch";
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.batchId = res.data.retData.id;
                  this.dataGridFormItem.batchId = res.data.retData.id;
                  this.addOrEditForm.id = res.data.retData.id;
                  this.queryObjById();
                  // this.handleSearch();
                  callback();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //按钮事件触发保存
      triggerClickEvent(optType) {
        if (optType === "pickBill") {//挑票
          this.pickBillCallBack();
        } else if (optType === "importPickBill") {//导入挑票
          this.importPickBillCallback();
        } else if (optType === "applySubmit") {//提交申请
          this.applySubmitCallback();
        }
      },
      //挑票
      pickBill(type) {
        this.pickBillType =type;
        this.saveBatch("pickBill");
      },
      pickBillCallBack() {
        if (this.batchId) {
          if("add"===this.pickBillType){
            this.billInputForm.batchId = this.batchId;
            this.queryEntrustBill(null);
          }else if("modify"===this.pickBillType){
            let list = this.$refs.datagrid.selects;
            if (list.length === 0) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
              return;
            }
            if (list.length > 1) {
              this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
              return;
            }
            let id = list[0].id;
            this.queryEntrustBill(id);
          }
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      queryEntrustBill(id) {
        let params = { id: id};
        let url = "/be/discquote/entrust/discEntrustRegApplyMain/func_discEntrustRegEditBill";
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.tmpMemberId = res.data.retData.memberId;
              if (id !== null) {
                let obj = res.data.retData;
                this.billInputForm.id =obj.id;
                this.billInputForm.batchId = obj.batchId;
                this.billInputForm.billNo = obj.billNo;
                this.billInputForm.billType = obj.billType;
                this.billInputForm.billMoney = obj.billMoney;
                this.billInputForm.remitDt = obj.remitDt === null ? "" : obj.remitDt.toString();
                this.billInputForm.dueDt = obj.dueDt === null ? "" : obj.dueDt.toString();
                this.billInputForm.drwrName = obj.drwrName;
                this.billInputForm.acptName = obj.acptName;
                this.billInputForm.acptBrchCode = obj.acptBrchCode;
                this.billInputForm.acptBankName = obj.acptBankName;
                this.billInputForm.acptBankNo = obj.acptBankNo;
                this.billInputForm.entrustDt = obj.entrustDt === null ? "" : obj.entrustDt.toString();
                this.billInputForm.entrustMaxRatePct = obj.entrustMaxRatePct;
                this.billInputForm.entrustEndDt = obj.entrustEndDt === null ? "" : obj.entrustEndDt.toString();
                this.billInputForm.discOutAcctNo = obj.discOutAcctNo;
                this.billInputForm.discOutBankNo = obj.discOutBankNo;
                this.billInputForm.discOutBankName = obj.discOutBankName;
                this.pickBillType = "modify";
              }
              this.billInputWin = true;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //导入挑票
      importPickBill() {
        this.saveBatch("importPickBill");
      },
      importPickBillCallback() {
        if (this.batchId) {
          this.fileParams.uploadParams.batchId = this.batchId;
          this.importWin = true;
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      importSuccess() {
        this.queryObjById();
        this.fileParams.uploadParams.batchId = "";
        this.importWin = false;
        this.$refs.datagrid.dataChange(1);
      },
      importWinClose() {
        this.queryObjById();
        this.handleSearch();
        this.importWin = false;
      },
      //提交申请
      applySubmit() {
        this.saveBatch("applySubmit");
      },
      applySubmitCallback() {
        if (this.batchId) {
          let params = { id: this.batchId };
          let url = "/be/discquote/entrust/discEntrustRegApplyMain/func_commitDiscEntrustRegApply";
          this.sendPost(params, url, res=>{
            this.handleClose();
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      //导入模板下载
      importTemplate() {
        let url = window.LOCAL_CONFIG.API_HOME + "/be/discquote/entrust/discEntrustRegApplyMain/func_download";
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "get");
        let input = document.createElement('input')
        input.type = 'text'
        input.name = 'modelType';
        input.value = "discEntrustRegBill";
        form.appendChild(input)
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      // 删除票据
      deleteBill() {
        if (this.batchId) {
          let list = this.$refs.datagrid.selectIds;
          if (list.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确认要删除吗?",
            onOk: () => {
              let params = { batchId: this.batchId, ids: list };
              let url = "/be/discquote/entrust/discEntrustRegApplyMain/func_deleteDiscEntrustRegBill";
              this.sendPost(params, url, res=>{
                this.queryObjById();
                this.handleSearch();
              });
            }
          });
        } else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      sendPost(params, url, callback) {
        post(params, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              callback();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showAttach() {
        if (this.batchId) {
          this.showFileWin = true;
        }else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      showFileWinClose() {
        this.showFileWin = false;
      },
      //票交机构弹出框
      queryCpesBrchCode(type) {
        this.cpesBranchType = type;
        if (this.cpesBranchType === "acpt") {
          this.memberId = "";
          this.showMemberId = true;
        } else if (this.cpesBranchType === "discOut") {
          this.memberId = this.tmpMemberId;
          this.showMemberId = false;
        }
        this.brchCodeWin = true;
      },
      //根据弹框所选数据进行赋值
      brchCodeChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        if (this.cpesBranchType === "acpt") {
          this.billInputForm.acptBrchCode = info.brchCode;
          this.billInputForm.acptBankName = info.brchFullNameZh;
          this.billInputForm.acptBankNo = info.transBrchBankNo;
          this.$refs.billInputForm.validateField('acptBrchCode');
          this.$refs.billInputForm.validateField('acptBankName');
          this.$refs.billInputForm.validateField('acptBankNo');
        } else if (this.cpesBranchType === "discOut") {
          this.billInputForm.discOutBankNo = info.transBrchBankNo;
          this.billInputForm.discOutBankName = info.brchFullNameZh;
          this.$refs.billInputForm.validateField('discOutBankNo');
          this.$refs.billInputForm.validateField('discOutBankName');
        }
        this.brchCodeWin = false;
      },
      //关闭查询票交机构窗口
      brchCodeWinClose() {
        this.brchCodeWin = false;
      },
      billInputWinClose() {
        this.$refs.billInputForm.resetFields();
        this.initInput("");
        this.billInputForm.batchId = "";
        this.billInputForm.entrustDt = "";
        this.billInputForm.entrustMaxRatePct = "";
        this.billInputForm.entrustEndDt = "";
        this.billInputForm.discOutAcctNo = "";
        this.billInputForm.discOutBankNo = "";
        this.billInputForm.discOutBankName = "";
        this.queryObjById();
        this.handleSearch();

        this.billInputWin = false;
      },
      billInputWinSubmit() {
        this.$refs["billInputForm"].validate(valid => {
          if (valid) {
            let url = "/be/discquote/entrust/discEntrustRegApplyMain/func_addDiscEntrustRegBill";
            let pageNo = this.billInputForm.id != null ? this.$refs.datagrid.pageInfo.pageNo : 1;
            this.billInputForm.remitDt = this.$moment(this.billInputForm.remitDt).format("YYYYMMDD");
            this.billInputForm.dueDt = this.$moment(this.billInputForm.dueDt).format("YYYYMMDD");
            this.billInputForm.entrustDt = this.$moment(this.billInputForm.entrustDt).format("YYYYMMDD");
            this.billInputForm.entrustEndDt = this.$moment(this.billInputForm.entrustEndDt).format("YYYYMMDD");
            post(this.billInputForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.billInputForm = {};
                  this.billInputWin = false;
                  this.queryObjById();
                  this.handleSearch(pageNo);
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

      exportBill() {
        if (this.batchId) {
          this.param = "discEntrustRegBillExport";
          if (this.$refs.datagrid.selectIds.length !== 0) {
            this.rows = this.$refs.datagrid.selectIds.length;
          } else {
            this.rows = this.$refs.datagrid.total;
          }
          this.tempShowExcelTemplateWin = true;
        }else {
          this.$msgTip.error(this, { info: "请先保存批次" });
        }
      },
      showExcelTemplateWinClose() {
        this.tempShowExcelTemplateWin = false;
      },
      exportList(field, exportType) {
        let url = window.LOCAL_CONFIG.API_HOME + this.exportUrl;
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            batchId: this.batchId,
            ids: this.$refs.datagrid.selectIds,
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = {
            batchId: this.batchId
          };
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, url, options);
      },

      initInput(billNo) {
        this.billInputForm.id = "";
        this.billInputForm.billNo = billNo;
        this.billInputForm.billType = "";
        this.billInputForm.billMoney = "";
        this.billInputForm.remitDt = "";
        this.billInputForm.dueDt = "";
        this.billInputForm.drwrName = "";
        this.billInputForm.acptName = "";
        this.billInputForm.acptBrchCode = "";
        this.billInputForm.acptBankName = "";
        this.billInputForm.acptBankNo = "";
      },
      importBill() {
        if (this.billInputForm.billNo === "") {
          this.$msgTip.info(this, { info: "请先输入票据号码" });
          return;
        }
        let billNo = this.billInputForm.billNo;
        if (billNo.length !== 30) {
          this.$msgTip.info(this, { info: "请输入30位的票据号码" });
          return;
        }
        post({billNo: billNo}, "/be/discquote/entrust/discEntrustRegApplyMain/func_queryBillInfo").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              let obj = res.data.retData;
              if (obj !== null) {
                this.billInputForm.billType = obj.billType;
                this.billInputForm.billMoney = obj.billMoney;
                this.billInputForm.remitDt = obj.remitDt === null ? "" : obj.remitDt.toString();
                this.billInputForm.dueDt = obj.dueDt === null ? "" : obj.dueDt.toString();
                this.billInputForm.drwrName = obj.drwrName;
                this.billInputForm.acptName = obj.acptName;
                this.billInputForm.acptBrchCode = obj.acptBrchCode;
                this.billInputForm.acptBankName = obj.acptBankName;
                this.billInputForm.acptBankNo = obj.acptBankNo;
                this.$refs.billInputForm.validateField('billType');
                this.$refs.billInputForm.validateField('billMoney');
                this.$refs.billInputForm.validateField('remitDt');
                this.$refs.billInputForm.validateField('dueDt');
                this.$refs.billInputForm.validateField('drwrName');
                this.$refs.billInputForm.validateField('acptName');
                this.$refs.billInputForm.validateField('acptBrchCode');
                this.$refs.billInputForm.validateField('acptBankName');
                this.$refs.billInputForm.validateField('acptBankNo');
              } else {
                this.initInput(billNo);
                this.$msgTip.info(this, { info: "未找到票号" + billNo + "的相关信息！" });
              }
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg});
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
