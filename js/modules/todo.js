const initTodo = () => {
  const data = { tasks: [] }
  const tasks = data.tasks
  const taskElements = new Map()
  const form = document.querySelector('.todo__form')
  const taskContainer = form.querySelector('.todo__list')

  if (!form) {
    return
  }

  initTaskList(taskElements, taskContainer)
  initNewTaskAddition(tasks, form, taskElements, taskContainer)
}

const initTaskList = (taskElements, taskContainer) => {
  taskContainer.addEventListener('click', (e) => {
    if (!e.target.matches('.todo__btn')) {
      return
    }

    e.preventDefault()
    const taskElement = e.target.closest('.todo__task')
    const task = taskElements.get(taskElement)

    if (task) {
      task.done = !task.done
    }

    if (e.target.matches('.todo__task-status')) {
      const statusCheckbox = e.target.querySelector('.todo__task-status-input')
      statusCheckbox.checked = task.done
    }
  })
}

const initNewTaskAddition = (tasks, form, taskElements, taskContainer) => {
  const newTaskInput = form.querySelector('.todo__new-input')

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const title = newTaskInput.value.trim()

    if (title) {
      addNewTask(tasks, taskContainer, title, taskElements)
      newTaskInput.value = ''
      newTaskInput.focus()
    } else {
      showNewTaskErrorMessage(newTaskInput)
    }
  })
}

const createTaskMarkup = (task) => {
  const { title, done } = task
  const checked = done ? 'checked' : ''
  const name = `status of «${title}»`

  return `
    <li class="todo__task">
      <h3 class="todo__task-title">${title}</h3>
      <label class="todo__btn todo__task-status">
        <span class="visually-hidden">Mark status</span>
        <input class="todo__task-status-input visually-hidden" type="checkbox" name="${name}" ${checked}/>
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
  newTaskInput.placeholder = 'Error! Non-valid task name'
  newTaskInput.setAttribute('readonly', '')

  setTimeout(() => {
    newTaskInput.placeholder = defaultPlaceholder
    newTaskInput.removeAttribute('readonly')
    newTaskInput.focus()
  }, 2000)
}

const addNewTask = (tasks, container, title, taskElements) => {
  const task = { title, done: false }
  tasks.push(task)
  const taskMarkup = createTaskMarkup(task)
  container.insertAdjacentHTML('beforeend', taskMarkup)
  taskElements.set(container.lastElementChild, task)
}

initTodo()
