class Login {
  constructor() {
    this.sendData()
    this.validation()
  }

  swapForm() {
    let signUpButton = document.querySelector('.buttonSignUp');
    let loginInButton = document.querySelector('.buttonLogin');
    let container = document.querySelector('.container');
    let overlayContainer = document.querySelector('.overlay-container')

    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
      overlayContainer.classList.add("right-panel-active");
    });

    loginInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
      overlayContainer.classList.add("right-panel-active");
    });
  }

  sendData() {
    let inputName = document.querySelector('input[name = "name"]')
    let inputLastName = document.querySelector('input[name = "last-name"]')
    let inputRole = document.querySelector('select[name = "rolls"]')
    let inputEmail = document.querySelector('input[name = "emailSignup"]')
    let inputPassword = document.querySelector('input[name = "passwordSignup"]')

    let buttonSignUpForm = document.querySelector('.buttonSignUpForm')
    buttonSignUpForm.addEventListener('click', function () {
      let valueName = inputName.value.trim()
      let valueLastName = inputLastName.value.trim()
      let valueRola = inputRole.value
      let valueEmail = inputEmail.value.trim()
      let valuePassword = inputPassword.value.trim()

      if (!valueName || !valueLastName || !valueEmail || !valuePassword) {
        alert('Sva polja su obavezna.');
        return;
      }

      if (!valueRola || valueRola === "Izaberi rolu") {
        alert('Niste izabrali rolu');
        return;
      }

      if (!valueRola) {
        alert('Niste izabrali rolu');
        return;
      }

      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(valueEmail)) {
        alert('Neispravna email adresa');
        return;
      }

      const datas = {
        name: valueName,
        last_name: valueLastName,
        email: valueEmail,
        password: valuePassword,
        role: valueRola
      }

      fetch('https://localhost:7058/api/User/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datas),
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
          window.location = 'home.html'
        })
        .catch((error) => {
          alert(error);
          console.error(error);
        });
    })
  }

  validation() {
    const emailLogin = document.querySelector('input[name="emailLogin"]');
    const passwordLogin = document.querySelector('input[name="passwordLogin"]');

    let buttonLoginForm = document.querySelector('.buttonsLogInForm');
    buttonLoginForm.addEventListener('click', function () {
      const emailLoginValue = emailLogin.value;
      const passwordLoginValue = passwordLogin.value;

      const dataLogin = {
        id: 0,
        name: "",
        last_name: "",
        email: emailLoginValue,
        password: passwordLoginValue,
        role: ""
      };

      fetch('https://localhost:7058/api/User/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataLogin),
        credentials: 'include',
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 400) {
              throw new Error('Uneti podaci su neispravni!');
            } else if (response.status === 401) {
              throw new Error('Neispravna email adresa ili lozinka');
            } else {
              throw new Error(`Network response was not ok ${response.status}`);
            }
          }
          return response.text().then(text => text ? JSON.parse(text) : {});
        })
        .then((data) => {
          console.log('Ulogovan i sesija je kreirana');
          console.log(`Ulogovan korisnik: ${data.userName}`);

          sessionStorage.setItem('userName', data.userName);
          sessionStorage.setItem('role', data.role);
          window.location = "home.html";
        })
        .catch((error) => {
          alert(error);
          console.error('Error during login:', error);
        });
    });
  }
}

let login = new Login()
login.swapForm()