<template>
  <h-msg-box
    v-model="tempFreeDraftView"
    @on-close="handleClose"
    width="400"
    class="h-form-search-layer"
    :maximize="true"
  >
    <p slot="header">
      <span>自由格式信息</span>
    </p>
    <h-panel>
      <div class="text-wrap">
        <div class="text-body">
          <h-row :gutter="16">
            <h-input :value="addOrEditForm.id" v-show="false"></h-input>
            <h-col span="25">
              <h-row>
                <h-col span="9" class="label">{{$t('m.i.common.msgId')}}:</h-col>
                <h-col span="15" class="val">{{addOrEditForm.msgId}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="25">
              <h-row>
                <h-col span="9" class="label">报文时间:</h-col>
                <h-col span="15" class="val">{{addOrEditForm.creDtTm}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="25">
              <h-row>
                <h-col span="9" class="label">发出会员名称:</h-col>
                <h-col span="15" class="val">{{addOrEditForm.applMemberName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="25">
              <h-row>
                <h-col span="9" class="label">发出机构名称:</h-col>
                <h-col span="15" class="val">{{addOrEditForm.applBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="25">
              <h-row>
                <h-col span="9" class="label">接收会员名称:</h-col>
                <h-col span="15" class="val">{{addOrEditForm.respMemberName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="25">
              <h-row>
                <h-col span="9" class="label">接收机构名称:</h-col>
                <h-col span="15" class="val">{{addOrEditForm.respBrchName}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="25">
              <h-row>
                <h-col span="9" class="label">正文:</h-col>
                <h-col span="15" class="val">{{addOrEditForm.content}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="25">
              <h-input
                v-model="addOrEditForm.attachId"
                :value="addOrEditForm.attachId"
                v-show="false"
              ></h-input>
              <h-row>
                <h-col span="9" class="label">附件:</h-col>
                <h-col span="15" class="val">
                  <a v-show="addOrEditForm.haveAttFile==='1'" @click="downloadFile">{{addOrEditForm.attachId}}</a>
                </h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
          <h-row :gutter="16">
            <h-col span="25">
              <h-row>
                <h-col span="9" class="label">处理结果:</h-col>
                <h-col span="15" class="val">{{addOrEditForm.errorMsg}}</h-col>
              </h-row>
            </h-col>
          </h-row>
          <br>
        </div>
      </div>
    </h-panel>
    <div slot="footer">
      <h-button type="primary" @click="handleClose()">{{$t("m.i.common.close")}}</h-button>
    </div>
  </h-msg-box>
</template>

<script>
  import { post } from "@/api/bizApi/commonUtil";

  export default {
    name: "freeDraftInfoView",
    data() {
      return {
        addOrEditForm: {
          id: "",
          msgId: "",
          creDtTm: "",
          applMemberId: "",
          applMemberName: "",
          applBrchCode: "",
          applBrchName: "",
          rcvMemberId: "",
          respMemberName: "",
          rcvBrchCode: "",
          respBrchName: "",
          content: "",
          attachId: "",
          haveAttFile: "",
          errorMsg: ""
        },
        addOrEditWin: false
      };
    },
    props: {
      freeDraftView: {
        type: Boolean,
        default() {
          return false;
        }
      },
      needInfoId: ""
    },
    watch: {
      freeDraftView(val) {
        if (val === true) {
          this.createForm();
        }
      }
    },
    computed: {
      tempFreeDraftView: {
        get() {
          return this.freeDraftView;
        },
        set() {
        }
      }
    },
    methods: {
      createForm() {
        if (null !== this.needInfoId) {
          post(
            { id: this.needInfoId },
            "/shcpe/cpes/freeDraftInfo/queryFreeDraftInfo"
          ).then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retData = res.data.retData;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.addOrEditForm.id = retData.id;
                this.addOrEditForm.msgId = retData.msgId;
                if (retData.createDtTm) {
                  this.addOrEditForm.creDtTm = this.$moment(
                    retData.createDtTm,
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("YYYY-MM-DD HH:mm:ss");
                }
                this.addOrEditForm.applMemberName = retData.applMemberName;
                this.addOrEditForm.applBrchName = retData.applBrchName;
                this.addOrEditForm.respMemberName = retData.respMemberName;
                this.addOrEditForm.respBrchName = retData.respBrchName;
                this.addOrEditForm.content = retData.content;
                this.addOrEditForm.attachId = retData.attachId;
                this.addOrEditForm.haveAttFile = retData.haveAttFile;
                this.addOrEditForm.errorMsg = retData.errorMsg;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      /*//确定
        submitForm() {
          this.$emit("freeDraftInfoWinSubmit", "");
        },*/
      //关闭
      handleClose() {
        this.$emit("freeDraftInfoWinClose", "");
      },
      downloadFile() {
        let url =
          window.LOCAL_CONFIG.API_HOME + "/shcpe/cpes/freeDraftInfo/download";
        let form = document.createElement("form");
        form.innerHTML = `<input type="text" name="attachId" value="${
          this.addOrEditForm.attachId
          }"/>`;
        form.setAttribute("id", "form1");
        form.setAttribute("action", url);
        form.setAttribute("method", "post");
        document.body.appendChild(form);
        document.getElementById("form1").submit();
        document.getElementById("form1").remove();
      }
    }
  };
</script>

<style scoped>
</style>
