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
            <a :href="item.link" target="_blank" rel="noopener noreferrer" class="download-link">
              Baixar PDF
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      materials: [
        {
          description: "Manual de Estudo para Prova ANAC",
          link: "https://example.com/manual-estudo.pdf",
        },
        {
          description: "Regras de Espaço Aéreo",
          link: "https://example.com/regras-espaco-aereo.pdf",
        },
        {
          description: "Checklist de Manutenção de Aeronaves",
          link: "https://example.com/checklist-manutencao.pdf",
        },
        // Adicione mais itens aqui
      ],
    };
  },
};
</script>

