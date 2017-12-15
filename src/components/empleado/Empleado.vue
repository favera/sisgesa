<template>
    <div class="ui twelve wide column">

        <div class="ui form">
            <div class="ui dividing header">Registrar empleado</div>

            <div class="ten wide field">
                <label for="">Nombre del empleado:</label>
                <input type="text" v-model="empleado.nombre">
            </div>

            <div class="ten wide field">
                <label for="">AC - No (Numero Identificador):</label>
                <input type="text" v-model="empleado.acnro">
            </div>
            <div class="ten wide field">
                <div class="field">
                    <label>Tipo de carga laboral</label>
                </div>

                <div class="inline fields">
                    <div class="eight wide field">
                        <div class="ui radio checkbox">
                            <input type="radio" value="calculado" v-model="empleado.tipoCarga">
                            <label>Calculado</label>
                        </div>

                        <div class="ui radio checkbox">
                            <input type="radio" value="manual" v-model="empleado.tipoCarga">
                            <label>Manual</label>
                        </div>
                    </div>

                    <div class="eight wide field" v-show="empleado.tipoCarga==='calculado'">
                        <el-time-select v-model="empleado.cargaLaboral" :picker-options="{
                                                                                                                                                                                                                                                            start: '08:30',
                                                                                                                                                                                                                                                            step: '00:30',
                                                                                                                                                                                                                                                            end: '10:30'
                                                                                                                                                                                                                                                        }" placeholder="Selecccionar Horario">
                        </el-time-select>
                    </div>
                </div>
            </div>

            <div class="two fields">
                <div class="five wide field">
                    <label for="">Salario Base:</label>
                    <input v-model.lazy="empleado.salario" v-money="money">
                </div>
                <div class="five wide field">
                    <label for="">Moneda</label>
                    <select v-model="empleado.moneda" class="ui fluid dropdown" >
                        <option disbled value="">Seleccionar Moneda..</option>
                        <option value="Gs">Guaranies - Gs.</option>
                        <option value="Us">Dolares - Us.</option>
                        <option value="Rs">Reales - Rs.</option>
                    </select>
                </div>

            </div>
           
            <div class="ten wide field">
                <label for="">Sucursal:</label>
                <select v-model="empleado.sucursalId">
                    <option disabled value="">Seleccionar Sucursal..</option>
                    <option v-for="sucursal in sucursales"  v-bind:value="sucursal.id" :key="sucursal.id" :selected="sucursal.id === empleado.sucursalId ? true : false" >{{sucursal.nombre}}</option>
                </select>
            </div>
            <div class="ui teal button" @click="guardarEmpleado">Guardar</div>
            <div class="ui button" @click="cancelar">Cancelar</div>
        </div>
    </div>
</template>
<script>
import { VMoney } from "v-money";
import axios from "axios";
import { eventBus } from "./../../main";
import { url } from "./../.././config/backend";

export default {
  data() {
    return {
      empleado: {
        nombre: "",
        acnro: "",
        tipoCarga: "calculado",
        cargaLaboral: "",
        salario: "",
        moneda: "",
        sucursalId: ""
      },
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false /* doesn't work with directive */
      },
      sucursales: []
    };
  },
  methods: {
    calcularSalarioMinuto(valor) {
      var checkValor = valor.split(".").join("");
      checkValor = parseInt(checkValor, 10);
      return checkValor / 30 / 8 / 60;
    },
    guardarEmpleado() {
      if (typeof this.$route.params.id !== "undefined") {
        axios
          .put(url + "/empleados/" + this.$route.params.id, {
            nombre: this.empleado.nombre,
            acnro: this.empleado.acnro,
            tipoCarga: this.empleado.tipoCarga,
            cargaLaboral: this.empleado.cargaLaboral,
            salario: this.empleado.salario,
            salarioMinuto: this.calcularSalarioMinuto(this.empleado.salario),
            moneda: this.empleado.moneda,
            sucursalId: this.empleado.sucursalId
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          })
          .catch(error => console.log(error));
      } else {
        axios
          .post(url + "/empleados", {
            nombre: this.empleado.nombre,
            acnro: this.empleado.acnro,
            tipoCarga: this.empleado.tipoCarga,
            cargaLaboral: this.empleado.cargaLaboral,
            salario: this.empleado.salario,
            salarioMinuto: this.calcularSalarioMinuto(this.empleado.salario),
            moneda: this.empleado.moneda,
            sucursalId: this.empleado.sucursalId
          })
          .then(response => {
            this.success();
            this.cancelar();
            console.log(response);
          })
          .catch(error => console.log(error));
      }
    },
    obtenerEmpleado() {
      if (typeof this.$route.params.id != "undefined") {
        axios
          .get(url + "/empleados/" + this.$route.params.id)
          .then(response => {
            this.empleado.nombre = response.data.nombre;
            this.empleado.acnro = response.data.acnro;
            this.empleado.cargaLaboral = response.data.cargaLaboral;
            this.empleado.salario = response.data.salario;
            this.empleado.moneda = response.data.moneda;
            this.empleado.sucursalId = response.data.sucursalId;
          });
      }
    },
    returnList() {
      this.$router.push({ name: "listadoEmpleado" });
    },
    cancelar() {
      this.$router.push({ name: "listadoEmpleado" });
    },
    success() {
      this.$notify({
        title: "Success",
        message: "This is a success message",
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
    $(this.$refs.sucursalcombo).dropdown({});
    axios.get(url + "/sucursals").then(response => {
      this.sucursales = response.data;
    });
  },
  created() {
    this.obtenerEmpleado();
  },
  watch: {
    $route: "obtenerEmpleado"
  },
  directives: { money: VMoney }
};
</script>
<style>

</style>
