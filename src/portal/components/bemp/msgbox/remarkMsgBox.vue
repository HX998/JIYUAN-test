<template>
  <h-msg-box v-model="tempRemarkWin" width="400" :mask-closable="false" class="h-form-search-layer"
             @on-close="handleClose" :maximize="true">
    <p slot="header">
      <span>{{title}}</span>
    </p>
    <h-panel>
      <h-form :model="remarkForm" :label-width="90" ref="remarkForm" cols="1"
              class="h-form-search">
        <h-form-item :label="label" prop="remark" class="h-form-height-auto">
          <h-input type="textarea" :rows="3" v-model="remarkForm.remark" :maxlength="maxlength" :lengthByByte="false"></h-input>
        </h-form-item>
      </h-form>
    </h-panel>
    <div slot="footer">
      <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      <h-button type="primary" @click="remarkWinSubmit">{{$t("m.i.common.commit")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  export default {
    name: "remarkMsgBox",
    data(){
      return {
        remarkForm: {
          remark: "",
        },
        validRules: [{ test: this.validNote, trigger: "blur,change" }],
      }
    },
    props: {
      title: {
        type: String,
        default: "备注",
      },
      label: {
        type: String,
        default: "备注",
      },
      remarkWin: {
        type: Boolean,
        default: false,
      },
      maxlength: {
        type: Number,
        default: 150,
      },
      param: {
        type: Object,
      },
    },
    computed: {
      tempRemarkWin: {
        get() {
          return this.remarkWin;
        },
        set() {
        }
      }
    },
    watch: {
      remarkWin(val) {
        if (val) {
          this.remarkForm.remark = "";
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit("remarkWinClose", "");
      },
      remarkWinSubmit(){
        this.$emit("remarkWinSubmit", this.param, this.remarkForm.remark);
      }
    }
  }
</script>

<style scoped>

</style>
