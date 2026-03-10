<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!-- 查询表单 -->
          <div class="h-form-search-box">
            <h-panel class="h-form-search-box clearfix">
              <h-form ref="formItem" :model="formItem" :label-width="90" class="h-form-search" cols="4">
                <common-input v-model="formItem.meetIncomeCode" :label="$t('s.i.odps.meetIncomeCode')" prop="meetIncomeCode"></common-input>
                <query-btn :formSearch="handleSearch" :formSearchReset="resetSearch" :advanceShow='false'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid
            :columns="columns"
            :highlightRow="true"
            url="/sm/odps/basedata/odpsBusiAuthData/func_queryBusiAuthList"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <h-msg-box v-model="sendAuthWin" class="h-form-search" :maximize="true" @on-close="closeSendAuthWinForm">
      <p slot="header">
        <span>查看接入点发起业务权限信息</span>
      </p>
      <div>
        <h-form :model="sendAuthForm" :label-width="115" ref="sendAuthForm" cols="1" class="h-form-search">
          <div class="h-search-form-row">
            <h-form-item :label="$t('s.i.odps.meetIncomeCode')" prop="meetIncomeCode" class="h-form-height-auto">
              <div v-html="sendAuthForm.meetIncomeCode"></div>
            </h-form-item>
          </div>
          <h-row class="message-box">
            <h-col span="24" class="message-item">
              <label><span>*</span>{{$t('s.i.odps.sendAuthList')}}</label>
              <div class="message-list" v-html="sendAuthForm.sendAuthList"></div>
            </h-col>
          </h-row>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="sendAuthWin=!sendAuthWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

    <h-msg-box v-model="rcvAuthWin" class="h-form-search" :maximize="true" @on-close="closeRcvAuthWinForm">
      <p slot="header">
        <span>查看接入点接收业务权限信息</span>
      </p>
      <div>
        <h-form :model="rcvAuthForm" :label-width="115" ref="rcvAuthForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('s.i.odps.meetIncomeCode')" prop="meetIncomeCode" class="h-form-height-auto">
            <div v-html="rcvAuthForm.meetIncomeCode"></div>
          </h-form-item>
          <h-row class="message-box">
            <h-col span="24" class="message-item">
              <label><span>*</span>{{$t('s.i.odps.rcvAuthList')}}</label>
              <div class="message-list" v-html="rcvAuthForm.rcvAuthList"></div>
            </h-col>
          </h-row>
        </h-form>
      </div>
      <div slot="footer">
        <h-button type="ghost" @click="rcvAuthWin=!rcvAuthWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>

  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "odpsBusiAuthData",
    data() {
      return {
        formItem: {
          meetIncomeCode: ""
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('s.i.odps.meetIncomeCode'),
            key: "meetIncomeCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('s.i.odps.sendAuthNum'),
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showSendAuth(params.row.meetIncomeCode,params.row.sendAuthList);
                    }
                  }
                }, params.row.sendAuthNum)
              ]);
            }
          },
          {
            title: this.$t('s.i.odps.rcvAuthNum'),
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("a", {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showRcvAuth(params.row.meetIncomeCode,params.row.rcvAuthList);
                    }
                  }
                }, params.row.rcvAuthNum)
              ]);
            }
          }
        ],
        sendAuthWin: false,
        sendAuthForm: {
          meetIncomeCode:"",
          sendAuthList: ""
        },
        rcvAuthWin: false,
        rcvAuthForm: {
          meetIncomeCode:"",
          rcvAuthList: ""
        }
      }
    },
    methods: {
      handleSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },

      showSendAuth(meetIncomeCode,sendAuthList) {
        this.sendAuthForm.meetIncomeCode = meetIncomeCode;
        this.sendAuthForm.sendAuthList = sendAuthList;
        this.sendAuthWin = true;
      },

      closeSendAuthWinForm() {
        this.sendAuthWin = false;
        this.sendAuthForm.meetIncomeCode = "";
        this.sendAuthForm.sendAuthList = "";
      },

      showRcvAuth(meetIncomeCode,rcvAuthList) {
        this.rcvAuthForm.meetIncomeCode = meetIncomeCode;
        this.rcvAuthForm.rcvAuthList = rcvAuthList;
        this.rcvAuthWin = true;
      },

      closeRcvAuthWinForm() {
        this.rcvAuthWin = false;
        this.rcvAuthForm.meetIncomeCode = "";
        this.rcvAuthForm.rcvAuthList = "";
      }

    }
  };
</script>

<style scoped>

</style>
