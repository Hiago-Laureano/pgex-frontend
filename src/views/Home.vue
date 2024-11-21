<template>
  <div class="home">
    <Login v-if="! logged.value"/>
    <Menu v-else/>
  </div>
</template>

<script>
import Login from "@/components/Login.vue"
import Menu from "@/components/Menu.vue"
export default {
  name: 'Home',
  components: {
    Login,
    Menu
  }
}
</script>

<style scoped>
.home{
  min-height: 500px;
}
</style>
