
import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials

cred = credentials.Certificate("cred.json")
app = firebase_admin.initialize_app(cred)
db = firestore.client()

def add_agent(id, agent):
    """
    Add an agent to the database.
    """
    db.collection("agents").document(id).set(agent)