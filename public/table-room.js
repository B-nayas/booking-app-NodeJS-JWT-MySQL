const room = document.getElementsByClassName("table")
 for (var i = 0 ; i < room.length; i++){
    room[i].onclick = function(){
      if (
        this.classList.contains('table') 
      ) {
        this.classList.toggle('selected');
      }
    }
  }

