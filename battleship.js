var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },

    displayHit: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

var model = {
    boardSize: 7,
    numShips: 3,
    shipLenght: 3,
    shipsSunk: 0,

    ships: [{locations: ["", "", ""], hits: ["", "", ""]},
        {locations: ["", "", ""], hits: ["", "", ""]},
        {locations: ["", "", ""], hits: ["", "", ""]}],

    fire: function (guess) {
        for (var i = 0; i < this.numShips; ++i) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            // -1 dla nieznalecionej wartości
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("Trafiony!");
                if (this.isSunk(ship)) {
                    view.displayMessage("Zatopiłeś mi okręt");
                    ++this.shipsSunk;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("Spudłowałeś");
        return false;
    },

    isSunk: function (ship) {
        for (var i = 0; i < this.shipLenght; ++i) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },

    generateShipLocations: function () {
        var locations;
        for (var i = 0; i < this.numShips; ++i) {
            do {
                locations = this.generateShip();
            } while (this.collisions(locations));
            this.ships[i].locations = locations;
        }
    },

    generateShip: function () {
        var direction = Math.floor(Math.random() * (2));
        var col, row;

        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - this.shipLenght));
            col = Math.floor(Math.random() * this.boardSize);
        }

        var newShipLocations = [];
        for (var i = 0; i < this.shipLenght; ++i) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },

    collisions: function (locations) {
        for(var i = 0; i < this.numShips; ++i){
            var ship = model.ships[i];
            for(var j = 0; j < locations.length; ++j){
                if(ship.locations.indexOf(locations[j]) >= 0){
                    return true;
                }
            }
        }
        return false;
    }
};

var controller = {
    guesses: 0,

    processGuess: function (guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("Zatopiłeś wszystkie moje okręty w " + this.guesses + " próbach");
            }
        }
    }
}

function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

    if (guess === null || guess.length !== 2) {
        alert("Podano coś innego niż literę i cyfrę");
    } else {
        var firstChar = guess.charAt(0);
        var row = alphabet.indexOf(firstChar);
        var column = guess.charAt(1);

        if (isNaN(row) || isNaN(column)) {
            alert("Ups, to nie są współrzędne");
        }
        else if (row < 0 || column < 0 || row >= model.boardSize || column >= model.boardSize) {
            alert("Ups, pole poza planszą");
        } else {
            return row + column;
        }
    }

    return null;
}


function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
}

function handleKeyPress(event) {
    var fireButton = document.getElementById("fireButton");
    if (event.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

window.onload = init;