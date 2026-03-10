<template>
  <div class="layout">
    <h-row name="flex" class="layout-menu-wrapper">
      <h-col span="24">
        <div>
          <div class="h-form-search-box">
            <!-- 查询表单 -->
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="90" ref="formItem" cols="4" class="h-form-search">
                <h-form-item prop="funcName" :label="$t('m.i.auth.funcName')">
                  <h-input v-model="formItem.funcName" placeholder="" :maxlength="60"></h-input>
                </h-form-item>
                <h-form-item prop="funcNo" :label="$t('m.i.auth.funcNo')">
                  <h-input v-model="formItem.funcNo" placeholder="" :maxlength="10"></h-input>
                </h-form-item>
                <h-form-item prop="moduleNo" :label="$t('m.i.auth.moduleNo')">
                  <h-input v-model="formItem.moduleNo" placeholder="" :maxlength="4"></h-input>
                </h-form-item>
                <h-form-item class="h-form-operate">
                  <h-button type="primary" @click="handleSearch()">{{$t("m.i.common.search")}}</h-button>
                  <h-button type="ghost" @click="resetSearch()">{{$t("m.i.common.reset")}}</h-button>
                </h-form-item>
              </h-form>
            </h-panel>
          </div>
          <!-- 数据展示表格 -->
          <h-datagrid :columns="columns"
                      highlightRow
                      url="/sm/auth/flowStatus/func_pageQueryFlowStatus"
                      :bindForm="formItem"
                      :on-select-change="handleRowClick"
                      ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <h-button type="primary" @click="addFlowStatus">新增功能状态</h-button>
              <h-button type="primary" @click="modifyFlowStatus('first')">修改功能状态</h-button>
              <h-button type="primary" @click="completeBeforeStatus">设置前置流程状态</h-button>
              <h-button type="primary" @click="completeAfterStatus">设置流程状态</h-button>
              <h-button type="primary" @click="resetBeforeStatus">重置前置流程状态</h-button>
            </div>
          </h-datagrid>
        </div>

        <!-- 新增弹窗 -->
        <h-msg-box v-model="addFlowStatusWin" width="1000" @on-close="addFlowStatusWinClose" class="h-form-search-layer"
                   :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>新增</span>
          </p>
          <div>
            <h-form :model="addForm" :label-width="115" ref="addForm" cols="2" class="h-form-search" onlyBlurRequire>
              <h-form-item prop="funcName" :label="$t('m.i.auth.funcName')" required>
                <h-input v-model="addForm.funcName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item prop="funcNo" :label="$t('m.i.auth.funcNo')" required>
                <h-input v-model="addForm.funcNo" placeholder="" :maxlength="10" @on-keyup="changeByFuncNo"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.isHasStartStatus')" required>
                <h-select v-model="addForm.isHasStartStatus" placeholder="" @on-change="changeIsHasStartStatus">
                  <h-option value="0">否</h-option>
                  <h-option value="1">是</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="initStatusName" :label="$t('m.i.auth.initStatusName')" v-if="addIsShow" :required="addIsShow">
                <h-input v-model="addForm.initStatusName" placeholder="" :maxlength="16"></h-input>
              </h-form-item>
              <h-form-item prop="initStatus" :label="$t('m.i.auth.initStatus')" v-if="addIsShow" :required="addIsShow">
                <h-input v-model="addForm.initStatus" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="changeStatusName" :label="$t('m.i.auth.changeStatusName')" required>
                <h-input v-model="addForm.changeStatusName" placeholder="" :maxlength="16"></h-input>
              </h-form-item>
              <h-form-item prop="changeStatus" :label="$t('m.i.auth.changeStatus')" required>
                <h-input v-model="addForm.changeStatus" placeholder="" readonly></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="addFlowStatusWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="addFlowStatusWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 修改弹窗 -->
        <h-msg-box v-model="modifyFlowStatusWin" width="1000" @on-close="modifyFlowStatusWinClose"
                   class="h-form-search-layer" :maximize="true" :mask-closable="false" :z-index=1002>
          <p slot="header">
            <span>修改</span>
          </p>
          <div>
            <h-form :model="modifyForm" :label-width="115" ref="modifyForm" cols="2" class="h-form-search"
                    onlyBlurRequire>
              <h-form-item prop="funcName" :label="$t('m.i.auth.funcName')" required>
                <h-input v-model="modifyForm.funcName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item prop="funcNo" :label="$t('m.i.auth.funcNo')" required>
                <h-input v-model="modifyForm.funcNo" placeholder="" :maxlength="10"
                         @on-keyup="changeModifyByFuncNo"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.isHasStartStatus')" required>
                <h-select v-model="modifyForm.isHasStartStatus" placeholder=""
                          @on-change="changeModifyIsHasStartStatus">
                  <h-option value="0">否</h-option>
                  <h-option value="1">是</h-option>
                </h-select>
              </h-form-item>
              <h-form-item prop="initStatusName" :label="$t('m.i.auth.initStatusName')" v-if="modifyIsShow" :required="modifyIsShow">
                <h-input v-model="modifyForm.initStatusName" placeholder="" :maxlength="16"></h-input>
              </h-form-item>
              <h-form-item prop="initStatus" :label="$t('m.i.auth.initStatus')" v-if="modifyIsShow" :required="modifyIsShow">
                <h-input v-model="modifyForm.initStatus" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item prop="changeStatusName" :label="$t('m.i.auth.changeStatusName')" required>
                <h-input v-model="modifyForm.changeStatusName" placeholder="" :maxlength="16"></h-input>
              </h-form-item>
              <h-form-item prop="changeStatus" :label="$t('m.i.auth.changeStatus')" required>
                <h-input v-model="modifyForm.changeStatus" placeholder="" readonly></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="modifyFlowStatusWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="modifyFlowStatusWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 设置前置状态 -->
        <h-msg-box v-model="completeBeforeWin" width="800" height="350" @on-close="completeBeforeWinClose"
                   class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>设置前置状态</span>
          </p>
          <div>
            <h-form :model="completeBeforeForm" :label-width="115" ref="completeBeforeForm" cols="2"
                    class="h-form-search" onlyBlurRequire>
              <h-form-item prop="funcName" :label="$t('m.i.auth.funcName')" required>
                <h-input v-model="completeBeforeForm.funcName" placeholder="" :maxlength="60" readonly></h-input>
              </h-form-item>
              <h-form-item prop="funcNo" :label="$t('m.i.auth.funcNo')" required>
                <h-input v-model="completeBeforeForm.funcNo" placeholder="" :maxlength="10" readonly></h-input>
              </h-form-item>
              <h-form-item prop="beforeStatus" :label="$t('m.i.auth.beforeStatus')" required>
                <h-input v-model="completeBeforeForm.beforeStatus" placeholder="" icon="android-search"
                         @on-click="queryBeforeStatus()" readonly></h-input>
              </h-form-item>
              <h-form-item prop="beforeStatusName" :label="$t('m.i.auth.beforeStatusName')">
                <h-input v-model="completeBeforeForm.beforeStatusName" placeholder="" readonly></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="completeBeforeWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="completeBeforeWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>


        <!-- 设置后置状态 -->
        <h-msg-box v-model="completeAfterWin" width="800" height="350" @on-close="completeAfterWinClose"
                   class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>设置后置状态</span>
          </p>
          <div>
            <h-form :model="completeAfterForm" :label-width="115" ref="completeAfterForm" cols="2" class="h-form-search"
                    onlyBlurRequire>
              <h-form-item prop="funcName" :label="$t('m.i.auth.funcName')" required>
                <h-input v-model="completeAfterForm.funcName" placeholder="" :maxlength="60" readonly></h-input>
              </h-form-item>
              <h-form-item prop="funcNo" :label="$t('m.i.auth.funcNo')" required>
                <h-input v-model="completeAfterForm.funcNo" placeholder="" :maxlength="10" readonly></h-input>
              </h-form-item>
              <h-form-item prop="nextFuncNo" :label="$t('m.i.auth.nextFuncNo')">
                <h-input v-model="completeAfterForm.nextFuncNo" placeholder="" icon="android-search"
                         @on-click="queryNextFuncId()" readonly></h-input>
              </h-form-item>
              <h-form-item prop="nextFuncName" :label="$t('m.i.auth.nextFuncName')" required>
                <h-input v-model="completeAfterForm.nextFuncName" placeholder="" :maxlength="60" readonly></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="completeAfterWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="completeAfterWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>

        <!-- 前置状态集合弹窗 -->
        <h-msg-box v-model="beforeStatusWin" width="1000" class="h-form-table-layer" :maximize="true"
                   :mask-closable="false" @on-close="queryBeforeStatusClose()">
          <!--弹出框模式标题-->
          <p slot="header">
            <span>前置状态</span>
          </p>
          <!-- 查询表单 -->
          <div :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="beforeStatusForm" :label-width="100" ref="beforeStatusForm" cols="4" class="h-form-search">
              <h-form-item :label="$t('m.i.auth.curFuncNo')">
                <h-input v-model="this.beforeStatusCurFuncNo" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.curFuncName')">
                <h-input v-model="this.beforeStatusCurFuncName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.funcNo')" prop="funcNo">
                <h-input v-model="beforeStatusForm.funcNo" placeholder="" :maxlength="10"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.funcStatusName')" prop="funcStatusName">
                <h-input v-model="beforeStatusForm.funcStatusName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item class="h-form-operate">
                <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}
                  <i class="icon iconfont"
                     :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                <h-button type="primary" @click="beforeStatusFormSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="beforeStatusFormReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
          </div>
          <!-- 数据展示表格 -->
          <div>
            <h-row>
              <h-col span="24">
                <h-datagrid :columns="beforeStatusColumns"
                            highlight-row
                            :has-page="false"
                            :autoLoad="false"
                            url="/sm/auth/flowStatus/func_findFuncStatusByModuleNo"
                            :on-select-change="beforeStatusHandleSelectChange"
                            :bindForm="beforeStatusForm"
                            :height="350"
                            ref="beforeStatusDatagrid" class="pl-5 pr-5">
                  <div slot="toolbar" class="pull-left">
                    <h-button type="primary" @click="modifyFuncStatusName('second')">修改流程状态名称</h-button>
                    <h-button type="primary" @click="deleteFuncNo('second')">删除</h-button>
                  </div>
                </h-datagrid>
              </h-col>
            </h-row>
          </div>
          <!-- 弹出框模式底部按钮 -->
          <div slot="footer">
            <h-button type="ghost" @click="queryBeforeStatusClose()">{{$t("m.i.common.close")}}</h-button>
            <h-button type="primary" @click="queryBeforeStatusSubmit()">{{$t("m.i.common.commit")}}</h-button>
          </div>
        </h-msg-box>

        <!-- 下一功能号弹窗 -->
        <h-msg-box v-model="nextFuncNoWin" width="1000" class="h-form-table-layer" :maximize="true"
                   :mask-closable="false" @on-close="nextFuncNoWinClose()">
          <!--弹出框模式标题-->
          <p slot="header">
            <span>下一功能号查询</span>
          </p>
          <!-- 查询表单 -->
          <div :class="{'h-form-overhd':!ifShowMore}">
            <h-form :model="nextFuncNoFormItem" :label-width="100" ref="nextFuncNoFormItem" cols="4"
                    class="h-form-search">
              <h-form-item :label="$t('m.i.auth.curFuncNo')">
                <h-input v-model="this.nextFuncNoCurFuncNo" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.curFuncName')">
                <h-input v-model="this.nextFuncNoCurFuncName" placeholder="" readonly></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.funcNo')" prop="funcNo">
                <h-input v-model="nextFuncNoFormItem.funcNo" placeholder="" :maxlength="10"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.funcName')" prop="funcName">
                <h-input v-model="nextFuncNoFormItem.funcName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item class="h-form-operate">
                 <span class="h-more-input" @click="ifShowMore=!ifShowMore">{{$t('m.i.common.searchAdvanced')}}
                  <i class="icon iconfont"
                     :class="{'icon-arrow-down-screensv':!ifShowMore,'icon-arrow-up-screen':ifShowMore}"></i></span>
                <h-button type="primary" @click="nextFuncNoFormItemSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="nextFuncNoFormItemReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
          </div>
          <!-- 数据展示表格 -->
          <div>
            <h-datagrid :columns="nextFuncColumns"
                        highlight-row
                        :has-page="false"
                        :autoLoad="false"
                        url="/sm/auth/flowStatus/func_findFlowStatusByModuleNo"
                        :on-select-change="nextFuncNoHandleSelectChange"
                        :bindForm="nextFuncNoFormItem"
                        :height="350"
                        ref="nextFuncNoDatagrid" class="pl-5 pr-5">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="modifyFlowStatus('second')">修改功能状态</h-button>
              </div>
            </h-datagrid>
          </div>
          <!-- 弹出框模式底部按钮 -->
          <div slot="footer">
            <h-button type="ghost" @click="nextFuncNoWinClose()">{{$t("m.i.common.close")}}</h-button>
            <h-button type="primary" @click="nextFuncNoSubmit()">{{$t("m.i.common.commit")}}</h-button>
          </div>
        </h-msg-box>

        <!-- 功能号超链接 -->
        <h-msg-box v-model="funcNoWin" width="1000" class="h-form-table-layer" :maximize="true" :mask-closable="false"
                   @on-close="funcNoWinClose()">
          <!--弹出框模式标题-->
          <p slot="header">
            <span>功能号查询</span>
          </p>
          <!-- 查询表单 -->
          <div>
            <h-form :model="funcNoFormItem" :label-width="100" ref="funcNoFormItem" cols="4" class="h-form-search">
              <h-form-item :label="$t('m.i.auth.nextFuncNo')" prop="nextFuncNo">
                <h-input v-model="funcNoFormItem.nextFuncNo" placeholder="" :maxlength="10"></h-input>
              </h-form-item>
              <h-form-item :label="$t('m.i.auth.funcStatusName')" prop="funcStatusName">
                <h-input v-model="funcNoFormItem.funcStatusName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
              <h-form-item class="h-form-operate two-form">
                <h-button type="primary" @click="funcNoFormItemSearch()">{{$t("m.i.common.search")}}</h-button>
                <h-button type="ghost" @click="funcNoFormItemReset()">{{$t("m.i.common.reset")}}</h-button>
              </h-form-item>
            </h-form>
          </div>
          <!-- 数据展示表格 -->
          <div>
            <h-datagrid :columns="funcNoColumns"
                        highlight-row
                        :has-page="false"
                        :autoLoad="false"
                        url="/sm/auth/flowStatus/func_findFuncStatusByModuleNo"
                        :on-select-change="funcNoHandleSelectChange"
                        :bindForm="funcNoFormItem"
                        :height="350"
                        ref="funcNoDatagrid" class="pl-5 pr-5">
              <div slot="toolbar" class="pull-left">
                <h-button type="primary" @click="modifyFuncStatusName('first')">修改流程状态名称</h-button>
                <h-button type="primary" @click="deleteFuncNo('first')">删除</h-button>
              </div>
            </h-datagrid>
          </div>
          <!-- 弹出框模式底部按钮 -->
          <div slot="footer">
            <h-button type="ghost" @click="funcNoWinClose()">{{$t("m.i.common.close")}}</h-button>
          </div>
        </h-msg-box>

        <!-- 超链接 修改流程状态名称 -->
        <h-msg-box v-model="modifyFuncStatusWin" width="400" @on-close="modifyFuncStatusWinClose"
                   class="h-form-search-layer" :maximize="true" :mask-closable="false">
          <p slot="header">
            <span>设置后置状态</span>
          </p>
          <div>
            <h-form :model="modifyFuncStatusForm" :label-width="115" ref="modifyFuncStatusForm" cols="1"
                    class="h-form-search" onlyBlurRequire>
              <h-form-item prop="funcStatusName" :label="$t('m.i.auth.funcStatusName')" required>
                <h-input v-model="modifyFuncStatusForm.funcStatusName" placeholder="" :maxlength="60"></h-input>
              </h-form-item>
            </h-form>
          </div>
          <div slot="footer">
            <div slot="footer">
              <h-button type="ghost" @click="modifyFuncStatusWinClose">{{$t("m.i.common.close")}}</h-button>
              <h-button type="primary" v-if="submitFlag" disabled>{{$t("m.i.common.submiting")}}</h-button>
              <h-button type="primary" v-else @click="modifyFuncStatusWinSubmit()">{{$t("m.i.common.commit")}}</h-button>
            </div>
          </div>
        </h-msg-box>
      </h-col>
    </h-row>
  </div>
</template>

<script>
  import { post, on, off, getDictListByGroups } from "@/api/bizApi/commonUtil";

  export default {
    name: "flowStatusAssert",
    data() {
      return {
        firstOrSecond: "",
        modifyFlowStatusWin: false,
        modifyForm: {
          isHasStartStatus: "",
          funcNo: "",
          funcName: "",
          initStatus: "",
          initStatusName: "",
          changeStatus: "",
          changeStatusName: "",
          id: ""
        },
        modifyFuncStatusWin: false,
        funcNoCurrentSelectRow: [],
        modifyFuncStatusForm: {
          funcStatusName: "",
          id: ""
        },
        ifShowMore: false,
        nextFuncNoCurFuncNo: "",
        nextFuncNoCurFuncName: "",
        beforeStatusCurFuncNo: "",
        beforeStatusCurFuncName: "",
        addIsShow: false,
        modifyIsShow: false,
        completeBeforeWin: false,
        completeAfterWin: false,
        funcNoWin: false,
        completeBeforeForm: {
          id: "",
          funcNo: "",
          funcName: "",
          beforeStatus: "",
          beforeStatusName: ""
        },
        completeAfterForm: {
          id: "",
          funcNo: "",
          funcName: "",
          nextFuncNo: "",
          nextFuncName: ""
        },
        funcNoFormItem: {
          funcNo: "",
          moduleNo: "",
          nextFuncNo: "",
          funcStatusName: ""
        },
        funcNoColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: true
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcName'),
            key: "funcName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcNo'),
            key: "funcNo",
            hiddenCol: false
          }, {
            title: this.$t('m.i.auth.nextFuncName'),
            key: "nextFuncName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.nextFuncNo'),
            key: "nextFuncNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcStatusName'),
            key: "funcStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcStatus'),
            key: "funcStatus",
            hiddenCol: false
          }
        ],
        nextFuncNoWin: false,
        nextFuncNoCurrentSelectRow: [],
        nextFuncNoFormItem: {
          moduleNo: "",
          curFuncNo: "",
          funcNo: "",
          funcName: ""
        },
        nextFuncColumns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: true
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          }, {
            title: this.$t('m.i.auth.funcName'),
            key: "funcName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcNo'),
            key: "funcNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.initStatusName'),
            key: "initStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.initStatus'),
            key: "initStatus",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.changeStatusName'),
            key: "changeStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.changeStatus'),
            key: "changeStatus",
            hiddenCol: false
          }
        ],
        beforeStatusWin: false,
        beforeStatusCurrentSelectRow: [],
        beforeStatusForm: {
          moduleNo: "",
          curFuncNo: "",
          funcNo: "",
          funcStatusName: ""
        },
        beforeStatusColumns: [
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: false
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcName'),
            key: "funcName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcNo'),
            key: "funcNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.nextFuncName'),
            key: "nextFuncName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.nextFuncNo'),
            key: "nextFuncNo",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcStatusName'),
            key: "funcStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcStatus'),
            key: "funcStatus",
            hiddenCol: false
          }
        ],
        formItem: {
          funcNo: "",
          funcName: "",
          moduleNo: ""
        },
        addForm: {
          isHasStartStatus: "0",
          funcNo: "",
          funcName: "",
          initStatus: "",
          initStatusName: "",
          changeStatus: "",
          changeStatusName: ""
        },
        columns: [
          {
            title: " ",
            type: "radio",
            align: "center",
            width: 50
          },
          {
            type: "selection",
            key: "multiSelect",
            width: 60,
            hiddenCol: true
          },
          {
            type: "index",
            key: "numOrder",
            title: this.$t("m.i.common.index"),
            width: 60,
            align: "center",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcName'),
            key: "funcName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.funcNo'),
            key: "funcNo",
            hiddenCol: false,
            render: (h, params) => {
              return h("a", {
                on: {
                  click: () => {
                    this.showFuncNoWin(params.row.funcNo);
                  }
                }
              }, params.row.funcNo);
            }
          },
          {
            title: this.$t('m.i.auth.beforeStatusName'),
            key: "beforeStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.beforeStatus'),
            key: "beforeStatus",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.initStatusName'),
            key: "initStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.initStatus'),
            key: "initStatus",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.changeStatusName'),
            key: "changeStatusName",
            hiddenCol: false
          },
          {
            title: this.$t('m.i.auth.changeStatus'),
            key: "changeStatus",
            hiddenCol: false
          }
        ],
        currentSelectRow: [],
        dictMap: new Map(),
        addFlowStatusWin: false,
        submitFlag: false
      };
    },
    computed: {},
    mounted() {
      getDictListByGroups("Yon,DraftTypeCode,AcptType,RiskStatus,DraftTypeCode,").then(res => {
        this.dictMap = res.get("map");
      });
    },
    watch: {},
    methods: {
      funcNoHandleSelectChange(arr) {
        this.funcNoCurrentSelectRow = arr;
      },
      changeByFuncNo() {
        this.addForm.initStatus = this.addForm.funcNo + "01";
        this.addForm.changeStatus = this.addForm.funcNo + "02";
      },
      changeModifyByFuncNo() {
        this.modifyForm.initStatus = this.modifyForm.funcNo + "01";
        this.modifyForm.changeStatus = this.modifyForm.funcNo + "02";
      },
      funcNoFormItemSearch() {
        this.$refs.funcNoDatagrid.dataChange(1);
        this.funcNoCurrentSelectRow = [];
      },
      funcNoFormItemReset() {
        this.$refs.funcNoFormItem.resetFields();
      },
      funcNoWinClose() {
        this.funcNoWin = false;
        this.funcNoFormItem.funcNo = "";
        this.funcNoFormItem.moduleNo = "";
      },
      showFuncNoWin(funcNo) {
        this.$nextTick(() => {
          let moduleNo = funcNo.toString().substring(2, 6);
          this.funcNoFormItem.funcNo = funcNo;
          this.funcNoFormItem.moduleNo = moduleNo;
          this.$refs.funcNoDatagrid.dataChange(1);
        });
        this.funcNoWin = true;
      },
      nextFuncNoFormItemSearch() {
        this.nextFuncNoCurrentSelectRow = [];
        this.$refs.nextFuncNoDatagrid.dataChange(1);
      },
      nextFuncNoFormItemReset() {
        this.$refs.nextFuncNoFormItem.resetFields();
      },
      beforeStatusFormSearch() {
        this.beforeStatusCurrentSelectRow = [];
        this.$refs.beforeStatusDatagrid.dataChange(1);
      },
      beforeStatusFormReset() {
        this.$refs.beforeStatusForm.resetFields();
      },
      changeIsHasStartStatus() {
        if (this.addForm.isHasStartStatus === "1") {
          this.addIsShow = true;
          if (this.addForm.funcNo !== "" && this.addForm.funcNo !== null) {
            this.addForm.initStatus = this.addForm.funcNo + "01";
          }
        } else {
          this.addIsShow = false;
          this.addForm.initStatus = "";
          this.addForm.initStatusName = "";
        }
      },
      changeModifyIsHasStartStatus() {
        if (this.modifyForm.isHasStartStatus === "1") {
          this.modifyIsShow = true;
          if (this.modifyForm.funcNo !== "" && this.modifyForm.funcNo !== null) {
            this.modifyForm.initStatus = this.modifyForm.funcNo + "01";
          }
        } else {
          this.modifyIsShow = false;
          this.modifyForm.initStatus = "";
          this.modifyForm.initStatusName = "";
        }
      },
      //前置状态弹窗行选中
      beforeStatusHandleSelectChange(arr) {
        this.beforeStatusCurrentSelectRow = arr;
      },
      //前置状态弹窗
      queryBeforeStatus() {
        this.beforeStatusCurFuncNo = this.currentSelectRow[0].funcNo;
        this.beforeStatusCurFuncName = this.currentSelectRow[0].funcName;
        this.beforeStatusWin = true;
        this.$nextTick(() => {
          let funcNo = this.currentSelectRow[0].funcNo;
          let moduleNo = funcNo.toString().substring(2, 6);
          this.beforeStatusForm.moduleNo = moduleNo;
          this.beforeStatusForm.curFuncNo = funcNo;
          this.beforeStatusFormSearch();
        });
      },
      //前置状态弹窗确定
      queryBeforeStatusSubmit() {
        if (this.beforeStatusCurrentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        let list = this.beforeStatusCurrentSelectRow;
        let funcStatus = "";
        let funcStatusName = "";
        for (let i = 0; i < list.length; i++) {
          funcStatus += list[i].funcStatus;
          funcStatusName += list[i].funcStatusName;
          if (i < list.length - 1) {
            funcStatus += "|";
            funcStatusName += "|";
          }
        }
        this.completeBeforeForm.beforeStatus = funcStatus;
        this.completeBeforeForm.beforeStatusName = funcStatusName;
        this.queryBeforeStatusClose();
      },
      //前置状态弹窗关闭
      queryBeforeStatusClose() {
        this.beforeStatusWin = false;
        this.beforeStatusCurrentSelectRow = [];
      },
      //下一功能号弹窗行选中
      nextFuncNoHandleSelectChange(arr) {
        this.nextFuncNoCurrentSelectRow = arr;
      },
      //下一功能号弹窗
      queryNextFuncId() {
        this.nextFuncNoCurFuncNo = this.currentSelectRow[0].funcNo;
        this.nextFuncNoCurFuncName = this.currentSelectRow[0].funcName;
        this.nextFuncNoWin = true;
        this.$nextTick(() => {
          let funcNo = this.currentSelectRow[0].funcNo;
          let moduleNo = funcNo.toString().substring(2, 6);
          this.nextFuncNoFormItem.moduleNo = moduleNo;
          this.nextFuncNoFormItem.curFuncNo = funcNo;
          this.nextFuncNoFormItemSearch();
        });
      },
      //下一功能号弹窗确定
      nextFuncNoSubmit() {
        if (this.nextFuncNoCurrentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.completeAfterForm.nextFuncNo = this.nextFuncNoCurrentSelectRow[0].funcNo;
        this.completeAfterForm.nextFuncName = this.nextFuncNoCurrentSelectRow[0].funcName;
        this.nextFuncNoWinClose();
      },
      //下一功能号弹窗关闭
      nextFuncNoWinClose() {
        this.nextFuncNoWin = false;
        this.nextFuncNoCurrentSelectRow = [];
      },
      //表单查询
      handleSearch() {
        this.$nextTick(() => {
          this.$refs.datagrid.dataChange(1);
          this.currentSelectRow = [];
        });
      },
      //重置表单查询结果
      resetSearch() {
        this.$refs.formItem.resetFields();
      },
      //行选中
      handleRowClick(arr) {
        this.currentSelectRow = arr;
      },

      //新增
      addFlowStatus() {
        this.addFlowStatusWin = true;
      },
      //新增弹窗确定
      addFlowStatusWinSubmit() {
        if (!this.addIsShow) {
          this.addForm.initStatus = "";
          this.addForm.initStatusName = "";
        }
        this.$refs["addForm"].validate(valid => {
          if (valid) {
            let url = "/sm/auth/flowStatus/func_addFlowStatus";
            this.submitFlag = true;
            post(this.addForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.addFlowStatusWinClose();
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //新增弹窗关闭
      addFlowStatusWinClose() {
        this.addFlowStatusWin = false;
        this.$refs.addForm.resetFields();
        this.addForm.isHasStartStatus = "";
      },

      //修改
      modifyFlowStatus(str) {
        this.firstOrSecond = str;
        if (this.firstOrSecond === "first") {
          if (this.currentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: "请先选择记录！" });
            return;
          }
          let id = this.currentSelectRow[0].id;
          this.modifyForm.id = this.currentSelectRow[0].id;
          post({ id: id }, "/sm/auth/flowStatus/func_pageQueryFlowStatus").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.modifyForm.funcNo = res.data.retData.list[0].funcNo;
                this.modifyForm.funcName = res.data.retData.list[0].funcName;
                this.modifyForm.initStatus = res.data.retData.list[0].initStatus;
                this.modifyForm.initStatusName = res.data.retData.list[0].initStatusName;
                this.modifyForm.changeStatus = res.data.retData.list[0].changeStatus;
                this.modifyForm.changeStatusName = res.data.retData.list[0].changeStatusName;
                if (this.modifyForm.initStatus !== null && this.modifyForm.initStatus !== "" && this.modifyForm.initStatusName !== null && this.modifyForm.initStatusName !== "") {
                  this.modifyForm.isHasStartStatus = "1";
                } else {
                  this.modifyForm.isHasStartStatus = "0";
                }
                this.modifyFlowStatusWin = true;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        } else if (this.firstOrSecond === "second") {
          if (this.nextFuncNoCurrentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: "请先选择记录！" });
            return;
          }
          let id = this.nextFuncNoCurrentSelectRow[0].id;
          this.modifyForm.id = this.nextFuncNoCurrentSelectRow[0].id;
          post({ id: id }, "/sm/auth/flowStatus/func_pageQueryFlowStatus").then(res => {
            if (res) {
              let msg = res.data.retMsg;
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.modifyForm.funcNo = res.data.retData.list[0].funcNo;
                this.modifyForm.funcName = res.data.retData.list[0].funcName;
                this.modifyForm.initStatus = res.data.retData.list[0].initStatus;
                this.modifyForm.initStatusName = res.data.retData.list[0].initStatusName;
                this.modifyForm.changeStatus = res.data.retData.list[0].changeStatus;
                this.modifyForm.changeStatusName = res.data.retData.list[0].changeStatusName;
                if (this.modifyForm.initStatus !== null && this.modifyForm.initStatus !== "" && this.modifyForm.initStatusName !== null && this.modifyForm.initStatusName !== "") {
                  this.modifyForm.isHasStartStatus = "1";
                } else {
                  this.modifyForm.isHasStartStatus = "0";
                }
                this.modifyFlowStatusWin = true;
              } else {
                this.$msgTip.error(this, { info: msg });
              }
            } else {
              this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
            }
          });
        }
      },
      //修改弹窗确定
      modifyFlowStatusWinSubmit() {
        if (!this.modifyIsShow) {
          this.modifyForm.initStatus = "";
          this.modifyForm.initStatusName = "";
        }
        this.$refs["modifyForm"].validate(valid => {
          if (valid) {
            this.submitFlag = true;
            post(this.modifyForm, "/sm/auth/flowStatus/func_addFlowStatus").then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.modifyFlowStatusWinClose();
                  if (this.firstOrSecond === "first") {
                    this.handleSearch();
                  } else if (this.firstOrSecond === "second") {
                    this.nextFuncNoFormItemSearch();
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //修改弹窗关闭
      modifyFlowStatusWinClose() {
        this.modifyFlowStatusWin = false;
        this.$refs.modifyForm.resetFields();
        this.modifyForm.isHasStartStatus = "";
        this.modifyForm.id = "";
      },

      //完善前置状态
      completeBeforeStatus() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.completeBeforeForm.id = this.currentSelectRow[0].id;
        this.completeBeforeForm.funcNo = this.currentSelectRow[0].funcNo;
        this.completeBeforeForm.funcName = this.currentSelectRow[0].funcName;
        this.completeBeforeWin = true;
      },
      //完善前置状态弹窗确定
      completeBeforeWinSubmit() {
        this.$refs["completeBeforeForm"].validate(valid => {
          if (valid) {
            let url = "/sm/auth/flowStatus/func_completeBeforeStatus";
            this.submitFlag = true;
            post(this.completeBeforeForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.completeBeforeWinClose();
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //完善前置状态弹窗关闭
      completeBeforeWinClose() {
        this.completeBeforeWin = false;
        this.$refs.completeBeforeForm.resetFields();
      },

      //重置前置状态
      resetBeforeStatus() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        let id = this.currentSelectRow[0].id;
        post({ id: id }, "/sm/auth/flowStatus/func_resetBeforeStatus").then(res => {
          if (res) {
            let msg = res.data.retMsg;
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.handleSearch();
            } else {
              this.$msgTip.error(this, { info: msg });
            }
          } else {
            this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
          }
        });
      },
      //完善后置状态
      completeAfterStatus() {
        if (this.currentSelectRow.length === 0) {
          this.$msgTip.info(this, { info: "请先选择记录！" });
          return;
        }
        this.completeAfterForm.id = this.currentSelectRow[0].id;
        this.completeAfterForm.funcNo = this.currentSelectRow[0].funcNo;
        this.completeAfterForm.funcName = this.currentSelectRow[0].funcName;
        this.completeAfterWin = true;
      },
      //完善后置状态弹窗确定
      completeAfterWinSubmit() {
        this.$refs["completeAfterForm"].validate(valid => {
          if (valid) {
            let url = "/sm/auth/flowStatus/func_completeFuncStatus";
            this.submitFlag = true;
            post(this.completeAfterForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.completeAfterWinClose();
                  this.handleSearch();
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      //完善后置状态弹窗关闭
      completeAfterWinClose() {
        this.completeAfterWin = false;
        this.$refs.completeAfterForm.resetFields();
      },

      //功能号超链接 删除
      deleteFuncNo(str) {
        this.firstOrSecond = str;
        if (this.firstOrSecond === "first") {
          if (this.funcNoCurrentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          let id = this.funcNoCurrentSelectRow[0].id;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              post({ id: id }, "/sm/auth/flowStatus/func_deleteFuncStatus").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.funcNoFormItemSearch();
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        } else if (this.firstOrSecond === "second") {
          if (this.beforeStatusCurrentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          if (this.beforeStatusCurrentSelectRow.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          let id = this.beforeStatusCurrentSelectRow[0].id;
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              post({ id: id }, "/sm/auth/flowStatus/func_deleteFuncStatus").then(res => {
                if (res) {
                  let msg = res.data.retMsg;
                  let retCode = res.data.retCode;
                  if (retCode === "000000") {
                    this.$msgTip.success(this);
                    this.beforeStatusFormSearch();
                  } else {
                    this.$msgTip.error(this, { info: msg });
                  }
                } else {
                  this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
                }
              });
            }
          });
        }
      },
      //功能号超链接 修改
      modifyFuncStatusName(str) {
        this.firstOrSecond = str;
        if (this.firstOrSecond === "first") {
          if (this.funcNoCurrentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          this.modifyFuncStatusForm.id = this.funcNoCurrentSelectRow[0].id;
          this.modifyFuncStatusForm.funcStatusName = this.funcNoCurrentSelectRow[0].funcStatusName;
          this.modifyFuncStatusWin = true;
        } else if (this.firstOrSecond === "second") {
          if (this.beforeStatusCurrentSelectRow.length === 0) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.chooseDataFirst") });
            return;
          }
          if (this.beforeStatusCurrentSelectRow.length > 1) {
            this.$msgTip.info(this, { info: this.$t("m.i.common.onlyChooseOneData") });
            return;
          }
          this.modifyFuncStatusForm.id = this.beforeStatusCurrentSelectRow[0].id;
          this.modifyFuncStatusForm.funcStatusName = this.beforeStatusCurrentSelectRow[0].funcStatusName;
          this.modifyFuncStatusWin = true;
        }
      },
      modifyFuncStatusWinSubmit() {
        this.$refs["modifyFuncStatusForm"].validate(valid => {
          if (valid) {
            let url = "/sm/auth/flowStatus/func_updateFuncStatusName";
            this.submitFlag = true;
            post(this.modifyFuncStatusForm, url).then(res => {
              this.submitFlag = false;
              if (res) {
                let msg = res.data.retMsg;
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                  this.modifyFuncStatusWinClose();
                  if (this.firstOrSecond === "first") {
                    this.funcNoFormItemSearch();
                  } else if (this.firstOrSecond === "second") {
                    this.beforeStatusFormSearch();
                  }
                } else {
                  this.$msgTip.error(this, { info: msg });
                }
              } else {
                this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
              }
            });
          }
        });
      },
      modifyFuncStatusWinClose() {
        this.modifyFuncStatusWin = false;
        this.$refs.modifyFuncStatusForm.resetFields();
        this.modifyFuncStatusForm.id = "";
      }

    }
  };
</script>

<style scoped>

</style>
