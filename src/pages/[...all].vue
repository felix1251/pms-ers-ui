<template>
  <div class="misc-wrapper">
    <ErrorHeader
      error-code="404"
      error-title="Page Not Found ⚠️"
      error-description="We couldn't find the page you are looking for."
    />
    <div class="misc-avatar w-100 text-center">
      <VImg :src="misc404" alt="Coming Soon" :max-width="800" class="mx-auto"/>
      <VBtn to="/" class="mt-10" color="info">Back to Home</VBtn>
    </div>
    <VImg :src="authThemeMask" class="misc-footer-img d-none d-md-block"/>
  </div>
</template>

<script setup>
  import { useTheme } from 'vuetify'
  import misc404 from '@/assets/images/pages/404.png'
  import miscMaskDark from '@/assets/images/pages/misc-mask-dark.png'
  import miscMaskLight from '@/assets/images/pages/misc-mask-light.png'

  const vuetifyTheme = useTheme()
  const authThemeMask = computed(() => {
    return vuetifyTheme.global.name.value === 'light' ? miscMaskLight : miscMaskDark
  })
</script>

<style lang="scss">
  @use "@core/scss/pages/misc.scss";
  .misc-footer-tree {
    inline-size: 15.625rem;
    inset-block-end: 3.5rem;
    inset-inline-start: 0.375rem;
  }
</style>

<route lang="yaml">
  meta:
    layout: blank
    action: read
    subject: Auth
</route>
