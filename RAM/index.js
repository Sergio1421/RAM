// Obtener referencia a la tabla HTML
const tableBody = document.getElementById('table-body');

// Nombres de los personajes que vamos a buscar
let characterNames =  ['Rick Sanchez', 'Morty Smith', 'Beth Smith', 'Summer Smith', 'Jerry Smith', 'Tammy Guetermann', 'Cronenberg Rick', 'Plutonian Hostess', 'Traflorkian Journalist', 'Wasp Rick'];

// Implementación del algoritmo de mezcla Fisher-Yates para ordenar aleatoriamente el array
for (let i = characterNames.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1)); // Generar un índice aleatorio
  [characterNames[i], characterNames[j]] = [characterNames[j], characterNames[i]]; // Intercambiar elementos
}

// Función para obtener la información del personaje principal de la API
const getCharacterInfo = name => fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name)}`)
  .then(response => response.json())
  .then(data => data.results[0]); 

// Función para obtener la información del "alter ego" del personaje de la API
const getAlternateCharacterInfo = name => fetch(`https://rickandmortyapi.com/api/character/?name=${encodeURIComponent(name.split(' ')[0])}`)
  .then(response => response.json())
  .then(data => data.results.find(character => character.name !== name)); 

// Para cada nombre de personaje, obtener la información del personaje principal y del "alter ego"
Promise.all(characterNames.map(name => Promise.all([getCharacterInfo(name), getAlternateCharacterInfo(name)])))
  .then(characterData => {
    characterData.forEach(([character, alternateCharacter]) => {
      // Crear una nueva fila en la tabla
      const row = document.createElement('tr');

      // Crear una celda para el nombre del personaje y agregarla a la fila
      const nameCell = document.createElement('td');
      nameCell.textContent = character.name;
      row.appendChild(nameCell);

      // Crear una celda para las características del personaje y agregarla a la fila
      const statusCell = document.createElement('td');
      statusCell.textContent = `${character.status} - ${character.species}`;
      row.appendChild(statusCell);

      // Crear una celda para la primera imagen del personaje y agregarla a la fila
      const image1Cell = document.createElement('td');
      const image1 = document.createElement('img');
      image1.src = character.image;
      image1.alt = character.name;
      image1Cell.appendChild(image1);
      row.appendChild(image1Cell);

      // Crear una celda para la segunda imagen del personaje y agregarla a la fila
      const image2Cell = document.createElement('td');
      const image2 = document.createElement('img');
      
      // Si encontramos un "alter ego", usar su imagen
      // Si no, usar la misma imagen que para el personaje principal
      if (alternateCharacter) {
        image2.src = alternateCharacter.image;
        image2.alt = alternateCharacter.name;
      } else {
        image2.src = character.image;
        image2.alt = character.name;
      }
      
      // Agregar la imagen a la celda y la celda a la fila
      image2Cell.appendChild(image2);
      row.appendChild(image2Cell);

      // Agregar la fila a la tabla
      tableBody.appendChild(row);
    });
  })
  .catch(error => console.log(error)); // Manejo de errores
