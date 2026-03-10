<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <!--客户号-->
                <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">
                  <select-cust-corp v-model="formItem.custNo" :custNo="formItem.custNo"
                                    :value.sync="formItem.custNo" :custName.sync="formItem.custName" :socCode.sync="formItem.socCode"></select-cust-corp>
                </h-form-item>
                <!--客户名称-->
                <common-input v-model="formItem.custName" :label="$t('m.i.common.corpName')"
                              prop="custName" :maxlength=60 ></common-input>
                <!--统一社会信用代码-->
                <common-input v-model="formItem.socCode" :label="$t('m.i.common.socCode')"
                              prop="socCode" className="h-form-long-label" :maxlength=18 ></common-input>

                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/bm/cpes/custsign/custCorpSign/func_queryCustCorpSignRecordByPage"
                      :bindForm="formItem"
                      :onCurrentChange="onCurrentChange"
                      :onCurrentChangeCancel="onCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="recordDetail()">{{$t("m.i.bm.custSignRecordQuery")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!-- 明细弹出 -->
    <record-detail-show :recordDetailShowWin="recordDetailShowWin" :batchParams="batchParams" :dictMap="dictMap"
                      @recordDetailShowWinClose="recordDetailShowWinClose" ref="recordDetailShow"></record-detail-show>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "custCorpSign",
    components: {
      recordDetailShow:()=>import(/* webpackChunkName: "bm/sign/cpes/recordDetailShow" */`@/views/bizViews/bm/sign/cpes/recordDetailShow`),
    },
    data() {
      return {
        formItem: {
          custNo:"",
          custName:"",
          socCode:"",
          isArc:"",
          isGreenCorp:"",
          isTechnologyCorp:"",
          custRgstStatus:"1",
        },
        selectData: [],
        ifShowMore: false,
        isShowBotton : false,
        columns: [
          {
            type: "radio",
            title: " ",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
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
            title: this.$t('m.i.common.custNo'),
            key: 'custNo',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.corpName'),
            key: 'custName',
            hiddenCol: false,
            sortable: true,
          },
          {
            title: this.$t('m.i.common.socCode'),
            key: 'socCode',
            hiddenCol: false,
            sortable: true,
          }
        ],
        dictMap: new Map(),
        yonList:[],
        corpRgstStatusList:[],
        corpScaleList:[],
        corpNatureList:[],
        certTypeList:[],
        cespAcctTypeList:[],
        ecdsDraftStatusCodeList:[],
        btnAuth: {},
        recordDetailShowWin: false,
        isMustSelect: true,
        hasCommit:true,
        batchParams: {},
      };
    },
    mounted() {
      this.getDictListByGroups("CorpSignRgstStatus,CpesCorpNature,Yon,Industry,CorpScale,CertType,CpesAcctType,CpesCorpNature,EcdsDraftStatusCode,CorpSignOperType").then(res => {
        this.corpRgstStatusList = res.get("CorpSignRgstStatus");
        this.yonList = res.get("Yon");
        this.corpScaleList = res.get("CorpScale");
        this.corpNatureList = res.get("CpesCorpNature");
        this.certTypeList = res.get("CertType");
        this.cespAcctTypeList = res.get("CpesAcctType");
        this.ecdsDraftStatusCodeList = res.get("EcdsDraftStatusCode");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(currentRow, oldCurrentRow, _index) {
        this.selectData = [];
      },
      //修改签约状态时刷新
      changeStatus() {
        if(this.formItem.custRgstStatus !== "1"){
          this.isShowBotton = true;
        }else{
          this.isShowBotton = false;
        }
        this.handleSearch();
      },
      //表单查询
      handleSearch() {
        this.selectData = [];
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },

      recordDetail(){
        if (this.selectData.length < 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.batchParams.custRgstStatus = this.formItem.custRgstStatus;
        this.batchParams.custNo = this.selectData.custNo;
        this.batchParams.custId = this.selectData.id;
        this.batchParams.corpScaleList = this.corpScaleList;
        this.batchParams.yonList = this.yonList;
        this.batchParams.corpNatureList = this.corpNatureList;
        this.batchParams.certTypeList = this.certTypeList;
        this.batchParams.ecdsDraftStatusCodeList = this.ecdsDraftStatusCodeList;
        this.recordDetailShowWin = true;
      },

      recordDetailShowWinClose(status) {
        this.batchParams = {};
        this.recordDetailShowWin = false;
        this.handleSearch();
      },
    }
  };


</script>

<style scoped>

</style>
