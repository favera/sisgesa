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
import { url } from "./../.././config/backend";
import { db } from "./../.././config/firebase";
let sucursalRef = db.ref("sucursales");

export default {
  data() {
    return {
      sucursal: {
        nombre: null,
        horarioEntradaUtc: null,
        horarioSalidaUtc: null,
        horaLaboral: null,
        telefono: null
      },
      firebase: {
        sucursal: sucursalRef
      }
    };
  },
  methods: {
    guardarSucursal() {
      if (typeof this.$route.params.id !== null) {
        sucursalRef
          .child(this.$route.params.id)
          .update({
            nombre: this.sucursal.nombre,
            horarioEntrada: moment
              .utc(this.sucursal.horarioEntradaUtc)
              .local()
              .format("HH:mm"),
            horarioSalida: moment
              .utc(this.sucursal.horarioSalidaUtc)
              .local()
              .format("HH:mm"),

            horaLaboral: moment(this.sucursal.horarioSalidaUtc).diff(
              this.sucursal.horarioEntradaUtc,
              "minutes"
            ),
            horarioEntradaUtc: this.sucursal.horarioEntradaUtc.toString(),
            horarioSalidaUtc: this.sucursal.horarioSalidaUtc.toString(),
            telefono: this.sucursal.telefono
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          });
      } else {
        db
          .ref("sucursales")
          .push({
            nombre: this.sucursal.nombre,
            horarioEntrada: moment
              .utc(this.sucursal.horarioEntradaUtc)
              .local()
              .format("HH:mm"),
            horarioSalida: moment
              .utc(this.sucursal.horarioSalidaUtc)
              .local()
              .format("HH:mm"),

            horaLaboral: moment(this.sucursal.horarioSalidaUtc).diff(
              this.sucursal.horarioEntradaUtc,
              "minutes"
            ),
            horarioEntradaUtc: this.sucursal.horarioEntradaUtc.toString(),
            horarioSalidaUtc: this.sucursal.horarioSalidaUtc.toString(),
            telefono: this.sucursal.telefono
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          });
      }
    },
    obtenerSucursal() {
      if (typeof this.$route.params.id !== "undefined") {
        console.log(sucursalRef.child(this.$route.params.id));
        sucursalRef.child(this.$route.params.id).once("value", snapshot => {
          console.log(snapshot.val());
          this.sucursal.nombre = snapshot.val().nombre;
          this.sucursal.horarioEntradaUtc = snapshot.val().horarioEntradaUtc;
          this.sucursal.horarioSalidaUtc = snapshot.val().horarioSalidaUtc;
          this.sucursal.telefono = snapshot.val().telefono;
        });
        /*db.ref("/sucursal/" + this.$route.params.id).on("value", snapshot => {
          console.log(snapshot.val());
          this.sucursal.nombre = snapshot.val().nombre;
        });*/
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
    //console.log(sucursalRef.child(this.$route.params.id));
  },
  watch: {
    $route: "obtenerSucursal"
  }
};
</script>
<style>

</style>
