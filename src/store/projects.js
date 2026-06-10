// Yangi project uchun faqat root — bo'sh boshlanadi
function emptyRoot() {
  return { id: 'root', label: 'Yangi Loyiha', color: '#6366f1', children: [] }
}

const PROJECTS_KEY = 'algo_projects_v1'
const ACTIVE_KEY = 'algo_active_project'

function deepClone(o) { return JSON.parse(JSON.stringify(o)) }

function now() { return Date.now() }

export function loadProjects() {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  // Default: bitta boshlang'ich loyiha
  const defaults = [{
    id: 'default',
    name: 'ALGO GROUP — Asosiy',
    data: emptyRoot(),
    createdAt: now(),
    updatedAt: now(),
  }]
  saveProjects(defaults)
  return defaults
}

export function saveProjects(projects) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects))
}

export function getActiveId() {
  return localStorage.getItem(ACTIVE_KEY) || 'default'
}

export function setActiveId(id) {
  localStorage.setItem(ACTIVE_KEY, id)
}

export function createProject(name) {
  const projects = loadProjects()
  const id = 'proj_' + Date.now()
  const newProj = {
    id,
    name: name || 'Yangi loyiha',
    data: emptyRoot(),
    createdAt: now(),
    updatedAt: now(),
  }
  projects.unshift(newProj)
  saveProjects(projects)
  return newProj
}

export function duplicateProject(id) {
  const projects = loadProjects()
  const src = projects.find(p => p.id === id)
  if (!src) return null
  const newProj = {
    ...deepClone(src),
    id: 'proj_' + Date.now(),
    name: src.name + ' (nusxa)',
    createdAt: now(),
    updatedAt: now(),
  }
  projects.unshift(newProj)
  saveProjects(projects)
  return newProj
}

export function deleteProject(id) {
  let projects = loadProjects()
  if (projects.length <= 1) return false
  projects = projects.filter(p => p.id !== id)
  saveProjects(projects)
  return true
}

export function renameProject(id, name) {
  const projects = loadProjects()
  const p = projects.find(p => p.id === id)
  if (p) { p.name = name; p.updatedAt = now(); saveProjects(projects) }
}

export function updateProjectData(id, data) {
  const projects = loadProjects()
  const p = projects.find(p => p.id === id)
  if (p) { p.data = data; p.updatedAt = now(); saveProjects(projects) }
}

export function getProject(id) {
  return loadProjects().find(p => p.id === id) || null
}
