var thought=document.getElementById('thought');
fetch("https://type.fit/api/quotes")
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
   var random = data[Math.floor(Math.random() * data.length)];
    console.log(random.text);
    thought.innerHTML=random.text;
  });