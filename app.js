// Получаем ссылки на форму и таблицу
const addForm = document.getElementById('addForm');
const recordTable = document.getElementById('recordTable');

// Функция для добавления записи в таблицу
function addRecord(name, age, email) {
  // Создаем новую строку таблицы
  const row = document.createElement('tr');
  // Добавляем ячейки с данными
  row.innerHTML = `
    <td>${name}</td>
    <td>${age}</td>
    <td>${faculty}</td>
    <td>${course}</td>
    <td>${group}</td>
    <td>
      <button class="edit">Редактировать</button>
      <button class="delete">Удалить</button>
    </td>
  `;
  // Добавляем строку в таблицу
  recordTable.appendChild(row);
}

// Обработчик отправки формы
addForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  // Получаем данные из формы
  const formData = new FormData(addForm);
  const name = formData.get('name');
  const age = formData.get('age');
  const faculty = formData.get('faculty');
  const course = formData.get('course');
  const group = formData.get('group');

  // Отправляем запрос на сервер для добавления записи
  const response = await fetch('/api/records', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, age, faculty, course, group})
  });

  if (response.ok) {
    // Если запрос успешный, добавляем запись в таблицу
    const data = await response.json();
    addRecord(data.name, data.age, data.email);
    addForm.reset();
  } else {
    // Выводим сообщение об ошибке
    const errorMessage = await response.text();
    alert(`Error: ${errorMessage}`);
  }
});

// Обработчик клика на кнопку удаления записи
recordTable.addEventListener('click', async (event) => {
  if (event.target.classList.contains('delete')) {
    const row = event.target.closest('tr');
    const name = row.querySelector('td:first-child').textContent;

    // Отправляем запрос на сервер для удаления записи
    const response = await fetch(`/api/records/${name}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // Если запрос успешный, удаляем запись из таблицы
      row.remove();
    } else {
      // Выводим сообщение об ошибке
      const errorMessage = await response.text();
      alert(`Error: ${errorMessage}`);
    }
  }
});

// Обработчик клика на кнопку редактирования записи
recordTable.addEventListener('click', async (event) => {
  if (event.target.classList.contains('edit')) {
    const row = event.target.closest('tr');
    const name = row.querySelector('td:first-child').textContent;
    const age = row.querySelector('td:nth-child(2)').textContent;
    const faculty = row.querySelector('td:nth-child(3)').textContent;
    const course = row.querySelector('td:nth-child(4)').textContent;
    const group = row.querySelector('td:nth-child(5)').textContent;

    // Создаем форму для редактирования записи
    const editForm = document.createElement('form');
    editForm.innerHTML = `
      <h2>Edit record</h2>
      <label>
        ФИО:
        <input type="text" name="name" value="${name}" required>
      </label>
      <label>
        Возраст:
        <input type="text" name="age    " value="${age}" required>
        </label>
        <label>
          Факультет:
          <input type="text" name="faculty" value="${faculty}" required>
        </label>
        <label>
          Курс:
          <input type="text" name="course" value="${course}" required>
        </label>
        <label>
          Группа:
          <input type="text" name="group" value="${group}" required>
        </label>
        <button>Сохранить</button>
        <button type="button" class="cancel">Отмена</button>
      `;
      // Заменяем строку таблицы на форму
      row.replaceWith(editForm);
      
      // Обработчик отправки формы редактирования записи
      editForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        // Получаем данные из формы
        const formData = new FormData(editForm);
        const newName = formData.get('name');
        const newAge = formData.get('age');
        const newFaculty = formData.get('faculty');
        const newCourse = formData.get('course');
        const newGroup = formData.get('group');
        
      
        // Отправляем запрос на сервер для обновления записи
        const response = await fetch(`/api/records/${name}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newName, age: newAge, faculty: newFaculty, course: newCourse, group: newGroup})
        });
      
        if (response.ok) {
          // Если запрос успешный, заменяем форму на строку таблицы с обновленными данными
          const data = await response.json();
          const newRow = document.createElement('tr');
          newRow.innerHTML = `
            <td>${data.name}</td>
            <td>${data.age}</td>
            <td>${data.faculty}</td>
            <td>${data.course}</td>
            <td>${data.group}</td>
            <td>
              <button class="edit">Редактировать</button>
              <button class="delete">Удалить</button>
            </td>
          `;
          editForm.replaceWith(newRow);
        } else {
          // Выводим сообщение об ошибке
          const errorMessage = await response.text();
          alert(`Error: ${errorMessage}`);
        }
      });
      
      // Обработчик клика на кнопку отмены редактирования записи
      editForm.addEventListener('click', (event) => {
        if (event.target.classList.contains('cancel')) {
          // Если нажата кнопка отмены, заменяем форму на строку таблицы без изменений
          const newRow = document.createElement('tr');
          newRow.innerHTML = row.innerHTML;
          editForm.replaceWith(newRow);
        }
      });
    }
});

// Функция для загрузки всех записей из базы данных и добавления их в таблицу
async function loadRecords() {
const response = await fetch('/api/records');
const data = await response.json();
data.forEach(record => addRecord(record.name, record.age, record.email));
}

// Загружаем записи при загрузке страницы
loadRecords();
