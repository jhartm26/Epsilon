Feature: we can use the delete all tasks function

Scenario: Delete all tasks added
    Given we have navigated to https://www.getstuffdoneplanner.com/
     When multiple tasks are added
     Then we have a task in Tests group
     When tasks are deleted simultaneously
     Then we have no tasks in Tests group