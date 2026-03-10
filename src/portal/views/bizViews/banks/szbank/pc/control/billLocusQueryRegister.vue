<!--台账管理 -->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item :label="$t('m.i.billInfo.billNo')" prop="billNo" :validRules="billNoRule">
                    <h-input v-model="formItem.billNo" :maxlength="30"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.be.billStatus')" prop="billStatus">
                    <h-select v-model="formItem.acptStatus" :label-width="90" placeholder=" ">
                      <h-option v-for="item in acptStatusList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="trackNumber" :label="$t('m.i.ce.trackNumber')" :validRules="trackNumberRule" >
                    <h-input v-model="formItem.courierNo" placeholder="" :maxlength="15"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.remitDt')" prop="minRemitDt">
                    <h-date-picker :value="remitDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleRemitChange" placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.billInfo.dueDt')" prop="minDueDt">
                    <h-date-picker :value="dueDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                  </h-form-item>
                  <show-branch v-model="formItem.acptBrchNameList" :label="$t('m.i.pe.acptBrch')" prop="acptBrchNameList" isNeedChecked
                               title="机构名称" :showCheckBox="true" :brchNo.sync="formItem.acptBrchNoList" :brchName.sync="formItem.acptBrchNameList"></show-branch>
                  <h-form-item :label="$t('m.i.billInfo.drwrAcctNo')" prop="drwrAcctNo">
                    <h-input v-model="formItem.drwrAcctNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item prop="pyeeAcctNo" :label="$t('m.i.billInfo.pyeeAcctNo')" >
                    <h-input v-model="formItem.pyeeAcctNo" placeholder=""></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.payRegistDt')" prop="minPayRegistDt">
                    <h-date-picker :value="formItem.rgstDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handlePayeeRegistDtChange" placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="companyName" :label="$t('m.i.pc.companyName')" >
                    <h-input v-model="formItem.courierCompanyName" placeholder="" :maxlength="60"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.ticketRecvStatus')" prop="ticketRecvStatus">
                    <h-select v-model="formItem.ticketRecvStatus" :label-width="90" placeholder=" ">
                      <h-option v-for="item in ticketRecvStatusList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.payRgstDt')" prop="minPayRgstDt">
                    <h-date-picker :value="payRgstDt" type="daterange" autoPlacement showFormat :editable=false @on-change="handlePayRgstDtChange" placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.ce.payRgstStatus')" prop="payRgstStatus">
                    <h-select v-model="formItem.payRgstStatus" :label-width="90" placeholder=" ">
                      <h-option v-for="item in payRgstStatusList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.payStatus')" prop="payStatus">
                    <h-select v-model="formItem.payStatus" :label-width="90" placeholder=" ">
                      <h-option v-for="item in upbsPayClearStatusList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.pc.lossStatus')" prop="lossStatus">
                    <h-select v-model="formItem.lossStatus" :label-width="90" placeholder=" ">
                      <h-option v-for="item in sspdStatusList" :value="item.key" :key="item.key">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                     :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            :hasSelect = false
            :rowSelect = true
            url = "/pe/szbank/busiqry/func_pageQueryBillLocusRgstList"
            :bindForm="formItem"
            ref="datagrid">
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--新增、修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="1000" :mask-closable="false" @on-close="handleWinClose"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>轨迹详情</span>
      </p>
      <div>
      <h-datagrid
        :columns="operColumns"
        url="/pe/szbank/busiqry/func_pageQueryOperLogList"
        :bindForm="queryItem"
        :auto-load="false"
        ref="bills">
        <div slot="toolbar" class="pull-left">
        </div>
      </h-datagrid>
      </div>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose()">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <!-- 查询客户账号信息弹窗 -->
<!--    <show-cust-acct-no :show-cust-acct-no-win="showCustAcctNoWin" :cust-no="this.formItem.drwrCustNo"-->
<!--                       @showCustAcctNoWinClose="showCustAcctNoWinClose" :isAllBankAcct=true-->
<!--                       @custAcctNoSelectSubmit="custAcctNoSelectSubmit"></show-cust-acct-no>-->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin"
                    :billId="this.billId" :billNo="this.billNo" :billRangeStart="billRangeStart" :billRangeEnd="billRangeEnd"></bill-info-main>
  </div>
</template>
<script>


  import { post, on, off, formatNumber, templateDownload,exportList,formatBillRange} from "@/api/bizApi/commonUtil";

  export default {
    name: "rebuyStockScaleManage",
    components: {

    },
    data() {
      return {
        dictMap : new Map(),
        formItem : {
          acptBrchNoList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchNo,
          acptBrchNameList: JSON.parse(window.sessionStorage.getItem('userInfo')).brchName,
          billNo: "",
          rgstDt:"",
          acptStatus: "",
          courierNo: "",
          remitDt: "",
          dueDt: "",
          acptBrchNoList: "",
          drwrAcctNo: "",
          pyeeAcctNo: "",
          payRegistDt: "",
          courierCompanyName: "",
          ticketRecvStatus: "",
          payRgstDt: "",
          payStatus: "",
          lossStatus: "",
          minDueDt: "",
          maxDueDt: "",
          minRemitDt: "",
          maxRemitDt: "",
          minPayRegistDt: "",
          maxPayRegistDt: "",
          minPayRgstDt: "",
          maxPayRgstDt: "",
        },
        queryItem : {
          billId:""
        },
        remitDt: [],
        dueDt: [],
        payRgstDt: [],
        payRegistDt: [],
        type : null,
        billId:"",
        billRangeStart:"",
        billRangeEnd:"",
        addOrEditWin : false,
        setRoleRole : false,
        setRoleRight : false,
        setRoleAllotRight : false,
        showBillInfoWin: false,
        showCustAcctNoWin: false,
        ifShowMore: false,
        readonly:false,
        isRequired:true,
        billNo: "",
        listId: "",
        minDueDt: "",
        maxDueDt: "",
        minRemitDt: "",
        maxRemitDt: "",
        minPayRegistDt: "",
        maxPayRegistDt: "",
        minPayRgstDt: "",
        maxPayRgstDt: "",
        trackNumberRule: [{ test: /[^\u4e00-\u9fa5]$/, trigger: "blur" ,message:"不能输入汉字" }],
        billNoRule: [{ test: /^[0-9]{0,30}$/, trigger: "blur", message: "只能输入数字" }],
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            align: 'center',
            width: 60,
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
            key: "billNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t('m.i.be.billStatus'),
            key: "acptStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcptStatus", params.row.acptStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.companyName"),
            key: "courierCompanyName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.trackNumber"),
            key: "courierNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.billMoneyByUnit"),
            key: "billMoney",
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
            title: this.$t("m.i.pe.acptBrch"),
            key: "acptBrchName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.drwrAcctNo"),
            key: 'drwrAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.drwrName"),
            key: "drwrName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.billInfo.pyeeAcctNo"),
            key: 'pyeeAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.pyeeName"),
            key: 'pyeeName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.billInfo.remitDt"),
            key: "remitDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.remitDt == null || params.row.remitDt === "") {
                return "";
              }
              let remitDt = this.$moment(params.row.remitDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", remitDt);
            }
          },
          {
            title: this.$t("m.i.billInfo.dueDt"),
            key: "dueDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.dueDt == null || params.row.dueDt === "") {
                return "";
              }
              let date = this.$moment(params.row.dueDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.acptAcctNo"),
            key: 'acptAcctNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.acptName"),
            key: 'acptName',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.rgstTellerNo"),
            key: 'rgstTellerNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.pc.payRegistDt"),
            key: "rgstDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.rgstDt == null || params.row.rgstDt === "") {
                return "";
              }
              let date = this.$moment(params.row.rgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.pc.ticketRecvStatus'),
            key: "ticketRecvStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ticketRecvStatus", params.row.ticketRecvStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.payRgstTellerNo"),
            key: 'payRgstTellerNo',
            hiddenCol: false,
          },
          {
            title: this.$t("m.i.ce.payRgstDt"),
            key: 'payRgstDt',
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.payRgstDt == null || params.row.payRgstDt === ""){
                return "";
              }
              let date = this.$moment(params.row.payRgstDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.ce.payRgstStatus'),
            key: "payRgstStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "payRgstStatus", params.row.payRgstStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.isInnerPrsttn"),
            key: 'isInnerPrsttn',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isInnerPrsttn);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.bs.paymentDt"),
            key: "paymentDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.paymentDt == null || params.row.paymentDt === "" || params.row.paymentDt === 0) {
                return "";
              }
              let date = this.$moment(params.row.paymentDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.payStatus"),
            key: 'clearStatus',
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "UpbsPayClearStatus", params.row.clearStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.pc.otherBankNo"),
            key: 'drweBankNo',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.queryTimes'),
            key: "qryCount",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.pc.freezeDueDt"),
            key: "anlgSspdDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.anlgSspdDt == null || params.row.anlgSspdDt === "" || params.row.anlgSspdDt === 0) {
                return "";
              }
              let date = this.$moment(params.row.anlgSspdDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t("m.i.pc.freezedMoney"),
            key: "billMoney",
            hiddenCol: false,
            ellipsis: false,
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
            title: this.$t('m.i.pc.freezedCourt'),
            key: "transFromName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.pc.lossStatus'),
            key: "sspdStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "SspdStatus", params.row.sspdStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title:this.$t("m.i.pc.locusDetail"),
            key: 'locusDetail',
            hiddenCol: false,
            render: (h, params) => {
              let vochPrint = "详情";
              return h("a", {
                on: {
                  click: () => {
                    this.showLocusDetail(params.row.billId)
                  }
                }
              }, vochPrint);
            }
          },
        ],
        operColumns : [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.billInfo.billNo"),
              key: "billNo",
              hiddenCol: false,
              render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.billInfoWinOpen(params.row);
                  }
                }
              }, params.row.billNo);
            }
          },
          {
            title: this.$t("m.i.pc.locusDetail"),
            key: 'busiType',
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.busiType == null || params.row.busiType === "") {
                return "";
              }
              if (params.row.busiType === '1') {
                return h("span", "签发");
              } else if (params.row.busiType === '2'){
                return h("span", "收票登记");
              } else if (params.row.busiType === '3'){
                return h("span", "付款登记");
              } else if (params.row.busiType === '4'){
                return h("span", "查询查复");
              } else if (params.row.busiType === '5'){
                return h("span", "冻止挂登记簿");
              } else if (params.row.busiType === '6'){
                return h("span", "解付");
              } else {
                return h("span", "");
              }
            }
          },
          {
            title: this.$t('m.i.be.billStatus'),
            key: "busiStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "AcptStatus", params.row.busiStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.ce.dealDt"),
            key: "dealDt",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.dealDt == null || params.row.dealDt === "") {
                return "";
              }
              let dealDt = this.$moment(params.row.dealDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", dealDt);
            }
          },
          {
            title: this.$t("m.i.ce.createTime"),
            key: "transTm",
            hiddenCol: false,
            render: (h, params) => {
              let time = params.row.transTm;
              if (!!params.row.transTm) {
                let transTm = params.row.transTm.toString();
                time = this.$moment(transTm, "HH:mm:7").format("HH:mm:ss");
              }
              return h("span", time);
            }
          },
          {
            title: this.$t("m.i.pc.companyName"),
            key: "custName",
            hiddenCol: false
          },
        ],
        acptStatusList : [],
        payRgstStatusList : [],
        upbsPayClearStatusList : [],
        sspdStatusList : [],
        ticketRecvStatusList : [],
        lossStatusList : [],
        payStatusList : [],
        tempInx : 0,
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        param : null,
        rows : null,
      };
      //日期字符串格式化（yyyy-mm-dd）
      function datatoDate(value){
        if (value != null && value != "") {
          var str=value.toString();
          return str.slice(0,4)+'-'+str.slice(4,6)+'-'+str.slice(6,8);
        }
        else {
          return "";
        }
      }
    },
    methods: {
      //日期选择框
      handleRemitChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minRemitDt = arr[0].replace(/-/g, "");
          this.formItem.maxRemitDt = arr[1].replace(/-/g, "");
          this.remitDt = [arr[0], arr[1]];
        } else {
          this.formItem.minRemitDt = "";
          this.formItem.maxRemitDt = "";
          this.remitDt = [];
        }
      },
      handleDueDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minDueDt = arr[0].replace(/-/g, "");
          this.formItem.maxDueDt = arr[1].replace(/-/g, "");
          this.dueDt = [arr[0], arr[1]];
        } else {
          this.formItem.minDueDt = "";
          this.formItem.maxDueDt = "";
          this.dueDt = [];
        }
      },
      handlePayeeRegistDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minPayRegistDt = arr[0].replace(/-/g, "");
          this.formItem.maxPayRegistDt = arr[1].replace(/-/g, "");
          this.payRegistDt = [arr[0], arr[1]];
        } else {
          this.formItem.minPayRegistDt = "";
          this.formItem.maxPayRegistDt = "";
          this.payRegistDt = [];
        }
      },
      handlePayRgstDtChange(arr) {
        if (arr && arr.length == 2) {
          this.formItem.minPayRgstDt = arr[0].replace(/-/g, "");
          this.formItem.maxPayRgstDt = arr[1].replace(/-/g, "");
          this.payRgstDt = [arr[0], arr[1]];
        } else {
          this.formItem.minPayRgstDt = "";
          this.formItem.maxPayRgstDt = "";
          this.payRgstDt = [];
        }
      },
      showLocusDetail(value) {
        this.queryItem.billId = value;
        this.addOrEditWin = true;
        this.$nextTick(()=>{
          this.$refs.bills.dataChange(1);
        })

      },
      billInfoWinOpen(row) {
        this.billNo = row.billNo;
        this.billId = row.billId;
        this.billRangeStart=row.billRangeStart;
        this.billRangeEnd=row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      handleWinClose() {
        this.queryItem.billId = "";
        this.addOrEditWin = false;
      },
      //查询按钮点击事件
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      handleReset() {
        this.$refs.formItem.resetFields();
        this.formItem.custName = "";
        this.formItem.corpScale = "";
        this.formItem.operDt = "";
      },
      showBillInfo(row){
          this.billId = row.billId;
          this.billRangeStart = row.billRangeStart;
          this.billRangeEnd = row.billRangeEnd;
          if(row.balanceType == "14"){
            this.listId = listId;
            this.billNo = billNo;
            this.showBillInfoStdWin = true;
          }else{
            this.showBillInfoWin = true;
          }


      },
      billInfoWinClose(){
          this.showBillInfoWin = false;
      },

      billInfoStdWinClose(){
        this.billId=null;
        this.billNo=null;
        this.listId=null;
        this.showBillInfoStdWin=false;
      },
    },
    created() {
      let userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
      this.formItem.brchNos = userInfo.brchNo;
      this.formItem.branchName = userInfo.brchName;
    },
    mounted() {
      this.openI9flag=window.sessionStorage.getItem('isOpenI9')=='1'?true:false;
      this.getDictListByGroups("ticketRecvStatus,AcptStatus,payRgstStatus,isAcpt,UpbsPayClearStatus,SspdStatus,Yon").then(res => {
        this.ticketRecvStatusList = res.get("ticketRecvStatus");
        this.acptStatusList = res.get("AcptStatus");
        this.payRgstStatusList = res.get("payRgstStatus");
        this.upbsPayClearStatusList = res.get("UpbsPayClearStatus");
        this.sspdStatusList = res.get("SspdStatus");
        this.dictMap = res.get("map");
      });
    }
  };

</script>
