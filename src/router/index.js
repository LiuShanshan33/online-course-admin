import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/_layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'
import AddSaveRouter from './modules/addOrSave' // 引入路由
import CheckRouter from './modules/checkViews'
import UpdateRouter from './modules/UpdateOrSave'
import ColumnBtnRouter from './modules/columnBtn'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [{
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [{
      path: '',
      component: () => import('@/views/redirect/index')
    }]
  },
  // No Layout
  {
    path: '/login',
    component: () => import('@/views/_login/index.vue'),
    hidden: true
  },
  // {
  //   path: '/auth-redirect',
  //   component: () => import('@/views/login/auth-redirect'),
  //   hidden: true
  // },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  // Has Layout
  {
    path: '/Home',
    component: Layout,
    redirect: '/working',
    children: [{
        path: 'working',
        component: () => import('@/views/home/home.vue'),
        name: 'Working',
        meta: {
          isUseCache: true,
          keepAlive: false,
          title: ' 工作台 ',
          icon: require('../_layout/components/image/工作台.png'),
          affix: true
        }
      },
      {
        path: 'editing-home',
        component: () => import('@/views/home/editHome.vue'),
        name: 'EditingHome',
        hidden: true,
        meta: {
          isUseCache: false,
          keepAlive: true,
          title: '编辑工作台',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  },
  {
    path: '/NursingSet',
    component: Layout,
    redirect: '/Home/working',
    meta: {
      title: ' 护理设置',
      icon: require('../_layout/components/image/护理设置.png'),
      affix: false,
      roles: ['admin', 'editor']
    },
    children: [{
        path: 'setting-assessment',
        component: () => import('@/views/NursingSet/assessment/setting-assessment'),
        name: 'Setting-Assessment',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 评估设置',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'assess',
        component: () => import('@/views/NursingSet/assessment/assessment.vue'),
        name: 'Assess',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 护理评估',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'diagnose',
        component: () => import('@/views/NursingSet/diagnose/diagnose'),
        name: 'Diagonse',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 护理诊断',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'grade',
        component: () => import('@/views/NursingSet/grade/grade'),
        name: 'Grade',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 护理等级',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'nursingTask',
        component: () => import('@/views/NursingSet/nursingTask/nursingTask.vue'),
        name: 'NursingTask',
        meta: {
          isUseCache: false,
          keepAlive: true,
          title: ' 护理任务',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'incident',
        component: () => import('@/views/NursingSet/NursIncident/NursIncident'),
        name: 'Incident',
        meta: {
          isUseCache: false,
          keepAlive: true,
          title: ' 护理事件',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'event-setting',
        component: () => import('@/views/NursingSet/event-setting/event-setting'),
        name: 'Event-setting',
        meta: {
          isUseCache: false,
          keepAlive: true,
          title: ' 事件设置',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'mission-template',
        component: () => import('@/views/NursingSet/mission-template/mission-template.vue'),
        name: 'MissionTemplate',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 宣教模板',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'nursing-record',
        component: () => import('@/views/NursingSet/nursing-record/nursing-record'),
        name: 'NursingRecord',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 护理记录',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'related-department',
        component: () => import('@/views/NursingSet/related-department/related-department'),
        name: 'RelatedDepartment',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 表单关联部门',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  },
  {
    path: '/HospitalSet',
    component: Layout,
    meta: {
      title: ' 医院设置',
      icon: require('../_layout/components/image/医院设置.png'),
      affix: false
    },
    children: [{
        path: 'HospitalInfo',
        component: () => import('@/views/HospitalSet/HospitalInfo/HospitalInfo'),
        name: 'HospitalInfo',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 医院信息',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'DeptInfo',
        component: () => import('@/views/HospitalSet/DeptInfo/DeptInfo'),
        name: 'DeptInfo',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 科室信息',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'BedInfo',
        component: () => import('@/views/HospitalSet/BedInfo/BedInfo'),
        name: 'BedInfo',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 床位信息',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'StaffInfo',
        component: () => import('@/views/HospitalSet/StaffInfo/StaffInfo'),
        name: 'StaffInfo',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 员工信息',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'sysGroup',
        component: () => import('@/views/HospitalSet/sysGroup/sysGroup'),
        name: 'sysGroup',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 诊疗组',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'addressBook',
        component: () => import('@/views/HospitalSet/addressBook/addressBook'),
        name: 'AddressBook',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 通讯录',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'msgMg',
        component: () => import('@/views/HospitalSet/msgMg/msgMg'),
        name: 'MsgMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 消息管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  },
  {
    path: '/SystemMg',
    component: Layout,
    redirect: '/SystemMg/index',
    meta: {
      title: ' 系统管理',
      icon: require('../_layout/components/image/系统管理.png'),
      noCache: true
    },
    children: [{
        path: 'moduleMg',
        component: () => import('@/views/SystemMg/moduleMg/moduleMg'),
        name: 'ModuleMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 模块管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'roleMg',
        component: () => import('@/views/SystemMg/roleMg/roleMg'),
        name: 'RoleMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 角色管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'dictionaryMg',
        component: () => import('@/views/SystemMg/dictionaryMg/dictionaryMg'),
        name: 'DictionaryMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 字典管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'taskMg',
        component: () => import('@/views/SystemMg/taskMg/taskMg'),
        name: 'TaskMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 任务管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'accessoryMg',
        component: () => import('@/views/SystemMg/accessoryMg/accessoryMg'),
        name: 'AccessoryMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 附件管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'appAuthorization',
        component: () => import('@/views/SystemMg/appAuthorization/appAuthorization'),
        name: 'AppAuthorization',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 应用授权',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'versionMg',
        component: () => import('@/views/SystemMg/versionMg/versionMg'),
        name: 'VersionMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 版本管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'MEWSRule',
        component: () => import('@/views/SystemMg/MEWSRule/MEWSRule'),
        name: 'MEWSRule',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' MEWS评分规则',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'MEWSTutelage',
        component: () => import('@/views/SystemMg/MEWSTutelage/MEWSTutelage'),
        name: 'MEWSTutelage',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' MEWS评分监护',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'MEWSRelevance',
        component: () => import('@/views/SystemMg/MEWSRelevance/MEWSRelevance.vue'),
        name: 'MEWSRelevance',
        meta: {
          isUseCache: true,
          // keepAlive: true,
          title: ' MEWS表单关联',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'warddeploy',
        component: () => import('@/views/SystemMg/warddeploy/warddeploy.vue'),
        name: 'Warddeploy',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 病区动态显示配置',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'warddatabase',
        component: () => import('@/views/SystemMg/wardDatabase/wardDatabase'),
        name: 'Warddatabase',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 病区动态数据库配置',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'screen-handingoff',
        component: () => import('@/views/SystemMg/changeShiftDeptCode/changeShiftDeptCode'),
        name: 'ScreenHandingOff',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 大屏交接班科室配置',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'handingoff-sort',
        component: () => import('@/views/SystemMg/changeShiftSortMode/changeShiftSortMode'),
        name: 'HandingOffSort',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 交接班排序方式',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'pdaForm',
        component: () => import('@/views/SystemMg/pdaForm/pdaForm'),
        name: 'PdaForm',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' pda表单配置',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  },
  {
    path: '/LogSet',
    component: Layout,
    redirect: '/profile/index',
    meta: {
      isUseCache: true,
      keepAlive: true,
      title: ' 日志设置',
      icon: require('../_layout/components/image/日志管理.png'),
      noCache: true
    },
    children: [{
        path: 'signlog',
        component: () => import('@/views/LogSet/loginLog/loginLog'),
        name: 'Signlog',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 登录日志',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'operateLog',
        component: () => import('@/views/LogSet/operateLog/operateLog'),
        name: 'OperateLog',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 操作日志',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'taskLog',
        component: () => import('@/views/LogSet/taskLog/taskLog'),
        name: 'TaskLog',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 任务日志',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  },
  {
    path: '/QualCtrl',
    component: Layout,
    redirect: '/QualCtrl/index',
    meta: {
      isUseCache: true,
      keepAlive: true,
      title: ' 质控管理',
      icon: require('../_layout/components/image/质控管理icon.png'),
      noCache: true
    },
    children: [{
        path: 'ProcessMg',
        component: () => import('@/views/QualityCtrlMg/ProcessChainMg/ProcessChainMg'),
        name: 'ProcessMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 流程链管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'processNode',
        component: () => import('@/views/QualityCtrlMg/ProcessNode/ProcessNode'),
        name: 'ProcessNode',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 流程节点',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'processRole',
        component: () => import('@/views/QualityCtrlMg/ProcessRole/ProcessRole'),
        name: 'ProcessRole',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 流程角色',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  },
  {
    path: '/QCEvaluationTemp',
    component: Layout,
    redirect: '/QCEvaluationTemp/index',
    meta: {
      isUseCache: true,
      keepAlive: true,
      title: ' 质控评价表模板',
      icon: require('../_layout/components/image/质控管理icon.png'),
      noCache: true
    },
    children: [{
        path: 'TemplateMg',
        component: () => import('@/views/QCEvaluationTemp/TemplateMg/TemplateMg'),
        name: 'TemplateMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 模板管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'QCEPM',
        component: () => import('@/views/QCEvaluationTemp/QCEPM/QCEPM'),
        name: 'QCEPM',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 质控评价项目管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'TempAssociateItems',
        component: () => import('@/views/QCEvaluationTemp/TempAssociateItems/TempAssociateItems'),
        name: 'TempAssociateItems',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 模板关联评价项目',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  },
  {
    path: '/formSet',
    component: Layout,
    redirect: '/profile/index',
    meta: {
      title: ' 表单设置',
      icon: require('../_layout/components/image/日志管理.png'),
      noCache: true
    },
    children: [{
        path: 'formMg',
        component: () => import('@/views/formSet/formMg/formMg'),
        name: 'formMg',
        meta: {
          title: ' 表单管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'formItemMg',
        component: () => import('@/views/formSet/formItemMg/formItemMg'),
        name: 'formItemMg',
        meta: {
          title: ' 表单项目管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'formVsItem',
        component: () => import('@/views/formSet/formVsItem/formVsItem'),
        name: 'formVsItem',
        meta: {
          title: ' 表单关联项目',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  },
  {
    path: '/QCDicCodeMg',
    component: Layout,
    redirect: '/QCDicCodeMg/index',
    meta: {
      isUseCache: true,
      keepAlive: true,
      title: ' 质控字典编码管理',
      icon: require('../_layout/components/image/质控管理icon.png'),
      noCache: true
    },
    children: [{
        path: 'DicCodeMg',
        component: () => import('@/views/QCDicCodeMg/DicCodeMg/DicCodeMg'),
        name: 'DicCodeMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 字典编码管理',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'TempDicCdSort',
        component: () => import('@/views/QCDicCodeMg/TempDicCdSort/TempDicCdSort'),
        name: 'TempDicCdSort',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 模板字典编码排序',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      },
      {
        path: 'DepartDicCodeAc',
        component: () => import('@/views/QCDicCodeMg/DepartDicCodeAc/DepartDicCodeAc'),
        name: 'DepartDicCodeAc',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 科室字典编码关联',
          icon: require('../_layout/components/image/子菜单.png'),
          affix: false
        }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
// export const asyncRoutes = [
//   {
//     path: '/permission',
//     component: Layout,
//     redirect: '/permission/page',
//     alwaysShow: true, // will always show the root menu
//     name: 'Permission',
//     meta: {
//       title: 'Permission',
//       icon: 'lock',
//       roles: ['admin', 'editor'] // you can set roles in root nav
//     },
//     children: [
//       {
//         path: 'page',
//         component: () => import('@/views/permission/page'),
//         name: 'PagePermission',
//         meta: {
//           title: 'Page Permission',
//           roles: ['admin'] // or you can only set roles in sub nav
//         }
//       },
//       {
//         path: 'directive',
//         component: () => import('@/views/permission/directive'),
//         name: 'DirectivePermission',
//         meta: {
//           title: 'Directive Permission'
//           // if do not set roles, means: this page does not require permission
//         }
//       },
//       {
//         path: 'role',
//         component: () => import('@/views/permission/role'),
//         name: 'RolePermission',
//         meta: {
//           title: 'Role Permission',
//           roles: ['admin']
//         }
//       }
//     ]
//   },

//   {
//     path: '/icon',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/icons/index'),
//         name: 'Icons',
//         meta: { title: 'Icons', icon: 'icon', noCache: true }
//       }
//     ]
//   },

//   /** when your routing map is too long, you can split it into small modules **/
//   componentsRouter,
//   chartsRouter,
//   nestedRouter,
//   tableRouter,

//   {
//     path: '/example',
//     component: Layout,
//     redirect: '/example/list',
//     name: 'Example',
//     meta: {
//       title: 'Example',
//       icon: 'example'
//     },
//     children: [
//       {
//         path: 'create',
//         component: () => import('@/views/example/create'),
//         name: 'CreateArticle',
//         meta: { title: 'Create Article', icon: 'edit' }
//       },
//       {
//         path: 'edit/:id(\\d+)',
//         component: () => import('@/views/example/edit'),
//         name: 'EditArticle',
//         meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
//         hidden: true
//       },
//       {
//         path: 'list',
//         component: () => import('@/views/example/list'),
//         name: 'ArticleList',
//         meta: { title: 'Article List', icon: 'list' }
//       }
//     ]
//   },

//   {
//     path: '/tab',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/tab/index'),
//         name: 'Tab',
//         meta: { title: 'Tab', icon: 'tab' }
//       }
//     ]
//   },

//   {
//     path: '/error',
//     component: Layout,
//     redirect: 'noRedirect',
//     name: 'ErrorPages',
//     meta: {
//       title: 'Error Pages',
//       icon: '404'
//     },
//     children: [
//       {
//         path: '401',
//         component: () => import('@/views/error-page/401'),
//         name: 'Page401',
//         meta: { title: '401', noCache: true }
//       },
//       {
//         path: '404',
//         component: () => import('@/views/error-page/404'),
//         name: 'Page404',
//         meta: { title: '404', noCache: true }
//       }
//     ]
//   },

//   {
//     path: '/error-log',
//     component: Layout,
//     children: [
//       {
//         path: 'log',
//         component: () => import('@/views/error-log/index'),
//         name: 'ErrorLog',
//         meta: { title: 'Error Log', icon: 'bug' }
//       }
//     ]
//   },

//   {
//     path: '/excel',
//     component: Layout,
//     redirect: '/excel/export-excel',
//     name: 'Excel',
//     meta: {
//       title: 'Excel',
//       icon: 'excel'
//     },
//     children: [
//       {
//         path: 'export-excel',
//         component: () => import('@/views/excel/export-excel'),
//         name: 'ExportExcel',
//         meta: { title: 'Export Excel' }
//       },
//       {
//         path: 'export-selected-excel',
//         component: () => import('@/views/excel/select-excel'),
//         name: 'SelectExcel',
//         meta: { title: 'Export Selected' }
//       },
//       {
//         path: 'export-merge-header',
//         component: () => import('@/views/excel/merge-header'),
//         name: 'MergeHeader',
//         meta: { title: 'Merge Header' }
//       },
//       {
//         path: 'upload-excel',
//         component: () => import('@/views/excel/upload-excel'),
//         name: 'UploadExcel',
//         meta: { title: 'Upload Excel' }
//       }
//     ]
//   },

//   {
//     path: '/zip',
//     component: Layout,
//     redirect: '/zip/download',
//     alwaysShow: true,
//     name: 'Zip',
//     meta: { title: 'Zip', icon: 'zip' },
//     children: [
//       {
//         path: 'download',
//         component: () => import('@/views/zip/index'),
//         name: 'ExportZip',
//         meta: { title: 'Export Zip' }
//       }
//     ]
//   },

//   {
//     path: '/pdf',
//     component: Layout,
//     redirect: '/pdf/index',
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/pdf/index'),
//         name: 'PDF',
//         meta: { title: 'PDF', icon: 'pdf' }
//       }
//     ]
//   },
//   {
//     path: '/pdf/download',
//     component: () => import('@/views/pdf/download'),
//     hidden: true
//   },

//   {
//     path: '/theme',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/theme/index'),
//         name: 'Theme',
//         meta: { title: 'Theme', icon: 'theme' }
//       }
//     ]
//   },

//   {
//     path: '/clipboard',
//     component: Layout,
//     children: [
//       {
//         path: 'index',
//         component: () => import('@/views/clipboard/index'),
//         name: 'ClipboardDemo',
//         meta: { title: 'Clipboard', icon: 'clipboard' }
//       }
//     ]
//   },

//   {
//     path: 'external-link',
//     component: Layout,
//     children: [
//       {
//         path: 'https://github.com/PanJiaChen/vue-element-admin',
//         meta: { title: 'External Link', icon: 'link' }
//       }
//     ]
//   },

//   // 404 page must be placed at the end !!!
//   { path: '*', redirect: '/404', hidden: true }
// ]
// checkRouter

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [...constantRoutes, ...AddSaveRouter, ...CheckRouter, ...UpdateRouter, ...ColumnBtnRouter] // 调用路由
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
