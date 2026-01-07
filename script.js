// State
let allProjects = [];
let allExtras = [];
let marqueeData = null;
let projectsExpanded = false;
let extrasExpanded = false;
const INITIAL_DISPLAY_COUNT = 3;
const MOBILE_DISPLAY_COUNT = 1;

// Helper function to check if viewport is mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Get the appropriate display count based on viewport
function getInitialDisplayCount() {
    return isMobile() ? MOBILE_DISPLAY_COUNT : INITIAL_DISPLAY_COUNT;
}

// Font cycling state
const titleFonts = ['Lazenby', 'QTEurotype', 'Cyberotica', 'Exo', 'Orbitron'];
const bodyFonts = ['Jura', 'Play'];
let currentTitleFontIndex = 0;
let currentBodyFontIndex = 0;

// Load content on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadGeneralContent();
    await loadMarqueeContent();
    await loadProjects();
    await loadExtras();
    setupEventListeners();
});

// Load general content from JSON
async function loadGeneralContent() {
    try {
        const response = await fetch('content.json');
        const content = await response.json();

        // Set nav name
        document.getElementById('navName').textContent = content.name;

        // Set hero content
        document.getElementById('heroImage').src = content.heroImage;
        document.getElementById('heroTitle').textContent = content.heroTitle;

        // Convert newlines to paragraph breaks for hero description
        const heroDesc = document.getElementById('heroDescription');
        const paragraphs = content.heroDescription.split('\n\n');
        heroDesc.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');

        // Set marquee content
        if (content.marquee) {
            const marqueeContent = document.getElementById('marqueeContent');
            marqueeContent.innerHTML = '';
            // Create enough repetitions to ensure seamless loop
            for (let i = 0; i < 20; i++) {
                const span = document.createElement('span');
                span.textContent = content.marquee;
                marqueeContent.appendChild(span);
            }
        }

        // Show/hide extras section based on toggle
        const extrasSection = document.getElementById('extras');
        if (content.showExtras === false) {
            extrasSection.style.display = 'none';
        } else {
            extrasSection.style.display = 'block';
        }

        // Set contact content
        const contactContent = document.getElementById('contactContent');
        const contact = content.contact;

        // Get resume file from resume folder
        let resumeHTML = '';
        if (content.resumeFile) {
            resumeHTML = `<p>Resume: <a href="resume/${content.resumeFile}" target="_blank">View Resume</a></p>`;
        }

        contactContent.innerHTML = `
            <p>Email: ${contact.email}</p>
            <p>GitHub: <a href="https://${contact.github}" target="_blank">${contact.github}</a></p>
            <p>LinkedIn: <a href="https://${contact.linkedin}" target="_blank">${contact.linkedin}</a></p>
            ${resumeHTML}
        `;
    } catch (error) {
        console.error('Error loading general content:', error);
    }
}

// Load marquee content from folder
async function loadMarqueeContent() {
    try {
        const infoResponse = await fetch('marquee/info.json');
        const info = await infoResponse.json();

        const textResponse = await fetch('marquee/content.txt');
        const text = await textResponse.text();

        // Try to load preview image if specified
        let previewImage = null;
        if (info.previewImage) {
            previewImage = `marquee/images/${info.previewImage}`;
        }

        marqueeData = {
            folder: 'marquee',
            title: info.title,
            subtitle: info.subtitle,
            previewImage: previewImage,
            images: info.images || [],
            text: text
        };
    } catch (error) {
        console.error('Error loading marquee content:', error);
    }
}

// Load projects from folders
async function loadProjects() {
    try {
        const response = await fetch('projects/projects.json');
        const projectsList = await response.json();

        for (const projectFolder of projectsList.projects) {
            try {
                const infoResponse = await fetch(`projects/${projectFolder}/info.json`);
                const info = await infoResponse.json();

                const textResponse = await fetch(`projects/${projectFolder}/content.txt`);
                const text = await textResponse.text();

                // Try to load preview image if specified
                let previewImage = null;
                if (info.previewImage) {
                    previewImage = `projects/${projectFolder}/images/${info.previewImage}`;
                }

                allProjects.push({
                    folder: projectFolder,
                    title: info.title,
                    subtitle: info.subtitle,
                    previewImage: previewImage,
                    images: info.images || [],
                    text: text
                });
            } catch (error) {
                console.error(`Error loading project ${projectFolder}:`, error);
            }
        }

        displayProjects();
    } catch (error) {
        console.error('Error loading projects list:', error);
    }
}

// Load extras from folders
async function loadExtras() {
    try {
        const response = await fetch('extras/extras.json');
        const extrasList = await response.json();

        for (const extraFolder of extrasList.extras) {
            try {
                const infoResponse = await fetch(`extras/${extraFolder}/info.json`);
                const info = await infoResponse.json();

                const textResponse = await fetch(`extras/${extraFolder}/content.txt`);
                const text = await textResponse.text();

                // Try to load preview image if specified
                let previewImage = null;
                if (info.previewImage) {
                    previewImage = `extras/${extraFolder}/images/${info.previewImage}`;
                }

                allExtras.push({
                    folder: extraFolder,
                    title: info.title,
                    subtitle: info.subtitle,
                    previewImage: previewImage,
                    images: info.images || [],
                    text: text
                });
            } catch (error) {
                console.error(`Error loading extra ${extraFolder}:`, error);
            }
        }

        displayExtras();
    } catch (error) {
        console.error('Error loading extras list:', error);
    }
}

// Display projects
function displayProjects() {
    const grid = document.getElementById('projectsGrid');
    const expandBtn = document.getElementById('expandProjects');

    grid.innerHTML = '';

    const initialCount = getInitialDisplayCount();
    const projectsToShow = projectsExpanded ? allProjects : allProjects.slice(0, initialCount);

    projectsToShow.forEach((project, index) => {
        const item = createGridItem(project, 'project', index);
        grid.appendChild(item);
    });

    // Show/hide expand button
    if (allProjects.length <= initialCount) {
        expandBtn.classList.add('hidden');
    } else {
        expandBtn.classList.remove('hidden');
        expandBtn.textContent = projectsExpanded ? 'Show Less' : 'View All Projects';
    }
}

// Display extras
function displayExtras() {
    const grid = document.getElementById('extrasGrid');
    const expandBtn = document.getElementById('expandExtras');

    grid.innerHTML = '';

    const initialCount = getInitialDisplayCount();
    const extrasToShow = extrasExpanded ? allExtras : allExtras.slice(0, initialCount);

    extrasToShow.forEach((extra, index) => {
        const item = createGridItem(extra, 'extra', index);
        grid.appendChild(item);
    });

    // Show/hide expand button
    if (allExtras.length <= initialCount) {
        expandBtn.classList.add('hidden');
    } else {
        expandBtn.classList.remove('hidden');
        expandBtn.textContent = extrasExpanded ? 'Show Less' : 'View All Extras';
    }
}

// Create grid item element
function createGridItem(item, type, index) {
    const div = document.createElement('div');
    div.className = 'grid-item';

    if (!item.previewImage) {
        div.classList.add('no-image');
    }

    if (item.previewImage) {
        const img = document.createElement('img');
        img.src = item.previewImage;
        img.alt = item.title;
        img.className = 'grid-item-image';
        div.appendChild(img);
    }

    const title = document.createElement('div');
    title.className = 'grid-item-title';
    title.textContent = item.title;
    div.appendChild(title);

    const subtitle = document.createElement('div');
    subtitle.className = 'grid-item-subtitle';
    subtitle.textContent = item.subtitle;
    div.appendChild(subtitle);

    div.addEventListener('click', () => openModal(item, type));

    return div;
}

// Open modal with project/extra details
function openModal(item, type) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalImages = document.getElementById('modalImages');
    const modalText = document.getElementById('modalText');
    const imageStackToggle = document.getElementById('imageStackToggle');
    const imageStackContainer = document.getElementById('imageStackContainer');

    modalTitle.textContent = item.title;
    modalSubtitle.textContent = item.subtitle;
    modalText.textContent = item.text;

    // Load images
    modalImages.innerHTML = '';
    modalImages.classList.remove('expanded');
    imageStackToggle.classList.remove('expanded');

    if (item.images && item.images.length > 0) {
        // Show the image stack container
        imageStackContainer.style.display = 'block';

        // Update toggle button text with image count
        const toggleText = imageStackToggle.querySelector('.toggle-text');
        toggleText.textContent = `Show Images (${item.images.length})`;

        item.images.forEach(imageName => {
            const img = document.createElement('img');
            // Handle marquee folder separately (no 's' suffix)
            if (type === 'marquee') {
                img.src = `${type}/images/${imageName}`;
            } else {
                img.src = `${type}s/${item.folder}/images/${imageName}`;
            }
            img.alt = item.title;
            // Add click event to expand image
            img.addEventListener('click', () => expandImage(img.src, img.alt));
            modalImages.appendChild(img);
        });
    } else {
        // Hide the image stack container if no images
        imageStackContainer.style.display = 'none';
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Scroll modal content to top
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

// Expand image to full screen
function expandImage(src, alt) {
    const overlay = document.getElementById('imageExpansionOverlay');
    const expandedImg = document.getElementById('expandedImage');

    expandedImg.src = src;
    expandedImg.alt = alt;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close expanded image
function closeExpandedImage() {
    const overlay = document.getElementById('imageExpansionOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = 'hidden'; // Keep hidden since modal is still open
}

// Setup event listeners
function setupEventListeners() {
    // Text style toggle button (outline/filled)
    const textStyleToggle = document.getElementById('textStyleToggle');
    textStyleToggle.addEventListener('click', () => {
        document.body.classList.toggle('filled-text');
    });

    // Title font cycling button
    const titleFontToggle = document.getElementById('titleFontToggle');
    titleFontToggle.addEventListener('click', () => {
        currentTitleFontIndex = (currentTitleFontIndex + 1) % titleFonts.length;
        document.documentElement.style.setProperty('--title-font', titleFonts[currentTitleFontIndex]);
    });

    // Body font cycling button
    const bodyFontToggle = document.getElementById('bodyFontToggle');
    bodyFontToggle.addEventListener('click', () => {
        currentBodyFontIndex = (currentBodyFontIndex + 1) % bodyFonts.length;
        document.documentElement.style.setProperty('--body-font', bodyFonts[currentBodyFontIndex]);
    });

    // Marquee click to open modal
    const marquee = document.querySelector('.marquee');
    if (marquee && marqueeData) {
        marquee.addEventListener('click', () => {
            openModal(marqueeData, 'marquee');
        });
    }

    // Expand projects button
    document.getElementById('expandProjects').addEventListener('click', () => {
        projectsExpanded = !projectsExpanded;
        displayProjects();
    });

    // Expand extras button
    document.getElementById('expandExtras').addEventListener('click', () => {
        extrasExpanded = !extrasExpanded;
        displayExtras();
    });

    // Image stack toggle button
    const imageStackToggle = document.getElementById('imageStackToggle');
    const modalImages = document.getElementById('modalImages');

    imageStackToggle.addEventListener('click', () => {
        const isExpanded = modalImages.classList.toggle('expanded');
        imageStackToggle.classList.toggle('expanded');

        const toggleText = imageStackToggle.querySelector('.toggle-text');
        const currentText = toggleText.textContent;
        const imageCount = currentText.match(/\((\d+)\)/)?.[1] || '';

        if (isExpanded) {
            toggleText.textContent = imageCount ? `Hide Images (${imageCount})` : 'Hide Images';
        } else {
            toggleText.textContent = imageCount ? `Show Images (${imageCount})` : 'Show Images';
        }
    });

    // Modal close button
    const modal = document.getElementById('projectModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Name click to scroll to top
    const navName = document.getElementById('navName');
    if (navName) {
        navName.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth scrolling for nav links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const offset = 140; // navbar + marquee height
            const targetPosition = target.offsetTop - offset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Image expansion overlay event listeners
    const imageExpansionOverlay = document.getElementById('imageExpansionOverlay');
    const expansionCloseBtn = document.querySelector('.expansion-close');
    const expandedImageContainer = document.querySelector('.expanded-image-container');

    // Close on background click
    imageExpansionOverlay.addEventListener('click', (e) => {
        if (e.target === imageExpansionOverlay) {
            closeExpandedImage();
        }
    });

    // Close on exit button click
    expansionCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeExpandedImage();
    });

    // Prevent click on image from closing
    expandedImageContainer.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Handle window resize to update display when switching between mobile/desktop
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset expanded states when switching viewport sizes
            const wasMobile = projectsExpanded || extrasExpanded;
            if (wasMobile) {
                projectsExpanded = false;
                extrasExpanded = false;
            }
            displayProjects();
            displayExtras();
        }, 250);
    });
}
