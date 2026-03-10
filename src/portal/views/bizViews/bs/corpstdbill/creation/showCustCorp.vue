<!--企业客户-->
<template>
  <h-msg-box v-model="tempshowCustCorpWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-table-layer" :z-index=1202 @on-maximize="onMaximize">
      <p slot="header">
        <span>新增原始持票人</span>
      </p>
      <!--弹出框内容-->
      <div>
        <!--数据展示表格-->
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
          <common-input v-model="formItem.custNo" :label="$t('m.i.common.custNo')" prop="custNo"></common-input>
          <common-input v-model="formItem.custName" :label="$t('m.i.common.custName')" prop="custName"></common-input>
          <!--        <org-code v-model="formItem.orgCode"></org-code>-->
          <common-select v-model="formItem.isGroupCus" :dictList="isList" :label="$t('m.i.common.isGroupCus')"
                         prop="isGroupCus"></common-select>
          <query-btn @showChange="showChange" :formSearch="handleSearch"
                     :formSearchReset="formSearchReset"></query-btn>
<!--          <h-form-item :label="$t('m.i.common.custPartnerType')" prop="transStartPartnerType" class="h-form-long-label">-->
<!--            <h-select :value="'RC01'" readonly placeholder="">-->
<!--              <h-option value="RC01" key="RC01">企业</h-option>-->
<!--            </h-select>-->
<!--          </h-form-item>-->
<!--          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo">-->
<!--            <h-input v-model="formItem.custNo" :maxlength=50></h-input>-->
<!--          </h-form-item>-->
<!--          <h-form-item :label="$t('m.i.common.custName')" prop="custName">-->
<!--            <h-input v-model="formItem.custName" :maxlength=60></h-input>-->
<!--          </h-form-item>-->
<!--          <h-form-item :label="$t('m.i.common.orgCode')" prop="orgCode">-->
<!--            <h-input v-model="formItem.orgCode" :maxlength=60></h-input>-->
<!--          </h-form-item>-->
<!--          <h-form-item :label="$t('m.i.common.isGroupCus')" prop="isGroupCus">-->
<!--            <h-select v-model="formItem.isGroupCus" placeholder="">-->
<!--              <h-option v-for="item in isList" :value="item.value" :key="item.value">{{ item.label }}</h-option>-->
<!--            </h-select>-->
<!--          </h-form-item>-->
<!--          <h-form-item class="h-form-operate">-->
<!--            <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>-->
<!--            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>-->
<!--          </h-form-item>-->
        </h-form>
      </div>
          <h-datagrid
              :columns="showColumns"
              highlight-row
              getDataFunc
              @get-data="getCustCorpList"
              :gridData="custCorpData"
              :bindForm="formItem"
              :auto-load="false"
              rowSelect
              :hasSelect="false"
              ref="datagrid">
          </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "showCustCorp",
    data() {
      let columns = [
        {
          type: "selection",
          width: 50,
          hiddenCol: false,
          align: "center"
        },
        {
          title: this.$t("m.i.common.index"),
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t('m.i.common.custNo'),
          key: "custNo",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.custName'),
          key: "custName",

          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.orgCode'),
          key: "orgCode",
          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.custPartnerType'),
          key: "custPartnerType",
          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            return h("span","企业");
          }
        }
      ];
      return {
        layerifShowMore: false,
        expandDisabled: false,
        showLoading: true,
        showColumns: columns,
        formItem: {
          custNo: "",
          custName: "",
          transStartPartnerType: "RC01",
          orgCode: "",
          isGroupCus: "",
          activeFlag: "1",
          mainGroupCustNo: "",
          isMainGroupCus: "",
          pageNo: 1,
          pageSize: 10
        },
        custCorpData: { rows: [], pageInfo: { count: 0 } },
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        // 该集团总部下，是否所有集团关系都已解除
        isRemoveAll: "",
        isList: [
          { value: "1", label: "是" },
          { value: "0", label: "否" }
        ]
      };
    },
    props: {
      title: "企业客户信息",
      showCustCorpWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      ifClearBtn: {
        type: Boolean,
        default() {
          return false;
        }
      },
      selectCustNo: String,
      isMainGroupCustNo: {
        default() {
          return "";
        }
      },
      ifcheck: {
        default() {
          return false;
        }
      },
      extParam: {
        default() {
          return null;
        }
      }
    },
    watch: {
      showCustCorpWin(val) {
        if (val == true) {
          if(this.extParam){
            this.formItem = this.extParam;
            if(!this.extParam.transStartPartnerType){
              this.formItem.transStartPartnerType = "RC01";
            }
            if(!this.extParam.activeFlag){
              this.formItem.activeFlag = "1";
            }
          }
          this.formItem.custNo = this.selectCustNo;
          this.formItem.isMainGroupCus = this.isMainGroupCustNo;
          // this.getCustCorpList();
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },

    computed: {
      tempshowCustCorpWin: {
        get() {
          return this.showCustCorpWin;
        },
        set() {
        }
      }
    },
    methods: {
      showChange(val) {
        this.ifShowMore = val;
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      getCustCorpList() {
        if (!this.showCustCorpWin) {
          return;
        }
        let json = {
          custNo: this.selectCustNo,
          isMainGroupCus: this.isMainGroupCustNo
        };

        this.formItem.pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.formItem.pageSize = this.$refs.datagrid.pageInfo.pageSize;
        json = this.formItem;
        let url = "/bm/cust/corp/pageQueryCustCorpList";
        post(json, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode == "000000") {
                this.custCorpData = res.data.retData;
              } else {
                // 查询失败
                // this.submitMsg = "查询失败";
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          }
        );
      },
      submitForm() {
        let list = this.$refs.datagrid.selectIds;
        if (list && list.length > 0) {
          this.$refs.datagrid.selects = [];
          this.$refs.datagrid.selectIds = [];
          this.$emit("showCustCorpWinSubmit", list);
          this.$refs.datagrid.$refs.gridPage.clearElevator();
          this.formSearchReset();
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      handleClose() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$emit("showCustCorpWinClose", this.isRemoveAll);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        this.formSearchReset();
      },
      handleSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
    },
    mounted() {
      this.getDictListByGroups("CorpScale").then(res => {
        this.corpScaleList = res.get("CorpScale");
        this.dictMap = res.get("map");
      });
    },
  };
</script>
<style>

</style>
