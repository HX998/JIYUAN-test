<template>
    <div v-if='show' :key="show">
        <slot></slot>  
    </div>
</template>
<script>
    export default {
        name: 'HDelay',
        data () {
            return {
                show: false,
            }
        },
        props: {
            delay: {
                type: Number,
                default: 100,
            },
        },
        mounted() {
            this.$nextTick(() => {
                setTimeout(() => {
                    this.show = true
                    }, this.delay)
            })
        }
    }
</script>