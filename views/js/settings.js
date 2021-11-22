// SETTINGS FUNCTIONS
var simpleClose = false;

function assignGroupColorsFromDB() {
    api_get_groups(function(result){
        $("body").find(".Homework").css("--color", result.groups[0].Homework);
        $(".Extracurriculars").css("--color", result.groups[0].Extracurriculars);
        $(".Classes").css("--color", result.groups[0].Classes);
        $(".Tests").css("--color", result.groups[0].Tests);

        $("#group_color_homework").val(result.groups[0].Homework);
        $("#group_color_extra").val(result.groups[0].Extracurriculars);
        $("#group_color_classes").val(result.groups[0].Classes);
        $("#group_color_tests").val(result.groups[0].Tests);
    });
}

function submitSettingsChanges() { 
    api_update_group_colors({id:1, 
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

