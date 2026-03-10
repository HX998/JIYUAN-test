<!--企业客户-->
<template>
  <h-msg-box v-model="tempshowCustCorpWin" :maximize="true" :mask-closable="false" @on-close="handleClose"
               width="1000" class="h-form-table-layer" :z-index=1202 @on-maximize="onMaximize">
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--弹出框内容-->
      <div :class="{'h-form-overhd':!ifShowMore}">
        <!--数据展示表格-->
        <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search"
                v-if="showMainGroupCustNo==''">
          <h-form-item :label="$t('m.i.common.custPartnerType')" prop="transStartPartnerType" class="h-form-long-label"
                       v-if="showMainGroupCustNo=='' && isMainGroupCustNo == ''">
            <h-select :value="'RC01'" readonly placeholder="">
              <h-option value="RC01" key="RC01">企业</h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custNo')" prop="custNo" v-if="showMainGroupCustNo==''">
            <h-input v-model="formItem.custNo" :maxlength=50></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.custName')" prop="custName" v-if="showMainGroupCustNo==''">
            <h-input v-model="formItem.custName" :maxlength=60></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.orgCode')" prop="orgCode" v-if="showMainGroupCustNo=='' && isMainGroupCustNo == ''">
            <h-input v-model="formItem.orgCode" :maxlength=10></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.isGroupCus')" prop="isGroupCus"
                       v-if="showMainGroupCustNo=='' && isMainGroupCustNo == ''">
            <h-select v-model="formItem.isGroupCus" placeholder="">
              <h-option v-for="item in isList" :value="item.value" :key="item.value">{{ item.label }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate">
            <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>
      </div>
          <h-datagrid
              :columns="showColumns"
              highlight-row
              getDataFunc
              @get-data="getCustCorpList"
              :gridData="custCorpData"
              :bindForm="formItem"
              :onCurrentChange="handleCurrentChange"
              :onCurrentChangeCancel="handleCurrentChangeCancel"
              :onRowDbClick="doubleHandleClick"
              ref="datagrid">
          </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
        <h-button v-if="showMainGroupCustNo!=null && showMainGroupCustNo != ''" type="primary" @click="submitForm">
          {{$t("m.i.bm.relieve")}}
        </h-button>
        <h-button v-else type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
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
          title: " ",
          type: "radio",
          align: "center",
          width: 50
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
        // {
        //   title: this.$t('m.i.common.loanCtrctNo'),
        //   key: "loanCtrctNo",
        //   width: 300,
        //
        //   hiddenCol: false,
        //   sortable: true
        // },
        {
          title: this.$t('m.i.bm.transStartPartnerType'),
          key: "transStartPartnerType",
          hiddenCol: true,
          sortable: true,
          render: (h, params) => {
            let list = this.getDictValueFromMap(this.dictMap, "partnerType", params.row.transStartPartnerType);
            return h("span",
              {
                domProps: {
                  title: list
                }
              }, list);
          }
        }
      ];
      let formItem = {
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
      };
      return {
        layerifShowMore: false,
        expandDisabled: false,
        showLoading: true,
        showColumns: columns,
        formItem: formItem,
        custCorpData: { rows: [], pageInfo: { count: 0 } },
        submitWin: false,
        submitMsg: "",
        submitTitle: "",
        retMsg: "",
        // 该集团总部下，是否所有集团关系都已解除
        isRemoveAll: "",
        ifShowMore:false,
        isList: [
          { value: "1", label: "是" },
          { value: "0", label: "否" }
        ]
      };
    },
    props: {
      title: String,
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
      showMainGroupCustNo: {
        default() {
          return "";
        }
      },
      isMainGroupCustNo: {
        default() {
          return "";
        }
      },
      ifcheck: {
        default() {
          return false;
        }
      }
    },
    watch: {
      showCustCorpWin(val) {
        if (val == true) {
          this.formSearchReset();
          this.formItem.custNo = this.selectCustNo;
          this.formItem.mainGroupCustNo = this.showMainGroupCustNo;
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
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("custSelect", this.currentSelectRow);
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
        this.formItem.pageNo = this.$refs.datagrid.pageInfo.pageNo;
        this.formItem.pageSize = this.$refs.datagrid.pageInfo.pageSize;
        if(this.selectCustNo){
          this.formItem.custNo= this.selectCustNo;
        }
        this.formItem.mainGroupCustNo= this.showMainGroupCustNo;
        this.formItem.isMainGroupCus= this.isMainGroupCustNo;
        let json = this.formItem;
        let url = "/bm/cust/corp/pageQueryCustCorpList";
        if (this.showMainGroupCustNo != null && this.showMainGroupCustNo != "") {
          url = "/bm/cust/corp/showCustCorp/func_pageQueryCustCorpByMainCustNo";
        }
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
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = null;
      },
      submitForm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (this.showMainGroupCustNo != null && this.showMainGroupCustNo != "") {
            this.breakGroupConfirm();
          } else {
            // 选择客户
            this.$emit("custSelect", this.currentSelectRow);
            this.custAcctData = { rows: [], total: 1 };
            this.currentSelectRow = null;
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      handleClose() {
        this.$emit("showCustCorpWinClose", this.isRemoveAll);
        this.$refs.datagrid.$refs.gridPage.clearElevator();
        if (this.showMainGroupCustNo == "") {
          this.formSearchReset();
        }
      },
      // 解除集团关系
      breakGroupConfirm() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          if (this.currentSelectRow.isMainGroupCus == "1") {
            this.$hMsgBox.confirm({
              title: this.$t("m.i.common.confirm"),
              content: "检测到该客户为集团总部。若解除集团关系，则总部下所有集团的集团关系都会解除。是否要解除？",
              zIndex: 1300,
              onOk: () => {
                this.isRemoveAll = "1";
                this.breakGroup();
              }
            });
          } else {
            this.breakGroup();
          }
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      breakGroup() {
        post({
          isGroupCus: "0",
          id: this.currentSelectRow.id
        }, "/bm/cust/corp/showCustCorp/func_breakGroupCustCorp").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode == "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = null;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              if (this.isRemoveAll == "1") {
                this.isRemoveAll == "";
              }
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            if (this.isRemoveAll == "1") {
              this.isRemoveAll == "";
            }
          }
        });
      },
      formSearch() {
        this.currentSelectRow = null;
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleClear() {
        let obj = {
          "id": "",
          "custNo": "",
          "custName": "",
          "corpScale": "",
          "isGreenCorp": "",
          "isGroupCus": ""
        };
        // 清空客户选择信息
        this.$emit("custSelect", obj);
        this.custAcctData = { rows: [], total: 1 };
        this.currentSelectRow = null;
      }

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
