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
                  <h-form-item prop="sendRcvFlag" label="报文方向">
                    <h-select v-model="formItem.sendRcvFlag" placeholder="">
                      <h-option v-for="item in sendRcvFlagList" :value="item.key" :key="item.value">{{ item.value }}
                      </h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item prop="draftNo" label="报文编号">
                    <h-input v-model="formItem.draftNo" placeholder="" :maxlength="6"></h-input>
                  </h-form-item>
                  <h-form-item prop="msgId" :label="$t('m.i.common.msgId')">
                    <h-input v-model="formItem.msgId" placeholder="" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item prop="compareDt" label="对账日期">
                    <h-date-picker v-model="formItem.compareDt" format="yyyy-MM-dd" type="date" placeholder=""
                                   showFormat :editable=false></h-date-picker>
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
            url="/shcpe/cpes/draft/check/indexDraftCheckInfo/func_queryDraftCheckInfo"
            :bindForm="formItem"
            :onRowClick="handlelRowClick"
            :onSelectChange="handleSelectClick"
            :row-select="true"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @on-click="send()">{{$t("m.i.shcpe.launch")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups, getDictValueFromMap } from "@/api/bizApi/commonUtil";

  export default {
    name: "indexDraftCheckInfo",
    data() {
      return {
        formItem: {
          sendRcvFlag: "",
          draftNo: "",
          msgId: "",
          compareDt: ""
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        columns: [
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            align: "center",
            width: 60,
            hiddenCol: false
          },
          {
            type: "selection",
            hiddenCol: false,
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.shcpe.compareDt"),
            key: "compareDt",
            hiddenCol: false,
            align: "center",
            render: (h, params) => {

              return h("span", params.row.compareDt ? this.$moment(params.row.compareDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "");

            }
          },
          {
            title: this.$t("m.i.shcpe.defectFlag"),
            key: "defectFlag",
            align: "center",
            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CpesDraftCheck", params.row.defectFlag);
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
            align: "center"
          },
          {
            title: this.$t("m.i.shcpe.sendRcvFlag"),
            key: "sendRcvFlag",
            align: "center",
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
            title: this.$t("m.i.common.msgId"),
            key: "msgId",
            align: "center"

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
          {
            title: this.$t("m.i.shcpe.checkStatus"),
            key: "checkStatus",
            align: "center",

            render: (h, params) => {
              let list = getDictValueFromMap(this.dictMap, "CpesDraftCheckStatus", params.row.checkStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: "处理结果",
            key: "checkRemark",
            align: "center"

          }
        ],

        currentSelectRow: [],
        currentSelectRowInx: [],
        dictMap: new Map(),
        sendRcvFlagList: [],
        moveUpDisabled: false,
        moveDownDisabled: false,
        ifShowMore: false
      };
    },
    watch: {},

    computed: {},
    mounted() {
      getDictListByGroups("DraftDirection,CpesDraftCheckStatus,CpesDraftCheck").then(res => {
        this.sendRcvFlagList = res.get("DraftDirection");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      handleSearch() {
        let date = this.formItem.compareDt.replace(/-/g, "");
        this.formItem.compareDt = date;
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      handlelRowClick(arr) {
        this.currentSelectRow = arr;
      },
      handleSelectClick(arr, selectInx) {
        this.currentSelectRow = arr;
        this.currentSelectRowInx = selectInx;
      },
      send() {
        if (this.currentSelectRow.length == 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        } else {
          post({ ids: this.$refs.datagrid.selectIds }, "/shcpe/cpes/draft/check/indexDraftCheckInfo/func_draftCheckInfoAplSvr").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.$msgTip.success(this, { info: this.$t("m.i.common.actionSuccess") });
                this.$refs.datagrid.dataChange(1);
                this.currentSelectRow = [];
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$hMessage.error(this.$t("m.i.common.netError"));
            }
          });
        }
      }

    }
  };
</script>

<style scoped>

</style>
