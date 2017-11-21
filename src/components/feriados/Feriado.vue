<template>
<div class="ui twelve wide column">
    <div class="ui form">
        <div class="ui dividing header">Incluir Feriado</div>

        <div class="ten wide field">
        <label for="">Seleccionar Fecha del Feriado</label>
        <el-date-picker v-model="feriado.fecha" format="dd/MM/yyyy" type="date" placeholder="Seleccionar fecha"></el-date-picker>
    </div>

    <div class="ten wide field">
        <div class="field">
            <label for="">Tipo de Feriado:</label>
        </div>

        <div class="inline fields">
            <div class="four wide field">
                <div class="ui radio checkbox">
                    <input type="radio" v-model="feriado.tipoFeriado" value="completo">
                    <label>Completo</label>
                </div>
            </div>

            <div class="four wide field">
                <div class="ui radio checkbox">
                    <input type="radio" v-model="feriado.tipoFeriado" value="parcial">
                    <label>Parcial</label>
                </div>
            </div>

            <div class="eight wide field" v-show="feriado.tipoFeriado ==='parcial'">
               <el-time-picker  v-model="feriado.horas" format="HH:mm"
                    :picker-options="{
                    format: 'HH:mm'
                    }"
                    placeholder="Asignar Horas del feriado">
                </el-time-picker>
            </div>
        </div>
    </div>

    <div class="ten wide field">
        <label for="">Seleccionar Sucursales afectadas</label>
        <select name="sucursales" multiple="" class="ui fluid dropdown" v-model="feriado.sucursalesAfectadas">
            <option v-for="sucursal in sucursales" :key="sucursal.id" v-bind:value="sucursal.nombreSucursal">{{sucursal.nombreSucursal}}</option>
        </select>
    </div>

    <div class="ui teal button" @click="sendData()">Guardar</div>
    <div class="ui button" @click="cancelar()">Cancelar</div>
</div>

    
</div>
</template>

<script>
import moment from "moment";
import axios from "axios";
export default {
  data() {
    return {
      feriado: {
        fecha: "",
        tipoFeriado: "completo",
        horas: "",
        sucursalesAfectadas: []
      },
      sucursales: []
    };
  },
  methods: {
    obtenerSucursales() {
      axios.get("http://localhost:3000/sucursales").then(response => {
        this.sucursales = response.data;
        console.log(this.sucursales);
      });
    },
    cancelar() {
      this.$router.push({ name: "listadoFeriado" });
    },
    obtenerFeriado() {
      console.log(this.$route.params.id);

      if (typeof this.$route.params.id != "undefined") {
        axios
          .get("http://localhost:3000/feriados/" + this.$route.params.id)
          .then(response => {
            console.log(response.data);
            (this.feriado.fecha = response.data.fecha),
              (this.feriado.tipoFeriado = response.data.tipoFeriado),
              (this.feriado.horas = response.data.horas),
              (this.feriado.sucursalesAfectadas =
                response.data.sucursalesAfectadas);
          });
      }
    },
    sendData() {
      var horaResult;
      if (this.feriado.tipoFeriado === "parcial") {
        horaResult = moment
          .utc(this.feriado.horas)
          .local()
          .format("HH:mm");
      } else {
        horaResult = null;
      }
      axios
        .post("http://localhost:3000/feriados", {
          fecha: moment(this.feriado.fecha, "DD/MM/YYYY").format("L"),
          tipoFeriado: this.feriado.tipoFeriado,
          horas: horaResult,
          sucursalesAfectadas: this.feriado.sucursalesAfectadas
        })
        .then(response => {
          console.log(response);
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.obtenerSucursales();
    $(this.$el)
      .find(".ui.fluid.dropdown")
      .dropdown();
  },
  created() {
    this.obtenerFeriado();
  },
  watch: {
    $route: "obtenerFeriado"
  }
};
</script>

<style>

</style>


