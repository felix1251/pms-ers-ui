<template>
  <v-card>
    <template #title>
      <div class="d-flex gap-3 space-between align-center">
        <span>OFFSET</span>
        <v-icon 
          id="offset-btn"
          @click.prevent="openModal('A')" 
          class="table-icon" 
          size="28" 
          icon="mdi-plus-circle-outline"
        />
      </div>
      <small style="font-size: 12px">Hours/Credit remaining: {{credits}} (8 credits per offset)</small>
    </template>
    <v-card-text style="padding: 0px; margin-top: -15px">
      <a-spin :spinning="loading" size="large">
        <v-table style="min-height: 61.1vh">
          <thead>
            <tr>
              <th class="text-left">Date Filed</th>
              <th class="text-left">Offset date</th>
              <th class="text-left">Hours/Credit Used</th>
              <th class="text-left">Reason</th>
              <th class="text-left">Status</th>
              <th class="text-left text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in data"
              :key="item.id"
            >
              <td>{{ item.date_filed }}</td>
              <td>{{ item.offset_date }}</td>
              <td>{{ item.hours_used }}</td>
              <td>{{ item.reason }}</td>
              <td>
                <v-chip v-if="item.status == 'P'" variant="outlined" color="primary">
                  Pending
                </v-chip>
                <v-chip v-else-if="item.status == 'A'" variant="outlined" color="success">
                  Approved
                </v-chip>
                <v-chip v-else-if="item.status == 'D'" variant="outlined" color="error">
                  Rejected
                </v-chip>
                <v-chip v-else variant="outlined" color="warning">
                  Voided
                </v-chip>
              </td>
              <td class="text-center">
                <VIcon class="table-icon" @click.prevent="openModal('V', item.id)"  size="20" start icon="mdi-eye"/>
                <VIcon class="table-icon" @click.prevent="openModal('E', item.id)" v-if="item.status == 'P'" size="20" start icon="mdi-edit"/>
                <VIcon class="table-icon" @click.prevent="voideOffset(item.id)" v-if="item.status == 'P'" size="20" start icon="mdi-close-box"/>
              </td>
            </tr>
          </tbody>
        </v-table>
      </a-spin>
      <v-pagination
        v-model="page"
        :length="len"
        rounded="circle"
      />
    </v-card-text>
  </v-card> 
  <v-dialog width="700px" v-model="modal" persistent>
    <v-card>
        <v-card-title class="pt-4">
          <span class="text-h6">{{modalTitle}}</span>
        </v-card-title>
        <v-card-text class="pt-0 px-3">
          <v-container>
            <v-form
                ref="form"
                v-model="valid"
                lazy-validation
              >
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <small style="font-size: 13px">Hours/Credit remaining: {{credits}} (8 credits per offset)</small>
                  <a-date-picker 
                    class="mt-2"
                    v-model:value="date"
                    format="MMMM DD, YYYY"
                    :disabled="modalType == 'V'"
                    placeholder="Select offset date*"
                    :getPopupContainer="(trigger) => trigger.parentNode"
                    allowClear
                  />
                  <label 
                    style="margin-left: 15px; color: #FF4C51; font-size: 13px" 
                    v-if="selectionRequired"
                  >
                    {{selectionRequiredMsg}}
                  </label>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea 
                    v-model="form.reason" 
                    color="info" 
                    variant="outlined" 
                    auto-grow 
                    label="Reason*" 
                    rows="8" 
                    row-height="20"
                    :readonly="modalType == 'V'"
                    :rules="[v => !!v || 'required']"
                  />
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="outlined"
            @click="closeModal"
          >
            {{modalType == 'A' ? 'Cancel' : "Close"}}
          </v-btn>
          <v-btn
            color="info"
            variant="outlined"
            @click="save"
            v-if="modalType == 'A'"
            :loading="crudLoading"
          >
            Save
          </v-btn>
          <v-btn
            color="info"
            variant="outlined"
            @click="edit()"
            v-if="modalType == 'E'"
            :loading="crudLoading"
          >
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>

<script>
import dayjs from "dayjs"
const formDefault = { offset_date: null, reason: null }
import { Modal } from 'ant-design-vue';

export default {
  name: "offset",
  data(){
    return {
      page: 1,
      perPage: 9,
      len: 1,
      data: [],
      date: null,
      loading: false,
      absolute: true,
      modal: false,
      modalType: null,
      modalTitle: "",
      form: formDefault,
      valid: true,
      typeOfLeaves: [],
      selectionRequired: false,
      selectionRequiredMsg: "",
      allowHalfDay: false,
      crudLoading: false,
      credits: 0,
    }
  },
  watch: {
    page(value){
      this.page = value
      this.getOffsets()
    }
  },
  created() {
    this.getOffsets()
    this.getRemainingCredits()
  },
  methods: {
    openModal(type, id){
      if(this.credits < 8){
        this.$notification["warning"]({message: "Offset Credit", description: "Insufficient Credit, add non-billable overtime first"})
        return
      }
      this.modalType = type
      this.modal = true
      if(type == 'V' || type == 'E'){
        if(type == 'V') this.modalTitle = "VIEW OFFSET"
        if(type == 'E') this.modalTitle = "EDIT OFFSER"
        this.getOffsetById(id)
      }else{
        this.modalTitle = "CREATE OFFSET"
      }
    },
    closeModal(){
      this.modal = false
      this.$refs.form.reset()
      this.date = null
      this.selectionRequired = false
      this.selectionRequiredMsg = ""
    },
    voideOffset(id){
      Modal.confirm({
        title: 'Void Offset',
        zIndex: 999999999,
        content: "Are you sure you want to permanently void this offset?",
        okText: "Void",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.$secured.delete("api/v2/offsets/"+id)
              .then(()=>{
                this.$notification["success"]({message: "Offset", description: "Offset successfully voided"});
                resolve()
                this.getOffsets()
                this.getRemainingCredits()
              })
              .catch(error => {
                reject()
                if(error.response && error.response.status == 401) return
                this.$notification["error"]({message: "Offset", description: "Something is wrong"})
              })
          }).catch(() => console.log('Oops errors!'));
        },
        onCancel: () => {},
      })
    },
    async edit(){
      this.selectionRequired = false
      this.selectionRequiredMsg = ""
      const { valid } = await this.$refs.form.validate()
      if(!this.date) { 
        this.selectionRequired = true 
        this.selectionRequiredMsg = "required"
      }
      if (!this.date || !valid) return
      this.crudLoading = true
      let params = {
        offset_date: new Date(this.date).toLocaleDateString("sv"),
        reason: this.form.reason,
      }
      try{
        const res = await this.$secured.put("api/v2/offsets/"+this.form.id, {offset: params})
        this.$notification["success"]({message: "Offset", description: "Offset successfully created"});
        this.closeModal()
        this.getOffsets()
        this.getRemainingCredits()
      }catch (error){
        this.crudLoading = false
        if(error.response && error.response.status == 401) return
        if (error.response.data.offset_date) { 
          this.selectionRequired = true 
          this.selectionRequiredMsg = "date range overlapse or exist on previous records"
          this.$notification["error"]({message: "Offset", description: error.response.data.offset_date[0]})
        }else {
          this.$notification["error"]({message: "Offset", description: "something is wrong"})
        }
      }
      this.crudLoading = false
    },
    async save(){
      this.selectionRequired = false
      this.selectionRequiredMsg = ""
      this.crudLoading = true
      const { valid } = await this.$refs.form.validate()
      if(!this.date) { 
        this.selectionRequired = true 
        this.selectionRequiredMsg = "required"
      }
      if (!this.date || !valid) {
        this.crudLoading = false
        return
      }
      let params = {
        offset_date: new Date(this.date).toLocaleDateString("sv"),
        reason: this.form.reason,
      }
      try{
        const res = await this.$secured.post("api/v2/offsets", {offset: params})
        this.$notification["success"]({message: "Offsets", description: "Overtime successfully created"});
        this.closeModal()
        this.getOffsets()
        this.getRemainingCredits()
      }catch (error){
        this.crudLoading = false
        if(error.response && error.response.status == 401) return
        if (error.response.data.offset_date) { 
          this.selectionRequired = true
          this.selectionRequiredMsg = "date range overlapse or exist on previous records"
          this.$notification["error"]({message: "Offsets", description: error.response.data.offset_date[0]})
        }else if(error.response.data.credits){
          this.selectionRequired = true
          this.selectionRequiredMsg = error.response.data.credits[0]
          this.$notification["error"]({message: "Offsets", description: error.response.data.credits[0]})
        }
        else {
          this.$notification["error"]({message: "Offsets", description: "something is wrong"})
        }
      }
      this.crudLoading = false
    },
    async getRemainingCredits(){
      try{
        const res = await this.$secured.get("api/v2/emp_overtime")
        this.credits = res.data
      }catch(error){
        console.log(error.response)
      }
    },
    async getOffsetById(id){
      try{
        const res = await this.$secured.get("api/v2/offsets/"+id)
        this.form.id = res.data.id
        this.date = dayjs(res.data.offset_date)
        this.form.reason = res.data.reason
      }catch(error){
        console.log(error.response)
      }
    },
    async getOffsets(){ 
      this.loading = true
      try{
        const res = await this.$secured.get("api/v2/offsets?page="+this.page+"&per_page="+this.perPage)
        this.data = res.data.data
        this.generateLength(res.data.total_count)
      }catch(error){
        console.log(error.response)
      }
      this.loading = false
    },
    generateLength(total_count){
      let l = total_count / this.perPage
      if(!this.checkInt(l)){
        this.len = this.getValueBeforeDecimal(l) + 1
        return
      }
      this.len = l || 1
    },
    checkInt(number){
      return Number.isInteger(number)
    },
    getValueBeforeDecimal(num) {
      const beforeDecimalStr = num.toString().split('.')[0];
      return Number(beforeDecimalStr);
    }
  }
}
</script>
<style lang="css" scoped>
  .table-icon{
    cursor: pointer;
  }
  .table-icon:hover{
    color: rgb(22,177,255)
  }
  tr > td {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .ant-picker{
    border-radius: 8px;
    padding: 12px 16px;
    width: 100%;
  }
  #overlay {
    position: absolute; /* Sit on top of the page content */
    display: none; /* Hidden by default */
    width: 100%; /* Full width (cover the whole page) */
    height: 100%; /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.05); /* Black background with opacity */
    z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  }
</style>
