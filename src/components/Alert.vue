<template>
    <div :class="'alert '+bg" role="alert">
        {{text}}
    </div>
</template>

<script>
export default{
    name: "Alert",
    props: {
        text: {
            type: String,
            required: true
        },
        bg: {
            type: String,
            default: "alert-danger"
        }
    }
}
</script>
