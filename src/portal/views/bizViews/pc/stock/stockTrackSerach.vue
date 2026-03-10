<template>
  <!--电票提示付款跟踪查询-->
  <div class="layout">
    <div>
      <h-row name="flex" class="layout-menu-wrapper">
        <h-col span="24">
          <div>
            <!--查询表单-->
            <div class="h-form-search-box">
              <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
                <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                  <show-branch v-model="formItem.ownedBrchNos" :label="$t('m.i.common.ownedBrchNo')" prop="ownedBrchNos" title="机构名称"
                               :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames" v-if="this.licenseFlag" :params="{authPath: this.authPath}"
                               url ="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree" queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                  </show-branch>
                  <common-select v-model="formItem.stockStatus" :dict-list="stockStatusList" :clearable="false"
                                 label="库存状态" prop="stockStatus"></common-select>
                  <bill-type v-model="formItem.billType" :dictList="billTypeList"></bill-type>
                  <bill-no v-model="formItem.billNoLike" prop="billNoLike"></bill-no>
                  <common-select v-model="formItem.stockBusiType" :dict-list="stockBusiTypeList" label="业务类型"
                                 :clearable="false" prop="stockBusiType"></common-select>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t('m.i.common.search')}}</h-button>
                    <h-button type="ghost" @click="resetSearch()">{{$t('m.i.common.reset')}}</h-button>
                  </h-form-item>
                </h-form>
              </h-panel>
              <!-- 数据展示表格 -->
              <h-datagrid
                :columns="columns"
                highlightRow
                :row-select="true"
                :has-select="false"
                :bindForm="formItem"
                url="/pc/stock/stockTrackSerach/func_queryStockBillInfoByPage"
                ref="datagrid">
                <div slot="toolbar" class="pull-left">
                  <h-button type="primary" @click="exportData()">{{$t('m.i.common.exportData')}}</h-button>
                </div>
              </h-datagrid>
            </div>
          </div>
          <!--票面信息-->
          <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"></bill-info-main>
          <!--excel导出-->
          <common-excel-download @handleSubmit="exportList" @showExcelTemplateWinClose="tempShowExcelTemplateWin=false"
                                 :showExcelTemplateWin="tempShowExcelTemplateWin" :param="this.param" :rows="this.rows" :exclundFields="this.licenseFlag?[]:['ownedBrchName']"></common-excel-download>
          <h-msg-box v-model="flowHistWin" width="800" class="h-form-table-layer" :maximize="true"
                     :mask-closable="false" @on-close="flowHistWin=!flowHistWin" @on-maximize="onMaximize">
            <p slot="header">
              <span>实物流转历史</span>
            </p>
            <div>
                  <h-datagrid :columns="histColumns"
                              :bindForm="histForm"
                              :autoLoad="false"
                              url="/pc/stock/stockTrackSerach/func_queryStockBillHist"
                              :height="350"
                              highlight-row
                              ref="stockHisDataGrid" class="pl-5 pr-5">
                    <div slot="toolbar" class="pull-left">
                    </div>
                  </h-datagrid>
            </div>
            <div slot="footer">
              <h-button type="ghost" @click="flowHistWin=!flowHistWin">{{$t("m.i.common.close")}}</h-button>
            </div>
          </h-msg-box>
        </h-col>
      </h-row>
    </div>
  </div>
</template>

<script>
  import {post,on, off,getDictListByGroups,getDictValueFromMap, formatNumber,exportList} from "@/api/bizApi/commonUtil";

  export default {
    name: "stockTrackSerach",
    components: {
    },
    data() {
      return {
        licenseFlag:false,
        authPath:this.$route.path,
        flowHistWin:false,
        tempShowExcelTemplateWin:false,
        param:"",
        rows:"",
        formItem : {
          stockStatus:"",
          billType:"",
          billNoLike:"",
          stockBusiType:"",
          operTypeList:['1','4'],
          ownedBrchNos:this.$store.getters.userInfo.brchNo,
          ownedBrchNames:this.$store.getters.userInfo.brchName,
          authPath:this.$route.path
        },
        columns : [
          {
            type: "selection",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: 'index',
            key: 'numOrder',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.common.ownedBrchNo"),
            key: "ownedBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row.billId);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billType"),
            key: "billType",

            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"DraftTypeCode",params.row.billType);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            },
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ',');
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",

            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.remitDt == null || params.row.remitDt === ""){
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", {domProps: {title: remitDt}},  remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let dueDt = this.$moment(params.row.dueDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: dueDt}},   dueDt);
            }
          },
          {
            title:"库存状态",
            key:"stockStatus",
            hiddenCol:false,
            render: (h,params)=>{
              let dictValue = getDictValueFromMap(this.dictMap,"EntityStockStatus",params.row.stockStatus);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title:"业务类型",
            key:"stockBusiType",
            hiddenCol:false,
            render: (h,params)=>{
            let dictValue = getDictValueFromMap(this.dictMap,"EntityStockBusiType",params.row.stockBusiType);
            return h("span", {
              domProps: {
                title: dictValue
              }
             }, dictValue);
           }
          },
          {
            title: "出票人账号",
            key: "drwrAcctNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: "出票人全称",
            key: "drwrName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title: "付款行行号",
            key: "drweBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: "付款行行名",
            key: "drweBankName",
            hiddenCol: false,
            sortable: true,
          },
          {
            title:"流转历史",
            key:"flowHist",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.showFlowHistory(params.row.billNo,params.row.stockBrchNo);
                  }
                }
              }, '流转历史');
            }
          }
        ],
        ifShowMore : false,
        dictMap : new Map(),
        billTypeList : [],
        busiTypeList:[],
        stockStatusList:[],
        stockBusiTypeList:[],
        //票面信息页面
        showBillInfoWin : false,
        billId : "",
        histForm:{
          billNo:"",
          licenseFlag:false,
          ownedBrchNo:""
        },
        histColumns:[
          {
            type: "radio",
            title:" ",
            width: 60,
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
            title:"出入库类型",
            key:"outInType",
            hiddenCol:false,
            render:(h,params)=>{
              let list ="";
              if (params.row.outInType ==="1") {
                list="入库";
              }else if (params.row.outInType === "2") {
                list="出库";
              }
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:"处理状态",
            key:"processStatus",
            hiddenCol:false
          },
          {
            title: this.$t("m.i.common.operDt"),
            key: "operDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.operDt == null || params.row.operDt === ""){
                return "";
              }
              let operDt = this.$moment(params.row.operDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span",{domProps: {title: operDt}},   operDt);
            }
          },
          {
            title:"业务类型",
            key:"stockBusiType",
            hiddenCol:false,
            render:(h,params)=>{
              let list = this.getDictValueFromMap(this.dictMap, "EntityStockBusiType", params.row.stockBusiType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },{
            title:"批次号",
            key:"batchNo",
            hiddenCol:false
          },{
            title:"客户名称",
            key:"custName",
            hiddenCol:false
          },{
            title:"交易机构",
            key:"transBrchName",
            hiddenCol:false
          },{
            title:"实物机构",
            key:"saveBrchName",
            hiddenCol:false
          }
        ]
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode,EntityStockStatus,EntityStockBusiType,EntityStockOperType").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.stockStatusList=res.get("EntityStockStatus");
        this.stockBusiTypeList=res.get("EntityStockBusiType");
        this.dictMap = res.get("map");
      });
      //有授权则显示业务所属机构列
      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        this.authPath = this.$route.path;
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
            if (this.licenseFlag) {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", false);
            }else {
              this.$refs.datagrid.controlColumnsHidden("ownedBrchName", true);
            }
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

    },
    methods: {
      //查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.ownedBrchNames =this.$store.getters.userInfo.brchName;
        this.formItem.ownedBrchNos =this.$store.getters.userInfo.brchNo;
      },
      //票面信息关闭
      billInfoWinClose(){
        this.showBillInfoWin = false;
      },
      //票面信息
      showBillInfo(billId){
        this.billId = billId;
        this.showBillInfoWin = true;
      },
      exportData(){
        this.param = 'entityStockTrackSearchExport';
        if (this.$refs.datagrid.selectIds.length !== 0) {
          this.rows = this.$refs.datagrid.selectIds.length;
        }else {
          this.rows = this.$refs.datagrid.total;
        }
        this.tempShowExcelTemplateWin = true;
      },
      exportList(field, exportType){
        let exportUrl = window.LOCAL_CONFIG.API_HOME + "/pc/stock/stockTrackSerach/func_exportData";
        let options = {};
        if (this.$refs.datagrid.selectIds.length !== 0) {
          options.params = {
            ids: this.$refs.datagrid.selectIds,
            authPath:this.authPath
          };
          options.pageSize = this.$refs.datagrid.selectIds.length;
        } else {
          options.params = this.formItem;
          options.pageSize = this.$refs.datagrid.total;
        }
        exportList(this, this.param, field, exportType, exportUrl, options);
      },
      showFlowHistory(billNo,brchNo){
        this.histForm.billNo=billNo;
        this.histForm.ownedBrchNo=brchNo
        this.histForm.licenseFlag=this.licenseFlag
        this.flowHistWin=true
        this.$nextTick(()=>{
          this.$refs.stockHisDataGrid.dataChange(1);
        })
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
    }
  };
</script>

<style scoped>

</style>
