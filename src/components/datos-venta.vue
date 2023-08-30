<template>
  <div id="datosVenta" class="grid-container">
    <!-- row 1 -->
    <div class="grid-item">
      <!-- cliente -->
      <div class="grid-item-child">
        <div class="label-div">
          <label for="cliente">Cliente: </label>
        </div>
        <div class="content-div">
          <input class="smaller" ref="clienteInput"
            type="text" 
            id="cliente" 
            v-model="cliente.Cliente" 
            maxlength="9" 
            pattern="\d*" 
            @input="inputCliente"
            @keyup.enter="buscarClienteRfc"
            @keyup.f2="showModal = true">
          <button @click="buscarClienteRfc()">
            <v-icon>mdi-magnify</v-icon>
          </button>
          <button @click="showModal = true">
            <v-icon>mdi-list-box-outline</v-icon>
          </button>
        </div>
      </div>
      <!-- Input RFC -->
      <div class="grid-item-child">
        <div class="label-div">
          <label for="RFC">RFC:</label>
        </div>
        <div class="content-div">
          <input type="text" id="RFC" class="mediumer" readonly v-model="selectedCliente.Rfc">
        </div>
      </div>
      <!-- Input Fecha -->
      <div class="grid-item-child">
        <div class="label-div">
          <label for="fecha">Fecha:</label>
        </div>
        <div class="content-div">
          <input type="date" id="fecha" class="smaller" readonly v-model="today">
        </div>
      </div>
    </div>

    <!-- row 2 -->
    <div class="grid-item">
      <!-- nombre -->
      <div class="grid-item-child">
        <div class="label-div">
          <label for="nombre">Nombre:</label>
        </div>
        <div class="content-div">
          <input type="text" id="nombre" class="widthcienporcien" readonly v-model="selectedCliente.RazonSocial">
        </div>
      </div>
      <!-- Input Pedido -->
      <div class="grid-item-child">
        <div class="label-div">
          <label for="pedido">Pedido:</label>
        </div>
        <div class="content-div">
          <input type="text" id="pedido" class="smaller">
        </div>
      </div>
    </div>

    <!-- row 3 -->
    <div class="grid-item span-column">
      <div class="grid-item-child">
        <div class="label-div">
          <label for="direccion">Dirección:</label>
        </div>
        <div class="content-div">
          <textarea id="direccion" class="widthcienporcien" readonly v-model="direccionCompuesta" rows="3"> </textarea>
        </div>
      </div>
    </div>
  </div>

  <!-- Vuetify Dialog for Modal -->
  <v-dialog v-model="showModal" max-width="90%">
    <v-card>
      <v-card-title class="headline">Búsqueda de Clientes</v-card-title>
      <v-card-text>
        <hr class="solid">
        <form @submit.prevent="buscarClienteGeneral">
          <div class="formClientes">
            <label for="pBusqueda">Búsqueda por RFC, Nombre Comercial o Razón social (Escriba al menos 5 caracteres):</label>
            <input type="text" id="pBusqueda" 
              @keyup.enter="buscarClienteGeneral"
              v-model="pBusqueda">
            <select v-model="tipoCliente" class="sel">
              <option v-for="tC in tiposDeCliente" :key="tC.value" :value="tC.value">
                {{ tC.text }}
              </option>
            </select>
            <button type="submit">
              <v-icon>mdi-magnify</v-icon>
            </button>
          </div>

        </form>
        <hr class="solid">
        <div class="table-container">
          <v-table density="compact" class="tabla">
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
                <td>{{ c.Direccion }}</td>
                <td>{{ c.Referencia }}</td>
                <td>{{ c.Colonia }}</td>
                <td>{{ c.Ciudad }}</td>
                <!-- <td>{{ c.Pais }}</td>
                <td>{{ c.Estado }}</td> -->
              </tr>
            </tbody>
          </v-table>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-pagination
          v-model="pagination.page"
          :length="Math.ceil(pagination.totalItems / pagination.rowsPerPage)"
          @update:model-value="pageChanged"
          @next="pageChanged"
          @prev="pageChanged"
          @last="pageChanged"
          @first="pageChanged"
          style="width: 80%;"
        ></v-pagination>
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
        { text: 'Domicilio', value: 'Domicilio', asc: true },
        { text: 'Referencia', value: 'Referencia', asc: true },
        { text: 'Colonia', value: 'Colonia', asc: true },
        { text: 'Ciudad', value: 'Ciudad', asc: true },
        // { text: 'Estado', value: 'Estado', asc: true },
        // { text: 'Ciudad', value: 'Ciudad', asc: true }
      ],
      cliente: {
        Cliente: '285000001',
      },
      clientes: {
        Rfc: '',
        RazonSocial: '',
        NombreCom: ''
      },
      tiposDeCliente: [
        { text: 'Menudeo', value: 'N' },
        { text: 'Mayoreo Contado', value: 'M' },
        { text: 'Mayoreo Crédito', value: 'C' },
        { text: 'Mayoreo Iva Incluido', value: 'I' },
      ],
      pagination: {
        page: 1,
        rowsPerPage: 9, // Number of rows per page
        totalItems: 0 // Total number of items
      },
      pBusqueda: '',
      tipoCliente: 'N',
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
    pageChanged() {
      this.buscarClienteGeneral();
    },
    buscarClientes() {
      this.clientesData = [];
      axios.post('http://10.105.151.6:8000/api/consultaClientes/', this.clientes)
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
    buscarClienteRfc() {
      if(this.cliente.Cliente != '' && this.cliente.Cliente.length == 9)
      {
        axios.post('http://10.105.151.6:8000/api/consultaCliente/', this.cliente)
        .then(response => {
          // handle success
          if(response.data.cliente){
            this.selectedCliente = response.data.cliente;
            this.direccionCompuesta = 
              this.selectedCliente.Direccion + ' ' + this.selectedCliente.Referencia + '\n' +
              this.selectedCliente.CP + ' ' + this.selectedCliente.Ciudad;
            console.log(response.data);
            this.$emit('listener', 'focusFooter');
          } else {
            console.log('sin datos')
            this.selectedCliente.RazonSocial = 'CLIENTE NO ENCONTRADO';
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
        console.log('no se puede')
      }
    },
    buscarClienteGeneral() {
      if (this.pBusqueda.length > 4) {
        axios.post('http://10.105.151.6:8000/api/consultaClientesGeneral/', {
          "pBusqueda": this.pBusqueda,
          "tipoCliente": this.tipoCliente,
          "page": this.pagination.page,
          "rowsPerPage": this.pagination.rowsPerPage
        })
          .then(response => {
            // handle success
            this.clientesData = response.data.clientes;
            this.pagination.totalItems = response.data.totalItems;
            // console.log(this.clientesData);
          })
          .catch(error => {
            // handle error
            console.log(error);
          })
          .then(() => {
            // always executed
          });
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
        cliente.Direccion + ' ' + cliente.Referencia + '\n' +
        cliente.CP + ' ' + cliente.Ciudad;
        // this.selectedCliente.Calle + " " + this.selectedCliente.NoExt 
        // + (this.selectedCliente.NoInt != ''? " - " + this.selectedCliente.NoInt : "") 
        // + this.selectedCliente.Referencia + "\n" + this.selectedCliente.Colonia + " " 
        // + this.selectedCliente.CP + ",\n " + this.selectedCliente.Estado;
      this.showModal = false;
      this.clientesData = [];
      this.clientes.NombreCom = "";
      this.clientes.RazonSocial = "";
      this.clientes.Rfc = "";
      this.sortKey = '';
      console.log(this.selectedCliente);
      this.$emit('listener', 'focusFooter');
    },
    inputCliente(event) {
      event.target.value = event.target.value.replace(/[^\d]/g, '');
      this.selectedCliente = {};
      this.$emit('listener', 'disableFooter');
      this.direccionCompuesta = '';
    },
    focusCliente(){
      this.$refs.clienteInput.focus();
      this.$refs.clienteInput.select();
    },
    reiniciar(){
      this.selectedCliente = {};
      this.direccionCompuesta = '';
      this.$refs.clienteInput.focus();
      this.$refs.clienteInput.select();
    }
  },
  watch:{
    // eslint-disable-next-line no-unused-vars
    showModal:function(newValue, old){
      if(!newValue){        
        this.clientesData.length = 0;
        this.pagination.totalItems = 0;
        this.pagination.page = 1;
      }
    }
 },
 emits: ["listener"],
}

</script>
<style scoped>
.grid-container {
  /* display: grid; */
  /* grid-template-columns: repeat(3, 1fr); */
  /* 3 columns of equal width */
  /* gap: 2px; */
  /* Gap between rows and columns */
  width: 99vw;
  padding: 1px;
  background-color: rgba(178, 201, 232, 1) !important;
  border-color: rgba(0, 0, 0, 0.301);
  border-style: inset;
}

.grid-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  /* padding: 1px; */
  /* Padding inside each grid item */
  /* display: inline; */
  /* align-items: center; */
  /* Center content inside grid items */
  /* flex-direction: row; */
}

.grid-item-child {
  width: calc(100% / 3);
  display: flex;
  /* justify-content: space-between; */
}

.label-div {
  width: 15%;
  min-width: 70px;
}
.content-div {
  width: 85%;
}

.span-column {
  /* grid-column: span 2; */
  /* This will make the grid item span 2 columns */
  /* align-items: end; */
}

.grid-item label {
  /* width: 20%; */
  font-weight: bold;
  font-size: 12px;
  text-align: center;  
}

.span-column label {
  /* width: 10%; */
  font-size: 12px;
}
.grid-item textarea, .grid-item input  {
  /* flex: 3; */
  /* Allow the input/textarea to take up more space than the label */
  font-size: 12px;
  background-color: white;
}
#datosVenta .smaller {
    width: 90px; /* Adjust this value as needed */
}
#datosVenta .mediumer {
  width: 120px; /* Adjust this value as needed */
  padding-right: 5px;
  text-align: right;
}
#datosVenta .widthcienporcien {
  width: 100%;
}
.table-container {
  width: 100%;
  /* Adjust this as needed */
  /* height: 400px; */
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
.table-container .tabla .v-table__wrapper {
  max-height: 70vh !important;
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
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-radius: 2px;
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
  border: 1px solid rgba(0, 0, 0, 0.7);
  font-size: 12px;
  background-color: white;
}

#datosVenta button {
  margin-left: 5px;
  border: 2px solid rgba(0, 0, 0, 0.6);
  border-radius: 2px;
  color: rgba(0, 0, 0, 1);
}

.sel {
  border: 1px solid rgba(0, 0, 0, 0.7);
  border-radius: 2px;
  font-size: 13px;
  -webkit-appearance: auto !important;
}
</style>