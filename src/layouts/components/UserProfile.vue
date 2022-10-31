<template>
  <VAvatar
    style="cursor: pointer;"
    color="info"
    variant="tonal"
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
                  variant="tonal"
                >
                  <v-icon icon="mdi-user"></v-icon>
              </VAvatar>
            </VListItemAction>
          </template>
          <VListItemTitle class="font-weight-semibold">
            Felix G. Abacajen Jr.
          </VListItemTitle>
          <VListItemSubtitle class="text-disabled">
            Employee
          </VListItemSubtitle>
        </VListItem>
        <VDivider class="my-2" />
        <VListItem to="/login">
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
}
</script>