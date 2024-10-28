<template>
  <div class="container mt-5">
    <table class="table table-bordered table-hover table-fixed">
      <thead>
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            :style="index === headers.length - 1 ? 'border-right: none;' : ''"
          >
            {{ header }}
          </th>
          <th class="border-0 action-column"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in data" :key="index" @click="toggleRow(index)"
            :class="{ 'table-active': activeRowIndex === index }">
          <td
            v-for="(header, idx) in headers"
            :key="idx"
            :style="idx === headers.length - 1 ? 'border-right: none;' : ''"
          >
            {{ item[header] }}
          </td>
          <td class="border-0 action-column">
            <div v-if="activeRowIndex === index" style="display: flex; justify-content: center; align-item: center;">
              <button class="btn custom-btn" style="background-color: #fff; display: flex; justify-content: center; align-item: center; margin-right: 8px;" @click.stop="handleAction('edit', item)">
                <img src="@/assets/icon/info-48.png" alt="Edit" style="width: 16px; height: 16px;">
              </button>
              <button class="btn custom-btn" style="background-color: #fff; display: flex; justify-content: center; align-item: center;" @click.stop="handleAction('delete', item)">
                <img src="@/assets/icon/delete-48.png" alt="Delete" style="width: 16px; height: 16px;">
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'DynamicTable',
  props: {
    headers: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activeRowIndex: null,
    };
  },
  methods: {
    toggleRow(index) {
      if (this.activeRowIndex === index) {
        this.activeRowIndex = null;
      } else {
        this.activeRowIndex = index;
      }
    },
    handleAction(action, item) {
      if (action === 'edit') {
        console.log('Editing:', item);
      } else if (action === 'delete') {
        console.log('Deleting:', item);
      }
    },
  },
};
</script>

<style scoped>
.table-fixed {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse; /* Đảm bảo border-collapse */
}

.action-column {
  width: 150px;
  text-align: center;
}

th:last-child, td:last-child {
  border-right: none;
}
</style>
