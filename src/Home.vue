<template>
<div class="ui twelve wide column">
        <div class="ui teal segment">
                <h3>Resumen del mes</h3>
  <div class="item">
          
    <div class="content">
      <table class="ui striped table">
  <thead>
    <tr>
      <th>Funcionario</th>
      <th>Horas Total del Mes</th>
      <th>Horas Total Trabajadas</th>
      <th>Total Horas Faltantes</th>
      <th>Total Horas Extras</th>
      <th>Total Dias Ausentes</th>
      <th>Total Dias Vacaciones</th>
    </tr>
  </thead>
  <tbody>
    <tr class="center aligned" v-for="item in informe" :key="item['.key']">
      <td>{{item.nombre}}</td>
      <td>{{item.totalMes}}</td>
      <td>{{item.totalTrabajado}}</td>
      <td><div class="ui orange label">{{item.totalFaltante}}</div></td>
      <td> {{item.totalExtras}}</td>
      <td>{{item.totalAusencias}}</td>
      <td>{{item.totalVacaciones}}</td>
     
    </tr>
    
  
   
  </tbody>
</table>
     
    </div>


</div></div>
</div>

    
</template>

<script>
import axios from "axios";
import moment from "moment";
import { db } from "././config/firebase";
let asistenciasRef = db.ref("/asistencias");
let funcionariosRef = db.ref("/funcionarios");
let calendarioRef = db.ref("/calendario");

export default {
  data() {
    return {
      marcaciones: [],
      funcionarios: [],
      informe: [],
      calendario: [],
      item: {
        nombre: null,
        totalMes: null,
        totalTrabajado: null,
        totalFaltante: null,
        totalExtras: null,
        totalAusencias: null,
        totalVacaciones: null
      }
    };
  },
  methods: {
    generarResumen() {
      var fecha = moment("05/11/2017");
      this.item.totalMes = this.getDiasMes(fecha) - this.getFeriados(fecha);

      for (let funcionario of this.funcionarios) {
        console.log("Funcionario", funcionario);
        var item = {};

        item.nombre = null;
        item.totalMes = null;
        item.totalTrabajado = null;
        item.totalFaltante = null;
        item.totalExtras = null;
        item.totalAusencias = null;
        item.totalVacaciones = null;

        this.marcaciones.map(marcacion => {
          console.log(
            "Comparacion " + funcionario[".key"] + "=" + marcacion.funcionarioId
          );
          if (funcionario[".key"] === marcacion.funcionarioId) {
            if (marcacion.estilo.ausente) {
              item.totalAusencias += 1;
            }

            if (marcacion.estilo.vacaciones) {
              item.totalVacaciones += 1;
            }

            if (marcacion.horasExtras) {
              item.totalExtras += moment
                .duration(marcacion.horasExtras, "HH:mm")
                .asMinutes();
            }

            if (marcacion.horasFaltantes) {
              item.totalFaltante += moment
                .duration(marcacion.horasFaltantes, "HH:mm")
                .asMinutes();
            }
            if (marcacion.horasTrabajadas) {
              item.totalTrabajado += moment
                .duration(marcacion.horasTrabajadas, "HH:mm")
                .asMinutes();
            }
          }
        });

        item.nombre = funcionario.nombre;

        this.informe.push(item);

        /* for (let marcacion of this.marcaciones) {
          console.log(
            "Comparacion",
            funcionario[".key"],
            marcacion.funcionarioId
          );
          if (funcionario[".key"] === marcacion.funcionarioId) {
            this.item.nombre = marcacion.nombreFuncionario;
            if (!marcacion.estilo.ausente) {
              this.item.totalTrabajado =
                moment
                  .duration(marcacion.horasTrabajadas, "HH:mm")
                  .asMinutes() + this.item.totalTrabajado;
              this.item.totalFaltante =
                moment.duration(marcacion.horasFaltantes, "HH:mm").asMinutes() +
                this.item.totalFaltante;

              this.item.totalExtras =
                moment.duration(marcacion.horasExtras, "HH:mm").asMinutes() +
                this.item.totalExtras;
            } else {
              this.item.totalAusencias = this.item.totalAusencias + 1;
            }
          }
        }
        this.informe.push(this.item);*/
      }
    },
    getDomingos(fecha) {
      moment(fecha).date(1);
      var dif = (7 + (0 - moment(fecha).weekday())) % 7 + 1;
      console.log("FirstOfMonth: " + moment(fecha).weekday() + ", dif: " + dif);
      return Math.floor((moment(fecha).daysInMonth() - dif) / 7) + 1;
    },
    getDiasMes(fecha) {
      var domingos = this.getDomingos(fecha);
      console.log("DOMINGOS" + domingos);
      console.log("Fecha" + fecha);
      console.log("Dias Mes" + moment(fecha).daysInMonth());
      return moment(fecha).daysInMonth() - domingos;
    },
    getFeriados(fecha) {
      var result = 0;
      this.calendario.forEach(evento => {
        if (evento.tipoEvento === "feriado") {
          result = result + 1;
        }
      });
      return result;
    }
  },
  created() {
    this.$bindAsArray("marcaciones", asistenciasRef);
    this.$bindAsArray("funcionarios", funcionariosRef);
    this.$bindAsArray("calendario", calendarioRef);
    this.generarResumen();
  }
};
</script>
