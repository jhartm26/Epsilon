Feature: We are able to manipulate tasks in the taskbook

Scenario: We can delete and edit existing tasks
          Given we have navigated to http://jjgrayg.pythonanywhere.com/
          When we click the edit button on an existing task, change the information, and click the check mark
          Then the task will take on the edits
          When we click the trash icon on an existing task
          Then the task will be removed from the taskbook