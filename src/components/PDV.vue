<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
defineProps({
  //   msg: {
  //     type: String,
  //     required: true
  //   }
});
import DatosVenta from './datos-venta.vue';
import Footer from './footer-item.vue';
import Productos from './productos-item.vue'
import TicketItem from './ticket-item.vue';
import {useToast} from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';
import { nextTick } from 'vue';

onMounted(() => {
  document.addEventListener('keyup', globalKeyupHandler);
});

onUnmounted(() => {
  document.removeEventListener('keyup', globalKeyupHandler);
});
function globalKeyupHandler(event) {

  switch (event.key) {
    case 'F3':
      eventosTeclas(event, 'imprimir');
      break;
    case 'F6':
      eventosTeclas(event, 'cantidad');
      break;
    case 'F7':
      eventosTeclas(event, 'cambiarCliente');
      break;
    default:
      break;
  }
}
const $toast = useToast(); // toaster de notificaciones
const total = ref('0.00');
const gridData = ref([]);
const datosVentaRef = ref(null);
const productosRef = ref(null);
const ticketRef = ref(null);
const footerRef = ref(null);
const clientSelected = ref(false);
const ticketData = ref({
  gridData: [],
  clientData: {},
  total: '',
});
// const clientData = ref({});
function eventosTeclas(event, option) {
  event.preventDefault();
  switch (option) {
    case 'imprimir':{
      let clienteOk = datosVentaRef.value.selectedCliente.Cliente != undefined;
      let productosOk = gridData.value.length > 0;
      if(clienteOk && productosOk) {
        // conformación de compra
        if (true) {
          ticketData.value.gridData = gridData.value;
          ticketData.value.clientData = datosVentaRef.value.selectedCliente;
          ticketData.value.total = total;
          ticketRef.value.ticketData = ticketData.value;
          setTimeout(() => {
            ticketRef.value.printTicket();
          }, 100);
        }
      } else {
        if(!clienteOk && !productosOk) {
          // eslint-disable-next-line no-unused-vars
          let cantPrint = $toast.warning('No se puede imprimir el ticket sin haber seleccionado un cliente', {
            // duration: 200
            position: 'top-right'
          });
          // eslint-disable-next-line no-unused-vars
          let cantPrint2 = $toast.warning('No se puede imprimir el ticket sin productos registrados', {
            // duration: 200
            position: 'top-right'
          });
        } else if (clienteOk && !productosOk) {
          // eslint-disable-next-line no-unused-vars
          let cantPrint = $toast.warning('No se puede imprimir el ticket sin productos registrados', {
            // duration: 200
            position: 'top-right'
          });
        } else if (!clienteOk && productosOk) {
          // eslint-disable-next-line no-unused-vars
          let cantPrint = $toast.warning('No se puede imprimir el ticket sin haber seleccionado un cliente', {
            // duration: 200
            position: 'top-right'
          });
        }
      }
    }
      break;

    case 'cantidad':
      // console.log(footerRef.value)
      footerRef.value.listener('cantidad');
      break;
  
    case 'cambiarCliente':
      datosVentaRef.value.focusCliente();
      break;
  
    default:
      break;
  }
}
const updateGridData = (newData) => {
  // Check if the element already exists in the gridData based on the Producto key
  const isDuplicate = gridData.value.some(item => item.producto.Producto === newData.producto.Producto);
  if (!isDuplicate) {
    // If it's not a duplicate, push the new data
    if(newData.cantidad > 0) gridData.value.push(newData);
    nextTick(() => {
      productosRef.value.actualizarVista();
    });

  } else {
    // Handle the duplicate case. For example, you can update the existing item or ignore it.
    // This is just an example. Adjust based on your requirements.
    const existingItem = gridData.value.find(item => item.producto.Producto === newData.producto.Producto);
    // Update the existing item's properties if needed
    existingItem.cantidad = newData.cantidad;
    if (existingItem.cantidad == 0){
      let existingItemIndex = gridData.value.findIndex(item => item.producto.Producto === newData.producto.Producto);
      gridData.value.splice(existingItemIndex, 1);
    }
  }

  let totalAux = 0;
  gridData.value.forEach(gD => {
    totalAux += gD.cantidad * gD.producto.Precio1;
    // console.log(gD.producto.Precio1);
  });

  total.value = totalAux.toFixed(2).toString();
  // console.log(gridData)
};

const listenToDatosVenta = (option) => {
  switch (option) {
    case 'focusFooter':
      clientSelected.value = true;
      footerRef.value.listener('focusFooter');
      break;
    case 'disableFooter':
      clientSelected.value = false;
      break;
    default:
      break;
  }
}
</script>

<template>
  <div class="mainContainer non-printable-section" @keyup.f3="eventosTeclas($event, 'cantidad')">
    <div>
      <DatosVenta ref="datosVentaRef" @listener="listenToDatosVenta">
      </DatosVenta>
    </div>
    <div id="productos">
      <Productos ref="productosRef" :gridData="gridData">
      </Productos>
    </div>
    <div class="foot" :class="{ 'disable-interaction': !clientSelected }">
      <Footer ref="footerRef" @datos-producto="updateGridData" 
        :total="total" 
        :gridData="gridData" >
      </Footer>
    </div>
  </div>
  <div class="print-section">
    <TicketItem ref="ticketRef"/>
  </div>
</template>

<style scoped>
/* Ensure the root container spans the entire viewport height */
.mainContainer { 
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Allow the main content to grow and take up available space */
#productos {
  flex: 1;
  overflow-y: auto; /* Add vertical scrollbar if content overflows */
  max-height: calc(100vh - 44px - 124px); /* Adjust based on the height of your footer */
}
.disable-interaction {
  opacity: 0.5;
  background-color: rgb(0, 0, 0); 
  z-index: 1000; /* Make sure this is higher than the z-index of any elements in the Footer */
  pointer-events: none; /* This will catch all pointer events */
}

/* Make the Footer sticky to the bottom */
.foot {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.print-section {
  display: none;
}
@media print {
  .print-section {
    display: block;
    max-width: 80mm; /* Set the maximum width to 80mm */
    margin: 0 auto; /* Center the content if it's less than 80mm */
  }

  /* Hide other parts of the page when printing */
  /* Adjust selectors as needed */
  header, footer, nav, .non-printable-section {
    display: none;
  }
}
</style>
