document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Validate the form fields
    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value.trim();
  
    if (username === '' || password === '') {
      alert('Por favor, complete todos los campos.');
      return;
    }
  
    // If all fields are filled, you can proceed with form submission
    // Replace this with your form submission logic, e.g., making an AJAX request
    alert('Iniciar sesión: ' + username);
  });
  