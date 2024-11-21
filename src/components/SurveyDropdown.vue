<template>
    <div class="survey-dropdown">
        <button class="btn bg-secondary dropdown-toggle w-100 text-start" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span v-if="active_until">
                <i class="bi bi-calendar2-week text-primary fs-5 me-1"></i>
                <span class="date me-1">{{active_until}}</span>
                <i v-if="active" class="bi bi-check-square text-primary fs-5"></i>
                <i v-else class="bi bi-x-square text-danger fs-5"></i>
                {{name}}
            </span>
            <span v-else>
                <i class="bi bi-calendar2-x text-danger fs-5 me-1"></i>
                <i v-if="active" class="bi bi-check-square text-primary fs-5"></i>
                <i v-else class="bi bi-x-square text-danger fs-5"></i>
                {{name}}
            </span>
        </button>
        <ul class="dropdown-menu">
            <li><button class="dropdown-item"><router-link :to="'/pesquisa/'+survey_id" class="text-decoration-none text-dark"><i class="bi bi-box-arrow-up-right text-primary fs-5 me-2"></i>{{"Abrir pesquisa ("+n_questions+" "+text_plural+")"}}</router-link></button></li>
            <li v-if="active"><button @click="close_survey" class="dropdown-item"><i class="bi bi-x-square text-danger fs-5 me-2"></i>Fechar pesquisa</button></li>
            <li><button @click="get_json" class="dropdown-item"><i class="bi bi-filetype-json text-primary fs-5 me-2"></i>Exportar perguntas</button></li>
            <li><button @click="get_report" class="dropdown-item"><i class="bi bi-filetype-html text-primary fs-5 me-2"></i>Criar relatório</button></li>
            <li>
                <div class="d-flex flex-column align-items-center">
                    <input v-model="confirmation_code" class="input-primary" type="text" placeholder="Informe o código">
                    <button @click="valid_code" class="dropdown-item">
                        <i class="bi bi-check-circle-fill text-primary fs-5 me-2"></i>
                        Confirmar participação
                    </button>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default{
    name: "SurveyDropdown",
    data(){
        return {
            text_plural: "perguntas",
            confirmation_code: ""
        }
    },
    methods: {
        manage_result_close: async function(response){
            if(response.status === 200){
                this.set_alert(this.alert, true, "Pesquisa fechada", "alert-success")
            }else if(response.status === 403 || response.status === 429){
                const data = await response.json()
                this.set_alert(this.alert, true, data["detail"], "alert-danger")
            }else{
                if(response.status === 401){
                    this.refresh_token()
                }
                this.set_alert(this.alert, true, "Ocorreu algum problema, tente novamente!", "alert-danger")
            }
        },
        close_survey: async function(){
            this.set_loading(true)
            this.set_alert(this.alert, true, "Aguarde...", "alert-info")
            try{
                const response = await fetch(this.API_URL+"/api/v1/surveys/"+this.survey_id+"/", {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json", "Authorization": "Bearer "+localStorage.getItem("token")},
                    body: JSON.stringify({"active": false})
                })
                this.manage_result_close(response)
            }catch(e){
                this.set_alert(this.alert_create, true, "Erro ao tentar conectar ao  servidor!", "alert-danger")
            }
            window.scrollTo(0, 0)
            setTimeout(() => {this.set_loading(false)}, 1000)
        },
        get_json: async function(){
            this.set_loading(true)
            this.set_alert(this.alert, true, "Aguarde...", "alert-info")
            try{
                const response = await fetch(this.API_URL+"/api/v1/surveys/"+this.survey_id+"/json/", {
                    method: "GET",
                    headers: {"Authorization": "Bearer "+localStorage.getItem("token")}
                })
                this.manage_get_json(response)
            }catch{
                this.set_alert(this.alert, true, "Erro ao tentar conectar ao  servidor!", "alert-danger")
            }
            window.scrollTo(0, 0)
            setTimeout(() => {this.set_loading(false)}, 1000)
        },
        manage_get_json: async function(response){
            if(response.status === 200){
                try{
                    const data = await response.json()
                    const res = await fetch(this.API_URL+"/"+data["link"])
                    const blob = await res.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = document.createElement("a")
                    a.href = url
                    a.download = data["link"].split("/")[1]
                    a.click()
                    this.set_alert(this.alert, false)
                }catch{
                    this.set_alert(this.alert, true, "Ocorreu algum problema, tente novamente!", "alert-danger")
                }
            }else if(response.status === 429){
                const data = await response.json()
                this.set_alert(this.alert, true, data["detail"], "alert-danger")
            }else{
                if(response.status === 401){
                    this.refresh_token()
                }
                this.set_alert(this.alert, true, "Ocorreu algum problema, tente novamente!", "alert-danger")
            }
        },
      get_report: async function(){
            this.set_loading(true)
            this.set_alert(this.alert, true, "Aguarde...", "alert-info")
            try{
                const response = await fetch(this.API_URL+"/api/v1/surveys/"+this.survey_id+"/report/", {
                    method: "GET",
                    headers: {"Authorization": "Bearer "+localStorage.getItem("token")}
                })
                this.manage_get_report(response)
            }catch{
                this.set_alert(this.alert, true, "Erro ao tentar conectar ao  servidor!", "alert-danger")
            }
            window.scrollTo(0, 0)
            setTimeout(() => {this.set_loading(false)}, 1000)
        },
        manage_get_report: async function(response){
            if(response.status === 200){
                try{
                    const data = await response.json()
                    const res = await fetch(this.API_URL+"/"+data["link"])
                    const blob = await res.blob()
                    const url = window.URL.createObjectURL(blob)
                    window.open(url)
                    //const data = await response.json()
                    //window.open(this.API_URL+"/"+data["link"])
                    this.set_alert(this.alert, false)
                }catch{
                    this.set_alert(this.alert, true, "Ocorreu algum problema, tente novamente!", "alert-danger")
                }
            }else if(response.status === 429 || response.status === 400){
                const data = await response.json()
                this.set_alert(this.alert, true, data["detail"], "alert-danger")
            }else{
                if(response.status === 401){
                    this.refresh_token()
                }
                this.set_alert(this.alert, true, "Ocorreu algum problema, tente novamente!", "alert-danger")
            }
        },
        valid_code: async function(){
            if(this.confirmation_code){
                this.set_loading(true)
                this.set_alert(this.alert, true, "Aguarde...", "alert-info")
                try{
                    const response = await fetch(this.API_URL+"/api/v1/surveys/"+this.survey_id+"/confirmation/?cc="+this.confirmation_code, {
                        method: "GET",
                        headers: {"Authorization": "Bearer "+localStorage.getItem("token")}
                    })
                    this.manage_valid_code(response)
                }catch{
                    this.set_alert(this.alert, true, "Erro ao tentar conectar ao  servidor!", "alert-danger")
                }
                window.scrollTo(0, 0)
                setTimeout(() => {this.set_loading(false)}, 1000)
            }else{
                this.set_alert(this.alert, true, "Informe o código de confirmação", "alert-danger")
            }
        },
        manage_valid_code: async function(response){
            if(response.status === 200){
                const data = await response.json()
                this.confirmation_code = ""
                if(data["valid"]){
                    this.set_alert(this.alert, true, "O código informado é válido!", "alert-success")
                }else{
                    this.set_alert(this.alert, true, "O código informado é inválido!", "alert-warning")
                }
                setTimeout(() => {this.set_alert(this.alert, false)}, 6000)
            }else if(response.status === 429 || response.status === 400){
                const data = await response.json()
                this.set_alert(this.alert, true, data["detail"], "alert-danger")
            }else{
                if(response.status === 401){
                    this.refresh_token()
                }
                this.set_alert(this.alert, true, "Ocorreu algum problema, tente novamente!", "alert-danger")
            }
        }
    },
    props: {
        survey_id: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        n_questions: {
            type: Number,
            required: true
        },
        set_loading: {
            type: Boolean,
            required: true
        },
        alert: {
            type: Object,
            required: true
        },
        set_alert: {
            type: Function,
            required: true
        },
        active: {
            type: Boolean,
            required: true
        },
        active_until: {
            type: [String, null],
            required: true
        }
    },
    mounted(){
        if(this.n_questions === 1){
            this.text_plural = "pergunta"
        }
    }
}
</script>

<style scoped>
.date{
    font-size: 10px;
}
</style>
