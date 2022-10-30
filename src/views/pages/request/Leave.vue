<template>
  <v-card title="LEAVE">
    <v-card-text>
      <v-table style="min-height: 60vh;">
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
            :key="item.name"
          >
            <td>{{ item.created_at }}</td>
            <td>{{ item.dates }}</td>
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
      <v-pagination
        v-model="page"
        :length="2"
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
      data: [
          {
            created_at: 'Jan 1, 2022',
            dates: "Jan 3 - Jan 4 2021",
            days: 1,
            type: "Leave With Pay",
            reason: "Sick Sick Sick Sick Sick Sick Sick Sick Sick Sick Sick",
            status: "P",
          },
          {
            created_at: 'Jan 1, 2022',
            dates: "Jan 3 - Jan 4 2021",
            days: 1,
            type: "Leave With Pay",
            reason: "Sick",
            status: "A",
          },
          {
            created_at: 'Jan 1, 2022',
            dates: "Jan 3 - Jan 4 2021",
            days: 1,
            type: "Leave With Pay",
            reason: "Sick",
            status: "V",
          },
          {
            created_at: 'Jan 1, 2022',
            dates: "Jan 3 - Jan 4 2021",
            days: 1,
            type: "Leave With Pay",
            reason: "Sick",
            status: "R",
          },
        ],
    }
  },
  methods: {
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
  tr > td {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
