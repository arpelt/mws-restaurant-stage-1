
window.addEventListener('keydown', keyboardTab);

function keyboardTab(event) {
  if (event.key === 'Tab') {
    document.body.classList.add('tabulator-active');
    window.addEventListener('click', mouseClick);
  }
  function mouseClick() {
    document.body.classList.remove('tabulator-active');
    window.removeEventListener('click', mouseClick);
    window.addEventListener('keydown', keyboardTab);
  }
}
