'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const btnOperations = document.querySelector('.nav_operations');
const section1 = document.querySelector('#section--1');
const section2 = document.querySelector('#section--2');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

for (let i = 0; i < btnsOpenModal.length; i++)
  btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Smooth Scrolling

//button scrolling
btnScroll.addEventListener('click', function (e) {
  const s1Cords = section1.getBoundingClientRect();
  console.log(s1Cords);

  console.log(e.target.getBoundingClientRect());

  console.log('cursor sroll(X/Y)', window.pageXOffset, window.pageYOffset);
  //to view the height and width
  console.log(
    'height/width of viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //Scrolling
  // window.scrollTo(
  //   s1Cords.left + window.pageXOffset,
  //   s1Cords.top + window.pageYOffset
  // );

  //Old school way of smooth scrolling
  // window.scrollTo({
  //   left: s1Cords.left + window.pageXOffset,
  //   top: s1Cords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  /////******/////
  section1.scrollIntoView({ behavior: 'smooth' });
});

//page navigation//

// document.querySelectorAll('.nav__link').forEach(function (el, index) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     document
//       .querySelector(`${this.getAttribute('href')}`)
//       .scrollIntoView({ behavior: 'smooth' });
//   });
// });

//Event Delegation//
//1.Add event listener to a common parent element.
//2.Determine what element originated the event.
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //Matching strategy
  if (e.target.classList.contains('nav__link')) {
    document
      .querySelector(`${e.target.getAttribute('href')}`)
      .scrollIntoView({ behavior: 'smooth' });
  }
});

//A tabbed component Operations//
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  console.log(clicked);
  //Guard clause
  if (!clicked) return;
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  ///
  const tab = document.querySelector(
    `.operations__content--${clicked.dataset.tab}`
  );
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  tab.classList.add('operations__content--active');
  console.log(tab);
});

/////Menu fade animation

const fadeOut = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el != link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
};
//using bind function
nav.addEventListener('mouseover', fadeOut.bind(0.5));

nav.addEventListener('mouseout', fadeOut.bind(1));

/////Sticky navigation
/*
const section1Cords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  console.log(window.scrollY);
  if (this.window.scrollY > section1Cords.top) {
    nav.classList.add('sticky');
  } else nav.classList.remove('sticky');
});
*/

//Sticky navigation using Intersectin observer API
//Here we use this api to perform an function when a section interfers with the root section of the api/default section.
// const opsCallback = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };

// const opsOptions = {
//   root: null,
//   threshold: 0.1, //if the root interfers with section at this percentage the function will be called
// };

// const observer = new IntersectionObserver(opsCallback, opsOptions);
// observer.observe(section1);

const header = document.querySelector('.header');
const navcords = nav.getBoundingClientRect().height;

const callBack = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(callBack, {
  root: null,
  threshold: 0,
  rootMargin: `-${navcords}px`,
});
headerObserver.observe(header);

//Revealing elements on scroll//
const allSections = document.querySelectorAll('.section');
const sectionReveal = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(sectionReveal, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

////Lazy Loading Images
const imgTargets = document.querySelectorAll('img[data-src]');
// console.log(imgTargets);
const revealImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
    observer.unobserve(entry.target);
  });
};
const imgObserver = new IntersectionObserver(revealImg, {
  root: null,
  threshold: 0.4,
});
imgTargets.forEach(img => imgObserver.observe(img));

//Sliders
const slideAction = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dots = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlides = slides.length;

  slides.forEach((s, i) => {
    s.style.transform = `translateX(${i * 100}%)`;
  });

  //Functions
  const goToSlide = function (currSlide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currSlide)}%)`;
    });
  };

  const nextSlide = function () {
    if (currSlide === maxSlides - 1) {
      currSlide = 0;
    } else currSlide++;
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  const prevSlide = function () {
    if (currSlide == 0) {
      currSlide = maxSlides - 1;
    } else currSlide--;
    goToSlide(currSlide);
    activateDot(currSlide);
  };

  //adding functionality to the dots
  const createDots = function () {
    slides.forEach(function (_, i) {
      dots.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide=${i}></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    createDots();
    activateDot(0);

    goToSlide(0);
  };
  init();

  //Next Slide
  //Event Handlers
  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  //arrow key operations
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dots.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slideAction();

/*
/////Selecting Elements/////
console.log(document.documentElement);
//selects one class
const header = document.querySelector('.header');
//selects all the classes
const allSections = document.querySelectorAll('.section');
console.log(allSections);

//selects one ID
document.getElementById('header');
//selects all the similar tags names
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);
//selects the classes using their class names
console.log(document.getElementsByClassName('btn'));

/////Creating and Inserting elements/////
//we can also use insertAdjacentHTML just like we used for movs in bankist app

const message = document.createElement('div');
message.classList.add('cookie-message');
// message.textContent = 'We use cookies here';
message.innerHTML = `We are using cookies to improve the functionality. <button class="btn btn--close-cookie" >Got it!</button>`;

//inserts the elements before the class  mentioned
// header.prepend(message);
//inserts the element after the class mentioned
header.append(message);
//
//if we want to insert the elements multiple times then we can clone them
// header.append(message.cloneNode(true));

//we also have before and after methods to insert he elements.
//before inserts the element before the mentioned element
// header.before(message);
//after inserts the element after the mentioned element
// header.after(message);

/////Deleting the elements/////
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

/////Styles/////
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.backgroundColor);
//to get the predefined styles
console.log(
  getComputedStyle(document.querySelector('.cookie-message')).display
);
console.log(getComputedStyle(message).height);

//to manipulate the predefined/computed style
message.style.height =
  Number.parseInt(getComputedStyle(message).height, 10) + 40 + 'px';

//changing the css defined styles
document.documentElement.style.setProperty('--color-primary', 'orangered');

/////Attributes/////
const logo = document.querySelector('.nav__logo');
console.log(logo.src);
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'My Bankist logo';
//non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

//Data Attributes
console.log(logo.dataset.versionNumber); //we must use the proper camel case here

//classes
logo.classList.add('c');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');
*/

/*
//////Types of events and event handlers//////
//mouseenter event
const alertH1 = function (e) {
  alert('Add Event Listener');
};
const h1 = document.querySelector('h1');

h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);

//old school way
// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Add Event Listener');
// };
*/

/////DOM Traversing/////
/*
const h1 = document.querySelector('h1');
//going downwards: child elements
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); //works only to get the direct children
h1.firstElementChild.style.color = 'white';

//going upwards: selecting parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('header').style.backgroundColor = 'orange'; //finds the closest header element to h1

//going sideways: selecting siblings
console.log(h1.previousElementSibling); //elements
console.log(h1.nextElementSibling);

console.log(h1.previousSibling); //nodes
console.log(h1.nextSibling);

console.log(h1.parentElement.children); //to get all the siblings
*/
