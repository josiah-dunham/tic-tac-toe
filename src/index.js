import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.squareClassName} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let winningSquares = this.props.winningSquares;
        let isWinningSquare = winningSquares.findIndex(w => w === i);
        let squareClassName = 'square';

        if(isWinningSquare >= 0) {
            squareClassName += ' square-winner';
        }
        else if(this.props.lastClicked === i) {
            squareClassName += ' square-active';
        }

        if(this.props.squares[i] == 'X') {
            squareClassName += ' square-x';
        }
        else if(this.props.squares[i] == 'O') {
            squareClassName += ' square-o';
        }

        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                squareClassName={squareClassName}
                onClick={() => this.props.onClick(i)}
            />
        );
    }
  
    renderBoard() {
    	let board = [];
    	for( let b = 0; b < 3; b++ ) {
    		let squares = [];
    		for( let s = 0; s < 3; s++ ) {
    			squares.push(this.renderSquare((b * 3) + s));
    		}
    		board.push(<div key={b} className="board-row">{squares}</div>);
    	}
    		
        return board;
      }

    render() {
        return (
          <div>
            {this.renderBoard()}  
          </div>
        );
    }  
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            historyLocations: [],
            stepNumber: 0,
            xIsNext: true,
            isWinningSquare: false,
            winningSquares: Array(3).fill(null),
            lastClicked: null
        };
    }
  
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const historyLocations = this.state.historyLocations.slice(0, this.state.stepNumber);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? "X" : "O";

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            historyLocations: historyLocations.concat([{
                x: Math.floor(i/3),
                y: i%3
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            lastClicked: i
        });
    }
  
    jumpTo(step) {
        const historyLocations = this.state.historyLocations.slice(0, step);
        const current = historyLocations[historyLocations.length - 1];

        let lastClicked = null;

        if(step > 0) {
            const y = current.y;
            const x = current.x;

            lastClicked = (x * 3) + y;
        }

        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            lastClicked: lastClicked
        });
    }
	
	historyHoverIn(step) {
		const historyLocations = this.state.historyLocations.slice(0, step);
		const current = historyLocations[historyLocations.length - 1];

		let hovering = null;

		if(step > 0) {
			const y = current.y;
			const x = current.x;

			hovering = (x * 3) + y;
		}

		this.setState({
			lastClicked: hovering
		});       
    }
	
	historyHoverOut(step) {
		const historyLocations = this.state.historyLocations.slice();
		const current = historyLocations[historyLocations.length - 1];
		
		let lastClicked = null;

		if(step > 0) {
			const y = current.y;
			const x = current.x;

			lastClicked = (x * 3) + y;
		}
		
		this.setState({
			lastClicked: lastClicked
		});
    }
	
	setHistoryWinningRows(winner) {
		const historyLocations = this.state.historyLocations.slice();
		const history = this.state.history.slice();
		
	
		for(let h = 0; h < historyLocations.length; h++ ) {
			let y = historyLocations[h].y;
			let x = historyLocations[h].x;

			let squareNumber = (x * 3) + y;
			
			let isWinningSquare = winner.squares.findIndex(w => w === squareNumber);
			if(isWinningSquare >= 0) {
				console.log(squareNumber + ' is a winner!');
			}
			else {
				console.log(squareNumber + ' is not a winner :(');
			}
		}
    }

    calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                let winner = {
                    player: squares[a],
                    squares: [a,b,c]
                };
				
                return winner;
            }
        }
        
        let isBoardFull = squares.findIndex(function(e) {
            if(e) {
                return false
            } 
            return true;
        });

        if( isBoardFull === -1 ){
            let winner = {
                player: 'N',
                squares: []
            };
			
            return winner;
        }
        return null;
    }
  
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
            'Move #' + move + ': ' + ((move % 2 === 0) ? 'O' : 'X') + ' [' + this.state.historyLocations[move - 1].y + ',' + this.state.historyLocations[move - 1].x + ']' :
            'Go to game start';
			
			let divClassName = (move === this.state.stepNumber) ? "divBtn divBtnActive" : "divBtn";
			if(winner && winner['player'] && this.state.historyLocations[move - 1] ) {
				let squareNumber = (this.state.historyLocations[move - 1].x * 3) + this.state.historyLocations[move - 1].y;
			
				let isWinningSquare = winner.squares.findIndex(w => w === squareNumber);
				if(isWinningSquare >= 0) {
					divClassName += ' divBtn-winner';
				}
			}

            return (
                <div key={move} className={divClassName} onClick={() => this.jumpTo(move)} onMouseEnter={() => this.historyHoverIn(move)} onMouseLeave={() => this.historyHoverOut(move)}>
                    {desc}
                </div>
            );
        });

        let status;
        if (winner && winner['player']) {
            if(winner['player'] === 'N') {
                status = "Game Over: Cat's Game!"
            }
            else {
                status = winner['player'] + " Wins!";
				//this.setHistoryWinningRows(winner);
            }
        }
        else {
            status = (this.state.xIsNext ? "X" : "O") + ": Your turn!";
        }
        return (
            <div className="game">
                <div className="game-board">
                    <div><h2>Tic-Tac-Toe!</h2></div>
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winningSquares={(winner) ? winner['squares'] : []}
                        lastClicked={this.state.lastClicked}
                    />
                    <div><h4>{status}</h4></div>
                </div>

                <div className="game-info">
                    <div><h2>Move History</h2></div>
                    <div className="game-moves">{moves}</div>
                </div>
            </div>
        );
    }
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));


