<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <div class="h-search-form-row">
                  <h-form-item prop="draftDate" label="报文日期">
                    <h-date-picker v-model="formItem.draftDate" format="yyyy-MM-dd" type="daterange" placeholder=""
                                   showFormat :editable=false @on-change="handleDraftDateChange"></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="draftNo" label="报文编号">
                    <h-input v-model="formItem.draftNo" placeholder="" :maxlength="6"></h-input>
                  </h-form-item>
                  <h-form-item prop="orgnlDraftNo" :label="$t('m.i.common.originalDraftNo')">
                    <h-input v-model="formItem.orgnlDraftNo" placeholder="" :maxlength="6"></h-input>
                  </h-form-item>
                  <h-form-item prop="msgId" :label="$t('m.i.common.msgId')">
                    <h-input v-model="formItem.msgId" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="orgnlMsgId" :label="$t('m.i.common.originalMsgId')">
                    <h-input v-model="formItem.orgnlMsgId" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="sendRcvFlag" label="报文方向">
                    <h-select v-model="formItem.sendRcvFlag" placeholder="">
                      <h-option v-for="item in sendRcvFlagList" :value="item.key" :key="item.value" :label="item.value">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="billNoLike" :label="$t('m.i.billInfo.billPackageNo')">
                    <h-input v-model="formItem.billNoLike" placeholder="" :maxlength="30"></h-input>
                  </h-form-item>
                  <!--子票区间-->
                  <bill-range :formItem="formItem" :rangeProps="['minBillRangeStart','maxBillRangeEnd']"></bill-range>
                  <h-form-item prop="dealNo" label="成交单编号">
                    <h-input v-model="formItem.dealNo" placeholder="" :maxlength="16"></h-input>
                  </h-form-item>
                  <h-form-item prop="busiNo" label="业务单编号">
                    <h-input v-model="formItem.busiNo" placeholder="" :maxlength="20"></h-input>
                  </h-form-item>
                  <h-form-item prop="dealFlag" :label="$t('m.i.shcpe.draftDealResult')">
                    <h-select v-model="formItem.dealFlag" placeholder="">
                      <h-option v-for="item in draftStatusList" :value="item.key" :key="item.value" :label="item.value">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item class="h-form-operate">
                    <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                    <h-button type="primary" @click="handleSearch">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="resetSearch">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>

                </div>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/draft/check/msgLogMain/func_queryMsgLog"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="showInfo()" v-if="authObj.showInfoBtn">{{$t("m.i.common.viewDatail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <h-msg-box v-model="draftInfoWin" width="1000"  :mask-closable="false" :maximize="true"
               @on-close="closeForm">
      <p slot="header">
        <span>报文详情</span>
      </p>
      <h-panel>
        <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item label="报文内容" prop="draftContent" class="h-form-height-auto">
              <textarea id="cpesDraftContentId" readonly rows="20"
                        style="overflow-y:auto;overflow-x:auto;width:100%"></textarea>
              <!--<h-input v-model="draftInfoForm.draftContent" readonly type="textarea" :rows="10"></h-input>-->
            </h-form-item>
            <h-form-item label="报文时间" prop="creDtTm">
              <label>{{draftInfoForm.creDtTm}}</label>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closeForm">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 票面 -->
    <bill-info-main @billInfoWinClose="billInfoWinClose" :showBillInfoWin="showBillInfoWin" :billId="this.billId"  :billNo="this.billNo"  :billRangeStart="this.billRangeStart" :billRangeEnd="this.billRangeEnd"></bill-info-main>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap, formatBillRange } from "@/api/bizApi/commonUtil";

  export default {
    name: "msgLogMain",
    data() {
      return {
          showBillInfoWin: false,
          billId: "",
          billNo: "",
        formItem: {
          draftNo: "",
          draftDate: "",
          billNoLike: "",
          dealNo: "",
          busiNo: "",
          sendRcvFlag: "",
          dealFlag: "",
          orgnlDraftNo:"",
          orgnlMsgId:"",
          msgId:"",
          minBillRangeStart:"",
          maxBillRangeEnd:""
        },
        authObj: {
          showInfoBtn: true
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        draftInfoForm: {
          draftContent: "",
          creDtTm: ""
        },
        columns: [

          {
            title: " ",
            type: "radio",
            hiddenCol: false,
            width: 60,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 60,
            hiddenCol: false
          },

          {
            title: this.$t("m.i.common.id"),
            key: "id",
            hiddenCol: true,
            align: "center"
          },
          {
            title: this.$t('m.i.billInfo.billPackageNo'),
            key: "billNo",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let billNo = "";
              if (params.row.billNo === null || params.row.billNo === "") {
                billNo = "";
              }else {
                billNo = params.row.billNo;
              }
              return h("a", {
                on: {
                  click: () => {
                    this.showBillInfo(params.row);
                  }
                }
              }, billNo);
            }
          },
          {
            title: this.$t("m.i.billInfo.billRange"),
            align: 'center',
            key: "billRange",
            hiddenCol: false,
            render: (h, params) => {
              let billOrigin = params.row.billOrigin;
              let billRangeStart = params.row.billRangeStart;
              let billRangeEnd = params.row.billRangeEnd;
              return h("span", formatBillRange(billOrigin, billRangeStart, billRangeEnd))
            }
          },
          {
            title: "业务单编号",
            key: "busiNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.be.dealNo"),
            key: "dealNo",
            align: "center",
            hiddenCol: false
          },

          {
            title: this.$t("m.i.shcpe.sendRcvFlag"),
            key: "sendRcvFlag",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "DraftDirection", params.row.sendRcvFlag);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.draftNo"),
            key: "draftNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t('m.i.common.originalDraftNo'),
            key: "orgnlDraftNo",
            hiddenCol: false,
            align: "center"
          },
          {
            title: "发起会员名称",
            key: "aplMemberName",
            align: "center",
            hiddenCol: false
          },
          {
            title: "接收会员名称",
            key: "rcvMemberName",
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.msgId"),
            key: "msgId",
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.originalMsgId"),
            key: "orgnlMsgId",
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.draftDealResult'),
            key: "dealFlag",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              if(params.row.dealFlag==='0') return h('span','初始化')
              else if(params.row.dealFlag==='1') return h('span','成功')
              else if(params.row.dealFlag==='2') return h('span','处理中')
              else if(params.row.dealFlag==='3') return h('span','失败')
              else if(params.row.dealFlag==='4') return h('span','延迟处理')
            }
          },
          {
            title: "报文时间",
            key: "createDtTm",
            align: "center",
            hiddenCol: false,
            render: (h, params) => {
              if (null != params.row.createDtTm && "" !== params.row.createDtTm) {
                let dttm = this.$moment(params.row.createDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                return h("span", dttm);
              }
            }
          },
        ],

        currentSelectRow: null,
        dictMap: [],
        sendRcvFlagList: [],
        draftStatusList:[],
        draftInfoWin: false,
        moveUpDisabled: false,
        moveDownDisabled: false,
        ifShowMore: false,
        tableRef: "selfTable"
      };
    },
    watch: {},

    computed: {},
    mounted() {
      getDictListByGroups("DraftDirection,CpesDraftStatusCode").then(res => {
        this.sendRcvFlagList = res.get("DraftDirection");
        this.draftStatusList =res.get("CpesDraftStatusCode");
        this.dictMap = res.get("map");
      });
      this.getCurDate();
    },
    methods: {
      handleDraftDateChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minTransDate = arr[0].replace(/-/g, "");
          this.formItem.maxTransDate = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minTransDate ="";
          this.formItem.maxTransDate ="";
        }
      },
      handleSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      unDisabled() {
        this.moveUpDisabled = false;
        this.moveDownDisabled = false;
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minBillRangeStart = null;
        this.formItem.maxBillRangeEnd = null;
        this.getCurDate();
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = currentRow;
      },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
        this.currentSelectRow = null;
      },
      billInfoWinClose(){
          this.showBillInfoWin = false;
      },
      showBillInfo(row){
        this.billNo = row.billNo;
        this.billId = row.billId;
        this.billRangeStart = row.billRangeStart;
        this.billRangeEnd = row.billRangeEnd;
        this.showBillInfoWin = true;
      },
      showInfo() {
        if (!this.currentSelectRow) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.draftInfoWin = true;
        post({ id: this.currentSelectRow.id }, "/shcpe/cpes/draft/check/msgLogMain/func_detailMessageInfo").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                document.getElementById("cpesDraftContentId").innerHTML = retData == null ? "" : retData.draftContent;
                this.draftInfoForm.creDtTm = this.$moment(retData.creDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              });
            } else {
              this.$msgTip.error(this, { info: msg });
              this.$refs.datagrid.dataChange(1);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      closeForm() {
        this.draftInfoForm.draftContent = "";
        this.draftInfoForm.creDtTm = "";
        this.currentSelectRow = null;
        this.draftInfoWin = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
      },
      getCurDate() {
        post({}, "/shcpe/cpes/draft/msgSendAgain/func_getCurDate").then(res => {
          if (res) {
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formItem.draftDate = [retData, retData];
            }
          }
        });
      }
    },
  };
</script>

<style scoped>

</style>
