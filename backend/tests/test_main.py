import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_status_endpoint():
    response = client.get("/status/test-id")
    assert response.status_code == 200
    assert response.json()["status"] == "processing"
