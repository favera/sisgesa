<template>
<div class="ui twelve wide column">
    <div class="ui form">
        <div class="ui dividing header">Incluir Adelanto</div>

        <div class="ten wide field">
        <label for="">Fecha:</label>
        <el-date-picker v-model="adelanto.fechaUtc" format="dd/MM/yyyy" type="date" ></el-date-picker>
    </div>

    <div class="ten wide field">
        <label for="">Seleccionar Funcionario</label>
        <select name="funcionarios" v-model="adelanto.funcionarioId" >
            <option disabled value="">Seleccionar Funcionario..</option>
            <option v-for="funcionario in funcionarios" :key="funcionario['.key']" v-bind:value="funcionario['.key']">{{funcionario.nombre}}</option>
        </select>
    </div>

    <div class="ten wide field">
        <div class="field">
            <label for="">Tipo de Adelanto:</label>
        </div>

        <div class="inline fields">
            <div class="four wide field">
                <div class="ui radio checkbox">
                    <input type="radio" v-model="adelanto.tipoAdelanto" value="quincena" @click="disabledInput = true">
                    <label>Quincena</label>
                </div>
            </div>

            <div class="four wide field">
                <div class="ui radio checkbox">
                    <input type="radio" v-model="adelanto.tipoAdelanto" value="especificado" @click="disabledInput = false">
                    <label>Especificar Monto</label>
                </div>
            </div>

            <div class="eight wide field">
                <div class="ui input" v-bind:class="{'disabled': disabledInput}">
                <input type="text">
            </div>
            </div>

            
        </div>
    </div>

    

    <div class="ui teal button" @click="guardarFeriado()">Guardar</div>
    <div class="ui button" @click="cancelar()">Cancelar</div>
</div>

    
</div>
</template>

<script>
import moment from "moment";
import axios from "axios";
import { db } from "./../.././config/firebase";
let funcionariosRef = db.ref("/funcionarios");
export default {
  data() {
    return {
      adelanto: {
        fechaUtc: new Date(),
        fecha: null,
        funcionarioId: null,
        nombreFuncionario: null,
        tipoAdelanto: "quincena",
        monto: null
      },
      disabledInput: true,
      setDate: new Date(),
      funcionarios: []
    };
  },
  methods: {
    obtenerAdelanto() {
      console.log(this.$route.params.id);

      if (typeof this.$route.params.id !== "undefined") {
        console.log(feriadoRef.child(this.$route.params.id));
        feriadoRef.child(this.$route.params.id).once("value", snapshot => {
          console.log(snapshot.val());
          this.feriado.fechaUtc = snapshot.val().fechaUtc;
          this.feriado.tipoFeriado = snapshot.val().tipoFeriado;
          this.feriado.sucursalesAfectadas = snapshot.val().sucursalesAfectadas;
        });
      }
    },
    guardarFeriado() {
      if (typeof this.$route.params.id !== null) {
        var horaResult;
        var horaResultUtc;
        if (this.feriado.tipoFeriado === "parcial") {
          horaResult = moment
            .utc(this.feriado.horasUtc)
            .local()
            .format("HH:mm");
          horaResultUtc = this.feriado.horasUtc.toString();
        } else {
          horaResult = null;
          horaResultUtc = null;
        }

        this.feriado.fecha = moment(this.feriado.fechaUtc, "DD/MM/YYYY")
          .format("L")
          .toString();
        this.feriado.fechaUtc = this.feriado.fechaUtc.toString();

        feriadoRef
          .child(this.$route.params.id)
          .update(this.feriado)
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          });
      } else {
        var horaResult;
        var horaResultUtc;
        if (this.feriado.tipoFeriado === "parcial") {
          horaResult = moment
            .utc(this.feriado.horasUtc)
            .local()
            .format("HH:mm");
          horaResultUtc = this.feriado.horasUtc.toString();
        } else {
          horaResult = null;
          horaResultUtc = null;
        }

        this.feriado.fecha = moment(this.feriado.fechaUtc, "DD/MM/YYYY")
          .format("L")
          .toString();
        this.feriado.fechaUtc = this.feriado.fechaUtc.toString();
        feriadosRef.push(this.feriado).then(this.success(), this.cancelar());
        console.log(JSON.stringify(this.sucursalesAfectadas));
      }
    },
    cancelar() {
      this.$router.push({ name: "listadoAdelanto" });
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
  },
  watch: {
    $route: "obtenerFeriado"
  }
};
</script>

<style>

</style>


