<template>
  <!--用户查询弹出框-->
  <h-msg-box v-model="tempBrchNoSearchWin" width="1000" @on-close="handleClose" class="h-form-table-layer" :maximize="true" :mask-closable="false" @on-maximize="onMaximize">
    <p slot="header">
      <span>机构查询窗口</span>
    </p>
    <!--查询表单-->
    <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
      <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
        <h-input v-model="formItem.brchName" placeholder="" :maxlength="200" :title="formItem.brchName"></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo">
        <h-input v-model="formItem.brchNo" placeholder="" :maxlength="60"></h-input>
      </h-form-item>
      <h-form-item class="h-form-operate two-form">
        <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
        <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
      </h-form-item>
    </h-form>
    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                :autoLoad="false"
                rowSelect
                url="/sm/auth/branch/queryBranchsByPage"
                :bindForm="formItem"
                :hasSelect="hasSelect"
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
  import { on, off } from "@/api/bizApi/commonUtil";
  export default {
    name: "brchNoSearch",
    data() {
      return {
        formItem : {
          brchName: '',
          brchNo: '',
          branchName:'',
          brchNos:'',
        },
        columns : [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            type: 'index',
            title: this.$t("m.i.common.index"),
            width: 60,
            align: 'center',
            hiddenCol: false,
          },
          {
            title: this.$t('m.i.common.legalNo'),
            key: 'legalNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: 'brchNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: 'brchName',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.parentBrchNo'),
            key: 'parentBrchNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.auth.brchLevel"),
            key: 'brchLevel',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.bankNo"),
            key: 'bankNo',
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.cpesBrchCode"),
            key: 'cpesBrchCode',
            hiddenCol: false,
            sortable: true
          }
        ],
        pageInfo : {
          pageNo: 1,
          pageSize: 10
        },
        currentSelectRow : [],
        currentSelectRowInx : [],
        currentSelectList:[],
        submitFlag : false,
        hasSelect : false,
        tableRef:"selfTable",
      }
    },
    components: {
    },
    watch: {
      tempBrchNoSearchWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = [];
            this.currentSelectList = [];
            this.$refs.datagrid.dataChange(1);
          });
        }
      },
    },

    computed: {
      tempBrchNoSearchWin: {
        get() {
          return this.brchNoSearchWin;
        },
        set() {
        },
      },
    },
    props : {
      title:String,
      brchNoSearchWin: {
        type:Boolean,
        default() {
          return false;
        }
      },
      isMulti:{
        type: Boolean,
        default(){
          return false;
        }
      }
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.currentSelectRow = [];
        this.currentSelectList=[];
        this.$refs.datagrid.dataChange(1);
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //确定
      submitForm() {
        let  select=this.$refs.datagrid.selects;
        if(select.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        if(this.isMulti){
          if(this.currentSelectList.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
        }
        this.$emit("brchNoSearchChange", select);
        this.hasSelect=true;
      },
      //关闭
      handleClose() {
        this.$emit("brchNoSearchClose", "");
      },
    }
  };
</script>

<style scoped>

</style>
