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
                            <button class="ui teal button" @click="calcularSalario(fechaInicio, fechaFin)">Generar Salario</button>
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
                            <th>Horas Trabajadas</th>
                            <th>Horas Extras</th>
                            <th>Salario Base</th>
                            <th>Hora Extra</th>
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
//const url = "https://mdl-sisgesa-back.herokuapp.com";
const url = "http://localhost:3000";
export default {
  data() {
    return {
      fechaInicio: "",
      fechaFin: "",
      feriados: [],
      marcaciones: [],
      empleados: [],
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
    calcularSalario(fechaInicio, fechaFin) {
      fechaInicio = moment(fechaInicio, "DD/MM/YYYY").format("L");
      fechaFin = moment(fechaFin, "DD/MM/YYYY").format("L");
      console.log("FECHAS" + fechaInicio, fechaFin);
      this.getData(fechaInicio, fechaFin);

      // this.empleados.forEach(element => {
      //   console.log("Empleado Id" + element.id);
      //   empleadosId.push(element.id);
      // });

      //console.log("Array resultado Empleado ID" + empleadosId);

      // Array.from(this.marcaciones).forEach(empleado => {
      //   var marcacionesEmpleados = this.marcaciones.find(
      //     index => index.empleadoId === empleado.empleadoId
      //   );
      //   console.log("RESULTADO" + JSON.stringify(marcacionesEmpleados));
      // });
    },

    async getData(fechaInicio, fechaFin) {
      try {
        const getMarcaciones = await axios.get(
          "http://localhost:3000/marcaciones?fecha_gte=" +
            fechaInicio +
            "&fecha_lte=" +
            fechaFin +
            "&_expand=empleado"
        );

        const getEmpleados = await axios.get(url + "/empleados");

        console.log("getMarcaciones" + getMarcaciones.data);

        const [marcaciones, empleados] = await Promise.all([
          getMarcaciones,
          getEmpleados
        ]);

        for (let item of empleados.data) {
          console.log("Entro HIHI" + item.id);
          this.empleados.push(item.id);
        }

        //this.empleados = empleados.data;
        this.marcaciones = marcaciones.data;

        console.log("Empleados" + JSON.stringify(this.empleados));
        console.log("Marcaciones" + JSON.stringify(this.marcaciones));

        var resultado = [];
        for (let id of this.empleados) {
          console.log("Entro en el for");
          var empleado = this.marcaciones.filter(elment => {
            if (element.empleadoId === id) {
              console.log("ENTRO en el filter");
              return element;
            }
          });

          resultado.push(empleado);
        }

        console.log(JSON.stringify("RESULTADO FINAL" + resultado));
      } catch (error) {}
    }
  },

  mounted() {
    // axios.get(url + "/feriados").then(response => {
    //   var feriados = response.data;
    //   console.log(feriados);
    //   this.feriados = response.data;
    // });
    // axios.get(url + "/marcaciones?_expand=empleado").then(response => {
    //   var marcaciones = response.data;
    //   console.log(marcaciones);
    //   this.marcaciones = response.data;
    // });
    // axios.get(url + "/sucursals").then(response => {
    //   var sucursals = response.data;
    //   console.log(sucursals);
    //   this.sucursales = response.data;
    // });
  }
};
</script>

<style>
.test {
  margin-top: 2em;
}
</style>
