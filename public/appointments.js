const tableBody = document.querySelector("#appointmentsTable tbody");

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1;
  const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  return `${day}-${month}-${year}`;
}

function populateTable(data) {
  tableBody.innerHTML = "";
  data.forEach((appointment) => {
    const row = document.createElement("tr");
    const date = document.createElement("td");
    const tableId = document.createElement("td");
    const capacity = document.createElement("td");

    date.textContent = formatDate(appointment.fecha);
    tableId.textContent = appointment.id;
    capacity.textContent = appointment.capacidad;

    row.appendChild(date);
    row.appendChild(tableId);
    row.appendChild(capacity);

    tableBody.appendChild(row);
  });
}

function loadReserves() {
  const xhr = new XMLHttpRequest();

  xhr.onload = function () {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      populateTable(data);
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
