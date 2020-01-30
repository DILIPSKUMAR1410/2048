import React from 'react'
import './Scoreboard.css'
class Scoreboard extends React.Component {
    constructor(props) {
        super(props);
        this.renderTableData = this.renderTableData.bind(this);
        this.game=this.game.bind(this);
        this.home=this.home.bind(this);
    }
    game(){
        this.props.history.push("/game");
    }
    home(){
        this.props.history.push("/");
    }
    renderTableData(){
        var temp=[];
        if(localStorage.getItem("cirulli"))
        temp=JSON.parse(localStorage.getItem("cirulli"));
        return temp.map((a, index) => {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td><p id={index}>{a[1]}</p></td>
                    <td><p id={index}>{a[0]}</p></td>
                </tr>
            )
        });
    }
    render() {
        return (
            <div>
                <h2 onClick={this.home}>Cirulli</h2>
            <div class="list">
                <h1>Scoreboard</h1>
                <div className="table">
                <table>
                    <th>S No</th>
                    <th><span>Score</span></th>
                    <th><span>Date</span></th>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </table>
                </div>
                <button onClick={this.game}>New Game</button>
            </div>
            </div>
        )
    }
}
export default Scoreboard;