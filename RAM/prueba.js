// Obtener referencia al elemento de la tabla en HTML
const tableBody = document.getElementById('table-body');

// Array para almacenar los objetos de los personajes con segunda imagen
const characterList = [];

// Palabras reservadas a filtrar
const reservedWords = ['alien', 'big','Aqua','cop','mechanie','Mr','Mrs.', 'Jr.'];

// Función para verificar si una palabra contiene alguna palabra reservada
function containsReservedWord(word) {
  const lowercasedWord = word.toLowerCase();
  return reservedWords.some(reservedWord => {
    if (lowercasedWord.includes(reservedWord)) {
      // Verificar si la palabra reservada está seguida de otra palabra
      const nextWordIndex = lowercasedWord.indexOf(reservedWord) + reservedWord.length;
      const nextWord = lowercasedWord.substring(nextWordIndex).trim();
      return !nextWord; // Ignorar la palabra reservada si hay una palabra siguiente
    }
    return false;
  });
}

// Función para obtener los personajes y agregarlos a la lista
function getCharacters(page) {
  fetch(`https://rickandmortyapi.com/api/character/?page=${page}`)
    .then(response => response.json())
    .then(data => {
      // Filtrar los resultados de la API para evitar personajes cuyo nombre contenga palabras reservadas
      const filteredResults = data.results.filter(character => !containsReservedWord(character.name));

      // Iterar sobre los resultados filtrados
      filteredResults.forEach(character => {
        // Crear una celda para la segunda imagen del personaje
        const image2Cell = document.createElement('td');
        // Extraer la parte de texto del nombre hasta que se encuentre un espacio
        const nameParts = character.name.split(' ');
        const firstName = nameParts[0];
        const secondName = nameParts[1];

        // Realizar la solicitud a la misma API para obtener el personaje correspondiente a la segunda imagen
        fetch(`https://rickandmortyapi.com/api/character/?name=${firstName}`)
          .then(response => response.json())
          .then(data => {
            if (data.results.length > 0) {
              const secondCharacter = data.results.find(result => result.image !== character.image);
              if (secondCharacter) {
                // Crear un objeto para el personaje y agregarlo a la lista
                const characterObj = {
                  name: character.name,
                  status: character.status,
                  species: character.species,
                  image1: character.image,
                  image2: secondCharacter.image
                };
                characterList.push(characterObj);
              }
            } else {
              // Si no se encuentra el personaje correspondiente a la primera imagen, realizar otra solicitud con el segundo nombre
              fetch(`https://rickandmortyapi.com/api/character/?name=${secondName}`)
                .then(response => response.json())
                .then(data => {
                  if (data.results.length > 0) {
                    const secondCharacter = data.results.find(result => result.image !== character.image);
                    if (secondCharacter) {
                      // Crear un objeto para el personaje y agregarlo a la lista
                      const characterObj = {
                        name: character.name,
                        status: character.status,
                        species: character.species,
                        image1: character.image,
                        image2: secondCharacter.image
                      };
                      characterList.push(characterObj);
                    }
                  }
                })
                .catch(error => console.log(error));
            }
          })
          .catch(error => console.log(error));
      });

      // Verificar si hay más páginas disponibles
      if (data.info.next) {
        // Obtener el número de la siguiente página
        const nextPage = new URL(data.info.next).searchParams.get('page');
        // Llamar a la función recursivamente para obtener los personajes de la siguiente página
        getCharacters(nextPage);
      } else {
        // Cuando se obtengan todos los personajes, insertar aleatoriamente 10 en el HTML
        insertRandomCharacters();
      }
    })
    .catch(error => console.log(error));
}

// Función para insertar aleatoriamente 10 personajes en el HTML
function insertRandomCharacters() {
  // Obtener una copia de la lista de personajes
  const randomCharacterList = [...characterList];

  // Mezclar aleatoriamente la lista
  for (let i = randomCharacterList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [randomCharacterList[i], randomCharacterList[j]] = [randomCharacterList[j], randomCharacterList[i]];
  }

  // Insertar solo los primeros 10 personajes en el HTML
  randomCharacterList.slice(0, 10).forEach(character => {
    // Crear una nueva fila en la tabla
    const row = document.createElement('tr');

    // Crear una celda para el nombre del personaje
    const nameCell = document.createElement('td');
    nameCell.textContent = character.name;
    row.appendChild(nameCell);

    // Crear una celda para las características del personaje
    const statusCell = document.createElement('td');
    statusCell.textContent = `${character.status} - ${character.species}`;
    row.appendChild(statusCell);

    // Crear una celda para la primera imagen del personaje
    const image1Cell = document.createElement('td');
    const image1 = document.createElement('img');
    image1.src = character.image1;
    image1.alt = character.name;
    image1Cell.appendChild(image1);
    row.appendChild(image1Cell);

    // Crear una celda para la segunda imagen del personaje
    const image2Cell = document.createElement('td');
    if (character.image2) {
      const image2 = document.createElement('img');
      image2.src = character.image2;
      image2.alt = character.name;
      image2Cell.appendChild(image2);
    }
    row.appendChild(image2Cell);

    // Agregar la fila a la tabla
    tableBody.appendChild(row);
  });

  console.log('Lista de personajes con segunda imagen:', randomCharacterList.slice(0, 10));
}

// Iniciar la obtención de personajes comenzando desde la página 1
getCharacters(1);