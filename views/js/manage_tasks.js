/* API CALLS */

function api_get_tasks(success_function) {
    $.ajax({url:"api/tasks", type:"GET", 
            success:success_function});
}

function api_get_groups(success_function) {
    $.ajax({url:"api/options/groups", type:"GET", 
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

function api_update_group_colors(colors, success_function) {
    console.log("updating group colors with", colors);
    colors.id = parseInt(colors.id)
    $.ajax({url:"api/options/groups", type:"PUT",
            data:JSON.stringify(colors),
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
    if ($("#verification").val().toUpperCase() === "DELETE ALL TASKS") {
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
    }
    else {
        alert("Please enter: 'Delete all tasks' without the quotes and press enter.");
        return;
    }
}

function update_group_colors(event) {
    console.log("save item", event.target.id);
    id = event.target.id.replace("save_edit-","");
    console.log("desc to save = ",$("#input-" + id).val());
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

// Creates and displays each task in the table
function display_task(x) {
    completed = x.completed ? " completed" : "";
    t = '<tr id="task-'+x.id+'" class="task' + completed + '">' + 
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
        '     <div class="w3-row w3-xxlarge w3-bottombar w3-border-light-gray w3-margin-bottom task_table_header">' +
        '       <span class="Homework"></span>' +
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
        '     <div class="w3-row w3-xxlarge w3-bottombar w3-border-light-gray w3-margin-bottom task_table_header">' +
        '       <span class="Extracurriculars"></span>' +
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
        '     <div class="w3-row w3-xxlarge w3-bottombar w3-border-light-gray w3-margin-bottom task_table_header">' +
        '       <span class="Classes"></span>' +
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
        '     <div class="w3-row w3-xxlarge w3-bottombar w3-border-light-gray w3-margin-bottom task_table_header">' +
        '       <span class="Tests"></span>' +
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

    h = '<span class="group_count Homework"><div class="group_count_text">' + homeworkCount + '</div></span>';
    e = '<span class="group_count Extracurriculars"><div class="group_count_text">' + extraCount + '</div></span>';
    c = '<span class="group_count Classes"><div class="group_count_text">' + classesCount + '</div></span>';
    t = '<span class="group_count Tests"><div class="group_count_text">' + testsCount + '</div></span>';

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
        $("#verification").off("keypress").bind("keypress", function(e) {
            if (e.key === "Enter") {
                delete_all_tasks();
            }
        });
        // set all inputs to set flag
        $("input").off("click").bind("change", input_keypress);
        $("input").off("click").bind("keydown", input_keypress);

        // add group selector events
        $("#group_selector_homework").off("click").bind("click", setHomeworkEnabled);
        $("#group_selector_extra").off("click").bind("click", setextracurricularsEnabled);
        $("#group_selector_classes").off("click").bind("click", setClassesEnabled);
        $("#group_selector_tests").off("click").bind("click", setTestsEnabled);
        $(".page_container").off("click").bind("click", function(e) {
            closeMenu();
            $("#verification").val("");
        });
        $(".settings_button").off("click").bind("click", function(e) {
            toggleMenu();
            $("#verification").val("");
        });
        $("#submit_changes").off("click").bind("click", submitSettingsChanges);
        $("#verification").keypress(function(e){
            if (e.key === "Enter") {
                delete_all_tasks();
            }
        });

        assignGroupColorsFromDB();
    });
}
