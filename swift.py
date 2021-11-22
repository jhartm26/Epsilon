# SWIFT Taskbook
# Web Application for Task Management 

# web transaction objects
from bottle import request, response

# HTML request types
from bottle import route, get, put, post, delete

# web page template processor
from bottle import template

# development server
from bottle import run 



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
            assert key in ["description","list","date","literal_date","group","time"], f"Illegal key '{key}'"
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
            "description":data['description'].strip(),
            "list":data['list'],
            "completed":False,
            "group":data['group'].strip(),
            "time":data['time']
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
            assert key in ["id","description","completed","list","date","literal_date","time"], f"Illegal key '{key}'"
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

# Settings api functions
@put('/api/options/groups')
def update_groups():
    'update the colors of associated groups in the database'
    try:
        data = request.json
        assert type(data['id']) is int, f"id '{id}' is not int"
        assert type(data['Homework']) is str, "Homework is not a string."
        assert type(data['Extracurriculars']) is str, "Extracurriculars is not a string."
        assert type(data['Classes']) is str, "Classes is not a string."
        assert type(data['Tests']) is str, "Tests is not a string."
    except Exception as e:
        response.status="400 Bad Request:"+str(e)
        return
    try:
        task_table = taskbook_db.get_table('group')
        task_table.update(row=data, keys=['id'])
    except Exception as e:
        response.status="409 Bad Request:"+str(e)
        return
    # return 200 Success
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'success': True})  

@get('/api/options/groups')
def retreive_groups():
    'return a list of groups and associated colors'
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    group_table = taskbook_db.get_table('group')
    groups = [dict(x) for x in group_table]
    return { "groups": groups }

 #change one 9/29/2021
application = default_app()
if __name__ == "__main__":

    run(host='0.0.0.0', port=8080, debug=True)