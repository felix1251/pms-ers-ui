<template>
  <div>
    <VTabs v-model="activeTab" show-arrows color="info">
      <VTab v-for="item in tabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon"/>
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />
    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition" :touch="false">
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>
      <VWindowItem value="notification">
        <AccountSettingsNotification />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<script>
import { useRoute } from 'vue-router'
import AccountSettingsAccount from '@/views/pages/account/AccountSettingsAccount.vue'
import AccountSettingsNotification from '@/views/pages/account/AccountSettingsNotification.vue'
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
    AccountSettingsNotification,
    AccountSettingsSecurity,
  }
}
</script>

<route lang="yaml">
  meta:
    auth: true
</route>
