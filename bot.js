
/* =====================================================
   PACE BOT — CONVERSATION ENGINE
   LINUS® PHOTOGRAPHY
   Scripted chatbot — no external API required
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ================= ELEMENTS ================= */

    const launcher = document.getElementById("paceLauncher");
    const greeting = document.getElementById("paceGreeting");
    const greetingClose = document.getElementById("paceGreetingClose");
    // Show greeting briefly, then hide it automatically
if (greeting) {
    setTimeout(() => {
        greeting.classList.add("show");

        setTimeout(() => {
            greeting.classList.remove("show");
        }, 4500);

    }, 1500);
}

    const chat = document.getElementById("paceChat");
    const minimize = document.getElementById("paceMinimize");
    const close = document.getElementById("paceClose");

    const messages = document.getElementById("paceMessages");
    const welcomeChoices = document.getElementById("paceWelcomeChoices");

    const form = document.getElementById("paceForm");
    const input = document.getElementById("paceInput");

    const typing = document.getElementById("paceTyping");
    const contactShortcuts = document.getElementById("paceContactShortcuts");

    if (
        !launcher || !chat || !messages || !form ||
        !input || !typing || !welcomeChoices
    ) {
        console.error("PACE BOT: Required HTML elements were not found.");
        return;
    }

    /* ================= BUSINESS DETAILS ================= */

    const PACE = {
        whatsapp: "254768810218",
        instagram: "https://www.instagram.com/_linusphotography/",

        packages: [
            {
                name: "Basic",
                price: "KSh 2,000",
                details: [
                    "1-hour session",
                    "20 edited photographs",
                    "30-second video"
                ]
            },
            {
                name: "Standard",
                price: "KSh 4,000",
                details: [
                    "3-hour session",
                    "30 edited photographs",
                    "1-minute video"
                ]
            },
            {
                name: "Premium",
                price: "KSh 10,000",
                details: [
                    "Full session coverage",
                    "Unlimited photos during the session",
                    "90-second cinematic trailer"
                ]
            },
            {
                name: "Custom",
                price: "LET'S DISCUSS",
                details: [
                    "A personalised photography session",
                    "Built around your own requirements",
                    "Pricing agreed together"
                ]
            }
        ],

        services: [
            {
                name: "Training Photography",
                description:
                    "Capture the work behind the performance — training sessions, workouts, preparation and everyday athletic moments."
            },
            {
                name: "Track & Field Photography",
                description:
                    "Athletic moments captured in motion, from explosive starts and competition action to the details between events."
            },
            {
                name: "Race-Day Coverage",
                description:
                    "Document your race experience, from the build-up and preparation to the finish line."
            },
            {
                name: "Athlete Portraits",
                description:
                    "Personal portraits that capture your character, discipline and identity as an athlete."
            },
            {
                name: "Sports Videos & Cinematic Reels",
                description:
                    "Moving images that bring your training, performance and sporting story to life."
            },
            {
                name: "Sports Events & Groups",
                description:
                    "Photography for sports events, teams, training groups, friends and organised sessions."
            }
        ]
    };

    /* ================= CONVERSATION STATE ================= */

    let conversation = [];
    let customDetails = {};
    let customStep = 0;
    let bookingStep = 0;
    let bookingDetails = {};

    let isTyping = false;
    let replyTimer = null;

    /* ================= HELPERS ================= */

    function scrollToBottom() {
        messages.scrollTop = messages.scrollHeight;
    }

    function addMessage(text, sender = "bot") {

        const message = document.createElement("div");
        message.className = sender === "user"
            ? "pace-message user-message"
            : "pace-message bot-message";

        const content = document.createElement("div");
        content.className = "pace-message-content";

        const senderLabel = document.createElement("span");
        senderLabel.className = "pace-sender";
        senderLabel.textContent = sender === "user" ? "YOU" : "PACE BOT";

        const bubble = document.createElement("div");
        bubble.className = "pace-bubble";

        // Use textContent to prevent HTML injection.
        bubble.textContent = text;

        content.appendChild(senderLabel);
        content.appendChild(bubble);
        message.appendChild(content);

        messages.appendChild(message);

        conversation.push({
            sender: sender,
            text: text
        });

        scrollToBottom();

        return message;
    }

    function showTyping() {
        isTyping = true;
        typing.hidden = false;
        scrollToBottom();
    }

    function hideTyping() {
        isTyping = false;
        typing.hidden = true;
    }

    function botReply(text, options = [], callback = null) {

        if (replyTimer) {
            clearTimeout(replyTimer);
        }

        showTyping();

        replyTimer = setTimeout(function () {

            hideTyping();

            addMessage(text, "bot");

            if (options.length) {
                showChoices(options);
            }

            if (callback) {
                callback();
            }

        }, Math.min(650 + text.length * 5, 1500));
    }

    function showChoices(options) {

        const container = document.createElement("div");
        container.className = "pace-choices";

        options.forEach(function (option) {

            const button = document.createElement("button");
            button.type = "button";
            button.className = "pace-choice";

            const label = document.createElement("span");
            label.textContent = option.label;

            const arrow = document.createElement("span");
            arrow.textContent = "↗";

            button.appendChild(label);
            button.appendChild(arrow);

            button.addEventListener("click", function () {

                container.remove();

                if (option.action) {
                    handleAction(option.action);
                } else {
                    handleUserMessage(option.label);
                }

            });

            container.appendChild(button);
        });

        messages.appendChild(container);
        scrollToBottom();
    }

    function userReply(text) {
        addMessage(text, "user");
    }

    function makeWhatsAppMessage(message) {

        const url =
            "https://wa.me/" +
            PACE.whatsapp +
            "?text=" +
            encodeURIComponent(message);

        window.open(url, "_blank", "noopener,noreferrer");
    }

    function showContactOptions() {

        contactShortcuts.hidden = false;

        botReply(
            "You can reach the LINUS® Photography team directly through either of these platforms.",
            [
                { label: "Start a new conversation", action: "newchat" }
            ]
        );
    }

    function clearContactOptions() {
        contactShortcuts.hidden = true;
    }

    /* ================= GREETING ================= */

    const greetingTimer = setTimeout(function () {
        if (!chat.classList.contains("active")) {
            greeting.classList.add("show");
        }
    }, 3500);

    if (greetingClose) {
        greetingClose.addEventListener("click", function () {
            greeting.classList.remove("show");
        });
    }

    /* ================= OPEN / CLOSE CHAT ================= */

function openChat() {

    chat.classList.add("active");
    chat.setAttribute("aria-hidden", "false");

    document.body.classList.add("pace-chat-open");

    launcher.setAttribute("aria-expanded", "true");
    launcher.style.display = "none";

    greeting.classList.remove("show");

    setTimeout(function () {
        input.focus();
        scrollToBottom();
    }, 300);
}

function minimizeChat() {

    chat.classList.remove("active");
    chat.setAttribute("aria-hidden", "true");

    document.body.classList.remove("pace-chat-open");

    launcher.style.display = "flex";
    launcher.setAttribute("aria-expanded", "false");
}

function closeChat() {

    minimizeChat();
    resetConversation();
}

launcher.addEventListener("click", openChat);

if (minimize) {
    minimize.addEventListener("click", minimizeChat);
}

if (close) {
    close.addEventListener("click", closeChat);
}

/* ================= RESET CHAT ================= */

function resetConversation() {

    if (replyTimer) {
        clearTimeout(replyTimer);
        replyTimer = null;
    }

    hideTyping();

    conversation = [];
    customDetails = {};
    customStep = 0;
    bookingStep = 0;
    bookingDetails = {};

    clearContactOptions();

    messages.innerHTML = "";

    const welcome = document.createElement("div");
    welcome.className = "pace-message bot-message";

    const content = document.createElement("div");
    content.className = "pace-message-content";

    const sender = document.createElement("span");
    sender.className = "pace-sender";
    sender.textContent = "PACE BOT";

    const bubble = document.createElement("div");
    bubble.className = "pace-bubble";
    bubble.textContent =
        "Hey there! Welcome to LINUS® Photography. What brings you here today?";

    content.appendChild(sender);
    content.appendChild(bubble);
    welcome.appendChild(content);

    messages.appendChild(welcome);

    const choices = document.createElement("div");
    choices.className = "pace-choices";

    const options = [
        { label: "Explore photography services", action: "services" },
        { label: "View packages & prices", action: "packages" },
        { label: "Book a photography session", action: "booking" },
        { label: "Check availability", action: "availability" },
        { label: "Ask about custom shoots", action: "custom" },
        { label: "Talk to the photographer", action: "contact" }
    ];

    options.forEach(function (option) {

        const button = document.createElement("button");
        button.type = "button";
        button.className = "pace-choice";

        const label = document.createElement("span");
        label.textContent = option.label;

        const arrow = document.createElement("span");
        arrow.textContent = "↗";

        button.appendChild(label);
        button.appendChild(arrow);

        button.addEventListener("click", function () {
            choices.remove();
            handleAction(option.action);
        });

        choices.appendChild(button);
    });

    messages.appendChild(choices);

    scrollToBottom();
}

    /* ================= PACKAGE INFORMATION ================= */

    function showPackages() {

        let packageText = "Here are our photography packages:\n\n";

        PACE.packages.forEach(function (item) {

            packageText += item.name.toUpperCase() +
                " — " + item.price + "\n";

            item.details.forEach(function (detail) {
                packageText += "• " + detail + "\n";
            });

            packageText += "\n";
        });

        botReply(
            packageText +
            "Each package offers a different level of coverage. You can choose whichever suits your plans.",
            [
                { label: "Basic — KSh 2,000", action: "basic" },
                { label: "Standard — KSh 4,000", action: "standard" },
                { label: "Premium — KSh 10,000", action: "premium" },
                { label: "Discuss a custom package", action: "custom" },
                { label: "How do I book?", action: "booking" }
            ]
        );
    }

    function choosePackage(packageName) {

        const selected = PACE.packages.find(function (item) {
            return item.name.toLowerCase() === packageName.toLowerCase();
        });

        if (!selected) return;

        botReply(
            selected.name + " costs " + selected.price + ".\n\n" +
            selected.details.join("\n") +
            "\n\nWould you like to enquire about this package?",
            [
                {
                    label: "Enquire about " + selected.name,
                    action: "enquire_" + selected.name.toLowerCase()
                },
                { label: "Compare all packages", action: "packages" },
                { label: "Ask something else", action: "services" }
            ]
        );
    }

    function packageEnquiry(packageName) {

        const selected = PACE.packages.find(function (item) {
            return item.name.toLowerCase() === packageName.toLowerCase();
        });

        if (!selected) return;

        makeWhatsAppMessage(
            "Hello LINUS® Photography! I would like to enquire about the " +
            selected.name + " package (" + selected.price + "). " +
            "Please share more details about booking."
        );
    }

    /* ================= SERVICES ================= */

    function showServices() {

        botReply(
            "We photograph movement, people and sporting moments. What would you like to explore?",
            PACE.services.map(function (service) {
                return {
                    label: service.name,
                    action: "service_" + service.name
                };
            }).concat([
                { label: "Something different / custom shoot", action: "custom" }
            ])
        );
    }

    function showService(serviceName) {

        const service = PACE.services.find(function (item) {
            return item.name === serviceName;
        });

        if (!service) return;

        botReply(
            service.description +
            "\n\nWe welcome individual clients, athletes, teams, groups and event organisers. You can also discuss a personalised shoot with us.",
            [
                { label: "Explore other services", action: "services" },
                { label: "View packages", action: "packages" },
                { label: "Enquire about this service", action: "booking" },
                { label: "See photography examples", action: "examples" }
            ]
        );
    }

    /* ================= PORTFOLIO EXAMPLES ================= */

    function showExamples() {

        const exampleMessage =
            "Here are a few places to explore the LINUS® Photography work. These sample files use your existing website image and video folder.";

        botReply(
            exampleMessage,
            [
                { label: "Explore photography services", action: "services" },
                { label: "View packages", action: "packages" },
                { label: "Make an enquiry", action: "booking" }
            ],
            function () {

                const gallery = document.createElement("div");
                gallery.className = "pace-example-gallery";

                gallery.style.display = "grid";
                gallery.style.gridTemplateColumns = "1fr 1fr";
                gallery.style.gap = "8px";
                gallery.style.paddingLeft = "36px";

                const imageOne = document.createElement("img");
                imageOne.src = "images/PIC1.jpeg";
                imageOne.alt = "LINUS Photography sample";
                imageOne.loading = "lazy";
                imageOne.style.width = "100%";
                imageOne.style.height = "110px";
                imageOne.style.objectFit = "cover";

                const imageTwo = document.createElement("img");
                imageTwo.src = "images/start.jpg";
                imageTwo.alt = "LINUS Photography sample";
                imageTwo.loading = "lazy";
                imageTwo.style.width = "100%";
                imageTwo.style.height = "110px";
                imageTwo.style.objectFit = "cover";

                gallery.appendChild(imageOne);
                gallery.appendChild(imageTwo);

                messages.appendChild(gallery);
                scrollToBottom();
            }
        );
    }

    /* ================= CUSTOM SHOOT ENQUIRY ================= */

    function startCustomShoot() {

        customDetails = {};
        customStep = 1;

        botReply(
            "Let's put together your custom photography enquiry. What kind of shoot do you have in mind?"
        );
    }

    function continueCustomShoot(answer) {

        if (customStep === 1) {

            customDetails.type = answer;
            customStep = 2;

            botReply(
                "Where would you like the shoot to take place? We're based in Eldoret and Iten, Kenya, but we're open to discussing other locations."
            );

        } else if (customStep === 2) {

            customDetails.location = answer;
            customStep = 3;

            botReply(
                "Do you have a preferred date for the shoot?"
            );

        } else if (customStep === 3) {

            customDetails.date = answer;
            customStep = 4;

            botReply(
                "Do you have any special ideas or requirements for your session? You can also type 'No special requests'."
            );

        } else if (customStep === 4) {

            customDetails.requests = answer;
            customStep = 0;

            botReply(
                "Your custom shoot enquiry is ready. I'll prepare a WhatsApp message with your details.",
                [
                    { label: "Send enquiry on WhatsApp", action: "send_custom" },
                    { label: "Start again", action: "custom" }
                ]
            );
        }
    }

    function sendCustomEnquiry() {

        const message =
            "Hello LINUS® Photography!\n\n" +
            "I would like to discuss a custom photography session.\n\n" +
            "Shoot type: " + customDetails.type + "\n" +
            "Location: " + customDetails.location + "\n" +
            "Preferred date: " + customDetails.date + "\n" +
            "Special requests: " + customDetails.requests + "\n\n" +
            "Please let me know how we can arrange this session.";

        makeWhatsAppMessage(message);
    }

    /* ================= BOOKING ENQUIRY ================= */

    function startBooking() {

        bookingDetails = {};
        bookingStep = 1;

        botReply(
            "Let's start your photography enquiry. What type of shoot would you like to book?"
        );
    }

    function continueBooking(answer) {

        if (bookingStep === 1) {

            bookingDetails.type = answer;
            bookingStep = 2;

            botReply("Where would you like the shoot to take place?");

        } else if (bookingStep === 2) {

            bookingDetails.location = answer;
            bookingStep = 3;

            botReply("What date would you prefer?");

        } else if (bookingStep === 3) {

            bookingDetails.date = answer;
            bookingStep = 0;

            botReply(
                "Great! Your booking enquiry is ready. The photographer will need to confirm availability and arrangements.",
                [
                    { label: "Continue to WhatsApp", action: "send_booking" },
                    { label: "Start a new enquiry", action: "booking" }
                ]
            );
        }
    }

    function sendBookingEnquiry() {

        const message =
            "Hello LINUS® Photography!\n\n" +
            "I would like to enquire about booking a photography session.\n\n" +
            "Shoot type: " + bookingDetails.type + "\n" +
            "Location: " + bookingDetails.location + "\n" +
            "Preferred date: " + bookingDetails.date + "\n\n" +
            "Please confirm your availability and share the next steps.";

        makeWhatsAppMessage(message);
    }

    /* ================= AVAILABILITY ================= */

    function startAvailability() {

        bookingDetails = {};
        bookingStep = 1;

        botReply(
            "I can help prepare an availability enquiry. What date are you hoping to have your shoot?"
        );
    }

    function continueAvailability(answer) {

        if (bookingStep === 1) {

            bookingDetails.date = answer;
            bookingStep = 2;

            botReply("Which location are you considering for your shoot?");

        } else if (bookingStep === 2) {

            bookingDetails.location = answer;
            bookingStep = 0;

            botReply(
                "Thanks! I can't access the photographer's live calendar, so the date isn't confirmed yet. I'll prepare a WhatsApp message for you.",
                [
                    { label: "Ask about availability", action: "send_availability" },
                    { label: "Ask something else", action: "services" }
                ]
            );
        }
    }

    function sendAvailabilityEnquiry() {

        const message =
            "Hello LINUS® Photography!\n\n" +
            "I would like to check availability for a photography session.\n\n" +
            "Preferred date: " + bookingDetails.date + "\n" +
            "Location: " + bookingDetails.location + "\n\n" +
            "Could you please confirm whether this date is available?";

        makeWhatsAppMessage(message);
    }

    /* ================= ACTION ROUTER ================= */

    function handleAction(action) {

        clearContactOptions();

        if (action === "services") {
            showServices();
        }

        else if (action === "packages") {
            showPackages();
        }

        else if (action === "booking") {
            startBooking();
        }

        else if (action === "availability") {
            startAvailability();
        }

        else if (action === "custom") {
            startCustomShoot();
        }

        else if (action === "contact") {
            showContactOptions();
        }

        else if (action === "examples") {
            showExamples();
        }

        else if (action === "basic") {
            choosePackage("Basic");
        }

        else if (action === "standard") {
            choosePackage("Standard");
        }

        else if (action === "premium") {
            choosePackage("Premium");
        }

        else if (action.startsWith("service_")) {
            showService(action.replace("service_", ""));
        }

        else if (action.startsWith("enquire_")) {
            packageEnquiry(action.replace("enquire_", ""));
        }

        else if (action === "send_custom") {
            sendCustomEnquiry();
        }

        else if (action === "send_booking") {
            sendBookingEnquiry();
        }

        else if (action === "send_availability") {
            sendAvailabilityEnquiry();
        }

        else if (action === "newchat") {
            resetConversation();
        }
    }

    /* ================= FREE-TEXT QUESTIONS ================= */

    function handleUserMessage(rawText) {

        const text = rawText.trim();

        if (!text || isTyping) return;

        userReply(text);

        const lower = text.toLowerCase();

        /* Continue guided enquiries first */

        if (customStep > 0) {
            continueCustomShoot(text);
            return;
        }

        if (bookingStep > 0) {
            continueBooking(text);
            return;
        }

        /* Simple conversation recognition */

        if (
            lower.includes("price") ||
            lower.includes("package") ||
            lower.includes("cost") ||
            lower.includes("how much")
        ) {
            showPackages();
        }

        else if (
            lower.includes("book") ||
            lower.includes("booking") ||
            lower.includes("session")
        ) {
            startBooking();
        }

        else if (
            lower.includes("available") ||
            lower.includes("availability") ||
            lower.includes("free date")
        ) {
            startAvailability();
        }

        else if (
            lower.includes("custom") ||
            lower.includes("personalised") ||
            lower.includes("personalized")
        ) {
            startCustomShoot();
        }

        else if (
            lower.includes("service") ||
            lower.includes("photography") ||
            lower.includes("what do you do")
        ) {
            showServices();
        }

        else if (
            lower.includes("example") ||
            lower.includes("portfolio") ||
            lower.includes("photos") ||
            lower.includes("pictures") ||
            lower.includes("videos")
        ) {
            showExamples();
        }

        else if (
            lower.includes("whatsapp") ||
            lower.includes("instagram") ||
            lower.includes("contact") ||
            lower.includes("photographer") ||
            lower.includes("human") ||
            lower.includes("speak to")
        ) {
            showContactOptions();
        }

        else if (
            lower.includes("hello") ||
            lower.includes("hi") ||
            lower.includes("hey")
        ) {
            botReply(
                "Hey! Good to have you here. What would you like to explore?",
                [
                    { label: "Photography services", action: "services" },
                    { label: "Packages and prices", action: "packages" },
                    { label: "Book a shoot", action: "booking" },
                    { label: "Contact the photographer", action: "contact" }
                ]
            );
        }

        else if (
            lower.includes("where") ||
            lower.includes("location") ||
            lower.includes("based")
        ) {
            botReply(
                "We're based in Eldoret and Iten, Kenya. We're also open to discussing sessions in other locations. Tell us where you'd like your shoot, and we'll work something out.",
                [
                    { label: "Discuss a location", action: "custom" },
                    { label: "Make a booking enquiry", action: "booking" }
                ]
            );
        }

        else if (
            lower.includes("thank") ||
            lower.includes("thanks")
        ) {
            botReply(
                "You're very welcome! Let us know if there's anything else you'd like to explore.",
                [
                    { label: "Explore services", action: "services" },
                    { label: "View packages", action: "packages" },
                    { label: "Contact us", action: "contact" }
                ]
            );
        }

        else {

            botReply(
                "Thanks for your question. I don't have enough information to answer that confidently, and I don't want to give you the wrong details. I can still help you explore our services or prepare a message for the photographer.",
                [
                    { label: "Explore services", action: "services" },
                    { label: "View packages", action: "packages" },
                    { label: "Ask the photographer", action: "contact" }
                ]
            );
        }
    }

    /* ================= FORM SUBMISSION ================= */

    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const text = input.value.trim();

        if (!text || isTyping) return;

        input.value = "";

        handleUserMessage(text);
    });

    /* ================= WELCOME BUTTONS ================= */

    welcomeChoices.addEventListener("click", function (event) {

        const button = event.target.closest("[data-action]");

        if (!button) return;

        const action = button.dataset.action;

        welcomeChoices.remove();

        handleAction(action);
    });

    /* ================= END CONVERSATION ================= */

    // Closing the chat resets it. Minimising preserves it.
    // No conversation details are saved between visits.

    /* ================= INITIAL STATE ================= */

    chat.classList.remove("active");
    chat.setAttribute("aria-hidden", "true");

    launcher.setAttribute("aria-expanded", "false");

    console.log("PACE BOT is ready.");

});
