<!-- 贴现额度管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item  :label="$t('m.i.pc.limitType')" prop="limitType">
                  <h-select  v-model="formItem.limitType" placeholder="">
                    <h-option v-for="item in creditLimitTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <show-branch v-model="formItem.belongBrchNo" :label="$t('m.i.common.brchName')" prop="belongBrchNo"
                             title="机构名称" :brchNo.sync="formItem.belongBrchNo" :brchName.sync="formItem.belongBrchName"
                             @on-click="queryBrchNo('formItem')" @brchNoChange="brchNoChange">
                </show-branch>
                <h-form-item :label="$t('m.i.common.activeDt')" prop="activeDt">
                  <h-date-picker :value="formItem.activeDt" type="date" :editable=false
                                 :showFormat=true placeholder="" @on-change="handleActiveDt"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.failureDt')" prop="failureDt">
                  <h-date-picker :value="formItem.failureDt" type="date" :editable=false
                                 :showFormat=true placeholder="" @on-change="handleFailureDt"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.dpstDt')" prop="applDt">
                  <h-date-picker :value="formItem.applDt" type="date" :editable=false
                                 :showFormat=true placeholder="" @on-change="handleDpstDt"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.flowStatus')" prop="flowStatus">
                  <h-select  v-model="formItem.flowStatus" placeholder="">
                    <h-option  value="0">申请待提交</h-option>
                    <h-option  value="1">提交待复核</h-option>
                    <h-option  value="2">审批中</h-option>
                    <h-option  value="3">复核通过</h-option>
                    <h-option  value="4">复核失败</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/credit/discCreditManager/getCreditScaleList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')" >
                {{$t("m.i.common.add")}}
              </h-button>
              <h-button type="primary" @click="handleAddForm('modify')" >
                {{$t("m.i.common.modify")}}
              </h-button>
              <h-button type="primary" @click="handleComfirm" >
                {{$t("m.i.common.delete")}}
              </h-button>
              <h-button type="primary" @click="handleApplyCheck" >
                {{$t("m.i.common.submitCheck")}}
              </h-button>
              <h-button type="primary" @click="creditScaleCancel" >
                {{$t("m.i.common.cancel")}}
              </h-button>
              <h-button type="primary" @click="showCorpCreditDetail" >
                {{$t("m.i.pc.companyLimitDetail")}}
              </h-button>
              <h-button type="primary" @click="showBranchCreditDetail" >
                {{$t("m.i.pc.brchBusiLimitDetail")}}
              </h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--企业额度明细查询弹框-->
    <h-msg-box v-model="showCorpCreditDetailWin" width="800" :mask-closable="false" @on-close="showCorpCreditDetailClose" top="10"
               class="h-form-table-layer" :maximize="true" >
      <p slot="header">
        <span>企业额度明细查询</span>
      </p>
      <div>
        <div class="h-form-search-box">
          <h-form :model="corpFormItem" :label-width="90" ref="corpFormItem" cols="4" class="h-form-search">
            <show-branch v-model="corpFormItem.brchNo" :label="$t('m.i.common.brchName')" prop="brchNo"
                         title="机构名称" :brchNo.sync="corpFormItem.brchNo" :brchName.sync="corpFormItem.brchName"
                         @on-click="queryBrchNo('corpFormItem')" @brchNoChange="brchNoChange">
            </show-branch>
            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="corpFormSearch()">{{$t("m.i.common.search")}}
              </h-button>
              <h-button type="ghost" @click="corpFormSearchReset()">{{$t("m.i.common.reset")}}
              </h-button>
            </h-form-item>
          </h-form>
        </div>
      </div>
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="corpCreditDetailColumns"
            :url="this.corpCreditListUrl"
            highlightRow
            :auto-load="false"
            :bindForm="corpFormItem"
            :rowSelect="true"
            ref="corpCreditDatagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
      <div slot="footer">
        <h-button type="ghost" @click="showCorpCreditDetailClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!--机构额度明细查询弹框-->
    <h-msg-box v-model="showBranchCreditDetailWin" width="800" :mask-closable="false" @on-close="showBranchCreditDetailClose" top="10"
               class="h-form-table-layer" :maximize="true" >
      <p slot="header">
        <span>机构额度明细查询</span>
      </p>
      <div>
        <div class="h-form-search-box">
          <h-form :model="brchFormItem" :label-width="90" ref="brchFormItem" cols="4" class="h-form-search">
            <show-branch v-model="brchFormItem.brchNo" :label="$t('m.i.common.brchName')" prop="brchNo"
                         title="机构名称" :brchNo.sync="brchFormItem.brchNo" :brchName.sync="brchFormItem.brchName"
                         @on-click="queryBrchNo('brchFormItem')" @brchNoChange="brchNoChange">
            </show-branch>
            <h-form-item class="h-form-operate">
              <h-button type="primary" @click="brchFormSearch()">{{$t("m.i.common.search")}}
              </h-button>
              <h-button type="ghost" @click="brchFormSearchReset()">{{$t("m.i.common.reset")}}
              </h-button>
            </h-form-item>
          </h-form>
        </div>
      </div>
      <h-row>
        <h-col span="24">
          <h-datagrid
            :columns="brchCreditDetailColumns"
            :url="this.branchCreditListUrl"
            highlightRow
            :auto-load="false"
            :bindForm="brchFormItem"
            :rowSelect="true"
            ref="brchCreditDatagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </h-col>
      </h-row>
      <div slot="footer">
        <h-button type="ghost" @click="showBranchCreditDetailClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="type==='add'">新增额度规模</span>
        <span v-if="type==='modify'">修改额度规模</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item  :label="$t('m.i.pc.limitType')" prop="limitType" required>
            <h-select  v-model="addForm.limitType" placeholder="">
              <h-option v-for="item in creditLimitTypeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item  :label="$t('m.i.pc.totalLimitAmt')" prop="totalLimitAmt" required>
            <h-typefield v-model="addForm.totalLimitAmt"  :maxlength=60 placeholder="" type="money"
                         bigTips></h-typefield>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.activeDt')" prop="activeDt" required>
            <h-date-picker v-model="addForm.activeDt" type="date" :editable=false
                           :showFormat=true placeholder="" @on-change="handleAddFormActiveDt"></h-date-picker>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.failureDt')" prop="failureDt" required>
            <h-date-picker v-model="addForm.failureDt" type="date" :editable=false
                           :showFormat=true placeholder="" @on-change="handleAddFormFailureDt"></h-date-picker>
          </h-form-item>
          <show-branch v-model="addForm.belongBrchName" :label="$t('m.i.common.brchName')" prop="belongBrchName" required :showCheckBox="false"
                       title="机构名称" :brchNo.sync="addForm.belongBrchNo" :brchName.sync="addForm.belongBrchName" :msgBoxWin="addOrEditWin"
                       @on-click="queryBrchNo('addForm')" @brchNoChange="brchNoChange">
          </show-branch>
          <h-form-item  :label="$t('m.i.pc.usedLimitAmt')" prop="usedLimitAmt">
            <h-typefield v-model="addForm.usedLimitAmt"  :maxlength=60 placeholder="" type="money"
                         bigTips readonly></h-typefield>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>
<script>
  import { on, off, post } from "@/api/bizApi/commonUtil";
  import { formatNumber } from "../../../../api/bizApi/commonUtil";



  export default {
    name: "discCreditManager",
    data() {
      return {
        submitFlag: false,
        ifShowMore : false,
        columns : [
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
            title: this.$t("m.i.pc.limitType"),
            key: "limitType",
            hiddenCol: false,
            width: 120,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "LimitType", params.row.limitType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.totalLimitAmt"),
            key: "totalLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.totalLimitAmt, 2, ','))
              ]);
            }
          },
          // {
          //   title: this.$t("m.i.pc.usedLimitAmt"),
          //   key: "usedLimitAmt",
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     return h('div', [
          //       h('span', formatNumber(params.row.usedLimitAmt, 2, ','))
          //     ]);
          //   }
          // },
          // {
          //   title: this.$t("m.i.pc.noUsedLimitAmt"),
          //   key: "noUsedLimitAmt",
          //   hiddenCol: false,
          //   render: (h, params) => {
          //     return h('div', [
          //       h('span', formatNumber(params.row.noUsedLimitAmt, 2, ','))
          //     ]);
          //   }
          // },
          {
            title: this.$t("m.i.common.activeDt"),
            key: "activeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.failureDt"),
            key: "failureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.failureDt == null ? "" : this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "belongBrchName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.pe.dpstDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.applTellerName"),
            key: "createTellerName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.flowStatus"),
            key: "flowStatus",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.flowStatus==='0') return h('span','申请待提交')
              else if(params.row.flowStatus==='1') return h('span','提交待复核')
              else if(params.row.flowStatus==='2') return h('span','审批中')
              else if(params.row.flowStatus==='3') return h('span','复核通过')
              else if(params.row.flowStatus==='4') return h('span','复核失败')
            }
          }
        ],
        corpCreditDetailColumns : [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.custNo"),
            key: "custNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.custName"),
            key: "custName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.totalLimitAmt"),
            key: "totalLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.totalLimitAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.usedLimitAmt"),
            key: "usedLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.usedLimitAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.noUsedLimitAmt"),
            key: "noUsedLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.noUsedLimitAmt, 2, ','))
              ]);
            }
          },
        ],
        brchCreditDetailColumns :[
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.brchName"),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.totalLimitAmt"),
            key: "totalLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.totalLimitAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.common.activeDt"),
            key: "activeDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.activeDt == null ? "" : this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.common.failureDt"),
            key: "failureDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.failureDt == null ? "" : this.$moment(params.row.failureDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.usedLimitAmt"),
            key: "usedLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.usedLimitAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.noUsedLimitAmt"),
            key: "noUsedLimitAmt",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', formatNumber(params.row.noUsedLimitAmt, 2, ','))
              ]);
            }
          },
          {
            title: this.$t("m.i.pc.applTellerName"),
            key: "createTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pe.dpstDt"),
            key: "applDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.applDt == null ? "" : this.$moment(params.row.applDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
        ],
        formItem : {
          legalNo:"",
          belongBrchNo:"",
          belongBrchName:"",
          limitType: "",
          activeDt: "",
          failureDt: "",
          applDt: "",
          flowStatus:"",
        },
        addForm : {
          id:"",
          limitType: "",
          totalLimitAmt: "",
          activeDt: "",
          failureDt: "",
          belongBrchNo:"",
          belongBrchName:"",
          usedLimitAmt: "",
          flowStatus:"",
        },
        corpFormItem : {
          brchNo:"",
          brchName:"",
        },
        brchFormItem:{
          brchNo:"",
          brchName:"",
        },
        limitTypeC:"",
        brchT:null,
        type : null,
        addOrEditWin : false,
        dictMap : new Map(),
        currentSelectRow : null,
        creditLimitTypeList:[],
        showCorpCreditDetailWin:false,
        showBranchCreditDetailWin:false,
        corpCreditListUrl:"",
        branchCreditListUrl:"",
        ifCheckTrue:true,
      };
    },
    components: {

    },
    mounted() {
      this.getDictListByGroups("LimitType,map").then(res => {
        this.creditLimitTypeList = res.get("LimitType");
        this.dictMap = res.get("map");
      });
    },
    watch:{
      'addForm.limitType'(val){
        if (!!val) {
          this.limitTypeChange(val);
        }
      }
    },
    methods: {
      handleFailureDt(value){
        this.formItem.failureDt = value.replace(/-/g, "");
      },
      handleActiveDt(value) {
        this.formItem.activeDt = value.replace(/-/g, "");
      },
      handleAddFormFailureDt(value){
        this.addForm.failureDt = value.replace(/-/g, "");
      },
      handleAddFormActiveDt(value) {
        this.addForm.activeDt = value.replace(/-/g, "");
      },
      handleDpstDt(value) {
        this.formItem.applDt = value.replace(/-/g, "");
      },
      limitTypeChange(value) {
        this.limitTypeC = value;
        if (this.limitTypeC==="1" && this.addForm.belongBrchNo!==""){
          this.getCorpCreditUsedLimitAmt();
        }
        if(this.limitTypeC==="2" && this.addForm.belongBrchNo!==""){
          this.getUsedLimitAmt();
        }
      },
      //查询机构弹出框
      queryBrchNo(type) {
        this.brchT = type;
      },

      //根据弹框所选数据进行赋值
      brchNoChange(info) {
        if(this.type === "add"){
          if(this.limitTypeC==="2"){
            //调用机构额度查询方法
            this.getUsedLimitAmt();
          } else {
            //调用查询企业额度规模方法
            this.getCorpCreditUsedLimitAmt();
          }
        }
      },


      //提交复核handleApplyCheck
      handleApplyCheck() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定提交复核吗?",
            onOk: () => {
              this.applyCheck();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      applyCheck() {
        let id = this.currentSelectRow.id;
        let activeFlag = this.currentSelectRow.activeFlag;
        let flowStatus = this.currentSelectRow.flowStatus;
        post({ id: id,activeFlag:activeFlag,flowStatus:flowStatus }, "/pc/credit/discCreditManager/applyCheck").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //撤销
      creditScaleCancel() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: "确定撤销申请吗?",
            onOk: () => {
              this.handleCancel();
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleCancel() {
        let id = this.currentSelectRow.id;
        let flowStatus = this.currentSelectRow.flowStatus;
        post({ id: id,flowStatus:flowStatus}, "/pc/credit/discCreditManager/cancelApply").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
              this.noCommitButton();
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      corpFormSearch() {
        this.$refs.corpCreditDatagrid.dataChange(1);
      },
      corpFormSearchReset() {
        this.corpFormItem.brchName="";
        this.corpFormItem.brchNo="";
      },
      brchFormSearch(){
        this.$refs.brchCreditDatagrid.dataChange(1);
      },
      brchFormSearchReset() {
        this.brchFormItem.brchNo="";
        this.brchFormItem.brchName="";
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.belongBrchNo="";
        this.formItem.belongBrchName="";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleWinClose() {
        this.$refs.addForm.resetFields();
        this.addForm.id="";
        this.addForm.limitType="";
        this.addForm.totalLimitAmt="";
        this.addForm.activeDt= "";
        this.addForm.failureDt="";
        this.addForm.belongBrchNo="";
        this.addForm.belongBrchName="";
        this.addForm.usedLimitAmt= "";
        this.ifCheckTrue = true;
        this.addOrEditWin = false;
      },
      // 新增/修改额度批次
      handleAddForm(str) {
        this.type = str;
        if (this.type === "modify") {
          if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
            this.addForm.id = this.currentSelectRow.id;
            this.addForm.limitType = this.currentSelectRow.limitType;
            this.addForm.totalLimitAmt = this.currentSelectRow.totalLimitAmt;
            this.addForm.activeDt = this.$moment(this.currentSelectRow.activeDt, "YYYYMMDD").format("YYYY-MM-DD");
            this.addForm.failureDt = this.$moment(this.currentSelectRow.failureDt, "YYYYMMDD").format("YYYY-MM-DD");
            this.addForm.belongBrchNo = this.currentSelectRow.belongBrchNo;
            this.addForm.belongBrchName = this.currentSelectRow.belongBrchName;
            this.addForm.usedLimitAmt = this.currentSelectRow.usedLimitAmt;
            this.addForm.flowStatus = this.currentSelectRow.flowStatus;
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
        this.ifCheckTrue = false;
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
        this.addForm.id="";
        this.addForm.limitType="";
        this.addForm.totalLimitAmt="";
        this.addForm.activeDt= "";
        this.addForm.failureDt="";
        this.addForm.belongBrchNo="";
        this.addForm.belongBrchName="";
        this.addForm.usedLimitAmt= "";
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            this.addForm.activeDt = this.addForm.activeDt.replace(/-/g, "");
            this.addForm.failureDt = this.addForm.failureDt.replace(/-/g, "");
            let url = this.type === "add" ? "/pc/credit/discCreditManager/saveDiscCreditScale" : "/pc/credit/discCreditManager/updateDiscCreditScale";
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.ifCheckTrue = true;
                  let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.currentSelectRow = [];
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
      //删除额度规模
      handleComfirm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
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
      handleDel() {
        let id = this.currentSelectRow.id;
        let activeFlag = this.currentSelectRow.activeFlag;
        let flowStatus = this.currentSelectRow.flowStatus;
        post({ id: id ,activeFlag:activeFlag,flowStatus:flowStatus }, "/pc/credit/discCreditManager/deleteDiscCreditScale").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      /**企业额度明细查询*/
      showCorpCreditDetail() {
        this.corpCreditListUrl = "/pc/credit/discCreditManager/getCorpCreditList";
        this.showCorpCreditDetailWin = true;
        this.$nextTick(() => {
          if (this.$refs.corpCreditDatagrid != null) {
            this.$refs.corpCreditDatagrid.dataChange(1);
          }
        });
      },
      showCorpCreditDetailClose(){
        this.showCorpCreditDetailWin = false;
      },
      /**机构额度明细查询*/
      showBranchCreditDetail() {
        this.branchCreditListUrl = "/pc/credit/discCreditManager/getBrchBusiLimit";
        this.showBranchCreditDetailWin = true;
        this.$nextTick(() => {
          if (this.$refs.brchCreditDatagrid != null) {
            this.$refs.brchCreditDatagrid.dataChange(1);
          }
        });
      },
      showBranchCreditDetailClose(){
        this.showBranchCreditDetailWin = false;
      },
      //查询机构额度已用额度
      getUsedLimitAmt() {
        let brchNo = this.addForm.belongBrchNo;
        let legalNo = JSON.parse(window.sessionStorage.getItem('userInfo')).legalNo;
        let url = "/pc/credit/discCreditManager/getBrchBusiLimit";
        post({ brchNo: brchNo,legalNo:legalNo }, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                if(res.data.retData.list!==null){
                  this.addForm.usedLimitAmt = res.data.retData.list[0].usedLimitAmt;
                }else {
                  this.addForm.usedLimitAmt = "0";
                }
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
      //查询企业额度规模表中的已用额度
      getCorpCreditUsedLimitAmt() {
        //let belongBrchNo = this.addForm.belongBrchNo;
        let legalNo = JSON.parse(window.sessionStorage.getItem('userInfo')).legalNo;
        let url = "/pc/credit/discCreditManager/getCorpCreditScale";
        post({ legalNo:legalNo}, url).then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$nextTick(() => {
                if(res.data.retData.list!==null){
                  this.addForm.usedLimitAmt = res.data.retData.list[0].usedLimitAmt;
                }else {
                  this.addForm.usedLimitAmt = "0";
                }
              });
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          }
        }).catch(error => {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
        });
      },
    }
  };
</script>
