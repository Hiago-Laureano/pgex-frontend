<template>
    <div class="button">
        <div v-if="loading" class="spinner-border text-secondary mb-4" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <button v-else @click="func" :class="'btn mb-4 '+bg">{{text}}</button>
    </div>
</template>

<script>
export default{
    name: "Button",
    props: {
        func: {
            type: Function,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        bg: {
            type: String,
            default: "btn-primary"
        },
        loading: {
            type: Boolean,
            required: true
        }
    }
}
</script>
