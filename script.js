let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

const input = document.getElementById("taskInput");
const addButton = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const clearAllBtn = document.getElementById("clearAllBtn");
const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const categorySelect = document.getElementById("categorySelect");


function addTask() {
    const taskText = input.value.trim();

    if (taskText === "") return;

    tasks.push({
        text: taskText,
        completed: false,
        isEditing: false,
        category: categorySelect.value
    });

    
    input.value = "";
    saveTasks();
    renderTasks();

}

addButton.addEventListener("click", addTask);

input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }
});

clearAllBtn.addEventListener("click", function() {
    const confirmDelete = confirm("Delete all tasks?");

    if (confirmDelete){
        tasks.length = 0;  //clear array
        saveTasks(); //update localStorage
        renderTasks();     //update UI
    }
});


allBtn.addEventListener("click", function() {
    currentFilter = "all";
    setActiveFilter(allBtn);
    renderTasks();
});

completedBtn.addEventListener("click", function() {
    currentFilter = "completed";
    setActiveFilter(completedBtn)
    renderTasks();
});

pendingBtn.addEventListener("click", function() {
    currentFilter = "pending";
    setActiveFilter(pendingBtn)
    renderTasks();
});

themeToggleBtn.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggleBtn.textContent = "Light Mode";
    } else {
        themeToggleBtn.textContent = "Dark Mode";
    }
});

function renderTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    filteredTasks.forEach(function(task) {
        const realIndex = tasks.indexOf(task);

        const li = document.createElement("li");
        
        let textElement;

        if(task.isEditing) {
            textElement = document.createElement("input");
            textElement.type = "text";
            textElement.value = task.text;
            textElement.classList.add("edit-input");

            // focus after rendering
            setTimeout(() => textElement.focus(), 0);

            // Enter key works here 
            textElement.addEventListener("keydown", function(event) {
                if (event.key === "Enter") {
                    event.preventDefault();

                    const newText = textElement.value.trim();
                    if (newText === "") return;

                    task.text = newText;
                    task.isEditing = false;
                    saveTasks();
                    renderTasks();
                }
            });
            
        } else {
            textElement = document.createElement("span");
            textElement.textContent = task.text;

            if (task.completed) {
                textElement.classList.add("completed");
            }

            
        }

        const buttonGroup = document.createElement("div");
        buttonGroup.classList.add("task-buttons");

        const completeBtn = document.createElement("button");
        completeBtn.textContent = task.completed ? "Undo" : "Complete";
        completeBtn.classList.add("complete-btn");

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        const editBtn = document.createElement("button");
        editBtn.textContent = task.isEditing ? "Save" : "Edit";
        editBtn.classList.add("edit-btn");

        const categoryTag = document.createElement("small");
        categoryTag.textContent = task.category;
        categoryTag.classList.add("category-tag");

        const textWrapper = document.createElement("div");
        textWrapper.classList.add("task-text-wrapper");

        textWrapper.appendChild(textElement);
        textWrapper.appendChild(categoryTag);

        //complete toggle
        completeBtn.addEventListener("click", function () { 
            task.completed = !task.completed;
            saveTasks();
            renderTasks();
        });

        //Delete
        deleteBtn.addEventListener("click", function () {
            tasks.splice(realIndex, 1);
            saveTasks();
            renderTasks();
        });

       
        editBtn.addEventListener("click", function () {
            if (task.isEditing) {
                const newText = textElement.value.trim();

                if (newText === "") return;

                task.text = newText;
                task.isEditing = false;
                saveTasks();
                renderTasks(); 

            } else {
                tasks.forEach(function(item){
                    item.isEditing = false;
                });

                task.isEditing = true;
                renderTasks();
            }
        });

        
        
        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(completeBtn);
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(textWrapper);
        li.appendChild(buttonGroup);
        taskList.appendChild(li);


    });

    if (tasks.length === 0) {
        taskCount.textContent = "No tasks yet";

    } else {
        const remaining = tasks.filter(task => !task.completed).length;

        if (remaining === 0) {
            taskCount.textContent = "All tasks completed 🎉";
        } else {
            taskCount.textContent = remaining + " tasks left";
        }
    }
} 

function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function setActiveFilter(button){
    allBtn.classList.remove("active-filter");
    completedBtn.classList.remove("active-filter");
    pendingBtn.classList.remove("active-filter");

    button.classList.add("active-filter");
}

renderTasks();
setActiveFilter(allBtn);

