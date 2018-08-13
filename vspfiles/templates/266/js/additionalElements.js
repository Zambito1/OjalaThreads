// Append logo to navigation bar

const logo = `<a class="vol-logo__link" href="https://www.ojalathreads.com" title="Ojala Threads">
                <img class="logo__img" src="https://www.ojalathreads.com/v/vspfiles/assets/images/OjalaLogo.png" style='width: 100%; margin-left: 2em'>
              </a>`;

const navbar = $('#display_menu_1 > ul');
$(logo).insertBefore(navbar);


$(navbar).css({
  marginLeft: '-2rem',
  width: '55em'
});

$('.vnav--level1 > li:not(.img-logo-container)').css({
    marginTop: '0',
});

const footerLinks = `<li class="link-column__item"><a href="/Articles.asp?ID=5" title="About Ojala Threads">PRIVACY POLICY</a></li><li class="link-column__item"><a href="/Articles.asp?ID=3" title="About Ojala Threads">RETURN POLICY</a></li>`;

$('li.link-column__item:nth-child(2) > a:nth-child(1)').after(footerLinks);

$('.text-center-sm-and-down').removeClass('col-lg-4').addClass('col-lg-6');

$('.footer__logo').remove();

$('#custom-newsletter').submit(e => e.preventDefault());
