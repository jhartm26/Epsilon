# SWIFT Taskbook
# Web Application for Task Management 

# web transaction objects
from bottle import request, response

# HTML request types
from bottle import route, get, put, post, delete

# web page template processor
from bottle import template

from bottle import default_app  #change made 9/29/2021, separate line b/c I don't know where it's supposed to go


# ---------------------------
# web application routes
# ---------------------------

@route('/')
@route('/tasks')
def tasks():
    return template("tasks.tpl") 

@route('/login')
def login():
    return template("login.tpl") 

@route('/register')
def login():
    return template("register.tpl") 

# ---------------------------
# task REST api 
# ---------------------------

import json
import dataset
import time
from datetime import date

taskbook_db = dataset.connect('sqlite:///taskbook.db')  

@get('/api/tasks')
def get_tasks():
    'return a list of tasks sorted by submit/modify time'
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    task_table = taskbook_db.get_table('task')
    tasks = [dict(x) for x in task_table.find(order_by='time')]
    return { "tasks": tasks }

@post('/api/tasks')
def create_task():
    'create a new task in the database'
    try:
        data = request.json
        print(data)
        for key in data.keys():
            assert key in ["description","list","date","literal_date"], f"Illegal key '{key}'"
        assert type(data['description']) is str, "Description is not a string."
        assert len(data['description'].strip()) > 0, "Description is length zero."
    except Exception as e:
        response.status="400 Bad Request:"+str(e)
        print(response.status)
        return
    try:
        theDate = data['date'].strip()
        if (theDate == ''):
            theDate = date.today()
        literalDate = data['literal_date']
        print(literalDate)
        if (literalDate == None):
            literalDate = date.today()
        task_table = taskbook_db.get_table('task')
        task_table.insert({
            "literal_date": literalDate,
            "date": theDate,
            "time": time.time(),
            "description":data['description'].strip(),
            "list":data['list'],
            "completed":False
        })
    except Exception as e:
        response.status="409 Bad Request:"+str(e)
        print(response.status)
    # return 200 Success
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'status':200, 'success': True})

@put('/api/tasks')
def update_task():
    'update properties of an existing task in the database'
    try:
        data = request.json
        for key in data.keys():
            assert key in ["id","description","completed","list","date","literal_date"], f"Illegal key '{key}'"
        assert type(data['id']) is int, f"id '{id}' is not int"
        if "description" in request:
            assert type(data['description']) is str, "Description is not a string."
            assert len(data['description'].strip()) > 0, "Description is length zero."
        if "completed" in request:
            assert type(data['completed']) is bool, "Completed is not a bool."
        if "list" in request:
            assert data['list'] in ["today","tomorrow"], "List must be 'today' or 'tomorrow'"
    except Exception as e:
        response.status="400 Bad Request:"+str(e)
        print(response.status)
        return
    if 'list' in data: 
        data['time'] = time.time()
    try:
        task_table = taskbook_db.get_table('task')
        task_table.update(row=data, keys=['id'])
    except Exception as e:
        response.status="409 Bad Request:"+str(e)
        print(response.status)
        return
    # return 200 Success
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'status':200, 'success': True})

@delete('/api/tasks')
def delete_task():
    'delete an existing task in the database'
    try:
        data = request.json
        assert type(data['id']) is int, f"id '{id}' is not int"
    except Exception as e:
        response.status="400 Bad Request:"+str(e)
        return
    try:
        task_table = taskbook_db.get_table('task')
        task_table.delete(id=data['id'])
    except Exception as e:
        response.status="409 Bad Request:"+str(e)
        return
    # return 200 Success
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'success': True})

 #change one 9/29/2021
application = default_app()
