<script setup>
import upgradeBannerDark from '@/assets/images/pro/upgrade-banner-dark.png'
import upgradeBannerLight from '@/assets/images/pro/upgrade-banner-light.png'
import logo from '@/assets/logo.svg?raw'
import {
  VerticalNavLink,
  VerticalNavSectionTitle,
} from '@layouts'
import { useTheme } from 'vuetify'

const vuetifyTheme = useTheme()
const upgradeBanner = computed(() => {
  return vuetifyTheme.global.name.value === 'light' ? upgradeBannerLight : upgradeBannerDark
})
</script>
<template>
  <div class="nav-header">
    <RouterLink
      to="/"
      class="app-logo d-flex align-center justify-center gap-x-3 app-title-wrapper"
    >
      <Transition name="vertical-nav-app-title">
        <img style="width: 45px" src="@/assets/logo.png" />
      </Transition>
    </RouterLink>
  </div>
  <ul>
    <VerticalNavSectionTitle :item="{ heading: 'Pages' }" />
    <VerticalNavLink
      :item="{
        title: 'Request',
        to: 'index',
        icon: { icon: 'mdi-checkbox-multiple-blank' }
      }"
    />
    <VerticalNavLink
      :item="{
        title: 'Account',
        to: 'account',
        icon: { icon: 'mdi-account-cog' }
      }"
    />
  </ul>
</template>

<style lang="scss">

.upgrade-banner {
  margin-top: auto;
}
</style>
