<template>
    <div>
        <DynamicTable :headers="tableHeaders" :data="tableData" />
    </div>
</template>

<script>
import DynamicTable from '@/components/DynamicTable.vue'; // Import component
import { fakeData } from '@/data/fakeData.js'; // Import fake data

export default {
  name: 'EmployeePage',
  components: {
    DynamicTable, // Đăng ký component
  },
  data() {
    return {
      tableHeaders: ['Name', 'Age', 'Email'], // Tiêu đề của bảng
      tableData: fakeData, // Sử dụng dữ liệu giả
    };
  },
};
</script>