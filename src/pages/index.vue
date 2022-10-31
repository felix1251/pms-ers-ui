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
      </div>
    </div>
</template>
<script>
import Leave from '@/views/pages/request/Leave.vue'
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
  }
}
</script>

<route lang="yaml">
  path: 
    /request
  meta:
    auth: true
</route>
