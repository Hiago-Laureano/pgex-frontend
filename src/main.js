import { createApp, ref } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

//URL for connect with API
const url = "http://127.0.0.1:8000"
const logged = ref(false)

app.config.globalProperties.API_URL = url
app.config.globalProperties.logged = logged

async function refresh_token(){
    if(localStorage.getItem("token-refresh")){
        try{
            const response = await fetch(url+"/api/auth/refresh/", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({refresh: localStorage.getItem("token-refresh")})
            })
            if(response.status === 200){
                const data = await response.json()
                localStorage.setItem("token", data["access"])
                localStorage.setItem("token-refresh", data["refresh"])
                app.config.globalProperties.logged.value = true
            }else{
                app.config.globalProperties.logged.value = false
                localStorage.removeItem("token")
                localStorage.removeItem("token-refresh")
            }
        }catch{
            app.config.globalProperties.logged.value = false
            localStorage.removeItem("token")
            localStorage.removeItem("token-refresh")
        }
    }
} 

app.config.globalProperties.refresh_token = refresh_token

app.use(router).mount('#app')
