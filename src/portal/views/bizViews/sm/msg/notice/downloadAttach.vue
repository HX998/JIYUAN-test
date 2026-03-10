<template>
  <!--票交机构弹出框-->
  <h-msg-box v-model="tempDownloadAttachWin" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
             class="h-form-search-layer" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>

    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      :url="datagridUrl"
      :onCurrentChange="handleCurrentChange"
      :onCurrentChangeCancel="handleCurrentChangeCancel"
      :autoLoad="false"
      ref="datagrid">
    </h-datagrid>
    <!-- 弹出框模式底部按钮 -->
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="download">{{$t('m.i.common.download')}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "downloadAttach",
    data() {
      return {
        columns : [
          {
            type: "radio",
            title:" ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.fileName'),
            key: "fileName",
            hiddenCol: false
          }

        ],
        datagridUrl : "/sm/msg/noticeattach/getNoticeAttachByNoticeId",
        ifShowMore : false,
        currentSelectRow : [],
        currentSelectList : [],
        currentSelectRowInx : [],
        tableRef : "selfTable",
      }
    },
    props: {
      downloadAttachWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "下载附件"
      },
      id:{
        type: "",
      },
    },
    comments: {},
    watch: {
      downloadAttachWin(val) {
        if (val === true) {
          this.datagridUrl = "sm/msg/noticeattach/func_getNoticeAttachByNoticeId?id="+this.id;
          this.$nextTick(()=>{
            this.$refs.datagrid.dataChange(1);
          })

        }
      },
    },

    computed: {
      tempDownloadAttachWin: {
        get() {
          return this.downloadAttachWin;
        },
        set() {
        }
      },
    },
    methods: {

      download(){

        let row = this.currentSelectRow;
        if(row != null && row.length !== 0){
          let url=window.LOCAL_CONFIG.API_HOME + "/sm/msg/noticeattach/func_downLoadNoticeAttach?id="+row.id;
          let form = document.createElement('form');
          form.setAttribute("id","formId");
          form.setAttribute('action',url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        }else{
          this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
        }


      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      handleClose() {
        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$emit("downloadAttachClose", "");
      }
    }
  };
</script>

<style scoped>

</style>
