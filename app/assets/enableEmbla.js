function enable_embla(options) { 
    Array(...document.querySelectorAll(`.embla`)).forEach(function(wrap){
        const embla = EmblaCarousel(wrap.querySelector(".embla__viewport"), options, [EmblaCarouselClassNames()]);
    });

    return window.dash_clientside.no_update;
}
