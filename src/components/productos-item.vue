
<template>
  <v-table fixed-header class="tablaCustom">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header.value">
          {{ header.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in gridData" :key="i.producto.Producto">
        <td>{{ i.producto.Producto }}</td>
        <td>{{ i.producto.Desc_Larga }}</td>
        <td>{{ i.cantidad }}</td>
        <td>{{ i.producto.Precio1 }}</td>
        <td>{{ (i.producto.Precio1 * i.cantidad).toFixed(2).toString() }}</td>
      </tr>
    </tbody>
  </v-table>
  <!-- <button @click="showData">-O-</button> -->
</template>

<script setup>
import { ref, defineProps } from 'vue'

// eslint-disable-next-line no-unused-vars
const props = defineProps({
  gridData: {
    type: Array,
    default: () => []
  },
});

const headers = ref([
  { text: 'Producto', value: 'Producto', asc: true },
  { text: 'Descripción', value: 'Desc_Larga', asc: true },
  { text: 'Cantidad', value: 'Cantidad', asc: true },
  { text: 'Precio', value: 'Precio', asc: true },
  { text: 'Importe', value: 'Importe', asc: true },
]);

// function showData() {
//   console.log(props.gridData)
// }

// const sortKey = ref('')
// const sortOrders = ref(
//   props.columns.reduce((o, key) => ((o[key] = 1), o), {})
// )
// function sortBy(key) {
//   sortKey.value = key
//   sortOrders.value[key] *= -1
// }

// function capitalize(str) {
//   return str.charAt(0).toUpperCase() + str.slice(1)
// }
</script>

<style>
.tablaCustom th {
  padding: 1px 3px 1px 3px !important;
  border: 1px solid rgba(0, 0, 0, 0.25);
  font-weight: 900 !important;
  font-size: 13px;
  height: 20px !important;
  background-color: rgba(216, 209, 201, 0.733) !important;
  color: rgba(0, 0, 0, 0.733) !important;
}
.tablaCustom td {
  font-size: 13px;
  height: 20px !important;
  border: 1px solid rgba(0, 0, 0, 0.25);

}
#productos {  
  background-color: rgba(221,221,221, 1);
  border-color: rgba(0, 0, 0, 0.301);
  border-style: inset;
}
</style>