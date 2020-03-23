/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/_layout'

const ColumnBtnRouter = [{
  path: '/NursingSet',
  component: Layout,
  meta: {
    title: ' 护理设置',
    affix: false
  },
  children: [{
    path: 'diagElement',
    component: () => import('@/views/NursingSet/diagnose/diagElement.vue'),
    name: 'DiagElement',
    hidden: true,
    meta: {
      title: ' 因素',
      affix: false
    }
  },
  {
    path: 'diagBasis',
    component: () => import('@/views/NursingSet/diagnose/diagBasis.vue'),
    name: 'DiagBasis',
    hidden: true,
    meta: {
      title: ' 依据',
      affix: false
    }
  },
  {
    path: 'diagTarget',
    component: () => import('@/views/NursingSet/diagnose/diagTarget.vue'),
    name: 'DiagTarget',
    hidden: true,
    meta: {
      title: ' 目标',
      affix: false
    }
  },
  {
    path: 'diagMeasureDetail',
    component: () => import('@/views/NursingSet/diagnose/diagMeasureDetail.vue'),
    name: 'DiagMeasureDetail',
    hidden: true,
    meta: {
      title: ' 措施',
      affix: false
    }
  },
  {
    path: 'missionPage',
    component: () => import('@/views/NursingSet/mission-template/missionPage.vue'),
    name: 'MissionPage',
    hidden: true,
    meta: {
      title: ' 模板展示',
      affix: false
    }
  }
  ]
}]
export default ColumnBtnRouter
