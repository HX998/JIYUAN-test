<template>
  <div>
    <h-msg-box v-model="showAttachment" width="1000" :mask-closable="false" @on-close="handleClose" top="10"
               class="h-form-search-layer" :maximize="true">
      <p slot="header">
        <span>{{ $t("m.i.auth.showAttach") }}</span>
      </p>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        :bindForm="attachParams.attachFormItem"
        hasPage
        :url=datagridUrl
        :onCurrentChange="onCurrentChange"
        :onCurrentChangeCancel="onCurrentChangeCancel"
        :autoLoad="false"
        ref="datagrid">
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";
  export default {
    name: "showAttach",
    data() {
      return {
        datagridUrl: "",
        showImgWin: false,
        imgUrl: "",
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.fileName"),
            key: "fileName",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let fileName = params.row.fileName + params.row.fileSuffix;
              return h("span", {}, fileName);
            }
          },
          {
            title: this.$t("m.i.auth.tellerName"),
            key: "uploadUserName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.auth.uploadDt"),
            key: "operDt",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.download"),
            key: "attachId",
            render: (h, params) => {
              let download = "下载";
              return h("a", {
                on: {
                  click: () => {
                    this.handleDownload(params.row.id, params.row.fileName);
                  }
                }
              }, download);
            }
          },
          {
            title: this.$t("m.i.common.delete"),
            key: "attachId",
            render: (h, params) => {
              let attachDelete = "删除";
              return h("a", {
                on: {
                  click: () => {
                    this.attachDelete(params.row.id);
                  }
                }
              }, attachDelete);
            }
          }
        ]
      };
    },
    props: {
      showAttachWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      attachParams: {
        queryUrl: "",
        downloadUrl: "",
        attachFormItem: {},
      }
    },
    watch: {
      showAttachWin(val) {
        if (val === true) {
          this.datagridUrl = this.attachParams.queryUrl;
          this.$nextTick(() => {
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      showAttachment: {
        get() {
          return this.showAttachWin;
        },
        set() {
        }
      }
    },
    methods: {
      onCurrentChange(currentRow, oldCurrentRow, _index) {
        this.selectData = currentRow;
      },
      onCurrentChangeCancel() {
        this.selectData = null;
      },
      handleClose() {
        this.$emit("attachWinClose", "");
      },
      //附件下载
      handleDownload(id, fileName) {
        let url = window.LOCAL_CONFIG.API_HOME + this.attachParams.downloadUrl;
        //表单提交
        let form = document.createElement("form");
        form.setAttribute("id", "formId");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");

        let input1 = document.createElement("input");
        input1.type = "text";
        input1.name = "id";
        input1.value = id;
        let input2 = document.createElement("input");
        input2.type = "text";
        input2.name = "fileName";
        input2.value = fileName;
        form.appendChild(input1);
        form.appendChild(input2);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      },
      //附件删除
      attachDelete(id) {
        debugger;
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: "确定删除附件吗",
          onOk: () => {
            debugger;
            post({id: id }, "/bm/audit/auditTaskSubmit/func_attachDelete").then(res => {
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.$refs.datagrid.dataChange(1);
                } else {
                  this.$msgTip.error(this, { info: msg });
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
