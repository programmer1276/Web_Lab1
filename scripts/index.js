let statusOfValidation = '';

function validateY() {
  let y = getY(); // удаляем лишние пробелы по бокам
  
  // Проверяем, что y не пустое и не состоит только из пробелов
  if (y === '') {
    statusOfValidation = 'Пожалуйста, введите значение Y (оно должно быть числом с плавающей точкой и не должно содержать пробелов!!!!!)';
    return false;
  }
  
  // Проверяем, что y — это число
  const yNum = parseFloat(y);
  if (!isNaN(yNum)) {
    if (yNum > -3 && yNum < 3) {
      return true;
    } else {
      statusOfValidation = 'Y не попало в интервал (-3, 3)!!!';
      return false;
    }
  } else {
    statusOfValidation = 'Пожалуйста, введите значение Y (оно должно быть числом с плавающей точкой!)';
    return false;
  }
}



const buttons = document.querySelectorAll('.r-button');
let selectedButton = null;

buttons.forEach(button => {
button.addEventListener('click', function() {
  // Сброс предыдущей активной кнопки, если она есть
  if (selectedButton) {
    selectedButton.classList.remove('active');
  }

  // Установка текущей кнопки как активной
  this.classList.add('active');
  selectedButton = this;
});
});


function validateR() {
const allowedValues = ["1", "1.5", "2", "2.5", "3"]
if (selectedButton === null) {
  // Если ни одна кнопка не выбрана, выводим сообщение об ошибке
  statusOfValidation = 'Пожалуйста, выберите значение для R.';
  /*validationMessage.style.color = 'red';*/
  return false;
}
if (!allowedValues.includes(selectedButton.value)) {
  statusOfValidation = "Невалидное значение value в html коде(в области кнопки button для R)";
  return false;
}
else {
  // Если кнопка выбрана, убираем сообщение об ошибке
  /*validationMessage.style.color = 'green';*/
  return true;
}
}


function validateAll() {
  if (validateY() === false || validateR() === false) {
    return false;
  } else{
    return true;
  }
}


function getX(){
  return document.getElementById('x-coord-input').value;
}

function getY(){
  return document.getElementById('y-coord-input').value.trim().replace(',', '.');
}

function getR() {
  if (selectedButton) {
      return selectedButton.value;  // Возвращаем значение кнопки
  }
  return null;  // Если ничего не выбрано, возвращаем null
}


/*let statusOfValidation = '';*/
const validationMessage = document.querySelector('.js-validation-message');

document.getElementById('js-submit-button').addEventListener('click', function(event){
  event.preventDefault(); /*-----------------*/
  if (validateAll()) {
    statusOfValidation = 'Валидация пройдена успешно';
    validationMessage.classList.add('validation-successed');
    validationMessage.classList.remove('validation-failed');
    validationMessage.innerHTML = statusOfValidation;
    validationMessage.style.color = 'green';

    fetch(`/fcgi-bin/server.jar?x=${getX()}&y=${getY()}&r=${getR()}`, {
      method: 'GET'
    })

    .then(response => {
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
      return response.text();
    })
  
    .then(function (answer) {

      let resultParse = JSON.parse(answer);

      if (resultParse.error === "not"){
      
      document.getElementById('js-logs-from-server').innerHTML = '';
      
      var tableBody = document.getElementById("response-table").getElementsByTagName("tbody")[0];
      const newRow = tableBody.insertRow();
      const isHit = newRow.insertCell(0);
      const X = newRow.insertCell(1); 
      const Y = newRow.insertCell(2); 
      const R = newRow.insertCell(3); 
      const currentTime = newRow.insertCell(4); 
      const workTime = newRow.insertCell(5);
      
      
      if(resultParse.result === "true"){
        isHit.innerHTML = "Есть попадание";
      } else {
        isHit.innerHTML = "Промах";
      }

      
      X.innerHTML = resultParse.x;
      Y.innerHTML = resultParse.y;
      R.innerHTML = resultParse.r;
      currentTime.innerHTML = resultParse.currTime;
      workTime.innerHTML = resultParse.scrTime;
    } else if(resultParse.error === "empty"){
      document.getElementById('js-logs-from-server').innerHTML = 'Есть пустые поля!';
    } else if(resultParse.error === "wrong method"){
      document.getElementById('js-logs-from-server').innerHTML = 'Необходимо использовать GET запрос!';
    } else if(resultParse.error === 'not valid data'){
      document.getElementById('js-logs-from-server').innerHTML = 'Невалидные данные!';
    }
  })
    


  } else{
    /*statusOfValidation = 'Валидация не пройдена';*/
    validationMessage.classList.add('validation-failed');
    validationMessage.classList.remove('validation-successed');
    validationMessage.innerHTML = statusOfValidation;
    validationMessage.style.color = 'red';
  }

})