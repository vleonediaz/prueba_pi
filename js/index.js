document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("venta").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "venta.html"
    });
});