const room = document.getElementsByClassName("table")
const reservedTables = []

const checkReserved = () => {
  for (var i = 0 ; i < room.length; i++){
    room[i].onclick = function(){
      if (
        this.classList.contains('table') 
      ) {
        this.classList.toggle('selected');
        reservedTables.push(this.id)
      }
    }
  }
}

checkReserved()

function handleReserve () {
  const date = document.getElementById('date').value
  const tables = reservedTables
  fetch("http://localhost:3000/table-room",
  {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify({
      date: date,
      tables: tables.toString()
    })
})
.then(function(res){console.log(res.body)})
.catch(function(res){console.log(res.body)})
}

