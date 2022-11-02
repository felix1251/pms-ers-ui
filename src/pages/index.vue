<template>
  <div>
    <v-tabs v-model="activeTab" show-arrows color="info">
        <v-tab v-for="item in tabs" :key="item.tab" :value="item.tab">
          {{ item.title }}
        </v-tab>
      </v-tabs>
      <v-divider />
      <div class="mt-4">
        <leave v-if="activeTab == 'leave'"/>
        <overtime v-if="activeTab == 'overtime'"/>
        <offset v-if="activeTab == 'offset'"/>
      </div>
    </div>
</template>
<script>
import Leave from '@/views/pages/request/Leave.vue'
import Overtime from '@/views/pages/request/Overtime.vue'
import Offset from '@/views/pages/request/Offset.vue'
import { useRoute } from 'vue-router';
export default {
  name: "index",
  data(){
    return {
      activeTab: "leave",
      currRoute: null,
      init: 0,
      tabs: [
        {
          title: 'Leave',
          tab: 'leave',
        },
        {
          title: 'Undertime',
          tab: 'undertime',
        },
        {
          title: 'Overtime',
          tab: 'overtime',
        },
        {
          title: 'Offset',
          tab: 'offset',
        },
        {
          title: 'Official Business',
          tab: 'official-business',
        },
      ]
    }
  },
  created(){
    const route = useRoute()
    if(route.query.tab) this.activeTab = route.query.tab
    this.$router.replace({query: {tab: this.activeTab}})
  },
  watch: {
    activeTab(){
      this.$router.replace({query: {tab: this.activeTab}})
    }
  },
  components: {
    Leave,
    Overtime,
    Offset,
  }
}
</script>

<route lang="yaml">
  path: 
    /request
  meta:
    auth: true
</route>
