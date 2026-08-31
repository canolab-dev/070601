/* ==========================================================
   Furna V1
   Common UI
   Root-Safe Navigation
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    const headerTarget = document.querySelector("[data-common-header]");
    const footerTarget = document.querySelector("[data-common-footer]");


    /* ======================================================
       Absolute Paths

       Root Home:
       https://furna.jp/

       V1 Pages:
       https://furna.jp/v1/about.html
       https://furna.jp/v1/support.html
       https://furna.jp/v1/privacy.html
       https://furna.jp/v1/terms.html
    ====================================================== */

    const paths = {

        home: "/",

        about: "/v1/about.html",

        support: "/v1/support.html",

        privacy: "/v1/privacy.html",

        terms: "/v1/terms.html",

        logo: "/images/PrimaryLogo_0002.JPEG"

    };


    /* ======================================================
       Header
    ====================================================== */

    if (headerTarget) {

        headerTarget.innerHTML = `
            <header class="site-header">

                <div class="container site-header__inner">

                    <a
                        class="site-header__brand"
                        href="${paths.home}"
                        aria-label="Furna Home"
                    >

                        <span
                            class="site-header__brand-mark"
                            aria-hidden="true"
                        >
                            <img
                                src="${paths.logo}"
                                alt=""
                            >
                        </span>

                    </a>


                    <nav
                        class="site-header__nav"
                        aria-label="Primary navigation"
                    >

                        <a href="${paths.home}">
                            Home
                        </a>

                        <a href="${paths.about}">
                            About
                        </a>

                        <a href="${paths.support}">
                            Support
                        </a>

                        <span
                            class="site-header__button site-header__status"
                            aria-label="App Store 公開予定"
                        >
                            公開予定
                        </span>

                    </nav>


                    <button
                        class="site-header__menu-button"
                        type="button"
                        aria-expanded="false"
                        aria-controls="site-mobile-nav"
                        aria-label="メニューを開く"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                </div>


                <div
                    class="site-mobile-nav"
                    id="site-mobile-nav"
                    hidden
                >

                    <div class="container site-mobile-nav__inner">

                        <a href="${paths.home}">
                            Home
                        </a>

                        <a href="${paths.about}">
                            About
                        </a>

                        <a href="${paths.support}">
                            Support
                        </a>

                        <span class="site-mobile-nav__status">
                            公開予定
                        </span>

                    </div>

                </div>

            </header>
        `;


        const menuButton = headerTarget.querySelector(
            ".site-header__menu-button"
        );

        const mobileNav = headerTarget.querySelector(
            ".site-mobile-nav"
        );


        if (menuButton && mobileNav) {

            const closeMenu = () => {

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "メニューを開く"
                );

                mobileNav.hidden = true;

                document.body.classList.remove(
                    "mobile-nav-open"
                );

            };


            const openMenu = () => {

                menuButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "メニューを閉じる"
                );

                mobileNav.hidden = false;

                document.body.classList.add(
                    "mobile-nav-open"
                );

            };


            menuButton.addEventListener(
                "click",
                () => {

                    const isOpen =
                        menuButton.getAttribute(
                            "aria-expanded"
                        ) === "true";

                    if (isOpen) {

                        closeMenu();

                    } else {

                        openMenu();

                    }

                }
            );


            mobileNav
                .querySelectorAll("a")
                .forEach((link) => {

                    link.addEventListener(
                        "click",
                        closeMenu
                    );

                });


            window.addEventListener(
                "resize",
                () => {

                    if (window.innerWidth > 560) {

                        closeMenu();

                    }

                }
            );


            document.addEventListener(
                "keydown",
                (event) => {

                    if (event.key === "Escape") {

                        closeMenu();

                    }

                }
            );

        }

    }


    /* ======================================================
       Footer
    ====================================================== */

    if (footerTarget) {

        footerTarget.innerHTML = `
            <footer class="site-footer">

                <div class="container site-footer__inner">

                    <div class="site-footer__brand">
                        Furna
                    </div>


                    <nav
                        class="site-footer__nav"
                        aria-label="Footer navigation"
                    >

                        <a href="${paths.about}">
                            About
                        </a>

                        <a href="${paths.support}">
                            Support
                        </a>

                        <a href="${paths.privacy}">
                            Privacy
                        </a>

                        <a href="${paths.terms}">
                            Terms
                        </a>

                        <a href="mailto:support@furna.jp">
                            Contact
                        </a>

                        <span
                            class="site-footer__pending"
                            aria-disabled="true"
                            title="公開準備中"
                        >
                            News
                        </span>

                    </nav>


                    <div class="site-footer__copyright">
                        © 2026 Furna
                    </div>

                </div>

            </footer>
        `;

    }

});
