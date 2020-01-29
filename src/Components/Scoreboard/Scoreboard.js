import React from 'react'
import './Scoreboard.css'
class Scoreboard extends React.Component {
    constructor(props) {
        super(props);
        this.renderTableData = this.renderTableData.bind(this);
        this.game=this.game.bind(this);
    }
    game(){
        this.props.history.push("/game");
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
            <div class="list">
                <table>
                    <th>S No</th>
                    <th><span>Score</span></th>
                    <th><span>Date</span></th>
                    <tbody>
                        {this.renderTableData()}
                    </tbody>
                </table>
                <button onClick={this.game}>New Game</button>
            </div>
        )
    }
}
export default Scoreboard;