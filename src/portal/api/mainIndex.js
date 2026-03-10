 export default {
   "/mainindex/stateInfo": () => import(/* webpackChunkName: "mainindex/stateInfo" */`@/components/mainindex/stateInfo.vue`),
   "/mainindex/stateChart": () => import(/* webpackChunkName: "mainindex/stateChart" */`@/components/mainindex/stateChart.vue`),
   "/mainindex/remindList": () => import(/* webpackChunkName: "mainindex/remindList" */`@/components/mainindex/remindList.vue`),
   "/mainindex/todoItemList": () => import(/* webpackChunkName: "mainindex/todoItemList" */`@/components/mainindex/todoItemList.vue`)
 }
