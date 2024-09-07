<template>
    <v-card>
        <v-card-title>Quieres Borrar el pedido?</v-card-title>
        <v-card-actions>
            <v-btn @click="closeDialog" color="primary" class="mr-2"
                >Cancelar</v-btn
            >
            <v-btn @click="borrarPedido()" color="primary">Borrar</v-btn>
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
        borrarPedido() {
            this.$emit('delete-order')
        },
    },
}
</script>
