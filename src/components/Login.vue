<template>
    <div class="login px-auto">
        <div class="content d-flex flex-column align-items-center justify-content-center bg-primary rounded m-auto mt-5 shadow">
            <h3 class="text-white fw-bold my-5 bg-secondary p-3 rounded">Acessar sistema</h3>
            <Alert v-show="alert['active']" :text="alert['text']" :bg="alert['bg']" />
            <p v-if="validations['email']" class="msg-validate">{{validations['email']}}</p>
            <input v-model="fields['email']" @keydown.enter="(e) => {login()}" class="input-primary mb-4" type="text" placeholder="Email">
            <p v-if="validations['password']" class="msg-validate">{{validations['password']}}</p>
            <input v-model="fields['password']" @keydown.enter="(e) => {login()}" class="input-primary mb-4" type="password" placeholder="Senha">
            <Button :func="login" :loading="loading" text="Entrar" bg="btn-secondary"/>
        </div>
    </div>
</template>

<script>
import Button from "@/components/Button.vue"
import Alert from "@/components/Alert.vue"
export default{
    name: "Login",
    data(){
        return {
            loading: false,
            alert: {active: false, text: "", bg: "alert-success"},
            fields: {email: "", password: ""},
            validations: {email: "", password: ""},
        }
    },
    methods: {
        reset_fields: function(){
            for(let i in this.fields){
                this.fields[i] = ""
            }
            this.validations = this.fields
        },
        set_alert: function(active, text="", bg="alert-danger"){
            this.alert["active"] = active
            this.alert["text"] = text
            this.alert["bg"] = bg
        },
        manage_result: async function(response){
            if(response.status === 200){
                const data = await response.json()
                localStorage.setItem("token", data["access"])
                localStorage.setItem("token-refresh", data["refresh"])
                this.logged.value = true
                this.set_alert(false)
                this.reset_fields()
            }else if(response.status === 400){
                const data = await response.json()
                for(let i in data){
                    this.validations[i] = data[i][0]
                }
                this.set_alert(false)
            }else if(response.status === 401 || response.status === 403 || response.status === 429){
                for(let i in this.fields){
                    this.validations[i] = ""
                }
                const data = await response.json()
                this.set_alert(true, data["detail"], "alert-danger")
            }else{
                this.set_alert(true, "Ocorreu algum problema, tente novamente!", "alert-danger")
            }
        },
        login: async function(){
            this.loading = true
            try{
                const response = await fetch(this.API_URL+"/api/auth/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(this.fields)
                })
                this.manage_result(response)
            }catch{
                this.set_alert(true, "Erro ao tentar conectar ao  servidor!", "alert-danger")
            }
            setTimeout(() => {this.loading = false}, 1000)
        }
    },
    components: {
        Button,
        Alert
    },
    created(){
        this.refresh_token()
    }
}
</script>

<style scoped>
.content{
    max-width: 500px;
}
.msg-validate{
    padding: 5px;
    margin-bottom: 2px;
    font-size: 9px;
    background: white;
    color: rgb(87, 20, 20);
    font-weight: bold;
    border-left: 2px solid rgb(87, 20, 20);
}
</style>
