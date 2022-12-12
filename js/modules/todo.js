const initTodo = () => {
  const form = document.querySelector('.todo__form')
  const data = { tasks: [] }
  const tasks = data.tasks

  if (!form) {
    return
  }

  initNewTaskAddition(tasks, form)
}

const initNewTaskAddition = (tasks, form) => {
  const newTaskInput = form.querySelector('.todo__new-input')
  const taskContainer = form.querySelector('.todo__list')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const title = newTaskInput.value.trim()

    if (title) {
      addNewTask(tasks, taskContainer, title)
    } else {
      showNewTaskErrorMessage(newTaskInput)
    }
  })
}

const createTaskMarkup = (task) => {
  const { title, done } = task
  const checked = done ? 'checked' : ''

  return `
    <li class="todo__task">
      <h3 class="todo__task-title">${title}</h3>
      <label class="todo__btn todo__task-status">
        <span class="visually-hidden">Mark status</span>
        <input class="todo__task-input visually-hidden" type="checkbox" name="New Task status" ${checked}/>
        <span class="todo__task-icon todo__task-done"><i class="fa-solid fa-check"></i></span>
        <span class="todo__task-icon todo__task-undone">–</span>
      </label>
      <button class="todo__btn todo__task-delete" type="button">
        <span class="visually-hidden">Delete task</span>
        <i class="fa-solid fa-trash"></i>
      </button>
    </li>
  `
}

const showNewTaskErrorMessage = (newTaskInput) => {
  const defaultPlaceholder = newTaskInput.placeholder
  newTaskInput.value = ''
  newTaskInput.blur()
  newTaskInput.placeholder = 'Error! Non-valid task name'
  newTaskInput.setAttribute('readonly', '')

  setTimeout(() => {
    newTaskInput.placeholder = defaultPlaceholder
    newTaskInput.removeAttribute('readonly')
    newTaskInput.focus()
  }, 2000)
}

const addNewTask = (tasks, container, title) => {
  const task = { title, done: false }
  tasks.push(task)
  const taskMarkup = createTaskMarkup(task)
  container.insertAdjacentHTML('beforeend', taskMarkup)
}

initTodo()
