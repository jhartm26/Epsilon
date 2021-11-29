from behave import *
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import string
import time
import datetime

@given('we have navigated to {url}')
def step_impl(context, url):
    browser = webdriver.Chrome()
    browser.get(url)
    context.browser = browser
    time.sleep(200)

@when('name and date for task is written')
def step_impl(context):
    taskName_element = context.browser.find_element_by_id('input-task')
    taskName_element.send_keys('Test')
    taskName_element.send_keys(Keys.RETURN)
    taskDate_element = context.browser.find_element_by_id('input-task-date')
    taskDate_element.send_keys('11022021')
    taskDate_element.send_keys(Keys.RETURN)
    context.browser.find_element_by_id('save_edit-task').click()
    context.browser.find_element_by_id('undo_edit-task').click()

@then('we have a task for tomorrow')
def step_impl(context):
    tomorrowTaskList = list(context.browser.find_elements_by_id('task-list-2021-11-02'))
    assert(len(tomorrowTaskList) > 0)

#################################################################################

#Initial Start of tests
@given ("the taskbook application is running and a task exists today")
def step_impl(context):
    context.browser = webdriver.Chrome()    #initialize webdriver
    context.browser.get("https://jjgrayg.pythonanywhere.com")   #navigate to the taskbook
    assert 'SWIFT Taskbook' in context.browser.title #assert we are at the taskbook webpage

    temp = datetime.date.today()  #get the current date
    today = temp.strftime("%Y") + "-" + temp.strftime("%m") + "-" + temp.strftime("%d") #format the date to include YYYY-mm-dd
    target_id = "task-list-" + today    #get the full id of todays table by adding today to "task-list-"

    today_list = context.browser.find_element_by_id(target_id)  #find the table for today in the webdriver

    test = list(context.browser.find_elements_by_tag_name("tr"))   #gets the tr of the first task of the table I believe and fails assertion if there is none
    assert len(test) > 0

    time.sleep(1)

#Test for deletion of a task
@when ("We click the trash icon on an existing task")
def step_impl(context):
    

    task = context.browser.find_element_by_tag_name("tr")   #gets the tr of the first task of the table I believe
    task_id = task.get_attribute("id")  #get the id of the first task in todays table
    context.id_num = "" #initialize variable
    digs = 0    #variable for the digits of the id_num variable
    for i in range(len(task_id)):   #iterates from 0 to the last index of the task_id string
        itr = len(task_id) - 1 - i  #"flips" i so that i effectively starts at len(task_id) - 1 and ends at 0
        if task_id[itr] != "-": #increases digs as the current element of the task_id string has not met the "-"
            digs += 1
        else:
            break   #stops loop from running once the "-" has been found

    #substring from end
    for i in range(digs):   #runs digs times from 0 to digs - 1
        digs_inv = digs - i #"inverts" i so it effectively starts from digs - 1 and stops at 0
        context.id_num += task_id[len(task_id) - digs_inv]


    del_button = context.browser.find_element_by_id("delete_task-" + context.id_num)    #find the delete button
    del_button.click()  #clicks the delete button
    time.sleep(5)

@then ("the task will be removed from the taskbook")
def step_impl(context):
    assert "task-" + context.id_num not in context.browser.page_source  #ensure the task is no longer in existence
    time.sleep(5)




#Test for editing of text for tasks
@when ("we click the edit button on an existing task, change the information, and click the check mark")
def step_impl(context):
    task = context.browser.find_element_by_tag_name("tr")
    task_id = task.get_attribute("id")
    context.id_num = ""
    digs = 0
    for i in range(len(task_id)):  
        itr = len(task_id) - 1 - i  
        if(task_id[itr]) != "-":    
            digs += 1
        else:
            break
 
    for i in range(digs):
        digs_inv = digs - i
        context.id_num = context.id_num + task_id[len(task_id) - digs_inv]
    


    edit_button = context.browser.find_element_by_id("edit_task-" + context.id_num) #find the edit button of the task
    edit_button.click()

    context.new_desc = "jcojnse923kjd"
    name = context.browser.find_element_by_id("input-" + context.id_num)    #get the field for changing the task name
    name.clear()
    name.send_keys(context.new_desc) #input these characters into the edit task name field

    date_field = context.browser.find_element_by_id("input-" + context.id_num + "-date")  #get the field for changing the task date

    temp = datetime.date.today()  #get today's date
    
    context.tomorrow = temp.replace(day = temp.day + 1) #get tomorrows date
    tomorrow_input = context.tomorrow.strftime("%m") + context.tomorrow.strftime("%d") + context.tomorrow.strftime("%Y")  #convert tomorrows date to valid input


    date_field.send_keys(tomorrow_input)    #input tomorrows date into the edit task date field
    time.sleep(5)

    confirm_button = context.browser.find_element_by_id("save_edit-" + context.id_num)  #find the save edit button
    confirm_button.click()

    time.sleep(5)

@then ("the task will take on the edits")
def step_impl(context):
    assert context.browser.find_element_by_id("description-" + context.id_num).text == context.new_desc
    tomorrow_list = context.browser.find_elements_by_id("task-list-" + context.tomorrow.strftime("%Y") + "-" + context.tomorrow.strftime("%m") + "-" + context.tomorrow.strftime("%d"))
    date_check = list(context.browser.find_elements_by_id("task-" + context.id_num))
    assert len(date_check) > 0
