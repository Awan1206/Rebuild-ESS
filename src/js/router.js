import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/login', 
    name: 'Login', 
    component: () => import('../views/auth/Login.vue') 
  },
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('../views/layout/layout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: () => import('../views/Dashboard.vue') },
      { path: 'attendance/timesheet', name: 'Attendance', component: () => import('../views/attendance/Attendance.vue') },
      { path: 'attendance/monitor', name: 'Monitor', component: () => import('../views/attendance/Monitor.vue') },
      { path: 'attendance/review', name: 'Review', component: () => import('../views/attendance/Review.vue') },
      { path: 'branch', name: 'Branch', component: () => import('../views/branch/Branch.vue') },
      { path: 'shift', name: 'Shift', component: () => import('../views/branch/Shift.vue') },
      { path: 'usershift', name: 'Usershift', component: () => import('../views/branch/Usershift.vue') },
      { path: 'users/manage', name: 'ManageUsers', component: () => import('../views/users/Manage-user.vue') },
      { path: 'users/roles', name: 'ManageRoles', component: () => import('../views/users/Manage-role.vue') },
      { path: 'users/department-position', name: 'ManageDeptPosition', component: () => import('../views/users/Manage-dept.vue') },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const isLoggedIn = !!localStorage.getItem('user')
  if (to.meta.requiresAuth && !isLoggedIn) return '/login'
  if (to.path === '/login' && isLoggedIn) return '/dashboard'
})

export default router