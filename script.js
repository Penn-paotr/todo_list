//Variables
const newTaskInput = document.querySelector("#new-task input");
const tasksUl = document.querySelector("#tasks");
let deleteTasks, editTasks, tasks;
let updateNote = "";
let count;

//Au chargement de la page
window.onload = () => {
  updateNote = "";
  count = Object.keys(localStorage).length;
  displayTasks();
};

//Affichage des tâches
const displayTasks = () => {
  if (Object.keys(localStorage).length > 0) {
    tasksUl.style.display = "inline-block";
  } else {
    tasksUl.style.display = "none";
  }

  //Effacement des tâches
  tasksUl.innerHTML = "";

  //Local storage
  let tasks = Object.keys(localStorage);
  tasks = tasks.sort();

  for (let key of tasks) {

    //Récupérer chaque valeur
    let value = localStorage.getItem(key);
    let taskLi = document.createElement("div");
    taskLi.classList.add("task");
    taskLi.setAttribute("id", key);
    taskLi.innerHTML = `<span id="taskname">${key.split("_")[1]}</span>`;
    //Reparsage en booleen de la valeur parsée en string pour stockage dans Local Storage
    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
    if (!JSON.parse(value)) {
      editButton.style.visibility = "visible";
    } else {
      editButton.style.visibility = "hidden";
      taskLi.classList.add("completed");
    }
    taskLi.appendChild(editButton);
    taskLi.innerHTML += `<button class="delete"><i class="fa-solid fa-trash"></i></button>`;
    tasksUl.appendChild(taskLi);
  }

  //Stockage des tâches complétées dans le Local Storage
  tasks = document.querySelectorAll(".task");
  tasks.forEach((element, index) => {
    element.onclick = () => {
      //Lise à jour du Local Storage
      if (element.classList.contains("completed")) {
        updateStorage(element.id.split("_")[0], element.innerText, false);
      } else {
        updateStorage(element.id.split("_")[0], element.innerText, true);
      }
    };
  });

  //Gérer les tâches
  editTasks = document.getElementsByClassName("edit");
  Array.from(editTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      //Empêcher la propagation aux autres éléments quand delete cliqué
      e.stopPropagation();
      //Inactiver les autres boutons quand une tâche est en cours de gestion
      disableButtons(true);
      //Mettre à jour la vealeur de l'input et effacer la div
      let parent = element.parentElement;
      newTaskInput.value = parent.querySelector("#taskname").innerText;
      //Insérer du contenu dans la tâche en cours de gestion
      updateNote = parent.id;
      //Enlever la tâche
      parent.remove();
    });
  });

  //Effacer les tâches
  deleteTasks = document.getElementsByClassName("delete");
  Array.from(deleteTasks).forEach((element, index) => {
    element.addEventListener("click", (e) => {
      e.stopPropagation();
      //Effacer la tâche du Local Storage et enlever la Li correspondante
      let parent = element.parentElement;
      removeTask(parent.id);
      parent.remove();
      count -= 1;          // <=> count --1
    });
  });
};

//Inactiver Edit Button
const disableButtons = (bool) => {
  let editButtons = document.getElementsByClassName("edit");
  Array.from(editButtons).forEach((element) => {
    element.disabled = bool;
  });
};

//Enlever la tâche du local Storage
const removeTask = (taskValue) => {
  localStorage.removeItem(taskValue);
  displayTasks();
};

//Enregistrer une nouvelle tâche dans Local Storage
const updateStorage = (index, taskValue, completed) => {
  localStorage.setItem(`${index}_${taskValue}`, completed);
  displayTasks();
};

//Fonction événement click pour ajouter une nouvelle tâche
document.querySelector("#push").addEventListener("click", () => {
  //Activer Edit Button
  disableButtons(false);
  if (newTaskInput.value.length == 0) {
    alert("Entrez une tâche s'il vous plait !");
  } else {
    //Afficher depuis le Local Storage
    if (updateNote == "") {
      //Nouvelle tâche
      updateStorage(count, newTaskInput.value, false);
    } else {
      //Mise à jour de la tâche
      let existingCount = updateNote.split("_")[0];
      removeTask(updateNote);
      updateStorage(existingCount, newTaskInput.value, false);
      updateNote = "";
    }
    count ++;
    newTaskInput.value = "";
  }
});