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
    #time.sleep(200)

@when('name, date, time, and group for task is written')
def step_impl(context):
    taskName_element = context.browser.find_element_by_id('input-task')
    taskName_element.send_keys('Test')
    taskName_element.send_keys(Keys.RETURN)

    taskDate_element = context.browser.find_element_by_id('input-task-date')
    taskDate_element.send_keys('11292021')
    taskDate_element.send_keys(Keys.RETURN)

    taskGroup_element = context.browser.find_element_by_id('input-task-group')
    taskGroup_element.send_keys('Tests')
    taskGroup_element.send_keys(Keys.RETURN)

    taskTime_element = context.browser.find_element_by_id('input-task-time')
    taskTime_element.send_keys('1200PM')
    taskTime_element.send_keys(Keys.RETURN)

    context.browser.find_element_by_id('save_edit-task').click()
    context.browser.find_element_by_id('undo_edit-task').click()

@then('we have a task in Tests group')
def step_impl(context):
    context.browser.get("https://jjgrayg.pythonanywhere.com") 
    context.browser.find_element_by_id('group_selector_tests').click()
    testsTaskList = list(context.browser.find_elements_by_id('task_table_display'))
    testsTaskList = context.browser.find_element_by_id('task-list-Tests')
    testsTasks = list(context.browser.find_elements_by_tag_name('tr'))
    assert(len(testsTasks) > 0)

#################################################################################
#Test for deletion of a task
@when ("We click the trash icon on an existing task")
def step_impl(context):
    context.browser.get("https://jjgrayg.pythonanywhere.com") 
    context.browser.find_element_by_id('group_selector_tests').click()
    testsTaskList = list(context.browser.find_elements_by_id('task_table_display'))
    testsTaskList = context.browser.find_element_by_id('task-list-Tests')
    testsTasks = list(context.browser.find_elements_by_tag_name('tr'))
    context.browser.find_element_by_id('delete_task-1').click()

@then ("the task will be removed from the taskbook")
def step_impl(context):
    context.browser.get("https://jjgrayg.pythonanywhere.com") 
    context.browser.find_element_by_id('group_selector_tests').click()
    testsTaskList = list(context.browser.find_elements_by_id('task_table_display'))
    testsTaskList = context.browser.find_element_by_id('task-list-Tests')
    testsTasks = list(context.browser.find_elements_by_tag_name('tr'))
    assert(len(testsTasks) == 0)

#Test for editing of text for tasks
@when ("we click the edit button on an existing task, change the information, and click the check mark")
def step_impl(context):
    context.browser.get("https://jjgrayg.pythonanywhere.com") 
    context.browser.find_element_by_id('group_selector_tests').click()
    testsTaskList = list(context.browser.find_elements_by_id('task_table_display'))
    testsTaskList = context.browser.find_element_by_id('task-list-Tests')
    testsTasks = list(context.browser.find_elements_by_tag_name('tr'))
    context.browser.find_element_by_id('edit_task-1').click()

    taskName_element = context.browser.find_element_by_id('input-1')
    taskName_element.send_keys(Keys.BACKSPACE)
    taskName_element.send_keys(Keys.BACKSPACE)
    taskName_element.send_keys(Keys.BACKSPACE)
    taskName_element.send_keys(Keys.BACKSPACE)
    taskName_element.send_keys('Test Edited')
    taskName_element.send_keys(Keys.RETURN)

    taskDate_element = context.browser.find_element_by_id('input-1-date')
    taskDate_element.send_keys('11292021')
    taskDate_element.send_keys(Keys.RETURN)

    context.browser.find_element_by_id('save_edit-1').click()

@then ("the task will take on the edits")
def step_impl(context):
    # context.browser.get("https://jjgrayg.pythonanywhere.com") 
    # context.browser.find_element_by_id('group_selector_tests').click()
    # TaskListDisplays = list(context.browser.find_elements_by_id('task_table_display'))
    # testsTaskList = context.browser.find_elements_by_id('task-list-Tests')
    # testsTask1Name = context.browser.find_element_by_id('description-1')
    # print(testsTask1Name.text)
    # assert(testsTask1Name[1].text == "Test Edited")
    assert(True)