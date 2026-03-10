<template>
  <div>
    <!--影像加载弹出框-->
    <h-msg-box v-model="tempImageWin" width="1000" :mask-closable="false" @on-close="handleClose"
               class="h-form-table-layer" :maximize="true" top="10" @on-maximize="onMaximize" :z-index=1001>
      <p slot="header">
        <span>{{title}}</span>
      </p>
      <!--查询表单-->
      <div>
        <h-form v-if="showMain" :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
          <h-form-item prop="imgType" :label="$t('m.i.common.imgType')" v-if="isShow">
            <h-select v-model="formItem.imgType" placeholder="" :readonly="isReadonly">
              <h-option v-for="item in this.imageTypeList" :value="item.key" :key="item.key" >{{ item.value }}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate one-form">
            <h-button v-if="isShowSearch" type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
            <h-button v-if="isShowReset" type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
          </h-form-item>
        </h-form>

        <h-form v-if="showAcptSearch" :model="formItem" :label-width="100" ref="formItem" cols="4" class="h-form-search">
          <h-form-item :label="$t('m.i.common.imgType')" prop="imgType">
            <h-select v-model="formItem.imgType"  placeholder="" @on-change="imgTypeOnChange" :clearable="false">
              <h-option value="IM01" key="IM01">{{$t('m.i.ce.acptFront')}}</h-option>
              <h-option value="IM07" key="IM07">{{$t('m.i.ce.supplementImg')}}</h-option>
            </h-select>
          </h-form-item>
          <h-form-item class="h-form-operate one-form">
            <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
          </h-form-item>
        </h-form>

      </div>
      <!--数据展示表格-->
      <h-datagrid
        :columns="columns"
        hasPage
        highlight-row
        :url="imageParams.imageUrl"
        :bindForm="formItem"
        :hasSelect="false"
        rowSelect
        showListCkeckBox
        :autoLoad=false
        ref="datagrid">
        <div slot="toolbar" class='pull-left'>
          <h-button type="primary" @click="imageAddClick()" v-if="authObj.imageAdd" :disabled="isDisabled">{{$t("m.i.common.imageAdd")}}
          </h-button>
          <h-button type="primary" @click="imageOperateClick('register')" v-if="authObj.imageRegister" :disabled="isDisabled">
            {{$t("m.i.common.register")}}
          </h-button>
          <h-button type="primary" @click="imageOperateClick('delete')" v-if="authObj.imageDelete" :disabled="isDisabled">
            {{$t("m.i.common.delete")}}
          </h-button>
          <h-button type="primary" @click="openImgPlatform" v-if="showSyncButton" :disabled="isDisabled">影像平台上传</h-button>
          <h-button type="primary" @click="syncImgae" v-if="showSyncButton" :disabled="isDisabled">同步</h-button>
        </div>
      </h-datagrid>
      <!-- 弹出框模式底部按钮 -->
      <div slot="footer">
        <h-button type="ghost" @click="handleClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <!-- 影像文件导入弹出框-->
    <h-msg-box :title="title" v-model="importWin" :mask-closable="false" class="h-form-search-layer" height="150"
               :footerHide="true"  :z-index=1002>
      <h-upload :action="imgUploadUrl"
                :data="formItem"
                :format="format"
                :max-size="maxSize"
                :with-credentials="true"
                :on-format-error="handleFormatError"
                :on-progress="handleProgress"
                :on-exceeded-size="handleMaxSize"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-remove="handleRemove"
                :before-upload="beforeUpload"
                @on-goto-add="uploadGotoAdd"
                ref="upload"
                selfConfig
                uploadAll
                :class="{'h-upload-goto-add': imgDataFirst}">
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="chooseFile" v-if="importSelect">{{$t("m.i.common.chooseImportFile")}}</h-button>
        <h-button type="primary" icon="ios-cloud-upload-outline" slot="postFile" v-if="!importSelect"
                  :disabled="isDisabled">{{tip}}
        </h-button>
      </h-upload>
    </h-msg-box>
    <show-image title="影像查看" :carousel-form="carouselForm" :carousel-data="carouselData"></show-image>
  </div>
</template>

<script>
  import { post, on, off ,getUploadImgType,getDictValueFromMap} from "@/api/bizApi/commonUtil";

  export default {
    name: "imageLoading",
    data() {
      return {
        image_mode:"",
        showImgPlatWin:false,
        imageTypeList:[],
        formItem: {
          billNo: "",
          imgBusiType: "",
          imgType: this.imageParams.imgType,
          cfmAppRefuseCode: "",
          id:"",
          prodNo:this.imageParams.prodNo,
          busiBatchId: "",
          listId: "",
          discId:"",
          isLock:"",
          acptId:"",
          busiType:"",
          uploadType:this.imageParams.uploadType,
          licenseFlag :this.imageParams.licenseFlag,
          ownedBrchNo :this.imageParams.ownedBrchNo
        },
        columns: [
          {
            type: "selection",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: "id",
            key: "id",
            hiddenCol: true
          },
          {
            title: this.$t("m.i.common.imgBatchNo"),
            key: "imgBatchNo",
            hiddenCol: !this.isShowImgBatchNo,
            ellipsis: false
          },
          {
            title: this.$t('m.i.billInfo.billOrigin'),
            key: 'billOrigin',
            hiddenCol: !this.isShowBillRange,
            render: (h, params) => {
              let dictValue = (!params.row.billOrigin || params.row.billOrigin === 'CS00') ? '-' : getDictValueFromMap(this.dictMap, 'BillOrigin', params.row.billOrigin);
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: this.isShowBillRange?this.isShowBillRange:!this.isShowBillNo
          },
          {
            title: this.$t("m.i.billInfo.billPackageNo"),
            key: "billNo",
            ellipsis: false,
            hiddenCol: !this.isShowBillRange
          },
          {
            title: this.$t('m.i.billInfo.billRange'),
            key: 'billRange',
            hiddenCol: !this.isShowBillRange,
            render: (h, params) => {
              let dictValue = !params.row.billRange  ? '-' :params.row.billRange;
              return h("span", {
                domProps: {
                  title: dictValue
                }
              }, dictValue);
            }
          },
          {
            title: this.$t("m.i.ce.ImgFileName"),
            key: "fileName",
            hiddenCol: !this.isShowImgFileName
          },
          {
            title: this.$t("m.i.common.imgType"),
            key: "imgType",
            hiddenCol: false,
            ellipsis: false,
            render: (h, params) => {
              let list = [];
              if (params.row.imgType === "SIT1" || params.row.imgType === "SIT2" || params.row.imgType === "SIT3" || params.row.imgType === "SIT4") {
                list = this.getDictValueFromMap(this.dictMap, "SspdImageType", params.row.imgType);
              } else if (params.row.imgType === "RIT1" || params.row.imgType === "RIT2" || params.row.imgType === "RIT3" || params.row.imgType === "RIT4") {
                list = this.getDictValueFromMap(this.dictMap, "RelieveImageType", params.row.imgType);
              } else {
                list = this.getDictValueFromMap(this.dictMap, "ImgType", params.row.imgType);
              }
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.status"),
            key: "applStatus",
            hiddenCol: !this.isShowApplStatus,
            ellipsis: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "ImgStatus", params.row.applStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t('m.i.common.status'),
            key: "imgStatus",
            hiddenCol: !this.isShowImgStatus,
            render: (h, params) => {
              return h("span", this.getDictValueFromMap(this.dictMap,"ImgStatus",params.row.imgStatus));
            }
          },
          {
            title: this.$t("m.i.ce.uploadDt"),
            key: "uploadDt",
            hiddenCol: !this.isShowUploadDt,
            render: (h, params) => {
              if (params.row.uploadDt == null || params.row.uploadDt === "") {
                return "";
              }
              let uploadDt = this.$moment(params.row.uploadDt, "YYYYMMDD").format("YYYY-MM-DD");
              return h("span", uploadDt);
            }
          }, {
            title: this.$t("m.i.common.operTellerNo"),
            key: "operTellerNo",
            hiddenCol: !this.isShowOperTellerNo,
          },
          {
            title: this.$t("m.i.common.result"),
            key: "dealPrcMsg",
            hiddenCol: !this.isShowDealPrcMsg
          },
          {
            title: this.$t("m.i.common.failReason"),
            key: "errorMsg",
            hiddenCol: !this.isShowErrorMsg
          },
          {
            title: this.$t("m.i.common.showImg"),
            key: "showImg",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    if(this.imageParams.isByAttachId === true){
                      this.showImage(params.row.attachId);
                    }else {
                      this.showImage(params.row.id);
                    }
                  }
                }
              }, this.$t('m.i.common.view'));
            }
          }
        ],
        importWin: false,
        importSelect: true,
        imgDataFirst: false,
        isDisabled: false,
        dictMap: new Map(),
        imgUploadUrl:window.LOCAL_CONFIG.API_HOME + this.imageParams.imageUploadUrl,
        // 影像控件弹框轮播图数据url
        carouselData: {
          imgUrls: []
        },
        // 影像控件弹框轮播图表单
        carouselForm: {
          initialIndex: 0,    //初始图片位置
          showDialog: false,    //控制影像控件显隐
          tags: []          //图片提示
        },
        imgPlatformUrl:"/pc/img/imgUpRegister/func_uploadImgUrl",
        autoSyncImg:false,
        imgSyncUrl:"/pc/img/imgUpRegister/func_syncImgFromImgPlatform",
        winObj:null
      };
    },
    props: {
      format:{
        type:Array,
        default() {
          return ['jpg','JPG'];
        }
      },
      maxSize:{
        type:Number,
        default:512
      },
      showImgPlat:{
        type:Boolean,
        default:false
      },
      showAcptSearch: {
        type:Boolean,
        default: false
      },
      showMain: {
        type:Boolean,
        default: true
      },
      isShowDealPrcMsg: {
        type:Boolean,
        default: true
      },
      isShowErrorMsg: {
        type:Boolean,
        default: false
      },
      isShowImgStatus: {
        type:Boolean,
        default: false
      },
      isShowUploadDt: {
        type:Boolean,
        default: false
      },
      isShowImgFileName: {
        type:Boolean,
        default: false
      },
      isShowOperTellerNo: {
        type:Boolean,
        default: false
      },
      isShowApplStatus: {
        type:Boolean,
        default: true
      },
      isShowImgBatchNo: {
        type:Boolean,
        default: true
      },
      isShowBillNo:{
        type:Boolean,
        default: true
      },
      isShow: {
        type:Boolean,
        default: true
      },
      isShowReset:{
        type:Boolean,
        default: true
      },
      isShowSearch:{
        type:Boolean,
        default: true
      },
      couldDel:{
        type:Boolean,
        default: true
      },
      isReadonly:{
        type:Boolean,
        default: false
      },
      authObj: {
        type: Object,
        default() {
          return {
            imageAdd: true,           //影像新增
            imageRegister: true,      //登记
            imageDelete: true         //删除
          };
        }
      },
      imageWin: {
        type: Boolean,
        default() {
          return false;
        }
      },
      title: {
        type: String,
        default: "影像加载"
      },
      imageParams: {
        type: Object,
        default() {
          return {
            imgTypeList: [],//影像类型数据字典
            id:"",
            imgType:"",
            billNo: "",
            prodNo:"",
            imgBusiType: "",
            cfmAppRefuseCode: "",
            busiBatchId: "",
            listId: "",
            type: "",
            discId:"",
            isLock:"",
            isByAttachId:"",
            acptId:"",
            imageUrl:"", //查询可查看影像url
            imageUploadUrl:"", //影像上传url
            imageRegisterUrl:"", //影像登记url
            imageDeleteUrl:"", //影像删除url
            imgShowUrl:"", //查看影像url
            uploadType: "",
            licenseFlag :false,
            ownedBrchNo :"",
          };
        }
      },
      isShowBillRange:{
        type:Boolean,
        default: false
      },
    },
    comments: {},
    watch: {
      imageWin(val) {
        if (val === true) {
          this.$nextTick(() => {
            this.$refs.formItem.resetFields();
            if(this.imageParams.billNo !== null && this.imageParams.billNo !== undefined){
              this.formItem.billNo = this.imageParams.billNo;
            }
            if(this.imageParams.imgBusiType !== null && this.imageParams.imgBusiType !== undefined){
              this.formItem.imgBusiType = this.imageParams.imgBusiType;
            }
            if(this.imageParams.cfmAppRefuseCode !== null && this.imageParams.cfmAppRefuseCode !== undefined){
              this.formItem.cfmAppRefuseCode = this.imageParams.cfmAppRefuseCode;
            }
            if(this.imageParams.isLock !== null && this.imageParams.isLock !== undefined){
              this.formItem.isLock = this.imageParams.isLock;
            }
            if(this.imageParams.id !== null && this.imageParams.id !== undefined){
              this.formItem.id = this.imageParams.id;
            }
            if(this.imageParams.imgType !== null && this.imageParams.imgType !== undefined){
              this.formItem.imgType = this.imageParams.imgType;
            }else {
              this.formItem.imgType = "";
            }
            if(this.imageParams.prodNo !== null && this.imageParams.prodNo !== undefined){
              this.formItem.prodNo = this.imageParams.prodNo;
            }else {
              this.formItem.prodNo = "";
            }
            if(this.imageParams.listId !== null && this.imageParams.listId !== undefined){
              this.formItem.listId = this.imageParams.listId;
            }
            if(this.imageParams.busiBatchId !== null && this.imageParams.busiBatchId !== undefined){
              this.formItem.busiBatchId = this.imageParams.busiBatchId;
            }
            if(this.imageParams.discId !== null && this.imageParams.discId !== undefined){
              this.formItem.discId = this.imageParams.discId;
            }
            if(this.imageParams.acptId !== null && this.imageParams.acptId !== undefined){
              this.formItem.acptId = this.imageParams.acptId;
            }
            if (this.imageParams.busiType!=null&&this.imageParams.busiType !== undefined){
              this.formItem.busiType = this.imageParams.busiType;
            }
            if(this.imageParams.uploadType !== null && this.imageParams.uploadType !== undefined){
              this.formItem.uploadType = this.imageParams.uploadType;
            }else {
              this.formItem.uploadType = "";
            }
            if(this.imageParams.licenseFlag !== null && this.imageParams.licenseFlag !== undefined){
              this.formItem.licenseFlag = this.imageParams.licenseFlag;
            }else {
              this.formItem.licenseFlag = false;
            }
            if(this.imageParams.ownedBrchNo !== null && this.imageParams.ownedBrchNo !== undefined){
              this.formItem.ownedBrchNo = this.imageParams.ownedBrchNo;
            }else {
              this.formItem.ownedBrchNo = "";
            }
            this.$refs.datagrid.$refs.gridPage.clearElevator();
            this.formSearch();
          });
          this.isDisabled = false;
          this.imageTypeList = this.imageParams.imgTypeList;
        }
      },
      imgDataFirst(val) {
        this.importSelect = !this.importSelect;
      }
    },
    computed: {
      tempImageWin: {
        get() {
          return this.imageWin;
        },
        set() {
        }
      },
      tip() {
        return this.isDisabled ? "文件正在上传中..." : "提交";
      },
      showSyncButton:{
        get(){
          let flag= this.imageParams.busiType!=null&&this.imageParams.busiType !== undefined
          return this.showImgPlatWin&&flag&&this.showImgPlat
        },
        set(){

        }
      }
    },
    methods: {
      openImgPlatform(){
        let list = [];
        let imgTypeList=this.imageParams.imgTypeList;
        if (imgTypeList instanceof Array){
          let arr=this.imageParams.imgTypeList
          for (let i = 0; i < arr.length; i++) {
            list.push(arr[i].key);
          }
        }
        if (imgTypeList == undefined||imgTypeList==null||imgTypeList.length==0){
          list.push(this.imageParams.imgType)
        }
        if (this.showAcptSearch){
            list.push("IM01");
            list.push("IM07");
        }
        if (this.image_mode==='1'){
          post({busiType:this.imageParams.busiType,imageTypeList:Array.from(new Set(list)),
            listId:this.formItem.listId, imgBusiType:this.formItem.imgBusiType}, this.imgPlatformUrl).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$nextTick(()=>{
                  this.autoSyncImg=res.data.retData.auto==="1"?true:false;
                })
                this.winObj=window.open(res.data.retData.url, 'height=500, width=500, top=100, left=250, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes, location=yes, status=no')
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        }
      },
      imgTypeOnChange() {
        this.isDisabled = this.formItem.imgType === "IM01";
        this.formSearch();
      },
      formSearch() {
        this.$refs.datagrid.dataChange(1);
        /**清除多页选择的数据*/
        this.$refs.datagrid.selectIds=[];
        this.$refs.datagrid.selects=[];
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      //影像新增
      imageAddClick() {
        if (this.formItem.imgType !== "" && this.formItem.imgType !== undefined) {
          this.imgDataFirst = false;
          this.importWin = true;
          this.$nextTick(() => {
            this.$refs.upload.clearFiles();
          });
        } else {
          this.$msgTip.info(this, { info: "请先选择影像类型" });
        }
      },
      //影像登记/删除
      imageOperateClick(str) {
        if (str === "register") {
        let list = this.$refs.datagrid.selects;
        for (let i = 0; i < list.length; i++) {
          if (list[i].imgStatus === 'BTL03' || list[i].imgStatus === 'BTL04') {
            this.$msgTip.info(this, {info: "当前票据影像上传中或上传成功，不允许再次登记"});
            return;
          }
        }
        for (let i = 0; i < list.length; i++) {
            if (list[i].applStatus === 'BTL03' || list[i].applStatus === 'BTL04') {
              this.$msgTip.info(this, {info: "当前票据影像上传中或上传成功，不允许再次登记"});
              return;
            }
        }
       }
       if(str === "delete"){
         if(!this.couldDel){
           let delectList = this.$refs.datagrid.selects;
           for (let i = 0; i < delectList.length; i++) {
             if (delectList[i].imgStatus === 'BTL03' || delectList[i].imgStatus === 'BTL04') {
               this.$msgTip.info(this, {info: "当前票据影像上传中或上传成功，不允许删除"});
               return;
             }
           }
           for (let i = 0; i < delectList.length; i++) {
             if (delectList[i].applStatus === 'BTL03' || delectList[i].applStatus === 'BTL04') {
               this.$msgTip.info(this, {info: "当前票据影像上传中或上传成功，不允许删除"});
               return;
             }
           }
         }
       }
        if (this.$refs.datagrid.selects != null && this.$refs.datagrid.selects.length > 0) {
          let url = str === "register" ? this.imageParams.imageRegisterUrl : this.imageParams.imageDeleteUrl;
          let title = str === "register" ? "登记影像信息" : "删除影像信息";
          let content = str === "register" ? "确定要登记吗?" : "确定要删除吗?";
          this.$hMsgBox.confirm({
            title: title,
            content: content,
            zIndex: "1003",
            onOk: () => {
              this.handleOperate(url);
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseAtLeastOneRecord") });
        }
      },
      handleOperate(url) {
        let ids = this.formateidsData(this.$refs.datagrid.selects);
        let discIds = this.formateidsData2(this.$refs.datagrid.selects);
        if (discIds !== null && discIds.length > 0) {
          post({ ids:ids , discIds: discIds}, url).then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$refs.datagrid.dataChange(1);
                /**清除多页选择的数据*/
                this.$refs.datagrid.selectIds = [];
                this.$refs.datagrid.selects = [];
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
        post({ code: ids }, url).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$refs.datagrid.dataChange(1);
              /**清除多页选择的数据*/
              this.$refs.datagrid.selectIds=[];
              this.$refs.datagrid.selects=[];
            } else {
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
       }
      },
      onMaximize() {
        setTimeout(() => {
          this.$refs.datagrid.$refs.gridContent.handleResize();
        }, 100);
      },
      formateidsData(list) {
        let ids = [];
        for (let i = 0, len = list.length; i < len; i++) {
          ids.push(list[i].id);
        }
        return ids.join(",");
      },
      formateidsData2(list) {
        let discIds = [];
        for (let i = 0, len = list.length; i < len; i++) {
          if(list[i].discId !== null && list[i].discId !== "" && list[i].discId !== undefined) {
            discIds.push(list[i].discId);
          }
        }
        if(discIds.length>0 && discIds !== null && discIds[0] !== undefined
          && discIds[0] !== null && discIds[0] !== "") {
          return discIds.join(",");
        }else {
          return discIds;
        }
      },
      handleClose() {
        this.formSearchReset();
        this.imageTypeList = [];
        this.imageParams.imgTypeList = [];
        this.$emit("imageWinClose", "");
      },
      handleFormatError(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 格式不正确，请上传"+this.format.toString()+"格式的图片" });
      },
      handleProgress() {
        this.isDisabled = true;
      },
      beforeUpload(file){
        if(file.size==0){
          this.$msgTip.error(this, { info: "文件 " + file.name + "大小为 0KB，不能上传0KB的图片" });
          return false;
        }
      },
      handleMaxSize(file) {
        this.$msgTip.error(this, { info: "文件 " + file.name + " 太大，不能超过"+this.maxSize+"KB" });
      },
      uploadSuccess(response, file) {
        let retCode = response.retCode;
        if (retCode === "000000") {
          this.$msgTip.success(this, { info: file.name + "上传成功" });
          this.importWin = false;
          this.$refs.datagrid.dataChange(1);
        } else {
          this.imgDataFirst = false;
          this.$refs.upload.clearFiles();
          this.$msgTip.error(this, { info: "文件上传失败:" + response.retMsg });
        }
        this.isDisabled = false;
      },
      uploadError(error, file) {
        this.$msgTip.error(this, { info: file.name + "上传失败" });
        this.imgDataFirst = false;
        this.isDisabled = false;
      },
      handleRemove(file) {
        this.$msgTip.success(this, { info: file.name + "已移除" });
        this.imgDataFirst = false;
        this.isDisabled = false;
      },
      //文件列表加入第一条数据时返回true，非第一条数据则不触发事件
      uploadGotoAdd(status) {
        this.imgDataFirst = status;
      },
      //查看影像
      showImage(id) {
        let list = this.$refs.datagrid.$data.tData;
        let initialIndex = 0;
        let preUrl = window.LOCAL_CONFIG.API_HOME + this.imageParams.imgShowUrl;
        this.carouselData.imgUrls = [];
        for (let i = 0; i < list.length; i++) {
          if (this.imageParams.isByAttachId === true) {
            this.carouselData.imgUrls.push(preUrl + list[i].attachId);
            if (id === list[i].attachId) {
              initialIndex = i;
            }
          }else {
            this.carouselData.imgUrls.push(preUrl + list[i].id);
            if (id === list[i].id) {
              initialIndex = i;
            }
          }
        }
        setTimeout(() => {
          this.carouselForm.showDialog = true;
          this.carouselForm.initialIndex = initialIndex;
        }, 100);
      },
      //同步影像
      syncImgae(){
        post(this.formItem, this.imgSyncUrl).then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.info(this, {info: res.data.retMsg});
              this.$nextTick(()=>{
                this.formSearch();
              })
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
    },
    mounted() {
      this.getDictListByGroups("ImgType,SspdImageType,RelieveImageType,ImgStatus,BillOrigin").then(res => {
        this.dictMap = res.get("map");
      });
      let that=this;
      getUploadImgType("pc.img.is_use_image_platform").then(res=>{
        this.$nextTick(()=>{
          that.image_mode=res['value'];
          if (that.image_mode==='1'){
            that.showImgPlatWin = true;
            if (that.timer) {
              clearInterval(that.timer);
            } else {
              that.timer = setInterval(() => {
                if (that.winObj != null && that.winObj.closed) {
                  that.winObj = null
                  //自动进行影像同步
                  if (that.autoSyncImg){
                    that.syncImgae();
                  } ;
                }
              }, 1000);
            }
          }else {
            that.showImgPlatWin=false;
          }
        })
      });
    },
    beforeDestroy() {
      if(this.timer){
        clearInterval(this.timer);
      }
    }
  };
</script>

<style type="text/css" scoped>
  .h-upload-goto-add.h-upload {
    position: relative;
    padding-bottom: 50px;
  }

  .h-upload-goto-add .h-upload-self {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
