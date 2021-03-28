window.onload=function(){
  fetch('/markdown/system.md')
  .then(response => response.text())
  .then((data) => {
    // based on https://gist.github.com/paulirish/1343518
    document.getElementById('main-content').innerHTML = data;
    (function(){
      [].forEach.call( document.querySelectorAll('[data-markdown]'), function fn(elem){
        elem.innerHTML = (new showdown.Converter()).makeHtml(elem.innerHTML);
      });
    }());
    })
}

var el = document.getElementsByClassName('get-content')
for (const property in el) {
  el[property].onclick = loadContent;
}

function loadContent(param) {
  console.log(param.target.id);
  console.log(param.target.className);
  const file = '/markdown/' + param.target.id + '.md';
  fetch(file)
  .then(response => response.text())
  .then((data) => {
    document.getElementById('main-content').innerHTML = data;
    (function(){
      [].forEach.call( document.querySelectorAll('[data-markdown]'), function fn(elem){
        elem.innerHTML = (new showdown.Converter()).makeHtml(elem.innerHTML);
      });
    }());
  })
}

(function() {
  // get all elements with class 'more'
  let expandableElem = document.querySelectorAll('.list-more');
  
  // loop through each expandable element, adding click listener
  expandableElem.forEach(li => {
    li.addEventListener(
      'click',
      function() {
        this.classList.toggle('open')
      },
      false
    )
  });
})();