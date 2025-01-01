import { useParams } from 'react-router-dom'
import { useState ,useEffect} from 'react';
import axios from 'axios';
import Button from '../Button';
import { useNavigate } from 'react-router-dom';

const UpdateForm=()=>{
 const navigate= useNavigate();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

      const [worker, setWorker] = useState({
        name:"",
        username:"",
        phoneNo:"",
        email:"",
        experience:"",
      });
      useEffect(()=>{
         axios.get('/api/v1/worker/current-worker')
          .then((response)=>{
            const worker=response.data.data;
            console.log(worker);
            setWorker(worker);
          })
          .catch((error)=>{
            console.error(error);
          })
    
      },[])

      const handleChange=(e)=>{
        setWorker({...worker,[e.target.name]: e.target.value})
      }

      const handleSubmit=(e)=>{
        e.preventDefault();
        setUpdating(true);
        axios.patch(`/api/v1/worker/update/${worker._id}`, worker)
        .then(()=>{
          setUpdating(false);
          setError('');
          navigate('/profile');
        })
        .catch(() => {
          setError('Failed to update worker data.');
          setUpdating(false);
        });
      }
      
    return(
        <>
        <form onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col shadow-lg rounded-lg p-6 w-190 justify-start ">
            <div className="text-3xl mb-3">
                EDIT FORM
            </div>
          
          <div className="mb-3">
          <label htmlFor="name" className="form-label ">
            Name
          </label>
          <input
            type="text"
            className="form-control ml-12 border "
            id="name"
            name="name"
            value={worker.name}
            onChange={handleChange}
          />
        </div>
          <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control ml-5 border"
            id="username"
            name="username"
            value={worker.username}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3 ">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control ml-12 border"
            id="email"
            name="email"
            value={worker.email}
            onChange={handleChange}
            
          />
        </div>
        <div className="mb-3">
          <label htmlFor="pwd" className="form-label mr-5">
            Phone
          </label>
          <input
            type="text"
            className="form-control ml-5 border"
            id="phone"
            name="phoneNo"
            value={worker.phoneNo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label ">
            Experience
          </label>
          <input
            type="text"
            className="form-control ml-3 border"
            id="experience"
            name="experience"
            value={worker.experience}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label mr-5">
            Language
          </label>
          <input
            type="text"
            className="form-control  border"
            id="language"
            value={worker.language ? worker.language.join(', ') : ''} 
    onChange={(e) =>
      setWorker({ ...worker, language: e.target.value.split(',').map(lang => lang.trim()) })} 
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="text" className="form-label mr-5">
            Services
          </label>
          <input
            type="text"
            className="form-control  border"
            id="services"
            value={worker.services ? worker.services.join(', ') : ''} 
    onChange={(e) =>
      setWorker({ ...worker, services: e.target.value.split(',').map(services => services.trim()) })} 
            required
          />
        </div>
         <div className="flex justify-center">
              <Button
              type="submit"
                disabled={updating} 
                className="mt-5 p-4 text-white"
            >
              submit
              </Button>
                           
            </div>
          </div>
          </div>
          </form>
        </>
    );
};

export default UpdateForm;