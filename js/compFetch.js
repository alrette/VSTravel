document.addEventListener("DOMContentLoaded", function (){
    fetch("componentHTML/footer.html")
        // convert dari html cuman ke textnya aja bukan dalam html
        // karena kita mau ambil textnya doang
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch(error => console.error('Error loading navbar:', error));
})


fetch('componentHTML/navbar.html')
    .then(res => res.text())
    .then(data =>{
        document.getElementById('navbar-container').innerHTML = data;

        const currentPage = location.pathname.split('/').pop();
        
        document.querySelectorAll('.nav-links a').forEach(link =>{
            if(link.dataset.page === currentPage){
                link.classList.add('nav-selected');
            }
        });

        const burger = document.getElementById('burger');
        const navAuthContainer = document.getElementById('navAuthContainer');

        burger.addEventListener('click', () => {
        navAuthContainer.classList.toggle('show');
        });
    });




