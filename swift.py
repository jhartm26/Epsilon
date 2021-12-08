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
# server functions 
# ---------------------------
import string
import random
import os
import hashlib

from sqlalchemy.sql.elements import Null

def generate_random_string():
    return ''.join(random.SystemRandom().choice(string.ascii_letters + string.digits) for _ in range(55))

def get_user_id(db, name):
    session_table = db.get_table('user_data')
    entry = session_table.find_one(username=name)
    print(entry)
    return Null

def hash_password(password):
    salt = os.urandom(32)
    key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
    result = salt + key
    return result

def verify_password(password, stored_password):
    stored_salt = stored_password[:32]
    stored_key = stored_password[32:]
    new_key = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), stored_salt, 100000)
    if (new_key == stored_key):
        return True
    else:
        return False


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

@get('/api/sessions')
def get_session():
    'generates a session id'
    try:
        current_sessions = []
        for x in taskbook_db.query("SELECT name FROM sqlite_master WHERE type ='table' AND name NOT LIKE 'sqlite_%';"):
            current_sessions.append(x['name'])
        generatedId = generate_random_string()
        while (generatedId in current_sessions):
            generatedId = generate_random_string()
        return { "sessionID": generatedId }
    except Exception as e:
        response.status="400 Bad Request:"+str(e)
        print(response.status)
        return

@post('/api/sessions/<sessionID>')
def create_session(sessionID):
    print("Creating new session in DB...")
    try:
        taskbook_db.create_table(sessionID + "_tasks")
        groupTable = taskbook_db.get_table('group')
        groupTable.insert(dict(id=sessionID, Homework="#ff5cf1", Extracurriculars="#a2eca3", Classes="#fdff70", Tests="#ff4d4d"))
    except Exception as e:
        response.status="400 Bad Request:"+str(e)
        print(response.status)
        return
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'status':200, 'success': True})

@post('/api/accounts/<sessionID>')
def create_account(sessionID):
    try:
        data = request.json
        print(data)
        user = data['username']
        secret = data['password']
        hashed_password = hash_password(secret)
        table = taskbook_db.get_table('user_data')
        table.insert(dict(username=user,  pass_storage=hashed_password, sessionID=sessionID))
    except Exception as e:
        response.status="409 Bad Request:"+str(e)
        print(response.status)
        return
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'status':200, 'success': True})

@post('/api/accounts/login')
def login():
    try:
        data = request.json
        user = data['username']
        password = data['password']
        table = taskbook_db.get_table('user_data')
        entry = table.find_one(username=user)
        if (entry == None):
            raise ValueError(" Invalid User")
        if (not verify_password(password, entry['pass_storage'])):
            raise ValueError(" Invalid Password")
        else:
            return { "username": entry['username'],
                     "sessionID": entry['sessionID']}
    except Exception as e:
        response.status="409 Bad Request:"+str(e)
        print(response.status)
        return



@get('/api/tasks/<sessionID>')
def get_tasks(sessionID):
    'return a list of tasks sorted by submit/modify time'
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    task_table = taskbook_db.get_table(sessionID + "_tasks")
    tasks = [dict(x) for x in task_table.find(order_by='time')]
    return { "tasks": tasks }

@post('/api/tasks/<sessionID>')
def create_task(sessionID):
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
        task_table = taskbook_db.get_table(sessionID + "_tasks")
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

@put('/api/tasks/<sessionID>')
def update_task(sessionID):
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
        task_table = taskbook_db.get_table(sessionID + "_tasks")
        task_table.update(row=data, keys=['id'])
    except Exception as e:
        response.status="409 Bad Request:"+str(e)
        print(response.status)
        return
    # return 200 Success
    response.headers['Content-Type'] = 'application/json'
    return json.dumps({'status':200, 'success': True})

@delete('/api/tasks/<sessionID>')
def delete_task(sessionID):
    'delete an existing task in the database'
    try:
        data = request.json
        assert type(data['id']) is int, f"id '{id}' is not int"
    except Exception as e:
        response.status="400 Bad Request:"+str(e)
        return
    try:
        task_table = taskbook_db.get_table(sessionID + "_tasks")
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
        assert type(data['id']) is str, "id is not a string"
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

@get('/api/options/groups/<sessionID>')
def retreive_groups(sessionID):
    'return a list of groups and associated colors'
    response.headers['Content-Type'] = 'application/json'
    response.headers['Cache-Control'] = 'no-cache'
    group_table = taskbook_db.get_table('group')
    groups = group_table.find_one(id=sessionID)
    return { "groups": groups }

 #change one 9/29/2021
application = default_app()
if __name__ == "__main__":

    run(host='0.0.0.0', port=8080, debug=True)