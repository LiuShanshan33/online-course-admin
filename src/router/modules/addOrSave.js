/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/_layout'

const AddSaveRouter = [{
  path: '/UserMg',
  component: Layout,
  meta: {
    isUseCache: false,
    keepAlive: false,
    title: ' 用户管理',
    affix: false
  },
  children: [
    {
      path: 'addStuInfo',
      component: () => import('@/views/UserMg/studentInfo/addstuInfo.vue'),
      name: 'AddStuInfo',
      hidden: true,
      meta: {
        isUseCache: true,
        keepAlive: false,
        title: ' 添加学生信息',
        affix: false
      }
    },
    {
      path: 'addteacherInfo',
      component: () => import('@/views/UserMg/teacherInfo/addteacherInfo.vue'),
      name: 'AddTeacherInfo',
      hidden: true,
      meta: {
        isUseCache: true,
        keepAlive: false,
        title: ' 添加教师信息',
        affix: false
      }
    }, {
    path: 'create-template',
    component: () => import('@/views/NursingSet/mission-template/create-template.vue'),
    name: 'Create-Template',
    hidden: true,
    meta: {
      isUseCache: false,
      keepAlive: false,
      title: ' 添加',
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
    affix: false
  },
  children: [{
    path: 'addBed',
    component: () => import('@/views/HospitalSet/BedInfo/addBed.vue'),
    name: 'AddBed',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加床位',
      affix: false
    }
  },
  {
    path: 'addStaff',
    component: () => import('@/views/HospitalSet/StaffInfo/addStaff.vue'),
    name: 'AddStaff',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加员工',
      affix: false
    }
  }, {
    path: 'addAddrBook',
    component: () => import('@/views/HospitalSet/addressBook/addAddrBook.vue'),
    name: 'AddAddrBook',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加',
      affix: false
    }
  },
  {
    path: 'addMsg',
    component: () => import('@/views/HospitalSet/msgMg/addMsg.vue'),
    name: 'AddMsg',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加',
      affix: false
    }
  }
  ]
},
{
  path: '/SystemMg',
  component: Layout,
  meta: {
    title: ' 系统设置',
    affix: false
  },
  children: [{
    path: 'addModuleMg',
    component: () => import('@/views/SystemMg/moduleMg/addModuleMg.vue'),
    name: 'AddModuleMg',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加模块',
      affix: false
    }
  },
  {
    path: 'addRoleMg',
    component: () => import('@/views/SystemMg/roleMg/addRoleMg.vue'),
    name: 'AddRoleMg',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加角色',
      affix: false
    }
  }, {
    path: 'addTaskMg',
    component: () => import('@/views/SystemMg/taskMg/addTaskMg.vue'),
    name: 'AddTaskMg',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加任务',
      affix: false
    }
  }, {
    path: 'addAppAuthorization',
    component: () => import('@/views/SystemMg/appAuthorization/addAppAuthorization.vue'),
    name: 'AddAppAuthorization',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加应用',
      affix: false
    }
  },
  {
    path: 'addVersionMg',
    component: () => import('@/views/SystemMg/versionMg/addVersion.vue'),
    name: 'AddVersionMg',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加版本',
      affix: false
    }
  }
  ]
},
{
  path: '/QualCtrl',
  component: Layout,
  meta: {
    isUseCache: true,
    keepAlive: true,
    title: ' 质控管理',
    affix: false
  },
  children: [{
    path: 'addProcessChain',
    component: () => import('@/views/QualityCtrlMg/ProcessChainMg/addChain.vue'),
    name: 'AddProcessChain',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: true,
      title: ' 添加流程链',
      affix: false
    }
  },
  {
    path: 'addProcessRole',
    component: () => import('@/views/QualityCtrlMg/ProcessRole/addRole.vue'),
    name: 'AddProcessRole',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加角色',
      affix: false
    }
  },
  {
    path: 'addProcessNode',
    component: () => import('@/views/QualityCtrlMg/ProcessNode/addNode.vue'),
    name: 'AddProcessNode',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加节点',
      affix: false
    }
  },
  {
    path: 'addTemplateMg',
    component: () => import('@/views/QCEvaluationTemp/TemplateMg/AddTemplateMg.vue'),
    name: 'AddTemplateMg',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加模版管理',
      affix: false
    }
  },
  {
    path: 'addQCEPM',
    component: () => import('@/views/QCEvaluationTemp/QCEPM/AddQCEPM.vue'),
    name: 'AddQCEPM',
    hidden: true,
    meta: {
      isUseCache: true,
      keepAlive: false,
      title: ' 添加质控评价项目',
      affix: false
    }
  }
  ]
}
]
export default AddSaveRouter
