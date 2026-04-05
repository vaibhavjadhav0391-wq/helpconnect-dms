import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate} from 'react-router-dom'
import "../../assets/CSS/Medicals.css"
import { useSelector } from 'react-redux'

export const Medicals = () => {
    const apiBase = process.env.REACT_APP_API_URL || (
        typeof window !== 'undefined' && window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://helpconnect-dms.onrender.com'
    );
    const isAdmin = useSelector(state => state.roleState.isAdmin);
    const user = useSelector(state => state.userState.user);
    const [updateMed, setUpdateMed]= useState(false);
    console.log(isAdmin);
    const [updateID, setUpdateID]= useState(0);

    const CName = useRef();
    const CAddress = useRef();
    const CHotline = useRef();
    const CEmail = useRef();
    const CRating = useRef();
    const CType = useRef();
    const CSeats = useRef();

    
    const navigate = useNavigate();
    const linkMedical=(id)=>{
        navigate(`/medical/${id}`);
    }
    const [showFilter, setShowFilter]= useState(false);
    const [MedicalCenters, setMedicalCenters] =useState([]);
    const [allMedical, setAllMedical] = useState([]); 
    const [facilityStatus, setFacilityStatus] = useState('idle');
    const [facilityError, setFacilityError] = useState('');
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [requestForm, setRequestForm] = useState({
        type: 'hospital',
        name: '',
        address: '',
        district: '',
        phone: '',
        email: '',
        seats: '',
        description: ''
    });
    const [requestStatus, setRequestStatus] = useState('');
    const [requestError, setRequestError] = useState('');
    const [userRequests, setUserRequests] = useState([]);

    const filterRating = useCallback((rate) => {
        const updatedMedicals = allMedical.filter((meds) => meds.Rating >= rate && meds.Rating < rate + 1);
        setMedicalCenters(updatedMedicals);
    }, [allMedical]);

    const filterType = useCallback((type) => {
        if (type === "") {
            return;
        }
        const updatedMedicals = allMedical.filter((meds) => meds.Type === type);
        setMedicalCenters(updatedMedicals);
    }, [allMedical]);
    
    const [rating,setRating]= useState(0);
    const [type,setType]= useState("");
    

    const RatingChange=(rate)=>{

        setRating(rate);
        const buttons = [4.5,4,3,2,0];
        buttons.forEach((btns)=>{
            const classes= document.querySelector(`.r-${Math.round(btns)}`).classList;
            if (rate===btns){
                console.log(classes);
                classes.add('active-btn');
            }
            else classes.remove('active-btn')
        })
    }

    const TypeChange=(types)=>{
        setType(types);
        if (types==="") types=" ";
        const buttons = ['H', 'S',' '];
        buttons.forEach((btns)=>{
            const classes= document.querySelector(`.t-${btns}`).classList;
            if (types[0]===btns){
                console.log(classes);
                classes.add('active-btn');
            }
            else classes.remove('active-btn')
        })
    }

    const updateForm=(id)=>{
        setUpdateID(id);
        console.log(id);
        var selectedMed= MedicalCenters.filter((meds)=> meds.ID===id);;
        CName.current.value= selectedMed[0].Name;
        CAddress.current.value= selectedMed[0].Address;
        CHotline.current.value= selectedMed[0].Hotline;
        CEmail.current.value= selectedMed[0].Email;
        CRating.current.value= selectedMed[0].Rating;
        CType.current.value= selectedMed[0].Type;
        CSeats.current.value= selectedMed[0].Seats;

    }
    
    const updateMedical=(id)=>{
        const updatedMed= {
            ID : id,
            Name : CName.current.value,
            Address : CAddress.current.value,
            Hotline : CHotline.current.value,
            Email : CEmail.current.value,
            Rating : CRating.current.value,
            Type : CType.current.value,
            Seats : CSeats.current.value
        }
        console.log(updatedMed);
        const updatedMedicals= MedicalCenters.map((meds)=>{
            if (meds.ID===id){
                return updatedMed;
            }
            return meds;
        })
        setMedicalCenters(updatedMedicals);
    }

    useEffect(() => {
        if (rating === 0 && type === "") {
            setMedicalCenters(allMedical);
            return;
        }
        if (rating === 0) {
            filterType(type);
            return;
        }
        if (type === "") {
            filterRating(rating);
            return;
        }
        setMedicalCenters(allMedical.filter((meds) => {
            return (meds.Rating >= rating && meds.Rating < rating + 1) && meds.Type === type;
        }));
    }, [rating, type, allMedical, filterRating, filterType])

    useEffect(() => {
        setFacilityStatus('loading');
        setFacilityError('');
        fetch(`${apiBase}/api/facilities`)
            .then((res) => res.json())
            .then((data) => {
                const hospitals = Array.isArray(data?.hospitals) ? data.hospitals : [];
                const shelters = Array.isArray(data?.shelters) ? data.shelters : [];
                const mapped = [
                    ...hospitals.map((item, index) => ({
                        ID: item._id || `hospital-${index}`,
                        Name: item.name,
                        Address: item.address,
                        Hotline: item.phone,
                        Email: item.email,
                        Rating: item.rating || 4.0,
                        Type: 'Hospital',
                        Seats: item.seats
                    })),
                    ...shelters.map((item, index) => ({
                        ID: item._id || `shelter-${index}`,
                        Name: item.name,
                        Address: item.address,
                        Hotline: item.phone,
                        Email: item.email,
                        Rating: item.rating || 4.0,
                        Type: 'Shelter',
                        Seats: item.seats
                    }))
                ];
                setAllMedical(mapped);
                setMedicalCenters(mapped);
                setFacilityStatus('success');
            })
            .catch((error) => {
                setFacilityStatus('error');
                setFacilityError(error.message);
            });
    }, []);

    useEffect(() => {
        if (!user?.Email) return;
        fetch(`${apiBase}/api/facility-requests?submittedBy=${encodeURIComponent(user.Email)}`)
            .then((res) => res.json())
            .then((data) => setUserRequests(Array.isArray(data?.requests) ? data.requests : []))
            .catch(() => setUserRequests([]));
    }, [user]);

    const submitRequest = async () => {
        setRequestError('');
        setRequestStatus('');
        if (!requestForm.name || !requestForm.address || !requestForm.district || !requestForm.phone || !requestForm.email || !requestForm.seats) {
            setRequestError('Please fill all required fields.');
            return;
        }
        try {
            const response = await fetch(`${apiBase}/api/facility-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...requestForm,
                    submittedBy: user?.Name || user?.Email || 'Guest'
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error || 'Failed to submit request.');
            }
            setRequestStatus('Request submitted. Pending approval.');
            setRequestForm({
                type: 'hospital',
                name: '',
                address: '',
                district: '',
                phone: '',
                email: '',
                seats: '',
                description: ''
            });
            setUserRequests((prev) => [data.request, ...prev]);
            fetch(`${apiBase}/api/facility-requests?submittedBy=${encodeURIComponent(user?.Email || '')}`)
                .then((res) => res.json())
                .then((list) => setUserRequests(Array.isArray(list?.requests) ? list.requests : []));
        } catch (error) {
            setRequestError(error.message);
        }
    };

    const hospitals = MedicalCenters.filter((med) => med.Type === "Hospital");
    const shelters = MedicalCenters.filter((med) => med.Type === "Shelter");

    return (
        <div className="medicals-page">
                <div className="page-header">
                    <h2 className="section-title">Hospitals and Shelters</h2>
                    <p className="section-subtitle">Hospitals: {hospitals.length} • Shelters: {shelters.length}</p>
                </div>
        <div className="filter-box">
            <button className='filter-btn' onClick={()=> setShowFilter(!showFilter)}>Filter</button>

            <div className="filter-options" style={{ display : showFilter ? 'flex' : 'none'}}>
                <div className="rating-filter">
                    <h3>Rating</h3>
                    <button className='r-5' onClick={(e)=> RatingChange(4.5)}>4.5-5</button>
                    <button className='r-4' onClick={()=> RatingChange(4)}>4-5</button>
                    <button className='r-3' onClick={()=> RatingChange(3)}>3-4</button>
                    <button className='r-2' onClick={()=> RatingChange(2)}>2-3</button>
                    <button className='r-0 active-btn' onClick={()=> RatingChange(0)}>Clear</button>
                </div>
                <div className="type-filter">
                    <h3>Type</h3>
                    <button className='t-H' onClick={()=> TypeChange("Hospital")}>Hospital</button>
                    <button className='t-S' onClick={()=> TypeChange("Shelter")}>Shelter</button>
                    <button className='t- active-btn' onClick={()=> TypeChange("")}>Clear</button>
                </div>
            </div>
        </div>

        <form className="update-med" style={{ display : updateMed?"block": "none"}}>
            <input type="text" placeholder="Enter Medical Center ID" readOnly value={updateID} />
            <input type="text" placeholder="Enter Medical Center Name" ref={CName} />
            <input type="text" placeholder="Enter Medical Center Address" ref={CAddress} />
            <input type="text" placeholder="Enter Medical Center Hotline" ref={CHotline} />
            <input type="text" placeholder="Enter Medical Center Email" ref={CEmail} />
            <input type="text" placeholder="Enter Medical Center Rating" ref={CRating} />
            <input type="text" placeholder="Enter Medical Center Type" ref={CType} />
            <input type="number" placeholder="Enter Medical Center Seats" ref={CSeats} />
            <div className="button-row">
              <button type='button' className="secondary" onClick={()=>{
                  setUpdateMed(false);
              }} >Cancel</button>
              <button type='button' onClick={()=> updateMedical(updateID)}>Update</button>
            </div>
        </form>

        <section className="facility-request">
            <div className="request-header">
                <h3>Request a Hospital or Shelter</h3>
                <button type="button" className="filter-btn" onClick={() => setShowRequestForm(!showRequestForm)}>
                    Add Hospital / Shelter Request
                </button>
            </div>
            {showRequestForm && (
                <div className="request-form">
                    <div className="form-item">
                        <label>Type</label>
                        <select value={requestForm.type} onChange={(e) => setRequestForm({ ...requestForm, type: e.target.value })}>
                            <option value="hospital">Hospital</option>
                            <option value="shelter">Shelter</option>
                        </select>
                    </div>
                    <div className="form-item">
                        <label>Name</label>
                        <input value={requestForm.name} onChange={(e) => setRequestForm({ ...requestForm, name: e.target.value })} />
                    </div>
                    <div className="form-item">
                        <label>Address</label>
                        <input value={requestForm.address} onChange={(e) => setRequestForm({ ...requestForm, address: e.target.value })} />
                    </div>
                    <div className="form-item">
                        <label>District / City</label>
                        <input value={requestForm.district} onChange={(e) => setRequestForm({ ...requestForm, district: e.target.value })} />
                    </div>
                    <div className="form-item">
                        <label>Hotline Number</label>
                        <input value={requestForm.phone} onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })} />
                    </div>
                    <div className="form-item">
                        <label>Email</label>
                        <input value={requestForm.email} onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })} />
                    </div>
                    <div className="form-item">
                        <label>Available Beds / Seats</label>
                        <input type="number" value={requestForm.seats} onChange={(e) => setRequestForm({ ...requestForm, seats: e.target.value })} />
                    </div>
                    <div className="form-item span-2">
                        <label>Description</label>
                        <textarea value={requestForm.description} onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })} />
                    </div>
                    {requestError && <div className="form-error">{requestError}</div>}
                    {requestStatus && <div className="form-help">{requestStatus}</div>}
                    <button type="button" className="filter-btn" onClick={submitRequest}>Submit Request</button>
                </div>
            )}
            {userRequests.length > 0 && (
                <div className="request-table">
                    <h4>Your Requests</h4>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>District</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userRequests.map((req) => (
                                <tr key={req._id}>
                                    <td>{req.name}</td>
                                    <td>{req.type}</td>
                                    <td>{req.district}</td>
                                    <td>{req.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
        
                <div className="table-card">
                    <h3 className="table-title">Hospitals</h3>
                    {facilityStatus === 'loading' && <p className="form-help">Loading facilities...</p>}
                    {facilityStatus === 'error' && <p className="form-error">{facilityError}</p>}
                    <table className='data-table'>
                        <thead>
                            <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Hotline</th>
                                    <th>Email</th>
                                    <th>Rating</th>
                                    <th>Seats</th>
                                    {isAdmin? <><th>Update</th> <th>Delete</th></> : ""}
                            </tr>
                        </thead>
                        <tbody>
                            {hospitals.map((meds)=>(
                                    <tr key={meds.ID}>
                                            <td>{meds.ID}</td>
                                            <td onClick={()=> linkMedical(meds.ID)} style={{ cursor : 'pointer'}}>{meds.Name}</td>
                                            <td>{meds.Address}</td>
                                            <td>{meds.Hotline}</td>
                                            <td>{meds.Email}</td>
                                            <td>{meds.Rating}</td>
                                            <td>{meds.Seats}</td>
                                            {
                                                    isAdmin? <>
                                                            <td><button onClick={()=>{
                                                                    setUpdateMed(true);
                                                                    updateForm(meds.ID);
                                                            }}>update</button></td> 
                                                            <td><button className="secondary">Delete</button></td> 
                                                            </>: ""
                                            }
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="table-card">
                    <h3 className="table-title">Shelters</h3>
                    {facilityStatus === 'loading' && <p className="form-help">Loading facilities...</p>}
                    {facilityStatus === 'error' && <p className="form-error">{facilityError}</p>}
                    <table className='data-table'>
                        <thead>
                            <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Hotline</th>
                                    <th>Email</th>
                                    <th>Rating</th>
                                    <th>Seats</th>
                                    {isAdmin? <><th>Update</th> <th>Delete</th></> : ""}
                            </tr>
                        </thead>
                        <tbody>
                            {shelters.map((meds)=>(
                                    <tr key={meds.ID}>
                                            <td>{meds.ID}</td>
                                            <td onClick={()=> linkMedical(meds.ID)} style={{ cursor : 'pointer'}}>{meds.Name}</td>
                                            <td>{meds.Address}</td>
                                            <td>{meds.Hotline}</td>
                                            <td>{meds.Email}</td>
                                            <td>{meds.Rating}</td>
                                            <td>{meds.Seats}</td>
                                            {
                                                    isAdmin? <>
                                                            <td><button onClick={()=>{
                                                                    setUpdateMed(true);
                                                                    updateForm(meds.ID);
                                                            }}>update</button></td> 
                                                            <td><button className="secondary">Delete</button></td> 
                                                            </>: ""
                                            }
                                    </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
    </div>
  )
}
