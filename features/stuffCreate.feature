Feature: we can create a task

Scenario: create task in tests group
    Given we have navigated to https://www.getstuffdoneplanner.com/
     When name, date, time, and group for task is written
     Then we have a task in Tests group