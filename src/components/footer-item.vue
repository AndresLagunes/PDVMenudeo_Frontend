
<template>
  <div class="product-section grid-container">
    <div  class="grid-item">
      <div class="grid-item-child" style="width: 60%;">
        <div v-show="barcode" class="barras">

          <div class="div-codbarras-label">
            <label for="barcodeInput">Cod. de barras: </label>
          </div>

          <div class="div-codbarras-input">
            <input type="text" id="barcodeInput" placeholder="" class="mediumInput"
              ref="barInput"
              maxlength="15" pattern="\d*"
              :disabled="disableBarInput" :class="{disabled: disableBarInput}"
              @keyup.tab="changeBarcode(1)"
              @keyup.enter="eventosTeclas($event, 'codigoBarras')" 
              @input="inputFormat($event, 'bar')"
              @blur="handleBlur('barcode')"
              @focus="handleFocus($event,'barcode')">
            </div>

            <div class="div-codbarras-desc">
              <span class="descProducto">{{ productoSeleccionado.Desc_Larga }}</span>
            </div>
        </div>

        <div v-show="!barcode" class="provprod">
          <div class="div-provprod-label">
            <label for="proveedor">Producto: </label>
          </div>
          <div class="div-provprod-input">
            <input ref="provInput" type="text" id="proveedor" placeholder="" 
              class="shortInput" 
              :disabled="disableProvInput" :class="{disabled: disableProvInput}"
              maxlength="4" pattern="\d*" 
              @keyup.f2="eventosTeclas($event, 'proveedor')"
              @keyup.enter="eventosTeclas($event, 'proveedorManual')" 
              @keyup.tab="changeBarcode(2)"
              @input="inputFormat($event, 'prov')"
              @blur="handleBlur('prov')"
              @focus="handleFocus($event,'prov')">
            -
            <input ref="prodInput" type="text" id="producto" placeholder="" class="shortInput"
              maxlength="4" pattern="\d*" 
              :disabled="disableProdInput" :class="{disabled: disableProdInput}"
              @keyup.f2="eventosTeclas($event, 'producto')"
              @keyup.enter="eventosTeclas($event, 'productoManual')"  
              @keyup.tab="changeBarcode(2)" 
              @input="inputFormat($event, 'prod')"
              @blur="handleBlur('prod')"
              @focus="handleFocus($event,'prod')">
          </div>
          
          <div class="div-provprod-desc">
            <span class="descProducto">{{ productoSeleccionado.Desc_Larga }}</span>
          </div>
        </div>
      </div>
      
        
      <div class="grid-item-child" style="width: 15%;">
        <div class="label-div" v-show="showCantidad">
          <label for="cantidad">Cantidad: </label>
        </div>
        <div class="content-div" v-show="showCantidad">
          <input ref="cantidadInput" type="text" id="cantidad" placeholder="" 
            class="shortInput" :class="{disabled: productoSeleccionado.Producto ? false : true}"
            :disabled="productoSeleccionado.Producto ? false : true"
            maxlength="6"
            @input="inputFormat($event, 'cantidad')"
            @keyup.enter="eventosTeclas($event, 'cantidad')">
        </div>
      </div>

      <div class="grid-item-child" style="width: 25%;">
        <div class="label-div">
          <span >Total:</span>
        </div>
        <div class="content-div">
          <span id="totalPrice">{{ parseFloat(total).toLocaleString("es-MX", { style:"currency", currency:"MXN" }) }}</span>
        </div>
      </div>
    </div>

  </div>

  <!-- DIALOG de los proveedores -->
  <v-dialog v-model="showModals.proveedor" max-width="90%">
    <v-card>
      <v-card-title class="headline">Buscar Proveedor</v-card-title>
      <v-card-text>
        <hr>
        <div class="nombreProv">
          <label for="nombreProv">Búsqueda por Nombre:   </label>
          <input type="text" id="nombreProv" v-model="nombreProveedor" placeholder="Nombre">
        </div>
        <hr style="margin-bottom: 5px;">
        <div class="table-container">
          <table fixed-header density="compact">
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
          </table>
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
        <hr>
        <div class="nombreProv">
          <label for="nombreProv">Búsqueda por Producto, Descripción o Número de Artículo:  </label>
          <input ref="filtroProductos" type="text" id="nombreProv"
            @keyup.enter="filtrarProductos">
        </div>
        <hr style="margin-bottom: 5px;">
        <div class="table-container" id="table-container-prod">
          <table fixed-header density="compact" ref="tablaProductos">
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
              <tr v-for="(p, i) in productosPaginados" 
                :key="p.Producto" 
                @click="selectItem(p, 'producto', i)" 
                :id="'d'+i" 
                ref="rowsProd">
                <td>{{ p.Producto }}</td>
                <td>{{ p.Desc_Larga }}</td>
                <td>{{ p.Numart }}</td>
                <td>{{ p.Empaque }}</td>
                <td>{{ p.Precio1 }}</td>
                <td>{{ p.Precio2 }}</td>
                <td>{{ p.Desc_Corta }}</td>
                <td>{{ p.Exist_Total }}</td>
                <td>{{ p.Apartados_Total }}</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-pagination
          v-model="pagination.page"
          :length="Math.ceil(pagination.totalItems / pagination.rowsPerPage)"
          @update:model-value="pageChanged"
          @next="pageChanged"
          @prev="pageChanged"
          @last="pageChanged"
          @first="pageChanged"
          style="width: 80%;"
        ></v-pagination>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="showModals.producto = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, nextTick, defineEmits, watch, onBeforeMount, onBeforeUnmount } from 'vue';
import {useToast} from 'vue-toast-notification';
import axios from 'axios';
const $toast = useToast(); // toaster de notificaciones

// import {useLoading} from 'vue-loading-overlay'
//cosas a exportar
defineExpose({ listener, reiniciar });
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
const pagination = ref({
  page: 1,
  rowsPerPage: 100, // Number of rows per page
  totalItems: 0, // Total number of items
  focusedItem: 0
})
function pageChanged() {
  // console.log((pagination.value.page * pagination.value.rowsPerPage) - pagination.value.rowsPerPage);
  // console.log(((pagination.value.page * pagination.value.rowsPerPage) -1));
  productosPaginados.value = productosFiltrados.value.slice(
    (pagination.value.page * pagination.value.rowsPerPage) - pagination.value.rowsPerPage,
    ((pagination.value.page * pagination.value.rowsPerPage) -1))
}
// const $loading = useLoading({
// });
const emits = defineEmits(['datos-producto']);//emisor de datos, transporta datos al componente padre
// eslint-disable-next-line no-unused-vars
var showModals = ref({
  "proveedor": false,
  "producto": false
});
const proveedores = ref([]);
const productos = ref([]);
const productosFiltrados = ref([]);
const productosPaginados = ref([]);

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
  { text: 'Existencias', value: 'Exist_Total', asc: true },
  { text: 'Aparatados', value: 'Apartados_Total', asc: true },
  { text: 'Sucursal', value: 'Sucursal', asc: true },
]);
var nombreProveedor = ref('');
var filtroProductos = ref(null);
var barcode = ref(true);
var showCantidad = ref(false);
var sortKey = ref('');
// var proovedorSeleccionado = ref({});
var productoSeleccionado = ref({});
var sortedbyASC = false;
var disableProdInput = ref(false);
var disableProvInput = ref(false);
var disableBarInput = ref(false);
// var barcodeText = ref('');
// var provText = ref('');
// var prodText = ref('');
const tablaProductos = ref(null);
const rowsProd = ref(null);
const barInput = ref(null);
const provInput = ref(null);
const prodInput = ref(null);
const cantidadInput = ref(null);

watch(showModals, async (newValues) => {
  if(!newValues.proveedor){
    proveedores.value.length = 0;
  }
  if(!newValues.producto) {
    productos.value.length = 0;
  }
})


onBeforeMount(() => { 
  getProductos();
  getProveedores();
  window.addEventListener('keydown', handleKeydown, null);
});
onBeforeUnmount (() => {
  window.removeEventListener('keydown', handleKeydown);
});
function handleKeydown (e) {
	switch (e.keyCode) {
    case 37:
    //  this.popupLeft();
     break;
    case 39: 
     prodInput.value.focus();
     break;
  }
}
// eslint-disable-next-line no-unused-vars
function listener(option){
  switch (option) {
    case 'cantidad':
      if(showCantidad.value){
        if(productoSeleccionado.value.Producto){
          cantidadInput.value.select();
          cantidadInput.value.focus();
        }
      } else if(barcode.value) {
        showCantidad.value = true;
        cantidadInput.value.select();
        cantidadInput.value.focus();
      }
      break;

    case 'focusFooter':
      productoSeleccionado.value = {};
      if(barcode.value){
        barInput.value.value = '';
        barInput.value.focus();
        barInput.value.select();
      } else {
        provInput.value.value = '';
        prodInput.value.value = '';
        provInput.value.focus();
        provInput.value.select();
      }
      break;
    
    default:
      break;
  }
}

function reiniciar() {
  prodInput.value.value = '';
  provInput.value.value = '';
  cantidadInput.value.value = '';
  productoSeleccionado.value = {};
}

function filtrarProductos (){
  if(filtroProductos.value.value != ''){
    let filtro = filtroProductos.value.value.toLowerCase();
    productosFiltrados.value = productos.value.filter(pP => {
      return pP.Producto.toLowerCase().includes(filtro) ||
      pP.Desc_Larga.toLowerCase().includes(filtro) || 
      pP.Numart.toLowerCase().includes(filtro)
    });
    pagination.value.totalItems = productosFiltrados.value.length;
    pagination.value.page = 1;
    pageChanged();
  } else {
    pageChanged();
  }
}
// Funciones
function inputFormat(event, option) {
  switch (option) {
    case 'prov':{
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      // event.target.value = event.target.value.replace(/[^\d]/g, '');
      
      let producto = event.target.value;
      // disableProdInput.value = true;
      if(producto == '' && producto == '0' && producto == '00' && producto == '000'  && producto == '0000') {
        prodInput.value = '0000';
      } 
      // else {
      //   disableProdInput.value = false;
      // }
      productoSeleccionado.value = {};
    }
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
    disableProvInput.value = true;    
    // const loader = $loading.show({
    //     // Optional parameters
    // });
    await axios.post('http://10.105.151.6:8000/api/consultaProveedores/')
      .then(response => {
        if (response.data.proveedores && response.data.proveedores.length > 0) {
          prov = response.data.proveedores;
        } else {
          console.log('sin datos');
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        // loader.hide();
        disableProvInput.value = false;
      });
  } catch (error) {
    console.log(error);
    disableProvInput.value = false;
  }
  proveedores.value = prov;
  return prov;
}
async function getProveedor(numProv) {
  let prov = [];
  try {
    disableProvInput.value = true;
    // const loader = $loading.show({
    //   isFullPage: true,
    //   active: true
    // });
    await axios.post('http://10.105.151.6:8000/api/consultaProveedor/', {"Proveedor": numProv})
      .then(response => {
        if (response.data.proveedores && response.data.proveedores.length > 0) {
          prov = response.data.proveedores;
        } else {
          console.log('sin datos');
          productoSeleccionado.value = {};
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        disableProvInput.value = false;
      });
  } catch (error) {
    console.log(error);
    disableProvInput.value = false;
  }
  return prov;
}
async function getProductosByProv(numProv) {
  let prod = [];
  try {
    const response = await axios.post('http://10.105.151.6:8000/api/consultaProductosPorProveedor/', { "Proveedor": numProv });
    // console.log(response.data);
    if (response.data.productos && response.data.productos.length > 0) {
      prod = response.data.productos;
    } else {
      console.log('sin datos');
    }
  } catch (error) {
    console.log(error);
  }
  productos.value = prod;
  productosPaginados.value = prod.slice(0,pagination.value.rowsPerPage);
  pagination.value.totalItems = prod.length;
}
async function getProductos() {
  let prod = [];
  try {
    const response = await axios.post('http://10.105.151.6:8000/api/consultaProductos/', {"Sucursal": 285});
    // console.log(response.data);
    if (response.data.productos && response.data.productos.length > 0) {
      prod = response.data.productos;
    } else {
      console.log('sin datos');
    }
  } catch (error) {
    console.log(error);
  }
  productos.value = prod;
  productosFiltrados.value = prod;
  productosPaginados.value = prod.slice(0,pagination.value.rowsPerPage);
  pagination.value.totalItems = prod.length;
}
async function getProducto(codBarra) {
  let producto = {};
  try {
    disableBarInput.value = true;
    await axios.post('http://10.105.151.6:8000/api/consultaProductoSP/', { "Producto": codBarra })
      .then(response => {
        if (response.data.status == 'success') {
          producto = response.data.producto;
          producto.error = false;
        } else {
          producto = undefined;          
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        disableBarInput.value = false;
      });
    
  } catch (error) {
    console.log(error);
    disableBarInput.value = false;
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
      showModals.value.proveedor = true;
      showModals.value.producto = false;
      break;
    case 'producto':{
      let prov = provInput.value.value;
      if(prov == '' || prov == '0' || prov == '00' || prov == '000'  || prov == '0000') {        
        productosFiltrados.value = [];
        pagination.value.totalItems = productosFiltrados.value.length;
        pagination.value.page = 1;
        filtroProductos.value = "";
        pageChanged();
        showModals.value.producto = true;
        showModals.value.proveedor = false;
      } else {
        productosFiltrados.value = productos.value.filter(p => {
          return p.Proveedor == prov;
        });
        pagination.value.totalItems = productosFiltrados.value.length;
        pagination.value.page = 1;
        filtroProductos.value = "";
        pageChanged();
        showModals.value.producto = true;
        // pageChanged();
        // nextTick(() => {
        //   // Access the table's DOM element
        //   const table = tablaProductos.value;

        //   // Access the specific row's DOM element
        //   console.log(pagination.value.focusedItem)
        //   const row = table.querySelectorAll('tbody tr')[pagination.value.focusedItem-1];
        //   console.log(row.offsetTop)
          
        //   // Scroll to the row's offset position
        //   table.parentElement.scrollTop = row.offsetTop;
        // });
        showModals.value.proveedor = false;
      }
    }
      break;
    case 'proveedorManual':{
      let prov = provInput.value.value.toString().padStart(4, '0');
      if (prov == '' || prov == '0' || prov == '00' || prov == '000' || prov == '0000') {
        provInput.value.value = '';
        provInput.value.focus();
      } else {
        let proveedor = await getProveedor(prov);
        
        if(proveedor.length == 0){
          nextTick(() => {
            // provInput.value.focus();
          });
        } else {
          provInput.value.value = proveedor[0].Proveedor;
          // productos.value = await getProductosByProv(proveedor[0].Proveedor);
          // getProductosByProv(proveedor[0].Proveedor);
          productosFiltrados.value = productos.value.filter(p => {
            return p.Proveedor == prov;
          });
          pagination.value.totalItems = productosFiltrados.value.length;
          pagination.value.page = 1;
          pageChanged();
          // console.log(productos.value)
          nextTick(() => {
            prodInput.value.focus();
            console.log(provInput.value.value)
          });
        }
        // let newIndex = productos.value.findIndex(pd => pd.Proveedor == prov);
        // console.log(productos.value.at(newIndex));
        // console.log(newIndex);
        // let newPage = Math.ceil(newIndex / pagination.value.rowsPerPage);
        // pagination.value.page = newPage;
        // pagination.value.focusedItem = (newIndex % pagination.value.rowsPerPage);
        // nextTick(() => {
        //   prodInput.value.focus();
        // });
      }
    }
      break;

    case 'productoManual':{
      //faltan validaciones
      prodInput.value.value = prodInput.value.value.toString().padStart(4, '0');
      let foundInGrid = props.gridData.find(gD => gD.producto.Producto === (provInput.value.value + prodInput.value.value));
      // console.log(foundInGrid)
      if(foundInGrid == undefined){
        cantidadInput.value.value == '';
        let found = productos.value.find(p => p.Producto == (provInput.value.value + prodInput.value.value));
        if (found != undefined) {
          productoSeleccionado.value = found;
          // console.log(productoSeleccionado.value)
          nextTick(() => {
            cantidadInput.value.select();
            cantidadInput.value.focus();
          });
        } else {
          productoSeleccionado.value = {};
          productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO'
        }
      } else {
        productoSeleccionado.value = foundInGrid.producto;
        cantidadInput.value.value = foundInGrid.cantidad;
        nextTick(() => {
          cantidadInput.value.select();
          cantidadInput.value.focus();
        });
      }
      }
      break;

    case 'cantidad':
      //faltan validaciones
      console.log({
        "producto": productoSeleccionado.value,
        "cantidad": cantidadInput.value.value,
      })
      if(cantidadInput.value.value != '' && !/^0+$/.test(cantidadInput.value.value)){
        emits('datos-producto', {
          "producto": productoSeleccionado.value,
          "cantidad": parseInt(cantidadInput.value.value),
        });
        cantidadInput.value.value = '';
      } else if (/^0+$/.test(cantidadInput.value.value)){
        emits('datos-producto', {
          "producto": productoSeleccionado.value,
          "cantidad": 0,
        });
        cantidadInput.value.value = '';
      }
      nextTick(() => {
        if(showCantidad.value){
          if(!barcode.value){
            prodInput.value.select();
            prodInput.value.focus();
          } else {
            barInput.value.select();
            barInput.value.focus();
            showCantidad.value = false;
          }
        }
      });
      break;

    case 'codigoBarras': {
      if (barInput.value.value.length >= 13) {
        let foundInGrid = props.gridData.find(gD => gD.producto.Codigobarra === barInput.value.value);

        if (foundInGrid == undefined) {
          cantidadInput.value.value == '';
          productoSeleccionado.value = await getProducto(barInput.value.value);
          console.log(productoSeleccionado.value);
          if (productoSeleccionado.value != undefined) {
            // console.log(productoSeleccionado.value);
            if (showCantidad.value) {
              cantidadInput.value.value = productoSeleccionado.value.Unidad;
              emits('datos-producto', {
                "producto": productoSeleccionado.value,
                "cantidad": productoSeleccionado.value.Unidad,
              });
            } else {
              // cantidadInput.value.value = productoSeleccionado.value.Unidad;
              emits('datos-producto', {
                "producto": productoSeleccionado.value,
                "cantidad": productoSeleccionado.value.Unidad,
              });
            }
            // console.log(props.gridData)

          } else {
            productoSeleccionado.value = {};
            productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO'
          }
        } else {
          console.log(foundInGrid.cantidad);
          if (showCantidad.value) {
            cantidadInput.value.value = foundInGrid.cantidad;
            productoSeleccionado.value = foundInGrid.producto;
          } else {
            // cantidadInput.value.value = productoSeleccionado.value.Unidad + foundInGrid.cantidad;
            productoSeleccionado.value = foundInGrid.producto;
            emits('datos-producto', {
              "producto": productoSeleccionado.value,
              "cantidad": productoSeleccionado.value.Unidad + foundInGrid.cantidad
            });
          }
        }
        // console.log(productoSeleccionado.value)
      } else {
        console.log('nop')
        if(showCantidad.value){
          productoSeleccionado.value = {};
          productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO';
          cantidadInput.value = 0;
        } else {
          productoSeleccionado.value = {};
          productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO';
        }
      }
      barInput.value.value = '';
      barInput.value.focus();
    }
      break;
    default:
      break;
  }
}
async function handleBlur(option) {
  switch (option) {
    case 'prov':{
      let prov = provInput.value.value.toString().padStart(4, '0');
      // console.log(prov)
      provInput.value.value = prov;
      if(prov == '' || prov == '0' || prov == '00' || prov == '000'  || prov == '0000') {
        // disableProdInput.value = true;
        prodInput.value = '';
        // provInput.value.focus();
      } else {
        let proveedor = await getProveedor(prov);

        if(proveedor.length == 0){
          nextTick(() => {
            provInput.value.focus();
            // eslint-disable-next-line no-unused-vars
            let provNotFound = $toast.warning('No se encontró al proveedor', {
              // duration: 200
              position: 'top-right'
            });
          });
        } else {
          provInput.value.value = proveedor[0].Proveedor;
          // productos.value = await getProductosByProv(proveedor[0].Proveedor);
          // getProductosByProv(proveedor[0].Proveedor);
          productosFiltrados.value = productos.value.filter(p => {
            return p.Proveedor == prov;
          });
          pagination.value.totalItems = productosFiltrados.value.length;
          pagination.value.page = 1;
          pageChanged();
          nextTick(() => {
            prodInput.value.focus();
          });
        }

        // let newIndex = productos.value.findIndex(pd => pd.Proveedor == newValue);
        // console.log(productos.value.at(newIndex));
        // console.log(newIndex);
        // let newPage = Math.ceil(newIndex / pagination.value.rowsPerPage);
        // pagination.value.page = newPage;
        // pagination.value.focusedItem = (newIndex % pagination.value.rowsPerPage);
        // nextTick(() => {
        //   prodInput.value.focus();
        // });
      }
    }
      break;
    case 'prod':{
      let newValue = prodInput.value.value.toString().padStart(4, '0');
      prodInput.value.value = newValue;
      let foundInGrid = props.gridData.find(gD => gD.producto.Producto === (provInput.value.value + prodInput.value.value));
      if(foundInGrid == undefined) {
        cantidadInput.value.value == '';
        // console.log(productos.value)
        let found = productos.value.find(p => p.Producto == provInput.value.value + prodInput.value.value);
        if (found != undefined) {
          productoSeleccionado.value = found;
        } else {
          productoSeleccionado.value = {};
          productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO'
        }
      } else {
        productoSeleccionado.value = foundInGrid.producto;
        cantidadInput.value.value = foundInGrid.cantidad;
      }
      
    }
      break;
    case 'barcode':
      
      break;
    default:
      break;
  }
}
function handleFocus(event, option) {
  switch (option) {
    case 'prov':{
      event.target.select();
      let v = event.target.value;
      if(v == '' || v == '0' || v == '00' || v == '000'  || v == '0000') {
        // disableProdInput.value = true;
        prodInput.value = '';
      } 
      // else {
      //   disableProdInput.value = false;
      // }
    }
      break;
    case 'prod':{
      event.target.select();
      // let p = event.target.value;
      // console.log(p);
      // if(p == '' || p == '0' || p == '00' || p == '000'  || p == '0000') {
      //   disableProdInput.value = true;
      //   prodInput.value = '';
      // } else {
      //   disableProdInput.value = false;
      // }
    }
      break;
    case 'barcode':
      event.target.select();
      break;
    default:
      break;
  }
}
function comportamientoFlechitas(option, key, event) {
  event.preventDefault();
  switch (option) {
    case 'proveedor':
      switch (key) {
        case 'derecha':
          // if(!disableProdInput.value){
          //   nextTick(() => {
          //     prodInput.value.focus();
          //   });
          // }
          break;
      
        default:
          break;
      }
      
      break;
  
    default:
      break;
  }
}
function changeBarcode(option) {
  this.barcode = !this.barcode;
  productoSeleccionado.value = {};
  cantidadInput.value.value = 0;
  
  switch (option) {
    case 1:
      showCantidad.value = true;    
      barInput.value.value = '';
      nextTick(() => {
        provInput.value.focus();
      });
      break;
    case 2:
      showCantidad.value = false;
      provInput.value.value = '';
      prodInput.value = '';
      nextTick(() => {
        barInput.value.focus();
      });
      break;

    default:
      break;
  }
}
// eslint-disable-next-line no-unused-vars
async function selectItem(p, option, i) {
  switch (option) {
    case 'proveedor':{

      // let newIndex = productos.value.findIndex(pd => pd.Proveedor == p.Proveedor);
      // // console.log(productos.value.at(newIndex));
      // // console.log(newIndex);
      // let newPage = Math.ceil(newIndex / pagination.value.rowsPerPage);
      // pagination.value.page = newPage;
      // pagination.value.focusedItem = (newIndex % pagination.value.rowsPerPage);
      // // console.log(pagination.value.focusedItem);
      
      
      provInput.value.value = p.Proveedor;
      showModals.value.proveedor = false;
      // productos.value = await getProductosByProv(p.Proveedor);
      productosFiltrados.value = productos.value.filter(p => {
        return p.Proveedor == p.Proveedor;
      });
      pagination.value.totalItems = productosFiltrados.value.length;
      pagination.value.page = 1
      pageChanged();
      console.log(productos.value);
      nextTick(() => {
        prodInput.value.focus();
      });
    }
      break;
    case 'producto':
      showModals.value.producto = false;
      prodInput.value.value = p.Producto.substring(4);
      productoSeleccionado.value = p;
      nextTick(() => {
        cantidadInput.value.select();
        cantidadInput.value.focus();
      });
      break;
    default:
      break;
  }
}
</script>

<style scoped>
.product-section {
  background-color: rgba(95,138,193,1);
  border-color: rgba(0, 0, 0, 0.301);
  border-style: inset;
}

.product-section label {
  font-weight: bold;
}
.grid-container {
  width: 99vw;
  padding: 1px;
  background-color: rgba(178, 201, 232, 1) !important;
  border-color: rgba(0, 0, 0, 0.301);
  border-style: inset;
}

.grid-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.grid-item-child {
  /* width: calc(100% / 3); */
  display: flex;
}

.descProducto {  
  font-size: 12px;
  background-color: white;
  padding: 2px;
  border:1px solid rgba(0, 0, 0, 0.7);  
}
.label-div {
  width: 15%;
  min-width: 70px;

}
.div-codbarras-label {
  min-width: 85px;
  padding-right: 5px;
}
.div-codbarras-input {
  min-width: 110px;
  padding-right: 5px;
}
.div-codbarras-desc {
  display: inline-block;
  padding-right: 5px;
}
.div-codbarras-desc > textarea{
  width: 100%;
  height: 20px;
}

.div-provprod-label {
  min-width: 85px;
  padding-right: 5px;
}
.div-provprod-input {
  min-width: 110px;
  padding-right: 5px;
}
.div-provprod-desc {
  display: inline-block;
  padding-right: 5px;
}
.div-provprod-desc > textarea{
  width: 100%;
  height: 20px;
}


.barras{
  width: 100%;
  display: flex;
  padding-right: 2px;
}
.provprod{
  width: 100%;
  display: flex;
  padding-right: 2px;
  text-align: right;
}
.content-div {
  width: 85%;
}

.grid-item label {
  font-size: 12px;
}
.grid-item input,
.grid-item textarea {
  font-size: 12px;
  border: 1px solid rgba(0, 0, 0, 0.726);
  background-color: white;
}

.table-container {
  width: 100%;
  /* Adjust this as needed */
  height: 400px;
  /* Set a fixed height */
  overflow-x: auto;
  /* Horizontal scrollbar */
  /* Vertical scrollbar */
  white-space: nowrap;
  /* Prevent content wrapping */
  position: relative;
  /* Relative positioning */
  /* font-size: 12px; */
}
.table-container table {
  overflow-y: auto;
  width: 100%;
}

.table-container td,
.table-container th {
  padding: 1px 3px 1px 3px !important;
  /* 1px vertical padding, adjust horizontal padding as desired */

  /* This is just for clarity; remove if you're using a different font size elsewhere */
  border: 1px solid rgba(0, 0, 0, 0.25);

}

.table-container th {
  position: sticky;
  top: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.25);
  font-weight: 900 !important;
  font-size: 13px;
  /* height: 20px !important; */
  background-color: rgba(232,220,212) !important;
  color: rgba(0, 0, 0, 0.733) !important;
}

.table-container td {
  font-size: 13px;
  height: 20px !important;
  border: 1px solid rgba(0, 0, 0, 0.25);
  /* background-color: rgb(255, 255, 255) !important; */
  border-right: 1px solid rgba(0, 0, 0, 0.25);
  padding: 1px 5px 1px 5px;
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
  max-width: 50px;
}
.mediumInput {
  border: 2px solid rgba(0, 0, 0, 0.25);
  border-radius: 1px;
  width: 110px; 
}
#totalPrice {
  font-size: 24px;
  background-color: white;
  text-align: right;
  border:1px solid rgba(0, 0, 0, 0.7);
}
.disabled {
  background-color: gray !important;
  color: white !important;
}

.nombreProv {
  padding-top: 5px;
  padding-bottom: 5px;
}

#nombreProv {
  flex: 1;
  border:1px solid rgba(0, 0, 0, 0.7);
}


</style>