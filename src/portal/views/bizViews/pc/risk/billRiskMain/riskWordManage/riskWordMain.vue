<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.pc.riskObject')" prop="riskObj">
                  <h-select v-model="formItem.riskObj"  placeholder="" showTitle>
                    <h-option v-for="item in riskObjList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item  :label="this.$t('m.i.common.operStatus')" prop="operStatus">
                  <h-select v-model="formItem.operStatus" placeholder="" multiple showTitle>
                    <h-option v-for="item in operStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
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
            url="/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_queryRiskWordPage"
            :bindForm="formItem"
            rowSelect
            :hasSelect="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">{{$t('m.i.common.add')}}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="handleDelete()">{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="commitComfirm()">{{$t('m.i.common.submit')}}</h-button>
              <h-button type="primary" @click="rollbackComfirm()">{{$t('m.i.common.cancelCheckAuth')}}</h-button>
              <h-button type="primary" @click="showHist()">{{$t('m.i.common.showHist')}}</h-button>
              <h-button type="primary" @click="riskBillStock()">{{$t('m.i.pc.riskBillStock')}}</h-button>
            </div>

          </h-datagrid>

        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type === 'add'">新增风险字样</span>
        <span v-if="type === 'modify'">修改风险字样</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">

          <h-form-item :label="$t('m.i.pc.riskObject')" prop="riskObj" :required="isRequired" >
            <h-select v-model="addForm.riskObj"  placeholder="" showTitle :readonly="isReadonly">
              <h-option v-for="item in riskObjList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.pc.remindRiskWord')" prop="remindRiskWord">
            <h-input v-model="addForm.remindRiskWord" :maxlength="250" placeholder="有多个风险字样使用“,”分隔"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.banRiskWord')" prop="banRiskWord">
            <h-input v-model="addForm.banRiskWord" :maxlength="250" placeholder="有多个风险字样使用“,”分隔"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="primary" @click="addOrEditWin=!addOrEditWin;addFormReset();">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary"  v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary"  v-else @click="submitForm()">{{$t('m.i.common.commit')}}</h-button>
      </div>
    </h-msg-box>

    <risk-word-his :showHistWin="showHistWin" title="查看历史维护记录" :hisId="hisId" @showHistWinClose="showHistWinClose"></risk-word-his>

  </div>
</template>

<script>

    import {formatNumber, getDictListByGroups, getDictValueFromMap, post,getBusinessParameter } from "@/api/bizApi/commonUtil";

  export default {
    name: "riskWordMain",
    components: {
      RiskWordHis:()=>import(/* webpackChunkName: "pc/risk/billRiskMain/riskWordManage/riskWordHis" */`@/views/bizViews/pc/risk/billRiskMain/riskWordManage/riskWordHis`),
    },
    data(){
      return {
        hisId:"",
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            key:"xuhao",
            align: "center"
          },
          {
            title: this.$t("m.i.pc.riskObject"),
            key:"riskObj",
            hiddenCol: false,
            render: (h, params) => {
                let dictValue =this.getDictValueFromMap(this.dictMap, 'RiskObjCode', params.row.riskObj);
                return h("span", {
                    domProps: {
                        title: dictValue
                    }
                }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.remindRiskWord"),
            key:"remindRiskWord",
            hiddenCol: false,
          },
          {
              title: this.$t("m.i.pc.banRiskWord"),
              key:"banRiskWord",
              hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.operStatus"),
            key:"operStatus",
            hiddenCol: false,
            render: (h, params) => {
                let dictValue =this.getDictValueFromMap(this.dictMap, 'OperStatusCode', params.row.operStatus);
                return h("span", {
                    domProps: {
                        title: dictValue
                    }
                }, dictValue);
            }
          },
          {
            title: this.$t("m.i.pc.createUser"),
            key:"operTellerName",
            hiddenCol: false,
          },
            {
                title: this.$t("m.i.common.createTime"),
                key: 'createTime',
                sortable: true,
                render: (h, params) => {
                    if (params.row.createTime == null || params.row.createTime === "") {
                        return "";
                    }
                    let date = params.row.createTime.toString().substring(0,8);
                    let time = params.row.createTime.toString().substring(8,14);
                    let createTime =this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+ this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                    return h("span", createTime);
                }
            },
          {
            title: this.$t("m.i.pc.newUpdateTime"),
            key:"updateTime",
            hiddenCol: false,
              render: (h, params) => {
                  if (params.row.updateTime == null || params.row.updateTime === "") {
                      return "";
                  }
                  let date = params.row.updateTime.toString().substring(0,8);
                  let time = params.row.updateTime.toString().substring(8,14);
                  let updateTime =this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+ this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                  return h("span", updateTime);
              }
          }
        ],
        formItem : {
          riskObj:"",
          operStatus:[]
        },
        addForm : {
          id : "",
          riskObj:"",
          remindRiskWord:"",
          banRiskWord:"",
        },
        // 是否显示新增或修改窗口
        addOrEditWin : false,
        type : null,
        readonly:false,
        isRequired:true,
        isReadonly:false,
        submitFlag : false,
        dictMap : new Map(),
        operStatusList:[],
        riskObjList : [],
        operTypeList : [],
        riskLevelList : [],
        showHistWin : false,
        ifShowMore : false,
      };
    },
    watch:{

    },
    methods :{
      addFormReset() {
          this.$refs.addForm.resetFields();
          this.addForm.id ="";
          this.addForm.riskObj ="";
          this.addForm.remindRiskWord ="";
          this.addForm.banRiskWord ="";
      },
      handleAddForm(str) {
        this.type = str;
        if (this.type === "modify") {
          if(this.$refs.datagrid.selects === null || this.$refs.datagrid.selects === undefined || this.$refs.datagrid.selects.length !== 1) {
              this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
              return ;
          }else if(this.$refs.datagrid.selects.length > 1){
              this.$msgTip.info(this,{info:this.$t('m.i.common.onlyChooseOneData')});
              return ;
          }
          let operStatus = this.$refs.datagrid.selects[0].operStatus;
          if(operStatus === "12" || operStatus === "22" || operStatus === "32"
              ||operStatus === "13" || operStatus === "23" || operStatus === "33" || operStatus === "35"){
              this.$msgTip.info(this,{info:this.$t('m.i.pc.updateError')});
              return;
          }
          this.isReadonly = true;
          this.addForm.id = this.$refs.datagrid.selects[0].riskWordId;
          this.addForm.riskObj = this.$refs.datagrid.selects[0].riskObj;
          this.addForm.remindRiskWord = this.$refs.datagrid.selects[0].remindRiskWord;
          this.addForm.banRiskWord = this.$refs.datagrid.selects[0].banRiskWord;
          this.addOrEditWin = true;
        }else{
          this.isReadonly = false;
          this.addOrEditWin = true;
          this.$nextTick(() => {
            this.addFormReset();
          });
        }
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.datagrid.selects = [];
        this.$refs.formItem.resetFields();
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
              if(this.type === "modify"){
                  if(this.addForm.remindRiskWord === this.$refs.datagrid.selects[0].remindRiskWord &&
                      this.addForm.banRiskWord === this.$refs.datagrid.selects[0].banRiskWord){
                      this.$msgTip.info(this, {info: "未检测到数据修改！"});
                      return;
                  }
              }
              //校验提醒类风险字样和禁止类风险字样
              if((this.addForm.remindRiskWord === "" || this.addForm.remindRiskWord === null)
                  && (this.addForm.banRiskWord === "" || this.addForm.banRiskWord === null)){
                  this.$msgTip.info(this, {info: "提醒类风险字样和禁止类风险字样至少有一个不能为空！"});
                  return;
              }
              //其中一个为空就不会重复 防止包含空字符问题
              if(this.addForm.remindRiskWord !== "" && this.addForm.remindRiskWord !== null){
                  let remindRiskWordArray = this.addForm.remindRiskWord.split(",");
                  let banRiskWord = this.addForm.banRiskWord;
                  for(let index in remindRiskWordArray){
                      if(banRiskWord && banRiskWord.includes(remindRiskWordArray[index])){
                          this.$msgTip.info(this, {info: "提醒类风险字样和禁止类风险字样不能重复！"});
                          return;
                      }
                  }
              }
              if(this.addForm.banRiskWord !== "" && this.addForm.banRiskWord !== null){
                  let banRiskWordArray = this.addForm.banRiskWord.split(",");
                  let remindRiskWord = this.addForm.remindRiskWord;
                  for(let index in banRiskWordArray){
                      if(remindRiskWord && remindRiskWord.includes(banRiskWordArray[index])){
                          this.$msgTip.info(this, {info: "提醒类风险字样和禁止类风险字样不能重复！"});
                          return;
                      }
                  }
              }
            // 新增或修改的url
            let addUrl = '/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_addRiskWordInfo';
            let updateUrl = '/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_updateRiskWordInfo';
            let url = this.type === "add"? addUrl : updateUrl;
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
            this.submitFlag = true;
            post(this.addForm,url).then(res => {
              this.submitFlag = false;
              if(res){
                let retCode = res.data.retCode;
                if(retCode === "000000"){
                  this.$msgTip.success(this);
                  this.$refs.datagrid.selects = [];
                  this.$refs.datagrid.dataChange(pageNo);
                  this.addFormReset();
                  this.addOrEditWin = false;
                }else{
                  this.$msgTip.error(this,{info:res.data.retMsg})
                }
              }else{
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
              }

            });
          }
        });

      },
      handleDelete() {
        if(this.$refs.datagrid.selects === null || this.$refs.datagrid.selects === undefined || this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseAtLeastOneRecord')});
          return;
        }
          let list =  this.$refs.datagrid.selects;
          for(let i=0;i<list.length;i++) {
              let operStatus = list[i].operStatus;
              if(operStatus === "12" || operStatus === "22" || operStatus === "32"
                  ||operStatus === "13" || operStatus === "23" || operStatus === "33"
                  ||operStatus === "31" || operStatus === "35"){
                  this.$msgTip.info(this,{info:this.$t('m.i.pc.deleteError')});
                  return;
              }
          }
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t('m.i.common.isConfirmDelete') + '?',
          onOk: () => {
            let ids = this.formateidsData(this.$refs.datagrid.selects);
            post({ids:ids},'/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_deleteRiskWordInfo').then(res => {
              if(res){
                let retCode = res.data.retCode;
                if(retCode === "000000"){
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selects = [];
                }else{
                  this.$msgTip.error(this,{info:res.data.retMsg})
                }
              }else{
                this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
              }
            });
          }
        })
      },
      formateidsData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].riskWordId);
        }
        return ids;
      },

      //提交复核确认
      commitComfirm(){
        if(this.$refs.datagrid.selects === null || this.$refs.datagrid.selects === undefined || this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseAtLeastOneRecord')});
          return;
        }
        for(let i=0;i<this.$refs.datagrid.selects.length;i++) {
          let operStatus = this.$refs.datagrid.selects[i].operStatus;
          if (operStatus !== '11' && operStatus !== '21' && operStatus !== '31') {
            this.$msgTip.info(this, {info: '只有待提交状态才能提交复核'});
            return
          }
        }
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmCommit') + '?',
            onOk: () => {
              this.commitCheck();
            }
          })
      },
      /**提交复核**/
      commitCheck(){
        let ids = this.formateidsData(this.$refs.datagrid.selects);
        post({ids:ids},'/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_submitRiskWordInfo').then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode=="000000"){
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });

      },
      rollbackComfirm(){
        if(this.$refs.datagrid.selects === null || this.$refs.datagrid.selects === undefined || this.$refs.datagrid.selects.length === 0) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseAtLeastOneRecord')});
          return;
        }
        for(let i=0;i<this.$refs.datagrid.selects.length;i++) {
          let operStatus = this.$refs.datagrid.selects[i].operStatus;
          if (operStatus !== '12' && operStatus !== '22' && operStatus !== '32') {
            this.$msgTip.info(this, {info: '只有待复核状态才能撤销'});
            return
          }
        }
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmRollBack') + '?',
            onOk: () => {
              this.rollback();
            }
          })
      },
      /**撤销**/
      rollback(){
        let ids = this.formateidsData(this.$refs.datagrid.selects);
        post({ids:ids},'/pc/risk/billRiskMain/riskWordManage/riskWordMain/func_rollbackRiskWordInfo').then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode=="000000"){
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selects = [];
            }else{
              this.$msgTip.error(this,{info:res.data.retMsg})
            }
          }else{
            this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
          }
        });
      },

      //风险票盘库
        riskBillStock(){
            this.$hMsgBox.confirm({
                title: this.$t('m.i.common.confirm'),
                content: this.$t('m.i.common.isConfirmTicketPlate') + '?',
                onOk: () => {
                    this.riskBillStockHandle();
                }
            })
        },
        riskBillStockHandle(){
          let url = "pc/risk/billRiskMain/riskWordManage/riskWordMain/func_billRiskStockCheck";
          this.$loadingbox.open({
              title: "风险票盘库中，请稍后..."
          });
          post({},url).then(res => {
              if(res){
                  this.$loadingbox.close();
                  let retCode = res.data.retCode;
                  if(retCode=="000000"){
                      this.$msgTip.success(this);
                  }else{
                      this.$msgTip.error(this,{info:res.data.retMsg})
                  }
              }else{
                  this.$loadingbox.close();
                  this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
              }
          });
      },

      showHist(){
        if(this.$refs.datagrid.selects === null || this.$refs.datagrid.selects === undefined || this.$refs.datagrid.selects.length !== 1) {
          this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
          return;
        }
        this.hisId = this.$refs.datagrid.selects[0].riskWordId;
        this.showHistWin = true;
      },

      showHistWinClose(){
        this.showHistWin = false;
      },

    },

    mounted() {
      this.getDictListByGroups("OperStatusCode,RiskObjCode,RiskLevel").then(res => {
        this.operStatusList=res.get("OperStatusCode");
        this.riskObjList = res.get("RiskObjCode");
        this.riskLevelList = res.get("RiskLevel");
        this.dictMap = res.get("map");
      })
    }

  };
</script>

<style scoped>

</style>
