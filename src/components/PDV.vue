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
const total = ref('0.00');
const gridData = ref([]);
const datosVentaRef = ref(null);
const ticketRef = ref(null);
const footerRef = ref(null);
const ticketData = ref({
  gridData: [],
  clientData: {},
  total: '',
});
// const clientData = ref({});
function eventosTeclas(event, option) {
  event.preventDefault();
  switch (option) {
    case 'imprimir':
      ticketData.value.gridData = gridData.value;
      ticketData.value.clientData = datosVentaRef.value.selectedCliente;
      ticketData.value.total = total;
      ticketRef.value.ticketData = ticketData.value;
      ticketRef.value.printTicket();
      // window.print();
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
    gridData.value.push(newData);
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
      footerRef.value.listener('focusFooter');
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
      <Productos :gridData="gridData">
      </Productos>
    </div>
    <div class="foot">
      <Footer ref="footerRef" @datos-producto="updateGridData" :total="total" :gridData="gridData">
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
}

/* Make the Footer sticky to the bottom */
.foot {
  margin-top: auto;
}
.print-section {
  display: none;
}
@media print {
  .print-section {
    display: block;
  }

  /* Hide other parts of the page when printing */
  /* Adjust selectors as needed */
  header, footer, nav, .non-printable-section {
    display: none;
  }
}
</style>
