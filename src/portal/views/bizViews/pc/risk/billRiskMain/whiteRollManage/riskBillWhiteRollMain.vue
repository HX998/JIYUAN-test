<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.custName')" prop="custName">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
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
            url= "pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_queryRiskBillWhiteRoll"
            :bindForm="formItem"
            :row-select="true"
            :has-select="false"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">{{$t('m.i.common.add')}}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">{{$t('m.i.common.modify')}}</h-button>
              <h-button type="primary" @click="handleDelete()">{{$t('m.i.common.delete')}}</h-button>
              <h-button type="primary" @click="commitComfirm()">{{$t('m.i.common.submit')}}</h-button>
              <h-button type="primary" @click="rollbackComfirm()" >{{$t('m.i.common.cancelCheckAuth')}}</h-button>
              <h-button type="primary" @click="showHist()">{{$t('m.i.common.showHist')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="500" class="h-form-search-layer" @on-close="addFormClose" :maximize="true" :mask-closable="false">
      <p slot="header">
        <span v-if="type==='add'">新增白名单</span>
        <span v-if="type==='modify'">修改白名单</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.common.custName')" prop="custName" required>
            <h-input  v-model="addForm.custName" :maxlength="60" ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.pc.whiteRemark')" prop="riskRemark" cols="2">
            <h-input type="textarea" v-model="addForm.remark"  :title="addForm.remark" :maxlength="250"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="addFormClose()">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary"  @click="submitForm()">{{$t('m.i.common.commit')}}</h-button>
      </div>
    </h-msg-box>
    <risk-bill-white-roll-his :showHistWin="whiteRollHistWin" :hisId="whiteRollId" @showHistWinClose="showHistWinClose"></risk-bill-white-roll-his>
  </div>
</template>

<script>
    import { post,getMoreParamValuesByKeys } from "@/api/bizApi/commonUtil";

    export default {
        name: "riskBillWhiteRollInfo",
        components: {
            RiskBillWhiteRollHis:()=>import(/* webpackChunkName: "pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollHis" */`@/views/bizViews/pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollHis`),
        },
        data(){
            return{
                //是否走审批
                recheckFlag : true,
                whiteRollId :"",
                formItem : {
                    custName : "",
                    operStatus : [],
                },
                addForm : {
                    id : '',
                    custName : "",
                    remark : ""
                },
                readonly:false,
                isRequired:true,
                isReadonly:false,
                submitFlag : false,
                dictMap : new Map(),
                operStatusList:[],
                operTypeList : [],
                ifShowMore : false,
                type : "",
                whiteRollHistWin : false,
                addOrEditWin : false,
                columns : [
                    {
                        type: "selection",
                        width: 60,
                        key: "multiSelect",
                        align: "center",
                    },
                    {
                        type: 'index',
                        key: 'numOrder',
                        title: this.$t("m.i.common.index"),
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: this.$t("m.i.common.custName"),
                        key: 'custName',
                        sortable: true,
                    },
                    {
                        title: this.$t("m.i.common.operStatus"),
                        key: 'operStatus',
                        sortable: true,
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
                        key: 'createTellerNo',
                        sortable: true,
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
                        key: 'updateTime',
                        sortable: true,
                        render: (h, params) => {
                            if (params.row.updateTime == null || params.row.updateTime === "") {
                                return "";
                            }
                            let date = params.row.updateTime.toString().substring(0, 8);
                            let time = params.row.updateTime.toString().substring(8, 14);
                            let updateTime = this.$moment(date, "YYYY-MM-DD").format("YYYY-MM-DD")+" "+ this.$moment(time, "HH:mm:ss").format("HH:mm:ss");
                            return h("span", updateTime);
                        }
                    }

                ],
            }
        },
        methods : {
            formSearch() {
                this.$refs.datagrid.selects = [];
                this.$refs.datagrid.dataChange(1);
            },
            formSearchReset() {
                this.$refs.datagrid.selects = [];
                this.$refs.formItem.resetFields();
            },
            addFormClose() {
              this.addFormReset();
               this.addOrEditWin= false;
            },
            addFormReset(){
                this.$refs.addForm.resetFields();
                this.addForm.id = "";
                this.addForm.custName = "";
                this.addForm.remark = "";
            },
            //新增修改
            handleAddForm(str) {
                this.type = str;
                if (this.type === "modify") {
                    if(this.$refs.datagrid.selects === null ||this.$refs.datagrid.selects.length === 0){
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
                    this.addForm.id = this.$refs.datagrid.selects[0].whiteId;
                    this.addForm.custName = this.$refs.datagrid.selects[0].custName;
                }else{
                    this.$nextTick(() => {
                        this.addFormReset();
                    });
                }
                this.addOrEditWin = true;
            },
            //新增或修改提交
            submitForm(){
                this.$refs["addForm"].validate(valid => {
                    if (valid) {
                        // 新增或修改的url
                        let addUrl = "pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_addRiskBillWhiteRoll";
                        let modifyUrl = "pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_updateRiskBillWhiteRoll";
                        let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
                        let url = this.type === "add" ? addUrl : modifyUrl;
                        this.submitFlag = true;
                        post(this.addForm,url).then(res => {
                            this.submitFlag = false;
                            if(res){
                                let retCode = res.data.retCode;
                                if(retCode=="000000"){
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
            //删除
            handleDelete(){
                if(this.$refs.datagrid.selects === null || this.$refs.datagrid.selects.length === 0){
                    this.$msgTip.info(this,{info:this.$t('m.i.common.chooseAtLeastOneRecord')});
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
                        this.handledel();
                    }
                })
            },
            handledel() {
                let ids = this.formateidsData(this.$refs.datagrid.selects);
                post({ ids : ids },"pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_deleteRiskBIllWhiteRoll").then(res => {
                    if(res){
                        let retCode = res.data.retCode;
                        if(retCode === "000000"){
                            this.$msgTip.success(this);
                            this.$refs.datagrid.selects = [];
                            this.$refs.datagrid.dataChange(1);
                        }else{
                            this.$msgTip.error(this,{info:res.data.retMsg})
                        }
                    }else{
                        this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
                    }
                });
            },
            //提交
            commitComfirm(){
                if(this.$refs.datagrid.selects === null || this.$refs.datagrid.selects.length === 0){
                    this.$msgTip.info(this,{info:this.$t('m.i.common.chooseAtLeastOneRecord')});
                    return;
                }
                let list =  this.$refs.datagrid.selects;
                for(let i=0;i<list.length;i++) {
                    let operStatus = list[i].operStatus;
                    if (operStatus !== '11' && operStatus !== '21' && operStatus !== '31') {
                        this.$msgTip.info(this, {info: '只有待提交状态才能提交复核'});
                        return
                    }
                }
                this.$hMsgBox.confirm({
                    title: this.$t('m.i.common.confirm'),
                    content: this.$t('m.i.common.confirmCommit') + '?',
                    onOk: () => {
                        this.handleCommit();
                    }
                })
            },
            handleCommit(){
                let ids = this.formateidsData(this.$refs.datagrid.selects);
                post({ ids : ids },"pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_submitRiskBIllWhiteRoll").then(res => {
                    if(res){
                        let retCode = res.data.retCode;
                        if(retCode === "000000"){
                            this.$msgTip.success(this);
                            this.$refs.datagrid.selects = [];
                            this.$refs.datagrid.dataChange(1);
                        }else{
                            this.$msgTip.error(this,{info:res.data.retMsg})
                        }
                    }else{
                        this.$msgTip.error(this,{info:this.$t('m.i.common.netError')})
                    }
                });
            },
            //撤销
            rollbackComfirm(){
                let list =  this.$refs.datagrid.selects;
                if(list === null || list.length === 0){
                    this.$msgTip.info(this,{info:this.$t('m.i.common.chooseAtLeastOneRecord')});
                    return;
                }
                for(let i = 0;i < list.length;i++) {
                    let operStatus = list[i].operStatus;
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
                post({ids:ids},"pc/risk/billRiskMain/whiteRollManage/riskBillWhiteRollMain/func_rollBackRiskBIllWhiteRoll").then(res => {
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
            },
            //显示白名单历史弹窗
            showHist(){
                if(this.$refs.datagrid.selects === null ||this.$refs.datagrid.selects.length === 0){
                    this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
                    return ;
                }else if(this.$refs.datagrid.selects.length > 1){
                    this.$msgTip.info(this,{info:this.$t('m.i.common.onlyChooseOneData')});
                    return ;
                }
                this.whiteRollId = this.$refs.datagrid.selects[0].whiteId;
                this.whiteRollHistWin = true;
            },
            //白名单历史关闭
            showHistWinClose(){
                this.whiteRollHistWin = false;
            },
            formateidsData(list) {
                let ids = [];
                for (let i = 0, len = list.length; i < len; i++) {
                    ids.push(list[i].whiteId);
                }
                return ids;
            },
        },
        mounted() {
            this.getDictListByGroups("OperStatusCode,OperTypeCode").then(res => {
                this.operStatusList = res.get("OperStatusCode");
                this.operTypeList = res.get("OperTypeCode");
                this.dictMap = res.get("map");
            });
            getMoreParamValuesByKeys("pc.risk.white_audit_mode").then(res => {
                let idAudit = res['pc.risk.white_audit_mode'];
                if(idAudit === '0'){
                    this.auditMode = false;
                } else {
                    this.auditMode = true;
                }
            });
        }
    }
</script>

<style scoped>

</style>
