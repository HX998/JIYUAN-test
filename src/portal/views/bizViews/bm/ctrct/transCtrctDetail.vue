<!--质押/解质押批次明细-->
<template>
  <div>
    <div class="text-wrap mb-10">
      <div class="text-header"><span class="tit">详细信息</span></div>
      <div class="text-body">
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">合同编号：</h-col>
              <h-col span="15" class="val">{{ ctrctObj.ctrctNo }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">交易对手名称：</h-col>
              <h-col span="15" class="val">{{ ctrctObj.buyerCustName }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">客户名称：</h-col>
              <h-col span="15" class="val">{{ ctrctObj.sellerCustName }}</h-col>
            </h-row>
          </h-col>
        </h-row>
        <h-row :gutter="8">
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">合同签订日期：</h-col>
              <h-col span="15" class="val">{{ ctrctObj.ctrctSignDt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">合同到期日期：</h-col>
              <h-col span="15" class="val">{{ ctrctObj.ctrctSignDueDt }}</h-col>
            </h-row>
          </h-col>
          <h-col span="8">
            <h-row>
              <h-col span="9" class="label">合同金额：</h-col>
              <h-col span="15" class="val">{{ ctrctObj.ctrctAmt }}
              </h-col>
            </h-row>
          </h-col>
        </h-row>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "transCtrctDetail",
    props: {
      ctrctObj: {
        type: Object,
        default: {
          ctrctNo: "",
          buyerCustName: "",
          sellerCustName: "",
          ctrctSignDt:"",
          ctrctSignDueDt: "",
          ctrctAmt: ""
        }
      }
    },
  };
</script>

<style scoped>

</style>
