import { copyObjectWithJSON, replaceAllObjectProperties } from '../utils/object.js'

const initTodo = () => {
  const data = { tasks: [] }
  const tasks = data.tasks
  const taskElements = new Map()
  const form = document.querySelector('.todo__form')
  const taskContainer = form.querySelector('.todo__list')
  const newTaskInput = form.querySelector('.todo__new-input')

  if (!form) {
    return
  }

  initTaskList(tasks, taskElements, taskContainer, form, data, newTaskInput)
  initNewTaskAddition(tasks, taskElements, taskContainer, form, data, newTaskInput)
}

const ErrorMessage = {
  NEW_TASK: 'Error! Non-valid task name',
  DATA_SAVE: 'Data save is now unavailable!',
}

const initTaskList = (tasks, taskElements, taskContainer, form, data, newTaskInput) => {
  taskContainer.addEventListener('click', (e) => {
    if (!e.target.matches('.todo__btn')) {
      return
    }

    e.preventDefault()
    const taskElement = e.target.closest('.todo__task')
    const task = taskElements.get(taskElement)

    if (e.target.matches('.todo__task-status')) {
      changeTaskStatus(task, e.target, data, newTaskInput, form)
    }

    if (e.target.matches('.todo__task-delete')) {
      deleteTask(task, tasks, taskElement, data, newTaskInput, form)
    }
  })
}

const changeTaskStatus = (task, button, data, newTaskInput, form) => {
  const done = !task.done

  changeData(data, () => (task.done = done), newTaskInput, form).then(() => {
    const statusCheckbox = button.querySelector('.todo__task-status-input')
    statusCheckbox.checked = done
  })
}

const deleteTask = (task, tasks, taskElement, data, newTaskInput, form) => {
  changeData(
    data,
    () => {
      const index = tasks.indexOf(task)
      tasks.splice(index, 1)
    },
    newTaskInput,
    form
  ).then(() => {
    taskElement.dataset.action = 'delete'
    taskElement.addEventListener('transitionend', onTransitionend)
  })

  const onTransitionend = (e) => {
    if (e.target === taskElement) {
      taskElement.remove()
      taskElement.removeEventListener('transitionend', onTransitionend)
    }
  }
}

const initNewTaskAddition = (tasks, taskElements, taskContainer, form, data, newTaskInput) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const title = newTaskInput.value.trim()

    if (title) {
      addNewTask(tasks, taskContainer, title, taskElements, data, newTaskInput, form)
      newTaskInput.value = ''
      newTaskInput.focus()
    } else {
      showErrorMessage(newTaskInput, ErrorMessage.NEW_TASK, form)
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

const showErrorMessage = (newTaskInput, errorMessage, form) => {
  const defaultPlaceholder = newTaskInput.placeholder
  newTaskInput.value = ''
  newTaskInput.placeholder = errorMessage
  newTaskInput.setAttribute('readonly', '')
  form.dataset.state = 'error'

  setTimeout(() => {
    newTaskInput.placeholder = defaultPlaceholder
    newTaskInput.removeAttribute('readonly')
    newTaskInput.focus()
    form.dataset.state = ''
  }, 2000)
}

const addNewTask = (tasks, container, title, taskElements, data, newTaskInput, form) => {
  const task = { title, done: false }

  changeData(
    data,
    () => {
      tasks.push(task)
    },
    newTaskInput,
    form
  ).then(() => {
    const taskMarkup = createTaskMarkup(task)
    container.insertAdjacentHTML('beforeend', taskMarkup)
    taskElements.set(container.lastElementChild, task)
  })
}

const changeData = async (data, cb, newTaskInput, form) => {
  const savedData = copyObjectWithJSON(data)
  cb(data)

  try {
    await storeData(data)
  } catch (e) {
    replaceAllObjectProperties(data, savedData)
    showErrorMessage(newTaskInput, ErrorMessage.DATA_SAVE, form)
    return Promise.reject()
  }
}

const storeData = (data) => {
  return new Promise((resolve, reject) => {
    const localData = JSON.stringify(data)

    if (localStorage) {
      localStorage.setItem('todo', localData)

      if (crush) {
        throw new Error()
      }

      resolve()
    } else {
      reject()
    }
  })
}

initTodo()
