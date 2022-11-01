<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Account Details">
        <VCardText class="d-flex">
          <a-avatar
            :size="90"
            class="d-flex align-items-center justify-content-center"
            style="border-radius: 8px"
          >
            <template #icon>
              <v-icon v-if="!me.profile" size="75" icon="mdi-user"/>
              <img v-else :src="me.profile"/>
            </template>
          </a-avatar>
        </VCardText>
        <VDivider />
        <VCardText>
          <VForm class="mt-6">
            <VRow>
              <VCol md="6" cols="12">
                <VTextField :loading="loading" readonly v-model="me.fullname" label="Fullname" color="info"/>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField :loading="loading"  readonly v-model="me.employee_id" label="Employee UID" type="text" color="info"/>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField :loading="loading"  readonly v-model="me.position" label="Position" type="text" color="info"/>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField :loading="loading" readonly v-model="me.department_name" label="Department" type="text" color="info"/>
              </VCol>
              <VCol cols="12" md="6">
                <VTextField :loading="loading" readonly v-model="me.biometric_no" label="Biometric No." type="text" color="info"/>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
import avatar1 from '@/assets/images/avatars/avatar-1.png'

export default {
  name: "account-settings-account",
  data(){
    return {
      me: {},
      isAccountDeactivated: false,
      validateAccountDeactivation: [v => !!v || 'Please confirm account deactivation'],
      loading: false,
    }
  },
  mounted(){
    this.getMe()
  },
  methods: {
    async getMe(){
      this.loading = true
      try{
        const res = await this.$secured.get("api/v2/me")
        this.me = res.data
      }catch(error){
        console.log(error)
      }
      this.loading = false
    }
  },
  components: {
    avatar1,
  }
}
</script>
