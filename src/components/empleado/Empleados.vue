<template>
    <div class="ui twelve wide column">

        <router-view></router-view>

    </div>
</template>

<script>
import axios from "axios";
export default {
  updated() {
    axios
      .get("http://localhost:3000/empleados/listado")
      .then(response(console.log(response)));
  }
};
</script>

<style>
.ui.form .field > label {
  margin: 0em 0em 1em;
}
</style>
