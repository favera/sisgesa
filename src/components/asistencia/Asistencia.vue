<template>
    <div class="ui twelve wide column">

        <div class="ui form">
            <h4 class="ui dividing header">Listado de Asistencia</h4>

            <div class="two fields">

                <div class="fifteen wide field">
                    <label for="salaryQuery">Consultar por:</label>

                    <div class="inline fields">
                        
                        <div class="ten wide field">

                            <div class="ui icon input">
                                <input type="text" placeholder="Buscar por nombre">
                                <i class="search icon"></i>
                            </div>

                        </div>

                        <div class="field">
                            <el-date-picker v-model="searchDateStart" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
                            </el-date-picker>
                        </div>

                        <div class="field">
                            <el-date-picker v-model="searchDateEnd" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy" >
                            </el-date-picker>
                        </div>

                        <div class="field" @click="obtenerDatos">
                            <button class="ui teal button">Listar</button>
                        </div>

                    </div>

                </div>

                <div class="field">

                    <div class="ui right floated main menu">

                        <a class="icon item">
                            <vue-xlsx-table @on-select-file="handleSelectedFile">

                                <span data-tooltip="Subir archivo de asistencia">
                                    <i class="upload teal icon"></i>
                                </span>

                            </vue-xlsx-table>
                        </a>
                        <a class="icon item" @click="confirmData" v-bind:class="{disabled: applyCss, 'not-active': applyCss}">
                            <span data-tooltip="Confirmar Asistencia">
                                <i class="checkmark box icon"></i>
                            </span>
                        </a>
                        <a class="icon item" @click="nuevaAsistencia">
                            <span data-tooltip="Crear Asistencia Manualmente">
                                <i class="plus icon"></i>
                            </span>
                        </a>

                        <a class="icon item">
                            <i class="print icon"></i>
                        </a>

                    </div>

                </div>

            </div>

            <div class="field">

                <table class="ui celled table">
                    <thead>
                        <tr>
                            <th>Funcionario</th>
                            <th>Fecha</th>
                            <th>Marcacion Entrada</th>
                            <th>Marcacion Salida</th>
                            <th>Horas Trabajadas</th>
                            <th>Horas Extras o Faltantes</th>
                            <th>Observacion</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="dato in datosMarcaciones" :key="dato.id" v-bind:class="{warning: !dato.isConfirmed}">
                            <td>{{dato.nombre || dato.empleado.nombre}}</td>
                            <td>{{dato.fecha}}</td>
                            <td>{{(dato.entrada || "--") + " hs"}}</td>
                            <td>{{(dato.salida || "--") + " hs"}}</td>
                            <td v-show="dato.isConfirmed">{{dato.horasTrabajadas}}</td>
                            <td></td>
                            <td>
                                <i class="edit row icon"></i>
                                <i class="trash icon"></i>
                            </td>
                        </tr>

                    </tbody>

                    <tfoot v-if="pageOne.totalItems > 0">
                        <tr>
                            <th colspan="6">
                                <app-pagination :current-page="pageOne.currentPage" :total-items="pageOne.totalItems" :items-per-page="pageOne.itemsPerPage" @page-changed="pageOneChanged">
                                </app-pagination>
                            </th>
                        </tr>
                    </tfoot>
                </table>

            </div>

        </div>

    </div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import Pagination from ".././shared/Pagination.vue";
export default {
  data() {
    return {
      datosMarcaciones: [],
      preDatos: [],
      applyCss: true,
      errors: [],
      funcionarios: [],
      searchDateStart: "",
      searchDateEnd: "",
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
    nuevaAsistencia() {
      this.$router.push("/nuevaAsistencia");
    },
    llamarFuncionarios() {
      axios.get("http://localhost:3000/empleados").then(response => {
        (this.funcionarios = response.data), console.log("entro en axios");
      });
    },
    handleSelectedFile(convertedData) {
      this.preDatos = convertedData.body;
      Array.from(this.funcionarios).map(value => {
        this.orderData(value.acnro, value.id, value.nombre);
      });
    },
    orderData(acnro, empleadoid, nombre) {
      var modelo = {
        fecha: "",
        empleadoId: null,
        nombre: "",
        entrada: "",
        salida: "",
        horasTrabajadas: null,
        isConfirmed: false
      };
      //propiedad que habilita o desabilita el boton de confirmar basado en el estado de isConfirmed
      this.applyCss = modelo.isConfirmed;

      for (let arr of this.preDatos) {
        if (acnro === arr["AC-No."]) {
          modelo.empleadoId = empleadoid;
          modelo.nombre = nombre;
          modelo.date = arr.Horario;
          modelo.fecha = moment(arr.Horario, "DD/MM/YYYY").format("L");

          if ("M/Ent" === arr.Estado) {
            modelo.entrada = moment(arr.Horario, "DD/MM/YY hh:mm a").format(
              "LT"
            );
            modelo.horasTrabajadas = moment
              .duration(modelo.entrada, "HH:mm")
              .asMinutes();
          } else if ("M/Sal" === arr.Estado) {
            modelo.salida = moment(arr.Horario, "DD/MM/YY hh:mm a").format(
              "LT"
            );
            modelo.horasTrabajadas =
              (modelo.horasTrabajadas -
                moment.duration(modelo.salida, "HH:mm").asMinutes()) *
              -1;
          }
        }
      }

      this.datosMarcaciones.push(modelo);
    },
    async confirmData() {
      await Promise.all(
        this.datosMarcaciones.map(async marcacion => {
          try {
            let response = await axios
              .post("http://localhost:3000/marcaciones", {
                fecha: marcacion.fecha,
                empleadoId: marcacion.empleadoId,
                entrada: marcacion.entrada,
                salida: marcacion.salida,
                horasTrabajadas: moment
                  .utc(marcacion.horasTrabajadas * 1000 * 60)
                  .format("HH:mm"),
                horasExtras: moment.duration,
                isConfirmed: true
              })
              .then(function(response) {
                console.log("from async" + response);
              })
              .catch(function(error) {
                console.log(error);
              });
          } catch (error) {
            console.log(error);
          }
        })
      );
      this.obtenerDatos();
      this.applyCss = true;
      console.log("after async");

      // this.datosMarcaciones.forEach(marcacion => {
      //   axios
      //     .post("http://localhost:3000/marcaciones", {
      //       fecha: marcacion.fecha,
      //       empleadoId: marcacion.empleadoId,
      //       entrada: marcacion.entrada,
      //       salida: marcacion.salida,
      //       isConfirmed: true
      //     })
      //     .then(function(response) {
      //       console.log(response);
      //     })
      //     .catch(function(error) {
      //       console.log(error);
      //     });
      // });
      //this.obtenerDatos();
      //setTimeout(this.obtenerDatos(), 3000);
      //se confirmo los registros
      //this.applyCss = true;
      //this.calcularBancoHora();
    },
    senData() {
      this.confirmData()
        .then(this.obtenerDatos(), (this.applyCss = true))
        .catch(e => {
          console.log(e);
        });
    },
    obtenerDatos() {
      axios
        .get("http://localhost:3000/marcaciones?_expand=empleado")
        .then(response => {
          console.log(response.data.length);
          this.datosMarcaciones = response.data.slice(
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
          "http://localhost:3000/marcaciones?_expand=empleado&_page=" +
            this.pageOne.currentPage
        )
        .then(response => {
          this.datosMarcaciones = response.data.slice(
            0,
            this.pageOne.itemsPerPage
          );
        })
        .catch(e => {
          console.log(e);
        });
    },
    calcularBancoHora() {
      var bancoHoraNuevo = [];
      var marcaciones = [];
      var bancoHora = [];
      var modelo = {
        empleadoId: null,
        mes: null,
        ano: null,
        horasCumplidas: null,
        horasCumplir: null
      };

      axios
        .get("http://localhost:3000/marcaciones")
        .then(response => {
          marcaciones = response.data;
          console.log("####Variable Marcaciones####" + marcaciones);
          axios
            .get("http://localhost:3000/bancoHora")
            .then(response => {
              bancoHora = response.data;
              console.log("###Variable banco hora####" + bancoHora);
              console.log("###Variable banco hora tam####" + bancoHora.length);
              if (bancoHora.length > 0) {
                console.log("Paso if length");
                Array.from(marcaciones).map(marcacion => {
                  Array.from(bancoHora).map(banco => {
                    if (
                      marcaciones.empleadoId === banco.empleadoId &&
                      banco.mes ===
                        moment(marcaciones.fecha, "DD/MM/YYYY").month() &&
                      banco.ano ===
                        moment(marcaciones.fecha, "DD/MM/YYYY").year()
                    ) {
                      bancoHora.horasCumplidas =
                        moment.duration(marcacion.salida, "HH:mm").asMinutes() -
                        moment.duration(marcacion.entrada, "HH:mm").asMinutes();
                      console.log("paso if largo " + bancoHora.horasCumplidas);
                    } else {
                      modelo.empleadoId = marcacion.empleadoId;
                      modelo.mes = moment(
                        marcacion.fecha,
                        "DD/MM/YYYY"
                      ).month();
                      modelo.ano = moment(marcacion.fecha, "DD/MM/YYYY").year();
                      modelo.horasCumplidas =
                        moment.duration(marcacion.salida, "HH:mm").asMinutes() -
                        moment.duration(marcacion.entrada, "HH:mm").asMinutes();
                      modelo.horasCumplir = null;
                      bancoHoraNuevo.push(modelo);
                      console.log("entro en el primer else");
                    }
                  });
                });
              } else {
                Array.from(marcaciones).map(marcacion => {
                  modelo.empleadoId = marcacion.empleadoId;
                  modelo.mes = moment(marcacion.fecha, "DD/MM/YYYY").month();
                  modelo.ano = moment(marcacion.fecha, "DD/MM/YYYY").year();
                  modelo.horasCumplidas =
                    moment.duration(marcacion.salida, "HH:mm").asMinutes() -
                    moment.duration(marcacion.entrada, "HH:mm").asMinutes();
                  modelo.horasCumplir = null;
                  bancoHoraNuevo.push(modelo);
                });
              }
            })
            .then(response => {
              axios
                .post("http://localhost:3000/bancoHora", {
                  resultado: bancoHoraNuevo
                })
                .then(response => console.log(response))
                .catch(e => console.log(e));
            });
        })
        .catch(e => conosle.log(e));
    }
  },
  created() {
    axios
      .get("http://localhost:3000/empleados")
      .then(response => (this.funcionarios = response.data));
  },
  mounted() {
    $(this.$el)
      .find(".ui.dropdown")
      .dropdown();
    this.llamarFuncionarios();
  }
};
</script>

<style>
.xlsx-button {
  background-color: transparent;
  border: none;
  padding: 0;
  color: rgba(0, 0, 0, 0.6) !important;
}

.ui.right.floated.menu {
  margin-top: 1.7rem;
}

.not-active {
  pointer-events: none;
  cursor: default;
}

.el-date-table td.current:not(.disabled),
.el-date-table td.end-date,
.el-date-table td.start-date {
  background-color: #00b5ad !important;
}

.el-date-table td.today {
  color: #00b5ad;
}

.el-date-table td.today:before {
  content: " ";
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-top: 0.5em solid #00b5ad;
  border-left: 0.5em solid transparent;
}

.el-date-editor.el-input {
  width: 160px;
}
</style>
