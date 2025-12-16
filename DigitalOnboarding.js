const errorURL = 'https://rsmedical.com/register-error';
class Visit { //tracks attempts at entering serial
  #attempts;
  constructor() {
    this.#attempts = 0;
  }
  getAttempts() {
    return this.#attempts;
  }
  addAttempt() {
    this.#attempts += 1;
  }
}
async function postToAzure(request, azureFunction){
  try{
    console.log('sending');
    const response = await fetch(azureFunction,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });
    if(!response){
      throw new Error('No response');
    } else if(!response.ok){
      const errorMessage = await response.json();
      throw new Error(`Server responded with ${response.status} \n ${JSON.stringify(errorMessage)} `);
    } else{
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error('Submission failed:', error);
    window.location.href= errorURL;
    return null;
  }

}

async function getFromAzure(azureFunction){
  try {
    console.log('sending');
    const response = await fetch(azureFunction,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if(!response){
      throw new Error('No response');
    }
    else if(!response.ok){
      const errorMessage = await response.json();
      throw new Error(`Server responded with ${response.status} \n ${JSON.stringify(errorMessage)} `);
    } else{
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.error("Submission failed:", error);
    return null;
  }
}
let spinnerTimeout;
function toggleSpinner(startOrStop){
  const spinnerOverlay = document.getElementById("spinner_overlay");
  spinnerOverlay.style.display = startOrStop == true ? 'flex' : 'none';
  const submitButton = document.getElementById('submit_button');
  submitButton.disabled = startOrStop;
  clearTimeout(spinnerTimeout);
  if (startOrStop) {
    spinnerTimeout = setTimeout(() => {
      if(getStyle('spinner_overlay', 'display') === 'flex'){
        console.log('Request timed out');
        window.location.href = errorURL;
      }
    }, 40000);
  }
}
function showError(element, message){ //make sure every page you use this on has a required_fields_error block
  let errorBlock = element.querySelector('.error-message');
  if (!errorBlock) {
    errorBlock = document.createElement('div');
    errorBlock.className = 'error-message';
    element.insertBefore(errorBlock, element.firstChild);
  }
  errorBlock.textContent = message;
  errorBlock.style.display = 'block';
  element.querySelector('input, select')?.classList.add('invalid');
  document.getElementById('required_fields_error').style.display = 'block';
}
function clearError(element){//don't clear required fields error here because other elements may still be invalid
  let errorBlock = element.querySelector('.error-message');
  if(errorBlock){
    errorBlock.textContent = '';
    errorBlock.style.display = 'none';
  }
  element.querySelector('input, select')?.classList.remove('invalid');
}
function validatePage(page){//don't use on product page
    let pageValid = true;
    const elements = Array.from(page.querySelectorAll('.form-element')).filter(element => 
      element.querySelector('.required')
    );
    elements.forEach(element => {
        let valid = true;
        let message = 'This is a required field';
        const input = element.querySelector('input, select');
        //check for error
        if(input.type === 'checkbox'){
            valid = Array.from(element.querySelectorAll('input[type="checkbox"]')).some(checkbox => checkbox.checked);
        } else if (input.type === 'radio'){
            valid = element.querySelector('input[type="radio"]:checked');
        } else if(input){
            valid = input.value ? true : false;
            if(valid){
              if(input.type === 'date'){
                const min = new Date(1700, 1, 1);
                const max = new Date(4000, 12, 31);
                const inputDate = new Date(input.value);
                if(inputDate <= min || inputDate >= max){
                  valid = false;
                  message = 'Invalid date';
                }
              } else if(input.id === 'email'){
                const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
                valid = emailRegex.test(input.value.toLowerCase());
                message = 'Invalid email';
              } else if(input.id === 'serial_number'){
                if (!serialNumber.startsWith("PIN")){
                  valid = false;
                  message = "Serial numbers start with PIN";
                } else if (!/^\d{9}$/.test(serialNumber.substring(3))) {
                  valid = false;
                  message = "Incorrect length for serial number – Please try again";
                }
              }
            }
        }
        //show/clear error from page
        if(valid){
            clearError(element);
        } else {
            showError(element, message);
            pageValid = false;
        }
    });
    if(pageValid){
      document.getElementById('required_fields_error').style.display = 'none';
    }
    return pageValid;
}
function getStyle(el,styleProp){
    var x = document.getElementById(el);
    if (x.currentStyle)
      var y = x.currentStyle[styleProp];
    else if (window.getComputedStyle)
      var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
    return y;
}
function openModal(content) {
  document.getElementById('outside_modal').style.display = 'block';
  document.getElementById('modal_content').innerHTML = content;

  // Wait for content to render, then center modal
  const modal = document.getElementById('modal_window');
  setTimeout(() => {
      modal.style.left = (window.innerWidth / 2 - modal.offsetWidth / 2) + 'px';
      modal.style.top = (window.innerHeight / 2 - modal.offsetHeight / 2) + 'px';
  }, 0);
}

function closeModal() {
    document.getElementById('outside_modal').style.display = 'none';
    document.getElementById('modal_content').innerHTML = '';
}
// Draggable functionality
let isDragging = false;
let offsetX, offsetY;
const popup = document.getElementById('modal_window');
function movePopup(e) {
  if (isDragging) {
    popup.style.left = (e.clientX - offsetX) + 'px';
    popup.style.top = (e.clientY - offsetY) + 'px';
  }
}
function stopDragging() {
  isDragging = false;
  document.removeEventListener('mousemove', movePopup);
  document.removeEventListener('mouseup', stopDragging);
}
if (popup){
popup.addEventListener('mousedown', function(e) {
  console.log('Dragging');
  isDragging = true;
  offsetX = e.clientX - popup.offsetLeft;
  offsetY = e.clientY - popup.offsetTop;

  // Attach move and up listeners to document
  document.addEventListener('mousemove', movePopup);
  document.addEventListener('mouseup', stopDragging);
});
}
//close modal if outside of modal is clicked
window.onclick = function(event) {
    if (event.target === document.getElementById('outside_modal')) {
        closeModal();
    }
};

