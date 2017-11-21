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
                    <select name="" id="" class="ui fluid dropdown">
                        <option value="">Guaranies - Gs.</option>
                        <option value="">Dolares - Us.</option>
                        <option value="">Reales - Rs.</option>
                    </select>
                </div>

            </div>
            <div class="ten wide field">
                <label for="">Sucursal:</label>
                <select v-model="empleado.sucursal" class="ui fluid dropdown">
                    <option disabled value="">Seleccionar Sucursal..</option>
                    <option value="zuni">MDL-ZUNI</option>
                    <option value="box">MDL-BOX</option>
                    <option value="paris">MDL-PARIS</option>
                    <option value="lion">MDL-LION</option>
                </select>
            </div>
            <div class="ui teal button" @click="guardarEmpleado()">Guardar</div>
            <div class="ui button" @click="cancelar">Cancelar</div>
        </div>
    </div>
</template>
<script>
import { VMoney } from "v-money";
import axios from "axios";
import { eventBus } from "./../../main";
export default {
  data() {
    return {
      empleado: {
        nombre: "",
        acnro: "",
        tipoCarga: "calculado",
        cargaLaboral: "",
        salario: "",
        moneda: "Gs",
        sucursal: ""
      },
      id: null,
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "",
        suffix: "",
        precision: 0,
        masked: false /* doesn't work with directive */
      }
    };
  },
  methods: {
    guardarEmpleado() {
      if (typeof this.$route.params.id !== "undefined") {
        this.id = this.$route.params.id;
        axios
          .put("http://localhost:3000/empleados/" + this.$route.params.id, {
            nombre: this.empleado.nombre,
            acnro: this.empleado.acnro,
            tipoCarga: this.empleado.tipoCarga,
            cargaLaboral: this.empleado.cargaLaboral,
            salario: this.empleado.salario,
            moneda: this.empleado.moneda,
            sucursal: this.empleado.sucursal
          })
          .then(this.success(), this.cancelar())
          .catch(error => console.log(error));
      } else {
        axios
          .post("http://localhost:3000/empleados", {
            nombre: this.empleado.nombre,
            acnro: this.empleado.acnro,
            tipoCarga: this.empleado.tipoCarga,
            cargaLaboral: this.empleado.cargaLaboral,
            salario: this.empleado.salario,
            moneda: this.empleado.moneda,
            sucursal: this.empleado.sucursal
          })
          .then(this.success(), this.cancelar())
          .catch(error => console.log(error));
      }
    },
    obtenerEmpleado() {
      if (typeof this.$route.params.id != "undefined") {
        axios
          .get("http://localhost:3000/empleados/" + this.$route.params.id)
          .then(response => {
            (this.empleado.nombre = response.data.nombre),
              (this.empleado.acnro = response.data.acnro);
          });
      }
    },
    returnList() {
      this.$router.push({ name: "listadoEmpleado" });
      eventBus.$emit("empleadoEdit", this.empleado, this.id);
    },
    cancelar() {
      this.$router.push("/empleados/listado");
    },
    success() {
      this.$notify({
        title: "Success",
        message: "This is a success message",
        type: "success"
      });
    }
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
