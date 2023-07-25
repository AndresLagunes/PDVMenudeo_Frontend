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
                <th 
                  v-for="header in headers" 
                  :key="header.value" 
                  @click="sortList(header.value)" 
                  :class="{ active: sortKey == header.value, [header.class]: header.class }"
                >
                  {{ header.text }}
                  <span class="arrow" :class="header.asc ? 'asc' : 'dsc'"></span>
                </th>
<!-- 
                <th @click="sortList('Cliente')" :class="{ active: sortKey == 'Cliente' }">
                  Cliente
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Sucursal')" class="fit-content" :class="{ active: sortKey == 'Sucursal' }">
                  Sucursal
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Rfc')" :class="{ active: sortKey == 'Rfc' }">
                  RFC
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('RazonSocial')" :class="{ active: sortKey == 'RazonSocial' }">
                  Razón Social
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('NombreCom')" :class="{ active: sortKey == 'NombreCom' }">
                  Nombre Comercial
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Lada')" :class="{ active: sortKey == 'Lada' }">
                  Lada
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Telefono1')" :class="{ active: sortKey == 'Telefono1' }">
                  Telefono 1
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Telefono2')" :class="{ active: sortKey == 'Telefono2' }">
                  Telefono 2
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Calle')" :class="{ active: sortKey == 'Calle' }">
                  Domicilio
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Referencia')" :class="{ active: sortKey == 'Referencia' }">
                  Referencia
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Colonia')" :class="{ active: sortKey == 'Colonia' }">
                  Colonia
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Pais')" :class="{ active: sortKey == 'Pais' }">
                  Pais
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Estado')" :class="{ active: sortKey == 'Estado' }">
                  Estado
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th>
                <th @click="sortList('Ciudad')" :class="{ active: sortKey == 'Ciudad' }">
                  Ciudad
                  <span class="arrow" :class="sortedbyASC ? 'asc' : 'dsc'"></span>
                </th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="c in clientesData" :key="c.cliente">
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
        { text: 'Cliente', value: 'Cliente', asc: true},
        { text: 'Sucursal', value: 'Sucursal', class: 'fit-content', asc: true},
        { text: 'RFC', value: 'Rfc', asc: true},
        { text: 'Razón Social', value: 'RazonSocial', asc: true},
        { text: 'Nombre Comercial', value: 'NombreCom', asc: true},
        { text: 'Lada', value: 'Lada', asc: true},
        { text: 'Telefono 1', value: 'Telefono1', asc: true},
        { text: 'Telefono 2', value: 'Telefono2', asc: true},
        { text: 'Domicilio', value: 'Calle', asc: true},
        { text: 'Referencia', value: 'Referencia', asc: true},
        { text: 'Colonia', value: 'Colonia', asc: true},
        { text: 'Pais', value: 'Pais', asc: true},
        { text: 'Estado', value: 'Estado', asc: true},
        { text: 'Ciudad', value: 'Ciudad', asc: true}
      ],
      cliente: {
        Cliente: '',
      },
      clientes: {
        Rfc: '',
        RazonSocial: '',
        NombreCom: ''
      },
      showModal: false,
      clientesData: [], //arreglo donde se guardan los clientes
      sortedbyASC: false,
      sortKey: '',
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
    },
    sortList(sortBy) {
      this.sortKey = sortBy;
      const headerItem = this.headers.find(header => header.value === sortBy);
      if (headerItem) {
        console.log(headerItem);
        headerItem.asc = headerItem.asc ? false : true;
        // Do something with the found item
      } else {
        console.log('Item not found');
      }
      console.log(this.headers)
      if (this.sortedbyASC) {
        this.clientesData.sort((x, y) => (x[sortBy] > y[sortBy] ? -1 : 1));
        this.sortedbyASC = false;
      } else {
        this.clientesData.sort((x, y) => (x[sortBy] < y[sortBy] ? -1 : 1));
        this.sortedbyASC = true;
      }
    },
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

.fit-content {
  width: 1%;
  /* This helps in shrinking the cell to its content */
  white-space: nowrap;
  /* Prevents the content from wrapping to the next line */
}

form label {
  font-size: 12px;
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
</style>