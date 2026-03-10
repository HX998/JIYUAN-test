<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch v-model="formItem.brchNo" :label="$t('m.i.common.brchName')" prop="brchNo"
                             title="机构名称" :brchNo.sync="formItem.brchNo" :showCheckBox="false">
                </show-branch>
                <h-form-item :label="$t('m.i.bm.auditSwitch')" prop="auditSwitch">
                  <h-select v-model="formItem.auditSwitch" placeholder="" :clearable="false" showTitle>
                    <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate two-form">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
            <!-- 数据展示表格 -->
            <h-datagrid
                :columns="columns"
                highlight-row
                :bindForm="formItem"
                url="/bm/audit/auditBrchProductMain/func_pageQueryAuditBrchProdList"
                :onCurrentChange="onCurrentChange"
                :onCurrentChangeCancel="onCurrentChangeCancel"
                ref="datagrid">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="handleForm('add')">{{$t('m.i.common.add')}}</h-button>
                <h-button type="primary" @click="handleForm('modify')">{{$t('m.i.common.modify')}}</h-button>
                <h-button type="primary" @click="deleteAuditBrchProductMain()">{{$t('m.i.common.delete')}}</h-button>
              </div>
            </h-datagrid>
            <!-- 点击新增/修改弹出框 -->
            <h-msg-box v-model="addOrEditWin" width="400" class="h-form-search-layer" :maximize="true"
                       :mask-closable="false">
              <p slot="header">
                <span v-if="type==='add'">新增审批机构产品信息</span>
                <span v-if="type==='modify'">编辑审批机构产品信息</span>
              </p>
              <h-panel>
                <h-form :model="addOrEditForm" :label-width="115" ref="addOrEditForm" cols="1" class="h-form-search">
                  <show-product v-if="type==='add'" v-model="addOrEditForm.prodName" :label="$t('m.i.bm.designatedProdName')" prop="prodName" required
                                :clearProduct="clearProdNo" @productSelectedChange="productSelectedChange"></show-product>
                  <h-form-item :label="$t('m.i.bm.designatedProdName')" prop="prodName" required v-if="type==='modify'">
                    <h-input v-model="addOrEditForm.prodName" placeholder="" disabled></h-input>
                  </h-form-item>
                  <show-branch :filterable="type==='add'" v-model="addOrEditForm.brchName" readonly :label="$t('m.i.bm.designatedBrchName')" prop="brchName" required
                               title="机构名称" :brchNo.sync="addOrEditForm.brchNo" :brchName.sync="addOrEditForm.brchName" :showCheckBox="false" :msgBoxWin="addOrEditWin">
                  </show-branch>
                  <h-form-item :label="$t('m.i.bm.auditSwitch')" prop="auditSwitch" required>
                    <h-select v-model="addOrEditForm.auditSwitch" placeholder="" showTitle>
                      <h-option v-for="item in YonList" :value="item.key" :key="item.key">{{item.value }}</h-option>
                    </h-select>
                  </h-form-item>
                </h-form>
              </h-panel>
              <div slot="footer">
                <h-button type="ghost" @click="addOrEditWin=!addOrEditWin">{{$t("m.i.common.close")}}</h-button>
                <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
                <h-button type="primary" v-else @click="formAdd()">{{$t("m.i.common.commit")}}</h-button>
              </div>
            </h-msg-box>
          </div>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "auditBrchProductMain",
    data() {
      let formItem = {
        brchNo: "",
        auditSwitch: "",
        brchName: ""
      };
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
          title: this.$t('m.i.common.brchNo'),
          key: "brchNo",
          align: "center",

          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.common.brchName'),
          key: "brchName",
          align: "center",

          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t("m.i.common.prodName"),
          key: "prodName",
          align: "center",

          hiddenCol: false,
          sortable: true
        },
        {
          title: this.$t('m.i.bm.auditSwitch'),
          key: "auditSwitch",
          align: "center",

          hiddenCol: false,
          sortable: true,
          render: (h, params) => {
            let list = this.YonList;
            let auditSwitch = params.row.auditSwitch;
            for (let i = 0; i < list.length; i++) {
              if (params.row.auditSwitch === list[i].key) {
                auditSwitch = list[i].value;
              }
            }
            return h("span", auditSwitch);
          }
        }
      ];
      let addOrEditForm = {
        id: "",
        legalNo: "",
        brchNo: "",
        brchName: "",
        prodName: "",
        prodNo: "",
        auditSwitch: ""
      };
      return {
        formItem: formItem,
        columns: columns,
        addOrEditForm: addOrEditForm,
        selectData:null,
        type: null,
        optType: "",
        YonList: [],
        addOrEditWin: false,
        ifShowMore: false,
        submitFlag: false
      };
    },
    components: {

    },
    methods: {
      //查询
      handleSearch() {
        this.selectData = null;
        this.$refs.datagrid.dataChange(1);
      },
      //重置查询结果
      resetSearch() {
        this.formItem.brchNo = "";
        this.formItem.brchName = "";
        this.$refs.formItem.resetFields();
      },
      clearProdNo() {
        this.addOrEditForm.prodName = "";
        this.addOrEditForm.prodNo = "";
      },
      //选择产品名称弹出框确认
      productSelectedChange(arr) {
        this.addOrEditForm.prodName = arr[0].title;
        this.addOrEditForm.prodNo = arr[0].id;
      },
      //主页面新增、修改
      handleForm(type) {
        this.type = type;
        if (this.type === "modify" && !this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        if (this.type === "modify") {
          let id = this.selectData.id;
          post({ id: id }, "/bm/audit/auditBrchProductMain/func_getAuditBrchProdById").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$nextTick(() => {
                  this.addOrEditForm.id = res.data.retData.id;
                  this.addOrEditForm.legalNo = res.data.retData.legalNo;
                  this.addOrEditForm.prodName = res.data.retData.prodName;
                  this.addOrEditForm.prodNo = res.data.retData.prodNo;
                  this.addOrEditForm.brchNo = res.data.retData.brchNo;
                  this.addOrEditForm.brchName = res.data.retData.brchName;
                  this.addOrEditForm.auditSwitch = res.data.retData.auditSwitch;
                });
              } else {
                this.$msgTip.error(this, { info: res.data.retMsg });
                this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          this.addOrEditReset();
        }
        this.addOrEditWin = true;
      },
      //主页面新增/修改页面提交
      formAdd() {
        this.$refs["addOrEditForm"].validate(valid => {
          if (valid) {
            let url = this.type === "add" ? "/bm/audit/auditBrchProductMain/func_insertAuditBrchProd" : "/bm/audit/auditBrchProductMain/func_updateAuditBrchProd";
            this.submitFlag = true;
            post(this.addOrEditForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addOrEditWin = false;
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.selectData = null;
                } else {
                  this.$msgTip.error(this, { info: res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //主页面重置新增/修改窗口
      addOrEditReset() {
        this.addOrEditForm.brchNo = "";
        this.addOrEditForm.brchName = "";
        this.$nextTick(() => {
          this.$refs.addOrEditForm.resetFields();
        });
      },
      //删除
      deleteAuditBrchProductMain() {
        if (!this.selectData) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?",
          onOk: () => {
            this.handleDel();
          }
        });
      },
      handleDel() {
        post({ id: this.selectData.id }, "/bm/audit/auditBrchProductMain/func_deleteAuditBrchProd").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this, { info: this.$t("m.i.common.deleteSuccess") });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.selectData = null;
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      onCurrentChange(currentRow, oldCurrentRow, _index){
        this.selectData = currentRow;
      },
      onCurrentChangeCancel(){
        this.selectData = null;
      },
    },
    mounted() {
      this.getDictListByGroups("Yon").then(res => {
        this.YonList = res.get("Yon");
        this.dictMap = res.get("map");
      });
    }

  };
</script>

<style scoped>

</style>
