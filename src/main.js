import { createApp } from 'vue'
import App from './App.vue'
import router from './router'  // Mudamos de volta para importação padrão
import { createPinia } from 'pinia'

// Importando estilos globais
import './assets/styles/base.css'
import './assets/styles/utilities.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')