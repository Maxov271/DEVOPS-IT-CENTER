import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router' 
import './components/styles/style.css'
import App from './App.vue'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: () => import('./views/Home.vue')
  },
  { 
    path: '/certificate/certificate_mainpage.html', 
    name: 'Certificates', 
    component: () => import('../pages/Certificates.vue') 
  },
  { 
    path: '/blog', 
    name: 'Blog', 
    component: () => import('../pages/Blog.vue')
  },
  {
    path: '/course',
    name: 'course',
    component: () => import('../pages/Courses.vue')
  },  
  {
    path: '/service',
    name: 'Service',
    component: () => import('../pages/Service.vue')
  },
  {
    path: "/contact",
    name: "Contact",
    component: () => import("../pages/ContactSection.vue")
  },
]

const router = createRouter({   
  history: createWebHistory(),   
  routes,
  // Scroll behavior qo'shildi
  scrollBehavior(to, from, savedPosition) {
    // Agar foydalanuvchi browser orqaga/oldinga tugmasini bosgan bo'lsa
    if (savedPosition) {
      return savedPosition
    } else {
      // Har doim sahifa yuqorisiga scroll qilish
      return { top: 0 }
    }
  }
})  

const app = createApp(App) 
app.use(router) 
app.mount('#app')