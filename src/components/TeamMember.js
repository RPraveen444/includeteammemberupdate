import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/TeamMember.css'; // Import the CSS file

const TeamMember = () => {
    const location = useLocation();
    const username = location.state?.username || 'Unknown User';
    const [milestones, setMilestones] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    // Fetch team member data
    const fetchTeamMemberData = async () => {
        try {
            const response = await fetch(`http://localhost:4001/get_teammember_by_name?name=${username}`);
            const data = await response.json();
            console.log('Team Member Data:', data);
        } catch (error) {
            console.error('Error fetching team member data:', error);
        }
    };

    // Fetch milestones
    const fetchMilestones = async () => {
        try {
            const response = await fetch('http://localhost:4001/getall_milestones');
            const data = await response.json();
            setMilestones(data);
        } catch (error) {
            console.error('Error fetching milestones:', error);
        }
    };

    // Fetch tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:4001/get_tasks_byusername?name=${username}`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    useEffect(() => {
        if (username && username !== 'Unknown User') {
            fetchTeamMemberData();
            fetchMilestones();
            fetchTasks();
        } else {
            console.warn('Username not provided or invalid.');
        }
    }, [username]);

    // Combine tasks with milestones
    const combinedData = milestones.map(milestone => {
        const milestoneTasks = tasks.filter(task => task.milestone_id === milestone.milestone_id);
        return {
            ...milestone,
            tasks: milestoneTasks
        };
    });

    return (
        <div className="team-member-container">
            <div className="milestones-container">
                <h1 className="welcome-message">Team Member Page</h1>
                <p className="welcome-text">Welcome, {username}!</p>

                <div className="milestones">
                    {combinedData.map(milestone => (
                        <div key={milestone.milestone_id} className="milestone">
                            <h3 className="milestone-title">{milestone.milestone_name}</h3>
                            <p className="milestone-description">{milestone.milestone_description}</p>
                            <div className="tasks">
                                {milestone.tasks.length > 0 ? (
                                    <ul>
                                        {milestone.tasks.map(task => (
                                            <li key={task.task_id} className="task-item">
                                                <button 
                                                    onClick={() => setSelectedTask(task)} 
                                                    className="task-button"
                                                >
                                                    {task.task_name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No tasks for this milestone.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedTask && (
                <div className="task-details">
                    <button className="close-button" onClick={() => setSelectedTask(null)}>×</button>
                    <h2>Task Details</h2>
                    <p><strong>Task Name:</strong> {selectedTask.task_name}</p>
                    <p><strong>Description:</strong> {selectedTask.task_description}</p>
                    <p><strong>Status:</strong> {selectedTask.task_status}</p>
                    <p><strong>Start Date:</strong> {new Date(selectedTask.start_date).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong> {new Date(selectedTask.due_date).toLocaleDateString()}</p>
                </div>
            )}
        </div>
    );
};

export default TeamMember;
