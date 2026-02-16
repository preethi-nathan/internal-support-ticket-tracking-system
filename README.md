# Internal Support Ticket Tracking System

##  Overview
The Internal Support Ticket Tracking System is a full-stack web application designed to manage internal issue reporting and resolution within an organization.

It allows employees to:
- Create support tickets
- Assign priority levels
- Update ticket status
- Filter tickets
- Delete tickets
- View dashboard statistics

---

## Tech Stack

### Frontend
- React (Vite)
- Axios
- CSS (Flexbox Layout)

### Backend
- Node.js
- Express.js
- MySQL
- dotenv
- CORS

---

## Database Schema

```sql
create database ticket_tracking_sys;
use ticket_tracking_sys;
create table tickets( id int auto_increment primary key, 
                      title varchar(255) not null,
                      description text not null,
                      priority enum('low','medium','high') not null,
                      status enum('open','in-progress','resolved') not null default 'open',
                      assigned_to varchar(100),
                      created_at timestamp default current_timestamp);
