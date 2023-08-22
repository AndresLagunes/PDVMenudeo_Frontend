
<template>
  <table class="tablaCustom" ref="tableRef">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header.value" :class="header.class">
          {{ header.text }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(i, index) in gridData" :key="i.producto.Producto" :id="'d'+index">
        <td class="producto">{{ i.producto.Producto }}</td>
        <td class="descripcion">{{ i.producto.Desc_Larga }}</td>
        <td class="cantidad">{{ i.cantidad }}</td>
        <td class="precio">{{ i.producto.Precio1 }}</td>
        <td class="importe">{{ (i.producto.Precio1 * i.cantidad).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</td>
      </tr>
    </tbody>
  </table>
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
const tableRef = ref(null);

// eslint-disable-next-line no-unused-vars
function actualizarVista () {
  console.log('xd')
  const table = tableRef.value;
  console.log();
  // Access the specific row's DOM element
  const row = table.querySelectorAll('tbody tr')[table.querySelectorAll('tbody tr').length -1];
            
  // // Scroll to the row's offset position
  table.parentElement.scrollTop = row.offsetTop;
}

const headers = ref([
  { text: 'Producto', value: 'Producto', asc: true, class: 'producto' },
  { text: 'Descripción', value: 'Desc_Larga', asc: true, class: 'descripcion' },
  { text: 'Cantidad', value: 'Cantidad', asc: true, class: 'cantidad' },
  { text: 'Precio', value: 'Precio', asc: true, class: 'precio' },
  { text: 'Importe', value: 'Importe', asc: true, class: 'importe' },
]);
defineExpose({actualizarVista});
</script>

<style>
.tablaCustom {
  border-collapse: collapse;
  overflow-y: auto;
}
.tablaCustom th {
  top: 0;
  position: sticky;
  border-right: 1px solid rgba(0, 0, 0, 0.25);
  font-weight: 900 !important;
  font-size: 13px;
  /* height: 20px !important; */
  background-color: rgba(232,220,212) !important;
  color: rgba(0, 0, 0, 0.733) !important;
}
.tablaCustom th:last-child{
  border-right: none;
}
.tablaCustom td {
  font-size: 13px;
  height: 20px !important;
  border: 1px solid rgba(0, 0, 0, 0.25);
  /* background-color: rgb(255, 255, 255) !important; */
  border-right: 1px solid rgba(0, 0, 0, 0.25);
  padding: 1px 5px 1px 5px;
}
.tablaCustom td:last-child {
  border-right: none;
}
.tablaCustom tr:nth-child(even) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  background-color: rgba(235,235,235,1) !important;
}
.tablaCustom tr:nth-child(odd) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.5);
  background-color: white !important;
}
#productos {  
  background-color: rgba(221,221,221, 1);
  border-color: rgba(0, 0, 0, 0.301);
  border-style: inset;
}

/* clases de los headers */
.producto {
  width: 7vw;
  min-width: 70px;
  /* max-width: 80px; */
  /* max-width: 100px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
}
.descripcion {
  width: 63vw;
}
.cantidad {
  text-align: center;
  width: 10vw;
} 
.precio {
  text-align: center;
  width: 10vw;
}
.importe {
  text-align: center;
  width: 10vw;
}
</style>