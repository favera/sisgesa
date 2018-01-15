<template>
<div class="ui twelve wide column">
    <div class="ui form">
        <div class="ui dividing header">Incluir Evento</div>

       

    <div class="ten wide field">
        <div class="field">
            <label for="">Tipo de Evento:</label>
        </div>

        <div class="inline fields">
            <div class="four wide field">
                <div class="ui radio checkbox">
                    <input type="radio" v-model="calendario.tipoEvento" value="feriado">
                    <label>Feriado</label>
                </div>
            </div>

            <div class="four wide field">
                <div class="ui radio checkbox">
                    <input type="radio" v-model="calendario.tipoEvento" value="vacaciones">
                    <label>Vacaciones</label>
                </div>
            </div>

           
        </div>
    </div>

     <div class="ten wide field" v-if="calendario.tipoEvento === 'feriado'">
        <label for="">Seleccionar Fecha del Feriado</label>
        <el-date-picker v-model="calendario.fechaFeriadoUtc" format="dd/MM/yyyy" type="date" placeholder="Seleccionar fecha"></el-date-picker>
    </div>

    <div class="ten wide field" v-else-if="calendario.tipoEvento ==='vacaciones'">
        <div class="field">
            <label for="">Seleccionar Funcionario</label>
            <select v-model="funcionariokey" class="ui fluid dropdown">
                <option disabled value="">Seleccionar Funcionario..</option>
                <option v-for="funcionario in funcionarios" :key="funcionario['.key']" v-bind:value="funcionario['.key']" :selected="funcionario['.key'] === Object.keys(calendario.funcionarioId)[0] ? true : false">{{funcionario.nombre}}</option>
            </select>
        </div>

        <div class="field">
            <label>Periodo de Vaciones</label>
            <div class="inline fields">
                <label>Fecha Inicio:</label>
                <div class="field">
                    <el-date-picker v-model="calendario.fechaInicioUtc" format="dd/MM/yyyy" type="date" placeholder="Seleccionar Fecha"></el-date-picker>
                </div>

                <label>Fecha Fin:</label>
                <div class="field">
                    <el-date-picker v-model="calendario.fechaFinUtc" format="dd/MM/yyyy" type="date" placeholder="Seleccionar Fecha"></el-date-picker>
                </div>
            </div>
        </div>
    </div>

    <div class="ten wide field">
        <div class="ui teal button" @click="guardarEvento()">Guardar</div>
        <div class="ui button" @click="cancelar()">Cancelar</div>
    </div>

    
    
</div>

    
</div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { db } from "./../.././config/firebase";
let funcionariosRef = db.ref("/funcionarios");
let calendarioRef = db.ref("/calendario");

export default {
  data() {
    return {
      calendario: {
        tipoEvento: "feriado",
        fechaFeriado: null,
        fechaFeriadoUtc: null,
        fechaInicio: null,
        fechaInicioUtc: null,
        fechaFin: null,
        fechaFinUtc: null,
        funcionarioId: {}
      },
      funcionariokey: "",
      funcionarios: []
    };
  },
  methods: {
    obtenerEvento() {
      console.log(this.$route.params.id);

      if (typeof this.$route.params.id !== "undefined") {
        console.log(calendarioRef.child(this.$route.params.id));
        calendarioRef.child(this.$route.params.id).once("value", snapshot => {
          console.log(snapshot.val());
          this.calendario.tipoEvento = snapshot.val().tipoEvento;
          this.calendario.fechaFeriadoUtc = snapshot.val().fechaFeriadoUtc;
          this.calendario.funcionarioId = snapshot.val().funcionarioId;
          this.calendario.fechaInicioUtc = snapshot.val().fechaInicioUtc;
          this.calendario.fechaFinUtc = snapshot.val().fechaFinUtc;
          /* $(this.$el)
            .find(".ui.fluid.dropdown")
            .dropdown(
              "set selected",
              Object.keys(snapshot.val().funcionarioId)[0]
            );*/
        });
      }
    },
    guardarEvento() {
      if (typeof this.$route.params.id !== "undefined") {
        console.log("QUE LO PASAAAA", this.$route.params.id);
        if (this.calendario.tipoEvento === "feriado") {
          console.log("Entro en Feriado");
          this.calendario.fechaFeriado = moment(
            this.calendario.fechaFeriadoUtc,
            "DD/MM/YYYY"
          )
            .format("L")
            .toString();
          this.calendario.fechaFeriadoUtc = this.calendario.fechaFeriadoUtc.toString();

          calendarioRef
            .child(this.$route.params.id)
            .update(this.calendario)
            .then(res => {
              console.log("response", res);
              this.success();
              this.cancelar();
            });
        } else {
          if (this.calendario.tipoEvento === "vacaciones") {
            console.log("Entro en Vacaciones");
            this.calendario.fechaInicioUtc = null;
            this.calendario.fechaFinUtc = null;
            this.calendario.fechaInicio = moment(
              this.calendario.fechaInicioUtc,
              "DD/MM/YYYY"
            )
              .format("L")
              .toString();
            this.calendario.fechaInicioUtc = this.calendario.fechaInicioUtc.toString();
            this.calendario.fechaFin = moment(
              this.calendario.fechaFinUtc,
              "DD/MM/YYYY"
            )
              .format("L")
              .toString();
            this.calendario.fechaFinUtc = this.calendario.fechaFinUtc.toString();
            this.calendario.funcionarioId[this.funcionariokey] = true;
          }
        }
      } else {
        console.log("whaaaaaat");
        if (this.calendario.tipoEvento === "feriado") {
          console.log("Entro en Feriado");
          this.calendario.fechaFeriado = moment(
            this.calendario.fechaFeriadoUtc,
            "DD/MM/YYYY"
          )
            .format("L")
            .toString();
          this.calendario.fechaFeriadoUtc = this.calendario.fechaFeriadoUtc.toString();

          //Inserta resgitro feriado en calendario
          calendarioRef
            .push(this.calendario)
            .then(this.success(), this.cancelar());
        } else {
          if (this.calendario.tipoEvento === "vacaciones") {
            console.log("Entro en Vacaciones");
            this.calendario.fechaFeriadoUtc = null;
            this.calendario.fechaInicio = moment(
              this.calendario.fechaInicioUtc,
              "DD/MM/YYYY"
            )
              .format("L")
              .toString();
            this.calendario.fechaInicioUtc = this.calendario.fechaInicioUtc.toString();
            this.calendario.fechaFin = moment(
              this.calendario.fechaFinUtc,
              "DD/MM/YYYY"
            )
              .format("L")
              .toString();
            this.calendario.fechaFinUtc = this.calendario.fechaFinUtc.toString();
            this.calendario.funcionarioId[this.funcionariokey] = true;

            //inserta registro en calendario y en funcionario con el mismo id
            // Get a key for a new Post.

            var newEventKey = calendarioRef.child("posts").push().key;

            console.log(newEventKey);
            var vacaciones = {};
            vacaciones[newEventKey] = true;

            // Write the new post's data simultaneously in the posts list and the user's post list.
            var updates = {};
            updates["/calendario/" + newEventKey] = this.calendario;
            updates[
              "/funcionarios/" + this.funcionariokey + "/vacaciones"
            ] = vacaciones;

            db.ref().update(updates);
          }
        }

        /* calendarioRef
          .push(this.calendario)
          .then(this.success(), this.cancelar());*/
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoCalendario" });
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
    $(this.$el)
      .find(".ui.fluid.dropdown")
      .dropdown();
  },
  created() {
    this.$bindAsArray("funcionarios", funcionariosRef);
    this.obtenerEvento();
    console.log(this.$route.params.id);
  },
  watch: {
    $route: "obtenerEvento"
  }
};
</script>

<style>

</style>


