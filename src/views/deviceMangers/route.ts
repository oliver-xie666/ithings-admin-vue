import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'deviceMangers',
  path: '/deviceMangers',
  component: Layout,
  redirect: '/deviceMangers/product',
  meta: {
    title: '设备管理',
    customIcon: 'logo',
    role: ['admin'],
    requireAuth: true,
    order: 1,
  },
  children: [
    {
      name: 'product',
      path: 'product',
      component: () => import('./product/index.vue'),
      meta: {
        title: '产品',
        icon: '',
        role: ['admin'],
      },
    },
    {
      name: 'productDetail',
      path: 'product/detail/:productID',
      component: () => import('./product/detail/index.vue'),
      meta: {
        title: '产品详情',
        icon: '',
        role: ['admin'],
        isHidden: true,
      },
    },
  ],
} as RouteType
