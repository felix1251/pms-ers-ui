<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm 
          ref="form" 
          v-model="valid"
          lazy-validation
        >
          <VCardText>
            <VRow class="mb-3">
              <VCol cols="12" md="7">
                <VTextField
                  v-model="form.password"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Current Password"
                  color="info"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                  :rules="[v => !!v || 'required']"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" md="7">
                <VTextField
                  v-model="form.new_password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="New Password"
                  color="info"
                  :rules="[v => !!v || 'required']"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                />
              </VCol>
              <VCol cols="12" md="7">
                <VTextField
                  v-model="form.confirm_password"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Confirm New Password"
                  color="info"
                  :rules="[v => !!v || 'required']"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                />
              </VCol>
            </VRow>
          </VCardText>
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn :loading="loading" @click.prevent="changePass" color="info">Save changes</VBtn>
            <VBtn type="reset" color="secondary" variant="tonal">
              Reset
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>

<script>
export default {
  name: 'account-settings',
  data(){
    return {
      isCurrentPasswordVisible: false,
      isNewPasswordVisible: false,
      isConfirmPasswordVisible: false,
      loading: false,
      valid: true,
      form: {
        password: "",
        new_password: "",
        confirm_password: "",
      }
    }
  },
  methods: {
    async changePass(){
      this.loading = true
      const { valid } = await this.$refs.form.validate()
      if(!valid) {
        this.loading = false
        return 
      }
      try{
        const res = await this.$secured.post("api/v2/password_change", this.form)
        this.$notification["success"]({message: "Password Changed", description: "Password succcessfully changed"});
        this.$refs.form.reset()
      }catch(error){
        if(error.response && error.response.status == 401) return
        if(error.response && error.response.data.password){
          this.$notification["error"]({message: "Password Change Failed", description: error.response.data.password[0]});
        }else if(error.response && error.response.data.password_confirmation){
          this.$notification["error"]({message: "Password Change Failed", description: error.response.data.password_confirmation[0]});
        }else{
          this.$notification["error"]({message: "Password Change Failed", description: "something is wrong"});
        }
      }
      this.loading = false
    }
  }
}
</script>

