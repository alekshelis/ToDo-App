const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const popup = document.querySelector('.popup');
const img = document.querySelector('.popup__img');
const blur = document.querySelector('.popup__blur');
const popup__text = document.querySelector('.popup__text');

let tasks = [];

if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach(task => {
		renderTask(task);
	});
}

checkEmptyList();

form.addEventListener('submit',addTask);

async function addTask(event) {
	event.preventDefault();

	const taskText = taskInput.value;

	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	}

	renderTask(newTask);

	tasks.push(newTask);

	if (tasks.length % 3 == 0) {
		renderPopup(await getPhoto());
		setTimeout(closePopup ,3000)
	}

	taskInput.value = '';
	taskInput.focus();

	checkEmptyList();

	saveToLocalStorage ();
};

blur.addEventListener('click', closePopup);


tasksList.addEventListener('click', deleteTask);


function deleteTask (event) {
	if (event.target.dataset.action !== 'delete') {
		return
	}

	const parentNode = event.target.closest('.list-group-item');

	const id = Number(parentNode.id);

	tasks = tasks.filter((task) => task.id !== id);

	saveToLocalStorage ();

	parentNode.remove();

	checkEmptyList();
}


tasksList.addEventListener('click', doneTask);

function doneTask (event) {
	if (event.target.dataset.action !== 'done') {
		return
	}

	const parentNode = event.target.closest('.list-group-item');

	const id = Number(parentNode.id);

	const task = tasks.find((task) => task.id === id);
	task.done = !task.done;

	parentNode.querySelector('.task-title').classList.toggle('task-title--done');

	saveToLocalStorage ()
}

function checkEmptyList() {
	if(tasks.length === 0) {
		const emptyListHTML = `
			<li id="emptyList" class="list-group-item empty-list">
				<div class="empty-list__title">Ебать ты деловой</div>
			</li> 
		`;``
		tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
	} 
	
	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
}

function saveToLocalStorage () {
	localStorage.setItem('tasks', JSON.stringify(tasks))
}


function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

	const taskHTML = `
				<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
					<span class="${cssClass}">${task.text}</span>
					<div class="task-item__buttons">
						<button type="button" data-action="done" class="btn-action">
							<img src="./img/tick.svg" alt="Done" width="18" height="18">
						</button>
						<button data-bs-toggle="tooltip" data-bs-placement="top" title="Обосрался?" type="button" data-action="delete" class="btn-action">
							<img src="./img/cross.svg" alt="Done" width="18" height="18">
						</button>
					</div>
				</li>
	`;

	tasksList.insertAdjacentHTML("beforeend", taskHTML);
}
 
async function getPhoto () {
	let request = await fetch (`https://picsum.photos/1920`)
	
	return request.url
}

function renderPopup (link) {
	img.src = link;
	popup__text.innerHTML = arrPodjebki[randomInteger(0, arrPodjebki.length - 1)]
	popup.classList.remove('none');
	
}

function closePopup(){
	popup.classList.add('none');
}


let arrPodjebki = [
	'нихуя, так много ?!',
	'точно вывезешь?',
	'ну это уже перебор',
	'сначала те сделай!',
	'ну все все, теперь точно продуктивный',
	'тебе за это хоть заплатят?',
]

function randomInteger(min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
  }


