'use strict';

// UTILS FUNCTIONS

function getTimezone(){
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}


function say_no(times){
    return Array(times).fill(window.dash_clientside.no_update);
}

function formatDateTime(from_epoch){
    if(!from_epoch) return "--";
    const date = new Date(Number(from_epoch) * 1000);
    return `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} ${date.getHours() > 12 && date.getMinutes() >= 0 ? 'PM' : 'AM'}`;
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


function formateTime(datetime){
    return new Intl.DateTimeFormat(undefined, {hour: "numeric",
  minute: "numeric",
  second: "numeric",}).format(new Date(datetime))
}



function dmc_notification(autoClose, color, disallowClose, message, title){
    return {
        props: {
            action: "show",
            autoClose: autoClose,
            color: color,
            disallowClose: disallowClose,
            message: message,
            title: [title, dmc_text(formateTime(new Date()), "xs")],
            id: Math.random().toString()
        },
        type: 'Notification',
        namespace: 'dash_mantine_components'
    }
}


function ddc_link(text, link){
    return {
        props: {
            'children': [text],
             'href': link, 'target': '_blank'
            }, type: 'Link', namespace: 'dash_core_components'
    }
}


function dmc_text(text, size){
    return {props: {'children': text, 'size': size}, type: 'Text', namespace: 'dash_mantine_components'}
}


// MODAL UTILS

function decide_modal(_, opened){
    const ctx = dash_clientside.callback_context;
    if(!ctx?.triggered?.length) return false;
    return !Boolean(opened);
}

// function formatTimeInComp(value){return value ? formatDate(value) : "--"}


// EVENT LISTENER THINGS

function invalidToDisable(_, check_id){
    const element = document.getElementById(check_id);
    return !(element ? element.checkValidity() : Boolean(_))
}


function enterToClick(_, textID, buttonID){
    const element = document.getElementById(textID);

    if(element && element.checkValidity()) document.getElementById(buttonID).click();
    return window.dash_clientside.no_update;
}


// INTERESTING INTERVAL THINGS

function animateRawNumbers(number){
    const maxi = Number.parseFloat(number.textContent);
    const isInt = Number.isInteger(maxi);
    const isPercent = number.textContent.at(-1) === "%";
    
    let startFrom = 0;

    const increment = isPercent ? 0.69 : (maxi < 100 ? 1 : 6);
    const once = (
        isInt ? String(Number((isPercent ? number.textContent.slice(0, -1) : number.textContent))
        ) : String(maxi.toFixed(2))).length;
    number.title = `${maxi}${isPercent ? '%' : ''}`

    const id_ = setInterval(function(){
        number.textContent = `${isInt ? startFrom.toFixed(0) : startFrom.toFixed(2)}${isPercent ? '%' : ''}`.padStart(once, "0");
        if(startFrom === maxi) clearInterval(id_);
        startFrom += Math.min(maxi - startFrom, increment);

    }, 30)
}



window.dash_clientside = Object.assign({}, window.dash_clientside, {
    modal:{
        decide_modal
    },

    handleData: {
        getTimezone,
        formatDateTime
    },
    eventListenerThings: {
        invalidToDisable,
        enterToClick
    }
});
