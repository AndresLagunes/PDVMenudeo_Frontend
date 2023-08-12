<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  mounted() {
    document.addEventListener('keydown', this.preventFunctionKeys);
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.preventFunctionKeys);
  },
  methods: {
    preventFunctionKeys(event) {
      // Check if the pressed key is F1 (keyCode: 112)
      switch (event.keyCode) {
        case 9: //tab
          event.preventDefault();
          break;
        case 112: // F1
          event.preventDefault();
          break;
        case 113: // F2
          event.preventDefault();
          break;
        case 114: // F3
          event.preventDefault();
          break;
        case 115: // F4
          event.preventDefault();
          break;
        case 116: // F5
          event.preventDefault();
          break;
        case 117: // F6
          event.preventDefault();
          break;
        case 118: // F7
          event.preventDefault();
          break;
        case 119: // F8
          event.preventDefault();
          break;
        case 120: // F9
          event.preventDefault();
          break;
        case 121: // F10
          event.preventDefault();
          break;
        case 122: // F11
          event.preventDefault();
          break;
        case 123: // F12
          event.preventDefault();
          break;
        default:
          // Do nothing for other keys
          break;
      }
      // You can add more conditions for other function keys if needed
    }
  }
}
</script>

<style>
  .v-toast__item {
    border-radius: 0 !important;
  }
</style>