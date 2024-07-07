// TodoApp class
class TodoApp {
    constructor() {
        this.projects = [];
        this.currentProject = null;
        this.loadFromLocalStorage();
        if (this.projects.length === 0) {
            this.createProject('Default Project');
        }
    }

    createProject(name) {
        const project = { id: Date.now().toString(), name: name, todos: [] };
        this.projects.push(project);
        if (!this.currentProject) {
            this.currentProject = project;
        }
        this.saveToLocalStorage();
        return project;
    }

    createTodo(title, description, dueDate, priority) {
        const todo = { 
            id: Date.now().toString(),
            title, 
            description, 
            dueDate, 
            priority,
            completed: false
        };
        this.currentProject.todos.push(todo);
        this.saveToLocalStorage();
        return todo;
    }

    deleteTodo(todoId) {
        this.currentProject.todos = this.currentProject.todos.filter(todo => todo.id !== todoId);
        this.saveToLocalStorage();
    }

    saveToLocalStorage() {
        localStorage.setItem('todoApp', JSON.stringify(this.projects));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('todoApp');
        if (data) {
            this.projects = JSON.parse(data);
            this.currentProject = this.projects[0];
        }
    }
}

// DOM manipulation
const todoApp = new TodoApp();

function renderProjects() {
    const projectList = document.getElementById('projects');
    projectList.innerHTML = '';
    todoApp.projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = project.name;
        li.onclick = () => {
            todoApp.currentProject = project;
            renderTodos();
        };
        projectList.appendChild(li);
    });
}

function renderTodos() {
    const todoList = document.getElementById('todos');
    todoList.innerHTML = '';
    document.getElementById('current-project-name').textContent = todoApp.currentProject.name;
    todoApp.currentProject.todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-${todo.priority}`;
        li.innerHTML = `
            <span>${todo.title} - Due: ${todo.dueDate}</span>
            <button onclick="deleteTodo('${todo.id}')">Delete</button>
        `;
        todoList.appendChild(li);
    });
}

function deleteTodo(todoId) {
    todoApp.deleteTodo(todoId);
    renderTodos();
}

// Event Listeners
document.getElementById('new-project').addEventListener('click', () => {
    const projectName = prompt('Enter project name:');
    if (projectName) {
        todoApp.createProject(projectName);
        renderProjects();
    }
});

document.getElementById('new-todo').addEventListener('click', () => {
    const modal = document.getElementById('todo-modal');
    modal.style.display = 'block';
});

document.getElementById('todo-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    todoApp.createTodo(
        form.elements['todo-title'].value,
        form.elements['todo-description'].value,
        form.elements['todo-due-date'].value,
        form.elements['todo-priority'].value
    );
    renderTodos();
    form.reset();
    document.getElementById('todo-modal').style.display = 'none';
});

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('todo-modal').style.display = 'none';
});

// Initial render
renderProjects();
renderTodos();