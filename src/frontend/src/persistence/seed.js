/**
 * Dados de demonstração no modelo normalizado (projeto → etapa → tarefa → subtarefa, etiquetas).
 * IDs estáveis para o mesmo conjunto aparecer em toda instalação vazia.
 */

const COLLECTIONS = ['projects', 'stages', 'tasks', 'subtasks', 'labels', 'taskLabels']

const T0 = Date.parse('2026-10-01T15:00:00.000Z')

function iso(minutesBefore) {
  return new Date(T0 - minutesBefore * 60_000).toISOString()
}

/**
 * @param {unknown} data
 * @returns {boolean}
 */
export function isEmptyData(data) {
  if (!data || typeof data !== 'object') return true
  return COLLECTIONS.every(
    (key) => !Array.isArray(data[key]) || data[key].length === 0
  )
}

function stage(id, projectId, nome, ordem, minutesBefore) {
  return { id, projectId, nome, ordem, criadoEm: iso(minutesBefore) }
}

function task(id, projectId, stageId, titulo, descricao, ordem, minutesBefore) {
  const at = iso(minutesBefore)
  return {
    id,
    projectId,
    stageId,
    titulo,
    descricao,
    ordem,
    criadoEm: at,
    atualizadoEm: at
  }
}

function subtasksFor(taskId, items) {
  return items.map(([texto, concluida], index) => ({
    id: `${taskId}-sub-${index + 1}`,
    taskId,
    texto,
    concluida,
    ordem: index + 1
  }))
}

/**
 * @returns {{
 *   projects: Object[],
 *   stages: Object[],
 *   tasks: Object[],
 *   subtasks: Object[],
 *   labels: Object[],
 *   taskLabels: { taskId: string, labelId: string }[]
 * }}
 */
export function createSeedData() {
  const projects = [
    {
      id: 'proj-site-x',
      nome: 'Site X',
      descricao: 'Landing page da nova campanha de outubro',
      criadoEm: iso(150),
      atualizadoEm: iso(90)
    },
    {
      id: 'proj-app-mobile',
      nome: 'App Mobile',
      descricao: 'Versão 1.0 para clientes',
      criadoEm: iso(200),
      atualizadoEm: iso(110)
    },
    {
      id: 'proj-estudo-vue',
      nome: 'Estudo Vue',
      descricao: '',
      criadoEm: iso(240),
      atualizadoEm: iso(130)
    }
  ]

  const stages = [
    stage('st-site-todo', 'proj-site-x', 'A Fazer', 1, 150),
    stage('st-site-doing', 'proj-site-x', 'Em Andamento', 2, 149),
    stage('st-site-done', 'proj-site-x', 'Concluído', 3, 148),
    stage('st-app-backlog', 'proj-app-mobile', 'Backlog', 1, 200),
    stage('st-app-dev', 'proj-app-mobile', 'Em Desenvolvimento', 2, 199),
    stage('st-app-ready', 'proj-app-mobile', 'Pronto', 3, 198),
    stage('st-vue-learn', 'proj-estudo-vue', 'Aprendendo', 1, 240),
    stage('st-vue-practice', 'proj-estudo-vue', 'Praticando', 2, 239)
  ]

  const tasks = [
    task(
      'task-homepage',
      'proj-site-x',
      'st-site-todo',
      'Escrever homepage',
      'Copy da hero, seções de features e CTA final.',
      1,
      140
    ),
    task('task-refs', 'proj-site-x', 'st-site-todo', 'Pesquisar referências', '', 2, 139),
    task('task-domain', 'proj-site-x', 'st-site-todo', 'Comprar domínio', '', 3, 138),
    task('task-assets', 'proj-site-x', 'st-site-todo', 'Preparar assets', '', 4, 137),
    task('task-hero', 'proj-site-x', 'st-site-doing', 'Ajustar hero', '', 1, 136),
    task('task-copy', 'proj-site-x', 'st-site-doing', 'Revisar textos', '', 2, 135),
    task('task-publish', 'proj-site-x', 'st-site-done', 'Publicar', '', 1, 134),
    task(
      'task-onboarding',
      'proj-app-mobile',
      'st-app-backlog',
      'Mapear fluxo de onboarding',
      '',
      1,
      120
    ),
    task('task-components', 'proj-app-mobile', 'st-app-backlog', 'Componentes base', '', 2, 119),
    task('task-login', 'proj-app-mobile', 'st-app-dev', 'Tela de login', '', 1, 118),
    task('task-tabs', 'proj-app-mobile', 'st-app-dev', 'Navegação por tabs', '', 2, 117),
    task('task-beta', 'proj-app-mobile', 'st-app-ready', 'Publicar beta interno', '', 1, 116),
    task('task-pinia', 'proj-estudo-vue', 'st-vue-learn', 'Estudar Pinia', '', 1, 100),
    task(
      'task-reactivity',
      'proj-estudo-vue',
      'st-vue-learn',
      'Ler docs de reatividade',
      '',
      2,
      99
    ),
    task(
      'task-refactor',
      'proj-estudo-vue',
      'st-vue-practice',
      'Refatorar exemplo kanban',
      '',
      1,
      98
    )
  ]

  const subtasks = [
    ...subtasksFor('task-homepage', [
      ['Definir copy', true],
      ['Escolher imagens', true],
      ['Escrever CTA', false],
      ['Montar wireframe', false],
      ['Revisar SEO', false]
    ]),
    ...subtasksFor('task-hero', [
      ['Trocar banner', true],
      ['Redigir título', false],
      ['Ajustar cores', false]
    ]),
    ...subtasksFor('task-publish', [
      ['Deploy', true],
      ['Configurar DNS', true]
    ]),
    ...subtasksFor('task-components', [
      ['Botões', true],
      ['Inputs', false],
      ['Cards', false]
    ]),
    ...subtasksFor('task-login', [
      ['Markup', true],
      ['Validação', false],
      ['Estados de erro', false]
    ]),
    ...subtasksFor('task-pinia', [
      ['Ler docs', true],
      ['Fazer exercício', false]
    ])
  ]

  const labels = [
    { id: 'lbl-urgente', projectId: 'proj-site-x', nome: 'urgente', cor: 'rose' },
    { id: 'lbl-cliente-a', projectId: 'proj-site-x', nome: 'cliente A', cor: 'sky' },
    { id: 'lbl-estudo', projectId: 'proj-site-x', nome: 'estudo', cor: 'amber' },
    { id: 'lbl-bug', projectId: 'proj-app-mobile', nome: 'bug', cor: 'orange' },
    { id: 'lbl-prioridade', projectId: 'proj-estudo-vue', nome: 'prioridade', cor: 'emerald' }
  ]

  const taskLabels = [
    { taskId: 'task-homepage', labelId: 'lbl-urgente' },
    { taskId: 'task-homepage', labelId: 'lbl-cliente-a' },
    { taskId: 'task-refs', labelId: 'lbl-estudo' },
    { taskId: 'task-hero', labelId: 'lbl-cliente-a' },
    { taskId: 'task-publish', labelId: 'lbl-urgente' },
    { taskId: 'task-login', labelId: 'lbl-bug' },
    { taskId: 'task-pinia', labelId: 'lbl-prioridade' }
  ]

  return { projects, stages, tasks, subtasks, labels, taskLabels }
}
