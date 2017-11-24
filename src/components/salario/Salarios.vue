<template>
    <div class="ui twelve wide column">

        <div class="ui form">
            <h4 class="ui dividing header">Listado de Salarios</h4>
            <div class="two fields">
                <div class="field">

                    <div class="inline fields">
                        <label for="salaryQuery">Consultar por:</label>

                        <div class="field">
                            <div class="ui radio checkbox">
                                <input type="radio" name="salaryQuery" tabindex="0" class="hidden" checked="checked">
                                <label>Rango de Fechas</label>
                            </div>
                        </div>

                    </div>
                    <div class="fields">
                        <div class=" six wide field">

                            <div class="ui action input">
                                <input type="text" value="01/08/2017">
                                <button class="ui teal right icon button">
                                    <i class="calendar icon"></i>
                                </button>
                            </div>

                        </div>

                        <div class=" six wide field">

                            <div class="ui action input">
                                <input type="text" value="31/08/2017">
                                <button class="ui teal right icon button">
                                    <i class="calendar icon"></i>
                                </button>
                            </div>

                        </div>

                    </div>

                </div>

                <div class="field">

                    <div class="test">

                        <div class="ui basic icon buttons">

                            <button @click="nuevaAsistencia" class="ui button">
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
                            <th>Horas Faltantes</th>
                            <th>Salario Base</th>
                            <th>Valor Hora Extra</th>
                            <th>Ingresos Domingo</th>
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
export default {};
</script>

<style>
.test {
  margin-top: 2em;
}
</style>
