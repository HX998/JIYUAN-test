<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--<h-form-item :label="$t('m.i.common.brchName')" prop="custBrchCode">
                  <h-input v-model="formItem.custBrchCode" v-show="false"></h-input>
                  <h-input v-model="formItem.custBrchName" readonly icon="android-search"
                           @on-click="queryBranchCode()" placeholder=""
                           clearable @on-clear="clearVal('custBrchName')"></h-input>
                </h-form-item>-->
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
                url="/be/market/preaudit/checkQuoteTolerance/func_queryCheckQuoteTolerance"
                :bindForm="formItem"
                :hasSelect="false" rowSelect
                :notSetWidth="true"
                showListCkeckBox
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="agree()">{{$t('m.i.be.agreeAudit')}}</h-button>
                  <h-button type="primary" @click="refuse()">{{$t('m.i.be.refuseAudit')}}</h-button>

                </div>

              </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--<show-cpes-branch :showCpesBranch="showCpesBranch" @showCpesBranchClose="showCpesBranchClose"
                      @showCpesBranchSubmit="showCpesBranchSubmit"></show-cpes-branch>-->

  </div>
</template>

<script>
  import { post, on, off, formatNumber, rateSortMethod } from "@/api/bizApi/commonUtil";
  export default {
    name: "checkQuoteTolerance",
    components: {
      //ShowCpesBranch:()=>import(/* webpackChunkName: "shcpe/cpes/branch/showCpesBranch" */`@/views/bizViews/shcpe/cpes/branch/showCpesBranch`),
    },
    data(){
      return {
        currentSelectList : null,
        dictMap : null,
        formItem : {
          custMemberId: "",
          custMemberName: "",
          custBrchCode:"",
          custBrchName:"",
          status: ""
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
              let list = this.getDictValueFromMap(this.dictMap,"ToleranceStatusCode",params.row.status);
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
              let keyList = params.row.listMatchField.split(",");
              let s = [];
              for (let i = 0; i < keyList.length; i++) {
                let value = this.fieldToNameMap[keyList[i]];
                if(value){
                  s.push(value);
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
                h('span', this.listMatchRange(params.row.listMatchRange,params.row,params.row.index))
              ]);
            }
          },
          {
            title: this.$t('m.i.be.isMatchTrader'),
            key: "isMatchTrader",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', this.isMatchSubDeal(params.row.isMatchTrader,params.row,params.row.index))
              ]);
            }
          },
          {
            title: this.$t('m.i.be.isMatchSubDeal'),
            key: "isMatchSubDeal",
            hiddenCol: false,
            render: (h, params) => {
              return h('div', [
                h('span', this.isMatchSubDeal(params.row.isMatchSubDeal,params.row,params.row.index))
              ]);
            }
          }
        ],
        toleranceStatusList:[],
        noCommit : true,
        hasCommit : false,
        hasUsed : false,
        ifShowMore : false,
        addOrEditWin:false,
        fieldToNameMap:new Map(),
        prodNoToNameMap:new Map(),
        type:'',
        //showCpesBranch:false
      }
    },
    watch: {
      pickRecouBillWin(val) {
        if (val === true) {
          this.formItem.brchCode= this.brchCode
          this.formItem = Object.assign(this.formItem,this.params);
          this.formSearchBill();
        }
      },
    },
    methods :{
      isMatchSubDeal(value, row, index){
          if (value != null && value != "") {
            switch (value) {
              case '0':
                return '是';
              case '1':
                return '否';
            }
          } else {
            return "";
          }
        },
        listMatchRange(value, row, index){
          if (value != null && value != "") {
            switch (value) {
              case '1':
                return '完全相同';
              case '2':
                return '包含';
            }
          } else {
            return "";
          }
       },
      /*clearVal(type){
        if(type == 'custBrchName'){
          this.formItem.custBrchCode = '';
          this.formItem.custBrchName = '';
        }
      },*/
      /*queryBranchCode(){
        this.showCpesBranch = true;
      },*/
      /*showCpesBranchClose() {
        this.showCpesBranch = false;
      },*/
      //根据弹框所选数据进行赋值
      /*showCpesBranchSubmit(info) {
        if (info === null) {
          this.$hMessage.error("请先选择记录！");
          return;
        }
        this.formItem.custBrchCode = info.brchCode;
        this.formItem.custBrchName = info.brchFullNameZh;
        this.showCpesBranch = false;
      },*/
      formSearch() {
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.custBrchName = "";
        this.formItem.custBrchCode = "";
      },
      agree(){
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t("确定审批同意吗？"),
          onOk: () => {
            this.confirmAgree();
          }
        })

      },
      confirmAgree() {
        let list = this.$refs.datagrid.selectIds;

        post({ids:list},'/be/market/preaudit/checkQuoteTolerance/func_agreeQuoteTolerance').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(1);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds=[];
              this.$refs.datagrid.selects=[];
            }else{
              this.$refs.datagrid.dataChange(1)
              this.$msgTip.error(this,{info:"操作失败:" + res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:"操作失败:"});
          }
        });
      },

      refuse(){
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t('m.i.common.confirm'),
          content: this.$t("确定审批拒绝吗？"),
          onOk: () => {
            this.confirmRefuse();
          }
        })
      },
      confirmRefuse() {
        let list = this.$refs.datagrid.selectIds;
        post({ids:list},'/be/market/preaudit/checkQuoteTolerance/func_refuseQuoteTolerance').then(res => {
          if(res){
            let retCode = res.data.retCode
            if(retCode=="000000"){
              this.$msgTip.success(this, { info: "操作成功" });
              this.$refs.datagrid.dataChange(1);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds=[];
              this.$refs.datagrid.selects=[];
              this.retMsg = "";
            }else{
              this.$refs.datagrid.dataChange(1)
              this.$msgTip.error(this,{info:"操作失败:" + res.data.retMsg});
            }
          }else{
            this.$msgTip.error(this,{info:"操作失败:"});
          }
        });
      },
      init(){
        post({}, '/be/market/preaudit/checkQuoteTolerance/func_initQuoteTolerance').then(res => {
          if (res && res.data) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.fieldToNameMap = res.data.retData.fieldToNameMap;
              this.prodNoToNameMap = res.data.retData.prodNoToNameMap;
            }
          }
        })
      }
    },

    mounted() {
      this.getDictListByGroups("ToleranceStatusCode").then(res => {
        let toleranceStatusList = res.get("ToleranceStatusCode");
        toleranceStatusList.forEach(item => {
          if (item.key === "1" || item.key === "5" || item.key === "7"){
            this.toleranceStatusList.push(item);
          }
        });
        this.dictMap = res.get("map");
      });
    },
    created(){
      this.init();
    }
  };
</script>

<style scoped>

</style>
