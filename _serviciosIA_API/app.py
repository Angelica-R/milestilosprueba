from flask import Flask, request, jsonify
from flask_cors import CORS

import easyocr
import os

from tensorflow.keras.models import load_model
import nltk
from nltk.stem import SnowballStemmer
import pickle
import numpy as np
import json
import random

app = Flask(__name__)
CORS(app)
app.config['CARPETA_IMAGENES'] = 'uploads' # Carpeta donde se guardarán las imágenes

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return "No se ha proporcionado un archivo", 400

    file = request.files['file']

    if file.filename == '':
        return "No se ha seleccionado un archivo", 400

    if file:
        rutaImagen = os.path.join(app.config['CARPETA_IMAGENES'], file.filename)
        file.save(rutaImagen)
        try:
            etiqueta = extraerEtiqueta(rutaImagen)
            return jsonify(etiqueta), 200
        finally:
            os.remove(rutaImagen)

def extraerEtiqueta(rutaImagen):
    iniciales_buscar = 'ME-JCK'
    etiquetaIdentificada = None

    try:
        reader = easyocr.Reader(['en'], gpu=False)
        results = reader.readtext(rutaImagen, detail = 0)
        print("Results:", results)

        for elemento in results:
            if elemento.upper().startswith(iniciales_buscar):
                etiquetaIdentificada = elemento.upper()
                break
    except Exception as e:
        print(f"Errror: {e}")

    return {
        "etiqueta": etiquetaIdentificada
    }
    
@app.route('/chat', methods=['POST'])
def chat():
    
    request_data = request.get_json()
    user_message = request_data.get("mensaje", "")

    with open("data.pickle", "rb") as f:
        words, labels, training, output = pickle.load(f)
    
    with open("intents.json") as file:
        data = json.load(file)

    print("Start talking with the bot")

    model = load_model('model.keras')

    results = model.predict(np.array([bag_of_words(user_message, words)]))
    results_index = np.argmax(results)
    tag = labels[results_index]

    for tg in data["intents"]:
        if tg["tag"] == tag:
            responses = tg["responses"]
    respuesta = {
        "response": random.choice(responses)
    }
    return jsonify(respuesta), 200

def bag_of_words(s, words):
    stemmer = SnowballStemmer("spanish")
    # Crear una lista llamada "bag"
    bag = []
    # Obtener la longitud de la lista "words"
    longitud_words = len(words)
    # Iterar sobre la longitud de "words" y agregar ceros a "bag"
    for i in range(longitud_words):
        bag.append(0)

    s_words = nltk.word_tokenize(s)
    # Crear una lista vacía para almacenar las palabras procesadas
    s_words_processed = []
    # Iterar sobre cada palabra en la lista de palabras 's_words'
    for word in s_words:
        # Convertir la palabra a minúsculas y aplicar un proceso de "stemming"
        stemmed_word = stemmer.stem(word.lower())
        # Agregar la palabra procesada a la lista
        s_words_processed.append(stemmed_word)
    # Actualizar 's_words' para que contenga las palabras procesadas
    s_words = s_words_processed

    for se in s_words:
        for i, w in enumerate(words):
            if w == se:
                bag[i] = 1

    return np.array(bag)