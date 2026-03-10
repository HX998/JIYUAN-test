<!--极速贴现-渠道预申请订单管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="91" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.discInBrchNoList" :label="$t('m.i.ce.discInBrchName')" prop="discInBrchNoList" required
                             title="机构名称" :brchNo.sync="formItem.discInBrchNoList" :brchName.sync="formItem.discInBrchNameList">
                </show-branch>

                <channel-select v-model="formItem.channelNoStr" :label="$t('m.i.ce.channelName')"></channel-select>

                <h-form-item :label="$t('m.i.ce.orderNo')" prop="payOrderNo">
                  <h-input v-model="formItem.payOrderNo" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.orderStatus')" prop="status">
                  <h-select v-model="formItem.status" placeholder="" showTitle>
                    <h-option v-for="item in orderStatusList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>



                <h-form-item :label="$t('m.i.billInfo.billOrigin')" prop="billOrigin">
                  <h-select v-model="formItem.billOrigin" placeholder="">
                    <h-option v-for="item in billOriginList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>

                <h-form-item :label="$t('m.i.billInfo.billPackageNo')" prop="billNoLike">
                  <h-input v-model="formItem.billNoLike" :maxlength=60></h-input>
                </h-form-item>
                <!--子票区间-->
                <bill-range :form-item="formItem" :range-props="['minBillRangeStart','maxBillRangeEnd']"></bill-range>


                <h-form-item :label="$t('m.i.pe.discApplyFullName')" prop="custName" class="h-form-long-label">
                  <h-input v-model="formItem.custName" :maxlength=60></h-input>
                </h-form-item>
                <common-date-picker v-model="formItem.discDtArr" :label="$t('m.i.billInfo.discDt')" prop="discDtArr" type="daterange" :rangeValue="['minDiscDt','maxDiscDt']"
                                    :minDiscDt.sync="formItem.minDiscDt" :maxDiscDt.sync="formItem.maxDiscDt">
                </common-date-picker>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlightRow
            url="/ce/disc/elec/fastdisc/fdiscOrder/func_queryChannelApplOrder"
            :bindForm="formItem"
            :hasSelect="false"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="orderCancel()">{{$t("m.i.ce.orderCancel")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>


  </div>
</template>

<script>
  import { post,formatNumber,accMul,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "channelPreApplOrder",
    components: {
    },
    data() {
      return {
        formItem : {
          discInBrchNoList:this.$store.getters.userInfo.brchNo,
          discInBrchNameList:this.$store.getters.userInfo.brchName,
          channelNoStr:"",
          channelNameArray:"",
          payOrderNo:"",
          status:"",
          billNo:"",
          billNoLike:"",
          custName:"",
          minDiscDt: "",
          maxDiscDt: "",
          discDtArr:[],
        },
        postForm : {
          channelNoStr:"",
          payOrderNo:"",
        },
        columns : [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false,
            align: "center"
          },{
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },{
            title: this.$t("m.i.ce.orderNo"),
            key: "payOrderNo",
            hiddenCol: false,
            sortable: true
          },{
            title: this.$t("m.i.ce.orderStatus"),
            key: "status",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "FDiscOrderStatus", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },{
            title: this.$t("m.i.ce.channelName"),
            key: "channelName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.billInfo.billOrigin"),
            key: "billOrigin",
            hiddenCol: false,
            render:(h,params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap,"BillOrigin",params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align:'center',
            key:"billRange",
            hiddenCol: false,
            render:(h,params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageMoney"),
            key: "billMoney",
            hiddenCol: false,
            sortable: true,
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
            title: this.$t("m.i.pe.discApplyFullName"),
            key: "custName",
            hiddenCol: false
          },{
            title: this.$t("m.i.ce.discApplOrgCode"),
            key: "custOrgCode",
            hiddenCol: false
          },{
            title: this.$t("m.i.pe.discApplyNo"),
            key: "custAcctNo",
            hiddenCol: false
          },{
            title: this.$t("m.i.pe.inAcctNo"),
            key: "aoAcctNo",
            hiddenCol: false
          },{
            title: this.$t("m.i.billInfo.dueDt"),
            key: 'dueDt',
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.dueDt == null || params.row.dueDt === ""){
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },{
            title: this.$t("m.i.billInfo.acptBankNo"),
            key: "acptBankNo",
            hiddenCol: false
          },{
            title: this.$t("m.i.billInfo.discDt"),
            key: "discDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.discDt == null || params.row.discDt === ""){
                return "";
              }
              let discDt = this.$moment(params.row.discDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", discDt);
            }
          },{
            title: this.$t("m.i.ce.toBankNo"),
            key: "discInBankNo",
            hiddenCol: false,
            sortable: true,
          },{
            title: this.$t("m.i.pe.discRate"),
            key: "ratePct",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let rate = formatNumber(params.row.ratePct, 4, ",");
              return h("span", rate);
            }
          },{
            title: this.$t("m.i.ce.orderRcvTime"),
            key: "orderRcvTime",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.orderRcvTime && "" !== params.row.orderRcvTime) {
                let orderRcvTm = this.$moment(params.row.orderRcvTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                return h("span", orderRcvTm);
              }
            }
          },{
            title: this.$t("m.i.ce.fdiscApplRcvTime"),
            key: "fdiscRcvTime",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (null != params.row.fdiscRcvTime && "" !== params.row.fdiscRcvTime) {
                let fdiscRcvTime = this.$moment(params.row.fdiscRcvTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                return h("span", fdiscRcvTime);
              }
            }
          },{
            title: this.$t("m.i.ce.fdiscFailReason"),
            key: "fdiscFailReason",
            hiddenCol: false,
            sortable: true,
          }
        ],
        orderStatusList:[],
        billOriginList : [],
        yonList : [],
        discDt : [],
        dictMap : new Map(),
        getDateUrl:'/sm/oper/busiDate/viewBusiDate',
        //是否显示更多查询项
        ifShowMore : false,
        channelList:[],
        brchNoWin : false,
      };
    },
    mounted() {
      this.getDictListByGroups("FDiscOrderStatus,Yon,OnOffSwicth,BillOrigin").then(res => {
        this.orderStatusList = res.get("FDiscOrderStatus");
        this.yonList = res.get("Yon");
        this.billOriginList = res.get("BillOrigin");
        this.dictMap = res.get("map");
      });
      post({}, "/bm/prod/guideRate/guideRateMain/func_getAllChannels").then(res => {
        if (res) {
          if (res.data.retCode === "000000") {
            this.channelList = res.data.retData;
          }
        }
      });
    },
    methods: {

      //【订单作废】按钮确认框
      orderCancel(){
        let list = this.$refs.datagrid.selects;
        if (list.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        for(let i = 0; i < list.length; i++){
          if(list[i].status != "FD00"){
            this.$msgTip.info(this, { info: "只有未发起贴现订单才能作废！" });
            return;
          }
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmCancelOrder"),
          onOk: () => {
            this.handleMethods();
          }
        });
      },
      handleMethods(){
        let list = this.$refs.datagrid.selects;
        this.postForm.channelNoStr = list[0].channelNo;
        this.postForm.payOrderNo = list[0].payOrderNo;
        post({ids:this.$refs.datagrid.selectIds}, "/ce/disc/elec/fastdisc/fdiscOrder/func_cancelChannelApplOrder").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },

      //表单查询
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.channelNoStr = "";
        this.formItem.discInBrchNoList = this.$store.getters.userInfo.brchNo;
        this.formItem.discInBrchNameList = this.$store.getters.userInfo.brchName;
        let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
        this.formItem.discDtArr = [workDate, workDate];
        this.formItem.minDiscDt = window.sessionStorage.getItem("workDate");
        this.formItem.maxDiscDt = window.sessionStorage.getItem("workDate");
      },

    },
    created() {
      let workDate = this.$moment(window.sessionStorage.getItem("workDate"), "YYYYMMDD").format("YYYY-MM-DD");
      this.formItem.discDtArr = [workDate, workDate];
      this.formItem.minDiscDt = window.sessionStorage.getItem("workDate");
      this.formItem.maxDiscDt = window.sessionStorage.getItem("workDate");
    }
  };
</script>

<style scoped>

</style>
