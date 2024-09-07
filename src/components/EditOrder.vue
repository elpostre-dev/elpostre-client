<template>
    <v-card>
        <v-card-title>
            <span>Editar Pedido</span> <v-spacer></v-spacer>
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
                            v-model="order.Client.sName"
                            label="Nombre*"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" xs="12">
                        <v-text-field
                            v-model="order.Client.sLastname"
                            label="Apellido*"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" xs="12">
                        <v-text-field
                            v-model="order.Client.sPhone"
                            label="Teléfono*"
                            :rules="phoneRules"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col cols="6" sm="6" xs="12">
                        <v-text-field
                            v-model="order.Client.sEmail"
                            label="Correo"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-checkbox
                            v-model="order.bDelivery"
                            label="A domicilio"
                        ></v-checkbox>
                    </v-col>
                    <v-col
                        v-if="order.bDelivery"
                        cols="6"
                        md="6"
                        sm="12"
                        xs="12"
                    >
                        <v-text-field
                            v-model="order.sStreet"
                            label="Nombre de calle*"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        v-if="order.bDelivery"
                        cols="6"
                        md="6"
                        sm="12"
                        xs="12"
                    >
                        <v-text-field
                            v-model="order.sNumber"
                            type="number"
                            label="Número de casa*"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        v-if="order.bDelivery"
                        cols="6"
                        md="6"
                        sm="12"
                        xs="12"
                    >
                        <v-text-field
                            v-model="order.sColonia"
                            label="Colonia*"
                            required
                        ></v-text-field>
                    </v-col>
                    <v-col
                        v-if="order.bDelivery"
                        cols="6"
                        md="6"
                        sm="12"
                        xs="12"
                    >
                        <v-text-field
                            v-model="order.sZip"
                            label="Código Postal"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <div>
                            <b>Sucursal de Pedido</b>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="12" xs="12">
                        <v-select
                            v-model="order.eEstablishment"
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
                                v-model="order.tDay"
                                no-title
                                @input="dateMenu = false"
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="6">
                        <v-select
                            v-model="order.tHour"
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
                                <tbody v-if="order.OrderProducts.length > 0">
                                    <tr
                                        v-for="product in order.OrderProducts"
                                        :key="product.sProductId"
                                    >
                                        <td>{{ product.Product.sName }}</td>
                                        <td>{{ parseInt(product.dPrice) }}</td>
                                        <td>{{ product.dQuantity }}</td>
                                        <td>
                                            {{
                                                parseInt(product.dPrice) *
                                                parseInt(product.dQuantity)
                                            }}
                                        </td>
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
                            v-model="dTotal"
                            disabled
                            label="Total"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="5">
                        <v-text-field
                            v-model="dPaid"
                            type="number"
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
                            v-model="order.sComment"
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
                        <v-text-field
                            v-model="order.sSalesAgent"
                            label="Atendió"
                        >
                        </v-text-field>
                    </v-col>

                    <v-col cols="12">
                        <v-btn
                            :disabled="validOrder"
                            @click="editOrder()"
                            block
                            color="primary"
                            >Actualizar Pedido</v-btn
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
    name: 'EditOrder',
    props: ['pedido'],
    data() {
        return this.resetData()
    },
    watch: {
        pedido() {
            this.parsePedido()
        },
    },
    computed: {
        diaDateDisp() {
            return new Date(
                this.order.tDay.replace(/-/g, '\/').replace(/T.+/, '')
            ).toDateString()
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
                        !!this.order.sStreet &&
                        !!this.order.sNumber &&
                        !!this.order.sColonia
                    )
                } else {
                    return true
                }
            }
            return !(
                !!this.order.Client.sName &&
                !!this.order.Client.sLastname &&
                !!this.order.Client.sPhone &&
                !!this.order.tDay &&
                this.order.dTotal > 0 &&
                this.order.OrderProducts.length > 0 &&
                this.order.eEstablishment &&
                this.order.sSalesAgent &&
                this.order.tHour &&
                this.order.Client.sPhone.toString().length == 10 &&
                address
            )
        },
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
            .catch(err => {})
        DB.get(`${URI}/products`, {
            headers: {
                authorization: `Bearer ${this.$store.state.sToken}`,
            },
        })
            .then(res => {
                this.prods = res.data.data
            })
            .catch(err => {})
        // this.order = { ...this.pedido }
        // this.order.bDelivery = this.order.bDelivery == 'Si' ? 1 : 0
        // this.order.tDay = new Date(this.order.tDay).toISOString()
        // if (this.order.tHour[0] == 0)
        //     this.order.tHour = this.order.tHour.substring(1)
    },
    methods: {
        resetData() {
            return {
                order: {
                    ...this.pedido,
                    bDelivery: this.pedido.bDelivery == 'Si' ? 1 : 0,
                    tDay: new Date(this.pedido.tDay).toISOString(),
                    tHour:
                        this.pedido.tHour[0] == '0'
                            ? this.pedido.tHour.substring(1)
                            : this.pedido.tHour,
                },
                dTotal: this.pedido.dTotal,
                dPaid: this.pedido.dPaid,
                dateMenu: false,
                bAllPaid: false,
                currentCat: '',
                currentProd: '',
                prodQuant: 0,
                prods: [],
                cats: [],
                eEstablishmentes: ['Mississippi', 'Lomas'],
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
        parsePedido() {
            this.order = {
                ...this.pedido,
                bDelivery: this.pedido.bDelivery == 'Si' ? 1 : 0,
                tDay: new Date(this.pedido.tDay).toISOString(),
                tHour:
                    this.pedido.tHour[0] == '0'
                        ? this.pedido.tHour.substring(1)
                        : this.pedido.tHour,
            }
            this.dTotal = this.order.dTotal
            this.dPaid = this.order.dPaid
        },
        closeDialog() {
            this.$emit('close-dialog')
            this.resetData()
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
                dQuantity: parseInt(this.prodQuant),
                dTotal:
                    parseInt(this.prodQuant) *
                    parseInt(this.currentProd.dPrice),
                sProductId: this.currentProd.sProductId,
            }
            // check if product already in order products
            var index = this.order.OrderProducts.findIndex(
                p => p.sProductId == newProd.sProductId
            )
            if (index == -1) {
                // no match
                this.order.OrderProducts.push(newProd)
            } else {
                Vue.set(this.order.OrderProducts, index, {
                    ...this.order.OrderProducts[index],
                    dQuantity:
                        parseInt(this.order.OrderProducts[index].dQuantity) +
                        parseInt(newProd.dQuantity),
                })
            }
            this.dTotal += newProd.dTotal
            this.currentCat = ''
            this.currentProd = ''
            this.prodQuant = 0
        },
        payTotal() {
            this.dPaid = this.dTotal
        },
        removeProd(product) {
            const index = this.order.OrderProducts.indexOf(product)
            if (index > -1) {
                this.order.OrderProducts.splice(index, 1)
            }
            this.dTotal -= product.dPrice * product.dQuantity
            if (this.dPaid > this.dTotal) {
                this.dPaid = this.dTotal
            }
        },
        editOrder() {
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
                sName: this.order.Client.sName,
                sLastname: this.order.Client.sLastname,
                sPhone: this.order.Client.sPhone,
                sEmail: this.order.Client.sEmail,
                eEstablishment: this.order.eEstablishment,
                dTotal: this.dTotal,
                dPaid: parseInt(this.dPaid),
                tDay: this.order.tDay,
                tHour: this.order.tHour,
                sSalesAgent: this.order.sSalesAgent,
                aProducts: this.order.OrderProducts,
                bDelivery: this.order.bDelivery == 1 ? true : false,
                ...deliveryInfo,
                sComment: this.order.sComment,
            }
            DB.put(`${URI}/orders/${this.order.sOrderId}`, data, {
                headers: {
                    Authorization: `Bearer ${this.$store.state.sToken}`,
                },
            })
                .then(res => {
                    // console.log(res)
                    this.$emit('editar-pedido')
                    this.mixSuccess('Pedido actualizado exitosamente.')
                    this.$emit('close-dialog')
                    this.resetData()
                    console.log('data reset')
                })
                .catch(err => {
                    console.log(err)
                    this.mixError(
                        'Pedido no se pudo actualizar. Favor de verificar los campos.'
                    )
                })
        },
    },
}
</script>

<style scoped>
.section-title {
    font-size: 1rem;
}
</style>
