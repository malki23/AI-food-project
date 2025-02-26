fetch('../html/nav.html').then(res => res.text()).then(html => {
    document.body.insertAdjacentHTML('afterbegin', html);
})