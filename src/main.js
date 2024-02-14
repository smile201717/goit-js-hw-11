
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

 import SimpleLightbox from "simplelightbox";
 import "simplelightbox/dist/simple-lightbox.min.css";


const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

const toastSettings = {
  messageColor: '#FFF',
  color: '#EF4040',
  position: 'topRight',
};

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  const searchQuery = e.target.elements.input.value;

  if (!searchQuery.trim()) {
    return iziToast.error({
      title: '❕',
      theme: 'light',
      message: `Please, fill in the search field`,
      messageSize: '20px',
      messageColor: '#808080',
      backgroundColor: '#EF4040',
      position: 'topLeft',
      timeout: 2500,
    });
  } else {
    loader.classList.add('loading');
    getPhotos(searchQuery);
    e.currentTarget.reset();
  }
}

//  ====== backend =======
function getPhotos(name) {
  const BASE_URL = 'https://pixabay.com';
  const END_POINT = '/api/';
  const searchParams = new URLSearchParams({
    key: ,
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });

  const url = BASE_URL + END_POINT + '?' + searchParams;

  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(photos => {
      const arrayPhotos = photos.hits;
      if (arrayPhotos.length === 0) {
        noImages();
      }
      renderPhoto(arrayPhotos);
    })
    .catch(error => {
      iziToast.error({
        ...toastSettings,
        message: `${error}`,
      });
    })
    .finally(() => loader.classList.remove('loading'));
}

function noImages() {
  iziToast.error({
    ...toastSettings,
    message:
      'Sorry, there are no images matching your search query. Please try again!',
  });
}

function renderPhoto(photos) {
  const markup = photos
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<li class='gallery-item'>
  <a class='gallery-link' href='${largeImageURL}'>
    <img class='gallery-image' src='${webformatURL}' alt='${tags}'/>
  </a>
<div class='container-app'>
<p><span>Likes</span> ${likes}</p>
<p><span>Views</span> ${views}</p>
<p><span>Comments</span> ${comments}</p>
<p><span>Downloads</span> ${downloads}</p>
</div>
 </li>`
    )
    .join('');
  gallery.insertAdjacentHTML('afterBegin', markup);
  updateSimpleLightbox();
}

//  ====== SimpleLightbox =======
const galleryList = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionsPosition: 'bottom',
  captionDelay: 250,
});

function updateSimpleLightbox() {
  galleryList.refresh();
}