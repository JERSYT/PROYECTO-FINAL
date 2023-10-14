const mockNotes = [];
const noteContainer = document.getElementById('note-container');
const createNoteButton = document.getElementById('create-note');

function createNote() {
  const title = document.getElementById('note-title').value;
  const text = document.getElementById('note-text').value;
  const color = document.getElementById('note-color').value;
  const imageInput = document.getElementById('note-image');
  const image = imageInput.files[0];
  const datetimeString = document.getElementById('note-datetime').value;
  const creationDatetime = new Date();

  if (!title || !text) {
    alert('Por favor, ingresa un título y contenido para la nota.');
    return;
  }

  // Convertir la fecha y hora ingresada a un objeto de fecha en la zona horaria local
  const datetime = datetimeString ? new Date(`${datetimeString}Z`) : null;

  const note = {
    id: Date.now(),
    title,
    text,
    color,
    image,
    datetime,
    creationDatetime
  };

  displayNote(note);

  document.getElementById('note-title').value = '';
  document.getElementById('note-text').value = '';
  document.getElementById('note-datetime').value = '';

  // Limpiar la imagen cargada para la siguiente nota
  imageInput.value = null;

  // Llamar a la función para programar notificación
  if (note.datetime) {
    scheduleNotification(note);
  }
}

function displayNote(note) {
  const formattedCreationDatetime = note.creationDatetime.toLocaleString('es-CO', { timeZone: 'America/Bogota' });

  const noteDiv = document.createElement('div');
  noteDiv.classList.add('note');
  noteDiv.id = `note-${note.id}`;
  noteDiv.style.backgroundColor = note.color;

  const noteContent = `
    <h2 id="note-title-${note.id}">${note.title}</h2>
    <p id="note-text-${note.id}">${note.text}</p>
    <label for="datetime-picker-${note.id}">Editar fecha y hora del recordatorio:</label>
    <input type="datetime-local" id="datetime-picker-${note.id}" value="${note.datetime ? note.datetime.toISOString().slice(0, 16) : ''}" onchange="editNoteDatetime(${note.id})">
    <p>Fecha y hora de creación: ${formattedCreationDatetime}</p>
    <button class="edit-button" onclick="editNote(${note.id})">Editar</button>
    <button class="delete-button" onclick="deleteNote(${note.id})">Eliminar</button>
  `;

  noteDiv.innerHTML = noteContent;

  if (note.image) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(note.image);
    img.alt = 'Imagen de la nota';
    noteDiv.appendChild(img);
  }

  noteContainer.insertBefore(noteDiv, noteContainer.firstChild);

  // Llamar a la función para programar notificación
  if (note.datetime) {
    scheduleNotification(note);
  }
}

function scheduleNotification(note) {
  const now = new Date();
  const timeDifference = note.datetime - now;

  if (timeDifference > 0) {
    setTimeout(() => {
      showNotification(note);
    }, timeDifference);
  } else {
    // Si la fecha y hora son anteriores a la actual, mostrar la notificación de inmediato
    showNotification(note);
  }
}

function showNotification(note) {
  const notificationTitle = '¡Es hora de tu nota!';
  const notificationOptions = {
    body: `Recuerda tu nota: ${note.title}\n${note.text}`,
    icon: 'path/to/your/icon.png'
  };

  // Pedir permisos para mostrar notificaciones
  Notification.requestPermission().then(function(permission) {
    if (permission === 'granted') {
      const notification = new Notification(notificationTitle, notificationOptions);
    }
  });
}

function editNoteDatetime(id) {
  const datetimePicker = document.getElementById(`datetime-picker-${id}`);
  const newDatetimeString = datetimePicker.value;

  const note = {
    id,
    datetime: new Date(newDatetimeString),
  };

  if (note.datetime) {
    // Cancelar cualquier notificación previamente programada para esta nota
    cancelScheduledNotification(id);

    // Programar una nueva notificación
    scheduleNotification(note);
  }
}

function cancelScheduledNotification(id) {
  // Cancelar la notificación previamente programada para esta nota
  // (Implementa la lógica necesaria para cancelar notificaciones si es necesario)
  // Aquí deberías tener la lógica para cancelar notificaciones, dependiendo de tu implementación.
  // Si no necesitas cancelar notificaciones, puedes dejar esta función vacía.
  // Por ejemplo, podrías almacenar los IDs de las notificaciones y luego cancelarlas según sea necesario.
  // Aquí un ejemplo simplificado:
  // notificationId es el identificador único de la notificación, deberías almacenarlo cuando se programa la notificación.
  // const notificationId = 'unique_notification_id_for_note_' + id;
  // window.clearTimeout(notificationId);
}

function editNote(id) {
  const newTitle = prompt('Editar título:', document.getElementById(`note-title-${id}`).textContent);
  const newText = prompt('Editar contenido:', document.getElementById(`note-text-${id}`).textContent);

  if (newTitle !== null && newText !== null) {
    const titleElement = document.getElementById(`note-title-${id}`);
    const textElement = document.getElementById(`note-text-${id}`);

    titleElement.textContent = newTitle;
    textElement.textContent = newText;
  }
}

function deleteNote(id) {
  const noteDiv = document.getElementById(`note-${id}`);
  noteDiv.remove();
}

createNoteButton.addEventListener('click', createNote);
