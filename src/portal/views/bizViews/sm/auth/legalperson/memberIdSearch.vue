<template>
  <!--会员代码弹出框-->
  <h-msg-box v-model="tempMemberIdWin" width="1000" @on-close="handleClose" class="h-form-table-layer" :maximize="true"
             :mask-closable="false" @on-maximize="onMaximize" :z-index="zIndex">
    <p slot="header">
      <span>查询会员</span>
    </p>
    <!--查询表单-->
    <div>
      <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
        <h-form-item :label="$t('m.i.common.memberName')" prop="memberName">
          <h-input v-model="formItem.memberName" placeholder="" :maxlength="60"></h-input>
        </h-form-item>
        <h-form-item class="h-form-operate one-form">
          <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
        </h-form-item>
      </h-form>
    </div>
    <!--数据展示表格-->
    <h-datagrid :columns="columns"
                highlightRow
                :autoLoad="false"
                url="/cpes/member/queryMemberList"
                :bindForm="formItem"
                :on-select-change="handleRowClick"
                :onRowDbClick="doubleHandleClick"
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
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "memberIdSearch",
    data() {
      return {
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        columns: [
          {
            type: "radio",
            title: " ",
            width: 60,
            hiddenCol: false
          },
          {
            type: "selection",
            width: 60,
            hiddenCol: true,
            align: "center"
          },
          {
            type: "index",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.memberId'),
            key: "memberId",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.memberName'),
            key: "memberName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.shcpe.memberTypeCode'),
            key: "memberTypeCode",
            hiddenCol: this.isShowType,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "MemberType", params.row.memberTypeCode);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }
        ],
        dictMap : new Map(),
        currentSelectRow: null,
        currentSelectRowInx: []

      };
    },
    props: {
      formItem: {
        type: Object,
        default: {
          memberName: "",
          memberTypeCode : ""
        }
      },
      isShowType: {
        type: Boolean,
        default: true
      },
      memberIdWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      zIndex: {
        type: Number
      }
    },
    watch: {
      tempMemberIdWin(val) {
        if (val == true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            this.currentSelectRow = null;
            this.$refs.datagrid.dataChange(1);
          });
        }
      }
    },

    computed: {
      tempMemberIdWin: {
        get() {
          return this.memberIdWin;
        },
        set() {
        }
      }
    },
    methods: {
      doubleHandleClick(arr) {
        this.currentSelectRow = arr;
        this.$emit("memberIdWinSubmit", this.currentSelectRow);
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      //查询
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        this.currentSelectRow = null;
      },
      //重置
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr[0];
      },
      //确定
      submitForm() {
        if (this.currentSelectRow === null || this.currentSelectRow === "" || this.currentSelectRow === undefined) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
          return;
        }
        this.$emit("memberIdWinSubmit", this.currentSelectRow);
      },
      //关闭
      handleClose() {
        this.$emit("memberIdWinClose", "");
      }
    },
    mounted() {
      this.getDictListByGroups("MemberType").then(res => {
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
