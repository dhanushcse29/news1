document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    if (document.querySelector('.mainSwiper')) {
        const swiper = new Swiper('.mainSwiper', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // Load Events
    async function loadEvents() {
        const eventsGrid = document.getElementById('eventsGrid');
        if (!eventsGrid) return;

        try {
            const response = await fetch('/api/events');
            const events = await response.json();

            eventsGrid.innerHTML = events.map(event => {
                const eventDate = new Date(event.date);
                const day = eventDate.getDate();
                const month = eventDate.toLocaleString('default', { month: 'short' });
                
                return `
                    <div class="event-card">
                        <div class="event-date">
                            <span class="day">${day}</span>
                            <span class="month">${month}</span>
                        </div>
                        <div class="event-content">
                            <h3>${event.title}</h3>
                            <p>${event.description}</p>
                            <div class="event-details">
                                <span><i class="far fa-clock"></i> ${event.time}</span>
                                <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading events:', error);
            eventsGrid.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load events. Please try again later.</p>
                </div>
            `;
        }
    }

    // Load News
    async function loadNews() {
        const newsGrid = document.getElementById('newsGrid');
        if (!newsGrid) return;

        try {
            const response = await fetch('/api/news');
            const news = await response.json();

            newsGrid.innerHTML = news.map(item => `
                <div class="news-card">
                    <div class="news-image">
                        <img src="${item.image || '/images/news-default.jpg'}" alt="${item.title}">
                    </div>
                    <div class="news-content">
                        <h3>${item.title}</h3>
                        <p>${item.content.substring(0, 150)}...</p>
                        <div class="news-meta">
                            <span><i class="far fa-user"></i> ${item.author}</span>
                            <span><i class="far fa-calendar"></i> ${new Date(item.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            console.error('Error loading news:', error);
            newsGrid.innerHTML = '<p class="error">Failed to load news</p>';
        }
    }

    // Initialize content loading
    loadNews();
    loadEvents();

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        
        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            }
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
        }
    });

    // Admin Form Submissions
    const addNewsForm = document.getElementById('addNewsForm');
    const addEventForm = document.getElementById('addEventForm');

    if (addNewsForm) {
        addNewsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('adminToken');
            
            const formData = {
                title: e.target.title.value,
                content: e.target.content.value,
                image: e.target.image.value,
                author: e.target.author.value
            };

            try {
                const response = await fetch('/api/news', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('News added successfully!');
                    e.target.reset();
                } else {
                    alert('Failed to add news');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error adding news');
            }
        });
    }

    if (addEventForm) {
        addEventForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('adminToken');
            
            const formData = {
                title: e.target.title.value,
                description: e.target.description.value,
                date: e.target.date.value,
                time: e.target.time.value,
                location: e.target.location.value
            };

            try {
                const response = await fetch('/api/events', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Event added successfully!');
                    e.target.reset();
                } else {
                    alert('Failed to add event');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error adding event');
            }
        });
    }

    // Admin Management Functions
    async function loadManagementLists() {
        const newsList = document.getElementById('newsList');
        const eventsList = document.getElementById('eventsList');
        const token = localStorage.getItem('adminToken');

        if (newsList) {
            try {
                const response = await fetch('/api/news');
                const news = await response.json();
                
                newsList.innerHTML = news.map(item => `
                    <div class="manage-item" data-id="${item._id}">
                        <div class="manage-item-content">
                            <h4>${item.title}</h4>
                            <p>${item.content.substring(0, 100)}...</p>
                            <span class="date">Posted on: ${new Date(item.date).toLocaleDateString()}</span>
                        </div>
                        <button class="delete-btn" onclick="deleteNews('${item._id}')">Delete</button>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading news:', error);
            }
        }

        if (eventsList) {
            try {
                const response = await fetch('/api/events');
                const events = await response.json();
                
                eventsList.innerHTML = events.map(event => `
                    <div class="manage-item" data-id="${event._id}">
                        <div class="manage-item-content">
                            <h4>${event.title}</h4>
                            <p>${event.description.substring(0, 100)}...</p>
                            <span class="date">Event Date: ${new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <button class="delete-btn" onclick="deleteEvent('${event._id}')">Delete</button>
                    </div>
                `).join('');
            } catch (error) {
                console.error('Error loading events:', error);
            }
        }
    }

    // Delete functions
    async function deleteNews(id) {
        if (!confirm('Are you sure you want to delete this news item?')) return;
        
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`/api/news/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                document.querySelector(`[data-id="${id}"]`).remove();
                alert('News deleted successfully');
            } else {
                alert('Failed to delete news');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting news');
        }
    }

    async function deleteEvent(id) {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                document.querySelector(`[data-id="${id}"]`).remove();
                alert('Event deleted successfully');
            } else {
                alert('Failed to delete event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting event');
        }
    }

    // Initialize management lists if on admin page
    if (document.getElementById('newsList') || document.getElementById('eventsList')) {
        loadManagementLists();
    }

    // Make delete functions globally available
    window.deleteNews = async function(id) {
        if (!confirm('Are you sure you want to delete this news item?')) return;
        
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`/api/news/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove the item from DOM
                const newsItem = document.querySelector(`[data-id="${id}"]`);
                if (newsItem) {
                    newsItem.remove();
                    alert('News deleted successfully');
                }
                // Refresh the news list
                loadManagementLists();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete news');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting news');
        }
    };

    window.deleteEvent = async function(id) {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                // Remove the item from DOM
                const eventItem = document.querySelector(`[data-id="${id}"]`);
                if (eventItem) {
                    eventItem.remove();
                    alert('Event deleted successfully');
                }
                // Refresh the events list
                loadManagementLists();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete event');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting event');
        }
    };
}); 