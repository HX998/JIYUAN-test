<template>
  <h-msg-box v-model="acmtAuthListWin" width="400" class="h-form-search-layer" :maximize="true" :mask-closable="false"
             @on-close="acmtAuthListWinClose()" @on-maximize="onMaximize">
    <p slot="header">
      <span>权限信息</span>
    </p>
    <h-panel>
      <h-checkbox-group v-model="propAuthList" style="height:auto">
        <h-row>
          <h-col span="12">
            <h-checkbox label="CG00" :disabled= true><span>不限制</span></h-checkbox>
          </h-col>
          <h-col span="12">
            <h-checkbox label="CG01" :disabled=true><span>出票发起</span></h-checkbox>
          </h-col>
        </h-row>
        <h-row>
          <h-col span="12">
            <h-checkbox label="CG02" :disabled=true><span>承兑发起</span></h-checkbox>
          </h-col>
          <h-col span="12">
            <h-checkbox label="CG03" :disabled=true><span>承兑应答</span></h-checkbox>
          </h-col>
        </h-row>
        <h-row>
          <h-col span="12">
            <h-checkbox label="CG04" :disabled=true><span>收票发起</span></h-checkbox>
          </h-col>
          <h-col span="12">
            <h-checkbox label="CG05" :disabled=true><span>收票应答</span></h-checkbox>
          </h-col>
        </h-row>
        <h-row>
          <h-col span="12">
            <h-checkbox label="CG06" :disabled=true><span>背书发起</span></h-checkbox>
          </h-col>
          <h-col span="12">
            <h-checkbox label="CG07" :disabled=true><span>背书应答</span></h-checkbox>
          </h-col>
        </h-row>
        <h-row>
          <h-col span="12">
            <h-checkbox label="CG09" :disabled=true><span>质押申请</span></h-checkbox>
          </h-col>
          <h-col span="12">
            <h-checkbox label="CG10" :disabled=true><span>质押应答</span></h-checkbox>
          </h-col>
        </h-row>
        <h-row>
          <h-col span="12">
            <h-checkbox label="CG11" :disabled=true><span>保证申请</span></h-checkbox>
          </h-col>
          <h-col span="12">
            <h-checkbox label="CG12" :disabled=true><span>保证应答</span></h-checkbox>
          </h-col>
        </h-row>
        <h-row>
          <h-col span="12">
            <h-checkbox label="CG13" :disabled=true><span>存托发起</span></h-checkbox>
          </h-col>
          <h-col span="12">
            <h-checkbox label="CG14" :disabled=true><span>存托应答</span></h-checkbox>
          </h-col>
        </h-row>
        <h-row>
          <h-col span="12">
            <h-checkbox label="CG08" :disabled=true><span>贴现发起</span></h-checkbox>
          </h-col>
        </h-row>
      </h-checkbox-group>

    </h-panel>

    <div slot="footer">
      <h-button type="ghost" @click="acmtAuthListWinClose()">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import {accMul, formatNumber} from "@/api/bizApi/commonUtil";

  export default {
    name: "acmtAuthList",
    components: {
    },
    data() {
      return {}

    },
    props: {
      acmtAuthListWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      propAuthList: {
        type: Array,
        default: function () {
          return []
        }
      },

    },
    watch: {
    },
    computed: {
    },
    methods: {
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },

      acmtAuthListWinClose() {
        this.$emit("acmtAuthListWinClose", "");
      }

    }
  };
</script>

<style scoped>

</style>
