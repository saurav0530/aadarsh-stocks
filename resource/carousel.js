//1. Function for slider at home page
// var counter = 1
// const preBtn = document.querySelector('#preBtn')
// const nextBtn = document.querySelector('#nextBtn')
// const imageContainer = document.querySelector('.imageContainer')
// const bannerImg = document.querySelectorAll('.imageContainer img')
// const size = document.querySelector('.bannerSlide').clientWidth

// imageContainer.style.transform = `translateX(${-size*counter}px)`

// preBtn.addEventListener('click',()=>{
//     if(counter <= 0) return
//     imageContainer.style.b
//     imageContainer.style.transition= "transform 0.4s ease-in-out"
//     counter--
//     imageContainer.style.transform = `translateX(${-size*counter}px)`
// })
// nextBtn.addEventListener('click',()=>{
//     if(counter >= bannerImg.length-1) return
//     imageContainer.style.transition= "transform 0.4s ease-in-out"
//     counter++
//     imageContainer.style.transform = `translateX(${-size*counter}px)`
// })
// imageContainer.addEventListener('transitionend',()=>{
//     if(bannerImg[counter].id === 'lastClone')
//     {
//         imageContainer.style.transition = "none"
//         counter = bannerImg.length - 2
//         imageContainer.style.transform = `translateX(${-size*counter}px)`
//     }
//     if(bannerImg[counter].id === 'firstClone')
//     {
//         imageContainer.style.transition = "none"
//         counter = bannerImg.length - counter
//         imageContainer.style.transform = `translateX(${-size*counter}px)`
//     }
// })
const imageContainer = document.querySelector('.imageContainer')
var size = imageContainer.clientWidth
const len = document.querySelector('.primary').className.split(' ')[3]
var hid = document.querySelectorAll('.hidden')
//console.log(hid)

document.querySelector('#preBtn').addEventListener('click',()=>{
    var l = document.querySelector('.bannerImg').className.split(' ')[1]
    var counter=l
    counter--;
    if(counter == 0)
    {
        counter = len;
    }
    var addr = document.querySelectorAll('.hidden')[counter-1].className.split(' ')[2]
    document.querySelector('.imageContainer').innerHTML=''
    var html = `<img src="/publicCarousel/${addr}" alt="banner" class="bannerImg ${counter}" style="visibility: visible;">` 
    document.querySelector('.imageContainer').insertAdjacentHTML('afterbegin',html)

})
document.querySelector('#nextBtn').addEventListener('click',()=>{
    var counter=document.querySelector('.bannerImg').className.split(' ')[1]
    counter++;
    if(counter > len)
    {
        counter = 1;
    }
    var addr = document.querySelectorAll('.hidden')[counter-1].className.split(' ')[2]
    document.querySelector('.imageContainer').innerHTML=''
    var html = `<img src="/publicCarousel/${addr}" alt="banner" class="bannerImg ${counter}" style="visibility: visible;">` 
    document.querySelector('.imageContainer').insertAdjacentHTML('afterbegin',html)
})

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
