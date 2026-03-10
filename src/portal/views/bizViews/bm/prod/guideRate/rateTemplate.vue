<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-product v-model="formItem.prodName" @productSelectedChange="productSelectedChange"></show-product>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-row>
            <h-col span="24">
              <h-datagrid :columns="columns"
                          highlight-row
                          url="/bm/prod/guideRate/rateTemplate/func_queryProductRateKpiByGroup"
                          :bindForm="formItem"
                          :onCurrentChange="onCurrentChange"
                          :onCurrentChangeCancel="onCurrentChangeCancel"
                          ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="addKpi()" v-if="authObj.rateTemAdd">{{$t('m.i.bm.addKpi')}}</h-button>
                  <h-button type="primary" @click="deleteKpi()" v-if="authObj.rateTemDel">{{$t('m.i.bm.deleteKpi')}}</h-button>
                  <h-button type="primary" @click="createRateTemplate()" v-if="authObj.rateTemCreate">{{$t('m.i.bm.createRateTemplate')}}</h-button>
                  <h-button type="primary" @click="viewProductKpi()" v-if="authObj.kpiView">{{$t('m.i.bm.viewProductKpi')}}</h-button>
                  <h-button type="primary" @click="viewRateTemplate()" v-if="authObj.rateTemManager">{{$t('m.i.bm.viewRateTemplate')}}</h-button>
                </div>
              </h-datagrid>
            </h-col>
          </h-row>
          <ul style="color:red;padding-left:0px;">操作说明：
            <ul style="color:red;padding-left:0px;">1、请先新增指标分配，为产品指定指标，然后生成利率模板，</ul>
            <ul style="color:red;padding-left:0px;">2、模板生成后就可以在 '指导利率设置' 界面设置对应产品的利率</ul>
            <ul style="color:red;padding-left:0px;">3、如果变更了指标，一定要再次生成模板，不然设置利率的时候，模板不一致</ul>
          </ul>
        </div>
      </h-col>
    </h-row>

    <!-- 新增指标分配弹出框 -->
    <h-msg-box v-model="addWin" width="800" class="h-form-search-layer" :maximize="true"
               :mask-closable="false" @on-close="addFormClose()">
      <p slot="header">
        <span>产品利率匹配</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="80" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodNo" required>
            <h-select v-model="addForm.prodNo" placeholder="" @on-change="prodNoSelect()">
              <h-option value="0106">贴现</h-option>
              <h-option value="010602">回购式贴现</h-option>
              <h-option value="010612">极速贴现</h-option>
              <h-option value="00101001">系统内转贴现转入</h-option>
              <h-option value="00101002">系统外转贴现转入</h-option>
              <h-option value="00101004">质押式逆回购</h-option>
              <h-option value="00101005">买断式逆回购</h-option>
              <h-option value="00102001">系统内转贴现卖出</h-option>
              <h-option value="00102002">系统外转贴现卖出</h-option>
              <h-option value="00102003">再贴现买断</h-option>
              <h-option value="00102004">质押式正回购</h-option>
              <h-option value="00102005">买断式正回购</h-option>
              <h-option value="00102006">再贴现质押式回购</h-option>
              <h-option value="00409001">权属内转</h-option>
            </h-select>
          </h-form-item>
          <h-form-item label="指标名称" prop="kpiCodes" required>
            <h-select v-model="addForm.kpiCodes" placeholder="" multiple showTitle>
              <h-option v-for="item in kpiList" :value="item.kpiCode" :key="item.kpiCode"
                        v-if="showKpiByCondition(item)">{{item.kpiName}}
              </h-option>
            </h-select>
          </h-form-item>

          <h-form-item label="渠道" prop="channelNoArray" required v-if="authObj.showChannel">
            <h-select v-model="addForm.channelNoArray" placeholder="" multiple showTitle>
              <h-option v-for="item in channelList" :value="item.channelNo" :key="item.channelNo">{{item.channelName}}
              </h-option>
            </h-select>
          </h-form-item>

        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addFormClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="addFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 生成利率模板弹出框 -->
    <h-msg-box v-model="createRateWin" width="800" class="h-form-search-layer" :maximize="true"
               @on-close="closeCreateRate()" :mask-closable="false">
      <p slot="header">
        <span>生成模板</span>
      </p>
      <div>
        <h-form :model="createRateForm" :label-width="120" ref="createRateForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodName" required>
            <h-input v-model="createRateForm.prodName" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.channelNameArray')" prop="channelNoArray" required v-if="false">
            <h-input v-model="createRateForm.channelNoArray" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.channelNameArray')" prop="channelNameArray" required v-if="authObj.showChannel">
            <h-input v-model="createRateForm.channelNameArray" readonly></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required v-if="authObj.rateTemplateBillType" disabled>
            <h-checkbox-group v-model="createRateForm.billType">
              <h-checkbox label="AC01" disabled>银承</h-checkbox>
              <h-checkbox label="AC02" disabled>商承</h-checkbox>
            </h-checkbox-group>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required v-if="authObj.rateTemplateBillClass">
            <h-checkbox-group v-model="createRateForm.billClass">
              <h-checkbox label="ME01" disabled>纸票</h-checkbox>
              <h-checkbox label="ME02" disabled>电票</h-checkbox>
            </h-checkbox-group>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptTopBankLevel')" prop="acptBankLevel" required v-if="authObj.rateTemplateAcptBankLevel">
            <h-select v-model="createRateForm.acptBankLevel" placeholder="" multiple showTitle>
              <h-option v-for="item in acptBankLevelList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.acptBankType')" prop="acptBankType" required v-if="authObj.rateTemplateAcptBankType">
            <h-select v-model="createRateForm.acptBankType" placeholder="" multiple showTitle>
              <h-option v-for="item in acptBankTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.distClass')" prop="discBankLevel" required v-if="authObj.rateTemplateDiscBankLevel">
            <h-select v-model="createRateForm.discBankLevel" placeholder="" multiple showTitle>
              <h-option v-for="item in discBankLevelList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.corpScale')" prop="corpType" required v-if="authObj.rateTemplateCorpType">
            <h-select v-model="createRateForm.corpType" placeholder="" multiple showTitle>
              <h-option v-for="item in corpTypeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.billInfo.billMoneyByUnit')" prop="billAmt" required v-if="authObj.rateTemplateBillMoney" :validRules="billAmtArrRule">
            <h-input v-model="createRateForm.billAmt"
                     placeholder="金额从0开始，以英文逗号隔开，如'0,100,200'表示[0,100)、[100,200)、[200,无穷大)"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.remainingPeriod')" prop="residualTerm" required v-if="authObj.rateTemplateRemainDays" :validRules="dayArrRule">
            <h-input v-model="createRateForm.residualTerm"
                     placeholder="剩余期限从0开始，以英文逗号隔开，如'0,180,360'表示[0,180)、[180,360)、[360,无穷大)"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.bm.residueMonthNum')" prop="residueMonthNum" required v-if="authObj.rateTemplateResidueMonthNum" :validRules="monthArrRule">
            <h-input v-model="createRateForm.residueMonthNum"
                     placeholder="剩余跨月数量从0开始，以英文逗号隔开，如'0,5,12'表示[0,5)、[5,12)、[12,无穷大)"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.common.isGreenCorpFdisc')" prop="isGreenCorp" required v-if="authObj.rateTemplateIsGreenCorp">
            <h-checkbox-group v-model="createRateForm.isGreenCorp">
              <h-checkbox label="1" disabled>是</h-checkbox>
              <h-checkbox label="0" disabled>否</h-checkbox>
            </h-checkbox-group>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.isArcFdisc')" prop="isArc" required v-if="authObj.rateTemplateIsArc">
            <h-checkbox-group v-model="createRateForm.isArc">
              <h-checkbox label="1" disabled>是</h-checkbox>
              <h-checkbox label="0" disabled>否</h-checkbox>
            </h-checkbox-group>
          </h-form-item>

        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="closeCreateRate()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="createRateFormSubmit()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查看产品指标弹出框 -->
    <h-msg-box v-model="showProductKpiWin" width="800" class="h-form-table-layer" :maximize="true"
               :mask-closable="false">
      <!--弹出框模式标题-->
      <p slot="header">
        <span>查看产品指标</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="showKpiColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/bm/prod/guideRate/rateTemplate/func_queryProductRateKpiByPage"
                    :bindForm="showKpiFormItem"
                    @callback="callback('showKpiDatagrid')"
                    ref="showKpiDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
          </div>
        </h-datagrid>

      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="showProductKpiWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 利率模板管理弹出框 -->
    <h-msg-box v-model="showTemplateWin" class="h-form-table-layer" width="800" :maximize="true"
               @on-close="showTemplateWinClose" :mask-closable="false">
      <p slot="header">
        <span>利率模板管理</span>
      </p>
      <div>
        <!-- 数据展示表格 -->
        <h-datagrid :columns="showTemColumns"
                    highlight-row
                    :autoLoad="false"
                    url="/bm/prod/guideRate/rateTemplate/func_queryProductGuideTemplateByPage"
                    :bindForm="showTemFormItem"
                    @callback="callback('showRateDatagrid')"
                    :height="300"
                    :hasSelect="false"
                    rowSelect
                    ref="showRateDatagrid" class="pl-5 pr-5">
          <div slot="toolbar" class="pull-left">
            <h-button type="primary" @click="deleteShowTem()">{{$t("m.i.common.delete")}}</h-button>
          </div>
        </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="showTemplateWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "rateTemplate",
    data() {
      let formItem = {
        prodName: ""
      };
      let addForm = {
        prodNo: "",
        kpiCodes: [],
        channelNoArray:[],
      };
      let createRateForm = {
        prodNo: "",
        prodName: "",
        residualTerm: "",
        billAmt: "",
        billType: [],
        billClass: [],
        acptBankLevel: [],
        acptBankType: [],
        discBankLevel: [],
        residueMonthNum: "",
        corpType: [],
        channelNoArray:"",
        channelNameArray: "",
        isGreenCorp:[],
        isArc:[],
      };
      let showKpiFormItem = {
        prodNo: "",
        channelNoArray:"",
        channelNameArray:""
      };
      let showTemFormItem = {
        prodNo: "",
        channelNoArray:"",
        channelNameArray:""
      };
      let authObj = {
        rateTemplateBillType: false,
        rateTemplateBillClass: false,
        rateTemplateAcptBankLevel: false,
        rateTemplateAcptBankType: false,
        rateTemplateDiscBankLevel: false,
        rateTemplateBillMoney: false,
        rateTemplateRemainDays: false,
        rateTemplateResidueMonthNum: false,
        rateTemplateCorpType: false,
        rateTemplateIsGreenCorp : false,
        rateTemplateIsArc : false,
        rateTemAdd: true,
        rateTemDel: true,
        rateTemCreate: true,
        kpiView: true,
        rateTemManager: true,
        showChannel: false,//新增指标分配显示渠道
      };
      let columns = [
        {
          title: " ",
          type: "radio",
          align: "center",
          width: 50
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
          title: this.$t("m.i.common.prodNo"),
          key: "prodNo",
          ellipsis: false,
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",

          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.channelNameArray"),
          key: "channelNameArray",
          sortable: true,
          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.kpiCount'),
          key: "kpiCount",
          hiddenCol: false
        }
      ];
      let showKpiColumns = [
        {
          type: "selection",
          key: "multiSelect",
          width: 60,
          hiddenCol: true
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
          title: this.$t("m.i.common.prodNo"),
          key: "prodNo",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",

          hiddenCol: false
        },
        {
          title: this.$t("m.i.common.channelNameArray"),
          key: "channelNameArray",
          sortable: true,
          hiddenCol: true
        },
        {
          title: this.$t('m.i.bm.kpiName'),
          key: "kpiName",

          hiddenCol: false
        },
        {
          title: this.$t('m.i.bm.kpiScope'),
          key: "kpiScope",

          hiddenCol: false,
          render: (h, params) => {
            let kpiScope = params.row.kpiScope;
            switch (kpiScope) {
              case "1":
                return h("span", "必须");
              case "2":
                return h("span", "非必须");
            }
          }
        },
        {
          title: this.$t('m.i.bm.proposeKpiName'),
          key: "proposeKpiName",

          hiddenCol: false,
          render: (h, params) => {
            let proposeKpiName = params.row.proposeKpiName;
            return h("span", proposeKpiName ? proposeKpiName : "-");
          }
        },
        {
          title: this.$t('m.i.bm.proposeKpiItem'),
          key: "proposeKpiItem",

          hiddenCol: false,
          render: (h, params) => {
            let proposeKpiItem = params.row.proposeKpiItem;
            return h("span", proposeKpiItem ? proposeKpiItem : "-");
          }
        }
      ];
      let pageInfo = {
        pageNo: 1,
        pageSize: 10
      };
      return {
        formItem: formItem,
        addForm: addForm,
        createRateForm: createRateForm,
        showKpiFormItem: showKpiFormItem,
        showTemFormItem: showTemFormItem,
        authObj: authObj,
        columns: columns,
        showKpiColumns: showKpiColumns,
        pageInfo: pageInfo,
        selectData: null,
        showTemColumns: [],
        dictMap: new Map(),
        kpiList: [],
        kpiListStart: [],
        addWin: false,
        createRateWin: false,
        showTemplateWin: false,
        showProductKpiWin: false,
        submitFlag: false,
        readonly: false,
        acptBankLevelList: [],
        discBankLevelList: [],
        acptBankTypeList:[],
        corpTypeList: [],
        yonList:[],
        selectProductName: "",
        productTreeData: [],
        prodMap: new Map(),
        channelList:[],
        billAmtArrRule : [{ test: this.validBillAmtArr, trigger: "blur"}],
        dayArrRule : [{ test: this.validDayArr, trigger: "blur" }],
        monthArrRule : [{ test: this.validMonthArr, trigger: "blur"}],
      };
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,bankType,bankLevel,CorpScale,Yon").then(res => {
        this.acptBankLevelList = res.get("bankLevel");
        this.discBankLevelList = res.get("bankLevel");
        this.acptBankTypeList = res.get("bankType");
        this.corpTypeList = res.get("CorpScale");
        this.yonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
      post({}, "/bm/prod/guideRate/guideRateMain/func_getAllChannels").then(res => {
        if (res) {
          if (res.data.retCode === "000000") {
            this.channelList = res.data.retData;
          }
        }
      });
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = null;
      },
      //查询指标
      getKpi() {
        post({}, "/bm/prod/guideRate/rateTemplate/func_queryProductKpi").then(res => {
          if (res && res.data) {
            let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
            this.kpiList = data;
            this.kpiListStart = data;
            let list = this.kpiList;
            for (let i = 0; i < list.length; i++) {
              if (list[i].kpiScope === "1") {
                this.addForm.kpiCodes.push(list[i].kpiCode);
              }
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      prodNoSelect() {
        //产品为极速贴现时，显示【渠道】下拉框
        if(this.isChannelMode(this.addForm.prodNo)){
          this.authObj.showChannel = true;
        }else{
          this.authObj.showChannel = false;
        }
        if (this.addForm.prodNo === "0106" || this.addForm.prodNo === "010602" || this.addForm.prodNo === "010612") {
          this.kpiList = this.kpiListStart.filter(item => item.kpiCode != "discBankLevel");
        } else {
          this.kpiList = this.kpiListStart;
        }

        this.addForm.channelNoArray = [];
      },
      //条件判断显示
      showKpiByCondition(item) {
        item.hidden = true;
        if(item.kpiCode === "discBankType" || item.kpiCode === "acptBankType"){
          item.hidden = false;
        }
        if (this.addForm.prodNo === "0106" || this.addForm.prodNo === "010602" || this.addForm.prodNo === "010612") {
          if (item.kpiCode === "discBankLevel") {
            item.hidden = false;
          }
        }
        if (this.addForm.prodNo === "00101001" || this.addForm.prodNo === "00101002" || this.addForm.prodNo === "00101004" || this.addForm.prodNo === "00101005") {
          if (item.kpiCode === "corpType") {
            item.hidden = false;
          }
        }
        if(this.addForm.prodNo === "010612" || this.addForm.prodNo === "0106"){
          if (item.kpiCode === "acptBankType") {
            item.hidden = true;
          }
        }
        return item.hidden;
      },
      //产品查询确认
      productSelectedChange(arr) {
        this.formItem.prodName = arr[0].title;
      },
      //表单查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //新增指标分配
      addKpi() {
        this.$hMsgBox.confirm({
          title: "新增指标分配",
          content: "分配相同指标会覆盖，分配之后请进行生成模板操作！",
          onOk: () => {
            this.authObj.showChannel = false;
            this.addWin = true;
            this.$nextTick(() => {
              this.addFormReset();
              this.getKpi();
            });
          }
        });
      },
      // 新增指标分配弹出框提交
      addFormSubmit() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = "/bm/prod/guideRate/rateTemplate/func_addProductRateKpis";
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this);
                  this.addWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.selectData = null;
                  this.addFormClose();
                } else {
                  this.$msgTip.error(this, { info: msg });
                  this.$refs.datagrid.dataChange(1);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      addFormClose() {
        this.$refs.addForm.resetFields();
        this.addWin = false;
      },
      // 删除
      deleteKpi() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
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
        let delProdNo = this.selectData.prodNo;
        let channelNoArray = this.selectData.channelNoArray;
        post({ prodNo: delProdNo,channelNoArray:channelNoArray }, "/bm/prod/guideRate/rateTemplate/func_deleteProductRateKpisByProdNo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //生成利率模板
      createRateTemplate() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.authObj.rateTemplateBillType = false;
        this.authObj.rateTemplateBillClass = false;
        this.authObj.rateTemplateAcptBankLevel = false;
        this.authObj.rateTemplateAcptBankType = false;
        this.authObj.rateTemplateDiscBankLevel = false;
        this.authObj.rateTemplateCorpType = false;
        this.authObj.rateTemplateBillMoney = false;
        this.authObj.rateTemplateRemainDays = false;
        this.authObj.rateTemplateResidueMonthNum = false;
        this.authObj.rateTemplateIsGreenCorp = false;
        this.authObj.rateTemplateIsArc = false;
        this.$hMsgBox.confirm({
          title: "生成利率模板",
          content: "生成模板会将原先产品[ " + this.selectData.prodName + " ]对应的指标模板数据全部清除，是否确认生成？",
          onOk: () => {
            let channelNoArray = this.selectData.channelNoArray;
            post({ prodNo: this.selectData.prodNo,channelNoArray:channelNoArray }, "/bm/prod/guideRate/rateTemplate/func_queryProductRateKpi").then(res => {
              if (res && res.data) {
                this.$nextTick(() => {
                  this.createRateForm.prodName = this.selectData.prodName;
                  this.createRateForm.prodNo = this.selectData.prodNo;
                  this.createRateForm.channelNoArray = this.selectData.channelNoArray;
                  this.createRateForm.channelNameArray = this.selectData.channelNameArray;
                  let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
                  for (let item of data) {
                    if (item.kpiCode === "billType") {
                      this.createRateForm.billType = ["AC01", "AC02"];
                      this.authObj.rateTemplateBillType = true;
                    } else if (item.kpiCode === "billClass") {
                      this.createRateForm.billClass = ["ME01", "ME02"];
                      this.authObj.rateTemplateBillClass = true;
                    } else if (item.kpiCode === "acptBankLevel") {
                      this.authObj.rateTemplateAcptBankLevel = true;
                    } else if (item.kpiCode === "acptBankType") {
                      this.authObj.rateTemplateAcptBankType = true;
                    } else if (item.kpiCode === "discBankLevel") {
                      this.authObj.rateTemplateDiscBankLevel = true;
                    } else if (item.kpiCode === "corpType") {
                      this.authObj.rateTemplateCorpType = true;
                    } else if (item.kpiCode === "billMoney") {
                      this.authObj.rateTemplateBillMoney = true;
                    } else if (item.kpiCode === "remainDays") {
                      this.authObj.rateTemplateRemainDays = true;
                    } else if (item.kpiCode === "remainMonths") {
                      this.authObj.rateTemplateResidueMonthNum = true;
                    }else if (item.kpiCode === "isGreenCorp") {
                      this.createRateForm.isGreenCorp = ["1", "0"];
                      this.authObj.rateTemplateIsGreenCorp = true;
                    }else if (item.kpiCode === "isArc") {
                      this.createRateForm.isArc = ["1", "0"];
                      this.authObj.rateTemplateIsArc = true;
                    }
                  }
                  this.authObj.showChannel = false;
                  if(this.isChannelMode(this.selectData.prodNo)){
                    //产品走渠道模式，则显示【渠道】
                    this.authObj.showChannel = true;
                  }
                });
              }
              this.createRateWin = true;
            }).catch(error => {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
            });
          }
        });
      },
      closeCreateRate(){
        this.createRateFormReset();
        this.createRateWin=!this.createRateWin;
      },
      createRateFormSubmit() {
        this.$refs["createRateForm"].validate(valid => {
          if (valid) {
            let url = "/bm/prod/guideRate/rateTemplate/func_buildProductGuideTemplate";
            this.submitFlag = true;
            post(this.createRateForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.createRateWin = false;
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                  this.selectData = null;
                  this.createRateFormReset();
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
      createRateFormReset() {
        this.$refs.createRateForm.resetFields();
      },
      //查看产品指标
      viewProductKpi() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.showProductKpiWin = true;
        this.$nextTick(() => {
          this.showKpiFormItem.prodNo = this.selectData.prodNo;
          this.showKpiFormItem.channelNoArray = this.selectData.channelNoArray;
          this.showKpiFormItem.channelNameArray = this.selectData.channelNameArray;
          this.$refs.showKpiDatagrid.dataChange(1);
        });
      },
      callback(datagridRef) {
        if(this.isChannelMode(this.selectData.prodNo)){
          this.$refs[datagridRef].controlColumnsHidden("channelNameArray", false);
        }
      },
      showProductKpiWinClose() {
        this.showProductKpiWin = false;
      },
      //利率模板管理
      viewRateTemplate() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.showTemplateWin = true;
        this.$nextTick(() => {
          this.$refs.showRateDatagrid.tData = [];
          this.showTemColumns = [];
          this.showTemFormItem.prodNo = this.selectData.prodNo;
          this.showTemFormItem.channelNoArray = this.selectData.channelNoArray;
          this.showTemFormItem.channelNameArray = this.selectData.channelNameArray;
          let showTemProdNo = this.selectData.prodNo;
          let channelNoArray = this.selectData.channelNoArray;
          post({ prodNo: showTemProdNo,channelNoArray:channelNoArray }, "/bm/prod/guideRate/rateTemplate/func_queryProductRateKpiByPage").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                let list = res.data.retData.list;
                this.showTemColumns.push(
                  {
                    type: "selection",
                    width: 60,
                    hiddenCol: false,
                    align: "center"
                  },
                  {
                    type: "index",
                    title: this.$t("m.i.common.index"),
                    key: "numOrder",
                    width: 60,
                    align: "center",
                    hiddenCol: false
                  },
                  {
                    title: this.$t("m.i.common.prodName"),
                    key: "prodName",
                    hiddenCol: false
                  },
                  {
                    title: this.$t("m.i.common.channelNameArray"),
                    key: "channelNameArray",
                    sortable: true,
                    hiddenCol: true
                  },
                  {
                    title: this.$t('m.i.billInfo.billType'),
                    key: "billType",
                    hiddenCol: false,
                    render: (h, params) => {
                      return h("span", getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType));
                    }
                  }
                );
                for (let i = 0; i < list.length; i++) {
                  if (list[i].kpiCode === "billClass") {
                    this.showTemColumns.push({
                      title: this.$t('m.i.billInfo.billClass'),
                      key: "billClass",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass));
                      }
                    });
                  }
                  if (list[i].kpiCode === "isGreenCorp") {
                    this.showTemColumns.push({
                      title: this.$t('m.i.common.isGreenCorpFdisc'),
                      key: "isGreenCorp",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isGreenCorp));
                      }
                    });
                  }
                  if (list[i].kpiCode === "isArc") {
                    this.showTemColumns.push({
                      title: this.$t('m.i.common.isArcFdisc'),
                      key: "isArc",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", getDictValueFromMap(this.dictMap, "Yon", params.row.isArc));
                      }
                    });
                  }
                  if (list[i].kpiCode === "acptBankLevel") {
                    this.showTemColumns.push({
                      title: this.$t('m.i.billInfo.acptTopBankLevel'),
                      key: "acptBankLevel",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.acptBankLevel));
                      }
                    });
                  }
                  if (list[i].kpiCode === "acptBankType") {
                    this.showTemColumns.push({
                      title: this.$t('m.i.billInfo.acptBankType'),
                      key: "acptBankType",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", getDictValueFromMap(this.dictMap, "bankType", params.row.acptBankType));
                      }
                    });
                  }
                  if (list[i].kpiCode === "discBankLevel") {
                    this.showTemColumns.push({
                      title: "贴现行级别",
                      key: "discBankLevel",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", getDictValueFromMap(this.dictMap, "bankLevel", params.row.discBankLevel));
                      }
                    });
                  }
                  if (list[i].kpiCode === "corpType") {
                    this.showTemColumns.push({
                      title: this.$t('m.i.common.corpScale'),
                      key: "corpType",
                      hiddenCol: false,
                      render: (h, params) => {
                        return h("span", getDictValueFromMap(this.dictMap, "CorpScale", params.row.corpType));
                      }
                    });
                  }
                  if (list[i].kpiCode === "billMoney") {
                    this.showTemColumns.push({
                      title: "最小票面金额(元)",
                      key: "minBillAmt",
                      hiddenCol: false
                    }, {
                      title: "最大票面金额(元)",
                      key: "maxBillAmt",
                      hiddenCol: false
                    });
                  }
                  if (list[i].kpiCode === "remainDays") {
                    this.showTemColumns.push({
                      title: "最小剩余期限(天)",
                      key: "minResidualTerm",
                      hiddenCol: false
                    }, {
                      title: "最大剩余期限(天)",
                      key: "maxResidualTerm",
                      hiddenCol: false
                    });
                  }
                  if (list[i].kpiCode === "remainMonths") {
                    this.showTemColumns.push({
                      title: "最小剩余跨月数量(月)",
                      key: "minResidueMonthNum",
                      hiddenCol: false
                    }, {
                      title: "最大剩余跨月数量(月)",
                      key: "maxResidueMonthNum",
                      hiddenCol: false
                    });
                  }
                }
                this.$nextTick(() => {
                  this.$refs.showRateDatagrid.dataChange(1);
                  this.$refs.showRateDatagrid.createShowCol(this.showTemColumns);
                });
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            }
          });
          if(this.isChannelMode(this.selectData.prodNo)){
            this.$refs.showRateDatagrid.controlColumnsHidden("channelNameArray", false);
          }
        });
      },
      //利率模板删除
      deleteShowTem() {
        if (this.$refs.showRateDatagrid.selects.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDelShowTem();
          }
        });
      },
      handleDelShowTem() {
        let list = this.$refs.showRateDatagrid.selects;
        let channelNoArray = this.selectData.channelNoArray;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i].id;
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ ids: ids,channelNoArray: channelNoArray }, "/bm/prod/guideRate/rateTemplate/func_deleteProductGuideTemplateByIds").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.showRateDatagrid.dataChange(this.$refs.showRateDatagrid.$refs.gridPage.currentPage);
              this.$refs.showRateDatagrid.selects = [];
              this.$refs.showRateDatagrid.selectIds = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.showRateDatagrid.dataChange(this.$refs.showRateDatagrid.$refs.gridPage.currentPage);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      showTemplateWinClose() {
        this.showTemplateWin = false;
      },
      //重置新增/修改窗口
      addFormReset() {
        this.$refs.addForm.resetFields();
      },
      //判断是否是渠道模式
      isChannelMode(prod){
        this.prodMap.set("010612",true);
        return this.prodMap.get(prod);
      },
      validBillAmtArr(rule, val, callback){
        debugger;
        let valArr = [];
        valArr = val.split(",");
        if (valArr.length < 2) {
          callback(new Error("请至少输入两个，如：0,1"));
        }
        for(let i =0; i < valArr.length; i++){
          let re = /^(?:[1-9]\d{0,9}|0)(?:\.\d{1,2})?$/;
          if (i == 0 && Number(valArr[i]) != 0) {
            callback(new Error("第一位值必须为0"));
          } else if(i >= 0 && !re.test(valArr[i])){
            callback(new Error("票据金额(元)第" + ( i + 1 ) + "位[" + valArr[i] + "]不符合规范，必须为大于等于0的不超过10位的数字，且小数位不超过两位"));
          } else if(i > 0 && Number(valArr[i]) <= Number(valArr[i-1])) {
            callback(new Error("票据金额(元)区间中，边界值必须不断增加，第" + ( i + 1 ) + "位票据金额(元)[" + valArr[i] + "]小于等于第" + ( i ) + "位[" + valArr[i - 1] + "]"));
          }
        }
        callback();
      },
      validDayArr(rule, val, callback){
        let valArr = [];
        valArr = val.split(",");
        if (valArr.length < 2) {
          callback(new Error("请至少输入两个，如：0,1"));
        }
        for(let i =0; i < valArr.length; i++){
          let re = /^(0|\+?[1-9]\d{0,2})$/;
          if (i == 0 && Number(valArr[i]) != 0) {
            callback(new Error("第一位值必须为0"));
          } else if(i >= 0 && !re.test(valArr[i])) {
            callback(new Error("剩余期限(天)第" + ( i + 1 ) + "位[" + valArr[i] + "]不符合规范，必须为3位以内正整数"));
          } else if(i > 0 && Number(valArr[i]) <= Number(valArr[i-1])) {
            callback(new Error("剩余期限(天)区间中，边界值必须不断增加，第" + ( i + 1 ) + "位剩余期限(天)[" + valArr[i] + "]小于等于第" + ( i ) + "位[" + valArr[i - 1] + "]"));
          }
        }
        callback();
      },
      validMonthArr(rule, val, callback){
        let valArr = [];
        valArr = val.split(",");
        if (valArr.length < 2) {
          callback(new Error("请至少输入两个，如：0,1"));
        }
        for(let i =0; i < valArr.length; i++){
          let re = /^(0|\+?[1-9]\d{0,1})$/;
          if (i == 0 && Number(valArr[i]) != 0) {
            callback(new Error("第一位值必须为0"));
          } else if(i >= 0 && !re.test(valArr[i])) {
            callback(new Error("剩余跨月数量第" + ( i + 1 ) + "位[" + valArr[i] + "]不符合规范，必须为2位以内正整数"));
          } else if(i > 0 && Number(valArr[i]) <= Number(valArr[i-1])) {
            callback(new Error("剩余跨月数量区间中，边界值必须不断增加，第" + ( i + 1 ) + "位剩余跨月数量[" + valArr[i] + "]小于等于第" + ( i ) + "位[" + valArr[i - 1] + "]"));
          }
        }
        callback();
      },
    }
  };
</script>

<style scoped>

</style>
