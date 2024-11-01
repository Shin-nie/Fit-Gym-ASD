import React, { useState, useEffect } from "react";
import profileImage from "../assets/placeholder.png";
import Modal from "react-modal";

Modal.setAppElement("#root");

function CustomerProfile() {
  const [customerInfo, setCustomerInfo] = useState({
    id: "", // Add id to the state
    name: "",
    bio: "",
    email: "",
    phone: "",
    address: "",
    fitnessGoal: "",
    progress: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(customerInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificates, setCertificates] = useState([]); // State for certificates

  // Fetch customer data from the backend when the component loads
  useEffect(() => {
    const customerId = localStorage.getItem("loggedInUser"); // Fetch logged-in customer ID
    fetch(`http://localhost:3000/api/customers/${customerId}`) // Dynamic customer ID
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch customer data");
        }
        return response.json();
      })
      .then((data) => {
        const updatedCustomerInfo = {
          id: data.customer_id,
          name: `${data.first_name} ${data.last_name}` || "", // Concatenate first and last name
          bio: data.bio || " Fitness enthusiast", // Placeholder
          email: data.email_address,
          phone: data.phone_number,
          address: data.street_address || "No address provided", // Placeholder
          fitnessGoal: data.fitnessGoal || "Lose weight", // Placeholder
          progress: data.progress || "50%", // Placeholder
        };
        setCustomerInfo(updatedCustomerInfo);
        setFormData(updatedCustomerInfo);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = () => {
  if (window.confirm("Are you sure you want to delete this customer profile?")) {
    console.log("Attempting to delete customer with ID:", customerInfo.id); // Log the customer ID
    fetch(`http://localhost:3000/api/customers/${customerInfo.id}`, { // Use the correct customer ID
      method: "DELETE",
    })
      .then((response) => {
        console.log("Delete response:", response); // Log the response for debugging
        if (!response.ok) {
          throw new Error("Failed to delete customer");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Customer deleted successfully:", data);
        alert("Customer profile deleted.");
        setCustomerInfo({}); // Clear customer info from the state
      })
      .catch((error) => {
        console.error("Error deleting customer:", error); // Log the actual error
        alert("There was an issue deleting the profile.");
      });
  }
};

  const handleEditToggle = () => {
    setFormData(customerInfo); // Ensure the form data is pre-filled with the latest customer info
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Sending updated data:", formData); // Log data being sent
  
    // Split the full name into first and last names
    const nameParts = formData.name.trim().split(" ");
    const firstName = nameParts[0]; // First part as first name
    const lastName = nameParts.slice(1).join(" ") || "Doe"; // Remaining parts as last name (default to "Doe" if none)
  
    // Update the customer info via an API call
    fetch(`http://localhost:3000/api/customers/${customerInfo.id}`, { // Use the appropriate customer ID
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName, 
        last_name: lastName, // Properly split last name
        email_address: formData.email,
        phone_number: formData.phone,
        street_address: formData.address,
        fitnessGoal: formData.fitnessGoal,
        progress: formData.progress
      }),
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update customer data");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response from server:", data); // Log the response from the server
      setCustomerInfo(formData); // Update the displayed customer info
      setIsEditing(false); // Close the modal
    })
    .catch((error) => {
      console.error("Error updating customer data:", error); // Log any errors
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="customer-profile">
      <img src={profileImage} alt="Customer" className="customer-image" />
      <div className="customer-info">
        <h2>{customerInfo.name}</h2>
        <p><strong>Bio: </strong>{customerInfo.bio}</p>
        <p><strong>E-mail: </strong>{customerInfo.email}</p>
        <p><strong>Phone: </strong>{customerInfo.phone}</p>
        <p><strong>Address: </strong>{customerInfo.address}</p>
        <p><strong>Fitness Goal: </strong>{customerInfo.fitnessGoal}</p>
        <p><strong>Progress: </strong>{customerInfo.progress}</p>
        <button onClick={handleEditToggle} className="primary-button">Update Info</button>
        <button onClick={handleDelete} className="danger-button">Delete Profile</button>
      </div>

      {/* Modal for editing the customer infoooooooooooooooo */}
      <Modal isOpen={isEditing} onRequestClose={handleEditToggle} className="modal" overlayClassName="modal-overlay">
        <h2>Edit Customer Info</h2>
        <div className="modal-content">
          <div className="input-row">
            <div className="input-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="bio">Bio</label>
              <input
                type="text"
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="fitnessGoal">Fitness Goal</label>
              <input
                type="text"
                id="fitnessGoal"
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="modal-buttons">
          <button onClick={handleSave} className="primary-button">Save</button>
          <button onClick={handleEditToggle} className="secondary-button">Cancel</button>
        </div>
      </Modal>
    </div>
  );
}

export default CustomerProfile;