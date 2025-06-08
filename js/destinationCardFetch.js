let destinations = [];

document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById('cards-container');
    if (container) {
        container.innerHTML = '<p>Loading destinations...</p>'; // Show loading state
    }

    // Fetch destinations data
    fetch("../data/destinationData.json")
        .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch destinations data: ${res.status}`);
            return res.json();
        })
        .then(data => {
            destinations = data;
            const categoryButtons = document.querySelectorAll('.category-buttons > button');
            const cityButtons = document.querySelectorAll('.city-selection button');
            const popup = document.getElementById('destination-popup');
            const closeBtn = document.querySelector('.close-popup');
            let template = null;

            console.log('Popup element:', popup); // Debug popup

            // Safeguard: Ensure popup is hidden on page load
            if (popup) {
                popup.classList.add('hidden');
            } else {
                console.error('Popup element not found');
            }

            // Fetch card template
            fetch("../componentHTML/destinationCard.html")
                .then(res => {
                    if (!res.ok) throw new Error(`Failed to fetch template: ${res.status}`);
                    return res.text();
                })
                .then(data => {
                    template = data;
                    // Use default values if buttons are missing
                    const category = getActiveCategory(categoryButtons);
                    const city = getActiveCity(cityButtons);
                    filterCards(category, city, container, template, categoryButtons, cityButtons);
                })
                .catch(error => {
                    console.error('Error fetching template:', error.message);
                    container.innerHTML = '<p>Error loading card template. Please try again later.</p>';
                });

            // Category button click handlers
            if (categoryButtons.length > 0) {
                categoryButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        categoryButtons.forEach(btn => {
                            btn.classList.remove('active');
                            btn.setAttribute('aria-pressed', 'false');
                        });
                        this.classList.add('active');
                        this.setAttribute('aria-pressed', 'true');
                        filterCards(this.textContent, getActiveCity(cityButtons), container, template, categoryButtons, cityButtons);
                    });
                });
            }

            // City button click handlers
            if (cityButtons.length > 0) {
                cityButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        cityButtons.forEach(btn => {
                            btn.classList.remove('active');
                            btn.setAttribute('aria-pressed', 'false');
                        });
                        this.classList.add('active');
                        this.setAttribute('aria-pressed', 'true');
                        filterCards(getActiveCategory(categoryButtons), this.textContent, container, template, categoryButtons, cityButtons);
                    });
                });
            }

            // Popup close handlers
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

            function getActiveCategory(categoryButtons) {
                const activeBtn = categoryButtons.length > 0 ? document.querySelector('.category-buttons > button.active') : null;
                return activeBtn ? activeBtn.textContent : 'All'; // Default to 'All' if no buttons
            }

            function getActiveCity(cityButtons) {
                const activeBtn = cityButtons.length > 0 ? document.querySelector('.city-selection button.active') : null;
                return activeBtn ? activeBtn.textContent : 'Jakarta'; // Default to 'Jakarta' if no buttons
            }

            function filterCards(category, city, container, template, categoryButtons, cityButtons) {
                if (!template) {
                    container.innerHTML = '<p>Loading card template...</p>';
                    return;
                }

                const filteredDestinations = destinations.filter(dest => {
                    const matchesCity = city === 'All' || dest.departureCities.includes(city);
                    const matchesCategory = category === 'All' || dest.category === category;
                    return matchesCity && matchesCategory;
                });

                container.innerHTML = '';
                if (filteredDestinations.length === 0) {
                    container.innerHTML = '<p>No destinations found for this selection.</p>';
                    return;
                }

                // Limit to first 4 destinations on home page (no category/city buttons)
                const isHomePage = categoryButtons.length === 0 && cityButtons.length === 0;
                const destinationsToShow = isHomePage ? filteredDestinations.slice(0, 3) : filteredDestinations; //we put 3 here so we can freely change the number of card and the size of the box better

                console.log(`Rendering ${destinationsToShow.length} destinations`); // Debug log

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
                console.log('Found cards:', cards.length); // Debug card count
                cards.forEach(card => {
                    console.log('Adding click listener to', card); // Debug listener
                    card.addEventListener('click', function () {
                        if (!popup) {
                            console.error('Popup not available');
                            return;
                        }
                        const img = card.querySelector('img').src;
                        const title = card.querySelector('h3').textContent;
                        const description = card.querySelector('p').textContent;
                        const price = card.querySelector('.price').textContent;
                        const dest = destinations.find(d => d.title === title);

                        document.getElementById('popup-img').src = img;
                        document.getElementById('popup-title').textContent = title;
                        document.getElementById('popup-description').textContent = description;
                        document.getElementById('popup-price').textContent = price;
                        document.getElementById('more-info-link').href = `destination-details.html?title=${encodeURIComponent(title)}`;
                        document.getElementById('book-now-link').href = dest.bookNowUrl;

                        popup.classList.remove('hidden');
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error fetching destinations:', error.message);
            if (container) {
                container.innerHTML = '<p>Error loading destinations. Please check your connection or try again later.</p>';
            }
        });
});

// Handle rendering of destination-details.html
window.addEventListener('load', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const container = document.getElementById('destination-details-container');
    if (title && container && window.location.pathname.includes('destination-details.html')) {
        if (destinations.length === 0) {
            container.innerHTML = '<p>Loading destination details...</p>';
            return;
        }

        const dest = destinations.find(d => d.title === decodeURIComponent(title));
        if (dest) {
            fetch('../componentHTML/destinationDetails.html')
                .then(res => res.text())
                .then(html => {
                    let detailsHTML = html
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
                    container.innerHTML = detailsHTML;
                })
                .catch(error => {
                    console.error('Error loading destination details template:', error.message);
                    container.innerHTML = '<p>Error loading details. Please try again later.</p>';
                });
        } else {
            container.innerHTML = '<p>Destination not found.</p>';
        }
    }
});