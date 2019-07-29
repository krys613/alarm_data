import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import BPC_Table from './views/nav1/BPC_Table.vue'
import Tivoli_Table from './views/nav1/Tivoli_Table.vue'
import workorder from './views/nav1/workorder.vue'
import value_state from './views/charts/alarm-value-state.vue'
import count from './views/charts/alarm-count.vue'
import duration from './views/charts/alarm-duration.vue'
import topological from './views/results/topological-relationship.vue'
import res from './views/results/res.vue'
import rule_library from './views/rule-library/rule-library.vue'
import MockRule from './views/rule-library/MockRule.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '数据预览',
        iconCls: 'fa fa-line-chart',//图标样式class
        children: [
            {path: '/main', component: Main, name: '主页', hidden: true},
            {path: '/workorder', component: workorder, name: '工单管理'},
            {path: '/bpc_table', component: BPC_Table, name: 'BPC Table'},
            {path: '/tivoli_table', component: Tivoli_Table, name: 'Tivoli Table'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据可视化',
        iconCls: 'fa fa-bar-chart',
        children: [
            {path: '/alarm-value-state', component: value_state, name: '统计告警值情况'},
            {path: '/alarm-count', component: count, name: '统计组件告警次数'},
            {path: '/alarm-duration', component: duration, name: '统计告警时长'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '结果展示',
        iconCls: 'fa fa-area-chart',
        children: [
            {path: '/res', component: res, name: '关联关系'},
            {path: '/topological-relationship', component: topological, name: '组件拓扑关系'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '关联规则库',
        hidden: false,
        iconCls: 'fa fa-pie-chart',
        children: [
            {path: '/mock-rule', component: MockRule, name: '模拟业务迁移'},
            {path: '/rule-library', component: rule_library, name: '关联规则库'}
        ]
    }
];

export default routes;
