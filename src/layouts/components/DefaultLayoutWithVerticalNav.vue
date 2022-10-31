<template>
  <VerticalNavLayout>
    <template #navbar>
      <span class="font-weight-semibold text-sm text-uppercase">
        {{currentUser.company_name}}
      </span>
      <VSpacer />
      <UserProfile />
    </template>
    <template #navigation-drawer-content>
      <DrawerContent />
    </template>
    <div class="layout-page-content">
      <RouterView />
    </div>
    <template #footer>
      <Footer />
    </template>
  </VerticalNavLayout>
</template>

<script>
import DrawerContent from './DrawerContent.vue'
import { VerticalNavLayout } from '@layouts'
import Footer from '@/layouts/components/Footer.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { mapState } from "vuex";

export default {
  name: "layout",
  computed: {
    ...mapState(["currentUser"]),
  },
  components: {
    Footer,
    UserProfile,
    VerticalNavLayout,
    DrawerContent,
  }
}
</script>

<style lang="scss">
.app-bar-search {
  .v-input__control {
    width: 236px
  }
  .v-field__outline__start {
    border-radius: 28px 0 0 28px !important;
    flex-basis: 20px !important;
  }
  .v-field__outline__end {
    border-radius: 0 28px 28px 0 !important;
  }
}
</style>
