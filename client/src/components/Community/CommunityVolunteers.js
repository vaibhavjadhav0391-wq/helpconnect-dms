import React from 'react'

export const CommunityVolunteers = () => {
  return (
    <div className="community-volunteers">
        <div className="page-header">
          <h2 className="section-title">Volunteers</h2>
          <p className="section-subtitle">People available to assist this community.</p>
        </div>
        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>UserID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Rohit Patil</td>
                <td>rohit.patil@gmail.com</td>
                <td>+91 98765 43210</td>
                <td>Andheri, Mumbai</td>
                <td>true</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Neha Joshi</td>
                <td>neha.joshi@gmail.com</td>
                <td>+91 98111 22334</td>
                <td>Pune, Maharashtra</td>
                <td>false</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  )
}
