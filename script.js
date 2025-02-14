import { editIcon, addIcon} from "./icons.js";
import { getTaskStructure } from "./structures.js";

let tasks = [];
let editIndex = null;

const input = document.getElementById("input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const microphone = document.getElementById("microphone");

document.addEventListener("DOMContentLoaded", () =>{
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if(storedTasks){
        tasks = storedTasks;
        updateStats();
        updateTaskList();
    }
    addTaskButton.addEventListener("click", addTask);

    const recognition = setUpSpeechRecognition();

    microphone.addEventListener("click", () =>{
        recognition.start();
        input.classList.add("active");
    });

    recognition.addEventListener("end", () =>{
        recognition.stop();
        input.classList.remove("active");
    });

    recognition.addEventListener("result", (e) =>{
        const speechToText = e.results[0][0].transcript;
        input.value = speechToText;
    });

});

const addTask = () =>{
    console.log("before");
    const text = input.value.trim();
    if(text === ""){
        alert("Please write something!");
        return;
    }
    console.log("after");

    if(editIndex !== null){
        tasks[editIndex].text = text;
        editIndex = null;
        addTaskButton.innerHTML = addIcon;
    } else{
        tasks.push({text, isCompleted: false});
    }

    input.value = "";
    updateTaskList();
    updateStats();
    saveTasks();
};

const toggleTaskCompleted = (index, target) => {
    tasks[index].isCompleted = !tasks[index].isCompleted;

    const taskElement = target.parentElement.parentElement;
    taskElement.classList.toggle("completed");
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const taskSummary = document.querySelector("#task-summary");
    const progress = document.querySelector("#progress");

    const totalTasks = tasks.length;
    const totalCompletedTasks = tasks.filter((task) => task.isCompleted).length;
    const completionPercentage = (totalCompletedTasks / totalTasks) * 100;

    progress.style.width = `${completionPercentage}%`;
    taskSummary.textContent = `${totalCompletedTasks} / ${totalTasks}`;
};

const editTask = (index, target) =>{
    Array.from(taskList.children).forEach((task) => task.classList.remove("editing"));

    const taskElement = target.parentElement.parentElement;
    taskElement.classList.add("editing");
    input.value = tasks[index].text;
    addTaskButton.innerHTML = editIcon;

    editIndex = index;
};

const deleteTask = (index) =>{
    tasks.splice(index, 1);
    updateStats();
    updateTaskList();
    saveTasks();
};

const saveTasks = () =>{
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

const updateTaskList = () =>{
    taskList.innerHTML = "";
   
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = `task ${task.isCompleted ? "completed" : ""}`
        li.innerHTML = getTaskStructure(task, index);
        taskList.appendChild(li);

        const checkbox = li.querySelector(".checkbox");
        checkbox.addEventListener("change", (e) => toggleTaskCompleted(index, e.target));

        const editButton = li.querySelector(".edit");
        editButton.addEventListener("click", (e) => editTask(index, e.target));

        const deleteButton = li.querySelector(".delete");
        deleteButton.addEventListener("click", () => deleteTask(index));
    });
};

const setUpSpeechRecognition = () =>{
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    // recognition.lang = "en-US";
    recognition.lang = "mn-MN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    return recognition;
};









