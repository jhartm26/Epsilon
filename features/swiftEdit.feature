Feature: We are able to edit tasks in the taskbook

Scenario: We can edit existing tasks
    Given we have navigated to https://www.getstuffdoneplanner.com/
     When we click the edit button on an existing task, change the information, and click the check mark
     Then the task will take on the edits