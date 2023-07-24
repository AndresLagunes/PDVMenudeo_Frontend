<template>
  <div id="datosVenta">
    <!-- Row 1 -->
    <div>
      <label for="cliente">Cliente:</label>
      <input type="number" id="cliente" v-model="cliente.Cliente">
      <button @click="buscarCliente()">
        <v-icon>mdi-magnify</v-icon>
      </button>
      <button @click="showModal = true">
        <v-icon>mdi-list-box-outline</v-icon>
      </button>
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

  <!-- Vuetify Dialog for Modal -->
  <v-dialog v-model="showModal" max-width="290">
    <v-card>
      <v-card-title class="headline">Búsqueda de clientes</v-card-title>
      <v-card-text>
        <form @submit.prevent="verClientes">
          <!-- Input RFC -->
          <div>
            <label for="Rfc">RFC:</label>
            <input type="text" id="Rfc" v-model="clientes.Rfc">
          </div>
          <!-- Input NombreCom -->
          <div>
            <label for="NombreCom">Nombre Comercial:</label>
            <input type="text" id="NombreCom" v-model="clientes.NombreCom">
          </div>
          <!-- Input RazonSocial -->
          <div>
            <label for="RazonSocial">Razón Social:</label>
            <input type="text" id="RazonSocial" v-model="clientes.RazonSocial">
          </div>
          <button type="submit">
            <v-icon>mdi-magnify</v-icon>
          </button>
        </form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="showModal = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      showModal: false,
      cliente: {
        Cliente: '',
      },
      clientes: {
        Rfc: '',
        RazonSocial: '',
        NombreCom: ''
      }
    };
  },
  methods: {
    verClientes() {
      axios.post('http://127.0.0.1:8000/api/consultaClientes/', this.clientes)
        .then(response => {
          // handle success
          console.log(response);
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
      this.showModal = true;
    },
    buscarCliente() {
      axios.post('http://127.0.0.1:8000/api/consultaCliente/', this.cliente)
        .then(response => {
          // handle success
          console.log(response);
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
      this.showModal = true;
    }
  }

}
</script>
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