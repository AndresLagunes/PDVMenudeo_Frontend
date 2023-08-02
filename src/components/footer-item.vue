
<template>
  <div class="product-section grid-container">
    <div v-show="barcode" class="grid-item">
      <div>
        <label for="barcodeInput">Cod. de barras </label>
        <input ref="barInput" type="text" id="barcodeInput" placeholder=""
          maxlength="8" pattern="\d*"
          @keyup.tab="changeBarcode(1)"
          @keyup.enter="eventosTeclas($event, 'codigoBarras')" 
          @input="inputFormat($event, 'bar')">
      </div>
      <div class="descProducto">{{ productoSeleccionado.Desc_Larga }}</div>
    </div>
    <div v-show="!barcode" class="grid-item">
      <div>
        <label for="proveedor">Producto </label>
        <input ref="provInput" type="text" id="proveedor" placeholder="" class="shortInput"
          maxlength="4" pattern="\d*" 
          @keyup.f2="eventosTeclas($event, 'proveedor')"
          @keyup.enter="eventosTeclas($event, 'proveedorManual')" 
          @keyup.tab="changeBarcode(2)"
          @input="inputFormat($event, 'prov')">
        -
        <input ref="prodInput" type="text" id="producto" placeholder="" class="shortInput"
          maxlength="4" pattern="\d*" 
          @keyup.f2="eventosTeclas($event, 'producto')"
          @keyup.enter="eventosTeclas($event, 'productoManual')"  
          @keyup.tab="changeBarcode(2)" 
          @input="inputFormat($event, 'prod')">
      </div>
    </div>
    <div class="grid-item">
      <div>
        <label for="cantidad">Cantidad: </label>
        <input ref="cantidadInput" type="text" id="cantidad" placeholder="" @input="inputFormat($event, 'cantidad')"
          @keyup.enter="eventosTeclas($event, 'cantidad')">
      </div>
    </div>

    <div class="grid-item">
      <span style="flex: 1; text-align: center;">Total:</span>
      <span id="totalPrice">${{ total }}</span>
    </div>
  </div>

  <!-- DIALOG de los proveedores -->
  <v-dialog v-model="showModals.proveedor" max-width="90%">
    <v-card>
      <v-card-title class="headline">Buscar Proveedor</v-card-title>
      <v-card-text>
        <hr class="solid">
        <div class="nombreProv">
          <!-- Input Nombre -->
          <label for="nombreProv">Búsqueda por Nombre:</label>
          <input type="text" id="nombreProv" v-model="nombreProveedor" placeholder="Nombre">
        </div>
        <hr class="solid">
        <div class="table-container">
          <v-table fixed-header density="compact">
            <thead>
              <tr>
                <th v-for="header in headersProv" :key="header.value" @click="sortList(header.value)"
                  :class="{ active: sortKey == header.value, [header.class]: header.class }">
                  {{ header.text }}
                  <span class="arrow" :class="header.asc ? 'asc' : 'dsc'"></span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in proveedores" :key="p.Proveedor" @click="selectItem(p, 'proveedor')">
                <td>{{ p.Proveedor }}</td>
                <td>{{ p.Nombre }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="showModals.proveedor = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- DIALOG de los productos -->
  <v-dialog v-model="showModals.producto" max-width="90%">
    <v-card>
      <v-card-title class="headline">Buscar Producto</v-card-title>
      <v-card-text>
        <hr class="solid">
        <div class="nombreProv">
          <!-- Input Nombre -->
          <label for="nombreProv">Búsqueda por Nombre:</label>
          <input type="text" id="nombreProv" v-model="nombreProducto" placeholder="Nombre">
        </div>
        <hr class="solid">
        <div class="table-container">
          <v-table fixed-header density="compact">
            <thead>
              <tr>
                <th v-for="header in headersProd" :key="header.value" @click="sortList(header.value)"
                  :class="{ active: sortKey == header.value, [header.class]: header.class }">
                  {{ header.text }}
                  <span class="arrow" :class="header.asc ? 'asc' : 'dsc'"></span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in productos" :key="p.Proveedor" @click="selectItem(p, 'producto')">
                <td>{{ p.Producto }}</td>
                <td>{{ p.Desc_Larga }}</td>
                <td>{{ p.Numart }}</td>
                <td>{{ p.Empaque }}</td>
                <td>{{ p.Precio1 }}</td>
                <td>{{ p.Precio2 }}</td>
                <td>{{ p.Desc_Corta }}</td>
                <td>1</td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="showModals.proveedor = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, nextTick, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  total: {
    type: String,
    required: true,
  },  
  gridData: {
    type: Array,
    default: () => []
  },
});
// onMounted(() => {

// });

var showModals = ref({
  "proveedor": false,
  "producto": false
});
const proveedores = ref([]);
const productos = ref([]);
var headersProv = ref([
  { text: 'Proveedor', value: 'Proveedor', asc: true },
  { text: 'Nombre', value: 'Nombre', asc: true },
]);
var headersProd = ref([
  { text: 'Producto', value: 'Producto', asc: true },
  { text: 'Descripción', value: 'Desc_Larga', asc: true },
  { text: 'Número artículo', value: 'Numart', asc: true },
  { text: 'Empaque', value: 'Empaque', asc: true },
  { text: 'Prec. Men', value: 'Precio1', asc: true },
  { text: 'Prec. May.', value: 'Precio2', asc: true },
  { text: 'Descripción Corta', value: 'Desc_Corta', asc: true },
  { text: 'Sucursal', value: 'Sucursal', asc: true },
]);
const emits = defineEmits(['datos-producto']);//emisor de datos, transporta datos al componente padre
var nombreProveedor = ref('');
var nombreProducto = ref('');
var barcode = ref(true);
var sortKey = ref('');
var productoSeleccionado = ref({});
var sortedbyASC = false;
const barInput = ref(null);
const provInput = ref(null);
const prodInput = ref(null);
const cantidadInput = ref(null);

// Funciones
function inputFormat(event, option) {
  switch (option) {
    case 'prov':
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      break;
    case 'prod':
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      break;
    case 'cantidad':
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      break;
    case 'bar':
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      break;
    default:
      break;
  }
  event.target.value = event.target.value.replace(/[^\d]/g, '');
}
function sortList(sortBy) {
  this.sortKey = sortBy;
  /*
    pregunta si el modal proveedor está mostránose, si se muestra, se busca en los headers de proveedor
    si no se está mostrando, pregunta si el modal de los productos se está mostrando, si se muestra, se
    busca en los headers de los productos, si no, se iguala el headeritem en null.
  */
  const headerItem = 
    showModals.value.proveedor ? this.headersProv.find(header => header.value === sortBy) :
      showModals.value.producto ? this.headersProd.find(header => header.value === sortBy) : null;
  if (headerItem) {
    headerItem.asc = headerItem.asc ? false : true;
    if (sortedbyASC) {
      if (showModals.value.proveedor) {
        proveedores.value.sort((x, y) => {
          let xValue = x[sortBy];
          let yValue = y[sortBy];

          // Check if xValue and yValue are numbers in string format
          if (!isNaN(xValue) && !isNaN(yValue)) {
              xValue = parseFloat(xValue);
              yValue = parseFloat(yValue);
          }
          if (xValue > yValue) {
            return -1;
          } else if (xValue < yValue) {
            return 1;
          } else {
            return 0;
          }
        });
      } else if (showModals.value.producto) {
        productos.value.sort((x, y) => {
          let xValue = x[sortBy];
          let yValue = y[sortBy];

          // Check if xValue and yValue are numbers in string format
          if (!isNaN(xValue) && !isNaN(yValue)) {
              xValue = parseFloat(xValue);
              yValue = parseFloat(yValue);
          }
          if (xValue > yValue) {
            return -1;
          } else if (xValue < yValue) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      // showModals.value.proveedor ? proveedores.value.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1)) :
      //   productos.value.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
      sortedbyASC = false;
      
    } else {
      if (showModals.value.proveedor) {
        proveedores.value.sort((x, y) => {
          let xValue = x[sortBy];
          let yValue = y[sortBy];

          // Check if xValue and yValue are numbers in string format
          if (!isNaN(xValue) && !isNaN(yValue)) {
              xValue = parseFloat(xValue);
              yValue = parseFloat(yValue);
          }
          if (xValue < yValue) {
            return -1;
          } else if (xValue > yValue) {
            return 1;
          } else {
            return 0;
          }
        });
      } else if (showModals.value.producto) {
        productos.value.sort((x, y) => {
          let xValue = x[sortBy];
          let yValue = y[sortBy];

          // Check if xValue and yValue are numbers in string format
          if (!isNaN(xValue) && !isNaN(yValue)) {
              xValue = parseFloat(xValue);
              yValue = parseFloat(yValue);
          }

          if (xValue < yValue) {
            return -1;
          } else if (xValue > yValue) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      // showModals.value.proveedor ? proveedores.value.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1)) :
      //   productos.value.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
      sortedbyASC = true;
    }
  } else {
    console.log('Item not found');
  }
  
}
async function getProveedores() {
  let prov = [];
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/consultaProveedores/');
    // console.log(response.data);
    if (response.data.proveedores && response.data.proveedores.length > 0) {
      prov = response.data.proveedores;
    } else {
      console.log('sin datos');
    }
  } catch (error) {
    console.log(error);
  }
  return prov;
}
async function getProveedor(numProv) {
  let prov = [];
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/consultaProveedor/', numProv);
    // console.log(response.data);
    if (response.data.proveedores && response.data.proveedores.length > 0) {
      prov = response.data.proveedores;
    } else {
      console.log('sin datos');
    }
  } catch (error) {
    console.log(error);
  }
  return prov;
}
async function getProductosByProv(numProv) {
  let productos = [];
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/consultaProducto/', { "Proveedor": numProv });
    // console.log(response.data);
    if (response.data.productos && response.data.productos.length > 0) {
      productos = response.data.productos;
    } else {
      console.log('sin datos');
    }
  } catch (error) {
    console.log(error);
  }
  return productos;
}
async function getProducto(codBarra) {
  let producto = {};
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/consultaProductoPorBarra/', { "Producto": codBarra });
    // console.log(response.data);
    if (response.data.producto) {
      producto = response.data.producto;
      producto.error = false;
    } else {
      producto.error = true;
      console.log('sin datos');
    }
  } catch (error) {
    console.log(error);
  }
  return producto;
}
// function teclazo(event, option) {
//   // Check if the pressed key is F2 (key code 113)
//   if (event.keyCode === 113) {
//     console.log(option)
//   }
// }
async function eventosTeclas(event, option) {
  event.preventDefault();
  switch (option) {
    case 'proveedor':
      this.proveedores = await getProveedores();
      // console.log(this.proveedores)
      showModals.value.proveedor = true;
      showModals.value.producto = false;
      break;
    case 'producto':
      showModals.value.producto = true;
      console.log(productos)
      showModals.value.proveedor = false;
      break;
    case 'proveedorManual':
      // console.log(provInput.value.value.toString().padStart(4, '0'))
      var p = await getProveedor({ "Proveedor": provInput.value.value.toString().padStart(4, '0') });
      console.log(p)
      if (p.length > 0) {
        provInput.value.value = p[0].Proveedor;
        // se llena el arreglo de productos con los productos del proveedor seleccionado
        productos.value = await getProductosByProv(p[0].Proveedor);
        console.log(productos.value);
        nextTick(() => {
          prodInput.value.focus();
        });
      } else {
        provInput.value.value = '';
        provInput.value.focus();
      }
      break;

    case 'productoManual':
      //faltan validaciones
      prodInput.value.value =prodInput.value.value.toString().padStart(4, '0');
      productoSeleccionado.value = productos.value.find(p => p.Producto == provInput.value.value + prodInput.value.value);
      console.log(productoSeleccionado.value)
      break;

    case 'cantidad':
      //faltan validaciones
      console.log({
        "producto": productoSeleccionado.value,
        "cantidad": cantidadInput.value.value,
      })
      emits('datos-producto', {
        "producto": productoSeleccionado.value,
        "cantidad": cantidadInput.value.value,
      });
      break;

    case 'codigoBarras': {
      let found = props.gridData.find(gD => gD.producto.Producto === barInput.value.value);
      
      if (found == undefined) {
        productoSeleccionado.value = await getProducto(barInput.value.value);
        
        if(!productoSeleccionado.value.error){
          // console.log(productoSeleccionado.value);
          nextTick(() => {
            cantidadInput.value.focus();
          });
          // console.log(props.gridData)
        } else {
          productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO'
        }
      } else {
        // console.log(found.cantidad);
        cantidadInput.value.value = found.cantidad;
        productoSeleccionado.value = found.producto;
        nextTick(() => {
          cantidadInput.value.focus();
        });
      }
      // console.log(productoSeleccionado.value)
    }
      break;
    default:
      break;
  }
}
function changeBarcode(option) {
  this.barcode = !this.barcode;
  switch (option) {
    case 1:
      nextTick(() => {
        provInput.value.focus();
      });
      break;
    case 2:
      nextTick(() => {
        barInput.value.focus();
      });
      break;

    default:
      break;
  }
}
async function selectItem(p, option) {
  switch (option) {
    case 'proveedor':
      showModals.value.proveedor = false;
      provInput.value.value = p.Proveedor;
      productos.value = await getProductosByProv(p.Proveedor);
      console.log(productos.value);
      nextTick(() => {
        prodInput.value.focus();
      });
      break;
    case 'producto':
      showModals.value.producto = false;
      prodInput.value.value = p.Producto.substring(4);
      productoSeleccionado.value = p;
      nextTick(() => {
        cantidadInput.value.focus();
      })
      break;
    default:
      break;
  }
}

</script>

<style scoped>
.product-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(95,138,193,1);
  border-color: rgba(0, 0, 0, 0.301);
  border-style: inset;
}

.product-section input {
  border: 2px solid rgba(0, 0, 0, 0.25);
  border-radius: 1px;
  width: 200px; /* Make the input fields fit their content */
  max-width: 100%; /* Limit the width to the width of the container */
}
.product-section label {
  font-weight: bold;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 columns of equal width */
  gap: 2px;
  /* Gap between rows and columns */
  padding: 1px;
  /* Padding around the grid */
}

.grid-item {
  padding: 5px;
  /* Padding inside each grid item */
  display: inline-flex;
  /* align-items: center; */
  justify-content: space-between;
  /* Center content inside grid items */
  flex-direction: row;
}
.grid-container .descProducto {
  font-size: 12px;
  width: 49%;
  text-align: justify;
}
.span-column {
  grid-column: span 2;
  /* This will make the grid item span 2 columns */
  align-items: end;
}

.grid-item label {
  width: 20%;
  font-size: 12px;
}

.span-column label {
  width: 10%;
  font-size: 12px;
}

.grid-item input,
.grid-item textarea {
  flex: 3;
  /* Allow the input/textarea to take up more space than the label */
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.726);
  background-color: white;
}

.grid-item span {
  flex: 2;
}

.table-container {
  width: 100%;
  /* Adjust this as needed */
  height: 400px;
  /* Set a fixed height */
  overflow-x: auto;
  /* Horizontal scrollbar */
  overflow-y: auto;
  /* Vertical scrollbar */
  white-space: nowrap;
  /* Prevent content wrapping */
  position: relative;
  /* Relative positioning */
  /* font-size: 12px; */
}

.table-container td,
.table-container th {
  padding: 1px 3px 1px 3px !important;
  /* 1px vertical padding, adjust horizontal padding as desired */

  /* This is just for clarity; remove if you're using a different font size elsewhere */
  border: 1px solid rgba(0, 0, 0, 0.25);

}

.table-container th {
  font-weight: 900 !important;
  font-size: 11px;
}

.table-container td {
  font-size: 10px;
}

.table-container th:hover {
  cursor: pointer;
  background: rgb(229, 255, 211);
}

.table-container tr:nth-child(even) {
  background-color: #f3f3f3;
}

.table-container th.active {
  text-decoration: underline;
}

.table-container th.active .arrow {
  opacity: 1;
}

.table-container .arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.table-container .arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #000000;
}

.table-container .arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #000000;
}

.table-container tr:hover {
  cursor: pointer;
  background-color: steelblue;
}
.shortInput {
  max-width: 40px;
}
#totalPrice {
  font-size: 24px;
  background-color: white;
  text-align: right;
  border:1px solid rgba(0, 0, 0, 0.7);
}
</style>