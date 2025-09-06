## FastAPI and router imports removed for Flask-only usage
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import Base, User, Project, ProjectMember, Task
from database import engine, SessionLocal
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'synergysecret'

# Create tables
Base.metadata.create_all(bind=engine)

@app.route('/')
def index():
    return jsonify({'message': 'SynergySphere Flask API is running'})

@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    db = SessionLocal()
    try:
        if db.query(User).filter(User.email == data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        hashed_pw = generate_password_hash(data['password'])
        new_user = User(name=data.get('name', ''), email=data['email'], password_hash=hashed_pw)
        db.add(new_user)
        db.commit()
        return jsonify({'id': new_user.id, 'email': new_user.email})
    except IntegrityError:
        db.rollback()
        return jsonify({'error': 'Integrity error'}), 400
    finally:
        db.close()

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    db = SessionLocal()
    user = db.query(User).filter(User.email == data['email']).first()
    db.close()
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, app.config['SECRET_KEY'], algorithm='HS256')
    return jsonify({'access_token': token, 'token_type': 'bearer'})

@app.route('/projects', methods=['POST'])
def create_project():
    data = request.json
    db = SessionLocal()
    new_project = Project(name=data['name'], summary=data.get('summary', ''), owner_id=data['owner_id'])
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    db.close()
    return jsonify({'id': new_project.id, 'name': new_project.name, 'summary': new_project.summary, 'owner_id': new_project.owner_id})

@app.route('/projects', methods=['GET'])
def list_projects():
    db = SessionLocal()
    projects = db.query(Project).all()
    db.close()
    return jsonify([{'id': p.id, 'name': p.name, 'summary': p.summary, 'owner_id': p.owner_id} for p in projects])

@app.route('/projects/<int:project_id>', methods=['GET'])
def get_project(project_id):
    db = SessionLocal()
    project = db.query(Project).filter(Project.id == project_id).first()
    db.close()
    if not project:
        return jsonify({'error': 'Project not found'}), 404
    return jsonify({'id': project.id, 'name': project.name, 'summary': project.summary, 'owner_id': project.owner_id})

@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    db = SessionLocal()
    new_task = Task(title=data['title'], description=data.get('description', ''), assignee_id=data['assignee_id'], project_id=data['project_id'], due_date=data.get('due_date'), status=data.get('status', 'Open'))
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    db.close()
    return jsonify({'id': new_task.id, 'title': new_task.title, 'description': new_task.description, 'assignee_id': new_task.assignee_id, 'project_id': new_task.project_id, 'due_date': str(new_task.due_date), 'status': new_task.status})

@app.route('/tasks', methods=['GET'])
def list_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    db.close()
    return jsonify([{'id': t.id, 'title': t.title, 'description': t.description, 'assignee_id': t.assignee_id, 'project_id': t.project_id, 'due_date': str(t.due_date), 'status': t.status} for t in tasks])

@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    db.close()
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    return jsonify({'id': task.id, 'title': task.title, 'description': task.description, 'assignee_id': task.assignee_id, 'project_id': task.project_id, 'due_date': str(task.due_date), 'status': task.status})

@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        db.close()
        return jsonify({'error': 'Task not found'}), 404
    for key in ['title', 'description', 'assignee_id', 'project_id', 'due_date', 'status']:
        if key in data:
            setattr(task, key, data[key])
    db.commit()
    db.refresh(task)
    db.close()
    return jsonify({'id': task.id, 'title': task.title, 'description': task.description, 'assignee_id': task.assignee_id, 'project_id': task.project_id, 'due_date': str(task.due_date), 'status': task.status})

# --- User Profile & Notification Endpoints ---
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    db.close()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    # For MVP, notification preference is a dummy field
    return jsonify({'id': user.id, 'name': user.name, 'email': user.email, 'notifications': True})

@app.route('/users/<int:user_id>/notifications', methods=['PUT'])
def update_notifications(user_id):
    # For MVP, just echo the preference
    pref = request.json.get('notifications', True)
    return jsonify({'user_id': user_id, 'notifications': pref})

if __name__ == '__main__':
    app.run(debug=True)
