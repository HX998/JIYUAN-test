<!--基础数据查询-->
<template>
  <div>
    <!--数据展示表格-->
    <h-datagrid
      :columns="columns"
      highlight-row
      :has-page="false"
      url="/shcpe/ecds/mng/ecdsCommonData/func_queryEcdsCommonData"
      ref="datagrid">
      <div slot="toolbar" class="pull-left">

      </div>
    </h-datagrid>
  </div>
</template>
<script>
  import { post, on, off } from "@/api/bizApi/commonUtil";

  export default {
    name: "ecdsCommonData",
    data() {
      return {
        columns: [
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center"
          },
          {
            title: this.$t('m.i.shcpe.comdataDataCode'),
            key: "comdataDataCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.comdataName'),
            key: "comdataDataName",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t('m.i.shcpe.comdataDataValue'),
            key: "comdataDataValue",
            hiddenCol: false

          },
          {
            title: this.$t('m.i.shcpe.comdataTypeCode'),
            key: "comdataDataType",
            hiddenCol: false,

            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "EcdsCmonDtTpCode", params.row.comdataDataType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.activeType'),
            key: "activeType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "EcdsCmonDtFctvTpCode", params.row.activeType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.shcpe.comdataDataUpdata'),
            key: "comdataDataUpdata",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.activeDt'),
            key: "activeDt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.activeDt ? this.$moment(params.row.activeDt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.shcpe.modifyDt'),
            key: "updateGmt",
            sortable: true,
            hiddenCol: false,
            render: (h, params) => {
              return h('span', params.row.updateGmt ? this.$moment(params.row.updateGmt, "YYYY-MM-DD").format("YYYY-MM-DD") : "")
            }
          },
          {
            title: this.$t('m.i.common.postscript'),
            key: "remark",
            hiddenCol: false
          }
        ],
        dictMap: new Map()
      };
    },
    components: {},
    watch: {},

    computed: {},
    methods: {
    },
    mounted() {
      this.getDictListByGroups("EcdsCmonDtTpCode,EcdsCmonDtFctvTpCode").then(res => {
        this.dictMap = res.get("map");
      });
    }
  };
</script>
