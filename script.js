
/* =========================================
   LINUS® PHOTOGRAPHY
   OUR STORY — CINEMATIC SCROLL EXPERIENCE
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const storySection = document.querySelector(".story-section");
    const storyImage = document.getElementById("storyImage");
    const storyLabel = document.getElementById("storyLabel");
    const storyTitle = document.getElementById("storyTitle");
    const storyText = document.getElementById("storyText");
    const storyCount = document.getElementById("storyCount");

    if (
        !storySection ||
        !storyImage ||
        !storyLabel ||
        !storyTitle ||
        !storyText
    ) {
        return;
    }

    // STORY PHOTOGRAPHS AND CONTENT
    const storyFrames = [

        {
            image: "images/story1.png",
            label: "OUR STORY",
            title: "MORE THAN<br>JUST THE<br>DISTANCE.",
            text: "Every runner has a reason to keep moving. We capture the moments that make the journey worth remembering."
        },

        {
            image: "images/story2.png",
            label: "THE RHYTHM",
            title: "BUILT<br>THROUGH<br>EVERY STEP.",
            text: "The early mornings. The quiet roads. The countless miles nobody sees. This is where the journey takes shape."
        },

        {
            image: "images/story3.png",
            label: "THE ATHLETE",
            title: "EVERY<br>STRIDE HAS<br>A STORY.",
            text: "Beyond the speed and performance, there is dedication, discipline and a determination worth capturing."
        },

        {
            image: "images/story4.png",
            label: "THE BIGGER PICTURE",
            title: "THIS IS<br>RUNNING<br>CULTURE.",
            text: "Real athletes. Real effort. Real stories. We preserve the moments that define the journey."
        }

    ];


    // PRELOAD ALL PHOTOGRAPHS
    storyFrames.forEach((frame) => {
        const image = new Image();
        image.src = frame.image;
    });


    let currentFrame = -1;
    let ticking = false;


    // CHANGE STORY PHOTOGRAPH AND TEXT
    function changeStoryFrame(index) {

        if (index === currentFrame) return;

        currentFrame = index;

        const frame = storyFrames[index];

        storyImage.style.opacity = "0";

        const newImage = new Image();

        newImage.onload = () => {

            storyImage.src = frame.image;
            storyImage.style.opacity = "1";

        };

        newImage.onerror = () => {

            console.warn(
                "Story image could not be found:",
                frame.image
            );

            storyImage.style.opacity = "1";

        };

        newImage.src = frame.image;

        storyLabel.textContent = frame.label;

        storyTitle.innerHTML = frame.title;

        storyText.textContent = frame.text;

        if (storyCount) {

            storyCount.textContent =
                `0${index + 1} / 0${storyFrames.length}`;

        }

    }


    // SCROLL EXPERIENCE
    function updateStory() {

        const sectionPosition =
            storySection.getBoundingClientRect();

        const totalScroll =
            storySection.offsetHeight - window.innerHeight;

        if (totalScroll <= 0) {
            ticking = false;
            return;
        }

        let progress =
            -sectionPosition.top / totalScroll;

        progress = Math.max(
            0,
            Math.min(1, progress)
        );


        // DETERMINE CURRENT STORY CHAPTER
        const frameIndex = Math.min(
            storyFrames.length - 1,
            Math.floor(progress * storyFrames.length)
        );

        changeStoryFrame(frameIndex);


        // GRADUAL PHOTOGRAPHIC ZOOM OUT
        const zoom =
            1.25 - (progress * 0.22);

        storyImage.style.transform =
            `scale(${zoom})`;


        // BLACK AND WHITE TO ORIGINAL COLOUR
        // Colour begins returning at 75% scroll.

        const colourProgress = Math.max(
            0,
            Math.min(1, (progress - 0.75) / 0.25)
        );

        const grayscale =
            100 - (colourProgress * 100);

        storyImage.style.filter =
            `grayscale(${grayscale}%) contrast(1.12)`;


        ticking = false;

    }


    // OPTIMISED SCROLL LISTENER
    function requestStoryUpdate() {

        if (!ticking) {

            window.requestAnimationFrame(updateStory);

            ticking = true;

        }

    }


    window.addEventListener(
        "scroll",
        requestStoryUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestStoryUpdate
    );


    // INITIALISE EXPERIENCE
    updateStory();

});
/* =========================================
   PACKAGES — SCROLL REVEAL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const packagesSection = document.querySelector(".packages-section");

    if (!packagesSection) return;

    const packageObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    packagesSection.classList.add("is-visible");

                    packageObserver.unobserve(packagesSection);

                }

            });

        },
        {
            threshold: 0.15
        }
    );

    packageObserver.observe(packagesSection);

});

/* ==========================================
   PACKAGE BUTTONS — DIRECT WHATSAPP
========================================== */

document.querySelectorAll(".package-link").forEach(link => {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const selectedPackage = this.dataset.package;

        const messages = {
            Basic: "Hello LINUS® Photography! I'm interested in booking the BASIC package (KSh 2,000). I'd like to discuss an available date for my athlete photography session.",

            Standard: "Hello LINUS® Photography! I'm interested in booking the STANDARD package (KSh 4,000). I'd like to discuss an available date for my athlete photography session.",

            Premium: "Hello LINUS® Photography! I'm interested in booking the PREMIUM package (KSh 10,000). I'd like to discuss an available date for my athlete photography session.",

            Custom: "Hello LINUS® Photography! I'm interested in creating a CUSTOM photography session. I'd like to discuss my requirements and pricing."
        };

        const message = messages[selectedPackage];

        if (!message) return;

        const whatsappURL =
            "https://wa.me/254768810218?text=" +
            encodeURIComponent(message);

        window.open(whatsappURL, "_blank", "noopener,noreferrer");

    });

});

/* ==========================================
   SOCIAL CONTACT PANEL
   INSTAGRAM + WHATSAPP
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const socialTrigger = document.getElementById("socialTrigger");
    const socialOverlay = document.getElementById("socialOverlay");
    const socialClose = document.getElementById("socialClose");

    if (!socialTrigger || !socialOverlay || !socialClose) {
        return;
    }

    // OPEN PANEL
    socialTrigger.addEventListener("click", () => {
        socialOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        socialClose.focus();
    });

    // CLOSE PANEL
    function closeSocialPanel() {
        socialOverlay.classList.remove("active");
        document.body.style.overflow = "";
        socialTrigger.focus();
    }

    socialClose.addEventListener("click", closeSocialPanel);

    // CLOSE WHEN CLICKING OUTSIDE THE PANEL
    socialOverlay.addEventListener("click", (event) => {
        if (event.target === socialOverlay) {
            closeSocialPanel();
        }
    });

    // CLOSE WITH ESCAPE KEY
    document.addEventListener("keydown", (event) => {
        if (
            event.key === "Escape" &&
            socialOverlay.classList.contains("active")
        ) {
            closeSocialPanel();
        }
    });

});
