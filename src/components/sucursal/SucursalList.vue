<template>
    <div class="ui twelve wide column">
    
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Sucursales</h4>
            <div class="two fields">
                <div class="field">
    
                    <div class="ui icon input">
                        <input type="text" placeholder="Buscar Sucursal..">
                        <i class="inverted teal circular search link icon"></i>
                    </div>
    
                </div>
    
                <div class="field">
    
                    <div class="ui right floated main menu">
                    <a class="icon item" @click="nuevaSucursal">
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
                        <th>Sucursal</th>
                        <th>Horario Entrada</th>
                        <th>Horario Salida</th>
                        <th>Telefono</th>
                        <th>Opciones</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="sucursal in sucursales" :key="sucursal.id">
                        <td>{{sucursal.nombre }}</td>
                        <td>{{sucursal.horarioEntrada + " hs"}}</td>
                        <td>{{sucursal.horarioSalida + " hs"}}</td>
                        <td>{{sucursal.telefono}}</td>
                        <td>
                            <router-link :to="{name: 'editarSucursal', params: {id: sucursal.id}}">
                                <i class="edit row icon"></i>
                            </router-link>
                            
                            <i class="trash icon" @click="confirm(sucursal.id)"></i>
                        </td>
                    </tr>
                </tbody>

                <tfoot>
                    <tr>
                        <th colspan="5">
                            <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
                            </app-pagination>
                        </th>
                    </tr>
                </tfoot>

            </table>
    
        </div>
    
    </div>
</template>

<script>
import axios from "axios";
import Pagination from ".././shared/Pagination.vue";

export default {
  data() {
    return {
      sucursales: [],
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 11
      }
    };
  },
  methods: {
    nuevaSucursal() {
      this.$router.push({ name: "incluirSucursal" });
    },
    confirm(id) {
      this.$confirm(
        "El registro sera eliminado permanentemente. Desea Continuar?",
        "Atencion!",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.eliminarSucursal(id);
          this.$message({
            type: "success",
            message: "Registro Eliminado"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    },
    obtenerListadoSucursales() {
      axios
        .get("http://localhost:3000/sucursals")
        .then(response => {
          this.sucursales = response.data.slice(
            0,
            this.pageOne.itemsPerPage - 1
          );
          this.pageOne.totalItems = response.data.length;
        })
        .catch(e => {
          console.log(e);
        });
    },
    eliminarSucursal(id) {
      var index = this.sucursales.findIndex(i => i.id === id);
      console.log(index);
      axios
        .delete("http://localhost:3000/sucursals/" + id)
        .then(this.sucursales.splice(index, 1));
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      axios
        .get(
          "http://localhost:3000/sucursals?_page=" + this.pageOne.currentPage
        )
        .then(response => {
          this.sucursales = response.data.slice(0, this.pageOne.itemsPerPage);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  components: {
    appPagination: Pagination
  },
  mounted() {
    this.obtenerListadoSucursales();
  },
  watch: {
    $route: "obtenerListadoSucursales"
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
