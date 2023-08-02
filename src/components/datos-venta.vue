<template>
  <div id="datosVenta" class="grid-container">
    <div class="grid-item">
      <label for="cliente">Cliente:</label>
      <input 
        type="text" 
        id="cliente" 
        v-model="cliente.Cliente" 
        maxlength="9" 
        pattern="\d*" 
        @input="inputCliente"
        @keyup.enter="buscarCliente"
        @keyup.f2="showModal = true">
      <button @click="buscarCliente()">
        <v-icon>mdi-magnify</v-icon>
      </button>
      <button @click="showModal = true">
        <v-icon>mdi-list-box-outline</v-icon>
      </button>
    </div>
    <!-- Input RFC -->
    <div class="grid-item">
      <label for="RFC">RFC:</label>
      <input type="text" id="RFC" readonly v-model="selectedCliente.Rfc">
    </div>
    <!-- Input Fecha -->
    <div class="grid-item">
      <label for="fecha">Fecha:</label>
      <input type="date" id="fecha" readonly v-model="today">
    </div>
    <div class="grid-item">
      <label for="nombre">Nombre:</label>
      <input type="text" id="nombre" readonly v-model="selectedCliente.RazonSocial">
    </div>
    <div class="grid-item">

    </div>
    <!-- Input Pedido -->
    <div class="grid-item">
      <label for="pedido">Pedido:</label>
      <input type="text" id="pedido">
    </div>

    <div class="grid-item span-column">
      <label for="direccion">Dirección:</label>
      <textarea id="direccion" readonly v-model="direccionCompuesta" rows="3"> </textarea>
    </div>
  </div>

  <!-- Vuetify Dialog for Modal -->
  <v-dialog v-model="showModal" max-width="90%">
    <v-card>
      <v-card-title class="headline">Búsqueda de Clientes</v-card-title>
      <v-card-text>
        <hr class="solid">
        <form @submit.prevent="buscarClientes">
          <div class="formClientes">
            <!-- Input RFC -->

            <label for="Rfc">RFC:</label>
            <input type="text" id="Rfc" v-model="clientes.Rfc">
            <!-- Input NombreCom -->
            <label for="NombreCom">Nombre Comercial:</label>
            <input type="text" id="NombreCom" v-model="clientes.NombreCom">
            <!-- Input RazonSocial -->
            <label for="RazonSocial">Razón Social:</label>
            <input type="text" id="RazonSocial" v-model="clientes.RazonSocial">
            <button type="submit">
              <v-icon>mdi-magnify</v-icon>
            </button>
          </div>

        </form>
        <hr class="solid">
        <div class="table-container">
          <v-table fixed-header density="compact">
            <thead>
              <tr>
                <th v-for="header in headers" :key="header.value" @click="sortList(header.value)"
                  :class="{ active: sortKey == header.value, [header.class]: header.class }">
                  {{ header.text }}
                  <span class="arrow" :class="header.asc ? 'asc' : 'dsc'"></span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in clientesData" :key="c.cliente" @click="selectCliente(c)">
                <td>{{ c.Cliente }}</td>
                <td class="fit-content">{{ c.Sucursal }}</td>
                <td>{{ c.Rfc }}</td>
                <td>{{ c.RazonSocial }}</td>
                <td>{{ c.NombreCom }}</td>
                <td>{{ c.Lada }}</td>
                <td>{{ c.Telefono1 }}</td>
                <td>{{ c.Telefono2 }}</td>
                <!-- domicilio combinado -- COMENTAR -->
                <td>{{ c.Calle + " " + c.NoExt + (c.NoInt != "" ? "-" + c.NoInt : "") }}</td>
                <td>{{ c.Referencia }}</td>
                <td>{{ c.Colonia }}</td>
                <td>{{ c.Pais }}</td>
                <td>{{ c.Estado }}</td>
                <td>{{ c.Ciudad }}</td>
              </tr>
            </tbody>
          </v-table>
        </div>
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
      headers: [
        { text: 'Cliente', value: 'Cliente', asc: true },
        { text: 'Sucursal', value: 'Sucursal', class: 'fit-content', asc: true },
        { text: 'RFC', value: 'Rfc', asc: true },
        { text: 'Razón Social', value: 'RazonSocial', asc: true },
        { text: 'Nombre Comercial', value: 'NombreCom', asc: true },
        { text: 'Lada', value: 'Lada', asc: true },
        { text: 'Telefono 1', value: 'Telefono1', asc: true },
        { text: 'Telefono 2', value: 'Telefono2', asc: true },
        { text: 'Domicilio', value: 'Calle', asc: true },
        { text: 'Referencia', value: 'Referencia', asc: true },
        { text: 'Colonia', value: 'Colonia', asc: true },
        { text: 'Pais', value: 'Pais', asc: true },
        { text: 'Estado', value: 'Estado', asc: true },
        { text: 'Ciudad', value: 'Ciudad', asc: true }
      ],
      cliente: {
        Cliente: '285000001',
      },
      clientes: {
        Rfc: '',
        RazonSocial: '',
        NombreCom: ''
      },
      selectedCliente: {},
      showModal: false,
      clientesData: [], //arreglo donde se guardan los clientes
      sortedbyASC: false,
      sortKey: '',
      today: new Date().toISOString().slice(0, 10),
      direccionCompuesta: '',
    };
  },
  methods: {
    buscarClientes() {
      this.clientesData = [];
      axios.post('http://127.0.0.1:8000/api/consultaClientes/', this.clientes)
        .then(response => {
          // handle success
          this.clientesData = response.data.clientes;
          console.log(this.clientesData);
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
      if(this.cliente.Cliente != '' && this.cliente.Cliente.length == 9)
      {
        axios.post('http://127.0.0.1:8000/api/consultaCliente/', this.cliente)
        .then(response => {
          // handle success
          if(response.data.cliente.length > 0){
            this.selectedCliente = response.data.cliente[0];
            this.direccionCompuesta = 
              this.selectedCliente.Calle + " " + this.selectedCliente.NoExt 
              + (this.selectedCliente.NoInt != ''? " - " + this.selectedCliente.NoInt : "") 
              + this.selectedCliente.Referencia + "\n" + this.selectedCliente.Colonia + " " 
              + this.selectedCliente.CP + ",\n " + this.selectedCliente.Estado;
            console.log(response.data);
          } else {
            console.log('sin datos')
          }
        })
        .catch(error => {
          // handle error
          console.log(error);
        })
        .then(() => {
          // always executed
        });
      } else {
        console.log('nelpa')
      }
    },
    sortList(sortBy) {
      this.sortKey = sortBy;
      const headerItem = this.headers.find(header => header.value === sortBy);
      if (headerItem) {
        headerItem.asc = headerItem.asc ? false : true;
        // Do something with the found item
      } else {
        console.log('Item not found');
      }
      if (this.sortedbyASC) {
        this.clientesData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.clientesData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
    //método que reinicia el modal
    selectCliente(cliente) {
      this.selectedCliente = cliente;
      this.cliente.Cliente = this.selectedCliente.Cliente;
      this.direccionCompuesta = 
        this.selectedCliente.Calle + " " + this.selectedCliente.NoExt 
        + (this.selectedCliente.NoInt != ''? " - " + this.selectedCliente.NoInt : "") 
        + this.selectedCliente.Referencia + "\n" + this.selectedCliente.Colonia + " " 
        + this.selectedCliente.CP + ",\n " + this.selectedCliente.Estado;
      this.showModal = false;
      this.clientesData = [];
      this.clientes.NombreCom = "";
      this.clientes.RazonSocial = "";
      this.clientes.Rfc = "";
      this.sortKey = '';
      console.log(this.selectedCliente);
    },
    inputCliente(event) {
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      this.selectedCliente = {};
      this.direccionCompuesta = '';
    },
  }
}

</script>
<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* 3 columns of equal width */
  gap: 2px;
  /* Gap between rows and columns */
  padding: 1px;
  /* Padding around the grid */
  background-color: rgba(178, 201, 232, 1) !important;
  border-color: rgba(0, 0, 0, 0.301);
  border-style: inset;
}

.grid-item {
  padding: 1px;
  /* Padding inside each grid item */
  display: inline-flex;
  /* align-items: center; */
  justify-content: space-between;
  /* Center content inside grid items */
  flex-direction: row;
}

.span-column {
  grid-column: span 2;
  /* This will make the grid item span 2 columns */
  align-items: end;
}

.grid-item label {
  width: 20%;
  font-weight: bold;
  font-size: 12px;
  text-align: center;
}

.span-column label {
  width: 10%;
  font-size: 12px;
}
.grid-item textarea, .grid-item input  {
  flex: 3;
  /* Allow the input/textarea to take up more space than the label */
  font-size: 12px;
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

.fit-content {
  width: 1%;
  /* This helps in shrinking the cell to its content */
  white-space: nowrap;
  /* Prevents the content from wrapping to the next line */
}

form label {
  font-size: 13px;
}

form input {
  font-size: 13px;
}

.formClientes>label {
  margin-right: 6px;
  margin-left: 6px;
}

.formClientes>input {
  border: 2px solid rgba(0, 0, 0, 0.25);
  border-radius: 5px;
}

.formClientes>button {
  margin-left: 50px;
  border: 2px solid rgba(0, 0, 0, 0.411);
  border-radius: 5px;
  color: rgba(0, 0, 0, 0.411);
}

#datosVenta label {
  margin-right: 6px;
  margin-left: 6px;
}

#datosVenta input,
textarea {
  border: 1px solid rgba(0, 0, 0, 0.726);
  font-size: 12px;
  background-color: white;
}

#datosVenta button {
  /* margin-left: 5px; */
  border: 2px solid rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  color: rgba(0, 0, 0, 1);
}
</style>