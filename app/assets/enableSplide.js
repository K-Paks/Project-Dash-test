function enable_splide(class_to_filter) { 
    Array(...document.querySelectorAll(`.splide ${class_to_filter ?? ""}`)).forEach(
        function(wrap){
            if(wrap.dataset.mounted)
                return;
            
            wrap.dataset.mounted = true;
            
            const extensions = {};
            if(JSON.parse(wrap.dataset.splide)?.autoScroll)
                extensions["AutoScroll"] = window.splide.Extensions["AutoScroll"]

            new Splide(wrap).mount(extensions);
    });

    return window.dash_clientside.no_update;
}
