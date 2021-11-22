<div id="settings_menu">
    <div id="settings_text">
        <div id="settings_header">
            <h2>Settings</h2>
            <div id="account_info"></div>
        </div>
        <div id="menu_container">
            <div id="settings_tweaks">
                <div id="left_menu">
                    <div id="group_colors">
                        <span>Change group colors:</span>
                        <div class="buttons"><td>
                            <div class="colors_grouping">
                                <div class="group_color_button">
                                    <p>Homework: </p>
                                    <input id="group_color_homework" type="color" autofocus>
                                </div>
                                <div class="group_color_button">
                                    <p>Classes: </p>
                                    <input id="group_color_classes" type="color" autofocus>
                                </div>
                            </div>
                            <div class="colors_grouping">
                                <div class="group_color_button">
                                    <p>Extracurriculars: </p>
                                    <input id="group_color_extra" type="color" autofocus>
                                </div>
                                <div class="group_color_button">
                                    <p>Tests: </p>
                                    <input id="group_color_tests" type="color" autofocus>
                                </div>
                            </div>
                        </td></div>
                    </div>
                    <div class="setting_entry_container">
                        <span>Choose a theme:</span>
                        <input id="input-task-group" style="height:25px; width:40%;" class="w3-input w3-border-gray"
                          list="themes" autofocus placeholder="Select a theme..." required/>
                        <datalist id="themes">
                            <option value="Theme 1">
                            <option value="Theme 2">
                            <option value="Theme 3">
                            <option value="Theme 4">
                        </datalist>
                    </div>
                    <div class="setting_entry_container">
                        <span>Delete all tasks: </span>
                        <input id="delete_all_tasks verification" style="height:25px; width:40%;" class="w3-input w3-border-gray"
                          type="text" autofocus placeholder="Type 'Delete all tasks'" required/>
                    </div>
                </div>

                <div id="right_menu">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" alt="Placeholder">
                    <div class="account_buttons">
                        <span id="login" class="pointer">Login</span>
                        <span id="divider"> | </span>
                        <span id="logout" class="pointer">Log out</span>
                    </div>
                </div>
            </div>
            <span id="submit_changes">Save Changes</span>
        </div>
    </div>
</div>