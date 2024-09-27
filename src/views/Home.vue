<template>
    <v-container>
        <v-card>
            <v-card-title>
                <span>Pedidos</span>
                <v-spacer></v-spacer>
                <v-btn class="mr-1" color="primary" @click="printCocina()"
                    >Imprimir Cocina</v-btn
                >
                <v-btn class="mr-1" color="primary" @click="printCaja()"
                    >Imprimir Caja</v-btn
                >
                <v-btn color="primary" @click="bCreateOrder = !bCreateOrder"
                    >Nuevo Pedido</v-btn
                >
            </v-card-title>
            <v-card-text>
                <v-menu
                    v-model="fromDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            label="Desde"
                            prepend-icon="mdi-calendar"
                            readonly
                            :value="fromDateDisp"
                            v-on="on"
                            class="dateCal"
                            max-width="100px"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        locale="en-in"
                        v-model="fromDateVal"
                        no-title
                        @input="fromDate()"
                    ></v-date-picker>
                </v-menu>
                <v-menu
                    v-model="toDateMenu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                >
                    <template v-slot:activator="{ on }">
                        <v-text-field
                            label="Hasta"
                            prepend-icon="mdi-calendar"
                            readonly
                            class="dateCal"
                            :value="toDateDisp"
                            v-on="on"
                        ></v-text-field>
                    </template>
                    <v-date-picker
                        locale="en-in"
                        v-model="toDateVal"
                        no-title
                        @input="toDate()"
                    ></v-date-picker>
                </v-menu>
                <v-select
                    :items="sucursales"
                    item-value="value"
                    item-text="text"
                    v-model="sucursal"
                    label="Todas las sucursales"
                    outlined
                    style="max-width: 14rem; display: inline-flex"
                    dense
                ></v-select>
                <v-container>
                    <v-select
                        :items="pagadoOptions"
                        v-model="sPaid"
                        label="Todos"
                        outlined
                        style="max-width: 14rem; display: inline-flex"
                        dense
                    >
                    </v-select>
                </v-container>
                <v-data-table
                    scrollable
                    :headers="headers"
                    :items="pedidos"
                    item-key="sOrderId"
                    show-expand
                    class="elevation-1"
                    id="tableDiv"
                >
                    <template v-slot:item.actions="{ item }">
                        <v-icon
                            @click="editar(item)"
                            style="font-size: 20px"
                            class="mr-1"
                        >
                            mdi-pencil
                        </v-icon>
                        <v-icon class="mr-1" @click="deleteOrder(item)"
                            >mdi-trash-can</v-icon
                        >
                        <v-icon
                            @click="goToDeliver(item)"
                            :class="{ greenButton: item.bDelivered }"
                            >mdi-checkbox-marked-circle
                        </v-icon>
                    </template>
                    <template v-slot:item.bDelivery="{ item }">
                        <v-chip
                            style="color: white"
                            :color="getColor(item.bDelivery)"
                            >{{ item.bDelivery }}</v-chip
                        >
                    </template>
                    <template v-slot:item.OrderProducts="{ item }">
                        <div
                            v-for="product in item.OrderProducts"
                            :key="product.sProductId"
                        >
                            {{ product.dQuantity }}
                            {{ product.Product.sName }}
                        </div>
                    </template>
                    <template v-slot:expanded-item="{ headers, item }">
                        <td :colspan="headers.length">
                            <v-row class="mt-1 mb-1">
                                <v-col cols="6">
                                    <span
                                        ><b
                                            >POR PAGAR:
                                            {{ item.dTotal - item.dPaid }}</b
                                        >,
                                    </span>
                                    <span>Pagado: {{ item.dPaid }}, </span>
                                    <span>Total: {{ item.dTotal }} </span>
                                    <br />
                                    Pedido de: {{ item.Client.fullName }},
                                    {{ item.Client.sPhone }}
                                    <br />
                                    Pedido para: {{ item.eEstablishment }}
                                    <br />
                                    <span v-if="item.bDelivery == 'Si'">
                                        Entregar a:
                                        {{ item.sStreet }}
                                        #{{ item.sNumber }}, {{ item.sColonia }}
                                        {{ item.sZip }}
                                    </span>
                                </v-col>
                                <v-col cols="6">
                                    <div v-if="item.sComment">
                                        Comentarios: {{ item.sComment }}
                                        <br />
                                        <br />
                                    </div>
                                    <ul>
                                        <li
                                            v-for="product in item.OrderProducts"
                                            :key="product.sProductId"
                                        >
                                            {{ product.dQuantity }}
                                            {{ product.Product.sName }}
                                        </li>
                                    </ul>
                                </v-col>
                            </v-row>
                        </td>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-dialog
            persistent
            transition="dialog-bottom-transition"
            v-model="bCreateOrder"
            max-width="1000px"
        >
            <create-order
                :neworder="bCreateOrder"
                @close-dialog="bCreateOrder = false"
                @crear-pedido="getPedidos"
            ></create-order>
        </v-dialog>
        <v-dialog persistent v-model="bEditOrder" max-width="1000px">
            <edit-order
                :pedido="editOrder"
                @close-dialog="bEditOrder = false"
                @editar-pedido="getPedidos"
            ></edit-order>
        </v-dialog>
        <v-dialog v-model="bDeliverOrder" max-width="600">
            <deliver-order
                @close-dialog="bDeliverOrder = false"
                @deliver-order="entregar"
            ></deliver-order>
        </v-dialog>
        <v-dialog v-model="bDeleteOrder" max-width="600">
            <delete-order
                @close-dialog="bDeleteOrder = false"
                @delete-order="borrar"
            ></delete-order>
        </v-dialog>
    </v-container>
</template>

<script>
import CreateOrder from '../components/CreateOrder.vue'
import EditOrder from '../components/EditOrder.vue'
import DeliverOrder from '../components/DeliverOrder.vue'
import DeleteOrder from '../components/DeleteOrder.vue'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { mapActions } from 'vuex'

export default {
    name: 'Home',
    components: {
        CreateOrder,
        EditOrder,
        DeliverOrder,
        DeleteOrder,
    },
    data() {
        return {
            // date filters
            fromDateMenu: false,
            fromDateVal: null,
            toDateMenu: false,
            toDateVal: null,
            // home page
            bCreateOrder: false,
            sPaid: '',
            bEditOrder: false,
            bDeliverOrder: false,
            bDeleteOrder: false,
            pedidoParaEntregar: {
                sOrderId: '',
                bDelivered: 0,
            },
            pedidoParaBorrar: {
                sOrderId: '',
                bDelivered: 0,
            },
            editOrder: {},
            pedidos: [],
            sucursales: [
                {
                    value: 'Mississippi',
                    text: 'Mississippi',
                },
                {
                    value: 'Lomas',
                    text: 'Lomas',
                },
                {
                    value: 'Todas',
                    text: 'Todas',
                },
            ],
            pagadoOptions: ['Todos', 'Pagados', 'No Pagados'],
            sucursal: '',
            headers: [
                {
                    text: 'Cliente',
                    align: 'start',
                    sortable: false,
                    value: 'Client.fullName',
                },
                { text: 'Productos', align: 'start', value: 'OrderProducts' },
                {
                    text: 'Fecha Entrega',
                    align: 'start',
                    sortable: false,
                    value: 'tDayDisplay',
                },
                {
                    text: 'Hora Entrega',
                    align: 'start',
                    sortable: false,
                    value: 'tHour',
                },
                {
                    text: 'A Domicilio',
                    align: 'center',
                    sortable: false,
                    value: 'bDelivery',
                },
                {
                    text: 'Acciones',
                    align: 'center',
                    sortable: false,
                    value: 'actions',
                },
                { text: '', value: 'data-table-expand' },
            ],
        }
    },
    watch: {
        sucursal() {
            this.getPedidos()
        },
        sPaid() {
            this.getPedidos()
        },
    },
    computed: {
        fromDateDisp() {
            if (!this.fromDateVal) {
                return this.fromDateVal
            }
            return new Date(
                this.fromDateVal.replace(/-/g, '\/')
            ).toLocaleDateString('es-MX')
        },
        toDateDisp() {
            if (!this.toDateVal) {
                return this.toDateVal
            }
            return new Date(
                this.toDateVal.replace(/-/g, '\/')
            ).toLocaleDateString('es-MX')
        },
    },
    beforeMount() {
        this.getPedidos()
    },

    methods: {
        ...mapActions(['logout']),
        fromDate() {
            this.fromDateMenu = false
            this.getPedidos()
        },
        toDate() {
            this.toDateMenu = false
            this.getPedidos()
        },
        getColor(delivery) {
            if (delivery == 'Si') {
                return 'red'
            } else {
                return 'green'
            }
        },
        printCocina() {
            const doc = new jsPDF()
            var columns = [
                {
                    title: 'Cliente',
                    dataKey: 'clientFullName',
                },
                { header: 'Productos', dataKey: 'prodsStr' },
                { header: 'Fecha Entrega', dataKey: 'tDayDisplay' },
                { header: 'Hora Entrega', dataKey: 'tHour' },
                { header: 'Comentarios', dataKey: 'sComment' },
            ]
            doc.autoTable({
                columns,
                body: this.pedidos,
                margin: { bottom: 30 },
            })
            doc.autoPrint()
            doc.output('dataurlnewwindow')
        },
        printCaja() {
            const doc = new jsPDF()
            var columns = [
                {
                    title: 'Cliente',
                    dataKey: 'clientFullName',
                },
                { header: 'Productos', dataKey: 'prodsStr' },
                { header: 'Hora Entrega', dataKey: 'tHour' },
                { header: 'Por Pagar', dataKey: 'porPagar' },
                { header: 'Total', dataKey: 'dTotal' },
                { header: 'Comentarios', dataKey: 'sComment' },
            ]
            doc.autoTable({
                columns,
                body: this.pedidos,
                margin: { bottom: 30 },
            })
            doc.autoPrint()
            doc.output('dataurlnewwindow')
        },
        entregar() {
            this.pedidoParaEntregar.bDelivered =
                this.pedidoParaEntregar.bDelivered == 0 ? false : true
            DB.patch(
                `${URI}/orders/${this.pedidoParaEntregar.sOrderId}`,
                { bDelivered: true },
                {
                    headers: {
                        authorization: `Bearer ${this.$store.state.sToken}`,
                        ContentType: 'application/json',
                    },
                }
            )
                .then(res => {
                    // console.log(res)
                    this.$confetti.start()
                    this.mixSuccess('Pedido Entregado.')
                    setTimeout(() => {
                        this.$confetti.stop()
                    }, 1500)
                    this.bDeliverOrder = false
                    this.getPedidos()
                })
                .catch(err => {
                    let message = err.response.data.message
                    this.mixError(message)
                })
        },
        borrar() {
            this.pedidoParaBorrar.bDelivered =
                this.pedidoParaBorrar.bDelivered == 0 ? false : true
            DB.delete(`${URI}/orders/${this.pedidoParaBorrar.sOrderId}`, {
                headers: {
                    authorization: `Bearer ${this.$store.state.sToken}`,
                    ContentType: 'application/json',
                },
            })
                .then(res => {
                    // console.log(res)
                    this.mixSuccess('Pedido Borrado exitosamente.')
                    this.bDeleteOrder = false
                    this.getPedidos()
                })
                .catch(err => {
                    let message = err.response.data.message
                    this.mixError(message)
                })
        },
        goToDeliver(item) {
            this.pedidoParaEntregar = item
            this.bDeliverOrder = true
        },
        deleteOrder(item) {
            this.pedidoParaBorrar = item
            this.bDeleteOrder = true
        },
        editar(item) {
            this.editOrder = item
            this.bEditOrder = true
        },
        getPedidos() {
            let eEstablishment = this.sucursal || ''
            let paidStatus = this.sPaid

            if (this.sucursal == 'Todas') eEstablishment = ''
            if (paidStatus == 'Pagados') {
                paidStatus = true
            } else if (paidStatus == 'No Pagados') {
                paidStatus = false
            } else {
                paidStatus = null
            }
            
            DB.get(
                `${URI}/orders`,

                {
                    headers: {
                        authorization: `Bearer ${this.$store.state.sToken}`,
                        ContentType: 'application/json',
                    },
                    params: {
                        eEstablishment,
                        fromDate: this.fromDateVal,
                        toDate: this.toDateVal,
                        bPaid: paidStatus,
                    },
                }
            )
                .then(res => {
                    this.pedidos = res.data.data
                })
                .catch(err => {
                    // console.log(err.response)
                    if (
                        err.response.data.code == 401 &&
                        err.response.data.message ==
                            'Token de autorización inválido.'
                    ) {
                        this.mixError('Sesión cerrada.')
                        this.logout()
                    }
                })
        },
    },
}
</script>

<style scoped>
.greenButton {
    color: green;
}

.v-text-field--box .v-input__slot,
.v-text-field--outline .v-input__slot {
    min-height: auto !important;
    display: flex !important;
    align-items: center !important;
}

.v-input {
    position: relative;
    top: 0.9rem;
    margin-right: 1rem;
}

.dateCal {
    width: 30%;
    display: inline-flex;
}
</style>
