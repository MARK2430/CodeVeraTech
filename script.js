
// ============================================================
// CODEVERATECH JAVASCRIPT
// ============================================================


// ============================================================
// SUPABASE
// ============================================================

const SUPABASE_URL =
    "https://ugfrwkctmulxxprcuioz.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_egKPDjgXJIAxsTY5Qe_f9Q_L2nZ-vJ5";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


// ============================================================
// GLOBAL COURSE STORAGE
// ============================================================

let allCourses = [];


// ============================================================
// DOM READY
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeNavigation();

        initializeLanguageSelector();

        initializeBackToTop();

        initializeContactForm();

        initializeCourseRegistration();

        initializeCourseButtonEvents();

        loadCourses();

        loadNews();

        setCurrentYear();

        initializeScrollAnimation();

    }
);


// ============================================================
// NAVIGATION
// ============================================================

function initializeNavigation() {

    const header =
        document.getElementById("header");

    const nav =
        document.getElementById("nav");

    const menuToggle =
        document.getElementById("menu-toggle");

    const navLinks =
        document.querySelectorAll(".nav-link");


    // --------------------------------------------------------
    // HEADER SCROLL
    // --------------------------------------------------------

    window.addEventListener(
        "scroll",
        function () {

            if (!header) {
                return;
            }

            if (window.scrollY > 50) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );

            }

        }
    );


    // --------------------------------------------------------
    // MOBILE MENU
    // --------------------------------------------------------

    if (menuToggle && nav) {

        menuToggle.addEventListener(
            "click",
            function () {

                nav.classList.toggle(
                    "open"
                );

            }
        );

    }


    // --------------------------------------------------------
    // CLOSE MOBILE MENU
    // --------------------------------------------------------

    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (nav) {

                        nav.classList.remove(
                            "active"
                        );

                    }

                }
            );

        }
    );


    // --------------------------------------------------------
    // ACTIVE NAVIGATION
    // --------------------------------------------------------

    window.addEventListener(
        "scroll",
        function () {

            const sections =
                document.querySelectorAll(
                    "section[id]"
                );

            let currentSection = "";


            sections.forEach(
                function (section) {

                    const sectionTop =
                        section.offsetTop - 150;

                    const sectionHeight =
                        section.offsetHeight;

                    const sectionId =
                        section.getAttribute(
                            "id"
                        );


                    if (
                        window.scrollY >= sectionTop &&
                        window.scrollY <
                            sectionTop + sectionHeight
                    ) {

                        currentSection =
                            sectionId;

                    }

                }
            );


            navLinks.forEach(
                function (link) {

                    link.classList.remove(
                        "active"
                    );


                    const href =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        href ===
                        "#" + currentSection
                    ) {

                        link.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );

}


// ============================================================
// LANGUAGE SELECTOR
// ============================================================

function initializeLanguageSelector() {

    const button = document.getElementById("language-btn");
    const menu = document.getElementById("language-menu");
    const currentLanguage = document.getElementById("current-language");
    const options = document.querySelectorAll(".language-option");

    if (!button || !menu) {
        return;
    }

    const supportedLanguages = [
        "en", "fr", "es", "pt", "ar", "zh-CN", "de",
        "sw", "ha", "yo", "ja", "hi", "it", "ru"
    ];

    // Load Google's translation widget once. Krio is listed in the menu,
    // but is not included because Google Translate does not currently
    // provide a reliable Krio translation option.
    window.googleTranslateElementInit = function () {
        if (
            window.google &&
            window.google.translate &&
            window.google.translate.TranslateElement
        ) {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: supportedLanguages.join(","),
                    autoDisplay: false
                },
                "google_translate_element"
            );
        }
    };

    if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.onerror = function () {
            console.warn("The translation service could not be loaded.");
        };
        document.head.appendChild(script);
    }

    function openMenu() {
        menu.hidden = false;
        button.setAttribute("aria-expanded", "true");
    }

    function closeMenu() {
        menu.hidden = true;
        button.setAttribute("aria-expanded", "false");
    }

    button.addEventListener("click", function (event) {
        event.stopPropagation();
        if (menu.hidden) {
            openMenu();
        } else {
            closeMenu();
        }
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest(".language-selector")) {
            closeMenu();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    function applyLanguage(languageCode, label) {
        if (languageCode === "kri") {
            window.alert("Krio translation is being prepared. Please choose another language for now.");
            closeMenu();
            return;
        }

        if (!supportedLanguages.includes(languageCode)) {
            return;
        }

        currentLanguage.textContent = label;
        localStorage.setItem("codeveratech-language", languageCode);

        // Arabic reads right-to-left; restore left-to-right for other languages.
        document.documentElement.dir =
            languageCode === "ar" ? "rtl" : "ltr";

        closeMenu();

        // The Google Translate dropdown is created asynchronously.
        let attempts = 0;
        const selectLanguage = window.setInterval(function () {
            const translateSelect = document.querySelector(".goog-te-combo");
            attempts += 1;

            if (translateSelect) {
                translateSelect.value = languageCode;
                translateSelect.dispatchEvent(new Event("change"));
                window.clearInterval(selectLanguage);
            } else if (attempts >= 30) {
                window.clearInterval(selectLanguage);
                if (languageCode !== "en") {
                    window.alert("The translation service is still loading. Please try again in a moment.");
                }
            }
        }, 300);
    }

    options.forEach(function (option) {
        option.addEventListener("click", function () {
            applyLanguage(
                option.dataset.language,
                option.dataset.label
            );
        });
    });

    // Restore the visitor's previous language choice.
    const savedLanguage = localStorage.getItem("codeveratech-language");
    if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
        const savedOption = document.querySelector(
            '.language-option[data-language="' + savedLanguage + '"]'
        );
        if (savedOption) {
            currentLanguage.textContent = savedOption.dataset.label;
            document.documentElement.dir =
                savedLanguage === "ar" ? "rtl" : "ltr";
            // Allow the translation widget time to initialize.
            window.setTimeout(function () {
                const translateSelect = document.querySelector(".goog-te-combo");
                if (translateSelect) {
                    translateSelect.value = savedLanguage;
                    translateSelect.dispatchEvent(new Event("change"));
                }
            }, 1800);
        }
    }
}


// ============================================================
// BACK TO TOP
// ============================================================

function initializeBackToTop() {

    const backToTop =
        document.getElementById(
            "back-to-top"
        );


    if (!backToTop) {
        return;
    }


    window.addEventListener(
        "scroll",
        function () {

            if (window.scrollY > 500) {

                backToTop.classList.add(
                    "show"
                );

            } else {

                backToTop.classList.remove(
                    "show"
                );

            }

        }
    );


    backToTop.addEventListener(
        "click",
        function () {

            window.scrollTo({

                top: 0,

                behavior: "smooth"

            });

        }
    );

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


// ============================================================
// COURSE HELPERS
// ============================================================

function getCourseTitle(course) {

    return (

        course.title ||

        course.name ||

        course.course_name ||

        "Untitled Course"

    );

}


function getCourseDescription(course) {

    return (

        course.description ||

        course.short_description ||

        "Practical technology training from CodeVeraTech Academy."

    );

}


function getCourseDuration(course) {

    return (

        course.duration ||

        course.duration_weeks ||

        "Flexible"

    );

}


function getCoursePrice(course) {

    if (

        course.price !== null &&

        course.price !== undefined &&

        course.price !== ""

    ) {

        return course.price;

    }


    return "Contact us";

}


function getCourseCurrency(course) {

    return course.currency || "SLE";

}


function getCourseImage(course) {

    return (

        course.image_url ||

        course.image ||

        course.thumbnail ||

        ""

    );

}


function getCourseCategory(course) {

    return course.category || "Technology";

}


function getCourseInstructor(course) {

    return (
        course.instructor ||
        "CodeVeraTech Academy"
    );

}


function getCourseLevel(course) {

    return (
        course.level ||
        "All Levels"
    );

}


// ============================================================
// LOAD FREE COURSE PREVIEW
// ============================================================

async function loadFreeCoursePreview(courseId) {

    if (!courseId) {

        return [];

    }


    try {

        const {
            data,
            error
        } = await supabaseClient

            .from("course_lessons")

            .select("*")

            .eq(
                "course_id",
                courseId
            )

            .eq(
                "is_free",
                true
            )

            .order(
                "lesson_order",
                {
                    ascending: true
                }
            );


        if (error) {

            console.error(
                "Error loading course preview:",
                error
            );

            return [];

        }


        return data || [];

    } catch (error) {

        console.error(
            "Unexpected preview error:",
            error
        );

        return [];

    }

}


// ============================================================
// CREATE COURSE DETAILS MODAL
// ============================================================

function createCourseDetailsModal() {

    let modal =
        document.getElementById(
            "course-details-modal"
        );


    if (modal) {

        return modal;

    }


    modal =
        document.createElement(
            "div"
        );


    modal.id =
        "course-details-modal";


    modal.className =
        "course-details-modal";


    // --------------------------------------------------------
    // INLINE MODAL STYLING
    // --------------------------------------------------------

    modal.style.position = "fixed";

    modal.style.top = "0";

    modal.style.left = "0";

    modal.style.width = "100%";

    modal.style.height = "100%";

    modal.style.backgroundColor =
        "rgba(0,0,0,0.75)";

    modal.style.zIndex =
        "99999";

    modal.style.display =
        "flex";

    modal.style.alignItems =
        "center";

    modal.style.justifyContent =
        "center";

    modal.style.padding =
        "20px";

    modal.style.boxSizing =
        "border-box";

    modal.style.visibility =
        "hidden";

    modal.style.opacity =
        "0";

    modal.style.pointerEvents =
        "none";

    modal.style.transition =
        "opacity 0.25s ease";


    // --------------------------------------------------------
    // MODAL HTML
    // --------------------------------------------------------

    modal.innerHTML = `

        <div
            class="course-details-overlay"
            style="
                position:absolute;
                inset:0;
            ">
        </div>


        <div
            class="course-details-box"
            style="
                position:relative;
                z-index:2;
                background:#ffffff;
                width:100%;
                max-width:850px;
                max-height:90vh;
                overflow-y:auto;
                border-radius:16px;
                padding:30px;
                box-sizing:border-box;
                box-shadow:0 20px 60px rgba(0,0,0,0.3);
            ">


            <button
                type="button"
                class="course-details-close"
                aria-label="Close"
                style="
                    position:absolute;
                    top:15px;
                    right:15px;
                    width:40px;
                    height:40px;
                    border:none;
                    border-radius:50%;
                    cursor:pointer;
                    font-size:20px;
                    z-index:5;
                ">

                <i class="fa-solid fa-xmark"></i>

            </button>


            <div
                id="course-details-content"
                class="course-details-content">

            </div>


        </div>

    `;


    document.body.appendChild(
        modal
    );


    // --------------------------------------------------------
    // OVERLAY CLOSE
    // --------------------------------------------------------

    const overlay =
        modal.querySelector(
            ".course-details-overlay"
        );


    if (overlay) {

        overlay.addEventListener(
            "click",
            closeCourseDetails
        );

    }


    // --------------------------------------------------------
    // CLOSE BUTTON
    // --------------------------------------------------------

    const closeButton =
        modal.querySelector(
            ".course-details-close"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeCourseDetails
        );

    }


    // --------------------------------------------------------
    // ESCAPE KEY
    // --------------------------------------------------------

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "active"
                )
            ) {

                closeCourseDetails();

            }

        }
    );


    return modal;

}


// ============================================================
// OPEN COURSE DETAILS
// ============================================================

async function openCourseDetails(course) {

    if (!course) {

        console.error(
            "No course was supplied."
        );

        return;

    }


    console.log(
        "Opening course:",
        getCourseTitle(course)
    );


    const modal =
        createCourseDetailsModal();


    const content =
        modal.querySelector(
            "#course-details-content"
        );


    if (!content) {

        console.error(
            "Course details content container was not found."
        );

        return;

    }


    const title =
        getCourseTitle(course);


    const description =
        getCourseDescription(course);


    const duration =
        getCourseDuration(course);


    const price =
        getCoursePrice(course);


    const currency =
        getCourseCurrency(course);


    const image =
        getCourseImage(course);


    const category =
        getCourseCategory(course);


    const instructor =
        getCourseInstructor(course);


    const level =
        getCourseLevel(course);


    // --------------------------------------------------------
    // LOADING
    // --------------------------------------------------------

    content.innerHTML = `

        <div
            style="
                text-align:center;
                padding:50px 20px;
                color:#333;
            ">

            <i
                class="fa-solid fa-spinner fa-spin"
                style="
                    font-size:35px;
                    margin-bottom:15px;
                ">
            </i>

            <p>
                Loading course details...
            </p>

        </div>

    `;


    // --------------------------------------------------------
    // SHOW MODAL
    // --------------------------------------------------------

    modal.classList.add(
        "active"
    );

    modal.style.visibility =
        "visible";

    modal.style.opacity =
        "1";

    modal.style.pointerEvents =
        "auto";


    document.body.classList.add(
        "course-modal-open"
    );


    document.body.style.overflow =
        "hidden";


    // --------------------------------------------------------
    // LOAD FREE PREVIEW
    // --------------------------------------------------------

    const previewLessons =
        await loadFreeCoursePreview(
            course.id
        );


    // ========================================================
    // COURSE IMAGE
    // ========================================================

    let imageHTML = "";


    if (image) {

        imageHTML = `

            <div
                class="course-details-image"
                style="
                    margin-bottom:20px;
                    text-align:center;
                ">

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(title)}"
                    style="
                        max-width:100%;
                        width:100%;
                        max-height:320px;
                        object-fit:cover;
                        border-radius:12px;
                    ">

            </div>

        `;

    }


    // ========================================================
    // FREE PREVIEW
    // ========================================================

    let previewHTML = "";


    if (previewLessons.length > 0) {

        previewHTML = `

            <div
                style="
                    margin-top:30px;
                    padding-top:25px;
                    border-top:1px solid #ddd;
                ">

                <h3
                    style="
                        color:#222;
                        margin-bottom:15px;
                    ">

                    <i
                        class="fa-solid fa-unlock">
                    </i>

                    Free Preview

                </h3>


                <p
                    style="
                        color:#555;
                        margin-bottom:20px;
                    ">

                    Start learning with these
                    free introductory lessons
                    before enrolling.

                </p>


                ${previewLessons.map(
                    function (lesson) {

                        return `

                            <div
                                style="
                                    background:#f7f7f7;
                                    border-radius:10px;
                                    padding:20px;
                                    margin-bottom:15px;
                                ">

                                <h4
                                    style="
                                        color:#222;
                                        margin-bottom:10px;
                                    ">

                                    ${escapeHTML(
                                        lesson.title ||
                                        "Lesson"
                                    )}

                                </h4>


                                ${
                                    lesson.description
                                        ? `
                                            <p
                                                style="
                                                    color:#555;
                                                    margin-bottom:10px;
                                                ">

                                                ${escapeHTML(
                                                    lesson.description
                                                )}

                                            </p>
                                        `
                                        : ""
                                }


                                ${
                                    lesson.content
                                        ? `
                                            <p
                                                style="
                                                    color:#333;
                                                    line-height:1.7;
                                                    white-space:pre-line;
                                                ">

                                                ${escapeHTML(
                                                    lesson.content
                                                )}

                                            </p>
                                        `
                                        : ""
                                }


                                ${
                                    lesson.youtube_url
                                        ? `

                                            <a
                                                href="${escapeHTML(
                                                    lesson.youtube_url
                                                )}"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="btn btn-secondary"
                                                style="
                                                    display:inline-block;
                                                    margin-top:10px;
                                                ">

                                                <i
                                                    class="fa-brands fa-youtube">
                                                </i>

                                                Watch Preview

                                            </a>

                                        `
                                        : ""
                                }

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        `;

    } else {

        previewHTML = `

            <div
                style="
                    margin-top:30px;
                    padding:20px;
                    background:#f7f7f7;
                    border-radius:10px;
                ">

                <h3
                    style="
                        color:#222;
                    ">

                    <i
                        class="fa-solid fa-unlock">
                    </i>

                    Free Preview

                </h3>


                <p
                    style="
                        color:#555;
                    ">

                    A free preview for this
                    course will be available soon.

                </p>

            </div>

        `;

    }


    // ========================================================
    // SYLLABUS
    // ========================================================

    let syllabusHTML = "";


    if (
        course.syllabus &&
        String(course.syllabus).trim() !== ""
    ) {

        const syllabusItems =
            String(course.syllabus)

                .split("\n")

                .map(
                    function (item) {
                        return item.trim();
                    }
                )

                .filter(
                    function (item) {
                        return item !== "";
                    }
                );


        syllabusHTML = `

            <div
                style="
                    margin-top:30px;
                    padding-top:25px;
                    border-top:1px solid #ddd;
                ">

                <h3
                    style="
                        color:#222;
                    ">

                    <i
                        class="fa-solid fa-list-check">
                    </i>

                    Course Syllabus

                </h3>


                <div
                    style="
                        margin-top:15px;
                    ">

                    ${syllabusItems.map(
                        function (item) {

                            return `

                                <div
                                    style="
                                        display:flex;
                                        gap:10px;
                                        padding:10px 0;
                                        border-bottom:1px solid #eee;
                                        color:#333;
                                    ">

                                    <i
                                        class="fa-solid fa-circle-check"
                                        style="
                                            margin-top:4px;
                                        ">
                                    </i>


                                    <span>

                                        ${escapeHTML(
                                            item
                                        )}

                                    </span>

                                </div>

                            `;

                        }
                    ).join("")}

                </div>

            </div>

        `;

    }


    // ========================================================
    // PREMIUM CONTENT
    // ========================================================

    const premiumHTML = `

        <div
            style="
                margin-top:30px;
                padding:25px;
                background:#f1f5f9;
                border-radius:12px;
                border:1px solid #ddd;
            ">

            <h3
                style="
                    color:#222;
                ">

                <i
                    class="fa-solid fa-lock">
                </i>

                Premium Course Content

            </h3>


            <p
                style="
                    color:#555;
                    line-height:1.7;
                    margin-top:10px;
                ">

                Full lessons, detailed notes,
                exercises, practical assignments,
                projects and other premium
                learning materials are available
                after enrollment.

            </p>


            <div
                style="
                    margin-top:15px;
                    color:#555;
                ">

                <i
                    class="fa-solid fa-lock">
                </i>

                Premium lessons are locked.

            </div>

        </div>

    `;


    // ========================================================
    // YOUTUBE COURSE VIDEO
    // ========================================================

    let youtubeHTML = "";


    if (
        course.youtube_url &&
        String(course.youtube_url).trim() !== ""
    ) {

        youtubeHTML = `

            <div
                style="
                    margin-top:30px;
                    padding-top:25px;
                    border-top:1px solid #ddd;
                ">

                <h3
                    style="
                        color:#222;
                    ">

                    <i
                        class="fa-brands fa-youtube">
                    </i>

                    Course Video

                </h3>


                <a
                    href="${escapeHTML(
                        course.youtube_url
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-secondary"
                    style="
                        display:inline-block;
                        margin-top:15px;
                    ">

                    <i
                        class="fa-brands fa-youtube">
                    </i>

                    Watch on YouTube

                </a>

            </div>

        `;

    }


    // ========================================================
    // FINAL COURSE DETAILS
    // ========================================================

    content.innerHTML = `

        ${imageHTML}


        <div
            class="course-details-body">


            <span
                class="course-category"
                style="
                    display:inline-block;
                    margin-bottom:10px;
                    color:#007bff !important;
                ">

                ${escapeHTML(category)}

            </span>


            <h2
                style="
                    color:#222 !important;
                    margin-top:5px;
                    margin-bottom:15px;
                ">

                ${escapeHTML(title)}

            </h2>


            <div
                class="course-details-meta"
                style="
                    display:flex;
                    flex-wrap:wrap;
                    gap:20px;
                    margin-bottom:25px;
                    color:#333 !important;
                ">


                <span>

                    <i
                        class="fa-regular fa-clock">
                    </i>

                    ${escapeHTML(duration)}

                </span>


                <span>

                    <i
                        class="fa-solid fa-tag">
                    </i>

                    ${escapeHTML(price)}
                    ${escapeHTML(currency)}

                </span>


                <span>

                    <i
                        class="fa-solid fa-signal">
                    </i>

                    ${escapeHTML(level)}

                </span>


            </div>


            <div
                style="
                    margin-bottom:25px;
                ">

                <p
                    style="
                        color:#333 !important;
                        line-height:1.7;
                    ">

                    ${escapeHTML(description)}

                </p>

            </div>


            <div
                style="
                    display:grid;
                    grid-template-columns:
                        repeat(auto-fit,minmax(180px,1fr));
                    gap:15px;
                    margin-bottom:25px;
                ">


                <div
                    style="
                        padding:15px;
                        background:#f7f7f7;
                        border-radius:10px;
                    ">

                    <strong
                        style="
                            color:#222;
                        ">

                        Instructor

                    </strong>


                    <p
                        style="
                            color:#555;
                            margin-top:5px;
                        ">

                        ${escapeHTML(
                            instructor
                        )}

                    </p>

                </div>


                <div
                    style="
                        padding:15px;
                        background:#f7f7f7;
                        border-radius:10px;
                    ">

                    <strong
                        style="
                            color:#222;
                        ">

                        Duration

                    </strong>


                    <p
                        style="
                            color:#555;
                            margin-top:5px;
                        ">

                        ${escapeHTML(
                            duration
                        )}

                    </p>

                </div>


                <div
                    style="
                        padding:15px;
                        background:#f7f7f7;
                        border-radius:10px;
                    ">

                    <strong
                        style="
                            color:#222;
                        ">

                        Course Fee

                    </strong>


                    <p
                        style="
                            color:#555;
                            margin-top:5px;
                        ">

                        ${escapeHTML(price)}
                        ${escapeHTML(currency)}

                    </p>

                </div>


            </div>


            ${previewHTML}


            ${syllabusHTML}


            ${youtubeHTML}


            ${premiumHTML}


            <div
                class="course-details-actions"
                style="
                    margin-top:30px;
                    padding-top:25px;
                    border-top:1px solid #ddd;
                ">


                <button
                    type="button"
                    class="btn btn-primary"
                    id="course-details-register">

                    <i
                        class="fa-solid fa-user-plus">
                    </i>

                    Register for Course

                </button>


            </div>


        </div>

    `;


    // ========================================================
    // REGISTER BUTTON
    // ========================================================

    const registerButton =
        modal.querySelector(
            "#course-details-register"
        );


    if (registerButton) {

        registerButton.addEventListener(
            "click",
            function () {

                closeCourseDetails();

                openCourseRegistration(
                    course
                );

            }
        );

    }

}


// ============================================================
// CLOSE COURSE DETAILS
// ============================================================

function closeCourseDetails() {

    const modal =
        document.getElementById(
            "course-details-modal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    modal.style.visibility =
        "hidden";


    modal.style.opacity =
        "0";


    modal.style.pointerEvents =
        "none";


    document.body.classList.remove(
        "course-modal-open"
    );


    document.body.style.overflow =
        "";

}


// ============================================================
// COURSE BUTTON EVENTS
// ONE LISTENER FOR THE WHOLE COURSE AREA
// ============================================================

function initializeCourseButtonEvents() {

    const publicCourses =
        document.getElementById(
            "public-courses"
        );


    if (!publicCourses) {

        return;

    }


    publicCourses.addEventListener(
        "click",
        function (event) {


            // ------------------------------------------------
            // VIEW COURSE
            // ------------------------------------------------

            const viewButton =
                event.target.closest(
                    ".course-view-btn"
                );


            if (viewButton) {

                event.preventDefault();

                event.stopPropagation();


                const courseId =
                    viewButton.getAttribute(
                        "data-course-id"
                    );


                const course =
                    allCourses.find(
                        function (item) {

                            return String(
                                item.id
                            ) === String(
                                courseId
                            );

                        }
                    );


                if (course) {

                    openCourseDetails(
                        course
                    );

                } else {

                    console.error(
                        "Course not found:",
                        courseId
                    );

                }


                return;

            }


            // ------------------------------------------------
            // REGISTER COURSE
            // ------------------------------------------------

            const registerButton =
                event.target.closest(
                    ".course-register-btn"
                );


            if (registerButton) {

                event.preventDefault();

                event.stopPropagation();


                const courseId =
                    registerButton.getAttribute(
                        "data-course-id"
                    );


                const course =
                    allCourses.find(
                        function (item) {

                            return String(
                                item.id
                            ) === String(
                                courseId
                            );

                        }
                    );


                if (course) {

                    openCourseRegistration(
                        course
                    );

                } else {

                    console.error(
                        "Course not found:",
                        courseId
                    );

                }

            }

        }
    );

}


// ============================================================
// LOAD COURSES
// ============================================================

async function loadCourses() {

    const publicCourses =
        document.getElementById(
            "public-courses"
        );


    const registrationCourse =
        document.getElementById(
            "registration-course"
        );


    if (!publicCourses) {

        console.error(
            "Course container #public-courses was not found."
        );

        return;

    }


    try {

        const {
            data: courses,
            error
        } = await supabaseClient

            .from("courses")

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Error loading courses:",
                error
            );


            publicCourses.innerHTML = `

                <div
                    class="course-error">

                    <i
                        class="fa-solid fa-circle-exclamation">
                    </i>


                    <p>

                        Unable to load courses
                        at the moment.

                    </p>

                </div>

            `;

            return;

        }


        allCourses =
            courses || [];


        // ====================================================
        // REGISTRATION DROPDOWN
        // ====================================================

        if (registrationCourse) {

            registrationCourse.innerHTML = `

                <option value="">

                    Select a course

                </option>

            `;


            allCourses.forEach(
                function (course) {

                    const option =
                        document.createElement(
                            "option"
                        );


                    option.value =
                        course.id;


                    option.textContent =
                        getCourseTitle(
                            course
                        );


                    registrationCourse.appendChild(
                        option
                    );

                }
            );

        }


        // ====================================================
        // NO COURSES
        // ====================================================

        if (!allCourses.length) {

            publicCourses.innerHTML = `

                <div
                    class="course-empty">

                    <i
                        class="fa-solid fa-book-open">
                    </i>


                    <h3>

                        No courses available yet

                    </h3>


                    <p>

                        New courses will be
                        added soon.

                    </p>

                </div>

            `;

            return;

        }


        // ====================================================
        // DISPLAY COURSES
        // ====================================================

        publicCourses.innerHTML =
            "";


        allCourses.forEach(
            function (course) {


                const title =
                    getCourseTitle(
                        course
                    );


                const description =
                    getCourseDescription(
                        course
                    );


                const duration =
                    getCourseDuration(
                        course
                    );


                const price =
                    getCoursePrice(
                        course
                    );


                const image =
                    getCourseImage(
                        course
                    );


                const category =
                    getCourseCategory(
                        course
                    );


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "course-card";


                // ------------------------------------------------
                // IMAGE
                // ------------------------------------------------

                let imageHTML =
                    "";


                if (image) {

                    imageHTML = `

                        <div
                            class="course-image">

                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}">

                        </div>

                    `;

                } else {

                    imageHTML = `

                        <div
                            class="course-image-placeholder">

                            <i
                                class="fa-solid fa-graduation-cap">
                            </i>

                        </div>

                    `;

                }


                // ------------------------------------------------
                // CARD
                // ------------------------------------------------

                card.innerHTML = `

                    ${imageHTML}


                    <div
                        class="course-content">


                        <span
                            class="course-category">

                            ${escapeHTML(
                                category
                            )}

                        </span>


                        <h3>

                            ${escapeHTML(
                                title
                            )}

                        </h3>


                        <p>

                            ${escapeHTML(
                                description
                            )}

                        </p>


                        <div
                            class="course-meta">


                            <span>

                                <i
                                    class="fa-regular fa-clock">
                                </i>

                                ${escapeHTML(
                                    duration
                                )}

                            </span>


                            <span
                                class="course-price">

                                ${escapeHTML(
                                    price
                                )}

                            </span>


                        </div>


                        <div
                            class="course-actions">


                            <button
                                type="button"
                                class="btn btn-secondary course-view-btn"
                                data-course-id="${escapeHTML(
                                    course.id
                                )}">

                                <i
                                    class="fa-solid fa-book-open">
                                </i>

                                View Course

                            </button>


                            <button
                                type="button"
                                class="btn btn-primary course-register-btn"
                                data-course-id="${escapeHTML(
                                    course.id
                                )}">

                                <i
                                    class="fa-solid fa-user-plus">
                                </i>

                                Register

                            </button>


                        </div>


                    </div>

                `;


                publicCourses.appendChild(
                    card
                );

            }
        );


        console.log(
            "CodeVeraTech courses loaded:",
            allCourses.length
        );

    } catch (error) {

        console.error(
            "Unexpected course loading error:",
            error
        );


        publicCourses.innerHTML = `

            <div
                class="course-error">

                <i
                    class="fa-solid fa-circle-exclamation">
                </i>


                <p>

                    Something went wrong
                    while loading courses.

                </p>

            </div>

        `;

    }

}


// ============================================================
// OPEN COURSE REGISTRATION
// ============================================================

function openCourseRegistration(course) {

    const container =
        document.getElementById(
            "course-registration-container"
        );


    const registrationCourse =
        document.getElementById(
            "registration-course"
        );


    if (!container) {

        console.error(
            "Course registration container not found."
        );

        return;

    }


    container.style.display =
        "block";


    if (

        registrationCourse &&

        course &&

        course.id !== undefined &&

        course.id !== null

    ) {

        registrationCourse.value =
            course.id;

    }


    setTimeout(
        function () {

            container.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        },
        100
    );

}


// ============================================================
// COURSE REGISTRATION FORM
// ============================================================

function initializeCourseRegistration() {

    const form =
        document.getElementById(
            "course-registration-form"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const nameElement =
                document.getElementById(
                    "registration-name"
                );


            const emailElement =
                document.getElementById(
                    "registration-email"
                );


            const phoneElement =
                document.getElementById(
                    "registration-phone"
                );


            const courseElement =
                document.getElementById(
                    "registration-course"
                );


            const message =
                document.getElementById(
                    "course-registration-message"
                );


            const submitButton =
                document.getElementById(
                    "course-registration-submit"
                );


            if (
                !nameElement ||
                !emailElement ||
                !phoneElement ||
                !courseElement
            ) {

                console.error(
                    "Course registration form fields are missing."
                );

                return;

            }


            const name =
                nameElement.value.trim();


            const email =
                emailElement.value.trim();


            const phone =
                phoneElement.value.trim();


            const courseId =
                courseElement.value;


            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (
                !name ||
                !email ||
                !phone ||
                !courseId
            ) {

                if (message) {

                    message.innerHTML = `

                        <p
                            style="color:red;">

                            Please complete all
                            required fields.

                        </p>

                    `;

                }

                return;

            }


            // ------------------------------------------------
            // DISABLE BUTTON
            // ------------------------------------------------

            if (submitButton) {

                submitButton.disabled =
                    true;


                submitButton.innerHTML = `

                    <i
                        class="fa-solid fa-spinner fa-spin">
                    </i>

                    Registering...

                `;

            }


            try {

                const selectedCourse =
                    allCourses.find(
                        function (course) {

                            return String(
                                course.id
                            ) === String(
                                courseId
                            );

                        }
                    );


                const courseTitle =
                    selectedCourse

                        ? getCourseTitle(
                            selectedCourse
                        )

                        : "Selected Course";


                // ------------------------------------------------
                // INSERT REGISTRATION
                // ------------------------------------------------

                const {
                    error
                } = await supabaseClient

                    .from(
                        "course_registrations"
                    )

                    .insert([
                        {

                            full_name:
                                name,

                            email:
                                email,

                            phone:
                                phone,

                            course_id:
                                courseId

                        }
                    ]);


                if (error) {

                    console.error(
                        "Course registration error:",
                        error
                    );

                    throw error;

                }


                // ------------------------------------------------
                // SUCCESS
                // ------------------------------------------------

                if (message) {

                    message.innerHTML = `

                        <p
                            style="color:green;">

                            Registration submitted
                            successfully for

                            <strong>

                                ${escapeHTML(
                                    courseTitle
                                )}

                            </strong>.

                        </p>

                    `;

                }


                form.reset();


                // ------------------------------------------------
                // RESTORE COURSE DROPDOWN
                // ------------------------------------------------

                if (courseElement) {

                    courseElement.value =
                        "";

                }

            } catch (error) {

                console.error(
                    "Course registration error:",
                    error
                );


                if (message) {

                    message.innerHTML = `

                        <p
                            style="color:red;">

                            Registration could not
                            be submitted.
                            Please try again.

                        </p>

                    `;

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;


                    submitButton.innerHTML = `

                        <i
                            class="fa-solid fa-user-plus">
                        </i>

                        Register for Course

                    `;

                }

            }

        }
    );

}


// ============================================================
// CONTACT FORM
// ============================================================

function initializeContactForm() {

    const form =
        document.getElementById(
            "contact-form"
        );


    if (!form) {

        return;

    }


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const nameElement =
                document.getElementById(
                    "name"
                );


            const phoneElement =
                document.getElementById(
                    "phone"
                );


            const emailElement =
                document.getElementById(
                    "email"
                );


            const organizationElement =
                document.getElementById(
                    "organization"
                );


            const serviceElement =
                document.getElementById(
                    "service"
                );


            const messageElement =
                document.getElementById(
                    "message"
                );


            const formMessage =
                document.getElementById(
                    "form-message"
                );


            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            if (
                !nameElement ||
                !phoneElement ||
                !emailElement ||
                !serviceElement ||
                !messageElement
            ) {

                console.error(
                    "Contact form fields are missing."
                );

                return;

            }


            const name =
                nameElement.value.trim();


            const phone =
                phoneElement.value.trim();


            const email =
                emailElement.value.trim();


            const organization =
                organizationElement
                    ? organizationElement.value.trim()
                    : "";


            const service =
                serviceElement.value;


            const message =
                messageElement.value.trim();


            // ------------------------------------------------
            // VALIDATION
            // ------------------------------------------------

            if (
                !name ||
                !phone ||
                !email ||
                !service ||
                !message
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Please complete all required fields.";

                    formMessage.style.color =
                        "red";

                }

                return;

            }


            // ------------------------------------------------
            // DISABLE BUTTON
            // ------------------------------------------------

            if (submitButton) {

                submitButton.disabled =
                    true;


                submitButton.innerHTML = `

                    <i
                        class="fa-solid fa-spinner fa-spin">
                    </i>

                    Sending...

                `;

            }


            try {

                // ------------------------------------------------
                // INSERT CONTACT MESSAGE
                // ------------------------------------------------

                const {
                    error
                } = await supabaseClient

                    .from(
                        "contact_messages"
                    )

                    .insert([
                        {

                            name:
                                name,

                            phone:
                                phone,

                            email:
                                email,

                            organization:
                                organization,

                            service:
                                service,

                            message:
                                message

                        }
                    ]);


                if (error) {

                    console.error(
                        "Contact form error:",
                        error
                    );

                    throw error;

                }


                // ------------------------------------------------
                // SUCCESS
                // ------------------------------------------------

                if (formMessage) {

                    formMessage.textContent =
                        "Your enquiry was received successfully. We will get back to you soon.";

                    formMessage.style.color =
                        "green";

                }


                form.reset();

            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                if (formMessage) {

                    formMessage.textContent =
                        "Unable to send your enquiry. Please try again.";

                    formMessage.style.color =
                        "red";

                }

            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;


                    submitButton.innerHTML = `

                        <i
                            class="fa-solid fa-paper-plane">
                        </i>

                        Submit Inquiry

                    `;

                }

            }

        }
    );

}


// ============================================================
// LOAD NEWS
// ============================================================

async function loadNews() {

    const publicNews =
        document.getElementById(
            "public-news"
        );


    if (!publicNews) {

        return;

    }


    try {

        const {
            data: news,
            error
        } = await supabaseClient

            .from("news")

            .select("*")

            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {

            console.error(
                "Error loading news:",
                error
            );


            publicNews.innerHTML = `

                <div
                    class="news-error">

                    Unable to load news
                    at the moment.

                </div>

            `;

            return;

        }


        // --------------------------------------------------------
        // NO NEWS
        // --------------------------------------------------------

        if (
            !news ||
            !news.length
        ) {

            publicNews.innerHTML = `

                <div
                    class="news-empty">

                    <i
                        class="fa-regular fa-newspaper">
                    </i>


                    <h3>

                        No news available yet

                    </h3>

                </div>

            `;

            return;

        }


        publicNews.innerHTML =
            "";


        // --------------------------------------------------------
        // DISPLAY NEWS
        // --------------------------------------------------------

        news.forEach(
            function (item) {

                const title =
                    item.title ||
                    "CodeVeraTech Update";


                const content =
                    item.content ||
                    item.description ||
                    "";


                const category =
                    item.category ||
                    "News";


                const image =
                    item.image_url ||
                    item.image ||
                    "";


                const article =
                    document.createElement(
                        "article"
                    );


                article.className =
                    "news-card";


                let imageHTML =
                    "";


                if (image) {

                    imageHTML = `

                        <div
                            class="news-image">

                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}">

                        </div>

                    `;

                }


                article.innerHTML = `

                    ${imageHTML}


                    <div
                        class="news-content">


                        <span
                            class="news-category">

                            ${escapeHTML(
                                category
                            )}

                        </span>


                        <h3>

                            ${escapeHTML(
                                title
                            )}

                        </h3>


                        <p>

                            ${escapeHTML(
                                content
                            )}

                        </p>


                    </div>

                `;


                publicNews.appendChild(
                    article
                );

            }
        );

    } catch (error) {

        console.error(
            "Unexpected news error:",
            error
        );


        publicNews.innerHTML = `

            <div
                class="news-error">

                Unable to load news
                at the moment.

            </div>

        `;

    }

}


// ============================================================
// CURRENT YEAR
// ============================================================

function setCurrentYear() {

    const yearElements =
        document.querySelectorAll(
            "#current-year, .current-year"
        );


    yearElements.forEach(
        function (element) {

            element.textContent =
                new Date().getFullYear();

        }
    );

}


// ============================================================
// SCROLL ANIMATION
// ============================================================

function initializeScrollAnimation() {

    if (
        !("IntersectionObserver" in window)
    ) {

        return;

    }


    const observer =
        new IntersectionObserver(

            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },

            {
                threshold: 0.1
            }

        );


    const animatedElements =
        document.querySelectorAll(
            ".service-card, .project-card, .about-card, .process-item"
        );


    animatedElements.forEach(
        function (element) {

            observer.observe(
                element
            );

        }
    );

}


// ============================================================
// END OF CODEVERATECH JAVASCRIPT
// ============================================================