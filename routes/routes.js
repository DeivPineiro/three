import { createRouter, createWebHashHistory } from 'vue-router';
import home from '../src/pages/home.vue';


const routes =[
    {path: '/', component: home},
    
];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router; 