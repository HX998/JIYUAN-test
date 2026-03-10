<!--接口证书管理-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.config.accessKey')" prop="accessKey">
                  <h-input v-model="formItem.accessKey"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate one-form">
                  <h-button type="primary" @click="formSearch()">{{$t('m.i.common.search')}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t('m.i.common.reset')}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns"
                      highlight-row
                      url="/sm/config/cert/adapterCertMng/func_pagingQueryAdapterCert"
                      :bindForm="formItem"
                      :rowSelect=true
                      :hasSelect=false
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="handleAddForm('add')">新增证书</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">修改证书</h-button>
              <h-button type="primary" @click="updateAccessSecret()">密码更新</h-button>
              <h-button type="primary" @click="deleteCert()">删除证书</h-button>
              <h-button type="primary" @click="downloadCert()">导出证书</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>

    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="400" :mask-closable="false"
               @on-close="handleWinClose" :maximize="true">
      <p slot="header">
        <span v-if="type=='add'">新增证书</span>
        <span v-if="type=='modify'">修改证书</span>
      </p>
      <div>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="1" class="h-form-search">
          <h-form-item :label="$t('m.i.config.accessKey')" prop="accessKey" :required="isRequired">
            <h-input v-model="addForm.accessKey" :maxlength=16 placeholder=""></h-input>
          </h-form-item>
        </h-form>

      </div>
      <div slot="footer">
        <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t('m.i.common.submiting')}}</h-button>
        <h-button type="primary" v-else @click="addOrEditFormSave()">{{$t('m.i.common.confirm')}}</h-button>
      </div>
    </h-msg-box>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "adapterCertMng",
    data() {
      return {
        ifShowMore : false,
        formItem : {
          accessKey : '',
        },
        columns : [
          {
            type: "selection",
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
            title: this.$t('m.i.config.accessKey'),
            key: "accessKey",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.config.accessSecret'),
            key: "accessSecret",
            hiddenCol: false,

          }
        ],
        submitFlag : false,
        currentSelectRow:[],
        currentSelectList:[],
        isRequired:true,
        addForm : {
          id:"",
          accessKey : '',
        },
        addOrEditWin : false,
        type : '',
      }
    },
    methods: {
      addOrEditFormSave() {
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.type == "add" ? '/sm/config/cert/adapterCertMng/func_addAdapterCert' : '/sm/config/cert/adapterCertMng/func_updateAdapterCert'
            let errorMsg = this.type == "add" ? '新增失败:' :'修改失败:';
            let pageNo = this.type === "add" ? 1 : this.$refs.datagrid.pageInfo.pageNo;
			      this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let retCode = res.data.retCode
                if (retCode == "000000") {
                  this.$msgTip.success(this)
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(pageNo);
                  this.selectReset();
                } else {
                  this.$msgTip.error(this, {info: errorMsg + res.data.retMsg});

                }
              } else {
                this.$msgTip.error(this, {info: this.$t('m.i.common.netError')});
              }

            });
          }
        });
      },

      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true
        if (this.type == "modify") {
		    let list = this.$refs.datagrid.selects;
          if (list != null && list.length > 0) {
            if (list.length > 1) {
              this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
              return;
            }
            let row =  list[0];
            this.addForm.id = row.id;
            this.addForm.accessKey = row.accessKey;
          } else {
            this.$msgTip.info(this, {info: this.$t('m.i.common.chooseOneData')});
            return;
          }
        } else {
          this.$nextTick(() => {
            this.addFormReset();
            this.addForm.id ='';
            this.addForm.accessKey='';
          });
        }
        this.addOrEditWin = true;
      },
      addFormReset() {
        this.$refs.addForm.resetFields();
      },

      updateAccessSecret() {

		let list = this.$refs.datagrid.selectIds;
        if (list != null && list.length > 0) {
          if (list.length > 1) {
            this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
            return;
          }
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: '确认要更新密码吗?',
            onOk: () => {

              post({id: list[0]}, 'sm/config/cert/adapterCertMng/func_updateCertAccessSecret').then(res => {
                if (res) {
                  let retCode = res.data.retCode
                  if (retCode == "000000") {
                    this.$msgTip.success(this)
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                      this.selectReset();
                  } else {
                    this.$msgTip.error(this, {info: res.data.retMsg})
                    this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo)
                  }
                } else {
                  this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
                }
              });
            }
          })


        } else {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseOneData')});
          return;
        }
      },

      deleteCert() {

		let list = this.$refs.datagrid.selectIds;
        if (list != null && list.length > 0) {
          this.$hMsgBox.confirm({
            title: this.$t('m.i.common.confirm'),
            content: this.$t('m.i.common.isConfirmDelete') + '?',
            onOk: () => {
              this.handleDel();
            }
          })
        } else {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseOneData')});
        }
      },

      handleDel() {
        let list = this.$refs.datagrid.selectIds;
        let ids = "";
        for (var i = 0, count = list.length; i < count; i++) {
          ids += list[i];
          if (i < list.length - 1) {
            ids += ",";
          }
        }
        post({ids: ids}, 'sm/config/cert/adapterCertMng/func_deleteAdapterCert').then(res => {
          if (res) {
            let retCode = res.data.retCode
            if (retCode == "000000") {
              this.$msgTip.success(this)
              this.$refs.datagrid.dataChange(1);
              this.selectReset();
            } else {
              this.$msgTip.error(this, {info: this.$t('m.i.common.deleteFailed') + res.data.retMsg})
              this.$refs.datagrid.dataChange(1)
            }
          } else {
            this.$msgTip.error(this, {info: this.$t('m.i.common.netError')})
          }
        });
      },

      downloadCert() {
        let list = this.$refs.datagrid.selectIds;
        if (list != null && list.length > 0) {
          if (list.length > 1) {
            this.$msgTip.info(this, {info: this.$t('m.i.common.onlyChooseOneData')});
            return;
          }

          let id = list[0];
          let url = window.LOCAL_CONFIG.API_HOME + "/sm/config/cert/adapterCertMng/func_downloadAdapterCert?id=" + id;
          let form = document.createElement('form');
          form.setAttribute("id", "formId");
          form.setAttribute('action', url);
          form.setAttribute("method", "post");
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
        } else {
          this.$msgTip.info(this, {info: this.$t('m.i.common.chooseOneData')});
          return;
        }

      },

      unDisabled() {
        this.deletDisabled = false
      },
      formSearch() {
        this.unDisabled()
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = [];
        this.currentSelectList = [];
      },
	  selectReset(){
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleWinClose() {
        this.$refs.addForm.resetFields();

        this.currentSelectRow = [];
        this.currentSelectList = [];
        this.$refs.datagrid.dataChange(1);
      },
    }

  };
</script>

<style scoped>

</style>
