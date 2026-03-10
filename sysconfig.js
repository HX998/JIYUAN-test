window.LOCAL_CONFIG = {
  // 服务及接口
  PRINT_CLOUD:'http://localhost',
  API_HOME: 'http://' + window.location.hostname + ':6661/bemp-served/',   //后台访问地址：静态IP
  // API_HOME: 'http://' + window.location.hostname + ':8010/',   //后台访问地址：动态获取浏览器IP
  WS_REQ:'ws://127.0.0.1:9080/bemp/websocket/',
  MENUS_ROOT_NAME: '0',
  LOCK_TIME: 100,
  THEME: 'theme-black',
  TABS_VIEW_LIMIT: 10, // tab页最大打开数量
  isFrame: false, // 当前运行是否在Frame中运行
  isUcf: false, // 当前运行是否在UCF中运行
  isRefresh: true, // 缓存页面时是否需要在关闭选项卡处刷新页面
  isAllKeepAlive: true,// 是否页面都进行缓存（服务端无返回isKeppAlive字段时）
  isUnderscore:true,//入参是否把驼峰规则转换下划线规则（容微服务模式需要设置为true）
  isToken: true, // 为false时证明不需要登录
  isCasLogout:false,//cas单点登录退出跳转
  SYS_NO:"",
  BUSI_NO:"",
  IMG_URL:"",
  BANK_NAME_TO_DIVTOPBAR: "", //银行个性化顶部任务栏
  passwordChangeRule:{//修改当前密码规则
    minLength:8,//密码最少位数
    kindLength:3//修改密码至少包含几种字符组成，包含a-z、A-Z、0-9、特殊字符
  },
  isCustomLogin: true,
  menus:[]
};
