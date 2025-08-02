import React from 'react';
import './css/register.css';
 
export default function Register() {
  
  function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;

    const fullName = form.fullName.value;
    const email = form.email.value;
    const mobile = form.mobile.value;
    const year = form.year.value;
    const department = form.department.value;
    
    
    
    
    if (fullName.trim() === '') 
    {
      alert('Please enter your full name.');
      return;
    }
    
    else if (email.trim() === '') 
    {
      alert('Please enter your email address.');
      return;
    }

    else if (mobile.trim() === '') 
    {
      alert('Please enter your mobile number.');
      return;
    }

    else if (year.trim() === '') 
    {
      alert('Please enter your year.');
      return;
    }

    else if (department.trim() === '') 
    {
      alert('Please enter your department.');
      return;
    }

    else
    {
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          mobile: mobile,
          year: year,
          department: department
        })
      })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Registered successfully");
        form.reset(); 
      })
      .catch((err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Try again.');
      });
    }
  }
 return(
  <>
 
    {/* <!-- Header Section --> */}
    <header className="header-section">
      <div className="header-icon">👤</div>
      <h1>Join Campus Sports Hub</h1>
      <p>Start your athletic journey with us today</p>
    </header>

    {/* <!-- Main Form --> */}
    <main className="form-container">
      <div className="form-icon">👤</div>
      <h2>Personal Information</h2>
      <p className="form-subtitle">Tell us about yourself</p>
      <form method="post" onSubmit={handleSubmit} className="register-form">
        <div className="form-group">
          <label htmlFor="fullName">Full Name *</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@college.edu"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile">Phone Number *</label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            placeholder="Enter 10 digit number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year">Academic Year *</label>
          <select id="year" name="year" required>
            <option value="">Select your year</option>
            <option>First Year</option>
            <option>Second Year</option>
            <option>Third Year</option>
            <option>Final Year</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="department">Department/Major *</label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="e.g., Computer Science, Business, Engineering"
            required
          />
        </div>

        <div className="social-login">
          <button type="button" className="google-btn">
            <img
              src="https://img.icons8.com/color/16/000000/google-logo.png"
              alt="Google"
            />
            Continue with Google
          </button>
          <button type="button" className="facebook-btn">
            <img
              src="https://img.icons8.com/color/16/000000/facebook-new.png"
              alt="Facebook"
            />
            Continue with Facebook
          </button>
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </main>
  </>
 );
}
