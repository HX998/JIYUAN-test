<!--公告查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.transDt')" prop="transDt">
                  <h-date-picker :value="formItem.transDt" type="date" :editable=false :showFormat=true placeholder="" @on-change="handleDateChange" ></h-date-picker>
                </h-form-item>
                <h-form-item  :label="$t('m.i.msg.outSystem')" prop="outSystem">
                  <h-select v-model="formItem.outSystem" placeholder="">
                    <h-option v-for="item in outSystemList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.msg.serviceModel')" prop="serviceModel">
                  <h-select v-model="formItem.serviceMode" placeholder="">
                    <h-option v-for="item in serviceModeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.msg.serviceNo')"  prop="serviceNo">
                  <h-input v-model="formItem.serviceNo"></h-input>
                </h-form-item>
                <h-form-item prop="status" :label="$t('m.i.msg.transResult')">
                  <h-select v-model="formItem.status" placeholder="">
                    <h-option v-for="item in statusCodeList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.msg.msgRemark')"  prop="msgContent">
                  <h-input v-model="formItem.msgContent"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
            </h-form>
          </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/sm/BusMsg/func_getOnlineTransQueryDetailInfo"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class='pull-left'></div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box v-model="draftInfoWin" width="1000"  :mask-closable="false" :maximize="true"
               @on-close="closeForm">
      <p slot="header">
        <span>消息详情</span>
      </p>
      <h-panel>
        <h-form :model="draftInfoForm" :label-width="115" ref="draftInfoForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item label="消息内容" prop="msgContent" class="h-form-height-auto">
              <textarea id="msgContentId" readonly rows="20"
                    style="overflow-y:auto;overflow-x:auto;width:100%"></textarea>
            </h-form-item>
          </div>
        </h-form>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="closeForm">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "onlineTransQuery",
    components: {

    },
    data(){
      return {
        formItem : {
          transDt:window.sessionStorage.getItem("workDate"),
          outSystem:"",
          serviceMode:"",
          msgContent:"",
          serviceNo:"",
          trDir:"",
          status:"",
        },
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.transDt"),
            type: "transDt",
            align: "center",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transDt == null || params.row.transDt === "") {
                return "";
              }
              let date = this.$moment(params.row.transDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.msg.outSystem'),
            key: "outSystem",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "outSystem", params.row.outSystem);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            },
          },
          {
            title: this.$t('m.i.msg.serviceModel'),
            key: "serviceMode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "serviceMode", params.row.serviceMode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            },
          },
          {
            title: this.$t('m.i.msg.reqFlowNo'),
            key: "flowNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.msg.resFlowNo'),
            key: "respFlowNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.msg.serviceNo'),
            key: "serviceNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.pc.beginGmt'),
            key: "transStartDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transStartDt == null || params.row.transStartDt === "") {
                return "";
              }
              let date = this.$moment(params.row.transStartDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.pc.endGmt'),
            key: "transEndDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if (params.row.transEndDt == null || params.row.transEndDt === "") {
                return "";
              }
              let date = this.$moment(params.row.transEndDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.pc.tellerNo'),
            key: "operTellerNo",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.shcpe.reqMsgId'),
            key: "reqMsgId",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.shcpe.respMsgId'),
            key: "respMsgId",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.msg.retCode'),
            key: "retCode",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.msg.retMsg'),
            key: "retMsg",
            sortable: true,
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.msg.msgRemark'),
            key: "msgContent",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              let vochPrint = "消息详情";
              return h("a", {
                on: {
                  click: () => {
                    this.showMsgContent(params.row.msgContent);
                  }
                }
              }, vochPrint);
            }
          }
        ],
        currentSelectRow:[],
        dictMap : new Map(),
        outSystemList:[],
        serviceModeList:[],
        trDirList: [],
        statusCodeList: [],
        ifShowMore: false,
        draftInfoWin: false,
        draftInfoForm: {
          msgContent: ""
        },
      }
    },
    created(){
      this.formItem.transDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.getDictListByGroups("outSystem,serviceMode,TrDir,StatusCode").then(res => {
        this.outSystemList = res.get("outSystem");
        this.serviceModeList = res.get("serviceMode");
        this.trDirList = res.get("TrDir");
        this.statusCodeList = res.get("StatusCode");
        this.dictMap = res.get("map");
      });
    },
    methods :{
     handleDateChange(value) {
        this.formItem.transDt = value.replace(/-/g, "");
      },

      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },

      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
        this.currentSelectList=[];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.outSystem="";
        this.formItem.serviceMode="";
        this.formItem.msgContent="";
        this.formItem.serviceNo="";
        this.formItem.trDir="";
        this.formItem.status="";
      },
      showMsgContent(msgContent){
        this.draftInfoWin = true;
        this.$nextTick(() => {
          document.getElementById("msgContentId").innerHTML = msgContent;
        });
      },
      closeForm() {
        this.draftInfoForm.msgContent = "";
        this.draftInfoWin = false;
      },
    }

  };
</script>

<style scoped>

</style>
