from behave import *
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import string
import time

@given('we have navigated to {url}')
def step_impl(context, url):
    browser = webdriver.Chrome()
    browser.get(url)
    context.browser = browser
    #time.sleep(200)

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

@when('date to find is written')
def step_impl(context):
    taskDate_element = context.browser.find_element_by_id('input-date-find')
    taskDate_element.clear()
    taskDate_element.send_keys('11022021')
    taskDate_element.send_keys(Keys.RETURN)
    context.browser.find_element_by_id('save_edit-date-find').click()

@then('we open that day')
def step_impl(context):
    currentDateEle = context.browser.find_element_by_id('curr_date')
    currentDate = currentDateEle.text
    assert(currentDate == '11/2/2021')