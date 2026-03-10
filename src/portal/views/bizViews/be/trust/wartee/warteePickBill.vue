<template>
  <div>
  <!--票交机构弹出框-->
  <h-msg-box v-model="tempPickCodeWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-table-layer" :maximize="true" @on-maximize="onMaximize">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div :class="{'h-form-overhd':!ifShowMore}">
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">

        <common-select v-if="this.isShow" v-model="formItem.billOrigin" :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin"
                       :dictList="this.billOriginList"></common-select>

        <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="reverseBillNo">
          <h-input v-model="formItem.reverseBillNo" :maxlength="30"></h-input>
        </h-form-item>
        <bill-range  :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>


        <h-form-item :label="$t('m.i.billInfo.billPackageMoney')" prop="billMoney" class="h-form-long-label">
          <h-row>
            <h-col span="11">
              <h-typefield v-model="formItem.minBillMoney" integerNum="10" placeholder="" type="money"
                           bigTips></h-typefield>
            </h-col>
            <h-col span="2" style="text-align: center">-</h-col>
            <h-col span="11">
              <h-typefield v-model="formItem.maxBillMoney" integerNum="10" placeholder="" type="money"
                           bigTips></h-typefield>
            </h-col>
          </h-row>
        </h-form-item>
        <h-form-item :label="this.$t('m.i.billInfo.remitDt')" prop="acptDt">
          <h-date-picker :value="rangeRemitDt" type="daterange" placement="bottom-end" placeholder=""
                         format="yyyy-MM-dd" @on-change="handleRemitDtChange"></h-date-picker>
        </h-form-item>
        <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="dueDt">
          <h-date-picker :value="rangeDueDt" type="daterange" placement="bottom-end" placeholder=""
                         format="yyyy-MM-dd" @on-change="handleDueDtChange"></h-date-picker>
        </h-form-item>
        <h-input v-if="false" v-model="formItem.batchId"></h-input>
        <h-input v-if="false" v-model="formItem.minRemitDt"></h-input>
        <h-input v-if="false" v-model="formItem.maxRemitDt"></h-input>
        <h-input v-if="false" v-model="formItem.minDueDt"></h-input>
        <h-input v-if="false" v-model="formItem.maxDueDt"></h-input>
        <h-form-item class="h-form-operate">
          <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                          :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
        <h-datagrid
            :columns="columns"
            highlight-row
            :url="datagridUrl"
            :bindForm="formItem"
            :row-select="true"
            :has-select="false"
            param-id="hldrId"
            :autoLoad=false
            ref="datagrid">
        </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
  <bill-info-main @billInfoWinClose="billInfoPickWinClose" :showBillInfoWin="showBillInfoPickWin" :billId="this.billId" :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off,formatNumber,formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "warteePickBill",
    data() {
      return {
        formItem: {
          brchFullNameZh: "",
          brchCode: "",
          reverseBillNo:"",
          billOrigin:"",
          minBillMoney:"",
          maxBillMoney:"",
          rangeRemitDt:"",
          minRemitDt:"",
          maxRemitDt:"",
          rangeDueDt:"",
          minDueDt:"",
          maxDueDt:"",
          guarantyType:"4",
          minBillRangeStart:"",
          maxBillRangeEnd:"",
          batchId:'',
        },
        isShow:true,
        rangeRemitDt:[],
        rangeDueDt:[],
        billOriginList:[],
        columns: [
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
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: 'billOrigin',
            hiddenCol:false,
            render: (h, params) => {
              let list = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' :  this.getDictValueFromMap(this.dictMap, "BillOrigin", params.row.billOrigin);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = params.row.billNo;
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
            }
          },
          //子票区间列
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              return h("span",formatBillRange(params.row.billOrigin,params.row.billRangeStart,params.row.billRangeEnd));
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
            sortable: true,
            render: (h, params) => {
              let billMoney = formatNumber(params.row.billMoney, 2, ",");
              return h("span", {
                domProps: {
                  title: billMoney
                }
              }, billMoney);
            }
          },
          {
            title: this.$t('m.i.billInfo.billType'),
            key: "billType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "DraftTypeCode", params.row.billType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.billClass'),
            key: "billClass",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "CDMedia", params.row.billClass);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.billInfo.remitDt'),
            key: "remitDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.remitDt == null ? "" : this.$moment(params.row.remitDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.dueDt'),
            key: "dueDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.dueDt == null ? "" : this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.billInfo.drwrName'),
            key: "drwrName",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.billInfo.acptName'),
            key: "acptName",
            sortable: true,
            hiddenCol: false
          }
        ],
        datagridUrl: "/bp/guaranty/apply/func_queryCanSendGuarantyBillByPage",
        ifShowMore: false,
        currentSelectList: [],
        dictMap: new Map(),
        showBillInfoPickWin:false,
        billId:"",
        billNo:""
      };
    },
    props: {
      pickCodeWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "挑票查询"
      },
      batchId: {
        type: Number,
        required: true
      },
      billType: {
        type: String
      },
      billClass: {
        type: String
      },
      ownedBrchNo:"",
      licenseFlag:false,
      hiddenBillOriginSelect:true,
    },
    watch: {
      pickCodeWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.formItem.billType = this.billType;
            this.formItem.billClass = this.billClass;
            this.isShow = this.billClass === 'ME02'?true:false;
            this.datagridUrl = "/bp/guaranty/apply/func_queryCanSendGuarantyBillByPage";
            this.formSearch();
          });
        }
      },
      hiddenBillOriginSelect(val) {
        // 遍历 columns 找到需要隐藏的字段
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].key === "billRange" || this.columns[i].key === "billOrigin") {
            this.columns[i].hiddenCol = val;
          }
        }
      }
    },
    computed: {
      tempPickCodeWin: {
        get() {
          return this.pickCodeWin;
        },
        set() {
        }
      }
    },
    methods: {

      billInfoPickWinClose() {
        this.showBillInfoPickWin = false;
      },
      showBillInfo(row){
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoPickWin = true;
      },

      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formSearch() {
        this.formItem.ownedBrchNo = this.ownedBrchNo;
        this.formItem.licenseFlag = this.licenseFlag;
        this.currentSelectList = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleRemitDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.rangeRemitDt = [arr[0],arr[1]];
        }else{
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.rangeRemitDt = [];
        }
      },
      handleDueDtChange(arr){
        if (arr && arr.length >= 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.rangeDueDt = [arr[0],arr[1]];
        }
        else{
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.rangeDueDt = [];
        }
      },
      formSearchReset() {
        this.rangeRemitDt = [];
        this.rangeDueDt = [];
        this.formItem.minBillMoney = "";
        this.formItem.maxBillMoney = "";
        this.formItem.rangeRemitDt = "";
        this.formItem.rangeDueDt = "";
        this.$refs.formItem.resetFields();
      },
      handleClose() {
        this.formSearchReset();
        this.$emit("pickBillWinClose", "");
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.$refs.gridPage.clearElevator();
      },
      submitForm() {
        this.currentSelectList = this.$refs.datagrid.selects;
        if (this.currentSelectList.length > 0) {
          this.formSearchReset();
          this.$emit("pickCodeChange", this.currentSelectList);
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
    },
    created() {
      this.getDictListByGroups("DraftTypeCode,CDMedia,BillOrigin").then(res => {
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
    },
    mounted() {
      // 遍历 columns 找到需要隐藏的字段
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].key === "billRange" || this.columns[i].key === "billOrigin") {
          this.columns[i].hiddenCol = this.isShow;
        }
      }
    }
  };
</script>

<style scoped>

</style>
