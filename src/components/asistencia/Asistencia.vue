<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <div class="ui dividing header">Registrar Asistencia</div>
            <div class="five wide field">
                <label for="">Fecha:</label>
                <el-date-picker v-model="marcacion.fecha" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
                            </el-date-picker>
            </div>
         
            <div class="two fields">
                <div class="six wide field">
                    <label for="">Funcionario:</label>
                <select v-model="marcacion.empleadoId">
                    <option v-for="empleado in empleados"  v-bind:value="empleado.id" :key="empleado.id" :selected="empleado.id === marcacion.empleadoId ? true : false" >{{empleado.nombre}}</option>
                </select>
                </div>
                
            </div>

            <div class="fields">
                <div class="field">
                    <label for="">Marcacion Entrada:</label>
                    <el-time-picker  v-model="marcacion.entrada" format="HH:mm"
                    :picker-options="{
                    format: 'HH:mm'
                    }"
                    placeholder="Seleccionar hora">
                </el-time-picker>
                </div>
                <div class="field">
                    <label for="">Marcacion Salida</label>
                    <el-time-picker  v-model="marcacion.salida" format="HH:mm"
                    :picker-options="{
                    format: 'HH:mm'
                    }"
                    placeholder="Seleccionar hora">
                </el-time-picker>
                </div>

            </div>

            <div class="ten wide field">
                <label for="">Observacion:</label>
                <textarea name="" id="" rows="2" v-model="marcacion.observacion"></textarea>
            </div>
            <div class="ui teal button" @click="guardarMarcacion">Guardar</div>
            <div class="ui button" @click="cancelar">Cancelar</div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
import { url } from "./../.././config/backend";
export default {
  data() {
    return {
      marcacion: {
        fecha: null,
        empleadoId: null,
        entrada: null,
        salida: null,
        horasTrabajadas: null,
        horasExtras: null,
        isConfirmed: null,
        observacion: null
      },
      empleados: [],
      selPay: ""
    };
  },
  methods: {
    guardarMarcacion() {
      if (typeof this.$route.params.id !== "undefined") {
        axios
          .put(url + "/marcaciones/" + this.$route.params.id, {
            fecha: moment(this.marcacion.fecha, "DD/MM/YYYY").format("L"),
            empleadoId: this.marcacion.empleadoId,
            entrada: moment
              .utc(this.marcacion.entrada)
              .local()
              .format("HH:mm"),
            salida: moment
              .utc(this.marcacion.salida)
              .local()
              .format("HH:mm"),
            horasTrabajadas: this.getHorasTrabajadas(
              this.marcacion.entrada,
              this.marcacion.salida
            ),
            horasExtras: this.getHorasExtras(
              this.marcacion.empleadoId,
              this.marcacion.entrada,
              this.marcacion.salida
            ),
            retraso: this.calcularRetraso(
              this.marcacion.empleadoId,
              this.marcacion.entrada
            ),
            isConfirmed: true,
            estilo: this.aplicarEstilo(
              this.marcacion.entrada,
              this.marcacion.salida
            )
          })
          .then(response => {
            console.log(response);
            this.success();
            this.cancelar();
          })
          .catch(e => console.log(e));
      } else {
        axios
          .post(url + "/marcaciones", {
            fecha: moment(this.marcacion.fecha, "DD/MM/YYYY").format("L"),
            empleadoId: this.marcacion.empleadoId,
            entrada: moment
              .utc(this.marcacion.entrada)
              .local()
              .format("HH:mm"),
            salida: moment
              .utc(this.marcacion.salida)
              .local()
              .format("HH:mm"),
            horasTrabajadas: this.getHorasTrabajadas(
              this.marcacion.entrada,
              this.marcacion.salida
            ),
            horasExtras: this.getHorasExtras(
              this.marcacion.empleadoId,
              this.marcacion.entrada,
              this.marcacion.salida
            ),
            retraso: this.calcularRetraso(
              this.marcacion.empleadoId,
              this.marcacion.entrada
            ),
            isConfirmed: true,
            estilo: this.aplicarEstilo(
              this.marcacion.entrada,
              this.marcacion.salida
            )
          })
          .then(response => {
            console.log(response);
            this.success();
            this.cancelar();
          })
          .catch(e => console.log(e));
      }
    },
    calcularRetraso(empleadoId, entrada) {
      var horaEntrada;
      this.empleados.filter(element => {
        if (element.id === empleadoId) {
          horaEntrada = moment
            .duration(element.sucursal.horarioEntrada, "HH:mm")
            .asMinutes();
          console.log("HORARIO ENTRADA FUNCIONARIO", horaEntrada);
        }
      });
      var entrada = moment
        .utc(entrada)
        .local()
        .format("HH:mm");
      console.log("Entrada", entrada);
      var retraso = horaEntrada - moment.duration(entrada, "HH:mm").asMinutes();

      console.log("Resultado retraso ", retraso);

      if (retraso < 0) {
        retraso = retraso * 2;
        return this.handleNegative(retraso);
      } else {
        retraso = null;
        return retraso;
      }
    },
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
    aplicarEstilo(entrada, salida) {
      var estilo = {};
      estilo.ausente = false;
      estilo.incompleto = false;
      if (entrada == null && salida == null) {
        console.log("DESDE ESTILO " + entrada, salida);
        estilo.ausente = true;
        estilo.incompleto = false;
        return estilo;
      } else {
        if (entrada == null || salida == null) {
          console.log("DESDE ESTILO " + entrada, salida);
          estilo.ausente = false;
          estilo.incompleto = true;
          return estilo;
        }
      }
      return estilo;
    },
    getHorasTrabajadas(entrada, salida) {
      var horasTrabajadas = moment(salida).diff(entrada, "minutes");
      return this.convertToHours(horasTrabajadas);
    },
    getHorasExtras(empleadoId, entrada, salida) {
      var cargaLaboral;
      this.empleados.filter(element => {
        if (element.id === empleadoId) {
          cargaLaboral = moment
            .duration(element.cargaLaboral, "HH:mm")
            .asMinutes();
        }
      });

      console.log("Resultado carga laboral" + cargaLaboral);

      var horasTrabajadas = moment(salida).diff(entrada, "minutes");
      console.log("Horas Trabajadas " + horasTrabajadas);

      var result = horasTrabajadas - cargaLaboral;
      console.log("Resultado" + result);
      return this.convertToHours(result);
    },
    convertToHours(mins) {
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
    obtenerMarcacion() {
      var offset = moment().utcOffset();
      console.log(offset);
      if (typeof this.$route.params.id != "undefined") {
        axios
          .get(url + "/marcaciones/" + this.$route.params.id)
          .then(response => {
            this.marcacion.fecha = response.data.fecha;
            this.marcacion.empleadoId = response.data.empleadoId;
            this.marcacion.entrada = moment(
              response.data.entrada,
              "HH:mm"
            ).toISOString();
            this.marcacion.salida = moment(
              response.data.salida,
              "HH:mm"
            ).toISOString();
            this.marcacion.horasTrabajadas = response.data.horasTrabajadas;
            this.marcacion.horasExtras = response.data.horasExtras;
            this.marcacion.observacion = response.data.observacion;
            console.log(response.data);
            console.log(
              "Fecha UTC " +
                moment(response.data.entrada, "HH:mm").toISOString()
            );
            console.log(
              "Fecha UTC offset " +
                moment
                  .utc(response.data.entrada, "HH:mm")
                  .utcOffset(offset)
                  .format()
            );
          })
          .catch(e => console.log(e));
      }
    },
    obtenerFuncionario() {
      axios
        .get(url + "/empleados?_expand=sucursal")
        .then(response => {
          console.log(response);
          this.empleados = response.data;
        })
        .catch(e => console.log(e));
    },
    cancelar() {
      this.$router.push({ name: "listadoAsistencia" });
    },
    success() {
      this.$notify({
        title: "Exito!",
        message: "El registro se ha creado correctamente",
        type: "success"
      });
    },
    fail() {
      this.$notify.error({
        title: "Error!",
        message: "No se ha podido guardar el registro"
      });
    }
  },
  mounted() {
    this.obtenerFuncionario();
  },
  created() {
    this.obtenerMarcacion();
  },
  watch: {
    $route: "obtenerMarcacion"
  }
};
</script>
<style>
.test-asis {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
</style>
