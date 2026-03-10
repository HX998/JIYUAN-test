<!--渠道信息-->
<template>
  <h-form-item :label="label" :prop="prop" :required="required">
    <h-select v-model="itemValue" :placeholder="placeholder" :showTitle="showTitle" :readonly="readonly"
              :clearable="clearable" @on-change="onChange" :setDefSelect="setDefSelect" :disabled="disabled" :multiple="multiple">
      <h-option v-for="item in channelList" :value="item[paramsMap.key]" :key="item[paramsMap.key]">{{item[paramsMap.value]}}</h-option>
    </h-select>
  </h-form-item>
</template>

<script>
  import { post} from "@/api/bizApi/commonUtil";
  export default {
    name: "channelSelect",
    data() {
      return {
        channelList: []
      }
    },
    props: {
      label: {
        type: String,
        default() {
          return this.$t("m.i.common.channelNameArray");
        }
      },
      prop: {
        type: String,
        default: "channelNo"
      },
      required: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
        default: ""
      },
      placeholder: {
        type: String,
        default: ""
      },
      readonly: {
        type: Boolean,
        default: false
      },
      showTitle: {
        type: Boolean,
        default: true
      },
      clearable: {
        type: Boolean,
        default: true
      },
      dictList: {
        type: Array,
        default() {
          return [];
        }
      },
      setDefSelect: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      paramsMap: {//查询获取下拉数据时对应的channelNo-channelName
        type: Object,
        default() {
          return { key: "channelNo", value: "channelName" };
        }
      },
      multiple: {
        type: Boolean,
        default: false
      },
      queryUrl: {
        type: String,
        default: "/ce/disc/elec/fastdisc/fdiscChannel/func_queryChannelSelect"
      },
      params: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    mounted() {
      if(this.dictList.length > 0) {
        this.channelList = this.dictList;
      } else {
        post(this.params, this.queryUrl).then(res => {
          if (res) {
            if (res.data.retCode === "000000") {
              this.channelList = res.data.retData;
            }
          }
        });
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
      onChange(val) {
        this.$emit("on-change", val);
      }
    }
  };
</script>
