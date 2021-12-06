Feature: We are able to remove tasks from the taskbook

Scenario: We can delete existing tasks
          Given we have navigated to https://www.getstuffdoneplanner.com/
          When we click the trash icon on an existing task
          Then the task will be removed from the taskbook