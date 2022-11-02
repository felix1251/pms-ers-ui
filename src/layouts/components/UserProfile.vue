<template>
  <VAvatar
    style="cursor: pointer;"
    color="info"
  >
    <v-icon icon="mdi-user"></v-icon>
    <!-- SECTION Menu -->
    <VMenu
      activator="parent"
      width="250"
      location="bottom end"
      offset="14px"
    >
      <VList>
        <!-- 👉 User Avatar & Name -->
        <VListItem style="cursor: pointer" to="account">
          <template #prepend>
            <VListItemAction start>
              <VAvatar
                  color="info"
                  size="40"
                >
                  <v-icon icon="mdi-user"></v-icon>
              </VAvatar>
            </VListItemAction>
          </template>
          <VListItemTitle class="font-weight-semibold">
            {{currentUser.fullname}}
          </VListItemTitle>
          <VListItemSubtitle class="text-disabled">
            Employee
          </VListItemSubtitle>
        </VListItem>
        <VDivider class="my-2" />
        <VListItem style="display: flex; flex-direction: row" @click.prevent="logout">
          <template #prepend>
              <VIcon
                class="me-2"
                icon="mdi-logout-variant"
                size="22"
              />
          </template>
          <VListItemTitle>Logout</VListItemTitle>
        </VListItem>
      </VList>
    </VMenu>
  </VAvatar>
</template>

<script>
import { mapState } from "vuex";
import secureStorage from '@/secureStorage'
export default {
  name: "user-profile",
  data(){
    return {
      avatarBadgeProps: {
        dot: true,
        location: 'bottom right',
        offsetX: 3,
        offsetY: 3,
        color: 'success',
        bordered: true,
      }
    }
  },
  methods: {
    logout(){
      this.$secured.delete("api/v2/signin")
        .then((response) => {
          secureStorage.setItem("userCredential", null)
          this.$store.commit("unsetCurrentUser");
          this.$router.replace("/login");
        })
        .catch((error) => {
          console.log(error)
        });
    }
  },
  computed: {
    ...mapState(["currentUser"]),
  }
}
</script>