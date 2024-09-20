import React, { useState, useEffect } from 'react';
import './navigation.css';
import avatar from '../../img/avatar.png';
import { useGlobalContext } from '../../Context/globalContext';
import { menuitems } from '../../Utils/menuitems';
import axios from 'axios';

function Navigation({ active, setActive }) {
    
    const [name, setName] = useState('');
    const URL = 'http://localhost:3001/api/v1/'; // Define your URL or base URL here

    const getName = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`${URL}getName`, {
                headers: {
                    'user-id': userId // Send userId in the headers
                }
            });
            setName(response.data.name); // Assuming the API returns an object with a "name" property
        } catch (error) {
            console.error('Error fetching name:', error);
        }
    };

    useEffect(() => {
        getName();
    }, []); // Empty dependency array to run only once on component mount

    return (
        <div className='navigation-div'>
            <div className="user-con">
                <img src={avatar} alt="logo" />
                <div className="text">
                    <h2>{name}</h2>
                    <p>Your Money</p>
                </div>
            </div>
            <ul className='menu-items'>
                {menuitems.map((item) => {
                    return (
                        <li key={item.id} 
                            onClick={() => setActive(item.id)}
                            className={active === item.id ? 'active' : ''}
                        >
                            {item.icon}
                            <span>{item.title}</span>
                        </li>
                    );
                })}
            </ul>
            <div className="bottom-nav">
                <li><a href='/'>
                  <i className="fa-solid fa-right-from-bracket"></i> Sign Out</a>
                </li>
            </div>
        </div>
    );
}

export default Navigation;
