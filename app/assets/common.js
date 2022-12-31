'use strict';


// FORMATTING Constants

const numberFormatForDecimals = Intl.NumberFormat(
    "en-US",
    {
        style: "decimal",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }
)

const numberFormatForPercent = Intl.NumberFormat(
    "en-US",
    {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }
)

const english_ordinal_rules = new Intl.PluralRules("en", {type: "ordinal"})

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


class FormattedTimeElement{
    timer=null;

    constructor(element){
        if(element){
            this.formatThings(element);
            element.addEventListener("click", function(event){
                const _element = event.target;
                const timer = Number.parseInt(_element.dataset["timer"]);
                
                if(timer)
                    clearTimeout(timer);
                new FormattedTimeElement(_element);
            });        
        }
        else
            delete this;
    }

    formatThings(element){
        // python time.time returns the value in seconds from epoch so.
        const seconds = Math.floor(Number.parseFloat(element.dataset["timeStamp"])) * (element.dataset["isMs"] ? 1 : 1e3);
        let timeout;

        if(Number.isNaN(seconds)){
            element.innerText = "---";
            element.title = "Not Yet Started";
            return
        }

        const asked = new Date(seconds);
        
        [element.innerText, timeout] = new FormatTime(seconds).format();
        element.title = asked.toLocaleString();

        element.dataset["timer"] = setTimeout(() => {
            element.innerText = "👉😴";
            element.title = "Poke me please";
        }, timeout);
    }   
}


class FormatTime{
    passed;
    formatter;
    
    constructor(date){
        const today = new Date();
        this.passed = Math.floor((date - today) / 1e3);
        this.formatter = new Intl.RelativeTimeFormat('en', {style: 'long' });
    }

    format(){
        let interval = this.passed / 31536e3;  // (365 * 60 * 60 * 24)
        if(Math.abs(interval) > 1)
            return [this.formatThings(interval, "years"), 608e5];

        interval = this.passed / 2592e3; // (60 * 60 * 24 * 30)

        if(Math.abs(interval) > 1)
            return [this.formatThings(interval, "months"), 608e5];

        interval = this.passed / 6048e2; 

        if(Math.abs(interval) > 1)
            return [this.formatThings(interval, "weeks"), 608e5];

        interval = this.passed / 864e2;

        if(Math.abs(interval) > 1)
            return [this.formatThings(interval, "days"), 864e5];
        
        interval = this.passed / 36e2;
        
        if(Math.abs(interval) > 1)
            return [this.formatThings(interval, "hours"), 36e5];
        
        interval = this.passed / 60;
        if(Math.abs(interval) > 1)
            return [this.formatThings(interval, "minutes"), 6e4];
        
        return [this.formatThings(this.passed, "seconds"), 10e3];
    }

    formatThings(interval, parameter){
        return this.formatter.format(Math.round(interval), parameter)
    }

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


// INTERESTING INTERVAL THINGS
function animateRawNumbers(number){
    let maxi = Number.parseFloat(number.dataset.value);
    const isPercent = number.dataset.value.at(-1) === "%";
    
    clearInterval(number.dataset["timer"]);
    
    if(isPercent) maxi = maxi / 100;
    let startFrom = 0;

    const increment = isPercent ? 0.69e-2 : (maxi < 100 ? 1 : 6);
    number.dataset["timer"] = setInterval(function(){
        number.textContent = (isPercent ? numberFormatForPercent : numberFormatForDecimals).format(startFrom);
        if(startFrom === maxi) clearInterval(number.dataset["timer"]);
        startFrom += Math.min(maxi - startFrom, increment);

    }, 30)
}

function switchRankColor(rank){
    switch (rank) {
        case 1: return "gold";
        case 2: return "silver";
        case 3: return "bronze";
        default: return "orange";
    }
}


function setColorBasedOnRank(element){
    const rank = Number.parseInt(element.dataset["rank"]);
    const suffixes = {
        one: "st",
        two: "nd",
        few: "rd",
        other: "th"
    };

    element.textContent = `${rank}${suffixes[english_ordinal_rules.select(rank)]}`;
    element.style.color = switchRankColor(rank);
}


window.dash_clientside = Object.assign({}, window.dash_clientside, {
    modal:{
        decide_modal
    },

    handleData: {
        getTimezone,
        formatDateTime,
        takeThingsAndGiveThat(...args){
            return args.length > 1 ? args[0] : args;
        }
    },
    eventListenerThings: {
        formatTimeStamp: function(...args){
            new FormattedTimeElement(document.getElementById(args.at(-1)));
            return say_no(1)[0];
        }
    }
});
