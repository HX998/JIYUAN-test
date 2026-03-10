<template>
  <h-msg-box v-model="tempShowBranchManagerWin" width="1000" class="h-form-table-layer" :maximize="true"
             @on-close="handleClose">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <!--数据展示表格-->
    <h-row>
      <h-col span="24">
        <h-datagrid
          :columns="showBranchManagerColumns"
          highlight-row
          :auto-load="false"
          :bind-form="formItem"
          url="/sm/auth/branch/branchAdmin/func_queryBranchAdminList"
          :onSelectChange="handleSelectClick"
          ref="datagrid">
        </h-datagrid>
      </h-col>
    </h-row>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="submitForm">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>

  export default {
    name: "showBranchManager",
    data() {
      return{
        showBranchManagerColumns : [
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
            title: this.$t('m.i.common.userNo'),
            key: "userNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.userName'),
            key: "userName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
        ],
        formItem : {
          brchNo: ''
        },
        currentSelectList : [],
        currentSelectRowInx : [],
      }

    },
    props: {
      title: String,
      showBranchManagerWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      brchNo: ''
    },
    watch: {
      showBranchManagerWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.formItem.brchNo = this.brchNo;
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },
    computed: {
      tempShowBranchManagerWin: {
        get() {
          return this.showBranchManagerWin;
        },
      }
    },
    methods: {
      handleSelectClick(arr, selectInx) {
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
      },
      submitForm() {
        let list = this.currentSelectList;
        if (list == null || list.length <= 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
          return;
        }
        let info = [];
        for(let i = 0; i < list.length; i++) {
          info.push(list[i].userName);
        }
        this.$emit("branchManagerSelect", info);
        this.currentSelectList = [];
      },
      handleClose() {
        this.$emit("showBranchManagerWinClose", "");
      }
    }

  };
</script>

<style scoped>

</style>
