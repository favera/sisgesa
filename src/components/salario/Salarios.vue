<template>
    <div class="ui twelve wide column">

        <div class="ui form">
            <h4 class="ui dividing header">Listado de Salarios</h4>
            <div class="two fields">
                <div class="field">
                    <label for="salaryQuery">Introducir rango de fechas:</label>
                    <div class="inline fields">
                        
                         <div class="field">
                            <el-date-picker v-model="fechaInicio" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy">
                            </el-date-picker>
                        </div>

                        <div class="field">
                            <el-date-picker v-model="fechaFin" type="date" placeholder="Seleccionar fecha" format="dd/MM/yyyy" >
                            </el-date-picker>
                        </div>

                        <div class="field">
                            <button class="ui teal button">Generar Salario</button>
                        </div>
                       

                    </div>
                    

                </div>

                <div class="field">

                    <div class="test">

                        <div class="ui basic icon buttons">

                            <button class="ui button">
                                <i class="plus icon"></i>
                            </button>
                            <button class="ui button">
                                <i class="upload icon"></i>
                            </button>
                            <button class="ui button">
                                <i class="print icon"></i>
                            </button>
                        </div>

                    </div>

                </div>

            </div>

            <div class="field">

                <table class="ui teal celled table">
                    <thead>
                        <tr>
                            <th>Funcionario</th>
                            <th>Carga Laboral del Mes</th>
                            <th>Horas Trabajas</th>
                            <th>Horas Extras</th>
                            <th>Salario Base</th>
                            <th>Valor Hora Extra</th>
                            <th>Descuentos</th>
                            <th>Salario Neto</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>

                            <!-- <td>
                                    <i class="edit row icon"></i>
                                    <i class="trash icon"></i>
                                </td> -->
                        </tr>

                    </tbody>
                </table>

            </div>

        </div>

    </div>
</template>
<script>
import moment from "moment";
import axios from "axios";
const url = "https://mdl-sisgesa-back.herokuapp.com";
export default {
  data() {
    return {
      fechaInicio: "",
      fechaFin: "",
      feriados: [],
      marcaciones: [],
      sucursales: [],
      feriadoSucursal: [],
      salario: {
        nombreFuncionario: null,
        funcionarioId: null,
        cargaLaboralMes: null,
        horasTrabajadas: null,
        horasExtras: null,
        salarioBase: null,
        valorHoraExtra: null,
        total: null
      }
    };
  },
  methods: {
    getDomingos(fecha) {
      moment(fecha).date(1);
      var dif = (7 + (0 - moment(fecha).weekday())) % 7 + 1;
      console.log(
        "weekday: " +
          weekday +
          ", FirstOfMonth: " +
          moment(fecha).weekday() +
          ", dif: " +
          dif
      );
      return Math.floor((moment(fecha).daysInMonth() - dif) / 7) + 1;
    },
    getDiasMes(fecha) {
      var domingos = this.getDomingos(fecha);
      return moment(fecha).daysInMonth() - domingos;
    },
    //Hacer un arrayfilter funcionario donde sera un array de los datos de un solo funcionario
    //del array resultante sumar horas trabajadas, sumar horas extras, calcular descuento u hora extra
    //calcular horas mes segun idsucursal
    calcularSalario(fecha) {},
    getFeriados() {
      var modelo = {
        sucursalNombre: null,
        horas: null,
        tipo: null
      };

      var newFeriado = [];

      Array.from(this.feriados).forEach(feriado => {});

      function retornarId(sucursalAfectada) {
        Array.from(this.sucursales).forEach(sucursal => {
          if (sucursal.nombre === sucursalAfectada) {
            return sucursal.id;
          }
        });
      }

      Array.from(this.feriados).forEach(feriado => {
        var idSucursales = feriado.sucursalesAfectadas.filter(retornarId);

        if (feriado.tipoFeriado === "completo") {
          for (let i of idSucursales) {
            //if()
          }
        }
      });
    }
  },
  mounted() {
    axios.get(url + "/feriados").then(response => {
      var feriados = response.data;
      console.log(feriados);
      this.feriados = response.data;
    });
    axios.get(url + "/marcaciones?_expand=empleado").then(response => {
      var marcaciones = response.data;
      console.log(marcaciones);
      this.marcaciones = response.data;
    });
    axios.get(url + "/sucursals").then(response => {
      var sucursals = response.data;
      console.log(sucursals);
      this.sucursales = response.data;
    });
  }
};
</script>

<style>
.test {
  margin-top: 2em;
}
</style>
