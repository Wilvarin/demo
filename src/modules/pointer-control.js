import flickrClient from './flickr-api';

let blocks;
let selectIndex = 0;
const scrollableBox = document.getElementById('content');

const markSelectedItem = (selectIndex, oldIndex) => {
    blocks[selectIndex].classList.add('select');
    flickrClient.markSelectedItem(oldIndex, selectIndex);
};
const unmarkItem = (oldIndex) => {
    blocks[oldIndex].classList.remove('select');
};

const scrollToSelectItem = (selectIndex) => {
    const offset = blocks[selectIndex].offsetTop;
    console.log(offset);
    // 768 / 2 = 384 - 100 = 284
    const distance = offset === 0 ? 0 : offset - 284;
    scrollableBox.style.transform = `translateY(-${distance}px)`;
};

let isScrollingEnabled = true;
let counter1 = 0;
let counter2 = 0;
const scroll = (e) => {
    counter1 += 1;
    if (!isScrollingEnabled) {
        return;
    }
    const delta = e.deltaY;

    const scrollAct = () => {
        counter2 = counter1;
        setTimeout(() => {
            if (counter2 === counter1) {
                setTimeout(() => {
                    isScrollingEnabled = true;
                }, 500);
                counter1 = 0;
                counter2 = 0;
            } else {
                scrollAct();
            }
        }, 50);
    };
    const scrollStart = () => {
        isScrollingEnabled = false;
        if (delta > 0) {
            changeSelectElement('up');
        } else {
            changeSelectElement('down');
        }
        scrollAct();
    };

    scrollStart();
};

const changeSelectElement = (command) => {
    let newIndex = 0;
    // проверяем нужно ли нам обрабатывать нажатую клавишу
    switch (command) {
        case 'ArrowLeft': {
            if (selectIndex === 0) {
                return;
            }
            newIndex = selectIndex - 1;
            break
        }
        case 'ArrowRight': {
            if (selectIndex === flickrClient.photosLength() - 1) {
                return;
            }
            newIndex = selectIndex + 1;
            break
        }
        case 'up':
        case 'ArrowUp': {
            if (selectIndex - 5 < 0) {
                return;
            }
            newIndex = selectIndex - 5;
            break
        }
        case 'down':
        case 'ArrowDown': {
            if (selectIndex + 5 > flickrClient.photosLength() - 1) {
                return;
            }
            newIndex = selectIndex + 5;
            break
        }
        default:
            return;
    }
    unmarkItem(selectIndex);
    markSelectedItem(newIndex, selectIndex);
    // если это предпоследний ряд то загружаем еще фотографий
    console.log(flickrClient.photosLength() - newIndex);
    if ((flickrClient.photosLength() - newIndex) < 11) {
        flickrClient.getPhotos();
    }
    //
    scrollToSelectItem(newIndex);
    // сохраняем значение нового индекса
    selectIndex = newIndex;
};

export default {
    init: () => {
        // помечаем как выбраный первый элемент
        markSelectedItem(selectIndex, 1);

        // используем событие keyup что бы зажатая клавиша не вызывала повторные обработки
        document.addEventListener('keyup', (e) => {
            changeSelectElement(e.key);
        });

        document.addEventListener("wheel", scroll);
    },
    getBlocks: () => {
        // находим все элементы и преобразуем в массив
        blocks = [...document.getElementsByClassName('photo-item')];
        return blocks;
    },
}