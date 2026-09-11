
/* =========================================================
   CODEVERA TECHNOLOGIES
   MAIN JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("CodeVera JavaScript loaded.");

    /* =====================================================
       SUPABASE
       ===================================================== */

    const SUPABASE_URL =
        "https://ugfrwkctmulxxprcuioz.supabase.co";

    const SUPABASE_ANON_KEY =
        "sb_publishable_egKPDjgXJIAxsTY5Qe_f9Q_L2nZ-vJ5";

    let codeveraSupabase = null;

    if (window.supabase) {

        try {

            codeveraSupabase =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_ANON_KEY
                );

            console.log("Supabase initialized successfully.");

        } catch (error) {

            console.error(
                "Supabase initialization error:",
                error
            );

        }

    } else {

        console.error(
            "Supabase library was not loaded."
        );

    }


    /* =====================================================
       HEADER
       ===================================================== */

    const header =
        document.getElementById("header");

    if (header) {

        window.addEventListener("scroll", function () {

            header.classList.toggle(
                "scrolled",
                window.scrollY > 40
            );

        });

    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    const menuToggle =
        document.getElementById("menu-toggle");

    const nav =
        document.getElementById("nav");

    if (menuToggle && nav) {

        menuToggle.addEventListener("click", function () {

            nav.classList.toggle("open");

            const icon =
                menuToggle.querySelector("i");

            if (icon) {

                if (nav.classList.contains("open")) {

                    icon.classList.remove("fa-bars");
                    icon.classList.add("fa-xmark");

                } else {

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            }

        });

    }


    /* =====================================================
       NAVIGATION LINKS
       ===================================================== */

    const navLinks =
        document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (nav) {
                nav.classList.remove("open");
            }

            if (menuToggle) {

                const icon =
                    menuToggle.querySelector("i");

                if (icon) {

                    icon.classList.remove("fa-xmark");
                    icon.classList.add("fa-bars");

                }

            }

        });

    });


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const sections =
        document.querySelectorAll("section[id]");

    window.addEventListener("scroll", function () {

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY <
                sectionTop + sectionHeight
            ) {

                currentSection =
                    section.id;

            }

        });

        navLinks.forEach(function (link) {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                "#" + currentSection
            ) {

                link.classList.add("active");

            }

        });

    });


    /* =====================================================
       BACK TO TOP
       ===================================================== */

    const backToTop =
        document.getElementById("back-to-top");

    if (backToTop) {

        window.addEventListener("scroll", function () {

            backToTop.classList.toggle(
                "show",
                window.scrollY > 500
            );

        });

        backToTop.addEventListener("click", function () {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });

    }


    /* =====================================================
       HELPERS
       ===================================================== */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


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
            course.details ||
            course.summary ||
            "Practical technology training designed to build real-world digital skills."
        );

    }


    function getCourseDuration(course) {

        return (
            course.duration ||
            course.course_duration ||
            "Flexible"
        );

    }


    function getCoursePrice(course) {

        if (
            course.price !== null &&
            course.price !== undefined &&
            course.price !== ""
        ) {

            return "Le " + course.price;

        }

        if (
            course.amount !== null &&
            course.amount !== undefined &&
            course.amount !== ""
        ) {

            return "Le " + course.amount;

        }

        return "Contact us";

    }


    function getCourseImage(course) {

        return (
            course.image_url ||
            course.image ||
            course.thumbnail ||
            ""
        );

    }


    /* =====================================================
       COURSE ELEMENTS
       ===================================================== */

    const publicCourses =
        document.getElementById("public-courses");

    const registrationContainer =
        document.getElementById(
            "course-registration-container"
        );

    const registrationForm =
        document.getElementById(
            "course-registration-form"
        );

    const registrationName =
        document.getElementById(
            "registration-name"
        );

    const registrationEmail =
        document.getElementById(
            "registration-email"
        );

    const registrationPhone =
        document.getElementById(
            "registration-phone"
        );

    const registrationCourse =
        document.getElementById(
            "registration-course"
        );

    const registrationMessage =
        document.getElementById(
            "course-registration-message"
        );

    const registrationSubmit =
        document.getElementById(
            "course-registration-submit"
        );


    /* =====================================================
       CONTACT ELEMENTS
       ===================================================== */

    const contactForm =
        document.getElementById("contact-form");

    const formMessage =
        document.getElementById("form-message");


    /* =====================================================
       LOAD COURSES
       ===================================================== */

    async function loadCourses() {

        if (!publicCourses) {

            console.error(
                "ERROR: #public-courses was not found."
            );

            return;

        }

        if (!codeveraSupabase) {

            publicCourses.innerHTML = `
                <div class="course-loading">
                    Course system is unavailable.
                </div>
            `;

            return;

        }

        publicCourses.innerHTML = `
            <div class="course-loading">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Loading courses...
            </div>
        `;


        try {

            const result =
                await codeveraSupabase
                    .from("courses")
                    .select("*");


            const data =
                result.data;

            const error =
                result.error;


            if (error) {

                console.error(
                    "COURSES DATABASE ERROR:",
                    error
                );

                publicCourses.innerHTML = `
                    <div class="course-loading">
                        Unable to load courses right now.
                    </div>
                `;

                return;

            }


            console.log(
                "COURSES FROM SUPABASE:",
                data
            );


            let courses =
                Array.isArray(data)
                    ? data
                    : [];


            /*
             * Only remove courses when is_active
             * actually exists and is false.
             */

            courses =
                courses.filter(function (course) {

                    if (
                        Object.prototype.hasOwnProperty.call(
                            course,
                            "is_active"
                        )
                    ) {

                        return course.is_active !== false;

                    }

                    return true;

                });


            /*
             * Sort alphabetically.
             */

            courses.sort(function (a, b) {

                return getCourseTitle(a)
                    .localeCompare(
                        getCourseTitle(b)
                    );

            });


            /* =================================================
               NO COURSES
               ================================================= */

            if (courses.length === 0) {

                publicCourses.innerHTML = `
                    <div class="course-loading">
                        No courses are available yet.
                    </div>
                `;

                if (registrationCourse) {

                    registrationCourse.innerHTML = `
                        <option value="">
                            No courses available
                        </option>
                    `;

                }

                return;

            }


            /* =================================================
               REGISTRATION DROPDOWN
               ================================================= */

            if (registrationCourse) {

                registrationCourse.innerHTML = `
                    <option value="">
                        Select a course
                    </option>
                `;

                courses.forEach(function (course) {

                    if (
                        course.id === null ||
                        course.id === undefined
                    ) {
                        return;
                    }

                    const option =
                        document.createElement("option");

                    option.value =
                        String(course.id);

                    option.textContent =
                        getCourseTitle(course);

                    registrationCourse.appendChild(
                        option
                    );

                });

            }


            /* =================================================
               DISPLAY PUBLIC COURSES
               ================================================= */

            publicCourses.innerHTML = "";


            courses.forEach(function (course) {

                const title =
                    getCourseTitle(course);

                const description =
                    getCourseDescription(course);

                const duration =
                    getCourseDuration(course);

                const price =
                    getCoursePrice(course);

                const image =
                    getCourseImage(course);

                const category =
                    course.category ||
                    "CodeVera Academy";


                const card =
                    document.createElement("article");

                card.className =
                    "course-card";


                let imageHTML = "";


                if (image) {

                    imageHTML = `
                        <div class="course-image">
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}"
                                loading="lazy"
                            >
                        </div>
                    `;

                }


                card.innerHTML = `

                    ${imageHTML}

                    <div class="course-content">

                        <div class="course-category">
                            ${escapeHTML(category)}
                        </div>

                        <h3 class="course-title">
                            ${escapeHTML(title)}
                        </h3>

                        <p class="course-description">
                            ${escapeHTML(description)}
                        </p>

                        <div class="course-meta">

                            <span class="course-duration">
                                <i class="fa-regular fa-clock"></i>
                                ${escapeHTML(duration)}
                            </span>

                            <span class="course-price">
                                ${escapeHTML(price)}
                            </span>

                        </div>

                        <button
                            type="button"
                            class="btn btn-primary course-register-btn"
                            data-course-id="${escapeHTML(course.id)}"
                        >
                            <i class="fa-solid fa-user-plus"></i>
                            Register for Course
                        </button>

                    </div>
                `;


                publicCourses.appendChild(card);

            });


            console.log(
                "COURSES DISPLAYED:",
                courses.length
            );

        } catch (error) {

            console.error(
                "COURSE LOADING ERROR:",
                error
            );

            publicCourses.innerHTML = `
                <div class="course-loading">
                    Unable to load courses right now.
                </div>
            `;

        }

    }


    /* =====================================================
       COURSE REGISTER BUTTON
       ===================================================== */

    if (publicCourses) {

        publicCourses.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".course-register-btn"
                    );

                if (!button) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();


                const courseId =
                    button.getAttribute(
                        "data-course-id"
                    );


                console.log(
                    "REGISTER COURSE:",
                    courseId
                );


                if (registrationCourse) {

                    registrationCourse.value =
                        courseId;

                }


                if (registrationMessage) {

                    registrationMessage.textContent = "";

                }


                if (registrationContainer) {

                    registrationContainer.style.display =
                        "block";


                    registrationContainer.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                }

            }
        );

    }


    /* =====================================================
       COURSE REGISTRATION
       ===================================================== */

    if (registrationForm) {

        registrationForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();
                event.stopPropagation();


                console.log(
                    "COURSE REGISTRATION STARTED"
                );


                const name =
                    registrationName
                        ? registrationName.value.trim()
                        : "";

                const email =
                    registrationEmail
                        ? registrationEmail.value.trim()
                        : "";

                const phone =
                    registrationPhone
                        ? registrationPhone.value.trim()
                        : "";

                const courseId =
                    registrationCourse
                        ? registrationCourse.value
                        : "";


                if (
                    !name ||
                    !email ||
                    !phone ||
                    !courseId
                ) {

                    if (registrationMessage) {

                        registrationMessage.textContent =
                            "Please complete all required fields.";

                        registrationMessage.style.color =
                            "#ff7272";

                    }

                    return;

                }


                if (!codeveraSupabase) {

                    if (registrationMessage) {

                        registrationMessage.textContent =
                            "Registration system is unavailable.";

                        registrationMessage.style.color =
                            "#ff7272";

                    }

                    return;

                }


                if (registrationSubmit) {

                    registrationSubmit.disabled =
                        true;

                    registrationSubmit.innerHTML =
                        '<i class="fa-solid fa-spinner fa-spin"></i> Registering...';

                }


                try {

                    const result =
                        await codeveraSupabase
                            .from("course_registrations")
                            .insert({
                                full_name: name,
                                email: email,
                                phone: phone,
                                course_id: courseId,
                                status: "pending"
                            });


                    if (result.error) {

                        console.error(
                            "REGISTRATION DATABASE ERROR:",
                            result.error
                        );

                        throw result.error;

                    }


                    console.log(
                        "COURSE REGISTRATION SAVED"
                    );


                    if (registrationMessage) {

                        registrationMessage.textContent =
                            "Your course registration was submitted successfully. CodeVera will contact you soon.";

                        registrationMessage.style.color =
                            "#00df9a";

                    }


                    registrationForm.reset();


                } catch (error) {

                    console.error(
                        "COURSE REGISTRATION ERROR:",
                        error
                    );


                    if (registrationMessage) {

                        registrationMessage.textContent =
                            error.message ||
                            "Unable to submit registration.";

                        registrationMessage.style.color =
                            "#ff7272";

                    }

                } finally {

                    if (registrationSubmit) {

                        registrationSubmit.disabled =
                            false;

                        registrationSubmit.innerHTML =
                            '<i class="fa-solid fa-user-plus"></i> Register for Course';

                    }

                }

            }
        );

    }


    /* =====================================================
       CONTACT FORM
       ===================================================== */

    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async function (event) {

                /*
                 * THIS MUST HAPPEN FIRST.
                 *
                 * The browser must NEVER perform its
                 * normal form submission.
                 */

                event.preventDefault();
                event.stopImmediatePropagation();


                console.log(
                    "CONTACT FORM SUBMISSION STARTED"
                );


                const submitButton =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );


                const name =
                    document.getElementById("name")
                        ?.value.trim() || "";


                const phone =
                    document.getElementById("phone")
                        ?.value.trim() || "";


                const email =
                    document.getElementById("email")
                        ?.value.trim() || "";


                const organization =
                    document.getElementById("organization")
                        ?.value.trim() || "";


                const subject =
                    document.getElementById("subject")
                        ?.value.trim() || "";


                const service =
                    document.getElementById("service")
                        ?.value || "";


                const message =
                    document.getElementById("message")
                        ?.value.trim() || "";


                /* =================================================
                   VALIDATION
                   ================================================= */

                if (
                    !name ||
                    !phone ||
                    !email ||
                    !subject ||
                    !service ||
                    !message
                ) {

                    if (formMessage) {

                        formMessage.textContent =
                            "Please fill in all required fields.";

                        formMessage.style.color =
                            "#ff7272";

                    }

                    return;

                }


                if (!codeveraSupabase) {

                    if (formMessage) {

                        formMessage.textContent =
                            "Contact system is unavailable. Please try again.";

                        formMessage.style.color =
                            "#ff7272";

                    }

                    return;

                }


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML =
                        '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

                }


                try {

                    /*
                     * IMPORTANT:
                     *
                     * We are NOT sending "subject"
                     * because your current contact_messages
                     * table was previously working without it.
                     */

                    const result =
                        await codeveraSupabase
                            .from("contact_messages")
                            .insert({
                                name: name,
                                phone: phone,
                                email: email,
                                organization:
                                    organization || null,
                                service:
                                    service || null,
                                message: message
                            });


                    if (result.error) {

                        console.error(
                            "CONTACT DATABASE ERROR:",
                            result.error
                        );

                        throw result.error;

                    }


                    console.log(
                        "CONTACT MESSAGE SAVED"
                    );


                    if (formMessage) {

                        formMessage.textContent =
                            "Thank you! Your inquiry has been sent successfully. CodeVera will get back to you soon.";

                        formMessage.style.color =
                            "#00df9a";

                    }


                    contactForm.reset();


                } catch (error) {

                    console.error(
                        "CONTACT FORM ERROR:",
                        error
                    );


                    if (formMessage) {

                        formMessage.textContent =
                            error.message ||
                            "Unable to submit your inquiry.";

                        formMessage.style.color =
                            "#ff7272";

                    }

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.innerHTML =
                            '<i class="fa-solid fa-paper-plane"></i> Submit Inquiry';

                    }

                }

            },
            true
        );

    } else {

        console.error(
            "ERROR: #contact-form was not found."
        );

    }


    /* =====================================================
       NEWS
       ===================================================== */

    const publicNews =
        document.getElementById("public-news");


    async function loadNews() {

        if (!publicNews) {
            return;
        }


        if (!codeveraSupabase) {

            publicNews.innerHTML = `
                <div class="news-loading">
                    Unable to load news.
                </div>
            `;

            return;

        }


        try {

            const result =
                await codeveraSupabase
                    .from("news")
                    .select("*");


            const data =
                result.data;

            const error =
                result.error;


            if (error) {

                console.error(
                    "NEWS DATABASE ERROR:",
                    error
                );

                publicNews.innerHTML = `
                    <div class="news-loading">
                        Unable to load news.
                    </div>
                `;

                return;

            }


            let news =
                Array.isArray(data)
                    ? data
                    : [];


            /*
             * If a published column exists,
             * hide items explicitly marked false.
             */

            news =
                news.filter(function (item) {

                    if (
                        Object.prototype.hasOwnProperty.call(
                            item,
                            "published"
                        )
                    ) {

                        return item.published !== false;

                    }

                    return true;

                });


            if (news.length === 0) {

                publicNews.innerHTML = `
                    <div class="news-loading">
                        No news available yet.
                    </div>
                `;

                return;

            }


            publicNews.innerHTML = "";


            news.forEach(function (item) {

                const title =
                    item.title ||
                    "CodeVera Technologies Update";


                const description =
                    item.excerpt ||
                    item.description ||
                    item.content ||
                    "";


                const category =
                    item.category ||
                    "CodeVera Update";


                const image =
                    item.image_url ||
                    item.image ||
                    "";


                const card =
                    document.createElement("article");

                card.className =
                    "news-card";


                let imageHTML = "";


                if (image) {

                    imageHTML = `
                        <div class="news-image">
                            <img
                                src="${escapeHTML(image)}"
                                alt="${escapeHTML(title)}"
                                loading="lazy"
                            >
                        </div>
                    `;

                }


                card.innerHTML = `

                    ${imageHTML}

                    <div class="news-content">

                        <span class="news-category">
                            ${escapeHTML(category)}
                        </span>

                        <h3>
                            ${escapeHTML(title)}
                        </h3>

                        <p>
                            ${escapeHTML(
                                String(description).substring(
                                    0,
                                    180
                                )
                            )}
                        </p>

                    </div>
                `;


                publicNews.appendChild(card);

            });


            console.log(
                "NEWS LOADED:",
                news.length
            );


        } catch (error) {

            console.error(
                "NEWS ERROR:",
                error
            );

            publicNews.innerHTML = `
                <div class="news-loading">
                    Unable to load news.
                </div>
            `;

        }

    }


    /* =====================================================
       START DATABASE LOADING
       ===================================================== */

    loadCourses();

    loadNews();


    /* =====================================================
       CURRENT YEAR
       ===================================================== */

    const yearElement =
        document.getElementById("year");

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }


    /* =====================================================
       SCROLL ANIMATIONS
       ===================================================== */

    const animatedElements =
        document.querySelectorAll(
            ".service-card, .about-card, .process-item, .project-card"
        );


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.1
                }
            );


        animatedElements.forEach(function (element) {

            element.style.opacity = "0";

            element.style.transform =
                "translateY(20px)";

            element.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";

            observer.observe(element);

        });

    }


    /* =====================================================
       FINISHED
       ===================================================== */

    console.log(
        "CodeVera Technologies initialized successfully."
    );

});

