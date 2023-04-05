  const tables = Array.from(document.querySelectorAll(".table"));
  const selectedTableIds = []; // Array para almacenar los IDs de las mesas seleccionadas


  
    // Seleccionar las mesas al hacer clic en ellas
    tables.forEach(table => {
      table.addEventListener('click', event => {
        const img = event.target.closest('img'); // Obtener la imagen dentro del div
        if (img) {
          const tableId = img.closest('.table').getAttribute('id'); // Obtener el ID de la mesa seleccionada
          if (selectedTableIds.includes(tableId)) {
            selectedTableIds.splice(selectedTableIds.indexOf(tableId), 1); // Quitar el ID de la mesa seleccionada del array
          } else {
            selectedTableIds.push(tableId); // Añadir el ID de la mesa seleccionada al array
          }
          img.closest('.table').classList.toggle("selected"); // Marcar la mesa como seleccionada en la interfaz
          console.log(selectedTableIds); // Agregar un console.log para verificar el contenido de selectedTableIds
        }
      });
    });
  

  // Método para guardar las reservas pasándolas mediante POST al backend
  function handleReserve() {
    const date = document.getElementById("date").value;
    const tableIds = selectedTableIds; // Obtener los IDs de las mesas reservadas
    console.log(date, tableIds);
      // Validar que se hayan seleccionado mesas antes de hacer la reserva
    if (tableIds.length === 0) {
      alert("Debe seleccionar al menos una mesa para hacer la reserva.");
      return;
    }
    fetch('/table-room', {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        date: date,
        tableIds: tableIds, // Enviar los IDs de las mesas reservadas
      }),
    })
      .then(function (res) {
        console.log(res.body);
      })
      .catch(function (res) {
        console.log(res.body);
      }, function(error) {
        console.log(error);
      });
    // window.location.href = "/appointments";
  }

  // Método para la fecha. Obtenemos el select, el día actual y definimos la cantidad de días a añadir
  const select = document.getElementById("date");
  const today = new Date();
  const daysToAdd = 14;

  // Iterar 14 días y agregarlos como opciones en el select
  for (let i = 0; i < daysToAdd; i++) {
    const dateToAdd = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    const option = document.createElement("option");
    const day = ('0' + dateToAdd.getDate()).slice(-2);
    const month = ('0' + (dateToAdd.getMonth() + 1)).slice(-2);
    const year = dateToAdd.getFullYear();
    option.value = `${day}/${month}/${year}`;
    option.textContent = `${day}/${month}/${year}`;
    select.appendChild(option);
  }


// Método para obtener las mesas ocupadas de la fecha seleccionada
function getOccupiedTables() {
  const date = document.getElementById("date").value;
  const images = document.querySelectorAll(".table img");
  const tableIds = Array.from(images).map(img => parseInt(img.closest('.table').getAttribute('id')));
  console.log("tableIds:", tableIds); // agregar para depurar
  fetch("/get-occupied-tables", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      date: date,
      tableIds: tableIds.filter(id => !isNaN(id)),
    }),
  })
  .then(function (res) {
    return res.json();
  })
  .then(function (occupiedTables) {
    console.log("occupiedTables:", occupiedTables);
    tables.forEach((table) => {
      const tableId = parseInt(table.id);
      console.log("tableId:", tableId);
      const occupiedTable = occupiedTables.find((occupiedTable) => {
        console.log("occupiedTable:", occupiedTable);
        return occupiedTable && occupiedTable.id === tableId;
      });
      console.log("occupiedTable:", occupiedTable);
      if (occupiedTable) {
        table.classList.add("busy");
      } else {
        table.classList.remove("busy");
      } 
    });
  })  
  .catch(function (res) {
    console.log(res.body);
  }, function(error) {
    console.log(error);
  });
}



  
  // Llamar al método para obtener las mesas ocupadas al cargar la página
  getOccupiedTables();
  
  // Agregar el evento "change" al select de fecha para obtener las mesas ocupadas al cambiar la fecha
  select.addEventListener("change", () => {
  getOccupiedTables();
  });

