<template>
    <v-app>
        <v-app-bar app color="primary" dark elevate-on-scroll>
            <v-app-bar-title>El Postre Pedidos</v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="!loggedIn" color="primary" depressed to="/login"
                >Login</v-btn
            >

            <v-btn v-else color="primary" depressed @click="logout()"
                >Logout</v-btn
            >
        </v-app-bar>
        <v-main>
            <router-view />
        </v-main>
    </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
    name: 'App',

    data: () => ({
        sucursales: ['Mississippi', 'Lomas'],
        sucursal: '',
    }),
    computed: mapState({
        loggedIn: 'loggedIn',
    }),
    methods: {
        ...mapActions(['logout']),
    },
}
</script>

<style>
* {
    font-family: 'Poppins', sans-serif;
}

.theme--dark.v-btn--active::before {
    opacity: 0 !important;
}
</style>
