<!--消息查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.msg.pushMethod')" prop="pushMethod">
                  <h-select v-model="formItem.pushMethod" placeholder="">
                    <h-option v-for="item in pushMethodList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option v-for="item in busiTypeList" :value="item.key" :key="item.key">{{item.value}}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.msg.flag')" prop="flag">
                  <h-select v-model="formItem.flag" placeholder="">
                    <h-option value="0">未读</h-option>
                    <h-option value="1">已读</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.receiveTime')" prop="createDt">
                  <h-date-picker :value="createDt" type="daterange" showFormat :editable=false
                                 @on-change="handlecreateDtChange" placeholder=""></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t("m.i.common.searchAdvanced")}}<i
                    class="icon iconfont"
                    :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/sm/msg/msgpush/msgPushRecordQuery/func_messageHist"
                      :bindForm="formItem"
                      ref="datagrid">
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "msgPushRecordQuery",
    data() {
      return {
        createDt: [],
        // 是否显示新增或修改窗口
        formItem: {
          pushMethod: "",
          busiType: "",
          flag: "",
          startDt: "",
          endDt: ""
        },
        dictMap: new Map(),
        ifShowMore: false,
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.be.busiFlowNo"),
            key: "busiFlowNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "PushBusiType", params.row.busiType);
              if (list===params.row.busiType) {
                list=this.getDictValueFromMap(this.dictMap, "PushTTBusiType", params.row.busiType);
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
            title: this.$t("m.i.msg.msgRemark"),
            key: "msgRemark",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.msg.pushMethod"),
            key: "pushMethod",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "PushMethod", params.row.pushMethod);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.msg.flag"),
            key: "flag",
            hiddenCol: false,
            render: (h, params) => {
              if (params.row.flag === "0") {
                return h("span", "未读");
              } else {
                return h("span", "已读");
              }
            }
          },
          {
            title: this.$t("m.i.common.createTime"),
            key: "createTime",
            hiddenCol: false,
            render: (h, params) => {
              let date = params.row.createTime == null ? "" :this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", date);
            }
          }
        ],
        pushMethodList: [],
        busiTypeList: []
      };
    },
    methods: {
      handlecreateDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.startDt = arr[0].replace(/-/g, "");
          this.formItem.endDt = arr[1].replace(/-/g, "");
        } else {
          this.formItem.startDt = "";
          this.formItem.endDt = "";
        }
      },

      unDisabled() {
        this.deletDisabled = false;
      },
      formSearch() {
        this.unDisabled();
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.startDt = "";
        this.formItem.endDt = "";
        this.createDt = [];
      },
      getParams(){
        if (this.$route.path === "/sm/msg/msgpush/msgPushRecordQuery") {
          if (this.$route.query.flag) {
            this.formItem.flag = this.$route.query.flag;
            this.$nextTick(() => {
              this.formSearch();
            });
          }
        }
      },
    },
    mounted() {
      this.getDictListByGroups("PushBusiType,PushMethod,PushType,PushTTBusiType").then(res => {
        let result=[];
        if (res.get("PushBusiType") instanceof Array) {
          result=result.concat(res.get("PushBusiType"));
        }
        if (res.get("PushTTBusiType") instanceof Array) {
          result=result.concat(res.get("PushTTBusiType"));
        }
        this.busiTypeList=result; //合并定时和实时的业务类型
        this.pushMethodList = res.get("PushMethod");
        this.dictMap = res.get("map");
      });
      this.getParams();
    },
    watch: {
      "$route": "getParams"
    }
  };
</script>

<style scoped>

</style>
