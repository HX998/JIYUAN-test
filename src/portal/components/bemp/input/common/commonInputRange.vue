<template>
  <h-form-item :label="label" :prop="prop" :required="required" :class="className">
    <h-row>
      <h-col span="11">
        <common-input v-model="itemValue[rangeProps[0]]" :prop="rangeProps[0]" :icon="showIcon ? 'android-search' : ''"
                      :title="itemValue[rangeProps[0]]" :readonly="readonly"
                      :placeholder="placeholder" :type="type" @on-click="onClick()" @on-change="onChange" @on-blur="onBlur()"
                      :clearable="clearable" :filterRE="filterRE" :required="required"
                      @on-clear="clearVal(clearValTag)" :maxlength="maxlength" :rows="rows" :canResize="canResize"
                      style="width:100%"
                      :className="[{'h-range-required':required === true}, className]"></common-input>
      </h-col>
      <h-col span="2" style="text-align: center">-</h-col>
      <h-col span="11">
        <common-input v-model="itemValue[rangeProps[1]]" :prop="rangeProps[1]" :icon="showIcon ? 'android-search' : ''"
                      :title="itemValue[rangeProps[1]]" :readonly="readonly"
                      :placeholder="placeholder" :type="type" @on-click="onClick()" @on-change="onChange" @on-blur="onBlur()"
                      :clearable="clearable" :filterRE="filterRE" :required="required"
                      @on-clear="clearVal(clearValTag)" :maxlength="maxlength" :rows="rows" :canResize="canResize"
                      style="width:100%"
                      :className="[{'h-range-required':required === true}, className]"></common-input>
      </h-col>
    </h-row>
  </h-form-item>
</template>

<script>
  export default {
    name: "commonInputRange",
    props: {
      value: {
        type: [String, Object]
      },
      label: {
        type: String,
        default: ""
      },
      prop: {
        type: String,
        default: ""
      },
      rangeProps: {//区间框对应prop
        type: Array,
        default: []
      },
      type: {
        type: String,
        default: "money"
      },
      placeholder: {
        type: String,
        default: ""
      },
      clearable: {
        type: Boolean,
        default: false
      },
      clearVal: {
        type: Function,
        default() {
          return "";
        }
      },
      clearValTag: {
        type: String,
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      className: {
        type: String,
        default: ""
      },
      maxlength: {
        type: Number
      },
      rows: {
        type: Number,
        default: 2
      },
      canResize: {
        type: Boolean,
        default: false
      },
      showIcon: {
        type: Boolean,
        default: false
      },
      filterRE: {
        type: [Object, RegExp],
        default() {
          return /[^\w`·~!@#$%^……&*()-——_=+\[\]{}\\|;:'"’”,.<>/?‘’“”\s\u4e00-\u9fa5\uFF00-\uFFEF\u2E80-\u2EFF\u3000-\u303F\u31C0-\u31EF\u3200-\u32FF\uFE10-\uFE1F\uFE30-\uFE4F]/g
        }
      }
    },
    computed: {
      itemValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit("input", val);
        }
      }
    },
    methods: {
      onClick() {
        this.$emit("on-click", "");
      },
      onChange(event) {
        this.$emit("on-change", event);
      },
      onBlur(){
        this.$emit("on-blur", "");
      }
    }
  };
</script>

<style scoped>

</style>
