const fs = require('fs');
const path = require('path');

// Caminho do arquivo onde as tarefas serão armazenadas
const filePath = path.join(__dirname, 'data', 'tasks.json');

// Carrega as tarefas do arquivo JSON (ou retorna um array vazio se não existir)
function loadTasks() {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// Salva a lista de tarefas no arquivo JSON
function saveTasks(tasks) {
    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

// Retorna uma string indicando quanto tempo se passou desde a data fornecida
function timeSince(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    const units = [
        { name: 'ano', seconds: 31536000 },
        { name: 'mês', seconds: 2592000 },
        { name: 'dia', seconds: 86400 },
        { name: 'hora', seconds: 3600 },
        { name: 'minuto', seconds: 60 },
        { name: 'segundo', seconds: 1 },
    ];

    for (let unit of units) {
        const value = Math.floor(seconds / unit.seconds);
        if (value > 0) {
            return `há ${value} ${unit.name}${value > 1 ? 's' : ''}`;
        }
    }
    return 'agora mesmo';
}

// Adiciona uma nova tarefa com descrição, prioridade e prazo
function addTask(description, priority = 'média', deadline = '') {
    const tasks = loadTasks();
    const newTask = {
        id: Date.now(),
        description,
        createdAt: new Date().toISOString(),
        completed: false,
        priority,
        deadline
    };
    tasks.push(newTask);
    saveTasks(tasks);
    console.log('✅ Tarefa adicionada!');
}

// Lista todas as tarefas, separando entre pendentes e concluídas
function listTasks() {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log('📭 Nenhuma tarefa encontrada.');
        return;
    }

    const pendentes = tasks.filter(t => !t.completed);
    const concluidas = tasks.filter(t => t.completed);

    console.log(`\n📈 Total: ${tasks.length} | Pendentes: ${pendentes.length} | Concluídas: ${concluidas.length}`);

    console.log('\n📋 Tarefas pendentes:');
    if (pendentes.length === 0) console.log('  - Nenhuma');
    pendentes.forEach(task => {
        console.log(`[ ] (${task.id}) ${task.description} [${task.priority}] - Criada ${timeSince(task.createdAt)}`);
        if (task.deadline) console.log(`   📅 Vence em: ${task.deadline}`);
    });

    console.log('\n✅ Tarefas concluídas:');
    if (concluidas.length === 0) console.log('  - Nenhuma');
    concluidas.forEach(task => {
        console.log(`[✔] (${task.id}) ${task.description} [${task.priority}] - Criada ${timeSince(task.createdAt)}`);
    });
}

// Remove uma tarefa com base no ID informado
function removeTask(id) {
    const tasks = loadTasks();
    const newTasks = tasks.filter(task => task.id !== parseInt(id));
    saveTasks(newTasks);
    console.log('🗑️ Tarefa removida.');
}

// Marca uma tarefa como concluída com base no ID
function markAsCompleted(id) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.completed = true;
        saveTasks(tasks);
        console.log('✅ Tarefa marcada como concluída!');
    } else {
        console.log('⚠️ Tarefa não encontrada.');
    }
}

// Filtra e exibe tarefas que contenham uma palavra-chave na descrição
function filterTasks(keyword) {
    const tasks = loadTasks();
    const filtered = tasks.filter(t => t.description.includes(keyword));
    if (filtered.length === 0) {
        console.log('🔍 Nenhuma tarefa encontrada com essa palavra.');
        return;
    }
    filtered.forEach(task => {
        console.log(`[${task.completed ? '✔' : ' '}] (${task.id}) ${task.description} [${task.priority}]`);
    });
}

// Remove todas as tarefas que já foram concluídas
function removeCompletedTasks() {
    const tasks = loadTasks();
    const pending = tasks.filter(t => !t.completed);
    saveTasks(pending);
    console.log('🧹 Tarefas concluídas removidas.');
}

// Cria um backup do arquivo de tarefas atual em um novo arquivo JSON com timestamp
function backupTasks() {
    const tasks = loadTasks();
    const backupPath = path.join(__dirname, 'data', `backup-${Date.now()}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(tasks, null, 2));
    console.log('💾 Backup criado.');
}

// Sugere a próxima tarefa com base na prioridade (alta > média > baixa)
function suggestNextTask() {
    const tasks = loadTasks();
    const pending = tasks.filter(t => !t.completed);
    const sorted = pending.sort((a, b) => {
        const p = { alta: 1, média: 2, baixa: 3 };
        return p[a.priority] - p[b.priority];
    });
    const next = sorted[0];
    if (next) {
        console.log(`🔔 Próxima tarefa sugerida: ${next.description} [${next.priority}]`);
    } else {
        console.log('🎉 Nenhuma tarefa pendente!');
    }
}

// Edita uma tarefa existente com novos valores de descrição, prioridade e/ou prazo
function editTask(id, newDesc, newPriority, newDeadline) {
    const tasks = loadTasks();
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
        console.log('⚠️ Tarefa não encontrada.');
        return;
    }
    if (newDesc) task.description = newDesc;
    if (newPriority) task.priority = newPriority;
    if (newDeadline !== undefined) task.deadline = newDeadline;
    saveTasks(tasks);
    console.log('✏️ Tarefa atualizada!');
}

// Exporta todas as funções para uso em outros arquivos
module.exports = {
    addTask,
    listTasks,
    removeTask,
    markAsCompleted,
    filterTasks,
    removeCompletedTasks,
    backupTasks,
    suggestNextTask,
    editTask
};
