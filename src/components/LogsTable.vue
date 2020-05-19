<template>
  <section>
    <button @click="deleteRecords">DELETE ALL</button>
    <b-field grouped group-multiline>
        <div class="control">
            <b-switch>Sistema</b-switch>
        </div>
    </b-field>

    <b-table
        :data="logs"
        :loading="isLoading"
        :striped="isStriped"
        :hoverable="isHoverable"

        paginated
        backend-pagination
        :total="totalRows"
        :per-page="perPage"
        @page-change="onPageChange"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"

        backend-sorting
        :default-sort-direction="defaultSortOrder"
        :default-sort="[sortField, sortOrder]"
        @sort="onSort">

        <template slot-scope="props">
            <b-table-column field="date" label="Data" sortable :class="{ 'system' : isSystem(props.row), person: isPerson(props.row) }" width="120">
                {{ props.row.date }}
            </b-table-column>

            <b-table-column searchable field="who" label="Entità">
                <template
                  slot="searchable"
                  slot-scope="props">
                  <b-input
                    v-model="props.filters[props.column.field]"
                    placeholder="Cerca"
                    icon="magnify"
                    size="is-small" />
                </template>
                <span class="tag" :class="{ 'system' : isSystem(props.row), personBg: isPerson(props.row), animalBg: isAnimal(props.row), emoteBg: isEmote(props.row) }">
                    {{ props.row.who }}
                </span>
            </b-table-column>

            <b-table-column searchable field="message" label="Messaggio" :class="{ 'system' : isSystem(props.row), animal: isAnimal(props.row), person: isPerson(props.row), emote: isEmote(props.row) }">
                <template
                    slot="searchable"
                    slot-scope="props">
                    <b-input
                      v-model="props.filters[props.column.field]"
                      placeholder="Cerca nel messaggio"
                      icon="magnify"
                      size="is-small" />
                </template>
              {{ props.row.message }}
            </b-table-column>
        </template>
    </b-table>

  </section>
</template>

<script>
/* eslint-disable no-unused-vars */
const nedb = require('./../nedb.js')
const dateformat = require('dateformat')
export default {
  mounted() {
    this.fetchData();
    setInterval(() => { this.fetchData(); }, 1000)
  },
  computed: {
    totalRows() {
      return this.logs.length / this.perPage;
    }
  },
  data() {
    return {
      defaultSortOrder : "-1",
      sortOrder : "-1",
      perPage: 20,
      sortField: 'date',
      logs: [],
      columns : [
        {
          field: 'date',
          label: 'Data',
          searchable: false
        },
        {
          field: 'who',
          label: 'Owner',
          searchable: true
        },
        {
          field: 'message',
          label: 'Messaggio',
          searchable: true
        }
      ],
      isStriped: true,
      isHoverable: true,
      isLoading: false,
    }
  },
  methods: {
    isSystem(row) {
      return row.who === 'Sistema'
    },
    isAnimal(row) {
      return (row.message.substr(0,1) === '(') && (row.message.substr(-1) === ')')
    },
    isPerson(row) {
      return !this.isAnimal(row) && !this.isSystem(row)
    },
    isEmote(row) {
      return row.message.substr(0,1) === '*' && row.message.substr(-1) === '*'
    },
    fetchData() {
      // this.isLoading = true
      nedb.getLog({deleted:false}).then(res => {
        this.logs = res.x.map(o => { 
          return { "date": dateformat( new Date(o.date), 'dd/mm @ HH:MM'), "who":o.who, "message":o.message } 
        })
      })
    },
    onPageChange() {

    },
    onSort() {

    },
    deleteRecords() {
      nedb.deleteLogs().then(() => {
        console.log('Deletion done')
      })
    }
  }
}
</script>
<style>
.tag:not(body) {
  height:1.6em!important;
}
input.input {
  padding-left: 10px!important;
}
.th-wrap > span, .control.is-small {
  width: 98%!important;
}
.table td, .table th {
  font-size: 0.92rem!important;
  padding: 0.2em 0.3em!important;
}
.system {
  color: #b6b1b1!important;
  font-style: italic!important;
}
.person {
  color: black!important;
  font-style: italic!important;
  font-weight: 500!important;
}
.personBg {
  background-color: #4e8e8b!important;
  color: white!important;
}
.animal {
  color: rgb(188, 192, 136)!important;
  font-style: italic!important;
}
.animalBg {
  background-color: #bbc08a!important;
  color: white!important;
}
.emote {
  color: rgb(144, 23, 153)!important;
  font-style: italic!important;
}
.emoteBg {
  background-color: rgb(186, 146, 189)!important;
  color: white!important;
  font-style:italic!important;
}
</style>