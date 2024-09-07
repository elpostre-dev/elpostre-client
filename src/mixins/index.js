export const mixs = {
    methods: {
        mixSuccess(e) {
            this.$toast.success(e, {
                position: 'top-right',
                timeout: 2500,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggable: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: false,
                hideProgressBar: true,
                closeButton: 'button',
                icon: true,
                rtl: false
            });
        },
        mixError(e) {
            this.$toast.error(e, {
                position: 'top-right',
                timeout: 2500,
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
                draggable: true,
                draggablePercent: 0.6,
                showCloseButtonOnHover: false,
                hideProgressBar: true,
                closeButton: 'button',
                icon: true,
                rtl: false
            });
        }
    }
};
