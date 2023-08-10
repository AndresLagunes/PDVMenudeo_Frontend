<template>
  <div>
    <svg ref="barcode"></svg>
  </div>
</template>

<script>
import JsBarcode from 'jsbarcode';

export default {
  props: {
    value: {
      type: String,
      required: true
    }
  },
  mounted() {
    this.generateBarcode();
  },
  watch: {
    value() {
      this.generateBarcode();
    }
  },
  methods: {
    generateBarcode() {
      JsBarcode(this.$refs.barcode, this.value, {
        format: "CODE39", // Choose the desired format
        width: 3,
        height: 100,
        displayValue: true,
        text: `*${this.value}*`,
        // textAlign: "center",
      });
    }
  }
}
</script>
