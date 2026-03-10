<template>
  <!-- 贴现 -->
  <disc-batch-info-detail :prod-no="prodNo" :batch-no="batchNo"
                          :queryBatchUrl="'/ce/disc/paper/apply/discApplyBatchMain/func_queryDiscBatch'"
                          :view-detail-form="viewDetailForm" :auditNotMainClose="auditNotMainClose"></disc-batch-info-detail>

</template>

<script>
  export default {
    name: "commonBatchInfoDetail",
    components: {
      // DiscBatchInfoDetail: () => import(/*webpackChunkName: "ce/disc/common/discBatchInfoDetail"*/"@/views/bizViews/ce/disc/common/discBatchInfoDetail.vue")
    },
    data() {
      return {};
    },
    props : {
      viewDetailForm: Object,
      batchNo: "",
      prodNo: "",
      auditNotMainClose: ""
    },
  };
</script>

<style scoped>

</style>
