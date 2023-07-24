<script setup>
defineProps({
  total: {
    type: Number,
    required: true
  }
})

</script>

<template>
  <div class="barcode-section">
    <label for="barcodeInput">Cod. de barras:</label>
    <input type="text" id="barcodeInput" placeholder="Scan or enter barcode">

    <div>
      <span>Total:</span>
      <span id="totalPrice">$0.00</span>
    </div>
  </div>
</template>

<style scoped>
.barcode-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>