<!--出票日期-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required" :class="className">
    <h-date-picker v-model="itemValue" :readonly="readonly" :placeholder="placeholder" :type="type" :format="format"
                   :disabled="disabled" :placement="placement" :options="options" :showFormat="showFormat"
                   @on-change="onChange" :clearable="clearable" :editable="editable" @on-clear="clearVal(clearValTag)"
                   :autoPlacement="autoPlacement"></h-date-picker>
  </h-form-item>
</template>

<script>
  export default {
    name: "remitDtRange",
    props: {
      label: {
        type: String,
        default() {
          return this.$t("m.i.billInfo.remitDt");
        }
      },
      prop: {
        type: String,
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      },
      className: {
        type: String,
        default: ""
      },
      rangeValue: {//日期区间实际赋值对象
        type: Array,
        default() {
          return ["minRemitDt", "maxRemitDt"];
        }
      },
      value: {
        type: [Date, String, Array]
      },
      type: {
        type: String,
        default: "daterange"
      },
      placeholder: {
        type: String,
        default: ""
      },
      readonly: {
        type: Boolean,
        default: false
      },
      format: {
        type: String,
        default: "yyyy-MM-dd"
      },
      placement: {
        type: String,
        default: "bottom-start"
      },
      options: {
        type: Object
      },
      showFormat: {
        type: Boolean,
        default: true
      },
      clearable: {
        type: Boolean,
        default: true
      },
      editable: {
        type: Boolean,
        default: false
      },
      disabled: {
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
      autoPlacement: {
        type: Boolean,
        default: true
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
      onChange(date) {
        if (typeof date === "object" && this.rangeValue.length > 0) {
          if(this.type === "daterange" || this.type === "monthrange") {
            if (date && date.length >= 2) {
              this[this.rangeValue[0]] = date[0].replace(/-/g, "");
              this[this.rangeValue[1]] = date[1].replace(/-/g, "");
              this.itemValue = [date[0], date[1]];
            } else {
              this[this.rangeValue[0]] = "";
              this[this.rangeValue[1]] = "";
              this.itemValue = [];
            }
            this.$emit(`update:${this.rangeValue[0]}`, this[this.rangeValue[0]]);
            this.$emit(`update:${this.rangeValue[1]}`, this[this.rangeValue[1]]);
          }
        } else if (typeof date === "string") {
          if(this.type === "date" || this.type === "month") {
            this.itemValue = date.replace(/-/g, "");
          }
        }
        this.$emit("on-change", date);
      }
    }
  };
</script>
