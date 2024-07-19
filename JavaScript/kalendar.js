import { noteObject } from "./noteObject.js";

class Kalendar {
  constructor() {
    this.role = sessionStorage.getItem("role");
    this.loadRole();
    this.welcome();

    this.daysContainer = document.querySelector(".days");
    this.nextBtn = document.querySelector(".next-btn");
    this.prevBtn = document.querySelector(".prev-btn");
    this.month = document.querySelector(".month");
    this.todayBtn = document.querySelector(".today-btn");

    this.noteArray = [];
    this.noteDivArray = [];
    this.studies = "";
    this.noteID = 0;
    this.selectedNoteID = 0;
    this.clikedDay = "";
    this.currentMonth = "";
    this.currentYear = "";

    this.months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    this.days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    this.date = new Date();
    this.currentMonth = this.date.getMonth();
    this.currentYear = this.date.getFullYear();

    this.sveska = document.querySelector('.kalendar-container');
    this.trenutniDiv = null;

    this.dogadjaji = {};

    this.renderCalendar();
    this.downloadStudy();
    this.logOut()

    this.addEventListeners();
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

  loadRole() {
    if (this.role == 'Posetioc') {
      const element = document.querySelector(".plus");
      element.remove();
    }

  }

  renderCalendar() {
    this.date.setDate(1);
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth, 0);
    const lastDayIndex = lastDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const prevLastDayDate = prevLastDay.getDate();
    const nextDays = 7 - lastDayIndex - 1;

    if (this.month) {
      this.month.innerHTML = `${this.months[this.currentMonth]} ${this.currentYear}`;
    }

    let calendarDays = "";
    for (let x = firstDay.getDay(); x > 0; x--) {
      calendarDays += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
    }

    for (let i = 1; i <= lastDayDate; i++) {
      if (
        i === new Date().getDate() &&
        this.currentMonth === new Date().getMonth() &&
        this.currentYear === new Date().getFullYear()
      ) {
        calendarDays += `<div class="day today">${i}</div>`;
      } else {
        calendarDays += `<div class="day">${i}</div>`;
      }
    }

    for (let j = 1; j <= nextDays; j++) {
      calendarDays += `<div class="day next">${j}</div>`;
    }

    if (this.daysContainer) {
      this.daysContainer.innerHTML = calendarDays;
    }

    this.hideTodayBtn();
    this.addDayEventListeners();
  }

  addDayEventListeners() {
    var base = this;
    const dani = document.querySelectorAll(".day");
    dani.forEach(dan => {
      dan.addEventListener("click", (event) => {
        if (event.target.classList.contains('prev') || event.target.classList.contains('next')) {
          alert('Izabrani datum ne postoji');
        } else {
          this.clikedDay = event.target.innerText;

          if (this.trenutniDiv) {
            this.trenutniDiv.remove();
          }

          base.reloadNotes()
          this.sveska.style.display = 'block'
        }
      });
    });
  }

  pushDataFromBase(notes) {
    notes.forEach(el => {
      console.log(el.startTime);
      const startTime = el.startTime;
      const startDate = new Date(startTime);

      const endTime = el.endTime;
      const endDate = new Date(endTime);
      let obj = new noteObject(el.id, el.name, el.study, startDate.getHours(), startDate.getMinutes(), endDate.getHours(), endDate.getMinutes(), el.study);
      this.noteID++;
      this.noteArray.push(obj);

      this.addNote()
    });
  }

  addEventListeners() {
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.nextMonth());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.prevMonth());
    }

    if (this.todayBtn) {
      this.todayBtn.addEventListener("click", () => this.goToToday());
    }
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderCalendar();
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderCalendar();
  }

  goToToday() {
    this.currentMonth = this.date.getMonth();
    this.currentYear = this.date.getFullYear();
    this.renderCalendar();
  }

  hideTodayBtn() {
    if (
      this.currentMonth === new Date().getMonth() &&
      this.currentYear === new Date().getFullYear()
    ) {
      if (this.todayBtn) {
        this.todayBtn.style.display = "none";
      }
    } else {
      if (this.todayBtn) {
        this.todayBtn.style.display = "flex";
      }
    }
  }

  addNote() {
    deleteNote();

    while (this.noteDivArray.length > 0) {
      this.noteDivArray.pop();
      console.log("noteDivArray popped");
    }

    this.noteArray.forEach((noteObj) => {
      if (this.noteArray.length > 1) {
        this.addNoteElse(noteObj);
        this.noteArray.forEach(element => {

          if (noteObj.name != element.name) {
            if ((element.start_hour >= noteObj.start_hour && element.start_hour < noteObj.end_hour) ||
              (element.end_hour > noteObj.start_hour && element.end_hour <= noteObj.end_hour)) {
              this.noteDivArray.forEach((divElement) => {
                let id = divElement.getAttribute("id");
                if (id == element.id) {
                  divElement.style.removeProperty('left');
                  divElement.style.removeProperty('right');
                  divElement.style.removeProperty('width');
                  divElement.style.right = '46%';
                  divElement.style.width = '47.5%';
                }
                else if (id == noteObj.id) {
                  divElement.style.removeProperty('right');
                  divElement.style.removeProperty('left');
                  divElement.style.removeProperty('width');
                  divElement.style.left = '53.5%';
                  divElement.style.width = '46.7%';
                }
              })
            }
          }
        });
      }
      else {
        this.addNoteElse(noteObj);
      }
    })

    function deleteNote() {
      let a = document.querySelectorAll('.dogadjaj')
      a.forEach(dogadjaj => dogadjaj.remove());
    }
  }

  reloadNotes() {
    var base = this
    deleteNote()
    function deleteNote() {
      let a = document.querySelectorAll('.dogadjaj')
      a.forEach(dogadjaj => dogadjaj.remove());
    }

    while (base.noteDivArray.length > 0) {
      base.noteDivArray.pop();
      console.log("noteDivArray popped");
    }

    while (base.noteArray.length > 0) {
      base.noteArray.pop();
      console.log("noteDivArray popped");
    }

    fetchNotes(`${this.currentYear}-${this.currentMonth + 1}-${this.clikedDay}`);

    async function fetchNotes(startDate) {
      try {
        const response = await fetch(`https://localhost:7058/api/Note/getNotesByDate?startDate=${startDate}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const notes = await response.json();
        console.log(notes);
        base.pushDataFromBase(notes)
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
  }

  addNoteElse(noteObj) {
    var base = this;
    let vremeElementi = document.querySelectorAll('.vreme');
    vremeElementi.forEach(vreme => {
      let satiElement = vreme.querySelector('.sati');
      let eventsDiv = vreme.querySelector('.events')
      let intVreme = parseFloat(satiElement.textContent);

      if (intVreme >= noteObj.start_hour && intVreme <= noteObj.end_hour) {
        if (intVreme === Number(noteObj.start_hour)) {
          let divZaDogadjaj = document.createElement('div');
          divZaDogadjaj.classList.add('dogadjaj');
          let divNaslov = document.createElement('div');
          divNaslov.textContent = noteObj.name;
          divNaslov.classList.add('title');

          let divZaSati = document.createElement('div');
          divZaSati.textContent = `${noteObj.start_hour}  - ${noteObj.end_hour} h`;
          divZaSati.classList.add('sati');

          divZaDogadjaj.style.height = (noteObj.end_hour - noteObj.start_hour) * 50;
          divZaDogadjaj.setAttribute('id', noteObj.id);
          divZaDogadjaj.setAttribute('startHour', noteObj.start_hour);
          divZaDogadjaj.setAttribute('endHour', noteObj.end_hour)

          let div_left = document.createElement('div');
          div_left.className = "div_left"
          let div_right = document.createElement('div');
          div_right.className = "div_right"

          div_left.appendChild(divNaslov);
          div_right.appendChild(divZaSati);

          divZaDogadjaj.appendChild(div_left);
          divZaDogadjaj.appendChild(div_right);

          this.noteDivArray.push(divZaDogadjaj)

          eventsDiv.appendChild(divZaDogadjaj);

          divZaDogadjaj.addEventListener('click', function () {
            let divEditForm = document.querySelector('.editForm')
            let popUpEdit = document.querySelector('.popUp')
            divEditForm.style.display = 'block'
            popUpEdit.style.display = 'block'
            base.selectedNoteID = divZaDogadjaj.getAttribute("id")
            base.fillEditForm();
          })
        }
      }
    });
  }

  fillEditForm() {
    var base = this
    this.noteArray.forEach(note => {
      if (note.id == this.selectedNoteID) {
        let titleClasses = document.querySelector('.edit_class_name')
        titleClasses.value = note.name

        let studyName = document.querySelector('.edit_study_name')
        studyName.value = note.study

        let editStartTime = document.querySelector('.edit_start_Time')
        let paddedStartHour = note.start_hour.toString().padStart(2, '0');
        let paddedStartMinute = note.start_minute.toString().padStart(2, '0');

        editStartTime.value = `${paddedStartHour}:${paddedStartMinute}`

        let editEndTime = document.querySelector('.edit_end_Time')
        let paddedEndHour = note.end_hour.toString().padStart(2, '0');
        let paddedEndMinute = note.end_minute.toString().padStart(2, '0');
        editEndTime.value = `${paddedEndHour}:${paddedEndMinute}`

        let submitButton = document.querySelector('.editSubmitButton')
        submitButton.addEventListener('click', function () {
          let startDate = new Date();
          let startValue = editStartTime.value;
          let [hours, minutes] = startValue.split(':').map(Number);
          startDate.setFullYear(base.currentYear);
          startDate.setMonth(base.currentMonth);
          startDate.setDate(base.clikedDay);
          startDate.setHours(hours + 2);
          startDate.setMinutes(minutes);
          startDate.setSeconds(0);
          startDate.setMilliseconds(0);
          let isoEditStartTime = startDate.toISOString();

          let endDate_ = new Date();
          let endValue = String(editEndTime.value);
          let [hours_, minutes_] = endValue.split(':').map(Number);
          endDate_.setFullYear(base.currentYear);
          endDate_.setMonth(base.currentMonth);
          endDate_.setDate(base.clikedDay);
          endDate_.setHours(hours_ + 2);
          endDate_.setMinutes(minutes_);
          endDate_.setSeconds(0);
          endDate_.setMilliseconds(0);
          let isoEditEndTime = endDate_.toISOString();

          if ((titleClasses.value == "" || titleClasses.value == null) || (studyName.value == "" || studyName.value == null)
            || startDate == null || endDate_ == null) {
            alert("Molimo popunite sva polja");
          }
          else {
            const formData = {
              id: base.selectedNoteID,
              name: titleClasses.value,
              startTime: isoEditStartTime,
              endTime: isoEditEndTime,
              study: studyName.value,
            };
            fetch(`https://localhost:7058/api/Note/updateNote`, {
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
                base.reloadNotes();
                let closeForm = document.querySelector('.editForm')
                let closePopUp = document.querySelector('.popUp')
                closeForm.style.display = 'none'
                closePopUp.style.display = 'none'
              })
              .catch((error) => {
                alert("Greska!");
                console.error(error);
              });
          }
        })

        let deleteButton = document.querySelector('.editDeleteButton')
        deleteButton.addEventListener('click', function () {
          let popUpQuestion = document.querySelector('.popUpQuestion')
          let formQuestion = document.querySelector('.formQuestion')
          popUpQuestion.style.display = 'block'
          formQuestion.style.display = 'block'
        })

        let buttonYes = document.querySelector('.buttonYes')
        buttonYes.addEventListener('click', function () {
          let startDate = new Date();
          let startValue = editStartTime.value;
          let [hours, minutes] = startValue.split(':').map(Number);
          startDate.setFullYear(base.currentYear);
          startDate.setMonth(base.currentMonth);
          startDate.setDate(base.clikedDay);
          startDate.setHours(hours + 2);
          startDate.setMinutes(minutes);
          startDate.setSeconds(0);
          startDate.setMilliseconds(0);
          let isoEditStartTime = startDate.toISOString();

          let endDate_ = new Date();
          let endValue = String(editEndTime.value);
          let [hours_, minutes_] = endValue.split(':').map(Number);
          endDate_.setFullYear(base.currentYear);
          endDate_.setMonth(base.currentMonth);
          endDate_.setDate(base.clikedDay);
          endDate_.setHours(hours_ + 2);
          endDate_.setMinutes(minutes_);
          endDate_.setSeconds(0);
          endDate_.setMilliseconds(0);
          let isoEditEndTime = endDate_.toISOString();

          const formData = {
            id: base.selectedNoteID,
            name: titleClasses.value,
            startTime: isoEditStartTime,
            endTime: isoEditEndTime,
            study: studyName.value,
          };

          fetch(`https://localhost:7058/api/Note/deleteNote`, {
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
              base.reloadNotes();
            })
            .catch((error) => {
              console.error(error);
            });
          let editFormClosed = document.querySelector('.editForm')
          let editPopUp = document.querySelector('.popUp')
          let popUpQuestion = document.querySelector('.popUpQuestion')
          let formQuestion = document.querySelector('.formQuestion')

          editFormClosed.style.display = 'none'
          editPopUp.style.display = 'none'
          popUpQuestion.style.display = 'none'
          formQuestion.style.display = 'none'
        })

        let buttonNo = document.querySelector('.buttonNo')
        buttonNo.addEventListener('click', function () {
          let popUpQuestion = document.querySelector('.popUpQuestion')
          let formQuestion = document.querySelector('.formQuestion')
          popUpQuestion.style.display = 'none'
          formQuestion.style.display = 'none'
        })

        let editCancelButton = document.querySelector('.editCancelButton')
        editCancelButton.addEventListener('click', function () {
          let divZaFormu = document.querySelector('.addForm');
          let popUp = document.querySelector('.popUp');
          let containerCalendar = document.querySelector('.container');
          let calendarContainer = document.querySelector('.kalendar-container');
          let divForAmphi = document.querySelector('.amfiteatar');
          let amphiTitle = document.querySelector('.amfiteatar-title');
          divZaFormu.style.display = 'none';
          popUp.style.display = 'none';
          containerCalendar.style.filter = 'blur(0px)';
          calendarContainer.style.filter = 'blur(0px)';
          divForAmphi.style.filter = 'blur(0px)';
          amphiTitle.style.filter = 'blur(0px)';
        })
      }
    });
  }

  downloadStudy() {
    var base = this;
    fetchStudy();
    async function fetchStudy() {
      try {
        const response = await fetch(`https://localhost:7058/api/Study/api/getStudies`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        base.studies = await response.json();
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
      }
    }
  }

  bookAmphitheater() {
    var base = this;

    let dugmeplus = document.querySelector('.plus');
    let dugmeDelete = document.createElement('button');
    dugmeDelete.innerText = 'Izbrisi';
    dugmeDelete.style.marginTop = '20px';

    if (dugmeplus != null) {
      dugmeplus.removeEventListener('click', upadateDateDisplay)
      dugmeplus.addEventListener('click', upadateDateDisplay)

      function upadateDateDisplay() {
        let popUp = document.querySelector('.popUp');
        let divZaFormu = document.querySelector('.addForm');
        let divZaEditFormu = document.querySelector('.editForm');
        let containerCalendar = document.querySelector('.container');
        let calendarContainer = document.querySelector('.kalendar-container');
        let divForAmphi = document.querySelector('.amfiteatar');
        let amphiTitle = document.querySelector('.amfiteatar-title');

        popUp.appendChild(divZaFormu);
        popUp.style.display = 'block';
        divZaFormu.style.display = 'block';
        divZaEditFormu.style.display = 'none'
        containerCalendar.style.filter = 'blur(4px)';
        calendarContainer.style.filter = 'blur(4px)';
        divForAmphi.style.filter = 'blur(4px)';
        amphiTitle.style.filter = 'blur(4px)';

        let clickedTime = document.querySelector('.clickedDisplayDate');
        clickedTime.innerHTML = `Za ${base.clikedDay}.${base.currentMonth + 1}.${base.currentYear}`;

        dugmeDelete.addEventListener('click', function () {
          deleteNote();
          while (this.noteDivArray.length > 0) {
            this.noteDivArray.pop();
          }
        });

        let cancelButton = document.querySelector('.addCancelButton');
        cancelButton.removeEventListener('click', cancelHandler);
        cancelButton.addEventListener('click', cancelHandler);

        let addButton = document.querySelector('.addSendButton');
        addButton.removeEventListener('click', sendHandler);
        addButton.addEventListener('click', sendHandler);
      };
    }

    function cancelHandler() {
      let divZaFormu = document.querySelector('.addForm');
      let popUp = document.querySelector('.popUp');
      let containerCalendar = document.querySelector('.container');
      let calendarContainer = document.querySelector('.kalendar-container');
      let divForAmphi = document.querySelector('.amfiteatar');
      let amphiTitle = document.querySelector('.amfiteatar-title');

      divZaFormu.style.display = 'none';
      popUp.style.display = 'none';
      containerCalendar.style.filter = 'blur(0px)';
      calendarContainer.style.filter = 'blur(0px)';
      divForAmphi.style.filter = 'blur(0px)';
      amphiTitle.style.filter = 'blur(0px)';

      let inputText = document.querySelector('.class_name');
      let inputStudy = document.querySelector('.study_name');
      let inputForStart = document.querySelector('.start_Time');
      let inputForEnd = document.querySelector('.end_Time');

      inputText.value = "";
      inputStudy.value = "";
      inputForStart.value = "";
      inputForEnd.value = "";
    }

    function sendHandler() {
      let inputText = document.querySelector('.class_name');
      let inputStudy = document.querySelector('.study_name');
      let inputForStart = document.querySelector('.start_Time');
      let inputForEnd = document.querySelector('.end_Time');

      let vrednostVremena = inputForStart.value;
      let [start_hour, start_minute] = vrednostVremena.split(':');

      let vrednostVremenaa = inputForEnd.value;
      let [end_hour, end_minute] = vrednostVremenaa.split(':');

      let obj = new noteObject(base.noteID, inputText.value, inputStudy.value, start_hour, start_minute, end_hour, end_minute);
      base.noteID++;
      base.noteArray.push(obj);

      let startDate = new Date();
      let startValue = inputForStart.value;
      let [hours, minutes] = startValue.split(':').map(Number);
      startDate.setFullYear(base.currentYear);
      startDate.setMonth(base.currentMonth);
      startDate.setDate(base.clikedDay);
      startDate.setHours(hours + 2);
      startDate.setMinutes(minutes);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      let isoStartTime = startDate.toISOString();

      let endDate_ = new Date();
      let endValue = String(inputForEnd.value);
      let [hours_, minutes_] = endValue.split(':').map(Number);
      endDate_.setFullYear(base.currentYear);
      endDate_.setMonth(base.currentMonth);
      endDate_.setDate(base.clikedDay);
      endDate_.setHours(hours_ + 2);
      endDate_.setMinutes(minutes_);
      endDate_.setSeconds(0);
      endDate_.setMilliseconds(0);

      let isoEndTime = endDate_.toISOString();

      if ((inputText.value == "" || inputText.value == null) || (inputStudy.value == "" || inputStudy.value == null)
        || startDate == null || endDate_ == null) {
        alert("Molimo popunite sva polja");
      }
      else {
        base.addNote();
        const formData = {
          name: inputText.value,
          startTime: isoStartTime,
          endTime: isoEndTime,
          study: inputStudy.value,
        };

        fetch('https://localhost:7058/api/Note/api/addNote', {
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
            alert("Dogadjaj uspesno dodat")
            let popUp = document.querySelector('.popUp')
            let addForm = document.querySelector('.addForm')
            addForm.style.display = 'none'
            popUp.style.display = 'none'

            let containerCalendar = document.querySelector('.container');
            let calendarContainer = document.querySelector('.kalendar-container');
            let divForAmphi = document.querySelector('.amfiteatar');
            let amphiTitle = document.querySelector('.amfiteatar-title');

            containerCalendar.style.filter = 'blur(0px)';
            calendarContainer.style.filter = 'blur(0px)';
            divForAmphi.style.filter = 'blur(0px)';
            amphiTitle.style.filter = 'blur(0px)';
            cancelHandler();
          })
          .catch((error) => {
            alert(error);
            console.error(error);
          });
      }

    }
    //drawAmphitheater();

    //UNFINISHED - TO BE ADDED
    function drawAmphitheater() {
      let divAmfiteatar = document.querySelector('.amfiteatar')
      divAmfiteatar.innerHTML = ''
      for (let i = 0; i < 153; i++) {
        let divZaStolice = document.createElement('div')
        divZaStolice.className = 'sedište'
        divZaStolice.dataset.index = i;

        divZaStolice.addEventListener('click', (event) => {
          let clickedIndex = event.target.dataset.index;
          console.log(`Kliknuli ste na stolicu sa indeksom: ${clickedIndex}`);

          event.target.classList.toggle('softversko');
        });

        divAmfiteatar.appendChild(divZaStolice)
      }
    }
    let title = localStorage.getItem('classroom_name');
    let titleElement = document.querySelector('.amfiteatar-title');

    if (title) {
      titleElement.textContent = title;
    } else {
      titleElement.textContent = "Default Title";
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
          window.location.href = 'login.html';
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    })
  }
}

const kalendar = new Kalendar();
kalendar.bookAmphitheater()