<template>
    <div class="videoaulas">
        <h1>Videoaulas</h1>
        <div class="grid-container">
            <div class="grid-item">Meteorologia</div>
            <div class="grid-item">Navegação</div>
            <div class="grid-item">Regulamentos</div>
            <div class="grid-item">Teoria de Voo</div>
            <div class="grid-item">Conhecimento Técnico de Aeronaves</div>
            <div class="grid-item">Motores</div>
            <div class="grid-item">Aulas de Questões Resolvidas</div>
            <div class="grid-item">Aulas de Revisão</div>
            <div class="grid-item">Aulas Extras</div>
            <div class="grid-item">Materiais Extras</div>
        </div>
    </div>
</template>

<script setup>
// Script está vazio por enquanto, mas você pode adicionar funcionalidades depois
</script>

<style scoped>
.videoaulas {
    padding: 20px;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
}

.grid-item {
    background-color: #f0f0f0;
    padding: 20px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.grid-item:hover {
    background-color: #e0e0e0;
}
</style>