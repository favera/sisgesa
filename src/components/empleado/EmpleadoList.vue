<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Funcionarios</h4>
            <div class="two fields">
                <div class="field">

                    <div class="ui icon input">
                        <input type="text" placeholder="Buscar Funcionario...">
                        <i class="inverted teal circular search link icon"></i>
                    </div>

                </div>

                <div class="field">

                  <div class="ui right floated main menu">
                    <a class="icon item" @click="nuevoEmpleado">
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
                        <th>Nombre del Funcionario
                            <i class="sort content descending icon"></i>
                        </th>
                        <th>Numero Identificador</th>
                        <th>Tipo Carga Laboral</th>
                        <th>Carga Laboral</th>
                        <th>Salario Base</th>
                        <th>Sucursal</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="empleado in empleados" :key="empleado.id">
                        <td> {{empleado.nombre}}</td>
                        <td> {{empleado.acnro}}</td>
                        <td> {{empleado.tipoCarga}}</td>
                        <td> {{empleado.cargaLaboral}}</td>
                        <td> {{empleado.salario}}{{empleado.moneda}}</td>
                        <td> {{empleado.sucursal.nombre}}</td>
                        <td>
                            <router-link class="item" :to="{name: 'editarEmpleado', params: {id: empleado.id}}" >
                                <i class="edit row icon"></i>
                            </router-link>

                            <i class="trash icon" @click="confirm(empleado.id)"></i>
                        </td>
                    </tr>

                </tbody>

                <tfoot>
                    <tr>
                        <th colspan="7">
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
const url = "https://mdl-sisgesa-back.herokuapp.com";
export default {
  data() {
    return {
      empleados: [],
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 11
      }
    };
  },
  components: {
    appPagination: Pagination
  },
  methods: {
    nuevoEmpleado() {
      this.$router.push({ name: "incluirEmpleado" });
    },
    confirm(id) {
      this.$confirm(
        "This will permanently delete the file. Continue?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          this.eliminarEmpleado(id);
          this.$message({
            type: "success",
            message: "Delete completed"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Delete canceled"
          });
        });
    },
    eliminarEmpleado(id) {
      var index = this.empleados.findIndex(i => i.id === id);
      console.log(index);
      axios
        .delete(url + "/empleados/" + id)
        .then(console.log(this.empleados.splice(index, 1)));
    },
    obtenerListadoEmpleado() {
      axios
        .get(url + "/empleados?_expand=sucursal")
        .then(response => {
          console.log(response);
          this.empleados = response.data.slice(
            0,
            this.pageOne.itemsPerPage - 1
          );
          this.pageOne.totalItems = response.data.length;
        })
        .catch(e => {
          console.log(e);
        });
    },
    pageOneChanged(pageNum) {
      this.pageOne.currentPage = pageNum;
      axios
        .get(
          url + "/empleados?_expand=sucursal&_page=" + this.pageOne.currentPage
        )
        .then(response => {
          this.empleados = response.data.slice(0, this.pageOne.itemsPerPage);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  created() {
    this.obtenerListadoEmpleado();
  },
  updated() {},
  watch: {
    $route: "obtenerListadoEmpleado"
  }
};
</script>
<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
