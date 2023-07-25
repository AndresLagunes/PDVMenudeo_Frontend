<script setup>
defineProps({
//   msg: {
//     type: String,
//     required: true
//   }
})
import DatosVenta from './datos-venta.vue';
import Footer from './footer-item.vue';
import Productos from './productos-item.vue'

const gridColumns = ['name', 'power']
const gridData = [
    { name: 'Chuck Norris', power: Infinity },
    { name: 'Bruce Lee', power: 9000 },
    { name: 'Jackie Chan', power: 7000 },
    { name: 'Jet Li', power: 8000 }
]
const total = 0;

</script>

<template>
    <DatosVenta>
    </DatosVenta>
    <br>

    <div id="productos">
        <Productos 
            :data="gridData" 
            :columns="gridColumns" >
        </Productos>
    </div>

    <div>
        <Footer
            :total="total">
        </Footer>
    </div>

    <div>

    </div>
</template>

<style scoped>
/* Container Styles */



</style>
