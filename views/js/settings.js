// SETTINGS FUNCTIONS
var simpleClose = false;

function assignGroupColorsFromDB() {
    api_get_groups(function(result){
        $("body").find(".Homework").css("--color", result.groups.Homework);
        $(".Extracurriculars").css("--color", result.groups.Extracurriculars);
        $(".Classes").css("--color", result.groups.Classes);
        $(".Tests").css("--color", result.groups.Tests);

        $("#group_color_homework").val(result.groups.Homework);
        $("#group_color_extra").val(result.groups.Extracurriculars);
        $("#group_color_classes").val(result.groups.Classes);
        $("#group_color_tests").val(result.groups.Tests);
    });
}

function submitSettingsChanges() { 
    id = get_session_id();
    api_update_group_colors({id, 
                            Homework:$("#group_color_homework").val(), 
                            Extracurriculars:$("#group_color_extra").val(), 
                            Classes:$("#group_color_classes").val(), 
                            Tests:$("#group_color_tests").val()}, 
                            function(result) { 
                                console.log(result);
                                get_current_tasks(new Date($('#date-tracker').html()));
                                $("#current_input").val("")
                            });
}

function toggleMenu() {
    var menu = $("#settings_menu");
    var text = $("#settings_text");
    var startPos = $(".settings_button").offset();
    var currentStyle = menu.css("opacity");
    if (currentStyle === "0" && !simpleClose) {
        menu.css("display", "flex");
        menu.css("top", startPos.top);
        menu.css("left", startPos.left);
        menu.css("opacity", 0);
        menu.css("height", "5%");
        menu.css("width", "5%")
        text.css("opacity", 0)
        menu.animate({height: "75%", 
                    width: "75%",  
                    opacity: 1,
                    top: "50%",
                    left: "50%"
                    },
                    "fast");
        text.animate({opacity: 1}, "fast");
        text.fadeIn(100);
    }
    else if ((currentStyle === "1" || simpleClose) && currentStyle !== "0") {
        menu.css("display", "flex");
        menu.css("top", "50%");
        menu.css("left", "50%");
        menu.css("opacity", 1);
        menu.css("height", "75%");
        menu.css("width", "75%")
        text.css("opacity", 1)
        text.animate({opacity: 0}, "fast");
        text.fadeOut(100);
        menu.animate({height: "5%", 
                    width: "5%",  
                    opacity: 0,
                    top: startPos.top,
                    left: startPos.left
                    },
                    "fast");
        menu.fadeOut(100);
    }
    simpleClose = false;
}

function closeMenu() {
    simpleClose = true;
    toggleMenu();
}

function toggleLogin(){
    var login = $('#login_window')
    var text = $("#login_text");
    var startPos = $("#login").offset();
    var currentStyle = login.css("opacity");
    if (currentStyle === "0" && !simpleClose) {
        login.css("display", "flex");
        login.css("top", startPos.top);
        login.css("left", startPos.left);
        login.css("opacity", 0);
        login.css("height", "5%");
        login.css("width", "5%")
        text.css("opacity", 0)
        login.animate({height: "40%", 
                    width: "15%",  
                    opacity: 1,
                    top: "50%",
                    left: "50%"
                    },
                    "fast");
        text.animate({opacity: 1}, "fast");
        text.fadeIn(100);
    }
    else if ((currentStyle === "1" || simpleClose) && currentStyle !== "0") {
        login.css("display", "flex");
        login.css("top", "50%");
        login.css("left", "50%");
        login.css("opacity", 1);
        login.css("height", "40%");
        login.css("width", "15%")
        text.css("opacity", 1)
        text.animate({opacity: 0}, "fast");
        text.fadeOut(100);
        login.animate({height: "5%", 
                    width: "5%",  
                    opacity: 0,
                    top: startPos.top,
                    left: startPos.left
                    },
                    "fast");
        login.fadeOut(100);
    }
    simpleClose = false;
}

function closeLogin() {
    simpleClose = true;
    toggleLogin();
}

function handleLoginFormDisplay(){
    header = $("#login_header");
    $(".login_form").empty();
    t = '<div class="login_input">' +
        '        <label for="input-username">Username:</label>' +
        '        <input id="input-username" style="height:25px;" class="w3-input w3-border-gray"'+
        '            type="text" autofocus placeholder="Username" required/>'+
        '    </div>'+
        '    <div class="login_input">'+
        '        <label for="input-password">Password:</label>'+
        '        <input id="input-password" style="height:25px;" class="w3-input w3-border-gray"'+
        '            type="password" autofocus placeholder="Password" required/>'+
        '    </div>'
    if (register) {
        t += '<div class="login_input">' +
            '   <label for="input-password-confirmation">Confirm Password:</label>' +
            '   <input id="input-password-confirmation" style="height:25px;" class="w3-input w3-border-gray"' +
            '       type="password" autofocus placeholder="Confirm Password" required/>' +
            '</div>';
        header.html("Register");
    }
    else {
        
        header.html("Login");
    }
    $(".login_form").append(t);
    $(".login_form").append('<input id="submit_login" type="submit" value="Submit">');
    $("#submit_login").off("click").bind("click", handleLogin);
}

function handleAccountButtons() {
    $(".account_buttons").empty();
    $("#banner_account_info").empty();
    if (get_cookie("loggedIn") && get_cookie("username")) {
        username = document.cookie.split('; ').find(row => row.startsWith("username"));
        username = username.substring(9);
        t = '<span>Welcome, ' + username + '!</span>' +
            '<span>Not you? <span id="logout" style="color: #161616; cursor: pointer;">Logout</span></span>';
        $(".account_buttons").css({ "display": "flex",
                                    "flex-direction": "column",
                                    "align-items": "center"});
        j = '<span>Welcome, ' + username + '!</span>' +
            '<span>Not you? <span id="logout2" style="color: #161616; cursor: pointer;">Logout</span></span>';;
    }
    else {
        t = '<span id="login" class="pointer">Login</span>' +
            '<span id="divider"> | </span>' +
            '<span id="register" class="pointer">Register</span>'
        j = '<div>' + 
            '   <span id="login2" class="pointer">Login</span>' +
            '   <span id="divider"> | </span>' +
            '   <span id="register2" class="pointer">Register</span>' + 
            '</div>';
    }
    $(".account_buttons").append(t);
    $("#banner_account_info").append(j);
    $("#logout").off("click").bind("click", handleLogout);
    $("#logout2").off("click").bind("click", handleLogout);
    $("#login").off("click").bind("click", function() {
        register = false;
        handleLoginFormDisplay();
        toggleLogin();
    });
    $("#login2").off("click").bind("click", function() {
        register = false;
        handleLoginFormDisplay();
        toggleLogin();
    });
    $("#register").off("click").bind("click", function() {
        register = true;
        handleLoginFormDisplay();
        toggleLogin();
    });
    $("#register2").off("click").bind("click", function() {
        register = true;
        handleLoginFormDisplay();
        toggleLogin();
    });
}

function validateLoginForm() {
    usernameInput = $("#input-username");
    passwordInput = $("#input-password");
    passwordConfirm = $("#input-password-confirmation");
    if (usernameInput.val().length <= 4) {
        alert("Username must be at least 5 characters long. Please enter a valid username.");
        return false;
    }
    if (passwordInput.val().length <= 7) {
        alert("Password must contain at least 8 characters. Please enter a valid password.")
        return false;
    }
    if (register) {
        if (passwordConfirm.val() != passwordInput.val()) {
            alert("Passwords don't match. Make sure both the password and the confirmation password match.")
            return false;
        }
    }
    return true;
}

function handleLogin() {
    console.log("Handling login");
    isValid = validateLoginForm()
    if (register && isValid) {
        api_create_session(function(result) {
                document.cookie = "sessionID=" + result.sessionID + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=None; Secure";
                api_create_account({'username': $("#input-username").val().toLowerCase(),
                                    'password': $("#input-password").val()},         
                                    function(result) { 
                                        console.log(result);
                                        create_login_cookie(get_session_id(), $("#input-username").val().toLowerCase());
                                    });
                api_setup_db(function() {
                    location.reload();
                    console.log("db setup succcessful");
                }, result.sessionID);
        });
    }
    else if (!register && isValid) {
        api_login({ 'username': $("#input-username").val().toLowerCase(),
                    'password': $("#input-password").val()},
                    function(result){
                        console.log(result);
                        create_login_cookie(result.sessionID, result.username);
                        location.reload();
                    });
    }
}

function handleLogout() {
    delete_cookie("loggedIn");
    delete_cookie("sessionID");
    delete_cookie("username");
    location.reload();
}