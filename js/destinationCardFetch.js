let destinations = [];
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('cards-container');

    if (container) {
        container.innerHTML = '<p class="text-center text-gray-500">Loading destinations...</p>';
    }

    function renderDestinationDetails() {
        const urlParams = new URLSearchParams(window.location.search);
        const title = urlParams.get('title');
        const detailsContainer = document.getElementById('destination-details-container');

        // Only proceed if we are on the details page (identified by the container and URL parameter)
        if (title && detailsContainer) {
            // Find the specific destination from the now-loaded 'destinations' array
            const dest = destinations.find(d => d.title === decodeURIComponent(title));

            if (dest) {
                // Fetch the HTML template for the details view
                fetch('componentHTML/destinationDetails.html')
                    .then(res => {
                        if (!res.ok) throw new Error(`Failed to fetch details template: ${res.status}`);
                        return res.text();
                    })
                    .then(html => {
                        // Replace placeholders in the template with actual data
                        const detailsHTML = html
                            .replace(/{{title}}/g, dest.title)
                            .replace(/{{description}}/g, dest.description)
                            .replace(/{{heroImage1}}/g, dest.heroImage1)
                            .replace(/{{heroImage2}}/g, dest.heroImage2)
                            .replace(/{{heroImage3}}/g, dest.heroImage3)
                            .replace(/{{highlightImage1}}/g, dest.highlightImage1)
                            .replace(/{{highlightImage2}}/g, dest.highlightImage2)
                            .replace(/{{highlightImage3}}/g, dest.highlightImage3)
                            .replace(/{{packageIcon1}}/g, dest.packageIcon1)
                            .replace(/{{packageText1}}/g, dest.packageText1)
                            .replace(/{{packageIcon2}}/g, dest.packageIcon2)
                            .replace(/{{packageText2}}/g, dest.packageText2)
                            .replace(/{{packageIcon3}}/g, dest.packageIcon3)
                            .replace(/{{packageText3}}/g, dest.packageText3)
                            .replace(/{{packageIcon4}}/g, dest.packageIcon4)
                            .replace(/{{packageText4}}/g, dest.packageText4)
                            .replace(/{{bookNowUrl}}/g, dest.bookNowUrl);
                        
                        detailsContainer.innerHTML = detailsHTML;
                    })
                    .catch(error => {
                        console.error('Error loading destination details template:', error.message);
                        detailsContainer.innerHTML = '<p class="text-center text-red-500">Error loading details. Please try again later.</p>';
                    });
            } else {
                detailsContainer.innerHTML = '<p class="text-center text-gray-500">Destination not found.</p>';
            }
        }
    }

    fetch("data/destinationData.json")
        .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch destinations data: ${res.status}`);
            return res.json();
        })
        .then(data => {
            // Once data is fetched, store it in the global variable
            destinations = data;

            const categoryButtons = document.querySelectorAll('.category-buttons > button');
            const cityButtons = document.querySelectorAll('.city-selection button');
            const popup = document.getElementById('destination-popup');
            const closeBtn = document.querySelector('.close-popup');
            let cardTemplate = null;

            if (popup) {
                popup.classList.add('hidden');
            }

            // Fetch the card template
            fetch("componentHTML/destinationCard.html")
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch card template: ${res.status}`);
                    return res.text();
                })
                .then(template => {
                    cardTemplate = template;
                    const initialCategory = getActiveCategory(categoryButtons);
                    const initialCity = getActiveCity(cityButtons);
                    filterCards(initialCategory, initialCity, container, cardTemplate, categoryButtons, cityButtons);
                })
                .catch(error => {
                    console.error('Error fetching card template:', error.message);
                    if (container) {
                        container.innerHTML = '<p class="text-center text-red-500">Error loading card template. Please try again later.</p>';
                    }
                });

            renderDestinationDetails();


            // Event Listeners
            if (categoryButtons.length > 0) {
                categoryButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        categoryButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        filterCards(this.textContent, getActiveCity(cityButtons), container, cardTemplate, categoryButtons, cityButtons);
                    });
                });
            }

            if (cityButtons.length > 0) {
                cityButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        cityButtons.forEach(btn => btn.classList.remove('active'));
                        this.classList.add('active');
                        filterCards(getActiveCategory(categoryButtons), this.textContent, container, cardTemplate, categoryButtons, cityButtons);
                    });
                });
            }
            if (closeBtn && popup) {
                closeBtn.addEventListener('click', () => popup.classList.add('hidden'));
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) popup.classList.add('hidden');
                });
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !popup.classList.contains('hidden')) {
                        popup.classList.add('hidden');
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching destinations:', error.message);
            if (container) {
                container.innerHTML = '<p class="text-center text-red-500">Error loading destinations. Please check your connection or try again later.</p>';
            }
            const detailsContainer = document.getElementById('destination-details-container');
            if (detailsContainer) {
                detailsContainer.innerHTML = '<p class="text-center text-red-500">Could not load destination data. Please go back and try again.</p>';
            }
        });

    function getActiveCategory(buttons) {
        const activeBtn = document.querySelector('.category-buttons > button.active');
        return activeBtn ? activeBtn.textContent : 'All';
    }

    function getActiveCity(buttons) {
        const activeBtn = document.querySelector('.city-selection button.active');
        return activeBtn ? activeBtn.textContent : 'Jakarta';
    }

    function filterCards(category, city, container, template, categoryButtons, cityButtons) {
        if (!container) return; 
        if (!template) {
            container.innerHTML = '<p class="text-center text-gray-500">Loading card template...</p>';
            return;
        }

        const filteredDestinations = destinations.filter(dest => {
            const matchesCity = city === 'All' || dest.departureCities.includes(city);
            const matchesCategory = category === 'All' || dest.category === category;
            return matchesCity && matchesCategory;
        });

        container.innerHTML = '';
        if (filteredDestinations.length === 0) {
            container.innerHTML = '<p class="text-center text-gray-500">No destinations found for this selection.</p>';
            return;
        }

        const isHomePage = categoryButtons.length === 0 && cityButtons.length === 0;
        const destinationsToShow = isHomePage ? filteredDestinations.slice(0, 3) : filteredDestinations;

        destinationsToShow.forEach(dest => {
            const cardHTML = template
                .replace(/{{img}}/g, dest.img)
                .replace(/{{title}}/g, dest.title)
                .replace(/{{description}}/g, dest.description)
                .replace(/{{price}}/g, dest.price);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = cardHTML;
            container.appendChild(wrapper.firstElementChild);
        });

        // Add click listeners to cards for popup
        const cards = container.querySelectorAll('.destination-card');
        const popup = document.getElementById('destination-popup');
        cards.forEach(card => {
            card.addEventListener('click', function () {
                if (!popup) return;
                
                const title = card.querySelector('h3').textContent;
                const dest = destinations.find(d => d.title === title);

                if (dest) {
                    document.getElementById('popup-img').src = card.querySelector('img').src;
                    document.getElementById('popup-title').textContent = dest.title;
                    document.getElementById('popup-description').textContent = dest.description;
                    document.getElementById('popup-price').textContent = dest.price;
                    document.getElementById('more-info-link').href = `destination-details.html?title=${encodeURIComponent(dest.title)}`;
                    document.getElementById('book-now-link').href = dest.bookNowUrl;

                    popup.classList.remove('hidden');
                }
            });
        });
    }
});
