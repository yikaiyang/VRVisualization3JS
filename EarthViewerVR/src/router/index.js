import Vue from 'vue'
import Router from 'vue-router'

import Frontpage from '../components/FrontPage'
import Search from '../components/Search'
import Settings from '../components/Settings'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Frontpage',
            component: Search,
        },
        {
            path: '/test',
            name: 'Test',
            component: Frontpage,
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings,
        },
    ]
})
