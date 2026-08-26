'use strict';

document.addEventListener('DOMContentLoaded', () => {

renderHeader();
renderFooter();

});

function renderHeader(){

const target=document.querySelector('[data-common-header]');

if(!target)return;

target.innerHTML=`

<header class="site-header">

<div class="container site-header__inner">

<a href="./" class="site-header__brand">

<img
class="site-header__logo"
src="../images/logo.png"
alt="Furna">

<span>Furna</span>

</a>

<nav class="site-header__nav">

<a href="./about.html">
About
</a>

<a href="./support.html">
Support
</a>

<a
class="site-header__download"
href="#">

公開予定

</a>

</nav>

</div>

</header>

`;

}

function renderFooter(){

const target=document.querySelector('[data-common-footer]');

if(!target)return;

target.innerHTML=`

<footer class="site-footer">

<div class="container site-footer__inner">

<div>

<strong>Furna</strong>

</div>

<nav class="site-header__nav">

<a href="./about.html">
About
</a>

<a href="./support.html">
Support
</a>

<a href="#">
Privacy
</a>

<a href="#">
Terms
</a>

<a href="#">
Contact
</a>

</nav>

<div>

© 2026 Furna

</div>

</div>

</footer>

`;

}
