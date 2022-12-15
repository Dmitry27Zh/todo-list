import { copyObjectWithJSON, replaceAllObjectProperties } from '../utils/object.js'

const initTodo = () => {
  const localData = localStorage?.getItem('todo')
  const data = localData ? JSON.parse(localData) : DEFAULT_DATA
  const tasks = data.tasks
  const taskElements = new Map()
  const form = document.querySelector('.todo__form')
  const taskContainer = form.querySelector('.todo__list')
  const newTaskInput = form.querySelector('.todo__new-input')
  const defaultPlaceholder = newTaskInput.placeholder
  let lastNewTaskInputValue = ''

  if (!form) {
    return
  }

  const addTaskElement = (task) => {
    const taskMarkup = createTaskMarkup(task)
    taskContainer.insertAdjacentHTML('beforeend', taskMarkup)
    taskElements.set(taskContainer.lastElementChild, task)
  }

  const initTaskList = () => {
    tasks.forEach(addTaskElement)

    taskContainer.addEventListener('click', (e) => {
      if (!e.target.matches('.todo__btn')) {
        return
      }

      e.preventDefault()
      const taskElement = e.target.closest('.todo__task')
      const task = taskElements.get(taskElement)

      if (e.target.matches('.todo__task-status')) {
        changeTaskStatus(task, taskElement, e.target)
      }

      if (e.target.matches('.todo__task-delete')) {
        deleteTask(task, taskElement)
      }
    })
  }

  const initNewTaskAddition = () => {
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      const title = newTaskInput.value.trim()

      if (title) {
        addNewTask(title)
      } else {
        showState(Message.NEW_TASK_ERROR)
      }
    })
  }

  initTaskList()
  initNewTaskAddition()

  const addNewTask = (title) => {
    const task = { title, done: false }

    changeData(() => {
      tasks.push(task)
    }).then(() => {
      newTaskInput.value = ''
      addTaskElement(task, taskContainer, taskElements)
    })
  }

  const changeTaskStatus = (task, taskElement, button) => {
    const done = !task.done

    changeData(() => (task.done = done)).then(() => {
      const statusCheckbox = button.querySelector('.todo__task-status-input')
      statusCheckbox.checked = done
    })
  }

  const deleteTask = (task, taskElement) => {
    changeData(() => {
      const index = tasks.indexOf(task)
      tasks.splice(index, 1)
    }).then(() => {
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

  const changeData = async (cb) => {
    const savedData = copyObjectWithJSON(data)
    cb(data)

    try {
      await storeData()
    } catch (e) {
      undoDataChange(data, savedData)
      showState(Message.DATA_SAVE_ERROR, true)
      return Promise.reject()
    }
  }

  const storeData = () => {
    showState(Message.LOADING, false, 'loading')

    return new Promise((resolve, reject) => {
      const localData = JSON.stringify(data)

      if (localStorage) {
        localStorage.setItem('todo', localData)
        resolve()
      } else {
        reject()
      }
    }).finally(() => {
      removeState(true)
    })
  }

  const showState = (message, returnLastValue, state = 'error', autoRemove = true) => {
    lastNewTaskInputValue = newTaskInput.value
    newTaskInput.value = ''
    newTaskInput.placeholder = message
    newTaskInput.setAttribute('readonly', '')
    form.dataset.state = state

    if (autoRemove) {
      setTimeout(() => removeState(returnLastValue), Timeout.MESSAGE_AUTOREMOVE)
    }
  }

  const removeState = (returnLastValue) => {
    newTaskInput.placeholder = defaultPlaceholder
    newTaskInput.removeAttribute('readonly')
    newTaskInput.focus()
    form.dataset.state = ''

    if (returnLastValue) {
      newTaskInput.value = lastNewTaskInputValue
    }
  }
}

const DEFAULT_DATA = { tasks: [] }

const Message = {
  NEW_TASK_ERROR: 'Error! Non-valid task name',
  DATA_SAVE_ERROR: 'Data save is now unavailable!',
  LOADING: 'Loading...',
}

const Timeout = {
  MESSAGE_AUTOREMOVE: 2000,
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

const undoDataChange = (data, savedData) => replaceAllObjectProperties(data, savedData)
initTodo()
