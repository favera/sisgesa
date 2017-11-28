import Asistencia from './components/asistencia/Asistencia.vue';
import AsistenciaList from './components/asistencia/AsistenciaList.vue'
import Empleado from './components/empleado/Empleado.vue';
import EmpleadoList from './components/empleado/EmpleadoList.vue';
import Feriado from './components/feriados/Feriado.vue';
import FeriadoList from './components/feriados/FeriadoList.vue'
import Sucursal from './components/sucursal/Sucursal.vue';
import SucursalList from './components/sucursal/SucursalList.vue';
import Salario from './components/salario/Salarios.vue';

import Home from './Home.vue'

export const routes = [
    { path: '', name: 'Home', component: Home },
    { path: '/asistencias', component: AsistenciaList, name: 'listadoAsistencia' },
    { path: '/incluir-Asistencia', component: Asistencia, name: 'incluirAsistencia' },
    { path: '/editar-Asistencia/:id', component: Asistencia, name: 'editarAsistencia' },
    { path: '/funcionarios', component: EmpleadoList, name: 'listadoEmpleado', props: true },
    { path: '/incluir-funcionario', component: Empleado, name: 'incluirEmpleado' },
    { path: '/editar-funcionario/:id', component: Empleado, name: 'editarEmpleado', props: true },
    // {
    //     path: '/empleados', component: Empleado,
    //     children: [
    //         {
    //             path: 'listado',
    //             component: ListadoEmpleado,
    //             name: 'listadoEmpleado'
    //         },
    //         {
    //             path: 'empleado/:id',
    //             component: NuevoEmpleado
    //         },
    //         {
    //             path: 'nuevoempleado',
    //             component: NuevoEmpleado
    //         }
    //     ]
    // },
    { path: '/sucursales', component: SucursalList, name: 'listadoSucursal' },
    { path: '/incluir-sucursal', component: Sucursal, name: 'incluirSucursal' },
    { path: '/editar-sucursal/:id', component: Sucursal, name: 'editarSucursal' },
    { path: '/salarios', component: Salario },
    { path: '/feriados', component: FeriadoList, name: 'listadoFeriado' },
    { path: '/incluir-feriado', component: Feriado, name: 'incluirFeriado' },
    { path: '/editar-feriado/:id', component: Feriado, name: 'editarFeriado' }
]