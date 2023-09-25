import os

class Config(object):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///market.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False