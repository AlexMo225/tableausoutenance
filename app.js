document.addEventListener('DOMContentLoaded', () => {
    let classes = [];
    let students = {};
    let soutenance = {
        currentClass: localStorage.getItem('currentClass') || null,
        studentsPassed: JSON.parse(localStorage.getItem('studentsPassed') || '[]')
    };

    // Créer une classe
    document.getElementById('create-class-btn').addEventListener('click', () => {
        const className = document.getElementById('class-name-input').value.trim();
        if (className && !classes.includes(className)) {
            classes.push(className);
            students[className] = [];
            updateClassList();
            updateClassSelects();
            document.getElementById('class-name-input').value = '';
        } else {
            alert("Classe déjà existante ou nom invalide.");
        }
    });

    // Mettre à jour la liste des classes avec des boutons Modifier et Supprimer
    function updateClassList() {
        const classList = document.getElementById('class-list');
        classList.innerHTML = '';
        classes.forEach(className => {
            const li = document.createElement('li');
            li.classList.add('flex', 'justify-between', 'items-center', 'mb-2', 'p-2', 'bg-gray-100', 'rounded-lg', 'shadow-md');

            const classText = document.createElement('span');
            classText.textContent = className;
            classText.classList.add('font-semibold', 'text-gray-700', 'mr-2');

            // Bouton de suppression
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Supprimer";
            deleteButton.classList.add(
                'px-3', 'py-1', 'border', 'border-red-500', 'text-red-500', 'rounded-md',
                'hover:bg-red-500', 'hover:text-white', 'transition', 'duration-200', 'ease-in-out', 'text-xs', 'font-medium', 'ml-2'
            );

            deleteButton.addEventListener('click', () => {
                const index = classes.indexOf(className);
                if (index > -1) {
                    classes.splice(index, 1);
                    delete students[className];
                    updateClassList();
                    updateClassSelects();
                }
            });

            // Bouton de modification
            const editButton = document.createElement('button');
            editButton.textContent = "Modifier";
            editButton.classList.add(
                'px-3', 'py-1', 'border', 'border-blue-500', 'text-blue-500', 'rounded-md',
                'hover:bg-blue-500', 'hover:text-white', 'transition', 'duration-200', 'ease-in-out', 'text-xs', 'font-medium', 'ml-2'
            );

            editButton.addEventListener('click', () => {
                const newClassName = prompt("Entrez le nouveau nom de la classe:", className);
                if (newClassName && newClassName !== className && !classes.includes(newClassName)) {
                    const index = classes.indexOf(className);
                    classes[index] = newClassName;
                    students[newClassName] = students[className];
                    delete students[className];
                    updateClassList();
                    updateClassSelects();
                } else {
                    alert("Nom invalide ou classe déjà existante.");
                }
            });

            li.appendChild(classText);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            classList.appendChild(li);
        });
    }

    // Ajouter un étudiant
    document.getElementById('add-student-btn').addEventListener('click', () => {
        const selectedClass = document.getElementById('class-select').value;
        const studentName = document.getElementById('student-name-input').value.trim();
        if (selectedClass && studentName && !students[selectedClass].includes(studentName)) {
            students[selectedClass].push(studentName);
            updateStudentList(selectedClass);
            document.getElementById('student-name-input').value = '';
        } else {
            alert("Étudiant déjà existant ou nom invalide.");
        }
    });

    // Afficher automatiquement les étudiants lorsqu'une classe est sélectionnée
    document.getElementById('class-select').addEventListener('change', (event) => {
        const selectedClass = event.target.value;
        if (selectedClass) {
            updateStudentList(selectedClass);
        }
    });

    // Mettre à jour la liste des étudiants avec des boutons Modifier et Supprimer
    function updateStudentList(className) {
        const studentList = document.getElementById('student-list');
        studentList.innerHTML = '';

        students[className].forEach(student => {
            const li = document.createElement('li');
            li.classList.add('flex', 'justify-between', 'items-center', 'mb-2', 'p-2', 'bg-gray-100', 'rounded-lg', 'shadow-md');

            const studentText = document.createElement('span');
            studentText.textContent = student;
            studentText.classList.add('font-semibold', 'text-gray-700', 'mr-2');

            // Bouton de suppression
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Supprimer";
            deleteButton.classList.add(
                'px-3', 'py-1', 'border', 'border-red-500', 'text-red-500', 'rounded-md',
                'hover:bg-red-500', 'hover:text-white', 'transition', 'duration-200', 'ease-in-out', 'text-xs', 'font-medium', 'ml-2'
            );

            deleteButton.addEventListener('click', () => {
                const studentIndex = students[className].indexOf(student);
                if (studentIndex > -1) {
                    students[className].splice(studentIndex, 1);
                    updateStudentList(className);
                }
            });

            // Bouton de modification
            const editButton = document.createElement('button');
            editButton.textContent = "Modifier";
            editButton.classList.add(
                'px-3', 'py-1', 'border', 'border-blue-500', 'text-blue-500', 'rounded-md',
                'hover:bg-blue-500', 'hover:text-white', 'transition', 'duration-200', 'ease-in-out', 'text-xs', 'font-medium', 'ml-2'
            );

            editButton.addEventListener('click', () => {
                const newStudentName = prompt("Entrez le nouveau nom de l'étudiant:", student);
                if (newStudentName && newStudentName !== student && !students[className].includes(newStudentName)) {
                    const studentIndex = students[className].indexOf(student);
                    students[className][studentIndex] = newStudentName;
                    updateStudentList(className);
                } else {
                    alert("Nom invalide ou étudiant déjà existant.");
                }
            });

            li.appendChild(studentText);
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            studentList.appendChild(li);
        });
    }

    // Mettre à jour les sélecteurs de classes
    function updateClassSelects() {
        const classSelect = document.getElementById('class-select');
        const soutenanceClassSelect = document.getElementById('soutenance-class-select');
        classSelect.innerHTML = '';
        soutenanceClassSelect.innerHTML = '';
        classes.forEach(className => {
            const option = document.createElement('option');
            option.value = className;
            option.textContent = className;
            classSelect.appendChild(option);
            soutenanceClassSelect.appendChild(option.cloneNode(true));
        });
    }

    // Commencer la soutenance
    document.getElementById('start-soutenance-btn').addEventListener('click', () => {
        const selectedClass = document.getElementById('soutenance-class-select').value;
        if (selectedClass && students[selectedClass].length > 0) {
            soutenance.currentClass = selectedClass;
            soutenance.studentsPassed = [];
            localStorage.setItem('currentClass', selectedClass);
            localStorage.setItem('studentsPassed', JSON.stringify([]));
            updateSoutenanceInfo();
            document.getElementById('soutenance-end-message').textContent = '';
        } else {
            alert("Sélectionnez une classe valide avec des étudiants.");
        }
    });

    // Appeler un étudiant au hasard
    document.getElementById('call-student-btn').addEventListener('click', () => {
        if (!soutenance.currentClass) {
            alert("Commencez une soutenance d'abord.");
            return;
        }

        const remainingStudents = students[soutenance.currentClass].filter(student => !soutenance.studentsPassed.includes(student));
        if (remainingStudents.length > 0) {
            const randomStudent = remainingStudents[Math.floor(Math.random() * remainingStudents.length)];
            soutenance.studentsPassed.push(randomStudent);
            localStorage.setItem('studentsPassed', JSON.stringify(soutenance.studentsPassed));
            document.getElementById('current-student').textContent = `${randomStudent} au tableau!`;
            updateSoutenanceInfo();
        } else {
            document.getElementById('current-student').textContent = '';
            document.getElementById('soutenance-end-message').textContent = "Tous les étudiants ont été appelés.";
        }
    });

    // Mettre à jour les informations de la soutenance
    function updateSoutenanceInfo() {
        const soutenanceInfo = document.getElementById('soutenance-info');
        soutenanceInfo.innerHTML = `Classe actuelle: ${soutenance.currentClass}<br>Étudiants restants: ${students[soutenance.currentClass].filter(student => !soutenance.studentsPassed.includes(student)).length}`;
    }

    updateClassList();
    updateClassSelects();
    updateSoutenanceInfo();
});
