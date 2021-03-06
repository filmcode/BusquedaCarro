const modalToggle = data => {
        if (data) {
            modal.classList.add('modal--close')
        } else {
            modal.classList.remove('modal--close')
        }
    }
    // modalBtn
modalBtn.addEventListener('click', () => { modalToggle(true) })

const urlImages = () => {
    return new Promise((resolve, reject) => {
        if (imagen.files.length > 0) {
            let arrayUrls = new Array()
            for (let i = 0; i < imagen.files.length; i++) {
                arrayUrls.push([URL.createObjectURL(imagen.files[i]), imagen.files[i]['type']])
            }
            resolve(arrayUrls)
        } else {
            resolve(false)
        }
    })
}

const sliderImages = images => {
    return new Promise((resolve, reject) => {
        sliderContent.innerHTML = ''
        sliderContent.style = `width: ${images.length}00%`
        for (let e = 0; e < images.length; e++) {
            // content section
            let slider__section = document.createElement('div')
            slider__section.setAttribute('class', 'slider__section')
                // content image
            let slider__content_image = document.createElement('div')
            slider__content_image.setAttribute('class', 'slider__content-image')
            let slider_image;
            if (images[e][1] == 'application/pdf') {
                //  pdf
                slider_image = document.createElement('iframe')
                slider_image.style = 'width: 100%;';
            } else {
                //  image
                slider_image = document.createElement('img')
            }
            slider_image.setAttribute('class', 'slider__img')
            slider_image.setAttribute('src', images[e][0])
            slider__content_image.append(slider_image)
            slider__section.append(slider__content_image)
            sliderContent.append(slider__section)
        }
        resolve(true)
    })
}

const sliderPrev = () => {
    let sectionImages = document.querySelectorAll('.slider__section'),
        sectionLastImages = sectionImages[sectionImages.length - 1]
    sliderContent.style.marginLeft = '0%'
    sliderContent.style.trasition = 'all .0.5s ease'

    setTimeout(() => {
        sliderContent.style.trasition = 'none'
        sliderContent.insertAdjacentElement('afterbegin', sectionLastImages)
        sliderContent.style.marginLeft = '-100%'
    }, 500);

}
sliderButtonLeft.addEventListener('click', () => {
    sliderPrev()
})

const sliderNext = () => {
    const sectionFirstImages = document.querySelectorAll('.slider__section')[0]
    sliderContent.style.marginLeft = '-200%'
    sliderContent.style.trasition = 'all .0.5s ease'

    setTimeout(() => {
        sliderContent.style.trasition = 'none'
        sliderContent.insertAdjacentElement('beforeend', sectionFirstImages)
        sliderContent.style.marginLeft = '-100%'
    }, 500);

}
sliderButtonRight.addEventListener('click', () => {
    sliderNext()
})
const preview = image => {
    let preview_image = document.createElement('img')
    preview_image.setAttribute('class', 'image-preview')
    preview_image.setAttribute('src', image)
    preview_image.addEventListener('click', () => { modalToggle(false) })
    imagePreview.append(preview_image)
}
const sectionValidate = () => {
    // slider
    let sectionImages = document.querySelectorAll('.slider__section')
    let previewImg = document.querySelector('.image-preview')
    if (previewImg) {
        previewImg.addEventListener('click', () => { modalToggle(false) })
    }
    if (sectionImages.length > 1) {
        sliderContent.style.marginLeft = '-100%'
        sliderButtonLeft.style.display = 'block';
        sliderButtonRight.style.display = 'block';
        // poner ultima imagen de primeras
        sliderContent.insertAdjacentElement('afterbegin', sectionImages[sectionImages.length - 1])
    } else {
        sliderContent.style.marginLeft = '0'
        sliderButtonLeft.style.display = 'none';
        sliderButtonRight.style.display = 'none';
    }
}

sectionValidate()
imagen.addEventListener('change', async() => {
    imagePreview.innerHTML = "Cargando..."
    const arrayImages = await urlImages()
    console.log(arrayImages);
    if (arrayImages) {
        const res = await sliderImages(arrayImages)
        imagePreview.innerHTML = ''
        if (res) {
            sectionValidate()
            if (arrayImages[0][1] == 'application/pdf') {
                preview('/img/pdf.png')
            } else {
                preview(arrayImages[0][0])
            }
        }
    } else {
        imagePreview.innerHTML = ''
    }
})