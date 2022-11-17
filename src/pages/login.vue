<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <VCard
      class="auth-card pa-3 pt-5"
      max-width="448"
    >
      <VCardItem class="justify-center">
        <VCardTitle class="font-weight-semibold text-2xl text-uppercase">
          PMS-ERS
        </VCardTitle>
      </VCardItem>

      <VCardText class="pt-2">
        <p class="mb-0">
          Please sign-in to your account.
        </p>
      </VCardText>
      <VCardText>
        <VForm 
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <VRow>
            <!-- email -->
            <VCol cols="12">
              <VTextField
                v-model="form.employee_id"
                label="Employee UID"
                type="text"
                color="info"
                :disabled="loading"
                :rules="uidRules"
              />
            </VCol>

            <!-- password -->
            <VCol cols="12">
              <VTextField
                v-model="form.password"
                label="Password"
                :type="isPasswordVisible ? 'text' : 'password'"
                :append-inner-icon="isPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                @click:append-inner="isPasswordVisible = !isPasswordVisible"
                color="info"
                :disabled="loading"
                :rules="passwordRules"
              />

              <!-- remember me checkbox -->
              <div class="d-flex align-center justify-space-between flex-wrap mt-1 mb-4">
                <VCheckbox
                  v-model="remember"
                  label="Remember me"
                  color="info"
                  :disabled="loading"
                />
                <a
                  class="ms-2 mb-1 text-info"
                  href="javascript:void(0)"
                >
                  Forgot Password?
                </a>
              </div>
              <v-alert v-if="errorMsg" class="mb-3" :text="errorMsg" type="error" variant="outlined"/>
              <VBtn :loading="loading" @click.prevent="login" block type="submit" color="info">
                Login
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </div>
</template>

<script>
import { useTheme } from 'vuetify'
import logo from '@/assets/logo.svg?raw'
import secureStorage from '@/secureStorage'

const defaultRules = {uidRules: [v => !!v || 'UID is required'], passwordRules: [v => !!v || 'Password is required']}

export default {
  name: "login",
  data(){
    return {
      form: {employee_id: "", password: ""},
      remember: false,
      valid: true,
      uidRules: defaultRules.uidRules,
      passwordRules: defaultRules.passwordRules,
      isPasswordVisible: false,
      loading: false,
      errorMsg: null,
    }
  },
  created(){
    this.autologin()
  },
  methods: {
    async autologin(){
      if(!secureStorage.getItem("userCredential")) return
      this.remember = true
      this.loading = true
      try{
        const res = await this.$plain.post("api/v2/signin", secureStorage.getItem("userCredential"))
        this.$store.commit("setCurrentUser", { currentUser: res.data.employee, csrf: res.data.csrf});
        this.$router.replace(secureStorage.getItem("prevPathOnRefresh" || "/"))
      }catch(error){
        secureStorage.setItem("userCredential", null)
      }
      this.loading = false
    },
    async login(){
      const { valid } = await this.$refs.form.validate()
      if (!valid) return
      this.loading = true
      this.errorMsg = null
      try{
        const res = await this.$plain.post("api/v2/signin", this.form)
        this.$store.commit("setCurrentUser", { currentUser: res.data.employee, csrf: res.data.csrf});
        if(this.remember) secureStorage.setItem("userCredential", this.form)
        this.$notification["success"]({message: "Login", description: "Successfully logged in"});
        this.$router.replace("/request")
      }catch(error){
        this.errorMsg = error.response.data.error || error.response.data ||"Something is wrong"
      }
      this.loading = false
    }
  },
}

</script>
<style lang="scss">
  @use "@core/scss/pages/page-auth.scss";
</style>

<route lang="yaml">
  meta:
    layout: blank
    auth: false
</route>
