import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app import create_app
from app.models import NFTmarketplace
from app.database import db

app = create_app()

# Your fighters data
items = [
  {
        "key": "1",
        "owner": 4,
        "image": "https://assets.codepen.io/3685267/nft-dashboard-art-0.jpg",
        "title": "Abstract Art Painting",
        "timeLeft": 84670923,
        "auction":True,
        "price": 1
    },
    {
        "key": "2",
        "owner": 0,
        "image": "https://assets.codepen.io/3685267/nft-dashboard-art-1.jpg",
        "price": "2.5",
        "title": "Abstract Art Painting",
        "timeLeft": 12873491,
        "auction":True,
        "price": 1
        
    },
    {
        "key": "3",
        "owner": 3,
        "image": "https://assets.codepen.io/3685267/nft-dashboard-art-2.jpg",
        "price": "9.0",
        "title": "Purple Liquid Painting",
        "timeLeft": 84720185,
        "auction":True,
        "price": 1
    },
    {
        "key": "4",
        "owner": 1,
        "image": "https://assets.codepen.io/3685267/nft-dashboard-art-3.jpg",
        "price": "16.5",
        "title": "Generative Art",
        "timeLeft": 43826185,
        "auction":True,
        "price": 1
    },
    {
        "key": "5",
        "owner": 2,
        "image": "https://assets.codepen.io/3685267/nft-dashboard-art-4.jpg",
        "price": "4.0",
        "title": "Liquid Base Painting",
        "timeLeft": 134627,
        "auction":True,
        "price": 1
    },
    {
        "key": "6",
        "owner": 3,
        "image": "https://assets.codepen.io/3685267/nft-dashboard-art-5.jpg",
        "price": "1.3",
        "title": "Colorful Wind Painting",
        "timeLeft": 12008745,
        "auction":True,
        "price": 1
    },
    ];





with app.app_context():
       
 for item in items:
        try:
            # Create a new item instance with the data
            new_item = NFTmarketplace(
                owner=item["owner"],
                image=item["image"],
                title=item["title"],
                timeLeft=item["timeLeft"],
                auction=item["auction"],
                price=item["price"]
            )
            # Add the new item to the database session
            db.session.add(new_item)
            # Commit the session to save the changes
            db.session.commit()
            print(f"Added item: {item['title']}")
        except Exception as e:
            print(f"Error adding new item: {e}")
            db.session.rollback()