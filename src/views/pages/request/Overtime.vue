<template>
  <v-card>
    <template #title>
      <div class="d-flex gap-3 space-between align-center">
        <span>OVERTIME</span>
        <v-icon 
          @click.prevent="openModal('A')" 
          class="table-icon" 
          size="28" 
          icon="mdi-plus-circle-outline"
        />
      </div>
    </template>
    <v-card-text style="padding: 0px">
      <div style="position: relative; min-height: 63vh;">
        <div id="overlay">
          <div style="display: flex; align-items: center; justify-content: center; height: 100%">
            <v-progress-circular
              indeterminate
              size="64"
              color="info"
            >
            </v-progress-circular>
          </div>
        </div>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Date Filed</th>
              <th class="text-left">Overtime Date/end_time</th>
              <th class="text-left">Hours</th>
              <th class="text-left">Billable</th>
              <th class="text-left">Expected Output</th>
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
              <td>{{ item.datetime }}</td>
              <td>{{ item.hours }}</td>
              <td>
                <v-chip v-if="item.billable" variant="outlined" color="success">
                  Yes
                </v-chip>
                <v-chip v-else variant="outlined" color="error">
                  No
                </v-chip>
              </td>
              <td>{{ item.output }}</td>
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
                <VIcon class="table-icon" @click.prevent="voidOvertime(item.id)" v-if="item.status == 'P'" size="20" start icon="mdi-close-box"/>
              </td>
            </tr>
          </tbody>
        </v-table>
      </div>
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
                    :show-time="{ format: 'hh:mm A' }"
                    v-model:value="date"
                    :disabled="modalType == 'V'"
                    format="MMM DD, YYYY hh:mm A"
                    :placeholder="['Start Time', 'End Time']"
                    :getPopupContainer="(trigger) => trigger.parentNode"
                  />
                  <label 
                    style="margin-left: 15px; color: #FF4C51; font-size: 13px" 
                    v-if="selectionRequired"
                  >
                    {{selectionRequiredMsg}}
                  </label>
                </v-col>
                <v-col cols="12" sm="6" md="12">
                  <v-switch 
                    v-model="form.billable"  
                    label="Billable"
                    style="width: 100px"
                    inset
                    color="info"
                  />
                  <span>For offset reason, set to non-billable.</span>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-textarea 
                    v-model="form.output" 
                    color="info" 
                    variant="outlined" 
                    auto-grow 
                    label="Expected Output" 
                    rows="7" 
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
const formDefault = { output: null, billable: true}
import { Modal } from 'ant-design-vue';
export default {
  name: "overtime",
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
    }
  },
  watch: {
    page(value){
      this.page = value
      this.getOvertimes()
    }
  },
  mounted() {
    this.getOvertimes()
  },
  methods: {
    openModal(type, id){
      this.modalType = type
      this.modal = true
      if(type == 'V' || type == 'E'){
        if(type == 'V') this.modalTitle = "VIEW OVERTIME"
        if(type == 'E') this.modalTitle = "EDIT OVERTIME"
        this.getOvetimeById(id)
      }else{
        this.modalTitle = "CREATE OVERTIME"
      }
    },
    closeModal(){
      this.modal = false
      this.$refs.form.reset()
      this.date = null
      this.selectionRequired = false
      this.selectionRequiredMsg = ""
    },
    voidOvertime(id){
      Modal.confirm({
        title: 'Void Overtime',
        zIndex: 999999999,
        content: "Are you sure you want to permanently void this overtime?",
        okText: "Void",
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onOk: () => {
          return new Promise((resolve, reject) => {
            this.$secured.delete("api/v2/overtimes/"+id)
              .then(()=>{
                this.$notification["success"]({message: "Overtime", description: "Overtime successfully voided"});
                resolve()
                this.getOvertimes()
              })
              .catch(error => {
                reject()
                if(error.response && error.response.status == 401) return
                this.$notification["error"]({message: "Overtime", description: "Something is wrong"})
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
        start_date: new Date(this.date[0]),
        end_date: new Date(this.date[1]),
        output: this.form.output,
        billable: this.form.billable
      }
      try{
        const res = await this.$secured.put("api/v2/overtimes/"+this.form.id, {overtime: params})
        this.$notification["success"]({message: "Overtime", description: "Overtime successfully created"});
        this.closeModal()
        this.getOvertimes()
      }catch (error){
        this.crudLoading = false
        if(error.response && error.response.status == 401) return
        if (error.response.data.end_date) { 
          this.selectionRequired = true 
          this.selectionRequiredMsg = "date range overlapse or exist on previous records"
          this.$notification["error"]({message: "Overtime", description: error.response.data.end_date[0]})
        }else {
          this.$notification["error"]({message: "Overtime", description: "something is wrong"})
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
        start_date: new Date(this.date[0]),
        end_date: new Date(this.date[1]),
        output: this.form.output,
        billable: this.form.billable
      }
      try{
        const res = await this.$secured.post("api/v2/overtimes", {overtime: params})
        this.$notification["success"]({message: "Overtime", description: "Overtime successfully created"});
        this.closeModal()
        this.getOvertimes()
      }catch (error){
        this.crudLoading = false
        if(error.response && error.response.status == 401) return
        if (error.response.data.end_date) { 
          this.selectionRequired = true
          this.selectionRequiredMsg = "date range overlapse or exist on previous records"
          this.$notification["error"]({message: "Overtime", description: error.response.data.end_date[0]})
        }else {
          this.$notification["error"]({message: "Overtime", description: "something is wrong"})
        }
      }
      this.crudLoading = false
    },
    async getOvetimeById(id){
      try{
        const res = await this.$secured.get("api/v2/overtimes/"+id)
        this.form.id = res.data.id
        this.form.billable = res.data.billable
        this.form.output = res.data.output
        this.date = [dayjs(res.data.start_date), dayjs(res.data.end_date)]
      }catch(error){
        console.log(error.response)
      }
    },
    async getOvertimes(){
      document.getElementById("overlay").style.display = "block" 
      try{
        const res = await this.$secured.get("api/v2/overtimes?page="+this.page+"&per_page="+this.perPage)
        this.data = res.data.data
        this.generateLength(res.data.total_count)
      }catch(error){
        console.log(error.response)
      }
      document.getElementById("overlay").style.display = "none";
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
