/* ===========================
   MOBILE NAV — HAMBURGER
=========================== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

/* ===========================
   PROJECTS — FETCH FROM API
=========================== */
document.addEventListener('DOMContentLoaded', () => {
    fetchProjects();
    fetchDesigns();
});

function fetchProjects() {
    fetch('projects.json')
        .then(r => r.json())
        .then(data => {
            const list = document.getElementById('project-list');
            list.innerHTML = '';

            if (!data.length) {
                list.innerHTML = '<p class="loading-text">No projects found.</p>';
                return;
            }

            data.forEach(project => {
                let tagsHtml = '';
                if (project.languages) {
                    tagsHtml = '<div class="project-tags">' +
                        project.languages.split(',')
                            .map(t => '<span class="project-tag">' + t.trim() + '</span>')
                            .join('') +
                        '</div>';
                }

                let featuresHtml = '';
                if (project.features) {
                    const items = project.features.split('|')
                        .map(f => '<li><i class="bx bx-check-circle"></i> ' + f.trim() + '</li>')
                        .join('');
                    featuresHtml = '<div class="project-lists"><div class="list-section">' +
                        '<h5 class="feat-title">Key Features</h5>' +
                        '<ul class="custom-list feat-list">' + items + '</ul>' +
                        '</div></div>';
                }

                const viewBtn = (project.link && project.link !== '#')
                    ? '<a href="' + project.link + '" target="_blank">View Project <i class="bx bx-right-arrow-alt"></i></a>'
                    : '<span style="color:var(--text-light);font-size:0.85rem;">Coming soon</span>';

                const demoBtn = project.video_link
                    ? '<a href="' + project.video_link + '" target="_blank" class="btn-demo">' +
                      '<i class="bx bxl-youtube"></i> Watch Demo</a>'
                    : '';

                list.innerHTML += '<div class="project-card reveal"><div class="project-info">' +
                    '<h4>' + project.title + '</h4>' +
                    tagsHtml +
                    '<p>' + project.description + '</p>' +
                    featuresHtml +
                    '<div class="project-actions">' + viewBtn + demoBtn + '</div>' +
                    '</div></div>';
            });

            attachRevealObserver();
        })
        .catch(err => {
            console.error('Projects error:', err);
            document.getElementById('project-list').innerHTML =
                '<p class="loading-text">Could not load projects. Please try again later.</p>';
        });
}

/* ===========================
   UI DESIGNS GALLERY
=========================== */
function fetchDesigns() {
    fetch('designs.json')
        .then(r => r.json())
        .then(data => {
            const grid = document.getElementById('designs-grid');
            grid.innerHTML = '';

            if (!data.length) {
                grid.innerHTML = '<p class="loading-text">No designs yet!</p>';
                return;
            }

            data.forEach(design => {
                const card = document.createElement('div');
                card.className = 'design-card reveal';
                card.dataset.category = design.category || 'Other';

                const imgHtml = design.image_url
                    ? '<img src="' + design.image_url + '" alt="' + design.title + '" loading="lazy" ' +
                      'onerror="this.parentElement.innerHTML=\'<div class=\\\"design-placeholder\\\"><i class=\\\"bx bx-image\\\"></i></div>\'">'
                    : '<div class="design-placeholder"><i class="bx bx-image"></i></div>';

                card.innerHTML =
                    '<div class="design-thumb">' +
                        imgHtml +
                        '<div class="design-overlay"><i class="bx bx-zoom-in"></i><span>Preview</span></div>' +
                    '</div>' +
                    '<div class="design-info">' +
                        '<h4>' + design.title + '</h4>' +
                        '<span class="design-category-badge">' + (design.category || 'Design') + '</span>' +
                    '</div>';

                card.addEventListener('click', function() { openLightbox(design); });
                grid.appendChild(card);
            });

            attachRevealObserver();
            setupFilters();
        })
        .catch(() => showPlaceholderGallery());
}

function showPlaceholderGallery() {
    const grid = document.getElementById('designs-grid');
    const labels = [
        { title: 'Web App Design', cat: 'Web App' },
        { title: 'Mobile App UI', cat: 'Mobile App' },
        { title: 'Dashboard Design', cat: 'Desktop App' },
        { title: 'Landing Page', cat: 'Web App' },
        { title: 'App Onboarding', cat: 'Mobile App' },
        { title: 'Admin Panel', cat: 'Desktop App' }
    ];
    grid.innerHTML = labels.map(d =>
        '<div class="design-card reveal" data-category="' + d.cat + '">' +
        '<div class="design-thumb"><div class="design-placeholder"><i class="bx bx-image"></i></div>' +
        '<div class="design-overlay"><i class="bx bx-zoom-in"></i><span>Add your image</span></div></div>' +
        '<div class="design-info"><h4>' + d.title + '</h4>' +
        '<span class="design-category-badge">' + d.cat + '</span></div></div>'
    ).join('');

    attachRevealObserver();
    setupFilters();
}

function setupFilters() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            document.querySelectorAll('.design-card').forEach(card => {
                card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
            });
        });
    });
}

/* ===========================
   LIGHTBOX
=========================== */
const lightbox      = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(design) {
    document.getElementById('lightbox-img').src             = design.image_url || '';
    document.getElementById('lightbox-img').alt             = design.title;
    document.getElementById('lightbox-title').textContent   = design.title;
    document.getElementById('lightbox-category').textContent= design.category || 'Design';
    document.getElementById('lightbox-tools').textContent   = design.tools || '';

    const link = document.getElementById('lightbox-link');
    if (design.preview_url && design.preview_url !== '#') {
        link.href = design.preview_url;
        link.style.display = 'inline-flex';
    } else {
        link.style.display = 'none';
    }

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function() { document.getElementById('lightbox-img').src = ''; }, 300);
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeLightbox(); });

/* ===========================
   DYNAMIC ROLE ROTATOR
=========================== */
const roles = ['Software Engineering Student', 'Frontend Developer', 'UI/UX Designer'];
let roleIndex = 0;
const roleElement = document.getElementById('dynamic-role');

function changeRole() {
    roleElement.classList.add('role-hidden');
    setTimeout(function() {
        roleIndex = (roleIndex + 1) % roles.length;
        roleElement.textContent = roles[roleIndex];
        roleElement.classList.remove('role-hidden');
    }, 500);
}
setInterval(changeRole, 3000);

/* ===========================
   SCROLL REVEAL
=========================== */
const revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

function attachRevealObserver() {
    document.querySelectorAll('.reveal').forEach(function(el) {
        if (!el.classList.contains('active')) revealObserver.observe(el);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('section, .feature-card, .skill-card, .timeline-item').forEach(function(el) {
        el.classList.add('reveal');
    });
    attachRevealObserver();
});

/* ===========================
   NAVBAR SCROLL SHADOW
=========================== */
window.addEventListener('scroll', function() {
    document.querySelector('.navbar').style.boxShadow =
        window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.06)' : 'none';
});