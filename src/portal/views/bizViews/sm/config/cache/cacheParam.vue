<!--缓存管理-->
<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 4}">
    <h-row name="flex" class="layout-menu-wrapper">
      <!--左侧树-->
      <h-col :span="spanLeft" class="layout-menu-left">
        <div>
          <div class="h-tree-search h-sidebar-menutree">
            <div class="h-sidebar-menutree-header">
              <h-button type="primary" @click="handleExpandTree(cacheParamTree)" :disabled="isExpandDisabled">
                {{$t("m.i.common.expand")}}
              </h-button>
              <h-button type="primary" @click="handleUnExpandTree(cacheParamTree)" :disabled="isNotExpandDisabled">
                {{$t("m.i.common.noExpand")}}
              </h-button>
            </div>
            <div class="h-sidebar-menutree-body">
              <h-tree
                :data="cacheParamTree"
                :show-checkbox="false"
                @on-select-change="orgSelectChange"
                @on-toggle-expand="toggleExpand"
                :style="{height: mBarHeight-153 + 'px',overflow: 'auto'}"
                ref="cacheParamTree"></h-tree>
            </div>
          </div>
        </div>
      </h-col>
      <!--右侧数据展示表格-->
      <h-col :span="spanRight" class="layout-menu-right">
        <div ref="cacheForDict">
          <!--查询表单-->
          <div class="h-form-search-box" :style="formBoxStyle">
            <h-panel class="clearfix">
              <h-form :model="formItem" :label-width="115" ref="formItem" cols="4" class="h-form-search">
                <!--系统字典信息缓存-->
                <div v-show="menuId === '0002'">
                  <h-form-item :label="$t('m.i.config.dictGroupCode')" prop="dictGroupCode" :required="isRequired">
                    <h-input v-model="formItem.dictGroupCode" :maxlength="32"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.config.dictKey')" prop="key">
                    <h-input v-model="formItem.key" :maxlength="30"></h-input>
                  </h-form-item>
                </div>
                <!--产品信息缓存-->
                <div v-show="menuId === '0004'">
                  <h-form-item :label="$t('m.i.common.prodNo')" prop="prodNo">
                    <h-input v-model="formItem.prodNo" :maxlength="10"></h-input>
                  </h-form-item>
                </div>
                <!--报文模板信息缓存，报文延迟队列缓存-->
                <div v-show="menuId === '0005' || menuId === '0010'">
                  <h-form-item :label="$t('m.i.common.draftNo')" prop="draftNo">
                    <h-input v-model="formItem.draftNo" :maxlength="20"></h-input>
                  </h-form-item>
                </div>
                <!--法人信息缓存-->
                <div v-show="menuId === '0006'">
                  <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo">
                    <h-input v-model="formItem.legalNo" :maxlength="6"></h-input>
                  </h-form-item>
                </div>
                <!--会员信息缓存-->
                <div v-show="menuId === '0007'">
                  <h-form-item :label="$t('m.i.common.memberId')" prop="memberId">
                    <h-input v-model="formItem.memberId" :maxlength="6"></h-input>
                  </h-form-item>
                </div>
                <!--行内机构信息缓存-->
                <div v-show="menuId === '0008'">
                  <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo">
                    <h-input v-model="formItem.legalNo" :maxlength="6"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.common.brchNo')" prop="brchNo">
                    <h-input v-model="formItem.brchNo" :maxlength="30"></h-input>
                  </h-form-item>
                </div>
                <!--场内机构信息缓存-->
                <div v-show="menuId === '0009'">
                  <h-form-item :label="$t('m.i.common.cpesBrchCode')" prop="brchCode">
                    <h-input v-model="formItem.brchCode" :maxlength="9"></h-input>
                  </h-form-item>
                </div>
                <!--redis锁缓存-->
                <div v-show="menuId === '0011'">
                  <h-form-item :label="$t('m.i.config.uniqueKey')" prop="uniqueKey">
                    <h-input v-model="formItem.uniqueKey" :maxlength="100"></h-input>
                  </h-form-item>
                </div>
                <!--分录数据缓存-->
                <div v-show="menuId === '0012'">
                  <h-form-item :label="$t('m.i.config.acctTranNo')" prop="transEventNo">
                    <h-input v-model="formItem.transEventNo" :maxlength="30"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.config.acctTranName')" prop="transName">
                    <h-input v-model="formItem.transName" :maxlength="100"></h-input>
                  </h-form-item>
                </div>
                <!--基础数据缓存-->
                <div v-show="menuId === '0013'">
                  <h-form-item :label="$t('m.i.shcpe.comdataTypeCode')" prop="comDataTypeCode">
                    <h-select v-model="formItem.comDataTypeCode" placeholder="" showTitle>
                      <h-option value="CDS00001">交易参数</h-option>
                      <h-option value="CDS00002">运行时段参数</h-option>
                      <h-option value="CDS00003">省份</h-option>
                      <h-option value="CDS00004">机构类别</h-option>
                      <h-option value="CDS00005">机构类型</h-option>
                      <h-option value="CDS00006">机构类型类别关系</h-option>
                      <h-option value="CDS00007">信用等级顺序</h-option>
                      <h-option value="CDS00008">最大数量限制</h-option>
                      <h-option value="CDS00009">再贴现利率</h-option>
                    </h-select>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.shcpe.comdataDataCode')" prop="comDataCode">
                    <h-input v-model="formItem.comDataCode" :maxlength="50"></h-input>
                  </h-form-item>
                </div>
                <!--环境变量参数配置项，配置中心参数配置项-->
                <div v-show="menuId === '0014' || menuId === '0015'">
                  <h-form-item :label="$t('m.i.auth.paramKey')" prop="paramNo">
                    <h-input v-model="formItem.paramNo" :maxlength="100"></h-input>
                  </h-form-item>
                </div>
                <!--ECDS行号数据缓存-->
                <div v-show="menuId === '0017'">
                  <h-form-item :label="'行号'" prop="bankNo">
                    <h-input v-model="formItem.bankNo" :maxlength="100"></h-input>
                  </h-form-item>
                </div>
                <div v-show="menuId === '0018'">
                  <h-form-item :label="$t('m.i.shcpe.meetCode')" prop="meetCode">
                    <h-input v-model="formItem.meetCode" :maxlength="100"></h-input>
                  </h-form-item>
                </div>
                <div v-show="menuId === '0019'">
                  <h-form-item :label="$t('m.i.config.redisKey')" prop="key" :validRules="redisKeyRule">
                    <h-input v-model="formItem.key" :maxlength="100"></h-input>
                  </h-form-item>
                  <div style="position: absolute;margin-top: 45px;margin-left: 60px;color: #ef2222">若缓存key存在分组情况，则查询值为：groupName:key 例如:bbep#dict#BusiType:BT01</div>
                </div>
                <!--系统业务参数缓存-->
                <div v-show="menuId === '0020'">
                  <h-form-item :label="$t('m.i.common.legalNo')" prop="legalNo">
                    <h-input v-model="formItem.legalNo" :maxlength="6"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.auth.paramKey')" prop="paramKey">
                    <h-input v-model="formItem.paramKey" :maxlength="50"></h-input>
                  </h-form-item>
                  <h-form-item :label="$t('m.i.auth.paramName')" prop="paramName">
                    <h-input v-model="formItem.paramName" :maxlength="100"></h-input>
                  </h-form-item>
                </div>
                <div v-show="menuId !== '0003' && menuId !== '0016' && menuId !== '0021' && menuId !== '0022'">
                  <h-form-item class="h-form-operate" :class="[formClassAdd == '1' ? 'one-form' : formClassAdd == '2' ? 'two-form' : '']">
                    <h-button type="primary" @click="formSearch()">{{$t("m.i.common.search")}}</h-button>
                    <h-button type="ghost" @click="formSearchReset()">{{$t("m.i.common.reset")}}</h-button>
                  </h-form-item>
                </div>
              </h-form>
            </h-panel>
          </div>
          <!--数据展示表格 待修改-->
          <h-datagrid
            :columns="columns"
            highlight-row
            :url="datagridUrl"
            :bindForm="formItem"
            :onCurrentChange="handleCurrentChange"
            :onCurrentChangeCancel="handleCurrentChangeCancel"
            ref="datagrid">
            <div slot="toolbar" class="pull-left">
              <div v-if="menuId === '0010'"></div>
              <div v-if="menuId === '0011'">
                <h-button type="primary" @click="unlockDelete" v-if="authObj.delete">
                  {{$t("m.i.config.unlockDelete")}}
                </h-button>
              </div>
              <div v-else-if="menuId === '0012'">

                <h-button type="primary" @click="updateRecordDetail" v-if="authObj.recordDetail">
                  {{$t("m.i.config.refreshCache")}}
                </h-button>
              </div>
              <div v-else-if="menuId === '0015'">

              </div>
              <div v-else-if="menuId === '0016'">

              </div>
              <div v-else-if="menuId === '0017'">
                <h-button type="primary" @click="clearBankData">
                  清空
                </h-button>
              </div>
              <div v-else-if="menuId === '0018'">
                <h-button type="primary" @click="clearApData">
                  清空
                </h-button>
              </div>
              <div v-else-if="menuId === '0019'">
                <h-button type="primary" @click="deleteRedisByKey">
                  删除
                </h-button>
              </div>
              <div v-else-if="menuId === '0022'">
                <h-button type="primary" @click="deleteExportGroup">
                  清空
                </h-button>
              </div>
              <div v-else>
                <h-button type="primary" @click="refreshCache" v-if="authObj.refresh">
                  {{$t("m.i.config.refreshCache")}}
                </h-button>
              </div>
            </div>
          </h-datagrid>
        </div>
      </h-col>
    </h-row>
    <acct-record-detail :recordDetailWin="recordDetailWin" :transEventNo="transEventNo"
                        @recordDetailWinClose="recordDetailWinClose" title="分录详情"></acct-record-detail>
  </div>
</template>

<script>
  import {post, on, off} from "@/api/bizApi/commonUtil";

  export default {
    name: "cacheParam",
    data() {
      return {
        cacheParamList: [],
        //系统缓存树结构列表
        initCacheParam: [{
          title: "系统缓存",
          id: "0000",
          parentId: "",
          expand: true,
          children: [
            {
              title: "系统字典信息缓存",
              id: "0002",
              parentId: "0000",
              expand: false
            },
            {
              title: "营业日期信息缓存",
              id: "0003",
              parentId: "0000",
              expand: false
            },
            {
              title: "产品信息缓存",
              id: "0004",
              parentId: "0000",
              expand: false
            },
            {
              title: "报文模板信息缓存",
              id: "0005",
              parentId: "0000",
              expand: false
            },
            {
              title: "法人信息缓存",
              id: "0006",
              parentId: "0000",
              expand: false
            }, {
              title: "会员信息缓存",
              id: "0007",
              parentId: "0000",
              expand: false
            },
            {
              title: "行内机构信息缓存",
              id: "0008",
              parentId: "0000",
              expand: false
            },
            {
              title: "场内机构信息缓存",
              id: "0009",
              parentId: "0000",
              expand: false
            },
            {
              title: "报文延迟队列缓存",
              id: "0010",
              parentId: "0000",
              expand: false
            },
            {
              title: "redis锁缓存",
              id: "0011",
              parentId: "0000",
              expand: false
            },
            {
              title: "分录数据缓存",
              id: "0012",
              parentId: "0000",
              expand: false
            },
            {
              title: "基础数据缓存",
              id: "0013",
              parentId: "0000",
              expand: false
            },
            {
              title: "环境变量参数配置项",
              id: "0014",
              parentId: "0000",
              expand: false
            },
            {
              title: "配置中心参数配置项",
              id: "0015",
              parentId: "0000",
              expand: false
            },
            {
              title: "ECDS行号数据缓存",
              id: "0017",
              parentId: "0000",
              expand: false
            },
            {
              title: "redis缓存单项维护",
              id: "0019",
              parentId: "0000",
              expand: false
            },
            {
              title: "系统业务参数缓存",
              id: "0020",
              parentId: "0000",
              expand: false
            }]
        }],
        cacheParamTree: [],
        //缓存树收缩是否可用
        isDisabled: true,
        isExpandDisabled: true,
        isNotExpandDisabled: false,
        flag: false,
        addBtnDisabled: false,
        isRequired: false,
        formItem: {
          dictGroupCode: "",
          key: "",
          prodNo: "",
          draftNo: "",
          legalNo: "",
          memberId: "",
          brchNo: "",
          brchCode: "",
          uniqueKey: "",
          transEventNo: "",
          transName: "",
          comDataTypeCode: "",
          comDataCode: "",
          paramNo: "",
          paramKey: "",
          paramName: "",
          bankNo: "",
          meetCode: "",
          transNo:""
        },
        spanLeft: 4,
        spanRight: 20,
        //给按钮增加权限
        authObj: {
          refresh: true, //缓存字典刷新
          delete: true, //redis锁解锁删除
          recordDetail: true  //分录详情
        },
        columns: [
          {
            type: "radio",
            title: " ",
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
            title: this.$t("m.i.config.dictGroupCode"),
            key: "dictGroupCode",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.config.dictKey"),
            key: "dictKey",
            hiddenCol: false,
            ellipsis: false,
            sortable: true
          },
          {
            title: this.$t("m.i.config.dictValue"),
            key: "dictValue",
            hiddenCol: false,
            ellipsis: false
          }
        ],
        currentSelectRow: null,
        datagridUrl: "/sm/config/cache/cacheParam/func_loadIngCacheForDict",
        menuId: "0002",
        //分录详情弹出框
        recordDetailWin: false,
        //场景编号
        transEventNo: "",
        dictMap: new Map(),
        redisKeyRule: [{test: /^[^*]+$/, message: '缓存key值不能包含*字符', trigger: 'blur'}],
        mBarHeight: 0,
        formClassAdd: "2"
      }
    },
    components: {
      AcctRecordDetail: () => import( /* webpackChunkName: "sm/config/cache/acctRecordDetail" */ '@/views/bizViews/sm/config/cache/acctRecordDetail')
    },
    methods: {
      handleResize() {
        this.$nextTick(() => {
          this.mBarHeight = window.innerHeight;
        });
      },
      //收拢左侧树
      handleUnExpandTree(arr) {
        this.recursiveTree(arr, false);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = false;
        this.isNotExpandDisabled = true;
      },
      //展开左侧树
      handleExpandTree(arr) {
        this.recursiveTree(arr, true);
        this.isDisabled = !this.isDisabled;
        this.isExpandDisabled = true;
        this.isNotExpandDisabled = false;
      },
      //递归给左侧树赋值
      recursiveTree(arr, isExpand) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].children) {
            arr[i].expand = isExpand;
            this.recursiveTree(arr[i].children, isExpand);
          }
        }
      },
      orgSelectChange(item) {
        this.$refs.formItem.resetFields();
        this.formClassAdd = "2";
        if (item.length > 0) {
          this.menuId = item[0].id;
          switch (this.menuId) {
            case "0002":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForDict";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.config.dictGroupCode"),
                  key: "dictGroupCode",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.config.dictKey"),
                  key: "dictKey",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.config.dictValue"),
                  key: "dictValue",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0003":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForBusiDate";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.busiDt"),
                  key: "workday",
                  hiddenCol: false,
                  ellipsis: false,
                  render: (h, params) => {
                    let day = params.row.workday == null ? "" : this.$moment(params.row.workday, "YYYY-MM-DD").format("YYYY-MM-DD");
                    return h("span", day);
                  }
                },
                {
                  title: this.$t("m.i.common.busiStatus"),
                  key: "sysStatus",
                  hiddenCol: false,
                  ellipsis: false,
                  render: (h, params) => {
                    let info = params.row.sysStatus;
                    switch (params.row.sysStatus) {
                      case "0":
                        info = "日终";
                        break;
                      case "1":
                        info = "日间";
                        break;
                    }
                    return h("span", info);
                  }
                }
              ];
              break;
            case "0004":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForProduct";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.prodNo"),
                  key: "prodNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.parentProdNo"),
                  key: "parentProdNo",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.prodName"),
                  key: "prodName",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.config.prodCategory"),
                  key: "prodCategory",
                  hiddenCol: false,
                  ellipsis: false,
                  render: (h, params) => {
                    let list = this.getDictValueFromMap(this.dictMap, "prodCategory", params.row.prodCategory);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                },
                {
                  title: this.$t("m.i.config.prodKind"),
                  key: "prodKind",
                  hiddenCol: false,
                  ellipsis: false,
                  render: (h, params) => {
                    let list = this.getDictValueFromMap(this.dictMap, "prodKind", params.row.prodKind);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                }
              ];
              break;
            case "0005":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForDraftTemplate";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.draftNo"),
                  key: "draftNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.config.draftTemplateMsg"),
                  key: "draftTemplateMsg",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0006":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForLegalPerson";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.legalNo"),
                  key: "legalNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.legalpersonName"),
                  key: "legalpersonName",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.brchName"),
                  key: "brchName",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.brchAddr"),
                  key: "brchAddr",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.socCode"),
                  key: "socCode",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.bankNo"),
                  key: "bankNo",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.transferBankNo"),
                  key: "transferBankNo",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.orgCode"),
                  key: "orgCode",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.memberId"),
                  key: "memberId",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.memberName"),
                  key: "memberName",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0007":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForMember";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.memberId"),
                  key: "memberId",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.memberName"),
                  key: "memberName",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.shcpe.memberTypeCode"),
                  key: "memberTypeCode",
                  hiddenCol: false,
                  ellipsis: false,
                  render: (h, params) => {
                    let list = this.getDictValueFromMap(this.dictMap, "MemberType", params.row.memberTypeCode);
                    return h("span",
                      {
                        domProps: {
                          title: list
                        }
                      }, list);
                  }
                },
                {
                  title: this.$t("m.i.common.memberBankNo"),
                  key: "memberBankNo",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0008":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForBrch";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.legalNo"),
                  key: "legalNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.brchNo"),
                  key: "brchNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.brchName"),
                  key: "brchName",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.brchShortNameZh"),
                  key: "brchShortNameZh",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: "机构行号",
                  key: "bankNo",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t('m.i.common.parentBrchNo'),
                  key: "parentBrchNo",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.cpesBrchCode"),
                  key: "cpesBrchCode",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.cpesBrchName"),
                  key: "cpesBrchName",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.auth.virtualTellerNo"),
                  key: "virtualTellerNo",
                  ellipsis: false,
                  hiddenCol: false
                }
              ];
              break;
            case "0009":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForBusinessBranch";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.cpesBrchCode"),
                  key: "brchCode",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.memberId"),
                  key: "memberId",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.shcpe.brchNum"),
                  key: "brchNum",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.brchName"),
                  key: "brchFullNameZh",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.brchShortNameZh"),
                  key: "brchShortNameZh",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.socCode"),
                  key: "socCode",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t('m.i.common.transBrchBankNo'),
                  key: "transBrchBankNo",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: "客户号",
                  key: "custNo",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0010":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForDraftQueue";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.msgId"),
                  key: "msgId",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.draftNo"),
                  key: "draftNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.receiveTime"),
                  key: "creDtTm",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true,
                  render: (h, params) => {
                    let date = params.row.creDtTm == null ? "" : this.$moment(params.row.creDtTm, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                    return h("span", date);
                  }
                }
              ];
              break;
            case "0011":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForRedisLock";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.config.uniqueKey"),
                  key: "uniqueKey",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: "加锁时间",
                  key: "createTime",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true,
                  render: (h, params) => {
                    let date = params.row.createTime == null ? "" : this.$moment(params.row.createTime, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                    return h("span", date);
                  }
                }
              ];
              break;
            case "0012":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForAcctRecord";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.config.acctTranNo"),
                  key: "transEventNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.config.acctTranName"),
                  key: "transName",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.prodNo"),
                  key: "prodNo",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.config.eventNo"),
                  key: "eventNo",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.config.acctModel"),
                  key: "acctMode",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.config.historyFlag"),
                  key: "balanceFlag",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0013":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadBaseDataCache";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.config.comDataType"),
                  key: "comdataTypeCode",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.shcpe.comdataTypeCode"),
                  key: "comdataTypeName",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.shcpe.comdataDataCode"),
                  key: "comdataDataCode",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.shcpe.comdataName"),
                  key: "comdataName",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.common.paramValue"),
                  key: "currentParamValue",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.shcpe.fieldType"),
                  key: "fieldType",
                  hiddenCol: false,
                  ellipsis: false,
                  render: (h, params) => {
                    let info = params.row.fieldType;
                    switch (params.row.fieldType) {
                      case "CT00":
                        info = "日期";
                        break;
                      case "CT01":
                        info = "字符串";
                        break;
                      case "CT02":
                        info = "金额";
                        break;
                      case "CT03":
                        info = "数字";
                      case "CT04":
                        info = "时间";
                        break;
                    }
                    return h("span", info);
                  }
                },
                {
                  title: this.$t("m.i.common.remark"),
                  key: "remark",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0014":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadEnvParamCache";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.auth.paramKey"),
                  key: "paramNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.paramValue"),
                  key: "paramValue",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0015":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadConfigurationParamCache";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.auth.paramKey"),
                  key: "paramNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.paramValue"),
                  key: "paramValue",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
            case "0016":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadQueueTaskCache";
              this.columns = [
                {
                  title: this.$t("m.i.common.index"),
                  type: "index",
                  width: 60,
                  align: "center",
                  hiddenCol: false
                },
                {
                  title: this.$t("m.i.queuetask.taskCode"),
                  key: "taskCode",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.batchNo"),
                  key: "batchNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.billInfo.billNo"),
                  key: "billNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.config.uniqueKey"),
                  key: "busiId",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                }
              ];
              break;
            case "0017":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadEcdsBankDataCache";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.bm.unionBankNo"),
                  key: "bankNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.shcpe.actorFullCall"),
                  key: "actorFullCall",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.shcpe.meetCode"),
                  key: "meetIncomeCode",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.shcpe.continueBankNo"),
                  key: "continueBankNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.common.address"),
                  key: "address",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                }
              ];
              break;
            case "0018":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadEcdsApDataCache";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.shcpe.meetCode"),
                  key: "meetCode",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.shcpe.meetName"),
                  key: "meetName",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.shcpe.nonceCcpc"),
                  key: "nonceCcpc",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.shcpe.meetStatus"),
                  key: "meetStatus",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                }
              ];
              break;
            case "0019":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngRedisBykey";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.config.redisKey"),
                  key: "key",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.config.redisValue"),
                  key: "value",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                }
              ];
              break;
            case "0020":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngSysBusinessParam";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.common.legalNo"),
                  key: "legalNo",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: this.$store.getters.userInfo.userType === "1"
                },
                {
                  title: this.$t("m.i.auth.paramKey"),
                  key: "paramKey",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.auth.paramName"),
                  key: "paramName",
                  ellipsis: false,
                  hiddenCol: false
                },
                {
                  title: this.$t("m.i.common.paramValue"),
                  key: "paramValue",
                  hiddenCol: false,
                  ellipsis: false
                },
                {
                  title: this.$t("m.i.auth.paramTitle"),
                  key: "paramTitle",
                  ellipsis: false,
                  hiddenCol: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.auth.paramRemark"),
                  key: "paramRemark",
                  ellipsis: false,
                  hiddenCol: false
                }
              ];
              this.formClassAdd = "";
              break;
            case "0021":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngTransStatusCfg";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.bm.transNo"),
                  key: "transName",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                }
              ];
              this.formClassAdd = "";
              break;
            case "0022":
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadRedisExportCountCache";
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: '分组名称',
                  key: "groupName",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: '文件名称',
                  key: "excelName",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                }
              ];
              break;
            default:
              this.datagridUrl = "/sm/config/cache/cacheParam/func_loadIngCacheForDict";
              this.menuId = '0002';
              this.columns = [
                {
                  type: "radio",
                  title: " ",
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
                  title: this.$t("m.i.config.dictGroupCode"),
                  key: "dictGroupCode",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.config.dictKey"),
                  key: "dictKey",
                  hiddenCol: false,
                  ellipsis: false,
                  sortable: true
                },
                {
                  title: this.$t("m.i.config.dictValue"),
                  key: "dictValue",
                  hiddenCol: false,
                  ellipsis: false
                }
              ];
              break;
          }
          this.$nextTick(() => {
            this.$refs.datagrid.createShowCol(this.columns);
            this.formSearch();
          });
        }
      },
      formSearch() {
        this.currentSelectRow = [];
        if (this.menuId === "0002") {
          if (this.formItem.key == null || this.formItem.key === "") {
            this.isRequired = false;
            this.$refs.datagrid.dataChange(1);
          } else {
            this.isRequired = true;
            this.$nextTick(() => {
              this.$refs["formItem"].validate(valid => {
                if (valid) {
                  this.$refs.datagrid.dataChange(1);
                }
              });
            });
          }
        } else {
          this.$refs.datagrid.dataChange(1);
        }
      },
      formSearchReset() {
        this.$refs.formItem.resetFields();
      },
      handleCurrentChange(currentRow) {
        this.currentSelectRow = currentRow;
      },
      handleCurrentChangeCancel() {
        this.currentSelectRow = [];
      },
      // redis解锁删除
      unlockDelete() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.handleDel();
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      handleDel() {
        let uniqueKey = this.currentSelectRow.uniqueKey;
        post({code: uniqueKey}, "/sm/config/cache/cacheParam/func_deleteRedisLockCache").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      //根据key删除rdeis
      deleteRedisByKey() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.$hMsgBox.confirm({
            title: this.$t("m.i.common.confirm"),
            content: this.$t("m.i.common.isConfirmDelete") + "?",
            onOk: () => {
              this.redisDel();
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      redisDel() {
        let key = this.currentSelectRow.key;
        post({code: key}, "/sm/config/cache/cacheParam/func_removeRedisCacheByKey").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      showRecordDetail() {
        if (this.currentSelectRow != null && this.currentSelectRow.length !== 0) {
          this.recordDetailWin = true;
          this.transEventNo = this.currentSelectRow.transEventNo;
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      updateRecordDetail() {
        this.$hMsgBox.confirm({
          title: this.$t("m.i.common.confirm"),
          content: this.$t("m.i.common.refresh") + "?",
          onOk: () => {
            post({}, "/sm/config/cache/cacheParam/func_refreshCacheForAcctRecord").then(res => {
              if (res) {
                let retCode = res.data.retCode;
                if (retCode === "000000") {
                  this.$msgTip.success(this);
                } else {
                  this.$msgTip.error(this, {info: res.data.retMsg});
                }
              } else {
                this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
              }
            });
          }
        });
      },
      recordDetailWinClose() {
        this.recordDetailWin = false;
      },
      refreshCache() {
        let arr = this.$refs["cacheParamTree"].getSelectedNodes();
        if (arr.length === 0) {
          this.$msgTip.info(this, {info: "请先在左侧树选择一条数据"});
          return;
        }
        post({code: this.menuId}, "/sm/config/cache/cacheParam/func_refreshCache").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(1);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      },
      clearBankData() {
        let row = this.currentSelectRow;
        if (row != null && row.length !== 0) {

          let bankNo = row.bankNo;
          post({bankNo}, "/sm/config/cache/cacheParam/func_refreshEcdsBankDataCache").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.$refs.datagrid.dataChange(1);
                this.currentSelectRow = [];
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      clearApData() {
        let row = this.currentSelectRow;
        if (row != null && row.length !== 0) {
          let meetCode = row.meetCode;
          post({meetCode}, "/sm/config/cache/cacheParam/func_refreshEcdsApDataCache").then(res => {
            if (res) {
              let retCode = res.data.retCode;
              if (retCode === "000000") {
                this.$msgTip.success(this);
                this.$refs.datagrid.dataChange(1);
                this.currentSelectRow = [];
              } else {
                this.$msgTip.error(this, {info: res.data.retMsg});
              }
            } else {
              this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
            }
          });
        } else {
          this.$msgTip.info(this, {info: this.$t("m.i.common.chooseOneData")});
        }
      },
      initCacheParamTree() {
        if (this.cacheParamList && this.cacheParamList.length > 0) {
          let cacheParamTree = {
            title: "系统缓存",
            id: "0000",
            parentId: "",
            expand: true,
            children: []
          }
          for (let cacheParam of this.cacheParamList) {
            cacheParamTree.children.push({
              title: cacheParam.value,
              id: cacheParam.key,
              parentId: "0000",
              expand: false
            })
          }
          this.cacheParamTree = [cacheParamTree];
        } else {
          this.cacheParamTree = this.initCacheParam;
        }
      },
      recursiveAssigNode(menuTreeData, arr) {
        this.flag = false;
        for (let i = 0; i < menuTreeData.length; i++) {
          if (this.flag) {
            break;
          }
          if (menuTreeData[i].id === arr.id) {
            menuTreeData[i] = arr;
            this.flag = true;
            break;
          }
          if (menuTreeData[i].children) {
            this.recursiveAssigNode(menuTreeData[i].children, arr)
          }
        }
      },
      isAllExpand(arr) {
        this.flag = true;
        for (let i = 0; i < arr.length; i++) {
          if (!this.flag) {
            break;
          }
          if (arr[i].expand === false && arr[i].children) {
            this.flag = false;
            break;
          }
          if (arr[i].children) {
            this.isAllExpand(arr[i].children)
          }
        }
      },
      toggleExpand(arr, status) {
        let closeCount = 0;
        this.recursiveAssigNode(this.cacheParamTree, arr);
        this.isAllExpand(this.cacheParamTree);
        // 完全收缩
        for (let i = 0; i < this.cacheParamTree.length; i++) {
          if (this.cacheParamTree[i].expand === false) {
            closeCount++;
          }
        }
        if (closeCount === this.cacheParamTree.length) {
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = true;
          return;
        }
        if(!this.flag){
          this.isExpandDisabled = false;
          this.isNotExpandDisabled = false;
        }else{
          this.isExpandDisabled = true;
          this.isNotExpandDisabled = false;
        }

      },
      deleteExportGroup() {
        this.exportGroupDel();
      },
      exportGroupDel() {
        let key = this.currentSelectRow.key;
        post({code: key}, "/sm/config/cache/cacheParam/func_refreshExportCountCache").then(res => {
          if (res) {
            let retCode = res.data.retCode;
            if (retCode === "000000") {
              this.$msgTip.success(this);
              this.$refs.datagrid.dataChange(this.$refs.datagrid.pageInfo.pageNo);
              this.currentSelectRow = [];
            } else {
              this.$msgTip.error(this, {info: res.data.retMsg});
            }
          } else {
            this.$msgTip.error(this, {info: this.$t("m.i.common.netError")});
          }
        });
      }
    },
    computed: {
      formBoxStyle() {
        let style = {}
        if (this.menuId === '0019') {
          style.paddingBottom = "20px";
        }
        return style;
      },
    },
    created() {
      // post({}, "/sm/config/cache/cacheParam/func_queryCacheMenuTree").then(res => {
      //   if (res) {
      //     let retCode = res.data.retCode;
      //     if (retCode === "000000") {
      //       let data = (res.data.retData instanceof Array) ? res.data.retData : [res.data.retData];
      //       this.cacheParamTree = data;
      //       this.handleExpandTree(this.cacheParamTree);
      //     } else {
      //       this.$msgTip.error(this, { info: res.data.retMsg });
      //     }
      //   } else {
      //     this.$msgTip.error(this, { info: this.$t("m.i.common.netError") });
      //   }
      // });
    },
    mounted() {
      this.handleResize();
      on(window, "resize", this.handleResize);
      this.getDictListByGroups("MemberType,prodCategory,prodKind,CacheParam").then(res => {
        this.dictMap = res.get("map");
        this.cacheParamList = res.get("CacheParam");
        this.initCacheParamTree();
      });
    },
    beforeDestroy() {
      off(window, "resize", this.handleResize);
    },
  };
</script>

<style scoped>

</style>
