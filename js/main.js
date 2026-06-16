document.addEventListener('DOMContentLoaded', function () {
    setGreeting();
    initMobileNav();
    initReviews();
    initContactForm();
});

function setGreeting() {
    const el = document.getElementById('greeting');
    if (!el) return;
    const hour = new Date().getHours();
    const text = hour >= 5 && hour < 12
        ? 'Good Morning, Guest!'
        : hour >= 12 && hour < 18
            ? 'Good Afternoon, Guest!'
            : 'Good Evening, Guest!';
    el.textContent = text;
}

function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
        nav.classList.toggle('open');
        toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initReviews() {
    const form = document.getElementById('reviewForm');
    const list = document.getElementById('reviewList');
    if (!form || !list) return;

    loadReviews();

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const review = {
            name: form.name.value.trim(),
            rating: form.rating.value,
            comment: form.comment.value.trim()
        };
        if (!review.name || !review.comment) return;

        const reviews = getReviews();
        reviews.push(review);
        localStorage.setItem('millano_guest_reviews', JSON.stringify(reviews));
        if (list.querySelector('p')) list.innerHTML = '';
        addReviewToDOM(review, list);
        form.reset();
    });

    function getReviews() {
        return JSON.parse(localStorage.getItem('millano_guest_reviews') || '[]');
    }

    function loadReviews() {
        const reviews = getReviews();
        if (reviews.length > 0) {
            list.innerHTML = '';
        }
        reviews.forEach(function (review) {
            addReviewToDOM(review, list);
        });
    }
}

function addReviewToDOM(review, list) {
    const item = document.createElement('article');
    item.className = 'review-item';
    item.innerHTML =
        '<h4>' + escapeHtml(review.name) + '</h4>' +
        '<div class="review-rating">Rating: ' + escapeHtml(review.rating) + '/5</div>' +
        '<p>' + escapeHtml(review.comment) + '</p>' +
        '<button type="button" class="btn-delete">Delete</button>';

    item.querySelector('.btn-delete').addEventListener('click', function () {
        const reviews = JSON.parse(localStorage.getItem('millano_guest_reviews') || '[]');
        const updated = reviews.filter(function (r) {
            return !(r.name === review.name && r.rating === review.rating && r.comment === review.comment);
        });
        localStorage.setItem('millano_guest_reviews', JSON.stringify(updated));
        item.remove();
    });

    list.appendChild(item);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function initContactForm() {
    // Initialize EmailJS with your Public Key
    emailjs.init("PrwfPQmK8N4sv0ZaQ");

    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        emailjs.sendForm('service_1k53sv7', 'template_elmsf5i', form)
            .then(function(response) {
                console.log('Email sent successfully!', response.status, response.text);
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#16a34a';
                
                setTimeout(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    form.reset();
                }, 3000);
            })
            .catch(function(error) {
                console.error('Failed to send email:', error);
                submitBtn.textContent = 'Error! Try Again';
                submitBtn.style.background = '#dc2626';
                
                setTimeout(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            });
    });
}

