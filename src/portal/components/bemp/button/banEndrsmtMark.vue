<template>
  <h-form-item :label="$t('m.i.ce.isCommit')" prop="isCommit">
    <h-radio-group v-model="formItem['isCommit']">
      <h-radio label="noCommit" @on-click="noCommitButton">
        <span>{{$t('m.i.ce.noCommit')}}</span>
      </h-radio>
      <h-radio label="hasCommit" @on-click="hasCommitButton">
        <span>{{$t('m.i.ce.hasCommit')}}</span>
      </h-radio>
    </h-radio-group>
  </h-form-item>
</template>

<script>
    export default {
      name: "banEndrsmtMark",
      data() {
        return {

        }
      },
      props:{
        formItem : Object || {}
      },
      methods:{
        noCommitButton(){
          this.$emit('noCommitButton','');
        },
        hasCommitButton(){
          this.$emit('hasCommitButton','');
        },

      }
    }
</script>

