import {useEffect,useState} from "react";
import axios from "axios";
import "./App.css";

function App(){
  const [tickets,setTickets]=useState([]);
  const [formData,setFormData]=useState({
    title:"",
    description:"",
    priority:"low",
    assigned_to:""
  });
  const [filters, setFilters]=useState({
    status:"",
    priority:""
  });

  const API_URL="http://localhost:5000/api/tickets";
  const openCount=tickets.filter(t =>t.status==="open").length;
  const resolvedCount=tickets.filter(t =>t.status==="resolved").length;

  const fetchTickets= async()=>{
    try{
      const res=await axios.get(API_URL,{params:filters});
      setTickets(res.data);
    } catch(error){
      console.error("Error fetching tickets:",error);
    }
  };

  useEffect(()=>{
    fetchTickets();
  }, []);

  const handleChange=(e)=>{
    setFormData({ ...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit=async(e) =>{
    e.preventDefault();
    try{
      await axios.post(API_URL,formData);
      fetchTickets();
      setFormData({title:"",description:"",priority:"low",assigned_to: "" });
    } catch(error){
      console.error("Error creating ticket:",error);
    }
  };

  const handleStatusChange= async(id,newStatus)=> {
    try{
      await axios.put(`${API_URL}/${id}`,{status:newStatus});
      fetchTickets();
    } catch(error){
      console.error("Error updating ticket:",error);
    }
  };

  const handleDelete= async(id)=>{
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try{
        await axios.delete(`${API_URL}/${id}`);
        fetchTickets();
      }catch(error){
        console.error("Error deleting ticket:",error);
      }
    }
  };

  return (
    <div className="container">
      <div className="main-flex">
        
        <div className="left-panel">
          <header className="header">
            <h1>Ticket Tracking System</h1>
          </header>

          <div className="dashboard">
            <div className="stat"><strong>{openCount}</strong><p>Open</p></div>
            <div className="stat"><strong>{resolvedCount}</strong><p>Resolved</p></div>
            <div className="stat"><strong>{tickets.length}</strong><p>Total</p></div>
          </div>

          <div className="section">
            <h2>Create Ticket</h2>
            <form onSubmit={handleSubmit} className="form">
              <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
              <div className="form-row">
                <select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <input type="text" name="assigned_to" placeholder="Assigned To" value={formData.assigned_to} onChange={handleChange} />
              </div>
              <button type="submit" className="btn-primary">Create Ticket</button>
            </form>
          </div>
        </div>

        <div className="right-panel">
          <div className="section">
            <h2>Filter Tickets</h2>
            <div className="filter-row">
              <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              <select value={filters.priority} onChange={(e) => setFilters({ ...filters, priority: e.target.value })}>
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button onClick={fetchTickets} className="btn-secondary">Apply</button>
            </div>
          </div>

          <div className="section">
            <h2>All Tickets</h2>
            {tickets.length === 0 ? (
              <p className="empty">No tickets found</p>
            ) : (
              <div className="tickets">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="ticket">
                    <div className="ticket-header">
                      <h3>{ticket.title}</h3>
                      <span className={`badge priority-${ticket.priority}`}>{ticket.priority}</span>
                    </div>
                    <p>{ticket.description}</p>
                    <div className="ticket-footer">
                      <select value={ticket.status} onChange={(e) => handleStatusChange(ticket.id, e.target.value)} className="status-select">
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button onClick={() => handleDelete(ticket.id)} className="btn-danger">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
