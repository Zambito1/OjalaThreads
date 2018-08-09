// Append logo to navigation bar

const logo = `<a class="vol-logo__link" href="https://www.ojalathreads.com" title="Ojala Threads" style='position: absolute; left: 8vw; bottom: 3em; width: 8em;'><img class="logo__img img-responsive" src="https://www.ojalathreads.com/v/vspfiles/templates/266/images/template/header_bg.png?t=63656926813656952"></a>`;
const ojalaOrangeText = `<a class="vol-logo__link" style='position: absolute; bottom: 2em; left: 28vw; right: -15vw;' href="https://www.ojalathreads.com"><img class="logo__img img-responsive" src="https://www.ojalathreads.com/v/vspfiles/assets/images/Ojala Threads (Text Only).png" style="margin-top: 3rem;margin-left: -24rem;"></a>`;

const navbar = $('#display_menu_1 > ul');
$(logo).insertBefore(navbar);
$(ojalaOrangeText).insertBefore(navbar);

$(navbar).css({
  marginLeft: '-2rem',
  width: '55em'
});


const footerLinks = `<li class="link-column__item"><a href="/Articles.asp?ID=5" title="About Ojala Threads">PRIVACY POLICY</a></li><li class="link-column__item"><a href="/Articles.asp?ID=3" title="About Ojala Threads">RETURN POLICY</a></li>`;

$('li.link-column__item:nth-child(2) > a:nth-child(1)').after(footerLinks);

$('.text-center-sm-and-down').removeClass('col-lg-4').addClass('col-lg-6');

$('.footer__logo').remove();