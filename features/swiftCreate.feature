Feature: we can create and find a task

Scenario: create task for tomorrow and find that date
    Given we have navigated to http://jjgrayg.pythonanywhere.com/
     When name and date for task is written
     Then we have a task for tomorrow
     When date to find is written
     Then we open that day