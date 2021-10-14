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
  .task-list {
    width: 100% !important;
  }
  .task {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
</style>


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
  if ($("#current_input").val() != "") { return }
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
  if ($("#current_input").val() != "") { return }
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
  if ($("#current_input").val() != "") { return }
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
    api_update_task({'id':id, description:$("#input-" + id).val(), date:$("#input-" + id + "-date").val()},
                    function(result) { 
                      console.log(result);
                      get_current_tasks(new Date($('#date-tracker').html()));
                      $("#current_input").val("")
                    } );
  } else {
    api_create_task({description:$("#input-" + id).val(), list:id, date:$("#input-" + id + "-date").val()},
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
  if ((id != "today") & (id != "tomorrow")) {
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
  // set the editing flag
  $("#current_input").val("")
}

function delete_task(event) {
  if ($("#current_input").val() != "") { return }
  console.log("delete item", event.target.id )
  id = event.target.id.replace("delete_task-","");
  api_delete_task({'id':id},
                  function(result) { 
                    console.log(result);
                    get_current_tasks(new Date($('#date-tracker').html()));
                  } );
}

function display_task(x) {
  completed = x.completed ? " completed" : "";
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
  $("#current_input").val("")
}

function increment_date() {
  curr_date = $('#date-tracker').html();
  console.log(curr_date);
  next_date = new Date(curr_date);
  next_date.setDate(next_date.getDate() + 1);
  console.log(next_date);
  get_current_tasks(next_date);
}

function decrement_date() {
  curr_date = $('#date-tracker').html();
  console.log(curr_date);
  next_date = new Date(curr_date);
  next_date.setDate(next_date.getDate() - 1);
  console.log(next_date);
  get_current_tasks(next_date);
}

function find_date() {
  date_to_find = new Date($("#input-date-find").val());
  date_to_find.setDate(date_to_find.getDate() + 1);
  get_current_tasks(date_to_find);
}

function dated_task_lists(day, nextDay) {
  $("#task_lists").empty();
  curr_day_num = day.getDate();
  curr_month_num = day.getMonth() + 1;
  curr_year_num = day.getFullYear();
  curr_date = curr_month_num + "/" + curr_day_num + "/" + curr_year_num;

  if (curr_month_num < 10) curr_month_num = "0" + curr_month_num;
  if (curr_day_num < 10) curr_day_num = "0" + curr_day_num;
  curr_date_id = curr_year_num + "-" + curr_month_num + "-" + curr_day_num;

  next_day_num = nextDay.getDate();
  next_month_num = nextDay.getMonth() + 1;
  next_year_num = nextDay.getFullYear();
  next_date = next_month_num + "/" + next_day_num + "/" + next_year_num;

  if (next_month_num < 10) next_month_num = "0" + next_month_num;
  if (next_day_num < 10) next_day_num = "0" + next_day_num;
  next_date_id = next_year_num + "-" + next_month_num + "-" + next_day_num;

  t = '<div class="w3-row" style="display:flex; flex-direction:row;">' +
      ' <span class="material-icons previous_date" style="align-self:center; cursor:pointer;">arrow_back</span>' +
      ' <div class="w3-col s6 w3-container w3-topbar w3-bottombar w3-leftbar w3-rightbar w3-border-white">' +
      '   <div class="w3-row w3-xxlarge w3-bottombar w3-border-black w3-margin-bottom">' +
      '     <h2 id = "curr_date">'+curr_date+'</h2>' +
      '   </div>' +
      '   <table id="task-list-'+curr_date_id+'" class="w3-table task-list">' +
      '   </table>' +
      '   <div class="w3-row w3-bottombar w3-border-black w3-margin-bottom w3-margin-top"></div>' +
      ' </div>' +
      ' <div class="w3-col s6 w3-container w3-topbar w3-bottombar w3-leftbar w3-rightbar w3-border-white">' +
      '   <div class="w3-row w3-xxlarge w3-bottombar w3-border-black w3-margin-bottom">' +
      '     <h2 id = "next_date">'+next_date+'</h2>' +
      '   </div>' +
      '   <table  id="task-list-'+next_date_id+'" class="w3-table">' +
      '   </table>' +
      '   <div class="w3-row w3-bottombar w3-border-black w3-margin-bottom w3-margin-top"></div>' +
      ' </div>' +
      ' <span class="material-icons advance_date" style="align-self:center; cursor:pointer;">arrow_forward</span>' +
      '</div>' +
      '<span id="date-tracker" hidden>'+day+'</span>';
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
  // set all inputs to set flag
  $("input").off("click").bind("change", input_keypress);
  $("input").off("click").bind("keydown", input_keypress);
  });
}

$(document).ready(function() {
  get_current_tasks()
});

</script>

% include("footer.tpl")
