<template>
  <div class="h-topbar-nav">
      <h-menu theme="dark" :active-name="activeIndex"  mode="horizontal">
        <h-menu-item :name='index' @click.native.prevent.stop = "activeSidebar(index)"  v-for="(item, index) in menusRoot" :key="item.name"
        >{{item.title}}</h-menu-item>
      </h-menu>  
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'FixedSidebar',
        data(){
            return {

            }
        },
        computed: {
            ...mapGetters([
                'permission_routers',
                'menusRoot',
                'activeIndex'
            ])
        },
    }
</script>