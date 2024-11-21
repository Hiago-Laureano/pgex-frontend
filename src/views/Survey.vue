<template>
    <div class="survey m-5">
        <Alert v-show="alert['active']" :text="alert['text']" :bg="alert['bg']"/>
        <button v-if="! loading && ! data" @click="get_survey" class="btn btn-primary">Tentar novamente</button>
        <div v-if="! loading">
            <div v-if="data">
                <p class="p-4 bg-primary text-center fw-bold text-white fs-3 rounded">{{data["name"]}}</p>
                <div v-for="i, key in data['questions']" :key="key">
                    <h4 class="bg-primary p-2 fw-bold mb-4 mt-5 text-white text-center rounded">{{key}}</h4>
                    <div v-for="j, index in i" :key="index" class="d-flex flex-column align-items-start justify-content-center">
                        <h4 class="bg-dark-subtle p-3 rounded-top rounded-end">{{j['question']}}</h4>
                        <textarea v-if="j['is_descriptive']" v-model="responses[j['id']]" class="input-primary mb-5 w-100" type="text" placeholder="Responda aqui..."></textarea>
                        <Dropdown v-else :id_question="j['id']" :func="respond" class="mb-5"/>
                    </div>
                </div>
                <hr>
                <div class="d-flex align-items-center justify-content-center">
                    <Button :func="post_response" :loading="loading_post" text="Enviar" bg="btn-primary"/>
                </div>
                <div class="d-flex align-items-center justify-content-center">
                    <i id="arrow" class="bi bi-arrow-up-circle-fill fs-1 text-warning"></i>
                </div>
            </div>
        </div>
        <div v-else>
            <div class="placeholder-glow">
                <p class="p-5 bg-primary text-center fw-bold text-white fs-3 rounded placeholder-wave col-12"></p>
                <div>
                    <h4 class="bg-primary p-4 fw-bold mb-4 mt-5 text-white text-center rounded placeholder col-12"></h4>
                    <div class="d-flex flex-column align-items-start justify-content-center">
                        <h4 class="p-5 placeholder col-4"></h4>
                    </div>
                    <h4 class="bg-primary p-4 fw-bold mb-4 mt-5 text-white text-center rounded placeholder col-12"></h4>
                    <div class="d-flex flex-column align-items-start justify-content-center">
                        <h4 class="p-5 placeholder col-4"></h4>
                    </div>
                    <h4 class="bg-primary p-4 fw-bold mb-4 mt-5 text-white text-center rounded placeholder col-12"></h4>
                    <div class="d-flex flex-column align-items-start justify-content-center">
                        <h4 class="p-5 placeholder col-4"></h4>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import Alert from "@/components/Alert.vue"
import Dropdown from "@/components/Dropdown.vue"
import Button from "@/components/Button.vue"
export default{
    name: "Survey",
    components: {
        Alert,
        Dropdown,
        Button
    },
    data(){
        return {
            loading: false,
            loading_post: false,
            data: null,
            text_response: "",
            alert: {active: false, text: "", bg: "alert-success"},
            responses: {}
        }
    },
    methods: {
        respond: function(id, value){
            this.responses[id] = value
        },
        set_alert: function(active, text="", bg="alert-danger"){
            this.alert["active"] = active
            this.alert["text"] = text
            this.alert["bg"] = bg
        },
        post_response: async function(){
            this.loading_post = true
            this.set_alert(false)
            let ok = true
            for(let i of Object.values(this.responses)){
                if(! i){
                    ok = false
                    this.set_alert(true, "Responda todas as perguntas!", "alert-danger")
                    break
                }
            }if(ok){
                try{
                    const response = await fetch(this.API_URL+"/api/v1/surveys/"+this.$route.params.id+"/respond/", {
                        method: "POST",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({survey: this.$route.params.id, responses: this.responses})
                    })
                    this.manage_post_response(response)
                }catch{
                    this.set_alert(true, "Erro ao tentar conectar ao  servidor!", "alert-danger")
                }
            }
            window.scrollTo(0, 0)
            setTimeout(() => {this.loading_post = false}, 1000)
        },
        manage_post_response: async function(response){
            if(response.status === 201){
                const data = await response.json()
                setTimeout(() => {this.get_survey()}, 2000)
                setTimeout(() => {this.set_alert(true, "Pesquisa respondida. Seu código de confirmação é: "+data["confirmation_code"]+". Salve este código como comprovante!", "alert-success")}, 2200)
                this.set_alert(true, "Pesquisa respondida. Seu código de confirmação é: "+data["confirmation_code"]+". Salve este código como comprovante!", "alert-success")
            }else if(response.status === 400){
                const data = await response.json()
                let text = data[Object.keys(data)[0]][0]
                this.set_alert(true, text, "alert-danger")
            }else if(response.status === 429){
                const data = await response.json()
                this.set_alert(true, data["detail"], "alert-danger")
            }else{
                this.set_alert(true, "Ocorreu algum problema, tente novamente!", "alert-danger")
            }
        },
        get_survey: async function(){
            this.loading = true
            this.set_alert(false)
            this.responses = {}
            try{
                const response = await fetch(this.API_URL+"/api/v1/surveys/"+this.$route.params.id+"/")
                this.manage_result_survey(response)
            }catch{
                this.set_alert(true, "Erro ao tentar conectar ao  servidor!", "alert-danger")
            }
            setTimeout(() => {this.loading = false}, 1000)
        },
        manage_result_survey: async function(response){
            if(response.status === 200){
                this.data = await response.json()
                for(let i of Object.values(this.data["questions"])){
                    for(let j of i){
                        this.responses[j["id"]] = ""
                    }
                }
                this.set_alert(false)
            }else if(response.status === 429){
                this.data = null
                const data = await response.json()
                this.set_alert(true, data["detail"], "alert-danger")
            }else{
                this.data = null
                this.set_alert(true, "Pesquisa não encontrada", "alert-danger")
            }
        },
    },
    created(){
        this.get_survey()
    }
}
</script>

<style scoped>
.survey{
  min-height: 500px;
}
#arrow{
    position: absolute;
    margin-top: -20px;
    animation: 1s infinite alternate moveArrow;

}
@keyframes moveArrow{
    from{
        margin-top: -15px;
    }
    to{
        margin-top: 30px;
    }
}
</style>
