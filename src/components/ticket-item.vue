<template>
  <div>
    <!-- Ticket Content -->
    <div class="ticket">
      <h5 class="centeredContent">TONY TIENDAS S.A. DE C.V.</h5>
      <p class="ticketInfoSmall">
        AV. URANO 585 B Col FRACC. JARDINES DE MOCAMBO C.P. 94299 BOCA DEL RIO, VER 9231700
        Se expide en:
            SUCURSAL: 285 QA LAB SUC. VER NORTE
        AV. DR. RAFAEL CUERVO 1279 VILLA RICA 1 C.P. 91800
        VERACRUZ, VERACRUZ RFC TTI961202IM1 Tel. 932-7891
      </p>
      <p class="ticketInfoMed">
        601 REGIMEN GENERAL DE LEY PERSONAS MORALES
      </p>
      <br>
      <p class="ticketInfoMed centeredContent">
        MOSTRADOR MENUDEO
      </p>
      <div class="flexContainer">
        <p class="ticketInfoMed toLeft">Venta: {{ticketData.barcodeValue}}</p>
        <p class="ticketInfoMed toRight">{{ today }}</p>
      </div>

      <div class="clientContainer">
        <p>RFC  : {{ ticketData.clientData.Rfc }}</p>
        <p>Regimen Fiscal  : {{ ticketData.clientData.RegimenFiscal }}</p>
        <p>Uso CFDI  : {{ ticketData.clientData.UsoCFDI }} - SIN EFECTOS FISCALES</p>
        <p>Nombre  : {{ ticketData.clientData.NombreCom }}</p>
        <br>
        <p>Domicilio:{{ `${ticketData.clientData.Calle} ${ticketData.clientData.NoExt} ${ticketData.clientData.Colonia} ${ticketData.clientData.Estado} ${ticketData.clientData.Ciudad} ${ticketData.clientData.CP}` }}</p>
      </div>
      <div class="borderSeparator"></div>
      <div class="productosContainer ticketInfoMed">
        <div v-for="gD in ticketData.gridData" :key="gD.producto.Producto">
          <p>{{ `   ${gD.cantidad} x    ${parseFloat(gD.producto.Precio1).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }}</p>
          <div class="flexContainer">
            <p class="toLeft">{{ `${gD.producto.Desc_Corta}` }}</p><p class="toRight">{{ `${parseFloat(gD.producto.Precio1 * gD.cantidad).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }}</p>
          </div>
        </div>
      </div>
      <div class="borderSeparator"></div>
      <p class="toRight ticketInfoMed"> T O T A L {{ "        " + parseFloat(ticketData.total).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}</p>
      <br><br>
      <p>IVA 16% {{ parseFloat(ticketData.total * 0.16).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}}</p>
      <p>E= Exento</p>
      <p>*= Oferta</p>
      <p>{{ ticketData.gridData.length }} Artículos</p>
      <!-- <div>
      -------------------------------------<br>
      SIRVE<br>
      <img src="./IMG_20230817_181926.jpg" alt="" style="width: 100%;"><br>
      -------------------------------------<br>
      SIRVE<br>
      <img src="./descarga.gif" alt="" >
      ------------------------------------- <br>
      NO SIRVE, PRUEBAS (DICCIONARIO)<br>
      <img src="./IMG_20230818_103646_1.jpg" alt="" style="width: 100%;"><br>
      -------------------------------------<br>
      </div>
      <BarcodeComponent 
        value="0653981825799" 
        :options="barcodeOptions" 
        preserveAspectRatio="none"
        class="barcode" tag="svg"/>
      <BarcodeComponent 
        value="0169013000002" 
        :options="barcodeOptions" 
        preserveAspectRatio="none"
        class="barcode" tag="svg"/>
      <BarcodeComponent 
        value="0615604030270" 
        :options="barcodeOptions" 
        preserveAspectRatio="none"
        class="barcode" tag="svg"/>
      <BarcodeComponent 
        value="052087801025" 
        :options="barcodeOptions" 
        preserveAspectRatio="none"
        class="barcode" tag="svg"/>
      <BarcodeComponent 
        value="0260025903001" 
        :options="barcodeOptions" 
        preserveAspectRatio="none"
        class="barcode" tag="svg"/> -->
      <div v-if="mostrar">
        <BarcodeComponent 
          :value=ticketData.barcodeValue
          :options="barcodeOptions" 
          preserveAspectRatio="none"
          class="barcode" tag="svg"/>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import BarcodeComponent from './barcode-component.vue';
import axios from 'axios';

export default {
  data() {
    return {
      ticketData: {
        gridData: [],
        clientData: {},
        total: '',
        required: false,
        barcodeValue: "000000",
      },
      barcodeOptions:{ 
        format: '#CODE39',
        height: 90,
        fontSize: 20
      },
      today: format(new Date, "dd/MMM/yy HH:mm:ss", { locale: es }).toUpperCase(),
      mostrar: false,
    }
  },
  methods: {
    async printTicket() {
      await axios.post('http://10.105.151.6:8000/api/registrarFolio/')
      .then(response => {
        if (response.data.ultimoFolio) {
          this.ticketData.barcodeValue = response.data.ultimoFolio.toString().padStart(6, '0');
        } else {
          console.log('sin datos');
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        console.log(this.ticketData.barcodeValue);
        this.today = format(new Date, "dd/MMM/yy HH:mm:ss", { locale: es }).toUpperCase();
        // console.log(this.today)
        if(this.ticketData.gridData != undefined){
          this.mostrar = true;
          setTimeout(() =>{
            window.print();
          }, 100)
        }
      });
      
    }
  },
  components: {
    BarcodeComponent
  }

}
</script>

<style>
.centeredContent{
  text-align: center;
}

.ticketInfoSmall {
  font-size: 14px;
}
.ticketInfoMed {
  font-size: 16px;
}
.toLeft {
  text-align: left;
}
.toRight {
  text-align: right;
}
.clientContainer {
  font-size: 16px;
}
.flexContainer {
  display: flex;
  justify-content: space-between;
}
.productosContainer {
  display: flex;
  flex-direction: column; /* This will stack the children vertically */
  justify-content: space-between;
}
.borderSeparator {
  border-bottom: 1px dashed black;
  margin: 10px 0; /* Adjust as needed */
}

@media print {
  .no-print {
    display: none;
  }
}

svg {
  max-width: 70mm;
  font-size: 12px;
}
</style>