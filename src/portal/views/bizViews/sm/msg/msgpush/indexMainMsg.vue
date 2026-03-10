<template>
  <h-msg-box v-model="tempMsgWin" width="1000px" :mask-closable="false" @on-close="handleClose" @on-maximize="onMaximize"
             class="h-form-table-layer" :z-index=1200 :maximize="true" :transfer="true" :scrollable="false">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--查询表单-->
    <div class="h-form-search-box" :class="{'h-form-overhd':!ifShowMore}">
        <h-form :model="formItem" :label-width="70" ref="formItem" cols="4" class="h-form-search">
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
          <h-form-item :label="$t('m.i.common.receiveTime')" prop="createDt">
            <h-date-picker :value="createDt" type="daterange" autoPlacement showFormat :editable=false
                           @on-change="handlecreateDtChange" placeholder="" ></h-date-picker>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
    </div>

    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                highlight-row
                :height=300
                :url="datagridUrl"
                :bindForm="formItem"
                :hasSelect="false" rowSelect
                ref="datagrid">
      <div slot="toolbar" class="pull-left">
        <h-button type="primary" @click="setAllMsgReaded()">{{$t("m.i.msg.setAllMsgReaded")}}</h-button>
        <h-button type="primary" @click="setMsgReaded()">{{$t("m.i.msg.setMsgReaded")}}</h-button>
      </div>
    </h-datagrid>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexMainMsg",
    data() {
      return {
        createDt: [],
        // 是否显示新增或修改窗口
        formItem: {
          pushMethod: "1",
          busiType: "",
          flag: "",
          startDt: "",
          endDt: ""
        },
        dictMap: new Map(),
        ifShowMore: false,
        columns: [
          {
            type: "selection",
            width: 60,
            hiddenCol: false,
            align: "center"
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
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
        busiTypeList: [],
        datagridUrl: "/sm/msg/msgpush/msgPushRecordQuery/func_messageUnConsume"
      };
    },
    props: {
      msgBoxWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "查询未读消息"
      }
    },
    watch: {
      msgBoxWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            // this.getDictListByGroups("PushBusiType,PushMethod,PushType").then(res => {
            //   this.busiTypeList = res.get("PushBusiType");
            //   this.pushMethodList = res.get("PushMethod");
            //   this.dictMap = res.get("map");
            // });
            this.$refs.formItem.resetFields();
            this.formSearch();
          });
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      handleClose() {
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.$emit("msgBoxWinClose", "");
      },
      handlecreateDtChange(arr) {
        if (arr&&arr.length==2){
          this.formItem.startDt = arr[0].replace(/-/g, "");
          this.formItem.endDt = arr[1].replace(/-/g, "");
        } else {
          this.formItem.startDt = "";
          this.formItem.endDt = "";
        }
      },
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
        this.formItem.startDt = "";
        this.formItem.endDt = "";
        this.createDt = [];
      },
      setAllMsgReaded() {
        post({}, "/sm/msg/msgpush/msgPushRecordQuery/func_setAllMsgReaded").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formSearch();
              this.$emit("msgBoxChange");
            } else {
              // 公共报错信息
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      setMsgReaded() {
        let select = this.$refs.datagrid.selects;
        if (select.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let ids = this.$refs.datagrid.selectIds.join(",");
        post({ ids: ids }, "/sm/msg/msgpush/msgPushRecordQuery/func_updateFlag").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.formSearch();
              this.$emit("msgBoxChange");
            } else {
              // 公共报错信息
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      }
    },
    computed: {
      tempMsgWin: {
        get() {
          return this.msgBoxWin;
        },
        set() {
        }
      }
    },
    mounted() {
      this.getDictListByGroups("PushBusiType,PushMethod,PushType").then(res => {
        this.busiTypeList = res.get("PushBusiType");
        this.pushMethodList = res.get("PushMethod");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
