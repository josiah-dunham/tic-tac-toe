import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
	
    return (
        <button className={props.isWinningSquare ? 'square winningSquare' : 'square'} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        
        let winningSquares = this.props.winningSquares;
        let isWinningSquare = winningSquares.findIndex(w => w === i)

        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                isWinningSquare={isWinningSquare >= 0}
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
            winningSquares: Array(3).fill(null)
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
            xIsNext: !this.state.xIsNext
        });
    }
  
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    calculateWinner(squares) {
        console.log();
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
            'Go to move #' + move :
            'Go to game start';

            const loc = move ? '[' + this.state.historyLocations[move - 1].y + ',' + this.state.historyLocations[move - 1].x + ']' : '';
            const btnClassName = (move === this.state.stepNumber) ? "moveBtn moveBtnActive" : "moveBtn";

            return (
                <li key={move}>
                    <button className={btnClassName} onClick={() => this.jumpTo(move)}>{desc}</button><span className={btnClassName}> {loc}</span>
                </li>
            );
        });

        let status;
        if (winner && winner['player']) {
            if(winner['player'] === 'N') {
                status = "Game Over: Cat's Game!"
            }
            else {
                status = winner['player'] + " Wins!";
            }
        }
        else {
            status = (this.state.xIsNext ? "X" : "O") + ": Your turn!";
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        winningSquares={(winner) ? winner['squares'] : []}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}
// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));


