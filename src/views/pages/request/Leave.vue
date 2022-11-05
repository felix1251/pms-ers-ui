<template>
  <v-card>
    <template #title>
      <div class="d-flex gap-3 space-between align-center">
        <span>LEAVE</span>
        <v-icon 
          @click.prevent="openModal('A')" 
          class="table-icon" 
          size="28" 
          icon="mdi-plus-circle-outline"
        />
      </div>
      <div class="d-flex flex-column mt-2">
        <small class="leaves-credits">Sick Leave With Pay Credits: {{leavesCredits.employee_current_sick_leave_credits || 0.0}} / {{leavesCredits.max_sick_leave_credits || 0.0}}</small>
        <small class="leaves-credits">Vacation Leave With Pay Credits: {{leavesCredits.employee_current_vacation_leave_credits || 0.0}} / {{leavesCredits.max_vacation_leave_credits || 0.0}}</small>
        <small class="leaves-credits">Others: {{leavesCredits.others}}</small>
      </div>
    </template>
      <v-card-text style="padding: 0px; margin-top: -15px;">
          <a-spin :spinning="loading" size="large">
            <v-table style="min-height: 56.8vh">
              <thead>
                <tr>
                  <th class="text-left">Date Filed</th>
                  <th class="text-left">Inclusive Dates</th>
                  <th class="text-left">Days</th>
                  <th class="text-left">Type</th>
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
                  <td>{{ item.inclusive_date }}</td>
                  <td>{{ item.days }}</td>
                  <td>{{ item.type }}</td>
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
                    <VIcon class="table-icon" @click.prevent="voidLeave(item.id)" v-if="item.status == 'P'" size="20" start icon="mdi-close-box"/>
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
                  <a-range-picker
                    v-model:value="date"
                    style="width: 100%"
                    size="large"
                    format="MMM DD, YYYY"
                    :rules="[v => !!v || 'required']"
                    :disabled="modalType == 'V'"
                    :placeholder="['Start date*', 'Start date*']"
                    :getPopupContainer="(trigger) => trigger.parentNode"
                  />
                  <label 
                    style="margin-left: 15px; color: #FF4C51; font-size: 13px" 
                    v-if="selectionRequired"
                  >
                    {{selectionRequiredMsg}}
                  </label>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="form.leave_type"
                    :items="typeOfLeaves"
                    color="info"
                    item-title="name"
                    item-value="id"
                    label="Select leave type*"
                    :loading="typeOfLeavesLoading"
                    :readonly="modalType == 'V'"
                    :rules="[v => !!v || 'required']"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <VCheckbox
                    v-model="form.half_day"
                    label="Half Day"
                    color="info"
                    :disabled="!allowHalfDay || modalType == 'V'"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea 
                    v-model="form.reason" 
                    color="info" 
                    variant="outlined" 
                    auto-grow 
                    label="Reason*" 
                    rows="4" 
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
const formDefault = { leave_type: null, reason: null, half_day: false}
import { Modal } from 'ant-design-vue';
export default {
  name: "leave",
  data(){
    return {
      page: 1,
      perPage: 9,
      len: 1,
      data: [],
      date: null,
      loading: true,
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
      typeOfLeavesLoading: false,
      leavesCredits: {},
    }
  },
  watch: {
    date(value){
      this.allowHalfDay = false
      this.form.half_day = false
      if(value){
        if(new Date(value[0]).toLocaleDateString("sv") ==  new Date(value[1]).toLocaleDateString("sv")){
          this.allowHalfDay = true
        }
      }
    },
    page(value){
      this.page = value
      this.getLeaves()
    }
  },
  created() {
    this.getLeaves()
    this.getLeaveCreditsTotal()
  },
  methods: {
    async getLeaveCreditsTotal(){
      try{
        const res = await this.$secured.get("api/v2/leave_credits_total")
        this.leavesCredits = res.data
      }catch(error){
        console.log(error.response)
      }
    },
    openModal(type, id){
      this.modalType = type
      this.modal = true
      this.getTypeOfLeaves()
      if(type == 'V' || type == 'E'){
        if(type == 'V') this.modalTitle = "VIEW LEAVE"
        if(type == 'E') this.modalTitle = "EDIT LEAVE"
        this.getLeaveById(id)
      }else{
        this.modalTitle = "CREATE LEAVE"
      }
    },
    closeModal(){
      this.modal = false
      this.$refs.form.reset()
      this.date = null
      this.selectionRequired = false
      this.selectionRequiredMsg = ""
    },
    voidLeave(id){
      Modal.confirm({
        title: 'Void Leave',
        zIndex: 999999999,
        content: "Are you sure you want to permanently void this leave?",
        okText: "Void",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.$secured.delete("api/v2/leaves/"+id)
              .then(()=>{
                this.$notification["success"]({message: "Leave", description: "Leave successfully voided"});
                resolve()
                this.getLeaves()
                this.getLeaveCreditsTotal()
              })
              .catch(error => {
                reject()
                if(error.response && error.response.status == 401) return
                this.$notification["error"]({message: "Leave", description: "Something is wrong"})
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
        start_date: new Date(this.date[0]).toLocaleDateString("sv"),
        end_date: new Date(this.date[1]).toLocaleDateString("sv"),
        leave_type: this.form.leave_type,
        reason: this.form.reason,
        half_day: this.form.half_day
      }
      try{
        const res = await this.$secured.put("api/v2/leaves/"+this.form.id, {leave: params})
        this.$notification["success"]({message: "Leave", description: "Leave successfully created"});
        const le = this.typeOfLeaves.find(id => params.leave_type)
        if(le.code == "SLWP" || le.code == "VLWP") this.getLeaveCreditsTotal()
        this.closeModal()
        this.getLeaves()
      }catch (error){
        this.crudLoading = false
        if(error.response && error.response.status == 401) return
        if (error.response.data.end_date) { 
          this.selectionRequired = true 
          this.selectionRequiredMsg = "date range overlapse or exist on previous records"
          this.$notification["error"]({message: "Leave", description: error.response.data.end_date[0]})
        }else if(error.response.data.credits){
          this.selectionRequired = true 
          this.selectionRequiredMsg = "Credits exceeds"
          this.$notification["error"]({message: "Leave", description: error.response.data.credits[0]})
        }else {
          this.$notification["error"]({message: "Leave", description: "something is wrong"})
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
        start_date: new Date(this.date[0]).toLocaleDateString("sv"),
        end_date: new Date(this.date[1]).toLocaleDateString("sv"),
        leave_type: this.form.leave_type,
        reason: this.form.reason,
        half_day: this.form.half_day
      }
      try{
        const res = await this.$secured.post("api/v2/leaves", {leave: params})
        this.$notification["success"]({message: "Leave", description: "Leave successfully created"});
        const le = this.typeOfLeaves.find(item => item.id == params.leave_type)
        if(le.code == "SLWP" || le.code == "VLWP") this.getLeaveCreditsTotal()
        this.closeModal()
        this.getLeaves()
      }catch (error){
        this.crudLoading = false
        if(error.response && error.response.status == 401) return
        if (error.response.data.end_date) { 
          this.selectionRequired = true 
          this.selectionRequiredMsg = "date range overlapse or exist on previous records"
          this.$notification["error"]({message: "Leave", description: error.response.data.end_date[0]})
        }else if(error.response.data.credits){
          this.selectionRequired = true 
          this.selectionRequiredMsg = "Credits exceeds"
          this.$notification["error"]({message: "Leave", description: error.response.data.credits[0]})
        }else {
          this.$notification["error"]({message: "Leave", description: "something is wrong"})
        }
      }
      this.crudLoading = false
    },
    async getTypeOfLeaves(){
      this.typeOfLeavesLoading = true
      try{
        const res = await this.$secured.get("api/v2/type_of_leaves")
        this.typeOfLeaves = res.data
      }catch(error){
      }
      this.typeOfLeavesLoading = false
    },
    async getLeaveById(id){
      try{
        const res = await this.$secured.get("api/v2/leaves/"+id)
        this.form.id = res.data.id
        this.form.leave_type = Number(res.data.leave_type)
        this.form.half_day = res.data.half_day
        this.form.reason = res.data.reason
        this.date = [dayjs(res.data.start_date), dayjs(res.data.end_date)]
      }catch(error){
        console.log(error.response)
      }
    },
    async getLeaves(){
      this.loading = true
      try{
        const res = await this.$secured.get("api/v2/leaves?page="+this.page+"&per_page="+this.perPage)
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
      this.len = l
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
  .leaves-credits{
    font-size: 13px;
  }
  .ant-picker{
    border-radius: 8px;
    padding: 12px 16px;
  }
  .title{
    padding: 15px; 
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
