class Home {
    constructor() {
        this.classrooms = "";
        this.edit_SelectedClassroom = "";
        this.welcome()
        this.logOut()
        this.loadControlPanel()
        this.role = sessionStorage.getItem("role");
        this.loadRole();
    }

    loadRole() {
        if (this.role != 'Admin') {
            const element = document.querySelector(".openCP");
            element.remove();
        }
    }

    getCookie(name) {
        const cookies = document.cookie;

        const cookieArray = cookies.split('; ');

        for (const cookie of cookieArray) {
            const [cookieName, cookieValue] = cookie.split('=');

            if (cookieName === name) {
                return cookieValue;
            }
        }
        return null;
    }

    checkSession() {
        fetch('https://localhost:7058/api/User/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Session is not valid');
                }
            })
            .then(data => {
                console.log("Logged in!");
            })
            .catch(error => {
                console.error('Error validating session:', error);
                window.location = 'login.html';
            });
    }

    setAmphitheaterTitle(title) {
        localStorage.setItem('amphitheaterTitle', title);
        window.location.href = 'kalendar.html';
    }

    loadClassrooms() {
        var base = this;
        fetchStudy();
        async function fetchStudy() {
            try {
                const response = await fetch(`https://localhost:7058/api/Classroom/api/getClassrooms`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                base.classrooms = await response.json();
                base.classrooms.forEach(element => {
                    base.generateDivForAmphi(element.classroom_name, element.id)
                });

            } catch (error) {
                console.error('There was a problem with the fetch operation:', error);
            }
        }
    }

    generateDivForAmphi(classroom_name, id) {

        let divForGeneratedDivs = document.querySelector('.zaAmfi')

        let divImageContainer = document.createElement('div')
        divImageContainer.className = 'image-container'
        divImageContainer.id = id;
        divImageContainer.setAttribute('classroom_name', classroom_name)

        let img1 = document.createElement('img')
        img1.src = 'photos/a1.jpeg'

        let divOverlay = document.createElement('div')
        divOverlay.className = 'overlay'

        let divTextContainer = document.createElement('div')
        divTextContainer.className = 'text-container'

        let title1 = document.createElement('h1')
        title1.innerHTML = classroom_name;

        divTextContainer.appendChild(title1)
        divOverlay.appendChild(divTextContainer)
        divImageContainer.appendChild(divOverlay)
        divImageContainer.appendChild(img1)
        divForGeneratedDivs.appendChild(divImageContainer)

        divImageContainer.addEventListener('click', function () {
            localStorage.setItem('classroom_name', classroom_name)
            window.location = 'kalendar.html'

        })
    }

    welcome() {
        const userName = sessionStorage.getItem('userName');
        console.log(userName);
        if (userName) {
            const pTag = document.querySelector('.loggedUser');
            if (pTag) {
                pTag.textContent = `${userName}`;
            }
        }
    }

    clearCP() {

        let classrooms = document.querySelector('.classrooms')
        while (classrooms.firstChild) {
            classrooms.removeChild(classrooms.firstChild);
        }
    }

    loadControlPanel() {
        var base = this;
        let openCP = document.querySelector('.openCP')

        openCP.addEventListener('click', function () {
            let popUp = document.querySelector('.popUp')
            let controlPanel = document.querySelector('.controlPanel')
            popUp.style.display = 'block'
            controlPanel.style.display = 'block'
            base.clearCP();

            fetchStudy();
            async function fetchStudy() {
                try {
                    const response = await fetch(`https://localhost:7058/api/Classroom/api/getClassrooms`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    base.classrooms = await response.json();

                    deleteClassrooms();
                    function deleteClassrooms() {
                        let a = document.querySelectorAll('.rowForClassrooms')
                        a.forEach(classroom => classroom.remove());
                    }

                    base.classrooms.forEach(ele => {
                        base.generateClassroomContent(ele.classroom_name, ele.id)
                    });
                } catch (error) {
                    console.error('There was a problem with the fetch operation:', error);
                }
            }

            let addClassroom = document.querySelector('.addClassroom')
            addClassroom.addEventListener('click', function () {
                let addClassroomForm = document.querySelector('.addClassroomForm')
                let popUp = document.querySelector('.popUp')
                let controlPanel = document.querySelector('.controlPanel')

                let addClassromButton = document.querySelector('.addClassroomButton')

                let add_classroomName = document.querySelector('.add_classroomName')
                let add_chairRow = document.querySelector('.add_chairRow')
                let add_chairColum = document.querySelector('.add_chairColumn')

                popUp.style.display = 'block'
                addClassroomForm.style.display = 'block'
                controlPanel.style.display = 'none'

                addClassromButton.addEventListener('click', function () {
                    let controlPanel = document.querySelector('.controlPanel')
                    controlPanel.style.display = 'none'
                    const formData = {
                        id: 0,
                        classroom_name: add_classroomName.value,
                        chairRow: add_chairRow.value,
                        chairColumn: add_chairColum.value,
                    };

                    fetch('https://localhost:7058/api/Classroom/addClassroom', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData),
                        credentials: 'include',
                    })
                        .then((response) => {
                            if (!response.ok) {
                                if (response.status == 400) {
                                    throw new Error(`Uneti podaci su neispravni!`);
                                } else {
                                    throw new Error(`Network response was not ok ${response.status}`);
                                }
                            }
                            return response;
                        })
                        .then(() => {
                            alert("Ucionica uspesno dodata");
                            controlPanel.style.display = 'block';
                            addClassroomForm.style.display = 'none';
                            fetchStudy();
                        })
                        .catch((error) => {
                            alert(error);
                            console.error(error);
                        });
                })

                let addcancelCPButton = document.querySelector('.addcancelCPButton')
                addcancelCPButton.addEventListener('click', function () {
                    let addClassroomForm = document.querySelector('.addClassroomForm')
                    let controlPanel = document.querySelector('.controlPanel')

                    addClassroomForm.style.display = 'none'
                    controlPanel.style.display = 'block'
                })
            })

            let exitCP = document.querySelector('.quitCP')
            exitCP.addEventListener('click', function () {
                let controlPanelExit = document.querySelector('.controlPanel')
                let popUp = document.querySelector('.popUp')
                controlPanelExit.style.display = 'none'
                popUp.style.display = 'none'
            })
        })

    }

    generateClassroomContent(classroom_name, id) {
        var base = this;

        let controlPanel = document.querySelector('.controlPanel')
        let getForm = document.querySelector('.classrooms')
        let div = document.createElement('div')
        div.className = 'rowForClassrooms'
        div.setAttribute('id', id)
        let titleClassrooms = document.createElement('h2')
        titleClassrooms.innerHTML = classroom_name
        let divForImg = document.createElement('div')
        divForImg.className = 'divForImg'
        let editClassroom = document.createElement('img')
        let deleteClassroom = document.createElement('img')

        editClassroom.src = 'photos/edit.png'
        deleteClassroom.src = 'photos/delete.png'

        divForImg.appendChild(editClassroom)
        divForImg.appendChild(deleteClassroom)
        div.appendChild(titleClassrooms)
        div.appendChild(divForImg)
        getForm.appendChild(div)

        editClassroom.addEventListener('click', function (event) {
            let parentElement = event.target.closest('.rowForClassrooms');
            let classroomID = parentElement.id;
            base.edit_SelectedClassroom = classroomID;

            let editClassroomForm = document.querySelector('.editClassroomFrom');
            controlPanel.style.display = 'none';
            editClassroomForm.style.display = 'block';
            base.fillEditClassroomFields();
        });

        deleteClassroom.addEventListener('click', function (event) {
            let popUpQuestion = document.querySelector('.popUpQuestion')
            let formQuestion = document.querySelector('.formQuestion')
            popUpQuestion.style.display = 'block'
            formQuestion.style.display = 'block'

            let parentElement = event.target.closest('.rowForClassrooms');
            let classroomID = parentElement.id;
            base.edit_SelectedClassroom = classroomID;

            let buttonYes = document.querySelector('.buttonYes')
            buttonYes.addEventListener('click', function () {

                const formData = {
                    id: base.edit_SelectedClassroom,
                    classroom_name: "",
                    chairRow: 0,
                    chairColumn: 0,
                };
                const formDataJSON = JSON.stringify(formData);
                fetch(`https://localhost:7058/api/Classroom/deleteClassroom`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                })
                    .then((response) => {
                        if (!response.ok) {
                            if (response.status == 400) {
                                throw new Error(`Uneti podaci su neispravni!`);
                            }
                            else {
                                throw new Error(`Network response was not ok ${response.status}`);
                            }
                        }
                        return response;
                    })
                    .then(() => {
                        alert("Uspesno ste izbrisali ucionicu");
                        formQuestion.style.display = 'none'
                        popUpQuestion.style.display = 'none'
                        window.location.reload();


                    })
                    .catch((error) => {
                        alert("Greska prilikom izmene!");
                        console.error(error);
                    });
            })

            let buttonNo = document.querySelector('.buttonNo')
            buttonNo.addEventListener('click', function () {
                let popUpQuestion = document.querySelector('.popUpQuestion')
                let formQuestion = document.querySelector('.formQuestion')

                popUpQuestion.style.display = 'none'
                formQuestion.style.display = 'none'
            })
        })
    }

    fillEditClassroomFields() {
        var base = this;
        base.classrooms.forEach(element => {
            if (element.id == base.edit_SelectedClassroom) {
                let edit_classroomName = document.querySelector('.edit_classroom_name')
                edit_classroomName.value = element.classroom_name;

                let edit_chairRow = document.querySelector('.edit_chairRow')
                let edit_chairColum = document.querySelector('.edit_chairColum')

                edit_chairRow.value = element.chairRow
                edit_chairColum.value = element.chairColumn

                let sendButton = document.querySelector('.editCtrlPanelButton')
                sendButton.removeEventListener('click', sendCPdatas)
                sendButton.addEventListener('click', sendCPdatas) 

                let cancelButtonCP = document.querySelector('.cancelCtrlPanelButton')
                cancelButtonCP.removeEventListener('click', cancelCP)
                cancelButtonCP.addEventListener('click', cancelCP)
            }
        });

        function sendCPdatas() {
            let edit_classroomName = document.querySelector('.edit_classroom_name')
            let edit_chairRow = document.querySelector('.edit_chairRow')
            let edit_chairColum = document.querySelector('.edit_chairColum')

            const formData = {
                id: base.edit_SelectedClassroom,
                classroom_name: edit_classroomName.value,
                chairRow: edit_chairRow.value,
                chairColumn: edit_chairColum.value,
            };
            const formDataJSON = JSON.stringify(formData);
            fetch(`https://localhost:7058/api/Classroom/updateClassroom`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include',
            })
                .then((response) => {
                    if (!response.ok) {
                        if (response.status == 400) {
                            throw new Error(`Uneti podaci su neispravni!`);
                        }
                        else {
                            throw new Error(`Network response was not ok ${response.status}`);
                        }
                    }
                    return response;
                })
                .then(() => {
                    alert("Uspesno izmenjeno!");
                    window.location.reload()
                })
                .catch((error) => {
                    alert("Greska prilikom izmene!");
                    console.error(error);
                });

            let editClassroomForm = document.querySelector('.editClassroomFrom')
            let controlPanel = document.querySelector('.controlPanel')
            editClassroomForm.style.display = 'none'
            controlPanel.style.display = 'block'
        }

        function cancelCP() {
            let editClassroomForm = document.querySelector('.editClassroomFrom')
            let controlPanel = document.querySelector('.controlPanel')

            editClassroomForm.style.display = 'none'
            controlPanel.style.display = 'block'
        }
    }

    logOut() {
        let buttonLogOut = document.querySelector('.logout')
        buttonLogOut.addEventListener('click', function () {
            fetch('https://localhost:7058/api/User/logout', {
                method: 'POST',
                credentials: 'include',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data.message);
                    window.location.href = 'login.html';
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        })
    }
}

const home = new Home();
home.loadClassrooms()
home.checkSession();

