const mockNotes = [];
const noteContainer = document.getElementById('note-container');
const createNoteButton = document.getElementById('create-note');
let originalNotesOrder = [];

function createNote() {
  const title = document.getElementById('note-title').value;
  const text = document.getElementById('note-text').value;
  const color = document.getElementById('note-color').value;
  const imageInput = document.getElementById('note-image');
  const images = Array.from(imageInput.files);  // Convertir a un array
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
    images,
    datetime,
    creationDatetime
  };

  mockNotes.push(note);  // Agregar la nota a la lista de notas

  displayNoteInContainer(note);

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

function displayNoteInContainer(note) {
  const formattedCreationDatetime = note.creationDatetime.toLocaleString('es-CO', { timeZone: 'America/Bogota' });

  const noteDiv = document.createElement('div');
  noteDiv.classList.add('note');
  noteDiv.id = `note-${note.id}`;
  noteDiv.style.backgroundColor = note.color;

  const titleElement = document.createElement('h2');
  titleElement.id = `note-title-${note.id}`;
  titleElement.textContent = note.title;
  titleElement.style.wordWrap = 'break-word';  // Añadido para que el texto se ajuste

  const textElement = document.createElement('p');
  textElement.id = `note-text-${note.id}`;
  textElement.textContent = note.text;
  textElement.style.wordWrap = 'break-word';  // Añadido para que el texto se ajuste

  const datetimeLabel = document.createElement('label');
  datetimeLabel.setAttribute('for', `datetime-picker-${note.id}`);
  datetimeLabel.textContent = 'Editar fecha y hora del recordatorio:';

  const datetimePicker = document.createElement('input');
  datetimePicker.setAttribute('type', 'datetime-local');
  datetimePicker.id = `datetime-picker-${note.id}`;
  datetimePicker.value = note.datetime ? note.datetime.toISOString().slice(0, 16) : '';
  datetimePicker.addEventListener('change', () => editNoteDatetime(note.id));

  const datetimePara = document.createElement('p');
  datetimePara.textContent = `Fecha y hora de creación: ${formattedCreationDatetime}`;

  const editButton = document.createElement('button');
  editButton.classList.add('edit-button');
  editButton.textContent = 'Editar';
  editButton.addEventListener('click', () => editNote(note.id));

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete-button');
  deleteButton.textContent = 'Eliminar';
  deleteButton.addEventListener('click', () => deleteNote(note.id));

  const imageContainer = document.createElement('div');
  imageContainer.id = `note-image-container-${note.id}`;

  // Icono para agregar imagen
  const addImageIcon = document.createElement('i');
  addImageIcon.classList.add('fa', 'fa-images');
  addImageIcon.addEventListener('click', () => openImageFileDialog(note.id));

  const colorPickerIcon = document.createElement('i');
  colorPickerIcon.classList.add('fa', 'fa-paint-brush');
  colorPickerIcon.addEventListener('click', () => openColorPicker(note.id));

  const colorPicker = document.createElement('input');
  colorPicker.setAttribute('type', 'color');
  colorPicker.id = `color-picker-${note.id}`;
  colorPicker.style.display = 'none';
  colorPicker.addEventListener('input', () => changeNoteColor(note.id, colorPicker.value));

  const actionButtons = document.createElement('div');
  actionButtons.classList.add('action-buttons');
  actionButtons.appendChild(addImageIcon);
  actionButtons.appendChild(colorPickerIcon);
  actionButtons.appendChild(colorPicker);

  noteDiv.appendChild(titleElement);
  noteDiv.appendChild(textElement);
  noteDiv.appendChild(datetimeLabel);
  noteDiv.appendChild(datetimePicker);
  noteDiv.appendChild(datetimePara);
  noteDiv.appendChild(editButton);
  noteDiv.appendChild(deleteButton);
  noteDiv.appendChild(imageContainer);
  noteDiv.appendChild(actionButtons);

  note.images.forEach((image, index) => {
    const imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(image);
    imgElement.alt = 'Imagen de la nota';
    imgElement.style.maxWidth = '100px';  // Establecer un ancho máximo para las imágenes
    imgElement.style.margin = '5px';  // Espaciado entre las imágenes

    const deleteImageIcon = document.createElement('span');
    deleteImageIcon.classList.add('delete-image-icon');
    deleteImageIcon.innerHTML = '&times;'; // Icono "x"

    // Utiliza una función de flecha para capturar el índice correcto
    deleteImageIcon.addEventListener('click', () => deleteImage(note.id, imgElement));

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');
    imageWrapper.appendChild(imgElement);
    imageWrapper.appendChild(deleteImageIcon);

    imageContainer.appendChild(imageWrapper);
  });

  noteContainer.insertBefore(noteDiv, noteContainer.firstChild);

  // Llamar a la función para programar notificación
  if (note.datetime) {
    scheduleNotification(note);
  }
}

function deleteNote(id) {
  const noteDiv = document.getElementById(`note-${id}`);
  noteDiv.remove();

  // Eliminar la nota de la lista de mockNotes
  const index = mockNotes.findIndex(note => note.id === id);
  if (index !== -1) {
    mockNotes.splice(index, 1);
  }
}

function searchNotes() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();

  const notesToDisplay = mockNotes.filter(note => {
    const title = note.title.toLowerCase();
    const text = note.text.toLowerCase();
    return title.includes(searchTerm) || text.includes(searchTerm);
  });

  // Limpiar el contenedor antes de mostrar las notas filtradas
  noteContainer.innerHTML = '';

  notesToDisplay.forEach(note => {
    displayNoteInContainer(note);
  });
}

function openImageFileDialog(noteId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.multiple = true;
  input.addEventListener('change', (event) => handleImageFileSelect(event, noteId));
  input.click();
}

function handleImageFileSelect(event, noteId) {
  const images = Array.from(event.target.files);

  images.forEach((image) => {
    const imgElement = document.createElement('img');
    imgElement.src = URL.createObjectURL(image);
    imgElement.alt = 'Imagen de la nota';
    imgElement.style.maxWidth = '100px';  // Establecer un ancho máximo para las imágenes
    imgElement.style.margin = '5px';  // Espaciado entre las imágenes

    const deleteImageIcon = document.createElement('span');
    deleteImageIcon.classList.add('delete-image-icon');
    deleteImageIcon.innerHTML = '&times;'; // Icono "x"

    // Utiliza una función de flecha para capturar el índice correcto
    deleteImageIcon.addEventListener('click', () => deleteImageIconClicked(event, noteId, imgElement));

    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('image-wrapper');
    imageWrapper.appendChild(imgElement);
    imageWrapper.appendChild(deleteImageIcon);

    const imageContainer = document.getElementById(`note-image-container-${noteId}`);
    imageContainer.appendChild(imageWrapper);
  });
}

function deleteImageIconClicked(event, noteId, imageElement) {
  event.stopPropagation();  // Detiene la propagación del evento para evitar que se active el evento deleteImage

  deleteImage(noteId, imageElement);
}

function deleteImage(noteId, imageElement) {
  const imageContainer = document.getElementById(`note-image-container-${noteId}`);
  imageContainer.removeChild(imageElement.parentElement);  // Elimina el contenedor de la imagen
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
  const noteTitleElement = document.getElementById(`note-title-${note.id}`);
  const noteTextElement = document.getElementById(`note-text-${note.id}`);

  const notificationTitle = noteTitleElement ? noteTitleElement.textContent : '¡Es hora de tu nota!';
  const notificationContent = noteTextElement ? noteTextElement.textContent : '';

  const notificationOptions = {
    body: `Título: ${notificationTitle}\nContenido: ${notificationContent}`,
    icon: '../imagenes/logo.png'
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
  // Implementa la lógica necesaria para cancelar notificaciones si es necesario
  // Aquí deberías tener la lógica para cancelar notificaciones, dependiendo de tu implementación.
  // Si no necesitas cancelar notificaciones, puedes dejar esta función vacía.
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

function openColorPicker(noteId) {
  const colorPicker = document.getElementById(`color-picker-${noteId}`);
  colorPicker.click();
}

function changeNoteColor(id, color) {
  const noteDiv = document.getElementById(`note-${id}`);
  noteDiv.style.backgroundColor = color;
}

createNoteButton.addEventListener('click', createNote);
