<template>
    <div class="d-flex flex-column align-items-center justify-content-center m-auto my-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4 d-flex flex-column align-items-center bg-primary shadow">
                    <h5 class="text-white fw-bold my-5 bg-secondary p-3 rounded w-100">Criar pesquisa</h5>
                    <Alert v-show="alert_create['active']" :text="alert_create['text']" :bg="alert_create['bg']" />
                    <div v-if="create_step === 1" class="d-flex flex-column align-items-center">
                        <label for="name" class="text-white fw-bold">Nome da Pesquisa</label>
                        <input v-model="fields['name']" id="name" type="text" class="input-primary mb-3" placeholder="Ex.: Pesquisa nov/24">
                        <label for="date" class="text-white fw-bold">Data limite para participação</label>
                        <input v-model="fields['active_until']" id="date" type="date" class="input-primary mb-3">
                        <Button :func="next_step" :loading="loading" text="Continuar" bg="btn-secondary"/>
                    </div>
                    <div v-else class="d-flex flex-column align-items-center w-100">
                        <div v-for="i, key in questions" :key="key" class="bg-secondary rounded p-2 mb-1 d-flex flex-column align-items-start w-100 overflow-scroll">
                            <span class="fw-bold w-100 text-center">{{key}}</span>
                            <p v-for="j, index in i" :key="index">
                                <button @click="() => {delete_question(key, index)}" class="btn btn-danger me-2">X</button>
                                <span v-if="j['is_descriptive']">[descritiva]</span>
                                {{j["question"]}}
                            </p>
                        </div>
                        <label for="question-title" class="text-white fw-bold">Título da pergunta</label>
                        <input v-model="fields['title']" id="question-title" type="text" class="input-primary mb-3">
                        <label for="question" class="text-white fw-bold">Pergunta</label>
                        <input v-model="fields['question']" id="question" type="text" class="input-primary mb-3">
                        <div class="mb-4 d-flex align-items-center justify-content-center">
                            <input v-model="fields['is_descriptive']" id="check" type="checkbox" class="form-check-input bg-primary fs-4 me-3">
                            <label for="check" class="text-white fw-bold pt-1">Resposta descritiva</label>
                        </div>
                        <Button :func="add_question" :loading="loading" text="+ adicionar pergunta" bg="btn-primary"/>
                        <Button :func="create_survey" :loading="loading" text="Finalizar e criar" bg="btn-secondary"/>
                        <div class="d-flex mb-5">
                            <label for="get-json" role="button" class="bg-secondary fs-3 px-1 rounded me-1"><i class="bi bi-folder-plus"></i></label>
                            <input id="get-json" type="file" class="d-none">
                            <button @click="import_questions" class="btn btn-secondary">Importar perguntas</button>
                        </div>
                        <Button :func="next_step" :loading="loading" text="Voltar" bg="btn-secondary"/>

                    </div>
                    <hr class="hr text-white w-100">
                </div>
                <div class="col-md-4 bg-primary shadow">
                    <h5 class="text-white fw-bold my-5 bg-secondary p-3 rounded">Pesquisas</h5>
                    <Alert v-show="alert_surveys['active']" :text="alert_surveys['text']" :bg="alert_surveys['bg']" />
                    <ul v-if="loading_surveys" class="placeholder-glow">
                        <li class="border rounded fw-bold p-4 bg-secondary mb-2 placeholder col-12"></li>
                        <li class="border rounded fw-bold p-4 bg-secondary mb-2 placeholder col-12"></li>
                        <li class="border rounded fw-bold p-4 bg-secondary mb-2 placeholder col-12"></li>
                    </ul>
                    <ul class="list-surveys" v-else>
                        <li v-for="i, index in surveys" :key="index" class="border rounded fw-bold text-dar p-1 bg-secondary mb-2">
                            <SurveyDropdown :survey_id="i['id']" :active="i['active']" :active_until="i['active_until']" :name="i['name']" :n_questions="i['n_questions']" :set_loading="set_loading_surveys" :alert="alert_surveys" :set_alert="set_alert"/>
                        </li>
                        <li v-if="surveys === null" class="border rounded fw-bold text-dar p-1 bg-secondary mb-2">
                            <span class="text-danger ms-2">Algo deu errado</span><button @click="() => {refresh_token(); get_surveys()}" class="btn btn-danger ms-1">Tentar novamente</button>
                        </li>
                        <li v-else-if="surveys.length === 0" class="border rounded fw-bold text-dar p-1 bg-secondary mb-2">
                            <span class="text-danger ms-2">Não há pesquisas</span>
                        </li>
                        <li v-else-if="next_page || prev_page" class="border rounded fw-bold text-dar p-1 bg-secondary d-flex flex-row justify-content-center">
                            <button v-if="prev_page" @click="() => {get_surveys(prev_page)}" class="btn-secondary"><i class="bi bi-caret-left-fill"></i></button>
                            <button v-if="next_page" @click="() => {get_surveys(next_page)}" class="btn-secondary"><i class="bi bi-caret-right-fill"></i></button>
                        </li>
                    </ul>
                    <hr class="hr text-white">
                </div>
                <div class="col-md-4 bg-primary shadow">
                    <h5 class="text-white fw-bold my-5 bg-secondary p-3 rounded">Sistema</h5>
                    <div class="d-flex flex-column align-items-center">
                        <button @click="logout" class="btn btn-danger fw-bold mb-5"><i class="bi bi-door-closed text-white fs-5 me-2"></i>Sair</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Alert from "@/components/Alert.vue"
import Button from "@/components/Button.vue"
import SurveyDropdown from "@/components/SurveyDropdown.vue"
export default{
    name: "Menu",
    components: {
        Button,
        Alert,
        SurveyDropdown
    },
    data(){
        return{
            alert_create: {active: false, text: "", bg: "alert-success"},
            alert_surveys: {active: false, text: "", bg: "alert-success"},
            create_step: 1,
            loading: false,
            count_questions: 0,
            fields: {name: "", active_until: null, title: "", question: "", is_descriptive: false},
            questions: {},
            loading_surveys: false,
            surveys: null,
            next_page: null,
            prev_page: null
        }
    },
    methods: {
        logout: function(){
            this.logged.value = false
            localStorage.removeItem("token")
            localStorage.removeItem("token-refresh")
        },
        set_loading_surveys: function(value){
            this.loading_surveys = value
            if(value === false){
                this.get_surveys()
            }
        },
        validate_format_json: function(json){
            for(let i of Object.keys(json)){
                if(Array.isArray(json[i])){
                    for(let j of json[i]){
                        if(! (JSON.stringify(Object.keys(j)) === JSON.stringify(["id", "question", "is_descriptive"]))){
                            return false
                        }
                        if(Number.isInteger(j["id"]) === false || typeof(j["question"]) !== "string" || typeof(j["is_descriptive"]) !== "boolean"){
                            return false
                        }
                    }
                }else{
                    return false
                }
            }
            return true
        },
        import_questions: function(){
            const input = document.querySelector("#get-json")
            if(input.files[0]){
                if(input.files[0].name.includes(".json")){
                    this.set_alert(this.alert_create, false)
                    const fr = new FileReader()
                    fr.readAsText(input.files[0])
                    fr.onload = () => {
                        const json = JSON.parse(fr.result)
                        if(this.validate_format_json(json)){
                            this.questions = json
                            input.value = ""
                            this.set_alert(this.alert_create, true, "Importação realizada", "alert-success")
                        }else{
                            this.set_alert(this.alert_create, true, "Formatação incorreta das perguntas no arquivo JSON", "alert-danger")
                        }
                    }
                }else{
                    this.set_alert(this.alert_create, true, "Deve ser um arquivo JSON", "alert-danger")
                }

            }else{
                this.set_alert(this.alert_create, true, "Selecione o arquivo JSON com as perguntas", "alert-danger")
            }
            window.scrollTo(0, 0)
        },
        reset_fields: function(){
            this.create_step = 1
            this.count_questions = 0
            this.fields = {name: "", active_until: null, title: "", question: "", is_descriptive: false},
            this.questions = {}
        },
        get_surveys: async function(url = this.API_URL+"/api/v1/surveys/"){
            this.loading_surveys = true
            this.surveys = null
            try{
                const response = await fetch(url, {
                    method: "GET",
                    headers: {"Authorization": "Bearer "+localStorage.getItem("token")}
                })
                this.manage_result_surveys(response)
            }catch{
                this.surveys = false
            }
            setTimeout(() => {this.loading_surveys = false}, 1000)
        },
        manage_result_surveys: async function(response){
            if(response.status === 200){
                const data = await response.json()
                this.surveys = data["results"]
                this.next_page = data["next"]
                this.prev_page = data["previous"]
            }
        },
        manage_result_create: async function(response){
            if(response.status === 201){
                const data = await response.json()
                this.set_alert(this.alert_create, true, "Pesquisa criada. Acesso em /pesquisa/"+data["id"], "alert-success")
                this.reset_fields()
                this.get_surveys()
            }else if(response.status === 400){
                const data = await response.json()
                let key = Object.keys(data)[0]
                let text = data[key][0].replace("surveys", "pesquisas").replace("survey", "pesquisa")
                if(key === "name"){
                    this.next_step()
                }
                this.set_alert(this.alert_create, true, text, "alert-danger")
            }else if(response.status === 403 || response.status === 429){
                const data = await response.json()
                this.set_alert(this.alert_create, true, data["detail"], "alert-danger")
            }else{
                if(response.status === 401){
                    this.refresh_token()
                }
                this.set_alert(this.alert_create, true, "Ocorreu algum problema, tente novamente!", "alert-danger")
            }
        },
        create_survey: async function(){
            this.loading = true
            if(Object.keys(this.questions).length < 1){
                this.set_alert(this.alert_create, true, "Adicione ao menos uma pergunta", "alert-danger")
            }else{
                try{
                    const data = {name: this.fields["name"], questions: this.questions}
                    if(this.fields["active_until"]){
                        data["active_until"] = this.fields["active_until"]
                    }
                    const response = await fetch(this.API_URL+"/api/v1/surveys/", {
                        method: "POST",
                        headers: {"Content-Type": "application/json", "Authorization": "Bearer "+localStorage.getItem("token")},
                        body: JSON.stringify(data)
                    })
                    this.manage_result_create(response)
                }catch(e){
                    this.set_alert(this.alert_create, true, "Erro ao tentar conectar ao  servidor!", "alert-danger")
                }
            }
            window.scrollTo(0,0)
            setTimeout(() => {this.loading = false}, 1000)
        },
        delete_question: function(key, index){
            this.questions[key].splice(index, 1)
            if(this.questions[key].length === 0){
                delete(this.questions[key])
            }
        },
        set_alert: function(alert, active, text="", bg="alert-danger"){
            alert["active"] = active
            alert["text"] = text
            alert["bg"] = bg
        },
        next_step: function(){
            if(! this.fields['name']){
                this.set_alert(this.alert_create, true, "Informe o nome da pesquisa")
            }else{
                this.set_alert(this.alert_create, false)
                if(this.create_step === 1){
                    this.create_step = 2
                }else{
                    this.create_step = 1
                }
            }

        },
        add_question: function(){
            if(! this.fields["title"]){
                this.set_alert(this.alert_create, true, "Informe o título para adicionar")
            }else if(! this.fields["question"]){
                this.set_alert(this.alert_create, rue, "Informe a pergunta para adicionar")
            }else{
                this.set_alert(this.alert_create, false)
                if(this.fields["title"] in this.questions){
                    this.questions[this.fields["title"]].push({id: this.count_questions, question: this.fields["question"], is_descriptive: this.fields["is_descriptive"]})
                }else{
                    this.questions[this.fields["title"]] = [{id: this.count_questions, question: this.fields["question"], is_descriptive: this.fields["is_descriptive"]}]
                }
                this.fields["question"] = ""
                this.fields["is_descriptive"] = false
                this.count_questions++
            }
        }
    },
    created(){
        this.get_surveys()
    }

}
</script>
<style scoped>
.col-md-4{
    border-left: 1px solid white;
    border-right: 1px solid white;
    border-radius: 8px;
}
.hr{
    display: none;
}
.list-surveys{
    max-height: 330px;
    overflow: scroll;
}
@media screen and (max-width: 768px){
    .col-md-4{
        border: none;
        border-radius: 0;
    }
    .hr{
        display: block;
    }
}
</style>

