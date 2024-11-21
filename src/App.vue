<template>
  <div class="app">
    <Navbar/>
    <router-view/>
    <Footer/>
  </div>
</template>
<script>
//import Bootstrap
import "bootstrap/dist/js/bootstrap.js"
import "bootstrap/dist/css/bootstrap.css"
//import Bootstrap Icons
import "bootstrap-icons/font/bootstrap-icons.css"
//----------------
import Navbar from "@/components/Navbar.vue"
import Footer from "@/components/Footer.vue"
export default{
  components: {
    Navbar,
    Footer
  }
}
</script>


<style>
*{
  font-family: Avenir, Helvetica, Arial, sans-serif;
  margin: 0;
}
.app{
  height: 100vh;
  background-image: url("@/assets/background.jpg");
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.text-primary{
  color: rgb(38, 146, 43) !important;
}
.text-secondary{
  color: whitesmoke !important;
}
.bg-primary{
  background-color: rgb(38, 146, 43) !important;
}
.bg-secondary{
  color: rgb(38, 146, 43) !important;
  background-color: whitesmoke !important;
}
.btn-primary{
  font-weight: bold !important;
  background-color: rgb(38, 146, 43) !important;
  border: 1px solid rgb(30, 136, 35) !important;
}
.btn-primary:hover{
  font-weight: bold !important;
  background-color: rgb(172, 236, 175) !important;
  border: 1px solid rgb(11, 54, 14) !important;
}
.btn-secondary{
  font-weight: bold !important;
  color: rgb(38, 146, 43) !important;
  background-color: whitesmoke !important;
  border: 1px solid rgb(209, 207, 207) !important;
}
.btn-secondary:hover{
  font-weight: bold !important;
  color: rgb(38, 146, 43) !important;
  background-color: rgb(209, 207, 207) !important;
  border: 1px solid rgb(170, 168, 168) !important;
}
.input-primary{
  color: rgb(72, 73, 122);
  padding: 10px;
  border: none;
  border-radius: 5px 5px 0 0;
  border-bottom: 3px solid white;
  background: rgba(145, 212, 190, 0.7);
}
.input-primary::placeholder{
  color: rgb(72, 73, 122);
}
.input-primary:focus{
  outline: none;
}
</style>
