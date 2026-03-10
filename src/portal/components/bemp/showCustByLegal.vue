<template>
  <!-- 根据法人查询客户信息，无视共享标识，不传法人则全量查询 -->
  <h-msg-box v-model="tempShowCustMessageWin" :mask-closable="false" @on-close="handleClose" :z-index=1200
              :maximize="true" width="1000" class="h-form-table-layer" @on-maximize="onMaximize">
    <p slot="header">
      <span>查询客户信息</span>
    </p>
    <!-- 查询表单 -->
    <div :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
          <h-form-item label="客户号" prop="custNo">
            <h-input v-model="formItem.custNo" placeholder="" :maxlength=50></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custName')" prop="custName">
            <h-input v-model="formItem.custName" placeholder="" :maxlength=60></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.orgCode')" prop="orgCode">
            <h-input v-model="formItem.orgCode" placeholder="" :maxlength=10></h-input>
          </h-form-item>
          <h-form-item label="是否为集团客户" prop="isGroupCus">
            <h-select v-model="formItem.isGroupCus" placeholder="">
              <h-option v-for="item in isList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
    </div>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="showCustMessageColumns"
          :bindForm="formItem"
          highlight-row
          :auto-load="false"
          :height="300"
          :url="datagridUrl"
          :onRowDbClick="doubleHandleClick"
          :on-select-change="handlelRowClick"
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, getDictListByGroups,getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "showCustByLegal",
    data() {
      return{
          formItem : {
            legalNo:'',
            custNo:'',
            custName:'',
            orgCode:'',
            isGroupCus:'',
            ownedBrchNos:"",
            ownedBrchNo:"",
            licenseFlag: "",
            activeFlag: '1'
          },
          showCustMessageColumns : [
            {
              title: ' ',
              type: 'radio',
              align: 'center',
              width : 50
            },
            {
              type: 'selection',
              key: 'multiSelect',
              width: 60,
              hiddenCol: true,
            },
            {
              title: this.$t("m.i.common.index"),
              type: "index",
              width: 60,
              align: "center"
            },
            {
              title: '客户号',
              key: "custNo",
              hiddenCol: false,
            },
            {
              title: this.$t('m.i.common.custName'),
              key: "custName",
              hiddenCol: false,
              sortable: true,
            },
            {
              title: this.$t('m.i.common.orgCode'),
              key: "orgCode",
              hiddenCol: false,
            },
          ],
          dictMap : new Map(),
          currentSelectRow : [],
          isList : [],
          ifShowMore : false,
          datagridUrl:"",
      }

    },
    props: {
      legalNo:"",
      ownedBrchNos:"",
      ownedBrchNo:"",
      licenseFlag: {
        type: Boolean,
        default() {
          return false;
        }
      },
      showCustMessageWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
    },
    watch: {
      showCustMessageWin(val) {
        if (val === true) {
          this.getDictInfo();
          this.datagridUrl = '/bm/cust/corp/pageQueryCustCorpByLegalNo';
          this.currentSelectRow = [];
          this.$nextTick(() => {
            this.formSearchReset();
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            this.formItem.legalNo = this.legalNo;
            this.formSearch();
          })
        }
      }
    },
    computed: {
      tempShowCustMessageWin: {
        get() {
          return this.showCustMessageWin;
        },
        set() {}
      },
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      getDictInfo() {
        getDictListByGroups("Yon").then(res => {
          this.isList = res.get("Yon");
          this.dictMap = res.get("map");
        });
      },
      //查询
      formSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //查询重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.getDoubleClickCustAcctList(this.currentSelectRow.custNo);
      },
      submitForm() {
        let list = this.currentSelectRow[0];
        if (list == null || list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        // 根据客户号查询客户账户，若仅有一条账户，则直接反显账户
        this.getCustAcctList(list.custNo);
      },
      getCustAcctList (custNo) {
        let url = '/bm/cust/acct/pageQueryCustAcctList';
        post({custNo:custNo, isOtherBankAcct: '0'},url).then(res => {
            if(res){
              let retCode = res.data.retCode;
              if(retCode === "000000" ){
                let list = res.data.retData.list;
                this.currentSelectRow[0].custAcctNo = "";
                if(list.length === 1){
                  this.currentSelectRow[0].custAcctNo = list[0].custAcctNo;
                  this.currentSelectRow[0].openBankNo = list[0].openBankNo;
                  this.currentSelectRow[0].openBrchNo = list[0].openBrchNo;
                }
                this.$emit("custCorpSelectSubmit", this.currentSelectRow[0]);
              } else {
                // 查询失败
                this.$msgTip.error(this,{info:res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
            }
          }
        )
      },
      getDoubleClickCustAcctList(custNo) {
        let url = '/bm/cust/acct/pageQueryCustAcctList';
        post({custNo:custNo, isOtherBankAcct: '0'},url).then(res => {
            if(res){
              let retCode = res.data.retCode;
              if(retCode === "000000" ){
                let list = res.data.retData.list;
                this.currentSelectRow.custAcctNo = "";
                if(list.length === 1){
                  this.currentSelectRow.custAcctNo = list[0].custAcctNo;
                  this.currentSelectRow.openBankNo = list[0].openBankNo;
                  this.currentSelectRow.openBrchNo = list[0].openBrchNo;
                }
                this.$emit("custCorpSelectSubmit", this.currentSelectRow);
              } else {
                // 查询失败
                this.$msgTip.error(this,{info:res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this,{info:this.$t('m.i.common.netError')});
            }
          }
        )
      },
      handleClose() {
        this.formSearchReset();
        this.$emit("custCorpWinClose", "");
      }
    },
  };
</script>

<style scoped>

</style>
