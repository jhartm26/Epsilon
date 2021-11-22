// CALENDAR SCRIPTS
// Credit to https://www.sliderrevolution.com/resources/html-calendar/ for source code
// Modified to fit necessary functionality
function createCalendar() {

    var today = moment();

    function sameDate(d1, d2) {
        return  d1.getFullYear() === d2.getFullYear() &&
                d1.getMonth() === d2.getMonth() &&
                d1.getDate() === d2.getDate();
    }

    function Calendar(selector, events) {
        this.el = document.querySelector(selector);
        this.events = events;
        this.current = moment().date(1);
        this.draw();
        var current = document.querySelector('.today');
        if(current) {
            var self = this;
            window.setTimeout(function() {
            self.openDay(current);
            }, 500);
        }
    }

    Calendar.prototype.draw = function() {
        //Create Header
        this.drawHeader();

        //Draw Month
        this.drawMonth();

        this.drawLegend();
    }

    Calendar.prototype.drawHeader = function() {
        var self = this;
        if(!this.header) {
            //Create the header elements
            this.header = createElement('div', 'header');
            this.header.className = 'header';

            this.title = createElement('h1');

            var right = createElement('div', 'right');
            right.addEventListener('click', function() { self.nextMonth(); });

            var left = createElement('div', 'left');
            left.addEventListener('click', function() { self.prevMonth(); });

            //Append the Elements
            this.header.appendChild(this.title); 
            this.header.appendChild(right);
            this.header.appendChild(left);
            this.el.appendChild(this.header);
        }

        this.title.innerHTML = this.current.format('MMMM YYYY');
    }

    Calendar.prototype.drawMonth = function() {
        var self = this;
        
        if(this.month) {
            this.oldMonth = this.month;
            this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
            this.oldMonth.addEventListener('webkitAnimationEnd', function() {
            self.oldMonth.parentNode.removeChild(self.oldMonth);
            self.month = createElement('div', 'month');
            self.backFill();
            self.currentMonth();
            self.fowardFill();
            self.el.appendChild(self.month);
            window.setTimeout(function() {
                self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
            }, 16);
            });
        } else {
            this.month = createElement('div', 'month');
            this.el.appendChild(this.month);
            this.backFill();
            this.currentMonth();
            this.fowardFill();
            this.month.className = 'month new';
        }
    }

    Calendar.prototype.backFill = function() {
        var clone = this.current.clone();
        var dayOfWeek = clone.day();

        if(!dayOfWeek) { return; }

        clone.subtract('days', dayOfWeek+1);

        for(var i = dayOfWeek; i > 0 ; i--) {
            this.drawDay(clone.add('days', 1));
        }
    }

    Calendar.prototype.fowardFill = function() {
        var clone = this.current.clone().add('months', 1).subtract('days', 1);
        var dayOfWeek = clone.day();

        if(dayOfWeek === 6) { return; }

        for(var i = dayOfWeek; i < 6 ; i++) {
            this.drawDay(clone.add('days', 1));
        }
    }

    Calendar.prototype.currentMonth = function() {
        var clone = this.current.clone();

        while(clone.month() === this.current.month()) {
            this.drawDay(clone);
            clone.add('days', 1);
        }
    }

    Calendar.prototype.getWeek = function(day) {
        if(!this.week || day.day() === 0) {
            this.week = createElement('div', 'week');
            this.month.appendChild(this.week);
        }
    }

    Calendar.prototype.drawDay = function(day) {
        var self = this;
        this.getWeek(day);

        //Outer Day
        var outer = createElement('div', this.getDayClass(day));
        outer.addEventListener('click', function() {
            self.openDay(this);
        });

        //Day Name
        var name = createElement('div', 'day-name', day.format('ddd'));

        //Day Number
        var number = createElement('div', 'day-number', day.format('DD'));


        //Events
        var events = createElement('div', 'day-events');
        this.drawEvents(day, events);

        outer.appendChild(name);
        outer.appendChild(number);
        outer.appendChild(events);
        this.week.appendChild(outer);
    }

    Calendar.prototype.drawEvents = function(day, element) {
        if(day.month() === this.current.month()) {
            var todaysEvents = this.events.reduce(function(memo, ev) {
                eventDate = new Date(ev.date);
                eventDate.setDate(eventDate.getDate() + 1);
                if(sameDate(eventDate, new Date(day))) {
                    memo.push(ev);
                }
                return memo;
            }, []);

            var index = 0;
            while(index < 3 && index < todaysEvents.length) {
                var evSpan = createElement('span', todaysEvents[index].calendar);
                element.appendChild(evSpan);
                ++index;
            }
            if (todaysEvents.length > 3){
                var elipsesSpan = createElement('span', "elipses_events");
                elipsesSpan.textContent =  '...';
                element.appendChild(elipsesSpan);
            }
        }
    }

    Calendar.prototype.getDayClass = function(day) {
        classes = ['day'];
        if(day.month() !== this.current.month()) {
            classes.push('other');
        } else if (today.isSame(day, 'day')) {
            classes.push('today');
        }
        return classes.join(' ');
    }

    Calendar.prototype.openDay = function(el) {
        var details, arrow;
        var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
        var day = this.current.clone().date(dayNumber);

        var currentOpened = document.querySelector('.details');

        //Check to see if there is an open detais box on the current row
        if(currentOpened && currentOpened.parentNode === el.parentNode) {
            details = currentOpened;
            arrow = document.querySelector('.arrow');
        } else {
            //Close the open events on differnt week row
            //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
            if(currentOpened) {
                currentOpened.addEventListener('webkitAnimationEnd', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('oanimationend', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('msAnimationEnd', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.addEventListener('animationend', function() {
                    currentOpened.parentNode.removeChild(currentOpened);
                });
                currentOpened.className = 'details out';
            }

            //Create the Details Container
            details = createElement('div', 'details in');

            //Create the arrow
            var arrow = createElement('div', 'arrow');

            //Create the event wrapper

            details.appendChild(arrow);
            el.parentNode.appendChild(details);
        }

        var todaysEvents = this.events.reduce(function(memo, ev) {
            eventDate = new Date(ev.date);
            eventDate.setDate(eventDate.getDate() + 1);
            if(sameDate(eventDate, new Date(day))) {
            memo.push(ev);
            }
            return memo;
        }, []);

        this.renderEvents(todaysEvents, details);

        arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 45 + 'px';
    }

    Calendar.prototype.renderEvents = function(events, ele) {
        api_get_groups(function (result){
            //Remove any events in the current details element
            var currentWrapper = ele.querySelector('.events');
            var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

            events.forEach(function(ev) {
                colors = result.groups[0];
                var div = createElement('div', 'event');
                var eventLeft = createElement('div', 'event-left')
                var square = createElement('div', 'event-category ' + ev.calendar);
                var jsquare = $(square).css("--color", colors[ev.calendar]);
                var span = createElement('span', '', ev.eventName);

                var timeStr = ev.time + " am";
                if (ev.time > "12:59"){
                var hour = parseInt(ev.time.slice(0,2));
                var minute = parseInt(ev.time.slice(3, 5));
                if (minute < 10) {
                    minute = minute + "0";
                }
                hour -= 12;
                timeStr = hour + ":" + minute + " pm";
                }

                var eventRight = createElement('div', 'event-right');
                var time = createElement('span', 'light', timeStr);
                var dueAt = createElement('span', 'light', 'Due at: ')

                eventRight.appendChild(dueAt);
                eventRight.appendChild(time);
                $(eventLeft).append(jsquare);
                eventLeft.appendChild(span);
                div.appendChild(eventLeft);
                div.appendChild(eventRight);
                wrapper.appendChild(div);
            });

            if(!events.length) {
                var div = createElement('div', 'event empty');
                var span = createElement('span', '', 'No Events');

                div.appendChild(span);
                wrapper.appendChild(div);
            }

            if(currentWrapper) {
                currentWrapper.className = 'events out';
                currentWrapper.addEventListener('webkitAnimationEnd', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
                });
                currentWrapper.addEventListener('oanimationend', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
                });
                currentWrapper.addEventListener('msAnimationEnd', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
                });
                currentWrapper.addEventListener('animationend', function() {
                currentWrapper.parentNode.removeChild(currentWrapper);
                ele.appendChild(wrapper);
                });
            } else {
                ele.appendChild(wrapper);
            }
        });
    }

    Calendar.prototype.drawLegend = function() {
    var legend = createElement('div', 'legend');
    var calendars = this.events.map(function(e) {
        return e.calendar + '|' + e.calendar;
    }).reduce(function(memo, e) {
        if(memo.indexOf(e) === -1) {
        memo.push(e);
        }
        return memo;
    }, []).forEach(function(e) {
        var parts = e.split('|');
        var entry = createElement('span', 'entry ' +  parts[1], parts[0]);
        legend.appendChild(entry);
    });
    this.el.appendChild(legend);
    }

    Calendar.prototype.nextMonth = function() {
    this.current.add('months', 1);
    this.next = true;
    this.draw();
    }

    Calendar.prototype.prevMonth = function() {
    this.current.subtract('months', 1);
    this.next = false;
    this.draw();
    }

    window.Calendar = Calendar;

    function createElement(tagName, className, innerText) {
    var ele = document.createElement(tagName);
    if(className) {
        ele.className = className;
    }
    if(innerText) {
        ele.innderText = ele.textContent = innerText;
    }
    return ele;
    }
};

function addEventsToCal(taskList) {
    var data = [];
    for(const task of taskList) {
        eventName = task.description;
        date = task.literal_date;
        var color;
        if (task.group == "Homework") color = "green";
        else if (task.group == "Extracurriculars") color = "yellow";
        else if (task.group == "Classes") color = "blue";
        else if (task.group == "Tests") color = "orange";
        else color = "purple";
        data.push({eventName, calendar: task.group, color, date, time:task.time});
    }
    date = moment(new Date($('#date-tracker').html())).startOf('month');
    var calendar = new Calendar('#calendar', data, date);
};