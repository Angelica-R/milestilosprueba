import pickle
import json
import random
import numpy as np
import nltk
from nltk.stem.lancaster import LancasterStemmer
from nltk.stem import SnowballStemmer
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import SGD


stemmer = SnowballStemmer("spanish")

with open("intents.json") as file:
    data = json.load(file)

words = []
labels = []
docs_x = []
docs_y = []

for intent in data["intents"]:
    for pattern in intent["patterns"]:
        wrds = nltk.word_tokenize(pattern)
        print("WordTookenikzed:", wrds)
        words.extend(wrds)
        docs_x.append(wrds)
        docs_y.append(intent["tag"])

        if intent["tag"] not in labels:
            labels.append(intent["tag"])

# Creamos una lista vacía para almacenar las palabras procesadas
processed_words = []

# Recorremos cada palabra en la lista "words"
for w in words:
    print("ww:", w)
    # Verificamos si la palabra no es un signo de interrogación
    if w != "?" and w != "¿":
        # Convertimos la palabra a minúsculas
        lowercase_word = w.lower()

        # Aplicamos "stemming" para obtener la forma base de la palabra
        stemmed_word = stemmer.stem(lowercase_word)

        # Agregamos la palabra procesada a la lista "processed_words"
        processed_words.append(stemmed_word)

# Ahora, reemplazamos la variable "words" con la lista de palabras procesadas
words = processed_words
print("proccessedwords:", words)
words = sorted(list(set(words)))

labels = sorted(labels)

training = []
output = []

out_empty = [0 for _ in range(len(labels))]

for x, doc in enumerate(docs_x):
    bag = []

    wrds = [stemmer.stem(w.lower()) for w in doc]

    for w in words:
        if w in wrds:
            bag.append(1)
        else:
            bag.append(0)

    output_row = out_empty[:]
    output_row[labels.index(docs_y[x])] = 1

    training.append(bag)
    output.append(output_row)

training = np.array(training)
output = np.array(output)

with open("data.pickle", "wb") as f:
    pickle.dump((words, labels, training, output), f)


# tensorflow.compat.v1.reset_default_graph()

# Define el modelo Keras
model = Sequential()
model.add(Dense(8, input_shape=(len(training[0]),), activation="relu"))
model.add(Dense(8, activation="relu"))
model.add(Dense(len(output[0]), activation="softmax"))

# Compila el modelo
sgd = SGD(learning_rate=0.01)
model.compile(loss="categorical_crossentropy", optimizer=sgd, metrics=["accuracy"])

try:
    model.load_weights("model.keras")
except:
    # Entrena el modelo
    model.fit(training, output, epochs=1200, batch_size=16)
    model.save("model.keras")

