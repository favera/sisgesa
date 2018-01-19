<template>
    <div class="ui twelve wide column">
    
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Eventos en el Calendario</h4>
            <div class="two fields">
                <div class="twelve wide field">
                    

                    <div class="inline fields">
                      <div class="ten wide field">
                        <div class="ui icon input">
                          <input type="text" placeholder="Buscar Evento...">
                          <i class="inverted teal circular search link icon" ></i>
                        </div>
                      </div>

                      <div class="sixteen wide field">
                        <label>Listar por</label>
                         <div class="field">
                        <div class="ui radio checkbox">
                          <input type="radio" name="feriado" value="feriado" v-model="listado">
                          <label>Feriados</label>
                        </div>
                      </div>

                      <div class="field">
                        <div class="ui radio checkbox">
                          <input type="radio" name="vacaciones" value="vacaciones" v-model="listado">
                          <label>Vacaciones</label>
                        </div>
                      </div>
                      </div>

                      
                     
                       
                    </div>
                  </div>
    
                <div class="field">
                    <div class="ui right floated main menu">
                    <a class="icon item" @click="incluirEvento">
                      <i class="plus icon"></i>
                    </a>
                    <a class="icon item">
                      <i class="print icon"></i>
                    </a>
                  </div>
                   
    
                </div>
            </div>
    
        </div>
    
        <div class="field" v-if="listado==='feriado'">
            <table class="ui teal celled table">
                <thead>
                    <tr>
                        <th>Tipo de Evento</th>
                        <th>Fecha del Feriado</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="evento in eventos" :key="evento['.key']" v-show="evento.tipoEvento==='feriado'">
                       <td class="capital">{{evento.tipoEvento}}</td>
                        <td>{{evento.fechaFeriado}}</td>
                        <td>
                            <router-link :to="{name: 'editarEvento', params: { id: evento['.key']}}">
                                <i class="edit row icon"></i>
                            </router-link>
                            
                            <i class="trash icon" @click="confirm(evento['.key'])"></i>
                            
                        </td>
                    </tr>
                  
                </tbody>
            </table>
    
        </div>

        <div class="field" v-else-if="listado==='vacaciones'">
          <table class="ui teal celled table">
            <thead>
              <tr>
                <th>Tipo de Evento</th>
                <th>Funcionario</th>
                <th>Inicio de Vacaciones</th>
                <th>Fin de Vacaciones</th>
                <th>Opciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="evento in eventos" :key="evento['.key']"  v-show="evento.tipoEvento==='vacaciones'">
                <td class="capital">{{evento.tipoEvento}}</td>
                <td>{{evento.funcionario}}</td>
                <td>{{evento.fechaInicio}}</td>
                <td>{{evento.fechaFin}}-{{evento.funcionarioId}}</td>
                <td>
                            <router-link :to="{name: 'editarEvento', params: { id: evento['.key']}}">
                                <i class="edit row icon"></i>
                            </router-link>
                            
                            <i class="trash icon" @click="confirm(evento['.key'], evento.funcionarioId)"></i>
                            <i class="archive icon" @click="archivarVacaciones(evento['.key'], evento.funcionarioId)" ></i>
                        </td>
              </tr>
            </tbody>

            <tfoot>

            </tfoot>
          </table>
        </div>
    
    </div>
</template>

<script>
import axios from "axios";
import { db } from "./../.././config/firebase";
let calendarioRef = db.ref("/calendario");
let funcionariosRef = db.ref("/funcionarios");

export default {
  data() {
    return {
      eventos: [],
      listado: "feriado"
    };
  },
  methods: {
    incluirEvento() {
      this.$router.push({ name: "incluirEvento" });
    },
    archivarVacaciones(eventokey, funcionarioId) {
      console.log(eventokey, Object.keys(funcionarioId)[0]);
      var updates = {};

      updates[
        "/funcionarios" +
          Object.keys(funcionarioId)[0] +
          "/vacaciones" +
          eventokey
      ] = false;

<<<<<<< HEAD
      db.ref().update(updates);
    },
    confirm(id) {
=======
    confirm(id, funcionarioId) {
>>>>>>> 5b42aa32792ea91d708bbfe25f1ba2d35f7db043
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
          this.eliminarFeriado(id, funcionarioId);
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
    eliminarFeriado(id, funcionarioId) {
      console.log("id", id);
      console.log("funcionario", funcionarioId);

      console.log("valor listado", this.listado);
      console.log(this.listado === "feriado");

      if (this.listado === "feriado") {
<<<<<<< HEAD
        var index = this.feriados.findIndex(i => i.id === id);
        console.log("index", index);
        db
          .ref("/calendario/" + id)
          .remove()
          .then(this.feriados.splice(index, 1));
      } else if (this.listado === "vacaciones") {
=======
        // var index = this.eventos.findIndex(i => i.id === id);
        //console.log("index", index);
        db.ref("/calendario/" + id).remove();
        /*.then(this.feriados.splice(index, 1));*/
      }
      console.log(this.listado === "vacaciones");
      if (this.listado === "vacaciones") {
>>>>>>> 5b42aa32792ea91d708bbfe25f1ba2d35f7db043
        //delete from calendario and funcionarios, passing null to update will delete te item
        var updates = {};
        updates["/calendario/" + id] = null;
        updates[
          "/funcionarios/" + Object.keys(funcionarioId)[0] + "/vacaciones/" + id
        ] = null;
        console.log(updates);
<<<<<<< HEAD
        db
          .ref()
          .update(updates)
          .then(res => console.log("RESPONSE", res));
=======

        db
          .ref()
          .update(updates)
          .then(res => console.log(res));
>>>>>>> 5b42aa32792ea91d708bbfe25f1ba2d35f7db043
      }
    }
    /*separarListados() {
      this.calendario.forEach(element => {
        console.log("ejecuta metodo");
        if (element.tipoEvento === "feriado") {
          console.log("Entro pero no hace push");
          this.feriados.push(element);
        } else {
          console.log("aca no se que pasa");
          var calendarioFuncionariosRef = calendarioRef
            .child(element[".key"])
            .child("funcionarioId");
          var vacaciones = this.vacaciones;
          calendarioFuncionariosRef.on("child_added", function(snap) {
            funcionariosRef.child(snap.key).once("value", function(snapfunc) {
              console.log("SNAP PRINT", snap.val());
              console.log(snapfunc.val());
              element["funcionario"] = snapfunc.val().nombre;
              console.log("TESTANDO", JSON.stringify(element));
              vacaciones.push(element);
            });
          });
        }
      });
    }*/
  },
  created() {
    this.$bindAsArray("eventos", calendarioRef);
    //this.separarListados();
  },
  updated() {
    //this.separarListados();
  },

  mounted() {
    //this.separarListados();
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
#app > div.pusher > div > div > div.field > table > tbody > tr > td.capital {
  text-transform: capitalize;
}
</style>
