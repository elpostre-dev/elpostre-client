<template>
    <v-card>
        <v-card-title>
            <span>Crear Pedido</span> <v-spacer></v-spacer>
            <v-icon @click="closeDialog">mdi-close</v-icon>
        </v-card-title>
        <v-card-text>
            <v-form>
                <v-row>
                    <v-col cols="12">
                        <div>
                            <b class="section-title">Cliente</b>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="6" xs="12">
                        <v-text-field
                            v-model="sClientName"
                            label="Nombre*"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" xs="12">
                        <v-text-field
                            v-model="sClientLastname"
                            label="Apellido*"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" xs="12">
                        <v-text-field
                            v-model="sClientPhone"
                            label="Teléfono*"
                            :rules="phoneRules"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" xs="12">
                        <v-text-field
                            v-model="sClientEmail"
                            label="Correo"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-checkbox
                            v-model="bDelivery"
                            label="A domicilio"
                        ></v-checkbox>
                    </v-col>
                    <v-col
                        v-model="sDeliveryStreet"
                        v-if="bDelivery"
                        cols="6"
                        md="6"
                        sm="12"
                        xs="12"
                    >
                        <v-text-field label="Nombre de calle*"></v-text-field>
                    </v-col>
                    <v-col
                        v-model="sDeliveryNumber"
                        v-if="bDelivery"
                        cols="6"
                        md="6"
                        sm="12"
                        xs="12"
                    >
                        <v-text-field
                            label="Número de casa*"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        v-model="sDeliveryColonia"
                        v-if="bDelivery"
                        cols="6"
                        md="6"
                        sm="12"
                        xs="12"
                    >
                        <v-text-field label="Colonia*" required></v-text-field>
                    </v-col>
                    <v-col
                        v-model="sDeliveryZip"
                        v-if="bDelivery"
                        cols="6"
                        md="6"
                        sm="12"
                        xs="12"
                    >
                        <v-text-field label="Código Postal"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <div>
                            <b>Sucursal de Pedido</b>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="12" xs="12">
                        <v-select
                            v-model="eEstablishment"
                            :items="eEstablishmentes"
                            label="Sucursal"
                            required
                        ></v-select>
                    </v-col>
                    <v-col cols="12" sm="12" xs="12">
                        <div><b>Fecha y Horario</b></div>
                    </v-col>
                    <v-col cols="6" md="6">
                        <v-menu
                            v-model="dateMenu"
                            :close-on-content-click="false"
                            :nudge-right="40"
                            transition="scale-transition"
                            offset-y
                            max-width="290px"
                            min-width="290px"
                        >
                            <template v-slot:activator="{ on }">
                                <v-text-field
                                    label="Día"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    :value="diaDateDisp"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                locale="en-in"
                                v-model="diaDateVal"
                                no-title
                                @input="dateMenu = false"
                                :min="minDate"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6">
                        <v-select
                            v-model="hora"
                            prepend-icon="mdi-clock"
                            label="Hora"
                            :items="horarios"
                        >
                        </v-select>
                    </v-col>
                    <v-col cols="12">
                        <div><b>Productos</b></div>
                    </v-col>
                    <v-col cols="3" md="4" sm="6" xs="12">
                        <v-autocomplete
                            auto-select-first
                            dense
                            label="Categoría"
                            v-model="currentCat"
                            :items="cats"
                            return-object
                            item-text="sName"
                            @change="searchCat()"
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="3" md="4" sm="6" xs="12">
                        <v-autocomplete
                            auto-select-first
                            v-model="currentProd"
                            dense
                            label="Producto"
                            :items="prods"
                            item-text="sName"
                            return-object
                        ></v-autocomplete>
                    </v-col>
                    <v-col cols="2" md="2" sm="6" xs="12">
                        <v-text-field
                            v-model="prodQuant"
                            type="number"
                            dense
                            label="Cantidad"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2" sm="6" xs="12">
                        <v-btn
                            :disabled="addProdValid"
                            @click="addProd()"
                            color="primary"
                            >Agregar</v-btn
                        >
                    </v-col>
                    <v-col cols="12">
                        <v-simple-table>
                            <template v-slot:default>
                                <thead>
                                    <tr>
                                        <th class="text-left">Producto</th>
                                        <th class="text-left">Precio</th>
                                        <th class="text-left">Cantidad</th>
                                        <th class="text-left">Total</th>
                                        <th class="text-center">Eliminar</th>
                                    </tr>
                                </thead>
                                <tbody v-if="buyProducts.length > 0">
                                    <tr
                                        v-for="product in buyProducts"
                                        :key="product.sProductId"
                                    >
                                        <td>{{ product.sName }}</td>
                                        <td>{{ parseInt(product.dPrice) }}</td>
                                        <td>{{ product.dQuantity }}</td>
                                        <td>{{ product.dTotal }}</td>
                                        <td class="text-center">
                                            <v-icon
                                                medium
                                                @click="removeProd(product)"
                                                >mdi-delete</v-icon
                                            >
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr style="text-align: center">
                                        <td colspan="5">Agrega productos!</td>
                                    </tr>
                                </tbody>
                            </template>
                        </v-simple-table>
                    </v-col>
                    <v-col cols="5">
                        <v-text-field
                            v-model="dTotalOrder"
                            disabled
                            label="Total"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="5">
                        <v-text-field
                            v-model="dPaidOrder"
                            label="Pagado"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="2">
                        <v-checkbox
                            v-model="bAllPaid"
                            @change="payTotal"
                            label="Pago completo"
                        ></v-checkbox>
                    </v-col>
                    <v-col cols="12">
                        <div><b>Comentario adicional</b></div>
                    </v-col>
                    <v-col cols="12">
                        <v-textarea
                            v-model="sComment"
                            outlined
                            name="input-7-4"
                            label="Comentario"
                        >
                        </v-textarea>
                    </v-col>
                    <v-col cols="12">
                        <div><b>Atendido Por</b></div>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="sSalesAgent" label="Atendió">
                        </v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-btn
                            :disabled="validOrder"
                            @click="createOrder()"
                            block
                            color="primary"
                            >Crear Pedido</v-btn
                        >
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
import Vue from 'vue'

export default {
    name: 'CreateOrder',
    props: ['neworder'],
    data() {
        return { ...this.initialState(), createChild: false }
    },
    beforeMount() {
        DB.get(`${URI}/categories`, {
            headers: {
                authorization: `Bearer ${this.$store.state.sToken}`,
            },
        })
            .then(res => {
                this.cats = res.data.data
            })
            .catch(err => {
                console.log(err)
            })
        DB.get(`${URI}/products`, {
            headers: {
                authorization: `Bearer ${this.$store.state.sToken}`,
            },
        })
            .then(res => {
                this.prods = res.data.data
            })
            .catch(err => {
                console.log(err)
            })
    },
    watch: {
        neworder: function () {
            DB.get(`${URI}/categories`, {
                headers: {
                    authorization: `Bearer ${this.$store.state.sToken}`,
                },
            })
                .then(res => {
                    this.cats = res.data.data
                })
                .catch(err => {
                    console.log(err)
                })
            DB.get(`${URI}/products`, {
                headers: {
                    authorization: `Bearer ${this.$store.state.sToken}`,
                },
            })
                .then(res => {
                    this.prods = res.data.data
                })
                .catch(err => {
                    console.log(err)
                })
        },
    },
    computed: {
        diaDateDisp() {
            return this.diaDateVal
        },
        minDate() {
            const date = new Date()
            return date.toISOString()
        },
        addProdValid() {
            return !(!!this.currentProd && this.prodQuant)
        },
        validOrder() {
            const address = () => {
                if (this.bDelivery) {
                    // check if address correct
                    return (
                        !!this.sDeliveryStreet &&
                        !!this.sDeliveryNumber &&
                        !!this.sDeliveryColonia
                    )
                } else {
                    return true
                }
            }
            return !(
                !!this.sClientName &&
                !!this.sClientLastname &&
                !!this.sClientPhone &&
                !!this.diaDateVal &&
                this.dTotalOrder > 0 &&
                this.buyProducts.length > 0 &&
                this.eEstablishment &&
                this.sSalesAgent &&
                this.hora &&
                this.sClientPhone.toString().length == 10 &&
                address
            )
        },
    },
    methods: {
        initialState() {
            return {
                // client info
                sClientName: '',
                sClientLastname: '',
                sClientEmail: '',
                sClientPhone: '',
                // dates
                diaDateVal: null,
                dateMenu: false,
                // if delivery
                bDelivery: false,
                sDeliveryStreet: '',
                sDeliveryNumber: '',
                sDeliveryColonia: '',
                sDeliveryZip: '',
                // how muy paid
                bAllPaid: false,
                dPaidOrder: 0,
                dTotalOrder: 0,
                // order products
                buyProducts: [],
                // add product to order
                currentCat: '',
                currentProd: '',
                prodQuant: 0,
                // all products and cats
                prods: [],
                cats: [],
                sComment: '',
                eEstablishmentes: ['Mississippi', 'Lomas'],
                eEstablishment: '',
                sSalesAgent: '',
                hora: '',
                horarios: [
                    '9:00 AM',
                    '9:30 AM',
                    '10:00 AM',
                    '10:30 AM',
                    '11:00 AM',
                    '11:30 AM',
                    '12:00 PM',
                    '12:30 PM',
                    '1:00 PM',
                    '1:30 PM',
                    '2:00 PM',
                    '2:30 PM',
                    '3:00 PM',
                    '3:30 PM',
                    '4:00 PM',
                    '4:30 PM',
                    '5:00 PM',
                    '5:30 PM',
                    '6:00 PM',
                    '6:30 PM',
                    '7:00 PM',
                    '7:30 PM',
                    '8:00 PM',
                ],
                phoneRules: [
                    value =>
                        value.toString().length == 10 ||
                        'Teléfono debe tener 10 dígitos',
                ],
            }
        },
        closeDialog() {
            this.$emit('close-dialog')
        },
        searchCat() {
            const params = {
                sCategoryId: this.currentCat.sCategoryId,
            }
            DB.get(`${URI}/products`, {
                params,
                headers: {
                    authorization: `Bearer ${this.$store.state.sToken}`,
                },
            })
                .then(res => {
                    this.prods = res.data.data
                })
                .catch(err => {})
        },
        addProd() {
            const newProd = {
                Product: {
                    sName: this.currentProd.sName,
                    dPrice: this.currentProd.dPrice,
                },
                sName: this.currentProd.sName,
                dPrice: this.currentProd.dPrice,
                dQuantity: this.prodQuant,
                dTotal:
                    parseInt(this.prodQuant) *
                    parseInt(this.currentProd.dPrice),
                sProductId: this.currentProd.sProductId,
            }
            // check if product already in order products
            var index = this.buyProducts.findIndex(
                p => p.sProductId == newProd.sProductId
            )
            if (index == -1) {
                // no match
                this.buyProducts.push(newProd)
            } else {
                Vue.set(this.buyProducts, index, {
                    ...this.buyProducts[index],
                    dQuantity:
                        parseInt(this.buyProducts[index].dQuantity) +
                        parseInt(newProd.dQuantity),
                })
                this.buyProducts[index].dTotal =
                    parseInt(this.buyProducts[index].dQuantity) *
                    parseInt(this.buyProducts[index].dPrice)
            }
            this.dTotalOrder += newProd.dTotal
            this.currentCat = ''
            this.currentProd = ''
            this.prodQuant = 0
        },
        payTotal() {
            this.dPaidOrder = this.dTotalOrder
        },
        removeProd(product) {
            const index = this.buyProducts.indexOf(product)
            if (index > -1) {
                this.buyProducts.splice(index, 1)
            }
            this.dTotalOrder -= product.dPrice * product.dQuantity
            if (this.dPaidOrder > this.dTotalOrder) {
                this.dPaidOrder = this.dTotalOrder
            }
        },
        createOrder() {
            let deliveryInfo = {}
            if (this.bDelivery) {
                deliveryInfo = {
                    sStreet: this.sDeliveryStreet.target._value,
                    sNumber: this.sDeliveryNumber.target._value,
                    sColonia: this.sDeliveryColonia.target._value,
                }
                if (this.sZip) {
                    deliveryInfo.sZip = this.sDeliveryZip.target._value
                }
            }
            const data = {
                sClientName: this.sClientName,
                sClientLastname: this.sClientLastname,
                sClientPhone: this.sClientPhone,
                sClientEmail: this.sClientEmail,
                eEstablishment: this.eEstablishment,
                dTotal: this.dTotalOrder,
                dPaid: parseInt(this.dPaidOrder),
                tDay: this.diaDateVal,
                tHour: this.hora,
                sSalesAgent: this.sSalesAgent,
                aProducts: this.buyProducts,
                bDelivery: this.bDelivery,
                ...deliveryInfo,
                sComment: this.sComment,
            }

            DB.post(`${URI}/orders`, data, {
                headers: {
                    Authorization: `Bearer ${this.$store.state.sToken}`,
                },
            })
                .then(res => {
                    this.mixSuccess('Pedido Creado!')
                    Object.assign(this.$data, this.initialState())
                    this.$emit('crear-pedido', data)
                })
                .catch(err => {})
            this.$emit('close-dialog')
        },
    },
}
</script>

<style scoped>
.section-title {
    font-size: 1rem;
}
</style>
