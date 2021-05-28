const input = document.querySelector(".new-todo__input");
const form = document.querySelector(".new-todo");
const todos = document.querySelector(".todos-container");
const todoTemplate = document.querySelector("#todo-item-template");

class Todo {

	constructor(title, id, completed = false) {
		this.title = title;
		this.id = id;
		this.completed = completed;
	}

}

class App {

	// Holds all todos
	#storage = [];

	constructor() {
		this._init();
	}

	// Focuses input form
	_focusInput() {
		input.focus();
	}

	_newTodo(e) {
		e.preventDefault();

		const title = input.value.trim();
		if (!title) return; // Check if empty todo title was passed
		if (title === "clear todos") return this._clearTodos();

		const id = uuidv4();

		const todo = new Todo(title, id, false);

		this.#storage.push(todo);
		this._saveToStorage();
		this._renderTodos();
		
		input.value = "";
	}

	_completeTodo(e) {
		if (e.target === todos) return;

		// Change completed status in #storage
		this.#storage.forEach(entry => {
			if (e.target.dataset.id === entry.id) entry.completed = !entry.completed;
		});

		this._saveToStorage();
		this._renderTodos();
	}

	_renderTodos() {
		// Clear todos container
		todos.textContent = "";
		// Render todos
		this.#storage.forEach(entry => {	
			const { title, id, completed } = entry;
			const todoTemplate = `<li class="todo__item${completed ? " todo__item--completed" : ""}" data-id="${id}" data-completed="${completed}">${title}</li>`;
			todos.insertAdjacentHTML("afterbegin", todoTemplate);
		});
	}

	_saveToStorage() {
		localStorage.setItem("storage", JSON.stringify(this.#storage));
	}

	_loadFromStorage() {
		// Get from storage
		const data = JSON.parse(localStorage.getItem("storage"));
		// If empty storage
		if (!data) return;
		// Rebuild Todo class instances
		data.forEach(entry => {
			const { title, id, completed } = entry;
			const todo = new Todo(title, id, completed);
			this.#storage.push(todo);
		});
	}

	_clearTodos() {
		input.value = "";
		this.#storage = [];
		todos.textContent = "";
		this._saveToStorage();
	}

	_init() {
		// Focus input on any key press
		document.addEventListener("keydown", this._focusInput);

		// New todo on submit/enter
		form.addEventListener("submit", this._newTodo.bind(this));

		// To-do container click listener -> complete a task
		todos.addEventListener("click", this._completeTodo.bind(this));

		this._loadFromStorage();
		this._renderTodos();
	}

}

const app = new App();