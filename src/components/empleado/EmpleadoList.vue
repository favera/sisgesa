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
                    <a class="icon item" @click="insertarFirebase">
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
                            <span class="item" @click="guardarPaginacion(empleado.id)">
                                <i class="edit row icon"></i>
                            </span>

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
import { url } from "./../.././config/backend";
import { db } from "./../.././config/firebase";
let funcionariosRef = db.ref("/funcionarios");

export default {
  props: ["page"],
  data() {
    return {
      empleados: [],
      empleadosFirebase: [],
      keyPagination: [],
      clave: "-L20uHGEH_6EDbTP1d1U",
      pageOne: {
        currentPage: 1,
        totalItems: 0,
        itemsPerPage: 10
      }
    };
  },
  components: {
    appPagination: Pagination
  },
  methods: {
    insertarFirebase() {
      Array.from(this.empleadosFirebase).forEach(element => {
        funcionariosRef.push({
          activo: true,
          acnro: element.acnro,
          cargaLaboral: element.cargaLaboral,
          fechaIngreso: "04/01/2018",
          ips: "salario",
          medioTiempo: false,
          moneda: element.moneda,
          nombre: element.nombre,
          nroCedula: "1",
          salario: element.salario,
          salarioMinuto: element.salarioMinuto,
          sucursal: "",
          tipoHoraExtra: "bancoHora"
        });
      });
    },
    guardarPaginacion(empleadoId) {
      var page = {};
      page.currentPage = this.pageOne.currentPage;
      page.totalItems = this.pageOne.totalItems;
      page.itemsPerPage = this.pageOne.itemsPerPage;

      localStorage.setItem("page", JSON.stringify(page));

      this.$router.push({ name: "editarEmpleado", params: { id: empleadoId } });
    },
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
      var page = JSON.parse(localStorage.getItem("page") || null);
      console.log("Pagina" + page);

      if (page !== null) {
        //this.pageOne.currentPage = page.currentPage;
        this.pageOne.itemsPerPage = page.itemsPerPage;
        this.pageOne.totalItems = page.totalItems;

        this.pageOneChanged(page.currentPage);

        // axios
        //   .get(
        //     url +
        //       "/empleados?_expand=sucursal&_page=" +
        //       this.pageOne.currentPage
        //   )
        //   .then(response => {
        //     this.empleados = response.data.slice(0, this.pageOne.itemsPerPage);
        //   })
        //   .catch(e => {
        //     console.log(e);
        //   });
      } else {
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
      }
    },
    pageOneChanged(pageNum) {
      /*this.pageOne.currentPage = pageNum;
      axios
        .get(
          url + "/empleados?_expand=sucursal&_page=" + this.pageOne.currentPage
        )
        .then(response => {
          this.empleados = response.data.slice(0, this.pageOne.itemsPerPage);
        })
        .catch(e => {
          console.log(e);
        });*/

      //return;
      this.pageOne.currentPage = pageNum;
      Array.from(this.keyPagination).forEach(element => {
        if (element.pagina === pageNum) {
          console.log("Clave paginacion", element.clave);
          //this.clave = element.clave;
          //this.empleados = funcionariosRef.limitToLast(10).endAt(element.clave);
        }
      });
    }
  },
  created() {
    //this.obtenerListadoEmpleado();
    /* this.$bindAsArray(
      "empleados",
      funcionariosRef
        .orderByKey()
        .limitToLast(10)
        .endAt(this.clave)
    );*/

    //this.empleados = this.empleados.reverse();

    // axios.get(url + "/empleados").then(response => {
    //   console.log(response);
    //   this.empleadosFirebase = response.data;
    // });
    var llaves = [];
    var paginas;

    axios.get(funcionariosRef + ".json?shallow=true").then(res => {
      paginas = this.empleados;
      /*console.log(Object.keys(res.data).length);
      this.pageOne.totalItems = Object.keys(res.data).length;
      console.log("Valor Total Items", JSON.stringify(this.pageOne.totalItems));
      llaves = Object.keys(res.data);
      paginas = Math.ceil(llaves.length / 10);

      var indice = 9;
      for (var i = 1; i < paginas + 1; i++) {
        var modelo = {};
        modelo.clave = llaves[indice];
        console.log("Dentro del For", llaves[indice]);
        modelo.pagina = i;
        console.log("MODELO", JSON.stringify(modelo));
        indice = indice + 10;
        this.keyPagination.push(modelo);
      }
      this.keyPagination[this.keyPagination.length - 1].clave =
        llaves[llaves.length - 1];*/

      var keys = Object.keys(res.data).sort(); // Notice the .sort()!
      var pageLength = 10;
      var pageCount = keys.length / pageLength;
      var currentPage = 1;
      var promises = [];
      var nextKey;
      var query;
      var key;

      for (var i = 0; i < pageCount; i++) {
        key = keys[i * pageLength];
        console.log("key", key);
        query = funcionariosRef
          .orderByKey()
          .limitToFirst(pageLength)
          .startAt(key);
        promises.push(query.once("value"));
      }

      Promise.all(promises).then(function(snaps) {
        var pages = [];
        snaps.forEach(function(snap) {
          pages.push(snap.val());
          paginas.push(snap.val());
          //this.empleados.push(snap.val());
        });

        console.log("pages", pages);
        //process.exit();
      });
    });
  },
  computed: {
    /*listadoEmpleado: function() {
      this.pageOne.totalItems = this.empleados.length;

      if (this.pageOne.itemsPerPage === 10) {
        return this.empleados.slice(0, 10);
      } else {
      }
    }*/
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
