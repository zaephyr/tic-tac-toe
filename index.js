let playingVsComputer = false;
let winner = false;

const startGame = () => {
    playingVsComputer = false;
    const player1 = document.getElementById('p1');
    const player2 = document.getElementById('p2');
    if (player1.value == '') player1.value = 'player1';
    if (player2.value == '') player2.value = 'player2';

    const ps1 = document.getElementById('score1');
    ps1.textContent = 0;
    const ps2 = document.getElementById('score2');
    ps2.textContent = 0;

    clearBoard();

    playTurn.xTurn = 0;
    playTurn.oTurn = 0;

    setPlayers.playerO.score = 0;
    setPlayers.playerX.score = 0;

    setPlayers.playerX.name = player1.value;
    setPlayers.playerO.name = player2.value;
};

const vsComputer = () => {
    startGame();
    document.getElementById('p2').value = 'Computer';
    playingVsComputer = true;
};

const winCondition = (xo, arr) => {
    const display = document.querySelector('.msg-display');

    const allConditions = {
        firstRow: arr.slice(0, 3),
        secondRow: arr.slice(3, 6),
        thirdRow: arr.slice(6, 9),

        firstColumn: [arr[0], arr[3], arr[6]],
        secondColumn: [arr[1], arr[4], arr[7]],
        thirdColumn: [arr[2], arr[5], arr[8]],

        diagonalLeft: [arr[0], arr[4], arr[8]],
        diagonalRight: [arr[2], arr[4], arr[6]],
    };

    for (const key in allConditions) {
        const players = [setPlayers.playerX, setPlayers.playerO];
        if (allConditions[key].every((el) => el == xo)) {
            for (let i = 0; i < players.length; i++) {
                if (players[i].xo == xo) {
                    const winP = players[i];
                    winP.score += 1;
                    winner = true;
                    display.textContent = `The winner is: ${winP.name}`;
                    clickEvent.listenerEnder();
                    if (xo == 'X') {
                        const ps1 = document.getElementById('score1');
                        ps1.textContent = winP.score;
                    } else {
                        const ps2 = document.getElementById('score2');
                        ps2.textContent = winP.score;
                    }

                    return winP;
                }
            }
        }
    }
    if (!gameboardArr.some((el) => el == '')) {
        if (!winner) {
            clickEvent.listenerEnder();
            display.textContent = 'We have a tie!';
        }
    }
};

const playerFactory = (name, xo) => {
    return { name, xo };
};

const setPlayers = (() => {
    const playerX = playerFactory('player1', 'X');
    const playerO = playerFactory('player2', 'O');

    return { playerX, playerO };
})();

let gameboardArr = ['', '', '', '', '', '', '', '', ''];
const playTurn = (() => {
    let xTurn = 0;
    let oTurn = 0;
    return { oTurn, xTurn };
})();

const clearBoard = () => {
    const square = document.querySelectorAll('.square');
    for (let i = 0; i < gameboardArr.length; i++) {
        gameboardArr[i] = '';
    }
    square.forEach((el) => (el.textContent = ''));
    if (playingVsComputer) {
        winner = false;
        playTurn.xTurn = 0;
        playTurn.oTurn = 0;
    }

    clickEvent.listenerStarter();
};

const getAllEmptyCells = (arr, val) => {
    let indexes = [];
    for (let i = 0; i < arr.length; i++) if (arr[i] === val) indexes.push(i);
    return indexes;
};

const playRound = (e) => {
    const click = e.target;
    const playerX = setPlayers.playerX;
    const playerO = setPlayers.playerO;

    if (click.textContent == '')
        if (playTurn.xTurn == playTurn.oTurn) {
            gameboardArr.splice(click.id, 1, playerX.xo);
            click.textContent = playerX.xo;
            playTurn.xTurn += 1;
            winCondition(playerX.xo, gameboardArr);
            if (playingVsComputer && !winner) {
                let indexes = getAllEmptyCells(gameboardArr, '');
                let pick = Math.floor(Math.random() * indexes.length);

                gameboardArr.splice(indexes[pick], 1, playerO.xo);
                playTurn.oTurn += 1;
                document.getElementById(indexes[pick]).textContent = playerO.xo;
                winCondition(playerO.xo, gameboardArr);
            }
        } else {
            gameboardArr.splice(click.id, 1, playerO.xo);
            click.textContent = playerO.xo;
            playTurn.oTurn += 1;
            winCondition(playerO.xo, gameboardArr);
        }
};

const clickEvent = (() => {
    const start = document.getElementById('start');
    const reset = document.getElementById('reset');
    const vsAI = document.getElementById('comp');

    const square = document.querySelectorAll('.square');

    start.addEventListener('click', startGame);
    reset.addEventListener('click', clearBoard);
    vsAI.addEventListener('click', vsComputer);

    const listenerStarter = () => {
        const display = document.querySelector('.msg-display');

        for (let i = 0; i < square.length; i++) {
            square[i].addEventListener('click', playRound);
        }
        display.textContent = '';
        document.styleSheets[0].insertRule('.square:hover { background-color: #67e6dc}', 0);
        document.styleSheets[0].insertRule('.square:active { background-color: #67e6dc}', 0);
    };

    const listenerEnder = () => {
        for (let i = 0; i < square.length; i++) {
            square[i].removeEventListener('click', playRound);
        }
        document.styleSheets[0].removeRule('.square:hover { background-color: #67e6dc}', 0);
        document.styleSheets[0].removeRule('.square:active { background-color: #67e6dc}', 0);
    };

    return { listenerStarter, listenerEnder };
})();
