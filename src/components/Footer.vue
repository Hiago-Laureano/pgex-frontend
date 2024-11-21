<template>
    <div class="footer bg-primary m-2 rounded shadow z-0">
        <div class="container">
            <div class="row text-white">
                <div class="col-md-4 text-center">
                    <p class="fw-bold fs-3 mt-2 bg-secondary">Contato</p>
                    <p>fake.email@fakeemail.fak</p>
                    <hr>
                    <p>(00) 99999-0000</p>
                    <hr>
                </div>
                <div class="col-md-4"></div>
                <div class="col-md-4 text-center d-flex align-items-end justify-content-center">
                    <a class="text-decoration-none text-white" href="http://www.freepik.com">Fundo e icone desenvolvidos por Freepik</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default{
    name: "Footer"
}
</script>

<style scoped>
@media screen and (min-width: 769px) and (min-height: 841px){
    .footer{
        position: absolute;
        bottom: 0;
        width: 100%;
    }
}
</style>
