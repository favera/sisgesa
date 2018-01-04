<template>
    <div class="ui twelve wide column">
    
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Feriados</h4>
            <div class="two fields">
                <div class="ten wide field">
    
                    <div class="ui icon input">
                        <input type="text" placeholder="Buscar Feriado...">
                        <i class="inverted teal circular search link icon" @click="listar"></i>
                    </div>
    
                </div>
    
                <div class="field">
                    <div class="ui right floated main menu">
                    <a class="icon item" @click="incluirFeriado">
                      <i class="plus icon"></i>
                    </a>
                    <a class="icon item">
                      <i class="print icon"></i>
                    </a>
                  </div>
                   
    
                </div>
            </div>
    
        </div>
    
        <div class="field">
    
            <table class="ui teal celled table">
                <thead>
                    <tr>
                        <th>Sucursales Afectadas</th>
                        <th>Fecha del Feriado</th>
                        <th>Tipo Feriado</th>
                        <th>Horas Asignadas</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="feriado in feriados">
                        <td> 
                            <div v-for="sucursal in feriado.sucursalesAfectadas" class="ui olive label">{{sucursal}}</div>
                        </td>
                        <td>{{feriado.fecha}}</td>
                        <td>{{feriado.tipoFeriado}}</td>
                        <td>{{feriado.horas}}</td>
                        <td>
                            <router-link :to="{name: 'editarFeriado', params: { id: feriado['.key']}}">
                                <i class="edit row icon"></i>
                            </router-link>
                            
                            <i class="trash icon" @click="confirm(feriado['.key'])"></i>
                        </td>
                    </tr>
                  
                </tbody>
            </table>
    
        </div>
    
    </div>
</template>

<script>
import axios from "axios";
import { url } from "./../.././config/backend";
import { db } from "./../.././config/firebase";

let sucursalRef = db.ref("/sucursales");
let feriadoRef = db.ref("/feriados");

export default {
  data() {
    return {
      feriados: [],
      sucursales: [],
      sucursalesNombre: []
    };
  },
  methods: {
    incluirFeriado() {
      this.$router.push({ name: "incluirFeriado" });
    },
    listar() {
      Array.from(this.feriados).forEach(item => {
        console.log(JSON.stringify(item[".key"]));
        var test = feriadoRef.child(item[".key"]).child("sucursalesAfectadas");
        console.log("Variable Test", test);
        var sucursalesNombre = [];
        test.on("child_added", snap => {
          sucursalRef.child(snap.key).once("value", sucursal => {
            console.log("Test" + JSON.stringify(sucursal.val()));

            sucursalesNombre.push(sucursal.val().nombre);
          });
          console.log("Feriadosooo", JSON.stringify(this.sucursalesNombre));
        });
        console.log("item a guardar", JSON.stringify(item));
        this.feriados.sucursalesNombre = sucursalesNombre;
      });
    },
    confirm(id) {
      this.$confirm(
        "El registro sera eliminado permanentemente. Desea Continuar?",
        "Atencion!",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancelar",
          type: "warning"
        }
      )
        .then(() => {
          this.eliminarFeriado(id);
          this.$message({
            type: "success",
            message: "Registro Eliminado"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Proceso Cancelado"
          });
        });
    },
    eliminarFeriado(id) {
      var index = this.sucursales.findIndex(i => i.id === id);
      db.ref("/feriados/" + id).remove();
    }
  },
  created() {
    this.$bindAsArray("sucursales", sucursalRef);
    this.$bindAsArray("feriados", feriadoRef);
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
