<style>
.icon-lock:before {
  font-size: 24px;
}
</style>

<template>
  <div class="h-topbar">
    <top-bar-logo :logoUrl="logoUrl"></top-bar-logo>
    <div class="h-topbar-tool">
      <div class="h-topbar-tool-search">

        <h-simple-select v-model="search"
                         ref="select"
                         :placeholder="searchText"
                         label-in-value
                         @on-change="handleSearch"
                         filterable>
          <h-select-block :data="findRoute"></h-select-block>
        </h-simple-select>
      </div>

      <ul class="h-topbar-option-list">
        <li class="item" @mouseenter="showAccountInfor = !showAccountInfor"
            @mouseleave="showAccountInfor = !showAccountInfor">
          <div class="item-tit">
            <h-icon name="user"></h-icon>
            <span>{{currUserId}}</span>
          </div>
          <div v-if="showAccountInfor" class="item-option-box">
            <div class="header">
              <span class="tit">用户信息</span>
              <h-button class="btn-passwd" @click.native="handleResetPass" v-if="!isIndividuation">修改密码</h-button>
            </div>
            <div class="content">
              <ul class="list" v-if="!isIndividuation">
                <li>
                  <span>所属机构：{{accountInfor.section}}</span>
                </li>
                <li>
                  <span>本次登录：{{this.$moment(accountInfor.thisTime).format("YYYY-MM-DD HH:mm:ss")}}</span>
                </li>
                <li>
                  <span>登录地区：{{accountInfor.address}}</span>
                </li>
                <li>
                  <span>上次登录：{{this.$moment(accountInfor.thisTime).format("YYYY-MM-DD HH:mm:ss")}}</span>
                </li>
              </ul>
              <ul class="list" v-if="isIndividuation">
                <li>
                  <span>查询权限机构：{{ bankAccountInfor.queryAuthorityBrch }}</span>
                </li>
                <li>
                  <span>账务归属机构：{{ bankAccountInfor.acctBelongBrch }}</span>
                </li>
                <li>
                  <span>本次登录：{{ this.$moment(bankAccountInfor.thisTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
                </li>
                <li>
                  <span>登录地区：{{ bankAccountInfor.address }}</span>
                </li>
                <li>
                  <span>上次登录：{{ this.$moment(bankAccountInfor.lastTime).format("YYYY-MM-DD HH:mm:ss") }}</span>
                </li>
                <li>
                  <span>上次登录地区：{{ bankAccountInfor.lastAddress }}</span>
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li class="item" @mouseenter="getFormalMenus" @mouseleave="showMenu=!showMenu">
          <div class="item-tit">
            <h-icon name="list"></h-icon>
          </div>
          <div v-if="showMenu" class="item-option-box">
            <div class="header">
              <span class="tit">常用菜单</span>
              <h-button class="btn-menu" @click="showFormalMenu">
                <h-icon name="set" size="16"></h-icon>
              </h-button>
            </div>
            <div class="content clearfix">
              <ul class="list menu-list">
                <!-- 当前数据使用searchRoute模拟，真正的系统请使用真实数据 -->
                <li v-for="(item, index) in formalMenu" :key="index" v-if="!item.hidden" @click="gotoPage(item)"
                    :title="item.authName">{{ item.authName }}
                </li>
              </ul>
            </div>
          </div>
        </li>
        <li class="item" @mouseenter="showState = !showState" @mouseleave="showState=!showState">
          <div class="item-tit">
            <h-icon name="systemstate"></h-icon>
          </div>
          <div v-if="showState && !showMenu &&!showAccountInfor" class="item-option-box">
            <div class="header">
              <span class="tit">系统状态</span>
            </div>
            <div class="content">
              <ul class="list">
                <li>
                  <span>当前系统：&nbsp;&nbsp;{{getDictValueFromMap(this.dictMap, "SysStatusCode", sysStatus)}}[{{this.$moment(workDate, "YYYYMMDD").format("YYYY-MM-DD")}}]</span>
                </li>
                <li v-if="busiClassify==='1' || busiClassify==='4'|| busiClassify==='5'">
                  <span>ECDS系统：{{getDictValueFromMap(this.dictMap, "EcdsSysStsCode", ecdsSysStatus)}}[{{this.$moment(ecdsSysDate, "YYYYMMDD").format("YYYY-MM-DD")}}]</span>
                </li>
                <li v-if="busiClassify!=='5' ">
                  <span>CPES系统：{{getDictValueFromMap(this.dictMap, "SysSts", cpesSysStatus)}}[{{this.$moment(cpesSysDate, "YYYYMMDD").format("YYYY-MM-DD")}}]</span>
                </li>
                <!--<li class="mt-10 mb-10">
                  <span>大额清算：</span>
                  <h-radio-group v-model="systemState.state2" type="button">
                    <h-radio label="已关闭"></h-radio>
                  </h-radio-group>
                </li>-->
              </ul>
            </div>
          </div>
        </li>
        <li class="item" @click="queryMsg">
          <div class="item-tit">
            <h-icon name="bell"></h-icon>
            <span v-if="noticeNum > 0" class="number" ref="number">{{noticeNum}}</span>
          </div>


        </li>
        <li class="item">
          <div class="item-tit logout" @click="logout">
            <h-icon name="quit"></h-icon>
          </div>
        </li>
      </ul>
    </div>

    <topbar-edit-pwd :set-password="setPassword" :closable="closable" :msg-info="msgInfo" @handleCancle="handleCancle"></topbar-edit-pwd>

    <!-- 常用菜单设置弹窗 -->
    <h-msg-box v-model="MenuLayer" width="1000px" :maximize="true" @on-close='closeFormalMenu' :closable="true"
               :transfer="true" :scrollable="false">
      <p slot="header">
        <span>常用菜单设置</span>
      </p>
      <h-menu-transfer height="400">
        <div slot="source" class="menu-tree-box">
          <div class="tree-btn-wrap">
            <h-button type="ghost" @click="unfoldAll()">全部展开</h-button>
            <h-button type="ghost" @click="closeAll()">全部合并</h-button>
          </div>
          <h-tree :data="baseData" show-checkbox multiple ref="tree"></h-tree>
        </div>
        <div slot="operation" class="menu-set-option">
          <h-button type="ghost" @click="addMenu()">
            <h-icon name="arrow-r"></h-icon>
          </h-button>
        </div>
        <ul slot="purpose" class="menu-selected-list">
          <li v-for="(item, index) in commonMenuList" :key="index">
            <h-icon name="delete-close-s" @on-click="delCommonMenu(item.id)"></h-icon>
            <span>{{ item.authName }}</span></li>
        </ul>
      </h-menu-transfer>
      <div slot="footer">
        <h-button type="ghost" @click="closeFormalMenu">取消</h-button>
        <h-button type="primary" @click="saveFormalMenu">提交</h-button>
      </div>
    </h-msg-box>
    <!--消息查询-->
    <index-main-msg :msgBoxWin="msgBoxWin" @msgBoxWinClose="msgBoxWinClose"
                    title='查询未读消息' @msgBoxChange="msgBoxChange"></index-main-msg>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import LockScreen from "@/components/LockScreen";
import { changePwd, initMsg, checkDefPwd } from "@/api/login";
import { allToggleClass } from "@/utils";
import HMenuTransfer from "@/components/MenuTransfer";
import { getDictListByGroups, getDictValueFromMap, post } from "@/api/bizApi/commonUtil";
// const bbepMenus = require('@/mock/bbepMenus.json');

export default {
  data() {
    let userInfo = JSON.parse(window.sessionStorage.getItem("userInfo"));
    let currUserId = userInfo.userName ? userInfo.userName : "";
    let brchNo;
    if (userInfo.userType==="1") {
      brchNo = "";
    } else {
      brchNo = userInfo.brchNo;
    }
    let lastLoginDtTm = userInfo.lastLoginDtTm;
    let brchName;
    if (userInfo.userType==="1") {
      brchName = "场务管理员";
      this.brchNameForType = brchName;
    } else {
      brchName = userInfo.brchName;
      this.brchNameForType = brchName + "[" + brchNo + "]";
    }
    let passwordChangeRule = window.LOCAL_CONFIG.passwordChangeRule;
    let workDate = window.sessionStorage.getItem("workDate");
    let sysStatus = window.sessionStorage.getItem("sysStatus");
    let bankloginDtTm =window.sessionStorage.getItem("loginDtTm");
    let bankloginAddr = window.sessionStorage.getItem("loginAddress");
    let bankqueryAuthorityBrch = window.sessionStorage.getItem("queryAuthorityBrch");
    let bankacctBelongBrch = window.sessionStorage.getItem("acctBelongBrch");
    let banklastLoginAddr = userInfo.lastLoginAddr;
    let dictMap = new Map();
    let cpesSysStatus = "";
    let cpesSysDate = 0;
    let ecdsSysStatus = "";
    let ecdsSysDate = 0;
    // 新密码框校验
    // 确认密码框校验
    const validatePassCheck = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t("m.i.common.enterNewPwdAgain")));
      } else if (value !== this.setPassForm.newPassword) {
        callback(new Error(this.$t("m.i.common.pwdNoEquals")));
      } /*else if (value.length < 6) {
          callback(this.$t("m.i.common.pwdEnterMsg_1") + 6 + this.$t("m.i.common.pwdEnterMsg_2"));
        } else if (this.validatePwd(value)) {
          callback("密码为6-18位，必须包含数字、字母和特殊符号");
        } */ else {
        callback();
      }
    };
    return {
      logoUrl: "",
      userInfo: userInfo,
      msgBoxWin: false,
      isIndividuation:false,
      search: "",
      searchText: "输入关键词",
      currUserId: currUserId,
      sysStatus: sysStatus,
      workDate: workDate,
      dictMap: dictMap,
      cpesSysDate: cpesSysDate,
      cpesSysStatus: cpesSysStatus,
      ecdsSysDate: ecdsSysDate,
      ecdsSysStatus: ecdsSysStatus,
      closable: true,
      msgInfo: this.$t("m.i.common.defaultPwdMsg"),
      setPassForm: {
        oldPassword: "",
        newPassword: "",
        newPasswordCheck: ""
      },
      validNewPassCheck: {
        validator: validatePassCheck, trigger: "blur"
      },
      setPassword: false,
      submitLoading: true,
      // locktime: 100,
      // theme: 'theme-black',
      locktime: this.LOCAL_CONFIG.LOCK_TIME,
      theme: this.LOCAL_CONFIG.THEME,
      tipState: null,
      // 账户信息
      showAccountInfor: false,
      brchNameForType:"",
      accountInfor: {
        section:this.brchNameForType,
        // brchName + "[" + brchNo + "]",
        thisTime: lastLoginDtTm,
        address: userInfo.lastLoginAddr,
        lastTime: lastLoginDtTm
      },
      bankAccountInfor: {
        section:this.brchNameForType,
        thisTime: bankloginDtTm,
        lastTime:lastLoginDtTm,
        address: bankloginAddr,
        lastAddress: banklastLoginAddr,
        queryAuthorityBrch: bankqueryAuthorityBrch,
        acctBelongBrch: bankacctBelongBrch,
      },
      //网络连接实例
      websocket: null,
      // 常用菜单
      showMenu: false,
      // 系统状态
      showState: false,
      systemState: {
        ECDS: "营业处理",
        CPES: "营业处理",
        state2: "开启"
      },
      // 通知信息个数
      showNotice: false,
      noticeNum: 0,
      // 设置常用菜单弹窗
      MenuLayer: false,
      // 常用菜单列表，具体参数请按需求自行添加
      commonMenuList: [],
      // 非叶子节点都要定义expand属性，目录树各节点的具体参数请按需求自行添加
      baseData: [],
      formalMenu: [],
      ids: [],
      findRoute: [],
      //是否直连模式界面
      busiClassify: "1"
    };
  },
  components: {
    LockScreen,
    HMenuTransfer,
    IndexMainMsg: () => import(/* webpackChunkName: "sm/msg/msgpush/indexMainMsg" */`@/views/bizViews/sm/msg/msgpush/indexMainMsg.vue`)
  },
  computed: {
    ...mapGetters([
      "menusRoot",
      "activeIndex",
      "searchRoute"
    ])
  },
  watch: {
    theme() {
      allToggleClass(document.getElementsByTagName("html")[0], this.theme);
    },
  },
  methods: {
    nodeSelect(arr, obj) {
      this.getSerachRoute(this.baseData, obj.id);
    },
    getFormalMenus() {
      this.showMenu = !this.showMenu;
      post({ loading: false }, "/sm/auth/userAuth/menuMain/func_findUserAuth").then(res => {
        if (res) {
          if (res.data.retCode == "000000" && res.data.retData) {
            let storeMenu = res.data.retData;
            this.formalMenu = storeMenu;

          } else {
            this.formalMenu = [];
            //this.$hMessage.error('获取消息总数'+ res.retMsg);
          }
        }
      });
    },
    getSerachRoute(data, checkedNodes, type) {
      this.$nextTick(() => {

        for (let i in data) {
          if (data[i].children) {
            this.getSerachRoute(data[i].children, checkedNodes, type);
          } else {
            if (typeof(data[i].path) == "string") {
              if (type == "show") {
                for (let j in checkedNodes) {
                  if (checkedNodes[j].id == data[i].id) {
                    data[i].checked = true;
                  }
                }
              } else if (type == "close") {

                data[i].checked = false;

              } else {
                if (data[i].id == checkedNodes) {
                  data[i].checked = true;
                }
              }
            }
          }
        }
      });

    },
    showFormalMenu() {
      let treeData = [{
        expand: true,
        title: "票据菜单",
        children: []
      }];
      //console.log(this.menusRoot);
      for (let i in this.menusRoot) {
        if (Array.isArray(this.menusRoot[i].children)) {
          treeData[0].children.push(this.menusRoot[i]);
        }
      }
      this.baseData = treeData;
      post({}, "/sm/auth/userAuth/menuMain/func_findUserAuth").then(res => {
        if (res) {
          if (res.data.retCode == "000000" && res.data.retData) {
            let storeMenu = res.data.retData;
            this.formalMenu = storeMenu;
            this.commonMenuList = storeMenu;
            if (Array.isArray(storeMenu)) {
              for (let obj of storeMenu) {
                this.ids.push(obj.id + "");
              }
            }

          } else {
            //this.$hMessage.error('获取消息总数'+ res.retMsg);
          }
        }
      });
      this.getSerachRoute(this.baseData, this.formalMenu, "show");
      this.MenuLayer = true;
    },
    closeFormalMenu() {
      this.ids = [];
      this.commonMenuList = [];
      this.baseData = [];
      //this.getSerachRoute(this.baseData,[],'close');
      this.MenuLayer = false;
    },
    saveFormalMenu() {
      let authIds = [];
      if (Array.isArray(this.commonMenuList)) {
        for (let obj of this.commonMenuList) {
          authIds.push(obj.id);
        }
      }
      if (authIds.length > 100) {
        this.$msgTip.info(this, { info: "设置常用菜单个数上限为100个!" });
        return;
      }
      post({ authIdArray: authIds.join(",") }, "/sm/auth/userAuth/menuMain/func_addUserAuth").then(res => {
        if (res) {
          if (res.data.retCode == "000000") {
            this.$msgTip.success(this);
          } else {
            //this.$hMessage.error('获取消息总数'+ res.retMsg);
          }
        }
      });
      this.commonMenuList = [];
      this.ids = [];
      this.MenuLayer = false;
    },
    turnPage(item) {
      //根据菜单调整左侧菜单树展示内容
      let currentActiveIndex = item.id.toString().substr(0,1);
      for (let i=0; i< this.menusRoot.length; i++) {
        if (this.menusRoot[i].id === currentActiveIndex) {
          this.$store.dispatch('ActiveRootIndex', i);
          break;
        }
      }
      this.$store.dispatch("setActiveMenuName", {});
      let isOpened = this.$store.getters.openedRouterList.some(child => {
        return item.path === child.path;
      });
      if (isOpened) {
        this.$router.push({
          path: item.path,
          query: item.connectMode === "embed" ? { embedPath: item.embedPath.substring(item.embedPath.indexOf('url')).split('=')[1] } : {}
        });
        // this.$router.push(item.path);
      } else {
        this.$store.dispatch("GenerateRoutesByMenus", [item]).then((res) => {
          this.$router.addRoutes(this.$store.getters.addRouters);
          // 路由未定义
          // this.$router.push(item.path);
          this.$router.push({
            path: item.path,
            query: item.connectMode === "embed" ? { embedPath: item.embedPath.substring(item.embedPath.indexOf('url')).split('=')[1] } : {}
          });
        });
      }
    },
    msgBoxWinClose() {
      this.msgCount();
      this.msgBoxWin = false;
    },
    msgBoxChange() {
      this.msgCount();
    },
    queryMsg() {
      this.msgBoxWin = true;
    },
    setCurEmbedMenu(menus, embedPath) {
      this.$store.dispatch("setCurEmbedMenu", {
        connectMode: "embed",
        findId: menus.id,
        id: menus.path.substring(menus.path.lastIndexOf("\/") + 1, menus.path.length),
        parentId: menus.parentId,
        name: menus.title,
        path: menus.path,
        embedPath: embedPath
      });
    },
    handleSearch(item) {
      if (!!item.value) {
        let arr = item.value.split(",");
        let menus = {
          title: item.label,
          id: arr[0],
          path: arr[1],
          parentId: arr[2]
        };
        //对接模式下，提交菜单id到后台获取嵌入菜单真实地址
        if(menus.path === "/embed/embedMenuMain") {
          // bbepMenus.forEach(embedMenu => {
          //   console.info(embedMenu)
          //   if(embedMenu.id === menus.id) {
          //     window.sessionStorage.setItem("curMenu", JSON.stringify(Object.assign(menus, { embedPath: embedMenu.embedPath, connectMode: "embed"})));
          //     this.$nextTick(() => {
          //       this.turnPage(Object.assign(menus, { embedPath: embedMenu.embedPath, connectMode: "embed"}));
          //       this.setCurEmbedMenu(menus, embedMenu.embedPath);
          //       this.search = "";
          //       this.$refs.select.setQuery("");
          //     });
          //   }
          // });
          post({ code: menus.id }, "joinbbep/authority/dockAuthority/func_getBbepMenuPathByBbepMenuId").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                window.sessionStorage.setItem("curMenu", JSON.stringify(Object.assign(menus, { embedPath: res.data.retMsg, connectMode: "embed"})));
                this.$nextTick(() => {
                  this.turnPage(Object.assign(menus, { embedPath: res.data.retMsg, connectMode: "embed"}));
                  this.setCurEmbedMenu(menus, res.data.retMsg);
                  this.search = "";
                  this.$refs.select.setQuery("");
                });
              }else{
                this.$msgTip.error(this, { info: res.data.retMsg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else {
          window.sessionStorage.setItem("curMenu", JSON.stringify(menus));
          this.$nextTick(() => {
            this.turnPage(menus);
            this.search = "";
            this.$refs.select.setQuery("");
          });
        }
      }
    },
    // 菜单树操作
    setNode(nodes, val) {
      if (nodes && nodes.length > 0) {
        for (let node of nodes) {
          if (node.children && node.children.length > 0) {
            node.expand = val;
            this.setNode(node.children, val);
          }
        }
      }
    },
    unfoldAll() {
      this.setNode(this.baseData, false);
      this.setNode(this.baseData, true);
    },
    closeAll() {
      this.setNode(this.baseData, false);
    },
    // 添加常用菜单
    addMenu() {
      let checkedNodes = this.$refs.tree.getCheckedNodes();
      for (let node of checkedNodes) {
        // 只有叶子节点才是有对应的页面
        if (typeof(node.path) == "string" && node.path.length > 2) {
          let temp = {};
          temp.id = node.id;
          temp.authName = node.title;
          temp.path = node.path;
          if (this.ids.indexOf(temp.id) < 0) {
            this.ids.push(node.id);
            this.commonMenuList.push(temp);
          }
        }
      }
    },
    // 常用菜单删除
    delCommonMenu(oId) {
      let i = 0;
      for (i = 0; i < this.commonMenuList.length; i++) {
        if (this.commonMenuList[i].id == oId) {
          this.commonMenuList.splice(i, 1);
          this.ids.splice(i, 1);
        }
      }
      this.getSerachRoute(this.baseData, [], "close");
      this.getSerachRoute(this.baseData, this.commonMenuList, "show");
      //let storeMenu = JSON.parse(window.localStorage.getItem(this.userInfo.userId));
      //this.formalMenu = storeMenu;
    },
    // 常用菜单跳转
    gotoPage(item) {
      let menus = {
        id: item.id.toString(),
        title: item.authName,
        path: item.path,
        parentId: item.parentAuthNo
      };
      if(menus.path === "/embed/embedMenuMain") {
        //   bbepMenus.forEach(embedMenu => {
        //     console.info(embedMenu)
        //     if(embedMenu.id === menus.id) {
        //       this.$nextTick(() => {
        //         this.turnPage(Object.assign(menus, { embedPath: embedMenu.embedPath, connectMode: "embed"}));
        //         this.setCurEmbedMenu(menus, embedMenu.embedPath);
        //       });
        //     }
        //   });
        post({ code: menus.id }, "joinbbep/authority/dockAuthority/func_getBbepMenuPathByBbepMenuId").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              window.sessionStorage.setItem("curMenu", JSON.stringify(Object.assign({ embedPath: res.data.retMsg, connectMode: "embed"},menus)));
              this.$nextTick(() => {
                this.turnPage(Object.assign(menus, { embedPath: res.data.retMsg, connectMode: "embed"}));
                this.setCurEmbedMenu(menus, res.data.retMsg);
              });
            }else{
              this.$msgTip.error(this, { info: res.data.retMsg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      } else {
        window.sessionStorage.setItem("curMenu", JSON.stringify(menus));
        this.$nextTick(() => {
          this.turnPage(menus);
        });
      }
    },
    // 换肤
    handleChangeTheme(color) {
      this.theme = color;
    },
    handleResetPass() {
      this.setPassword = true;
      this.tipState = "";
    },
    handleResetForm(name) {
      this.$nextTick(() => {
        this.$refs[name].resetFields();
      });
    },
    handleCancle() {
      this.setPassword = false;
      this.msgInfo = this.$t("m.i.common.defaultPwdMsg");
    },
    logout() {
      let config = {};
      let isTransfer = window.sessionStorage.getItem("isTransfer");
      if(isTransfer === "0") {
        this.$hMsgBox.remove();
        config = {transfer: true, scrollable: false};
      }
      let isSingleLogin = window.sessionStorage.getItem("isSingleLogin");
      let bankName = window.sessionStorage.getItem("bankName");
      this.$hMsgBox.confirm({
        title: "用户退出",
        content: "是否确定退出？",
        onOk: () => {
          this.$store.dispatch("Logout").then(() => {
            if (isSingleLogin === "1") {
              this._mergeLoginIndex(bankName);
              import(/* webpackChunkName: "banks/[request]/login"  */`@/views/bizViews/banks/${bankName}/login.vue`).then(module => {
                let loginRoute = [{
                  path: `/${bankName}/login`,
                  component: this._getLoginComponentByUrl(`/${bankName}/login`),
                }];
                this.$store.dispatch("setRouters", loginRoute).then(() => {
                  this.$router.addRoutes(loginRoute);
                  this.$router.push({path: `/${bankName}/login`});
                });
              }).catch(err => {
              });
            } else {
              location.reload();
            }
          });
        }
      }, config);
    },
    activeSidebar(index) {
      if (index >= 0) {
        this.$store.dispatch("ActiveRootIndex", index);
      }
      // let item = this.menusRoot[this.activeIndex]
      // 防止页面刷新时会跳转根页面
      // if(this.$route.matched[0].path !== item.url) {
      //   this.$router.push({path: item.url})
      // }
    },
    onkeypress() {
      // this.validatePwd(this.setPassForm.newPassword);
    },
    // 验证密码强度
    validatePwd(s) {
      let re = /^(?![^A-Za-z]+$)(?![^0-9]+$)(?![^\|\&\$\%\@\*\#\_\-\!\=]+$).{6,18}$/;
      if (re.test(s)) {
        return false;
      }
      return true;
    },
    bitCount(i) {
      let count = 0;
      while (i) {
        ++count;
        i &= (i - 1);
      }
      return count;
    },
    //获取消息总数
    async msgCount(){
      let isShowMainindex = window.sessionStorage.getItem("isShowMainindex");
      if(isShowMainindex === "1") {
        post({}, "/sm/msg/msgpush/msgPushRecordQuery/func_messageCount").then(res => {
          if (res) {
            if (res.data.retCode == "000000") {
              this.noticeNum = res.data.retData.count;
            } else {
              //this.$hMessage.error('获取消息总数'+ res.retMsg);
            }
          }
        });
      }
    },
    /***********websocket 开始****************/
    //初始化weosocket
    initWebSocket() {
      const wsuri = window.LOCAL_CONFIG.WS_REQ + this.userInfo.userNo;
      this.websocket = new WebSocket(wsuri);
      this.websocket.onopen = this.websocketonopen;
      this.websocket.onerror = this.websocketonerror;
      this.websocket.onmessage = this.websocketonmessage;
      this.websocket.onclose = this.websocketclose;
    },
    websocketonopen() {
      console.log("WebSocket连接成功");
    },
    websocketonerror(e) { //错误
      console.log("WebSocket连接发生错误");
    },
    websocketonmessage(e) { //数据接收
      if (e) {
        this.noticeNum = Number.parseInt(this.noticeNum) + 1;
      }
    },
    websocketclose(e) { //关闭
      //console.log("connection closed (" + e.code + ")");
    }
    /***********websocket 结束****************/
  },

  created() {
    let dir = window.sessionStorage.getItem("bankName");
    let logoUrl = "";
    if (typeof(dir) == "string" && dir !== "" && dir != "default") {
      try {
        this.logoUrl = require(`@/assets/${dir}/logo.png`);
      } catch (e) {
        this.logoUrl = require(`@/assets/logo.png`);
      }
    } else {
      this.logoUrl = require(`@/assets/logo.png`);
    }
    this.msgCount();
    this.initWebSocket();
    // 输入其他根目录下的路径时，切换sidebar
    if (this.menusRoot.length === 0 || this.$route.path.indexOf(this.menusRoot[this.activeIndex].path) < 0) {
      let urlArr = this.$route.path.split("/");
      let curUrl = "/" + urlArr[1];
      for (let [key, value] of this.menusRoot.entries()) {
        if (curUrl === value.path) {
          this.activeSidebar(key);
          return;
        }
      }
    } else {
      // 更新对应的sidebar
      this.activeSidebar(this.activeIndex);
    }
    //获取内部消息
    //initMsg();
    //setInterval(initMsg, 1000 * 60 * 5);// 5分钟轮询一次获取内部消息
    // 获取银行是否个性化顶部任务栏
    if(window.LOCAL_CONFIG.BANK_NAME_TO_DIVTOPBAR ==="dgbank"){
      this.isIndividuation = true;
    }

    //检查当前登录用户密码是否为初始化密码，是测必须修改密码方可进入系统
    if (this.LOCAL_CONFIG.isToken) {
      // checkDefPwd().then(res =>{
      //     if(res){
      //         let flag = ""
      //         if(res.data&&res.data.result){
      //           flag = res.data.result+""
      //         }
      //         if(flag=="true"){
      //             this.closable = false
      //             this.setPassword = true
      //         }
      //     }
      // })
    }
  },
  mounted() {
    if(window.sessionStorage.getItem("isShowMainindex") === "1"){
      document.getElementsByTagName("html")[0].className = this.theme.concat(" " + window.sessionStorage.getItem("bankName"));
      getDictListByGroups("SysStatusCode,EcdsSysStsCode,SysSts").then(res => {
        this.dictMap = res.get("map");
      });
      post({ paramKey: "pc.call_connect_mode" }, "/sm/auth/systemParameter/func_getConnectMode").then(res => {
        if (res) {
          let retCode = res.data.retCode;
          if (retCode === "000000") {
            this.busiClassify = res.data.retData;
            if(res.data.retData==null){
              this.busiClassify="1";
            }
            this.$nextTick(() => {
              if(this.busiClassify==="1" || this.busiClassify==="4" || this.busiClassify==="5"){
                post({}, "/ecds/getEcdsSysStatus").then(res => {
                  if (res) {
                    if (res.data.retCode == "000000") {
                      this.ecdsSysDate = res.data.retData.sysDt;
                      this.ecdsSysStatus = res.data.retData.sysStatus;
                    }
                  }
                });
              }
            })
            if(this.busiClassify!=="5"){
              this.$nextTick(() => {
                post({}, "/shcpe/cpes/systemStatus/getCpesSysStatus").then(res => {
                  if (res) {
                    if (res.data.retCode == "000000") {
                      this.cpesSysDate = res.data.retData.currentSysDt;
                      this.cpesSysStatus = res.data.retData.currentSysStatus;
                    }
                  }
                });
              })
            }

          } else {
            this.$msgTip.error(this, { info: res.data.retMsg });
          }
        } else {
          this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
        }
      });


      // this.$refs.select.focus()
      this.$nextTick(()=>{
        //this.$refs.select.blur()
        let  rt = [];
        if(Array.isArray(this.searchRoute)){
          for(let obj of this.searchRoute){
            if(!obj.hidden){
              let newObj ={ label: obj.name, value: obj.id + "," + obj.path + "," + obj.parentId  };
              rt.push(newObj);
            }
          }
          this.findRoute = rt;
        }
      })
    }
  }
};
</script>
