% include("header.tpl")
% include("banner.tpl")

<style>
% include("css/main.css")
% include("css/settings.css")
% include("css/calendar.css")
</style>
% include("settings.tpl")
<div class="page_container">
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
                <select name="task-group" id="input-task-group" style="height:50px; width:50vw;" class="w3-input w3-topbar w3-border-gray"
                autofocus placeholder="Select a group..." required>
                  <option value="Homework">Homework</option>
                  <option value="Classes">Classes</option>
                  <option value="Extracurriculars" selected>Extracurriculars</option>
                  <option value="Tests">Tests</option>
                </select>
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
  <div id="task_lists"></div>
  <input id="current_input" hidden value=""/>
</div>


<script>
% include("js/manage_tasks.js")
% include("js/calendar.js")
% include("js/settings.js")

// Run Entry function on page load
$(document).ready(function() {
  if (!document.cookie.split('; ').find(row => row.startsWith("sessionID"))) {
    api_create_session(function(result) {
      document.cookie = "sessionID=" + result.sessionID + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure";
      api_setup_db(function(){
        console.log("db setup successful")
      }, result.sessionID)
    })
  };
  setTimeout(() => {
    get_current_tasks();
  }, 500);
});
</script>

<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js"></script>

% include("footer.tpl")
