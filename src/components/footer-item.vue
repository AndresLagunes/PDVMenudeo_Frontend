
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
              @input="inputFormat($event, 'bar')">
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
          @input="inputFormat($event, 'cantidad')"
          @keyup.enter="eventosTeclas($event, 'cantidad')">
        </div>
      </div>

      <div class="grid-item-child" style="width: 25%;">
        <div class="label-div">
          <span >Total:</span>
        </div>
        <div class="content-div">
          <span id="totalPrice">${{ total }}</span>
        </div>
      </div>
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
// import {useLoading} from 'vue-loading-overlay'
//cosas a exportar
defineExpose({ focusCantidad });
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
// const $loading = useLoading({
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
var showCantidad = ref(false);
var sortKey = ref('');
// var proovedorSeleccionado = ref({});
var productoSeleccionado = ref({});
var sortedbyASC = false;
var disableProdInput = ref(true);
var disableProvInput = ref(false);
var disableBarInput = ref(false);
// var barcodeText = ref('');
// var provText = ref('');
// var prodText = ref('');
const barInput = ref(null);
const provInput = ref(null);
const prodInput = ref(null);
const cantidadInput = ref(null);



// eslint-disable-next-line no-unused-vars
function focusCantidad(){
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
}
// Funciones
function inputFormat(event, option) {
  switch (option) {
    case 'prov':{
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      // event.target.value = event.target.value.replace(/[^\d]/g, '');
      
      let producto = event.target.value;
      disableProdInput.value = true;
      if(producto == '' && producto == '0' && producto == '00' && producto == '000'  && producto == '0000') {
        prodInput.value = '0000';
      } else {
        disableProdInput.value = false;
      }
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
    await axios.post('http://10.105.151.6:8000/api/consultaProveedor/', numProv)
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
  let productos = [];
  try {
    const response = await axios.post('http://10.105.151.6:8000/api/consultaProducto/', { "Proveedor": numProv });
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
    disableBarInput.value = true;
    await axios.post('http://10.105.151.6:8000/api/consultaProductoSP/', { "Producto": codBarra })
      .then(response => {
        if (response.data.producto) {
          producto = response.data.producto;
          producto.error = false;
        } else {
          producto.error = true;
          console.log('sin datos');
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
        
        // proovedorSeleccionado.value = p;
        provInput.value.value = p[0].Proveedor;
        // se llena el arreglo de productos con los productos del proveedor seleccionado
        productos.value = await getProductosByProv(p[0].Proveedor);
        console.log(productos.value);
        disableProdInput.value = false;
        nextTick(() => {
          prodInput.value.focus();
        });
      } else {
        disableProdInput.value = true;
        provInput.value.value = '';
        provInput.value.focus();
      }
      break;

    case 'productoManual':{
      //faltan validaciones
      prodInput.value.value =prodInput.value.value.toString().padStart(4, '0');
      let found = productos.value.find(p => p.Producto == provInput.value.value + prodInput.value.value);
      if (found != undefined) {
        productoSeleccionado.value = found;
        console.log(productoSeleccionado.value)
        console.log(productos.value);
        nextTick(() => {
          cantidadInput.value.select();
          cantidadInput.value.focus();
        });
      } else {
        productoSeleccionado.value = {};
        productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO'
      }
      }
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
      let found = props.gridData.find(gD => gD.producto.Codigobarra === barInput.value.value);
      
      if (found == undefined) {
        productoSeleccionado.value = await getProducto(barInput.value.value);
        
        if(!productoSeleccionado.value.error){
          // console.log(productoSeleccionado.value);
          if (showCantidad.value) {
            nextTick(() => {
              cantidadInput.value.select();
              cantidadInput.value.focus();
            });
            cantidadInput.value.value = productoSeleccionado.value.Unidad;
            emits('datos-producto', {
              "producto": productoSeleccionado.value,
              "cantidad": productoSeleccionado.value.Unidad,
            });
          } else {
            cantidadInput.value.value = productoSeleccionado.value.Unidad;
            emits('datos-producto', {
              "producto": productoSeleccionado.value,
              "cantidad": productoSeleccionado.value.Unidad,
            });
          }
          // console.log(props.gridData)
          
        } else {
          productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO'
        }
      } else {
        console.log(found.cantidad);
        if (showCantidad.value) {
          cantidadInput.value.value = found.cantidad;
          productoSeleccionado.value = found.producto;
          nextTick(() => {
            cantidadInput.value.select();
            cantidadInput.value.focus();
            // emits('datos-producto', {
            //   "producto": productoSeleccionado.value,
            //   "cantidad": productoSeleccionado.value.Unidad + found.cantidad,
            // });
          });
        } else {
          cantidadInput.value.value = productoSeleccionado.value.Unidad + found.cantidad;
          productoSeleccionado.value = found.producto;
          emits('datos-producto', {
            "producto": productoSeleccionado.value,
            "cantidad": productoSeleccionado.value.Unidad + found.cantidad,
          });
        }
      }
      // console.log(productoSeleccionado.value)
    }
      break;
    default:
      break;
  }
}
async function handleBlur(option) {
  switch (option) {
    case 'prov':{
      let newValue = provInput.value.value.toString().padStart(4, '0');
      // console.log(newValue)
      provInput.value.value = newValue;
      console.log(newValue)
      if(newValue == '' || newValue == '0' || newValue == '00' || newValue == '000'  || newValue == '0000') {
        disableProdInput.value = true;
        prodInput.value = '';
      } else {
        //buscarproveedor aquí!!!
        var p = await getProveedor({ "Proveedor": provInput.value.value.toString().padStart(4, '0') });
        console.log(p)
        if (p.length > 0) {

          // proovedorSeleccionado.value = p;
          provInput.value.value = p[0].Proveedor;
          // se llena el arreglo de productos con los productos del proveedor seleccionado
          productos.value = await getProductosByProv(p[0].Proveedor);
          console.log(productos.value);
          disableProdInput.value = false;
          nextTick(() => {
            prodInput.value.focus();
          });
        } else {
          disableProdInput.value = true;
          prodInput.value.value = '';
          provInput.value.value = '';
          provInput.value.focus();
        }
      }
    }
      break;
    case 'prod':{
      let newValue = prodInput.value.value.toString().padStart(4, '0');
      // console.log(newValue)
      prodInput.value.value = newValue;
      console.log(newValue)
      let found = productos.value.find(p => p.Producto == provInput.value.value + prodInput.value.value);
      if (found != undefined) {
        productoSeleccionado.value = found;
        console.log(productoSeleccionado.value)
        console.log(productos.value);
        nextTick(() => {
          cantidadInput.value.select();
          cantidadInput.value.focus();
        });
      } else {
        productoSeleccionado.value = {};
        productoSeleccionado.value.Desc_Larga = 'PRODUCTO NO ENCONTRADO'
      }
    }
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
      console.log(v);
      if(v == '' || v == '0' || v == '00' || v == '000'  || v == '0000') {
        disableProdInput.value = true;
        prodInput.value = '';
      } else {
        disableProdInput.value = false;
      }
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
async function selectItem(p, option) {
  switch (option) {
    case 'proveedor':
      showModals.value.proveedor = false;
      provInput.value.value = p.Proveedor;
      productos.value = await getProductosByProv(p.Proveedor);
      console.log(productos.value);
      disableProdInput.value = false;
      nextTick(() => {
        prodInput.value.focus();
      });
      break;
    case 'producto':
      showModals.value.producto = false;
      prodInput.value.value = p.Producto.substring(4);
      productoSeleccionado.value = p;
      nextTick(() => {
        cantidadInput.value.select();
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
</style>