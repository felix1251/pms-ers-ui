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
      </div>
    </div>
</template>
<script>
import Leave from '@/views/pages/request/Leave.vue'
import Overtime from '@/views/pages/request/Overtime.vue'
export default {
  name: "index",
  data(){
    return {
      activeTab: "leave",
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
  components: {
    Leave,
    Overtime,
  }
}
</script>

<route lang="yaml">
  path: 
    /request
  meta:
    auth: true
</route>
