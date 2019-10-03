from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__, static_url_path='', static_folder='src/client/app/build',
            instance_relative_config=True)
app.add_url_rule('/', 'root', lambda: app.send_static_file('index.html'))
#app.config.from_object('config')
#app.config.from_pyfile('config.py')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists("src/client/app/build" + path):
        return send_from_directory('src/client/app/build', path)
    else:
        return send_from_directory('src/client/app/build', 'index.html')

if __name__ == '__main__':
    app.run(port=int(os.environ.get("PORT", 5000)), debug=True)

# Databases
db = SQLAlchemy(app)
