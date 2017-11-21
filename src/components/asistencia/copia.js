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