<template>
  <div class="material-pdf">
    <h1>Material PDF</h1>
    <p>Encontre abaixo a lista de materiais disponíveis para download:</p>

    <table class="pdf-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Descrição</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in materials" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ item.description }}</td>
          <td>
            <a :href="item.file" target="_blank" rel="noopener noreferrer" class="download-link">
              Baixar PDF
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import api from '../plugins/axios'

export default {
  data() {
    return {
      materials: [],
    };
  },
  methods: {
    async fetchMaterials() {
      try {
        const response = await api.get('/api/materials/');
        this.materials = response.data;
      } catch (error) {
        console.error("Erro ao buscar materiais:", error);
      }
    },
  },
  created() {
    this.fetchMaterials();
  },
};
</script>

<style>
.material-pdf {
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
}

.material-pdf h1 {
  text-align: center;
  margin-bottom: 20px;
}

.material-pdf p {
  text-align: center;
  margin-bottom: 20px;
}

.pdf-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
}

.pdf-table th,
.pdf-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.pdf-table th {
  background-color: #4CAF50;
  color: white;
}

.pdf-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.pdf-table tr:hover {
  background-color: #ddd;
}

.download-link {
  color: #007BFF;
  text-decoration: none;
  font-weight: bold;
}

.download-link:hover {
  text-decoration: underline;
}
</style>
