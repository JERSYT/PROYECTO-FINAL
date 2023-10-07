function toggleNavbar() {
    var navbarLinks = document.getElementById("navbarLinks");
    if (navbarLinks.style.display === "flex") {
      navbarLinks.style.display = "none";
    } else {
      navbarLinks.style.display = "flex";
    }
  }


  

document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
  
    // Validación de nombre de usuario
    const usernameRegex = /^[a-zA-Z0-9-_]{1,20}$/;
    if (!username.match(usernameRegex)) {
      alert('Nombre de usuario inválido. Solo letras, números, guiones o barras bajas.');
      return;
    }
  
    // Validación de correo electrónico
    if (!validateEmail(email)) {
      alert('Correo electrónico inválido.');
      return;
    }
  
    // Validación de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[-_,.;@?¿])[A-Za-z0-9-_.,;@?¿]{10,20}$/;
    if (!password.match(passwordRegex)) {
      alert('Contraseña inválida. Debe contener al menos una mayúscula, una minúscula, un dígito y un caracter especial.');
      return;
    }
  
    // Verificar que las contraseñas coincidan
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
  
    // Si todo está validado, podrías enviar el formulario aquí
    alert('Formulario enviado con éxito!');
  });
  
  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return email.match(emailRegex);
  }

  