Feature: we can create and manipulate a task

Scenario: create task in extracurriculars group
    Given we have navigated to https://www.getstuffdoneplanner.com/
     When name, date, time, and group for task is written
     Then we have a task in extracurriculars group

Scenario: We can edit existing tasks
    Given we have navigated to https://www.getstuffdoneplanner.com/
     When name, date, time, and group for task is written
     When we click the edit button on an existing task, change the information, and click the check mark
     Then the task will take on the edits

Scenario: We can delete existing tasks
    Given we have navigated to https://www.getstuffdoneplanner.com/
     When name, date, time, and group for task is written
     When we click the trash icon on an existing task
     Then the task will be removed from the taskbook