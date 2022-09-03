import React, { useEffect, useState, useParams } from "react";

const Project = () => {
    let { id } = useParams();
    const [AddItem,setAddItem] = useState([]);
    const [Brain, setBrain] = useState(["CHicken", "Eggs"]);
    const [Ongoing,setOngoing] = useState([]);
    const [Completed,setCompleted] = useState([]);


    console.log(id)
        const Brainstorming = (Brain) => {
                return (
                    <div>
                        <p>{ this.state.Brain.length } Brain</p>
                        {this.state.Brain.map((s) => <p key={ s.id }>{ s.content }</p>) }
                    </div>
                );
            }
    

    return(
        <div className="newProject">
            <h1>Create a new Project</h1>
            <label>Project name</label>
            <input type='text' name='project' placeholder='Project Name' />
            
            <div className="tasks">
                <div className="header">
                    <form onSubmit={() => setBrain(Brain)}>
                        <input placeholder="Brainstorming" />
                        <button type="submit">Add Idea</button>
                    </form>
                </div>
                <div className="header">
                    <form onSubmit={() => setAddItem(AddItem)}>
                        <input placeholder="New Task" />
                        <button type="submit">Add Task</button>
                    </form>
                </div>
                <div className="header">
                    <form onSubmit={() => setOngoing(Ongoing)}>
                        <input placeholder="On going Task" />
                        <button type="submit">Add ongoing Task</button>
                    </form>
                </div>
                <div className="header">
                    <form onSubmit={() => setCompleted(Completed)}>
                        <input placeholder="Finished Task" />
                        <button type="submit">Add Completed Tasks</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Project;