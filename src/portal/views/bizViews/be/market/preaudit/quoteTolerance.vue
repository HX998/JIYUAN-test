<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-cpes-branch :label="$t('m.i.be.custmemberBrchCode')"
                                  :brchCode.sync="formItem.custBrchCode"  :cpesBrchName.sync="formItem.custBrchName"
                                  datagridUrl="/cpes/branch/queryBranchList" prop="custBrchName"
                                  queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>
                <h-form-item :label="$t('m.i.common.status')" prop="status">
                  <h-select v-model="formItem.status"  placeholder="" showTitle>
                    <h-option v-for="item in toleranceStatusList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
              <h-datagrid
                :columns="columns"
                url="/be/market/preaudit/quoteTolerance/func_queryQuoteTolerance"
                :bindForm="formItem"
                :hasSelect="false" rowSelect
                :notSetWidth="true"
                showListCkeckBox
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="handleAddForm('add')">{{$t('m.i.common.add')}}</h-button>
                  <h-button type="primary" @click="handleAddForm('modify')">{{$t('m.i.common.modify')}}</h-button>
                  <h-button type="primary" @click="handleComfirm()">{{$t('m.i.common.delete')}}</h-button>
                  <h-button type="primary" @click="submitToReview()" >{{$t('m.i.be.submission')}}</h-button>
                  <h-button type="primary" @click="submitReset()" >{{$t('m.i.common.reset')}}</h-button>
                </div>

              </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" class="h-form-table-layer" :maximize="true" @on-close="closeFrom()">
      <p slot="header">
        <span v-if="this.type==='add'">新增申请</span>
        <span v-if="this.type==='modify'">修改申请</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <h-form-item :label="$t('m.i.common.prodName')" prop="prodNo" required>
            <h-select v-model="addForm.prodNo" placeholder=""  @on-change="changeMemberId()" readonly v-if="type=='modify'" showTitle>
              <h-option v-for="(value,key) in prodNoToNameMap" :value="key" :key="key">{{ value }}</h-option>
            </h-select>
            <h-select v-model="addForm.prodNo" placeholder=""  @on-change="changeMemberId()" v-if="type=='add'" showTitle>
              <h-option v-for="(value,key) in prodNoToNameMap" :value="key" :key="key">{{ value }}</h-option>
            </h-select>
          </h-form-item>
          <show-cpes-branch :label="$t('m.i.be.custBrchName')" :required="true"
                            v-if="addForm.prodNo !== '00102003' && addForm.prodNo !== '00102006'&& (type=='modify'||type=='add')"
                            :brchCode.sync="addForm.custBrchCode"  :cpesBrchName.sync="addForm.custBrchName"
                            :filterable="type=='add'" :cpesBrchParams="{'memberId':this.memberId}"
                            :clearable="false"
                            @cpesBranchChange="custBrchNameChange($event)" :msgBoxWin="addOrEditWin"
                            datagridUrl="/cpes/branch/queryBranchList" prop="custBrchName"
                            queryUrl="/cpes/branch/queryBranchList"></show-cpes-branch>

          <h-form-item :label="$t('m.i.be.isMatchTrader')" prop="isMatchTrader"  required v-if="addForm.prodNo !== '00102003' && addForm.prodNo !== '00102006'">
            <h-select v-model="addForm.isMatchTrader" placeholder="" showTitle>
              <h-option  value="0">否</h-option>
              <h-option  value="1">是</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.custmemberTraderName')" prop="custTraderName" :required="this.addForm.isMatchTrader==='1'" v-if="addForm.prodNo !== '00102003' && addForm.prodNo !== '00102006'">
              <h-input  v-model="addForm.custTraderNo" v-show="false"></h-input>
              <h-input  v-model="addForm.custTraderName" placeholder="" readonly icon="android-search"
                       @on-click="queryTrader"></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.be.floatingInterestRate')" prop="floatingInterestRatePct"  :validRules="ratePctRule" v-if="addForm.prodNo !== '00102003' && addForm.prodNo !== '00102006'">
            <h-input  v-model="addForm.floatingInterestRatePct"  placeholder="利率范围0~100，且小数位不超过四位"  ></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.be.downwardInterestRate')" prop="downwardInterestRatePct"  :validRules="ratePctRule" v-if="addForm.prodNo !== '00102003' && addForm.prodNo !== '00102006'">
            <h-input  v-model="addForm.downwardInterestRatePct"  placeholder="利率范围0~100，且小数位不超过四位" ></h-input>
          </h-form-item>

          <h-form-item :label="$t('m.i.be.listMatchRange')" prop="listMatchRange" v-if="addForm.prodNo !== '00102003' && addForm.prodNo !== '00102006'">
            <h-select v-model="addForm.listMatchRange" placeholder="" showTitle>
              <h-option  value="1">完全相同</h-option>
              <h-option  value="2">包含</h-option>
            </h-select>
          </h-form-item>
          <common-type-field :label="$t('m.i.be.downwardInterestAmtByUnit')" prop="downwardInterestAmt" required v-if="this.addForm.listMatchRange==='2'&& addForm.prodNo !== '00102003' && addForm.prodNo !== '00102006'"
            :validRules="amtRule" v-model="addForm.downwardInterestAmt" :bigTips="false"></common-type-field>

          <h-form-item :label="$t('m.i.be.listMatchField')" prop="listMatchField">
            <h-select v-model="addForm.listMatchField" placeholder="" multiple showTitle>
              <h-option v-for="(value,key) in fieldToNameMap" :value="key" :key="key">{{ value }}</h-option>
            </h-select>
          </h-form-item>

          <h-form-item :label="$t('m.i.be.isMatchSubDeal')" prop="isMatchSubDeal" class="h-form-long-label" v-if="addForm.prodNo !== '00102003' && addForm.prodNo !== '00102006'">
            <h-select v-model="addForm.isMatchSubDeal" placeholder="" showTitle>
              <h-option  value="0">否</h-option>
              <h-option  value="1">是</h-option>
            </h-select>
          </h-form-item>

        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" style="margin:0 8px"  @click="closeFrom()">{{$t('m.i.common.close')}}</h-button>
        <h-button type="primary"  @click="submitForm()">{{$t('m.i.common.commit')}}</h-button>
      </div>

    </h-msg-box>

    <trader-user :userTraderWin="userTraderWin" :brchCode="addForm.custBrchCode" @userTraderChange="userTraderChange"
                 :memberId="memberId" @userTraderWinClose="userTraderWinClose"></trader-user>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups,formatNumber,getDictValueFromMap, rateSortMethod} from "@/api/bizApi/commonUtil";
  export default {
    name: "quoteTolerance",
    components: {
      traderUser:()=>import(/* webpackChunkName: "sm/auth/branch/userTraderByBrchNoSearch" */`@/views/bizViews/sm/auth/branch/userTraderByBrchNoSearch`)
    },
    data(){
      return {
        amtRule:[{
          test: /^(?:[1-9]\d{0,15}|0)(?:\.\d{1,2})?$/,
          trigger: "blur",
          message: "下浮金额(元)必须是大于等于0的数字，最多16位整数且小数位不超过两位"
        }],
        currentSelectList : null,
        dictMap : new Map(),
        formItem : {
          custBrchCode: "",
          custBrchName: "",
          status: ""
        },
        addForm : {
          id:"",
          memberId:"",
          custMemberId: "",
          custMemberName: "",
          custBrchCode:"",
          custBrchName:"",
          prodNo: "",
          prodName: "",
          custTraderNo:"",
          custTraderName: "",
          floatingInterestRate: "",
          downwardInterestRate: "",
          floatingInterestRatePct: "",
          downwardInterestRatePct: "",
          listMatchRange: "",
          isMatchTrader:"",
          downwardInterestAmt: "",
          listMatchField: [],
          isMatchSubDeal: "",
          listMatchRanges:[],
          listMatchFieldList: []
        },
        columns : [
          {
            type: "selection",
            width: 50,
            title: "",
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
            title: this.$t('m.i.common.status'),
            key: "status",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap,"ToleranceStatusCode",params.row.status);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.be.custmemberBrchCode'),
            key: "custBrchCode",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.custBrchName'),
            key: "custBrchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.custmemberTraderNo'),
            key: "custTraderNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.custmemberTraderName'),
            key: "custTraderName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.prodName"),
            key: "prodName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.be.floatingInterestRate'),
            key: "floatingInterestRatePct",
            hiddenCol: false,
            align: "right",
            sortable: true,
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          {
            title: this.$t('m.i.be.downwardInterestRate'),
            key: "downwardInterestRatePct",
            hiddenCol: false,
            align: "right",
            sortable: true,
            sortMethod:(a,b,type)=>{
              return rateSortMethod(a,b,type);
            }
          },
          {
            title: this.$t('m.i.be.downwardInterestAmtByUnit'),
            key: "downwardInterestAmt",
            hiddenCol: false,
            align: "right",
            sortable: true,
            render: (h, params) => {
              return h("p", formatNumber(params.row.downwardInterestAmt, 2, ","));
            },
          },
          {
            title: this.$t('m.i.be.listMatchField'),
            key: "listMatchField",
            hiddenCol: false,
            render: (h, params) => {
              let s = [];
              if(params.row.listMatchField !='' || null != params.row.listMatchField){
                let keyList = params.row.listMatchField.split(",");
                for (let i = 0; i < keyList.length; i++) {
                  let value = this.fieldToNameMap[keyList[i]];
                  if(value){
                    s.push(value);
                  }
                }
              }
              return h("span", s.join(','));
            }
          },
          {
            title: this.$t('m.i.be.listMatchRange'),
            key: "listMatchRange",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', this.formatListMatchRange(params.row.listMatchRange))
              ]);
            }
          },
          {
            title: this.$t('m.i.be.isMatchTrader'),
            key: "isMatchTrader",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', this.formatIsMatchTrader(params.row.isMatchTrader))
              ]);
            }
          },
          {
            title: this.$t('m.i.be.isMatchSubDeal'),
            key: "isMatchSubDeal",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', this.formatIsMatchSubDeal(params.row.isMatchSubDeal))
              ]);
            }
          }
        ],
        toleranceStatusList:[],
        noCommit : true,
        hasCommit : false,
        hasUsed : false,
        ifShowMore : false,
        memberId : '',
        addOrEditWin:false,
        userTraderWin:false,
        fieldToNameMap:new Map(),
        prodNoToNameMap:new Map(),
        type : "",
        ratePctRule: [{
          test: /^(\d{1,2}(\.\d{1,4})?|100|100\.0|100\.00|100\.000|100\.0000)$/,
          trigger: "blur",
          message: "利率范围0~100，且小数位不超过四位"
        }],
      }
    },
    watch: {
      addOrEditWin(val) {
        if (val === true) {
          //this.init();
        }
      },
    },
    methods :{
      formatListMatchRange(listMatchRange) {
        if (listMatchRange == '1') {
          return "完全相同";
        } else if (listMatchRange == '2') {
          return "包含";
        } else {
          return null;
        }
      },
      formatIsMatchSubDeal(isMatchSubDeal) {
        if (isMatchSubDeal == '1') {
          return "是";
        } else if (isMatchSubDeal == '0') {
          return "否";
        } else {
          return null;
        }
      },
      formatIsMatchTrader(isMatchTrader) {
        if (isMatchTrader == '1') {
          return "是";
        } else if (isMatchTrader == '0') {
          return "否";
        } else {
          return null;
        }
      },
      custBrchNameChange(info){
        if(info.length>0){
          this.addForm.custMemberId = info[0].memberId;
          this.addForm.custMemberName = info[0].memberName;
        }
      },
      changeMemberId(){
        let prodNo= this.addForm.prodNo
        if(prodNo =='00101001' || prodNo=='00102001'){
          this.memberId=this.addForm.memberId;
        }else{
          this.memberId='';
        }
      },
      // 挑选交易员
      queryTrader() {
        this.userTraderWin = true;
      },
      userTraderChange(info) {
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
          return;
        }
        this.addForm.custMemberId = info.memberId;
        this.addForm.custMemberName = info.memberName;
        this.addForm.custTraderNo = info.traderId;
        this.addForm.custTraderName = info.traderName;
        this.addForm.custBrchCode = info.brchCode;
        this.addForm.custBrchName = info.brchFullNameZh;
        this.userTraderWin = false;
      },
      userTraderWinClose() {
        this.userTraderWin = false;
      },

      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.clearAddForm();
        });
      },
      handleAddForm(str) {
        this.type = str;
        if (str === "modify") {
          let list=this.$refs.datagrid.selects;
          if(list != null && list.length===1){
            this.currentSelectRow = list[0];
            this.trunEdit(this.currentSelectRow);
          }else{
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return ;
          }
        }else{
          this.addFormReset();
        }
        this.addOrEditWin = true;
      },
      formSearchBill() {
        this.unDisabled();
        this.$refs.datagridbill.dataChange(1);
      },
      formSearchBillReset() {
        this.billFormItem.billNo='';
      },
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.custBrchName='';
        this.formItem.custBrchCode='';
        this.formItem.status='';
        this.formItem.custMemberId = "";
      },
      trunEdit(info){
        if (info === null) {
          this.$msgTip.error(this, { info: "请先选择记录！" });
        }else{
          this.addForm.id = info.id;
          this.addForm.custMemberId = info.custMemberId;
          this.addForm.custMemberName = info.custMemberName;
          this.addForm.custBrchCode = info.custBrchCode;
          this.addForm.custBrchName = info.custBrchName;
          this.addForm.prodNo = info.prodNo;
          this.addForm.prodName = info.prodName;
          this.addForm.custTraderNo = info.custTraderNo;
          this.addForm.custTraderName = info.custTraderName;
          this.addForm.floatingInterestRate = info.floatingInterestRate;
          this.addForm.downwardInterestRate = info.downwardInterestRate;
          this.addForm.floatingInterestRatePct = info.floatingInterestRatePct;
          this.addForm.downwardInterestRatePct = info.downwardInterestRatePct;
          this.addForm.listMatchRange = info.listMatchRange;
          this.addForm.downwardInterestAmt = info.downwardInterestAmt;
          if(info.listMatchRanges!=null){
            this.addForm.listMatchField = info.listMatchRanges;
          }else{
            this.addForm.listMatchField=[];
          }
          this.addForm.isMatchTrader=info.isMatchTrader;
          this.addForm.isMatchSubDeal = info.isMatchSubDeal;
        }
      } ,
      closeFrom(){
        this.$refs.addForm.resetFields();
        this.clearAddForm();
        this.addOrEditWin = false;
        this.$refs.datagrid.dataChange(1);
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
      },
      clearAddForm(){
        this.addForm.id='';
        this.addForm.custMemberId='';
        this.addForm.custMemberName='';
        this.addForm.custBrchCode="";
        this.addForm.custBrchName="";
        this.addForm.floatingInterestRatePct='';
        this.addForm.floatingInterestRate='';
        this.addForm.downwardInterestRatePct='';
        this.addForm.downwardInterestRate='';
        this.addForm.downwardInterestAmt='';
        this.addForm.listMatchFieldList=[];
        this.addForm.listMatchField=[];
        this.addForm.isMatchTrader='';
        this.addForm.listMatchRange='';
        this.addForm.isMatchSubDeal='';
        this.addForm.custTraderNo='';
        this.addForm.custTraderName='';
        this.addForm.listMatchRanges=[];
        this.addForm.prodNo='';
        this.addForm.prodName='';
      },
      submitForm() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            // 新增或修改的url
            let url = this.type==="add"?'/be/market/preaudit/quoteTolerance/func_createQuoteTolerance':
              '/be/market/preaudit/quoteTolerance/func_editQuoteTolerance';
            let msg = this.type==="add"?this.$t('m.i.common.addSuccess'):this.$t('m.i.common.modifySuccess');
            post(this.addForm,url).then(res => {
              if(res){
                let retCode = res.data.retCode;
                if(retCode==="000000"){
                  this.$msgTip.success(this, { info: "操作成功"});
                  this.$refs.addForm.resetFields();
                  this.clearAddForm();
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selectIds=[];
                  this.$refs.datagrid.selects=[];
                }else{
                  this.$msgTip.error(this,{info:"操作失败：" + res.data.retMsg});
                  this.$refs.datagrid.dataChange(1);
                  this.$refs.datagrid.selectIds=[];
                  this.$refs.datagrid.selects=[];
                }
              }else{
                this.$msgTip.error(this,{info:"操作失败"});
                this.$refs.datagrid.selectIds=[];
                this.$refs.datagrid.selects=[];
              }

            });
          }
        });

      },
      handleComfirm(){
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
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
        let list=this.$refs.datagrid.selectIds;
        post({ids:list},'/be/market/preaudit/quoteTolerance/func_deleteQuoteTolerance').then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selectIds=[];
              this.$refs.datagrid.selects=[];
              this.retMsg = "";
            }else{
              this.$refs.datagrid.dataChange(1);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds=[];
              this.$refs.datagrid.selects=[];
              this.$msgTip.info(this,{info:"删除失败：" + res.data.retMsg});
            }
          }else{
            /**清除多页选择的数据*/
            this.$refs.datagrid.selectIds=[];
            this.$refs.datagrid.selects=[];
            // this.$hMessage.error(this.$t('m.i.common.netError'))
            tthis.$msgTip.info(this,{info:"删除失败"});
          }
        });
      },
      //提交复核
      submitToReview() {
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "提交",
          content: "确认提交吗？",
          onOk: () => {
            this.submitRecheck();
          }
        });
      },
      //重置
      submitReset(){
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (list.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: "重置",
          content: "确定放弃修改或删除，将容忍度设置还原至上一次审批完成",
          onOk: () => {
            this.confirmSubmitReset();
          }
        });
      },
      submitRecheck() {
        let list = this.$refs.datagrid.selectIds;

        post({ids:list},'/be/market/preaudit/quoteTolerance/func_submitQuoteTolerance').then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selectIds=[];
              this.$refs.datagrid.selects=[];
              this.retMsg = "";
            }else{
              this.$refs.datagrid.dataChange(1);
              this.$msgTip.error(this,{info:"操作失败：" + res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:"操作失败"});
          }
        });
      },
      confirmSubmitReset() {
        let list = this.$refs.datagrid.selects;

        post({id:list[0].id},'/be/market/preaudit/quoteTolerance/func_resetQuoteTolerance').then(res => {
          if(res){
            let retCode = res.data.retCode;
            if(retCode==="000000"){
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(1);
              this.$refs.datagrid.selectIds=[];
              this.$refs.datagrid.selects=[];
              this.retMsg = "";
            }else{
              this.$refs.datagrid.dataChange(1);
              this.$msgTip.error(this,{info:"操作失败：" + res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:"操作失败"});
          }
        });
      },
      init(){
        post({}, '/be/market/preaudit/quoteTolerance/func_initQuoteTolerance').then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.fieldToNameMap = res.data.retData.fieldToNameMap;
              this.prodNoToNameMap = res.data.retData.prodNoToNameMap;
              this.addForm.memberId = res.data.retData.memberId;
            }
          }
        })
      }

    },
    created(){
      this.init();
    },
    mounted() {
      getDictListByGroups("ToleranceStatusCode").then(res => {
        let toleranceStatusList = res.get("ToleranceStatusCode");
        toleranceStatusList.forEach(item => {
          if (item.key === "0" || item.key === "3" || item.key === "4" || item.key === "6"){
            this.toleranceStatusList.push(item);
          }
        });
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
