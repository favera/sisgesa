<template>
  <div id="app">
    <div class="ui menu">
      <div class="right menu">
        <a href="#" class="item">Login</a>
        <a href="#" class="item">Help</a>
      </div>
    </div>
    <div class="ui left vertical menu visible sidebar">
      <div class="header item">
        <h4>MDL | SISGESA </h4>
        <p>sistema de Gestion Salarial</p>
      </div>
      <router-link class="item" active-class="active" to="/asistencia">Asistencia</router-link>
      <router-link class="item" active-class="active" to="/salarios">Generar Salario</router-link>
      <router-link class="item" active-class="active" :to="{name: 'listadoEmpleado'}">Funcionarios</router-link>
      <router-link class="item" active-class="active" to="/sucursales">Sucursales</router-link>
      <router-link class="item" active-class="active" to="/feriados">Feriados</router-link>

    </div>

    <div class="pusher">
      <div class="ui grid">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  components: {}
};
</script>

<style scoped>
.ui.grid {
  padding: 0 3%;
}
</style>

