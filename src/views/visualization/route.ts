import type { RouteType } from '~/types/router'
const Layout = () => import('@/layout/index.vue')

export default {
  name: 'Visualization',
  path: '/visualization',
  component: Layout,
  redirect: '/screen',
  meta: {
    role: ['admin'],
    requireAuth: true,
    order: 0,
  },
  children: [
    {
      name: 'screen',
      path: 'screen',
      component: () => import('./index.vue'),
      meta: {
        title: '大屏',
        icon: 'mdi:home',
        role: ['admin'],
        requireAuth: true,
        order: 0,
      },
    },
  ],
} as RouteType
