handleSelectedFile(convertedData) {
    this.preDatos = convertedData.body;
    let keys = [];
    this.preDatos.map((value) => keys.push(value["AC-No."]));
    let uniqueKey = new Set(keys);
    Array.from(uniqueKey).map((value) => {
        // console.log()
        this.orderData(value)
    });
},
if (acnro === arr["AC-No."]) {
    modelo.empleadoId = empleadoid;
    modelo.nombre = nombre;
    modelo.date = arr.Horario;
    modelo.fecha = moment(arr.Horario, "DD/MM/YYYY").format("L");

    if ("M/Ent" === arr.Estado) {
        modelo.entrada = moment(arr.Horario, "DD/MM/YY hh:mm a").format(
            "LT"
        );
        modelo.horasTrabajadas = moment
            .duration(modelo.entrada, "HH:mm")
            .asMinutes();
    } else if ("M/Sal" === arr.Estado) {
        modelo.salida = moment(arr.Horario, "DD/MM/YY hh:mm a").format(
            "LT"
        );
        modelo.horasTrabajadas =
            (modelo.horasTrabajadas -
                moment.duration(modelo.salida, "HH:mm").asMinutes()) *
            -1;
        console.log("Horas trabajadas total " + modelo.horasTrabajadas);
        modelo.horasExtras =
            (modelo.horasExtras - modelo.horasTrabajadas) * -1;
        console.log("Hora extra final " + modelo.horasExtras);
    }
}

horasTrabajadas: moment
    .utc(marcacion.horasTrabajadas * 1000 * 60)
    .format("HH:mm"),
    horasExtras: this.handleNegative(marcacion.horasExtras),
        orderData(ac) {
    var hora1 = "";
    var id = 0;
    for (let arr of this.preDatos) {
        var modelo = {
            id: 0,
            acnro: "",
            nombre: "",
            date: "",
            fecha: "",
            entrada: "",
            salida: "",

        };

        if (ac === arr["AC-No."]) {

            modelo.acnro = arr["AC-No."];
            modelo.nombre = arr.Nombre;
            modelo.date = arr.Horario;
            modelo.fecha = moment(arr.Horario, "DD/MM/YYYY").format('L');



            modelo.salida = moment(arr.Horario, "DD/MM/YY hh:mm a").format('LT');
            var hora = moment(arr.Horario, "DD/MM/YY hh:mm a").toObject();

            if (hora.hours < 9) {
                hora1 = moment(arr.Horario, "DD/MM/YY hh:mm a").format('LT');
            } else if (hora.hours < 18 && hora.hours > 14) {
                console.log(id = +id);
                modelo.id = id;
                modelo.entrada = hora1;
                modelo.salida = moment(arr.Horario, "DD/MM/YY hh:mm a").format('LT');
                this.datosMarcaciones.push(modelo);

            }


        }
    }