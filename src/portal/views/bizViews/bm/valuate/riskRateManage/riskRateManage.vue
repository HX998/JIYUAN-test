<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-date-picker :rangeValue="['minDueDate','maxDueDate']" v-model="formItem.valuateDts"
                                    :label="$t('m.i.common.valuationDate')" prop="valuateDts" format="yyyy-MM-dd"
                                    :minDueDate.sync="formItem.minDueDate" :maxDueDate.sync="formItem.maxDueDate"
                                    type="daterange"></common-date-picker>
                <common-select v-model="formItem.operStatus" prop="operStatus" :dictList="dictList"
                               :label="$t('m.i.common.operStatus')"></common-select>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->

              <h-datagrid :columns="columns" highlight-row url="/bm/valuate/riskRateManage/func_queryRiskRateMangeHis"
                          :bindForm="formItem"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          :onCurrentChange="onCurrentChange"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="synch()">{{$t('m.i.common.synch')}}</h-button>
                  <h-button type="primary" @click="addRiskRate()">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="editRiskRate()">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="deleteRiskRate()">{{$t('m.i.common.delete')}}</h-button>
                  <h-button  type="primary" @click="submitCheck()" v-if="this.showFlag" >{{$t('m.i.common.submitCheck')}}</h-button>
                  <h-button type="primary" @click="withdraw()" v-if="this.showFlag">{{$t('m.i.be.withdraw')}}</h-button>
                  <h-button type="primary" @click="templateDownload()">{{$t('m.i.common.templateDownload')}}</h-button>
                  <h-button type="primary" @click="importExcel()">{{$t('m.i.common.import')}}</h-button>
                </div>
              </h-datagrid>



        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type=='add'">新增无风险利率</span>
        <span v-if="type=='modify'">修改无风险利率</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="120" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.valuationDate')" prop="valuateDt" :required="this.isrequired">
            <h-date-picker type="date" showFormat v-model="addForm.valuateDt"
                           @on-change="handleDateChange"></h-date-picker>
          </h-form-item>

          <common-input :label="$t('m.i.common.today')" v-model="addForm.todayRate" :maxlength=60 prop="todayRate" :required="false">
          </common-input>
          <common-input :label="$t('m.i.common.oneWeek')" v-model="addForm.oneWeekRate" :maxlength=60 prop="oneWeekRate" :required="false">
          </common-input>
          <common-input :label="$t('m.i.common.twoWeek')" v-model="addForm.twoWeekRate" :maxlength=60 prop="twoWeekRate" :required="false">
          </common-input>
          <common-input :label="$t('m.i.common.oneMonth')" v-model="addForm.oneMonthRate" :maxlength=60 prop="oneMonthRate" :required="false">
          </common-input>
          <common-input :label="$t('m.i.common.threeMonth')" v-model="addForm.threeMonthRate" :maxlength=60 prop="threeMonthRate" :required="false">
          </common-input>
          <common-input :label="$t('m.i.common.sixMonth')" v-model="addForm.halfYearRate" :maxlength=60 prop="halfYearRate" :required="false">
          </common-input>
          <common-input :label="$t('m.i.common.nineMonth')" v-model="addForm.nineMonthRate" :maxlength=60 prop="nineMonthRate" :required="false">
          </common-input>
          <common-input :label="$t('m.i.common.oneYear')" v-model="addForm.oneYearRate" :maxlength=60 prop="oneYearRate" :required="false">
          </common-input>

        </h-form>
      </h-panel>

      <div slot="footer">
        <h-button type="primary" @click="submitForm()">{{$t('m.i.common.confirm')}}</h-button>
        <h-button type="primary" @click="close">{{$t('m.i.common.close')}}</h-button>
      </div>
    </h-msg-box>
    <!-- 导入 -->
    <common-file-upload-no-show :import-win="this.importWin" :fileParams="fileParams" @importWinClose="importWinClose"
                                @importError="importError"  @importSuccess="importSuccess"></common-file-upload-no-show>
    <h-msg-box v-model="synchWin" width="500" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>同步无风险利率</span>
      </p>
      <h-panel>
        <h-form :model="synchForm" :label-width="120" ref="synchForm" cols="1" class="h-form-search">
          <common-date-picker :rangeValue="['minDueDate','maxDueDate']" v-model="synchForm.valuateDts" :required="this.isrequired"
                              :label="$t('m.i.common.valuationDate')" prop="valuateDts" format="yyyy-MM-dd"
                              :minDueDate.sync="synchForm.minDueDate" :maxDueDate.sync="synchForm.maxDueDate"
                              type="daterange"></common-date-picker>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="primary" @click="submitSynch()">{{$t('m.i.common.synch')}}</h-button>
        <h-button type="primary" @click="closeSynch">{{$t('m.i.common.close')}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post,getUploadImgType} from '@/api/bizApi/commonUtil'
  import CommonInput from "../../../../../components/bemp/input/commonInput";

  export default {
    name: "riskRateManage",
    components: {CommonInput},
    data() {
      return {
        trDir: '',
        url: null,
        synchForm: {
          minDueDate: "",
          maxDueDate: "",
          valuateDts: [],
        },
        showFlag:true,
        synchWin: false,
        quoteNo: null,
        isQuoteNew: null,
        reqNum: null,
        quoteHistChangeWin: false,
        title: '',
        workDay:window.sessionStorage.getItem("workDate"),
        batchId: null,
        ifShowMore: false,
        saleTotalChangeWin: false,
        showProvisionDetil: false,
        busiType: "",
        selectData: [],
        dictMap: new Map(),
        dictList: [],
        isrequired: true,
        importWin: false,
        addForm: {
          id: "",
          valuateDt: "",
          todayRate: "",
          oneWeekRate: "",
          twoWeekRate: "",
          oneMonthRate: "",
          threeMonthRate: "",
          halfYearRate: "",
          nineMonthRate: "",
          oneYearRate: "",
          operStatus:"",
        },
        type: "",
        addOrEditWin: false,
        DtRange: [],
        formItem: {
          operStatus: "",
          minDueDate: "",
          maxDueDate: "",
          valuateDts: [],
        },

        columns: [
          {
            type: "radio",
            width: 50,
            title: " ",
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.valuationDate'),
            key: "valuateDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.valuateDt == null || params.row.valuateDt === "") {
                return "";
              }
              let date = this.$moment(params.row.valuateDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }, {
            title: this.$t('m.i.common.today'),
            key: "todayRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.oneWeek'),
            key: "oneWeekRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.twoWeek'),
            key: "twoWeekRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.oneMonth'),
            key: "oneMonthRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.threeMonth'),
            key: "threeMonthRate",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.sixMonth'),
            key: "halfYearRate",
            sortable: true,
            hiddenCol: false
          }, {
            title: this.$t('m.i.common.nineMonth'),
            key: "nineMonthRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.oneYear'),
            key: "oneYearRate",
            hiddenCol: false,

          }, {
            title: this.$t('m.i.common.createDt'),
            key: "createTime",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.createTime == null || params.row.createTime === "") {
                return "";
              }
              let date = this.$moment(params.row.createTime, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          }, {
            title: this.$t('m.i.common.operStatus'),
            key: "operStatus",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "RiskOperStatus", params.row.operStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        fileParams: {
          //excel数据导入接口
          fileUploadUrl: window.LOCAL_CONFIG.API_HOME + "/bm/valuate/riskRateManage/func_importRiskRateMangeHis",
          formItem: {},           //请求表格数据时附带参数
          uploadParams: {},       //调用excel数据解析接口时附带的额外参数
          extraGridDatas: {},     //需在反显数据中额外添加的字段

        },
      };
    },
    mounted() {
      this.getDictListByGroups("RiskOperStatus").then(res => {
        this.dictList = res.get("RiskOperStatus");
        this.dictMap = res.get("map");
      });
      getUploadImgType("bm.valuate.risk_rate_audit_mode").then(res => {
        let value = res.value
        if(value=="1"){
          this.showFlag=true;
        }else if(value=="0"){
          this.showFlag=false;
        }
      })
    },
    methods: {
      onCurrentChange(arr, selectInx) {
        let tmpArr = [];
        tmpArr.push(arr);
        this.selectData = tmpArr;
      },
      onCurrentChangeCancel() {
        this.selectData = [];
      },
      handleAcptRgstDtChange(arr) {

      },
      //选择记录
      handleSelectClick(arr) {
        this.selectData[0] = arr[0];
      },
      handleDateChange(value) {
        this.addForm.valuateDt = value.replace(/-/g, "");
      },
      DateChange(value) {
        this.formItem.valuateDts = value.replace(/-/g, "");
      },
      //重置
      formSearchReset() {
        this.formItem = [];

      },
      //查询
      formSearch() {
        this.selectData = []
        this.$refs.datagrid.dataChange(1);
      },

      //同步按钮
      synch() {
        this.$nextTick(() => {
          this.$refs.synchForm.resetFields();
        });
        this.synchWin = true;
      },
      //新增按钮
      addRiskRate() {
        this.type = "add";
        this.addOrEditWin = true;
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.id = "";
        });
      },


      //修改按钮
      editRiskRate() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.id = "";
        });
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if(list[0].valuateDt <this.workDay){
          this.$msgTip.info(this, {info: "估值日期小于当前营业日的数据,不允许修改"});
          return;
        }
        if(list[0].operStatus=="12" || list[0].operStatus=="22" || list[0].operStatus=="32"){
          this.$msgTip.info(this, {info: "该数据正在提交复核中，不允许修改"});
          return;
        }

        this.type = "modify";
        this.addOrEditWin = true;
        let url = "/bm/valuate/riskRateManage/func_selectRiskRateMangeHisById"
        post({id: list[0].id}, url).then(res => {
          let valuateDt = null;
          if (res.data.retCode == "000000") {
            if (res.data.retData.valuateDt != "" || res.data.retData.valuateDt != null) {
              valuateDt = res.data.retData.valuateDt.toString();
            }
            this.addForm.valuateDt = valuateDt;
            this.addForm.todayRate = res.data.retData.todayRate;
            this.addForm.oneWeekRate = res.data.retData.oneWeekRate;
            this.addForm.twoWeekRate = res.data.retData.twoWeekRate;
            this.addForm.oneMonthRate = res.data.retData.oneMonthRate;
            this.addForm.threeMonthRate = res.data.retData.threeMonthRate;
            this.addForm.halfYearRate = res.data.retData.halfYearRate;
            this.addForm.nineMonthRate = res.data.retData.nineMonthRate;
            this.addForm.oneYearRate = res.data.retData.oneYearRate;
            this.addForm.operStatus = res.data.retData.operStatus;
            this.addForm.id = res.data.retData.id;
            this.addForm.createTime=res.data.retData.createTime;
          }
        })
      },
      //删除
      deleteRiskRate() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if(list[0].operStatus=="12" || list[0].operStatus=="22" || list[0].operStatus=="32"){
          this.$msgTip.info(this, {info: "该数据正在提交复核中，不允许删除"});
          return;
        }
        if(list[0].operStatus=="33" ){
          this.$msgTip.info(this, {info: "该数据已被删除，不允许重复删除"});
          return;
        }
        let url = "/bm/valuate/riskRateManage/func_delectRiskRateMangeHis"
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: '确定删除吗？',
          onOk: () => {
            let id = list[0].id;
            post({id: id}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });
      },
      //提交复核
      submitCheck() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if(list[0].operStatus=="12" || list[0].operStatus=="22" || list[0].operStatus=="32"){
          this.$msgTip.info(this, {info: "该数据正在提交复核中，不允许重复提交"});
          return;
        }
        if(list[0].operStatus=="13" || list[0].operStatus=="23" || list[0].operStatus=="33"){
          this.$msgTip.info(this, {info: "该数据已经复核通过，不允许提交"});
          return;
        }
        this.$hMsgBox.confirm({
          title: "确认",
          content: "确定提交复核吗？",
          onOk: () => {
            let id = list[0].id;
            let url = "/bm/valuate/riskRateManage/func_submitRiskRateMangeHis";
            post({id: id}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });

      },
      check() {
        let flag = true;
        let flagValue=0;
        if(this.addForm.todayRate === "" || this.addForm.todayRate === null){
          flagValue++;
        }
        if(this.addForm.oneWeekRate === "" || this.addForm.oneWeekRate === null){
          flagValue++;
        }
        if(this.addForm.twoWeekRate === "" || this.addForm.twoWeekRate === null){
          flagValue++;
        }
        if(this.addForm.oneMonthRate === "" || this.addForm.oneMonthRate === null){
          flagValue++;
        }
        if(this.addForm.threeMonthRate === "" || this.addForm.threeMonthRate === null){
          flagValue++;
        }
        if(this.addForm.halfYearRate === "" || this.addForm.halfYearRate === null){
          flagValue++;
        }
        if(this.addForm.nineMonthRate === "" || this.addForm.nineMonthRate === null){
          flagValue++;
        }
        if(this.addForm.oneYearRate === "" || this.addForm.oneYearRate === null){
          flagValue++;
        }
        if(flagValue>=7){
          this.$msgTip.error(this, {info: "录入的无风险利率不能少于两个！"});
          flag=false;
        }
        return flag;
      },
      //新增修改确定按钮
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let flag = this.check();
            if (!flag) {
              return;
            }
            let rateFlag=this.validate();
            if (!rateFlag) {
              return;
            }
            let url = this.type == "add" ? "/bm/valuate/riskRateManage/func_addRiskRateMangeHis" : "/bm/valuate/riskRateManage/func_updateRiskRateMangeHis";
            post(this.addForm, url).then(res => {
              if (res) {
                if (res.data.retCode == "000000") {
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg})
                }
              }
            })
          }
        });
      },
      //撤回
      withdraw() {
        let list = this.selectData;
        if (list.length == 0) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, {info: this.$t("m.i.common.onlyChooseOneData")});
          return;
        }
        if(list[0].operStatus!="12" && list[0].operStatus!="22" && list[0].operStatus!="32"){
          this.$msgTip.info(this, {info: "该数据未提交复核，不允许撤回"});
          return;
        }
        let url = "/bm/valuate/riskRateManage/func_rollbackRiskRateMangeHis"
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: '确定撤回待复核数据吗？',
          onOk: () => {
            let id = list[0].id;
            post({id: id}, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = [];
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }
            });
          }
        });

      },
      //下载模板
      templateDownload() {
        let url = window.LOCAL_CONFIG.API_HOME + "/bm/valuate/riskRateManage/func_download"
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //同步提交
      submitSynch() {

        this.$refs["synchForm"].validate(valid => {
          if (valid) {
            if(this.synchForm.minDueDate<this.workDay) {
              this.$msgTip.info(this, {info: "估值日期小于当前营业日,不允许同步"});
              return;
            }
            let url = "/bm/valuate/riskRateManage/func_synchRiskRateMangeHis";
            post(this.synchForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$refs.datagrid.dataChange(1);
                  this.$msgTip.success(this);
                  this.synchWin=false;
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                  this.synchWin=false;
                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
                this.synchWin=false;


              }
            });
          }
        })
      },
      closeSynch() {
        this.synchWin = false;
      },

      //关闭
      close() {
        this.addOrEditWin = !this.addOrEditWin;
        this.type = "";
       // this.selectData = [];
        this.addForm = {
          valuateDt: "",
          todayRate: "",
          oneWeekRate: "",
          twoWeekRate: "",
          oneMonthRate: "",
          threeMonthRate: "",
          halfYearRate: "",
          nineMonthRate: "",
          oneYearRate: "",
        }
      },
      //导入excel
      importExcel() {
        this.importWin = true;
      },
      importWinClose() {
        this.importWin = false;
      },
      importError(){
        this.$refs.datagrid.dataChange(1);
      },
      importSuccess() {
        this.$refs.datagrid.dataChange(1);
        this.importWin = false;
      },

      validate(){
        let flag = true;
        let el = /^(((\d|[1-9]\d)(\.\d{1,4})?)|100|100\.0|100\.00|100\.000|100\.0000)$/;
        if(this.addForm.todayRate!=null && this.addForm.todayRate!=""){
          if (!(el.test(this.addForm.todayRate))) {
            this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
            flag=false;
          }
        }
        if(this.addForm.oneWeekRate!=null && this.addForm.oneWeekRate!=""){
          if (!(el.test(this.addForm.oneWeekRate))) {
            this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
            flag=false;
          }
        }
        if(this.addForm.twoWeekRate!=null && this.addForm.twoWeekRate!=""){
          if (!(el.test(this.addForm.twoWeekRate))) {
            this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
            flag=false;
          }
        }
        if(this.addForm.oneMonthRate!=null && this.addForm.oneMonthRate!=""){
          if (!(el.test(this.addForm.oneMonthRate))) {
            this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
            flag=false;
          }
        }
        if(this.addForm.threeMonthRate!=null && this.addForm.threeMonthRate!=""){
          if (!(el.test(this.addForm.threeMonthRate))) {
            this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
            flag=false;
          }
        }
        if(this.addForm.halfYearRate!=null && this.addForm.halfYearRate!=""){
          if (!(el.test(this.addForm.halfYearRate))) {
            this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
            flag=false;
          }
        }
        if(this.addForm.nineMonthRate!=null && this.addForm.nineMonthRate!=""){
          if (!(el.test(this.addForm.nineMonthRate))) {
            this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
            flag=false;
          }
        }
        if(this.addForm.oneYearRate!=null && this.addForm.oneYearRate!=""){
          if (!(el.test(this.addForm.oneYearRate))) {
            this.$msgTip.info(this, { info: "利率为0到100的数字，小数位不超过4位！" });
            flag=false;
          }
        }
        return flag;
      },

    },
  }
</script>

<style scoped>

</style>
