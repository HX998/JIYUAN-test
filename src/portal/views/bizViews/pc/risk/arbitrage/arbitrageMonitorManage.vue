<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.be.acptBankName')" prop="acptBankName">
                  <h-input v-model="formItem.acptBankName" :maxlength=60 placeholder="" clearable></h-input>
                </h-form-item>
                <h-form-item label="出票人名称" prop="drwrName">
                  <h-input v-model="formItem.drwrName" :maxlength=60 placeholder="" clearable></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.createDt')" prop="createDt">
                  <h-date-picker :value="createDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleCreateDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item label="有效期开始日" prop="minEffectiveBeginDt">
                  <h-date-picker :value="effectiveBeginDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleEffectiveBeginDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item label="有效期结束日" prop="minEffectiveEndDt">
                  <h-date-picker :value="effectiveEndDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleEffectiveEndDtChange" placeholder=""></h-date-picker>
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
                      url="/pc/risk/arbitrage/arbitrageMonitor/func_queryArbitrageMonitorDetail"
                      :bindForm="formItem"
                      :row-select="true"
                      :has-select="false"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="addAndModif('add')" >{{$t('m.i.common.add')}}</h-button>
              <h-button type="primary" @click="addAndModif('modify')" >{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="busiDelete" >{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="batchImport" >{{$t('m.i.common.batchImport')}}</h-button>
              <h-button type="primary" @click="templateDownload" >{{$t('m.i.common.importTemplateDownload')}}</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 新增承兑登记信息界面 -->
        <h-msg-box v-model="arbitrageAddWin" width="800" @on-close="arbitrageAddWinClose" class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span v-if="type=='add'">套利监测新增</span>
            <span v-if="type=='modify'">套利监测修改</span>
          </p>
          <div>
            <h-form :model="arbitrageAddForm" :label-width="115" ref="arbitrageAddForm" cols="2" class="h-form-search">
              <h-form-item :label="$t('m.i.pc.arbitrageMonitorNo')" prop="arbitrageMonitorNo">
                <h-input v-model="arbitrageAddForm.arbitrageMonitorNo" :maxlength="60" readonly></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.be.acptBankName')" prop="acptBankName" :required="isRequired" >
                <h-input v-model="arbitrageAddForm.acptBankName" :maxlength=60 placeholder="" clearable></h-input>
              </h-form-item>
              <h-form-item label="出票人名称" prop="drwrName" :required="isRequired" >
                <h-input v-model="arbitrageAddForm.drwrName" :maxlength=60 placeholder="" clearable></h-input>
              </h-form-item>
              <h-form-item label="年利率(%)" prop="yearRate" :required="isRequired" :validRules="rateRule">
                <h-input v-model="arbitrageAddForm.yearRate" placeholder=""
                          clearable></h-input>
              </h-form-item>
              <h-form-item prop="effectiveBeginDt" :label="$t('m.i.pc.effectiveBeginDt')" :required="isRequired">
                <h-date-picker type="date" v-model="arbitrageAddForm.effectiveBeginDt" placeholder="" format="yyyy-MM-dd"
                               :editable=false showFormat @on-change="handleAddEffectiveBeginDtChange"></h-date-picker>
              </h-form-item>
              <h-form-item prop="effectiveEndDt" :label="$t('m.i.pc.effectiveEndDt')" :required="isRequired">
                <h-date-picker type="date" v-model="arbitrageAddForm.effectiveEndDt" placeholder="" format="yyyy-MM-dd"
                               :editable=false showFormat  @on-change="handleAddEffectiveEndDtChange"></h-date-picker>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="arbitrageAddWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="arbitrageAddSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>
    <!--文件批量导入-->
    <common-file-upload :importWin="importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                        @importSuccess="importSuccess"></common-file-upload>
  </div>
</template>

<script>
import { post, accMul} from "@/api/bizApi/commonUtil";

export default {
  name: "arbitrageMonitorManage",
  components : {
  },
  data() {
    let _this = this;
    let arbitrageAddForm = {
      id: "",
      arbitrageMonitorNo: "",
      acptBankName: "",
      drwrName: "",
      yearRate: "",
      createDt:"",
      effectiveBeginDt: "",
      effectiveEndDt: "",
    };
    return {
      isRequired: false,
      formItem: {
        acptBankName: "",
        drwrName: "",
        minCreateDt: "",
        maxCreateDt: "",
        minEffectiveBeginDt: "",
        maxEffectiveBeginDt: "",
        minEffectiveEndDt: "",
        maxEffectiveEndDt: "",
      },
      arbitrageAddForm: arbitrageAddForm,
      columns: [
        {
          type: "selection",
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
          title: this.$t("m.i.pc.arbitrageMonitorNo"),
          key: 'arbitrageMonitorNo',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: this.$t("m.i.be.acptBankName"),
          key: 'acptBankName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: "出票人名称",
          key: 'drwrName',
          sortable: true,
          hiddenCol: false,
        },
        {
          title: "年利率(%)",
          key: 'yearRate',
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.yearRate != null && params.row.yearRate !== ""){
              let rate = accMul(params.row.yearRate, 100);
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.common.createDt"),
          key: "createDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.createDt == null ? "" : this.$moment(params.row.createDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pc.effectiveBeginDt"),
          key: "effectiveBeginDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.effectiveBeginDt == null ? "" : this.$moment(params.row.effectiveBeginDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.pc.effectiveEndDt"),
          key: "effectiveEndDt",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let date = params.row.effectiveEndDt == null ? "" : this.$moment(params.row.effectiveEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
      ],
      submitFlag: false,
      type: "",
      currentSelectList: [],
      currentSelectRow: [],
      createDt: [],
      effectiveBeginDt: [],
      effectiveEndDt: [],
      arbitrageAddWin: false,
      workDate: null,
      showUploadImageWin: false,
      importWin: false,
      fileParams: {
        //导入excel数据解析接口
        loadExcelUrl: window.LOCAL_CONFIG.API_HOME + "/pc/risk/arbitrage/arbitrageMonitor/func_importArbitrageMonitor",
        //excel数据导入接口
        fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/pc/risk/arbitrage/arbitrageMonitor/func_submitExcelData",
        formItem: {},           //请求表格数据时附带参数
        uploadParams: {},       //调用excel数据解析接口时附带的额外参数
        extraGridDatas: {},
        columns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.be.acptBankName"),
            key: 'acptBankName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: 'drwrName',
            sortable: true,
            hiddenCol: false,
          },
          {
            title: "年利率(%)",
            key: 'yearRate',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.effectiveBeginDt"),
            key: "effectiveBeginDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.effectiveBeginDt == null ? "" : this.$moment(params.row.effectiveBeginDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.effectiveEndDt"),
            key: "effectiveEndDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.effectiveEndDt == null ? "" : this.$moment(params.row.effectiveEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
        ],
        paramKey:"list",
      },
      memberId: JSON.parse(window.sessionStorage.getItem('userInfo')).memberId,
      couldChangeDrwr: false,
      rateRule: [{test: this.validYearRate, trigger: "blur"}],
      maxEffectiveEndDtOptions: {
        disabledDate(date) {
          let start = _this.$moment(addForm.minEffectiveEndDt).format("YYYY-MM-DD");
          let end = date.valueOf() - new Date(start).getTime();
          return end < 0;
        }
      }
    }
  },
  mounted() {
    this.workDate = window.sessionStorage.getItem("workDate");
  },
  methods: {
    // 行选中
    handleRowClick(arr) {
      this.currentSelectRow = arr[0];
    },
    handleSelectClick(arr) {
      this.currentSelectList = arr;
    },
    // 创建日期处理格式
    handleCreateDtChange(arr){
      if(arr && arr.length == 2){
        this.formItem.minCreateDt= arr[0].replace(/-/g, "");
        this.formItem.maxCreateDt = arr[1].replace(/-/g, "");
        this.createDt = [arr[0], arr[1]];
      }else{
        this.formItem.minCreateDt = "";
        this.formItem.maxCreateDt = "";
        this.createDt = [];
      }
    },
    // 有效期开始日处理格式
    handleEffectiveBeginDtChange(arr){
      if(arr && arr.length == 2){
        this.formItem.minEffectiveBeginDt= arr[0].replace(/-/g, "");
        this.formItem.maxEffectiveBeginDt = arr[1].replace(/-/g, "");
        this.effectiveBeginDt = [arr[0], arr[1]];
      }else{
        this.formItem.minEffectiveBeginDt = "";
        this.formItem.maxEffectiveBeginDt = "";
        this.effectiveBeginDt = [];
      }
    },
    // 有效期结束日处理格式
    handleEffectiveEndDtChange(arr){
      if(arr && arr.length == 2){
        this.formItem.minEffectiveEndDt= arr[0].replace(/-/g, "");
        this.formItem.maxEffectiveEndDt = arr[1].replace(/-/g, "");
        this.effectiveEndDt= [arr[0], arr[1]];
      }else{
        this.formItem.minEffectiveEndDt = "";
        this.formItem.maxEffectiveEndDt = "";
        this.effectiveEndDt = [];
      }
    },
    // 有效期处理格式
    handleAddEffectiveBeginDtChange(){
      this.arbitrageAddForm.effectiveBeginDt = this.$moment(this.arbitrageAddForm.effectiveBeginDt).format("YYYYMMDD");
    },
    // 有效期处理格式
    handleAddEffectiveEndDtChange(){
      this.arbitrageAddForm.effectiveEndDt = this.$moment(this.arbitrageAddForm.effectiveEndDt).format("YYYYMMDD");
    },
    // 表单查询
    handleSearch() {
      this.currentSelectList = [];
      this.$refs.datagrid.selects = [];
      this.$refs.datagrid.selectIds = [];
      this.$refs.datagrid.dataChange(1);
    },
    // 重置表单查询结果
    resetSearch() {
      this.$refs.formItem.resetFields();
      this.formItem.acptBankName = "";
      this.formItem.drwrName = "";
      this.formItem.minCreateDt = "";
      this.formItem.maxCreateDt = "";
      this.formItem.minEffectiveBeginDt = "";
      this.formItem.maxEffectiveBeginDt = "";
      this.formItem.minEffectiveEndDt = "";
      this.formItem.maxEffectiveEndDt = ""
      this.createDt = [];
      this.effectiveBeginDt = [];
      this.effectiveEndDt = [];
    },
    // 新增以及修改
    addAndModif(str) {
      this.type = str;
      let list = this.$refs.datagrid.selects;
      this.isRequired = true;
      if (this.type === "modify") {
        if (list != null && list.length == 1) {
          this.arbitrageAddWin = true;
          this.$nextTick(() => {
            this.arbitrageAddForm.id = list[0].id;
            this.arbitrageAddForm.arbitrageMonitorNo = list[0].arbitrageMonitorNo;
            this.arbitrageAddForm.acptBankName = list[0].acptBankName;
            this.arbitrageAddForm.drwrName = list[0].drwrName;
            this.arbitrageAddForm.yearRate = accMul(list[0].yearRate,100);
            this.arbitrageAddForm.createDt = this.$moment(list[0].createDt, "YYYYMMDD").format("YYYY-MM-DD");
            this.arbitrageAddForm.effectiveBeginDt = this.$moment(list[0].effectiveBeginDt, "YYYYMMDD").format("YYYY-MM-DD");
            this.arbitrageAddForm.effectiveEndDt = this.$moment(list[0].effectiveEndDt, "YYYYMMDD").format("YYYY-MM-DD");
          });
        } else if(list.length > 1){
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
      } else {
        this.arbitrageAddWin = true;
        this.$nextTick(() => {
          this.addFormReset();
        });
      }
    },
    // 新增/修改弹窗确定
    arbitrageAddSubmit() {
      this.$refs["arbitrageAddForm"].validate(valid => {
        if (valid) {
          this.submitFlag = true;
          let url;
          if (this.type == "modify") {
            url = "/pc/risk/arbitrage/arbitrageMonitor/func_updateArbitrageMonitor";
            this.arbitrageAddForm.createDt = this.$moment(this.arbitrageAddForm.createDt).format('YYYYMMDD');
          } else if (this.type == "add"){
            url = "/pc/risk/arbitrage/arbitrageMonitor/func_addArbitrageMonitor";
            this.arbitrageAddForm.createDt = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format('YYYYMMDD');
          }
          this.arbitrageAddForm.effectiveBeginDt = this.$moment(this.arbitrageAddForm.effectiveBeginDt).format('YYYYMMDD');
          this.arbitrageAddForm.effectiveEndDt = this.$moment(this.arbitrageAddForm.effectiveEndDt).format('YYYYMMDD');
          if (this.arbitrageAddForm.effectiveBeginDt > this.arbitrageAddForm.effectiveEndDt) {
            this.submitFlag = false;
            this.$msgTip.error(this, { info: "有效期结束日不能小于有效期开始日" });
          } else {
            post(this.arbitrageAddForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.arbitrageAddWin = false;
                  this.$refs.datagrid.dataChange( this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectList = [];
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.selectIds = [];
                  this.addFormReset();
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        }
      });
    },
    // 关闭新增/修改弹窗
    arbitrageAddWinClose() {
      this.arbitrageAddWin = false;
      this.addFormReset();
    },
    // 清空新增栏数据
    addFormReset() {
      this.arbitrageAddForm.id = null;
      this.arbitrageAddForm.arbitrageMonitorNo = null;
      this.arbitrageAddForm.acptBankName = null;
      this.arbitrageAddForm.drwrName = null;
      this.arbitrageAddForm.yearRate = null;
      this.arbitrageAddForm.createDt = null;
      this.arbitrageAddForm.effectiveBeginDt = null;
      this.arbitrageAddForm.effectiveEndDt = null;
      this.$refs.arbitrageAddForm.resetFields();
    },
    validYearRate(rule, val, callback) {
      let re = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
      if (re.test(val)) {
        callback();
      } else {
        callback(new Error("利率为0~100之间的数，小数位不超过4位"));
      }
    },
    // 删除
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
        this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
      }
    },
    // 确认删除
    handleDel() {
      let ids = this.$refs.datagrid.selectIds.join(",");
      post({ ids: ids }, "/pc/risk/arbitrage/arbitrageMonitor/func_deleteArbitrageMonitor").then(res => {
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
    // 批量导入
    batchImport() {
      this.importWin = true;
    },
    // 模板下载
    templateDownload() {
      let url = window.LOCAL_CONFIG.API_HOME + "/pc/risk/arbitrage/arbitrageMonitor/func_downloadArbitrageMonitor";
      let form = document.createElement("form");
      form.setAttribute("id", "formId");
      form.setAttribute("action", url);
      form.setAttribute("method", "post");
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    },
    // 关闭导入窗口
    importWinClose() {
      this.importWin = false;
    },
    // 导入成功
    importSuccess() {
      this.importWin = false;
      this.$refs.datagrid.dataChange(1);
    },
  }
};
</script>

<style scoped>

</style>
