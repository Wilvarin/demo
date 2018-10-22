import flickrClient from './modules/flickr-api';

window.jsonFlickrApi = flickrClient.jsonFlickrApi;

flickrClient.getPhotos();

