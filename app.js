const readline = require('readline');
const tasks = require('./tasks');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showMenu() {
    console.log(`
=== GERENCIADOR DE TAREFAS ===
1. Adicionar tarefa
2. Listar tarefas
3. Remover tarefa
4. Marcar como concluída
5. Filtrar tarefas
6. Remover todas as concluídas
7. Sugerir próxima tarefa
8. Editar tarefa
9. Sair
`);
    rl.question('Escolha uma opção: ', option => {
        switch (option) {
            case '1':
                rl.question('Descrição da tarefa: ', desc => {
                    rl.question('Prioridade (alta, média, baixa): ', priority => {
                        rl.question('Data limite (AAAA-MM-DD) [opcional]: ', deadline => {
                            tasks.addTask(desc, priority.toLowerCase(), deadline || '');
                            showMenu();
                        });
                    });
                });
                break;
            case '2':
                tasks.listTasks();
                showMenu();
                break;
            case '3':
                rl.question('ID da tarefa para remover: ', id => {
                    tasks.removeTask(id);
                    showMenu();
                });
                break;
            case '4':
                rl.question('ID da tarefa para marcar como concluída: ', id => {
                    tasks.markAsCompleted(id);
                    showMenu();
                });
                break;
            case '5':
                rl.question('Palavra-chave para filtrar: ', keyword => {
                    tasks.filterTasks(keyword);
                    showMenu();
                });
                break;
            case '6':
                tasks.removeCompletedTasks();
                showMenu();
                break;
            case '7':
                tasks.suggestNextTask();
                showMenu();
                break;
            case '8':
                rl.question('ID da tarefa para editar: ', id => {
                    rl.question('Nova descrição (deixe em branco para manter): ', desc => {
                        rl.question('Nova prioridade (alta, média, baixa ou vazio): ', priority => {
                            rl.question('Nova data limite (AAAA-MM-DD ou vazio para remover): ', deadline => {
                                tasks.editTask(id, desc || null, priority || null, deadline === '' ? '' : deadline);
                                showMenu();
                            });
                        });
                    });
                });
                break;
            case '9':
                tasks.backupTasks();
                rl.close();
                break;
            default:
                console.log('⚠️ Opção inválida.');
                showMenu();
        }
    });
}

showMenu();
