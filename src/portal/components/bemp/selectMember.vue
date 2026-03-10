<!--查看会员信息-->
<template>
  <div>

    <common-input v-model="memberName" :label="$t('m.i.common.memberName')" @on-click="showMemberWin = true" :showIcon="true"
                  :required="required"
                  :readonly="readonly" :clearVal="clearVal" :clearValTag="clearValTag" :clearable="clearable" prop="memberName"></common-input>
    <member-id-search :memberIdWin="showMemberWin" @memberIdWinClose="memberWinClose" :formItem="memberFormItem"
                      @memberIdWinSubmit="memberSelect"></member-id-search>
  </div>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "selectMember",
    data() {
      return{
        showMemberWin : false
      }

    },
    components: {
      MemberIdSearch: () => import(/* webpackChunkName: "sm/auth/legalperson/memberIdSearch" */`@/views/bizViews/sm/auth/legalperson/memberIdSearch`)
    },
    props: {
      title: String,
      memberFormItem: {
        type: Object,
        default: {
          memberName: "",
          memberTypeCode : ""
        }
      },
      memberId: {
        type: String,
        default() {
          return "";
        }
      },
      memberName: {
        type: String,
        default() {
          return "";
        }
      },
      required:{
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      },
      clearable:{
        type: Boolean,
        default: true
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
    },
    methods: {
      queryMember() {
        this.showMemberWin = true;
      },
      memberWinClose() {
        this.showMemberWin = false;
      },
      async memberSelect(info) {
        this.$emit("update:memberId", info.memberId);
        this.$emit("update:memberName", info.memberName);
        this.showMemberWin = false;
      }
    }
  };
</script>

<style scoped>

</style>
