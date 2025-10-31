from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db, engine, Base
from app.schemas import TaskCreate, TaskUpdate, TaskResponse, InsightsResponse
from app.models import TaskStatus, TaskPriority
from app import crud

# Initialize database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Task Tracker API",
    description="A smart task tracker with AI-style insights",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Simple root endpoint to check if API is running"""
    return {
        "message": "Welcome to Task Tracker API",
        "version": "1.0.0",
        "endpoints": {
            "create_task": "POST /tasks",
            "list_tasks": "GET /tasks",
            "update_task": "PATCH /tasks/{id}",
            "get_insights": "GET /insights"
        }
    }


@app.post("/tasks", response_model=TaskResponse, status_code=201)
def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task with the provided details"""
    new_task = crud.create_task(db=db, task=task)
    return new_task


@app.get("/tasks", response_model=list[TaskResponse])
def get_tasks(
    status: Optional[TaskStatus] = Query(None, description="Filter by status"),
    priority: Optional[TaskPriority] = Query(None, description="Filter by priority"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get list of tasks with optional filters for status and priority"""
    # Fetch tasks from database with applied filters
    result = crud.get_tasks(db=db, status=status, priority=priority, skip=skip, limit=limit)
    return result


@app.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db)):
    """Retrieve a single task by its ID"""
    task = crud.get_task(db=db, task_id=task_id)
    if not task:
        raise HTTPException(status_code=404, detail=f"Task with id {task_id} not found")
    return task


@app.patch("/tasks/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    """Update an existing task - can update any field"""
    updated_task = crud.update_task(db=db, task_id=task_id, task_update=task_update)
    if not updated_task:
        raise HTTPException(status_code=404, detail=f"Task with id {task_id} not found")
    return updated_task


@app.get("/insights", response_model=InsightsResponse)
def get_insights(db: Session = Depends(get_db)):
    """
    Generate insights about tasks - shows workload summary,
    priority distribution, and upcoming deadlines
    """
    insights = crud.get_insights(db=db)
    return insights


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
