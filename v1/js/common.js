'use strict';

document.addEventListener('DOMContentLoaded', () => {

    renderHeader();
    renderFooter();

});

function renderHeader(){

    const target=document.querySelector('[data-common-header]');

    if(!target) return;

    const path=location.pathname;

    const isHome=
        path.endsWith('/v1/')||
        path.endsWith('/v1/index.html');

    const home=isHome ? './' : './index.html';

    target.innerHTML=`

<header class="site-header">

<div class="container site-header__inner">

<a class="site-header__brand" href="${home}">

<img
src="../images/PrimaryLogo_0002.JPEG"
alt="Furna"
>

<span>Furna</span>

</a>

<nav class="site-header__nav">

<a href="${home}">Home</a>

<a href="./about.html">About</a>

<a href="./support.html">Support</a>

<a
class="site-header__button"
href="#"
>

公開予定

</a>

</nav>

</div>

</header>

`;

}

function renderFooter(){

    const target=document.querySelector('[data-common-footer]');

    if(!target) return;

    target.innerHTML=`

<footer class="site-footer">

<div class="container site-footer__inner">

<div class="site-footer__brand">

Furna

</div>

<nav class="site-footer__nav">

<a href="./about.html">About</a>

<a href="./support.html">Support</a>

<a href="#">Privacy</a>

<a href="#">Terms</a>

<a href="#">Contact</a>

<a href="#">News</a>

</nav>

<div class="site-footer__copyright">

© 2026 Furna

</div>

</div>

</footer>

`;

}
