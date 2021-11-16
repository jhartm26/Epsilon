% include("header.tpl")
% include("banner.tpl")

<style>
% include("css/main.css")
</style>

<div class="task-creation-container">
  <form id="task-form">
    <div class="task-creation">
      <tr id="task" class="task">
        <td style="width:36px"></td>
        <td><span id="editor-task" class="w3-bottombar w3-topbar w3-leftbar w3-rightbar w3-border-gray">
              <input id="input-task" style="height:22px; width:50vw;" class="w3-input"
                type="text" autofocus placeholder="Add an item..." required/>
              <input id="input-task-date" style="height:25px; width:50vw;" class="w3-input w3-topbar w3-border-gray"
                type="date" autofocus required>
              <input id="input-task-group" style="height:25px; width:50vw;" class="w3-input w3-topbar w3-border-gray"
                list="groups" autofocus required/>
              <datalist id="groups">
                <option value="Homework">
                <option value="Classes">
                <option value="Extracurriculars">
                <option value="Tests">
              </datalist>
              <input id="input-task-time" style="height:25px; width:50vw;" class="w3-input w3-topbar w3-border-gray"
                type="time" autofocus required/>
            </span>
        </td>
        <td style="width:72px">
          <span id="filler-task" class="material-icons w3-bottombar w3-topbar w3-rightbar w3-border-gray">more_horiz</span>
          <span id="save_edit-task" hidden class="save_edit material-icons w3-bottombar w3-topbar w3-border-gray">done</span>
          <span id="undo_edit-task" hidden class="undo_edit material-icons w3-bottombar w3-topbar w3-rightbar w3-border-gray">cancel</span>
        </td>
      </tr>
    </div>
  </form>
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
  <p id="delete_all_tasks">Delete All Tasks</p>
</div>
<div id="task_lists"></div>
<input id="current_input" hidden value=""/>


<script>
% include("js/main.js")
</script>

<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"></script>

% include("footer.tpl")
