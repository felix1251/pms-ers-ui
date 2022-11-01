<template>
  <div>
    <VTabs v-model="activeTab" show-arrows color="info">
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon"/>
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />
    <div class="mt-5">
      <AccountSettingsAccount v-if="activeTab == 'account'"/>
      <AccountSettingsSecurity v-if="activeTab == 'security'"/>
    </div>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import AccountSettingsAccount from '@/views/pages/account/AccountSettingsAccount.vue'
import AccountSettingsSecurity from '@/views/pages/account/AccountSettingsSecurity.vue'

export default {
  name: "account",
  data(){
    return {
      activeTab: "account",
      tabs: [
        {
          title: 'Account',
          icon: 'mdi-account-outline',
          tab: 'account',
        },
        {
          title: 'Security',
          icon: 'mdi-lock-open-outline',
          tab: 'security',
        },
      ]
    }
  },
  components: {
    AccountSettingsAccount,
    AccountSettingsSecurity,
  }
}
</script>

<route lang="yaml">
  meta:
    auth: true
</route>
