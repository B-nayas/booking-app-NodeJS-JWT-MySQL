const tableBody = document.querySelector("#appointmentsTable tbody");

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
  const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  return `${day}-${month}-${year}`;
}

function reserveTable(data) {
  // Ordenar los datos por fecha ascendente
  data.sort(function(a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
  });
  tableBody.innerHTML = "";
  data.forEach((appointment) => {
    const row = document.createElement("tr");
    const date = document.createElement("td");
    date.classList.add("align-middle");
    const tableId = document.createElement("td");
    tableId.classList.add("align-middle");
    const capacity = document.createElement("td");
    capacity.classList.add("align-middle");
    const action = document.createElement("td");
    action.classList.add("align-middle");

    date.textContent = formatDate(appointment.fecha);
    tableId.textContent = appointment.id;
    capacity.textContent = appointment.capacidad;

    // Crear el botón y agregarlo en la nueva columna
    const cancelButton = document.createElement("button");
    cancelButton.classList.add("btn");
    cancelButton.classList.add("btn-danger");
    cancelButton.textContent = "Cancelar reserva";
    cancelButton.addEventListener("click", function() {
      data = data.filter(function(item) {
        return item.id !== appointment.id;
      });      
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        if (xhr.status === 200) {
          // Eliminar la fila de la tabla
          row.remove();
        } else {
          console.log("Error al cancelar la reserva: " + xhr.status);
        }
      };
      xhr.open("POST", "/cancelReserve", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({ reservaId: appointment.id }));
    });
    

    action.appendChild(cancelButton);
    row.appendChild(date);
    row.appendChild(tableId);
    row.appendChild(capacity);
    row.appendChild(action);

    tableBody.appendChild(row);
  });
}

function loadReserves() {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      reserveTable(data);
    } else {
      console.log("Error al obtener las reservas: " + xhr.status);
    }
  };

  xhr.open("POST", "/listReserveUser", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
}

document.addEventListener("DOMContentLoaded", function () {
  loadReserves();
});
