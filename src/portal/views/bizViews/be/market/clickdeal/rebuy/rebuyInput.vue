<template>
  <div>
    <h-form-item :label="$t('m.i.common.busiType')" prop="busiType" required class="h-form-three">
      <h-select v-model="formItem.busiType" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['busiTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.quoteNo')" prop="quoteNo" class="h-form-three">
      <h-input v-model="formItem.quoteNo" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.brchName')" prop="buyBrchName" class="h-form-three">
      <h-input v-model="formItem.buyBrchName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.traderName')" prop="buyTraderName" class="h-form-three h-form-long-label">
      <h-input v-model="formItem.buyTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.otherBrchName')" prop="saleBrchName" class="h-form-three">
      <h-input v-model="formItem.saleBrchName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custBrchCode')" prop="saleBrchCode" class="h-form-three">
      <h-input v-model="formItem.saleBrchCode" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custProductNo')" prop="saleProductName" class="h-form-three h-form-long-label">
      <h-input v-model="formItem.saleProductName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custTraderName')" prop="saleTraderName" :label-width="110" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.saleTraderName" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.custTraderNo')" prop="saleTraderNo" required class="h-form-three h-form-long-label">
      <h-input v-model="formItem.saleTraderNo" placeholder="" readonly></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.subDeal')" prop="subDeal" required class="h-form-three">
      <h-select v-model="formItem.subDeal" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['YonList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billType')" prop="billType" required class="h-form-three">
      <h-select v-model="formItem.billType" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['billTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.billInfo.billClass')" prop="billClass" required class="h-form-three">
      <h-select v-model="formItem.billClass" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['billClassList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearType')" prop="clearType" required class="h-form-three">
      <h-select v-model="formItem.clearType" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['ClearTypeList']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.settleMode')" prop="settleMode" required class="h-form-three">
      <h-select v-model="formItem.settleMode" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['SettleType']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.clearSpeed')" prop="clearSpeed" required class="h-form-three">
      <h-select v-model="formItem.clearSpeed" placeholder="" readonly showTitle>
        <h-option v-for="item in dictMap['clearSpeed']" :value="item.key" :key="item.key">{{item.value }}</h-option>
      </h-select>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.firstSettleDt')" prop="firstSettleDt" required class="h-form-three">
      <h-date-picker v-model="formItem.firstSettleDt" type="date" readonly format="yyyy-MM-dd" :showFormat="true"  :options="options1"></h-date-picker>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.tradRate')" prop="ratePct" required class="h-form-three" :validRules="ratePctRule">
      <h-input v-model="formItem.ratePct" readonly placeholder="利率范围0~100，且小数位不超过四位" ></h-input>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.setTm')" prop="setTm" required class="h-form-three">
      <h-time-picker v-model="formItem.setTm" readonly placement="bottom-end" placeholder="选择时间" ></h-time-picker>
    </h-form-item>
    <h-form-item :label="$t('m.i.be.quoteTm')" prop="quoteTm" required  class="h-form-three h-form-long-label">
      <h-time-picker   v-model="formItem.quoteTm" readonly placement="bottom-end" placeholder="选择时间" ></h-time-picker>
    </h-form-item>
    <div>
      <h-form-item :label="$t('m.i.be.prodNo')" prop="prodNo" required  class="h-form-three">
        <h-select v-model="formItem.prodNo" placeholder="" readonly showTitle>
          <h-option v-for="(key ,value) in formItem.productMapDict" :value="value" :key="key">{{key }}</h-option>
        </h-select>
      </h-form-item>
    </div>
    <div>
      <h-form-item :label="$t('m.i.common.totalAmtBillPackage')" prop="totalAmt"  class="h-form-three">
        <h-input v-model="formItem.totalAmt" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.common.totalNumBillPackage')" prop="totalNum"  class="h-form-three">
        <h-input v-model="formItem.totalNum" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.payInterestByUnit')" prop="firstPayInterest"  class="h-form-three">
        <h-input v-model="formItem.firstPayInterest" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.firstSettleAmt')" prop="firstSettleAmt"  class="h-form-three">
        <h-input v-model="formItem.firstSettleAmt" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.tenorDays')" prop="tenorDays"  class="h-form-three h-form-long-label">
        <h-input v-model="formItem.tenorDays" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.yieldRate')" prop="yieldRatePct"  class="h-form-three">
        <h-input v-model="formItem.yieldRatePct" placeholder="" readonly></h-input>
      </h-form-item>
      <h-form-item :label="$t('m.i.be.diffMsg')" prop="preChangeInfo"  cols="3" class="h-form-height-auto" style="width:80%">
        <h-input v-model="formItem.preChangeInfo"  placeholder="" type="textarea" readonly></h-input>
      </h-form-item>
    </div>
    <slot name="save"></slot>

  </div>
</template>
<script>
  export default {
    name: "rebuyInput",
    data() {
      return {
      };
    },
    components: {
    },
    props: {
      formItem: {
        type: Object
      },
      dictMap: {
        type: Object
      }
    },
    watch: {
    },
    methods: {
    }


  };
</script>

