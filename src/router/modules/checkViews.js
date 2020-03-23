import Layout from '@/_layout'

const CheckRouter = [{
    path: '/NursingSet',
    component: Layout,
    meta: {
      title: ' 查看',
      affix: false
    },
    children: [{
      path: 'check-nursingTask',
      component: () => import('@/views/NursingSet/nursingTask/check-nursingTask.vue'),
      name: 'CheckNursingTask',
      hidden: true,
      meta: {
        isUseCache: true,
        keepAlive: true,
        title: ' 查看',
        affix: false
      }
    }]
  },
  {
    path: '/SystemMg',
    component: Layout,
    meta: {
      title: ' 访问授权',
      affix: false
    },
    children: [{
      path: 'visitAuthorization',
      component: () => import('@/views/SystemMg/appAuthorization/visitAuthorization.vue'),
      name: 'VisitAuthorization'
    }]
  }, {
    path: '/QualCtrl',
    component: Layout,
    meta: {
      title: ' 查看',
      affix: false
    },
    children: [{
      path: 'checkProcessChain',
      component: () => import('@/views/QualityCtrlMg/ProcessChainMg/checkChain.vue'),
      name: 'CheckProcessChain',
      hidden: true,
      meta: {
        isUseCache: true,
        keepAlive: true,
        title: ' 查看流程链',
        affix: false
      }
    },
    {
      path: 'checkProcessRole',
      component: () => import('@/views/QualityCtrlMg/ProcessRole/checkRole.vue'),
      name: 'CheckProcessRole',
      hidden: true,
      meta: {
        isUseCache: true,
        keepAlive: true,
        title: ' 查看角色',
        affix: false
      }
    }
  ]
  }
]
export default CheckRouter
