/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/_layout'

const UpdateRouter = [
  {
    path: '/UserMg',
    component: Layout,
    meta: {
      title: ' 用户管理',
      affix: false
    },
    children: [{
        path: 'updateStuInfo',
        component: () => import('@/views/UserMg/studentInfo/updatestuInfo.vue'),
        name: 'UpdateStuInfo',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改学生信息',
          affix: false
        }
      },
      {
        path: 'updateteacherInfo',
        component: () => import('@/views/UserMg/teacherInfo/updateteacherInfo.vue'),
        name: 'UpdateTeacherInfo',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改教师信息',
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
        path: 'updateBed',
        component: () => import('@/views/HospitalSet/BedInfo/updateBed.vue'),
        name: 'UpdateBed',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改床位',
          affix: false
        }
      },
      {
        path: 'updateDept',
        component: () => import('@/views/HospitalSet/DeptInfo/updateDept.vue'),
        name: 'UpdateDept',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改科室',
          affix: false
        }
      },
      {
        path: 'updateStaff',
        component: () => import('@/views/HospitalSet/StaffInfo/updateStaff.vue'),
        name: 'UpdateStaff',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改员工',
          affix: false
        }
      },
      {
        path: 'updateAddrBook',
        component: () => import('@/views/HospitalSet/addressBook/updateAddrBook.vue'),
        name: 'UpdateAddrBook',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改',
          affix: false
        }
      },
      {
        path: 'updateMsg',
        component: () => import('@/views/HospitalSet/msgMg/updateMsg.vue'),
        name: 'UpdateMsg',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改',
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
        path: 'updateModuleMg',
        component: () => import('@/views/SystemMg/moduleMg/updateModuleMg.vue'),
        name: 'UpdateModuleMg',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改模块',
          affix: false
        }
      },
      {
        path: 'updateRoleMg',
        component: () => import('@/views/SystemMg/roleMg/updateRoleMg.vue'),
        name: 'UpdateRoleMg',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改角色',
          affix: false
        }
      }, {
        path: 'updateTaskMg',
        component: () => import('@/views/SystemMg/taskMg/updateTaskMg.vue'),
        name: 'UpdateTaskMg',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改任务',
          affix: false
        }
      }, {
        path: 'updateAppAuthorization',
        component: () => import('@/views/SystemMg/appAuthorization/updateAppAuthorization.vue'),
        name: 'UpdateAppAuthorization',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改应用',
          affix: false
        }
      },
      {
        path: 'updateVersionMg',
        component: () => import('@/views/SystemMg/versionMg/updateVersion.vue'),
        name: 'UpdateVersionMg',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改版本',
          affix: false
        }
      }
    ]
  },
  {
    path: '/QualCtrl',
    component: Layout,
    meta: {
      title: ' 质控管理',
      affix: false
    },
    children: [{
        path: 'alterProcessChain',
        component: () => import('@/views/QualityCtrlMg/ProcessChainMg/alterChain'),
        name: 'AlterProcessChain',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改流程链',
          affix: false
        }
      },
      {
        path: 'updateNode',
        component: () => import('@/views/QualityCtrlMg/ProcessNode/updateNode.vue'),
        name: 'UpdateNode',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改节点',
          affix: false
        }
      }, {
        path: 'updateRole',
        component: () => import('@/views/QualityCtrlMg/ProcessRole/updateRole.vue'),
        name: 'UpdateRole',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改角色',
          affix: false
        }
      },
      {
        path: 'updateTemplateMg',
        component: () => import('@/views/QCEvaluationTemp/TemplateMg/UpdateTemplateMg.vue'),
        name: 'UpdateTemplateMg',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改模板管理',
          affix: false
        }
      },
      {
        path: 'updateQCEPM',
        component: () => import('@/views/QCEvaluationTemp/QCEPM/UpdateQCEPM.vue'),
        name: 'UpdateQCEPM',
        hidden: true,
        meta: {
          isUseCache: true,
          keepAlive: true,
          title: ' 修改质控评价项目',
          affix: false
        }
      }
    ]

},
  {
    path: '/formSet',
    component: Layout,
    meta: {
      title: ' 表单设置',
      affix: false
    },
    children: [
      {
        path: 'setFormItem',
        component: () => import('@/views/formSet/formItemMg/setFormItem.vue'),
        name: 'setFormItem',
        hidden: true,
        meta: {
          title: ' 表单项目设置',
          affix: false
        }
      }
    ]
  }
]
export default UpdateRouter
