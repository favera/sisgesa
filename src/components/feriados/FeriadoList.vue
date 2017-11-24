<template>
    <div class="ui twelve wide column">
    
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Feriados</h4>
            <div class="two fields">
                <div class="field">
    
                    <div class="ui icon input">
                        <input type="text" placeholder="Buscar Feriado...">
                        <i class="inverted teal circular search link icon"></i>
                    </div>
    
                </div>
    
                <div class="field">
                    <div class="ui right floated main menu">
                    <a class="icon item" @click="incluirFeriado">
                      <i class="plus icon"></i>
                    </a>
                    <a class="icon item">
                      <i class="print icon"></i>
                    </a>
                  </div>
                   
    
                </div>
            </div>
    
        </div>
    
        <div class="field">
    
            <table class="ui teal celled table">
                <thead>
                    <tr>
                        <th>Sucursales Afectadas</th>
                        <th>Fecha del Feriado</th>
                        <th>Tipo Feriado</th>
                        <th>Horas Asignadas</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="feriado in feriados" :key="feriado.id">
                        <td> 
                            <div v-for="sucursal in feriado.sucursalesAfectadas" :key="sucursal.id" class="ui olive label">{{sucursal}}</div>
                        </td>
                        <td>{{feriado.fecha}}</td>
                        <td>{{feriado.tipoFeriado}}</td>
                        <td>{{feriado.horas}}</td>
                        <td>
                            <router-link :to="{name: 'editarFeriado', params: { id: feriado.id}}">
                                <i class="edit row icon"></i>
                            </router-link>
                            
                            <i class="trash icon" @click="confirm(feriado.id)"></i>
                        </td>
                    </tr>
                  
                </tbody>
            </table>
    
        </div>
    
    </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      feriados: [],
      sucursales: []
    };
  },
  methods: {
    incluirFeriado() {
      this.$router.push({ name: "incluirFeriado" });
    },
    obtenerFeriados() {
      axios
        .get("http://localhost:3000/feriados")
        .then(response => {
          this.feriados = response.data;
          console.log(this.feriados);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.obtenerFeriados();
    axios.get("http://localhost:3000/sucursals").then(response => {
      this.sucursales = response.data;
    });
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
