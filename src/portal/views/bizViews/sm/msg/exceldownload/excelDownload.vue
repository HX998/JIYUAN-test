<!--Excel下载-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.fileName')" prop="fileName">
                  <h-input v-model="formItem.fileName"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.operDt')" prop="operDt">
                  <h-date-picker v-model="formItem.operDt" type="date" placeholder="" format="yyyy-MM-dd" showFormat></h-date-picker>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/pc/report/excel/queryExcelRegistPage"
            :bindForm="formItem"
            :hasSelect="hasSelect" rowSelect
            ref="datagrid">
            <div slot="toolbar" class='pull-left'>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "excelDownload",
    data() {
      return {
        formItem : {
          fileName: '',
          operDt: ''
        },
        type : "",
        optType : "",
        dictMap : new Map(),
        tableRef:"selfTable",
        ifShowMore :false,
        currentSelectList : [],
        currentSelectRowInx : [],
        columns : [
          {
            type: "selection",
            width: 50,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: 'index',
            width:60,
            align: 'center'
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: "legalNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            ellipsis:false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.applTellerNo"),
            key: "applTellerNo",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.fileNo'),
            key: "fileNo",
            ellipsis:false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.fileName'),
            key: "fileName",
            ellipsis:false,
            hiddenCol:false,
            sortable: true
          },{
            title: this.$t('m.i.common.fileSuffix'),
            key: "fileSuffix",
            ellipsis:false,
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.filePath'),
            key: "filePath",
            ellipsis:false,
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.operDt"),
            key: "operDt",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let date = params.row.operDt == null ? "" : this.$moment(params.row.operDt, "YYYY-MM-DD").format("YYYY-MM-DD");
              return h("span", date);
            }
          },
          {
            title: this.$t('m.i.common.operTm'),
            key: "operTime",
            ellipsis:false,
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t("m.i.msg.num"),
            ellipsis:false,
            key: "num",
            hiddenCol:false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.download'),
            ellipsis:false,
            hiddenCol: false,
            render: (h, params) => {
              return h('a', {
                on: {
                  click: () => {
                    this.downloadExcel(params.row.id);
                  }
                }
              }, "下载");
            }
          }
        ],
        hasSelect: false,
      }
    },
    components: {

    },
    methods:{
      /**
       * 列表搜索
       * */
      formSearch() {
        this.formItem.operDt = this.formItem.operDt.replace(/-/g, "")
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.dataChange(1);
      },
      /**
       * 查询区域重置
       * */
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      downloadExcel(id) {
        this.$hMsgBox.confirm({
          title: "下载确认",
          content: "确定要下载吗？",
          onOk: () => {
            let url = window.LOCAL_CONFIG.API_HOME + "/pc/report/excel/downloadExcel";
            let form = document.createElement('form');
            form.setAttribute("id","formId");
            form.setAttribute('action',url);
            form.setAttribute("method", "get");
            let input=document.createElement('input');
            input.setAttribute("name", "id");
            input.setAttribute("value",id);
            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
        });
      },
      unDisabled() {
        this.deletDisabled = false;
      }
    },
    mounted() {
      this.getDictListByGroups("DraftTypeCode").then(res => {
        this.billTypeList = res.get("DraftTypeCode");
        this.dictMap = res.get("map");
      });
    }

  }
</script>

<style scoped>

</style>
