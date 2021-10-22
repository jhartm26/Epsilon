% include("header.tpl")
% include("banner.tpl")

<style>
  .save_edit, .undo_edit, .move_task, .description, .edit_task, .delete_task {
    cursor: pointer;
  }
  .completed {text-decoration: line-through;}
  .description { padding-left:8px }
  .task-creation {
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
  .task-creation-container {
    margin: auto;
    margin-top: 25px;
    padding-bottom: 25px;
    border-top: 6px solid black;
    border-bottom: 6px solid black;
    width: 70%;
  }
  .task-list {
    width: 100% !important;
  }
  .task {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .icons {
    display: flex !important;
    flex-direction: row;
    margin-right: 10px;
  }
  .existing-editor {
    display: none;
    flex-direction: row;
    align-items: center;
  }
  #find_date {
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    align-items: center;
  }
  #task_lists {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 500px !important;
  }
  .tasks_table {
    min-height: 500px !important;
    display: flex !important;
    flex-direction: column;
    justify-content: flex-start;
    width: 100% !important;
  }
  .task_table_display {
    display: flex !important;
    flex-direction: column;
    justify-content: space-between !important;
    width: 50% !important;
    align-items: center !important;
  }
  #task_book_buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
  }
  #delete_all_tasks {
    margin-top: 25px;
    border: 3px solid black;
    border-radius: 25px;
    background-color: black;
    color: white; 
    width: 150px;
    text-align: center;
    cursor: pointer;
  }
  #other-task-table {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
  }

  *, *:before, *:after {
  -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box;
  }

  #calendar {
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    width: 590px;
    margin: 0 auto;
    margin-top: 25px;
    padding-bottom: -45px;
    height: 585px;
    overflow: hidden;
    border: 10px solid rgb(74,74,74);
    border-radius: 25px;
    background-color: rgb(74,74,74);
  }

  .header {
    height: 50px;
    width: 420px;
    background: rgba(66, 66, 66, 1);
    text-align: center;
    position: relative;
    z-index: 100;
    color: white;
  }

  .header h1 {
    margin: 0;
    padding: 0;
    font-size: 20px;
    line-height: 50px;
    font-weight: 100;
    letter-spacing: 1px;
  }

  .left, .right {
    position: absolute;
    width: 0px;
    height: 0px;
    border-style: solid;
    top: 50%;
    margin-top: -7.5px;
    cursor: pointer;
  }

  .left {
    border-width: 7.5px 10px 7.5px 0;
    border-color: transparent rgba(160, 159, 160, 1) transparent transparent;
    left: 20px;
  }

  .right {
    border-width: 7.5px 0 7.5px 10px;
    border-color: transparent transparent transparent rgba(160, 159, 160, 1);
    right: 20px;
  }

  .month {
    /*overflow: hidden;*/
    opacity: 0;
    padding-bottom: 15px
  }

  .month.new {
    -webkit-animation: fadeIn 1s ease-out;
    opacity: 1;
  }

  .month.in.next {
    -webkit-animation: moveFromTopFadeMonth .4s ease-out;
    -moz-animation: moveFromTopFadeMonth .4s ease-out;
    animation: moveFromTopFadeMonth .4s ease-out;
    opacity: 1;
  }

  .month.out.next {
    -webkit-animation: moveToTopFadeMonth .4s ease-in;
    -moz-animation: moveToTopFadeMonth .4s ease-in;
    animation: moveToTopFadeMonth .4s ease-in;
    opacity: 1;
  }

  .month.in.prev {
    -webkit-animation: moveFromBottomFadeMonth .4s ease-out;
    -moz-animation: moveFromBottomFadeMonth .4s ease-out;
    animation: moveFromBottomFadeMonth .4s ease-out;
    opacity: 1;
  }

  .month.out.prev {
    -webkit-animation: moveToBottomFadeMonth .4s ease-in;
    -moz-animation: moveToBottomFadeMonth .4s ease-in;
    animation: moveToBottomFadeMonth .4s ease-in;
    opacity: 1;
  }

  .week {
  background: #4A4A4A;
  }

  .day {
    display: inline-block;
    width: 60px;
    padding: 10px;
    text-align: center;
    vertical-align: top;
    cursor: pointer;
    background: #4A4A4A;
    position: relative;
    z-index: 100;
  }

  .day.other {
  color: rgba(255, 255, 255, .3);
  }

  .day.today {
    color: rgba(156, 202, 235, 1);
  }

  .day-name {
    font-size: 9px;
    text-transform: uppercase;
    margin-bottom: 5px;
    color: rgba(255, 255, 255, .5);
    letter-spacing: .7px;
  }

  .day-number {
    font-size: 24px;
    letter-spacing: 1.5px;
  }


  .day .day-events {
    list-style: none;
    margin-top: 3px;
    text-align: center;
    height: 12px;
    line-height: 6px;
    overflow: hidden;
  }

  .day .day-events span {
    vertical-align: top;
    display: inline-block;
    padding: 0;
    margin: 0;
    width: 5px;
    height: 5px;
    line-height: 5px;
    margin: 0 1px;
  }

  .blue { background: rgba(156, 202, 235, 1); }
  .orange { background: rgba(247, 167, 0, 1); }
  .green { background: rgba(153, 198, 109, 1); }
  .yellow { background: rgba(249, 233, 0, 1); }

  .details {
    position: relative;
    width: 420px;
    height: 75px;
    background: rgba(164, 164, 164, 1);
    margin-top: 5px;
    border-radius: 4px;
  }

  .details.in {
    -webkit-animation: moveFromTopFade .5s ease both;
    -moz-animation: moveFromTopFade .5s ease both;
    animation: moveFromTopFade .5s ease both;
  }

  .details.out {
    -webkit-animation: moveToTopFade .5s ease both;
    -moz-animation: moveToTopFade .5s ease both;
    animation: moveToTopFade .5s ease both;
  }

  .arrow {
    position: absolute;
    top: -5px;
    left: 50%;
    margin-left: -2px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent rgba(164, 164, 164, 1) transparent;
    transition: all 0.7s ease;
  }

  .events {
    height: 75px;
    padding: 7px 0;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .events.in {
    -webkit-animation: fadeIn .3s ease both;
    -moz-animation: fadeIn .3s ease both;
    animation: fadeIn .3s ease both;
  }

  .events.in {
    -webkit-animation-delay: .3s;
    -moz-animation-delay: .3s;
    animation-delay: .3s;
  }

  .details.out .events {
    -webkit-animation: fadeOutShrink .4s ease both;
    -moz-animation: fadeOutShink .4s ease both;
    animation: fadeOutShink .4s ease both;
  }

  .events.out {
    -webkit-animation: fadeOut .3s ease both;
    -moz-animation: fadeOut .3s ease both;
    animation: fadeOut .3s ease both;
  }

  .event {
    font-size: 16px;
    line-height: 22px;
    letter-spacing: .5px;
    padding: 2px 16px;
    vertical-align: top;
  }

  .event.empty {
    color: #eee;
  }

  .event-category {
    height: 10px;
    width: 10px;
    display: inline-block;
    margin: 6px 0 0;
    vertical-align: top;
  }

  .event span {
    display: inline-block;
    padding: 0 0 0 7px;
  }

  .legend {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 30px;
    background: rgba(60, 60, 60, 1);
    line-height: 30px;

  }

  .entry {
    position: relative;
    padding: 0 0 0 25px;
    font-size: 13px;
    display: inline-block;
    line-height: 30px;
    background: transparent;
  }

  .entry:after {
    position: absolute;
    content: '';
    height: 5px;
    width: 5px;
    top: 12px;
    left: 14px;
  }

  .entry.blue:after { background: rgba(156, 202, 235, 1); }
  .entry.orange:after { background: rgba(247, 167, 0, 1); }
  .entry.green:after { background: rgba(153, 198, 109, 1); }
  .entry.yellow:after { background: rgba(249, 233, 0, 1); }

  /* Animations are cool!  */
  @-webkit-keyframes moveFromTopFade {
    from { opacity: .3; height:0px; margin-top:0px; -webkit-transform: translateY(-100%); }
  }
  @-moz-keyframes moveFromTopFade {
    from { height:0px; margin-top:0px; -moz-transform: translateY(-100%); }
  }
  @keyframes moveFromTopFade {
    from { height:0px; margin-top:0px; transform: translateY(-100%); }
  }

  @-webkit-keyframes moveToTopFade {
    to { opacity: .3; height:0px; margin-top:0px; opacity: 0.3; -webkit-transform: translateY(-100%); }
  }
  @-moz-keyframes moveToTopFade {
    to { height:0px; -moz-transform: translateY(-100%); }
  }
  @keyframes moveToTopFade {
    to { height:0px; transform: translateY(-100%); }
  }

  @-webkit-keyframes moveToTopFadeMonth {
    to { opacity: 0; -webkit-transform: translateY(-30%) scale(.95); }
  }
  @-moz-keyframes moveToTopFadeMonth {
    to { opacity: 0; -moz-transform: translateY(-30%); }
  }
  @keyframes moveToTopFadeMonth {
    to { opacity: 0; -moz-transform: translateY(-30%); }
  }

  @-webkit-keyframes moveFromTopFadeMonth {
    from { opacity: 0; -webkit-transform: translateY(30%) scale(.95); }
  }
  @-moz-keyframes moveFromTopFadeMonth {
    from { opacity: 0; -moz-transform: translateY(30%); }
  }
  @keyframes moveFromTopFadeMonth {
    from { opacity: 0; -moz-transform: translateY(30%); }
  }

  @-webkit-keyframes moveToBottomFadeMonth {
    to { opacity: 0; -webkit-transform: translateY(30%) scale(.95); }
  }
  @-moz-keyframes moveToBottomFadeMonth {
    to { opacity: 0; -webkit-transform: translateY(30%); }
  }
  @keyframes moveToBottomFadeMonth {
    to { opacity: 0; -webkit-transform: translateY(30%); }
  }

  @-webkit-keyframes moveFromBottomFadeMonth {
    from { opacity: 0; -webkit-transform: translateY(-30%) scale(.95); }
  }
  @-moz-keyframes moveFromBottomFadeMonth {
    from { opacity: 0; -webkit-transform: translateY(-30%); }
  }
  @keyframes moveFromBottomFadeMonth {
    from { opacity: 0; -webkit-transform: translateY(-30%); }
  }

  @-webkit-keyframes fadeIn  {
    from { opacity: 0; }
  }
  @-moz-keyframes fadeIn  {
    from { opacity: 0; }
  }
  @keyframes fadeIn  {
    from { opacity: 0; }
  }

  @-webkit-keyframes fadeOut  {
    to { opacity: 0; }
  }
  @-moz-keyframes fadeOut  {
    to { opacity: 0; }
  }
  @keyframes fadeOut  {
    to { opacity: 0; }
  }

  @-webkit-keyframes fadeOutShink  {
    to { opacity: 0; padding: 0px; height: 0px; }
  }
  @-moz-keyframes fadeOutShink  {
    to { opacity: 0; padding: 0px; height: 0px; }
  }
  @keyframes fadeOutShink  {
    to { opacity: 0; padding: 0px; height: 0px; }
  }
</style>

<div class="task-creation-container">
  <div class="task-creation">
    <tr id="task" class="task">
      <td style="width:36px"></td>
      <td><span id="editor-task">
            <input id="input-task" style="height:22px; width:50vw;" class="w3-input"
              type="text" autofocus placeholder="Add an item..." required/>
            <input id="input-task-date" style="height:25px; margin-top:10px; width:50vw;" class="w3-input"
              type="date" autofocus required>
          </span>
      </td>
      <td style="width:72px">
        <span id="filler-task" class="material-icons">more_horiz</span>
        <span id="save_edit-task" hidden class="save_edit material-icons">done</span>
        <span id="undo_edit-task" hidden class="undo_edit material-icons">cancel</span>
      </td>
    </tr>
  </div>
</div>
<div id="find_date">
  <p>Enter a date to find: </p>
  <input id="input-date-find" style="height:22px; width:20vw;" class="w3-input"
    type="date" autofocus/>
  <td>
    <span id="filler-date-find" class="material-icons">more_horiz</span>
    <span id="save_edit-date-find" hidden class="find_date material-icons">done</span>
    <span id="undo_edit-date-find" hidden class="undo_edit material-icons">cancel</span>
  </td>
</div>
<div id="task_book_buttons">
  <div id="delete_all_tasks">
    <p>Delete All Tasks</p>
  </div>
</div>
<div id="task_lists"></div>
<input id="current_input" hidden value=""/> 


<script>

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
  console.log("save item", event.target.id)
  id = event.target.id.replace("save_edit-","");
  console.log("desc to save = ",$("#input-" + id).val())
  if ((id != "today") & (id != "tomorrow") & (id != "task")) {
    api_update_task({'id':id, description:$("#input-" + id).val(), date:$("#input-" + id + "-date").val(), literal_date: new Date($("#input-" + id + "-date").val())},
                    function(result) { 
                      console.log(result);
                      get_current_tasks(new Date($('#date-tracker').html()));
                      $("#current_input").val("")
                    } );
  } else {
    api_create_task({description:$("#input-" + id).val(), list:id, date:$("#input-" + id + "-date").val(), literal_date: new Date($("#input-" + id + "-date").val())},
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
    $("#task-list-" + x.date).append(t);
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

    $("#task-list-others").append(t);
    $("#input-" + x.id + "-date").val(x.date); 
    $("#current_input").val("");
  }
}

function increment_date() {
  curr_date = $('#date-tracker').html();
  next_date = new Date(curr_date);
  next_date.setDate(next_date.getDate() + 1);
  get_current_tasks(next_date);
}

function decrement_date() {
  curr_date = $('#date-tracker').html();
  next_date = new Date(curr_date);
  next_date.setDate(next_date.getDate() - 1);
  get_current_tasks(next_date);
}

function find_date() {
  date_to_find = new Date($("#input-date-find").val());
  date_to_find.setDate(date_to_find.getDate() + 1);
  get_current_tasks(date_to_find);
}

function formattedDate(date) {
  date_day_num = date.getDate();
  date_month_num = date.getMonth() + 1;
  date_year_num = date.getFullYear();

  if (date_month_num < 10) date_month_num = "0" + date_month_num;
  if (date_day_num < 10) date_day_num = "0" + date_day_num;
  date_string = date_year_num + "-" + date_month_num + "-" + date_day_num;
  return date_string;
}

function dated_task_lists(day, nextDay) {
  $("#task_lists").empty();
  curr_day_num = day.getDate();
  curr_month_num = day.getMonth() + 1;
  curr_year_num = day.getFullYear();
  curr_date = curr_month_num + "/" + curr_day_num + "/" + curr_year_num;

  curr_date_id = formattedDate(day);

  next_day_num = nextDay.getDate();
  next_month_num = nextDay.getMonth() + 1;
  next_year_num = nextDay.getFullYear();
  next_date = next_month_num + "/" + next_day_num + "/" + next_year_num;

  next_date_id = formattedDate(nextDay);

  t = '<div class="w3-row" style="display:flex; flex-direction:row; width: 100%">' +
      ' <span class="material-icons previous_date" style="align-self:center; cursor:pointer;">arrow_back</span>' +
      ' <div class="task_table_display"> ' +
      ' <div class="w3-col s6 w3-container w3-topbar w3-bottombar w3-leftbar w3-rightbar w3-border-white tasks_table">' +
      '   <div class="w3-row w3-xxlarge w3-bottombar w3-border-black w3-margin-bottom">' +
      '     <h2 id = "curr_date">'+curr_date+'</h2>' +
      '   </div>' +
      '   <table id="task-list-'+curr_date_id+'" class="w3-table task-list">' +
      '   </table>' +
      ' </div>' +
      ' <div class="w3-row w3-bottombar w3-border-black w3-margin-bottom w3-margin-top" style="width: 95%"></div>' +
      ' </div> ' +
      ' <div id="calendar"></div>' +
      ' <div class="task_table_display"> ' +
      ' <div class="w3-col s6 w3-container w3-topbar w3-bottombar w3-leftbar w3-rightbar w3-border-white tasks_table">' +
      '   <div class="w3-row w3-xxlarge w3-bottombar w3-border-black w3-margin-bottom">' +
      '     <h2 id = "next_date">'+next_date+'</h2>' +
      '   </div>' +
      '   <table  id="task-list-'+next_date_id+'" class="w3-table">' +
      '   </table>' +
      ' </div>' +
      ' <div class="w3-row w3-bottombar w3-border-black w3-margin-bottom w3-margin-top" style="width: 95%"></div>' +
      ' </div> ' +
      ' <span class="material-icons advance_date" style="align-self:center; cursor:pointer;">arrow_forward</span>' +
      '</div>' +
      '<span id="date-tracker" hidden>'+day+'</span>' +  
      '<div class="task_table_display"> ' +
      ' <div id="other-task-table">' +
      '  <div class="w3-col s6 w3-container w3-topbar w3-bottombar w3-leftbar w3-rightbar w3-border-white tasks_table">' +
      '    <div class="w3-row w3-xxlarge w3-bottombar w3-border-black w3-margin-bottom">' +
      '      <h2 id = "next_date"> Other tasks </h2>' +
      '    </div>' +
      '    <table  id="task-list-others" class="w3-table">' +
      '    </table>' +
      '  </div>' +
      '  <div class="w3-row w3-bottombar w3-border-black w3-margin-bottom w3-margin-top" style="width: 98%"></div>' +
      ' </div> ' +
      '</div>';
  $("#task_lists").append(t);
  $("#current_input").val("");
}

function get_current_tasks(curr_day = new Date()) {
  // remove the old tasks
  $(".task").remove();
  // display the tasks
  next_day = new Date(curr_day);
  next_day.setDate(next_day.getDate() + 1);
  dated_task_lists(curr_day, next_day);
  api_get_tasks(function(result){
    for (const task of result.tasks) {
      display_task(task);
    }
    createCalendar();
    addEventsToCal(result.tasks);
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
  });
}

function sameDate(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate();
}

// CALENDAR SCRIPTS
// Credit to https://www.sliderrevolution.com/resources/html-calendar/ for source code
// Modified to fit necessary functionality
function createCalendar() {

  var today = moment();

  function Calendar(selector, events, date) {
    this.el = document.querySelector(selector);
    this.events = events;
    
    this.events.forEach(function(ev) {
      ev.date = new Date(ev.date);
      ev.date.setDate(ev.date.getDate() + 1);
    });

    this.current = date;
    this.draw();
  }

  Calendar.prototype.draw = function() {
    //Create Header
    this.drawHeader();

    //Draw Month
    this.drawMonth();
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
    outer.setAttribute('id', "calendar_day-"+(new Date(day)));
    outer.addEventListener('click', function() {
      get_current_tasks(new Date(outer.id.replace("calendar_day-","")));
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
        if(sameDate(ev.date, new Date(day))) {
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
    curr_day = new Date($('#date-tracker').html());
    passed_day = new Date(day);
    next_day = new Date(curr_day);
    next_day.setDate(next_day.getDate() + 1);
    if(day.month() !== this.current.month()) {
      classes.push('other');
    } else if (sameDate(curr_day, passed_day) || sameDate(next_day, passed_day)) {
      classes.push('today');
    }
    return classes.join(' ');
  }

  Calendar.prototype.renderEvents = function(events, ele) {
    //Remove any events in the current details element
    var currentWrapper = ele.querySelector('.events');
    var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));

    events.forEach(function(ev) {
      var div = createElement('div', 'event');
      var square = createElement('div', 'event-category ' + ev.color);
      var span = createElement('span', '', ev.eventName);

      div.appendChild(square);
      div.appendChild(span);
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
    data.push({eventName, calendar: 'Other', color: 'green', date});
  }
  date = moment(new Date($('#date-tracker').html())).startOf('month');
  var calendar = new Calendar('#calendar', data, date);
};

$(document).ready(function() {
  get_current_tasks()
});

</script>

<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"></script>

% include("footer.tpl")
