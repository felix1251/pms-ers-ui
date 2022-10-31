<template>
  <v-card>
    <template #title>
      <div class="d-flex gap-3 space-between align-center">
        <span>LEAVE</span>
        <v-icon class="table-icon" size="28" icon="mdi-plus-circle-outline"/>
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
                <v-chip v-else-if="item.status == 'R'" variant="outlined" color="error">
                  Rejected
                </v-chip>
                <v-chip v-else variant="outlined" color="warning">
                  Voided
                </v-chip>
              </td>
              <td class="text-center">
                <VIcon class="table-icon" size="20" start icon="mdi-eye"/>
                <VIcon class="table-icon" v-if="item.status == 'P'" size="20" start icon="mdi-edit"/>
                <VIcon class="table-icon" v-if="item.status == 'P'" size="20" start icon="mdi-close-box"/>
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
</template>

<script>
export default {
  name: "leave",
  data(){
    return {
      page: 1,
      perPage: 10,
      len: 1,
      data: [],
      loading: true,
      absolute: true,
    }
  },
  mounted() {
    this.getLeaves()
  },
  methods: {
    async getLeaves(){
      document.getElementById("overlay").style.display = "block" 
      try{
        const res = await this.$secured.get("api/v2/leaves?page="+this.page+"&per_page="+this.perPage)
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
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
