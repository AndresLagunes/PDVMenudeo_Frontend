
<template>
  <v-table fixed-header>
    <thead>
      <tr>
        <th v-for="header in headers" :key="header.value">
          {{ header.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in gridData" :key="i.producto.Producto" @click="selectItem(p, 'proveedor')">
        <td>{{ i.producto.Producto }}</td>
        <td>{{ i.producto.Desc_Larga }}</td>
        <td>{{ i.cantidad }}</td>
        <td>{{ i.producto.Precio1 }}</td>
        <td>{{ i.producto.Precio1 * i.cantidad }}</td>
      </tr>
    </tbody>
  </v-table>
  <button @click="showData">-O-</button>
</template>

<script setup>
import { ref, defineProps } from 'vue'

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

function showData() {
  console.log(props.gridData)
}

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

</style>