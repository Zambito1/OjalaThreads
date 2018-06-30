// Append logo to navigation bar

const logo = `<li style='margin-top: 2em' class='img-logo-container vnav__item'><a class="vol-logo__link" href="https://www.ojalathreads.com" title="Ojala Threads"><img  style='width: 11rem; height: 11rem;' class="logo__img img-responsive" src="https://www.ojalathreads.com/v/vspfiles/templates/266/images/template/header_bg.png?t=63656926813656952"></a></li>`;
const ojalaOrangeText = `<li class="img-logo-container vnav__item" style=" width: 38%; height: 15vh; "><a class="vol-logo__link" style='margin-bottom: 5em' href="https://www.ojalathreads.com"><img class="logo__img img-responsive" src="https://www.ojalathreads.com/v/vspfiles/assets/images/Ojala Threads (Text Only).png" style="margin-top: 3rem;margin-left: -24rem;"></a></li>`;

const navbar = $('#display_menu_1 > ul');

const footerLinks = `<li class="link-column__item"><a href="/Articles.asp?ID=5" title="About Ojala Threads">PRIVACY POLICY</a></li><li class="link-column__item"><a href="/Articles.asp?ID=3" title="About Ojala Threads">RETURN POLICY</a></li>`;

$('li.link-column__item:nth-child(2) > a:nth-child(1)').after(footerLinks);

$('.text-center-sm-and-down').removeClass('col-lg-4').addClass('col-lg-6');

$('.footer__logo').remove();

$(logo).prependTo(navbar);
$(ojalaOrangeText).appendTo(navbar);

$(navbar).css('margin-left','12rem');
