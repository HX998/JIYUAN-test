<!--日志管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
               <h-form-item :label="$t('m.i.oper.logPath')" prop="logPath" >
                 <h-select v-model="formItem.logPath" placeholder=" " widthAdaption>
                    <h-option v-for="item in pathList" :value="item" :key="item">{{ item }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.fileName')" prop="likeName">
                    <h-input v-model="formItem.likeName"  :maxlength="100"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
            </h-form>
          </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/sm/oper/logfile/logMain/func_queryLogFile"
                      :hasPage=false
                      :bindForm="formItem"
                      :onCurrentChange="handleCurrentChange"
                      :onCurrentChangeCancel="handleCurrentChangeCancel"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="downLogFile()">{{$t('m.i.common.download')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

  </div>
</template>

<script>
  import {post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "logMain",
    data() {
      return {
        ifShowMore : false,
        formItem : {
          logPath : '',
          likeName:'',
        },
        columns : [
          {
            type: "radio",
            title: " ",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.common.fileName'),
            key: "fileName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.updateTime"),
            key: "updateTime",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.fileSize"),
            key: "fileSize",
            hiddenCol: false,
            render: (h, params) => {
              let v = Math.round(params.row.fileSize/(1024));
              v = v+"K ("+params.row.fileSize+"字节)";
              return h('span', v);
            },
            sortable: true
          }
        ],
        isList : [],
        currentSelectRow:[],
        isRequired:true,
        pathList: [],
      }
    },

    created () {
      this.loadPathData();
    },
    methods :{

    loadPathData(){
          let url = "/sm/oper/logfile/logMain/func_queryLogFolder";
          post({}, url).then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                      this.pathList= res.data.retData;
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
      },

     // 下载
      downLogFile(){
          let row = this.currentSelectRow;
          if(row == null ||  row.length == 0 ){
              this.$msgTip.info(this,{info:this.$t('m.i.common.chooseOneData')});
          }else{
            let files = row.ip+":"+row.fileName;
            let url = window.LOCAL_CONFIG.API_HOME + "/sm/oper/logfile/logMain/func_downLogFile";
            let form = document.createElement('form');
            form.setAttribute("id","downformId");
            url=url+"?files="+files;
            form.setAttribute('action',url);
            form.setAttribute("method", "post");
            form.setAttribute("target", "_blank");
            document.body.appendChild(form);
            document.getElementById("downformId").submit();
            document.body.removeChild(form);
          }

      },

      unDisabled(){
        this.deletDisabled=false
      },
      formSearch() {
        this.unDisabled()
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
        this.currentSelectList=[];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
    }
  };
</script>

<style scoped>

</style>
