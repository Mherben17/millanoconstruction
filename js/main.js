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
    const form = document.getElementById('contactForm');
    const statusEl = document.getElementById('contactStatus');
    if (!form || !statusEl) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        statusEl.textContent = 'Sending your message...';
        statusEl.className = 'contact-status status-info';

        const templateParams = {
            to_email: 'millanocons@gmail.com',
            from_name: form.name.value,
            from_email: form.email.value,
            phone: form.phone.value || 'Not provided',
            projectType: form.projectType.value,
            message: form.message.value,
            reply_to: form.email.value
        };

        emailjs.send('service_1k53sv7', 'template_elmsf5i', templateParams)
            .then(function(response) {
                console.log('EmailJS send succeeded', response);
                statusEl.textContent = 'Message sent successfully!';
                statusEl.className = 'contact-status status-success';
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.background = '#16a34a';

                setTimeout(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    form.reset();
                    statusEl.textContent = '';
                }, 3000);
            })
            .catch(function(error) {
                console.error('EmailJS send failed:', error);
                statusEl.textContent = 'Unable to send message. Please check the console for details.';
                statusEl.className = 'contact-status status-error';
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

