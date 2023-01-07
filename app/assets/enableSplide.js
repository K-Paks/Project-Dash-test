const splides_untill_now = [];

function enable_splide(class_to_filter) { 
    Array(...document.querySelectorAll(`.splide ${class_to_filter ?? ""}`)).forEach(
        function(wrap){
            if(!wrap.dataset.refresh && wrap.dataset.token){
                splides_untill_now[Number(wrap.dataset.token)].destroy(true);
            }
            

            wrap.dataset.token = splides_untill_now.length;
            const splide = new Splide(wrap);
            splides_untill_now.push(splide);
            
            const extensions = {};
            if(JSON.parse(wrap.dataset.splide)?.autoScroll)
                extensions["AutoScroll"] = window.splide.Extensions["AutoScroll"]

            new Splide(wrap).mount(extensions);
    });

    return window.dash_clientside.no_update;
}
