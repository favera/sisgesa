<template>
    <div class="ui twelve wide column">
    
        <div class="ui form">
            <h4 class="ui dividing header">Listado de Sucursales</h4>
            <div class="two fields">
                <div class="field">
    
                    <div class="ui icon input">
                        <input type="text" placeholder="Search...">
                        <i class="inverted circular search link icon"></i>
                    </div>
    
                </div>
    
                <div class="field">
    
                    <div class="ui basic icon buttons">
    
                        <button class="ui button" @click="nuevaSucursal">
                            <i class="plus icon"></i>
                        </button>
    
                        <button class="ui button">
                            <i class="print icon"></i>
                        </button>
                    </div>
    
                </div>
            </div>
    
        </div>
    
        <div class="field">
    
            <table class="ui celled table">
                <thead>
                    <tr>
                        <th>Sucursal</th>
                        <th>Linea Baja</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>MDL-ZUNI</td>
                        <td>570618</td>
                        <td>
                            <i class="edit row icon"></i>
                            <i class="trash icon"></i>
                        </td>
                    </tr>
                    <tr>
                        <td>MDL-Box</td>
                        <td>570896</td>
                        <td>
                            <i class="edit row icon"></i>
                            <i class="trash icon"></i>
                        </td>
                    </tr>
    
                    <tr>
                        <td>MDL-Paris</td>
                        <td>570412</td>
                        <td>
                            <i class="edit row icon"></i>
                            <i class="trash icon"></i>
                        </td>
                    </tr>
    
                </tbody>
            </table>
    
        </div>
    
    </div>
</template>

<script>
export default {
    methods: {
        nuevaSucursal() {
            this.$router.push('/nuevaSucursal')
        }
    }
}
</script>

<style>
.ui.form .field>label {
    margin: 0em 0em 1em;
}
</style>
