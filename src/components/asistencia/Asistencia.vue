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
                            <td>{{dato.horasTrabajadas}}</td>
                            <td>{{dato.horasExtras}}</td>
                            <td></td>
                            <td>
                                <i class="edit row icon"></i>
                                <i class="trash icon"></i>
                            </td>
                        </tr>

                    </tbody>

                    <tfoot v-if="pageOne.totalItems > 0">
                        <tr>
                            <th colspan="8">
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
      console.dir("####### Dtos " + JSON.stringify(convertedData));
      this.preDatos = convertedData.body;
      var flagEntrada = true;
      var flagSalida = true;
      //console.log("Datos" + this.preDatos);
      Array.from(this.funcionarios).forEach(value => {
        this.orderData(
          value.acnro,
          value.id,
          value.nombre,
          value.cargaLaboral,
          flagEntrada,
          flagSalida
        );
        //setea a true los flags para el siguiente item de funcionarios, para que pueda volver a validar la entrada y salida
        flagEntrada = true;
        flagSalida = true;
      });
    },
    orderData(
      acnro,
      empleadoid,
      nombre,
      cargaLaboral,
      flagEntrada,
      flagSalida
    ) {
      var modelo = {
        fecha: "",
        empleadoId: null,
        nombre: "",
        entrada: "",
        salida: "",
        horasTrabajadas: "",
        isConfirmed: false,
        //hora extra inicia con la cantidad de horas en minutos que tiene que cumplir el funcionario por dia
        // horasExtras = horasTrabajadas - horasAtrabajar
        horasExtras: moment.duration(cargaLaboral, "HH:mm").asMinutes()
      };
      //console.log("Hora Extra Inicial " + modelo.horasExtras);
      //propiedad que habilita o desabilita el boton de confirmar basado en el estado de isConfirmed
      this.applyCss = modelo.isConfirmed;

      for (let arr of this.preDatos) {
        if (acnro === arr["AC-No."]) {
          modelo.empleadoId = empleadoid;
          modelo.nombre = nombre;
          modelo.date = arr.Horario;
          modelo.fecha = moment(arr.Horario, "DD/MM/YYYY").format("L");
          console.log("Horario sin formato " + arr.Horario);
          console.log(
            "Horario: " + moment(arr.Horario, "DD/MM/YYYY HH:mm a").format("LT")
          );

          //si la fecha del archivo excel contiene a.m. es una entrada
          if (arr.Horario.includes("a.m.") && flagEntrada) {
            modelo.entrada = moment(arr.Horario, "DD/MM/YYYY hh:mm a").format(
              "HH:mm"
            );
            flagEntrada = false;

            console.log("Entrada " + modelo.entrada + " Flag " + flagEntrada);
          }

          // Por si exista una entrada menos a la que se encontro primero
          if (
            moment(arr.Horario, "DD/MM/YYYY hh:mm a").format("HH:mm") <
            modelo.entrada
          ) {
            modelo.entrada = moment(arr.Horario, "DD/MM/YYYY hh:mm a").format(
              "HH:mm"
            );
            console.log(
              "Entrada Menor " + modelo.entrada + " Flag " + flagEntrada
            );
          }

          //si la fecha que viene de la planilla tiene p.m. es una salida
          if (arr.Horario.includes("p.m.") && flagSalida) {
            moment.salida = moment(arr.Horario, "DD/MM/YYYY hh:mm a").format(
              "HH:mm"
            );
            flagSalida = false;
            console.log("Salida " + modelo.salida + " Flag " + flagSalida);
          }

          //verifica si existe una salida mayor y le asigna el mayor valor
          if (
            arr.Horario.includes("p.m.") &&
            moment(arr.Horario, "DD/MM/YYYY hh:mm a").format("HH:mm") >
              modelo.salida
          ) {
            modelo.salida = moment(arr.Horario, "DD/MM/YYYY hh:mm a").format(
              "HH:mm"
            );
            console.log(
              "Salida Mayor " + modelo.salida + " Flag " + flagSalida
            );
          }
        }
      }
      //inserta en el array datosMarcaciones, para volver a iterar en el siguiente item
      this.datosMarcaciones.push(modelo);
    },
    //maneja los valores negativos resultante de las horas extras
    handleNegative(mins) {
      var h, m;
      if (mins >= 24 * 60) {
        throw new RangeError(
          "Valid input should be greater than or equal to 0 and less than 1440."
        );
      }
      if (mins < 0) {
        mins = mins * -1;
        h = Math.floor(mins / 60);
        m = mins % 60;
        return (
          "-" +
          moment
            .utc()
            .hours(h)
            .minutes(m)
            .format("HH:mm")
        );
      } else {
        h = Math.floor(mins / 60);
        m = mins % 60;
        return moment
          .utc()
          .hours(h)
          .minutes(m)
          .format("HH:mm");
      }
    },
    //Hace post al array marcaciones y luego llama la lista, por eso es asincronico
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
                //calculo de Horas trabajadas
                horasTrabajadas: this.handleHorasTrabajadas(
                  marcacion.entrada,
                  marcacion.salida
                ),
                //calculo de horas Extras
                horasExtras: this.handleHorasExtras(
                  marcacion.entrada,
                  marcacion.salida,
                  marcacion.horasExtras
                ),
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
      //llama la lista
      this.obtenerDatos();
      //cambia de color en la lista
      this.applyCss = true;
      console.log("after async");
    },
    async prepareData() {
      const getBancoHora = await axios.get("http://localhost:3000/bancoHora");
      const getMarcaciones = await axios.get(
        "http://localhost:3000/marcaciones"
      );

      const [marcaciones, bancoHora] = await Promise.all([
        getMarcaciones,
        getBancoHora
      ]);
      console.log(marcaciones.data(), bancoHora.data());
    },
    handleHorasTrabajadas(entrada, salida) {
      var result = moment("00:00", "hh:mm").format("00:00");
      if (entrada !== "" && salida !== "") {
        result =
          moment.duration(salida, "HH:mm").asMinutes() -
          moment.duration(entrada, "HH:mm").asMinutes();
        console.log("Horas trabajadas " + result);
        return moment.utc(result * 1000 * 60).format("HH:mm");
      }
      console.log("Horas trabajadas " + result);
      return result;
    },
    handleHorasExtras(entrada, salida, horasExtras) {
      var horasTrabajadas = this.handleHorasTrabajadas(entrada, salida),
        result;
      console.log("Horas Extras " + horasExtras);
      console.log("Horas trabajadas " + horasTrabajadas);
      if (!horasTrabajadas.localeCompare("00:00")) {
        return "-" + moment.utc(horasExtras * 1000 * 60).format("HH:mm");
      } else {
        result =
          moment.duration(horasTrabajadas, "HH:mm").asMinutes() - horasExtras;
        return this.handleNegative(result);
      }
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
