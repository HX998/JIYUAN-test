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
                <h-form-item :label="$t('m.i.common.busiType')" prop="busiType">
                  <h-select v-model="formItem.busiType" placeholder="">
                    <h-option value="1">承兑</h-option>
                    <h-option value="2">贴现</h-option>
                    <h-option value="3">其他</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.applyAcctNo')" prop="applyAcctNo" >
                  <h-input v-model="formItem.applyAcctNo" placeholder="" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.billInfo.transCtrctNo')" prop="contractNo" >
                  <h-input v-model="formItem.contractNo" placeholder="" ></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.pe.contractName')" prop="contractName" >
                  <h-input v-model="formItem.contractName" placeholder="" ></h-input>
                </h-form-item>

                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
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
                      url="/sm/BusMsg/func_getEbankAttachInfo"
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class='pull-left'></div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <show-ebank-attach :showAttachWin="showAttachWin" @attachWinClose="attachWinClose"
                       :attachParams="attachParams"></show-ebank-attach>>
  </div>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";
  import ShowEbankAttach from "../../../../components/bemp/showEbankAttach";

  export default {
    name: "onlineTransQuery",
    components: {
      ShowEbankAttach

    },
    data(){
      return {
        formItem : {
          applyAcctNo:"",
          busiType:"",
          contractNo:"",
          contractName:"",
        },
        columns : [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.busiType"),
            key: "busiType",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              if(params.row.busiType==='1') return h('span','承兑')
              else if(params.row.busiType==='2') return h('span','贴现')
              else if(params.row.busiType==='3') return h('span','其他')
            }
          },
          {
            title: this.$t('m.i.pe.applyAcctNo'),
            key: "applyAcctNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.billInfo.transCtrctNo'),
            key: "contractNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.pe.contractName'),
            key: "contractName",
            hiddenCol: false,
            sortable: true
          },
          {
            title:this.$t("m.i.auth.showAttach"),
            key: "showAttachUrl",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let showAttachUrl = "查看附件";
              return h("a", {
                on: {
                  click: () => {
                    this.showAttachDeal(params.row.id);
                  }
                }
              }, showAttachUrl);
            }
          },
          {
            title: this.$t('m.i.common.remark'),
            key: "remark",
            hiddenCol: false,
            sortable: true,
          }
        ],
        currentSelectRow:[],
        dictMap : new Map(),
        ifShowMore: false,
        showAttachWin: false,
        attachParams: {
          queryUrl: "",
          downloadUrl: "",
          attachFormItem: {
            id: ""
          },
        }
      }
    },
    created(){
      this.formItem.transDt = window.sessionStorage.getItem("workDate");
    },
    mounted() {
      this.getDictListByGroups("outSystem,serviceMode").then(res => {
        this.dictMap = res.get("map");
      });
    },
    methods :{
      //查看附件
      showAttachDeal(id) {
        this.id = id;
        this.attachParams.queryUrl = "/sm/BusMsg/func_getEbankAttachInfoByTm";
        this.attachParams.downloadUrl = "/sm/BusMsg/func_attachDownload";
        this.attachParams.attachFormItem.id = id;
        this.showAttachWin = true;
      },

      //查看附件窗口关闭
      attachWinClose() {
        this.showAttachWin = false;
        this.id = "";
        this.attachParams.queryUrl = "";
        this.attachParams.downloadUrl = "";
        this.attachParams.attachFormItem.id = "";
      },

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
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
    }

  };
</script>

<style scoped>

</style>
