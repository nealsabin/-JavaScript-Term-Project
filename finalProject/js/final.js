// document.getElementById("create").addEventListener("click",function(){
//     var width=screen.width;
//     var height=screen.height;
//     var availWidth=screen.availWidth;
//     var availHeight=screen.availHeight;
//     var depth=screen.colorDepth;
//     var pixel=screen.pixelDepth;

//     myWindow = window.open("","myWindow","width=400, height=600,menubar=1,scrollbars=1,resizable=1");
//     myWindow.document.write("<h1>Site Overview and Copyright</h1>" +

//     "<p>The games on this site are copyrighted and cannot be<br>"+
//     "distributed without permission from the author.</p>"

//     );  
// });
    

// Get the modal
var modal = document.getElementById('myModal');

// Get the button that opens the modal
var btn = document.getElementById("create");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
