// public/script.js (updated)
document.addEventListener('DOMContentLoaded', () => {
    const todoList = document.getElementById('todo-list');
    const newTodoInput = document.getElementById('new-todo-input');
    const dueDateInput = document.getElementById('due-date-input');
    const priorityInput = document.getElementById('priority-input');
    const categoryInput = document.getElementById('category-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const API_URL = 'https://demo-container.graymushroom-03debb04.southeastasia.azurecontainerapps.io/api/todos';

    // Helper function to convert priority number to stars
    const getPriorityStars = (priority) => {
        switch (priority) {
            case 1:
                return '⭐'; // or '*'
            case 2:
                return '⭐⭐'; // or '**'
            case 3:
                return '⭐⭐⭐'; // or '***'
            default:
                return '';
        }
    };

    // Function to fetch and display all todos
    const fetchTodos = async () => {
        try {
            const response = await fetch(API_URL);
            const todos = await response.json();
            renderTodos(todos);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    // Function to render todos on the page
    const renderTodos = (todos) => {
        todoList.innerHTML = '';
        todos.forEach(todo => {
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.dataset.id = todo._id;

            const details = document.createElement('div');
            details.className = 'todo-details';

            const todoText = document.createElement('span');
            todoText.textContent = todo.title;
            todoText.className = 'todo-text';
            if (todo.completed) {
                todoText.classList.add('completed');
            }
            // Event listener for toggling completion
            todoText.addEventListener('click', () => toggleComplete(todo._id, todo.completed));

            const metaData = document.createElement('div');
            metaData.className = 'todo-meta';
            const dueDateText = todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'No Due Date';
            // Use the new helper function to display stars instead of the number
            const priorityStars = getPriorityStars(todo.priority);
            metaData.innerHTML = `
                <span>Priority: ${priorityStars}</span> |
                <span>Due: ${dueDateText}</span> |
                <span>Category: ${todo.category}</span>
            `;

            details.appendChild(todoText);
            details.appendChild(metaData);

            const actions = document.createElement('div');
            actions.className = 'todo-actions';

            const toggleBtn = document.createElement('input');
            toggleBtn.type = 'checkbox';
            toggleBtn.checked = todo.completed;
            toggleBtn.addEventListener('change', () => toggleComplete(todo._id, todo.completed));

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '✖';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteTodo(todo._id));

            actions.appendChild(toggleBtn);
            actions.appendChild(deleteBtn);

            li.appendChild(details);
            li.appendChild(actions);
            todoList.appendChild(li);
        });
    };

    // Function to add a new todo
    const addTodo = async () => {
        const title = newTodoInput.value.trim();
        const dueDate = dueDateInput.value || null;
        const priority = parseInt(priorityInput.value); // Ensure priority is a number
        const category = categoryInput.value.trim() || 'General';

        if (title === '') {
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, dueDate, priority, category }),
            });
            if (response.ok) {
                newTodoInput.value = '';
                dueDateInput.value = '';
                priorityInput.value = '1';
                categoryInput.value = '';
                fetchTodos();
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    // Function to toggle a todo's completion status
    const toggleComplete = async (id, currentStatus) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: !currentStatus }),
            });
            fetchTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    // Function to delete a todo
    const deleteTodo = async (id) => {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    // Event listeners
    addTodoBtn.addEventListener('click', addTodo);
    newTodoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Initial fetch to load todos
    fetchTodos();
});