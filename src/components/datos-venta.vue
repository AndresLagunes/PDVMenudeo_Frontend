<script setup>
defineProps({
//   msg: {
//     type: String,
//     required: true
//   }
})

</script>

<template>
    <div id="datosVenta">
        <!-- Row 1 -->
    <div>
        <!-- Input Cliente -->
        <div>
            <label for="cliente">Cliente:</label>
            <input type="number" id="cliente">
            <button> <v-icon name="co-magnifying-glass" /></button>
        </div>
        <!-- Input RFC -->
        <div>
            <label for="RFC">RFC:</label>
            <input type="number" id="RFC">
        </div>
        <!-- Input Fecha -->
        <div>
            <label for="fecha">Fecha:</label>
            <input type="number" id="fecha">
        </div>
    </div>
    <!-- Row 2 -->
    <div>
        <!-- Input Nombre -->
        <div>
            <label for="nombre">Nombre:</label>
            <input type="text" id="nombre">
        </div>
        <!-- Input Pedido -->
        <div>
            <label for="pedido">Pedido:</label>
            <input type="text" id="pedido">
        </div>
    </div>

    <!-- Row 3 -->
    <div>
        <!-- Input Dirección -->
        <div>
            <label for="direccion">Dirección:</label>
            <input type="text" id="direccion">
        </div>
    </div>
    </div>
</template>

<style scoped>
#datosVenta {
    display: flex;
    flex-direction: column;
    /* This stacks the child divs (rows) vertically */
    gap: 16px;
    /* Space between rows; you can adjust this as needed */
}

/* Row Styles */
#datosVenta>div {
    display: flex;
    flex-direction: row;
    /* This lays out the child divs (inputs) horizontally */
    gap: 16px;
    /* Space between inputs; you can adjust this as needed */
    align-items: center;
    /* Vertically centers the content (helpful when there are mixed content sizes) */
}
</style>