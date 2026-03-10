<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

                <h-form-item prop="quotedPriceDt" :label="$t('m.i.ce.quotedPriceDt')">
                  <h-date-picker :value="formItem.quotedPriceDtRang" type="daterange" showFormat :editable=true
                                 @on-change="handleQuotedPriceDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlight-row
                      :bindForm="formItem"
                      url="/banks/szbank/ce/disc/discRateShow/func_queryDiscRateInfo"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
            <!--  <h-button type="primary" @click="discShowOpenWin('add')">
                {{ $t("m.i.common.add") }}
              </h-button>
              -->
              <h-button type="primary" @click="calDiscShow()">
                {{ $t("m.i.ce.calculate") }}
              </h-button>
              <!--
              <h-button type="primary" @click="discShowOpenWin('modify')">
                {{ $t("m.i.common.modify") }}
              </h-button>
              <h-button type="primary" @click="discShowDelete()">
                {{ $t("m.i.common.delete") }}
              </h-button>
              -->
              <h-button type="primary" @click="adjustDiscRate()">
                {{ $t("m.i.ce.adjustDiscRate") }}
              </h-button>
              <h-button type="primary" @click="queryAdjustRateParam()">
                {{ $t("m.i.ce.adjustDiscRateParam") }}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 点击新增弹出框 -->
    <h-msg-box v-model="addWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="addFormClose()"
               :mask-closable="false" top="10" @on-maximize="onMaximize">
      <p slot="header" v-if="addForm.optType=='modify'">修改贴现报价</p>
      <p slot="header" v-else>新增贴现报价</p>
      <div>
        <h-form :model="addForm" :label-width="90" ref="addForm" cols="2" class="h-form-search">

          <h-form-item :label="$t('m.i.ce.quotedPriceDt')" prop="quotedPriceDt" required>
            <h-date-picker type="date" v-model="addForm.quotedPriceDt" showFormat :editable=true
                           placeholder=""   @on-change="dateChange()"></h-date-picker>
          </h-form-item>

          <h-form-item prop="num" :label="$t('m.i.ce.num')" required>
            <h-input v-model="addForm.num" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="residualTermSmall" :label="$t('m.i.ce.residualTermSmall')">
            <h-input v-model="addForm.residualTermSmall" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="residualTermBig" :label="$t('m.i.ce.residualTermBig')">
            <h-input v-model="addForm.residualTermBig" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="amountSmall" :label="$t('m.i.ce.amountSmall')">
            <h-input v-model="addForm.amountSmall" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="amountBig" :label="$t('m.i.ce.amountBig')">
            <h-input v-model="addForm.amountBig" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate1" :label="$t('m.i.ce.guideRate1')" required>
            <h-input v-model="addForm.guideRate1" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate2" :label="$t('m.i.ce.guideRate2')" required>
            <h-input v-model="addForm.guideRate2" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate3" :label="$t('m.i.ce.guideRate3')" required>
            <h-input v-model="addForm.guideRate3" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate4" :label="$t('m.i.ce.guideRate4')" required>
            <h-input v-model="addForm.guideRate4" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate5" :label="$t('m.i.ce.guideRate5')" required>
            <h-input v-model="addForm.guideRate5" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate6" :label="$t('m.i.ce.guideRate6')" required>
            <h-input v-model="addForm.guideRate6" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate7" :label="$t('m.i.ce.guideRate7')" required>
            <h-input v-model="addForm.guideRate7" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate8" :label="$t('m.i.ce.guideRate8')" required>
            <h-input v-model="addForm.guideRate8" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="guideRate9" :label="$t('m.i.ce.guideRate9')" required>
            <h-input v-model="addForm.guideRate9" placeholder=""></h-input>
          </h-form-item>

          <h-form-item prop="faceFactors" :label="$t('m.i.ce.faceFactors')"
                       class="h-form-height-auto" cols="2" required>
            <h-input type="textarea" :rows="3" v-model="addForm.faceFactors" :canResize="false" :maxlength=200></h-input>
          </h-form-item>

        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addFormClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 调整规则设置出框 -->
    <h-msg-box v-model="paramWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="paramFormClose()"
               :mask-closable="false" top="10" @on-maximize="onMaximize">
      <p slot="header">调整规则设置</p>
      <div>
        <h-form :model="paramForm" :label-width="90" ref="paramForm" cols="2" class="h-form-search">

          <h-form-item prop="guideRate1" :label="$t('m.i.ce.guideRate1')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate1" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="guideRate2" :label="$t('m.i.ce.guideRate2')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate2" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="guideRate3" :label="$t('m.i.ce.guideRate3')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate3" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="guideRate4" :label="$t('m.i.ce.guideRate4')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate4" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="guideRate5" :label="$t('m.i.ce.guideRate5')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate5" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="guideRate6" :label="$t('m.i.ce.guideRate6')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate6" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="guideRate7" :label="$t('m.i.ce.guideRate7')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate7" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="guideRate8" :label="$t('m.i.ce.guideRate8')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate8" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

          <h-form-item prop="guideRate9" :label="$t('m.i.ce.guideRate9')" required>
            <h-row>
              <h-col span="20">
                <h-input v-model="paramForm.guideRate9" placeholder=""></h-input>
              </h-col>
              <h-col span="2" style="text-align: left">(BP)</h-col>
            </h-row>
          </h-form-item>

        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="paramFormClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="paramAdjust()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post, on, off, accMul, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "discRateShow",
    data() {
      let formItem = {
        minQuotedPriceDt: "",
        maxQuotedPriceDt: "",
        quotedPriceDtRang: "",
      };
      let addForm = {
        id: "",
        optType: "",
        quotedPriceDt: this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD"),
        num: "",
        residualTermSmall: "",
        residualTermBig: "",
        amountSmall: "",
        amountBig: "",
        guideRate1:"",
        guideRate2:"",
        guideRate3:"",
        guideRate4:"",
        guideRate5:"",
        guideRate6:"",
        guideRate7:"",
        guideRate8:"",
        guideRate9:"",
        faceFactors:"",
      };
      let paramForm = {
        guideRate1:"",
        guideRate2:"",
        guideRate3:"",
        guideRate4:"",
        guideRate5:"",
        guideRate6:"",
        guideRate7:"",
        guideRate8:"",
        guideRate9:"",
      };
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
        },
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: true,
          align: "center"
        },
        {
          type: "index",
          key: "numOrder",
          title: this.$t("m.i.common.index"),
          width: 60,
          align: "center",
          hiddenCol: false
        },

        {
          title: this.$t("m.i.ce.faceFactors"),
          key: "faceFactors",
          hiddenCol: false
        },
        {
          title: this.$t("m.i.ce.quotedPriceType"),
          key: "quotedPriceType",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap, "PriceType", params.row.quotedPriceType));
          }
        },
        {
          title: this.$t("m.i.ce.quotedPriceDt"),
          key: "quotedPriceDt",
          sortable: true,
          hiddenCol: false,
          render: (h, params) => {
            let date = params.row.quotedPriceDt == null ? "" : this.$moment(params.row.quotedPriceDt, "YYYY-MM-DD").format("YYYY-MM-DD");
            return h("span", date);
          }
        },
        {
          title: this.$t("m.i.ce.guideRate1"),
          key: "guideRate1",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate1 != null && params.row.guideRate1 !== ""){
              let rate = accMul(params.row.guideRate1, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guideRate2"),
          key: "guideRate2",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate2 != null && params.row.guideRate2 !== ""){
              let rate = accMul(params.row.guideRate2, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guideRate3"),
          key: "guideRate3",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate3 != null && params.row.guideRate3 !== ""){
              let rate = accMul(params.row.guideRate3, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guideRate4"),
          key: "guideRate4",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate4 != null && params.row.guideRate4 !== ""){
              let rate = accMul(params.row.guideRate4, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guideRate5"),
          key: "guideRate5",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate5 != null && params.row.guideRate5 !== ""){
              let rate = accMul(params.row.guideRate5, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guideRate6"),
          key: "guideRate6",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate6 != null && params.row.guideRate6 !== ""){
              let rate = accMul(params.row.guideRate6, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guideRate7"),
          key: "guideRate7",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate7 != null && params.row.guideRate7 !== ""){
              let rate = accMul(params.row.guideRate7, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guideRate8"),
          key: "guideRate8",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate8 != null && params.row.guideRate8 !== ""){
              let rate = accMul(params.row.guideRate8, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.ce.guideRate9"),
          key: "guideRate9",
          hiddenCol: false,
          render: (h, params) => {
            if(params.row.guideRate9 != null && params.row.guideRate9 !== ""){
              let rate = accMul(params.row.guideRate9, 100) + "(%)";
              return h("span", rate);
            }
          }
        },
        {
          title: this.$t("m.i.common.activeFlag"),
          key: "activeFlag",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.activeFlag));
          }
        }
      ];
      return {
        formItem: formItem,
        addForm: addForm,
        columns: columns,
        paramForm: paramForm,
        selectData:null,
        addWin: false,
        paramWin: false,
        submitFlag: false,
        readonly: false,
        dictMap: new Map(),
        isList: [],
        priceTypeList: [],
      };
    },
    computed: {

    },
    created() {
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.quotedPriceDtRang = [workDate, workDate];
      this.formItem.minQuotedPriceDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxQuotedPriceDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.getDictListByGroups("Yon,PriceType").then(res => {
        this.isList = res.get("Yon");
        this.priceTypeList = res.get("PriceType");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleQuotedPriceDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minQuotedPriceDt = arr[0].replace(/-/g, "");
          this.formItem.maxQuotedPriceDt = arr[1].replace(/-/g, "");
          this.formItem.quotedPriceDtRang = [arr[0], arr[1]];
        } else {
          this.formItem.minQuotedPriceDt = "";
          this.formItem.maxQuotedPriceDt = "";
          this.formItem.quotedPriceDtRang = [];
        };
      },
      dateChange(arr) {
        if(arr){
          this.addForm.quotedPriceDt = arr.replace(/-/g, "");
        }
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minQuotedPriceDt = "";
        this.formItem.maxQuotedPriceDt = "";
        this.formItem.quotedPriceDtRang = [];
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      discShowDelete(){
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let workDate = window.sessionStorage.getItem("workDate");
        if (Number(workDate) > Number(this.selectData.quotedPriceDt + "")) {
          this.$msgTip.info(this, { info: "生效日期在当前营业日之前的数据不可【删除】！" });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            post(this.selectData, "/banks/szbank/ce/disc/discRateShow/func_deleteDiscRateInfo").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.selectData = null;
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
      //新增
      discShowOpenWin(addOrUpdate) {
        this.addForm.optType = addOrUpdate;
        this.addWin = true;
        if(this.addForm.optType == "modify"){
          if (!this.selectData) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            this.addWin = false;
            return;
          }
          this.$nextTick(async () => {
            this.addForm.id = this.selectData.id;
            this.addForm.num = this.selectData.num;
            this.addForm.quotedPriceDt = this.$moment(this.selectData.quotedPriceDt, "YYYYMMDD").format("YYYY-MM-DD");
            this.addForm.amountSmall = this.selectData.amountSmall;
            this.addForm.amountBig = this.selectData.amountBig;
            this.addForm.residualTermSmall = this.selectData.residualTermSmall;
            this.addForm.residualTermBig = this.selectData.residualTermBig;
            this.addForm.faceFactors = this.selectData.faceFactors;
            this.addForm.guideRate1 = this.selectData.guideRate1;
            this.addForm.guideRate2 = this.selectData.guideRate2;
            this.addForm.guideRate3 = this.selectData.guideRate3;
            this.addForm.guideRate4 = this.selectData.guideRate4;
            this.addForm.guideRate5 = this.selectData.guideRate5;
            this.addForm.guideRate6 = this.selectData.guideRate6;
            this.addForm.guideRate7 = this.selectData.guideRate7;
            this.addForm.guideRate8 = this.selectData.guideRate8;
            this.addForm.guideRate9 = this.selectData.guideRate9;
          });
        }else{
          this.$nextTick(() => {
            this.$refs.addForm.resetFields();
            this.addForm.faceFactors = "□月□号到□月□号到期，单张票面2000万（含）以下100万以上（含）";
          });
        }
      },
      addFormClose() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
        });
        this.addWin = false;
      },
      calDiscShow(){
        let url = "/banks/szbank/ce/disc/discRateShow/func_calDiscRateInfo";
          post({ }, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: "计算成功" });
                  this.selectData = null;
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            }
          );
      },
      formAdd(){
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let desc = "新增";
            let url = "/banks/szbank/ce/disc/discRateShow/func_addDiscRateInfo";
            if(this.addForm.optType == "modify"){
              desc = "修改";
              url = "/banks/szbank/ce/disc/discRateShow/func_modifyDiscRateInfo";
            }
            let tmp = this.addForm.quotedPriceDt;
            this.addForm.quotedPriceDt = tmp.replace(/-/g, "");
            let workDate = window.sessionStorage.getItem("workDate");
            if (Number(workDate) > Number(this.addForm.quotedPriceDt + "")) {
              this.$msgTip.info(this, { info: "只能" + desc + "当前营业日的数据！" });
              return;
            }
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
                if (res) {
                  this.addWin = false;
                  this.submitFlag = false;
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this);
                    this.$refs.datagrid.dataChange(1);
                    this.selectData = null;
                    this.addFormClose();
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }
            );
          }
        });
      },
      adjustDiscRate(){
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "是否确认按目前调整规则生成基准利率?",
          onOk: () => {
            let url = "/banks/szbank/ce/disc/discRateShow/func_adjustDiscRateInfo";
            post({ }, url).then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this, { info: "报价调整成功" });
                    this.selectData = null;
                    this.$refs.datagrid.dataChange(1);
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }
            );
          }
        });
      },
      queryAdjustRateParam(){
        let url = "/banks/szbank/ce/disc/discRateShow/func_queryAdjustRateParam";
        this.paramWin = true;
          post({ }, url).then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.paramForm.guideRate1 = res.data.retData.guideRate1;
                  this.paramForm.guideRate2 = res.data.retData.guideRate2;
                  this.paramForm.guideRate3 = res.data.retData.guideRate3;
                  this.paramForm.guideRate4 = res.data.retData.guideRate4;
                  this.paramForm.guideRate5 = res.data.retData.guideRate5;
                  this.paramForm.guideRate6 = res.data.retData.guideRate6;
                  this.paramForm.guideRate7 = res.data.retData.guideRate7;
                  this.paramForm.guideRate8 = res.data.retData.guideRate8;
                  this.paramForm.guideRate9 = res.data.retData.guideRate9;
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            }
          );
      },
      paramFormClose() {
        this.$nextTick(() => {
          this.$refs.paramForm.resetFields();
        });
        this.paramWin = false;
      },
      paramAdjust(){
        this.$refs["paramForm"].validate(valid => {
          if (valid) {
            let url = "/banks/szbank/ce/disc/discRateShow/func_disposeAdjustRateParam";
            this.submitFlag = true;
            post(this.paramForm, url).then(res => {
                if (res) {
                  this.submitFlag = false;
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode == "000000") {
                    this.$msgTip.success(this, { info: "设置成功" });
                    this.selectData = null;
                    this.$refs.datagrid.dataChange(1);
                    this.paramFormClose();
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              }
            );
          }
        });
      }

    }
  };
</script>
