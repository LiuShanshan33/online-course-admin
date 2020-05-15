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
          title: ' 首页 ',
          icon: require('../_layout/components/image/首页.png'),
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
          affix: false
        }
      }
    ]
  },
  {
    path: '/UserMg',
    component: Layout,
    redirect: '/Home/working',
    meta: {
      title: ' 用户管理',
      icon: require('../_layout/components/image/用户管理.png'),
      affix: false,
      roles: ['admin', 'editor']
    },
    children: [
      {
        path: 'teacherInfo',
        component: () => import('@/views/UserMg/teacherInfo/teacherInfo.vue'),
        name: 'TeacherInfo',
        meta: {
          isUseCache: true,
          keepAlive: false,
          title: ' 教师管理',
          affix: false
        }
      },
      {
        path: 'studentInfo',
        component: () => import('@/views/UserMg/studentInfo/studentInfo.vue'),
        name: 'StudentInfo',
        meta: {
          isUseCache: true,
          keepAlive: false,
          title: ' 学生管理',
          affix: false
        }
      }
      /* {
        path: 'grade',
        component: () => import('@/views/NursingSet/grade/grade'),
        name: 'Grade',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 护理等级',
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
          affix: false
        }
      },
      }*/
    ]
  },
  {
    path: '/CourseMg',
    component: Layout,
    meta: {
      title: ' 课程管理',
      icon: require('../_layout/components/image/课程管理.png'),
      affix: false
    },
    children: [{
        path: 'coursewareMg',
        component: () => import('@/views/courseMg/coursewareMg/coursewareMg.vue'),
        name: 'CoursewareMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 课程信息',
          affix: false
        }
      },
      {
        path: 'coursewareDetail',
        component: () => import('@/views/courseMg/coursewareMg/coursewareDetail.vue'),
        name: 'CoursewareDetail',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: false,
          title: ' 课件文件信息',
          affix: false
        }
      },
      {
        path: 'checkCourseware',
        component: () => import('@/views/courseMg/coursewareMg/checkCourseware.vue'),
        name: 'CheckCourseware',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: false,
          title: ' 课件详情',
          affix: false
        }
      },
      {
        path: 'addCourse',
        component: () => import('@/views/courseMg/coursewareMg/addCourse.vue'),
        name: 'AddCourse',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 添加课程',
          affix: false
        }
      },
      {
        path: 'uploadCourseware',
        component: () => import('@/views/courseMg/coursewareMg/uploadCourseware.vue'),
        name: 'UploadCourseware',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 课件上传',
          affix: false
        }
      }
      /* {
        path: 'BedInfo',
        component: () => import('@/views/HospitalSet/BedInfo/BedInfo'),
        name: 'BedInfo',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 床位信息',
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
          affix: false
        }
      }*/
    ]
  },
  {
    path: '/SystemMg',
    component: Layout,
    meta: {
      title: ' 系统管理',
      icon: require('../_layout/components/image/系统管理.png'),
      noCache: true
    },
    children: [{
        path: 'schoolInfo',
        component: () => import('@/views/SystemMg/SchoolInfo/schoolInfo.vue'),
        name: 'SchoolInfo',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 学校信息',
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
          affix: false
        }
      },
      // {
      //   path: 'dictionaryMg',
      //   component: () => import('@/views/SystemMg/dictionaryMg/dictionaryMg'),
      //   name: 'DictionaryMg',
      //   meta: {
      //     isUseCache: true,
      //     keepAlive: true,
      //     title: ' 字典管理',
      //     affix: false
      //   }
      // },
      {
        path: 'annMg',
        component: () => import('@/views/SystemMg/announcementMg/announcementMg'),
        name: 'AnnMg',
        meta: {
          isUseCache: true,
          keepAlive: false,
          title: ' 公告管理',
          affix: false
        }
      },
      {
        path: 'updatePwd',
        component: () => import('@/views/SystemMg/updatePwd/updatePwd'),
        name: 'UpdatePwd',
        meta: {
          isUseCache: true,
          keepAlive: false,
          title: ' 修改密码',
          affix: false
        }
      }
      /* 
      {
        path: 'versionMg',
        component: () => import('@/views/SystemMg/versionMg/versionMg'),
        name: 'VersionMg',
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 版本管理',
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
          affix: false
        }
      }*/
    ]
  },
  {
    path: '/LogSet',
    component: Layout,
    redirect: '/profile/index',
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 登录日志',
      icon: require('../_layout/components/image/日志.png'),
      noCache: true
    },
    children: [{
        path: 'signlog',
        component: () => import('@/views/LoginLog/loginLog'),
        name: 'Signlog',
        meta: {
          isUseCache: true,
          keepAlive: false,
          title: ' 登录日志',
          affix: false
        }
      }
    ]
  }
]

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
