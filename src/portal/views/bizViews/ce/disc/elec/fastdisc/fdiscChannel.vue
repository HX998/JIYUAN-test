<!--极速贴现-对接渠道管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="channelNo" :label="$t('m.i.ce.channelNo')">
                  <h-input v-model="formItem.channelNo" :maxlength=30></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.channelName')" prop="channelName">
                  <h-input v-model="formItem.channelName" :maxlength=60></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.ce.channelStatus')" prop="status">
                  <h-select v-model="formItem.status" showTitle>
                    <h-option v-for="item in onOffSwicthList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
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
            url="/ce/disc/elec/fastdisc/fdiscChannel/func_queryFDiscChannelList"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="modify()">{{$t("m.i.common.modify")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!-- 对接渠道修改页面 -->
    <h-msg-box v-model="addOrEditWin" width="800" @on-close="addOrEditWinClose" class="h-form-search-layer"
               :maximize="true" :mask-closable="false">
      <p slot="header">
        <span>修改对接渠道</span>
      </p>
      <div>
        <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
          <h-form-item prop="channelNo" :label="$t('m.i.ce.channelNo')" required>
            <h-input v-model="addOrEditForm.channelNo" readonly></h-input>
          </h-form-item>
          <h-form-item prop="channelName" :label="$t('m.i.ce.channelName')" required>
            <h-input v-model="addOrEditForm.channelName" readonly></h-input>
          </h-form-item>
          <h-form-item prop="channelCooperationMode" :label="$t('m.i.ce.channelCooperationMode')" required>
            <h-select v-model="addOrEditForm.channelCooperationMode" readonly>
              <h-option v-for="item in channelCoopModeList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="orderCancelTerm" :label="$t('m.i.ce.orderCancelTerm')" required :validRules="termRule">
            <h-input v-model="addOrEditForm.orderCancelTerm" type="int"></h-input>
          </h-form-item>
          <h-form-item prop="isAllowOtherChannel" :label="$t('m.i.ce.isAllowOtherChannel')" required class="h-form-long-label">
            <h-select v-model="addOrEditForm.isAllowOtherChannel" placeholder="">
              <h-option value="0" key="0">否</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="status" :label="$t('m.i.ce.channelStatus')" required>
            <h-select v-model="addOrEditForm.status" placeholder="">
              <h-option v-for="item in onOffSwicthList" :value="item.key" :key="item.key">{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item prop="remark" :label="$t('m.i.common.remark')">
            <h-input v-model="addOrEditForm.remark" type="textarea" :canResize="false" :rows="3"></h-input>
          </h-form-item>
        </h-form>
      </div>
      <div slot="footer">
        <div slot="footer">
          <h-button type="ghost" @click="addOrEditWinClose">{{$t("m.i.common.close")}}</h-button>
          <h-button type="primary" @click="addOrEditWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
        </div>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post} from "@/api/bizApi/commonUtil";

  export default {
    name: "fdiscChannel",
    components: {
    },
    data() {
      return {
        formItem : {
          channelNo : "",
          channelName : "",
          status : ""
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.ce.channelNo"),
            key: "channelNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.channelName"),
            key: "channelName",
            hiddenCol: false,
            sortable: false
          },
          {
            title: this.$t("m.i.ce.channelCooperationMode"),
            key: "channelCooperationMode",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "ChannelCoopMode", params.row.channelCooperationMode);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.orderCancelTerm"),
            key: "orderCancelTerm",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.ce.isAllowOtherChannel"),
            key: "isAllowOtherChannel",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "Yon", params.row.isAllowOtherChannel);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.channelStatus"),
            key: "channelStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dictValue = this.getDictValueFromMap(this.dictMap, "OnOffSwicth", params.row.status);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          }
        ],
        channelCoopModeList : [],
        yonList : [],
        onOffSwicthList : [],
        dictMap : new Map(),
        currentSelectRow : [],
        termRule: [{ test: /^(0|[1-9]\d*)$/, trigger: "blur", message: "期限必须为自然数" }],
        //是否显示更多查询项
        ifShowMore : false,
        //修改对接渠道弹出框
        addOrEditWin : false,
        addOrEditForm : {
          id: "",
          channelNo: "",
          channelName: "",
          channelCooperationMode: "",
          orderCancelTerm: "",
          isAllowOtherChannel: "",
          status: "",
          remark: ""
        }
      };
    },
    mounted() {
      this.getDictListByGroups("ChannelCoopMode,Yon,OnOffSwicth").then(res => {
        this.channelCoopModeList = res.get("ChannelCoopMode");
        this.yonList = res.get("Yon");
        this.onOffSwicthList = res.get("OnOffSwicth");
        this.dictMap = res.get("map");
      });
    },
    methods: {
      //表单查询
      handleSearch() {
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
        this.currentSelectRow = [];
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      //修改
      modify() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        let id = this.currentSelectRow.id;
        post({ id: id }, "/ce/disc/elec/fastdisc/fdiscChannel/func_queryFDiscChannelById").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.addOrEditWin = true;
              this.$nextTick(() => {
                this.addOrEditForm.id = id;
                this.addOrEditForm.channelNo = res.data.retData.channelNo;
                this.addOrEditForm.channelName = res.data.retData.channelName;
                this.addOrEditForm.channelCooperationMode = res.data.retData.channelCooperationMode;
                this.addOrEditForm.orderCancelTerm = res.data.retData.orderCancelTerm;
                this.addOrEditForm.isAllowOtherChannel = res.data.retData.isAllowOtherChannel;
                this.addOrEditForm.status = res.data.retData.status;
                this.addOrEditForm.remark = res.data.retData.remark;
              });
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //关闭
      addOrEditWinClose() {
        this.addOrEditWin = false;
      },
      //提交
      addOrEditWinSubmit() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = "/ce/disc/elec/fastdisc/fdiscChannel/func_updateFDiscChannel";
            let pageNo = this.$refs.datagrid.pageInfo.pageNo;
            post(this.addOrEditForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.currentSelectRow = [];
                  this.$refs.datagrid.dataChange(pageNo);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>
