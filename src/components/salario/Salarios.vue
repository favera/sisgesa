<template>
    <div class="ui twelve wide column">

        <div class="ui form">
            <h4 class="ui dividing header">Listado de Salarios</h4>
            <div class="two fields">
                <div class="ui twelve wide field">
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
                          <div class="ui vertical teal button"  @click="calcularSalario(fechaInicio, fechaFin)">
                            Generar Salario
                          </div>
                        </div>
                        <div class="field">
                            <button class="ui button" @click="limpiarCampos()">Limpiar</button>
                          
                        </div>
                       

                    </div>
                    

                </div>

                <div class="ui four wide field">

                  <div class="ui right floated main menu">
                    <a class="icon item">
                      <download-excel
	                            :data   = "json_data"
	                            :fields = "json_fields"
	                            :meta   = "json_meta"
	                            name    = "salario.xls">

                            <i class="print icon"></i>


                            </download-excel>
                    </a>
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
                    <!-- <div class="ui segment">
  <p></p>
  <div class="ui active dimmer">
    <div class="ui loader"></div>
  </div>
</div> -->
                    <tbody>
      
                        <tr v-for="resultado in marcacionesEmpleado" :key="resultado.nombre">
                            <td>{{resultado.nombre}}</td>
                            <td>{{resultado.hmformat }}</td>
                            <td>{{resultado.htformat}}</td>
                            <td>{{resultado.heformat}}</td>
                            <td>{{resultado.salarioBase}} {{resultado.moneda}}</td>
                            <td>{{resultado.valorHoraExtraAlternativa}} {{resultado.moneda}}</td>
                            <td>{{resultado.salarioNetoAlternativo}} {{resultado.moneda}}</td>

                            <!-- <td>
                                    <i class="edit row icon"></i>
                                    <i class="trash icon"></i>
                                </td> -->
                        </tr>

                    </tbody>
                </table>
 <div v-show="loading" class="ui segment large">
  <div class="ui active inverted dimmer">
    <div class="ui large text loader">Loading</div>
  </div>
 
</div>

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
      marcacionesEmpleado: [],
      loading: false,
      sucursales: [],
      feriadoSucursal: [],
      json_fields: {
        nombre: "Funcionario",
        hmformat:
          "Carga Laboral " + moment(this.fechaInicio, "month").format("MMMM"),
        horasMes: "Carga laboral en minutos",
        htformat: "Horas Trabajadas",
        horasTrabajadas: "Horas Trabajadas en minutos",
        horasExtraAlternativa: "Horas Extras",
        heformat: "Horas Extras en minutos",
        salarioBase: "Salario base",
        moneda: "Moneda",
        valorHoraExtraAlternativa: "Valor Hora extra",
        salarioNetoAlternativo: "Salario Neto"
      },
      json_data: [],
      json_meta: [
        [
          {
            key: "charset",
            value: "utf-8"
          }
        ]
      ]
    };
  },
  methods: {
    limpiarCampos() {
      this.fechaInicio = null;
      this.fechaFin = null;
      marcacionesEmpleado.length = 0;
    },
    getDomingos(fecha) {
      moment(fecha).date(1);
      var dif = (7 + (0 - moment(fecha).weekday())) % 7 + 1;
      console.log("FirstOfMonth: " + moment(fecha).weekday() + ", dif: " + dif);
      return Math.floor((moment(fecha).daysInMonth() - dif) / 7) + 1;
    },
    getDiasMes(fecha) {
      var domingos = this.getDomingos(fecha);
      return moment(fecha).daysInMonth() - domingos;
    },
    //Hacer un arrayfilter funcionario donde sera un array de los datos de un solo funcionario
    //del array resultante sumar horas trabajadas, sumar horas extras, calcular descuento u hora extra
    //calcular horas mes segun idsucursal
    calcularSalario(fechaInicio, fechaFin, horasMes) {
      horasMes = this.getDiasMes(fechaInicio);
      fechaInicio = moment(fechaInicio, "DD/MM/YYYY").format("L");
      fechaFin = moment(fechaFin, "DD/MM/YYYY").format("L");
      console.log("FECHAS" + fechaInicio, fechaFin);
      console.log("DIAS " + horasMes);
      this.getData(fechaInicio, fechaFin, horasMes);

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

    async getData(fechaInicio, fechaFin, horasMes) {
      this.loading = true;
      try {
        const getMarcaciones = await axios.get(
          url +
            "/marcaciones?fecha_gte=" +
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

        //console.log("Empleados" + JSON.stringify(this.empleados));
        //console.log("Marcaciones" + JSON.stringify(this.marcaciones));
      } catch (error) {}

      var resultado = [];
      for (let id of this.empleados) {
        console.log("Entro en el for");
        var empleado = this.marcaciones.filter(function(element) {
          if (element.empleadoId === id) {
            console.log("ENTRO en el filter " + element);
            return element;
          }
        });

        resultado.push(empleado);
      }

      console.log("ARRAY RESULTADO" + JSON.stringify(resultado));

      if (resultado.length > 0) {
        for (var i = 0; i < resultado.length; i++) {
          var value = resultado[i];

          console.log("Value" + JSON.stringify(resultado[i]));

          var marcacionEmpleado = {
            nombre: null,
            horasMes: null,
            hmformat: null,
            horasTrabajadas: null,
            htformat: null,
            horasExtras: null,
            heformat: null,
            horasExtraAlternativa: null,
            salarioBase: null,
            moneda: null,
            valorHoraExtra: null,
            salarioNeto: null,
            salarioNetoAlternativo: null,
            valorHoraExtraAlternativa: null
          };
          if (value.length > 0) {
            for (let element of value) {
              marcacionEmpleado.horasTrabajadas =
                marcacionEmpleado.horasTrabajadas +
                moment.duration(element.horasTrabajadas, "HH:mm").asMinutes();
              marcacionEmpleado.horasExtras =
                marcacionEmpleado.horasExtras +
                moment.duration(element.horasExtras, "HH:mm").asMinutes();
            }
            //copiar hanlde para minutos para mostrar en el informe,
            //caclcular total laboral mes
            marcacionEmpleado.nombre = value[0].empleado.nombre;
            console.log("Nombre:" + marcacionEmpleado.nombre);
            marcacionEmpleado.salarioBase = value[0].empleado.salario;
            marcacionEmpleado.moneda = value[0].empleado.moneda;
            marcacionEmpleado.horasMes = horasMes * 570;
            marcacionEmpleado.horasExtraAlternativa =
              marcacionEmpleado.horasTrabajadas - marcacionEmpleado.horasMes;
            console.log(
              "HORA EXTRA ALTERNATIVA" + marcacionEmpleado.horasExtraAlternativa
            );
            marcacionEmpleado.valorHoraExtraAlternativa =
              marcacionEmpleado.horasExtraAlternativa *
              value[0].empleado.salarioMinuto;

            if (marcacionEmpleado.valorHoraExtraAlternativa < 0) {
              marcacionEmpleado.valorHoraExtraAlternativa =
                marcacionEmpleado.valorHoraExtraAlternativa * 2;
            }

            marcacionEmpleado.salarioNetoAlternativo = Math.floor(
              parseInt(marcacionEmpleado.salarioBase.split(".").join("")) +
                marcacionEmpleado.valorHoraExtraAlternativa
            ).toLocaleString();

            var minutos = Math.floor(
              (moment
                .duration(marcacionEmpleado.horasExtraAlternativa, "minutes")
                .asHours() %
                1) *
                60
            );

            var horas =
              moment
                .duration(marcacionEmpleado.horasExtraAlternativa, "minutes")
                .asHours() -
              moment
                .duration(marcacionEmpleado.horasExtraAlternativa, "minutes")
                .asHours() %
                1;

            if (minutos > 0 && horas > 0) {
              marcacionEmpleado.heformat =
                horas + " Horas " + minutos + " Minutos";
            } else {
              if (minutos < 0 && horas < 0) {
                minutos = minutos * -1;
                marcacionEmpleado.heformat =
                  horas + " Horas " + minutos + " Minutos";
              } else {
                if (horas !== 0 && minutos === 0) {
                  marcacionEmpleado.heformat = horas + " Horas";
                } else {
                  marcacionEmpleado.heformat = minutos + " Minutos";
                }
              }
            }

            marcacionEmpleado.valorHoraExtraAlternativa = Math.floor(
              marcacionEmpleado.valorHoraExtraAlternativa
            ).toLocaleString();

            //##############################

            marcacionEmpleado.valorHoraExtra =
              marcacionEmpleado.horasExtras * value[0].empleado.salarioMinuto;

            marcacionEmpleado.salarioNeto = Math.floor(
              parseInt(marcacionEmpleado.salarioBase.split(".").join("")) +
                marcacionEmpleado.valorHoraExtra
            ).toLocaleString();

            if (marcacionEmpleado.valorHoraExtra < 0) {
              marcacionEmpleado.valorHoraExtra =
                marcacionEmpleado.valorHoraExtra * 2;
            }

            marcacionEmpleado.valorHoraExtra = Math.floor(
              marcacionEmpleado.valorHoraExtra
            ).toLocaleString();

            /* var minutos = Math.floor(
              (moment
                .duration(marcacionEmpleado.horasExtras, "minutes")
                .asHours() %
                1) *
                60
            );

            var horas =
              moment
                .duration(marcacionEmpleado.horasExtras, "minutes")
                .asHours() -
              moment
                .duration(marcacionEmpleado.horasExtras, "minutes")
                .asHours() %
                1;

            if (minutos > 0 && horas > 0) {
              marcacionEmpleado.heformat =
                horas + " Horas " + minutos + " Minutos";
            } else {
              if (minutos < 0 && horas < 0) {
                minutos = minutos * -1;
                marcacionEmpleado.heformat =
                  horas + " Horas " + minutos + " Minutos";
              } else {
                if (horas !== 0 && minutos === 0) {
                  marcacionEmpleado.heformat = horas + " Horas";
                } else {
                  marcacionEmpleado.heformat = minutos + " Minutos";
                }
              }
            }*/

            var minuto = Math.ceil(
              (moment
                .duration(marcacionEmpleado.horasTrabajadas, "minutes")
                .asHours() %
                1) *
                60
            );

            var hora =
              moment
                .duration(marcacionEmpleado.horasTrabajadas, "minutes")
                .asHours() -
              moment
                .duration(marcacionEmpleado.horasTrabajadas, "minutes")
                .asHours() %
                1;

            marcacionEmpleado.htformat = hora + " Horas " + minuto + " minutos";

            var minuto1 = Math.floor(
              (moment
                .duration(marcacionEmpleado.horasMes, "minutes")
                .asHours() %
                1) *
                60
            );

            var hora1 =
              moment.duration(marcacionEmpleado.horasMes, "minutes").asHours() -
              moment.duration(marcacionEmpleado.horasMes, "minutes").asHours() %
                1;

            if (minuto1 > 0) {
              marcacionEmpleado.hmformat =
                hora1 + " Horas " + minuto1 + " Minutos ";
            } else {
              marcacionEmpleado.hmformat = hora1 + " Horas ";
            }

            console.log(
              "RESULTADO POR EMPLEADO" + JSON.stringify(marcacionEmpleado)
            );
            this.marcacionesEmpleado.push(marcacionEmpleado);
            this.json_data.push(marcacionEmpleado);
          }
        }
        this.loading = false;
      }

      console.log(
        JSON.stringify("RESULTADO FINAL" + JSON.stringify(marcacionEmpleado))
      );
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
.ui.segment.large {
  height: 400px;
}
</style>
