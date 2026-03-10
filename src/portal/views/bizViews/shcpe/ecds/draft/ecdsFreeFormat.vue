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
                  <h-form-item prop="draftDate" :label="$t('m.i.shcpe.draftDate')">
                    <h-date-picker :value="formItem.draftDtRang" type="daterange" showFormat :editable=false
                                   @on-change="handleDueDtChange" placeholder=""></h-date-picker>
                  </h-form-item>
                  <h-form-item prop="draftDir" :label="$t('m.i.shcpe.draftDir')">
                    <h-select v-model="formItem.draftDir" placeholder="">
                      <h-option v-for="item in ecdsDraftSendRecvMarkCodeList" :value="item.key" :key="item.key">{{
                        item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>

                  <h-form-item prop="draftSender" :label="$t('m.i.shcpe.senderName')"  v-if="formItem.draftDir !== '1'">
                    <h-input v-model="formItem.draftSender" placeholder=""></h-input>
                  </h-form-item>

                  <h-form-item prop="brdcstLvl" :label="$t('m.i.shcpe.brdcstLvl')">
                    <h-select v-model="formItem.brdcstLevel" placeholder="">
                      <h-option v-for="item in broadcastTypeCodeList" :value="item.key" :key="item.key">{{ item.value
                        }}
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
            url="/ecds/draft/ecdsFreeFormat/func_pageQueryEcdsDraftLog"
            :bindForm="formItem"
            :onCurrentChange="onCurrentChange"
            :onCurrentChangeCancel="onCurrentChangeCancle"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="addFreeDraft()">{{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @on-click="showInfo()">{{$t("m.i.common.showDetail")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>


    <!--点击新增弹出窗-->
    <h-msg-box v-model="addFreeDraftWin" width="1000" class="h-form-table-layer" :maximize="true" :mask-closable="false"
               @on-close="addFreeDraftWinClose">
      <p slot="header">
        <span>自由格式报文</span>
      </p>
      <h-form :model="addFreeDraftForm" :label-width="120" ref="addFreeDraftForm" cols="1" class="h-form-search">

        <h-form-item :label="$t('m.i.shcpe.brdcstLvl')" prop="brdcstLvl" required>
          <h-select v-model="addFreeDraftForm.brdcstLvl" @on-change="brdcstLvlChange" placeholder="">
            <h-option v-for="item in broadcastTypeCodeList" :value="item.key" :key="item.key">{{ item.value }}
            </h-option>
          </h-select>
        </h-form-item>

        <h-form-item :label="$t('m.i.shcpe.sndrAcctSvcr')" prop="sndrAcctSvcr" required>
          <h-input v-model="addFreeDraftForm.sndrAcctSvcr" :maxlength=60 readonly></h-input>
        </h-form-item>

        <h-form-item :label="$t('m.i.shcpe.sndrAcctSvcrNm')" prop="sndrAcctSvcrNm">
          <h-input v-model="addFreeDraftForm.sndrAcctSvcrNm" :maxlength=66 readonly></h-input>
        </h-form-item>

        <h-form-item :label="$t('m.i.shcpe.rcvrAcctSvcr')" prop="rcvrAcctSvcr" v-if="addFreeDraftForm.brdcstLvl==='BC00'"
                     :required="addFreeDraftForm.brdcstLvl==='BC00'">
          <h-input v-model="addFreeDraftForm.rcvrAcctSvcr" :maxlength=66 icon="android-search"
                   @on-click="queryBankData"></h-input>
        </h-form-item>

        <h-form-item :label="$t('m.i.shcpe.rcvrCCPC')" prop="rcvrCCPC" v-show="false">
          <h-input v-model="addFreeDraftForm.rcvrCCPC" :maxlength=66></h-input>
        </h-form-item>

        <h-form-item :label="$t('m.i.shcpe.rcvrMeetCode')" prop="rcvrMeetCode" v-if="addFreeDraftForm.brdcstLvl==='BC02'"
                     :required="addFreeDraftForm.brdcstLvl==='BC02'">
          <h-input v-model="addFreeDraftForm.rcvrMeetCode" :maxlength=66 icon="android-search"
                   @on-click="queryRcvrMeetCode"></h-input>
        </h-form-item>

        <h-form-item :label="$t('m.i.shcpe.contant')" prop="cnts" class="h-form-height-auto" required>
          <h-input v-model="addFreeDraftForm.cnts" type="textarea" :autosize="{minRows: 20,maxRows: 40}"></h-input>
        </h-form-item>

      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="addFreeDraftWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm()">{{$t("m.i.common.confirm")}}</h-button>

      </div>
    </h-msg-box>


    <h-msg-box v-model="draftInfoWin" width="1000"  :mask-closable="false" :maximize="true"
               @on-close="closeForm">
      <p slot="header">
        <span>报文详情</span>
      </p>
      <h-panel>
        <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item :label="$t('m.i.shcpe.draftContent')" prop="draftContent" class="h-form-height-auto">
              <!--<h-input v-model="draftInfoForm.draftContent" readonly type="textarea" :rows="10"></h-input>-->
              <textarea id="ecdsFreeDraftContentId" readonly rows="10"
                        style="overflow-y:auto;overflow-x:auto;width: 100%"></textarea>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer"></div>
    </h-msg-box>

    <!---->
    <h-msg-box v-model="tempShowApDataSelectWin" width="800" @on-close="apDataSelectClose" class="h-form-table-layer"
               :maximize="true">
      <p slot="header">
        <span>选择接入点号</span>
      </p>
      <h-form :model="apFormItem" :label-width="90" ref="apFormItem" cols="4" class="h-form-search">
        <h-form-item prop="meetCode" :label="$t('m.i.shcpe.meetCode')">
          <h-input v-model="apFormItem.meetCode"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate one-form">
          <h-button type="primary" @click="apDataHandleSearch">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="apDataResetSearch">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
      <h-datagrid
        :columns="apColumns"
        highlight-row
        :autoLoad=true
        url="/ecds/draft/ecdsFreeFormat/func_pageQueryEcdsApData"
        :bindForm="apFormItem"
        :onCurrentChange="aphandleSelectClick"
        :onCurrentChangeCancel="aphandleSelectCancel"
        ref="apDatagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="apDataSelectClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="apDataSelectSubmit">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>



    <h-msg-box v-model="tempShowBankDataSelectWin" width="1000" @on-close="bankDataSelectClose" class="h-form-table-layer"
               :maximize="true">
      <p slot="header">
        <span>选择接入行号</span>
      </p>
      <h-form :model="bankFormItem" :label-width="90" ref="bankFormItem" cols="4" class="h-form-search">
        <h-form-item prop="bankNo" :label="$t('m.i.common.bankNo')">
          <h-input v-model="bankFormItem.bankNo" placeholder=""></h-input>
        </h-form-item>
        <h-form-item prop="actorFullCall" :label="$t('m.i.shcpe.actorFullCall')">
          <h-input v-model="bankFormItem.actorFullCall" placeholder=""></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate two-form">
          <h-button type="primary" @click="bankDataHandleSearch">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="bankDataResetSearch">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
      <h-datagrid
        :columns="bankColumns"
        highlight-row
        :autoLoad=true
        url="/ecds/draft/ecdsFreeFormat/func_pageQueryEcdsBankData"
        :bindForm="bankFormItem"
        :onCurrentChange="bankhandleSelectClick"
        :onCurrentChangeCancel="bankhandleSelectCancel"
        ref="bankDatagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="bankDataSelectClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="bankDataSelectSubmit">{{$t("m.i.common.commit")}}</h-button>

      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off, getDictValueFromMap, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "ecdsFreeFormat",
    data() {
      return {
        formItem: {
          draftNo: "039",
          draftDtRang: "",
          minDraftDt: "",
          maxDraftDt: "",
          draftDir: "",
          draftSender: "",
          brdcstLevel: ""
        },
        columns: [
            {
                title:' ',
                type: "radio",
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
            title: this.$t('m.i.shcpe.brdcstLvl'),
            key: "brdcstLevel",
            hiddenCol: false,
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "BroadcastTypeCode", params.row.brdcstLevel);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },

          {
            title: this.$t('m.i.shcpe.draftDt'),
            key: "draftDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let draftDt = params.row.draftDt == null ? "" : this.$moment(params.row.draftDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", draftDt);
            }
          },

          {
            title: this.$t('m.i.shcpe.senderName'),
            key: "draftSender",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.draftSendBankNo'),
            key: "draftSenderBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.receiverName'),
            key: "draftReceiver",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.draftRecvBankNo'),
            key: "draftReceiverBankNo",
            sortable: true,
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.draftDir'),
            key: "draftDir",
            hiddenCol: false,

            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "EcdsDraftSendRecvMarkCode", params.row.draftDir);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        dueDt: [],
        dictMap: new Map(),
        broadcastTypeCodeList: [],
        ecdsDraftSendRecvMarkCodeList: [],
        draftInfoWin: false,
        draftInfoForm: {
          draftContent: ""
        },

        ifShowMore: false,
        addFreeDraftWin: false,
        submitFlag: false,

        addFreeDraftForm: {
          brdcstLvl: "",
          cnts: "",
          sndrAcctSvcr: this.$store.getters.userInfo.bankNo,
          sndrAcctSvcrNm: this.$store.getters.userInfo.brchName,
          rcvrAcctSvcr: "",
          rcvrCCPC: "",
          rcvrMeetCode: ""
        },
        currentSelectRow: null,
       // currentSelectList: [],
      //  currentSelectRowInx: [],


        //接收接入点号界面
        tempShowApDataSelectWin: false,
        apCurrentSelectList: [],
        apFormItem: {
          meetCode: ""
        },
        apColumns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.shcpe.meetCode"),
            key: "meetCode",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.shcpe.meetName"),
            key: "meetName",
            hiddenCol: false
          }
        ],
        //接收接入行号界面
        tempShowBankDataSelectWin: false,
        bankCurrentSelectList: [],
        bankFormItem: {
          meetCode:"",
          actorFullCall: ""
        },
        bankColumns: [
          {
            type: "radio",
            title: " ",
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
            title: "接入行号",
            key: "bankNo",
            hiddenCol: false
          },
          {
            title: "接入行名",
            key: "actorFullCall",
            hiddenCol: false
          }
        ]
      };
    },
    watch: {
      "$route": "getParams"
    },
    mounted() {
      getDictListByGroups("BroadcastTypeCode,EcdsDraftSendRecvMarkCode").then(res => {
        this.broadcastTypeCodeList = res.get("BroadcastTypeCode");
        this.ecdsDraftSendRecvMarkCodeList = res.get("EcdsDraftSendRecvMarkCode");
        this.dictMap = res.get("map");
      });
      this.getParams();
    },
    methods: {
      handleDueDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.minDraftDt = arr[0].replace(/-/g, "");
          this.formItem.maxDraftDt = arr[1].replace(/-/g, "");
          this.formItem.draftDtRang = [arr[0], arr[1]];
        } else {
          this.formItem.minDraftDt = "";
          this.formItem.maxDraftDt = "";
          this.formItem.draftDtRang = [];
        }
      },

      handleSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.formItem.minDraftDt = "";
        this.formItem.maxDraftDt = "";
        this.formItem.draftDtRang = [];
        this.formItem.brdcstLevel = "";
      },
      onCurrentChange(currentRow, oldCurrentRow, _index) {
            this.currentSelectRow = currentRow;
        },
      onCurrentChangeCancle(currentRow, oldCurrentRow, _index) {
            this.currentSelectRow = null;
        },

     /* handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
      },*/
      showInfo() {
        if (this.currentSelectRow === null) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.draftInfoWin = true;
        post({ regLogId: this.currentSelectRow.id }, "/ecds/draft/ecdsFreeFormat/func_getDraftLogContent").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retData = res.data.retData;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$nextTick(() => {
                // this.draftInfoForm.draftContent = retData.draftContent;
                let content;
                if(retData == null || retData.draftContent == null || retData.draftContent.length < 1){
                  content="";
                }else{
                  let begin = retData.draftContent.indexOf("<Cnts>");
                  let end = retData.draftContent.indexOf("</Cnts>");
                  content = begin+6 >= end ? "" : retData.draftContent.substring(begin+6,end);
                }
                document.getElementById("ecdsFreeDraftContentId").innerHTML = content;
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
        this.draftInfoWin = false;
      },

      addFreeDraft() {
        this.addFreeDraftWin = true;
      },

      addFreeDraftWinClose() {
        this.$refs.addFreeDraftForm.resetFields();
        this.addFreeDraftWin = false;
      },

      // 新增页面提交
      submitForm() {
        this.$refs["addFreeDraftForm"].validate(valid => {
          if (valid) {
            let url = "/ecds/draft/ecdsFreeFormat/func_sendFreeFormat";
            this.submitFlag = true;
            post(this.addFreeDraftForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.$refs.gridPage.currentPage);
                  this.currentSelectRow = null;
                  this.addFreeDraftWinClose();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },

      //接入点子页面
      apDataHandleSearch() {
        this.$refs.apDatagrid.dataChange(1);
      },
      apDataResetSearch() {
        this.$refs.apFormItem.resetFields();
      },
      aphandleSelectClick(arr) {
        this.apCurrentSelectList = arr;
      },
      aphandleSelectCancel() {
        this.apCurrentSelectList = [];
      },
      queryRcvrMeetCode() {
        this.tempShowApDataSelectWin = true;
        this.apDataHandleSearch();
      },
      apDataSelectSubmit() {
        if (this.apCurrentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.apCurrentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.addFreeDraftForm.rcvrMeetCode = this.apCurrentSelectList.meetCode;
        this.apDataSelectClose();
      },
      apDataSelectClose() {
        this.apCurrentSelectList = [];
        this.$refs.apFormItem.resetFields();
        this.tempShowApDataSelectWin = false;
      },


      //行信息子页面
      bankDataHandleSearch() {
        this.$refs.bankDatagrid.dataChange(1);
      },
      bankDataResetSearch() {
        this.$refs.bankFormItem.resetFields();
      },
      bankhandleSelectClick(arr) {
        this.bankCurrentSelectList = arr;
      },
      bankhandleSelectCancel() {
        this.bankCurrentSelectList = [];
      },
      queryBankData() {
        this.tempShowBankDataSelectWin = true;
        this.bankDataHandleSearch();
      },
      bankDataSelectSubmit() {
        if (this.bankCurrentSelectList.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.bankCurrentSelectList.length > 1) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
          return;
        }
        this.addFreeDraftForm.rcvrAcctSvcr = this.bankCurrentSelectList.bankNo;
        this.bankDataSelectClose();
      },
      bankDataSelectClose() {
        this.tempShowBankDataSelectWin = false;
        this.bankCurrentSelectList = [];
        this.$refs.bankFormItem.resetFields();
      },
      getParams(){
        if (this.$route.path === "/shcpe/ecds/draft/ecdsFreeFormat") {
          if (this.$route.query.draftDtRang) {
            let draftDtRang = this.$moment(this.$route.query.draftDtRang, "YYYY-MM-DD").format("YYYY-MM-DD");
            this.formItem.draftDtRang = [draftDtRang, draftDtRang];
            this.formItem.draftDir = this.$route.query.draftDir;
            this.$nextTick(() => {
              this.handleSearch();
            });
          }
        }
      },
      brdcstLvlChange(currentValue) {
        this.addFreeDraftForm.rcvrAcctSvcr = "";
        this.addFreeDraftForm.rcvrMeetCode = "";
      }
    },
  };
</script>

<style scoped>

</style>
