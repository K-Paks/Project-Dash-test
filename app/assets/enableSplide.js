function enable_splide(class_to_filter) { 
    Array(...document.querySelectorAll(`.splide ${class_to_filter ?? ""}`)).forEach(
        function(wrap){
            new Splide(wrap).mount();
    });

    return window.dash_clientside.no_update;
}
