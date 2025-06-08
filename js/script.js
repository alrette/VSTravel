const accordions = document.querySelectorAll(".accordion-contact");

accordions.forEach((btn) => {
    btn.addEventListener("click", function () {
    this.classList.toggle("active");

    const panel = this.nextElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
    });
});


const particlesContainer = document.getElementById('particles-container');
const particleCount = 80;

// Generate background particles
for (let i = 0; i < particleCount; i++) {
    createFloatingParticle();
}

// Create floating particles
function createFloatingParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 3 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particlesContainer.appendChild(particle);
    animateFloatingParticle(particle);
}

function animateFloatingParticle(particle) {
    const pos = resetParticle(particle);

    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 5;

    setTimeout(() => {
        particle.style.transition = `all ${duration}s linear`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;

        const moveX = pos.x + (Math.random() * 20 - 10);
        const moveY = pos.y - Math.random() * 30;

        particle.style.left = `${moveX}%`;
        particle.style.top = `${moveY}%`;

        setTimeout(() => {
            animateFloatingParticle(particle);
        }, duration * 1000);
    }, delay * 1000);
}

function resetParticle(particle) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    particle.style.left = `${x}%`;
    particle.style.top = `${y}%`;
    particle.style.opacity = '0';

    return { x, y };
}

// Mouse movement particles
document.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX / window.innerWidth) * 100;
    const mouseY = (e.clientY / window.innerHeight) * 100;

    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 4 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${mouseX}%`;
    particle.style.top = `${mouseY}%`;
    particle.style.opacity = '0.6';

    particlesContainer.appendChild(particle);

    setTimeout(() => {
        particle.style.transition = 'all 2s ease-out';
        particle.style.left = `${mouseX + (Math.random() * 10 - 5)}%`;
        particle.style.top = `${mouseY + (Math.random() * 10 - 5)}%`;
        particle.style.opacity = '0';

        setTimeout(() => {
            particle.remove();
        }, 2000);
    }, 10);
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const fullName = form.querySelector('input[type="text"]');
    const phone = form.querySelector('input[type="tel"]');
    const email = form.querySelector('input[type="email"]');
    const dateInputs = form.querySelectorAll('input[type="date"]');
    const counters = form.querySelectorAll(".counter-group");
    const submitBtn = form.querySelector(".submit-btn");

    // 1. Handle plus/minus buttons
    counters.forEach(group => {
        const span = group.querySelector("span:nth-child(3)");
        const minus = group.querySelector("button:nth-of-type(1)"); // minus button pilih yang type 1 karena button 1 itu minus
        const plus = group.querySelector("button:nth-of-type(2)"); // plus button pilih yang type 2 karena button 2 itu plus

        // kalau misalnya dia diatas 0, bisa di minus
        // karena min 0, jadi kita kasih batasan 0
        minus.addEventListener("click", () => {
            let value = parseInt(span.textContent);
            if (value > 0) span.textContent = value - 1;
        });
        
        // kalau misalnya dia di bawah 5, bisa di plus
        // karena max 5, jadi kita kasih batasan 5
        plus.addEventListener("click", () => {
            let value = parseInt(span.textContent);
            if (value < 5) span.textContent = value + 1;
        });
    });
    
    // 2. Fibe (5) kinds of Validation utilities
    // a. Validate name kalau dia pas di trim, panjangnya lebih dari 0 maka akan valid
    function validateName(name) {
        return name.trim().length > 0;
    }
    // b. Validate phone number, harus angka semua dan panjangnya lebih dari 10
    // kalau dia kosong atau bukan angka dan >10 , return false
    function validatePhoneNumber(phone) {
        if (phone.trim() === "") return false;
        for (let ch of phone) {
        if (ch < '0' || ch > '9') return false;
        }
        return phone.length >= 10;
    }

    // c. Validate email, harus ada @ dan . dan panjangnya lebih dari 5
    // kalau dia kosong atau tidak ada @ dan . dan <5 , return false
    // kalau dia ada @ dan . dan panjangnya lebih dari 5, return true
    // just like email validation in general dimana ada @ dan . 
    function validateEmail(email) {
        return email.includes("@") && email.includes(".") && email.length > 5;
    }

    // d. Validate participants, harus ada minimal 1 orang yang dipilih diantara 3 kategori
    // Harus ada satu adult juga
    // kalau dia kosong, return false
    function validateParticipants() {
        let total = 0;
        let adultCount = 0;
    
        counters.forEach(group => {
            const count = parseInt(group.querySelector("span:nth-child(3)").textContent);
            total += count;
    
            if (group.querySelector("span").textContent === "Adult") {
                adultCount = count;
            }
        });
    
        return total > 0 && adultCount >= 1;  // Check that total participants > 0 and at least 1 adult
    }
    
    // e. Validate dates, harus ada tanggal yang valid dari 2 kondisi
    // 1. Departure date tidak boleh lebih dari return date
    // 2. Departure date tidak boleh lebih dari tanggal hari ini
    // jadi kita kasih batasan kalo misalnya tanggal depature itu ga boleh lebih dari tanggal return
    function validateDates(depDate, retDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dep = new Date(depDate);
        const ret = new Date(retDate);
        // jadi tanggalnya departure gabisa dari masa lalu, move on dong masa stuck di masa lalu xixixi
        if(dep<today){
            alert("Departure date cannot be in the past.");
            return false;
        }   
        // kalau ini kan misalnya kita mau pergi ke Bali, terus kita mau balik lagi ke Jakarta, 
        // ya ga mungkin kita balik lagi ke Jakarta setelah kita pergi ke Bali kan? xixixi
        // jadi kita kasih batasan kalo misalnya tanggal depature itu ga boleh lebih dari tanggal return
        if(dep>ret){
            alert("Departure date cannot be after return date.");
            return false;
        }
        // Return false if either date is empty
        // jangan sampe kosong kaya hati kita xixixi
        if (depDate.trim() === "" || retDate.trim() === "") {
            return false; 
        }
        return true
    }

    function markInput(input, isValid) {
        if (isValid) {
            input.style.border="2px solid green";
        } else {
            input.style.border="2px solid red";
        }
    }

    // 3. On form submit
    submitBtn.addEventListener("click", function (e) {
      e.preventDefault(); // stop actual submission
        
        const depDate = dateInputs[0].value;
        const retDate = dateInputs[1].value;

        const isNameValid = validateName(fullName.value);
        const isPhoneValid = validatePhoneNumber(phone.value);
        const isEmailValid = validateEmail(email.value);
        const isParticipantsValid = validateParticipants();
        const isDatesValid = validateDates(depDate, retDate);

        markInput(fullName, isNameValid);
        markInput(phone, isPhoneValid);
        markInput(email, isEmailValid);
        markInput(dateInputs[0], isDatesValid);
        markInput(dateInputs[1], isDatesValid);

        if (!isNameValid, !isPhoneValid, !isEmailValid, !isDatesValid) {
        alert("Please fix the data in the red box correctly.");
        }

        if (!isParticipantsValid) {
        alert("Please select at least 1 adult amongst the participant.");
        }

        if (isNameValid && isPhoneValid && isEmailValid && isParticipantsValid && isDatesValid) {
        alert("Form submitted successfully!");
        // Optionally: form.submit(); 
        }
    });
});


























