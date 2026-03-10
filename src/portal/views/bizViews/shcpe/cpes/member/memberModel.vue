<!--全市场会员模式查询-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--右侧数据展示表格-->
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item :label="$t('m.i.common.memberId')" prop="memberIdLike">
                  <h-input v-model="formItem.memberIdLike" :maxlength="6"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.memberName')" prop="memberNameLike">
                  <h-input v-model="formItem.memberNameLike" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.auth.paramType')" prop="paramKey">
                  <h-select v-model="formItem.paramKey" placeholder="" @on-change="onChange">
                    <h-option v-for="item in paramKeys" :value="item.key" :key="item.key">
                      {{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item :label="$t('m.i.common.paramValue')" prop="paramValue" v-if="this.formItem.paramKey" :key="this.formItem.paramKey">
                  <h-select v-model="formItem.paramValue" placeholder="">
                    <h-option v-for="item in paramValues" :value="item.key" :key="item.key">
                      {{ item.value }}
                    </h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{ $t('m.i.common.searchAdvanced') }}
                    <i class="icon iconfont"
                       :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch('1')">{{ $t("m.i.common.search") }}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{ $t("m.i.common.reset") }}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid
            :columns="columns"
            highlight-row
            url="/shcpe/cpes/member/memberModel/func_queryCppmMemberParamByPage"
            :bindForm="formItem"
            ref="datagrid">
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import {getDictListByGroups, getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "memberModel",
    data() {
      return {
        formItem: {
          memberIdLike: "",
          memberNameLike: "",
          paramKey: "",
          paramValue: ""
        },
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        paramKeys: [],
        paramDF01Values: [],
        paramPC01Values: [],
        paramValues: [],
        dictMap: new Map(),
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t("m.i.common.memberId"),
            key: "memberId",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.memberName"),
            key: "memberName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.auth.paramType"),
            key: "paramKey",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "MemberParamKey", params.row.paramKey);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.paramValue"),
            key: "paramValue",
            hiddenCol: false,
            render: (h, params) => {
              let value = "";
              if (params.row.paramKey === "DF01") {
                value = this.getDictValueFromMap(this.dictMap, "BillBusiSysOnline", params.row.paramValue);
              } else if (params.row.paramKey === "PC01") {
                value = this.getDictValueFromMap(this.dictMap, "BatchClear", params.row.paramValue);
              }
              return h("span",
                {
                  domProps: {
                    title: value
                  }
                }, value);
            }
          },
        ],
        ifShowMore: false,
      };
    },
    methods: {
      formSearch() {
        this.$refs.datagrid.dataChange(1);
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      onChange(value) {
        if (value) {
          this.formItem.paramValue = "";
          this.paramValues = value === "DF01" ? this.paramDF01Values : this.paramPC01Values;
        }
      }
    },
    mounted() {
      this.getDictListByGroups("MemberParamKey,BillBusiSysOnline,BatchClear").then(res => {
        this.paramKeys = res.get("MemberParamKey");
        this.paramDF01Values = res.get("BillBusiSysOnline");
        this.paramPC01Values = res.get("BatchClear");
        this.dictMap = res.get("map");
      });
    }
  }
</script>

<style scoped>

</style>
