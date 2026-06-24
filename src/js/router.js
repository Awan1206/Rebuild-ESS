import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/auth/Login.vue'
import Layout from '../views/layout/Layout.vue'
import Dashboard from '../views/Dashboard.vue'
import Attendance from '../views/attendance/Attendance.vue'
import Monitor from '../views/attendance/Monitor.vue'
import Branch from '../views/branch/Branch.vue'
import Shift from '../views/branch/Shift.vue'
import ManageUsers from '../views/users/Manage-user.vue'
import ManageRoles from '../views/users/Manage-role.vue'
import ManageDeptPosition from '../views/users/Manage-dept.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'Dashboard', component: Dashboard },
      { path: 'attendance', name: 'Attendance', component: Attendance },
      { path: 'attendance/monitor', name: 'Monitor', component: Monitor },
      { path: 'branch', name: 'Branch', component: Branch },
      { path: 'shift', name: 'Shift', component: Shift },
      { path: 'users/manage', name: 'ManageUsers', component: ManageUsers },
      { path: 'users/roles', name: 'ManageRoles', component: ManageRoles },
      { path: 'users/department-position', name: 'ManageDeptPosition', component: ManageDeptPosition },
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