function enable_embla(class_to_filter) {
    Array(...document.querySelectorAll(`.embla ${class_to_filter ?? ""}`)).forEach(
        function(wrap){
            enable_embla_with_options(
                wrap.querySelector(".embla__viewport")
            )
    });

    return window.dash_clientside.no_update;
}


function enable_embla_with_options(element){
    const plugins = [];
    const plugin_options = JSON.parse(element.dataset?.pluginOptions ?? "{}");

    if(plugin_options.enableAutoClass ?? true) plugins.push(EmblaCarouselClassNames());

    if(plugin_options.enableAutoPlay) plugins.push(
            EmblaCarouselAutoplay(JSON.parse(plugin_options.enableAutoPlay))
        );

    return EmblaCarousel(
        element,
        JSON.parse(element.dataset?.options ?? "{}"),
        plugins
    );
}