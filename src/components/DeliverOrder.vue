<template>
    <v-card>
        <v-card-title>Quieres entregar el pedido?</v-card-title>
        <v-card-actions>
            <v-btn @click="closeDialog" color="primary" class="mr-2"
                >Cancelar</v-btn
            >
            <v-btn @click="entregarPedido()" color="primary">Entregar</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'DeliverOrder',
    methods: {
        closeDialog() {
            this.$emit('close-dialog')
        },
        entregarPedido() {
            this.$emit('deliver-order')
        },
    },
}
</script>
