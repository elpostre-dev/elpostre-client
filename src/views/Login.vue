<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm8 md8>
                <v-card elevation="2">
                    <v-toolbar color="primary" dark>
                        <v-toolbar-title>Inicio de Sesión</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="d-flex justify-center">
                        <v-form
                            @submit.prevent="login"
                            v-if="!loading"
                            v-model="valid"
                        >
                            <v-row justify="center">
                                <v-col cols="8">
                                    <v-text-field
                                        prepend-icon="mdi-account"
                                        v-model="sEmail"
                                        label="Correo*"
                                        type="text"
                                        required
                                        :rules="notEmptyRules"
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field
                                        prepend-icon="mdi-lock"
                                        label="Contraseña*"
                                        v-model="sPassword"
                                        type="password"
                                        :rules="notEmptyRules"
                                        required
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-col cols="8">
                                    <v-btn
                                        :disabled="!valid"
                                        type="submit"
                                        style="width: 100%"
                                        color="primary"
                                        >Login</v-btn
                                    >
                                </v-col>
                            </v-row>
                        </v-form>
                        <v-progress-circular
                            justify-self="center"
                            :size="70"
                            :width="7"
                            indeterminate
                            color="primary"
                            v-if="loading"
                        ></v-progress-circular>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Login',
    data() {
        return {
            sEmail: '',
            sPassword: '',
            loading: false,
            valid: false,
            notEmptyRules: [value => !!value || 'Campo Requerido'],
        }
    },
    beforeMount() {
        if (this.$store.state.loggedIn) {
            this.$router.push({ name: 'Home' })
        }
    },
    methods: {
        login() {
            if (this.valid) {
                this.loading = true
                DB.post(`${URI}/auth/login`, {
                    email: this.sEmail,
                    password: this.sPassword,
                })
                    .then(res => {
                        // console.log(res);
                        this.mixSuccess('Se ha iniciado sesión')
                        this.$store.commit('setLoggedIn', true)
                        this.$store.commit('setToken', res.data.token)
                        this.$router.push({ name: 'Home' })
                        this.loading = false
                    })
                    .catch(err => {
                        this.mixError('Credenciales inválidas')
                        this.$store.commit('setLoggedIn', false)
                        this.loading = false
                    })
            }
        },
    },
    computed: {
        ...mapState['loggedIn'],
    },
}
</script>

<style scoped>
.col {
    padding: 0;
}

.v-form {
    padding-bottom: 20px;
}
</style>
