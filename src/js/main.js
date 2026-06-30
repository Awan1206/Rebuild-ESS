import { createApp } from 'vue'
import '../css/style.css'
import router from '../js/router.js'
import App from '../App.vue'
import '@fontsource/plus-jakarta-sans/500.css'
import '@fontsource/plus-jakarta-sans/600.css'
import '@fontsource/plus-jakarta-sans/700.css'

import '@fontsource/montserrat/600.css'
import '@fontsource/montserrat/700.css'

const app = createApp(App)
app.use(router)
app.mount('#app')