/* Kanban Local — protótipo interativo de UX (UX Designer)
   Persistência: localStorage (kanban:prototype:v1) */
"use strict";

const KEY = "kanban:prototype:v1";
const CORES = {
  rose:    {bg:"#FFE4E6", fg:"#BE123C", dot:"#F43F5E"},
  orange:  {bg:"#FFEDD5", fg:"#C2410C", dot:"#F97316"},
  amber:   {bg:"#FEF3C7", fg:"#B45309", dot:"#F59E0B"},
  emerald: {bg:"#D1FAE5", fg:"#047857", dot:"#10B981"},
  teal:    {bg:"#CCFBF1", fg:"#0F766E", dot:"#14B8A6"},
  sky:     {bg:"#E0F2FE", fg:"#0369A1", dot:"#0EA5E9"},
  violet:  {bg:"#EDE9FE", fg:"#6D28D9", dot:"#8B5CF6"},
  purple:  {bg:"#F3E8FF", fg:"#7E22CE", dot:"#A855F7"}
};

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid = p => p + Math.random().toString(36).slice(2, 8);
const norm = s => String(s == null ? "" : s).toLowerCase();

/* ---------------- seed ---------------- */
function seed(){
  const t = Date.now();
  const P1 = uid("p"), P2 = uid("p"), P3 = uid("p");
  const mk = (projetoId, nomes, base) => nomes.map((n, i) => ({id:uid("e"), projetoId, nome:n, ordem:i, criadoEm:base + i}));
  const etapas = [
    ...mk(P1, ["A Fazer", "Em Andamento", "Concluído"], t - 90000),
    ...mk(P2, ["Backlog", "Em Desenvolvimento", "Pronto"], t - 80000),
    ...mk(P3, ["Aprendendo", "Praticando"], t - 70000)
  ];
  const eId = (pid, nome) => etapas.find(e => e.projetoId === pid && e.nome === nome).id;
  const sub = arr => arr.map(x => ({id:uid("s"), titulo:x[0], done:x[1]}));
  const tarefas = [
    {id:uid("t"), projetoId:P1, etapaId:eId(P1,"A Fazer"), titulo:"Escrever homepage", descricao:"Copy da hero, seções de features e CTA final.", rotulos:[], concluida:false, criadoEm:t-60000, subtarefas:sub([["Definir copy",true],["Escolher imagens",true],["Escrever CTA",false],["Montar wireframe",false],["Revisar SEO",false]])},
    {id:uid("t"), projetoId:P1, etapaId:eId(P1,"A Fazer"), titulo:"Pesquisar referências", descricao:"", rotulos:[], concluida:false, criadoEm:t-59000, subtarefas:[]},
    {id:uid("t"), projetoId:P1, etapaId:eId(P1,"A Fazer"), titulo:"Comprar domínio", descricao:"", rotulos:[], concluida:false, criadoEm:t-58000, subtarefas:[]},
    {id:uid("t"), projetoId:P1, etapaId:eId(P1,"A Fazer"), titulo:"Preparar assets", descricao:"", rotulos:[], concluida:false, criadoEm:t-57000, subtarefas:[]},
    {id:uid("t"), projetoId:P1, etapaId:eId(P1,"Em Andamento"), titulo:"Ajustar hero", descricao:"", rotulos:[], concluida:false, criadoEm:t-56000, subtarefas:sub([["Trocar banner",true],["Redigir título",false],["Ajustar cores",false]])},
    {id:uid("t"), projetoId:P1, etapaId:eId(P1,"Em Andamento"), titulo:"Revisar textos", descricao:"", rotulos:[], concluida:false, criadoEm:t-55000, subtarefas:[]},
    {id:uid("t"), projetoId:P1, etapaId:eId(P1,"Concluído"), titulo:"Publicar", descricao:"", rotulos:[], concluida:true, criadoEm:t-54000, subtarefas:sub([["Deploy",true],["Configurar DNS",true]])},
    {id:uid("t"), projetoId:P2, etapaId:eId(P2,"Backlog"), titulo:"Mapear fluxo de onboarding", descricao:"", rotulos:[], concluida:false, criadoEm:t-50000, subtarefas:[]},
    {id:uid("t"), projetoId:P2, etapaId:eId(P2,"Backlog"), titulo:"Componentes base", descricao:"", rotulos:[], concluida:false, criadoEm:t-49000, subtarefas:sub([["Botões",true],["Inputs",false],["Cards",false]])},
    {id:uid("t"), projetoId:P2, etapaId:eId(P2,"Em Desenvolvimento"), titulo:"Tela de login", descricao:"", rotulos:[], concluida:false, criadoEm:t-48000, subtarefas:sub([["Markup",true],["Validação",false],["Estados de erro",false]])},
    {id:uid("t"), projetoId:P2, etapaId:eId(P2,"Em Desenvolvimento"), titulo:"Navegação por tabs", descricao:"", rotulos:[], concluida:false, criadoEm:t-47000, subtarefas:[]},
    {id:uid("t"), projetoId:P2, etapaId:eId(P2,"Pronto"), titulo:"Publicar beta interno", descricao:"", rotulos:[], concluida:true, criadoEm:t-46000, subtarefas:[]},
    {id:uid("t"), projetoId:P3, etapaId:eId(P3,"Aprendendo"), titulo:"Estudar Pinia", descricao:"", rotulos:[], concluida:false, criadoEm:t-40000, subtarefas:sub([["Ler docs",true],["Fazer exercício",false]])},
    {id:uid("t"), projetoId:P3, etapaId:eId(P3,"Aprendendo"), titulo:"Ler docs de reatividade", descricao:"", rotulos:[], concluida:false, criadoEm:t-39000, subtarefas:[]},
    {id:uid("t"), projetoId:P3, etapaId:eId(P3,"Praticando"), titulo:"Refatorar exemplo kanban", descricao:"", rotulos:[], concluida:false, criadoEm:t-38000, subtarefas:[]}
  ];
  const etiquetas = [
    {id:uid("l"), projetoId:P1, nome:"urgente",   cor:"rose",    criadoEm:t-95000},
    {id:uid("l"), projetoId:P1, nome:"cliente A", cor:"sky",     criadoEm:t-94000},
    {id:uid("l"), projetoId:P1, nome:"estudo",    cor:"amber",   criadoEm:t-93000},
    {id:uid("l"), projetoId:P2, nome:"bug",       cor:"orange",  criadoEm:t-92000},
    {id:uid("l"), projetoId:P3, nome:"prioridade",cor:"emerald", criadoEm:t-91000}
  ];
  const byTitle = x => tarefas.find(y => y.titulo === x);
  byTitle("Escrever homepage").rotulos = [etiquetas[0].id, etiquetas[1].id];
  byTitle("Ajustar hero").rotulos      = [etiquetas[1].id];
  byTitle("Publicar").rotulos          = [etiquetas[0].id];
  byTitle("Tela de login").rotulos     = [etiquetas[3].id];
  byTitle("Estudar Pinia").rotulos     = [etiquetas[4].id];
  return {
    projetos:[
      {id:P1, nome:"Site X",     descricao:"Landing page da nova campanha de outubro", criadoEm:t-90000},
      {id:P2, nome:"App Mobile", descricao:"Versão 1.0 para clientes",                 criadoEm:t-91000},
      {id:P3, nome:"Estudo Vue", descricao:"",                                         criadoEm:t-92000}
    ],
    etapas, etiquetas, tarefas, ui:{modo:"kanban"}
  };
}

/* ---------------- state ---------------- */
let state = null;
let storageOK = true;

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if(raw){
      const data = JSON.parse(raw);
      if(data && Array.isArray(data.projetos) && Array.isArray(data.tarefas)) return data;
    }
  }catch(err){
    setTimeout(() => toast("Dados ilegíveis no armazenamento — iniciando com dados de demonstração.", "warning"), 500);
  }
  return seed();
}
function save(){
  try{
    localStorage.setItem(KEY, JSON.stringify(state));
    storageOK = true;
    flashSaved();
    return true;
  }catch(err){
    storageOK = false;
    toast("Espaço do navegador insuficiente — alteração mantida apenas nesta sessão.", "danger");
    return false;
  }
}
function flashSaved(){
  const el = $("#save-status");
  el.textContent = "✓ salvo agora";
  el.classList.add("flash");
  clearTimeout(flashSaved._t);
  flashSaved._t = setTimeout(() => { el.textContent = "salvo localmente"; el.classList.remove("flash"); }, 1600);
}

/* ---------------- selectors ---------------- */
const getProj   = id => state.projetos.find(p => p.id === id);
const getEtapa  = id => state.etapas.find(e => e.id === id);
const getTarefa = id => state.tarefas.find(t => t.id === id);
const getEtq    = id => state.etiquetas.find(l => l.id === id);
const etapasDe  = pid => state.etapas.filter(e => e.projetoId === pid).sort((a,b) => a.ordem - b.ordem);
const tarefasDeEtapa = eid => state.tarefas.filter(t => t.etapaId === eid).sort((a,b) => a.criadoEm - b.criadoEm);
const tarefasDe = pid => state.tarefas.filter(t => t.projetoId === pid);
const etiquetasDe = pid => state.etiquetas.filter(l => l.projetoId === pid);
function subStats(t){
  const total = t.subtarefas.length;
  return {total, done: t.subtarefas.filter(s => s.done).length};
}
function statsProjeto(pid){
  const tfs = tarefasDe(pid);
  let st = 0, sd = 0;
  tfs.forEach(t => { const s = subStats(t); st += s.total; sd += s.done; });
  return {etapas:etapasDe(pid).length, tarefas:tfs.length, subTotal:st, subDone:sd};
}

/* ---------------- UI helpers ---------------- */
function progressHTML(done, total){
  if(!total) return "";
  const pct = Math.round(done / total * 100);
  return '<div class="progress-line"><div class="prog" role="progressbar" aria-valuenow="' + done + '" aria-valuemin="0" aria-valuemax="' + total + '" aria-label="' + done + ' de ' + total + ' subtarefas concluídas"><span style="width:' + pct + '%"></span></div><span class="prog-label">' + done + "/" + total + "</span></div>";
}
function chipsHTML(t, opts){
  opts = opts || {};
  const list = (t.rotulos || []).map(getEtq).filter(Boolean);
  let out = list.map(l => {
    const c = CORES[l.cor] || CORES.violet;
    const x = opts.removable ? '<button class="x" data-act="remove-label" data-task="' + t.id + '" data-label="' + l.id + '" aria-label="Remover etiqueta ' + esc(l.nome) + '">✕</button>' : "";
    return '<span class="chip" style="--c-bg:' + c.bg + ";--c-fg:" + c.fg + '">' + esc(l.nome) + x + "</span>";
  }).join("");
  if(opts.addBtn) out += '<button class="chip-add" data-act="task-labels" data-id="' + t.id + '">+ Etiquetas</button>';
  return out;
}
function emptyHTML(o){
  return '<div class="empty ' + (o.compact ? "compact" : "") + '">' +
    '<div class="ico" aria-hidden="true">' + (o.icon || "+") + "</div>" +
    "<h3>" + esc(o.title) + "</h3><p>" + esc(o.text) + "</p>" +
    (o.actLabel ? '<button class="btn btn-primary" data-act="' + o.act + '"' + (o.actId ? ' data-id="' + o.actId + '"' : "") + ">" + esc(o.actLabel) + "</button>" : "") +
    "</div>";
}
function toast(msg, type){
  type = type || "success";
  const el = document.createElement("div");
  el.className = "toast" + (type !== "success" ? " " + type : "");
  el.innerHTML = '<span class="ti" aria-hidden="true">' + (type === "success" ? "✓" : "!") + "</span><span>" + esc(msg) + "</span>";
  $("#toasts").appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; el.style.transition = ".3s"; setTimeout(() => el.remove(), 320); }, 4000);
}
function navigate(hash){ location.hash = hash; }
function renderActive(){
  const path = (location.hash.slice(1) || "/").split("?")[0];
  if(path === "/tarefas") renderTasksList();
  else if(path === "/subtarefas") renderSubsList();
  else if(path.startsWith("/projetos/")){ if(currentProject) renderProject(currentProject); }
  else renderHome();
  if(drawerTask) renderDrawer();
}

/* ---------------- router ---------------- */
let lastPath = null;
function setView(name){ $$(".view").forEach(v => { v.hidden = (v.id !== "view-" + name); }); }
function updateNav(path){
  const nav = path.startsWith("/projetos") ? "home" : path === "/tarefas" ? "tasks" : path === "/subtarefas" ? "subs" : "home";
  $$("[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === nav));
}
function route(){
  const raw = location.hash.slice(1) || "/";
  const parts = raw.split("?");
  const path = parts[0];
  const params = new URLSearchParams(parts[1] || "");
  if(path.startsWith("/projetos/")){
    const pid = path.split("/")[2];
    if(!$("#view-project").hidden && currentProject === pid){
      setView("project");
    } else {
      setView("project");
      renderProject(pid);
    }
    const tid = params.get("tarefa");
    if(tid) openDrawer(tid, params.get("sub")); else closeDrawer(false);
  } else if(path === "/tarefas"){
    closeDrawer(false); tasksFilter = ""; setView("tasks"); renderTasks();
  } else if(path === "/subtarefas"){
    closeDrawer(false); subsFilter = ""; subStatus = "todas"; setView("subs"); renderSubs();
  } else if(path === "/" || path === ""){
    closeDrawer(false); setView("home"); renderHome();
  } else {
    navigate("#/");
    return;
  }
  updateNav(path);
  if(lastPath !== path){ window.scrollTo(0, 0); lastPath = path; }
}

/* ---------------- VIEW: home ---------------- */
function renderHome(){
  const el = $("#view-home");
  const ps = [...state.projetos].sort((a,b) => b.criadoEm - a.criadoEm);
  const head = '<div class="page-head"><div><h1>Meus projetos</h1><p class="meta">' +
    (ps.length ? ps.length + (ps.length === 1 ? " projeto" : " projetos") + " · dados salvos apenas neste navegador" : "Nenhum projeto ainda") +
    '</p></div><div class="page-actions">' +
    (ps.length ? '<button class="btn btn-primary" data-act="new-project">+ Novo projeto</button>' : "") +
    "</div></div>";
  if(!ps.length){
    el.innerHTML = head + emptyHTML({icon:"+", title:"Nenhum projeto ainda",
      text:"Crie seu primeiro projeto para separar o trabalho por frentes e começar a organizar etapas e tarefas.",
      actLabel:"+ Criar primeiro projeto", act:"new-project"});
    return;
  }
  el.innerHTML = head + '<div class="grid">' + ps.map(projectCardHTML).join("") + "</div>";
}
function projectCardHTML(p){
  const s = statsProjeto(p.id);
  return '<article class="project-card">' +
    '<div class="pc-head">' +
      '<button class="pc-title" data-act="open-project" data-id="' + p.id + '">' + esc(p.nome) + "</button>" +
      '<button class="icon-btn" data-act="edit-project" data-id="' + p.id + '" aria-label="Editar projeto ' + esc(p.nome) + '">✎</button>' +
      '<button class="icon-btn danger" data-act="delete-project" data-id="' + p.id + '" aria-label="Excluir projeto ' + esc(p.nome) + '">✕</button>' +
    "</div>" +
    '<p class="pc-desc">' + (p.descricao ? esc(p.descricao) : '<span class="muted">Sem descrição</span>') + "</p>" +
    '<div class="pc-stats"><span><b>' + s.etapas + "</b> etapas</span><span><b>" + s.tarefas + "</b> tarefas</span><span><b>" + s.subDone + "/" + s.subTotal + "</b> subtarefas</span></div>" +
    (s.subTotal ? progressHTML(s.subDone, s.subTotal) : "") +
    '<div class="pc-foot"><button class="btn btn-sm" data-act="open-project" data-id="' + p.id + '">Abrir projeto →</button></div>' +
  "</article>";
}

/* ---------------- VIEW: projeto ---------------- */
let currentProject = null;
function renderProject(pid){
  const p = getProj(pid);
  if(!p){ toast("Projeto não encontrado.", "danger"); navigate("#/"); return; }
  currentProject = pid;
  const el = $("#view-project");
  const modo = (state.ui && state.ui.modo) || "kanban";
  const temEtapas = etapasDe(pid).length > 0;
  const head = '<div class="page-head"><div>' +
      '<a class="back-link" href="#/">← Projetos</a>' +
      "<h1>" + esc(p.nome) + "</h1>" +
      (p.descricao ? '<p class="meta">' + esc(p.descricao) + "</p>" : "") +
    '</div><div class="page-actions">' +
      '<button class="btn" data-act="labels-manager" data-id="' + pid + '"># Etiquetas</button>' +
      '<div class="segmented" role="group" aria-label="Modo de visualização">' +
        '<button data-act="set-modo" data-modo="kanban" aria-pressed="' + (modo === "kanban") + '">Kanban</button>' +
        '<button data-act="set-modo" data-modo="lista" aria-pressed="' + (modo === "lista") + '">Lista</button>' +
      "</div>" +
      '<button class="btn" data-act="new-stage" data-id="' + pid + '">+ Nova etapa</button>' +
      '<button class="btn btn-primary" data-act="new-task" data-id="' + pid + '"' + (temEtapas ? "" : ' disabled title="Crie uma etapa primeiro"') + ">+ Nova tarefa</button>" +
    "</div></div>";
  const body = !temEtapas
    ? emptyHTML({icon:"▤", title:"Este projeto ainda não tem etapas",
        text:"Crie etapas como “A Fazer”, “Em Andamento” e “Concluído” para montar o fluxo do seu kanban.",
        actLabel:"+ Criar primeira etapa", act:"new-stage", actId:pid})
    : (modo === "kanban" ? boardHTML(pid) : listHTML(pid));
  el.innerHTML = head + body;
}
function boardHTML(pid){
  return '<div class="board" role="list" aria-label="Quadro kanban">' + etapasDe(pid).map(colHTML).join("") + "</div>";
}
function colHTML(e){
  const tfs = tarefasDeEtapa(e.id);
  const cards = tfs.length ? tfs.map(taskCardHTML).join("") : '<p class="col-empty">Sem tarefas</p>';
  return '<section class="column" role="listitem" aria-label="' + esc(e.nome) + ", " + tfs.length + ' tarefas">' +
    '<div class="col-head"><span class="col-name">' + esc(e.nome) + '</span><span class="col-count">' + tfs.length + "</span>" +
      '<button class="icon-btn" data-act="stage-actions" data-id="' + e.id + '" aria-label="Ações da etapa ' + esc(e.nome) + '">⋯</button></div>' +
    '<div class="column-body" data-stage="' + e.id + '">' + cards + "</div>" +
    '<div class="col-foot"><button class="btn btn-sm add-inline" data-act="new-task" data-id="' + e.projetoId + '" data-stage="' + e.id + '">+ Adicionar tarefa</button></div>' +
  "</section>";
}
function taskCardHTML(t){
  const s = subStats(t);
  const prog = s.total
    ? '<div class="tc-sub">' + progressHTML(s.done, s.total) + "<span>subtarefas</span></div>"
    : '<div class="tc-sub"><span class="muted">sem subtarefas</span></div>';
  const chips = chipsHTML(t);
  return '<article class="task-card ' + (t.concluida ? "done" : "") + '" data-act="open-task" data-id="' + t.id + '" draggable="true" tabindex="0" aria-label="Tarefa ' + esc(t.titulo) + '">' +
    '<div class="tc-top">' +
      '<span class="check"><input type="checkbox" data-act="toggle-task" data-id="' + t.id + '"' + (t.concluida ? " checked" : "") + ' aria-label="Concluir tarefa ' + esc(t.titulo) + '"></span>' +
      '<h4 class="tc-title">' + esc(t.titulo) + "</h4>" +
      '<button class="tc-menu" data-act="task-actions" data-id="' + t.id + '" aria-label="Ações da tarefa ' + esc(t.titulo) + '">⋯</button>' +
    "</div>" +
    (chips ? '<div class="chips">' + chips + "</div>" : "") +
    prog +
  "</article>";
}
function listHTML(pid){
  return etapasDe(pid).map(e => {
    const tfs = tarefasDeEtapa(e.id);
    const rows = tfs.length ? tfs.map(t => {
      const s = subStats(t);
      const chips = chipsHTML(t);
      return '<div class="list-row ' + (t.concluida ? "done" : "") + '" data-act="open-task" data-id="' + t.id + '" tabindex="0" role="button" aria-label="Abrir tarefa ' + esc(t.titulo) + '">' +
        '<span class="check"><input type="checkbox" data-act="toggle-task" data-id="' + t.id + '"' + (t.concluida ? " checked" : "") + ' aria-label="Concluir ' + esc(t.titulo) + '"></span>' +
        '<span class="lr-title">' + esc(t.titulo) + "</span>" +
        (chips ? '<span class="chips">' + chips + "</span>" : "") +
        '<span class="lr-prog">' + (s.total ? s.done + "/" + s.total + " subt." : "—") + "</span>" +
        '<span class="lr-arrow" aria-hidden="true">→</span></div>';
    }).join("") : '<p class="lg-empty">Sem tarefas nesta etapa</p>';
    return '<div class="list-group"><div class="lg-head">' +
      '<span class="col-name">' + esc(e.nome) + '</span><span class="col-count">' + tfs.length + "</span>" +
      '<span style="flex:1"></span>' +
      '<button class="btn btn-sm" data-act="new-task" data-id="' + pid + '" data-stage="' + e.id + '">+ Tarefa</button>' +
      '<button class="icon-btn" data-act="stage-actions" data-id="' + e.id + '" aria-label="Ações da etapa ' + esc(e.nome) + '">⋯</button>' +
      '</div><div class="lg-rows">' + rows + "</div></div>";
  }).join("");
}

/* ---------------- VIEW: todas as tarefas ---------------- */
let tasksFilter = "";
let filterT = null, filterT2 = null;
function renderTasks(){
  const el = $("#view-tasks");
  el.innerHTML = '<div class="page-head"><div><h1>Todas as tarefas</h1><p class="meta">Consolidado de todos os projetos</p></div></div>' +
    '<div class="search-wrap"><span class="ico" aria-hidden="true">⌕</span>' +
    '<input id="filter-tasks" class="search" type="search" placeholder="Filtrar por nome…" aria-label="Filtrar tarefas por nome" value="' + esc(tasksFilter) + '">' +
    '<button class="icon-btn search-clear" data-act="clear-filter" aria-label="Limpar filtro"' + (tasksFilter ? "" : " hidden") + ">✕</button></div>" +
    '<p class="result-meta" id="tasks-meta"></p><div id="tasks-list"></div>';
  renderTasksList();
}
function renderTasksList(){
  const q = norm(tasksFilter);
  let list = [...state.tarefas].sort((a,b) => b.criadoEm - a.criadoEm);
  if(q) list = list.filter(t => norm(t.titulo).includes(q));
  const meta = $("#tasks-meta");
  if(meta) meta.textContent = q ? list.length + " de " + state.tarefas.length + " tarefas (o filtro não altera seus dados)" : list.length + " tarefas";
  const clr = $("[data-act='clear-filter']");
  if(clr) clr.hidden = !tasksFilter;
  const box = $("#tasks-list");
  if(!box) return;
  if(!state.tarefas.length){
    box.innerHTML = emptyHTML({icon:"✓", title:"Tudo em dia", text:"Nenhuma tarefa no sistema ainda. Crie tarefas dentro de um projeto.", actLabel:"Ir para Projetos", act:"go-home"});
    return;
  }
  if(!list.length){
    box.innerHTML = emptyHTML({icon:"⌕", title:"Nenhuma tarefa encontrada", text:"Nada corresponde a “" + tasksFilter + "”. Tente outro termo.", actLabel:"Limpar filtro", act:"clear-filter", compact:true});
    return;
  }
  box.innerHTML = list.map(t => {
    const p = getProj(t.projetoId), e = getEtapa(t.etapaId), s = subStats(t), chips = chipsHTML(t);
    return '<div class="g-row ' + (t.concluida ? "done" : "") + '" data-act="open-task" data-id="' + t.id + '" tabindex="0" role="button" aria-label="' + esc(t.titulo) + ", projeto " + esc(p ? p.nome : "?") + ", etapa " + esc(e ? e.nome : "?") + '">' +
      '<span class="check"><input type="checkbox" data-act="toggle-task" data-id="' + t.id + '"' + (t.concluida ? " checked" : "") + ' aria-label="Concluir ' + esc(t.titulo) + '"></span>' +
      '<span class="origin">' + esc(p ? p.nome : "—") + " › " + esc(e ? e.nome : "—") + "</span>" +
      '<span class="g-title">' + esc(t.titulo) + "</span>" +
      (chips ? '<span class="chips">' + chips + "</span>" : "") +
      '<span class="lr-prog">' + (s.total ? s.done + "/" + s.total + " subt." : "—") + "</span>" +
      '<span class="lr-arrow" aria-hidden="true">→</span></div>';
  }).join("");
}

/* ---------------- VIEW: todas as subtarefas ---------------- */
let subsFilter = "", subStatus = "todas";
function renderSubs(){
  const el = $("#view-subs");
  el.innerHTML = '<div class="page-head"><div><h1>Todas as subtarefas</h1><p class="meta">Execução consolidada de todos os projetos</p></div>' +
    '<div class="page-actions"><div class="segmented" role="group" aria-label="Filtrar por status">' +
      '<button data-act="set-substatus" data-status="todas" aria-pressed="' + (subStatus === "todas") + '">Todas</button>' +
      '<button data-act="set-substatus" data-status="pendentes" aria-pressed="' + (subStatus === "pendentes") + '">Pendentes</button>' +
      '<button data-act="set-substatus" data-status="feitas" aria-pressed="' + (subStatus === "feitas") + '">Concluídas</button>' +
    "</div></div></div>" +
    '<div class="search-wrap"><span class="ico" aria-hidden="true">⌕</span>' +
    '<input id="filter-subs" class="search" type="search" placeholder="Filtrar subtarefa ou tarefa…" aria-label="Filtrar subtarefas" value="' + esc(subsFilter) + '">' +
    '<button class="icon-btn search-clear" data-act="clear-subfilter" aria-label="Limpar filtro"' + (subsFilter ? "" : " hidden") + ">✕</button></div>" +
    '<p class="result-meta" id="subs-meta"></p><div id="subs-list"></div>';
  renderSubsList();
}
function renderSubsList(){
  const q = norm(subsFilter);
  const items = [];
  [...state.tarefas].sort((a,b) => b.criadoEm - a.criadoEm).forEach(t => t.subtarefas.forEach(s => items.push({t, s})));
  let list = items;
  if(subStatus === "pendentes") list = list.filter(i => !i.s.done);
  if(subStatus === "feitas")    list = list.filter(i => i.s.done);
  if(q) list = list.filter(i => norm(i.s.titulo).includes(q) || norm(i.t.titulo).includes(q));
  const meta = $("#subs-meta");
  if(meta){
    const pend = items.filter(i => !i.s.done).length;
    meta.textContent = items.length ? list.length + " exibidas · " + items.length + " no total · " + pend + " pendentes" : "";
  }
  const clr = $("[data-act='clear-subfilter']");
  if(clr) clr.hidden = !subsFilter;
  const box = $("#subs-list");
  if(!box) return;
  if(!items.length){
    box.innerHTML = emptyHTML({icon:"✓", title:"Nenhuma subtarefa ainda", text:"Quebre tarefas grandes em passos menores para acompanhar a execução de perto.", actLabel:"Ir para Projetos", act:"go-home"});
    return;
  }
  if(!list.length){
    box.innerHTML = emptyHTML({icon:"⌕", title:"Nenhuma subtarefa encontrada", text:"Ajuste o filtro ou o status selecionado.", actLabel:"Limpar filtros", act:"clear-subfilter", compact:true});
    return;
  }
  const groups = [], index = new Map();
  list.forEach(({t, s}) => {
    if(!index.has(t.id)){ index.set(t.id, groups.length); groups.push({t, subs:[]}); }
    groups[index.get(t.id)].subs.push(s);
  });
  box.innerHTML = groups.map(g => {
    const p = getProj(g.t.projetoId), st = subStats(g.t);
    return '<section class="sub-group">' +
      '<button class="sg-head" data-act="open-task" data-id="' + g.t.id + '">' +
        '<span class="origin">' + esc(p ? p.nome : "—") + "</span>" +
        '<span class="sg-title">' + esc(g.t.titulo) + "</span>" +
        '<span class="lr-prog">' + st.done + "/" + st.total + "</span>" +
        '<span class="lr-arrow" aria-hidden="true">→</span></button>' +
      g.subs.map(s => '<div class="sg-item ' + (s.done ? "done" : "") + '" data-act="open-task" data-id="' + g.t.id + '" data-sub="' + s.id + '" tabindex="0" role="button">' +
        '<span class="check big"><input type="checkbox" data-act="toggle-sub" data-task="' + g.t.id + '" data-sub="' + s.id + '"' + (s.done ? " checked" : "") + ' aria-label="Concluir ' + esc(s.titulo) + '"></span>' +
        '<span class="sgi-text">' + esc(s.titulo) + "</span>" +
        '<span class="lr-arrow" aria-hidden="true">→</span></div>').join("") +
    "</section>";
  }).join("");
}

/* ---------------- drawer ---------------- */
let drawerTask = null, drawerAnchor = null, editingSub = null, drawerLastFocus = null;
function openDrawer(tid, subId){
  const t = getTarefa(tid);
  if(!t){ toast("Tarefa não encontrada — pode ter sido excluída.", "danger"); return; }
  const wasOpen = drawerTask !== null;
  drawerTask = tid;
  drawerAnchor = subId || null;
  editingSub = null;
  if(!wasOpen) drawerLastFocus = document.activeElement;
  const d = $("#drawer"), b = $("#drawer-backdrop");
  renderDrawer();
  d.hidden = false;
  b.hidden = false;
  requestAnimationFrame(() => { d.classList.add("open"); b.classList.add("open"); });
  setTimeout(() => {
    if(drawerAnchor){
      const el = $("[data-subanchor='" + drawerAnchor + "']");
      if(el){ if(el.scrollIntoView) el.scrollIntoView({block:"center", behavior:"smooth"}); setTimeout(() => el.classList.remove("anchor"), 2400); }
    }
    const f = $("#drawer-close");
    if(f && !wasOpen) f.focus({preventScroll:true});
  }, 140);
}
function closeDrawer(restore){
  if(!drawerTask) return;
  const t = getTarefa(drawerTask);
  const pid = t ? t.projetoId : null;
  const d = $("#drawer"), b = $("#drawer-backdrop");
  d.classList.remove("open");
  b.classList.remove("open");
  const prev = drawerLastFocus;
  drawerTask = null;
  drawerAnchor = null;
  editingSub = null;
  setTimeout(() => { if(!drawerTask){ d.hidden = true; b.hidden = true; d.innerHTML = ""; } }, 260);
  if(location.hash.includes("tarefa=") && pid){
    history.replaceState(null, "", location.pathname + "#/projetos/" + pid);
    lastPath = "/projetos/" + pid;
  }
  if(restore !== false && prev && document.contains(prev)) prev.focus({preventScroll:true});
}
function subLiHTML(t, s){
  const isAnchor = drawerAnchor === s.id;
  const editing = editingSub && editingSub.sub === s.id;
  return '<li class="' + (s.done ? "done " : "") + (isAnchor ? "anchor" : "") + '"' + (isAnchor ? ' data-subanchor="' + s.id + '"' : "") + ">" +
    '<span class="check"><input type="checkbox" data-act="toggle-sub" data-task="' + t.id + '" data-sub="' + s.id + '"' + (s.done ? " checked" : "") + ' aria-label="Concluir ' + esc(s.titulo) + '"></span>' +
    (editing ? '<input class="st-edit" id="edit-sub-input" value="' + esc(s.titulo) + '">' : '<span class="st-text">' + esc(s.titulo) + "</span>") +
    '<span class="st-actions">' +
      (editing ? "" : '<button class="icon-btn" data-act="edit-sub" data-sub="' + s.id + '" aria-label="Editar subtarefa ' + esc(s.titulo) + '">✎</button>') +
      '<button class="icon-btn danger" data-act="delete-sub" data-sub="' + s.id + '" aria-label="Excluir subtarefa ' + esc(s.titulo) + '">✕</button>' +
    "</span></li>";
}
function renderDrawer(){
  if(!drawerTask) return;
  const t = getTarefa(drawerTask);
  if(!t){ closeDrawer(false); return; }
  const p = getProj(t.projetoId), e = getEtapa(t.etapaId), st = subStats(t);
  const etapas = etapasDe(t.projetoId);
  const chips = chipsHTML(t, {removable:true, addBtn:true});
  $("#drawer").innerHTML =
    '<div class="dr-head"><span class="dr-origin">' + esc(p ? p.nome : "?") + " › " + esc(e ? e.nome : "?") + "</span>" +
      '<button class="icon-btn" id="drawer-close" data-act="close-drawer" aria-label="Fechar detalhe da tarefa">✕</button></div>' +
    '<div class="dr-body">' +
      "<div><input class=\"dr-title\" id=\"dr-title\" value=\"" + esc(t.titulo) + '" data-act="edit-title" aria-label="Título da tarefa">' +
        '<p class="field-error inline" id="dr-title-err" hidden>Título obrigatório.</p></div>' +
      "<div><span class=\"dr-label\">Descrição</span>" +
        '<textarea class="dr-desc" data-act="edit-desc" placeholder="Adicione detalhes…">' + esc(t.descricao || "") + "</textarea></div>" +
      '<div><span class="dr-label">Etiquetas (somente deste projeto)</span><div class="chips">' + chips + "</div></div>" +
      '<div><span class="dr-label">Etapa</span><select class="dr-select" data-act="move-select" data-id="' + t.id + '" aria-label="Mover tarefa para etapa">' +
        etapas.map(x => '<option value="' + x.id + '"' + (x.id === t.etapaId ? " selected" : "") + ">" + esc(x.nome) + "</option>").join("") +
      "</select></div>" +
      "<div><div class=\"sub-head\"><span class=\"dr-label\">Subtarefas</span>" +
        '<span class="sub-prog">' + (st.total ? st.done + "/" + st.total + " concluídas" : "") + "</span></div>" +
        (st.total ? progressHTML(st.done, st.total) : "") +
        (st.total
          ? '<ul class="sub-list">' + t.subtarefas.map(s => subLiHTML(t, s)).join("") + "</ul>"
          : '<div class="empty tiny"><p class="muted">Divida a tarefa em passos executáveis.</p></div>') +
        '<div class="add-sub"><input id="new-sub" placeholder="Nova subtarefa…" aria-label="Nova subtarefa" maxlength="140">' +
        '<button class="btn btn-primary" data-act="add-subtask">+ Adicionar</button></div></div>' +
      (storageOK ? "" : '<p class="dr-warn">Armazenamento indisponível — esta alteração não será mantida ao recarregar.</p>') +
    "</div>" +
    '<div class="dr-foot"><span class="small muted">Salvo automaticamente</span>' +
      '<button class="btn btn-danger btn-sm" data-act="delete-task" data-id="' + t.id + '">Excluir tarefa</button></div>';
  if(editingSub){
    const inp = $("#edit-sub-input");
    if(inp){ inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }
  }
}
function openTask(id, sub){
  const t = getTarefa(id);
  if(!t){ toast("Tarefa não encontrada — pode ter sido excluída.", "danger"); return; }
  const target = "#/projetos/" + t.projetoId + "?tarefa=" + t.id + (sub ? "&sub=" + sub : "");
  if(location.hash === target) openDrawer(t.id, sub);
  else navigate(target);
}

/* ---------------- modal ---------------- */
let modalCfg = null, modalLastFocus = null, modalGen = 0;
function fieldsHTML(fields){
  return fields.map(f => {
    const id = "f-" + f.name;
    const req = f.required ? ' <span class="req" aria-hidden="true">*</span>' : "";
    let control = "";
    if(f.type === "textarea"){
      control = '<textarea id="' + id + '" name="' + f.name + '" rows="3" placeholder="' + esc(f.placeholder || "") + '">' + esc(f.value || "") + "</textarea>";
    } else if(f.type === "select"){
      control = '<select id="' + id + '" name="' + f.name + '">' + (f.options || []).map(o => '<option value="' + esc(o.value) + '"' + (String(o.value) === String(f.value) ? " selected" : "") + ">" + esc(o.label) + "</option>").join("") + "</select>";
    } else if(f.type === "checks"){
      const opts = f.options || [];
      control = '<div class="checks">' + (opts.length
        ? opts.map(o => '<label class="check-row"><input type="checkbox" name="' + f.name + '" value="' + esc(o.value) + '"' + ((f.value || []).includes(o.value) ? " checked" : "") + "><span>" + esc(o.label) + "</span></label>").join("")
        : '<p class="muted small" style="padding:8px">Nenhuma etiqueta neste projeto ainda.</p>') + "</div>";
    } else if(f.type === "color"){
      const keys = Object.keys(CORES);
      control = '<div class="swatches" role="radiogroup" aria-label="' + esc(f.label) + '">' + keys.map(k =>
        '<label class="swatch" style="--sw:' + CORES[k].dot + '" title="' + k + '"><input type="radio" name="' + f.name + '" value="' + k + '"' + ((f.value || keys[0]) === k ? " checked" : "") + "><span></span></label>").join("") + "</div>";
    } else {
      control = '<input id="' + id + '" name="' + f.name + '" type="text" value="' + esc(f.value || "") + '" placeholder="' + esc(f.placeholder || "") + '" autocomplete="off">';
    }
    const label = (f.type === "checks" || f.type === "color") ? "<label>" + esc(f.label) + req + "</label>" : '<label for="' + id + '">' + esc(f.label) + req + "</label>";
    return '<div class="field" data-field="' + f.name + '">' + label + control + '<p class="field-error" hidden></p>' + (f.hint ? '<p class="field-hint">' + esc(f.hint) + "</p>" : "") + "</div>";
  }).join("");
}
function openModal(cfg){
  const root = $("#modal-root");
  if(root.hidden) modalLastFocus = document.activeElement;
  modalGen++;
  modalCfg = cfg;
  const formHTML = cfg.noForm
    ? '<div class="modal-body">' + (cfg.html || "") + "</div><footer>" + (cfg.footerHTML || '<button class="btn" data-act="close-modal">Fechar</button>') + "</footer>"
    : '<div class="modal-body">' + (cfg.html != null ? cfg.html : fieldsHTML(cfg.fields || [])) + "</div>" +
      '<footer><button type="button" class="btn" data-act="close-modal">Cancelar</button>' +
      '<button type="submit" class="btn ' + (cfg.danger ? "btn-danger" : "btn-primary") + '">' + esc(cfg.submitLabel || "Salvar") + "</button></footer>";
  root.querySelector(".modal").innerHTML =
    "<header><div style=\"flex:1\"><h2 id=\"modal-title\">" + esc(cfg.title) + "</h2>" +
      (cfg.subtitle ? '<p class="modal-sub">' + esc(cfg.subtitle) + "</p>" : "") +
    '</div><button class="icon-btn modal-x" data-act="close-modal" aria-label="Fechar">✕</button></header>' +
    '<form id="modal-form" novalidate>' + formHTML + "</form>";
  root.hidden = false;
  requestAnimationFrame(() => root.classList.add("open"));
  if(!cfg.noForm){
    $("#modal-form").addEventListener("submit", ev => {
      ev.preventDefault();
      const form = ev.currentTarget;
      clearErrors(form);
      const data = readFields(form);
      let err = null;
      try{ err = cfg.onSubmit ? cfg.onSubmit(data, form) : null; }catch(ex){ console.error(ex); }
      if(!err) closeModal();
      else showFieldError(form, err.name, err.msg);
    });
  } else {
    $("#modal-form").addEventListener("submit", ev => ev.preventDefault());
  }
  setTimeout(() => {
    const first = root.querySelector(".modal-body input[type=text], .modal-body textarea, .modal-body select, .modal-body button, footer .btn");
    if(first) first.focus();
  }, 70);
}
function closeModal(result){
  const root = $("#modal-root");
  if(root.hidden) return;
  const gen = modalGen;
  root.classList.remove("open");
  const cfg = modalCfg;
  modalCfg = null;
  setTimeout(() => { if(gen === modalGen){ root.hidden = true; root.querySelector(".modal").innerHTML = ""; } }, 200);
  if(cfg && cfg.resolve) cfg.resolve(result === true);
  if(modalLastFocus && document.contains(modalLastFocus)) modalLastFocus.focus({preventScroll:true});
}
function readFields(form){
  const data = {};
  $$(".field", form).forEach(f => {
    const name = f.dataset.field;
    if(!name) return;
    const rbs = $$("input[type=radio]", f);
    if(rbs.length){ const c = rbs.find(r => r.checked); data[name] = c ? c.value : null; return; }
    const cbs = $$("input[type=checkbox]", f);
    if(cbs.length){ data[name] = cbs.filter(c => c.checked).map(c => c.value); return; }
    const el = f.querySelector("input, textarea, select");
    data[name] = el ? el.value : "";
  });
  return data;
}
function clearErrors(form){
  $$(".field", form).forEach(f => {
    f.classList.remove("has-error");
    const e = f.querySelector(".field-error");
    if(e){ e.hidden = true; e.textContent = ""; }
    const el = f.querySelector("input, textarea, select");
    if(el) el.removeAttribute("aria-invalid");
  });
}
function showFieldError(form, name, msg){
  const f = form.querySelector('.field[data-field="' + name + '"]');
  if(!f) return;
  f.classList.add("has-error");
  const e = f.querySelector(".field-error");
  if(e){ e.textContent = msg; e.hidden = false; }
  const el = f.querySelector("input, textarea, select");
  if(el){ el.setAttribute("aria-invalid", "true"); el.focus(); }
}
function confirmModal(o){
  return new Promise(res => {
    const footer = o.single
      ? '<button class="btn btn-primary" data-act="confirm-yes">' + esc(o.confirmLabel || "Entendi") + "</button>"
      : '<button class="btn" data-act="close-modal">Cancelar</button><button class="btn ' + (o.danger === false ? "btn-primary" : "btn-danger") + '" data-act="confirm-yes">' + esc(o.confirmLabel || "Confirmar") + "</button>";
    openModal({title:o.title, html:'<div class="confirm-msg">' + o.message + "</div>", noForm:true, footerHTML:footer, resolve:res});
  });
}

/* ---------------- formulários CRUD ---------------- */
function projectForm(p){
  openModal({
    title: p ? "Editar projeto" : "Novo projeto",
    fields:[
      {name:"nome", label:"Nome", required:true, value:p ? p.nome : "", placeholder:"Ex.: Site X", hint:"Obrigatório. Nomes duplicados são permitidos com aviso."},
      {name:"descricao", label:"Descrição (opcional)", type:"textarea", value:p ? p.descricao : "", placeholder:"Do que se trata este projeto?"}
    ],
    submitLabel: p ? "Salvar" : "Criar projeto",
    onSubmit(d){
      const nome = (d.nome || "").trim();
      if(!nome) return {name:"nome", msg:"Informe um nome para o projeto."};
      if(p){
        p.nome = nome; p.descricao = (d.descricao || "").trim();
        save(); renderActive(); toast("Projeto atualizado.");
      } else {
        state.projetos.push({id:uid("p"), nome, descricao:(d.descricao || "").trim(), criadoEm:Date.now()});
        save();
        const dup = state.projetos.filter(x => x.nome === nome).length > 1;
        renderActive();
        toast(dup ? "Projeto criado — já existe outro com esse nome." : "Projeto criado.", dup ? "warning" : "success");
      }
    }
  });
}
function stageForm(pid, e){
  openModal({
    title: e ? "Editar etapa" : "Nova etapa",
    subtitle: getProj(pid) ? "Projeto: " + getProj(pid).nome : "",
    fields:[{name:"nome", label:"Nome da etapa", required:true, value:e ? e.nome : "", placeholder:"Ex.: Em Andamento"}],
    submitLabel: e ? "Salvar" : "Criar etapa",
    onSubmit(d){
      const nome = (d.nome || "").trim();
      if(!nome) return {name:"nome", msg:"Informe um nome para a etapa."};
      if(e){ e.nome = nome; save(); renderActive(); toast("Etapa atualizada."); }
      else {
        const ordem = etapasDe(pid).length;
        state.etapas.push({id:uid("e"), projetoId:pid, nome, ordem, criadoEm:Date.now()});
        save(); renderActive(); toast("Etapa criada.");
      }
    }
  });
}
function taskForm(pid, t){
  const etapas = etapasDe(pid);
  if(!etapas.length){ toast("Crie uma etapa antes de adicionar tarefas.", "warning"); return; }
  openModal({
    title: t ? "Editar tarefa" : "Nova tarefa",
    subtitle: getProj(pid) ? "Projeto: " + getProj(pid).nome : "",
    fields:[
      {name:"titulo", label:"Título", required:true, value:t ? t.titulo : "", placeholder:"Ex.: Escrever homepage"},
      {name:"etapaId", label:"Etapa", type:"select", value:t ? t.etapaId : etapas[0].id, options:etapas.map(e => ({value:e.id, label:e.nome}))},
      {name:"descricao", label:"Descrição (opcional)", type:"textarea", value:t ? t.descricao : "", placeholder:"Detalhes, links, definição de pronto…"}
    ],
    submitLabel: t ? "Salvar" : "Criar tarefa",
    onSubmit(d){
      const titulo = (d.titulo || "").trim();
      if(!titulo) return {name:"titulo", msg:"Informe um título."};
      if(t){
        t.titulo = titulo; t.etapaId = d.etapaId; t.descricao = d.descricao || "";
        save(); renderActive(); toast("Tarefa atualizada.");
      } else {
        state.tarefas.push({id:uid("t"), projetoId:pid, etapaId:d.etapaId, titulo, descricao:d.descricao || "", rotulos:[], concluida:false, criadoEm:Date.now(), subtarefas:[]});
        save(); renderActive(); toast("Tarefa criada.");
      }
    }
  });
}
function labelsModalHTML(pid){
  const list = etiquetasDe(pid);
  const rows = list.length ? list.map(l => {
    const c = CORES[l.cor] || CORES.violet;
    return '<li><span class="lbl-dot" style="background:' + c.dot + '"></span><span class="nm">' + esc(l.nome) + "</span>" +
      '<button class="icon-btn" data-act="label-edit" data-id="' + l.id + '" aria-label="Editar etiqueta ' + esc(l.nome) + '">✎</button>' +
      '<button class="icon-btn danger" data-act="label-delete" data-id="' + l.id + '" aria-label="Excluir etiqueta ' + esc(l.nome) + '">✕</button></li>';
  }).join("") : '<li style="border:none;padding:0"><span class="muted small">Nenhuma etiqueta neste projeto ainda.</span></li>';
  const editing = editingLabelId ? getEtq(editingLabelId) : null;
  const keys = Object.keys(CORES);
  return '<ul class="lbl-list">' + rows + "</ul>" +
    '<div class="field"><label for="lbl-nome">' + (editing ? "Renomear etiqueta" : "Nova etiqueta") + ' <span class="req">*</span></label>' +
    '<input id="lbl-nome" type="text" value="' + esc(editing ? editing.nome : "") + '" placeholder="Ex.: urgente" autocomplete="off"></div>' +
    '<div class="field"><label>Cor</label><div class="swatches" role="radiogroup" aria-label="Cor da etiqueta">' +
      keys.map(k => '<label class="swatch" style="--sw:' + CORES[k].dot + '" title="' + k + '"><input type="radio" name="lbl-cor" value="' + k + '"' +
        ((editing ? editing.cor : keys[0]) === k ? " checked" : "") + "><span></span></label>").join("") +
    "</div></div>" +
    '<footer style="padding:14px 0 4px;display:flex;gap:10px;justify-content:flex-end">' +
      (editing ? '<button class="btn" data-act="label-edit-cancel">Cancelar</button>' : "") +
      '<button class="btn btn-primary" data-act="label-save" data-pid="' + pid + '">' + (editing ? "Salvar" : "+ Adicionar") + "</button>" +
    "</footer>";
}
let editingLabelId = null;
function openLabelsModal(pid){
  editingLabelId = null;
  openModal({title:"Etiquetas", subtitle:(getProj(pid) ? getProj(pid).nome + " · vinculáveis apenas às tarefas deste projeto" : ""), html:labelsModalHTML(pid), noForm:true, footerHTML:""});
}
function refreshLabelsModal(pid){
  const root = $("#modal-root");
  const body = root.querySelector(".modal-body");
  const footer = root.querySelector("footer");
  if(body) body.innerHTML = labelsModalHTML(pid);
  if(footer) footer.innerHTML = "";
}
function taskLabelsModal(t){
  const opts = etiquetasDe(t.projetoId).map(l => ({value:l.id, label:l.nome}));
  openModal({
    title:"Etiquetas da tarefa",
    subtitle:opts.length ? "Somente etiquetas do projeto " + esc(getProj(t.projetoId).nome) : "Nenhuma etiqueta neste projeto",
    fields:[{name:"rotulos", label:"Selecionar etiquetas", type:"checks", options:opts, value:(t.rotulos || []).slice()}],
    submitLabel:"Salvar etiquetas",
    onSubmit(d){ t.rotulos = d.rotulos || []; save(); renderActive(); toast("Etiquetas atualizadas."); }
  });
}
function taskActionsSheet(t){
  const etapas = etapasDe(t.projetoId);
  openModal({
    title:t.titulo,
    subtitle:(getProj(t.projetoId) ? getProj(t.projetoId).nome + " › " + (getEtapa(t.etapaId) ? getEtapa(t.etapaId).nome : "") : ""),
    noForm:true,
    html:'<div class="sheet-actions">' +
      '<button class="btn" data-act="edit-task" data-id="' + t.id + '">Editar tarefa</button>' +
      '<button class="btn" data-act="task-labels" data-id="' + t.id + '">Gerenciar etiquetas</button>' +
      '<p class="sheet-label">Mover para</p><div class="move-grid">' +
        etapas.map(e => '<button class="btn btn-sm" data-act="move-task" data-id="' + t.id + '" data-stage="' + e.id + '"' + (e.id === t.etapaId ? " disabled" : "") + ">" + esc(e.nome) + (e.id === t.etapaId ? " (atual)" : "") + "</button>").join("") +
      "</div>" +
      '<p class="sheet-label">Zona destrutiva</p>' +
      '<button class="btn danger" data-act="delete-task" data-id="' + t.id + '">Excluir tarefa</button>' +
    "</div>",
    footerHTML:'<button class="btn" data-act="close-modal">Fechar</button>'
  });
}
function stageActionsSheet(e){
  openModal({
    title:e.nome,
    subtitle:"Etapa · " + (getProj(e.projetoId) ? getProj(e.projetoId).nome : ""),
    noForm:true,
    html:'<div class="sheet-actions">' +
      '<button class="btn" data-act="edit-stage" data-id="' + e.id + '">Renomear etapa</button>' +
      '<button class="btn danger" data-act="delete-stage" data-id="' + e.id + '">Excluir etapa</button></div>',
    footerHTML:'<button class="btn" data-act="close-modal">Fechar</button>'
  });
}

/* ---------------- ações ---------------- */
function moveTask(tid, stageId){
  const t = getTarefa(tid);
  if(!t || t.etapaId === stageId) return;
  t.etapaId = stageId;
  save();
  renderActive();
  const e = getEtapa(stageId);
  toast("Movida para “" + (e ? e.nome : "") + "”.");
}
function toggleSub(tid, sid, checked){
  const t = getTarefa(tid);
  if(!t) return;
  const s = t.subtarefas.find(x => x.id === sid);
  if(!s) return;
  s.done = !!checked;
  save();
  renderActive();
}
function commitSubEdit(rerender){
  if(!editingSub) return;
  const {sub} = editingSub;
  const t = getTarefa(drawerTask);
  const inp = $("#edit-sub-input");
  const val = inp ? inp.value.trim() : "";
  editingSub = null;
  if(t){
    const s = t.subtarefas.find(x => x.id === sub);
    if(s && val){ if(s.titulo !== val){ s.titulo = val; save(); } }
    if(rerender) renderDrawer();
    else if(inp){
      const li = inp.closest("li");
      if(li && s) li.outerHTML = subLiHTML(t, s);
    }
  } else if(rerender) renderDrawer();
}
function addSubtask(){
  const t = getTarefa(drawerTask);
  const inp = $("#new-sub");
  if(!t || !inp) return;
  const val = inp.value.trim();
  if(!val){ inp.focus(); return; }
  t.subtarefas.push({id:uid("s"), titulo:val, done:false});
  save();
  renderDrawer();
  const again = $("#new-sub");
  if(again) again.focus();
  toast("Subtarefa adicionada.");
}
async function deleteProject(pid){
  const p = getProj(pid);
  if(!p) return;
  const s = statsProjeto(pid);
  const ok = await confirmModal({
    title:'Excluir projeto “' + p.nome + '”?',
    message:"Esta ação excluirá em cascata:<ul><li>" + s.etapas + (s.etapas === 1 ? " etapa" : " etapas") +
      "</li><li>" + s.tarefas + (s.tarefas === 1 ? " tarefa" : " tarefas") + " e " + s.subTotal + (s.subTotal === 1 ? " subtarefa" : " subtarefas") +
      "</li><li>" + etiquetasDe(pid).length + (etiquetasDe(pid).length === 1 ? " etiqueta" : " etiquetas") +
      '</li></ul><p class="warnline">Não é possível desfazer.</p>',
    confirmLabel:"Excluir projeto"
  });
  if(!ok) return;
  state.tarefas = state.tarefas.filter(t => t.projetoId !== pid);
  state.etapas = state.etapas.filter(e => e.projetoId !== pid);
  state.etiquetas = state.etiquetas.filter(l => l.projetoId !== pid);
  state.projetos = state.projetos.filter(x => x.id !== pid);
  save();
  if(currentProject === pid){ currentProject = null; navigate("#/"); }
  renderActive();
  toast("Projeto excluído.");
}
async function deleteStage(eid){
  const e = getEtapa(eid);
  if(!e) return;
  const tfs = tarefasDeEtapa(eid);
  if(tfs.length){
    await confirmModal({
      title:"Etapa não pode ser excluída",
      message:'<p>“' + esc(e.nome) + '” ainda tem <strong>' + tfs.length + (tfs.length === 1 ? " tarefa" : " tarefas") + "</strong>.</p>" +
        '<p class="infoline">Mova as tarefas para outra etapa (arraste no kanban ou use “Mover para…”) ou esvazie a etapa antes de excluí-la.</p>',
      single:true, confirmLabel:"Entendi"
    });
    return;
  }
  const ok = await confirmModal({
    title:'Excluir etapa “' + e.nome + '”?',
    message:'<p>A etapa será removida do quadro. Não há tarefas vinculadas.</p><p class="warnline">Não é possível desfazer.</p>',
    confirmLabel:"Excluir etapa"
  });
  if(!ok) return;
  state.etapas = state.etapas.filter(x => x.id !== eid);
  save(); renderActive(); toast("Etapa excluída.");
}
async function deleteTask(tid){
  const t = getTarefa(tid);
  if(!t) return;
  const n = t.subtarefas.length;
  const ok = await confirmModal({
    title:"Excluir tarefa “" + t.titulo + "”?",
    message:'<p>A tarefa e ' + (n ? "suas <strong>" + n + (n === 1 ? " subtarefa" : " subtarefas") + "</strong>" : "todas as referências") + " serão excluídas" +
      (n ? " junto" : "") + '.</p><p class="warnline">Não é possível desfazer.</p>',
    confirmLabel:"Excluir tarefa"
  });
  if(!ok) return;
  state.tarefas = state.tarefas.filter(x => x.id !== tid);
  if(drawerTask === tid) closeDrawer(false);
  save(); renderActive(); toast("Tarefa excluída.");
}
async function deleteSub(sid){
  const t = getTarefa(drawerTask);
  if(!t) return;
  const s = t.subtarefas.find(x => x.id === sid);
  if(!s) return;
  const ok = await confirmModal({
    title:"Excluir subtarefa?",
    message:'<p>“' + esc(s.titulo) + '” será removida de “' + esc(t.titulo) + '”.</p><p class="warnline">Não é possível desfazer.</p>',
    confirmLabel:"Excluir"
  });
  if(!ok) return;
  t.subtarefas = t.subtarefas.filter(x => x.id !== sid);
  save(); renderDrawer(); renderActive(); toast("Subtarefa excluída.");
}
async function deleteLabel(lid){
  const l = getEtq(lid);
  if(!l) return;
  const used = state.tarefas.filter(t => (t.rotulos || []).includes(lid)).length;
  const ok = await confirmModal({
    title:'Excluir etiqueta “' + l.nome + '”?',
    message:"<p>Ela será <strong>desvinculada de " + used + (used === 1 ? " tarefa" : " tarefas") + "</strong> — nenhuma tarefa será excluída.</p><p class=\"warnline\">Não é possível desfazer.</p>",
    confirmLabel:"Excluir etiqueta"
  });
  if(!ok) return;
  state.tarefas.forEach(t => { t.rotulos = (t.rotulos || []).filter(x => x !== lid); });
  state.etiquetas = state.etiquetas.filter(x => x.id !== lid);
  if(editingLabelId === lid) editingLabelId = null;
  save();
  refreshLabelsModal(l.projetoId);
  renderActive();
  toast("Etiqueta excluída.");
}
function saveLabel(pid){
  const inp = $("#lbl-nome");
  if(!inp) return;
  const nome = inp.value.trim();
  if(!nome){ inp.focus(); toast("Informe um nome para a etiqueta.", "warning"); return; }
  const corEl = $("input[name='lbl-cor']:checked");
  const cor = corEl ? corEl.value : "violet";
  const dup = etiquetasDe(pid).some(l => norm(l.nome) === norm(nome) && l.id !== editingLabelId);
  if(dup){ toast("Já existe uma etiqueta com esse nome neste projeto.", "warning"); inp.focus(); return; }
  if(editingLabelId){
    const l = getEtq(editingLabelId);
    if(l){ l.nome = nome; l.cor = cor; }
    editingLabelId = null;
    toast("Etiqueta atualizada.");
  } else {
    state.etiquetas.push({id:uid("l"), projetoId:pid, nome, cor, criadoEm:Date.now()});
    toast("Etiqueta criada.");
  }
  save();
  refreshLabelsModal(pid);
  renderActive();
}

/* ---------------- handlers globais ---------------- */
document.addEventListener("click", async ev => {
  const el = ev.target.closest("[data-act]");
  if(!el) return;
  const act = el.dataset.act;
  const id = el.dataset.id;

  if(el.tagName === "INPUT" && (act === "toggle-task" || act === "toggle-sub")){
    if(act === "toggle-task"){
      const t = getTarefa(id);
      if(t){ t.concluida = el.checked; save(); renderActive(); }
    } else {
      toggleSub(el.dataset.task, el.dataset.sub, el.checked);
    }
    return;
  }

  switch(act){
    case "close-modal": closeModal(false); break;
    case "confirm-yes": closeModal(true); break;
    case "close-drawer": closeDrawer(true); break;
    case "go-home": navigate("#/"); break;

    case "new-project": projectForm(null); break;
    case "edit-project": projectForm(getProj(id)); break;
    case "delete-project": deleteProject(id); break;
    case "open-project": navigate("#/projetos/" + id); break;

    case "set-modo":
      state.ui = state.ui || {};
      state.ui.modo = el.dataset.modo;
      save();
      renderProject(currentProject);
      break;

    case "new-stage": stageForm(el.dataset.id || currentProject, null); break;
    case "stage-actions": { const e = getEtapa(id); if(e) stageActionsSheet(e); break; }
    case "edit-stage": { const e = getEtapa(id); closeModal(false); setTimeout(() => stageForm(e.projetoId, e), 220); break; }
    case "delete-stage": { const e = getEtapa(id); closeModal(false); if(e) setTimeout(() => deleteStage(id), 220); break; }

    case "new-task": taskForm(el.dataset.id || currentProject, null); break;
    case "open-task": openTask(id, el.dataset.sub); break;
    case "task-actions": { const t = getTarefa(id); if(t) taskActionsSheet(t); break; }
    case "edit-task": { const t = getTarefa(id); closeModal(false); if(t) setTimeout(() => taskForm(t.projetoId, t), 220); break; }
    case "delete-task": { const tid = id; closeModal(false); setTimeout(() => deleteTask(tid), 220); break; }
    case "move-task": moveTask(id, el.dataset.stage); closeModal(false); break;
    case "toggle-task":
    case "toggle-sub": return;

    case "task-labels": { const t = getTarefa(id); if(t){ closeModal(false); setTimeout(() => taskLabelsModal(t), 200); } break; }
    case "remove-label": {
      const t = getTarefa(el.dataset.task);
      if(t){ t.rotulos = (t.rotulos || []).filter(x => x !== el.dataset.label); save(); renderActive(); toast("Etiqueta removida."); }
      break;
    }

    case "labels-manager": openLabelsModal(id); break;
    case "label-save": saveLabel(el.dataset.pid); break;
    case "label-edit": editingLabelId = id; refreshLabelsModal(getEtq(id).projetoId); break;
    case "label-edit-cancel": editingLabelId = null; refreshLabelsModal(currentProject); break;
    case "label-delete": await deleteLabel(id); break;

    case "add-subtask": addSubtask(); break;
    case "edit-sub": editingSub = {sub:el.dataset.sub}; renderDrawer(); break;
    case "delete-sub": deleteSub(el.dataset.sub); break;
    case "toggle-sub": return;

    case "clear-filter":
      tasksFilter = "";
      { const i = $("#filter-tasks"); if(i) i.value = ""; }
      renderTasksList();
      break;
    case "clear-subfilter":
      subsFilter = "";
      { const i = $("#filter-subs"); if(i) i.value = ""; }
      renderSubsList();
      break;
    case "set-substatus": subStatus = el.dataset.status; renderSubs(); break;

    case "reset-demo": {
      const ok = await confirmModal({
        title:"Reiniciar dados de demonstração?",
        message:"<p>Seus ajustes locais serão substituídos pelo conjunto inicial de dados do protótipo.</p><p class=\"warnline\">Não é possível desfazer.</p>",
        confirmLabel:"Reiniciar"
      });
      if(ok){ state = seed(); save(); closeDrawer(false); route(); toast("Dados de demonstração restaurados."); }
      break;
    }
    default: break;
  }
});

/* change (selects e campos do drawer) */
document.addEventListener("change", ev => {
  const el = ev.target.closest("[data-act]");
  if(!el) return;
  const act = el.dataset.act;
  if(act === "move-select"){ moveTask(el.dataset.id, el.value); }
  else if(act === "edit-title"){
    const t = getTarefa(drawerTask);
    const err = $("#dr-title-err");
    const val = el.value.trim();
    if(!val){ el.classList.add("invalid"); el.setAttribute("aria-invalid", "true"); if(err) err.hidden = false; el.value = t ? t.titulo : ""; return; }
    el.classList.remove("invalid"); el.removeAttribute("aria-invalid"); if(err) err.hidden = true;
    if(t && t.titulo !== val){ t.titulo = val; save(); renderActive(); toast("Título atualizado."); }
  }
  else if(act === "edit-desc"){
    const t = getTarefa(drawerTask);
    if(t && t.descricao !== el.value){ t.descricao = el.value; save(); toast("Descrição salva."); }
  }
});

/* inputs (filtros) */
document.addEventListener("input", ev => {
  if(ev.target.id === "filter-tasks"){
    tasksFilter = ev.target.value;
    clearTimeout(filterT);
    filterT = setTimeout(renderTasksList, 200);
  } else if(ev.target.id === "filter-subs"){
    subsFilter = ev.target.value;
    clearTimeout(filterT2);
    filterT2 = setTimeout(renderSubsList, 200);
  }
});

/* teclado */
document.addEventListener("keydown", ev => {
  if(ev.key === "Escape" && ev.target.id === "edit-sub-input"){ ev.preventDefault(); editingSub = null; renderDrawer(); return; }
  if(ev.key === "Escape"){
    if(!$("#modal-root").hidden){ closeModal(false); return; }
    if(drawerTask){ closeDrawer(true); return; }
  }
  if(ev.key === "Enter"){
    if(ev.target.id === "new-sub"){ ev.preventDefault(); addSubtask(); return; }
    if(ev.target.id === "lbl-nome"){ ev.preventDefault(); { const b = $("[data-act='label-save']"); if(b) b.click(); } return; }
    if(ev.target.id === "edit-sub-input"){ ev.preventDefault(); commitSubEdit(true); return; }
    if(ev.target.id === "dr-title"){ ev.preventDefault(); ev.target.blur(); return; }
  }
  if((ev.key === "Enter" || ev.key === " ") && ev.target.matches("[data-act][tabindex='0']")){
    ev.preventDefault();
    ev.target.click();
  }
  if(ev.key === "Tab"){
    const container = !$("#modal-root").hidden ? $("#modal-root") : (!$("#drawer").hidden ? $("#drawer") : null);
    if(!container) return;
    const f = $$("a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex='0']", container)
      .filter(x => x.offsetParent !== null);
    if(!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if(ev.shiftKey && document.activeElement === first){ ev.preventDefault(); last.focus(); }
    else if(!ev.shiftKey && document.activeElement === last){ ev.preventDefault(); first.focus(); }
  }
});
/* salvar edição de subtarefa ao sair do campo */
document.addEventListener("focusout", ev => {
  if(ev.target && ev.target.id === "edit-sub-input") commitSubEdit(false);
});

/* fechar por clique nos fundos */
document.addEventListener("click", ev => {
  if(ev.target.id === "modal-root") closeModal(false);
  if(ev.target.id === "drawer-backdrop") closeDrawer(true);
});

/* ---------------- drag and drop ---------------- */
let dragTaskId = null;
document.addEventListener("dragstart", ev => {
  const card = ev.target.closest && ev.target.closest(".task-card");
  if(!card) return;
  dragTaskId = card.dataset.id;
  card.classList.add("dragging");
  try{ ev.dataTransfer.effectAllowed = "move"; ev.dataTransfer.setData("text/plain", dragTaskId); }catch(e){}
});
document.addEventListener("dragend", () => {
  $$(".dragging").forEach(x => x.classList.remove("dragging"));
  $$(".drop-hover").forEach(x => x.classList.remove("drop-hover"));
  dragTaskId = null;
});
document.addEventListener("dragover", ev => {
  const zone = ev.target.closest && ev.target.closest(".column-body");
  if(!zone || !dragTaskId) return;
  ev.preventDefault();
  try{ ev.dataTransfer.dropEffect = "move"; }catch(e){}
  $$(".drop-hover").forEach(x => { if(x !== zone) x.classList.remove("drop-hover"); });
  zone.classList.add("drop-hover");
});
document.addEventListener("drop", ev => {
  const zone = ev.target.closest && ev.target.closest(".column-body");
  if(!zone || !dragTaskId) return;
  ev.preventDefault();
  const tid = dragTaskId;
  dragTaskId = null;
  moveTask(tid, zone.dataset.stage);
});

/* ---------------- init ---------------- */
(function init(){
  try{
    localStorage.setItem(KEY + ":test", "1");
    localStorage.removeItem(KEY + ":test");
  }catch(e){
    storageOK = false;
    setTimeout(() => toast("O navegador bloqueou o armazenamento — nada será salvo entre sessões (modo degradado).", "warning"), 600);
  }
  state = load();
  if(!state.ui) state.ui = {modo:"kanban"};
  if(!state.ui.modo) state.ui.modo = "kanban";
  window.addEventListener("hashchange", route);
  route();
})();
