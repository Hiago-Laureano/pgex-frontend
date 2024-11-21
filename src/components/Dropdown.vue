<template>
    <div class="dropdown">
        <button class="btn bg-dark-subtle dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <span v-if="! select">Selecione</span>
            <i v-else class="bi bi-check-all text-success">{{select}}</i>
        </button>
        <ul class="dropdown-menu">
            <li><button @click="() => {selected('Excelente'); func(id_question, 5)}" class="dropdown-item">Excelente</button></li>
            <li><button @click="() => {selected('Muito bom'); func(id_question, 4)}" class="dropdown-item">Muito bom</button></li>
            <li><button @click="() => {selected('Bom'); func(id_question, 3)}" class="dropdown-item">Bom</button></li>
            <li><button @click="() => {selected('Regular'); func(id_question, 2)}" class="dropdown-item">Regular</button></li>
            <li><button @click="() => {selected('Insatisfatório'); func(id_question, 1)}" class="dropdown-item">Insatisfatório</button></li>
        </ul>
    </div>
</template>

<script>
export default{
    name: "Dropdown",
    data(){
        return {
            select: null
        }
    },
    methods: {
        selected: function(text){
            this.select = text
        }
    },
    props: {
        func: {
            type: Function,
            required: true
        },
        id_question: {
            type: String,
            required: true
        }
    }
}
</script>
