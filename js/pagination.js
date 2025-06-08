const totalPages = 15; // change this for testing
let currentPage = 1;

const pageButtonsContainer = document.getElementById("page-buttons");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

function renderPagination() {
    pageButtonsContainer.innerHTML = "";

    const pages = getPagination(currentPage, totalPages);

    pages.forEach(p => {
        const btn = document.createElement("button");

        if (p === "..."){
            btn.textContent = "...";
            btn.disabled = true;
            btn.classList.add("dots");
        }else{
        btn.textContent = p;
        if (p === currentPage) btn.classList.add("active");

        btn.addEventListener("click", () => {
            currentPage = p;
            renderPagination();

        });
        }

        pageButtonsContainer.appendChild(btn);
    });
}

    function getPagination(current, total) {
    const delta = 1; //atur kalau mau seberapa banyak yang mau ditunjukkin, makin gede makin banyak
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= total; i++) {
        if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
        }
    }
    // 1 4 5 6 7 8 25, curr = 6
    for (let i of range) {
        if (l) {
        if (i - l === 2) {
            rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
            rangeWithDots.push("...");
        }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
    }

    prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderPagination();
    }
    });

    nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderPagination();
    }
    });

    renderPagination();