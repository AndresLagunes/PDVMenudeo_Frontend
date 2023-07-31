<script setup>
import { ref } from 'vue';
defineProps({
  //   msg: {
  //     type: String,
  //     required: true
  //   }
})
import DatosVenta from './datos-venta.vue';
import Footer from './footer-item.vue';
import Productos from './productos-item.vue'

const total = ref('');
const gridData = ref([]); // This will be updated when Footer emits new data
const updateGridData = (newData) => {
  gridData.value.push(newData);
  total.value = 0;
  gridData.value.forEach(gD => {
    total.value += gD.cantidad * gD.producto.Precio1;
  });
  console.log(total.value)
};

</script>

<template>
  <div class="mainContainer">
    <div>
      <DatosVenta>
      </DatosVenta>
    </div>
    <div id="productos">
      <Productos :gridData="gridData">
      </Productos>
    </div>
    <br>
    <div class="foot">
      <Footer @datos-producto="updateGridData" :total="total">
      </Footer>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the root container spans the entire viewport height */
.mainContainer { 
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Make the Footer sticky to the bottom */
.foot {
  position: sticky;
  bottom: 0;
}

</style>
