/* API CALLS */

function api_get_tasks(success_function) {
    $.ajax({url:"api/tasks", type:"GET", 
            success:success_function});
}

function api_create_task(task, success_function) {
    console.log("creating task with:", task)
    $.ajax({url:"api/tasks", type:"POST", 
            data:JSON.stringify(task), 
            contentType:"application/json; charset=utf-8",
            success:success_function});
}

function api_update_task(task, success_function) {
    console.log("updating task with:", task)
    task.id = parseInt(task.id)
    $.ajax({url:"api/tasks", type:"PUT", 
            data:JSON.stringify(task), 
            contentType:"application/json; charset=utf-8",
            success:success_function});
}

function api_delete_task(task, success_function) {
    console.log("deleting task with:", task)
    task.id = parseInt(task.id)
    $.ajax({url:"api/tasks", type:"DELETE", 
            data:JSON.stringify(task), 
            contentType:"application/json; charset=utf-8",
            success:success_function});
}

/* KEYPRESS MONITOR */

function input_keypress(event) {
    if (event.target.id != "current_input") {
    $("#current_input").val(event.target.id)
    }
    id = event.target.id.replace("input-","").replace("-date","");
    $("#filler-"+id).prop('hidden', true);
    $("#save_edit-"+id).prop('hidden', false);
    $("#undo_edit-"+id).prop('hidden', false);
}

/* EVENT HANDLERS */

function move_task(event) {
    console.log("move item", event.target.id )
    id = event.target.id.replace("move_task-","");
    target_list = event.target.className.search("today") > 0 ? "tomorrow" : "today";
    api_update_task({'id':id, 'list':target_list},
                    function(result) { 
                    console.log(result);
                    get_current_tasks(new Date($('#date-tracker').html()));
                    } );
}

function complete_task(event) {
    console.log("complete item", event.target.id )
    id = event.target.id.replace("description-","");
    completed = event.target.className.search("completed") > 0;
    console.log("updating :",{'id':id, 'completed':completed==false})
    api_update_task({'id':id, 'completed':completed==false}, 
                    function(result) { 
                    console.log(result);
                    get_current_tasks(new Date($('#date-tracker').html()));
                    } );
}

function edit_task(event) {
    console.log("edit item", event.target.id)
    id = event.target.id.replace("edit_task-","");
    // move the text to the input editor
    $("#input-"+id).val($("#description-"+id).text());
    // hide the text display
    $("#move_task-"+id).prop('hidden', true);
    $("#description-"+id).prop('hidden', true);
    $("#edit_task-"+id).prop('hidden', true);
    $("#delete_task-"+id).prop('hidden', true);
    // show the editor
    $("#editor-"+id).css('display', 'flex');
    $("#save_edit-"+id).prop('hidden', false);
    $("#undo_edit-"+id).prop('hidden', false);
    // set the editing flag
    $("#current_input").val(event.target.id)
}

function save_edit(event) {
    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    console.log("save item", event.target.id);
    id = event.target.id.replace("save_edit-","");
    console.log("desc to save = ",$("#input-" + id).val());

    if (!isValidDate(new Date($("#input-" + id + "-date").val()))){
        alert("Invalid date!");
        return;
    }
    if ($("#input-" + id).val() === ""){
        alert("Task is required!");
        return;
    }
    if ($("#input-" + id + "-group").val() === ""){
        alert("Group is required!");
        return;
    }
    if ($("#input-" + id + "-time").val() === ""){
        alert("Time is required!");
        return;
    }

    if ((id != "today") & (id != "tomorrow") & (id != "task")) {
    api_update_task({'id':id, 
                    description:$("#input-" + id).val(), 
                    date:$("#input-" + id + "-date").val(), 
                    literal_date: new Date($("#input-" + id + "-date").val()), 
                    group:$("#input-" + id + "-group").val(), 
                    time:$("#input-" + id + "-time").val()},
                    function(result) { 
                        console.log(result);
                        get_current_tasks(new Date($('#date-tracker').html()));
                        $("#current_input").val("")
                    } );
    } else {
    api_create_task({description:$("#input-" + id).val(), 
                    list:id, date:$("#input-" + id + "-date").val(), 
                    literal_date: new Date($("#input-" + id + "-date").val()), 
                    group:$("#input-" + id + "-group").val(), 
                    time:$("#input-" + id + "-time").val()},
                    function(result) { 
                        console.log(result);
                        get_current_tasks(new Date($('#date-tracker').html()));
                        $("#current_input").val("")
                    } );
    }
}

function undo_edit(event) {
    id = event.target.id.replace("undo_edit-","")
    console.log("undo",[id])
    $("#input-" + id).val("");
    if ((id != "today") & (id != "tomorrow") & (id != "task")) {
        // hide the editor
        $("#editor-"+id).css('display', 'none');
        $("#save_edit-"+id).prop('hidden', true);
        $("#undo_edit-"+id).prop('hidden', true);
        // show the text display
        $("#move_task-"+id).prop('hidden', false);
        $("#description-"+id).prop('hidden', false);
        $("#filler-"+id).prop('hidden', false);
        $("#edit_task-"+id).prop('hidden', false);
        $("#delete_task-"+id).prop('hidden', false);
    }
    else {
        $("#save_edit-"+id).prop('hidden', true);
        $("#undo_edit-"+id).prop('hidden', true);
        $("#move_task-"+id).prop('hidden', false);
        $("#description-"+id).prop('hidden', false);
        $("#filler-"+id).prop('hidden', false);
        $("#edit_task-"+id).prop('hidden', false);
        $("#delete_task-"+id).prop('hidden', false);
    }
    
    // set the editing flag
    $("#current_input").val("")
}

function delete_task(event) {
    console.log("delete item", event.target.id )
    id = event.target.id.replace("delete_task-","");
    api_delete_task({'id':id},
                    function(result) { 
                    console.log(result);
                    get_current_tasks(new Date($('#date-tracker').html()));
                    } );
}

function delete_all_tasks() {
    if (confirm("Are you sure you want to delete all tasks in your taskbook?")) {
    api_get_tasks(function(result){
        for (const task of result.tasks) {  
        api_delete_task({'id':task.id},
                            function(result) { 
                            console.log(result);
                            });
        }
        get_current_tasks(new Date($('#date-tracker').html()));
    });
    }
    else {
    get_current_tasks(new Date($('#date-tracker').html()));
    }
}

// Creates and displays each task in the table
function display_task(x) {
    completed = x.completed ? " completed" : "";

    curr_day = new Date($('#date-tracker').html());
    next_day = new Date(curr_day);
    curr_day = formattedDate(curr_day);
    next_day.setDate(next_day.getDate() + 1);
    next_day = formattedDate(next_day);
    if (x.date == curr_day || x.date == next_day) {
        t = '<tr id="task-'+x.id+'" class="task">' + 
            '  <td><span id="description-'+x.id+'" class="description' + completed + '">' + x.description + '</span>' + 
            '      <span id="editor-'+x.id+'" class="existing-editor" hidden>' + 
            '        <input id="input-'+x.id+'" style="height:22px" class="w3-input" type="text" autofocus required/>' +
            '        <input id="input-'+x.id+'-date" style="height:22px; margin-left:10px" class="w3-input"' +
            '         type="date" autofocus required> ' +
            '      </span>' + 
            '  </td>' +
            '  <td class="icons">' +
            '    <span id="edit_task-'+x.id+'" class="edit_task '+x.list+' material-icons">edit</span>' +
            '    <span id="delete_task-'+x.id+'" class="delete_task material-icons">delete</span>' +
            '    <span id="save_edit-'+x.id+'" hidden class="save_edit material-icons">done</span>' + 
            '    <span id="undo_edit-'+x.id+'" hidden class="undo_edit material-icons">cancel</span>' +
            '  </td>' +
            '</tr>';
        $("#task-list-" + x.group).append(t);
        $("#input-" + x.id + "-date").val(x.date); 
        $("#current_input").val("");
    }

    else {
        t = '<tr id="task-'+x.id+'" class="task">' + 
            '  <td><span id="description-'+x.id+'" class="description' + completed + '">' + x.description + '</span>' + 
            '      <span id="editor-'+x.id+'" class="existing-editor" hidden>' + 
            '        <input id="input-'+x.id+'" style="height:22px" class="w3-input" type="text" autofocus required/>' +
            '        <input id="input-'+x.id+'-date" style="height:22px; margin-left:10px" class="w3-input"' +
            '         type="date" autofocus required> ' +
            '      </span>' + 
            '  </td>' +
            '  <td class="icons" style="display:flex; flex-direction: row; align-items: center;">' +
            '    <p style="margin-right: 10px; color: rgb(177, 177, 177);" class="description' + completed + '">Due: '+x.date+'</p>' +
            '    <span id="edit_task-'+x.id+'" class="edit_task '+x.list+' material-icons">edit</span>' +
            '    <span id="delete_task-'+x.id+'" class="delete_task material-icons">delete</span>' +
            '    <span id="save_edit-'+x.id+'" hidden class="save_edit material-icons">done</span>' + 
            '    <span id="undo_edit-'+x.id+'" hidden class="undo_edit material-icons">cancel</span>' +
            '  </td>' +
            '</tr>';

        $("#task-list-" + x.group).append(t);
        $("#input-" + x.id + "-date").val(x.date); 
        $("#current_input").val("");
    }
}

// Properly formats dates for comparison functions
function formattedDate(date) {
    date_day_num = date.getDate();
    date_month_num = date.getMonth() + 1;
    date_year_num = date.getFullYear();

    if (date_month_num < 10) date_month_num = "0" + date_month_num;
    if (date_day_num < 10) date_day_num = "0" + date_day_num;
    date_string = date_year_num + "-" + date_month_num + "-" + date_day_num;
    return date_string;
}

// Manages which groups are enabled
var homeworkEnabled = true;
var extracurricularsEnabled = false;
var classesEnabled = true;
var testsEnabled = false;

function setHomeworkEnabled() {homeworkEnabled = !homeworkEnabled; manageAtLeastOneEnabled(); get_current_tasks(new Date($('#date-tracker').html())); }
function setextracurricularsEnabled() {extracurricularsEnabled = !extracurricularsEnabled; manageAtLeastOneEnabled(); get_current_tasks(new Date($('#date-tracker').html())); }
function setClassesEnabled() {classesEnabled = !classesEnabled; manageAtLeastOneEnabled(); get_current_tasks(new Date($('#date-tracker').html())); }
function setTestsEnabled() {testsEnabled = !testsEnabled; manageAtLeastOneEnabled(); get_current_tasks(new Date($('#date-tracker').html())); }
function manageAtLeastOneEnabled() {
    if (!homeworkEnabled && !extracurricularsEnabled && !classesEnabled && !testsEnabled) {
    homeworkEnabled = true;
    }
}
///////////////////////////////

// Creates the task list and layout
function grouped_task_list(day) {
    $("#task_lists").empty();

    var t = '<div class="task_list_single w3-row w3-bottombar w3-topbar w3-leftbar w3-rightbar w3-border-gray w3-blue-gray" style="display:flex; flex-direction:row; width: 100%">';
    var buttons = "";

    if (homeworkEnabled) {
    t +=' <div class="task_table_display"> ' +
        '   <div class="w3-col s6 w3-container w3-rightbar w3-border-gray tasks_table">' +
        '     <div class="w3-row w3-xxlarge w3-bottombar w3-border-light-gray w3-margin-bottom">' +
        '       <h2>Homework</h2>' +
        '     </div>' +
        '     <table id="task-list-Homework" class="w3-table task-list">' +
        '     </table>' +
        '   </div>' +
        '   <div class="w3-row w3-bottombar w3-border-light-gray w3-margin-bottom w3-margin-top" style="width: 95%"></div>' +
        ' </div> ';
    buttons +='   <div id="group_selector_homework" class="group_button active">';
    }
    else {
    buttons +='   <div id="group_selector_homework" class="group_button inactive">';
    }
    buttons +='     <p class="group_label">Homework</p>'+
            '   </div>';

    if (extracurricularsEnabled) {
    t +=' <div class="task_table_display"> ' +
        '   <div class="w3-col s6 w3-container w3-rightbar w3-border-gray tasks_table">' +
        '     <div class="w3-row w3-xxlarge w3-bottombar w3-border-light-gray w3-margin-bottom">' +
        '       <h2>Extracurriculars</h2>' +
        '     </div>' +
        '     <table id="task-list-Extracurriculars" class="w3-table task-list">' +
        '     </table>' +
        '   </div>' +
        '   <div class="w3-row w3-bottombar w3-border-light-gray w3-margin-bottom w3-margin-top" style="width: 95%"></div>' +
        ' </div> ';
    buttons +='   <div id="group_selector_extra" class="group_button active">';
    }
    else {
    buttons +='   <div id="group_selector_extra" class="group_button inactive">';
    }
    buttons +='     <p class="group_label">Extracurriculars</p>'+
            '   </div>';

    if (classesEnabled) {
    t +=' <div class="task_table_display"> ' +
        '   <div class="w3-col s6 w3-container w3-rightbar w3-border-gray tasks_table">' +
        '     <div class="w3-row w3-xxlarge w3-bottombar w3-border-light-gray w3-margin-bottom">' +
        '       <h2>Classes</h2>' +
        '     </div>' +
        '     <table id="task-list-Classes" class="w3-table task-list">' +
        '     </table>' +
        '   </div>' +
        '   <div class="w3-row w3-bottombar w3-border-light-gray w3-margin-bottom w3-margin-top" style="width: 95%"></div>' +
        ' </div> ';
    buttons +='   <div id="group_selector_classes" class="group_button active">';
    }
    else {
    buttons +='   <div id="group_selector_classes" class="group_button inactive">';
    }
    buttons +='     <p class="group_label">Classes</p>'+
            '   </div>';

    if (testsEnabled) {
    t +=' <div class="task_table_display"> ' +
        '   <div class="w3-col s6 w3-container w3-rightbar w3-border-gray tasks_table">' +
        '     <div class="w3-row w3-xxlarge w3-bottombar w3-border-light-gray w3-margin-bottom">' +
        '       <h2>Tests</h2>' +
        '     </div>' +
        '     <table id="task-list-Tests" class="w3-table task-list">' +
        '     </table>' +
        '   </div>' +
        '   <div class="w3-row w3-bottombar w3-border-light-gray w3-margin-bottom w3-margin-top" style="width: 95%"></div>' +
        ' </div> ';
    buttons +='   <div id="group_selector_tests" class="group_button active">';
    }
    else {
    buttons +='   <div id="group_selector_tests" class="group_button inactive">';
    }
    buttons +='     <p class="group_label">Tests</p>'+
            '   </div>';

    t +=' <div id="sidebar"><div id="group-selectors" class="w3-bottombar">' + buttons + '</div><div id="calendar"></div></div>';


    t +='</div>'+
        '<span id="date-tracker" hidden>'+day+'</span>';
    $("#task_lists").append(t);
    $("#current_input").val("");
}

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

        todaysEvents.forEach(function(ev) {
        var evSpan = createElement('span', ev.color);
        element.appendChild(evSpan);
        });
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

    arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
    }

    Calendar.prototype.renderEvents = function(events, ele) {
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    events.forEach(function(ev) {
        var div = createElement('div', 'event');
        var eventLeft = createElement('div', 'event-left')
        var square = createElement('div', 'event-category ' + ev.color);
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
        eventLeft.appendChild(square);
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
    }

    Calendar.prototype.drawLegend = function() {
    var legend = createElement('div', 'legend');
    var calendars = this.events.map(function(e) {
        return e.calendar + '|' + e.color;
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

function count_events_per_group(taskList) {
    var homeworkCount = 0;
    var extraCount = 0;
    var classesCount = 0;
    var testsCount = 0;

    for(const task of taskList) {
    if (task.group == "Homework") homeworkCount++;
    else if (task.group == "Extracurriculars") extraCount++;
    else if (task.group == "Classes") classesCount++;
    else if (task.group == "Tests") testsCount++;
    }

    h = '<span class="group_count">' + homeworkCount + '</span>';
    e = '<span class="group_count">' + extraCount + '</span>';
    c = '<span class="group_count">' + classesCount + '</span>';
    t = '<span class="group_count">' + testsCount + '</span>';

    $("#group_selector_homework").append(h);
    $("#group_selector_extra").append(e);
    $("#group_selector_classes").append(c);
    $("#group_selector_tests").append(t);
}

// Entry point for entire page
// Reloads page each time it is called
function get_current_tasks(curr_day = new Date()) {
    // remove the old tasks
    $(".task").remove();
    // display the tasks
    next_day = new Date(curr_day);
    next_day.setDate(next_day.getDate() + 1);
    grouped_task_list(curr_day);
    api_get_tasks(function(result){
    for (const task of result.tasks) {
        display_task(task);
    }
    createCalendar();
    addEventsToCal(result.tasks);
    count_events_per_group(result.tasks);
    // wire the response events 
    $(".move_task").off("click").bind("click", move_task);
    $(".description").off("click").bind("click", complete_task)
    $(".edit_task").off("click").bind("click", edit_task);
    $(".save_edit").off("click").bind("click", save_edit);
    $(".undo_edit").off("click").bind("click", undo_edit);
    $(".delete_task").off("click").bind("click", delete_task);
    $(".advance_date").off("click").bind("click", increment_date);
    $(".previous_date").off("click").bind("click", decrement_date);
    $(".find_date").off("click").bind("click", find_date);
    $("#delete_all_tasks").off("click").bind("click", delete_all_tasks);
    // set all inputs to set flag
    $("input").off("click").bind("change", input_keypress);
    $("input").off("click").bind("keydown", input_keypress);

    // add group selector events
    $("#group_selector_homework").off("click").bind("click", setHomeworkEnabled);
    $("#group_selector_extra").off("click").bind("click", setextracurricularsEnabled);
    $("#group_selector_classes").off("click").bind("click", setClassesEnabled);
    $("#group_selector_tests").off("click").bind("click", setTestsEnabled);
    });
}

// Run Entry function on page load
$(document).ready(function() {
    get_current_tasks()
});