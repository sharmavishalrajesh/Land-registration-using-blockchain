import React, { useState } from 'react';
import emblem from '../images/emblem.svg';
import '../css/SuperAdmin.css';
import { NavLink } from 'react-router-dom';

const SuperAdmin = (props) => {
  const { web3, contract } = props.myWeb3Api; // Extract web3 and contract from props
  const account = props.account; // Extract account from props

  const [adminData, setAdminData] = useState({
    address: "", state: "", district: "", city: ""
  });

  // Handle input changes
  const onChangeFunc = (event) => {
    const { name, value } = event.target;
    setAdminData({ ...adminData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form from submitting the traditional way

    try {
      // Call the contract's addAdmin function using contract.methods
      await contract.methods.addAdmin(
        adminData.address, 
        adminData.state, 
        adminData.district, 
        adminData.city
      ).send({ from: account });

      console.log('Admin details submitted successfully');
      setAdminData({ address: "", state: "", district: "", city: "" }); // Reset form data
    } catch (error) {
      console.error("Error submitting admin details:", error);
    }
  };

  return (
    <div className='container superAdmin-mainDiv'>
      <div className='superAdmin-heading-div'>
        <NavLink to='/'>
          <img src={emblem} alt="emblem" className="emblem" />
        </NavLink>
        <h1>Super Admin</h1>
      </div>

      <p className='superAdmin-p'>Add an Admin</p>

      <form method='POST' className='admin-form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Admin Address</label>
          <input 
            type="text" 
            className="form-control" 
            name="address" 
            placeholder="Enter admin address"
            autoComplete="off" 
            value={adminData.address} 
            onChange={onChangeFunc} 
          />
        </div>
        <div className='form-group'>
          <label>State</label>
          <input 
            type="text" 
            className="form-control" 
            name="state" 
            placeholder="Enter state"
            autoComplete="off" 
            value={adminData.state} 
            onChange={onChangeFunc} 
          />
        </div>
        <div className='form-group'>
          <label>District</label>
          <input 
            type="text" 
            className="form-control" 
            name="district" 
            placeholder="Enter district"
            autoComplete="off" 
            value={adminData.district} 
            onChange={onChangeFunc} 
          />
        </div>
        <div className='form-group'>
          <label>City</label>
          <input 
            type="text" 
            className="form-control" 
            name="city" 
            placeholder="Enter city"
            autoComplete="off" 
            value={adminData.city} 
            onChange={onChangeFunc} 
          />
        </div>
        <button className='admin-form-btn' type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SuperAdmin;
