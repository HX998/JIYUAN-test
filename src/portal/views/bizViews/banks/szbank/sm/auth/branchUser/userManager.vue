<style>

</style>
<!--角色设置-->
<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <!--查询表单-->
          <div class="h-form-search-box">
            <h-panel class="clearfix" :class="{'h-form-overhd':!ifShowMore}">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <show-branch
                  v-model="formItem.ownedBrchNames" :label="$t('m.i.common.ownedBrchNo')"
                  prop="ownedBrchNames"
                  v-if="licenseFlag" :showCheckBox="true" :brchNo.sync="formItem.ownedBrchNos" :brchName.sync="formItem.ownedBrchNames"
                  :params="{authPath:this.$route.path}"
                  url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
                  queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike">
                </show-branch>
                <h-form-item :label="$t('m.i.common.userNo')" prop="userNo">
                  <h-input v-model="formItem.userNo" :maxlength="20"></h-input>
                </h-form-item>
                <!--<h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo">
                  <h-input v-model="formItem.brchNo" readonly icon="android-search"
                           @on-click="queryBrchNo('query')"></h-input>
                </h-form-item>-->
                <show-branch v-model="formItem.brchName"  :label="$t('m.i.common.brchName')"  prop="brchName"
                             :showCheckBox="false" :brchNo.sync="formItem.brchNo"    :brchName.sync="formItem.brchName"></show-branch>
                <h-form-item prop="bindTrader" :label="$t('m.i.auth.isBindTrader')" :label-width="96" class="h-form-radio">
                  <h-select v-model="formItem.bindTrader" placeholder="">
                    <h-option value="1">是</h-option>
                    <h-option value="0">否</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item prop="userName" :label="$t('m.i.common.userName')">
                  <h-input v-model="formItem.userName" :maxlength="16"></h-input>
                </h-form-item>
                <h-form-item :label="$t('m.i.auth.loginStatus')" prop="loginStatus">
                  <h-select v-model="formItem.loginStatus" placeholder="">
                    <h-option value="1">在线</h-option>
                    <h-option value="0">离线</h-option>
                  </h-select>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}<i class="icon iconfont"
                                                                                                                   :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                  <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格-->
          <h-datagrid :columns="columns" url="/sm/auth/branchUser/userManager/func_getBranchUserList" :bindForm="formItem" highlightRow
                      :onCurrentChange="handlelRowClick" :onCurrentChangeCancel='cancelSel' ref="datagrid">
            <div slot="toolbar" class='pull-left'>
              <h-button type="primary" @click="handleAddForm('syncUser')" v-if="this.btnAuth.syncUser === undefined ? true : this.btnAuth.syncUser.isShow">{{$t("m.i.common.synch")}}</h-button>
              <h-button type="primary" @click="handleAddForm('add')"> {{$t("m.i.common.add")}}</h-button>
              <h-button type="primary" @click="handleAddForm('modify')">{{$t("m.i.common.modify")}}</h-button>
              <h-button type="primary" @click="handleComfirm()">{{$t("m.i.common.delete")}}</h-button>
              <h-button type="primary" @click="resetPwd()">{{$t("m.i.common.pwdReset")}}</h-button>
              <h-button type="primary" @click="roleDistribute()">{{$t("m.i.auth.roleDistribute")}}</h-button>
              <h-button type="primary" @click="showMenu()">{{$t("m.i.auth.showAdminMenu")}}</h-button>
              <h-button type="primary" @click="handleStatus()">{{$t("m.i.common.userStatus")}}</h-button>
              <h-button type="primary" @click="handleOffLine()">{{$t("m.i.auth.dropUser")}}</h-button>
              <h-button type="primary" @click="handleTrader()">{{$t('m.i.auth.bindTrader')}}</h-button>
              <h-button type="primary" @click="queryHist()">{{$t('m.i.auth.queryUserHist')}}</h-button>
              <h-button type="primary" @click="defalutTrader()"  v-if="this.btnAuth.defalutUserBtn === undefined ? true : this.btnAuth.defalutUserBtn.isShow">{{$t('m.i.auth.defalutTrader')}}</h-button>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <!--点击新增/修改弹出窗-->
    <h-msg-box v-model="addOrEditWin" width="800" :maximize="true" @on-close="handleWinClose">
      <p slot="header">
        <span v-if="type=='add'">新增机构柜员</span>
        <span v-if="type=='modify'">修改机构柜员</span>
        <span v-if="type=='view'">查看机构柜员</span>
        <span v-if="type==='syncUser'">同步柜员</span>
      </p>
      <h-panel>
        <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search">
          <show-branch
            v-model="addForm.ownedBrchName" :label="$t('m.i.common.ownedBrchNo')"
            prop="ownedBrchName" required
            v-if="licenseFlag&&type!=='modify'" :showCheckBox="false" :msgBoxWin="addOrEditWin" :brchNo.sync="addForm.ownedBrchNo" :brchName.sync="addForm.ownedBrchName"
            :params="{authPath:this.$route.path}"
            url="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTree"
            queryUrl="sm/auth/licenseBrch/focusOper/func_queryLicenseBrchTreeByBrchNameLike"
          >
          </show-branch>
          <h-form-item :label="$t('m.i.common.userNo')" prop="userNo" :required="isRequired" :validRules="userNoRule">
            <div v-if="type!=='syncUser'">
              <h-input v-if="type=='modify'" readonly :value="addForm.userNo" :title="addForm.userNo"></h-input>
              <h-input v-else v-model="addForm.userNo" :maxlength=20></h-input>
            </div>
            <h-row v-if="type==='syncUser'">
              <h-col span="17">
                <h-input v-model="addForm.userNo" :maxlength="20"></h-input>
              </h-col>
              <h-col span="5" offset="1">
                <h-button type="primary" @click="syncUser()">{{$t("m.i.common.synch")}}</h-button>
              </h-col>
            </h-row>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.userName')" prop="userName" :required="isRequired">
            <h-input v-if="type=='view'" :value="addForm.userName" userName class="input-boder-0"
                     :title="addForm.userName"></h-input>
            <h-input v-else v-model="addForm.userName" :maxlength=16></h-input>
          </h-form-item>

          <!--    <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo" :required="isRequired">
                <h-input v-if="type=='modify'" :value="addForm.brchNo" readonly :title="addForm.brchNo"></h-input>
                <h-input v-else v-model="addForm.brchNo" readonly icon="android-search"
                         @on-click="queryBrchNo('add')"></h-input>
              </h-form-item>-->

          <show-branch v-model="addForm.brchNo"  :label="$t('m.i.common.brchNo')"  showValue prop="brchNo" :required="isRequired"
                       :filterable="(type==='add'||type==='syncUser'||type==='modify')&&isCurBrchNo"   :showCheckBox="false"  :brchNo.sync="addForm.brchNo" :brchName.sync="addForm.brchName"   :msgBoxWin ="addOrEditWin"
                       :showIcon="showIcon" :readonly="brchNoReadonly"></show-branch>
          <h-form-item :label="$t('m.i.common.brchName')" prop="brchName" :required="isRequired">
            <h-input :value="addForm.brchName"  readonly :placeholder="''"></h-input>
          </h-form-item>
          <!-- <h-form-item :label="$t('m.i.common.brchName')" prop="brchName">
             <h-input v-if="type=='view'" :value="addForm.brchName" readonly class="input-boder-0"
                      :title="addForm.roleOrder"></h-input>
             <h-input v-else v-model="addForm.brchName" readonly></h-input>
           </h-form-item>-->
          <h-form-item :label="$t('m.i.common.isSingleSign')" prop="reserve2" :required="isRequired">
            <h-select v-model="addForm.reserve2" placeholder="请选择" >
              <h-option v-for="item in singleSignList" :value="item.key" :key="item.key">{{item.value }}
              </h-option>
            </h-select>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.phone')" prop="phoneNo" :validRules="phoneNoRule">
            <h-input v-model="addForm.phoneNo" placeholder="区号-号码/11位手机号" :maxlength="13"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.email')" prop="email">
            <h-input v-model="addForm.email" :maxlength=75 placeholder="柜员只有一个邮箱地址，最大长度为75"></h-input>
          </h-form-item>
          <h-form-item :label="$t('m.i.common.remark')" prop="userRemark" style="height:72px;">
            <h-input v-if="type=='view'" type="textarea" :value="addForm.userRemark" readonly class="input-boder-0"
                     :title="addForm.userRemark" :canResize="false"></h-input>
            <h-input v-else v-model="addForm.userRemark" type="textarea" :maxlength="256" :canResize="false"></h-input>
          </h-form-item>
        </h-form>
      </h-panel>
      <div slot="footer" v-if="type!='view'">
        <h-button type="ghost" style="margin:0 8px" @click="handleWinClose">{{$t("m.i.common.close")}}
        </h-button>
        <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
        <h-button type="primary" v-else @click="submitForm()">{{$t("m.i.common.commit")}}</h-button>

      </div>
      <div slot="footer" v-else>
        <h-button type="primary" @click="handleWinClose">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <h-msg-box v-model="userHistWin" width="1000" :maximize="true">
      <p slot="header">
        <span>柜员历史查询</span>
      </p>
      <h-panel>
        <h-row>
          <h-col span="24">
            <h-datagrid :columns="histColumns" :bindForm="formItem" :gridData="histData"
                        @on-page-change="handleHistPage"
                        ref="datagrid1" class="pl-0 pr-0">
            </h-datagrid>
          </h-col>
        </h-row>
      </h-panel>
      <div slot="footer">
        <h-button type="ghost" @click="userHistWin=!userHistWin">{{$t("m.i.common.close")}}</h-button>
      </div>
    </h-msg-box>
    <h-msg-box v-model="userTraderWin" width="1000" @on-close="handleTraderClose" :maximize="true">
      <p slot="header">
        <span>交易员查询</span>
      </p>
      <div class="h-form-search">
        <h-form :model="traderForm" :label-width="100" ref="traderForm" cols="4">
          <div class="pl-0 pr-0">
            <h-form-item :label="$t('m.i.common.traderId')" prop="traderId">
              <h-input v-model="traderForm.traderId" placeholder="" :maxlength="12"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.traderName')" prop="traderName">
              <h-input v-model="traderForm.traderName" placeholder="" :maxlength="150"></h-input>
            </h-form-item>
            <h-form-item :label="$t('m.i.common.userType')" prop="traderType">
              <h-select v-model="traderForm.traderType" placeholder="">
                <h-option value="UT01">场务管理员</h-option>
                <h-option value="UT02">场务操作员</h-option>
                <h-option value="UT03">机构管理员</h-option>
                <h-option value="UT04">机构操作员</h-option>
              </h-select>
            </h-form-item>
            <h-form-item class="no-label">
              <h-button type="primary" @click="traderSearch()">{{$t("m.i.common.search")}}</h-button>
              <h-button type="ghost" @click="traderSearchReset()">{{$t("m.i.common.reset")}}</h-button>
            </h-form-item>
          </div>
        </h-form>

        <h-datagrid :columns="traderColumns" highlight-row :bindForm="traderForm" :gridData="traderData"
                    :onCurrentChange="traderRowClick" :onCurrentChangeCancel='cancelTradSel'
                    @on-page-change="handleTradePage" :showListCkeckBox="false"
                    ref="datagrid2" class="pl-0 pr-0">
        </h-datagrid>

      </div>
      <div slot="footer">
        <h-button type="ghost" @click="userTraderWin=!userTraderWin">{{$t("m.i.common.close")}}</h-button>
        <h-button type="primary" @click="submitTrader()">{{$t("m.i.common.commit")}}</h-button>
      </div>
    </h-msg-box>
    <!--<show-branch :showBranchWin="showBranchWin" title="机构查询" @brchNoChange="brchNoChange"
                 @showBranchWinClose="showBranchWinClose"></show-branch>-->
    <role-distribute :roleDistributeWin="brchRoleDistributeWin" :userNo="userNo" roleType="2"
                     @roleDistributeWinClose="roleDistributeWinClose"
                     @roleDistributeSubmit="roleDistributeSubmit" title="角色分配"
                     :licenseFlag="licenseFlag" :ownedBrchNo="ownedBrchNo"></role-distribute>
    <!--复用组件 查看柜员菜单-->
    <show-branch-menu :showBranchMenuWin="showBranchMenuWin" :userNo="userNo" roleType="2"
                      @showBranchMenuWinClose="showBranchMenuWinClose" title="查看菜单" :licenseFlag="licenseFlag" :ownedBrchNo="ownedBrchNo"></show-branch-menu>
  </div>
</template>
<script>
  import { post, on, off, bempConfirm, getDictListByGroups  } from "@/api/bizApi/commonUtil";

  export default {
    name: "userManager",
    data() {
      return {
        showIcon:true,//是否显示机构组件的放大镜图标
        brchNoReadonly:false,//机构组件是否只读
        isCurBrchNo:true,//是否是当前机构
        licenseFlag:false,
        authPath: this.$route.path ,
        ownedBrchNo:"",
        formItem: {
          roleCode: "",
          roleName: "",
          kindCode: "",
          roleType: "",
          userRemark: "",
          bindTrader: "",
          brchNo: "",
          brchName:"",
          userNo:"",
          userName: "",
          loginStatus:"",
          authPath:this.$route.path,
          ownedBrchNos:"",
          ownedBrchNames:"",

        },
        traderForm: {
          userId: "",
          traderId: "",
          traderName: "",
          traderType: ""
        },
        typeForm: {
          copyType: "1",
          toCopyRoleCode: "",
          creators: "",
          copyRoleCode: ""
        },
        type: null,
        addOrEditWin: false,
        setRoleRole: false,
        setRoleRight: false,
        setRoleAllotRight: false,
        copyWin: false,
        readonly: false,
        isRequired: true,
        addForm: {
          ownedBrchNo:"",
          ownedBrchName:"",
          roleCode: "",
          roleName: "",
          roleOrder: "",
          paramValue: "",
          kindCode: "BIZFRAME",
          kindId: "",
          paramDesc: "",
          paramRegex: "",
          relOrg: "0_000000",
          beginDate: "",
          endDate: "",
          beginDateFmt: "",
          endDateFmt: "",
          roleType: 0,
          schemeId: "",
          schemeName: "",
          userRemark: "",
          phoneNo: "",
          email:"",
          traderId:"",
          brchNo: "",
          userNo: "",
          userName: "",
          brchName: "",
          reserve2: "",
        },
        btnAuth:"",
        //给按钮增加权限
        authObj: {
          syncUser: true,       //同步用户
          bizSetRoleAdd: true, //角色添加
          bizSetRoleDelete: true, //角色删除
          bizSetRoleORight: true, //角色操作权限
          bizSetRoleARight: true, //角色授权权限
          bizRoleRightSet: true, //角色权限处理
          bizRoleRightCopy: true, //角色权限复制
          bizSetRoleDownload: true //角色信息下载
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center",
            hiddenCol: false,
            width: 50
          },
          {
            title: this.$t('m.i.common.userNo'),
            key: "userNo",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.userName'),
            key: "userName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.brchName'),
            key: "brchName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.traderId'),
            key: "traderId",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.auth.loginStatus"),
            key: "loginStatus",
            hiddenCol: false,
            render: (h, params) => {
              return h("div", [
                h("span", params.row.loginStatus === "0" ? "离线" : "在线")
              ]);
            }
          },
          {
            title: this.$t("m.i.common.userStatus"),
            key: "isEnable",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", params.row.isEnable === "0" ? "锁定" : params.row.isEnable === "1" ? "正常" : "无效")
              ]);
            }
          },
          {
            title: this.$t("m.i.common.userRole"),
            key: "roleName",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.common.reviewStatus"),
            key: "operateStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", this.formatterOperateStatus(params.row.operateStatus, params.row, params.row.index))
              ]);
            }
          },
          {
            title: this.$t("m.i.auth.traderBinded"),
            key: "traderBinded",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", params.row.traderBinded === true ? "是" : "否")
              ]);
            }
          },
          {
            title: this.$t("m.i.common.isSingleSign"),
            key: "reserve2",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", params.row.reserve2 === '1' ? "是" : params.row.reserve2 === '0' ? "否" : "")
              ]);
            }
          },
          {
            title: this.$t("m.i.common.email"),
            key: "email",
            hiddenCol: false
          }
        ],
        histColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            width: 50,
            align: "center"
          },

          {
            title: this.$t('m.i.common.userNo'),
            key: "userNo",

            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.userName'),
            key: "userName",

            hiddenCol: false,
            sortable: true
          },

          {
            title: this.$t('m.i.common.brchNo'),
            key: "brchNo",

            hiddenCol: false
          },

          {
            title: this.$t('m.i.common.traderId'),
            key: "traderId",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.userRole"),
            key: "roleName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.common.operTellerNo'),
            key: "operTellerNo",
            hiddenCol: false
          }, {
            title: this.$t("m.i.common.checkTellerNo"),
            key: "checkTellerNo",
            hiddenCol: false
          },
          {
            title: this.$t("m.i.auth.operDescription"),
            key: "description",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t("m.i.common.operStatus"),
            key: "operStatus",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              return h("div", [
                h("span", this.formatterOperateStatus(params.row.operStatus, params.row, params.row.index))
              ]);
            }
          },
          {
            title: this.$t("m.i.common.operTm"),
            key: "updateTime",
            hiddenCol: false,
            sortable: true,
            render: (h, params) => {
              let dueDt = this.$moment(params.row.updateTime, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
              return h("span", dueDt);
            }
          }
        ],
        traderColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            title: this.$t("m.i.common.index"),
            type: "index",
            align: "center",
            width: 50
          },
          {
            title: this.$t('m.i.common.traderId'),
            key: "traderId",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.traderName'),
            key: "traderName",
            hiddenCol: false,
            sortable: true
          },
          {
            title: this.$t('m.i.common.userType'),
            key: "traderType",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TraderType", params.row.traderType);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          },
          {
            title: this.$t("m.i.common.userStatus"),
            key: "traderStatus",
            hiddenCol: false,
            render: (h, params) => {
              let list = this.getDictValueFromMap(this.dictMap, "TraderStatus", params.row.traderStatus);
              return h("span",
                {
                  domProps: {
                    title: list
                  }
                }, list);
            }
          }

        ],

        histData: {
          rows: [],
          total: 1
        },
        traderData: {
          rows: [],
          total: 1
        },
        userTraderWin: false,
        showDefaultTeller: false,
        branchDto: {},
        currentSelectRow: [],
        traderSelectRow: [],
        currentSelectList: [],
        currentSelectRowInx: [],
        tempInx: 0,
        dictMap: new Map(),
        pageInfo: {
          pageNo: 1,
          pageSize: 10
        },
        // showBranchWin: false,
        brchRoleDistributeWin: false,
        userHistWin: false,
        brchNo: false,
        userNo: "123",
        showBranchMenuWin: false,
        submitCopyRoleDisabled: false,

        userNoRule: [{ test: /^[a-zA-Z0-9]{1,20}$/, trigger: "blur", message: "用户号应小于等于20位数字或字母组成" }],
        phoneNoRule: [{ test: /^[\d\-]+$/, trigger: "blur", message: "电话号码应为数字或和'-'组成" }],
        roleNameRule: [{
          test: /^[\w\u4e00-\u9fa5\（\）\(\)\-\s]*$/,
          trigger: "blur",
          message: "非法输入，只能输入中文、英文、数字、小括号和下划线"
        }],

        numberRule: ["num"],
        deletDisabled: false,
        kindTree: [],
        submitFlag: false,
        ifShowMore: false,
        schemeIdList: [],
        reqUrl: "/sm/auth/branchUser",
        userId: "",
        singleSignList:[
          {
            key:"1",
            value:"是"
          },
          {
            key:"0",
            value:"否"
          }
        ],
      };
    },
    components: {
      RoleDistribute: () => import(/* webpackChunkName: "sm/auth/branch/roleDistribute" */`@/views/bizViews/sm/auth/branch/roleDistribute`),
      ShowBranchMenu: () => import(/* webpackChunkName: "sm/auth/branch/showBranchMenu" */`@/views/bizViews/sm/auth/branch/showBranchMenu`)
    },
    watch: {
      userTraderWin(val) {
        if (!val) {
          this.$nextTick(() => {
            this.$refs.traderForm.resetFields();
            this.$refs.datagrid2.$refs.gridPage.clearElevator();
          });
        }
      },
      userHistWin(val) {
        if (!val) {
          this.$nextTick(() => {
            this.$refs.datagrid1.$refs.gridPage.clearElevator();
          });
        }
      },
      'addForm.ownedBrchNo'(val){
        if (this.licenseFlag&&val) {
          //判断业务所属机构是否与当前登录机构相同
          let curBrchNo=JSON.parse(window.sessionStorage.getItem("userInfo")).brchNo
          if (curBrchNo===val) {
            //业务所属机构与当前机构一致
            this.showIcon=true;
            this.brchNoReadonly=false;
            this.isCurBrchNo=true;
            this.addForm.brchNo=this.addForm.ownedBrchNo;
            this.addForm.brchName=this.addForm.ownedBrchName;
          }else {
            //业务所属机构与当前机构不一致，机构号显示选中的业务所属机构
            this.showIcon=false
            this.brchNoReadonly=true
            this.isCurBrchNo=false
            this.addForm.brchNo=this.addForm.ownedBrchNo;
            this.addForm.brchName=this.addForm.ownedBrchName;
          }
        }
      }
    },
    computed: {},
    methods: {
      handleWinClose(){
        if (this.licenseFlag) {
          this.addForm.ownedBrchNo="";
          this.addForm.ownedBrchName="";
        }
        this.showIcon=true
        this.brchNoReadonly=false
        this.isCurBrchNo=true
        this.readonly = false;
        this.addFormReset()
        this.addOrEditWin=false
      },
      // 选中一条记录
      handlelRowClick(arr) {
        let temp = [];
        temp.push(arr);
        this.currentSelectRow = temp;
      },
      //取消选中
      cancelSel() {
        this.currentSelectRow = [];
      },
      handleHistPage(pageNo, pageSize) {
        if (Array.isArray(this.currentSelectRow) && this.currentSelectRow.length > 0) {
          this.queryHist(pageNo, pageSize);
        }
      },
      handleTradePage(pageNo, pageSize) {
        if (this.userId) {
          let obj = Object.assign({}, this.traderForm, { userId: this.userId, pageNo: pageNo, pageSize: pageSize });
          this.queryTrade(obj);
        }
      },

      // 选择交易员
      traderRowClick(arr) {
        let temp = [];
        temp.push(arr);
        this.traderSelectRow = temp;
      },
      cancelTradSel() {
        this.traderSelectRow = null;
      },
      // 绑定交易员
      submitTrader() {
        let list = this.traderSelectRow;
        if (Array.isArray(list) && list.length > 0) {
          let trader = list[0];
          post({
            traderId: trader.traderId,
            traderName: trader.traderName,
            userId: this.currentSelectRow[0].userId
          }, this.reqUrl + "/userManager/func_bindingTrader").then(res => {
            if (res.data.retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.userTraderWin = false;
            } else {
              this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //设置默认交易员
      defalutTrader() {
        let list = this.currentSelectRow;
        if (list.length===0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let userDto = list[0];
        let userNo = userDto.userNo;
        if (userDto.operateStatus === "UH00") {
          this.$msgTip.info(this, { info: "该柜员正在复核中，请重新选择" });
          return;
        }
        if (userDto.isOwnedBrch!=="1") {
          this.$msgTip.info(this, { info: this.licenseFlag?"只能设置当前机构或已授权机构的柜员为默认交易柜员！":"只能设置当前机构的柜员为默认交易柜员！" });
          return;
        }
        if (userDto.isEnable != "1") {
          this.$msgTip.info(this, { info: "柜员[" + userNo + "]非正常状态柜员！" });
          return;
        }
        if (!userDto.traderId) {
          this.$msgTip.info(this, { info: "柜员[" + userNo + "]未绑定交易员！" });
          return;
        }

        let title = userDto.traderBinded ? "取消默认交易柜员" : "设置默认交易柜员";
        let msg1 = userDto.traderBinded ? "柜员[" + userDto.userNo + "]已是机构["+userDto.brchName+"]默认交易柜员,是否取消？" : "确定要设置[" + userDto.userNo + "]为机构["+userDto.brchName+"]默认交易柜员吗？";
        let msg2 = userDto.traderBinded ? "柜员[" + userDto.userNo + "]已是本机构默认交易柜员,是否取消？" : "确定要设置[" + userDto.userNo + "]为本机构默认交易柜员吗？";
        let content = this.licenseFlag?msg1:msg2;
        let options = { title: title, content: content };
        bempConfirm(this, this.reqUrl + "/userManager/func_updateBranchDefaultTraderNo", {
          brchNo: userDto.brchNo,
          defaultTraderNo: userDto.traderBinded ? "" : userDto.userNo
        }, options, list, function(_this) {
          _this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        });
      },
      // 柜员历史查询
      queryHist(pageNo, pageSize) {
        let list = this.currentSelectRow;
        if (Array.isArray(list) && list.length > 0) {
          this.userHistWin = true;
          let obj = Object.assign({}, this.formItem, {
            userNo: list[0].userNo,
            pageNo: pageNo || 1,
            pageSize: pageSize || 10,
            licenseFlag: this.licenseFlag,
            ownedBrchNo: list[0].ownedBrchNo
          });
          post(obj, this.reqUrl + "/getHisList").then(res => {
            if (res.data.retCode === "000000") {
              this.histData = res.data.retData;
            } else {
              this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
            }
          });
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      //绑定、解绑交易员
      handleTrader() {
        // this.userTraderWin = true;
        let list = this.currentSelectRow;
        let userDto = {};
        if (Array.isArray(list) && list.length > 0) {
          userDto = list[0];
          let userNo = userDto.userNo;
          if (userDto.operateStatus === "UH00") {
            this.$msgTip.info(this, { info: "该柜员正在复核中，请重新选择" });
            return;
          }
          if (userDto.isEnable != 1 && userDto.isEnable != 2) {
            this.$msgTip.info(this, { info: "请选择用户状态为正常或无效的柜员" });
            return;
          }
        } else {
          list = [];
        }
        if (userDto.traderId) { // 解绑
          let options = { title: "解绑交易员", content: "确定要解除绑定吗？" };
          bempConfirm(this, this.reqUrl + "/userManager/func_unBindingTrader", { userId: userDto.userId }, options, list);
        } else { //绑定 - 查询交易柜员
          if (list.length > 0) {
            this.userTraderWin = true;
            this.userId = list[0].userId;
            let obj = Object.assign({}, this.traderForm, { userId: list[0].userId });
            this.queryTrade(obj);
          } else {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          }
        }
      },
      queryTrade(obj) {
        post(obj, this.reqUrl + "/func_queryBranchTraders").then(res => {
          if (res.data.retCode === "000000") {
            this.traderData = res.data.retData;
          } else {
            this.$msgTip.error(this, { info: "操作失败:" + res.data.retMsg });
          }
        });
      },
      cancel() {
      },
      //用户置为离线
      handleOffLine() {
        let list = this.currentSelectRow;
        let userObj = {};
        if (Array.isArray(list) && list.length > 0) {
          userObj = list[0];
          if (userObj.operateStatus === "UH00") {
            this.$msgTip.info(this, { info: "该柜员正在复核中，请重新选择" });
            return;
          }
          if (userObj.loginStatus === "0") {
            this.$msgTip.info(this, { info: "请选择在线用户" });
            return;
          }
        } else {
          list = [];
        }
        let options = { title: "置为离线", content: "确定要置为离线吗？" };
        bempConfirm(this, "/sm/auth/user/offLine", { userId: userObj.userId, userNo: userObj.userNo }, options, list);
      },
      // 输定用户状态
      handleStatus() {
        let list = this.currentSelectRow;
        let userObj = {};
        if (Array.isArray(list) && list.length > 0) {
          userObj = list[0];
          if (userObj.operateStatus === "UH00") {
            this.$msgTip.info(this, { info: "该柜员正在复核中，请重新选择" });
            return;
          }
          if (userObj.isEnable === "2") {
            this.$msgTip.info(this, { info: "请选择正常或者锁定的用户!" });
            return;
          }
        } else {
          list = [];
        }
        let options = {
          title: userObj.isEnable === "0" ? "解锁用户" : "锁定用户",
          content: userObj.isEnable === "0" ? "确定要解锁用户吗？" : "确定要锁定用户吗？"
        };
        let url = userObj.isEnable === "0" ? "/sm/auth/branchUser/userManager/func_unLockLegalPersonManager" : "/sm/auth/branchUser/userManager/func_lockLegalPersonManager";
        bempConfirm(this, url, { userNo: userObj.userNo }, options, list);
      },

      //查看柜员菜单
      showMenu() {
        if (this.currentSelectRow != null && this.currentSelectRow.length != 0) {
          this.showBranchMenuWin = true;
          this.userNo = this.currentSelectRow[0].userNo;
          this.ownedBrchNo=this.currentSelectRow[0].ownedBrchNo
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },
      showBranchMenuWinClose() {
        this.showBranchMenuWin = false;
      },
      //角色分配
      roleDistribute() {
        if (this.currentSelectRow != null && this.currentSelectRow.length != 0) {
          if (this.currentSelectRow[0].operateStatus === "UH00") {
            this.$msgTip.info(this, { info: "该柜员正在复核中，请重新选择" });
            return;
          }
          this.brchRoleDistributeWin = true;
          this.ownedBrchNo=this.currentSelectRow[0].ownedBrchNo;
          this.userNo = this.currentSelectRow[0].userNo;
        } else {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
        }
      },

      roleDistributeWinClose() {
        this.brchRoleDistributeWin = false;
      },
      roleDistributeSubmit() {
        this.brchRoleDistributeWin = false;
        this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
        this.currentSelectRow = [];
        this.currentSelectList = [];
      },
      /* //查询机构弹出框
       queryBrchNo(optType) {
         this.showBranchWin = true;
         this.optType = optType;
       },
       showBranchWinClose() {
         this.showBranchWin = false;
       },
       //根据弹框所选数据进行赋值
       brchNoChange(info, optType) {
         if (this.optType == "query") {
           this.formItem.brchNo = info[0].id;
           this.formItem.brchName = info[0].title;
         } else if (this.optType == "add") {
           this.addForm.brchNo = info[0].id;
           this.addForm.brchName = info[0].title;
         }
         this.showBranchWin = false;
       },*/
      // 重置密码
      resetPwd() {
        if (!Array.isArray(this.currentSelectRow) || this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
          return;
        }
        let list = this.currentSelectRow;
        let userObj = {};
        if (Array.isArray(list) && list.length > 0) {
          userObj = list[0];
        } else {
          list = [];
        }
        if (list[0].operateStatus === "UH00") {
          this.$msgTip.info(this, { info: "该柜员正在复核中，请重新选择" });
          return;
        }
        if (userObj.isEnable !== "1") {
          this.$msgTip.info(this, { info: "请选择正常的用户!" });
          return;
        }
        let options = {
          title: "重置密码",
          content: "确定要重置密码吗？"
        };
        bempConfirm(this, "/sm/auth/branchUser/userManager/func_resetLegalPersonManagerPwd", { userId: userObj.userId,userNo:userObj.userNo,userName:userObj.userName,brchNo:userObj.brchNo,brchName:userObj.brchName,userRemark:userObj.userRemark,phoneNo:userObj.phoneNo,email:userObj.email,traderId:userObj.traderId,userType:userObj.userType}, options, list);
      },

      formSearch() {
        this.unDisabled();
        this.currentSelectRow = [];
        this.$refs.datagrid.dataChange(1);
      },
      traderSearch() {
        this.unDisabled();
        let list = this.currentSelectRow;
        let obj = Object.assign({}, this.traderForm, { userId: list[0].userId });
        this.queryTrade(obj);
      },
      formSearchReset() {
        this.$nextTick(() => {
          this.$refs.formItem.resetFields();
          this.formItem.ownedBrchNames="";
          this.formItem.ownedBrchNos="";
          this.formItem.brchNo="";
          this.formItem.brchName="";
          this.formItem.userNo="";
          this.formItem.userName="";
          this.formItem.loginStatus="";
          this.formItem.bindTrader="";
          this.formItem.userRemark="";
          this.formItem.roleType="";
          this.formItem.kindCode="";
          this.formItem.roleName="";
          this.formItem.roleCode=""
        });
      },
      traderSearchReset() {
        this.$refs.traderForm.resetFields();
      },
      handleTraderClose() {
        this.$refs.traderForm.resetFields();
      },
      addFormReset() {
        this.$nextTick(() => {
          this.$refs.addForm.resetFields();
          this.addForm.traderId = "";
          this.addForm.userId = "";
          if (this.licenseFlag) {
            this.addForm.ownedBrchNo=this.$store.getters.userInfo.brchNo;
            this.addForm.ownedBrchName=this.$store.getters.userInfo.brchName;
          }
        });
      },
      handleAddForm(str) {
        this.type = str;
        this.readonly = false;
        this.isRequired = true;
        this.addForm.userId = null;
        if (this.type == "modify" || this.type == "view") {
          if (!Array.isArray(this.currentSelectRow) || this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseOneData") });
            return;
          }
          if (this.type == "modify") {
            if (this.currentSelectRow[0].operateStatus === "UH00") {
              this.$msgTip.info(this, { info: "该柜员正在复核中，请重新选择" });
              return;
            }
            this.showIcon=true;
            this.brchNoReadonly=false;
            this.isCurBrchNo=true;
            this.readonly = false;
          }
          this.addOrEditWin = true;
          this.$nextTick(() => {
            let newRow = this.currentSelectRow[0];
            this.addForm.userNo = newRow.userNo;
            this.addForm.userId = newRow.userId;
            this.addForm.userName = newRow.userName;
            this.addForm.brchNo = newRow.brchNo;
            this.addForm.brchName = newRow.brchName;
            this.addForm.userRemark = newRow.userRemark;
            this.addForm.phoneNo = newRow.phoneNo;
            this.addForm.userRemark = newRow.userRemark;
            this.addForm.email = newRow.email;
            this.addForm.traderId = newRow.traderId;
            this.addForm.reserve2 = newRow.reserve2;
          });
          if (this.type == "view") {
            this.addForm.relOrg = this.currentSelectRow.org_name;
            this.addForm.kindCode = this.currentSelectRow.kind_name;
            this.addForm.beginDateFmt = this.currentSelectRow.begin_date_fmt;
            this.addForm.endDateFmt = this.currentSelectRow.end_date_fmt;
            this.isRequired = false;
          }
        } else {
          this.addOrEditWin = true;
          this.addFormReset();
        }
      },
      handleSelectClick(arr, selectInx) {
        this.unDisabled();
        this.currentSelectList = arr;
        this.currentSelectRowInx = selectInx;
        if (arr.length == 0) return;
        if (arr[0].role_code == "admin") {
          this.deletDisabled = true;
        }
      },
      unDisabled() {
        this.deletDisabled = false;
      },
      /* handlelRowClick(arr) {
         if (arr && this.currentSelectRow) {
           if (this.currentSelectRow.length > 0 && arr[0].userNo === this.currentSelectRow[0].userNo) {
             this.currentSelectRow = [];
             return;
           }
         }
         this.currentSelectRow = arr;
       },*/
      submitForm() {
        let btnType = this.type;
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = this.type === "modify" ? this.reqUrl + "/userManager/func_updateBranchUser" : this.type === "syncUser" ? this.reqUrl + "/userManager/func_syncBranchUser" : this.reqUrl + "/userManager/func_addBranchUser";
            let msg = this.type === "modify" ? this.$t("m.i.common.modifySuccess") : this.$t("m.i.common.actionSuccess");
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let return_code = res.data.return_code;
                if (res.data.retCode === "000000") {
                  // this.$hMessage.success(msg);
                  this.$msgTip.success(this);
                  this.handleWinClose();
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                  this.currentSelectRow = [];
                  this.currentSelectList = [];
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.addFailed") + res.data.retMsg });
                  this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }

            });

          }
        });

      },
      handleComfirm() {
        let list = this.currentSelectRow;
        let userObj = {};
        if (Array.isArray(list) && list.length > 0) {
          userObj = list[0];
          if (list[0].operateStatus === "UH00") {
            this.$msgTip.info(this, { info: "该柜员正在复核中，请重新选择" });
            return;
          }
        } else {
          list = [];
        }
        let options = {
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.isConfirmDelete") + "?"
        };
        bempConfirm(this, this.reqUrl + "/userManager/func_deleteBranchUser", { userNo: userObj.userNo }, options, list);
      },
      //通过外围同步用户信息
      syncUser() {
        if (typeof (this.addForm.userNo) == "string" && this.addForm.userNo != "") {
          let userNo = this.addForm.userNo;
          post({ userNo: userNo }, "/sm/auth/branchUser/userManager/func_findExternalUser").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  let userInfo = res.data.retData;
                  this.addForm.userName = userInfo.userName;
                  this.addForm.brchNo = userInfo.brchNo;
                  this.addForm.brchName = userInfo.brchName;
                  this.addForm.phoneNo = userInfo.phoneNo;
                  this.addForm.userRemark = userInfo.userRemark;
                  this.addForm.email = userInfo.email;
                } else {
                  this.$msgTip.error(this, { info: "同步用户信息失败：" + res.data.retMsg });
                }
              }
            }
          ).catch(error => {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") + error });
          });
        } else {
          this.$msgTip.info(this, { info: "用户号不能为空" });
        }
      },
      formatterOperateStatus(value) {
        if (value != null && value != "") {
          switch (value) {
            case "UH00":
              return "待复核";
            case "UH01":
              return "复核已拒绝";
            case "UH02":
              return "复核已通过";
            case "UH03":
              return "无复核";
          }
        } else {
          return "";
        }
      }
    },
    mounted() {
      getDictListByGroups("TraderType,TraderStatus").then(res => {
        this.dictMap = res.get("map");
      });
      //按钮权限查询 控制按钮显隐
      let id = JSON.parse(window.sessionStorage.getItem("curMenu")).id;
      post({ authId: id }, "/sm/auth/buttonAuth/func_queryButtonByAuthId").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          let retMsg = res.data.retMsg;
          if (retCode === "000000") {
            this.btnAuth = JSON.parse(res.data.retData);
            this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
          } else {
            this.$msgTip.error(this, { info: retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

      post({authPath:this.$route.path}, "sm/auth/licenseBrch/focusOper/func_checkLicenseAuth").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.licenseFlag = res.data.retData.licenseFlag;
          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        }else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });

    },
    created() {
    }
  };
</script>
