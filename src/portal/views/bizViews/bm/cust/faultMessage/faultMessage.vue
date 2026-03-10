<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.memberId')" prop="memberId">
                  <h-input v-model="formItem.memberId"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.createDt')" prop="createDt">
                  <h-date-picker type="daterange" placeholder="" v-model="createDt" format="yyyy-MM-dd" showFormat @on-change="createDtChange"></h-date-picker>
                </h-form-item>
                <h-form-item :label="$t('m.i.bm.stsCode')" prop="stsCode">
                  <h-select v-model="formItem.stsCode" placeholder="">
                    <h-option v-for="item in stsCodeList" :value="item.key" :key="item.key">{{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <!--<span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont" :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>-->
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
              url="bm/cust/faultMessage/pageQueryFaultMessage"
              :columns="columns"
              :hasSelect=false
              :rowSelect=true
              :bindForm="formItem"
              ref="datagrid">
            <div slot="toolbar" class="pull-left">
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
    name: "faultMessage",
    data() {
      let columns = [
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
          title: this.$t('m.i.common.msgId'),
          key: "msgId",
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
          title: this.$t('m.i.bm.stsCode'),
          key: "stsCode",
          hiddenCol: false,
          render: (h, params) => {
            return h("span", this.getDictValueFromMap(this.dictMap, "StsCode", params.row.stsCode));
          }
        },
        {
          title: this.$t('m.i.common.createTime'),
          key: "createDtTm",
          align: "center",
          sortable: true,
          render: (h, params) => {
            if (null != params.row.createDtTm && "" !== params.row.createDtTm) {
              let dttm = this.$moment(params.row.createDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", dttm);
            }
          }
        }
      ];
      let formItem = {
        memberId: "",
        stsCode: "",
        minCreateDt: "",
        maxCreateDt: ""
      };
      return {
        stsCodeList: [],
        createDt: "",
        ifShowMore: false,
        formItem: formItem,
        columns: columns,
        dictMap: null
      };
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.selects = [];
        this.$refs.datagrid.selectIds = [];
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.createDt = "";
        this.formItem.minCreateDt = "";
        this.formItem.maxCreateDt = "";
        this.$refs.formItem.resetFields();
      },
      createDtChange(arr) {
        if(arr && arr.length == 2){
          this.formItem.minCreateDt = arr[0].replace(/-/g, "");
          this.formItem.maxCreateDt = arr[1].replace(/-/g, "");
        }else{
          this.formItem.minCreateDt = "";
          this.formItem.maxCreateDt = "";
        }
      },
    },

    mounted() {
      this.getDictListByGroups("StsCode").then(res => {
        this.stsCodeList = res.get("StsCode");
        this.dictMap = res.get("map");
      });
    }
  };
</script>

<style scoped>

</style>
