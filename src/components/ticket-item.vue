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
        <p class="ticketInfoMed toLeft">Venta: A992242560</p>
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
          <p>{{ `   ${gD.cantidad} x    ${gD.producto.Precio1}` }}</p>
          <div class="flexContainer">
            <p class="toLeft">{{ `${gD.producto.Desc_Corta}` }}</p><p class="toRight">{{ `${parseFloat(gD.producto.Precio1 * gD.cantidad).toFixed(2)}` }}</p>
          </div>
        </div>
      </div>
      <div class="borderSeparator"></div>
      <p class="toRight ticketInfoMed"> T O T A L {{ "        " + parseFloat(ticketData.total).toFixed(2) }}</p>
      <br><br>
      <p>IVA 16% {{ parseFloat(ticketData.total * 0.16).toFixed(2) }}</p>
      <p>E= Exento</p>
      <p>*= Oferta</p>
      <p>{{ ticketData.gridData.length }} Artículos</p>
      <!-- <vue-barcode :value="ticketData.barcodeValue"  :options="{ displayValue: false }">
        Can't generate the barcode
      </vue-barcode> -->
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default {
  data() {
    return {
      ticketData: {
        gridData: [],
        clientData: {},
        total: '*A992242560*',
        required: false,
        barcodeValue: '',
      },
      today: format(new Date, "dd/MMM/yy HH:mm:ss", { locale: es }).toUpperCase()
    }
  },
  methods: {
    printTicket() {
      console.log(this.ticketData);
      this.today = format(new Date, "dd/MMM/yy HH:mm:ss", { locale: es }).toUpperCase();
      console.log(this.today)
      if(this.ticketData.gridData != undefined){
        window.print();
      }
    }
  },
}
</script>

<style>
.centeredContent{
  text-align: center;
}

.ticketInfoSmall {
  font-size: 8px;
}
.ticketInfoMed {
  font-size: 10px;
}
.toLeft {
  text-align: left;
}
.toRight {
  text-align: right;
}
.clientContainer {
  font-size: 10px;
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
</style>