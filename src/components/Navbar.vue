<template>
<nav class="navbar navbar-expand-md bg-primary fixed-top position-relative m-2 rounded shadow z-0">
  <div class="container-fluid">
    <router-link to="/" class="navbar-brand fw-bold text-decoration-none text-white me-3"><img src="favicon.ico" alt="" width="50px">PGEX</router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title fw-bold text-primary" id="offcanvasNavbarLabel">Menu</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body bg-primary">
        <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li class="nav-item">
            <router-link to="/sobre" class="router text-decoration-none text-white me-3 fw-bold">Sobre as pesquisas de clima organizacional</router-link> 
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
</template>

<script>

</script>

<style scoped>
.router{
    background: linear-gradient(120deg, white, rgb(206, 202, 202));
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: 0% 2px;
    transition: background-size 800ms;
}
.router:hover{
    background-size: 100% 2px;
}

@media screen and (max-width: 768px){
.nav-item{
    margin-bottom: 15px;
}
}
</style>
