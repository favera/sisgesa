import Asistencia from './components/asistencia/Asistencia.vue';
import NuevaAsistencia from './components/asistencia/NuevaAsistencia.vue'
import Empleado from './components/empleado/Empleados.vue';
import ListadoEmpleado from './components/empleado/ListadoEmpleado.vue';
import NuevoEmpleado from './components/empleado/NuevoEmpleado.vue'
import Sucursal from './components/sucursal/Sucursales.vue';
import NuevaSucursal from './components/sucursal/NuevaSucursal.vue';
import Salario from './components/salario/Salarios.vue';
import Feriado from './components/feriados/Feriado.vue';
import FeriadoList from './components/feriados/FeriadoList.vue'
import Home from './Home.vue'

export const routes = [
    { path: '', name: 'Home', component: Home },
    { path: '/asistencia', component: Asistencia },
    { path: '/nuevaAsistencia', component: NuevaAsistencia },
    {
        path: '/empleados', component: Empleado,
        children: [
            {
                path: 'listado',
                component: ListadoEmpleado,
                name: 'listadoEmpleado'
            },
            {
                path: 'empleado/:id',
                component: NuevoEmpleado
            },
            {
                path: 'nuevoempleado',
                component: NuevoEmpleado
            }
        ]
    },
    // { path: '/nuevoempleado', component: Nuevoempleado },
    { path: '/sucursales', component: Sucursal },
    { path: '/nuevaSucursal', component: NuevaSucursal },
    { path: '/salarios', component: Salario },
    { path: '/feriados', component: FeriadoList, name: 'listadoFeriado' },
    { path: '/incluir-feriado', component: Feriado, name: 'incluirFeriado' },
    { path: '/editar-feriado/:id', component: Feriado, name: 'editarFeriado' }
]