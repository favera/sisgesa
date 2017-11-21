<template>
    <div class="ui twelve wide column">
        <div class="ui form">
            <div class="ui dividing header">Registrar Asistencia</div>
            <div class="five wide field">
                <label for="">Fecha:</label>
                <div class="ui action input">
                    <input type="text" value="01/08/2017">
                    <button class="ui teal right icon button">
                        <i class="calendar icon"></i>
                    </button>
                </div>
            </div>
            <div class="five wide field">
                <label>Numero AC</label>
                <input type="text">
            </div>
            <div class="two fields">
                <div class="six wide field">
                    <label for="">Nombre del Funcionario:</label>
                    <input type="text" placeholder="Digite el nombre para realizar la busqueda">
                </div>
                <div class="four wide field">
                    <label for="">Sucursal:</label>
                    <div class="ui disabled input">
                        <input type="text">
                    </div>
                </div>
            </div>

            <div class="fields">
                <div class="five wide field">
                    <label for="">Marcacion Entrada:</label>
                    <input type="text">
                </div>
                <div class="five wide field">
                    <label for="">Marcacion Salida</label>
                    <input type="text">
                </div>

            </div>

            <div class="ten wide  field">
                <label for="">Calcular pago por:</label>

                <div class="inline fields">
                    <div class="eight wide field">
                        <select v-model="selPay" class="ui fluid dropdown">
                            <option value="CH">Carga Horaria</option>
                            <option value="J">Jornal</option>
                        </select>

                    </div>

                    <div v-show="selPay==='J'" class=" four wide field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="salaryQuery" tabindex="0" class="hidden">
                            <label>Medio Jornal</label>
                        </div>
                    </div>

                    <div v-show="selPay==='J'" class="four wide field">
                        <div class="ui radio checkbox">
                            <input type="radio" name="salaryQuery" tabindex="0" class="hidden" checked="checked">
                            <label>Jornal Entero</label>
                        </div>
                    </div>

                    <div v-show="selPay==='CH'" class="eight wide field">
                        <input type="text">
                    </div>
                </div>

            </div>

            <div class="ten wide field">
                <label for="">Observacion:</label>
                <textarea name="" id="" rows="2"></textarea>
            </div>
            <div class="ui teal button">Guardar</div>
            <div class="ui button">Cancelar</div>
        </div>
    </div>
</template>
<script>
export default {

    data() {
        return {
            asistencia: {
                acnro: "",
                nombre: "",
                fecha: "",
                entrada: "",
                salida: ""
            },
            selPay: ""

        }
    }

}
</script>
<style>
.test-asis {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
</style>
