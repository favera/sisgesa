<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <div class="ui dividing header">Registrar Sucursal</div>
    
            <div class="ten wide field">
                <label for="">Nombre Sucursal:</label>
                <input type="text" v-model="sucursal.nombre">
            </div>

            <div class="ten wide field">
                <div class="inline fields">
                    <div class="eight wide field">
                        <label for="">Horario Entrada</label>
                    </div>
                    <div class="eight wide field">
                        <label for="">Horario Salida</label>
                    </div>
                </div>
                 <div class="inline fields">
                <div class="eight wide field">
                    <el-time-picker v-model="sucursal.horarioEntradaUtc"  format="HH:mm"
                    :picker-options="{
                    format: 'HH:mm'
                    }"
                    placeholder="Asignar Horario Entrada">
                </el-time-picker>
                </div>

                <div class="eight wide field">
                    <el-time-picker v-model="sucursal.horarioSalidaUtc" format="HH:mm"
                    :picker-options="{
                    format: 'HH:mm'
                    }"
                    placeholder="Asignar Horario Entrada">
                </el-time-picker>
                </div>
            </div>
            </div>
            
           
    
            <div class="ten wide field">
                <label for="">Telefono:</label>
                <input type="text" v-model="sucursal.telefono">
            </div>
    
            <div class="ui teal button" @click="guardarSucursal">Guardar</div>
            <div class="ui button" @click="cancelar">Cancelar</div>
        </div>
    </div>
</template>
<script>
import axios from "axios";
import moment from "moment";
const url = "https://mdl-sisgesa-back.herokuapp.com";
//const url = "http://localhost:3000";
export default {
  data() {
    return {
      sucursal: {
        nombre: null,
        horarioEntradaUtc: null,
        horarioSalidaUtc: null,
        horaLaboral: null,
        telefono: null
      }
    };
  },
  methods: {
    guardarSucursal() {
      if (typeof this.$route.params.id !== "undefined") {
        axios
          .put(url + "/sucursals/" + this.$route.params.id, {
            nombre: this.sucursal.nombre,
            horarioEntrada: moment
              .utc(this.sucursal.horarioEntradaUtc)
              .local()
              .format("HH:mm"),
            horarioEntradaUtc: this.sucursal.horarioEntradaUtc,
            horarioSalida: moment
              .utc(this.sucursal.horarioSalidaUtc)
              .local()
              .format("HH:mm"),
            horarioSalidaUtc: this.sucursal.horarioSalidaUtc,
            horaLaboral: moment(this.sucursal.horarioSalidaUtc).diff(
              this.sucursal.horarioEntradaUtc,
              "minutes"
            ),
            telefono: this.sucursal.telefono
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          })
          .catch(e => console.log(e));
      } else {
        axios
          .post(url + "/sucursals", {
            nombre: this.sucursal.nombre,
            horarioEntrada: moment
              .utc(this.sucursal.horarioEntradaUtc)
              .local()
              .format("HH:mm"),
            horarioEntradaUtc: this.sucursal.horarioEntradaUtc,
            horarioSalida: moment
              .utc(this.sucursal.horarioSalidaUtc)
              .local()
              .format("HH:mm"),
            horarioSalidaUtc: this.sucursal.horarioSalidaUtc,
            horaLaboral: moment(this.sucursal.horarioSalidaUtc).diff(
              this.sucursal.horarioEntradaUtc,
              "minutes"
            ),
            telefono: this.sucursal.telefono
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          })
          .catch(e => console.log(e));
      }
    },
    obtenerSucursal() {
      if (typeof this.$route.params.id !== "undefined") {
        axios
          .get(url + "/sucursals/" + this.$route.params.id)
          .then(response => {
            this.sucursal.nombre = response.data.nombre;
            this.sucursal.horarioEntradaUtc = response.data.horarioEntradaUtc;
            this.sucursal.horarioSalidaUtc = response.data.horarioSalidaUtc;
            this.sucursal.telefono = response.data.telefono;
          })
          .catch(e => console.log(e));
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoSucursal" });
    },
    success() {
      this.$notify({
        title: "Exito!",
        message: "La sucursal se ha creado correctamente",
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
  created() {
    this.obtenerSucursal();
  },
  watch: {
    $route: "obtenerSucursal"
  }
};
</script>
<style>

</style>
