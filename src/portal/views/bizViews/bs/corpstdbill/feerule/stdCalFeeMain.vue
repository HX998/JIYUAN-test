<!--计费规则管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--手续费品种-->
                <common-select v-model="formItem.prodNo" :label="$t('m.i.bs.stdFeeType')" prop="prodNo"
                               :dictList="stdFeeTypeList" ></common-select>
                <!--计费方式-->
                <common-select v-model="formItem.calFeeType" :label="$t('m.i.bs.calFeeMode')" prop="calFeeType"
                               :dictList="calFeeTypeList" ></common-select>
                <!--状态-->
                <common-select v-model="formItem.activeFlag" :label="$t('m.i.common.status')" prop="activeFlag"
                               :dictList="activeFlagList" ></common-select>

                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/bs/corpstdbill/feerule/stdCalFeeMain/func_queryCalFeeRulePage"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
             <div slot="toolbar" class="pull-left">
               <h-button type="primary" @click="editCalFeeRule('add')">{{$t('m.i.common.add')}}</h-button>
               <h-button type="primary" @click="editCalFeeRule('modify')">{{$t('m.i.common.modify')}}</h-button>
               <h-button type="primary" @click="deleteCalFeeRule()">{{$t('m.i.common.delete')}}</h-button>
               <h-button type="primary" @click="enableCalFeeRule()">{{$t('m.i.bs.enable')}}</h-button>
               <h-button type="primary" @click="disableCalFeeRule()">{{$t('m.i.bs.disable')}}</h-button>
             </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--新增、修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span v-if="addOrEditType==='add'">规则新增</span>
        <span v-else-if="addOrEditType==='modify'">规则修改</span>
        <span v-else-if="addOrEditType==='view'">规则详情</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">

          <!--手续费品种-->
          <common-select v-model="addForm.prodNo" :label="$t('m.i.bs.stdFeeType')" prop="prodNo"
                         :dictList="stdFeeTypeList" :required="addOrEditType!=='view'" :readonly="addOrEditType!=='add'"></common-select>
          <!--控制模式-->
          <common-select v-model="addForm.controlMode" :label="$t('m.i.bs.controlMode')" prop="controlMode"
                         :dictList="controlModeList" :required="addOrEditType!=='view'"  :readonly="addOrEditType=='view'"></common-select>
          <!--计费方式-->
          <common-select v-model="addForm.calFeeType" :label="$t('m.i.bs.calFeeMode')" prop="calFeeType"
                         :dictList="calFeeTypeList" :required="addOrEditType!=='view'"  :readonly="addOrEditType=='view'"></common-select>
          <!--费率-->
          <common-input  v-model="addForm.feeRatePct" :label="$t('m.i.bs.feeRatePct')" prop="feeRatePct"
                        :required="addOrEditType!=='view'" :readonly="addOrEditType=='view'"  :maxlength="20" :validRules="this.ratePerRule"  ></common-input>

        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="addOrEditType!=='view'" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { on, off, post, formatNumber } from "@/api/bizApi/commonUtil";

  export default {
    name: "stdCalFeeMain",
    data(){
      return {
        ratePerRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?)$/,   //|100|100\.00
          trigger: "blur",
          message: "费率范围0~100(不包括100)，且小数位不超过四位"
        }],
        columns : [  //产品名称 计费类型 控制方式 状态
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
            title: this.$t("m.i.bs.stdFeeType"),
            key: "prodName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showInfoDetail(params.row);
                  }
                }
              }, params.row.prodName);
            }
          },
          {
            title: this.$t("m.i.bs.calFeeMode"),
            key: "calFeeType",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
              render: (h, params) => {
                let list = this.getDictValueFromMap(this.dictMap, "CalFeeType", params.row.calFeeType);
                return h("span",
                  {
                    domProps: {
                      title: list
                    }
                  }, list);
              }
          },
          {
            title: this.$t("m.i.bs.controlMode"),
            key: "controlMode",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CalFeeRuleControlMode", params.row.controlMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.status"),
            key: "activeFlag",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CalFeeRuleActiveFlag", params.row.activeFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        formItem : {
          prodName:"",
          prodNo:"",
          calFeeType:"",
          activeFlag:"",
        },
        addForm : {
          id:"",
          prodName:"",
          prodNo:"",
          calFeeType:"",
          activeFlag:"",
          controlMode:"",
          feeRatePct:"",
        },
        currentSelectRow : null,
        dictMap : new Map(),
        activeFlagList : [],
        controlModeList : [],
        calFeeTypeList : [],

        stdFeeTypeList:[],

        // 是否显示新增或修改窗口
        addOrEditWin: false,
        addOrEditType: '',
        readonly: false,
        isRequired: true,
        ifShowMore : false,

      }

    },
    components: {

    },
    methods: {
      formSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.prodName = "";
        this.formItem.prodNo = "";
        this.formItem.activeFlag = "";
        this.formItem.calFeeType = "";
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //新增、修改
      editCalFeeRule(str) {
        this.addOrEditType = str;

        if(this.addOrEditType == "modify"){
          if(this.currentSelectRow == null || this.currentSelectRow.length == 0){
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            this.addOrEditWin = false;
            return false;
          }
          if(this.currentSelectRow.activeFlag == '1'){
            this.$msgTip.info(this, { info: this.$t("m.i.bs.disableUpdate") });
          }else{
            this.addOrEditWin = true;
            this.addForm.id = this.currentSelectRow.id;
            this.addForm.prodName = this.currentSelectRow.prodName;
            this.addForm.prodNo = this.currentSelectRow.prodNo;
            this.addForm.calFeeType = this.currentSelectRow.calFeeType;
            this.addForm.activeFlag = this.currentSelectRow.activeFlag;
            this.addForm.controlMode = this.currentSelectRow.controlMode;
            this.addForm.feeRatePct = this.currentSelectRow.feeRatePct;
          }
        }else if(this.addOrEditType == "add"){
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
      },
      //删除
      deleteCalFeeRule(){
        if(this.currentSelectRow == null || this.currentSelectRow.length == 0){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }else {
          if(this.currentSelectRow.activeFlag == '1'){
            this.$msgTip.info(this,{info:this.$t('m.i.bs.disableDelete')});
          }else{
            this.$hMsgBox.confirm({
              title: this.$t('m.i.common.confirm'),
              content: this.$t('m.i.common.isConfirmDelete') + '?',
              onOk: () => {
                this.handledel();
              }
            })
          }
        }
      },
      //确认删除
      handledel(){
        let delId = this.currentSelectRow.id;
        post({id:delId},'bs/corpstdbill/feerule/stdCalFeeMain/func_deleteCalFeeRuleInfo').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },
      //启用规则
      enableCalFeeRule(){
        if(this.currentSelectRow == null || this.currentSelectRow.length == 0){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }else {
          if(this.currentSelectRow.activeFlag == '1'){
            this.$msgTip.info(this,{info:this.$t('m.i.bs.repAble')});
          }else{
            let enableId = this.currentSelectRow.id;
            post({id:enableId},'bs/corpstdbill/feerule/stdCalFeeMain/func_enableCalFeeRuleInfo').then(res => {
              if(res){
                let retCode = res.data.retCode
                if(retCode=="000000"){
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                }else{
                  this.$msgTip.error(this,{info:res.data.retMsg})
                }
              }else{
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
              }
            });
          }
        }
      },
      //禁用规则
      disableCalFeeRule(){
        if(this.currentSelectRow == null || this.currentSelectRow.length == 0){
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }else {
          if(this.currentSelectRow.activeFlag == '0'){
            this.$msgTip.info(this,{info:this.$t('m.i.bs.repDisable')});
          }else{
            this.$hMsgBox.confirm({
              title: this.$t('m.i.common.confirm'),
              content: this.$t('m.i.bs.isdisableRule') + '?',
              onOk: () => {
                this.handledisable();
              }
            })
          }
        }
      },
      //确认禁用
      handledisable(){
        let disableId = this.currentSelectRow.id;
        post({id:disableId},'bs/corpstdbill/feerule/stdCalFeeMain/func_disableCalFeeRuleInfo').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },

      addFormReset(){
        this.$refs.addForm.resetFields();
        this.addForm.id = '';
        this.addForm.prodName = '';
        this.addForm.prodNo = '';
        this.addForm.calFeeType = '';
        this.addForm.activeFlag = '';
        this.addForm.controlMode = '';
        this.addForm.feeRatePct='';
      },
      handleWinClose() {
        this.addOrEditWin = false;
        this.addFormReset();
      },
      //保存
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.addOrEditType === "add" ?
              "bs/corpstdbill/feerule/stdCalFeeMain/func_addCalFeeRuleInfo" :
              "bs/corpstdbill/feerule/stdCalFeeMain/func_updateCalFeeRuleInfo";
            post(this.addForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.addFormReset();
                  this.addOrEditWin = false;
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
      //查看详情
      showInfoDetail(list){
        this.addOrEditWin = true;
        this.addOrEditType = "view";
        this.addForm.prodNo = list.prodNo;
        this.addForm.prodName = list.prodName;
        this.addForm.controlMode = list.controlMode;
        this.addForm.activeFlag = list.activeFlag;
        this.addForm.feeRatePct = list.feeRatePct;
        this.addForm.calFeeType = list.calFeeType;
      },
    },
    mounted() {
      //this.getProNo();
      this.getDictListByGroups("CalFeeRuleActiveFlag,CalFeeRuleControlMode,CalFeeType,StdFeeType").then(res => {
        this.activeFlagList = res.get("CalFeeRuleActiveFlag");
        this.controlModeList = res.get("CalFeeRuleControlMode");
        this.calFeeTypeList = res.get("CalFeeType");
        this.stdFeeTypeList= res.get("StdFeeType");
        debugger
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
