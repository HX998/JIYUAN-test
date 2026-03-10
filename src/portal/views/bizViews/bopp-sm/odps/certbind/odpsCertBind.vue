<!--证书绑定-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <common-input v-model="formItem.meetIncomeCode" :label="$t('s.i.odps.meetIncomeCode')" prop="meetIncomeCode"></common-input>
                <common-select v-model="formItem.certType" :dictList="this.certTypeList" :label="$t('s.i.odps.certType')" prop="certType"></common-select>
                <query-btn :formSearch="formSearch" :formSearchReset="formSearchReset" :advanceShow='false'></query-btn>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/sm/odps/certbind/odpsCertBind/func_pageQueryCertBindData"
            :bindForm="formItem"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleCertBind()">{{$t("s.i.odps.certiBind")}}</h-button>
              <h-button type="primary" @click="handleRevokeBind()">{{$t("s.i.odps.cancelBind")}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击绑定证书弹出窗-->
    <h-msg-box v-model="editWin" width="500" :mask-closable="false" @on-close="handleWinClose" class="h-form-search" :maximize="true">
      <p slot="header">
        <span>数字证书信息</span>
      </p>
      <h-form :model="certBindForm" :label-width="80" ref="certBindForm" cols="1">
        <div class="h-search-form-row">
          <common-select v-model="certBindForm.certType" :dictList="this.certTypeList"
                         :label="$t('s.i.odps.certType')" prop="certType"
                         v-if="this.certBindForm.changeType === 'AB00'"></common-select>
          <common-input v-model="certBindForm.certNo" :label="$t('s.i.odps.certNo')" prop="certNo"
                        :lengthByByte="false" :maxlength="2"
                        v-if="this.certBindForm.changeType === 'AB00'"></common-input>
          <common-input type="textarea" v-model="certBindForm.postscipt" :label="$t('s.i.odps.postscipt')"
                        prop="postscipt"
                        :lengthByByte="false" :maxlength="60"></common-input>
        </div>
      </h-form>
      <div slot="footer">
        <h-button type="ghost" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>
<script>
import {post} from "@/api/bizApi/commonUtil";

export default {
  name: "odpsCertBind",
  data() {
    return {
      formItem: {
        meetIncomeCode: "",
        certType: ""
      },
      certBindForm: {
        changeType: "",
        certType: "",
          certNo: "",
          postscipt: ""
        },
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("s.i.odps.meetIncomeCode"),
            key: "meetIncomeCode",
            hiddenCol: false,
            ellipsis: false
          },
          {
            title: this.$t("s.i.odps.changeType"),
            key: "changeType",
            hiddenCol: false,
            render: (h, params) => {
              let changeType = this.getDictValueFromMap(this.dictMap, "OdpsCertBindChangeType", params.row.changeType);
              return h("span",
                {
                  domProps: {
                    title: changeType
                  }
                }, changeType);
            }
          },
          {
            title: this.$t('s.i.odps.changeTime'),
            key: "createTime",
            hiddenCol: false,
            width: 150,
            render: (h, params) => {
              if (null != params.row.createTime && "" !== params.row.createTime) {
                let createTime = this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss:SSS").format("YYYY-MM-DD HH:mm:ss");
                return h("span", createTime);
              }
            }
          },
          {
            title: this.$t("s.i.odps.certType"),
            key: "certType",
            hiddenCol: false,
            render: (h, params) => {
              let certType = this.getDictValueFromMap(this.dictMap, "OdpsCertType", params.row.certType);
              return h("span",
                {
                  domProps: {
                    title: certType
                  }
                }, certType);
            }
          },
          {
            title: this.$t("s.i.odps.certNo"),
            key: "certNo",
            hiddenCol: false
          },
          {
            title: this.$t("s.i.odps.postscipt"),
            key: "postscipt",
            hiddenCol: false,
          },
          {
            title: this.$t("s.i.odps.certBindStatus"),
            key: "certBindStatus",
            hiddenCol: false,
            render: (h, params) => {
              let certBindStatus = this.getDictValueFromMap(this.dictMap, "OdpsCertBindStsCode", params.row.certBindStatus);
              return h("span",
                {
                  domProps: {
                    title: certBindStatus
                  }
                }, certBindStatus);
            }
          },
          {
            title: this.$t("s.i.odps.processStatus"),
            key: "processStatus",
            hiddenCol: false,
            render: (h, params) => {
              let processStatus = this.formatProcessStatus(params.row.processStatus);
              return h("span",
                {
                  domProps: {
                    title: processStatus
                  }
                }, processStatus);
            }
          },
          {
            title: this.$t("s.i.odps.dealPrcMsg"),
            key: "dealPrcMsg",
            hiddenCol: false,
          }
        ],
        dictMap: new Map(),
        certTypeList: [],
        editWin: false,
        ifShowMore: false,
      };
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //证书绑定
      handleCertBind() {
        this.certBindForm.changeType = "AB00"
        this.editWin = true;
      },
      //撤销绑定
      handleRevokeBind() {
        this.certBindForm.changeType = "AB01"
        this.editWin = true;
      },
      submitForm() {
        this.$refs["certBindForm"].validate(valid => {
          if (valid) {
            let url = "/sm/odps/certbind/odpsCertBind/func_certBindOrUnBind";
            let msg = this.$t("s.i.odps.modifySuccess");
            post(this.certBindForm, url).then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode == "000000") {
                  this.$msgTip.success(this, { info: msg });
                  this.handleWinClose();
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      handleWinClose() {
        this.editWin = false;
        this.$refs.certBindForm.resetFields();
      },
      formatProcessStatus(value) {
        if (value == null || value == "") {
          return "";
        }
        switch (value) {
          case "0":
            return "处理失败";
          case "1":
            return "处理成功";
          case "2":
            return "处理中";
        }
      }
    },
    mounted() {
      this.getDictListByGroups("OdpsCertBindStsCode,OdpsCertBindChangeType,OdpsCertType").then(res => {
        this.certTypeList = res.get("OdpsCertType");
        this.dictMap = res.get("map");
      });
    }
  };
</script>
